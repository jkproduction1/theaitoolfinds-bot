from pathlib import Path
from playwright.sync_api import sync_playwright
H=Path(__file__).parent
with sync_playwright() as pw:
    b=pw.chromium.launch(args=["--allow-file-access-from-files"]); pg=b.new_page(viewport={"width":1080,"height":1920})
    pg.goto((H/"stories.html").resolve().as_uri()); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
    for i in range(1,5): pg.locator(f"#s{i}").screenshot(path=str(H/f"story{i}.jpg"),type="jpeg",quality=92)
    b.close()
