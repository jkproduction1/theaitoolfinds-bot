"""Render concept stills: python3 render.py name1 name2 ... -> <name>_still.jpg (1080x1920)."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent
with sync_playwright() as pw:
    b = pw.chromium.launch()
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    for n in sys.argv[1:]:
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((HERE / f"{n}.html").resolve().as_uri())
        pg.wait_for_function("document.title==='ok'", timeout=30000)
        pg.locator("canvas").screenshot(path=str(HERE / f"{n}_still.jpg"), type="jpeg", quality=88)
        print(n, "ok", errs)
    b.close()
