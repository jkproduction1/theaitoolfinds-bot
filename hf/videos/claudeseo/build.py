"""Claude SEO - free open-source SEO audit plugin for Claude Code (pillar: paid -> free).
Facts: github.com/AgriciDaniel/claude-seo README: "Free, open-source SEO audits inside Claude Code"; MIT; "Give it any
website and it runs a full SEO audit in 10 to 15 minutes, then hands you a clear action plan, sorted by what matters
most"; "up to 17 agents work on your site at the same time"; checks technical SEO, speed/Core Web Vitals, content
(E-E-A-T), schema, AI search (how likely AI Overviews, ChatGPT, Perplexity, Gemini are to cite your pages); "Every
recommendation explains why it matters and how you will know it worked"; "Your data stays with you: Yes, it runs on
your machine"; SEO audit software "$99 to $999 a month" (README comparison table, illustrative).
Install: /plugin marketplace add AgriciDaniel/claude-seo, /plugin install claude-seo@agricidaniel-claude-seo.
Media: frames from the README demo GIF (screenshots/seo-audit-demo.gif, cropped). Rest drawn in code."""
import math, shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "claudeseo"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
DISP = {31: "10", 32: "to", 33: "15", 34: "minutes.", 37: "17"}
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display=DISP)
F.scenes([0, 7, 16, 20, 35, 46, 51, 62, 71, 81, 86])

CSS = r"""
.rc{position:absolute;width:560px;padding:34px 40px;border-radius:26px;background:#fff;
 box-shadow:0 50px 80px -24px rgba(0,0,0,.30),0 0 0 1px rgba(0,0,0,.05)}
.rc .top{display:flex;justify-content:space-between;font-weight:700;font-size:36px;letter-spacing:-.02em}
.rc .top span{color:#8a8a8a;font-weight:500}
.rc .amt{font-size:96px;font-weight:800;letter-spacing:-.05em;margin-top:16px}
.rc .amt small{font-size:40px;color:#8a8a8a;font-weight:600;letter-spacing:-.02em}
.rc .ln{height:16px;border-radius:8px;background:#ececec;margin-top:18px}
.rc .st{position:absolute;right:30px;top:120px;border:5px solid #ff4b1f;color:#ff4b1f;font-weight:800;font-size:38px;padding:6px 18px;border-radius:12px;transform:rotate(-10deg)}
.tm{left:110px;top:400px;width:860px}
.tm .body{padding:34px 40px;font-size:40px;line-height:1.55}
.tm .p{color:#ff4b1f}.tm .g{color:#8a8a8a}
#free{position:absolute;left:660px;top:300px;background:#ff4b1f;color:#fff;font-weight:800;font-size:72px;padding:14px 38px;border-radius:22px;transform:rotate(8deg);
 box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#mit{position:absolute;left:150px;top:760px;background:#111;color:#fff;font-family:var(--mono);font-weight:700;font-size:40px;padding:16px 30px;border-radius:18px}
#oss{position:absolute;left:470px;top:770px}
#name{position:absolute;left:0;right:0;top:290px;text-align:center}
#name .a{font-family:var(--serif);font-style:italic;font-size:120px;font-weight:500;letter-spacing:-.02em;line-height:1}
#name .b{font-size:190px;font-weight:800;letter-spacing:-.07em;line-height:.95}
#cmds{left:160px;top:650px;width:760px;height:372px;overflow:hidden;border-radius:24px;background:#1e1e1e}
#cmds img{width:760px;height:auto;display:block}
#url{left:110px;top:300px;width:860px;height:140px;border-radius:70px;display:flex;align-items:center;padding-left:50px;font-family:var(--mono);font-size:44px;font-weight:700}
#url .p{color:#ff4b1f;margin-right:18px}
#url i{display:inline-block;width:6px;height:56px;background:#111;margin-left:6px}
#aud{left:100px;top:480px;width:880px;height:328px;overflow:hidden;border-radius:24px;background:#1e1e1e}
#aud img{width:880px;height:auto;display:block}
#clock{position:absolute;left:720px;top:770px;width:250px;height:250px;border-radius:50%;background:#111;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.45)}
#clock b{font-size:84px;font-weight:800;letter-spacing:-.05em;line-height:1}
#clock span{font-size:32px;color:#bbb;font-weight:600}
#fan svg{position:absolute;left:0;top:0}
#site{position:absolute;left:390px;top:520px;width:300px;height:220px;border-radius:24px;background:#fff;padding:26px;
 box-shadow:0 50px 80px -24px rgba(0,0,0,.32),0 0 0 1px rgba(0,0,0,.05)}
#site .bar{height:20px;border-radius:10px;background:#111;width:60%}
#site .ln{height:14px;border-radius:7px;background:#e6e6e6;margin-top:18px}
.ag{position:absolute;width:74px;height:74px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-weight:700;font-size:26px;
 box-shadow:0 18px 30px -12px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
.ag.o{background:#ff4b1f;color:#fff}
#big17{position:absolute;left:90px;top:250px;font-size:230px;font-weight:800;letter-spacing:-.07em;line-height:1}
#big17 span{font-size:60px;letter-spacing:-.02em;color:#ff4b1f;margin-left:10px}
.ck{position:absolute;display:flex;align-items:center;gap:22px;padding:24px 40px 24px 26px;border-radius:30px;background:#fff;font-weight:700;font-size:58px;letter-spacing:-.03em;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04)}
.ck b{width:70px;height:70px;border-radius:20px;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-size:40px}
.ck b.o{background:#ff4b1f}
.ai{position:absolute;width:430px;padding:30px 34px;border-radius:30px;background:#fff;box-shadow:0 50px 80px -24px rgba(0,0,0,.30),0 0 0 1px rgba(0,0,0,.05)}
.ai .h{display:flex;align-items:center;gap:18px;font-weight:800;font-size:46px;letter-spacing:-.03em}
.ai .h b{width:60px;height:60px;border-radius:50%;background:#111}
.ai .ln{height:14px;border-radius:7px;background:#ececec;margin-top:18px}
.ai .cite{display:inline-block;margin-top:20px;background:#ff4b1f;color:#fff;font-weight:700;font-size:30px;padding:8px 18px;border-radius:14px}
#plan{left:150px;top:300px;width:780px;padding:36px 40px}
#plan .t{font-weight:800;font-size:46px;letter-spacing:-.03em;margin-bottom:16px}
.pr{display:flex;align-items:center;gap:22px;margin-top:20px;font-size:38px;font-weight:600}
.pr b{display:inline-flex;align-items:center;justify-content:center;width:86px;height:58px;border-radius:14px;color:#fff;font-family:var(--mono);font-size:30px}
.pr .q{flex:1;height:16px;border-radius:8px;background:#ececec}
#fix{left:150px;top:300px;width:780px;padding:40px 44px}
#fix .t{font-size:44px;font-weight:800;letter-spacing:-.03em}
#fix .ln{height:16px;border-radius:8px;background:#ececec;margin-top:20px}
#fix .v{margin-top:30px;display:flex;align-items:center;gap:20px;padding:22px 28px;border-radius:20px;background:#f3f3f2;font-size:36px;font-weight:700}
#fix .v b{width:56px;height:56px;border-radius:50%;background:#ff4b1f;color:#fff;display:flex;align-items:center;justify-content:center;font-size:34px}
#fix .v span{color:#6f6f6f;font-weight:500}
#mine{position:absolute;left:630px;top:560px;padding:20px 34px;border-radius:24px;background:#111;color:#fff;font-family:var(--mono);font-weight:700;font-size:38px}
"""

# S0 monthly bills stack up
recs = "".join(
    f'<div id="rc{k}" class="rc" style="left:{140 + k * 110}px;top:{280 + k * 195}px"><div class="top">SEO audit tool<span>{m}</span></div>'
    f'<div class="amt">$99<small> /month</small></div><div class="ln" style="width:80%"></div><div class="ln" style="width:55%"></div>'
    f'<div class="st">PAID</div></div>' for k, m in enumerate(["Aug", "Sep", "Oct"]))
F.clip(0, recs + F.block([[(0, 0, ""), (1, 4, "b")], [(5, 6, "hl")]], top=1030, size=84))
# S1 free plugin in Claude Code
F.clip(1, '<div id="t1" class="term tm"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">›</span> <span id="ty1"></span></div><div class="g" id="ok1">✓ 26 skills · 19 agents</div></div></div>'
          '<div id="free">FREE</div><div id="mit">MIT license</div>'
       + F.block([[(7, 8, ""), (9, 11, "b")], [(12, 13, ""), (14, 15, "hl")]], top=1030, size=80))
# S2 the name + real command list
F.clip(2, '<div id="name"><div class="a" id="na">Claude</div><div class="b" id="nb">SEO</div></div>'
          '<div id="cmds" class="card"><img src="assets/commands.jpg" alt=""></div>'
       + F.block([[(16, 17, "it"), (18, 19, "hl")]], top=1100, size=96))
# S3 any website -> full audit (real demo frame) + 10-15 min
F.clip(3, '<div id="url" class="card"><span class="p">›</span><span id="ty3"></span><i id="cc3"></i></div>'
          '<div id="aud" class="card"><img src="assets/audit.jpg" alt=""></div>'
          '<div id="clock"><b id="ckn">10</b><span>minutes</span></div>'
       + F.block([[(20, 23, ""), (24, 25, "")], [(26, 29, "b"), (30, 30, "")], [(31, 34, "hl")]], top=1060, size=74))
# S4 17 agents fan out
ags = []
for k in range(17):
    a = -math.pi / 2 + (k - 8) * (math.pi * 1.6 / 16)
    x, y = 540 + 380 * math.cos(a + math.pi), 630 + 300 * math.sin(a + math.pi)
    ags.append((x, y))
svg = '<svg width="1080" height="1000" fill="none" stroke="#b5b5b5" stroke-width="3">' + "".join(
    f'<path class="fl" d="M540 630 L{x:.0f} {y:.0f}" pathLength="1"/>' for x, y in ags) + '</svg>'
dots = "".join(f'<div class="ag{" o" if k % 4 == 0 else ""}" id="ag{k}" style="left:{x - 37:.0f}px;top:{y - 37:.0f}px">{k + 1}</div>'
               for k, (x, y) in enumerate(ags))
F.clip(4, '<div id="fan">' + svg + '<div id="site"><div class="bar"></div><div class="ln" style="width:90%"></div><div class="ln" style="width:70%"></div>'
          '<div class="ln" style="width:80%"></div><div class="ln" style="width:50%"></div></div>' + dots + '</div>'
       + F.block([[(35, 36, ""), (37, 38, "b")], [(39, 41, "")], [(42, 45, "hl")]], top=1060, size=80))
# S5 what it checks
CK = [("Technical", "⚙", 46, 110, 340, ""), ("Speed", "⚡", 48, 560, 400, "o"), ("Content", "¶", 49, 150, 560, ""), ("Schema", "{}", 50, 560, 640, "o")]
F.clip(5, "".join(f'<div class="ck" id="ck{k}" style="left:{x}px;top:{y}px"><b class="{o}">{g}</b>{n}</div>' for k, (n, g, i, x, y, o) in enumerate(CK))
       + F.block([[(46, 47, "b"), (48, 48, "")], [(49, 50, "")]], top=1050, size=92))
# S6 AI search citations
F.clip(6, '<div class="ai" id="ai1" style="left:90px;top:360px"><div class="h"><b></b>ChatGPT</div><div class="ln" style="width:90%"></div>'
          '<div class="ln" style="width:70%"></div><div class="cite" id="ci1">cites your site</div></div>'
          '<div class="ai" id="ai2" style="left:560px;top:520px"><div class="h"><b style="background:#3a3a3a"></b>Perplexity</div><div class="ln" style="width:85%"></div>'
          '<div class="ln" style="width:60%"></div><div class="cite" id="ci2">cites your site</div></div>'
       + F.block([[(51, 54, "")], [(55, 57, "b")], [(58, 61, "hl")]], top=1020, size=78))
# S7 plan sorted by priority
PR = [("P0", "#ff4b1f", "84%"), ("P1", "#111", "70%"), ("P2", "#6f6f6f", "76%"), ("P3", "#b3b3b3", "58%")]
F.clip(7, '<div id="plan" class="card"><div class="t">Action plan</div>'
          + "".join(f'<div class="pr" id="pr{k}"><b style="background:{c}">{p}</b><div class="q" style="max-width:{w}"></div></div>' for k, (p, c, w) in enumerate(PR))
          + '</div>'
       + F.block([[(62, 65, "b")], [(66, 67, ""), (68, 70, "hl")]], top=1030, size=82))
# S8 every fix: how to check it worked
F.clip(8, '<div id="fix" class="card"><div class="t">Fix: add Product schema</div><div class="ln" style="width:92%"></div><div class="ln" style="width:66%"></div>'
          '<div class="v" id="vv"><b>✓</b>How you\'ll know <span>it worked</span></div></div>'
       + F.block([[(71, 74, ""), (75, 75, "")], [(76, 80, "hl")]], top=1030, size=80))
# S9 runs locally
F.clip(9, tile("lap", "local", 250, 420, 380) + '<div id="mine">your machine</div>'
       + F.block([[(81, 82, ""), (83, 85, "hl")]], top=1080, size=92))
# S10 CTA
F.clip(10, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(86, 86, ""), (87, 87, "hl")], [(88, 93, "")]], top=1020, size=84))

S = F.S
for i in (9, 14, 18, 28, 31, 37, 46, 48, 49, 50, 55, 57, 65, 76, 83, 87):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.045;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
function draw(sel,t,d,st){ ft(sel,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:d||.4,ease:'power2.out',stagger:st||0},t); }
// S0 receipts already stacked at t=0, then each gets stamped
for(let k=0;k<3;k++){ ft('#rc'+k,{opacity:1,y:60+k*40,rotation:-6+k*4,scale:.92},{opacity:1,y:0,rotation:-4+k*3,scale:1,duration:1,ease:A},0);
  ft('#rc'+k+' .st',{opacity:0,scale:2.4},{opacity:1,scale:1,duration:.3,ease:'back.out(2.5)'},[0.35,S[4]-0.05,S[6]-0.05][k]); }
tl.to(['#rc0','#rc1','#rc2'],{y:600,rotation:12,opacity:0,filter:'blur(16px)',duration:.3,ease:IN,stagger:.04},ST[1]-0.32);
// S1 install line, FREE stamp, MIT
popIn('#t1',ST[1]+0.02,{y:60,s:.94,r:0});
typeIn('ty1','/plugin install claude-seo',ST[1]+0.15,.035);
ft('#ok1',{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:A},S[13]);
ft('#free',{opacity:0,scale:2.4,rotation:-12,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[9]-0.05);
popIn('#mit',S[10],{y:40,s:.7,r:-6});
tl.to('#t1 .p',{color:'#fff',duration:.2,yoyo:true,repeat:1},S[14]);
outUp(['#t1','#free','#mit'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 name + real command table
ft('#na',{opacity:0,y:40,filter:'blur(14px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.5,ease:A},S[18]-0.1);
ft('#nb',{opacity:0,scale:1.6,filter:'blur(24px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.55,ease:A},S[19]-0.12);
ft('#cmds',{opacity:0,y:200,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.8,ease:A},ST[2]+0.05);
ft('#cmds img',{y:0},{y:-40,duration:ST[3]-ST[2],ease:'none'},ST[2]);
tl.to('#name',{y:-80,opacity:0,filter:'blur(14px)',duration:.25,ease:IN},ST[3]-0.25);
tl.to('#cmds',{y:300,opacity:0,filter:'blur(14px)',duration:.25,ease:IN},ST[3]-0.25);
// S3 URL typed, real audit frame, clock counts 10 -> 15
popIn('#url',ST[3]+0.02,{y:-40,s:.92,r:0});
typeIn('ty3','/seo audit yoursite.com',ST[3]+0.15,.04);
for(let x=ST[3]+0.3;x<ST[4];x+=0.5){ tl.set('#cc3',{opacity:0},x); tl.set('#cc3',{opacity:1},x+0.25); }
ft('#aud',{opacity:0,y:160,scale:.88,rotationX:20,transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,duration:.8,ease:A},S[26]-0.1);
ft('#aud img',{scale:1},{scale:1.08,transformOrigin:'30% 60%',duration:ST[4]-S[26],ease:'none'},S[26]);
popIn('#clock',S[31]-0.15,{y:60,s:.5,r:-20});
const CK={n:10}; ft(CK,{n:10},{n:15,duration:.6,ease:'power1.inOut',onUpdate:()=>{document.getElementById('ckn').textContent=Math.round(CK.n)}},S[33]-0.1);
outUp(['#url','#aud','#clock'],ST[4]);
// S4 agents fan out from the site
popIn('#site',ST[4]+0.02,{y:60,s:.6,r:-6});
draw('#fan .fl',S[37]-0.1,.35,.03);
ft('.ag',{opacity:0,scale:0},{opacity:1,scale:1,duration:.4,ease:'back.out(2.5)',stagger:.035},S[37]);
tl.to('.ag',{y:-14,duration:.25,ease:'power2.out',yoyo:true,repeat:1,stagger:{each:.03,from:'center'}},S[42]);
tl.to('#site',{scale:1.06,duration:.3,ease:'back.out(3)'},S[42]);
outUp(['#site','.ag','#fan svg'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S5 check chips pop on their words
[46,48,49,50].forEach((w,k)=>popIn('#ck'+k,S[w]-0.22,{y:60,s:.6,r:k%2?6:-6}));
outUp(['#ck0','#ck1','#ck2','#ck3'],ST[6]);
// S6 AI answer cards, citation badge
popIn('#ai1',S[55]-0.15,{y:80,s:.8,r:-5}); popIn('#ai2',S[57]-0.15,{y:80,s:.8,r:5});
ft('#ci1',{opacity:0,scale:.4},{opacity:1,scale:1,duration:.35,ease:'back.out(3)'},S[57]+0.1);
ft('#ci2',{opacity:0,scale:.4},{opacity:1,scale:1,duration:.35,ease:'back.out(3)'},S[57]+0.3);
outUp(['#ai1','#ai2'],ST[7]);
// S7 plan rows slide in shuffled, then sort into place
popIn('#plan',ST[7]+0.02,{y:80,s:.9,r:-2});
const off=[180,-60,60,-180]; for(let k=0;k<4;k++){ ft('#pr'+k,{opacity:0,y:off[k],x:k%2?60:-60},{opacity:1,y:off[k]*.6,x:0,duration:.4,ease:A},ST[7]+0.25+k*.08);
  tl.to('#pr'+k,{y:0,duration:.55,ease:'back.out(1.4)'},S[66]); }
tl.to('#pr0',{scale:1.05,transformOrigin:'0 50%',duration:.3,ease:'back.out(3)'},S[69]);
outUp('#plan',ST[8]);
// S8 fix card + verify row
popIn('#fix',ST[8]+0.02,{y:80,s:.9,r:2});
ft('#vv',{opacity:0,x:-60,filter:'blur(10px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.5,ease:A},S[76]-0.1);
ft('#vv b',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.45,ease:'back.out(3)'},S[79]);
outUp('#fix',ST[9]);
starPass('#st3',ST[9]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S9 local
popIn('#lap',ST[9]+0.02,{y:80,s:.7,r:-8});
popIn('#mine',S[84]-0.1,{y:40,s:.7,r:6});
outUp(['#lap','#mine'],ST[10]);
cta('SEO',S[87]);
"""
F.write(CSS, JS, music_vol=0.10)
