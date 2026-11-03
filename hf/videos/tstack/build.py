"""tstack - Theo's (t3dotgg) agent skills for Claude Code and Codex (listicle, 4 of 9 skills).
Facts: github.com/t3dotgg/tstack README (MIT): "The agent skills I use every day ... They work in Claude Code and Codex";
9 skills in skills/ (full-send, full-stop, council, sol-loop, file-pr, takeover, babysit-pr, modernize, leaving-pr-comments);
council "Gets review from three models from different providers, and loops until they agree"; babysit-pr "Watches a PR
through CI and review bots, and fixes the real findings"; takeover "Finishes someone else's PR, branch, or agent thread, and
keeps their credit"; full-send "Takes a change to a merged PR with nobody watching: proves it, reviews it, files it,
babysits it, merges it". Install line is from the README. Everything on screen is drawn in code (no third-party media)."""
import sys
from pathlib import Path
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from house import Film, tile, chip

W = HERE.parent.parent / "work" / "tstack"
F = Film(W, (HERE / "script.txt").read_text(), W / "assets" / "voice.json",
         display={7: "tstack", 65: "Comment", 66: "TSTACK"}, tail=1.0)
F.scenes([0, 6, 17, 20, 32, 44, 55, 65], hold=0.12)

CSS = r"""
#s0 #w0{opacity:1!important;filter:none!important}
.pr{position:absolute;left:110px;width:860px;background:#fff;border-radius:30px;padding:34px 40px;
 box-shadow:0 60px 90px -20px rgba(0,0,0,.28),0 18px 30px -10px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04)}
.pr .h{display:flex;align-items:center;gap:18px;font-weight:800;font-size:50px;letter-spacing:-.03em}
.pr .h .n{color:#9a9a9a;font-weight:600}
.pr .st{display:inline-flex;align-items:center;gap:10px;font-size:28px;font-weight:700;color:#fff;background:#1f883d;border-radius:999px;padding:8px 20px}
.pr .st.mg{background:#8250df}
.ck{display:flex;align-items:center;gap:18px;font-family:var(--mono);font-size:38px;font-weight:600;padding:24px 0;border-top:2px solid #efefee}
.ck:first-of-type{margin-top:22px}
.ck i{width:42px;height:42px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;color:#fff;font-style:normal;font-size:24px;font-weight:800}
.ck .pend{border:5px solid #d9d9d9;border-top-color:#ff4b1f;background:transparent}
.ck .bad{background:#cf222e}.ck .ok{background:#1f883d}
.ck i{position:relative}.ck i u{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-decoration:none}.ck .gv{opacity:0}
.ck span{flex:1}.ck em{font-style:normal;color:#9a9a9a;font-size:26px}
.num{position:absolute;left:70px;top:270px;font-family:var(--mono);font-weight:800;font-size:34px;color:#fff;background:#111;border-radius:12px;padding:8px 18px}
.tm{left:70px;width:940px}
.tm .body{padding:28px 34px;font-size:32px;line-height:1.55}
.tm .p{color:#ff4b1f}.tm .d{color:#8a8a8a}
.sk{position:absolute;font-family:var(--mono);font-weight:700;font-size:30px;background:#fff;border-radius:14px;padding:10px 20px;white-space:nowrap;
 box-shadow:0 20px 34px -14px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.05)}
.sk.on{background:#111;color:#fff}
#c1a,#c1b{font-size:46px}
.md{position:absolute;width:250px;height:250px;border-radius:44px;background:linear-gradient(160deg,#fff,#f1f1f1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
 font-weight:800;font-size:38px;box-shadow:0 50px 70px -22px rgba(0,0,0,.30),0 0 0 1px rgba(0,0,0,.04)}
.md b{width:90px;height:90px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:44px}
.md .ag{position:absolute;right:-14px;top:-14px;width:64px;height:64px;border-radius:50%;background:#1f883d;color:#fff;display:flex;align-items:center;justify-content:center;font-size:36px;
 box-shadow:0 12px 20px -8px rgba(0,0,0,.4)}
#diff{position:absolute;left:290px;top:330px;width:500px;background:#141414;border-radius:24px;padding:22px 28px;font-family:var(--mono);font-size:28px;line-height:1.55;color:#ddd;
 box-shadow:0 50px 80px -20px rgba(0,0,0,.45)}
#diff .a{color:#7ee787}#diff .r{color:#ff8a80}
#loop{position:absolute;left:440px;top:560px;width:200px;height:200px}
.av{width:60px;height:60px;border-radius:50%;flex:none}
.cred{position:absolute;left:110px;top:780px;width:860px;display:flex;align-items:center;gap:20px;background:#fff;border-radius:22px;padding:22px 30px;font-size:34px;font-weight:700;
 box-shadow:0 40px 60px -18px rgba(0,0,0,.28),0 0 0 3px #ff4b1f}
.cred span{font-family:var(--mono);font-size:30px;color:#6f6f6f;font-weight:600}
#pipe{position:absolute;left:60px;right:60px;top:330px;display:flex;flex-direction:column;gap:18px;align-items:center}
#pipe div{font-family:var(--mono);font-weight:700;font-size:40px;background:#fff;color:#b3b3b3;border-radius:18px;padding:14px 30px;width:560px;display:flex;justify-content:space-between;
 box-shadow:0 20px 34px -14px rgba(0,0,0,.25)}
#pipe div i{font-style:normal}
#merged{position:absolute;left:600px;top:840px;background:#8250df;color:#fff;font-weight:900;font-size:62px;padding:10px 32px;border-radius:20px;transform:rotate(-6deg);box-shadow:0 30px 50px -16px rgba(130,80,223,.6)}
#nobody{position:absolute;left:120px;top:870px;font-family:var(--serif);font-style:italic;font-size:52px;color:#6f6f6f}
#four{position:absolute;left:0;right:0;top:300px;text-align:center;font-weight:800;font-size:300px;letter-spacing:-.06em;line-height:1}
#four span{font-family:var(--serif);font-style:italic;font-weight:500;font-size:80px;color:#6f6f6f;letter-spacing:0;margin-left:16px}
.sk.big{font-size:46px;padding:16px 30px;border-radius:18px;width:410px;text-align:center}
#credit{position:absolute;left:0;right:0;top:190px;text-align:center;font-family:var(--mono);font-size:24px;color:#8a8a8a}
"""

def pr(pid, top, title, status, checks, mg=False):
    c = "".join(f'<div class="ck" id="{pid}k{k}"><i class="{cl}" id="{pid}i{k}"><u class="gx" id="{pid}x{k}">{g}</u><u class="gv" id="{pid}v{k}">✓</u></i><span>{t}</span><em>{e}</em></div>'
                for k, (cl, g, t, e) in enumerate(checks))
    return (f'<div class="pr" id="{pid}" style="top:{top}px"><div class="h"><span class="n">#482</span>{title}'
            f'<span style="flex:1"></span><span class="st{" mg" if mg else ""}" id="{pid}s">{status}</span></div>{c}</div>')

# S0 hook: an open PR with pending checks and bot comments, on screen at t=0
F.clip(0, pr("p0", 400, "fix auth refresh", "Open", [("pend", "", "ci / test", "running…"), ("bad", "✕", "ci / lint", "failed"),
                                                      ("pend", "", "review-bot", "3 comments")])
       + F.block([[(0, 1, "b")], [(2, 5, "hl")]], top=990, size=92))
# S1 tstack: 9 skills + harness chips
SK = ["full-send", "full-stop", "council", "sol-loop", "file-pr", "takeover", "babysit-pr", "modernize", "leaving-pr-comments"]
POS = [(80, 520), (370, 520), (660, 520), (80, 610), (330, 610), (560, 610), (80, 700), (390, 700), (80, 790)]
F.clip(1, '<div id="t1t" class="term tm" style="top:290px"><div class="bar"><i></i><i></i><i></i></div><div class="body">'
          '<span class="p">$</span> <span id="t1c"></span></div></div>'
          + "".join(f'<div class="sk" id="k{k}" style="left:{x}px;top:{y}px">{n}</div>' for k, (n, (x, y)) in enumerate(zip(SK, POS)))
          + chip("c1a", "Claude Code", 560, 790, "✳", "#d97757") + chip("c1b", "Codex", 640, 890, "◎", "#111")
       + F.block([[(6, 7, "hl"), (8, 9, "")], [(10, 14, "")], [(15, 16, "b")]], top=1010, size=80))
# S2 here are four: the four picks light up
F.clip(2, '<div id="four">4<span>of 9</span></div>'
          + "".join(f'<div class="sk big" id="f{k}" style="left:{x}px;top:{y}px">{n}</div>' for k, (n, x, y) in
                    enumerate([("council", 110, 640), ("babysit-pr", 560, 640), ("takeover", 110, 780), ("full-send", 560, 780)]))
       + F.block([[(17, 19, "hl")]], top=1060, size=110))
# S2b council: three models around a diff, they agree
F.clip(3, '<div class="num" id="n2">01 · council</div>'
          '<div id="diff"><div class="r">- if (token) refresh()</div><div class="a">+ if (token?.expired)</div><div class="a">+   await refresh()</div></div>'
          + "".join(f'<div class="md" id="m{k}" style="left:{x}px;top:{y}px"><b style="background:{c}">{g}</b>model {l}<div class="ag" id="a{k}">✓</div></div>'
                    for k, (x, y, c, g, l) in enumerate([(70, 620, "#111", "A", "A"), (415, 680, "#ff4b1f", "B", "B"), (760, 620, "#6f6f6f", "C", "C")]))
       + F.block([[(20, 20, "hl"), (21, 22, "")], [(23, 25, ""), (26, 28, "")], [(29, 31, "b")]], top=1030, size=80))
# S3 babysit: CI goes green, findings fixed
F.clip(4, '<div class="num" id="n3">02 · babysit</div>'
          + pr("p3", 340, "fix auth refresh", "Open", [("bad", "✕", "ci / lint", "failed"), ("bad", "✕", "ci / test", "failed"),
                                                        ("pend", "", "review-bot", "real finding")])
       + F.block([[(32, 32, "hl"), (33, 36, "")], [(37, 40, "")], [(41, 43, "b")]], top=1040, size=84))
# S4 takeover: someone else's PR, credit kept
F.clip(5, '<div class="num" id="n4">03 · take over</div>'
          + pr("p4", 340, "someone else's PR", "Stale", [("pend", "", "last commit", "3 weeks ago"), ("pend", "", "agent thread", "abandoned")])
          + '<div class="cred" id="cr"><div class="av" style="background:#ff4b1f"></div>credit kept<span>Co-authored-by: original author</span></div>'
       + F.block([[(44, 45, "hl"), (46, 50, "")], [(51, 53, ""), (54, 54, "it")]], top=1005, size=84))
# S5 full send pipeline
STEPS = [("prove it", "✓"), ("review it", "✓"), ("file it", "✓"), ("babysit it", "✓"), ("merge it", "✓")]
F.clip(6, '<div class="num" id="n5">04 · full send</div><div id="pipe">'
          + "".join(f'<div id="q{k}">{t}<i>{g}</i></div>' for k, (t, g) in enumerate(STEPS)) + '</div>'
          '<div id="merged">Merged</div><div id="nobody">nobody watching</div>'
       + F.block([[(55, 56, "hl"), (57, 61, "")], [(62, 64, "it")]], top=1005, size=84))
# S6 CTA
F.clip(7, '<div id="field">Add a comment…<span id="typed"></span><span id="caret"></span><div id="send"></div></div>'
       + F.block([[(65, 65, ""), (66, 66, "hl")], [(67, 72, "")]], top=1020, size=84))
F.body.append('<div class="layer"><div id="credit">skills: tstack by Theo (t3dotgg) · MIT</div></div>')

S = F.S
for i in (1, 7, 9, 13, 16, 20, 31, 32, 38, 43, 44, 54, 55, 61, 66):
    F.pop(S[i] - 0.05)

JS = r"""
function typeIn(id,txt,t,sp){ const el=document.getElementById(id), O={n:0}; sp=sp||.05;
  ft(O,{n:0},{n:txt.length,duration:sp*txt.length,ease:`steps(${txt.length})`,onUpdate:()=>{el.textContent=txt.slice(0,Math.round(O.n))}},t); }
function spin(sel,t0,t1){ ft(sel,{rotation:0},{rotation:360*Math.max(1,Math.round((t1-t0)/0.8)),duration:t1-t0,ease:'none'},t0); }
function okIt(id,t){ const x=id.replace('i','x'), v=id.replace('i','v');
  tl.to(id,{backgroundColor:'#1f883d',borderColor:'#1f883d',rotation:0,duration:.15},t);
  tl.to(x,{opacity:0,duration:.1},t); ft(v,{opacity:0,scale:.3},{opacity:1,scale:1,duration:.35,ease:'back.out(3)'},t); }
function ckIn(pid,n,t){ for(let k=0;k<n;k++) ft('#'+pid+'k'+k,{opacity:0,x:120,filter:'blur(8px)'},{opacity:1,x:0,filter:'blur(0px)',duration:.4,ease:A},t+k*0.15); }
// S0: PR present at t=0
ft('#p0',{opacity:1,scale:1},{opacity:1,scale:1.05,duration:ST[1],ease:'none'},0);
spin('#p0i0',0,ST[1]); spin('#p0i2',0,ST[1]);
ft('#p0i1',{scale:1},{scale:1.3,duration:.2,yoyo:true,repeat:3},S[1]);
outUp('#p0',ST[1]);
starPass('#st1',ST[1]-0.3,[900,1500,0],[760,1460,50],10,1.2);
// S1 install + skills
popIn('#t1t',ST[1]+0.02,{y:60,s:.94,r:0}); typeIn('t1c','cp -R tstack/skills/* ~/.claude/skills/',ST[1]+0.1,.025);
for(let k=0;k<9;k++) popIn('#k'+k,S[9]-0.2+k*0.07,{y:50,s:.5,r:(k%2?6:-6)});
popIn('#c1a',S[13]-0.15,{y:60,s:.6,r:-6}); popIn('#c1b',S[16]-0.15,{y:60,s:.6,r:6});
outUp(['#t1t','#k0','#k1','#k2','#k3','#k4','#k5','#k6','#k7','#k8','#c1a','#c1b'],ST[2]);
// S2 four
ft('#four',{opacity:0,scale:.5,filter:'blur(20px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.45,ease:'back.out(1.8)'},ST[2]+0.02);
[0,1,2,3].forEach(k=>popIn('#f'+k,ST[2]+0.12+k*0.08,{y:60,s:.5,r:(k%2?6:-6)}));
outUp(['#four','#f0','#f1','#f2','#f3'],ST[3]);
// S2 council
popIn('#n2',S[20]-0.1,{y:20,s:.6,r:-4});
ft('#diff',{opacity:0,y:120,rotationX:25,transformPerspective:1400,filter:'blur(10px)'},{opacity:1,y:0,rotationX:0,filter:'blur(0px)',duration:.6,ease:A},ST[3]+0.02);
[0,1,2].forEach(k=>popIn('#m'+k,S[21]-0.1+k*0.16,{y:120,s:.6,r:(k-1)*8}));
[0,1,2].forEach(k=>ft('#a'+k,{opacity:0,scale:0},{opacity:1,scale:1,duration:.35,ease:'back.out(3)'},S[31]-0.15+k*0.1));
tl.to(['#m0','#m1','#m2'],{y:-14,duration:.4,ease:'sine.inOut',yoyo:true,repeat:3,stagger:.15},S[26]);
outUp(['#n2','#diff','#m0','#m1','#m2'],ST[4]);
starPass('#st2',ST[4]-0.3,[-700,1750,0],[-440,1450,-35],5,1.2);
// S3 babysit: checks go green on "fixes"
popIn('#n3',ST[4]+0.02,{y:20,s:.6,r:-4});
ft('#p3',{opacity:0,y:160,rotationX:25,transformPerspective:1400,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.7,ease:A},ST[4]+0.02);
ckIn('p3',3,ST[4]+0.25); spin('#p3i2',ST[4],S[40]);
okIt('#p3i0',S[40]); okIt('#p3i1',S[40]+0.2); okIt('#p3i2',S[42]);
ft('#p3s',{backgroundColor:'#1f883d'},{backgroundColor:'#1f883d',duration:.01},ST[4]);
outUp(['#n3','#p3'],ST[5]);
// S4 takeover
popIn('#n4',ST[5]+0.02,{y:20,s:.6,r:-4});
ft('#p4',{opacity:0,y:160,rotationX:25,transformPerspective:1400,scale:.9},{opacity:1,y:0,rotationX:0,scale:1,duration:.7,ease:A},ST[5]+0.02);
ckIn('p4',2,ST[5]+0.25);
ft('#p4s',{backgroundColor:'#9a9a9a'},{backgroundColor:'#9a9a9a',duration:.01},ST[5]);
ft('#cr',{opacity:0,y:80,scale:.8,filter:'blur(10px)'},{opacity:1,y:0,scale:1,filter:'blur(0px)',duration:.5,ease:'back.out(1.6)'},S[52]-0.15);
outUp(['#n4','#p4','#cr'],ST[6]);
starPass('#st3',ST[6]-0.3,[900,1500,0],[760,1460,50],8,1.2);
// S5 pipeline lights up, merged stamp
popIn('#n5',ST[6]+0.02,{y:20,s:.6,r:-4});
[0,1,2,3,4].forEach(k=>{ ft('#q'+k,{opacity:0,x:-120},{opacity:1,x:0,duration:.35,ease:A},ST[6]+0.05+k*0.08);
  ft('#q'+k,{backgroundColor:'#ffffff',color:'#b3b3b3'},{backgroundColor:'#111111',color:'#ffffff',duration:.12},S[57]+k*0.3); });
ft('#merged',{opacity:0,scale:2.6,rotation:-20,filter:'blur(10px)'},{opacity:1,scale:1,rotation:-6,filter:'blur(0px)',duration:.4,ease:'back.out(2)'},S[60]-0.08);
ft('#nobody',{opacity:0,y:20},{opacity:1,y:0,duration:.4,ease:A},S[63]-0.1);
outUp(['#n5','#pipe','#merged','#nobody'],ST[7]);
cta('TSTACK',S[66]);
tl.to('#send',{scale:.85,duration:.1,ease:'power2.in',yoyo:true,repeat:1},S[72]+0.15);
ft('#credit',{opacity:0},{opacity:1,duration:.3},0.3);
ft('#w0',{opacity:1,y:0,filter:'blur(0px)',color:'#b9b9b9'},{opacity:1,y:0,filter:'blur(0px)',color:'#111',duration:.35,ease:A},0);
"""
F.write(CSS, JS, music_vol=0.09)
