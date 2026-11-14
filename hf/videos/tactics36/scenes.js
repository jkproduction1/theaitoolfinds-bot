// tactics36 result: an animated football tactics board, drawn in code (canvas 2D + own perspective projection) by Claude Opus 5.5.
// Generic 4-3-3 counter-attack of our own design: no club, league, national team, kit, logo or real player.
(function(){
const cv=document.getElementById('cv0'), g=cv.getContext('2d');
const W=1080,H=1920;
const C=(x)=>x<0?0:x>1?1:x;
const eio=(x)=>{x=C(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};
const eo=(x)=>{x=C(x);return 1-Math.pow(1-x,4);};
const sio=(x)=>{x=C(x);return x*x*(3-2*x);};
const bo=(x)=>{x=C(x);const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
function rnd(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646;};}
const lerp=(a,b,t)=>a+(b-a)*t;
// ---------- background (pre-rendered once): deep night-blue stadium gradient + grain
const bgc=document.createElement('canvas'); bgc.width=W; bgc.height=H; (function(){ const p=bgc.getContext('2d');
  const gr=p.createRadialGradient(W*.5,H*.42,60,W*.5,H*.5,H*.8); gr.addColorStop(0,'#123629'); gr.addColorStop(.5,'#0a2219'); gr.addColorStop(1,'#03100b');
  p.fillStyle=gr; p.fillRect(0,0,W,H); const r=rnd(9); const id=p.getImageData(0,0,W,H), d=id.data;
  for(let i=0;i<d.length;i+=4){ const n=(r()-.5)*14; d[i]+=n; d[i+1]+=n; d[i+2]+=n; } p.putImageData(id,0,0); })();
// ---------- camera (units: metres; pitch 68 x 105, we attack toward y=0)
let cam={yaw:0,tilt:0,D:96,f:1400,cx:34,cy:34,ox:0,oy:0};
function P(x,y,z){ z=z||0; let px=x-cam.cx, py=y-cam.cy; const cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw); const rx=px*cy-py*sy, ry=px*sy+py*cy;
  const ct=Math.cos(cam.tilt), st=Math.sin(cam.tilt); const yy=ry*ct - z*st, dz=cam.D - ry*st - z*ct; const k=cam.f/dz; return [W/2+cam.ox+rx*k, H*0.52+cam.oy+yy*k, k]; }
function poly(pts,close){ pts.forEach((p,i)=>{ const q=P(p[0],p[1],p[2]); i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]); }); if(close) g.closePath(); }
function circ(x,y,r,a0,a1,n){ n=n||48; const pts=[]; for(let i=0;i<=n;i++){ const a=a0+(a1-a0)*i/n; pts.push([x+Math.cos(a)*r,y+Math.sin(a)*r]); } return pts; }
function line(a,b,c,d){ g.beginPath(); poly([[a,b],[c,d]]); g.stroke(); }
// ---------- players (attack = coral, defence = white)
const ATT=[ // n, start, end
 [1,[34,84],[34,80]], [2,[52,53],[52,43]], [4,[25,58],[26,50]], [5,[43,58],[42,50]], [3,[16,52.5],[16.5,44]],
 [6,[30,47],[30,40]], [8,[21,43],[19,37.5]], [10,[47,42],[47,34]], [11,[10,33],[12,24]], [9,[31,23],null], [7,[55,36],[56,24]]];
const DEF=[[1,[34,3],[35,3]], [2,[13,20],[15,16.5]], [5,[23,20],[22,16]], [4,[41,20],[42,16]], [3,[53,20],[53,16.5]],
 [6,[19,30],[20,27]], [8,[27,31],[27,28]], [10,[37,31],[38,28]], [11,[47,29],[48,26]], [7,[34,54],[34,53]], [9,[39,40.5],[39,40]]];
// striker's curved run behind the back line
const RUN=[[31,23],[26,19],[30,13.5],[36,11]];
function bez(p,t){ const a=1-t; return [a*a*a*p[0][0]+3*a*a*t*p[1][0]+3*a*t*t*p[2][0]+t*t*t*p[3][0], a*a*a*p[0][1]+3*a*a*t*p[1][1]+3*a*t*t*p[2][1]+t*t*t*p[3][1]]; }
const RUNT=[1.15,2.25];
function posAtt(i,u){ const [n,s,e]=ATT[i]; if(n===9){ const k=sio((u-RUNT[0])/(RUNT[1]-RUNT[0])); /*run*/; return bez(RUN,k); }
  const k=sio(u/2.4); return [lerp(s[0],e[0],k)+0.4*Math.sin(u*2.2+i), lerp(s[1],e[1],k)+0.3*Math.cos(u*1.9+i)]; }
function posDef(i,u){ const [n,s,e]=DEF[i]; const k=sio((u-0.5)/2.0); return [lerp(s[0],e[0],k)+0.35*Math.sin(u*2.0+i*1.7), lerp(s[1],e[1],k)+0.3*Math.cos(u*2.3+i)]; }
const AI=(n)=>ATT.findIndex(a=>a[0]===n);
// passes: from player, to player (or point), t0, t1, loft height
const PASS=[[4,8,0.02,0.5,0],[8,7,0.62,1.38,9],[7,'run',1.55,2.25,0],['run','goal',2.35,2.68,1.6]];
function ballAt(u){
  for(let i=0;i<PASS.length;i++){ const [a,b,t0,t1,h]=PASS[i]; const nx=PASS[i+1];
    const pa=a==='run'?bez(RUN,1):posAtt(AI(a),t0), pb=b==='goal'?[35.5,-0.6]:(b==='run'?bez(RUN,1):posAtt(AI(b),t1));
    if(u<t0){ if(i===0) return [pa[0],pa[1]-1.2,0]; }
    if(u<=t1){ const k=a==='run'?eo((u-t0)/(t1-t0)):sio((u-t0)/(t1-t0)); return [lerp(pa[0],pb[0],k),lerp(pa[1],pb[1],k)-1.2*(1-k),h*4*k*(1-k)+(b==='goal'?1.1*k:0)]; }
    if(!nx || u<nx[2]){ if(!nx) return [35.5,-0.6+0.2*Math.sin(u*3),1.1]; return [pb[0],pb[1]-1.2,0]; } }
  return [35.5,-0.6,1.1]; }
// ---------- labels (screen space chips)
function chip(x,y,n,label,a,acc,z){ if(a<=0) return; const q=P(x,y,z||0), s=bo(a); g.font='700 34px "JetBrains Mono", monospace'; const tw=g.measureText(label).width; const bw=tw+(n?96:44), bh=62;
  const qx=Math.max(80+bw/2,Math.min(1000-bw/2,q[0])); if(window._LAB) window._LAB.push([qx-bw/2,q[1]-bh/2,qx+bw/2,q[1]+bh/2,label]); g.save(); g.translate(qx,q[1]); g.scale(s,s); g.globalAlpha=C(a*3);
  g.fillStyle='rgba(4,18,13,.82)'; g.strokeStyle=acc?'rgba(255,120,80,.9)':'rgba(255,255,255,.45)'; g.lineWidth=2; g.beginPath(); g.roundRect(-bw/2,-bh/2,bw,bh,31); g.fill(); g.stroke();
  let x0=-bw/2+22; if(n){ g.fillStyle='#ff5a2b'; g.beginPath(); g.arc(x0+19,0,21,0,6.28); g.fill(); g.fillStyle='#fff'; g.font='800 28px Inter, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(n,x0+19,1); x0+=52; }
  g.fillStyle='#fff'; g.font='700 34px "JetBrains Mono", monospace'; g.textAlign='left'; g.textBaseline='middle'; g.fillText(label,x0,2); g.restore(); }
// dashed curve that draws itself
function drawPath(pts,prog,col,w,glow,dash,arrow){ if(prog<=0) return; const n=Math.max(2,Math.round(pts.length*prog)); const sp=pts.slice(0,n);
  g.save(); g.lineCap='round'; g.lineJoin='round'; g.strokeStyle=col; g.lineWidth=w; g.shadowColor=col; g.shadowBlur=glow; if(dash){ g.setLineDash(dash); }
  g.beginPath(); sp.forEach((p,i)=>{ const q=P(p[0],p[1],p[2]||0); i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]); }); g.stroke(); g.setLineDash([]);
  if(arrow && n>=3){ const a=P(...sp[n-3]), b=P(...sp[n-1]); const an=Math.atan2(b[1]-a[1],b[0]-a[0]); g.fillStyle=col; g.translate(b[0],b[1]); g.rotate(an); g.beginPath(); g.moveTo(14,0); g.lineTo(-14,-13); g.lineTo(-8,0); g.lineTo(-14,13); g.closePath(); g.fill(); }
  g.restore(); }
function samplePass(i,N){ const [a,b,t0,t1,h]=PASS[i]; const pts=[]; for(let j=0;j<=N;j++){ const u=t0+(t1-t0)*j/N; const bp=ballAt(u); pts.push([bp[0],bp[1],bp[2]]); } return pts; }
const RUNPTS=[]; for(let j=0;j<=40;j++){ const p=bez(RUN,j/40); RUNPTS.push([p[0],p[1],0]); }
function token(x,y,n,att,a,hl){ if(a<=0) return; const q=P(x,y), r=1.55*q[2]; if(window._TOK) window._TOK.push([q[0],q[1]-r*.35,r,n,att]); if(att) SCN._AT.push([q[0],q[1]-r*.35,r*bo(a)]); const s=bo(a);
  g.save(); g.globalAlpha=C(a*2.5);
  g.fillStyle='rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(q[0]+r*.12,q[1]+r*.35,r*1.05*s,r*.55*s,0,0,6.28); g.fill();
  if(hl>0){ g.fillStyle='rgba(255,90,43,'+(0.28*hl)+')'; g.beginPath(); g.arc(q[0],q[1]-r*.35,r*(1.5+0.25*Math.sin(SCN.tc*7||0))*s,0,6.28); g.fill(); }
  g.translate(q[0],q[1]-r*.35); g.scale(s,s);
  const gr=g.createLinearGradient(0,-r,0,r); if(att){ gr.addColorStop(0,'#ff7a4d'); gr.addColorStop(1,'#e2400f'); } else { gr.addColorStop(0,'#ffffff'); gr.addColorStop(1,'#cfd8e2'); }
  g.fillStyle=gr; g.beginPath(); g.arc(0,0,r,0,6.28); g.fill(); g.lineWidth=Math.max(2,r*.1); g.strokeStyle=att?'rgba(255,220,200,.9)':'rgba(255,255,255,1)'; g.stroke();
  g.fillStyle=att?'#fff':'#0c2a1f'; g.font='800 '+Math.round(r*1.05)+'px Inter, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(n,0,r*.06); g.restore(); }
const CONF=[]; (function(){ const r=rnd(4); for(let i=0;i<40;i++) CONF.push([r()*6.28,0.5+r()*1.4,r(),r()]); })();
SCN[0]=function(u){
  const T=(SCN.tc!==undefined?SCN.tc:u);
  // camera: calm push-in toward the goal + slow orbit; never static
  const e=eio(u/3.0);
  cam.yaw=(-4+6*e)*Math.PI/180+0.012*Math.sin(T*0.5); cam.tilt=(50-5*e)*Math.PI/180+0.01*Math.sin(T*0.6);
  cam.D=86-10*e+1.0*Math.sin(T*0.45); cam.cy=31-8*e; cam.ox=6*Math.sin(T*0.55); cam.oy=30+10*Math.sin(T*0.4);
  g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.drawImage(bgc,0,0);
  // pitch with mowing stripes
  for(let i=0;i<15;i++){ const y0=-3+i*7.2; g.fillStyle=i%2?'#1f6a45':'#23774d'; g.beginPath(); poly([[-4,Math.max(-4,y0)],[72,Math.max(-4,y0)],[72,y0+7.2],[-4,y0+7.2]],true); g.fill(); }
  // light pool on the attacking end
  { const q=P(34,14); const gr=g.createRadialGradient(q[0],q[1],20,q[0],q[1],700); gr.addColorStop(0,'rgba(220,255,230,.16)'); gr.addColorStop(1,'rgba(220,255,230,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H); }
  // pitch lines
  g.strokeStyle='rgba(255,255,255,.82)'; g.lineWidth=3; g.shadowColor='rgba(255,255,255,.5)'; g.shadowBlur=6;
  g.beginPath(); poly([[0,0],[68,0],[68,105],[0,105]],true); g.stroke();
  line(0,52.5,68,52.5); g.beginPath(); poly(circ(34,52.5,9.15,0,6.29,64)); g.stroke();
  g.beginPath(); poly([[13.84,0],[13.84,16.5],[54.16,16.5],[54.16,0]]); g.stroke(); g.beginPath(); poly([[24.84,0],[24.84,5.5],[43.16,5.5],[43.16,0]]); g.stroke();
  g.beginPath(); poly(circ(34,11,9.15,0.93*Math.PI/3.0,Math.PI-0.93*Math.PI/3.0,24)); g.stroke();
  g.beginPath(); poly([[13.84,105],[13.84,88.5],[54.16,88.5],[54.16,105]]); g.stroke();
  g.shadowBlur=0; g.fillStyle='#fff'; [[34,11],[34,52.5]].forEach(([x,y])=>{ const q=P(x,y); g.beginPath(); g.arc(q[0],q[1],4,0,6.28); g.fill(); });
  // goal net (3D) + glow after the goal
  const gl=sio((u-2.62)/0.35);
  { const x0=30.34,x1=37.66,hh=2.44,dp=2.2;
    if(gl>0){ const q=P(34,-0.5,1.2); const pul=1+0.12*Math.sin(T*6); const gr=g.createRadialGradient(q[0],q[1],8,q[0],q[1],320*pul); gr.addColorStop(0,'rgba(255,190,120,'+(0.75*gl)+')'); gr.addColorStop(.4,'rgba(255,110,60,'+(0.3*gl)+')'); gr.addColorStop(1,'rgba(255,90,43,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H); }
    g.strokeStyle='rgba(255,255,255,'+(0.35+0.4*gl)+')'; g.lineWidth=1.2; const sh=gl*0.5*Math.sin(T*9)*Math.exp(-Math.max(0,u-2.7)*1.5);
    for(let i=0;i<=12;i++){ const x=lerp(x0,x1,i/12); g.beginPath(); poly([[x,0,hh],[x,-dp+sh*0.3,hh*0.7],[x,-dp,0]]); g.stroke(); }
    for(let j=0;j<=5;j++){ const f=j/5; g.beginPath(); poly([[x0,-dp*Math.min(1,f*1.4)+sh*0.2,hh*(1-f*0.3)],[x1,-dp*Math.min(1,f*1.4)+sh*0.2,hh*(1-f*0.3)]]); g.stroke(); }
    g.strokeStyle='#fff'; g.lineWidth=6; g.beginPath(); poly([[x0,0,0],[x0,0,hh],[x1,0,hh],[x1,0,0]]); g.stroke(); }
  // pressing cone / zone highlight under the switch receiver
  // pass lines (draw themselves, then stay as a faint trail)
  [0,1,2].forEach(i=>{ const [a,b,t0,t1]=PASS[i]; const pr=C((u-t0)/(t1-t0)); if(pr<=0) return; const pts=samplePass(i,30).map(p=>[p[0],p[1],0]);
    const fade=1-0.55*C((u-t1-0.6)/0.6); g.globalAlpha=fade; drawPath(pts,pr,i===1?'#ffe08a':'#ffffff',6,12,[16,12],true); g.globalAlpha=1; });
  // ball flight arc (switch) as a thin line in the air
  { const pr=C((u-PASS[1][2])/(PASS[1][3]-PASS[1][2])); if(pr>0){ g.globalAlpha=0.5*(1-C((u-1.6)/0.6)); drawPath(samplePass(1,30),pr,'#ffe08a',2.5,0,null,false); g.globalAlpha=1; } }
  // striker's run arrow (curves in behind the back line)
  { const pr=eio((u-0.95)/0.7); g.globalAlpha=1-0.4*C((u-2.6)/0.5); drawPath(RUNPTS,pr,'#ff5a2b',8,20,[22,12],true); g.globalAlpha=1; }
  // offside line (defenders' back line), dotted
  { const a=C((u-0.9)/0.4)*(1-C((u-2.3)/0.3)); if(a>0){ const y=lerp(19,15.5,sio((u-0.5)/2.0)); g.globalAlpha=a*0.8; g.strokeStyle='#9fe8ff'; g.lineWidth=3; g.setLineDash([6,10]); line(2,y,66,y); g.setLineDash([]); g.globalAlpha=1; } }
  // tokens, back to front
  SCN._AT=[]; const items=[]; const ia=(i)=>C((u+0.9-i*0.03)/0.35);
  DEF.forEach((d,i)=>{ const p=posDef(i,u); items.push([p[1],()=>token(p[0],p[1],d[0],false,ia(i),0)]); });
  ATT.forEach((d,i)=>{ const p=posAtt(i,u); const hl=(d[0]===9)?C((u-1.0)/0.3):0; items.push([p[1],()=>token(p[0],p[1],d[0],true,ia(i),hl)]); });
  items.sort((a,b)=>a[0]-b[0]).forEach(x=>x[1]());
  // ball + shadow
  { const b=ballAt(u); const s=P(b[0],b[1],0), q=P(b[0],b[1],b[2]); const r=0.75*q[2];
    { let bx=q[0], by=q[1]-r; SCN._AT.forEach(([tx,ty,tr])=>{ const d=Math.hypot(bx-tx,by-ty), need=tr+6+r; if(d<need){ const w=1-C((d-tr)/(need-tr+1e-6))*0; const ax=bx+(tx+need*0.7071-bx)*1, ay=by+(ty+need*0.7071-by)*1; const k=C(1-(d-need*0.6)/(need*0.4)); bx=bx+(tx+need*0.7071-bx)*k; by=by+(ty+need*0.7071-by)*k; } });
      const dx=bx-q[0], dy=by-(q[1]-r); q[0]+=dx; q[1]+=dy; s[0]+=dx; s[1]+=dy; }
    g.fillStyle='rgba(0,0,0,'+(0.4/(1+b[2]*0.4))+')'; g.beginPath(); g.ellipse(s[0],s[1],r*1.1,r*.5,0,0,6.28); g.fill();
    g.save(); g.shadowColor='rgba(255,255,255,.9)'; g.shadowBlur=18; g.fillStyle='#fff'; g.beginPath(); g.arc(q[0],q[1]-r,r,0,6.28); g.fill(); g.restore();
    g.fillStyle='#16181c'; g.beginPath(); g.arc(q[0]-r*.2,q[1]-r*1.1,r*.32,0,6.28); g.fill(); }
  // labels
  const fd=(t0,t1,k)=>C((u-t0)/0.45)*(1-(k||0.55)*C((u-t1)/0.4));
  chip(15,64,'1','BUILD-UP',fd(0.05,0.9,1),false);
  chip(40,47.5,'2','SWITCH',fd(0.7,1.45,1),false);
  chip(50,7,'3','THROUGH BALL',fd(1.6,2.6),false);
  // GOAL chip + confetti sparks
  if(gl>0){ const q=P(34,-1.5,4.2); const s=bo((u-2.65)/0.45); g.save(); g.translate(q[0],q[1]-30); g.scale(s,s); g.globalAlpha=C((u-2.65)/0.2);
    g.font='900 76px Inter, sans-serif'; const tw=g.measureText('GOAL').width; g.fillStyle='#ff5a2b'; g.shadowColor='rgba(255,90,43,.8)'; g.shadowBlur=40;
    g.beginPath(); g.roundRect(-tw/2-38,-54,tw+76,108,54); g.fill(); g.shadowBlur=0; g.fillStyle='#fff'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('GOAL',0,6); g.restore();
    const q2=P(34,-0.5,1.4); CONF.forEach(([an,sp,c,d])=>{ const tt=(u-2.68)*sp; if(tt<0) return; const rr=60+tt*420, al=gl*Math.max(0,1-tt*0.55); if(al<=0) return;
      g.globalAlpha=al; g.fillStyle=c<.5?'#ffd08a':'#ffffff'; g.beginPath(); g.arc(q2[0]+Math.cos(an)*rr,q2[1]+Math.sin(an)*rr*0.6-tt*60,3+d*4,0,6.28); g.fill(); }); g.globalAlpha=1; }
  // vignette
  g.globalAlpha=1; const vg=g.createRadialGradient(W/2,H*.5,H*.3,W/2,H*.5,H*.78); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,8,4,.6)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
};
})();
