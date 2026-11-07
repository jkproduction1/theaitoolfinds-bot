// ---------- v2 look: real studio HDRI (CC0, pmndrs/assets "studio"), bloom, depth of field
function b64buf(s){ const bin=atob(s); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u.buffer; }
let _HDR=null;
function hdrEnv(ren){ if(!_HDR){ const d=new THREE.EXRLoader().parse(b64buf(window.STUDIO_EXR));
    const t=new THREE.DataTexture(d.data,d.width,d.height,d.format,d.type); t.mapping=THREE.EquirectangularReflectionMapping; t.encoding=THREE.LinearEncoding;
    t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter; t.generateMipmaps=false; t.flipY=false; t.needsUpdate=true; _HDR=t; }
  const pm=new THREE.PMREMGenerator(ren.raw||ren); return pm.fromEquirectangular(_HDR).texture; }
function mkComposer(ren,sc,cam,o){ o=o||{}; const c=new THREE.EffectComposer(ren); c.setPixelRatio(1); c.setSize(1080,1920);
  c.addPass(new THREE.RenderPass(sc,cam));
  const bl=new THREE.UnrealBloomPass(new THREE.Vector2(540,960),o.bloom??0.45,o.radius??0.5,o.th??0.95); c.addPass(bl);
  let bk=null; if(o.dof){ bk=new THREE.BokehPass(sc,cam,{focus:o.focus||6,aperture:o.aperture||0.0012,maxblur:o.maxblur||0.006}); c.addPass(bk); }
  return {c,bl,bk}; }
// one shared WebGL context for all three results (3 contexts + bloom buffers ran the container out of memory)
const SHARED=(()=>{ const r=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true}); r.setPixelRatio(1); r.setSize(1080,1920,false);
  r.outputEncoding=THREE.sRGBEncoding; r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=1.0; r.shadowMap.enabled=true; r.shadowMap.type=THREE.PCFSoftShadowMap; r.setClearColor(0x07080a,1); return r; })();
function mkRenderer2(id){ const g2=document.getElementById(id).getContext('2d');
  return {raw:SHARED, shadowMap:{}, toneMapping:0, toneMappingExposure:1, render(sc,cam){ SHARED.render(sc,cam); g2.drawImage(SHARED.domElement,0,0); }}; }
function bgGrad(sc,c1,c2){ const t=canvasTex(512,1024,(g,w,h)=>{ const gr=g.createRadialGradient(w/2,h*0.42,10,w/2,h*0.45,h*0.62); gr.addColorStop(0,c1); gr.addColorStop(1,c2); g.fillStyle=gr; g.fillRect(0,0,w,h); }); sc.background=t; }
function lerpC(a,b,t){ return new THREE.Color(a).lerp(new THREE.Color(b),t); }
function glowMat(c,op){ return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op??1,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false}); }
function rnd(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
function tubeBetween(a,b,r,mat){ const A=new THREE.Vector3(...a), B=new THREE.Vector3(...b); const d=B.clone().sub(A); const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),20),mat);
  m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()); return m; }

function easeOut2(x){ return 1-Math.pow(1-x,4); }
function backOut(x){ x=cl(x); const c1=1.9, c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); }
function roundedPath(pts,r,y){ const cp=new THREE.CurvePath(); const P=pts.map(p=>new THREE.Vector3(p[0],y,p[1])); let cur=P[0].clone();
  for(let i=1;i<P.length;i++){ const a=P[i-1], b=P[i];
    if(i<P.length-1){ const c=P[i+1]; const d1=b.clone().sub(a).normalize(), d2=c.clone().sub(b).normalize();
      const p1=b.clone().addScaledVector(d1,-r), p2=b.clone().addScaledVector(d2,r);
      cp.add(new THREE.LineCurve3(cur.clone(),p1)); cp.add(new THREE.QuadraticBezierCurve3(p1,b.clone(),p2)); cur=p2; }
    else cp.add(new THREE.LineCurve3(cur.clone(),b.clone())); }
  return cp; }
function ribbon(curve,w,y,mat,N){ N=N||200; const pos=[], idx=[]; for(let i=0;i<=N;i++){ const u=i/N, p=curve.getPointAt(u), t=curve.getTangentAt(u); const n=new THREE.Vector3(-t.z,0,t.x).normalize();
      pos.push(p.x+n.x*w/2,y,p.z+n.z*w/2, p.x-n.x*w/2,y,p.z-n.z*w/2); if(i<N){ const a=i*2; idx.push(a,a+1,a+2, a+1,a+3,a+2); } }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setIndex(idx); g.computeVertexNormals(); mat.side=THREE.DoubleSide; const m=new THREE.Mesh(g,mat); m.receiveShadow=true; return m; }
function tubeReveal(mesh,u,tub,rad){ mesh.geometry.setDrawRange(0,Math.floor(cl(u)*tub)*rad*6); }
function lbl(id,obj,cam,ox,oy,a){ const el=document.getElementById(id); placeLabel(el,obj,cam,ox,oy,a); const ld=el.querySelector('.ld'); if(ld) ld.style.display='none';
  el.style.transform='translate(-50%,-100%) scale('+(0.85+0.15*a)+')'; }
function pinMesh(color,num){ const g=new THREE.Group(); const m=new THREE.MeshStandardMaterial({color,roughness:.35,metalness:.05,envMapIntensity:.5,emissive:color,emissiveIntensity:.35});
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.34,32,20),m); head.position.y=0.95; head.castShadow=true; g.add(head);
  const tip=new THREE.Mesh(new THREE.ConeGeometry(0.3,0.62,32),m); tip.rotation.x=Math.PI; tip.position.y=0.55; tip.castShadow=true; g.add(tip);
  if(num){ const t=canvasTex(128,128,(c,w,h)=>{ c.fillStyle='#fff'; c.font='900 100px Inter, Arial'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(num,w/2,h/2+6); });
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,toneMapped:false})); s.scale.set(0.6,0.6,1); s.position.y=0.96; s.renderOrder=5; g.add(s); }
  else { const d=new THREE.Mesh(new THREE.SphereGeometry(0.13,20,14),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.4})); d.position.set(0,0.95,0.26); g.add(d); }
  return g; }


// ---------- 2D-in-3D helper: draw with a 2D canvas, show it as a full-screen quad (so bloom still works)
function flat2D(id,bloom){ const ren=mkRenderer2(id);
  const sc=new THREE.Scene(), cam=new THREE.OrthographicCamera(-1,1,1,-1,0,2); cam.position.z=1;
  const c=document.createElement('canvas'); c.width=1080; c.height=1920; const g=c.getContext('2d');
  const tx=new THREE.CanvasTexture(c); tx.encoding=THREE.sRGBEncoding;
  sc.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({map:tx,toneMapped:false})));
  const P=bloom?mkComposer(ren,sc,cam,bloom):null;
  return {g,draw(){ tx.needsUpdate=true; if(P) P.c.render(); else ren.render(sc,cam); }}; }
const hsh=(i,j)=>{ const s=Math.sin(i*127.1+(j||0)*311.7)*43758.5453; return s-Math.floor(s); };
// stick-figure pose (canvas coords, y down). kind: 'run' | 'walk'. returns joints
function pose(ph,kind,o){ o=o||{}; const A=kind==='run'?0.75:0.38, s=Math.sin(ph), c=Math.cos(ph);
  const hip=[o.x||0,(o.y||0)-(kind==='run'?7*Math.abs(c):3*Math.abs(c))], lean=o.lean??(kind==='run'?0.22:0.06);
  const neck=[hip[0]+Math.sin(lean)*74,hip[1]-Math.cos(lean)*74], head=[neck[0]+Math.sin(lean)*28,neck[1]-Math.cos(lean)*28];
  const leg=(a,b)=>{ const k=[hip[0]+Math.sin(a)*52,hip[1]+Math.cos(a)*52]; const sa=a-b; return [k,[k[0]+Math.sin(sa)*52,k[1]+Math.cos(sa)*52]]; };
  const bl=kind==='run'?1.1:0.45, L1=leg(A*s,0.15+bl*Math.max(0,-c)), L2=leg(-A*s,0.15+bl*Math.max(0,c));
  const sh=[hip[0]+Math.sin(lean)*60,hip[1]-Math.cos(lean)*60];
  const arm=(a,b)=>{ const e=[sh[0]+Math.sin(a)*40,sh[1]+Math.cos(a)*40]; return [e,[e[0]+Math.sin(a+b)*36,e[1]+Math.cos(a+b)*36]]; };
  const R1=o.armUp?arm(Math.PI-0.35,0.15):arm(-A*1.1*s,kind==='run'?-1.3:-0.35), R2=arm(A*1.1*s,kind==='run'?-1.3:-0.35);
  return {hip,neck,head,sh,L1,L2,R1,R2}; }
function strokeFig(g,p,jit){ const J=(q,i)=>jit?[q[0]+(hsh(i,jit)-.5)*3,q[1]+(hsh(i+9,jit)-.5)*3]:q; let i=0;
  const seg=(a,b,c)=>{ g.beginPath(); const A=J(a,i++),B=J(b,i++); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); if(c){ const C=J(c,i++); g.lineTo(C[0],C[1]); } g.stroke(); };
  seg(p.hip,p.neck); seg(p.hip,p.L1[0],p.L1[1]); seg(p.hip,p.L2[0],p.L2[1]); seg(p.sh,p.R1[0],p.R1[1]); seg(p.sh,p.R2[0],p.R2[1]);
  g.beginPath(); const H=J(p.head,i++); g.arc(H[0],H[1],24,0,Math.PI*2); g.stroke(); }

// ---------- S0 /zack-d-films what if you jumped on the Moon: an astronaut crouches and jumps; low gravity carries him
// high and slow, dust flies out in clean arcs (no air on the Moon), Earth hangs in the black sky. Moon gravity ≈ 1/6 of Earth's.
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); 
  sc.background=new THREE.Color(0x020203); const cam=new THREE.PerspectiveCamera(38,1080/1920,0.1,600);
  const sun=new THREE.DirectionalLight(0xfff6ea,1.7); sun.position.set(14,10,8); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-12,right:12,top:14,bottom:-6,far:60}); sun.shadow.bias=-0.0005; sc.add(sun); sc.add(new THREE.HemisphereLight(0x8090b0,0x202020,0.12));
  // ground with craters
  const gg=new THREE.PlaneGeometry(140,140,260,260); gg.rotateX(-Math.PI/2); const pp=gg.attributes.position; const R=rnd(7); const cr=[];
  for(let i=0;i<70;i++) cr.push([R()*120-60,R()*120-80,0.6+R()*R()*5]);
  for(let i=0;i<pp.count;i++){ const x=pp.getX(i), z=pp.getZ(i); let y=0.15*Math.sin(x*0.3)*Math.cos(z*0.27)+0.08*Math.sin(x*1.3+z*0.7);
    for(const [cx,cz,r] of cr){ const d=Math.hypot(x-cx,z-cz)/r; if(d<1.4) y+= d<1? -0.32*r*(1-d*d)*0.35 : 0.12*r*Math.sin((d-1)/0.4*Math.PI)*0.35; } pp.setY(i,y); }
  gg.computeVertexNormals();
  const gtex=canvasTex(512,512,(c,w,h)=>{ c.fillStyle='#8a8a88'; c.fillRect(0,0,w,h); for(let i=0;i<9000;i++){ const v=110+R()*60|0; c.fillStyle=`rgba(${v},${v},${v-4},.35)`; c.fillRect(R()*w,R()*h,1+R()*2,1+R()*2); } });
  gtex.wrapS=gtex.wrapT=THREE.RepeatWrapping; gtex.repeat.set(24,24);
  const ground=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({color:0x8e8d89,map:gtex,roughness:1,metalness:0,envMapIntensity:0.15})); ground.receiveShadow=true; sc.add(ground);
  // stars + Earth
  const sp=[]; for(let i=0;i<1500;i++){ const th=R()*Math.PI*2, ph=R()*0.9+0.08, r=400; sp.push(Math.cos(th)*Math.cos(ph)*r,Math.sin(ph)*r,Math.sin(th)*Math.cos(ph)*r-60); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sc.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.1,sizeAttenuation:false,toneMapped:false})));
  const etex=canvasTex(1024,512,(c,w,h)=>{ c.fillStyle='#1d4fa8'; c.fillRect(0,0,w,h); const r=rnd(3);
    for(let i=0;i<22;i++){ c.fillStyle=i%3?'#3f8a4a':'#b59a62'; c.beginPath(); const x=r()*w,y=h*.2+r()*h*.6; for(let k=0;k<14;k++){ const a=k/14*Math.PI*2, rr=30+r()*70; c.lineTo(x+Math.cos(a)*rr*1.4,y+Math.sin(a)*rr*.8); } c.fill(); }
    for(let i=0;i<60;i++){ c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(r()*w,r()*h,40+r()*90,8+r()*14,r()*.5,0,Math.PI*2); c.fill(); } });
  const earth=new THREE.Mesh(new THREE.SphereGeometry(6,64,40),new THREE.MeshStandardMaterial({map:etex,roughness:.7,emissive:0x0a1a3a,emissiveIntensity:.3})); earth.position.set(-32,38,-130); sc.add(earth);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(6.4,48,32),glowMat(0x5aa0ff,.18)); atm.position.copy(earth.position); sc.add(atm);
  // astronaut: white suit with volume, chest panel, belt, gloves, neck ring, big gold mirrored visor over the whole face
  const suit=new THREE.MeshStandardMaterial({color:0xe9e8e2,roughness:.62,envMapIntensity:.55}), dark=new THREE.MeshStandardMaterial({color:0x5f646c,roughness:.55,envMapIntensity:.5}),
    visor=new THREE.MeshStandardMaterial({color:0xe0aa3e,metalness:1,roughness:.08,envMapIntensity:1.6}), strap=new THREE.MeshStandardMaterial({color:0xb9bcc2,roughness:.5});
  sc.environment=hdrEnv(ren);
  const rim=new THREE.DirectionalLight(0x9fc0ff,1.1); rim.position.set(-6,5,-9); sc.add(rim); const fill=new THREE.DirectionalLight(0xffffff,0.35); fill.position.set(2,3,12); sc.add(fill);
  const cap=(r,l,m)=>{ const o=new THREE.Mesh(new THREE.CapsuleGeometry(r,l,10,24),m); o.castShadow=true; return o; };
  const man=new THREE.Group(); sc.add(man); const body=new THREE.Group(); man.add(body); body.position.y=1.15;
  const torso=cap(0.38,0.5,suit); torso.position.y=0.47; torso.scale.set(1,1,.85); body.add(torso);
  const belt=new THREE.Mesh(new THREE.TorusGeometry(0.36,0.05,12,40),strap); belt.rotation.x=Math.PI/2; belt.scale.set(1,.85,1); belt.position.y=0.1; body.add(belt);
  const panel=new THREE.Mesh(rbox(0.36,0.26,0.08,0.04),dark); panel.position.set(0,0.62,0.31); body.add(panel);
  [0xff4b3e,0x3ec1ff,0xf5d142].forEach((c,i)=>{ const b=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.03,16),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.6})); b.rotation.x=Math.PI/2; b.position.set(-0.1+i*0.1,0.62,0.36); body.add(b); });
  const pack=new THREE.Mesh(rbox(0.66,0.82,0.34,0.1),suit); pack.position.set(0,0.52,-0.4); pack.castShadow=true; body.add(pack);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(0.24,0.06,14,40),strap); ring.rotation.x=Math.PI/2; ring.position.y=0.92; body.add(ring);
  const helmet=new THREE.Mesh(new THREE.SphereGeometry(0.36,48,32),suit); helmet.position.y=1.2; helmet.castShadow=true; body.add(helmet);
  const vz=new THREE.Mesh(new THREE.SphereGeometry(0.372,48,32,-Math.PI*0.36,Math.PI*0.72,Math.PI*0.28,Math.PI*0.42),visor); vz.position.set(0,1.2,0); vz.rotation.y=Math.PI/2; body.add(vz);
  const limb=(px,py,l1,l2,r,m)=>{ const a=new THREE.Group(); a.position.set(px,py,0); const u=cap(r,l1,m); u.position.y=-l1/2-r*.3; a.add(u); const b=new THREE.Group(); b.position.y=-l1-r*.4; a.add(b); const d=cap(r*.92,l2,m); d.position.y=-l2/2-r*.3; b.add(d); return [a,b,d]; };
  const [lA,lB]=limb(-0.19,0.05,0.42,0.42,0.16,suit), [rA,rB]=limb(0.19,0.05,0.42,0.42,0.16,suit); body.add(lA); body.add(rA);
  const bootL=new THREE.Mesh(rbox(0.28,0.16,0.44,0.06),dark); bootL.position.set(0,-0.56,0.07); bootL.castShadow=true; lB.add(bootL); const bootR=bootL.clone(); rB.add(bootR);
  const [alA,alB,alF]=limb(-0.5,0.78,0.34,0.32,0.13,suit), [arA,arB,arF]=limb(0.5,0.78,0.34,0.32,0.13,suit); body.add(alA); body.add(arA);
  [alB,arB].forEach(b=>{ const gl=new THREE.Mesh(new THREE.SphereGeometry(0.12,24,16),dark); gl.scale.set(1,1.15,.9); gl.position.y=-0.44; gl.castShadow=true; b.add(gl); });
  man.rotation.y=0.35;
  // dust: grains fly in clean ballistic arcs (no air), gravity g=1.62 m/s² scaled
  const N=420, dp=new Float32Array(N*3), dv=[]; for(let i=0;i<N;i++){ const a=R()*Math.PI*2, s=0.6+R()*1.8; dv.push([Math.cos(a)*s,1.0+R()*2.2,Math.sin(a)*s,R()*0.12]); }
  const dg=new THREE.BufferGeometry(); dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
  const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xc9c6bd,size:0.05,transparent:true,opacity:.9})); sc.add(dust);
  const T0=0.42, FL=2.6, HMAX=3.2;
  SCN[0]=function(lt0){ const lt=lt0*1.15;
    const crouch=cl(lt/T0), air=cl((lt-T0)/FL), inAir=lt>T0 && air<1;
    const y=inAir?HMAX*4*air*(1-air):0; const sq=lt<T0?Math.sin(crouch*Math.PI/2)*0.32:inAir?0:0;
    body.position.y=1.15-sq+y;
    const tuck=inAir?Math.sin(air*Math.PI):0;
    lA.rotation.x=-0.5*crouch*(lt<T0?1:0)-0.9*tuck; lB.rotation.x=1.0*crouch*(lt<T0?1:0)+1.4*tuck; rA.rotation.x=lA.rotation.x+0.2*tuck; rB.rotation.x=lB.rotation.x-0.1*tuck;
    const sw=lt<T0?crouch:0; alA.rotation.z=-0.18-0.7*tuck; arA.rotation.z=0.18+0.7*tuck; alA.rotation.x=0.6*sw-1.5*tuck; arA.rotation.x=0.6*sw-1.3*tuck; alB.rotation.x=-0.5-0.3*tuck; arB.rotation.x=-0.5-0.4*tuck;
    body.rotation.x=0.18*crouch*(lt<T0?1:0)-0.1*tuck;
    const dt=lt-T0; for(let i=0;i<N;i++){ const v=dv[i]; const tt=Math.max(0,dt-v[3]); let x=v[0]*tt, yy=0.05+v[1]*tt-0.81*tt*tt, z=v[2]*tt; if(yy<0.02){ yy=0.02; } if(dt<v[3]){ x=0; yy=-5; z=0; }
      const r=Math.hypot(v[0],v[2])*0.12; dp[i*3]=x+Math.sign(v[0])*r; dp[i*3+1]=yy; dp[i*3+2]=z; }
    dg.attributes.position.needsUpdate=true; dust.material.opacity=0.9*(1-cl((dt-2.2)/0.8));
    cam.position.set(4.0+0.25*lt, 1.6+0.25*y, 11.5-0.4*cl(lt/2)); cam.lookAt(0,2.6+0.3*y,0);
    ren.render(sc,cam); caption(0,lt); };
})();

// ---------- S1 /explain-3d our solar system: the Sun in the middle, the 8 planets on their orbits (inner ones move faster,
// outer ones slower); the camera tilts down from a side view to an overview while the planet names pop in one by one.
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x030409);
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.1,800); const R=rnd(31);
  const sp=[]; for(let i=0;i<2500;i++){ const v=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(300); sp.push(v.x,v.y,v.z); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sc.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.2,sizeAttenuation:false,toneMapped:false})));
  const sunTex=canvasTex(512,256,(c,w,h)=>{ c.fillStyle='#ffb21f'; c.fillRect(0,0,w,h); const r=rnd(4); for(let i=0;i<500;i++){ c.fillStyle=`rgba(255,${120+r()*120|0},0,${.15+r()*.3})`; c.beginPath(); c.arc(r()*w,r()*h,4+r()*20,0,Math.PI*2); c.fill(); } });
  const sun=new THREE.Mesh(new THREE.SphereGeometry(1.7,64,40),new THREE.MeshBasicMaterial({map:sunTex,toneMapped:false})); sc.add(sun);
  const glowT=canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,0,128,128,128); g.addColorStop(0,'rgba(255,200,90,.9)'); g.addColorStop(.35,'rgba(255,150,40,.35)'); g.addColorStop(1,'rgba(255,120,20,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false})); glow.scale.set(9,9,1); sc.add(glow);
  const pl=new THREE.PointLight(0xfff1d6,3.2,0,0); sc.add(pl); sc.add(new THREE.AmbientLight(0x404a60,0.25));
  // name, orbit radius (scene units, not to scale), size, colour, speed (inner faster)
  const P=[['Mercury',2.9,.3,'#a9a29a',4.1],['Venus',3.8,.5,'#e8c48a',3.0],['Earth',4.8,.55,'#3d7fd6',2.5],['Mars',5.8,.42,'#d0603a',2.0],
           ['Jupiter',7.2,1.15,'#d9b38c',1.1],['Saturn',8.6,.95,'#e6d29a',.8],['Uranus',9.8,.7,'#9fe0e6',.55],['Neptune',10.9,.68,'#4b6fe0',.42]];
  const tag=(name)=>{ const t=canvasTex(512,128,(c,w,h)=>{ c.font='700 58px Inter, Arial'; c.textAlign='center'; c.textBaseline='middle'; const tw=c.measureText(name).width+56;
      c.fillStyle='rgba(8,9,12,.85)'; c.beginPath(); c.roundRect(w/2-tw/2,h/2-40,tw,80,40); c.fill(); c.fillStyle='#fff'; c.fillText(name,w/2,h/2+3); });
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,toneMapped:false})); s.scale.set(3.6,.9,1); s.renderOrder=9; return s; };
  const planets=P.map(([n,r,sz,col,sp],k)=>{ const tex=canvasTex(256,128,(c,w,h)=>{ c.fillStyle=col; c.fillRect(0,0,w,h); const rr=rnd(k+3); for(let i=0;i<(k>=4?14:60);i++){ c.fillStyle=`rgba(${rr()>.5?255:0},${rr()>.5?255:0},${rr()>.5?255:0},.08)`; if(k>=4) c.fillRect(0,rr()*h,w,4+rr()*10); else { c.beginPath(); c.arc(rr()*w,rr()*h,3+rr()*10,0,7); c.fill(); } } });
    const m=new THREE.Mesh(new THREE.SphereGeometry(sz,40,28),new THREE.MeshStandardMaterial({map:tex,roughness:.85})); sc.add(m);
    if(n==='Saturn'){ const rg=new THREE.Mesh(new THREE.RingGeometry(sz*1.25,sz*1.75,64),new THREE.MeshBasicMaterial({color:0xd8c79a,side:THREE.DoubleSide,transparent:true,opacity:.75})); rg.rotation.x=Math.PI/2.4; m.add(rg); }
    const o=new THREE.Mesh(new THREE.RingGeometry(r-0.015,r+0.015,160),new THREE.MeshBasicMaterial({color:0x8090b0,transparent:true,opacity:.35,side:THREE.DoubleSide,toneMapped:false})); o.rotation.x=-Math.PI/2; sc.add(o);
    const t=tag(n); sc.add(t); return {m,r,sp,t,a0:k*0.9+0.4,sz}; });
  SCN[1]=function(lt0){ const lt=lt0*1.15; sun.rotation.y=lt*0.2;
    planets.forEach((p,k)=>{ const a=p.a0+lt*p.sp*0.35; p.m.position.set(Math.cos(a)*p.r,0,-Math.sin(a)*p.r); p.m.rotation.y=lt*1.5;
      const on=cl((lt-0.35-k*0.16)/0.2); p.t.position.copy(p.m.position).add(new THREE.Vector3(0,p.sz+0.55,0)); p.t.material.opacity=on; p.t.scale.set(3.6*(0.7+0.3*on),.9*(0.7+0.3*on),1); });
    const u=easeIO(cl(lt/3.2)), el=0.45+0.6*u, d=62-5*u; cam.position.set(Math.sin(0.25)*d*Math.cos(el),d*Math.sin(el),Math.cos(0.25)*d*Math.cos(el)); cam.lookAt(0,-0.6,0);
    ren.render(sc,cam); caption(1,lt); };
})();

// ---------- S2 /deep-dive how a black hole works: a black sphere (the event horizon, the point of no return) wrapped in a hot
// glowing accretion disk of gas spiralling in; a star drifts too close, is stretched into a long stream and spirals into the disk.
// Labels: accretion disk / event horizon / singularity (textbook simplified).
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020205);
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.1,800); const R=rnd(77);
  const sp=[]; for(let i=0;i<2200;i++){ const v=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(300); sp.push(v.x,v.y,v.z); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sc.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.1,sizeAttenuation:false,toneMapped:false})));
  const diskT=canvasTex(1024,1024,(c,w,h)=>{ const cx=w/2; const g=c.createRadialGradient(cx,cx,w*0.16,cx,cx,w*0.5); g.addColorStop(0,'rgba(255,250,230,1)'); g.addColorStop(.12,'rgba(255,210,120,1)'); g.addColorStop(.4,'rgba(255,120,30,.85)'); g.addColorStop(.75,'rgba(180,40,10,.35)'); g.addColorStop(1,'rgba(80,10,0,0)');
    c.fillStyle=g; c.fillRect(0,0,w,h); const r=rnd(9); c.globalCompositeOperation='multiply'; for(let i=0;i<260;i++){ const rr=w*(0.17+r()*0.32), a=r()*Math.PI*2; c.strokeStyle=`rgba(${120+r()*100|0},${40+r()*60|0},0,.35)`; c.lineWidth=2+r()*6; c.beginPath(); c.arc(cx,cx,rr,a,a+0.4+r()*1.4); c.stroke(); }
    c.globalCompositeOperation='destination-out'; c.beginPath(); c.arc(cx,cx,w*0.155,0,7); c.fill(); });
  const disk=new THREE.Mesh(new THREE.RingGeometry(1.5,5.2,128,1),new THREE.MeshBasicMaterial({map:diskT,transparent:true,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
  // RingGeometry UVs map the square texture: fine for a radial gradient
  disk.rotation.x=-Math.PI/2+0.18; sc.add(disk);
  const halo=new THREE.Mesh(new THREE.RingGeometry(1.25,1.75,96),new THREE.MeshBasicMaterial({color:0xffd9a0,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false,side:THREE.DoubleSide})); sc.add(halo);
  const hole=new THREE.Mesh(new THREE.SphereGeometry(1.25,64,40),new THREE.MeshBasicMaterial({color:0x000000})); sc.add(hole);
  // the star and its stream
  const star=new THREE.Mesh(new THREE.SphereGeometry(0.42,40,28),new THREE.MeshBasicMaterial({color:0xbfe0ff,toneMapped:false})); sc.add(star);
  const sglowT=canvasTex(128,128,(c,w,h)=>{ const g=c.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(190,225,255,.9)'); g.addColorStop(1,'rgba(120,180,255,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  const sgl=new THREE.Sprite(new THREE.SpriteMaterial({map:sglowT,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false})); sc.add(sgl);
  const NS=500, spos=new Float32Array(NS*3), sgeo=new THREE.BufferGeometry(); sgeo.setAttribute('position',new THREE.BufferAttribute(spos,3));
  const stream=new THREE.Points(sgeo,new THREE.PointsMaterial({color:0xcfe6ff,size:0.07,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false})); sc.add(stream);
  const path=(u)=>{ const r=7.5-6.0*u, a=-0.6+u*5.2; return new THREE.Vector3(Math.cos(a)*r,0.5*(1-u)+Math.sin(0.18)*(-Math.sin(a)*r)*0,-Math.sin(a)*r); };
  const anchors=[new THREE.Object3D(),new THREE.Object3D(),new THREE.Object3D()]; anchors[0].position.set(4.2,0,0.6); anchors[1].position.set(-0.9,0.9,0.4); anchors[2].position.set(0,0,0); anchors.forEach(a=>sc.add(a));
  SCN[2]=function(lt0){ const lt=lt0*1.15; disk.rotation.z=lt*0.6;
    const u=easeIO(cl((lt-0.2)/2.6)); const head=path(u*0.92); star.position.copy(head); sgl.position.copy(head); sgl.scale.setScalar(2.2*(1-u*0.6));
    star.scale.set(1+u*2.2,1-u*0.6,1-u*0.6); star.lookAt(0,0,0); star.visible=u<0.9;
    for(let i=0;i<NS;i++){ const f=i/NS, uu=Math.max(0,u*0.92-f*0.55*u); const q=path(uu); spos[i*3]=q.x+(R()-.5)*0.05*u; spos[i*3+1]=q.y+(R()-.5)*0.05*u; spos[i*3+2]=q.z+(R()-.5)*0.05*u; }
    sgeo.attributes.position.needsUpdate=true; stream.material.opacity=0.95*cl(u*4);
    halo.lookAt(cam.position);
    const d=19-3*easeIO(cl(lt/3)); cam.position.set(Math.sin(0.5+lt*0.05)*d*0.95,d*0.28,Math.cos(0.5+lt*0.05)*d*0.95); cam.lookAt(0,0.4,0);
    layoutLabels([['l2_0',anchors[0],cl((lt-0.8)/0.2)],['l2_1',anchors[1],cl((lt-1.15)/0.2)],['l2_2',anchors[2],cl((lt-1.5)/0.2)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,620,150);
    ren.render(sc,cam); caption(2,lt); };
})();
