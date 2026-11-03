"""pixelfx - 244 pixel art effects as code + a Claude Code skill (creator & dev tool, angle relatable-pain / money-saver).
Facts: github.com/patch-gg/pixelfx README (MIT, by Patch): "244 pixel art effects and animations, every one a small piece of
code. Fire, explosions, magic, weather, UI..."; "Play them live, recolor and mirror them, drop them into a browser game, or
export sprite sheets for any engine" (Godot, Unity, GameMaker...); "Plus a Claude Code skill that makes new ones the way a
picky pixel artist would: draft, render, look, refine." Code lines on screen are from the README "use one." section.
Media: docs/readme/montage.gif and acts.gif from the repo (MIT), cropped and upscaled with nearest-neighbour; the sprite
sheet card is 12 frames of the repo's fire-tornado clip tiled in a grid. Credited on screen and in the caption."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "pixelfx"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json",
         display={7: "pixelfx", 53: "Comment", 54: "PIXELFX"}, tail=1.0)
F.scenes([0, 7, 13, 17, 24, 28, 36, 49, 53], hold=0.12)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.vc{position:absolute;border-radius:28px;overflow:hidden;background:#15131d;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.42),0 16px 28px -12px rgba(0,0,0,.2),0 0 0 1px rgba(0,0,0,.06)}
.vc video,.vc img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated}
.tag{position:absolute;background:#ff4b1f;color:#fff;font-weight:800;font-size:40px;padding:10px 24px;border-radius:14px;white-space:nowrap;box-shadow:0 20px 30px -12px rgba(255,75,31,.6)}
.wtag{position:absolute;background:#fff;color:#111;font-weight:800;font-size:38px;padding:10px 24px;border-radius:14px;white-space:nowrap;
 box-shadow:0 24px 40px -14px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05)}
#buy{position:absolute;left:560px;top:760px;display:flex;align-items:center;gap:18px;background:#111;color:#fff;font-weight:800;font-size:46px;padding:22px 40px;border-radius:999px;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.45)}
#buy b{width:56px;height:56px;border-radius:50%;background:#ff4b1f;display:flex;align-items:center;justify-content:center;font-size:34px}
#cnt{position:absolute;left:0;right:0;top:250px;text-align:center;font-weight:800;font-size:150px;letter-spacing:-.06em;line-height:1}
#cnt span{font-family:var(--serif);font-style:italic;font-weight:500;font-size:70px;letter-spacing:-.01em;color:#6f6f6f;margin-left:14px}
#free{position:absolute;left:720px;top:800px;background:#ff4b1f;color:#fff;font-weight:900;font-size:84px;padding:8px 34px;border-radius:22px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
.tm{left:70px;width:940px}
.tm .body{padding:28px 34px;font-size:31px;line-height:1.6;white-space:pre}
.tm .k{color:#ff8a5f}.tm .s{color:#9fd39a}.tm .c{color:#7d7d7d}
.lab{position:absolute;font-family:var(--mono);font-weight:700;font-size:30px;color:#6f6f6f;text-align:center}
#steps{position:absolute;left:60px;right:60px;top:850px;display:flex;justify-content:center;gap:16px}
#steps span{font-family:var(--mono);font-weight:700;font-size:40px;padding:12px 22px;border-radius:16px;background:#fff;color:#b3b3b3;box-shadow:0 16px 26px -12px rgba(0,0,0,.25)}
.vc{z-index:1}
.clip.layer .tag,.clip.layer .wtag,#buy,.clip.layer .chip,#free,.clip.layer .term,#cnt,#steps,.lab{z-index:5}
#credit{position:absolute;left:0;right:0;top:190px;text-align:center;font-family:var(--mono);font-size:24px;color:#8a8a8a}
#c6a{font-size:50px}
"""

def vc(vid, src, x, y, w, h, n, k, extra_style=""):
    return (f'<div id="{vid}" class="vc" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">'
            f'<video id="{vid}v" class="clip" style="{extra_style}" src="assets/{src}" data-start="{F.ST[n]}" data-duration="{round(F.EN[n] - F.ST[n], 2)}" '
            f'data-track-index="{30 + k}" muted playsinline></video></div>')

VID = []  # videos must live outside the scene clip divs (own tracks)
# S0 hook: an effect on screen at t=0 + a "buy" button
VID.append(vc("v0", "v-tornado.mp4", 190, 300, 700, 610, 0, 0))
F.clip(0, '<div id="buy"><b>$</b>Buy pack</div><div class="tag" id="t0" style="left:120px;top:330px">pixel effects</div>'
       + F.block([[(0, 1, "b"), (2, 4, "")], [(5, 6, "hl")]], top=990, size=92))
# S1 montage + counter + FREE
VID.append(vc("v1", "v-montage.mp4", 60, 450, 960, 505, 1, 1))
F.clip(1, '<div id="cnt"><b id="cn">0</b><span>effects</span></div><div id="free">FREE</div>'
       + F.block([[(7, 7, "hl"), (8, 11, "")], [(12, 12, "it")]], top=1000, size=92))
# S2 four effects 2x2
for k, (nm, x, y) in enumerate([("fire", 100, 300), ("plasma", 560, 300), ("portal", 100, 660), ("hole", 560, 660)]):
    VID.append(vc(f"v2{k}", f"v-{nm}.mp4", x, y, 420, 340, 2, 2 + k))
F.clip(2, F.block([[(13, 14, "b")], [(15, 15, "it"), (16, 16, "hl")]], top=1060, size=100))
# S3 code card + small effect
VID.append(vc("v3", "v-crystal.mp4", 600, 600, 380, 330, 3, 6))
F.clip(3, '<div id="t3t" class="term tm" style="top:310px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<span class="k">import</span> * as frostNova <span class="k">from</span>\n  <span class="s">"pixelfx/fx/ice/frost-nova"</span>;\n\n'
          '<span class="k">const</span> fx = createFx(frostNova,\n  { x: 160, y: 140 });\n<span class="c">// one file per effect</span></div></div>'
       + F.block([[(17, 19, ""), (20, 23, "hl")]], top=1060, size=92))
# S4 recolor + mirror: same effect three times
for k, (x, st) in enumerate([(60, ""), (390, "filter:hue-rotate(150deg) saturate(1.3)"), (720, "transform:scaleX(-1)")]):
    VID.append(vc(f"v4{k}", "v-skull.mp4", x, 420, 300, 300, 4, 7 + k, st))
F.clip(4, '<div class="lab" id="l40" style="left:60px;top:360px;width:300px">original</div>'
          '<div class="lab" id="l41" style="left:390px;top:360px;width:300px">recolor</div>'
          '<div class="lab" id="l42" style="left:720px;top:360px;width:300px">mirror</div>'
       + F.block([[(24, 25, "hl")], [(26, 27, "it")]], top=1040, size=104))
# S5 sprite sheet + engines
F.clip(5, '<div id="sh" class="vc" style="left:160px;top:300px;width:760px;height:662px"><img src="assets/sheet.png" alt=""></div>'
          '<div class="wtag" id="t5" style="left:80px;top:270px">sprite sheet · 12 frames</div>'
          + chip("c5a", "Godot", 70, 860, "G", "#478cbf") + chip("c5b", "Unity", 690, 860, "U", "#111")
       + F.block([[(28, 31, "")], [(32, 32, ""), (33, 35, "hl")]], top=1070, size=80))
# S6 Claude Code skill: acted-out move
VID.append(vc("v6", "v-act.mp4", 90, 330, 900, 487, 6, 10))
F.clip(6, chip("c6a", "Claude Code skill", 200, 860, "✳", "#d97757")
       + F.block([[(36, 40, ""), (41, 43, "b")], [(44, 45, ""), (46, 48, "hl")]], top=1040, size=80))
# S7 loop: draft render look refine
VID.append(vc("v7", "v-water.mp4", 290, 310, 500, 440, 7, 11))
F.clip(7, '<div id="steps">' + "".join(f'<span id="p{k}">{p}</span>' for k, p in enumerate(["draft", "render", "look", "refine"])) + '</div>'
       + F.block([[(49, 50, "")], [(51, 51, ""), (52, 52, "hl")]], top=1040, size=104))
# S8 CTA
F.clip(8, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(53, 53, ""), (54, 54, "hl")], [(55, 60, "")]], top=1020, size=84))
F.body[0:0] = VID  # videos below the scene layers (tags, chips, code cards on top)
F.body.append('<div class="layer"><div id="credit">effects: pixelfx by Patch · MIT</div></div>')

S = F.S
for i in (7, 9, 12, 13, 14, 15, 16, 24, 26, 33, 35, 38, 49, 50, 51, 52, 54):
    F.pop(S[i] - 0.05)

JS = r"""
function hideVid(id,n){ tl.set(id,{opacity:0},0); }
function vIn(id,t,o){ o=o||{}; ft(id,{opacity:0,y:o.y??160,scale:o.s??.85,rotationX:o.rx??25,transformPerspective:1400,filter:'blur(14px)'},
  {opacity:1,y:0,scale:1,rotationX:0,filter:'blur(0px)',duration:.7,ease:A},t); }
function vOut(ids,t){ tl.to(ids,{y:-70,opacity:0,filter:'blur(14px)',duration:.24,ease:IN,stagger:.03},t-0.24); }
// S0
ft('#v0',{opacity:1,scale:1.0},{opacity:1,scale:1.06,duration:ST[1],ease:'none'},0);
popIn('#t0',0.05,{y:30,s:.5,r:-8}); popIn('#buy',S[3]-0.15,{y:60,s:.6,r:6});
tl.to('#buy',{scale:.92,duration:.1,yoyo:true,repeat:1},S[3]+0.6);
vOut(['#v0'],ST[1]);
starPass('#st1',ST[1]-0.3,[900,1500,0],[760,1460,50],10,1.2);
// S1 montage + counter
vIn('#v1',ST[1]+0.02);
{ const el=document.getElementById('cn'), O={n:0}; ft(O,{n:0},{n:244,duration:1.0,ease:'power2.out',onUpdate:()=>{el.textContent=Math.round(O.n)}},S[9]-0.1); }
ft('#cnt',{opacity:0,y:40,filter:'blur(10px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.4,ease:A},S[9]-0.15);
ft('#free',{opacity:0,scale:2.6,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[12]-0.08);
vOut(['#v1'],ST[2]);
// S2 four effects pop on their words
[13,14,15,16].forEach((w,k)=>vIn('#v2'+k,S[w]-0.25,{y:120,s:.6,rx:0}));
tl.set(['#v20','#v21','#v22','#v23'],{opacity:0},0);
vOut(['#v20','#v21','#v22','#v23'],ST[3]);
starPass('#st2',ST[3]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S3 code
popIn('#t3t',ST[3]+0.02,{y:60,s:.94,r:0}); vIn('#v3',S[20]-0.2,{y:100,s:.7,rx:0});
vOut(['#v3'],ST[4]);
// S4 recolor / mirror
vIn('#v40',ST[4]+0.02,{y:100,s:.8,rx:0}); vIn('#v41',S[24]+0.1,{y:100,s:.8,rx:0}); vIn('#v42',S[26]-0.1,{y:100,s:.8,rx:0});
ft('#l40',{opacity:0},{opacity:1,duration:.2},ST[4]+0.1); ft('#l41',{opacity:0},{opacity:1,duration:.2},S[24]+0.2); ft('#l42',{opacity:0},{opacity:1,duration:.2},S[26]);
vOut(['#v40','#v41','#v42'],ST[5]);
// S5 sprite sheet
ft('#sh',{opacity:0,y:220,rotationX:30,transformPerspective:1600,scale:.85},{opacity:1,y:0,rotationX:0,scale:1,duration:.8,ease:A},ST[5]+0.02);
tl.to('#sh',{scale:1.04,duration:Math.max(.4,ST[6]-ST[5]-.8),ease:'none'},ST[5]+0.8);
popIn('#t5',ST[5]+0.3,{y:30,s:.5,r:-6}); popIn('#c5a',S[33]-0.12,{y:60,s:.6,r:-6}); popIn('#c5b',S[35]-0.12,{y:60,s:.6,r:6});
// S6 acted move
vIn('#v6',ST[6]+0.02); popIn('#c6a',S[38]-0.12,{y:60,s:.6,r:-4});
vOut(['#v6'],ST[7]);
starPass('#st3',ST[7]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S7 loop steps light up on their words
vIn('#v7',ST[7]+0.02,{y:120,s:.8});
ft('#steps',{opacity:0,y:30},{opacity:1,y:0,duration:.3},ST[7]+0.02);
[49,50,51,52].forEach((w,k)=>ft('#p'+k,{color:'#b3b3b3',backgroundColor:'#ffffff',scale:1},{color:'#ffffff',backgroundColor:k==3?'#ff4b1f':'#111111',scale:1.1,duration:.15},S[w]-0.04));
vOut(['#v7'],ST[8]);
cta('PIXELFX',S[54]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[60]+0.15);
ft('#credit',{opacity:0},{opacity:1,duration:.3},0.3);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
