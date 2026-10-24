"""@theaitoolfinds house style for HyperFrames ("Paper"): shared CSS, text blocks, tiles, chips, stars,
grain, handle pill, subtle SFX and the HTML/JS shell. Each video's hf/videos/<name>/build.py imports this.

Concept: every scene = a visual (top ~330-950 px) + an animated text block under it (~1000-1300 px)
that shows EVERY spoken word (no separate captions). Words rise from light grey to ink on their spoken
time; key phrases get a black label box that wipes in. Handle pill @theaitoolfinds at y 1560.
"""
import html, json, math, wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).parent


class Film:
    def __init__(self, workdir, script_text, voice_json, display=None, tail=1.6):
        self.dir = Path(workdir)
        self.tok = script_text.split()
        self.vw = json.loads(Path(voice_json).read_text())
        assert len(self.vw) == len(self.tok), f"voice has {len(self.vw)} words, script {len(self.tok)}"
        self.S = [round(w["start"], 3) for w in self.vw]
        self.E = [round(w["end"], 3) for w in self.vw]
        self.dur = round(self.E[-1] + tail, 2)
        self.display = display or {}      # token index -> on-screen text ('' hides the word)
        self.sfx = []                     # (time, kind)
        self.body = []
        self.ST, self.EN = [], []

    # scenes: list of first-word indices; scene n runs from just before its first word to the next one
    def scenes(self, firsts):
        self.ST = [0.0] + [round(self.S[i] - 0.15, 2) for i in firsts[1:]]
        self.EN = self.ST[1:] + [self.dur]
        for n in range(1, len(self.ST)):
            self.sfx.append((self.ST[n] - 0.05, "whoosh"))

    def clip(self, n, inner, extra=0.0):
        st, en = self.ST[n], self.EN[n] + extra
        self.body.append(f'<div id="s{n}" class="clip layer" data-start="{st}" data-duration="{round(en - st, 2)}" '
                         f'data-track-index="{n + 1}">{inner}</div>')

    def word(self, i):
        return html.escape(self.display.get(i, self.tok[i]))

    def block(self, lines, top=1020, size=78, bid=""):
        """lines: [[(i0, i1, style), ...], ...]; style '', 'b', 'it', 'acc', 'hl' (black label box)."""
        out = [f'<div {f"id={chr(34)}{bid}{chr(34)}" if bid else ""} class="tb" style="top:{top}px;font-size:{size}px">']
        for line in lines:
            out.append('<div class="tl">')
            for i0, i1, st in line:
                if st == "hl":
                    txt = " ".join(self.word(i) for i in range(i0, i1 + 1) if self.word(i))
                    out.append(f'<span id="h{i0}" class="hl" data-a="{i0}" data-b="{i1}"><span>{txt}</span></span> ')
                    self.sfx.append((self.S[i0] - 0.02, "click"))
                else:
                    for i in range(i0, i1 + 1):
                        if self.word(i):
                            out.append(f'<span id="w{i}" class="w {st}">{self.word(i)}</span> ')
            out.append('</div>')
        out.append('</div>')
        return "".join(out)

    def pop(self, t):
        self.sfx.append((t, "pop"))

    def write(self, css_extra="", js_scenes="", music="assets/music.mp3", music_vol=0.11):
        b = list(self.body)
        b.insert(0, '<div class="layer"><div id="grid"></div></div>')
        b.append(f'<div id="stars" class="layer">' + "".join(f'<div id="st{k}" class="star">{STAR}</div>' for k in (1, 2, 3)) + '</div>')
        b.append('<div id="vig" class="layer"></div><div id="grain"></div><div id="handle">@theaitoolfinds</div>')
        b.append(f'<audio id="vo" class="clip" src="assets/voice.mp3" data-start="0" data-duration="{round(self.E[-1] + 0.05, 2)}" data-track-index="20" data-volume="1"></audio>')
        b.append(f'<audio id="mus" class="clip" src="{music}" data-start="0" data-duration="{self.dur}" data-track-index="21" data-volume="{music_vol}"></audio>')
        b.append(f'<audio id="fx" class="clip" src="assets/sfx.wav" data-start="0" data-duration="{self.dur}" data-track-index="22" data-volume="1"></audio>')
        js = (JS_HEAD.replace("__S__", json.dumps(self.S)).replace("__ST__", json.dumps(self.ST))
              .replace("__DUR__", str(self.dur)) + js_scenes + JS_TAIL)
        doc = (f'<!doctype html><html lang="en" data-resolution="portrait"><head><meta charset="UTF-8">'
               f'<meta name="viewport" content="width=1080, height=1920"><script src="assets/gsap.min.js"></script>'
               f'<style>{CSS}{css_extra}</style></head><body>\n'
               f'<div id="root" data-composition-id="main" data-start="0" data-duration="{self.dur}" data-width="1080" '
               f'data-height="1920" data-motion-blur="on">\n' + "\n".join(b) + f'\n</div><script>{js}</script></body></html>')
        (self.dir / "index.html").write_text(doc)
        write_sfx(self.sfx, self.dur, self.dir / "assets" / "sfx.wav")
        print("ok", self.dir.name, "dur", self.dur, "scenes", self.ST, "sfx", len(self.sfx))


ICON = {
    "desk": '<rect x="14" y="20" width="72" height="50" rx="7"/><path d="M14 32h72"/><path d="M40 84h20M50 70v14"/>',
    "web": '<circle cx="50" cy="50" r="34"/><path d="M16 50h68M50 16c-14 18-14 50 0 68M50 16c14 18 14 50 0 68"/>',
    "apk": '<rect x="30" y="12" width="40" height="76" rx="9"/><path d="M44 78h12"/>',
    "free": '<path d="M20 50l28-28h30v30L50 80z"/><circle cx="64" cy="36" r="5"/>',
    "branch": '<circle cx="30" cy="24" r="8"/><circle cx="30" cy="76" r="8"/><circle cx="70" cy="40" r="8"/><path d="M30 32v36M70 48c0 14-22 14-36 22"/>',
    "local": '<rect x="18" y="24" width="64" height="42" rx="6"/><path d="M10 76h80"/><path d="M42 45l6 6 12-12"/>',
    "shield": '<path d="M50 12l32 12v24c0 20-14 34-32 40-18-6-32-20-32-40V24z"/><path d="M36 50l10 10 18-20"/>',
    "terminal": '<rect x="12" y="18" width="76" height="64" rx="8"/><path d="M26 40l12 10-12 10M46 62h22"/>',
    "lock": '<rect x="22" y="44" width="56" height="40" rx="7"/><path d="M34 44V32a16 16 0 0132 0v12"/>',
    "eye": '<path d="M10 50s14-26 40-26 40 26 40 26-14 26-40 26S10 50 10 50z"/><circle cx="50" cy="50" r="10"/>',
    "money": '<circle cx="50" cy="50" r="36"/><path d="M60 36c-4-4-20-6-20 4s20 6 20 16-16 8-20 4M50 26v48"/>',
    "plug": '<path d="M36 14v20M64 14v20M26 34h48v14a24 24 0 01-48 0z"/><path d="M50 72v16"/>',
    "search": '<circle cx="44" cy="44" r="26"/><path d="M64 64l20 20"/>',
    "undo": '<path d="M30 30L14 46l16 16"/><path d="M14 46h44a24 24 0 010 48"/>',
    "chat": '<path d="M16 22h68v44H44L28 80V66H16z"/>',
    "spark": '<path d="M50 10l8 32 32 8-32 8-8 32-8-32-32-8 32-8z"/>',
}


def tile(tid, icon, x, y, s=230, acc=False):
    col = "#ff4b1f" if acc else "#111"
    return (f'<div id="{tid}" class="tile" style="left:{x}px;top:{y}px;width:{s}px;height:{s}px">'
            f'<svg viewBox="0 0 100 100" fill="none" stroke="{col}" stroke-width="5" stroke-linecap="round" '
            f'stroke-linejoin="round">{ICON[icon]}</svg></div>')


def chip(cid, name, x, y, glyph="", color="#111"):
    return (f'<div id="{cid}" class="chip" style="left:{x}px;top:{y}px"><b style="background:{color}">{glyph}</b>'
            f'{html.escape(name)}</div>')


STAR = ('<svg viewBox="-100 -100 200 200"><path fill="#111" d="' + " ".join(
    ("M" if k == 0 else "L") + f"{(98 if k % 2 == 0 else 30) * math.cos(k * math.pi / 8 - 1.5708):.1f} "
    f"{(98 if k % 2 == 0 else 30) * math.sin(k * math.pi / 8 - 1.5708):.1f}" for k in range(16)) + 'Z"/></svg>')

CSS = r"""
:root{--paper:#ebebea;--ink:#111;--mid:#6f6f6f;--soft:#b3b3b3;--acc:#ff4b1f;--sans:'Inter',sans-serif;--serif:'EB Garamond',serif;--mono:'JetBrains Mono',monospace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--paper)}
#root{position:relative;width:100%;height:100%;font-family:var(--sans);color:var(--ink);overflow:hidden;background:var(--paper)}
.layer{position:absolute;inset:0}
#grid{position:absolute;left:-200px;top:-200px;width:1480px;height:2320px;
 background-image:linear-gradient(90deg,rgba(0,0,0,.065) 1.5px,transparent 1.5px),linear-gradient(0deg,rgba(0,0,0,.065) 1.5px,transparent 1.5px);background-size:120px 120px;
 -webkit-mask-image:radial-gradient(60% 45% at 50% 42%,#000 25%,transparent 75%);mask-image:radial-gradient(60% 45% at 50% 42%,#000 25%,transparent 75%)}
#vig{background:radial-gradient(120% 80% at 50% 45%,rgba(0,0,0,0) 60%,rgba(0,0,0,.10) 100%)}
#grain{position:absolute;left:-256px;top:-256px;width:1592px;height:2432px;opacity:.06;mix-blend-mode:multiply;background:url(assets/noise.png) repeat}
#handle{position:absolute;left:50%;top:1560px;transform:translateX(-50%);background:var(--acc);color:#fff;font-weight:700;font-size:34px;padding:12px 34px;border-radius:40px;box-shadow:0 10px 30px rgba(255,75,31,.35)}
.star{position:absolute;width:760px;height:760px;opacity:0}.star svg{width:100%;height:100%}
.tb{position:absolute;left:70px;right:70px;text-align:center;letter-spacing:-.035em;line-height:1.12;font-weight:500}
.tl{display:block}
.w{display:inline-block;opacity:0;color:var(--ink)}
.b{font-weight:800}
.it{font-family:var(--serif);font-style:italic;font-weight:500;letter-spacing:-.005em;font-size:1.08em}
.acc{color:var(--acc)}
.mono{font-family:var(--mono);font-weight:600;letter-spacing:-.02em}
.hl{display:inline-block;position:relative;font-weight:700;color:#fff;margin-top:.12em}
.hl>span{display:inline-block;background:var(--ink);padding:.02em .22em .06em;box-shadow:0 14px 26px -10px rgba(0,0,0,.45)}
.card{position:absolute;border-radius:30px;background:#fff;box-shadow:0 60px 90px -20px rgba(0,0,0,.28),0 18px 30px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04)}
.dark{background:#141414}
.chip{position:absolute;display:flex;align-items:center;gap:22px;background:#fff;border-radius:999px;padding:22px 42px 22px 24px;font-weight:700;font-size:54px;letter-spacing:-.03em;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.28),0 10px 20px -8px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.04);white-space:nowrap}
.chip b{width:74px;height:74px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:34px;font-weight:800}
.tile{position:absolute;border-radius:52px;background:linear-gradient(160deg,#ffffff,#f1f1f1);box-shadow:0 50px 70px -22px rgba(0,0,0,.30),0 12px 22px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04);padding:46px}
.tile svg{width:100%;height:100%}
.key{display:inline-flex;align-items:center;justify-content:center;min-width:150px;height:150px;padding:0 40px;border-radius:34px;background:linear-gradient(180deg,#fff,#ececec);
 box-shadow:0 14px 0 #c9c9c9,0 40px 60px -16px rgba(0,0,0,.35);font-weight:700;font-size:56px;letter-spacing:-.02em;margin:0 14px}
.term{position:absolute;border-radius:30px;background:#141414;color:#e9e9e9;font-family:var(--mono);overflow:hidden;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.45),0 18px 30px -10px rgba(0,0,0,.25)}
.term .bar{height:58px;background:#1d1d1d;display:flex;align-items:center;gap:12px;padding-left:26px}
.term .bar i{width:15px;height:15px;border-radius:50%;background:#3a3a3a}
#field{position:absolute;left:110px;top:760px;width:860px;height:130px;border-radius:70px;background:#fff;box-shadow:0 40px 70px -20px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05);display:flex;align-items:center;padding-left:48px;font-size:44px;font-weight:500;color:#9a9a9a}
#typed{color:var(--ink);font-weight:800;margin-left:14px}
#caret{display:inline-block;width:5px;height:58px;background:var(--acc);margin-left:6px}
#send{position:absolute;right:20px;top:20px;width:90px;height:90px;border-radius:50%;background:var(--ink)}
#send::after{content:'';position:absolute;left:34px;top:26px;border-left:30px solid #fff;border-top:19px solid transparent;border-bottom:19px solid transparent}
"""

JS_HEAD = r"""
const S=__S__, ST=__ST__, DUR=__DUR__;
const tl=gsap.timeline({paused:true}); const A='expo.out', IO='power2.inOut', IN='power3.in';
const seen=new Set(); function ft(t,f,to,p){ if(seen.has(t)) to.immediateRender=false; seen.add(t); return tl.fromTo(t,f,to,p); }
const R=(a,b)=>Array.from({length:b-a+1},(_,k)=>a+k);
document.querySelectorAll('.w').forEach(el=>{ const i=+el.id.slice(1);
  ft(el,{opacity:0,y:16,color:'#b9b9b9',filter:'blur(6px)'},{opacity:1,y:0,color:'',filter:'blur(0px)',duration:.32,ease:A},S[i]-0.04); });
document.querySelectorAll('.hl').forEach(el=>{ const a=+el.dataset.a, b=+el.dataset.b; const d=Math.max(.25,(S[b]-S[a])+.25);
  ft(el,{clipPath:'inset(-20% 100% -20% 0)'},{clipPath:'inset(-20% 0% -20% 0)',duration:d,ease:'power2.out'},S[a]-0.04);
  ft(el,{scale:.92},{scale:1,duration:.4,ease:'back.out(2)'},S[a]-0.04); });
for(let n=0;n<ST.length-1;n++) tl.to('#s'+n+' .tb',{opacity:0,y:-24,filter:'blur(12px)',duration:.22,ease:IN,stagger:.01},ST[n+1]-0.22);
ft('#grid',{x:0,y:0},{x:-120,y:-240,duration:DUR,ease:'none'},0);
// foreground stars: defocused shapes passing a corner (id, start, from[x,y,rot], to[x,y,rot], blur, hold)
function starPass(id,t,from,to,blur,hold){ ft(id,{x:from[0],y:from[1],rotation:from[2],filter:`blur(${blur}px)`,opacity:1},{x:to[0],y:to[1],rotation:to[2],duration:.75,ease:IO},t);
  tl.to(id,{x:from[0]*1.3,y:from[1]*1.15,duration:.5,ease:IN},t+0.75+(hold||1.2)); }
// pop-in helper for cards/tiles/chips
function popIn(sel,t,o){ o=o||{}; ft(sel,{opacity:0,y:o.y??80,scale:o.s??.7,rotation:o.r??-8},{opacity:1,y:0,scale:1,rotation:0,duration:.6,ease:'back.out(1.5)'},t); }
function outUp(sel,t){ tl.to(sel,{y:-60,opacity:0,filter:'blur(14px)',duration:.24,ease:IN,stagger:.03},t-0.24); }
// CTA: type the keyword into the comment field
function cta(word,t){ ft('#field',{opacity:0,y:60,scale:.94},{opacity:1,y:0,scale:1,duration:.6,ease:A},t-0.4);
  const ty=document.getElementById('typed'), TY={n:0};
  ft(TY,{n:0},{n:word.length,duration:.12*word.length,ease:`steps(${word.length})`,onUpdate:()=>{ty.textContent=word.slice(0,Math.round(TY.n))}},t+0.2);
  for(let x=t+0.4+.12*word.length;x<DUR-0.2;x+=0.6){ tl.set('#caret',{opacity:0},x); tl.set('#caret',{opacity:1},x+0.3); } }
"""
JS_TAIL = r"""
ft('#handle',{opacity:0,y:20},{opacity:1,y:0,duration:.5,ease:A},0.15);
for(let k=0,t=0;t<DUR;k++,t=k/12){ const sd=(k*7919)%997; tl.set('#grain',{x:-(sd%256),y:-((sd*31)%256)},t); }
window.__timelines['main']=tl; tl.seek(0);
"""


# ---------------------------------------------------------------- SFX: soft, felt more than heard
def write_sfx(events, dur, path, sr=44100):
    buf = np.zeros(int((dur + 1) * sr))
    rng = np.random.default_rng(3)

    def env(n, a, d):
        t = np.arange(n) / sr
        return np.minimum(1, t / a) * np.exp(-t / d)

    def click():
        n = int(.035 * sr); t = np.arange(n) / sr
        return np.sin(2 * np.pi * 1800 * t) * env(n, .0005, .004) * .6 + np.sin(2 * np.pi * 140 * t) * env(n, .001, .012)

    def pop():
        n = int(.09 * sr); t = np.arange(n) / sr
        f = 520 - 260 * t / t[-1]
        return np.sin(2 * np.pi * np.cumsum(f) / sr) * env(n, .002, .025)

    def whoosh():
        n = int(.42 * sr); t = np.arange(n) / sr
        x = rng.standard_normal(n)
        k = 0.08; y = np.empty(n); acc = 0.0
        for i in range(n):
            acc += k * (x[i] - acc); y[i] = acc
        return y / (np.abs(y).max() + 1e-9) * np.sin(np.pi * t / t[-1]) ** 2

    def tick():
        n = int(.02 * sr); t = np.arange(n) / sr
        return np.sin(2 * np.pi * 2600 * t) * env(n, .0003, .003)

    kinds = {"click": (click(), .16), "pop": (pop(), .12), "whoosh": (whoosh(), .07), "tick": (tick(), .10)}
    for t, k in events:
        x, g = kinds[k]
        i = int(max(0, t) * sr)
        buf[i:i + len(x)] += x[:len(buf) - i] * g
    pcm = (np.clip(buf, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
