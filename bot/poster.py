"""Runs every 30 min: reads Jan's ✅ / ❌ taps in Telegram and schedules approved videos
on Instagram through Zernio (no Facebook account needed on our side).

Video files come from the GitHub Actions artifact of the run that made them.
"""
import json
import os
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

import requests

from . import config, telegram

ZERNIO = "https://zernio.com/api/v1"
PENDING = config.DATA / "pending.json"
POSTED = config.DATA / "posted.json"
TZ = ZoneInfo(os.getenv("POST_TIMEZONE", "Europe/Prague"))
# Prague times = good for an English (EU + US morning) audience. Change freely.
SLOTS = [s.strip() for s in os.getenv("POST_SLOTS", "15:00,21:00").split(",")]


def _load(p, default):
    return json.loads(p.read_text()) if p.exists() else default


def _save(p, data):
    p.write_text(json.dumps(data, indent=2, ensure_ascii=False))


# ---------------------------------------------------------------- Zernio
def _z(method, path, **kw):
    r = requests.request(method, ZERNIO + path, timeout=120, headers={
        "Authorization": f"Bearer {os.environ['ZERNIO_API_KEY']}",
        "Content-Type": "application/json"}, **kw)
    if r.status_code >= 400:
        raise RuntimeError(f"Zernio {path} HTTP {r.status_code}: {r.text[:300]}")
    return r.json() if r.text else {}


def account_ids() -> dict:
    """{"instagram": id, "tiktok": id} for every account connected in Zernio."""
    data = _z("GET", "/accounts")
    accounts = data.get("accounts") or data.get("data") or (data if isinstance(data, list) else [])
    out = {}
    for a in accounts:
        if a.get("platform") in ("instagram", "tiktok") and a.get("platform") not in out:
            out[a["platform"]] = a.get("_id") or a.get("id")
    if not out:
        raise RuntimeError(f"No Instagram/TikTok account connected in Zernio: {str(data)[:200]}")
    return out


def upload(path: Path, ctype: str) -> str:
    pre = _z("POST", "/media/presign", json={"filename": path.name, "contentType": ctype,
                                            "size": path.stat().st_size})
    with open(path, "rb") as f:
        r = requests.put(pre["uploadUrl"], data=f, headers={"Content-Type": ctype}, timeout=300)
    r.raise_for_status()
    return pre["publicUrl"]


def next_slot(taken: set) -> datetime:
    if os.getenv("POST_NOW") == "true":  # manual run: publish right away
        return datetime.now(TZ) + timedelta(minutes=3)
    now = datetime.now(TZ) + timedelta(minutes=20)
    for day in range(0, 14):
        d = (now + timedelta(days=day)).date()
        for s in SLOTS:
            h, m = (int(x) for x in s.split(":"))
            t = datetime(d.year, d.month, d.day, h, m, tzinfo=TZ)
            if t > now and t.isoformat() not in taken:
                return t
    return now


def schedule(folder: Path, when: datetime) -> dict:
    caption = (folder / "caption.txt").read_text(encoding="utf-8")[:2200]
    video_url = upload(folder / "video.mp4", "video/mp4")
    cover = upload(folder / "cover.jpg", "image/jpeg") if (folder / "cover.jpg").exists() else None
    ids = account_ids()
    platforms = []
    body = {"content": caption, "mediaItems": [{"type": "video", "url": video_url}],
            "scheduledFor": when.isoformat()}
    if "instagram" in ids:
        psd = {"shareToFeed": True}
        if cover:
            psd["instagramThumbnail"] = cover
        platforms.append({"platform": "instagram", "accountId": ids["instagram"],
                          "platformSpecificData": psd})
    if "tiktok" in ids:
        platforms.append({"platform": "tiktok", "accountId": ids["tiktok"]})
        body["tiktokSettings"] = {
            "privacy_level": "PUBLIC_TO_EVERYONE", "allow_comment": True,
            "allow_duet": True, "allow_stitch": True,
            "video_made_with_ai": True,          # honest AI disclosure (AI voice + visuals)
            "commercialContentType": "none",     # free promo; paid deals -> "brand_content"
            "content_preview_confirmed": True, "express_consent_given": True,
            **({"video_cover_image_url": cover} if cover else {}),
        }
    body["platforms"] = platforms
    res = _z("POST", "/posts", json=body)
    res["_platforms"] = list(ids)
    return res


def dispatch_video(url: str):
    repo = os.environ["GITHUB_REPOSITORY"]
    r = requests.post(
        f"https://api.github.com/repos/{repo}/actions/workflows/make-video.yml/dispatches",
        headers={"Authorization": f"Bearer {os.environ['GH_TOKEN']}",
                 "Accept": "application/vnd.github+json"},
        json={"ref": "main", "inputs": {"url": url}}, timeout=30)
    if r.status_code >= 300:
        raise RuntimeError(f"dispatch HTTP {r.status_code}: {r.text[:200]}")


# ---------------------------------------------------------------- artifacts
def fetch_video(name: str, info: dict) -> Path:
    dest = Path("dl") / name
    if (dest / "video.mp4").exists():
        return dest
    Path("dl").mkdir(exist_ok=True)
    subprocess.run(["gh", "run", "download", str(info["run_id"]), "-n", info["artifact"],
                    "-D", "dl"], check=True)
    if not (dest / "video.mp4").exists():
        raise RuntimeError(f"video {name} not in artifact {info['artifact']}")
    return dest


# ---------------------------------------------------------------- main loop
def main():
    st = telegram._state()
    pending = _load(PENDING, {})
    posted = _load(POSTED, [])
    taken = {p["when"] for p in posted if p.get("when")}
    updates = telegram._api("getUpdates", data={"offset": st.get("offset", 0), "timeout": 0,
                                                "allowed_updates": json.dumps(["callback_query",
                                                                               "message"])})
    for u in updates:
        st["offset"] = u["update_id"] + 1
        m = u.get("message") or {}
        if m.get("chat", {}).get("type") == "private" and not st.get("chat_id"):
            st["chat_id"] = m["chat"]["id"]
            telegram._save(st)
            telegram.notify("🤖 Bot je připojenej! Sem ti budou chodit videa ke schválení.")
        cq = u.get("callback_query")
        if not cq:
            continue
        action, _, name = (cq.get("data") or "").partition(":")
        try:
            telegram._api("answerCallbackQuery", data={"callback_query_id": cq["id"]})
        except Exception:
            pass
        msg = cq.get("message") or {}

        def clear_buttons():  # so it can't be pressed twice
            try:
                telegram._api("editMessageReplyMarkup", data={
                    "chat_id": msg["chat"]["id"], "message_id": msg["message_id"],
                    "reply_markup": json.dumps({"inline_keyboard": []})})
            except Exception:
                pass

        if action == "mk":  # morning list: Jan picked a tool -> start the video job
            try:
                picks = json.loads((config.DATA / "picks.json").read_text())
                item = picks["items"][int(name)]
                if item["url"] in picks.get("picked", []):
                    continue
                dispatch_video(item["url"])
                picks.setdefault("picked", []).append(item["url"])
                (config.DATA / "picks.json").write_text(json.dumps(picks, indent=2))
                telegram.notify(f"🎬 Dělám video: {item['name']} (cca 8 min)")
            except Exception as e:
                telegram.notify(f"⚠️ Nepovedlo se spustit video: {str(e)[:200]}")
            continue
        info = pending.pop(name, None)
        if action == "no":
            clear_buttons()
            telegram.notify(f"❌ Zahozeno: {name}")
            continue
        if action != "ok":
            continue
        if not info:
            telegram.notify(f"⚠️ {name}: nenašel jsem video (možná už je postnuté).")
            continue
        try:
            folder = fetch_video(name, info)
            when = next_slot(taken)
            res = schedule(folder, when)
            taken.add(when.isoformat())
            posted.append({"name": name, "when": when.isoformat(),
                           "post_id": (res.get("post") or {}).get("_id")})
            clear_buttons()
            where = " + ".join(x.capitalize() for x in res.get("_platforms", ["instagram"]))
            telegram.notify(f"✅ Naplánováno ({where}): {when:%d.%m. %H:%M}\n{name}")
        except Exception as e:
            pending[name] = info  # keep it, so the next run can retry
            telegram.notify(f"⚠️ Postování selhalo ({name}): {str(e)[:300]}\n"
                            "Tlačítka nechávám, zkus ✅ znovu za chvíli.")
            print(f"[poster] {name} failed: {e}")
    telegram._save(st)
    _save(PENDING, pending)
    _save(POSTED, posted)


if __name__ == "__main__":
    main()
