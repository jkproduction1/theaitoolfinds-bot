// ---------- styles37: the three explainer LOOKS of styles19/28/33 on new topics, drawn in 2D canvas by Claude Fable 5.2 (own designs; no channel
// logos, wordmarks, mascots or characters; no photos or maps copied).
// S0 /paper-collage = why the Dead Sea is disappearing · S1 /flat-science = why onions make you cry · S2 /painted-story = the year without a summer
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


// =============== S0 paper-collage: why the Dead Sea is disappearing ===============
// Facts (USGS / EcoPeace / Geological Survey of Israel, BBC, Britannica): the surface drops about 1 m a year; most of the Jordan River's
// water is taken upstream for farms and cities; 6,000+ sinkholes have opened on the exposed shore. Side view, schematic, own drawing.
(function(){ const g=C2('cv0'), MK="'Permanent Marker',Inter,sans-serif";
  const BANK=860, OLD=890, NOW=1190, SX0=330, SX1=620, SY1=1520;
  const slopeX=(y)=>SX0+(SX1-SX0)*(y-BANK)/(SY1-BANK);
  const paper=off(1080,1920,(p,w,h)=>{ p.fillStyle='#efe6d2'; p.fillRect(0,0,w,h); const R=R0(4);
    for(let i=0;i<9000;i++){ p.strokeStyle='rgba(120,95,60,'+(R()*.08)+')'; p.lineWidth=1; const x=R()*w,y=R()*h,a=R()*6.28,l=4+R()*14; p.beginPath(); p.moveTo(x,y); p.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); }
    p.save(); p.translate(540,680); p.rotate(0.008); tornPath(p,-580,-270,1160,560,5,12); p.fillStyle='#bfe0e6'; p.fill(); p.restore(); });
  const MOUNT=off(1080,300,(q)=>{ q.beginPath(); q.moveTo(380,292); const R2=R0(12); for(let x=380;x<=1100;x+=36){ q.lineTo(x,150-Math.sin(x*.012)*60-Math.sin(x*.031)*26+(R2()-.5)*14); } q.lineTo(1100,292); q.closePath(); q.fillStyle='#c79a7a'; q.fill();
    q.globalCompositeOperation='source-atop'; for(let y=0;y<300;y+=10) for(let x=(y/10%2)*5;x<1080;x+=10){ q.fillStyle='rgba(90,50,40,.25)'; q.beginPath(); q.arc(x,y,0.6+2.4*CL(y/300),0,7); q.fill(); } });
  const LOST=off(1080,1920,(p)=>{ p.fillStyle='rgba(150,214,224,.55)'; p.fillRect(0,OLD,1080,NOW-OLD+4); p.save(); p.beginPath(); p.rect(0,OLD,1080,NOW-OLD+4); p.clip(); p.strokeStyle='rgba(255,255,255,.6)'; p.lineWidth=6; for(let x=200;x<1500;x+=34){ p.beginPath(); p.moveTo(x,OLD); p.lineTo(x-330,NOW+4); p.stroke(); } p.restore(); });
  const WATER=off(1080,1920,(p)=>{ p.beginPath(); p.moveTo(SX0-20,OLD-4); p.lineTo(1090,OLD-4); p.lineTo(1090,1660); p.lineTo(SX1+20,SY1+30); p.closePath(); const gr=p.createLinearGradient(0,OLD,0,1660); gr.addColorStop(0,'#49bfcb'); gr.addColorStop(.45,'#3fb6c4'); gr.addColorStop(1,'#167a92'); p.fillStyle=gr; p.fill();
    p.save(); p.clip(); for(let y=OLD;y<1660;y+=10) for(let x=(y/10%2)*5+330;x<1080;x+=10){ p.fillStyle='rgba(255,255,255,.3)'; p.beginPath(); p.arc(x,y,0.8+2.2*CL((1460-y)/500),0,7); p.fill(); } p.restore(); });
  const LAND=off(1080,1920,(p)=>{ const R=R0(21); p.beginPath(); p.moveTo(-20,BANK); for(let x=0;x<=SX0;x+=30) p.lineTo(x,BANK+(R()-.5)*8);
    for(let i=1;i<=22;i++){ const y=BANK+(SY1-BANK)*i/22; p.lineTo(slopeX(y)+(R()-.5)*12,y); }
    for(let x=SX1+30;x<=1100;x+=30) p.lineTo(x,SY1+(x-SX1)*0.2+(R()-.5)*8); p.lineTo(1100,1940); p.lineTo(-20,1940); p.closePath();
    p.fillStyle='#d9b877'; p.shadowColor='rgba(60,40,20,.4)'; p.shadowBlur=18; p.shadowOffsetY=-6; p.fill(); p.shadowColor='transparent';
    p.save(); p.clip(); p.fillStyle='#c79f62'; p.fillRect(-20,1460,1120,480); for(let y=BANK;y<1920;y+=12) for(let x=(y/12%2)*6;x<1080;x+=12){ const d=CL((y-BANK)/900); p.fillStyle='rgba(110,70,35,.24)'; p.beginPath(); p.arc(x,y,0.8+3*d,0,7); p.fill(); } p.restore(); });
  const SALTD=[]; { const R=R0(9); for(let i=0;i<170;i++) SALTD.push([R(),(R()-.5)*30,1.5+R()*3.5,R()<.5]); }
  const PIER=sticker(off(300,470,(p)=>{ p.fillStyle='#8a5a34'; p.fillRect(0,60,270,22); p.fillStyle='#6f4526'; [[30,22],[130,118],[240,366]].forEach(([x,l])=>{ p.fillRect(x,82,14,l); });
    p.strokeStyle='#6f4526'; p.lineWidth=5; p.beginPath(); p.moveTo(0,36); p.lineTo(270,36); p.stroke(); [2,90,180,268].forEach(x=>{ p.beginPath(); p.moveTo(x,36); p.lineTo(x,60); p.stroke(); });
    p.lineWidth=6; p.beginPath(); p.moveTo(262,82); p.lineTo(262,210); p.moveTo(292,82); p.lineTo(292,210); for(let y=104;y<210;y+=26){ p.moveTo(262,y); p.lineTo(292,y); } p.stroke(); }),7);
  const UMB=sticker(off(240,250,(p)=>{ p.strokeStyle='#5a4a3a'; p.lineWidth=8; p.beginPath(); p.moveTo(120,110); p.lineTo(120,246); p.stroke();
    for(let i=0;i<5;i++){ p.fillStyle=i%2?'#fbf8f0':'#e4483c'; p.beginPath(); p.moveTo(120,120); p.arc(120,120,110,Math.PI*(1+i*.2),Math.PI*(1+(i+1)*.2)+0.01); p.closePath(); p.fill(); } }),6);
  const FLOAT=sticker(off(330,190,(p)=>{ p.lineCap='round';
    p.strokeStyle='#e9b48e'; p.lineWidth=30; p.beginPath(); p.moveTo(92,150); p.lineTo(250,156); p.stroke();
    p.strokeStyle='#2f6fb3'; p.lineWidth=32; p.beginPath(); p.moveTo(170,152); p.lineTo(210,154); p.stroke();
    p.strokeStyle='#e9b48e'; p.lineWidth=22; p.beginPath(); p.moveTo(250,156); p.lineTo(292,126); p.stroke();
    p.fillStyle='#e9b48e'; p.beginPath(); p.arc(58,128,30,0,7); p.fill(); p.fillStyle='#3a2a20'; p.beginPath(); p.arc(50,116,30,Math.PI*.95,Math.PI*1.75); p.fill();
    p.fillStyle='#1b1b1b'; p.fillRect(60,118,34,10);
    p.strokeStyle='#e9b48e'; p.lineWidth=16; p.beginPath(); p.moveTo(110,140); p.lineTo(140,96); p.stroke();
    p.save(); p.translate(150,60); p.rotate(-0.12); p.fillStyle='#fbf8f0'; p.fillRect(-56,-52,128,100); p.strokeStyle='#bdb5a4'; p.lineWidth=2; p.strokeRect(-56,-52,128,100); p.fillStyle='#17222b'; p.fillRect(-44,-40,104,14); p.fillStyle='#8b8578'; for(let i=0;i<5;i++){ p.fillRect(-44,-16+i*12,46,5); p.fillRect(12,-16+i*12,48,5); } p.restore(); }),7);
  const SUN=sticker(off(130,130,(p)=>{ p.fillStyle='#ffd23c'; p.beginPath(); p.arc(65,65,62,0,7); p.fill(); }),5);
  const HOLES=[[0.30,30],[0.52,22],[0.72,34],[0.9,20]];
  function hand(t,x,y,col,size,rot,a){ if(a<=0) return; g.save(); g.translate(x,y); g.rotate(rot||0); const s=0.6+0.4*EBK(a); g.scale(s,s); g.globalAlpha=CL(a*2.5); g.font=(size||52)+'px '+MK; g.fillStyle=col; g.fillText(t,0,0); g.restore(); }
  function pop(img,x,y,a,rot){ if(a<=0) return; const s=EBK(a); g.save(); g.translate(x+img.width/2,y+img.height); g.rotate(rot||0); g.scale(s,s); g.globalAlpha=CL(a*3); g.drawImage(img,-img.width/2,-img.height); g.restore(); }
  SCN[0]=function(lt){ g.clearRect(0,0,1080,1920); const z=1+0.045*EIO(lt/6.5), q=Math.floor(lt*12)/12, wob=Math.sin(q*3)*0.012;
    const dr=EIO((lt-1.3)/2.3), L=OLD+(NOW-OLD)*dr;
    g.save(); g.translate(540,1000); g.scale(z,z); g.translate(-540,-1000);
    g.drawImage(paper,0,0);
    const sa=E3((lt-0.1)/0.5); g.drawImage(SUN,865-SUN.ox,478-SUN.oy+(1-sa)*-200);
    const ma=E3((lt-0.05)/0.6); g.drawImage(MOUNT,0,600+(1-ma)*300);
    // lost water above the falling surface
    if(dr>0){ g.save(); g.beginPath(); g.rect(0,OLD,1080,L-OLD); g.clip(); g.drawImage(LOST,0,0); g.restore(); }
    // water from the current level down
    const wa=E3(lt/0.5); g.save(); g.globalAlpha=wa; g.beginPath(); g.rect(0,L,1080,1920-L); g.clip(); g.drawImage(WATER,0,0); g.restore();
    g.save(); g.strokeStyle='rgba(255,255,255,.85)'; g.lineWidth=5; g.lineCap='round'; g.beginPath(); for(let x=slopeX(L);x<=1090;x+=20){ const y=L+Math.sin(x*.05+q*4)*3; x===slopeX(L)?g.moveTo(x,y):g.lineTo(x,y); } g.globalAlpha=wa; g.stroke(); g.restore();
    // the floating reader rides the surface down
    const fa=E3((lt-0.35)/0.5), fx=590+170*dr; g.save(); g.globalAlpha=CL(fa*2); g.translate(fx+165,L-70+(1-fa)*-160+Math.sin(q*2.2)*4); g.rotate(wob); g.drawImage(FLOAT,-165-FLOAT.ox,-92-FLOAT.oy); g.restore();
    g.fillStyle='rgba(63,182,196,'+(0.8*CL(fa*2))+')'; g.fillRect(fx-20,L+2,370,16);
    // land
    const la=E3(lt/0.6); g.drawImage(LAND,0,(1-la)*500);
    // salt crust on the newly exposed slope
    if(dr>0.02){ g.save(); g.strokeStyle='#fbf8f0'; g.lineWidth=34; g.lineCap='round'; g.beginPath(); g.moveTo(slopeX(OLD)+4,OLD); g.lineTo(slopeX(L)+4,L); g.stroke();
      SALTD.forEach(([u,dx,r,dk])=>{ const y=OLD+u*(NOW-OLD); if(y>L) return; g.fillStyle=dk?'rgba(190,180,160,.6)':'#fff'; g.beginPath(); g.arc(slopeX(y)+4+dx,y,r,0,7); g.fill(); }); g.restore(); }
    // sinkholes pop open one by one
    HOLES.forEach(([u,r],i)=>{ const a=CL((lt-3.0-i*0.33)/0.35); if(a<=0) return; const y=OLD+(NOW-OLD)*u, x=slopeX(y)-40-(i%2)*46, s=EBK(a); g.save(); g.translate(x,y); g.scale(s,s); blobPath(g,0,0,r,i+3,0.14,30,0); g.fillStyle='#2b2018'; g.fill(); g.strokeStyle='#fbf8f0'; g.lineWidth=4; g.stroke(); g.restore();
      if(a<1){ g.save(); g.globalAlpha=(1-a)*0.8; g.fillStyle='#c9a66b'; for(let k=0;k<6;k++){ const an=k*1.05; g.beginPath(); g.arc(x+Math.cos(an)*(r+a*40),y+Math.sin(an)*(r+a*30)-a*20,6,0,7); g.fill(); } g.restore(); } });
    pop(PIER,250-PIER.ox,BANK-82-PIER.oy,CL((lt-0.25)/0.4),0); pop(UMB,40-UMB.ox,BANK-246-UMB.oy,CL((lt-0.4)/0.4),wob);
    // the 1960 water line
    const dl=EIO((lt-0.9)/0.5); if(dl>0){ g.save(); g.setLineDash([24,16]); g.strokeStyle='#1b2a3a'; g.lineWidth=7; g.lineCap='round'; g.beginPath(); g.moveTo(slopeX(OLD)+10,OLD); g.lineTo(slopeX(OLD)+10+(1070-slopeX(OLD))*dl,OLD); g.stroke(); g.restore(); }
    hand('water in 1960',700,OLD-18,'#1b2a3a',46,-0.02,CL((lt-2.6)/0.35));
    hand('the old pier',300,BANK-100,'#17222b',44,-0.04,CL((lt-2.0)/0.35));
    hand('today',920,NOW+70,'#fbf8f0',50,-0.03,CL((lt-3.7)/0.35));
    // the red drop arrow grows with the fall
    if(L-OLD>90){ const e=marker(g,[[620,OLD+26],[612,(OLD+L)/2],[622,L-22]],1,12,'#d7262e'); arrowHead(g,e[0],e[1],e[2],34,12,'#d7262e'); }
    hand('−1 m',650,990,'#d7262e',72,-0.05,CL((lt-3.0)/0.35)); hand('a year',652,1048,'#d7262e',48,-0.05,CL((lt-3.15)/0.35));
    // tags
    const c1=EIO((lt-3.6)/0.4); if(c1>0){ const e=marker(g,[[300,1272],[330,1215],[352,1168]],c1,8,'#17222b'); if(c1>0.97) arrowHead(g,e[0],e[1],e[2],22,8,'#17222b'); }
    paperTag(g,lt,3.35,30,1280,0.02,'6,000+ sinkholes','open on the old shore',32,1);
    paperTag(g,lt,4.6,385,1428,-0.015,'River pumped away','for farms and cities',33,0);
    // title
    const ta=CL((lt-0.15)/0.45); if(ta>0){ const s=EBK(ta); g.save(); g.translate(540,330); g.rotate(-0.015+(1-s)*0.1); g.scale(0.5+0.5*s,0.5+0.5*s); g.globalAlpha=CL(ta*3); g.translate(-480,-130); const W=960,H=260; tornPath(g,0,0,W,H,21,8); g.fillStyle='#fbf8f0'; g.shadowColor='rgba(30,20,10,.4)'; g.shadowBlur=20; g.shadowOffsetY=10; g.fill(); g.shadowColor='transparent';
      g.fillStyle='#17222b'; g.font='400 96px '+DISP; g.fillText('The Dead Sea drops',44,108); const a='1 meter', wa2=g.measureText(a).width, hl=EIO((lt-0.7)/0.4); g.fillStyle='rgba(255,214,0,.92)'; g.beginPath(); g.moveTo(36,150); g.lineTo(36+(24+wa2)*hl,144); g.lineTo(36+(26+wa2)*hl,232); g.lineTo(36,226); g.closePath(); g.fill();
      g.fillStyle='#17222b'; g.fillText(a+' every year',44,212); g.fillStyle='rgba(240,232,200,.85)'; g.save(); g.translate(W-60,-6); g.rotate(0.5); g.fillRect(-56,-16,112,34); g.restore(); g.restore(); }
    g.restore();
    g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,900,500,540,900,1250); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(30,25,15,.28)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();


// =============== S1 flat-science: why onions make you cry ===============
// Facts (Library of Congress "Everyday Mysteries"; Imai et al., Nature 2002): cutting breaks the onion's cells; enzymes turn its sulfur
// compounds into a gas (syn-propanethial-S-oxide); the gas reaches the eyes and stings, and the tear glands wash it out.
(function(){ const g=C2('cv1');
  const bg=off(1080,1920,(p,w,h)=>{ const gr=p.createRadialGradient(w*.5,h*.62,60,w*.5,h*.55,1300); gr.addColorStop(0,'#3d1a5e'); gr.addColorStop(.5,'#1d0f48'); gr.addColorStop(1,'#07051f'); p.fillStyle=gr; p.fillRect(0,0,w,h);
    p.filter='blur(90px)'; [[200,1500,300,'rgba(255,90,190,.24)'],[900,700,300,'rgba(200,255,90,.10)'],[860,1350,240,'rgba(160,110,255,.22)']].forEach(([x,y,r,c])=>{ p.fillStyle=c; p.beginPath(); p.arc(x,y,r,0,7); p.fill(); }); });
  const R=R0(29), DOTS=[]; for(let i=0;i<60;i++) DOTS.push([R()*1080,420+R()*1500,2+R()*6,R()*.35+.1,R()<.5?'#ff9ad0':'#b99bff',R()*6]);
  const OX=520, OY=1380, OR=300, EX=540, EY=600, CUT=[690,1195];
  const WISP=[]; { for(let i=0;i<7;i++){ const Q=R0(200+i); WISP.push([CUT[0]+(Q()-.5)*60,CUT[1]-10,Q()*80,Q()*60,EX-20+(Q()-.5)*160,EY+130,14+Q()*16,i]); } }
  function label(txt,x,y,tx,ty,col,a){ if(a<=0) return; const s=EBK(a); g.save(); g.globalAlpha=CL(a*3); g.font='800 40px '+SANS; const w=g.measureText(txt).width+52;
    const lx=tx<x?x:(tx>x+w?x+w:x+w/2); g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=4; g.beginPath(); g.moveTo(lx,y); g.lineTo(lx+(tx-lx)*s,y+(ty-y)*s); g.stroke(); g.fillStyle='#fff'; g.beginPath(); g.arc(lx+(tx-lx)*s,y+(ty-y)*s,9,0,7); g.fill();
    g.translate(x+w/2,y); g.scale(0.7+0.3*s,0.7+0.3*s); g.translate(-w/2,0); g.fillStyle='rgba(12,8,44,.92)'; g.beginPath(); g.roundRect(0,-36,w,72,36); g.fill(); g.strokeStyle=col; g.lineWidth=2.5; g.stroke(); g.fillStyle='#fff'; g.fillText(txt,26,14); g.restore(); }
  function onion(a){ g.save(); g.translate(OX,OY); const s=0.6+0.4*EBK(a); g.scale(s,s); g.globalAlpha=CL(a*2.5); g.translate(-OX,-OY);
    g.fillStyle='#2a1a4a'; g.beginPath(); g.roundRect(60,OY+140,960,170,40); g.fill(); g.fillStyle='#3a2662'; g.beginPath(); g.roundRect(60,OY+140,960,40,20); g.fill();
    g.shadowColor='rgba(220,120,255,.7)'; g.shadowBlur=60; g.fillStyle='#8a3b9e'; g.beginPath(); g.ellipse(OX,OY,OR,OR*.92,0,0,7); g.fill(); g.shadowBlur=0;
    const cols=['#f6e9ff','#e9c9f7','#f8eefe','#dcb2ef'];
    for(let i=0;i<9;i++){ const k=1-i*0.105; g.fillStyle=i===0?'#b764c9':cols[i%4]; g.beginPath(); g.ellipse(OX+i*5,OY+i*7,OR*k*.95,OR*k*.87,0,0,7); g.fill(); g.strokeStyle='rgba(150,70,180,.55)'; g.lineWidth=5; g.stroke(); }
    g.fillStyle='#fff7ff'; g.beginPath(); g.ellipse(OX+42,OY+60,24,33,0,0,7); g.fill(); g.restore(); }
  function cell(x,y,s,b,ph){ g.save(); g.translate(x,y); g.rotate(ph*.3); g.fillStyle='rgba(255,240,255,.95)'; g.strokeStyle='#c27ad8'; g.lineWidth=4;
    if(b<=0){ g.beginPath(); g.roundRect(-s,-s*.7,s*2,s*1.4,s*.5); g.fill(); g.stroke(); }
    else{ for(const sx of[-1,1]){ g.save(); g.translate(sx*s*(.1+.45*b),-b*6); g.rotate(sx*.45*b); g.beginPath(); g.moveTo(0,-s*.7); g.lineTo(sx*s,-s*.7); g.quadraticCurveTo(sx*s*1.2,0,sx*s,s*.7); g.lineTo(0,s*.7); g.lineTo(sx*s*.2,s*.25); g.lineTo(-sx*s*.05,0); g.lineTo(sx*s*.2,-s*.3); g.closePath(); g.fill(); g.stroke(); g.restore(); } }
    g.restore(); }
  function mol(x,y,s,a,lt,i){ if(a<=0) return; const k=EBK(a)*s; g.save(); g.translate(x+Math.sin(lt*1.3+i)*10,y+Math.cos(lt+i)*6); g.rotate(Math.sin(lt*.7+i)*.25); g.scale(k,k); g.strokeStyle='#e8ff9a'; g.lineWidth=6; g.beginPath(); g.moveTo(-30,0); g.lineTo(30,0); g.stroke();
    [[-30,'#f6ff7a','S'],[30,'#ff6a8a','O']].forEach(([dx,c,t])=>{ g.fillStyle=c; g.shadowColor=c; g.shadowBlur=24; g.beginPath(); g.arc(dx,0,24,0,7); g.fill(); g.shadowBlur=0; g.fillStyle='#1a0d3a'; g.font='800 28px '+SANS; g.textAlign='center'; g.fillText(t,dx,10); }); g.restore(); }
  function eye(lt,a,irr){ if(a<=0) return; const X=EX, Y=EY, s=EBK(a), sq=irr*(0.42+0.08*Math.sin(lt*9)), top=210*(1-sq), bot=190*(1-sq*.5);
    g.save(); g.translate(X,Y); g.scale(s,s); g.globalAlpha=CL(a*3); g.translate(-X,-Y);
    const alm=(d)=>{ g.beginPath(); g.moveTo(X-260+d,Y); g.quadraticCurveTo(X,Y-top+d,X+260-d,Y); g.quadraticCurveTo(X,Y+bot-d,X-260+d,Y); };
    g.shadowColor='rgba(255,120,160,'+(0.7+0.3*irr)+')'; g.shadowBlur=50+30*irr; g.fillStyle='#ffd5e2'; alm(0); g.fill(); g.shadowBlur=0;
    g.save(); alm(12); g.clip(); g.fillStyle=irr>0?'rgb(255,'+Math.round(245-38*irr)+','+Math.round(248-30*irr)+')':'#fff5f8'; g.fillRect(X-260,Y-220,520,440);
    g.strokeStyle='rgba(255,70,110,'+(0.15+0.7*irr)+')'; g.lineWidth=4+2*irr; [[-220,10,-110,-30],[-210,30,-120,50],[220,0,120,-40],[215,25,130,60],[-230,-10,-140,-60],[225,-14,150,-66]].forEach(([p0,p1,p2,p3])=>{ g.beginPath(); g.moveTo(X+p0,Y+p1); g.quadraticCurveTo(X+(p0+p2)/2,Y+(p1+p3)/2+12,X+p2,Y+p3); g.stroke(); });
    const px=X+Math.sin(lt*.9)*10*(1-irr), py=Y+10*sq; g.fillStyle='#6b3fd8'; g.beginPath(); g.arc(px,py,92,0,7); g.fill(); g.fillStyle='#8f66ff'; g.beginPath(); g.arc(px,py,70,0,7); g.fill(); g.fillStyle='#120a30'; g.beginPath(); g.arc(px,py,40-6*irr,0,7); g.fill(); g.fillStyle='#fff'; g.beginPath(); g.arc(px-24,py-26,14,0,7); g.fill();
    if(irr>0){ g.fillStyle='rgba(127,227,255,'+(0.55*irr)+')'; g.beginPath(); g.moveTo(X-250,Y+10); g.quadraticCurveTo(X,Y+bot-70+Math.sin(lt*5)*6,X+250,Y+10); g.quadraticCurveTo(X,Y+bot+10,X-250,Y+10); g.fill(); }
    g.restore();
    g.strokeStyle='#ff9ec0'; g.lineWidth=12; g.lineCap='round'; g.beginPath(); g.moveTo(X-262,Y); g.quadraticCurveTo(X,Y-top-4,X+262,Y); g.stroke();
    g.strokeStyle='#2a1450'; g.lineWidth=7; for(let i=0;i<7;i++){ const t=.2+i*.1, px2=X-262+524*t, py2=Y-(top+4)*2*t*(1-t); g.beginPath(); g.moveTo(px2,py2-4); g.lineTo(px2+(t-.5)*40,py2-34+14*sq); g.stroke(); }
    g.restore(); }
  function tear(x,y,s,al){ g.save(); g.translate(x,y); g.scale(s,s); g.globalAlpha=al; g.shadowColor='#6fd8ff'; g.shadowBlur=36; g.fillStyle='#7fe3ff'; g.beginPath(); g.moveTo(0,-56); g.quadraticCurveTo(38,0,30,22); g.arc(0,22,30,0,Math.PI); g.quadraticCurveTo(-38,0,0,-56); g.fill(); g.shadowBlur=0; g.fillStyle='rgba(255,255,255,.7)'; g.beginPath(); g.ellipse(-10,14,7,12,.3,0,7); g.fill(); g.restore(); }
  const CC=[[700,1195,26,1,0],[752,1232,22,1,1],[652,1158,20,0,2],[806,1276,24,1,3],[716,1280,18,0,4],[606,1232,18,0,5]];
  SCN[1]=function(lt){ g.clearRect(0,0,1080,1920); const z=1+0.05*EIO(lt/6.5);
    g.save(); g.translate(540,1000); g.scale(z,z); g.translate(-540,-1000);
    g.drawImage(bg,0,0);
    DOTS.forEach(([x,y,r,a,c,ph])=>{ g.globalAlpha=a*(.6+.4*Math.sin(lt*2+ph)); g.fillStyle=c; g.beginPath(); g.arc(x+Math.sin(lt*.5+ph)*12,y-lt*6,r,0,7); g.fill(); }); g.globalAlpha=1;
    const cut=EIO((lt-0.55)/0.5), sh=lt>1.0&&lt<1.3?Math.sin(lt*90)*5*(1-(lt-1.0)/0.3):0;
    g.save(); g.translate(sh,0); onion(CL((lt-0.05)/0.5));
    const b=E3((lt-1.02)/0.35); if(lt>0.5) CC.forEach(([x,y,s,bu,ph])=>cell(x,y,s,bu?b:0,ph)); g.restore();
    // the gas rises from the cut to the eye
    const f=EIO((lt-1.35)/1.7), fade=1-0.45*CL((lt-4.6)/1.2);
    if(f>0){ g.save(); g.globalAlpha=fade; WISP.forEach(([sx,sy,c1,c2,ex,ey,w,i])=>{ const wv=Math.sin(lt*.8+i)*40; g.strokeStyle=i%2?'rgba(216,255,106,.55)':'rgba(157,255,176,.45)'; g.lineWidth=w; g.lineCap='round'; g.shadowColor='#c8ff60'; g.shadowBlur=40; g.setLineDash([900*f,4000]);
        g.beginPath(); g.moveTo(sx,sy); g.bezierCurveTo(sx-120+wv+c1,sy-170,ex+140-wv,ey+180+c2,ex,ey); g.stroke(); }); g.setLineDash([]); g.shadowBlur=0;
      for(let i=0;i<34;i++){ let hs=i*7.31; const Q=()=>{ hs+=1; const v=Math.sin(hs*12.9898)*43758.5453; return v-Math.floor(v); }, u=(Q()+lt*.14)%1; if(u>f) continue; const x=CUT[0]+(EX-20+(Q()-.5)*180-CUT[0])*E3(u)+Math.sin(u*7+i)*18*u, y=CUT[1]-10-u*(CUT[1]-EY-140), r=5+Q()*9; g.globalAlpha=.85*(1-u*.6)*fade; g.fillStyle=Q()<.5?'#e8ff8a':'#b6ffc4'; g.shadowColor='#c8ff60'; g.shadowBlur=20; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); }
      g.restore(); }
    mol(650,1085,1,CL((lt-1.7)/0.35),lt,0); mol(606,930,.95,CL((lt-2.2)/0.35),lt,1); mol(548,800,.85,CL((lt-2.7)/0.35),lt,2);
    // knife
    { const dx=Math.cos(-.5)*(1-cut)*560, dy=Math.sin(-.5)*(1-cut)*560; g.save(); g.globalAlpha=CL((lt-0.4)/0.2); g.translate(700+dx+sh,1195+dy); g.rotate(-.5+Math.sin(lt*1.2)*0.012);
      g.shadowColor='#bfeaff'; g.shadowBlur=40; g.fillStyle='#e6ecff'; g.beginPath(); g.moveTo(-20,-30); g.lineTo(250,-48); g.lineTo(256,30); g.quadraticCurveTo(120,40,-20,30); g.closePath(); g.fill(); g.shadowBlur=0;
      g.fillStyle='#b8c2e6'; g.beginPath(); g.moveTo(-20,10); g.quadraticCurveTo(120,24,256,14); g.lineTo(256,30); g.quadraticCurveTo(120,40,-20,30); g.fill();
      g.fillStyle='#ff6aa8'; g.beginPath(); g.roundRect(246,-56,190,86,40); g.fill(); g.fillStyle='#ffd0e4'; [300,360,420].forEach(x=>{ g.beginPath(); g.arc(x,-13,9,0,7); g.fill(); }); g.restore(); }
    // eye + tears
    const irr=EIO((lt-2.9)/0.7); eye(lt,CL((lt-0.3)/0.45),irr);
    if(lt>3.45){ [[EX+225,1],[EX-228,.8],[EX+170,.7],[EX-150,.62]].forEach(([x,s],i)=>{ const u=((lt-3.45)*0.55+i*0.27)%1; if((lt-3.45)*0.55+i*0.27<i*0.27+0.001) return; const y=EY+70+u*u*420; tear(x+(i%2?-1:1)*u*14,y,s*(0.45+0.55*CL(u*5)),CL(u*8)*(1-CL((u-.8)/.2))); }); }
    label('The knife bursts the cells',60,1100,CUT[0],CUT[1]-6,'#ff9ad0',CL((lt-1.25)/0.4));
    label('Enzymes make a gas',60,950,590,930,'#d8ff6a',CL((lt-2.3)/0.4));
    label('Tears wash it out',600,880,EX+225,EY+150,'#7fe3ff',CL((lt-4.0)/0.4));
    // headline
    g.save(); g.shadowColor='rgba(0,0,0,.5)'; g.shadowBlur=20; g.font='800 84px '+SANS; const h1=E3((lt-0.15)/0.45), h2=E3((lt-0.4)/0.45);
    g.textAlign='center'; g.globalAlpha=h1; g.fillStyle='#fff'; g.fillText('Cutting an onion makes',540,270+(1-h1)*30);
    const a='a tiny ', b2='tear gas', wa=g.measureText(a).width, wb=g.measureText(b2).width, x0=540-(wa+wb)/2; g.textAlign='left'; g.globalAlpha=h2; g.fillText(a,x0,370+(1-h2)*30); g.fillStyle='#d8ff6a'; g.shadowColor='rgba(200,255,90,.9)'; g.shadowBlur=30; g.fillText(b2,x0+wa,370+(1-h2)*30); g.restore();
    g.restore();
  };
})();


// =============== S2 painted-story: the year without a summer ===============
// Facts (Britannica, NOAA, Smithsonian GVP): Mount Tambora (Sumbawa, Indonesia) erupted in April 1815, the largest eruption in recorded
// history; its sulfur haze in the stratosphere dimmed the sun and cooled the Northern Hemisphere; in June 1816 snow fell in New England
// and crops failed across Europe and North America. Story montage: the volcano stands on the horizon as a symbol (it was half a world away).
(function(){ const g=C2('cv2');
  function strokes(p,n,R,x0,y0,w,h,cols,len,wid,ang,a0,a1){ a0=a0??0.08; a1=a1??0.22; for(let i=0;i<n;i++){ const x=x0+R()*w,y=y0+R()*h,l=len*(0.5+R()),a=(ang||0)+(R()-.5)*0.5;
    p.strokeStyle=cols[Math.floor(R()*cols.length)]; p.globalAlpha=a0+R()*a1; p.lineWidth=wid*(0.5+R()); p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5+(R()-.5)*6,x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } p.globalAlpha=1; }
  const HZ=1180, SX=800, SY=780;
  const hills=(p,col,cols)=>{ const R=R0(3); p.fillStyle=col; p.beginPath(); p.moveTo(0,HZ); for(let x=0;x<=1080;x+=40) p.lineTo(x,HZ-60-Math.sin(x*.006)*40-Math.sin(x*.017)*18); p.lineTo(1080,HZ+20); p.lineTo(0,HZ+20); p.fill(); strokes(p,260,R,0,HZ-120,1080,130,cols,90,18,0,0.1,0.2); };
  const furrows=(p,c)=>{ p.strokeStyle=c; p.lineWidth=6; for(let i=0;i<14;i++){ const y=HZ+30+i*i*4.2; p.beginPath(); p.moveTo(-20,y); p.quadraticCurveTo(540,y-12,1100,y+6); p.stroke(); } };
  const skyS=off(1080,1920,(p,w,h)=>{ const R=R0(15); const s=p.createLinearGradient(0,0,0,HZ); s.addColorStop(0,'#3f76b0'); s.addColorStop(.5,'#8fbbd8'); s.addColorStop(.85,'#f1dfae'); s.addColorStop(1,'#f3cf8c'); p.fillStyle=s; p.fillRect(0,0,w,HZ+10);
    strokes(p,2200,R,0,0,w,HZ,['#4f86bd','#7fb0d3','#bcd8e6','#3a6aa2'],170,34,0); strokes(p,300,R,-50,900,1180,260,['#f6e2b0','#f0c98a','#fff0cc'],180,28,0,0.06,0.16);
    hills(p,'#5f7f5a',['#52724e','#7c9a6a','#46643f']);
    const f=p.createLinearGradient(0,HZ,0,h); f.addColorStop(0,'#b99a3e'); f.addColorStop(1,'#d9b94e'); p.fillStyle=f; p.fillRect(0,HZ,w,h-HZ);
    strokes(p,1600,R,-40,HZ,w+80,h-HZ,['#e6c95c','#c2a23c','#a4b04e','#f0d878'],150,22,0.02,0.1,0.3); furrows(p,'rgba(120,96,30,.35)'); });
  const skyW=off(1080,1920,(p,w,h)=>{ const R=R0(16); const s=p.createLinearGradient(0,0,0,HZ); s.addColorStop(0,'#3b3a40'); s.addColorStop(.4,'#7a7062'); s.addColorStop(.75,'#b39a6e'); s.addColorStop(1,'#c9b48a'); p.fillStyle=s; p.fillRect(0,0,w,HZ+10);
    strokes(p,2200,R,0,0,w,HZ,['#4a4650','#6e6658','#8c7f68','#3c3a44'],170,34,0); strokes(p,900,R,-50,380,1180,620,['#c2ac7c','#a99470','#d6c49a','#8e8070'],220,40,-0.04,0.05,0.14);
    hills(p,'#4f4d58',['#5d5c66','#7d7c86','#4e4d57']);
    const f=p.createLinearGradient(0,HZ,0,h); f.addColorStop(0,'#c9ced8'); f.addColorStop(1,'#eef1f5'); p.fillStyle=f; p.fillRect(0,HZ,w,h-HZ);
    strokes(p,1600,R,-40,HZ,w+80,h-HZ,['#ffffff','#d5dbe6','#b9c1d0','#e8ecf2'],150,22,0.02,0.1,0.3); furrows(p,'rgba(110,118,140,.35)'); });
  const CONE=off(520,220,(p)=>{ const R=R0(9); p.fillStyle='#3a3238'; p.beginPath(); p.moveTo(40,210); p.lineTo(210,40); p.lineTo(270,34); p.lineTo(440,210); p.closePath(); p.fill(); p.save(); p.clip(); strokes(p,200,R,60,40,360,170,['#2a2328','#4c4048','#5e4a40'],60,12,-0.6,0.15,0.25); p.restore(); });
  const PLUME=off(1080,1100,(p)=>{ const R=R0(9); p.filter='blur(18px)'; for(let i=0;i<90;i++){ const t=i/90, x=300+Math.sin(t*4)*25+t*t*120-t*t*t*260, y=1040-t*560, r=34+t*170; p.fillStyle='rgba(58,52,56,'+(0.55-t*0.35)+')'; p.beginPath(); p.arc(x+(R()-.5)*50,y+(R()-.5)*30,r,0,7); p.fill(); }
    p.filter='blur(30px)'; for(let i=0;i<30;i++){ p.fillStyle='rgba(70,64,66,.22)'; p.beginPath(); p.ellipse(60+R()*700,480+R()*140,160+R()*120,60,0,0,7); p.fill(); } p.filter='none'; });
  const VEIL=off(520,240,(p)=>{ const R2=R0(61); for(let i=0;i<40;i++){ const x=20+R2()*340, y=30+R2()*180; p.strokeStyle=R2()<.5?'rgba(170,150,115,.28)':'rgba(120,110,100,.22)'; p.lineWidth=8+R2()*12; p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.lineTo(x+80+R2()*90,y+(R2()-.5)*10); p.stroke(); } });
  const mkWheat=(caps)=>off(1080,700,(p)=>{ const R=R0(44); for(let i=0;i<70;i++){ const x=R()*1080, y=330+R()*360, L=90+R()*120, b=(R()-.3)*60, c1=R()<.5, c2=4+R()*3;
      if(!caps){ p.strokeStyle=c1?'#9a8a4e':'#7b7040'; p.lineWidth=c2; p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+b*.3,y-L*.6,x+b,y-L); p.stroke(); }
      p.save(); p.translate(x+b,y-L); p.rotate(b/120); if(!caps){ p.fillStyle='#c9aa4e'; p.beginPath(); p.ellipse(0,-14,9,24,0,0,7); p.fill(); } else { p.fillStyle='#fbfcff'; p.beginPath(); p.ellipse(2,-30,12,9,0,0,7); p.fill(); } p.restore(); }
    if(caps) strokes(p,300,R,0,320,1080,380,['#ffffff','#e6ebf2'],60,14,0.05,0.2,0.4); });
  const WHEAT=mkWheat(false), CAPS=mkWheat(true);
  const BOIL=off(1200,2040,(p)=>{ const R=R0(17); strokes(p,520,R,-50,0,1300,2040,['#9fb6d6','#020812','#f4d79c'],120,22,0.1,0.02,0.05); });
  const SNOW=[]; { const R=R0(81); for(let i=0;i<240;i++) SNOW.push([R()*1180,R()*1920,2+R()*5,0.5+R()*.5,R()+.5,R()+.4]); }
  const mix=(a,b,t)=>a+(b-a)*t;
  function farmer(x,y,s,up,w){ g.save(); g.translate(x,y); g.scale(s,s); g.fillStyle='#1a1614';
    g.beginPath(); g.ellipse(0,-150,46,10,0,0,7); g.fill(); g.beginPath(); g.roundRect(-22,-178,44,30,8); g.fill(); g.beginPath(); g.arc(0,-130,20,0,7); g.fill();
    g.beginPath(); g.moveTo(-34,-110); g.quadraticCurveTo(-44,-20,-40,30); g.lineTo(40,30); g.quadraticCurveTo(44,-20,34,-110); g.closePath(); g.fill();
    g.lineWidth=14; g.lineCap='round'; g.lineJoin='round'; g.strokeStyle='#1a1614'; g.beginPath(); g.moveTo(-20,30); g.lineTo(-24,110); g.moveTo(18,30); g.lineTo(22,110); g.stroke();
    g.lineWidth=12; g.beginPath(); g.moveTo(28,-100); g.lineTo(mix(46,44,up),mix(-52,-140,up)); g.lineTo(mix(40,10,up),mix(-8,-146,up)); g.stroke();
    if(w>0){ g.globalAlpha=w; g.strokeStyle='rgba(255,255,255,.8)'; g.lineWidth=5; g.beginPath(); g.arc(0,-150,46,Math.PI*1.05,Math.PI*1.95); g.stroke(); }
    g.restore(); }
  const CAPT=[['April 1815: a volcano erupts.',-0.02,0.3],['Its haze dims the sun.',0.015,1.9],['1816: snow in June.',-0.01,3.8]];
  SCN[2]=function(lt){ g.clearRect(0,0,1080,1920); const q=Math.floor(lt*8);
    const hz=EIO((lt-1.5)/1.6), w=EIO((lt-3.1)/1.4), er=E3((lt-0.45)/1.6), z=1.16-0.16*EIO(lt/5.6);
    g.save(); g.translate(430,1150); g.scale(z,z); g.translate(-430,-1150);
    g.drawImage(skyS,0,0); if(hz>0){ g.globalAlpha=hz; g.drawImage(skyW,0,0,1080,HZ-110,0,0,1080,HZ-110); g.globalAlpha=1; }
    if(w>0){ g.globalAlpha=w; g.drawImage(skyW,0,HZ-110,1080,1920-HZ+110,0,HZ-110,1080,1920-HZ+110); g.globalAlpha=1; }
    // the sun: bright, then a pale disc behind the haze
    const sg=g.createRadialGradient(SX,SY,10,SX,SY,mix(420,320,hz)); sg.addColorStop(0,'rgba(255,236,170,'+mix(.95,.8,hz)+')'); sg.addColorStop(.3,'rgba(255,214,130,'+mix(.6,.4,hz)+')'); sg.addColorStop(1,'rgba(255,200,120,0)'); g.fillStyle=sg; g.fillRect(0,0,1080,1300);
    g.save(); g.shadowColor='rgba(255,235,180,.9)'; g.shadowBlur=mix(110,50,hz); g.fillStyle='rgb('+Math.round(mix(255,246,hz))+','+Math.round(mix(240,236,hz))+','+Math.round(mix(160,206,hz))+')'; g.beginPath(); g.arc(SX,SY,78,0,7); g.fill(); g.restore();
    if(hz>0){ g.globalAlpha=hz; g.drawImage(VEIL,SX-240,SY-120); g.globalAlpha=1; }
    // the volcano erupts
    if(er>0){ g.save(); g.translate(210,1004); const s=0.25+0.75*er; g.scale(s,s); g.globalAlpha=CL(er*1.6); g.drawImage(PLUME,-300+Math.sin(q*1.7)*3,-1040); g.restore(); }
    g.drawImage(CONE,-30,970);
    const gl=0.75+0.25*Math.sin(q*2.1); g.save(); g.globalAlpha=CL((lt-0.4)/0.3)*gl; g.fillStyle='rgba(255,120,40,.9)'; g.filter='blur(6px)'; g.beginPath(); g.ellipse(210,1006,40+8*gl,14,0,0,7); g.fill(); g.filter='none'; g.restore();
    if(lt>0.5&&lt<3.2){ for(let i=0;i<9;i++){ const u=((lt-0.5)*0.8+i/9)%1; g.fillStyle='rgba(255,'+(140+i*10)+',60,'+(1-u)+')'; g.beginPath(); g.arc(210+Math.sin(i*2.3)*70*u,1000-u*190+u*u*110,5,0,7); g.fill(); } }
    g.drawImage(WHEAT,0,1150); if(w>0){ g.globalAlpha=w; g.drawImage(CAPS,0,1150); g.globalAlpha=1; }
    // cottage
    g.save(); g.translate(140,1300); g.fillStyle='#3c2f28'; g.fillRect(0,0,170,110); g.fillStyle='#2a201c'; g.beginPath(); g.moveTo(-20,4); g.lineTo(85,-80); g.lineTo(190,4); g.closePath(); g.fill();
    if(w>0){ g.globalAlpha=w; g.fillStyle='#f4f6fa'; g.beginPath(); g.moveTo(-20,4); g.lineTo(85,-80); g.lineTo(190,4); g.lineTo(170,-6); g.lineTo(85,-62); g.lineTo(0,-6); g.closePath(); g.fill(); g.globalAlpha=1; }
    g.fillStyle='rgba(255,207,122,'+mix(.25,1,hz)+')'; g.fillRect(30,36,34,30); g.fillRect(110,36,34,30); g.restore();
    farmer(540,1560,1.25,EIO((lt-1.9)/0.6),w);
    // snow
    if(w>0){ SNOW.forEach(([x,y,r,a,vx,vy])=>{ const xx=(x+lt*24*vx)%1180-50, yy=(y+lt*110*vy)%1920; g.fillStyle='rgba(255,255,255,'+(a*w)+')'; g.beginPath(); g.arc(xx,yy,r,0,7); g.fill(); }); }
    // the calendar leaf
    const ca=CL((lt-3.6)/0.4); if(ca>0){ const s=EBK(ca); g.save(); g.translate(880,1420); g.rotate(0.08+(1-s)*0.4+Math.sin(q*.9)*0.012); g.scale(s,s); g.globalAlpha=CL(ca*3); tornPath(g,-80,-90,160,180,7,6); g.fillStyle='#f3e6c8'; g.shadowColor='rgba(0,5,15,.5)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
      g.fillStyle='#8a1c10'; g.fillRect(-80,-90,160,46); g.fillStyle='#f3e6c8'; g.font='italic 500 38px '+SERIF; g.textAlign='center'; g.fillText('June',0,-55); g.fillStyle='#2c1c0e'; g.font='italic 500 76px '+SERIF; g.fillText('1816',0,40); g.restore(); }
    g.restore();
    // captions on torn parchment
    CAPT.forEach(([t,r,t0],i)=>{ const a=E3((lt-t0)/0.45); if(a<=0) return; g.save(); g.globalAlpha=CL(a*2); g.font='italic 500 '+(i===2?80:72)+'px '+SERIF; const wd=g.measureText(t).width+64, y=250+i*112;
      g.translate(60-(1-a)*120,y); g.rotate(r); tornPath(g,0,0,wd,96,80+i,6); g.fillStyle='#f3e6c8'; g.shadowColor='rgba(0,5,15,.6)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent'; g.strokeStyle='rgba(150,100,50,.35)'; g.lineWidth=3; g.stroke(); g.fillStyle=i===2?'#8a1c10':'#2c1c0e'; g.fillText(t,32,70); g.restore(); });
    g.drawImage(BOIL,-((q*37)%100),-((q*53)%100)); g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,1000,380,540,1000,1300); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(10,12,20,.55)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();
