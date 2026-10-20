"""Telegram: send each new video to Jan for approval (✅ post / ❌ skip).

Button presses are read later by the posting job (polling getUpdates), so no server needed.
"""
import json
import os

import requests

from . import config

STATE = config.DATA / "telegram.json"


def _api(method, **kw):
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    r = requests.post(f"https://api.telegram.org/bot{token}/{method}", timeout=120, **kw)
    data = r.json()
    if not data.get("ok"):
        raise RuntimeError(f"Telegram {method}: {data}")
    return data["result"]


def _state():
    return json.loads(STATE.read_text()) if STATE.exists() else {}


def _save(st):
    STATE.write_text(json.dumps(st, indent=2))


def chat_id():
    """Jan's chat id: learned from the /start message he sent to the bot."""
    st = _state()
    if st.get("chat_id"):
        return st["chat_id"]
    for u in _api("getUpdates", data={"timeout": 0}):
        msg = u.get("message") or {}
        if msg.get("chat", {}).get("type") == "private":
            st["chat_id"] = msg["chat"]["id"]
            _save(st)
            return st["chat_id"]
    raise RuntimeError("No chat found - send /start to the bot in Telegram first")


def enabled():
    return bool(os.getenv("TELEGRAM_BOT_TOKEN"))


def _manychat(meta: dict) -> str:
    """Ready-to-paste ManyChat texts: comment reply, follow check, DM with the link."""
    import random
    kw, tool, url = meta.get("keyword", ""), meta["tool_name"], meta["url"]
    rnd = random.Random(meta.get("created", tool))
    reply = rnd.choice(["Sent it to your DMs 📩", "Check your DMs 👀", "Just sent it over 📬"])
    gate = rnd.choice([
        "Oops, looks like you're not following me yet 👀 Hit follow and tap the button below, I'll send it right over 🙌",
        "Almost there! Give me a quick follow, then tap below and the link is yours 🔓",
        "Hey! Follow me real quick and tap the button, then I'll send you the link 😉",
    ])
    dm = rnd.choice([
        f"Here you go 🙌 {tool}: {url}\nMore tools like this every day here 🦝",
        f"As promised 👇 {tool}: {url}\nThanks for the follow, more free finds coming 🦝",
    ])
    return ("ManyChat (zkopíruj):\n"
            f"🔑 Keyword: {kw}\n"
            f"💬 Odpověď na komentář: {reply}\n"
            f"🔒 Když nesleduje (Follow check): {gate}\n"
            f"   Tlačítko: I followed ✅\n"
            f"📩 DM s odkazem: {dm}")


def send_for_approval(folder, meta: dict, caption: str):
    cid = chat_id()
    name = folder.name
    text = (f"🎬 Nový video: {meta['tool_name']}  ({meta.get('duration', '?')} s)\n"
            f"📝 Co to je: {meta.get('summary_cs') or '-'}\n"
            f"🔗 {meta['url']}\n\n"
            f"{_manychat(meta)}\n\n"
            f"Popisek (angličtina, jde na IG):\n{caption[:500]}\n\n"
            f"✅ = naplánuju na Instagram/TikTok, ❌ = zahodím")
    kb = {"inline_keyboard": [[
        {"text": "✅ Postnout", "callback_data": f"ok:{name}"[:64]},
        {"text": "❌ Zahodit", "callback_data": f"no:{name}"[:64]},
    ]]}
    with open(folder / "video.mp4", "rb") as f:
        _api("sendVideo", data={"chat_id": cid, "caption": text[:1020],
                                "supports_streaming": "true", "reply_markup": json.dumps(kb)},
             files={"video": f})
    print(f"[telegram] sent {name} for approval")
    if len(text) > 1020:  # caption got cut -> send the full text (ManyChat + popisek) separately
        try:
            _api("sendMessage", data={"chat_id": cid, "text": text[:4000], "disable_web_page_preview": "true"})
        except Exception as e:
            print(f"[telegram] full text failed: {e}")
    if os.getenv("GITHUB_RUN_ID"):  # remember where the poster can download the video
        pend_path = config.DATA / "pending.json"
        pend = json.loads(pend_path.read_text()) if pend_path.exists() else {}
        pend[name] = {"run_id": os.environ["GITHUB_RUN_ID"],
                      "artifact": f"videos-{os.environ.get('GITHUB_RUN_NUMBER', '')}"}
        pend_path.write_text(json.dumps(pend, indent=2))


def notify(text: str):
    try:
        _api("sendMessage", data={"chat_id": chat_id(), "text": text[:4000]})
    except Exception as e:
        print(f"[telegram] notify failed: {e}")


def send_pick_list(category: str, items: list):
    if not items:
        notify("Dnes jsem nenašel nic dost dobrýho (skóre 7+). Zkusím to zase zítra.")
        return
    lines = [f"☀️ Dnešní kandidáti (kategorie: {category})", ""]
    kb = []
    for i, it in enumerate(items):
        lines.append(f"{i + 1}. {it['name'][:50]}  ⭐{it['score']:.0f}  [{it['angle']}]")
        lines.append(f"   {it['why']}")
        lines.append(f"   {it['url']}")
        kb.append([{"text": f"🎬 Udělat {i + 1}: {it['name'][:30]}", "callback_data": f"mk:{i}"}])
    lines += ["", "Ťukni, co mám udělat (klidně 2). Když nic nevybereš, v 11:00 a 17:00 "
              "udělám ty nejlepší sám."]
    _api("sendMessage", data={"chat_id": chat_id(), "text": "\n".join(lines)[:4000],
                              "disable_web_page_preview": "true",
                              "reply_markup": json.dumps({"inline_keyboard": kb})})
