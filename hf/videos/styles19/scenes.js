// ---------- styles19 v2: three famous explainer LOOKS drawn in 2D canvas (own designs; no channel logos, wordmarks, mascots or characters)
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

// =============== S0 paper-explainer: why plane tickets cost so much ===============
(function(){ const g=C2('cv0'), LW=1500;
  const sky=off(1080,1920,(p,w,h)=>{ const gr=p.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#5f97bb'); gr.addColorStop(.4,'#9cc3d8'); gr.addColorStop(.75,'#d5e5e8'); gr.addColorStop(1,'#e6e9da'); p.fillStyle=gr; p.fillRect(0,0,w,h); });
  const clouds=off(LW,1200,(p,w,h)=>{ const R=R0(12); p.filter='blur(24px)'; for(let c=0;c<10;c++){ const cx=R()*w, cy=120+R()*900, n=10+R()*10; for(let i=0;i<n;i++){ p.fillStyle='rgba(255,255,255,'+(0.22+R()*0.4)+')'; p.beginPath(); p.ellipse(cx+(R()-.5)*340,cy+(R()-.5)*60,60+R()*120,24+R()*40,0,0,7); p.fill(); } } });
  function mount(w,h,seed,base,amp,cTop,cBot,snow,dark,blur,grain){ const raw=off(w,h,(p)=>{ const R=R0(seed), N=fbm(seed), ys=[];
      for(let x=0;x<=w;x+=4) ys.push(base-amp*(N(x*0.0024)+N(x*0.0075+9)*0.5+N(x*0.022+3)*0.2+N(x*0.07)*0.07)/1.77);
      p.beginPath(); p.moveTo(0,h); ys.forEach((y,i)=>p.lineTo(i*4,y)); p.lineTo(w,h); p.closePath(); const gr=p.createLinearGradient(0,base-amp,0,base+260); gr.addColorStop(0,cTop); gr.addColorStop(1,cBot); p.fillStyle=gr; p.fill(); p.save(); p.clip();
      for(let i=0;i<5200;i++){ const x=R()*w, yr=ys[Math.min(ys.length-1,Math.floor(x/4))], y=yr+R()*R()*(h-yr)*0.8, s=10+R()*46, dir=R()<.5?-1:1, up=(y-yr)<amp*snow;
        p.fillStyle=R()<0.52?'rgba('+dark+','+(0.10+R()*0.24)+')':(up?'rgba(255,255,255,'+(0.3+R()*0.5)+')':'rgba(255,255,255,'+(R()*0.10)+')');
        p.beginPath(); p.moveTo(x,y); p.lineTo(x+dir*s*(0.3+R()*0.5),y+s*(0.8+R())); p.lineTo(x-dir*s*(0.1+R()*0.4),y+s*(0.6+R()*0.8)); p.closePath(); p.fill(); }
      if(grain) for(let i=0;i<60000;i++){ p.fillStyle=R()<.6?'rgba(30,20,10,'+(R()*.35)+')':'rgba(255,240,220,'+(R()*.3)+')'; const s=1+R()*4; p.fillRect(R()*w,R()*h,s,s); }
      p.restore(); });
    return blur?off(w,h,(p)=>{ p.filter='blur('+blur+'px)'; p.drawImage(raw,0,0); }):raw; }
  const far=mount(LW,1920,5,1180,560,'#f4f7f9','#86a9c2',0.55,'70,105,135',3.2,false);
  const mid=mount(LW,1920,8,1500,470,'#d5e0e5','#4c7591',0.30,'25,55,80',1.6,false);
  const fore=mount(LW,1920,3,1800,330,'#b89b7c','#5e4937',0,'45,30,18',7,true);
  // the cut-out: an airliner with a white sticker edge, printed-photo shading and halftone
  const PW2=980, PH2=470;
  const plane=off(PW2,PH2,(p)=>{ const fus=()=>{ p.beginPath(); p.moveTo(74,216); p.quadraticCurveTo(170,150,310,150); p.lineTo(770,150); p.quadraticCurveTo(892,152,936,206); p.quadraticCurveTo(912,254,796,260); p.lineTo(326,260); p.quadraticCurveTo(176,252,74,216); p.closePath(); };
    const poly=(a)=>{ p.beginPath(); a.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y)); p.closePath(); };
    const fin=[[124,198],[70,34],[156,34],[312,154]], stab=[[96,212],[36,176],[116,176],[204,206]], wing=[[566,238],[318,420],[408,420],[704,242]], wingF=[[610,162],[486,66],[536,66],[716,162]];
    const eng=()=>{ p.beginPath(); const x=470,y=292,w=150,h=66,r=33; p.moveTo(x+r,y); p.lineTo(x+w-r,y); p.quadraticCurveTo(x+w,y,x+w,y+r); p.quadraticCurveTo(x+w,y+h,x+w-r,y+h); p.lineTo(x+r,y+h); p.quadraticCurveTo(x,y+h,x,y+r); p.quadraticCurveTo(x,y,x+r,y); p.closePath(); };
    const all=[()=>poly(wingF),()=>poly(fin),()=>poly(stab),fus,()=>poly(wing),eng];
    p.save(); p.shadowColor='rgba(20,30,45,.45)'; p.shadowBlur=26; p.shadowOffsetY=18; p.strokeStyle='#fbfaf5'; p.lineWidth=24; p.lineJoin='round'; all.forEach(f=>{ f(); p.stroke(); }); p.restore();
    p.strokeStyle='#fbfaf5'; p.lineWidth=24; p.lineJoin='round'; all.forEach(f=>{ f(); p.stroke(); p.fillStyle='#fbfaf5'; p.fill(); });
    let gr=p.createLinearGradient(0,66,0,162); gr.addColorStop(0,'#aab5bf'); gr.addColorStop(1,'#7f8c98'); poly(wingF); p.fillStyle=gr; p.fill();
    gr=p.createLinearGradient(70,34,300,160); gr.addColorStop(0,'#f2561f'); gr.addColorStop(1,'#c53a10'); poly(fin); p.fillStyle=gr; p.fill();
    poly(stab); p.fillStyle='#c9d1d8'; p.fill();
    gr=p.createLinearGradient(0,150,0,260); gr.addColorStop(0,'#ffffff'); gr.addColorStop(.5,'#eef1f3'); gr.addColorStop(1,'#a5b0ba'); fus(); p.fillStyle=gr; p.fill();
    p.save(); fus(); p.clip(); gr=p.createLinearGradient(0,224,0,262); gr.addColorStop(0,'#f2561f'); gr.addColorStop(1,'#a82f0c'); p.fillStyle=gr; p.fillRect(0,224,PW2,60); p.fillStyle='#2f3d4a'; p.fillRect(0,220,PW2,4);
    for(let x=336;x<770;x+=27){ p.fillStyle='#26343f'; p.beginPath(); p.roundRect(x,182,13,19,5); p.fill(); p.fillStyle='rgba(160,200,230,.5)'; p.fillRect(x+2,184,5,6); }
    poly([[838,174],[892,192],[876,204],[830,198]]); p.fillStyle='#26343f'; p.fill();
    p.strokeStyle='rgba(60,70,80,.5)'; p.lineWidth=2; [[318,170,24,60],[792,170,24,60]].forEach(([x,y,w,h])=>p.strokeRect(x,y,w,h)); p.restore();
    gr=p.createLinearGradient(320,420,700,240); gr.addColorStop(0,'#8d99a4'); gr.addColorStop(.6,'#dfe5ea'); gr.addColorStop(1,'#f4f6f7'); poly(wing); p.fillStyle=gr; p.fill();
    gr=p.createLinearGradient(0,292,0,358); gr.addColorStop(0,'#f1f3f5'); gr.addColorStop(1,'#8b97a2'); eng(); p.fillStyle=gr; p.fill();
    p.fillStyle='#26343f'; p.beginPath(); p.ellipse(606,325,13,29,0,0,7); p.fill(); p.strokeStyle='#f2561f'; p.lineWidth=5; p.beginPath(); p.ellipse(604,325,15,31,0,0,7); p.stroke();
    // printed halftone on the shaded parts
    p.save(); p.globalCompositeOperation='source-atop'; for(let y=30;y<PH2;y+=8) for(let x=20+(y/8%2)*4;x<PW2;x+=8){ const d=CL((y-190)/120); if(d<=0) continue; p.fillStyle='rgba(25,35,50,.20)'; p.beginPath(); p.arc(x,y,0.6+2.1*d,0,7); p.fill(); }
    const R=R0(5); for(let i=0;i<9000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.10)+')':'rgba(255,255,255,'+(R()*.14)+')'; p.fillRect(R()*PW2,R()*PH2,2,2); } p.restore(); });
  const TAGS=[ ['Fuel','the biggest single cost',70,1125,-0.035,[85,95],0], ['Airport fees','and taxes, on every seat',470,1250,0.03,[-150,40],1], ['Demand','fewer seats left = higher price',90,1375,-0.02,[150,-38],0] ];
  SCN[0]=function(lt){ g.clearRect(0,0,1080,1920); const z=1+0.05*EIO(lt/6.2), q=Math.floor(lt*12)/12;
    g.save(); g.translate(540,960); g.scale(z,z); g.translate(-540,-960);
    g.drawImage(sky,0,0); g.drawImage(clouds,-60-lt*26,60);
    const a1=E3((lt-0.0)/0.6), a2=E3((lt-0.1)/0.6), a3=E3((lt-0.2)/0.6);
    g.drawImage(far,-80-lt*5,(1-a1)*260);
    g.fillStyle='rgba(225,236,240,.28)'; g.fillRect(0,0,1080,1920);
    // big type sits BEHIND the cut-out (depth)
    const t1=E3((lt-0.3)/0.4); g.save(); g.globalAlpha=t1*0.92; g.fillStyle='#3e6f90'; g.font="500 104px "+SERIF; g.fillText('Why flying',66,356+(1-t1)*30); g.restore();
    const t2=E3((lt-0.5)/0.45); g.save(); g.globalAlpha=CL(t2*1.4); g.translate(540,610); g.scale(1.22-0.22*t2,1.22-0.22*t2); g.fillStyle='#31495b'; g.font="italic 400 352px "+DISP; g.textAlign='center'; g.fillText('costs',-10,0); g.restore();
    g.drawImage(mid,-120-lt*12,(1-a2)*360);
    // orange label
    const t3=E3((lt-0.8)/0.4); g.save(); g.translate(-470*(1-t3),0); g.rotate(-0.012); tornPath(g,-20,650,452,96,31,5); g.fillStyle='#f0541c'; g.shadowColor='rgba(30,20,10,.35)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
    g.save(); g.clip(); g.fillStyle='rgba(255,140,70,.35)'; g.beginPath(); g.moveTo(40,650); g.lineTo(190,650); g.lineTo(120,750); g.lineTo(-10,750); g.fill(); g.restore();
    g.fillStyle='#fff'; g.font="500 76px "+SERIF; g.fillText('so much',70,722); g.restore();
    // the cut-out plane
    const pf=E3((lt-0.75)/1.25), px=-620+(560+620)*pf+lt*5, py=1150+(925-1150)*pf+Math.sin(q*2.4)*5, rot=-0.125+0.012*Math.sin(q*3.1);
    g.save(); g.translate(px,py); g.rotate(rot); g.drawImage(plane,-PW2/2,-PH2/2); g.restore();
    const P2=(lx,ly)=>[px+lx*Math.cos(rot)-ly*Math.sin(rot), py+lx*Math.sin(rot)+ly*Math.cos(rot)];
    // hand-drawn arrow to the plane
    const af=EIO((lt-1.75)/0.5); if(af>0){ const tip=P2(360,-110); const e=marker(g,[[880,300],[990,420],[1000,600],[tip[0]+10,tip[1]-6]],af,8,'#23313d'); if(af>0.95) arrowHead(g,e[0],e[1],e[2],34,8,'#23313d'); }
    g.drawImage(fore,-140-lt*34,(1-a3)*420);
    // cream tags taped on, each one points at a part of the plane
    TAGS.forEach(([h,s,x,y,r,tgt,side],i)=>{ const t0=2.4+i*0.85; if(lt<t0) return; 
      g.font="400 70px "+DISP; const hw=g.measureText(h).width; g.font="italic 500 40px "+SERIF; const sw=g.measureText(s).width; const W=Math.max(hw,sw)+76, H=148;
      const cf=EIO((lt-t0-0.3)/0.4); if(cf>0){ const T=P2(tgt[0],tgt[1]); const sx=x+(side?40:W-40), sy=y+6; const e=marker(g,[[sx,sy],[(sx+T[0])/2+(side?-50:60),(sy+T[1])/2+20],[T[0],T[1]+16]],cf,6,'#23313d'); if(cf>0.95){ g.fillStyle='#f0541c'; g.beginPath(); g.arc(T[0],T[1]+10,13,0,7); g.fill(); g.strokeStyle='#fff'; g.lineWidth=4; g.stroke(); } }
    });
    TAGS.forEach(([h,s,x,y,r,tgt,side],i)=>{ const t0=2.4+i*0.85; if(lt<t0) return; const a=EBK((lt-t0)/0.4);
      g.font="400 70px "+DISP; const hw=g.measureText(h).width; g.font="italic 500 40px "+SERIF; const sw=g.measureText(s).width; const W=Math.max(hw,sw)+76, H=148;
      g.save(); g.translate(x+W/2,y+H/2); g.rotate(r+(1-a)*0.25); g.scale(0.4+0.6*a,0.4+0.6*a); g.globalAlpha=CL((lt-t0)/0.12); g.translate(-W/2,-H/2);
      tornPath(g,0,0,W,H,50+i,7); g.fillStyle='#f6f1e4'; g.shadowColor='rgba(30,20,10,.4)'; g.shadowBlur=18; g.shadowOffsetY=10; g.fill(); g.shadowColor='transparent';
      const hl=EIO((lt-t0-0.3)/0.4); if(hl>0){ g.fillStyle='rgba(255,214,0,.9)'; g.beginPath(); g.moveTo(26,22); g.lineTo(26+(hw+22)*hl,18); g.lineTo(26+(hw+22)*hl,88); g.lineTo(26,84); g.closePath(); g.fill(); }
      g.fillStyle='#17222b'; g.font="400 70px "+DISP; g.fillText(h,36,76); g.fillStyle='#4c4338'; g.font="italic 500 40px "+SERIF; g.fillText(s,36,126);
      g.fillStyle='rgba(240,232,200,.8)'; g.save(); g.translate(side?W-30:30,-4); g.rotate(side?0.5:-0.5); g.fillRect(-46,-14,92,30); g.restore();
      g.restore(); });
    g.restore();
    g.globalCompositeOperation='multiply'; g.fillStyle='rgba(244,236,214,.55)'; g.fillRect(0,0,1080,1920); g.globalCompositeOperation='source-over';
    g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,900,500,540,900,1250); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(30,25,15,.30)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();

// =============== S1 flat-cosmos: how your body fights a virus ===============
(function(){ const g=C2('cv1');
  const bg=off(1080,1920,(p,w,h)=>{ const gr=p.createRadialGradient(w*.55,h*.5,60,w*.5,h*.5,1300); gr.addColorStop(0,'#27328a'); gr.addColorStop(.5,'#151c57'); gr.addColorStop(1,'#070a25'); p.fillStyle=gr; p.fillRect(0,0,w,h);
    p.filter='blur(90px)'; [[200,400,260,'rgba(170,70,200,.35)'],[900,1500,300,'rgba(60,120,255,.30)'],[850,500,220,'rgba(255,90,120,.18)']].forEach(([x,y,r,c])=>{ p.fillStyle=c; p.beginPath(); p.arc(x,y,r,0,7); p.fill(); }); });
  const rbc=(blur)=>off(260,260,(p)=>{ p.filter='blur('+blur+'px)'; p.translate(130,130); p.fillStyle='#d94a66'; p.beginPath(); p.ellipse(0,0,96,84,0,0,7); p.fill(); p.fillStyle='#b83754'; p.beginPath(); p.ellipse(6,8,52,42,0,0,7); p.fill(); p.fillStyle='#ee6a82'; p.beginPath(); p.ellipse(-30,-36,30,14,-0.6,0,7); p.fill(); });
  const RB=[rbc(14),rbc(6)], R=R0(7), DOTS=[], CELLS=[];
  for(let i=0;i<60;i++) DOTS.push([R()*1080,R()*1920,2+R()*8,R()*.45+.15,R()<.5?'#6fd3ff':'#c39bff',R()*6]);
  for(let i=0;i<9;i++) CELLS.push([R()*1300-100,R()*1920,i<5?0:1,0.5+R()*0.6,R()*6,(R()-.5)*0.6]);
  const CELL={x:330,y:1360,r:350}, DA=-0.66, dock=[CELL.x+Math.cos(DA)*CELL.r, CELL.y+Math.sin(DA)*CELL.r];
  function virus(x,y,r,a,rot,glow,grey){ g.save(); g.globalAlpha=a; g.translate(x,y); g.rotate(rot); const mix=(c1,c2)=>grey>0?'rgb('+c1.map((v,i)=>Math.round(v+(c2[i]-v)*grey)).join(',')+')':'rgb('+c1.join(',')+')';
    g.shadowColor='rgba(120,255,160,'+(0.7*glow)+')'; g.shadowBlur=46*glow;
    for(let i=0;i<14;i++){ const an=i/14*Math.PI*2; g.strokeStyle=mix([79,224,138],[120,130,150]); g.lineWidth=r*0.16; g.lineCap='round'; g.beginPath(); g.moveTo(Math.cos(an)*r*.8,Math.sin(an)*r*.8); g.lineTo(Math.cos(an)*r*1.42,Math.sin(an)*r*1.42); g.stroke();
      g.fillStyle=mix([166,255,191],[160,168,185]); g.beginPath(); g.arc(Math.cos(an)*r*1.5,Math.sin(an)*r*1.5,r*.17,0,7); g.fill(); }
    g.fillStyle=mix([56,197,111],[110,120,140]); g.beginPath(); g.arc(0,0,r,0,7); g.fill(); g.shadowBlur=0;
    g.fillStyle=mix([42,156,88],[90,98,118]); g.beginPath(); g.arc(r*.12,r*.14,r*.86,0,7); g.fill();
    g.fillStyle=mix([87,232,145],[135,144,165]); g.beginPath(); g.arc(-r*.1,-r*.12,r*.72,0,7); g.fill();
    g.fillStyle='rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(-r*.32,-r*.4,r*.22,r*.12,-0.6,0,7); g.fill(); g.restore(); }
  function antibody(x,y,ang,s,a){ g.save(); g.globalAlpha=a; g.translate(x,y); g.rotate(ang); g.strokeStyle='#8cecff'; g.shadowColor='#58d8ff'; g.shadowBlur=18; g.lineWidth=8*s; g.lineCap='round';
    g.beginPath(); g.moveTo(-34*s,0); g.lineTo(0,0); g.moveTo(0,0); g.lineTo(24*s,-20*s); g.moveTo(0,0); g.lineTo(24*s,20*s); g.stroke(); g.restore(); }
  function label(txt,x,y,tx,ty,a){ if(a<=0) return; g.save(); g.globalAlpha=a; g.font='800 40px '+SANS; const w=g.measureText(txt).width+52;
    g.strokeStyle='rgba(255,255,255,.75)'; g.lineWidth=4; g.beginPath(); g.moveTo(x+w/2,y); g.lineTo(tx,ty); g.stroke(); g.fillStyle='#fff'; g.beginPath(); g.arc(tx,ty,9,0,7); g.fill();
    g.fillStyle='rgba(9,12,44,.82)'; g.beginPath(); g.roundRect(x,y-36,w,72,36); g.fill(); g.strokeStyle='rgba(255,255,255,.25)'; g.lineWidth=2; g.stroke(); g.fillStyle='#fff'; g.fillText(txt,x+26,y+14); g.restore(); }
  function spark(x,y,s,a){ g.save(); g.globalAlpha=a; g.translate(x,y); g.fillStyle='#fff'; g.shadowColor='#bfe0ff'; g.shadowBlur=20; g.beginPath(); for(let i=0;i<8;i++){ const an=i/8*Math.PI*2, r=i%2?s*0.22:s; g.lineTo(Math.cos(an)*r,Math.sin(an)*r); } g.closePath(); g.fill(); g.restore(); }
  const V2=[[150,560,210,760,44],[1000,470,930,640,36]];
  SCN[1]=function(lt){ g.clearRect(0,0,1080,1920); g.drawImage(bg,0,0);
    const z=1+0.12*EIO((lt-1.6)/2.6);
    // deep background: blurred blood cells drifting (parallax)
    CELLS.forEach(([x,y,k,s,ph,vx])=>{ const yy=((y-lt*(k?34:16)+2200)%2200)-140, xx=x+Math.sin(lt*.4+ph)*20+lt*vx*20; g.save(); g.globalAlpha=k?0.55:0.4; g.translate(xx,yy); g.rotate(ph+lt*0.15); g.scale(s*(k?0.9:1.5),s*(k?0.9:1.5)); g.drawImage(RB[k],-130,-130); g.restore(); });
    DOTS.forEach(([x,y,r,a,c,ph])=>{ const yy=(y-lt*(8+r*4)+1920)%1920; g.globalAlpha=a*(0.6+0.4*Math.sin(lt*2+ph)); g.fillStyle=c; g.beginPath(); g.arc(x+Math.sin(lt*.5+ph)*12,yy,r,0,7); g.fill(); }); g.globalAlpha=1;
    g.save(); g.translate(600,1080); g.scale(z,z); g.translate(-600,-1080);
    // the body cell
    const ca=E3(lt/0.5); g.save(); g.globalAlpha=ca; g.translate(0,(1-ca)*140);
    g.shadowColor='rgba(255,140,120,.6)'; g.shadowBlur=70; blobPath(g,CELL.x,CELL.y,CELL.r,3,0.018,120,lt); g.fillStyle='#ff8a72'; g.fill(); g.shadowBlur=0;
    blobPath(g,CELL.x+20,CELL.y+26,CELL.r*0.93,3,0.018,120,lt); g.fillStyle='#ef6f5e'; g.fill();
    blobPath(g,CELL.x-14,CELL.y-18,CELL.r*0.86,3,0.018,120,lt); g.fillStyle='#ff9a80'; g.fill();
    [[-150,-120,0.5],[90,150,-0.7],[-190,120,1.2],[120,-40,0.2]].forEach(([dx,dy,r])=>{ g.save(); g.translate(CELL.x+dx,CELL.y+dy); g.rotate(r+Math.sin(lt+dx)*0.08); g.fillStyle='#ffb59c'; g.beginPath(); g.roundRect(-38,-17,76,34,17); g.fill(); g.strokeStyle='#f0705e'; g.lineWidth=4; g.beginPath(); for(let i=-24;i<=24;i+=12){ g.moveTo(i,-9); g.lineTo(i+6,9); } g.stroke(); g.restore(); });
    blobPath(g,CELL.x-50,CELL.y+50,CELL.r*0.36,5,0.05,80,lt); g.fillStyle='#c94f62'; g.fill();
    blobPath(g,CELL.x-64,CELL.y+34,CELL.r*0.28,5,0.05,80,lt); g.fillStyle='#e0647a'; g.fill();
    for(let i=0;i<9;i++){ const an=DA-0.64+i*0.16; const x=CELL.x+Math.cos(an)*CELL.r*0.99, y=CELL.y+Math.sin(an)*CELL.r*0.99; const hot=i===4?CL((lt-1.9)/0.3)*(1-CL((lt-3.6)/0.6)):0;
      g.fillStyle=hot?'rgb(255,'+(220-60*hot|0)+','+(120-40*hot|0)+')':'#ffc2a8'; if(hot){ g.shadowColor='#ffe08a'; g.shadowBlur=34*hot; } g.beginPath(); g.arc(x,y,14+hot*7,0,7); g.fill(); g.shadowBlur=0; }
    g.restore();
    // hero virus flies in and docks
    const vf=EIO((lt-0.4)/1.5); let vx=960+(dock[0]+66-960)*vf, vy=520+(dock[1]-56-520)*vf; vx+=Math.sin(lt*3)*6*(1-vf); vy+=Math.cos(lt*2.4)*6*(1-vf);
    const wa=EIO((lt-2.1)/1.0), eng=EIO((lt-3.1)/1.1), wx=1320+(vx+255-1320)*wa-215*eng, wy=820+(vy-10-820)*wa+10*eng;
    const dig=CL((lt-4.2)/0.9), vs=1-0.3*eng;
    if(eng<0.35) virus(vx,vy,64,1,lt*0.4,1,0);
    if(lt>2.0){ const wr=205+50*eng, toV=Math.atan2(vy-wy,vx-wx);
      const bul=(a)=>{ const d=Math.atan2(Math.sin(a-toV),Math.cos(a-toV)); return 120*Math.sin(eng*Math.PI*0.5)*Math.exp(-d*d*1.6)*(1-0.6*eng)+46*Math.sin(eng*Math.PI)*Math.exp(-((Math.abs(d)-0.7)**2)*8); };
      const flash=Math.sin(CL((lt-4.9)/0.9)*Math.PI);
      g.save(); g.shadowColor='rgba(200,220,255,'+(0.55+0.45*flash)+')'; g.shadowBlur=50+90*flash;
      blobPath(g,wx,wy,wr,11,0.04,140,lt*1.4,bul); g.fillStyle='#e9ecff'; g.fill(); g.shadowBlur=0;
      blobPath(g,wx+14,wy+18,wr*0.9,11,0.04,140,lt*1.4,bul); g.fillStyle='#d1d6f6'; g.fill();
      blobPath(g,wx-8,wy-10,wr*0.84,11,0.04,140,lt*1.4,bul); g.fillStyle='#f5f6ff'; g.fill();
      g.fillStyle='#8f6be0'; [[40,60,52],[100,76,46],[136,24,40]].forEach(([dx,dy,r])=>{ g.beginPath(); g.arc(wx+dx*(1-0.3*eng),wy+dy,r,0,7); g.fill(); });
      g.fillStyle='#a786f0'; [[34,52,40],[94,68,34],[130,18,28]].forEach(([dx,dy,r])=>{ g.beginPath(); g.arc(wx+dx*(1-0.3*eng),wy+dy,r,0,7); g.fill(); });
      g.restore();
      if(eng>=0.35){ g.save(); blobPath(g,wx,wy,wr*0.95,11,0.04,140,lt*1.4,bul); g.clip();
        g.fillStyle='rgba(143,107,224,'+(0.22*(1-dig))+')'; g.beginPath(); g.arc(vx,vy,64*vs*1.75,0,7); g.fill(); g.strokeStyle='rgba(143,107,224,'+(0.8*(1-dig))+')'; g.lineWidth=6; g.stroke();
        if(dig<=0) virus(vx,vy,64*vs,0.95,lt*0.4,0.4,0);
        else for(let i=0;i<7;i++){ const an=i/7*6.283+0.4, d=dig*70; g.globalAlpha=1-dig; g.fillStyle=i%2?'#57e891':'#38c56f'; g.beginPath(); g.arc(vx+Math.cos(an)*d,vy+Math.sin(an)*d,(18-i)*(1-dig*0.6),0,7); g.fill(); } g.restore(); g.globalAlpha=1; }
      if(flash>0) for(let i=0;i<7;i++){ const an=i/7*6.283+1, d=wr+40+flash*70; spark(wx+Math.cos(an)*d,wy+Math.sin(an)*d,16+10*(i%3),flash); }
    }
    // two more viruses get tagged by antibodies
    V2.forEach(([x0,y0,x1,y1,r],k)=>{ const f=EIO((lt-0.2-k*0.5)/3.5), x=x0+(x1-x0)*f+Math.sin(lt*1.3+k)*10, y=y0+(y1-y0)*f+Math.cos(lt*1.1+k)*10; const tg=CL((lt-4.6-k*0.25)/0.7);
      virus(x,y,r,CL(lt/0.4),lt*0.3+k,1-tg,tg);
      for(let i=0;i<6;i++){ const an=i/6*6.283+k, a=E3((lt-4.2-k*0.25-i*0.05)/0.6); if(a<=0) continue; const d=r*1.95+(1-a)*520; antibody(x+Math.cos(an)*d,y+Math.sin(an)*d,an+Math.PI,0.9,CL(a*3)); } });
    label('Virus',vx-250,vy-170,vx-40,vy-66,CL((lt-0.9)/0.25)*(1-CL((lt-2.6)/0.3)));
    label('White blood cell',wx-150,wy-330,wx,wy-190,CL((lt-3.0)/0.3));
    label('Antibodies',V2[0][2]-10,V2[0][3]+190,V2[0][2]+40,V2[0][3]+96,CL((lt-5.0)/0.3));
    g.restore();
    // headline in the flat style
    const h1=E3((lt-0.25)/0.4), h2=E3((lt-0.45)/0.4); g.save(); g.textAlign='center'; g.shadowColor='rgba(0,0,0,.5)'; g.shadowBlur=20;
    g.globalAlpha=h1; g.fillStyle='#fff'; g.font='800 84px '+SANS; g.fillText('Your body',540,340+(1-h1)*24);
    g.globalAlpha=h2; g.font='800 84px '+SANS; const wA=g.measureText('vs. a ').width, wB=g.measureText('virus').width, x0=540-(wA+wB)/2; g.textAlign='left'; g.fillText('vs. a ',x0,440+(1-h2)*24); g.fillStyle='#57e891'; g.shadowColor='rgba(87,232,145,.7)'; g.shadowBlur=30; g.fillText('virus',x0+wA,440+(1-h2)*24); g.restore();
  };
})();

// =============== S2 storybook: how the pyramids were built ===============
(function(){ const g=C2('cv2');
  function strokes(p,n,R,x0,y0,w,h,cols,len,wid,ang,a0,a1){ a0=a0??0.08; a1=a1??0.22; for(let i=0;i<n;i++){ const x=x0+R()*w, y=y0+R()*h, l=len*(0.5+R()), a=(ang||0)+(R()-.5)*0.5;
    p.strokeStyle=cols[Math.floor(R()*cols.length)]; p.globalAlpha=a0+R()*a1; p.lineWidth=wid*(0.5+R()); p.lineCap='round'; p.beginPath(); p.moveTo(x,y); p.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5+(R()-.5)*6,x+Math.cos(a)*l,y+Math.sin(a)*l); p.stroke(); } p.globalAlpha=1; }
  const W=1500,H=2300;
  const world=off(W,H,(p)=>{ const R=R0(5);
    const sky=p.createLinearGradient(0,0,0,1300); sky.addColorStop(0,'#d98a55'); sky.addColorStop(.45,'#efb87c'); sky.addColorStop(1,'#f8e3b6'); p.fillStyle=sky; p.fillRect(0,0,W,1320);
    strokes(p,3200,R,0,0,W,1280,['#f7d9a8','#e9a973','#fbe8c4','#dc8d58','#f2c690'],150,30,0);
    strokes(p,260,R,0,300,W,700,['#fff1d2','#fbe0b8'],320,46,0,0.10,0.18);
    const dune=(y,amp,c1,cs,seed)=>{ const Rr=R0(seed); p.fillStyle=c1; p.beginPath(); p.moveTo(0,H); for(let x=0;x<=W;x+=20) p.lineTo(x,y+amp*Math.sin(x*0.004+seed)+amp*0.4*Math.sin(x*0.011+seed*2)); p.lineTo(W,H); p.closePath(); p.fill();
      p.save(); p.clip(); strokes(p,3000,Rr,0,y-amp,W,H-y+amp,cs,110,22,0.06); p.restore(); };
    p.fillStyle='#cf9a66'; [[230,1190,130],[400,1200,84]].forEach(([x,y,s])=>{ p.beginPath(); p.moveTo(x-s,y); p.lineTo(x,y-s*0.9); p.lineTo(x+s,y); p.closePath(); p.fill(); p.fillStyle='#b9814f'; p.beginPath(); p.moveTo(x-s,y); p.lineTo(x,y-s*0.9); p.lineTo(x-s*0.2,y); p.closePath(); p.fill(); p.fillStyle='#cf9a66'; });
    dune(1190,30,'#dfae76',['#cf9a63','#e7bd86','#c98f58'],2); dune(1320,40,'#e6bb82',['#d6a46a','#f0cf9a','#cc9760'],4); dune(1570,30,'#ecc790',['#d8aa70','#f6dcab','#cfa066'],6);
    for(let i=0;i<180000;i++){ p.fillStyle=R()<.5?'rgba(90,60,30,'+(R()*.07)+')':'rgba(255,245,220,'+(R()*.07)+')'; p.fillRect(R()*W,R()*H,2,2); } });
  const BOIL=[1,2,3].map(s=>off(1080,1920,(p)=>{ const R=R0(s*13); strokes(p,420,R,-50,0,1180,1920,['#fff3d6','#7a4a22','#f4c88c'],120,22,0.1,0.02,0.06); }));
  const tex=off(256,256,(p)=>{ const R=R0(2); strokes(p,260,R,-20,0,296,256,['#7a4a22','#fff0cc','#a86c36'],70,10,0.05,0.05,0.16); });
  const PX=770, PY=1420, PW=660, PH=540, N=13, ch=PH/N, CX0=-0.13*PW;
  const block=off(120,64,(p)=>{ const R=R0(2); p.fillStyle='#dcae6e'; p.fillRect(0,0,120,64); strokes(p,90,R,0,0,120,64,['#c08a4c','#efc98e','#b07a40'],40,8,0,0.1,0.3); p.fillStyle='rgba(120,75,35,.35)'; p.fillRect(0,48,120,16); p.strokeStyle='rgba(80,48,20,.75)'; p.lineWidth=3; p.strokeRect(1.5,1.5,117,61); });
  function pyramid(f){ const n=f*N, full=Math.floor(n), R=R0(9); const pat=g.createPattern(tex,'repeat');
    for(let c=0;c<Math.min(N,full+1);c++){ const part=c<full?1:n-full; if(part<=0.02) break; const k=1-c/N, yb=PY-c*ch, xl=PX-PW/2*k, xr=PX+PW/2*k, xc=PX+CX0*k; const xe=xl+(xr-xl)*part;
      g.fillStyle='#a06c3a'; g.fillRect(xl,yb-ch,Math.min(xe,xc)-xl,ch+1); if(xe>xc){ g.fillStyle='#ecc484'; g.fillRect(xc,yb-ch,xe-xc,ch+1); }
      g.save(); g.beginPath(); g.rect(xl,yb-ch,xe-xl,ch); g.clip(); g.globalAlpha=0.55; g.fillStyle=pat; g.fillRect(xl,yb-ch,xe-xl,ch); g.globalAlpha=1;
      g.strokeStyle='rgba(70,40,15,.38)'; g.lineWidth=2; for(let x=xl+(c%2)*22+R()*6;x<xe;x+=44){ g.beginPath(); g.moveTo(x,yb-ch+3); g.lineTo(x+(R()-.5)*3,yb-2); g.stroke(); }
      g.fillStyle='rgba(60,32,10,.28)'; g.fillRect(xl,yb-5,xe-xl,5); g.fillStyle='rgba(255,236,190,.25)'; g.fillRect(xc,yb-ch,Math.max(0,xe-xc),4); g.restore(); } }
  function figure(x,y,s,lean,col,phase){ g.save(); g.translate(x,y); g.scale(s,s); const st=Math.sin(phase);
    g.save(); g.globalAlpha=0.28; g.fillStyle='#4a2a10'; g.transform(1,0,-1.6,0.28,0,0); g.beginPath(); g.ellipse(0,-70,22,80,0,0,7); g.fill(); g.restore();
    g.fillStyle=col; g.strokeStyle=col; g.lineCap='round'; g.lineJoin='round';
    g.lineWidth=13; [st,-st].forEach((q)=>{ g.beginPath(); g.moveTo(0,-62); g.lineTo(q*16,-30); g.lineTo(q*26-4,0); g.stroke(); });
    g.save(); g.rotate(lean);
    g.beginPath(); g.moveTo(-11,-62); g.quadraticCurveTo(-16,-96,-14,-122); g.quadraticCurveTo(0,-130,15,-122); g.quadraticCurveTo(15,-92,11,-62); g.closePath(); g.fill();
    g.fillStyle='#f3e9d2'; g.beginPath(); g.moveTo(-15,-70); g.lineTo(15,-70); g.lineTo(21,-40); g.lineTo(-19,-42); g.closePath(); g.fill();
    g.lineWidth=9; g.beginPath(); g.moveTo(4,-116); g.quadraticCurveTo(22,-104,40,-98); g.stroke(); g.beginPath(); g.moveTo(-4,-114); g.quadraticCurveTo(14,-100,32,-94); g.stroke();
    g.fillStyle=col; g.beginPath(); g.ellipse(6,-142,14,16,0.2,0,7); g.fill(); g.fillStyle='#1e140c'; g.beginPath(); g.ellipse(2,-150,15,10,0.2,0,7); g.fill();
    g.restore(); g.restore(); }
  function frond(x,y,ang,len,seed){ const R=R0(seed); g.save(); g.translate(x,y); g.rotate(ang); g.strokeStyle='#33401f'; g.lineCap='round'; g.lineWidth=9; g.beginPath(); g.moveTo(0,0); g.quadraticCurveTo(len*0.5,-len*0.18,len,len*0.16); g.stroke();
    for(let i=1;i<22;i++){ const t=i/22, px=len*t, py=-len*0.36*t*(1-t)+len*0.16*t*t; g.lineWidth=7*(1-t*0.6); g.strokeStyle=i%2?'#3d4c24':'#2c3819'; g.beginPath(); g.moveTo(px,py); g.lineTo(px+18+R()*10,py+70*(1-t*0.5)+R()*16); g.stroke(); g.beginPath(); g.moveTo(px,py); g.lineTo(px+14,py-34*(1-t)); g.stroke(); } g.restore(); }
  const CAP=[['Wet sand.',0.5],['Wooden sleds.',1.5],['One long, long ramp.',2.6]];
  SCN[2]=function(lt){ g.clearRect(0,0,1080,1920); const q=Math.floor(lt*8);
    const zf=EIO((lt-3.5)/2.3), zb=1.5-0.5*zf, cx=560+(600-560)*zf, cy=1450+(1130-1450)*zf;
    g.save(); g.translate(540,960); g.scale(zb,zb); g.translate(-cx,-cy);
    g.drawImage(world,-200,-180);
    // sun (slowly climbing) with painted halo
    const sx0=1010, sy0=700-lt*26; for(let i=0;i<10;i++){ g.globalAlpha=0.07; g.fillStyle='#fff3cf'; g.beginPath(); g.arc(sx0,sy0,100+i*26+Math.sin(q+i)*4,0,7); g.fill(); } g.globalAlpha=1; g.fillStyle='#fff7df'; g.beginPath(); g.arc(sx0,sy0,84,0,7); g.fill();
    const bf=0.12+0.88*EIO((lt-0.2)/4.3), top=PY-Math.min(N,Math.ceil(bf*N-0.02))*ch;
    // the long ramp (leading theory) with crews hauling blocks up
    const lx=PX-PW/2*(1-(PY-top)/PH)+2, RL=(PY-top)*2.5; g.save(); g.fillStyle='#c69a62'; g.beginPath(); g.moveTo(lx-RL,PY); g.lineTo(lx,top); g.lineTo(lx+10,top); g.lineTo(lx+10,PY); g.closePath(); g.fill();
    g.save(); g.clip(); g.globalAlpha=0.5; g.fillStyle=g.createPattern(tex,'repeat'); g.fillRect(lx-RL,top,RL+20,PY-top); g.globalAlpha=1; g.fillStyle='rgba(90,55,25,.22)'; g.beginPath(); g.moveTo(lx-RL*0.5,PY); g.lineTo(lx+10,top+(PY-top)*0.25); g.lineTo(lx+10,PY); g.fill(); g.restore();
    g.strokeStyle='rgba(255,236,190,.55)'; g.lineWidth=4; g.beginPath(); g.moveTo(lx-RL,PY); g.lineTo(lx,top); g.stroke(); g.restore();
    pyramid(bf);
    if(PY-top>60) for(let k=0;k<3;k++){ const hf=(lt*0.13+k/3)%1, hx=lx-RL*(1-hf), hy=PY-(PY-top)*hf, an=-Math.atan2(PY-top,RL); g.save(); g.translate(hx,hy); g.rotate(an); g.drawImage(block,-30,-17,30,16); g.restore(); for(let j=0;j<3;j++) figure(hx+10+j*9,hy-(10+j*9)*(PY-top)/RL,0.17,0.3,'#4e321d',lt*7+j); }
    // golden capstone + gleam at the end
    const cs=CL((lt-4.6)/0.5); if(cs>0){ g.save(); g.globalAlpha=cs; g.fillStyle='#ffd76a'; g.beginPath(); g.moveTo(PX-PW/2/N,PY-PH+ch); g.lineTo(PX,PY-PH-6); g.lineTo(PX+PW/2/N,PY-PH+ch); g.closePath(); g.fill();
      const fl=Math.sin(CL((lt-4.8)/1.2)*Math.PI); g.translate(PX,PY-PH+8); g.fillStyle='rgba(255,250,220,'+fl+')'; g.shadowColor='#fff2b0'; g.shadowBlur=40; g.beginPath(); for(let i=0;i<8;i++){ const an=i/8*6.283, r=i%2?10:70*fl+20; g.lineTo(Math.cos(an)*r,Math.sin(an)*r); } g.closePath(); g.fill(); g.restore(); }
    // foreground crew: the sled slides on WET sand
    const sx=170+lt*72, sy=1716;
    g.save(); g.globalAlpha=0.5; g.fillStyle='#a77a48'; g.beginPath(); g.ellipse(sx-140,sy+10,300,13,0,0,7); g.fill(); g.restore();
    for(let i=0;i<5;i++){ const a=((lt*1.2+i*0.2)%1); g.save(); g.globalAlpha=0.28*(1-a); g.fillStyle='#f4dcae'; g.beginPath(); g.arc(sx-170-a*90-i*14,sy-10-a*46,20+a*38,0,7); g.fill(); g.restore(); }
    const wx=sx+214; figure(wx,sy+2,0.98,0.05,'#5a3a22',0.6);
    g.save(); g.fillStyle='#8a5a34'; g.beginPath(); g.ellipse(wx+44,sy-100,20,24,0.6,0,7); g.fill(); g.strokeStyle='rgba(120,190,230,.9)'; g.lineCap='round'; for(let i=0;i<4;i++){ g.lineWidth=6-i; g.beginPath(); g.moveTo(wx+56+i*3,sy-90); g.quadraticCurveTo(wx+76+i*5,sy-56,wx+68+i*8,sy-2+Math.sin(q*1.7+i)*4); g.stroke(); }
    g.globalAlpha=0.55; g.fillStyle='#8a5c33'; g.beginPath(); g.ellipse(wx+84,sy+10,92,13,0,0,7); g.fill(); g.globalAlpha=0.7; g.fillStyle='rgba(190,225,245,.8)'; g.beginPath(); g.ellipse(wx+78,sy+8,40,4,0,0,7); g.fill(); g.restore();
    g.save(); g.translate(sx,sy); g.fillStyle='rgba(74,42,16,.3)'; g.beginPath(); g.ellipse(-10,10,170,16,0,0,7); g.fill();
    g.fillStyle='#6f4a28'; g.beginPath(); g.roundRect(-150,-16,300,18,6); g.fill(); g.beginPath(); g.moveTo(146,-16); g.quadraticCurveTo(186,-16,180,-46); g.lineTo(168,-44); g.quadraticCurveTo(168,-6,146,2); g.fill();
    g.drawImage(block,-128,-158,256,142); g.strokeStyle='#5c3d22'; g.lineWidth=5; g.beginPath(); g.moveTo(-128,-90); g.lineTo(128,-90); g.moveTo(-40,-158); g.lineTo(-40,-16); g.stroke(); g.restore();
    g.strokeStyle='#5c3d22'; g.lineWidth=5; g.beginPath(); g.moveTo(sx+170,sy-34); g.quadraticCurveTo(sx+380,sy-70,sx+600,sy-102); g.stroke();
    for(let i=0;i<4;i++) figure(sx+330+i*84,sy+4,1,0.3,['#4e321d','#5d3b22','#47301c','#5a3a22'][i],lt*7+i*1.3);
    // birds
    for(let i=0;i<5;i++){ const bx=300+lt*40+i*46, by=640+i*(i%2?-22:26)+Math.sin(lt*2+i)*8, fl=Math.sin(lt*9+i)*8; g.strokeStyle='#5a3a22'; g.lineWidth=4; g.lineCap='round'; g.beginPath(); g.moveTo(bx-14,by-fl); g.quadraticCurveTo(bx-6,by-4,bx,by+3); g.quadraticCurveTo(bx+6,by-4,bx+14,by-fl); g.stroke(); }
    g.restore();
    // palm fronds frame the picture (close foreground)
    const sway=Math.sin(lt*1.2)*0.03; frond(1120,90,2.62+sway,400,3); frond(1110,60,2.95-sway,340,5); frond(1140,170,2.3+sway*1.4,330,7);
    // storybook caption
    CAP.forEach(([t,t0],i)=>{ const a=EBK((lt-t0)/0.45); if(lt<t0) return; g.save(); g.globalAlpha=CL((lt-t0)/0.15); g.font='italic 500 '+(i===2?80:74)+'px '+SERIF; const w=g.measureText(t).width+64, y=262+i*112;
      g.translate(60+(1-a)*-200,y); g.rotate([-0.02,0.015,-0.01][i]); tornPath(g,0,0,w,96,80+i,6); g.fillStyle='#f7ecd0'; g.shadowColor='rgba(70,35,10,.4)'; g.shadowBlur=14; g.shadowOffsetY=8; g.fill(); g.shadowColor='transparent';
      g.strokeStyle='rgba(150,100,50,.35)'; g.lineWidth=3; g.stroke(); g.fillStyle='#4a2a12'; g.fillText(t,32,70); g.restore(); });
    // paint "boil" + canvas grain + warm vignette
    g.drawImage(BOIL[q%3],0,0); g.drawImage(GRAIN,0,0);
    const vg=g.createRadialGradient(540,900,380,540,900,1300); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(90,45,10,.42)'); g.fillStyle=vg; g.fillRect(0,0,1080,1920);
  };
})();
