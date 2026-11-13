// heist32 result: a heist blueprint that draws itself, drawn in code (canvas 2D + own perspective projection) by Claude Opus 5.5.
// Generic bank floor plan of our own design; no film, brand or real-building artwork.
(function(){
const cv=document.getElementById('cv0'), g=cv.getContext('2d');
const W=1080,H=1920;
const C=(x)=>x<0?0:x>1?1:x;
const eio=(x)=>{x=C(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};
const eo=(x)=>{x=C(x);return 1-Math.pow(1-x,4);};
const bo=(x)=>{x=C(x);const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
function rnd(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646;};}
// ---------- paper texture (pre-rendered once)
const pap=document.createElement('canvas'); pap.width=W; pap.height=H; (function(){ const p=pap.getContext('2d');
  const gr=p.createRadialGradient(W*.5,H*.45,80,W*.5,H*.5,H*.75); gr.addColorStop(0,'#1a5aa6'); gr.addColorStop(.55,'#0f427f'); gr.addColorStop(1,'#071d3d');
  p.fillStyle=gr; p.fillRect(0,0,W,H); const r=rnd(11); const id=p.getImageData(0,0,W,H), d=id.data;
  for(let i=0;i<d.length;i+=4){ const n=(r()-.5)*18; d[i]+=n; d[i+1]+=n; d[i+2]+=n*1.2; } p.putImageData(id,0,0);
  p.globalAlpha=.06; p.strokeStyle='#cfe4ff'; for(let i=0;i<260;i++){ p.lineWidth=.6+r(); p.beginPath(); const x=r()*W,y=r()*H,a=r()*6.28,l=20+r()*90; p.moveTo(x,y); p.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); }
  p.globalAlpha=1; })();
// ---------- the plan (units; building 40 x 56)
const WALLS=[ // outer
 [0,4,40,4],[40,4,40,60],[40,60,23,60],[17,60,0,60],[0,60,0,4],
 // lobby top wall with passage 4..12
 [0,46,4,46],[12,46,40,46],
 // corridor wall (lasers hall on the right)
 [12,46,12,30],
 // wall under the hall with passage 4..12
 [0,26,4,26],[12,26,40,26],
 // vault room
 [10,18,17.4,18],[22.6,18,30,18],[10,18,10,6],[30,18,30,6],[10,6,30,6],
 // security room + teller counters
 [30,26,30,20],[30,20,40,20],[24,54,36,54],[24,54,24,56],[36,54,36,56],
 // offices left bottom
 [0,18,6,18],[6,18,6,10],[0,10,3,10]];
const DESKS=[[3,50,5,2.2],[26,49,8,1.6],[33,30,4,6],[2,30,3,8],[2,12,3,4],[33,8,5,3]];
const COLS=[[16,50],[34,50],[16,40],[16,32]];
const ROUTE=[[20,63],[20,52],[8,52],[8,22],[20,22],[20,18.6]];
const LAS=[[13,31],[13,34.5],[13,38],[13,41.5]];
const ROOMS=[[31,56.4,'LOBBY'],[26,36,'MAIN HALL'],[35,23,'SECURITY'],[20,12,'VAULT'],[3,22,'OFFICE']];
// route lengths
const RL=[0]; for(let i=1;i<ROUTE.length;i++) RL.push(RL[i-1]+Math.hypot(ROUTE[i][0]-ROUTE[i-1][0],ROUTE[i][1]-ROUTE[i-1][1])); const RT=RL[RL.length-1];
function routeAt(s){ s=C(s)*RT; for(let i=1;i<ROUTE.length;i++){ if(s<=RL[i]){ const f=(s-RL[i-1])/(RL[i]-RL[i-1]); return [ROUTE[i-1][0]+(ROUTE[i][0]-ROUTE[i-1][0])*f, ROUTE[i-1][1]+(ROUTE[i][1]-ROUTE[i-1][1])*f, i]; } } return [...ROUTE[ROUTE.length-1],ROUTE.length-1]; }
// ---------- camera
let cam={yaw:0,tilt:0,D:60,f:1350,cx:20,cy:32,ox:0,oy:0};
function P(x,y,z){ z=z||0; let px=x-cam.cx, py=y-cam.cy; const cy=Math.cos(cam.yaw), sy=Math.sin(cam.yaw); const rx=px*cy-py*sy, ry=px*sy+py*cy;
  const ct=Math.cos(cam.tilt), st=Math.sin(cam.tilt); const yy=ry*ct - z*st, dz=cam.D - ry*st - z*ct; const k=cam.f/dz; return [W/2+cam.ox+rx*k, H*0.52+cam.oy+yy*k, k]; }
function seg(a,b,c,d,fr){ const A=P(a,b), B=P(a+(c-a)*fr,b+(d-b)*fr); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); }
function poly(pts,close){ pts.forEach((p,i)=>{ const q=P(p[0],p[1],p[2]); i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]); }); if(close) g.closePath(); }
function circ(x,y,r,a0,a1,n){ n=n||48; const pts=[]; for(let i=0;i<=n;i++){ const a=a0+(a1-a0)*i/n; pts.push([x+Math.cos(a)*r,y+Math.sin(a)*r]); } return pts; }
function onPlane(x,y,fn){ const o=P(x,y), ax=P(x+1,y), ay=P(x,y+1); g.save(); g.setTransform(ax[0]-o[0],ax[1]-o[1],ay[0]-o[0],ay[1]-o[1],o[0],o[1]); fn(); g.restore(); }
function planText(x,y,txt,size,col,al,align){ onPlane(x,y,()=>{ g.globalAlpha=al; g.fillStyle=col; g.font='600 '+size+'px "JetBrains Mono", monospace'; g.textAlign=align||'center'; g.textBaseline='middle'; g.scale(1/40,1/40); g.fillText(txt,0,0); }); }
// ---------- pins / labels (screen space)
function pin(x,y,n,label,a){ if(a<=0) return; const q=P(x,y), s=bo(a); g.save(); g.translate(q[0],q[1]-8);
  g.globalAlpha=C(a*3); g.fillStyle='rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(4,14,30*s,12*s,0,0,6.28); g.fill();
  g.scale(s,s); g.fillStyle='#ff3d3d'; g.shadowColor='rgba(255,60,60,.8)'; g.shadowBlur=24; g.beginPath(); g.arc(0,-46,34,0,6.28); g.fill(); g.beginPath(); g.moveTo(-18,-26); g.lineTo(0,0); g.lineTo(18,-26); g.fill(); g.shadowBlur=0;
  g.fillStyle='#fff'; g.font='800 40px Inter, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(n,0,-45);
  const la=C((a-.25)*2.5); if(la>0){ g.globalAlpha=la; g.font='700 36px "JetBrains Mono", monospace'; const tw=g.measureText(label).width; const x0=46+(1-eo(la))*-20;
    g.fillStyle='rgba(6,20,44,.86)'; g.strokeStyle='rgba(255,255,255,.55)'; g.lineWidth=2; const bx=x0, by=-74, bw=tw+40, bh=58; g.beginPath(); g.roundRect(bx,by,bw,bh,14); g.fill(); g.stroke();
    g.fillStyle='#fff'; g.textAlign='left'; g.fillText(label,bx+20,by+bh/2+2); }
  g.restore(); }
// ---------- frame
const SPK=[]; (function(){ const r=rnd(5); for(let i=0;i<26;i++) SPK.push([12+r()*16,8+r()*8,r()*6.28,.6+r()*1.2]); })();
SCN[0]=function(u){
  // camera: calm pull-back + slow orbit, never static
  const e=eio(u/4.2), d=u>4.2?(u-4.2):0;
  cam.yaw=(-16+22*e)*Math.PI/180+0.03*Math.sin(d*0.7); cam.tilt=(46-12*e)*Math.PI/180+0.02*Math.sin(d*0.55);
  cam.D=68+9*e+1.5*Math.sin(d*0.5); cam.cy=33-3*e; cam.ox=10*Math.sin(u*0.6); cam.oy=-60+12*Math.sin(u*0.45);
  g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.drawImage(pap,0,0);
  // grid
  g.lineWidth=1; for(let i=-24;i<=64;i+=2){ const maj=i%10===0; g.strokeStyle=maj?'rgba(190,220,255,.26)':'rgba(190,220,255,.10)'; g.beginPath(); seg(i,-14,i,78,1); g.stroke(); }
  for(let j=-14;j<=78;j+=2){ const maj=j%10===0; g.strokeStyle=maj?'rgba(190,220,255,.26)':'rgba(190,220,255,.10)'; g.beginPath(); seg(-24,j,64,j,1); g.stroke(); }
  // walls draw themselves (already half drawn on frame 0 so the hook frame is rich)
  const wp=0.6+0.4*eo(u/0.9);
  g.lineCap='round'; g.strokeStyle='#f4f8ff'; g.shadowColor='rgba(170,210,255,.7)'; g.shadowBlur=10;
  WALLS.forEach((w,i)=>{ const fr=C(wp*WALLS.length*1.15-i*1.0); if(fr<=0) return; const q=P(w[0],w[1]); g.lineWidth=Math.max(3,q[2]*0.42); g.beginPath(); seg(w[0],w[1],w[2],w[3],fr); g.stroke(); });
  g.shadowBlur=0;
  // furniture, columns, dimension lines, labels
  const fa=C((u+0.2)/0.7); g.globalAlpha=fa*0.75; g.lineWidth=2; g.strokeStyle='#cfe4ff';
  DESKS.forEach(([x,y,w,h])=>{ g.beginPath(); poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],true); g.stroke(); });
  COLS.forEach(([x,y])=>{ g.beginPath(); poly(circ(x,y,0.8,0,6.29,20),true); g.stroke(); });
  g.setLineDash([10,8]); g.beginPath(); poly(circ(17,60,6,-Math.PI/2,0,16)); g.stroke(); g.setLineDash([]);
  g.beginPath(); seg(0,64,40,64,1); seg(0,63,0,65,1); seg(40,63,40,65,1); seg(44,4,44,60,1); seg(43,4,45,4,1); seg(43,60,45,60,1); g.stroke();
  g.globalAlpha=1; planText(20,65.6,'40.00 m',46,'#cfe4ff',fa*.8); planText(46.5,32,'56.00 m',46,'#cfe4ff',fa*.8);
  const vo0=eio((u-1.95)/0.85); ROOMS.forEach(([x,y,t])=>planText(x,y,t,52,'#e6f0ff',fa*.85*(t==='VAULT'?1-C((u-1.4)/0.3):1)));
  // title block + north arrow (on the paper)
  if(false) onPlane(22,66.5,()=>{ g.globalAlpha=fa*.85; g.strokeStyle='#cfe4ff'; g.lineWidth=1/20; g.strokeRect(0,0,14,5); g.beginPath(); g.moveTo(0,2.2); g.lineTo(14,2.2); g.stroke();
    g.fillStyle='#e6f0ff'; g.font='700 1.3px "JetBrains Mono", monospace'; g.textBaseline='middle'; g.fillText('THE PLAN',0.6,1.15); g.font='500 0.9px "JetBrains Mono", monospace'; g.fillText('SHEET 01 - SCALE 1:200',0.6,3.0); g.fillText('DRAWN BY: YOU',0.6,4.2); });
  onPlane(-6,8,()=>{ g.globalAlpha=fa*.8; g.strokeStyle='#cfe4ff'; g.fillStyle='#cfe4ff'; g.lineWidth=.12; g.beginPath(); g.arc(0,0,2.2,0,6.28); g.stroke(); g.beginPath(); g.moveTo(0,-2.8); g.lineTo(.9,.6); g.lineTo(0,0); g.lineTo(-.9,.6); g.closePath(); g.fill(); g.font='700 1.3px Inter'; g.textAlign='center'; g.fillText('N',0,-3.8); });
  g.globalAlpha=1;
  // security camera cones (sweeping)
  [[39,45,2.6,0],[39,25.2,3.4,1.7]].forEach(([x,y,a0,ph])=>{ const ca=C((u-0.2)/0.5); if(ca<=0) return; const a=a0+0.45*Math.sin(u*1.3+ph), r=11;
    g.globalAlpha=ca; const pts=[[x,y],...circ(x,y,r,a-0.32,a+0.32,14)]; g.beginPath(); poly(pts,true); const q=P(x,y);
    const gr=g.createRadialGradient(q[0],q[1],4,q[0],q[1],q[2]*r); gr.addColorStop(0,'rgba(255,230,120,.45)'); gr.addColorStop(1,'rgba(255,230,120,0)'); g.fillStyle=gr; g.fill();
    g.fillStyle='#ffe27a'; g.beginPath(); g.arc(q[0],q[1],9,0,6.28); g.fill(); });
  // lasers across the main hall (flicker), the route goes around them
  const la=C((u-0.35)/0.45);
  LAS.forEach(([x,y],i)=>{ if(la<=0) return; const fl=0.75+0.25*Math.sin(u*23+i*2.1); const A=P(x,y), B=P(39.4,y);
    g.globalAlpha=la*fl; g.strokeStyle='#ff2a3a'; g.shadowColor='#ff2a3a'; g.shadowBlur=22; g.lineWidth=4; g.beginPath(); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); g.stroke();
    g.shadowBlur=0; g.strokeStyle='#ffd0d4'; g.lineWidth=1.5; g.stroke(); });
  g.globalAlpha=1;
  // vault door (round, swings open) + gold glow
  const vo=eio((u-1.95)/0.85); const vc=P(20,18);
  if(vo>0){ const gr=g.createRadialGradient(P(20,12)[0],P(20,12)[1],10,P(20,12)[0],P(20,12)[1],340); gr.addColorStop(0,'rgba(255,205,90,'+(.55*vo)+')'); gr.addColorStop(1,'rgba(255,205,90,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H);
    // gold bars
    g.globalAlpha=vo; for(let r=0;r<3;r++) for(let c=0;c<5;c++){ const x=14+c*2.6+(r%2)*1.3, y=9+r*1.6; g.beginPath(); poly([[x,y],[x+2.2,y],[x+2.2,y+1.1],[x,y+1.1]],true); g.fillStyle='rgba(255,200,80,.9)'; g.fill(); g.strokeStyle='#fff3c4'; g.lineWidth=1.5; g.stroke(); }
    SPK.forEach(([x,y,p,s])=>{ const tw=Math.max(0,Math.sin(u*3*s+p)); if(tw<.3) return; const q=P(x,y); g.globalAlpha=vo*tw; g.fillStyle='#fff8dc'; g.beginPath(); g.moveTo(q[0],q[1]-12*tw); g.lineTo(q[0]+3,q[1]); g.lineTo(q[0],q[1]+12*tw); g.lineTo(q[0]-3,q[1]); g.fill(); });
    g.globalAlpha=1; }
  // the door: round vault door (top view) swings open on its hinge at x=17.4
  { const ang=-1.75*vo, hx=17.4, hy=18; const cx=hx+2.6*Math.cos(ang), cy=hy+2.6*Math.sin(-ang)*1;
    g.setLineDash([8,8]); g.strokeStyle='rgba(230,240,255,.55)'; g.lineWidth=2; g.beginPath(); poly(circ(hx,hy,5.2,0,1.75,24)); g.stroke(); g.setLineDash([]);
    g.beginPath(); poly(circ(cx,cy,2.6,0,6.29,40),true); g.fillStyle='rgba(14,50,100,.95)'; g.fill(); g.strokeStyle='#f4f8ff'; g.lineWidth=4; g.stroke();
    g.beginPath(); poly(circ(cx,cy,1.7,0,6.29,32),true); g.lineWidth=2; g.stroke();
    for(let k=0;k<6;k++){ const a=k/6*6.28+u*1.4*(1-vo)+ang; g.beginPath(); poly([[cx,cy],[cx+Math.cos(a)*1.7,cy+Math.sin(a)*1.7]]); g.stroke(); }
    g.fillStyle='#f4f8ff'; const q=P(cx,cy); g.beginPath(); g.arc(q[0],q[1],6,0,6.28); g.fill(); }
  // route: red dashed line drawing itself, glowing runner
  const rp=eio((u+0.05)/2.0);
  if(rp>0){ const h=routeAt(rp); const pts=ROUTE.slice(0,h[2]); pts.push([h[0],h[1]]);
    g.setLineDash([26,16]); g.lineDashOffset=-u*60; g.lineCap='round'; g.strokeStyle='#ff4040'; g.shadowColor='rgba(255,60,60,.9)'; g.shadowBlur=18; g.lineWidth=9; g.beginPath(); poly(pts); g.stroke(); g.setLineDash([]); g.shadowBlur=0;
    const q=P(h[0],h[1]); const pul=1+0.25*Math.sin(u*9); g.fillStyle='rgba(255,80,80,.3)'; g.beginPath(); g.arc(q[0],q[1],30*pul,0,6.28); g.fill(); g.fillStyle='#fff'; g.beginPath(); g.arc(q[0],q[1],11,0,6.28); g.fill();
    // arrow head at the vault
    if(rp>=1){ g.globalAlpha=1; } }
  // pins
  pin(20,58,'1','ENTRY',(u-0.15)/0.45); pin(8,38,'2','LASERS',(u-0.95)/0.45); pin(26,20.6,'3','VAULT',(u-1.75)/0.45);
  // countdown chip (screen space)
  const ta=C((u+0.2)/0.4); if(ta>0){ const rem=Math.max(0,299.99-(SCN.tc!==undefined?SCN.tc:u)), mm=Math.floor(rem/60), ss=Math.floor(rem%60), cs=Math.floor((rem*100)%100);
    const txt='00:0'+mm+':'+String(ss).padStart(2,'0')+'.'+String(cs).padStart(2,'0'); g.save(); g.globalAlpha=ta; g.translate(W/2,1520+(1-eo(ta))*40);
    g.font='800 64px "JetBrains Mono", monospace'; const tw=g.measureText('00:04:59.99').width; g.fillStyle='rgba(4,16,36,.82)'; g.strokeStyle='rgba(255,255,255,.4)'; g.lineWidth=2;
    g.beginPath(); g.roundRect(-tw/2-70,-52,tw+120,104,52); g.fill(); g.stroke(); g.fillStyle=(Math.floor(u*2)%2)?'#ff3d3d':'#ff8080'; g.beginPath(); g.arc(-tw/2-28,0,14,0,6.28); g.fill();
    g.fillStyle='#fff'; g.textAlign='left'; g.textBaseline='middle'; g.fillText(txt,-tw/2+8,3); g.restore(); }
  // vignette
  g.globalAlpha=1; const vg=g.createRadialGradient(W/2,H*.5,H*.3,W/2,H*.5,H*.75); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,8,20,.55)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
};
})();
