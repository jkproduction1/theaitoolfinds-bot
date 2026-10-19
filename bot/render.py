"""Build the final 1080x1920 video:
background + tool name  ->  website card that scrolls  ->  word-by-word subtitles
-> voiceover (+ optional quiet background music from assets/music)."""
import random
import subprocess
from pathlib import Path
from urllib.parse import urlparse

from PIL import Image, ImageDraw, ImageFilter, ImageFont

from . import config as C


def _font(path, size):
    return ImageFont.truetype(str(path), size)


def _fit(draw, text, path, max_w, start, min_size=48):
    size = start
    while size > min_size:
        f = _font(path, size)
        if draw.textlength(text, font=f) <= max_w:
            return f
        size -= 4
    return _font(path, min_size)


def _wrap(draw, text, font, max_w):
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def background(title: str, category: str, url: str, out: Path):
    strip = Image.new("RGB", (1, C.H))  # vertical gradient
    for y in range(C.H):
        k = y / C.H
        strip.putpixel((0, y), tuple(int(C.BG_TOP[i] * (1 - k) + C.BG_BOTTOM[i] * k)
                                     for i in range(3)))
    img = strip.resize((C.W, C.H))

    # soft glow behind the card
    glow = Image.new("L", (C.W, C.H), 0)
    ImageDraw.Draw(glow).ellipse((-100, 600, C.W + 100, 1500), fill=90)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    img.paste(Image.new("RGB", (C.W, C.H), (110, 60, 255)), (0, 0), glow)

    d = ImageDraw.Draw(img)

    # "AI TOOL OF THE DAY" pill
    pill_f = _font(C.FONT_BOLD, 34)
    label = "AI TOOL OF THE DAY"
    tw = d.textlength(label, font=pill_f)
    px0 = (C.W - tw) / 2 - 28
    d.rounded_rectangle((px0, 150, px0 + tw + 56, 210), radius=30, fill=C.ACCENT)
    d.text((C.W / 2, 181), label, font=pill_f, fill=(15, 15, 20), anchor="mm")

    # Tool name (auto size, up to 2 lines)
    tf = _fit(d, title, C.FONT_BLACK, C.W - 120, 120, 72)
    lines = _wrap(d, title, tf, C.W - 120)[:2]
    y = 300 if len(lines) == 1 else 270
    for ln in lines:
        d.text((C.W / 2, y), ln, font=tf, fill=C.TEXT, anchor="mm")
        y += tf.size + 6
    if category:
        d.text((C.W / 2, y + 22), category.upper(), font=_font(C.FONT_SEMI, 34),
               fill=C.MUTED, anchor="mm")

    # Card shadow + fake browser bar
    x0, y0 = C.CARD_X, C.CARD_Y - C.BAR_H
    shadow = Image.new("L", (C.W, C.H), 0)
    ImageDraw.Draw(shadow).rounded_rectangle(
        (x0 + 10, y0 + 24, x0 + C.CARD_W - 10, C.CARD_Y + C.CARD_H + 30), radius=34, fill=200)
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    img.paste((0, 0, 0), (0, 0), shadow)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((x0, y0, x0 + C.CARD_W, C.CARD_Y + 40), radius=28, fill=(38, 38, 48))
    for i, col in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        cx = x0 + 34 + i * 30
        d.ellipse((cx - 9, y0 + 19, cx + 9, y0 + 37), fill=col)
    host = urlparse(url).netloc.replace("www.", "")
    d.rounded_rectangle((x0 + 140, y0 + 12, x0 + C.CARD_W - 30, y0 + 44), radius=16,
                        fill=(58, 58, 70))
    d.text((x0 + 160, y0 + 28), host, font=_font(C.FONT_MEDIUM, 24),
           fill=(220, 220, 230), anchor="lm")

    # Footer
    d.text((C.W / 2, 1830), f"Follow {C.BRAND} for daily AI tools",
           font=_font(C.FONT_SEMI, 36), fill=C.MUTED, anchor="mm")
    img.save(out)


def prepare_page(src: Path, out: Path) -> int:
    """Scale screenshot to card width. Returns its height."""
    im = Image.open(src).convert("RGB")
    h = int(im.height * C.CARD_W / im.width)
    im = im.resize((C.CARD_W, h), Image.LANCZOS)
    if h < C.CARD_H:  # short page: pad with its own bottom color
        pad = Image.new("RGB", (C.CARD_W, C.CARD_H), im.getpixel((C.CARD_W // 2, h - 1)))
        pad.paste(im, (0, 0))
        im, h = pad, C.CARD_H
    im.save(out)
    return h


def card_mask(out: Path):
    m = Image.new("L", (C.CARD_W, C.CARD_H), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, -40, C.CARD_W, C.CARD_H), radius=28, fill=255)
    m.save(out)


# ---------- subtitles (ASS, word-by-word highlight) ----------

def _ts(t: float) -> str:
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
    yellow = "&H004DE1FF&"  # ASS colors are &HAABBGGRR
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {C.W}
PlayResY: {C.H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter Black,86,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,7,3,2,60,60,300,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    chunks = _chunks(words)
    for ci, ch in enumerate(chunks):
        nxt_start = chunks[ci + 1][0]["start"] if ci + 1 < len(chunks) else ch[-1]["end"] + 0.4
        chunk_end = min(nxt_start, ch[-1]["end"] + 0.5)
        clean = [w["word"].replace("{", "").replace("}", "").upper() for w in ch]
        for wi, w in enumerate(ch):
            start = w["start"]
            end = ch[wi + 1]["start"] if wi + 1 < len(ch) else chunk_end
            txt = " ".join(
                f"{{\\c{yellow}}}{t}{{\\c&H00FFFFFF&}}" if j == wi else t
                for j, t in enumerate(clean))
            pop = "{\\fscx112\\fscy112\\t(0,90,\\fscx100\\fscy100)}" if wi == 0 else ""
            lines.append(f"Dialogue: 0,{_ts(start)},{_ts(end)},Sub,,0,0,0,,{pop}{txt}")
    out.write_text(head + "\n".join(lines) + "\n", encoding="utf-8")


# ---------- final ffmpeg render ----------

def render(work: Path, voice: Path, words, page_h: int, total: float, out_mp4: Path):
    subtitles(words, work / "subs.ass")
    scroll_to = max(0, min(page_h - C.CARD_H, 3200))
    hold = C.HOLD_SECONDS
    span = max(3.0, total - hold - 2.0)
    # ease-in-out scroll from top to `scroll_to`
    y_expr = (f"if(lt(t\\,{hold})\\,0\\,{scroll_to}*(1-cos(PI*min(1\\,(t-{hold})/{span})))/2)")

    music = sorted(C.MUSIC.glob("*.mp3"))
    inputs = [
        "-loop", "1", "-framerate", str(C.FPS), "-i", str(work / "bg.png"),
        "-loop", "1", "-framerate", str(C.FPS), "-i", str(work / "page.png"),
        "-loop", "1", "-framerate", str(C.FPS), "-i", str(work / "mask.png"),
        "-i", str(voice),
    ]
    audio = "[3:a]apad[a]"
    if music:
        inputs += ["-stream_loop", "-1", "-i", str(random.choice(music))]
        audio = ("[3:a]apad[v0];[4:a]volume=0.12[m];"
                 "[v0][m]amix=inputs=2:duration=first:normalize=0[a]")

    fonts = str(C.FONTS).replace(":", "\\:")
    subs = str(work / "subs.ass").replace(":", "\\:")
    fc = (
        f"[1:v]crop={C.CARD_W}:{C.CARD_H}:0:'{y_expr}',format=rgba[c];"
        f"[2:v]format=gray[m];[c][m]alphamerge[cm];"
        f"[0:v][cm]overlay={C.CARD_X}:{C.CARD_Y}[v];"
        f"[v]ass='{subs}':fontsdir='{fonts}',format=yuv420p[out];{audio}"
    )
    cmd = ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", fc,
           "-map", "[out]", "-map", "[a]", "-t", f"{total:.2f}", "-r", str(C.FPS),
           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-profile:v", "high",
           "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart",
           str(out_mp4)]
    subprocess.run(cmd, check=True)

    # cover image for the Reel
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "1.0", "-i", str(out_mp4),
                    "-frames:v", "1", "-q:v", "2", str(out_mp4.with_name("cover.jpg"))],
                   check=True)


def build(work: Path, title, category, url, screenshot: Path, voice: Path, words,
          out_mp4: Path, voice_len: float):
    background(title, category, url, work / "bg.png")
    page_h = prepare_page(screenshot, work / "page.png")
    card_mask(work / "mask.png")
    render(work, voice, words, page_h, voice_len + C.TAIL_SECONDS, out_mp4)
