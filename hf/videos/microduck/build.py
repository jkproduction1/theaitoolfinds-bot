"""Microduck - 25 cm open-source biped you train with RL (pillar: creator/dev, Jan's own pick).
Facts: pollen-robotics.com/microduck (25 cm, 800 g, 15 motors, $399 introductory price before taxes/shipping,
Apache-2.0 software stack, MuJoCo sim, walk/sit-stand/kick/grab/roller skating/get back up) +
github.com/pollen-robotics/microduck README (fifteen servos, kicks a ball, picks things up, gets back up, wheels/roller
mode) + microduck_rl README (MuJoCo + PPO, policies exported to ONNX and run on the robot).
Media: the duck is rendered from Pollen's own CAD meshes in microduck_rl (MuJoCo model, keyframes STAND/SIT/FOLD,
rollers variant) with a small numpy rasterizer (media/render.py). No AI images."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile

W = HERE.parent.parent / "work" / "microduck"
for f in (HERE / "media").iterdir():
    if f.suffix == ".png":
        shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display={18: "cm", 21: "800 g", 22: "", 75: "$399", 76: ""})
F.scenes([0, 10, 15, 26, 35, 47, 53, 60, 74, 79])
NT = 24

CSS = r"""
.duck{position:absolute;filter:drop-shadow(0 50px 40px rgba(0,0,0,.28))}
.tt{position:absolute;width:640px;height:640px}
.tt img{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0}
#tt0{left:300px;top:240px;width:760px;height:760px}
#tt1{left:190px;top:300px;width:700px;height:700px}
#bub{left:80px;top:330px;width:400px;padding:30px 34px;border-radius:34px 34px 34px 8px;font-size:38px;font-weight:600;color:#6f6f6f}
#bub b{display:block;font-size:28px;color:#aaa;margin-bottom:8px;font-weight:600}
#bubx{position:absolute;left:250px;top:330px;width:16px;height:300px;background:#ff4b1f;border-radius:8px;transform:rotate(45deg);transform-origin:50% 50%;left:270px;top:310px}
#name{position:absolute;left:0;right:0;top:180px;text-align:center}
#name .n{display:inline-block;font-size:110px;font-weight:800;letter-spacing:-.05em;background:#fff;padding:6px 40px;border-radius:30px;box-shadow:0 40px 60px -20px rgba(0,0,0,.25)}
.spec{position:absolute;left:640px;width:360px;height:150px;border-radius:30px;padding:20px 34px}
.spec .v{font-size:76px;font-weight:800;letter-spacing:-.05em;line-height:1}
.spec .l{font-size:28px;color:#8a8a8a;font-weight:600;margin-top:6px}
#ruler{position:absolute;left:560px;top:380px;width:6px;height:560px;background:#111;border-radius:3px}
#ruler::before,#ruler::after{content:'';position:absolute;left:-16px;width:38px;height:6px;background:#111;border-radius:3px}
#ruler::before{top:0}#ruler::after{bottom:0}
.mv{position:absolute;display:flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:16px 34px 16px 18px;font-weight:700;font-size:44px;
 box-shadow:0 30px 50px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04);white-space:nowrap}
.mv i{width:56px;height:56px;border-radius:50%;background:#111;color:#fff;font-style:normal;display:flex;align-items:center;justify-content:center;font-size:30px}
#ball{position:absolute;left:760px;top:800px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0,#ff8a66 25%,#ff4b1f 60%,#c2330f 100%);box-shadow:0 30px 30px -10px rgba(0,0,0,.35)}
.spd{position:absolute;height:10px;border-radius:5px;background:#111;opacity:.8}
#lic{left:150px;top:380px;width:780px;height:460px;padding:52px 56px}
#lic .own{font-family:var(--mono);font-size:36px;color:#8a8a8a}
#lic .nm{font-family:var(--mono);font-size:58px;font-weight:700;letter-spacing:-.03em;margin-top:6px}
#lic .tags{display:flex;gap:16px;margin-top:40px;flex-wrap:wrap}
#lic .tags span{font-size:32px;font-weight:700;padding:12px 26px;border-radius:40px;background:#f0f0f0}
#lic .tags span.a{background:#ff4b1f;color:#fff}
#sim{left:70px;top:390px;width:470px;height:520px;overflow:hidden}
#sim .fl{position:absolute;left:-100px;right:-100px;bottom:-60px;height:300px;background-image:linear-gradient(90deg,rgba(255,255,255,.16) 2px,transparent 2px),linear-gradient(0deg,rgba(255,255,255,.16) 2px,transparent 2px);background-size:60px 60px;transform:perspective(500px) rotateX(60deg)}
#sim .lb{position:absolute;left:28px;top:76px;font-family:var(--mono);font-size:28px;color:#ff4b1f;font-weight:700}
#simd{position:absolute;left:55px;top:110px;width:360px;height:360px;filter:grayscale(.2) drop-shadow(0 20px 20px rgba(0,0,0,.5))}
#arr{position:absolute;left:520px;top:600px;font-size:110px;font-weight:800;color:#ff4b1f}
#real{left:600px;top:380px;width:430px;height:540px}
#real img{position:absolute;left:5px;top:40px;width:420px;height:420px}
#real .lb{position:absolute;left:0;right:0;bottom:30px;text-align:center;font-weight:800;font-size:36px}
#onnx{position:absolute;left:470px;top:520px;font-family:var(--mono);font-weight:700;font-size:30px;background:#111;color:#fff;padding:10px 22px;border-radius:30px}
#tag{left:250px;top:430px;width:580px;height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:40px}
#tag .p{font-size:200px;font-weight:800;letter-spacing:-.06em;line-height:1}
#tag .s{font-size:36px;font-weight:700;color:#8a8a8a;margin-top:10px}
#tagd{position:absolute;left:700px;top:330px;width:300px;height:300px}
"""


def tt(tid):
    return f'<div id="{tid}" class="tt duck">' + "".join(f'<img src="assets/tt{k:02d}.png" alt="">' for k in range(NT)) + '</div>'


def mv(mid, txt, glyph, x, y):
    return f'<div id="{mid}" class="mv" style="left:{x}px;top:{y}px"><i>{glyph}</i>{txt}</div>'


# S0 chatbot vs real robot
F.clip(0, '<div id="bub" class="card"><b>chatbot</b>Sure! Here is a list of…</div><div id="bubx"></div>' + tt("tt0")
       + F.block([[(0, 3, ""), (4, 5, "hl")], [(6, 9, "")]], top=1040, size=80))
# S1 meet
F.clip(1, tt("tt1") + '<div id="name"><span class="n">Microduck</span></div>'
       + F.block([[(10, 10, ""), (11, 11, "hl")], [(12, 12, ""), (13, 14, "b")]], top=1060, size=86))
# S2 specs
F.clip(2, '<img id="sd" class="duck" src="assets/stand34.png" style="left:40px;top:340px;width:560px;height:560px" alt=""><div id="ruler"></div>'
       + '<div id="sp1" class="spec card" style="top:360px"><div class="v">25 cm</div><div class="l">tall</div></div>'
       + '<div id="sp2" class="spec card" style="top:560px"><div class="v">800 g</div><div class="l">light</div></div>'
       + '<div id="sp3" class="spec card" style="top:760px"><div class="v">15</div><div class="l">motors</div></div>'
       + F.block([[(15, 16, ""), (17, 18, "b"), (19, 19, "")], [(20, 21, ""), (23, 23, ""), (24, 25, "hl")]], top=1040, size=78))
# S3 walks / kicks a ball
F.clip(3, '<img id="wd" class="duck" src="assets/stand34b.png" style="left:150px;top:330px;width:600px;height:600px" alt="">'
       + '<div id="ball"></div>' + mv("m1", "walks", "→", 90, 360) + mv("m2", "kicks a ball", "●", 560, 360)
       + F.block([[(26, 29, ""), (30, 31, "b")], [(32, 34, "hl")]], top=1050, size=84))
# S4 picks things up / gets back up
F.clip(4, '<img id="pd" class="duck" src="assets/sit34.png" style="left:60px;top:400px;width:520px;height:520px" alt="">'
       + '<img id="fd" class="duck" src="assets/fold34.png" style="left:560px;top:430px;width:420px;height:420px" alt="">'
       + '<img id="ud" class="duck" src="assets/stand34.png" style="left:520px;top:380px;width:540px;height:540px" alt="">'
       + mv("m3", "picks things up", "↑", 80, 330) + mv("m4", "gets back up", "↺", 560, 330)
       + F.block([[(35, 37, "b"), (38, 38, "")], [(39, 41, "hl"), (42, 43, "")], [(44, 46, "")]], top=1000, size=76))
# S5 skates
F.clip(5, '<img id="rd" class="duck" src="assets/roll34.png" style="left:240px;top:330px;width:600px;height:600px" alt="">'
       + '<div id="sk1" class="spd" style="left:60px;top:600px;width:220px"></div><div id="sk2" class="spd" style="left:120px;top:680px;width:160px"></div>'
       + '<div id="sk3" class="spd" style="left:40px;top:760px;width:260px"></div>'
       + F.block([[(47, 49, ""), (50, 51, ""), (52, 52, "hl")]], top=1060, size=88))
# S6 open source
F.clip(6, '<div id="lic" class="card"><div class="own">pollen-robotics /</div><div class="nm">microduck_rl</div>'
          '<div class="tags"><span class="a">Open source</span><span>Apache-2.0</span><span>MuJoCo</span><span>PPO</span></div></div>'
       + F.block([[(53, 56, "")], [(57, 59, "hl")]], top=1040, size=86))
# S7 sim -> robot
F.clip(7, '<div id="sim" class="term"><div class="bar"><i></i><i></i><i></i></div><div class="fl"></div><div class="lb">MuJoCo sim</div>'
          '<img id="simd" src="assets/stand34b.png" alt=""></div><div id="arr">→</div>'
          '<div id="real" class="card"><img src="assets/stand34.png" alt=""><div class="lb">real robot</div></div>'
       + F.block([[(60, 63, "b"), (64, 65, ""), (66, 67, "hl")], [(68, 73, "")]], top=1020, size=72))
# S8 price
F.clip(8, '<div id="tag" class="card"><div class="p">$399</div><div class="s">intro price</div></div>'
       + F.block([[(74, 74, ""), (75, 75, "hl"), (77, 78, "b")]], top=1060, size=90))
# S9 CTA
F.clip(9, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(79, 79, ""), (80, 80, "hl")], [(81, 86, "")]], top=1020, size=82))

S = F.S
for i in (5, 11, 17, 24, 31, 32, 35, 39, 52, 58, 66, 75, 80):
    F.pop(S[i] - 0.05)

JS = r"""
const NT=__NT__;
function spin(id,t0,t1,fps,k0){ const im=document.querySelectorAll('#'+id+' img'); let k=k0||0, prev=-1;
  for(let t=t0;t<t1;t+=1/fps){ const c=k%NT; if(prev>=0) tl.set(im[prev],{opacity:0},t); tl.set(im[c],{opacity:1},t); prev=c; k++; } }
// S0 chatbot bubble struck, duck spinning from frame 0
ft('#bub',{opacity:1,y:20,scale:.97},{opacity:1,y:0,scale:1,duration:1,ease:A},0);
ft('#bubx',{scaleY:0},{scaleY:1,duration:.3,ease:'power3.out'},S[6]-0.05);
tl.to('#bub',{opacity:.35,filter:'blur(3px)',duration:.3},S[6]);
ft('#tt0',{y:40,scale:.94},{y:0,scale:1,duration:1.4,ease:A},0);
spin('tt0',0,ST[1],10,0);
tl.to(['#bub','#bubx'],{x:-300,opacity:0,filter:'blur(14px)',duration:.3,ease:IN},ST[1]-0.3);
tl.to('#tt0',{opacity:0,duration:.01},ST[1]);
// S1 name + bigger spin
spin('tt1',ST[1],ST[2],10,Math.round(ST[1]*10));
ft('#name .n',{opacity:0,y:-40,scale:1.4,filter:'blur(16px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.5,ease:A},S[11]-0.1);
outUp(['#tt1','#name'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.4);
// S2 specs with counters
ft('#sd',{opacity:0,y:120,scale:.9},{opacity:1,y:0,scale:1,duration:.8,ease:A},ST[2]);
ft('#ruler',{scaleY:0,transformOrigin:'50% 100%'},{scaleY:1,duration:.6,ease:A},S[17]-0.1);
popIn('#sp1',S[17]-0.1,{y:40,s:.8,r:4}); popIn('#sp2',S[21]-0.1,{y:40,s:.8,r:-4}); popIn('#sp3',S[24]-0.1,{y:40,s:.8,r:4});
outUp(['#sd','#ruler','#sp1','#sp2','#sp3'],ST[3]);
// S3 walk + kick
ft('#wd',{opacity:0,x:-200},{opacity:1,x:0,duration:.9,ease:A},ST[3]);
tl.to('#wd',{x:40,y:-8,duration:.25,ease:'sine.inOut',yoyo:true,repeat:5},S[30]);
popIn('#m1',S[31]-0.1); popIn('#m2',S[32]-0.1);
ft('#ball',{opacity:0,scale:.4},{opacity:1,scale:1,duration:.4,ease:'back.out(2)'},S[32]-0.2);
tl.to('#ball',{x:200,y:-160,rotation:360,duration:.6,ease:'power2.out'},S[34]);
outUp(['#wd','#ball','#m1','#m2'],ST[4]);
// S4 pick up (sit) + fall -> stand
ft('#pd',{opacity:0,y:100},{opacity:1,y:0,duration:.7,ease:A},ST[4]);
popIn('#m3',S[35]-0.05);
tl.set('#ud',{opacity:0},0);
ft('#fd',{opacity:0,rotation:-80,y:200,x:0},{opacity:1,rotation:-80,y:150,x:0,duration:.35,ease:A},S[39]-0.2);
tl.to('#fd',{opacity:0,duration:.15},S[41]);
ft('#ud',{opacity:0,y:40,scale:.92},{opacity:1,y:0,scale:1,duration:.6,ease:'back.out(1.8)'},S[41]);
popIn('#m4',S[39]-0.05);
outUp(['#pd','#fd','#ud','#m3','#m4'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.4);
// S5 rollers
ft('#rd',{opacity:0,x:-500},{opacity:1,x:0,duration:.9,ease:'expo.out'},ST[5]);
['#sk1','#sk2','#sk3'].forEach((s,k)=>ft(s,{opacity:0,scaleX:0,transformOrigin:'100% 50%'},{opacity:.8,scaleX:1,duration:.4,ease:A},ST[5]+0.1+k*0.06));
tl.to('#rd',{x:60,duration:.8,ease:'sine.inOut',yoyo:true,repeat:1},ST[5]+0.9);
outUp(['#rd','#sk1','#sk2','#sk3'],ST[6]);
// S6 open source card
ft('#lic',{opacity:0,y:160,rotationX:20,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.8,ease:A},ST[6]);
ft('#lic .tags span',{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:'back.out(2)',stagger:.08},S[57]);
outUp('#lic',ST[7]);
// S7 sim -> real
popIn('#sim',ST[7]+0.05,{y:60,s:.9,r:-4});
tl.to('#simd',{y:-12,duration:.3,ease:'sine.inOut',yoyo:true,repeat:5},S[64]);
ft('#arr',{opacity:0,x:-40},{opacity:1,x:0,duration:.4,ease:A},S[68]-0.1);
popIn('#real',S[69]-0.05,{y:60,s:.85,r:5});
outUp(['#sim','#arr','#real'],ST[8]);
// S8 price
ft('#tag',{opacity:0,scale:1.5,rotation:-6,filter:'blur(18px)'},{opacity:1,scale:1,rotation:-3,filter:'blur(0px)',duration:.5,ease:A},ST[8]+0.02);
outUp('#tag',ST[9]);
starPass('#st3',ST[9]-0.3,[900,1500,0],[580,1290,50],8,1.2);
cta('MICRODUCK',S[80]);
""".replace("__NT__", str(NT))
F.write(CSS, JS, music_vol=0.09)
