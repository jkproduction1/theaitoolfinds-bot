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


def instagram_account_id():
    if os.getenv("ZERNIO_ACCOUNT_ID"):
        return os.environ["ZERNIO_ACCOUNT_ID"]
    data = _z("GET", "/accounts")
    accounts = data.get("accounts") or data.get("data") or (data if isinstance(data, list) else [])
    for a in accounts:
        if a.get("platform") == "instagram":
            return a.get("_id") or a.get("id")
    raise RuntimeError(f"No Instagram account connected in Zernio: {str(data)[:200]}")


def upload(path: Path, ctype: str) -> str:
    pre = _z("POST", "/media/presign", json={"filename": path.name, "contentType": ctype,
                                            "size": path.stat().st_size})
    with open(path, "rb") as f:
        r = requests.put(pre["uploadUrl"], data=f, headers={"Content-Type": ctype}, timeout=300)
    r.raise_for_status()
    return pre["publicUrl"]


def next_slot(taken: set) -> datetime:
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
    psd = {"shareToFeed": True}
    if (folder / "cover.jpg").exists():
        psd["instagramThumbnail"] = upload(folder / "cover.jpg", "image/jpeg")
    res = _z("POST", "/posts", json={
        "content": caption,
        "mediaItems": [{"type": "video", "url": video_url}],
        "platforms": [{"platform": "instagram", "accountId": instagram_account_id(),
                       "platformSpecificData": psd}],
        "scheduledFor": when.isoformat(),
    })
    return res


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
            telegram.notify(f"✅ Naplánováno na Instagram: {when:%d.%m. %H:%M}\n{name}")
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
