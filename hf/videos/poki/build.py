"""poki - Poki (JosssphZhou/poki): lets AI agents use a real iPhone (new ability). Free AI tool #3.
Facts (README + docs/tools.md, 2026-11-09): "Poki uses your iPhone like you do"; "Let AI agents operate a real iPhone. Local MCP
server and agent"; MCP clients: Claude Code, Codex; tools send "taps, swipes, hardware keys, and Unicode text"; example task
`poki "Search esp32 in Chrome and summarize the top result"`; "Poki Agent remembers past tasks and runs them faster on repeat";
requires macOS 15+ (Poki targets macOS; Linux/Windows only as community ports). AGPL-3.0 (open source, free).
Media: the project's own site animation docs/images/poki-home.gif (cropped, credited on screen) + poki-icon.png. Rest in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, chip, tile, series, FOLLOW_LINE

W = HERE.parent.parent / "work" / "poki"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", tail=1.4)
F.scenes([0, 7, 14, 23, 33, 42, 52], hold=0.12)
S = F.S

CSS = r"""
.vcard{position:absolute;overflow:hidden;background:#0a6cff;border-radius:34px;box-shadow:0 60px 90px -24px rgba(0,0,0,.42),0 16px 28px -12px rgba(0,0,0,.18)}
.vcard video{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover}
.cred{position:absolute;left:18px;bottom:14px;font-family:var(--mono);font-size:22px;color:#fff;background:rgba(0,0,0,.45);padding:4px 10px;border-radius:8px;z-index:3}
#name{position:absolute;left:110px;top:330px;width:860px;height:300px;padding:56px 60px 0 250px}
#name img{position:absolute;left:56px;top:62px;width:160px;height:160px;border-radius:36px;box-shadow:0 20px 30px -12px rgba(0,0,0,.35)}
#name .t{font-weight:800;font-size:120px;letter-spacing:-.05em;line-height:1}
#name .s{font-family:var(--mono);font-size:28px;color:#6f6f6f;margin-top:26px}
#fr,#os{font-size:46px}
/* drawn phone */
#ph{position:absolute;left:370px;top:280px;width:340px;height:690px;border-radius:58px;background:#111;padding:16px;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.42),0 18px 30px -10px rgba(0,0,0,.2)}
#scr{position:relative;width:100%;height:100%;border-radius:44px;background:#f6f6f6;overflow:hidden}
#isl{position:absolute;left:50%;top:12px;width:96px;height:28px;margin-left:-48px;border-radius:14px;background:#111;z-index:3}
#lst{position:absolute;left:0;right:0;top:120px}
.row{height:72px;margin:0 16px 10px;border-radius:16px;background:#fff;display:flex;align-items:center;gap:14px;padding-left:14px;box-shadow:0 2px 0 rgba(0,0,0,.04)}
.row i{width:40px;height:40px;border-radius:11px;background:#ddd}.row u{height:12px;border-radius:6px;background:#d6d6d6;width:140px;text-decoration:none}
#sfield{position:absolute;z-index:2;left:16px;right:16px;top:58px;height:50px;border-radius:14px;background:#e4e4e4;font-family:var(--sans);font-size:24px;font-weight:600;color:#111;padding:11px 14px}
#sfield b{color:#9a9a9a;font-weight:500}
#kbd{position:absolute;left:0;right:0;bottom:0;height:230px;background:#d4d4d6;display:grid;grid-template-columns:repeat(10,1fr);gap:6px;padding:14px 8px}
#kbd span{background:#fff;border-radius:6px;height:44px}
#dot{position:absolute;width:64px;height:64px;border-radius:50%;background:rgba(255,75,31,.85);box-shadow:0 0 0 10px rgba(255,75,31,.25);z-index:5;opacity:0}
#rip{position:absolute;width:64px;height:64px;border-radius:50%;border:5px solid #ff4b1f;z-index:5;opacity:0}
.lbl{position:absolute;font-family:var(--mono);font-weight:700;font-size:36px;background:#111;color:#fff;padding:10px 22px;border-radius:999px;opacity:0;
 box-shadow:0 20px 30px -12px rgba(0,0,0,.4)}
#c1,#c2{font-size:50px}
#mcp{position:absolute;left:0;right:0;top:770px;text-align:center;font-family:var(--mono);font-weight:700;font-size:30px;color:#6f6f6f}
#ln1,#ln2{position:absolute;top:560px;height:5px;background:#111;border-radius:3px;transform-origin:0 50%}
#term{left:70px;top:360px;width:940px;height:440px}
#tbody{padding:34px 40px;font-size:36px;line-height:1.45;white-space:pre-wrap}
#tbody .p{color:#ff6a3d}.o{color:#9a9a9a;opacity:0}.o.ok{color:#5fd07a}
#mem{position:absolute;left:110px;top:340px;width:860px;height:500px;padding:60px 60px}
.br{display:flex;align-items:center;gap:30px;height:150px}
.br .k{width:230px;font-weight:700;font-size:44px;letter-spacing:-.03em}
.br .bar{height:56px;border-radius:28px;background:#d9d9d9;position:relative;overflow:hidden;flex:none}
.br .bar i{position:absolute;inset:0;border-radius:28px;background:#111;transform-origin:0 50%}
.br.f .bar i{background:#ff4b1f}
#zap{position:absolute;left:640px;top:250px;font-family:var(--mono);font-weight:800;font-size:40px;color:#ff4b1f;opacity:0}
#mac{font-size:52px}
#field{top:640px}
#fol{top:1250px}
"""
PH = ('<div id="ph"><div id="scr"><div id="isl"></div><div id="sfield"><b id="sfp">Search</b><span id="sft"></span></div><div id="lst">'
      + "".join(f'<div class="row" id="rw{k}"><i></i><u style="width:{w}px"></u></div>' for k, w in enumerate([150, 110, 170, 130, 90, 160]))
      + '</div><div id="kbd">' + "<span></span>" * 30 + '</div><div id="rip"></div><div id="dot"></div></div></div>')
TERM = ('<div id="term" class="term"><div class="bar"><i></i><i></i><i></i></div><div id="tbody"><span class="p">$</span> <span id="cmd"></span>\n'
        '<span class="o" id="o1">→ opening Chrome on your iPhone</span>\n<span class="o" id="o2">→ searching "esp32"</span>\n'
        '<span class="o ok" id="o3">✓ summary of the top result</span></div></div>')

F.body.append('<div class="layer" id="serl">' + series("Free AI tool", 3, x=70, y=190) + '</div>')
F.clip(0, '<div id="vw" class="vcard" style="left:100px;top:290px;width:880px;height:711px"><video id="vh" class="clip" src="assets/v-home.mp4" '
          f'data-start="0" data-duration="{round(F.EN[0], 2)}" data-track-index="30" muted playsinline></video><div class="cred">video: poki.bot</div></div>'
       + F.block([[(0, 3, "")], [(4, 5, ""), (6, 6, "hl")]], top=1050, size=96))
F.clip(1, '<div id="name" class="card"><img src="assets/poki-icon.png" alt=""><div class="t">Poki</div><div class="s">github.com/JosssphZhou/poki</div></div>'
       + chip("fr", "Free", 150, 680, "✓", "#2e9e4a") + chip("os", "Open source", 450, 680, "{}", "#111")
       + F.block([[(7, 7, "b"), (8, 10, "")], [(11, 11, "hl"), (12, 13, "")]], top=960, size=88))
F.clip(2, PH + '<div class="lbl" id="la" style="left:110px;top:420px">tap</div><div class="lbl" id="lb" style="left:760px;top:560px">swipe</div>'
          '<div class="lbl" id="lc" style="left:110px;top:760px">type</div>'
       + F.block([[(14, 14, "b"), (15, 15, "b"), (16, 16, "")], [(17, 17, "hl"), (18, 20, "")], [(21, 22, "it")]], top=1020, size=80))
F.clip(3, tile("tp", "apk", 420, 330, s=240, acc=True) + '<div id="ln1" style="left:290px;top:600px;width:175px;transform:rotate(-25deg)"></div>'
          '<div id="ln2" style="left:625px;top:528px;width:175px;transform:rotate(25deg)"></div>'
          + chip("c1", "Claude Code", 70, 620, "✳", "#d97757") + chip("c2", "Codex", 690, 620, "◎", "#111") + '<div id="mcp">via MCP</div>'
       + F.block([[(23, 25, "")], [(26, 27, "hl"), (28, 28, ""), (29, 29, "b")], [(30, 32, "it")]], top=890, size=78))
F.clip(4, TERM + F.block([[(33, 36, "mono")], [(37, 41, "")]], top=920, size=72))
F.clip(5, '<div id="mem" class="card"><div class="br"><div class="k">First time</div><div class="bar" style="width:500px"><i id="b1"></i></div></div>'
          '<div class="br f"><div class="k">Next time</div><div class="bar" style="width:220px"><i id="b2"></i></div></div>'
          '<div id="zap">⚡ faster</div></div>'
       + F.block([[(42, 45, "")], [(46, 48, ""), (49, 49, "hl"), (50, 51, "it")]], top=960, size=84))
F.clip(6, chip("mac", "Needs a Mac", 300, 400, "⌘", "#111")
       + '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(52, 53, ""), (54, 55, "hl")], [(56, 56, ""), (57, 57, "b")], [(58, 63, "")]], top=880, size=76)
       + FOLLOW_LINE.replace('class="follow"', 'class="follow" id="fol"'))

for i in (6, 10, 11, 14, 15, 17, 26, 29, 34, 43, 49, 55):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 the project's own animation is already playing at t=0, slow push
ft('#vw',{opacity:1,scale:.98},{opacity:1,scale:1.04,duration:ST[1],ease:'none'},0);
outUp('#vw',ST[1]);
starPass('#st1',ST[1]-0.3,[760,-700,0],[600,-520,40],10,1.2);
// S1 name card + chips
ft('#name',{opacity:0,y:120,rotationX:30,transformPerspective:1400,filter:'blur(12px)'},{opacity:1,y:0,rotationX:0,filter:'blur(0px)',duration:.7,ease:A},ST[1]+0.02);
popIn('#fr',S[10]-0.15,{y:60,s:.6,r:-6}); popIn('#os',S[11]-0.15,{y:60,s:.6,r:6});
outUp(['#name','#fr','#os'],ST[2]);
// S2 drawn phone: tap, swipe, type
ft('#ph',{opacity:0,y:160,rotationY:-25,transformPerspective:1600,filter:'blur(10px)'},{opacity:1,y:0,rotationY:0,filter:'blur(0px)',duration:.6,ease:A},ST[2]+0.02);
popIn('#la',S[14]-0.1,{y:30,s:.6,r:-6});
ft('#dot',{opacity:0,x:120,y:230,scale:1.4},{opacity:1,x:120,y:230,scale:1,duration:.15,ease:'power2.out'},S[14]-0.05);
ft('#rip',{opacity:1,x:120,y:230,scale:1},{opacity:0,x:120,y:230,scale:2.6,duration:.45,ease:'power2.out'},S[14]+0.1);
ft('#rw1',{backgroundColor:'#fff'},{backgroundColor:'#ffd9cc',duration:.15},S[14]+0.08);
popIn('#lb',S[15]-0.1,{y:30,s:.6,r:6});
ft('#dot',{x:120,y:230},{x:150,y:470,duration:.01},S[15]-0.06);
ft('#dot',{x:150,y:470},{x:150,y:150,duration:.45,ease:'power2.inOut'},S[15]);
ft('#lst',{y:0},{y:-90,duration:.5,ease:'power2.out'},S[15]+0.05);
tl.to('#dot',{opacity:0,duration:.12},S[15]+0.5);
popIn('#lc',S[17]-0.1,{y:30,s:.6,r:-4});
ft('#kbd',{y:240},{y:0,duration:.35,ease:A},S[16]);
tl.set('#sfp',{display:'none'},S[17]);
const sft=document.getElementById('sft'), TT={n:0}, WRD='esp32';
ft(TT,{n:0},{n:5,duration:.8,ease:'steps(5)',onUpdate:()=>{sft.textContent=WRD.slice(0,Math.round(TT.n))}},S[17]);
outUp(['#ph','#la','#lb','#lc'],ST[3]);
starPass('#st2',ST[3]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S3 Claude Code / Codex plug into the phone
popIn('#tp',ST[3]+0.02,{y:80,s:.6,r:-8});
ft('#ln1',{scaleX:0},{scaleX:1,duration:.35,ease:'power3.out'},S[26]-0.05);
ft('#ln2',{scaleX:0},{scaleX:1,duration:.35,ease:'power3.out'},S[29]-0.05);
popIn('#c1',S[26]-0.15,{y:60,s:.6,r:-6}); popIn('#c2',S[29]-0.15,{y:60,s:.6,r:6});
ft('#mcp',{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:A},S[29]+0.2);
outUp(['#tp','#ln1','#ln2','#c1','#c2','#mcp'],ST[4]);
// S4 terminal: the README's example task
ft('#term',{opacity:0,y:140,scale:.9,filter:'blur(14px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.55,ease:A},ST[4]+0.02);
const cmd=document.getElementById('cmd'), CT={n:0}, CTX='poki "Search esp32 in Chrome and summarize the top result"';
ft(CT,{n:0},{n:CTX.length,duration:2.4,ease:'steps('+CTX.length+')',onUpdate:()=>{cmd.textContent=CTX.slice(0,Math.round(CT.n))}},ST[4]+0.25);
ft('#o1',{opacity:0,x:-20},{opacity:1,x:0,duration:.3,ease:A},ST[4]+2.8);
ft('#o2',{opacity:0,x:-20},{opacity:1,x:0,duration:.3,ease:A},ST[4]+3.1);
ft('#o3',{opacity:0,x:-20},{opacity:1,x:0,duration:.3,ease:A},S[41]-0.1);
outUp('#term',ST[5]);
// S5 remembers -> faster next time
ft('#mem',{opacity:0,y:140,rotationX:25,transformPerspective:1400,filter:'blur(12px)'},{opacity:1,y:0,rotationX:0,filter:'blur(0px)',duration:.6,ease:A},ST[5]+0.02);
ft('#b1',{scaleX:0},{scaleX:1,duration:1.3,ease:'power1.inOut'},S[43]);
ft('#b2',{scaleX:0},{scaleX:1,duration:.4,ease:'power3.out'},S[47]);
ft('#zap',{opacity:0,scale:.5},{opacity:1,scale:1,duration:.4,ease:'back.out(2.2)'},S[49]-0.05);
outUp('#mem',ST[6]);
starPass('#st3',ST[6]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S6 caveat + CTA + follow
popIn('#mac',ST[6]+0.05,{y:60,s:.6,r:-5});
cta('POKI',S[57]);
ft('#fol',{opacity:0,y:30},{opacity:.85,y:0,duration:.4,ease:A},S[59]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[63]+0.15);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
