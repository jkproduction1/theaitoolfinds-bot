"""Render the same line with several Kokoro voices so you can pick one."""
import os
from pathlib import Path

from . import tts

LINE = ("Stop scrolling. This free AI tool just replaced three apps on my laptop. "
        "You drop in one photo, and it builds a full 3D model in about ten seconds. "
        "No account, no credit card, it runs right in your browser. Comment 3D and I will send you the link.")
OLD = ("Watch what happens when you point Claude Code at any PC game you own. "
        "This free AI tool turns one photo into a full three sixty camera spin. "
        "It runs right in your browser, and you do not need to pay for anything. "
        "Comment ORBIT and I will send you the link.")

out = Path("out/voice-samples")
out.mkdir(parents=True, exist_ok=True)
for v in []:
    os.environ["KOKORO_VOICE"] = v
    tts._kokoro(LINE, out / f"{v}.mp3")
    (out / f"{v}.wav").unlink(missing_ok=True)
    print("done", v)


for st in ["0.3", "0.45", "0.6"]:
    os.environ["EL_STABILITY"] = st
    try:
        w = tts._elevenlabs(LINE, out / f"el_stab{st}.mp3")
        print("EL OK", st, f"{tts.duration(out / f'el_stab{st}.mp3'):.1f}s", w[:3])
    except Exception as e:
        print("EL FAILED", st, str(e)[:300])
