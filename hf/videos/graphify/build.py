"""Graphify - /graphify maps a codebase into a queryable knowledge graph (pillar: creator/dev tool).
Facts: github.com/Graphify-Labs/graphify README: "Type /graphify in your AI coding assistant and it maps your entire
project ... into a knowledge graph you can query instead of grepping through files"; code parsed with tree-sitter AST,
"deterministic, no LLM, nothing leaves your machine" (docs/media semantic pass uses your model - we only claim code);
graph.html "click nodes, filter, search"; `graphify path A B` traces how two things connect (real output:
FastAPI -> DefaultPlaceholder <- get_request_handler() -> ModelField); Claude Code, Cursor, Codex, Gemini CLI, Copilot
and 20+ more; Apache-2.0. Paid Graphify Cloud claims (80% tokens) deliberately NOT used.
Media: README graph-hero (FastAPI graph) + logo icon. Everything else drawn in code."""
import math, random, shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "graphify"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
DISP = {16: "/graphify", 17: ""}
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display=DISP)
F.scenes([0, 15, 18, 31, 42, 50, 63, 71, 75])

CSS = r"""
#grep{left:90px;top:250px;width:900px;height:600px}
#grep .body{padding:26px 34px;font-size:29px;line-height:1.5;height:542px;overflow:hidden;position:relative}
#grep .scroll{position:absolute;left:34px;right:34px;top:26px}
#grep .p{color:#ff4b1f}#grep .g{color:#7a7a7a}#grep .f{color:#e9e9e9}
#grep .fade{position:absolute;left:0;right:0;top:0;height:120px;background:linear-gradient(#141414,rgba(20,20,20,0))}
#cnt{position:absolute;left:640px;top:180px;background:#ff4b1f;color:#fff;font-weight:800;font-size:46px;padding:14px 30px;border-radius:22px;transform:rotate(5deg);
 box-shadow:0 30px 50px -16px rgba(255,75,31,.6);font-family:var(--mono)}
#cmdf{left:110px;top:520px;width:860px;height:160px;border-radius:80px;display:flex;align-items:center;padding-left:56px;font-family:var(--mono);font-size:64px;font-weight:700;letter-spacing:-.02em}
#cmdf .p{color:#ff4b1f;margin-right:24px}
#cmdf i{display:inline-block;width:6px;height:70px;background:#111;margin-left:8px}
#glogo{position:absolute;left:440px;top:300px;width:200px;height:200px;border-radius:48px;background:#060a08;padding:26px;box-shadow:0 40px 60px -20px rgba(0,0,0,.4)}
#glogo img{width:100%;height:100%}
#kg svg{position:absolute;left:0;top:0}
.fl{position:absolute;padding:12px 22px;border-radius:16px;background:#fff;font-family:var(--mono);font-weight:600;font-size:28px;
 box-shadow:0 20px 34px -14px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05)}
#nollm{position:absolute;left:600px;top:420px;width:330px;height:150px;border-radius:30px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:64px;letter-spacing:-.03em}
#nollm s{text-decoration:none;position:relative}
#nollm s::after{content:'';position:absolute;left:-10px;right:-10px;top:50%;height:10px;background:#ff4b1f;border-radius:5px;transform:scaleX(var(--k,0));transform-origin:0 50%}
#ast{position:absolute;left:600px;top:620px;padding:22px 34px;border-radius:24px;background:#141414;color:#fff;font-family:var(--mono);font-weight:600;font-size:34px}
#hero{left:60px;top:330px;width:960px;height:620px;overflow:hidden;border-radius:28px;background:#0d0d14}
#hero img{position:absolute;left:0;top:0;width:1255px;height:auto}
#cur{position:absolute;left:560px;top:600px;width:70px;height:70px}
#ring{position:absolute;left:520px;top:560px;width:90px;height:90px;border-radius:50%;border:5px solid #ff4b1f;opacity:0}
#pth svg{position:absolute;left:0;top:0}
.pn{position:absolute;padding:20px 28px;border-radius:24px;background:#fff;font-family:var(--mono);font-weight:700;font-size:34px;letter-spacing:-.02em;
 box-shadow:0 30px 50px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05)}
.pn.on{background:#111;color:#fff}
#pq{position:absolute;left:90px;top:300px;width:900px;height:110px;border-radius:24px;background:#141414;color:#e9e9e9;font-family:var(--mono);font-size:32px;display:flex;align-items:center;padding-left:34px;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.4)}
#pq .p{color:#ff4b1f;margin-right:16px}
#hops{position:absolute;left:0;right:0;top:880px;text-align:center;font-family:var(--mono);font-weight:700;font-size:38px;color:#ff4b1f}
#lic{left:250px;top:390px;width:580px;height:440px;display:flex;flex-direction:column;align-items:center;justify-content:center}
#lic .big{font-size:150px;font-weight:800;letter-spacing:-.06em;line-height:1}
#lic .sm{font-family:var(--mono);font-size:40px;color:#6f6f6f;margin-top:20px}
#stamp{position:absolute;left:640px;top:320px;background:#ff4b1f;color:#fff;font-weight:800;font-size:64px;padding:14px 36px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
"""

# S0 grep spam in a terminal
FILES = ["src/api/routes.py", "src/core/auth.py", "src/db/models.py", "lib/utils/helpers.ts", "app/views/user.tsx", "tests/test_auth.py",
         "src/core/session.py", "docs/architecture.md", "src/api/deps.py", "lib/cache/redis.ts", "app/hooks/useUser.ts", "src/db/migrations/012.sql",
         "src/core/config.py", "src/services/billing.py", "app/pages/index.tsx", "lib/http/client.ts", "src/workers/jobs.py", "README.md"]
rows = []
for k in range(42):
    if k % 7 == 0:
        rows.append(f'<div><span class="p">$</span> grep -rn "{["UserSession", "get_user", "auth", "token", "Router", "config"][k // 7 % 6]}" .</div>')
    else:
        rows.append(f'<div><span class="g">{FILES[k % len(FILES)]}:</span><span class="f">{(k * 37) % 400 + 3}</span></div>')
F.clip(0, f'<div id="grep" class="term"><div class="bar"><i></i><i></i><i></i></div><div class="body"><div class="scroll" id="gs">{"".join(rows)}</div>'
          f'<div class="fade"></div></div></div><div id="cnt">grep ×47</div>'
       + F.block([[(0, 3, "b"), (4, 4, "hl")], [(5, 8, "")], [(9, 14, "")]], top=930, size=68))
# S1 type /graphify
F.clip(1, '<div id="glogo"><img src="assets/logo-icon.svg" alt=""></div>'
          '<div id="cmdf" class="card"><span class="p">›</span><span id="ty"></span><i id="cc"></i></div>'
       + F.block([[(15, 15, "it"), (16, 16, "hl")]], top=1060, size=96))
# S2 knowledge graph drawn in code
random.seed(7)
centers = [(300, 520, "#111"), (760, 470, "#ff4b1f"), (540, 790, "#6f6f6f")]
nodes, edges = [], []
for c, (cx, cy, col) in enumerate(centers):
    hub = len(nodes); nodes.append((cx, cy, 22, col))
    for j in range(11):
        a = j / 11 * 2 * math.pi + random.random() * .4
        r = 110 + random.random() * 90
        nodes.append((cx + r * math.cos(a), cy + r * math.sin(a) * .8, 9 + random.random() * 5, col))
        edges.append((hub, len(nodes) - 1))
edges += [(0, 12), (12, 24), (24, 0), (3, 15), (18, 28), (7, 30)]
svg = ['<svg width="1080" height="1000" fill="none">']
for k, (a, b) in enumerate(edges):
    x1, y1 = nodes[a][:2]; x2, y2 = nodes[b][:2]
    hub_edge = a in (0, 12, 24) and b in (0, 12, 24)
    svg.append(f'<path class="ge{" gh" if hub_edge else ""}" d="M{x1:.0f} {y1:.0f} L{x2:.0f} {y2:.0f}" pathLength="1" stroke="{"#111" if hub_edge else "#9a9a9a"}" '
               f'stroke-width="{5 if hub_edge else 2.5}"/>')
for k, (x, y, r, col) in enumerate(nodes):
    svg.append(f'<circle class="gn" cx="{x:.0f}" cy="{y:.0f}" r="{r:.0f}" fill="{col}" style="transform-origin:{x:.0f}px {y:.0f}px"/>')
svg.append('</svg>')
F.clip(2, '<div id="kg">' + "".join(svg)
          + '<div class="fl" id="fl0" style="left:150px;top:330px">auth.py</div><div class="fl" id="fl1" style="left:700px;top:300px">routes.py</div>'
            '<div class="fl" id="fl2" style="left:640px;top:900px">models.py</div></div>'
       + F.block([[(18, 23, "")], [(24, 25, "hl")], [(26, 30, "")]], top=990, size=70))
# S3 local, no LLM
F.clip(3, tile("lap", "local", 130, 400, 360) + '<div id="nollm" class="card"><s id="nl">No LLM</s></div><div id="ast">tree-sitter AST</div>'
       + F.block([[(31, 34, "b")], [(35, 36, "hl"), (37, 37, "")], [(38, 41, "")]], top=950, size=76))
# S4 real graph.html
F.clip(4, '<div id="hero" class="card"><img src="assets/graph-hero.jpg" alt=""></div>'
          '<svg id="cur" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg><div id="ring"></div>'
       + F.block([[(42, 44, ""), (45, 46, "hl")], [(47, 49, "")]], top=1050, size=82))
# S5 path query, hop by hop (real README output)
PN = [("FastAPI", 90, 520), ("DefaultPlaceholder", 470, 470), ("get_request_handler()", 150, 700), ("ModelField", 700, 790)]
pns = "".join(f'<div id="pn{k}" class="pn{" on" if k == 0 else ""}" style="left:{x}px;top:{y}px">{n}</div>' for k, (n, x, y) in enumerate(PN))
F.clip(5, '<div id="pth"><svg width="1080" height="1000" fill="none" stroke="#ff4b1f" stroke-width="7" stroke-linecap="round">'
          '<path id="h0" d="M300 560 C380 560 420 510 470 510" pathLength="1"/>'
          '<path id="h1" d="M600 552 C600 640 330 620 330 700" pathLength="1"/>'
          '<path id="h2" d="M638 742 C670 742 680 832 700 832" pathLength="1"/></svg>'
          '<div id="pq"><span class="p">$</span>graphify path "FastAPI" "ModelField"</div>' + pns + '<div id="hops">3 hops</div></div>'
       + F.block([[(50, 54, "")], [(55, 59, ""), (60, 62, "hl")]], top=1020, size=68))
# S6 assistants
F.clip(6, chip("c1", "Claude Code", 90, 360, "C", "#d97757") + chip("c2", "Cursor", 620, 400, "◆", "#111")
          + chip("c3", "Codex", 170, 560, "◎", "#3a3a3a") + chip("c4", "Gemini CLI", 540, 610, "✦", "#111")
          + chip("c5", "+ 20 more", 330, 790, "∞", "#ff4b1f")
       + F.block([[(63, 64, ""), (65, 66, "b")], [(67, 68, "b"), (69, 70, "")]], top=1030, size=80))
# S7 free + open source
F.clip(7, '<div id="lic" class="card"><div class="big">Apache</div><div class="big" style="font-size:110px">2.0</div><div class="sm">open source</div></div><div id="stamp">FREE</div>'
       + F.block([[(71, 71, "hl"), (72, 74, "b")]], top=1070, size=90))
# S8 CTA
F.clip(8, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(75, 75, ""), (76, 76, "hl")], [(77, 82, "")]], top=1020, size=82))

S = F.S
for i in (4, 16, 24, 35, 45, 60, 61, 62, 65, 71, 76):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 terminal already there at t=0, grep output races by
ft('#grep',{opacity:1,y:60,rotation:-3,scale:.96},{opacity:1,y:0,rotation:-1.5,scale:1,duration:1.2,ease:A},0);
ft('#gs',{y:0},{y:-1300,duration:ST[1],ease:'power1.in'},0);
ft('#cnt',{opacity:0,scale:2,rotation:-10,filter:'blur(10px)'},{opacity:1,scale:1,rotation:5,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[4]-0.05);
const CN={n:3}; ft(CN,{n:3},{n:47,duration:ST[1]-S[4],ease:'power1.in',onUpdate:()=>{document.getElementById('cnt').textContent='grep ×'+Math.round(CN.n)}},S[4]);
tl.to('#grep',{y:500,rotation:8,opacity:0,filter:'blur(16px)',duration:.3,ease:IN},ST[1]-0.3);
tl.to('#cnt',{x:300,y:-200,opacity:0,filter:'blur(12px)',duration:.25,ease:IN},ST[1]-0.25);
// S1 type /graphify
popIn('#glogo',ST[1]+0.02,{y:-40,s:.4,r:-20});
popIn('#cmdf',ST[1]+0.05,{y:60,s:.92,r:0});
const ty=document.getElementById('ty'), TX='/graphify .', O={n:0};
ft(O,{n:0},{n:TX.length,duration:.045*TX.length,ease:`steps(${TX.length})`,onUpdate:()=>{ty.textContent=TX.slice(0,Math.round(O.n))}},S[16]-0.1);
for(let x=ST[1]+0.3;x<ST[2];x+=0.5){ tl.set('#cc',{opacity:0},x); tl.set('#cc',{opacity:1},x+0.25); }
tl.to('#cmdf',{scale:.4,y:200,opacity:0,filter:'blur(16px)',duration:.3,ease:IN},ST[2]-0.3);
tl.to('#glogo',{scale:3,opacity:0,filter:'blur(20px)',duration:.3,ease:IN},ST[2]-0.3);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 graph grows: nodes pop, edges draw, files fly in
ft('.gn',{scale:0,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(2.5)',stagger:{each:.025,from:'random'}},ST[2]+0.05);
ft('.ge',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.6,ease:'power2.out',stagger:.02},S[22]);
ft('#kg svg',{scale:.9,transformOrigin:'540px 600px'},{scale:1.04,duration:ST[3]-ST[2],ease:'power1.out'},ST[2]);
popIn('#fl0',ST[2]+0.2,{y:-30,s:.6,r:-10}); popIn('#fl1',ST[2]+0.35,{y:-30,s:.6,r:8}); popIn('#fl2',ST[2]+0.5,{y:30,s:.6,r:-6});
tl.to('.gh',{stroke:'#ff4b1f',duration:.3},S[29]);
outUp(['#kg svg','#fl0','#fl1','#fl2'],ST[3]);
// S3 local / no LLM
popIn('#lap',ST[3]+0.02,{y:80,s:.7,r:-8});
popIn('#nollm',S[35]-0.1,{y:40,s:.8,r:6});
ft('#nl',{'--k':0},{'--k':1,duration:.35,ease:'power2.out'},S[36]+0.1);
ft('#ast',{opacity:0,x:80,filter:'blur(10px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.5,ease:A},S[32]);
tl.to('#lap',{rotation:-4,y:-10,duration:1.2,ease:'sine.inOut'},S[38]);
outUp(['#lap','#nollm','#ast'],ST[4]);
starPass('#st2',ST[4]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S4 real screenshot, slow push + click
ft('#hero',{opacity:0,y:160,scale:.86,rotationX:18,transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,duration:.8,ease:A},ST[4]);
ft('#hero img',{scale:1,x:0,y:0,transformOrigin:'40% 40%'},{scale:1.3,x:-60,y:-20,transformOrigin:'40% 40%',duration:ST[5]-ST[4],ease:'none'},ST[4]);
ft('#cur',{opacity:0,x:200,y:220},{opacity:1,x:0,y:0,duration:.7,ease:A},S[44]);
tl.to('#cur',{scale:.8,duration:.08},S[46]); tl.to('#cur',{scale:1,duration:.15},S[46]+0.08);
ft('#ring',{opacity:1,scale:.3},{opacity:0,scale:1.6,duration:.6,ease:'power2.out'},S[46]+0.05);
outUp(['#hero','#cur'],ST[5]);
// S5 path hop by hop
popIn('#pq',ST[5]+0.02,{y:-40,s:.9,r:0});
for(let k=0;k<4;k++) popIn('#pn'+k,ST[5]+0.25+k*0.12,{y:50,s:.7,r:0});
tl.set('#hops',{opacity:0},0);
[S[57],S[59],S[60]+0.1].forEach((t,k)=>{ ft('#h'+k,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.3,ease:'power2.out'},t-0.05);
  tl.to('#pn'+(k+1),{backgroundColor:'#111',color:'#fff',scale:1.06,duration:.2,ease:'back.out(3)'},t+0.2); });
ft('#hops',{opacity:0,y:20},{opacity:1,y:0,duration:.35,ease:A},S[61]+0.1);
outUp(['#pq','#pn0','#pn1','#pn2','#pn3','#hops','#pth svg'],ST[6]);
// S6 chips
popIn('#c1',ST[6]+0.05); popIn('#c2',ST[6]+0.18); popIn('#c3',S[68]-0.1); popIn('#c4',S[68]+0.05);
ft('#c5',{opacity:0,scale:1.6,filter:'blur(16px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.5,ease:A},S[70]-0.08);
outUp(['#c1','#c2','#c3','#c4','#c5'],ST[7]);
// S7 license + stamp
popIn('#lic',ST[7]+0.02,{y:60,s:.85,r:0});
ft('#stamp',{opacity:0,scale:2.4,rotation:-10},{opacity:1,scale:1,rotation:8,duration:.4,ease:'back.out(2)'},S[71]-0.05);
outUp(['#lic','#stamp'],ST[8]);
starPass('#st3',ST[8]-0.3,[900,1500,0],[760,1460,50],8,1.2);
cta('GRAPHIFY',S[76]);
"""
F.write(CSS, JS, music_vol=0.10)
