"""Hallmark - design skill that refuses to look AI-generated (creator & dev, Jan's pick, angle relatable-pain).
Facts: github.com/Nutlope/hallmark README (MIT, made by Together AI): "A design skill for Claude Code, Codex, Cursor and
OpenCode that refuses to look AI-generated"; "fifty themes"; it "deals three themes from a catalog of fifty"; it lints the
result in a real browser against tells such as "the eyebrow above every heading, tracked-capital labels, one coloured
word in a headline, ... an email sign-up at the end of every page"; "sloplint --render checks the page at eight widths";
"/hallmark redesign <path> rebuilds a page and keeps its content and wiring".
Media: README theme screenshots (docs/screenshots) and site/OG-hallmark.png. The "AI slop" page is drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "hallmark"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display={49: "", 50: "/hallmark"}, tail=1.0)
F.scenes([0, 6, 9, 20, 25, 30, 41, 44, 48, 52], hold=0.12)

SHOTS = ["atelier", "cobalt", "dose", "dusk", "furrow", "hedgerow", "hum", "refract", "ribbon", "studio", "terminal", "vantage"]

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.pg{position:absolute;border-radius:20px;overflow:hidden;background:#fff;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.32),0 16px 28px -12px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.05)}
.pg img{display:block;width:100%;height:auto}
.pg .bar{height:40px;background:#f1f1f0;display:flex;align-items:center;gap:9px;padding-left:18px}
.pg .bar i{width:11px;height:11px;border-radius:50%;background:#d0d0d0}
.slp{left:110px;top:300px;width:860px;padding:0}
.slp .in{padding:44px 50px 50px;text-align:center;background:linear-gradient(180deg,#fff,#f6f4ff)}
.slp .eb{display:inline-block;font-size:24px;font-weight:700;letter-spacing:.25em;color:#7c5cff;background:#efeaff;padding:8px 18px;border-radius:30px}
.slp .h{font-size:76px;font-weight:800;letter-spacing:-.04em;line-height:1.05;margin-top:26px;color:#111}
.slp .h em{font-style:normal;background:linear-gradient(90deg,#7c5cff,#d65cff);-webkit-background-clip:text;background-clip:text;color:transparent}
.slp .s{font-size:30px;color:#8a8a8a;margin-top:20px}
.slp .ctas{display:flex;justify-content:center;gap:18px;margin-top:30px}
.slp .ctas b{padding:20px 34px;border-radius:40px;font-size:28px;background:linear-gradient(90deg,#7c5cff,#d65cff);color:#fff}
.slp .ctas b.o{background:#fff;color:#111;box-shadow:0 0 0 2px #e4e0f5}
.slp .cards{display:flex;gap:16px;margin-top:34px}
.slp .cards u{flex:1;height:120px;border-radius:18px;background:#fff;box-shadow:0 10px 30px -10px rgba(124,92,255,.35)}
.ring{position:absolute;border:7px solid #ff4b1f;border-radius:50%;transform-origin:50% 50%}
.tag{position:absolute;background:#ff4b1f;color:#fff;font-weight:800;font-size:30px;padding:8px 18px;border-radius:12px;white-space:nowrap;box-shadow:0 20px 30px -12px rgba(255,75,31,.6)}
#stamp{position:absolute;left:250px;top:700px;border:12px solid #ff4b1f;color:#ff4b1f;font-weight:900;font-size:150px;letter-spacing:-.03em;padding:6px 40px;border-radius:24px;transform:rotate(-10deg);
 background:rgba(235,235,234,.85)}
#og{left:110px;top:330px;width:860px}
#c1,#c2,#c3{font-size:42px;padding:16px 30px 16px 18px;gap:14px}#c1 b,#c2 b,#c3 b{width:56px;height:56px;font-size:26px}
#free{position:absolute;left:720px;top:290px;background:#ff4b1f;color:#fff;font-weight:800;font-size:60px;padding:10px 28px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#fifty{position:absolute;left:0;right:0;top:470px;text-align:center;font-size:330px;font-weight:800;letter-spacing:-.07em;line-height:1;color:#111}
.gt{position:absolute;width:240px;height:150px;border-radius:12px;overflow:hidden;box-shadow:0 20px 30px -12px rgba(0,0,0,.3)}
.gt img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.chk{position:absolute;left:560px;width:450px;background:#141414;color:#fff;border-radius:18px;padding:16px 22px;font-size:27px;font-weight:600;display:flex;gap:14px;align-items:center;
 box-shadow:0 30px 50px -16px rgba(0,0,0,.45)}
.chk b{width:38px;height:38px;border-radius:50%;background:#ff4b1f;display:flex;align-items:center;justify-content:center;font-size:24px;flex:none}
.chk b.ok{background:#2e9e4a}
.bw{position:absolute;top:470px;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 30px 50px -16px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.06)}
.bw .bar{height:22px;background:#f1f1f0}
.bw .vp{position:relative;height:300px;overflow:hidden}
.bw .vp img{position:absolute;left:0;top:0;height:100%;width:auto}
#wn{position:absolute;left:0;right:0;top:330px;text-align:center;font-family:var(--mono);font-weight:700;font-size:40px;color:#ff4b1f}
#old{left:200px;top:330px;width:680px;height:560px;padding:0}
#old .in{padding:40px;font-family:'Times New Roman',serif;color:#00e;font-size:40px}
#old .in p{color:#111;font-size:26px;margin-top:18px}
#old .in blink{display:inline-block;margin-top:30px;background:#ff0;color:#000;padding:8px 16px;font-size:30px}
.tm{left:90px;width:900px}
.tm .body{padding:30px 38px;font-size:38px;line-height:1.55}
.tm .p{color:#ff4b1f}.tm .d{color:#8a8a8a}.tm .g{color:#7ddc8a}

"""

def pg(pid, src, x, y, w, bar=True):
    return (f'<div id="{pid}" class="pg" style="left:{x}px;top:{y}px;width:{w}px">'
            + ('<div class="bar"><i></i><i></i><i></i></div>' if bar else '') + f'<img src="assets/{src}" alt=""></div>')

SLOP = ('<div id="slop" class="pg slp"><div class="bar"><i></i><i></i><i></i></div><div class="in">'
        '<div class="eb" id="eb">✦ INTRODUCING</div><div class="h">Build faster<br>with <em id="em">AI</em></div>'
        '<div class="s">The all-in-one platform for modern teams.</div>'
        '<div class="ctas"><b id="cta1">Get started</b><b class="o">Learn more</b></div>'
        '<div class="cards"><u></u><u></u><u></u></div></div></div>')

# S0 a typical AI-built page, already on screen; ring around the one coloured word
F.clip(0, SLOP + '<div class="ring" id="r0" style="left:545px;top:515px;width:180px;height:118px"></div>'
       + F.block([[(0, 0, ""), (1, 2, "hl")], [(3, 5, "")]], top=1080, size=96))
# S1 more tells + AI SLOP stamp
F.clip(1, SLOP.replace('id="slop"', 'id="slop1"').replace('id="eb"', 'id="eb1"').replace('id="em"', 'id="em1"').replace('id="cta1"', 'id="ct1"')
                    + '<div class="tag" id="t1" style="left:120px;top:360px">eyebrow</div><div class="tag" id="t2" style="left:690px;top:470px">1 colored word</div>'
          + '<div class="tag" id="t3" style="left:140px;top:610px">gradient CTA</div><div id="stamp">AI SLOP</div>'
       + F.block([[(6, 6, ""), (7, 8, "hl")]], top=1100, size=120))
# S2 Hallmark + free + harness chips
F.clip(2, pg("og", "og.png", 110, 330, 860, bar=False) + '<div id="free">FREE</div>'
          + chip("c1", "Claude Code", 60, 830, "✳", "#d97757") + chip("c2", "Codex", 420, 830, "◎", "#111") + chip("c3", "Cursor", 680, 830, "▲", "#111")
       + F.block([[(9, 13, "")], [(14, 16, "")], [(17, 19, "b")]], top=1000, size=80))
# S3 a real page built with it
F.clip(3, pg("p3", "atelier.jpg", 90, 340, 900)
       + F.block([[(20, 22, "")], [(23, 24, "hl")]], top=1060, size=92))
# S4 fifty themes
F.clip(4, "".join(f'<div class="gt" id="g{k}" style="left:{40 + (k % 4) * 255}px;top:{320 + (k // 4) * 175}px"><img src="assets/{n}.jpg" alt=""></div>'
                  for k, n in enumerate(SHOTS))
          + '<div id="fifty">50</div>'
       + F.block([[(25, 27, "")], [(28, 29, "hl")]], top=1080, size=100))
# S5 real-browser lint
F.clip(5, pg("p5", "dusk.jpg", 70, 340, 620)
          + "".join(f'<div class="chk" id="k{k}" style="top:{420 + k * 110}px"><b class="{c}">{m}</b>{t}</div>'
                    for k, (c, m, t) in enumerate([("", "✕", "eyebrow above heading"), ("", "✕", "one colored word"),
                                                   ("", "✕", "sign-up on every page"), ("ok", "✓", "contrast + focus")]))
       + F.block([[(30, 33, "")], [(34, 37, "b")], [(38, 40, "hl")]], top=1000, size=80))
# S6 eight widths
F.clip(6, '<div id="wn">8 widths</div>' + "".join(
    f'<div class="bw" id="bw{k}" style="left:{x}px;width:{w}px"><div class="bar"></div><div class="vp"><img src="assets/furrow.jpg" alt=""></div></div>'
    for k, (x, w) in enumerate([(40, 300), (300, 230), (490, 180), (630, 140), (735, 110), (815, 90), (880, 75), (930, 60)]))
       + F.block([[(41, 41, ""), (42, 43, "hl")]], top=1080, size=110))
# S7 an old site
F.clip(7, '<div id="old" class="pg"><div class="bar"><i></i><i></i><i></i></div><div class="in"><u>Welcome to my homepage!!!</u>'
          '<p>Best viewed in 1024×768. Last updated 2009.</p><blink>NEW!</blink></div></div>'
       + F.block([[(44, 47, "b")]], top=1100, size=92))
# S8 /hallmark redesign -> after
F.clip(8, '<div id="t8" class="term tm" style="top:320px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> <span id="t8c"></span></div><div class="d" id="t8d">● keeps content + wiring <span class="g">✓</span></div></div></div>'
          + pg("after", "ribbon.jpg", 240, 560, 600)
       + F.block([[(48, 48, "")], [(49, 51, "hl")]], top=1080, size=96))
# S9 CTA
F.clip(9, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(52, 52, ""), (53, 53, "hl")], [(54, 59, "")]], top=1020, size=84))

S = F.S
for i in (2, 8, 12, 16, 19, 24, 29, 37, 40, 43, 47, 51, 53):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.05;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
// S0 slop page present, ring draws around "AI"
ft('#slop',{opacity:1,y:40,scale:.97},{opacity:1,y:0,scale:1,duration:1,ease:A},0);
ft('#r0',{opacity:0,scale:2,rotation:-20},{opacity:1,scale:1,rotation:0,duration:.45,ease:'back.out(2)'},S[1]-0.05);
tl.to('#em',{scale:1.15,duration:.3,ease:'back.out(3)',transformOrigin:'50% 60%',display:'inline-block'},S[2]);
tl.to(['#slop','#r0'],{opacity:0,duration:.01},ST[1]-0.01);
// S1 tags fly in, stamp slams
['#t1','#t2','#t3'].forEach((s,k)=>popIn(s,ST[1]+0.05+k*0.18,{y:30,s:.5,r:[-8,6,-4][k]}));
ft('#stamp',{opacity:0,scale:2.6,rotation:-25,filter:'blur(10px)'},{opacity:1,scale:1,rotation:-10,filter:'blur(0px)',duration:.35,ease:'back.out(2.2)'},S[7]-0.05);
tl.to('#slop1',{filter:'grayscale(1) blur(2px)',opacity:.6,duration:.3},S[7]);
outUp(['#slop1','#t1','#t2','#t3','#stamp'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 hallmark OG + chips
ft('#og',{opacity:0,y:200,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.8,ease:A},ST[2]+0.02);
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[12]-0.05);
popIn('#c1',S[15]-0.15,{y:60,s:.6,r:-6}); popIn('#c2',S[17]-0.15,{y:60,s:.6,r:6}); popIn('#c3',S[19]-0.15,{y:60,s:.6,r:-4});
outUp(['#og','#free','#c1','#c2','#c3'],ST[3]);
// S3 real page rises, slow push
ft('#p3',{opacity:0,y:220,rotationX:28,transformPerspective:1600,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.8,ease:A},ST[3]+0.02);
tl.to('#p3',{scale:1.04,duration:Math.max(.4,ST[4]-ST[3]-.8),ease:'none'},ST[3]+0.8);
outUp('#p3',ST[4]);
// S4 grid then 50
for(let k=0;k<12;k++) ft('#g'+k,{opacity:0,scale:.5,y:40},{opacity:1,scale:1,y:0,duration:.45,ease:'back.out(1.6)'},ST[4]+0.02+k*0.04);
tl.to(Array.from({length:12},(_,k)=>'#g'+k),{opacity:.12,filter:'blur(5px)',duration:.3},S[28]-0.45);
ft('#fifty',{opacity:0,scale:2.2,filter:'blur(30px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.5,ease:A},S[28]-0.15);
outUp([...Array.from({length:12},(_,k)=>'#g'+k),'#fifty'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S5 page + checks
popIn('#p5',ST[5]+0.02,{y:80,s:.9,r:-3});
[0,1,2,3].forEach(k=>ft('#k'+k,{opacity:0,x:120,filter:'blur(8px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.4,ease:A},S[34]+k*0.3));
outUp(['#p5','#k0','#k1','#k2','#k3'],ST[6]);
// S6 eight widths cascade
ft('#wn',{opacity:0,y:-20},{opacity:1,y:0,duration:.3},ST[6]+0.05);
for(let k=0;k<8;k++) ft('#bw'+k,{opacity:0,y:120,scale:.8},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(1.6)'},ST[6]+0.05+k*0.08);
outUp(['#wn',...Array.from({length:8},(_,k)=>'#bw'+k)],ST[7]);
// S7 old site wobbles in
ft('#old',{opacity:0,rotation:-8,y:100,scale:.85},{opacity:1,rotation:-3,y:0,scale:1,duration:.55,ease:'back.out(1.8)'},ST[7]+0.02);
outUp('#old',ST[8]);
starPass('#st3',ST[8]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S8 redesign
popIn('#t8',ST[8]+0.02,{y:60,s:.94,r:0}); typeIn('t8c','/hallmark redesign ./site',ST[8]+0.2,.04);
ft('#t8d',{opacity:0},{opacity:1,duration:.2},S[51]);
ft('#after',{opacity:0,y:160,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.7,ease:A},S[51]-0.1);
outUp(['#t8','#after'],ST[9]);
cta('HALLMARK',S[53]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[59]+0.15);
tl.to('#typed',{color:'#ff4b1f',duration:.2},S[59]+0.25);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
