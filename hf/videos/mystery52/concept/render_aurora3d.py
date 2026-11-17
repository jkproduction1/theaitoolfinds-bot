"""Render aurora3d.html (/explain-3d how the Northern Lights form).
  python3 render_aurora3d.py stills        -> aurora3d_s1.jpg/_s2/_s3 (t=0.6, 3.2, 5.6) in this folder
  python3 render_aurora3d.py 0 2 4 6       -> test frames aurora3d_t<sec>.jpg in this folder
  python3 render_aurora3d.py video [K]     -> ../media/r<K>.mp4 (190 frames, 30 fps) + ../media/th<K>.jpg   (K default 1)
"""
import os, subprocess, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
MEDIA = HERE.parent / "media"
NAME = "aurora3d"
SH = os.environ.get("SHARD")  # "k/n/dir"
args = sys.argv[1:]
mode = "video" if (args and args[0] == "video") else "stills"
K = args[1] if mode == "video" and len(args) > 1 else "1"
N = 2


def shots(jobs):
    with sync_playwright() as pw:
        b = pw.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
                                     "--allow-file-access-from-files"])
        pg = b.new_page(viewport={"width": 1080, "height": 1920})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: m.type in ("error", "warning") and errs.append(m.text))
        pg.goto((HERE / f"{NAME}.html").resolve().as_uri() + "?export=1")
        pg.wait_for_function("document.title==='ok'", timeout=180000)
        pg.wait_for_timeout(300)
        st = pg.locator("#stage")
        for t, path in jobs:
            pg.evaluate("t => window.renderAt(t)", t)
            st.screenshot(path=str(path), type="jpeg", quality=90)
        print("done", len(jobs), errs[:6])
        b.close()


if SH:
    k, n, d = SH.split("/", 2)
    shots([(i / 30, Path(d) / f"f{i:04d}.jpg") for i in range(int(k), 190, int(n))])
elif mode == "video":
    MEDIA.mkdir(exist_ok=True)
    tmp = Path(os.environ.get("REUSE") or tempfile.mkdtemp(prefix=f"{NAME}_"))
    ps = [subprocess.Popen([sys.executable, __file__, "video", K], env={**os.environ, "SHARD": f"{k}/{N}/{tmp}"}) for k in range(N)]
    assert all(p.wait() == 0 for p in ps)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(tmp / "f%04d.jpg"), "-frames:v", "190",
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-an", str(MEDIA / f"r{K}.mp4")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp / "f0165.jpg"), "-vf",
                    "scale=280:-2,crop=280:430", "-q:v", "3", str(MEDIA / f"th{K}.jpg")], check=True)
    print("ok", MEDIA / f"r{K}.mp4")
elif args and args[0] == "stills" or not args:
    shots([(t, HERE / f"{NAME}_s{i + 1}.jpg") for i, t in enumerate([0.6, 3.2, 5.6])])
else:
    shots([(float(a), HERE / f"{NAME}_t{float(a):.2f}.jpg") for a in args])
