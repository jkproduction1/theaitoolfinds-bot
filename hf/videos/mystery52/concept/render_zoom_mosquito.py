"""Render zoom_mosquito.html.
  python3 render_zoom_mosquito.py stills 0 2 4 6      -> still_<t>.jpg + stills_sheet.jpg
  python3 render_zoom_mosquito.py video               -> ../media/r2.mp4 (190 frames, 30 fps, 2 shards) + ../media/th2.jpg
"""
import sys, subprocess, shutil
from pathlib import Path
from multiprocessing import Process
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent
PAGE = (HERE / "zoom_mosquito.html").resolve().as_uri()
FR = HERE / "frames_zoom_mosquito"; N = 190; K = 2


def shard(frames, prefix):
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920}); pg.set_default_timeout(240000); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PAGE); pg.wait_for_function("document.title==='ok'", timeout=240000)
        for i, t in frames:
            if prefix == "f" and (FR / f"{prefix}{i:04d}.jpg").exists() and (FR / f"{prefix}{i:04d}.jpg").stat().st_size > 1000 and False: continue
            pg.evaluate(f"draw({t})")
            pg.locator("canvas").screenshot(path=str(FR / f"{prefix}{i:04d}.jpg"), type="jpeg", quality=95)
        if errs: print("errors:", errs)
        b.close()


if __name__ == "__main__":
    FR.mkdir(exist_ok=True)
    if sys.argv[1] == "stills":
        ts = [float(x) for x in sys.argv[2:]]
        shard([(i, t) for i, t in enumerate(ts)], "s")
        from PIL import Image
        ims = [Image.open(FR / f"s{i:04d}.jpg") for i in range(len(ts))]
        out = Image.new("RGB", (550 * len(ims), 960), (20, 20, 20))
        for i, im in enumerate(ims): out.paste(im.resize((540, 960)), (i * 550, 0))
        out.save(HERE / "zoom_mosquito_sheet.jpg", quality=85)
        if len(sys.argv) > 2 and sys.argv[1] == "stills" and ts == [0.6, 3.2, 5.6]:
            for i in range(3): ims[i].convert("RGB").save(HERE / f"zoom_mosquito_s{i+1}.jpg", quality=90)
    else:
        fr = [(i, i / 30) for i in range(N) if not (FR / f"f{i:04d}.jpg").exists() or (FR / f"f{i:04d}.jpg").stat().st_size < 1000]
        print("todo", len(fr))
        ps = [Process(target=shard, args=(fr[j::2], "f")) for j in range(2)]
        [p.start() for p in ps]; [p.join() for p in ps]
        med = HERE.parent / "media"; med.mkdir(exist_ok=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FR / "f%04d.jpg"), "-frames:v", str(N),
                        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-an", str(med / f"r{K}.mp4")], check=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(FR / "f0165.jpg"), "-vf", "scale=280:-1,crop=280:430",
                        str(med / f"th{K}.jpg")], check=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(med / f"r{K}.mp4"), "-vf", "select='not(mod(n\\,24))',scale=270:480,tile=8x1",
                        "-frames:v", "1", str(HERE / "zoom_mosquito_contact.jpg")], check=True)
        print("done")
