"""Voice + word timings for a style test: python -m bot.concept_voice "text" """
import json
import sys

from . import config, tts

out = config.ROOT / "video" / "public" / "kit" / "test"
out.mkdir(parents=True, exist_ok=True)
words = tts.synthesize(sys.argv[1], out / "voice.mp3")
dur = tts.duration(out / "voice.mp3")
(out / "words.json").write_text(json.dumps({"dur": dur, "words": words}))
print("voice", dur, len(words))
