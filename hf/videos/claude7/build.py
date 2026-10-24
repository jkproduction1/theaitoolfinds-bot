"""7 Claude Code commands (listicle). Facts: support.claude.com/en/articles/14553413-claude-code-cheatsheet"""
import sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile

W = HERE.parent.parent / "work" / "claude7"
DISP = {15: "", 16: "/btw.", 37: "", 38: "/compact.", 48: "", 49: "/context", 75: "", 76: "/simplify", 68: "Ctrl"}
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display=DISP)
F.scenes([0, 9, 14, 25, 36, 47, 56, 67, 74, 84])

CSS = r"""
#chat{left:110px;top:520px;width:860px;height:150px;border-radius:80px;display:flex;align-items:center;padding-left:60px;font-size:48px;color:#9a9a9a}
#chat i{display:inline-block;width:5px;height:58px;background:#111;margin-left:8px}
#seven{position:absolute;left:0;right:0;top:300px;text-align:center;font-size:520px;font-weight:800;letter-spacing:-.07em;line-height:1}
.num{position:absolute;left:0;right:0;top:280px;text-align:center;font-size:150px;font-weight:800;letter-spacing:-.05em;line-height:1}
.num span{color:#ff4b1f}
.tm{left:110px;top:500px;width:860px;height:330px}
.tm .body{padding:42px 48px;font-size:54px;line-height:1.5}
.tm .p{color:#ff4b1f}
.tm .hint{font-size:32px;color:#8a8a8a}
.keys{position:absolute;left:0;right:0;top:560px;text-align:center}
.plus{display:inline-block;font-size:70px;font-weight:300;color:#9a9a9a;vertical-align:middle}
.pbar{position:absolute;left:150px;top:760px;width:780px;height:34px;border-radius:17px;background:#dcdcdc;overflow:hidden}
.pbar i{position:absolute;left:0;top:0;bottom:0;border-radius:17px}
.seg{display:flex;position:absolute;left:150px;top:760px;width:780px;height:34px;border-radius:17px;overflow:hidden;gap:4px}
.seg b{display:block;height:100%}
.chk{font-size:36px;color:#cfcfcf}
.chk b{color:#ff4b1f}
"""

def num(n):
    return f'<div id="n{n}" class="num"><span>#</span>{n}</div>'

def term(tid, cmd, hint=""):
    return (f'<div id="{tid}" class="term tm"><div class="bar"><i></i><i></i><i></i></div>'
            f'<div class="body"><div><span class="p">&gt;</span> <span id="{tid}c"></span></div>'
            f'<div class="hint">{hint}</div></div></div>')

def keys(kid, labels, sep='+'):
    inner = (f'<span class="plus">{sep}</span>' if sep else '<span style="display:inline-block;width:20px"></span>').join(f'<span id="{kid}{i}" class="key">{l}</span>' for i, l in enumerate(labels))
    return f'<div id="{kid}" class="keys">{inner}</div>'

F.clip(0, '<div id="chat" class="card">Ask Claude anything…<i id="cc"></i></div>'
       + F.block([[(0, 4, "")], [(5, 6, ""), (7, 8, "hl")]], top=1000, size=84))
F.clip(1, '<div id="seven">7</div>' + F.block([[(9, 9, ""), (10, 11, "b")], [(12, 13, "hl")]], top=1040, size=88))
F.clip(2, num(1) + term("t1", "/btw", "side question · no context used")
       + F.block([[(14, 14, "it"), (15, 16, "mono b")], [(17, 20, "")], [(21, 24, "b")]], top=980, size=74))
F.clip(3, num(2) + keys("k2", ["Esc", "Esc"], sep="") + '<div id="rw" style="position:absolute;left:0;right:0;top:790px;text-align:center;font-size:40px;color:#6f6f6f">↺ back to a checkpoint</div>'
       + F.block([[(25, 25, "it"), (26, 28, "b")], [(29, 31, "hl"), (32, 35, "")]], top=980, size=74))
F.clip(4, num(3) + term("t3", "/compact") + '<div class="pbar" id="b3"><i id="b3i" style="background:#111;width:92%"></i></div>'
       + F.block([[(36, 36, "it"), (37, 38, "mono b")], [(39, 42, "")], [(43, 46, "hl")]], top=980, size=74))
F.clip(5, num(4) + term("t4", "/context") + '<div class="seg" id="b4"><b style="background:#111;flex:3"></b><b style="background:#ff4b1f;flex:2"></b>'
          '<b style="background:#8a8a8a;flex:2"></b><b style="background:#dcdcdc;flex:3"></b></div>'
       + F.block([[(47, 47, "it"), (48, 49, "mono b"), (50, 50, "")], [(51, 52, "hl"), (53, 55, "")]], top=980, size=74))
F.clip(6, num(5) + keys("k5", ["Shift", "Tab"])
       + F.block([[(56, 56, "it"), (57, 58, "b"), (59, 60, "")], [(61, 62, "hl")], [(63, 66, "b")]], top=960, size=74))
F.clip(7, num(6) + keys("k6", ["Ctrl", "R"]) + tile("srch", "search", 435, 760, 210)
       + F.block([[(67, 67, "it"), (68, 69, "b")], [(70, 72, ""), (73, 73, "hl")]], top=1040, size=74))
F.clip(8, num(7) + term("t7", "/simplify", '<span class="chk"><b>✓</b> reuse &nbsp; <b>✓</b> quality &nbsp; <b>✓</b> efficiency</span>')
       + F.block([[(74, 74, "it"), (75, 76, "mono b")], [(77, 80, "")], [(81, 83, "hl")]], top=980, size=74))
F.clip(9, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(84, 84, ""), (85, 85, "hl")], [(86, 90, ""), (91, 93, "b")]], top=1020, size=84))

S = F.S
for i in (10, 16, 26, 28, 38, 49, 57, 58, 68, 69, 76, 85):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t){ const el=document.getElementById(id), O={n:0};
  ft(O,{n:0},{n:txt.length,duration:.05*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
function numIn(n,t){ ft('#n'+n,{opacity:0,y:-40,scale:1.4,filter:'blur(18px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.45,ease:A},t); }
function keyPress(sel,t){ tl.to(sel,{y:12,boxShadow:'0 2px 0 #c9c9c9,0 20px 40px -16px rgba(0,0,0,.35)',duration:.07,ease:'power2.in'},t);
  tl.to(sel,{y:0,boxShadow:'0 14px 0 #c9c9c9,0 40px 60px -16px rgba(0,0,0,.35)',duration:.2,ease:'power2.out'},t+0.08); }
// S0 a plain chat box
popIn('#chat',0.0,{y:40,s:.95,r:0});
for(let x=0.6;x<ST[1];x+=0.6){ tl.set('#cc',{opacity:0},x); tl.set('#cc',{opacity:1},x+0.3); }
tl.to('#chat',{scale:.6,opacity:0,filter:'blur(14px)',duration:.3,ease:IN},ST[1]-0.3);
// S1 big 7
ft('#seven',{opacity:0,scale:2.2,filter:'blur(30px)',rotation:-8},{opacity:1,scale:1,filter:'blur(0px)',rotation:0,duration:.6,ease:A},S[10]-0.12);
tl.to('#seven',{opacity:0,y:-120,filter:'blur(16px)',duration:.25,ease:IN},ST[2]-0.25);
starPass('#st1',ST[2]-0.35,[700,-650,0],[430,-360,40],10,1.2);
// items
const items=[[2,1],[3,2],[4,3],[5,4],[6,5],[7,6],[8,7]];
items.forEach(([sc,n])=>{ numIn(n,ST[sc]+0.02); tl.to('#n'+n,{opacity:0,y:-40,filter:'blur(12px)',duration:.22,ease:IN},ST[sc+1]-0.22); });
popIn('#t1',ST[2]+0.1,{y:60,s:.94,r:0}); typeIn('t1c','/btw',S[16]-0.15); outUp('#t1',ST[3]);
popIn('#k20',S[27]-0.1,{y:40,s:.8,r:0}); popIn('#k21',S[28]-0.1,{y:40,s:.8,r:0}); keyPress('#k20',S[28]+0.15); keyPress('#k21',S[28]+0.35);
ft('#rw',{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:A},S[30]); ft('.plus',{opacity:0},{opacity:1,duration:.2},S[27]);
outUp(['#k2','#rw'],ST[4]);
popIn('#t3',ST[4]+0.1,{y:60,s:.94,r:0}); typeIn('t3c','/compact',S[38]-0.2);
ft('#b3',{opacity:0},{opacity:1,duration:.3},S[39]); ft('#b3i',{width:'92%'},{width:'22%',duration:1.0,ease:'expo.out'},S[44]);
outUp(['#t3','#b3'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
popIn('#t4',ST[5]+0.1,{y:60,s:.94,r:0}); typeIn('t4c','/context',S[49]-0.2);
ft('#b4',{opacity:0,scaleX:.2},{opacity:1,scaleX:1,duration:.7,ease:A},S[50]); outUp(['#t4','#b4'],ST[6]);
popIn('#k50',S[57]-0.1,{y:40,s:.8,r:0}); popIn('#k51',S[58]-0.1,{y:40,s:.8,r:0}); keyPress('#k50',S[59]); keyPress('#k51',S[59]+0.05);
outUp('#k5',ST[7]);
popIn('#k60',S[68]-0.1,{y:40,s:.8,r:0}); popIn('#k61',S[69]-0.1,{y:40,s:.8,r:0}); keyPress('#k61',S[70]);
popIn('#srch',S[70]); outUp(['#k6','#srch'],ST[8]);
starPass('#st3',ST[8]-0.3,[900,1500,0],[580,1290,50],8,1.2);
popIn('#t7',ST[8]+0.1,{y:60,s:.94,r:0}); typeIn('t7c','/simplify',S[76]-0.2); outUp('#t7',ST[9]);
cta('CLAUDE',S[85]);
"""
F.write(CSS, JS, music_vol=0.10)
