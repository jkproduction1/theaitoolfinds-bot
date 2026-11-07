// ---------- v2 look: real studio HDRI (CC0, pmndrs/assets "studio"), bloom, depth of field
function b64buf(s){ const bin=atob(s); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u.buffer; }
let _HDR=null;
function hdrEnv(ren){ if(!_HDR){ const d=new THREE.EXRLoader().parse(b64buf(window.STUDIO_EXR));
    const t=new THREE.DataTexture(d.data,d.width,d.height,d.format,d.type); t.mapping=THREE.EquirectangularReflectionMapping; t.encoding=THREE.LinearEncoding;
    t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter; t.generateMipmaps=false; t.flipY=false; t.needsUpdate=true; _HDR=t; }
  const pm=new THREE.PMREMGenerator(ren); return pm.fromEquirectangular(_HDR).texture; }
function mkComposer(ren,sc,cam,o){ o=o||{}; const c=new THREE.EffectComposer(ren); c.setPixelRatio(1); c.setSize(1080,1920);
  c.addPass(new THREE.RenderPass(sc,cam));
  const bl=new THREE.UnrealBloomPass(new THREE.Vector2(540,960),o.bloom??0.45,o.radius??0.5,o.th??0.95); c.addPass(bl);
  let bk=null; if(o.dof){ bk=new THREE.BokehPass(sc,cam,{focus:o.focus||6,aperture:o.aperture||0.0012,maxblur:o.maxblur||0.006}); c.addPass(bk); }
  return {c,bl,bk}; }
function mkRenderer2(id){ const r=new THREE.WebGLRenderer({canvas:document.getElementById(id),antialias:true,alpha:false,preserveDrawingBuffer:true});
  r.setPixelRatio(1); r.setSize(1080,1920,false); r.outputEncoding=THREE.sRGBEncoding; r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=0.62;
  r.setClearColor(0x07080a,1); return r; }
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

// ---------- S0 /route-map airport to the hotel: a soft 3D city like a nav app; a blue route draws itself through the streets from the
// airport apron to the hotel, the camera rides behind the moving puck, then pulls up to the whole route and a pin drops on the hotel
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); ren.toneMappingExposure=0.6;
  ren.shadowMap.enabled=true; ren.shadowMap.type=THREE.PCFSoftShadowMap;
  bgGrad(sc,'#dfe6ee','#9aa7b8'); sc.fog=new THREE.Fog(0xc3ccd7,120,420);
  const cam=new THREE.PerspectiveCamera(42,1080/1920,0.1,300);
  const P=mkComposer(ren,sc,cam,{bloom:0.25,radius:0.4,th:0.97});
  const sun=new THREE.DirectionalLight(0xffffff,1.7); sun.position.set(-18,34,14); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-44,right:44,top:44,bottom:-44,far:120}); sun.shadow.bias=-0.0006; sc.add(sun);
  sc.add(new THREE.HemisphereLight(0xf1f5fb,0x8d97a6,0.55));
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(260,260),new THREE.MeshStandardMaterial({color:0x98a2af,roughness:.95,envMapIntensity:.3}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; sc.add(ground);
  const walk=new THREE.MeshStandardMaterial({color:0xd9dee5,roughness:.9,envMapIntensity:.3});
  const bm=new THREE.MeshStandardMaterial({color:0xeef1f5,roughness:.75,envMapIntensity:.35});
  const park=new THREE.MeshStandardMaterial({color:0xa9d3a0,roughness:.95}); const leaf=new THREE.MeshStandardMaterial({color:0x6fbf73,roughness:.8});
  const R=rnd(11), BS=4;
  const hotelC=[14,18];
  for(let i=-12;i<=12;i++) for(let j=-14;j<=12;j++){ const cx=i*BS+2, cz=j*BS+2;
    if(cx<-14 && cz<-14) continue;            // airport apron
    const curb=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.08,3.2),walk); curb.position.set(cx,0.04,cz); curb.receiveShadow=true; sc.add(curb);
    if(cx===hotelC[0]&&cz===hotelC[1]) continue;
    const dist=Math.hypot(cx-2,cz-2);
    if(R()<0.09){ const p=new THREE.Mesh(new THREE.BoxGeometry(3,0.1,3),park); p.position.set(cx,0.1,cz); p.receiveShadow=true; sc.add(p);
      for(let t=0;t<4;t++){ const tr=new THREE.Mesh(new THREE.SphereGeometry(0.42+R()*0.2,14,10),leaf); tr.position.set(cx-0.9+R()*1.8,0.6,cz-0.9+R()*1.8); tr.castShadow=true; sc.add(tr); } continue; }
    const split=R()<0.55; const hmax=0.6+1.8*Math.exp(-dist*dist/700);
    const cells=split?[[-0.75,-0.75],[0.75,-0.75],[-0.75,0.75],[0.75,0.75]]:[[0,0]];
    cells.forEach(([dx,dz])=>{ const s=split?1.3:2.8, h=0.4+R()*hmax*(split?0.8:1.2); const b=new THREE.Mesh(new THREE.BoxGeometry(s,h,s),bm);
      b.position.set(cx+dx,0.08+h/2,cz+dz); b.castShadow=true; b.receiveShadow=true; sc.add(b); }); }
  // airport: runway + terminal
  const run=new THREE.Mesh(new THREE.BoxGeometry(34,0.06,4.2),new THREE.MeshStandardMaterial({color:0x6b7380,roughness:.9})); run.position.set(-36,0.04,-27); run.receiveShadow=true; sc.add(run);
  for(let k=0;k<12;k++){ const d=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.07,0.18),new THREE.MeshBasicMaterial({color:0xffffff})); d.position.set(-52+k*2.8,0.06,-27); sc.add(d); }
  const term=new THREE.Mesh(new THREE.BoxGeometry(12,1.6,3),new THREE.MeshStandardMaterial({color:0xe9eef4,roughness:.3,metalness:.2,envMapIntensity:1})); term.position.set(-26,0.8,-16.8); term.castShadow=true; sc.add(term);
  const glass=new THREE.Mesh(new THREE.BoxGeometry(12.05,0.6,3.05),new THREE.MeshStandardMaterial({color:0x7fa6d6,roughness:.15,metalness:.5})); glass.position.set(-26,1.0,-16.8); sc.add(glass);
  const tower=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.45,4.2,16),bm); tower.position.set(-19.2,2.1,-16.4); tower.castShadow=true; sc.add(tower);
  const cab=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.6,0.8,16),new THREE.MeshStandardMaterial({color:0x7fa6d6,roughness:.2,metalness:.4})); cab.position.set(-19.2,4.5,-16.4); sc.add(cab);
  // plane on the apron
  const pl=new THREE.Group(); const pm=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.35,envMapIntensity:.9});
  const fus=new THREE.Mesh(new THREE.CapsuleGeometry?new THREE.CapsuleGeometry(0.45,4.6,8,16):new THREE.CylinderGeometry(0.45,0.45,5.5,16),pm); fus.rotation.z=Math.PI/2; pl.add(fus);
  const wing=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.08,6.4),pm); wing.position.x=0.2; pl.add(wing);
  const tail=new THREE.Mesh(new THREE.BoxGeometry(0.8,1.2,0.08),pm); tail.position.set(-2.6,0.7,0); pl.add(tail);
  pl.children.forEach(m=>m.castShadow=true); pl.position.set(-28,0.6,-23.6); sc.add(pl);
  // hotel: taller tower with a blue glass band
  const H=new THREE.Group(); H.position.set(hotelC[0],0,hotelC[1]); sc.add(H);
  const hb=new THREE.Mesh(new THREE.BoxGeometry(2.6,4.2,2.6),bm); hb.position.y=2.18; hb.castShadow=true; H.add(hb);
  for(let k=0;k<6;k++){ const w=new THREE.Mesh(new THREE.BoxGeometry(2.64,0.16,2.64),new THREE.MeshStandardMaterial({color:0x9db8dc,roughness:.2,metalness:.4})); w.position.y=0.9+k*0.62; H.add(w); }
  const hring=new THREE.Mesh(new THREE.RingGeometry(1.9,2.2,48),new THREE.MeshBasicMaterial({color:0x2f6bff,transparent:true,opacity:0,toneMapped:false})); hring.rotation.x=-Math.PI/2; hring.position.y=0.12; H.add(hring);
  // the route
  const path=roundedPath([[-25,-20],[-16,-20],[-16,-8],[-4,-8],[-4,4],[8,4],[8,16],[14,16]],1.2,0.16);
  const TUB=600, RAD=10;
  const casing=ribbon(path,1.7,0.17,new THREE.MeshStandardMaterial({color:0xffffff,roughness:.5}),TUB); sc.add(casing);
  const line=ribbon(path,1.15,0.2,new THREE.MeshBasicMaterial({color:0x2f6bff,toneMapped:false}),TUB); sc.add(line);
  const ghost=ribbon(path,0.5,0.15,new THREE.MeshBasicMaterial({color:0x2f6bff,transparent:true,opacity:0.18}),200); sc.add(ghost);
  const puck=new THREE.Group(); sc.add(puck);
  const pw=new THREE.Mesh(new THREE.CylinderGeometry(0.75,0.75,0.2,40),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.3})); pw.castShadow=true; puck.add(pw);
  const pb=new THREE.Mesh(new THREE.CylinderGeometry(0.52,0.52,0.24,40),new THREE.MeshBasicMaterial({color:0x2f6bff,toneMapped:false})); puck.add(pb);
  const halo=new THREE.Mesh(new THREE.RingGeometry(0.8,1.0,48),new THREE.MeshBasicMaterial({color:0x2f6bff,transparent:true,opacity:.5,toneMapped:false,side:THREE.DoubleSide})); halo.rotation.x=-Math.PI/2; halo.position.y=0.05; puck.add(halo);
  const pin=pinMesh(0x2f6bff,null); pin.scale.setScalar(2.2); sc.add(pin);
  const aA=new THREE.Object3D(); aA.position.set(-24,1.2,-20); sc.add(aA);
  const aH=new THREE.Object3D(); aH.position.set(hotelC[0],9.5,hotelC[1]); sc.add(aH);
  const camP=new THREE.Vector3(), camL=new THREE.Vector3();
  SCN[0]=function(lt0){ const lt=lt0*1.35; const u=easeIO(cl((lt-0.05)/2.3)); line.geometry.setDrawRange(0,Math.floor(u*TUB)*6); casing.geometry.setDrawRange(0,Math.floor(u*TUB)*6);
    const h=path.getPointAt(Math.max(0.0001,u)), b=path.getPointAt(Math.max(0,u-0.07)), a=path.getPointAt(Math.min(1,u+0.05));
    puck.position.set(h.x,0.2,h.z); halo.scale.setScalar(1+0.35*((lt*1.6)%1)); halo.material.opacity=0.5*(1-((lt*1.6)%1));
    const dir=h.clone().sub(b); dir.y=0; if(dir.lengthSq()<1e-4) dir.set(1,0,0); dir.normalize();
    const follow=new THREE.Vector3(h.x-dir.x*9,27,h.z-dir.z*9+4), flook=new THREE.Vector3(h.x,0,h.z);
    const ov=easeIO(cl((lt-2.0)/1.0)); const over=new THREE.Vector3(6,78,40), olook=new THREE.Vector3(6,0,9);
    const tp=follow.lerp(over,ov), tl2=flook.lerp(olook,ov);
    camP.copy(tp); camL.copy(tl2);
    cam.position.copy(camP); cam.lookAt(camL);
    const pd=cl((lt-2.35)/0.45); pin.visible=lt>2.35; pin.position.set(hotelC[0],4.4+(1-easeOut2(pd))*9,hotelC[1]); pin.scale.setScalar(3.4*(0.6+0.4*backOut(pd)));
    hring.material.opacity=0.85*cl((lt-2.6)/0.3); hring.scale.setScalar(1+0.15*Math.sin(lt*6));
    P.c.render();
    lbl('l0_0',aA,cam,0,-30,cl((lt-0.15)/0.2)*(1-cl((lt-1.0)/0.2)));
    lbl('l0_1',aH,cam,0,-40,cl((lt-2.7)/0.25));
    caption(0,lt); };
})();

// ---------- S1 /holo-scan a hydro dam: a blue hologram on a projector base; a scan line rises and builds the valley, the dam wall, the
// penstocks and the powerhouse; water runs from the reservoir down the penstocks and spins the turbines (orange), generators light up
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); ren.localClippingEnabled=true; bgGrad(sc,'#0d2147','#02040b'); ren.toneMappingExposure=0.7;
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.05,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.7,radius:0.45,th:0.3});
  const clip=new THREE.Plane(new THREE.Vector3(0,-1,0),-1);
  const BL=0x4fb4ff, OR=0xff5a24;
  const lineM=(c,o)=>new THREE.LineBasicMaterial({color:c,transparent:true,opacity:o,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false,clippingPlanes:[clip]});
  const fillM=(c,o)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,clippingPlanes:[clip]});
  const G=new THREE.Group(); sc.add(G);
  function holo(geo,lo,fo,c,th){ const g=new THREE.Group(); if(fo) g.add(new THREE.Mesh(geo,fillM(c||BL,fo))); g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo,th||20),lineM(c||BL,lo))); return g; }
  // valley terrain (river runs along z)
  const tg=new THREE.PlaneGeometry(9,8,36,32); tg.rotateX(-Math.PI/2); const tp=tg.attributes.position;
  for(let i=0;i<tp.count;i++){ const x=tp.getX(i), z=tp.getZ(i); const v=Math.abs(x); let y=2.9*(1-Math.exp(-Math.pow(Math.max(0,v-0.9),2)/2.2)); y*=1-0.25*Math.exp(-z*z/30); tp.setY(i,y); }
  tg.computeVertexNormals();
  const terr=new THREE.LineSegments(new THREE.WireframeGeometry(tg),lineM(BL,0.13)); G.add(terr); G.add(new THREE.Mesh(tg,fillM(0x1b4fb8,0.02)));
  // dam wall: trapezoid profile extruded across the valley
  const sh=new THREE.Shape(); sh.moveTo(-0.55,0); sh.lineTo(0.55,0); sh.lineTo(0.16,2.6); sh.lineTo(-0.16,2.6); sh.closePath();
  const dg=new THREE.ExtrudeGeometry(sh,{depth:5.2,bevelEnabled:false}); dg.translate(0,0,-2.6); dg.rotateY(Math.PI/2);
  const dam=holo(dg,0.85,0.05); G.add(dam);
  for(let k=1;k<6;k++){ const y=k*0.43; const w=0.55-(0.39*y/2.6); const r=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5.2,0.001,w*2)),lineM(BL,0.35)); r.position.y=y; G.add(r); }
  // reservoir water behind the dam
  const wg=new THREE.PlaneGeometry(5.6,3.6,28,18); wg.rotateX(-Math.PI/2); const water=new THREE.Mesh(wg,fillM(0x3aa0ff,0.05)); water.position.set(0,2.3,-2.1); G.add(water);
  const wl=new THREE.LineSegments(new THREE.WireframeGeometry(wg),lineM(0x8fd3ff,0.12)); wl.position.copy(water.position); G.add(wl);
  // powerhouse at the foot of the dam
  const ph=holo(new THREE.BoxGeometry(3.0,0.8,0.9),0.8,0.04); ph.position.set(0,0.4,0.95); G.add(ph);
  // penstocks, turbines, generators
  const XS=[-0.9,0,0.9], pens=[], turb=[], gens=[];
  XS.forEach(x=>{ const c=new THREE.CatmullRomCurve3([new THREE.Vector3(x,2.05,-0.42),new THREE.Vector3(x,1.7,-0.15),new THREE.Vector3(x,0.7,0.35),new THREE.Vector3(x,0.32,0.85)]);
    pens.push(c); G.add(holo(new THREE.TubeGeometry(c,24,0.11,10,false),0.4,0.04,BL,30));
    const T=new THREE.Group(); T.position.set(x,0.32,0.95); G.add(T); const hub=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.14,16),fillM(OR,0.0)); hub.rotation.x=Math.PI/2; T.add(hub);
    const ring=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.3,0.3,0.12,24),30),lineM(OR,0)); ring.rotation.x=Math.PI/2; T.add(ring);
    const bl=[]; for(let k=0;k<7;k++){ const b=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.26,0.03),fillM(OR,0)); b.position.y=0.15; const p=new THREE.Group(); p.rotation.z=k/7*Math.PI*2; p.add(b); T.add(p); bl.push(b); }
    turb.push({T,hub,ring,bl});
    const g=holo(new THREE.CylinderGeometry(0.2,0.2,0.36,20),0.7,0.1,BL,30); g.position.set(x,0.62,1.1); G.add(g); gens.push(g); });
  // water particles: reservoir -> penstocks -> out into the river
  const NPp=14, drops=[]; pens.forEach((c,pi)=>{ for(let i=0;i<NPp;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),glowMat(0xbfeaff,0)); G.add(m); drops.push({m,c,o:i/NPp,pi}); } });
  const river=[]; for(let i=0;i<30;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),glowMat(0x8fd3ff,0)); G.add(m); river.push({m,o:i/30,x:(i%5-2)*0.28}); }
  // projector base
  const base=new THREE.Group(); sc.add(base); [3.4,4.2,5.0].forEach((r,i)=>{ const m=new THREE.Mesh(new THREE.RingGeometry(r,r+0.025,96),glowMat(BL,0.35-i*0.08)); m.rotation.x=-Math.PI/2; base.add(m); });
  const tick=new THREE.Group(); base.add(tick); for(let k=0;k<60;k++){ const m=new THREE.Mesh(new THREE.PlaneGeometry(0.03,0.22),glowMat(BL,0.4)); m.rotation.x=-Math.PI/2; m.position.set(Math.cos(k/60*6.283)*4.6,0,Math.sin(k/60*6.283)*4.6); m.rotation.z=-k/60*6.283; tick.add(m); }
  base.position.y=-0.02;
  // scan sheet
  const sheet=new THREE.Mesh(new THREE.PlaneGeometry(9.4,8.4),glowMat(0x6fc4ff,0)); sheet.rotation.x=-Math.PI/2; sc.add(sheet);
  const sheetE=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(9.4,8.4)),new THREE.LineBasicMaterial({color:0xbfe6ff,transparent:true,opacity:0,toneMapped:false,blending:THREE.AdditiveBlending})); sheetE.rotation.x=-Math.PI/2; sc.add(sheetE);
  const aRes=new THREE.Object3D(); aRes.position.set(-1.4,2.35,-2.4); G.add(aRes);
  const aPen=new THREE.Object3D(); aPen.position.set(0.9,1.3,0.12); G.add(aPen);
  const aTur=new THREE.Object3D(); aTur.position.set(0.9,0.32,1.25); G.add(aTur);
  const aGen=new THREE.Object3D(); aGen.position.set(-0.9,0.82,1.15); G.add(aGen);
  SCN[1]=function(lt0){ const lt=lt0*1.35; const s=-0.1+3.5*easeIO(cl((lt-0.05)/1.15)); clip.constant=s; const sv=cl(lt/0.1)*(1-cl((lt-1.15)/0.2));
    sheet.position.y=s; sheetE.position.y=s; sheet.material.opacity=0.02*sv; sheetE.material.opacity=0.9*sv;
    const fl=cl((lt-1.1)/0.4);
    drops.forEach(d=>{ const u=(d.o+lt*0.75)%1; d.m.position.copy(d.c.getPointAt(u)); d.m.material.opacity=fl*0.95*Math.sin(u*Math.PI); });
    river.forEach(d=>{ const u=(d.o+lt*0.5)%1; d.m.position.set(d.x,0.08,1.4+u*2.4); d.m.material.opacity=fl*0.8*(1-u); });
    turb.forEach((t,i)=>{ t.T.rotation.z=-lt*(0.6+9*fl); const on=fl; t.hub.material.opacity=0.8*on; t.ring.material.opacity=0.9*on; t.bl.forEach(b=>b.material.opacity=0.75*on); });
    gens.forEach((g,i)=>{ const v=cl((lt-1.6-i*0.12)/0.3); g.children[0].material.color.set(v>0?0xffb04a:BL); g.children[0].material.opacity=0.1+0.45*v*(0.7+0.3*Math.sin(lt*12+i)); g.children[1].material.color.set(v>0?0xffc070:BL); });
    water.position.y=2.3+0.02*Math.sin(lt*3); tick.rotation.y=lt*0.25; base.children.forEach((m,i)=>{ if(m.geometry&&m.geometry.type==='RingGeometry') m.rotation.z=lt*(0.2+i*0.1); });
    const ca=0.62-0.32*easeIO(cl(lt/3.4)), rad=20.5-2.5*ease(lt/3.2); cam.position.set(Math.sin(ca)*rad,9.5-1.5*ease(lt/3.2),Math.cos(ca)*rad); cam.lookAt(0,0.9,0.3);
    P.c.render();
    layoutLabels([['l1_0',aRes,cl((lt-0.95)/0.2)],['l1_1',aPen,cl((lt-1.25)/0.2)],['l1_2',aTur,cl((lt-1.5)/0.2)],['l1_3',aGen,cl((lt-1.8)/0.2)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,650,136);
    caption(1,lt); };
})();

// ---------- S2 /iso-flow from home to the shop: a light isometric diorama (slab, road, trees); the car drives from the house to the shop,
// the travelled road turns blue, numbered pins pop in: 1 Home, 2 Crossroads, 3 Shop
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); sc.environmentIntensity=0.5; ren.toneMappingExposure=0.58; bgGrad(sc,'#f7f8fa','#cfd6df');
  ren.shadowMap.enabled=true; ren.shadowMap.type=THREE.PCFSoftShadowMap;
  const VH=20, VW=VH*1080/1920; const cam=new THREE.OrthographicCamera(-VW/2,VW/2,VH/2,-VH/2,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.12,radius:0.3,th:0.99});
  const sun=new THREE.DirectionalLight(0xffffff,1.5); sun.position.set(-6,12,5); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,far:40}); sun.shadow.radius=6; sun.shadow.bias=-0.0008; sc.add(sun);
  sc.add(new THREE.HemisphereLight(0xffffff,0xb8c0cc,0.3));
  const D=new THREE.Group(); sc.add(D);
  const slab=new THREE.Mesh(rbox(9,9,0.5,0.35),new THREE.MeshStandardMaterial({color:0xd5dae1,roughness:.6,envMapIntensity:.6})); slab.rotation.x=-Math.PI/2; slab.position.y=-0.25; slab.receiveShadow=true; slab.castShadow=true; D.add(slab);
  const top=new THREE.Mesh(rbox(8.4,8.4,0.04,0.25),new THREE.MeshStandardMaterial({color:0xe9ecf0,roughness:.8,envMapIntensity:.5})); top.rotation.x=-Math.PI/2; top.position.y=0.02; top.receiveShadow=true; D.add(top);
  const roadM=new THREE.MeshStandardMaterial({color:0x5c6370,roughness:.8});
  const route=new THREE.CatmullRomCurve3([[-3.0,0,-1.0],[-2.2,0,0.6],[-0.9,0,1.0],[0.0,0,0.0],[0.9,0,-1.0],[2.2,0,-0.6],[3.0,0,1.0]].map(p=>new THREE.Vector3(...p)),false,'centripetal');
  D.add(ribbon(route,0.62,0.05,roadM));
  const cross=new THREE.LineCurve3(new THREE.Vector3(-0.0,0,-4.1),new THREE.Vector3(0.0,0,4.1)); D.add(ribbon(cross,0.62,0.045,roadM,10));
  const dashM=new THREE.MeshBasicMaterial({color:0xffffff}); for(let i=0;i<34;i++){ const u=(i+0.5)/34; const p=route.getPointAt(u), t=route.getTangentAt(u); const d=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.01,0.04),dashM); d.position.set(p.x,0.065,p.z); d.rotation.y=-Math.atan2(t.z,t.x); if(Math.abs(p.x)>0.45) D.add(d); }
  for(let i=0;i<14;i++){ const z=-3.9+i*0.6; if(Math.abs(z)<0.5) continue; const d=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.01,0.16),dashM); d.position.set(0,0.06,z); D.add(d); }
  const TRN=300; const trail=ribbon(route,0.4,0.075,new THREE.MeshBasicMaterial({color:0x2f5bff,toneMapped:false}),TRN); D.add(trail);
  // house
  const wallM=new THREE.MeshStandardMaterial({color:0xf3f4f6,roughness:.6}); const roofM=new THREE.MeshStandardMaterial({color:0xd8643a,roughness:.55});
  const house=new THREE.Group(); house.position.set(-3.1,0,-2.1); D.add(house);
  const hw=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.8,1.1),wallM); hw.position.y=0.42; house.add(hw);
  const rs=new THREE.Shape(); rs.moveTo(-0.78,0); rs.lineTo(0.78,0); rs.lineTo(0,0.62); rs.closePath(); const rg=new THREE.ExtrudeGeometry(rs,{depth:1.3,bevelEnabled:false}); rg.translate(0,0,-0.65);
  const roof=new THREE.Mesh(rg,roofM); roof.position.y=0.82; roof.rotation.y=Math.PI/2; house.add(roof);
  const door=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.42,0.02),new THREE.MeshStandardMaterial({color:0x8a5a3c})); door.position.set(0.2,0.25,0.56); house.add(door);
  const win=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.22,0.02),new THREE.MeshStandardMaterial({color:0x8fb2d9,roughness:.2,metalness:.3})); win.position.set(-0.3,0.48,0.56); house.add(win);
  // shop with striped awning and sign
  const shop=new THREE.Group(); shop.position.set(3.1,0,2.1); shop.rotation.y=0; D.add(shop);
  const sw=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.95,1.2),wallM); sw.position.y=0.5; shop.add(sw);
  const glassF=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.45,0.02),new THREE.MeshStandardMaterial({color:0x8fb2d9,roughness:.15,metalness:.4})); glassF.position.set(0,0.32,0.61); shop.add(glassF);
  const awT=canvasTex(256,64,(g,w,h)=>{ for(let i=0;i<8;i++){ g.fillStyle=i%2?'#ffffff':'#2f5bff'; g.fillRect(i*w/8,0,w/8,h); } });
  const aw=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.04,0.42),[0,0,new THREE.MeshStandardMaterial({map:awT}),0,0,0].map(m=>m||new THREE.MeshStandardMaterial({color:0x2f5bff}))); aw.position.set(0,0.66,0.78); aw.rotation.x=0.35; shop.add(aw);
  const signT=canvasTex(256,64,(g,w,h)=>{ g.fillStyle='#111'; g.fillRect(0,0,w,h); g.fillStyle='#fff'; g.font='bold 40px Inter, Arial'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('SHOP',w/2,h/2+2); });
  const sign=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.22,0.03),[0,0,0,0,new THREE.MeshBasicMaterial({map:signT}),0].map(m=>m||new THREE.MeshStandardMaterial({color:0x111111}))); sign.position.set(0,0.86,0.62); shop.add(sign);
  [house,shop].forEach(o=>o.traverse(m=>{ if(m.isMesh){ m.castShadow=true; m.receiveShadow=true; } }));
  // trees
  const tM=new THREE.MeshStandardMaterial({color:0x2f8f7f,roughness:.55}), stM=new THREE.MeshStandardMaterial({color:0x7a8a86});
  [[-1.4,-2.6],[-0.8,-3.4],[1.5,-2.9],[2.6,-2.4],[3.4,-3.4],[-3.5,1.3],[-2.6,2.8],[-1.3,3.2],[1.4,2.9],[-3.6,3.4],[1.2,1.4],[-1.4,-1.2]].forEach(([x,z],i)=>{
    const t=new THREE.Group(); t.position.set(x,0,z); const st=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,0.3,8),stM); st.position.y=0.15; t.add(st);
    const cr=new THREE.Mesh(new THREE.SphereGeometry(0.26,20,14),tM); cr.position.y=0.42; cr.scale.y=1.15; t.add(cr); t.traverse(m=>{ if(m.isMesh) m.castShadow=true; }); D.add(t); });
  // car
  const car=new THREE.Group(); D.add(car); const cbM=new THREE.MeshStandardMaterial({color:0xff4b1f,roughness:.35,envMapIntensity:.8});
  const cb=new THREE.Mesh(rbox(0.56,0.3,0.16,0.07),cbM); cb.rotation.x=-Math.PI/2; cb.position.y=0.16; car.add(cb);
  const cc=new THREE.Mesh(rbox(0.3,0.26,0.13,0.06),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.2})); cc.rotation.x=-Math.PI/2; cc.position.set(-0.04,0.29,0); car.add(cc);
  [[-0.17,0.15],[0.17,0.15],[-0.17,-0.15],[0.17,-0.15]].forEach(([x,z])=>{ const w=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.06,16),new THREE.MeshStandardMaterial({color:0x222})); w.rotation.x=Math.PI/2; w.position.set(x,0.08,z); car.add(w); });
  car.traverse(m=>{ if(m.isMesh) m.castShadow=true; }); car.scale.setScalar(1.7);
  const pins=[['1',route.getPointAt(0)],['2',new THREE.Vector3(0,0,0)],['3',route.getPointAt(1)]].map(([n,p])=>{ const g=pinMesh(0x2f5bff,n); g.position.set(p.x,0.05,p.z); g.scale.setScalar(0.0001); D.add(g); return g; });
  const ring2=new THREE.Mesh(new THREE.RingGeometry(0.5,0.62,40),new THREE.MeshBasicMaterial({color:0x2f5bff,transparent:true,opacity:0,side:THREE.DoubleSide})); ring2.rotation.x=-Math.PI/2; ring2.position.y=0.08; D.add(ring2);
  const anc=pins.map(p=>{ const o=new THREE.Object3D(); o.position.set(0,1.4,0); p.add(o); return o; });
  D.traverse(m=>{ if(m.isMesh){ (Array.isArray(m.material)?m.material:[m.material]).forEach(mt=>{ if(mt&&'envMapIntensity' in mt) mt.envMapIntensity=0.4; }); } });
  const PT=[0.25,1.45,2.6];
  SCN[2]=function(lt0){ const lt=lt0*1.35; const u=easeIO(cl((lt-0.45)/2.15)); const p=route.getPointAt(Math.max(0.0001,u)), t=route.getTangentAt(Math.min(0.9999,Math.max(0.0001,u)));
    car.position.set(p.x,0.05,p.z); car.rotation.y=-Math.atan2(t.z,t.x); trail.geometry.setDrawRange(0,Math.floor(u*TRN)*6);
    pins.forEach((g,i)=>{ const a=cl((lt-PT[i])/0.4); g.scale.setScalar(Math.max(0.0001,1.25*backOut(a))); g.position.y=0.05+0.15*Math.sin(cl(a)*Math.PI); });
    const rk=lt>PT[1]?cl((lt-PT[1])/0.6):0; ring2.material.opacity=0.6*(1-rk)*(lt>PT[1]?1:0); ring2.scale.setScalar(1+rk*1.6);
    const ang=Math.PI/4+0.22-0.3*easeIO(cl(lt/3.4)); const R=20; cam.position.set(Math.sin(ang)*R,15.5,Math.cos(ang)*R); cam.lookAt(0,0.2,0);
    const z=1.0+0.12*ease(lt/3); cam.zoom=z; cam.updateProjectionMatrix();
    P.c.render();
    ['l2_0','l2_1','l2_2'].forEach((id,i)=>lbl(id,anc[i],cam,[-120,150,120][i],[-10,30,-10][i],cl((lt-PT[i]-0.15)/0.25)));
    caption(2,lt); };
})();
