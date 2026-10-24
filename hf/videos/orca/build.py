"""Orca - run many coding agents side by side, each in its own git worktree (pillar: creator/dev tool).
Facts: github.com/stablyai/orca README (parallel worktrees, fan one prompt across five agents, mobile companion
notifies when an agent finishes, any CLI agent, MIT / free and open source) + docs/site first-session.mdx
("bring your own Claude, Codex, or OpenCode subscription"). Media: README hero screenshot + app icon."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "orca"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json")
F.scenes([0, 10, 17, 31, 44, 55, 63, 67])

CSS = r"""
.mt{width:560px;height:330px}
.mt .body{padding:26px 30px;font-size:30px;line-height:1.45}
.mt .body b{color:#fff}
.mt .g{color:#7a7a7a}
.mt .o{color:#ff4b1f}
#m1{left:70px;top:360px}#m2{left:450px;top:470px}#m3{left:180px;top:620px}
#desk{left:100px;top:330px;width:880px;height:678px;overflow:hidden;border-radius:26px;background:#111}
#desk img{position:absolute;left:0;top:0;width:880px;height:auto}
#oicon{position:absolute;left:760px;top:250px;width:230px;height:230px;border-radius:52px;filter:drop-shadow(0 40px 40px rgba(0,0,0,.35))}
#wt svg{position:absolute;left:0;top:0}
.lane{position:absolute;width:280px;height:120px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-weight:700;font-size:34px;letter-spacing:-.02em;border-radius:24px}
#main{position:absolute;left:390px;top:330px;width:300px;height:96px;border-radius:48px;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-weight:700;font-size:38px}
#prompt{left:250px;top:330px;width:580px;height:120px;border-radius:60px;display:flex;align-items:center;padding-left:44px;font-size:40px;font-weight:600}
#prompt i{font-style:normal;color:#ff4b1f;margin-right:16px}
.ag{position:absolute;width:150px;height:150px;border-radius:40px;background:linear-gradient(160deg,#fff,#f0f0f0);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:56px;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.04)}
.ag.win{background:#ff4b1f;color:#fff}
#fan svg{position:absolute;left:0;top:0}
#crown{position:absolute;left:0;right:0;top:850px;text-align:center;font-family:var(--mono);font-weight:700;font-size:40px;color:#ff4b1f}
#phone{left:380px;top:300px;width:320px;height:674px;border-radius:44px;overflow:hidden;background:#000;border:8px solid #111}
#phone img{width:100%;height:100%;object-fit:cover}
#notif{position:absolute;left:150px;top:380px;width:780px;height:150px;border-radius:40px;background:rgba(255,255,255,.96);display:flex;align-items:center;gap:26px;padding:0 34px;
 box-shadow:0 50px 80px -20px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05)}
#notif img{width:86px;height:86px;border-radius:22px}
#notif .t1{font-weight:800;font-size:38px;letter-spacing:-.02em}
#notif .t2{font-size:32px;color:#6f6f6f}
#mit{left:250px;top:400px;width:580px;height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center}
#mit .big{font-size:200px;font-weight:800;letter-spacing:-.06em;line-height:1}
#mit .sm{font-family:var(--mono);font-size:40px;color:#6f6f6f;margin-top:16px}
#stamp{position:absolute;left:640px;top:330px;background:#ff4b1f;color:#fff;font-weight:800;font-size:64px;padding:14px 36px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
"""

def mterm(tid, title, lines):
    return (f'<div id="{tid}" class="term mt"><div class="bar"><i></i><i></i><i></i></div>'
            f'<div class="body"><b>{title}</b>{"".join(f"<div>{l}</div>" for l in lines)}</div></div>')

# S0 three messy terminals
F.clip(0, mterm("m1", "Claude Code", ['<span class="g">~/app</span>', '<span class="o">●</span> editing auth.ts…'])
       + mterm("m2", "Codex", ['<span class="g">~/app</span>', '<span class="o">●</span> editing auth.ts…'])
       + mterm("m3", "OpenCode", ['<span class="g">~/app</span>', '<span class="o">✕</span> conflict in auth.ts'])
       + F.block([[(0, 2, "b")], [(3, 3, "b"), (4, 4, ""), (5, 5, "b"), (6, 6, "")], [(7, 9, "hl")]], top=1040, size=76))
# S1 real app
F.clip(1, '<div id="desk" class="card"><img src="assets/orca-desk.jpg" alt=""></div><img id="oicon" src="assets/orca-icon.png" alt="">'
       + F.block([[(10, 10, "b"), (11, 13, "")], [(14, 16, "hl")]], top=1060, size=86))
# S2 worktrees
LX = [70, 400, 730]
lanes = "".join(f'<div id="l{k}" class="lane card" style="left:{LX[k]}px;top:640px">{n}</div>'
                for k, n in enumerate(["claude/", "codex/", "opencode/"]))
F.clip(2, '<div id="wt"><svg width="1080" height="1000" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round">'
          '<path id="p0" d="M540 426 C540 540 210 520 210 640" pathLength="1"/>'
          '<path id="p1" d="M540 426 L540 640" pathLength="1"/>'
          '<path id="p2" d="M540 426 C540 540 870 520 870 640" pathLength="1"/></svg>'
          '<div id="main">main</div>' + lanes
          + tile("shd", "shield", 455, 790, 170, acc=True) + '</div>'
       + F.block([[(17, 21, ""), (22, 23, "hl")], [(24, 30, "")]], top=1020, size=74))
# S3 fan out to five agents
AX = [60, 260, 465, 670, 870]
ags = "".join(f'<div id="a{k}" class="ag{" win" if k == 2 else ""}" style="left:{x}px;top:640px">{k + 1}</div>' for k, x in enumerate(AX))
paths = "".join(f'<path id="f{k}" d="M540 450 C540 560 {x + 75} 540 {x + 75} 640" pathLength="1"/>' for k, x in enumerate(AX))
F.clip(3, '<div id="fan"><svg width="1080" height="1000" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round">' + paths + '</svg>'
          '<div id="prompt" class="card"><i>›</i>fix the login bug</div>' + ags + '<div id="crown">✓ merge winner</div></div>'
       + F.block([[(31, 31, ""), (32, 33, "hl"), (34, 36, "")], [(37, 39, "")], [(40, 40, ""), (41, 43, "b")]], top=1000, size=74))
# S4 any CLI agent
F.clip(4, chip("c1", "Claude Code", 90, 340, "C", "#d97757") + chip("c2", "Codex", 600, 390, "◎", "#111")
          + chip("c3", "OpenCode", 140, 520, "›", "#3a3a3a") + chip("c4", "Cursor", 600, 570, "◆", "#111")
          + chip("c5", "+ any CLI agent", 250, 730, "∞", "#ff4b1f")
       + F.block([[(44, 45, ""), (46, 48, "hl")], [(49, 50, ""), (51, 51, "b")], [(52, 54, "")]], top=1000, size=76))
# S5 phone
F.clip(5, '<div id="phone" class="card"><img src="assets/orca-phone.jpg" alt=""></div>'
          '<div id="notif"><img src="assets/orca-icon.png" alt=""><div><div class="t1">Orca · agent finished</div><div class="t2">fix-login-bug is ready to review</div></div></div>'
       + F.block([[(55, 55, ""), (56, 56, "b"), (57, 58, "")], [(59, 61, ""), (62, 62, "hl")]], top=1060, size=82))
# S6 free + open source
F.clip(6, '<div id="mit" class="card"><div class="big">MIT</div><div class="sm">open source</div></div><div id="stamp">FREE</div>'
       + F.block([[(63, 63, "hl"), (64, 66, "b")]], top=1080, size=90))
# S7 CTA
F.clip(7, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(67, 67, ""), (68, 68, "hl")], [(69, 74, "")]], top=1020, size=84))

S = F.S
for i in (5, 10, 22, 32, 41, 46, 56, 63, 68):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 terminals already there at t=0, then jitter (messy)
['#m1','#m2','#m3'].forEach((s,k)=>{ ft(s,{opacity:1,y:30*(k+1),rotation:[-7,6,-4][k],scale:.97},{opacity:1,y:0,rotation:[-4,3,-2][k],scale:1,duration:1.2,ease:A},0); });
const JX=[[12,-8],[-10,9],[8,6]];
[S[8],S[8]+0.1,S[9]].forEach((t,k)=>{ ['#m1','#m2','#m3'].forEach((s,j)=>{ tl.to(s,{x:JX[(j+k)%3][0],y:JX[(j+k)%3][1],duration:.08,ease:'power1.inOut'},t); }); });
tl.to('#m1',{x:-500,rotation:-20,opacity:0,filter:'blur(14px)',duration:.3,ease:IN},ST[1]-0.3);
tl.to('#m2',{x:500,rotation:20,opacity:0,filter:'blur(14px)',duration:.3,ease:IN},ST[1]-0.3);
tl.to('#m3',{y:400,opacity:0,filter:'blur(14px)',duration:.3,ease:IN},ST[1]-0.3);
// S1 real screenshot + icon
ft('#desk',{opacity:0,y:160,scale:.86,rotationX:18,transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,duration:.8,ease:A},ST[1]);
ft('#desk img',{scale:1.25,x:0,transformOrigin:'0% 0%'},{scale:1.5,x:-40,transformOrigin:'0% 0%',duration:ST[2]-ST[1],ease:'none'},ST[1]);
popIn('#oicon',S[10]-0.05,{y:-40,s:.4,r:-20});
outUp(['#desk','#oicon'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.4);
// S2 worktrees
popIn('#main',ST[2]+0.05,{y:-40,s:.8,r:0});
for(let k=0;k<3;k++){ ft('#p'+k,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.5,ease:'power2.out'},S[20]+k*0.08);
  popIn('#l'+k,S[22]-0.1+k*0.1); }
popIn('#shd',S[26]-0.1,{y:40,s:.5,r:-10});
outUp(['#main','#l0','#l1','#l2','#shd','#wt svg'],ST[3]);
// S3 fan
popIn('#prompt',ST[3]+0.05,{y:-40,s:.9,r:0});
for(let k=0;k<5;k++){ ft('#f'+k,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.45,ease:'power2.out'},S[34]+k*0.06);
  popIn('#a'+k,S[35]-0.05+k*0.07,{y:60,s:.6,r:0}); }
tl.to(['#a0','#a1','#a3','#a4'],{opacity:.25,scale:.85,duration:.35,ease:'power2.out'},S[41]-0.1);
tl.to('#a2',{scale:1.18,duration:.4,ease:'back.out(3)'},S[41]-0.1);
ft('#crown',{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:A},S[41]);
outUp(['#prompt','#a0','#a1','#a2','#a3','#a4','#crown','#fan svg'],ST[4]);
// S4 chips
popIn('#c1',ST[4]+0.05); popIn('#c2',ST[4]+0.18); popIn('#c3',ST[4]+0.31); popIn('#c4',ST[4]+0.44);
ft('#c5',{opacity:0,scale:1.6,filter:'blur(16px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.5,ease:A},S[46]-0.08);
outUp(['#c1','#c2','#c3','#c4','#c5'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.4);
// S5 phone + notification drop
ft('#phone',{opacity:0,y:300,rotation:6},{opacity:1,y:0,rotation:0,duration:.8,ease:A},ST[5]);
ft('#notif',{opacity:0,y:-160,scale:.9,filter:'blur(10px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.6,ease:'back.out(1.6)'},S[57]-0.1);
outUp(['#phone','#notif'],ST[6]);
// S6 MIT + FREE stamp
popIn('#mit',ST[6]+0.02,{y:60,s:.85,r:0});
ft('#stamp',{opacity:0,scale:2.4,rotation:-10},{opacity:1,scale:1,rotation:8,duration:.4,ease:'back.out(2)'},S[63]-0.05);
outUp(['#mit','#stamp'],ST[7]);
starPass('#st3',ST[7]-0.3,[900,1500,0],[580,1290,50],8,1.2);
cta('ORCA',S[68]);
"""
F.write(CSS, JS, music_vol=0.10)
