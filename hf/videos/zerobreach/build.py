"""zerobreach - Zero Breach Toolkit (fear angle, Paper). github.com/interplains/Zero-Breach-Toolkit, Apache-2.0.
Facts (README): "A free, open-source check for traces of known mercenary spyware (Pegasus, Predator, Graphite, Candiru and
others) on computers, Android phones and iPhone backups." "choose a check, press Start check, and read the result. It tells
you in plain words whether anything was found"; checks Quick / Standard / Full; "No network requests during a scan ... no
upload feature"; "A green result is good news, not a guarantee." The repo has no screenshots: every visual is drawn in code
(generic phone, tiles, a simplified check window that is NOT a screenshot of the app)."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "zerobreach"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json",
         display={52: "ZEROBREACH"}, tail=1.0)
F.scenes([0, 7, 13, 20, 27, 32, 42, 45, 51], hold=0.12)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
#phone{position:absolute;left:330px;top:250px;width:420px;height:760px;border-radius:70px;background:#141414;padding:20px;
 box-shadow:0 70px 100px -24px rgba(0,0,0,.45),0 20px 30px -12px rgba(0,0,0,.25)}
#scr{position:absolute;left:20px;top:20px;right:20px;bottom:20px;border-radius:52px;background:linear-gradient(170deg,#2a2a2a,#161616);overflow:hidden}
#scr .ap{position:absolute;width:86px;height:86px;border-radius:22px;background:#3a3a3a}
#bug{position:absolute;left:105px;top:250px;width:170px;height:170px;border-radius:50%;background:#ff4b1f;display:flex;align-items:center;justify-content:center;
 box-shadow:0 0 0 0 rgba(255,75,31,.6)}
#bug svg{width:110px;height:110px}
#ring{position:absolute;left:105px;top:250px;width:170px;height:170px;border-radius:50%;border:6px solid #ff4b1f}
.tag{position:absolute;background:#ff4b1f;color:#fff;font-weight:800;font-size:46px;padding:10px 26px;border-radius:14px;white-space:nowrap;box-shadow:0 20px 30px -12px rgba(255,75,31,.6)}
.wtag{position:absolute;background:#fff;color:#111;font-weight:800;font-size:40px;padding:10px 24px;border-radius:14px;white-space:nowrap;
 box-shadow:0 24px 40px -14px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05)}
#free{position:absolute;left:690px;top:330px;background:#ff4b1f;color:#fff;font-weight:900;font-size:84px;padding:8px 34px;border-radius:22px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
.nm{position:absolute;font-family:var(--mono);font-weight:700;font-size:50px;padding:16px 30px;border-radius:18px;background:#141414;color:#fff;white-space:nowrap;
 box-shadow:0 30px 50px -16px rgba(0,0,0,.45)}
.nm s{color:#ff4b1f;text-decoration:none;margin-right:14px}
.lab{position:absolute;font-weight:800;font-size:40px;text-align:center;width:300px;letter-spacing:-.02em}
#win{position:absolute;left:90px;top:280px;width:900px;height:660px;border-radius:32px;background:#fff;overflow:hidden;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.30),0 18px 30px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.05)}
#win .bar{height:64px;background:#f2f2f1;display:flex;align-items:center;gap:12px;padding-left:28px;border-bottom:1px solid #e3e3e3}
#win .bar i{width:16px;height:16px;border-radius:50%;background:#d6d6d6}
#win .bar b{margin-left:20px;font-size:28px;color:#6f6f6f;font-weight:600}
.opt{position:absolute;left:50px;width:520px;height:110px;border-radius:22px;border:3px solid #e2e2e2;display:flex;align-items:center;padding-left:34px;font-size:42px;font-weight:700}
.opt span{font-weight:500;color:#8a8a8a;font-size:30px;margin-left:18px}
#o1{border-color:#111;background:#111;color:#fff}#o1 span{color:#bbb}
#startb{position:absolute;left:620px;top:330px;width:230px;height:110px;border-radius:999px;background:#ff4b1f;color:#fff;font-weight:800;font-size:42px;display:flex;align-items:center;justify-content:center;
 box-shadow:0 24px 40px -14px rgba(255,75,31,.6)}
#cursor{position:absolute;left:820px;top:520px;width:56px;height:56px}
#res{position:absolute;left:90px;top:300px;width:900px;height:620px;border-radius:32px;background:#fff;padding:50px 56px;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.30),0 18px 30px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.05)}
#res .hd{display:flex;align-items:center;gap:28px;font-size:56px;font-weight:800;letter-spacing:-.03em}
#res .hd b{width:100px;height:100px;border-radius:50%;background:#1fae5b;display:flex;align-items:center;justify-content:center}
#res .ln{margin-top:34px;font-size:36px;line-height:1.35;color:#333;font-weight:500}
#res .bar2{margin-top:40px;height:22px;border-radius:11px;background:#ececec;overflow:hidden}
#res .bar2 i{display:block;height:100%;width:100%;background:#1fae5b;transform-origin:left}
#cloud{position:absolute;left:360px;top:300px;width:360px;height:360px}
#cross{position:absolute;left:330px;top:470px;width:420px;height:22px;border-radius:11px;background:#ff4b1f;transform:rotate(-28deg);transform-origin:center}
#gres{position:absolute;left:200px;top:300px;width:680px;height:300px;border-radius:40px;background:#1fae5b;color:#fff;display:flex;align-items:center;justify-content:center;gap:30px;
 font-weight:800;font-size:72px;box-shadow:0 50px 80px -20px rgba(31,174,91,.55)}
#gres b{font-size:96px}
#field{font-size:36px;padding-left:40px}#field #typed{font-size:42px}
#ast{position:absolute;left:740px;top:560px;font-family:var(--serif);font-style:italic;font-size:220px;color:#111;line-height:1}
.clip.layer .tag,.clip.layer .wtag,#free,.clip.layer .chip,.nm{z-index:5}
"""

BUG = ('<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">'
       '<ellipse cx="50" cy="56" rx="20" ry="26"/><path d="M50 30v52M30 46H14M30 62H14M70 46h16M70 62h16M36 26l-8-10M64 26l8-10"/></svg>')
CHECK = '<svg viewBox="0 0 100 100" width="62" height="62" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"><path d="M22 52l18 18 38-40"/></svg>'
CUR = '<svg viewBox="0 0 40 40"><path d="M6 4l26 14-12 3-5 12z" fill="#111" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></svg>'
CLOUD = ('<svg viewBox="0 0 100 100" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">'
         '<path d="M28 74h46a16 16 0 000-32 22 22 0 00-42-6 18 18 0 00-4 38z"/><path d="M50 66V44M40 53l10-10 10 10"/></svg>')

apps = "".join(f'<div class="ap" style="left:{34 + (k % 3) * 110}px;top:{70 + (k // 3) * 110}px"></div>' for k in range(9))
# S0 hook: phone with a red spyware bug, visible at t=0
F.clip(0, f'<div id="phone"><div id="scr">{apps}<div id="ring"></div><div id="bug">{BUG}</div></div></div>'
          '<div class="tag" id="t0" style="left:620px;top:300px">spyware?</div>'
       + F.block([[(0, 3, "")], [(4, 5, ""), (6, 6, "hl")]], top=1060, size=88))
# S1 tool tile + name + FREE
F.clip(1, tile("tz", "shield", 400, 300, 280, acc=True) + '<div id="free">FREE</div>'
          + chip("cz", "Zero Breach Toolkit", 190, 680, "Z", "#111")
       + F.block([[(7, 9, "hl")], [(10, 10, "b"), (11, 12, "it")]], top=1040, size=100))
# S2 known spyware names
NAMES = [("Pegasus", 120, 320), ("Predator", 520, 440), ("Graphite", 150, 600), ("Candiru", 560, 760)]
F.clip(2, "".join(f'<div class="nm" id="n{k}" style="left:{x}px;top:{y}px"><s>●</s>{n}</div>' for k, (n, x, y) in enumerate(NAMES))
       + F.block([[(13, 16, "")], [(17, 18, "it"), (19, 19, "hl")]], top=1040, size=100))
# S3 devices
F.clip(3, tile("d0", "desk", 70, 380, 270) + tile("d1", "apk", 405, 380, 270) + tile("d2", "apk", 740, 380, 270, acc=True)
          + '<div class="lab" id="l0" style="left:55px;top:690px">computer</div><div class="lab" id="l1" style="left:390px;top:690px">Android</div>'
            '<div class="lab" id="l2" style="left:725px;top:690px">iPhone backup</div>'
       + F.block([[(20, 21, ""), (22, 23, "b")], [(24, 24, ""), (25, 26, "hl")]], top=1020, size=90))
# S4 pick a check + press Start (simplified window drawn in code)
F.clip(4, '<div id="win"><div class="bar"><i></i><i></i><i></i><b>Choose a check</b></div>'
          '<div class="opt" id="o0" style="top:120px">Quick<span>browsers</span></div>'
          '<div class="opt" id="o1" style="top:260px">Standard<span>recommended</span></div>'
          '<div class="opt" id="o2" style="top:400px">Full<span>30+ min</span></div>'
          f'<div id="startb">Start</div><div id="cursor">{CUR}</div></div>'
       + F.block([[(27, 29, "")], [(30, 30, ""), (31, 31, "hl")]], top=1040, size=104))
# S5 result in plain words
F.clip(5, f'<div id="res"><div class="hd"><b>{CHECK}</b>Nothing found</div>'
          '<div class="ln">None of the published traces it looks for were found in the places it could read.</div>'
          '<div class="bar2"><i id="pb"></i></div></div>'
       + F.block([[(32, 35, "")], [(36, 38, "hl"), (39, 41, "")]], top=1040, size=90))
# S6 nothing uploaded
F.clip(6, f'<div id="cloud">{CLOUD}</div><div id="cross"></div>'
          '<div class="wtag" id="t6" style="left:300px;top:720px">no upload feature</div>'
       + F.block([[(42, 42, "b"), (43, 43, "")], [(44, 44, "hl")]], top=1020, size=110))
# S7 green is not a guarantee
F.clip(7, f'<div id="gres"><b>✓</b>clean</div><div id="ast">*</div>'
          '<div class="wtag" id="t7" style="left:250px;top:700px">good news, not proof</div>'
       + F.block([[(45, 47, "")], [(48, 49, "it"), (50, 50, "hl")]], top=1020, size=100))
# S8 CTA
F.clip(8, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(51, 51, ""), (52, 52, "hl")], [(53, 58, "")]], top=1020, size=84))

S = F.S
for i in (6, 7, 12, 13, 15, 17, 19, 21, 22, 25, 31, 36, 44, 46, 52):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 phone + bug pulse
ft('#phone',{scale:1,rotation:-4},{scale:1.05,rotation:2,duration:ST[1],ease:'none'},0);
for(let t=0;t<ST[1]-0.4;t+=0.9){ tl.fromTo('#ring',{scale:1,opacity:.9},{scale:1.9,opacity:0,duration:.85,ease:'power2.out',immediateRender:false},t); }
tl.fromTo('#bug',{scale:1},{scale:1.12,duration:.2,yoyo:true,repeat:1,ease:'power2.out'},S[4]-0.05);
popIn('#t0',0.05,{y:30,s:.5,r:8});
outUp(['#phone','#t0'],ST[1]);
starPass('#st1',ST[1]-0.3,[900,1500,0],[760,1460,50],10,1.2);
// S1
popIn('#tz',ST[1]+0.02,{y:120,s:.6,r:-10});
popIn('#cz',S[7]-0.1,{y:60,s:.7,r:-3});
ft('#free',{opacity:0,scale:2.6,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[12]-0.1);
outUp(['#tz','#cz','#free'],ST[2]);
// S2 names
[[13,0],[15,1],[17,2],[19,3]].forEach(([w,k])=>popIn('#n'+k,S[w]-0.2,{y:80,s:.6,r:(k%2?6:-6)}));
outUp(['#n0','#n1','#n2','#n3'],ST[3]);
starPass('#st2',ST[3]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S3 devices
[[20,0],[22,1],[25,2]].forEach(([w,k])=>{ popIn('#d'+k,S[w]-0.15,{y:120,s:.6,r:-8}); ft('#l'+k,{opacity:0,y:20},{opacity:1,y:0,duration:.3,ease:A},S[w]+0.1); });
outUp(['#d0','#d1','#d2','#l0','#l1','#l2'],ST[4]);
// S4 window: cursor picks Standard, then presses Start
ft('#win',{opacity:0,y:200,rotationX:25,transformPerspective:1600,scale:.88},{opacity:1,y:0,rotationX:0,scale:1,duration:.7,ease:A},ST[4]+0.02);
tl.set('#o1',{backgroundColor:'#fff',color:'#111',borderColor:'#e2e2e2'},0);
ft('#cursor',{x:0,y:0},{x:-400,y:-140,duration:.5,ease:IO},S[27]);
tl.to('#o1',{backgroundColor:'#111',color:'#fff',borderColor:'#111',duration:.12},S[29]-0.05);
tl.to('#cursor',{x:-25,y:-95,duration:.4,ease:IO},S[30]-0.1);
tl.to('#startb',{scale:.9,duration:.1,yoyo:true,repeat:1},S[31]);
tl.to('#cursor',{scale:.85,duration:.1,yoyo:true,repeat:1},S[31]);
outUp(['#win'],ST[5]);
// S5 result
ft('#res',{opacity:0,y:200,scale:.85,filter:'blur(12px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.7,ease:A},ST[5]+0.02);
ft('#pb',{scaleX:0},{scaleX:1,duration:1.0,ease:'power2.out'},ST[5]+0.2);
ft('#res .hd b',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.5,ease:'back.out(2)'},ST[5]+0.6);
outUp(['#res'],ST[6]);
starPass('#st3',ST[6]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S6 cloud crossed
popIn('#cloud',ST[6]+0.02,{y:100,s:.6,r:0});
ft('#cross',{scaleX:0},{scaleX:1,duration:.3,ease:'power3.out'},S[44]-0.1);
popIn('#t6',S[43],{y:40,s:.6,r:-4});
outUp(['#cloud','#cross','#t6'],ST[7]);
// S7 green, with an asterisk
popIn('#gres',ST[7]+0.02,{y:100,s:.6,r:-4});
ft('#ast',{opacity:0,scale:3,rotation:-60},{opacity:1,scale:1,rotation:0,duration:.45,ease:'back.out(2)'},S[48]-0.1);
popIn('#t7',S[50]-0.1,{y:40,s:.6,r:4});
cta('ZEROBREACH',S[52]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[58]+0.15);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
