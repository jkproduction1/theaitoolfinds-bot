"""Style frames of map3d.html (gta57 r0). No video here: Jan approves the stills first.
  python3 render_map3d.py stills 0.6 3.2 5.8   -> map3d_s1..sN.jpg + map3d_sheet.jpg
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
HERE = Path(__file__).parent
PAGE = (HERE / "map3d.html").resolve().as_uri()

if __name__ == "__main__":
    ts = [float(x) for x in sys.argv[2:]] or [0.6, 3.2, 5.8]
    with sync_playwright() as pw:
        b = pw.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--allow-file-access-from-files"])
        pg = b.new_page(viewport={"width": 1080, "height": 1920}); pg.set_default_timeout(600000); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
        pg.goto(PAGE); pg.wait_for_function("document.title==='ok'", timeout=600000)
        ims = []
        for i, t in enumerate(ts):
            pg.evaluate(f"draw({t})"); pg.wait_for_timeout(200)
            p = HERE / f"map3d_s{i+1}.jpg"
            pg.locator("#stage").screenshot(path=str(p), type="jpeg", quality=92); ims.append(Image.open(p))
        if errs: print("errors:", errs[:5])
        b.close()
    out = Image.new("RGB", (550 * len(ims) - 10, 960), (12, 12, 12))
    for i, im in enumerate(ims): out.paste(im.resize((540, 960), Image.LANCZOS), (i * 550, 0))
    out.save(HERE / "map3d_sheet.jpg", quality=88); print("done", len(ims))
