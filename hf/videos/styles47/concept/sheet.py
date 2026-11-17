"""Contact sheet of a scene: python3 sheet.py <k> t1 t2 ... -> sheet<k>.jpg ; also writes full frames f<k>_<t>.jpg with --full"""
import sys, io, http.server, threading, functools
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent
k = int(sys.argv[1]); ts = [float(x) for x in sys.argv[2:] if x != "--full"]; full = "--full" in sys.argv
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(HERE.parent)))
srv.RequestHandlerClass.log_message = lambda *a: None
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/concept/harness.html"); pg.wait_for_function("document.title==='ok'")
    ims = []
    for t in ts:
        pg.evaluate(f"SCN[{k}]({t})")
        im = Image.open(io.BytesIO(pg.locator(f"#cv{k}").screenshot(type="jpeg", quality=90)))
        if full: im.save(HERE / f"f{k}_{t}.jpg", quality=88)
        ims.append(im.resize((360, 640)))
    print("errors:", errs); b.close()
out = Image.new("RGB", (370 * len(ims) + 10, 660), (20, 20, 20))
for i, im in enumerate(ims): out.paste(im, (10 + i * 370, 10))
out.save(HERE / f"sheet{k}.jpg", quality=85)
