"""grillme - mattpocock/skills: /grill-me + /tdd (relatable pain for people building with coding agents). Paper, "Free AI tool #2".
Facts (README + SKILL.md files, 2026-11-06): "/grill-me: Get relentlessly interviewed about a plan or design until every branch of the
design tree is resolved." grilling/SKILL.md: asks numbered questions in rounds and "give your recommended answer" for each, word each
question so "yes" accepts it. README #3: "/tdd ... red-green-refactor ... the agent writes a failing test first, then fixes the test."
Install lines for Claude Code, Codex and GitHub Copilot are in the README. MIT licence. No third-party media: everything drawn in code
(the Q1/➡️ round layout mirrors the format in grilling/SKILL.md; the example plan "add a login page" is ours)."""
import sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, chip, series, FOLLOW_LINE

W = HERE.parent.parent / "work" / "grillme"
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", tail=1.4,
         display={7: "", 8: "/grill-me", 27: "", 28: "/tdd"})
#          hook  grill  interviews  answer  tdd  agents  cta
F.scenes([0, 7, 11, 20, 27, 39, 46], hold=0.12)

CSS = r"""
#ask{position:absolute;left:330px;top:330px;width:660px;padding:30px 38px;font-size:42px;font-weight:600;border-radius:34px 34px 10px 34px;background:#111;color:#fff}
#res{position:absolute;left:90px;top:520px;width:760px;height:400px;padding:40px 46px}
#res .h{font-family:var(--mono);font-size:26px;color:#9a9a9a;font-weight:600}
#res .t{font-weight:800;font-size:58px;letter-spacing:-.04em;margin-top:18px;line-height:1.05}
#res .m{display:flex;gap:16px;margin-top:34px}
#res .m i{display:block;height:26px;border-radius:13px;background:#ececec}
#res .m i:nth-child(1){width:220px}#res .m i:nth-child(2){width:140px}#res .m i:nth-child(3){width:180px}
#res .tg{position:absolute;right:46px;top:44px;width:110px;height:60px;border-radius:30px;background:#111}
#res .tg::after{content:'';position:absolute;right:8px;top:8px;width:44px;height:44px;border-radius:50%;background:#fff}
#nope{position:absolute;left:700px;top:430px;width:230px;height:230px;border-radius:50%;background:var(--acc);display:flex;align-items:center;justify-content:center;
 box-shadow:0 30px 60px -16px rgba(255,75,31,.6)}
#nope svg{width:110px;height:110px}
#t1{left:90px;top:330px;width:900px;height:520px}
#t1 .ln{padding:40px 44px 0;font-size:64px;font-weight:700}
#t1 .ln .p{color:#6f6f6f}#t1 .ln .c{color:#ff6a3d}
#t1 .cur{display:inline-block;width:6px;height:70px;background:#ff6a3d;vertical-align:-12px;margin-left:6px}
#t1 .sub{padding:26px 44px 0;font-size:30px;color:#8a8a8a}
#repo{z-index:3}
.q{position:absolute;left:90px;width:900px;padding:30px 40px;font-size:38px;line-height:1.25}
.q .n{font-family:var(--mono);font-weight:800;color:var(--acc);font-size:30px}
.q .qt{font-weight:800;font-size:44px;letter-spacing:-.03em;margin-top:6px}
.q .r{margin-top:16px;font-size:34px;color:#555;display:flex;gap:14px;align-items:center}
.q .r b{background:#111;color:#fff;font-family:var(--mono);font-size:24px;padding:4px 12px;border-radius:8px}
#yes{position:absolute;left:680px;top:780px;font-family:var(--mono);font-weight:800;font-size:46px;background:#2e9e4a;color:#fff;padding:18px 34px;border-radius:999px;
 box-shadow:0 30px 50px -16px rgba(46,158,74,.6)}
#tests{left:90px;top:330px;width:900px;height:560px}
.tr{display:flex;align-items:center;gap:22px;padding:0 44px;height:96px;font-size:36px;font-weight:600}
.tr .d{width:54px;height:54px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-family:var(--sans);font-weight:800;font-size:32px;color:#fff;background:#d23b2a}
#tests .h{padding:30px 44px 18px;font-size:28px;color:#8a8a8a}
#stat{position:absolute;left:90px;top:900px;width:900px;text-align:center;font-family:var(--mono);font-weight:800;font-size:40px}
#fol{top:1250px}
#field{top:640px}
"""
X = '<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"><path d="M25 25l50 50M75 25L25 75"/></svg>'
F.body.append('<div class="layer" id="serl">' + series("Free AI tool", 2, x=70, y=190) + '</div>')

# S0 hook: we asked for a login page, the agent built a dark-mode toggle
F.clip(0, '<div id="ask">Add a login page</div>'
          '<div id="res" class="card"><div class="h">✓ Done. I built:</div><div class="t">A dark mode<br>toggle</div><div class="tg"></div>'
          '<div class="m"><i></i><i></i><i></i></div></div>'
          f'<div id="nope">{X}</div>'
       + F.block([[(0, 3, "")], [(4, 6, "hl")]], top=990, size=96))
# S1 /grill-me typed
F.clip(1, '<div id="t1" class="term"><div class="bar"><i></i><i></i><i></i></div>'
          '<div class="ln"><span class="p">&gt; </span><span class="c" id="cmd"></span><span class="cur" id="cur1"></span></div>'
          '<div class="sub" id="sub1">grill-me · A relentless interview to sharpen a plan or design.</div></div>'
       + chip("repo", "mattpocock/skills", 150, 760, "★", "#111")
       + F.block([[(7, 8, "hl"), (9, 10, "it")]], top=1010, size=100))
# S2 the interview: numbered questions
F.clip(2, '<div class="q card" id="q1" style="top:330px"><div class="n">❓ Q1</div><div class="qt">Who can log in?</div></div>'
          '<div class="q card" id="q2" style="top:540px"><div class="n">❓ Q2</div><div class="qt">Email, Google, or both?</div></div>'
          '<div class="q card" id="q3" style="top:750px"><div class="n">❓ Q3</div><div class="qt">Lock after wrong tries?</div></div>'
       + F.block([[(11, 13, ""), (14, 14, "hl")], [(15, 19, "")]], top=1010, size=80))
# S3 each question comes with its recommended answer, "yes" accepts it
F.clip(3, '<div class="q card" id="q4" style="top:380px"><div class="n">❓ Q2</div><div class="qt">Email, Google, or both?</div>'
          '<div class="r" id="r4"><span>➡️</span><b>recommended</b><span>Email first, Google later</span></div></div>'
          '<div id="yes">yes ✓</div>'
       + F.block([[(20, 21, ""), (22, 23, "hl")], [(24, 26, "")]], top=1010, size=84))
# S4 /tdd: red test first, then green
rows = ["rejects a wrong password", "logs in with the right one", "locks after too many tries"]
F.clip(4, '<div id="tests" class="term"><div class="bar"><i></i><i></i><i></i></div><div class="h">&gt; /tdd  login</div>'
          + "".join(f'<div class="tr" id="tr{k}"><span class="d" id="d{k}">✗</span>{r}</div>' for k, r in enumerate(rows))
          + '</div><div id="stat"><span id="st_r" style="color:#d23b2a">3 failing</span><span id="st_g" style="color:#2e9e4a;opacity:0;position:absolute;left:0;right:0">3 passing</span></div>'
       + F.block([[(27, 28, "hl"), (29, 31, "")], [(32, 33, "b"), (34, 35, "")], [(36, 38, "it")]], top=1000, size=78))
# S5 works with three agents
F.clip(5, chip("c1", "Claude Code", 110, 420, "✳", "#ff4b1f") + chip("c2", "Codex", 520, 600, "◎", "#111")
          + chip("c3", "Copilot", 160, 780, "◆", "#2f6bff")
       + F.block([[(39, 40, "")], [(41, 42, "b"), (43, 44, ""), (45, 45, "b")]], top=1010, size=88))
# S6 CTA
F.clip(6, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(46, 46, ""), (47, 47, "hl")], [(48, 53, "")]], top=900, size=84) + FOLLOW_LINE.replace('class="follow"', 'class="follow" id="fol"'))

S = F.S
for t in (S[1], S[5], S[14], S[22], S[33], S[36], S[41], S[43], S[45]):
    F.pop(t - 0.05)

JS = r"""
// S0 hook (all on screen at t=0)
ft('#ask',{opacity:1,y:0},{opacity:1,y:-10,duration:ST[1],ease:'none'},0);
ft('#res',{opacity:1,y:30,scale:.97},{opacity:1,y:0,scale:1.02,duration:ST[1],ease:'none'},0);
popIn('#nope',S[5]-0.12,{y:40,s:.3,r:-30});
outUp(['#ask','#res','#nope'],ST[1]);
starPass('#st1',ST[1]-0.3,[760,-700,0],[600,-520,40],10,1.2);
// S1 type /grill-me
ft('#t1',{opacity:0,y:140,rotationX:28,transformPerspective:1400,filter:'blur(12px)'},{opacity:1,y:0,rotationX:0,filter:'blur(0px)',duration:.6,ease:A},ST[1]+0.02);
(function(){ const el=document.getElementById('cmd'), w='/grill-me', o={n:0};
  ft(o,{n:0},{n:w.length,duration:.42,ease:`steps(${w.length})`,onUpdate:()=>{el.textContent=w.slice(0,Math.round(o.n))}},S[7]); })();
ft('#sub1',{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:A},S[8]+0.1);
popIn('#repo',S[9]-0.1,{y:60,s:.6,r:-6});
outUp(['#t1','#repo'],ST[2]);
// S2 questions stack in
['#q1','#q2','#q3'].forEach((q,k)=>ft(q,{opacity:0,x:k%2?160:-160,rotation:k%2?4:-4,filter:'blur(10px)'},{opacity:1,x:0,rotation:0,filter:'blur(0px)',duration:.6,ease:'back.out(1.3)'},S[14]-0.1+k*0.42));
outUp(['#q1','#q2','#q3'],ST[3]);
starPass('#st2',ST[3]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S3 recommended answer + yes
ft('#q4',{opacity:0,scale:.85,y:80},{opacity:1,scale:1,y:0,duration:.55,ease:A},ST[3]+0.02);
ft('#r4',{opacity:0,x:-40},{opacity:1,x:0,duration:.45,ease:A},S[22]-0.1);
popIn('#yes',S[25]-0.1,{y:60,s:.4,r:10});
outUp(['#q4','#yes'],ST[4]);
// S4 tdd red -> green
ft('#tests',{opacity:0,y:160,rotationY:-22,transformPerspective:1400},{opacity:1,y:0,rotationY:0,duration:.65,ease:A},ST[4]+0.02);
[0,1,2].forEach(k=>ft('#tr'+k,{opacity:0,x:-40},{opacity:1,x:0,duration:.35,ease:A},S[33]-0.1+k*0.12));
ft('#st_r',{opacity:0,y:20},{opacity:1,y:0,duration:.3,ease:A},S[34]);
[0,1,2].forEach(k=>{ tl.to('#d'+k,{backgroundColor:'#2e9e4a',scale:1.25,duration:.15,ease:'power2.out'},S[37]+k*0.14);
  tl.to('#d'+k,{scale:1,duration:.3,ease:'back.out(2)'},S[37]+k*0.14+0.15);
  tl.call(()=>{},null,S[37]+k*0.14); });
[0,1,2].forEach(k=>{ const el=document.getElementById('d'+k); const o={v:0};
  ft(o,{v:0},{v:1,duration:.01,onUpdate:()=>{el.textContent=o.v>0.5?'✓':'✗'}},S[37]+k*0.14); });
tl.to('#st_r',{opacity:0,duration:.15},S[38]); ft('#st_g',{opacity:0,scale:.8},{opacity:1,scale:1,duration:.4,ease:'back.out(2)'},S[38]);
outUp(['#tests','#stat'],ST[5]);
// S5 agents
popIn('#c1',S[41]-0.15,{y:60,s:.6,r:-6}); popIn('#c2',S[43]-0.15,{y:60,s:.6,r:6}); popIn('#c3',S[45]-0.15,{y:60,s:.6,r:-4});
outUp(['#c1','#c2','#c3'],ST[6]);
starPass('#st3',ST[6]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S6 CTA
cta('GRILL',S[47]);
ft('#fol',{opacity:0,y:30},{opacity:.85,y:0,duration:.4,ease:A},S[49]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[53]+0.15);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
