// ---------- countdown50: our own neon "launch countdown" over a synthwave coastal city at dusk, drawn 100% in canvas 2D.
// No Rockstar / GTA VI logo, typography, characters or game art: only the plain words "GTA 6" and the official date
// (Thu Nov 19 2026, Rockstar Newswire) in our own neon type. Deterministic: SCN[0](t) depends only on t (seeded PRNG, no Date).
(function(){
  const g=document.getElementById('cv0').getContext('2d'), W=1080, H=1920, HZ=1150;
  const CL=(x)=>x<0?0:x>1?1:x, E3=(x)=>1-Math.pow(1-CL(x),3), E5=(x)=>1-Math.pow(1-CL(x),5);
  const EBK=(x)=>{ x=CL(x); const c1=2.0,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); };
  const SANS="Inter,'DejaVu Sans',Helvetica,Arial,sans-serif";
  function R0(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
  function off(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; }
  const PINK='#ff2e9a', CYAN='#21e6ff';

  // ---------- skyline layers (pre-rendered, seeded)
  const ANT=[]; // antenna lights [layer, x, y, phase]
  function skyline(seed,w,h,minH,maxH,col,winP,neon,layer){
    return off(w,h,(p)=>{ const R=R0(seed); let x=-20;
      while(x<w){ const bw=46+R()*104, tall=R()<0.18, vc=0.45+0.55*Math.min(1,Math.abs(x+bw/2-w/2)/420), bh=(minH+Math.pow(R(),1.6)*(maxH-minH)*(tall?1.35:1))*vc, top=h-bh;
        p.fillStyle=col; p.fillRect(x,top,bw,bh);
        const kind=R();
        if(kind<0.22){ p.beginPath(); p.moveTo(x,top); p.lineTo(x+bw/2,top-bw*0.45); p.lineTo(x+bw,top); p.fill(); }
        else if(kind<0.42){ p.fillRect(x+bw*0.2,top-22,bw*0.6,22); p.fillRect(x+bw*0.48,top-70-R()*60,3,90); ANT.push([layer,x+bw*0.48+1.5,top-70-(R()*0+0)-10,R()*6.28]); }
        else if(kind<0.55){ p.fillRect(x+bw*0.3,top-14,bw*0.4,14); }
        if(winP>0){ for(let wy=top+16; wy<h-10; wy+=17) for(let wx=x+8; wx<x+bw-10; wx+=13){ if(R()<winP){ const c=R(); p.fillStyle=c<0.55?'rgba(255,196,120,'+(0.35+R()*0.5)+')':c<0.8?'rgba(255,90,190,'+(0.35+R()*0.5)+')':'rgba(90,230,255,'+(0.35+R()*0.5)+')'; p.fillRect(wx,wy,6,9); } } }
        if(neon && R()<0.4){ p.save(); const nc=R()<0.55?PINK:CYAN; p.strokeStyle=nc; p.shadowColor=nc; p.shadowBlur=14; p.lineWidth=3; p.beginPath(); p.moveTo(x+3,top+4); p.lineTo(x+bw-3,top+4); p.stroke();
          if(R()<0.5){ p.beginPath(); p.moveTo(x+4,top+4); p.lineTo(x+4,top+Math.min(bh-10,120+R()*160)); p.stroke(); } p.restore(); }
        x+=bw+(R()<0.3?R()*14:0); } });
  }
  const LW=1500;
  const L0=skyline(11,LW,520,80,250,'#3a1652',0.0,false,0);
  const L1=skyline(23,LW,640,110,330,'#1d0a33',0.10,false,1);
  const L2=skyline(37,LW,760,90,400,'#0b0418',0.22,true,2);
  // a vertical "HOTEL" neon sign on the near layer (generic word)
  const STARS=[]; { const R=R0(5); for(let i=0;i<150;i++) STARS.push([R()*W,R()*720,0.6+R()*1.8,R()*6.28,0.5+R()*2]); }
  const RAIN=[]; { const R=R0(91); for(let i=0;i<260;i++) RAIN.push([R()*1400-160,R()*H,26+R()*46,900+R()*700,0.08+R()*0.22]); }
  const RIP=[]; { const R=R0(57); for(let i=0;i<46;i++) RIP.push([R(),0.05+Math.pow(R(),0.7)*0.95,R()*1.3,0.9+R()*0.6]); }
  const CARS=[]; { const R=R0(73); for(let i=0;i<9;i++) CARS.push([i%4,R()*10,0.55+R()*0.6,R()<0.5]); }
  const GRAIN=off(540,960,(p,w,h)=>{ const R=R0(77); for(let i=0;i<26000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.16)+')':'rgba(255,255,255,'+(R()*.10)+')'; p.fillRect(R()*w,R()*h,1,1); } });
  const U=document.createElement('canvas'); U.width=W; U.height=HZ; const u=U.getContext('2d');

  // ---------- palm silhouette
  function palm(p,x,y,h,lean,t,ph,sc){ const sw=Math.sin(t*1.1+ph)*0.05+Math.sin(t*2.3+ph*2)*0.02, tx=x+lean*h+sw*h*0.4, ty=y-h;
    p.save(); p.fillStyle='#07020e'; p.beginPath(); const N=14;
    for(let i=0;i<=N;i++){ const k=i/N, bx=x+(tx-x)*k+Math.sin(k*3.1)*lean*h*0.25, by=y+(ty-y)*k, wd=(18-9*k)*sc; i?p.lineTo(bx-wd,by):p.moveTo(bx-wd,by); }
    for(let i=N;i>=0;i--){ const k=i/N, bx=x+(tx-x)*k+Math.sin(k*3.1)*lean*h*0.25, by=y+(ty-y)*k, wd=(18-9*k)*sc; p.lineTo(bx+wd,by); } p.fill();
    for(let f=0;f<9;f++){ const a=-Math.PI/2+(f-4)*0.42+sw*1.6+Math.sin(t*1.7+f+ph)*0.04, L=(150+((f*37)%5)*22)*sc, droop=0.9+Math.abs(f-4)*0.12;
      const ex=tx+Math.cos(a)*L*1.25, ey=ty+Math.sin(a)*L*0.55+L*droop*0.55, cx=tx+Math.cos(a)*L*0.7, cy=ty+Math.sin(a)*L*0.75-20*sc;
      p.beginPath(); p.moveTo(tx,ty); p.quadraticCurveTo(cx,cy-16*sc,ex,ey); p.quadraticCurveTo(cx,cy+18*sc,tx,ty+8*sc); p.fill(); }
    p.beginPath(); p.arc(tx,ty+6*sc,14*sc,0,7); p.fill(); p.restore(); }

  // ---------- seven-segment neon tube digits (our own type)
  const DW=72, DH=150, SEG={0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgedc',7:'abc',8:'abcdefg',9:'abcdfg'};
  function segPath(p,s){ const m=10, h2=DH/2; p.beginPath();
    if(s.includes('a')){ p.moveTo(m,0); p.lineTo(DW-m,0); } if(s.includes('g')){ p.moveTo(m,h2); p.lineTo(DW-m,h2); } if(s.includes('d')){ p.moveTo(m,DH); p.lineTo(DW-m,DH); }
    if(s.includes('f')){ p.moveTo(0,m); p.lineTo(0,h2-m); } if(s.includes('b')){ p.moveTo(DW,m); p.lineTo(DW,h2-m); }
    if(s.includes('e')){ p.moveTo(0,h2+m); p.lineTo(0,DH-m); } if(s.includes('c')){ p.moveTo(DW,h2+m); p.lineTo(DW,DH-m); } }
  function digit(p,x,y,d,col,a,boost){ p.save(); p.translate(x,y); p.transform(1,0,-0.1,1,0,0); p.lineCap='round';
    segPath(p,'abcdefg'); p.strokeStyle='rgba(255,255,255,'+(0.06*a)+')'; p.lineWidth=12; p.stroke();
    segPath(p,SEG[d]); p.globalAlpha=a; p.strokeStyle=col; p.shadowColor=col; p.shadowBlur=34+18*boost; p.lineWidth=16; p.stroke();
    p.shadowBlur=10; p.lineWidth=11; p.stroke(); p.shadowBlur=0; p.strokeStyle='rgba(255,255,255,'+(0.85+0.15*boost)+')'; p.lineWidth=4.5; p.stroke(); p.restore(); }
  function rollDigit(p,x,y,d0,d1,f,col,boost){ // f = 0..1 roll progress (eased with overshoot)
    if(d0===d1||f>=1){ digit(p,x,y,d1,col,1,boost); return; }
    const k=EBK(f), sh=DH*1.25; p.save(); p.beginPath(); p.rect(x-50,y-36,DW+100,DH+72); p.clip();
    digit(p,x,y-k*sh,d0,col,CL(1-k*1.2),0); digit(p,x,y+(1-k)*sh,d1,col,CL(k*1.4),boost); p.restore(); }
  const parts=(n)=>{ n=Math.max(0,n); const d=Math.floor(n/86400), hh=Math.floor(n/3600)%24, mm=Math.floor(n/60)%60, ss=n%60, p2=(v)=>[Math.floor(v/10)%10,v%10]; return [...p2(d),...p2(hh),...p2(mm),...p2(ss)]; };

  function neonText(p,txt,x,y,font,col,a,ls,blur){ p.save(); p.font=font; p.letterSpacing=ls+'px'; p.textAlign='center'; p.globalAlpha=a;
    p.shadowColor=col; p.shadowBlur=blur; p.fillStyle=col; p.fillText(txt,x,y); p.shadowBlur=blur*0.35; p.fillText(txt,x,y);
    p.shadowBlur=0; p.fillStyle='rgba(255,255,255,.92)'; p.fillText(txt,x,y); p.restore(); }
  function flick(t,seed){ if(t>0.9) return 0.94+0.06*Math.sin(t*37+seed)*Math.sin(t*11.3+seed*2); const s=Math.floor(t*22+seed); return (s*2654435761%7)<5?1:0.25; }

  SCN[0]=function(t){ t=Math.max(0,t); g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.globalCompositeOperation='source-over'; g.shadowBlur=0;
    const ox=46*Math.sin(t*0.42)+18*Math.sin(t*0.9+1), zoom=1.035+0.02*Math.sin(t*0.33), dusk=CL(t/10);
    // ===== upper world into buffer U (sky, sun, beams, skyline)
    u.setTransform(1,0,0,1,0,0); u.globalCompositeOperation='source-over';
    let gr=u.createLinearGradient(0,0,0,HZ); gr.addColorStop(0,'#05021a'); gr.addColorStop(0.32,'#160838'); gr.addColorStop(0.58,'#45105e'); gr.addColorStop(0.78,'#a51c6e'); gr.addColorStop(0.92,'#ff5a4a'); gr.addColorStop(1,'#ffb25a');
    u.fillStyle=gr; u.fillRect(0,0,W,HZ);
    STARS.forEach(([x,y,r,ph,sp])=>{ u.globalAlpha=(0.35+0.65*Math.abs(Math.sin(t*sp+ph)))*(1-y/760); u.fillStyle='#fff'; u.fillRect(x+ox*0.05,y,r,r); }); u.globalAlpha=1;
    // sun with sliding cut bands
    const sx=540+ox*0.12, sy=HZ-120+dusk*30, sr=300; u.save();
    let hg=u.createRadialGradient(sx,sy,sr*0.6,sx,sy,sr*2.3); hg.addColorStop(0,'rgba(255,90,140,.55)'); hg.addColorStop(1,'rgba(255,60,140,0)'); u.fillStyle=hg; u.fillRect(0,0,W,HZ);
    u.beginPath(); u.arc(sx,sy,sr,0,7); u.clip(); let sg=u.createLinearGradient(0,sy-sr,0,sy+sr*0.5); sg.addColorStop(0,'#fff2a8'); sg.addColorStop(0.45,'#ffb04a'); sg.addColorStop(1,'#ff2e88'); u.fillStyle=sg; u.fillRect(sx-sr,sy-sr,sr*2,sr*2);
    u.globalCompositeOperation='destination-out'; for(let i=0;i<9;i++){ const yy=sy-sr*0.1+((i*34+t*22)%306), th=2+((yy-(sy-sr*0.1))/306)*16; u.fillRect(sx-sr,yy,sr*2,th); } u.restore();
    // sweeping searchlight beams
    u.save(); u.globalCompositeOperation='lighter'; [[330,0.55,0.0,'90,230,255'],[790,0.47,2.2,'255,80,190'],[600,0.36,4.1,'190,150,255']].forEach(([bx,sp,ph,c])=>{ const a=-Math.PI/2+0.55*Math.sin(t*sp+ph), L=1300, x0=bx+ox*0.3, y0=HZ-260;
      const bgd=u.createLinearGradient(x0,y0,x0+Math.cos(a)*L,y0+Math.sin(a)*L); bgd.addColorStop(0,'rgba('+c+',.30)'); bgd.addColorStop(1,'rgba('+c+',0)'); u.fillStyle=bgd;
      u.beginPath(); u.moveTo(x0,y0); u.lineTo(x0+Math.cos(a-0.05)*L,y0+Math.sin(a-0.05)*L); u.lineTo(x0+Math.cos(a+0.05)*L,y0+Math.sin(a+0.05)*L); u.fill(); }); u.restore();
    // skyline parallax
    [[L0,0.25,520],[L1,0.55,640],[L2,1.0,760]].forEach(([L,dp,h],k)=>{ const x=(W-LW)/2+ox*dp*1.6; u.drawImage(L,x,HZ-h);
      if(k===0){ const hz=u.createLinearGradient(0,HZ-300,0,HZ); hz.addColorStop(0,'rgba(255,80,150,0)'); hz.addColorStop(1,'rgba(255,90,140,.35)'); u.fillStyle=hz; u.fillRect(0,HZ-300,W,300); }
      ANT.forEach(([l,ax,ay,ph])=>{ if(l!==k) return; const on=Math.sin(t*2.6+ph)>0.55; if(!on) return; u.save(); u.fillStyle='#ff3355'; u.shadowColor='#ff3355'; u.shadowBlur=14; u.beginPath(); u.arc(x+ax,HZ-h+ay,3.2,0,7); u.fill(); u.restore(); }); });
    // HOTEL sign on near layer (generic)
    { const x=(W-LW)/2+ox*1.6+1165, y=HZ-310; u.save(); u.font='800 34px '+SANS; u.textAlign='center'; const fl=0.75+0.25*Math.sin(t*9)*Math.sin(t*3.7); u.globalAlpha=fl; u.fillStyle=CYAN; u.shadowColor=CYAN; u.shadowBlur=18;
      'HOTEL'.split('').forEach((ch,i)=>u.fillText(ch,x,y+i*38)); u.restore(); }
    // fog band at horizon
    let fg=u.createLinearGradient(0,HZ-120,0,HZ); fg.addColorStop(0,'rgba(255,90,160,0)'); fg.addColorStop(1,'rgba(255,120,170,.35)'); u.fillStyle=fg; u.fillRect(0,HZ-120,W,120);

    // ===== compose with camera zoom
    g.fillStyle='#05020f'; g.fillRect(0,0,W,H);
    g.save(); g.translate(540,HZ); g.scale(zoom,zoom); g.translate(-540,-HZ);
    g.drawImage(U,0,0);
    // wet street: rippled reflection of the upper world
    for(let y=HZ;y<H+120;y+=4){ const dy=y-HZ, sy0=HZ-dy*0.62-3; if(sy0<0) break; const off=Math.sin(dy*0.045-t*3.2)*(1.5+dy*0.022)+Math.sin(dy*0.13+t*5)*(dy*0.006);
      g.globalAlpha=0.62*(1-dy/1100); g.drawImage(U,0,sy0,W,3,off,y,W,4.4); } g.globalAlpha=1;
    let rg=g.createLinearGradient(0,HZ,0,H); rg.addColorStop(0,'rgba(10,4,24,.25)'); rg.addColorStop(0.5,'rgba(8,3,20,.6)'); rg.addColorStop(1,'rgba(4,1,12,.88)'); g.fillStyle=rg; g.fillRect(0,HZ,W,H-HZ);
    // road perspective: curbs, lane dashes, car light trails
    const vx=540+ox*0.5, PZ=(z)=>HZ+260/z, PX=(lane,z)=>vx+lane*300/z;
    g.save(); g.globalCompositeOperation='lighter'; g.lineCap='round';
    [-2.2,2.2].forEach((ln)=>{ g.strokeStyle=ln<0?'rgba(255,60,170,.55)':'rgba(40,220,255,.55)'; g.shadowColor=g.strokeStyle; g.shadowBlur=16; g.lineWidth=5; g.beginPath(); g.moveTo(PX(ln,30),PZ(30)); g.lineTo(PX(ln,0.16),PZ(0.16)); g.stroke(); }); g.shadowBlur=0;
    for(const ln of [-1.1,0,1.1]) for(let i=0;i<14;i++){ const z=((i*1.1-t*3.4)%15.4+15.4)%15.4+0.18, z2=z+0.45; if(PZ(z)>H+40) continue; g.strokeStyle='rgba(255,230,240,'+(0.5*CL(1.6-z/9))+')'; g.lineWidth=Math.max(1,9/z);
      g.beginPath(); g.moveTo(PX(ln,z),PZ(z)); g.lineTo(PX(ln,z2),PZ(z2)); g.stroke(); }
    CARS.forEach(([lane,ph,sp,inb],i)=>{ const L=[-1.65,-0.55,0.55,1.65][lane], dir=lane<2?1:-1; let z=((ph+t*sp*dir*1.6)%10+10)%10+0.3; if(z<0.9) return; const z2=z+(dir>0?1.8:-1.8)*CL(z/2+0.3), col=lane<2?'255,40,70':'255,240,210';
      const za=Math.max(0.25,Math.min(z,z2)), zb=Math.max(z,z2); const gd=g.createLinearGradient(PX(L,za),PZ(za),PX(L,zb),PZ(zb)); gd.addColorStop(dir>0?0:1,'rgba('+col+',.95)'); gd.addColorStop(dir>0?1:0,'rgba('+col+',0)');
      g.strokeStyle=gd; g.lineWidth=Math.max(2,6/za); g.globalAlpha=CL((z-0.9)*1.1)*(lane<2?1:0.75); g.shadowColor='rgba('+col+',1)'; g.shadowBlur=20; g.beginPath(); g.moveTo(PX(L,za),PZ(za)); g.lineTo(PX(L,zb),PZ(zb)); g.stroke(); g.globalAlpha=1; }); g.shadowBlur=0;
    // rain ripples on the street
    RIP.forEach(([rx,rz,ph,sp])=>{ const k=((t*sp+ph)%1.3)/1.3; if(k>1) return; const z=0.25+rz*7, y=PZ(z), x=vx+(rx-0.5)*2600/z; g.strokeStyle='rgba(200,220,255,'+(0.35*(1-k))+')'; g.lineWidth=1.2; g.beginPath(); g.ellipse(x,y,(6+k*40)/Math.sqrt(z),(1.5+k*8)/Math.sqrt(z),0,0,7); g.stroke(); });
    g.restore();
    // palms on both sidewalks
    palm(g,70+ox*1.25,HZ+70,560,0.16,t,0.2,1.05); palm(g,-40+ox*1.3,HZ+150,700,0.22,t,1.7,1.2);
    palm(g,1010+ox*1.25,HZ+60,540,-0.15,t,2.6,1.0); palm(g,1130+ox*1.3,HZ+140,720,-0.24,t,3.9,1.2);
    g.restore();

    // ===== rain + vignette
    g.save(); g.lineCap='round'; RAIN.forEach(([x,y,l,v,a])=>{ const yy=((y+t*v)%(H+200))-100, xx=x+((y+t*v)%(H+200))*0.18; g.strokeStyle='rgba(210,220,255,'+a+')'; g.lineWidth=1.4; g.beginPath(); g.moveTo(xx,yy); g.lineTo(xx+l*0.18,yy+l); g.stroke(); }); g.restore();
    let vg=g.createRadialGradient(540,880,380,540,960,1250); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(3,0,12,.7)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
    // dark scrim behind the counter for legibility
    let sc=g.createLinearGradient(0,260,0,980); sc.addColorStop(0,'rgba(4,1,16,0)'); sc.addColorStop(0.25,'rgba(4,1,16,.42)'); sc.addColorStop(0.75,'rgba(4,1,16,.42)'); sc.addColorStop(1,'rgba(4,1,16,0)'); g.fillStyle=sc; g.fillRect(0,260,W,720);

    // ===== countdown block (shifted down 420 px so the hook and CTA at the top stay clear)
    g.save(); g.translate(0,420);
    const n=Math.floor(t), fr=t-n, TOT=27*3600, now=parts(TOT-n), prev=parts(TOT-n+1), D=0.5, rf=n>=1?fr/D:1, tick=n>=1?1-E3(fr/0.6):0;
    const bob=Math.sin(t*1.3)*6, cy=400+bob, ld=Math.sin(t*0.42)*-8;
    // label
    const la=flick(t,3); neonText(g,'LAUNCHES IN',540+ld,350+bob,'700 34px '+SANS,CYAN,la,14,22);
    g.save(); g.globalAlpha=la*0.8; g.strokeStyle=CYAN; g.shadowColor=CYAN; g.shadowBlur=12; g.lineWidth=3; const lw=110+20*Math.sin(t*2);
    g.font='700 34px '+SANS; g.letterSpacing='14px'; const hw=g.measureText('LAUNCHES IN').width/2+22; g.beginPath(); g.moveTo(540+ld-hw,338+bob); g.lineTo(540+ld-hw-lw,338+bob); g.moveTo(540+ld+hw,338+bob); g.lineTo(540+ld+hw+lw,338+bob); g.stroke(); g.restore();
    // digits: groups DD | HH : MM : SS
    const GAP=16, GG=74, groupW=DW*2+GAP, total=groupW*4+GG*3, x0=(W-total)/2+8+ld;
    const UN=['DAY','HRS','MIN','SEC'];
    for(let gi=0;gi<4;gi++){ const gx=x0+gi*(groupW+GG), col=gi===0?'#ff3fae':gi===3?'#ff3fae':'#ff3fae', isS=gi===3, pun=isS?1+0.07*tick:1;
      g.save(); g.translate(gx+groupW/2,cy+DH/2); g.scale(pun,pun); g.translate(-(gx+groupW/2),-(cy+DH/2));
      for(let k=0;k<2;k++){ const idx=gi*2+k; rollDigit(g,gx+k*(DW+GAP),cy,prev[idx],now[idx],rf,col,isS?tick:0); }
      g.restore();
      neonText(g,UN[gi],gx+groupW/2-8,cy+DH+62,'700 30px '+SANS,'#ffffff',0.78,10,10);
      if(gi<3){ const cxp=gx+groupW+GG/2-6, pul=0.55+0.45*(1-E3(fr/0.5)); g.save(); g.fillStyle=CYAN; g.shadowColor=CYAN; g.shadowBlur=22; g.globalAlpha=gi===0?0.0:pul;
        [cy+DH*0.3,cy+DH*0.72].forEach((yy)=>{ g.beginPath(); g.arc(cxp,yy,7,0,7); g.fill(); }); g.restore();
        if(gi===0){ g.save(); g.strokeStyle='rgba(255,255,255,.28)'; g.lineWidth=2; g.beginPath(); g.moveTo(cxp,cy+10); g.lineTo(cxp-16,cy+DH-10); g.strokeStyle='rgba(33,230,255,.55)'; g.shadowColor=CYAN; g.shadowBlur=10; g.stroke(); g.restore(); } } }
    // seconds progress bar under the counter
    { const bx=x0-6, bw=total, by=cy+DH+96; g.save(); g.fillStyle='rgba(255,255,255,.10)'; g.beginPath(); g.roundRect(bx,by,bw,6,3); g.fill();
      const pf=E5(fr*1.15); g.fillStyle=CYAN; g.shadowColor=CYAN; g.shadowBlur=16; g.beginPath(); g.roundRect(bx,by,Math.max(6,bw*pf),6,3); g.fill(); g.restore(); }
    // title + date
    const ty=cy+DH+262; neonText(g,'GTA 6',540+ld*0.6,ty,'900 132px '+SANS,'#ff6fd0',1,18,26);
    { const txt='THU  ·  NOV 19  ·  2026'; g.save(); g.font='800 44px '+SANS; g.letterSpacing='6px'; const tw=g.measureText(txt).width, pw=tw+90, px=540+ld*0.6-pw/2, py=ty+44, pa=flick(t,9);
      g.fillStyle='rgba(8,3,22,.62)'; g.beginPath(); g.roundRect(px,py,pw,92,46); g.fill(); g.globalAlpha=pa; g.strokeStyle=PINK; g.shadowColor=PINK; g.shadowBlur=26; g.lineWidth=4; g.stroke(); g.shadowBlur=0; g.lineWidth=1.5; g.strokeStyle='rgba(255,255,255,.8)'; g.stroke(); g.restore();
      neonText(g,txt,540+ld*0.6,py+62,'800 44px '+SANS,CYAN,1,6,18); }
    // a light sweep across the title every ~4 s
    { const sw=((t+1.2)%4)/1.1; if(sw<1){ const sx2=-200+E3(sw)*1500; g.save(); g.globalCompositeOperation='lighter'; const lg=g.createLinearGradient(sx2-120,0,sx2+120,0); lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(0.5,'rgba(255,200,240,.22)'); lg.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle=lg; g.fillRect(80,ty-120,920,150); g.restore(); } }
    g.restore();
    g.globalAlpha=0.55; g.drawImage(GRAIN,0,0,W,H); g.globalAlpha=1;
  };
})();
