"""Voice-only job: render one script with ElevenLabs (+ word timings) for a HyperFrames test.

Output (pushed to the `videos` branch by the Voice samples workflow):
  out/voice-samples/<NAME>.mp3   the voiceover
  out/voice-samples/<NAME>.json  word timings [{word, start, end}]
"""
import json
from pathlib import Path

from . import tts

NAME = "rea-v2"
LINE = ("Ever seen a feature in an app and wondered how they built it? "
        "Your AI agent can now look inside and show you. "
        "It's called REA. It works with Claude Code, Codex and Cursor, "
        "and it reads desktop apps, websites and Android APKs, no source code needed. "
        "One showcase rebuilt the sound math from DX-Ball and passed all 3,205 checks. "
        "Free, open source, runs locally. "
        "Only use it on apps you're allowed to analyze. "
        "Comment REA and I'll send you the link.")

out = Path("out/voice-samples")
out.mkdir(parents=True, exist_ok=True)
mp3 = out / f"{NAME}.mp3"
words = tts.synthesize(LINE, mp3)
(out / f"{NAME}.json").write_text(json.dumps(words, indent=1))
print("VOICE OK", f"{tts.duration(mp3):.1f}s", len(words), "words")
