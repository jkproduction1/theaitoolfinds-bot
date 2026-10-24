"""OpenCode - free open-source coding agent (pillar: paid -> free). Facts: github.com/anomalyco/opencode README + docs."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "opencode"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json")
F.scenes([0, 11, 21, 31, 42, 54, 67])

CSS = r"""
#bill{left:150px;top:380px;width:780px;height:520px;padding:56px 60px}
#bill .lab{font-size:30px;font-weight:600;color:#9a9a9a;letter-spacing:.12em;text-transform:uppercase}
#bill .ttl{font-size:64px;font-weight:800;letter-spacing:-.03em;margin-top:18px}
#bill .row{display:flex;justify-content:space-between;font-size:40px;color:#6f6f6f;margin-top:34px;padding-top:26px;border-top:2px dashed #e4e4e4}
#bill .price{position:absolute;left:60px;bottom:56px;font-size:150px;font-weight:800;letter-spacing:-.05em}
#strike{position:absolute;left:46px;bottom:118px;width:250px;height:16px;background:#ff4b1f;border-radius:8px;transform-origin:0 50%}
#zero{position:absolute;right:60px;bottom:66px;font-size:150px;font-weight:800;letter-spacing:-.05em;color:#ff4b1f}
#shot{left:90px;top:330px;width:900px;height:620px;overflow:hidden;background:#0b0b0b}
#shot img{position:absolute;left:0;top:58px;width:900px;height:auto}
#n75{position:absolute;left:0;right:0;top:760px;text-align:center;font-size:190px;font-weight:800;letter-spacing:-.06em}
#login{left:120px;top:400px;width:840px;height:440px}
#login .body{padding:40px 44px;font-size:40px;line-height:1.6}
#login .p{color:#ff4b1f}
#zeroBig{position:absolute;left:520px;top:430px;font-size:260px;font-weight:800;letter-spacing:-.06em}
#keys{position:absolute;left:0;right:0;top:420px;text-align:center}
"""

F.clip(0, '<div id="bill" class="card"><div class="lab">Subscription</div><div class="ttl">AI coding app</div>'
          '<div class="row"><span>Billed</span><span>every month</span></div>'
          '<div class="price">$ ••</div><div id="strike"></div><div id="zero">$0</div></div>'
       + F.block([[(0, 5, "")], [(6, 7, ""), (8, 9, "hl"), (10, 10, "")]], top=1010, size=80))
F.clip(1, '<div id="shot" class="term"><div class="bar"><i></i><i></i><i></i></div><img src="assets/opencode-splash.jpg" alt=""></div>'
       + F.block([[(11, 12, ""), (13, 13, "b")], [(14, 19, ""), (20, 20, "hl")]], top=1030, size=82))
F.clip(2, chip("c1", "Claude", 120, 380, "C", "#d97757") + chip("c2", "GPT", 560, 440, "G", "#111")
          + chip("c3", "Gemini", 300, 590, "✦", "#3d6bff") + '<div id="n75">75+</div>'
       + F.block([[(21, 22, ""), (23, 23, "b"), (24, 24, "b"), (25, 25, ""), (26, 26, "b")], [(27, 28, ""), (29, 30, "hl")]], top=1040, size=80))
F.clip(3, '<div id="login" class="term"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> /connect</div><div style="color:#8a8a8a">search: copilot</div>'
          '<div id="lg" style="margin-top:18px">┌ Login with <b style="color:#fff">GitHub Copilot</b></div></div></div>'
       + F.block([[(31, 33, ""), (34, 35, "b")], [(36, 38, ""), (39, 40, ""), (41, 41, "hl")]], top=1020, size=80))
F.clip(4, tile("loc", "local", 160, 430, 300) + '<div id="zeroBig">$0</div>'
       + F.block([[(42, 46, ""), (47, 47, "b")], [(48, 48, ""), (49, 50, "hl"), (51, 53, "")]], top=1020, size=80))
F.clip(5, '<div id="keys"><span id="k1" class="key">Tab</span></div>' + tile("eye", "eye", 230, 680, 220)
          + tile("lock", "lock", 630, 680, 220, acc=True)
       + F.block([[(54, 56, ""), (57, 58, "hl")], [(59, 62, ""), (63, 66, "b")]], top=1020, size=78))
F.clip(6, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(67, 67, ""), (68, 68, "hl")], [(69, 74, "")]], top=1020, size=84))

S = F.S
for i in (8, 13, 23, 24, 26, 29, 34, 41, 47, 55, 57, 68):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 bill -> price struck -> $0
popIn('#bill',0.0,{y:40,s:.95,r:0});
ft('#strike',{scaleX:0},{scaleX:1,duration:.35,ease:'power3.out'},S[8]-0.05);
ft('#zero',{opacity:0,scale:1.6,filter:'blur(16px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.4,ease:A},S[8]+0.05);
tl.to('#bill',{scale:1.15,opacity:0,filter:'blur(12px)',duration:.3,ease:IN},ST[1]-0.3);
// S1 real screenshot
ft('#shot',{y:120,scale:.9,opacity:0},{y:0,scale:1,opacity:1,duration:.7,ease:A},ST[1]);
ft('#shot img',{scale:1.0},{scale:1.12,duration:ST[2]-ST[1],ease:'none'},ST[1]);
outUp('#shot',ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.5);
// S2 providers
popIn('#c1',S[23]-0.1); popIn('#c2',S[24]-0.1); popIn('#c3',S[26]-0.1);
const N={v:0}, nEl=document.getElementById('n75');
ft('#n75',{opacity:0,scale:.8,filter:'blur(14px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.4,ease:A},S[29]-0.1);
ft(N,{v:0},{v:75,duration:.8,ease:'expo.out',onUpdate:()=>{nEl.textContent=Math.round(N.v)+'+'}},S[29]-0.1);
outUp(['#c1','#c2','#c3','#n75'],ST[3]);
// S3 copilot login
popIn('#login',ST[3]+0.05,{y:80,s:.92,r:0});
ft('#lg',{opacity:0,x:-30},{opacity:1,x:0,duration:.4,ease:A},S[36]-0.1);
outUp('#login',ST[4]);
// S4 local + $0
popIn('#loc',S[44]-0.1);
ft('#zeroBig',{opacity:0,scale:1.6,filter:'blur(20px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.45,ease:A},S[49]-0.05);
outUp(['#loc','#zeroBig'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.5);
// S5 Tab key press -> eye (reads) + lock (won't edit)
popIn('#k1',S[55]-0.25,{y:40,s:.8,r:0});
tl.to('#k1',{y:12,boxShadow:'0 2px 0 #c9c9c9,0 20px 40px -16px rgba(0,0,0,.35)',duration:.08,ease:'power2.in'},S[55]+0.1);
tl.to('#k1',{y:0,boxShadow:'0 14px 0 #c9c9c9,0 40px 60px -16px rgba(0,0,0,.35)',duration:.2,ease:'power2.out'},S[55]+0.18);
popIn('#eye',S[60]-0.1); popIn('#lock',S[64]-0.1);
outUp(['#k1','#eye','#lock'],ST[6]);
// S6 CTA
cta('OPENCODE',S[68]);
"""
F.write(CSS, JS)
