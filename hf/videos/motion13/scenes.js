// ---------- v2 look: real studio HDRI (CC0, pmndrs/assets "studio"), bloom (same helpers as build3)
function b64buf(s){ const bin=atob(s); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u.buffer; }
let _HDR=null;
function hdrEnv(ren){ if(!_HDR){ const d=new THREE.EXRLoader().parse(b64buf(window.STUDIO_EXR));
    const t=new THREE.DataTexture(d.data,d.width,d.height,d.format,d.type); t.mapping=THREE.EquirectangularReflectionMapping; t.encoding=THREE.LinearEncoding;
    t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter; t.generateMipmaps=false; t.flipY=false; t.needsUpdate=true; _HDR=t; }
  const pm=new THREE.PMREMGenerator(ren); return pm.fromEquirectangular(_HDR).texture; }
function mkComposer(ren,sc,cam,o){ o=o||{}; const c=new THREE.EffectComposer(ren); c.setPixelRatio(1); c.setSize(1080,1920);
  c.addPass(new THREE.RenderPass(sc,cam));
  const bl=new THREE.UnrealBloomPass(new THREE.Vector2(540,960),o.bloom??0.45,o.radius??0.5,o.th??0.95); c.addPass(bl);
  return {c,bl}; }
function mkRenderer2(id){ const r=new THREE.WebGLRenderer({canvas:document.getElementById(id),antialias:true,alpha:false,preserveDrawingBuffer:true});
  r.setPixelRatio(1); r.setSize(1080,1920,false); r.outputEncoding=THREE.sRGBEncoding; r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=0.62;
  r.setClearColor(0x07080a,1); return r; }
function bgGrad(sc,c1,c2){ const t=canvasTex(512,1024,(g,w,h)=>{ const gr=g.createRadialGradient(w/2,h*0.42,10,w/2,h*0.45,h*0.62); gr.addColorStop(0,c1); gr.addColorStop(1,c2); g.fillStyle=gr; g.fillRect(0,0,w,h); }); sc.background=t; }
function lerpC(a,b,t){ return new THREE.Color(a).lerp(new THREE.Color(b),t); }
function glowMat(c,op){ return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op??1,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false}); }
function rnd(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
function tubeBetween(a,b,r,mat){ const A=new THREE.Vector3(...a), B=new THREE.Vector3(...b); const d=B.clone().sub(A); const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),20),mat);
  m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()); return m; }
function labs(k,list){ return list.map(([i,o,a])=>[document.getElementById('l'+k+'_'+i),o,a]); }

function rr(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }
const eb=(x)=>{ x=cl(x); const c1=1.70158*1.4,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); }; // back.out
function fixLabel(id,x,y,a){ const el=document.getElementById(id); el.style.left=x+'px'; el.style.top=y+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld) ld.style.width='0px'; }

// ---------- S0 /glassmorphism a music player: colour blobs drift on a dark background; frosted-glass cards (player, chips)
// spring in; the glass blurs what's behind it, has a bright 1 px edge and a soft highlight; progress + waveform animate
(function(){ const cv=document.getElementById('cv0'), g=cv.getContext('2d'); const W=1080,H=1920;
  const bg=document.createElement('canvas'); bg.width=W; bg.height=H; const b=bg.getContext('2d');
  const BL=[['#ff4b1f',300,620,330,0.9,0.0],['#7a3cff',780,820,380,0.7,1.7],['#00c2ff',420,1180,300,1.1,3.1],['#ff2bb3',820,1320,260,0.8,4.4]];
  function drawBg(t){ b.fillStyle='#0b0b12'; b.fillRect(0,0,W,H);
    BL.forEach(([c,x,y,r,s,p])=>{ const X=x+90*Math.sin(t*s+p), Y=y+70*Math.cos(t*s*0.8+p); const gr=b.createRadialGradient(X,Y,0,X,Y,r); gr.addColorStop(0,c); gr.addColorStop(1,'rgba(0,0,0,0)'); b.globalAlpha=0.95; b.fillStyle=gr; b.fillRect(0,0,W,H); }); b.globalAlpha=1; }
  function glass(x,y,w,h,r,a,scale){ g.save(); g.globalAlpha=a; g.translate(x+w/2,y+h/2); g.scale(scale,scale); g.translate(-(x+w/2),-(y+h/2));
    g.shadowColor='rgba(0,0,0,.45)'; g.shadowBlur=60; g.shadowOffsetY=30; rr(g,x,y,w,h,r); g.fillStyle='rgba(20,20,30,.2)'; g.fill(); g.shadowColor='transparent';
    g.save(); rr(g,x,y,w,h,r); g.clip(); g.filter='blur(36px) saturate(1.5)'; g.drawImage(bg,0,0); g.filter='none';
    g.fillStyle='rgba(255,255,255,.14)'; g.fillRect(x,y,w,h); const hl=g.createLinearGradient(x,y,x+w*0.6,y+h); hl.addColorStop(0,'rgba(255,255,255,.28)'); hl.addColorStop(.45,'rgba(255,255,255,0)'); g.fillStyle=hl; g.fillRect(x,y,w,h); g.restore();
    rr(g,x+0.5,y+0.5,w-1,h-1,r); g.lineWidth=2; g.strokeStyle='rgba(255,255,255,.55)'; g.stroke(); g.restore(); }
  function txt(s,x,y,size,w,c,a,al){ g.globalAlpha=a; g.fillStyle=c; g.font=`${w} ${size}px Inter, sans-serif`; g.textAlign=al||'left'; g.fillText(s,x,y); g.globalAlpha=1; }
  SCN[0]=function(lt){ const t=lt; drawBg(t); g.drawImage(bg,0,0);
    const p1=eb((lt-0.05)/0.5), a1=cl((lt-0.05)/0.2); const X=150,Y=560+80*(1-p1),Wd=780,Hd=760;
    glass(X,Y,Wd,Hd,56,a1,0.85+0.15*p1);
    if(a1>0){ g.save(); g.globalAlpha=a1; g.translate(X+Wd/2,Y+Hd/2); const sc=0.85+0.15*p1; g.scale(sc,sc); g.translate(-(X+Wd/2),-(Y+Hd/2));
      // album art
      const ax=X+60, ay=Y+60, as=300; const ag=g.createLinearGradient(ax,ay,ax+as,ay+as); ag.addColorStop(0,'#ff6a3d'); ag.addColorStop(1,'#7a3cff'); rr(g,ax,ay,as,as,36); g.fillStyle=ag; g.fill();
      g.beginPath(); g.arc(ax+as/2,ay+as/2,70+6*Math.sin(t*6),0,7); g.fillStyle='rgba(255,255,255,.25)'; g.fill(); g.beginPath(); g.arc(ax+as/2,ay+as/2,18,0,7); g.fillStyle='rgba(255,255,255,.8)'; g.fill();
      txt('Now playing',ax+as+40,ay+60,30,500,'#ffffff',0.7); txt('Midnight',ax+as+40,ay+130,58,800,'#ffffff',1); txt('Drive',ax+as+40,ay+195,58,800,'#ffffff',1); txt('Glass Hours',ax+as+40,ay+250,32,500,'#ffffff',0.7);
      // waveform
      for(let i=0;i<34;i++){ const h=20+70*Math.abs(Math.sin(i*0.7+t*5))*(0.4+0.6*Math.abs(Math.sin(i*1.3))); g.fillStyle='rgba(255,255,255,.85)'; rr(g,X+60+i*20,Y+470-h/2,10,h,5); g.fill(); }
      // progress
      const pr=0.18+0.25*cl(lt/2.6); rr(g,X+60,Y+560,Wd-120,10,5); g.fillStyle='rgba(255,255,255,.25)'; g.fill(); rr(g,X+60,Y+560,(Wd-120)*pr,10,5); g.fillStyle='#fff'; g.fill();
      g.beginPath(); g.arc(X+60+(Wd-120)*pr,Y+565,16,0,7); g.fill(); txt('1:12',X+60,Y+610,26,500,'#fff',0.7); txt('-2:31',X+Wd-60,Y+610,26,500,'#fff',0.7,'right');
      // controls
      const cy=Y+690; [[X+Wd/2-180,'prev'],[X+Wd/2,'play'],[X+Wd/2+180,'next']].forEach(([cx,k])=>{ g.fillStyle='#fff';
        if(k==='play'){ g.beginPath(); g.arc(cx,cy,52,0,7); g.fillStyle='rgba(255,255,255,.95)'; g.fill(); g.fillStyle='#16121f'; g.fillRect(cx-16,cy-22,11,44); g.fillRect(cx+5,cy-22,11,44); }
        else { const d=k==='next'?1:-1; g.beginPath(); g.moveTo(cx-14*d,cy-20); g.lineTo(cx+12*d,cy); g.lineTo(cx-14*d,cy+20); g.closePath(); g.fill(); g.fillRect(cx+12*d-(d>0?0:5),cy-20,5,40); } });
      g.restore(); }
    // floating chips
    const p2=eb((lt-0.45)/0.5), a2=cl((lt-0.45)/0.2); glass(90,420-40*(1-p2)+10*Math.sin(t*2),380,110,55,a2,0.9+0.1*p2); if(a2>0) txt('AirWaves Pro',150,488+10*Math.sin(t*2)-40*(1-p2),32,600,'#fff',a2);
    const p3=eb((lt-0.7)/0.5), a3=cl((lt-0.7)/0.2); glass(560,1360+40*(1-p3)+10*Math.cos(t*2),430,120,60,a3,0.9+0.1*p3);
    if(a3>0){ txt('Volume',610,1412+10*Math.cos(t*2)+40*(1-p3),28,600,'#fff',a3*0.8); rr(g,610,1432+10*Math.cos(t*2)+40*(1-p3),330,10,5); g.globalAlpha=a3; g.fillStyle='rgba(255,255,255,.3)'; g.fill(); rr(g,610,1432+10*Math.cos(t*2)+40*(1-p3),330*(0.4+0.3*cl((lt-0.9)/1)),10,5); g.fillStyle='#fff'; g.fill(); g.globalAlpha=1; }
    fixLabel('l0_0',100,1372,cl((lt-1.0)/0.2)); fixLabel('l0_1',100,1460,cl((lt-1.3)/0.2));
    caption(0,lt); };
})();

// ---------- S1 /ui-motion a phone notification: a phone on a dark gradient; a small black pill at the top springs open into a
// notification banner (overshoot then settle), two more notifications stack under it (older ones tuck behind, scaled down),
// the top one expands to show the message, then is swiped away
(function(){ const cv=document.getElementById('cv1'), g=cv.getContext('2d'); const W=1080,H=1920;
  const PX=190,PY=420,PW=700,PH=1140,PR=96; // phone
  function txt(s,x,y,size,w,c,a,al){ g.globalAlpha=a; g.fillStyle=c; g.font=`${w} ${size}px Inter, sans-serif`; g.textAlign=al||'left'; g.fillText(s,x,y); g.globalAlpha=1; }
  function spring(x){ x=cl(x); return 1-Math.exp(-6*x)*Math.cos(9*x); }
  function card(x,y,w,h,r,a,icon,title,msg,time){ if(a<=0) return; g.save(); g.globalAlpha=a; g.shadowColor='rgba(0,0,0,.45)'; g.shadowBlur=40; g.shadowOffsetY=16;
    rr(g,x,y,w,h,r); g.fillStyle='rgba(30,30,38,.97)'; g.fill(); g.shadowColor='transparent'; rr(g,x+0.5,y+0.5,w-1,h-1,r); g.strokeStyle='rgba(255,255,255,.12)'; g.lineWidth=2; g.stroke();
    const ig=g.createLinearGradient(x+28,y+28,x+92,y+92); ig.addColorStop(0,icon[0]); ig.addColorStop(1,icon[1]); rr(g,x+28,y+38,64,64,16); g.fillStyle=ig; g.fill();
    g.globalAlpha=a; txt(title,x+112,y+62,32,700,'#fff',a); txt(msg,x+112,y+100,28,500,'#c9c9d2',a); txt(time,x+w-28,y+62,24,500,'#8d8d98',a,'right'); g.restore(); }
  SCN[1]=function(lt){ g.fillStyle='#0b0b10'; g.fillRect(0,0,W,H);
    const bgG=g.createRadialGradient(540,900,50,540,900,900); bgG.addColorStop(0,'#2a1c4a'); bgG.addColorStop(1,'#0b0b10'); g.fillStyle=bgG; g.fillRect(0,0,W,H);
    // phone body
    const ph=easeIO(cl(lt/0.4)); g.save(); g.translate(0,60*(1-ph)); g.globalAlpha=ph;
    g.shadowColor='rgba(0,0,0,.6)'; g.shadowBlur=80; g.shadowOffsetY=40; rr(g,PX-14,PY-14,PW+28,PH+28,PR+12); g.fillStyle='#1b1b20'; g.fill(); g.shadowColor='transparent';
    g.save(); rr(g,PX,PY,PW,PH,PR); g.clip(); const wp=g.createLinearGradient(PX,PY,PX+PW,PY+PH); wp.addColorStop(0,'#ff6a3d'); wp.addColorStop(.5,'#7a3cff'); wp.addColorStop(1,'#00c2ff'); g.fillStyle=wp; g.fillRect(PX,PY,PW,PH);
    g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(PX,PY,PW,PH);
    txt('9:41',PX+PW/2,PY+800,150,700,'#ffffff',0.95,'center'); txt('Monday, November 9',PX+PW/2,PY+860,34,600,'#ffffff',0.8,'center');
    // pill -> banner
    const o=spring((lt-0.35)/0.6); const pw=170+(PW-60-170)*o, phh=52+(140-52)*o, px=PX+(PW-pw)/2, py=PY+28+12*o;
    const ex=spring((lt-1.2)/0.5), sw=easeIO(cl((lt-1.8)/0.3));
    // stacked older notifications (appear after the first)
    const s2=spring((lt-0.85)/0.5), s3=spring((lt-1.1)/0.5);
    card(PX+46+12,PY+52+(160+170*ex)*(1-sw)+20+56*s3,PW-92-24,140,40,cl((lt-1.1)/0.15)*0.85*(1-sw*0.3),['#34c759','#0a8f3a'],'Messages','Sam: on my way!','now');
    card(PX+38,PY+52+(160+170*ex)*(1-sw)+20+28*s2+(1-s2)*-60,PW-76,140,40,cl((lt-0.85)/0.15)*(1-sw*0.3),['#ff9f0a','#ff3b30'],'Calendar','Design review in 10 min','2m');
    // top banner
    if(o<0.5){ rr(g,px,py,pw,phh,phh/2); g.fillStyle='#000'; g.fill(); }
    else { const hh=140+170*ex+20*(ex>0?1:0)*0; const xoff=-sw*(PW+200); const y0=PY+470-170*cl(o-0.5)*0+0; const by=PY+40+12*o;
      card(PX+30+xoff,by,PW-60,hh,44,1,['#2f6bff','#00c2ff'],'Claude Code','Your animation is ready','now');
      if(ex>0.05&&sw<1){ g.globalAlpha=cl(ex); rr(g,PX+60+xoff,by+140,PW-120,140,20); g.fillStyle='rgba(255,255,255,.08)'; g.fill(); txt('3 scenes · 18 s · 1080×1920',PX+90+xoff,by+222,28,600,'#ffffff',cl(ex)); g.globalAlpha=1; } }
    if(o<0.5&&o>0){ const ib=PX+(PW-pw)/2; }
    g.restore();
    // phone rim
    rr(g,PX,PY,PW,PH,PR); g.lineWidth=6; g.strokeStyle='#2c2c33'; g.stroke(); g.restore();
    fixLabel('l1_0',90,1470,cl((lt-0.6)/0.2)); fixLabel('l1_1',600,1470,cl((lt-1.2)/0.2));
    caption(1,lt); };
})();

// ---------- S2 /kinetic-type a product launch: a product name and claims hit the screen on the beat: scale punches, mask wipes,
// colour flips, sliding bars, ending on the launch line
(function(){ const cv=document.getElementById('cv2'), g=cv.getContext('2d'); const W=1080,H=1920;
  const BEATS=[ // [start, text, bg, fg, style]
    [0.0,'MEET','#0b0b0d','#ffffff','punch'],[0.32,'AERO','#ff4b1f','#0b0b0d','wipe'],[0.62,'ONE.','#0b0b0d','#ffffff','punch'],
    [0.95,'LIGHTER.','#7a3cff','#ffffff','slide'],[1.25,'FASTER.','#0b0b0d','#ff4b1f','slide'],[1.55,'QUIETER.','#2f6bff','#ffffff','slide'],
    [1.9,'OUT NOW','#0b0b0d','#ffffff','launch']];
  function word(s,x,y,size,c,sx,sy){ g.save(); g.translate(x,y); g.scale(sx,sy); g.fillStyle=c; g.font=`900 ${size}px Inter, sans-serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(s,0,0); g.restore(); }
  SCN[2]=function(lt){ let k=0; for(let i=0;i<BEATS.length;i++) if(lt>=BEATS[i][0]) k=i; const [t0,s,bgc,fg,st]=BEATS[k]; const u=lt-t0;
    g.fillStyle=bgc; g.fillRect(0,0,W,H);
    // background bars
    g.globalAlpha=0.12; g.fillStyle=fg; for(let i=0;i<6;i++){ const y=300+i*240, x=((lt*900+i*230)%1600)-300; g.fillRect(x,y,500,14); } g.globalAlpha=1;
    const cy=980; const size=s.length>6?160:250;
    if(st==='punch'){ const sc=1.35-0.35*eb(u/0.22); word(s,540,cy,size,fg,sc,sc); }
    else if(st==='wipe'){ const w=cl(u/0.18); g.save(); g.beginPath(); g.rect(0,cy-200,1080*w,400); g.clip(); word(s,540,cy,size,fg,1,1); g.restore(); g.fillStyle=fg; g.fillRect(1080*w-12,cy-170,12,340); }
    else if(st==='slide'){ const p=eb(u/0.22); word(s,540+(1-p)*700,cy,size,fg,1,1); g.fillStyle=fg; g.fillRect(90,cy+150,900*cl(u/0.25),10); }
    else { const p=eb(u/0.3); word('OUT',540,cy-150,220,fg,p,p); const q=eb((u-0.12)/0.3); word('NOW',540,cy+90,220,'#ff4b1f',q,q);
      g.globalAlpha=cl((u-0.3)/0.2); g.fillStyle='#ffffff'; g.font='600 40px Inter, sans-serif'; g.textAlign='center'; g.fillText('aero.one  ·  pre-order today',540,cy+290); g.globalAlpha=1; }
    // counter
    g.fillStyle=fg; g.globalAlpha=0.7; g.font='600 34px JetBrains Mono, monospace'; g.textAlign='left'; g.fillText(String(k+1).padStart(2,'0')+' / 07',90,1480); g.globalAlpha=1;
    caption(2,lt); };
})();
