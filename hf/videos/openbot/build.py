"""OpenBot - one local-first desktop app for persistent AI teammates (pillar: creator/dev tool).
Facts: github.com/nightly-labs/openbot README: "a local-first desktop workspace for persistent AI teammates"; supports
Codex App Server, Claude Code, Grok CLI, OpenCode, Gemini, Cursor CLI, Cline CLI; "gives every agent its own workspace
and conversation"; "Persistent agents"; "FIFO message queues with pause, resume, cancellation"; "Agent-to-agent
messages ... and managed file transfers"; "A persistent embedded browser that agents can open, inspect, and control";
WARNING "OpenBot is a development preview. Agents currently run with danger-full-access ... Run only agents and tasks
you trust"; License PolyForm Noncommercial 1.0.0 (=> free for non-commercial use, not "open source").
macOS / Windows / Linux. Media: official app icon (build/icon-production.png). Everything else drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "openbot"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json")
F.scenes([0, 10, 18, 32, 43, 51, 60, 66, 81, 85])

CSS = r"""
.tw{position:absolute;width:500px;height:300px}
.tw .body{padding:22px 28px;font-size:28px;line-height:1.5}
.tw .nm{color:#ff4b1f;font-weight:700}.tw .g{color:#8a8a8a}
#app{left:90px;top:330px;width:900px;height:620px;overflow:hidden;display:flex}
#app .side{width:270px;background:#f4f4f3;padding:30px 22px;border-right:2px solid #ececec}
#app .lg{display:flex;align-items:center;gap:14px;font-weight:800;font-size:34px;letter-spacing:-.03em;margin-bottom:26px}
#app .lg img{width:56px;height:56px;border-radius:14px}
.ag{display:flex;align-items:center;gap:14px;padding:14px 14px;border-radius:16px;font-weight:700;font-size:28px;margin-bottom:8px}
.ag b{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px}
.ag.on{background:#fff;box-shadow:0 10px 20px -10px rgba(0,0,0,.2)}
#app .main{flex:1;padding:30px 34px;position:relative}
.bub{position:absolute;padding:18px 26px;border-radius:24px;font-size:28px;font-weight:600;max-width:420px}
.bub.me{right:34px;background:#111;color:#fff;border-bottom-right-radius:6px}
.bub.ai{left:34px;background:#f1f1f0;border-bottom-left-radius:6px}
#ws{position:absolute;left:34px;top:30px;display:flex;align-items:center;gap:14px;font-family:var(--mono);font-weight:700;font-size:28px;color:#6f6f6f}
#ws svg{width:50px;height:50px}
#pin{position:absolute;right:30px;top:24px;background:#ff4b1f;color:#fff;font-weight:800;font-size:26px;padding:8px 16px;border-radius:12px}
#bigapp{position:absolute;left:390px;top:330px;width:300px;height:300px;border-radius:70px;overflow:hidden;box-shadow:0 60px 90px -20px rgba(0,0,0,.35)}
#bigapp img{width:100%;height:100%}
#appname{position:absolute;left:0;right:0;top:690px;text-align:center;font-size:120px;font-weight:800;letter-spacing:-.06em}
.qc{position:absolute;left:180px;width:720px;height:120px;border-radius:26px;background:#fff;display:flex;align-items:center;gap:24px;padding:0 30px;font-size:36px;font-weight:700;
 box-shadow:0 30px 50px -18px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.05)}
.qc b{width:64px;height:64px;border-radius:18px;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:30px}
.qc span{color:#8a8a8a;font-weight:500;margin-left:auto;font-family:var(--mono);font-size:28px}
#pp{position:absolute;left:430px;top:300px;width:220px;height:220px;border-radius:50%;background:#ff4b1f;box-shadow:0 40px 60px -20px rgba(255,75,31,.6)}
#pp .pa,#pp .pl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
#pp .pa i{display:block;width:30px;height:96px;background:#fff;border-radius:8px;margin:0 12px}
#pp .pl i{display:block;width:0;height:0;border-left:80px solid #fff;border-top:50px solid transparent;border-bottom:50px solid transparent;margin-left:20px}
.av{position:absolute;width:230px;height:230px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:56px;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.35)}
#msg{position:absolute;left:340px;top:420px;padding:18px 28px;border-radius:26px;background:#fff;font-weight:700;font-size:34px;box-shadow:0 30px 50px -18px rgba(0,0,0,.28)}
#file{position:absolute;left:440px;top:680px;display:flex;align-items:center;gap:14px;padding:16px 26px;border-radius:20px;background:#111;color:#fff;font-family:var(--mono);font-weight:700;font-size:32px}
#file i{display:block;width:34px;height:42px;background:#ff4b1f;border-radius:6px}
#brw{left:120px;top:330px;width:840px;height:600px}
#brw .tb2{height:66px;background:#f1f1f0;display:flex;align-items:center;gap:12px;padding-left:28px;border-radius:30px 30px 0 0}
#brw .tb2 i{width:16px;height:16px;border-radius:50%;background:#d0d0d0}
#brw .tb2 u{margin-left:28px;width:480px;height:38px;border-radius:19px;background:#fff;text-decoration:none;font-family:var(--mono);font-size:22px;color:#8a8a8a;display:flex;align-items:center;padding-left:18px}
#brw .hd{margin:40px 50px 0;height:30px;width:55%;border-radius:15px;background:#e6e6e6}
#brw .ln{margin:20px 50px 0;height:18px;border-radius:9px;background:#efefef}
#brw .bt{position:absolute;left:50px;top:330px;width:260px;height:90px;border-radius:20px;background:#111}
#agb{position:absolute;right:30px;top:90px;display:flex;align-items:center;gap:12px;background:#ff4b1f;color:#fff;font-weight:700;font-size:26px;padding:10px 18px;border-radius:14px}
#cur{position:absolute;left:600px;top:500px;width:70px;height:70px}
#ring{position:absolute;left:150px;top:345px;width:90px;height:90px;border-radius:50%;border:5px solid #ff4b1f;opacity:0}
#warn{left:150px;top:330px;width:780px;padding:40px 44px}
#warn .t{display:flex;align-items:center;gap:22px;font-size:52px;font-weight:800;letter-spacing:-.03em}
#warn .t b{width:80px;height:80px;border-radius:22px;background:#ff4b1f;color:#fff;display:flex;align-items:center;justify-content:center;font-size:52px}
#warn .r{display:flex;align-items:center;gap:18px;margin-top:26px;font-family:var(--mono);font-weight:700;font-size:32px;white-space:nowrap}
#warn .r i{white-space:nowrap;font-style:normal;background:#111;color:#fff;border-radius:10px;padding:4px 14px}
#lic{left:200px;top:400px;width:680px;height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
#lic .big{font-size:120px;font-weight:800;letter-spacing:-.06em;line-height:1}
#lic .sm{font-family:var(--mono);font-size:34px;color:#6f6f6f;margin-top:24px}
#stamp{position:absolute;left:660px;top:330px;background:#ff4b1f;color:#fff;font-weight:800;font-size:64px;padding:14px 36px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
"""

# S0 five messy terminals
TW = [("claude", 60, 300, -7), ("codex", 520, 330, 6), ("grok", 140, 560, 4), ("claude", 560, 610, -5), ("codex", 300, 450, 2)]
tws = "".join(f'<div id="tw{k}" class="term tw" style="left:{x}px;top:{y}px;transform:rotate({r}deg)"><div class="bar"><i></i><i></i><i></i></div>'
              f'<div class="body"><div><span class="nm">{n}</span> <span class="g">›</span></div><div class="g">thinking…</div></div></div>' for k, (n, x, y, r) in enumerate(TW))
F.clip(0, tws + F.block([[(0, 0, "it"), (1, 5, "b")], [(6, 9, "hl")]], top=1040, size=78))
# S1 one app
F.clip(1, '<div id="bigapp"><img src="assets/logo.png" alt=""></div><div id="appname">OpenBot</div>'
       + F.block([[(10, 10, "b"), (11, 13, "")], [(14, 15, ""), (16, 17, "hl")]], top=1060, size=84))
# S2 app window: agents, own workspace, own chat, persistent
AG = [("Claude", "#d97757", "C"), ("Codex", "#111", "›"), ("Grok", "#3a3a3a", "G"), ("Designer", "#ff4b1f", "D")]
side = "".join(f'<div class="ag{" on" if k == 0 else ""}" id="ag{k}"><b style="background:{c}">{g}</b>{n}</div>' for k, (n, c, g) in enumerate(AG))
F.clip(2, f'<div id="app" class="card"><div class="side"><div class="lg"><img src="assets/logo.png" alt="">OpenBot</div>{side}</div>'
          '<div class="main"><div id="ws"><svg viewBox="0 0 100 100" fill="none" stroke="#6f6f6f" stroke-width="7" stroke-linejoin="round"><path d="M10 26h30l8 10h42v44H10z"/></svg>~/agents/claude</div>'
          '<div id="pin">persistent</div>'
          '<div class="bub me" id="b0" style="top:150px">Fix the login page</div><div class="bub ai" id="b1" style="top:260px">On it. Opened auth.tsx</div>'
          '<div class="bub me" id="b2" style="top:400px">And yesterday\'s task?</div><div class="bub ai" id="b3" style="top:500px">Done, still here.</div></div></div>'
       + F.block([[(18, 20, ""), (21, 23, "b")], [(24, 27, "b")], [(28, 29, ""), (30, 31, "hl")]], top=1000, size=72))
# S3 queue with pause / resume
QC = [("1", "Write tests", "queued"), ("2", "Update docs", "queued"), ("3", "Ship release", "queued")]
F.clip(3, '<div id="pp"><div class="pa" id="ppa"><i></i><i></i></div><div class="pl" id="ppl"><i></i></div></div>'
          + "".join(f'<div class="qc" id="qc{k}" style="top:{580 + k * 140}px"><b>{n}</b>{t}<span>{s}</span></div>' for k, (n, t, s) in enumerate(QC))
       + F.block([[(32, 34, "b"), (35, 37, "")], [(38, 39, ""), (40, 42, "hl")]], top=1040, size=78))
# S4 agent-to-agent messages and files
F.clip(4, '<div class="av" id="av0" style="left:90px;top:440px;background:#d97757">C</div><div class="av" id="av1" style="left:760px;top:440px;background:#111">›</div>'
          '<div id="msg">"Can you review this?"</div><div id="file"><i></i>spec.md</div>'
       + F.block([[(43, 44, ""), (45, 47, "b")], [(48, 48, ""), (49, 50, "hl")]], top=1040, size=82))
# S5 built-in browser agents control
F.clip(5, '<div id="brw" class="card"><div class="tb2"><i></i><i></i><i></i><u>localhost:3000</u></div><div class="hd"></div>'
          '<div class="ln" style="width:70%"></div><div class="ln" style="width:50%"></div><div class="bt" id="bt"></div><div id="ring"></div>'
          '<div id="agb">Claude is browsing</div>'
          '<svg id="cur" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg></div>'
       + F.block([[(51, 53, ""), (54, 56, "b")], [(57, 59, "hl")]], top=1040, size=82))
# S6 more agents
F.clip(6, chip("c1", "Gemini", 120, 380, "✦", "#111") + chip("c2", "Cursor", 560, 460, "◆", "#3a3a3a")
          + chip("c3", "OpenCode", 260, 640, "›", "#ff4b1f")
       + F.block([[(60, 62, "b"), (63, 63, "b")], [(64, 65, "hl")]], top=1040, size=86))
# S7 honest warning
F.clip(7, '<div id="warn" class="card"><div class="t"><b>!</b>Development preview</div>'
          '<div class="r" id="wr0"><i>full access</i>files · commands · network</div>'
          '<div class="r" id="wr1"><i>tip</i>run only tasks you trust</div></div>'
       + F.block([[(66, 69, "b")], [(70, 72, ""), (73, 74, "hl")], [(75, 80, "")]], top=1000, size=70))
# S8 license
F.clip(8, '<div id="lic" class="card"><div class="big">Non-</div><div class="big">commercial</div><div class="sm">PolyForm license</div></div><div id="stamp">FREE</div>'
       + F.block([[(81, 81, "hl"), (82, 84, "b")]], top=1080, size=86))
# S9 CTA
F.clip(9, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(85, 85, ""), (86, 86, "hl")], [(87, 92, "")]], top=1020, size=84))

S = F.S
for i in (10, 16, 23, 26, 37, 40, 45, 49, 56, 60, 61, 63, 73, 81, 86):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 terminals already scattered at t=0, jitter, then get sucked into one app
for(let k=0;k<5;k++){ ft('#tw'+k,{opacity:k<3?1:0,scale:.85,y:60},{opacity:1,scale:1,y:0,duration:.7,ease:'back.out(1.4)'},k<3?k*0.05:S[7]-0.2+(k-3)*0.12);
  tl.to('#tw'+k,{x:(k%2?-1:1)*12,duration:.5,ease:'sine.inOut',yoyo:true,repeat:3},0.8+k*.1); }
tl.to(['#tw0','#tw1','#tw2','#tw3','#tw4'],{x:0,left:290,top:480,rotation:0,scale:.2,opacity:0,filter:'blur(10px)',duration:.35,ease:IN,stagger:.03},ST[1]-0.3);
// S1 app icon + name
ft('#bigapp',{opacity:0,scale:.2,rotation:-30,filter:'blur(20px)'},{opacity:1,scale:1,rotation:0,filter:'blur(0px)',duration:.7,ease:'back.out(1.6)'},ST[1]+0.02);
ft('#appname',{opacity:0,y:60,filter:'blur(16px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.6,ease:A},S[10]);
tl.to('#bigapp',{y:-20,duration:1,ease:'sine.inOut'},ST[1]+0.8);
tl.to(['#bigapp','#appname'],{scale:.6,y:-120,opacity:0,filter:'blur(14px)',duration:.28,ease:IN},ST[2]-0.28);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 app window
ft('#app',{opacity:0,y:160,scale:.88,rotationX:18,transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,duration:.8,ease:A},ST[2]);
ft('.ag',{opacity:0,x:-40},{opacity:1,x:0,duration:.4,ease:A,stagger:.08},ST[2]+0.2);
ft('#ws',{opacity:0,y:-20},{opacity:1,y:0,duration:.4,ease:A},S[23]-0.1);
ft('#b0',{opacity:0,y:30,scale:.9},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(2)'},S[26]-0.1);
ft('#b1',{opacity:0,y:30,scale:.9},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(2)'},S[27]);
ft('#b2',{opacity:0,y:30,scale:.9},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(2)'},S[29]);
ft('#b3',{opacity:0,y:30,scale:.9},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(2)'},S[30]+0.1);
ft('#pin',{opacity:0,scale:2,rotation:-10},{opacity:1,scale:1,rotation:0,duration:.35,ease:'back.out(2.5)'},S[30]);
outUp('#app',ST[3]);
// S3 queue + pause/resume
[0,1,2].forEach(k=>popIn('#qc'+k,S[34]-0.1+k*0.12,{y:-80,s:.9,r:k%2?3:-3}));
popIn('#pp',S[37]-0.2,{y:-40,s:.5,r:-20});
tl.set('#ppl',{opacity:0},0);
tl.set('#ppa',{opacity:0},S[40]); tl.set('#ppl',{opacity:1},S[40]);
tl.to('#pp',{backgroundColor:'#111',scale:.92,duration:.15,yoyo:true,repeat:1},S[40]);
tl.to(['#qc0','#qc1','#qc2'],{opacity:.45,duration:.2},S[40]);
tl.set('#ppl',{opacity:0},S[42]); tl.set('#ppa',{opacity:1},S[42]);
tl.to('#pp',{backgroundColor:'#ff4b1f',duration:.15},S[42]);
tl.to(['#qc0','#qc1','#qc2'],{opacity:1,duration:.2},S[42]);
tl.to('#qc0',{x:300,opacity:0,duration:.35,ease:IN},S[42]+0.3);
outUp(['#pp','#qc1','#qc2'],ST[4]);
starPass('#st2',ST[4]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S4 two agents talk + pass a file
popIn('#av0',ST[4]+0.02,{y:60,s:.5,r:-12}); popIn('#av1',ST[4]+0.12,{y:60,s:.5,r:12});
ft('#msg',{opacity:0,x:-260,scale:.6},{opacity:1,x:0,scale:1,duration:.6,ease:A},S[45]-0.1);
ft('#file',{opacity:0,x:-300,rotation:-10},{opacity:1,x:240,rotation:0,duration:.8,ease:A},S[49]-0.1);
tl.to('#av1',{scale:1.08,duration:.2,ease:'back.out(3)',yoyo:true,repeat:1},S[50]);
outUp(['#av0','#av1','#msg','#file'],ST[5]);
// S5 browser: agent moves cursor and clicks
ft('#brw',{opacity:0,y:160,scale:.88,rotationX:18,transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,duration:.8,ease:A},ST[5]);
ft('#agb',{opacity:0,x:40},{opacity:1,x:0,duration:.4,ease:A},S[54]);
ft('#cur',{x:0,y:0},{x:-400,y:-130,duration:.8,ease:'power3.inOut'},S[55]);
tl.to('#cur',{scale:.8,duration:.08,yoyo:true,repeat:1},S[56]+0.4);
ft('#ring',{opacity:1,scale:.3},{opacity:0,scale:1.6,duration:.6,ease:'power2.out'},S[56]+0.45);
tl.to('#bt',{backgroundColor:'#ff4b1f',duration:.2},S[56]+0.45);
outUp('#brw',ST[6]);
// S6 chips
popIn('#c1',S[60]-0.12); popIn('#c2',S[61]-0.12); popIn('#c3',S[63]-0.12);
outUp(['#c1','#c2','#c3'],ST[7]);
// S7 warning card
popIn('#warn',ST[7]+0.02,{y:80,s:.9,r:-2});
ft('#wr0',{opacity:0,x:-60},{opacity:1,x:0,duration:.4,ease:A},S[73]-0.1);
ft('#wr1',{opacity:0,x:-60},{opacity:1,x:0,duration:.4,ease:A},S[76]-0.1);
tl.to('#warn .t b',{rotation:-12,duration:.08,yoyo:true,repeat:5},S[68]);
outUp('#warn',ST[8]);
starPass('#st3',ST[8]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S8 license
popIn('#lic',ST[8]+0.02,{y:60,s:.85,r:0});
ft('#stamp',{opacity:0,scale:2.4,rotation:-10},{opacity:1,scale:1,rotation:8,duration:.4,ease:'back.out(2)'},S[81]-0.05);
outUp(['#lic','#stamp'],ST[9]);
cta('OPENBOT',S[86]);
"""
F.write(CSS, JS, music_vol=0.10)
