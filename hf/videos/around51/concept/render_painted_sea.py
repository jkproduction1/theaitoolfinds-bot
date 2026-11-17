"""python3 render_painted_sea.py stills [t1 t2 t3]  -> painted_sea_s1.jpg.._s3.jpg (default 0.6 3.2 5.6) + painted_sea_sheet.jpg
   python3 render_painted_sea.py video              -> ../media/r2.mp4 (190 frames, 2 shards) + ../media/th2.jpg"""
import sys, io, subprocess, shutil
from pathlib import Path
from multiprocessing import Process
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent; PAGE = (HERE / "painted_sea.html").resolve().as_uri()
FR = HERE / "frames_painted_sea"; N = 190; K = 2

def open_page(pw):
    b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.goto(PAGE); pg.wait_for_function("document.title==='ok'", timeout=90000)
    return b, pg, errs

def shot(pg, t, q=95):
    pg.evaluate(f"draw({t})")
    return pg.locator("canvas").screenshot(type="jpeg", quality=q)

def shard(i, n):
    with sync_playwright() as pw:
        b, pg, errs = open_page(pw)
        for f in range(i, N, n):
            (FR / f"f{f:04d}.jpg").write_bytes(shot(pg, f / 30))
        print("shard", i, "errors", errs); b.close()

if __name__ == "__main__":
    if sys.argv[1] == "stills":
        ts = [float(x) for x in sys.argv[2:]] or [0.6, 3.2, 5.6]; ims = []
        with sync_playwright() as pw:
            b, pg, errs = open_page(pw)
            for i, t in enumerate(ts):
                im = Image.open(io.BytesIO(shot(pg, t))).convert("RGB"); im.save(HERE / f"painted_sea_s{i+1}.jpg", quality=90); ims.append(im.resize((540, 960)))
            print("errors", errs); b.close()
        out = Image.new("RGB", (550 * len(ims) + 10, 980), (20, 20, 20))
        for i, im in enumerate(ims): out.paste(im, (10 + i * 550, 10))
        out.save(HERE / "painted_sea_sheet.jpg", quality=85)
    else:
        shutil.rmtree(FR, ignore_errors=True); FR.mkdir()
        ps = [Process(target=shard, args=(i, 2)) for i in range(2)]; [p.start() for p in ps]; [p.join() for p in ps]
        media = HERE.parent / "media"; media.mkdir(exist_ok=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FR / "f%04d.jpg"), "-frames:v", str(N), "-c:v", "libx264",
                        "-pix_fmt", "yuv420p", "-crf", "18", "-an", "-movflags", "+faststart", str(media / f"r{K}.mp4")], check=True)
        im = Image.open(FR / "f0165.jpg").resize((280, 498)); top = (498 - 430) // 2
        im.crop((0, top, 280, top + 430)).save(media / f"th{K}.jpg", quality=90)
        print("done")
