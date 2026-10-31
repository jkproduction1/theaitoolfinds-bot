"""Claude-Mem - persistent memory plugin for Claude Code (creator & dev).
Facts: github.com/thedotmack/claude-mem README (Apache-2.0): "Persistent memory compression system built for Claude Code";
"automatically capturing tool usage observations, generating semantic summaries, and making them available to future
sessions"; "Context from previous sessions will automatically appear in new sessions"; install /plugin marketplace add
thedotmack/claude-mem + /plugin install claude-mem; SQLite database stores sessions/observations/summaries (local worker);
"mem-search Skill - Natural language queries"; "Use <private> tags to exclude sensitive content from storage";
optional hosted observer (30-day trial, then falls back to your Anthropic plan unless you subscribe) + optional Cloud Sync.
Media: README logomark + a crop of the README preview GIF (the claude-mem viewer). Rest drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "claudemem"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json")
F.scenes([0, 7, 12, 17, 23, 31, 36, 42, 52, 61, 69, 78], hold=0.15)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.tm{left:110px;width:860px}
.tm .body{padding:34px 40px;font-size:36px;line-height:1.55}
.tm .p{color:#ff4b1f}.tm .g{color:#7ddc8a}.tm .d{color:#8a8a8a}
#x0{position:absolute;left:880px;top:300px;width:120px;height:120px;border-radius:50%;background:#ff4b1f;color:#fff;font-size:70px;font-weight:800;
 display:flex;align-items:center;justify-content:center;box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
.mc{position:absolute;background:#fff;border-radius:22px;padding:20px 30px;font-size:38px;font-weight:600;white-space:nowrap;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05)}
.mc em{font-style:normal;font-family:var(--mono);font-size:30px;color:#ff4b1f;margin-right:14px}
#nm{position:absolute;left:0;right:0;top:640px;text-align:center;font-size:150px;font-weight:800;letter-spacing:-.06em;line-height:1}
#nm i{font-family:var(--serif);font-weight:500;letter-spacing:-.01em}
#mark{position:absolute;left:390px;top:300px;width:300px;height:290px}
#mark img{width:100%;height:100%;filter:drop-shadow(0 30px 40px rgba(255,75,31,.35))}
#free{position:absolute;left:640px;top:330px;background:#ff4b1f;color:#fff;font-weight:800;font-size:68px;padding:12px 34px;border-radius:22px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#lic{position:absolute;left:160px;top:360px;background:#111;color:#fff;font-family:var(--mono);font-weight:700;font-size:40px;padding:16px 30px;border-radius:18px}
.ev{position:absolute;left:110px;width:860px;height:96px;border-radius:24px;background:#fff;display:flex;align-items:center;gap:22px;padding:0 30px;font-size:38px;font-weight:600;
 box-shadow:0 30px 50px -20px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.05)}
.ev b{font-family:var(--mono);font-size:30px;background:#111;color:#fff;padding:6px 16px;border-radius:12px}
.ev .ln{flex:1;height:16px;border-radius:8px;background:#e6e6e6}
#rec{position:absolute;left:780px;top:300px;display:flex;align-items:center;gap:14px;background:#111;color:#fff;font-weight:700;font-size:36px;padding:14px 28px;border-radius:40px}
#rec i{width:22px;height:22px;border-radius:50%;background:#ff4b1f}
.lg{position:absolute;left:150px;width:780px;border-radius:22px;background:#fff;padding:26px 30px;box-shadow:0 30px 50px -20px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.05)}
.lg i{display:block;height:16px;border-radius:8px;background:#e3e3e3;margin:12px 0}
#sum{position:absolute;left:250px;top:560px;width:580px;border-radius:30px;background:#111;color:#fff;padding:34px 40px;box-shadow:0 50px 80px -24px rgba(0,0,0,.5)}
#sum .h{font-family:var(--mono);font-size:28px;color:#ff4b1f}
#sum .t{font-size:44px;font-weight:700;letter-spacing:-.03em;margin-top:10px;line-height:1.2}
#db{position:absolute;left:600px;top:420px;width:300px;height:360px}
#db .c{position:absolute;left:0;width:300px;height:110px;border-radius:50%;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06)}
#db .body{position:absolute;left:0;top:55px;width:300px;height:250px;background:linear-gradient(90deg,#f4f4f4,#fff 40%,#e9e9e9);box-shadow:0 50px 70px -24px rgba(0,0,0,.35)}
#db .r{position:absolute;left:0;width:300px;height:110px;border-radius:50%;border-bottom:4px solid #d5d5d5}
#db .lab{position:absolute;left:0;right:0;top:150px;text-align:center;font-family:var(--mono);font-weight:700;font-size:36px}
#arr{position:absolute;left:420px;top:560px;font-size:110px;font-weight:300;color:#ff4b1f}
#ctx{position:absolute;left:150px;top:600px;width:780px;border-radius:22px;background:#ff4b1f;color:#fff;padding:24px 30px;font-size:34px;font-weight:600;line-height:1.4;
 box-shadow:0 40px 60px -20px rgba(255,75,31,.55)}
#ctx b{font-family:var(--mono);font-size:28px;opacity:.85;display:block}
#sf{position:absolute;left:110px;top:330px;width:860px;height:120px;border-radius:60px;background:#fff;display:flex;align-items:center;padding-left:44px;font-size:40px;font-weight:600;
 box-shadow:0 40px 70px -20px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
#sf svg{width:54px;height:54px;margin-right:22px}
#sft{color:#111}
#vw{position:absolute;left:250px;top:480px;width:580px;height:460px;border-radius:26px;overflow:hidden;background:#141414;box-shadow:0 60px 90px -24px rgba(0,0,0,.45)}
#vw video{position:absolute;left:0;top:0;width:100%;height:auto}
#cd{position:absolute;left:110px;top:360px;width:860px;border-radius:30px;background:#fff;padding:40px 46px;font-family:var(--mono);font-size:38px;line-height:1.6;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05)}
#cd .tg{color:#ff4b1f;font-weight:700}
#cd .sec{position:relative;display:inline-block}
#cd .bar{position:absolute;left:-4px;right:-4px;top:6px;bottom:6px;background:#111;border-radius:8px;transform-origin:0 50%}
#lock{position:absolute;left:770px;top:700px}
#cloud{position:absolute;left:150px;top:380px;width:330px;height:330px}
#loc{position:absolute;left:600px;top:380px;width:330px;height:330px}
.tg2{position:absolute;top:740px;width:330px;text-align:center;font-weight:700;font-size:40px}
.tg2 span{display:inline-block;padding:10px 24px;border-radius:30px}
#tgc{left:150px}#tgc span{background:#dcdcdc;color:#6f6f6f}
#tgl{left:600px}#tgl span{background:#111;color:#fff}
"""

BRAIN = ('<svg viewBox="0 0 100 100" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">'
         '<path d="M50 20v60M50 20c-10-8-28-4-28 12-10 4-10 22 0 26-2 14 16 22 28 12M50 20c10-8 28-4 28 12 10 4 10 22 0 26 2 14-16 22-28 12"/></svg>')
SRCH = '<svg viewBox="0 0 100 100" fill="none" stroke="#ff4b1f" stroke-width="9" stroke-linecap="round"><circle cx="44" cy="44" r="28"/><path d="M66 66l22 22"/></svg>'
CLOUD = ('<div id="cloud" class="tile" style="padding:60px"><svg viewBox="0 0 100 100" fill="none" stroke="#b3b3b3" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">'
         '<path d="M28 72h46a16 16 0 000-32 22 22 0 00-42-6 18 18 0 00-4 38z"/></svg></div>')

# S0 a Claude Code session that's about to close
F.clip(0, '<div id="t0" class="term tm" style="top:330px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> claude</div><div class="d">● Read src/auth/login.ts</div><div class="d">● Edit src/auth/session.ts</div>'
          '<div><span class="g">✓</span> fixed the login bug</div><div class="d">● Bash npm test  <span class="g">✓ 42 passed</span></div></div></div>'
          '<div id="x0">✕</div>'
       + F.block([[(0, 1, "")], [(2, 3, "b")], [(4, 4, ""), (5, 6, "hl")]], top=990, size=84))
# S1 what it learned, gone
F.clip(1, '<div class="mc" id="m0" style="left:130px;top:360px"><em>learned</em>uses pnpm, not npm</div>'
          '<div class="mc" id="m1" style="left:300px;top:540px"><em>learned</em>tests live in /tests</div>'
          '<div class="mc" id="m2" style="left:170px;top:720px"><em>learned</em>don\'t touch /legacy</div>'
       + F.block([[(7, 9, "")], [(10, 11, "it")]], top=1060, size=100))
# S2 name + logomark
F.clip(2, '<div id="mark"><img src="assets/cm-mark.png" alt=""></div><div id="nm">Claude<i>-Mem</i></div>'
       + F.block([[(12, 12, "b"), (13, 14, "")], [(15, 16, "hl")]], top=1060, size=86))
# S3 free, open source plugin
F.clip(3, '<div id="lic">Apache-2.0</div><div id="free">FREE</div>'
          '<div id="t3" class="term tm" style="top:560px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> <span id="t3c"></span></div><div class="d" id="t3d">✓ plugin installed</div></div></div>'
       + F.block([[(17, 18, ""), (19, 19, "b")], [(20, 21, "hl"), (22, 22, "b")]], top=1060, size=84))
# S4 records what Claude does
F.clip(4, '<div id="rec"><i></i>REC</div>'
          + "".join(f'<div class="ev" id="ev{k}" style="top:{430 + k * 125}px"><b>{t}</b><span>{d}</span><span class="ln"></span></div>'
                    for k, (t, d) in enumerate([("Read", "package.json"), ("Edit", "session.ts"), ("Bash", "npm test"), ("Edit", "login.ts")]))
       + F.block([[(23, 25, "")], [(26, 27, "b"), (28, 28, "")], [(29, 30, "hl")]], top=990, size=80))
# S5 squeezes into short summaries
F.clip(5, "".join(f'<div class="lg" id="lg{k}" style="top:{360 + k * 40}px"><i style="width:90%"></i><i style="width:70%"></i><i style="width:84%"></i><i style="width:60%"></i></div>' for k in range(3))
          + '<div id="sum"><div class="h">summary #128</div><div class="t">Fixed the login bug in session.ts. Tests pass.</div></div>'
       + F.block([[(31, 33, "")], [(34, 35, "hl")]], top=1070, size=104))
# S6 saves on your machine
F.clip(6, tile("lap", "local", 170, 420, 330)
          + '<div id="db"><div class="body"></div><div class="c" style="top:0"></div><div class="r" style="top:150px"></div><div class="r" style="top:250px"></div><div class="lab">SQLite</div></div>'
       + F.block([[(36, 38, "")], [(39, 40, ""), (41, 41, "hl")]], top=1060, size=104))
# S7 next session, context shows up
F.clip(7, '<div id="t7" class="term tm" style="top:330px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> claude</div><div class="d">new session</div></div></div>'
          '<div id="ctx"><b>context from earlier sessions</b>Login bug fixed in session.ts · uses pnpm · tests in /tests</div>'
       + F.block([[(42, 43, "b"), (44, 44, "")], [(45, 46, ""), (47, 48, "hl")], [(49, 51, "it")]], top=990, size=78))
# S8 search history in plain English (real viewer)
F.clip(8, f'<div id="sf">{SRCH}<span id="sft"></span></div>'
       + F.block([[(52, 54, "")], [(55, 57, "b")], [(58, 60, "hl")]], top=990, size=80))
# S9 private tags never stored
F.clip(9, '<div id="cd"><div>deploy with key</div><div><span class="tg">&lt;private&gt;</span></div><div><span class="sec">sk-live-•••••••••••<span class="bar" id="rb"></span></span></div>'
          '<div><span class="tg">&lt;/private&gt;</span></div></div>' + tile("lock", "lock", 770, 640, 230, acc=True)
       + F.block([[(61, 63, "")], [(64, 65, "hl")], [(66, 66, ""), (67, 68, "b")]], top=990, size=80))
# S10 paid cloud is optional
F.clip(10, CLOUD + tile("loc", "local", 600, 380, 330, acc=True)
           + '<div class="tg2" id="tgc"><span>optional</span></div><div class="tg2" id="tgl"><span>enough</span></div>'
        + F.block([[(69, 70, ""), (71, 72, "b")], [(73, 75, ""), (76, 77, "hl")]], top=1060, size=92))
# S11 CTA
F.clip(11, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
        + F.block([[(78, 78, ""), (79, 79, "hl")], [(80, 85, "")]], top=1020, size=84))

F.body.append(f'<div id="vw"><video id="v_view" class="clip" src="assets/v-viewer.mp4" data-start="{F.ST[8]}" '
              f'data-duration="{round(F.EN[8] - F.ST[8], 2)}" data-track-index="30" muted playsinline></video></div>')

S = F.S
for i in (6, 12, 16, 19, 21, 27, 35, 41, 47, 58, 64, 67, 76, 79):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.05;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
// S0 session is there at frame 0, then closes
ft('#t0',{opacity:1,y:50,scale:.97},{opacity:1,y:0,scale:1,duration:1,ease:A},0);
popIn('#x0',S[1]-0.1,{y:30,s:.3,r:-30});
tl.to('#t0 .body>div',{opacity:0,x:-40,filter:'blur(8px)',duration:.3,stagger:.06,ease:IN},S[5]);
tl.to(['#t0','#x0'],{scale:.6,opacity:0,filter:'blur(14px)',duration:.25,ease:IN},ST[1]-0.25);
// S1 learned facts pop, then dissolve
[0,1,2].forEach(k=>popIn('#m'+k,ST[1]+0.05+k*0.14,{y:60,s:.7,r:[-6,4,-3][k]}));
[0,1,2].forEach(k=>tl.to('#m'+k,{opacity:0,y:-80,filter:'blur(18px)',scale:.9,duration:.5,ease:'power2.in'},S[11]+k*0.12));
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 logomark + name
ft('#mark',{opacity:0,scale:.3,rotation:-90,filter:'blur(20px)'},{opacity:1,scale:1,rotation:0,filter:'blur(0px)',duration:.8,ease:'back.out(1.6)'},ST[2]+0.02);
tl.to('#mark',{rotation:30,duration:ST[3]-ST[2],ease:'none'},ST[2]+0.8);
ft('#nm',{opacity:0,scale:1.5,filter:'blur(24px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.55,ease:A},S[12]-0.1);
outUp(['#mark','#nm'],ST[3]);
// S3 badges + plugin install
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[19]-0.05);
popIn('#lic',S[20]-0.05,{y:40,s:.7,r:-6});
popIn('#t3',ST[3]+0.05,{y:80,s:.9,r:0}); typeIn('t3c','/plugin install claude-mem',ST[3]+0.3,.035);
ft('#t3d',{opacity:0},{opacity:1,duration:.2},S[22]);
outUp(['#free','#lic','#t3'],ST[4]);
// S4 events stream in under REC
popIn('#rec',ST[4]+0.05,{y:30,s:.6,r:0});
tl.to('#rec i',{opacity:.2,duration:.3,yoyo:true,repeat:5,ease:'none'},ST[4]+0.4);
[0,1,2,3].forEach(k=>ft('#ev'+k,{opacity:0,x:200,filter:'blur(10px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.5,ease:A},S[26]-0.2+k*0.28));
outUp(['#rec','#ev0','#ev1','#ev2','#ev3'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S5 long logs squeeze into a summary
[0,1,2].forEach(k=>ft('#lg'+k,{opacity:0,y:80},{opacity:1,y:0,duration:.45,ease:A},ST[5]+0.05+k*0.08));
tl.to(['#lg0','#lg1','#lg2'],{scaleY:.15,y:240,opacity:0,duration:.45,ease:'power3.in',stagger:.05},S[33]);
ft('#sum',{opacity:0,scale:.4,filter:'blur(16px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.6,ease:'back.out(1.6)'},S[33]);
outUp('#sum',ST[6]);
// S6 laptop + SQLite
popIn('#lap',ST[6]+0.05,{y:80,s:.6,r:-8});
ft('#db',{opacity:0,y:-200},{opacity:1,y:0,duration:.7,ease:'bounce.out'},S[38]-0.1);
outUp(['#lap','#db'],ST[7]);
// S7 new session + injected context
popIn('#t7',ST[7]+0.05,{y:60,s:.94,r:0});
ft('#ctx',{opacity:0,y:-120,scale:.8,filter:'blur(14px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.7,ease:'back.out(1.5)'},S[47]-0.1);
outUp(['#t7','#ctx'],ST[8]);
// S8 search + real viewer
ft('#sf',{opacity:0,y:-60,scale:.9},{opacity:1,y:0,scale:1,duration:.5,ease:A},ST[8]+0.02);
typeIn('sft','how did we fix the login bug?',ST[8]+0.35,.04);
ft('#vw',{opacity:0,y:-120,scale:.9,rotationX:-20,filter:'blur(12px)',transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,filter:'blur(0px)',duration:.8,ease:A},S[55]-0.1);
outUp(['#sf','#vw'],ST[9]);
starPass('#st3',ST[9]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S9 private tag, secret blacked out
popIn('#cd',ST[9]-0.1,{y:80,s:.92,r:-2});
ft('#rb',{scaleX:0},{scaleX:1,duration:.35,ease:'power3.out'},S[64]);
popIn('#lock',S[67]-0.1,{y:60,s:.4,r:12});
outUp(['#cd','#lock'],ST[10]);
// S10 cloud optional vs local enough
popIn('#cloud',ST[10]+0.05,{y:80,s:.7,r:-6}); popIn('#loc',S[73]-0.1,{y:80,s:.7,r:6});
ft('#tgc',{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:A},S[71]);
tl.to('#cloud',{opacity:.45,scale:.9,duration:.4},S[74]);
ft('#tgl',{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:A},S[76]);
outUp(['#cloud','#loc','#tgc','#tgl'],ST[11]);
cta('MEM',S[79]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[85]+0.15);
tl.to('#typed',{color:'#ff4b1f',duration:.2},S[85]+0.25);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.08)
