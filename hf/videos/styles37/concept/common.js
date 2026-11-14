const E3=(x)=>x<0?0:x>1?1:1-Math.pow(1-x,3), EIO=(x)=>x<0?0:x>1?1:x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, CL=(x)=>x<0?0:x>1?1:x;
const EBK=(x)=>{ x=CL(x); const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); };
const SERIF="'EB Garamond','Lora','DejaVu Serif',Georgia,serif", DISP="'DM Serif Display','EB Garamond','Lora','DejaVu Serif',serif", SANS="Inter,'DejaVu Sans',Helvetica,Arial,sans-serif";
function R0(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
function off(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; }
function tornPath(g,x,y,w,h,seed,j){ const R=R0(seed); j=j||6; g.beginPath(); g.moveTo(x,y+R()*j);
  for(let i=1;i<=24;i++) g.lineTo(x+w*i/24,y+(R()-.5)*j); for(let i=1;i<=12;i++) g.lineTo(x+w+(R()-.5)*j,y+h*i/12);
  for(let i=23;i>=0;i--) g.lineTo(x+w*i/24,y+h+(R()-.5)*j); for(let i=11;i>=1;i--) g.lineTo(x+(R()-.5)*j,y+h*i/12); g.closePath(); }
function blobPath(g,cx,cy,r,seed,amp,n,t,bulge){ const R=R0(seed); const ph=[],fq=[]; for(let i=0;i<4;i++){ ph.push(R()*6.28); fq.push(2+Math.floor(R()*4)); }
  g.beginPath(); for(let i=0;i<=n;i++){ const a=i/n*Math.PI*2; let rr=r; for(let k=0;k<4;k++) rr+=r*amp*Math.sin(a*fq[k]+ph[k]+t*(0.6+k*0.3))/(k+1);
    if(bulge) rr+=bulge(a); const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr; i?g.lineTo(x,y):g.moveTo(x,y); } g.closePath(); }
const GRAIN=off(1080,1920,(p,w,h)=>{ const R=R0(77); for(let i=0;i<140000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.10)+')':'rgba(255,255,255,'+(R()*.10)+')'; p.fillRect(R()*w,R()*h,1+R()*2,1+R()*2); } });
// hand-drawn marker line through pts (Catmull-Rom), drawn up to fraction f; returns the end point + angle
function marker(g,pts,f,width,col,dash){ const N=80, P=[]; for(let i=0;i<=N;i++){ const t=i/N*(pts.length-1), k=Math.min(pts.length-2,Math.floor(t)), u=t-k; const a=pts[Math.max(0,k-1)],b=pts[k],c=pts[k+1],d=pts[Math.min(pts.length-1,k+2)];
    const cr=(p0,p1,p2,p3)=>0.5*((2*p1)+(-p0+p2)*u+(2*p0-5*p1+4*p2-p3)*u*u+(-p0+3*p1-3*p2+p3)*u*u*u); P.push([cr(a[0],b[0],c[0],d[0]),cr(a[1],b[1],c[1],d[1])]); }
  const n=Math.max(1,Math.floor(N*CL(f))); g.save(); g.strokeStyle=col; g.lineCap='round'; g.lineJoin='round'; if(dash) g.setLineDash(dash);
  for(let pass=0;pass<(dash?1:2);pass++){ g.lineWidth=width*(pass?0.55:1); g.globalAlpha=pass?0.55:0.9; g.beginPath(); for(let i=0;i<=n;i++){ const j=pass?Math.sin(i*1.7)*1.6:0; i?g.lineTo(P[i][0]+j,P[i][1]-j):g.moveTo(P[i][0]+j,P[i][1]-j); } g.stroke(); }
  g.restore(); const e=P[n], q=P[Math.max(0,n-3)]; return [e[0],e[1],Math.atan2(e[1]-q[1],e[0]-q[0])]; }
function arrowHead(g,x,y,ang,s,width,col){ g.save(); g.translate(x,y); g.rotate(ang); g.strokeStyle=col; g.lineWidth=width; g.lineCap='round'; g.lineJoin='round'; g.beginPath(); g.moveTo(-s,-s*0.62); g.lineTo(0,0); g.lineTo(-s*0.85,s*0.7); g.stroke(); g.restore(); }
// white sticker edge + drop shadow around any drawn cut-out (content origin moves to [r+20, r+20])
function sticker(src,r){ const w=src.width+2*r+40, h=src.height+2*r+60, ox=r+20, oy=r+20;
  const sil=off(src.width,src.height,(q)=>{ q.drawImage(src,0,0); q.globalCompositeOperation='source-in'; q.fillStyle='#fbfaf5'; q.fillRect(0,0,src.width,src.height); });
  const ring=off(w,h,(q)=>{ for(let i=0;i<28;i++){ const a=i/28*6.283; q.drawImage(sil,ox+Math.cos(a)*r,oy+Math.sin(a)*r); } q.drawImage(sil,ox,oy); });
  const c=off(w,h,(p)=>{ p.shadowColor='rgba(20,30,45,.45)'; p.shadowBlur=24; p.shadowOffsetY=16; p.drawImage(ring,0,0); p.shadowColor='transparent'; p.drawImage(src,ox,oy); }); c.ox=ox; c.oy=oy; return c; }
function paperTag(g,lt,t0,x,y,r,h,s,seed,side){ if(lt<t0) return; const a=EBK((lt-t0)/0.4);
  g.font="400 66px "+DISP; const hw=g.measureText(h).width; g.font="italic 500 40px "+SERIF; const sw=g.measureText(s).width; const W=Math.max(hw,sw)+76, H=146;
  g.save(); g.translate(x+W/2,y+H/2); g.rotate(r+(1-a)*0.25); g.scale(0.4+0.6*a,0.4+0.6*a); g.globalAlpha=CL((lt-t0)/0.12); g.translate(-W/2,-H/2);
  tornPath(g,0,0,W,H,seed,7); g.fillStyle='#f6f1e4'; g.shadowColor='rgba(30,20,10,.4)'; g.shadowBlur=18; g.shadowOffsetY=10; g.fill(); g.shadowColor='transparent';
  const hl=EIO((lt-t0-0.3)/0.4); if(hl>0){ g.fillStyle='rgba(255,214,0,.9)'; g.beginPath(); g.moveTo(26,22); g.lineTo(26+(hw+22)*hl,18); g.lineTo(26+(hw+22)*hl,86); g.lineTo(26,82); g.closePath(); g.fill(); }
  g.fillStyle='#17222b'; g.font="400 66px "+DISP; g.fillText(h,36,74); g.fillStyle='#4c4338'; g.font="italic 500 40px "+SERIF; g.fillText(s,36,124);
  g.fillStyle='rgba(240,232,200,.8)'; g.save(); g.translate(side?W-30:30,-4); g.rotate(side?0.5:-0.5); g.fillRect(-46,-14,92,30); g.restore(); g.restore(); return W; }
