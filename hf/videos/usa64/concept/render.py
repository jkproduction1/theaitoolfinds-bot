"""Render a usa64 scene (single process).
  python3 render.py <page.html> stills t1 t2 ...   -> <page>_s<i>.jpg + <page>_sheet.jpg
  python3 render.py <page.html> video K [thumbF]  -> ../media/rK.mp4 (190 frames, 30 fps) + ../media/thK.jpg
"""
import sys, subprocess, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
HERE = Path(__file__).parent
NAME = sys.argv[1].replace(".html", ""); PAGE = (HERE / f"{NAME}.html").resolve().as_uri(); N = 190


def run(frames, out):
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920}); pg.set_default_timeout(240000); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PAGE); pg.wait_for_function("document.title==='ok'", timeout=240000)
        for i, t in frames:
            pg.evaluate(f"draw({t})")
            pg.locator("canvas").screenshot(path=str(out(i)), type="jpeg", quality=93)
        if errs: print("errors:", errs)
        b.close()


if sys.argv[2] == "stills":
    ts = [float(x) for x in sys.argv[3:]]
    run(list(enumerate(ts)), lambda i: HERE / f"{NAME}_s{i+1}.jpg")
    ims = [Image.open(HERE / f"{NAME}_s{i+1}.jpg") for i in range(len(ts))]
    sheet = Image.new("RGB", (550 * len(ims), 960), (20, 20, 20))
    for i, im in enumerate(ims): sheet.paste(im.resize((540, 960)), (i * 550, 0))
    sheet.save(HERE / f"{NAME}_sheet.jpg", quality=85)
else:
    K = sys.argv[3]; TF = int(sys.argv[4]) if len(sys.argv) > 4 else 170
    FR = HERE / f"frames_{NAME}"; shutil.rmtree(FR, ignore_errors=True); FR.mkdir()
    run([(i, i / 30) for i in range(N)], lambda i: FR / f"f{i:04d}.jpg")
    med = HERE.parent / "media"; med.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FR / "f%04d.jpg"), "-frames:v", str(N),
                    "-c:v", "libx264", "-preset", "medium", "-pix_fmt", "yuv420p", "-crf", "18", "-an", "-movflags", "+faststart",
                    str(med / f"r{K}.mp4")], check=True)
    im = Image.open(FR / f"f{TF:04d}.jpg").resize((280, 498)); top = 34
    im.crop((0, top, 280, top + 430)).save(med / f"th{K}.jpg", quality=90)
    shutil.rmtree(FR)
    print("done", K)
