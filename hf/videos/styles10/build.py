"""styles10 - "10 Claude animation styles" (Jan's reference 2026-11-05: one red car in 10 styles, the list on the left fills up,
end card "Comment X for the prompts"). Our own version: Paper background, our own 10 styles (Opuscar-like range) and our own car,
every style drawn here in code (canvas 2D + one three.js scene), i.e. a real Claude Code output. Voice only on the end line (like
styles5). Prompts for DM: prompts.md."""
import json, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, FOLLOW_LINE

W = HERE.parent.parent / "work" / "styles10"
A = W / "assets"
for f in (HERE / "media").iterdir():
    shutil.copy(f, A / f.name)
z3 = HERE.parent / "zoom3" / "media"
shutil.copy(z3 / "three.min.js", A / "three.min.js")

STY = ["Pixel RPG", "Watercolor", "Ukiyo-e", "Chalkboard", "Neon Glow", "Blueprint", "Comic Pop", "Papercut", "Claymation", "Low-poly PS1"]
N = len(STY)
THUMBS = [0, 2, 4, 6, 7, 9]

FIRST = [0, 2, 3, 4, 5, 7, 8, 10, 11, 12]          # first word of each style name
GAPS = {1: .3, 2: .3, 3: .3, 4: .3, 6: .3, 7: .3, 9: .3, 10: .3, 11: .3, 14: .45}
if not (A / "voice_raw.mp3").exists():
    shutil.copy(A / "voice.mp3", A / "voice_raw.mp3"); shutil.copy(A / "voice.json", A / "voice_raw.json")
vw = json.loads((A / "voice_raw.json").read_text())
cuts = [round(vw[i]["end"] + 0.06, 3) for i in sorted(GAPS)]
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
TT = [0.0] + [round(vw[i]["start"] - 0.08, 3) for i in FIRST[1:]]
END = round(vw[15]["start"] - 0.12, 3)

from PIL import Image
for k in THUMBS:
    if not (A / f"th{k}.jpg").exists():
        Image.new("RGB", (280, 498), (40, 40, 40)).save(A / f"th{k}.jpg")

F = Film(W, (HERE / "script.txt").read_text(), A / "voice.json", tail=1.0)
F.scenes([0])
S = F.S
for k in range(N):
    F.sfx.append((TT[k], "whoosh")); F.sfx.append((TT[k] + 0.12, "pop"))
F.sfx.append((END, "whoosh"))

SPARK = '<svg viewBox="0 0 100 100"><path fill="#ff4b1f" d="M50 4c3 26 10 36 46 46-36 10-43 20-46 46-3-26-10-36-46-46 36-10 43-20 46-46z"/></svg>'
title = ('<div id="ttl"><div class="l1">10 <i>Claude</i>' + SPARK + '</div><div class="l2">animation styles</div>'
         '<div class="l3">one prompt each</div></div>')
rows = "".join(f'<div class="it" id="it{k}" style="top:{560 + k * 78}px"><b>{k + 1})</b><span class="nm" id="nm{k}"><span>{s}</span></span></div>'
               for k, s in enumerate(STY))
cards = "".join(f'<div class="cd" id="cd{k}" style="z-index:{10 + k}">' +
                (f'<canvas id="cv{k}" width="560" height="996"></canvas>' if k != 9 else
                 '<canvas id="cv9" width="560" height="996" style="display:none"></canvas><canvas id="gl9" width="160" height="284"></canvas>') +
                '</div>' for k in range(N))
pos = [(135, 560), (415, 560), (695, 560), (135, 1020), (415, 1020), (695, 1020)]
thumbs = "".join(f'<div class="th" id="th{j}" style="left:{x}px;top:{y}px"><img src="assets/th{k}.jpg" alt=""></div>'
                 for j, (k, (x, y)) in enumerate(zip(THUMBS, pos)))
end = ('<div id="end"><div class="c" id="e1">Comment <b>“CAR”</b></div><div class="g" id="e2">for every prompt</div>' + thumbs +
       FOLLOW_LINE.replace('class="follow"', 'class="follow" id="efol" style="top:1486px;color:#fff;left:0;right:0;text-align:center"') + '</div>')
F.clip(0, '<script src="assets/three.min.js"></script>' + title + '<div id="list">' + rows + '</div><div id="stack">' + cards + '</div>' + end)

CSS = r"""
#ttl{position:absolute;left:0;right:0;top:170px;text-align:center;color:#111;font-family:var(--sans)}
#ttl .l1{font-weight:800;font-size:112px;letter-spacing:-.04em;line-height:1}
#ttl .l1 i{font-family:var(--serif);font-weight:400;font-style:italic;color:#ff4b1f;letter-spacing:-.02em}
#ttl .l1 svg{width:74px;height:74px;vertical-align:8px;margin-left:8px}
#ttl .l2{font-family:var(--serif);font-style:italic;font-size:92px;line-height:1.05;letter-spacing:-.02em}
#ttl .l3{font-family:var(--mono);font-size:30px;color:#6b6b6b;margin-top:10px}
.it{position:absolute;left:70px;width:370px;height:66px;display:flex;align-items:center;gap:14px;font-family:var(--sans);font-size:36px;color:#111}
.it b{font-family:var(--mono);font-weight:500;font-size:28px;color:#8a8a86;width:48px}
.nm{position:relative;display:inline-block;font-weight:700;padding:2px 10px;border-radius:8px;opacity:0;white-space:nowrap}
.nm span{position:relative;z-index:1}
.nm::before{content:'';position:absolute;inset:0;background:#111;border-radius:8px;transform:scaleX(var(--hl,0));transform-origin:0 50%}
.nm.on{color:#fff}
#stack{position:absolute;left:0;top:0;width:1080px;height:1920px}
.cd{position:absolute;left:450px;top:500px;width:560px;height:996px;border-radius:28px;overflow:hidden;background:#222;opacity:0;
 box-shadow:0 50px 90px rgba(0,0,0,.28),0 12px 24px rgba(0,0,0,.18),0 0 0 2px rgba(0,0,0,.06);transform-origin:50% 60%}
.cd canvas{position:absolute;left:0;top:0;width:560px;height:996px}
#gl9{image-rendering:pixelated}
#end{position:absolute;inset:0;background:#111;opacity:0;font-family:var(--sans);z-index:60}
#end .c{position:absolute;left:0;right:0;top:250px;text-align:center;font-family:var(--serif);font-size:104px;color:#fff;letter-spacing:-.02em}
#end .c b{font-family:var(--serif);font-weight:400;color:#ff4b1f}
#end .g{position:absolute;left:0;right:0;top:380px;text-align:center;font-family:var(--serif);font-size:80px;color:#fff;font-style:italic}
.th{position:absolute;width:250px;height:444px;border-radius:22px;overflow:hidden;background:#222;box-shadow:0 30px 60px rgba(0,0,0,.6),0 0 0 2px #2a2a2a}
.th img{width:100%;height:100%;object-fit:cover}
#handle{z-index:70}
"""

JS = r"""
const NN=__N__, TT=__TT__, END=__END__;
__STYLES__
const T=k=>TT[k]; const DK=k=>(k<NN-1?TT[k+1]:END)-TT[k];
const clock={t:0}; let lastK=-1;
function draw(t){ for(let k=0;k<NN;k++){ const lt=t-T(k); if(lt>=-0.02 && lt<DK(k)+0.65 && t<END+0.05) SC[k](Math.max(0,lt)); } }
tl.fromTo(clock,{t:0},{t:DUR,duration:DUR,ease:'none',onUpdate:()=>draw(clock.t)},0); draw(0);
const NI={immediateRender:false}; function F2(sel,f,t,at){ return tl.fromTo(sel,f,Object.assign({},t,NI),at); }
for(let k=0;k<NN;k++){ const a=T(k), c='#cd'+k, n='#nm'+k;
  tl.set(c,{opacity:0},0); tl.set(n,{opacity:0},0);
  if(k===0) F2(c,{opacity:1,x:0,rotation:0,scale:1},{opacity:1,x:0,rotation:0,scale:1,duration:.01},0);
  else F2(c,{opacity:1,x:640,rotation:12,scale:.92,filter:'blur(14px)'},{x:0,rotation:0,scale:1,filter:'blur(0px)',duration:.55,ease:'expo.out'},a);
  if(k<NN-1){ F2(c,{scale:1,x:0,rotation:0,filter:'brightness(1)'},{scale:.9,x:-40,rotation:-5,filter:'brightness(.75)',duration:.5,ease:'power2.out'},T(k+1)); tl.set(c,{opacity:0},T(k+1)+0.6); }
  F2(n,{opacity:0,x:-24},{opacity:1,x:0,duration:.3,ease:'back.out(2)'},a+0.04);
  tl.set(n,{'--hl':1,className:'nm on'},a);
  if(k<NN-1){ tl.set(n,{'--hl':0,className:'nm'},T(k+1)); }
}
F2('#ttl',{opacity:1},{opacity:1,duration:.01},0);
tl.set('#end',{opacity:0},0); tl.set(['#e1','#e2','#efol','#th0','#th1','#th2','#th3','#th4','#th5'],{opacity:0},0);
F2('#end',{opacity:0},{opacity:1,duration:.2},END);
F2('#e1',{opacity:0,y:40},{opacity:1,y:0,duration:.4,ease:'expo.out'},END+0.08);
F2('#e2',{opacity:0,y:30},{opacity:1,y:0,duration:.4,ease:'expo.out'},END+0.2);
[0,1,2,3,4,5].forEach(j=>F2('#th'+j,{opacity:0,y:160,rotation:(j%2?5:-5)},{opacity:1,y:0,rotation:0,duration:.55,ease:'back.out(1.4)'},END+0.25+j*0.07));
F2('#efol',{opacity:0,y:20},{opacity:1,y:0,duration:.3},END+0.7);
"""
JS = JS.replace("__STYLES__", (HERE / "styles.js").read_text()).replace("__N__", str(N)).replace("__TT__", json.dumps(TT)).replace("__END__", str(END))
F.write(CSS, JS, music_vol=0.13)
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
