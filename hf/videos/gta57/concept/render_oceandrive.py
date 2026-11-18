"""Style frames for gta57 r2 (/street-view Ocean Drive like GTA 6). Stills only for now (Jan approves the look first).
  python3 render_oceandrive.py                -> oceandrive_s1..s3.jpg (t = 0.6, 3.2, 5.8) + oceandrive_sheet.jpg
  python3 render_oceandrive.py 1.0 4.0        -> test stills test_<t>.jpg
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

HERE = Path(__file__).parent
ts = [float(a) for a in sys.argv[1:]]
final = not ts
ts = ts or [0.6, 3.2, 5.8]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.set_default_timeout(600000)
    pg.goto((HERE / "oceandrive.html").resolve().as_uri())
    pg.wait_for_function("document.title==='ok'", timeout=600000)
    out = []
    for i, t in enumerate(ts):
        pg.evaluate(f"draw({t})")
        p = HERE / (f"oceandrive_s{i+1}.jpg" if final else f"test_{t}.jpg")
        pg.locator("#stage").screenshot(path=str(p), type="jpeg", quality=92)
        out.append(p)
    if errs:
        print("errors:", errs[:5])
    b.close()
ims = [Image.open(p).resize((540, 960), Image.LANCZOS) for p in out]
sheet = Image.new("RGB", (540 * len(ims), 960), (20, 20, 20))
for i, im in enumerate(ims):
    sheet.paste(im, (i * 540, 0))
sheet.save(HERE / ("oceandrive_sheet.jpg" if final else "test_sheet.jpg"), quality=88)
print("ok", [p.name for p in out])
