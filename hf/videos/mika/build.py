"""Mika - free, open-source Android AI assistant that works your apps on a hidden background screen (new ability).
Facts: github.com/wangzan101/Mika README (Apache-2.0, Android 11+ APK): "An AI assistant on your phone: say what you need,
and it works your apps and the web until it's done"; "It works on a hidden background screen, so you can keep using your
phone"; "Opens apps, taps, types and scrolls on a separate background screen while you use your phone as usual";
demo "Finds the cheapest nonstop from San Francisco to New York"; Ask mode "checks with you only before spending money
(placing orders, paying)"; amazon demo "stops before checkout"; "use your own model API key, or sign in with a ChatGPT,
xAI or OpenRouter account"; "Open source and free".
Media: README demo GIFs (docs/media google-flights, wechat-send-side, amazon-cart, hacker-news) as sped-up mp4s, and
docs/media/logo.png. Rest drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "mika"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", tail=1.0)
F.scenes([0, 6, 15, 21, 31, 37, 45, 51], hold=0.12)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.vcard{position:absolute;overflow:hidden;background:#111;box-shadow:0 60px 90px -24px rgba(0,0,0,.42),0 16px 28px -12px rgba(0,0,0,.18)}
.vcard video{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover}
.ph{border-radius:44px;border:10px solid #111}
.wide{border-radius:24px}
.tap{position:absolute;width:90px;height:90px;border-radius:50%;border:6px solid #ff4b1f;opacity:0}
#logo{position:absolute;left:390px;top:350px;width:300px;height:300px;border-radius:70px;overflow:hidden;
 box-shadow:0 50px 70px -22px rgba(0,0,0,.30),0 12px 22px -10px rgba(0,0,0,.14)}
#logo img{width:100%;height:100%;display:block}
#free{position:absolute;left:680px;top:330px;background:#ff4b1f;color:#fff;font-weight:800;font-size:60px;padding:10px 28px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#c1{font-size:50px}#c2{font-size:50px}
.bub{position:absolute;right:560px;top:420px;max-width:440px;background:#2f6bff;color:#fff;border-radius:34px 34px 8px 34px;padding:26px 32px;font-size:40px;font-weight:600;line-height:1.2;
 box-shadow:0 30px 50px -16px rgba(47,107,255,.5)}
.bub small{display:block;font-family:var(--mono);font-size:24px;opacity:.75;margin-bottom:8px}
.lab{position:absolute;background:#111;color:#fff;font-weight:800;font-size:40px;padding:10px 24px;border-radius:14px;box-shadow:0 20px 30px -12px rgba(0,0,0,.4)}
#home{position:absolute;left:190px;top:320px;width:330px;height:680px;border-radius:44px;border:10px solid #111;background:linear-gradient(170deg,#f6f6f5,#e2e2e0);
 box-shadow:0 60px 90px -24px rgba(0,0,0,.42);padding:70px 30px;display:grid;grid-template-columns:repeat(3,1fr);gap:26px;align-content:start}
#home u{display:block;aspect-ratio:1;border-radius:22px;background:#fff;box-shadow:0 10px 18px -8px rgba(0,0,0,.25)}
#home u:nth-child(3n+1){background:#111}#home u:nth-child(5){background:#ff4b1f}
#live{position:absolute;left:400px;top:560px;width:150px;height:331px;border-radius:24px;border:5px solid #2e9e4a}
#lv{position:absolute;left:560px;top:600px;font-family:var(--mono);font-size:28px;font-weight:700;color:#2e9e4a}
#ask{position:absolute;left:520px;top:440px;width:500px;background:#fff;border-radius:28px;padding:30px 34px;
 box-shadow:0 50px 80px -20px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05)}
#ask .t{font-size:42px;font-weight:800;letter-spacing:-.03em}
#ask .s{font-size:28px;color:#6f6f6f;margin-top:8px}
#ask .bt{display:flex;gap:14px;margin-top:22px}
#ask .bt b{flex:1;text-align:center;padding:14px 0;border-radius:999px;font-size:30px;background:#efefee}
#ask .bt b.y{background:#111;color:#fff}
#c3,#c4,#c5{font-size:48px}
#key{position:absolute;left:0;right:0;top:330px;text-align:center;font-family:var(--serif);font-style:italic;font-size:56px;color:#6f6f6f}
"""

VIDS = [  # name, scene, x, y, w, h, class
    ("flights-a", 0, 375, 300, 330, 728, "ph"),
    ("flights-b", 2, 610, 300, 330, 728, "ph"),
    ("side", 3, 100, 410, 880, 804 * 880 // 1120, "wide"),
    ("hn", 4, 400, 560, 150, 331, ""),
    ("cart", 5, 120, 300, 330, 728, "ph"),
]

# S0 phone working by itself at t=0 (flights demo), tap ripples
F.clip(0, '<div class="tap" id="tp1" style="left:640px;top:440px"></div><div class="tap" id="tp2" style="left:420px;top:780px"></div>'
       + F.block([[(0, 3, "")], [(4, 5, "hl")]], top=1080, size=110))
# S1 Mika logo + FREE + Android chip
F.clip(1, '<div id="logo"><img src="assets/mika-logo.png" alt=""></div><div id="free">FREE</div>'
          + chip("c1", "open-source", 70, 760, "{}", "#111") + chip("c2", "Android", 600, 760, "▲", "#2e9e4a")
       + F.block([[(6, 6, "b"), (7, 10, "")], [(11, 12, "hl"), (13, 14, "b")]], top=1020, size=88))
# S2 "Say:" bubble + flights result
F.clip(2, '<div class="bub" id="bub"><small>you say</small>find the cheapest nonstop flight</div>'
       + F.block([[(15, 15, "it"), (16, 17, "")], [(18, 20, "hl")]], top=1080, size=80))
# S3 hidden background screen (README side-by-side demo)
F.clip(3, '<div class="lab" id="l1" style="left:150px;top:310px">taps</div><div class="lab" id="l2" style="left:430px;top:300px">types</div>'
          '<div class="lab" id="l3" style="left:720px;top:310px">scrolls</div>'
       + F.block([[(21, 25, "")], [(26, 27, ""), (28, 29, "hl")], [(30, 30, "hl")]], top=1080, size=74))
# S4 you keep using your phone, small live view
F.clip(4, '<div id="home">' + "<u></u>" * 12 + '</div><div id="lv">● live view</div>'
       + F.block([[(31, 32, ""), (33, 34, "hl")], [(35, 36, "")]], top=1080, size=100))
# S5 asks before money
F.clip(5, '<div id="ask"><div class="t">Place the order?</div><div class="s">Mika stops before checkout</div><div class="bt"><b>Not now</b><b class="y">You decide</b></div></div>'
       + F.block([[(37, 41, "")], [(42, 44, "hl")]], top=1080, size=88))
# S6 bring your own AI account
F.clip(6, '<div id="key">sign in or use a key</div>' + chip("c3", "ChatGPT", 90, 460, "◎", "#111") + chip("c4", "OpenRouter", 500, 560, "↯", "#6b5cff")
          + chip("c5", "xAI", 230, 720, "✕", "#111")
       + F.block([[(45, 46, "")], [(47, 50, "hl")]], top=1060, size=84))
# S7 CTA
F.clip(7, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(51, 51, ""), (52, 52, "hl")], [(53, 58, "")]], top=1020, size=84))

for k, (nm, n, x, y, w, h, c) in enumerate(VIDS):
    F.body.append(f'<div id="vw_{nm}" class="vcard {c}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">'
                  f'<video id="v_{nm}" class="clip" src="assets/v-{nm}.mp4" data-start="{F.ST[n]}" data-duration="{round(F.EN[n] - F.ST[n], 2)}" '
                  f'data-track-index="{30 + k}" muted playsinline></video></div>')

S = F.S
for i in (4, 6, 9, 14, 18, 22, 23, 25, 28, 33, 42, 47, 52):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 phone already there, slow push, taps ripple
ft('#vw_flights-a',{opacity:1,y:20,scale:.98},{opacity:1,y:0,scale:1.03,duration:ST[1],ease:'none'},0);
['#tp1','#tp2'].forEach((s,k)=>ft(s,{opacity:1,scale:.3},{opacity:0,scale:1.6,duration:.6,ease:'power2.out'},0.4+k*0.7));
outUp('#vw_flights-a',ST[1]);
starPass('#st1',ST[1]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S1 logo, FREE, chips
ft('#logo',{opacity:0,scale:.4,rotation:-20,filter:'blur(16px)'},{opacity:1,scale:1,rotation:0,filter:'blur(0px)',duration:.6,ease:'back.out(1.6)'},ST[1]+0.02);
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[9]-0.08);
popIn('#c1',S[10]-0.15,{y:60,s:.6,r:-6}); popIn('#c2',S[14]-0.15,{y:60,s:.6,r:6});
outUp(['#logo','#free','#c1','#c2'],ST[2]);
// S2 bubble + phone with the result
ft('#bub',{opacity:0,x:-60,scale:.7,transformOrigin:'100% 100%'},{opacity:1,x:0,scale:1,duration:.5,ease:'back.out(1.6)'},ST[2]+0.05);
ft('#vw_flights-b',{opacity:0,y:220,rotationY:-25,transformPerspective:1400},{opacity:1,y:0,rotationY:0,duration:.7,ease:A},ST[2]+0.1);
outUp(['#bub','#vw_flights-b'],ST[3]);
// S3 side-by-side demo + labels on their words
ft('#vw_side',{opacity:0,y:200,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.7,ease:A},ST[3]+0.02);
popIn('#l1',S[22]-0.1,{y:30,s:.5,r:-6}); popIn('#l2',S[23]-0.1,{y:30,s:.5,r:5}); popIn('#l3',S[25]-0.1,{y:30,s:.5,r:-4});
outUp(['#vw_side','#l1','#l2','#l3'],ST[4]);
starPass('#st2',ST[4]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S4 home screen + live view
popIn('#home',ST[4]+0.02,{y:80,s:.9,r:-3});
ft('#vw_hn',{opacity:0,scale:.3,x:-80},{opacity:1,scale:1,x:0,duration:.5,ease:'back.out(1.6)'},ST[4]+0.2);
ft('#lv',{opacity:0,x:-20},{opacity:1,x:0,duration:.3},ST[4]+0.4);
outUp(['#home','#vw_hn','#lv'],ST[5]);
// S5 cart demo + confirm card
ft('#vw_cart',{opacity:0,y:200,rotationY:25,transformPerspective:1400},{opacity:1,y:0,rotationY:0,duration:.6,ease:A},ST[5]+0.02);
ft('#ask',{opacity:0,scale:.7,y:40,filter:'blur(10px)'},{opacity:1,scale:1,y:0,filter:'blur(0px)',duration:.5,ease:'back.out(1.8)'},S[40]-0.1);
outUp(['#vw_cart','#ask'],ST[6]);
starPass('#st3',ST[6]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S6 account chips
ft('#key',{opacity:0,y:-20},{opacity:1,y:0,duration:.3},ST[6]+0.05);
popIn('#c3',ST[6]+0.1,{y:60,s:.6,r:-6}); popIn('#c4',ST[6]+0.25,{y:60,s:.6,r:6}); popIn('#c5',ST[6]+0.4,{y:60,s:.6,r:-4});
outUp(['#key','#c3','#c4','#c5'],ST[7]);
cta('MIKA',S[52]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[58]+0.15);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
