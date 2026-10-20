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

    voice = os.getenv("ELEVENLABS_VOICE_ID", config.EL_VOICE)
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps",
        params={"output_format": "mp3_44100_128"},
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]},
        json={"text": text,
              "model_id": os.getenv("ELEVENLABS_MODEL", config.EL_MODEL),
              "voice_settings": {
                  "stability": float(os.getenv("EL_STABILITY", config.EL_STABILITY)),
                  "similarity_boost": float(os.getenv("EL_SIMILARITY", config.EL_SIMILARITY)),
                  "style": 0.0, "use_speaker_boost": True}},
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
    return _snappy(mp3, [w for w in words if w["word"]])


def _snappy(mp3: Path, words, cap=0.15):
    """Cut long pauses, then speed the whole read up (pitch stays the same)."""
    import numpy as np
    from scipy.io import wavfile

    speed = float(os.getenv("EL_SPEED", config.EL_SPEED))
    wav = mp3.with_suffix(".raw.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ac", "1",
                    "-ar", "44100", str(wav)], check=True)
    sr, a = wavfile.read(wav)
    a = a.astype(np.float32) / 32768
    a = np.concatenate([a, np.zeros(int(sr * 0.2), dtype=a.dtype)])
    a, words = _tighten(a, words, sr, cap=cap)
    wavfile.write(wav, sr, (a * 32767).clip(-32768, 32767).astype(np.int16))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-filter:a",
                    f"atempo={speed}", "-b:a", "192k", str(mp3)], check=True)
    wav.unlink(missing_ok=True)
    return [{**w, "start": w["start"] / speed, "end": w["end"] / speed} for w in words]


_KOKORO = None


def _tighten(audio, words, sr, cap=0.2, lead=0.05):
    """Shorten every silence longer than `cap` seconds (measured from the audio itself)
    and shift the word timings to match. Makes the voice snappier."""
    import numpy as np

    hop = int(sr * 0.01)
    n = len(audio) // hop
    rms = np.sqrt(np.mean(audio[: n * hop].reshape(n, hop) ** 2, axis=1))
    silent = rms < max(1e-4, rms.max() * 0.02)
    cuts, i = [], 0  # (start_sample, end_sample) to remove
    while i < n:
        if not silent[i]:
            i += 1
            continue
        j = i
        while j < n and silent[j]:
            j += 1
        dur = (j - i) * hop / sr
        keep = lead if i == 0 else cap
        if dur > keep:
            half = keep / 2 if i > 0 else 0
            a0 = i * hop + int(half * sr)
            a1 = j * hop - int((keep - half) * sr)
            if a1 > a0:
                cuts.append((a0, a1))
        i = j
    if not cuts:
        return audio, words
    parts, cur = [], 0
    for a0, a1 in cuts:
        parts.append(audio[cur:a0])
        cur = a1
    parts.append(audio[cur:])

    def remap(t):
        x, removed = int(t * sr), 0
        for a0, a1 in cuts:
            if x >= a1:
                removed += a1 - a0
            elif x > a0:
                removed += x - a0
        return (x - removed) / sr

    out = [{**w, "start": remap(w["start"]), "end": remap(w["end"])} for w in words]
    return np.concatenate(parts), out


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
