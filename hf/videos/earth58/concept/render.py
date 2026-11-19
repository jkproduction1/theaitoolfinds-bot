"""Render earth58 result clips (single process, lean).
  python3 render.py globe.html?s=0 stills 0.5 3 5.8   -> <tag>_sheet.jpg + <tag>_s<i>.jpg
  python3 render.py globe.html?s=0 video 0            -> ../media/r0.mp4 + ../media/th0.jpg
  (r0 = globe.html?s=0, r1 = globe.html?s=1, r2 = cave.html)
"""
import sys, subprocess, shutil, time
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent
page, mode = sys.argv[1], sys.argv[2]
tag = page.replace(".html", "").replace("?s=", "")
FR = HERE / f"frames_{tag}"; FR.mkdir(exist_ok=True)
N = 190


def run(jobs, prefix):
    with sync_playwright() as pw:
        b = pw.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"])
        pg = b.new_page(viewport={"width": 1080, "height": 1920}); pg.set_default_timeout(300000); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
        t0 = time.time()
        pg.goto((HERE / page.split("?")[0]).resolve().as_uri() + ("?" + page.split("?")[1] if "?" in page else ""))
        pg.wait_for_function("document.title==='ok'", timeout=300000)
        print("loaded", round(time.time() - t0, 1), "s", flush=True)
        for i, t in jobs:
            pg.evaluate(f"draw({t})")
            pg.screenshot(path=str(FR / f"{prefix}{i:04d}.jpg"), type="jpeg", quality=93, clip={"x": 0, "y": 0, "width": 1080, "height": 1920})
            if i % 30 == 0: print(i, round(time.time() - t0, 1), flush=True)
        if errs: print("errors:", errs)
        b.close()


if mode == "stills":
    ts = [float(x) for x in sys.argv[3:]]
    run(list(enumerate(ts)), "s")
    from PIL import Image
    ims = [Image.open(FR / f"s{i:04d}.jpg") for i in range(len(ts))]
    out = Image.new("RGB", (550 * len(ims), 960), (20, 20, 20))
    for i, im in enumerate(ims):
        out.paste(im.resize((540, 960)), (i * 550, 0)); im.save(HERE / f"{tag}_s{i+1}.jpg", quality=88)
    out.save(HERE / f"{tag}_sheet.jpg", quality=85)
else:
    K = sys.argv[3]
    for f in FR.glob("f*.jpg"): f.unlink()
    run([(i, i / 30) for i in range(N)], "f")
    med = HERE.parent / "media"; med.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FR / "f%04d.jpg"), "-frames:v", str(N),
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium", "-an", str(med / f"r{K}.mp4")], check=True)
    th = sys.argv[4] if len(sys.argv) > 4 else "170"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(FR / f"f{int(th):04d}.jpg"), "-vf", "scale=280:-1,crop=280:430",
                    str(med / f"th{K}.jpg")], check=True)
    shutil.rmtree(FR)
    print("done", K)
