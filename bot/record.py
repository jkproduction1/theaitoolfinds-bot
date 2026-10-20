"""Screen-record a real session with the tool: open it, type a prompt, click, wait for the
result. Logs where/when the (fake, visible) cursor acts so the video can zoom like
Screen Studio, and squeezes long loading waits so nobody watches a spinner.

Steps (in the storyboard "recordings": [{"url": ..., "steps": [...]}]):
  {"click": "Generate"}                       text of a button/link, or "css:<selector>"
  {"type": "a raccoon DJ...", "into": "css:textarea"}
  {"wait_for": "css:img.result", "timeout": 150}   loading -> fast-forwarded
  {"wait": 1.5}
  {"scroll": 600}
  {"hover": "css:.gallery img"}
  {"upload": "assets/x.jpg", "into": "css:input[type=file]"}

Probe mode (python -m bot.record --probe URL) dumps the page's inputs/buttons and a
screenshot into logs/ so Claude can write the steps without seeing the site.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

from . import config
from .capture import COOKIE_BUTTONS

VW, VH = 1080, 1200  # near-square: frames nicely inside a 9:16 video

CURSOR_JS = r"""
(() => {
  if (window.__cur) return;
  const mk = () => {
    const c = document.createElement('div');
    c.id = '__cur';
    c.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M4 2l16 9.5-7 1.6-3.6 6.9z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    Object.assign(c.style, {position: 'fixed', left: '0px', top: '0px', zIndex: 2147483647,
      pointerEvents: 'none', transform: 'translate(-4px,-3px)', transition: 'none'});
    const r = document.createElement('div');
    Object.assign(r.style, {position: 'fixed', width: '60px', height: '60px', borderRadius: '50%',
      background: 'rgba(255,214,10,0.55)', zIndex: 2147483646, pointerEvents: 'none',
      transform: 'translate(-50%,-50%) scale(0)', transition: 'transform .35s, opacity .35s', opacity: 0});
    document.documentElement.appendChild(r);
    document.documentElement.appendChild(c);
    window.__cur = c;
    addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', e => {
      r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
      r.style.transition = 'none'; r.style.transform = 'translate(-50%,-50%) scale(0.2)'; r.style.opacity = 1;
      requestAnimationFrame(() => { r.style.transition = 'transform .4s, opacity .4s';
        r.style.transform = 'translate(-50%,-50%) scale(1)'; r.style.opacity = 0; });
    }, true);
  };
  if (document.documentElement) mk(); else addEventListener('DOMContentLoaded', mk);
})();
"""


def _loc(page, target):
    if target.startswith("css:"):
        return page.locator(target[4:]).first
    for fn in (lambda: page.get_by_role("button", name=target),
               lambda: page.get_by_role("link", name=target),
               lambda: page.get_by_placeholder(target),
               lambda: page.get_by_text(target, exact=False)):
        loc = fn().first
        try:
            if loc.count() and loc.is_visible():
                return loc
        except Exception:
            continue
    return page.get_by_text(target).first


class _Rec:
    def __init__(self, page):
        self.page, self.t0, self.ev = page, time.time(), []
        self.x, self.y = VW * 0.5, VH * 0.6

    def t(self):
        return round(time.time() - self.t0, 3)

    def log(self, kind, x=None, y=None, **kw):
        self.ev.append({"t": self.t(), "kind": kind, "x": round((x if x is not None else self.x) / VW, 4),
                        "y": round((y if y is not None else self.y) / VH, 4), **kw})

    def move_to(self, loc):
        loc.scroll_into_view_if_needed(timeout=8000)
        b = loc.bounding_box()
        if not b:
            return
        tx, ty = b["x"] + b["width"] * 0.5, b["y"] + min(b["height"] * 0.5, 40)
        steps = 28  # eased glide, ~0.6 s
        for i in range(1, steps + 1):
            k = i / steps
            e = 1 - (1 - k) ** 3
            self.page.mouse.move(self.x + (tx - self.x) * e, self.y + (ty - self.y) * e)
            self.page.wait_for_timeout(20)
        self.x, self.y = tx, ty
        self.log("move")


def _dismiss(page):
    for b in page.get_by_role("button").all()[:60]:
        try:
            if b.is_visible() and COOKIE_BUTTONS.match((b.inner_text() or "").strip()):
                b.click(timeout=1500)
                page.wait_for_timeout(500)
                return
        except Exception:
            continue


def run(url: str, steps: list, out_dir: Path, name="rec0") -> dict:
    out_dir.mkdir(parents=True, exist_ok=True)
    vdir = out_dir / f"{name}_raw"
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=1,
                             user_agent=config.USER_AGENT, locale="en-US", color_scheme="dark",
                             record_video_dir=str(vdir), record_video_size={"width": VW, "height": VH})
        ctx.add_init_script(CURSOR_JS)
        page = ctx.new_page()
        r = _Rec(page)
        page.goto(url, wait_until="domcontentloaded", timeout=60_000)
        try:
            page.wait_for_load_state("networkidle", timeout=15_000)
        except Exception:
            pass
        _dismiss(page)
        page.evaluate(CURSOR_JS)
        page.mouse.move(r.x, r.y)
        r.log("start")
        page.wait_for_timeout(800)
        for st in steps:
            try:
                if "click" in st:
                    loc = _loc(page, st["click"])
                    r.move_to(loc)
                    page.wait_for_timeout(150)
                    r.log("click")
                    loc.click(timeout=10_000)
                    page.wait_for_timeout(400)
                elif "type" in st:
                    loc = _loc(page, st.get("into", "css:textarea"))
                    r.move_to(loc)
                    loc.click(timeout=10_000)
                    try:
                        loc.fill("")
                    except Exception:
                        pass
                    r.log("type_start")
                    page.keyboard.type(st["type"], delay=38)
                    r.log("type_end")
                    page.wait_for_timeout(300)
                elif "upload" in st:
                    loc = _loc(page, st.get("into", "css:input[type=file]"))
                    loc.set_input_files(str(config.ROOT / st["upload"]))
                    r.log("upload")
                    page.wait_for_timeout(1200)
                elif "wait_for" in st:
                    r.log("wait_start")
                    _loc(page, st["wait_for"]).wait_for(state="visible",
                                                      timeout=int(st.get("timeout", 120)) * 1000)
                    page.wait_for_timeout(int(st.get("settle", 1.2) * 1000))
                    r.log("wait_end")
                    if st.get("reveal", True):  # zoom target: the result itself
                        try:
                            b = _loc(page, st["wait_for"]).bounding_box()
                            if b:
                                r.log("reveal", b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)
                        except Exception:
                            pass
                elif "wait" in st:
                    page.wait_for_timeout(int(float(st["wait"]) * 1000))
                elif "scroll" in st:
                    page.mouse.wheel(0, int(st["scroll"]))
                    r.log("scroll")
                    page.wait_for_timeout(900)
                elif "hover" in st:
                    r.move_to(_loc(page, st["hover"]))
                    page.wait_for_timeout(600)
            except Exception as e:
                print(f"[record] step {st} failed: {str(e)[:160]}")
                r.log("fail")
        page.wait_for_timeout(1500)
        r.log("end")
        page.screenshot(path=str(out_dir / f"{name}_last.png"))
        video = page.video.path()
        ctx.close()
        br.close()
    return _finish(Path(video), r.ev, out_dir, name)


def _finish(webm: Path, ev: list, out_dir: Path, name: str) -> dict:
    """webm -> mp4, fast-forwarding each loading wait down to ~0.7 s."""
    # the video starts a bit before our t0 (page creation); align on first frame ~0
    cuts = []  # (start, end) in seconds to squeeze
    ws = None
    for e in ev:
        if e["kind"] == "wait_start":
            ws = e["t"]
        elif e["kind"] == "wait_end" and ws is not None:
            if e["t"] - ws > 1.6:
                cuts.append((ws + 0.4, e["t"] - 0.6))
            ws = None
    mp4 = out_dir / f"{name}.mp4"
    if cuts:
        parts, cur, i = [], 0.0, 0
        filt = []
        for a, b in cuts:
            filt.append(f"[0:v]trim={cur}:{a},setpts=PTS-STARTPTS[v{i}]"); i += 1
            # the waiting part plays at high speed so it lasts ~0.4 s (shows "it's working")
            sp = max(1.0, (b - a) / 0.4)
            filt.append(f"[0:v]trim={a}:{b},setpts=(PTS-STARTPTS)/{sp:.3f}[v{i}]"); i += 1
            cur = b
        filt.append(f"[0:v]trim=start={cur},setpts=PTS-STARTPTS[v{i}]"); i += 1
        fc = ";".join(filt) + ";" + "".join(f"[v{k}]" for k in range(i)) + f"concat=n={i}:v=1:a=0[out]"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(webm), "-filter_complex", fc,
                        "-map", "[out]", "-r", "30", "-c:v", "libx264", "-crf", "18",
                        "-pix_fmt", "yuv420p", str(mp4)], check=True)

        def remap(t):
            out, last = 0.0, 0.0
            for a, b in cuts:
                if t <= a:
                    return out + (t - last)
                out += a - last
                if t <= b:
                    return out + (t - a) / max(1.0, (b - a) / 0.4)
                out += (b - a) / max(1.0, (b - a) / 0.4)
                last = b
            return out + (t - last)

        for e in ev:
            e["t"] = round(remap(e["t"]), 3)
    else:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(webm), "-r", "30",
                        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", str(mp4)], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
                                "default=nw=1:nk=1", str(mp4)], capture_output=True, text=True).stdout)
    meta = {"path": str(mp4), "w": VW, "h": VH, "dur": round(dur, 3), "events": ev}
    (out_dir / f"{name}.json").write_text(json.dumps(meta, indent=1))
    print(f"[record] {name}: {dur:.1f}s, {len(ev)} events, squeezed {len(cuts)} waits")
    return meta


def probe(url: str, out: Path):
    """Dump what's on the page so the steps can be written blind."""
    out.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": VW, "height": VH}, user_agent=config.USER_AGENT,
                             locale="en-US", color_scheme="dark")
        page = ctx.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=60_000)
        try:
            page.wait_for_load_state("networkidle", timeout=20_000)
        except Exception:
            pass
        page.wait_for_timeout(4000)
        _dismiss(page)
        info = page.evaluate("""() => {
          const vis = el => { const r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4; };
          const pick = (sel) => [...document.querySelectorAll(sel)].filter(vis).slice(0, 40).map(el => {
            const r = el.getBoundingClientRect();
            return {tag: el.tagName.toLowerCase(), id: el.id || '', cls: (el.className || '').toString().slice(0, 80),
              text: (el.innerText || el.value || '').trim().slice(0, 60), ph: el.placeholder || '',
              type: el.type || '', aria: el.getAttribute('aria-label') || '',
              box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]};
          });
          return {title: document.title, url: location.href,
            iframes: [...document.querySelectorAll('iframe')].map(f => f.src).slice(0, 5),
            inputs: pick('textarea, input, [contenteditable=true]'),
            buttons: pick('button, [role=button], a.btn, input[type=submit]'),
            images: pick('img').slice(0, 15)};
        }""")
        page.screenshot(path=str(out / "probe.png"))
        br.close()
    (out / "probe.json").write_text(json.dumps(info, indent=1))
    print(json.dumps(info, indent=1)[:6000])


if __name__ == "__main__":
    if sys.argv[1] == "--probe":
        probe(sys.argv[2], config.ROOT / "logs")
    else:
        sb = json.loads(Path(sys.argv[1]).read_text())
        for i, rc in enumerate(sb.get("recordings", [])):
            run(rc["url"], rc["steps"], config.ROOT / "out" / "rec_test", f"rec{i}")
