"""sketch1 - new format "Sketch -> Motion" #1 (Jan, 2026-11-10; reference: a 'Drawing' sketch on the left, the finished motion
design of the same layout on the right). Topic: Higgsfield (logo used, Jan's call), positive framing: one prompt -> 3 ad styles ->
clips render -> finished ad -> the whole pipeline. Images are Jan's real Higgsfield outputs (adstyles15). Music + sfx, no voice.
The hand-drawn sketches are generated here (jittered SVG strokes + Caveat handwriting, OFL) and draw themselves on each shot."""
import json, math, random, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
H = HERE.parent.parent
sys.path.insert(0, str(H))
from house import write_sfx

NAME = "sketch1"
W = H / "work" / NAME; A = W / "assets"
A.mkdir(parents=True, exist_ok=True); (W / "renders").mkdir(exist_ok=True)
for f in (H / "template").iterdir(): shutil.copy(f, W / f.name)
for f in (H / "assets").iterdir(): shutil.copy(f, A / f.name)
for f in (HERE / "media").iterdir(): shutil.copy(f, A / f.name)

SH = 2.9                      # one shot
N = 5
DUR = round(N * SH + 0.7, 2)

TR = "t1"
start = json.load(open(H.parent / "video/public/music/tracks.json"))[TR]["hook_start"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-i", str(H.parent / f"video/public/music/{TR}.mp3"), "-t", str(DUR + 1),
                "-af", f"afade=t=in:d=0.2,afade=t=out:st={DUR - 0.7}:d=0.7", str(A / "music.mp3")], check=True)
ev = []
for k in range(N):
    t = k * SH
    ev += [(t, "whoosh"), (t + 0.25, "pop")]
ev += [(0.5 + i * 0.07, "tick") for i in range(0, 14, 2)] + [(1.95, "click")]          # typing + send
ev += [(SH + 0.2 + i * 0.25, "pop") for i in range(3)] + [(SH + 1.6, "click")]           # 3 styles, pick #2
ev += [(2 * SH + 0.9 + i * 0.3, "tick") for i in range(5)]                                # clips done
ev += [(3 * SH + 0.6 + i * 0.35, "pop") for i in range(4)]                               # likes
ev += [(4 * SH + 0.5 + i * 0.18, "click") for i in range(5)]                             # graph chips
write_sfx(ev, DUR, A / "sfx.wav")

# ------------------------------------------------------------------ hand-drawn sketch helpers (viewBox 330 x 590)
R = random.Random(7)
def _j(a=1.6): return R.uniform(-a, a)
def line(x1, y1, x2, y2, a=1.4):
    n = max(3, int(math.hypot(x2 - x1, y2 - y1) / 28))
    ox, oy = _j(3), _j(3)
    pts = [(x1 - ox * 0.6 + _j(), y1 - oy * 0.6 + _j())]
    for i in range(1, n + 1):
        t = i / n; pts.append((x1 + (x2 - x1) * t + _j(a), y1 + (y2 - y1) * t + _j(a)))
    pts[-1] = (pts[-1][0] + ox * 0.5, pts[-1][1] + oy * 0.5)
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
def rect(x, y, w, h): return [line(x, y, x + w, y), line(x + w, y, x + w, y + h), line(x + w, y + h, x, y + h), line(x, y + h, x, y)]
def circ(cx, cy, r, turns=1.08):
    n = 26; pts = []
    a0 = R.uniform(0, 6.28)
    for i in range(int(n * turns) + 1):
        a = a0 + i / n * 6.283; rr = r * (1 + _j(0.04))
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr * 0.98))
    return ["M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)]
def squig(x, y, w):
    pts = [(x + i * w / 14, y + math.sin(i * 1.7) * 2.2 + _j(0.8)) for i in range(15)]
    return ["M" + " L".join(f"{a:.1f} {b:.1f}" for a, b in pts)]
def arrow(x1, y1, x2, y2):
    a = math.atan2(y2 - y1, x2 - x1)
    return [line(x1, y1, x2, y2), line(x2, y2, x2 - 12 * math.cos(a - 0.5), y2 - 12 * math.sin(a - 0.5)),
            line(x2, y2, x2 - 12 * math.cos(a + 0.5), y2 - 12 * math.sin(a + 0.5))]
def txt(x, y, s, size=24, anchor="start"): return ("T", x, y, s, size, anchor)
def heart(cx, cy, s):
    p = [(cx, cy + s)]
    for i in range(21):
        t = i / 20 * 6.283
        p.append((cx + s * 0.06 * 16 * math.sin(t) ** 3, cy - s * 0.06 * (13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))))
    return ["M" + " L".join(f"{a + _j(0.6):.1f} {b + _j(0.6):.1f}" for a, b in p[1:])]

SK = []
# 1 prompt: logo card + ring, chat input with the prompt, cursor, "generating" pill
SK.append(rect(120, 120, 90, 90) + circ(165, 165, 78) + [line(140, 150, 160, 180), line(160, 180, 172, 150), line(172, 150, 190, 182)] +
          rect(25, 330, 280, 70) + [txt(36, 373, "a 10s ad for my energy drink", 21)] + rect(258, 345, 36, 40) +
          arrow(300, 470, 278, 400) + rect(60, 450, 170, 40) + squig(78, 470, 130))
# 2 three styles, #2 picked
SK.append(rect(60, 60, 200, 140) + [txt(150, 145, "1", 44, "middle")] + rect(70, 210, 200, 140) + [txt(170, 295, "2", 44, "middle")] +
          circ(170, 280, 120, 1.05) + rect(60, 360, 200, 140) + [txt(160, 445, "3", 44, "middle")] + [txt(165, 560, "pick one", 28, "middle")])
# 3 five clips rendering
_s3 = []
for i in range(5):
    y = 60 + i * 98
    _s3 += rect(30, y, 70, 70) + squig(120, y + 22, 150) + [line(120, y + 50, 120 + 60 + i * 25, y + 50, 0.8)] + rect(120, y + 43, 170, 14)
SK.append(_s3)
# 4 phone with the finished ad, heart + likes
SK.append(rect(70, 40, 190, 380) + [line(140, 58, 190, 58)] + rect(88, 80, 154, 250) + [line(110, 300, 210, 120), line(120, 150, 220, 280)] +
          heart(290, 210, 14) + [txt(290, 262, "148K", 22, "middle")] + squig(90, 360, 120) + [txt(165, 480, "posted!", 34, "middle")])
# 5 pipeline graph around the logo
_n = [(80, 100, "prompt"), (240, 165, "image"), (255, 360, "video"), (70, 400, "voice"), (165, 520, "your ad")]
_s5 = circ(165, 285, 38) + [line(150, 275, 160, 300), line(160, 300, 170, 272), line(170, 272, 182, 302)]
for x, y, s in _n:
    _s5 += [line(165, 285, x, y, 1.0)] + rect(x - 50, y - 22, 100, 44) + [txt(x, y + 9, s, 24, "middle")]
SK.append(_s5)

def sketch_svg(k, items):
    out, i = [], 0
    for it in items:
        if isinstance(it, tuple):
            _, x, y, s, size, anc = it
            out.append(f'<text class="hw sk{k}" x="{x}" y="{y}" font-size="{size}" text-anchor="{anc}">{s}</text>')
        else:
            out.append(f'<path class="sp sk{k}" pathLength="1" d="{it}"/>')
        i += 1
    return f'<svg class="skt" id="sk{k}" viewBox="0 0 330 590">{"".join(out)}</svg>'

SPARK = '<svg viewBox="0 0 100 100"><path fill="#e8734a" d="M50 4l6 30 22-21-12 28 30-4-27 14 27 14-30-4 12 28-22-21-6 30-6-30-22 21 12-28-30 4 27-14-27-14 30 4-12-28 22 21z"/></svg>'
HFL = '<img src="assets/higgsfield_logo.png" alt="">'
IMGS = ["s_shoe.jpg", "s_volt.jpg", "s_nova.jpg", "s_sol.jpg", "s_head.jpg"]
PROMPT = "a 10s ad for my energy drink"
chars = "".join(f'<span class="ch" id="ch{i}">{c if c != " " else "&nbsp;"}</span>' for i, c in enumerate(PROMPT))
cards2 = "".join(f'<div class="c2" id="c2_{i}"><img src="assets/{IMGS[i]}" alt=""><b>{i + 1}</b></div>' for i in range(3))
rows3 = "".join(f'<div class="r3" id="r3_{i}" style="top:{120 + i * 180}px"><img src="assets/{IMGS[i]}" alt=""><div class="m"><b>clip 0{i + 1}</b><span>5s · 1080p</span>'
                f'<div class="bar"><i id="b3_{i}"></i></div></div><em id="ok3_{i}">✓</em></div>' for i in range(5))
NODES = [(120, 210, "prompt", "✎"), (470, 330, "image", "▣"), (490, 680, "video", "▶"), (110, 760, "voice", "♪"), (300, 960, "your ad", "✓")]
chips5 = "".join(f'<div class="ch5" id="n5_{i}" style="left:{x}px;top:{y}px"><span>{s}</span><i>{ic}</i></div>' for i, (x, y, s, ic) in enumerate(NODES))
lines5 = "".join(f'<line id="l5_{i}" x1="310" y1="520" x2="{x}" y2="{y}" pathLength="1"/>' for i, (x, y, s, ic) in enumerate(NODES))
sketches = "".join(sketch_svg(k, it) for k, it in enumerate(SK))

HTML = f'''<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920"><script src="assets/gsap.min.js"></script><style>
@font-face{{font-family:'Caveat';src:url(assets/caveat.woff2) format('woff2');font-weight:600}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden;background:#000}}
#root{{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:'Inter',sans-serif;color:#fff;background:radial-gradient(70% 45% at 55% 42%,#2a2724 0%,#0b0b0b 72%,#000 100%)}}
#grain{{position:absolute;left:-256px;top:-256px;width:1592px;height:2432px;opacity:.05;mix-blend-mode:screen;background:url(assets/noise.png) repeat}}
#hdr{{position:absolute;left:400px;width:640px;top:262px;display:flex;justify-content:center;align-items:center;gap:14px;font-size:50px;font-weight:700;letter-spacing:-.02em}}
#hdr svg{{width:56px;height:56px}}
#dl{{position:absolute;left:40px;top:578px;font-size:46px;font-weight:700;letter-spacing:-.02em}}
#paper{{position:absolute;left:40px;top:650px;width:330px;height:590px;background:#fbfbf8;box-shadow:0 20px 50px rgba(0,0,0,.6)}}
.skt{{position:absolute;inset:0;width:330px;height:590px;opacity:0}}
.sp{{fill:none;stroke:#1d1d1d;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1 1}}
.hw{{font-family:'Caveat',cursive;font-weight:600;fill:#1d1d1d}}
#card{{position:absolute;left:400px;top:345px;width:640px;height:1140px;overflow:hidden;background:#efedea;box-shadow:0 30px 80px rgba(0,0,0,.7)}}
.shot{{position:absolute;inset:0;opacity:0}}
.grid{{background-color:#f1efec;background-image:linear-gradient(rgba(0,0,0,.055) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(0,0,0,.055) 1.5px,transparent 1.5px);background-size:44px 44px}}
#cta{{position:absolute;left:0;right:0;top:1560px;text-align:center;font-size:52px;font-weight:800;letter-spacing:-.02em}}
#cta b{{color:#ff5a2a}}
#handle{{position:absolute;left:50%;top:1680px;transform:translateX(-50%);font-size:30px;font-weight:600;color:rgba(255,255,255,.55)}}
/* shot 1 */
#lg1{{position:absolute;left:235px;top:300px;width:170px;height:170px;border-radius:40px;background:#fff;box-shadow:0 18px 40px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center}}
#lg1 img{{width:120px;height:120px;border-radius:26px}}
#ring1{{position:absolute;left:170px;top:235px;width:300px;height:300px;border-radius:50%;border:4px solid #8fc3ff;opacity:0}}
#in1{{position:absolute;left:40px;top:640px;width:560px;height:130px;border-radius:30px;background:#fff;box-shadow:0 14px 36px rgba(0,0,0,.14);display:flex;align-items:center;padding:0 110px 0 30px;font-size:28px;color:#1a1a1a;font-weight:500;white-space:nowrap}}
#in1 .ch{{opacity:0}}
#snd1{{position:absolute;left:504px;top:668px;width:74px;height:74px;border-radius:50%;background:#ff5a2a;display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;font-weight:800}}
#cur1{{position:absolute;left:600px;top:900px;width:46px;height:46px}}
#gen1{{position:absolute;left:150px;top:850px;width:340px;height:70px;border-radius:20px;background:#1b1b1d;color:#fff;font-size:27px;font-weight:600;display:flex;align-items:center;gap:16px;padding-left:26px;opacity:0;box-shadow:0 14px 30px rgba(0,0,0,.3)}}
#gen1 i{{width:26px;height:26px;border-radius:50%;border:4px solid rgba(255,255,255,.25);border-top-color:#ff5a2a}}
/* shot 2 */
.c2{{position:absolute;left:150px;width:340px;height:300px;border-radius:26px;overflow:hidden;box-shadow:0 20px 44px rgba(0,0,0,.28);opacity:0;background:#ddd}}
.c2 img{{width:100%;height:100%;object-fit:cover}}
.c2 b{{position:absolute;right:16px;top:14px;width:62px;height:62px;border-radius:18px;background:#e8582a;color:#fff;font-size:38px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.25)}}
#pick2{{position:absolute;left:310px;top:960px;transform:translateX(-50%);font-size:34px;font-weight:700;color:#1a1a1a;background:#fff;border-radius:40px;padding:12px 30px;opacity:0;box-shadow:0 10px 26px rgba(0,0,0,.14);white-space:nowrap}}
/* shot 3 */
.r3{{position:absolute;left:40px;width:560px;height:150px;border-radius:24px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.12);display:flex;align-items:center;gap:22px;padding:0 22px;opacity:0}}
.r3 img{{width:106px;height:106px;border-radius:18px;object-fit:cover}}
.r3 .m{{flex:1}} .r3 b{{display:block;font-size:30px;color:#1a1a1a}} .r3 span{{display:block;font-size:22px;color:#8a8580;margin:2px 0 12px;font-family:'JetBrains Mono',monospace}}
.r3 .bar{{height:14px;border-radius:8px;background:#efe9e4;overflow:hidden}} .r3 .bar i{{display:block;height:100%;width:0;background:#e8582a;border-radius:8px}}
.r3 em{{font-style:normal;width:52px;height:52px;border-radius:50%;background:#2fbf71;color:#fff;font-size:30px;font-weight:800;display:flex;align-items:center;justify-content:center;opacity:0}}
#t3{{position:absolute;left:0;right:0;top:40px;text-align:center;font-size:30px;font-weight:700;color:#1a1a1a;font-family:'JetBrains Mono',monospace}}
/* shot 4 */
#s3{{background:radial-gradient(80% 55% at 50% 45%,#3a1d12 0%,#120a07 75%)}}
#ph4{{position:absolute;left:115px;top:110px;width:410px;height:840px;border-radius:56px;background:#0a0a0a;padding:14px;box-shadow:0 30px 70px rgba(0,0,0,.6),0 0 0 3px #2a2a2a}}
#ph4 .scr{{position:relative;width:100%;height:100%;border-radius:44px;overflow:hidden}}
#ph4 img{{width:100%;height:100%;object-fit:cover;transform-origin:50% 60%}}
#ph4 .cap{{position:absolute;left:24px;bottom:34px;right:90px;font-size:22px;font-weight:600;text-shadow:0 2px 8px rgba(0,0,0,.6)}}
#ph4 .cap b{{display:block;font-size:24px}}
#hz4{{position:absolute;right:16px;bottom:120px;text-align:center;font-size:20px;font-weight:700}}
#hz4 .h{{font-size:46px;color:#fff;display:block;line-height:1}}
.fh{{position:absolute;font-size:46px;color:#ff3d6a;opacity:0}}
#lk4{{position:absolute;left:0;right:0;top:985px;text-align:center;font-size:64px;font-weight:900;letter-spacing:-.03em}}
#lk4 span{{font-size:30px;font-weight:600;color:rgba(255,255,255,.6);letter-spacing:0}}
/* shot 5 */
#s4{{background:radial-gradient(60% 40% at 50% 46%,#8a4a35 0%,#4a2318 45%,#1e0e09 100%)}}
#lg5{{position:absolute;left:230px;top:440px;width:160px;height:160px;border-radius:38px;overflow:hidden;box-shadow:0 0 90px 30px rgba(255,170,120,.45)}}
#lg5 img{{width:100%;height:100%}}
#sv5{{position:absolute;inset:0;width:640px;height:1140px}}
#sv5 line{{stroke:rgba(255,230,220,.55);stroke-width:2.5;stroke-dasharray:1 1}}
.ch5{{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;gap:12px;background:#f7e9e4;color:#4a2318;font-family:'EB Garamond',serif;font-size:38px;padding:10px 20px;border-radius:14px;box-shadow:0 10px 26px rgba(0,0,0,.35);opacity:0;white-space:nowrap}}
.ch5 i{{font-style:normal;font-family:'Inter',sans-serif;font-size:24px;background:#4a2318;color:#f7e9e4;border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center}}
#n5_4{{background:#ff5a2a;color:#fff;font-weight:600}} #n5_4 i{{background:#fff;color:#ff5a2a}}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920" data-motion-blur="off">
<div id="hdr">{SPARK}<span>Claude Code</span></div>
<div id="dl">Drawing</div>
<div id="paper">{sketches}</div>
<div id="card">
 <div class="shot grid" id="s0"><div id="ring1"></div><div id="lg1">{HFL}</div><div id="in1">{chars}</div><div id="snd1">↑</div>
  <div id="gen1"><i id="sp1"></i>Generating 3 styles…</div>
  <svg id="cur1" viewBox="0 0 24 24"><path d="M3 2l7 19 3-8 8-3z" fill="#111" stroke="#fff" stroke-width="1.5"/></svg></div>
 <div class="shot grid" id="s1">{cards2}<div id="pick2">Style 2 it is</div></div>
 <div class="shot grid" id="s2"><div id="t3">rendering 5 clips…</div>{rows3}</div>
 <div class="shot" id="s3"><div id="ph4"><div class="scr"><img src="assets/s_volt.jpg" alt=""><div class="cap"><b>@yourbrand</b>made in 10 min with AI</div>
  <div id="hz4"><span class="h">♥</span><span id="hc4">0</span></div></div></div>
  <div class="fh" id="fh0" style="left:470px;top:760px">♥</div><div class="fh" id="fh1" style="left:500px;top:760px">♥</div><div class="fh" id="fh2" style="left:455px;top:760px">♥</div><div class="fh" id="fh3" style="left:490px;top:760px">♥</div>
  <div id="lk4"><b id="lk4n">0</b> <span>likes</span></div></div>
 <div class="shot" id="s4"><svg id="sv5" viewBox="0 0 640 1140">{lines5}</svg><div id="lg5">{HFL}</div>{chips5}</div>
</div>
<div id="cta">Comment “<b>SKETCH</b>” for the prompts</div>
<div id="handle">@theaitoolfinds</div>
<div id="grain"></div>
<audio id="mus" class="clip" src="assets/music.mp3" data-start="0" data-duration="{DUR}" data-track-index="21" data-volume="0.32"></audio>
<audio id="fx" class="clip" src="assets/sfx.wav" data-start="0" data-duration="{DUR}" data-track-index="22" data-volume="0.9"></audio>
</div>
<script>
window.__timelines=window.__timelines||{{}};
const SH={SH}, N={N}, DUR={DUR}, NP={len(PROMPT)};
const tl=gsap.timeline({{paused:true}}); const NI={{immediateRender:false}};
function F(s,a,b,t){{ return tl.fromTo(s,a,Object.assign({{}},b,NI),t); }}
tl.set('.shot',{{opacity:0}},0); tl.set('.skt',{{opacity:0}},0); tl.set('.sp',{{strokeDashoffset:1}},0); tl.set('.hw',{{opacity:0}},0);
for(let k=0;k<N;k++){{ const t=k*SH;
  // sketch draws itself
  F('#sk'+k,{{opacity:0}},{{opacity:1,duration:.01}},t+0.001); if(k) F('#sk'+(k-1),{{opacity:1}},{{opacity:0,duration:.01}},t+0.001);
  const ps=document.querySelectorAll('#sk'+k+' .sp'); const L=ps.length;
  ps.forEach((p,i)=>F(p,{{strokeDashoffset:1}},{{strokeDashoffset:0,duration:.22,ease:'power1.inOut'}},t+0.02+i*(0.6/L)));
  F('#sk'+k+' .hw',{{opacity:0}},{{opacity:1,duration:.2,stagger:.08}},t+0.25);
  // shot in / out
  F('#s'+k,{{opacity:0,scale:1.06,filter:'blur(10px)'}},{{opacity:1,scale:1,filter:'blur(0px)',duration:.32,ease:'expo.out'}},t);
  if(k<N-1) F('#s'+k,{{opacity:1}},{{opacity:0,duration:.18}},t+SH-0.05);
}}
F('#paper',{{rotation:-1.2}},{{rotation:1.2,duration:SH,yoyo:true,repeat:N,ease:'sine.inOut'}},0);
// 1: prompt
let t=0;
F('#lg1',{{scale:0,rotation:-20}},{{scale:1,rotation:0,duration:.5,ease:'back.out(2)'}},t+0.1);
F('#ring1',{{scale:.55,opacity:.9}},{{scale:1.35,opacity:0,duration:1.0,ease:'power2.out'}},t+0.3);
F(['#in1','#snd1'],{{y:60,opacity:0}},{{y:0,opacity:1,duration:.35,ease:'expo.out'}},t+0.25);
for(let i=0;i<NP;i++) tl.set('#ch'+i,{{opacity:1}},t+0.5+i*0.034);
F('#cur1',{{x:0,y:0}},{{x:-75,y:-195,duration:.5,ease:'power2.inOut'}},t+1.35);
F('#snd1',{{scale:1}},{{scale:.82,duration:.08,yoyo:true,repeat:1}},t+1.92);
F('#gen1',{{opacity:0,y:30}},{{opacity:1,y:0,duration:.3,ease:'back.out(2)'}},t+2.05);
F('#sp1',{{rotation:0}},{{rotation:720,duration:1,ease:'none'}},t+2.05);
F('#lg1',{{scale:1}},{{scale:1.08,duration:.2,yoyo:true,repeat:1}},t+2.0);
// 2: three styles
t=SH; [80,380,680].forEach((y,i)=>{{ tl.set('#c2_'+i,{{top:y}},0); F('#c2_'+i,{{opacity:0,y:-80,rotation:i%2?4:-4,scale:.9}},{{opacity:1,y:0,rotation:i%2?1.5:-1.5,scale:1,duration:.45,ease:'back.out(1.6)'}},t+0.2+i*0.25); }});
F('#c2_1',{{scale:1,boxShadow:'0 20px 44px rgba(0,0,0,.28)'}},{{scale:1.1,boxShadow:'0 0 0 7px #ff5a2a, 0 30px 60px rgba(0,0,0,.35)',duration:.35,ease:'back.out(2)'}},t+1.6);
F(['#c2_0','#c2_2'],{{opacity:1}},{{opacity:.35,duration:.3}},t+1.6);
F('#pick2',{{opacity:0,y:20}},{{opacity:1,y:0,duration:.3,ease:'back.out(2)'}},t+1.75);
// 3: clips render
t=2*SH; F('#t3',{{opacity:0}},{{opacity:1,duration:.3}},t+0.1);
for(let i=0;i<5;i++){{ F('#r3_'+i,{{opacity:0,x:80}},{{opacity:1,x:0,duration:.35,ease:'expo.out'}},t+0.12+i*0.07);
  F('#b3_'+i,{{width:'0%'}},{{width:'100%',duration:0.55+i*0.3,ease:'power1.inOut'}},t+0.35);
  F('#ok3_'+i,{{opacity:0,scale:0}},{{opacity:1,scale:1,duration:.25,ease:'back.out(3)'}},t+0.9+i*0.3); }}
tl.set('#t3',{{innerText:'5 clips ready ✓'}},t+2.3);
// 4: finished ad on a phone, likes rolling
t=3*SH; F('#ph4',{{y:200,opacity:0}},{{y:0,opacity:1,duration:.45,ease:'expo.out'}},t+0.05);
F('#ph4 img',{{scale:1.15}},{{scale:1,duration:SH,ease:'none'}},t);
const LK={{v:0}}; F(LK,{{v:0}},{{v:148000,duration:2.1,ease:'power2.in',onUpdate:()=>{{ const s=LK.v>=1000?(LK.v/1000).toFixed(LK.v<10000?1:0)+'K':Math.round(LK.v)+''; document.getElementById('lk4n').textContent=s; document.getElementById('hc4').textContent=s; }}}},t+0.4);
for(let i=0;i<4;i++) F('#fh'+i,{{opacity:1,y:0,x:0,scale:.6}},{{opacity:0,y:-380,x:(i%2?40:-40),scale:1.3,duration:1.1,ease:'power1.out'}},t+0.6+i*0.35);
F('#lk4',{{opacity:0,y:30}},{{opacity:1,y:0,duration:.3}},t+0.4);
// 5: the pipeline around the logo
t=4*SH; F('#lg5',{{scale:0}},{{scale:1,duration:.5,ease:'back.out(2)'}},t+0.1);
for(let i=0;i<5;i++){{ F('#l5_'+i,{{strokeDashoffset:1}},{{strokeDashoffset:0,duration:.35,ease:'power2.out'}},t+0.4+i*0.18);
  F('#n5_'+i,{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:.35,ease:'back.out(2.2)'}},t+0.5+i*0.18); }}
F('#lg5',{{boxShadow:'0 0 90px 30px rgba(255,170,120,.45)'}},{{boxShadow:'0 0 140px 50px rgba(255,170,120,.7)',duration:.8,yoyo:true,repeat:3,ease:'sine.inOut'}},t+0.6);
F('#n5_4',{{scale:1}},{{scale:1.12,duration:.25,yoyo:true,repeat:1}},t+1.9);
F('#cta',{{scale:1}},{{scale:1.06,duration:.3,yoyo:true,repeat:1,ease:'sine.inOut'}},4*SH+2.0);
for(let k=0,q=0;q<DUR;k++,q=k/12){{ const sd=(k*7919)%997; tl.set('#grain',{{x:-(sd%256),y:-((sd*31)%256)}},q); }}
window.__timelines['main']=tl; tl.seek(0);
</script></body></html>'''
(W / "index.html").write_text(HTML)
print("ok", NAME, "dur", DUR)
