"""styles5 - App demo v2 (BRAIN §3b, Jan's live direction 2026-11-03): 5 animation STYLES made with Claude Code, each a
short slash command typed fast, result straight to fullscreen, no waiting. Three styles taken from Jan's reference video
(ink-wash, headline, stat-chart, all with our own content) + two new ones (teardown = laptop exploded with labelled parts,
receipt = thermal receipt printing). Every result is built here in code by Claude (HyperFrames + GSAP), i.e. a real Claude
Code output; the prompts for each style are in prompts.md (sent in DM to people who comment STYLES).
All brands/numbers in the demos are fictional sample content (marked "sample data" where numbers appear).
Chat UI is our own generic design (no Anthropic logo)."""
import json, math, random, shutil, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film

W = HERE.parent.parent / "work" / "styles5"
A = W / "assets"
for f in (HERE / "media").iterdir():
    shutil.copy(f, A / f.name)

D = 3.3
CMDS = [("ink-wash", "Chinese ink landscape, slow and quiet"),
        ("headline", "Newspaper story with a highlighter pass"),
        ("stat-chart", "Fintech chart with a live counter"),
        ("teardown", "Exploded product view with labelled parts"),
        ("receipt", "Thermal receipt that prints your story")]
N = len(CMDS)
END = round(N * D, 2)

# voice: only the end line, pushed to the end card
if not (A / "voice_raw.mp3").exists():
    shutil.copy(A / "voice.mp3", A / "voice_raw.mp3"); shutil.copy(A / "voice.json", A / "voice_raw.json")
LEAD = END + 0.35
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(A / "voice_raw.mp3"), "-af", f"adelay={int(LEAD * 1000)}:all=1",
                "-ar", "44100", str(A / "voice.mp3")], check=True)
vw = json.loads((A / "voice_raw.json").read_text())
for w in vw:
    w["start"] += LEAD; w["end"] += LEAD
(A / "voice.json").write_text(json.dumps(vw))

from PIL import Image
for k in range(5):
    if not (A / f"th{k}.jpg").exists():
        Image.new("RGB", (280, 430), (34, 34, 34)).save(A / f"th{k}.jpg")
F = Film(W, (HERE / "script.txt").read_text(), A / "voice.json", tail=1.3)
F.scenes([0])
S = F.S

# ---------------------------------------------------------------- timing per demo
TY = []
for k, (cmd, desc) in enumerate(CMDS):
    T = round(k * D, 3)
    t_slash = T + 0.08
    t_c0 = t_slash + 0.12
    t_c1 = t_c0 + 0.05 * len(cmd)
    send = round(t_c1 + 0.12, 3)
    TY.append({"T": T, "slash": t_slash, "c0": t_c0, "c1": t_c1, "send": send, "card": send + 0.12, "full": send + 0.5,
               "cmd": cmd, "desc": desc, "end": round(T + D, 3)})
    F.sfx.append((T, "whoosh"))
    for i in range(len(cmd) + 1):
        F.sfx.append((t_slash + (0 if i == 0 else 0.12 + 0.05 * i) - 0.01, "tick"))
    F.sfx.append((send, "click")); F.sfx.append((send + 0.12, "pop"))
F.sfx.append((END, "whoosh"))

# ---------------------------------------------------------------- R0 ink-wash mountains (procedural)
rnd = random.Random(7)
def ridge(y0, amp, n, seed):
    r = random.Random(seed)
    pts = [(-40, y0 + r.uniform(-amp, amp) * .3)]
    x = -40
    while x < 1120:
        x += r.uniform(60, 160)
        pts.append((x, y0 - r.uniform(0.2, 1.0) * amp if r.random() < .55 else y0 - r.uniform(0, .35) * amp))
    d = f"M{pts[0][0]:.0f} {pts[0][1]:.0f}"
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        d += f" Q{(x1 + x2) / 2:.0f} {min(y1, y2) - r.uniform(0, 40):.0f} {x2:.0f} {y2:.0f}"
    return d + " L1120 1920 L-40 1920 Z"
MT = [(980, 260, "#c9c4b8", 6, .75), (1080, 300, "#a7a297", 4, .8), (1210, 260, "#7b776f", 2.5, .85), (1360, 220, "#3e3b37", 1.2, .9)]
mts = "".join(f'<path id="mt{i}" d="{ridge(y, a, 0, 11 + i)}" fill="{c}" style="filter:blur({b}px)" opacity="{o}"/>'
              for i, (y, a, c, b, o) in enumerate(MT))
R0 = ('<div class="r" id="r0" style="background:#ece6d8">'
      '<div class="pgrain"></div>'
      f'<svg class="full" viewBox="0 0 1080 1920"><defs><radialGradient id="mist"><stop offset="0" stop-color="#fff" stop-opacity=".9"/>'
      '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>'
      '<circle id="sun" cx="720" cy="760" r="78" fill="#c8372d"/>'
      f'{mts}'
      '<ellipse id="mi0" cx="300" cy="1180" rx="520" ry="90" fill="url(#mist)"/><ellipse id="mi1" cx="820" cy="1380" rx="560" ry="110" fill="url(#mist)"/>'
      '<g id="boat"><path d="M-70 0 Q0 26 70 0 Z" fill="#1d1b19"/><path d="M0 0 L0 -64" stroke="#1d1b19" stroke-width="4"/>'
      '<path d="M-30 -2 Q-6 -30 -2 -6" fill="#1d1b19"/><path d="M-90 30 L90 30" stroke="#1d1b19" stroke-width="2" opacity=".35"/></g>'
      '<g id="birds" stroke="#1d1b19" stroke-width="4" fill="none" stroke-linecap="round"><path d="M0 0 q12 -10 24 0 q12 -10 24 0"/>'
      '<path d="M70 -30 q9 -8 18 0 q9 -8 18 0"/></g></svg>'
      '<div id="vt">' + "".join(f'<span>{c}</span>' for c in "THE QUIET RIVER") + '</div>'
      '<div id="seal">静</div></div>')

# ---------------------------------------------------------------- R1 headline (newspaper)
R1 = ('<div class="r" id="r1" style="background:radial-gradient(120% 80% at 50% 40%,#2c2621,#120f0d)">'
      '<div id="np"><div class="mh">The Daily Circuit</div><div class="dl"><span>TUESDAY, NOVEMBER 3</span><span>LATE EDITION</span></div>'
      '<div class="kick">BUSINESS · LOCAL</div>'
      '<div class="hd">A corner bakery let an AI agent run its night orders. Nobody noticed.</div>'
      '<div class="by"><i></i>By the Circuit desk · 4 min read</div>'
      '<div class="bd"><b class="dc">W</b>hen the owner of a small bakery on Rue Lafayette went home at nine, the orders kept coming. '
      '<span class="hl1" id="hl1">An agent read every message, checked the ovens and wrote back in her voice.</span> '
      '<span class="hl2" id="hl2">By spring, regulars asked who the new night manager was.</span> '
      'She still bakes every loaf herself; the agent only answers the door.</div></div></div>')

# ---------------------------------------------------------------- R2 stat-chart
months = ["JAN", "MAR", "MAY", "JUL", "SEP", "NOV"]
pts = [(0, 40), (1, 46), (2, 52), (3, 58), (4, 66), (5, 75), (6, 86), (7, 100), (8, 170), (9, 260), (10, 330), (11, 400)]
cx = lambda i: 110 + i * 78
cy = lambda v: 1500 - v * 1.55
path1 = "M" + " L".join(f"{cx(i):.0f} {cy(v):.0f}" for i, v in pts[:8])
path2 = f"M{cx(7):.0f} {cy(100):.0f} " + " ".join(f"L{cx(i):.0f} {cy(v):.0f}" for i, v in pts[8:])
grid = "".join(f'<line x1="90" x2="1000" y1="{y}" y2="{y}" stroke="#ffffff" stroke-opacity=".07" stroke-width="2"/>' for y in range(900, 1560, 120))
R2 = ('<div class="r" id="r2" style="background:#07090d">'
      '<div id="nw"><b></b>NORTHWIND PAY<span>sample data</span></div>'
      '<div id="lab2">Annual payment volume</div>'
      '<div id="ctr2"><sup>$</sup><span id="cv">0.4</span><small>B</small></div>'
      '<div id="tag2">▲ since the card launched</div>'
      f'<svg class="full" viewBox="0 0 1080 1920">{grid}'
      f'<path id="ln1" d="{path1}" fill="none" stroke="#8b93a1" stroke-width="7" stroke-linejoin="round"/>'
      f'<path id="ln2" d="{path2}" fill="none" stroke="#ff5a2a" stroke-width="9" stroke-linejoin="round"/>'
      f'<circle id="dot2" cx="{cx(7)}" cy="{cy(100)}" r="16" fill="#07090d" stroke="#fff" stroke-width="6"/>'
      f'<line id="vl2" x1="{cx(7)}" x2="{cx(7)}" y1="{cy(100) - 20}" y2="760" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 8"/>'
      '</svg>'
      f'<div id="ann2" style="left:{cx(7) - 230}px;top:690px"><b>CARD LAUNCH</b><span>volume takes off</span></div>'
      '<div id="mo2">' + "".join(f'<span>{m}</span>' for m in months) + '</div></div>')

# ---------------------------------------------------------------- R3 teardown laptop (CSS 3D)
keys = "".join('<i></i>' for _ in range(60))
chips = "".join(f'<i style="left:{x}px;top:{y}px;width:{w}px;height:{h}px"></i>' for x, y, w, h in
                [(250, 150, 170, 170), (460, 160, 90, 60), (460, 240, 90, 60), (90, 120, 110, 70), (590, 90, 60, 120), (90, 260, 70, 70)])
LAY = [("bot", "Bottom case", "machined aluminium"), ("bat", "Battery", "six lithium cells"),
       ("mb", "Logic board", "chip, memory, storage"), ("kb", "Keyboard deck", "backlit keys + trackpad"),
       ("dp", "Display", "glass + panel")]
lay_html = ""
for i, (cls, _, _) in enumerate(LAY):
    inner = {"bot": '<u></u>', "bat": '<em></em><em></em><em></em>', "mb": chips, "kb": f'<div class="keys">{keys}</div><div class="tp"></div>',
             "dp": '<div class="glass"></div>'}[cls]
    lay_html += f'<div class="ly {cls}" id="ly{i}">{inner}</div>'
labels = "".join(f'<div class="lb" id="lb{i}" style="top:{1340 + 74 * (4 - i)}px"><b>0{len(LAY) - i}</b><div><div class="n">{n}</div><div class="s">{s}</div></div></div>'
                 for i, (_, n, s) in enumerate(LAY))
R3 = ('<div class="r" id="r3" style="background:radial-gradient(90% 60% at 50% 45%,#2a2e35,#0c0d10)">'
      '<div id="tdh">TEARDOWN<span>notebook · 5 layers</span></div>'
      f'<div id="scene3"><div id="stk">{lay_html}</div></div>{labels}</div>')

# ---------------------------------------------------------------- R4 receipt
items = [("INK WASH", "01"), ("HEADLINE", "02"), ("STAT CHART", "03"), ("TEARDOWN", "04"), ("RECEIPT", "05")]
bars = "".join(f'<i style="width:{w}px"></i>' for w in [6, 3, 3, 8, 3, 5, 3, 3, 7, 4, 3, 6, 3, 8, 3, 4, 6, 3, 3, 7, 5, 3, 6, 3, 4, 8, 3, 5, 3, 6])
rlines = ('<div class="c b">STYLE STUDIO</div><div class="c">made with Claude Code</div><div class="c">--------------------------------</div>'
          '<div class="row"><span>ORDER</span><span>#0005</span></div><div class="row"><span>DATE</span><span>NOV 03</span></div>'
          '<div class="c">--------------------------------</div>'
          + "".join(f'<div class="row itm"><span>1x {n}</span><span>/{n.lower().replace(" ", "-")}</span></div>' for n, _ in items)
          + '<div class="c">================================</div>'
          '<div class="row b big"><span>TOTAL</span><span>5 STYLES</span></div><div class="row"><span>PAID WITH</span><span>1 PROMPT</span></div>'
          '<div class="c">--------------------------------</div>'
          f'<div class="bc">{bars}</div><div class="c">THANK YOU · COME AGAIN</div>')
R4 = ('<div class="r" id="r4" style="background:linear-gradient(180deg,#d9d4ca,#bdb7ab)">'
      '<div id="pr"><div class="sl"></div><div class="led"></div></div>'
      f'<div id="rcw"><div id="rc">{"".join(f"<div class=rl>{l}</div>" if False else "" for l in [])}{rlines}<div class="zz"></div></div></div></div>')

RES = [R0, R1, R2, R3, R4]

# ---------------------------------------------------------------- chat UI
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
KEYPOS["-"] = (840, y3)

ui = ['<div class="ui" id="ui">',
      '<div id="sb"><span>9:41</span><span>●●● <i></i></span></div>',
      '<div id="menu"></div><div id="tabs"><span>Chat</span><span class="on">Code</span></div><div id="ctr"><b id="cn">1/5</b></div>',
      '<div id="ub"><span id="ubt"></span></div><div id="run">' + SPARK + '<span id="runt"></span></div>',
      '<div id="chipc">' + SPARK + '<div><div class="n" id="chn"></div><div class="d" id="chd"></div></div></div>',
      '<div id="inp"><span id="it"></span><span class="car"></span><span class="plus">+</span><div class="snd" id="snd"></div></div>',
      '<div id="kbw"><div id="kb"></div><div id="sug"></div>' + "".join(keys_html) + '<div id="pop"></div></div>',
      '<div id="bot">Reply…</div></div>']
stages = "".join(f'<div class="stage" id="st{k}">{R}</div>' for k, R in enumerate(RES))
thumbs = "".join(f'<div class="th" id="th{k}" style="left:{x}px;top:{y}px"><img src="assets/th{k}.jpg" alt=""></div>'
                 for k, (x, y) in enumerate([(90, 760), (390, 760), (690, 760), (240, 1230), (540, 1230)]))
end = ('<div id="end">' + SPARK + '<div class="c" id="e1">Comment “STYLES”</div><div class="pill" id="e2">for every style\'s prompt</div>'
       + thumbs + '</div>')
F.clip(0, "".join(ui) + stages + end)

CSS = r"""
:root{--paper:#121212}
html,body,#root{background:#121212!important}
#grid,#stars{display:none}
#vig{background:radial-gradient(120% 80% at 50% 40%,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%)}
#grain{display:none}
#handle{top:1700px;font-size:28px;padding:10px 28px;opacity:0;z-index:50}
.full{position:absolute;inset:0;width:1080px;height:1920px}
.ui{position:absolute;inset:0;font-family:var(--sans);color:#ececec}
#sb{position:absolute;left:70px;right:70px;top:34px;display:flex;justify-content:space-between;font-weight:700;font-size:34px}
#sb i{display:inline-block;width:46px;height:22px;border:3px solid #ececec;border-radius:7px;margin-left:14px;position:relative;top:3px}
#sb i::after{content:'';position:absolute;left:3px;top:3px;bottom:3px;width:30px;background:#ececec;border-radius:3px}
#tabs{position:absolute;left:50%;top:110px;transform:translateX(-50%);display:flex;background:#232323;border-radius:999px;padding:6px;font-weight:600;font-size:30px}
#tabs span{padding:10px 30px;border-radius:999px;color:#8d8d8d}#tabs span.on{background:#3a3a3a;color:#fff}
#menu{position:absolute;left:70px;top:112px;width:64px;height:64px;border-radius:50%;background:#232323}
#menu::after{content:'';position:absolute;left:20px;top:24px;width:24px;height:16px;border-top:3px solid #ccc;border-bottom:3px solid #ccc}
#ctr{position:absolute;right:70px;top:112px;height:64px;min-width:64px;border-radius:32px;background:#232323;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:28px;padding:0 18px}
#inp{position:absolute;left:70px;right:70px;top:1150px;height:170px;background:#1f1f1f;border-radius:34px;border:2px solid #2c2c2c;padding:26px 30px;font-size:42px}
#inp .ph{color:#6b6b6b}#inp .cmd{color:#ff6a3d;font-weight:600}
#inp .car{display:inline-block;width:4px;height:46px;background:#ff6a3d;vertical-align:-8px;margin-left:3px}
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
#ub{position:absolute;right:70px;top:210px;background:#ff6a3d22;border:2px solid #ff6a3d55;color:#ff7a50;border-radius:999px;padding:10px 26px;font-size:32px;font-weight:600;opacity:0}
#run{position:absolute;left:70px;top:300px;font-size:30px;color:#9a9a9a;display:flex;align-items:center;gap:14px;opacity:0}
#run svg{width:38px;height:38px}
#bot{position:absolute;left:70px;right:70px;top:1720px;height:100px;background:#1f1f1f;border-radius:30px;border:2px solid #2c2c2c;color:#6b6b6b;font-size:34px;display:flex;align-items:center;padding-left:30px;opacity:0}
.stage{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden;opacity:0;transform-origin:540px 900px;border-radius:0}
.ld{position:absolute;inset:0;z-index:20;background:#1d1d1d radial-gradient(circle,#4a4a4a 3px,transparent 3.5px) 0 0/22px 22px}
.r{position:absolute;inset:0;overflow:hidden}
/* R0 ink */
.pgrain{position:absolute;inset:0;background:url(assets/noise.png);opacity:.18;mix-blend-mode:multiply}
#vt{position:absolute;left:150px;top:300px;writing-mode:vertical-rl;font-family:var(--serif);font-size:44px;letter-spacing:.5em;color:#2b2825}
#vt span{display:inline-block;opacity:0}
#seal{position:absolute;left:138px;top:1010px;width:76px;height:76px;border:4px solid #b8322a;color:#b8322a;font-size:46px;display:flex;align-items:center;justify-content:center;border-radius:8px;opacity:0;font-family:var(--serif)}
/* R1 newspaper */
#np{position:absolute;left:110px;top:300px;width:860px;background:#f4f0e6;padding:46px 50px 60px;color:#151311;box-shadow:0 60px 120px rgba(0,0,0,.6);transform:rotate(-3deg)}
#np .mh{font-family:var(--serif);font-weight:700;font-size:84px;text-align:center;letter-spacing:-.01em;border-bottom:4px double #151311;padding-bottom:10px}
#np .dl{display:flex;justify-content:space-between;font-family:var(--mono);font-size:20px;padding:10px 0;border-bottom:2px solid #151311;margin-bottom:26px}
#np .kick{font-family:var(--mono);font-size:22px;color:#a3281d;margin-bottom:10px;font-weight:700}
#np .hd{font-family:var(--serif);font-weight:700;font-size:66px;line-height:1.02;letter-spacing:-.01em}
#np .by{display:flex;align-items:center;gap:14px;font-size:22px;color:#55504a;margin:22px 0 20px}
#np .by i{width:40px;height:40px;border-radius:50%;background:#bdb5a6}
#np .bd{font-family:var(--serif);font-size:34px;line-height:1.38;text-align:justify}
#np .dc{float:left;font-size:120px;line-height:.85;margin:6px 12px 0 0;font-weight:700}
.hl1,.hl2{background-image:linear-gradient(transparent 12%,#d7f34a 12%,#d7f34a 88%,transparent 88%);background-repeat:no-repeat;background-size:0% 100%;-webkit-box-decoration-break:clone;box-decoration-break:clone}
/* R2 chart */
#nw{position:absolute;left:90px;top:300px;font-family:var(--mono);font-weight:700;font-size:28px;color:#fff;display:flex;align-items:center;gap:14px;width:900px}
#nw b{width:26px;height:26px;border-radius:6px;background:#ff5a2a}
#nw span{margin-left:auto;font-size:22px;color:#77808e;border:2px solid #2a303a;border-radius:8px;padding:4px 12px}
#lab2{position:absolute;left:90px;top:390px;font-size:32px;color:#8b93a1}
#ctr2{position:absolute;left:80px;top:430px;font-weight:800;font-size:220px;letter-spacing:-.05em;color:#fff;line-height:1}
#ctr2 sup{font-size:110px;vertical-align:top;position:relative;top:20px;margin-right:6px}#ctr2 small{font-size:120px}
#tag2{position:absolute;left:90px;top:680px;font-size:28px;color:#fff;background:#ff5a2a;border-radius:8px;padding:6px 14px;font-weight:700;opacity:0}
#ann2{position:absolute;text-align:center;width:460px;opacity:0}
#ann2 b{display:block;font-family:var(--mono);font-size:26px;color:#ff5a2a}#ann2 span{font-size:30px;color:#fff;font-weight:700}
#mo2{position:absolute;left:90px;right:80px;top:1560px;display:flex;justify-content:space-between;font-family:var(--mono);font-size:24px;color:#5f6773}
/* R3 teardown */
#tdh{position:absolute;left:90px;top:250px;font-weight:800;font-size:56px;color:#fff;letter-spacing:.02em}
#tdh span{display:block;font-family:var(--mono);font-weight:500;font-size:26px;color:#8a919c;letter-spacing:0;margin-top:6px}
#scene3{position:absolute;left:170px;top:640px;width:700px;height:700px;perspective:2600px}
#stk{position:absolute;left:150px;top:260px;width:560px;height:380px;transform-style:preserve-3d;transform:rotateX(58deg) rotateZ(-36deg) scale(.8)}
.ly{position:absolute;inset:0;border-radius:26px;transform-style:preserve-3d}
.ly.bot{background:linear-gradient(135deg,#d3d6db,#9da1a8);box-shadow:0 0 0 3px #7d8188 inset}
.ly.bot u{position:absolute;left:40px;right:40px;top:30px;bottom:30px;border-radius:18px;border:3px solid rgba(0,0,0,.18)}
.ly.bat{background:transparent}
.ly.bat em{position:absolute;top:40px;bottom:40px;width:150px;border-radius:12px;background:linear-gradient(180deg,#2c3038,#1a1d22);box-shadow:0 0 0 3px #3c414a inset}
.ly.bat em:nth-child(1){left:40px}.ly.bat em:nth-child(2){left:205px}.ly.bat em:nth-child(3){left:370px}
.ly.mb{background:#14532f;border-radius:18px;box-shadow:0 0 0 3px #2b7a4c inset;inset:20px 60px 40px 60px}
.ly.mb i{position:absolute;background:#0b0c0e;border-radius:6px;box-shadow:0 0 0 3px #3a3f46 inset}
.ly.kb{background:linear-gradient(135deg,#e2e4e8,#b5b9c0);box-shadow:0 0 0 3px #8c9097 inset}
.ly.kb .keys{position:absolute;left:30px;right:30px;top:24px;height:190px;display:grid;grid-template-columns:repeat(12,1fr);gap:6px}
.ly.kb .keys i{background:#2a2c30;border-radius:5px}
.ly.kb .tp{position:absolute;left:170px;right:170px;top:236px;bottom:24px;border-radius:12px;background:#c9ccd2;box-shadow:0 0 0 2px #9da1a8 inset}
.ly.dp{background:#0b0c0f;box-shadow:0 0 0 6px #2b2e33 inset}
.ly.dp .glass{position:absolute;inset:22px;border-radius:12px;background:linear-gradient(130deg,#1b2a44 0%,#0a0d14 55%,#24324b 100%)}
.lb{position:absolute;z-index:5;left:110px;display:flex;gap:16px;align-items:flex-start;opacity:0;width:860px}
.lb b{font-family:var(--mono);font-size:26px;color:#ff6a3d;padding-top:6px}
.lb .n{font-weight:700;font-size:38px;color:#fff}.lb .s{font-family:var(--mono);font-size:24px;color:#8a919c;margin-top:4px}
.lb::before{display:none}
.lb>div{display:flex;align-items:baseline;gap:18px}
/* R4 receipt */
#pr{position:absolute;left:150px;top:250px;width:780px;height:150px;border-radius:40px;background:linear-gradient(180deg,#2b2b2e,#151517);box-shadow:0 40px 80px rgba(0,0,0,.45);z-index:3}
#pr .sl{position:absolute;left:60px;right:60px;bottom:30px;height:14px;border-radius:7px;background:#000}
#pr .led{position:absolute;right:50px;top:40px;width:18px;height:18px;border-radius:50%;background:#3dff7a;box-shadow:0 0 16px #3dff7a}
#rcw{position:absolute;left:220px;top:392px;width:640px;height:1300px;overflow:hidden;transform-origin:50% 0}
#rc{position:absolute;left:0;top:0;width:640px;background:#fbfaf6;padding:50px 46px 70px;font-family:var(--mono);font-size:31px;color:#1b1b1b;line-height:1.55;box-shadow:0 30px 60px rgba(0,0,0,.25)}
#rc .c{text-align:center;white-space:nowrap;overflow:hidden}#rc .b{font-weight:800}
#rc .row{display:flex;justify-content:space-between}#rc .row span:last-child{color:#555}
#rc .big{font-size:40px;margin:6px 0}
#rc .bc{display:flex;justify-content:center;gap:3px;height:110px;margin:24px 0 14px}#rc .bc i{background:#1b1b1b;display:block}
#rc .zz{position:absolute;left:0;right:0;bottom:-18px;height:20px;background:linear-gradient(-45deg,transparent 14px,#fbfaf6 0) 0 0/28px 20px,linear-gradient(45deg,transparent 14px,#fbfaf6 0) 0 0/28px 20px}
/* end */
#end{position:absolute;inset:0;background:#121212;opacity:0;font-family:var(--sans);z-index:30}
#end svg{position:absolute;left:490px;top:300px;width:100px;height:100px}
#end .c{position:absolute;left:0;right:0;top:430px;text-align:center;font-weight:800;font-size:96px;color:#fff;letter-spacing:-.03em}
#end .pill{position:absolute;left:50%;top:570px;transform:translateX(-50%);background:#ff4b1f;color:#fff;font-weight:800;font-size:46px;padding:10px 32px;border-radius:16px;white-space:nowrap}
.th{position:absolute;width:280px;height:430px;border-radius:24px;overflow:hidden;background:#222;box-shadow:0 30px 60px rgba(0,0,0,.7),0 0 0 2px #2a2a2a}
.th img{width:100%;height:100%;object-fit:cover}
"""

JS = r"""
const TY=__TY__, KP=__KP__, NN=TY.length, END=__END__;
const it=document.getElementById('it'), chn=document.getElementById('chn'), chd=document.getElementById('chd'), sug=document.getElementById('sug'),
      pop=document.getElementById('pop'), cn=document.getElementById('cn'), ubt=document.getElementById('ubt'), runt=document.getElementById('runt');
let lastKey='';
function apply(t){
  let d=TY[0], k=0; for(let i=0;i<NN;i++){ if(TY[i].T<=t){ d=TY[i]; k=i; } }
  let html='<span class="ph">Reply…</span>', sg='', pk='';
  if(t>=d.slash && t<d.send){ const n=Math.max(0,Math.min(d.cmd.length,Math.floor((t-d.c0)/0.05)+1)); const s=t<d.c0?'':d.cmd.slice(0,n);
    html='<span class="cmd">/'+s+'</span>'; sg='"/'+s+'"'; const ch=t<d.c0?'':d.cmd[n-1]; if(ch&&KP[ch]&&(t-d.c0-(n-1)*0.05)<0.06) pk=ch; }
  const key=[k,html,sg,pk].join('|'); if(key===lastKey) return; lastKey=key;
  it.innerHTML=html; sug.textContent=sg; cn.textContent=(k+1)+'/'+NN;
  chn.textContent='/'+d.cmd; chd.textContent=d.desc; ubt.textContent='/'+d.cmd; runt.textContent='Animating with /'+d.cmd+'…';
  if(pk){ const p=KP[pk]; pop.textContent=pk; pop.style.left=(p[0]-12)+'px'; pop.style.top=(p[1]-120)+'px'; pop.style.opacity=1; } else pop.style.opacity=0;
}
const clock={t:0}; tl.fromTo(clock,{t:0},{t:DUR,duration:DUR,ease:'none',onUpdate:()=>apply(clock.t)},0); apply(0);
const NI={immediateRender:false};
function F2(sel,f,t,at){ return tl.fromTo(sel,f,Object.assign({},t,NI),at); }
TY.forEach((d,k)=>{
  // back to chat (hard cut from previous fullscreen result)
  if(k){ tl.set('#st'+(k-1),{opacity:0},d.T); tl.set(['#kbw','#inp'],{y:0,opacity:1},d.T); tl.set(['#ub','#run','#bot'],{opacity:0},d.T); }
  F2('#chipc',{opacity:0,y:30},{opacity:1,y:0,duration:.2,ease:'power2.out'},d.slash);
  tl.set('#snd',{backgroundColor:'#ff4b1f'},d.c0);
  tl.set('#chipc',{opacity:0},d.send);
  tl.to('#snd',{scale:.85,duration:.06,yoyo:true,repeat:1},d.send-0.08);
  F2(['#kbw','#inp'],{y:0,opacity:1},{y:620,opacity:0,duration:.3,ease:'power3.in'},d.send);
  F2('#ub',{opacity:0,y:30,scale:.9},{opacity:1,y:0,scale:1,duration:.25,ease:'back.out(2)'},d.send);
  F2('#run',{opacity:0,x:-20},{opacity:1,x:0,duration:.2},d.send+0.06);
  F2('#bot',{opacity:0},{opacity:1,duration:.2},d.send+0.15);
  tl.set('#snd',{backgroundColor:'#3a3a3a'},d.send+0.3);
  // card in chat, then fullscreen
  F2('#st'+k,{opacity:0,scale:.5,y:120,borderRadius:60},{opacity:1,scale:.56,y:80,borderRadius:60,duration:.3,ease:'back.out(1.6)'},d.card);
  F2('#st'+k,{scale:.56,y:80,borderRadius:60},{scale:1,y:0,borderRadius:0,duration:.42,ease:'expo.inOut'},d.full);
});
tl.set(['#st0','#st1','#st2','#st3','#st4'],{opacity:0},0);
tl.set(['#kbw','#inp'],{y:0,opacity:1},0);
tl.set('#snd',{backgroundColor:'#3a3a3a'},0);
// ---------- R0 ink-wash
{ const a=TY[0].card;
  [3,2,1,0].forEach((i,j)=>F2('#mt'+i,{opacity:0,y:120},{opacity:[.75,.8,.85,.9][i],y:0,duration:1.1,ease:'power2.out'},a+0.05+j*0.12));
  F2('#mt3',{x:0},{x:-30,duration:2.6,ease:'none'},a); F2('#mt1',{x:0},{x:20,duration:2.6,ease:'none'},a);
  F2('#sun',{attr:{cy:860},opacity:0},{attr:{cy:700},opacity:1,duration:2.2,ease:'power2.out'},a);
  F2('#mi0',{attr:{cx:200}},{attr:{cx:420},duration:2.8,ease:'none'},a); F2('#mi1',{attr:{cx:900}},{attr:{cx:700},duration:2.8,ease:'none'},a);
  F2('#boat',{x:180,y:1520},{x:520,y:1520,duration:2.8,ease:'none'},a);
  F2('#birds',{x:560,y:560},{x:820,y:500,duration:2.8,ease:'none'},a);
  document.querySelectorAll('#vt span').forEach((s,i)=>F2(s,{opacity:0,y:-10},{opacity:1,y:0,duration:.25},a+0.55+i*0.06));
  F2('#seal',{opacity:0,scale:1.6},{opacity:1,scale:1,duration:.25,ease:'back.out(3)'},a+1.7); }
// ---------- R1 headline
{ const a=TY[1].card;
  F2('#np',{scale:1.25,y:160,rotation:-6},{scale:1,y:0,rotation:-3,duration:2.6,ease:'power3.out'},a);
  F2('#hl1',{backgroundSize:'0% 100%'},{backgroundSize:'100% 100%',duration:.7,ease:'power1.inOut'},a+0.95);
  F2('#hl2',{backgroundSize:'0% 100%'},{backgroundSize:'100% 100%',duration:.55,ease:'power1.inOut'},a+1.75); }
// ---------- R2 stat-chart
{ const a=TY[2].card, cv=document.getElementById('cv'), O={v:.4};
  const L1=document.getElementById('ln1'), L2=document.getElementById('ln2'); const l1=L1.getTotalLength(), l2=L2.getTotalLength();
  F2(L1,{strokeDasharray:l1,strokeDashoffset:l1},{strokeDashoffset:0,duration:.9,ease:'none'},a);
  F2(L2,{strokeDasharray:l2,strokeDashoffset:l2},{strokeDashoffset:0,duration:1.0,ease:'power2.in'},a+0.95);
  F2('#dot2',{scale:0,transformOrigin:'50% 50%'},{scale:1,duration:.3,ease:'back.out(3)'},a+0.85);
  F2('#vl2',{opacity:0},{opacity:1,duration:.3},a+0.9); F2('#ann2',{opacity:0,y:20},{opacity:1,y:0,duration:.3},a+0.95);
  F2(O,{v:.4},{v:4.2,duration:2.0,ease:'power2.in',onUpdate:()=>{cv.textContent=O.v.toFixed(1)}},a+0.1);
  F2('#tag2',{opacity:0,x:-20},{opacity:1,x:0,duration:.25},a+2.0); }
// ---------- R3 teardown
{ const a=TY[3].card; const Z=[0,150,300,450,600];
  [0,1,2,3,4].forEach(i=>{ F2('#ly'+i,{z:i*6},{z:Z[i],duration:1.1,ease:'expo.out'},a+0.45+ (4-i)*0.08);
    F2('#lb'+i,{opacity:0,x:40},{opacity:1,x:0,duration:.3,ease:'power2.out'},a+0.9+(4-i)*0.14); });
  F2('#stk',{rotationZ:-30,rotationX:52,scale:.8},{rotationZ:-40,rotationX:58,scale:.8,duration:2.8,ease:'power1.out'},a); }
// ---------- R4 receipt
{ const a=TY[4].card;
  F2('#rcw',{height:0},{height:1300,duration:2.0,ease:'steps(30)'},a+0.1);
  F2('#pr .led',{opacity:1},{opacity:.3,duration:.12,yoyo:true,repeat:9},a);
  F2('#rc',{y:0},{y:14,duration:.2,ease:'back.out(3)'},a+2.15); }
// ---------- end card
tl.set('#st4',{opacity:0},END); tl.set('#ui',{opacity:0},END);
F2('#end',{opacity:0},{opacity:1,duration:.15},END);
F2('#end svg',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.45,ease:'back.out(2)'},END+0.05);
F2('#e1',{opacity:0,y:40},{opacity:1,y:0,duration:.35,ease:A},END+0.1);
F2('#e2',{opacity:0,scale:.6},{opacity:1,scale:1,duration:.35,ease:'back.out(2)'},END+0.25);
[0,1,2,3,4].forEach(k=>F2('#th'+k,{opacity:0,y:200,rotation:(k%2?6:-6)},{opacity:1,y:0,rotation:0,duration:.5,ease:'back.out(1.4)'},END+0.3+k*0.08));
F2('#handle',{opacity:0},{opacity:1,duration:.3},END+0.5);
tl.set(['#end','#e1','#e2','#th0','#th1','#th2','#th3','#th4','#handle'],{opacity:0},0);
"""
JS = JS.replace("__TY__", json.dumps(TY)).replace("__KP__", json.dumps(KEYPOS)).replace("__END__", str(END))
F.write(CSS, JS, music_vol=0.12)
# hyperframes motion blur leaves dark boxes on small moving elements in this dark UI: turn it off for this film
_ix = W / "index.html"; _ix.write_text(_ix.read_text().replace('data-motion-blur="on"', 'data-motion-blur="off"'))
