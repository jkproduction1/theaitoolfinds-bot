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
SLOTS = [s.strip() for s in os.getenv("POST_SLOTS", "08:00,15:00,21:00").split(",")]


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


def instagram_account() -> dict:
    """The connected Instagram account object (has _id + profileId)."""
    data = _z("GET", "/accounts")
    accounts = data.get("accounts") or data.get("data") or (data if isinstance(data, list) else [])
    for a in accounts:
        if a.get("platform") == "instagram":
            return a
    raise RuntimeError("No Instagram account in Zernio")


# Comment-to-DM texts (Jan, 2026-11-08: "more natural, don't look like a bot").
# Zernio takes 1 main text + up to 5 variations per automation and picks one at random per comment,
# so every post draws its own 6 from these bigger pools (seeded by the post id) -> neighbouring posts
# don't share the same set either. {tool} = tool_name, {kw} = the keyword. Keep them short, casual, varied.
REPLY_POOL = [
    "sent 🙌", "check your DMs!", "just sent it 📩", "it's in your inbox", "done, check DMs 👀",
    "on its way 🚀", "sent you a message!", "you've got mail 📬", "DM'd you 🙌", "there you go, check DMs",
    "just messaged you", "sent! enjoy 😄", "check your requests if you don't see it", "in your DMs now ✌️",
    "sent it over!", "got you 🙌 check DMs", "done ✅", "messaged you!", "sent, have fun with it",
    "it's in your DMs 🔥", "sending now 📩", "dropped it in your DMs", "check inbox 👀", "sent 🫡",
]
DM_POOL = [
    "Here you go 🙌 everything for {kw} is below 👇",
    "Hey! Here's the {kw} stuff you asked for 👇",
    "As promised 👇 Have fun with it!",
    "Here it is! Let me know what you make with it 🙌",
    "Hey 👋 here's the link. Enjoy!",
    "Here it is 👇 tag me if you try it!",
    "Here you go! New one drops every day btw 🦝",
    "There you go 🚀 hope it helps",
    "Hey, thanks for the comment! Here it is 👇",
    "Sent 🙌 here's everything for {kw}",
    "Here's the link! Any questions, just reply here",
    "Got it 👇 enjoy and thanks for watching!",
]
BUTTON_POOL = ["Open it", "Get it here", "Open the link", "Take me there", "Let's go", "Show me"]
GATE_POOL = [
    {"message": "Hey! 👋 Tap the button and I'll send it right over", "buttonLabel": "Send it",
     "notFollowingMessage": "Looks like you're not following yet 👀 hit follow and tap the button again, then it's yours"},
    {"message": "Hey 🙌 quick tap below and the link is yours", "buttonLabel": "Send me the link",
     "notFollowingMessage": "Almost! Follow the account first, then tap again and I'll send it 🙌"},
    {"message": "Thanks for the comment! Tap below and I'll send it 👇", "buttonLabel": "Yes please",
     "notFollowingMessage": "Oops, I can only send it to followers 😅 follow, then tap the button again"},
    {"message": "Hey! Tap here and it's on its way 🚀", "buttonLabel": "Send it over",
     "notFollowingMessage": "You're not following yet 👀 follow and tap again, takes 2 seconds"},
]
FOLLOW_GATE = GATE_POOL[0]  # kept for autodm_debug.py


def auto_dm(post_id: str, meta: dict, platform_post_id: str | None = None) -> str:
    """Comment-to-DM for this post (Instagram, via Zernio = official Meta private replies).
    Keyword = tool name. Follow gate: unknown followers get a confirm DM first."""
    import random
    acc = instagram_account()
    prof = acc.get("profileId")
    prof = prof.get("_id") if isinstance(prof, dict) else prof
    kw, tool, url = meta["keyword"], meta["tool_name"], meta["url"]
    rnd = random.Random(post_id)
    dms = [t.format(tool=tool, kw=kw) for t in rnd.sample(DM_POOL, 6)]
    replies = rnd.sample(REPLY_POOL, 6)
    dm_delay = rnd.randint(25, 90)  # Zernio delays are fixed per automation, so vary them per post
    body = {
        "profileId": prof, "accountId": acc.get("_id") or acc.get("id"),
        **({"platformPostId": platform_post_id} if platform_post_id else {"postId": post_id}),
        "postTitle": tool[:80], "name": f"{tool} ({kw})",
        "trigger": "comment", "keywords": [kw, kw.lower()], "matchMode": "word", "typoTolerance": True,
        "alsoMatchInDms": True,
        "dmMessage": dms[0], "dmMessageVariations": dms[1:],
        "buttons": [{"type": "url", "title": rnd.choice(BUTTON_POOL)[:20], "url": url}],
        "commentReply": replies[0], "commentReplyVariations": replies[1:],
        "actions": {"likeComment": True},
        "audience": {"followerStatus": "follower", "whenUnknown": "verify"},
        "followGate": rnd.choice(GATE_POOL),
        "dmDelaySeconds": dm_delay,
        "commentReplyDelaySeconds": dm_delay + rnd.randint(20, 120),
    }
    res = _z("POST", "/comment-automations", json=body)
    return (res.get("automation") or res).get("_id") or (res.get("automation") or res).get("id") or "ok"


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
    extra = config.DATA / "extra_slots.json"  # one-off slots, e.g. ["2026-10-24T19:00:00+02:00"]
    if extra.exists():
        for s in sorted(json.loads(extra.read_text())):
            t = datetime.fromisoformat(s)
            if t > now and t.isoformat() not in taken:
                return t
    for day in range(0, 14):
        d = (now + timedelta(days=day)).date()
        for s in SLOTS:
            h, m = (int(x) for x in s.split(":"))
            t = datetime(d.year, d.month, d.day, h, m, tzinfo=TZ)
            if t > now and t.isoformat() not in taken:
                return t
    return now


def schedule(folder: Path, when: datetime, trial: bool = False) -> dict:
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
        if trial:  # Trial Reel: shown to non-followers first, IG shares it to followers if it performs
            psd["trialParams"] = {"graduationStrategy": "SS_PERFORMANCE"}
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


def dispatch_mode(mode: str):
    repo = os.environ["GITHUB_REPOSITORY"]
    r = requests.post(
        f"https://api.github.com/repos/{repo}/actions/workflows/make-video.yml/dispatches",
        headers={"Authorization": f"Bearer {os.environ['GH_TOKEN']}",
                 "Accept": "application/vnd.github+json"},
        json={"ref": "main", "inputs": {"mode": mode}}, timeout=30)
    if r.status_code >= 300:
        raise RuntimeError(f"dispatch HTTP {r.status_code}: {r.text[:200]}")


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
    if not info.get("run_id"):  # HyperFrames videos: made in a Claude session, stored only on `videos`
        dest.mkdir(parents=True, exist_ok=True)
        subprocess.run(["git", "fetch", "-q", "origin", "+videos:refs/remotes/origin/videos"], check=True)
        for f in ("video.mp4", "cover.jpg", "caption.txt", "meta.json"):
            r = subprocess.run(["git", "show", f"origin/videos:{name}/{f}"], capture_output=True)
            if r.returncode == 0:
                (dest / f).write_bytes(r.stdout)
    else:
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
    queue = sorted((config.DATA / "tg_queue").glob("*.b64")) if (config.DATA / "tg_queue").exists() else []
    if queue or os.getenv("TG_UPDATE"):  # pushed by the Cloudflare worker (webhook mode), saved in data/tg_queue/
        import base64
        updates = [json.loads(base64.b64decode(f.read_text()).decode()) for f in queue]
        if os.getenv("TG_UPDATE"):
            updates.append(json.loads(base64.b64decode(os.environ["TG_UPDATE"]).decode()))
        seen_ids, uniq = set(), []
        for u in sorted(updates, key=lambda u: u.get("update_id", 0)):
            if u.get("update_id") not in seen_ids:
                seen_ids.add(u.get("update_id")); uniq.append(u)
        updates = uniq
        for f in queue:
            f.unlink()
    else:
        try:
            updates = telegram._api("getUpdates", data={"offset": st.get("offset", 0), "timeout": 0,
                                                        "allowed_updates": json.dumps(["callback_query", "message"])})
        except RuntimeError as e:  # 409 = webhook is set, updates come from the worker
            print(f"[poster] no polling: {str(e)[:80]}")
            updates = []
    for u in updates:
        st["offset"] = u["update_id"] + 1
        m = u.get("message") or {}
        if m.get("chat", {}).get("type") == "private" and not st.get("chat_id"):
            st["chat_id"] = m["chat"]["id"]
            telegram._save(st)
            telegram.notify("🤖 Bot je připojenej! Sem ti budou chodit videa ke schválení.")
        text = (m.get("text") or "").strip().lower().lstrip("/")
        if text in ("návrhy", "navrhy", "navrh", "návrh", "ideas", "napady", "nápady"):
            try:
                dispatch_mode("picklist")
                telegram.notify("🔎 Hledám návrhy, za pár minut je máš tady.")
            except Exception as e:
                telegram.notify(f"⚠️ Návrhy se nepovedly: {str(e)[:200]}")
            continue
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
                # the Claude "brain" session reads picks["picked"] and makes these first
                picks.setdefault("picked", []).append(item["url"])
                (config.DATA / "picks.json").write_text(json.dumps(picks, indent=2))
                telegram.notify(f"🎬 Zapsáno: {item['name']}. Udělám ho v ranním kole (zítra kolem 5–7 h, posty 8/15/21), "
                                "nebo hned, když mi v Claude napíšeš „udělej“.")
            except Exception as e:
                telegram.notify(f"⚠️ Nepovedlo se spustit video: {str(e)[:200]}")
            continue
        info = pending.pop(name, None)
        if action == "no":
            clear_buttons()
            telegram.notify(f"❌ Zahozeno: {name}")
            continue
        if action not in ("ok", "tr"):
            continue
        if not info:
            telegram.notify(f"⚠️ {name}: nenašel jsem video (možná už je postnuté).")
            continue
        try:
            folder = fetch_video(name, info)
            when = next_slot(taken)
            res = schedule(folder, when, trial=action == "tr")
            taken.add(when.isoformat())
            posted.append({"name": name, "when": when.isoformat(),
                           "post_id": (res.get("post") or {}).get("_id")})
            clear_buttons()
            where = " + ".join(x.capitalize() for x in res.get("_platforms", ["instagram"]))
            dm_note = ""
            pid = (res.get("post") or {}).get("_id")
            if pid and "instagram" in res.get("_platforms", []):
                try:
                    meta = json.loads((folder / "meta.json").read_text())
                    auto_dm(pid, meta)
                    dm_note = f"\n🤖 Auto-DM zapnutej: keyword {meta['keyword']} (s kontrolou followu)"
                except Exception as e:
                    dm_note = f"\n⚠️ Auto-DM se nepovedl: {str(e)[:200]}"
            kind = "🧪 Trial reel (IG jen pro nefollowery)" if action == "tr" else "✅ Naplánováno"
            telegram.notify(f"{kind} ({where}): {when:%d.%m. %H:%M}\n{name}{dm_note}")
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
