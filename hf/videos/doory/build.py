"""Doory - free, open-source Canva alternative (pillar: paid -> free).
Facts: github.com/shaongitbd/doory README: "design editor that runs in the browser: posters, social posts, stories, slides,
invitations, resumes, thumbnails and business cards"; "export PNG, JPG, SVG, PDF, MP4 or GIF"; "There is no paid plan";
FAQ "Doory has no paid plan, no locked features and no ads"; text, shapes, ~27,500 icons; "background removal that runs in
the browser"; enter/exit/emphasis animations, 16 page transitions, 24 music loops; self-host with Docker
(docker compose up -d --build, open localhost:8080); "It is a young project ... ten starter templates".
License: Attribution Assurance License (credit required). No public hosted instance: you run it yourself.
Media: README images (template-collage, editor, feature-animate, feature-export) and demo.gif frame, cropped. Rest in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile

W = HERE.parent.parent / "work" / "doory"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json")
F.scenes([0, 10, 18, 27, 33, 41, 49, 55, 61, 69, 75, 84], hold=0.15)

CSS = r"""
.im{position:absolute;border-radius:22px;overflow:hidden;background:#fff;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.32),0 16px 28px -12px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.05)}
.im img{display:block;width:100%;height:auto}
.pro{position:absolute;right:-16px;top:-18px;background:#111;color:#fff;font-weight:800;font-size:34px;padding:8px 20px;border-radius:14px;
 box-shadow:0 16px 26px -10px rgba(0,0,0,.5)}
.pro::before{content:'♛ ';color:#ffc53d}
#nm{position:absolute;left:0;right:0;top:420px;text-align:center;font-size:250px;font-weight:800;letter-spacing:-.075em;line-height:1}
#nm span{color:#ff4b1f}
#free{position:absolute;left:620px;top:330px;background:#ff4b1f;color:#fff;font-weight:800;font-size:68px;padding:12px 34px;border-radius:22px;transform:rotate(8deg);
 box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#oss{position:absolute;left:170px;top:740px;background:#111;color:#fff;font-family:var(--mono);font-weight:700;font-size:40px;padding:16px 30px;border-radius:18px}
.brw{position:absolute;left:90px;top:340px;width:900px;border-radius:26px;background:#fff;overflow:hidden;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.30),0 18px 30px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.05)}
.brw .bar{height:64px;background:#f1f1f0;display:flex;align-items:center;gap:12px;padding-left:24px}
.brw .bar i{width:16px;height:16px;border-radius:50%;background:#d0d0d0}
.brw .bar span{margin-left:22px;flex:0 0 520px;height:40px;border-radius:20px;background:#fff;font-family:var(--mono);font-size:24px;color:#777;display:flex;align-items:center;padding-left:22px}
.brw img{display:block;width:900px;height:auto}
#cv{position:absolute;left:250px;top:350px;width:580px;height:580px;border-radius:24px;overflow:hidden;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.32),0 0 0 1px rgba(0,0,0,.05)}
#cv img{position:absolute;left:0;top:0;width:580px;height:580px}
#shp{position:absolute;left:790px;top:330px;width:170px;height:170px;border-radius:50%;background:#ffc53d;box-shadow:0 30px 50px -18px rgba(0,0,0,.35)}
#shp2{position:absolute;left:120px;top:700px;width:150px;height:150px;background:#111;border-radius:26px;transform:rotate(12deg);box-shadow:0 30px 50px -18px rgba(0,0,0,.4)}
#cur{position:absolute;left:0;top:0;width:60px;height:60px}
#bgc{position:absolute;left:290px;top:350px;width:500px;height:560px;border-radius:30px;overflow:hidden;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.30),0 0 0 1px rgba(0,0,0,.05);
 background-color:#fff;background-image:linear-gradient(45deg,#e4e4e4 25%,transparent 25%,transparent 75%,#e4e4e4 75%),linear-gradient(45deg,#e4e4e4 25%,transparent 25%,transparent 75%,#e4e4e4 75%);
 background-size:50px 50px;background-position:0 0,25px 25px}
#bgfill{position:absolute;inset:0;background:linear-gradient(160deg,#ff8a5c,#ff4b1f 60%,#c7340f)}
#bgfill i{position:absolute;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.25)}
#who{position:absolute;left:0;top:0}
#scan{position:absolute;top:0;bottom:0;width:8px;background:#fff;box-shadow:0 0 30px 8px rgba(255,255,255,.9)}
#inb{position:absolute;left:600px;top:850px;background:#111;color:#fff;font-weight:700;font-size:36px;padding:16px 28px;border-radius:20px}
.sc{position:absolute;display:flex;align-items:center;gap:18px;background:#fff;border-radius:999px;padding:18px 36px 18px 20px;font-weight:700;font-size:46px;letter-spacing:-.03em;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.04);white-space:nowrap}
.sc b{width:64px;height:64px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-size:32px}
.sc b.o{background:#ff4b1f}
.fmt{position:absolute;background:#111;color:#fff;font-family:var(--mono);font-weight:800;font-size:64px;padding:18px 40px;border-radius:24px;box-shadow:0 30px 50px -16px rgba(0,0,0,.45)}
.fmt.o{background:#ff4b1f;box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
.no{position:absolute;left:190px;width:700px;height:150px;border-radius:34px;background:#fff;display:flex;align-items:center;padding-left:48px;font-weight:800;font-size:64px;letter-spacing:-.04em;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.04)}
.no s{position:absolute;left:36px;top:70px;height:12px;border-radius:6px;background:#ff4b1f;width:0}
.no em{position:absolute;right:40px;font-style:normal;width:78px;height:78px;border-radius:50%;background:#ff4b1f;color:#fff;display:flex;align-items:center;justify-content:center;font-size:44px}
.tm9{left:100px;top:440px;width:880px}
.tm9 .body{padding:40px 44px;font-size:42px;line-height:1.6}
.tm9 .p{color:#ff4b1f}.tm9 .g{color:#8a8a8a}
#whale{position:absolute;left:400px;top:760px}
#ten{position:absolute;left:110px;top:300px;font-size:330px;font-weight:800;letter-spacing:-.08em;line-height:1}
#tenl{position:absolute;left:480px;top:400px;font-family:var(--serif);font-style:italic;font-size:110px;line-height:1}
#early{position:absolute;left:520px;top:540px;border:6px solid #ff4b1f;color:#ff4b1f;font-weight:800;font-size:50px;padding:6px 22px;border-radius:14px;transform:rotate(-6deg)}
.mini{position:absolute;top:690px;height:230px;border-radius:14px;overflow:hidden;box-shadow:0 30px 50px -18px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
.mini img{height:230px;width:auto;display:block}
"""

def im(iid, src, x, y, w, extra=""):
    return f'<div id="{iid}" class="im" style="left:{x}px;top:{y}px;width:{w}px"><img src="assets/{src}" alt="">{extra}</div>'

# S0 paid templates fanned, each with a PRO crown
F.clip(0, im("a0", "t_poster.jpg", 80, 380, 300, '<div class="pro">PRO</div>')
       + im("a2", "t_story.jpg", 720, 380, 260, '<div class="pro">PRO</div>')
       + im("a1", "t_sale.jpg", 330, 330, 420, '<div class="pro">PRO</div>')
       + F.block([[(0, 1, ""), (2, 3, "hl")], [(4, 7, "")], [(8, 9, "b")]], top=1020, size=84))
# S1 name + FREE + open source
F.clip(1, '<div id="nm">Doory<span>.</span></div><div id="free">FREE</div><div id="oss">open source</div>'
       + F.block([[(10, 11, ""), (12, 12, "b")], [(13, 14, "it"), (15, 15, "")], [(16, 16, ""), (17, 17, "hl")]], top=1020, size=84))
# S2 editor in a browser window (real screenshot)
F.clip(2, '<div id="brw" class="brw"><div class="bar"><i></i><i></i><i></i><span id="url2"></span></div><img src="assets/editor_wide.jpg" alt=""></div>'
       + F.block([[(18, 19, ""), (20, 21, "b")], [(22, 24, "")], [(25, 26, "hl")]], top=1030, size=84))
# S3 template types pop on their words (real starter templates)
F.clip(3, im("p0", "t_poster.jpg", 70, 340, 270) + im("p1", "t_story.jpg", 360, 400, 200) + im("p2", "t_deck.jpg", 580, 330, 430)
       + im("p3", "t_thumb.jpg", 590, 620, 400) + im("p4", "t_resume.jpg", 330, 690, 180)
       + F.block([[(27, 28, "b")], [(29, 30, "b")], [(31, 31, ""), (32, 32, "hl")]], top=1030, size=84))
# S4 edit the text (real demo: WEEKEND -> SUMMER, 30% -> 50%), shapes fly in
F.clip(4, '<div id="cv"><img src="assets/canvas.jpg" alt=""><img id="cva" src="assets/sale_after.jpg" alt=""></div>'
          '<div id="shp"></div><div id="shp2"></div>' + tile("ic4", "spark", 820, 700, 170, acc=True)
       + F.block([[(33, 34, ""), (35, 35, "hl")], [(36, 38, "")], [(39, 40, "b")]], top=1030, size=84))
# S5 background removal (drawn)
F.clip(5, '<div id="bgc"><div id="bgfill"><i style="left:40px;top:60px"></i><i style="left:330px;top:130px;width:80px;height:80px"></i><i style="left:360px;top:380px"></i></div>'
          '<svg id="who" width="500" height="560" viewBox="0 0 500 560"><circle cx="250" cy="215" r="92" fill="#111"/><path d="M80 560c0-120 76-200 170-200s170 80 170 200z" fill="#111"/></svg>'
          '<div id="scan"></div></div><div id="inb">✓ in your browser</div>'
       + F.block([[(41, 42, ""), (43, 44, "b")], [(45, 48, "hl")]], top=1060, size=84))
# S6 animate panel (real) + chips
F.clip(6, im("ap", "animpanel.jpg", 120, 330, 290)
          + '<div class="sc" id="c61" style="left:460px;top:430px"><b class="o">⇄</b>Page transitions</div>'
            '<div class="sc" id="c62" style="left:520px;top:640px"><b>♫</b>Music</div>'
       + F.block([[(49, 49, ""), (50, 50, "b")], [(51, 52, "it")], [(53, 53, ""), (54, 54, "hl")]], top=1030, size=84))
# S7 share / export menu (real) + format pills
F.clip(7, im("sh", "share.jpg", 330, 330, 420) + '<div class="fmt" id="f1" style="left:90px;top:520px">MP4</div><div class="fmt o" id="f2" style="left:770px;top:720px">GIF</div>'
       + F.block([[(55, 57, "")], [(58, 58, "hl"), (59, 59, ""), (60, 60, "hl")]], top=1060, size=90))
# S8 no paid plan / locked features / ads
F.clip(8, "".join(f'<div class="no" id="no{k}" style="top:{360 + k * 190}px">{t}<s id="nos{k}"></s><em>✕</em></div>'
                  for k, t in enumerate(["Paid plan", "Locked features", "Ads"]))
       + F.block([[(61, 63, "b")], [(64, 66, "")], [(67, 68, "hl")]], top=1030, size=84))
# S9 self-host with Docker
F.clip(9, '<div id="t9" class="term tm9"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">$</span> <span id="ty9"></span></div><div class="g" id="ok9">✓ open localhost:8080</div></div></div>'
       + F.block([[(69, 72, "")], [(73, 73, ""), (74, 74, "hl")]], top=1060, size=90))
# S10 still early: 10 templates
F.clip(10, '<div id="ten">10</div><div id="tenl">templates</div><div id="early">STILL EARLY</div>'
       + "".join(f'<div class="mini" id="mi{k}" style="left:{x}px"><img src="assets/{s}" alt=""></div>'
                 for k, (s, x) in enumerate([("t_invite.jpg", 90), ("t_grand.jpg", 300), ("t_poster.jpg", 520), ("t_story.jpg", 740)]))
       + F.block([[(75, 76, ""), (77, 78, "hl")], [(79, 81, "b")], [(82, 83, "it")]], top=1020, size=84))
# S11 CTA
F.clip(11, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(84, 84, ""), (85, 85, "hl")], [(86, 91, "")]], top=1020, size=84))

S = F.S
for i in (12, 17, 27, 28, 29, 30, 32, 38, 40, 50, 52, 54, 58, 60, 74, 80):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.045;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
// S0 PRO templates already there at t=0, settle with depth
[['#a0',-9,0],['#a1',0,0.06],['#a2',8,0.12]].forEach(([s,r,d],k)=>{
  ft(s,{opacity:1,y:50,rotation:r*1.5,scale:.95,filter:'blur(0px)'},{opacity:1,y:0,rotation:r,scale:1,filter:'blur(0px)',duration:1.1,ease:A},d);
  ft(s+' .pro',{scale:0,rotation:-30},{scale:1,rotation:6,duration:.45,ease:'back.out(2.5)'},[S[2],S[3],S[7]][k]-0.05); });
tl.to(['#a0','#a1','#a2'],{y:700,rotation:'+=18',opacity:0,filter:'blur(16px)',duration:.32,ease:IN,stagger:.04},ST[1]-0.34);
// S1 name
ft('#nm',{opacity:0,scale:1.5,filter:'blur(26px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.6,ease:A},S[17]-0.15);
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[12]-0.05);
popIn('#oss',S[13]-0.05,{y:40,s:.7,r:-6});
outUp(['#nm','#free','#oss'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 browser
ft('#brw',{opacity:0,y:220,rotationX:28,transformPerspective:1600,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.9,ease:A},ST[2]+0.02);
typeIn('url2','doory · your own server',ST[2]+0.3,.035);
ft('#brw img',{scale:1},{scale:1.12,transformOrigin:'60% 40%',duration:ST[3]-ST[2],ease:'none'},ST[2]);
outUp('#brw',ST[3]);
// S3 template pops
[27,28,29,30,32].forEach((w,k)=>popIn('#p'+k,S[w]-0.2,{y:90,s:.6,r:[-8,6,-4,5,-7][k]}));
tl.to(['#p0','#p1','#p2','#p3','#p4'],{y:'-=12',duration:.4,ease:'sine.inOut',yoyo:true,repeat:1,stagger:.05},S[32]+0.2);
outUp(['#p0','#p1','#p2','#p3','#p4'],ST[4]);
// S4 edit: crossfade weekend -> summer; shapes fly in on their words
popIn('#cv',ST[4]+0.02,{y:80,s:.9,r:-3});
ft('#cva',{opacity:0,filter:'blur(8px)'},{opacity:1,filter:'blur(0px)',duration:.35,ease:'power2.out'},S[35]);
tl.to('#cv',{scale:1.04,duration:.25,ease:'back.out(3)',yoyo:true,repeat:1},S[35]);
ft('#shp',{opacity:0,x:260,y:-120,scale:.4,filter:'blur(12px)'},{opacity:1,x:0,y:0,scale:1,filter:'blur(0px)',duration:.7,ease:'back.out(1.6)'},S[38]-0.15);
ft('#shp2',{opacity:0,x:-260,y:120,rotation:-40},{opacity:1,x:0,y:0,rotation:12,duration:.7,ease:'back.out(1.6)'},S[38]+0.05);
popIn('#ic4',S[40]-0.15,{y:100,s:.4,r:20});
outUp(['#cv','#shp','#shp2','#ic4'],ST[5]);
// S5 background removal: scan wipes the background away
popIn('#bgc',ST[5]+0.02,{y:80,s:.9,r:3});
ft('#scan',{x:-20,opacity:1},{x:510,duration:.9,ease:'power2.inOut'},S[44]-0.1);
ft('#bgfill',{clipPath:'inset(0 0 0 0%)'},{clipPath:'inset(0 0 0 100%)',duration:.9,ease:'power2.inOut'},S[44]-0.1);
popIn('#inb',S[47]-0.1,{y:40,s:.7,r:6});
outUp(['#bgc','#inb'],ST[6]);
starPass('#st2',ST[6]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S6 animate
ft('#ap',{opacity:0,x:-200,rotationY:30,transformPerspective:1400},{opacity:1,x:0,rotationY:0,duration:.8,ease:A},ST[6]+0.02);
ft('#ap img',{y:0},{y:-60,duration:ST[7]-ST[6],ease:'none'},ST[6]);
popIn('#c61',S[51]-0.15,{y:60,s:.6,r:6}); popIn('#c62',S[54]-0.15,{y:60,s:.6,r:-6});
tl.to('#c62 b',{rotation:-15,duration:.15,yoyo:true,repeat:3},S[54]+0.3);
outUp(['#ap','#c61','#c62'],ST[7]);
// S7 export menu + format pills
ft('#sh',{opacity:0,y:-80,scale:.85,filter:'blur(10px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.6,ease:A},ST[7]+0.02);
popIn('#f1',S[58]-0.12,{y:60,s:.5,r:-12}); popIn('#f2',S[60]-0.12,{y:60,s:.5,r:12});
outUp(['#sh','#f1','#f2'],ST[8]);
// S8 strike-through rows
[61,64,67].forEach((w,k)=>{ popIn('#no'+k,S[w]-0.15,{y:60,s:.85,r:k%2?3:-3});
  ft('#nos'+k,{width:0},{width:[300,520,120][k],duration:.35,ease:'power3.out'},S[w]+0.15);
  ft('#no'+k+' em',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.4,ease:'back.out(3)'},S[w]+0.25); });
outUp(['#no0','#no1','#no2'],ST[9]);
// S9 docker
popIn('#t9',ST[9]+0.02,{y:60,s:.94,r:0});
typeIn('ty9','docker compose up -d',S[70],.04);
ft('#ok9',{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:A},S[74]+0.1);
tl.to('#t9 .p',{color:'#fff',duration:.2,yoyo:true,repeat:1},S[74]);
outUp('#t9',ST[10]);
starPass('#st3',ST[10]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S10 ten templates, still early
const TN={n:0}; ft(TN,{n:0},{n:10,duration:.5,ease:'power2.out',onUpdate:()=>{document.getElementById('ten').textContent=Math.round(TN.n)}},S[80]-0.1);
ft('#ten',{opacity:0,scale:.6,filter:'blur(20px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.5,ease:A},S[80]-0.2);
ft('#tenl',{opacity:0,x:60},{opacity:1,x:0,duration:.5,ease:A},S[81]-0.1);
ft('#early',{opacity:0,scale:2.2,rotation:-20},{opacity:1,scale:1,rotation:-6,duration:.35,ease:'back.out(2)'},S[77]-0.05);
[0,1,2,3].forEach(k=>popIn('#mi'+k,S[81]+k*0.08,{y:80,s:.7,r:k%2?5:-5}));
outUp(['#ten','#tenl','#early','#mi0','#mi1','#mi2','#mi3'],ST[11]);
cta('DOORY',S[85]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[91]+0.2);
tl.to('#typed',{color:'#ff4b1f',duration:.2},S[91]+0.3);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.10)
