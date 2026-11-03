"""explain3d - App demo (BRAIN §3b), Jan's live direction 2026-11-03: one command "/explain-3d" + a prompt, the result is a
cinematic 3D explainer (like the reference /full-visual video): smartphone teardown, wireless charging, noise-cancelling
headphones. Every result is a real-time three.js scene built here in code by Claude (no AI images, no stock); PBR materials,
studio environment map, labels projected from the 3D parts, captions word by word. Prompts for DM: prompts.md.
Explanations are general, textbook-level facts (OLED pixels emit their own light; Qi charging = two coils + magnetic
field; ANC = microphone + chip + speaker playing an inverted wave). No brands, no specs, no numbers."""
import json, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film

W = HERE.parent.parent / "work" / "explain3d"
A = W / "assets"
for f in (HERE / "media").iterdir():
    shutil.copy(f, A / f.name)
from PIL import Image
for k in range(3):
    if not (A / f"th{k}.jpg").exists():
        Image.new("RGB", (280, 430), (34, 34, 34)).save(A / f"th{k}.jpg")

# --- gaps after each "this." so the 3D result plays
GAPS = {11: 2.4, 23: 2.4, 35: 2.4}
if not (A / "voice_raw.mp3").exists():
    shutil.copy(A / "voice.mp3", A / "voice_raw.mp3"); shutil.copy(A / "voice.json", A / "voice_raw.json")
vw = json.loads((A / "voice_raw.json").read_text())
cuts = [round(vw[i]["end"] + 0.08, 3) for i in sorted(GAPS)]
filt, parts, prev = [], [], 0.0
for k, (i, c) in enumerate(zip(sorted(GAPS), cuts)):
    filt.append(f"[0:a]atrim={prev}:{c},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[a{k}];"
                f"anullsrc=r=44100:cl=mono,atrim=duration={GAPS[i]}[z{k}]")
    parts += [f"[a{k}]", f"[z{k}]"]; prev = c
filt.append(f"[0:a]atrim=start={prev},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono[al]"); parts.append("[al]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(A / "voice_raw.mp3"), "-filter_complex",
                ";".join(filt) + ";" + "".join(parts) + f"concat=n={len(parts)}:v=0:a=1[out]", "-map", "[out]", "-ar", "44100",
                str(A / "voice.mp3")], check=True)
shift = 0.0
for j, w in enumerate(vw):
    w["start"] += shift; w["end"] += shift
    if j in GAPS: shift += GAPS[j]
(A / "voice.json").write_text(json.dumps(vw))

F = Film(W, (HERE / "script.txt").read_text(), A / "voice.json", tail=1.3)
F.scenes([0])
S, E = F.S, F.E

DEMOS = [  # Type idx, prompt, title, caption words, highlighted word index
    (0, "how a smartphone works", "smartphone explainer", "A phone is a stack of layers.", 6),
    (12, "how wireless charging works", "wireless charging explainer", "Two coils pass power through the air.", 1),
    (24, "how noise-cancelling headphones work", "noise-cancelling explainer", "It plays the noise back, flipped.", 5),
]
CMD = "explain-3d"
TY = []
for k, (a, prompt, title, cap, hi) in enumerate(DEMOS):
    T = 0.0 if k == 0 else round(S[a] - 0.15, 3)
    nxt = round(S[DEMOS[k + 1][0]] - 0.15, 3) if k < 2 else round(S[36] - 0.15, 3)
    t_slash = max(T + 0.05, S[a + 1] - 0.05)
    c0, c1 = S[a + 2], E[a + 3]
    p0, p1 = S[a + 4], E[a + 7] - 0.05
    send = round(S[a + 8] - 0.12, 3)
    TY.append({"T": T, "slash": t_slash, "c0": c0, "c1": c1, "p0": p0, "p1": p1, "send": send, "card": send + 0.12,
               "full": send + 0.5, "end": nxt, "prompt": prompt, "cap": cap.split(), "hi": hi})
    F.sfx.append((T, "whoosh")); F.sfx.append((send, "click")); F.sfx.append((send + 0.12, "pop"))
    n = len(CMD) + 1 + len(prompt)
    for i in range(len(CMD)):
        F.sfx.append((c0 + (c1 - c0) * i / len(CMD), "tick"))
    for i in range(len(prompt)):
        if prompt[i] != " ":
            F.sfx.append((p0 + (p1 - p0) * i / len(prompt), "tick"))
END = TY[-1]["end"]
F.sfx.append((END, "whoosh"))

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
    [("Front glass", "protects the screen"), ("OLED display", "each pixel makes light"), ("Frame", "holds it all together"),
     ("Logic board", "the chip runs everything"), ("Battery", "stores the charge"), ("Cameras", "a lens + sensor each"), ("Back glass", "")],
    [("Receiver coil", "inside the phone"), ("Magnetic field", "carries the energy"), ("Transmitter coil", "inside the pad")],
    [("Microphone", "hears the outside noise"), ("Chip", "flips the sound wave"), ("Speaker", "plays the anti-noise")],
]
ui = ['<script src="assets/three.min.js"></script><div class="ui" id="ui">',
      '<div id="sb"><span>9:41</span><span>●●● <i></i></span></div>',
      '<div id="menu"></div><div id="tabs"><span>Chat</span><span class="on">Code</span></div><div id="ctr"><b id="cn">1/3</b></div>',
      '<div id="ub"><span class="c">/explain-3d</span> <span id="ubt"></span></div><div id="run">' + SPARK + '<span>Animating with /explain-3d…</span></div>',
      '<div id="chipc">' + SPARK + '<div><div class="n">/explain-3d</div><div class="d">Cinematic 3D explainer of anything</div></div></div>',
      '<div id="inp"><span id="it"></span><span class="car"></span><span class="plus">+</span><div class="snd" id="snd"></div></div>',
      '<div id="kbw"><div id="kb"></div><div id="sug"></div>' + "".join(keys_html) + '<div id="pop"></div></div>',
      '<div id="bot">Reply…</div></div>']
stages = ""
for k, (a, prompt, title, cap, hi) in enumerate(DEMOS):
    labs = "".join(f'<div class="lb" id="l{k}_{i}"><i class="ld" id="ld{k}_{i}"></i><b>{n}</b>' + (f'<span>{s}</span>' if s else '') + '</div>'
                   for i, (n, s) in enumerate(LABELS[k]))
    capw = "".join(f'<span class="cw{" hi" if i == hi else ""}" id="c{k}_{i}">{w}</span> ' for i, w in enumerate(cap.split()))
    stages += (f'<div class="stage" id="st{k}"><canvas id="cv{k}" width="1080" height="1920"></canvas>'
               f'<div class="cap">{capw}</div>{labs}'
               f'<div class="ttl"><b>{title}</b><i>with Claude Code</i></div></div>')
thumbs = "".join(f'<div class="th" id="th{k}" style="left:{x}px"><img src="assets/th{k}.jpg" alt=""></div>' for k, x in enumerate([90, 400, 710]))
end = ('<div id="end">' + SPARK + '<div class="c" id="e1">Comment</div><div class="kw" id="e2">“EXPLAIN”</div>'
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

JS = r"""
const TY=__TY__, KP=__KP__, CMD='__CMD__', END=__END__;
const it=document.getElementById('it'), sug=document.getElementById('sug'), pop=document.getElementById('pop'), cn=document.getElementById('cn'), ubt=document.getElementById('ubt');
// ================= three.js scenes =================
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

// ---------- S0 smartphone teardown
(function(){ const ren=mkRenderer('cv0'), sc=new THREE.Scene(); sc.environment=studioEnv(ren);
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const key=new THREE.DirectionalLight(0xffffff,1.6); key.position.set(3,5,4); sc.add(key); sc.add(new THREE.AmbientLight(0xffffff,.15));
  const ph=new THREE.Group(); sc.add(ph);
  const W=0.74,H=1.54,Rr=0.11; const parts=[];
  const add=(mesh,z)=>{ const g=new THREE.Group(); g.add(mesh); g.userData.z=z; ph.add(g); parts.push(g); return g; };
  // back glass (bottom), cameras, battery, board, frame, display, front glass (top)
  const back=add(new THREE.Mesh(rbox(W,H,0.03,Rr),new THREE.MeshPhysicalMaterial({color:0x1b2433,metalness:0.1,roughness:0.18,clearcoat:1,clearcoatRoughness:0.05})),-0.09);
  const camG=new THREE.Group(); const bump=new THREE.Mesh(rbox(0.34,0.34,0.03,0.08),new THREE.MeshPhysicalMaterial({color:0x222a36,roughness:.25,metalness:.2,clearcoat:1}));
  camG.add(bump); [[-0.075,0.075],[0.075,0.075],[-0.075,-0.075]].forEach(([x,y])=>{ const ring=new THREE.Mesh(new THREE.CylinderGeometry(0.058,0.058,0.03,40),new THREE.MeshStandardMaterial({color:0xb9bec7,metalness:1,roughness:.25}));
    ring.rotation.x=Math.PI/2; ring.position.set(x,y,0.025); camG.add(ring); const lens=new THREE.Mesh(new THREE.SphereGeometry(0.045,32,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshPhysicalMaterial({color:0x05070c,metalness:.2,roughness:.02,clearcoat:1}));
    lens.rotation.x=Math.PI/2; lens.scale.set(1,0.35,1); lens.position.set(x,y,0.04); camG.add(lens); });
  camG.position.set(-0.17,0.52,0); const cams=add(camG,-0.03);
  const bat=add(new THREE.Mesh(rbox(0.58,0.86,0.05,0.04),new THREE.MeshStandardMaterial({color:0x2b2f36,metalness:.35,roughness:.45,
     map:canvasTex(256,384,(g,w,h)=>{ g.fillStyle='#2b2f36'; g.fillRect(0,0,w,h); g.fillStyle='#3a404a'; g.fillRect(16,16,w-32,h-32); g.fillStyle='#9aa3ae'; g.font='bold 26px sans-serif'; g.fillText('Li-ion',26,56); g.fillStyle='#5a616b'; g.fillRect(26,70,120,6); })})),0.03);
  bat.children[0].position.y=-0.22;
  const brd=new THREE.Group(); const pcb=new THREE.Mesh(rbox(0.62,0.5,0.015,0.04),new THREE.MeshStandardMaterial({color:0x0f3b2a,metalness:.3,roughness:.5}));
  brd.add(pcb); const chip=new THREE.Mesh(rbox(0.16,0.16,0.03,0.015),new THREE.MeshStandardMaterial({color:0x111214,metalness:.6,roughness:.3})); chip.position.set(0.08,0.02,0.02); brd.add(chip);
  [[-0.18,0.12,0.12,0.06],[-0.18,-0.06,0.09,0.09],[0.22,-0.15,0.1,0.05],[0.24,0.16,0.06,0.1]].forEach(([x,y,w,h])=>{ const c=new THREE.Mesh(rbox(w,h,0.02,0.01),new THREE.MeshStandardMaterial({color:0x1a1c20,metalness:.5,roughness:.35})); c.position.set(x,y,0.015); brd.add(c); });
  const gold=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.02,0.01),new THREE.MeshStandardMaterial({color:0xd4a64a,metalness:1,roughness:.3})); gold.position.set(-0.05,-0.2,0.012); brd.add(gold);
  brd.position.y=0.42; const board=add(brd,0.09);
  const frame=add(new THREE.Mesh(rframe(W,H,0.07,Rr,0.025),new THREE.MeshStandardMaterial({color:0xc8ccd2,metalness:1,roughness:.22})),0.0);
  const scr=canvasTex(512,1066,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#ff6a3d'); gr.addColorStop(.45,'#7b2cff'); gr.addColorStop(1,'#0a3cff'); g.fillStyle=gr; g.fillRect(0,0,w,h);
     g.fillStyle='rgba(255,255,255,.9)'; g.font='bold 120px sans-serif'; g.fillText('9:41',120,240); g.fillStyle='rgba(255,255,255,.25)'; for(let i=0;i<4;i++)for(let j=0;j<5;j++){ g.beginPath(); g.roundRect?g.roundRect(60+i*105,520+j*105,80,80,20):g.rect(60+i*105,520+j*105,80,80); g.fill(); } });
  const disp=add(new THREE.Mesh(rbox(W-0.04,H-0.04,0.012,Rr-0.02),[new THREE.MeshStandardMaterial({map:scr,emissive:0xffffff,emissiveMap:scr,emissiveIntensity:.9,roughness:.4}),new THREE.MeshStandardMaterial({color:0x050505})]),0.15);
  // map the front face UVs of the display (ExtrudeGeometry uses shape coords as UV)
  { const g=disp.children[0].geometry, uv=g.attributes.uv, p=g.attributes.position; for(let i=0;i<uv.count;i++){ uv.setXY(i,(p.getX(i)+(W-0.04)/2)/(W-0.04),(p.getY(i)+(H-0.04)/2)/(H-0.04)); } uv.needsUpdate=true; }
  const glass=add(new THREE.Mesh(rbox(W,H,0.012,Rr),new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:0.02,transparent:true,opacity:0.18,clearcoat:1,envMapIntensity:2})),0.21);
  const sh=shadowPlane(3,3,.55); sh.position.y=-1.05; sc.add(sh);
  const LBL=[[glass,0.33,0],[disp,0.3,0.1],[frame,0.37,-0.3],[board,0.31,0],[bat,0.29,-0.22],[cams,0.0,0.7]];
  SCN[0]=function(lt){ const e=easeIO(cl((lt-0.9)/1.6)); const spread=e*1.0;
    parts.forEach(p=>{ p.position.z=p.userData.z*(1+spread*5.5); });
    ph.rotation.set(-0.95+0.15*e,-0.62+0.25*cl(lt/5),-0.35); ph.position.set(-0.02,0.0+0.04*Math.sin(lt*1.2),0); ph.scale.setScalar(0.7);
    cam.position.set(0,0.1,8.2-0.6*ease(lt/3)); cam.lookAt(0,0.05,0); ren.render(sc,cam);
    layoutLabels([1,2,3,4,5].map((i,j)=>[document.getElementById('l0_'+i),LBL[i][0],cl((lt-1.9-j*0.18)/0.25),LBL[i][1],LBL[i][2]*0.5]),cam,660,100);
    ['l0_0','l0_6'].forEach(id=>document.getElementById(id).style.opacity=0); caption(0,lt); };
})();

// ---------- S1 wireless charging
(function(){ const ren=mkRenderer('cv1'), sc=new THREE.Scene(); sc.environment=studioEnv(ren);
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100); const key=new THREE.DirectionalLight(0xffffff,1.4); key.position.set(-3,5,3); sc.add(key);
  const pad=new THREE.Mesh(new THREE.CylinderGeometry(0.62,0.66,0.09,64),new THREE.MeshPhysicalMaterial({color:0xf2f2f0,roughness:.35,clearcoat:.6}));
  const padTop=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.012,64),new THREE.MeshStandardMaterial({color:0xdcdcda,roughness:.8})); padTop.position.y=0.05; const padG=new THREE.Group(); padG.add(pad,padTop); sc.add(padG);
  const phone=new THREE.Mesh(rbox(0.74,1.54,0.08,0.11),new THREE.MeshPhysicalMaterial({color:0x1d2430,metalness:.2,roughness:.2,clearcoat:1}));
  phone.rotation.x=-Math.PI/2; const phG=new THREE.Group(); phG.add(phone); sc.add(phG);
  const coilMat=new THREE.MeshStandardMaterial({color:0xc87533,metalness:1,roughness:.28,emissive:0x2a0e00});
  function coil(r0,r1,turns){ const pts=[]; const N=turns*60; for(let i=0;i<=N;i++){ const a=i/60*Math.PI*2, r=r0+(r1-r0)*i/N; pts.push(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r)); }
    return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),N,0.012,8,false),coilMat); }
  const txC=coil(0.08,0.42,9); sc.add(txC); const rxC=coil(0.07,0.36,8); sc.add(rxC);
  const fieldMat=new THREE.MeshBasicMaterial({color:0x5ab4ff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
  const field=new THREE.Group(); sc.add(field);
  for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; const pts=[]; for(let j=0;j<=24;j++){ const u=j/24; const r=0.1+0.42*Math.sin(u*Math.PI); pts.push(new THREE.Vector3(Math.cos(a)*r,u,Math.sin(a)*r)); }
    const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,0.008,6,false),fieldMat); field.add(m); }
  const dots=[]; const dotMat=new THREE.MeshBasicMaterial({color:0xbfe4ff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
  for(let i=0;i<40;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.016,8,8),dotMat); m.userData={a:i/40*Math.PI*2*3.7,o:i/40}; field.add(m); dots.push(m); }
  const sh=shadowPlane(3,3,.5); sh.position.y=-0.06; sc.add(sh);
  const lab=[new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D()]; lab.forEach(o=>sc.add(o));
  SCN[1]=function(lt){ const e=easeIO(cl((lt-0.7)/1.3)); const lift=0.12+e*1.15;
    phG.position.y=lift; const ce=cl((lt-1.0)/0.8);
    txC.position.y=0.06+ce*0.18; txC.scale.setScalar(0.6+0.4*ease(ce)); rxC.position.y=lift-0.06-ce*0.2; rxC.scale.setScalar(0.6+0.4*ease(ce));
    txC.visible=rxC.visible=ce>0.01; field.position.y=txC.position.y; field.scale.y=Math.max(0.01,rxC.position.y-txC.position.y);
    const fa=cl((lt-1.6)/0.5); fieldMat.opacity=fa*(0.35+0.25*Math.sin(lt*9)); dotMat.opacity=fa;
    dots.forEach(d=>{ const u=((lt*0.7+d.userData.o)%1); const r=0.1+0.42*Math.sin(u*Math.PI); const a=d.userData.a; d.position.set(Math.cos(a)*r,u,Math.sin(a)*r); d.scale.set(1,1/field.scale.y,1); });
    coilMat.emissiveIntensity=1+fa*2*(0.5+0.5*Math.sin(lt*9));
    const sc0=0.85; padG.scale.setScalar(sc0); txC.scale.multiplyScalar(sc0); rxC.scale.multiplyScalar(sc0);
    sc.rotation.y=-0.4+0.35*cl(lt/5);
    cam.position.set(0,2.4,6.1-0.5*ease(lt/3)); cam.lookAt(0.15,0.6,0); ren.render(sc,cam);
    lab[0].position.set(0.3,rxC.position.y,0.1); lab[1].position.set(0.42,(rxC.position.y+txC.position.y)/2,0.1); lab[2].position.set(0.33,txC.position.y,0.1);
    layoutLabels([0,1,2].map(i=>[document.getElementById('l1_'+i),lab[i],cl((lt-1.8-i*0.25)/0.25)]),cam,750,110);
    caption(1,lt); };
})();

// ---------- S2 noise-cancelling headphones
(function(){ const ren=mkRenderer('cv2'), sc=new THREE.Scene(); sc.environment=studioEnv(ren);
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100); const key=new THREE.DirectionalLight(0xffffff,1.5); key.position.set(3,4,5); sc.add(key);
  const cup=new THREE.Group(); sc.add(cup);
  const shellPts=[]; for(let i=0;i<=20;i++){ const a=i/20*Math.PI/2; shellPts.push(new THREE.Vector2(0.001+0.62*Math.cos(a)*1.0, -0.28*Math.sin(a))); }
  const shell=new THREE.Mesh(new THREE.LatheGeometry(shellPts.map(p=>new THREE.Vector2(p.x,p.y)),64),new THREE.MeshPhysicalMaterial({color:0x2a2d33,roughness:.42,metalness:.15,clearcoat:.4,side:THREE.DoubleSide}));
  shell.rotation.x=Math.PI/2; const shellG=new THREE.Group(); shellG.add(shell); cup.add(shellG);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(0.6,0.03,16,80),new THREE.MeshStandardMaterial({color:0xb9bec7,metalness:1,roughness:.25})); shellG.add(ring);
  const cush=new THREE.Mesh(new THREE.TorusGeometry(0.47,0.13,32,80),new THREE.MeshStandardMaterial({color:0x17181b,roughness:.9})); const cushG=new THREE.Group(); cushG.add(cush); cup.add(cushG);
  const drvPts=[new THREE.Vector2(0.02,0.0),new THREE.Vector2(0.12,0.02),new THREE.Vector2(0.38,0.12),new THREE.Vector2(0.44,0.13),new THREE.Vector2(0.44,0.16)];
  const cone=new THREE.Mesh(new THREE.LatheGeometry(drvPts,64),new THREE.MeshStandardMaterial({color:0xd8dade,metalness:.5,roughness:.3,side:THREE.DoubleSide}));
  cone.rotation.x=-Math.PI/2; const mag=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,0.1,40),new THREE.MeshStandardMaterial({color:0x6d727a,metalness:1,roughness:.3})); mag.rotation.x=Math.PI/2; mag.position.z=-0.07;
  const drvG=new THREE.Group(); drvG.add(cone,mag); cup.add(drvG);
  const chipG=new THREE.Group(); const pcb=new THREE.Mesh(rbox(0.34,0.22,0.02,0.03),new THREE.MeshStandardMaterial({color:0x0f3b2a,metalness:.3,roughness:.5}));
  const ch=new THREE.Mesh(rbox(0.1,0.1,0.03,0.01),new THREE.MeshStandardMaterial({color:0x111214,metalness:.6,roughness:.3})); ch.position.z=0.02; chipG.add(pcb,ch); cup.add(chipG);
  const micG=new THREE.Group(); const mic=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.06,32),new THREE.MeshStandardMaterial({color:0xb9bec7,metalness:1,roughness:.3})); mic.rotation.x=Math.PI/2;
  const mesh=new THREE.Mesh(new THREE.CircleGeometry(0.04,32),new THREE.MeshStandardMaterial({color:0x111111,roughness:.8})); mesh.position.z=0.031; micG.add(mic,mesh); cup.add(micG);
  // waves (screen-facing lines)
  function waveLine(color){ const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(200*3),3));
    const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(),new THREE.Vector3(1,0,0)),1,0.01,4),new THREE.MeshBasicMaterial({color})); return {color}; }
  const mkWave=(col)=>{ const mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0}); const m=new THREE.Mesh(new THREE.BufferGeometry(),mat); sc.add(m); return m; };
  const wNoise=mkWave(0xff5a3c), wAnti=mkWave(0x4aa8ff), wSum=mkWave(0xffffff);
  function setWave(m,x0,x1,y,amp,phase,flip){ const pts=[]; for(let i=0;i<=120;i++){ const u=i/120, x=x0+(x1-x0)*u; pts.push(new THREE.Vector3(x,y+(flip?-1:1)*amp*Math.sin(u*Math.PI*6+phase),0.9)); }
    m.geometry.dispose(); m.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),160,0.012,6,false); }
  const sh=shadowPlane(3,3,.45); sh.position.y=-1.1; sc.add(sh);
  SCN[2]=function(lt){ const e=easeIO(cl((lt-0.6)/1.4));
    cushG.position.z=0.12+e*0.9; drvG.position.z=0.02+e*0.45; chipG.position.z=-0.06+e*0.0; shellG.position.z=-0.18-e*0.45; micG.position.set(0.3,0.5+e*0.3,-0.2-e*0.75);
    chipG.position.set(-0.05,-0.05-e*0.05,-0.06-e*0.05);
    cup.rotation.set(0.2,-1.05+0.3*cl(lt/5),0.05); cup.position.set(0.12,-0.35,0); cup.scale.setScalar(0.58);
    const wa=cl((lt-1.6)/0.4); const cancel=easeIO(cl((lt-2.6)/0.9));
    [wNoise,wAnti].forEach(m=>m.material.opacity=wa*(1-0.85*cancel)); wSum.material.opacity=cl((lt-2.6)/0.3);
    setWave(wNoise,-0.8,0.8,0.62,0.07,lt*8,false); setWave(wAnti,-0.8,0.8,0.62,0.07*(cl((lt-1.9)/0.4)),lt*8,true); setWave(wSum,-0.8,0.8,0.62,0.07*(1-cancel),lt*8,false);
    cam.position.set(0,0.35,6.4-0.5*ease(lt/3)); cam.lookAt(0,0.1,0); ren.render(sc,cam);
    layoutLabels([micG,chipG,drvG].map((o,i)=>[document.getElementById('l2_'+i),o,cl((lt-1.4-i*0.25)/0.25)]),cam,720,120);
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
F2('#e2',{opacity:0,scale:1.5},{opacity:1,scale:1,duration:.4,ease:'back.out(1.8)'},S[37]-0.1);
F2('#e3',{opacity:0,y:30},{opacity:1,y:0,duration:.35,ease:A},END+0.4);
[0,1,2].forEach(k=>F2('#th'+k,{opacity:0,y:200,rotation:(k-1)*8},{opacity:1,y:0,rotation:(k-1)*3,duration:.55,ease:'back.out(1.4)'},END+0.3+k*0.1));
F2('#handle',{opacity:0},{opacity:1,duration:.3},END+0.5);
tl.set(['#end','#e1','#e2','#e3','#th0','#th1','#th2','#handle'],{opacity:0},0);
"""
JS = JS.replace("__TY__", json.dumps(TY)).replace("__KP__", json.dumps(KEYPOS)).replace("__CMD__", CMD).replace("__END__", str(END))
F.write(CSS, JS, music_vol=0.10)
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
