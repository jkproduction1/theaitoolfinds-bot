"""5 ECC commands for Claude Code (listicle, creator & dev).
Facts: github.com/affaan-m/ECC (MIT, v2.2.3): Claude Code plugin `/plugin install ecc@ecc`; commands/ holds 98 command files
(COMMANDS-QUICK-REF.md says 94) -> "over ninety". commands/plan.md: restate requirements, identify risks, step plan,
"WAIT for user CONFIRM before touching any code". build-fix.md: "incrementally fix build and type errors with minimal,
safe changes". orch-fix-defect.md: "reproduce it as a failing regression test, fix to green, review, gated commit".
test-coverage.md: "identify gaps, and generate missing tests" (80% target). santa-loop.md: "two independent reviewers ...
must both approve before code ships". Error lines / diff / test names in the visuals are illustrative, drawn in code.
Media: README hero (assets/hero.png, left crop)."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile

W = HERE.parent.parent / "work" / "ecc5"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
DISP = {23: "/plan.", 37: "/build-fix", 50: "/orch-fix-defect", 66: "/test-coverage", 76: "/santa-loop."}
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display=DISP)
F.scenes([0, 8, 17, 22, 24, 36, 38, 49, 59, 65, 75, 77, 88], hold=0.15)

CSS = r"""
.num{position:absolute;left:0;right:0;top:270px;text-align:center;font-size:140px;font-weight:800;letter-spacing:-.05em;line-height:1}
.num span{color:#ff4b1f}
.tm{left:110px;width:860px}
.tm .body{padding:34px 44px;font-size:42px;line-height:1.55}
.tm .p{color:#ff4b1f}.tm .g{color:#8a8a8a}.tm .r{color:#ff6a4a}.tm .ok{color:#7ddc8a}
#zero{position:absolute;left:760px;top:700px;width:200px;height:200px;border-radius:50%;background:#ff4b1f;color:#fff;font-size:130px;font-weight:800;
 display:flex;align-items:center;justify-content:center;letter-spacing:-.05em;box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#hero{position:absolute;left:200px;top:320px;width:680px;border-radius:26px;overflow:hidden;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.45),0 18px 30px -10px rgba(0,0,0,.25)}
#hero img{display:block;width:100%}
#n90{position:absolute;left:500px;top:830px;background:#ff4b1f;color:#fff;font-weight:800;font-size:58px;padding:16px 34px;border-radius:24px;transform:rotate(-5deg);
 box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#mit{position:absolute;left:150px;top:850px;background:#fff;font-family:var(--mono);font-weight:700;font-size:38px;padding:14px 28px;border-radius:18px;box-shadow:0 20px 40px -16px rgba(0,0,0,.3)}
#five{position:absolute;left:80px;top:300px;font-size:560px;font-weight:800;letter-spacing:-.08em;line-height:1}
.cm{position:absolute;left:470px;background:#141414;color:#eee;font-family:var(--mono);font-weight:700;font-size:40px;padding:18px 30px;border-radius:20px;
 box-shadow:0 30px 50px -18px rgba(0,0,0,.45)}
.cm i{font-style:normal;color:#ff4b1f}
.card{position:absolute}
#dlg{left:250px;top:620px;width:720px;padding:34px 40px}
#dlg .t{font-weight:800;font-size:50px;letter-spacing:-.03em}
#dlg .ln{height:16px;border-radius:8px;background:#ececec;margin-top:20px}
#dlg .btns{display:flex;justify-content:flex-end;gap:24px;margin-top:36px}
#dlg .btns b{font-size:44px;padding:18px 40px;border-radius:20px;background:#efefee;color:#6f6f6f}
#dlg .btns b.o{background:#ff4b1f;color:#fff;box-shadow:0 20px 34px -12px rgba(255,75,31,.6)}
#diff{left:110px;top:380px;width:860px;padding:30px 0;font-family:var(--mono);font-size:40px}
#diff .h{padding:0 40px 18px;font-family:var(--sans);font-weight:800;font-size:42px;letter-spacing:-.02em}
#diff .d{padding:12px 40px;white-space:nowrap;font-size:36px}
#diff .m{background:#ffe3dc;color:#b3260a}
#diff .a{background:#ddf3e0;color:#1d6b2c}
#pass6{position:absolute;left:520px;top:830px;background:#111;color:#fff;font-weight:700;font-size:44px;padding:18px 32px;border-radius:22px}
#pass6 b{color:#7ddc8a}
.tc{left:110px;top:470px;width:860px;padding:34px 40px}
.tc .h{font-weight:800;font-size:42px;letter-spacing:-.02em;color:#6f6f6f}
.tc .row{display:flex;align-items:center;gap:24px;margin-top:26px;padding:24px 28px;border-radius:22px;background:#ffe3dc;font-size:40px;font-weight:600}
.tc .row b{width:66px;height:66px;border-radius:50%;background:#ff4b1f;color:#fff;display:flex;align-items:center;justify-content:center;font-size:36px;flex:none}
.tc .row span{flex:1;font-family:var(--mono);font-size:34px}
.tc .row em{font-style:normal;font-family:var(--mono);font-weight:800;color:#b3260a}
#tc8 .row.g{background:#ddf3e0}
#tc8 .row.g b{background:#2e9e4a}
#tc8 .row.g em{color:#1d6b2c}
#cov{left:110px;top:460px;width:860px;padding:34px 40px}
#cov .r{display:flex;align-items:center;gap:22px;margin-top:22px;font-family:var(--mono);font-size:32px;font-weight:600}
#cov .r span{width:230px}
#cov .bar{position:relative;flex:1;height:34px;border-radius:17px;background:#ececec}
#cov .bar i{position:absolute;left:0;top:0;bottom:0;border-radius:17px;background:#111}
#cov .bar u{position:absolute;left:0;top:0;bottom:0;border-radius:17px;background:#ff4b1f;width:0}
#cov .line{position:absolute;top:30px;bottom:30px;left:calc(40px + 252px + (100% - 80px - 252px)*.8);width:4px;background:#ff4b1f;opacity:.5}
#cov .lt{position:absolute;top:0;font-family:var(--mono);font-size:24px;color:#ff4b1f;transform:translateX(-50%)}
.rv{top:420px;width:400px;padding:36px 34px;text-align:center}
.rv .av{width:120px;height:120px;border-radius:50%;margin:0 auto;background:#111;display:flex;align-items:center;justify-content:center}
.rv .av svg{width:70px;height:70px}
.rv .n{font-weight:800;font-size:44px;letter-spacing:-.03em;margin-top:20px}
.rv .s{display:inline-block;margin-top:22px;border:6px solid #2e9e4a;color:#2e9e4a;font-weight:800;font-size:40px;padding:6px 20px;border-radius:14px;transform:rotate(-6deg)}
#ship{position:absolute;left:370px;top:820px;background:#ff4b1f;color:#fff;font-weight:800;font-size:52px;padding:16px 38px;border-radius:24px;box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
"""

def num(n):
    return f'<div id="n{n}" class="num"><span>#</span>{n}</div>'

# S0 Claude Code with zero plugins
F.clip(0, '<div id="t0" class="term tm" style="top:400px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> /plugin</div><div class="g">Installed plugins</div><div class="g">(none)</div></div></div><div id="zero">0</div>'
       + F.block([[(0, 2, "")], [(3, 4, "b")], [(5, 5, ""), (6, 7, "hl")]], top=1020, size=86))
# S1 ECC hero (real) + 90+ commands
F.clip(1, '<div id="hero"><img src="assets/hero.jpg" alt=""></div><div id="n90">90+ commands</div><div id="mit">MIT · free</div>'
       + F.block([[(8, 8, "hl"), (9, 11, "")], [(12, 13, ""), (14, 15, "b")], [(16, 16, "it")]], top=1030, size=86))
# S2 big 5 + command stack
CMDS = ["plan", "build-fix", "orch-fix-defect", "test-coverage", "santa-loop"]
F.clip(2, '<div id="five">5</div>' + "".join(f'<div class="cm" id="cm{k}" style="top:{360 + k * 116}px"><i>/</i>{c}</div>' for k, c in enumerate(CMDS))
       + F.block([[(17, 18, "")], [(19, 19, "hl"), (20, 21, "it")]], top=1060, size=100))
# S3 #1 /plan title
F.clip(3, num(1) + '<div id="big3" style="position:absolute;left:0;right:0;top:520px;text-align:center;font-family:var(--mono);font-weight:800;font-size:200px;letter-spacing:-.04em"><span style="color:#ff4b1f">/</span>plan</div>'
       + F.block([[(22, 22, "it"), (23, 23, "mono b")]], top=1060, size=110))
# S4 writes the plan, waits for your OK
F.clip(4, '<div id="t3" class="term tm" style="top:340px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> <span id="ty3"></span></div>'
          + "".join(f'<div id="pl{k}"><span class="p">{k + 1}.</span> {t}</div>' for k, t in enumerate(["Restate requirements", "Identify risks", "Step-by-step plan"]))
          + '</div></div>'
          '<div id="dlg" class="card"><div class="t">Proceed with this plan?</div><div class="ln" style="width:90%"></div>'
          '<div class="btns"><b>Wait</b><b class="o" id="okb">OK</b></div></div>' + tile("lk", "lock", 70, 770, 170, acc=True)
       + F.block([[(24, 27, "")], [(28, 29, ""), (30, 32, "hl")], [(33, 35, "b")]], top=1030, size=84))
# S5 #2 /build-fix
F.clip(5, num(2) + '<div id="t5" class="term tm" style="top:480px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> <span id="ty5"></span></div></div></div>'
       + F.block([[(36, 36, "it"), (37, 37, "mono b")]], top=1060, size=100))
# S6 finds build errors, then small safe diff
F.clip(6, '<div id="t6" class="term tm" style="top:420px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          + "".join(f'<div class="r" id="er{k}">✕ error&nbsp; {t}</div>' for k, t in enumerate(["src/app.ts:14", "src/api.ts:52", "src/ui.tsx:8"]))
          + '</div></div>'
          '<div id="diff" class="card"><div class="h">src/api.ts</div>'
          '<div class="d m" id="d0">- return data.itme</div><div class="d a" id="d1">+ return data.item</div>'
          '<div class="d m" id="d2">- import { fetchr } from "./net"</div><div class="d a" id="d3">+ import { fetcher } from "./net"</div></div>'
          '<div id="pass6"><b>✓</b> build passing</div>'
       + F.block([[(38, 41, "")], [(42, 45, "")], [(46, 48, "hl")]], top=1030, size=84))
# S7 #3 failing test first
F.clip(7, num(3) + '<div id="tc7" class="card tc"><div class="h">regression test</div>'
          '<div class="row" id="r7"><b>✕</b><span>login with a plus sign</span><em>FAIL</em></div></div>'
       + F.block([[(49, 49, "it"), (50, 50, "mono b")], [(51, 54, "")], [(55, 57, "hl"), (58, 58, "")]], top=1020, size=74))
# S8 fix until green
F.clip(8, '<div id="tc8" class="card tc" style="top:400px"><div class="h">regression test</div>'
          '<div class="row" id="r8"><b id="r8b" style="position:relative"><i id="x8" style="position:absolute;font-style:normal">✕</i><i id="v8" style="position:absolute;font-style:normal;opacity:0">✓</i></b><span>login with a plus sign</span><em style="position:relative;width:110px"><i id="e8f" style="position:absolute;right:0;top:-24px;font-style:normal">FAIL</i><i id="e8p" style="position:absolute;right:0;top:-24px;font-style:normal;color:#1d6b2c;opacity:0">PASS</i></em></div></div>'
       + F.block([[(59, 61, "")], [(62, 63, ""), (64, 64, "hl")]], top=1050, size=92))
# S9 #4 coverage gaps get filled
COV = [("auth.ts", 34), ("cart.ts", 58), ("api.ts", 81), ("ui.tsx", 46)]
F.clip(9, num(4) + '<div id="cov" class="card">' + "".join(
          f'<div class="r"><span>{n}</span><div class="bar"><u id="cu{k}"></u><i id="ci{k}" style="width:{p}%"></i></div></div>' for k, (n, p) in enumerate(COV))
          + '</div>'
       + F.block([[(65, 65, "it"), (66, 66, "mono b")], [(67, 71, "")], [(72, 74, "hl")]], top=1030, size=76))
# S10 #5 santa-loop
F.clip(10, num(5) + '<div id="t10" class="term tm" style="top:520px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
           '<div><span class="p">&gt;</span> <span id="ty10"></span></div></div></div>'
       + F.block([[(75, 75, "it"), (76, 76, "mono b")]], top=1060, size=104))
# S11 two reviewers both approve
AV = '<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><circle cx="50" cy="36" r="16"/><path d="M20 86c4-18 16-26 30-26s26 8 30 26"/></svg>'
F.clip(11, f'<div id="rva" class="card rv" style="left:100px"><div class="av">{AV}</div><div class="n">Reviewer A</div><div class="s" id="sa">✓ APPROVED</div></div>'
           f'<div id="rvb" class="card rv" style="left:580px"><div class="av" style="background:#ff4b1f">{AV}</div><div class="n">Reviewer B</div><div class="s" id="sb">✓ APPROVED</div></div>'
           '<div id="ship">ship it ↗</div>'
       + F.block([[(77, 77, "b"), (78, 79, "")], [(80, 83, "")], [(84, 84, ""), (85, 87, "hl")]], top=1030, size=80))
# S12 CTA
F.clip(12, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(88, 88, ""), (89, 89, "hl")], [(90, 95, "")]], top=1020, size=84))

S = F.S
for i in (6, 8, 15, 19, 23, 32, 37, 41, 50, 57, 64, 66, 76, 83, 87, 89):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.045;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
function numIn(n,t){ ft('#n'+n,{opacity:0,y:-40,scale:1.4,filter:'blur(18px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.45,ease:A},t); }
// S0 terminal there at t=0, zero badge slams on "zero"
ft('#t0',{opacity:1,y:60,scale:.96},{opacity:1,y:0,scale:1,duration:1,ease:A},0);
ft('#zero',{opacity:0,scale:2.6,rotation:-30,filter:'blur(12px)'},{opacity:1,scale:1,rotation:-6,filter:'blur(0px)',duration:.45,ease:'back.out(2)'},S[6]-0.08);
tl.to('#t0',{x:-30,duration:.06,yoyo:true,repeat:3,ease:'none'},S[6]+0.05);
outUp(['#t0','#zero'],ST[1]);
// S1 hero + counter
ft('#hero',{opacity:0,y:220,rotationX:28,transformPerspective:1600,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.9,ease:A},ST[1]+0.02);
ft('#hero img',{scale:1},{scale:1.08,transformOrigin:'30% 30%',duration:ST[2]-ST[1],ease:'none'},ST[1]);
popIn('#mit',S[11]-0.1,{y:40,s:.7,r:-6});
popIn('#n90',S[15]-0.12,{y:60,s:.5,r:10});
const N9={n:0}; ft(N9,{n:0},{n:90,duration:.6,ease:'power2.out',onUpdate:()=>{document.getElementById('n90').textContent=Math.round(N9.n)+'+ commands'}},S[15]-0.1);
outUp(['#hero','#n90','#mit'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 big 5 + stack
ft('#five',{opacity:0,scale:2.2,filter:'blur(30px)',rotation:-8},{opacity:1,scale:1,filter:'blur(0px)',rotation:0,duration:.6,ease:A},S[19]-0.15);
[0,1,2,3,4].forEach(k=>ft('#cm'+k,{opacity:0,x:200,filter:'blur(10px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.5,ease:'back.out(1.4)'},ST[2]+0.05+k*0.09));
outUp(['#five','#cm0','#cm1','#cm2','#cm3','#cm4'],ST[3]);
// items: numbers
[[3,1],[5,2],[7,3],[9,4],[10,5]].forEach(([sc,n])=>{ numIn(n,ST[sc]+0.02); tl.to('#n'+n,{opacity:0,y:-40,filter:'blur(12px)',duration:.22,ease:IN},ST[sc+1]-0.22); });
// S3 /plan title
ft('#big3',{opacity:0,scale:1.6,filter:'blur(24px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.45,ease:A},S[23]-0.15);
outUp('#big3',ST[4]);
// S4 plan steps, then the dialog waits; OK pressed on "OK"
popIn('#t3',ST[4]+0.02,{y:60,s:.94,r:0}); typeIn('ty3','/plan add dark mode',ST[4]+0.1,.03);
[0,1,2].forEach(k=>ft('#pl'+k,{opacity:0,x:-40},{opacity:1,x:0,duration:.35,ease:A},S[25]+k*0.22));
popIn('#dlg',S[28]-0.1,{y:80,s:.9,r:-2}); popIn('#lk',S[29],{y:60,s:.5,r:-12});
tl.to('#t3',{opacity:.5,filter:'blur(3px)',duration:.3},S[28]);
tl.to('#lk',{rotation:-8,duration:.08,yoyo:true,repeat:5,ease:'none'},S[34]);
tl.to('#okb',{scale:1.15,duration:.15,ease:'power2.out',yoyo:true,repeat:1},S[32]-0.05);
outUp(['#t3','#dlg','#lk'],ST[5]);
// S5 /build-fix typed
popIn('#t5',ST[5]+0.05,{y:60,s:.94,r:0}); typeIn('ty5','/build-fix',S[37]-0.2,.04);
outUp('#t5',ST[6]);
// S6 errors, then they give way to a small diff
popIn('#t6',ST[6]+0.02,{y:60,s:.94,r:0});
[0,1,2].forEach(k=>ft('#er'+k,{opacity:0,x:-40},{opacity:1,x:0,duration:.3,ease:A},S[40]-0.1+k*0.12));
outUp('#t6',S[42]+0.1);
popIn('#diff',S[42]+0.05,{y:80,s:.9,r:2});
[0,1,2,3].forEach(k=>ft('#d'+k,{opacity:0,x:k%2?60:-60},{opacity:1,x:0,duration:.35,ease:A},S[42]+0.25+k*0.12));
popIn('#pass6',S[47]-0.1,{y:40,s:.6,r:6});
outUp(['#diff','#pass6'],ST[7]);
starPass('#st2',ST[7]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S7 failing test
popIn('#tc7',ST[7]+0.1,{y:80,s:.9,r:-2});
ft('#r7',{opacity:0,y:30},{opacity:1,y:0,duration:.35,ease:A},S[56]-0.1);
tl.to('#r7',{x:-18,duration:.06,yoyo:true,repeat:5,ease:'none'},S[56]+0.2);
outUp('#tc7',ST[8]);
// S8 fix to green
ft('#tc8',{opacity:0,scale:.9},{opacity:1,scale:1,duration:.4,ease:A},ST[8]+0.02);
tl.to('#r8',{backgroundColor:'#ddf3e0',duration:.25},S[64]-0.1);
tl.to('#r8b',{backgroundColor:'#2e9e4a',rotation:360,duration:.4,ease:'back.out(2)'},S[64]-0.1);
ft(['#x8','#e8f'],{opacity:1},{opacity:0,duration:.1},S[64]); ft(['#v8','#e8p'],{opacity:0},{opacity:1,duration:.1},S[64]);
tl.to('#tc8',{scale:1.05,duration:.2,yoyo:true,repeat:1,ease:'power2.out'},S[64]);
outUp('#tc8',ST[9]);
// S9 coverage: gaps glow, then filled to 80%+
popIn('#cov',ST[9]+0.1,{y:80,s:.9,r:2});
[0,1,2,3].forEach(k=>ft('#ci'+k,{scaleX:0,transformOrigin:'0 50%'},{scaleX:1,duration:.6,ease:A},ST[9]+0.3+k*0.08));
[0,1,3].forEach((k,j)=>ft('#cu'+k,{width:'0%'},{width:['86%','84%','','88%'][k],duration:.6,ease:'power3.out'},S[71]+j*0.12));
outUp('#cov',ST[10]);
// S10 /santa-loop
popIn('#t10',ST[10]+0.05,{y:60,s:.94,r:0}); typeIn('ty10','/santa-loop',S[76]-0.2,.04);
outUp('#t10',ST[11]);
starPass('#st3',ST[11]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S11 reviewers approve, ship
popIn('#rva',ST[11]+0.02,{y:80,s:.8,r:-6}); popIn('#rvb',ST[11]+0.12,{y:80,s:.8,r:6});
ft('#sa',{opacity:0,scale:2.4},{opacity:1,scale:1,duration:.3,ease:'back.out(2.5)'},S[83]-0.05);
ft('#sb',{opacity:0,scale:2.4},{opacity:1,scale:1,duration:.3,ease:'back.out(2.5)'},S[83]+0.2);
popIn('#ship',S[87]-0.1,{y:60,s:.5,r:-8});
outUp(['#rva','#rvb','#ship'],ST[12]);
cta('ECC',S[89]);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[95]+0.15);
tl.to('#typed',{color:'#ff4b1f',duration:.2},S[95]+0.25);
"""
F.write(CSS, JS, music_vol=0.10)
