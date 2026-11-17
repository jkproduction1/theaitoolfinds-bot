"""python3 hf/page/test_page.py -> opens the page in the three modes at phone width, prints errors + key facts, writes _shot_*.jpg"""
from pathlib import Path
from playwright.sync_api import sync_playwright
H = Path(__file__).parent
MODES = {"plain": "", "v": "?v=storm45", "vnew": "?v=mystery52", "ct": "?c=paper-collage|flat-science&t=why%20cats%20purr|why%20we%20dream", "bad": "?v=doesnotexist"}
with sync_playwright() as pw:
    b = pw.chromium.launch(args=["--allow-file-access-from-files"])
    for name, qs in MODES.items():
        pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((H / "free-prompts.html").resolve().as_uri() + qs); pg.wait_for_timeout(600)
        info = pg.evaluate("""() => ({vm: document.querySelector('.fp').className, cards: document.querySelectorAll('#vidcards .card').length,
          pack: getComputedStyle(document.getElementById('pack')).display, packText: document.getElementById('packp').textContent,
          top: document.getElementById('selltop').hidden, order: Array.from(document.querySelectorAll('#selltop,#vidbox,.box.sell:not(.topo),#pack')).map(e => e.id || 'sell'),
          links: Array.from(document.querySelectorAll('a.paid')).map(a => a.href.split('LAUNCH')[1])})""")
        print(name, errs, info)
        pg.screenshot(path=str(H / f"_shot_{name}.jpg"), type="jpeg", quality=70, full_page=True); pg.close()
    b.close()
