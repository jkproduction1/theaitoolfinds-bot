"""sketch4 - "Sketch -> Motion" #4 (Jan, 2026-11-10): food-delivery app concept, built on Claude Fable 5.2. Own design, no real
brand name/logo in the picture (caption may say "Wolt-style"). One hero object morphs: category tile -> burger card (burger
assembles layer by layer) -> cart pill -> live tracking card (courier rides the route, ETA counts down) -> delivered pill ->
rating card -> end screen. Plain 30 fps, picture scaled to 92 % at encode (IG side crop). Music t1 + sfx."""
import json, math, random, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
H = HERE.parent.parent
sys.path.insert(0, str(H))
from house import write_sfx
from sketchlib import line, rect, circ, squig, arrow, txt, sketch_svg

NAME = "sketch4"
W = H / "work" / NAME; A = W / "assets"
if W.exists(): shutil.rmtree(W)
A.mkdir(parents=True, exist_ok=True); (W / "renders").mkdir(exist_ok=True)
for f in (H / "template").iterdir(): shutil.copy(f, W / f.name)
for f in (H / "assets").iterdir(): shutil.copy(f, A / f.name)
shutil.copy(H / "videos" / "sketch1" / "media" / "caveat.woff2", A / "caveat.woff2")

DUR = 16.8
SKT = [0.0, 1.5, 3.9, 7.0, 11.4]
TR = "t1"
tj = json.load(open(H.parent / "video/public/music/tracks.json"))[TR]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(tj["hook_start"]), "-i", str(H.parent / "video/public/music" / tj["file"]), "-t", str(DUR + 1),
                "-af", f"afade=t=in:d=0.15,afade=t=out:st={DUR - 0.9}:d=0.9", str(A / "music.mp3")], check=True)
ev = [(0.5 + i * 0.1, "pop") for i in range(4)] + [(1.35, "click"), (1.5, "whoosh")] + [(2.45 + i * 0.13, "pop") for i in range(6)] + [(4.4, "click"), (5.3, "click"), (5.45, "pop"),
      (6.2, "click"), (6.35, "whoosh"), (7.1, "whoosh")] + [(8.3, "tick"), (9.9, "tick"), (11.25, "pop"), (11.55, "whoosh"), (12.1, "pop"), (12.3, "whoosh")] + \
     [(13.0 + i * 0.12, "tick") for i in range(5)] + [(14.1, "whoosh")]
write_sfx(ev, DUR, A / "sfx.wav")
R = random.Random(8)

# ---------------------------------------------------------------- sketches (330 x 590)
SK = []
SK.append([txt(165, 110, "hungry?", 48, "middle")] + rect(40, 160, 110, 110) + rect(180, 160, 110, 110) + rect(40, 300, 110, 110) + rect(180, 300, 110, 110) +
          circ(95, 215, 30) + [line(205, 240, 235, 185), line(235, 185, 265, 240), line(205, 240, 265, 240)] + circ(95, 355, 22) + [line(205, 345, 265, 345), line(215, 375, 255, 375)])
SK.append(rect(35, 40, 260, 480) + [line(90, 200, 240, 200), line(85, 220, 245, 220), line(90, 240, 240, 240), line(85, 262, 245, 262)] + circ(165, 150, 60, 0.55) +
          [line(100, 285, 230, 285)] + arrow(165, 60, 165, 100) + squig(60, 350, 150) + squig(60, 380, 90) + [txt(165, 470, "stack it", 28, "middle")])
SK.append(rect(35, 60, 260, 430) + rect(55, 250, 110, 44) + [txt(72, 282, "-", 30), txt(105, 282, "2", 28), txt(135, 282, "+", 28)] + rect(180, 250, 100, 44) + [txt(230, 280, "fries", 22, "middle")] +
          rect(55, 400, 220, 56) + [txt(165, 438, "add · €22", 28, "middle")] + circ(140, 272, 30))
_r = rect(35, 30, 260, 500) + [line(80, 300, 80, 220), line(80, 220, 170, 220), line(170, 220, 170, 140), line(170, 140, 250, 140), line(250, 140, 250, 80)] + circ(80, 300, 10) + circ(250, 80, 12) + circ(170, 190, 14) + \
     [txt(60, 400, "12 min", 40)] + squig(60, 440, 190) + [line(60, 480, 270, 480)]
SK.append(_r)
_st = []
for i in range(5):
    cx = 65 + i * 50
    pts = [(cx + 20 * math.cos(-math.pi / 2 + k * math.pi * 4 / 5), 250 + 20 * math.sin(-math.pi / 2 + k * math.pi * 4 / 5)) for k in range(6)]
    _st += [line(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], 0.6) for k in range(5)]
SK.append(rect(35, 170, 260, 150) + _st + [txt(165, 215, "delivered!", 34, "middle")] + [txt(165, 430, "yum", 52, "middle")] + [line(70, 130, 60, 105), line(165, 120, 165, 90), line(260, 130, 272, 105)])
sketches = "".join(sketch_svg(k, it) for k, it in enumerate(SK))

def letters(s, cls):
    return "".join(f'<span class="{cls}">{c if c != " " else "&nbsp;"}</span>' for c in s)

IC = {
 "burger": '<svg viewBox="0 0 120 120"><path d="M18 56 a42 34 0 0 1 84 0z" fill="#e8a04a"/><rect x="14" y="60" width="92" height="9" rx="4.5" fill="#6cc04a"/><rect x="18" y="71" width="84" height="14" rx="7" fill="#5a3320"/><path d="M18 89 h84 v6 a12 12 0 0 1 -12 12 h-60 a12 12 0 0 1 -12 -12z" fill="#d98f3e"/><circle cx="46" cy="38" r="3" fill="#fff3d6"/><circle cx="64" cy="32" r="3" fill="#fff3d6"/><circle cx="80" cy="42" r="3" fill="#fff3d6"/></svg>',
 "pizza": '<svg viewBox="0 0 120 120"><path d="M60 108 L16 24 a52 52 0 0 1 88 0z" fill="#ffc93c"/><path d="M16 24 a52 52 0 0 1 88 0 l-6 10 a44 44 0 0 0 -76 0z" fill="#d98f3e"/><circle cx="50" cy="50" r="8" fill="#e8452f"/><circle cx="72" cy="58" r="7" fill="#e8452f"/><circle cx="60" cy="80" r="6" fill="#e8452f"/></svg>',
 "sushi": '<svg viewBox="0 0 120 120"><ellipse cx="60" cy="70" rx="42" ry="30" fill="#1f2a2e"/><ellipse cx="60" cy="56" rx="42" ry="30" fill="#1f2a2e"/><ellipse cx="60" cy="56" rx="34" ry="23" fill="#fff"/><ellipse cx="60" cy="56" rx="16" ry="11" fill="#ff8a5c"/><ellipse cx="54" cy="53" rx="5" ry="3" fill="#6cc04a"/></svg>',
 "salad": '<svg viewBox="0 0 120 120"><circle cx="42" cy="46" r="18" fill="#6cc04a"/><circle cx="66" cy="38" r="20" fill="#4fa83a"/><circle cx="84" cy="50" r="15" fill="#8ad45a"/><circle cx="58" cy="50" r="8" fill="#e8452f"/><path d="M14 58 h92 a46 44 0 0 1 -92 0z" fill="#fff"/><path d="M14 58 h92 v6 h-92z" fill="#e6e0d6"/></svg>',
}
TILES = [("burger", "Burgers", 185, 470), ("pizza", "Pizza", 475, 470), ("sushi", "Sushi", 185, 760), ("salad", "Salads", 475, 760)]
tiles = "".join(f'<div class="tile" id="tile{i}" style="left:{x}px;top:{y}px">{IC[k]}<b>{n}</b></div>' for i, (k, n, x, y) in enumerate(TILES) if i)
sesame = "".join(f'<i style="left:{x}px;top:{y}px;transform:rotate({r}deg)"></i>' for x, y, r in [(60, 30, 20), (110, 18, -15), (160, 26, 30), (200, 44, -25), (85, 56, -10), (140, 54, 15), (40, 62, 35)])
fries = "".join(f'<i style="left:{8 + i * 13}px;height:{60 + (i * 23) % 34}px;transform:rotate({(i - 3) * 4}deg)"></i>' for i in range(7))
ROUTE = [(90, 470), (90, 330), (250, 330), (250, 190), (420, 190), (420, 90)]
def track_map():
    o = ['<svg viewBox="0 0 560 560" width="560" height="560"><rect width="560" height="560" fill="#eef0e6"/>']
    for (x, y, w, h) in [(110, 30, 120, 140), (270, 210, 130, 100), (440, 110, 110, 200), (110, 350, 120, 100), (270, 350, 280, 180), (20, 30, 50, 280), (270, 30, 130, 140)]:
        o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{R.choice(["#e2e6d8", "#cfe6c0", "#e2e6d8"])}"/>')
    for x in (90, 250, 420): o.append(f'<rect x="{x - 9}" y="0" width="18" height="560" fill="#fff"/>')
    for y in (190, 330, 470, 90): o.append(f'<rect x="0" y="{y - 9}" width="560" height="18" fill="#fff"/>')
    d = "M" + " L".join(f"{x} {y}" for x, y in ROUTE)
    o.append(f'<path d="{d}" fill="none" stroke="#c9c2b4" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 16"/>')
    o.append(f'<path id="rprog" d="{d}" fill="none" stroke="#ff4d3d" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>')
    o.append('</svg>')
    return "".join(o)
stars = "".join(f'<svg class="star" id="star{i}" viewBox="0 0 48 48"><path d="M24 3 l6.2 13.2 14.3 1.8 -10.5 9.9 2.7 14.2 L24 35.2 11.3 42.1 14 27.9 3.5 18 17.8 16.2z"/></svg>' for i in range(5))
conf = "".join(f'<i class="cf" id="cf{i}" style="background:{c}"></i>' for i, c in enumerate(["#ff4d3d", "#ffc93c", "#22b573", "#6cc04a", "#7a8cff", "#fff"] * 7))
CF = [(R.uniform(-300, 300), R.uniform(160, 420), R.uniform(240, 520), R.uniform(-540, 540)) for _ in range(42)]
SPARK = '<svg viewBox="0 0 100 100"><path fill="#e8734a" d="M50 4l6 30 22-21-12 28 30-4-27 14 27 14-30-4 12 28-22-21-6 30-6-30-22 21 12-28-30 4 27-14-27-14 30 4-12-28 22 21z"/></svg>'
BIKE = '<svg viewBox="0 0 48 48"><circle cx="12" cy="32" r="7" fill="none" stroke="#fff" stroke-width="3.5"/><circle cx="36" cy="32" r="7" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M12 32 L20 18 H30 L36 32 M20 18 L26 32 M28 12 h6" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'

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
#st{position:absolute;left:380px;top:380px;width:660px;height:1100px;overflow:hidden;background:#fff6e6;box-shadow:0 30px 80px rgba(0,0,0,.7)}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.bl{position:absolute;border-radius:50%;filter:blur(70px)}
#bl0{left:-200px;top:720px;width:900px;height:480px;background:#ffc93c;opacity:.75}
#bl1{left:240px;top:-180px;width:640px;height:480px;background:#ff8a6a;opacity:.6}
#q{position:absolute;left:0;right:0;top:170px;display:flex;justify-content:center;font-size:84px;font-weight:900;letter-spacing:-.04em;color:#222;white-space:nowrap}
.ql,.e1,.tl{display:inline-block}
.tile{position:absolute;width:250px;height:250px;margin:-125px 0 0 -125px;border-radius:44px;background:#fff;box-shadow:0 18px 40px rgba(0,0,0,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#222;font-size:26px}
.tile svg{width:130px;height:130px}
#wz{position:absolute;left:330px;top:560px;width:0;height:0}
#w{position:absolute;left:0;top:0;width:250px;height:250px;border-radius:44px;background:#fff;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,.12)}
#wtile{position:absolute;left:50%;top:50%;width:250px;height:250px;margin:-125px 0 0 -125px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#222;font-size:26px;font-weight:700}
#wtile svg{width:130px;height:130px}
#ring{position:absolute;left:185px;top:470px;width:250px;height:250px;margin:-125px 0 0 -125px;border-radius:44px;border:5px solid #ff4d3d;opacity:0}
#wc{position:absolute;left:0;top:0;width:560px;height:652px;color:#222;opacity:0}
#hero{position:absolute;left:0;top:0;width:560px;height:330px;background:radial-gradient(70% 80% at 50% 60%,#fff1c9,#ffd27a);overflow:hidden}
.ly{position:absolute;left:150px}
#l5{top:268px;width:260px;height:44px;border-radius:14px 14px 40px 40px;background:#d98f3e}
#l4{top:222px;width:260px;height:46px;border-radius:23px;background:#5a3320;box-shadow:inset 0 -8px 0 rgba(0,0,0,.18)}
#l3{top:204px;left:142px;width:276px;height:22px;border-radius:6px;background:#ffc93c} #l3:after{content:'';position:absolute;left:40px;top:14px;width:26px;height:26px;border-radius:0 0 13px 13px;background:#ffc93c}
#l2{top:184px;left:156px;width:248px;height:22px;border-radius:11px;background:#e8452f}
#l1{top:162px;left:138px;width:284px;height:26px;border-radius:13px;background:#6cc04a;box-shadow:inset 0 -6px 0 #4fa83a}
#l0{top:62px;width:260px;height:104px;border-radius:130px 130px 18px 18px;background:#e8a04a;box-shadow:inset 0 -10px 0 rgba(0,0,0,.08)}
#l0 i{position:absolute;width:14px;height:7px;border-radius:4px;background:#fff3d6}
#fries{position:absolute;left:428px;top:170px;width:104px;height:142px;opacity:0}
#fries i{position:absolute;bottom:60px;width:11px;border-radius:4px;background:#ffc93c;box-shadow:inset -3px 0 0 #e8a92a}
#fries b{position:absolute;left:0;bottom:0;width:104px;height:84px;border-radius:8px 8px 22px 22px;background:#e8452f}
#qb{position:absolute;left:300px;top:40px;width:64px;height:64px;border-radius:50%;background:#222;color:#fff;font-size:30px;font-weight:800;display:flex;align-items:center;justify-content:center;opacity:0}
#lower{position:absolute;left:0;top:330px;width:560px;height:322px}
#ttl{position:absolute;left:32px;top:24px;font-size:34px;font-weight:800;letter-spacing:-.02em;display:flex;white-space:nowrap}
#pr{position:absolute;right:32px;top:26px;font-size:32px;font-weight:800}
#sub{position:absolute;left:32px;top:72px;font-size:22px;color:#666;white-space:nowrap} #sub b{color:#222}
#stp{position:absolute;left:32px;top:122px;width:190px;height:64px;border-radius:32px;background:#f2ede4;display:flex;align-items:center;justify-content:space-between;padding:0 8px;font-size:28px;font-weight:800}
#stp i{font-style:normal;width:48px;height:48px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,.12)}
#chip{position:absolute;left:244px;top:122px;height:64px;padding:0 26px;border-radius:32px;border:3px solid #e6dfd2;display:flex;align-items:center;font-size:24px;font-weight:700;color:#222;white-space:nowrap}
#btn{position:absolute;left:32px;top:210px;width:496px;height:84px;border-radius:22px;background:#ff4d3d;color:#fff;font-size:28px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:10px}
#fg{position:absolute;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;background:rgba(34,34,34,.18);border:3px solid rgba(34,34,34,.55);opacity:0;z-index:5;left:0;top:0}
#cart{position:absolute;left:50%;top:50%;width:420px;height:88px;margin:-44px 0 0 -210px;display:flex;align-items:center;justify-content:space-between;padding:0 36px;color:#fff;font-size:25px;font-weight:800;opacity:0;white-space:nowrap}
#cart span{font-weight:600;color:rgba(255,255,255,.75)}
#trk{position:absolute;left:0;top:0;width:560px;height:860px;color:#222;opacity:0}
#tmap{position:absolute;left:0;top:0;width:560px;height:560px;overflow:hidden}
.mk{position:absolute;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;color:#fff;box-shadow:0 6px 16px rgba(0,0,0,.25)}
#mk0{left:90px;top:470px;background:#222} #mk1{left:420px;top:90px;background:#22b573}
#hring{position:absolute;left:420px;top:90px;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;border:5px solid #22b573;opacity:0}
#cour{position:absolute;left:90px;top:470px;width:68px;height:68px;margin:-34px 0 0 -34px;border-radius:50%;background:#ff4d3d;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(255,77,61,.5)} #cour svg{width:42px;height:42px}
#th{position:absolute;left:32px;top:588px;font-size:36px;font-weight:800;letter-spacing:-.02em}
#ts{position:absolute;left:32px;top:636px;font-size:22px;color:#666}
#eta{position:absolute;right:32px;top:584px;text-align:right;font-size:60px;font-weight:900;letter-spacing:-.04em;line-height:1} #eta small{display:block;font-size:20px;font-weight:600;color:#666;letter-spacing:0;margin-top:4px}
#bar{position:absolute;left:32px;top:724px;width:496px;height:10px;border-radius:5px;background:#f2ede4} #bar i{display:block;height:100%;width:0;border-radius:5px;background:#ff4d3d}
.stp2{position:absolute;top:752px;font-size:20px;font-weight:700;color:#b5ad9f} #s2a{left:32px} #s2b{left:232px} #s2c{right:32px}
#done{position:absolute;left:50%;top:50%;width:320px;height:88px;margin:-44px 0 0 -160px;display:flex;align-items:center;justify-content:center;gap:14px;color:#fff;font-size:30px;font-weight:800;opacity:0}
#rate{position:absolute;left:0;top:0;width:560px;height:320px;opacity:0;color:#fff}
#rate .a{position:absolute;left:0;right:0;top:44px;text-align:center;font-size:20px;letter-spacing:.16em;font-weight:700;color:#ffc93c}
#rate .b{position:absolute;left:0;right:0;top:78px;text-align:center;font-size:50px;font-weight:900;letter-spacing:-.03em}
#rate .s{position:absolute;left:0;right:0;top:170px;display:flex;justify-content:center;gap:16px}
.star{width:70px;height:70px;fill:rgba(255,255,255,.16)}
.cf{position:absolute;left:330px;top:560px;width:14px;height:22px;margin:-11px 0 0 -7px;border-radius:3px;opacity:0}
#endw{position:absolute;inset:0;transform-origin:50% 48%}
#glow{position:absolute;left:80px;top:300px;width:500px;height:500px;border-radius:50%;background:conic-gradient(from 0deg,#ff4d3d,#ffc93c,#ff8a6a,#ff4d3d);filter:blur(100px);opacity:0}
#e1{position:absolute;left:0;right:0;top:470px;display:flex;justify-content:center;font-size:60px;font-weight:800;letter-spacing:-.03em;white-space:nowrap}
#e2{position:absolute;left:0;right:0;top:570px;text-align:center;font-size:28px;font-weight:600;color:rgba(255,255,255,.75);opacity:0} #e2 b{color:#ffc93c}
#e3{position:absolute;left:0;right:0;top:1020px;text-align:center;font-size:20px;font-weight:500;color:rgba(255,255,255,.4);opacity:0}
#cta{position:absolute;left:0;right:0;top:1545px;text-align:center;font-size:52px;font-weight:800;letter-spacing:-.02em} #cta b{color:#ff4d3d}
#handle{position:absolute;left:50%;top:1650px;transform:translateX(-50%);font-size:30px;font-weight:600;color:rgba(255,255,255,.55)}
'''
BODY = '''<div id="root" data-composition-id="main" data-start="0" data-duration="__DUR__" data-width="1080" data-height="1920" data-motion-blur="off">
<div id="hdr">__SPARK__<span>Claude Fable 5.2</span></div>
<div id="dl">Drawing</div>
<div id="paper">__SKETCHES__</div>
<div id="st"><div id="cam">
 <div class="bl" id="bl0"></div><div class="bl" id="bl1"></div>
 <div id="q">__Q__</div>
 __TILES__<div id="ring"></div>
 __CONF__
 <div id="wz"><div id="w"><div id="wtile">__BURGER__<b>Burgers</b></div>
  <div id="wc"><div id="hero"><div class="ly" id="l5"></div><div class="ly" id="l4"></div><div class="ly" id="l3"></div><div class="ly" id="l2"></div><div class="ly" id="l1"></div><div class="ly" id="l0">__SESAME__</div>
    <div id="fries">__FRIES__<b></b></div><div id="qb">×2</div></div>
   <div id="lower"><div id="ttl">__TTL__</div><div id="pr">€9.50</div><div id="sub"><b>★ 4.8</b> · 20–30 min · Free delivery</div>
    <div id="stp"><i>−</i><span id="qty">1</span><i id="plus">+</i></div><div id="chip">+ Fries · €3</div>
    <div id="btn">Add to order · €<span id="bp">9.50</span></div><div id="fg"></div></div></div>
  <div id="cart"><div>2 items</div><span>View order · €22</span></div>
  <div id="trk"><div id="tmap">__TMAP__<div class="mk" id="mk0">R</div><div id="hring"></div><div class="mk" id="mk1">⌂</div><div id="cour">__BIKE__</div></div>
   <div id="th">On the way</div><div id="ts">Alex is bringing your order</div><div id="eta"><span id="etan">12</span><small>min</small></div>
   <div id="bar"><i id="barf"></i></div><div class="stp2" id="s2a">Preparing</div><div class="stp2" id="s2b">Picked up</div><div class="stp2" id="s2c">Arriving</div></div>
  <div id="done"><span>✓</span><span>Delivered</span></div>
  <div id="rate"><div class="a">DELIVERED IN 24 MIN</div><div class="b">Enjoy your meal</div><div class="s">__STARS__</div></div>
 </div></div>
 <div id="endw"><div id="glow"></div><div id="e1">__E1__</div><div id="e2">Built with <b>Claude Fable 5.2</b></div><div id="e3">Unofficial concept · not a real app</div></div>
</div></div>
<div id="cta">Comment “<b>SKETCH</b>” for the prompts</div>
<div id="handle">@theaitoolfinds</div>
<audio id="mus" class="clip" src="assets/music.mp3" data-start="0" data-duration="__DUR__" data-track-index="21" data-volume="0.3"></audio>
<audio id="fx" class="clip" src="assets/sfx.wav" data-start="0" data-duration="__DUR__" data-track-index="22" data-volume="0.6"></audio>
</div>'''
JS = r'''
window.__timelines=window.__timelines||{};
const DUR=__DUR__, SKT=__SKT__, CF=__CF__, ROUTE=__ROUTE__;
const tl=gsap.timeline({paused:true}); const NI={immediateRender:false};
function F(s,a,b,t){ return tl.fromTo(s,a,Object.assign({},b,NI),t); }
const IO='power4.inOut', IO3='power3.inOut', OUT='expo.out';
function typeIn(sel,t,st,d){ F(sel,{opacity:0,y:14,filter:'blur(10px)'},{opacity:1,y:0,filter:'blur(0px)',duration:d||.42,ease:'power3.out',stagger:st||.04},t); }
function typeOut(sel,t,st){ F(sel,{opacity:1,y:0,filter:'blur(0px)'},{opacity:0,y:-10,filter:'blur(10px)',duration:.24,ease:'power2.in',stagger:{each:st||.02,from:'end'}},t); }
tl.set('.ql,.e1,.tl',{opacity:0},0);
tl.set(['.tile','#w','.ly','#sub','#pr','#stp','#chip','#btn','#th','#ts','#eta','#bar','.stp2'],{opacity:0},0); tl.set(['#mk0','#mk1','#cour'],{scale:0},0);
tl.set('#w',{xPercent:-50,yPercent:-50,transformPerspective:1000,x:-145,y:-90},0);
// ---------- sketches
tl.set('.skt',{opacity:0},0); tl.set('.sp',{strokeDashoffset:1},0); tl.set('.hw',{opacity:0},0);
SKT.forEach((t,k)=>{
  F('#sk'+k,{opacity:0},{opacity:1,duration:.25},t); if(k) F('#sk'+(k-1),{opacity:1},{opacity:0,duration:.25},t);
  const ps=document.querySelectorAll('#sk'+k+' .sp'); const L=ps.length;
  ps.forEach((p,i)=>F(p,{strokeDashoffset:1},{strokeDashoffset:0,duration:.28,ease:'power1.inOut'},t+0.05+i*(0.8/L)));
  F('#sk'+k+' .hw',{opacity:0},{opacity:1,duration:.3,stagger:.1},t+0.3); });
F('#paper',{rotation:-1},{rotation:1,duration:3.2,yoyo:true,repeat:5,ease:'sine.inOut'},0);
F('#bl0',{x:-40,y:0},{x:70,y:-50,duration:DUR,ease:'sine.inOut'},0);
F('#bl1',{x:0,y:0},{x:-120,y:70,duration:DUR,ease:'sine.inOut'},0);
F('#cam',{scale:1},{scale:1.06,duration:DUR,ease:'sine.inOut'},0);
// ---------- 0: "Hungry?" + four category tiles
typeIn('.ql',0.08,.05);
F('#w',{opacity:0,scale:.5},{opacity:1,scale:1,duration:.55,ease:'back.out(1.8)'},0.45);
[1,2,3].forEach((i,k)=>F('#tile'+i,{opacity:0,scale:.5,y:40},{opacity:1,scale:1,y:0,duration:.55,ease:'back.out(1.8)'},0.55+k*0.1));
F('#wtile svg',{rotation:0},{rotation:-8,duration:.5,yoyo:true,repeat:1,ease:'sine.inOut'},0.9);
F('#ring',{opacity:.9,scale:1},{opacity:0,scale:1.25,duration:.6,ease:'power2.out'},1.3);
F('#w',{scale:1},{scale:.93,duration:.1,yoyo:true,repeat:1,ease:'power2.inOut'},1.32);
// ---------- 1: the burger tile grows into the product card; the burger stacks itself
typeOut('.ql',1.45,.02);
[1,2,3].forEach((i,k)=>F('#tile'+i,{opacity:1,scale:1},{opacity:0,scale:.5,duration:.35,ease:'power2.in'},1.5+k*0.04));
F('#w',{x:-145,y:-90,width:250,height:250,borderRadius:44},{x:0,y:0,width:560,height:652,borderRadius:40,duration:.9,ease:IO},1.5);
F('#w',{boxShadow:'0 18px 40px rgba(0,0,0,.12)'},{boxShadow:'0 30px 70px rgba(0,0,0,.22)',duration:.9},1.5);
F('#wtile',{opacity:1,scale:1},{opacity:0,scale:1.5,duration:.35,ease:'power2.in'},1.55);
F('#wc',{opacity:0},{opacity:1,duration:.3,ease:'power2.out'},2.08);
F('#wc',{x:-155,y:-200,scale:.6},{x:0,y:0,scale:1,duration:.8,ease:IO},1.6);
['#l5','#l4','#l3','#l2','#l1','#l0'].forEach((s,i)=>{ F(s,{opacity:0},{opacity:1,duration:.08},2.4+i*0.13); F(s,{y:-330,rotation:(i%2?10:-10)},{y:0,rotation:0,duration:.55,ease:'bounce.out'},2.4+i*0.13); });
F('#hero',{backgroundPosition:'0px 0px'},{backgroundPosition:'0px 0px',duration:.1},2.4);
typeIn('.tl',2.5,.03,.36);
F(['#pr','#sub'],{opacity:0,y:12},{opacity:1,y:0,duration:.4,ease:OUT,stagger:.08},2.8);
F(['#stp','#chip','#btn'],{opacity:0,y:26},{opacity:1,y:0,duration:.5,ease:OUT,stagger:.09},3.1);
F('.ly',{scaleY:1},{scaleY:.94,duration:.14,yoyo:true,repeat:1,ease:'sine.inOut',transformOrigin:'50% 100%'},3.25);
// ---------- 2: quantity +1, fries added, price counts
const BP={v:9.5}; const upd=()=>{ document.getElementById('bp').textContent=BP.v.toFixed(2); };
F('#fg',{left:178,top:154,opacity:0,scale:1.6},{left:178,top:154,opacity:1,scale:1,duration:.22,ease:'power2.out'},4.2);
F('#plus',{scale:1},{scale:.82,duration:.09,yoyo:true,repeat:1},4.4); tl.set('#qty',{innerText:'2'},4.45);
F('#qty',{scale:1.6},{scale:1,duration:.3,ease:'back.out(2)'},4.45);
F(BP,{v:9.5},{v:19,duration:.45,ease:'power2.out',onUpdate:upd},4.45);
F('#qb',{opacity:0,scale:0},{opacity:1,scale:1,duration:.4,ease:'back.out(2.5)'},4.5);
F('.ly',{y:0},{y:-16,duration:.16,yoyo:true,repeat:1,ease:'power2.out',stagger:.02},4.45);
F('#fg',{left:178,top:154},{left:356,top:154,duration:.5,ease:IO3},4.75);
F('#chip',{scale:1},{scale:.92,duration:.09,yoyo:true,repeat:1},5.3);
F('#chip',{backgroundColor:'rgba(34,34,34,0)',color:'#222222',borderColor:'#e6dfd2'},{backgroundColor:'#222222',color:'#ffffff',borderColor:'#222222',duration:.2},5.35);
F('#fries',{opacity:0,scale:.3,y:60,rotation:-20},{opacity:1,scale:1,y:0,rotation:6,duration:.55,ease:'back.out(1.8)'},5.4);
F('.ly',{x:0},{x:-46,duration:.5,ease:IO3},5.35); F('#qb',{x:0},{x:-46,duration:.5,ease:IO3},5.35);
F(BP,{v:19},{v:22,duration:.4,ease:'power2.out',onUpdate:upd},5.4);
F('#fg',{left:356,top:154},{left:280,top:252,duration:.45,ease:IO3},5.7);
// ---------- 3: add to order -> card folds into the cart pill -> opens the live tracking card
F('#btn',{scale:1},{scale:.94,duration:.1,yoyo:true,repeat:1,ease:'power2.inOut'},6.2);
F('#fg',{opacity:1,scale:1},{opacity:0,scale:1.5,duration:.25},6.25);
F('#wc',{opacity:1,scale:1},{opacity:0,scale:.9,duration:.2,ease:'power2.in',transformOrigin:'280px 560px'},6.33);
F('#w',{width:560,height:652,borderRadius:40},{width:420,height:88,borderRadius:44,duration:.62,ease:IO3},6.3);
F('#w',{backgroundColor:'#ffffff'},{backgroundColor:'#222222',duration:.24,ease:'power1.inOut'},6.36);
F('#cart',{opacity:0,y:14},{opacity:1,y:0,duration:.3,ease:OUT},6.75);
F('#w',{scale:1},{scale:1.05,duration:.14,yoyo:true,repeat:1,ease:'sine.inOut'},6.98);
F('#cart',{opacity:1},{opacity:0,duration:.18},7.1);
F('#w',{width:420,height:88,borderRadius:44},{width:560,height:860,borderRadius:40,duration:.8,ease:IO3},7.1);
F('#w',{backgroundColor:'#222222'},{backgroundColor:'#ffffff',duration:.28,ease:'power1.inOut'},7.12);
F('#trk',{opacity:0},{opacity:1,duration:.3,ease:'power2.out'},7.3);
F('#trk',{y:-386,scale:.7,transformOrigin:'0 0',x:84},{y:0,x:0,scale:1,duration:.75,ease:IO3},7.12);
F(['#mk0','#mk1','#cour'],{scale:0},{scale:1,duration:.4,ease:'back.out(2.2)',stagger:.08},7.65);
F(['#th','#ts','#eta','#bar','.stp2'],{opacity:0,y:18},{opacity:1,y:0,duration:.4,ease:OUT,stagger:.04},7.6);
// ---------- 4: the courier rides the route, ETA counts down
const seg=[]; let LEN=0; for(let i=0;i<ROUTE.length-1;i++){ const d=Math.hypot(ROUTE[i+1][0]-ROUTE[i][0],ROUTE[i+1][1]-ROUTE[i][1]); seg.push(d); LEN+=d; }
const CO={p:0}; const cour=document.getElementById('cour'), rprog=document.getElementById('rprog');
function place(){ let d=CO.p*LEN, i=0; while(i<seg.length-1 && d>seg[i]){ d-=seg[i]; i++; } const f=Math.min(1,d/seg[i]);
  cour.style.left=(ROUTE[i][0]+(ROUTE[i+1][0]-ROUTE[i][0])*f)+'px'; cour.style.top=(ROUTE[i][1]+(ROUTE[i+1][1]-ROUTE[i][1])*f)+'px';
  rprog.setAttribute('stroke-dashoffset',String(1-CO.p)); document.getElementById('etan').textContent=String(Math.max(1,Math.ceil(12*(1-CO.p))));
  document.getElementById('barf').style.width=(8+92*CO.p)+'%'; }
F(CO,{p:0},{p:1,duration:3.2,ease:'sine.inOut',onUpdate:place},8.05);
F('#cour',{scale:1},{scale:1.1,duration:.4,yoyo:true,repeat:7,ease:'sine.inOut'},8.05);
F('#tmap > svg',{scale:1.12,transformOrigin:'90px 470px'},{scale:1,duration:3.6,ease:'sine.inOut'},7.6);
F('#s2a',{color:'#b5ad9f'},{color:'#222222',duration:.25},7.9); F('#s2b',{color:'#b5ad9f'},{color:'#222222',duration:.25},8.3); F('#s2c',{color:'#b5ad9f'},{color:'#222222',duration:.25},10.3);
tl.set('#th',{innerText:'Almost there'},10.3);
F('#hring',{opacity:.9,scale:1},{opacity:0,scale:2.6,duration:.7,ease:'power2.out'},11.2); F('#mk1',{scale:1},{scale:1.25,duration:.2,yoyo:true,repeat:1,ease:'sine.inOut'},11.2);
// ---------- 5: delivered pill -> rating card with stars, confetti, 3D drift
F('#trk',{opacity:1,scale:1},{opacity:0,scale:.92,duration:.2,ease:'power2.in',transformOrigin:'280px 430px'},11.48);
F('#w',{width:560,height:860,borderRadius:40},{width:320,height:88,borderRadius:44,duration:.62,ease:IO3},11.46);
F('#w',{backgroundColor:'#ffffff'},{backgroundColor:'#22b573',duration:.24,ease:'power1.inOut'},11.5);
F('#done',{opacity:0,scale:.6},{opacity:1,scale:1,duration:.35,ease:'back.out(2.5)'},11.95);
F('#w',{scaleX:1},{scaleX:1.08,duration:.14,yoyo:true,repeat:1,ease:'sine.inOut'},12.05);
F('#done',{opacity:1},{opacity:0,duration:.18},12.3);
F('#w',{width:320,height:88,borderRadius:44},{width:560,height:320,borderRadius:36,duration:.7,ease:IO3},12.3);
F('#w',{backgroundColor:'#22b573'},{backgroundColor:'#231a14',duration:.4,ease:'power1.inOut'},12.32);
F('#rate',{opacity:0,scale:.92,transformOrigin:'280px 160px'},{opacity:1,scale:1,duration:.4,ease:OUT},12.84);
for(let i=0;i<5;i++){ F('#star'+i,{fill:'rgba(255,255,255,.16)',scale:1},{fill:'#ffc93c',scale:1.35,duration:.16,ease:'power2.out'},13.0+i*0.12); F('#star'+i,{scale:1.35},{scale:1,duration:.3,ease:'back.out(2)'},13.16+i*0.12); }
CF.forEach((c,i)=>{ const el='#cf'+i, t0=12.55+(i%6)*0.012;
  F(el,{opacity:0},{opacity:1,duration:.05},t0); F(el,{x:0,rotation:0},{x:c[0],rotation:c[3],duration:1.5,ease:'power2.out'},t0);
  F(el,{y:-140},{y:-140-c[1],duration:.55,ease:'power2.out'},t0); F(el,{y:-140-c[1]},{y:c[2],duration:.95,ease:'power2.in'},t0+0.55);
  F(el,{opacity:1},{opacity:0,duration:.4},t0+1.05); });
F('#w',{rotationX:0},{rotationX:12,duration:.8,ease:IO3},12.6); F('#w',{rotationX:12},{rotationX:5,duration:.7,ease:'sine.inOut'},13.4);
F('#w',{rotationY:0},{rotationY:-9,duration:.7,ease:'sine.inOut'},12.6); F('#w',{rotationY:-9},{rotationY:7,duration:.8,ease:'sine.inOut'},13.3);
// ---------- 6: the card grows into the end screen
F('#rate',{opacity:1,scale:1},{opacity:0,scale:.94,duration:.3,ease:'power2.in'},14.1);
F('#w',{rotationX:5,rotationY:7},{rotationX:0,rotationY:0,duration:.7,ease:'power2.out'},14.1);
F('#w',{width:560,height:320,borderRadius:36,backgroundColor:'#231a14'},{width:820,height:1340,borderRadius:0,backgroundColor:'#140d0a',duration:.75,ease:'expo.inOut'},14.1);
typeIn('.e1',14.55,.04,.5);
F('#e1',{scale:1.06},{scale:1,duration:1.4,ease:'power2.out'},14.6);
F('#glow',{opacity:0,scale:.6},{opacity:.5,scale:1,duration:1.2,ease:'power2.out'},14.5); F('#glow',{rotation:0},{rotation:50,duration:2.3,ease:'none'},14.5);
F('#e2',{opacity:0,y:16,filter:'blur(8px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.6,ease:'power3.out'},15.3);
F('#e3',{opacity:0},{opacity:1,duration:.6},15.7);
F('#endw',{scale:1},{scale:1.05,duration:2.0,ease:'sine.inOut'},14.7);
F('#cta',{scale:1},{scale:1.06,duration:.35,yoyo:true,repeat:1,ease:'sine.inOut'},15.8);
window.__timelines['main']=tl; tl.seek(0);
'''
rep = {"__DUR__": str(DUR), "__SPARK__": SPARK, "__SKETCHES__": sketches, "__Q__": letters("Hungry?", "ql"), "__TILES__": tiles, "__CONF__": conf,
       "__BURGER__": IC["burger"], "__SESAME__": sesame, "__FRIES__": fries, "__TTL__": letters("Smash Burger", "tl"), "__TMAP__": track_map(), "__BIKE__": BIKE,
       "__STARS__": stars, "__E1__": letters("Dinner, delivered.", "e1"), "__SKT__": json.dumps(SKT), "__CF__": json.dumps(CF), "__ROUTE__": json.dumps(ROUTE)}
html = ('<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920">'
        '<script src="assets/gsap.min.js"></script><style>' + CSS + '</style></head><body>' + BODY + '<script>' + JS + '</script></body></html>')
for k, v in rep.items(): html = html.replace(k, v)
(W / "index.html").write_text(html)
print("ok", NAME, "dur", DUR)
