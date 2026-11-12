// ---------- styles28: the three explainer LOOKS of styles19/20 on new topics, drawn in 2D canvas by Claude Fable 5.2 (own designs; no channel logos,
// wordmarks, mascots or characters). Real coastlines: Natural Earth (public domain) via world-atlas countries-50m, projected with d3-geo.
// S0 /paper-collage = full-screen photo-collage look (torn printed map, cut-out with white edge, big serif type, orange label, marker arrows)
// S1 /flat-science  = flat vector look with glow, depth and tiny labels
// S2 /painted-story = hand-painted look with brush texture and "boil"
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

// =============== S0 paper-collage: why planes don't fly straight ===============
// Facts: the shortest path between two points on a sphere is a great circle. On a flat (Mercator) map it looks curved, and the straight
// line on that map is LONGER. Los Angeles (LAX 33.9416 N, 118.4085 W) -> London (LHR 51.4700 N, 0.4543 W): the great circle bends north
// over Canada and Greenland. On a globe centred on the route it is a straight line.
(function(){ const g=C2('cv0');
  const W=window.WORLD50, LAND=topojson.merge(W,W.objects.countries.geometries), BORD=topojson.mesh(W,W.objects.countries,(a,b)=>a!==b);
  const LAX=[-118.4085,33.9416], LHR=[-0.4543,51.47], IPg=d3.geoInterpolate(LAX,LHR);
  const MW=1180, MH=720;
  const proj=d3.geoMercator().fitExtent([[150,50],[MW-210,MH-50]],{type:'MultiPoint',coordinates:[[-119,26],[1,26],[-119,68],[1,68]]});
  const GC=[]; for(let i=0;i<=120;i++) GC.push(proj(IPg(i/120)));
  const A=proj(LAX), B=proj(LHR);
  const paper=off(1080,1920,(p,w,h)=>{ p.fillStyle='#ece3cf'; p.fillRect(0,0,w,h); const R=R0(3); p.filter='blur(30px)'; for(let i=0;i<40;i++){ p.fillStyle='rgba('+(R()<.5?'255,250,235':'205,190,160')+','+(0.15+R()*0.25)+')'; p.beginPath(); p.arc(R()*w,R()*h,80+R()*220,0,7); p.fill(); }
    p.filter='none'; for(let i=0;i<2600;i++){ p.strokeStyle='rgba(120,100,70,'+(R()*.10)+')'; p.lineWidth=1; const x=R()*w, y=R()*h, a=R()*6.28, l=6+R()*24; p.beginPath(); p.moveTo(x,y); p.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } });
  // the printed map (torn edge, halftone ocean, sandy land)
  const map=off(MW,MH,(p)=>{ tornPath(p,8,8,MW-16,MH-16,41,14); p.save(); p.clip();
    const oc=p.createLinearGradient(0,0,0,MH); oc.addColorStop(0,'#a9c9cf'); oc.addColorStop(1,'#8fb5bf'); p.fillStyle=oc; p.fillRect(0,0,MW,MH);
    for(let y=0;y<MH;y+=9) for(let x=(y/9%2)*4.5;x<MW;x+=9){ p.fillStyle='rgba(40,80,95,.22)'; p.beginPath(); p.arc(x,y,1.6,0,7); p.fill(); }
    const path=d3.geoPath(proj,p); p.strokeStyle='rgba(60,90,105,.35)'; p.lineWidth=1.5; p.setLineDash([6,6]); p.beginPath(); path(d3.geoGraticule().step([15,15])()); p.stroke(); p.setLineDash([]);
    p.shadowColor='rgba(40,30,15,.35)'; p.shadowBlur=10; p.shadowOffsetY=4; p.fillStyle='#efe2c0'; p.beginPath(); path(LAND); p.fill(); p.shadowColor='transparent';
    p.save(); p.beginPath(); path(LAND); p.clip(); for(let y=0;y<MH;y+=8) for(let x=(y/8%2)*4;x<MW;x+=8){ p.fillStyle='rgba(150,120,70,.16)'; p.beginPath(); p.arc(x,y,1.4,0,7); p.fill(); } p.restore();
    p.strokeStyle='rgba(120,95,60,.45)'; p.lineWidth=1.2; p.beginPath(); path(BORD); p.stroke(); p.strokeStyle='#6f5a3e'; p.lineWidth=2.2; p.beginPath(); path(LAND); p.stroke();
    const R=R0(9); for(let i=0;i<24000;i++){ p.fillStyle=R()<.5?'rgba(40,30,15,'+(R()*.12)+')':'rgba(255,250,235,'+(R()*.16)+')'; p.fillRect(R()*MW,R()*MH,2,2); }
    // fold creases
    p.strokeStyle='rgba(255,255,255,.35)'; p.lineWidth=3; p.beginPath(); p.moveTo(MW*0.5,0); p.lineTo(MW*0.5,MH); p.stroke(); p.strokeStyle='rgba(60,40,20,.18)'; p.lineWidth=2; p.beginPath(); p.moveTo(MW*0.5+3,0); p.lineTo(MW*0.5+3,MH); p.stroke();
    p.restore(); });
  const mapS=off(MW+60,MH+80,(p)=>{ p.shadowColor='rgba(30,20,10,.45)'; p.shadowBlur=30; p.shadowOffsetY=18; p.drawImage(map,30,20); });
  // a top-down airliner cut-out (nose = +x)
  const jet=sticker(off(240,240,(p)=>{ p.translate(120,120); const poly=(a)=>{ p.beginPath(); a.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y)); p.closePath(); };
    let gr=p.createLinearGradient(0,-100,0,100); gr.addColorStop(0,'#cdd5dc'); gr.addColorStop(.5,'#ffffff'); gr.addColorStop(1,'#aeb8c2');
    [1,-1].forEach(s=>{ poly([[18,8*s],[-22,100*s],[-44,100*s],[-24,8*s]]); p.fillStyle=gr; p.fill(); poly([[-78,6*s],[-98,40*s],[-110,40*s],[-98,5*s]]); p.fill();
      p.fillStyle='#8b97a2'; p.beginPath(); p.ellipse(-2,46*s,18,8,0,0,7); p.fill(); });
    p.beginPath(); p.moveTo(104,0); p.quadraticCurveTo(100,-14,80,-14); p.lineTo(-96,-11); p.quadraticCurveTo(-112,-8,-114,0); p.quadraticCurveTo(-112,8,-96,11); p.lineTo(80,14); p.quadraticCurveTo(100,14,104,0); p.closePath();
    gr=p.createLinearGradient(0,-14,0,14); gr.addColorStop(0,'#ffffff'); gr.addColorStop(1,'#b9c3cc'); p.fillStyle=gr; p.fill();
    p.fillStyle='#f2561f'; p.fillRect(-112,-3,58,6); p.fillStyle='#26343f'; p.beginPath(); p.ellipse(88,0,7,9,0,0,7); p.fill(); }),9);
  // the globe cut-out: orthographic, centred on the route, so the same route is a straight line
  const mid=IPg(0.5), gproj=d3.geoOrthographic().rotate([-mid[0],-mid[1]]).translate([170,170]).scale(160).clipAngle(90);
  const ga=gproj(LAX), gb=gproj(LHR), gAng=Math.atan2(gb[1]-ga[1],gb[0]-ga[0]);
  const globe=sticker(off(340,340,(p)=>{ const path=d3.geoPath(gproj,p); const gr=p.createRadialGradient(120,110,20,170,170,165); gr.addColorStop(0,'#bcd8dc'); gr.addColorStop(1,'#6f99a8'); p.fillStyle=gr; p.beginPath(); path({type:'Sphere'}); p.fill();
    p.save(); p.beginPath(); path({type:'Sphere'}); p.clip(); p.fillStyle='#efe2c0'; p.beginPath(); path(LAND); p.fill(); p.strokeStyle='#6f5a3e'; p.lineWidth=1.2; p.beginPath(); path(LAND); p.stroke();
      p.strokeStyle='rgba(40,70,85,.3)'; p.lineWidth=1; p.beginPath(); path(d3.geoGraticule().step([20,20])()); p.stroke();
      for(let y=0;y<340;y+=7) for(let x=(y/7%2)*3.5;x<340;x+=7){ const d=CL((Math.hypot(x-200,y-210)-60)/120); if(d<=0) continue; p.fillStyle='rgba(20,40,60,.30)'; p.beginPath(); p.arc(x,y,0.4+2.2*d,0,7); p.fill(); } p.restore(); }),10);
  const TAGS=[['Straight line?','on a flat map it’s longer',60,1250,-0.03,0],['The curve','is the real shortest path',60,1400,0.02,0]];
  SCN[0]=function(lt){ g.clearRect(0,0,1080,1920); const z=1+0.045*EIO(lt/6.5), q=Math.floor(lt*12)/12;
    g.save(); g.translate(540,960); g.scale(z,z); g.translate(-540,-960);
    g.drawImage(paper,0,0);
    // headline: small serif line + huge italic word behind the map
    const t1=E3((lt-0.1)/0.4); g.save(); g.globalAlpha=t1*0.95; g.fillStyle='#2f5f86'; g.font="500 100px "+SERIF; g.fillText('Why planes',64,300+(1-t1)*30); g.restore();
    const t2=E3((lt-0.3)/0.45); g.save(); g.globalAlpha=CL(t2*1.4); g.translate(470,600); g.scale(1.22-0.22*t2,1.22-0.22*t2); g.fillStyle='#27425a'; g.font="italic 400 300px "+DISP; g.textAlign='center'; g.fillText('curve',0,0); g.restore();
    // the map slides up into place with a slight wobble (stop-motion 12 fps)
    const mu=E3((lt-0.0)/0.8), mr=-0.03+0.003*Math.sin(q*2.3);
    g.save(); g.translate(540,960+(1-mu)*1100); g.rotate(mr); g.translate(-MW/2,-MH/2);
    g.drawImage(mapS,-30,-20);
    // the straight line on the map (looks shortest) -> then crossed out
    const sf=EIO((lt-1.0)/0.6); if(sf>0){ const dash=[22,16]; marker(g,[A,[(A[0]+B[0])/2,(A[1]+B[1])/2],B],sf,7,'#3a4652',dash);
      const xo=EIO((lt-3.2)/0.35); if(xo>0){ const m=[(A[0]+B[0])/2,(A[1]+B[1])/2]; g.save(); g.strokeStyle='#d6331a'; g.lineWidth=11; g.lineCap='round'; g.globalAlpha=0.92; g.beginPath(); g.moveTo(m[0]-34,m[1]-34); g.lineTo(m[0]-34+68*CL(xo*2),m[1]-34+68*CL(xo*2)); if(xo>0.5){ g.moveTo(m[0]+34,m[1]-34); g.lineTo(m[0]+34-68*CL(xo*2-1),m[1]-34+68*CL(xo*2-1)); } g.stroke(); g.restore(); } }
    // the great circle: orange marker, the jet flies along it
    const pf=EIO((lt-1.6)/2.2);
    if(pf>0){ const n=Math.max(2,Math.round(pf*120)); const pts=GC.slice(0,n+1); g.save(); g.strokeStyle='#f0541c'; g.lineWidth=10; g.lineCap='round'; g.lineJoin='round'; g.shadowColor='rgba(120,40,10,.35)'; g.shadowBlur=8; g.beginPath(); pts.forEach((pp,i)=>i?g.lineTo(pp[0],pp[1]):g.moveTo(pp[0],pp[1])); g.stroke(); g.restore(); }
    [[A,'Los Angeles',-1],[B,'London',1]].forEach(([P,nm,s],i)=>{ const a=EBK((lt-0.7-i*0.15)/0.4); if(a<=0) return; g.save(); g.translate(P[0],P[1]); g.scale(a,a); g.fillStyle='#f0541c'; g.beginPath(); g.arc(0,0,15,0,7); g.fill(); g.strokeStyle='#fff'; g.lineWidth=5; g.stroke();
      g.font="italic 500 44px "+SERIF; const w=g.measureText(nm).width; const x=s<0?-w/2+40:-w-70, y=s<0?62:84; g.fillStyle='rgba(246,241,228,.92)'; g.fillRect(x-12,y-38,w+24,52); g.fillStyle='#17222b'; g.fillText(nm,x,y); g.restore(); });
    if(pf>0){ const k=Math.min(119,Math.floor(pf*120)), u=pf*120-k, P0=GC[k], P1=GC[k+1], x=P0[0]+(P1[0]-P0[0])*u, y=P0[1]+(P1[1]-P0[1])*u, an=Math.atan2(P1[1]-P0[1],P1[0]-P0[0]);
      const s=0.9+0.12*Math.sin(Math.PI*pf); g.save(); g.translate(x,y-10); g.rotate(an); g.scale(s,s); g.drawImage(jet,-120-jet.ox,-120-jet.oy); g.restore(); }
    g.restore();
    // orange torn label
    const t3=E3((lt-0.6)/0.4); g.save(); g.translate(-520*(1-t3),0); g.rotate(-0.014); tornPath(g,-20,640,500,92,31,5); g.fillStyle='#f0541c'; g.shadowColor='rgba(30,20,10,.35)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
    g.fillStyle='#fff'; g.font="500 70px "+SERIF; g.fillText('on purpose',58,708); g.restore();
    // tags + the globe
    const MT=(P)=>{ const c=Math.cos(mr), s2=Math.sin(mr), x=P[0]-MW/2, y=P[1]-MH/2; return [540+x*c-y*s2, 960+x*s2+y*c]; };
    [[2.6,TAGS[0],MT([(A[0]+B[0])/2+60,(A[1]+B[1])/2+8])],[3.6,TAGS[1],MT(GC[60])]].forEach(([t0,T,tgt],i)=>{ const cf=EIO((lt-t0-0.25)/0.4); if(cf>0){ const sx=T[2]+420, sy=T[3]; const e=marker(g,i?[[sx,sy],[610,1235],[tgt[0]+20,(1235+tgt[1])/2],[tgt[0],tgt[1]+14]]:[[sx,sy],[(sx+tgt[0])/2+40,(sy+tgt[1])/2+30],[tgt[0],tgt[1]+14]],cf,6,'#23313d'); if(cf>0.97) arrowHead(g,e[0],e[1],e[2],22,6,'#23313d'); } });
    paperTag(g,lt,2.6,TAGS[0][2],TAGS[0][3],TAGS[0][4],TAGS[0][0],TAGS[0][1],50,0);
    paperTag(g,lt,3.6,TAGS[1][2],TAGS[1][3],TAGS[1][4],TAGS[1][0],TAGS[1][1],51,0);
    const gl=EBK((lt-4.5)/0.5); if(lt>4.5){ g.save(); g.translate(840,1400); g.rotate(0.06*Math.sin(q)); g.scale(gl*0.84,gl*0.84); g.rotate(-gAng); g.drawImage(globe,-170-globe.ox,-170-globe.oy);
        const lf=EIO((lt-4.9)/0.6); if(lf>0){ g.strokeStyle='#f0541c'; g.lineWidth=7; g.lineCap='round'; g.beginPath(); g.moveTo(ga[0]-170,ga[1]-170); g.lineTo(ga[0]-170+(gb[0]-ga[0])*lf,ga[1]-170+(gb[1]-ga[1])*lf); g.stroke(); [ga,gb].forEach(P=>{ g.fillStyle='#f0541c'; g.beginPath(); g.arc(P[0]-170,P[1]-170,9,0,7); g.fill(); }); }
        g.restore();
      const hw=EIO((lt-5.4)/0.4); if(hw>0){ g.save(); g.globalAlpha=hw; g.translate(1000+120*(1-hw),1215); g.rotate(-0.05); g.fillStyle='#d6331a'; g.font="italic 500 50px "+SERIF; g.textAlign='right'; g.fillText('on a globe: straight',0,0); g.restore(); } }
    g.restore();
    g.globalCompositeOperation='multiply'; g.fillStyle='rgba(244,236,214,.45)'; g.fillRect(0,0,1080,1920); g.globalCompositeOperation='source-over';
    g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,900,500,540,900,1250); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(30,25,15,.30)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();

// =============== S1 flat-science: how sleep cleans your brain ===============
// Facts (Xie et al., Science 2013, in mice; Fultz et al., Science 2019, waves of cerebrospinal fluid in human deep sleep): during sleep the
// space between brain cells widens and fluid flows through the brain much faster, washing out waste proteins built up while awake.
(function(){ const g=C2('cv1');
  const bg=off(1080,1920,(p,w,h)=>{ const gr=p.createRadialGradient(w*.5,h*.55,60,w*.5,h*.5,1300); gr.addColorStop(0,'#2a2f86'); gr.addColorStop(.5,'#141a52'); gr.addColorStop(1,'#060821'); p.fillStyle=gr; p.fillRect(0,0,w,h);
    p.filter='blur(90px)'; [[180,600,260,'rgba(120,90,255,.30)'],[950,1400,300,'rgba(40,190,255,.22)'],[880,520,220,'rgba(255,120,200,.14)']].forEach(([x,y,r,c])=>{ p.fillStyle=c; p.beginPath(); p.arc(x,y,r,0,7); p.fill(); }); });
  const MOON=off(160,160,(p)=>{ p.fillStyle='#ffe7a6'; p.beginPath(); p.arc(80,80,58,0,7); p.fill(); p.globalCompositeOperation='destination-out'; p.beginPath(); p.arc(106,62,50,0,7); p.fill(); });
  const R=R0(23), DOTS=[]; for(let i=0;i<70;i++) DOTS.push([R()*1080,R()*1920,2+R()*7,R()*.45+.15,R()<.5?'#8fb4ff':'#b99bff',R()*6]);
  // brain cells (neurons): body + dendrites
  const CELLS=[[250,850,150,1],[650,780,135,2],[960,1010,140,3],[440,1120,150,4],[820,1330,145,5],[180,1390,140,6],[560,1480,120,7]];
  const DEN=CELLS.map(([x,y,r,s])=>{ const Rr=R0(s*31), a=[]; for(let i=0;i<5;i++){ const an=Rr()*6.283; a.push([an,0.6+Rr()*0.7,(Rr()-.5)*1.2]); } return a; });
  // fluid channels between the cells (top-left -> bottom-right)
  const CH=[[[ -80,640],[160,700],[450,930],[620,980],[760,1150],[1000,1220],[1180,1300]], [[-80,1010],[150,1070],[300,1250],[470,1330],[650,1290],[700,1500],[860,1610],[1180,1720]], [[460,560],[460,700],[820,890],[800,1100],[1000,1200],[1180,1150]]];
  function cr(pts,t){ const T=t*(pts.length-1), k=Math.min(pts.length-2,Math.floor(T)), u=T-k; const a=pts[Math.max(0,k-1)],b=pts[k],c=pts[k+1],d=pts[Math.min(pts.length-1,k+2)];
    const f=(p0,p1,p2,p3)=>0.5*((2*p1)+(-p0+p2)*u+(2*p0-5*p1+4*p2-p3)*u*u+(-p0+3*p1-3*p2+p3)*u*u*u); return [f(a[0],b[0],c[0],d[0]),f(a[1],b[1],c[1],d[1])]; }
  const WASTE=[]; { const Rw=R0(5); CH.forEach((c,ci)=>{ for(let i=0;i<6;i++) WASTE.push([ci,0.14+i*0.13+Rw()*0.04,(Rw()-.5)*30,(Rw()-.5)*30,20+Rw()*14,Rw()*6]); }); }
  function label(txt,x,y,tx,ty,a){ if(a<=0) return; g.save(); g.globalAlpha=a; g.font='800 40px '+SANS; const w=g.measureText(txt).width+52;
    g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=4; g.beginPath(); g.moveTo(x+w/2,y); g.lineTo(tx,ty); g.stroke(); g.fillStyle='#fff'; g.beginPath(); g.arc(tx,ty,9,0,7); g.fill();
    g.fillStyle='rgba(9,12,44,.86)'; g.beginPath(); g.roundRect(x,y-36,w,72,36); g.fill(); g.strokeStyle='rgba(255,255,255,.25)'; g.lineWidth=2; g.stroke(); g.fillStyle='#fff'; g.fillText(txt,x+26,y+14); g.restore(); }
  function spark(x,y,s,a){ g.save(); g.globalAlpha=a; g.translate(x,y); g.fillStyle='#fff'; g.shadowColor='#9fe8ff'; g.shadowBlur=22; g.beginPath(); for(let i=0;i<8;i++){ const an=i/8*6.283, r=i%2?s*0.22:s; g.lineTo(Math.cos(an)*r,Math.sin(an)*r); } g.closePath(); g.fill(); g.restore(); }
  SCN[1]=function(lt){ g.clearRect(0,0,1080,1920); g.drawImage(bg,0,0);
    DOTS.forEach(([x,y,r,a,c,ph])=>{ const yy=(y-lt*(8+r*4)+1920)%1920; g.globalAlpha=a*(0.6+0.4*Math.sin(lt*2+ph)); g.fillStyle=c; g.beginPath(); g.arc(x+Math.sin(lt*.5+ph)*12,yy,r,0,7); g.fill(); }); g.globalAlpha=1;
    const shrink=EIO((lt-1.5)/1.1), flow=CL((lt-2.3)/1.6), clean=EIO((lt-4.4)/1.0);
    const z=1+0.10*EIO((lt-0.6)/5.5); g.save(); g.translate(540,1120); g.scale(z,z); g.translate(-540,-1120);
    // fluid: glowing channels that open up and flow
    CH.forEach((c,ci)=>{ const wid=10+46*shrink; const head=CL(flow*1.25-ci*0.12); if(head<=0 && shrink<=0) return;
      g.save(); g.lineCap='round'; g.lineJoin='round';
      g.strokeStyle='rgba(60,200,255,'+(0.10+0.25*shrink)+')'; g.lineWidth=wid*1.8; g.shadowColor='rgba(80,210,255,.8)'; g.shadowBlur=40*shrink; g.beginPath(); for(let i=0;i<=60;i++){ const P=cr(c,i/60); i?g.lineTo(P[0],P[1]):g.moveTo(P[0],P[1]); } g.stroke(); g.shadowBlur=0;
      if(head>0){ g.strokeStyle='rgba(120,230,255,.85)'; g.lineWidth=wid*0.7; g.beginPath(); const n=Math.round(60*head); for(let i=0;i<=n;i++){ const P=cr(c,i/60); i?g.lineTo(P[0],P[1]):g.moveTo(P[0],P[1]); } g.stroke();
        for(let k=0;k<14;k++){ const u=((lt*0.22+k/14)%1); if(u>head) continue; const P=cr(c,u); g.fillStyle='rgba(225,250,255,.9)'; g.shadowColor='#7fe3ff'; g.shadowBlur=16; g.beginPath(); g.arc(P[0],P[1],5+(k%3)*2,0,7); g.fill(); g.shadowBlur=0; } }
      g.restore(); });
    // brain cells: they shrink a little and the gaps open
    CELLS.forEach(([x,y,r,s],i)=>{ const ap=E3((lt-0.05-i*0.06)/0.5); if(ap<=0) return; const rr=r*(1-0.14*shrink)*(0.6+0.4*ap), lum=0.78+0.22*clean; g.save(); g.globalAlpha=ap;
      const col=(a,b,c)=>'rgb('+Math.min(255,a*lum|0)+','+Math.min(255,b*lum|0)+','+Math.min(255,c*lum|0)+')';
      g.strokeStyle=col(150,112,236); g.lineCap='round'; DEN[i].forEach(([an,l,bend])=>{ const L=rr*(1.0+l), x1=x+Math.cos(an)*rr*0.8, y1=y+Math.sin(an)*rr*0.8, x2=x+Math.cos(an)*L+Math.cos(an+1.57)*bend*40, y2=y+Math.sin(an)*L+Math.sin(an+1.57)*bend*40;
        g.lineWidth=rr*0.22; g.beginPath(); g.moveTo(x1,y1); g.quadraticCurveTo(x+Math.cos(an+bend*0.4)*L*0.75,y+Math.sin(an+bend*0.4)*L*0.75,x2,y2); g.stroke(); g.lineWidth=rr*0.1; g.beginPath(); g.moveTo(x2,y2); g.lineTo(x2+Math.cos(an+0.6)*rr*0.35,y2+Math.sin(an+0.6)*rr*0.35); g.moveTo(x2,y2); g.lineTo(x2+Math.cos(an-0.6)*rr*0.35,y2+Math.sin(an-0.6)*rr*0.35); g.stroke(); });
      g.shadowColor='rgba(190,140,255,'+(0.35+0.5*clean)+')'; g.shadowBlur=40+40*clean; blobPath(g,x,y,rr,s,0.03,90,lt); g.fillStyle=col(168,124,246); g.fill(); g.shadowBlur=0;
      blobPath(g,x+rr*0.06,y+rr*0.08,rr*0.92,s,0.03,90,lt); g.fillStyle=col(140,98,226); g.fill(); blobPath(g,x-rr*0.05,y-rr*0.06,rr*0.84,s,0.03,90,lt); g.fillStyle=col(186,146,255); g.fill();
      blobPath(g,x+rr*0.1,y+rr*0.05,rr*0.34,s+3,0.06,60,lt); g.fillStyle=col(112,72,206); g.fill(); g.fillStyle='rgba(255,255,255,.28)'; g.beginPath(); g.ellipse(x-rr*0.35,y-rr*0.42,rr*0.22,rr*0.1,-0.6,0,7); g.fill();
      g.restore(); });
    // waste: dull clumps in the gaps; the flow carries them away
    WASTE.forEach(([ci,u0,dx,dy,r,ph])=>{ const c=CH[ci], head=CL(flow*1.25-ci*0.12), go=head>u0?CL((flow*1.25-ci*0.12-u0)/0.35):0; const u=u0+(1-u0)*EIO(go)*0.9;
      const P=cr(c,u), x=P[0]+dx*(1-go)+Math.sin(lt*1.4+ph)*4, y=P[1]+dy*(1-go)+Math.cos(lt*1.2+ph)*4, a=CL(lt/0.5)*(1-CL((go-0.55)/0.4)); if(a<=0) return;
      g.save(); g.globalAlpha=a; g.translate(x,y); g.rotate(ph+lt*0.3*go); blobPath(g,0,0,r,7+ci,0.25,24,lt*0.5); g.fillStyle='#7a6a45'; g.shadowColor='rgba(255,200,90,.35)'; g.shadowBlur=14; g.fill(); g.shadowBlur=0; blobPath(g,-r*0.15,-r*0.2,r*0.6,9+ci,0.25,20,lt*0.5); g.fillStyle='#c2a663'; g.fill(); g.restore(); });
    if(clean>0) for(let i=0;i<7;i++){ const C=CELLS[i]; spark(C[0]+C[2]*0.7,C[1]-C[2]*0.7,16+(i%3)*8,clean*(0.5+0.5*Math.sin(lt*6+i*2))); }
    label('Brain cells',70,640,CELLS[0][0]+20,CELLS[0][1]-110,CL((lt-0.6)/0.25)*(1-CL((lt-2.6)/0.3)));
    label('Waste from the day',470,640,cr(CH[2],WASTE[13][1])[0],cr(CH[2],WASTE[13][1])[1]-20,CL((lt-1.0)/0.25)*(1-CL((lt-2.8)/0.3)));
    label('Gaps open up',600,700,cr(CH[2],0.45)[0],cr(CH[2],0.45)[1],CL((lt-2.9)/0.3)*(1-CL((lt-4.2)/0.3)));
    label('Fluid washes it out',90,1430,cr(CH[1],0.3)[0],cr(CH[1],0.3)[1]+20,CL((lt-3.0)/0.3));
    g.restore();
    // night: moon + z's
    { const ma=EBK((lt-0.4)/0.5); if(lt>0.4){ g.save(); g.translate(930,660); g.scale(ma,ma); g.shadowColor='rgba(255,230,160,.8)'; g.shadowBlur=50; g.drawImage(MOON,-80,-80); g.shadowBlur=0; g.restore();
      g.save(); for(let i=0;i<3;i++){ const ph=(lt*0.5+i/3)%1; g.globalAlpha=Math.sin(ph*Math.PI)*ma; g.fillStyle='#dfe8ff'; g.font='800 '+(34+i*10)+'px '+SANS; g.fillText('z',830-i*34-ph*20,660-ph*90-i*14); } g.restore(); } }
    const h1=E3((lt-0.15)/0.4), h2=E3((lt-0.35)/0.4); g.save(); g.textAlign='center'; g.shadowColor='rgba(0,0,0,.5)'; g.shadowBlur=20;
    g.globalAlpha=h1; g.fillStyle='#fff'; g.font='800 84px '+SANS; g.fillText('While you sleep,',540,320+(1-h1)*24);
    g.globalAlpha=h2; const wA=g.measureText('your brain ').width, wB=g.measureText('cleans up').width, x0=540-(wA+wB)/2; g.textAlign='left'; g.fillText('your brain ',x0,420+(1-h2)*24); g.fillStyle='#7fe3ff'; g.shadowColor='rgba(80,210,255,.8)'; g.shadowBlur=30; g.fillText('cleans up',x0+wA,420+(1-h2)*24); g.restore();
  };
})();

// =============== S2 painted-story: how the Titanic sank ===============
// Facts (history): RMS Titanic hit an iceberg at 11:40 pm on 14 April 1912 on a calm, moonless night; water flooded the bow, the ship
// broke in two and sank at about 2:20 am, 2 h 40 min later. The ship drawing is our own simple painted silhouette.
(function(){ const g=C2('cv2');
  function strokes(p,n,R,x0,y0,w,h,cols,len,wid,ang,a0,a1){ a0=a0??0.08; a1=a1??0.22; for(let i=0;i<n;i++){ const x=x0+R()*w, y=y0+R()*h, l=len*(0.5+R()), a=(ang||0)+(R()-.5)*0.5;
    p.strokeStyle=cols[Math.floor(R()*cols.length)]; p.globalAlpha=a0+R()*a1; p.lineWidth=wid*(0.5+R()); p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5+(R()-.5)*6,x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } p.globalAlpha=1; }
  const W=1500, H=2300, HZ=980;
  const skyC=off(W,H,(p)=>{ const R=R0(15); const sky=p.createLinearGradient(0,0,0,HZ); sky.addColorStop(0,'#050a18'); sky.addColorStop(.6,'#0c1830'); sky.addColorStop(.9,'#22385a'); sky.addColorStop(1,'#33507a'); p.fillStyle=sky; p.fillRect(0,0,W,HZ+10);
    strokes(p,2400,R,0,0,W,HZ,['#0a1428','#101f3a','#060d1e','#16294a'],170,34,0);
    // a faint painted milky way band
    p.save(); p.translate(W*0.5,HZ*0.45); p.rotate(-0.5); strokes(p,500,R,-900,-90,1800,180,['#3a4c74','#55688f','#2b3b60'],140,30,0,0.05,0.12); p.restore();
    for(let i=0;i<70000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.08)+')':'rgba(220,230,255,'+(R()*.05)+')'; p.fillRect(R()*W,R()*HZ,2,2); } });
  const tex=off(256,256,(p)=>{ const R=R0(2); strokes(p,260,R,-20,0,296,256,['#05121c','#4a6a86','#0d2333'],80,10,0.03,0.05,0.16); });
  const BOIL=[1,2,3].map(s=>off(1080,1920,(p)=>{ const R=R0(s*17); strokes(p,420,R,-50,0,1180,1920,['#9fb6d6','#020812','#f4d79c'],120,22,0.1,0.02,0.05); }));
  const R=R0(41), STARS=[]; for(let i=0;i<260;i++) STARS.push([R()*W,R()*(HZ-60),0.8+R()*R()*3.4,R()*6]);
  // the liner (own painted silhouette): stern left, bow right; waterline y=300 in the image
  const SW=900, SH=380, WLI=300;
  const shipImg=off(SW,SH,(p)=>{ const Rs=R0(8);
    const hull=()=>{ p.beginPath(); p.moveTo(30,190); p.lineTo(872,186); p.quadraticCurveTo(866,280,846,352); p.lineTo(110,356); p.quadraticCurveTo(46,330,26,250); p.quadraticCurveTo(18,214,30,190); p.closePath(); };
    // masts + wires
    p.strokeStyle='#2a2a2c'; p.lineWidth=5; p.beginPath(); p.moveTo(120,190); p.lineTo(126,-6); p.moveTo(800,186); p.lineTo(806,-14); p.stroke(); p.lineWidth=1.5; p.beginPath(); p.moveTo(126,4); p.lineTo(806,-4); p.stroke();
    // funnels (buff with black tops), raked back
    [250,370,490,610].forEach((fx,i)=>{ p.save(); p.translate(fx,128); p.transform(1,0,-0.12,1,0,0); p.fillStyle='#c79d55'; p.fillRect(-24,-108,48,112); p.fillStyle='#141414'; p.fillRect(-24,-108,48,24); p.fillStyle='rgba(255,230,170,.18)'; p.fillRect(-24,-80,12,84); p.restore(); });
    // superstructure
    p.fillStyle='#e8e2d2'; p.fillRect(150,140,620,52); p.fillStyle='#d9d1bd'; p.fillRect(210,112,520,30); p.fillStyle='#f0ebdd'; p.fillRect(150,140,620,6);
    for(let x=160;x<760;x+=14){ if(Rs()<0.8){ p.fillStyle='#ffd27a'; p.fillRect(x,156,7,10); } if(Rs()<0.6&&x>215&&x<725){ p.fillStyle='#ffcf70'; p.fillRect(x,121,6,8); } }
    // hull: black above the waterline, red below
    p.save(); hull(); p.clip(); p.fillStyle='#121417'; p.fillRect(0,180,SW,WLI-180+6); p.fillStyle='#6e2419'; p.fillRect(0,WLI+6,SW,200); p.fillStyle='#e6e0d0'; p.fillRect(0,186,SW,5);
    for(let row=0;row<3;row++) for(let x=70;x<850;x+=13){ if(Rs()<0.72){ const yy=212+row*26; p.fillStyle=Rs()<0.15?'#ffe9b0':'#ffc85e'; p.beginPath(); p.arc(x,yy,3.2,0,7); p.fill(); } }
    p.globalAlpha=0.5; p.fillStyle=p.createPattern(tex,'repeat'); p.fillRect(0,170,SW,220); p.globalAlpha=1; p.restore();
    // propellers + rudder (seen when the stern rises)
    p.fillStyle='#8a6a3a'; p.beginPath(); p.ellipse(84,338,10,26,0.2,0,7); p.fill(); p.fillStyle='#3a1a14'; p.fillRect(40,300,14,58);
    strokes(p,240,Rs,20,100,860,260,['#000','#3b3b3b','#fff2c8'],40,4,0,0.04,0.10); });
  const lights=off(SW,SH,(p)=>{ const Rl=R0(8); p.filter='blur(6px)'; p.fillStyle='rgba(255,190,90,.9)'; for(let row=0;row<3;row++) for(let x=70;x<850;x+=13){ if(Rl()<0.5){ p.beginPath(); p.arc(x,212+row*26,6,0,7); p.fill(); } } p.fillRect(160,150,600,22); });
  const BRK=330; // break point (between the 3rd and 4th funnel)
  const berg=off(520,560,(p)=>{ const Rb=R0(4); p.beginPath(); p.moveTo(0,520); p.lineTo(60,330); p.lineTo(110,300); p.lineTo(160,140); p.lineTo(200,170); p.lineTo(250,40); p.lineTo(300,120); p.lineTo(340,90); p.lineTo(400,260); p.lineTo(450,300); p.lineTo(520,520); p.closePath();
    const gr=p.createLinearGradient(0,40,520,520); gr.addColorStop(0,'#e8f2f8'); gr.addColorStop(.5,'#9fb9cc'); gr.addColorStop(1,'#3f5a72'); p.fillStyle=gr; p.fill(); p.save(); p.clip();
    strokes(p,500,Rb,0,0,520,560,['#f4fbff','#7f9ab2','#c9dbe8','#2f4860'],70,12,1.1,0.10,0.3); p.fillStyle='rgba(10,20,40,.35)'; p.beginPath(); p.moveTo(250,40); p.lineTo(300,120); p.lineTo(340,90); p.lineTo(400,260); p.lineTo(520,520); p.lineTo(260,520); p.closePath(); p.fill(); p.restore(); });
  const BANDS=[[HZ+6,2,0.010,0.5,'#0f2238'],[HZ+80,4,0.008,0.6,'#0c1c30'],[HZ+232,4,0.0065,0.7,'#0a1828'],[HZ+420,9,0.0055,0.8,'#07121f'],[HZ+660,12,0.0048,0.9,'#050c16']];
  const wy=(b,x,lt)=>b[0]+b[1]*Math.sin(x*b[2]+lt*b[3])+b[1]*0.4*Math.sin(x*b[2]*2.7+lt*b[3]*1.6+1);
  function band(b,lt,q,pat){ g.beginPath(); g.moveTo(-220,H); for(let x=-220;x<=W;x+=20) g.lineTo(x,wy(b,x,lt)); g.lineTo(W,H); g.closePath(); g.fillStyle=b[4]; g.fill(); g.save(); g.clip(); g.globalAlpha=0.45; g.fillStyle=pat; g.fillRect(-220,b[0]-60,W+220,H); g.globalAlpha=1; g.restore();
    g.strokeStyle='rgba(150,180,215,.28)'; g.lineWidth=4; g.lineCap='round'; const Rr=R0(q*7+b[0]); for(let x=-200;x<W;x+=80+Rr()*110){ const l=30+Rr()*60; g.beginPath(); g.moveTo(x,wy(b,x,lt)+3); g.lineTo(x+l,wy(b,x+l,lt)+3); g.stroke(); } }
  // draw part of the ship [x0,x1] with a pivot (px,py in image coords) placed at (X,Y) on screen, rotated by a
  const py0=WLI+40, JAG=(()=>{ const Rj=R0(12), a=[]; for(let i=0;i<=16;i++) a.push([(Rj()-.5)*26,-py0+i*(SH+80)/16]); return a; })();
  // draw part of the ship (bow: x>=BRK, stern: x<=BRK) with a torn, jagged break edge
  function piece(bow,X,Y,a,s){ g.save(); g.translate(X,Y); g.rotate(a); g.scale(s,s); g.beginPath();
    if(bow){ g.moveTo(SW,-py0); JAG.forEach(([dx,y])=>g.lineTo(dx,y)); g.lineTo(SW,SH); } else { g.moveTo(-BRK-20,-py0); JAG.forEach(([dx,y])=>g.lineTo(dx,y)); g.lineTo(-BRK-20,SH); }
    g.closePath(); g.clip(); g.drawImage(shipImg,-BRK,-WLI); g.globalCompositeOperation='lighter'; g.globalAlpha=0.4*(1-CL((Y-1100)/200)); g.drawImage(lights,-BRK,-WLI); g.restore(); }
  const CAP=[['11:40 pm: an iceberg.',0.35],['Water floods the bow.',2.0],['Gone in 2 h 40 min.',3.9]];
  SCN[2]=function(lt){ g.clearRect(0,0,1080,1920); const q=Math.floor(lt*8), pat=g.createPattern(tex,'repeat');
    const zf=EIO((lt-3.4)/2.8), zb=1.12-0.12*zf, cx=560, cy=1060+(980-1060)*zf;
    g.save(); g.translate(540,960); g.scale(zb,zb); g.translate(-cx,-cy);
    g.drawImage(skyC,-210,0);
    STARS.forEach(([x,y,r,ph])=>{ g.globalAlpha=0.45+0.55*(0.5+0.5*Math.sin(lt*3+ph)); g.fillStyle='#fff6e4'; g.beginPath(); g.arc(x-210,y,r,0,7); g.fill(); }); g.globalAlpha=1;
    band(BANDS[0],lt,q,pat);
    // the iceberg
    const bx=1010, by=HZ+70; g.save(); g.translate(bx,by); g.scale(0.82,0.82); g.drawImage(berg,-260,-520); g.restore();
    band(BANDS[1],lt,q,pat);
    // ship motion: sail right -> graze -> bow down -> break -> both halves sink
    const S=0.95, WL=HZ+230, sail=E3(lt/1.6), shx=-190+240*sail+10*lt;
    const tilt=0.15*EIO((lt-2.0)/1.7), brk=EIO((lt-3.7)/0.6);
    const bowA=tilt+0.75*brk, bowDy=60*EIO((lt-2.0)/1.7)+800*EIO((lt-3.9)/1.5);
    const sternA=tilt+0.55*brk+0.55*EIO((lt-4.4)/1.2), sternDy=45*EIO((lt-2.0)/1.7)-90*brk+980*EIO((lt-5.0)/1.8);
    // lights' warm reflection on the water
    if(lt<5.2){ g.save(); g.globalAlpha=0.35*(1-CL((lt-4.2)/1.0)); for(let i=0;i<20;i++){ const xx=shx+60+i*40, w=10+Math.sin(q+i)*4; g.fillStyle='#ffcf7a'; g.fillRect(xx-w/2,WL+8+(i%3)*10,w,4+(i%2)*3); } g.restore(); }
    if(brk<=0.02){ const ang=tilt; g.save(); g.translate(shx+BRK*S,WL+bowDy*0.6); g.rotate(ang); g.scale(S,S); g.drawImage(shipImg,-BRK,-WLI); g.globalCompositeOperation='lighter'; g.globalAlpha=0.55+0.1*Math.sin(lt*9); g.drawImage(lights,-BRK,-WLI); g.restore(); }
    else { piece(1,shx+BRK*S+brk*14,WL+bowDy,bowA,S); piece(0,shx+BRK*S-brk*6,WL+sternDy*0.9,sternA,S);
      // spray + dark smoke where it breaks
      const bk=CL((lt-3.7)/1.6), X0=shx+BRK*S; if(bk>0&&bk<1){ for(let i=0;i<16;i++){ const a2=((bk*1.4+i/16)%1), an=-1.57+(i-8)*0.13; g.save(); g.globalAlpha=(1-a2)*0.75*(1-bk*0.6); g.fillStyle=i%3?'#cfe0ee':'#8fa8c0'; g.beginPath(); g.arc(X0+Math.cos(an)*a2*170,WL-10+Math.sin(an)*a2*190+a2*a2*140,6+a2*14,0,7); g.fill(); g.restore(); }
        for(let i=0;i<6;i++){ const a2=CL(bk*1.3-i*0.08); g.save(); g.globalAlpha=0.35*Math.sin(a2*Math.PI); g.fillStyle='#05070c'; g.filter='blur(14px)'; g.beginPath(); g.arc(X0-30+i*22,WL-60-a2*220-i*20,40+a2*60,0,7); g.fill(); g.restore(); } } }
    // ice chunks + spray at the graze
    for(let i=0;i<7;i++){ const t0=1.35+i*0.06, a=CL((lt-t0)/0.9); if(a<=0||a>=1) continue; const x=bx-210+i*16+a*30, y=HZ+150-Math.sin(a*Math.PI)*90+a*a*60; g.globalAlpha=1-a; g.fillStyle=i%2?'#e8f2f8':'#a9c2d6'; g.beginPath(); g.moveTo(x,y-10); g.lineTo(x+12,y); g.lineTo(x,y+9); g.lineTo(x-11,y); g.closePath(); g.fill(); } g.globalAlpha=1;
    band(BANDS[2],lt,q,pat);
    // lifeboats with lanterns
    const lb=CL((lt-4.4)/0.6); if(lb>0){ [[180,HZ+300],[330,HZ+340],[700,HZ+320],[880,HZ+360]].forEach(([x,y],i)=>{ const yy=y+Math.sin(lt*2+i)*4; g.save(); g.globalAlpha=lb; g.fillStyle='#d8cfb8'; g.beginPath(); g.moveTo(x-46,yy); g.quadraticCurveTo(x,yy+24,x+46,yy); g.closePath(); g.fill(); g.fillStyle='#1b1712'; for(let k=-2;k<=2;k++){ g.beginPath(); g.arc(x+k*15,yy-6,5,0,7); g.fill(); }
      g.shadowColor='#ffcf70'; g.shadowBlur=26; g.fillStyle='#ffe4a0'; g.beginPath(); g.arc(x+34,yy-18,5+Math.sin(lt*7+i)*1,0,7); g.fill(); g.restore(); }); }
    band(BANDS[3],lt,q,pat); band(BANDS[4],lt,q,pat);
    g.restore();
    CAP.forEach(([t,t0],i)=>{ const a=EBK((lt-t0)/0.45); if(lt<t0) return; g.save(); g.globalAlpha=CL((lt-t0)/0.15); g.font='italic 500 '+(i===2?80:72)+'px '+SERIF; const w=g.measureText(t).width+64, y=262+i*112;
      g.translate(60+(1-a)*-200,y); g.rotate([-0.02,0.015,-0.01][i]); tornPath(g,0,0,w,96,80+i,6); g.fillStyle='#f3e6c8'; g.shadowColor='rgba(0,5,15,.6)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
      g.strokeStyle='rgba(150,100,50,.35)'; g.lineWidth=3; g.stroke(); g.fillStyle=i===2?'#8a1c10':'#2c1c0e'; g.fillText(t,32,70); g.restore(); });
    g.drawImage(BOIL[q%3],0,0); g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,900,380,540,900,1300); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(2,6,16,.6)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();
