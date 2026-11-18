"""Render flat_bees.html (one process).
  python3 render_bees.py stills 0 2 4 ...        -> bees_sheet.jpg (story, with subtitles)
  python3 render_bees.py cstills 0 2 4 ...       -> bees_clean_sheet.jpg (clean app-demo variant)
  python3 render_bees.py video                   -> hf/work/bees55/renders/story_silent.mp4 (648 frames)
  python3 render_bees.py clean                   -> hf/videos/honey54/media/r0.mp4 (190 frames) + th0.jpg
"""
import sys, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent
ROOT = HERE.parent.parent.parent
mode = sys.argv[1]
clean = mode in ("cstills", "clean")
PAGE = (HERE / "flat_bees.html").resolve().as_uri() + ("?clean=1" if clean else "")
FR = HERE / ("frames_clean" if clean else "frames_story"); FR.mkdir(exist_ok=True)
N = 190 if clean else 648


def shoot(frames, prefix):
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920}); pg.set_default_timeout(240000); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(PAGE); pg.wait_for_function("document.title==='ok'", timeout=240000)
        for i, t in frames:
            pg.evaluate(f"draw({t})")
            pg.locator("canvas").screenshot(path=str(FR / f"{prefix}{i:04d}.jpg"), type="jpeg", quality=95)
        if errs: print("errors:", errs[:3])
        b.close()


if mode in ("stills", "cstills"):
    ts = [float(x) for x in sys.argv[2:]]
    shoot(list(enumerate(ts)), "s")
    from PIL import Image
    ims = [Image.open(FR / f"s{i:04d}.jpg") for i in range(len(ts))]
    out = Image.new("RGB", (410 * len(ims), 720), (20, 20, 20))
    for i, im in enumerate(ims): out.paste(im.resize((405, 720)), (i * 410, 0))
    out.save(HERE / ("bees_clean_sheet.jpg" if clean else "bees_sheet.jpg"), quality=85)
else:
    todo = [(i, i / 30) for i in range(N) if not (FR / f"f{i:04d}.jpg").exists() or (FR / f"f{i:04d}.jpg").stat().st_size < 1000]
    lim = int(sys.argv[2]) if len(sys.argv) > 2 else 9999
    print("todo", len(todo)); shoot(todo[:lim], "f")
    if len(todo) > lim: print("more"); sys.exit(0)
    if clean:
        med = ROOT / "videos" / "honey54" / "media"; med.mkdir(parents=True, exist_ok=True); out = med / "r0.mp4"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(FR / "f0150.jpg"), "-vf", "scale=280:-1,crop=280:430", str(med / "th0.jpg")], check=True)
    else:
        out = ROOT / "work" / "bees55" / "renders" / "story_silent.mp4"; out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FR / "f%04d.jpg"), "-frames:v", str(N),
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-an", str(out)], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out), "-vf", f"select='not(mod(n\\,{N // 8}))',scale=270:480,tile=8x1",
                    "-frames:v", "1", str(HERE / ("bees_clean_contact.jpg" if clean else "bees_contact.jpg"))], check=True)
    print("done", out)
