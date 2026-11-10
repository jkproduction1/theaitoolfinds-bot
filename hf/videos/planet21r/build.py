"""planet21r = result-first twin of planet21 (earth8 scenes, keyword PLANET, no music): the 3D result plays from frame 0, "Want this?"
and the chat bar pop up in the first second, then the command is typed over it."""
_DOC = """earth8 - App demo "Type it, get it #8" (Jan live, 2026-11-08), 3 different commands: /zack-d-films what if Earth stopped spinning,
/deep-dive the deepest ocean trench, /scale the Moon versus Earth. All drawn in code (one shared WebGL context). Facts: equator spins at
~1,670 km/h; Challenger Deep ~10,935 m, Everest 8,849 m (fits with ~2 km to spare); Moon 3,474 km vs Earth 12,742 km wide, ~49 Moons
by volume, ~384,400 km apart. DM prompts: prompts.md."""
import json, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, series, FOLLOW_LINE

W = HERE.parent.parent / "work" / "planet21r"
A = W / "assets"
for f in (HERE.parent / "earth8" / "media").iterdir():
    shutil.copy(f, A / f.name)
from PIL import Image
for k in range(3):
    if not (A / f"th{k}.jpg").exists():
        Image.new("RGB", (280, 430), (34, 34, 34)).save(A / f"th{k}.jpg")

# --- gaps after each "this." so the 3D result plays
GAPS = {5: 0.25, 10: 0.5, 17: 0.9, 21: 1.3, 27: 0.25, 30: 0.9}
if not (A / "voice_raw.mp3").exists():
    shutil.copy(A / "voice.mp3", A / "voice_raw.mp3"); shutil.copy(A / "voice.json", A / "voice_raw.json")
vw = json.loads((A / "voice_raw.json").read_text())
cuts = [round(min(vw[i]["end"] + 0.08, (vw[i]["end"] + vw[i + 1]["start"]) / 2 + 0.02), 3) for i in sorted(GAPS)]
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

F = Film(W, (HERE / "script.txt").read_text(), A / "voice.json", tail=1.0)
F.scenes([0])
S, E = F.S, F.E

DEMOS = [  # Type idx, (cmd i0,i1), (prompt i0,i1), 'and' idx, cmd, prompt, title, caption, hi, chip description
    (0, (2, 4), (5, 9), 10, "zack-d-films", "what if Earth stopped spinning", "Earth stops spinning", "Still moving at 1,670 km/h.", 3, "Zack D Films–style 3D short"),
    (14, (16, 17), (18, 21), 22, "deep-dive", "the deepest ocean trench", "ocean trench deep dive", "Everest would fit inside.", 0, "Cinematic deep dive into anything"),
    (26, (28, 28), (29, 32), 33, "scale", "the Moon versus Earth", "Moon vs Earth to scale", "49 Moons fit inside Earth.", 0, "True-to-scale size comparison"),
]
SER = 21
CMD = "zack-d-films"
RSEG = [(0, 6, 10, 3.1), (11, 18, 21, 5.3), (22, 28, 30, 3.3)]   # first word, 'Type' idx, last cmd word, scene length to play
END = round(S[31] - 0.15, 3)
TY, SEG = [], []
for k, ((a0, ti, li, L), D) in enumerate(zip(RSEG, DEMOS)):
    cmd, prompt, cap, hi = D[4], D[5], D[7], D[8]
    T = 0.0 if k == 0 else round(S[a0] - 0.12, 3)
    end = round(S[RSEG[k + 1][0]] - 0.12, 3) if k < 2 else END
    c0, c1 = round(S[ti] - 0.05, 3), round(min(end - 0.7, E[li] + 0.5), 3)
    full = "/" + cmd + " " + prompt
    TY.append({"T": T, "end": end, "cap": cap.split(), "hi": hi, "cmd": cmd, "prompt": prompt})
    SEG.append({"T": T, "end": end, "bar": round(T + 0.18, 3), "c0": c0, "c1": c1, "send": round(c1 + 0.18, 3), "txt": full, "n": len(cmd) + 1, "rate": round(L / (end - T), 4)})
    if k: F.sfx.append((T, "whoosh"))
    F.sfx.append((T + 0.18, "pop")); F.sfx.append((c1 + 0.18, "click"))
    for i in range(0, len(full), 2):
        if full[i] != " ": F.sfx.append((c0 + (c1 - c0) * i / len(full), "tick"))
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

LABELS = [[], [("Mount Everest", "8,849 m tall"), ("Challenger Deep", "about 10,935 m down")], [("Earth", "12,742 km wide"), ("Moon", "3,474 km wide")]]
ui = ['<script src="assets/three.min.js"></script><script src="assets/three-extras.js"></script><script src="assets/studio_exr.js"></script><div class="ui" id="ui">',
      '<div id="sb"><span>9:41</span><span>●●● <i></i></span></div>',
      '<div id="tabs"><span>Chat</span><span class="on">Code</span></div><div id="ctr"><b id="cn">1/3</b></div>',
      '<div id="ub"><span class="c" id="ubc">/zack-d-films</span> <span id="ubt"></span></div><div id="run">' + SPARK + '<span id="runt">Animating…</span></div>',
      '<div id="chipc">' + SPARK + '<div><div class="n" id="chn">/zack-d-films</div><div class="d" id="chd"></div></div></div>',
      '<div id="inp"><span id="it"></span><span class="car"></span><span class="plus">+</span><div class="snd" id="snd"></div></div>',
      '<div id="kbw"><div id="kb"></div><div id="sug"></div>' + "".join(keys_html) + '<div id="pop"></div></div>',
      '<div id="bot">Reply…</div><div id="want">Want this?</div><div id="who">' + SPARK + 'Claude Code</div><div id="bar">' + SPARK + '<div id="bt"><span id="it2"></span><span class="car"></span></div><div class="snd" id="snd2"></div></div></div>']
stages = ""
for k, (a, _c, _p, _a, cmd, prompt, title, cap, hi, desc) in enumerate(DEMOS):
    labs = "".join(f'<div class="lb" id="l{k}_{i}"><i class="ld" id="ld{k}_{i}"></i><b>{n}</b>' + (f'<span>{s}</span>' if s else '') + '</div>'
                   for i, (n, s) in enumerate(LABELS[k]))
    capw = "".join(f'<span class="cw{" hi" if i == hi else ""}" id="c{k}_{i}">{w}</span> ' for i, w in enumerate(cap.split()))
    stages += (f'<div class="stage" id="st{k}"><canvas id="cv{k}" width="1080" height="1920"></canvas>'
               f'<div class="cap">{capw}</div>{labs}'
               f'<div class="ttl"><b>{title}</b><i>with Claude Code</i></div></div>')
thumbs = "".join(f'<div class="th" id="th{k}" style="left:{x}px"><img src="assets/th{k}.jpg" alt=""></div>' for k, x in enumerate([90, 400, 710]))
end = ('<div id="end">' + SPARK + '<div class="c" id="e1">Comment</div><div class="kw" id="e2">“PLANET”</div>'
       '<div class="g" id="e3">and I\'ll send you the prompts</div>' + thumbs + '<div class="series" id="eser" style="left:0;right:0;margin:0 auto;width:fit-content;top:1400px">Type it, get it <b>#'+str(SER)+'</b></div>' + FOLLOW_LINE.replace('class="follow"', 'class="follow" id="efol" style="top:1490px;color:#fff"') + '</div>')
F.body.append('<div class="layer" id="serl">' + series("Type it, get it", SER, x=70, y=116, dark=True) + '</div>')
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

CSS += r"""
.lb{background:rgba(8,9,12,.94);box-shadow:0 6px 24px rgba(0,0,0,.6);z-index:2}
.cap{text-shadow:0 3px 0 rgba(0,0,0,.55),0 6px 26px rgba(0,0,0,.95),0 0 40px rgba(0,0,0,.8)}
.lb span{font-size:30px;color:#dfe5ec}
#st0 .cap{text-shadow:0 2px 0 rgba(0,0,0,.35),0 4px 22px rgba(0,0,0,.6)}
.ttl{padding:22px 0 26px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.72) 25%,rgba(0,0,0,.72) 75%,rgba(0,0,0,0))}
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
  const ord=pts.slice().sort((p,q)=>p.y-q.y); let last=470-minGap; ord.forEach(p=>{ p.ly=Math.max(p.y,last+minGap); last=p.ly; });
  pts.forEach(p=>{ const lx=colX; p.el.style.left=lx+'px'; p.el.style.top=p.ly+'px'; p.el.style.opacity=p.a;
    const ld=p.el.querySelector('.ld'); const dx=p.x-lx, dy=p.y-(p.ly)+0; const len=Math.hypot(dx,dy);
    ld.style.width=len+'px'; ld.style.left='0px'; ld.style.transform='rotate('+Math.atan2(dy,dx)+'rad)'; ld.style.transformOrigin='0 50%'; }); }
function caption(k,lt){ const d=TY[k]; d.cap.forEach((w,i)=>{ const el=document.getElementById('c'+k+'_'+i); const a=cl((lt-0.25-i*0.16)/0.18); el.style.opacity=a; el.style.transform='translateY('+((1-a)*14)+'px)'; }); }

__SCENES__
// ================= result-first timeline =================
const SEG=__SEG__; const it2=document.getElementById('it2'); let lastKey='';
function apply(t){
  let k=0; for(let i=0;i<SEG.length;i++){ if(SEG[i].T<=t) k=i; } const d=SEG[k];
  let n=0; if(t>=d.c0) n=Math.min(d.txt.length,Math.floor((t-d.c0)/((d.c1-d.c0)/d.txt.length))+1);
  const key=k+'|'+n; if(key!==lastKey){ lastKey=key; const s=d.txt.slice(0,n); it2.innerHTML=n?('<span class="cmd">'+s.slice(0,d.n)+'</span>'+s.slice(d.n)):'<span style="color:#777">Ask Claude…</span>'; cn.textContent=(k+1)+'/3'; }
  if(t<END+0.05) SCN[k]((t-d.T)*d.rate);
}
const clock={t:0}; tl.fromTo(clock,{t:0},{t:DUR,duration:DUR,ease:'none',onUpdate:()=>apply(clock.t)},0); apply(0);
const NI={immediateRender:false}; function F2(sel,f,t,at){ return tl.fromTo(sel,f,Object.assign({},t,NI),at); }
tl.set(['#st1','#st2'],{opacity:0},0); tl.set('#st0',{opacity:1,scale:1,y:0,borderRadius:0},0); tl.set('#bar',{y:460,opacity:0},0); tl.set(['#want','#who'],{opacity:0},0);
SEG.forEach((d,k)=>{
  if(k){ tl.set('#st'+(k-1),{opacity:0},d.T); F2('#st'+k,{opacity:1,scale:1.08,y:0,borderRadius:0},{opacity:1,scale:1,duration:.45,ease:'power3.out'},d.T); }
  F2('#bar',{y:460,opacity:0},{y:0,opacity:1,duration:.38,ease:'back.out(1.5)'},d.bar);
  F2('#who',{opacity:0,y:30},{opacity:1,y:0,duration:.3,ease:'back.out(1.6)'},d.bar+0.12);
  F2('#want',{opacity:0,scale:.3,rotation:-14},{opacity:1,scale:1,rotation:-4,duration:.4,ease:'back.out(2.2)'},d.T+0.08);
  F2('#want',{opacity:1,scale:1},{opacity:0,scale:.6,duration:.22,ease:'power2.in'},d.c0-0.25);
  F2('#who',{opacity:1},{opacity:0,duration:.2},d.end-0.27);
  tl.set('#snd2',{backgroundColor:'#ff4b1f'},d.c0+0.1);
  tl.to('#snd2',{scale:.8,duration:.07,yoyo:true,repeat:1},d.send-0.07);
  F2('#bar',{scale:1},{scale:1.035,duration:.09,yoyo:true,repeat:1},d.send);
  F2('#bar',{y:0,opacity:1},{y:460,opacity:0,duration:.25,ease:'power3.in'},d.end-0.27);
  tl.set('#snd2',{backgroundColor:'#3a3a3a'},d.end-0.02);
});
F2('#st2',{opacity:1,scale:1},{opacity:0,scale:.9,duration:.25,ease:'power2.in'},END-0.2); tl.set('#ui',{opacity:0},END);
F2('#end',{opacity:0},{opacity:1,duration:.15},END);
F2('#end svg',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.45,ease:'back.out(2)'},END+0.05);
F2('#e1',{opacity:0,y:40},{opacity:1,y:0,duration:.3,ease:A},END+0.02);
F2('#e2',{opacity:0,scale:1.5},{opacity:1,scale:1,duration:.4,ease:'back.out(1.8)'},Math.min(S[32]-0.1,END+0.1));
F2('#e3',{opacity:0,y:30},{opacity:1,y:0,duration:.3,ease:A},END+0.12);
[0,1,2].forEach(k=>F2('#th'+k,{opacity:0,y:200,rotation:(k-1)*8},{opacity:1,y:0,rotation:(k-1)*3,duration:.5,ease:'back.out(1.4)'},END+0.12));
F2('#handle',{opacity:0},{opacity:1,duration:.3},END+0.5);
tl.set(['#end','#e1','#e2','#e3','#th0','#th1','#th2','#handle','#eser','#efol'],{opacity:0},0);
F2('#eser',{opacity:0,y:20},{opacity:1,y:0,duration:.3,ease:A},END+0.6);
F2('#efol',{opacity:0,y:20},{opacity:1,y:0,duration:.3,ease:A},END+0.75);
tl.set('#serl',{opacity:0},END);
"""
JS = JS.replace("__SCENES__", (HERE.parent / "earth8" / "scenes.js").read_text()).replace("__TY__", json.dumps(TY)).replace("__SEG__", json.dumps(SEG)).replace("__KP__", json.dumps(KEYPOS)).replace("__CMD__", CMD).replace("__END__", str(END))
CSS += r"""
#sb,#tabs,#kbw,#inp,#ub,#run,#chipc,#bot,.ttl{display:none!important}
#ui{z-index:10}
#ctr{background:rgba(20,20,20,.78)}
#bar{position:absolute;left:54px;right:54px;top:1548px;min-height:156px;background:rgba(22,22,22,.94);border-radius:38px;border:2px solid #3a3a3a;
 box-shadow:0 24px 60px rgba(0,0,0,.55);display:flex;align-items:center;gap:22px;padding:22px 110px 22px 30px}
#bar svg{width:54px;height:54px;flex:none}
#bt{font-size:43px;line-height:1.22;font-weight:500;letter-spacing:-.01em}
#bt .cmd{color:#ff6a3d;font-weight:700}
#bar .car{display:inline-block;width:4px;height:44px;background:#ff6a3d;vertical-align:-8px;margin-left:3px}
#bar .snd{position:absolute;right:24px;top:50%;margin-top:-35px;width:70px;height:70px;border-radius:50%;background:#3a3a3a}
#bar .snd::after{content:'';position:absolute;left:24px;top:18px;border-bottom:22px solid #fff;border-left:11px solid transparent;border-right:11px solid transparent}
#bar .snd::before{content:'';position:absolute;left:33px;top:34px;width:4px;height:20px;background:#fff}
#want{position:absolute;left:372px;top:96px;background:#fff;color:#111;font-weight:900;font-size:56px;letter-spacing:-.03em;padding:6px 28px 10px;border-radius:22px;box-shadow:0 18px 44px rgba(0,0,0,.5);opacity:0}
#who{position:absolute;right:54px;top:1484px;height:54px;display:flex;align-items:center;gap:10px;background:rgba(22,22,22,.94);border:2px solid #3a3a3a;border-radius:27px;padding:0 22px 0 14px;font-weight:700;font-size:28px;color:#f2f2f2;opacity:0}
#who svg{width:30px;height:30px}
"""
F.write(CSS, JS, music_vol=0.0)   # no music: Jan adds a track in Instagram
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
