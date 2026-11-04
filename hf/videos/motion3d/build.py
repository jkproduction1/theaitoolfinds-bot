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

W = HERE.parent.parent / "work" / "motion3d"
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

DEMOS = [  # prompt, title, caption, highlighted word index
    ("show what's inside a game controller", "game controller teardown", "Every press, taken apart.", 3),
    ("fly a plane from Prague to Tokyo", "Prague to Tokyo flight", "Prague to Tokyo, above the clouds.", 4),
    ("launch video for wireless earbuds", "earbuds launch film", "Meet Aura.", 1),
]
CMD = "motion3d"
TY = []
for k, (prompt, title, cap, hi) in enumerate(DEMOS):
    T = round(k * DEMO_LEN, 3)
    t_slash = T + (0.0 if k == 0 else 0.1)
    c0, c1 = T + 0.14, T + 0.42
    p0, p1 = T + 0.46, T + 0.46 + 0.022 * len(prompt)
    send = round(p1 + 0.12, 3)
    TY.append({"T": T, "slash": t_slash, "c0": c0, "c1": c1, "p0": p0, "p1": p1, "send": send, "card": send + 0.1,
               "full": send + 0.38, "end": round(T + DEMO_LEN, 3), "prompt": prompt, "cap": cap.split(), "hi": hi})
    F.sfx.append((T, "whoosh")); F.sfx.append((send, "click")); F.sfx.append((send + 0.1, "pop")); F.sfx.append((send + 0.38, "whoosh"))
    for i in range(len(CMD)):
        F.sfx.append((c0 + (c1 - c0) * i / len(CMD), "tick"))
    for i in range(0, len(prompt), 2):
        if prompt[i] != " ":
            F.sfx.append((p0 + (p1 - p0) * i / len(prompt), "tick"))
F.sfx.append((END, "whoosh")); F.sfx.append((END + 0.25, "pop"))

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
    [("Thumbsticks", ""), ("Buttons", ""), ("Top shell", ""), ("Circuit board", ""), ("Rumble motors", ""), ("Battery", "")],
    [("Prague", ""), ("Tokyo", "")],
    [],
]
ui = ['<script src="assets/three.min.js"></script><div class="ui" id="ui">',
      '<div id="sb"><span>9:41</span><span>●●● <i></i></span></div>',
      '<div id="menu"></div><div id="tabs"><span>Chat</span><span class="on">Code</span></div><div id="ctr"><b id="cn">1/3</b></div>',
      '<div id="ub"><span class="c">/motion3d</span> <span id="ubt"></span></div><div id="run">' + SPARK + '<span>Animating with /motion3d…</span></div>',
      '<div id="chipc">' + SPARK + '<div><div class="n">/motion3d</div><div class="d">Cinematic 3D animation from one line</div></div></div>',
      '<div id="inp"><span id="it"></span><span class="car"></span><span class="plus">+</span><div class="snd" id="snd"></div></div>',
      '<div id="kbw"><div id="kb"></div><div id="sug"></div>' + "".join(keys_html) + '<div id="pop"></div></div>',
      '<div id="bot">Reply…</div></div>']
stages = ""
for k, (prompt, title, cap, hi) in enumerate(DEMOS):
    labs = "".join(f'<div class="lb" id="l{k}_{i}"><i class="ld" id="ld{k}_{i}"></i><b>{n}</b>' + (f'<span>{s}</span>' if s else '') + '</div>'
                   for i, (n, s) in enumerate(LABELS[k]))
    capw = "".join(f'<span class="cw{" hi" if i == hi else ""}" id="c{k}_{i}">{w}</span> ' for i, w in enumerate(cap.split()))
    extra = '<div id="lx2"></div><div id="br2">AURA</div>' if k == 2 else ''
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

// ---------- S0 game controller, exploded view
(function(){ const ren=mkRenderer('cv0'), sc=new THREE.Scene(); sc.environment=studioEnv(ren);
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const key=new THREE.DirectionalLight(0xffffff,1.5); key.position.set(3,6,4); sc.add(key);
  const rim=new THREE.DirectionalLight(0xff8a5c,1.2); rim.position.set(-4,2,-3); sc.add(rim);
  const pad=new THREE.Group(); sc.add(pad); const parts=[];
  const add=(g,y)=>{ g.userData.y=y; pad.add(g); parts.push(g); return g; };
  const shellMat=new THREE.MeshPhysicalMaterial({color:0x1c1f25,roughness:.42,metalness:.05,clearcoat:.8,clearcoatRoughness:.2,envMapIntensity:.35});
  const shellMat2=new THREE.MeshPhysicalMaterial({color:0x2a1a14,roughness:.5,metalness:.05,clearcoat:.4,envMapIntensity:.35});
  function body(mat,th){ const g=new THREE.Group();
    const mid=new THREE.Mesh(rbox(1.25,0.62,th,0.26),mat); g.add(mid);
    [-1,1].forEach(s=>{ const grip=new THREE.Mesh(rbox(0.46,0.92,th,0.23),mat); grip.position.set(s*0.5,-0.24,0); grip.rotation.z=s*0.42; g.add(grip); });
    g.rotation.x=-Math.PI/2; const w=new THREE.Group(); w.add(g); return w; }
  const top=add(body(shellMat,0.1),0.0);
  const bottom=add(body(shellMat2,0.1),0.0);
  // circuit board
  const pcbG=new THREE.Group(); const pcb=new THREE.Mesh(rbox(1.15,0.52,0.02,0.18),new THREE.MeshStandardMaterial({color:0x0f3b2a,metalness:.3,roughness:.5}));
  pcb.rotation.x=-Math.PI/2; pcbG.add(pcb);
  const chip=new THREE.Mesh(rbox(0.16,0.16,0.03,0.015),new THREE.MeshStandardMaterial({color:0x111214,metalness:.6,roughness:.3})); chip.rotation.x=-Math.PI/2; chip.position.set(0,0.02,0.02); pcbG.add(chip);
  for(let i=0;i<14;i++){ const c=new THREE.Mesh(new THREE.BoxGeometry(0.05+((i*37)%5)*0.012,0.02,0.03),new THREE.MeshStandardMaterial({color:i%3?0x1a1c20:0xd4a64a,metalness:.7,roughness:.35}));
    c.position.set(-0.45+((i*53)%90)/100,0.02,-0.18+((i*29)%36)/100); pcbG.add(c); }
  const board=add(pcbG,0.0);
  // thumbsticks
  const stickG=new THREE.Group(); const stickMat=new THREE.MeshStandardMaterial({color:0x2c2f36,roughness:.7});
  [[-0.24,0.1],[0.24,-0.1]].forEach(([x,z])=>{ const base=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,0.12,32),new THREE.MeshStandardMaterial({color:0x8d939c,metalness:1,roughness:.3}));
    base.position.set(x,0.06,z); stickG.add(base); const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.12,0.05,40),stickMat); cap.position.set(x,0.15,z); stickG.add(cap);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(0.115,0.012,10,40),new THREE.MeshStandardMaterial({color:0xff6a3d,emissive:0xff4b1f,emissiveIntensity:.6})); ring.rotation.x=Math.PI/2; ring.position.set(x,0.18,z); stickG.add(ring); });
  const sticks=add(stickG,0.0);
  // buttons: d-pad + 4 face buttons
  const btnG=new THREE.Group(); const bm=new THREE.MeshPhysicalMaterial({color:0x111216,roughness:.25,clearcoat:1});
  const dp1=new THREE.Mesh(rbox(0.22,0.07,0.05,0.02),bm); dp1.rotation.x=-Math.PI/2; dp1.position.set(-0.42,0.03,-0.05); btnG.add(dp1);
  const dp2=dp1.clone(); dp2.rotation.z=Math.PI/2; btnG.add(dp2);
  [[0,-0.1],[0.1,0],[0,0.1],[-0.1,0]].forEach(([dx,dz],i)=>{ const b=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.05,32),i==1?new THREE.MeshStandardMaterial({color:0xff4b1f,emissive:0xff4b1f,emissiveIntensity:.4,roughness:.3}):bm);
    b.position.set(0.42+dx,0.03,-0.05+dz); btnG.add(b); });
  const buttons=add(btnG,0.0);
  // rumble motors
  const rmG=new THREE.Group(); [-0.5,0.5].forEach(x=>{ const m=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.2,32),new THREE.MeshStandardMaterial({color:0xb9bec7,metalness:1,roughness:.25}));
    m.rotation.z=Math.PI/2; m.position.set(x,0,0.25); rmG.add(m); const w=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.05,24,1,false,0,Math.PI),new THREE.MeshStandardMaterial({color:0xd4a64a,metalness:1,roughness:.3}));
    w.rotation.z=Math.PI/2; w.position.set(x+(x<0?0.13:-0.13),0,0.25); w.name='w'; rmG.add(w); });
  const rumble=add(rmG,0.0);
  // battery
  const bat=add((()=>{ const g=new THREE.Group(); const b=new THREE.Mesh(rbox(0.5,0.22,0.12,0.04),new THREE.MeshStandardMaterial({color:0x2b2f36,metalness:.35,roughness:.45}));
    b.rotation.x=-Math.PI/2; g.add(b); const t=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.005,0.05),new THREE.MeshStandardMaterial({color:0xff6a3d,emissive:0xff4b1f,emissiveIntensity:.5})); t.position.y=0.065; g.add(t); return g; })(),0.0);
  // explode order (top to bottom): sticks, buttons, top shell, board, rumble, battery, bottom shell
  const ORDER=[[sticks,0.95],[buttons,0.7],[top,0.42],[board,0.05],[rumble,-0.22],[bat,-0.48],[bottom,-0.82]];
  const glow=new THREE.PointLight(0xff6a3d,0,3); glow.position.set(0,0.1,0.4); sc.add(glow);
  const sh=shadowPlane(3,3,.5); sh.position.y=-0.75; sc.add(sh);
  const LB=[sticks,buttons,top,board,rumble,bat];
  SCN[0]=function(lt){ const e=easeIO(cl((lt-0.35)/1.2));
    ORDER.forEach(([p,y],i)=>{ const base=[0.12,0.08,0.05,0.0,-0.02,-0.03,-0.06][i]; p.position.y=base+(y-base)*e; p.rotation.y=0.05*Math.sin(lt*1.5+i)*e; });
    rumble.children.forEach(c=>{ if(c.name==='w') c.rotation.x=lt*30*cl((lt-1.2)/0.3); });
    glow.intensity=2.5*e;
    pad.rotation.set(0.6-0.12*e,-0.5+0.55*cl(lt/3.4),0.0); pad.scale.setScalar(0.66); pad.position.set(-0.18,-0.05,0);
    cam.position.set(0,0.3+0.15*e,6.4-0.6*ease(lt/3)); cam.lookAt(0,0.0,0); ren.render(sc,cam);
    layoutLabels(LB.map((o,i)=>[document.getElementById('l0_'+i),o,cl((lt-1.25-i*0.12)/0.2),0.3,0]),cam,790,92);
    caption(0,lt); };
})();

// ---------- S1 plane Prague -> Tokyo above the clouds
(function(){ const ren=mkRenderer('cv1'), sc=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.01,100);
  const tex=new THREE.TextureLoader().load('assets/earth.jpg'); tex.encoding=THREE.sRGBEncoding; tex.anisotropy=8;
  const globe=new THREE.Mesh(new THREE.SphereGeometry(1,128,96),new THREE.MeshStandardMaterial({map:tex,roughness:.9,metalness:0,emissive:0xffffff,emissiveMap:tex,emissiveIntensity:.55}));
  sc.add(globe);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(1.06,64,48),new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false,
    vertexShader:'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'varying vec3 vN; void main(){ float i=pow(0.72-dot(vN,vec3(0,0,1.)),3.); gl_FragColor=vec4(0.3,0.6,1.,1.)*i*1.6; }'}));
  sc.add(atm);
  const sun=new THREE.DirectionalLight(0xffffff,1.1); sun.position.set(-3,2,4); sc.add(sun); sc.add(new THREE.AmbientLight(0x6688aa,.5));
  // stars
  { const n=900, p=new Float32Array(n*3); for(let i=0;i<n;i++){ const u=((i*7919)%1000)/1000, v=((i*104729)%1000)/1000; const th=u*Math.PI*2, ph=Math.acos(2*v-1);
      p[i*3]=30*Math.sin(ph)*Math.cos(th); p[i*3+1]=30*Math.cos(ph); p[i*3+2]=30*Math.sin(ph)*Math.sin(th); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); sc.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:0.06,transparent:true,opacity:.7}))); }
  const ll=(lat,lon,r)=>{ const la=lat*Math.PI/180, lo=lon*Math.PI/180; return new THREE.Vector3(r*Math.cos(la)*Math.sin(lo+Math.PI/2)*1, r*Math.sin(la), r*Math.cos(la)*Math.cos(lo+Math.PI/2)); };
  // equirect mapping of three's SphereGeometry: u=0 at lon=-180 on -x axis... use helper that matches the texture
  function geo(lat,lon,r){ const phi=(90-lat)*Math.PI/180, th=(lon+180)*Math.PI/180; return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(th), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(th)); }
  const A=geo(50.08,14.43,1), B=geo(35.68,139.69,1);
  const N=200, route=[]; for(let i=0;i<=N;i++){ const u=i/N; const v=new THREE.Vector3().copy(A).lerp(B,u).normalize(); const om=Math.acos(A.dot(B));
    const s=new THREE.Vector3().addScaledVector(A,Math.sin((1-u)*om)/Math.sin(om)).addScaledVector(B,Math.sin(u*om)/Math.sin(om)); route.push(s.multiplyScalar(1+0.11*Math.sin(u*Math.PI))); }
  const curve=new THREE.CatmullRomCurve3(route);
  const tubeG=new THREE.TubeGeometry(curve,400,0.003,8,false); const tubeM=new THREE.MeshBasicMaterial({color:0xff6a3d}); const tube=new THREE.Mesh(tubeG,tubeM); sc.add(tube);
  const tubeIdx=tubeG.index.count;
  const pinMat=new THREE.MeshBasicMaterial({color:0xff6a3d}); const pins=[A,B].map(p=>{ const m=new THREE.Mesh(new THREE.SphereGeometry(0.014,16,12),pinMat); m.position.copy(p).multiplyScalar(1.003); sc.add(m);
    const r=new THREE.Mesh(new THREE.RingGeometry(0.02,0.026,40),new THREE.MeshBasicMaterial({color:0xff6a3d,transparent:true,side:THREE.DoubleSide})); r.position.copy(p).multiplyScalar(1.004); r.lookAt(0,0,0); sc.add(r); m.userData.ring=r; return m; });
  // plane (white jet built from primitives)
  const plane=new THREE.Group(); const wm=new THREE.MeshPhysicalMaterial({color:0xf4f5f7,roughness:.3,metalness:.1,clearcoat:1});
  const fus=new THREE.Mesh(new THREE.CapsuleGeometry?new THREE.CapsuleGeometry(0.06,0.42,8,16):new THREE.CylinderGeometry(0.06,0.06,0.5,16),wm); fus.rotation.x=Math.PI/2; plane.add(fus);
  const wing=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.012,0.13),wm); wing.position.z=0.02; plane.add(wing);
  const tail=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.01,0.07),wm); tail.position.z=-0.22; plane.add(tail);
  const fin=new THREE.Mesh(new THREE.BoxGeometry(0.01,0.12,0.08),new THREE.MeshStandardMaterial({color:0xff4b1f,roughness:.4})); fin.position.set(0,0.07,-0.22); plane.add(fin);
  [-0.17,0.17].forEach(x=>{ const en=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.09,16),new THREE.MeshStandardMaterial({color:0xaab0b8,metalness:.8,roughness:.3})); en.rotation.x=Math.PI/2; en.position.set(x,-0.03,0.05); plane.add(en); });
  plane.scale.setScalar(0.075); sc.add(plane);
  // contrail
  const trailN=60, trailPts=new Float32Array(trailN*3); const trailG=new THREE.BufferGeometry(); trailG.setAttribute('position',new THREE.BufferAttribute(trailPts,3));
  const trail=new THREE.Points(trailG,new THREE.PointsMaterial({color:0xffffff,size:0.006,transparent:true,opacity:.8,depthWrite:false})); sc.add(trail);
  // clouds: soft sprites in a shell above the surface, denser near the route
  const ctex=canvasTex(256,256,(g,w,h)=>{ for(let i=0;i<14;i++){ const x=60+((i*71)%140), y=90+((i*37)%80), r=40+((i*13)%40); const gr=g.createRadialGradient(x,y,0,x,y,r);
      gr.addColorStop(0,'rgba(255,255,255,.55)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); } });
  const clouds=[]; const cm=new THREE.SpriteMaterial({map:ctex,transparent:true,depthWrite:false,opacity:.9});
  for(let i=0;i<320;i++){ const u=((i*0.6180339)%1); const p=curve.getPoint(u); const jitter=new THREE.Vector3(Math.sin(i*12.9)*0.16,Math.sin(i*78.2)*0.16,Math.sin(i*37.7)*0.16);
    const dir=p.clone().normalize().add(jitter).normalize(); const s=new THREE.Sprite(cm.clone()); const alt=1.025+((i*17)%10)/450; s.position.copy(dir.multiplyScalar(alt));
    const sz=0.018+((i*29)%10)/400; s.scale.set(sz*1.7,sz,1); s.userData.u=u; sc.add(s); clouds.push(s); }
  const elA=document.getElementById('l1_0'), elB=document.getElementById('l1_1');
  SCN[1]=function(lt){ const p=easeIO(cl((lt-0.3)/2.6)); const pu=Math.max(0.001,p);
    tubeG.setDrawRange(0,Math.floor(tubeIdx*pu/6)*6);
    const pos=curve.getPoint(pu), ahead=curve.getPoint(Math.min(1,pu+0.01)); plane.position.copy(pos);
    const up=pos.clone().normalize(); plane.up.copy(up); plane.lookAt(ahead); plane.rotateZ(-0.25*Math.sin(lt*2));
    for(let i=0;i<trailN;i++){ const q=curve.getPoint(Math.max(0,pu-i*0.0025)); trailPts[i*3]=q.x; trailPts[i*3+1]=q.y; trailPts[i*3+2]=q.z; } trailG.attributes.position.needsUpdate=true;
    clouds.forEach((c,i)=>{ c.material.opacity=0.85*cl(1-Math.abs(c.userData.u-pu)*2.5); c.material.rotation=lt*0.05*(i%2?1:-1); });
    pins.forEach((m,i)=>{ const r=m.userData.ring; const tt=(lt*1.2+i*0.5)%1; r.scale.setScalar(1+tt*1.2); r.material.opacity=1-tt; });
    // camera: wide globe -> chase above the clouds -> pull out over Tokyo
    const chase=Math.sin(cl((lt-0.2)/3.0)*Math.PI); const dist=2.9-2.15*easeIO(chase);
    const side=new THREE.Vector3().crossVectors(up,ahead.clone().sub(pos).normalize()).normalize();
    const back=ahead.clone().sub(pos).normalize().multiplyScalar(-1);
    const camPos=pos.clone().normalize().multiplyScalar(1+dist).add(back.multiplyScalar(0.35*chase)).add(side.multiplyScalar(0.12*chase));
    cam.position.copy(camPos); cam.up.copy(up.clone().lerp(new THREE.Vector3(0,1,0),1-chase).normalize()); cam.lookAt(pos.clone().multiplyScalar(1-0.4*(1-chase)));
    ren.render(sc,cam);
    placeLabel(elA,pins[0],cam,24,-30,cl((lt-0.2)/0.2)); placeLabel(elB,pins[1],cam,24,-30,cl((p-0.85)/0.1));
    caption(1,lt); };
})();

// ---------- S2 earbuds launch film
(function(){ const ren=mkRenderer('cv2'), sc=new THREE.Scene(); sc.environment=studioEnv(ren);
  const cam=new THREE.PerspectiveCamera(28,1080/1920,0.1,100);
  const spot=new THREE.SpotLight(0xffffff,0,12,0.5,0.6); spot.position.set(0,5,3); sc.add(spot); spot.target.position.set(0,0,0); sc.add(spot.target);
  const rimL=new THREE.DirectionalLight(0xff6a3d,0); rimL.position.set(-4,1,-3); sc.add(rimL);
  const rimR=new THREE.DirectionalLight(0x8fb3ff,0); rimR.position.set(4,1,-3); sc.add(rimR);
  const white=new THREE.MeshPhysicalMaterial({color:0xf5f5f3,roughness:.22,metalness:0,clearcoat:1,clearcoatRoughness:.08});
  const caseG=new THREE.Group(); sc.add(caseG);
  const base=new THREE.Mesh(rbox(1.0,0.5,0.42,0.2),white); base.position.y=-0.12; caseG.add(base);
  const lidPivot=new THREE.Group(); lidPivot.position.set(0,0.13,-0.21); caseG.add(lidPivot);
  const lid=new THREE.Mesh(rbox(1.0,0.22,0.42,0.1),white); lid.position.set(0,0.1,0.21); lidPivot.add(lid);
  const seam=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.006,0.43),new THREE.MeshStandardMaterial({color:0x9a9a9a})); seam.position.y=0.13; caseG.add(seam);
  const led=new THREE.Mesh(new THREE.SphereGeometry(0.014,12,8),new THREE.MeshBasicMaterial({color:0xff6a3d})); led.position.set(0,-0.05,0.215); caseG.add(led);
  function bud(){ const g=new THREE.Group(); const head=new THREE.Mesh(new THREE.SphereGeometry(0.13,48,32),white); head.scale.set(1,0.9,0.85); g.add(head);
    const tip=new THREE.Mesh(new THREE.SphereGeometry(0.07,32,16),new THREE.MeshStandardMaterial({color:0xdedede,roughness:.7})); tip.position.set(0.07,0,0.08); g.add(tip);
    const stem=new THREE.Mesh(new THREE.CapsuleGeometry?new THREE.CapsuleGeometry(0.035,0.32,8,16):new THREE.CylinderGeometry(0.035,0.035,0.4,16),white); stem.position.set(-0.02,-0.22,-0.02); g.add(stem);
    const mesh=new THREE.Mesh(new THREE.CircleGeometry(0.03,24),new THREE.MeshStandardMaterial({color:0x222222})); mesh.position.set(-0.02,-0.39,-0.02); mesh.rotation.x=Math.PI/2; g.add(mesh); return g; }
  const L=bud(), R=bud(); R.scale.x=-1; sc.add(L,R);
  const sh=shadowPlane(2.4,2.4,.6); sh.position.y=-0.45; sc.add(sh);
  const streak=document.getElementById('lx2'), brand=document.getElementById('br2');
  SCN[2]=function(lt){ const on=cl(lt/0.35); spot.intensity=6*on; rimL.intensity=2.2*on; rimR.intensity=1.6*on;
    const op=easeIO(cl((lt-0.45)/0.5)); lidPivot.rotation.x=-1.9*op;
    const fly=easeIO(cl((lt-0.85)/0.9));
    caseG.position.y=-0.02-0.18*fly; caseG.rotation.set(0.35,-0.5+0.6*cl(lt/3.2),0); caseG.scale.setScalar(0.62-0.12*fly);
    [[L,-1],[R,1]].forEach(([b,s])=>{ b.visible=lt>0.75; b.position.set(s*(0.03+0.36*fly),-0.05+0.62*fly,0.05+0.1*fly);
      b.rotation.set(0.2+0.3*Math.sin(lt*1.4),s*(0.6+lt*1.2),s*(-0.25+0.2*fly)); b.scale.setScalar(0.45+0.25*fly); });
    cam.position.set(0,0.3,6.0-0.6*ease(lt/3.2)); cam.lookAt(0,0.2,0); ren.render(sc,cam);
    const sw=cl((lt-1.8)/0.5); streak.style.opacity=sw*(1-cl((lt-2.4)/0.3)); streak.style.transform='translateX('+(-700+1400*sw)+'px) rotate(-12deg)';
    brand.style.opacity=cl((lt-2.0)/0.3); brand.style.letterSpacing=(0.5-0.35*ease(cl((lt-2.0)/1.0)))+'em';
    caption(2,lt); };
})();
// ================= chat + timeline =================
let lastKey='';
function apply(t){
  let d=TY[0], k=0; for(let i=0;i<TY.length;i++){ if(TY[i].T<=t){ d=TY[i]; k=i; } }
  let html='<span class="ph">Reply…</span>', sg='', pk='';
  if(t>=d.slash && t<d.send){ let s='/'; let ch='';
    if(t>=d.c0){ const n=Math.min(CMD.length,Math.floor((t-d.c0)/((d.c1-d.c0)/CMD.length))+1); s='/'+CMD.slice(0,n); ch=CMD[n-1]; }
    let ptxt='';
    if(t>=d.p0){ const m=d.prompt.length, n=Math.min(m,Math.floor((t-d.p0)/((d.p1-d.p0)/m))+1); ptxt=d.prompt.slice(0,n); ch=d.prompt[n-1]; }
    html='<span class="cmd">'+s+'</span>'+(ptxt?' '+ptxt:''); const lw=(ptxt||s).split(' ').pop(); sg='"'+lw+'"'; if(ch&&KP[ch]&&ch!==' ') pk=ch; }
  if(t>=d.p1-0.02 && t<d.send) pk='';
  const key=[k,html,sg,pk].join('|');
  if(key!==lastKey){ lastKey=key; it.innerHTML=html; sug.textContent=sg; cn.textContent=(k+1)+'/3'; ubt.textContent=d.prompt;
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
JS = JS.replace("__TY__", json.dumps(TY)).replace("__KP__", json.dumps(KEYPOS)).replace("__CMD__", CMD).replace("__END__", str(END))
F.write(CSS, JS, music_vol=0.14)
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
