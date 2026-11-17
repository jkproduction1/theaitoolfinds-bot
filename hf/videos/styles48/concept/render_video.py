"""python3 render_video.py stills t1 t2 ...  -> still_<t>.jpg + stills_sheet.jpg
   python3 render_video.py video            -> ../media/r0.mp4 (190 frames, 2 shards) + ../media/th0.jpg"""
import sys, io, subprocess, shutil
from pathlib import Path
from multiprocessing import Process
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent; PAGE = (HERE / "painted_titanic.html").resolve().as_uri()
FR = HERE / "frames"; N = 190

def open_page(pw):
    b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.goto(PAGE); pg.wait_for_function("document.title==='ok'", timeout=60000)
    return b, pg, errs

def shot(pg, t):
    pg.evaluate(f"draw({t})")
    return pg.locator("canvas").screenshot(type="jpeg", quality=95)

def shard(i, n):
    with sync_playwright() as pw:
        b, pg, errs = open_page(pw)
        for f in range(i, N, n):
            (FR / f"f{f:04d}.jpg").write_bytes(shot(pg, f / 30))
        print("shard", i, "errors", errs); b.close()

if sys.argv[1] == "stills":
    ts = [float(x) for x in sys.argv[2:]]; ims = []
    with sync_playwright() as pw:
        b, pg, errs = open_page(pw)
        for t in ts:
            im = Image.open(io.BytesIO(shot(pg, t))); im.save(HERE / f"still_{t}.jpg", quality=88); ims.append(im.resize((360, 640)))
        print("errors", errs); b.close()
    out = Image.new("RGB", (370 * len(ims) + 10, 660), (20, 20, 20))
    for i, im in enumerate(ims): out.paste(im, (10 + i * 370, 10))
    out.save(HERE / "stills_sheet.jpg", quality=85)
else:
    shutil.rmtree(FR, ignore_errors=True); FR.mkdir()
    ps = [Process(target=shard, args=(i, 2)) for i in range(2)]; [p.start() for p in ps]; [p.join() for p in ps]
    media = HERE.parent / "media"; media.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FR / "f%04d.jpg"), "-frames:v", str(N), "-c:v", "libx264",
                    "-pix_fmt", "yuv420p", "-crf", "18", "-an", "-movflags", "+faststart", str(media / "r0.mp4")], check=True)
    im = Image.open(FR / "f0165.jpg").resize((280, 498)); top = (498 - 430) // 2
    im.crop((0, top, 280, top + 430)).save(media / "th0.jpg", quality=90)
    print("done")
