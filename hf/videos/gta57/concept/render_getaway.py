"""Stills for getaway.html:  python3 render_getaway.py 0.6 3.2 5.8  -> getaway_s1..s3.jpg + getaway_sheet.jpg"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
HERE = Path(__file__).parent
ts = [float(x) for x in sys.argv[1:]] or [0.6, 3.2, 5.8]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--allow-file-access-from-files", "--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920}); pg.set_default_timeout(90000); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.goto((HERE / "getaway.html").resolve().as_uri()); pg.wait_for_function("document.title==='ok'")
    ims = []
    for i, t in enumerate(ts):
        pg.evaluate(f"draw({t})"); p = HERE / f"getaway_s{i+1}.jpg"
        pg.locator("#stage").screenshot(path=str(p), type="jpeg", quality=92); ims.append(Image.open(p))
    if errs: print("errors:", errs[:5])
    b.close()
out = Image.new("RGB", (550 * len(ims) - 10, 960), (15, 15, 15))
for i, im in enumerate(ims): out.paste(im.resize((540, 960)), (i * 550, 0))
out.save(HERE / "getaway_sheet.jpg", quality=88); print("ok")
