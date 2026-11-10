"""sketch3 - "Sketch -> Motion" #3 (Jan, 2026-11-10): a stays-booking app concept, built on Claude Fable 5.2 (header says so; the
session really ran on claude-fable-5-2). Own design: NO real brand name, logo or wordmark in the picture (Jan asked for the
Airbnb logo; declined). One continuous morph of a single hero object: price pin -> listing card -> calendar -> pill -> boarding
pass -> end screen. Stay pictures are SVG illustrations drawn here (generated photos could not be downloaded in this run).
Rendered at 60 fps and blended to 30 fps (real motion blur). Music t2 + sfx. Sketch helpers in hf/sketchlib.py."""
import json, math, random, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
H = HERE.parent.parent
sys.path.insert(0, str(H))
from house import write_sfx
from sketchlib import line, rect, circ, squig, arrow, txt, sketch_svg

NAME = "sketch3"
W = H / "work" / NAME; A = W / "assets"
if W.exists(): shutil.rmtree(W)
A.mkdir(parents=True, exist_ok=True); (W / "renders").mkdir(exist_ok=True)
for f in (H / "template").iterdir(): shutil.copy(f, W / f.name)
for f in (H / "assets").iterdir(): shutil.copy(f, A / f.name)
shutil.copy(H / "videos" / "sketch1" / "media" / "caveat.woff2", A / "caveat.woff2")

DUR = 16.0
SKT = [0.0, 1.7, 4.0, 7.2, 10.9]
TR = "t2"
tj = json.load(open(H.parent / "video/public/music/tracks.json"))[TR]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(tj["hook_start"]), "-i", str(H.parent / "video/public/music" / tj["file"]), "-t", str(DUR + 1),
                "-af", f"afade=t=in:d=0.15,afade=t=out:st={DUR - 0.9}:d=0.9", str(A / "music.mp3")], check=True)
ev = [(0.3 + i * 0.09, "tick") for i in range(6)] + [(1.6, "whoosh")] + [(2.35 + i * 0.11, "pop") for i in range(7)] + [(3.75, "click"), (4.0, "whoosh"),
      (5.3, "whoosh"), (6.2, "whoosh"), (6.9, "pop"), (7.2, "whoosh"), (8.2, "click"), (9.3, "click"), (10.0, "click"), (10.3, "whoosh"), (10.85, "pop"),
      (11.0, "whoosh"), (11.5, "pop"), (13.0, "whoosh")]
write_sfx(ev, DUR, A / "sfx.wav")

R = random.Random(5)
# ---------------------------------------------------------------- stay illustrations (560 x 380)
def ill_terrace():
    roofs = ""
    for layer, (y0, col) in enumerate([(210, "#c9603f"), (245, "#a8472e"), (285, "#7d3222")]):
        x = -20
        while x < 580:
            w = R.randint(50, 110); h = R.randint(30, 80)
            roofs += f'<path d="M{x} {y0 + 60} V{y0 - h + 22} L{x + w / 2} {y0 - h} L{x + w} {y0 - h + 22} V{y0 + 60}Z" fill="{col}"/>'
            if layer < 2: roofs += f'<rect x="{x + w * 0.4:.0f}" y="{y0 - h + 34}" width="10" height="14" rx="2" fill="#ffd9a0" opacity=".85"/>'
            x += w - 6
    lights = "".join(f'<circle cx="{30 + i * 46}" cy="{58 + 26 * math.sin(i * 0.6 + 0.4) ** 2:.0f}" r="6" fill="#fff3c4"/><circle cx="{30 + i * 46}" cy="{58 + 26 * math.sin(i * 0.6 + 0.4) ** 2:.0f}" r="14" fill="#ffe08a" opacity=".35"/>' for i in range(12))
    return ('<svg class="ill" viewBox="0 0 560 380"><defs><linearGradient id="sk1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a6b"/><stop offset=".45" stop-color="#e8627a"/><stop offset=".8" stop-color="#ffb35a"/><stop offset="1" stop-color="#ffd98a"/></linearGradient></defs>'
            '<rect width="560" height="380" fill="url(#sk1)"/><circle cx="400" cy="205" r="46" fill="#fff0b8"/><circle cx="400" cy="205" r="80" fill="#ffe08a" opacity=".3"/>'
            + roofs + '<rect x="0" y="318" width="560" height="62" fill="#3a2418"/><rect x="0" y="312" width="560" height="10" fill="#5a3826"/>'
            '<rect x="60" y="270" width="120" height="14" rx="5" fill="#f3e6d2"/><rect x="70" y="284" width="8" height="34" fill="#2a1a12"/><rect x="162" y="284" width="8" height="34" fill="#2a1a12"/>'
            '<rect x="200" y="262" width="56" height="56" rx="10" fill="#f3e6d2"/><rect x="430" y="258" width="50" height="60" rx="8" fill="#c9603f"/>'
            '<path d="M455 258 C430 200 420 190 410 180 M455 258 C455 200 462 180 470 165 M455 258 C480 210 495 200 505 192" stroke="#2f6b3a" stroke-width="9" fill="none" stroke-linecap="round"/>'
            + lights + '</svg>')
def ill_bedroom():
    return ('<svg class="ill" viewBox="0 0 560 380"><rect width="560" height="380" fill="#efe3d0"/><rect y="290" width="560" height="90" fill="#c9a37a"/>'
            '<rect x="330" y="40" width="180" height="190" rx="10" fill="#fff"/><rect x="340" y="50" width="160" height="170" rx="6" fill="#8fd0ff"/>'
            '<path d="M340 190 L380 150 L420 185 L460 140 L500 180 V220 H340Z" fill="#c9603f"/><circle cx="465" cy="85" r="18" fill="#fff3c4"/><rect x="418" y="50" width="5" height="170" fill="#fff"/>'
            '<rect x="40" y="150" width="270" height="90" rx="16" fill="#8a5a3c"/><rect x="30" y="220" width="300" height="80" rx="18" fill="#fff"/><rect x="30" y="258" width="300" height="50" rx="14" fill="#e8734a"/>'
            '<rect x="56" y="196" width="100" height="50" rx="16" fill="#fdf6ea"/><rect x="176" y="196" width="100" height="50" rx="16" fill="#fdf6ea"/>'
            '<rect x="40" y="300" width="14" height="30" fill="#5a3826"/><rect x="306" y="300" width="14" height="30" fill="#5a3826"/>'
            '<rect x="380" y="268" width="80" height="62" rx="6" fill="#8a5a3c"/><rect x="412" y="212" width="8" height="56" fill="#333"/><path d="M390 212 h52 l-10 -40 h-32z" fill="#ffd98a"/>'
            '<ellipse cx="416" cy="190" rx="60" ry="40" fill="#ffe9a8" opacity=".35"/>'
            '<rect x="480" y="280" width="46" height="50" rx="8" fill="#c9603f"/><path d="M503 280 C485 240 478 232 470 224 M503 280 C503 238 508 226 514 214 M503 280 C520 246 530 240 538 234" stroke="#2f6b3a" stroke-width="8" fill="none" stroke-linecap="round"/>'
            '<rect x="70" y="60" width="90" height="70" rx="6" fill="#fff"/><path d="M78 122 L105 88 L125 108 L140 96 L152 122Z" fill="#e8a37a"/></svg>')
def ill_pool():
    return ('<svg class="ill" viewBox="0 0 560 380"><defs><linearGradient id="sk3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6ec6ff"/><stop offset="1" stop-color="#d8f1ff"/></linearGradient>'
            '<linearGradient id="pw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3fd0c9"/><stop offset="1" stop-color="#1b8fb8"/></linearGradient></defs>'
            '<rect width="560" height="380" fill="url(#sk3)"/><circle cx="90" cy="70" r="34" fill="#fff6c8"/>'
            '<rect x="250" y="90" width="270" height="130" rx="8" fill="#fff"/><rect x="250" y="80" width="270" height="16" rx="4" fill="#c9603f"/>'
            '<rect x="280" y="120" width="70" height="100" rx="4" fill="#9ad8ff"/><rect x="380" y="120" width="110" height="60" rx="4" fill="#9ad8ff"/>'
            '<rect y="210" width="560" height="170" fill="#f3e6d2"/><path d="M40 250 H520 L560 380 H0Z" fill="url(#pw)"/>'
            '<path d="M70 290 q30 -14 60 0 t60 0 M260 320 q30 -14 60 0 t60 0 M380 280 q25 -12 50 0 t50 0" stroke="#fff" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round"/>'
            '<rect x="60" y="212" width="90" height="12" rx="6" fill="#e8734a"/><rect x="170" y="212" width="90" height="12" rx="6" fill="#e8734a"/>'
            '<rect x="120" y="120" width="10" height="100" fill="#7d5a3c"/><path d="M125 120 C80 110 60 130 50 150 M125 120 C100 80 70 80 55 90 M125 120 C150 80 185 85 200 96 M125 120 C165 112 190 130 198 150" stroke="#2f8a4a" stroke-width="12" fill="none" stroke-linecap="round"/></svg>')
ILLS = ill_terrace() + ill_bedroom() + ill_pool()

# ---------------------------------------------------------------- map (900 x 1500, panned inside the 660 x 1100 panel)
def build_map():
    o = ['<svg id="mapsvg" viewBox="0 0 900 1500" width="900" height="1500"><rect width="900" height="1500" fill="#eef0e6"/>']
    for _ in range(9):
        o.append(f'<ellipse cx="{R.randint(40, 860)}" cy="{R.randint(60, 1100)}" rx="{R.randint(50, 110)}" ry="{R.randint(40, 90)}" fill="#cfe6c0"/>')
    o.append('<path d="M-20 1240 C200 1160 420 1300 620 1210 S900 1150 940 1180 V1520 H-20Z" fill="#a9d8f5"/>')
    o.append('<g transform="rotate(-12 450 750)">')
    for i in range(-4, 24):
        o.append(f'<rect x="-300" y="{i * 74 + R.randint(-8, 8)}" width="1500" height="{R.choice([9, 9, 12, 20])}" fill="#fff"/>')
        o.append(f'<rect x="{i * 82 + R.randint(-8, 8)}" y="-300" width="{R.choice([9, 9, 12])}" height="2100" fill="#fff"/>')
    o.append('<rect x="-300" y="640" width="1500" height="26" fill="#ffe7a3"/><rect x="500" y="-300" width="24" height="2100" fill="#ffe7a3"/></g>')
    o.append('<path d="M-20 1240 C200 1160 420 1300 620 1210 S900 1150 940 1180 V1520 H-20Z" fill="#a9d8f5"/>')
    for (x, y, s) in [(150, 520, "Bairro Alto"), (560, 600, "Alfama"), (330, 1010, "Baixa"), (620, 300, "Graça")]:
        o.append(f'<text x="{x}" y="{y}" font-family="Inter" font-size="24" font-weight="600" fill="#8a9488">{s}</text>')
    o.append('</svg>')
    return "".join(o)
PINS = [(250, 470, "€84"), (640, 520, "€97"), (300, 690, "€145"), (450, 820, "€120"), (650, 960, "€76"), (240, 1010, "€110"), (575, 705, "€132")]
SEL = 3
pins = "".join(f'<div class="pin" id="pin{i}" style="left:{x}px;top:{y}px">{s}</div>' for i, (x, y, s) in enumerate(PINS))

# ---------------------------------------------------------------- sketches (330 x 590)
SK = []
SK.append([txt(165, 200, "where to?", 44, "middle")] + rect(30, 250, 270, 70) + circ(65, 285, 14) + [line(75, 296, 86, 308)] + [txt(100, 296, "Lisbon", 34)])
_m = [line(20, 120, 310, 90), line(20, 260, 310, 230), line(20, 400, 310, 370), line(90, 60, 120, 520), line(220, 50, 250, 520)]
for (x, y) in [(60, 170), (180, 150), (250, 300), (140, 330), (70, 440), (230, 460)]:
    _m += rect(x - 28, y - 14, 56, 28)
_m += circ(140, 330, 44) + [txt(165, 570, "tap a price", 28, "middle")]
SK.append(_m)
SK.append(rect(35, 40, 260, 460) + rect(50, 55, 230, 200) + [line(60, 245, 270, 65, 1.0), line(60, 65, 150, 150)] + squig(55, 290, 170) + squig(55, 320, 110) +
          [txt(250, 330, "€", 34, "middle")] + arrow(250, 400, 90, 400) + [txt(165, 440, "swipe photos", 26, "middle")])
_c = rect(35, 30, 260, 530) + rect(50, 45, 230, 80) + [txt(60, 165, "March", 30)]
for r in range(5):
    for c in range(7):
        if r * 7 + c < 31: _c += circ(62 + c * 34, 200 + r * 44, 4, 1.0)
_c += rect(84, 272, 126, 34) + rect(50, 470, 230, 54) + [txt(165, 508, "reserve", 30, "middle")]
SK.append(_c)
SK.append(rect(30, 170, 270, 170) + [line(210, 170, 210, 340, 0.6)] + [txt(50, 235, "LIS", 54), txt(50, 290, "3 nights", 26)] + circ(255, 240, 20) + [line(255, 260, 255, 310), line(255, 295, 268, 295)] +
          [txt(165, 430, "booked!", 46, "middle")] + [line(60, 120, 50, 95), line(165, 110, 165, 80), line(270, 120, 282, 95)])
sketches = "".join(sketch_svg(k, it) for k, it in enumerate(SK))

def letters(s, cls):
    return "".join(f'<span class="{cls}">{c if c != " " else "&nbsp;"}</span>' for c in s)

days = "".join(f'<div class="c" id="d{d}" style="left:{((d - 1) % 7) * 70}px;top:{((d - 1) // 7) * 58}px"><span>{d}</span></div>' for d in range(1, 32))
conf = "".join(f'<i class="cf" id="cf{i}" style="background:{c}"></i>' for i, c in enumerate(["#ff7a2f", "#ffd23d", "#3fd0c9", "#ff4d7a", "#7a8cff", "#fff"] * 7))
CF = [(R.uniform(-300, 300), R.uniform(160, 420), R.uniform(240, 520), R.uniform(-540, 540)) for _ in range(42)]
bars = "".join(f'<i style="width:{R.choice([3, 3, 5, 8])}px"></i>' for _ in range(34))
SPARK = '<svg viewBox="0 0 100 100"><path fill="#e8734a" d="M50 4l6 30 22-21-12 28 30-4-27 14 27 14-30-4 12 28-22-21-6 30-6-30-22 21 12-28-30 4 27-14-27-14 30 4-12-28 22 21z"/></svg>'
KEY = '<svg viewBox="0 0 48 48"><circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" stroke-width="4"/><path d="M23 23 L42 42 M34 34 l6 -6 M29 29 l5 -5" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none"/></svg>'
MAG = '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M15.5 15.5 L21 21" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>'

CSS = r'''
@font-face{font-family:'Caveat';src:url(assets/caveat.woff2) format('woff2');font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:'Inter',sans-serif;color:#fff;background:radial-gradient(70% 45% at 55% 42%,#2a2724 0%,#0b0b0b 72%,#000 100%)}
#hdr{position:absolute;left:380px;width:660px;top:296px;display:flex;justify-content:center;align-items:center;gap:14px;font-size:48px;font-weight:700;letter-spacing:-.02em}
#hdr svg{width:54px;height:54px}
#dl{position:absolute;left:40px;top:590px;font-size:46px;font-weight:700;letter-spacing:-.02em}
#paper{position:absolute;left:40px;top:660px;width:310px;height:555px;background:#fbfbf8;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.skt{position:absolute;inset:0;width:310px;height:555px;opacity:0}
.sp{fill:none;stroke:#1d1d1d;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1 1}
.hw{font-family:'Caveat',cursive;font-weight:600;fill:#1d1d1d}
#st{position:absolute;left:380px;top:380px;width:660px;height:1100px;overflow:hidden;background:#fbf4ea;box-shadow:0 30px 80px rgba(0,0,0,.7)}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.bl{position:absolute;border-radius:50%;filter:blur(70px)}
#bl0{left:-200px;top:740px;width:900px;height:460px;background:#ffb27a;opacity:.85}
#bl1{left:260px;top:-160px;width:620px;height:460px;background:#8fd0ff;opacity:.7}
#q{position:absolute;left:0;right:0;top:360px;display:flex;justify-content:center;font-size:64px;font-weight:800;letter-spacing:-.03em;color:#222;white-space:nowrap}
.ql,.sl,.e1,.tl{display:inline-block}
#mapw{position:absolute;inset:0;overflow:hidden}
#map{position:absolute;left:0;top:0;width:900px;height:1500px}
.pin{position:absolute;width:110px;height:56px;margin:-28px 0 0 -55px;border-radius:28px;background:#fff;color:#222;font-size:26px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,.22);transform-origin:50% 100%}
#ring{position:absolute;left:450px;top:820px;width:110px;height:56px;margin:-28px 0 0 -55px;border-radius:28px;border:4px solid #ff7a2f;opacity:0}
#scrim{position:absolute;inset:0;background:#fbf4ea;opacity:0}
#srch{position:absolute;left:330px;top:540px;width:520px;height:96px;margin:-48px 0 0 -260px;border-radius:48px;background:#fff;box-shadow:0 18px 44px rgba(0,0,0,.16);display:flex;align-items:center;padding:0 14px 0 34px;color:#222;white-space:nowrap}
#srch .t{font-size:36px;font-weight:700;display:flex}
#srch .m{font-size:22px;color:#777;margin-left:18px;font-weight:500}
#srch .go{margin-left:auto;width:68px;height:68px;border-radius:50%;background:#ff7a2f;display:flex;align-items:center;justify-content:center}
#srch .go svg{width:34px;height:34px}
#wz{position:absolute;left:330px;top:560px;width:0;height:0}
#w{position:absolute;left:0;top:0;width:110px;height:56px;border-radius:28px;background:#222;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.28)}
#wpin{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:26px;font-weight:800;color:#fff}
#wc{position:absolute;left:0;top:0;width:560px;height:900px;color:#222}
#imgw{position:absolute;left:0;top:0;width:560px;height:380px;overflow:hidden}
#strip{position:absolute;left:0;top:0;width:1680px;height:380px;display:flex}
.ill{width:560px;height:380px;flex:none;display:block}
#dots{position:absolute;left:0;right:0;bottom:18px;display:flex;justify-content:center;gap:10px}
#dots i{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.55)}
#hrt{position:absolute;right:22px;top:22px;width:62px;height:62px;border-radius:50%;background:#fff;color:#bbb;font-size:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.2)}
#lower{position:absolute;left:0;top:380px;width:560px;height:720px}
#ttl{position:absolute;left:32px;top:26px;font-size:32px;font-weight:800;letter-spacing:-.02em;display:flex;white-space:nowrap}
#sub{position:absolute;left:32px;top:72px;font-size:22px;color:#666;white-space:nowrap}
#sub b{color:#222}
#pr{position:absolute;left:32px;top:110px;font-size:24px;color:#666} #pr b{color:#222;font-size:28px}
#cal{position:absolute;left:33px;top:164px;width:494px;height:380px}
#cal .mh{position:absolute;left:0;top:0;font-size:26px;font-weight:800}
#cal .wd{position:absolute;left:0;top:44px;width:490px;display:flex;font-size:18px;color:#999;font-weight:600} #cal .wd span{width:70px;text-align:center}
#grid{position:absolute;left:0;top:80px;width:490px;height:290px}
.c{position:absolute;width:70px;height:58px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:600}
.c span{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;position:relative;z-index:2}
#rng{position:absolute;left:81px;top:121px;width:48px;height:48px;border-radius:24px;background:#ffe0cc;opacity:0}
#fg{position:absolute;left:105px;top:145px;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;background:rgba(255,122,47,.35);border:3px solid #ff7a2f;opacity:0;z-index:3}
#tot{position:absolute;left:32px;top:548px;width:496px;display:flex;justify-content:space-between;align-items:baseline;font-size:24px;color:#666}
#tot b{font-size:38px;color:#222;font-weight:800;letter-spacing:-.02em}
#btn{position:absolute;left:32px;top:612px;width:496px;height:84px;border-radius:22px;background:linear-gradient(90deg,#ff7a2f,#ff4d5e);color:#fff;font-size:30px;font-weight:800;display:flex;align-items:center;justify-content:center}
#wpill{position:absolute;left:50%;top:50%;width:88px;height:88px;margin:-44px 0 0 -44px;display:flex;align-items:center;justify-content:center;opacity:0}
#spin{position:absolute;width:44px;height:44px;border-radius:50%;border:5px solid rgba(255,255,255,.35);border-top-color:#fff}
#chk{position:absolute;font-size:46px;font-weight:900;color:#fff;opacity:0}
#pass{position:absolute;left:0;top:0;width:560px;height:340px;opacity:0;color:#fff}
#pass .a{position:absolute;left:36px;top:30px;font-size:18px;letter-spacing:.16em;font-weight:700;color:#ffb27a}
#pass .b{position:absolute;left:34px;top:58px;font-size:92px;font-weight:900;letter-spacing:-.04em;line-height:1}
#pass .c2{position:absolute;left:36px;top:168px;font-size:24px;font-weight:600;color:rgba(255,255,255,.8)}
#pass .d{position:absolute;left:36px;top:206px;font-size:22px;color:rgba(255,255,255,.55)}
#pass .bc{position:absolute;left:36px;top:262px;height:44px;display:flex;gap:4px;align-items:stretch} #pass .bc i{background:rgba(255,255,255,.75);display:block}
#pass .perf{position:absolute;left:400px;top:20px;bottom:20px;border-left:4px dashed rgba(255,255,255,.25)}
#pass .k{position:absolute;left:432px;top:96px;width:96px;height:96px;color:#ffb27a} #pass .k svg{width:100%;height:100%}
#pass .kt{position:absolute;left:412px;width:136px;top:214px;text-align:center;font-size:18px;font-weight:700;color:rgba(255,255,255,.7)}
.cf{position:absolute;left:330px;top:560px;width:14px;height:22px;margin:-11px 0 0 -7px;border-radius:3px;opacity:0}
#endw{position:absolute;inset:0;transform-origin:50% 48%}
#glow{position:absolute;left:80px;top:300px;width:500px;height:500px;border-radius:50%;background:conic-gradient(from 0deg,#ff7a2f,#ff4d7a,#ffd23d,#ff7a2f);filter:blur(100px);opacity:0}
#e1{position:absolute;left:0;right:0;top:470px;display:flex;justify-content:center;font-size:54px;font-weight:800;letter-spacing:-.03em;white-space:nowrap}
#e2{position:absolute;left:0;right:0;top:570px;text-align:center;font-size:28px;font-weight:600;color:rgba(255,255,255,.75);opacity:0}
#e2 b{color:#ffb27a}
#e3{position:absolute;left:0;right:0;top:1020px;text-align:center;font-size:20px;font-weight:500;color:rgba(255,255,255,.4);opacity:0}
#cta{position:absolute;left:0;right:0;top:1545px;text-align:center;font-size:52px;font-weight:800;letter-spacing:-.02em}
#cta b{color:#ff7a2f}
#handle{position:absolute;left:50%;top:1650px;transform:translateX(-50%);font-size:30px;font-weight:600;color:rgba(255,255,255,.55)}
'''
BODY = '''<div id="root" data-composition-id="main" data-start="0" data-duration="__DUR__" data-width="1080" data-height="1920" data-motion-blur="off">
<div id="hdr">__SPARK__<span>Claude Fable 5.2</span></div>
<div id="dl">Drawing</div>
<div id="paper">__SKETCHES__</div>
<div id="st"><div id="cam">
 <div class="bl" id="bl0"></div><div class="bl" id="bl1"></div>
 <div id="q">__Q__</div>
 <div id="mapw"><div id="map">__MAP____PINS__<div id="ring"></div></div></div>
 <div id="scrim"></div>
 <div id="srch"><div class="t">__SL__</div><div class="m" id="sm">Mar 16–19 · 2 guests</div><div class="go">__MAG__</div></div>
 __CONF__
 <div id="wz"><div id="w"><div id="wpin">€120</div>
  <div id="wc"><div id="imgw"><div id="strip">__ILLS__</div><div id="dots"><i id="dt0"></i><i id="dt1"></i><i id="dt2"></i></div><div id="hrt">♥</div></div>
   <div id="lower"><div id="ttl">__TTL__</div><div id="sub"><b>★ 4.97</b> · 128 reviews · Lisbon</div><div id="pr"><b>€120</b> night</div>
    <div id="cal"><div class="mh">March 2027</div><div class="wd"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
     <div id="grid"><div id="rng"></div>__DAYS__<div id="fg"></div></div></div>
    <div id="tot"><span>€120 × 3 nights</span><b id="totn">€0</b></div><div id="btn">Reserve</div></div></div>
  <div id="wpill"><div id="spin"></div><div id="chk">✓</div></div>
  <div id="pass"><div class="a">YOUR STAY</div><div class="b">LISBON</div><div class="c2">Mar 16 – 19 · 3 nights</div><div class="d">Rooftop loft in Alfama</div><div class="bc">__BARS__</div>
   <div class="perf"></div><div class="k">__KEY__</div><div class="kt">Check-in 3 PM</div></div>
 </div></div>
 <div id="endw"><div id="glow"></div><div id="e1">__E1__</div><div id="e2">Built with <b>Claude Fable 5.2</b></div><div id="e3">Unofficial concept · not a real app</div></div>
</div></div>
<div id="cta">Comment “<b>SKETCH</b>” for the prompts</div>
<div id="handle">@theaitoolfinds</div>
<audio id="mus" class="clip" src="assets/music.mp3" data-start="0" data-duration="__DUR__" data-track-index="21" data-volume="0.34"></audio>
<audio id="fx" class="clip" src="assets/sfx.wav" data-start="0" data-duration="__DUR__" data-track-index="22" data-volume="0.6"></audio>
</div>'''
JS = r'''
window.__timelines=window.__timelines||{};
const DUR=__DUR__, SKT=__SKT__, CF=__CF__, NP=__NP__, SEL=__SEL__;
const tl=gsap.timeline({paused:true}); const NI={immediateRender:false};
function F(s,a,b,t){ return tl.fromTo(s,a,Object.assign({},b,NI),t); }
const IO='power4.inOut', IO3='power3.inOut', OUT='expo.out', IN='power3.in';
function typeIn(sel,t,st,d){ F(sel,{opacity:0,y:14,filter:'blur(10px)'},{opacity:1,y:0,filter:'blur(0px)',duration:d||.42,ease:'power3.out',stagger:st||.04},t); }
function typeOut(sel,t,st){ F(sel,{opacity:1,y:0,filter:'blur(0px)'},{opacity:0,y:-10,filter:'blur(10px)',duration:.24,ease:'power2.in',stagger:{each:st||.02,from:'end'}},t); }
tl.set('.ql,.sl,.e1,.tl',{opacity:0},0);
tl.set(['#srch','#sm','.pin','#w','#wc','#cal','#tot','#btn','#sub','#pr','#hrt','#dots'],{opacity:0},0);
tl.set('#w',{xPercent:-50,yPercent:-50,transformPerspective:1000},0); tl.set('#mapw',{clipPath:'circle(0px at 330px 540px)'},0); tl.set('#dt0',{backgroundColor:'#fff'},0);
// ---------- sketches on the left
tl.set('.skt',{opacity:0},0); tl.set('.sp',{strokeDashoffset:1},0); tl.set('.hw',{opacity:0},0);
SKT.forEach((t,k)=>{
  F('#sk'+k,{opacity:0},{opacity:1,duration:.25},t); if(k) F('#sk'+(k-1),{opacity:1},{opacity:0,duration:.25},t);
  const ps=document.querySelectorAll('#sk'+k+' .sp'); const L=ps.length;
  ps.forEach((p,i)=>F(p,{strokeDashoffset:1},{strokeDashoffset:0,duration:.28,ease:'power1.inOut'},t+0.05+i*(0.8/L)));
  F('#sk'+k+' .hw',{opacity:0},{opacity:1,duration:.3,stagger:.1},t+0.3); });
F('#paper',{rotation:-1},{rotation:1,duration:3.2,yoyo:true,repeat:5,ease:'sine.inOut'},0);
// ---------- always-alive: colour fields drift, slow camera push
F('#bl0',{x:-40,y:0},{x:70,y:-50,duration:DUR,ease:'sine.inOut'},0);
F('#bl1',{x:0,y:0},{x:-120,y:70,duration:DUR,ease:'sine.inOut'},0);
F('#cam',{scale:1},{scale:1.06,duration:DUR,ease:'sine.inOut'},0);
// ---------- 0: "Where to?" + search pill, "Lisbon" types in
typeIn('.ql',0.08,.04);
F('#srch',{opacity:0,scale:.8,y:40},{opacity:1,scale:1,y:0,duration:.6,ease:'back.out(1.5)'},0.12);
for(let i=0;i<NP;i++) F('.sl:nth-child('+(i+1)+')',{opacity:0,y:8},{opacity:1,y:0,duration:.14,ease:'power2.out'},0.4+i*0.09);
F('#sm',{opacity:0,x:-12},{opacity:1,x:0,duration:.35,ease:OUT},1.0);
F('#srch .go',{scale:1},{scale:.82,duration:.1,yoyo:true,repeat:1,ease:'power2.inOut'},1.42);
typeOut('.ql',1.35,.015);
// ---------- 1: pill rides up, the map opens from it; prices pop
F('#srch',{top:540,scale:1},{top:96,scale:.86,duration:.8,ease:IO3},1.55);
F('#mapw',{clipPath:'circle(0px at 330px 540px)'},{clipPath:'circle(1300px at 330px 540px)',duration:1.0,ease:'power2.inOut'},1.6);
F('#map',{x:-30,y:-150,scale:1.12},{x:-120,y:-260,scale:1,duration:2.1,ease:'power2.out',transformOrigin:'450px 820px'},1.6);
document.querySelectorAll('.pin').forEach((el,i)=>{ F(el,{opacity:0,scale:0,y:20},{opacity:1,scale:1,y:0,duration:.5,ease:'back.out(2.2)'},2.3+i*0.11); });
F('#ring',{opacity:.9,scale:1},{opacity:0,scale:1.9,duration:.7,ease:'power2.out'},3.35);
F('#pin'+SEL,{scale:1},{scale:1.12,duration:.18,yoyo:true,repeat:1,ease:'sine.inOut'},3.35);
F('#pin'+SEL,{backgroundColor:'#ffffff',color:'#222222'},{backgroundColor:'#222222',color:'#ffffff',duration:.22},3.72);
// ---------- 2: the chosen price pin grows into the listing card
F('#w',{opacity:0},{opacity:1,duration:.02},3.98); F('#pin'+SEL,{opacity:1},{opacity:0,duration:.02},4.0);
F('#scrim',{opacity:0},{opacity:.6,duration:.7,ease:IO3},4.0);
F(document.querySelectorAll('.pin:not(#pin'+SEL+')'),{opacity:1,scale:1},{opacity:0,scale:.6,duration:.35,ease:'power2.in',stagger:.03},4.0);
F('#w',{width:110,height:56,borderRadius:28},{width:560,height:540,borderRadius:40,duration:.85,ease:IO},4.0);
F('#w',{backgroundColor:'#222222'},{backgroundColor:'#ffffff',duration:.26,ease:'power1.inOut'},4.02);
F('#wpin',{opacity:1,scale:1},{opacity:0,scale:1.3,duration:.14,ease:'power2.in'},4.0);
F('#wc',{x:-225,y:-242,scale:.8},{x:0,y:0,scale:1,duration:.75,ease:IO},4.1);
F('#wc',{opacity:0},{opacity:1,duration:.3,ease:'power2.out'},4.36);
F('#strip',{scale:1.18,transformOrigin:'280px 190px'},{scale:1,duration:1.3,ease:'power2.out'},4.2);
typeIn('.tl',4.6,.022,.36);
F(['#sub','#pr'],{opacity:0,y:12},{opacity:1,y:0,duration:.4,ease:OUT,stagger:.08},4.85);
F(['#hrt','#dots'],{opacity:0,scale:.5},{opacity:1,scale:1,duration:.4,ease:'back.out(2)',stagger:.06},4.8);
// swipe through the photos
F('#strip',{x:0},{x:-560,duration:.7,ease:IO3},5.3); F('#dt0',{backgroundColor:'#fff'},{backgroundColor:'rgba(255,255,255,.55)',duration:.3},5.5); F('#dt1',{backgroundColor:'rgba(255,255,255,.55)'},{backgroundColor:'#fff',duration:.3},5.5);
F('#strip',{x:-560},{x:-1120,duration:.7,ease:IO3},6.2); F('#dt1',{backgroundColor:'#fff'},{backgroundColor:'rgba(255,255,255,.55)',duration:.3},6.4); F('#dt2',{backgroundColor:'rgba(255,255,255,.55)'},{backgroundColor:'#fff',duration:.3},6.4);
F('#hrt',{scale:1,color:'#bbbbbb'},{scale:1.35,color:'#ff3d5e',duration:.22,ease:'back.out(3)'},6.9); F('#hrt',{scale:1.35},{scale:1,duration:.25,ease:'power2.out'},7.12);
F('#w',{rotationY:0},{rotationY:-5,duration:.9,yoyo:true,repeat:1,ease:'sine.inOut'},5.2);
// ---------- 3: photo folds down, the calendar opens, dates are dragged
F('#srch',{opacity:1,y:0},{opacity:0,y:-60,duration:.4,ease:'power2.in'},7.0);
F('#w',{height:540},{height:896,duration:.8,ease:IO},7.2);
F('#imgw',{height:380},{height:170,duration:.8,ease:IO},7.2); F('#strip',{y:0},{y:-110,duration:.8,ease:IO},7.2);
F('#lower',{y:0},{y:-210,duration:.8,ease:IO},7.2);
F(['#hrt','#dots'],{opacity:1},{opacity:0,duration:.25},7.2);
F('#cal',{opacity:0,y:40},{opacity:1,y:0,duration:.55,ease:OUT},7.55);
F('.c',{opacity:0,scale:.6},{opacity:1,scale:1,duration:.3,ease:'back.out(2)',stagger:{each:.012,from:'start'}},7.6);
F(['#tot','#btn'],{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:OUT,stagger:.08},7.8);
F('#fg',{opacity:0,scale:1.6},{opacity:1,scale:1,duration:.25,ease:'power2.out'},8.05);
F('#d16 span',{backgroundColor:'rgba(34,34,34,0)',color:'#222222'},{backgroundColor:'#222222',color:'#ffffff',duration:.2},8.2);
F('#rng',{opacity:0},{opacity:1,duration:.1},8.25);
F('#rng',{width:48},{width:258,duration:1.0,ease:'power2.inOut'},8.3); F('#fg',{x:0},{x:210,duration:1.0,ease:'power2.inOut'},8.3);
F('#d19 span',{backgroundColor:'rgba(34,34,34,0)',color:'#222222'},{backgroundColor:'#222222',color:'#ffffff',duration:.2},9.22);
F('#fg',{opacity:1,scale:1},{opacity:0,scale:1.5,duration:.3},9.35);
const TN={v:0}; F(TN,{v:0},{v:360,duration:1.0,ease:'power2.inOut',onUpdate:()=>{ document.getElementById('totn').textContent='€'+Math.round(TN.v); }},8.3);
F('#tot b',{scale:1,transformOrigin:'100% 60%'},{scale:1.14,duration:.18,yoyo:true,repeat:1,ease:'sine.inOut'},9.3);
// ---------- 4: Reserve -> the whole card folds into the button -> loading -> check
F('#btn',{scale:1},{scale:.94,duration:.1,yoyo:true,repeat:1,ease:'power2.inOut'},10.0);
F('#wc',{opacity:1,scale:1},{opacity:0,scale:.9,duration:.35,ease:'power2.in',transformOrigin:'280px 700px'},10.2);
F('#w',{width:560,height:896,borderRadius:40,backgroundColor:'#ffffff'},{width:300,height:88,borderRadius:44,backgroundColor:'#ff6a3a',duration:.7,ease:IO},10.22);
F('#wpill',{opacity:0,scale:.5},{opacity:1,scale:1,duration:.3,ease:OUT},10.55); F('#spin',{rotation:0},{rotation:540,duration:.75,ease:'none'},10.5);
F('#spin',{opacity:1,scale:1},{opacity:0,scale:.4,duration:.15},10.82); F('#chk',{opacity:0,scale:.3},{opacity:1,scale:1,duration:.3,ease:'back.out(3)'},10.85);
F('#w',{scaleX:1},{scaleX:1.08,duration:.14,yoyo:true,repeat:1,ease:'sine.inOut'},10.85);
// ---------- 5: the pill opens into the boarding pass, confetti, 3D drift
F('#wpill',{opacity:1},{opacity:0,duration:.2},11.1);
F('#w',{width:300,height:88,borderRadius:44,backgroundColor:'#ff6a3a'},{width:560,height:340,borderRadius:36,backgroundColor:'#1b1630',duration:.75,ease:IO3},11.0);
F('#scrim',{backgroundColor:'#fbf4ea',opacity:.6},{backgroundColor:'#ffd9b8',opacity:.88,duration:.8,ease:IO3},11.0);
F('#pass',{opacity:0,scale:.92,transformOrigin:'280px 170px'},{opacity:1,scale:1,duration:.5,ease:OUT},11.35);
F('#pass .b',{letterSpacing:'0.12em'},{letterSpacing:'-0.04em',duration:.9,ease:'power3.out'},11.35);
CF.forEach((c,i)=>{ const el='#cf'+i, t0=11.78+(i%6)*0.012;
  F(el,{opacity:0},{opacity:1,duration:.05},t0); F(el,{x:0,rotation:0},{x:c[0],rotation:c[3],duration:1.5,ease:'power2.out'},t0);
  F(el,{y:-150},{y:-150-c[1],duration:.55,ease:'power2.out'},t0); F(el,{y:-150-c[1]},{y:c[2],duration:.95,ease:'power2.in'},t0+0.55);
  F(el,{opacity:1},{opacity:0,duration:.4},t0+1.05); });
F('#w',{rotationX:0},{rotationX:12,duration:1.0,ease:IO3},11.5); F('#w',{rotationX:12},{rotationX:5,duration:.78,ease:'sine.inOut'},12.5);
F('#w',{rotationY:0},{rotationY:-16,duration:.85,ease:'sine.inOut'},11.5); F('#w',{rotationY:-16},{rotationY:10,duration:.93,ease:'sine.inOut'},12.35);
F('#w',{boxShadow:'0 30px 70px rgba(0,0,0,.28)'},{boxShadow:'30px 50px 90px rgba(0,0,0,.4)',duration:1.0,ease:IO3},11.5);
// ---------- 6: the pass grows into the end screen
F('#pass',{opacity:1,scale:1},{opacity:0,scale:.94,duration:.3,ease:'power2.in'},13.3);
F('#w',{rotationX:5,rotationY:10},{rotationX:0,rotationY:0,duration:.85,ease:'power2.out'},13.3);
F('#w',{width:560,height:340,borderRadius:36,backgroundColor:'#1b1630'},{width:820,height:1340,borderRadius:0,backgroundColor:'#0d0a18',duration:.95,ease:'power2.inOut'},13.3);
typeIn('.e1',13.75,.04,.5);
F('#e1',{scale:1.06},{scale:1,duration:1.4,ease:'power2.out'},13.75);
F('#glow',{opacity:0,scale:.6},{opacity:.55,scale:1,duration:1.2,ease:'power2.out'},13.7); F('#glow',{rotation:0},{rotation:50,duration:2.3,ease:'none'},13.7);
F('#e2',{opacity:0,y:16,filter:'blur(8px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.6,ease:'power3.out'},14.5);
F('#e3',{opacity:0},{opacity:1,duration:.6},14.9);
F('#endw',{scale:1},{scale:1.05,duration:2.0,ease:'sine.inOut'},13.9);
F('#cta',{scale:1},{scale:1.06,duration:.35,yoyo:true,repeat:1,ease:'sine.inOut'},15.0);
window.__timelines['main']=tl; tl.seek(0);
'''
rep = {"__DUR__": str(DUR), "__SPARK__": SPARK, "__SKETCHES__": sketches, "__Q__": letters("Where to?", "ql"), "__MAP__": build_map(), "__PINS__": pins,
       "__SL__": letters("Lisbon", "sl"), "__MAG__": MAG, "__ILLS__": ILLS, "__TTL__": letters("Rooftop loft in Alfama", "tl"), "__DAYS__": days,
       "__BARS__": bars, "__KEY__": KEY, "__CONF__": conf, "__E1__": letters("Your stay is booked.", "e1"),
       "__SKT__": json.dumps(SKT), "__CF__": json.dumps(CF), "__NP__": "6", "__SEL__": str(SEL)}
html = ('<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920">'
        '<script src="assets/gsap.min.js"></script><style>' + CSS + '</style></head><body>' + BODY + '<script>' + JS + '</script></body></html>')
for k, v in rep.items(): html = html.replace(k, v)
(W / "index.html").write_text(html)
print("ok", NAME, "dur", DUR)
