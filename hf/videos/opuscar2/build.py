"""Lemo Opuscar - Claude Code plugin that directs short films in code (creator & dev, angle new-ability).
Facts: github.com/lemomo-ai/lemo-opuscar README (code MIT, demo films CC BY 4.0): "A toolbox of film styles made in
code: 66 ready to use"; install "claude plugin install lemo-opuscar@lemolab" (Claude Code plugin); "Picture: canvas and
WebGL pages, rendered frame by frame"; "Music: original scores from free sample libraries"; "Voice: text-to-speech
narration"; TECHNIQUE.md "no video generation, no stock footage"; "A film takes an agent about 30-60 minutes and a fair
amount of tokens"; brief = a style + a topic. Example line from Jan's notes ("Watercolor. A lost dog walks home.").
Media: style frames from the README gallery (docs/frames/*.jpg, CC BY 4.0, credited on screen). Rest drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "opuscar2"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display={20: "66"}, tail=1.0)
F.scenes([0, 8, 17, 22, 28, 35, 41, 48, 51, 58], hold=0.12)

GRID = ["impasto", "lowpoly-island", "memphis-diorama", "paper-popup", "glass-product", "risograph", "woodcut",
        "stained-glass", "crayon-book", "tilt-shift", "hd-2d", "swiss-motion", "midcentury-toon", "engraving",
        "blueprint", "paper-lantern", "spy-titles", "rubber-hose", "iso-infographic", "shadow-puppet"]

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.fr{position:absolute;border-radius:18px;overflow:hidden;background:#111;
 box-shadow:0 50px 80px -24px rgba(0,0,0,.35),0 14px 26px -12px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.06)}
.fr img{display:block;width:100%;height:100%;object-fit:cover}
.fl{position:absolute;left:18px;top:16px;background:rgba(17,17,17,.88);color:#fff;font-family:var(--mono);font-weight:700;font-size:28px;padding:6px 14px;border-radius:10px}
.tm{left:110px;width:860px}
.tm .body{padding:30px 38px;font-size:34px;line-height:1.55}
.tm .p{color:#ff4b1f}.tm .d{color:#8a8a8a}.tm .g{color:#7ddc8a}
#nm{position:absolute;left:0;right:0;top:330px;text-align:center;line-height:1}
#nm .a{font-family:var(--serif);font-style:italic;font-size:140px}
#nm .b{font-size:170px;font-weight:800;letter-spacing:-.06em}
#free{position:absolute;left:700px;top:290px;background:#ff4b1f;color:#fff;font-weight:800;font-size:64px;padding:10px 30px;border-radius:20px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#big66{position:absolute;left:0;right:0;top:420px;text-align:center;font-size:420px;font-weight:800;letter-spacing:-.07em;line-height:1;color:#111}
#big66 span{display:block;font-size:44px;letter-spacing:.2em;font-family:var(--mono);font-weight:700;color:#ff4b1f;margin:10px auto 0;display:inline-block;background:#ebebea;padding:8px 22px;border-radius:14px}
.gt{position:absolute;width:200px;height:113px;border-radius:12px;overflow:hidden;box-shadow:0 20px 30px -12px rgba(0,0,0,.3)}
.gt img{width:100%;height:100%;object-fit:cover;display:block}
.cred{position:absolute;left:0;right:0;text-align:center;font-family:var(--mono);font-size:27px;color:#6f6f6f}
#pf{position:absolute;left:90px;top:520px;width:900px;height:150px;border-radius:80px;background:#fff;display:flex;align-items:center;padding-left:50px;font-size:42px;font-weight:600;
 box-shadow:0 40px 70px -20px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
#pf b{color:#ff4b1f;margin-right:14px}
#pft{color:#111}
#pc{display:inline-block;width:5px;height:56px;background:#ff4b1f;margin-left:6px}
#strip{position:absolute;left:-40px;top:700px;height:200px;display:flex;gap:16px;padding:18px 20px;background:#141414;border-radius:16px;box-shadow:0 40px 60px -20px rgba(0,0,0,.45)}
#strip i{display:block;width:250px;height:164px;border-radius:8px;overflow:hidden;background:#333}
#strip i img{width:100%;height:100%;object-fit:cover;opacity:.95}
#cnt{position:absolute;left:680px;top:330px;background:#ff4b1f;color:#fff;font-family:var(--mono);font-weight:700;font-size:40px;padding:14px 26px;border-radius:18px;box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#mus{position:absolute;left:110px;top:360px;width:860px;height:300px;border-radius:30px;background:#fff;padding:30px;box-shadow:0 60px 90px -20px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05)}
#mus .n{position:absolute;height:22px;border-radius:11px;background:#111}
#mus .n.o{background:#ff4b1f}
#mus .lb{position:absolute;left:30px;top:22px;font-family:var(--mono);font-weight:700;font-size:28px;color:#8a8a8a}
#vo{position:absolute;left:110px;top:700px;width:860px;height:200px;border-radius:30px;background:#141414;display:flex;align-items:center;justify-content:center;gap:12px;
 box-shadow:0 50px 80px -24px rgba(0,0,0,.45)}
#vo i{display:block;width:16px;height:40px;border-radius:8px;background:#ff4b1f}
#vo b{position:absolute;left:30px;top:18px;font-family:var(--mono);font-size:26px;color:#aaa;font-weight:600}
#vm{position:absolute;left:0;right:0;top:480px;text-align:center}
#vm span{position:relative;display:inline-block;background:#fff;border-radius:30px;padding:40px 60px;font-size:96px;font-weight:800;letter-spacing:-.04em;
 box-shadow:0 50px 80px -24px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
#vm i{position:absolute;left:30px;right:30px;top:50%;height:16px;margin-top:-8px;border-radius:8px;background:#ff4b1f;transform-origin:0 50%}
#clock{position:absolute;left:330px;top:340px;width:420px;height:420px;border-radius:50%;background:#fff;box-shadow:0 50px 80px -24px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
#clock svg{position:absolute;inset:0}
#clock .t{position:absolute;left:0;right:0;top:140px;text-align:center;font-size:110px;font-weight:800;letter-spacing:-.05em}
#clock .u{position:absolute;left:0;right:0;top:260px;text-align:center;font-size:34px;color:#8a8a8a;font-weight:600}
"""

CREDIT = "Frames: LemoLab / Lemo Opuscar · CC BY 4.0 (cropped)"
def CRED(n, y):
    return f'<div class="cred" id="cr{n}" style="top:{y}px">{CREDIT}</div>'


def fr(fid, name, x, y, w, label="", rot=0):
    h = round(w * 9 / 16)
    lab = f'<div class="fl">{label}</div>' if label else ""
    return (f'<div id="{fid}" class="fr" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;overflow:visible">'
            f'<div style="width:100%;height:100%;border-radius:18px;overflow:hidden"><img src="assets/f-{name}.jpg" alt=""></div>{lab}</div>')

# S0 a Claude Code prompt + three finished film frames, already on screen
F.clip(0, '<div id="t0" class="term tm" style="top:280px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> make a film: ukiyo-e, a wave at dawn</div><div class="d">● drawing frames… <span class="g">✓ film.mp4</span></div></div></div>'
          + CRED(0, 950) + fr("a0", "watercolor", 70, 560, 430) + fr("a1", "ukiyoe", 580, 590, 430) + fr("a2", "pixel-rpg", 330, 660, 420)
       + F.block([[(0, 2, "")], [(3, 4, "it")], [(5, 7, "hl")]], top=1000, size=82))
# S1 name, free, Claude Code
F.clip(1, '<div id="nm"><div class="a" id="na">Lemo</div><div class="b" id="nb">Opuscar</div></div><div id="free">FREE</div>'
          + chip("c1", "Claude Code", 300, 760, "✳", "#d97757")
       + F.block([[(8, 9, "b"), (10, 12, "")], [(13, 13, "hl"), (14, 16, "")]], top=1060, size=78))
# S2 66 styles over a wall of real style frames
F.clip(2, "".join(f'<div class="gt" id="g{k}" style="left:{40 + (k % 5) * 205}px;top:{330 + (k // 5) * 150}px"><img src="assets/f-{n}.jpg" alt=""></div>'
                  for k, n in enumerate(GRID))
          + '<div id="big66">66<span>FILM STYLES</span></div>' + CRED(2, 950)
       + F.block([[(17, 19, "")], [(20, 21, "hl")]], top=1080, size=100))
# S3 watercolor, ukiyo-e, pixel RPG
F.clip(3, fr("b0", "watercolor", 60, 330, 470, "watercolor") + fr("b1", "ukiyoe", 550, 400, 470, "ukiyo-e")
          + fr("b2", "pixel-rpg", 290, 610, 500, "pixel RPG")
          + CRED(3, 935)
       + F.block([[(22, 23, "it")], [(24, 25, ""), (26, 27, "b")]], top=1060, size=96))
# S4 one line of story
F.clip(4, '<div id="pf"><b>›</b><span id="pft"></span><span id="pc"></span></div>'
          + fr("p1", "watercolor", 300, 690, 480) + CRED(4, 985)
       + F.block([[(28, 30, "")], [(31, 32, "hl"), (33, 34, "")]], top=1080, size=96))
# S5 draws every frame in code
F.clip(5, '<div id="t5" class="term tm" style="top:330px;width:560px"><div class="bar"><i></i><i></i><i></i></div><div class="body" style="font-size:30px">'
          '<div><span class="p">render</span>(t) {</div><div>&nbsp; drawWave(t)</div><div>&nbsp; drawBoat(t)</div><div>}</div></div></div>'
          '<div id="cnt">frame <span id="cn">0001</span></div>'
          + CRED(5, 935) + '<div id="strip">' + "".join(f'<i><img src="assets/f-ukiyoe.jpg" style="transform:translateX({-k * 4}%) scale(1.15)" alt=""></i>' for k in range(5)) + '</div>'
       + F.block([[(35, 36, ""), (37, 38, "b")], [(39, 40, "hl")]], top=1080, size=92))
# S6 music + voice
F.clip(6, '<div id="mus"><div class="lb">score</div>' + "".join(
              f'<div class="n{" o" if k % 5 == 2 else ""}" id="n{k}" style="left:{40 + k * 40}px;top:{80 + ((k * 37) % 7) * 26}px;width:{60 + (k * 13) % 50}px"></div>'
              for k in range(19)) + '</div>'
          '<div id="vo"><b>voice</b>' + "".join(f'<i id="v{k}"></i>' for k in range(24)) + '</div>'
       + F.block([[(41, 43, "b")], [(44, 46, ""), (47, 47, "hl")]], top=1080, size=96))
# S7 no video model
F.clip(7, '<div id="vm"><span>video model<i id="vmi"></i></span></div>'
       + F.block([[(48, 48, "b"), (49, 50, "hl")]], top=1100, size=110))
# S8 up to an hour
F.clip(8, '<div id="clock"><svg width="420" height="420" viewBox="0 0 420 420"><circle cx="210" cy="210" r="170" fill="none" stroke="#ececec" stroke-width="26"/>'
          '<circle id="arc" cx="210" cy="210" r="170" fill="none" stroke="#ff4b1f" stroke-width="26" stroke-linecap="round" pathLength="1" transform="rotate(-90 210 210)"/></svg>'
          '<div class="t" id="ct">0</div><div class="u">minutes</div></div>'
       + F.block([[(51, 53, "")], [(54, 57, "hl")]], top=1080, size=100))
# S9 CTA
F.clip(9, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(58, 58, ""), (59, 59, "hl")], [(60, 65, "")]], top=1020, size=84))

S = F.S
for i in (7, 12, 15, 20, 23, 24, 26, 32, 38, 40, 43, 47, 50, 57, 59):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.05;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
// S0 everything present at frame 0, frames settle in
ft('#t0',{opacity:1,y:40,scale:.97},{opacity:1,y:0,scale:1,duration:1,ease:A},0);
[['#a0',-7],['#a1',6],['#a2',-2]].forEach(([s,r],k)=>ft(s,{opacity:1,y:18+k*8,rotation:r*1.5,scale:.96},{opacity:1,y:0,rotation:r,scale:1,duration:1+k*.15,ease:'back.out(1.4)'},0));
tl.to('#a2',{scale:1.08,duration:.4,ease:'back.out(2)'},S[5]);
outUp(['#t0','#a0','#a1','#a2'],ST[1]);
// S1 name
ft('#na',{opacity:0,y:40,filter:'blur(14px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.5,ease:A},S[8]-0.1);
ft('#nb',{opacity:0,scale:1.6,filter:'blur(24px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.55,ease:A},S[9]-0.12);
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[12]-0.05);
popIn('#c1',S[15]-0.15,{y:60,s:.6,r:-6});
outUp(['#nm','#free','#c1'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 wall of frames, then 66 slams in
for(let k=0;k<20;k++) ft('#g'+k,{opacity:0,scale:.5,y:40},{opacity:.9,scale:1,y:0,duration:.45,ease:'back.out(1.6)'},ST[2]+0.02+k*0.03);
tl.to(Array.from({length:20},(_,k)=>'#g'+k),{opacity:.1,filter:'blur(5px)',duration:.3},S[20]-0.45);
ft('#big66',{opacity:0,scale:2.2,filter:'blur(30px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.5,ease:A},S[20]-0.15);
outUp([...Array.from({length:20},(_,k)=>'#g'+k),'#big66'],ST[3]);
// S3 three styles, one per word
[['#b0',23,-5],['#b1',24,4],['#b2',26,-2]].forEach(([s,i,r])=>popIn(s,S[i]-0.15,{y:100,s:.6,r:r*3}));
outUp(['#b0','#b1','#b2'],ST[4]);
starPass('#st2',ST[4]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S4 the one-line brief types in, a frame appears
ft('#pf',{opacity:0,y:-40,scale:.94},{opacity:1,y:0,scale:1,duration:.5,ease:A},ST[4]+0.02);
typeIn('pft','Watercolor. A lost dog walks home.',ST[4]+0.25,.032);
for(let x=ST[4]+0.4;x<ST[5];x+=0.6){ tl.set('#pc',{opacity:0},x); tl.set('#pc',{opacity:1},x+0.3); }
ft('#p1',{opacity:0,y:160,rotationX:25,transformPerspective:1400},{opacity:1,y:0,rotationX:0,duration:.8,ease:A},S[33]-0.1);
outUp(['#pf','#p1'],ST[5]);
// S5 code + frame counter + filmstrip sliding
popIn('#t5',ST[5]+0.05,{y:60,s:.9,r:-3});
popIn('#cnt',S[37]-0.1,{y:40,s:.6,r:6});
const CN={n:1}; ft(CN,{n:1},{n:720,duration:ST[6]-S[37],ease:'power1.in',onUpdate:()=>{document.getElementById('cn').textContent=String(Math.round(CN.n)).padStart(4,'0')}},S[37]);
ft('#strip',{opacity:0,x:300},{opacity:1,x:-120,duration:ST[6]-ST[5],ease:'none'},ST[5]+0.1);
outUp(['#t5','#cnt','#strip'],ST[6]);
// S6 notes drop on the beat, voice wave
popIn('#mus',ST[6]+0.02,{y:60,s:.92,r:0});
for(let k=0;k<19;k++) ft('#n'+k,{opacity:0,scaleX:0,transformOrigin:'0 50%'},{opacity:1,scaleX:1,duration:.2,ease:'power3.out'},S[42]+k*0.05);
popIn('#vo',S[45]-0.15,{y:60,s:.9,r:0});
for(let k=0;k<24;k++) ft('#v'+k,{scaleY:.3},{scaleY:1+((k*37)%9)/2.5,duration:.16,ease:'sine.inOut',yoyo:true,repeat:7},S[45]+k*0.015);
outUp(['#mus','#vo'],ST[7]);
starPass('#st3',ST[7]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S7 strike
popIn('#vm span',ST[7]+0.02,{y:60,s:.7,r:-4});
ft('#vmi',{scaleX:0},{scaleX:1,duration:.3,ease:'power3.out'},S[49]+0.1);
tl.to('#vm span',{rotation:3,y:30,duration:.3,ease:'back.out(2)'},S[50]);
outUp('#vm span',ST[8]);
// S8 clock up to 60
popIn('#clock',ST[8]+0.05,{y:80,s:.7,r:-8});
ft('#arc',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.0,ease:'power2.inOut'},S[54]);
const CK={n:0}; ft(CK,{n:0},{n:60,duration:1.0,ease:'power2.inOut',onUpdate:()=>{document.getElementById('ct').textContent=Math.round(CK.n)}},S[54]);
outUp('#clock',ST[9]);
cta('OPUSCAR',S[59]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[65]+0.15);
tl.to('#typed',{color:'#ff4b1f',duration:.2},S[65]+0.25);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
