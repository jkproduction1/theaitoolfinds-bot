"""6 Codex CLI slash commands (pillar: listicle). Facts: github.com/openai/codex codex-rs/tui/src/slash_command.rs
(descriptions) + bottom_pane/slash_commands.rs (feature gating: /plan /goal /worktree are gated, so not used):
/review "review my current changes and find issues"; /side "start a side conversation in an ephemeral fork";
/fork "fork the current chat"; /diff "show git diff (including untracked files)"; /init "create an AGENTS.md file with
instructions for Codex"; /import "import setup, this project, and recent chats from Claude Code".
Media: Codex CLI splash screenshot from the repo (.github/codex-cli-splash.png, cropped). Rest drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "codex6"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
DISP = {15: "", 16: "/review.", 26: "", 27: "/side", 37: "", 38: "/fork", 49: "", 50: "/diff", 59: "", 60: "/init",
        63: "AGENTS.md", 70: "", 71: "/import"}
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display=DISP)
F.scenes([0, 9, 14, 25, 36, 48, 58, 69, 82])

CSS = r"""
#shot{left:70px;top:330px;width:940px;height:591px;overflow:hidden;border-radius:26px;background:#111}
#shot img{position:absolute;left:0;top:0;width:940px;height:auto}
#six{position:absolute;left:0;right:0;top:300px;text-align:center;font-size:520px;font-weight:800;letter-spacing:-.07em;line-height:1}
.num{position:absolute;left:0;right:0;top:250px;text-align:center;font-size:130px;font-weight:800;letter-spacing:-.05em;line-height:1}
.num span{color:#ff4b1f}
.tm{left:150px;top:420px;width:780px;height:200px}
.tm .body{padding:30px 44px;font-size:58px;line-height:1.4}
.tm .p{color:#ff4b1f}
.res{position:absolute;left:170px;top:660px;width:740px;padding:28px 36px;border-radius:28px;background:#fff;font-size:36px;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05)}
.res .r{display:flex;align-items:center;gap:18px;margin:8px 0;font-family:var(--mono);font-weight:600;font-size:32px}
.res .r b{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:12px;background:#ff4b1f;color:#fff;font-family:var(--sans);font-size:30px}
.res .r b.k{background:#111}
.res .g{color:#8a8a8a}
.br svg{position:absolute;left:0;top:0}
.bub{position:absolute;padding:20px 32px;border-radius:30px;background:#fff;font-weight:700;font-size:36px;
 box-shadow:0 30px 50px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05)}
.bub.dk{background:#111;color:#fff}
.bub.ds{background:transparent;border:4px dashed #ff4b1f;box-shadow:none;color:#ff4b1f}
#doc{position:absolute;left:330px;top:640px;width:420px;height:300px;padding:30px 34px}
#doc .t{font-family:var(--mono);font-weight:700;font-size:38px}
#doc .ln{height:18px;border-radius:9px;background:#e6e6e6;margin-top:22px}
"""

def num(n):
    return f'<div id="n{n}" class="num"><span>#</span>{n}</div>'

def term(tid):
    return (f'<div id="{tid}" class="term tm"><div class="bar"><i></i><i></i><i></i></div>'
            f'<div class="body"><span class="p">›</span> <span id="{tid}c"></span></div></div>')

# S0 real Codex CLI screenshot used like a chat box
F.clip(0, '<div id="shot" class="card"><img src="assets/codex-term.jpg" alt=""></div>'
       + F.block([[(0, 4, "b")], [(5, 8, "hl")]], top=1020, size=84))
# S1 big 6
F.clip(1, '<div id="six">6</div>' + F.block([[(9, 9, ""), (10, 11, "b")], [(12, 13, "hl")]], top=1040, size=88))
# S2 /review -> findings card
F.clip(2, num(1) + term("t1") + '<div id="r1" class="res"><div class="r"><b>!</b>auth.ts:42 <span class="g">token never checked</span></div>'
          '<div class="r"><b>!</b>api.ts:17 <span class="g">missing await</span></div></div>'
       + F.block([[(14, 14, "it"), (15, 16, "mono b")], [(17, 20, "")], [(21, 22, ""), (23, 24, "hl")]], top=1000, size=74))
# S3 /side -> ephemeral side chat
F.clip(3, num(2) + term("t2") + '<div class="br" id="b2"><svg width="1080" height="1000" fill="none" stroke="#ff4b1f" stroke-width="6" stroke-linecap="round" stroke-dasharray="14 14">'
          '<path id="p2" d="M330 720 C330 800 560 780 600 820"/></svg>'
          '<div class="bub dk" id="m2" style="left:150px;top:670px">main chat</div><div class="bub ds" id="e2" style="left:560px;top:800px">side chat</div></div>'
       + F.block([[(25, 25, "it"), (26, 27, "mono b")], [(28, 31, "")], [(32, 33, ""), (34, 35, "hl")]], top=1000, size=74))
# S4 /fork -> two paths
F.clip(4, num(3) + term("t3") + '<div class="br" id="b3"><svg width="1080" height="1000" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round">'
          '<path id="q0" d="M540 640 L540 690" pathLength="1"/><path id="q1" d="M540 690 C540 760 300 740 300 810" pathLength="1"/>'
          '<path id="q2" d="M540 690 C540 760 780 740 780 810" pathLength="1"/></svg>'
          '<div class="bub" id="fa" style="left:170px;top:810px">path A</div><div class="bub dk" id="fb" style="left:650px;top:810px">path B</div></div>'
       + F.block([[(36, 36, "it"), (37, 38, "mono b")], [(39, 41, "")], [(42, 45, ""), (46, 47, "hl")]], top=990, size=66))
# S5 /diff -> diff card with untracked file
F.clip(5, num(4) + term("t4") + '<div id="r4" class="res"><div class="r"><b class="k">+</b>return user.id</div>'
          '<div class="r"><b>−</b><span class="g">return null</span></div><div class="r"><b class="k">U</b>new_page.tsx <span class="g">untracked</span></div></div>'
       + F.block([[(48, 48, "it"), (49, 50, "mono b")], [(51, 54, "")], [(55, 55, ""), (56, 57, "hl")]], top=1020, size=74))
# S6 /init -> AGENTS.md
F.clip(6, num(5) + term("t5") + '<div id="doc" class="card"><div class="t">AGENTS.md</div><div class="ln" style="width:90%"></div><div class="ln" style="width:70%"></div>'
          '<div class="ln" style="width:82%"></div><div class="ln" style="width:55%"></div></div>'
       + F.block([[(58, 58, "it"), (59, 60, "mono b")], [(61, 62, ""), (63, 63, "mono b"), (64, 64, "")], [(65, 65, ""), (66, 66, "hl"), (67, 68, "")]], top=1000, size=66))
# S7 /import from Claude Code
F.clip(7, num(6) + term("t6") + chip("cc", "Claude Code", 70, 690, "C", "#d97757") + chip("cx", "Codex", 690, 690, "›", "#111")
          + '<div class="br" id="b6"><svg width="1080" height="1000" fill="none" stroke="#ff4b1f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'
            '<path id="ar" d="M560 760 L670 760 M645 736 L672 760 L645 784" pathLength="1"/></svg></div>'
          '<div class="res" id="r6" style="top:840px;text-align:center;font-weight:700;font-size:34px;padding:16px 30px">setup · project · recent chats</div>'
       + F.block([[(69, 69, "it"), (70, 71, "mono b"), (72, 74, "")], [(75, 78, "")], [(79, 81, "hl")]], top=1010, size=68))
# S8 CTA
F.clip(8, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(82, 82, ""), (83, 83, "hl")], [(84, 87, "")], [(88, 90, "b")]], top=1000, size=84))

S = F.S
for i in (10, 16, 23, 27, 34, 38, 46, 50, 56, 60, 63, 71, 79, 83):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t){ const el=document.getElementById(id), O={n:0};
  ft(O,{n:0},{n:txt.length,duration:.05*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
function numIn(n,t){ ft('#n'+n,{opacity:0,y:-40,scale:1.4,filter:'blur(18px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.45,ease:A},t); }
function draw(sel,t,d){ ft(sel,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:d||.4,ease:'power2.out'},t); }
// S0 screenshot visible at t=0, slow push into the prompt line
ft('#shot',{opacity:1,y:60,rotation:-2,scale:.95},{opacity:1,y:0,rotation:0,scale:1,duration:1.2,ease:A},0);
ft('#shot img',{scale:1.05,x:0,y:0,transformOrigin:'20% 40%'},{scale:1.45,x:30,y:-40,transformOrigin:'20% 40%',duration:ST[1],ease:'power1.inOut'},0);
tl.to('#shot',{scale:.6,opacity:0,filter:'blur(14px)',duration:.3,ease:IN},ST[1]-0.3);
// S1 big 6
ft('#six',{opacity:0,scale:2.2,filter:'blur(30px)',rotation:-8},{opacity:1,scale:1,filter:'blur(0px)',rotation:0,duration:.6,ease:A},S[10]-0.12);
tl.to('#six',{opacity:0,y:-120,filter:'blur(16px)',duration:.25,ease:IN},ST[2]-0.25);
starPass('#st1',ST[2]-0.35,[700,-650,0],[430,-360,40],10,1.2);
// numbers + terminals
const items=[[2,1,16,'/review'],[3,2,27,'/side'],[4,3,38,'/fork'],[5,4,50,'/diff'],[6,5,60,'/init'],[7,6,71,'/import']];
items.forEach(([sc,n,w,cmd])=>{ numIn(n,ST[sc]+0.02); popIn('#t'+n,ST[sc]+0.08,{y:60,s:.94,r:0}); typeIn('t'+n+'c',cmd,S[w]-0.25);
  tl.to(['#n'+n,'#t'+n],{opacity:0,y:-40,filter:'blur(12px)',duration:.22,ease:IN},ST[sc+1]-0.22); });
// 1 review findings
popIn('#r1',S[23]-0.15,{y:80,s:.85,r:-3}); outUp('#r1',ST[3]);
// 2 side chat
popIn('#m2',S[28],{y:40,s:.8,r:0}); ft('#p2',{strokeDashoffset:0,opacity:0},{opacity:1,strokeDashoffset:-56,duration:1.2,ease:'none'},S[30]);
popIn('#e2',S[30]+0.1,{y:40,s:.6,r:6}); tl.to('#e2',{opacity:.35,duration:.4},S[34]+0.2);
outUp(['#m2','#e2','#b2 svg'],ST[4]);
starPass('#st2',ST[4]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// 3 fork
draw('#q0',S[39]-0.1,.2); draw('#q1',S[39]+0.1); draw('#q2',S[39]+0.18);
popIn('#fa',S[41]-0.1,{y:40,s:.7,r:-6}); popIn('#fb',S[41],{y:40,s:.7,r:6});
tl.to('#fb',{scale:1.12,duration:.3,ease:'back.out(3)'},S[46]);
outUp(['#fa','#fb','#b3 svg'],ST[5]);
// 4 diff
popIn('#r4',S[51]-0.05,{y:80,s:.85,r:3});
ft('#r4 .r:nth-child(3)',{opacity:0,x:-40},{opacity:1,x:0,duration:.4,ease:A},S[56]-0.1);
outUp('#r4',ST[6]);
// 5 init: doc drops in, lines write
ft('#doc',{opacity:0,y:-120,rotation:-8,scale:.8},{opacity:1,y:0,rotation:-2,scale:1,duration:.6,ease:'back.out(1.6)'},S[61]);
ft('#doc .ln',{scaleX:0,transformOrigin:'0 50%'},{scaleX:1,duration:.4,ease:'power2.out',stagger:.12},S[64]);
outUp('#doc',ST[7]);
starPass('#st3',ST[7]-0.3,[900,1500,0],[580,1290,50],8,1.2);
// 6 import
popIn('#cc',S[72]-0.1,{y:40,s:.7,r:-6}); popIn('#cx',S[72]+0.05,{y:40,s:.7,r:6});
draw('#ar',S[78]-0.1,.35);
tl.to('#cc',{x:30,duration:.3,ease:'power2.inOut',yoyo:true,repeat:1},S[78]);
popIn('#r6',S[74],{y:40,s:.9,r:0});
outUp(['#cc','#cx','#b6 svg','#r6'],ST[8]);
cta('CODEX',S[83]);
"""
F.write(CSS, JS, music_vol=0.10)
