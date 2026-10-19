"""Free voiceover with Microsoft Edge TTS. Also returns exact word timings,
which we use for word-by-word subtitles (no Whisper needed)."""
import asyncio
import os
import subprocess
from pathlib import Path

from . import config


async def _edge(text: str, mp3: Path):
    import edge_tts

    comm = edge_tts.Communicate(text, config.VOICE, rate=config.VOICE_RATE,
                                boundary="WordBoundary")
    words, audio = [], bytearray()
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            start = chunk["offset"] / 1e7
            words.append({"word": chunk["text"], "start": start,
                          "end": start + chunk["duration"] / 1e7})
    mp3.write_bytes(bytes(audio))
    return words


def _offline(text: str, mp3: Path):
    """Local testing without internet: silent audio with estimated timings."""
    words, t = [], 0.2
    for w in text.split():
        d = 0.18 + 0.045 * len(w)
        words.append({"word": w.strip(".,!?:;"), "start": t, "end": t + d})
        t += d + (0.25 if w[-1] in ".,!?" else 0.04)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i",
                    "anullsrc=r=24000:cl=mono", "-t", f"{t + 0.2:.2f}", str(mp3)], check=True)
    return words


def synthesize(text: str, mp3: Path) -> list[dict]:
    if os.getenv("TTS_OFFLINE") == "1":
        return _offline(text, mp3)
    words = asyncio.run(_edge(text, mp3))
    if not words:
        raise RuntimeError("TTS returned no word timings")
    return words


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
         "default=nw=1:nk=1", str(path)], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())
