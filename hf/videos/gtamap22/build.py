"""gtamap22 - tutorial "How to make this GTA 6 map animation using Claude" (Jan, live, 2026-11-11). New format: the result plays from
frame 0 under the spoken hook, then three short steps over the still-moving map: upload a reference clip, pick Fable 5.2 + paste the
prompt, Claude codes every frame and renders (the flight replays). Keyword GTA. No music (Jan adds it in Instagram).
The map is a GTA-STYLE transition over a satellite-look landscape drawn in code from the real Florida coastline (scenes.js): inspired
by the game's setting, not a copy of its map; no Rockstar art, logo or wordmark, only place names as text. Chat UI = our own generic
design. Made with Claude Fable 5.2 (this scene was written by it). Trip card: Miami-Key West is ~166 miles / ~4 h (enterprise.com)."""
import json, shutil, subprocess, sys, html
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, FOLLOW_LINE

W = HERE.parent.parent / "work" / "gtamap22"
A = W / "assets"
for f in (HERE / "media").iterdir():
    shutil.copy(f, A / f.name)

GAPS = {9: 1.0, 16: 0.9, 26: 1.1, 34: 2.5}
if not (A / "voice_raw.mp3").exists():
    shutil.copy(A / "voice.mp3", A / "voice_raw.mp3"); shutil.copy(A / "voice.json", A / "voice_raw.json")
vw = json.loads((A / "voice_raw.json").read_text())
cuts = [round(min(vw[i]["end"] + 0.08, (vw[i]["end"] + vw[i + 1]["start"]) / 2 + 0.02), 3) for i in sorted(GAPS)]
filt, parts, prev = [], [], 0.0
for k, (i, c) in enumerate(zip(sorted(GAPS), cuts)):
    filt.append(f"[0:a]atrim={prev}:{c},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono,afade=t=in:d=0.012,afade=t=out:st={max(0, c - prev - 0.04):.3f}:d=0.04[a{k}];"
                f"anullsrc=r=44100:cl=mono,atrim=duration={GAPS[i]}[z{k}]")
    parts += [f"[a{k}]", f"[z{k}]"]; prev = c
filt.append(f"[0:a]atrim=start={prev},asetpts=PTS-STARTPTS,aformat=sample_rates=44100:channel_layouts=mono,afade=t=in:d=0.012[al]"); parts.append("[al]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(A / "voice_raw.mp3"), "-filter_complex",
                ";".join(filt) + ";" + "".join(parts) + f"concat=n={len(parts)}:v=0:a=1[out]", "-map", "[out]", "-ar", "44100", str(A / "voice.mp3")], check=True)
shift = 0.0
for j, w in enumerate(vw):
    w["start"] += shift; w["end"] += shift
    if j in GAPS: shift += GAPS[j]
(A / "voice.json").write_text(json.dumps(vw))

F = Film(W, (HERE / "script.txt").read_text(), A / "voice.json", tail=1.0)
F.scenes([0])
S, E = F.S, F.E
T1 = 3.7                                   # flight length in scenes.js
S1, S2, S3, END = round(S[10] - 0.15, 3), round(S[17] - 0.15, 3), round(S[27] - 0.15, 3), round(S[35] - 0.15, 3)
RS = round(S3 + 1.3, 3)                    # replay start (the "render" result)
TM = {"S1": S1, "S2": S2, "S3": S3, "END": END, "RS": RS, "rate": round((T1 + 0.7) / (END - RS), 4),
      "file": round(S[11], 3), "menu": round(S[18] - 0.12, 3), "pick": round(S[19] + 0.1, 3), "mclose": round(S[23] - 0.1, 3), "paste": round(S[24] + 0.05, 3), "send": round(E[26] + 0.25, 3)}
for t, k in [(0.0, "whoosh"), (S1, "whoosh"), (TM["file"], "pop"), (S2, "whoosh"), (TM["menu"], "pop"), (TM["pick"], "click"), (TM["paste"], "pop"), (TM["send"], "click"), (S3, "whoosh"), (RS, "whoosh"), (END, "whoosh")]:
    F.sfx.append((t, k))
for i in range(22): F.sfx.append((S3 + 0.1 + i * 0.06, "tick"))

src = (HERE / "scenes.js").read_text().split("\n")
code = [l.strip()[:54] for l in src if any(k in l for k in ("function camAt", "const lz=", "function cloudLayer", "function topDown", "function bez", "const PRJ=", "motion blur", "perspective projection", "for(let y=0;y<1920", "const ROUTE=", "function mapLabel", "cloudLayer(c,CL2"))][:13]
code_html = "".join(f'<div class="cl" id="cl{i}"><i>{i + 1:>2}</i>{html.escape(l)}</div>' for i, l in enumerate(code))
PROMPT = ("Make a 9:16 map-transition animation like my reference clip: start close over a coastal city, pull back above the clouds, "
          "glide along the islands and descend on the last one. Satellite look, layered clouds with parallax, smooth easing, a glowing route…")
SPARK = '<svg viewBox="0 0 100 100"><path fill="#ff6a3d" d="M50 6l9 33 33 11-33 11-9 33-9-33L8 50l33-11z"/></svg>'
body = ('<div class="stage" id="st0"><canvas id="cv0" width="1080" height="1920"></canvas></div><div id="ui">'
        '<div id="hook"><span>How to make this</span><b>GTA 6 map animation</b><em>' + SPARK + 'using Claude</em></div>'
        + "".join(f'<div class="cap" id="cap{k}"><i>{k}</i><span>{t}</span></div>' for k, t in ((1, "Upload a reference clip"), (2, "Pick Fable 5.2, paste the prompt"), (3, "Claude codes every frame")))
        + '<div id="panel"><div id="ph">' + SPARK + '<b>Claude</b><div id="mchip"><span id="mname">Choose model</span> ▾</div></div>'
        '<div id="menu"><div class="mr" id="m0">Claude Haiku</div><div class="mr" id="m1">Claude Sonnet</div><div class="mr" id="m2">Claude Fable 5.2<u>✓</u></div></div>'
        '<div id="inp"><div id="file"><div class="th"></div><div><b>reference.mp4</b><span>video · 25 s</span></div><div class="ok">✓</div></div>'
        '<div id="ptxt">' + html.escape(PROMPT) + '</div><div id="ph0">Message Claude…</div><div class="snd" id="snd"></div></div>'
        '<div id="code">' + code_html + '<div id="pb"><div id="pbf"></div></div><div id="pbl">Rendering frames…</div></div></div></div>')
thumbs = "".join(f'<div class="th2" id="th{k}" style="left:{x}px"><img src="assets/th{k}.jpg" alt=""></div>' for k, x in enumerate([90, 400, 710]))
end = ('<div id="end">' + SPARK + '<div class="c" id="e1">Comment</div><div class="kw" id="e2">“GTA”</div>'
       '<div class="g" id="e3">and I\'ll send you the prompt</div>' + thumbs +
       FOLLOW_LINE.replace('class="follow"', 'class="follow" id="efol" style="top:1440px;color:#fff"') + '</div>')
F.clip(0, body + end)

CSS = r"""
:root{--paper:#051425}
html,body,#root{background:#051425!important}
#grid,#stars,#grain,#vig{display:none}
#handle{top:1700px;font-size:28px;padding:10px 28px;opacity:0;z-index:50}
.stage{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden;transform-origin:540px 960px}
.stage canvas{position:absolute;inset:0;width:1080px;height:1920px}
#ui{position:absolute;inset:0;font-family:var(--sans);color:#f2f2f2;z-index:10}
#hook{position:absolute;left:60px;right:60px;top:150px;text-align:center;text-shadow:0 4px 30px rgba(0,0,0,.75)}
#hook span{display:block;font-weight:600;font-size:54px;letter-spacing:-.01em;color:rgba(255,255,255,.92)}
#hook b{display:block;font-weight:900;font-size:86px;letter-spacing:-.035em;line-height:1.05;margin-top:6px}
#hook em{display:inline-flex;align-items:center;gap:12px;font-style:normal;font-weight:700;font-size:40px;margin-top:20px;background:rgba(6,14,24,.62);border:1.5px solid rgba(255,255,255,.38);border-radius:40px;padding:10px 28px 10px 20px}
#hook em svg{width:38px;height:38px}
.cap{position:absolute;left:60px;right:60px;top:170px;display:flex;align-items:center;justify-content:center;gap:22px;opacity:0;text-shadow:0 4px 26px rgba(0,0,0,.8)}
.cap i{font-style:normal;flex:none;width:84px;height:84px;border-radius:50%;background:#ff4b1f;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:50px;text-shadow:none}
.cap span{font-weight:800;font-size:58px;letter-spacing:-.025em;line-height:1.08;text-align:left}
#panel{position:absolute;left:40px;right:40px;top:1180px;height:640px;background:rgba(10,14,20,.9);border:1.5px solid rgba(255,255,255,.22);border-radius:44px;box-shadow:0 30px 80px rgba(0,0,0,.6);padding:30px 34px}
#ph{display:flex;align-items:center;gap:14px;font-size:38px}#ph svg{width:44px;height:44px}#ph b{font-weight:800}
#mchip{margin-left:auto;background:#1e2530;border:1.5px solid #39424f;border-radius:30px;padding:10px 24px;font-weight:600;font-size:30px;color:#cfd6df}
#menu{position:absolute;right:34px;top:104px;width:470px;background:#161c25;border:1.5px solid #39424f;border-radius:26px;padding:10px;z-index:3;opacity:0;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.mr{padding:18px 22px;border-radius:18px;font-size:34px;font-weight:600;color:#b9c1cc;display:flex;justify-content:space-between}
.mr u{text-decoration:none;color:#ff6a3d;opacity:0}
#inp{position:absolute;left:34px;right:34px;top:118px;bottom:34px;background:#141a22;border:1.5px solid #2c3440;border-radius:32px;padding:26px 28px}
#ph0{font-size:36px;color:#6f7986}
#file{display:flex;align-items:center;gap:20px;background:#1e2530;border:1.5px solid #39424f;border-radius:24px;padding:16px 22px 16px 16px;width:520px;opacity:0;margin-bottom:20px}
#file .th{width:84px;height:84px;border-radius:16px;background:linear-gradient(135deg,#1c6b8a,#0b3557 55%,#3f5e38);flex:none}
#file b{display:block;font-size:34px;font-weight:700}#file span{display:block;font-size:26px;color:#8b95a3;margin-top:2px}
#file .ok{margin-left:auto;width:50px;height:50px;border-radius:50%;background:#2fbf71;color:#fff;font-weight:900;font-size:30px;display:flex;align-items:center;justify-content:center;opacity:0}
#ptxt{font-size:31px;line-height:1.34;color:#e7ebf0;opacity:0;position:absolute;left:28px;right:110px;top:150px}
#inp .snd{position:absolute;right:22px;bottom:22px;width:72px;height:72px;border-radius:50%;background:#3a3a3a}
#inp .snd::after{content:'';position:absolute;left:25px;top:19px;border-bottom:22px solid #fff;border-left:11px solid transparent;border-right:11px solid transparent}
#inp .snd::before{content:'';position:absolute;left:34px;top:35px;width:4px;height:20px;background:#fff}
#code{position:absolute;left:34px;right:34px;top:118px;bottom:34px;background:#0c1118;border:1.5px solid #2c3440;border-radius:32px;padding:22px 24px;font-family:var(--mono);opacity:0;overflow:hidden}
.cl{font-size:24px;line-height:31px;white-space:nowrap;color:#9fe3b0;opacity:0}.cl i{font-style:normal;color:#4d5967;margin-right:16px}
#pb{position:absolute;left:24px;right:24px;bottom:62px;height:16px;border-radius:8px;background:#1e2530;overflow:hidden}#pbf{width:100%;height:100%;background:#ff4b1f;transform-origin:0 50%;transform:scaleX(0)}
#pbl{position:absolute;left:24px;bottom:20px;font-family:var(--sans);font-size:26px;color:#8b95a3}
#end{position:absolute;inset:0;background:#0a0f16;opacity:0;font-family:var(--sans);z-index:30}
#end svg{position:absolute;left:490px;top:300px;width:100px;height:100px}
#end .c{position:absolute;left:0;right:0;top:420px;text-align:center;font-weight:800;font-size:90px;color:#fff}
#end .kw{position:absolute;left:0;right:0;top:520px;text-align:center;font-weight:900;font-size:160px;color:#ff4b1f;letter-spacing:-.04em}
#end .g{position:absolute;left:0;right:0;top:720px;text-align:center;font-weight:800;font-size:56px;color:#fff}
.th2{position:absolute;top:900px;width:280px;height:430px;border-radius:24px;overflow:hidden;background:#222;box-shadow:0 30px 60px rgba(0,0,0,.7),0 0 0 2px #2a2a2a}
.th2 img{width:100%;height:100%;object-fit:cover}
"""

JS = r"""
const TM=__TM__, NCL=__NCL__; const SCN=[];
__SCENES__
function apply(t){ const rep=t>=TM.RS; window.CARDA=rep?1:Math.max(0,Math.min(1,(TM.S1-0.1-t)/0.3)); if(t<TM.END+0.3) SCN[0](rep?(t-TM.RS)*TM.rate:t); }
const clock={t:0}; tl.fromTo(clock,{t:0},{t:DUR,duration:DUR,ease:'none',onUpdate:()=>apply(clock.t)},0); apply(0);
const NI={immediateRender:false}; function F2(sel,f,t,at){ return tl.fromTo(sel,f,Object.assign({},t,NI),at); }
tl.set(['.cap','#menu','#file','#file .ok','#ptxt','#code','.cl','#end','#e1','#e2','#e3','#th0','#th1','#th2','#handle','#efol'],{opacity:0},0); tl.set('#panel',{y:900,opacity:0},0);
F2('#hook',{opacity:0,y:-30,scale:.9},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(1.6)'},0.05);
F2('#hook',{opacity:1,y:0},{opacity:0,y:-40,duration:.3,ease:'power2.in'},TM.S1-0.3);
[[1,TM.S1,TM.S2],[2,TM.S2,TM.S3],[3,TM.S3,TM.END]].forEach(([k,a,b])=>{ F2('#cap'+k,{opacity:0,y:40},{opacity:1,y:0,duration:.4,ease:'power3.out'},a+0.02); F2('#cap'+k,{opacity:1,y:0},{opacity:0,y:-30,duration:.25,ease:'power2.in'},b-0.26); });
F2('#panel',{y:900,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},TM.S1);
F2('#file',{opacity:0,y:-60,scale:.8},{opacity:1,y:0,scale:1,duration:.45,ease:'back.out(1.8)'},TM.file); tl.set('#ph0',{opacity:0},TM.file);
F2('#file .ok',{opacity:0,scale:0},{opacity:1,scale:1,duration:.3,ease:'back.out(2.4)'},TM.file+0.55);
F2('#mchip',{scale:1},{scale:1.08,duration:.12,yoyo:true,repeat:1},TM.menu-0.1);
F2('#menu',{opacity:0,y:-20,scale:.95},{opacity:1,y:0,scale:1,duration:.28,ease:'power3.out'},TM.menu);
tl.set('#m2',{backgroundColor:'#2a323e',color:'#fff'},TM.pick); tl.set('#m2 u',{opacity:1},TM.pick); tl.call(()=>{document.getElementById('mname').textContent='Fable 5.2';},null,TM.pick); tl.set('#mchip',{borderColor:'#ff6a3d',color:'#fff'},TM.pick);
F2('#menu',{opacity:1,y:0},{opacity:0,y:-16,duration:.22,ease:'power2.in'},TM.mclose);
F2('#ptxt',{opacity:0,y:16},{opacity:1,y:0,duration:.25,ease:'power2.out'},TM.paste); F2('#inp',{borderColor:'#ff6a3d'},{borderColor:'#2c3440',duration:.6},TM.paste);
tl.set('#snd',{backgroundColor:'#ff4b1f'},TM.paste+0.05); tl.to('#snd',{scale:.8,duration:.08,yoyo:true,repeat:1},TM.send-0.08);
F2('#inp',{opacity:1},{opacity:0,duration:.25},TM.S3-0.05); F2('#code',{opacity:0},{opacity:1,duration:.25},TM.S3);
for(let i=0;i<NCL;i++) tl.set('#cl'+i,{opacity:1},TM.S3+0.12+i*(TM.RS-TM.S3-0.3)/NCL);
F2('#pbf',{scaleX:0},{scaleX:1,duration:TM.RS-TM.S3-0.15,ease:'power1.inOut'},TM.S3+0.1);
F2('#panel',{y:0,opacity:1},{y:900,opacity:0,duration:.45,ease:'power3.in'},TM.RS-0.1);
F2('#st0',{scale:1.1},{scale:1,duration:.6,ease:'power3.out'},TM.RS);
tl.set('#ui',{opacity:0},TM.END); F2('#end',{opacity:0},{opacity:1,duration:.25,ease:'none'},TM.END);
F2('#end svg',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.45,ease:'back.out(2)'},TM.END+0.05);
F2('#e1',{opacity:0,y:40},{opacity:1,y:0,duration:.35,ease:A},TM.END+0.02);
F2('#e2',{opacity:0,scale:1.5},{opacity:1,scale:1,duration:.4,ease:'back.out(1.8)'},Math.min(S[36]-0.1,TM.END+0.1));
F2('#e3',{opacity:0,y:30},{opacity:1,y:0,duration:.35,ease:A},TM.END+0.22);
[0,1,2].forEach(k=>F2('#th'+k,{opacity:0,y:200,rotation:(k-1)*8},{opacity:1,y:0,rotation:(k-1)*3,duration:.55,ease:'back.out(1.4)'},TM.END+0.15+k*0.08));
F2('#handle',{opacity:0},{opacity:1,duration:.3},TM.END+0.5); F2('#efol',{opacity:0,y:20},{opacity:1,y:0,duration:.3,ease:A},TM.END+0.7);
"""
JS = JS.replace("__SCENES__", (HERE / "scenes.js").read_text()).replace("__TM__", json.dumps(TM)).replace("__NCL__", str(len(code)))
F.write(CSS, JS, music_vol=0.0)
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
print(TM, "code lines", len(code))
