"""Render the same line with several Kokoro voices so you can pick one."""
import os
from pathlib import Path

from . import tts

LINE = ("This free AI tool turns one photo into a full three sixty camera spin. "
        "It runs right in your browser, and you do not need to pay for anything. "
        "Comment ORBIT and I will send you the link.")

out = Path("out/voice-samples")
out.mkdir(parents=True, exist_ok=True)
for v in ["am_michael", "am_fenrir", "am_puck", "am_echo", "af_heart", "af_bella"]:
    os.environ["KOKORO_VOICE"] = v
    tts._kokoro(LINE, out / f"{v}.mp3")
    (out / f"{v}.wav").unlink(missing_ok=True)
    print("done", v)
