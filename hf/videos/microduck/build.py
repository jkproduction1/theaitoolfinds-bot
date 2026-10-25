"""Microduck v3 - curiosity piece, no CTA (script approved by Jan).
Facts: pollen-robotics.com/microduck ($399 introductory price, open-source SDK/sim/RL stack, Apache-2.0) +
github.com/pollen-robotics/microduck README (neural policies, "Knock it over and it stands itself up",
"Put wheels on, ask for roller mode, and it loads the other brain", quacks) + microduck_rl README (MuJoCo sim,
"~1-2 h for a usable gait at 4096 envs"). 20,000 preorders in a day: Hugging Face co-founder Clem Delangue's post
(reported by martincid.com / aiinsightsnews; shown with attribution on screen).
Media: duck rendered from Pollen's own CAD meshes in microduck_rl (media/render.py). No AI images."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile

W = HERE.parent.parent / "work" / "microduck"
for f in (HERE / "media").iterdir():
    if f.suffix in (".png", ".mp4", ".mp3"):
        shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display={8: "$399", 9: ""}, tail=2.6)
F.scenes([0, 6, 17, 21, 34, 42, 49, 56, 66, 78, 85])
NT = 24

CSS = r"""
.vcard{position:absolute;border-radius:30px;overflow:hidden;opacity:0;background:#111;box-shadow:0 60px 90px -20px rgba(0,0,0,.35),0 18px 30px -10px rgba(0,0,0,.16)}
.vcard video{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover}
#rlab{position:absolute;left:640px;top:830px;background:#fff;font-weight:800;font-size:34px;padding:10px 26px;border-radius:30px;box-shadow:0 20px 40px -14px rgba(0,0,0,.3)}
.duck{position:absolute;filter:drop-shadow(0 50px 40px rgba(0,0,0,.28))}
.tt{position:absolute}
.tt img{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0}
#tt0{left:200px;top:250px;width:700px;height:700px}
.cm{position:absolute;display:flex;align-items:center;gap:12px;background:#fff;border-radius:999px;padding:14px 30px;font-weight:700;font-size:38px;color:#555;
 box-shadow:0 30px 50px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04);white-space:nowrap}
.cm i{font-style:normal;color:#ff4b1f}
#tag{position:absolute;left:600px;top:330px;background:#111;color:#fff;font-weight:800;font-size:96px;letter-spacing:-.04em;padding:14px 40px;border-radius:30px;transform:rotate(6deg);box-shadow:0 40px 60px -20px rgba(0,0,0,.45)}
.sk{position:absolute;display:flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:14px 30px 14px 16px;font-weight:700;font-size:40px;
 box-shadow:0 30px 50px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04);white-space:nowrap}
.sk b{width:52px;height:52px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px}
.sk.new{border:4px dashed #ff4b1f;color:#ff4b1f}.sk.new b{background:#ff4b1f}
#code{left:150px;top:380px;width:780px;height:480px}
#code .body{padding:34px 40px;font-size:34px;line-height:1.6;color:#8a8a8a}
#code .k{color:#ff4b1f}
#code .ln{position:relative;display:inline-block}
#nope{position:absolute;left:0;right:0;top:600px;text-align:center;font-size:150px;font-weight:800;color:#ff4b1f;letter-spacing:-.04em}
#sim{left:90px;top:330px;width:900px;height:640px;overflow:hidden}
#sim .lb{position:absolute;left:30px;top:76px;font-family:var(--mono);font-size:30px;color:#ff4b1f;font-weight:700;z-index:2}
#grid2{position:absolute;left:40px;top:130px;width:820px;height:480px;display:grid;grid-template-columns:repeat(8,1fr);grid-auto-rows:120px;gap:0}
#grid2 img{width:118px;height:118px;opacity:0;margin:-9px}
#cnt{position:absolute;right:40px;top:66px;font-family:var(--mono);font-size:40px;color:#fff;font-weight:700;z-index:2}
#clock{left:120px;top:400px;width:420px;height:420px;border-radius:50%;display:flex;align-items:center;justify-content:center}
#clock svg{position:absolute;inset:30px}
#clock .t{font-size:110px;font-weight:800;letter-spacing:-.05em}
#walk{left:560px;top:360px;width:460px;height:460px}
#simm{left:70px;top:390px;width:440px;height:500px;overflow:hidden}
#simm .fl{position:absolute;left:-100px;right:-100px;bottom:-60px;height:300px;background-image:linear-gradient(90deg,rgba(255,255,255,.16) 2px,transparent 2px),linear-gradient(0deg,rgba(255,255,255,.16) 2px,transparent 2px);background-size:60px 60px;transform:perspective(500px) rotateX(60deg)}
#simm .lb{position:absolute;left:28px;top:76px;font-family:var(--mono);font-size:28px;color:#ff4b1f;font-weight:700}
#simd{position:absolute;left:50px;top:110px;width:340px;height:340px}
#brainf{position:absolute;left:470px;top:560px;width:140px;height:140px;border-radius:50%;background:#ff4b1f;display:flex;align-items:center;justify-content:center;box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#brainf svg{width:84px;height:84px}
#real{left:580px;top:380px;width:430px;height:520px}
#real img{position:absolute;left:5px;top:30px;width:420px;height:420px}
#real .lb{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-weight:800;font-size:34px}
#b2{position:absolute;left:600px;top:290px;background:#ff4b1f;color:#fff;font-weight:800;font-size:46px;padding:16px 34px;border-radius:24px;box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#b1{position:absolute;left:600px;top:290px;background:#111;color:#fff;font-weight:800;font-size:46px;padding:16px 34px;border-radius:24px}
.spd{position:absolute;height:10px;border-radius:5px;background:#111;opacity:.8}
#lic{left:150px;top:360px;width:780px;height:330px;padding:48px 56px}
#lic .own{font-family:var(--mono);font-size:34px;color:#8a8a8a}
#lic .nm{font-family:var(--mono);font-size:56px;font-weight:700;letter-spacing:-.03em;margin-top:6px}
#lic .tags{display:flex;gap:16px;margin-top:34px}
#lic .tags span{white-space:nowrap;font-size:32px;font-weight:700;padding:12px 26px;border-radius:40px;background:#f0f0f0}
#lic .tags span.a{background:#ff4b1f;color:#fff}
#yt{left:300px;top:760px}
#num{position:absolute;left:0;right:0;top:400px;text-align:center;font-size:200px;font-weight:800;letter-spacing:-.06em;line-height:1}
#numl{position:absolute;left:0;right:0;top:620px;text-align:center;font-size:44px;font-weight:700;color:#6f6f6f}
#src{position:absolute;left:0;right:0;top:700px;text-align:center;font-size:28px;color:#9a9a9a;font-family:var(--mono)}
#quack{position:absolute;left:600px;top:250px;background:#fff;font-weight:800;font-size:96px;letter-spacing:-.04em;padding:20px 48px;border-radius:50px 50px 50px 10px;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.3)}
.wv{position:absolute;border:8px solid #ff4b1f;border-radius:50%;border-left-color:transparent;border-bottom-color:transparent;transform:rotate(45deg)}
"""


def tt(tid):
    return f'<div id="{tid}" class="tt duck">' + "".join(f'<img src="assets/tt{k:02d}.png" alt="">' for k in range(NT)) + '</div>'


def sk(i, txt, glyph, x, y, new=False):
    return f'<div id="{i}" class="sk{" new" if new else ""}" style="left:{x}px;top:{y}px"><b>{glyph}</b>{txt}</div>'


BRAIN = '<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M50 20c-8-10-30-6-30 12-10 4-10 24 2 28 0 14 18 20 28 10 10 10 28 4 28-10 12-4 12-24 2-28 0-18-22-22-30-12z"/><path d="M50 20v60M34 40c6 0 10 4 10 10M66 40c-6 0-10 4-10 10"/></svg>'

# S0 hook
F.clip(0, '<div id="c1" class="cm" style="left:100px;top:260px"><i>♥</i>so cute</div>'
       + '<div id="c2" class="cm" style="left:760px;top:520px"><i>♥</i>aww</div>'
       + '<div id="c3" class="cm" style="left:110px;top:780px"><i>♥</i>I want one</div>'
       + F.block([[(0, 3, "")], [(4, 4, ""), (5, 5, "hl")]], top=1030, size=86))
# S1 $399 robot you teach
F.clip(1, '<div id="tag">$399</div>'
       + sk("k1", "walk", "✓", 620, 560) + sk("k2", "kick", "✓", 620, 680) + sk("k3", "your trick", "+", 620, 800, new=True)
       + F.block([[(6, 7, ""), (8, 8, "b"), (10, 11, "b")], [(12, 12, ""), (13, 15, "hl"), (16, 16, "")]], top=1040, size=80))
# S2 nobody hand-codes it
F.clip(2, '<div id="code" class="term"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="k">def</span> walk():</div><div>&nbsp;&nbsp;left_leg.angle = <span class="k">??</span></div>'
          '<div>&nbsp;&nbsp;right_leg.angle = <span class="k">??</span></div><div>&nbsp;&nbsp;balance = <span class="k">??</span></div></div></div>'
          '<div id="nope">✕</div>'
       + F.block([[(17, 17, "b"), (18, 18, "hl")], [(19, 20, "")]], top=1040, size=88))
# S3 thousands of virtual ducks
imgs = "".join(f'<img src="assets/tt{(k * 5) % NT:02d}.png" alt="">' for k in range(32))
F.clip(3, f'<div id="sim" class="term"><div class="bar"><i></i><i></i><i></i></div><div class="lb">simulation</div><div id="cnt">×1</div><div id="grid2">{imgs}</div></div>'
       + F.block([[(21, 25, ""), (26, 26, "b")], [(27, 27, ""), (28, 29, "hl")], [(30, 33, "")]], top=1020, size=78))
# S4 ~2 hours -> walks
F.clip(4, '<div id="clock" class="card"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="#eee" stroke-width="5"/>'
          '<circle id="arc" cx="50" cy="50" r="46" fill="none" stroke="#ff4b1f" stroke-width="5" stroke-linecap="round" pathLength="1" transform="rotate(-90 50 50)"/></svg>'
          '<div class="t">~2h</div></div>'
          '<img id="walk" class="duck" src="assets/stand34b.png" alt="">'
       + F.block([[(34, 35, ""), (36, 38, "hl")], [(39, 41, "b")]], top=1040, size=86))
# S5 brain -> real robot
F.clip(5, '<div id="simm" class="term"><div class="bar"><i></i><i></i><i></i></div><div class="fl"></div><div class="lb">sim</div>'
          '<img id="simd" src="assets/stand34b.png" alt=""></div>'
          '<div id="rlab">real robot</div>'
          f'<div id="brainf">{BRAIN}</div>'
       + F.block([[(42, 44, ""), (45, 45, "")], [(46, 48, "hl")]], top=1040, size=86))
# S6 knock it over
F.clip(6, F.block([[(49, 51, "b")], [(52, 52, ""), (53, 55, "hl")]], top=1040, size=88))
# S7 wheels -> second brain
F.clip(7, '<div id="b1">brain 1 · walk</div><div id="b2">brain 2 · roll</div>'
       + F.block([[(56, 57, ""), (58, 59, "b")], [(60, 61, ""), (62, 65, "hl")]], top=1040, size=84))
# S8 open source -> your trick
F.clip(8, '<div id="lic" class="card"><div class="own">pollen-robotics /</div><div class="nm">microduck_rl</div>'
          '<div class="tags"><span class="a">Open source</span><span>Apache-2.0</span><span>MuJoCo</span></div></div>'
       + sk("yt", "your next trick", "+", 0, 0, new=True)
       + F.block([[(66, 68, ""), (69, 71, "hl")], [(72, 74, ""), (75, 77, "b")]], top=1030, size=80))
# S9 20,000 preorders
F.clip(9, '<div id="num">0</div><div id="numl">pre-orders in one day</div><div id="src">per Hugging Face co-founder Clem Delangue</div>'
       + F.block([[(78, 78, "hl"), (79, 80, "")], [(81, 84, "")]], top=1040, size=86))
# S10 quacks
F.clip(10, '<div id="quack">QUACK</div>'
        + F.block([[(85, 86, "it"), (87, 87, ""), (88, 88, "hl")]], top=1060, size=96))

VC = [("hook", 0, 70, 300, 940, 529), ("grab", 1, 70, 290, 360, 640), ("real", 5, 580, 380, 420, 520),
      ("balance", 6, 70, 330, 940, 529), ("roller", 7, 70, 330, 940, 529), ("quack", 10, 70, 330, 940, 529)]
for k, (nm, n, x, y, w, h) in enumerate(VC):
    st, en = F.ST[n], F.EN[n]
    F.body.insert(0, f'<div id="vw_{nm}" class="vcard" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">'
                     f'<video id="v_{nm}" class="clip" src="assets/v-{nm}.mp4" data-start="{st}" data-duration="{round(en - st, 2)}" '
                     f'data-track-index="{30 + k}" muted playsinline></video></div>')
F.body.append(f'<audio id="aq" class="clip" src="assets/a-quack.mp3" data-start="{round(F.E[88] + 0.05, 2)}" '
              f'data-duration="{round(F.dur - F.E[88] - 0.05, 2)}" data-track-index="40" data-volume="0.8" data-fade-in="0.15" data-fade-out="0.4"></audio>')

S = F.S
for i in (5, 8, 13, 18, 28, 36, 46, 53, 62, 69, 78, 88):
    F.pop(S[i] - 0.05)

JS = r"""
const NT=__NT__;
function spin(id,t0,t1,fps,k0){ const im=document.querySelectorAll('#'+id+' img'); let k=k0||0, prev=-1;
  for(let t=t0;t<t1;t+=1/fps){ const c=k%NT; if(prev>=0) tl.set(im[prev],{opacity:0},t); tl.set(im[c],{opacity:1},t); prev=c; k++; } }
// S0: spinning duck + cute comments, struck by "missed the point"
const VC=[['hook',0],['grab',1],['real',5],['balance',6],['roller',7],['quack',10]];
VC.forEach(([nm,n])=>{ ft('#vw_'+nm,{opacity:n===0?1:0,y:n===0?30:140,scale:n===0?.97:.88,rotationX:n===0?0:14,transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,duration:n===0?1.2:.75,ease:A},n===0?0:ST[n]+0.02); if(n<ST.length-1) outUp('#vw_'+nm,ST[n+1]); });
ft('#c1',{opacity:1,x:-20,scale:.95},{opacity:1,x:0,scale:1,duration:.8,ease:A},0);
popIn('#c2',0.35,{y:30,s:.7,r:6}); popIn('#c3',0.7,{y:30,s:.7,r:-6});
tl.to(['#c1','#c2','#c3'],{opacity:.25,filter:'blur(4px)',scale:.92,duration:.3,ease:A,stagger:.05},S[3]);
tl.to(['#c1','#c2','#c3'],{opacity:0,filter:'blur(14px)',duration:.25,ease:IN},ST[1]-0.25);
// S1 price + skills
ft('#tag',{opacity:0,scale:2,rotation:-10,filter:'blur(16px)'},{opacity:1,scale:1,rotation:6,filter:'blur(0px)',duration:.45,ease:'back.out(2)'},S[8]-0.1);
popIn('#k1',S[13]-0.1,{y:40,s:.7,r:0}); popIn('#k2',S[14]-0.1,{y:40,s:.7,r:0}); popIn('#k3',S[15]-0.1,{y:40,s:.7,r:0});
outUp(['#tag','#k1','#k2','#k3'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 code with ??, big X
popIn('#code',ST[2]+0.02,{y:60,s:.92,r:0});
ft('#nope',{opacity:0,scale:2.4,rotation:-20},{opacity:1,scale:1,rotation:0,duration:.35,ease:'back.out(2)'},S[18]-0.05);
outUp(['#code','#nope'],ST[3]);
// S3 sim grid multiplies, counter climbs
popIn('#sim',ST[3]+0.02,{y:60,s:.94,r:0});
const gi=document.querySelectorAll('#grid2 img');
gi.forEach((el,k)=>ft(el,{opacity:0,scale:.3},{opacity:1,scale:1,duration:.3,ease:'back.out(2)'},ST[3]+0.3+k*0.045));
const C={v:1}, ce=document.getElementById('cnt');
ft(C,{v:1},{v:4096,duration:1.4,ease:'expo.in',onUpdate:()=>{ce.textContent='×'+Math.round(C.v).toLocaleString('en-US')}},S[28]-0.2);
tl.to('#grid2',{scale:.82,transformOrigin:'50% 50%',duration:ST[4]-S[30],ease:'none'},S[30]);
outUp('#sim',ST[4]);
// S4 clock fills, duck walks
popIn('#clock',ST[4]+0.02,{y:40,s:.8,r:0});
ft('#arc',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.2,ease:'power2.inOut'},S[36]-0.1);
ft('#walk',{opacity:0,x:120},{opacity:1,x:0,duration:.6,ease:A},S[39]-0.2);
tl.to('#walk',{x:-30,y:-8,duration:.22,ease:'sine.inOut',yoyo:true,repeat:5},S[40]);
outUp(['#clock','#walk'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S5 brain flies sim -> real
popIn('#simm',ST[5]+0.02,{y:60,s:.9,r:-4});
popIn('#rlab',ST[5]+0.3,{y:30,s:.8,r:0});
ft('#brainf',{opacity:0,x:-260,y:-80,scale:.5},{opacity:1,x:0,y:0,scale:1,duration:.5,ease:A},S[43]-0.05);
tl.to('#brainf',{x:300,y:-40,scale:.7,duration:.5,ease:IO},S[46]-0.1);
outUp(['#simm','#rlab','#brainf'],ST[6]);
// S6 knocked over -> back up
// S7 wheels + brain swap
popIn('#b1',ST[7]+0.3,{y:30,s:.8,r:0});
tl.to('#b1',{y:-60,opacity:0,rotation:-8,duration:.3,ease:IN},S[62]-0.1);
ft('#b2',{opacity:0,y:60,scale:.7},{opacity:1,y:0,scale:1,duration:.45,ease:'back.out(2)'},S[62]);
outUp(['#b2'],ST[8]);
// S8 open source + your trick
ft('#lic',{opacity:0,y:160,rotationX:20,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.8,ease:A},ST[8]);
ft('#lic .tags span',{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:'back.out(2)',stagger:.08},S[69]);
popIn('#yt',S[74]-0.1,{y:60,s:.6,r:-6});
outUp(['#lic','#yt'],ST[9]);
starPass('#st3',ST[9]-0.3,[900,1500,0],[580,1290,50],8,1.2);
// S9 counter to 20,000
const N={v:0}, ne=document.getElementById('num');
ft('#num',{opacity:0,scale:.8,filter:'blur(14px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.4,ease:A},ST[9]+0.02);
ft(N,{v:0},{v:20000,duration:1.2,ease:'expo.out',onUpdate:()=>{ne.textContent=Math.round(N.v).toLocaleString('en-US')}},ST[9]+0.05);
ft(['#numl','#src'],{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:A,stagger:.1},S[80]);
outUp(['#num','#numl','#src'],ST[10]);
// S10 QUACK
ft('#quack',{opacity:0,scale:.3,rotation:-12},{opacity:1,scale:1,rotation:-4,duration:.45,ease:'back.out(2.4)'},S[88]-0.05);
"""
JS = JS.replace("__NT__", str(NT))
F.write(CSS, JS, music_vol=0.09)
