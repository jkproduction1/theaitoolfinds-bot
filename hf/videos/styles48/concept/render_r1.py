"""Render paper_bigben.html.
python3 render_r1.py stills 0 2 4 6   -> still_<t>.jpg
python3 render_r1.py video            -> ../media/r1.mp4 (190 frames, 30 fps) + ../media/th1.jpg
"""
import sys, base64, subprocess, shutil
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent
PAGE = (HERE / "paper_bigben.html").resolve().as_uri()
FR = HERE / "frames_r1"


def grab(pg, t, path):
    d = pg.evaluate(f"(()=>{{draw({t});return document.getElementById('c').toDataURL('image/jpeg',0.95);}})()")
    Path(path).write_bytes(base64.b64decode(d.split(",", 1)[1]))


def shard(frames):
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page(viewport={"width": 1080, "height": 1920})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PAGE)
        pg.wait_for_function("document.title==='ok'", timeout=30000)
        for i in frames:
            grab(pg, i / 30, FR / f"f{i:04d}.jpg")
        b.close()
        return errs


if sys.argv[1] == "stills":
    FR.mkdir(exist_ok=True)
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920}); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PAGE); pg.wait_for_function("document.title==='ok'", timeout=30000)
        for t in sys.argv[2:]:
            grab(pg, float(t), HERE / f"still_{t}.jpg")
        print("errors:", errs); b.close()
else:
    shutil.rmtree(FR, ignore_errors=True); FR.mkdir()
    N = 190
    with ThreadPoolExecutor(2) as ex:
        print(list(ex.map(shard, [range(0, N, 2), range(1, N, 2)])))
    media = HERE.parent / "media"; media.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FR / "f%04d.jpg"), "-frames:v", "190",
                    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", str(media / "r1.mp4")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(FR / "f0165.jpg"), "-vf", "scale=280:-1,crop=280:430:0:(ih-430)/2",
                    "-q:v", "3", str(media / "th1.jpg")], check=True)
    print("done")
