"""Dimensional Drawing - agent skill that turns a UI component into an Apple-style dimensional drawing (creator & dev,
angle new-ability).
Facts: github.com/enesozturk/dimensional-drawing README (MIT, Enes Ozturk): "Give it a UI component, get back a one-page
technical drawing of it. Paddings, gaps, corner radii, layers and viewport placement, measured and labeled like Apple's
dimensional drawings."; install for Claude Code via ~/.claude/skills (also other agents); "Never invent values: unknowns
stay [TBD]"; "Make a dimensional drawing of the Card component in src/components/Card.tsx"; second skill
dimensional-drawing-motion "turns a sheet into a ~10 s film".
Media: assets/card-sheet.png (crops), assets/dialog-motion.mp4 from the repo (MIT), credited on screen + caption.
UI mock components and the variable table are drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "dimdraw"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json",
         display={43: "[TBD].", 54: "Comment", 55: "DRAWING"}, tail=1.0)
F.scenes([0, 7, 16, 24, 29, 37, 44, 54], hold=0.12)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.im{position:absolute;border-radius:22px;overflow:hidden;background:#fff;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.30),0 16px 28px -12px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.05)}
.im img,.im video{display:block;width:100%;height:100%;object-fit:cover}
.tag{position:absolute;background:#ff4b1f;color:#fff;font-weight:800;font-size:36px;padding:8px 22px;border-radius:12px;white-space:nowrap;box-shadow:0 20px 30px -12px rgba(255,75,31,.6)}
.mtag{position:absolute;background:#111;color:#fff;font-family:var(--mono);font-weight:700;font-size:30px;padding:8px 18px;border-radius:10px;white-space:nowrap}
#wm{position:absolute;left:60px;right:60px;top:380px;text-align:center}
#wm .t{font-family:var(--mono);font-weight:800;font-size:84px;letter-spacing:-.05em;line-height:1.05}
#wm .u{font-family:var(--serif);font-style:italic;font-size:52px;color:#6f6f6f;margin-top:16px}
#free{position:absolute;left:760px;top:250px;background:#ff4b1f;color:#fff;font-weight:900;font-size:70px;padding:8px 30px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#c1a{font-size:50px}
.ui{position:absolute;background:#fff;border-radius:34px;padding:34px;box-shadow:0 50px 70px -22px rgba(0,0,0,.30),0 0 0 1px rgba(0,0,0,.05)}
.ui .ln{height:22px;border-radius:11px;background:#e2e2e1;margin:16px 0}
.ui .ttl{height:34px;width:60%;border-radius:12px;background:#111}
.ui .btn{display:inline-block;height:64px;border-radius:32px;background:#111;width:180px;margin-top:20px}
.ui .btn.g{background:#e2e2e1;margin-right:16px}
.ui .well{height:150px;border-radius:20px;background:#f1f1f0;margin:18px 0}
.dim{position:absolute;border:3px dashed #ff4b1f;border-radius:36px}
.tm{left:70px;width:940px}
.tm .body{padding:26px 34px;font-size:34px;line-height:1.5}
.tm .p{color:#ff4b1f}
#vt{position:absolute;left:150px;top:330px;width:780px;background:#fff;border-radius:26px;overflow:hidden;font-family:var(--mono);font-size:40px;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.30),0 0 0 1px rgba(0,0,0,.05)}
#vt .r{display:flex;border-top:2px solid #e6e6e5;padding:22px 34px}
#vt .r:first-child{border-top:none;background:#111;color:#fff;font-size:28px;font-weight:700}
#vt .r span{flex:1}#vt .r span:last-child{text-align:right;font-weight:800}
#tbd{color:#ff4b1f}
#credit{position:absolute;left:0;right:0;top:190px;text-align:center;font-family:var(--mono);font-size:24px;color:#8a8a8a}
"""

def im(iid, src, x, y, w, h, fit="cover", pos="50% 50%"):
    return (f'<div id="{iid}" class="im" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">'
            f'<img src="assets/{src}" style="object-fit:{fit};object-position:{pos}" alt=""></div>')

# S0 hook: plan view of a card on screen at t=0
F.clip(0, im("p0", "plan.jpg", 70, 330, 940, 534) + '<div class="tag" id="t0" style="left:620px;top:290px">UI-CARD-001</div>'
       + F.block([[(0, 3, ""), (4, 4, "")], [(5, 6, "hl")]], top=990, size=90))
# S1 name + free + Claude Code
F.clip(1, '<div id="wm"><div class="t" id="wmt">dimensional-<br>drawing</div><div class="u" id="wmu">by Enes Ozturk</div></div><div id="free">FREE</div>'
          + chip("c1a", "Claude Code", 290, 790, "✳", "#d97757")
       + F.block([[(7, 8, "hl"), (9, 9, "")], [(10, 11, "it"), (12, 15, "")]], top=1000, size=86))
# S2 point it at a card or a dialog
F.clip(2, '<div id="t2t" class="term tm" style="top:300px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<span class="p">&gt;</span> <span id="t2c"></span></div></div>'
          '<div class="ui" id="u1" style="left:80px;top:560px;width:430px"><div class="ttl"></div><div class="well"></div><div class="ln"></div><div class="btn"></div></div>'
          '<div class="ui" id="u2" style="left:570px;top:530px;width:430px"><div class="ttl" style="width:75%"></div><div class="ln"></div><div class="ln" style="width:70%"></div>'
          '<div class="ln"></div><div><span class="btn g" style="width:150px"></span><span class="btn" style="width:150px"></span></div></div>'
          '<div class="dim" id="d1" style="left:62px;top:542px;width:466px;height:386px"></div>'
          '<div class="mtag" id="m1" style="left:90px;top:500px">card</div><div class="mtag" id="m2" style="left:580px;top:470px">dialog</div>'
       + F.block([[(16, 18, ""), (19, 20, "hl")], [(21, 23, "hl")]], top=1060, size=92))
# S3 the whole sheet
F.clip(3, im("p3", "sheet.jpg", 70, 300, 940, 818, "cover", "50% 0%")
       + F.block([[(24, 26, ""), (27, 28, "hl")]], top=1130, size=88))
# S4 paddings, gaps, radii, layers
F.clip(4, im("p4a", "table.jpg", 60, 300, 330, 640, "contain")
          + im("p4b", "corner.jpg", 430, 300, 360, 340, "contain")
          + im("p4c", "radii.jpg", 430, 680, 590, 206, "contain")
          + im("p4d", "explode.jpg", 300, 420, 720, 520, "contain")
       + F.block([[(29, 30, "b")], [(31, 32, ""), (33, 34, "it")], [(35, 36, "hl")]], top=1020, size=84))
# S5 never invents values
F.clip(5, '<div id="vt"><div class="r"><span>CODE</span><span>VARIABLE</span><span>VALUE</span></div>'
          '<div class="r"><span>S1</span><span>card-pad</span><span>14</span></div>'
          '<div class="r"><span>S2</span><span>well-pad</span><span>12</span></div>'
          '<div class="r"><span>R1</span><span>r-card</span><span>16</span></div>'
          '<div class="r" id="rt"><span>H5</span><span>max-h</span><span id="tbd">[TBD]</span></div></div>'
       + F.block([[(37, 38, ""), (39, 40, "hl")], [(41, 42, ""), (43, 43, "b")]], top=1040, size=92))
# S6 short film
F.clip(6, '<div id="p6" class="im" style="left:70px;top:330px;width:940px;height:600px"><video id="v6" class="clip" src="assets/v-motion.mp4" '
          f'data-start="{F.ST[6]}" data-duration="{round(F.EN[6] - F.ST[6], 2)}" data-track-index="30" muted playsinline></video></div>'
          '<div class="tag" id="t6" style="left:90px;top:290px">dimensional-drawing-motion</div>'
       + F.block([[(44, 46, ""), (47, 49, "")], [(50, 53, "hl")]], top=1040, size=84))
# S7 CTA
F.clip(7, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(54, 54, ""), (55, 55, "hl")], [(56, 61, "")]], top=1020, size=84))
F.body.append('<div class="layer"><div id="credit">drawings: dimensional-drawing by Enes Ozturk · MIT</div></div>')

S = F.S
for i in (5, 7, 11, 14, 20, 23, 27, 29, 30, 31, 34, 39, 43, 50, 55):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.05;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
function cardIn(sel,t,o){ o=o||{}; ft(sel,{opacity:0,y:o.y??200,rotationX:o.rx??28,transformPerspective:1600,scale:o.s??.88,filter:'blur(12px)'},
  {opacity:1,y:0,rotationX:0,scale:1,filter:'blur(0px)',duration:.75,ease:A},t); }
// S0: sheet visible at t=0, slow push, tag
ft('#p0',{opacity:1,scale:1.0},{opacity:1,scale:1.07,duration:ST[1],ease:'none'},0);
popIn('#t0',0.1,{y:30,s:.5,r:6});
outUp(['#p0','#t0'],ST[1]);
starPass('#st1',ST[1]-0.3,[900,1500,0],[760,1460,50],10,1.2);
// S1
ft('#wm',{opacity:0,scale:.6,filter:'blur(20px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.6,ease:A},ST[1]+0.02);
ft('#free',{opacity:0,scale:2.6,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[11]-0.08);
popIn('#c1a',S[14]-0.15,{y:60,s:.6,r:-6});
outUp(['#wm','#free','#c1a'],ST[2]);
// S2
popIn('#t2t',ST[2]+0.02,{y:60,s:.94,r:0}); typeIn('t2c','Make a dimensional drawing of the Card',ST[2]+0.1,.025);
cardIn('#u1',S[19]-0.2,{y:140,rx:0,s:.7}); popIn('#m1',S[20]-0.05,{y:20,s:.5,r:-6});
cardIn('#u2',S[22]-0.2,{y:140,rx:0,s:.7}); popIn('#m2',S[23]-0.05,{y:20,s:.5,r:6});
ft('#d1',{opacity:0,scale:1.15},{opacity:1,scale:1,duration:.4,ease:'back.out(2)'},S[20]+0.1);
outUp(['#t2t','#u1','#u2','#m1','#m2','#d1'],ST[3]);
// S3 whole sheet, pan down
cardIn('#p3',ST[3]+0.02);
ft('#p3 img',{objectPosition:'50% 0%'},{objectPosition:'50% 100%',duration:Math.max(.5,ST[4]-ST[3]-.4),ease:'power1.inOut'},ST[3]+0.4);
outUp('#p3',ST[4]);
starPass('#st2',ST[4]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S4 details on their words
cardIn('#p4a',ST[4]+0.02,{y:160,rx:0,s:.8});
cardIn('#p4b',S[31]-0.2,{y:140,rx:0,s:.7}); cardIn('#p4c',S[32]-0.15,{y:140,rx:0,s:.7});
tl.to(['#p4b','#p4c'],{opacity:0,y:-50,filter:'blur(10px)',duration:.25,ease:IN},S[34]-0.25);
cardIn('#p4d',S[34]-0.2,{y:220,rx:40,s:.8});
outUp(['#p4a','#p4b','#p4c','#p4d'],ST[5]);
// S5 table, TBD row flashes
cardIn('#vt',ST[5]+0.02,{y:160,rx:20});
ft('#rt',{backgroundColor:'#ffffff'},{backgroundColor:'#ffe6dd',duration:.3},S[41]-0.05);
ft('#tbd',{scale:1},{scale:1.25,duration:.25,ease:'back.out(3)',yoyo:true,repeat:1},S[43]-0.05);
outUp('#vt',ST[6]);
starPass('#st3',ST[6]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S6 film
cardIn('#p6',ST[6]+0.02); popIn('#t6',ST[6]+0.3,{y:30,s:.5,r:-5});
outUp(['#p6','#t6'],ST[7]);
cta('DRAWING',S[55]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[61]+0.15);
ft('#credit',{opacity:0},{opacity:1,duration:.3},0.3);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
