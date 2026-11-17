"""Render the /scale dinosaur 6.3 s shot -> ../media/r1.mp4 (+ th1.jpg). Optional args: times (s) for test frames only."""
import subprocess, sys, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
MEDIA = HERE.parent / "media"; MEDIA.mkdir(exist_ok=True)
import os
SH = os.environ.get("SHARD")  # "k/n/dir": render frames i%n==k into dir (parallel workers)
tests = [float(a) for a in sys.argv[1:]]
N = 2
LO, HI = int(os.environ.get("LO", 0)), int(os.environ.get("HI", 190))  # optional partial re-render (needs REUSE dir)
if not tests and not SH:
    tmp = Path(os.environ.get("REUSE") or tempfile.mkdtemp(prefix="scale_dino_"))
    ps = [subprocess.Popen([sys.executable, __file__], env={**os.environ, "SHARD": f"{k}/{N}/{tmp}"}) for k in range(N)]
    assert all(p.wait() == 0 for p in ps)
else:
    tmp = Path(SH.split("/", 2)[2]) if SH else Path(tempfile.mkdtemp(prefix="scale_dino_"))
if tests or SH:
  K, NN = (int(SH.split("/")[0]), int(SH.split("/")[1])) if SH else (0, 1)
  with sync_playwright() as pw:
      b = pw.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
                                   "--allow-file-access-from-files"])
      pg = b.new_page(viewport={"width": 1080, "height": 1920})
      errs = []
      pg.on("pageerror", lambda e: errs.append(str(e)))
      pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
      pg.goto((HERE / "scale_dino.html").resolve().as_uri() + "?export=1")
      pg.wait_for_function("document.title==='ok'", timeout=120000)
      pg.wait_for_timeout(300)
      st = pg.locator("#stage")
      if tests:
          for t in tests:
              pg.evaluate("t => window.renderAt(t)", t)
              st.screenshot(path=str(tmp / f"t{t:.2f}.jpg"), type="jpeg", quality=90)
      else:
          for i in range(K + LO, HI, NN):
              pg.evaluate("t => window.renderAt(t)", i / 30)
              st.screenshot(path=str(tmp / f"f{i:04d}.jpg"), type="jpeg", quality=90)
      print("frames", tmp, errs)
      b.close()
if not tests and not SH:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(tmp / "f%04d.jpg"), "-c:v", "libx264",
                    "-pix_fmt", "yuv420p", "-crf", "18", str(MEDIA / "r1.mp4")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp / "f0165.jpg"), "-vf",
                    "scale=280:-2,crop=280:430", "-q:v", "3", str(MEDIA / "th1.jpg")], check=True)
    print("ok", MEDIA / "r1.mp4")
