"""Find a REAL demo for the tool (README demo GIF/video, product image) - showing the
actual result is what keeps viewers watching, much more than a website screenshot."""
import re
import subprocess
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from PIL import Image

from . import config

BAD = re.compile(r"shields\.io|badge|star-history|contrib\.rocks|\.svg(\?|$)|logo|icon|"
                 r"avatar|sponsor|discord|twitter|buymeacoffee|ko-fi|license|stars\.png|"
                 r"api\.star|repobeats|trendshift|producthunt\.com/widgets", re.I)
MAX_BYTES = 30 * 1024 * 1024


def _gh_repo(url):
    p = urlparse(url)
    parts = [x for x in p.path.split("/") if x]
    if p.netloc.endswith("github.com") and len(parts) >= 2:
        return parts[0], parts[1]
    return None


def readme_media_urls(owner, repo, readme_md: str):
    urls = re.findall(r"!\[[^\]]*\]\(\s*<?([^)\s>]+)", readme_md)
    urls += re.findall(r"<img[^>]+src=[\"']([^\"']+)", readme_md, re.I)
    urls += re.findall(r"<(?:video|source)[^>]+src=[\"']([^\"']+)", readme_md, re.I)
    urls += re.findall(r"(https://github\.com/user-attachments/assets/[0-9a-f-]+)", readme_md)
    urls += re.findall(r"(https://[^\s)\"']+\.(?:mp4|webm|gif))", readme_md, re.I)
    base = f"https://raw.githubusercontent.com/{owner}/{repo}/HEAD/"
    out = []
    for u in urls:
        u = u.strip()
        if not u.startswith("http"):
            u = urljoin(base, u.lstrip("./"))
        u = u.replace("github.com/" + owner + "/" + repo + "/blob/",
                      "raw.githubusercontent.com/" + owner + "/" + repo + "/")
        if BAD.search(u) or u in out:
            continue
        out.append(u)
    return out[:8]


def _download(url, dest_dir: Path):
    r = requests.get(url, headers={"User-Agent": config.USER_AGENT}, timeout=40, stream=True,
                     allow_redirects=True)
    r.raise_for_status()
    ctype = r.headers.get("content-type", "").lower()
    data = b""
    for chunk in r.iter_content(1 << 16):
        data += chunk
        if len(data) > MAX_BYTES:
            raise RuntimeError("media too large")
    ext = ("mp4" if "video" in ctype or url.lower().endswith((".mp4", ".webm")) else
           "gif" if "gif" in ctype or url.lower().endswith(".gif") else
           "img" if "image" in ctype else None)
    if not ext:
        raise RuntimeError(f"not media ({ctype})")
    raw = dest_dir / f"media_raw.{ext}"
    raw.write_bytes(data)
    return raw, ext


def _to_mp4(src: Path, dest: Path):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-t", "14", "-an",
         "-vf", "scale='min(1080,iw)':-2:flags=lanczos,fps=30,format=yuv420p",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", str(dest)], check=True)
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height", "-of", "csv=p=0", str(dest)],
                         capture_output=True, text=True, check=True).stdout.strip()
    w, h = (int(x) for x in out.split(",")[:2])
    return w, h


def _try(url, work: Path):
    raw, ext = _download(url, work)
    if ext in ("mp4", "gif"):
        dest = work / "media.mp4"
        w, h = _to_mp4(raw, dest)
        if w < 300:
            raise RuntimeError("video too small")
        return {"kind": "video", "path": dest, "w": w, "h": h, "url": url}
    im = Image.open(raw).convert("RGB")
    if im.width < 500 or im.height < 250:
        raise RuntimeError("image too small")
    if im.width > 1400:
        im = im.resize((1400, int(im.height * 1400 / im.width)), Image.LANCZOS)
    dest = work / "media.png"
    im.save(dest)
    return {"kind": "image", "path": dest, "w": im.width, "h": im.height, "url": url}


def find(site: dict, work: Path):
    """Return {"kind", "path", "w", "h"} or None."""
    urls = list(site.get("media_urls") or [])
    if site.get("og_image") and "huggingface.co" not in site.get("url", ""):
        urls.append(site["og_image"])
    # prefer moving demos (gif/mp4) over still images
    urls.sort(key=lambda u: 0 if re.search(r"\.(gif|mp4|webm)|user-attachments", u, re.I) else 1)
    for u in urls[:6]:
        try:
            m = _try(u, work)
            print(f"[media] using {m['kind']} {m['w']}x{m['h']} from {u[:90]}")
            return m
        except Exception as e:
            print(f"[media] skip {u[:90]}: {e}")
    return None
