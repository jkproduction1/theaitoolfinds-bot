"""Video renderer v2 - frame-by-frame with Pillow, piped into ffmpeg.

Every sentence of the voiceover gets its own scene, scenes alternate between
different looks (hook, browser zoom, scroll, punch-in detail, feature cards, CTA)
and are joined with quick slide / zoom transitions. Subtitles are burned on top
(word-by-word highlight) a bit below the centre of the frame.
"""
import math
import random
import re
import subprocess
from io import BytesIO
from pathlib import Path
from urllib.parse import urlparse

import requests
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from . import config as C

W, H, FPS = C.W, C.H, C.FPS
TRANS = 0.28  # transition length (s)

# browser card geometry
CX, CY, CW, CH = 60, 380, 960, 1180
BAR = 56
CONTENT_H = CH - BAR


# ---------------------------------------------------------------- helpers
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(u):
    return 0.5 - 0.5 * math.cos(math.pi * clamp(u))


def ease_out(u):
    u = clamp(u)
    return 1 - (1 - u) ** 3


def back_out(u):
    u = clamp(u)
    c1 = 1.70158
    return 1 + (c1 + 1) * (u - 1) ** 3 + c1 * (u - 1) ** 2


def font(path, size):
    return ImageFont.truetype(str(path), int(size))


def fit_font(text, path, max_w, start, min_size=44):
    d = ImageDraw.Draw(Image.new("L", (1, 1)))
    size = start
    while size > min_size and d.textlength(text, font=font(path, size)) > max_w:
        size -= 4
    return font(path, size)


def rounded_mask(w, h, r):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), radius=r, fill=255)
    return m


def shadow(w, h, r=34, blur=30, strength=190):
    pad = blur * 3
    s = Image.new("L", (w + pad * 2, h + pad * 2), 0)
    ImageDraw.Draw(s).rounded_rectangle((pad, pad + 20, pad + w, pad + h + 20), radius=r,
                                        fill=strength)
    return s.filter(ImageFilter.GaussianBlur(blur)), pad


def paste_scaled(canvas, layer, cx, cy, scale, alpha=1.0):
    """Paste an RGBA layer centred at (cx, cy) with scale and opacity."""
    if scale <= 0.01 or alpha <= 0.01:
        return
    w, h = max(1, int(layer.width * scale)), max(1, int(layer.height * scale))
    lay = layer.resize((w, h), Image.BICUBIC) if (w, h) != layer.size else layer
    if alpha < 1:
        a = lay.getchannel("A").point(lambda v: int(v * alpha))
        lay = lay.copy()
        lay.putalpha(a)
    canvas.paste(lay, (int(cx - w / 2), int(cy - h / 2)), lay)


# ---------------------------------------------------------------- assets
class Assets:
    def __init__(self, title, category, url, screenshot: Path, features, og_image=""):
        self.title, self.category = title, category
        self.host = urlparse(url).netloc.replace("www.", "")
        self.features = [f for f in (features or []) if f][:4]

        page = Image.open(screenshot).convert("RGB")
        min_h = int(page.width * 1.35)  # short pages: pad so zooms/crops never run out
        if page.height < min_h:
            pad = Image.new("RGB", (page.width, min_h),
                            page.getpixel((page.width // 2, page.height - 1)))
            pad.paste(page, (0, 0))
            page = pad
        self.page = page
        self.pw, self.ph = page.size
        self.hero = page.crop((0, 0, self.pw, min(self.ph, int(self.pw * 0.75))))

        # gradient + glow base
        strip = Image.new("RGB", (1, H))
        for y in range(H):
            k = y / H
            strip.putpixel((0, y), tuple(int(C.BG_TOP[i] * (1 - k) + C.BG_BOTTOM[i] * k)
                                         for i in range(3)))
        base = strip.resize((W, H))
        glow = Image.new("L", (W, H), 0)
        ImageDraw.Draw(glow).ellipse((-150, 500, W + 150, 1500), fill=90)
        glow = glow.filter(ImageFilter.GaussianBlur(170))
        base.paste(Image.new("RGB", (W, H), (110, 60, 255)), (0, 0), glow)
        self.base = base

        # blurred, darkened website as background
        hb = self.hero.copy()
        s = H / hb.height
        hb = hb.resize((int(hb.width * s), H), Image.BICUBIC)
        x0 = (hb.width - W) // 2
        hb = hb.crop((x0, 0, x0 + W, H)).filter(ImageFilter.GaussianBlur(38))
        self.blur_bg = Image.blend(hb, Image.new("RGB", (W, H), (8, 6, 16)), 0.62)

        # browser bar (drawn once)
        bar = Image.new("RGB", (CW, BAR), (38, 38, 48))
        d = ImageDraw.Draw(bar)
        for i, col in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
            cx = 34 + i * 30
            d.ellipse((cx - 9, 19, cx + 9, 37), fill=col)
        d.rounded_rectangle((140, 12, CW - 30, 44), radius=16, fill=(58, 58, 70))
        d.text((160, 28), self.host, font=font(C.FONT_MEDIUM, 24), fill=(220, 220, 230),
               anchor="lm")
        self.bar = bar
        self.card_mask = rounded_mask(CW, CH, 30)
        self.card_shadow, self.card_pad = shadow(CW, CH)

        self.og = None
        if og_image.startswith("http"):
            try:
                r = requests.get(og_image, timeout=15, headers={"User-Agent": C.USER_AGENT})
                self.og = Image.open(BytesIO(r.content)).convert("RGB")
            except Exception:
                self.og = None

        self.title_layer = self._title_layer()
        self.pill_layer = self._pill("AI TOOL OF THE DAY")

    # --- reusable layers
    def _pill(self, text, size=36):
        f = font(C.FONT_BOLD, size)
        tw = ImageDraw.Draw(Image.new("L", (1, 1))).textlength(text, font=f)
        lay = Image.new("RGBA", (int(tw) + 64, size + 32), (0, 0, 0, 0))
        d = ImageDraw.Draw(lay)
        d.rounded_rectangle((0, 0, lay.width - 1, lay.height - 1), radius=lay.height // 2,
                            fill=C.ACCENT + (255,))
        d.text((lay.width / 2, lay.height / 2), text, font=f, fill=(15, 15, 20), anchor="mm")
        return lay

    def _title_layer(self):
        f = fit_font(self.title, C.FONT_BLACK, W - 100, 124, 70)
        lay = Image.new("RGBA", (W, f.size + 60), (0, 0, 0, 0))
        d = ImageDraw.Draw(lay)
        d.text((W / 2, lay.height / 2), self.title, font=f, fill=(255, 255, 255, 255),
               anchor="mm", stroke_width=3, stroke_fill=(0, 0, 0, 160))
        return lay

    def feature_layer(self, idx, text):
        lay = Image.new("RGBA", (920, 250), (0, 0, 0, 0))
        d = ImageDraw.Draw(lay)
        d.rounded_rectangle((0, 0, 919, 249), radius=40, fill=(20, 18, 34, 235),
                            outline=C.ACCENT + (255,), width=4)
        d.ellipse((50, 65, 170, 185), fill=C.ACCENT + (255,))
        d.line((82, 128, 105, 152, 140, 100), fill=(15, 15, 20, 255), width=13, joint="curve")
        d.text((210, 70), f"0{idx}", font=font(C.FONT_BOLD, 36), fill=C.ACCENT + (255,))
        f = fit_font(text, C.FONT_BLACK, 660, 68, 40)
        d.text((210, 165), text, font=f, fill=(255, 255, 255, 255), anchor="lm")
        return lay

    # --- browser card with a view rectangle of the page
    def browser(self, canvas, view, scale=1.0, dy=0, src=None):
        src = src or self.page
        content = src.resize((CW, CONTENT_H), Image.BICUBIC, box=view)
        card = Image.new("RGB", (CW, CH))
        card.paste(self.bar, (0, 0))
        card.paste(content, (0, BAR))
        cx, cy = CX + CW / 2, CY + CH / 2 + dy
        if scale != 1.0:
            w, h = int(CW * scale), int(CH * scale)
            card = card.resize((w, h), Image.BICUBIC)
            mask = self.card_mask.resize((w, h), Image.BICUBIC)
        else:
            w, h, mask = CW, CH, self.card_mask
        sh = self.card_shadow if scale == 1.0 else self.card_shadow.resize(
            (int(self.card_shadow.width * scale), int(self.card_shadow.height * scale)))
        canvas.paste((0, 0, 0), (int(cx - sh.width / 2), int(cy - sh.height / 2)), sh)
        canvas.paste(card, (int(cx - w / 2), int(cy - h / 2)), mask)

    def view_at(self, x_center, y_top, view_w):
        view_w = min(view_w, self.pw)
        view_h = view_w * CONTENT_H / CW
        x0 = clamp(x_center - view_w / 2, 0, self.pw - view_w)
        y0 = clamp(y_top, 0, max(0, self.ph - view_h))
        return (x0, y0, x0 + view_w, y0 + view_h)


# ---------------------------------------------------------------- scenes
# each scene: fn(assets, u (0..1 progress), t (seconds in scene), dur, ctx) -> Image

def sc_hook(a, u, t, dur, ctx):
    img = a.blur_bg.copy()
    a.browser(img, a.view_at(a.pw / 2, 0, a.pw), scale=0.86 + 0.06 * (1 - ease_out(u * 1.5)),
              dy=170)
    paste_scaled(img, a.pill_layer, W / 2, 250, back_out(t / 0.35))
    paste_scaled(img, a.title_layer, W / 2, 375, back_out((t - 0.12) / 0.4),
                 alpha=clamp((t - 0.12) / 0.15))
    return img


def sc_zoom(a, u, t, dur, ctx):
    img = a.base.copy()
    z = ease(u)
    w0, w1 = a.pw, a.pw * 0.62
    focus = ctx.get("focus", (a.pw * 0.5, 120))
    a.browser(img, a.view_at(focus[0], focus[1] * z, w0 + (w1 - w0) * z))
    return img


def sc_scroll(a, u, t, dur, ctx):
    img = a.base.copy()
    y0, y1 = ctx["scroll"]
    a.browser(img, a.view_at(a.pw / 2, y0 + (y1 - y0) * ease(u), a.pw))
    return img


def sc_detail(a, u, t, dur, ctx):
    """Full-bleed punch-in on a section of the page (no browser frame)."""
    img = a.blur_bg.copy()
    y, zin = ctx["detail_y"], ctx.get("zoom_in", True)
    k = ease(u) if zin else 1 - ease(u)
    vw = a.pw * (0.78 - 0.18 * k)
    tw, th = 1000, 1240
    vh = vw * th / tw
    x0 = clamp(a.pw / 2 - vw / 2 + (k - 0.5) * 60, 0, a.pw - vw)
    y0 = clamp(y + 40 * u, 0, max(0, a.ph - vh))
    crop = a.page.resize((tw, th), Image.BICUBIC, box=(x0, y0, x0 + vw, y0 + vh))
    sh, pad = shadow(tw, th, 36)
    img.paste((0, 0, 0), (40 - pad, 340 - pad), sh)
    img.paste(crop, (40, 340), rounded_mask(tw, th, 36))
    return img


def sc_feature(a, u, t, dur, ctx):
    img = a.blur_bg.copy()
    idx, text = ctx["feature"]
    a.browser(img, a.view_at(a.pw / 2, ctx.get("feat_y", 0), a.pw), scale=0.78, dy=230)
    lay = a.feature_layer(idx, text)
    paste_scaled(img, lay, W / 2, 470 - 60 * (1 - ease_out(t / 0.4)), back_out(t / 0.4))
    return img


def sc_cta(a, u, t, dur, ctx):
    img = a.blur_bg.copy()
    hl = Image.new("RGBA", (W, 140), (0, 0, 0, 0))
    ImageDraw.Draw(hl).text((W / 2, 70), C.BRAND, font=fit_font(C.BRAND, C.FONT_BLACK, W - 120,
                                                               100), fill=(255, 255, 255, 255),
                            anchor="mm")
    paste_scaled(img, a._pill("FOLLOW FOR DAILY AI TOOLS", 34),
                 W / 2, 560, back_out(t / 0.35))
    paste_scaled(img, hl, W / 2, 700, back_out((t - 0.1) / 0.4), alpha=clamp((t - 0.1) / 0.15))
    dom = a._pill(f"Try it: {a.host}", 40)
    paste_scaled(img, dom, W / 2, 860, back_out((t - 0.25) / 0.4), alpha=clamp((t - 0.25) / 0.2))
    return img


# ---------------------------------------------------------------- timeline
def sentence_starts(script: str, words):
    """Map each sentence of the script to a start time using the word timings."""
    sents = [s for s in re.split(r"(?<=[.!?])\s+", script.strip()) if s.strip()]
    counts = [len(s.split()) for s in sents]
    total = sum(counts) or 1
    starts, acc = [], 0
    for c in counts:
        i = min(len(words) - 1, round(acc / total * len(words)))
        starts.append(words[i]["start"] if starts else 0.0)
        acc += c
    return starts


def build_timeline(a: Assets, script, words, total):
    starts = sentence_starts(script, words)
    cta_start = starts[-1] if len(starts) > 1 else total - 2.5
    # segments between sentence starts (excluding the CTA sentence), long ones split
    bounds = starts[:-1] + [cta_start] if len(starts) > 1 else [0.0, cta_start]
    segs = []
    for s0, s1 in zip(bounds, bounds[1:]):
        n = max(1, round((s1 - s0) / 3.6))
        for k in range(n):
            segs.append((s0 + (s1 - s0) * k / n, s0 + (s1 - s0) * (k + 1) / n))
    if not segs:
        segs = [(0.0, cta_start)]

    ph = a.ph
    scroll_max = max(0, ph - a.pw * CONTENT_H / CW)
    scroll_pos = 0.0
    feats = list(enumerate(a.features, 1))
    cycle = ["zoom", "feature", "scroll", "detail", "feature", "scroll", "detail", "zoom"]
    plan = [("hook", segs[0], {})]
    ci = 0
    for seg in segs[1:]:
        kind = cycle[ci % len(cycle)]
        ci += 1
        if kind == "feature" and not feats:
            kind = "scroll"
        if kind in ("scroll", "detail") and scroll_max < 200:
            kind = "zoom"
        ctx = {}
        if kind == "feature":
            ctx["feature"] = feats.pop(0)
            ctx["feat_y"] = min(scroll_pos, scroll_max)
        elif kind == "scroll":
            step = min(1400, max(500, scroll_max / 3))
            y1 = min(scroll_max, scroll_pos + step)
            if y1 - scroll_pos < 150:  # reached the bottom -> start over
                scroll_pos, y1 = 0.0, min(scroll_max, step)
            ctx["scroll"] = (scroll_pos, y1)
            scroll_pos = y1
        elif kind == "detail":
            ctx["detail_y"] = random.uniform(min(500, scroll_max), max(500, min(scroll_max,
                                                                                3000)))
            ctx["zoom_in"] = random.random() < 0.6
        elif kind == "zoom":
            ctx["focus"] = (a.pw * random.uniform(0.35, 0.65), random.uniform(60, 260))
        plan.append((kind, seg, ctx))
    plan.append(("cta", (cta_start, total), {}))
    return plan


SCENES = {"hook": sc_hook, "zoom": sc_zoom, "scroll": sc_scroll, "detail": sc_detail,
          "feature": sc_feature, "cta": sc_cta}


def frame_at(a, plan, t, total):
    for i, (kind, (s0, s1), ctx) in enumerate(plan):
        if s0 <= t < s1 or i == len(plan) - 1:
            dur = max(0.1, s1 - s0)
            img = SCENES[kind](a, (t - s0) / dur, t - s0, dur, ctx)
            # transition from previous scene
            if i > 0 and t - s0 < TRANS:
                pk, (p0, p1), pctx = plan[i - 1]
                pd = max(0.1, p1 - p0)
                prev = SCENES[pk](a, 1.0, pd, pd, pctx)
                img = transition(prev, img, (t - s0) / TRANS, i)
            break
    # progress bar on top (keeps people watching)
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, int(W * t / total), 10), fill=C.ACCENT)
    return img


def transition(prev, new, u, i):
    k = ease_out(u)
    style = i % 3
    out = Image.new("RGB", (W, H))
    if style == 0:  # slide left
        out.paste(prev, (int(-W * k), 0))
        out.paste(new, (int(W * (1 - k)), 0))
    elif style == 1:  # zoom punch + flash
        s = 1.25 - 0.25 * k
        big = new.resize((int(W * s), int(H * s)), Image.BILINEAR)
        out.paste(big, (int((W - big.width) / 2), int((H - big.height) / 2)))
        out = Image.blend(Image.new("RGB", (W, H), (255, 255, 255)), out, 0.35 + 0.65 * k)
    else:  # slide up
        out.paste(prev, (0, int(-H * k)))
        out.paste(new, (0, int(H * (1 - k))))
    return out


# ---------------------------------------------------------------- subtitles
def _ts(t):
    t = max(0, t)
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def _chunks(words, max_words=3, gap=0.28):
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        nxt = words[i + 1] if i + 1 < len(words) else None
        if len(cur) >= max_words or nxt is None or nxt["start"] - w["end"] > gap:
            chunks.append(cur)
            cur = []
    return chunks


def subtitles(words, out: Path):
    yellow = "&H004DE1FF&"  # ASS colours are &HAABBGGRR
    margin_v = H - 1260  # baseline ~y=1260 -> a bit below the centre
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter Black,88,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,8,4,2,60,60,{margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    chunks = _chunks(words)
    for ci, ch in enumerate(chunks):
        nxt = chunks[ci + 1][0]["start"] if ci + 1 < len(chunks) else ch[-1]["end"] + 0.4
        chunk_end = min(nxt, ch[-1]["end"] + 0.5)
        clean = [w["word"].replace("{", "").replace("}", "").upper() for w in ch]
        for wi, w in enumerate(ch):
            end = ch[wi + 1]["start"] if wi + 1 < len(ch) else chunk_end
            txt = " ".join(f"{{\\c{yellow}}}{x}{{\\c&H00FFFFFF&}}" if j == wi else x
                           for j, x in enumerate(clean))
            pop = "{\\fscx114\\fscy114\\t(0,90,\\fscx100\\fscy100)}" if wi == 0 else ""
            lines.append(f"Dialogue: 0,{_ts(w['start'])},{_ts(end)},Sub,,0,0,0,,{pop}{txt}")
    out.write_text(head + "\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------- main entry
def build(work: Path, title, category, url, screenshot: Path, voice: Path, words,
          out_mp4: Path, voice_len: float, script: str = "", features=None, og_image=""):
    total = voice_len + C.TAIL_SECONDS
    a = Assets(title, category, url, screenshot, features, og_image)
    plan = build_timeline(a, script or " ".join(w["word"] for w in words), words, total)
    print("[render] scenes:", " > ".join(f"{k}({s1 - s0:.1f}s)" for k, (s0, s1), _ in plan))
    subtitles(words, work / "subs.ass")

    music = sorted(C.MUSIC.glob("*.mp3"))
    inputs = ["-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
              "-i", "-", "-i", str(voice)]
    audio = "[1:a]apad[a]"
    if music:
        inputs += ["-stream_loop", "-1", "-i", str(random.choice(music))]
        audio = "[1:a]apad[v0];[2:a]volume=0.12[m];[v0][m]amix=inputs=2:duration=first:normalize=0[a]"
    fonts = str(C.FONTS).replace(":", "\\:")
    subs = str(work / "subs.ass").replace(":", "\\:")
    fc = f"[0:v]ass='{subs}':fontsdir='{fonts}',format=yuv420p[v];{audio}"
    cmd = ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", fc,
           "-map", "[v]", "-map", "[a]", "-t", f"{total:.2f}", "-r", str(FPS),
           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-profile:v", "high",
           "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart",
           str(out_mp4)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = int(total * FPS)
    for f in range(n):
        proc.stdin.write(frame_at(a, plan, f / FPS, total).tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError("ffmpeg failed")

    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "0.9", "-i", str(out_mp4),
                    "-frames:v", "1", "-q:v", "2", str(out_mp4.with_name("cover.jpg"))],
                   check=True)
