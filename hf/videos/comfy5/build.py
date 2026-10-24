"""5 ComfyUI shortcuts (pillar: listicle). Facts: github.com/Comfy-Org/ComfyUI README "Shortcuts" table
(Double-Click = node quick search palette; Ctrl+B bypass = node acts removed, wires reconnected through; Ctrl+M mute;
Ctrl+Enter queue; Ctrl+Shift+Enter queue as first) and Features ("recover complete workflows and seeds from supported
generated media", "Runs fully offline"). License GPL-3.0. All visuals drawn in code (node graph), no screenshots."""
import sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile

W = HERE.parent.parent / "work" / "comfy5"
DISP = {21: "Ctrl", 33: "Ctrl", 38: "Ctrl"}
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display=DISP)
F.scenes([0, 6, 11, 20, 32, 37, 51, 67, 74])

CSS = r"""
.node{position:absolute;width:300px;border-radius:22px;background:#fff;overflow:hidden;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.3),0 10px 20px -8px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.05)}
.node .hd{height:62px;background:#111;color:#fff;font-weight:700;font-size:30px;display:flex;align-items:center;padding-left:24px;letter-spacing:-.02em}
.node .rw{height:46px;margin:14px 22px;border-radius:12px;background:#f0f0f0;font-family:var(--mono);font-size:24px;color:#7a7a7a;display:flex;align-items:center;padding-left:16px}
.node.acc .hd{background:#ff4b1f}
.wires{position:absolute;left:0;top:0}
#menu{left:650px;top:330px;width:340px;padding:18px 0}
#menu div{font-size:32px;font-weight:600;padding:14px 30px;color:#444}
#menu div.on{background:#111;color:#fff}
#cur{position:absolute;width:56px;height:56px}
.num{position:absolute;left:0;right:0;top:250px;text-align:center;font-size:130px;font-weight:800;letter-spacing:-.05em;line-height:1}
.num span{color:#ff4b1f}
#five{position:absolute;left:0;right:0;top:300px;text-align:center;font-size:520px;font-weight:800;letter-spacing:-.07em;line-height:1}
#pal{left:170px;top:470px;width:740px;padding:24px 0 16px}
#pal .in{margin:0 26px 14px;height:80px;border-radius:40px;background:#f0f0f0;display:flex;align-items:center;padding-left:30px;font-size:36px;font-weight:600}
#pal .in b{color:#ff4b1f;margin-right:14px}
#pal .it{font-size:34px;padding:14px 44px;color:#555;font-family:var(--mono)}
#pal .it.on{background:#111;color:#fff}
.rip{position:absolute;width:120px;height:120px;border-radius:50%;border:6px solid #ff4b1f;opacity:0}
.keys{position:absolute;left:0;right:0;top:420px;text-align:center}
.plus{display:inline-block;font-size:70px;font-weight:300;color:#9a9a9a;vertical-align:middle}
.key{min-width:130px;height:130px;font-size:48px}
#q{left:240px;top:600px;width:600px;padding:20px 0}
#q .qi{display:flex;align-items:center;gap:20px;font-family:var(--mono);font-size:32px;padding:12px 36px}
#q .qi i{width:22px;height:22px;border-radius:50%;background:#cfcfcf}
#q .qi.new{color:#ff4b1f;font-weight:700}#q .qi.new i{background:#ff4b1f}
#img{left:360px;top:420px;width:360px;height:360px;border-radius:30px;overflow:hidden;padding:0}
#img .art{position:absolute;inset:0;background:radial-gradient(60% 60% at 30% 30%,#ffb199,transparent 70%),radial-gradient(70% 70% at 75% 70%,#ff4b1f,transparent 70%),linear-gradient(160deg,#ffe9e0,#ffd0c0)}
#img .art::after{content:'';position:absolute;left:28%;top:28%;width:44%;height:44%;border-radius:50%;background:#111;box-shadow:inset -20px -20px 0 #333}
#seed{position:absolute;left:310px;top:560px;font-family:var(--mono);font-weight:700;font-size:40px;background:#111;color:#fff;padding:16px 34px;border-radius:40px;box-shadow:0 30px 50px -16px rgba(0,0,0,.45)}
"""


def node(nid, title, rows, x, y, acc=False, w=300):
    r = "".join(f'<div class="rw">{t}</div>' for t in rows)
    return f'<div id="{nid}" class="node{" acc" if acc else ""}" style="left:{x}px;top:{y}px;width:{w}px"><div class="hd">{title}</div>{r}</div>'


def wire(wid, x1, y1, x2, y2, col="#111"):
    c = (x2 - x1) * .5
    return f'<path id="{wid}" d="M{x1} {y1} C{x1 + c} {y1} {x2 - c} {y2} {x2} {y2}" stroke="{col}" pathLength="1"/>'


def svg(paths):
    return f'<svg class="wires" width="1080" height="1100" fill="none" stroke-width="6" stroke-linecap="round">{paths}</svg>'


def num(n):
    return f'<div id="n{n}" class="num"><span>#</span>{n}</div>'


def keys(kid, labels):
    inner = '<span class="plus">+</span>'.join(f'<span id="{kid}{i}" class="key">{l}</span>' for i, l in enumerate(labels))
    return f'<div id="{kid}" class="keys">{inner}</div>'


CURSOR = '<svg id="cur" viewBox="0 0 40 40"><path d="M6 4l26 14-12 3-5 12z" fill="#111" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></svg>'

# S0 graph + a menu being clicked through
F.clip(0, '<div id="g0">' + svg(wire("w01", 320, 470, 360, 680) + wire("w02", 320, 520, 360, 730))
       + node("a0", "Load Checkpoint", ["model", "clip"], 40, 380, w=280) + node("b0", "KSampler", ["steps 20", "cfg 7"], 360, 640, w=260) + '</div>'
       + '<div id="menu" class="card"><div>Add Node ›</div><div class="on" id="mo">sampling ›</div><div>loaders ›</div><div>image ›</div><div>latent ›</div></div>'
       + CURSOR
       + F.block([[(0, 3, "")], [(4, 4, ""), (5, 5, "hl")]], top=1040, size=86))
F.clip(1, '<div id="five">5</div>' + F.block([[(6, 6, ""), (7, 8, "b")], [(9, 10, "hl")]], top=1060, size=88))
F.clip(2, num(1) + '<div id="rp1" class="rip" style="left:480px;top:420px"></div><div id="rp2" class="rip" style="left:480px;top:420px"></div>'
       + '<div id="pal" class="card"><div class="in"><b>⌕</b><span id="ty"></span></div>'
         '<div class="it on">KSampler</div><div class="it">KSamplerAdvanced</div><div class="it">SamplerCustom</div></div>'
       + F.block([[(11, 11, "it"), (12, 12, "b"), (13, 14, "")], [(15, 16, "hl"), (17, 19, "")]], top=1020, size=78))
F.clip(3, num(2) + keys("k2", ["Ctrl", "B"])
       + '<div id="g3">' + svg(wire("w31", 300, 700, 780, 700, "#ff4b1f"))
       + node("a3", "Loader", ["model"], 40, 640, w=260) + node("b3", "Upscale", ["×2"], 400, 640, w=280) + node("c3", "Save", ["image"], 780, 640, w=260) + '</div>'
       + F.block([[(20, 20, "it"), (21, 22, "b"), (23, 25, "hl")], [(26, 31, "")]], top=1030, size=76))
F.clip(4, num(3) + keys("k3", ["Ctrl", "M"]) + node("m4", "Upscale", ["muted"], 390, 650, w=300)
       + F.block([[(32, 32, "it"), (33, 34, "b"), (35, 36, "hl")]], top=1060, size=84))
F.clip(5, num(4) + keys("k4", ["Ctrl", "Enter"]) + '<span id="k4s" class="key" style="position:absolute;left:60px;top:420px">Shift</span>'
       + '<div id="q" class="card"><div class="qi new" id="qn"><i></i>your graph  → first</div><div class="qi" id="qa"><i></i>job #12</div><div class="qi" id="qb"><i></i>job #13</div></div>'
       + F.block([[(37, 37, "it"), (38, 39, "b"), (40, 40, "hl"), (41, 42, "")], [(43, 44, "b"), (45, 50, "")]], top=1020, size=74))
F.clip(6, num(5) + '<div id="img" class="card"><div class="art"></div></div>'
       + '<div id="g6">' + svg(wire("w61", 330, 500, 400, 640) + wire("w62", 680, 690, 750, 520))
       + node("a6", "Load Checkpoint", ["model"], 40, 400, w=290) + node("b6", "KSampler", ["seed 802114"], 390, 600, w=300, acc=True)
       + node("c6", "Save Image", ["png"], 750, 420, w=290) + '</div><div id="seed">seed 802114</div>'
       + F.block([[(51, 51, "it"), (52, 56, "")], [(57, 58, "b"), (59, 61, "")], [(62, 64, "hl")], [(65, 66, "b")]], top=975, size=70))
F.clip(7, tile("t1", "free", 100, 420, 250, acc=True) + tile("t2", "branch", 415, 420, 250) + tile("t3", "local", 730, 420, 250)
       + F.block([[(67, 67, "hl"), (68, 69, "b")], [(70, 72, ""), (73, 73, "it")]], top=1020, size=86))
F.clip(8, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(74, 74, ""), (75, 75, "hl")], [(76, 81, "")]], top=1020, size=84))

S = F.S
for i in (7, 12, 22, 34, 39, 44, 52, 63, 67, 75):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t){ const el=document.getElementById(id), O={n:0};
  ft(O,{n:0},{n:txt.length,duration:.05*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
function numIn(n,t){ ft('#n'+n,{opacity:0,y:-40,scale:1.4,filter:'blur(18px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.45,ease:A},t); }
function keyPress(sel,t){ tl.to(sel,{y:12,boxShadow:'0 2px 0 #c9c9c9,0 20px 40px -16px rgba(0,0,0,.35)',duration:.07,ease:'power2.in'},t);
  tl.to(sel,{y:0,boxShadow:'0 14px 0 #c9c9c9,0 40px 60px -16px rgba(0,0,0,.35)',duration:.2,ease:'power2.out'},t+0.08); }
function draw(sel,t,d){ ft(sel,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:d||.5,ease:'power2.out'},t); }
// S0 graph visible at t=0, menu + cursor clicking
ft(['#a0','#b0'],{y:30,scale:.97},{y:0,scale:1,duration:1.2,ease:A,stagger:.08},0);
draw('#w01',0,.8); draw('#w02',0.1,.8);
ft('#menu',{opacity:1,x:40,scale:.96},{opacity:1,x:0,scale:1,duration:1.0,ease:A},0);
ft('#cur',{x:820,y:420},{x:760,y:470,duration:.6,ease:IO},0);
tl.to('#cur',{x:700,y:560,duration:.5,ease:IO},S[2]);
tl.to('#cur',{scale:.8,duration:.06,yoyo:true,repeat:1},S[3]);
tl.to('#mo',{backgroundColor:'#ff4b1f',duration:.1},S[3]);
tl.to(['#g0','#menu','#cur'],{scale:.7,opacity:0,filter:'blur(16px)',duration:.3,ease:IN},ST[1]-0.3);
// S1 big 5
ft('#five',{opacity:0,scale:2.2,filter:'blur(30px)',rotation:-8},{opacity:1,scale:1,filter:'blur(0px)',rotation:0,duration:.6,ease:A},S[7]-0.12);
tl.to('#five',{opacity:0,y:-120,filter:'blur(16px)',duration:.25,ease:IN},ST[2]-0.25);
starPass('#st1',ST[2]-0.35,[700,-650,0],[430,-360,40],10,1.2);
// items numbers
[[2,1],[3,2],[4,3],[5,4],[6,5]].forEach(([sc,n])=>{ numIn(n,ST[sc]+0.02); tl.to('#n'+n,{opacity:0,y:-40,filter:'blur(12px)',duration:.22,ease:IN},ST[sc+1]-0.22); });
// #1 double click -> palette
['#rp1','#rp2'].forEach((s,k)=>ft(s,{opacity:1,scale:.2},{opacity:0,scale:1.6,duration:.5,ease:'power2.out'},S[12]+k*0.16));
popIn('#pal',S[13],{y:60,s:.9,r:0}); typeIn('ty','KSamp',S[16]);
ft('#pal .it',{opacity:0,x:-30},{opacity:1,x:0,duration:.35,ease:A,stagger:.07},S[17]);
outUp('#pal',ST[3]);
// #2 Ctrl+B bypass: middle node fades, wire passes through
popIn('#k20',S[21]-0.1,{y:40,s:.8,r:0}); popIn('#k21',S[22]-0.1,{y:40,s:.8,r:0}); keyPress('#k20',S[23]); keyPress('#k21',S[23]+0.05);
ft('#k2 .plus',{opacity:0},{opacity:1,duration:.2},S[21]);
['#a3','#b3','#c3'].forEach((s,k)=>popIn(s,ST[3]+0.1+k*0.1,{y:60,s:.85,r:0}));
tl.to('#b3',{opacity:.25,scale:.92,filter:'blur(2px)',duration:.4,ease:A},S[24]);
draw('#w31',S[28],.6);
outUp(['#k2','#g3'],ST[4]);
// #3 Ctrl+M mute
popIn('#k30',ST[4]+0.05,{y:40,s:.8,r:0}); popIn('#k31',S[34]-0.1,{y:40,s:.8,r:0}); keyPress('#k30',S[35]); keyPress('#k31',S[35]+0.05);
popIn('#m4',ST[4]+0.15,{y:60,s:.85,r:0});
tl.to('#m4',{opacity:.35,filter:'grayscale(1)',duration:.35,ease:A},S[35]+0.1);
outUp(['#k3','#m4'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// #4 Ctrl+Enter queue, Shift = first
popIn('#k40',S[38]-0.1,{y:40,s:.8,r:0}); popIn('#k41',S[39]-0.1,{y:40,s:.8,r:0}); keyPress('#k40',S[40]); keyPress('#k41',S[40]+0.05);
popIn('#q',S[40],{y:60,s:.9,r:0});
ft('#qn',{opacity:0,y:120},{opacity:1,y:0,duration:.6,ease:'back.out(1.6)'},S[47]);
ft(['#qa','#qb'],{y:-60},{y:0,duration:.6,ease:A},S[47]);
tl.to('#k4',{x:90,duration:.4,ease:A},S[44]-0.15);
popIn('#k4s',S[44]-0.1,{y:40,s:.8,r:0}); keyPress('#k4s',S[45]);
outUp(['#k4','#k4s','#q'],ST[6]);
// #5 image -> workflow unfolds
popIn('#img',ST[6]+0.05,{y:80,s:.8,r:-8});
tl.to('#img',{scale:.35,y:180,opacity:0,filter:'blur(8px)',duration:.45,ease:IN},S[59]);
['#a6','#b6','#c6'].forEach((s,k)=>ft(s,{opacity:0,scale:.3,x:[320,0,-320][k],y:[40,-120,40][k]},{opacity:1,scale:1,x:0,y:0,duration:.7,ease:'back.out(1.4)'},S[60]+k*0.08));
draw('#w61',S[62]); draw('#w62',S[62]+0.1);
ft('#seed',{opacity:0,y:60,scale:.6},{opacity:1,y:180,scale:1,duration:.5,ease:'back.out(2)'},S[65]-0.1);
outUp(['#g6','#seed'],ST[7]);
// S7 free / open / offline
popIn('#t1',S[67]-0.1); popIn('#t2',S[68]-0.1); popIn('#t3',S[72]-0.1);
outUp(['#t1','#t2','#t3'],ST[8]);
starPass('#st3',ST[8]-0.3,[900,1500,0],[580,1290,50],8,1.2);
cta('COMFY',S[75]);
"""
F.write(CSS, JS, music_vol=0.10)
