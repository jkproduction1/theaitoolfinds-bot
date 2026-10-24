"""REA v3 - Paper house style: every scene = visual + animated text block, subtle SFX. Writes index.html + assets/sfx.wav"""
import json, html, math, wave
import numpy as np

TOK = open("script.txt").read().split()
VW = json.load(open("assets/voice.json"))
assert len(VW) == len(TOK)
S = [round(w["start"], 3) for w in VW]
DUR = round(VW[-1]["end"] + 1.6, 2)

# scene = (first word, visual id)
SC = [0, 13, 23, 26, 34, 47, 60, 65, 74]
ST = [0.0] + [round(S[i] - 0.15, 2) for i in SC[1:]]
EN = ST[1:] + [DUR]

SFX = []  # (time, kind)

# ---------- text blocks ----------
def block(n, groups, top=1080, size=72, bid=""):
    """groups: list of lines; each line list of (i0,i1,style). style: '', 'b', 'it', 'hl'"""
    out = [f'<div {("id="+chr(34)+bid+chr(34)) if bid else ""} class="tb" style="top:{top}px;font-size:{size}px">']
    for line in groups:
        out.append('<div class="tl">')
        for i0, i1, st in line:
            txt = " ".join(html.escape(TOK[i]) for i in range(i0, i1 + 1))
            if st == "hl":
                out.append(f'<span id="h{i0}" class="hl" data-a="{i0}" data-b="{i1}"><span>{txt}</span></span> ')
                SFX.append((S[i0] - 0.02, "click"))
            else:
                for i in range(i0, i1 + 1):
                    out.append(f'<span id="w{i}" class="w {st}">{html.escape(TOK[i])}</span> ')
        out.append('</div>')
    out.append('</div>')
    return "".join(out)

ICON = {
 "desk": '<rect x="14" y="20" width="72" height="50" rx="7"/><path d="M14 32h72"/><path d="M40 84h20M50 70v14"/>',
 "web": '<circle cx="50" cy="50" r="34"/><path d="M16 50h68M50 16c-14 18-14 50 0 68M50 16c14 18 14 50 0 68"/>',
 "apk": '<rect x="30" y="12" width="40" height="76" rx="9"/><path d="M44 78h12"/>',
 "free": '<path d="M20 50l28-28h30v30L50 80z"/><circle cx="64" cy="36" r="5"/>',
 "branch": '<circle cx="30" cy="24" r="8"/><circle cx="30" cy="76" r="8"/><circle cx="70" cy="40" r="8"/><path d="M30 32v36M70 48c0 14-22 14-36 22"/>',
 "local": '<rect x="18" y="24" width="64" height="42" rx="6"/><path d="M10 76h80"/><path d="M42 45l6 6 12-12"/>',
 "shield": '<path d="M50 12l32 12v24c0 20-14 34-32 40-18-6-32-20-32-40V24z"/><path d="M36 50l10 10 18-20"/>',
}
def tile(tid, icon, x, y, s=230, acc=False):
    col = "#ff4b1f" if acc else "#111"
    return (f'<div id="{tid}" class="tile" style="left:{x}px;top:{y}px;width:{s}px;height:{s}px">'
            f'<svg viewBox="0 0 100 100" fill="none" stroke="{col}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">{ICON[icon]}</svg></div>')

css = r"""
:root{--paper:#ebebea;--ink:#111;--mid:#6f6f6f;--soft:#b3b3b3;--acc:#ff4b1f;--sans:'Inter',sans-serif;--serif:'EB Garamond',serif;--mono:'JetBrains Mono',monospace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--paper)}
#root{position:relative;width:100%;height:100%;font-family:var(--sans);color:var(--ink);overflow:hidden;background:var(--paper)}
.layer{position:absolute;inset:0}
#grid{position:absolute;left:-200px;top:-200px;width:1480px;height:2320px;
 background-image:linear-gradient(90deg,rgba(0,0,0,.065) 1.5px,transparent 1.5px),linear-gradient(0deg,rgba(0,0,0,.065) 1.5px,transparent 1.5px);background-size:120px 120px;
 -webkit-mask-image:radial-gradient(60% 45% at 50% 42%,#000 25%,transparent 75%);mask-image:radial-gradient(60% 45% at 50% 42%,#000 25%,transparent 75%)}
#vig{background:radial-gradient(120% 80% at 50% 45%,rgba(0,0,0,0) 60%,rgba(0,0,0,.10) 100%)}
#grain{position:absolute;left:-256px;top:-256px;width:1592px;height:2432px;opacity:.06;mix-blend-mode:multiply;background:url(assets/noise.png) repeat}
#handle{position:absolute;left:50%;top:1560px;transform:translateX(-50%);background:var(--acc);color:#fff;font-weight:700;font-size:34px;padding:12px 34px;border-radius:40px;box-shadow:0 10px 30px rgba(255,75,31,.35)}
.star{position:absolute;width:760px;height:760px}.star svg{width:100%;height:100%}
/* text block */
.tb{position:absolute;left:70px;right:70px;text-align:center;letter-spacing:-.035em;line-height:1.12;font-weight:500}
.tl{display:block}
.w{display:inline-block;opacity:0;color:var(--ink)}
.b{font-weight:800}
.it{font-family:var(--serif);font-style:italic;font-weight:500;letter-spacing:-.005em;font-size:1.08em}
.acc{color:var(--acc)}
.hl{display:inline-block;position:relative;font-weight:700;color:#fff;margin-top:.12em}
.hl>span{display:inline-block;background:var(--ink);padding:.02em .22em .06em;box-shadow:0 14px 26px -10px rgba(0,0,0,.45)}
/* visuals */
.card{position:absolute;border-radius:30px;background:#fff;box-shadow:0 60px 90px -20px rgba(0,0,0,.28),0 18px 30px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04)}
.dark{background:#141414}
#app .bar{height:60px;border-bottom:1.5px solid #ececec;display:flex;align-items:center;gap:12px;padding-left:28px}
#app .dot{width:15px;height:15px;border-radius:50%;background:#e2e2e2}
.row{position:absolute;left:44px;height:22px;border-radius:11px;background:#efefef}
#feat{position:absolute;left:44px;top:100px;width:340px;height:86px;border-radius:22px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:34px}
#feat i{display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--acc);margin-right:16px}
#xray{position:absolute;border-radius:30px;overflow:hidden;background:#0d0d0d}
#xray img{position:absolute;left:-300px;top:-140px;width:1350px;height:auto}
#lens{position:absolute;left:0;top:0;width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:50%;border:10px solid #fff;box-shadow:0 30px 60px rgba(0,0,0,.35),0 0 0 2px rgba(0,0,0,.08)}
#lens::after{content:'';position:absolute;right:-88px;bottom:-56px;width:130px;height:32px;border-radius:16px;background:#fff;transform:rotate(45deg);box-shadow:0 20px 30px rgba(0,0,0,.25)}
#code{overflow:hidden}
#code img{position:absolute;left:-40px;top:-30px;width:1150px;height:auto}
#code .tab{position:absolute;left:0;right:0;top:0;height:54px;background:#1c1c1c;border-bottom:1px solid #2a2a2a;font-family:var(--mono);font-size:22px;color:#8a8a8a;padding:14px 26px;z-index:2}
#rea{position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:800;font-size:400px;letter-spacing:-.06em;line-height:1}
#rea .ch{display:inline-block}
#reaSub{position:absolute;left:0;right:0;top:850px;text-align:center;font-size:38px;font-weight:600;letter-spacing:.32em;color:var(--mid)}
.chip{position:absolute;display:flex;align-items:center;gap:22px;background:#fff;border-radius:999px;padding:22px 42px 22px 24px;font-weight:700;font-size:54px;letter-spacing:-.03em;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.28),0 10px 20px -8px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.04);white-space:nowrap}
.chip b{width:74px;height:74px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:36px;font-weight:800}
.tile{position:absolute;border-radius:52px;background:linear-gradient(160deg,#ffffff,#f1f1f1);box-shadow:0 50px 70px -22px rgba(0,0,0,.30),0 12px 22px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04);padding:46px}
.tile svg{width:100%;height:100%}
#game{overflow:hidden}
#gcv{position:absolute;inset:0;width:820px;height:520px}
#count{position:absolute;left:0;right:0;top:470px;text-align:center;font-weight:800;font-size:290px;letter-spacing:-.06em;font-variant-numeric:tabular-nums}
#ok{position:absolute;left:470px;top:810px;width:140px;height:140px;border-radius:50%;background:var(--ink)}
#ok svg{position:absolute;inset:30px}
#field{position:absolute;left:110px;top:760px;width:860px;height:130px;border-radius:70px;background:#fff;box-shadow:0 40px 70px -20px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05);display:flex;align-items:center;padding-left:54px;font-size:50px;font-weight:500;color:#9a9a9a}
#typed{color:var(--ink);font-weight:800;margin-left:14px}
#caret{display:inline-block;width:5px;height:58px;background:var(--acc);margin-left:6px}
#send{position:absolute;right:20px;top:20px;width:90px;height:90px;border-radius:50%;background:var(--ink)}
#send::after{content:'';position:absolute;left:34px;top:26px;border-left:30px solid #fff;border-top:19px solid transparent;border-bottom:19px solid transparent}
#heart{position:absolute;left:300px;top:420px;width:480px;text-align:center;font-weight:800;font-size:250px;letter-spacing:-.06em;line-height:1}
"""

STAR = ('<svg viewBox="-100 -100 200 200"><path fill="#111" d="' + " ".join(
    ("M" if k == 0 else "L") + f"{(98 if k%2==0 else 30)*math.cos(k*math.pi/8-1.5708):.1f} {(98 if k%2==0 else 30)*math.sin(k*math.pi/8-1.5708):.1f}" for k in range(16)) + 'Z"/></svg>')

H = []; add = H.append
add('<div class="layer"><div id="grid"></div></div>')
def clip(n, inner, extra=0.0):
    add(f'<div id="s{n}" class="clip layer" data-start="{ST[n]}" data-duration="{round(EN[n]-ST[n]+extra,2)}" data-track-index="{n+1}">{inner}</div>')

rows = "".join(f'<div class="row" style="top:{y}px;width:{w}px"></div>' for y, w in [(230,600),(280,470),(350,660),(400,510)])
clip(0, '<div id="appW" class="layer"><div id="app" class="card" style="left:150px;top:380px;width:780px;height:520px">'
        '<div class="bar"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>'
        f'<div style="position:absolute;top:60px;left:0;right:0;bottom:0">{rows}<div id="feat"><i></i>Smart search</div></div></div>'
        '<div id="xray" style="left:150px;top:380px;width:780px;height:520px"><img src="assets/rea-hopper.jpg" alt=""></div><div id="lens"></div></div>'
        + block(0, [[(0,3,"")], [(4,6,""),(7,8,"it")], [(9,12,"b")]], top=1010, size=78))
clip(1, '<div id="code" class="card dark" style="left:110px;top:330px;width:860px;height:600px"><div class="tab">your-favorite-app · binary</div><img src="assets/rea-hopper.jpg" alt=""></div>'
        + block(1, [[(13,17,"")], [(18,19,"hl"),(20,22,"")]], top=1030, size=80))
clip(2, '<div id="rea"><span class="ch" id="c0">R</span><span class="ch" id="c1">E</span><span class="ch" id="c2">A</span></div>'
        '<div id="reaSub">REVERSE ENGINEER ANYTHING</div>'
        + block(2, [[(23,24,""),(25,25,"b")]], top=1060, size=84))
chips = [("cc","Claude Code","#d97757","C",160,380),("cx","Codex","#111","&gt;_",380,560),("cu","Cursor","#2b2b2b","◢",250,740)]
clip(3, "".join(f'<div id="{c}" class="chip" style="left:{x}px;top:{y}px"><b style="background:{col}">{g}</b>{nm}</div>' for c,nm,col,g,x,y in chips)
        + block(3, [[(26,28,"")], [(29,30,"b"),(31,32,""),(33,33,"b")]], top=1040, size=80), extra=0.0)
clip(4, tile("t1","desk",95,420) + tile("t2","web",425,380) + tile("t3","apk",755,420)
        + '<div id="lbls" class="layer" style="font-weight:700;font-size:36px;letter-spacing:-.02em">'
          '<div id="lb1" style="position:absolute;left:95px;width:230px;top:690px;text-align:center">desktop</div>'
          '<div id="lb2" style="position:absolute;left:425px;width:230px;top:650px;text-align:center">web</div>'
          '<div id="lb3" style="position:absolute;left:755px;width:230px;top:690px;text-align:center">APK</div></div>'
        + block(4, [[(34,38,"")], [(39,42,"")], [(43,46,"hl")]], top=900, size=78))
clip(5, '<div id="game" class="card dark" style="left:130px;top:360px;width:820px;height:520px"><canvas id="gcv" width="820" height="520"></canvas></div>'
        '<div id="count">0</div><div id="ok"><svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"><path id="okp" d="M20 52l20 20 40-44"/></svg></div>'
        + block(5, [[(47,52,"")], [(53,54,"b")]], top=1020, size=76, bid="tb5a")
        + block(5, [[(55,57,"")], [(58,59,"hl")]], top=1020, size=84))
clip(6, tile("f1","free",95,430,acc=True) + tile("f2","branch",425,430) + tile("f3","local",755,430)
        + block(6, [[(60,60,"b"),(61,62,"it")], [(63,64,"hl")]], top=1010, size=92))
clip(7, tile("sh","shield",405,420,270)
        + block(7, [[(65,69,"")], [(70,73,"b")]], top=1020, size=76))
clip(8, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
        + block(8, [[(74,74,""),(75,75,"hl")], [(76,81,"")]], top=1020, size=86))

add(f'<div id="stars" class="layer"><div id="st1" class="star">{STAR}</div><div id="st2" class="star">{STAR}</div><div id="st3" class="star">{STAR}</div></div>')
add('<div id="vig" class="layer"></div><div id="grain"></div><div id="handle">@theaitoolfinds</div>')
add(f'<audio id="vo" class="clip" src="assets/voice.mp3" data-start="0" data-duration="{round(VW[-1]["end"]+0.05,2)}" data-track-index="20" data-volume="1"></audio>')
add(f'<audio id="mus" class="clip" src="assets/music.mp3" data-start="0" data-duration="{DUR}" data-track-index="21" data-volume="0.11"></audio>')
add(f'<audio id="fx" class="clip" src="assets/sfx.wav" data-start="0" data-duration="{DUR}" data-track-index="22" data-volume="1"></audio>')

# scene-change and pop SFX (times mirrored in JS below)
for n in range(1, len(ST)):
    SFX.append((ST[n] - 0.05, "whoosh"))
for t in [S[3], S[29], S[31], S[33], S[37]-.1, S[39]-.1, S[41]-.1, S[60]-.05, S[61]-.05, S[63]-.05, S[65], S[75]+0.15]:
    SFX.append((t, "pop"))
for k in range(3):
    SFX.append((S[75] + 0.55 + k * 0.15, "tick"))

js = r"""
const S=__S__, ST=__ST__, EN=__EN__, DUR=__DUR__;
const tl=gsap.timeline({paused:true}); const A='expo.out', IO='power2.inOut', IN='power3.in';
const seen=new Set(); function ft(t,f,to,p){ if(seen.has(t)) to.immediateRender=false; seen.add(t); return tl.fromTo(t,f,to,p); }
const R=(a,b)=>Array.from({length:b-a+1},(_,k)=>a+k);
// text: each word rises from light grey; highlight boxes wipe in like a typed label
document.querySelectorAll('.w').forEach(el=>{ const i=+el.id.slice(1);
  ft(el,{opacity:0,y:16,color:'#b9b9b9',filter:'blur(6px)'},{opacity:1,y:0,color:'',filter:'blur(0px)',duration:.32,ease:A},S[i]-0.04); });
document.querySelectorAll('.hl').forEach(el=>{ const a=+el.dataset.a, b=+el.dataset.b; const d=Math.max(.25,(S[b]-S[a])+.25);
  ft(el,{clipPath:'inset(-20% 100% -20% 0)'},{clipPath:'inset(-20% 0% -20% 0)',duration:d,ease:'power2.out'},S[a]-0.04);
  ft(el,{scale:.92},{scale:1,duration:.4,ease:'back.out(2)'},S[a]-0.04); });
// every scene's text leaves together with a soft blur, just before the next scene
function sceneOut(n,sel){ if(n>=ST.length-1) return; tl.to(sel,{opacity:0,y:-24,filter:'blur(12px)',duration:.22,ease:IN,stagger:.01},ST[n+1]-0.22); }
for(let n=0;n<ST.length;n++) sceneOut(n,'#s'+n+' .tb');

ft('#grid',{x:0,y:0},{x:-120,y:-240,duration:DUR,ease:'none'},0);
tl.set('#st1,#st2,#st3',{opacity:0},0.001);
function starPass(id,t,from,to,blur){ ft(id,{x:from[0],y:from[1],rotation:from[2],filter:`blur(${blur}px)`,opacity:1},{x:to[0],y:to[1],rotation:to[2],duration:.75,ease:IO},t); }
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10); starPass('#st2',ST[2]-0.3,[-700,1750,0],[-440,1450,-35],4);
tl.to('#st1',{x:900,y:-800,duration:.5,ease:IN},ST[3]-0.2); tl.to('#st2',{x:-800,y:1950,duration:.5,ease:IN},ST[3]-0.2);
starPass('#st3',ST[6]-0.3,[900,1500,0],[580,1290,50],8); tl.to('#st3',{x:1000,y:1750,duration:.5,ease:IN},ST[7]-0.2);

// S0 app + lens x-ray
ft('#app',{y:60,rotationX:10,scale:.95},{y:0,rotationX:0,scale:1,duration:1.0,ease:A},0);
ft('#feat',{scale:.85},{scale:1,duration:.5,ease:'back.out(2)'},S[3]-0.1);
tl.set('#lens',{x:300,y:560,scale:.3,opacity:0},0.001); tl.set('#xray',{clipPath:'circle(0px at 150px 180px)'},0.001);
const L0=S[7]-0.25;
tl.to('#lens',{scale:1,opacity:1,duration:.45,ease:A},L0); tl.to('#xray',{clipPath:'circle(140px at 150px 180px)',duration:.45,ease:A},L0);
tl.to('#lens',{x:700,y:700,duration:.8,ease:IO},L0+0.5); tl.to('#xray',{clipPath:'circle(140px at 550px 320px)',duration:.8,ease:IO},L0+0.5);
tl.to('#lens',{x:9*0+520,y:640,duration:.5,ease:IO},L0+1.35); tl.to('#xray',{clipPath:'circle(140px at 370px 260px)',duration:.5,ease:IO},L0+1.35);
tl.to('#lens',{scale:6,opacity:0,duration:.45,ease:IN},ST[1]-0.42); tl.to('#xray',{clipPath:'circle(900px at 370px 260px)',duration:.45,ease:IN},ST[1]-0.42);
tl.to('#app',{scale:1.25,filter:'blur(10px)',opacity:0,duration:.45,ease:IN},ST[1]-0.42);
// S1 code card: match-cut from the x-ray, then the code scrolls under the camera
ft('#code',{scale:1.18,opacity:0},{scale:1,opacity:1,duration:.55,ease:A},ST[1]);
ft('#code img',{y:0},{y:-360,duration:ST[2]-ST[1],ease:'none'},ST[1]);
tl.to('#code',{y:-80,scale:.9,opacity:0,filter:'blur(12px)',duration:.32,ease:IN},ST[2]-0.3);
// S2 REA
[['#c0',-260,-200,-25],['#c1',40,260,18],['#c2',300,-140,30]].forEach(([c,x,y,r],k)=>
  ft(c,{x:x,y:y,rotation:r,opacity:0,filter:'blur(30px)',scale:1.4},{x:0,y:0,rotation:0,opacity:1,filter:'blur(0px)',scale:1,duration:.7,ease:A},S[25]-0.25+k*0.05));
ft('#reaSub',{opacity:0,y:20,filter:'blur(8px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.5,ease:A},S[25]+0.25);
tl.to(['#rea','#reaSub'],{y:-140,opacity:0,filter:'blur(16px)',duration:.3,ease:IN},ST[3]-0.28);
// S3 chips
[['#cc',29],['#cx',31],['#cu',33]].forEach(([c,i])=>ft(c,{opacity:0,scale:.4,y:60,rotation:-6},{opacity:1,scale:1,y:0,rotation:0,duration:.6,ease:'back.out(1.6)'},S[i]-0.08));
tl.to(['#cc','#cx','#cu'],{x:-200,opacity:0,filter:'blur(14px)',duration:.25,ease:IN,stagger:.03},ST[4]-0.25);
// S4 tiles
[['#t1','#lb1',37],['#t2','#lb2',39],['#t3','#lb3',41]].forEach(([t,l,i])=>{
  ft(t,{opacity:0,y:80,scale:.7,rotation:-8},{opacity:1,y:0,scale:1,rotation:0,duration:.6,ease:'back.out(1.5)'},S[i]-0.12);
  ft(l,{opacity:0,y:14},{opacity:1,y:0,duration:.35,ease:A},S[i]+0.05); });
tl.to(['#t1','#t2','#t3','#lbls'],{y:-60,opacity:0,filter:'blur(14px)',duration:.25,ease:IN,stagger:.03},ST[5]-0.25);
// S5 game -> count
ft('#game',{y:80,scale:.92,opacity:0},{y:0,scale:1,opacity:1,duration:.7,ease:A},ST[5]+0.05);
const cv=document.getElementById('gcv'), g=cv.getContext('2d');
function bounce(x,L){x=((x%(2*L))+2*L)%(2*L);return x<=L?x:2*L-x;}
function draw(t){ g.fillStyle='#141414'; g.fillRect(0,0,820,520);
  const bx=50+bounce(t*560+100,720), by=210+bounce(t*450,230);
  for(let r=0;r<4;r++)for(let c=0;c<8;c++){const id=r*8+c,hit=.3+((id*7)%32)*.08; if(t>hit&&r>1)continue;
    g.fillStyle=['#ff4b1f','#ff8a5c','#f1f1f1','#bdbdbd'][r]; g.fillRect(62+c*88,60+r*40,80,30);}
  const px=Math.min(650,Math.max(40,bx-80)); g.fillStyle='#fff'; g.fillRect(px,470,160,18);
  g.beginPath(); g.arc(bx,by,14,0,7); g.fill();
  const pan=(bx-50)/720;
  [[24,1-pan],[796,pan]].forEach(([sx,v],k)=>{ g.strokeStyle='rgba(255,75,31,'+(.2+.8*v)+')'; g.lineWidth=5;
    for(let j=1;j<=3;j++){const r=18+j*22*v; g.beginPath(); k?g.arc(sx,370,r,Math.PI-.9,Math.PI+.9):g.arc(sx,370,r,-.9,.9); g.stroke();}});
  g.fillStyle='#9a9a9a'; g.font='600 24px JetBrains Mono'; g.textAlign='center';
  g.fillText('PAN  L '+Math.round((1-pan)*100)+'  ·  R '+Math.round(pan*100),410,440); }
const GT={t:0}; ft(GT,{t:0},{t:3.4,duration:3.4,ease:'none',onUpdate:()=>draw(GT.t)},ST[5]); draw(0);
// the first text block of S5 leaves when "and passed all" starts
tl.to('#tb5a .w',{opacity:0,y:-20,filter:'blur(10px)',duration:.2,ease:IN,stagger:.01},S[55]-0.2);
tl.to('#game',{opacity:0,y:-60,filter:'blur(14px)',duration:.3,ease:IN},S[55]-0.2);
const C={v:0}, cEl=document.getElementById('count');
ft('#count',{opacity:0,scale:.8,filter:'blur(16px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.4,ease:A},S[56]);
ft(C,{v:0},{v:3205,duration:1.4,ease:'expo.out',onUpdate:()=>{cEl.textContent=Math.round(C.v).toLocaleString('en-US')}},S[56]);
ft('#ok',{opacity:0,scale:.4},{opacity:1,scale:1,duration:.45,ease:'back.out(2)'},S[59]-0.05);
ft('#okp',{strokeDasharray:110,strokeDashoffset:110},{strokeDashoffset:0,duration:.35,ease:A},S[59]+0.05);
tl.to(['#count','#ok'],{opacity:0,filter:'blur(14px)',duration:.22,ease:IN},ST[6]-0.22);
// S6 tiles
[['#f1',60],['#f2',61],['#f3',63]].forEach(([t,i])=>ft(t,{opacity:0,y:80,scale:.7,rotation:-8},{opacity:1,y:0,scale:1,rotation:0,duration:.6,ease:'back.out(1.5)'},S[i]-0.1));
tl.to(['#f1','#f2','#f3'],{y:-60,opacity:0,filter:'blur(14px)',duration:.22,ease:IN,stagger:.03},ST[7]-0.22);
// S7 shield
ft('#sh',{opacity:0,scale:.6,rotation:-10},{opacity:1,scale:1,rotation:0,duration:.7,ease:'back.out(1.6)'},S[65]-0.05);
tl.to('#sh',{opacity:0,scale:.9,filter:'blur(12px)',duration:.22,ease:IN},ST[8]-0.22);
// S8 CTA
ft('#field',{opacity:0,y:60,scale:.94},{opacity:1,y:0,scale:1,duration:.6,ease:A},ST[8]+0.05);
const ty=document.getElementById('typed'), TY={n:0};
ft(TY,{n:0},{n:3,duration:.45,ease:'steps(3)',onUpdate:()=>{ty.textContent='REA'.slice(0,Math.round(TY.n))}},S[75]+0.55);
for(let t=S[75]+1.2;t<DUR-0.2;t+=0.6){ tl.set('#caret',{opacity:0},t); tl.set('#caret',{opacity:1},t+0.3); }
tl.to('#send',{scale:1.15,duration:.15,ease:'power2.out'},S[79]); tl.to('#send',{scale:1,duration:.25,ease:'power2.out'},S[79]+0.15);
ft('#handle',{opacity:0,y:20},{opacity:1,y:0,duration:.5,ease:A},0.15);
for(let k=0,t=0;t<DUR;k++,t=k/12){ const sd=(k*7919)%997; tl.set('#grain',{x:-(sd%256),y:-((sd*31)%256)},t); }
window.__timelines['main']=tl; tl.seek(0);
"""
js = (js.replace("__S__", json.dumps(S)).replace("__ST__", json.dumps(ST)).replace("__EN__", json.dumps(EN)).replace("__DUR__", str(DUR)))

doc = f"""<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920">
<script src="assets/gsap.min.js"></script><style>{css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920" data-motion-blur="on">
{"".join(H)}
</div><script>{js}</script></body></html>"""
open("index.html", "w").write(doc)

# ---------- SFX: soft, felt more than heard ----------
SR = 44100
buf = np.zeros(int((DUR + 1) * SR))
rng = np.random.default_rng(3)
def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)
def lp(x, k):  # crude one-pole low-pass
    y = np.zeros_like(x); acc = 0.0; a = 1 - k
    for i in range(len(x)):
        acc = a * acc + k * x[i]; y[i] = acc
    return y
def put(t, x, g):
    i = int(max(0, t) * SR); buf[i:i + len(x)] += x[:len(buf) - i] * g
def click():
    n = int(.035 * SR); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 1800 * t) * env(n, .0005, .004)
    thump = np.sin(2 * np.pi * 140 * t) * env(n, .001, .012)
    return body * .6 + thump
def pop():
    n = int(.09 * SR); t = np.arange(n) / SR
    f = 520 - 260 * t / t[-1]
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .025)
def whoosh():
    n = int(.42 * SR); t = np.arange(n) / SR
    x = lp(rng.standard_normal(n), .08)
    shape = np.sin(np.pi * t / t[-1]) ** 2
    return x / (np.abs(x).max() + 1e-9) * shape
def tick():
    n = int(.02 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2600 * t) * env(n, .0003, .003)
G = {"click": (click(), .16), "pop": (pop(), .12), "whoosh": (whoosh(), .07), "tick": (tick(), .10)}
for t, k in SFX:
    x, g = G[k]; put(t, x, g)
pcm = (np.clip(buf, -1, 1) * 32767).astype(np.int16)
with wave.open("assets/sfx.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("ok DUR", DUR, "scenes", ST, "sfx", len(SFX))
