// ---------- styles42: the three explainer LOOKS (flat-science, paper-collage, painted-story) on new topics, drawn in 2D canvas by Claude Fable 5.2
// (own designs; no channel logos, wordmarks, mascots or characters). S0 /flat-science = how your eyes see color · S1 /paper-collage = how the Great Wall was built · S2 /painted-story = the lighthouse of Alexandria
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



// =============== S0 flat-science: how your eyes see color ===============
// Facts (NEI/NIH "How the eyes work"; Britannica "colour vision"): the retina has three kinds of cone cells, most sensitive to short (blue),
// medium (green) and long (red) wavelengths; the brain compares how strongly each kind fires. Yellow light (a lemon) drives the red and green
// cones strongly and the blue ones barely; the brain reads that mix as yellow.
(function(){ const g=C2('cv0');
  const bg=off(1080,1920,(p,w,h)=>{ const gr=p.createRadialGradient(w*.5,h*.45,60,w*.5,h*.45,1300); gr.addColorStop(0,'#27328a'); gr.addColorStop(.5,'#151c57'); gr.addColorStop(1,'#070a25'); p.fillStyle=gr; p.fillRect(0,0,w,h);
    p.filter='blur(90px)'; [[150,800,260,'rgba(255,220,80,.22)'],[900,600,260,'rgba(255,90,120,.20)'],[800,1400,300,'rgba(60,200,140,.20)']].forEach(([x,y,r,c])=>{ p.fillStyle=c; p.beginPath(); p.arc(x,y,r,0,7); p.fill(); }); p.filter='none';
    const R=R0(5), N=[]; for(let i=0;i<26;i++) N.push([R()*w,300+R()*1500]); p.strokeStyle='rgba(180,170,255,.07)'; p.lineWidth=2;
    N.forEach((a,i)=>N.forEach((b,j)=>{ if(j>i&&Math.hypot(a[0]-b[0],a[1]-b[1])<260){ p.beginPath(); p.moveTo(a[0],a[1]); p.lineTo(b[0],b[1]); p.stroke(); } })); });
  const R=R0(29), DOTS=[]; for(let i=0;i<60;i++) DOTS.push([R()*1080,R()*1920,2+R()*7,R()*.4+.12,['#ff8aa0','#7dffb0','#7fb8ff'][i%3],R()*6]);
  const EX=600, EY=760, ER=230, RET=[EX+ER*0.93,EY], BX=540, BY=1200, BR=220, MY=1500;
  function label(txt,x,y,tx,ty,col,a){ if(a<=0) return; g.save(); g.globalAlpha=CL(a); g.font='800 40px '+SANS; const w=g.measureText(txt).width+52, s=0.85+0.15*EBK(a);
    g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=4; const lx=tx<x?x:(tx>x+w?x+w:x+w/2); g.beginPath(); g.moveTo(lx,y); g.lineTo(lx+(tx-lx)*E3(a),y+(ty-y)*E3(a)); g.stroke(); g.fillStyle='#fff'; g.beginPath(); g.arc(lx+(tx-lx)*E3(a),y+(ty-y)*E3(a),9,0,7); g.fill();
    g.translate(x+w/2,y); g.scale(s,s); g.translate(-x-w/2,-y); g.fillStyle='rgba(9,12,44,.88)'; g.beginPath(); g.roundRect(x,y-36,w,72,36); g.fill(); g.strokeStyle=col; g.lineWidth=2; g.stroke(); g.fillStyle='#fff'; g.fillText(txt,x+26,y+14); g.restore(); }
  function lemon(lt,a){ if(a<=0) return; const s=EBK(a); g.save(); g.translate(150-(1-E3(a))*260,EY+Math.sin(lt*1.1)*8); g.rotate(-0.3+Math.sin(lt*.8)*.05); g.scale(s,s);
    g.shadowColor='#ffe25a'; g.shadowBlur=60; g.fillStyle='#ffd83a'; g.beginPath(); g.ellipse(0,0,95,70,0,0,7); g.fill(); g.beginPath(); g.ellipse(-96,0,20,14,0,0,7); g.fill(); g.beginPath(); g.ellipse(96,0,20,14,0,0,7); g.fill(); g.shadowBlur=0;
    g.fillStyle='#fff3a6'; g.beginPath(); g.ellipse(-30,-28,34,14,-0.4,0,7); g.fill(); g.fillStyle='#5cc46a'; g.beginPath(); g.ellipse(70,-70,40,16,-0.7,0,7); g.fill(); g.restore(); }
  function rays(lt,f,flash){ if(f<=0) return; g.save(); g.lineCap='round'; g.lineJoin='round';
    [-60,0,60].forEach((d,i)=>{ const P=[[250,EY+d*.6],[EX-ER+40,EY+d],[RET[0]-8,RET[1]]], L1=Math.hypot(P[1][0]-P[0][0],P[1][1]-P[0][1]), L2=Math.hypot(P[2][0]-P[1][0],P[2][1]-P[1][1]), L=(L1+L2)*f;
      g.strokeStyle='rgba(255,226,90,.85)'; g.shadowColor='#ffe25a'; g.shadowBlur=24; g.lineWidth=12; g.beginPath(); g.moveTo(P[0][0],P[0][1]);
      if(L<=L1){ const u=L/L1; g.lineTo(P[0][0]+(P[1][0]-P[0][0])*u,P[0][1]+(P[1][1]-P[0][1])*u); } else { const u=(L-L1)/L2; g.lineTo(P[1][0],P[1][1]); g.lineTo(P[1][0]+(P[2][0]-P[1][0])*u,P[1][1]+(P[2][1]-P[1][1])*u); } g.stroke(); });
    if(f>=1) for(let i=0;i<10;i++){ const u=(i/10+lt*.25)%1, x=250+(RET[0]-250)*u; g.fillStyle='#fff6b0'; g.shadowBlur=18; g.beginPath(); g.arc(x,EY+Math.sin(u*9+i)*10*(1-u),6,0,7); g.fill(); }
    if(flash>0){ g.globalAlpha=flash; g.fillStyle='#fff6b0'; g.shadowBlur=60; g.beginPath(); g.arc(RET[0]-10,RET[1],20+30*flash,0,7); g.fill(); }
    g.restore(); }
  function eye(lt,a,nerve){ if(a<=0) return; const s=EBK(a); g.save(); g.translate(EX,EY); g.scale(s,s); g.translate(-EX,-EY); g.globalAlpha=CL(a*3);
    if(nerve>0){ g.strokeStyle='#ffb36a'; g.lineWidth=40; g.lineCap='round'; g.shadowColor='#ffb36a'; g.shadowBlur=20*nerve; g.beginPath(); g.moveTo(EX+ER-10,EY+40); g.quadraticCurveTo(EX+ER+80,EY+60,EX+ER-10+(1110-EX-ER+10)*nerve,EY+40-80*nerve); g.stroke(); g.shadowBlur=0; }
    g.shadowColor='rgba(170,190,255,.6)'; g.shadowBlur=60; g.fillStyle='#e9ecff'; g.beginPath(); g.arc(EX,EY,ER,0,7); g.fill(); g.shadowBlur=0;
    g.fillStyle='#f5f6ff'; g.beginPath(); g.arc(EX-10,EY-12,ER*.92,0,7); g.fill();
    g.strokeStyle='#ff8aa0'; g.lineWidth=22; g.beginPath(); g.arc(EX,EY,ER-16,-1.1,1.1); g.stroke();
    g.fillStyle='rgba(140,220,255,.55)'; g.beginPath(); g.ellipse(EX-ER+4,EY,40,112,0,Math.PI/2,Math.PI*1.5); g.fill();
    const pu=Math.sin(lt*1.3)*6; g.fillStyle='#6b4fd8'; g.fillRect(EX-ER+18,EY-140,26,86-pu); g.fillRect(EX-ER+18,EY+54+pu,26,86-pu);
    g.fillStyle='rgba(180,240,255,.9)'; g.shadowColor='#8fdcff'; g.shadowBlur=20; g.beginPath(); g.ellipse(EX-ER+70,EY,30,66,0,0,7); g.fill(); g.restore(); }
  const CONES=[0,1,2,1,0,1,0,2,1], CC=['#ff5d7a','#4fe08a','#5d8bff'];
  function bubble(lt,a,on){ if(a<=0) return; const s=EBK(a);
    g.save(); g.globalAlpha=CL(a*2)*0.6; g.strokeStyle='#fff'; g.lineWidth=4; g.setLineDash([14,12]); g.beginPath(); g.moveTo(RET[0]-30,RET[1]+60); g.lineTo(BX+BR*.7,BY-BR*.7); g.moveTo(RET[0]-60,RET[1]+20); g.lineTo(BX-BR*.8,BY-BR*.6); g.stroke(); g.restore();
    const cx=RET[0]+(BX-RET[0])*E3(a), cy=RET[1]+(BY-RET[1])*E3(a); g.save(); g.translate(cx,cy); g.scale(s,s); g.translate(-BX,-BY);
    g.shadowColor='rgba(170,190,255,.5)'; g.shadowBlur=50; g.fillStyle='#1b2370'; g.beginPath(); g.arc(BX,BY,BR,0,7); g.fill(); g.shadowBlur=0; g.strokeStyle='#e9ecff'; g.lineWidth=8; g.stroke();
    g.beginPath(); g.arc(BX,BY,BR-4,0,7); g.clip();
    for(let i=0;i<9;i++){ const kind=CONES[i], lit=kind<2?on:0, x=BX-200+i*50, y=BY+50+Math.sin(lt*1.5+i)*3, pulse=lit*(0.75+0.25*Math.sin(lt*5+i)), ap=CL((a-0.3-i*0.04)*3);
      g.globalAlpha=ap*(kind<2?0.4+0.6*on:0.4); g.fillStyle=CC[kind]; if(lit>0.3){ g.shadowColor=CC[kind]; g.shadowBlur=40*pulse; }
      g.beginPath(); g.moveTo(x-19,y+110); g.lineTo(x-19,y); g.quadraticCurveTo(x,y-96,x+19,y); g.lineTo(x+19,y+110); g.closePath(); g.fill(); g.shadowBlur=0;
      g.fillStyle='rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(x-5,y-18,5,20,0,0,7); g.fill(); }
    g.globalAlpha=1; if(on>0) for(let i=0;i<8;i++){ const u=(i/8+lt*.45)%1; g.globalAlpha=CL(on*2)*(1-u*.6); g.fillStyle='#fff3a0'; g.shadowColor='#ffe25a'; g.shadowBlur=16; g.beginPath(); g.arc(BX-180+i*50,BY-170+u*190,7,0,7); g.fill(); }
    g.restore(); }
  function mix(lt,a1,a2,a3){ const y=MY; g.save(); g.textAlign='center'; g.font='800 56px '+SANS;
    const dot=(x,c,r,a)=>{ if(a<=0) return; const s=EBK(a); g.save(); g.translate(x,y+Math.sin(lt*2+x)*4); g.scale(s,s); g.globalAlpha=CL(a*3); g.fillStyle=c; g.shadowColor=c; g.shadowBlur=30; g.beginPath(); g.arc(0,0,r,0,7); g.fill(); g.restore(); };
    dot(600,'#ff5d7a',34,a1); if(a1>0.5){ g.globalAlpha=CL((a1-.5)*2); g.fillStyle='#fff'; g.fillText('+',665,y+18); } dot(730,'#4fe08a',34,a2);
    if(a3>0){ g.globalAlpha=CL(a3*2); g.fillStyle='#fff'; g.fillText('=',800,y+18); } dot(900,'#ffd83a',50,a3); g.restore(); }
  SCN[0]=function(lt){ g.clearRect(0,0,1080,1920); const z=1+0.05*EIO(lt/6.5); g.drawImage(bg,0,0);
    DOTS.forEach(([x,y,r,a,c,ph])=>{ g.globalAlpha=a*(.6+.4*Math.sin(lt*2+ph)); g.fillStyle=c; g.beginPath(); g.arc(x+Math.sin(lt*.5+ph)*12,y-lt*6,r,0,7); g.fill(); }); g.globalAlpha=1;
    g.save(); g.translate(540,900); g.scale(z,z); g.translate(-540,-900);
    const rf=EIO((lt-0.75)/1.0), fl=lt>1.75?Math.sin(CL((lt-1.75)/0.5)*Math.PI):0, on=EIO((lt-2.9)/0.6);
    eye(lt,CL((lt-0.05)/0.45),EIO((lt-4.0)/0.6)); rays(lt,rf,fl); lemon(lt,CL((lt-0.3)/0.45)); bubble(lt,CL((lt-2.2)/0.55),on);
    mix(lt,CL((lt-4.1)/0.35),CL((lt-4.35)/0.35),CL((lt-4.7)/0.4));
    label('Light hits the retina',380,470,RET[0]-14,RET[1]-60,'#ffe25a',CL((lt-1.9)/0.4));
    label('3 kinds of cones',90,940,BX-150,BY-60,'#ff8aa0',CL((lt-3.2)/0.4));
    label('Brain mixes:',90,MY,560,MY,'#4fe08a',CL((lt-4.0)/0.4));
    g.restore();
    g.save(); g.shadowColor='rgba(0,0,0,.5)'; g.shadowBlur=20; g.font='800 84px '+SANS; const h1=E3((lt-0.15)/0.45), h2=E3((lt-0.4)/0.45);
    g.textAlign='center'; g.globalAlpha=h1; g.fillStyle='#fff'; g.fillText('Your eye sees color',540,250+(1-h1)*24);
    const a='with just ', b='3 sensors', wa=g.measureText(a).width, wb=g.measureText(b).width, x0=540-(wa+wb)/2; g.textAlign='left'; g.globalAlpha=h2; g.fillText(a,x0,350+(1-h2)*24);
    const gr=g.createLinearGradient(x0+wa,0,x0+wa+wb,0); gr.addColorStop(0,'#ff5d7a'); gr.addColorStop(.5,'#4fe08a'); gr.addColorStop(1,'#5d8bff'); g.fillStyle=gr; g.shadowColor='rgba(160,200,255,.7)'; g.shadowBlur=30; g.fillText(b,x0+wa,350+(1-h2)*24); g.restore(); };
})();

// =============== S1 paper-collage: how the Great Wall was built ===============
// Facts (China State Administration of Cultural Heritage 2012 survey; Britannica; Yang et al., Acc. Chem. Res. 2010): all sections built by many
// dynasties add up to about 21,196 km; building ran from about the 7th century BC to the Ming (ended 1644), i.e. over 2,000 years; Ming builders
// mixed sticky-rice soup into lime mortar. Own drawing, no real section or photo copied.
(function(){ const g=C2('cv1'), MK="'Permanent Marker',Inter,sans-serif";
  const paper=off(1080,1920,(p,w,h)=>{ p.fillStyle='#efe6d2'; p.fillRect(0,0,w,h); const R=R0(4);
    for(let i=0;i<9000;i++){ p.strokeStyle='rgba(120,95,60,'+(R()*.08)+')'; p.lineWidth=1; const x=R()*w,y=R()*h,a=R()*6.28,l=4+R()*14; p.beginPath(); p.moveTo(x,y); p.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } });
  const SKY=off(1200,800,(p)=>{ p.translate(600,400); p.rotate(0.006); tornPath(p,-580,-330,1160,660,5,12); const sk=p.createLinearGradient(0,-330,0,330); sk.addColorStop(0,'#f2c9a0'); sk.addColorStop(1,'#f6e2b8'); p.fillStyle=sk; p.fill(); });
  const SUN=sticker(off(150,150,(p)=>{ p.fillStyle='#e8553a'; p.beginPath(); p.arc(75,75,70,0,7); p.fill(); }),0);
  function ridgeY(x,k){ return [680,800,960][k]-Math.sin(x*.006+k*1.7)*90-Math.sin(x*.017+k)*36; }
  const RIDGES=[0,1,2].map(k=>off(1080,1920,(p)=>{ const R=R0(30+k); p.beginPath(); p.moveTo(-20,1940); for(let x=-20;x<=1100;x+=24) p.lineTo(x,ridgeY(x,k)+(R()-.5)*8); p.lineTo(1100,1940); p.closePath();
    p.fillStyle=['#a9b58a','#7f9a68','#5d7a4c'][k]; p.shadowColor='rgba(60,40,20,.4)'; p.shadowBlur=16; p.shadowOffsetY=-6; p.fill(); p.shadowColor='transparent';
    p.save(); p.clip(); for(let y=500;y<1920;y+=12) for(let x=(y/12%2)*6;x<1080;x+=12){ p.fillStyle='rgba(30,50,25,.18)'; p.beginPath(); p.arc(x,y,0.6+2.6*CL((y-500)/1100),0,7); p.fill(); } p.restore(); }));
  function wall(k,w,tw,towers,prog,lt){ if(prog<=0) return; const X1=-20+1120*prog, pts=[]; for(let x=-20;x<=Math.min(1100,X1);x+=10) pts.push([x,ridgeY(x,k)+6]); if(pts.length<2) return;
    g.save(); g.lineJoin='round'; g.lineCap='round'; g.strokeStyle='#5a4636'; g.lineWidth=w+8; g.beginPath(); pts.forEach(([x,y],i)=>i?g.lineTo(x,y-w/2):g.moveTo(x,y-w/2)); g.stroke();
    g.strokeStyle='#c9ad86'; g.lineWidth=w; g.stroke();
    g.fillStyle='#c9ad86'; for(let i=0;i<pts.length;i+=2){ const [x,y]=pts[i]; g.fillRect(x-tw/2,y-w-tw*.9,tw*.7,tw*.9); }
    g.strokeStyle='rgba(90,70,54,.5)'; g.lineWidth=2; for(let i=0;i<pts.length;i++){ const [x,y]=pts[i]; g.beginPath(); g.moveTo(x,y-w+4); g.lineTo(x,y-4); g.stroke(); }
    towers.forEach(x=>{ if(x>X1) return; const a=CL((X1-x)/90), s=EBK(a), y=ridgeY(x,k)+6; g.save(); g.translate(x,y); g.scale(1,s); g.translate(-x,-y);
      g.fillStyle='#b89c76'; g.shadowColor='rgba(40,30,20,.4)'; g.shadowBlur=10; g.shadowOffsetY=6; g.fillRect(x-tw*1.6,y-w-tw*3.2,tw*3.2,tw*3.2+w); g.shadowColor='transparent';
      g.fillStyle='#5a4636'; g.fillRect(x-tw*.5,y-w-tw*2.2,tw,tw*1.1); for(let j=0;j<4;j++) g.fillRect(x-tw*1.6+j*tw*.95,y-w-tw*3.6,tw*.6,tw*.45); g.restore(); });
    g.restore(); }
  const BOWL=sticker(off(260,220,(p)=>{ p.fillStyle='#fbfaf5'; p.beginPath(); p.ellipse(130,96,112,70,0,Math.PI,0); p.fill();
    for(let i=0;i<90;i++){ const R=R0(i+5),a=Math.PI+R()*Math.PI,rr=R(),x=130+Math.cos(a)*104*rr,y=96+Math.sin(a)*64*rr; p.fillStyle='#fffdf6'; p.beginPath(); p.ellipse(x,y,11,6,R()*3,0,7); p.fill(); p.strokeStyle='#b8ae98'; p.lineWidth=1.6; p.stroke(); }
    p.fillStyle='#2f6fb3'; p.beginPath(); p.moveTo(6,96); p.quadraticCurveTo(130,280,254,96); p.closePath(); p.fill(); p.strokeStyle='#fbfaf5'; p.lineWidth=6; p.beginPath(); p.moveTo(40,136); p.quadraticCurveTo(130,186,220,136); p.stroke(); }),7);
  const BRICKS=sticker(off(300,200,(p)=>{ p.fillStyle='#ece7da'; p.fillRect(0,0,300,200); for(let r=0;r<4;r++) for(let c=-1;c<4;c++){ p.fillStyle=['#a7896a','#9a7d60','#b29474'][(r+c+3)%3]; p.fillRect(c*90+(r%2)*45+6,r*50+6,82,40); } }),7);
  function hand(t,x,y,col,size,rot,a){ if(a<=0) return; g.save(); g.translate(x,y); g.rotate(rot||0); const s=0.6+0.4*EBK(a); g.scale(s,s); g.globalAlpha=CL(a*2.5); g.font=(size||52)+'px '+MK; g.fillStyle=col; g.fillText(t,0,0); g.restore(); }
  function pop(img,x,y,a,rot){ if(a<=0) return; const s=EBK(a); g.save(); g.translate(x+img.width/2,y+img.height); g.rotate(rot||0); g.scale(s,s); g.globalAlpha=CL(a*3); g.drawImage(img,-img.width/2,-img.height); g.restore(); }
  SCN[1]=function(lt){ g.clearRect(0,0,1080,1920); const z=1+0.045*EIO(lt/6.5), q=Math.floor(lt*12)/12, wob=Math.sin(q*3)*0.012;
    g.save(); g.translate(540,900); g.scale(z,z); g.translate(-540,-900);
    g.drawImage(paper,0,0); const sa=E3(lt/0.45); g.save(); g.globalAlpha=CL(sa*2); g.drawImage(SKY,-60,320+(1-sa)*80); g.restore();
    const su=E3((lt-0.1)/0.5); g.drawImage(SUN,800-75-SUN.ox,560-75-SUN.oy+(1-su)*-260+Math.sin(q*1.3)*3);
    const r0=E3((lt-0.05)/0.5), r1=E3((lt-0.15)/0.5), r2=E3((lt-0.25)/0.5);
    g.drawImage(RIDGES[0],0,(1-r0)*500); g.drawImage(RIDGES[1],0,(1-r1)*600);
    g.save(); g.translate(0,(1-r1)*600); wall(1,22,12,[180,620,980],EIO((lt-0.85)/1.6),lt); g.restore();
    g.drawImage(RIDGES[2],0,(1-r2)*700);
    g.save(); g.translate(0,(1-r2)*700); wall(2,40,20,[340,860],EIO((lt-0.6)/1.6),lt); g.restore();
    const ty=ridgeY(860,2);
    hand('watchtower',700,ty-150,'#17222b',46,-0.04,CL((lt-2.2)/0.35));
    const wl=EIO((lt-2.3)/0.3); if(wl>0) marker(g,[[800,ty-138],[828,ty-118],[846,ty-104]],wl,7,'#17222b');
    pop(BOWL,90-BOWL.ox,1060-BOWL.oy,CL((lt-2.6)/0.4),wob); hand('+',410,1210,'#d7262e',110,0,CL((lt-2.85)/0.3)); pop(BRICKS,490-BRICKS.ox,1060-BRICKS.oy,CL((lt-2.95)/0.4),-wob);
    hand('sticky rice',96,1080,'#17222b',48,-0.04,CL((lt-3.0)/0.35)); hand('lime mortar',520,1050,'#17222b',48,-0.03,CL((lt-3.1)/0.35));
    const ar=EIO((lt-3.3)/0.5); if(ar>0){ const e=marker(g,[[650,1250],[740,1150],[810,1060],[860,ty-6]],ar,10,'#d7262e'); if(ar>0.97) arrowHead(g,e[0],e[1],e[2],28,10,'#d7262e'); }
    paperTag(g,lt,3.9,40,1265,0.02+wob,'Glued with rice','sticky rice soup in the mortar',32,1);
    paperTag(g,lt,4.4,330,1410,-0.02-wob,'Built for 2,000 years','by many dynasties, wall by wall',33,1);
    const ta=CL((lt-0.15)/0.45); if(ta>0){ const s=EBK(ta); g.save(); g.translate(540,345); g.rotate(-0.012+(1-s)*0.1+wob*.5); g.scale(0.5+0.5*s,0.5+0.5*s); g.globalAlpha=CL(ta*3); g.translate(-490,-135); const W=980,H=270;
      tornPath(g,0,0,W,H,21,8); g.fillStyle='#fbf8f0'; g.shadowColor='rgba(30,20,10,.4)'; g.shadowBlur=20; g.shadowOffsetY=10; g.fill(); g.shadowColor='transparent';
      g.fillStyle='#17222b'; g.font='400 92px '+DISP; g.fillText('The Great Wall is',40,106); const a='21,196 km', wa=g.measureText(a).width, hl=EIO((lt-0.7)/0.4);
      if(hl>0){ g.fillStyle='rgba(255,214,0,.92)'; g.beginPath(); g.moveTo(32,148); g.lineTo(32+(24+wa)*hl,142); g.lineTo(34+(24+wa)*hl,226); g.lineTo(32,222); g.closePath(); g.fill(); }
      g.fillStyle='#17222b'; g.fillText(a+' long',40,210); g.fillStyle='rgba(240,232,200,.85)'; g.save(); g.translate(W-60,-6); g.rotate(0.5); g.fillRect(-56,-16,112,34); g.restore(); g.restore(); }
    g.drawImage(GRAIN,0,0); g.restore(); };
})();

// =============== S2 painted-story: the lighthouse of Alexandria ===============
// Facts (Britannica; World History Encyclopedia): the Pharos was finished around 280 BC under Ptolemy II at Alexandria; estimates put it at about
// 100 m, in 3 tiers (square, octagonal, round) with a fire at the top; it stood for well over 1,000 years until earthquakes wrecked it
// (ruined by the 14th century). Own drawing after the usual 3-tier reconstructions.
(function(){ const g=C2('cv2');
  function strokes(p,n,R,x0,y0,w,h,cols,len,wid,ang,a0,a1){ a0=a0??0.08; a1=a1??0.22; for(let i=0;i<n;i++){ const x=x0+R()*w,y=y0+R()*h,l=len*(0.5+R()),a=(ang||0)+(R()-.5)*0.5;
    p.strokeStyle=cols[Math.floor(R()*cols.length)]; p.globalAlpha=a0+R()*a1; p.lineWidth=wid*(0.5+R()); p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5+(R()-.5)*6,x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } p.globalAlpha=1; }
  const HZ=1240, LX=640, TOP=560, OFF=90;
  const sky=off(1080,1920,(p,w,h)=>{ const R=R0(16); const s=p.createLinearGradient(0,0,0,HZ); s.addColorStop(0,'#0e1630'); s.addColorStop(.6,'#22305a'); s.addColorStop(1,'#3d4a78'); p.fillStyle=s; p.fillRect(0,0,w,HZ+10);
    strokes(p,1800,R,0,0,w,HZ,['#1a2444','#2a3866','#11192f','#36457a'],170,34,0);
    for(let i=0;i<160;i++){ p.fillStyle='rgba(255,250,230,'+(R()*.8)+')'; p.beginPath(); p.arc(R()*w,R()*HZ*.8,R()*2.6,0,7); p.fill(); }
    const sea=p.createLinearGradient(0,HZ,0,h); sea.addColorStop(0,'#1d2a52'); sea.addColorStop(1,'#0a1028'); p.fillStyle=sea; p.fillRect(0,HZ,w,h-HZ);
    strokes(p,1500,R,-40,HZ,w+80,h-HZ,['#2a3a70','#13204a','#3a4c86','#0e1838'],140,20,0,0.15,0.3); });
  const TOWER=off(1080,1920,(p)=>{ const R=R0(9);
    p.fillStyle='#2a2a3a'; p.beginPath(); p.moveTo(380,HZ+40); p.quadraticCurveTo(450,HZ-60,LX,HZ-70); p.quadraticCurveTo(830,HZ-60,900,HZ+40); p.closePath(); p.fill();
    strokes(p,200,R,400,HZ-70,480,110,['#3a3a4c','#1e1e2c','#4a4458'],50,12,0,0.15,0.25);
    const tier=(x0,x1,y0,y1,c1,c2)=>{ const gr=p.createLinearGradient(x0,0,x1,0); gr.addColorStop(0,c2); gr.addColorStop(.35,c1); gr.addColorStop(1,c2); p.fillStyle=gr; p.fillRect(x0,y0,x1-x0,y1-y0); };
    tier(LX-130,LX+130,880,HZ-60,'#d9b98a','#6a5a5a'); tier(LX-90,LX+90,690,880,'#e2c49a','#6e5e5c'); tier(LX-55,LX+55,600,690,'#ecd2a6','#76645e');
    p.fillStyle='#f1dcb4'; [[LX-150,870,300,16],[LX-104,682,208,12],[LX-68,592,136,10]].forEach(([x,y,w2,h2])=>p.fillRect(x,y,w2,h2));
    p.fillStyle='#2a2030'; for(let r=0;r<5;r++) for(let c=0;c<3;c++) p.fillRect(LX-80+c*70,930+r*56,16,28); for(let r=0;r<3;r++) p.fillRect(LX-8,720+r*52,16,26);
    strokes(p,700,R,LX-130,600,260,HZ-660,['#c9a878','#8a7466','#f0d8ae','#5a4a50'],40,8,1.57,0.08,0.18);
    p.fillStyle='#4a3a3a'; for(let i=0;i<4;i++) p.fillRect(LX-48+i*30,TOP-20,8,40); p.fillStyle='#e9cfa2'; p.beginPath(); p.moveTo(LX-60,TOP-20); p.lineTo(LX,TOP-70); p.lineTo(LX+60,TOP-20); p.closePath(); p.fill(); });
  const BOIL=[0,1,2].map(k=>off(1080,1920,(p)=>{ const R=R0(17+k*31); strokes(p,420,R,-50,0,1180,1920,['#9fb6d6','#020812','#f4d79c'],120,22,0.1,0.02,0.05); }));
  function ship(x,y,s,lt){ g.save(); g.translate(x,y+Math.sin(lt*1.3+x*.01)*5); g.scale(s,s); g.rotate(Math.sin(lt+x*.01)*.03); g.fillStyle='#0b0e1c';
    g.beginPath(); g.moveTo(-120,0); g.quadraticCurveTo(0,40,130,0); g.lineTo(100,30); g.lineTo(-90,30); g.closePath(); g.fill();
    g.fillRect(-4,-170,8,170); g.fillStyle='#d9c9a6'; g.beginPath(); g.moveTo(-90,-160); g.quadraticCurveTo(0,-130,90,-160); g.lineTo(80,-30); g.quadraticCurveTo(0,-50,-80,-30); g.closePath(); g.fill();
    g.fillStyle='rgba(255,190,110,.35)'; g.beginPath(); g.moveTo(10,-160); g.quadraticCurveTo(50,-145,90,-160); g.lineTo(80,-30); g.quadraticCurveTo(45,-40,10,-35); g.closePath(); g.fill(); g.restore(); }
  const CAPT=[['280 BC: a fire 100 m above the sea.',-0.02,0.35],['Ships follow it home.',0.015,1.9],['It shone for over 1,000 years.',-0.01,3.4]];
  SCN[2]=function(lt){ g.clearRect(0,0,1080,1920); const q=Math.floor(lt*8), z=1.16-0.16*EIO(lt/5.6), fire=E3((lt-0.45)/0.6), beam=E3((lt-1.3)/0.6);
    g.save(); g.translate(LX,TOP+300); g.scale(z,z); g.translate(-LX,-TOP-300);
    g.drawImage(sky,0,0);
    if(beam>0){ const ang=-0.25+Math.sin((lt-1.3)*.6)*0.12; g.save(); g.globalAlpha=beam; g.translate(LX,TOP+OFF); g.rotate(Math.PI+ang); const bm=g.createLinearGradient(0,0,900,0); bm.addColorStop(0,'rgba(255,214,140,.65)'); bm.addColorStop(1,'rgba(255,214,140,0)');
      g.fillStyle=bm; g.beginPath(); g.moveTo(0,-10); g.lineTo(950,-170); g.lineTo(950,170); g.lineTo(0,10); g.closePath(); g.fill(); g.restore(); }
    if(fire>0){ const fl=0.85+0.15*Math.sin(q*2.1); const gl=g.createRadialGradient(LX,TOP+OFF,10,LX,TOP+OFF,420); gl.addColorStop(0,'rgba(255,200,120,'+(.75*fire*fl)+')'); gl.addColorStop(.3,'rgba(255,160,80,'+(.25*fire)+')'); gl.addColorStop(1,'rgba(255,160,80,0)'); g.fillStyle=gl; g.fillRect(0,0,1080,1300); }
    g.drawImage(TOWER,0,OFF);
    if(fire>0){ g.save(); g.shadowColor='#ffb347'; g.shadowBlur=60; for(let i=0;i<6;i++){ const f=Math.sin(lt*6+i)*6; g.fillStyle=['#fff1b8','#ffcf5a','#ff8a2a'][i%3]; g.beginPath(); g.ellipse(LX+(i-2.5)*8,TOP+OFF-6+f-(1-fire)*-20,(16-i)*fire,(30-i*2)*fire,0,0,7); g.fill(); } g.restore();
      const R=R0(5); for(let i=0;i<40;i++){ const y=HZ+20+i*14, w=70+R()*90-i*1.2; g.fillStyle='rgba(255,190,110,'+((0.45-i*.01)*fire)+')'; g.fillRect(LX-w/2+(R()-.5)*30+Math.sin(lt*2+i)*6,y,w,5); } }
    const sv=EIO((lt-1.6)/3.6); ship(-160+380*sv,1460,1,lt); ship(1240-340*EIO((lt-2.0)/3.4),1360,.6,lt); ship(-80+210*EIO((lt-2.4)/3.0),1270,.4,lt);
    const ca=CL((lt-3.9)/0.4); if(ca>0){ const s=EBK(ca); g.save(); g.translate(880,1420); g.rotate(0.06+(1-s)*0.4+Math.sin(q*.9)*0.012); g.scale(s,s); g.globalAlpha=CL(ca*3);
      tornPath(g,-100,-90,200,180,7,6); g.fillStyle='#f3e6c8'; g.shadowColor='rgba(0,5,15,.5)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
      g.fillStyle='#8a1c10'; g.fillRect(-100,-90,200,46); g.fillStyle='#f3e6c8'; g.font='italic 500 34px '+SERIF; g.textAlign='center'; g.fillText('Alexandria',0,-56); g.fillStyle='#2c1c0e'; g.font='italic 500 62px '+SERIF; g.fillText('280 BC',0,36); g.restore(); }
    g.restore();
    CAPT.forEach(([t,r,t0],i)=>{ const a=E3((lt-t0)/0.45); if(a<=0) return; g.save(); g.globalAlpha=CL(a*2); g.font='italic 500 60px '+SERIF; const w=g.measureText(t).width+60, y=230+i*104;
      g.translate(84+(1-a)*-80,y); g.rotate(r+Math.sin(q*.7+i)*0.004); tornPath(g,0,0,w,90,80+i,6); g.fillStyle='#f3e6c8'; g.shadowColor='rgba(0,5,15,.6)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
      g.strokeStyle='rgba(150,100,50,.35)'; g.lineWidth=3; g.stroke(); g.fillStyle=i===2?'#8a1c10':'#2c1c0e'; g.fillText(t,30,64); g.restore(); });
    g.drawImage(BOIL[q%3],0,0); g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,1000,380,540,1000,1300); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(4,6,16,.6)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920); };
})();
