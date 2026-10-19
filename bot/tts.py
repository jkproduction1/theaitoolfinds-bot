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


def _elevenlabs(text: str, mp3: Path):
    """ElevenLabs with timestamps -> convert character timings to word timings."""
    import base64
    import requests

    voice = os.getenv("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")  # "Adam"
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps",
        params={"output_format": "mp3_44100_128"},
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]},
        json={"text": text,
              "model_id": os.getenv("ELEVENLABS_MODEL", "eleven_multilingual_v2"),
              "voice_settings": {"stability": 0.45, "similarity_boost": 0.8,
                                 "style": 0.25, "use_speaker_boost": True}},
        timeout=120,
    )
    if r.status_code >= 400:
        raise RuntimeError(f"ElevenLabs HTTP {r.status_code}: {r.text[:200]}")
    data = r.json()
    mp3.write_bytes(base64.b64decode(data["audio_base64"]))
    al = data.get("alignment") or data.get("normalized_alignment")
    words, cur, start, end = [], "", None, 0.0
    for ch, s0, s1 in zip(al["characters"], al["character_start_times_seconds"],
                          al["character_end_times_seconds"]):
        if ch.isspace():
            if cur:
                words.append({"word": cur.strip(".,!?:;\"'"), "start": start, "end": end})
            cur, start = "", None
            continue
        if start is None:
            start = s0
        cur += ch
        end = s1
    if cur:
        words.append({"word": cur.strip(".,!?:;\"'"), "start": start, "end": end})
    return [w for w in words if w["word"]]


_KOKORO = None


def _tighten(audio, words, sr, max_gap=0.12, max_sentence_gap=0.28):
    """Cut long silences between words (Kokoro pauses a lot) and shift the timings."""
    import numpy as np

    keep, out_words, cursor, removed = [], [], 0, 0.0
    for i, w in enumerate(words):
        nxt = words[i + 1] if i + 1 < len(words) else None
        out_words.append({**w, "start": w["start"] - removed, "end": w["end"] - removed})
        if not nxt:
            continue
        gap = nxt["start"] - w["end"]
        limit = max_sentence_gap if w.get("stop") else max_gap
        if gap > limit + 0.04:
            cut_from = int((w["end"] + 0.07) * sr)          # keep the word's tail
            cut_to = int((nxt["start"] - (limit - 0.07)) * sr)
            if cut_to > cut_from:
                keep.append(audio[cursor:cut_from])
                cursor = cut_to
                removed += (cut_to - cut_from) / sr
    keep.append(audio[cursor:])
    return np.concatenate(keep), out_words


def _kokoro(text: str, mp3: Path):
    """Kokoro-82M: free, open-source (Apache 2.0) neural voice, runs on CPU.
    Whole script in one pass (fewer chunk edges = no swallowed word endings),
    then long pauses are trimmed using the word timestamps."""
    global _KOKORO
    import numpy as np
    from kokoro import KPipeline
    from scipy.io import wavfile

    if _KOKORO is None:
        _KOKORO = KPipeline(lang_code="a")  # American English
    voice = os.getenv("KOKORO_VOICE", config.KOKORO_VOICE)
    speed = float(os.getenv("KOKORO_SPEED", config.KOKORO_SPEED))
    sr, chunks, words, offset = 24000, [], [], 0.0
    for res in _KOKORO(text, voice=voice, speed=speed, split_pattern=None):
        if res.audio is None:
            continue
        audio = res.audio.detach().cpu().numpy()
        for tk in res.tokens or []:
            if tk.start_ts is None or tk.end_ts is None:
                continue
            raw = tk.text.strip()
            w = raw.strip(".,!?:;\"'()")
            if not w:
                if words and raw and raw[-1] in ".!?":
                    words[-1]["stop"] = True
                continue
            words.append({"word": w, "start": offset + tk.start_ts, "end": offset + tk.end_ts,
                          "stop": raw[-1] in ".!?"})
        chunks.append(audio)
        offset += len(audio) / sr
    audio = np.concatenate(chunks)
    audio = np.concatenate([audio, np.zeros(int(sr * 0.25), dtype=audio.dtype)])  # no cut end
    audio, words = _tighten(audio, words, sr)
    wav = mp3.with_suffix(".wav")
    wavfile.write(wav, sr, (audio * 32767).clip(-32768, 32767).astype(np.int16))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ar", "44100",
                    "-b:a", "192k", str(mp3)], check=True)
    return [{"word": w["word"], "start": w["start"], "end": w["end"]} for w in words]


def synthesize(text: str, mp3: Path) -> list[dict]:
    if os.getenv("TTS_OFFLINE") == "1":
        return _offline(text, mp3)
    if os.getenv("ELEVENLABS_API_KEY"):
        try:
            words = _elevenlabs(text, mp3)
            print("[tts] ElevenLabs voice")
            return words
        except Exception as e:  # out of credits etc. -> free voice instead
            print(f"[tts] ElevenLabs failed: {str(e)[:120]}")
    if os.getenv("TTS_ENGINE", "kokoro") == "kokoro":
        try:
            words = _kokoro(text, mp3)
            if words:
                print(f"[tts] Kokoro voice ({os.getenv('KOKORO_VOICE', config.KOKORO_VOICE)})")
                return words
        except Exception as e:
            print(f"[tts] Kokoro failed, using Edge voice: {e}")
    words = asyncio.run(_edge(text, mp3))
    if not words:
        raise RuntimeError("TTS returned no word timings")
    return words


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
         "default=nw=1:nk=1", str(path)], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())
