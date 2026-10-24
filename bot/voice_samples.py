"""Voice job for HyperFrames videos: render every script in data/voice_queue.json with ElevenLabs.

data/voice_queue.json = [{"name": "opencode", "text": "..."}, ...]
Output (pushed to the `videos` branch by the "Voice samples" workflow):
  voice-samples/<name>.mp3   the voiceover
  voice-samples/<name>.json  word timings [{word, start, end}]
"""
import json
from pathlib import Path

from . import config, tts

out = Path("out/voice-samples")
out.mkdir(parents=True, exist_ok=True)
queue = json.loads((config.DATA / "voice_queue.json").read_text())
for job in queue:
    mp3 = out / f"{job['name']}.mp3"
    try:
        words = tts.synthesize(job["text"], mp3)
        (out / f"{job['name']}.json").write_text(json.dumps(words, indent=1))
        print("VOICE OK", job["name"], f"{tts.duration(mp3):.1f}s", len(words), "words")
    except Exception as e:
        print("VOICE FAILED", job["name"], str(e)[:300])
