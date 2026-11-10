// ---------- styles20: the same three explainer LOOKS as styles19, new topics drawn in 2D canvas (own designs; no channel logos, wordmarks, mascots or characters)
// S0 /paper-explainer = full-screen photo-collage look (depth layers, cut-out with white edge, big serif type, orange label, hand-drawn arrow)
// S1 /flat-cosmos     = flat vector look with glow, depth and tiny labels
// S2 /storybook       = hand-painted look with brush texture and "boil"
const C2=(id)=>document.getElementById(id).getContext('2d');
const E3=(x)=>x<0?0:x>1?1:1-Math.pow(1-x,3), EIO=(x)=>x<0?0:x>1?1:x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, CL=(x)=>x<0?0:x>1?1:x;
const EBK=(x)=>{ x=CL(x); const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); };
const SERIF="'EB Garamond','Lora','DejaVu Serif',Georgia,serif", DISP="'DM Serif Display','EB Garamond','Lora','DejaVu Serif',serif", SANS="Inter,'DejaVu Sans',Helvetica,Arial,sans-serif";
function R0(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
function off(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; }
function fbm(seed){ const R=R0(seed*7+1), a=[]; for(let i=0;i<512;i++) a.push(R()); return (x)=>{ const i=Math.floor(x), f=x-i, s=f*f*(3-2*f); const A=a[((i%512)+512)%512], B=a[(((i+1)%512)+512)%512]; return A+(B-A)*s; }; }
function tornPath(g,x,y,w,h,seed,j){ const R=R0(seed); j=j||6; g.beginPath(); g.moveTo(x,y+R()*j);
  for(let i=1;i<=24;i++) g.lineTo(x+w*i/24,y+(R()-.5)*j); for(let i=1;i<=12;i++) g.lineTo(x+w+(R()-.5)*j,y+h*i/12);
  for(let i=23;i>=0;i--) g.lineTo(x+w*i/24,y+h+(R()-.5)*j); for(let i=11;i>=1;i--) g.lineTo(x+(R()-.5)*j,y+h*i/12); g.closePath(); }
function blobPath(g,cx,cy,r,seed,amp,n,t,bulge){ const R=R0(seed); const ph=[],fq=[]; for(let i=0;i<4;i++){ ph.push(R()*6.28); fq.push(2+Math.floor(R()*4)); }
  g.beginPath(); for(let i=0;i<=n;i++){ const a=i/n*Math.PI*2; let rr=r; for(let k=0;k<4;k++) rr+=r*amp*Math.sin(a*fq[k]+ph[k]+t*(0.6+k*0.3))/(k+1);
    if(bulge) rr+=bulge(a); const x=cx+Math.cos(a)*rr, y=cy+Math.sin(a)*rr; i?g.lineTo(x,y):g.moveTo(x,y); } g.closePath(); }
const GRAIN=off(1080,1920,(p,w,h)=>{ const R=R0(77); for(let i=0;i<140000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.10)+')':'rgba(255,255,255,'+(R()*.10)+')'; p.fillRect(R()*w,R()*h,1+R()*2,1+R()*2); } });
// hand-drawn marker line through pts (Catmull-Rom), drawn up to fraction f; returns the end point + angle
function marker(g,pts,f,width,col){ const N=80, P=[]; for(let i=0;i<=N;i++){ const t=i/N*(pts.length-1), k=Math.min(pts.length-2,Math.floor(t)), u=t-k; const a=pts[Math.max(0,k-1)],b=pts[k],c=pts[k+1],d=pts[Math.min(pts.length-1,k+2)];
    const cr=(p0,p1,p2,p3)=>0.5*((2*p1)+(-p0+p2)*u+(2*p0-5*p1+4*p2-p3)*u*u+(-p0+3*p1-3*p2+p3)*u*u*u); P.push([cr(a[0],b[0],c[0],d[0]),cr(a[1],b[1],c[1],d[1])]); }
  const n=Math.max(1,Math.floor(N*CL(f))); g.save(); g.strokeStyle=col; g.lineCap='round'; g.lineJoin='round';
  for(let pass=0;pass<2;pass++){ g.lineWidth=width*(pass?0.55:1); g.globalAlpha=pass?0.55:0.9; g.beginPath(); for(let i=0;i<=n;i++){ const j=pass?Math.sin(i*1.7)*1.6:0; i?g.lineTo(P[i][0]+j,P[i][1]-j):g.moveTo(P[i][0]+j,P[i][1]-j); } g.stroke(); }
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

// =============== S0 paper-collage: why the Eiffel Tower grows in summer ===============
// Facts: iron expands when heated; on hot days the tower is up to ~15 cm taller, and its top leans away from the sun (the sunny side expands more).
(function(){ const g=C2('cv0'), LW=1400;
  const sky=off(1080,1920,(p,w,h)=>{ const gr=p.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#4f93c4'); gr.addColorStop(.45,'#a6cfe0'); gr.addColorStop(.72,'#f3dcc0'); gr.addColorStop(1,'#f1cfa6'); p.fillStyle=gr; p.fillRect(0,0,w,h); });
  const clouds=off(LW,900,(p,w,h)=>{ const R=R0(21); p.filter='blur(22px)'; for(let c=0;c<7;c++){ const cx=R()*w, cy=160+R()*640, n=9+R()*9; for(let i=0;i<n;i++){ p.fillStyle='rgba(255,255,255,'+(0.25+R()*0.4)+')'; p.beginPath(); p.ellipse(cx+(R()-.5)*300,cy+(R()-.5)*50,60+R()*110,22+R()*36,0,0,7); p.fill(); } } });
  function city(seed,base,hmin,hmax,col,col2,blur){ const raw=off(LW,1920,(p)=>{ const R=R0(seed); let x=-20; while(x<LW){ const w=50+R()*90, h=hmin+R()*(hmax-hmin), y=base-h; p.fillStyle=R()<.5?col:col2; p.fillRect(x,y,w,1920-y);
        p.fillStyle=col2; p.beginPath(); p.moveTo(x-4,y); p.lineTo(x+8,y-26); p.lineTo(x+w-8,y-26); p.lineTo(x+w+4,y); p.fill(); if(R()<.6){ p.fillRect(x+w*0.2,y-52,10,28); p.fillRect(x+w*0.65,y-46,8,22); }
        p.fillStyle='rgba(255,240,210,.35)'; for(let wy=y+18;wy<y+h-10;wy+=34) for(let wx=x+10;wx<x+w-14;wx+=22) if(R()<.8) p.fillRect(wx,wy,9,18); x+=w+2; }
      for(let i=0;i<30000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.10)+')':'rgba(255,255,255,'+(R()*.10)+')'; p.fillRect(R()*LW,base-hmax-60+R()*(1920-base+hmax+60),2,2); } });
    return off(LW,1920,(p)=>{ p.filter='blur('+blur+'px)'; p.drawImage(raw,0,0); }); }
  const farC=city(4,1380,90,230,'#9fb3c4','#8aa0b3',2.4), nearC=city(9,1560,120,300,'#6d8196','#5a6e84',1.0);
  const leaves=off(LW,700,(p,w,h)=>{ const R=R0(6); p.filter='blur(9px)'; for(let i=0;i<260;i++){ const x=R()*w, y=h-R()*R()*360; p.fillStyle=['#3e6b3a','#2f5630','#58853f','#254a2b'][Math.floor(R()*4)]; p.beginPath(); p.ellipse(x,y,40+R()*70,30+R()*50,R()*3,0,7); p.fill(); } });
  const sun=sticker(off(340,340,(p)=>{ p.translate(170,170); const gr=p.createRadialGradient(-30,-30,20,0,0,165); gr.addColorStop(0,'#ffd766'); gr.addColorStop(1,'#f59a23'); p.fillStyle=gr; p.beginPath(); p.arc(0,0,160,0,7); p.fill();
    p.save(); p.clip(); for(let y=-170;y<170;y+=9) for(let x=-170+(y/9%2)*4.5;x<170;x+=9){ const d=CL((x+y+120)/300); p.fillStyle='rgba(190,70,10,.35)'; p.beginPath(); p.arc(x,y,0.5+2.4*d,0,7); p.fill(); } p.restore(); }),12);
  const TW=520, TH=1040, hwf=(t)=>t<0.035?5:9+250*Math.pow((t-0.035)/0.965,2.3);
  const tower=sticker(off(TW,TH,(p)=>{ const shape=()=>{ p.beginPath(); p.moveTo(TW/2-5,0); for(let i=0;i<=100;i++){ const t=i/100; p.lineTo(TW/2-hwf(t),t*TH); } for(let i=100;i>=0;i--){ const t=i/100; p.lineTo(TW/2+hwf(t),t*TH); } p.closePath(); };
    const gr=p.createLinearGradient(0,0,TW,0); gr.addColorStop(0,'#3a322c'); gr.addColorStop(.55,'#5a4d42'); gr.addColorStop(1,'#84705c'); shape(); p.fillStyle=gr; p.fill();
    p.save(); shape(); p.clip(); p.strokeStyle='rgba(215,195,165,.55)'; p.lineWidth=2.5; for(let k=-TH;k<TW+TH;k+=24){ p.beginPath(); p.moveTo(k,0); p.lineTo(k+TH*0.55,TH); p.stroke(); p.beginPath(); p.moveTo(k,0); p.lineTo(k-TH*0.55,TH); p.stroke(); }
    p.strokeStyle='rgba(30,24,20,.6)'; p.lineWidth=4; for(let y=40;y<TH;y+=52){ p.beginPath(); p.moveTo(0,y); p.lineTo(TW,y); p.stroke(); }
    for(let y=0;y<TH;y+=8) for(let x=TW*0.2+(y/8%2)*4;x<TW;x+=8){ const d=CL((TW/2-x+60)/160); if(d<=0) continue; p.fillStyle='rgba(15,12,10,.30)'; p.beginPath(); p.arc(x,y,0.5+2*d,0,7); p.fill(); } p.restore();
    p.globalCompositeOperation='destination-out'; p.beginPath(); p.ellipse(TW/2,TH+16,150,196,0,0,7); p.fill();
    const y1=0.80*TH, y2=0.62*TH; p.beginPath(); p.moveTo(TW/2-(hwf(0.80)-62),y1-4); p.lineTo(TW/2-(hwf(0.62)-34),y2+34); p.lineTo(TW/2+(hwf(0.62)-34),y2+34); p.lineTo(TW/2+(hwf(0.80)-62),y1-4); p.closePath(); p.fill();
    p.beginPath(); p.moveTo(TW/2-(hwf(0.60)-26),y2-8); p.lineTo(TW/2-3,0.30*TH); p.lineTo(TW/2+3,0.30*TH); p.lineTo(TW/2+(hwf(0.60)-26),y2-8); p.closePath(); p.fill();
    p.globalCompositeOperation='source-over'; p.fillStyle='#2b2420'; [[0.20,14,12],[0.62,24,22],[0.80,30,30]].forEach(([t,hh,ex])=>{ p.fillRect(TW/2-hwf(t)-ex,t*TH-hh/2,2*hwf(t)+2*ex,hh); });
    p.fillStyle='#3a322c'; p.fillRect(TW/2-3,0,6,40); }),12);
  const BX=745, BY=1500, TS=0.97;
  SCN[0]=function(lt){ g.clearRect(0,0,1080,1920); const z=1+0.05*EIO(lt/6.2), q=Math.floor(lt*12)/12;
    g.save(); g.translate(540,960); g.scale(z,z); g.translate(-540,-960);
    g.drawImage(sky,0,0); g.drawImage(clouds,-40-lt*22,90);
    // the sun: a halftone cut-out with slowly turning rays
    const sa=EBK((lt-0.1)/0.5); g.save(); g.translate(930,290); g.scale(sa*0.8,sa*0.8); g.rotate(q*0.12); g.strokeStyle='rgba(255,196,70,.9)'; g.lineWidth=14; g.lineCap='round'; for(let i=0;i<14;i++){ const a=i/14*6.283; g.beginPath(); g.moveTo(Math.cos(a)*196,Math.sin(a)*196); g.lineTo(Math.cos(a)*(232+(i%2)*26),Math.sin(a)*(232+(i%2)*26)); g.stroke(); } g.rotate(-q*0.12); g.drawImage(sun,-170-sun.ox,-170-sun.oy); g.restore();
    const a1=E3((lt-0.0)/0.6), a2=E3((lt-0.12)/0.6), a3=E3((lt-0.25)/0.6);
    g.drawImage(farC,-70-lt*6,(1-a1)*300);
    g.fillStyle='rgba(245,232,214,.25)'; g.fillRect(0,0,1080,1920);
    const t1=E3((lt-0.3)/0.4); g.save(); g.globalAlpha=t1*0.95; g.fillStyle='#2f5f86'; g.font="500 92px "+SERIF; g.fillText('The Eiffel Tower',60,380+(1-t1)*30); g.restore();
    const t2=E3((lt-0.5)/0.45); g.save(); g.globalAlpha=CL(t2*1.4); g.translate(455,650); g.scale(1.22-0.22*t2,1.22-0.22*t2); g.fillStyle='#27425a'; g.font="italic 400 300px "+DISP; g.textAlign='center'; g.fillText('grows',0,0); g.restore();
    g.drawImage(nearC,-110-lt*13,(1-a2)*380);
    const t3=E3((lt-0.8)/0.4); g.save(); g.translate(-520*(1-t3),0); g.rotate(-0.012); tornPath(g,-20,690,480,96,31,5); g.fillStyle='#f0541c'; g.shadowColor='rgba(30,20,10,.35)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
    g.fillStyle='#fff'; g.font="500 76px "+SERIF; g.fillText('in summer',60,762); g.restore();
    // the tower cut-out: slides up, then GROWS with the heat and leans away from the sun
    const up=E3((lt-0.45)/0.9), gr=EIO((lt-1.9)/1.5), lean=-0.016*EIO((lt-4.5)/0.8), sy=TS*(1+0.05*gr), topY=BY-TH*sy, top0=BY-TH*TS;
    g.save(); g.translate(BX,BY+(1-up)*1200); g.rotate(lean+0.004*Math.sin(q*3)); g.scale(TS,sy); g.drawImage(tower,-TW/2-tower.ox,-TH-tower.oy); g.restore();
    // "before" line + hand-drawn growth bracket
    if(lt>1.7){ const ba=CL((lt-1.7)/0.3); g.save(); g.globalAlpha=ba; g.strokeStyle='#23313d'; g.lineWidth=5; g.setLineDash([16,12]); g.beginPath(); g.moveTo(BX-130,top0); g.lineTo(BX+120,top0); g.stroke(); g.setLineDash([]); g.restore();
      if(gr>0.05){ marker(g,[[BX+96,top0],[BX+100,(top0+topY)/2],[BX+96,topY]],1,7,'#f0541c'); arrowHead(g,BX+96,topY,-Math.PI/2,20,7,'#f0541c'); g.save(); g.globalAlpha=CL((gr-0.5)*3); g.fillStyle='#f0541c'; g.font="italic 500 58px "+SERIF; g.fillText('+15 cm',BX+124,(top0+topY)/2+16); g.restore(); } }
    // thermometer cut-out, mercury rises with the growth
    const th=EBK((lt-1.2)/0.45); if(lt>1.2){ g.save(); g.translate(170,990); g.rotate(-0.06); g.scale(th,th); g.shadowColor='rgba(20,30,45,.45)'; g.shadowBlur=22; g.shadowOffsetY=14; g.fillStyle='#fbfaf5'; g.beginPath(); g.roundRect(-46,-250,92,420,46); g.fill(); g.beginPath(); g.arc(0,150,74,0,7); g.fill(); g.shadowColor='transparent';
      g.fillStyle='#dfe7ea'; g.beginPath(); g.roundRect(-26,-232,52,380,26); g.fill(); const lvl=0.22+0.66*gr; g.fillStyle='#e8402c'; g.beginPath(); g.roundRect(-14,150-360*lvl,28,360*lvl,12); g.fill(); g.beginPath(); g.arc(0,150,52,0,7); g.fill();
      g.fillStyle='rgba(255,255,255,.45)'; g.beginPath(); g.arc(-16,134,14,0,7); g.fill(); g.strokeStyle='#52606b'; g.lineWidth=4; for(let i=0;i<8;i++){ g.beginPath(); g.moveTo(30,-200+i*40); g.lineTo(i%2?44:54,-200+i*40); g.stroke(); } g.restore(); }
    g.drawImage(leaves,-120-lt*30,1300+(1-a3)*400);
    const P=(fx,fy)=>[BX+fx*TS*Math.cos(lean)+fy*sy*Math.sin(-lean)*-1, BY-fy*sy];
    [[2.7,[70,1200],[BX-70,BY-TH*sy*0.40]]].forEach(([t0,s,T],i)=>{ const cf=EIO((lt-t0-0.3)/0.4); if(cf>0){ const sx=s[0]+400, sy2=s[1]+10; marker(g,[[sx,sy2],[(sx+T[0])/2-20,(sy2+T[1])/2+70],[T[0],T[1]]],cf,6,'#23313d'); if(cf>0.95){ g.fillStyle='#f0541c'; g.beginPath(); g.arc(T[0],T[1],13,0,7); g.fill(); g.strokeStyle='#fff'; g.lineWidth=4; g.stroke(); } } });
    paperTag(g,lt,2.7,70,1200,-0.03,'Iron expands','hot metal takes up more room',50,0);
    paperTag(g,lt,3.5,70,1345,0.02,'Up to 15 cm','taller on the hottest days',51,0);
    paperTag(g,lt,4.3,570,1330,-0.02,'It even leans','away from the sun',52,1);
    g.restore();
    g.globalCompositeOperation='multiply'; g.fillStyle='rgba(244,236,214,.55)'; g.fillRect(0,0,1080,1920); g.globalCompositeOperation='source-over';
    g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,900,500,540,900,1250); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(30,25,15,.30)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();

// =============== S1 flat-science: how caffeine wakes you up ===============
// Facts: adenosine builds up while you are awake and docks on receptors of brain cells = you feel sleepy. Caffeine fits the same
// receptors and blocks them, so the "sleepy" signal can't get through.
(function(){ const g=C2('cv1');
  const bg=off(1080,1920,(p,w,h)=>{ const gr=p.createRadialGradient(w*.5,h*.55,60,w*.5,h*.5,1300); gr.addColorStop(0,'#40227e'); gr.addColorStop(.5,'#1d0f4d'); gr.addColorStop(1,'#080520'); p.fillStyle=gr; p.fillRect(0,0,w,h);
    p.filter='blur(90px)'; [[160,500,260,'rgba(255,80,170,.28)'],[950,1300,300,'rgba(60,160,255,.26)'],[880,420,220,'rgba(255,150,60,.16)']].forEach(([x,y,r,c])=>{ p.fillStyle=c; p.beginPath(); p.arc(x,y,r,0,7); p.fill(); }); });
  const R=R0(17), DOTS=[]; for(let i=0;i<70;i++) DOTS.push([R()*1080,R()*1920,2+R()*8,R()*.45+.15,R()<.5?'#8fb4ff':'#e09bff',R()*6]);
  const NC={x:540,y:1560,r:560}, SOCK=[-2.05,-1.81,-1.57,-1.33,-1.09].map(a=>[NC.x+Math.cos(a)*NC.r,NC.y+Math.sin(a)*NC.r,a]);
  function mol(x,y,r,rot,c1,c2,c3,glow,a,z){ g.save(); g.globalAlpha=a; g.translate(x,y); g.rotate(rot); g.shadowColor=glow; g.shadowBlur=40; const hex=(cx,cy,rr,n)=>{ g.beginPath(); for(let i=0;i<n;i++){ const an=i/n*6.283-1.5708; g.lineTo(cx+Math.cos(an)*rr,cy+Math.sin(an)*rr); } g.closePath(); };
    g.lineJoin='round'; g.lineWidth=r*0.5; g.strokeStyle=c2; g.fillStyle=c2; hex(0,0,r,6); g.stroke(); g.fill(); if(z){ hex(r*1.5,r*0.1,r*0.72,5); g.stroke(); g.fill(); } g.shadowBlur=0;
    g.strokeStyle=c1; g.fillStyle=c1; g.lineWidth=r*0.3; hex(-r*0.06,-r*0.08,r*0.82,6); g.stroke(); g.fill(); if(z){ hex(r*1.46,r*0.04,r*0.56,5); g.stroke(); g.fill(); }
    g.fillStyle=c3; g.beginPath(); g.ellipse(-r*0.3,-r*0.36,r*0.26,r*0.14,-0.6,0,7); g.fill(); g.restore(); }
  function label(txt,x,y,tx,ty,a){ if(a<=0) return; g.save(); g.globalAlpha=a; g.font='800 40px '+SANS; const w=g.measureText(txt).width+52;
    g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=4; g.beginPath(); g.moveTo(x+w/2,y); g.lineTo(tx,ty); g.stroke(); g.fillStyle='#fff'; g.beginPath(); g.arc(tx,ty,9,0,7); g.fill();
    g.fillStyle='rgba(12,8,44,.85)'; g.beginPath(); g.roundRect(x,y-36,w,72,36); g.fill(); g.strokeStyle='rgba(255,255,255,.25)'; g.lineWidth=2; g.stroke(); g.fillStyle='#fff'; g.fillText(txt,x+26,y+14); g.restore(); }
  function spark(x,y,s,a){ g.save(); g.globalAlpha=a; g.translate(x,y); g.fillStyle='#fff'; g.shadowColor='#ffd08a'; g.shadowBlur=24; g.beginPath(); for(let i=0;i<8;i++){ const an=i/8*6.283, r=i%2?s*0.22:s; g.lineTo(Math.cos(an)*r,Math.sin(an)*r); } g.closePath(); g.fill(); g.restore(); }
  const ADE=[[130,640],[330,540],[560,620],[780,530],[960,660]];
  SCN[1]=function(lt){ g.clearRect(0,0,1080,1920); g.drawImage(bg,0,0);
    DOTS.forEach(([x,y,r,a,c,ph])=>{ const yy=(y-lt*(8+r*4)+1920)%1920; g.globalAlpha=a*(0.6+0.4*Math.sin(lt*2+ph)); g.fillStyle=c; g.beginPath(); g.arc(x+Math.sin(lt*.5+ph)*12,yy,r,0,7); g.fill(); }); g.globalAlpha=1;
    { const aw=CL((lt-3.6)/0.6), N=[[90,700],[300,930],[120,1120],[980,760],[840,980],[1010,1160],[560,820]], L=[[0,1],[1,2],[3,4],[4,5],[1,6],[6,4],[0,6],[6,3]];
      g.save(); g.lineCap='round'; L.forEach(([a,b],i)=>{ g.strokeStyle='rgba(170,130,255,'+(0.16+0.22*aw)+')'; g.lineWidth=7; g.beginPath(); g.moveTo(N[a][0],N[a][1]); g.quadraticCurveTo((N[a][0]+N[b][0])/2+30,(N[a][1]+N[b][1])/2-40,N[b][0],N[b][1]); g.stroke();
        if(aw>0){ const pr=(lt*0.8+i*0.23)%1, x=N[a][0]+(N[b][0]-N[a][0])*pr, y=N[a][1]+(N[b][1]-N[a][1])*pr-40*Math.sin(pr*Math.PI)*0.5; g.fillStyle='rgba(255,214,150,'+aw+')'; g.shadowColor='#ffb347'; g.shadowBlur=24; g.beginPath(); g.arc(x,y,9,0,7); g.fill(); g.shadowBlur=0; } });
      N.forEach(([x,y],i)=>{ g.fillStyle='rgba(150,110,240,'+(0.35+0.35*aw)+')'; g.shadowColor='rgba(190,140,255,.8)'; g.shadowBlur=20+40*aw; g.beginPath(); g.arc(x,y,26+(i%3)*8,0,7); g.fill(); }); g.restore(); }
    const docked=SOCK.map((s,i)=>EIO((lt-2.0-i*0.24)/0.55)), allIn=CL((lt-3.6)/0.6), sleepy=EIO(lt/1.8)*(1-CL((lt-2.2)/0.8)), awake=allIn;
    const z=1+0.08*EIO((lt-1.6)/2.6); g.save(); g.translate(540,1150); g.scale(z,z); g.translate(-540,-1150);
    // the brain cell: dendrites + body; it dims when sleepy and lights up when the receptors are blocked
    const lum=1-0.38*sleepy+0.18*awake, C=(r,gg,b)=>'rgb('+Math.min(255,r*lum|0)+','+Math.min(255,gg*lum|0)+','+Math.min(255,b*lum|0)+')';
    g.save(); const ca=E3(lt/0.5); g.globalAlpha=ca; g.translate(0,(1-ca)*160);
    g.strokeStyle=C(160,112,240); g.lineCap='round'; [[-1,[60,1500],[-60,1200],[-160,1040]],[1,[1020,1500],[1140,1230],[1180,1000]]].forEach(([d,a,b,c])=>{ g.lineWidth=70; g.beginPath(); g.moveTo(a[0],a[1]); g.quadraticCurveTo(b[0],b[1],c[0],c[1]); g.stroke(); });
    g.shadowColor='rgba(190,140,255,'+(0.35+0.6*awake)+')'; g.shadowBlur=60+90*awake; blobPath(g,NC.x,NC.y,NC.r,3,0.008,160,lt); g.fillStyle=C(168,124,246); g.fill(); g.shadowBlur=0;
    blobPath(g,NC.x+24,NC.y+34,NC.r*0.95,3,0.008,160,lt); g.fillStyle=C(140,98,226); g.fill();
    blobPath(g,NC.x-16,NC.y-20,NC.r*0.90,3,0.008,160,lt); g.fillStyle=C(186,146,255); g.fill();
    blobPath(g,NC.x+40,NC.y-150,150,5,0.05,80,lt); g.fillStyle=C(118,74,206); g.fill(); blobPath(g,NC.x+28,NC.y-164,118,5,0.05,80,lt); g.fillStyle=C(146,100,232); g.fill();
    // receptors (sockets) on the membrane
    SOCK.forEach(([x,y,a],i)=>{ g.save(); g.translate(x,y); g.rotate(a+Math.PI/2); const hot=docked[i]>0.9?1:0; g.strokeStyle=hot?'#ffd9a8':'#f3d3ff'; g.lineWidth=20; g.lineCap='round'; if(hot){ g.shadowColor='#ffb347'; g.shadowBlur=26; }
      g.beginPath(); g.moveTo(-58,-66); g.quadraticCurveTo(-66,8,0,12); g.quadraticCurveTo(66,8,58,-66); g.stroke(); g.restore(); });
    g.restore();
    // electric pulses when awake
    if(awake>0){ for(let k=0;k<2;k++){ const pr=((lt*0.9+k*0.5)%1); g.save(); g.globalAlpha=awake*(1-pr)*0.7; g.strokeStyle='#ffe2a8'; g.lineWidth=8; g.shadowColor='#ffb347'; g.shadowBlur=30; g.beginPath(); g.arc(NC.x,NC.y,NC.r+30+pr*220,-2.5,-0.64); g.stroke(); g.restore(); }
      for(let i=0;i<8;i++){ const an=-2.4+i*0.25, d=NC.r+120+Math.sin(lt*5+i)*30+(i%3)*50; spark(NC.x+Math.cos(an)*d,NC.y+Math.sin(an)*d,14+8*(i%3),awake*(0.5+0.5*Math.sin(lt*6+i*2))); } }
    // adenosine (blue): drifts towards the receptors, then gets bounced away
    ADE.forEach(([x0,y0],i)=>{ const s=SOCK[i], ap=EIO((lt+0.6-i*0.12)/2.6)*0.78, bo=EIO((lt-2.1-i*0.22)/0.9); let x=x0+(s[0]-x0)*ap, y=y0+(s[1]-130-y0)*ap; x+=Math.cos(s[2])*bo*200+(i-2)*bo*70; y+=Math.sin(s[2])*bo*150; x+=Math.sin(lt*1.6+i)*10; y+=Math.cos(lt*1.3+i)*10;
      mol(x,y,46,lt*0.5+i,'#7fc0ff','#4c8fe6','rgba(255,255,255,.4)','rgba(110,170,255,.8)',CL(lt/0.4)*(1-0.45*bo),0);
      if(sleepy>0.05&&bo<0.3){ g.save(); g.globalAlpha=sleepy*0.9*(1-bo*3); g.fillStyle='#cfe4ff'; g.font='800 '+(46+i%2*14)+'px '+SANS; g.fillText('z',x+52,y-50-((lt*30+i*20)%40)); g.restore(); } });
    // the coffee mug the caffeine comes from
    { const ma=EBK((lt-1.35)/0.45); if(lt>1.35){ g.save(); g.translate(935,730); g.rotate(-0.12+Math.sin(lt*2)*0.03); g.scale(ma,ma); g.shadowColor='rgba(255,170,80,.7)'; g.shadowBlur=40;
      g.strokeStyle='#f1ecff'; g.lineWidth=22; g.beginPath(); g.arc(92,10,44,-1.2,1.2); g.stroke(); g.fillStyle='#f6f2ff'; g.beginPath(); g.roundRect(-90,-80,180,180,[18,18,60,60]); g.fill(); g.shadowBlur=0;
      g.fillStyle='#d9d2f2'; g.beginPath(); g.roundRect(-90,20,180,80,[0,0,60,60]); g.fill(); g.fillStyle='#7a4a2a'; g.beginPath(); g.ellipse(0,-78,82,20,0,0,7); g.fill(); g.fillStyle='#a8683a'; g.beginPath(); g.ellipse(-10,-80,56,11,0,0,7); g.fill();
      g.strokeStyle='rgba(255,255,255,.55)'; g.lineWidth=9; g.lineCap='round'; for(let i=0;i<3;i++){ const ph=lt*2+i*2; g.beginPath(); g.moveTo(-44+i*44,-116); g.quadraticCurveTo(-64+i*44+Math.sin(ph)*16,-160,-44+i*44,-200-Math.sin(ph)*8); g.stroke(); } g.restore(); } }
    // caffeine (orange): shoots in and plugs every receptor
    SOCK.forEach(([x,y,a],i)=>{ const d=docked[i]; if(lt<2.0+i*0.24-0.05) return; const sx=910, sy=680, mx=x+Math.cos(a)*-0+ (sx-x)*(1-d), my=y-50+(sy-(y-50))*(1-d)-Math.sin(d*Math.PI)*120;
      mol(mx-20,my,31,a+Math.PI/2+(1-d)*3,'#ffb45c','#f2792b','rgba(255,255,255,.5)','rgba(255,150,60,.9)',1,1); if(d>0.9){ const f=1-CL((lt-2.0-i*0.24-0.5)/0.4); if(f>0) spark(x,y-60,40*f+10,f); } });
    label('Adenosine: makes you sleepy',150,560,ADE[1][0]+(SOCK[1][0]-ADE[1][0])*0.45,ADE[1][1]+(SOCK[1][1]-130-ADE[1][1])*0.45-50,CL((lt-0.7)/0.25)*(1-CL((lt-2.2)/0.3)));
    label('Caffeine',SOCK[3][0]-30,SOCK[3][1]-280,SOCK[3][0]+4,SOCK[3][1]-110,CL((lt-3.0)/0.3));
    label('Receptors: blocked',SOCK[0][0]-70,SOCK[0][1]-230,SOCK[0][0]+10,SOCK[0][1]-90,CL((lt-3.8)/0.3));
    g.restore();
    const h1=E3((lt-0.25)/0.4), h2=E3((lt-0.45)/0.4); g.save(); g.textAlign='center'; g.shadowColor='rgba(0,0,0,.5)'; g.shadowBlur=20;
    g.globalAlpha=h1; g.fillStyle='#fff'; g.font='800 84px '+SANS; g.fillText('How coffee',540,340+(1-h1)*24);
    g.globalAlpha=h2; const wA=g.measureText('tricks').width, wB=g.measureText(' your brain').width, x0=540-(wA+wB)/2; g.textAlign='left'; g.fillStyle='#ffab4a'; g.shadowColor='rgba(255,160,60,.7)'; g.shadowBlur=30; g.fillText('tricks',x0,440+(1-h2)*24); g.fillStyle='#fff'; g.shadowColor='rgba(0,0,0,.5)'; g.shadowBlur=20; g.fillText(' your brain',x0+wA,440+(1-h2)*24); g.restore();
  };
})();

// =============== S2 painted-story: how Vikings reached America ===============
// Facts: Norse sailors crossed the North Atlantic in open longships with no magnetic compass, steering by the sun, stars, birds
// and coastlines; a Norse site in Newfoundland (L'Anse aux Meadows) dates to about 1,000 years ago.
(function(){ const g=C2('cv2');
  function strokes(p,n,R,x0,y0,w,h,cols,len,wid,ang,a0,a1){ a0=a0??0.08; a1=a1??0.22; for(let i=0;i<n;i++){ const x=x0+R()*w, y=y0+R()*h, l=len*(0.5+R()), a=(ang||0)+(R()-.5)*0.5;
    p.strokeStyle=cols[Math.floor(R()*cols.length)]; p.globalAlpha=a0+R()*a1; p.lineWidth=wid*(0.5+R()); p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5+(R()-.5)*6,x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } p.globalAlpha=1; }
  const W=1500,H=2300, HZ=1120;
  const skyC=off(W,H,(p)=>{ const R=R0(5); const sky=p.createLinearGradient(0,0,0,HZ); sky.addColorStop(0,'#0f2140'); sky.addColorStop(.45,'#1f4a68'); sky.addColorStop(.8,'#c8875a'); sky.addColorStop(1,'#f4c58a'); p.fillStyle=sky; p.fillRect(0,0,W,HZ+10);
    strokes(p,2600,R,0,0,W,HZ*0.6,['#16345a','#0d1c38','#27577a','#1c4162'],170,34,0); strokes(p,1500,R,0,HZ*0.55,W,HZ*0.45,['#d99466','#f0b77c','#9c6f5c','#f7d39a'],190,30,0);
    strokes(p,160,R,0,HZ*0.5,W,HZ*0.4,['#f9dcae','#e7a877'],360,50,0,0.10,0.18);
    for(let i=0;i<90000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.07)+')':'rgba(255,245,220,'+(R()*.06)+')'; p.fillRect(R()*W,R()*HZ,2,2); } });
  const tex=off(256,256,(p)=>{ const R=R0(2); strokes(p,260,R,-20,0,296,256,['#0b2b3a','#bfe6e0','#1d5566'],80,10,0.03,0.05,0.16); });
  const BOIL=[1,2,3].map(s=>off(1080,1920,(p)=>{ const R=R0(s*13); strokes(p,420,R,-50,0,1180,1920,['#dff3ee','#06202c','#f4c88c'],120,22,0.1,0.02,0.06); }));
  const R=R0(31), STARS=[]; for(let i=0;i<110;i++) STARS.push([R()*W,R()*620,1.5+R()*3,R()*6]);
  const BANDS=[[HZ+10,10,0.010,0.7,'#3b7f88'],[HZ+110,16,0.008,1.0,'#2c6b78'],[HZ+250,22,0.0065,1.3,'#1f5767'],[HZ+420,28,0.0055,1.7,'#174757'],[HZ+640,34,0.0048,2.1,'#0f3646']];
  const wy=(b,x,lt)=>b[0]+b[1]*Math.sin(x*b[2]+lt*b[3])+b[1]*0.4*Math.sin(x*b[2]*2.7+lt*b[3]*1.6+1);
  function band(b,lt,q,pat){ g.beginPath(); g.moveTo(-220,H); for(let x=-220;x<=W;x+=20) g.lineTo(x,wy(b,x,lt)); g.lineTo(W,H); g.closePath(); g.fillStyle=b[4]; g.fill(); g.save(); g.clip(); g.globalAlpha=0.5; g.fillStyle=pat; g.fillRect(-220,b[0]-60,W+220,H); g.globalAlpha=1; g.restore();
    g.strokeStyle='rgba(214,240,232,.55)'; g.lineWidth=5; g.lineCap='round'; const Rr=R0(q*7+b[0]); for(let x=-200;x<W;x+=70+Rr()*90){ const l=30+Rr()*70; g.beginPath(); g.moveTo(x,wy(b,x,lt)+3); g.lineTo(x+l,wy(b,x+l,lt)+3); g.stroke(); } }
  function ship(lt,q){ // local coords: waterline y=0, bow to the right
    const hull=()=>{ g.beginPath(); g.moveTo(-290,-64); g.quadraticCurveTo(-330,-120,-318,-196); g.quadraticCurveTo(-300,-120,-250,-62); g.lineTo(250,-62); g.quadraticCurveTo(318,-110,326,-200); g.quadraticCurveTo(350,-120,300,-52); g.quadraticCurveTo(0,96,-290,-64); g.closePath(); };
    g.strokeStyle='#3d2717'; g.lineWidth=9; g.lineCap='round'; for(let i=0;i<6;i++){ const ox=-190+i*76, sw=Math.sin(lt*3.2+i*0.3)*26; g.beginPath(); g.moveTo(ox,-30); g.lineTo(ox-70+sw,70); g.stroke(); }
    g.fillStyle='#4a2f1b'; g.fillRect(-7,-470,14,420);
    // striped sail, billowing
    const bl=28+Math.sin(lt*1.8)*8; g.save(); g.beginPath(); g.moveTo(-190,-440); g.lineTo(190,-440); g.quadraticCurveTo(210+bl,-290,176,-130); g.quadraticCurveTo(0,-104-bl*0.4,-176,-130); g.quadraticCurveTo(-150+bl,-290,-190,-440); g.closePath(); g.fillStyle='#ead9b4'; g.fill(); g.clip();
    for(let i=0;i<4;i++){ g.fillStyle='#b5422c'; g.fillRect(-190+i*104+bl*0.3,-450,52,340); } g.globalAlpha=0.5; g.fillStyle=g.createPattern(tex,'repeat'); g.fillRect(-220,-460,460,360); g.globalAlpha=1;
    const sg=g.createLinearGradient(-190,0,200,0); sg.addColorStop(0,'rgba(40,20,10,.35)'); sg.addColorStop(.5,'rgba(0,0,0,0)'); sg.addColorStop(1,'rgba(255,220,160,.25)'); g.fillStyle=sg; g.fillRect(-220,-460,460,360); g.restore();
    g.strokeStyle='#4a2f1b'; g.lineWidth=10; g.beginPath(); g.moveTo(-200,-440); g.lineTo(200,-440); g.stroke(); g.lineWidth=3; g.beginPath(); g.moveTo(0,-470); g.lineTo(-290,-90); g.moveTo(0,-470); g.lineTo(300,-90); g.moveTo(176,-130); g.lineTo(230,-64); g.moveTo(-176,-130); g.lineTo(-230,-64); g.stroke();
    g.fillStyle='#b5422c'; g.beginPath(); g.moveTo(0,-470); g.lineTo(54+Math.sin(q)*6,-486); g.lineTo(0,-504); g.fill();
    for(let i=0;i<5;i++){ g.fillStyle='#2a1a10'; g.beginPath(); g.arc(-170+i*84,-92,15,0,7); g.fill(); g.fillRect(-182+i*84,-84,24,26); }
    hull(); g.fillStyle='#5b3a22'; g.fill(); g.save(); hull(); g.clip(); g.strokeStyle='rgba(30,16,8,.5)'; g.lineWidth=3; for(let k=0;k<5;k++){ g.beginPath(); g.moveTo(-330,-44+k*20); g.quadraticCurveTo(0,40+k*22,340,-44+k*20); g.stroke(); } g.globalAlpha=0.4; g.fillStyle=g.createPattern(tex,'repeat'); g.fillRect(-340,-210,700,320); g.restore();
    g.fillStyle='#5b3a22'; g.beginPath(); g.arc(-306,-200,20,0,7); g.fill(); g.beginPath(); g.arc(334,-206,22,0,7); g.fill(); g.fillStyle='#f4c58a'; g.beginPath(); g.arc(340,-210,5,0,7); g.fill();
    for(let i=0;i<7;i++){ const x=-216+i*72; g.fillStyle=i%2?'#e8d9b0':'#b5422c'; g.beginPath(); g.arc(x,-52,27,0,7); g.fill(); g.strokeStyle='#3d2717'; g.lineWidth=4; g.stroke(); g.fillStyle='#c9a24a'; g.beginPath(); g.arc(x,-52,8,0,7); g.fill(); } }
  const CAP=[['No compass.',0.5],['Just sun, stars and birds.',1.6],['All the way to America.',3.1]];
  SCN[2]=function(lt){ g.clearRect(0,0,1080,1920); const q=Math.floor(lt*8), pat=g.createPattern(tex,'repeat');
    const zf=EIO((lt-3.3)/2.4), zb=1.42-0.42*zf, cx=470+(600-470)*zf, cy=1290+(1100-1290)*zf;
    g.save(); g.translate(540,960); g.scale(zb,zb); g.translate(-cx,-cy);
    g.drawImage(skyC,-200,0);
    const dawn=EIO(lt/5.5); STARS.forEach(([x,y,r,ph])=>{ g.globalAlpha=(0.5+0.5*Math.sin(lt*3+ph))*(1-dawn*0.75); g.fillStyle='#fff6dc'; g.beginPath(); g.arc(x-200,y,r,0,7); g.fill(); }); g.globalAlpha=1;
    // rising sun + painted halo + reflection
    const sx0=930, sy0=HZ+40-dawn*150; for(let i=0;i<10;i++){ g.globalAlpha=0.07; g.fillStyle='#ffe9b8'; g.beginPath(); g.arc(sx0,sy0,96+i*28+Math.sin(q+i)*4,0,7); g.fill(); } g.globalAlpha=1; g.fillStyle='#fff3d0'; g.beginPath(); g.arc(sx0,sy0,80,0,7); g.fill();
    // land on the horizon at the end
    const la=EIO((lt-4.0)/1.0); if(la>0){ g.save(); g.globalAlpha=la; g.fillStyle='#1d3d3a'; g.beginPath(); g.moveTo(1010,HZ+14); g.quadraticCurveTo(1090,HZ-70,1170,HZ-40); g.quadraticCurveTo(1240,HZ-110,1340,HZ+14); g.closePath(); g.fill(); g.fillStyle='#2b5a4c'; g.beginPath(); g.moveTo(1060,HZ+14); g.quadraticCurveTo(1120,HZ-36,1200,HZ+14); g.fill(); g.restore(); }
    band(BANDS[0],lt,q,pat); band(BANDS[1],lt,q,pat);
    g.save(); for(let i=0;i<16;i++){ const yy=HZ+20+i*36, w=(26+i*9)*(0.7+0.3*Math.sin(q*1.3+i)); g.globalAlpha=0.5-i*0.02; g.fillStyle='#ffd9a0'; g.fillRect(sx0-w/2+Math.sin(q+i*2)*10,yy,w,7); } g.restore();
    band(BANDS[2],lt,q,pat);
    const shx=470+lt*14, base=wy(BANDS[3],shx,lt)-6; g.save(); g.translate(shx,base+Math.sin(lt*2)*6); g.rotate(Math.sin(lt*1.7+1)*0.04); ship(lt,q); g.restore();
    // spray at the bow
    for(let i=0;i<6;i++){ const a=((lt*1.4+i*0.17)%1); g.globalAlpha=0.6*(1-a); g.fillStyle='#e3f4ee'; g.beginPath(); g.arc(shx+300+a*60+i*6,base-20-Math.sin(a*3.14)*50,7+a*10,0,7); g.fill(); } g.globalAlpha=1;
    band(BANDS[3],lt,q,pat); band(BANDS[4],lt,q,pat);
    for(let i=0;i<5;i++){ const bx=760+lt*46+i*52, by=820+i*(i%2?-26:30)+Math.sin(lt*2+i)*8, fl=Math.sin(lt*9+i)*9; g.strokeStyle='#0d1c2c'; g.lineWidth=5; g.lineCap='round'; g.beginPath(); g.moveTo(bx-16,by-fl); g.quadraticCurveTo(bx-7,by-4,bx,by+3); g.quadraticCurveTo(bx+7,by-4,bx+16,by-fl); g.stroke(); }
    g.restore();
    CAP.forEach(([t,t0],i)=>{ const a=EBK((lt-t0)/0.45); if(lt<t0) return; g.save(); g.globalAlpha=CL((lt-t0)/0.15); g.font='italic 500 '+(i===2?80:74)+'px '+SERIF; const w=g.measureText(t).width+64, y=262+i*112;
      g.translate(60+(1-a)*-200,y); g.rotate([-0.02,0.015,-0.01][i]); tornPath(g,0,0,w,96,80+i,6); g.fillStyle='#f7ecd0'; g.shadowColor='rgba(5,15,30,.5)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
      g.strokeStyle='rgba(150,100,50,.35)'; g.lineWidth=3; g.stroke(); g.fillStyle='#3a2412'; g.fillText(t,32,70); g.restore(); });
    g.drawImage(BOIL[q%3],0,0); g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,900,380,540,900,1300); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(4,14,30,.5)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();
