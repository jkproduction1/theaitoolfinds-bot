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
    fixLabel('l0_0',80,1350,cl((lt-1.0)/0.2)); fixLabel('l0_1',80,1440,cl((lt-1.3)/0.2));
    caption(0,lt); };
})();

// ---------- S1 /liquid-chrome the word FLOW: chrome letters pour themselves along their strokes like liquid metal, drips fall
// and stretch, the word turns slowly so the reflections slide across it (coloured studio light panels in the reflections)
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); ren.toneMappingExposure=1.15;
  const es=new THREE.Scene(); es.background=new THREE.Color(0x05060a); const P_=(x,y,z,sx,sy,c)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide})); m.position.set(x,y,z); m.scale.set(sx,sy,1); m.lookAt(0,0,0); es.add(m); };
  P_(0,7,2,14,3,0xffffff); P_(-8,1,3,3,10,0xff6a3d); P_(8,0,2,3,10,0x5aa8ff); P_(0,-6,5,12,2,0xc06bff); P_(0,2,-8,10,6,0x8a93a8); P_(4,4,8,4,2,0xffffff); P_(0,1.5,10,16,3.5,0xf2f4f8); P_(0,-1.5,10,16,2.5,0xff8a5a); P_(-5,-3,9,6,2,0x5aa8ff);
  const pm=new THREE.PMREMGenerator(ren); sc.environment=pm.fromScene(es,0.02).texture; bgGrad(sc,'#1a1424','#05060a');
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100); cam.position.set(0,0.3,11); cam.lookAt(0,0,0);
  const P=mkComposer(ren,sc,cam,{bloom:0.35,radius:0.4,th:0.9});
  const chrome=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:1,roughness:0.06,clearcoat:1,clearcoatRoughness:0.05,envMapIntensity:1.4});
  const G=new THREE.Group(); sc.add(G);
  const V=(x,y)=>new THREE.Vector3(x,y,0);
  const strokes=[ [V(0,0),V(0,1.6)],[V(0,1.6),V(0.9,1.6)],[V(0,0.85),V(0.7,0.85)],
    [V(1.3,1.6),V(1.3,0),V(2.15,0)] ];
  const O=[]; for(let i=0;i<=40;i++){ const a=Math.PI/2+i/40*Math.PI*2; O.push(V(3.05+0.62*Math.cos(a),0.8+0.8*Math.sin(a))); } strokes.push(O);
  strokes.push([V(4.05,1.6),V(4.4,0),V(4.75,1.0),V(5.1,0),V(5.45,1.6)]);
  const tubes=[]; strokes.forEach((pts,i)=>{ const c=new THREE.CatmullRomCurve3(pts,false,'catmullrom',pts.length>10?0.5:0.02); const geo=new THREE.TubeGeometry(c,pts.length>10?160:90,0.17,24,false);
    const m=new THREE.Mesh(geo,chrome); m.position.x=-2.72; m.position.y=-0.8; G.add(m); const caps=[0,1].map(k=>{ const s=new THREE.Mesh(new THREE.SphereGeometry(0.17,20,14),chrome); s.position.copy(c.getPoint(k)); m.add(s); return s; }); tubes.push({m,geo,c,caps,delay:i*0.17}); });
  G.scale.setScalar(0.4);
  // drips under the letters
  const drips=[]; [[-2.72,0],[-1.42,0],[-0.6,0],[1.68,0],[2.38,0]].forEach(([x,y],i)=>{ const d=new THREE.Mesh(new THREE.SphereGeometry(0.11,20,14),chrome); d.userData={x,i}; G.add(d); drips.push(d); });
  const shd=shadowPlane(4,1.2,.6); shd.position.y=-1.3; sc.add(shd);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshPhysicalMaterial({color:0x0a0a10,metalness:.8,roughness:.25})); floor.rotation.x=-Math.PI/2; floor.position.y=-1.32; floor.visible=false; sc.add(floor);
  SCN[1]=function(lt){
    tubes.forEach(T=>{ const u=easeIO(cl((lt-0.05-T.delay)/0.55)); const n=T.geo.index.count; T.geo.setDrawRange(0,Math.max(0,Math.floor(n*u/6)*6)); T.m.visible=u>0.001;
      T.caps[0].visible=u>0.001; T.caps[1].visible=u>0.98; T.caps[1].scale.setScalar(u>0.98?1:0.01); if(u>0&&u<1){ T.caps[1].visible=true; T.caps[1].position.copy(T.c.getPoint(u)); T.caps[1].scale.setScalar(1.25); } else T.caps[1].position.copy(T.c.getPoint(1)); });
    drips.forEach(d=>{ const s=lt-1.2-d.userData.i*0.15; const f=cl(s/0.9); d.visible=s>0&&f<1; d.position.set(d.userData.x,-0.85-f*f*1.6,0); d.scale.set(1-0.35*f,1+1.2*f*(1-f)*2,1-0.35*f); });
    G.rotation.y=-0.35+0.6*easeIO(cl(lt/2.8)); G.rotation.x=0.06*Math.sin(lt*1.3); G.position.y=0.05*Math.sin(lt*2);
    cam.position.set(0.4*Math.sin(lt*0.5),0.3,11-0.8*easeIO(cl(lt/2.8))); cam.lookAt(0,0,0); P.c.render();
    fixLabel('l1_0',640,1240,cl((lt-1.0)/0.2)); fixLabel('l1_1',120,1240,cl((lt-1.4)/0.2));
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
