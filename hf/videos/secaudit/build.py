"""Cloudflare security-audit skill (pillar: free / open source). Facts: github.com/cloudflare/security-audit-skill README:
seeded Cloudflare's vulnerability discovery harness; install via `npx skills add ... --skill security-audit`; usage
"security audit this codebase"; phases recon -> isolated hunters -> fresh verifier tries to disprove each candidate;
"The agent that checks a finding is never the agent that found it"; "a single run found roughly half of the
vulnerabilities that repeated runs found in total"; MIT. All visuals drawn in code."""
import sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile

W = HERE.parent.parent / "work" / "secaudit"
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json")
F.scenes([0, 8, 18, 30, 41, 49, 62, 68, 81])

CSS = r"""
#code{left:130px;top:340px;width:820px;height:600px;padding:60px 56px}
#code .ln{height:26px;border-radius:13px;background:#e6e6e6;margin-bottom:28px}
.hole{position:absolute;width:110px;height:110px;border-radius:50%;background:#ff4b1f;color:#fff;font-weight:800;font-size:64px;display:flex;align-items:center;justify-content:center;
 box-shadow:0 24px 40px -12px rgba(255,75,31,.6)}
#repo{left:120px;top:380px;width:840px;height:470px;padding:54px 56px}
#repo .own{font-family:var(--mono);font-size:38px;color:#8a8a8a}
#repo .nm{font-family:var(--mono);font-size:56px;font-weight:700;letter-spacing:-.03em;margin-top:8px}
#repo .tags{display:flex;gap:18px;margin-top:44px}
#repo .tags span{font-size:34px;font-weight:700;padding:12px 28px;border-radius:40px;background:#f0f0f0}
#repo .tags span.a{background:#ff4b1f;color:#fff}
#repo .ds{font-size:34px;color:#6f6f6f;margin-top:40px;line-height:1.35}
#tm{left:90px;top:360px;width:900px;height:540px}
#tm .body{padding:36px 40px;font-size:34px;line-height:1.55}
#tm .p{color:#ff4b1f}#tm .g{color:#7a7a7a}
#tm .big{font-size:46px;font-weight:700;color:#fff}
#map svg{position:absolute;left:0;top:0}
.nd{position:absolute;padding:20px 32px;border-radius:22px;font-weight:700;font-size:38px;background:#fff;
 box-shadow:0 30px 50px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05)}
.fc{position:absolute;left:170px;width:740px;height:120px;border-radius:26px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;font-family:var(--mono);font-size:36px;font-weight:600}
.fc .v{font-family:var(--sans);font-weight:800;font-size:34px;padding:8px 22px;border-radius:30px}
.fc .ok{background:#111;color:#fff}.fc .no{background:#ff4b1f;color:#fff}
.who{position:absolute;top:420px;width:330px;height:380px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;font-weight:800;font-size:44px}
.who svg{width:150px;height:150px}
#neq{position:absolute;left:0;right:0;top:500px;text-align:center;font-size:190px;font-weight:800;color:#ff4b1f;line-height:1}
#loop{position:absolute;left:0;right:0;top:400px;text-align:center}
#loopk{display:inline-block;font-size:300px;font-weight:800;line-height:1;color:#111}
#x2{position:absolute;left:730px;top:400px;font-size:120px;font-weight:800;color:#ff4b1f;letter-spacing:-.04em}
.rb{position:absolute;left:150px;width:780px}
.rb .lab{font-size:40px;font-weight:700;margin-bottom:16px;display:flex;justify-content:space-between}
.rb .tr{height:56px;border-radius:28px;background:#dcdcdc;overflow:hidden;position:relative}
.rb .tr i{position:absolute;left:0;top:0;bottom:0;border-radius:28px}
#half{position:absolute;left:0;right:0;top:310px;text-align:center;font-size:160px;font-weight:800;letter-spacing:-.05em;line-height:1}
"""

USER = '<circle cx="50" cy="34" r="16"/><path d="M18 86c4-20 18-30 32-30s28 10 32 30"/>'

lines = "".join(f'<div class="ln" style="width:{w}%"></div>' for w in (70, 88, 54, 92, 64, 80, 46, 74, 60))
F.clip(0, f'<div id="code" class="card">{lines}</div>'
          '<div id="h1" class="hole" style="left:720px;top:420px">!</div><div id="h2" class="hole" style="left:240px;top:600px">!</div>'
          '<div id="h3" class="hole" style="left:640px;top:780px">!</div>'
       + F.block([[(0, 3, "")], [(4, 5, ""), (6, 7, "hl")]], top=1030, size=84))
F.clip(1, '<div id="repo" class="card"><div class="own">cloudflare /</div><div class="nm">security-audit-skill</div>'
          '<div class="tags"><span class="a">Open source</span><span>MIT</span><span>Agent skill</span></div>'
          '<div class="ds">A coding-agent skill for multi-phase security audits.</div></div>'
       + F.block([[(8, 8, "b"), (9, 9, "hl")], [(10, 14, "")], [(15, 15, ""), (16, 17, "it")]], top=990, size=72))
F.clip(2, '<div id="tm" class="term"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div id="ln1"><span class="p">$</span> npx skills add <span class="g">…/security-audit-skill</span></div>'
          '<div id="ln2" class="g">✓ installed security-audit</div>'
          '<div id="ln3" style="margin-top:40px" class="big"><span class="p">›</span> <span id="ty"></span></div></div></div>'
       + F.block([[(18, 23, "")], [(24, 25, "")], [(26, 29, "mono b")]], top=1000, size=72))
F.clip(3, '<div id="map"><svg width="1080" height="1000" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round">'
          '<path id="e1" d="M300 420 L540 560" pathLength="1"/><path id="e2" d="M780 420 L540 560" pathLength="1"/>'
          '<path id="e3" d="M540 560 L330 740" pathLength="1"/><path id="e4" d="M540 560 L760 740" pathLength="1"/></svg>'
          '<div id="n1" class="nd" style="left:170px;top:370px">API</div><div id="n2" class="nd" style="left:680px;top:370px">Auth</div>'
          '<div id="n3" class="nd" style="left:470px;top:520px;background:#111;color:#fff">app</div>'
          '<div id="n4" class="nd" style="left:230px;top:700px">DB</div><div id="n5" class="nd" style="left:660px;top:700px">Files</div></div>'
          + tile("hu1", "search", 90, 560, 170, acc=True) + tile("hu2", "search", 455, 760, 170, acc=True) + tile("hu3", "search", 820, 560, 170, acc=True)
       + F.block([[(30, 30, "it"), (31, 32, ""), (33, 34, "b")], [(35, 35, "it"), (36, 37, "hl"), (38, 40, "")]], top=1020, size=76))
F.clip(4, '<div id="fc1" class="fc card" style="top:380px">auth bypass<span class="v ok">confirmed</span></div>'
          '<div id="fc2" class="fc card" style="top:540px">open redirect<span class="v no">rejected</span></div>'
          '<div id="fc3" class="fc card" style="top:700px">path traversal<span class="v ok">confirmed</span></div>'
       + F.block([[(41, 43, "b"), (44, 45, "")], [(46, 46, "hl"), (47, 48, "")]], top=1020, size=80))
F.clip(5, f'<div id="wa" class="who card" style="left:90px"><svg viewBox="0 0 100 100" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round">{USER}</svg>found it</div>'
          f'<div id="wb" class="who card" style="left:660px"><svg viewBox="0 0 100 100" fill="none" stroke="#ff4b1f" stroke-width="6" stroke-linecap="round">{USER}</svg>checks it</div>'
          '<div id="neq">≠</div>'
       + F.block([[(49, 54, "")], [(55, 56, "hl"), (57, 58, "")], [(59, 61, "")]], top=1010, size=66))
F.clip(6, '<div id="loop"><span id="loopk">↻</span></div><div id="x2">×2</div>'
       + F.block([[(62, 62, "it"), (63, 64, "b"), (65, 67, "hl")]], top=1060, size=84))
F.clip(7, '<div id="half">½</div>'
          '<div id="r1" class="rb" style="top:540px"><div class="lab"><span>1 run</span><span id="p1">≈ 50%</span></div><div class="tr"><i id="r1i" style="background:#ff4b1f;width:50%"></i></div></div>'
          '<div id="r2" class="rb" style="top:720px"><div class="lab"><span>repeated runs</span><span>100%</span></div><div class="tr"><i id="r2i" style="background:#111;width:100%"></i></div></div>'
       + F.block([[(68, 70, "it"), (71, 73, "")], [(74, 75, "hl"), (76, 77, "")], [(78, 80, "")]], top=990, size=72))
F.clip(8, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(81, 81, ""), (82, 82, "hl")], [(83, 88, "")]], top=1020, size=84))

S = F.S
for i in (8, 26, 32, 37, 46, 56, 63, 75, 82):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t){ const el=document.getElementById(id), O={n:0};
  ft(O,{n:0},{n:txt.length,duration:.04*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
// S0 code card already there; holes punch in
ft('#code',{y:40,scale:.97},{y:0,scale:1,duration:1.2,ease:A},0);
ft('#code .ln',{scaleX:.6,transformOrigin:'0 50%'},{scaleX:1,duration:.5,ease:A,stagger:.05},0);
['#h1','#h2','#h3'].forEach((s,k)=>{ ft(s,{opacity:0,scale:2.4,filter:'blur(14px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},k===0?0.05:S[6]-0.1+k*0.14); });
tl.to(['#code','#h1','#h2','#h3'],{scale:.7,opacity:0,filter:'blur(16px)',duration:.3,ease:IN},ST[1]-0.3);
// S1 repo card
ft('#repo',{opacity:0,y:160,rotationX:20,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.8,ease:A},ST[1]);
ft('#repo .tags span',{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:'back.out(2)',stagger:.08},S[9]);
outUp('#repo',ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.4);
// S2 terminal
popIn('#tm',ST[2]+0.05,{y:80,s:.94,r:0});
ft('#ln1',{opacity:0,x:-20},{opacity:1,x:0,duration:.3,ease:A},ST[2]+0.3);
ft('#ln2',{opacity:0,x:-20},{opacity:1,x:0,duration:.3,ease:A},S[22]);
typeIn('ty','security audit this codebase',S[26]-0.1);
outUp('#tm',ST[3]);
// S3 map then hunters
popIn('#n3',ST[3]+0.05,{y:0,s:.5,r:0});
['#n1','#n2','#n4','#n5'].forEach((s,k)=>popIn(s,S[32]+k*0.08,{y:30,s:.6,r:0}));
for(let k=1;k<=4;k++) ft('#e'+k,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.4,ease:'power2.out'},S[32]+0.1+k*0.06);
['#hu1','#hu2','#hu3'].forEach((s,k)=>popIn(s,S[36]-0.1+k*0.12,{y:80,s:.5,r:-12}));
tl.to('#hu1',{x:60,y:-40,duration:.8,ease:IO,yoyo:true,repeat:1},S[38]);
tl.to('#hu3',{x:-60,y:-40,duration:.8,ease:IO,yoyo:true,repeat:1},S[38]);
outUp(['#map','#hu1','#hu2','#hu3'],ST[4]);
// S4 findings: one rejected
['#fc1','#fc2','#fc3'].forEach((s,k)=>popIn(s,ST[4]+0.05+k*0.12,{y:60,s:.92,r:0}));
ft('.fc .v',{opacity:0,scale:1.8},{opacity:1,scale:1,duration:.35,ease:'back.out(2)',stagger:.15},S[46]);
tl.to('#fc2',{x:40,opacity:.45,duration:.4,ease:A},S[47]+0.1);
outUp(['#fc1','#fc2','#fc3'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.4);
// S5 finder != checker
popIn('#wa',ST[5]+0.05,{y:60,s:.8,r:-6}); popIn('#wb',S[52]-0.1,{y:60,s:.8,r:6});
ft('#neq',{opacity:0,scale:2.2,filter:'blur(16px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.4,ease:A},S[56]-0.05);
outUp(['#wa','#wb','#neq'],ST[6]);
// S6 run again
ft('#loopk',{opacity:0,rotation:-200,scale:.5},{opacity:1,rotation:0,scale:1,duration:.7,ease:A},ST[6]+0.02);
tl.to('#loopk',{rotation:360,duration:1.4,ease:IO},S[64]);
ft('#x2',{opacity:0,scale:2,filter:'blur(12px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.35,ease:'back.out(2)'},S[65]);
outUp(['#loop','#x2'],ST[7]);
// S7 half
ft('#half',{opacity:0,y:-40,scale:1.5,filter:'blur(18px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.5,ease:A},S[74]-0.1);
popIn('#r1',ST[7]+0.05,{y:40,s:.95,r:0}); ft('#r1i',{width:'0%'},{width:'50%',duration:.9,ease:A},S[71]);
popIn('#r2',S[77]-0.1,{y:40,s:.95,r:0}); ft('#r2i',{width:'0%'},{width:'100%',duration:.9,ease:A},S[78]);
outUp(['#half','#r1','#r2'],ST[8]);
starPass('#st3',ST[8]-0.3,[900,1500,0],[580,1290,50],8,1.2);
cta('AUDIT',S[82]);
"""
F.write(CSS, JS, music_vol=0.08)
