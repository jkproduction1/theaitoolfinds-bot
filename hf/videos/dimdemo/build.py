"""dimdemo - App demo 1/3 (BRAIN §3b) for the dimensional-drawing skills by Enes Ozturk (MIT).
Real results only: skills/dimensional-drawing/examples card + dialog sheets (assets/card-sheet.png, dialog-sheet.png) and
the dimensional-drawing-motion film of the dialog sheet (assets/dialog-motion.mp4), all from the repo README.
Commands: the two skills are named dimensional-drawing and dimensional-drawing-motion (skills/*/SKILL.md); prompts follow
the README ("Make a dimensional drawing of the Card component", motion skill "animates a finished sheet").
Chat UI, keyboard and icons are our own generic design drawn in code (no Anthropic logo)."""
import json, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film

W = HERE.parent.parent / "work" / "dimdemo"
A = W / "assets"
for f in (HERE / "media").iterdir():
    shutil.copy(f, A / f.name)

# --- give each result a beat: insert silence after "this." of demo 1, 2, 3
GAPS = {10: 1.4, 20: 1.4, 30: 1.6}
if not (A / "voice_raw.mp3").exists():
    shutil.copy(A / "voice.mp3", A / "voice_raw.mp3"); shutil.copy(A / "voice.json", A / "voice_raw.json")
vw = json.loads((A / "voice_raw.json").read_text())
cuts = [round(vw[i]["end"] + 0.08, 3) for i in sorted(GAPS)]
parts, prev, filt = [], 0.0, []
for k, (i, c) in enumerate(zip(sorted(GAPS), cuts)):
    filt.append(f"[0:a]atrim={prev}:{c},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[a{k}];anullsrc=r=44100:cl=mono,atrim=duration={GAPS[i]}[z{k}]")
    parts += [f"[a{k}]", f"[z{k}]"]; prev = c
filt.append(f"[0:a]atrim=start={prev},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[al]"); parts.append("[al]")
fc = ";".join(filt) + ";" + "".join(f"{p}" for p in parts) + f"concat=n={len(parts)}:v=0:a=1[out]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(A / "voice_raw.mp3"), "-filter_complex",
                fc,
                "-map", "[out]", "-ar", "44100", str(A / "voice.mp3")], check=True)
shift = 0.0
for j, w in enumerate(vw):
    w2 = dict(w); w2["start"] = w["start"] + shift; w2["end"] = w["end"] + shift
    vw[j] = w2
    if j in GAPS: shift += GAPS[j]
(A / "voice.json").write_text(json.dumps(vw))

F = Film(W, (HERE / "script.txt").read_text(), A / "voice.json", tail=1.2)
F.scenes([0, 31])
S, E = F.S, F.E

DEMOS = [  # (Type idx, cmd idx, prompt tokens, 'and' idx, 'this' idx, cmd, prompt, title, result)
    (0, 2, (3, 6), 7, 10, "dimensional-drawing", "draw our card component", "card component drawing", "r1"),
    (11, 13, (14, 16), 17, 20, "dimensional-drawing", "draw our dialog", "dialog drawing", "r2"),
    (21, 23, (24, 26), 27, 30, "dimensional-drawing-motion", "make it move", "dialog drawing, animated", "r3"),
]
DESC = {"dimensional-drawing": "One-page technical drawing of a UI component",
        "dimensional-drawing-motion": "Turns a finished sheet into a short film"}

CSS = r"""
:root{--paper:#121212}
html,body,#root{background:#121212!important}
#grid,#stars{display:none}
#vig{background:radial-gradient(120% 80% at 50% 40%,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)}
#grain{opacity:.05;mix-blend-mode:screen}
#handle{top:1640px;font-size:28px;padding:10px 28px;opacity:0}
.ui{font-family:var(--sans);color:#ececec}
#sb{position:absolute;left:70px;right:70px;top:34px;display:flex;justify-content:space-between;font-weight:700;font-size:34px}
#sb i{display:inline-block;width:46px;height:22px;border:3px solid #ececec;border-radius:7px;margin-left:14px;position:relative;top:3px}
#sb i::after{content:'';position:absolute;left:3px;top:3px;bottom:3px;width:30px;background:#ececec;border-radius:3px}
#tabs{position:absolute;left:50%;top:110px;transform:translateX(-50%);display:flex;background:#232323;border-radius:999px;padding:6px;font-weight:600;font-size:30px}
#tabs span{padding:10px 30px;border-radius:999px;color:#8d8d8d}#tabs span.on{background:#3a3a3a;color:#fff}
#menu{position:absolute;left:70px;top:112px;width:64px;height:64px;border-radius:50%;background:#232323}
#menu::after{content:'';position:absolute;left:20px;top:24px;width:24px;height:16px;border-top:3px solid #ccc;border-bottom:3px solid #ccc}
#ctr{position:absolute;right:70px;top:112px;height:64px;min-width:64px;border-radius:32px;background:#232323;display:flex;align-items:center;justify-content:center;
 font-weight:700;font-size:28px;padding:0 18px;overflow:hidden}
#ctr b{position:absolute;transition:none}
#inp{position:absolute;left:70px;right:70px;top:1150px;min-height:170px;background:#1f1f1f;border-radius:34px;border:2px solid #2c2c2c;padding:26px 30px 70px;font-size:40px;line-height:1.3}
#inp .ph{color:#6b6b6b}
#inp .cmd{color:#ff6a3d;font-weight:600}
#inp .car{display:inline-block;width:4px;height:44px;background:#ff6a3d;vertical-align:-8px;margin-left:3px}
#inp .plus{position:absolute;left:30px;bottom:18px;font-size:40px;color:#8d8d8d}
#inp .snd{position:absolute;right:20px;bottom:16px;width:62px;height:62px;border-radius:50%;background:#3a3a3a}
#inp .snd::after{content:'';position:absolute;left:21px;top:16px;border-bottom:20px solid #fff;border-left:10px solid transparent;border-right:10px solid transparent}
#inp .snd::before{content:'';position:absolute;left:29px;top:30px;width:4px;height:18px;background:#fff}
#chipc{position:absolute;left:70px;right:70px;top:1010px;height:118px;background:#2a1d18;border-radius:26px;border:2px solid #4a2c22;display:flex;align-items:center;gap:22px;padding:0 28px}
#chipc svg{width:52px;height:52px;flex:none}
#chipc .n{font-weight:700;font-size:36px;color:#ff6a3d}#chipc .d{font-size:26px;color:#a98f86;margin-top:2px}
#kb{position:absolute;left:0;right:0;top:1370px;height:550px;background:#1b1b1b;padding-top:24px}
.kr{position:absolute;left:0;right:0;height:96px}
.k{position:absolute;height:96px;border-radius:14px;background:#3b3b3b;color:#f2f2f2;font-size:42px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 0 #0b0b0b}
.k.f{background:#2a2a2a;font-size:30px}
#pop{position:absolute;width:118px;height:170px;border-radius:22px;background:#5a5a5a;color:#fff;font-size:68px;display:flex;align-items:flex-start;justify-content:center;padding-top:16px;opacity:0;
 box-shadow:0 20px 40px rgba(0,0,0,.6)}
#sug{position:absolute;left:0;right:0;top:1372px;text-align:center;color:#bdbdbd;font-size:32px}
.ub{position:absolute;right:70px;top:200px;max-width:760px;background:#2a2a2a;border-radius:30px 30px 8px 30px;padding:20px 28px;font-size:34px;line-height:1.3;opacity:0}
.ub .cmd{color:#ff6a3d}
.run{position:absolute;left:70px;top:345px;font-size:32px;color:#9a9a9a;display:flex;align-items:center;gap:14px;opacity:0}
.run svg{width:40px;height:40px}
.res{position:absolute;left:120px;top:430px;width:840px;height:1060px;border-radius:40px;overflow:hidden;background:#0d0d0d;opacity:0;
 box-shadow:0 60px 120px -20px rgba(0,0,0,.8),0 0 0 2px #262626}
.res .pic{position:absolute;left:0;top:0;width:840px;height:820px;overflow:hidden;background:#ececea}
.res .pic img,.res .pic video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.res .ttl{position:absolute;left:0;right:0;top:850px;text-align:center;font-weight:700;font-size:44px;color:#fff}
.res .by{position:absolute;left:0;right:0;top:912px;text-align:center;font-family:var(--serif);font-style:italic;font-size:44px;color:#bdbdbd}
#bot{position:absolute;left:70px;right:70px;top:1700px;height:100px;background:#1f1f1f;border-radius:30px;border:2px solid #2c2c2c;color:#6b6b6b;font-size:34px;
 display:flex;align-items:center;padding-left:30px;opacity:0}
#end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;font-family:var(--sans)}
#end svg{position:absolute;top:330px;width:110px;height:110px}
#end .c{position:absolute;top:470px;font-weight:800;font-size:84px;color:#fff}
#end .kw{position:absolute;top:570px;font-weight:900;font-size:150px;color:#ff4b1f;letter-spacing:-.04em}
#end .g{position:absolute;top:760px;font-weight:800;font-size:72px;color:#fff}
.th{position:absolute;top:960px;width:280px;height:420px;border-radius:26px;overflow:hidden;background:#ececea;box-shadow:0 40px 70px -20px rgba(0,0,0,.8),0 0 0 2px #2a2a2a}
.th img{width:100%;height:100%;object-fit:cover}
"""

SPARK = '<svg viewBox="0 0 100 100"><path fill="#ff6a3d" d="M50 6l9 33 33 11-33 11-9 33-9-33L8 50l33-11z"/></svg>'

# keyboard geometry
ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"]
KW, KG, KY0 = 94, 10, 1440
KEYPOS = {}
kb = ['<div id="kb"></div>']
keys = []
for r, row in enumerate(ROWS):
    tot = len(row) * KW + (len(row) - 1) * KG
    x0 = (1080 - tot) // 2
    y = KY0 + r * 116
    for c, ch in enumerate(row):
        x = x0 + c * (KW + KG)
        KEYPOS[ch] = (x, y)
        keys.append(f'<div class="k" style="left:{x}px;top:{y}px;width:{KW}px">{ch}</div>')
y3 = KY0 + 3 * 116
keys.append(f'<div class="k f" style="left:30px;top:{KY0 + 2 * 116}px;width:120px">⇧</div>')
keys.append(f'<div class="k f" style="left:930px;top:{KY0 + 2 * 116}px;width:120px">⌫</div>')
keys.append(f'<div class="k f" style="left:30px;top:{y3}px;width:150px">123</div>')
keys.append(f'<div class="k" style="left:200px;top:{y3}px;width:620px;font-size:32px">space</div>')
keys.append(f'<div class="k f" style="left:840px;top:{y3}px;width:210px">return</div>')
KEYPOS[" "] = (460, y3)

app = ['<div class="ui">',
       '<div id="sb"><span>9:41</span><span>●●● <i></i></span></div>',
       '<div id="menu"></div><div id="tabs"><span>Chat</span><span class="on">Code</span></div>',
       '<div id="ctr"><b id="cn">0/3</b></div>']
for k, d in enumerate(DEMOS):
    a, ci, (p0, p1), andi, thi, cmd, prompt, title, res = d
    app.append(f'<div class="ub" id="ub{k}"><span class="cmd">/{cmd}</span> {prompt}</div>')
    app.append(f'<div class="run" id="run{k}">{SPARK}<span>Running /{cmd}…</span></div>')
    if res == "r3":
        pic = (f'<video id="rv" class="clip" src="assets/r3.mp4" data-start="{round(S[thi] - 0.6, 2)}" '
               f'data-duration="{round(S[31] - S[thi] + 0.6, 2)}" data-track-index="30" muted playsinline></video>')
    else:
        pic = f'<img id="ri{k}" src="assets/{res}.jpg" alt="">'
    app.append(f'<div class="res" id="res{k}"><div class="pic">{pic}</div><div class="ttl">{title}</div>'
               f'<div class="by">with Dimensional Drawing</div></div>')
app.append('<div id="chipc">' + SPARK + '<div><div class="n" id="chn"></div><div class="d" id="chd"></div></div></div>')
app.append('<div id="inp"><span id="it"></span><span class="car" id="car"></span><span class="plus">+</span><div class="snd" id="snd"></div></div>')
app.append('<div id="kbw">' + "".join(kb) + '<div id="sug"></div>' + "".join(keys) + '<div id="pop"></div></div>')
app.append('<div id="bot">Reply…</div>')
app.append('</div>')
F.clip(0, "".join(app))

F.clip(1, '<div id="end">' + SPARK + '<div class="c" id="e1">Comment</div><div class="kw" id="e2">“DRAWING”</div>'
          '<div class="g" id="e3">to get the link</div>'
          '<div class="th" id="th0" style="left:100px"><img src="assets/r1.jpg" alt=""></div>'
          '<div class="th" id="th1" style="left:400px"><img src="assets/r2.jpg" alt=""></div>'
          '<div class="th" id="th2" style="left:700px"><img src="assets/r3.jpg" alt=""></div></div>')

# typing events: (time, html-state) and key pops
typing = []
for k, d in enumerate(DEMOS):
    a, ci, (p0, p1), andi, thi, cmd, prompt, title, res = d
    t_slash = S[a + 1]
    t_cmd0, t_cmd1 = S[ci] - 0.05, S[ci] + 0.35
    t_p0, t_p1 = S[p0], E[p1] - 0.05
    typing.append({"k": k, "slash": t_slash, "cmd": [t_cmd0, t_cmd1], "p": [t_p0, t_p1], "send": S[andi] - 0.15,
                   "res": max(S[thi] - 0.6, S[andi] + 0.35), "end": (S[DEMOS[k + 1][0]] - 0.25) if k < 2 else F.ST[1],
                   "cmdtxt": cmd, "ptxt": prompt, "desc": DESC[cmd], "pop": (S[thi] - 0.6)})
F.pop(0)
for d in typing:
    F.pop(d["send"]); F.pop(d["res"] + 0.1)

JS = r"""
const TY=__TY__, KP=__KP__;
const it=document.getElementById('it'), chn=document.getElementById('chn'), chd=document.getElementById('chd'), sug=document.getElementById('sug');
function render(html){ return ()=>{ it.innerHTML=html; }; }
// build a sampled typing track: at each step set the input html (seek-safe via tl.call with both directions handled by re-evaluating)
const STEPS=[];  // [time, html, sug]
STEPS.push([0,'<span class="ph">Reply…</span>','']);
TY.forEach(d=>{
  STEPS.push([d.slash,'<span class="cmd">/</span>','"/"']);
  const n=d.cmdtxt.length;
  for(let i=1;i<=n;i++) STEPS.push([d.cmd[0]+(d.cmd[1]-d.cmd[0])*i/n,'<span class="cmd">/'+d.cmdtxt.slice(0,i)+'</span>','']);
  const m=d.ptxt.length;
  for(let i=1;i<=m;i++){ const w=d.ptxt.slice(0,i).split(' ').pop(); STEPS.push([d.p[0]+(d.p[1]-d.p[0])*i/m,'<span class="cmd">/'+d.cmdtxt+'</span> '+d.ptxt.slice(0,i),w?'"'+w+'"':'']); }
  STEPS.push([d.send,'<span class="ph">Reply…</span>','']);
});
STEPS.sort((a,b)=>a[0]-b[0]);
const KEV=[]; TY.forEach(d=>{ const m=d.ptxt.length; for(let i=0;i<m;i++){ const ch=d.ptxt[i]; const p=KP[ch]; if(p) KEV.push([d.p[0]+(d.p[1]-d.p[0])*(i+1)/m-0.04,ch,p]); } });
const pop=document.getElementById('pop'), cn=document.getElementById('cn');
let last=-1, lastC='', lastN='', lastP='';
function apply(t){ let j=0; for(let i=0;i<STEPS.length;i++){ if(STEPS[i][0]<=t) j=i; else break; }
  if(j!==last){ last=j; it.innerHTML=STEPS[j][1]; sug.textContent=STEPS[j][2]; }
  let c=0, nm='', ds=''; TY.forEach((d,k)=>{ if(k==0||d.slash-0.01<=t) c++; if(d.slash-0.01<=t){ nm='/'+d.cmdtxt; ds=d.desc; } });
  const cs=c+'/3'; if(cs!==lastC){ lastC=cs; cn.textContent=cs; } if(nm!==lastN){ lastN=nm; chn.textContent=nm; chd.textContent=ds; }
  let pk=''; KEV.forEach(e=>{ if(t>=e[0]&&t<e[0]+0.08) pk=e[1]+'|'+e[2][0]+'|'+e[2][1]; });
  if(pk!==lastP){ lastP=pk; if(pk){ const q=pk.split('|'); pop.textContent=q[0]===' '?'':q[0]; pop.style.left=(+q[1]-12)+'px'; pop.style.top=(+q[2]-120)+'px'; pop.style.opacity=1; } else pop.style.opacity=0; } }
const clock={t:0}; tl.fromTo(clock,{t:0},{t:DUR,duration:DUR,ease:'none',onUpdate:()=>apply(clock.t)},0);
apply(0);
// per demo
TY.forEach((d,k)=>{
  const t0=k?TY[k-1].end+0.05:0;
  // keyboard + input up (from result view)
  if(k){ tl.fromTo('#kbw',{y:560},{y:0,duration:.45,ease:A,immediateRender:false},t0); tl.fromTo('#inp',{y:560,opacity:0},{y:0,opacity:1,duration:.45,ease:A,immediateRender:false},t0); tl.to('#bot',{opacity:0,duration:.2},t0); }
  // slash chip
  tl.fromTo('#chipc',{opacity:0,y:40,scale:.95},{opacity:1,y:0,scale:1,duration:.35,ease:'back.out(1.6)',immediateRender:k==0},d.slash);
  tl.to('#chipc',{opacity:0,y:20,duration:.2,ease:IN},d.send-0.05);
  tl.fromTo('#snd',{backgroundColor:'#3a3a3a'},{backgroundColor:'#ff4b1f',duration:.15,immediateRender:false},d.p[0]);
  tl.to('#snd',{backgroundColor:'#3a3a3a',scale:.85,duration:.12,yoyo:true,repeat:1},d.send);
  // send: keyboard down, bubble + running line
  tl.to('#kbw',{y:560,duration:.4,ease:IN},d.send+0.05); tl.to('#inp',{y:560,opacity:0,duration:.35,ease:IN},d.send+0.05);
  tl.fromTo('#bot',{opacity:0},{opacity:1,duration:.25,immediateRender:false},d.send+0.3);
  ft('#ub'+k,{opacity:0,y:60,scale:.9},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(1.6)'},d.send+0.05);
  ft('#run'+k,{opacity:0,x:-30},{opacity:1,x:0,duration:.3,ease:A},d.send+0.15);
  tl.to('#run'+k+' svg',{rotation:180,duration:.8,ease:'none',repeat:3},d.send+0.3);
  // result card
  ft('#res'+k,{opacity:0,y:240,scale:.86,rotationX:22,transformPerspective:1600},{opacity:1,y:0,scale:1,rotationX:0,duration:.8,ease:A},d.res);
  tl.to('#run'+k,{opacity:0,duration:.25},d.res+0.5);
  if(k<2){ ft('#ri'+k,{scale:1.0,xPercent:0},{scale:k?1.9:1.6,xPercent:k?-12:6,yPercent:k?8:-6,duration:d.end-d.res,ease:'power1.inOut'},d.res+0.2); }
  if(k) ft('#ctr',{scale:1},{scale:1.25,duration:.15,yoyo:true,repeat:1,ease:'power2.out'},d.slash);
  if(k<2) tl.to(['#res'+k,'#ub'+k],{y:-120,opacity:0,scale:.92,duration:.3,ease:IN},d.end-0.3);
  else tl.to(['#ub'+k],{opacity:0,duration:.2},d.end-0.2);
});
// end card
ft('#end svg',{opacity:0,scale:0,rotation:-90},{opacity:1,scale:1,rotation:0,duration:.6,ease:'back.out(2)'},ST[1]+0.02);
ft('#e1',{opacity:0,y:40},{opacity:1,y:0,duration:.4,ease:A},ST[1]+0.08);
ft('#e2',{opacity:0,scale:1.6},{opacity:1,scale:1,duration:.5,ease:'back.out(1.8)'},S[32]-0.1);
ft('#e3',{opacity:0,y:40},{opacity:1,y:0,duration:.4,ease:A},S[33]-0.05);
[0,1,2].forEach(k=>ft('#th'+k,{opacity:0,y:300,rotation:(k-1)*10},{opacity:1,y:0,rotation:(k-1)*4,duration:.7,ease:'back.out(1.4)'},ST[1]+0.3+k*0.12));
ft('#handle',{opacity:0},{opacity:1,duration:.3},ST[1]+0.4);
"""
JS = JS.replace("__TY__", json.dumps(typing)).replace("__KP__", json.dumps(KEYPOS))
F.write(CSS, JS, music_vol=0.08)
