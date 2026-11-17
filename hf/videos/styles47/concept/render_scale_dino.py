"""Render the /scale dinosaur concept still -> scale_dino_still.jpg (1080x1920)."""
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
                                 "--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto((HERE / "scale_dino.html").resolve().as_uri() + "?export=1")
    pg.wait_for_function("document.title==='ok'", timeout=120000)
    pg.wait_for_timeout(300)
    pg.locator("#stage").screenshot(path=str(HERE / "scale_dino_still.jpg"), type="jpeg", quality=90)
    print("ok", errs)
    b.close()
