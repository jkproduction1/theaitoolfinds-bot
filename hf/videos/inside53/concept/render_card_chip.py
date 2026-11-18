"""Render inside53 r2 (/explain-3d how a card chip pays) -> ../media/r2.mp4 + th2.jpg, one browser process.
  python3 render_card_chip.py 0.5 2.3 3.6 5.6   -> test stills + card_chip_sheet.jpg
  python3 render_card_chip.py                   -> video (resumable: frames kept in frames_card_chip/)"""
import subprocess, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent; MEDIA = HERE.parent / "media"; MEDIA.mkdir(exist_ok=True)
FR = HERE / "frames_card_chip"; FR.mkdir(exist_ok=True); N = 190
tests = [float(a) for a in sys.argv[1:]]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto((HERE / "card_chip.html").resolve().as_uri()); pg.wait_for_function("document.title==='ok'", timeout=120000)
    st = pg.locator("#stage")
    jobs = [(f"t{t:.2f}", t) for t in tests] if tests else [(f"f{i:04d}", i / 30) for i in range(N) if not (FR / f"f{i:04d}.jpg").exists()]
    for nm, t in jobs:
        pg.evaluate("t => window.renderAt(t)", t); st.screenshot(path=str(FR / f"{nm}.jpg"), type="jpeg", quality=92)
    print("errors:", errs); b.close()
if tests:
    from PIL import Image
    ims = [Image.open(FR / f"t{t:.2f}.jpg") for t in tests]; out = Image.new("RGB", (550 * len(ims), 960), (20, 20, 20))
    for i, im in enumerate(ims): out.paste(im.resize((540, 960)), (i * 550, 0))
    out.save(HERE / "card_chip_sheet.jpg", quality=85)
else:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", str(FR / "f%04d.jpg"), "-frames:v", str(N), "-c:v", "libx264",
                    "-pix_fmt", "yuv420p", "-crf", "18", str(MEDIA / "r2.mp4")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(FR / "f0165.jpg"), "-vf", "scale=280:-2,crop=280:430", "-q:v", "3", str(MEDIA / "th2.jpg")], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(MEDIA / "r2.mp4"), "-vf", "select='not(mod(n\\,24))',scale=270:480,tile=8x1",
                    "-frames:v", "1", str(HERE / "card_chip_contact.jpg")], check=True)
    print("ok", MEDIA / "r2.mp4")
