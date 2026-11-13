const C2=(id)=>document.getElementById(id).getContext('2d');
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


// =============== S0 collage-doc: why Pisa's tower doesn't fall ===============
// Facts (Opera della Primaziale Pisana; Burland et al.): the tower stands on soft clay and silt, so the south side sank and it leaned
// ~5.5 degrees by 1990. In 1999-2001 engineers slowly removed soil from under the NORTH side; the tower settled back to about 4 degrees
// and was declared stable for at least 200 years.
(function(){ const g=C2('cv0'), LW=1400;
  const sky=off(1080,1920,(p,w,h)=>{ const gr=p.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#6aa3c8'); gr.addColorStop(.45,'#b9d6e2'); gr.addColorStop(.75,'#f1e2c8'); gr.addColorStop(1,'#ecd2a8'); p.fillStyle=gr; p.fillRect(0,0,w,h); });
  const clouds=off(LW,900,(p,w,h)=>{ const R=R0(31); p.filter='blur(22px)'; for(let c=0;c<7;c++){ const cx=R()*w, cy=140+R()*600, n=9+R()*9; for(let i=0;i<n;i++){ p.fillStyle='rgba(255,255,255,'+(0.25+R()*0.4)+')'; p.beginPath(); p.ellipse(cx+(R()-.5)*300,cy+(R()-.5)*50,60+R()*110,22+R()*36,0,0,7); p.fill(); } } });
  // terracotta roofs of a town (far, blurred) as a printed cut-out strip
  const town=off(LW,700,(p,w,h)=>{ const R=R0(12); p.filter='blur(1.6px)'; let x=-20; while(x<w){ const bw=70+R()*110, bh=110+R()*170, y=h-bh; p.fillStyle=['#e8d6b8','#dcc29c','#efe0c6','#d4b48c'][Math.floor(R()*4)]; p.fillRect(x,y,bw,bh);
      p.fillStyle=['#b85a35','#a44a2a','#c66a3e'][Math.floor(R()*3)]; p.beginPath(); p.moveTo(x-8,y+4); p.lineTo(x+bw/2,y-34-R()*18); p.lineTo(x+bw+8,y+4); p.closePath(); p.fill();
      p.fillStyle='rgba(70,45,25,.55)'; for(let wy=y+26;wy<h-24;wy+=40) for(let wx=x+14;wx<x+bw-18;wx+=30) if(R()<.7) p.fillRect(wx,wy,12,20); x+=bw+3; }
    p.filter='none'; for(let i=0;i<20000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.10)+')':'rgba(255,255,255,'+(R()*.10)+')'; p.fillRect(R()*w,R()*h,2,2); } });
  // the tower cut-out: 8 storeys, arcades, marble shading + halftone (own drawing)
  const TW=300, TH=880;
  const tower=sticker(off(TW,TH,(p)=>{ const lv=[[0,150,1.0],[150,240,1.0],[240,330,1.0],[330,420,1.0],[420,510,1.0],[510,600,1.0],[600,690,1.0],[690,800,0.74]]; // [y0,y1,width]
    const cyl=(x0,w)=>{ const gr=p.createLinearGradient(x0,0,x0+w,0); gr.addColorStop(0,'#c9c1b2'); gr.addColorStop(.3,'#fbf8f1'); gr.addColorStop(.7,'#e6dfd1'); gr.addColorStop(1,'#a69d8d'); return gr; };
    lv.forEach(([y0,y1,wf],i)=>{ const yy0=TH-y1, yy1=TH-y0, w=TW*wf*(i===7?1:0.94), x0=(TW-w)/2; p.fillStyle=cyl(x0,w); p.fillRect(x0,yy0,w,yy1-yy0);
      // arcade: arches + columns
      const n=i===0?6:(i===7?5:9), aw=w/n; for(let k=0;k<n;k++){ const ax=x0+k*aw+aw*0.18, awid=aw*0.64, top=yy0+(i===0?40:22), bot=yy1-(i===0?16:10); const shade=0.25+0.55*Math.abs((k+0.5)/n-0.42);
        p.fillStyle='rgba(60,52,40,'+shade+')'; p.beginPath(); p.moveTo(ax,bot); p.lineTo(ax,top+awid/2); p.arc(ax+awid/2,top+awid/2,awid/2,Math.PI,0); p.lineTo(ax+awid,bot); p.closePath(); p.fill(); }
      p.fillStyle='rgba(120,108,90,.8)'; p.fillRect(x0-6,yy0,w+12,7); p.fillStyle='rgba(255,255,255,.7)'; p.fillRect(x0-6,yy0,w+12,2); });
    p.fillStyle='#8b8172'; p.beginPath(); p.moveTo(TW*0.16,TH-800); p.quadraticCurveTo(TW/2,TH-835,TW*0.84,TH-800); p.fill();
    p.save(); p.globalCompositeOperation='source-atop'; for(let y=0;y<TH;y+=8) for(let x=(y/8%2)*4;x<TW;x+=8){ const d=CL((x-TW*0.62)/(TW*0.38)); if(d<=0) continue; p.fillStyle='rgba(40,34,26,.28)'; p.beginPath(); p.arc(x,y,0.5+2.2*d,0,7); p.fill(); }
    const R=R0(3); for(let i=0;i<9000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.10)+')':'rgba(255,255,255,'+(R()*.14)+')'; p.fillRect(R()*TW,R()*TH,2,2); } p.restore(); }),10);
  // soil strips (torn paper layers)
  const GY=1330, X0=560;
  const soil=off(1080,620,(p,w,h)=>{ const L=[[0,46,'#7e9b4f'],[40,150,'#d9bf86'],[140,330,'#8c6a49'],[320,620,'#6f5236']]; L.forEach(([a,b,c],i)=>{ tornPath(p,-20,a,w+40,b-a+20,60+i,12); p.fillStyle=c; p.shadowColor='rgba(30,20,10,.35)'; p.shadowBlur=14; p.shadowOffsetY=-4; p.fill(); p.shadowColor='transparent'; });
    const R=R0(8); for(let i=0;i<5000;i++){ const y=40+R()*580; p.fillStyle=y<150?'rgba(120,90,40,.25)':'rgba(30,20,10,'+(R()*.25)+')'; p.beginPath(); p.arc(R()*w,y,1+R()*3,0,7); p.fill(); }
    p.fillStyle='rgba(255,245,220,.75)'; p.font="italic 500 34px "+SERIF; p.fillText('sand',40,110); p.fillText('soft clay',40,250); });
  const TAGS=[['Soft clay','the south side sinks',600,1410,0.02,1],['Soil removed','from the north side',40,1410,-0.03,0],['Stable now','for 200+ years',40,1150,0.02,0]];
  SCN[0]=function(lt){ g.clearRect(0,0,1080,1920); const z=1+0.045*EIO(lt/6.5), q=Math.floor(lt*12)/12;
    g.save(); g.translate(540,960); g.scale(z,z); g.translate(-540,-960);
    g.drawImage(sky,0,0); g.drawImage(clouds,-40-lt*20,80);
    const t1=E3((lt-0.1)/0.4); g.save(); g.globalAlpha=t1*0.95; g.fillStyle='#2f5f86'; g.font="500 96px "+SERIF; g.fillText('Pisa’s tower',60,300+(1-t1)*30); g.restore();
    const t2=E3((lt-0.3)/0.45); g.save(); g.globalAlpha=CL(t2*1.4); g.translate(520,600); g.scale(1.22-0.22*t2,1.22-0.22*t2); g.fillStyle='#27425a'; g.font="italic 400 330px "+DISP; g.textAlign='center'; g.fillText('leans',0,0); g.restore();
    const a1=E3((lt-0.05)/0.7); g.drawImage(town,-90-lt*10,GY-640+(1-a1)*420);
    // lean: 5.5 deg, then the soil extraction pulls it back to ~4 deg
    const fix=EIO((lt-3.0)/1.7), deg=5.5-1.5*fix, ang=deg*Math.PI/180;
    const up=E3((lt-0.35)/0.9);
    g.save(); g.translate(X0,GY+18+(1-up)*1100); g.rotate(ang+0.003*Math.sin(q*3)); g.drawImage(tower,-TW/2-tower.ox,-TH-tower.oy+30); g.restore();
    // plumb line + angle
    const pl=EIO((lt-1.2)/0.5); if(pl>0){ g.save(); g.strokeStyle='#23313d'; g.lineWidth=5; g.setLineDash([16,12]); g.beginPath(); g.moveTo(X0,GY); g.lineTo(X0,GY-(TH-60)*pl); g.stroke(); g.setLineDash([]);
      const r=760; g.strokeStyle='#f0541c'; g.lineWidth=7; g.lineCap='round'; g.beginPath(); g.arc(X0,GY,r,-Math.PI/2,-Math.PI/2+ang*pl); g.stroke();
      g.globalAlpha=CL((lt-1.5)/0.3); g.fillStyle='#f0541c'; g.font="italic 500 64px "+SERIF; g.fillText(deg.toFixed(1)+'°',X0+Math.sin(ang)*r+60,GY-Math.cos(ang)*r+120); g.restore(); }
    // the ground
    const a2=E3((lt-0.0)/0.6); g.drawImage(soil,0,GY-30+(1-a2)*600);
    // the south side sinks: arrows down into the clay
    const sk=CL((lt-2.0)/0.4)*(1-CL((lt-3.2)/0.4)); if(sk>0){ for(let i=0;i<3;i++){ const yy=GY+80+((lt*0.9+i/3)%1)*110; g.save(); g.globalAlpha=sk*0.9; arrowHead(g,X0+120+i*40,yy,Math.PI/2,22,7,'#fff4dc'); g.restore(); } }
    // soil extraction under the north side: a drill pipe + soil crumbs coming out
    const dr=E3((lt-2.9)/0.4); if(dr>0){ g.save(); g.globalAlpha=dr; g.strokeStyle='#3a3f45'; g.lineWidth=16; g.lineCap='round'; g.beginPath(); g.moveTo(150,GY+5); g.lineTo(150+(X0-80-150)*dr,GY+150*dr); g.stroke(); g.strokeStyle='#9aa3ab'; g.lineWidth=6; g.stroke(); g.restore();
      for(let i=0;i<14;i++){ const u=((lt*0.7+i/14)%1); if(lt<3.1) continue; const x=X0-80+(150-X0+80)*u, y=GY+150-150*u-Math.sin(u*Math.PI)*8; g.fillStyle='#6f5236'; g.globalAlpha=CL((lt-3.1)/0.3)*(1-CL((lt-5.0)/0.5)); g.beginPath(); g.arc(x,y-10,7+(i%3)*2,0,7); g.fill(); } g.globalAlpha=1;
      const heap=CL((lt-3.2)/2); g.fillStyle='#6f5236'; g.beginPath(); g.ellipse(120,GY+4,70*heap,26*heap,0,Math.PI,0); g.fill(); }
    // orange label
    const t3=E3((lt-0.6)/0.4); g.save(); g.translate(-560*(1-t3),0); g.rotate(-0.014); tornPath(g,-20,640,540,92,33,5); g.fillStyle='#f0541c'; g.shadowColor='rgba(30,20,10,.35)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
    g.fillStyle='#fff'; g.font="500 70px "+SERIF; g.fillText('but won’t fall',58,708); g.restore();
    // tags + marker lines
    [[2.1,TAGS[0],[X0+150,GY+160]],[3.3,TAGS[1],[X0-120,GY+150]],[4.9,TAGS[2],[X0+40,GY-520]]].forEach(([t0,T,tgt],i)=>{ const cf=EIO((lt-t0-0.25)/0.4); if(cf<=0) return; const sx=T[2]+(T[5]?20:400), sy=T[3]+(i===2?60:6); const e=marker(g,[[sx,sy],[(sx+tgt[0])/2,(sy+tgt[1])/2-30],[tgt[0],tgt[1]]],cf,6,'#23313d'); if(cf>0.97){ g.fillStyle='#f0541c'; g.beginPath(); g.arc(tgt[0],tgt[1],13,0,7); g.fill(); g.strokeStyle='#fff'; g.lineWidth=4; g.stroke(); } });
    paperTag(g,lt,2.1,TAGS[0][2],TAGS[0][3],TAGS[0][4],TAGS[0][0],TAGS[0][1],52,1);
    paperTag(g,lt,3.3,TAGS[1][2],TAGS[1][3],TAGS[1][4],TAGS[1][0],TAGS[1][1],53,0);
    paperTag(g,lt,4.9,TAGS[2][2],TAGS[2][3],TAGS[2][4],TAGS[2][0],TAGS[2][1],54,0);
    const ck=EBK((lt-5.3)/0.4); if(lt>5.3){ g.save(); g.translate(470,1190); g.scale(ck,ck); g.strokeStyle='#2f8a4a'; g.lineWidth=12; g.lineCap='round'; g.lineJoin='round'; g.beginPath(); g.moveTo(-24,0); g.lineTo(-6,20); g.lineTo(30,-24); g.stroke(); g.restore(); }
    g.restore();
    g.globalCompositeOperation='multiply'; g.fillStyle='rgba(244,236,214,.45)'; g.fillRect(0,0,1080,1920); g.globalCompositeOperation='source-over';
    g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,900,500,540,900,1250); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(30,25,15,.30)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();

// =============== S1 glow-science: falling into a black hole ===============
// Facts (NASA): near a stellar-mass black hole gravity pulls much harder on your feet than on your head (tidal force), stretching you
// thin like a noodle: "spaghettification". The event horizon is the point of no return.
(function(){ const g=C2('cv1');
  const bg=off(1080,1920,(p,w,h)=>{ const gr=p.createRadialGradient(w*.5,h*.52,60,w*.5,h*.5,1300); gr.addColorStop(0,'#2b1f6e'); gr.addColorStop(.5,'#150f45'); gr.addColorStop(1,'#05041a'); p.fillStyle=gr; p.fillRect(0,0,w,h);
    p.filter='blur(90px)'; [[180,520,260,'rgba(255,90,170,.22)'],[950,1450,300,'rgba(60,140,255,.22)'],[860,700,200,'rgba(255,160,60,.16)']].forEach(([x,y,r,c])=>{ p.fillStyle=c; p.beginPath(); p.arc(x,y,r,0,7); p.fill(); }); });
  const R=R0(9), STARS=[]; for(let i=0;i<160;i++) STARS.push([R()*1080,R()*1920,0.8+R()*R()*4,R()*6]);
  const C={x:560,y:1060}, RH=150;
  const PART=[]; for(let i=0;i<70;i++) PART.push([R()*6.283,RH*1.7+R()*RH*1.9,0.5+R()*0.8,R()<.5?'#ffd27a':'#ff8f4a',2+R()*4]);
  function disk(lt,front){ // flat glowing accretion disk, tilted ellipse; draw back half or front half
    g.save(); g.translate(C.x,C.y); g.rotate(-0.18); const rings=[[RH*3.2,'rgba(255,120,60,.30)',40],[RH*2.7,'rgba(255,150,70,.55)',34],[RH*2.25,'rgba(255,195,100,.8)',28],[RH*1.85,'rgba(255,236,170,.95)',18]];
    rings.forEach(([r,c,wd])=>{ g.strokeStyle=c; g.lineWidth=wd; g.shadowColor='rgba(255,170,80,.9)'; g.shadowBlur=40; g.beginPath(); g.ellipse(0,0,r,r*0.28,0,front?0:Math.PI,front?Math.PI:Math.PI*2); g.stroke(); });
    g.shadowBlur=0; PART.forEach(([a0,r,sp,c,s])=>{ const a=a0+lt*sp*(RH*2.4/r); const s2=Math.sin(a); if((s2>0)!==front) return; g.fillStyle=c; g.globalAlpha=0.9; g.beginPath(); g.arc(Math.cos(a)*r,s2*r*0.28,s,0,7); g.fill(); }); g.globalAlpha=1; g.restore(); }
  function lensArc(lt){ // light from the far side of the disk bent over the top of the hole
    g.save(); g.translate(C.x,C.y); g.rotate(-0.18); [[RH*1.55,'rgba(255,200,120,.85)',26],[RH*1.8,'rgba(255,150,80,.45)',30]].forEach(([r,c,wd])=>{ g.strokeStyle=c; g.lineWidth=wd; g.shadowColor='rgba(255,170,80,.9)'; g.shadowBlur=36; g.beginPath(); g.ellipse(0,-RH*0.08,r,r*0.92,0,Math.PI*1.04,Math.PI*1.96); g.stroke(); }); g.restore(); }
  function astro(x,y,ang,sx,sy,a,red){ g.save(); g.globalAlpha=a; g.translate(x,y); g.rotate(ang); g.scale(sx,sy);
    const W='rgb('+(240)+','+(240-60*red|0)+','+(250-120*red|0)+')';
    g.fillStyle='#c9cbe0'; g.beginPath(); g.roundRect(-30,-4,22,60,10); g.fill(); // backpack
    g.fillStyle=W; g.beginPath(); g.roundRect(-22,-10,44,62,18); g.fill(); g.lineCap='round'; g.strokeStyle=W; g.lineWidth=15; g.beginPath(); g.moveTo(-14,48); g.lineTo(-20,82); g.moveTo(14,48); g.lineTo(22,80); g.moveTo(-20,6); g.lineTo(-44,30); g.moveTo(20,6); g.lineTo(46,-12); g.stroke();
    g.fillStyle=W; g.beginPath(); g.arc(0,-34,32,0,7); g.fill(); g.fillStyle='#ff8a3d'; g.beginPath(); g.ellipse(6,-34,22,16,0,0,7); g.fill(); g.fillStyle='rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(-2,-40,8,4,-0.5,0,7); g.fill(); g.restore(); }
  function label(txt,x,y,tx,ty,a){ if(a<=0) return; g.save(); g.globalAlpha=a; g.font='800 40px '+SANS; const w=g.measureText(txt).width+52;
    g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=4; g.beginPath(); g.moveTo(x+w/2,y); g.lineTo(tx,ty); g.stroke(); g.fillStyle='#fff'; g.beginPath(); g.arc(tx,ty,9,0,7); g.fill();
    g.fillStyle='rgba(12,8,44,.86)'; g.beginPath(); g.roundRect(x,y-36,w,72,36); g.fill(); g.strokeStyle='rgba(255,255,255,.25)'; g.lineWidth=2; g.stroke(); g.fillStyle='#fff'; g.fillText(txt,x+26,y+14); g.restore(); }
  SCN[1]=function(lt){ g.clearRect(0,0,1080,1920); g.drawImage(bg,0,0);
    STARS.forEach(([x,y,r,ph])=>{ g.globalAlpha=0.35+0.4*(0.5+0.5*Math.sin(lt*2+ph)); g.fillStyle='#e8e4ff'; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); }); g.globalAlpha=1;
    const z=1+0.12*EIO((lt-0.8)/5.5); g.save(); g.translate(C.x,C.y); g.scale(z,z); g.translate(-C.x,-C.y);
    const ap=E3(lt/0.6); g.save(); g.globalAlpha=ap; disk(lt,false); lensArc(lt);
    // the black hole: pure black disk with a thin bright photon ring
    g.shadowColor='rgba(255,210,140,.95)'; g.shadowBlur=30; g.strokeStyle='#ffe2a8'; g.lineWidth=6; g.beginPath(); g.arc(C.x,C.y,RH*1.04,0,7); g.stroke(); g.shadowBlur=0; g.fillStyle='#000'; g.beginPath(); g.arc(C.x,C.y,RH,0,7); g.fill();
    g.restore();
    // the astronaut falls in on a spiral; the closer, the more stretched along the radial direction
    const f=EIO((lt-0.5)/5.2), th=-2.1+f*2.0, rr=RH*(4.3-3.1*Math.pow(f,1.2)), x=C.x+Math.cos(th)*rr, y=C.y+Math.sin(th)*rr*0.75; const rad=Math.atan2(C.y-y,C.x-x);
    const st=1+5.0*Math.pow(CL((RH*3.4-rr)/(RH*2.3)),1.6), red=CL((lt-4.6)/1.2), fade=1-CL((lt-5.9)/0.6);
    // tidal arrows: feet pulled harder than head
    const ta=CL((lt-2.3)/0.3)*(1-CL((lt-4.2)/0.3)); if(ta>0){ g.save(); g.globalAlpha=ta; [[0.9,46],[-0.6,22]].forEach(([d,l],i)=>{ const bx=x+Math.cos(rad)*d*60, by=y+Math.sin(rad)*d*60; g.strokeStyle=i?'#8fd3ff':'#ffb14a'; g.lineWidth=10; g.lineCap='round'; g.beginPath(); g.moveTo(bx,by); g.lineTo(bx+Math.cos(rad)*l*2,by+Math.sin(rad)*l*2); g.stroke(); arrowHead(g,bx+Math.cos(rad)*l*2,by+Math.sin(rad)*l*2,rad,20,10,i?'#8fd3ff':'#ffb14a'); }); g.restore(); }
    if(fade>0) astro(x,y,rad-Math.PI/2+Math.sin(lt*1.4)*0.15*(1-f),1/Math.sqrt(st),st,ap*fade,red);
    disk(lt,true);
    g.restore();
    label('Event horizon',90,640,C.x-RH*0.95,C.y-RH*0.5,CL((lt-0.9)/0.25)*(1-CL((lt-2.4)/0.3)));
    label('Feet pulled harder than head',70,1520,x,y+20,CL((lt-2.4)/0.3)*(1-CL((lt-4.2)/0.3)));
    label('Spaghettified!',600,640,x+20,y-40,CL((lt-4.3)/0.3));
    const h1=E3((lt-0.15)/0.4), h2=E3((lt-0.35)/0.4); g.save(); g.textAlign='center'; g.shadowColor='rgba(0,0,0,.5)'; g.shadowBlur=20;
    g.globalAlpha=h1; g.fillStyle='#fff'; g.font='800 84px '+SANS; g.fillText('Falling into',540,330+(1-h1)*24);
    g.globalAlpha=h2; const wA=g.measureText('a ').width, wB=g.measureText('black hole').width, x0=540-(wA+wB)/2; g.textAlign='left'; g.fillText('a ',x0,430+(1-h2)*24); g.fillStyle='#ffab4a'; g.shadowColor='rgba(255,160,60,.8)'; g.shadowBlur=30; g.fillText('black hole',x0+wA,430+(1-h2)*24); g.restore();
  };
})();

// =============== S2 brush-story: how Pompeii was buried ===============
// Facts: Mount Vesuvius erupted in AD 79; Pliny the Younger compared the eruption cloud to an umbrella pine. Pumice and ash fell on
// Pompeii for hours and buried it several metres deep; excavations began in 1748, almost 1,700 years later.
(function(){ const g=C2('cv2');
  function strokes(p,n,R,x0,y0,w,h,cols,len,wid,ang,a0,a1){ a0=a0??0.08; a1=a1??0.22; for(let i=0;i<n;i++){ const x=x0+R()*w, y=y0+R()*h, l=len*(0.5+R()), a=(ang||0)+(R()-.5)*0.5;
    p.strokeStyle=cols[Math.floor(R()*cols.length)]; p.globalAlpha=a0+R()*a1; p.lineWidth=wid*(0.5+R()); p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5+(R()-.5)*6,x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } p.globalAlpha=1; }
  const W=1400, H=2200, HZ=1180;
  const skyDay=off(W,H,(p)=>{ const R=R0(5); const gr=p.createLinearGradient(0,0,0,HZ); gr.addColorStop(0,'#3d6f99'); gr.addColorStop(.6,'#c9a27a'); gr.addColorStop(1,'#f0c48a'); p.fillStyle=gr; p.fillRect(0,0,W,HZ+40);
    strokes(p,2200,R,0,0,W,HZ,['#4f7ea6','#7d98a8','#d9b088','#f2cf9a'],170,32,0); });
  const skyAsh=off(W,H,(p)=>{ const R=R0(6); const gr=p.createLinearGradient(0,0,0,HZ); gr.addColorStop(0,'#1d1a1c'); gr.addColorStop(.7,'#4a3b33'); gr.addColorStop(1,'#8a5a3a'); p.fillStyle=gr; p.fillRect(0,0,W,HZ+40);
    strokes(p,2200,R,0,0,W,HZ,['#2a2426','#3d3330','#5c4638','#1a1718'],170,32,0); });
  const volc=off(W,700,(p)=>{ const R=R0(7); p.beginPath(); p.moveTo(0,700); p.lineTo(260,520); p.quadraticCurveTo(520,250,640,190); p.lineTo(760,200); p.quadraticCurveTo(900,280,1120,500); p.lineTo(W,620); p.lineTo(W,700); p.closePath(); p.fillStyle='#5a4a4a'; p.fill(); p.save(); p.clip();
    strokes(p,900,R,0,150,W,550,['#6e5a55','#4a3c3c','#86706a','#3a2f30'],90,18,0.6,0.15,0.3); p.restore(); });
  const plain=off(W,1100,(p,w,h)=>{ const R=R0(13); const gr=p.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#8a7a52'); gr.addColorStop(1,'#4a4030'); p.fillStyle=gr; p.fillRect(0,0,w,h); strokes(p,1800,R,0,0,w,h,['#9a8a5a','#6e6240','#b39a62','#4c4430'],120,22,0,0.12,0.25); });
  const town=off(W,520,(p)=>{ const R=R0(11); let x=-30; while(x<W){ const bw=110+R()*130, bh=120+R()*140, y=520-bh; p.fillStyle=['#e7d0ad','#d9b98d','#efdcbc'][Math.floor(R()*3)]; p.fillRect(x,y,bw,bh);
      p.fillStyle=['#b55a33','#9e4a2b'][Math.floor(R()*2)]; p.beginPath(); p.moveTo(x-10,y+6); p.lineTo(x+bw/2,y-40); p.lineTo(x+bw+10,y+6); p.closePath(); p.fill(); p.fillStyle='rgba(60,35,20,.65)'; for(let k=0;k<3;k++) if(R()<.8) p.fillRect(x+16+k*(bw-40)/3,y+40+R()*30,18,30); x+=bw+4; }
    // temple with columns
    p.fillStyle='#efe3c9'; p.fillRect(80,250,360,30); for(let i=0;i<7;i++){ p.fillRect(96+i*54,280,22,200); } p.beginPath(); p.moveTo(70,250); p.lineTo(260,170); p.lineTo(450,250); p.closePath(); p.fill(); p.fillRect(70,480,380,40);
    strokes(p,700,R,0,100,W,420,['#fff3dc','#7a4a2a','#3b2a20'],50,8,0,0.05,0.12); });
  const tex=off(256,256,(p)=>{ const R=R0(3); strokes(p,260,R,-20,0,296,256,['#2a2220','#d8c0a0','#5a4a40'],80,10,0.03,0.05,0.16); });
  const BOIL=[1,2,3].map(s=>off(1080,1920,(p)=>{ const R=R0(s*19); strokes(p,420,R,-50,0,1180,1920,['#f2dcc0','#1a1414','#c08a5a'],120,22,0.1,0.02,0.05); }));
  const Rr=R0(21), ASH=[]; for(let i=0;i<260;i++) ASH.push([Rr()*1300-110,Rr()*2000,1.5+Rr()*4,0.6+Rr()*0.8]);
  const CAP=[['AD 79: Vesuvius erupts.',0.35],['Ash falls for hours.',2.0],['Lost for almost 1,700 years.',3.9]];
  SCN[2]=function(lt){ g.clearRect(0,0,1080,1920); const q=Math.floor(lt*8);
    const dark=EIO((lt-1.0)/2.5), zf=EIO((lt-3.4)/2.8), zb=1.08-0.14*zf, cy=HZ-60+40*zf;
    g.save(); g.translate(540,960); g.scale(zb,zb); g.translate(-560,-cy);
    g.drawImage(skyDay,-160,0); g.globalAlpha=dark; g.drawImage(skyAsh,-160,0); g.globalAlpha=1;
    // the eruption column: rises from the summit, spreads like an umbrella pine
    const col=EIO((lt-0.2)/2.2), sx=640-160+40, sy=HZ-700+200; if(col>0){ const top=sy-640*col; g.save();
      const Rc=R0(77); for(let i=0;i<150;i++){ const u=Rc(), yy=sy-(sy-top)*u, spread=u>0.72?(u-0.72)*1400*col:0, ox=(Rc()-.5)*(60+80*u+spread), rad=26+40*u+Rc()*30+(u>0.72?30:0), wob=Math.sin(lt*1.2+i)*10;
        g.globalAlpha=0.8; g.fillStyle=['#3a3030','#5a4a44','#2a2224','#6e5c52','#4a3e3a'][i%5]; g.beginPath(); g.arc(sx+ox+wob+(u>0.72?(u-0.72)*160:0),yy+(Rc()-.5)*30,rad,0,7); g.fill();
        g.globalAlpha=0.35; g.fillStyle='#8a766a'; g.beginPath(); g.arc(sx+ox+wob-rad*0.3+(u>0.72?(u-0.72)*160:0),yy-rad*0.35,rad*0.55,0,7); g.fill(); } g.globalAlpha=1;
      g.restore();
      // lightning in the cloud
      if(lt>2.2 && (q%7===0)){ g.save(); g.strokeStyle='rgba(255,240,200,.9)'; g.lineWidth=5; g.shadowColor='#fff'; g.shadowBlur=20; g.beginPath(); let lx=sx+60, ly=top+80; g.moveTo(lx,ly); for(let k=0;k<5;k++){ lx+=(k%2?-30:36); ly+=46; g.lineTo(lx,ly); } g.stroke(); g.restore(); }
      // glowing lava at the summit
      g.save(); g.fillStyle='rgba(255,120,40,'+(0.6+0.3*Math.sin(lt*6))+')'; g.shadowColor='#ff6a20'; g.shadowBlur=50; g.beginPath(); g.ellipse(sx,sy+6,70,18,0,0,7); g.fill(); g.restore(); }
    g.drawImage(volc,-160,HZ-700);
    g.fillStyle='rgba(30,20,20,'+(0.45*dark)+')'; g.fillRect(-200,HZ-720,W+200,760);
    g.drawImage(plain,-160,HZ-10); g.fillStyle='rgba(20,15,15,'+(0.5*dark)+')'; g.fillRect(-200,HZ-10,W+200,1100);
    g.drawImage(town,-140,HZ-140); g.fillStyle='rgba(20,15,15,'+(0.4*dark)+')'; g.fillRect(-200,HZ-140,W+200,520);
    // the ash layer rises and buries the town
    const bury=EIO((lt-2.6)/3.0), ay=HZ+1000-1000*bury; g.save(); g.beginPath(); g.moveTo(-200,H); for(let x=-200;x<=W;x+=20) g.lineTo(x,ay+Math.sin(x*0.01+1)*14+Math.sin(x*0.031)*6); g.lineTo(W,H); g.closePath(); g.fillStyle='#8b8178'; g.fill(); g.clip(); g.globalAlpha=0.5; g.fillStyle=g.createPattern(tex,'repeat'); g.fillRect(-200,ay-40,W+200,H); g.globalAlpha=1;
      g.strokeStyle='rgba(60,50,45,.35)'; g.lineWidth=4; for(let k=1;k<6;k++){ g.beginPath(); for(let x=-200;x<=W;x+=30) g.lineTo(x,ay+k*50+Math.sin(x*0.012+k)*8); g.stroke(); } g.restore();
    g.restore();
    // falling ash + pumice over everything
    const fall=CL((lt-1.2)/0.8); if(fall>0) ASH.forEach(([x,y,r,s])=>{ const yy=(y+lt*260*s)%2000-40, xx=x+lt*40*s; g.globalAlpha=fall*0.75; g.fillStyle=r>4?'#cbbfae':'#8f857c'; g.beginPath(); g.arc(xx%1200,yy,r,0,7); g.fill(); }); g.globalAlpha=1;
    CAP.forEach(([t,t0],i)=>{ const a=EBK((lt-t0)/0.45); if(lt<t0) return; g.save(); g.globalAlpha=CL((lt-t0)/0.15); g.font='italic 500 '+(i===2?72:72)+'px '+SERIF; const w=g.measureText(t).width+64, y=262+i*112;
      g.translate(60+(1-a)*-200,y); g.rotate([-0.02,0.015,-0.01][i]); tornPath(g,0,0,w,96,90+i,6); g.fillStyle='#f3e6c8'; g.shadowColor='rgba(0,5,15,.6)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
      g.strokeStyle='rgba(150,100,50,.35)'; g.lineWidth=3; g.stroke(); g.fillStyle=i===2?'#8a1c10':'#2c1c0e'; g.fillText(t,32,70); g.restore(); });
    g.drawImage(BOIL[q%3],0,0); g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,900,380,540,900,1300); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(20,10,5,.55)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();
