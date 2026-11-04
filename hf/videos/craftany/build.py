"""craftany - Craft Anything by ArtCraft / storytold (new-ability, Paper). github.com/storytold/craft-anything, MIT OR Apache-2.0.
Facts (README): "See how any website, app or game works, then have AI build your own version"; "Building needs a coding agent
on your computer. Claude Code is supported first"; Make screen: "pick what to recreate, say what you want, press Start" with
"Type the website's address"; "Every build is compared with the original ... and refined until it's close"; status badge
"early alpha". Screens: docs/images/make.png, project-game.png, project-website.png from the repo (crops)."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "craftany"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", tail=1.0)
F.scenes([0, 7, 15, 21, 30, 37, 44, 51], hold=0.12)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.sc{position:absolute;border-radius:26px;overflow:hidden;background:#141414;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.42),0 16px 28px -12px rgba(0,0,0,.2),0 0 0 1px rgba(0,0,0,.06)}
.sc img{position:absolute;left:0;top:0;width:100%;transform-origin:0 0}
.mw{position:absolute;width:400px;height:520px;border-radius:30px;background:#fff;overflow:hidden;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.28),0 18px 30px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04)}
.mw .tb2{height:56px;background:#f2f2f1;border-bottom:1px solid #e4e4e4}
.mw .hero{margin:30px;height:150px;border-radius:18px;background:#111}
.mw .ln{margin:18px 30px;height:24px;border-radius:12px;background:#e6e6e6}
.mw .bt{margin:30px;width:150px;height:56px;border-radius:28px;background:#111}
#m1 .hero,#m1 .bt{background:#ff4b1f}
.tag{position:absolute;background:#ff4b1f;color:#fff;font-weight:800;font-size:44px;padding:10px 26px;border-radius:14px;white-space:nowrap;box-shadow:0 20px 30px -12px rgba(255,75,31,.6)}
.wtag{position:absolute;background:#fff;color:#111;font-weight:800;font-size:40px;padding:10px 24px;border-radius:14px;white-space:nowrap;
 box-shadow:0 24px 40px -14px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05)}
.lab{position:absolute;font-weight:800;font-size:40px;text-align:center;width:260px;letter-spacing:-.02em}
#ring2{position:absolute;border:7px solid #ff4b1f;border-radius:20px;opacity:0}
.lic{position:absolute;font-family:var(--mono);font-weight:700;font-size:46px;padding:16px 30px;border-radius:18px;background:#141414;color:#fff;white-space:nowrap;box-shadow:0 30px 50px -16px rgba(0,0,0,.45)}
.clip.layer .tag,.clip.layer .wtag,.clip.layer .chip,.lic{z-index:5}
#credit{position:absolute;left:0;right:0;top:190px;text-align:center;font-family:var(--mono);font-size:24px;color:#8a8a8a}
"""

def mock(mid, x, y):
    return (f'<div class="mw" id="{mid}" style="left:{x}px;top:{y}px"><div class="tb2"></div><div class="hero"></div>'
            '<div class="ln"></div><div class="ln" style="width:60%"></div><div class="ln" style="width:75%"></div><div class="bt"></div></div>')

def shot(sid, src, x, y, w, h, iw):
    return f'<div class="sc" id="{sid}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px"><img id="{sid}i" src="assets/{src}" style="width:{iw}px" alt=""></div>'

# S0 hook: an app and a copy sliding out of it ("yours")
F.clip(0, mock("m0", 110, 330) + mock("m1", 570, 330)
          + '<div class="wtag" id="t0a" style="left:150px;top:290px">their app</div><div class="tag" id="t0b" style="left:660px;top:290px">yours</div>'
       + F.block([[(0, 3, "")], [(4, 5, "it"), (6, 6, "hl")]], top=1020, size=92))
# S1 website / app / game tiles
F.clip(1, chip("cc", "Craft Anything", 250, 300, "C", "#2d6cdf")
          + tile("g0", "web", 90, 520, 240) + tile("g1", "desk", 420, 520, 240) + tile("g2", "spark", 750, 520, 240, acc=True)
          + '<div class="lab" id="gl0" style="left:80px;top:790px">website</div><div class="lab" id="gl1" style="left:410px;top:790px">app</div>'
            '<div class="lab" id="gl2" style="left:740px;top:790px">game</div>'
       + F.block([[(7, 8, "hl")], [(9, 11, "")], [(12, 13, ""), (14, 14, "it")]], top=1000, size=84))
# S2 Claude Code builds it: finished snake game project
F.clip(2, shot("p2", "c_game.jpg", 50, 300, 980, 513, 1400) + chip("c2", "Claude Code", 290, 760, "✳", "#d97757")
       + F.block([[(15, 16, ""), (17, 18, "b")], [(19, 19, ""), (20, 20, "hl")]], top=1040, size=84))
# S3 Make screen: address, what you want, Start
F.clip(3, shot("p3", "c_make.jpg", 50, 300, 980, 680, 1600) + '<div id="ring2"></div>'
       + F.block([[(21, 23, "")], [(24, 27, ""), (28, 29, "hl")]], top=1040, size=92))
# S4 compares with the original (page likeness)
F.clip(4, shot("p4", "c_check.jpg", 50, 380, 980, 524, 1400) + '<div class="wtag" id="t4" style="left:110px;top:310px">checked against the original</div>'
       + F.block([[(30, 33, "")], [(34, 35, ""), (36, 36, "hl")]], top=1040, size=84))
# S5 keeps fixing until it's close: progress + likeness
F.clip(5, shot("p5", "c_like.jpg", 280, 300, 520, 600, 520) + '<div class="tag" id="t5" style="left:640px;top:820px">93% alike</div>'
       + F.block([[(37, 40, "")], [(41, 42, "it"), (43, 43, "hl")]], top=1040, size=100))
# S6 free + open source, early alpha
F.clip(6, '<div class="lic" id="lc0" style="left:110px;top:380px">MIT</div><div class="lic" id="lc1" style="left:380px;top:380px">Apache-2.0</div>'
          + tile("g6", "branch", 400, 540, 280) + '<div class="tag" id="t6" style="left:640px;top:780px">early alpha</div>'
       + F.block([[(44, 47, "b")], [(48, 48, ""), (49, 50, "hl")]], top=1040, size=100))
# S7 CTA
F.clip(7, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(51, 51, ""), (52, 52, "hl")], [(53, 58, "")]], top=1020, size=84))
F.body.append('<div class="layer"><div id="credit">screens: Craft Anything by ArtCraft · MIT/Apache-2.0</div></div>')

S = F.S
for i in (6, 7, 11, 12, 14, 17, 20, 29, 36, 43, 44, 50, 52):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 their app -> your copy slides out
tl.set('#m0',{rotation:-4},0);
ft('#m1',{x:-460,rotation:-4,opacity:1},{x:0,rotation:5,duration:.9,ease:A},0.25);
tl.set('#m1',{x:-460,rotation:-4},0);
popIn('#t0a',0.05,{y:30,s:.5,r:-6}); popIn('#t0b',S[6]-0.15,{y:30,s:.5,r:6});
tl.to(['#m0','#m1'],{scale:1.04,duration:ST[1]-1,ease:'none'},1);
outUp(['#m0','#m1','#t0a','#t0b'],ST[1]);
starPass('#st1',ST[1]-0.3,[900,1500,0],[760,1460,50],10,1.2);
// S1
popIn('#cc',ST[1]+0.02,{y:60,s:.7,r:-4});
[[11,0],[12,1],[14,2]].forEach(([w,k])=>{ popIn('#g'+k,S[w]-0.15,{y:120,s:.6,r:-8}); ft('#gl'+k,{opacity:0,y:20},{opacity:1,y:0,duration:.3,ease:A},S[w]+0.05); });
outUp(['#cc','#g0','#g1','#g2','#gl0','#gl1','#gl2'],ST[2]);
// S2 snake project
function shIn(id,t){ ft(id,{opacity:0,y:200,scale:.86,rotationX:24,transformPerspective:1600,filter:'blur(12px)'},{opacity:1,y:0,scale:1,rotationX:0,filter:'blur(0px)',duration:.75,ease:A},t); }
shIn('#p2',ST[2]+0.02); popIn('#c2',S[17]-0.15,{y:60,s:.6,r:-4});
ft('#p2i',{x:0,y:0,scale:1},{x:-420,y:0,scale:1,duration:ST[3]-ST[2],ease:'none'},ST[2]);
outUp(['#p2','#c2'],ST[3]);
// S3 Make screen: zoom to the address field, the request box, then Start
shIn('#p3',ST[3]+0.02);
tl.set('#p3i',{x:0,y:0,scale:.62},0);
tl.to('#p3i',{x:-200,y:-151,scale:.95,duration:.5,ease:IO},S[21]-0.1);
tl.to('#p3i',{x:-401,y:-375,scale:.95,duration:.5,ease:IO},S[24]-0.1);
tl.to('#p3i',{x:-540,y:-375,scale:.95,duration:.45,ease:IO},S[28]-0.15);
tl.set('#ring2',{left:719,top:812,width:200,height:110},0);
ft('#ring2',{opacity:0,scale:1.4},{opacity:1,scale:1,duration:.3,ease:'back.out(2)'},S[29]-0.1);
outUp(['#p3','#ring2'],ST[4]);
starPass('#st2',ST[4]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S4 checks
shIn('#p4',ST[4]+0.02); popIn('#t4',S[34]-0.1,{y:40,s:.6,r:-4});
ft('#p4i',{x:0,y:0,scale:1},{x:-120,y:0,scale:1,duration:ST[5]-ST[4],ease:'none'},ST[4]);
outUp(['#p4','#t4'],ST[5]);
// S5 likeness
shIn('#p5',ST[5]+0.02); popIn('#t5',S[43]-0.2,{y:40,s:.5,r:6});
ft('#p5i',{y:0,scale:1},{y:0,scale:1.0,duration:ST[6]-ST[5],ease:'none'},ST[5]);
outUp(['#p5','#t5'],ST[6]);
starPass('#st3',ST[6]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S6 licence + early alpha
popIn('#lc0',S[44]-0.1,{y:60,s:.6,r:-6}); popIn('#lc1',S[46]-0.1,{y:60,s:.6,r:6});
popIn('#g6',ST[6]+0.05,{y:120,s:.6,r:-8}); popIn('#t6',S[49]-0.12,{y:40,s:.5,r:6});
cta('CRAFT',S[52]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[58]+0.15);
ft('#credit',{opacity:0},{opacity:1,duration:.3},ST[2]);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
