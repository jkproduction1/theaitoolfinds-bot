"""Render an inside59 scene (single process, lean).
  python3 render.py xray_wing 0.8 3 5.6      -> test stills xray_wing_t<sec>.jpg in this folder
  python3 render.py xray_wing video 0        -> ../media/r0.mp4 (190 frames, 30 fps) + ../media/th0.jpg
Scenes: xray_wing (r0), smoke_detector (r1), explode_gamepad (r2).
"""
import subprocess, sys, tempfile, time
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
MEDIA = HERE.parent / "media"
NAME = sys.argv[1]
args = sys.argv[2:]
video = args and args[0] == "video"
K = args[1] if video else None
tmp = Path(tempfile.mkdtemp(prefix=f"{NAME}_")) if video else HERE
jobs = [(i / 30, tmp / f"f{i:04d}.jpg") for i in range(190)] if video else \
       [(float(a), HERE / f"{NAME}_t{float(a):.2f}.jpg") for a in (args or ["0.8", "3.0", "5.6"])]

t0 = time.time()
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
                                 "--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto((HERE / f"{NAME}.html").resolve().as_uri() + "?export=1" + __import__("os").environ.get("QS", ""))
    try:
        pg.wait_for_function("document.title==='ok'", timeout=120000)
    finally:
        print("errors:", errs[:6], flush=True)
    pg.wait_for_timeout(200)
    st = pg.locator("#stage")
    for t, path in jobs:
        pg.evaluate("t => window.renderAt(t)", t)
        st.screenshot(path=str(path), type="jpeg", quality=90)
    b.close()
print("frames", len(jobs), f"{time.time() - t0:.0f}s", errs[:6], flush=True)
if video:
    MEDIA.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(tmp / "f%04d.jpg"), "-frames:v", "190",
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-an", str(MEDIA / f"r{K}.mp4")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp / "f0168.jpg"), "-vf",
                    "scale=280:-2,crop=280:430", "-q:v", "3", str(MEDIA / f"th{K}.jpg")], check=True)
    print("ok", MEDIA / f"r{K}.mp4")
