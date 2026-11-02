"""Unslop - Claude Code / Codex skill that turns vibecoded, AI-looking UI into a designed interface (creator & dev,
Jan's pick, angle relatable-pain).
Facts: github.com/heydamir/unslop README (CC BY 4.0, by Damir Sokolovsky @heydamir): "a skill for Claude Code and Codex
that turns vibecoded, AI-looking UI into a designed interface"; "It finds the slop first, the purple gradients, glows,
emoji labels, shouty copy and uneven spacing, then sets a direction from your product and fixes the screen pass by pass
like a designer doing a redline review"; "even on a live site when all you have is a link"; Audit "Lists every sign of
slop with where it lives"; Direction "Character, world, ... a signature detail, all taken from your product";
Passes "Spacing, color, icons, copy, type, layout, details, visuals and motion"; "/unslop this dashboard".
Media: skills/unslop/references/refs (story-dashboard-frames, unslop-dashboard-after, unslop-hero-after), CC BY 4.0,
credited on screen and in the caption. Rest drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "unslop"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display={57: "Comment", 58: "UNSLOP"}, tail=1.0)
F.scenes([0, 5, 9, 14, 18, 28, 36, 42, 46, 57], hold=0.12)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.pg{position:absolute;border-radius:22px;overflow:hidden;background:#fff;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.32),0 16px 28px -12px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.05)}
.pg img{display:block;width:100%;height:auto}
.pg .bar{height:44px;background:#f1f1f0;display:flex;align-items:center;gap:9px;padding-left:18px;font-family:var(--mono);font-size:22px;color:#8a8a8a}
.pg .bar i{width:12px;height:12px;border-radius:50%;background:#d0d0d0}
.pg .bar .url{margin-left:18px;background:#fff;border-radius:8px;padding:2px 14px;color:#111;min-width:420px;height:30px;line-height:28px}
.ring{position:absolute;border:7px solid #ff4b1f;border-radius:50%}
.tag{position:absolute;background:#ff4b1f;color:#fff;font-weight:800;font-size:34px;padding:8px 20px;border-radius:12px;white-space:nowrap;box-shadow:0 20px 30px -12px rgba(255,75,31,.6)}
#stamp{position:absolute;left:150px;top:560px;border:12px solid #ff4b1f;color:#ff4b1f;font-weight:900;font-size:130px;letter-spacing:-.03em;padding:6px 36px;border-radius:24px;transform:rotate(-10deg);
 background:rgba(235,235,234,.88)}
#free{position:absolute;left:700px;top:330px;background:#ff4b1f;color:#fff;font-weight:800;font-size:64px;padding:10px 30px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#wm{position:absolute;left:140px;top:440px;width:800px;height:380px;display:flex;align-items:center;justify-content:center;flex-direction:column}
#wm .t{font-size:210px;font-weight:800;letter-spacing:-.07em;line-height:1}
#wm .t s{text-decoration:none;position:relative;color:#b9b9b9}
#wm .t s::after{content:'';position:absolute;left:-4%;right:-4%;top:52%;height:16px;background:#ff4b1f;transform:scaleX(var(--k,0));transform-origin:0 50%}
#wm .u{font-family:var(--serif);font-style:italic;font-size:54px;color:#6f6f6f;margin-top:10px}
.tm{left:90px;width:900px}
.tm .body{padding:30px 38px;font-size:44px;line-height:1.55}
.tm .p{color:#ff4b1f}.tm .d{color:#8a8a8a}
#c1,#c2{font-size:50px}
.red{position:absolute;left:590px;width:440px;background:#fff;border-radius:16px;padding:14px 20px;font-size:30px;font-weight:700;display:flex;gap:14px;align-items:center;
 box-shadow:0 30px 50px -16px rgba(0,0,0,.3),0 0 0 3px #ff4b1f}
.red b{width:36px;height:36px;border-radius:50%;background:#ff4b1f;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;flex:none}
.dl{position:absolute;left:0;right:0;top:340px;text-align:center;font-family:var(--mono);font-weight:700;font-size:34px;color:#6f6f6f}
.dc{position:absolute;width:300px;height:300px;border-radius:40px;background:#fff;padding:34px;display:flex;flex-direction:column;justify-content:space-between;
 box-shadow:0 50px 70px -22px rgba(0,0,0,.30),0 12px 22px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04)}
.dc .k{font-family:var(--mono);font-size:26px;color:#ff4b1f;font-weight:700}
.dc .v{font-size:46px;font-weight:800;letter-spacing:-.03em;line-height:1.05}
.dc .v i{font-family:var(--serif);font-weight:500}
.fl{position:absolute;left:150px;top:330px;width:780px;height:780px;border-radius:26px;overflow:hidden;background:#111;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.4),0 16px 28px -12px rgba(0,0,0,.18)}
.fl img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
#passes{position:absolute;left:60px;right:60px;top:300px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
#passes span{font-family:var(--mono);font-weight:700;font-size:26px;padding:6px 14px;border-radius:10px;background:#fff;color:#b3b3b3;box-shadow:0 8px 16px -8px rgba(0,0,0,.2)}
#credit{position:absolute;left:0;right:0;top:190px;text-align:center;font-family:var(--mono);font-size:24px;color:#8a8a8a;letter-spacing:-.01em}
"""

def pg(pid, src, x, y, w, bar=True, url=""):
    b = (f'<div class="bar"><i></i><i></i><i></i>' + (f'<span class="url" id="{pid}u">{url}</span>' if url is not None and url != "" else "")
         + '</div>') if bar else ''
    return f'<div id="{pid}" class="pg" style="left:{x}px;top:{y}px;width:{w}px">{b}<img src="assets/{src}" alt=""></div>'

# S0 vibecoded dashboard on screen at t=0, tags fly in on each word
F.clip(0, pg("p0", "s0.jpg", 170, 300, 740)
       + '<div class="tag" id="t1" style="left:80px;top:420px">purple gradient</div>'
       + '<div class="tag" id="t2" style="left:640px;top:600px">glow</div>'
       + '<div class="tag" id="t3" style="left:130px;top:880px">emoji labels</div>'
       + F.block([[(0, 2, "")], [(3, 4, "hl")]], top=1100, size=96))
# S1 stamp VIBECODED
F.clip(1, pg("p1", "s0.jpg", 170, 300, 740) + '<div id="stamp">VIBECODED</div>'
       + F.block([[(5, 5, "b"), (6, 6, "")], [(7, 8, "hl")]], top=1100, size=104))
# S2 Unslop wordmark (drawn) + FREE
F.clip(2, '<div id="wm"><div class="t"><span id="un">un</span><s id="sl">slop</s></div><div class="u" id="wmu">by Damir Sokolovsky</div></div><div id="free">FREE</div>'
       + F.block([[(9, 10, ""), (11, 12, "hl"), (13, 13, "")]], top=1100, size=100))
# S3 harness chips + /unslop command
F.clip(3, '<div id="t3t" class="term tm" style="top:330px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> <span id="t3c"></span></div><div class="d" id="t3d">● auditing the screen…</div></div></div>'
          + chip("c1", "Claude Code", 90, 700, "✳", "#d97757") + chip("c2", "Codex", 620, 700, "◎", "#111")
       + F.block([[(14, 15, "hl"), (16, 17, "b")]], top=1040, size=92))
# S4 audit: every sign of slop
F.clip(4, pg("p4", "s1.jpg", 40, 330, 560)
          + "".join(f'<div class="red" id="r{k}" style="top:{350 + k * 112}px"><b>{k + 1}</b>{t}</div>'
                    for k, t in enumerate(["purple gradients", "glows", "emoji labels", "shouty copy", "uneven spacing"]))
       + F.block([[(18, 20, ""), (21, 24, "hl")], [(25, 27, "")]], top=1020, size=86))
# S5 direction from your product
F.clip(5, '<div class="dl" id="dl">direction</div>'
          + "".join(f'<div class="dc" id="d{k}" style="left:{x}px;top:{y}px"><div class="k">{a}</div><div class="v">{b}</div></div>'
                    for k, (a, b, x, y) in enumerate([("01", "Char&shy;acter", 60, 420), ("02", "World", 390, 470), ("03", "<i>Signature</i> detail", 720, 420)]))
       + F.block([[(28, 30, ""), (31, 32, "hl")], [(33, 35, "it")]], top=1020, size=92))
# S6 pass by pass: story frames flip
F.clip(6, '<div id="passes">' + "".join(f'<span id="ps{k}">{p}</span>' for k, p in enumerate(["spacing", "color", "icons", "copy", "type", "layout", "details"])) + '</div>'
          + '<div class="fl" id="fl" style="top:400px;left:190px;width:700px;height:700px">' + "".join(f'<img id="f{k}" src="assets/s{k}.jpg" alt="">' for k in range(8)) + '</div>'
       + F.block([[(36, 38, ""), (39, 41, "hl")]], top=1150, size=100))
# S7 the finished screen
F.clip(7, pg("p7", "after.jpg", 150, 300, 780, bar=False)
       + F.block([[(42, 44, ""), (45, 45, "hl")]], top=1130, size=104))
# S8 live site from a link
F.clip(8, pg("p8", "heroafter.jpg", 60, 400, 960, url=" ") + '<div class="tag" id="t8" style="left:640px;top:330px">just a link</div>'
       + F.block([[(46, 49, ""), (50, 52, "hl")], [(53, 56, "")]], top=1020, size=90))
# S9 CTA
F.clip(9, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(57, 57, ""), (58, 58, "hl")], [(59, 64, "")]], top=1020, size=84))
F.body.append('<div class="layer"><div id="credit">screens: Damir Sokolovsky (@heydamir) · CC BY 4.0</div></div>')

S = F.S
for i in (1, 3, 5, 7, 11, 14, 16, 21, 31, 39, 45, 50, 58):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.05;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
// S0 page present at t=0 with a slow push, tags on their words
ft('#p0',{opacity:1,y:30,scale:.97},{opacity:1,y:0,scale:1,duration:1,ease:A},0);
tl.to('#p0',{scale:1.04,duration:2,ease:'none'},1);
popIn('#t1',0.05,{y:30,s:.5,r:-8}); popIn('#t2',S[2]-0.1,{y:30,s:.5,r:6}); popIn('#t3',S[3]-0.1,{y:30,s:.5,r:-5});
tl.to(['#p0','#t1','#t2','#t3'],{opacity:0,duration:.01},ST[1]-0.01);
// S1 stamp slams, page desaturates
ft('#p1',{scale:1.04},{scale:1.04,duration:.01},ST[1]);
ft('#stamp',{opacity:0,scale:2.6,rotation:-25,filter:'blur(10px)'},{opacity:1,scale:1,rotation:-10,filter:'blur(0px)',duration:.35,ease:'back.out(2.2)'},S[7]-0.08);
tl.to('#p1',{filter:'grayscale(1) blur(3px)',opacity:.55,duration:.3},S[7]);
outUp(['#p1','#stamp'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 wordmark: "slop" gets struck through
ft('#wm',{opacity:0,scale:.6,filter:'blur(20px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.6,ease:A},ST[2]+0.02);
ft('#sl',{'--k':0},{'--k':1,duration:.35,ease:'power2.out'},ST[2]+0.45);
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[11]-0.08);
outUp(['#wm','#free'],ST[3]);
// S3 terminal + chips
popIn('#t3t',ST[3]+0.02,{y:60,s:.94,r:0}); typeIn('t3c','/unslop this dashboard',ST[3]+0.15,.04);
ft('#t3d',{opacity:0},{opacity:1,duration:.2},ST[3]+1.2);
popIn('#c1',S[14]-0.15,{y:60,s:.6,r:-6}); popIn('#c2',S[17]-0.15,{y:60,s:.6,r:6});
outUp(['#t3t','#c1','#c2'],ST[4]);
// S4 audit list
popIn('#p4',ST[4]+0.02,{y:80,s:.9,r:-3});
[0,1,2,3,4].forEach(k=>ft('#r'+k,{opacity:0,x:140,filter:'blur(8px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.4,ease:A},S[20]+k*0.22));
outUp(['#p4','#r0','#r1','#r2','#r3','#r4'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S5 direction cards
ft('#dl',{opacity:0,y:-20},{opacity:1,y:0,duration:.3},ST[5]+0.05);
[0,1,2].forEach(k=>ft('#d'+k,{opacity:0,y:160,rotationX:40,transformPerspective:1200,scale:.8},{opacity:1,y:0,rotationX:0,scale:1,duration:.7,ease:'back.out(1.4)'},ST[5]+0.1+k*0.18));
outUp(['#dl','#d0','#d1','#d2'],ST[6]);
// S6 frames flip pass by pass, pass labels light up
ft('#fl',{opacity:0,y:200,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.6,ease:A},ST[6]+0.02);
{ const span=Math.max(1.2,ST[7]-ST[6]-0.5); for(let k=0;k<8;k++){ tl.set('#f'+k,{opacity:0},0); tl.set('#f'+k,{opacity:1},ST[6]+0.05+k*span/8); }
  for(let k=0;k<7;k++) ft('#ps'+k,{color:'#b3b3b3',backgroundColor:'#ffffff',scale:1},{color:'#ffffff',backgroundColor:'#111111',scale:1.08,duration:.15},ST[6]+0.1+k*span/7); }
ft('#passes',{opacity:0,y:-20},{opacity:1,y:0,duration:.3},ST[6]+0.02);
outUp(['#fl','#passes'],ST[7]);
// S7 finished dashboard
ft('#p7',{opacity:0,y:220,rotationX:28,transformPerspective:1600,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.8,ease:A},ST[7]+0.02);
tl.to('#p7',{scale:1.04,duration:Math.max(.4,ST[8]-ST[7]-.8),ease:'none'},ST[7]+0.8);
outUp('#p7',ST[8]);
starPass('#st3',ST[8]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S8 live site
popIn('#p8',ST[8]+0.02,{y:80,s:.9,r:2}); typeIn('p8u','https://your-site.com',ST[8]+0.3,.04);
popIn('#t8',S[53]-0.15,{y:30,s:.5,r:6});
outUp(['#p8','#t8'],ST[9]);
cta('UNSLOP',S[58]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[64]+0.15);
ft('#credit',{opacity:0},{opacity:1,duration:.3},0.3);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
