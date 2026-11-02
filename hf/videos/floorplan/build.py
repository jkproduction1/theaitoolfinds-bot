"""Floorplan - Claude Code / Codex plugin that draws your app as an interactive map in plain English (creator & dev,
angle relatable-pain).
Facts: github.com/haydenschmitty/floorplan README (MIT, v0.6.1): "Claude or Codex reads your codebase and draws an
interactive map of it. Every part, file and web request gets a plain-English name"; "You built an app, probably with a
lot of help from AI, and it works. But ask 'what happens when someone checks out?' ... the honest answer is no idea";
Ask the map: "'How does a refund reach the customer's card?' comes back as an answer plus a mini-map ... with a
step-by-step walkthrough"; Health check "keys in the code or sent to the browser, ... endpoints with no sign-in. Each
comes with a ready-to-paste fix"; installs as a Claude Code plugin and in Codex; "runs on the plan you already have,
with no API keys". Free = MIT open source.
Media: README screenshots docs/images (overview, ask, health, flow) of the Brewline demo app, cropped. Rest drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "floorplan"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", tail=1.0)
F.scenes([0, 4, 9, 18, 27, 37, 41, 50, 54], hold=0.12)

FILES = [("checkout.ts", 90, 360, -6), ("api/pay.js", 600, 330, 5), ("utils_final2.ts", 330, 520, 3), ("useCart.tsx", 70, 700, 4),
         ("webhook.ts", 640, 640, -5), ("db.ts", 420, 820, -3), ("config.ts", 760, 860, 7)]

CSS = r"""
#s0 #w0,#s0 #w1{opacity:1!important;filter:none!important}
.sh{position:absolute;border-radius:20px;overflow:hidden;background:#141414;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.40),0 16px 28px -12px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.08)}
.sh img{display:block;width:100%;height:auto}
.fc{position:absolute;background:#fff;border-radius:18px;padding:18px 26px;font-family:var(--mono);font-weight:700;font-size:34px;white-space:nowrap;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.28),0 10px 20px -8px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.04)}
.fc::before{content:'';display:inline-block;width:22px;height:28px;border:4px solid #111;border-radius:4px;margin-right:16px;vertical-align:-4px}
#mess{position:absolute;left:0;top:0;width:1080px;height:1000px}
#mess path{fill:none;stroke:#ff4b1f;stroke-width:5;stroke-linecap:round;opacity:.8}
#q{position:absolute;left:0;right:0;top:300px;text-align:center;font-family:var(--serif);font-style:italic;font-size:600px;line-height:1;color:#111}
#logo{position:absolute;left:390px;top:300px;width:300px;display:flex;align-items:center;gap:20px;font-weight:800;font-size:60px;letter-spacing:-.04em}
#logo img{width:90px;height:auto}
#free{position:absolute;left:700px;top:340px;background:#ff4b1f;color:#fff;font-weight:800;font-size:64px;padding:10px 30px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#c1,#c2{font-size:54px}
#ask{position:absolute;left:90px;top:320px;width:900px;height:120px;border-radius:60px;background:#1b1b1b;color:#f2f2f2;display:flex;align-items:center;padding:0 40px;font-size:36px;font-weight:500;
 box-shadow:0 40px 70px -20px rgba(0,0,0,.45)}
#ask .ph{color:#777;margin-right:10px}
#askc{display:inline-block;width:4px;height:44px;background:#ff4b1f;margin-left:6px}
.num{position:absolute;width:76px;height:76px;border-radius:50%;background:#ff4b1f;color:#fff;font-weight:800;font-size:40px;display:flex;align-items:center;justify-content:center;
 box-shadow:0 20px 30px -10px rgba(255,75,31,.6)}
.warn{position:absolute;left:70px;width:560px;background:#fff;border-radius:22px;padding:24px 28px;font-size:36px;font-weight:700;letter-spacing:-.02em;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.28),0 0 0 3px #ff4b1f}
.warn small{display:block;font-family:var(--mono);font-size:26px;color:#8a8a8a;font-weight:600;margin-top:8px}
.warn b{color:#ff4b1f}
#ep{position:absolute;left:110px;top:360px;width:860px;background:#141414;color:#eee;border-radius:30px;padding:40px 44px;font-family:var(--mono);
 box-shadow:0 60px 90px -20px rgba(0,0,0,.45)}
#ep .m{display:inline-block;background:#ff4b1f;color:#fff;border-radius:10px;padding:4px 16px;font-weight:800;font-size:36px;margin-right:18px}
#ep .p{font-size:44px;font-weight:700}
#ep .l{margin-top:26px;font-size:32px;color:#9a9a9a}
#ep .l b{color:#ff4b1f}
#fix{position:absolute;left:560px;top:690px;background:#fff;border-radius:999px;padding:22px 40px;font-weight:800;font-size:40px;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
#fix i{font-style:normal;color:#d97757;margin-right:12px}
#lock{position:absolute;left:150px;top:640px;width:200px;height:200px;padding:40px}
"""

def sh(pid, src, x, y, w):
    return f'<div id="{pid}" class="sh" style="left:{x}px;top:{y}px;width:{w}px"><img src="assets/{src}" alt=""></div>'

MESS = ('<svg id="mess" viewBox="0 0 1080 1000">'
        '<path id="m1" d="M250 400 C 600 300, 200 700, 700 380"/><path id="m2" d="M760 370 C 900 600, 300 500, 240 740"/>'
        '<path id="m3" d="M480 560 C 700 900, 900 500, 800 690"/><path id="m4" d="M200 740 C 500 1000, 600 600, 900 900"/>'
        '<path id="m5" d="M500 860 C 200 600, 900 300, 470 560"/></svg>')
FC = "".join(f'<div class="fc" id="fc{k}" style="left:{x}px;top:{y}px;transform:rotate({r}deg)">{n}</div>' for k, (n, x, y, r) in enumerate(FILES))

# S0 tangle of AI-written files + red wires, already on screen
F.clip(0, MESS + FC + F.block([[(0, 1, "b"), (2, 3, "hl")]], top=1110, size=112))
# S1 no idea: files blur away, giant ?
F.clip(1, '<div id="q">?</div>' + F.block([[(4, 5, "hl"), (6, 8, "")]], top=1110, size=104))
# S2 Floorplan draws the map
F.clip(2, '<div id="logo"><img src="assets/fp-logo.png" alt="">Floorplan</div>' + sh("map", "c-map.jpg", 70, 440, 940)
       + F.block([[(9, 9, "b"), (10, 12, ""), (13, 14, "hl")], [(15, 17, "it")]], top=1140, size=84))
# S3 free plugin, Claude Code + Codex
F.clip(3, sh("st", "c-stats.jpg", 340, 330, 400) + '<div id="free">FREE</div>'
          + chip("c1", "Claude Code", 80, 790, "✳", "#d97757") + chip("c2", "Codex", 640, 790, "◎", "#111")
       + F.block([[(18, 21, "")], [(22, 26, "b")]], top=1060, size=88))
# S4 ask the map
F.clip(4, '<div id="ask"><span class="ph" id="aph">Ask:</span><span id="askt"></span><span id="askc"></span></div>' + sh("ans", "c-ask.jpg", 90, 480, 900)
       + F.block([[(27, 29, "hl")], [(30, 36, "")]], top=1100, size=82))
# S5 traces every step
F.clip(5, sh("flow", "c-map.jpg", 70, 380, 940) + "".join(f'<div class="num" id="n{k}" style="left:{x}px;top:{y}px">{k + 1}</div>'
                                                          for k, (x, y) in enumerate([(120, 420), (420, 600), (760, 470), (800, 800)]))
       + F.block([[(37, 38, ""), (39, 40, "hl")]], top=1120, size=110))
# S6 health check: keys left in your code
F.clip(6, sh("hc", "c-health.jpg", 700, 300, 310)
          + '<div class="warn" id="wa1" style="top:380px">🔑 secret key<small>config.ts</small></div>'
          + '<div class="warn" id="wa2" style="top:600px"><b>●</b> 2 things need attention<small>Health check</small></div>'
       + F.block([[(41, 43, ""), (44, 45, "hl")], [(46, 49, "")]], top=1110, size=84))
# S7 endpoints anyone can call
F.clip(7, '<div id="ep"><span class="m">POST</span><span class="p">/internal/renew</span><div class="l"><b>●</b> no sign-in check</div></div>'
          + '<div id="fix"><i>✳</i>Fix with Claude</div>'
       + F.block([[(50, 50, "b")], [(51, 53, "hl")]], top=1060, size=104))
# S8 CTA
F.clip(8, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(54, 54, ""), (55, 55, "hl")], [(56, 61, "")]], top=1020, size=84))

S = F.S
for i in (4, 9, 14, 20, 23, 27, 39, 43, 51, 55):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.05;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
// S0 messy files present at t=0, wires draw, slow drift
document.querySelectorAll('#mess path').forEach((p,k)=>{ const L=p.getTotalLength(); p.style.strokeDasharray=L;
  ft(p,{strokeDashoffset:L*0.35},{strokeDashoffset:0,duration:1.2,ease:'power2.out'},0.05+k*0.12); });
for(let k=0;k<7;k++){ ft('#fc'+k,{opacity:1,y:0},{opacity:1,y:(k%2?-18:18),duration:ST[1],ease:'none'},0); }
tl.to(['#mess',...Array.from({length:7},(_,k)=>'#fc'+k)],{opacity:0,scale:.8,filter:'blur(16px)',duration:.25,ease:IN,stagger:.02},ST[1]-0.25);
// S1 giant question mark
ft('#q',{opacity:0,scale:2,rotation:-20,filter:'blur(30px)'},{opacity:1,scale:1,rotation:0,filter:'blur(0px)',duration:.5,ease:'back.out(1.6)'},ST[1]+0.02);
tl.to('#q',{rotation:8,duration:.25,ease:'power1.inOut',yoyo:true,repeat:3},ST[1]+0.6);
outUp('#q',ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 logo + map rises with depth, slow push
ft('#logo',{opacity:0,y:-30,filter:'blur(10px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.5,ease:A},ST[2]+0.02);
ft('#map',{opacity:0,y:240,rotationX:30,transformPerspective:1600,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.85,ease:A},ST[2]+0.1);
tl.to('#map',{scale:1.05,duration:Math.max(.4,ST[3]-ST[2]-.95),ease:'none'},ST[2]+0.95);
outUp(['#logo','#map'],ST[3]);
// S3 stats card + FREE + chips
popIn('#st',ST[3]+0.02,{y:80,s:.8,r:-4});
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[20]-0.08);
popIn('#c1',S[23]-0.15,{y:60,s:.6,r:-6}); popIn('#c2',S[26]-0.15,{y:60,s:.6,r:6});
outUp(['#st','#free','#c1','#c2'],ST[4]);
// S4 ask bar types, answer panel rises
ft('#ask',{opacity:0,y:60,scale:.94},{opacity:1,y:0,scale:1,duration:.5,ease:A},ST[4]+0.02);
typeIn('askt','How does a refund reach the card?',S[30]-0.05,.035);
ft('#ans',{opacity:0,y:200,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.7,ease:A},S[35]-0.1);
outUp(['#ask','#ans'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S5 numbered steps pop along the map
ft('#flow',{opacity:0,scale:.92,filter:'blur(12px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.5,ease:A},ST[5]+0.02);
[0,1,2,3].forEach(k=>popIn('#n'+k,ST[5]+0.25+k*0.22,{y:20,s:.3,r:0}));
outUp(['#flow','#n0','#n1','#n2','#n3'],ST[6]);
// S6 health panel + warnings
ft('#hc',{opacity:0,x:200,rotationY:-25,transformPerspective:1400},{opacity:1,x:0,rotationY:0,duration:.7,ease:A},ST[6]+0.02);
ft('#wa1',{opacity:0,x:-140,filter:'blur(8px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.45,ease:A},S[44]-0.1);
ft('#wa2',{opacity:0,x:-140,filter:'blur(8px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.45,ease:A},S[44]+0.3);
outUp(['#hc','#wa1','#wa2'],ST[7]);
// S7 open endpoint + fix button
popIn('#ep',ST[7]+0.02,{y:80,s:.9,r:-2});
popIn('#fix',S[52]-0.1,{y:40,s:.5,r:6});
outUp(['#ep','#fix'],ST[8]);
starPass('#st3',ST[8]-0.3,[900,1500,0],[760,1460,50],8,1.2);
cta('FLOORPLAN',S[55]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[61]+0.15);
ft(['#w0','#w1'],{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
