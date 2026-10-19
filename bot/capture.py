"""Take a clean full-page screenshot of the tool's website with a headless browser."""
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

from . import config

COOKIE_BUTTONS = re.compile(
    r"^(accept( all)?( cookies)?|allow all|agree|i agree|got it|ok(ay)?|reject all|"
    r"decline|only necessary|close)$", re.I,
)
MAX_PAGE_HEIGHT = 7000


def screenshot(url: str, out_png: Path) -> Path:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": 1200, "height": 900}, device_scale_factor=1,
            user_agent=config.USER_AGENT, locale="en-US", color_scheme="dark",
        )
        page = ctx.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=45_000)
        try:
            page.wait_for_load_state("networkidle", timeout=12_000)
        except Exception:
            pass
        page.wait_for_timeout(2500)

        title = (page.title() or "").lower()
        if any(m in title for m in ("just a moment", "access denied", "attention required")):
            browser.close()
            raise RuntimeError("site blocked headless browser")

        # Close cookie / newsletter popups so they don't cover the site
        for b in page.get_by_role("button").all()[:60]:
            try:
                if b.is_visible() and COOKIE_BUTTONS.match((b.inner_text() or "").strip()):
                    b.click(timeout=1500)
                    page.wait_for_timeout(600)
                    break
            except Exception:
                continue
        page.keyboard.press("Escape")

        # Scroll down slowly so lazy images / animations load, then back to top
        height = min(page.evaluate("document.body.scrollHeight") or 900, MAX_PAGE_HEIGHT)
        for y in range(0, height, 700):
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(250)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1500)

        # Sticky headers repeat in full-page shots; turn fixed elements into absolute
        page.add_style_tag(content="""
            *[style*='position: fixed'], *[style*='position:fixed'] { position: absolute !important; }
        """)
        page.evaluate("""() => {
            for (const el of document.querySelectorAll('body *')) {
                const s = getComputedStyle(el);
                if (s.position === 'fixed' || s.position === 'sticky') {
                    const r = el.getBoundingClientRect();
                    // keep the top nav bar, hide floating chat bubbles / banners
                    if (r.top < 5 && r.height < 140) { el.style.position = 'absolute'; }
                    else { el.style.display = 'none'; }
                }
            }
        }""")
        page.screenshot(
            path=str(out_png), full_page=True,
            clip={"x": 0, "y": 0, "width": 1200,
                  "height": min(page.evaluate("document.body.scrollHeight") or 900,
                                MAX_PAGE_HEIGHT)},
        )
        browser.close()
    return out_png
