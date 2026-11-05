// ================= 10 styles, same car (side view), each drawn in code =================
const CW=560, CH=996, SC=[];
const cl=(x)=>x<0?0:x>1?1:x, ease=(x)=>1-Math.pow(1-cl(x),3), easeIO=(x)=>{x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};
function rnd(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
function G(k){ return document.getElementById('cv'+k).getContext('2d'); }
function off(w,h,fn){ const c=document.createElement('canvas'); c.width=w; c.height=h; fn(c.getContext('2d'),w,h); return c; }
// car body path in local units: length ~316, ground at y=0, wheels at x=+-95 (front = +x)
function bodyPath(g){ g.beginPath(); g.moveTo(150,-30); g.lineTo(158,-46); g.quadraticCurveTo(157,-58,140,-61); g.lineTo(72,-66);
  g.quadraticCurveTo(42,-92,10,-98); g.lineTo(-52,-100); g.quadraticCurveTo(-92,-94,-118,-76); g.lineTo(-150,-68); g.quadraticCurveTo(-161,-60,-158,-44);
  g.lineTo(-152,-30); g.lineTo(-131,-30); g.arc(-95,-28,36,Math.PI,2*Math.PI); g.lineTo(59,-30); g.arc(95,-28,36,Math.PI,2*Math.PI); g.lineTo(150,-30); g.closePath(); }
function winPath(g){ g.beginPath(); g.moveTo(64,-65); g.quadraticCurveTo(38,-87,8,-92); g.lineTo(-48,-94); g.quadraticCurveTo(-84,-88,-104,-72); g.lineTo(-100,-66); g.closePath(); }
function wheel(g,x,r,rot,tyre,rim,spokes,line,lw){ g.save(); g.translate(x,-26); g.beginPath(); g.arc(0,0,r,0,7); g.fillStyle=tyre; g.fill(); if(line){ g.strokeStyle=line; g.lineWidth=lw; g.stroke(); }
  g.beginPath(); g.arc(0,0,r*0.58,0,7); g.fillStyle=rim; g.fill(); if(line){ g.stroke(); }
  if(spokes){ g.rotate(rot); g.strokeStyle=spokes; g.lineWidth=Math.max(2,r*0.12); for(let i=0;i<5;i++){ g.rotate(Math.PI*2/5); g.beginPath(); g.moveTo(0,0); g.lineTo(0,-r*0.55); g.stroke(); } }
  g.restore(); }
function car(g,x,y,s,o){ g.save(); g.translate(x,y); g.scale(s,s); o=o||{};
  if(o.shadow){ g.save(); g.fillStyle=o.shadow; g.beginPath(); g.ellipse(0,2,170,12,0,0,7); g.fill(); g.restore(); }
  bodyPath(g); if(o.body){ g.fillStyle=o.body; g.fill(); } if(o.line){ g.strokeStyle=o.line; g.lineWidth=o.lw||3; g.lineJoin='round'; g.stroke(); }
  if(o.win!==null){ winPath(g); g.fillStyle=o.win||'#bfe3ff'; g.fill(); if(o.line){ g.stroke(); } }
  if(o.door){ g.strokeStyle=o.door; g.lineWidth=o.dlw||2; g.beginPath(); g.moveTo(-22,-64); g.lineTo(-24,-32); g.stroke(); }
  if(o.light!==undefined){ g.fillStyle=o.light; g.beginPath(); g.ellipse(148,-48,7,4,0,0,7); g.fill(); }
  if(o.after) o.after(g);
  const r=o.wr||26; [-95,95].forEach(wx=>wheel(g,wx,r,o.rot||0,o.tyre||'#151515',o.rim||'#cfd3d8',o.spk,o.line,o.lw||3));
  g.restore(); }

// ---------- 0 Pixel RPG: low-res night city, pixel stars, car cruising, upscaled with no smoothing
(function(){ const g=G(0), w=112, h=199, lo=off(w,h,()=>{}), q=lo.getContext('2d'), R=rnd(3);
  const stars=[...Array(40)].map(()=>[R()*w|0,R()*90|0,R()]); const bld=[]; let x=0; while(x<w*2){ const bw=8+R()*14|0, bh=20+R()*50|0; bld.push([x,bw,bh,R()]); x+=bw+1; }
  SC[0]=function(lt){ q.imageSmoothingEnabled=false;
    const sky=['#140c2e','#23154a','#3a1f63','#5b2a74']; sky.forEach((c,i)=>{ q.fillStyle=c; q.fillRect(0,i*30,w,30); }); q.fillStyle='#7a3478'; q.fillRect(0,120,w,20);
    stars.forEach(([sx,sy,p])=>{ q.fillStyle=(Math.sin(lt*8+p*20)>0.3)?'#fff7c2':'#8f7fd0'; q.fillRect(sx,sy,1,1); });
    q.fillStyle='#ffe9a8'; q.fillRect(78,22,12,12); q.fillRect(76,24,16,8); q.fillRect(80,20,8,16); q.fillStyle='#e8cf86'; q.fillRect(82,26,3,3);
    const so=(lt*14)%((bld[bld.length-1][0])/2);
    bld.forEach(([bx,bw,bh,p])=>{ const X=Math.round(bx-so*0.5)%(w*2); const xx=X<-20?X+w*2:X; q.fillStyle=p>.5?'#1a1033':'#22143f'; q.fillRect(xx,150-bh,bw,bh);
      for(let yy=150-bh+3;yy<147;yy+=4) for(let xw=xx+2;xw<xx+bw-1;xw+=3) if(((xw*7+yy*13)%5)<2){ q.fillStyle='#ffcf4a'; q.fillRect(xw,yy,1,2); } });
    q.fillStyle='#2b2b3a'; q.fillRect(0,150,w,49); q.fillStyle='#3d3d52'; q.fillRect(0,150,w,2);
    for(let i=-1;i<8;i++){ q.fillStyle='#f2d34a'; q.fillRect(Math.round(i*16-(lt*40)%16),170,8,2); }
    // car (pixel sprite drawn from the same shape at tiny scale)
    const cx=Math.round(16+ease(lt/1.3)*30), cy=166+((lt*10|0)%2);
    q.save(); q.translate(cx+28,cy); q.scale(0.17,0.17); bodyPath(q); q.fillStyle='#e8343a'; q.fill(); winPath(q); q.fillStyle='#7fe3ff'; q.fill(); q.restore();
    q.fillStyle='#0d0d14'; [cx+12,cx+44].forEach(wx=>{ q.fillRect(wx,cy-6,6,6); }); q.fillStyle='#c9c9d6'; [cx+14,cx+46].forEach(wx=>q.fillRect(wx,cy-4,2,2));
    q.fillStyle='#fff6a0'; q.fillRect(cx+54,cy-9,2,2); q.fillStyle='rgba(255,246,160,.35)'; q.fillRect(cx+56,cy-10,14,4);
    q.fillStyle='#fff'; q.font='bold 8px monospace'; q.fillText('LV.1',5,12); q.fillStyle='#ff5a5a'; q.fillRect(26,6,30,4); q.fillStyle='#62ff7a'; q.fillRect(26,6,Math.round(10+20*cl(lt/1.2)),4);
    g.imageSmoothingEnabled=false; g.drawImage(lo,0,0,w,h,0,0,CW,CH); };
})();

// ---------- 1 Watercolor: paper, bleeding washes, the car painted in layers with pigment edges
(function(){ const g=G(1), R=rnd(9);
  const bg=off(CW,CH,(q)=>{ q.fillStyle='#f4efe4'; q.fillRect(0,0,CW,CH);
    const blob=(x,y,r,c,a,n)=>{ for(let i=0;i<n;i++){ q.globalAlpha=a; q.fillStyle=c; q.beginPath(); const rr=r*(0.7+R()*0.5); for(let k=0;k<=24;k++){ const an=k/24*Math.PI*2, j=rr*(0.85+R()*0.3); q.lineTo(x+Math.cos(an)*j+(R()-.5)*20,y+Math.sin(an)*j*0.8); } q.fill(); } q.globalAlpha=1; };
    q.filter='blur(6px)'; blob(160,220,260,'#9cc3e6',.08,10); blob(420,320,220,'#f2b5a7',.07,9); blob(300,140,200,'#b9d6ef',.07,8);
    q.filter='blur(3px)'; blob(80,700,300,'#9fc59a',.07,10); blob(480,720,280,'#86b38a',.07,10); blob(280,860,360,'#c9b79a',.06,8);
    q.filter='none'; for(let i=0;i<4000;i++){ q.fillStyle='rgba(120,100,70,'+(R()*0.06)+')'; q.fillRect(R()*CW,R()*CH,1+R()*2,1+R()*2); } });
  const paint=(lt)=>off(CW,CH,(q)=>{ const x=80+ease(lt/1.4)*130;
    for(let i=0;i<4;i++){ q.save(); q.globalAlpha=.28; q.filter='blur(1.5px)'; q.translate((i-1.5)*3,(i%2)*3); car(q,x+120,700,1.3,{body:'#d8343a',win:'rgba(150,200,240,.8)',tyre:'#3a3434',rim:'#bdb3a4'}); q.restore(); }
    q.save(); q.globalAlpha=.55; q.translate(x+120,700); q.scale(1.3,1.3); bodyPath(q); q.strokeStyle='#8f1a22'; q.lineWidth=2.4; q.stroke(); q.restore();
    q.save(); q.globalAlpha=.35; q.filter='blur(2px)'; q.fillStyle='#5a4a3a'; q.beginPath(); q.ellipse(x+120,706,200,12,0,0,7); q.fill(); q.restore(); });
  SC[1]=function(lt){ g.drawImage(bg,0,0); g.drawImage(paint(lt),0,0);
    g.save(); g.globalAlpha=.5; g.fillStyle='#3a2d22'; g.font='italic 34px "EB Garamond",serif'; g.fillText('a drive in late spring',60,140); g.restore(); };
})();

// ---------- 2 Ukiyo-e: cream paper, red sun, a big wave with foam claws, the car on a wooden bridge, flat colours + black outline
(function(){ const g=G(2), R=rnd(21);
  const paper=off(CW,CH,(q)=>{ q.fillStyle='#ecdcb8'; q.fillRect(0,0,CW,CH); for(let i=0;i<5000;i++){ q.fillStyle='rgba(110,80,40,'+(R()*0.07)+')'; q.fillRect(R()*CW,R()*CH,1,1+R()*3); } });
  SC[2]=function(lt){ g.drawImage(paper,0,0);
    g.fillStyle='#d23b2a'; g.beginPath(); g.arc(400,250,90,0,7); g.fill();
    g.fillStyle='rgba(205,150,120,.55)'; [[0,330,560,26],[60,380,420,18],[0,150,300,20]].forEach(([x,y,w,h])=>{ g.beginPath(); g.roundRect(x+Math.sin(lt)*10,y,w,h,h/2); g.fill(); });
    // wave
    const rise=ease(lt/1.3); const base=760, top=base-260-60*rise;
    g.save(); g.lineWidth=5; g.strokeStyle='#1b1712';
    g.beginPath(); g.moveTo(-20,base); g.bezierCurveTo(60,base-120,40,top+40,180,top); g.bezierCurveTo(300,top-30,360,top+60,320,top+110); g.bezierCurveTo(290,top+70,240,top+80,250,top+140); g.bezierCurveTo(300,base-80,420,base-30,600,base-40); g.lineTo(600,CH); g.lineTo(-20,CH); g.closePath();
    g.fillStyle='#1f3d6b'; g.fill(); g.stroke();
    g.strokeStyle='#e9f0f2'; g.lineWidth=3; for(let i=0;i<7;i++){ g.beginPath(); g.moveTo(0,base+20+i*26); g.bezierCurveTo(120,base-40+i*26-20*i,220,top+120+i*30,330,top+130+i*20); g.stroke(); }
    g.fillStyle='#f4f1e8'; for(let i=0;i<14;i++){ const a=i/13; const x=180+a*150, y=top-6+Math.sin(a*3)*24+(a>0.7?(a-0.7)*300:0); g.beginPath(); g.arc(x,y,7+(i%3)*1.5,0,7); g.fill(); g.strokeStyle='#1b1712'; g.lineWidth=2; g.stroke(); }
    g.restore();
    // bridge
    g.fillStyle='#7a4a2a'; g.strokeStyle='#1b1712'; g.lineWidth=4; g.beginPath(); g.moveTo(-10,820); g.quadraticCurveTo(280,760,570,820); g.lineTo(570,846); g.quadraticCurveTo(280,786,-10,846); g.closePath(); g.fill(); g.stroke();
    for(let i=0;i<9;i++){ const x=20+i*66; g.beginPath(); g.moveTo(x,820-Math.sin(i/8*Math.PI)*58+4); g.lineTo(x,900); g.stroke(); }
    const x=90+ease(lt/1.5)*200; const y=820-Math.sin((x+60)/580*Math.PI)*58-2;
    car(g,x+60,y,0.95,{body:'#c8322a',win:'#efe2c4',line:'#1b1712',lw:4.5,tyre:'#1b1712',rim:'#e6d7b0',door:'#1b1712',dlw:3});
    g.fillStyle='#b8322a'; g.fillRect(470,560,46,120); g.fillStyle='#ecdcb8'; [575,605,635,655].forEach((yy,i)=>g.fillRect(480+(i%2)*8,yy,26-(i%2)*8,6)); };
})();

// ---------- 3 Chalkboard: green board, the car sketched in chalk stroke by stroke, arrows and notes
(function(){ const g=G(3), R=rnd(5);
  const board=off(CW,CH,(q)=>{ const gr=q.createRadialGradient(280,450,50,280,500,700); gr.addColorStop(0,'#3c5c49'); gr.addColorStop(1,'#22382b'); q.fillStyle=gr; q.fillRect(0,0,CW,CH);
    for(let i=0;i<60;i++){ q.strokeStyle='rgba(255,255,255,'+(R()*0.05)+')'; q.lineWidth=20+R()*40; q.beginPath(); const x=R()*CW,y=R()*CH; q.moveTo(x,y); q.lineTo(x+R()*200-100,y+R()*60-30); q.stroke(); }
    q.strokeStyle='#7b5233'; q.lineWidth=26; q.strokeRect(0,0,CW,CH); q.strokeStyle='#5e3d25'; q.lineWidth=4; q.strokeRect(13,13,CW-26,CH-26); });
  function chalk(q,fn,a){ for(let i=0;i<3;i++){ q.save(); q.translate((R()-.5)*1.6,(R()-.5)*1.6); q.globalAlpha=a*(0.5+i*0.2); fn(); q.restore(); } }
  SC[3]=function(lt){ g.drawImage(board,0,0); const p=cl(lt/1.0);
    g.strokeStyle='#f2f2ea'; g.lineCap='round'; g.lineJoin='round';
    g.font='italic 48px "EB Garamond",serif'; g.fillStyle='rgba(245,245,235,.9)'; g.fillText('Roadster 101',60,140); g.lineWidth=3; g.beginPath(); g.moveTo(60,156); g.lineTo(60+300*p,156); g.stroke();
    g.save(); g.translate(280,640); g.scale(1.3,1.3); g.lineWidth=3; g.setLineDash([1400*p,2000]);
    chalk(g,()=>{ bodyPath(g); g.stroke(); winPath(g); g.stroke(); [-95,95].forEach(x=>{ g.beginPath(); g.arc(x,-26,26,0,7); g.stroke(); g.beginPath(); g.arc(x,-26,6,0,7); g.stroke(); }); },1);
    g.restore(); g.setLineDash([]);
    const a2=cl((lt-0.6)/0.4); g.globalAlpha=a2; g.lineWidth=4;
    g.beginPath(); g.moveTo(330,520); g.lineTo(470,520); g.moveTo(450,505); g.lineTo(470,520); g.lineTo(450,535); g.stroke();
    g.font='italic 36px "EB Garamond",serif'; g.fillText('thrust',350,500);
    g.beginPath(); g.moveTo(170,560); g.lineTo(80,560); g.moveTo(100,545); g.lineTo(80,560); g.lineTo(100,575); g.stroke(); g.fillText('drag',90,540);
    g.beginPath(); g.moveTo(280,700); g.lineTo(280,790); g.moveTo(265,770); g.lineTo(280,790); g.lineTo(295,770); g.stroke(); g.fillText('weight',300,780);
    g.globalAlpha=1; g.lineWidth=3; g.beginPath(); g.moveTo(40,646); g.lineTo(520,646); g.stroke(); };
})();

// ---------- 4 Neon Glow: synthwave sun, moving perspective grid, the car as glowing lines with light trails
(function(){ const g=G(4);
  SC[4]=function(lt){ g.fillStyle='#05020d'; g.fillRect(0,0,CW,CH);
    const sg=g.createLinearGradient(0,240,0,560); sg.addColorStop(0,'#ffd34a'); sg.addColorStop(1,'#ff2d7a'); g.fillStyle=sg; g.beginPath(); g.arc(280,520,190,Math.PI,2*Math.PI); g.fill();
    g.fillStyle='#05020d'; for(let i=0;i<7;i++){ g.fillRect(60,350+i*26+i*i*1.5,440,4+i*1.6); }
    const hz=560; g.fillStyle='#0b0420'; g.fillRect(0,hz,CW,CH-hz);
    g.strokeStyle='#d02bff'; g.lineWidth=2; g.shadowColor='#d02bff'; g.shadowBlur=12;
    for(let i=-12;i<=12;i++){ g.beginPath(); g.moveTo(280+i*14,hz); g.lineTo(280+i*120,CH); g.stroke(); }
    for(let i=0;i<14;i++){ const z=((i+lt*3)%14)/14; const y=hz+Math.pow(z,2.2)*(CH-hz); g.globalAlpha=0.3+z*0.7; g.beginPath(); g.moveTo(0,y); g.lineTo(CW,y); g.stroke(); } g.globalAlpha=1;
    // trails
    const x=290+Math.sin(lt*2)*10;
    g.shadowColor='#ff3df2'; g.strokeStyle='#ff3df2'; g.lineWidth=3; g.shadowBlur=18; for(let i=0;i<5;i++){ const ty=760-i*16; const L=200+((lt*600+i*90)%200); g.beginPath(); g.moveTo(x-210,ty); g.lineTo(x-210-L,ty); g.stroke(); }
    for(let pass=0;pass<2;pass++){ g.save(); g.shadowColor='#2ef2ff'; g.shadowBlur=pass?30:10; g.translate(x,800); g.scale(1.25,1.25); g.strokeStyle=pass?'#2ef2ff':'#e8ffff'; g.lineWidth=pass?4:2;
      bodyPath(g); g.stroke(); winPath(g); g.stroke(); g.beginPath(); g.moveTo(-22,-64); g.lineTo(-24,-32); g.stroke();
      [-95,95].forEach(wx=>{ g.save(); g.translate(wx,-26); g.strokeStyle='#ff3df2'; g.shadowColor='#ff3df2'; g.beginPath(); g.arc(0,0,26,0,7); g.stroke(); g.rotate(lt*14); for(let s=0;s<3;s++){ g.rotate(2.09); g.beginPath(); g.moveTo(0,0); g.lineTo(0,-18); g.stroke(); } g.restore(); });
      g.restore(); }
    g.shadowBlur=0; };
})();

// ---------- 5 Blueprint: blue sheet, grid, the car drawn in thin white lines with dimension lines and a title block
(function(){ const g=G(5);
  const sheet=off(CW,CH,(q)=>{ q.fillStyle='#1c4f8c'; q.fillRect(0,0,CW,CH); q.strokeStyle='rgba(255,255,255,.08)'; q.lineWidth=1;
    for(let x=0;x<CW;x+=20){ q.beginPath(); q.moveTo(x,0); q.lineTo(x,CH); q.stroke(); } for(let y=0;y<CH;y+=20){ q.beginPath(); q.moveTo(0,y); q.lineTo(CW,y); q.stroke(); }
    q.strokeStyle='rgba(255,255,255,.18)'; for(let x=0;x<CW;x+=100){ q.beginPath(); q.moveTo(x,0); q.lineTo(x,CH); q.stroke(); } for(let y=0;y<CH;y+=100){ q.beginPath(); q.moveTo(0,y); q.lineTo(CW,y); q.stroke(); }
    q.strokeStyle='rgba(255,255,255,.7)'; q.lineWidth=2; q.strokeRect(24,24,CW-48,CH-48); });
  function arrowLine(x1,y1,x2,y2){ g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke(); const a=Math.atan2(y2-y1,x2-x1);
    [[x1,y1,a+Math.PI],[x2,y2,a]].forEach(([x,y,b])=>{ g.beginPath(); g.moveTo(x,y); g.lineTo(x-Math.cos(b-0.4)*12,y-Math.sin(b-0.4)*12); g.moveTo(x,y); g.lineTo(x-Math.cos(b+0.4)*12,y-Math.sin(b+0.4)*12); g.stroke(); }); }
  SC[5]=function(lt){ g.drawImage(sheet,0,0); const p=cl(lt/0.9);
    g.save(); g.translate(285,620); g.scale(1.3,1.3); g.strokeStyle='#ffffff'; g.lineWidth=1.6; g.setLineDash([1500*p,3000]);
    bodyPath(g); g.stroke(); winPath(g); g.stroke(); g.beginPath(); g.moveTo(-22,-64); g.lineTo(-24,-32); g.stroke();
    [-95,95].forEach(x=>{ g.beginPath(); g.arc(x,-26,26,0,7); g.stroke(); g.beginPath(); g.arc(x,-26,15,0,7); g.stroke(); });
    g.setLineDash([]); g.restore();
    const a=cl((lt-0.55)/0.3); g.globalAlpha=a; g.strokeStyle='rgba(255,255,255,.85)'; g.lineWidth=1.4; g.setLineDash([6,5]);
    [-95,95].forEach(x=>{ const X=285+x*1.3; g.beginPath(); g.moveTo(X,500); g.lineTo(X,680); g.stroke(); g.beginPath(); g.moveTo(X-30,586); g.lineTo(X+30,586); g.stroke(); });
    g.setLineDash([]); arrowLine(285-158*1.3,700,285+158*1.3,700); arrowLine(285-95*1.3,722,285+95*1.3,722); arrowLine(500,620,500,620-100*1.3);
    g.fillStyle='#fff'; g.font='600 18px "JetBrains Mono",monospace'; g.textAlign='center'; g.fillText('LENGTH',285,694); g.fillText('WHEELBASE',285,744); g.save(); g.translate(522,555); g.rotate(-Math.PI/2); g.fillText('HEIGHT',0,0); g.restore(); g.textAlign='left';
    g.globalAlpha=cl((lt-0.3)/0.3); g.strokeStyle='#fff'; g.lineWidth=2; g.strokeRect(300,850,234,110); g.beginPath(); g.moveTo(300,890); g.lineTo(534,890); g.stroke();
    g.font='700 22px "JetBrains Mono",monospace'; g.fillText('ROADSTER',314,878); g.font='500 16px "JetBrains Mono",monospace'; g.fillText('SIDE VIEW',314,918); g.fillText('SHEET A-01',314,944);
    g.font='700 30px "JetBrains Mono",monospace'; g.fillText('// DESIGN',44,90); g.globalAlpha=1; };
})();

// ---------- 6 Comic Pop: halftone, action burst, speed lines, thick ink outline
(function(){ const g=G(6);
  const dots=off(CW,CH,(q)=>{ q.fillStyle='#ffd23f'; q.fillRect(0,0,CW,CH); for(let y=0;y<CH;y+=16) for(let x=(y/16%2)*8;x<CW;x+=16){ const d=Math.hypot(x-280,y-560)/700; q.fillStyle='#ff6b3d'; q.beginPath(); q.arc(x,y,Math.max(0,5.5-d*6),0,7); q.fill(); } });
  function burst(x,y,r1,r2,n,rot){ g.beginPath(); for(let i=0;i<n*2;i++){ const a=rot+i/(n*2)*Math.PI*2, r=i%2?r2:r1; g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r); } g.closePath(); }
  SC[6]=function(lt){ g.drawImage(dots,0,0); const sh=(Math.floor(lt*24)%2)?2:-2;
    g.strokeStyle='#111'; g.lineWidth=6; for(let i=0;i<9;i++){ const y=620+i*22, L=120+(i*53)%140; const x0=40+((lt*900+i*70)%120); g.beginPath(); g.moveTo(x0,y); g.lineTo(x0+L,y); g.stroke(); }
    const b=ease(lt/0.35); burst(300,330,180*b,110*b,12,lt*0.6); g.fillStyle='#fff'; g.fill(); g.lineWidth=7; g.stroke();
    g.save(); g.translate(300,345); g.rotate(-0.12); g.scale(b,b); g.font='900 92px Inter,sans-serif'; g.textAlign='center'; g.lineWidth=12; g.strokeStyle='#111'; g.strokeText('VROOM!',0,0); g.fillStyle='#e8263a'; g.fillText('VROOM!',0,0); g.restore();
    car(g,300+sh,780,1.3,{body:'#e8263a',win:'#8fe1ff',line:'#111',lw:5,tyre:'#111',rim:'#ffffff',door:'#111',dlw:4,spk:'#111',rot:lt*20,
      after:(q)=>{ q.fillStyle='rgba(255,255,255,.85)'; q.beginPath(); q.moveTo(-120,-72); q.lineTo(60,-62); q.lineTo(52,-58); q.lineTo(-118,-66); q.fill(); }});
    g.strokeStyle='#111'; g.lineWidth=10; g.strokeRect(5,5,CW-10,CH-10); };
})();

// ---------- 7 Papercut: layered paper hills with real drop shadows, parallax, a paper car on the top layer
(function(){ const g=G(7), R=rnd(13);
  const layers=[['#f7c8a8',560,60,0.2],['#e99b7b',640,70,0.35],['#c96f6a',730,60,0.55],['#8f4f6e',830,50,0.8],['#4f3557',930,40,1.0]];
  const hp=layers.map(([c,y,a],i)=>{ const pts=[]; for(let x=-200;x<=CW+400;x+=40) pts.push([x,y-a*(0.5+0.5*Math.sin(x/90+i*1.7))-R()*10]); return pts; });
  SC[7]=function(lt){ const sk=g.createLinearGradient(0,0,0,CH); sk.addColorStop(0,'#fde7cf'); sk.addColorStop(1,'#f7c8a8'); g.fillStyle=sk; g.fillRect(0,0,CW,CH);
    g.save(); g.shadowColor='rgba(80,30,30,.25)'; g.shadowBlur=20; g.shadowOffsetY=8; g.fillStyle='#fff3dd'; g.beginPath(); g.arc(380,300,80,0,7); g.fill();
    [[90,200],[300,150]].forEach(([x,y],i)=>{ const xx=x+lt*12*(i+1); g.beginPath(); g.ellipse(xx,y,60,22,0,0,7); g.ellipse(xx+40,y-14,40,22,0,0,7); g.fill(); });
    layers.forEach(([c,y,a,par],i)=>{ g.fillStyle=c; g.beginPath(); g.moveTo(-200,CH); hp[i].forEach(([x,yy])=>g.lineTo(x-lt*60*par,yy)); g.lineTo(CW+400,CH); g.closePath(); g.fill();
      if(i===3){ const x=120+ease(lt/1.4)*100; car(g,x+120,812,1.05,{body:'#d8343a',win:'#cfe6f2',tyre:'#3a2a3a',rim:'#fbf6ee',door:'rgba(0,0,0,.25)',after:(q)=>{ q.fillStyle='#fbf6ee'; q.fillRect(-150,-52,300,8); }}); } });
    g.restore(); };
})();

// ---------- 8 Claymation: stepped 12 fps, soft volume shading, finger marks, a little wobble
(function(){ const g=G(8), R=rnd(17);
  const fp=off(CW,CH,(q)=>{ q.strokeStyle='rgba(0,0,0,.05)'; q.lineWidth=1.2; for(let i=0;i<10;i++){ q.beginPath(); q.arc(260,640,20+i*7,3.6,5.2); q.stroke(); } });
  SC[8]=function(lt){ const t=Math.floor(lt*12)/12, wob=()=>((Math.sin(t*97.3)*43758.5)%1)*1.5;
    const bg=g.createLinearGradient(0,0,0,CH); bg.addColorStop(0,'#f1e3cf'); bg.addColorStop(.62,'#e7d1b3'); bg.addColorStop(.63,'#cfa982'); bg.addColorStop(1,'#b98f68'); g.fillStyle=bg; g.fillRect(0,0,CW,CH);
    const ball=(x,y,r,c1,c2)=>{ const gr=g.createRadialGradient(x-r*0.35,y-r*0.4,r*0.1,x,y,r); gr.addColorStop(0,c1); gr.addColorStop(1,c2); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); };
    g.fillStyle='#7a5a3a'; g.beginPath(); g.roundRect(78,420,22,200,10); g.fill(); ball(90,400,60,'#9ee08a','#3f8a3c'); ball(60,440,40,'#9ee08a','#3f8a3c'); ball(122,436,44,'#9ee08a','#3f8a3c');
    ball(420,200,46,'#ffffff','#d8d2cc'); ball(470,210,36,'#ffffff','#d8d2cc'); ball(380,214,30,'#ffffff','#d8d2cc');
    const x=150+Math.round(ease(t/1.3)*100), y=760+wob();
    g.save(); g.fillStyle='rgba(60,30,10,.25)'; g.filter='blur(8px)'; g.beginPath(); g.ellipse(x+80,y+6,230,18,0,0,7); g.fill(); g.restore();
    g.save(); g.translate(x+80,y); g.scale(1.3+wob()*0.004,1.3); g.lineJoin='round';
    bodyPath(g); const gr=g.createLinearGradient(0,-100,0,-20); gr.addColorStop(0,'#ff6a5e'); gr.addColorStop(1,'#b8261f'); g.fillStyle=gr; g.fill(); g.strokeStyle='#c9302a'; g.lineWidth=10; g.stroke();
    winPath(g); const gw=g.createLinearGradient(0,-95,0,-65); gw.addColorStop(0,'#eaf8ff'); gw.addColorStop(1,'#8fc7e6'); g.fillStyle=gw; g.fill(); g.strokeStyle='#c9302a'; g.lineWidth=6; g.stroke();
    g.fillStyle='rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(-30,-80,60,8,-0.05,0,7); g.fill();
    [-95,95].forEach(wx=>{ g.save(); g.translate(wx,-26); const r2=g.createRadialGradient(-8,-10,4,0,0,30); r2.addColorStop(0,'#5a5450'); r2.addColorStop(1,'#1d1a18'); g.fillStyle=r2; g.beginPath(); g.arc(0,0,28,0,7); g.fill();
      g.rotate(t*8); g.fillStyle='#e8e2d8'; g.beginPath(); g.arc(0,0,12,0,7); g.fill(); g.fillStyle='#bdb5a8'; g.beginPath(); g.arc(4,0,3,0,7); g.fill(); g.restore(); });
    g.restore(); g.drawImage(fp,x-180,y-660); };
})();

// ---------- 9 Low-poly PS1: real three.js at 160x284, flat shading, fog, chase camera, upscaled pixelated
(function(){ const cv=document.getElementById('gl9'); const ren=new THREE.WebGLRenderer({canvas:cv,antialias:false,preserveDrawingBuffer:true});
  ren.setPixelRatio(1); ren.setSize(160,284,false); cv.style.width='560px'; cv.style.height='996px';
  const sc=new THREE.Scene(); sc.background=new THREE.Color(0x6a8fb8); sc.fog=new THREE.Fog(0x6a8fb8,8,38);
  const cam=new THREE.PerspectiveCamera(60,160/284,0.1,100);
  sc.add(new THREE.HemisphereLight(0xdfeaff,0x3a3020,0.9)); const sun=new THREE.DirectionalLight(0xfff2d0,0.9); sun.position.set(3,6,2); sc.add(sun);
  const flat=(c)=>new THREE.MeshLambertMaterial({color:c,flatShading:true});
  const road=new THREE.Mesh(new THREE.PlaneGeometry(6,200),flat(0x4a4a50)); road.rotation.x=-Math.PI/2; sc.add(road);
  const grass=new THREE.Mesh(new THREE.PlaneGeometry(200,200),flat(0x4f7a3a)); grass.rotation.x=-Math.PI/2; grass.position.y=-0.01; sc.add(grass);
  const dashes=[]; for(let i=0;i<30;i++){ const d=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.01,1.2),flat(0xf2e14a)); d.position.set(0,0.01,-i*3); sc.add(d); dashes.push(d); }
  const trees=[]; const R=rnd(4); for(let i=0;i<26;i++){ const t=new THREE.Group(); const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.15,0.8,5),flat(0x6b4a2a)); tr.position.y=0.4; t.add(tr);
    const cn=new THREE.Mesh(new THREE.ConeGeometry(0.8,1.8,5),flat(0x2f6b33)); cn.position.y=1.6; t.add(cn); t.position.set((i%2?1:-1)*(4+R()*4),0,-i*4); sc.add(t); trees.push(t); }
  const car3=new THREE.Group(); sc.add(car3); const red=flat(0xd8263a);
  const b=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.45,3.4),red); b.position.y=0.55; car3.add(b);
  const cabG=new THREE.CylinderGeometry(0.62,0.82,0.5,4,1); cabG.rotateY(Math.PI/4); const cab=new THREE.Mesh(cabG,flat(0x9fd8ff)); cab.scale.set(1,1,1.4); cab.position.set(0,0.98,-0.2); car3.add(cab);
  const wh=[]; [[-0.8,1.1],[0.8,1.1],[-0.8,-1.1],[0.8,-1.1]].forEach(([x,z])=>{ const w=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.36,0.3,6),flat(0x18181c)); w.rotation.z=Math.PI/2; w.position.set(x,0.36,z); car3.add(w); wh.push(w); });
  const tl1=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.12,0.05),new THREE.MeshBasicMaterial({color:0xff3030})); tl1.position.set(0,0.62,1.72); car3.add(tl1);
  const mtn=new THREE.Mesh(new THREE.ConeGeometry(14,10,6),flat(0x5d6f8a)); mtn.position.set(-8,4,-60); sc.add(mtn); const mtn2=mtn.clone(); mtn2.position.set(14,3,-55); mtn2.scale.set(0.8,0.7,0.8); sc.add(mtn2);
  const out=document.getElementById('cv9');
  SC[9]=function(lt){ const z=-lt*9; car3.position.set(Math.sin(lt*2.2)*0.6,0,z); car3.rotation.y=Math.cos(lt*2.2)*0.18; car3.position.y=(Math.floor(lt*15)%2)*0.03;
    wh.forEach(w=>w.rotation.x=lt*12);
    dashes.forEach((d,i)=>{ d.position.z=-((i*3-z)%90)+z+10; }); trees.forEach((t,i)=>{ let tz=-i*4; while(tz>z+8) tz-=104; while(tz<z-96) tz+=104; t.position.z=tz; });
    const ca=0.5+lt*0.25; cam.position.set(car3.position.x+Math.sin(ca)*5.2,2.4,z+Math.cos(ca)*7.0); cam.lookAt(car3.position.x,0.6,z-0.5);
    ren.render(sc,cam); };
})();
