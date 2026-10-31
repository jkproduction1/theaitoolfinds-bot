"""4 free, open-source Mac swaps for paid apps (listicle).
Facts (each tool's README):
- macshot github.com/sw33tLie/macshot (GPL-3.0): "open-source screenshot tool on macOS"; annotation (arrows, blur...), scroll
  capture, screen recording; "lives in your menu bar"; "all native, all free".
- PureMac github.com/momenbasel/puremac (MIT): "Free, open-source Mac care: cleanup, app management ... No subscription or
  telemetry"; System Cleaner (system junk, user cache...), App Uninstaller finds related files / Orphan Finder for leftovers.
- FreeFlow github.com/zachlatta/freeflow (MIT): "Free and open source alternative to Wispr Flow"; "Get a free Groq API key";
  "Hold Fn to talk ... have whatever you say pasted into the current text field"; context-aware cleanup.
- OpenScreen github.com/getopenscreen/openscreen (MIT): "free, open-source desktop app for recording your screen";
  "the category Screen Studio defined"; auto zooms follow cursor; automatic on-device captions; "under active development".
Media: each repo's own screenshots/icons/demo GIFs. Paid apps shown only as text chips."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "macfree"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
DISP = {8: "4", 13: "#1", 31: "#2", 46: "#3", 68: "#4"}
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display=DISP)
F.scenes([0, 6, 13, 18, 26, 31, 34, 38, 46, 50, 62, 68, 72, 81, 84], hold=0.12)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.pg{position:absolute;border-radius:22px;overflow:hidden;background:#fff;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.32),0 16px 28px -12px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.05)}
.pg img{display:block;width:100%;height:auto}
.pd{position:absolute;display:flex;align-items:center;gap:20px;background:#fff;border-radius:999px;padding:22px 36px;font-weight:700;font-size:50px;letter-spacing:-.03em;white-space:nowrap;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04)}
.pd s{text-decoration:none;font-family:var(--mono);font-size:30px;background:#111;color:#fff;padding:6px 14px;border-radius:12px}
#four{position:absolute;left:0;right:0;top:250px;text-align:center;font-size:480px;font-weight:800;letter-spacing:-.07em;line-height:1}
#free{position:absolute;left:640px;top:330px;background:#ff4b1f;color:#fff;font-weight:800;font-size:68px;padding:12px 34px;border-radius:22px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
.num{position:absolute;left:0;right:0;top:250px;text-align:center;font-size:120px;font-weight:800;letter-spacing:-.05em;line-height:1}
.num span{color:#ff4b1f}
.old{position:absolute;left:0;right:0;top:440px;text-align:center}
.old span{position:relative;display:inline-block;font-size:62px;font-weight:700;color:#8a8a8a;letter-spacing:-.03em}
.old i{position:absolute;left:-10px;right:-10px;top:52%;height:8px;border-radius:4px;background:#ff4b1f;transform-origin:0 50%}
.new{position:absolute;left:0;right:0;top:570px;display:flex;align-items:center;justify-content:center;gap:34px}
.new img{width:230px;height:230px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.3))}
.new b{font-size:120px;font-weight:800;letter-spacing:-.06em}
#mb{position:absolute;left:60px;top:330px;width:960px;height:70px;border-radius:18px;background:rgba(255,255,255,.85);display:flex;align-items:center;justify-content:flex-end;gap:34px;padding-right:30px;
 font-size:30px;font-weight:600;box-shadow:0 30px 50px -20px rgba(0,0,0,.25)}
#mb img{width:44px;height:44px}
#mb .dot{width:22px;height:22px;border-radius:50%;background:#cfcfcf}
#drop{position:absolute;left:560px;top:420px;width:420px;border-radius:24px;background:#fff;padding:16px;box-shadow:0 50px 80px -20px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05)}
#drop div{padding:16px 22px;font-size:34px;font-weight:600;border-radius:14px}
#drop div.on{background:#111;color:#fff}
#ed{left:70px;top:660px;width:500px}
#nosub{position:absolute;left:640px;top:760px;background:#ff4b1f;color:#fff;font-weight:800;font-size:46px;padding:16px 30px;border-radius:20px;transform:rotate(-6deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
.vcard{position:absolute;border-radius:24px;overflow:hidden;background:#111;box-shadow:0 60px 90px -24px rgba(0,0,0,.45)}
.vcard video{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover}
#fn{position:absolute;left:110px;top:350px}
#wave{position:absolute;left:470px;top:380px;display:flex;gap:14px;align-items:center;height:150px}
#wave i{display:block;width:22px;height:40px;border-radius:11px;background:#ff4b1f}
#gk{position:absolute;left:190px;top:400px;width:700px;border-radius:30px;background:#141414;color:#fff;padding:40px 46px;box-shadow:0 60px 90px -24px rgba(0,0,0,.5)}
#gk .h{font-family:var(--mono);font-size:30px;color:#aaa}
#gk .k{font-family:var(--mono);font-size:50px;font-weight:700;margin-top:14px;letter-spacing:-.02em}
#gk .k span{color:#ff4b1f}
#gk .f{display:inline-block;margin-top:24px;background:#2e9e4a;color:#fff;font-weight:800;font-size:34px;padding:8px 20px;border-radius:12px}
#early{position:absolute;left:600px;top:760px;background:#111;color:#fff;font-weight:800;font-size:48px;padding:16px 30px;border-radius:20px;transform:rotate(5deg);box-shadow:0 30px 50px -16px rgba(0,0,0,.5)}
#early span{color:#ff4b1f}
"""

def pg(pid, src, x, y, w):
    return f'<div id="{pid}" class="pg" style="left:{x}px;top:{y}px;width:{w}px"><img src="assets/{src}" alt=""></div>'

def swap(n, k, paid, icon, name):
    return (f'<div id="n{k}" class="num"><span>#</span>{k}</div><div class="old" id="o{k}"><span>{paid}<i id="oi{k}"></i></span></div>'
            f'<div class="new" id="nw{k}"><img src="assets/{icon}" alt=""><b>{name}</b></div>')

PAID = [("CleanShot X", 110, 340), ("CleanMyMac", 470, 500), ("Wispr Flow", 140, 660), ("Screen Studio", 460, 820)]
# S0 paid apps with subscription tags
F.clip(0, "".join(f'<div class="pd" id="pd{k}" style="left:{x}px;top:{y}px">{n}<s>$</s></div>' for k, (n, x, y) in enumerate(PAID))
       + F.block([[(0, 3, "")], [(4, 4, "hl"), (5, 5, "b")]], top=1060, size=104))
# S1 four free swaps
F.clip(1, '<div id="four">4</div><div id="free">FREE</div>'
       + F.block([[(6, 8, ""), (9, 9, "b")], [(10, 11, "hl"), (12, 12, "it")]], top=1060, size=96))
# S2 #1 CleanShot X -> macshot
F.clip(2, swap(2, 1, "CleanShot X", "macshot-icon.png", "macshot")
       + F.block([[(13, 13, "b"), (14, 15, "")], [(16, 16, ""), (17, 17, "hl")]], top=1060, size=104))
# S3 real screenshot: annotations
F.clip(3, pg("ms", "macshot.jpg", 90, 340, 900)
       + F.block([[(18, 20, "b")], [(21, 23, "")], [(24, 25, "hl")]], top=1040, size=74))
# S4 menu bar
F.clip(4, '<div id="mb"><span class="dot"></span><span class="dot"></span><img id="mbi" src="assets/macshot-icon.png" alt=""><span>Sat 9:41</span></div>'
          '<div id="drop"><div class="on">Capture area</div><div>Scroll capture</div><div>Record screen</div></div>'
          + pg("ed", "macshot-editor.jpg", 70, 660, 500)
       + F.block([[(26, 28, "")], [(29, 30, "hl")]], top=1060, size=100))
# S5 #2 CleanMyMac -> PureMac (icon drawn: no app icon in repo assets, show name)
F.clip(5, f'<div id="n2" class="num"><span>#</span>2</div><div class="old" id="o2"><span>CleanMyMac<i id="oi2"></i></span></div>'
          + pg("pmh", "puremac.jpg", 190, 560, 700)
       + F.block([[(31, 31, "b"), (32, 32, "")], [(33, 33, "hl")]], top=1060, size=100))
# S6 clears caches and junk
F.clip(6, pg("pm", "puremac.jpg", 90, 340, 900)
       + F.block([[(34, 34, "b"), (35, 35, "")], [(36, 36, ""), (37, 37, "hl")]], top=1060, size=104))
# S7 uninstall with leftovers, no subscription
F.clip(7, pg("pu", "puremac-uninst.jpg", 90, 340, 900) + '<div id="nosub">No subscription</div>'
       + F.block([[(38, 41, "")], [(42, 43, "hl")], [(44, 45, "b")]], top=1000, size=80))
# S8 #3 Wispr Flow -> FreeFlow
F.clip(8, swap(8, 3, "Wispr Flow", "freeflow-icon.png", "FreeFlow")
       + F.block([[(46, 46, "b"), (47, 48, "")], [(49, 49, "hl")]], top=1060, size=100))
# S9 hold fn, talk, text lands (+ README demo GIF below)
F.clip(9, '<div id="fn"><span id="kfn" class="key" style="min-width:260px">fn</span></div>'
          '<div id="wave">' + "".join(f'<i id="wv{k}"></i>' for k in range(14)) + '</div>'
       + F.block([[(50, 53, "b"), (54, 54, "")], [(55, 58, "")], [(59, 61, "hl")]], top=1030, size=74))
# S10 free Groq key
F.clip(10, '<div id="gk"><div class="h">Groq API key</div><div class="k">gsk_<span>••••••••••</span></div><div class="f">FREE</div></div>'
        + F.block([[(62, 64, ""), (65, 65, "b")], [(66, 67, "hl")]], top=1060, size=100))
# S11 #4 Screen Studio -> OpenScreen
F.clip(11, swap(11, 4, "Screen Studio", "openscreen-icon.png", "OpenScreen")
        + F.block([[(68, 68, "b"), (69, 70, "")], [(71, 71, "hl")]], top=1060, size=100))
# S12 records, auto zooms, captions (README demo GIF)
F.clip(12, F.block([[(72, 74, "")], [(75, 76, ""), (77, 78, "hl")], [(79, 80, "b")]], top=1000, size=80))
# S13 still early
F.clip(13, pg("osp", "openscreen.jpg", 90, 360, 900) + '<div id="early">still <span>early</span></div>'
        + F.block([[(81, 83, "hl")]], top=1100, size=110))
# S14 CTA
F.clip(14, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
        + F.block([[(84, 84, ""), (85, 85, "hl")], [(86, 89, ""), (90, 91, "b")]], top=1020, size=84))

for k, (nm, n, x, y, w, h) in enumerate([("freeflow", 9, 110, 580, 860, 360), ("openscreen", 12, 70, 340, 940, 529)]):
    F.body.append(f'<div id="vw_{nm}" class="vcard" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px">'
                  f'<video id="v_{nm}" class="clip" src="assets/v-{nm}.mp4" data-start="{F.ST[n]}" data-duration="{round(F.EN[n] - F.ST[n], 2)}" '
                  f'data-track-index="{30 + k}" muted playsinline></video></div>')

S = F.S
for i in (4, 9, 13, 17, 20, 25, 30, 31, 33, 37, 43, 45, 46, 49, 53, 65, 68, 71, 78, 85):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.05;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
function numIn(k,t){ ft('#n'+k,{opacity:0,y:-40,scale:1.4,filter:'blur(18px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.45,ease:A},t); }
function swapIn(k,sc,iPaid,iFree){ numIn(k,ST[sc]+0.02);
  ft('#o'+k,{opacity:0,y:30},{opacity:1,y:0,duration:.4,ease:A},S[iPaid]-0.1);
  ft('#oi'+k,{scaleX:0},{scaleX:1,duration:.3,ease:'power3.out'},S[iPaid]+0.35);
  if(iFree!==null){ ft('#nw'+k+' img',{opacity:0,scale:.3,rotation:-30,filter:'blur(16px)'},{opacity:1,scale:1,rotation:0,filter:'blur(0px)',duration:.5,ease:'back.out(1.7)'},S[iFree]-0.45);
    ft('#nw'+k+' b',{opacity:0,x:60,filter:'blur(16px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.45,ease:A},S[iFree]-0.3); }
  outUp(['#n'+k,'#o'+k,'#nw'+k],ST[sc+1]); }
// S0 paid chips already there
[0,1,2,3].forEach(k=>ft('#pd'+k,{opacity:1,y:40,scale:.95},{opacity:1,y:0,scale:1,duration:.9+k*0.1,ease:A},0));
[0,1,2,3].forEach(k=>tl.to('#pd'+k+' s',{backgroundColor:'#ff4b1f',scale:1.15,duration:.2,ease:'back.out(3)'},S[1]+k*0.12));
outUp(['#pd0','#pd1','#pd2','#pd3'],ST[1]);
// S1 big 4 + FREE
ft('#four',{opacity:0,scale:2.2,filter:'blur(30px)',rotation:-8},{opacity:1,scale:1,filter:'blur(0px)',rotation:0,duration:.6,ease:A},ST[1]+0.05);
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[9]-0.05);
outUp(['#four','#free'],ST[2]);
starPass('#st1',ST[2]-0.35,[700,-650,0],[430,-360,40],10,1.2);
// #1 macshot
swapIn(1,2,14,17);
ft('#ms',{opacity:0,y:220,rotationX:28,transformPerspective:1600,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.9,ease:A},ST[3]+0.02);
tl.to("#ms",{scale:1.03,duration:Math.max(.5,ST[4]-ST[3]-0.9),ease:'none'},ST[3]+0.9);
outUp('#ms',ST[4]);
ft('#mb',{opacity:0,y:-60},{opacity:1,y:0,duration:.5,ease:A},ST[4]+0.02);
ft('#drop',{opacity:0,y:-30,scale:.9,transformOrigin:'80% 0'},{opacity:1,y:0,scale:1,duration:.4,ease:'back.out(1.6)'},ST[4]+0.4);
popIn('#ed',S[29]-0.2,{y:80,s:.8,r:-4});
outUp(['#mb','#drop','#ed'],ST[5]);
// #2 PureMac
numIn(2,ST[5]+0.02);
ft('#o2',{opacity:0,y:30},{opacity:1,y:0,duration:.4,ease:A},S[32]-0.1);
ft('#oi2',{scaleX:0},{scaleX:1,duration:.3,ease:'power3.out'},S[32]+0.35);
ft('#pmh',{opacity:0,y:200,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.7,ease:A},S[33]-0.15);
outUp(['#n2','#o2','#pmh'],ST[6]);
starPass('#st2',ST[6]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
ft('#pm',{opacity:0,scale:.85,filter:'blur(10px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.5,ease:A},ST[6]+0.02);
outUp('#pm',ST[7]);
ft('#pu',{opacity:0,x:200,rotationY:-20,transformPerspective:1400},{opacity:1,x:0,rotationY:0,duration:.7,ease:A},ST[7]+0.02);
ft('#nosub',{opacity:0,scale:2.4,rotation:10,filter:'blur(10px)'},{opacity:1,scale:1,rotation:-6,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[44]-0.05);
outUp(['#pu','#nosub'],ST[8]);
// #3 FreeFlow
swapIn(3,8,47,49);
popIn('#fn',ST[9]+0.05,{y:40,s:.8,r:0});
tl.to('#kfn',{y:12,boxShadow:'0 2px 0 #c9c9c9,0 20px 40px -16px rgba(0,0,0,.35)',duration:.08,ease:'power2.in'},S[50]);
for(let k=0;k<14;k++){ ft('#wv'+k,{scaleY:.3},{scaleY:1+((k*37)%9)/3,duration:.18,ease:'sine.inOut',yoyo:true,repeat:9},S[54]-0.1+k*0.02); }
ft('#vw_freeflow',{opacity:0,y:120,scale:.9},{opacity:1,y:0,scale:1,duration:.6,ease:A},S[55]-0.1);
outUp(['#fn','#wave','#vw_freeflow'],ST[10]);
popIn('#gk',ST[10]+0.05,{y:80,s:.8,r:-4});
outUp('#gk',ST[11]);
starPass('#st3',ST[11]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// #4 OpenScreen
swapIn(4,11,69,71);
ft('#vw_openscreen',{opacity:0,y:200,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.8,ease:A},ST[12]+0.02);
outUp('#vw_openscreen',ST[13]);
ft('#osp',{opacity:0,scale:.85,filter:'blur(10px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.5,ease:A},ST[13]+0.02);
ft('#early',{opacity:0,scale:2.2,rotation:-10,filter:'blur(10px)'},{opacity:1,scale:1,rotation:5,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[82]);
outUp(['#osp','#early'],ST[14]);
cta('MAC',S[85]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[91]+0.15);
tl.to('#typed',{color:'#ff4b1f',duration:.2},S[91]+0.25);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.10)
