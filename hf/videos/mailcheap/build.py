"""MailCheap - open-source newsletter app, pay per email sent (paid -> free).
Facts: github.com/marclou/mailcheap README (AGPL-3.0): "Newsletters where you pay for the emails you send, not for dormant
subscribers"; "This repository is the whole app. Self-host it with your own Amazon SES or PostShiba account, or use MailCheap
Cloud"; self-hosted "Free, plus what your provider charges per email: $0.10 to $0.16 per 1,000 on Amazon SES"; "10,000 readers
and 4 issues a month is 40,000 emails, about $4 to $6 on Amazon SES"; "Imports from beehiiv, Substack and Mailchimp" (CSV
exports); "A website for each newsletter ... every issue gets a page search engines can find"; MCP: "Claude Code, Codex and
Cursor with an API key. MCP marks sending as an action that can't be undone, so agents ask you first"; setup "About an hour".
Media: README screenshots (overview, editor, website) + app icon. Rest drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "mailcheap"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
DISP = {31: "10,000", 32: "", 35: "4", 41: "$4", 43: "$6", 44: "", 47: "SES."}
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json", display=DISP)
F.scenes([0, 4, 11, 19, 31, 39, 48, 56, 63, 75, 80], hold=0.15)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.pg{position:absolute;border-radius:22px;overflow:hidden;background:#fff;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.32),0 16px 28px -12px rgba(0,0,0,.16),0 0 0 1px rgba(0,0,0,.05)}
.pg img{display:block;width:100%;height:auto}
#bill{position:absolute;left:170px;top:330px;width:740px;border-radius:30px;background:#fff;padding:40px 46px;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05)}
#bill .h{font-family:var(--mono);font-size:30px;color:#8a8a8a}
#bill .r{display:flex;justify-content:space-between;align-items:baseline;margin-top:22px;font-size:44px;font-weight:600}
#bill .r b{font-size:64px;font-weight:800;letter-spacing:-.04em}
#bill .bar{height:20px;border-radius:10px;background:#ececec;margin-top:30px;overflow:hidden}
#bill .bar i{display:block;height:100%;width:100%;background:#111}
#money{position:absolute;left:760px;top:780px}
.env{position:absolute;width:150px;height:104px;border-radius:14px;background:#fff;box-shadow:0 20px 34px -14px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.05)}
.env::before{content:'';position:absolute;left:10px;right:10px;top:10px;height:50px;border-left:65px solid transparent;border-right:65px solid transparent;border-top:44px solid #e6e6e6}
.env.o{background:#ff4b1f}.env.o::before{border-top-color:#fff}
.zz{position:absolute;font-family:var(--serif);font-style:italic;font-size:60px;color:#9a9a9a}
#ico{position:absolute;left:150px;top:300px;width:170px;height:170px;border-radius:40px;background:#fff;padding:26px;box-shadow:0 40px 60px -20px rgba(0,0,0,.3)}
#ico img{width:100%;height:100%}
#nm{position:absolute;left:350px;top:330px;font-size:120px;font-weight:800;letter-spacing:-.06em;line-height:1}
#nm i{font-family:var(--serif);font-weight:500;letter-spacing:-.01em}
#free{position:absolute;left:790px;top:250px;background:#ff4b1f;color:#fff;font-weight:800;font-size:52px;padding:10px 26px;border-radius:18px;transform:rotate(8deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
#ppe{position:absolute;left:560px;top:430px;width:400px;border-radius:30px;background:#141414;color:#fff;padding:34px;box-shadow:0 50px 80px -24px rgba(0,0,0,.45)}
#ppe .h{font-family:var(--mono);font-size:28px;color:#aaa}
#ppe .n{font-size:96px;font-weight:800;letter-spacing:-.05em;margin-top:6px}
#ppe .u{font-size:30px;color:#ff4b1f;font-weight:700}
.eq{position:absolute;left:0;right:0;text-align:center;font-weight:800;letter-spacing:-.05em;line-height:1}
.eq span{color:#ff4b1f}
#eqa{top:340px;font-size:110px}
#eqb{top:500px;font-size:110px}
#eqc{top:700px;font-size:150px}
#eqc small{display:block;font-size:40px;color:#8a8a8a;font-weight:600;letter-spacing:-.02em;margin-top:10px}
#tag{position:absolute;left:260px;top:360px;width:560px;height:360px;border-radius:40px;background:#111;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;
 box-shadow:0 60px 90px -24px rgba(0,0,0,.5)}
#tag .p{font-size:180px;font-weight:800;letter-spacing:-.02em;line-height:1}
#tag .p span{color:#ff4b1f}
#tag .m{font-size:40px;color:#bbb;font-weight:600;margin-top:16px}
#ses{position:absolute;left:330px;top:770px;background:#fff;font-family:var(--mono);font-weight:700;font-size:38px;padding:16px 30px;border-radius:18px;box-shadow:0 30px 50px -16px rgba(0,0,0,.3)}
.csv{position:absolute;width:220px;height:270px;border-radius:22px;background:#fff;box-shadow:0 40px 60px -20px rgba(0,0,0,.28),0 0 0 1px rgba(0,0,0,.05);padding:26px;font-weight:700;font-size:34px}
.csv b{display:inline-block;font-family:var(--mono);font-size:26px;background:#2e9e4a;color:#fff;padding:4px 12px;border-radius:8px;margin-bottom:16px}
.csv i{display:block;height:12px;border-radius:6px;background:#e6e6e6;margin:12px 0}
#hub{position:absolute;left:430px;top:690px;width:220px;height:220px;border-radius:50px;background:#fff;padding:34px;box-shadow:0 40px 60px -20px rgba(0,0,0,.3)}
#hub img{width:100%;height:100%}
#url{position:absolute;left:150px;top:290px;background:#fff;font-family:var(--mono);font-weight:600;font-size:34px;padding:16px 30px;border-radius:40px;box-shadow:0 30px 50px -16px rgba(0,0,0,.25)}
#url b{color:#ff4b1f}
.tm{left:90px;width:900px}
.tm .body{padding:30px 38px;font-size:34px;line-height:1.55}
.tm .p{color:#ff4b1f}.tm .d{color:#8a8a8a}
#dlg{position:absolute;left:190px;top:630px;width:700px;border-radius:30px;background:#fff;padding:36px 40px;box-shadow:0 60px 90px -20px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05)}
#dlg .q{font-size:44px;font-weight:800;letter-spacing:-.03em}
#dlg .s{font-size:30px;color:#8a8a8a;margin-top:8px}
#dlg .bt{display:flex;gap:20px;margin-top:28px}
#dlg .bt span{flex:1;text-align:center;padding:18px 0;border-radius:20px;font-size:36px;font-weight:700;background:#ececec}
#dlg .bt span.y{background:#111;color:#fff}
#hand{position:absolute;left:520px;top:860px;font-size:80px}
#clock{position:absolute;left:330px;top:330px;width:420px;height:420px;border-radius:50%;background:#fff;box-shadow:0 50px 80px -24px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
#clock svg{position:absolute;inset:0}
#clock .t{position:absolute;left:0;right:0;top:140px;text-align:center;font-size:100px;font-weight:800;letter-spacing:-.05em}
#clock .u{position:absolute;left:0;right:0;top:255px;text-align:center;font-size:34px;color:#8a8a8a;font-weight:600}
#dns{position:absolute;left:540px;top:730px;white-space:nowrap;background:#111;color:#fff;font-family:var(--mono);font-size:30px;padding:14px 24px;border-radius:16px;box-shadow:0 30px 50px -16px rgba(0,0,0,.45)}
"""

def pg(pid, src, x, y, w):
    return f'<div id="{pid}" class="pg" style="left:{x}px;top:{y}px;width:{w}px"><img src="assets/{src}" alt=""></div>'

ENV = [(110 + (k % 5) * 175, 340 + (k // 5) * 140) for k in range(20)]
# S0 the bill: priced by subscribers
F.clip(0, '<div id="bill"><div class="h">newsletter plan · monthly</div>'
          '<div class="r"><span>Subscribers</span><b id="subs">10,000</b></div>'
          '<div class="r"><span>You pay for</span><b>all of them</b></div><div class="bar"><i id="bb"></i></div></div>'
          + tile("money", "money", 760, 720, 200, acc=True)
       + F.block([[(0, 0, "b"), (1, 3, "")]], top=1080, size=104))
# S1 most never open
F.clip(1, "".join(f'<div class="env{" o" if k in (3, 11, 17) else ""}" id="e{k}" style="left:{x}px;top:{y}px"></div>' for k, (x, y) in enumerate(ENV))
          + '<div class="zz" id="zz">zzz</div>'
       + F.block([[(4, 5, "")], [(6, 7, ""), (8, 8, "hl")], [(9, 10, "it")]], top=990, size=82))
# S2 name + icon + overview
F.clip(2, '<div id="ico"><img src="assets/icon-512.png" alt=""></div><div id="nm">Mail<i>Cheap</i></div><div id="free">FREE</div>'
          + pg("ov", "overview.jpg", 160, 510, 760)
       + F.block([[(11, 13, ""), (14, 14, "b")], [(15, 16, "hl")], [(17, 18, "b")]], top=990, size=80))
# S3 host it yourself, pay per email
F.clip(3, tile("srv", "local", 120, 400, 330)
          + '<div id="ppe"><div class="h">you pay for</div><div class="n" id="ppn">0</div><div class="u">emails sent</div></div>'
       + F.block([[(19, 22, "")], [(23, 27, "")], [(28, 30, "hl")]], top=990, size=80))
# S4 10,000 readers x 4 issues
F.clip(4, '<div class="eq" id="eqa">10,000 <span>readers</span></div><div class="eq" id="eqb">× 4 <span>issues</span></div>'
          '<div class="eq" id="eqc">40,000<small>emails a month</small></div>'
       + F.block([[(31, 33, "b")], [(34, 36, ""), (37, 38, "it")]], top=1080, size=94))
# S5 $4 to $6 on SES
F.clip(5, '<div id="tag"><div class="p"><span>$</span>4–6</div><div class="m">a month</div></div><div id="ses">on Amazon SES</div>'
       + F.block([[(39, 40, ""), (41, 44, "hl")], [(45, 47, "b")]], top=1060, size=96))
# S6 imports
F.clip(6, "".join(f'<div class="csv" id="cv{k}" style="left:{x}px;top:330px"><b>CSV</b><br>{n}<i></i><i style="width:70%"></i><i></i></div>'
                  for k, (x, n) in enumerate([(110, "beehiiv"), (430, "Substack"), (750, "Mailchimp")]))
          + '<div id="hub"><img src="assets/icon-512.png" alt=""></div>'
       + F.block([[(48, 51, "")], [(52, 53, "b")], [(54, 55, "b")]], top=990, size=80))
# S7 a web page per issue (real screenshot)
F.clip(7, '<div id="url">yourdomain.com<b>/archive/newsletter</b></div>' + pg("ws", "website.jpg", 110, 390, 860)
       + F.block([[(56, 58, "")], [(59, 60, ""), (61, 62, "hl")]], top=1060, size=100))
# S8 agent sends, asks first
F.clip(8, '<div id="t8" class="term tm" style="top:320px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<div><span class="p">&gt;</span> <span id="t8c"></span></div><div class="d" id="t8d">● mailcheap · send campaign</div></div></div>'
          '<div id="dlg"><div class="q">Send this issue now?</div><div class="s">This can\'t be undone.</div>'
          '<div class="bt"><span class="y" id="yes">Yes, send</span><span>Not yet</span></div></div>'
       + F.block([[(63, 65, "b"), (66, 66, "")], [(67, 69, "")], [(70, 71, ""), (72, 74, "hl")]], top=990, size=80))
# S9 setup about an hour
F.clip(9, '<div id="clock"><svg width="420" height="420" viewBox="0 0 420 420"><circle cx="210" cy="210" r="170" fill="none" stroke="#ececec" stroke-width="26"/>'
          '<circle id="arc" cx="210" cy="210" r="170" fill="none" stroke="#ff4b1f" stroke-width="26" stroke-linecap="round" pathLength="1" transform="rotate(-90 210 210)"/></svg>'
          '<div class="t">~1</div><div class="u">hour</div></div><div id="dns">mostly waiting for DNS</div>'
       + F.block([[(75, 76, "")], [(77, 79, "hl")]], top=1060, size=100))
# S10 CTA
F.clip(10, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
        + F.block([[(80, 80, ""), (81, 81, "hl")], [(82, 87, "")]], top=1020, size=84))

S = F.S
for i in (3, 8, 11, 14, 22, 30, 31, 35, 41, 52, 53, 55, 61, 72, 77, 81):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.05;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
// S0 bill present at frame 0
ft('#bill',{opacity:1,y:50,scale:.97},{opacity:1,y:0,scale:1,duration:1,ease:A},0);
ft('#money',{opacity:1,scale:.9,rotation:-8},{opacity:1,scale:1,rotation:0,duration:.8,ease:'back.out(2)'},0);
tl.to('#money',{rotation:10,y:-20,duration:.6,ease:IO,yoyo:true,repeat:2},0.6);
outUp(['#bill','#money'],ST[1]);
// S1 envelopes: most stay unopened
const ENVS=[...Array(20).keys()];
ENVS.forEach(k=>ft('#e'+k,{opacity:0,scale:.4,y:60},{opacity:1,scale:1,y:0,duration:.45,ease:'back.out(1.8)'},ST[1]+0.03+k*0.025));
tl.to(ENVS.filter(k=>![3,11,17].includes(k)).map(k=>'#e'+k),{opacity:.35,filter:'grayscale(1) blur(2px)',duration:.4},S[7]);
ft('#zz',{opacity:0,x:780,y:300},{opacity:1,x:850,y:240,duration:.6,ease:A},S[8]);
outUp([...ENVS.map(k=>'#e'+k),'#zz'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 name, badge, overview screenshot rises
popIn('#ico',ST[2]+0.02,{y:40,s:.4,r:-14});
ft('#nm',{opacity:0,x:60,filter:'blur(20px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.55,ease:A},S[11]-0.1);
ft('#free',{opacity:0,scale:2.4,rotation:-14,filter:'blur(10px)'},{opacity:1,scale:1,rotation:8,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[14]-0.05);
ft('#ov',{opacity:0,y:220,rotationX:28,transformPerspective:1600},{opacity:1,y:0,rotationX:0,duration:.9,ease:A},S[15]-0.2);
outUp(['#ico','#nm','#free','#ov'],ST[3]);
// S3 server + per-email counter
popIn('#srv',ST[3]+0.05,{y:80,s:.6,r:-8});
popIn('#ppe',S[24]-0.1,{y:60,s:.7,r:6});
const PE={n:0}; ft(PE,{n:0},{n:2483,duration:1.2,ease:'power2.out',onUpdate:()=>{document.getElementById('ppn').textContent=Math.round(PE.n).toLocaleString('en-US')}},S[26]);
outUp(['#srv','#ppe'],ST[4]);
// S4 equation builds
ft('#eqa',{opacity:0,y:60,filter:'blur(14px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.5,ease:A},S[31]-0.1);
ft('#eqb',{opacity:0,y:60,filter:'blur(14px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.5,ease:A},S[35]-0.1);
ft('#eqc',{opacity:0,scale:1.5,filter:'blur(20px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.55,ease:'back.out(1.5)'},S[36]);
outUp(['#eqa','#eqb','#eqc'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S5 price tag
ft('#tag',{opacity:0,scale:.4,rotation:-12,filter:'blur(18px)'},{opacity:1,scale:1,rotation:-3,filter:'blur(0px)',duration:.7,ease:'back.out(1.7)'},S[41]-0.15);
popIn('#ses',S[46]-0.1,{y:40,s:.7,r:4});
outUp(['#tag','#ses'],ST[6]);
// S6 CSVs fly into MailCheap
[0,1,2].forEach(k=>popIn('#cv'+k,[S[52],S[53],S[55]][k]-0.15,{y:80,s:.6,r:[-8,4,8][k]}));
popIn('#hub',ST[6]+0.05,{y:60,s:.5,r:0});
[0,1,2].forEach(k=>tl.to('#cv'+k,{x:[320,0,-320][k],y:420,scale:.2,opacity:0,duration:.35,ease:'power3.in'},ST[7]-0.45+k*0.05));
tl.to('#hub',{scale:1.15,duration:.08,yoyo:true,repeat:1},ST[7]-0.15);
outUp('#hub',ST[7]);
// S7 website
popIn('#url',ST[7]+0.05,{y:-30,s:.8,r:0});
ft('#ws',{opacity:0,y:220,rotationX:28,transformPerspective:1600,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.9,ease:A},ST[7]+0.1);
tl.to('#ws',{scale:1.04,duration:Math.max(.5,ST[8]-ST[7]-1),ease:'none'},ST[7]+1);
outUp(['#url','#ws'],ST[8]);
// S8 agent + confirm dialog
popIn('#t8',ST[8]+0.05,{y:60,s:.94,r:0}); typeIn('t8c','send the new issue to my list',ST[8]+0.3,.035);
ft('#t8d',{opacity:0},{opacity:1,duration:.2},S[68]);
ft('#dlg',{opacity:0,scale:.6,y:60,filter:'blur(14px)'},{opacity:1,scale:1,y:0,filter:'blur(0px)',duration:.55,ease:'back.out(1.7)'},S[70]-0.1);
tl.to('#yes',{backgroundColor:'#ff4b1f',duration:.2},S[74]);
outUp(['#t8','#dlg'],ST[9]);
starPass('#st3',ST[9]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S9 clock
popIn('#clock',ST[9]+0.05,{y:80,s:.7,r:-8});
ft('#arc',{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.1,ease:'power2.inOut'},S[77]);
popIn('#dns',S[78],{y:40,s:.7,r:4});
outUp(['#clock','#dns'],ST[10]);
cta('MAILCHEAP',S[81]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[87]+0.15);
tl.to('#typed',{color:'#ff4b1f',duration:.2},S[87]+0.25);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.08)
