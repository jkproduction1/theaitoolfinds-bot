"""Impeccable - 6 design commands for your coding agent (pillar: listicle).
Facts: github.com/pbakaus/impeccable README: "The design vocabulary for your coding agent"; "Why: Inter for
everything. Purple-to-blue gradients. Cards nested in cards ... show up again and again, across models"; "Words for
what you want"; commands: bolder "amplifies safe designs", quieter "tones down loud ones", critique "is a scored UX
review" / "scores the design ... and ranks what to fix first", audit "checks accessibility, performance, theming, and
responsive behavior" (P0-P3), polish "is the final pass before shipping", live "pick an element in the browser and
cycle through variants". Works with Claude Code, Cursor, Codex CLI and more; `npx impeccable install`; Apache 2.0.
Media: README before/after images (docs/images/readme-without.webp / readme-with.webp, same model same brief).
Everything else drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "impeccable6"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json")
F.scenes([0, 8, 15, 25, 29, 38, 44, 55, 63, 71, 83, 87])

CSS = r"""
.pg{position:absolute;width:420px;height:560px;border-radius:26px;background:#fff;overflow:hidden;
 box-shadow:0 50px 80px -24px rgba(0,0,0,.30),0 0 0 1px rgba(0,0,0,.05)}
.pg .hero{height:250px;background:linear-gradient(135deg,#8b5cf6,#3b82f6);padding:40px 34px}
.pg .hero .h1{height:26px;width:80%;border-radius:13px;background:rgba(255,255,255,.95)}
.pg .hero .h2{height:16px;width:60%;border-radius:8px;background:rgba(255,255,255,.6);margin-top:18px}
.pg .hero .btn{display:inline-block;margin-top:34px;width:150px;height:52px;border-radius:26px;background:#fff}
.pg .row{display:flex;gap:18px;padding:30px 30px}
.pg .cd{flex:1;height:200px;border-radius:20px;background:#f3f3f7;padding:18px}
.pg .cd i{display:block;width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#8b5cf6,#3b82f6)}
.pg .cd s{display:block;height:12px;border-radius:6px;background:#d9d9e3;margin-top:20px;text-decoration:none}
#same{position:absolute;left:0;right:0;top:920px;text-align:center;font-family:var(--mono);font-weight:700;font-size:40px;color:#ff4b1f}
.tg{position:absolute;display:flex;align-items:center;gap:24px;padding:26px 44px 26px 26px;border-radius:32px;background:#fff;font-weight:700;font-size:56px;letter-spacing:-.03em;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04)}
.tg .sw{width:96px;height:96px;border-radius:24px;display:flex;align-items:center;justify-content:center;font-size:50px;font-weight:600}
.tg .x{position:absolute;left:-14px;right:-14px;top:50%;height:12px;margin-top:-6px;border-radius:6px;background:#ff4b1f;transform:scaleX(0);transform-origin:0 50%}
#ba{left:60px;top:330px;width:960px;height:640px;overflow:hidden;border-radius:28px;background:#111}
#ba img{position:absolute;left:0;top:0;width:960px;height:640px;object-fit:cover}
#ba .wipe{position:absolute;inset:0;clip-path:inset(0 0 0 100%)}
#ba .lab{position:absolute;left:26px;top:26px;padding:10px 22px;border-radius:14px;background:#111;color:#fff;font-weight:700;font-size:30px}
#ba .lab.o{background:#ff4b1f;left:auto;right:26px}
#six{position:absolute;left:0;right:0;top:280px;text-align:center;font-size:540px;font-weight:800;letter-spacing:-.07em;line-height:1}
.num{position:absolute;left:0;right:0;top:230px;text-align:center;font-size:120px;font-weight:800;letter-spacing:-.05em;line-height:1}
.num span{color:#ff4b1f}
.tm{left:140px;top:390px;width:800px;height:170px}
.tm .body{padding:24px 40px;font-size:48px;line-height:1.4}
.tm .p{color:#ff4b1f}
.demo{position:absolute;left:0;top:0;width:1080px;height:1000px}
#btnA{position:absolute;left:290px;top:660px;width:500px;height:150px;border-radius:24px;background:#e9e9e9;color:#9a9a9a;display:flex;align-items:center;justify-content:center;
 font-size:44px;font-weight:500;box-shadow:0 30px 50px -20px rgba(0,0,0,.25)}
#loud{position:absolute;left:240px;top:620px;width:600px;height:240px;border-radius:28px;background:#ff2d55;color:#ffeb3b;display:flex;align-items:center;justify-content:center;
 font-size:76px;font-weight:900;letter-spacing:.02em;box-shadow:0 0 0 10px #ffeb3b,0 40px 60px -20px rgba(0,0,0,.35)}
#score{left:150px;top:600px;width:780px;padding:30px 40px;display:flex;align-items:center;gap:40px}
#score .ring{width:190px;height:190px;border-radius:50%;background:conic-gradient(#ff4b1f var(--p,0%),#ececec 0);display:flex;align-items:center;justify-content:center;flex:none}
#score .ring b{width:150px;height:150px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:62px;font-weight:800;letter-spacing:-.04em}
#score .fx{flex:1}
#score .fx div{display:flex;align-items:center;gap:16px;font-size:34px;font-weight:600;margin:12px 0}
#score .fx div i{font-style:normal;font-family:var(--mono);font-weight:700;color:#fff;background:#111;border-radius:10px;padding:2px 12px;font-size:28px}
#score .fx div:first-child i{background:#ff4b1f}
#rep{left:170px;top:590px;width:740px;padding:24px 36px}
#rep .r{display:flex;align-items:center;justify-content:space-between;font-size:38px;font-weight:700;margin:16px 0;letter-spacing:-.02em}
#rep .r b{font-family:var(--mono);color:#fff;border-radius:12px;padding:4px 16px;font-size:30px}
#ship{position:absolute;left:250px;top:640px;width:580px;height:200px;border-radius:30px;display:flex;align-items:center;gap:30px;padding-left:44px;font-size:54px;font-weight:800;letter-spacing:-.03em}
#ship .bx{width:100px;height:100px;border-radius:24px;border:6px solid #111;display:flex;align-items:center;justify-content:center;font-size:64px;color:#fff}
.spk{position:absolute;width:80px;height:80px}
#brw{left:130px;top:380px;width:820px;height:560px}
#brw .tb2{height:62px;background:#f1f1f0;border-radius:30px 30px 0 0;display:flex;align-items:center;gap:12px;padding-left:28px}
#brw .tb2 i{width:16px;height:16px;border-radius:50%;background:#d0d0d0}
#brw .tb2 u{margin-left:30px;width:440px;height:34px;border-radius:17px;background:#fff;text-decoration:none}
#brw .hd{margin:40px 60px 0;height:30px;width:60%;border-radius:15px;background:#e6e6e6}
#brw .hd2{margin:20px 60px 0;height:18px;width:45%;border-radius:9px;background:#efefef}
#el{position:absolute;left:200px;top:260px;width:420px;height:170px;border-radius:22px}
#el .v{position:absolute;inset:0;border-radius:22px;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:800;letter-spacing:-.03em}
#sel{position:absolute;left:186px;top:246px;width:448px;height:198px;border:5px dashed #ff4b1f;border-radius:30px}
#vtag span{position:absolute;left:0;right:0;text-align:center}#vtag{width:70px;height:62px;position:absolute;left:640px;top:270px;background:#111;color:#fff;font-family:var(--mono);font-weight:700;font-size:34px;padding:12px 22px;border-radius:16px}
#cur{position:absolute;left:560px;top:420px;width:70px;height:70px}
#lic{left:250px;top:390px;width:580px;height:440px;display:flex;flex-direction:column;align-items:center;justify-content:center}
#lic .big{font-size:150px;font-weight:800;letter-spacing:-.06em;line-height:1}
#lic .sm{font-family:var(--mono);font-size:40px;color:#6f6f6f;margin-top:20px}
#stamp{position:absolute;left:640px;top:320px;background:#ff4b1f;color:#fff;font-weight:800;font-size:64px;padding:14px 36px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
"""


def page(pid, x, y, r):
    return (f'<div id="{pid}" class="pg" style="left:{x}px;top:{y}px;transform:rotate({r}deg)"><div class="hero"><div class="h1"></div><div class="h2"></div>'
            f'<div class="btn"></div></div><div class="row"><div class="cd"><i></i><s></s><s style="width:60%"></s></div>'
            f'<div class="cd"><i></i><s></s><s style="width:70%"></s></div></div></div>')


def num(n):
    return f'<div id="n{n}" class="num"><span>#</span>{n}</div>'


def term(tid):
    return (f'<div id="{tid}" class="term tm"><div class="bar"><i></i><i></i><i></i></div>'
            f'<div class="body"><span class="p">›</span> <span id="{tid}c"></span></div></div>')


# S0 three identical AI pages
F.clip(0, page("pg0", 70, 330, -6) + page("pg1", 330, 300, 0) + page("pg2", 590, 330, 6) + '<div id="same">same · same · same</div>'
       + F.block([[(0, 3, "b")], [(4, 5, ""), (6, 7, "hl")]], top=1040, size=84))
# S1 the tells
F.clip(1, '<div class="tg" id="tg0" style="left:110px;top:340px"><div class="sw" style="background:#f1f1f1">Aa</div>Inter<div class="x"></div></div>'
          '<div class="tg" id="tg1" style="left:420px;top:540px"><div class="sw" style="background:linear-gradient(135deg,#8b5cf6,#3b82f6)"></div>Gradients<div class="x"></div></div>'
          '<div class="tg" id="tg2" style="left:150px;top:740px"><div class="sw" style="background:#f3f3f7;padding:14px"><div style="width:100%;height:100%;border-radius:12px;background:#fff;box-shadow:0 0 0 3px #d9d9e3;padding:10px"><div style="width:100%;height:100%;border-radius:6px;background:#d9d9e3"></div></div></div>Cards in cards<div class="x"></div></div>'
       + F.block([[(8, 9, "b"), (10, 11, "")], [(12, 14, "it")]], top=1040, size=88))
# S2 real before / after from the README
F.clip(2, '<div id="ba" class="card"><img src="assets/without.jpg" alt=""><div class="lab">without</div>'
          '<div class="wipe" id="wp"><img src="assets/with.jpg" alt=""><div class="lab o">with Impeccable</div></div></div>'
       + F.block([[(15, 15, "hl"), (16, 19, "")], [(20, 21, "it"), (22, 24, "")]], top=1020, size=78))
# S3 six
F.clip(3, '<div id="six">6</div>' + F.block([[(25, 26, ""), (27, 28, "hl")]], top=1080, size=96))
# S4 bolder
F.clip(4, num(1) + term("t1") + '<div class="demo"><div id="btnA">Get started</div></div>'
       + F.block([[(29, 29, "it"), (30, 30, "mono b")], [(31, 33, ""), (34, 37, "hl")]], top=1020, size=78))
# S5 quieter
F.clip(5, num(2) + term("t2") + '<div class="demo"><div id="loud">SALE!!!</div></div>'
       + F.block([[(38, 38, "it"), (39, 39, "mono b")], [(40, 41, "hl"), (42, 43, "")]], top=1020, size=86))
# S6 critique
F.clip(6, num(3) + term("t3") + '<div id="score" class="card"><div class="ring" id="rg"><b id="sc">0</b></div><div class="fx">'
          '<div id="f0"><i>1</i>Weak hierarchy</div><div id="f1"><i>2</i>Low contrast</div><div id="f2"><i>3</i>Busy footer</div></div></div>'
       + F.block([[(44, 44, "it"), (45, 45, "mono b"), (46, 48, "")], [(49, 50, ""), (51, 54, "hl")]], top=1020, size=72))
# S7 audit
F.clip(7, num(4) + term("t4") + '<div id="rep" class="card"><div class="r" id="a0">Accessibility<b style="background:#ff4b1f">P0</b></div>'
          '<div class="r" id="a1">Speed<b style="background:#111">P1</b></div><div class="r" id="a2">Mobile layout<b style="background:#8a8a8a">P2</b></div></div>'
       + F.block([[(55, 55, "it"), (56, 56, "mono b"), (57, 57, "")], [(58, 58, "b")], [(59, 60, ""), (61, 62, "hl")]], top=1010, size=72))
# S8 polish
spk = '<svg viewBox="0 0 100 100"><path d="M50 4l10 36 36 10-36 10-10 36-10-36L4 50l36-10z" fill="#ff4b1f"/></svg>'
F.clip(8, num(5) + term("t5") + f'<div id="ship" class="card"><div class="bx" id="bx">✓</div>Ready to ship</div>'
          f'<div class="spk" id="sk0" style="left:800px;top:600px">{spk}</div><div class="spk" id="sk1" style="left:200px;top:840px">{spk}</div>'
       + F.block([[(63, 63, "it"), (64, 64, "mono b")], [(65, 67, ""), (68, 70, "hl")]], top=1020, size=80))
# S9 live: pick an element, flip through variants
VAR = [("#111", "#fff", "Book now"), ("#ff4b1f", "#fff", "Book now →"), ("#fff", "#111", "BOOK NOW")]
vs = "".join(f'<div class="v" id="vr{k}" style="background:{bg};color:{fg};{"box-shadow:inset 0 0 0 5px #111;" if bg == "#fff" else ""}">{t}</div>' for k, (bg, fg, t) in enumerate(VAR))
F.clip(9, num(6) + f'<div id="brw" class="card"><div class="tb2"><i></i><i></i><i></i><u></u></div><div class="hd"></div><div class="hd2"></div>'
          f'<div id="el">{vs}</div><div id="sel"></div><div id="vtag"><span id="vt0">A</span><span id="vt1">B</span><span id="vt2">C</span></div>'
          '<svg id="cur" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg></div>'
       + F.block([[(71, 71, "it"), (72, 72, "mono b"), (73, 75, "")], [(76, 78, ""), (79, 79, "")], [(80, 82, "hl")]], top=1000, size=72))
# S10 free + open source
F.clip(10, '<div id="lic" class="card"><div class="big">Apache</div><div class="big" style="font-size:110px">2.0</div><div class="sm">open source</div></div><div id="stamp">FREE</div>'
       + F.block([[(83, 83, "hl"), (84, 86, "b")]], top=1070, size=90))
# S11 CTA
F.clip(11, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(87, 87, ""), (88, 88, "hl")], [(89, 94, "")]], top=1020, size=80))

S = F.S
for i in (8, 10, 12, 15, 27, 30, 39, 45, 51, 56, 64, 72, 80, 83, 88):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t){ const el=document.getElementById(id), O={n:0};
  ft(O,{n:0},{n:txt.length,duration:.035*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
function numIn(n,t){ ft('#n'+n,{opacity:0,y:-40,scale:1.4,filter:'blur(18px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.45,ease:A},t); }
// S0 pages visible at t=0, fanned clones settle
ft('#pg1',{opacity:1,y:40,scale:.94},{opacity:1,y:0,scale:1,duration:1,ease:A},0);
ft('#pg0',{opacity:1,x:260,rotation:0},{opacity:1,x:0,rotation:-6,duration:1,ease:A},0.05);
ft('#pg2',{opacity:1,x:-260,rotation:0},{opacity:1,x:0,rotation:6,duration:1,ease:A},0.05);
ft('#same',{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:A},S[6]-0.1);
tl.to(['#pg0','#pg1','#pg2'],{y:-40,duration:ST[1]-1,ease:'sine.inOut'},1);
tl.to(['#pg0','#pg1','#pg2','#same'],{y:500,opacity:0,filter:'blur(16px)',duration:.3,ease:IN,stagger:.03},ST[1]-0.32);
// S1 tells pop and get struck out
[[0,8],[1,10],[2,12]].forEach(([k,w])=>{ popIn('#tg'+k,S[w]-0.15,{y:60,s:.6,r:k==1?6:-6});
  ft('#tg'+k+' .x',{scaleX:0},{scaleX:1,duration:.3,ease:'power2.out'},S[w]+0.35); });
outUp(['#tg0','#tg1','#tg2'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 before -> after wipe
ft('#ba',{opacity:0,y:160,scale:.88,rotationX:18,transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,duration:.8,ease:A},ST[2]);
ft('#wp',{clipPath:'inset(0 0 0 100%)'},{clipPath:'inset(0 0 0 0%)',duration:.8,ease:'power3.inOut'},S[21]-0.2);
ft('#wp img',{scale:1.15},{scale:1,duration:1.4,ease:A},S[21]-0.2);
outUp('#ba',ST[3]);
// S3 big 6
ft('#six',{opacity:0,scale:2.2,filter:'blur(30px)',rotation:-8},{opacity:1,scale:1,filter:'blur(0px)',rotation:0,duration:.6,ease:A},S[27]-0.12);
tl.to('#six',{opacity:0,y:-120,filter:'blur(16px)',duration:.25,ease:IN},ST[4]-0.25);
// numbered terminals
const items=[[4,1,30,'/impeccable bolder'],[5,2,39,'/impeccable quieter'],[6,3,45,'/impeccable critique'],[7,4,56,'/impeccable audit'],[8,5,64,'/impeccable polish']];
items.forEach(([sc,n,w,cmd])=>{ numIn(n,ST[sc]+0.02); popIn('#t'+n,ST[sc]+0.08,{y:60,s:.94,r:0}); typeIn('t'+n+'c',cmd,S[w]-0.35);
  tl.to(['#n'+n,'#t'+n],{opacity:0,y:-40,filter:'blur(12px)',duration:.22,ease:IN},ST[sc+1]-0.22); });
// 1 bolder: timid button becomes bold
popIn('#btnA',ST[4]+0.3,{y:60,s:.8,r:0});
tl.to('#btnA',{backgroundColor:'#111',color:'#fff',scale:1.18,fontWeight:800,fontSize:'60px',boxShadow:'0 50px 70px -20px rgba(0,0,0,.5)',duration:.5,ease:'back.out(2.5)'},S[34]);
outUp('#btnA',ST[5]);
// 2 quieter: loud card calms down
popIn('#loud',ST[5]+0.2,{y:60,s:.6,r:-8});
tl.to('#loud',{rotation:3,duration:.08,yoyo:true,repeat:5},ST[5]+0.6);
tl.to('#loud',{backgroundColor:'#fff',color:'#111',fontSize:'58px',fontWeight:600,letterSpacing:'-.02em',boxShadow:'0 0 0 0px #ffeb3b,0 40px 60px -20px rgba(0,0,0,.25)',rotation:0,duration:.6,ease:'power2.inOut'},S[40]);
outUp('#loud',ST[6]);
starPass('#st2',ST[6]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// 3 critique: score ring fills, fixes ranked
popIn('#score',S[46]-0.1,{y:80,s:.85,r:-3});
const SC={p:0}; ft(SC,{p:0},{p:72,duration:.9,ease:'power2.out',onUpdate:()=>{document.getElementById('rg').style.setProperty('--p',SC.p+'%');document.getElementById('sc').textContent=(SC.p/10).toFixed(1)}},S[46]);
[0,1,2].forEach(k=>ft('#f'+k,{opacity:0,x:60},{opacity:1,x:0,duration:.35,ease:A},S[50]+k*.12));
outUp('#score',ST[7]);
// 4 audit rows on their words
[[0,58],[1,59],[2,61]].forEach(([k,w])=>ft('#a'+k,{opacity:0,x:-60,filter:'blur(8px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.4,ease:A},S[w]-0.12));
popIn('#rep',S[57]-0.2,{y:60,s:.92,r:0});
outUp('#rep',ST[8]);
// 5 polish: checkbox ticks, sparkles
popIn('#ship',S[65]-0.1,{y:60,s:.85,r:2});
tl.to('#bx',{backgroundColor:'#ff4b1f',borderColor:'#ff4b1f',duration:.25,ease:'back.out(3)'},S[69]);
ft(['#sk0','#sk1'],{opacity:0,scale:0,rotation:-90},{opacity:1,scale:1,rotation:0,duration:.5,ease:'back.out(3)',stagger:.1},S[69]);
outUp(['#ship','#sk0','#sk1'],ST[9]);
starPass('#st3',ST[9]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// 6 live: browser, select element, cycle variants
ft('#brw',{opacity:0,y:160,scale:.88,rotationX:18,transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,duration:.7,ease:A},ST[9]);
tl.set(['#vr1','#vr2','#vt1','#vt2'],{opacity:0},0);
ft('#cur',{opacity:0,x:200,y:220},{opacity:1,x:0,y:0,duration:.6,ease:A},S[73]-0.1);
ft('#sel',{opacity:0,scale:1.15},{opacity:1,scale:1,duration:.35,ease:'back.out(2)'},S[75]);
ft('#vtag',{opacity:0,y:20},{opacity:1,y:0,duration:.3,ease:A},S[75]+0.1);
[[1,80],[2,81]].forEach(([k,w])=>{ ft('#vr'+k,{opacity:0,scale:.85,filter:'blur(8px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.3,ease:'back.out(2)'},S[w]);
  tl.set('#vt'+(k-1),{opacity:0},S[w]); tl.set('#vt'+k,{opacity:1},S[w]); tl.to('#cur',{scale:.8,duration:.06,yoyo:true,repeat:1},S[w]-0.05); });
outUp(['#brw','#n6'],ST[10]);
numIn(6,ST[9]+0.02);
// 7 license
popIn('#lic',ST[10]+0.02,{y:60,s:.85,r:0});
ft('#stamp',{opacity:0,scale:2.4,rotation:-10},{opacity:1,scale:1,rotation:8,duration:.4,ease:'back.out(2)'},S[83]-0.05);
outUp(['#lic','#stamp'],ST[11]);
cta('IMPECCABLE',S[88]);
"""
F.write(CSS, JS, music_vol=0.10)
