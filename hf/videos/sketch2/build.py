"""sketch2 v2 - "Sketch -> Motion" #2 (Jan, 2026-11-10): spicy, real-looking music-app UI on an iPhone (own design in a dark/green
streaming-app style, NO Spotify logo or wordmark drawn; real song titles as text only; abstract gradient covers, no album art).
Lock-screen notification + Dynamic Island -> tap into Now Playing -> swipe through songs (bg colour follows the cover) ->
switch device to a speaker -> share to story. No search (Jan: too slow). Music: t4 (Timeless instrumental) from 0:24 (Jan)."""
import json, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
H = HERE.parent.parent
sys.path.insert(0, str(H))
from house import write_sfx
from sketchlib import line, rect, circ, squig, arrow, txt, heart, sketch_svg

NAME = "sketch2"
W = H / "work" / NAME; A = W / "assets"
if W.exists(): shutil.rmtree(W)
A.mkdir(parents=True, exist_ok=True); (W / "renders").mkdir(exist_ok=True)
for f in (H / "template").iterdir(): shutil.copy(f, W / f.name)
for f in (H / "assets").iterdir(): shutil.copy(f, A / f.name)
for f in (HERE / "media").iterdir(): shutil.copy(f, A / f.name)

SH, N = 2.9, 5
DUR = round(N * SH + 0.7, 2)
TR = "t4"
tj = json.load(open(H.parent / "video/public/music/tracks.json"))[TR]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(tj["hook_start"]), "-i", str(H.parent / "video/public/music" / tj["file"]), "-t", str(DUR + 1),
                "-af", f"afade=t=in:d=0.15,afade=t=out:st={DUR - 0.7}:d=0.7", str(A / "music.mp3")], check=True)
ev = [(0.35, "pop"), (0.9, "whoosh"), (2.45, "click"), (2.55, "whoosh")]
ev += [(SH + 0.35, "pop"), (SH + 1.0, "click"), (SH + 1.9, "pop")]
ev += [(2 * SH + 0.3 + i * 0.8, "whoosh") for i in range(3)]
ev += [(3 * SH + 0.2, "whoosh"), (3 * SH + 1.15, "click"), (3 * SH + 1.8, "pop"), (3 * SH + 2.0, "whoosh")]
ev += [(4 * SH + 0.3, "whoosh"), (4 * SH + 1.6, "whoosh"), (4 * SH + 1.95, "pop")]
write_sfx(ev, DUR, A / "sfx.wav")

SONGS = [("Blinding Lights", "The Weeknd"), ("Espresso", "Sabrina Carpenter"), ("Nightcall", "Kavinsky"), ("Starboy", "The Weeknd")]
COV = ["radial-gradient(circle at 30% 25%,#ffd36a 0,#ff3d6e 42%,#5a1240 100%)", "linear-gradient(140deg,#e9f8ff,#7ab8ff 45%,#24306b)",
       "radial-gradient(circle at 70% 70%,#ff4bd0 0,#6a1cff 50%,#0b0730 100%)", "linear-gradient(150deg,#fff3b0,#ffc23d 35%,#e8402a 70%,#3a0a10)"]
BG = ["#8a1c3a", "#2a4a8a", "#55187a", "#8a4a10"]

# ---------------------------------------------------------------- sketches (330 x 590)
SK = []
SK.append(rect(40, 20, 250, 550) + [line(130, 38, 200, 38)] + [txt(165, 130, "9:41", 56, "middle")] + rect(60, 220, 210, 70) + rect(70, 230, 50, 50) +
          squig(130, 245, 120) + squig(130, 268, 80) + arrow(250, 360, 220, 300) + [txt(250, 385, "tap", 24, "middle")] + circ(165, 38, 20, 1.0))
SK.append(rect(40, 20, 250, 550) + rect(75, 70, 180, 180) + [line(85, 240, 245, 80, 1.0)] + [txt(75, 290, "Blinding Lights", 26)] + squig(75, 310, 90) +
          heart(240, 285, 10) + [line(75, 350, 255, 350)] + circ(130, 350, 6) + circ(165, 420, 28) + [line(158, 406, 158, 434), line(158, 406, 180, 420), line(180, 420, 158, 434)] +
          [txt(165, 520, "green play", 22, "middle")])
SK.append(rect(40, 20, 250, 550) + rect(80, 80, 170, 170) + rect(265, 95, 60, 140) + rect(5, 95, 60, 140) + arrow(240, 300, 100, 300) +
          [txt(165, 345, "swipe!", 30, "middle"), txt(80, 410, "Espresso", 24), txt(80, 445, "Nightcall", 24), txt(80, 480, "Starboy", 24)])
SK.append(rect(40, 20, 250, 550) + circ(165, 150, 40) + circ(165, 150, 62, 1.0) + rect(150, 130, 30, 42) + rect(55, 300, 220, 250) +
          [txt(70, 335, "connect", 24)] + rect(70, 355, 190, 44) + rect(70, 410, 190, 44) + rect(70, 465, 190, 44) + [txt(80, 495, "speaker", 22)] + arrow(275, 520, 250, 492))
SK.append(rect(40, 20, 250, 550) + rect(95, 90, 140, 250) + rect(115, 120, 100, 100) + squig(115, 245, 100) + arrow(235, 110, 290, 40) +
          rect(60, 440, 210, 60) + [txt(165, 478, "sent ✓", 28, "middle")] + [txt(165, 400, "to story", 26, "middle")])
sketches = "".join(sketch_svg(k, it) for k, it in enumerate(SK))

SPARK = '<svg viewBox="0 0 100 100"><path fill="#e8734a" d="M50 4l6 30 22-21-12 28 30-4-27 14 27 14-30-4 12 28-22-21-6 30-6-30-22 21 12-28-30 4 27-14-27-14 30 4-12-28 22 21z"/></svg>'
wv = lambda p, n: "".join(f'<i class="wvb {p}"></i>' for _ in range(n))
covs = "".join(f'<div class="cs" id="cs{i}" style="background:{COV[i]}"></div>' for i in range(4))
tits = "".join(f'<div class="ts" id="ts{i}"><b>{s}</b><span>{a}</span></div>' for i, (s, a) in enumerate(SONGS))
SPK = '<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="14" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="6.5" r="1.2" fill="currentColor"/></svg>'
PHN = '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
POD = '<svg viewBox="0 0 24 24"><path d="M7 4a3 3 0 0 1 3 3v9a2 2 0 0 1-4 0V8a3 3 0 0 1 1-4zM17 4a3 3 0 0 0-3 3v9a2 2 0 0 0 4 0V8a3 3 0 0 0-1-4z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'

HTML = f'''<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920"><script src="assets/gsap.min.js"></script><style>
@font-face{{font-family:'Caveat';src:url(assets/caveat.woff2) format('woff2');font-weight:600}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden;background:#000}}
#root{{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:'Inter',sans-serif;color:#fff;background:radial-gradient(70% 45% at 55% 42%,#2a2724 0%,#0b0b0b 72%,#000 100%)}}
#grain{{position:absolute;left:-256px;top:-256px;width:1592px;height:2432px;opacity:.05;mix-blend-mode:screen;background:url(assets/noise.png) repeat;z-index:60}}
#hdr{{position:absolute;left:400px;width:640px;top:250px;display:flex;justify-content:center;align-items:center;gap:14px;font-size:50px;font-weight:700;letter-spacing:-.02em}}
#hdr svg{{width:56px;height:56px}}
#dl{{position:absolute;left:40px;top:578px;font-size:46px;font-weight:700;letter-spacing:-.02em}}
#paper{{position:absolute;left:40px;top:650px;width:330px;height:590px;background:#fbfbf8;box-shadow:0 20px 50px rgba(0,0,0,.6)}}
.skt{{position:absolute;inset:0;width:330px;height:590px;opacity:0}}
.sp{{fill:none;stroke:#1d1d1d;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1 1}}
.hw{{font-family:'Caveat',cursive;font-weight:600;fill:#1d1d1d}}
#ph{{position:absolute;left:410px;top:340px;width:620px;height:1150px;border-radius:70px;overflow:hidden;background:#000;box-shadow:0 0 0 12px #0c0c0c,0 0 0 14px #2c2c2e,0 40px 90px rgba(0,0,0,.8)}}
#sb{{position:absolute;left:0;right:0;top:0;height:80px;display:flex;justify-content:space-between;align-items:center;padding:0 56px;font-size:26px;font-weight:600;z-index:40}}
#di{{position:absolute;left:50%;top:22px;width:190px;height:54px;margin-left:-95px;border-radius:30px;background:#000;z-index:45;overflow:hidden;display:flex;align-items:center;padding:0 18px;gap:16px}}
#di .dc{{width:0;height:0;border-radius:12px;background:{COV[0]};flex:none}}
#di .dt{{flex:1;opacity:0;white-space:nowrap}} #di .dt b{{display:block;font-size:24px}} #di .dt span{{font-size:19px;color:rgba(255,255,255,.6)}}
#di .dw{{display:flex;gap:4px;align-items:center;height:40px;opacity:0}}
.wvb{{display:block;width:5px;height:10px;border-radius:3px;background:#1ed760}}
.shot{{position:absolute;inset:0;opacity:0}}
/* 1 lock screen */
#s0{{background:radial-gradient(60% 40% at 20% 75%,#ff5a8a 0,transparent 70%),radial-gradient(60% 45% at 85% 30%,#5a6aff 0,transparent 70%),linear-gradient(180deg,#1a1440,#3a1a4a)}}
#date{{position:absolute;left:0;right:0;top:130px;text-align:center;font-size:30px;font-weight:600;color:rgba(255,255,255,.85)}}
#clk{{position:absolute;left:0;right:0;top:160px;text-align:center;font-size:190px;font-weight:700;letter-spacing:-.04em;color:rgba(255,255,255,.92)}}
#nt{{position:absolute;left:24px;right:24px;top:470px;height:170px;border-radius:36px;background:rgba(40,30,60,.55);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);display:flex;align-items:center;gap:22px;padding:0 26px;box-shadow:0 20px 50px rgba(0,0,0,.35);border:1.5px solid rgba(255,255,255,.12)}}
#nt .c{{width:118px;height:118px;border-radius:16px;background:{COV[0]};flex:none}}
#nt small{{display:block;font-size:20px;color:rgba(255,255,255,.65);letter-spacing:.06em;font-weight:600}}
#nt b{{display:block;font-size:34px;margin-top:4px}} #nt span{{display:block;font-size:24px;color:rgba(255,255,255,.7)}}
#nt .ctl{{margin-left:auto;font-size:44px}}
#tap{{position:absolute;width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.35);border:3px solid rgba(255,255,255,.7);left:270px;top:510px;opacity:0}}
#hb{{position:absolute;left:50%;bottom:16px;width:220px;height:8px;margin-left:-110px;border-radius:4px;background:rgba(255,255,255,.85);z-index:40}}
/* 2 now playing */
#s1{{background:linear-gradient(180deg,{BG[0]} 0%,#121212 75%)}}
#s1 .top{{position:absolute;left:0;right:0;top:100px;text-align:center;font-size:22px;letter-spacing:.14em;font-weight:700;color:rgba(255,255,255,.8)}}
#bc{{position:absolute;left:60px;top:170px;width:500px;height:500px;border-radius:14px;background:{COV[0]};box-shadow:0 30px 70px rgba(0,0,0,.5)}}
#bt{{position:absolute;left:60px;top:712px;font-size:46px;font-weight:800;letter-spacing:-.02em}} #ba{{position:absolute;left:60px;top:772px;font-size:28px;color:rgba(255,255,255,.65)}}
#lk{{position:absolute;right:60px;top:722px;width:52px;height:52px;border-radius:50%;border:3px solid rgba(255,255,255,.7);display:flex;align-items:center;justify-content:center;font-size:30px;color:#000}}
#pb{{position:absolute;left:60px;width:500px;top:850px;height:8px;border-radius:4px;background:rgba(255,255,255,.25)}} #pb i{{position:absolute;left:0;top:0;bottom:0;width:28%;background:#fff;border-radius:4px}}
#ct2{{position:absolute;left:60px;right:60px;top:910px;display:flex;justify-content:space-between;align-items:center;font-size:42px}}
#gp{{width:120px;height:120px;border-radius:50%;background:#1ed760;color:#000;display:flex;align-items:center;justify-content:center;font-size:52px;position:relative}}
#gp span{{position:absolute}}
#dev{{position:absolute;left:60px;top:1070px;font-size:22px;font-weight:700;color:#1ed760;display:flex;gap:10px;align-items:center}} #dev svg{{width:26px;height:26px}}
/* 3 swipe */
#s2{{background:{BG[1]}}}
#s2 .g{{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,#121212 80%)}}
#car{{position:absolute;left:60px;top:170px;height:500px;width:2600px}}
.cs{{position:absolute;top:0;width:500px;height:500px;border-radius:14px;box-shadow:0 30px 70px rgba(0,0,0,.5)}}
.ts{{position:absolute;left:60px;top:712px;opacity:0}} .ts b{{display:block;font-size:46px;font-weight:800;letter-spacing:-.02em}} .ts span{{display:block;font-size:28px;color:rgba(255,255,255,.65);margin-top:8px}}
#fg{{position:absolute;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.4);border:3px solid rgba(255,255,255,.8);top:400px;left:420px;opacity:0}}
#pb3{{position:absolute;left:60px;width:500px;top:850px;height:8px;border-radius:4px;background:rgba(255,255,255,.25)}} #pb3 i{{position:absolute;left:0;top:0;bottom:0;width:4%;background:#fff;border-radius:4px}}
#ct3{{position:absolute;left:60px;right:60px;top:910px;display:flex;justify-content:space-between;align-items:center;font-size:42px}}
#ct3 .gp{{width:120px;height:120px;border-radius:50%;background:#1ed760;color:#000;display:flex;align-items:center;justify-content:center;font-size:44px}}
/* 4 devices */
#s3{{background:linear-gradient(180deg,{BG[2]} 0%,#121212 75%)}}
#mini{{position:absolute;left:60px;top:170px;width:500px;height:500px;border-radius:14px;background:{COV[2]}}}
#shade{{position:absolute;inset:0;background:rgba(0,0,0,.55);opacity:0}}
#sheet{{position:absolute;left:0;right:0;bottom:0;height:560px;border-radius:40px 40px 0 0;background:#242424;padding:34px 40px}}
#sheet h4{{font-size:34px;font-weight:800;margin-bottom:26px}}
.dv{{display:flex;align-items:center;gap:22px;height:104px;border-radius:20px;padding:0 22px;font-size:30px;font-weight:600;color:#fff}}
.dv svg{{width:46px;height:46px}} .dv small{{display:block;font-size:20px;font-weight:600;color:#1ed760}}
#dv0{{color:#1ed760}}
#spk{{position:absolute;left:220px;top:300px;width:180px;height:180px;color:#1ed760;opacity:0}} #spk svg{{width:100%;height:100%}}
.rg{{position:absolute;left:310px;top:390px;width:200px;height:200px;margin:-100px 0 0 -100px;border-radius:50%;border:4px solid #1ed760;opacity:0}}
#pon{{position:absolute;left:0;right:0;top:720px;text-align:center;font-size:30px;font-weight:700;color:#1ed760;opacity:0}}
#pon b{{display:block;color:#fff;font-size:44px;margin-top:8px}}
/* 5 share */
#s4{{background:linear-gradient(180deg,{BG[3]} 0%,#121212 75%)}}
#sc{{position:absolute;left:60px;top:170px;width:500px;height:500px;border-radius:14px;background:{COV[3]};overflow:hidden}}
#scin{{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:30px;opacity:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.55))}}
#scin b{{font-size:44px;font-weight:800}} #scin span{{font-size:26px;color:rgba(255,255,255,.8)}}
#scin i{{position:absolute;left:30px;top:30px;font-style:normal;font-size:22px;font-weight:800;background:#1ed760;color:#000;border-radius:30px;padding:8px 18px}}
#bn{{position:absolute;left:24px;right:24px;top:-180px;height:130px;border-radius:32px;background:rgba(30,30,30,.85);backdrop-filter:blur(20px);display:flex;align-items:center;gap:20px;padding:0 26px;border:1.5px solid rgba(255,255,255,.1);z-index:30}}
#bn .ok{{width:72px;height:72px;border-radius:18px;background:#1ed760;color:#000;font-size:40px;font-weight:900;display:flex;align-items:center;justify-content:center}}
#bn b{{display:block;font-size:30px}} #bn span{{font-size:22px;color:rgba(255,255,255,.6)}}
#ring5{{position:absolute;left:170px;top:300px;width:280px;height:280px;border-radius:50%;padding:12px;background:conic-gradient(#ffd23d,#ff3d6e,#c13dff,#ffd23d);opacity:0}}
#ring5 .in{{width:100%;height:100%;border-radius:50%;border:8px solid #2a1a10;background:{COV[3]}}}
#yst{{position:absolute;left:0;right:0;top:610px;text-align:center;font-size:34px;font-weight:700;opacity:0}}
#shb{{position:absolute;left:50%;top:760px;transform:translateX(-50%);background:#fff;color:#000;font-weight:800;font-size:30px;border-radius:40px;padding:16px 40px;white-space:nowrap}}
#cta{{position:absolute;left:0;right:0;top:1580px;text-align:center;font-size:52px;font-weight:800;letter-spacing:-.02em}}
#cta b{{color:#1ed760}}
#handle{{position:absolute;left:50%;top:1690px;transform:translateX(-50%);font-size:30px;font-weight:600;color:rgba(255,255,255,.55)}}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920" data-motion-blur="off">
<div id="hdr">{SPARK}<span>Claude Code</span></div>
<div id="dl">Drawing</div>
<div id="paper">{sketches}</div>
<div id="ph">
 <div id="sb"><span>9:41</span><span>●●● ▮</span></div>
 <div id="di"><div class="dc"></div><div class="dt"><b>Blinding Lights</b><span>The Weeknd</span></div><div class="dw">{wv("a", 7)}</div></div>
 <div class="shot" id="s0"><div id="date">Tuesday, November 10</div><div id="clk">9:41</div>
  <div id="nt"><div class="c"></div><div><small>NOW PLAYING</small><b>Blinding Lights</b><span>The Weeknd</span></div><div class="ctl">❚❚</div></div><div id="tap"></div></div>
 <div class="shot" id="s1"><div class="top">PLAYING FROM YOUR LIBRARY</div><div id="bc"></div><div id="bt">{SONGS[0][0]}</div><div id="ba">{SONGS[0][1]}</div><div id="lk">✓</div>
  <div id="pb"><i></i></div><div id="ct2"><span>⇄</span><span>⏮</span><div id="gp"><span id="g1">▶</span><span id="g2" style="opacity:0">❚❚</span></div><span>⏭</span><span>↻</span></div>
  <div id="dev">{PHN}<span>This iPhone</span></div></div>
 <div class="shot" id="s2"><div class="g"></div><div id="car">{covs}</div>{tits}<div id="pb3"><i></i></div><div id="ct3"><span>⇄</span><span>⏮</span><div class="gp">❚❚</div><span>⏭</span><span>↻</span></div><div id="fg"></div></div>
 <div class="shot" id="s3"><div id="mini"></div><div id="shade"></div><div id="spk">{SPK}</div><div class="rg" id="rg0"></div><div class="rg" id="rg1"></div><div class="rg" id="rg2"></div>
  <div id="pon">Playing on<b>Living Room Speaker</b></div>
  <div id="sheet"><h4>Connect to a device</h4><div class="dv" id="dv0">{PHN}<div>This iPhone<small>Current device</small></div></div><div class="dv" id="dv1">{POD}<div>AirPods Pro</div></div><div class="dv" id="dv2">{SPK}<div>Living Room Speaker</div></div></div></div>
 <div class="shot" id="s4"><div id="sc"><div id="scin"><i>LISTENING NOW</i><b>Starboy</b><span>The Weeknd</span></div></div><div id="shb">Share to story ↗</div><div id="ring5"><div class="in"></div></div><div id="yst">Your story</div>
  <div id="bn"><div class="ok">✓</div><div><b>Shared to your story</b><span>just now</span></div></div></div>
 <div id="hb"></div>
</div>
<div id="cta">Comment “<b>SKETCH</b>” for the prompts</div>
<div id="handle">@theaitoolfinds</div>
<div id="grain"></div>
<audio id="mus" class="clip" src="assets/music.mp3" data-start="0" data-duration="{DUR}" data-track-index="21" data-volume="0.34"></audio>
<audio id="fx" class="clip" src="assets/sfx.wav" data-start="0" data-duration="{DUR}" data-track-index="22" data-volume="0.85"></audio>
</div>
<script>
window.__timelines=window.__timelines||{{}};
const SH={SH}, N={N}, DUR={DUR};
const COV={json.dumps(COV)}, BG={json.dumps(BG)};
const tl=gsap.timeline({{paused:true}}); const NI={{immediateRender:false}};
function F(s,a,b,t){{ return tl.fromTo(s,a,Object.assign({{}},b,NI),t); }}
tl.set('.shot',{{opacity:0}},0); tl.set('.skt',{{opacity:0}},0); tl.set('.sp',{{strokeDashoffset:1}},0); tl.set('.hw',{{opacity:0}},0);
for(let k=0;k<N;k++){{ const t=k*SH;
  F('#sk'+k,{{opacity:0}},{{opacity:1,duration:.01}},t+0.001); if(k) F('#sk'+(k-1),{{opacity:1}},{{opacity:0,duration:.01}},t+0.001);
  const ps=document.querySelectorAll('#sk'+k+' .sp'); const L=ps.length;
  ps.forEach((p,i)=>F(p,{{strokeDashoffset:1}},{{strokeDashoffset:0,duration:.2,ease:'power1.inOut'}},t+0.02+i*(0.55/L)));
  F('#sk'+k+' .hw',{{opacity:0}},{{opacity:1,duration:.2,stagger:.08}},t+0.22);
  F('#s'+k,{{opacity:0}},{{opacity:1,duration:k?0.14:0.01}},t);
  if(k<N-1) F('#s'+k,{{opacity:1}},{{opacity:0,duration:.14}},t+SH);
}}
F('#paper',{{rotation:-1.2}},{{rotation:1.2,duration:SH,yoyo:true,repeat:N,ease:'sine.inOut'}},0);
// waveform in the island (always alive once shown)
const WB=document.querySelectorAll('#di .wvb'); const WV={{x:0}};
F(WV,{{x:0}},{{x:1,duration:DUR,ease:'none',onUpdate:()=>{{ const q=WV.x*DUR; WB.forEach((b,i)=>{{ b.style.height=(8+30*Math.abs(Math.sin(i*1.3+q*9))*(0.4+0.6*Math.abs(Math.sin(i*0.5+q*3.1))))+'px'; }}); }}}},0);
// 1 lock screen: notification drops, island expands into a live activity, tap
let t=0;
F('#clk',{{opacity:0,scale:1.15}},{{opacity:1,scale:1,duration:.5,ease:'expo.out'}},t);
F('#nt',{{y:-520,scale:.9}},{{y:0,scale:1,duration:.55,ease:'back.out(1.3)'}},t+0.3);
F('#di',{{width:190,height:54,marginLeft:-95,borderRadius:30}},{{width:560,height:120,marginLeft:-280,borderRadius:48,duration:.55,ease:'back.out(1.6)'}},t+0.9);
F('#di .dc',{{width:0,height:0}},{{width:80,height:80,duration:.4,ease:'back.out(2)'}},t+1.05);
F(['#di .dt','#di .dw'],{{opacity:0}},{{opacity:1,duration:.25}},t+1.2);
F('#di',{{width:560,height:120,marginLeft:-280,borderRadius:48}},{{width:190,height:54,marginLeft:-95,borderRadius:30,duration:.4,ease:'power3.inOut'}},t+2.1);
F(['#di .dt','#di .dw'],{{opacity:1}},{{opacity:0,duration:.12}},t+2.1); F('#di .dc',{{width:80,height:80}},{{width:0,height:0,duration:.3}},t+2.1);
F('#tap',{{opacity:0,scale:1.4}},{{opacity:1,scale:.8,duration:.18}},t+2.35); F('#tap',{{opacity:1}},{{opacity:0,duration:.2}},t+2.6);
F('#nt',{{scale:1}},{{scale:.95,duration:.1,yoyo:true,repeat:1}},t+2.4);
F('#nt .c',{{scale:1,x:0,y:0}},{{scale:4.2,x:200,y:-40,duration:.4,ease:'power3.in'}},t+2.55);
// 2 now playing (cover grows from the notification)
t=SH; F('#bc',{{scale:.24,x:-150,y:300,borderRadius:40}},{{scale:1,x:0,y:0,borderRadius:14,duration:.55,ease:'expo.out'}},t);
F(['#s1 .top','#bt','#ba','#lk'],{{opacity:0,y:24}},{{opacity:1,y:0,duration:.35,stagger:.05,ease:'expo.out'}},t+0.2);
F(['#pb','#ct2','#dev'],{{opacity:0,y:30}},{{opacity:1,y:0,duration:.35,stagger:.05,ease:'expo.out'}},t+0.3);
F('#gp',{{scale:1}},{{scale:.85,duration:.08,yoyo:true,repeat:1}},t+1.0); F('#g1',{{opacity:1}},{{opacity:0,duration:.08}},t+1.05); F('#g2',{{opacity:0}},{{opacity:1,duration:.08}},t+1.05);
F('#pb i',{{width:'28%'}},{{width:'40%',duration:1.8,ease:'none'}},t+1.05);
F('#lk',{{background:'rgba(0,0,0,0)',borderColor:'rgba(255,255,255,.7)',scale:1}},{{background:'#1ed760',borderColor:'#1ed760',scale:1.25,duration:.25,ease:'back.out(3)'}},t+1.9);
F('#lk',{{scale:1.25}},{{scale:1,duration:.2}},t+2.15);
F('#bc',{{scale:1}},{{scale:1.03,duration:.9,yoyo:true,repeat:1,ease:'sine.inOut'}},t+1.0);
// 3 swipe through songs: carousel + bg colour + titles
t=2*SH; for(let i=0;i<4;i++) tl.set('#cs'+i,{{left:i*560}},0);
tl.set('#ts0',{{opacity:1}},t); tl.set('#s2',{{backgroundColor:BG[0]}},t);
for(let i=1;i<4;i++){{ const ti=t+0.3+(i-1)*0.8;
  F('#fg',{{opacity:.9,x:0}},{{opacity:0,x:-300,duration:.35,ease:'power2.in'}},ti-0.05);
  F('#car',{{x:-(i-1)*560}},{{x:-i*560,duration:.45,ease:'expo.inOut'}},ti);
  F('#s2',{{backgroundColor:BG[i-1]}},{{backgroundColor:BG[i],duration:.45}},ti);
  F('#ts'+(i-1),{{opacity:1,x:0}},{{opacity:0,x:-60,duration:.2}},ti+0.05);
  F('#ts'+i,{{opacity:0,x:60}},{{opacity:1,x:0,duration:.3,ease:'expo.out'}},ti+0.2);
  F('#pb3 i',{{width:'0%'}},{{width:'12%',duration:.6,ease:'none'}},ti+0.2); }}
tl.set('#s2',{{backgroundColor:BG[1]}},0);
// 4 switch device
t=3*SH; F('#sheet',{{y:600}},{{y:0,duration:.45,ease:'expo.out'}},t+0.15); F('#shade',{{opacity:0}},{{opacity:1,duration:.3}},t+0.15);
F(['#dv0','#dv1','#dv2'],{{opacity:0,y:20}},{{opacity:1,y:0,duration:.25,stagger:.06}},t+0.35);
F('#dv2',{{backgroundColor:'rgba(255,255,255,0)'}},{{backgroundColor:'rgba(30,215,96,.18)',color:'#1ed760',duration:.2}},t+1.15);
F('#dv0',{{color:'#1ed760'}},{{color:'#ffffff',duration:.2}},t+1.15);
F('#sheet',{{y:0}},{{y:600,duration:.4,ease:'power3.in'}},t+1.5);
F('#mini',{{opacity:1,scale:1}},{{opacity:.1,scale:.9,duration:.4}},t+1.5);
F('#spk',{{opacity:0,scale:.4}},{{opacity:1,scale:1,duration:.4,ease:'back.out(2)'}},t+1.75);
for(let i=0;i<3;i++) F('#rg'+i,{{opacity:.9,scale:.6}},{{opacity:0,scale:2.4,duration:1.0,ease:'power2.out'}},t+1.85+i*0.3);
F('#pon',{{opacity:0,y:20}},{{opacity:1,y:0,duration:.3,ease:'expo.out'}},t+1.95);
// 5 share to story
t=4*SH; F('#sc',{{scale:.9,opacity:0}},{{scale:1,opacity:1,duration:.35,ease:'expo.out'}},t);
F('#shb',{{opacity:0,y:20}},{{opacity:1,y:0,duration:.3}},t+0.2); F('#shb',{{scale:1}},{{scale:.9,duration:.08,yoyo:true,repeat:1}},t+0.75);
F('#sc',{{width:500,height:500,left:60,top:170,borderRadius:14}},{{width:380,height:676,left:120,top:150,borderRadius:28,duration:.5,ease:'expo.inOut'}},t+0.85);
F('#scin',{{opacity:0}},{{opacity:1,duration:.3}},t+1.15);
F('#shb',{{opacity:1}},{{opacity:0,duration:.2}},t+0.9);
F('#sc',{{x:0,y:0,rotation:0,scale:1}},{{x:260,y:-700,rotation:18,scale:.4,duration:.45,ease:'power3.in'}},t+1.6);
F('#bn',{{y:0}},{{y:250,duration:.5,ease:'back.out(1.5)'}},t+1.95);
F('#ring5',{{opacity:0,scale:.3}},{{opacity:1,scale:1,duration:.45,ease:'back.out(1.8)'}},t+2.15); F('#yst',{{opacity:0,y:20}},{{opacity:1,y:0,duration:.3}},t+2.3);
F('#ring5',{{rotation:0}},{{rotation:360,duration:2.5,ease:'none'}},t+2.15);
F('#cta',{{scale:1}},{{scale:1.06,duration:.3,yoyo:true,repeat:1,ease:'sine.inOut'}},t+2.4);
for(let k=0,q=0;q<DUR;k++,q=k/12){{ const sd=(k*7919)%997; tl.set('#grain',{{x:-(sd%256),y:-((sd*31)%256)}},q); }}
window.__timelines['main']=tl; tl.seek(0);
</script></body></html>'''
(W / "index.html").write_text(HTML)
print("ok", NAME, "dur", DUR)
