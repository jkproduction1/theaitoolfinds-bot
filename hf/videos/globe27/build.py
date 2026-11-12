"""globe27 - Tutorial "How to make this snow globe of your city using Claude" (BRAIN §3e, mix v4; automatic run 2026-11-12, picklist idea
"3D snow globe of your city", no tap -> free idea). Template gtamap22 v3: the result plays full screen under the hook, MORPHS into the tile of
our own neutral white chat panel, 3 steps with word-synced subtitles, morph back at "you're done", "Comment GLOBE" over the moving result.
Result = a Prague snow globe drawn in code with three.js in this repo by Claude Opus 5.5 (scenes.js); city inspired by Prague's roofscape,
simple shapes, no copied artwork or logos. Music t2 (Jan 2026-11-11: always with music) + own soft sfx bus."""
import json, shutil, subprocess, sys, html
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, FOLLOW_LINE

W = HERE.parent.parent / "work" / "globe27"
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
S1, S2, S3, CTA = round(S[11] - 0.12, 3), round(S[16] - 0.12, 3), round(S[26] - 0.12, 3), round(S[35] - 0.12, 3)
END = round(F.dur + 1, 3)
DONE = round(S[32] - 0.05, 3)             # "and you're done": the result morphs back to full screen
TM = {"S1": S1, "S2": S2, "S3": S3, "END": END, "DONE": DONE, "CTA": CTA, "c0": round(S[12], 3), "c1": round(E[15] - 0.1, 3),
      "pick": round(S[18], 3), "paste": round(S[23], 3), "fix": round(S[29] - 0.2, 3), "fixe": round(E[31] - 0.1, 3), "yd": round(DONE + 0.08, 3)}
FIX = "make the snow fall slower"; CITY = "Prague"
PROMPT = ("Make a 3D snow globe of my city in three.js: a glass sphere on a walnut base with a brass name plate, a little winter old town "
          "inside (red roofs, lit windows, the landmarks), snow that swirls and settles, a warm room behind, slow camera orbit…")
CAPS = [  # step, lines of (word index, on-screen text, highlight)
    (1, [[(11, "First,", 0), (12, "type", 0)], [(13, "your", 0), (14, "city's", 1), (15, "name.", 1)]]),
    (2, [[(16, "Then", 0), (17, "pick", 0), (18, "Opus", 1), (19, "5.5", 1)], [(22, "and", 0), (23, "paste", 0), (24, "this", 0), (25, "prompt.", 1)]]),
    (3, [[(26, "Claude", 0), (27, "builds", 1), (28, "it,", 0)], [(29, "you", 0), (30, "tweak", 1), (31, "it,", 0)]]),
]
caps_html = "".join(f'<div class="cap" id="cap{k}"><i>{k}</i><span>' + "<br>".join(" ".join(f'<b class="cw{" hi" if h else ""}" id="cw{i}">{html.escape(t)}</b>' for i, t, h in line) for line in lines) + '</span></div>' for k, lines in CAPS)
CW = [i for _, lines in CAPS for line in lines for i, _, _ in line]
SPARK = '<svg viewBox="0 0 100 100"><path fill="#ff5a2b" d="M50 6l9 33 33 11-33 11-9 33-9-33L8 50l33-11z"/></svg>'
body = ('<script src="assets/three.min.js"></script><script src="assets/three-extras.js"></script><script src="assets/studio_exr.js"></script><div id="bg"><div class="bl" id="bl0"></div><div class="bl" id="bl1"></div><div class="bl" id="bl2"></div></div><div id="fl"><div id="ui">'
        + caps_html
        + '<div id="panel"><div id="ph">' + SPARK + '<b>Claude</b><div id="mchip"><span id="mname">Choose model</span></div></div>'
        '<div id="inp"><div id="file"><div id="slot"></div><div><b id="city"></b><span>your city</span></div><div class="ok">✓</div></div>'
        '<div id="ptxt">' + html.escape(PROMPT) + '</div><div id="prog"></div><div id="fix"><span id="fixt"></span></div><div class="snd" id="snd"></div></div></div>'
        '</div>'
        '<div class="stage" id="st0"><canvas id="cv0" width="1080" height="1920"></canvas></div></div>'
        '<div id="donep">✓ And you\'re done</div><div id="hook"><span>How to make this</span><b>snow globe of your city</b><em>' + SPARK + 'using Claude</em></div>')
cta = ('<div id="cta"><div class="c1">Comment</div><div class="c2">“GLOBE”</div><div class="c3">and I\'ll send you the prompt</div></div>')
thumbs = "".join(f'<div class="th2" id="th{k}" style="left:{x}px"><img src="assets/th{k}.jpg" alt=""></div>' for k, x in enumerate([90, 400, 710]))
end = ('<div id="end">' + SPARK + '<div class="c" id="e1">Comment</div><div class="kw" id="e2">“GLOBE”</div>'
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
.cap span{font-weight:900;font-size:70px;letter-spacing:-.035em;line-height:1.12}
.cw{display:inline-block;font-weight:900;opacity:0}.cw.hi{color:#ff5a2b}
#panel{position:absolute;left:54px;right:54px;top:640px;height:1020px;background:#fff;border-radius:56px;box-shadow:0 40px 100px rgba(60,40,20,.18),0 0 0 1.5px rgba(0,0,0,.06);padding:36px 38px;transform-origin:50% 50%}
#ph{display:flex;align-items:center;gap:16px;font-size:44px}#ph svg{width:52px;height:52px}#ph b{font-weight:800}
#mchip{margin-left:auto;background:#f1eee9;border:2px solid #e2ddd5;border-radius:36px;padding:12px 28px;font-weight:700;font-size:34px;color:#6b665e;transform-origin:100% 50%}
#inp{position:absolute;left:38px;right:38px;top:136px;bottom:38px;background:#f6f4f0;border:2px solid #e8e3db;border-radius:40px;padding:28px 30px}
#file{display:flex;align-items:center;gap:24px;background:#fff;border:2px solid #e8e3db;border-radius:30px;padding:18px 26px 18px 18px;width:600px;opacity:0;box-shadow:0 10px 30px rgba(60,40,20,.08)}
#slot{width:90px;height:160px;border-radius:18px;background:#dfe7ee;flex:none}
#file b{display:block;font-size:40px;font-weight:800}#file span{display:block;font-size:30px;color:#8a857d;margin-top:4px}
#file .ok{margin-left:auto;width:60px;height:60px;border-radius:50%;background:#2fbf71;color:#fff;font-weight:900;font-size:36px;display:flex;align-items:center;justify-content:center;opacity:0}
#ptxt{font-size:41px;line-height:1.34;color:#23262b;opacity:0;margin-top:26px;padding-right:20px}
#prog{position:absolute;left:30px;right:30px;bottom:132px;height:12px;border-radius:6px;background:#ff5a2b;transform-origin:0 50%;transform:scaleX(0);opacity:0}
#fix{position:absolute;left:30px;bottom:30px;right:130px;height:84px;background:#fff;border:2px solid #e8e3db;border-radius:42px;display:flex;align-items:center;padding:0 30px;font-size:36px;font-weight:600;opacity:0}
#inp .snd{position:absolute;right:26px;bottom:30px;width:84px;height:84px;border-radius:50%;background:#16181c}
#inp .snd::after{content:'';position:absolute;left:29px;top:22px;border-bottom:26px solid #fff;border-left:13px solid transparent;border-right:13px solid transparent}
#inp .snd::before{content:'';position:absolute;left:40px;top:42px;width:4px;height:22px;background:#fff}
#donep{position:absolute;left:0;right:0;margin:0 auto;width:fit-content;top:1205px;font-family:var(--sans);background:#2fbf71;color:#fff;font-weight:900;font-size:74px;padding:16px 50px;border-radius:70px;opacity:0;z-index:26;box-shadow:0 20px 50px rgba(0,0,0,.4)}
#cta{position:absolute;left:70px;right:70px;top:172px;text-align:center;font-family:var(--sans);color:#fff;z-index:27;background:rgba(6,14,24,.66);border:1.5px solid rgba(255,255,255,.38);border-radius:56px;padding:22px 20px 28px;opacity:0;box-shadow:0 30px 80px rgba(0,0,0,.5)}
#cta .c1{font-weight:800;font-size:62px;line-height:1.1}#cta .c2{font-weight:900;font-size:140px;color:#ff5a2b;letter-spacing:-.04em;line-height:1.0}#cta .c3{font-weight:700;font-size:40px;margin-top:4px}
#end{position:absolute;inset:0;background:#0a0f16;opacity:0;font-family:var(--sans);z-index:30}
#end svg{position:absolute;left:490px;top:300px;width:100px;height:100px}
#end .c{position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:800;font-size:90px;color:#fff}
#end .kw{position:absolute;left:0;right:0;top:520px;text-align:center;font-weight:900;font-size:160px;color:#ff4b1f;letter-spacing:-.04em}
#end .g{position:absolute;left:0;right:0;top:720px;text-align:center;font-weight:800;font-size:56px;color:#fff}
.th2{position:absolute;top:900px;width:280px;height:430px;border-radius:24px;overflow:hidden;background:#222;box-shadow:0 30px 60px rgba(0,0,0,.7),0 0 0 2px #2a2a2a}
.th2 img{width:100%;height:100%;object-fit:cover}
"""

JS = r"""
const TM=__TM__, FIX='__FIX__', CITY='Prague'; const SCN=[];
__SCENES__
const fixt=document.getElementById('fixt'), flEl=document.getElementById('fl'), BL=[0,1,2].map(i=>document.getElementById('bl'+i)); let lastN=-1, lastC=-1; const cityEl=document.getElementById('city');
const ss=(a,b,x)=>{ x=(x-a)/(b-a); x=x<0?0:x>1?1:x; return x*x*(3-2*x); };
function apply(t){ const env=ss(TM.S1+0.65,TM.S1+1.05,t)*(1-ss(TM.DONE-0.4,TM.DONE-0.12,t)); flEl.style.transform='translate('+(9*Math.sin(t*2.1+0.5)*env)+'px,'+(16*Math.sin(t*2.7)*env)+'px) rotate('+(0.9*Math.sin(t*1.9+1)*env)+'deg) scale('+(1+0.012*Math.sin(t*3.1)*env)+')';
  BL.forEach((b,i)=>{ b.style.transform='translate('+(220*Math.sin(t*0.9+i*2.1))+'px,'+(200*Math.cos(t*0.75+i*1.3))+'px) scale('+(1+0.25*Math.sin(t*1.1+i))+')'; });
  const rep=t>=TM.DONE; if(t<TM.END+0.3) SCN[0](rep?(t-TM.DONE):(t<TM.S1?t:TM.S1+(t-TM.S1)*0.35));
  const nc=t<TM.c0?0:Math.min(CITY.length,Math.floor((t-TM.c0)/((TM.c1-TM.c0)/CITY.length))+1); if(nc!==lastC){ lastC=nc; cityEl.textContent=CITY.slice(0,nc); }
  const n=t<TM.fix?0:Math.min(FIX.length,Math.floor((t-TM.fix)/((TM.fixe-TM.fix)/FIX.length))+1); if(n!==lastN){ lastN=n; fixt.textContent=FIX.slice(0,n); } }
const clock={t:0}; tl.fromTo(clock,{t:0},{t:DUR,duration:DUR,ease:'none',onUpdate:()=>apply(clock.t)},0); apply(0);
const NI={immediateRender:false}; function F2(sel,f,t,at){ return tl.fromTo(sel,f,Object.assign({},t,NI),at); }
// thumbnail slot of the file chip (where the map morphs to)
const SX=54+38+30+18+2, SY=640+136+28+18+2, SSC=90/1080, SR=18/SSC;
tl.set(['.cap','.cw','#file .ok','#ptxt','#fix','#prog','#donep','#cta','#handle'],{opacity:0},0);
tl.set('#st0',{x:0,y:0,scale:1,borderRadius:0},0); tl.set('#panel',{scale:.6,opacity:0,y:200},0); tl.set('#file',{opacity:1},0);
F2('#hook',{opacity:0,y:-30,scale:.9},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(1.6)'},0.05);
F2('#hook',{opacity:1,y:0,scale:1},{opacity:0,y:-60,scale:.8,duration:.3,ease:'power2.in'},TM.S1-0.22);
// MORPH 1: full-screen map -> the reference thumbnail inside the chat
F2('#panel',{scale:.6,opacity:0,y:200},{scale:1,opacity:1,y:0,duration:.6,ease:'back.out(1.5)'},TM.S1-0.05);
F2('#st0',{x:0,y:0,scale:1,borderRadius:0},{x:SX,y:SY,scale:SSC,borderRadius:SR,duration:.75,ease:'expo.inOut'},TM.S1-0.08);
F2('#file',{scale:.7},{scale:1,duration:.5,ease:'back.out(2.2)'},TM.S1+0.42);
F2('#file .ok',{opacity:0,scale:0},{opacity:1,scale:1,duration:.3,ease:'back.out(2.6)'},TM.c1+0.1);
[[1,TM.S1,TM.S2],[2,TM.S2,TM.S3],[3,TM.S3,TM.DONE]].forEach(([k,a,b])=>{ F2('#cap'+k,{opacity:0,x:120,scale:.9},{opacity:1,x:0,scale:1,duration:.3,ease:'back.out(1.5)'},k===1?a-0.02:a+0.1); F2('#cap'+k,{opacity:1,x:0,scale:1},{opacity:0,x:-140,scale:.9,duration:.18,ease:'power2.in'},b-0.12); });
__CW__.forEach(i=>F2('#cw'+i,{opacity:0,y:26,scale:.86},{opacity:1,y:0,scale:1,duration:.22,ease:'back.out(2.2)'},Math.max(0,S[i]-0.05)));
// the hook lines and the CTA lines pulse when they are spoken
[['#hook span',0],['#hook b',4],['#hook em',8]].forEach(([q,i])=>F2(q,{scale:1},{scale:1.07,duration:.15,ease:'power2.out',yoyo:true,repeat:1},S[i]+0.08));
// step 2: model chip morphs into "Fable 5.2", prompt pops in
F2('#mchip',{scale:1},{scale:1.18,duration:.16,ease:'power2.out'},TM.pick-0.18);
tl.call(()=>{document.getElementById('mname').textContent='Opus 5.5';},null,TM.pick); tl.set('#mchip',{backgroundColor:'#ff5a2b',borderColor:'#ff5a2b',color:'#fff'},TM.pick);
F2('#mchip',{scale:1.18},{scale:1,duration:.5,ease:'elastic.out(1,0.5)'},TM.pick);
F2('#ptxt',{opacity:0,y:40,scale:.92},{opacity:1,y:0,scale:1,duration:.45,ease:'back.out(1.7)'},TM.paste); F2('#inp',{borderColor:'#ff5a2b'},{borderColor:'#e8e3db',duration:.7},TM.paste);
// step 3: follow-up, then MORPH 2: result goes full screen
tl.to('#snd',{scale:.78,duration:.08,yoyo:true,repeat:1},TM.S3+0.04); tl.set('#prog',{opacity:1},TM.S3+0.1); F2('#prog',{scaleX:0},{scaleX:1,duration:TM.fix-TM.S3-0.28,ease:'power1.inOut'},TM.S3+0.1); F2('#prog',{opacity:1},{opacity:0,duration:.18},TM.fix-0.16);
F2('#fix',{opacity:0,y:40},{opacity:1,y:0,duration:.3,ease:'back.out(1.8)'},TM.fix-0.14); tl.set('#snd',{backgroundColor:'#ff5a2b'},TM.fix);
tl.to('#snd',{scale:.78,duration:.08,yoyo:true,repeat:1},TM.DONE-0.2);
F2('#st0',{x:SX,y:SY,scale:SSC,borderRadius:SR},{x:0,y:0,scale:1,borderRadius:0,duration:.7,ease:'expo.inOut'},TM.DONE);
F2('#panel',{scale:1,opacity:1},{scale:1.25,opacity:0,duration:.45,ease:'power2.in'},TM.DONE+0.1);
F2('#donep',{opacity:0,scale:.4,y:40},{opacity:1,scale:1,y:0,duration:.4,ease:'back.out(2)'},TM.yd);
F2('#donep',{opacity:1,scale:1},{opacity:0,scale:.8,y:30,duration:.25,ease:'power2.in'},TM.CTA+0.2);
[['#cta .c1',34],['#cta .c3',36]].forEach(([q,i])=>F2(q,{scale:1},{scale:1.08,duration:.15,ease:'power2.out',yoyo:true,repeat:1},S[i]+0.1));
F2('#cta',{opacity:0,scale:.6,y:-60},{opacity:1,scale:1,y:0,duration:.5,ease:'back.out(1.7)'},TM.CTA);
tl.fromTo('#cta .c2',{scale:1},{scale:1.06,duration:.5,ease:'sine.inOut',yoyo:true,repeat:5,immediateRender:false},TM.CTA+0.5);
F2('#handle',{opacity:0},{opacity:1,duration:.3},TM.CTA+0.4);
"""
JS = JS.replace("__SCENES__", (HERE / "scenes.js").read_text()).replace("__TM__", json.dumps(TM)).replace("__FIX__", FIX).replace("__CW__", json.dumps(CW))
F.write(CSS, JS, music_vol=0.12)
# ---------- sound design for this video (no music): airy sweeps for the camera and the morphs, soft UI pops, typing, a chime on "done"
import numpy as np, wave
SR = 44100; rng = np.random.default_rng(7); buf = np.zeros(int((F.dur + 1) * SR))
def put(t, x, g):
    i = int(max(0, t) * SR); x = x[:len(buf) - i]; buf[i:i + len(x)] += x * g
def sweep(dur, f0, f1, shape=2.0):          # band-passed noise whose pitch glides f0 -> f1
    n = int(dur * SR); t = np.arange(n) / SR; x = rng.standard_normal(n); f = f0 * (f1 / f0) ** (t / t[-1]); lp = bp = 0.0; y = np.empty(n)
    for i in range(n):
        w = 2 * np.sin(np.pi * min(f[i], SR / 6.5) / SR); hp = x[i] - lp - 0.8 * bp; bp += w * hp; lp += w * bp; y[i] = bp
    return y / (np.abs(y).max() + 1e-9) * np.sin(np.pi * t / t[-1]) ** shape
def tone(f0, f1, dur, dec):                  # sine blip gliding f0 -> f1
    n = int(dur * SR); t = np.arange(n) / SR; f = f0 + (f1 - f0) * t / t[-1]
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / 0.008) * np.exp(-t / dec)
def chime(notes, gap=0.07, dec=0.28):
    n = int((gap * len(notes) + 1.0) * SR); y = np.zeros(n)
    for k, f in enumerate(notes):
        x = tone(f, f, 0.9, dec) + 0.35 * tone(f * 2, f * 2, 0.9, dec * 0.6); i = int(k * gap * SR); y[i:i + len(x)] += x
    return y
# v4 (Jan: "quieter, pleasant"): low, round sounds only; no high clicks, no per-word blips; the whole bus is low-passed and sits well under the voice
tick = tone(1000, 820, 0.035, 0.007); click = tone(620, 460, 0.06, 0.014) * 0.7 + tone(140, 110, 0.06, 0.02) * 0.6
pop = tone(430, 250, 0.13, 0.045); thup = tone(230, 125, 0.2, 0.065); thump = tone(78, 50, 0.5, 0.15)
put(0.0, sweep(1.4, 260, 900), 0.15); put(0.9, sweep(1.8, 900, 220), 0.10); put(0.05, chime([1046.5, 1318.5], gap=0.11, dec=0.5), 0.035)   # shake + snow swirl
put(S1 - 0.1, sweep(0.7, 1000, 280), 0.18); put(S1 + 0.5, pop, 0.15); put(TM["c1"] + 0.1, chime([784.0], dec=0.16), 0.06)
for i in range(len(CITY)): put(TM["c0"] + (TM["c1"] - TM["c0"]) * i / len(CITY), tick, 0.05)          # morph 1, chip lands, check
put(TM["pick"] - 0.02, click, 0.16); put(TM["pick"] + 0.02, tone(440, 660, 0.12, 0.05), 0.07)
put(TM["paste"], thup, 0.20)
put(S3 + 0.03, click, 0.15); put(S3 + 0.1, sweep(max(0.3, TM["fix"] - S3 - 0.3), 280, 1000, 1.2), 0.07)                      # send + "builds it"
for i in range(len(FIX)):
    if FIX[i] != " ": put(TM["fix"] + (TM["fixe"] - TM["fix"]) * i / len(FIX), tick, 0.05 + 0.02 * rng.random())
put(DONE, sweep(0.8, 240, 1100), 0.20); put(TM["yd"], chime([523.25, 659.25, 783.99], gap=0.08, dec=0.42), 0.11)
put(DONE + 0.4, sweep(1.6, 900, 220), 0.08)                                                                                 # replay swirl
put(CTA, pop, 0.15); put(CTA + 0.02, thump, 0.14)
lp = 0.0; al = 1 - np.exp(-2 * np.pi * 4200 / SR)                                                                           # gentle low-pass on the whole sfx bus
for i in range(len(buf)):
    lp += al * (buf[i] - lp); buf[i] = lp
pk = np.abs(buf).max(); buf = buf * (0.22 / (pk + 1e-9))
with wave.open(str(A / "sfx.wav"), "wb") as wv:
    wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
print(TM)
