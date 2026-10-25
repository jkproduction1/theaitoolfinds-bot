"""Concat - free, open-source CapCut replacement (pillar: paid tool, now free).
Facts: github.com/jub0t/Concat README: "The free, open-source, cross-platform CapCut replacement"; "no watermark, no account,
no subscription, no upload"; auto-captions (local Whisper), text-to-speech, background removal, keyframes; "Everything runs
locally"; "Your footage never leaves your disk"; "work offline"; export "Up to 4K 60"; "a built-in MCP server for AI agents
(`concat --mcp`) ... so Claude and other AI agents can edit with it"; "Concat is in beta"; AGPL-3.0.
Media: README editor screenshot (+ crop of its preview with Concat's own captions) and the app mark. Rest drawn in code."""
import shutil, sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "concat"
for f in (HERE / "media").iterdir():
    shutil.copy(f, W / "assets" / f.name)
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json")
F.scenes([0, 5, 13, 19, 26, 30, 36, 46, 51, 68])

CSS = r"""
#phone{left:330px;top:250px;width:420px;height:740px;border-radius:56px;background:#141414;padding:18px;overflow:hidden}
#phone .scr{position:absolute;left:18px;top:18px;right:18px;height:470px;border-radius:40px;background:linear-gradient(160deg,#3a3a3a,#1b1b1b)}
#phone .play{position:absolute;left:50%;top:235px;transform:translate(-50%,-50%);width:0;height:0;border-left:56px solid rgba(255,255,255,.85);border-top:34px solid transparent;border-bottom:34px solid transparent;margin-left:10px}
#phone .trk{position:absolute;left:30px;right:30px;height:46px;border-radius:12px}
#lk1,#lk2{position:absolute;display:flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:16px 30px 16px 18px;font-weight:800;font-size:40px;
 box-shadow:0 30px 50px -18px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.05)}
#lk1 svg,#lk2 svg{width:52px;height:52px}
#ed{left:70px;top:380px;width:940px;height:525px;overflow:hidden;border-radius:26px;background:#000}
#ed img{position:absolute;left:0;top:0;width:940px;height:auto}
#mark{position:absolute;left:770px;top:240px;width:230px;height:230px;filter:drop-shadow(0 40px 40px rgba(0,0,0,.35))}
.no{position:absolute;left:190px;width:700px;height:150px;border-radius:40px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:66px;letter-spacing:-.03em}
.no s{text-decoration:none;position:relative}
.no s::after{content:'';position:absolute;left:-14px;right:-14px;top:52%;height:11px;background:#ff4b1f;border-radius:6px;transform:scaleX(var(--k,0));transform-origin:0 50%}
#pv{left:90px;top:330px;width:900px;height:504px;overflow:hidden;border-radius:28px}
#pv img{width:100%;height:100%;object-fit:cover}
#wave{position:absolute;left:250px;top:780px;width:580px;height:140px;border-radius:70px;background:#141414;display:flex;align-items:center;justify-content:center;gap:9px;
 box-shadow:0 40px 60px -20px rgba(0,0,0,.4)}
#wave b{display:block;width:10px;border-radius:5px;background:#fff}
#cut{left:140px;top:340px;width:420px;height:520px;overflow:hidden;
 background-color:#fff;background-image:linear-gradient(45deg,#e4e4e4 25%,transparent 25%,transparent 75%,#e4e4e4 75%),linear-gradient(45deg,#e4e4e4 25%,transparent 25%,transparent 75%,#e4e4e4 75%);
 background-size:60px 60px;background-position:0 0,30px 30px}
#cut svg{position:absolute;left:60px;top:80px;width:300px;height:440px}
#cutbg{position:absolute;inset:0;background:linear-gradient(160deg,#6f6f6f,#2b2b2b)}
#kf{left:600px;top:420px;width:380px;height:360px;padding:40px 34px}
#kf .ln{position:absolute;left:34px;right:34px;height:6px;background:#e3e3e3;border-radius:3px}
#kf .d{position:absolute;width:34px;height:34px;background:#111;transform:rotate(45deg);border-radius:6px}
#kf .d.a{background:#ff4b1f}
#kf .lb{font-family:var(--mono);font-weight:700;font-size:30px;color:#8a8a8a}
#local{position:absolute;left:0;right:0;top:860px;text-align:center}
#local span{display:inline-block;background:#111;color:#fff;font-weight:800;font-size:44px;padding:14px 34px;border-radius:40px}
#disk{left:150px;top:380px;width:360px;height:360px;display:flex;align-items:center;justify-content:center}
#disk svg{width:240px;height:240px}
#off{left:570px;top:430px;width:360px;height:360px;display:flex;align-items:center;justify-content:center}
#off svg{width:230px;height:230px}
#k4{position:absolute;left:0;right:0;top:330px;text-align:center;font-size:320px;font-weight:800;letter-spacing:-.07em;line-height:1}
#k4 span{color:#ff4b1f}
#fps{position:absolute;left:0;right:0;top:730px;text-align:center}
#fps i{font-style:normal;display:inline-block;margin:0 10px;padding:12px 28px;border-radius:30px;background:#fff;font-family:var(--mono);font-weight:700;font-size:34px;
 box-shadow:0 20px 34px -14px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.05)}
#mt{left:90px;top:320px;width:620px;height:250px}
#mt .body{padding:30px 36px;font-size:40px;line-height:1.5}
#mt .p{color:#ff4b1f}#mt .g{color:#7a7a7a;font-size:30px}
#mk2{position:absolute;left:770px;top:330px;width:200px;height:200px;filter:drop-shadow(0 30px 30px rgba(0,0,0,.3))}
#link svg{position:absolute;left:0;top:0}
#beta{position:absolute;left:640px;top:800px;background:#ff4b1f;color:#fff;font-weight:800;font-size:60px;padding:12px 34px;border-radius:20px;transform:rotate(-6deg);box-shadow:0 30px 50px -16px rgba(255,75,31,.6)}
"""
LOCK = '<svg viewBox="0 0 100 100" fill="none" stroke="#ff4b1f" stroke-width="9" stroke-linecap="round"><rect x="22" y="44" width="56" height="40" rx="7"/><path d="M34 44V32a16 16 0 0132 0v12"/></svg>'

# S0 a generic phone editor with paywalled extras (drawn, no CapCut branding)
F.clip(0, '<div id="phone" class="card"><div class="scr"><div class="play"></div></div>'
          '<div class="trk" style="top:520px;background:#ff4b1f;opacity:.85"></div><div class="trk" style="top:580px;background:#6f6f6f"></div>'
          '<div class="trk" style="top:640px;background:#3a3a3a;right:120px"></div></div>'
          f'<div id="lk1" style="left:80px;top:400px">{LOCK}Pro</div><div id="lk2" style="left:700px;top:660px">{LOCK}Pro</div>'
       + F.block([[(0, 2, "b")], [(3, 4, "hl")]], top=1040, size=96))
# S1 the real app
F.clip(1, '<div id="ed" class="card"><img src="assets/editor-crop.jpg" alt=""></div><img id="mark" src="assets/concat-mark-dark.png" alt="">'
       + F.block([[(5, 7, "")], [(8, 9, "hl"), (10, 10, "")], [(11, 11, ""), (12, 12, "b")]], top=990, size=78))
# S2 no watermark / account / subscription
F.clip(2, '<div id="n1" class="no card" style="top:360px"><s id="x1">Watermark</s></div>'
          '<div id="n2" class="no card" style="top:560px"><s id="x2">Account</s></div>'
          '<div id="n3" class="no card" style="top:760px"><s id="x3">Subscription</s></div>'
       + F.block([[(13, 14, "b")], [(15, 16, "b")], [(17, 18, "hl")]], top=1000, size=76))
# S3 captions (real preview crop) + TTS wave
bars = "".join(f'<b id="wb{k}" style="height:{[30, 60, 90, 50, 80, 40, 70, 100, 60, 30, 80, 50, 90, 40, 60, 30][k % 16]}px"></b>' for k in range(26))
F.clip(3, '<div id="pv" class="card"><img src="assets/preview.jpg" alt=""></div><div id="wave">' + bars + '</div>'
       + F.block([[(19, 20, ""), (21, 22, "hl")], [(23, 25, "b")]], top=1040, size=86))
# S4 background removal + keyframes
person = ('<svg viewBox="0 0 300 440"><circle cx="150" cy="110" r="78" fill="#111"/>'
          '<path d="M10 440c0-120 60-190 140-190s140 70 140 190z" fill="#111"/></svg>')
F.clip(4, '<div id="cut" class="card"><div id="cutbg"></div>' + person + '</div>'
          '<div id="kf" class="card"><div class="lb">position</div><div class="ln" style="top:130px"></div>'
          '<div class="d" id="d1" style="left:50px;top:114px"></div><div class="d a" id="d2" style="left:170px;top:114px"></div><div class="d" id="d3" style="left:290px;top:114px"></div>'
          '<div class="lb" style="margin-top:110px">scale</div><div class="ln" style="top:290px"></div>'
          '<div class="d" id="d4" style="left:90px;top:274px"></div><div class="d a" id="d5" style="left:250px;top:274px"></div></div>'
       + F.block([[(26, 27, "b")], [(28, 28, ""), (29, 29, "hl")]], top=1040, size=90))
# S5 all local
F.clip(5, tile("lap", "local", 340, 330, 400) + '<div id="local"><span>100% local</span></div>'
       + F.block([[(30, 31, "")], [(32, 33, ""), (34, 35, "hl")]], top=1040, size=86))
# S6 never leaves your disk + offline
DISK = '<svg viewBox="0 0 100 100" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="20" width="72" height="60" rx="8"/><path d="M14 58h72"/><circle cx="72" cy="69" r="3" fill="#111"/><path d="M38 30l12 12 12-12M50 42V26" stroke="#ff4b1f"/></svg>'
OFF = '<svg viewBox="0 0 100 100" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"><path d="M14 40a52 52 0 0172 0M26 54a34 34 0 0148 0M38 67a16 16 0 0124 0"/><circle cx="50" cy="80" r="4" fill="#111"/><path d="M16 16l68 68" stroke="#ff4b1f" stroke-width="8"/></svg>'
F.clip(6, f'<div id="disk" class="card">{DISK}</div><div id="off" class="card">{OFF}</div>'
       + F.block([[(36, 39, "")], [(40, 41, "b")], [(42, 43, ""), (44, 45, "hl")]], top=1000, size=80))
# S7 4K 60
F.clip(7, '<div id="k4">4K<span>60</span></div><div id="fps"><i>H.264</i><i>HEVC</i><i>AV1</i></div>'
       + F.block([[(46, 48, "")], [(49, 50, "hl")]], top=1040, size=96))
# S8 MCP server + beta
F.clip(8, '<div id="mt" class="term"><div class="bar"><i></i><i></i><i></i></div><div class="body"><div><span class="p">$</span> <span id="mc"></span></div>'
          '<div class="g">MCP server ready</div></div></div><img id="mk2" src="assets/concat-mark-dark.png" alt="">'
          + chip("cl", "Claude", 140, 650, "C", "#d97757")
          + '<div id="link"><svg width="1080" height="1000" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 16">'
            '<path id="lnk" d="M470 720 C640 720 870 680 870 540"/></svg></div><div id="beta">BETA</div>'
       + F.block([[(51, 54, ""), (55, 56, "hl")], [(57, 61, "")], [(62, 63, ""), (64, 67, "it")]], top=1000, size=70))
# S9 CTA
F.clip(9, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(68, 68, ""), (69, 69, "hl")], [(70, 75, "")]], top=1020, size=84))

S = F.S
for i in (4, 12, 14, 16, 18, 22, 25, 27, 29, 41, 45, 49, 55, 58, 67, 69):
    F.pop(S[i] - 0.05)

JS = r"""
// S0 phone already there at t=0, locks pop
ft('#phone',{opacity:1,y:80,rotation:-4,scale:.95},{opacity:1,y:0,rotation:-2,scale:1,duration:1.2,ease:A},0);
popIn('#lk1',0.15,{y:40,s:.6,r:-12}); popIn('#lk2',S[3],{y:40,s:.6,r:10});
tl.to('#lk1',{y:-14,rotation:-6,duration:1.2,ease:'sine.inOut'},0.8);
tl.to(['#phone','#lk1','#lk2'],{y:-500,opacity:0,filter:'blur(16px)',duration:.28,ease:IN,stagger:.03},ST[1]-0.3);
// S1 real screenshot + mark
ft('#ed',{opacity:0,y:160,scale:.86,rotationX:18,transformPerspective:1400},{opacity:1,y:0,scale:1,rotationX:0,duration:.8,ease:A},ST[1]);
ft('#ed img',{scale:1,x:0,y:0},{scale:1.12,x:-40,y:-20,duration:ST[2]-ST[1],ease:'none'},ST[1]);
popIn('#mark',S[12]-0.1,{y:-60,s:.3,r:-24});
outUp(['#ed','#mark'],ST[2]);
starPass('#st1',ST[2]-0.3,[700,-650,0],[430,-360,40],10,1.2);
// S2 crossed out
[[1,13],[2,15],[3,17]].forEach(([k,w])=>{ popIn('#n'+k,S[w]-0.12,{y:60,s:.85,r:k%2?-4:4});
  ft("#x"+k,{"--k":0},{'--k':1,duration:.3,ease:'power2.out'},S[w+1]+0.05); });
outUp(['#n1','#n2','#n3'],ST[3]);
// S3 captions preview + speech wave
ft('#pv',{opacity:0,y:120,scale:.9,filter:'blur(12px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.6,ease:A},ST[3]);
ft('#pv img',{scale:1.02},{scale:1.15,transformOrigin:'50% 80%',duration:ST[4]-ST[3],ease:'none'},ST[3]);
popIn('#wave',S[23]-0.1,{y:60,s:.8,r:0});
for(let k=0;k<26;k++) ft('#wb'+k,{scaleY:.2},{scaleY:1,duration:.18,ease:'sine.inOut',repeat:5,yoyo:true},S[23]+k*0.012);
outUp(['#pv','#wave'],ST[4]);
// S4 cutout: background fades away to transparency grid, keyframes pop
popIn('#cut',ST[4]+0.02,{y:60,s:.85,r:-5});
ft('#cutbg',{opacity:1},{opacity:0,duration:.5,ease:'power2.out'},S[27]-0.05);
popIn('#kf',ST[4]+0.12,{y:60,s:.85,r:5});
['#d1','#d2','#d3','#d4','#d5'].forEach((d,k)=>ft(d,{scale:0,rotation:0},{scale:1,rotation:45,duration:.4,ease:'back.out(3)'},S[29]-0.1+k*0.07));
outUp(['#cut','#kf'],ST[5]);
starPass('#st2',ST[5]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S5 local
popIn('#lap',ST[5]+0.02,{y:80,s:.7,r:-8});
ft('#local',{opacity:0,y:30,filter:'blur(8px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.4,ease:A},S[34]-0.1);
outUp(['#lap','#local'],ST[6]);
// S6 disk + offline
popIn('#disk',ST[6]+0.02,{y:60,s:.8,r:-6}); popIn('#off',S[44]-0.1,{y:60,s:.8,r:6});
outUp(['#disk','#off'],ST[7]);
// S7 4K 60
ft('#k4',{opacity:0,scale:2.2,filter:'blur(30px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.6,ease:A},S[49]-0.25);
ft('#fps i',{opacity:0,y:40},{opacity:1,y:0,duration:.4,ease:'back.out(2)',stagger:.08},S[49]+0.15);
ft('#k4',{y:0},{y:-20,duration:1.5,ease:'none'},S[50]);
outUp(['#k4','#fps'],ST[8]);
// S8 MCP
popIn('#mt',ST[8]+0.02,{y:60,s:.92,r:0});
const mc=document.getElementById('mc'), MX='concat --mcp', MO={n:0};
ft(MO,{n:0},{n:MX.length,duration:.04*MX.length,ease:`steps(${MX.length})`,onUpdate:()=>{mc.textContent=MX.slice(0,Math.round(MO.n))}},S[55]-0.2);
popIn('#mk2',S[55],{y:-40,s:.4,r:-20});
popIn('#cl',S[58]-0.1,{y:60,s:.7,r:0});
ft('#link svg',{opacity:0},{opacity:1,duration:.3},S[59]);
ft('#lnk',{strokeDashoffset:0},{strokeDashoffset:-108,duration:2.2,ease:'none'},S[59]);
ft('#beta',{opacity:0,scale:2.4,rotation:10},{opacity:1,scale:1,rotation:-6,duration:.4,ease:'back.out(2)'},S[67]-0.08);
outUp(['#mt','#mk2','#cl','#link svg','#beta'],ST[9]);
starPass('#st3',ST[9]-0.3,[900,1500,0],[760,1460,50],8,1.2);
cta('CONCAT',S[69]);
"""
F.write(CSS, JS, music_vol=0.10)
