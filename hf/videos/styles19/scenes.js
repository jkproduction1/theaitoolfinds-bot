// ---------- styles19: three famous explainer LOOKS drawn in 2D canvas (own designs, no channel logos/mascots/characters)
// S0 /paper-explainer (paper collage look), S1 /flat-cosmos (flat vector glow look), S2 /storybook (hand-painted look)
const C2=(id)=>{ const c=document.getElementById(id); return c.getContext('2d'); };
const E3=(x)=>x<0?0:x>1?1:1-Math.pow(1-x,3), EIO=(x)=>x<0?0:x>1?1:x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, CL=(x)=>x<0?0:x>1?1:x;
const EBK=(x)=>{ x=CL(x); const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); };
function R0(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
function off(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; }
function tornPath(g,x,y,w,h,seed,j){ const R=R0(seed); j=j||6; g.beginPath(); g.moveTo(x,y+R()*j);
  for(let i=1;i<=24;i++) g.lineTo(x+w*i/24,y+(R()-.5)*j); for(let i=1;i<=12;i++) g.lineTo(x+w+(R()-.5)*j,y+h*i/12);
  for(let i=23;i>=0;i--) g.lineTo(x+w*i/24,y+h+(R()-.5)*j); for(let i=11;i>=1;i--) g.lineTo(x+(R()-.5)*j,y+h*i/12); g.closePath(); }
function blobPath(g,cx,cy,r,seed,amp,n,t,bulge){ const R=R0(seed); const ph=[],fq=[]; for(let i=0;i<4;i++){ ph.push(R()*6.28); fq.push(2+Math.floor(R()*4)); }
  g.beginPath(); for(let i=0;i<=n;i++){ const a=i/n*Math.PI*2; let rr=r; for(let k=0;k<4;k++) rr+=r*amp*Math.sin(a*fq[k]+ph[k]+t*(0.6+k*0.3))/(k+1);
    if(bulge) rr+=bulge(a); const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr; i?g.lineTo(x,y):g.moveTo(x,y); } g.closePath(); }

// =============== S0 paper-explainer: why plane tickets cost so much ===============
(function(){ const g=C2('cv0');
  const paper=off(1080,1920,(p,w,h)=>{ const R=R0(3); p.fillStyle='#e9dfcb'; p.fillRect(0,0,w,h);
    for(let i=0;i<90000;i++){ const v=R(); p.fillStyle=v<.5?'rgba(120,96,60,'+(R()*.07)+')':'rgba(255,250,235,'+(R()*.10)+')'; p.fillRect(R()*w,R()*h,1+R()*2,1+R()*2); }
    p.strokeStyle='rgba(110,90,60,.10)'; p.lineWidth=1; for(let i=0;i<900;i++){ let x=R()*w,y=R()*h; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+(R()-.5)*30,y+(R()-.5)*30,x+(R()-.5)*50,y+(R()-.5)*50); p.stroke(); }
    const vg=p.createRadialGradient(w/2,h*.45,200,w/2,h*.45,1200); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(60,40,20,.28)'); p.fillStyle=vg; p.fillRect(0,0,w,h); });
  // map sheet: ocean paper + two land cut-outs (generic shapes, not a real map)
  const MX=70,MY=500,MW=940,MH=600;
  const mapC=off(MW+40,MH+40,(p)=>{ const R=R0(9); p.save(); p.translate(20,20);
    tornPath(p,0,0,MW,MH,21,10); p.fillStyle='#9fc3c9'; p.fill(); p.clip();
    for(let i=0;i<20000;i++){ p.fillStyle='rgba(30,70,80,'+(R()*.08)+')'; p.fillRect(R()*MW,R()*MH,2,2); }
    // halftone sea shading
    for(let y=0;y<MH;y+=14) for(let x=0;x<MW;x+=14){ const d=Math.hypot(x-MW*.5,y-MH*.5)/(MW*.6); const r=1.2+3.2*CL(d); p.fillStyle='rgba(40,90,105,.35)'; p.beginPath(); p.arc(x+(y/14%2)*7,y,r,0,7); p.fill(); }
    const land=(pts,col,seed)=>{ const R=R0(seed); p.save(); p.shadowColor='rgba(40,30,15,.35)'; p.shadowBlur=10; p.shadowOffsetY=6; p.beginPath();
      pts.forEach(([x,y],i)=>{ const jx=x+(R()-.5)*10, jy=y+(R()-.5)*10; i?p.lineTo(jx,jy):p.moveTo(jx,jy); }); p.closePath(); p.fillStyle=col; p.fill(); p.restore();
      p.save(); p.clip(); for(let i=0;i<3000;i++){ p.fillStyle='rgba(80,70,40,'+(R()*.12)+')'; p.fillRect(R()*MW,R()*MH,2,2);} p.restore(); };
    land([[0,120],[120,90],[260,140],[330,250],[300,380],[360,470],[300,600],[0,600]],'#e4d6a8',31);
    land([[640,0],[940,0],[940,420],[860,380],[800,300],[700,280],[620,200],[600,90]],'#d9c79a',32);
    p.restore(); });
  const A=[MX+230,MY+380], B=[MX+770,MY+190];
  const ctrl=[ (A[0]+B[0])/2, Math.min(A[1],B[1])-260 ];
  const qp=(t)=>[ (1-t)*(1-t)*A[0]+2*(1-t)*t*ctrl[0]+t*t*B[0], (1-t)*(1-t)*A[1]+2*(1-t)*t*ctrl[1]+t*t*B[1] ];
  // plane cut-out with halftone shading
  const plane=off(260,200,(p)=>{ p.translate(130,100); p.save(); p.shadowColor='rgba(0,0,0,.35)'; p.shadowBlur=12; p.shadowOffsetY=10;
    p.beginPath(); p.moveTo(-110,6); p.quadraticCurveTo(-112,-14,-90,-14); p.lineTo(80,-12); p.quadraticCurveTo(112,-8,118,4); p.quadraticCurveTo(110,14,80,16); p.lineTo(-90,16); p.closePath();
    p.moveTo(-10,-10); p.lineTo(30,-86); p.lineTo(52,-86); p.lineTo(36,-10); p.closePath();
    p.moveTo(-10,12); p.lineTo(30,88); p.lineTo(52,88); p.lineTo(36,12); p.closePath();
    p.moveTo(-96,-12); p.lineTo(-112,-56); p.lineTo(-96,-56); p.lineTo(-70,-12); p.closePath();
    p.fillStyle='#f6f3ec'; p.fill(); p.restore(); p.save(); p.clip();
    for(let y=-100;y<100;y+=9) for(let x=-130;x<130;x+=9){ const r=0.6+2.6*CL((y+20)/90); p.fillStyle='rgba(30,30,40,.55)'; p.beginPath(); p.arc(x,y,r,0,7); p.fill(); }
    p.restore(); p.strokeStyle='#1d1d1d'; p.lineWidth=3; p.stroke(); });
  const strips=[['Fuel','the biggest cost'],['Airport fees','+ taxes per seat'],['Demand','fewer seats left, higher price']];
  const pin=(x,y,a,lbl)=>{ if(a<=0) return; const dy=(1-E3(a))*-140; g.save(); g.globalAlpha=CL(a*3); g.translate(x,y+dy);
    g.fillStyle='rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(6,4,16,6,0,0,7); g.fill(); g.strokeStyle='#444'; g.lineWidth=5; g.beginPath(); g.moveTo(0,0); g.lineTo(0,-46); g.stroke();
    g.fillStyle='#e8402c'; g.beginPath(); g.arc(0,-56,22,0,7); g.fill(); g.fillStyle='rgba(255,255,255,.55)'; g.beginPath(); g.arc(-7,-63,7,0,7); g.fill();
    g.font='800 34px Inter, Helvetica, Arial, sans-serif'; const w=g.measureText(lbl).width; g.save(); g.rotate(-0.04); tornPath(g,26,-118,w+36,58,lbl.length*7,5); g.fillStyle='#fbf8f0'; g.shadowColor='rgba(0,0,0,.25)'; g.shadowBlur=8; g.shadowOffsetY=4; g.fill(); g.shadowColor='transparent';
    g.fillStyle='#161616'; g.fillText(lbl,44,-78); g.restore(); g.restore(); };
  SCN[0]=function(lt){ g.clearRect(0,0,1080,1920); const z=1+0.05*EIO(lt/6);
    g.save(); g.translate(540,900); g.scale(z,z); g.translate(-540,-900);
    g.drawImage(paper,0,0);
    // map drops in like a sheet placed on the desk
    const ma=E3(lt/0.45); g.save(); g.globalAlpha=ma; g.translate(MX+MW/2,MY+MH/2); g.rotate(-0.02+(1-ma)*0.06); g.scale(1.06-0.06*ma,1.06-0.06*ma);
    g.shadowColor='rgba(50,35,15,.4)'; g.shadowBlur=24; g.shadowOffsetY=14; g.drawImage(mapC,-MW/2-20,-MH/2-20); g.restore();
    // tape corners
    if(lt>0.3){ g.save(); g.globalAlpha=CL((lt-0.3)/0.2)*0.8; g.fillStyle='rgba(245,240,215,.85)'; [[MX+20,MY-6,-0.5],[MX+MW-40,MY+MH-14,-0.5]].forEach(([x,y,r])=>{ g.save(); g.translate(x,y); g.rotate(r); g.fillRect(-50,-16,110,34); g.restore(); }); g.restore(); }
    pin(A[0],A[1],(lt-0.45)/0.35,'Prague'); pin(B[0],B[1],(lt-0.6)/0.35,'New York');
    // marker route
    const rf=EIO((lt-1.0)/1.4);
    if(rf>0){ g.save(); g.strokeStyle='#1a1a1a'; g.lineWidth=7; g.lineCap='round'; g.setLineDash([22,16]); g.beginPath(); for(let i=0;i<=60*rf;i++){ const [x,y]=qp(i/60); i?g.lineTo(x,y):g.moveTo(x,y); } g.stroke(); g.restore(); }
    if(rf>0.02){ const t=Math.min(rf*0.86,0.999), [x,y]=qp(t), [x2,y2]=qp(Math.min(1,t+0.01)); const ang=Math.atan2(y2-y,x2-x);
      g.save(); g.translate(x,y-30); g.rotate(ang); const s=0.9; g.scale(s,s); g.drawImage(plane,-130,-100); g.restore(); }
    // three torn strips with highlighter
    strips.forEach(([h,s],i)=>{ const t0=2.5+i*0.9, a=EBK((lt-t0)/0.4); if(lt<t0) return; const y=1150+i*130, x=110+(1-a)*-700;
      g.save(); g.translate(x,y); g.rotate([-0.025,0.02,-0.015][i]);
      g.font='900 54px Inter, Helvetica, Arial, sans-serif'; const hw=g.measureText(h).width; g.font='500 36px Georgia, serif'; const sw=g.measureText(s).width; const W=Math.max(hw+sw+90,560);
      tornPath(g,0,0,W,104,40+i,7); g.fillStyle='#fdfbf5'; g.shadowColor='rgba(40,30,15,.35)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
      const hl=EIO((lt-t0-0.35)/0.45); if(hl>0){ g.fillStyle='rgba(255,221,0,.85)'; g.beginPath(); g.moveTo(26,24); g.lineTo(26+(hw+16)*hl,20); g.lineTo(26+(hw+16)*hl,86); g.lineTo(26,82); g.closePath(); g.fill(); }
      g.fillStyle='#141414'; g.font='900 54px Inter, Helvetica, Arial, sans-serif'; g.fillText(h,34,72); g.fillStyle='#4a4238'; g.font='italic 500 36px Georgia, serif'; g.fillText(s,34+hw+30,70);
      g.restore(); });
    g.restore();
  };
})();

// =============== S1 flat-cosmos: how your body fights a virus ===============
(function(){ const g=C2('cv1');
  const bg=off(1080,1920,(p,w,h)=>{ const gr=p.createRadialGradient(w*.5,h*.45,80,w*.5,h*.5,1250); gr.addColorStop(0,'#1d2a6b'); gr.addColorStop(.55,'#121a4a'); gr.addColorStop(1,'#080b26'); p.fillStyle=gr; p.fillRect(0,0,w,h); });
  const R=R0(7), DOTS=[]; for(let i=0;i<70;i++) DOTS.push([R()*1080,R()*1920,2+R()*9,R()*.5+.15,R()<.5?'#6fd3ff':'#b48cff',R()*6]);
  const CELL={x:360,y:1300,r:330};
  const dock=[CELL.x+Math.cos(-0.62)*CELL.r, CELL.y+Math.sin(-0.62)*CELL.r];
  function virus(x,y,r,a,rot,glow){ g.save(); g.globalAlpha=a; g.translate(x,y); g.rotate(rot);
    g.shadowColor='rgba(120,255,160,'+(0.6*glow)+')'; g.shadowBlur=40*glow;
    for(let i=0;i<14;i++){ const an=i/14*Math.PI*2; g.strokeStyle='#4fe08a'; g.lineWidth=r*0.16; g.lineCap='round'; g.beginPath(); g.moveTo(Math.cos(an)*r*.8,Math.sin(an)*r*.8); g.lineTo(Math.cos(an)*r*1.42,Math.sin(an)*r*1.42); g.stroke();
      g.fillStyle='#a6ffbf'; g.beginPath(); g.arc(Math.cos(an)*r*1.5,Math.sin(an)*r*1.5,r*.17,0,7); g.fill(); }
    g.fillStyle='#38c56f'; g.beginPath(); g.arc(0,0,r,0,7); g.fill(); g.shadowBlur=0;
    g.fillStyle='#2a9c58'; g.beginPath(); g.arc(r*.12,r*.14,r*.86,0,7); g.fill();
    g.fillStyle='#57e891'; g.beginPath(); g.arc(-r*.1,-r*.12,r*.72,0,7); g.fill();
    g.fillStyle='rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(-r*.32,-r*.4,r*.22,r*.12,-0.6,0,7); g.fill(); g.restore(); }
  SCN[1]=function(lt){ g.clearRect(0,0,1080,1920); g.drawImage(bg,0,0);
    DOTS.forEach(([x,y,r,a,c,ph],i)=>{ const yy=(y-lt*(8+r*4)+1920)%1920; g.globalAlpha=a*(0.6+0.4*Math.sin(lt*2+ph)); g.fillStyle=c; g.beginPath(); g.arc(x+Math.sin(lt*.5+ph)*12,yy,r,0,7); g.fill(); }); g.globalAlpha=1;
    // body cell (flat, layered shading, soft glow rim)
    const ca=E3(lt/0.5); g.save(); g.globalAlpha=ca; g.translate(0,(1-ca)*120);
    g.shadowColor='rgba(255,140,120,.55)'; g.shadowBlur=60; blobPath(g,CELL.x,CELL.y,CELL.r,3,0.018,120,lt); g.fillStyle='#ff8a72'; g.fill(); g.shadowBlur=0;
    blobPath(g,CELL.x+20,CELL.y+26,CELL.r*0.93,3,0.018,120,lt); g.fillStyle='#f0705e'; g.fill();
    blobPath(g,CELL.x-14,CELL.y-18,CELL.r*0.86,3,0.018,120,lt); g.fillStyle='#ff9a80'; g.fill();
    blobPath(g,CELL.x-60,CELL.y+60,CELL.r*0.36,5,0.05,80,lt); g.fillStyle='#c94f62'; g.fill();
    blobPath(g,CELL.x-74,CELL.y+44,CELL.r*0.28,5,0.05,80,lt); g.fillStyle='#e0647a'; g.fill();
    for(let i=0;i<9;i++){ const an=-1.25+i*0.16; const x=CELL.x+Math.cos(an)*CELL.r*0.99, y=CELL.y+Math.sin(an)*CELL.r*0.99; const hot=i===4?CL((lt-2.0)/0.3):0;
      g.fillStyle=hot?'rgb(255,'+(220-60*hot|0)+','+(120-40*hot|0)+')':'#ffc2a8'; if(hot){ g.shadowColor='#ffe08a'; g.shadowBlur=30*hot; } g.beginPath(); g.arc(x,y,14+hot*6,0,7); g.fill(); g.shadowBlur=0; }
    g.restore();
    // virus flies in, docks on a receptor
    const vf=EIO((lt-0.4)/1.6); const vx0=930,vy0=520; let vx=vx0+(dock[0]+70-vx0)*vf, vy=vy0+(dock[1]-60-vy0)*vf;
    vx+=Math.sin(lt*3)*6*(1-vf); vy+=Math.cos(lt*2.4)*6*(1-vf);
    // white blood cell arrives and swallows it
    const wa=EIO((lt-2.2)/1.0), eng0=EIO((lt-3.2)/1.1), wx=1300+(vx+250-1300)*wa-210*eng0, wy=760+(vy-10-760)*wa+10*eng0;
    const eng=EIO((lt-3.2)/1.1); // 0 → virus outside, 1 → fully inside
    let va=1, vs=1; if(eng>0){ vs=1-0.35*eng; }
    const fade=CL((lt-4.6)/0.8); va=1-fade;
    if(eng<0.35) virus(vx,vy,62*vs,va,lt*0.4,1);
    if(lt>2.1){ g.save(); const wr=200+50*eng;
      const toV=Math.atan2(vy-wy,vx-wx);
      const bul=(a)=>{ let d=Math.atan2(Math.sin(a-toV),Math.cos(a-toV)); return 120*Math.sin(eng*Math.PI*0.5)*Math.exp(-d*d*1.6)*(1-0.6*eng)+40*Math.sin(eng*Math.PI)*Math.exp(-((Math.abs(d)-0.7)**2)*8); };
      g.shadowColor='rgba(200,220,255,'+(0.55+0.4*CL((lt-4.2)/0.5))+')'; g.shadowBlur=50+60*CL((lt-4.2)/0.5);
      blobPath(g,wx,wy,wr,11,0.04,140,lt*1.4,bul); g.fillStyle='#e9ecff'; g.fill(); g.shadowBlur=0;
      blobPath(g,wx+14,wy+18,wr*0.9,11,0.04,140,lt*1.4,bul); g.fillStyle='#d3d8f7'; g.fill();
      blobPath(g,wx-8,wy-10,wr*0.84,11,0.04,140,lt*1.4,bul); g.fillStyle='#f4f5ff'; g.fill();
      // lobed nucleus
      g.fillStyle='#8f6be0'; [[40,60,52],[100,76,46],[136,24,40]].forEach(([dx,dy,r])=>{ g.beginPath(); g.arc(wx+dx*(1-0.3*eng),wy+dy,r,0,7); g.fill(); });
      g.fillStyle='#a786f0'; [[34,52,40],[94,68,34],[130,18,28]].forEach(([dx,dy,r])=>{ g.beginPath(); g.arc(wx+dx*(1-0.3*eng),wy+dy,r,0,7); g.fill(); });
      g.restore();
      if(eng>=0.35){ g.save(); blobPath(g,wx,wy,wr*0.95,11,0.04,140,lt*1.4,bul); g.clip(); virus(vx,vy,62*vs,va*0.9,lt*0.4,0.4);
        // vesicle ring around swallowed virus
        g.strokeStyle='rgba(143,107,224,'+(0.7*va)+')'; g.lineWidth=6; g.beginPath(); g.arc(vx,vy,62*vs*1.7,0,7); g.stroke(); g.restore(); }
    }
  };
})();

// =============== S2 storybook: how the pyramids were built ===============
(function(){ const g=C2('cv2');
  function strokes(p,n,R,x0,y0,w,h,cols,len,wid,ang){ for(let i=0;i<n;i++){ const x=x0+R()*w, y=y0+R()*h, l=len*(0.5+R()), a=(ang||0)+(R()-.5)*0.5;
    p.strokeStyle=cols[Math.floor(R()*cols.length)]; p.globalAlpha=0.08+R()*0.22; p.lineWidth=wid*(0.5+R()); p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5+(R()-.5)*6,x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } p.globalAlpha=1; }
  const W=1400,H=2300; // world canvas bigger than frame for the pull-back
  const world=off(W,H,(p)=>{ const R=R0(5);
    const sky=p.createLinearGradient(0,0,0,1250); sky.addColorStop(0,'#e9a86a'); sky.addColorStop(.5,'#f3c98e'); sky.addColorStop(1,'#f7e0b2'); p.fillStyle=sky; p.fillRect(0,0,W,1300);
    strokes(p,2500,R,0,0,W,1250,['#f7d9a8','#eab27a','#fbe8c4','#e59f66'],120,26,0);
    // sun
    for(let i=0;i<40;i++){ p.globalAlpha=0.05; p.fillStyle='#fff3cf'; p.beginPath(); p.arc(1040+(R()-.5)*14,520+(R()-.5)*14,90+i*5,0,7); p.fill(); } p.globalAlpha=1;
    p.fillStyle='#fff6dc'; p.beginPath(); p.arc(1040,520,92,0,7); p.fill();
    // far dunes + distant small pyramids
    const dune=(y,amp,c1,c2,seed)=>{ const Rr=R0(seed); p.fillStyle=c1; p.beginPath(); p.moveTo(0,H); for(let x=0;x<=W;x+=20) p.lineTo(x,y+amp*Math.sin(x*0.004+seed)+amp*0.4*Math.sin(x*0.011+seed*2)); p.lineTo(W,H); p.closePath(); p.fill();
      p.save(); p.clip(); strokes(p,2600,Rr,0,y-amp,W,H-y+amp,[c2,c1,'#f4d7a1'],90,20,0.05); p.restore(); };
    p.fillStyle='#d8a874'; [[180,1170,120],[330,1185,80]].forEach(([x,y,s])=>{ p.beginPath(); p.moveTo(x-s,y); p.lineTo(x,y-s*0.95); p.lineTo(x+s,y); p.closePath(); p.fill(); });
    dune(1180,30,'#e2b47c','#cf9c63',2); dune(1300,40,'#e7bf86','#d6a46a',4); dune(1560,30,'#edc993','#d8aa70',6);
    // wet-sand path in foreground
    
    // canvas grain
    for(let i=0;i<160000;i++){ p.fillStyle=R()<.5?'rgba(90,60,30,'+(R()*.06)+')':'rgba(255,245,220,'+(R()*.06)+')'; p.fillRect(R()*W,R()*H,2,2); } });
  const PX=760, PY=1420, PW=600, PH=500, COURSES=14; // big pyramid on the right
  const block=off(80,40,(p)=>{ const R=R0(2); p.fillStyle='#d9a768'; p.fillRect(0,0,80,40); strokes(p,60,R,0,0,80,40,['#c08a4c','#e8bf84','#b07a40'],30,6,0); p.strokeStyle='rgba(90,55,25,.6)'; p.lineWidth=2; p.strokeRect(1,1,78,38); });
  function pyramid(f){ const n=f*COURSES, full=Math.floor(n); const ch=PH/COURSES, R=R0(9);
    for(let c=0;c<Math.min(COURSES,full+1);c++){ const part=c<full?1:n-full; if(part<=0) break; const yb=PY-c*ch, wb=PW*(1-c/COURSES), wt=PW*(1-(c+1)/COURSES);
      g.save(); g.beginPath(); g.moveTo(PX-wb/2,yb); g.lineTo(PX-wb/2+(wb)*part,yb); g.lineTo(PX-wb/2+(wb)*part-(wb-wt)/2*0,yb-ch); g.lineTo(PX-wt/2,yb-ch); g.closePath(); g.clip();
      const sun=c%2?0:20; for(let x=PX-wb/2-40+(c%2)*20;x<PX+wb/2;x+=40){ g.drawImage(block,x,yb-ch,40,ch); }
      // shaded right face (light from the sun on the right → left face darker)
      const gr=g.createLinearGradient(PX-wb/2,0,PX+wb/2,0); gr.addColorStop(0,'rgba(120,70,30,.35)'); gr.addColorStop(.5,'rgba(120,70,30,.05)'); gr.addColorStop(1,'rgba(255,230,180,.12)'); g.fillStyle=gr; g.fillRect(PX-wb/2,yb-ch,wb,ch);
      g.restore(); } }
  function figure(x,y,s,lean,col,phase){ g.save(); g.translate(x,y); g.scale(s,s); const st=Math.sin(phase);
    g.fillStyle=col; g.strokeStyle=col; g.lineCap='round'; g.lineJoin='round';
    g.lineWidth=13; [st,-st].forEach((q)=>{ g.beginPath(); g.moveTo(0,-62); g.lineTo(q*16,-30); g.lineTo(q*26-4,0); g.stroke(); });
    g.save(); g.rotate(lean);
    g.beginPath(); g.moveTo(-11,-62); g.quadraticCurveTo(-16,-96,-14,-122); g.quadraticCurveTo(0,-130,15,-122); g.quadraticCurveTo(15,-92,11,-62); g.closePath(); g.fill();
    g.fillStyle='#efe5cf'; g.beginPath(); g.moveTo(-15,-70); g.lineTo(15,-70); g.lineTo(21,-40); g.lineTo(-19,-42); g.closePath(); g.fill();
    g.lineWidth=9; g.beginPath(); g.moveTo(4,-116); g.quadraticCurveTo(22,-104,40,-98); g.stroke(); g.beginPath(); g.moveTo(-4,-114); g.quadraticCurveTo(14,-100,32,-94); g.stroke();
    g.fillStyle=col; g.beginPath(); g.ellipse(6,-142,14,16,0.2,0,7); g.fill(); g.fillStyle='#1e140c'; g.beginPath(); g.ellipse(2,-150,15,10,0.2,0,7); g.fill();
    g.restore(); g.restore(); }
  function sled(x,y,wet){ // block on a wooden sled, rope to the pullers, one worker pours water on the sand in front
    g.save(); g.translate(x,y);
    g.fillStyle='rgba(90,55,25,.35)'; g.beginPath(); g.ellipse(0,8,150,16,0,0,7); g.fill();
    g.fillStyle='#7a5530'; g.fillRect(-140,-14,280,16); g.beginPath(); g.moveTo(140,-14); g.quadraticCurveTo(175,-14,170,-40); g.lineTo(160,-38); g.quadraticCurveTo(160,-4,140,2); g.fill();
    g.drawImage(block,-120,-150,240,136); g.restore(); }
  SCN[2]=function(lt){ g.clearRect(0,0,1080,1920);
    const zf=EIO((lt-3.4)/2.2), zb=1.45-0.45*zf; const cx=560+(620-560)*zf, cy=1420+(1150-1420)*zf;
    g.save(); g.translate(540,960); g.scale(zb,zb); g.translate(-cx,-cy);
    g.drawImage(world,-160,-180);
    const bf=0.15+0.85*EIO((lt-0.2)/4.4); pyramid(bf);
    // ramp: a narrow mud-brick ramp leaning on the left face, up to the course being laid
    const top=PY-bf*PH, rx=PX-PW/2*(1-bf)-6; g.save(); g.fillStyle='#a8743f'; g.beginPath(); g.moveTo(rx-(PY-top)*0.75,PY); g.lineTo(rx,top); g.lineTo(rx+18,top); g.lineTo(rx+18-(PY-top)*0.2,PY); g.closePath(); g.fill();
    g.strokeStyle='rgba(110,70,35,.45)'; g.lineWidth=2; const RR=R0(4); for(let i=0;i<40;i++){ const f=RR(); const y=PY-f*(PY-top); const xl=rx-(1-f)*(PY-top)*0.75; g.beginPath(); g.moveTo(xl+4,y); g.lineTo(xl+14+RR()*14,y); g.stroke(); } g.restore();
    const hf=(lt*0.18)%1; const hx=rx-(1-hf)*(PY-top)*0.75*0.9, hy=PY-hf*(PY-top)*0.9; g.drawImage(block,hx-14,hy-16,26,14); figure(hx+22,hy,0.18,0.3,'#4e321d',lt*7); figure(hx+34,hy-6,0.18,0.3,'#4e321d',lt*7+1);
    // foreground: sled pulled along the wet sand
    const sx=200+lt*70, sy=1700;
    // water pourer in front of the sled
    const wx=sx+200; figure(wx,sy,0.95,0.0,'#5a3a22',0); g.save(); g.fillStyle='#8a5a34'; g.beginPath(); g.ellipse(wx+30,sy-104,18,22,0.5,0,7); g.fill();
    g.strokeStyle='rgba(150,200,230,.75)'; g.lineWidth=5; for(let i=0;i<3;i++){ g.beginPath(); g.moveTo(wx+42+i*3,sy-96); g.quadraticCurveTo(wx+58+i*4,sy-60,wx+50+i*6,sy-4+Math.sin(lt*10+i)*3); g.stroke(); } g.restore();
    g.save(); g.globalAlpha=0.35; g.fillStyle='#8c5f35'; g.beginPath(); g.ellipse(wx+60,sy+6,70,12,0,0,7); g.fill(); g.restore();
    sled(sx,sy,1);
    // rope + pullers
    g.strokeStyle='#5c3d22'; g.lineWidth=5; g.beginPath(); g.moveTo(sx+160,sy-30); g.lineTo(sx+560,sy-96); g.stroke();
    for(let i=0;i<4;i++) figure(sx+300+i*80,sy+4,1,0.28,['#4e321d','#5d3b22','#47301c','#5a3a22'][i],lt*7+i*1.3);
    g.restore();
    // painterly vignette
    const vg=g.createRadialGradient(540,900,300,540,900,1300); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(80,45,15,.35)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();
