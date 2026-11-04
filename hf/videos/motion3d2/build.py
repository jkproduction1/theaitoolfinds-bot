"""motion3d - App demo 1/3 (BRAIN §3b), Jan's live direction 2026-11-04: fast typing -> a cinematic 3D result, like the reference
(hf/reference/app_demo_ref.jpg). One command "/motion3d" + a prompt. Results are real-time three.js scenes built here in code
(no AI images, no stock): 1) exploded game controller (generic, no brand), 2) plane Prague -> Tokyo above the clouds on a globe
(land shapes: Natural Earth via world-atlas, public domain), 3) launch film for invented "AURA" earbuds (no real brand).
No voice (like the reference): typing ticks, clicks, whooshes and music. Jan: no view counters / no render bar.
Prompts for DM: prompts.md."""
import json, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film

W = HERE.parent.parent / "work" / "motion3d2"
A = W / "assets"
for f in (HERE / "media").iterdir():
    shutil.copy(f, A / f.name)
from PIL import Image
for k in range(3):
    if not (A / f"th{k}.jpg").exists():
        Image.new("RGB", (280, 430), (34, 34, 34)).save(A / f"th{k}.jpg")

# --- timing (no voice): 3 demos, fast typing, then the end card
DEMO_LEN, N = 4.7, 3
END = round(DEMO_LEN * N, 2)
DUR_END = 2.6
toks = ["·"] * 4
vw = [{"word": "·", "start": 0.0, "end": 0.1}, {"word": "·", "start": 1.0, "end": 1.1},
      {"word": "·", "start": END, "end": END + 0.1}, {"word": "·", "start": END + DUR_END - 0.2, "end": END + DUR_END - 0.1}]
(A / "voice.json").write_text(json.dumps(vw))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(END + DUR_END), str(A / "voice.mp3")], check=True)
F = Film(W, " ".join(toks), A / "voice.json", tail=0.1)
F.scenes([0])
S = F.S

DEMOS = [  # command, prompt, title, caption, highlighted word index, chip description
    ("explain-3d", "how a camera lens focuses", "camera lens explainer", "One lens moves, the photo sharpens.", 5, "Cinematic 3D explainer of anything"),
    ("motion3d", "how a laptop fan keeps the chip cool", "laptop cooling explainer", "The fan pulls the heat out.", 4, "Cinematic 3D animation from one line"),
    ("hero-3d", "landing page for my AI startup", "AI startup landing page", "A homepage from one prompt.", 1, "3D hero section for your website"),
]
CMD = "motion3d"
TY = []
for k, (cmd, prompt, title, cap, hi, desc) in enumerate(DEMOS):
    T = round(k * DEMO_LEN, 3)
    t_slash = T + (0.0 if k == 0 else 0.1)
    c0, c1 = T + 0.14, T + 0.42
    p0, p1 = T + 0.46, T + 0.46 + 0.022 * len(prompt)
    send = round(p1 + 0.12, 3)
    TY.append({"T": T, "slash": t_slash, "c0": c0, "c1": c1, "p0": p0, "p1": p1, "send": send, "card": send + 0.1,
               "full": send + 0.38, "end": round(T + DEMO_LEN, 3), "prompt": prompt, "cap": cap.split(), "hi": hi, "cmd": cmd, "desc": desc})
    F.sfx.append((T, "whoosh")); F.sfx.append((send, "click")); F.sfx.append((send + 0.1, "pop")); F.sfx.append((send + 0.38, "whoosh"))
    for i in range(len(cmd)):
        F.sfx.append((c0 + (c1 - c0) * i / len(cmd), "tick"))
    for i in range(0, len(prompt), 2):
        if prompt[i] != " ":
            F.sfx.append((p0 + (p1 - p0) * i / len(prompt), "tick"))
F.sfx.append((END, "whoosh")); F.sfx.append((END + 0.25, "pop"))

HERO = ('<div id="bw2"><div id="hb2"><i></i><i></i><i></i><span>localhost:3000</span></div><div id="hpage2">'
        '<div id="hn2"><b>✦ nova</b><span>Product</span><span>Pricing</span><span>Docs</span><em>Sign in</em></div>'
        '<canvas id="hc2" width="900" height="760"></canvas>'
        '<div id="hh2"></div><div id="hs2">Your AI teammate for research, writing and code.</div><div id="hcta2">Start free →</div>'
        '<div id="hf2_0" class="hf"><b>⚡</b>Instant answers</div><div id="hf2_1" class="hf"><b>◎</b>Knows your docs</div><div id="hf2_2" class="hf"><b>⌘</b>Works in your apps</div>'
        '</div><div id="hcur2"><svg viewBox="0 0 40 40"><path d="M6 4l26 14-12 3-5 12z" fill="#fff" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/></svg></div></div>')
LOCK = '<div id="lk0" class="lock"><span class="ic"></span>Unlocked</div>'
SPARK = '<svg viewBox="0 0 100 100"><path fill="#ff6a3d" d="M50 6l9 33 33 11-33 11-9 33-9-33L8 50l33-11z"/></svg>'
ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"]
KW, KG, KY0 = 94, 10, 1440
KEYPOS, keys_html = {}, []
for r, row in enumerate(ROWS):
    x0 = (1080 - (len(row) * KW + (len(row) - 1) * KG)) // 2
    for c, ch in enumerate(row):
        x, y = x0 + c * (KW + KG), KY0 + r * 116
        KEYPOS[ch] = (x, y); keys_html.append(f'<div class="k" style="left:{x}px;top:{y}px;width:{KW}px">{ch}</div>')
y3 = KY0 + 3 * 116
keys_html += [f'<div class="k f" style="left:30px;top:{KY0 + 232}px;width:120px">⇧</div>',
              f'<div class="k f" style="left:930px;top:{KY0 + 232}px;width:120px">⌫</div>',
              f'<div class="k f" style="left:30px;top:{y3}px;width:150px">123</div>',
              f'<div class="k" style="left:200px;top:{y3}px;width:620px;font-size:32px">space</div>',
              f'<div class="k f" style="left:840px;top:{y3}px;width:210px">return</div>']
KEYPOS[" "] = (460, y3)

LABELS = [
    [("Front lens", "gathers the light"), ("Focus group", "slides to focus"), ("Sensor", "turns light into a photo")],
    [("Chip", "gets hot"), ("Heat pipe", "carries the heat"), ("Fan", "pushes air out"), ("Fins", "release the heat")],
    [],
]
ui = ['<script src="assets/three.min.js"></script><script src="assets/three-extras.js"></script><script src="assets/studio_exr.js"></script><div class="ui" id="ui">',
      '<div id="sb"><span>9:41</span><span>●●● <i></i></span></div>',
      '<div id="menu"></div><div id="tabs"><span>Chat</span><span class="on">Code</span></div><div id="ctr"><b id="cn">1/3</b></div>',
      '<div id="ub"><span class="c" id="ubc">/motion3d</span> <span id="ubt"></span></div><div id="run">' + SPARK + '<span id="runt">Animating…</span></div>',
      '<div id="chipc">' + SPARK + '<div><div class="n" id="chn">/motion3d</div><div class="d" id="chd"></div></div></div>',
      '<div id="inp"><span id="it"></span><span class="car"></span><span class="plus">+</span><div class="snd" id="snd"></div></div>',
      '<div id="kbw"><div id="kb"></div><div id="sug"></div>' + "".join(keys_html) + '<div id="pop"></div></div>',
      '<div id="bot">Reply…</div></div>']
stages = ""
for k, (cmd, prompt, title, cap, hi, desc) in enumerate(DEMOS):
    labs = "".join(f'<div class="lb" id="l{k}_{i}"><i class="ld" id="ld{k}_{i}"></i><b>{n}</b>' + (f'<span>{s}</span>' if s else '') + '</div>'
                   for i, (n, s) in enumerate(LABELS[k]))
    capw = "".join(f'<span class="cw{" hi" if i == hi else ""}" id="c{k}_{i}">{w}</span> ' for i, w in enumerate(cap.split()))
    extra = HERO if k == 2 else ''
    stages += (f'<div class="stage" id="st{k}"><canvas id="cv{k}" width="1080" height="1920"></canvas>{extra}'
               f'<div class="cap">{capw}</div>{labs}'
               f'<div class="ttl"><b>{title}</b><i>with Claude Code</i></div></div>')
thumbs = "".join(f'<div class="th" id="th{k}" style="left:{x}px"><img src="assets/th{k}.jpg" alt=""></div>' for k, x in enumerate([90, 400, 710]))
end = ('<div id="end">' + SPARK + '<div class="c" id="e1">Comment</div><div class="kw" id="e2">“MOTION”</div>'
       '<div class="g" id="e3">and I\'ll send you the prompts</div>' + thumbs + '</div>')
F.clip(0, "".join(ui) + stages + end)

CSS = r"""
:root{--paper:#121212}
html,body,#root{background:#121212!important}
#grid,#stars,#grain{display:none}
#vig{background:radial-gradient(120% 80% at 50% 40%,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%)}
#handle{top:1700px;font-size:28px;padding:10px 28px;opacity:0;z-index:50}
.ui{position:absolute;inset:0;font-family:var(--sans);color:#ececec}
#sb{position:absolute;left:70px;right:70px;top:34px;display:flex;justify-content:space-between;font-weight:700;font-size:34px}
#sb i{display:inline-block;width:46px;height:22px;border:3px solid #ececec;border-radius:7px;margin-left:14px;position:relative;top:3px}
#sb i::after{content:'';position:absolute;left:3px;top:3px;bottom:3px;width:30px;background:#ececec;border-radius:3px}
#tabs{position:absolute;left:50%;top:110px;transform:translateX(-50%);display:flex;background:#232323;border-radius:999px;padding:6px;font-weight:600;font-size:30px}
#tabs span{padding:10px 30px;border-radius:999px;color:#8d8d8d}#tabs span.on{background:#3a3a3a;color:#fff}
#menu{position:absolute;left:70px;top:112px;width:64px;height:64px;border-radius:50%;background:#232323}
#menu::after{content:'';position:absolute;left:20px;top:24px;width:24px;height:16px;border-top:3px solid #ccc;border-bottom:3px solid #ccc}
#ctr{position:absolute;right:70px;top:112px;height:64px;min-width:64px;border-radius:32px;background:#232323;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:28px;padding:0 18px}
#inp{position:absolute;left:70px;right:70px;top:1150px;min-height:170px;background:#1f1f1f;border-radius:34px;border:2px solid #2c2c2c;padding:26px 30px 74px;font-size:40px;line-height:1.3}
#inp .ph{color:#6b6b6b}#inp .cmd{color:#ff6a3d;font-weight:600}
#inp .car{display:inline-block;width:4px;height:44px;background:#ff6a3d;vertical-align:-8px;margin-left:3px}
#inp .plus{position:absolute;left:30px;bottom:18px;font-size:40px;color:#8d8d8d}
#inp .snd{position:absolute;right:20px;bottom:16px;width:62px;height:62px;border-radius:50%;background:#3a3a3a}
#inp .snd::after{content:'';position:absolute;left:21px;top:16px;border-bottom:20px solid #fff;border-left:10px solid transparent;border-right:10px solid transparent}
#inp .snd::before{content:'';position:absolute;left:29px;top:30px;width:4px;height:18px;background:#fff}
#chipc{position:absolute;left:70px;right:70px;top:1010px;height:118px;background:#2a1d18;border-radius:26px;border:2px solid #4a2c22;display:flex;align-items:center;gap:22px;padding:0 28px;opacity:0}
#chipc svg{width:52px;height:52px;flex:none}
#chipc .n{font-weight:700;font-size:38px;color:#ff6a3d}#chipc .d{font-size:26px;color:#a98f86;margin-top:2px}
#kb{position:absolute;left:0;right:0;top:1370px;height:550px;background:#1b1b1b}
.k{position:absolute;height:96px;border-radius:14px;background:#3b3b3b;color:#f2f2f2;font-size:42px;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 0 #0b0b0b}
.k.f{background:#2a2a2a;font-size:30px}
#pop{position:absolute;width:118px;height:170px;border-radius:22px;background:#5a5a5a;color:#fff;font-size:68px;display:flex;align-items:flex-start;justify-content:center;padding-top:16px;opacity:0;box-shadow:0 20px 40px rgba(0,0,0,.6)}
#sug{position:absolute;left:0;right:0;top:1380px;text-align:center;color:#bdbdbd;font-size:32px}
#ub{position:absolute;right:70px;top:200px;max-width:720px;background:#2a2a2a;border-radius:30px 30px 8px 30px;padding:16px 26px;font-size:32px;line-height:1.3;opacity:0}
#ub .c{color:#ff6a3d}
#run{position:absolute;left:70px;top:330px;font-size:30px;color:#9a9a9a;display:flex;align-items:center;gap:14px;opacity:0}
#run svg{width:38px;height:38px}
#bot{position:absolute;left:70px;right:70px;top:1720px;height:100px;background:#1f1f1f;border-radius:30px;border:2px solid #2c2c2c;color:#6b6b6b;font-size:34px;display:flex;align-items:center;padding-left:30px;opacity:0}
.stage{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden;opacity:0;transform-origin:540px 900px;
 background:radial-gradient(90% 60% at 50% 42%,#262a31 0%,#101114 60%,#08090b 100%)}
.stage canvas{position:absolute;inset:0;width:1080px;height:1920px}
.cap{position:absolute;left:80px;right:80px;top:250px;text-align:center;font-weight:700;font-size:62px;letter-spacing:-.02em;line-height:1.15;color:#fff}
.cw{display:inline-block;opacity:0}
.cw.hi{background:#2f6bff;padding:0 .18em;border-radius:10px}
.lb{position:absolute;opacity:0;white-space:nowrap;font-family:var(--sans);transform:translate(0,-50%);isolation:isolate;background:rgba(10,11,14,.78);padding:8px 14px 10px;border-radius:12px}
.lb .ld{z-index:-1}
.lb b{display:block;font-weight:700;font-size:34px;color:#fff}
.lb span{display:block;font-family:var(--mono);font-size:23px;color:#b7c0cb;margin-top:2px}
.lb .ld{position:absolute;left:-14px;top:22px;height:2px;background:rgba(255,255,255,.55);transform-origin:0 50%}
.lb .ld::after{content:'';position:absolute;right:-7px;top:-6px;width:14px;height:14px;border-radius:50%;background:#ff6a3d;box-shadow:0 0 0 6px rgba(255,106,61,.25)}
.ttl{position:absolute;left:0;right:0;top:1580px;text-align:center}
.ttl b{display:block;font-weight:700;font-size:44px;color:#fff}.ttl i{display:block;font-family:var(--serif);font-size:44px;color:#bdbdbd}
#end{position:absolute;inset:0;background:#121212;opacity:0;font-family:var(--sans);z-index:30}
#end svg{position:absolute;left:490px;top:300px;width:100px;height:100px}
#end .c{position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:800;font-size:90px;color:#fff}
#end .kw{position:absolute;left:0;right:0;top:520px;text-align:center;font-weight:900;font-size:150px;color:#ff4b1f;letter-spacing:-.04em}
#end .g{position:absolute;left:0;right:0;top:710px;text-align:center;font-weight:800;font-size:56px;color:#fff}
.th{position:absolute;top:900px;width:280px;height:430px;border-radius:24px;overflow:hidden;background:#222;box-shadow:0 30px 60px rgba(0,0,0,.7),0 0 0 2px #2a2a2a}
.th img{width:100%;height:100%;object-fit:cover}
"""
CSS += r'''
.lb{background:rgba(8,9,12,.92)!important}

#pic0{position:absolute;left:360px;top:1250px;width:360px;height:270px;border-radius:18px;box-shadow:0 30px 60px rgba(0,0,0,.7),0 0 0 3px #2a2d35}

#bw2{position:absolute;left:70px;top:390px;width:940px;height:1120px;border-radius:30px;overflow:hidden;background:#0a0b10;box-shadow:0 60px 120px rgba(0,0,0,.7),0 0 0 2px #23252c}
#hb2{position:absolute;left:0;right:0;top:0;height:60px;background:#16181e;display:flex;align-items:center;gap:12px;padding-left:24px;z-index:3}
#hb2 i{width:14px;height:14px;border-radius:50%;background:#3a3d45}#hb2 span{margin-left:150px;background:#0d0e12;border-radius:10px;padding:6px 120px;font-family:var(--mono);font-size:22px;color:#9aa0aa}
#hpage2{position:absolute;left:0;top:60px;width:940px;height:1400px}
#hn2{position:absolute;left:30px;right:30px;top:24px;display:flex;align-items:center;gap:34px;font-family:var(--sans);font-size:26px;color:#c9cdd4;z-index:2}
#hn2 b{font-size:32px;color:#fff;margin-right:auto}#hn2 em{font-style:normal;background:#fff;color:#111;border-radius:999px;padding:8px 22px;font-weight:700}
#hc2{position:absolute;left:20px;top:70px;width:900px;height:760px}
#hh2{position:absolute;left:30px;right:30px;top:690px;text-align:center;font-family:var(--sans);font-weight:800;font-size:74px;letter-spacing:-.04em;color:#fff;min-height:90px}
#hs2{position:absolute;left:60px;right:60px;top:790px;text-align:center;font-family:var(--sans);font-size:30px;color:#9aa0aa;opacity:0}
#hcta2{position:absolute;left:340px;width:260px;top:860px;height:80px;border-radius:999px;background:#ff4b1f;color:#fff;font-family:var(--sans);font-weight:800;font-size:32px;display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 20px 50px rgba(255,75,31,.45)}
.hf{position:absolute;top:990px;width:270px;height:190px;border-radius:24px;background:#14161c;border:2px solid #23262e;color:#e8eaee;font-family:var(--sans);font-weight:700;font-size:28px;padding:26px;opacity:0}
.hf b{display:block;font-size:40px;color:#ff6a3d;margin-bottom:18px}
#hf2_0{left:30px}#hf2_1{left:335px}#hf2_2{left:640px}
#hcur2{position:absolute;left:520px;top:960px;width:52px;height:52px;opacity:0;z-index:5}
#st2{background:radial-gradient(70% 45% at 50% 45%,#1a1c22 0%,#08090b 60%,#030304 100%)!important}
.lock{position:absolute;left:540px;top:1380px;display:flex;align-items:center;gap:18px;background:rgba(20,22,28,.85);border:2px solid #2a2d35;border-radius:999px;padding:16px 34px 16px 22px;font-family:var(--sans);font-weight:800;font-size:40px;color:#fff;opacity:0}
.lock .ic{width:46px;height:46px;border-radius:50%;background:#3a3d45;position:relative}
.lock.on .ic{background:#1fae5b}.lock.on .ic::after{content:'';position:absolute;left:14px;top:9px;width:12px;height:22px;border-right:5px solid #fff;border-bottom:5px solid #fff;transform:rotate(45deg)}

.lb{background:rgba(10,11,14,.72)}
#l1_0,#l1_1{transform:none;background:#ff4b1f;color:#fff;padding:6px 16px;border-radius:10px}
#l1_0 b,#l1_1 b{font-size:34px}
#lx2{position:absolute;left:0;top:600px;width:900px;height:16px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(4px);opacity:0}
#br2{position:absolute;left:0;right:0;top:1390px;text-align:center;font-weight:900;font-size:120px;color:#fff;letter-spacing:.15em;opacity:0}
#st2{background:radial-gradient(70% 45% at 50% 45%,#22252c 0%,#0b0c0f 60%,#030304 100%)}
#st1{background:radial-gradient(80% 50% at 50% 45%,#0c1626 0%,#05080f 70%,#020306 100%)}
'''

JS = r"""
const TY=__TY__, KP=__KP__, CMD='__CMD__', END=__END__;
const it=document.getElementById('it'), sug=document.getElementById('sug'), pop=document.getElementById('pop'), cn=document.getElementById('cn'), ubt=document.getElementById('ubt');
const SCN=[];
function mkRenderer(id){ const r=new THREE.WebGLRenderer({canvas:document.getElementById(id),antialias:true,alpha:true,preserveDrawingBuffer:true});
  r.setPixelRatio(1); r.setSize(1080,1920,false); r.outputEncoding=THREE.sRGBEncoding; r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=1.05; return r; }
function studioEnv(renderer){ const s=new THREE.Scene(); const g=new THREE.BoxGeometry(1,1,1);
  const room=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0x2a2c30,side:THREE.BackSide})); room.scale.set(20,14,20); s.add(room);
  const L=(x,y,z,sx,sy,c)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:c})); m.position.set(x,y,z); m.scale.set(sx,sy,1); m.lookAt(0,0,0); s.add(m); };
  L(0,6.5,0,12,4,0xffffff); L(-9,2,2,3,8,0xdfe7ff); L(9,1,-3,3,6,0xfff1e0); L(0,1,-9.5,10,1.2,0x9fb4ff); L(4,-2,9,6,1,0xffffff);
  const pm=new THREE.PMREMGenerator(renderer); return pm.fromScene(s,0.03).texture; }
function rbox(w,h,d,r,seg){ const sh=new THREE.Shape(); const x=-w/2,y=-h/2; r=Math.min(r,w/2,h/2);
  sh.moveTo(x+r,y); sh.lineTo(x+w-r,y); sh.quadraticCurveTo(x+w,y,x+w,y+r); sh.lineTo(x+w,y+h-r); sh.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  sh.lineTo(x+r,y+h); sh.quadraticCurveTo(x,y+h,x,y+h-r); sh.lineTo(x,y+r); sh.quadraticCurveTo(x,y,x+r,y);
  const bv=Math.min(d*0.35,0.02); const g=new THREE.ExtrudeGeometry(sh,{depth:Math.max(0.001,d-2*bv),bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:seg||4,curveSegments:10});
  g.translate(0,0,-(d-2*bv)/2); g.computeVertexNormals(); return g; }
function rframe(w,h,d,r,t){ const mk=(w,h,r)=>{ const sh=new THREE.Shape(); const x=-w/2,y=-h/2; sh.moveTo(x+r,y); sh.lineTo(x+w-r,y); sh.quadraticCurveTo(x+w,y,x+w,y+r);
   sh.lineTo(x+w,y+h-r); sh.quadraticCurveTo(x+w,y+h,x+w-r,y+h); sh.lineTo(x+r,y+h); sh.quadraticCurveTo(x,y+h,x,y+h-r); sh.lineTo(x,y+r); sh.quadraticCurveTo(x,y,x+r,y); return sh; };
  const o=mk(w,h,r); const i=mk(w-2*t,h-2*t,Math.max(0.01,r-t)); o.holes.push(new THREE.Path(i.getPoints(40).reverse()));
  const g=new THREE.ExtrudeGeometry(o,{depth:d,bevelEnabled:true,bevelThickness:0.008,bevelSize:0.008,bevelSegments:3,curveSegments:12}); g.translate(0,0,-d/2); return g; }
function canvasTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }
function shadowPlane(sx,sy,op){ const t=canvasTex(256,256,(g,w,h)=>{ const gr=g.createRadialGradient(128,128,10,128,128,128); gr.addColorStop(0,'rgba(0,0,0,'+op+')'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  const m=new THREE.Mesh(new THREE.PlaneGeometry(sx,sy),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false})); m.rotation.x=-Math.PI/2; return m; }
const ease=(x)=>x<0?0:x>1?1:1-Math.pow(1-x,3), easeIO=(x)=>x<0?0:x>1?1:x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, cl=(x)=>x<0?0:x>1?1:x;
const V=new THREE.Vector3();
function placeLabel(el,obj,cam,offx,offy,alpha){ obj.getWorldPosition(V); V.project(cam); const x=(V.x*.5+.5)*1080+(offx||0), y=(-V.y*.5+.5)*1920+(offy||0);
  el.style.left=x+'px'; el.style.top=y+'px'; el.style.opacity=alpha; }
function layoutLabels(items,cam,colX,minGap,side){ // items: [el,obj,alpha,ox,oy]
  const pts=items.map(([el,obj,a,ox,oy])=>{ const o=new THREE.Object3D(); obj.add(o); o.position.set(ox||0,oy||0,0); o.getWorldPosition(V); obj.remove(o); V.project(cam);
    return {el,a,x:(V.x*.5+.5)*1080,y:(-V.y*.5+.5)*1920}; });
  const ord=pts.slice().sort((p,q)=>p.y-q.y); let last=-1e9; ord.forEach(p=>{ p.ly=Math.max(p.y,last+minGap); last=p.ly; });
  pts.forEach(p=>{ const lx=colX; p.el.style.left=lx+'px'; p.el.style.top=p.ly+'px'; p.el.style.opacity=p.a;
    const ld=p.el.querySelector('.ld'); const dx=p.x-lx, dy=p.y-(p.ly)+0; const len=Math.hypot(dx,dy);
    ld.style.width=len+'px'; ld.style.left='0px'; ld.style.transform='rotate('+Math.atan2(dy,dx)+'rad)'; ld.style.transformOrigin='0 50%'; }); }
function caption(k,lt){ const d=TY[k]; d.cap.forEach((w,i)=>{ const el=document.getElementById('c'+k+'_'+i); const a=cl((lt-0.25-i*0.16)/0.18); el.style.opacity=a; el.style.transform='translateY('+((1-a)*14)+'px)'; }); }

__SCENES__
// ================= chat + timeline =================
let lastKey='';
function apply(t){
  let d=TY[0], k=0; for(let i=0;i<TY.length;i++){ if(TY[i].T<=t){ d=TY[i]; k=i; } }
  let html='<span class="ph">Reply…</span>', sg='', pk='';
  if(t>=d.slash && t<d.send){ let s='/'; let ch='';
    if(t>=d.c0){ const n=Math.min(d.cmd.length,Math.floor((t-d.c0)/((d.c1-d.c0)/d.cmd.length))+1); s='/'+d.cmd.slice(0,n); ch=d.cmd[n-1]; }
    let ptxt='';
    if(t>=d.p0){ const m=d.prompt.length, n=Math.min(m,Math.floor((t-d.p0)/((d.p1-d.p0)/m))+1); ptxt=d.prompt.slice(0,n); ch=d.prompt[n-1]; }
    html='<span class="cmd">'+s+'</span>'+(ptxt?' '+ptxt:''); const lw=(ptxt||s).split(' ').pop(); sg='"'+lw+'"'; if(ch&&KP[ch]&&ch!==' ') pk=ch; }
  if(t>=d.p1-0.02 && t<d.send) pk='';
  const key=[k,html,sg,pk].join('|');
  if(key!==lastKey){ lastKey=key; it.innerHTML=html; sug.textContent=sg; cn.textContent=(k+1)+'/3'; ubt.textContent=d.prompt; document.getElementById('ubc').textContent='/'+d.cmd; document.getElementById('runt').textContent='Animating with /'+d.cmd+'…'; document.getElementById('chn').textContent='/'+d.cmd; document.getElementById('chd').textContent=d.desc;
    if(pk){ const p=KP[pk]; pop.textContent=pk; pop.style.left=(p[0]-12)+'px'; pop.style.top=(p[1]-120)+'px'; pop.style.opacity=1; } else pop.style.opacity=0; }
  // 3D: render the active result
  if(t>=d.card && t<d.end+0.05 && t<END){ SCN[k](t-d.card); }
}
const clock={t:0}; tl.fromTo(clock,{t:0},{t:DUR,duration:DUR,ease:'none',onUpdate:()=>apply(clock.t)},0); apply(0);
const NI={immediateRender:false}; function F2(sel,f,t,at){ return tl.fromTo(sel,f,Object.assign({},t,NI),at); }
TY.forEach((d,k)=>{
  if(k){ tl.set('#st'+(k-1),{opacity:0},d.T); tl.set(['#kbw','#inp'],{y:0,opacity:1},d.T); tl.set(['#ub','#run','#bot'],{opacity:0},d.T); }
  F2('#chipc',{opacity:0,y:30},{opacity:1,y:0,duration:.2,ease:'power2.out'},d.slash);
  tl.set('#snd',{backgroundColor:'#ff4b1f'},d.slash+0.05);
  tl.set('#chipc',{opacity:0},d.p0);
  tl.to('#snd',{scale:.85,duration:.06,yoyo:true,repeat:1},d.send-0.08);
  F2(['#kbw','#inp'],{y:0,opacity:1},{y:620,opacity:0,duration:.3,ease:'power3.in'},d.send);
  F2('#ub',{opacity:0,y:30,scale:.9},{opacity:1,y:0,scale:1,duration:.25,ease:'back.out(2)'},d.send);
  F2('#run',{opacity:0,x:-20},{opacity:1,x:0,duration:.2},d.send+0.06);
  F2('#bot',{opacity:0},{opacity:1,duration:.2},d.send+0.15);
  tl.set('#snd',{backgroundColor:'#3a3a3a'},d.send+0.3);
  F2('#st'+k,{opacity:0,scale:.5,y:140,borderRadius:60},{opacity:1,scale:.58,y:110,borderRadius:60,duration:.3,ease:'back.out(1.6)'},d.card);
  F2('#st'+k,{scale:.58,y:110,borderRadius:60},{scale:1,y:0,borderRadius:0,duration:.42,ease:'expo.inOut'},d.full);
});
tl.set(['#st0','#st1','#st2'],{opacity:0},0); tl.set(['#kbw','#inp'],{y:0,opacity:1},0); tl.set('#snd',{backgroundColor:'#3a3a3a'},0);
tl.set('#st2',{opacity:0},END); tl.set('#ui',{opacity:0},END);
F2('#end',{opacity:0},{opacity:1,duration:.15},END);
F2('#end svg',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.45,ease:'back.out(2)'},END+0.05);
F2('#e1',{opacity:0,y:40},{opacity:1,y:0,duration:.35,ease:A},END+0.08);
F2('#e2',{opacity:0,scale:1.5},{opacity:1,scale:1,duration:.4,ease:'back.out(1.8)'},END+0.25);
F2('#e3',{opacity:0,y:30},{opacity:1,y:0,duration:.35,ease:A},END+0.4);
[0,1,2].forEach(k=>F2('#th'+k,{opacity:0,y:200,rotation:(k-1)*8},{opacity:1,y:0,rotation:(k-1)*3,duration:.55,ease:'back.out(1.4)'},END+0.3+k*0.1));
F2('#handle',{opacity:0},{opacity:1,duration:.3},END+0.5);
tl.set(['#end','#e1','#e2','#e3','#th0','#th1','#th2','#handle'],{opacity:0},0);
"""
JS = JS.replace("__SCENES__", (HERE / 'scenes.js').read_text()).replace("__TY__", json.dumps(TY)).replace("__KP__", json.dumps(KEYPOS)).replace("__CMD__", CMD).replace("__END__", str(END))
F.write(CSS, JS, music_vol=0.14)
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
