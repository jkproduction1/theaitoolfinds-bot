// ---------- styles33: the three explainer LOOKS of styles19/20/28 on new topics, drawn in 2D canvas by Claude Fable 5.2 (own designs; no channel
// logos, wordmarks, mascots or characters; no photos copied).
// S0 /paper-collage = why Pisa's tower doesn't fall · S1 /flat-science = why tattoos last forever · S2 /painted-story = how the Hindenburg burned
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


// =============== S1 flat-science: why tattoos last forever ===============
// Facts (Baranska et al., J Exp Med 2018, in mice; Cosmos; Popular Science): the needle puts ink into the dermis; immune cells
// (macrophages) swallow the pigment; when such a cell dies it drops the ink and a new macrophage swallows it again, so the ink stays.
(function(){ const g=C2('cv1');
  const bg=off(1080,1920,(p,w,h)=>{ const gr=p.createRadialGradient(w*.5,h*.6,60,w*.5,h*.55,1300); gr.addColorStop(0,'#3a1f6e'); gr.addColorStop(.5,'#1c1050'); gr.addColorStop(1,'#07051f'); p.fillStyle=gr; p.fillRect(0,0,w,h);
    p.filter='blur(90px)'; [[180,900,280,'rgba(255,90,170,.26)'],[950,1500,320,'rgba(60,200,255,.20)'],[820,800,220,'rgba(160,110,255,.22)']].forEach(([x,y,r,c])=>{ p.fillStyle=c; p.beginPath(); p.arc(x,y,r,0,7); p.fill(); }); });
  const R=R0(23), DOTS=[]; for(let i=0;i<70;i++) DOTS.push([R()*1080,700+R()*1220,2+R()*7,R()*.4+.12,R()<.5?'#ff9ad0':'#b99bff',R()*6]);
  const TIP=[700,790];
  // macrophages [x,y,r,seed]; DIE = the one that dies; the fresh (green) one arrives at NEW
  const CELLS=[[250,1010,170,1],[640,970,150,2],[930,1130,150,3],[430,1330,175,4],[820,1470,160,5],[170,1580,150,6],[980,1760,130,8]], DIE=3, NEW=[520,1530,130,7];
  const INK=CELLS.map(([x,y,r,s])=>{ const Q=R0(s*41), a=[]; for(let i=0;i<15;i++){ const an=Q()*6.283, d=Math.sqrt(Q())*r*.6; a.push([Math.cos(an)*d,Math.sin(an)*d,10+Q()*15,Q()*6,Q(),(Q()-.5)*240,(Q()-.5)*200]); } return a; });
  function label(txt,x,y,tx,ty,a,col){ if(a<=0) return; g.save(); g.globalAlpha=a; g.font='800 40px '+SANS; const w=g.measureText(txt).width+52;
    g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=4; g.beginPath(); g.moveTo(x+w/2,y); g.lineTo(tx,ty); g.stroke(); g.fillStyle='#fff'; g.beginPath(); g.arc(tx,ty,9,0,7); g.fill();
    g.fillStyle='rgba(12,8,44,.88)'; g.beginPath(); g.roundRect(x,y-36,w,72,36); g.fill(); g.strokeStyle=col||'rgba(255,255,255,.25)'; g.lineWidth=2; g.stroke(); g.fillStyle='#fff'; g.fillText(txt,x+26,y+14); g.restore(); }
  function inkDot(x,y,r,lt,ph,a){ if(a<=0) return; g.save(); g.globalAlpha=a; g.translate(x,y); g.rotate(ph+lt*0.2); blobPath(g,0,0,r,3,0.2,20,lt*.5+ph); g.fillStyle='#0b1030'; g.shadowColor='rgba(60,220,255,.95)'; g.shadowBlur=22; g.fill(); g.shadowBlur=0; blobPath(g,-r*.15,-r*.2,r*.55,5,0.2,16,lt*.5); g.fillStyle='#1f6dff'; g.fill(); g.restore(); }
  const PUR=[[168,124,246],[140,98,226],[186,146,255]], GRY=[[141,134,184],[118,111,159],[163,156,201]], GRN=[[95,224,192],[69,194,166],[138,242,216]];
  const mix=(A,B,f)=>'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*f)).join(',')+')';
  function cell(x,y,r,s,lt,A,B,f,alpha,glow){ g.save(); g.globalAlpha=alpha; const c=[0,1,2].map(i=>mix(A[i],B[i],f));
    g.strokeStyle=c[1]; g.lineCap='round'; const Q=R0(s*31); for(let k=0;k<6;k++){ const an=Q()*6.283+Math.sin(lt*0.8+k)*0.08, L=r*(1.15+Q()*.35); g.lineWidth=r*.2; g.beginPath(); g.moveTo(x+Math.cos(an)*r*.8,y+Math.sin(an)*r*.8); g.quadraticCurveTo(x+Math.cos(an+.3)*L*.9,y+Math.sin(an+.3)*L*.9,x+Math.cos(an)*L,y+Math.sin(an)*L); g.stroke(); }
    g.shadowColor=glow; g.shadowBlur=50; blobPath(g,x,y,r,s,0.05,90,lt); g.fillStyle=c[0]; g.fill(); g.shadowBlur=0;
    blobPath(g,x+r*.06,y+r*.08,r*.92,s,0.05,90,lt); g.fillStyle=c[1]; g.fill(); blobPath(g,x-r*.05,y-r*.06,r*.84,s,0.05,90,lt); g.fillStyle=c[2]; g.fill();
    g.fillStyle='rgba(255,255,255,.28)'; g.beginPath(); g.ellipse(x-r*.35,y-r*.45,r*.22,r*.1,-.6,0,7); g.fill(); g.restore(); }
  SCN[1]=function(lt){ g.clearRect(0,0,1080,1920); g.drawImage(bg,0,0);
    DOTS.forEach(([x,y,r,a,c,ph])=>{ const yy=700+((y-700-lt*(6+r*3)+1220)%1220); g.globalAlpha=a*(.6+.4*Math.sin(lt*2+ph)); g.fillStyle=c; g.beginPath(); g.arc(x+Math.sin(lt*.5+ph)*12,yy,r,0,7); g.fill(); }); g.globalAlpha=1;
    const z=1+0.10*EIO((lt-0.6)/5.5); g.save(); g.translate(540,1200); g.scale(z,z); g.translate(-540,-1200);
    const die=EIO((lt-3.1)/0.7), rel=EIO((lt-3.5)/0.9), come=E3((lt-3.5)/1.0);
    // cells (pop in), the dying one turns grey and shrinks
    CELLS.forEach(([x,y,r,s],i)=>{ const ap=E3((lt-0.05-i*0.07)/0.5); if(ap<=0) return; const d=i===DIE?die:0; const pulse=1+0.04*Math.sin(lt*2+i)*(1-d);
      cell(x,y,r*(0.6+0.4*ap)*(1-0.12*d)*pulse,s,lt,PUR,GRY,d,ap*(1-0.6*EIO((lt-4.3)/1.2)*(i===DIE?1:0)),i===DIE&&d>0.5?'rgba(150,150,190,.3)':'rgba(190,140,255,.7)'); });
    // the fresh macrophage crawls in from below
    const nx=NEW[0]-40*(1-come), ny=NEW[1]+520*(1-come); if(lt>3.5) cell(nx,ny,NEW[2]*(1+0.05*Math.sin(lt*3)),NEW[3],lt,GRN,GRN,0,1,'rgba(110,255,220,.85)');
    // ink: falls from the needle, floats, gets swallowed; the dying cell drops its ink and the new one eats it
    CELLS.forEach(([x,y,r,s],i)=>{ INK[i].forEach(([dx,dy,ir,ph,u0,sx,sy],k)=>{ const t0=0.75+u0*0.9+i*0.05, fall=EIO((lt-t0)/0.7), eat=EIO((lt-t0-0.75-0.25*u0)/0.7); if(lt<t0) return;
        const fx=x+dx+sx, fy=y+dy+sy*0.6-40; let px=TIP[0]+(fx-TIP[0])*fall, py=TIP[1]+(fy-TIP[1])*fall; px+=(x+dx-px)*eat; py+=(y+dy-py)*eat;
        px+=Math.sin(lt*1.3+ph)*4; py+=Math.cos(lt*1.1+ph)*4; let a=CL((lt-t0)/0.15);
        if(i===DIE){ const out=rel*(0.55+0.45*u0); px+=sx*0.55*out; py+=(sy*0.4+70)*out; const back=EIO((lt-4.3-u0*0.5)/0.8); px+=(nx+dx*0.72-px)*back; py+=(ny+dy*0.72-py)*back; }
        inkDot(px,py,ir,lt,ph,a); }); });
    g.restore();
    // skin band + needle (not zoomed, stays as the "top" of the picture)
    const sk=E3(lt/0.5); g.save(); g.translate(0,-(1-sk)*260); g.fillStyle='#f2a7b8'; g.shadowColor='rgba(255,150,190,.8)'; g.shadowBlur=50; g.beginPath(); g.moveTo(-20,540); for(let x=-20;x<=1100;x+=40) g.lineTo(x,690+Math.sin(x*.012+lt)*10); g.lineTo(1100,540); g.closePath(); g.fill(); g.shadowBlur=0;
    g.fillStyle='#e58aa2'; for(let x=20;x<1080;x+=92){ g.beginPath(); g.roundRect(x,590,78,70,26); g.fill(); } g.restore();
    const nd=EIO((lt-0.3)/0.5)*(1-EIO((lt-2.3)/0.5)), jab=nd*(1+0.06*Math.sin(lt*38)); if(nd>0){ g.save(); g.translate(700,470-520*(1-jab)); g.rotate(.06); g.fillStyle='#d9dcee'; g.shadowColor='#9fe8ff'; g.shadowBlur=30; g.beginPath(); g.moveTo(-16,-560); g.lineTo(16,-560); g.lineTo(5,300); g.lineTo(-5,300); g.closePath(); g.fill(); g.restore(); }
    label('Ink',810,860,TIP[0]+10,TIP[1]+90,CL((lt-0.9)/0.25)*(1-CL((lt-2.0)/0.3)),'#7fe3ff');
    label('Immune cells swallow it',60,820,CELLS[0][0],CELLS[0][1]-170,CL((lt-1.9)/0.25)*(1-CL((lt-3.2)/0.3)),'#c9a8ff');
    label('A cell dies…',60,1150,CELLS[DIE][0]-70,CELLS[DIE][1]-60,CL((lt-3.3)/0.25)*(1-CL((lt-4.5)/0.2)));
    label('…a new one eats the ink again',330,1200,nx+30,ny-70,CL((lt-4.7)/0.3),'#8af2d8');
    const h1=E3((lt-0.15)/0.4), h2=E3((lt-0.35)/0.4); g.save(); g.textAlign='center'; g.shadowColor='rgba(0,0,0,.5)'; g.shadowBlur=20;
    g.globalAlpha=h1; g.fillStyle='#fff'; g.font='800 84px '+SANS; g.fillText('Your tattoo lives',540,300+(1-h1)*24);
    g.globalAlpha=h2; const wA=g.measureText('inside ').width, wB=g.measureText('immune cells').width, x0=540-(wA+wB)/2; g.textAlign='left'; g.fillText('inside ',x0,400+(1-h2)*24); g.fillStyle='#c9a8ff'; g.shadowColor='rgba(190,140,255,.9)'; g.shadowBlur=30; g.fillText('immune cells',x0+wA,400+(1-h2)*24); g.restore();
  };
})();

// =============== S2 painted-story: how the Hindenburg burned ===============
// Facts (Britannica; Wikipedia): 6 May 1937, landing at Lakehurst, New Jersey; the airship was filled with hydrogen; fire broke out near
// the tail and destroyed the 245 m ship in about half a minute; 62 of the 97 people aboard survived. Own painted silhouette.
(function(){ const g=C2('cv2');
  function strokes(p,n,R,x0,y0,w,h,cols,len,wid,ang,a0,a1){ a0=a0??0.08; a1=a1??0.22; for(let i=0;i<n;i++){ const x=x0+R()*w, y=y0+R()*h, l=len*(0.5+R()), a=(ang||0)+(R()-.5)*0.5;
    p.strokeStyle=cols[Math.floor(R()*cols.length)]; p.globalAlpha=a0+R()*a1; p.lineWidth=wid*(0.5+R()); p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5+(R()-.5)*6,x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } p.globalAlpha=1; }
  const HZ=1480, SWd=1500;
  const sky=off(SWd,1920,(p,w,h)=>{ const R=R0(15); const s=p.createLinearGradient(0,0,0,HZ); s.addColorStop(0,'#0a1026'); s.addColorStop(.45,'#232a52'); s.addColorStop(.8,'#6a4460'); s.addColorStop(1,'#c9744e'); p.fillStyle=s; p.fillRect(0,0,w,HZ+10);
    strokes(p,3000,R,0,0,w,HZ,['#0c1430','#1c2550','#3a3566','#101a3c'],170,34,0);
    strokes(p,900,R,-50,560,w+100,520,['#3b3a5e','#55506f','#2a2c4c','#7a5f74'],150,46,0.05,0.06,0.16);
    strokes(p,400,R,-50,1250,w+100,220,['#e0915c','#c9744e','#f0b070'],160,26,0,0.05,0.14);
    p.fillStyle='#14110f'; p.fillRect(0,HZ,w,h-HZ); strokes(p,1200,R,0,HZ,w,h-HZ,['#241c16','#0c0a09','#3a2a1c'],120,24,0,0.08,0.2); });
  const SW=1100, SH=460;
  const shipPath=(p)=>{ p.beginPath(); p.moveTo(20,230); p.bezierCurveTo(90,60,560,30,880,110); p.bezierCurveTo(1010,150,1080,200,1090,230); p.bezierCurveTo(1080,260,1010,310,880,350); p.bezierCurveTo(560,430,90,400,20,230); p.closePath(); };
  const ship=off(SW,SH,(p)=>{ const R=R0(8); shipPath(p); const gr=p.createLinearGradient(0,60,0,400); gr.addColorStop(0,'#e9edf2'); gr.addColorStop(.45,'#aeb6c2'); gr.addColorStop(1,'#4a5262'); p.fillStyle=gr; p.fill(); p.save(); shipPath(p); p.clip();
    p.strokeStyle='rgba(40,50,70,.35)'; p.lineWidth=3; for(let i=1;i<14;i++){ const x=40+i*76; p.beginPath(); p.moveTo(x,40); p.quadraticCurveTo(x-30,230,x,420); p.stroke(); }
    strokes(p,700,R,0,30,SW,400,['#ffffff','#6f7a8c','#c9d2de','#2f3848'],90,14,0,0.08,0.22); p.restore();
    p.fillStyle='#8d96a6'; [[60,150,-1],[60,310,1]].forEach(([x,y,s])=>{ p.beginPath(); p.moveTo(x,y); p.lineTo(x+170,y+s*-10); p.lineTo(x+120,y+s*90); p.lineTo(x-30,y+s*80); p.closePath(); p.fill(); });
    p.fillStyle='#2a2f3a'; p.beginPath(); p.roundRect(840,360,110,34,10); p.fill(); [[420,392],[620,398]].forEach(([x,y])=>{ p.beginPath(); p.ellipse(x,y,34,16,0,0,7); p.fill(); });
    p.fillStyle='#ffd27a'; for(let x=850;x<940;x+=14) p.fillRect(x,368,8,10); });
  // the burnt frame: dark ribs and girders (shown where the fire has passed)
  const frame=off(SW,SH,(p)=>{ p.save(); shipPath(p); p.clip(); p.fillStyle='rgba(20,10,8,.88)'; p.fillRect(0,0,SW,SH); p.strokeStyle='rgba(232,150,74,.7)'; p.lineWidth=3; for(let i=1;i<20;i++){ const x=30+i*54; p.beginPath(); p.moveTo(x,30); p.quadraticCurveTo(x-24,230,x,430); p.stroke(); }
    p.lineWidth=2.5; for(let k=0;k<7;k++){ const y=90+k*48; p.beginPath(); p.moveTo(30,230+(y-230)*0.4); p.quadraticCurveTo(500,y,1080,230+(y-230)*0.3); p.stroke(); } p.restore(); });
  const FIRE=[1,2,3].map(s=>off(900,900,(p)=>{ const R=R0(5*s); p.filter='blur(18px)'; for(let i=0;i<60;i++){ const x=450+(R()-.5)*520, y=600-R()*500, r=60+R()*130; p.fillStyle=y<240?'rgba(200,60,20,.5)':y<400?'rgba(255,130,30,.7)':'rgba(255,220,120,.9)'; p.beginPath(); p.arc(x,y,r,0,7); p.fill(); }
    p.filter='none'; strokes(p,520,R,120,60,660,600,['#fff3c0','#ff9a2e','#e0481a','#ffd060'],120,22,-1.5,0.12,0.3);
    p.globalCompositeOperation='destination-in'; const m=p.createRadialGradient(450,520,60,450,430,430); m.addColorStop(0,'rgba(0,0,0,1)'); m.addColorStop(.55,'rgba(0,0,0,.85)'); m.addColorStop(1,'rgba(0,0,0,0)'); p.fillStyle=m; p.fillRect(0,0,900,900); p.globalCompositeOperation='source-over'; }));
  const SMOKE=off(900,900,(p)=>{ const R=R0(6); p.filter='blur(22px)'; for(let i=0;i<40;i++){ p.fillStyle='rgba(12,10,16,'+(.35+R()*.3)+')'; p.beginPath(); p.arc(450+(R()-.5)*600,450+(R()-.5)*600,70+R()*130,0,7); p.fill(); } p.filter='none'; strokes(p,300,R,100,100,700,700,['#07060a','#2a2430','#3d3038'],120,30,-1.2,0.08,0.2); });
  const BOIL=[1,2,3].map(s=>off(1080,1920,(p)=>{ const R=R0(s*17); strokes(p,420,R,-50,0,1180,1920,['#9fb6d6','#020812','#f4d79c'],120,22,0.1,0.02,0.05); }));
  const CREW=[]; { const R=R0(44); for(let i=0;i<12;i++) CREW.push([140+i*70+R()*30,HZ+40+(i%4)*46,1+R()*0.5,R()*6]); }
  const SCR=[]; { const R=R0(31); for(let i=0;i<40;i++) SCR.push([R(),R(),3+R()*6,R()<.5?'#ffd27a':'#ff8a3a',R()]); }
  const CAP=[['6 May 1937: time to land.',0.35],['A spark. Then hydrogen.',2.0],['Gone in half a minute.',3.9]];
  SCN[2]=function(lt){ g.clearRect(0,0,1080,1920); const q=Math.floor(lt*8);
    const zf=EIO((lt-3.4)/2.8), zb=1.14-0.14*zf; g.save(); g.translate(540,1000); g.scale(zb,zb); g.translate(-540,-1000);
    g.drawImage(sky,-210,0);
    // mooring mast
    g.save(); g.strokeStyle='#0d0b0a'; g.lineWidth=14; g.beginPath(); g.moveTo(1000,HZ+10); g.lineTo(970,1010); g.moveTo(940,HZ+10); g.lineTo(970,1010); g.stroke(); g.lineWidth=5; for(let y=1060;y<HZ;y+=60){ g.beginPath(); g.moveTo(945+(y-1010)*-.06,y); g.lineTo(995+(y-1010)*.06,y+40); g.stroke(); } g.restore();
    // motion: glide in -> spark at the tail -> fire runs forward, tail drops, the ship settles to the ground
    const sail=E3(lt/1.9), burn=EIO((lt-2.0)/2.4), drop=EIO((lt-2.5)/2.6);
    const cx=250+270*sail+30*CL(lt/6), cy=900+Math.sin(lt*1.3)*6*(1-drop)+360*drop, rot=-0.34*Math.sin(Math.min(1,drop*1.25)*Math.PI*0.62);
    const fl=0.85+0.15*Math.sin(lt*23)+0.1*Math.sin(lt*37);
    // glow of the fire on the clouds and the ground
    if(burn>0){ const gl=g.createRadialGradient(cx-200,cy,40,cx-200,cy,1000); gl.addColorStop(0,'rgba(255,170,70,'+(0.42*burn*fl)+')'); gl.addColorStop(1,'rgba(255,120,40,0)'); g.fillStyle=gl; g.fillRect(-300,0,1700,1920); }
    g.save(); g.translate(cx,cy); g.rotate(rot);
    if(burn>0){ g.globalAlpha=0.9*CL(burn*1.5); const ss=0.5+1.0*burn; g.drawImage(SMOKE,-560-300*burn,-560-520*burn,900*ss,900*ss); g.globalAlpha=1; }
    g.drawImage(ship,-550,-230);
    // burnt part: from the tail (x=0) forward
    if(burn>0){ const bx=SW*CL(burn*1.15); g.save(); g.beginPath(); g.rect(-550,-230,bx,SH); g.clip(); g.globalAlpha=CL(burn*3); g.drawImage(frame,-550,-230); g.restore(); }
    // spark
    const sp=CL((lt-1.85)/0.12)*(1-CL((lt-2.15)/0.25)); if(sp>0){ g.save(); g.globalAlpha=sp; g.fillStyle='#fff6d0'; g.shadowColor='#ffd27a'; g.shadowBlur=60; g.beginPath(); for(let i=0;i<10;i++){ const an=i/10*6.283, r=i%2?16:70*sp; g.lineTo(-470+Math.cos(an)*r,-90+Math.sin(an)*r); } g.closePath(); g.fill(); g.restore(); }
    // flames: several patches following the burn front
    if(burn>0){ g.globalCompositeOperation='screen'; for(let k=0;k<4;k++){ const f=CL(burn*1.3-k*0.18); if(f<=0) continue; const s=(0.45+0.6*f)*(0.92+0.08*Math.sin(lt*19+k*2)); const fx=-520+k*250*CL(burn*1.2), w=700*s; g.globalAlpha=0.8*CL(f*2)*fl; g.drawImage(FIRE[(q+k)%3],fx-w*0.4,-120-w*0.78,w,w); } g.globalAlpha=1; g.globalCompositeOperation='source-over'; }
    g.restore();
    // burning scraps falling
    if(burn>0.1) SCR.forEach(([u,v,r,c,ph])=>{ const a=((lt*0.35+ph)%1); g.globalAlpha=(1-a)*CL(burn*2); g.fillStyle=c; g.beginPath(); g.arc(cx-560+u*900*burn+Math.sin(lt*2+ph*9)*14,cy-40+a*(HZ-cy+120)+v*60,r,0,7); g.fill(); }); g.globalAlpha=1;
    // ground crew: walk in calmly, then run away from the fire
    CREW.forEach(([x,y,s,ph],i)=>{ const run=EIO((lt-2.2)/1.0), xx=x+run*(260+i*22)*(0.5+0.5*CL((lt-2.2)/3.5)), stp=Math.sin(lt*(4+10*run)+ph); g.save(); g.translate(xx,y); g.scale(s,s); g.fillStyle='#070605'; g.beginPath(); g.arc(4*run,-46,9,0,7); g.fill(); g.lineCap='round'; g.strokeStyle='#070605'; g.lineWidth=9; g.beginPath(); g.moveTo(3*run,-36); g.lineTo(0,-8); g.lineTo(-12*stp,16); g.moveTo(0,-8); g.lineTo(12*stp,16); g.moveTo(2,-28); g.lineTo(16*stp,-18); g.stroke();
      if(burn>0){ g.strokeStyle='rgba(255,170,80,'+(0.85*burn)+')'; g.lineWidth=2.5; g.beginPath(); g.arc(4*run,-46,9,Math.PI*.8,Math.PI*1.6); g.stroke(); } g.restore(); });
    g.restore();
    CAP.forEach(([t,t0],i)=>{ const a=EBK((lt-t0)/0.45); if(lt<t0) return; g.save(); g.globalAlpha=CL((lt-t0)/0.15); g.font='italic 500 '+(i===2?80:72)+'px '+SERIF; const w=g.measureText(t).width+64, y=262+i*112;
      g.translate(60+(1-a)*-200,y); g.rotate([-0.02,0.015,-0.01][i]); tornPath(g,0,0,w,96,80+i,6); g.fillStyle='#f3e6c8'; g.shadowColor='rgba(0,5,15,.6)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
      g.strokeStyle='rgba(150,100,50,.35)'; g.lineWidth=3; g.stroke(); g.fillStyle=i===2?'#8a1c10':'#2c1c0e'; g.fillText(t,32,70); g.restore(); });
    g.drawImage(BOIL[q%3],0,0); g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,1000,380,540,1000,1300); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(2,6,16,.6)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();
