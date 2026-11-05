"""agentdesk - Agent Desktop (vercel-labs/agent-desktop): computer use for AI agents through the OS accessibility tree (new ability).
Facts (README, 2026-11-05): "Computer use for AI agents: see and operate desktop apps on macOS, Windows, and Linux through the OS
accessibility tree"; "gives an AI agent computer use without screenshots or pixel matching. It reads the accessibility tree of a
desktop app and returns it as JSON, with a ref for every element the agent can act on. The agent clicks or types on a ref, reads
the UI again to check the result, and repeats." Snapshot JSON sample (window "Downloads", treeitem "Documents", ref_id
"@s8f3k2p9:e8") is from the README. Vercel Labs product badge. Apache-2.0.
Media: the repo's own demo videos (assets/Videos: "Muse using agent-desktop", "Drag and Drop", "Codex using agent-desktop"),
cropped + sped up; credited on screen. Rest drawn in code. Series "Free AI tool #1"."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, chip, series, FOLLOW_LINE

W = HERE.parent.parent / "work" / "agentdesk"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", tail=1.4)
F.scenes([0, 8, 17, 31, 43, 49], hold=0.12)

CSS = r"""
.vcard{position:absolute;overflow:hidden;background:#111;border-radius:28px;box-shadow:0 60px 90px -24px rgba(0,0,0,.42),0 16px 28px -12px rgba(0,0,0,.18)}
.vcard video{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover}
.cred{position:absolute;left:18px;bottom:14px;font-family:var(--mono);font-size:20px;color:#fff;background:rgba(0,0,0,.55);padding:4px 10px;border-radius:8px;z-index:3}
#name{position:absolute;left:110px;top:330px;width:860px;height:300px;padding:56px 60px}
#name .t{font-weight:800;font-size:104px;letter-spacing:-.05em;line-height:1}
#name .s{font-family:var(--mono);font-size:30px;color:#6f6f6f;margin-top:22px}
#vl{font-size:44px}
#shot{position:absolute;left:600px;top:690px;width:250px;height:250px;border-radius:52px;background:linear-gradient(160deg,#fff,#f1f1f1);padding:50px;
 box-shadow:0 50px 70px -22px rgba(0,0,0,.30),0 12px 22px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04)}
#shot svg{width:100%;height:100%}
#slash{position:absolute;left:585px;top:805px;width:280px;height:16px;background:#ff4b1f;border-radius:8px;transform-origin:0 50%;transform:rotate(-45deg) translate(-40px,110px)}
#tree{position:absolute;left:90px;top:280px;width:900px;height:560px;padding:44px 48px;font-family:var(--mono)}
#tree .h{font-size:24px;color:#9a9a9a;margin-bottom:24px;font-weight:600}
.nd{position:relative;display:flex;align-items:center;gap:18px;height:84px;font-size:34px;font-weight:600;opacity:0}
.nd i{font-style:normal;color:#9a9a9a;font-weight:500}
.nd .role{background:#111;color:#fff;border-radius:10px;padding:4px 14px;font-size:28px}
.nd.c{margin-left:70px}
.nd.c::before{content:'';position:absolute;left:-44px;top:-42px;width:30px;height:84px;border-left:3px solid #cfcfcf;border-bottom:3px solid #cfcfcf;border-bottom-left-radius:12px}
.ref{position:absolute;right:0;background:#ff4b1f;color:#fff;font-weight:700;font-size:30px;padding:8px 18px;border-radius:999px;opacity:0;box-shadow:0 14px 24px -10px rgba(255,75,31,.6)}
.step{position:absolute;display:flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:16px 30px 16px 18px;font-family:var(--mono);font-weight:700;font-size:32px;white-space:nowrap;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.30),0 0 0 1px rgba(0,0,0,.04)}
.step b{width:52px;height:52px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--sans);font-size:28px}
.step.ok b{background:#2e9e4a}
#c1,#c2,#c3{font-size:48px}
#fol{top:1250px}
#field{top:640px}
"""
SHOT = ('<svg viewBox="0 0 100 100" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">'
        '<path d="M14 34V18h16M70 18h16v16M86 66v16H70M30 82H14V66"/><circle cx="50" cy="50" r="13"/></svg>')
VIDS = [("muse", 0, 160, 300, 760, 653), ("dnd", 3, 70, 300, 520, 562), ("codex", 4, 110, 300, 860, 484)]

F.body.append('<div class="layer" id="serl">' + series("Free AI tool", 1, x=70, y=190) + '</div>')
F.clip(0, F.block([[(0, 3, "")], [(4, 5, ""), (6, 7, "hl")]], top=1010, size=92))
F.clip(1, '<div id="name" class="card"><div class="t">Agent Desktop</div><div class="s">github.com/vercel-labs/agent-desktop</div></div>'
          + chip("vl", "Vercel Labs", 110, 700, "▲", "#111") + f'<div id="shot">{SHOT}</div><div id="slash"></div>'
       + F.block([[(8, 9, "b"), (10, 12, "")], [(13, 14, ""), (15, 16, "hl")]], top=1010, size=82))
nodes = [("window", '"Downloads"', "", "@e1"), ("button", '"Back"', "c", "@e4"), ("treeitem", '"Documents"', "c", "@e8"),
         ("textfield", '"Search"', "c", "@e9"), ("button", '"Share"', "c", "@e12")]
tree = '<div id="tree" class="card"><div class="h">snapshot --app Finder -i</div>' + "".join(
    f'<div class="nd {c}" id="n{k}"><span class="role">{r}</span>{nm}<span class="ref" id="r{k}">{ref}</span></div>'
    for k, (r, nm, c, ref) in enumerate(nodes)) + '</div>'
F.clip(2, tree + F.block([[(17, 20, "")], [(21, 22, "hl")], [(23, 26, "")], [(27, 28, ""), (29, 30, "hl")]], top=880, size=66))
F.clip(3, '<div class="step" id="p1" style="left:620px;top:400px"><b>1</b>click @e8</div>'
          '<div class="step" id="p2" style="left:620px;top:560px"><b>2</b>snapshot again</div>'
          '<div class="step ok" id="p3" style="left:620px;top:720px"><b>✓</b>it worked</div>'
       + F.block([[(31, 34, "")], [(35, 38, "")], [(39, 40, ""), (41, 42, "hl")]], top=1000, size=80))
F.clip(4, chip("c1", "macOS", 70, 820, "⌘", "#111") + chip("c2", "Windows", 380, 820, "▦", "#2f6bff") + chip("c3", "Linux", 740, 820, "◆", "#ff4b1f")
       + F.block([[(43, 44, "")], [(45, 48, "hl")]], top=1010, size=88))
F.clip(5, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(49, 49, ""), (50, 50, "hl")], [(51, 56, "")]], top=900, size=84) + FOLLOW_LINE.replace('class="follow"', 'class="follow" id="fol"'))

for k, (nm, n, x, y, w, h) in enumerate(VIDS):
    F.body.append(f'<div id="vw_{nm}" class="vcard" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">'
                  f'<video id="v_{nm}" class="clip" src="assets/v-{nm}.mp4" data-start="{F.ST[n]}" data-duration="{round(F.EN[n] - F.ST[n], 2)}" '
                  f'data-track-index="{30 + k}" muted playsinline></video><div class="cred">video: vercel-labs/agent-desktop</div></div>')

S = F.S
for i in (6, 9, 11, 15, 21, 25, 33, 35, 40, 45, 46, 48, 50):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 real demo is already playing at t=0, slow push
ft('#vw_muse',{opacity:1,y:10,scale:.97,rotationX:0},{opacity:1,y:0,scale:1.03,duration:ST[1],ease:'none'},0);
outUp('#vw_muse',ST[1]);
starPass('#st1',ST[1]-0.3,[760,-700,0],[600,-520,40],10,1.2);
// S1 name card, Vercel Labs chip, screenshot icon gets struck through
ft('#name',{opacity:0,y:120,rotationX:30,transformPerspective:1400,filter:'blur(12px)'},{opacity:1,y:0,rotationX:0,filter:'blur(0px)',duration:.7,ease:A},ST[1]+0.02);
popIn('#vl',S[11]-0.15,{y:60,s:.6,r:-6});
popIn('#shot',S[15]-0.2,{y:60,s:.5,r:8});
ft('#slash',{scaleX:0},{scaleX:1,duration:.3,ease:'power3.out'},S[16]-0.05);
outUp(['#name','#vl','#shot','#slash'],ST[2]);
// S2 accessibility tree builds, then every element gets its ref
ft('#tree',{opacity:0,y:140,scale:.9,filter:'blur(14px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.6,ease:A},ST[2]+0.02);
[0,1,2,3,4].forEach(k=>ft('#n'+k,{opacity:0,x:-40},{opacity:1,x:0,duration:.35,ease:A},S[21]+k*0.14));
[0,1,2,3,4].forEach(k=>ft('#r'+k,{opacity:0,scale:.3,x:40},{opacity:1,scale:1,x:0,duration:.45,ease:'back.out(2.2)'},S[25]+k*0.22));
outUp('#tree',ST[3]);
starPass('#st2',ST[3]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S3 real drag & drop demo + the loop
ft('#vw_dnd',{opacity:0,y:200,rotationY:25,transformPerspective:1400},{opacity:1,y:0,rotationY:0,duration:.7,ease:A},ST[3]+0.02);
popIn('#p1',S[33]-0.12,{y:40,s:.6,r:-5}); popIn('#p2',S[35]-0.12,{y:40,s:.6,r:4}); popIn('#p3',S[40]-0.12,{y:40,s:.6,r:-4});
outUp(['#vw_dnd','#p1','#p2','#p3'],ST[4]);
// S4 Codex demo + OS chips
ft('#vw_codex',{opacity:0,scale:.8,y:120,filter:'blur(12px)'},{opacity:1,scale:1,y:0,filter:'blur(0px)',duration:.6,ease:A},ST[4]+0.02);
popIn('#c1',S[45]-0.15,{y:60,s:.6,r:-6}); popIn('#c2',S[46]-0.15,{y:60,s:.6,r:6}); popIn('#c3',S[48]-0.15,{y:60,s:.6,r:-4});
outUp(['#vw_codex','#c1','#c2','#c3'],ST[5]);
starPass('#st3',ST[5]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S5 CTA + follow line
cta('DESKTOP',S[50]);
ft('#fol',{opacity:0,y:30},{opacity:.85,y:0,duration:.4,ease:A},S[53]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[56]+0.15);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
