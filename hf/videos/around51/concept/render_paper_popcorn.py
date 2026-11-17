"""Render paper_popcorn.html.
python3 render_paper_popcorn.py stills            -> paper_popcorn_s1.jpg/_s2/_s3 (t=0.6, 3.2, 5.6), JPEG q90
python3 render_paper_popcorn.py test 0 2 4 6      -> paper_popcorn_t<t>.jpg
python3 render_paper_popcorn.py video [K]         -> ../media/r<K>.mp4 (190 frames, 30 fps) + ../media/th<K>.jpg  (K default 1)
"""
import sys, base64, subprocess, shutil
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent
PAGE = (HERE / "paper_popcorn.html").resolve().as_uri()
FR = HERE / "frames_paper_popcorn"


def grab(pg, t, path, q=0.95):
    d = pg.evaluate(f"(()=>{{draw({t});return document.getElementById('c').toDataURL('image/jpeg',{q});}})()")
    Path(path).write_bytes(base64.b64decode(d.split(",", 1)[1]))


def page(pw):
    b = pw.chromium.launch()
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(PAGE)
    pg.wait_for_function("document.title==='ok'", timeout=30000)
    return b, pg, errs


def shard(frames):
    with sync_playwright() as pw:
        b, pg, errs = page(pw)
        for i in frames:
            grab(pg, i / 30, FR / f"f{i:04d}.jpg")
        b.close()
        return errs


mode = sys.argv[1]
if mode in ("stills", "test"):
    with sync_playwright() as pw:
        b, pg, errs = page(pw)
        if mode == "stills":
            for n, t in enumerate((0.6, 3.2, 5.6), 1):
                grab(pg, t, HERE / f"paper_popcorn_s{n}.jpg", 0.9)
        else:
            for t in sys.argv[2:]:
                grab(pg, float(t), HERE / f"paper_popcorn_t{t}.jpg", 0.9)
        print("errors:", errs); b.close()
else:
    K = sys.argv[2] if len(sys.argv) > 2 else "1"
    shutil.rmtree(FR, ignore_errors=True); FR.mkdir()
    N = 190
    with ThreadPoolExecutor(2) as ex:
        print(list(ex.map(shard, [range(0, N, 2), range(1, N, 2)])))
    media = HERE.parent / "media"; media.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FR / "f%04d.jpg"), "-frames:v", "190",
                    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", str(media / f"r{K}.mp4")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(FR / "f0165.jpg"), "-vf", "scale=280:-1,crop=280:430:0:(ih-430)/2",
                    "-q:v", "3", str(media / f"th{K}.jpg")], check=True)
    print("done")
