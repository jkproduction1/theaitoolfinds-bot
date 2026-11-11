"""gtamap22 v2 - tutorial "How to make this GTA 6 map animation using Claude" (Jan, live, 2026-11-11). v1 (map stays under the steps) =
build_v1.py. v2: the flight plays only under the hook; then the map MORPHS into the reference chip of a clean white chat UI, the steps
pop and morph on a light background, at "you're done" the result tile morphs back to full screen. No pauses between sentences, voice
sped up 8 %. Keyword GTA, no music (Jan adds it in Instagram). Map = GTA-style transition over a code-drawn satellite-look landscape
(real Florida coastline; not a copy of the game's map, no Rockstar art/logo). Chat UI = our own generic design. Made with Claude Fable 5.2."""
import json, shutil, subprocess, sys, html
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, FOLLOW_LINE

W = HERE.parent.parent / "work" / "gtamap22"
A = W / "assets"
for f in (HERE / "media").iterdir():
    shutil.copy(f, A / f.name)

TEMPO = 1.08
if not (A / "voice_raw.mp3").exists():
    shutil.copy(A / "voice.mp3", A / "voice_raw.mp3"); shutil.copy(A / "voice.json", A / "voice_raw.json")
vw = json.loads((A / "voice_raw.json").read_text())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(A / "voice_raw.mp3"), "-af", f"atempo={TEMPO}", "-ar", "44100", str(A / "voice.mp3")], check=True)
for w in vw:
    w["start"] /= TEMPO; w["end"] /= TEMPO
(A / "voice.json").write_text(json.dumps(vw))

F = Film(W, (HERE / "script.txt").read_text(), A / "voice.json", tail=1.1)
F.scenes([0])
S, E = F.S, F.E
T1 = 3.7
S1, S2, S3, CTA = round(S[10] - 0.12, 3), round(S[15] - 0.12, 3), round(S[25] - 0.12, 3), round(S[33] - 0.12, 3)
END = round(F.dur + 1, 3)
DONE = round(S[30] - 0.05, 3)             # "and you're done": the result morphs back to full screen
TM = {"S1": S1, "S2": S2, "S3": S3, "END": END, "DONE": DONE, "r0": round((T1 + 0.15) / (S1 + 0.1), 4), "r1": round((T1 + 0.6) / (F.dur - 0.25 - DONE), 4), "CTA": CTA,
      "pick": round(S[17], 3), "paste": round(S[22], 3), "fix": round(S[25] + 0.05, 3), "fixe": round(E[29], 3)}
for t, k in [(0.0, "whoosh"), (S1, "whoosh"), (S1 + 0.5, "pop"), (S2, "pop"), (TM["pick"], "click"), (TM["paste"], "pop"), (S3, "pop"), (DONE, "whoosh"), (DONE + 0.35, "pop"), (CTA, "pop")]:
    F.sfx.append((t, k))
FIX = "make the clouds softer"
for i in range(0, len(FIX), 2): F.sfx.append((TM["fix"] + (TM["fixe"] - TM["fix"]) * i / len(FIX), "tick"))

PROMPT = ("Make a 9:16 map-transition animation like my reference clip: start close over a coastal city, pull back above the clouds, "
          "glide along the islands and descend on the last one. Satellite look, layered clouds with parallax, smooth easing…")
SPARK = '<svg viewBox="0 0 100 100"><path fill="#ff5a2b" d="M50 6l9 33 33 11-33 11-9 33-9-33L8 50l33-11z"/></svg>'
body = ('<div id="bg"><div class="bl" id="bl0"></div><div class="bl" id="bl1"></div><div class="bl" id="bl2"></div></div><div id="fl"><div id="ui">'
        + "".join(f'<div class="cap" id="cap{k}"><i>{k}</i><span>{t}</span></div>' for k, t in ((1, "Upload a reference clip"), (2, "Pick Fable 5.2, paste the prompt"), (3, "Tell Claude what to fix")))
        + '<div id="panel"><div id="ph">' + SPARK + '<b>Claude</b><div id="mchip"><span id="mname">Choose model</span></div></div>'
        '<div id="inp"><div id="file"><div id="slot"></div><div><b>reference.mp4</b><span>video · 25 s</span></div><div class="ok">✓</div></div>'
        '<div id="ptxt">' + html.escape(PROMPT) + '</div><div id="fix"><span id="fixt"></span></div><div class="snd" id="snd"></div></div></div>'
        '<div id="donep">✓ Done</div></div>'
        '<div class="stage" id="st0"><canvas id="cv0" width="1080" height="1920"></canvas></div></div>'
        '<div id="hook"><span>How to make this</span><b>GTA 6 map animation</b><em>' + SPARK + 'using Claude</em></div>')
cta = ('<div id="cta"><div class="c1">Comment</div><div class="c2">“GTA”</div><div class="c3">and I\'ll send you the prompt</div></div>')
thumbs = "".join(f'<div class="th2" id="th{k}" style="left:{x}px"><img src="assets/th{k}.jpg" alt=""></div>' for k, x in enumerate([90, 400, 710]))
end = ('<div id="end">' + SPARK + '<div class="c" id="e1">Comment</div><div class="kw" id="e2">“GTA”</div>'
       '<div class="g" id="e3">and I\'ll send you the prompt</div>' + thumbs +
       FOLLOW_LINE.replace('class="follow"', 'class="follow" id="efol" style="top:1440px;color:#fff"') + '</div>')
F.clip(0, body + cta)

CSS = r"""
:root{--paper:#f3efe8}
html,body,#root{background:#f3efe8!important}
#grid,#stars,#grain,#vig{display:none}
#handle{top:1720px;font-size:30px;padding:10px 28px;opacity:0;z-index:50}
#bg{position:absolute;inset:0;background:#f3efe8;overflow:hidden}
#fl{position:absolute;inset:0;transform-origin:540px 1000px}
.bl{position:absolute;border-radius:50%;filter:blur(90px);opacity:.8}
#bl0{width:700px;height:700px;left:-200px;top:120px;background:#ffd2bd}#bl1{width:760px;height:760px;right:-260px;top:900px;background:#cfe3ff}#bl2{width:560px;height:560px;left:200px;top:1400px;background:#ffe9b0}
.stage{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden;transform-origin:0 0;z-index:20;border-radius:0;box-shadow:0 30px 80px rgba(0,0,0,.35)}
.stage canvas{position:absolute;inset:0;width:1080px;height:1920px}
#ui{position:absolute;inset:0;font-family:var(--sans);color:#16181c;z-index:10}
#hook{position:absolute;left:60px;right:60px;top:150px;text-align:center;text-shadow:0 4px 30px rgba(0,0,0,.75);z-index:25;color:#fff;font-family:var(--sans)}
#hook span{display:block;font-weight:600;font-size:54px;letter-spacing:-.01em;color:rgba(255,255,255,.92)}
#hook b{display:block;font-weight:900;font-size:86px;letter-spacing:-.035em;line-height:1.05;margin-top:6px}
#hook em{display:inline-flex;align-items:center;gap:12px;font-style:normal;font-weight:700;font-size:40px;margin-top:20px;background:rgba(6,14,24,.62);border:1.5px solid rgba(255,255,255,.38);border-radius:40px;padding:10px 28px 10px 20px;text-shadow:none}
#hook em svg{width:38px;height:38px}
.cap{position:absolute;left:60px;right:40px;top:400px;display:flex;align-items:center;gap:26px;opacity:0}
.cap i{font-style:normal;flex:none;width:104px;height:104px;border-radius:50%;background:#ff5a2b;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:62px}
.cap span{font-weight:900;font-size:66px;letter-spacing:-.035em;line-height:1.04}
#panel{position:absolute;left:54px;right:54px;top:640px;height:820px;background:#fff;border-radius:56px;box-shadow:0 40px 100px rgba(60,40,20,.18),0 0 0 1.5px rgba(0,0,0,.06);padding:36px 38px;transform-origin:50% 50%}
#ph{display:flex;align-items:center;gap:16px;font-size:44px}#ph svg{width:52px;height:52px}#ph b{font-weight:800}
#mchip{margin-left:auto;background:#f1eee9;border:2px solid #e2ddd5;border-radius:36px;padding:12px 28px;font-weight:700;font-size:34px;color:#6b665e;transform-origin:100% 50%}
#inp{position:absolute;left:38px;right:38px;top:136px;bottom:38px;background:#f6f4f0;border:2px solid #e8e3db;border-radius:40px;padding:28px 30px}
#file{display:flex;align-items:center;gap:24px;background:#fff;border:2px solid #e8e3db;border-radius:30px;padding:18px 26px 18px 18px;width:600px;opacity:0;box-shadow:0 10px 30px rgba(60,40,20,.08)}
#slot{width:90px;height:160px;border-radius:18px;background:#dfe7ee;flex:none}
#file b{display:block;font-size:40px;font-weight:800}#file span{display:block;font-size:30px;color:#8a857d;margin-top:4px}
#file .ok{margin-left:auto;width:60px;height:60px;border-radius:50%;background:#2fbf71;color:#fff;font-weight:900;font-size:36px;display:flex;align-items:center;justify-content:center;opacity:0}
#ptxt{font-size:35px;line-height:1.32;color:#23262b;opacity:0;margin-top:26px;padding-right:20px}
#fix{position:absolute;left:30px;bottom:30px;right:130px;height:84px;background:#fff;border:2px solid #e8e3db;border-radius:42px;display:flex;align-items:center;padding:0 30px;font-size:36px;font-weight:600;opacity:0}
#inp .snd{position:absolute;right:26px;bottom:30px;width:84px;height:84px;border-radius:50%;background:#16181c}
#inp .snd::after{content:'';position:absolute;left:29px;top:22px;border-bottom:26px solid #fff;border-left:13px solid transparent;border-right:13px solid transparent}
#inp .snd::before{content:'';position:absolute;left:40px;top:42px;width:4px;height:22px;background:#fff}
#donep{position:absolute;left:50%;top:150px;transform:translateX(-50%);background:#2fbf71;color:#fff;font-weight:900;font-size:64px;padding:16px 46px;border-radius:60px;opacity:0;z-index:26;box-shadow:0 20px 50px rgba(0,0,0,.4)}
#cta{position:absolute;left:70px;right:70px;top:230px;text-align:center;font-family:var(--sans);color:#fff;z-index:27;background:rgba(6,14,24,.66);border:1.5px solid rgba(255,255,255,.38);border-radius:56px;padding:34px 20px 40px;opacity:0;box-shadow:0 30px 80px rgba(0,0,0,.5)}
#cta .c1{font-weight:800;font-size:78px}#cta .c2{font-weight:900;font-size:170px;color:#ff5a2b;letter-spacing:-.04em;line-height:1.02}#cta .c3{font-weight:700;font-size:46px;margin-top:6px}
#end{position:absolute;inset:0;background:#0a0f16;opacity:0;font-family:var(--sans);z-index:30}
#end svg{position:absolute;left:490px;top:300px;width:100px;height:100px}
#end .c{position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:800;font-size:90px;color:#fff}
#end .kw{position:absolute;left:0;right:0;top:520px;text-align:center;font-weight:900;font-size:160px;color:#ff4b1f;letter-spacing:-.04em}
#end .g{position:absolute;left:0;right:0;top:720px;text-align:center;font-weight:800;font-size:56px;color:#fff}
.th2{position:absolute;top:900px;width:280px;height:430px;border-radius:24px;overflow:hidden;background:#222;box-shadow:0 30px 60px rgba(0,0,0,.7),0 0 0 2px #2a2a2a}
.th2 img{width:100%;height:100%;object-fit:cover}
"""

JS = r"""
const TM=__TM__, FIX='__FIX__'; const SCN=[];
__SCENES__
const fixt=document.getElementById('fixt'), flEl=document.getElementById('fl'), BL=[0,1,2].map(i=>document.getElementById('bl'+i)); let lastN=-1;
const ss=(a,b,x)=>{ x=(x-a)/(b-a); x=x<0?0:x>1?1:x; return x*x*(3-2*x); };
function apply(t){ const env=ss(TM.S1+0.65,TM.S1+1.05,t)*(1-ss(TM.DONE-0.4,TM.DONE-0.12,t)); flEl.style.transform='translate('+(9*Math.sin(t*2.1+0.5)*env)+'px,'+(16*Math.sin(t*2.7)*env)+'px) rotate('+(0.9*Math.sin(t*1.9+1)*env)+'deg) scale('+(1+0.012*Math.sin(t*3.1)*env)+')';
  BL.forEach((b,i)=>{ b.style.transform='translate('+(220*Math.sin(t*0.9+i*2.1))+'px,'+(200*Math.cos(t*0.75+i*1.3))+'px) scale('+(1+0.25*Math.sin(t*1.1+i))+')'; });
  const rep=t>=TM.DONE; window.CARDA=rep?1:Math.max(0,Math.min(1,(TM.S1-0.25-t)/0.25)); if(t<TM.END+0.3) SCN[0](rep?(t-TM.DONE)*TM.r1:t*TM.r0);
  const n=t<TM.fix?0:Math.min(FIX.length,Math.floor((t-TM.fix)/((TM.fixe-TM.fix)/FIX.length))+1); if(n!==lastN){ lastN=n; fixt.textContent=FIX.slice(0,n); } }
const clock={t:0}; tl.fromTo(clock,{t:0},{t:DUR,duration:DUR,ease:'none',onUpdate:()=>apply(clock.t)},0); apply(0);
const NI={immediateRender:false}; function F2(sel,f,t,at){ return tl.fromTo(sel,f,Object.assign({},t,NI),at); }
// thumbnail slot of the file chip (where the map morphs to)
const SX=54+38+30+18+2, SY=640+136+28+18+2, SSC=90/1080, SR=18/SSC;
tl.set(['.cap','#file .ok','#ptxt','#fix','#donep','#cta','#handle'],{opacity:0},0);
tl.set('#st0',{x:0,y:0,scale:1,borderRadius:0},0); tl.set('#panel',{scale:.6,opacity:0,y:200},0); tl.set('#file',{opacity:1},0);
F2('#hook',{opacity:0,y:-30,scale:.9},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(1.6)'},0.05);
F2('#hook',{opacity:1,y:0,scale:1},{opacity:0,y:-60,scale:.8,duration:.3,ease:'power2.in'},TM.S1-0.22);
// MORPH 1: full-screen map -> the reference thumbnail inside the chat
F2('#panel',{scale:.6,opacity:0,y:200},{scale:1,opacity:1,y:0,duration:.6,ease:'back.out(1.5)'},TM.S1-0.05);
F2('#st0',{x:0,y:0,scale:1,borderRadius:0},{x:SX,y:SY,scale:SSC,borderRadius:SR,duration:.75,ease:'expo.inOut'},TM.S1-0.08);
F2('#file',{scale:.7},{scale:1,duration:.5,ease:'back.out(2.2)'},TM.S1+0.42);
F2('#file .ok',{opacity:0,scale:0},{opacity:1,scale:1,duration:.3,ease:'back.out(2.6)'},TM.S1+0.8);
[[1,TM.S1,TM.S2],[2,TM.S2,TM.S3],[3,TM.S3,TM.DONE]].forEach(([k,a,b])=>{ F2('#cap'+k,{opacity:0,x:120,scale:.9},{opacity:1,x:0,scale:1,duration:.45,ease:'back.out(1.5)'},a+0.1); F2('#cap'+k,{opacity:1,x:0},{opacity:0,x:-140,duration:.22,ease:'power2.in'},b-0.16); });
// step 2: model chip morphs into "Fable 5.2", prompt pops in
F2('#mchip',{scale:1},{scale:1.18,duration:.16,ease:'power2.out'},TM.pick-0.18);
tl.call(()=>{document.getElementById('mname').textContent='Fable 5.2';},null,TM.pick); tl.set('#mchip',{backgroundColor:'#ff5a2b',borderColor:'#ff5a2b',color:'#fff'},TM.pick);
F2('#mchip',{scale:1.18},{scale:1,duration:.5,ease:'elastic.out(1,0.5)'},TM.pick);
F2('#ptxt',{opacity:0,y:40,scale:.92},{opacity:1,y:0,scale:1,duration:.45,ease:'back.out(1.7)'},TM.paste); F2('#inp',{borderColor:'#ff5a2b'},{borderColor:'#e8e3db',duration:.7},TM.paste);
// step 3: follow-up, then MORPH 2: result goes full screen
F2('#fix',{opacity:0,y:40},{opacity:1,y:0,duration:.35,ease:'back.out(1.8)'},TM.S3+0.02); tl.set('#snd',{backgroundColor:'#ff5a2b'},TM.fix);
tl.to('#snd',{scale:.78,duration:.08,yoyo:true,repeat:1},TM.DONE-0.2);
F2('#st0',{x:SX,y:SY,scale:SSC,borderRadius:SR},{x:0,y:0,scale:1,borderRadius:0,duration:.7,ease:'expo.inOut'},TM.DONE-0.1);
F2('#panel',{scale:1,opacity:1},{scale:1.25,opacity:0,duration:.45,ease:'power2.in'},TM.DONE);
F2('#donep',{opacity:0,scale:.4,y:-40},{opacity:1,scale:1,y:0,duration:.4,ease:'back.out(2)'},TM.DONE+0.35);
F2('#donep',{opacity:1,scale:1},{opacity:0,scale:.7,duration:.2},TM.CTA-0.2);
F2('#cta',{opacity:0,scale:.6,y:-60},{opacity:1,scale:1,y:0,duration:.5,ease:'back.out(1.7)'},TM.CTA);
tl.fromTo('#cta .c2',{scale:1},{scale:1.06,duration:.5,ease:'sine.inOut',yoyo:true,repeat:5,immediateRender:false},TM.CTA+0.5);
F2('#handle',{opacity:0},{opacity:1,duration:.3},TM.CTA+0.4);
"""
JS = JS.replace("__SCENES__", (HERE / "scenes.js").read_text()).replace("__TM__", json.dumps(TM)).replace("__FIX__", FIX)
F.write(CSS, JS, music_vol=0.0)
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
print(TM)
