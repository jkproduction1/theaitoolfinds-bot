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


def _assets(items):
    """Real results of the tool (images / short videos from its own page or demo),
    listed in the storyboard. Downloaded here so scenes can show them."""
    out = []
    for i, it in enumerate(items[:8]):
        url = it["url"] if isinstance(it, dict) else it
        try:
            r = requests.get(url, timeout=40, headers={"User-Agent": "Mozilla/5.0"})
            r.raise_for_status()
            ctype = r.headers.get("content-type", "")
            is_vid = "video" in ctype or url.lower().split("?")[0].endswith((".mp4", ".webm", ".mov"))
            if is_vid:
                raw = JOB / f"a{i}_raw"
                raw.write_bytes(r.content)
                dst = JOB / f"a{i}.mp4"
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-an", "-t", "12",
                                "-vf", "scale='min(1080,iw)':-2", "-c:v", "libx264", "-pix_fmt",
                                "yuv420p", str(dst)], check=True)
                raw.unlink()
                pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                                     "-show_entries", "stream=width,height", "-of", "csv=p=0",
                                     str(dst)], capture_output=True, text=True).stdout.strip()
                w, h = (int(x) for x in pr.split(",")[:2])
                out.append({"src": f"job/a{i}.mp4", "kind": "video", "w": w, "h": h})
            else:
                im = Image.open(__import__("io").BytesIO(r.content)).convert("RGB")
                if im.width < 200:
                    continue
                im.thumbnail((1400, 1400))
                im.save(JOB / f"a{i}.jpg", quality=92)
                out.append({"src": f"job/a{i}.jpg", "kind": "image", "w": im.width, "h": im.height})
            if isinstance(it, dict) and it.get("label"):
                out[-1]["label"] = it["label"]
        except Exception as e:
            print(f"[motion] asset {i} failed: {str(e)[:120]}")
    print(f"[motion] {len(out)} real assets")
    return out


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
        if dedup and dedup[-1][2]["type"] == r[2]["type"] and r[2]["type"] not in ("cta", "screen"):
            dedup[-1][1] = r[1]
        else:
            dedup.append(r)
    merged = dedup
    out, flip = [], 0
    for s0, s1, sc in merged:
        if s1 - s0 > MAX_SCENE and sc["type"] not in ("cta", "title", "screen"):
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
          out_mp4: Path, work: Path, avatar: Path | None = None, demo: dict | None = None, recordings=None):
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

    assets = _assets(sb.get("assets") or [])
    if assets and not media:
        media = assets[0]
    if assets and not cover_img:
        cover_img = next((a["src"] for a in assets if a["kind"] == "image"), None)

    recs = []
    for i, r in enumerate(recordings or []):
        if not r:
            recs.append(None)
            continue
        shutil.copy(r["path"], JOB / f"rec{i}.mp4")
        recs.append({"src": f"job/rec{i}.mp4", "w": r["w"], "h": r["h"], "dur": r["dur"],
                     "events": r["events"]})
        if r.get("result"):  # the generated result as its own image (hero / hook / cover)
            im2 = Image.open(r["result"]).convert("RGB")
            im2.save(JOB / f"rec{i}_result.jpg", quality=94)
            assets.append({"src": f"job/rec{i}_result.jpg", "kind": "image", "w": im2.width,
                           "h": im2.height, "label": "Made with " + sb["tool_name"]})
            recs[-1]["asset"] = len(assets) - 1
            cover_img = f"job/rec{i}_result.jpg"
            media = media or assets[-1]

    total = voice_len + config.TAIL_SECONDS
    scenes = _scenes(sb, words, total)
    for sc in scenes:  # {"rec_result": i} -> the cropped result image of recording i
        rr = sc["props"].get("rec_result")
        if rr is not None:
            r = recs[rr] if rr < len(recs) else None
            if r and r.get("asset") is not None:
                sc["props"]["asset"] = r["asset"]
            elif sc["type"] == "hero":
                sc["type"] = "screen"
                sc["props"] = {"rec": rr, "part": "reveal", **sc["props"]}
    for sc in scenes:  # "part" of a recording -> exact seconds
        if sc["type"] != "screen":
            continue
        pr = sc["props"]
        r = recs[pr.get("rec", 0)] if pr.get("rec", 0) < len(recs) else None
        if not r:
            sc["type"], sc["props"] = "browser", {"motion": "zoom"}
            continue
        ev = {e["kind"]: e["t"] for e in reversed(r["events"])}  # first occurrence
        ws = ev.get("wait_start")
        part = pr.get("part", "all")
        if part == "type":
            pr.setdefault("from", 0.0)
            pr.setdefault("to", (ws + 0.3) if ws else r["dur"] * 0.6)
        elif part == "reveal":
            rv = ev.get("reveal") or ev.get("wait_end") or r["dur"] * 0.7
            pr.setdefault("from", max(0.0, rv - 0.5))
            pr.setdefault("to", r["dur"])
        elif part == "result":
            pr.setdefault("from", max(0.0, (ws or r["dur"] * 0.5) - 0.2))
            pr.setdefault("to", r["dur"])
        pr.setdefault("from", 0.0)
        pr.setdefault("to", r["dur"])
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
        "screenshotW": im.width, "screenshotH": im.height, "logo": logo, "avatar": av, "media": media, "assets": assets, "recordings": [r or {"src": "", "w": 1, "h": 1, "dur": 0, "events": []} for r in recs], "coverImage": cover_img,
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
