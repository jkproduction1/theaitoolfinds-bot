"""sketch2 - "Sketch -> Motion" #2 (Jan, 2026-11-10): music-app UI motion in a Wrapped-season mood. Own player design (no Spotify
logo/wordmark drawn), real song titles + artists as text only, abstract gradient covers (no album art). NO music bed: Jan adds a
trending sound in the Instagram app, so only sfx here. Sketch helpers in hf/sketchlib.py."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
H = HERE.parent.parent
sys.path.insert(0, str(H))
from house import write_sfx
from sketchlib import line, rect, circ, squig, arrow, txt, heart, sketch_svg

NAME = "sketch2"
W = H / "work" / NAME; A = W / "assets"
A.mkdir(parents=True, exist_ok=True); (W / "renders").mkdir(exist_ok=True)
for f in (H / "template").iterdir(): shutil.copy(f, W / f.name)
for f in (H / "assets").iterdir(): shutil.copy(f, A / f.name)
for f in (HERE / "media").iterdir(): shutil.copy(f, A / f.name)

SH, N = 2.9, 5
DUR = round(N * SH + 0.7, 2)
ev = []
for k in range(N): ev += [(k * SH, "whoosh"), (k * SH + 0.25, "pop")]
ev += [(0.9, "click"), (1.0, "pop")]                                                   # play
ev += [(SH + 0.3 + i * 0.1, "tick") for i in range(5)] + [(SH + 1.2, "click"), (SH + 1.75, "pop")]   # queue + drag
ev += [(2 * SH + 0.35 + i * 0.05, "tick") for i in range(0, 20, 2)] + [(2 * SH + 1.35, "pop")] + [(2 * SH + 1.6 + i * 0.12, "tick") for i in range(4)]
ev += [(3 * SH + 0.5, "whoosh"), (3 * SH + 2.2, "pop")]
ev += [(4 * SH + 0.3 + i * 0.22, "pop") for i in range(5)] + [(4 * SH + 1.9, "click")]
write_sfx(ev, DUR, A / "sfx.wav")

SONGS = [("Blinding Lights", "The Weeknd"), ("Espresso", "Sabrina Carpenter"), ("Nightcall", "Kavinsky"),
         ("Midnight City", "M83"), ("Instant Crush", "Daft Punk"), ("Starboy", "The Weeknd")]
COV = ["radial-gradient(circle at 30% 25%,#ffd36a 0,#ff3d6e 45%,#5a1240 100%)", "linear-gradient(140deg,#c9f0ff,#7a8cff 50%,#2b1a6b)",
       "radial-gradient(circle at 70% 70%,#ff4bd0 0,#6a1cff 50%,#0b0730 100%)", "linear-gradient(160deg,#ff9a3d,#ff3d3d 40%,#2a0a3a)",
       "radial-gradient(circle at 40% 60%,#8affd2 0,#1f8a7a 45%,#0a1f2a 100%)", "linear-gradient(130deg,#fff,#ffcf3d 40%,#ff5a2a)"]

# ---------------------------------------------------------------- sketches
SK = []
SK.append(rect(60, 40, 210, 210) + [line(70, 240, 260, 50, 1.0), line(110, 200, 170, 120)] + [txt(60, 300, "Blinding Lights", 30)] + squig(60, 322, 120) +
          [line(60, 370, 270, 370)] + circ(140, 370, 7) + circ(165, 440, 30) + [line(156, 425, 156, 455), line(156, 425, 180, 440), line(180, 440, 156, 455)] +
          [line(80, 430, 80, 450), line(250, 430, 250, 450)] + [line(40 + i * 25, 540, 40 + i * 25, 540 - (12 + (i * 37) % 40)) for i in range(11)])
_q = [txt(40, 60, "Up next", 32)]
for i in range(5):
    y = 90 + i * 85
    _q += rect(40, y, 60, 60) + squig(115, y + 20, 140) + squig(115, y + 42, 80)
_q += arrow(290, 280, 290, 110) + [txt(280, 300, "drag", 22, "middle")]
SK.append(_q)
SK.append(rect(30, 40, 270, 60) + [txt(45, 80, "songs for a 2am drive", 24)] + arrow(165, 115, 165, 160) + rect(95, 170, 140, 140) + [txt(165, 250, "2AM", 34, "middle")] +
          sum([rect(40, 340 + i * 58, 44, 44) + squig(100, 360 + i * 58, 170) for i in range(4)], []))
SK.append([txt(165, 120, "you listened", 30, "middle"), txt(165, 220, "48,213", 66, "middle"), txt(165, 270, "minutes", 30, "middle")] +
          circ(70, 380, 34) + circ(250, 420, 50) + rect(130, 360, 70, 70) + heart(90, 500, 14) + [txt(200, 540, "synthwave!", 30, "middle")])
_t = [txt(165, 60, "your top 5", 34, "middle")]
for i in range(5):
    y = 90 + i * 92
    _t += rect(45, y, 240, 72) + [txt(70, y + 50, str(i + 1), 36, "middle")] + squig(105, y + 36, 150)
_t += [line(55, 80, 65, 60), line(65, 60, 75, 76), line(75, 76, 85, 60), line(85, 60, 95, 80)]
SK.append(_t)
sketches = "".join(sketch_svg(k, it) for k, it in enumerate(SK))

SPARK = '<svg viewBox="0 0 100 100"><path fill="#e8734a" d="M50 4l6 30 22-21-12 28 30-4-27 14 27 14-30-4 12 28-22-21-6 30-6-30-22 21 12-28-30 4 27-14-27-14 30 4-12-28 22 21z"/></svg>'
bars = "".join(f'<i id="wb{i}"></i>' for i in range(34))
Q = [SONGS[i] for i in (1, 3, 2, 4, 5)]
qrows = "".join(f'<div class="q" id="q{i}"><div class="cv" style="background:{COV[(i + 1) % 6]}"></div><div><b>{s}</b><span>{a}</span></div><em>⋮⋮</em></div>' for i, (s, a) in enumerate(Q))
PL = [SONGS[i] for i in (2, 3, 0, 4)]
plrows = "".join(f'<div class="pr" id="pr{i}"><div class="cv" style="background:{COV[(i + 2) % 6]}"></div><div><b>{s}</b><span>{a}</span></div></div>' for i, (s, a) in enumerate(PL))
PROMPT = "songs for a 2am drive"
pch = "".join(f'<span class="pc" id="pc{i}">{c if c != " " else "&nbsp;"}</span>' for i, c in enumerate(PROMPT))
TOP = [SONGS[i] for i in (0, 2, 3, 1, 4)]
TC = ["#c8ff3d", "#ff5ac8", "#5ad0ff", "#ffcf3d", "#ff7a4a"]
trows = "".join(f'<div class="t5" id="t5_{i}" style="background:{TC[i]}"><b>{i + 1}</b><div><strong>{s}</strong><span>{a}</span></div></div>' for i, (s, a) in enumerate(TOP))

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
#card{{position:absolute;left:400px;top:345px;width:640px;height:1140px;overflow:hidden;background:#121212;box-shadow:0 30px 80px rgba(0,0,0,.7)}}
.shot{{position:absolute;inset:0;opacity:0;background:#121212}}
#cta{{position:absolute;left:0;right:0;top:1560px;text-align:center;font-size:52px;font-weight:800;letter-spacing:-.02em}}
#cta b{{color:#ff5a2a}}
#handle{{position:absolute;left:50%;top:1680px;transform:translateX(-50%);font-size:30px;font-weight:600;color:rgba(255,255,255,.55)}}
.cv{{border-radius:10px;flex:none}}
/* 1 now playing */
#s0{{background:linear-gradient(180deg,#5a1a3a 0%,#1a0f14 55%,#121212 100%)}}
#np{{position:absolute;left:0;right:0;top:44px;text-align:center;font-size:22px;letter-spacing:.18em;color:rgba(255,255,255,.7);font-weight:600}}
#art{{position:absolute;left:90px;top:110px;width:460px;height:460px;border-radius:22px;background:{COV[0]};box-shadow:0 30px 70px rgba(0,0,0,.55)}}
#art:after{{content:'';position:absolute;inset:0;border-radius:22px;background:radial-gradient(circle at 65% 70%,rgba(255,255,255,.35),transparent 40%)}}
#ti{{position:absolute;left:90px;top:610px;font-size:48px;font-weight:800;letter-spacing:-.02em}}
#ar{{position:absolute;left:90px;top:672px;font-size:30px;color:rgba(255,255,255,.65)}}
#hrt{{position:absolute;right:90px;top:622px;font-size:46px;color:#fff}}
#scr{{position:absolute;left:90px;top:750px;width:460px;height:8px;border-radius:4px;background:rgba(255,255,255,.22)}}
#scr i{{position:absolute;left:0;top:0;height:100%;width:20%;border-radius:4px;background:#fff}}
#scr b{{position:absolute;top:-7px;left:20%;width:22px;height:22px;margin-left:-11px;border-radius:50%;background:#fff}}
#tm{{position:absolute;left:90px;right:90px;top:774px;display:flex;justify-content:space-between;font-size:20px;color:rgba(255,255,255,.6);font-family:'JetBrains Mono',monospace}}
#ctl{{position:absolute;left:90px;right:90px;top:830px;display:flex;justify-content:space-between;align-items:center;font-size:40px}}
#pp{{width:110px;height:110px;border-radius:50%;background:#fff;color:#121212;display:flex;align-items:center;justify-content:center;font-size:48px;position:relative}}
#pp span{{position:absolute}}
#wav{{position:absolute;left:90px;right:90px;top:1000px;height:100px;display:flex;align-items:flex-end;gap:5px}}
#wav i{{flex:1;background:linear-gradient(0deg,#ff3d6e,#ffd36a);border-radius:3px;height:10px}}
/* 2 queue */
#s1 h3,#s2 h3{{position:absolute;left:48px;top:60px;font-size:44px;font-weight:800;letter-spacing:-.02em}}
.q{{position:absolute;left:36px;width:568px;height:150px;border-radius:20px;display:flex;align-items:center;gap:24px;padding:0 22px;background:#1d1d1d}}
.q .cv,.pr .cv{{width:104px;height:104px}}
.q b,.pr b{{display:block;font-size:32px;font-weight:700}} .q span,.pr span{{display:block;font-size:24px;color:rgba(255,255,255,.55);margin-top:4px}}
.q em{{margin-left:auto;font-style:normal;color:rgba(255,255,255,.4);font-size:30px;letter-spacing:-6px}}
/* 3 AI playlist */
#pin{{position:absolute;left:36px;top:150px;width:568px;height:100px;border-radius:50px;background:#2a2a2a;display:flex;align-items:center;padding:0 34px;font-size:30px;white-space:nowrap}}
#pin .pc{{opacity:0}}
#pin:before{{content:'✳';color:#e8734a;margin-right:16px;font-size:34px}}
#pcov{{position:absolute;left:170px;top:300px;width:300px;height:300px;border-radius:18px;background:linear-gradient(150deg,#ff9a3d,#ff3d6e 45%,#3a0f5a);display:flex;align-items:flex-end;padding:22px;font-size:58px;font-weight:900;letter-spacing:-.03em;line-height:.9;box-shadow:0 26px 60px rgba(0,0,0,.6)}}
#pmeta{{position:absolute;left:0;right:0;top:620px;text-align:center;font-size:24px;color:rgba(255,255,255,.6)}}
.pr{{position:absolute;left:36px;width:568px;height:112px;display:flex;align-items:center;gap:22px;padding:0 4px}}
.pr .cv{{width:88px;height:88px}}
/* 4 wrapped stats */
#s3{{background:#5b2cff}}
.blob{{position:absolute;border-radius:50%}}
#b1{{left:-120px;top:720px;width:420px;height:420px;background:#ff5ac8}} #b2{{left:380px;top:-80px;width:360px;height:360px;background:#c8ff3d}}
#b3{{left:420px;top:820px;width:260px;height:260px;border-radius:40px;background:#ffcf3d}}
#yl{{position:absolute;left:48px;top:330px;font-size:44px;font-weight:700}}
#mins{{position:absolute;left:40px;top:390px;font-size:150px;font-weight:900;letter-spacing:-.05em;line-height:1}}
#mw{{position:absolute;left:48px;top:560px;font-size:44px;font-weight:700}}
#gen{{position:absolute;left:48px;top:660px;font-size:34px;font-weight:800;color:#121212;background:#fff;border-radius:40px;padding:14px 30px}}
/* 5 top 5 */
#s4{{background:#121212}}
#s4 h3{{position:absolute;left:0;right:0;top:56px;text-align:center;font-size:50px;font-weight:900;letter-spacing:-.03em}}
.t5{{position:absolute;left:40px;width:560px;height:150px;border-radius:24px;color:#121212;display:flex;align-items:center;gap:26px;padding:0 30px}}
.t5 b{{font-size:84px;font-weight:900;letter-spacing:-.05em;width:62px;text-align:center}}
.t5 strong{{display:block;font-size:36px;font-weight:800}} .t5 span{{display:block;font-size:24px;font-weight:600;opacity:.65}}
#shr{{position:absolute;left:50%;top:1010px;transform:translateX(-50%);background:#fff;color:#121212;font-weight:800;font-size:32px;border-radius:40px;padding:16px 46px;white-space:nowrap}}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920" data-motion-blur="off">
<div id="hdr">{SPARK}<span>Claude Code</span></div>
<div id="dl">Drawing</div>
<div id="paper">{sketches}</div>
<div id="card">
 <div class="shot" id="s0"><div id="np">NOW PLAYING</div><div id="art"></div><div id="ti">{SONGS[0][0]}</div><div id="ar">{SONGS[0][1]}</div><div id="hrt">♡</div>
  <div id="scr"><i id="scf"></i><b id="scb"></b></div><div id="tm"><span id="tcur">0:42</span><span>3:20</span></div>
  <div id="ctl"><span>⇄</span><span>⏮</span><div id="pp"><span id="ppl">▶</span><span id="pps" style="opacity:0">❚❚</span></div><span>⏭</span><span>↻</span></div>
  <div id="wav">{bars}</div></div>
 <div class="shot" id="s1"><h3>Up next</h3>{qrows}</div>
 <div class="shot" id="s2"><div id="pin">{pch}</div><div id="pcov">2AM<br>DRIVE</div><div id="pmeta">AI playlist · 24 songs · 1 h 28 min</div>{plrows}</div>
 <div class="shot" id="s3"><div class="blob" id="b1"></div><div class="blob" id="b2"></div><div class="blob" id="b3"></div>
  <div id="yl">You listened for</div><div id="mins">0</div><div id="mw">minutes this year</div><div id="gen">Top genre: Synthwave</div></div>
 <div class="shot" id="s4"><h3>Your top 5</h3>{trows}<div id="shr">Share ↗</div></div>
</div>
<div id="cta">Comment “<b>SKETCH</b>” for the prompts</div>
<div id="handle">@theaitoolfinds</div>
<div id="grain"></div>
<audio id="fx" class="clip" src="assets/sfx.wav" data-start="0" data-duration="{DUR}" data-track-index="22" data-volume="0.9"></audio>
</div>
<script>
window.__timelines=window.__timelines||{{}};
const SH={SH}, N={N}, DUR={DUR}, NP={len(PROMPT)};
const tl=gsap.timeline({{paused:true}}); const NI={{immediateRender:false}};
function F(s,a,b,t){{ return tl.fromTo(s,a,Object.assign({{}},b,NI),t); }}
tl.set('.shot',{{opacity:0}},0); tl.set('.skt',{{opacity:0}},0); tl.set('.sp',{{strokeDashoffset:1}},0); tl.set('.hw',{{opacity:0}},0);
for(let k=0;k<N;k++){{ const t=k*SH;
  F('#sk'+k,{{opacity:0}},{{opacity:1,duration:.01}},t+0.001); if(k) F('#sk'+(k-1),{{opacity:1}},{{opacity:0,duration:.01}},t+0.001);
  const ps=document.querySelectorAll('#sk'+k+' .sp'); const L=ps.length;
  ps.forEach((p,i)=>F(p,{{strokeDashoffset:1}},{{strokeDashoffset:0,duration:.22,ease:'power1.inOut'}},t+0.02+i*(0.6/L)));
  F('#sk'+k+' .hw',{{opacity:0}},{{opacity:1,duration:.2,stagger:.08}},t+0.25);
  F('#s'+k,{{opacity:0,scale:1.06,filter:'blur(10px)'}},{{opacity:1,scale:1,filter:'blur(0px)',duration:.32,ease:'expo.out'}},t);
  if(k<N-1) F('#s'+k,{{opacity:1}},{{opacity:0,duration:.18}},t+SH-0.05);
}}
F('#paper',{{rotation:-1.2}},{{rotation:1.2,duration:SH,yoyo:true,repeat:N,ease:'sine.inOut'}},0);
// 1 now playing
let t=0;
F('#art',{{scale:.85,rotation:-4}},{{scale:1,rotation:0,duration:.6,ease:'back.out(1.6)'}},t);
F(['#ti','#ar','#hrt'],{{opacity:0,y:20}},{{opacity:1,y:0,duration:.35,stagger:.06,ease:'expo.out'}},t+0.2);
F(['#scr','#tm','#ctl'],{{opacity:0}},{{opacity:1,duration:.3}},t+0.3);
F('#pp',{{scale:1}},{{scale:.86,duration:.08,yoyo:true,repeat:1}},t+0.9);
F('#ppl',{{opacity:1}},{{opacity:0,duration:.1}},t+0.95); F('#pps',{{opacity:0}},{{opacity:1,duration:.1}},t+0.95);
F('#hrt',{{scale:1,color:'#fff'}},{{scale:1.35,color:'#ff3d6e',duration:.25,ease:'back.out(3)'}},t+1.9); tl.set('#hrt',{{innerText:'♥'}},t+1.9);
const SC={{p:0}}; F(SC,{{p:0}},{{p:1,duration:1.9,ease:'none',onUpdate:()=>{{ const f=20+SC.p*12; document.getElementById('scf').style.width=f+'%'; document.getElementById('scb').style.left=f+'%'; const s=42+Math.round(SC.p*24); document.getElementById('tcur').textContent='0:'+(s<60?s:'0'+(s-60)).toString().padStart(2,'0').replace(/^0(\\d)$/,'0$1'); }}}},t+0.95);
const WB=document.querySelectorAll('#wav i'); const WV={{x:0}};
F(WV,{{x:0}},{{x:1,duration:SH,ease:'none',onUpdate:()=>{{ const q=WV.x*SH, on=Math.min(1,Math.max(0,(q-0.95)/0.25)); WB.forEach((b,i)=>{{ const h=10+on*88*Math.abs(Math.sin(i*0.7+q*7))*(0.45+0.55*Math.abs(Math.sin(i*0.23+q*2.9))); b.style.height=h+'px'; }}); }}}},t);
// 2 queue + drag
t=SH; for(let i=0;i<5;i++){{ tl.set('#q'+i,{{top:140+i*170}},0); F('#q'+i,{{opacity:0,x:120}},{{opacity:1,x:0,duration:.35,ease:'expo.out'}},t+0.25+i*0.09); }}
F('#q2',{{scale:1,boxShadow:'0 0 0 rgba(0,0,0,0)',zIndex:5}},{{scale:1.05,boxShadow:'0 24px 50px rgba(0,0,0,.6)',backgroundColor:'#2c2c2c',zIndex:5,duration:.2}},t+1.15);
F('#q2',{{top:480}},{{top:140,duration:.55,ease:'power2.inOut'}},t+1.3);
F(['#q0','#q1'],{{y:0}},{{y:170,duration:.45,ease:'power2.inOut'}},t+1.38);
F('#q2',{{scale:1.05}},{{scale:1,duration:.2}},t+1.85);
// 3 AI playlist
t=2*SH; F('#pin',{{opacity:0,y:30}},{{opacity:1,y:0,duration:.3,ease:'expo.out'}},t+0.15);
for(let i=0;i<NP;i++) tl.set('#pc'+i,{{opacity:1}},t+0.35+i*0.045);
F('#pcov',{{opacity:0,scale:.4,rotation:-12}},{{opacity:1,scale:1,rotation:0,duration:.5,ease:'back.out(1.7)'}},t+1.3);
F('#pmeta',{{opacity:0}},{{opacity:1,duration:.3}},t+1.5);
for(let i=0;i<4;i++){{ tl.set('#pr'+i,{{top:680+i*112}},0); F('#pr'+i,{{opacity:0,y:40}},{{opacity:1,y:0,duration:.3,ease:'expo.out'}},t+1.6+i*0.12); }}
// 4 wrapped stats
t=3*SH; F('#b1',{{scale:0}},{{scale:1,duration:.6,ease:'back.out(1.4)'}},t+0.1); F('#b2',{{scale:0}},{{scale:1,duration:.6,ease:'back.out(1.4)'}},t+0.2); F('#b3',{{scale:0,rotation:0}},{{scale:1,rotation:45,duration:.7,ease:'back.out(1.4)'}},t+0.3);
F(['#b1','#b2'],{{x:0}},{{x:40,duration:SH,ease:'sine.inOut'}},t); F('#b3',{{rotation:45}},{{rotation:120,duration:SH-0.8,ease:'none'}},t+1.0);
F('#yl',{{opacity:0,y:30}},{{opacity:1,y:0,duration:.35,ease:'expo.out'}},t+0.3);
const MN={{v:0}}; F(MN,{{v:0}},{{v:48213,duration:1.5,ease:'power3.out',onUpdate:()=>{{ document.getElementById('mins').textContent=Math.round(MN.v).toLocaleString('en-US'); }}}},t+0.5);
F('#mins',{{scale:.8,transformOrigin:'0% 50%'}},{{scale:1,duration:.5,ease:'back.out(2)'}},t+0.5);
F('#mw',{{opacity:0}},{{opacity:1,duration:.3}},t+1.2);
F('#gen',{{opacity:0,scale:.5,rotation:-6}},{{opacity:1,scale:1,rotation:-3,duration:.4,ease:'back.out(2.5)'}},t+2.2);
// 5 top 5
t=4*SH; F('#s4 h3',{{opacity:0,y:-30}},{{opacity:1,y:0,duration:.35,ease:'expo.out'}},t+0.1);
for(let i=0;i<5;i++){{ tl.set('#t5_'+i,{{top:160+i*165}},0); F('#t5_'+i,{{opacity:0,x:(i%2?200:-200),rotation:(i%2?5:-5)}},{{opacity:1,x:0,rotation:(i%2?1:-1),duration:.45,ease:'back.out(1.5)'}},t+0.3+i*0.22); }}
F('#shr',{{opacity:0,y:30}},{{opacity:1,y:0,duration:.35,ease:'back.out(2)'}},t+1.6);
F('#shr',{{scale:1}},{{scale:1.08,duration:.2,yoyo:true,repeat:1}},t+1.9);
F('#cta',{{scale:1}},{{scale:1.06,duration:.3,yoyo:true,repeat:1,ease:'sine.inOut'}},4*SH+2.2);
for(let k=0,q=0;q<DUR;k++,q=k/12){{ const sd=(k*7919)%997; tl.set('#grain',{{x:-(sd%256),y:-((sd*31)%256)}},q); }}
window.__timelines['main']=tl; tl.seek(0);
</script></body></html>'''
(W / "index.html").write_text(HTML)
print("ok", NAME, "dur", DUR)
