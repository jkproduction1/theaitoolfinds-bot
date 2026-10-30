"""Taste Skill - agent skill that gives coding agents art direction and makes them check their own pages (creator & dev).
Facts: github.com/Leonxlnx/taste-skill README (MIT): "Agent Skill that makes coding agents design websites and app screens";
installs for Claude Code (/plugin install taste-skill@taste-skill) and Codex; v2 steps: "A script deals three of 20 researched
directions and the agent picks one"; "Builds with real pictures and footage from open collections, credited"; "Checks the page
in a real browser at three widths and fails it on slop"; "Looks at its own screenshots and fixes the top three problems, up to
three rounds"; "A build takes roughly 30 to 45 minutes and a few hundred thousand tokens". Credit tag text from
examples/v2/CREDITS.md (Dan Bollinger, CC BY-SA 3.0, Wikimedia Commons).
Media: the README example pages (examples/v2/*.webp) built by the skill. Rest drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "taste"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
DISP = {79: "30", 81: "45"}
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display=DISP)
F.scenes([0, 7, 14, 19, 30, 38, 45, 50, 62, 72, 76, 88], hold=0.15)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.pg{position:absolute;border-radius:22px;overflow:hidden;background:#fff;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.32),0 16px 28px -12px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.05)}
.pg img{display:block;width:100%;height:auto}
.pg .bar{height:44px;background:#f1f1f0;display:flex;align-items:center;gap:10px;padding-left:20px}
.pg .bar i{width:12px;height:12px;border-radius:50%;background:#d0d0d0}
#wf{left:190px;top:340px;width:700px;height:560px;padding:0}
#wf .in{padding:40px}
#wf .hd{height:60px;width:70%;border-radius:12px;background:#d9d9d9;margin:30px auto 0}
#wf .sb{height:22px;width:50%;border-radius:11px;background:#e6e6e6;margin:22px auto 0}
#wf .bt{height:64px;width:220px;border-radius:32px;background:#8b6cf0;margin:34px auto 0}
#wf .row{display:flex;gap:22px;margin-top:40px}
#wf .row b{flex:1;height:140px;border-radius:18px;background:#efefef}
#ag{position:absolute;left:600px;top:810px;background:#141414;color:#e9e9e9;font-family:var(--mono);font-size:34px;padding:18px 28px;border-radius:20px;box-shadow:0 30px 50px -16px rgba(0,0,0,.45)}
#ag span{color:#7ddc8a}
#eye{position:absolute;left:720px;top:280px;width:230px;height:230px;border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center;box-shadow:0 30px 50px -16px rgba(0,0,0,.45)}
#eye svg{width:140px;height:140px}
#eye .sl{position:absolute;left:40px;top:108px;width:150px;height:12px;border-radius:6px;background:#ff4b1f;transform:rotate(-40deg)}
#nm{position:absolute;left:0;right:0;top:300px;text-align:center}
#nm .a{font-family:var(--serif);font-style:italic;font-size:130px;line-height:1}
#nm .b{font-size:150px;font-weight:800;letter-spacing:-.06em;line-height:1}
#p2{left:150px;top:620px;width:780px}
#oeye{position:absolute;left:770px;top:520px;width:150px;height:150px;border-radius:50%;background:#ff4b1f;display:flex;align-items:center;justify-content:center;box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#oeye svg{width:96px;height:96px}
#free{position:absolute;left:600px;top:330px;background:#ff4b1f;color:#fff;font-weight:800;font-size:68px;padding:12px 34px;border-radius:22px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#mit{position:absolute;left:170px;top:360px;background:#111;color:#fff;font-family:var(--mono);font-weight:700;font-size:42px;padding:16px 30px;border-radius:18px}
.dk{position:absolute;left:470px;top:560px;width:150px;height:210px;border-radius:18px;background:#fff;border:3px solid #111;
 box-shadow:0 20px 34px -14px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-weight:800;font-size:40px;transform-origin:50% 120%}
.dk.o{background:#ff4b1f;color:#fff;border-color:#ff4b1f}
#cr{position:absolute;left:470px;top:780px;background:#111;color:#fff;font-size:30px;font-weight:600;padding:16px 24px;border-radius:16px;box-shadow:0 30px 50px -16px rgba(0,0,0,.45);max-width:520px;line-height:1.3}
#cr b{color:#ff4b1f}
#zoomwrap{left:110px;top:340px;width:860px;height:600px}
#zoomwrap img{position:absolute;left:0;top:0;width:1800px;height:auto;transform-origin:0 0}
#cr2{position:absolute;left:140px;top:760px;background:#111;color:#fff;font-size:36px;font-weight:600;padding:22px 30px;border-radius:20px;box-shadow:0 30px 50px -16px rgba(0,0,0,.45);line-height:1.35}
#cr2 b{color:#ff4b1f}
.bw{position:absolute;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 50px 80px -24px rgba(0,0,0,.32),0 0 0 1px rgba(0,0,0,.06)}
.bw .bar{height:36px;background:#f1f1f0;display:flex;align-items:center;gap:8px;padding-left:16px}
.bw .bar i{width:10px;height:10px;border-radius:50%;background:#d0d0d0}
.bw .vp{position:relative;overflow:hidden}
.bw .vp img{position:absolute;top:0;height:100%;width:auto}
.wl{position:absolute;font-family:var(--mono);font-weight:700;font-size:30px;color:#6f6f6f}
.mk{position:absolute;width:96px;height:96px;border-radius:50%;border:7px solid #ff4b1f;background:rgba(255,75,31,.12);display:flex;align-items:center;justify-content:center;
 font-weight:800;font-size:44px;color:#ff4b1f}
.mk b{position:absolute;inset:-7px;border-radius:50%;background:#2e9e4a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:48px;opacity:0}
.rd{position:absolute;top:420px;width:250px;height:250px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:110px;font-weight:800;letter-spacing:-.05em;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
.rd.o{background:#ff4b1f;color:#fff}
#clock{position:absolute;left:130px;top:360px;width:420px;height:420px;border-radius:50%;background:#fff;box-shadow:0 50px 80px -24px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
#clock svg{position:absolute;inset:0}
#clock .t{position:absolute;left:0;right:0;top:150px;text-align:center;font-size:84px;font-weight:800;letter-spacing:-.05em}
#clock .u{position:absolute;left:0;right:0;top:250px;text-align:center;font-size:34px;color:#8a8a8a;font-weight:600}
#tok{position:absolute;left:610px;top:400px;width:330px;padding:30px;border-radius:30px;background:#141414;color:#fff;box-shadow:0 50px 80px -24px rgba(0,0,0,.45)}
#tok .h{font-family:var(--mono);font-size:30px;color:#aaa}
#tok .n{font-size:60px;font-weight:800;letter-spacing:-.04em;margin-top:8px}
#tok .m{height:26px;border-radius:13px;background:#333;margin-top:22px;overflow:hidden}
#tok .m i{display:block;height:100%;width:0;background:#ff4b1f}
"""

EYE = '<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 50s14-26 40-26 40 26 40 26-14 26-40 26S10 50 10 50z"/><circle cx="50" cy="50" r="10"/></svg>'

def pg(pid, src, x, y, w, bar=True):
    return (f'<div id="{pid}" class="pg" style="left:{x}px;top:{y}px;width:{w}px">'
            + ('<div class="bar"><i></i><i></i><i></i></div>' if bar else '') + f'<img src="assets/{src}" alt=""></div>')

# S0 a generic page the agent built (drawn wireframe)
F.clip(0, '<div id="wf" class="pg"><div class="bar"><i></i><i></i><i></i></div><div class="in"><div class="hd"></div><div class="sb"></div><div class="bt"></div>'
          '<div class="row"><b></b><b></b><b></b></div></div></div><div id="ag"><span>✓</span> built index.html</div>'
       + F.block([[(0, 2, "")], [(3, 4, ""), (5, 6, "hl")]], top=1030, size=90))
# S1 but it never looks: closed eye
F.clip(1, '<div id="wf1" class="pg" style="left:130px;top:400px;width:620px;height:480px"><div class="bar"><i></i><i></i><i></i></div>'
          '<div style="padding:36px"><div style="height:54px;width:70%;border-radius:12px;background:#d9d9d9;margin:20px auto 0"></div>'
          '<div style="height:58px;width:200px;border-radius:29px;background:#8b6cf0;margin:40px auto 0"></div>'
          '<div style="display:flex;gap:18px;margin-top:40px"><b style="flex:1;height:120px;border-radius:16px;background:#efefef"></b><b style="flex:1;height:120px;border-radius:16px;background:#efefef"></b></div></div></div>'
          f'<div id="eye">{EYE}<div class="sl" id="sl"></div></div>'
       + F.block([[(7, 9, ""), (10, 10, "it")], [(11, 13, "hl")]], top=1040, size=100))
# S2 name + a real page it built
F.clip(2, '<div id="nm"><div class="a" id="na">Taste</div><div class="b" id="nb">Skill</div></div>'
          + pg("p2", "coffee-storefront.jpg", 230, 580, 620, bar=False) + f'<div id="oeye">{EYE}</div>'
       + F.block([[(14, 15, "hl")], [(16, 18, "b")]], top=1100, size=100))
# S3 free, open source, Claude Code + Codex
F.clip(3, '<div id="mit">MIT</div><div id="free">FREE</div>'
          + chip("c1", "Claude Code", 150, 560, "✳", "#d97757") + chip("c2", "Codex", 520, 740, "◎", "#111")
       + F.block([[(19, 20, ""), (21, 21, "b")], [(22, 25, "")], [(26, 27, "b"), (28, 29, "")]], top=1010, size=74))
# S4 20 directions, 3 dealt, one picked
F.clip(4, "".join(f'<div class="dk{" o" if k == 1 else ""}" id="dk{k}">{"★" if k == 1 else ""}</div>' for k in range(20))
       + F.block([[(30, 32, "")], [(33, 34, ""), (35, 35, "b")], [(36, 37, "hl")]], top=1030, size=88))
# S5 real photos from open archives (real example page)
F.clip(5, pg("p5", "coffee-roast.jpg", 110, 340, 860)
       + F.block([[(38, 41, "")], [(42, 43, "hl"), (44, 44, "")]], top=1060, size=92))
# S6 credited (credit from CREDITS.md)
F.clip(6, '<div id="zoomwrap" class="pg"><img id="zimg" src="assets/coffee-roast.jpg" alt=""></div>'
          '<div id="cr2">“385 degrees cinnamon roast coffee”<br>by Dan Bollinger · <b>CC BY-SA 3.0</b><br>via Wikimedia Commons</div>'
       + F.block([[(45, 46, "b")], [(47, 47, ""), (48, 49, "hl")]], top=1060, size=96))
# S7 real browser at three widths
F.clip(7, '<div id="bw0" class="bw" style="left:70px;top:380px;width:600px"><div class="bar"><i></i><i></i><i></i></div><div class="vp" style="height:345px"><img src="assets/night-dates.jpg" style="left:0;width:600px;height:auto"></div></div>'
          '<div id="bw1" class="bw" style="left:620px;top:470px;width:270px"><div class="bar"><i></i><i></i><i></i></div><div class="vp" style="height:360px"><img src="assets/night-dates.jpg" style="left:-140px"></div></div>'
          '<div id="bw2" class="bw" style="left:850px;top:560px;width:170px"><div class="bar"><i></i></div><div class="vp" style="height:340px"><img src="assets/night-dates.jpg" style="left:-60px"></div></div>'
          '<div class="wl" id="wl0" style="left:90px;top:780px">1440</div><div class="wl" id="wl1" style="left:640px;top:880px">768</div><div class="wl" id="wl2" style="left:870px;top:950px">390</div>'
       + F.block([[(50, 54, "")], [(55, 56, ""), (57, 58, "b")], [(59, 61, "hl")]], top=1040, size=80))
# S8 studies its screenshots, fixes top 3
F.clip(8, pg("p8", "coffee-questions.jpg", 110, 340, 860)
       + "".join(f'<div class="mk" id="mk{k}" style="left:{x}px;top:{y}px">{k + 1}<b>✓</b></div>' for k, (x, y) in enumerate([(150, 420), (760, 560), (420, 780)]))
       + F.block([[(62, 64, "it")], [(65, 65, "b"), (66, 67, "")], [(68, 68, ""), (69, 71, "hl")]], top=1030, size=78))
# S9 up to three rounds
F.clip(9, "".join(f'<div class="rd" id="rd{k}" style="left:{80 + k * 330}px">{k + 1}</div>' for k in range(3))
       + F.block([[(72, 73, ""), (74, 75, "hl")]], top=1060, size=104))
# S10 30-45 minutes, lots of tokens
F.clip(10, '<div id="clock"><svg width="420" height="420" viewBox="0 0 420 420"><circle cx="210" cy="210" r="170" fill="none" stroke="#ececec" stroke-width="26"/>'
           '<circle id="arc" cx="210" cy="210" r="170" fill="none" stroke="#ff4b1f" stroke-width="26" stroke-linecap="round" pathLength="1" transform="rotate(-90 210 210)"/></svg>'
           '<div class="t" id="ct">30</div><div class="u">minutes</div></div>'
           '<div id="tok"><div class="h">tokens</div><div class="n">a lot</div><div class="m"><i id="tm"></i></div></div>'
       + F.block([[(76, 77, ""), (78, 79, "b")], [(80, 80, ""), (81, 82, "b")], [(83, 84, ""), (85, 87, "hl")]], top=1030, size=86))
# S11 CTA
F.clip(11, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(88, 88, ""), (89, 89, "hl")], [(90, 95, "")]], top=1020, size=84))

S = F.S
for i in (6, 11, 15, 21, 27, 29, 35, 37, 43, 48, 58, 60, 61, 69, 74, 79, 81, 89):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 wireframe already there
ft('#wf',{opacity:1,y:60,scale:.96},{opacity:1,y:0,scale:1,duration:1,ease:A},0);
popIn('#ag',S[5]-0.1,{y:40,s:.7,r:-5});
tl.to(['#wf','#ag'],{x:-60,scale:.9,opacity:0,filter:'blur(12px)',duration:.26,ease:IN},ST[1]-0.26);
// S1 closed eye
ft('#wf1',{opacity:0,scale:.9},{opacity:1,scale:1,duration:.5,ease:A},ST[1]+0.02);
popIn('#eye',S[10]-0.15,{y:60,s:.5,r:-15});
ft('#sl',{scaleX:0},{scaleX:1,duration:.3,ease:'power3.out'},S[11]);
tl.to('#wf1',{filter:'blur(6px)',opacity:.6,duration:.4},S[12]);
outUp(['#wf1','#eye'],ST[2]);
// S2 name + real page + eye opens
ft('#na',{opacity:0,y:40,filter:'blur(14px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.5,ease:A},S[14]-0.1);
ft('#nb',{opacity:0,scale:1.6,filter:'blur(24px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.55,ease:A},S[15]-0.12);
ft('#p2',{opacity:0,y:200,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.8,ease:A},S[16]-0.1);
popIn('#oeye',S[18]-0.1,{y:40,s:.4,r:20});
outUp(['#nm','#p2','#oeye'],ST[3]);
starPass('#st1',ST[3]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S3 badges + harness chips
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[21]-0.05);
popIn('#mit',S[22]-0.05,{y:40,s:.7,r:-6});
popIn('#c1',S[26]-0.15,{y:60,s:.6,r:-6}); popIn('#c2',S[29]-0.15,{y:60,s:.6,r:6});
outUp(['#free','#mit','#c1','#c2'],ST[4]);
// S4 deck of 20 fans out, 3 dealt forward, middle picked
for(let k=0;k<20;k++){ const a=(k-9.5)*7.5;
  ft('#dk'+k,{opacity:0,rotation:0,y:120,x:0},{opacity:1,rotation:a,y:0,x:0,duration:.6,ease:A},ST[4]+0.05+k*0.02); }
[0,1,2].forEach(k=>tl.to('#dk'+k,{rotation:0,x:[-330,0,330][k],y:-180,scale:1.25,duration:.5,ease:'back.out(1.4)'},S[35]-0.1+k*0.08));
tl.to(Array.from({length:17},(_,k)=>'#dk'+(k+3)),{opacity:.25,filter:'blur(4px)',duration:.4},S[35]);
tl.to('#dk1',{y:-240,scale:1.45,duration:.4,ease:'back.out(2.5)'},S[36]);
tl.to(['#dk0','#dk2'],{opacity:.35,duration:.3},S[36]);
outUp(Array.from({length:20},(_,k)=>'#dk'+k),ST[5]);
// S5 real page with archive photos
ft('#p5',{opacity:0,y:220,rotationX:28,transformPerspective:1600,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.9,ease:A},ST[5]+0.02);
tl.to('#p5',{scale:1.04,duration:ST[6]-ST[5]-0.9,ease:'none'},ST[5]+0.9);
outUp('#p5',ST[6]);
// S6 zoom into a photo + credit
ft('#zoomwrap',{opacity:0,scale:.95},{opacity:1,scale:1,duration:.3,ease:A},ST[6]+0.02);
ft('#zimg',{x:0,y:-440,scale:1},{x:-20,y:-500,scale:1.04,duration:ST[7]-ST[6],ease:'none'},ST[6]);
ft('#cr2',{opacity:0,y:40,filter:'blur(10px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.45,ease:A},S[48]-0.1);
outUp(['#zoomwrap','#cr2'],ST[7]);
// S7 three widths
[0,1,2].forEach(k=>{ popIn('#bw'+k,[ST[7]+0.05,S[60]-0.15,S[61]-0.1][k],{y:80,s:.7,r:[-4,5,-6][k]}); ft('#wl'+k,{opacity:0},{opacity:1,duration:.3},[ST[7]+0.3,S[60],S[61]][k]); });
outUp(['#bw0','#bw1','#bw2','#wl0','#wl1','#wl2'],ST[8]);
starPass('#st2',ST[8]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S8 markers then fixed
popIn('#p8',ST[8]+0.02,{y:80,s:.92,r:-2});
[0,1,2].forEach(k=>{ ft('#mk'+k,{opacity:0,scale:2},{opacity:1,scale:1,duration:.35,ease:'back.out(2)'},S[65]+k*0.18);
  ft('#mk'+k+' b',{opacity:0,scale:.3},{opacity:1,scale:1,duration:.3,ease:'back.out(3)'},S[69]+k*0.2); });
outUp(['#p8','#mk0','#mk1','#mk2'],ST[9]);
// S9 rounds
[0,1,2].forEach(k=>popIn('#rd'+k,S[72]+k*0.15,{y:80,s:.4,r:-10}));
[0,1,2].forEach(k=>tl.to('#rd'+k,{backgroundColor:'#ff4b1f',color:'#fff',duration:.15},S[74]+k*0.2));
outUp(['#rd0','#rd1','#rd2'],ST[10]);
starPass('#st3',ST[10]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S10 clock 30 -> 45, token meter
popIn('#clock',ST[10]+0.05,{y:80,s:.7,r:-8});
ft('#arc',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:.5,duration:.6,ease:A},S[79]-0.1);
tl.to('#arc',{strokeDashoffset:.25,duration:.6,ease:A},S[81]-0.1);
const CK={n:30}; ft(CK,{n:30},{n:45,duration:.5,ease:'power1.inOut',onUpdate:()=>{document.getElementById('ct').textContent=Math.round(CK.n)}},S[81]-0.1);
popIn('#tok',S[84]-0.1,{y:60,s:.6,r:6});
ft('#tm',{width:'0%'},{width:'96%',duration:.9,ease:'power2.out'},S[85]);
outUp(['#clock','#tok'],ST[11]);
cta('TASTE',S[89]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[95]+0.15);
tl.to('#typed',{color:'#ff4b1f',duration:.2},S[95]+0.25);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.08)
