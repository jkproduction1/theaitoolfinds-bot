"""Bridge to the Remotion project in /video: prepare assets + props, render video + cover."""
import json
import os
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import urlparse

import requests
from PIL import Image

from . import config

VIDEO = config.ROOT / "video"
JOB = VIDEO / "public" / "job"
FPS = 30
MIN_SCENE = 1.6   # seconds
MAX_SCENE = 6.0   # longer scenes get split with a website shot


def _logo(host: str, dest: Path, site_url: str = ""):
    gh = re.match(r"https?://github\.com/([^/]+)/", site_url or "")
    if gh:  # GitHub repo -> the owner's avatar is the best "logo"
        try:
            r = requests.get(f"https://github.com/{gh.group(1)}.png?size=256", timeout=15)
            im = Image.open(__import__("io").BytesIO(r.content)).convert("RGBA")
            im.save(dest)
            return "job/logo.png"
        except Exception:
            pass
    try:
        r = requests.get("https://www.google.com/s2/favicons",
                         params={"domain": host, "sz": 256}, timeout=15)
        im = Image.open(__import__("io").BytesIO(r.content)).convert("RGBA")
        if im.width < 64:
            return None
        im.save(dest)
        return "job/logo.png"
    except Exception:
        return None


def _sentence_starts(sentences, words):
    counts = [len(s["text"].split()) for s in sentences]
    total = sum(counts) or 1
    starts, acc = [], 0
    for c in counts:
        i = min(len(words) - 1, round(acc / total * len(words)))
        starts.append(0.0 if not starts else words[i]["start"])
        acc += c
    return starts


def _scenes(sb, words, total):
    sents = sb["sentences"]
    starts = _sentence_starts(sents, words) + [total]
    raw = []
    for i, s in enumerate(sents):
        raw.append([starts[i], starts[i + 1], s["scene"]])
    # merge too-short scenes into the previous one
    merged = []
    for r in raw:
        if merged and r[1] - r[0] < MIN_SCENE and r[2]["type"] not in ("cta",):
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    # never the same scene type twice in a row -> merge them
    dedup = []
    for r in merged:
        if dedup and dedup[-1][2]["type"] == r[2]["type"] and r[2]["type"] != "cta":
            dedup[-1][1] = r[1]
        else:
            dedup.append(r)
    merged = dedup
    out, flip = [], 0
    for s0, s1, sc in merged:
        if s1 - s0 > MAX_SCENE and sc["type"] not in ("cta", "title"):
            mid = s0 + (s1 - s0) * 0.55
            out.append((s0, mid, sc))
            flip += 1
            out.append((mid, s1, {"type": "browser",
                                  "props": {"motion": "zoom" if flip % 2 else "scroll",
                                            "focus": "middle"}}))
        else:
            out.append((s0, s1, sc))
    return [{"type": sc["type"], "from": int(round(a * FPS)), "to": int(round(b * FPS)),
             "props": sc.get("props") or {}} for a, b, sc in out]


def _words(words, sb):
    emph = set()
    for s in sb["sentences"]:
        for e in s.get("emphasis") or []:
            for w in str(e).lower().split():
                emph.add(re.sub(r"[^a-z0-9$%]", "", w))
    for w in sb.get("tool_name", "").lower().split():
        emph.add(re.sub(r"[^a-z0-9]", "", w))
    emph.add(sb["keyword"].lower())
    out = []
    for w in words:
        clean = re.sub(r"[^a-z0-9$%]", "", w["word"].lower())
        out.append({"w": w["word"], "s": round(w["start"], 3), "e": round(w["end"], 3),
                    "hl": bool(clean) and clean in emph})
    return out


def _remotion(args, cwd=VIDEO):
    cmd = ["npx", "remotion", *args, "--log=error"]
    if os.getenv("REMOTION_BROWSER"):
        cmd.append(f"--browser-executable={os.environ['REMOTION_BROWSER']}")
    subprocess.run(cmd, cwd=cwd, check=True)


def build(sb: dict, site_url: str, screenshot: Path, voice: Path, words, voice_len: float,
          out_mp4: Path, work: Path, avatar: Path | None = None, demo: dict | None = None):
    if JOB.exists():
        shutil.rmtree(JOB)
    JOB.mkdir(parents=True)

    im = Image.open(screenshot).convert("RGB")
    im.save(JOB / "screenshot.png")
    shutil.copy(voice, JOB / "voice.mp3")
    host = urlparse(site_url).netloc.replace("www.", "")
    logo = _logo(host, JOB / "logo.png", site_url)
    av = None
    if avatar and avatar.exists():
        shutil.copy(avatar, JOB / "avatar.mp4")
        av = "job/avatar.mp4"

    media, cover_img = None, None
    if demo:
        ext = "mp4" if demo["kind"] == "video" else "png"
        shutil.copy(demo["path"], JOB / f"media.{ext}")
        media = {"src": f"job/media.{ext}", "kind": demo["kind"], "w": demo["w"],
                 "h": demo["h"]}
        if demo["kind"] == "image":
            cover_img = media["src"]
        else:  # a frame from the demo video for the cover
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "1.5", "-i",
                            str(JOB / "media.mp4"), "-frames:v", "1", str(JOB / "cover_src.png")])
            if (JOB / "cover_src.png").exists():
                cover_img = "job/cover_src.png"

    total = voice_len + config.TAIL_SECONDS
    scenes = _scenes(sb, words, total)
    if not media:
        for sc in scenes:
            if sc["type"] == "media":
                sc["type"], sc["props"] = "browser", {"motion": "zoom"}
    if av and scenes and scenes[0]["type"] == "title":
        scenes[0]["type"] = "avatar"

    props = {
        "fps": FPS, "durationInFrames": int(round(total * FPS)),
        "title": sb.get("title_on_screen") or sb["tool_name"],
        "category": sb.get("category", ""), "host": host, "handle": config.BRAND,
        "keyword": sb["keyword"], "audio": "job/voice.mp3", "screenshot": "job/screenshot.png",
        "screenshotW": im.width, "screenshotH": im.height, "logo": logo, "avatar": av, "media": media, "coverImage": cover_img,
        "scenes": scenes, "words": _words(words, sb),
        "cover": {"line1": sb.get("cover", {}).get("line1") or sb["tool_name"],
                  "line2": sb.get("cover", {}).get("line2") or "AI tool"},
    }
    pfile = work / "props.json"
    pfile.write_text(json.dumps(props, indent=1))
    print("[motion] scenes:", " > ".join(
        f"{s['type']}({(s['to'] - s['from']) / FPS:.1f}s)" for s in scenes))

    _remotion(["render", "src/index.ts", "Main", str(out_mp4.resolve()),
               f"--props={pfile.resolve()}", "--codec=h264", "--crf=18"])
    cover_png = work / "cover.png"
    _remotion(["still", "src/index.ts", "Cover", str(cover_png.resolve()),
               f"--props={pfile.resolve()}"])
    Image.open(cover_png).convert("RGB").save(out_mp4.with_name("cover.jpg"), quality=92)
