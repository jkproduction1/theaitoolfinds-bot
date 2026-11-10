"""styles20r - "result first" twin of styles20 (Jan, live, 2026-11-10): the WOW plays full screen from frame 0, the chat bar
("Claude Fable 5.2") pops up over it in the first second with a "Want this?" sticker, then the command is typed. Scenes come from
hf/videos/styles20/scenes.js. Series "Type it, get it #20"."""
import json, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, series, FOLLOW_LINE

W = HERE.parent.parent / "work" / "styles20r"
A = W / "assets"
for f in (HERE / "media").iterdir():
    shutil.copy(f, A / f.name)

GAPS = {4: 0.8, 8: 1.0, 12: 1.0, 16: 1.2, 20: 1.0, 24: 1.7}   # silence after these words so each result gets ~5.5 s
if not (A / "voice_raw.mp3").exists():
    shutil.copy(A / "voice.mp3", A / "voice_raw.mp3"); shutil.copy(A / "voice.json", A / "voice_raw.json")
vw = json.loads((A / "voice_raw.json").read_text())
def _quiet_cut(i):
    import numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(A / "voice_raw.mp3"), "-f", "s16le", "-ac", "1", "-ar", "44100", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(float)
    lo, hi = vw[i]["end"] + 0.01, max(vw[i]["end"] + 0.02, min(vw[i]["end"] + 0.4, vw[i + 1]["start"] - 0.01))
    best, bt, t = 1e18, (vw[i]["end"] + vw[i + 1]["start"]) / 2, lo
    while t < hi:
        k = int(t * 44100); e = float((a[k:k + 441] ** 2).mean())
        if e < best: best, bt = e, t + 0.005
        t += 0.005
    return round(bt, 3)
cuts = [_quiet_cut(i) for i in sorted(GAPS)]
filt, parts, prev = [], [], 0.0
for k, (i, c) in enumerate(zip(sorted(GAPS), cuts)):
    filt.append(f"[0:a]atrim={prev}:{c},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono,afade=t=in:d=0.012,afade=t=out:st={max(0, c - prev - 0.04):.3f}:d=0.04[a{k}];"
                f"anullsrc=r=44100:cl=mono,atrim=duration={GAPS[i]}[z{k}]")
    parts += [f"[a{k}]", f"[z{k}]"]; prev = c
filt.append(f"[0:a]atrim=start={prev},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono,afade=t=in:d=0.012[al]"); parts.append("[al]")
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

# first word, 'Type' idx, last cmd word idx, command, prompt, scene-time offset (so the first frame is already rich)
DEMOS = [(0, 5, 8, "paper-collage", "why the Eiffel Tower grows", 1.0),
         (9, 13, 16, "flat-science", "how caffeine wakes you up", 0.45),
         (17, 21, 24, "painted-story", "how Vikings reached America", 0.35)]
END = round(S[25] - 0.15, 3)
SEG = []
for k, (a, ti, li, cmd, prompt, off) in enumerate(DEMOS):
    T = 0.0 if k == 0 else round(S[a] - 0.12, 3)
    end = round(S[DEMOS[k + 1][0]] - 0.12, 3) if k < 2 else END
    bar = round(T + 0.18, 3)
    c0, c1 = round(S[ti] - 0.05, 3), round(min(end - 0.75, E[li] + 0.55), 3)
    full = "/" + cmd + " " + prompt
    SEG.append({"T": T, "end": end, "bar": bar, "c0": c0, "c1": c1, "send": round(c1 + 0.18, 3), "txt": full, "n": len(cmd) + 1,
                "off": off, "rate": round((6.25 - off) / (end - T), 4)})
    if k: F.sfx.append((T, "whoosh"))
    F.sfx.append((bar, "pop")); F.sfx.append((c1 + 0.18, "click"))
    for i in range(0, len(full), 2):
        if full[i] != " ": F.sfx.append((c0 + (c1 - c0) * i / len(full), "tick"))
F.sfx.append((END, "whoosh"))

SPARK = '<svg viewBox="0 0 100 100"><path fill="#ff6a3d" d="M50 6l9 33 33 11-33 11-9 33-9-33L8 50l33-11z"/></svg>'
fonts = ('<div style="position:absolute;opacity:0;pointer-events:none"><span style="font-family:\'DM Serif Display\';font-style:italic">a</span>'
         '<span style="font-family:\'DM Serif Display\'">a</span><span style="font-family:\'EB Garamond\';font-weight:500">a</span>'
         '<span style="font-family:\'EB Garamond\';font-style:italic;font-weight:500">a</span><span style="font-family:Inter;font-weight:800">a</span>'
         '<span style="font-family:Inter;font-weight:700">a</span></div>')
stages = "".join(f'<div class="stage" id="st{k}"><canvas id="cv{k}" width="1080" height="1920"></canvas></div>' for k in range(3))
ui = ('<div id="ui"><div id="ctr"><b id="cn">1/3</b></div>'
      '<div id="want">Want this?</div><div id="who">' + SPARK + 'Claude Fable 5.2</div>'
      '<div id="bar">' + SPARK + '<div id="bt"><span id="it"></span><span class="car"></span></div><div class="snd" id="snd"></div></div></div>')
thumbs = "".join(f'<div class="th" id="th{k}" style="left:{x}px"><img src="assets/th{k}.jpg" alt=""></div>' for k, x in enumerate([90, 400, 710]))
end = ('<div id="end">' + SPARK + '<div class="c" id="e1">Comment</div><div class="kw" id="e2">“FABLE”</div>'
       '<div class="g" id="e3">and I\'ll send you the prompts</div>' + thumbs +
       '<div class="series" id="eser" style="left:0;right:0;margin:0 auto;width:fit-content;top:1400px">Type it, get it <b>#20</b></div>' +
       FOLLOW_LINE.replace('class="follow"', 'class="follow" id="efol" style="top:1490px;color:#fff"') + '</div>')
F.body.append('<div class="layer" id="serl" style="z-index:20">' + series("Type it, get it", 20, x=70, y=116, dark=True) + '</div>')
F.clip(0, fonts + stages + ui + end)

CSS = r"""
@font-face{font-family:'DM Serif Display';font-style:italic;font-weight:400;src:url(assets/dm-serif-display-latin-400-italic.woff2) format('woff2')}
@font-face{font-family:'DM Serif Display';font-style:normal;font-weight:400;src:url(assets/dm-serif-display-latin-400-normal.woff2) format('woff2')}
@font-face{font-family:'EB Garamond';font-style:normal;font-weight:500;src:url(assets/eb-garamond-latin-500-normal.woff2) format('woff2')}
@font-face{font-family:'EB Garamond';font-style:italic;font-weight:500;src:url(assets/eb-garamond-latin-500-italic.woff2) format('woff2')}
:root{--paper:#121212}
html,body,#root{background:#121212!important}
#grid,#stars,#grain,#vig{display:none}
#handle{top:1700px;font-size:28px;padding:10px 28px;opacity:0;z-index:50}
.stage{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden;opacity:0;transform-origin:540px 960px}
.stage canvas{position:absolute;inset:0;width:1080px;height:1920px}
#ui{position:absolute;inset:0;font-family:var(--sans);color:#ececec;z-index:10}
#ctr{position:absolute;right:70px;top:112px;height:64px;min-width:64px;border-radius:32px;background:rgba(20,20,20,.78);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:28px;padding:0 18px}
#bar{position:absolute;left:54px;right:54px;top:1548px;min-height:156px;background:rgba(22,22,22,.94);border-radius:38px;border:2px solid #3a3a3a;
 box-shadow:0 24px 60px rgba(0,0,0,.55);display:flex;align-items:center;gap:22px;padding:22px 110px 22px 30px}
#want{position:absolute;left:372px;top:96px;background:#fff;color:#111;font-weight:900;font-size:56px;letter-spacing:-.03em;padding:6px 28px 10px;border-radius:22px;
 box-shadow:0 18px 44px rgba(0,0,0,.5);transform-origin:50% 50%;opacity:0}
#who{position:absolute;right:54px;top:1484px;height:54px;display:flex;align-items:center;gap:10px;background:rgba(22,22,22,.94);border:2px solid #3a3a3a;border-radius:27px;padding:0 22px 0 14px;font-weight:700;font-size:28px;color:#f2f2f2;opacity:0}
#who svg{width:30px;height:30px}
#bar svg{width:54px;height:54px;flex:none}
#bt{font-size:43px;line-height:1.22;font-weight:500;letter-spacing:-.01em}
#bt .cmd{color:#ff6a3d;font-weight:700}
#bar .car{display:inline-block;width:4px;height:44px;background:#ff6a3d;vertical-align:-8px;margin-left:3px}
#bar .snd{position:absolute;right:24px;top:50%;margin-top:-35px;width:70px;height:70px;border-radius:50%;background:#3a3a3a}
#bar .snd::after{content:'';position:absolute;left:24px;top:18px;border-bottom:22px solid #fff;border-left:11px solid transparent;border-right:11px solid transparent}
#bar .snd::before{content:'';position:absolute;left:33px;top:34px;width:4px;height:20px;background:#fff}
#end{position:absolute;inset:0;background:#121212;opacity:0;font-family:var(--sans);z-index:30}
#end svg{position:absolute;left:490px;top:300px;width:100px;height:100px}
#end .c{position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:800;font-size:90px;color:#fff}
#end .kw{position:absolute;left:0;right:0;top:520px;text-align:center;font-weight:900;font-size:150px;color:#ff4b1f;letter-spacing:-.04em}
#end .g{position:absolute;left:0;right:0;top:710px;text-align:center;font-weight:800;font-size:56px;color:#fff}
.th{position:absolute;top:900px;width:280px;height:430px;border-radius:24px;overflow:hidden;background:#222;box-shadow:0 30px 60px rgba(0,0,0,.7),0 0 0 2px #2a2a2a}
.th img{width:100%;height:100%;object-fit:cover}
"""

JS = r"""
const SEG=__SEG__, END=__END__;
const SCN=[]; const cl=(x)=>x<0?0:x>1?1:x;
const it=document.getElementById('it'), cn=document.getElementById('cn');
__SCENES__
let lastKey='';
function apply(t){
  let k=0; for(let i=0;i<SEG.length;i++){ if(SEG[i].T<=t) k=i; } const d=SEG[k];
  let n=0; if(t>=d.c0) n=Math.min(d.txt.length,Math.floor((t-d.c0)/((d.c1-d.c0)/d.txt.length))+1);
  const key=k+'|'+n; if(key!==lastKey){ lastKey=key; const s=d.txt.slice(0,n); it.innerHTML=n?('<span class="cmd">'+s.slice(0,d.n)+'</span>'+s.slice(d.n)):'<span style="color:#777">Ask Claude Fable 5.2…</span>'; cn.textContent=(k+1)+'/3'; }
  if(t<END+0.3) SCN[k](d.off+(t-d.T)*d.rate);
}
const clock={t:0}; tl.fromTo(clock,{t:0},{t:DUR,duration:DUR,ease:'none',onUpdate:()=>apply(clock.t)},0); apply(0);
const NI={immediateRender:false}; function F2(sel,f,t,at){ return tl.fromTo(sel,f,Object.assign({},t,NI),at); }
tl.set(['#st1','#st2','#end','#e1','#e2','#e3','#th0','#th1','#th2','#handle','#eser','#efol'],{opacity:0},0); tl.set('#st0',{opacity:1},0); tl.set('#bar',{y:460,opacity:0},0); tl.set(['#want','#who'],{opacity:0},0);
SEG.forEach((d,k)=>{
  if(k){ tl.set('#st'+(k-1),{opacity:0},d.T); F2('#st'+k,{opacity:1,scale:1.08},{opacity:1,scale:1,duration:.45,ease:'power3.out'},d.T); }
  F2('#bar',{y:460,opacity:0},{y:0,opacity:1,duration:.38,ease:'back.out(1.5)'},d.bar);
  F2('#who',{opacity:0,y:30},{opacity:1,y:0,duration:.3,ease:'back.out(1.6)'},d.bar+0.12);
  F2('#want',{opacity:0,scale:.3,rotation:-14},{opacity:1,scale:1,rotation:-4,duration:.4,ease:'back.out(2.2)'},d.T+0.08);
  F2('#want',{opacity:1,scale:1},{opacity:0,scale:.6,duration:.22,ease:'power2.in'},d.c0-0.25);
  F2('#who',{opacity:1},{opacity:0,duration:.2},d.end-0.27);
  tl.set('#snd',{backgroundColor:'#ff4b1f'},d.c0+0.1);
  tl.to('#snd',{scale:.8,duration:.07,yoyo:true,repeat:1},d.send-0.07);
  F2('#bar',{scale:1},{scale:1.035,duration:.09,yoyo:true,repeat:1},d.send);
  F2('#bar',{y:0,opacity:1},{y:460,opacity:0,duration:.25,ease:'power3.in'},d.end-0.27);
  tl.set('#snd',{backgroundColor:'#3a3a3a'},d.end-0.02);
});
tl.set('#st2',{opacity:0},END+0.3); tl.set('#ui',{opacity:0},END);
F2('#end',{opacity:0},{opacity:1,duration:.25,ease:'none'},END);
F2('#end svg',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.45,ease:'back.out(2)'},END+0.05);
F2('#e1',{opacity:0,y:40},{opacity:1,y:0,duration:.35,ease:A},END+0.02);
F2('#e2',{opacity:0,scale:1.5},{opacity:1,scale:1,duration:.4,ease:'back.out(1.8)'},Math.min(S[26]-0.1,END+0.1));
F2('#e3',{opacity:0,y:30},{opacity:1,y:0,duration:.35,ease:A},END+0.22);
[0,1,2].forEach(k=>F2('#th'+k,{opacity:0,y:200,rotation:(k-1)*8},{opacity:1,y:0,rotation:(k-1)*3,duration:.55,ease:'back.out(1.4)'},END+0.15+k*0.08));
F2('#handle',{opacity:0},{opacity:1,duration:.3},END+0.5);
F2('#eser',{opacity:0,y:20},{opacity:1,y:0,duration:.3,ease:A},END+0.6);
F2('#efol',{opacity:0,y:20},{opacity:1,y:0,duration:.3,ease:A},END+0.75);
tl.set('#serl',{opacity:0},END);
"""
JS = JS.replace("__SCENES__", (HERE.parent / "styles20" / "scenes.js").read_text()).replace("__SEG__", json.dumps(SEG)).replace("__END__", str(END))
F.write(CSS, JS, music_vol=0.10)
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
