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

function earthTex(){ return canvasTex(1024,512,(c,w,h)=>{ c.fillStyle='#1d4fa8'; c.fillRect(0,0,w,h); const r=rnd(3);
    for(let i=0;i<22;i++){ c.fillStyle=i%3?'#3f8a4a':'#b59a62'; c.beginPath(); const x=r()*w,y=h*.2+r()*h*.6; for(let k=0;k<14;k++){ const a=k/14*Math.PI*2, rr=30+r()*70; c.lineTo(x+Math.cos(a)*rr*1.4,y+Math.sin(a)*rr*.8); } c.fill(); }
    for(let i=0;i<60;i++){ c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(r()*w,r()*h,40+r()*90,8+r()*14,r()*.5,0,Math.PI*2); c.fill(); } }); }
function starField(sc,n,seed,r){ const R=rnd(seed), sp=[]; for(let i=0;i<n;i++){ const v=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(r||300); sp.push(v.x,v.y,v.z); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sc.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.2,sizeAttenuation:false,toneMapped:false}))); }
// sprite with live text (re-drawn only when the text changes)
function backOut(x){ x=cl(x); const c1=1.9, c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); }
function diskTex(){ return canvasTex(1024,64,(c,w,h)=>{ const g=c.createLinearGradient(0,0,w,0); g.addColorStop(0,'rgba(255,255,240,1)'); g.addColorStop(.12,'rgba(255,200,120,1)'); g.addColorStop(.45,'rgba(255,110,40,.85)'); g.addColorStop(1,'rgba(120,30,10,0)'); c.fillStyle=g; c.fillRect(0,0,w,h);
  const r=rnd(8); for(let i=0;i<220;i++){ c.fillStyle=`rgba(255,${180+r()*60|0},${120+r()*80|0},${.15+r()*.3})`; c.fillRect(r()*w,0,2+r()*14,h); } }); }
function ringMesh(r0,r1,tex,op){ const g=new THREE.RingGeometry(r0,r1,160,1); const p=g.attributes.position, uv=g.attributes.uv, v=new THREE.Vector3();
  for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); uv.setXY(i,(v.length()-r0)/(r1-r0),0.5); }
  return new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:op??1,side:THREE.DoubleSide,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false})); }
function astronaut(){ const g=new THREE.Group(); const suit=new THREE.MeshStandardMaterial({color:0xf2f2f2,roughness:.5,emissive:0xff3a10,emissiveIntensity:0});
  const body=new THREE.Mesh(new THREE.CapsuleGeometry?new THREE.CapsuleGeometry(0.16,0.32,6,12):new THREE.CylinderGeometry(0.16,0.16,0.6,16),suit); g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.15,20,14),suit); head.position.y=0.42; g.add(head);
  const visor=new THREE.Mesh(new THREE.SphereGeometry(0.11,20,14,0,Math.PI),new THREE.MeshPhysicalMaterial({color:0xffb14a,metalness:1,roughness:.1})); visor.position.set(0,0.43,0.07); g.add(visor);
  [[-0.24,0.05,0.5],[0.24,0.05,-0.5]].forEach(([x,y,r])=>{ const a=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,0.38,10),suit); a.position.set(x,y,0); a.rotation.z=r; g.add(a); });
  [[-0.09,-0.45],[0.09,-0.45]].forEach(([x,y])=>{ const l=new THREE.Mesh(new THREE.CylinderGeometry(0.065,0.065,0.42,10),suit); l.position.set(x,y,0); g.add(l); });
  const pack=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.34,0.12),suit); pack.position.set(0,0.06,-0.17); g.add(pack); g.userData.suit=suit; return g; }

// ---------- S0 /explain-3d how a supernova happens: a red supergiant breathes; its iron core collapses in under a second (core
// shrinks and flares white), a shockwave bounces out and blasts the star apart in a coloured shell, leaving a tiny spinning neutron star
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020207); starField(sc,2600,17,500); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.05,2000);
  const P=mkComposer(ren,sc,cam,{bloom:0.9,radius:0.7,th:0.6});
  const surf=canvasTex(512,256,(c,w,h)=>{ c.fillStyle='#c23a14'; c.fillRect(0,0,w,h); const r=rnd(12); c.filter='blur(3px)'; for(let i=0;i<1600;i++){ c.fillStyle=r()<.5?'#ff7a2a':'#7a1a08'; c.globalAlpha=0.08+r()*0.2; c.beginPath(); c.arc(r()*w,r()*h,2+r()*6,0,7); c.fill(); } c.globalAlpha=1; c.filter='none'; });
  const starM=new THREE.MeshBasicMaterial({map:surf,toneMapped:false,transparent:true,opacity:1}); const star=new THREE.Mesh(new THREE.SphereGeometry(2.2,96,64),starM); sc.add(star);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,60,128,128,128); g.addColorStop(0,'rgba(255,110,40,.0)'); g.addColorStop(.55,'rgba(255,100,30,.45)'); g.addColorStop(1,'rgba(255,60,20,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending})); halo.scale.set(8.5,8.5,1); sc.add(halo);
  // cutaway view of the core (shown through a see-through star)
  const core=new THREE.Mesh(new THREE.SphereGeometry(0.55,48,32),new THREE.MeshBasicMaterial({color:0xfff2c0,toneMapped:false})); sc.add(core);
  const shellsC=[0xffd27a,0xff8a3a,0x9a7cff]; const layers=shellsC.map((c,i)=>{ const m=new THREE.Mesh(new THREE.SphereGeometry(0.85+i*0.42,48,32),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.BackSide})); sc.add(m); return m; });
  const flash=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,0,128,128,128); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.3,'rgba(190,220,255,.8)'); g.addColorStop(1,'rgba(120,160,255,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,opacity:0,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending})); sc.add(flash);
  const wave=new THREE.Mesh(new THREE.TorusGeometry(1,0.018,8,160),new THREE.MeshBasicMaterial({color:0x9fd0ff,transparent:true,opacity:0,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false})); sc.add(wave);
  const N=1400, R=rnd(21), dirs=[], cols=[]; const pg=new THREE.BufferGeometry(); const pos=new Float32Array(N*3), col=new Float32Array(N*3);
  const pal=[new THREE.Color(0xff6a2a),new THREE.Color(0xffc24a),new THREE.Color(0x7a5cff),new THREE.Color(0x3ad0ff),new THREE.Color(0xff3a8a)];
  for(let i=0;i<N;i++){ const v=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize(); dirs.push([v,0.6+R()*0.8]); const c=pal[i%pal.length]; col.set([c.r,c.g,c.b],i*3); }
  pg.setAttribute('position',new THREE.BufferAttribute(pos,3)); pg.setAttribute('color',new THREE.BufferAttribute(col,3));
  const parts=new THREE.Points(pg,new THREE.PointsMaterial({size:0.16,vertexColors:true,transparent:true,opacity:0,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false})); sc.add(parts);
  const neb=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(512,512,(c,w,h)=>{ const r=rnd(33); c.filter='blur(18px)'; for(let i=0;i<60;i++){ const a=r()*6.28, d=60+r()*150; const x=256+Math.cos(a)*d, y=256+Math.sin(a)*d; const g=c.createRadialGradient(x,y,0,x,y,60+r()*60); const col=['255,106,42','255,194,74','122,92,255','58,208,255','255,58,138'][i%5]; g.addColorStop(0,`rgba(${col},.55)`); g.addColorStop(1,`rgba(${col},0)`); c.fillStyle=g; c.fillRect(0,0,w,h); } c.filter='none'; }),transparent:true,opacity:0,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending})); sc.add(neb);
  const ns=new THREE.Mesh(new THREE.SphereGeometry(0.12,24,16),new THREE.MeshBasicMaterial({color:0xcfe6ff,toneMapped:false})); sc.add(ns);
  const beams=[1,-1].map(sg=>{ const b=new THREE.Mesh(new THREE.ConeGeometry(0.06,2.4,16,1,true),new THREE.MeshBasicMaterial({color:0x9fd0ff,transparent:true,opacity:0,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})); b.geometry.translate(0,-1.2,0); b.rotation.z=sg>0?Math.PI:0; const g=new THREE.Group(); g.add(b); g.rotation.z=0.5; sc.add(g); return g; });
  const aC=new THREE.Object3D(); aC.position.set(0.4,0.4,0.3); sc.add(aC); const aW=new THREE.Object3D(); sc.add(aW); const aN=new THREE.Object3D(); aN.position.set(0.12,0.12,0); sc.add(aN);
  SCN[0]=function(lt){ star.rotation.y=lt*0.15;
    const see=cl((lt-0.15)/0.3); starM.opacity=1-0.75*see; layers.forEach((m,i)=>m.material.opacity=0.22*see*(1-cl((lt-1.05)/0.15)));
    const col_=easeIO(cl((lt-0.6)/0.4)); core.scale.setScalar(Math.max(0.15,1-0.8*col_)); core.material.color.copy(lerpC(0xfff2c0,0xffffff,col_));
    const ex=cl((lt-1.05)/1.4), e1=1-Math.pow(1-ex,3);
    star.visible=ex<0.12; star.scale.setScalar(1+0.6*e1); halo.material.opacity=1-cl(ex*3);
    flash.material.opacity=0.95*cl((lt-1.0)/0.06)*(1-cl((lt-1.1)/0.3)); flash.scale.setScalar(3+7*e1);
    wave.material.opacity=0.9*cl((lt-1.0)/0.1)*Math.pow(1-ex,2); wave.scale.setScalar(0.6+7*e1); wave.lookAt(cam.position);
    parts.material.opacity=cl((lt-1.05)/0.1)*(1-0.4*ex); const p=pg.attributes.position.array; dirs.forEach(([v,sp],i)=>{ const r=(0.6+7.5*e1*sp); p[i*3]=v.x*r; p[i*3+1]=v.y*r; p[i*3+2]=v.z*r; }); pg.attributes.position.needsUpdate=true;
    neb.material.opacity=0.9*cl((lt-1.05)/0.15)*(1-0.45*ex); neb.scale.setScalar(2+15*e1); neb.material.rotation=lt*0.1; core.visible=ex<0.02; ns.visible=ex>0.02; ns.scale.setScalar(1+0.25*Math.sin(lt*30)); beams.forEach(b=>{ b.rotation.y=lt*6; b.children[0].material.opacity=0.3*cl((lt-1.6)/0.3); });
    aW.position.set(0.7*(0.6+7*e1),0.7*(0.6+7*e1)*0.0+0.0,0); aW.position.y=0.7*(0.6+7*e1);
    const z=easeIO(cl(lt/2.6)); cam.position.set(1.2-0.6*z,0.8,22+6*cl((lt-1.0)/1.2)); cam.lookAt(0,0,0); P.c.render();
    layoutLabels(labs(0,[[0,aC,cl((lt-0.5)/0.2)*(1-cl((lt-1.0)/0.15))],[1,aW,cl((lt-1.25)/0.2)*(1-cl((lt-1.85)/0.2))],[2,aN,cl((lt-1.85)/0.2)]]),cam,640,140);
    caption(0,lt); };
})();

// ---------- S1 /scale the biggest star versus the Sun: Earth next to the Sun (109x wider), the camera pulls back fast, the Sun shrinks
// to a dot next to the red hypergiant Stephenson 2-18 (radius estimated around 2,000x the Sun's; estimates vary)
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020207); starField(sc,2400,23,4000); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.01,50000);
  const P=mkComposer(ren,sc,cam,{bloom:0.9,radius:0.7,th:0.6});
  sc.add(new THREE.AmbientLight(0xffffff,0.25)); const sl=new THREE.PointLight(0xfff0d0,4,0,0); sc.add(sl);
  const RS=1, RE=RS/109, RB=RS*2000;
  const surf=(c1,c2,seed)=>canvasTex(512,256,(c,w,h)=>{ c.fillStyle=c1; c.fillRect(0,0,w,h); const r=rnd(seed); c.filter='blur(2px)'; for(let i=0;i<2500;i++){ c.fillStyle=c2; c.globalAlpha=0.08+r()*0.18; c.beginPath(); c.arc(r()*w,r()*h,1+r()*3,0,7); c.fill(); } c.filter='none'; c.globalAlpha=1; });
  const sun=new THREE.Mesh(new THREE.SphereGeometry(RS,64,48),new THREE.MeshBasicMaterial({map:surf('#ffd36a','#ff9a2a',3),toneMapped:false})); sun.position.set(0,0,0); sc.add(sun);
  const sunG=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(128,128,(c,w,h)=>{ const g=c.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(255,220,140,1)'); g.addColorStop(.3,'rgba(255,170,60,.6)'); g.addColorStop(1,'rgba(255,120,30,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending})); sc.add(sunG);
  const earth=new THREE.Mesh(new THREE.SphereGeometry(RE,32,24),new THREE.MeshStandardMaterial({map:earthTex(),roughness:.7,emissive:0x0a1a3a,emissiveIntensity:.4})); earth.position.set(-RS-0.12,0,0.3); sc.add(earth);
  const bigG=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,90,128,128,128); g.addColorStop(0,'rgba(255,90,30,.0)'); g.addColorStop(.75,'rgba(255,90,30,.35)'); g.addColorStop(1,'rgba(255,60,20,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending})); sc.add(bigG);
  const big=new THREE.Mesh(new THREE.SphereGeometry(RB,96,64),new THREE.MeshBasicMaterial({map:surf('#b8260f','#ff6a2a',9),toneMapped:false})); big.position.set(RB*1.3,0,-RB*0.15); sc.add(big); bigG.position.copy(big.position); bigG.scale.set(RB*2.9,RB*2.9,1);
  const aSun=new THREE.Object3D(); aSun.position.set(0,RS*0.6,0); sun.add(aSun); const aBig=new THREE.Object3D(); sc.add(aBig); const aE=new THREE.Object3D(); earth.add(aE); aE.position.set(0,RE,0);
  SCN[1]=function(lt){ sun.rotation.y=lt*0.2; big.rotation.y=lt*0.05;
    const pu=easeIO(cl((lt-0.55)/1.6)); const d0=0.45, d1=RB*5.2; const d=d0*Math.pow(d1/d0,pu);
    const tx=(-RS-0.12)*(1-cl(pu*3))+ (RB*0.55)*cl((pu-0.4)/0.6);
    cam.position.set(tx+d*0.12,d*0.18,d); cam.lookAt(tx,0,0); sl.position.copy(cam.position);
    sunG.position.copy(sun.position); const sd=Math.max(RS*3, d*0.02); sunG.scale.set(sd,sd,1);
    aBig.position.set(RB*0.65,RB*0.75,RB*0.3);
    P.c.render();
    layoutLabels(labs(1,[[0,aE,cl((lt-0.1)/0.2)*(1-cl((lt-0.7)/0.2))],[1,aSun,cl((lt-0.35)/0.2)],[2,aBig,cl((lt-1.7)/0.2)]]),cam,640,140);
    caption(1,lt); };
})();

// ---------- S2 /what-if Earth had rings: Earth with a Saturn-like ring of ice and rock, then the view from the ground: a giant
// arch across the sky over a city skyline, sunset light
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020207); starField(sc,2400,31,600); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.05,3000);
  const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.6,th:0.75});
  const sun=new THREE.DirectionalLight(0xffffff,1.3); sun.position.set(8,3,6); sc.add(sun); sc.add(new THREE.AmbientLight(0x2a3550,0.35));
  const RE=1.6; const E=new THREE.Group(); E.rotation.z=0.41; sc.add(E);
  const earth=new THREE.Mesh(new THREE.SphereGeometry(RE,96,64),new THREE.MeshStandardMaterial({map:earthTex(),roughness:.7,emissive:0x0a1a3a,emissiveIntensity:.25})); E.add(earth);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(RE*1.04,64,40),glowMat(0x5aa0ff,.18)); E.add(atm);
  const rt=canvasTex(1024,32,(c,w,h)=>{ const r=rnd(4); for(let x=0;x<w;x++){ const a=(0.45+0.5*r())*(x<40?x/40:1)*(x>w-60?(w-x)/60:1); const v=200+r()*55|0; c.fillStyle=`rgba(${v},${v-10},${v-25},${a})`; c.fillRect(x,0,1,h); } });
  const ring=new THREE.Mesh(new THREE.RingGeometry(RE*1.35,RE*2.6,200,1),new THREE.MeshStandardMaterial({map:rt,transparent:true,side:THREE.DoubleSide,roughness:.9,depthWrite:false}));
  { const g=ring.geometry, p=g.attributes.position, uv=g.attributes.uv, v=new THREE.Vector3(); for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); uv.setXY(i,(v.length()-RE*1.35)/(RE*1.25),0.5); } }
  ring.rotation.x=-Math.PI/2; E.add(ring);
  // ground view (separate scene drawn on a 2D canvas overlay)
  const ov=document.createElement('canvas'); ov.width=1080; ov.height=1920; ov.style.cssText='position:absolute;inset:0;width:1080px;height:1920px;opacity:0'; document.getElementById('cv2').parentNode.insertBefore(ov,document.getElementById('cv2').nextSibling); const g=ov.getContext('2d');
  const R=rnd(77); const bld=[]; let x=-20; while(x<1100){ const w=40+R()*90, h=120+R()*420; bld.push([x,w,h,R()]); x+=w+4; }
  function ground(t){ const sky=g.createLinearGradient(0,0,0,1920); sky.addColorStop(0,'#0b1430'); sky.addColorStop(.55,'#3d3a6e'); sky.addColorStop(.8,'#ff8a4a'); sky.addColorStop(1,'#ffcf8a'); g.fillStyle=sky; g.fillRect(0,0,1080,1920);
    const r=rnd(5); for(let i=0;i<160;i++){ g.fillStyle=`rgba(255,255,255,${0.3+0.5*r()})`; g.fillRect(r()*1080,r()*900,2,2); }
    // the ring seen from the ground: a huge bright arch with bands and a shadow gap
    g.save(); g.translate(540+40*t,2600); g.rotate(-0.18); for(let k=0;k<60;k++){ const rr=1800+k*9; g.strokeStyle=`rgba(${235-k},${225-k},${205-k*1.5},${0.08+0.25*Math.abs(Math.sin(k*1.7))})`; g.lineWidth=8; g.beginPath(); g.arc(0,0,rr,Math.PI*1.08,Math.PI*1.92); g.stroke(); } g.restore();
    g.fillStyle='#120d1c'; bld.forEach(([bx,bw,bh,q])=>{ g.fillRect(bx,1920-260-bh,bw,bh+260); }); g.fillStyle='rgba(255,210,140,.8)'; bld.forEach(([bx,bw,bh,q],i)=>{ const r2=rnd(i+3); for(let j=0;j<10;j++) if(r2()<0.45) g.fillRect(bx+6+r2()*(bw-14),1920-260-bh+12+r2()*(bh-10),5,7); });
    g.fillStyle='#08060d'; g.fillRect(0,1660,1080,260); }
  const aR=new THREE.Object3D(); aR.position.set(-RE*1.1,0,RE*1.05); E.add(aR);
  SCN[2]=function(lt){ earth.rotation.y=0.6+lt*0.3; ring.rotation.z=lt*0.08;
    const appear=backOut(cl(lt/0.5)); E.scale.setScalar(Math.max(0.001,appear));
    const z=easeIO(cl(lt/1.4)); cam.position.set(4.0-1.0*z,5.2-1.2*z,14.5-2.0*z); cam.lookAt(0,-0.2,0); P.c.render();
    const gv=cl((lt-1.35)/0.25); ov.style.opacity=gv; if(gv>0) ground(lt-1.35);
    layoutLabels(labs(2,[[0,aR,cl((lt-0.45)/0.2)*(1-gv)]]),cam,640,140);
    const l1=document.getElementById('l2_1'); l1.style.left='120px'; l1.style.top='1220px'; l1.style.opacity=cl((lt-1.6)/0.2); const ld=l1.querySelector('.ld'); if(ld) ld.style.width='0px';
    caption(2,lt); };
})();
