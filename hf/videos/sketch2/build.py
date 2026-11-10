"""sketch2 v3 - "Sketch -> Motion" #2 (Jan, 2026-11-10). v2 (iPhone UI) was rejected: not smooth, hard cuts, no phone.
Reference: an After-Effects concept ad for widgets (one hero widget that MORPHS continuously small -> wide -> large, soft blurred
colour fields drifting behind, per-letter blur-in type, 3D tilt, particle burst). Here: music widgets, own design (no brand logos),
real song titles as text, abstract gradient covers. ONE continuous shot, no cuts; every move eased; rendered at 60 fps.
Music t4 (Timeless instrumental) from 0:24 (Jan). Sketch helpers in hf/sketchlib.py."""
import json, math, random, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
H = HERE.parent.parent
sys.path.insert(0, str(H))
from house import write_sfx
from sketchlib import line, rect, circ, squig, arrow, txt, sketch_svg

NAME = "sketch2"
W = H / "work" / NAME; A = W / "assets"
if W.exists(): shutil.rmtree(W)
A.mkdir(parents=True, exist_ok=True); (W / "renders").mkdir(exist_ok=True)
for f in (H / "template").iterdir(): shutil.copy(f, W / f.name)
for f in (H / "assets").iterdir(): shutil.copy(f, A / f.name)
for f in (HERE / "media").iterdir(): shutil.copy(f, A / f.name)

DUR = 15.6
SKT = [0.0, 3.3, 5.4, 8.4, 12.7]          # when each sketch page starts drawing
TR = "t4"
tj = json.load(open(H.parent / "video/public/music/tracks.json"))[TR]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(tj["hook_start"]), "-i", str(H.parent / "video/public/music" / tj["file"]), "-t", str(DUR + 1),
                "-af", f"afade=t=in:d=0.15,afade=t=out:st={DUR - 0.8}:d=0.8", str(A / "music.mp3")], check=True)
ev = [(0.6, "whoosh"), (2.95, "whoosh"), (3.86, "pop"), (5.5, "whoosh"), (7.2, "whoosh"), (8.45, "whoosh"), (9.35, "pop"), (10.5, "whoosh"), (12.85, "whoosh"), (14.3, "pop")]
write_sfx(ev, DUR, A / "sfx.wav")

SONGS = [("Blinding Lights", "The Weeknd"), ("Espresso", "Sabrina Carpenter"), ("Nightcall", "Kavinsky"),
         ("Midnight City", "M83"), ("Starboy", "The Weeknd"), ("Instant Crush", "Daft Punk")]
COV = ["radial-gradient(circle at 30% 25%,#ffd36a 0,#ff3d6e 42%,#5a1240 100%)", "linear-gradient(140deg,#e9f8ff,#7ab8ff 45%,#24306b)",
       "radial-gradient(circle at 70% 70%,#ff4bd0 0,#6a1cff 50%,#0b0730 100%)", "linear-gradient(160deg,#ff9a3d,#ff3d3d 40%,#2a0a3a)",
       "linear-gradient(150deg,#fff3b0,#ffc23d 35%,#e8402a 70%,#3a0a10)", "radial-gradient(circle at 40% 60%,#8affd2 0,#1f8a7a 45%,#0a1f2a 100%)"]

# ---------------------------------------------------------------- sketches (330 x 590)
SK = []
_s = [txt(165, 290, "Introducing", 40, "middle")]
for (x, y, w, h) in [(30, 40, 70, 70), (130, 60, 90, 50), (240, 30, 60, 90), (30, 420, 90, 60), (150, 450, 60, 60), (240, 400, 70, 90), (40, 150, 50, 50), (250, 170, 60, 50)]:
    _s += rect(x, y, w, h)
SK.append(_s)
SK.append(rect(95, 180, 140, 140) + rect(110, 195, 55, 55) + squig(110, 275, 90) + [line(110, 300, 210, 300)] + circ(165, 250, 120, 1.05) +
          [txt(165, 120, "pop!", 34, "middle")] + [line(80, 150, 60, 130), line(250, 150, 270, 128), line(165, 110, 165, 92)])
SK.append(rect(25, 210, 280, 140) + rect(40, 225, 60, 60) + squig(40, 315, 70) + [line(130 + i * 12, 300, 130 + i * 12, 300 - (8 + (i * 29) % 40)) for i in range(14)] +
          arrow(165, 400, 300, 400) + arrow(165, 400, 30, 400) + [txt(165, 450, "grow wide", 30, "middle")])
SK.append(rect(25, 80, 280, 400) + rect(45, 100, 80, 80) + squig(140, 125, 120) + rect(140, 150, 60, 24) + [txt(45, 225, "recently played", 22)] +
          sum([rect(45, 245 + i * 70, 44, 44) + squig(100, 262 + i * 70, 140) + circ(275, 267 + i * 70, 12) for i in range(3)], []))
SK.append([txt(165, 260, "Endless", 52, "middle"), txt(165, 320, "music", 52, "middle")] + circ(165, 430, 40) + [line(160, 405, 160, 450), line(160, 405, 185, 398), line(185, 398, 185, 440)])
sketches = "".join(sketch_svg(k, it) for k, it in enumerate(SK))

def letters(s, cls, cols=None):
    out = []
    for i, c in enumerate(s):
        st = f' style="color:{cols[i]}"' if cols else ''
        out.append(f'<span class="{cls}"{st}>{c if c != " " else "&nbsp;"}</span>')
    return "".join(out)

def grad(n, a=(61, 123, 255), b=(255, 90, 200)):
    return ['#%02x%02x%02x' % tuple(int(a[k] + (b[k] - a[k]) * i / max(1, n - 1)) for k in range(3)) for i in range(n)]

SPARK = '<svg viewBox="0 0 100 100"><path fill="#e8734a" d="M50 4l6 30 22-21-12 28 30-4-27 14 27 14-30-4 12 28-22-21-6 30-6-30-22 21 12-28-30 4 27-14-27-14 30 4-12-28 22 21z"/></svg>'
NOTE = '<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.8" fill="currentColor"/><circle cx="17.5" cy="16" r="2.8" fill="currentColor"/></svg>'
R = random.Random(11)
# field of small widgets for the intro pan (x, y, w, h, kind)
FIELD = [(40, 60, 150, 150, "cov0"), (230, 20, 180, 110, "pill"), (450, 80, 150, 150, "cov2"), (60, 250, 110, 110, "note"), (480, 280, 140, 140, "cov1"),
         (30, 640, 170, 170, "cov3"), (250, 690, 160, 100, "eq"), (450, 640, 160, 160, "cov4"), (70, 860, 150, 100, "pill2"), (300, 860, 140, 140, "cov5"),
         (470, 860, 150, 120, "eq2"), (40, 1060, 160, 160, "cov1"), (250, 1080, 170, 110, "pill"), (460, 1060, 150, 150, "cov2")]
def fw(i, x, y, w, h, k):
    inner = ""
    if k.startswith("cov"):
        inner = f'<div class="fc" style="background:{COV[int(k[3])]}"></div>'
    elif k.startswith("pill"):
        inner = f'<div class="fp"><div class="fpc" style="background:{COV[i % 6]}"></div><div><b>{SONGS[i % 6][0]}</b><span>{SONGS[i % 6][1]}</span></div></div>'
    elif k.startswith("eq"):
        inner = '<div class="feq">' + "".join(f'<i style="height:{20 + (j * 37) % 55}%"></i>' for j in range(12)) + '</div>'
    else:
        inner = f'<div class="fn">{NOTE}</div>'
    return f'<div class="fw" id="fw{i}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">{inner}</div>'
field = "".join(fw(i, *f) for i, f in enumerate(FIELD))
parts = "".join(f'<i class="pt" id="pt{i}"></i>' for i in range(28))
PT = [(math.cos(a) * r, math.sin(a) * r) for a, r in ((R.uniform(0, 6.28), R.uniform(60, 190)) for _ in range(28))]
wav = "".join('<i class="wb"></i>' for _ in range(30))
rows = "".join(f'<div class="rw" id="rw{i}"><div class="rc" style="background:{COV[i + 3]}"></div><div class="rt"><b>{letters(SONGS[i + 3][0], "rl" + str(i))}</b><span>{SONGS[i + 3][1]}</span></div><div class="rp">▶</div></div>' for i in range(3))
titles = "".join(f'<div class="tt" id="tt{i}"><b>{letters(SONGS[i][0], "tl" + str(i))}</b><span>{SONGS[i][1]}</span></div>' for i in range(3))

HTML = f'''<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920"><script src="assets/gsap.min.js"></script><style>
@font-face{{font-family:'Caveat';src:url(assets/caveat.woff2) format('woff2');font-weight:600}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden;background:#000}}
#root{{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:'Inter',sans-serif;color:#fff;background:radial-gradient(70% 45% at 55% 42%,#2a2724 0%,#0b0b0b 72%,#000 100%)}}
#grain{{position:absolute;left:-256px;top:-256px;width:1592px;height:2432px;opacity:.04;mix-blend-mode:screen;background:url(assets/noise.png) repeat;z-index:60}}
#hdr{{position:absolute;left:380px;width:660px;top:296px;display:flex;justify-content:center;align-items:center;gap:14px;font-size:48px;font-weight:700;letter-spacing:-.02em}}
#hdr svg{{width:54px;height:54px}}
#dl{{position:absolute;left:40px;top:590px;font-size:46px;font-weight:700;letter-spacing:-.02em}}
#paper{{position:absolute;left:40px;top:660px;width:310px;height:555px;background:#fbfbf8;box-shadow:0 20px 50px rgba(0,0,0,.6)}}
.skt{{position:absolute;inset:0;width:310px;height:555px;opacity:0}}
.sp{{fill:none;stroke:#1d1d1d;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1 1}}
.hw{{font-family:'Caveat',cursive;font-weight:600;fill:#1d1d1d}}
#st{{position:absolute;left:380px;top:380px;width:660px;height:1100px;overflow:hidden;background:#f4f4f6;box-shadow:0 30px 80px rgba(0,0,0,.7)}}
.bl{{position:absolute;border-radius:50%;filter:blur(60px);opacity:.95}}
#bl0{{left:-160px;top:800px;width:980px;height:420px;background:#4a90ff}}
#bl1{{left:-260px;top:100px;width:680px;height:480px;background:#ff4a4a;opacity:0}}
#bl2{{left:280px;top:560px;width:680px;height:520px;background:#ffa83d;opacity:0}}
#bl3{{left:120px;top:-120px;width:760px;height:340px;background:#a8f03d;opacity:0}}
#dark{{position:absolute;inset:0;background:#08080a;opacity:0}}
#intro{{position:absolute;left:0;right:0;top:500px;display:flex;justify-content:center;font-size:66px;font-weight:700;letter-spacing:-.025em;color:#111;white-space:nowrap}}
.il,.el,.tl0,.tl1,.tl2,.rl0,.rl1,.rl2{{display:inline-block}}
#fieldw{{position:absolute;inset:0}}
.fw{{position:absolute;border-radius:30px;background:#1c1c1e;box-shadow:0 18px 40px rgba(0,0,0,.18);overflow:hidden}}
.fc{{position:absolute;inset:12px;border-radius:20px}}
.fp{{position:absolute;inset:0;display:flex;align-items:center;gap:14px;padding:0 16px}} .fpc{{width:60px;height:60px;border-radius:14px;flex:none}}
.fp b{{display:block;font-size:19px;white-space:nowrap}} .fp span{{display:block;font-size:15px;color:rgba(255,255,255,.55);white-space:nowrap}}
.feq{{position:absolute;inset:18px;display:flex;align-items:flex-end;gap:5px}} .feq i{{flex:1;border-radius:3px;background:linear-gradient(0deg,#ff2d55,#ff9f0a)}}
.fn{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#ff2d55}} .fn svg{{width:56%;height:56%}}
#brand{{position:absolute;left:50%;top:505px;transform:translateX(-50%);display:flex;justify-content:center;align-items:center;gap:16px;font-size:58px;font-weight:700;letter-spacing:-.025em;color:#111;opacity:0;z-index:5;background:rgba(255,255,255,.78);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);padding:18px 34px;border-radius:30px;box-shadow:0 20px 50px rgba(0,0,0,.15);white-space:nowrap}}
#bnote{{width:64px;height:64px;color:#ff2d55;display:flex}} #bnote svg{{width:100%;height:100%}}
#bword{{display:flex;white-space:nowrap}} .bl8{{display:inline-block}}
#pill{{position:absolute;left:330px;top:550px;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:32px;background:#1c1c1e;opacity:0}}
.pt{{position:absolute;left:330px;top:550px;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#ff2d55;opacity:0}}
/* hero widget */
#cam{{position:absolute;inset:0;transform-origin:50% 50%}}
#wz{{position:absolute;left:330px;top:550px;width:0;height:0}}
#shim{{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;opacity:0;border-radius:inherit}} #shim i{{position:absolute;top:30px;left:0;width:160px;height:18px;border-radius:9px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)}}
#w{{position:absolute;left:0;top:0;width:300px;height:300px;border-radius:64px;background:#1c1c1e;box-shadow:0 30px 70px rgba(0,0,0,.28);overflow:hidden;opacity:0}}
#wi{{position:absolute;left:0;top:0;width:620px;height:640px}}
#cvw{{position:absolute;left:32px;top:32px;width:130px;height:130px;perspective:600px}}
#cv{{width:100%;height:100%;border-radius:22px;background:{COV[0]};box-shadow:0 10px 24px rgba(0,0,0,.4)}}
#wnote{{position:absolute;left:236px;top:30px;width:36px;height:36px;color:#ff2d55}} #wnote svg{{width:100%;height:100%}}
.tt{{position:absolute;left:32px;top:186px;width:260px}} .tt b{{display:flex;font-size:30px;font-weight:700;letter-spacing:-.01em;white-space:nowrap}}
.tt span{{display:block;font-size:22px;color:rgba(255,255,255,.55);margin-top:2px;white-space:nowrap}}
#pg{{position:absolute;left:32px;top:262px;width:236px;height:7px;border-radius:4px;background:rgba(255,255,255,.18)}} #pg i{{position:absolute;left:0;top:0;bottom:0;width:30%;border-radius:4px;background:#fff}}
#wv{{position:absolute;left:300px;top:60px;width:240px;height:120px;display:flex;align-items:center;gap:4px;opacity:0}}
.wb{{flex:1;height:12px;border-radius:3px;background:linear-gradient(0deg,#ff2d55,#ff9f0a)}}
#tm{{position:absolute;left:300px;top:200px;width:240px;display:flex;justify-content:space-between;font-size:20px;color:rgba(255,255,255,.5);font-family:'JetBrains Mono',monospace;opacity:0}}
#play{{position:absolute;left:190px;top:120px;height:44px;padding:0 22px;border-radius:22px;background:rgba(255,255,255,.14);display:flex;align-items:center;gap:8px;font-size:20px;font-weight:700;opacity:0}}
#rp{{position:absolute;left:32px;top:226px;font-size:18px;font-weight:800;letter-spacing:.08em;color:#ff2d55;opacity:0}}
.rw{{position:absolute;left:32px;width:496px;height:84px;display:flex;align-items:center;gap:18px;opacity:0}}
.rc{{width:66px;height:66px;border-radius:12px;flex:none}} .rt b{{display:flex;font-size:24px;font-weight:700;white-space:nowrap}} .rt span{{display:block;font-size:19px;color:rgba(255,255,255,.5)}}
.rp{{margin-left:auto;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:16px}}
#endw{{position:absolute;inset:0;transform-origin:50% 48%}}
#glow{{position:absolute;left:80px;top:300px;width:500px;height:500px;border-radius:50%;background:conic-gradient(from 0deg,#3d7bff,#ff5ac8,#7ab8ff,#3d7bff);filter:blur(90px);opacity:0}}
#endt{{position:absolute;left:0;right:0;top:500px;text-align:center;font-size:72px;font-weight:800;letter-spacing:-.03em;white-space:nowrap;display:flex;justify-content:center}}
#enote{{position:absolute;left:280px;top:640px;width:100px;height:100px;color:#fff;opacity:0}} #enote svg{{width:100%;height:100%}}
#cta{{position:absolute;left:0;right:0;top:1545px;text-align:center;font-size:52px;font-weight:800;letter-spacing:-.02em}}
#cta b{{color:#ff2d55}}
#handle{{position:absolute;left:50%;top:1650px;transform:translateX(-50%);font-size:30px;font-weight:600;color:rgba(255,255,255,.55)}}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920" data-motion-blur="off">
<div id="hdr">{SPARK}<span>Claude Code</span></div>
<div id="dl">Drawing</div>
<div id="paper">{sketches}</div>
<div id="st">
 <div class="bl" id="bl0"></div><div class="bl" id="bl1"></div><div class="bl" id="bl2"></div><div class="bl" id="bl3"></div>
 <div id="cam"><div id="fieldw">{field}</div>
 <div id="intro">{letters("Introducing", "il")}</div>
 <div id="brand"><div id="bnote">{NOTE}</div><div id="bword">{letters("Music Widgets", "bl8")}</div></div>
 <div id="pill"></div>{parts}
 <div id="wz"><div id="w"><div id="shim"><i></i></div><div id="wi"><div id="cvw"><div id="cv"></div></div><div id="wnote">{NOTE}</div>{titles}<div id="pg"><i></i></div>
  <div id="wv">{wav}</div><div id="tm"><span id="tcur">0:42</span><span>3:20</span></div><div id="play">▶ Play</div>
  <div id="rp">RECENTLY PLAYED</div>{rows}</div></div></div>
 <div id="endw"><div id="glow"></div><div id="endt">{letters("Endless music", "el", grad(13, (255, 255, 255), (255, 170, 225)))}</div><div id="enote">{NOTE}</div></div>
</div></div>
<div id="cta">Comment “<b>SKETCH</b>” for the prompts</div>
<div id="handle">@theaitoolfinds</div>
<div id="grain"></div>
<audio id="mus" class="clip" src="assets/music.mp3" data-start="0" data-duration="{DUR}" data-track-index="21" data-volume="0.34"></audio>
<audio id="fx" class="clip" src="assets/sfx.wav" data-start="0" data-duration="{DUR}" data-track-index="22" data-volume="0.6"></audio>
</div>
<script>
window.__timelines=window.__timelines||{{}};
const DUR={DUR}, SKT={json.dumps(SKT)}, COV={json.dumps(COV)}, PT={json.dumps(PT)}, FIELD={json.dumps(FIELD)};
const tl=gsap.timeline({{paused:true}}); const NI={{immediateRender:false}};
function F(s,a,b,t){{ return tl.fromTo(s,a,Object.assign({{}},b,NI),t); }}
const IO='power4.inOut', IO3='power3.inOut', OUT='expo.out', IN='power3.in';
function typeIn(sel,t,st,d){{ F(sel,{{opacity:0,y:14,filter:'blur(10px)'}},{{opacity:1,y:0,filter:'blur(0px)',duration:d||.42,ease:'power3.out',stagger:st||.04}},t); }}
function typeOut(sel,t,st){{ F(sel,{{opacity:1,y:0,filter:'blur(0px)'}},{{opacity:0,y:-10,filter:'blur(10px)',duration:.24,ease:'power2.in',stagger:{{each:st||.02,from:'end'}}}},t); }}
// initial states (everything that animates in starts hidden; no CSS default may leak)
tl.set('.il,.bl8,.el,.tl0,.tl1,.tl2,.rl0,.rl1,.rl2',{{opacity:0}},0);
tl.set(['#tt0 > span','#tt1 > span','#tt2 > span','#cv','#wnote','#pg','#wv','#tm','#play','#rp','.rw','#brand','#w','#pill','#enote','.fw'],{{opacity:0}},0);
tl.set('#w',{{xPercent:-50,yPercent:-50}},0); tl.set('#tt2',{{left:206,top:50}},0); tl.set('#play',{{left:206,top:136}},0); tl.set('#rp',{{top:226}},0);
for(let i=0;i<3;i++) tl.set('#rw'+i,{{top:262+i*92}},0);
// ---------- sketches on the left
tl.set('.skt',{{opacity:0}},0); tl.set('.sp',{{strokeDashoffset:1}},0); tl.set('.hw',{{opacity:0}},0);
SKT.forEach((t,k)=>{{
  F('#sk'+k,{{opacity:0}},{{opacity:1,duration:.25}},t); if(k) F('#sk'+(k-1),{{opacity:1}},{{opacity:0,duration:.25}},t);
  const ps=document.querySelectorAll('#sk'+k+' .sp'); const L=ps.length;
  ps.forEach((p,i)=>F(p,{{strokeDashoffset:1}},{{strokeDashoffset:0,duration:.28,ease:'power1.inOut'}},t+0.05+i*(0.75/L)));
  F('#sk'+k+' .hw',{{opacity:0}},{{opacity:1,duration:.3,stagger:.1}},t+0.3); }});
F('#paper',{{rotation:-1}},{{rotation:1,duration:3.2,yoyo:true,repeat:5,ease:'sine.inOut'}},0);
// ---------- saturated colour fields, always drifting
F('#bl0',{{x:-40,y:0}},{{x:60,y:-40,duration:DUR,ease:'sine.inOut'}},0);
F('#bl1',{{x:0,y:0}},{{x:140,y:80,duration:DUR,ease:'sine.inOut'}},0);
F('#bl2',{{x:0,y:0}},{{x:-160,y:-90,duration:DUR,ease:'sine.inOut'}},0);
F('#bl3',{{x:0}},{{x:-140,duration:DUR,ease:'sine.inOut'}},0);
F('#bl0',{{opacity:.95}},{{opacity:.45,duration:1.4,ease:IO3}},3.2);
F(['#bl1','#bl2'],{{opacity:0}},{{opacity:.9,duration:1.4,ease:IO3}},3.4);
F('#bl1',{{backgroundColor:'#ff4a4a'}},{{backgroundColor:'#3d8bff',duration:1.0,ease:IO3}},7.1);
F('#bl2',{{backgroundColor:'#ffa83d'}},{{backgroundColor:'#5ad0ff',duration:1.0,ease:IO3}},7.1);
F('#bl3',{{opacity:0}},{{opacity:.9,duration:1.0,ease:IO3}},7.1);
F('#bl1',{{backgroundColor:'#3d8bff'}},{{backgroundColor:'#ff1f5a',duration:1.0,ease:IO3}},8.6);
F('#bl2',{{backgroundColor:'#5ad0ff'}},{{backgroundColor:'#ff7aa8',duration:1.0,ease:IO3}},8.6);
F('#bl3',{{backgroundColor:'#a8f03d'}},{{backgroundColor:'#ff1f5a',duration:1.0,ease:IO3}},8.6);
F('#bl0',{{backgroundColor:'#4a90ff',opacity:.45}},{{backgroundColor:'#ff4a80',opacity:.9,duration:1.0,ease:IO3}},8.6);
// slow camera push on the whole panel content, never fully still
F('#cam',{{scale:1}},{{scale:1.06,duration:DUR,ease:'sine.inOut'}},0);
// ---------- 0: "Introducing", then a parallax pan through a field of widgets
typeIn('.il',0.12,.045);
F('#fieldw',{{y:700}},{{y:-520,duration:2.6,ease:'power2.inOut'}},0.6);
document.querySelectorAll('.fw').forEach((el,i)=>{{
  F(el,{{opacity:0,scale:.85}},{{opacity:1,scale:1,duration:.5,ease:'power3.out'}},0.6+i*0.03);
  const k=0.9+((i*7)%5)*0.05;
  F(el,{{y:0,rotation:(i%3-1)*3}},{{y:(1-k)*900-(i%3)*60,rotation:(i%3-1)*-3,duration:2.6,ease:'power2.inOut'}},0.6);
  // converge into the centre pill
  const f=FIELD[i], cx=f[0]+f[2]/2, cy=f[1]+f[3]/2-520+(1-k)*900-(i%3)*60;
  F(el,{{left:f[0],top:f[1],scale:1,opacity:1}},{{left:f[0]+(330-cx),top:f[1]+(550-cy),scale:.08,opacity:0,duration:.55,ease:IN}},2.95+(i%5)*0.02);
}});
typeOut('.il',1.3,.02);
F('#brand',{{opacity:0,scale:.9,y:10}},{{opacity:1,scale:1,y:0,duration:.6,ease:OUT}},1.45);
typeIn('.bl8',1.5,.025,.4);
typeOut('.bl8',2.85,.018); F('#bnote',{{scale:1}},{{scale:.5,duration:.4,ease:IO3}},3.0);
F('#brand',{{opacity:1}},{{opacity:0,duration:.3,ease:'power2.in'}},3.15);
F('#pill',{{opacity:0,width:40,marginLeft:-20,scale:.6}},{{opacity:1,width:150,marginLeft:-75,scale:1,duration:.4,ease:OUT}},3.3);
F('#pill',{{width:150,marginLeft:-75,scale:1,opacity:1}},{{width:60,marginLeft:-30,scale:.3,opacity:0,duration:.32,ease:IN}},3.62);
PT.forEach((p,i)=>{{ F('#pt'+i,{{x:0,y:0,opacity:1,scale:1}},{{x:p[0]*1.3,y:p[1]*1.3,opacity:0,scale:.3,duration:.9,ease:'expo.out'}},3.86+(i%5)*0.01); }});
// ---------- 1: small widget grows out of the burst (body at full opacity), plays Blinding Lights
F('#wz',{{scale:1.4}},{{scale:1.47,duration:1.7,ease:'sine.inOut'}},3.85);
F('#w',{{opacity:0}},{{opacity:1,duration:.12}},3.86);
F('#w',{{scale:.15,width:300,height:300,borderRadius:64}},{{scale:1,duration:.75,ease:'back.out(1.5)'}},3.86);
F('#cv',{{opacity:0,scale:.7}},{{opacity:1,scale:1,duration:.5,ease:OUT}},4.15);
F('#wnote',{{opacity:0,scale:.4}},{{opacity:1,scale:1,duration:.45,ease:'back.out(2)'}},4.3);
typeIn('.tl0',4.3,.03); F('#tt0 > span',{{opacity:0,y:8}},{{opacity:1,y:0,duration:.4,ease:OUT}},4.6);
F('#pg',{{opacity:0,scaleX:.4,transformOrigin:'0% 50%'}},{{opacity:1,scaleX:1,duration:.5,ease:OUT}},4.7);
F('#pg i',{{width:'8%'}},{{width:'46%',duration:2.6,ease:'none'}},4.7);
// ---------- 2: grows WIDE while the zoom eases back; content revealed after 80% width
F('#w',{{width:300}},{{width:580,duration:.8,ease:IO3}},5.5);
F('#wz',{{scale:1.47}},{{scale:1.0,duration:.8,ease:IO3}},5.5);
F('#wnote',{{left:236}},{{left:516,duration:.8,ease:IO3}},5.5);
F(['#wv','#tm'],{{opacity:0,x:20}},{{opacity:1,x:0,duration:.45,ease:'power3.out',stagger:.05}},6.12);
const WB=document.querySelectorAll('#wv .wb'); const WV={{x:0}};
F(WV,{{x:0}},{{x:1,duration:DUR,ease:'none',onUpdate:()=>{{ const q=WV.x*DUR; const on=Math.min(1,Math.max(0,(q-6.1)/0.5))*(1-Math.min(1,Math.max(0,(q-8.35)/0.35)));
  WB.forEach((b,i)=>{{ b.style.height=(12+on*92*Math.abs(Math.sin(i*0.55+q*5.2))*(0.35+0.65*Math.abs(Math.sin(i*0.21+q*1.9))))+'px'; }}); }}}},0);
const TC={{s:0}}; F(TC,{{s:0}},{{s:1,duration:3.4,ease:'none',onUpdate:()=>{{ const q=TC.s*3.4; const v=q<1.4?42+q*2:Math.max(0,q-1.5); const n=Math.floor(v); document.getElementById('tcur').textContent=Math.floor(n/60)+':'+String(n%60).padStart(2,'0'); }}}},5.85);
// next song: real perspective flip, title swap (one tween each), progress rewinds
F('#cv',{{rotationY:0,scale:1,transformPerspective:800}},{{rotationY:90,scale:.95,duration:.24,ease:'power2.in'}},7.2);
tl.set('#cv',{{background:COV[1]}},7.44);
F('#cv',{{rotationY:-90,scale:.95,transformPerspective:800}},{{rotationY:0,scale:1,duration:.32,ease:'power2.out'}},7.44);
typeOut('.tl0',7.2,.012); F('#tt0 > span',{{opacity:1}},{{opacity:0,duration:.2}},7.2);
typeIn('.tl1',7.5,.035); F('#tt1 > span',{{opacity:0,y:8}},{{opacity:1,y:0,duration:.35,ease:OUT}},7.7);
F('#pg i',{{width:'46%'}},{{width:'2%',duration:.3,ease:'power2.out'}},7.3);
F('#pg i',{{width:'2%'}},{{width:'14%',duration:1.0,ease:'none'}},7.6);
// ---------- 3: content shrinks with the body into a loading pill (shimmer), then it opens LARGE
F(['#wv','#tm','#pg','#wnote','#tt1'],{{opacity:1,scale:1}},{{opacity:0,scale:.85,duration:.3,ease:'power2.in'}},8.4);
F('#cv',{{opacity:1,scale:1}},{{opacity:0,scale:.6,duration:.3,ease:'power2.in'}},8.42);
F('#w',{{width:580,height:300,borderRadius:64}},{{width:430,height:78,borderRadius:39,duration:.7,ease:IO}},8.45);
F('#shim',{{opacity:0}},{{opacity:1,duration:.15}},8.9); F('#shim i',{{x:-200}},{{x:440,duration:.4,ease:'power1.inOut'}},8.9);
F('#shim',{{opacity:1}},{{opacity:0,duration:.1}},9.18);
F('#w',{{width:430,height:78,borderRadius:39}},{{width:560,height:590,borderRadius:58,duration:.75,ease:'power3.inOut'}},9.28);
tl.set('#cv',{{background:COV[2],scale:.6}},9.2);
F('#cv',{{opacity:0,scale:.6}},{{opacity:1,scale:1.12,duration:.55,ease:OUT}},9.6);
F('#cvw',{{x:0,y:0}},{{x:8,y:8,duration:.55,ease:OUT}},9.6);
typeIn('.tl2',9.66,.03); F('#tt2 > span',{{opacity:0,y:8}},{{opacity:1,y:0,duration:.35,ease:OUT}},9.86);
F('#play',{{opacity:0,scale:.7}},{{opacity:1,scale:1,duration:.4,ease:'back.out(2)'}},9.8);
F('#wnote',{{left:496,opacity:0,scale:.6}},{{left:496,opacity:1,scale:1,duration:.35,ease:OUT}},9.8);
F('#rp',{{opacity:0,x:-20}},{{opacity:1,x:0,duration:.4,ease:OUT}},9.85);
for(let i=0;i<3;i++){{ F('#rw'+i,{{opacity:0,y:30}},{{opacity:1,y:0,duration:.45,ease:OUT}},9.9+i*0.1); typeIn('.rl'+i,9.95+i*0.1,.02,.35); }}
// ---------- 4: real 3D tilt that keeps drifting (no stop), shadow follows
tl.set('#w',{{transformPerspective:1000}},0);
F('#w',{{boxShadow:'0 30px 70px rgba(0,0,0,.28)'}},{{boxShadow:'30px 50px 90px rgba(0,0,0,.35)',duration:1.3,ease:IO3}},10.5);
F('#w',{{rotationX:0}},{{rotationX:13,duration:1.1,ease:IO3}},10.5);
F('#w',{{rotationX:13}},{{rotationX:7,duration:1.25,ease:'sine.inOut'}},11.6);
F('#w',{{rotationY:0}},{{rotationY:-14,duration:.9,ease:'sine.inOut'}},10.5);
F('#w',{{rotationY:-14}},{{rotationY:10,duration:1.45,ease:'sine.inOut'}},11.4);
// ---------- 5: the widget body grows to become the dark end screen (spatial morph, no fade-to-black)
F(['#wi'],{{opacity:1,scale:1}},{{opacity:0,scale:.92,duration:.35,ease:'power2.in'}},12.75);
F('#w',{{rotationX:7,rotationY:10}},{{rotationX:0,rotationY:0,duration:.85,ease:'power2.out'}},12.85);
F('#w',{{width:560,height:590,borderRadius:58}},{{width:760,height:1240,borderRadius:0,duration:.85,ease:IO}},12.85);
F('#w',{{backgroundColor:'#1c1c1e'}},{{backgroundColor:'#08080a',duration:.85,ease:IO}},12.85);
typeIn('.el',13.3,.045,.5);
F('#endt',{{scale:1.06}},{{scale:1,duration:1.4,ease:'power2.out'}},13.5);
F('#glow',{{opacity:0,scale:.6}},{{opacity:.6,scale:1,duration:1.2,ease:'power2.out'}},13.35);
F('#glow',{{rotation:0}},{{rotation:40,duration:2,ease:'none'}},13.6);
F('#enote',{{opacity:0,scale:.6,rotation:-20}},{{opacity:1,scale:1,rotation:0,duration:.6,ease:'back.out(1.6)'}},14.3);
F('#endw',{{scale:1}},{{scale:1.05,duration:1.7,ease:'sine.inOut'}},13.9);
F('#cta',{{scale:1}},{{scale:1.06,duration:.35,yoyo:true,repeat:1,ease:'sine.inOut'}},14.6);
window.__timelines['main']=tl; tl.seek(0);
</script></body></html>'''
(W / "index.html").write_text(HTML)
print("ok", NAME, "dur", DUR)
