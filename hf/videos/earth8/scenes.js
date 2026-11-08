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


function earthTex(){ return canvasTex(1024,512,(c,w,h)=>{ c.fillStyle='#1d4fa8'; c.fillRect(0,0,w,h); const r=rnd(3);
    for(let i=0;i<22;i++){ c.fillStyle=i%3?'#3f8a4a':'#b59a62'; c.beginPath(); const x=r()*w,y=h*.2+r()*h*.6; for(let k=0;k<14;k++){ const a=k/14*Math.PI*2, rr=30+r()*70; c.lineTo(x+Math.cos(a)*rr*1.4,y+Math.sin(a)*rr*.8); } c.fill(); }
    for(let i=0;i<60;i++){ c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(r()*w,r()*h,40+r()*90,8+r()*14,r()*.5,0,Math.PI*2); c.fill(); } }); }
function starField(sc,n,seed,r){ const R=rnd(seed), sp=[]; for(let i=0;i<n;i++){ const v=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(r||300); sp.push(v.x,v.y,v.z); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sc.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.2,sizeAttenuation:false,toneMapped:false}))); }
// sprite with live text (re-drawn only when the text changes)
function liveTag(w,h,sx,style){ const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d'); const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,toneMapped:false})); s.scale.set(sx,sx*h/w,1); s.renderOrder=9; let last='';
  s.set=(txt,sub)=>{ const k=txt+'|'+(sub||''); if(k===last) return; last=k; g.clearRect(0,0,w,h); g.font=style.font; const tw=g.measureText(txt).width+60;
    g.fillStyle=style.bg; g.beginPath(); g.roundRect(w/2-tw/2,h/2-style.hh,tw,style.hh*2,style.hh); g.fill(); g.fillStyle=style.fg; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,w/2,h/2+4); t.needsUpdate=true; };
  return s; }

// ---------- S0 /zack-d-films what if Earth stopped spinning. Shot A: the globe spins, then slams to a stop (jolt + shockwave on
// the equator). Shot B: a small town on the ground. The ground stops, but everything on it keeps moving east (the equator spins at
// ~1,670 km/h): houses, trees, cars rip off and fly right, wind streaks, then the ocean arrives as a giant wall of water.
(function(){ const ren=mkRenderer2('cv0');
  // --- shot A
  const scA=new THREE.Scene(); scA.background=new THREE.Color(0x020308); starField(scA,1800,5);
  const camA=new THREE.PerspectiveCamera(34,1080/1920,0.1,800);
  const sunA=new THREE.DirectionalLight(0xffffff,2.2); sunA.position.set(8,4,10); scA.add(sunA); scA.add(new THREE.AmbientLight(0x30405a,0.35));
  const globe=new THREE.Mesh(new THREE.SphereGeometry(5,96,64),new THREE.MeshStandardMaterial({map:earthTex(),roughness:.7,emissive:0x0a1a3a,emissiveIntensity:.25})); scA.add(globe);
  const atmA=new THREE.Mesh(new THREE.SphereGeometry(5.35,64,40),glowMat(0x5aa0ff,.16)); scA.add(atmA);
  const eq=new THREE.Mesh(new THREE.TorusGeometry(5.05,0.035,8,200),glowMat(0xff6a3d,.95)); eq.rotation.x=Math.PI/2; globe.add(eq);
  const shock=new THREE.Mesh(new THREE.TorusGeometry(5.2,0.12,8,200),glowMat(0xffd2b0,1)); shock.rotation.x=Math.PI/2; scA.add(shock);
  const spd=liveTag(640,140,4.2,{font:'800 70px Inter, Arial',bg:'rgba(255,75,31,.95)',fg:'#fff',hh:52}); spd.position.set(0,-6.9,0); scA.add(spd);
  const TS=0.55; // stop moment
  // --- shot B
  const sc=new THREE.Scene(); bgGrad(sc,'#9cc7f0','#4e86c8');
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.1,900); const R=rnd(21);
  sc.environment=hdrEnv(ren);
  const sun=new THREE.DirectionalLight(0xfff3e0,1.6); sun.position.set(-10,16,12); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-20,far:80}); sun.shadow.bias=-0.0005; sc.add(sun); sc.add(new THREE.HemisphereLight(0xcfe3ff,0x4a5a3a,0.3));
  const gtex=canvasTex(512,512,(c,w,h)=>{ c.fillStyle='#4f8a34'; c.fillRect(0,0,w,h); for(let i=0;i<7000;i++){ const v=R(); c.fillStyle=`rgba(${70+v*60|0},${110+v*60|0},${50+v*30|0},.4)`; c.fillRect(R()*w,R()*h,2,2); } });
  gtex.wrapS=gtex.wrapT=THREE.RepeatWrapping; gtex.repeat.set(30,30);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(400,400),new THREE.MeshStandardMaterial({map:gtex,roughness:1})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; sc.add(ground);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(400,3.2),new THREE.MeshStandardMaterial({color:0x3a3d42,roughness:.9})); road.rotation.x=-Math.PI/2; road.position.set(0,0.01,3); road.receiveShadow=true; sc.add(road);
  for(let i=-40;i<40;i++){ const d=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.16),new THREE.MeshBasicMaterial({color:0xf2f2f2})); d.rotation.x=-Math.PI/2; d.position.set(i*3,0.02,3); sc.add(d); }
  // things that will fly: houses (body + roof separately), trees, cars, lamp posts
  const fly=[]; const add=(o,x,z,w)=>{ o.position.set(x,o.position.y,z); o.traverse(m=>{ if(m.isMesh){ m.castShadow=true; m.receiveShadow=true; } }); sc.add(o);
    fly.push({o,x0:x,y0:o.position.y,z0:z,d:R()*0.18+(x<-10?0.1:0),v:7+R()*6,lift:0.8+R()*2.2/w,spin:[(R()-.5)*6/w,(R()-.5)*4/w,-(1.5+R()*4)/w]}); };
  const wallC=[0xf3efe6,0xe8d9c4,0xd9e4ec,0xf1d8c8,0xe6e6e6], roofC=[0xb5482f,0x5b5f66,0x8a3b2a,0x3d4f63];
  for(let i=0;i<16;i++){ const x=-34+i*4.4+(R()-.5), z=-3-R()*6, w=2.2+R()*1.2, h=1.8+R()*1.2;
    const body=new THREE.Mesh(rbox(w,h,2.4,0.06),new THREE.MeshStandardMaterial({color:wallC[i%5],roughness:.8})); body.position.y=h/2;
    const g=new THREE.Group(); g.add(body);
    for(let k=0;k<2;k++){ const win=new THREE.Mesh(new THREE.PlaneGeometry(0.45,0.5),new THREE.MeshStandardMaterial({color:0x2b4a6b,roughness:.15,metalness:.3})); win.position.set(-w/4+k*w/2,h*0.6,1.21); g.add(win); }
    add(g,x,z,1.6);
    const roof=new THREE.Mesh(new THREE.ConeGeometry(w*0.78,1.2,4),new THREE.MeshStandardMaterial({color:roofC[i%4],roughness:.7})); roof.rotation.y=Math.PI/4; roof.scale.z=1.25; roof.position.y=h+0.6;
    const rg=new THREE.Group(); rg.add(roof); add(rg,x,z,0.9); fly[fly.length-1].d-=0.08; fly[fly.length-1].lift*=1.6; }
  for(let i=0;i<22;i++){ const t=new THREE.Group(); const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.16,1.2,10),new THREE.MeshStandardMaterial({color:0x6b4a2f,roughness:.9})); tr.position.y=0.6; t.add(tr);
    const cr=new THREE.Mesh(new THREE.IcosahedronGeometry(0.8+R()*0.4,1),new THREE.MeshStandardMaterial({color:0x3f7d36,roughness:.85,flatShading:true})); cr.position.y=1.7; t.add(cr);
    add(t,-36+i*3.4+R()*1.5,(R()>.5?-1.2:6.2)+(R()-.5)*1.5,0.7); }
  const carC=[0xff4b1f,0x2f6bff,0xf5d142,0xffffff];
  for(let i=0;i<6;i++){ const c=new THREE.Group(); const b=new THREE.Mesh(rbox(1.9,0.55,0.95,0.18),new THREE.MeshStandardMaterial({color:carC[i%4],roughness:.3,metalness:.4})); b.position.y=0.45; c.add(b);
    const top=new THREE.Mesh(rbox(1.0,0.45,0.85,0.16),new THREE.MeshStandardMaterial({color:0x22262c,roughness:.1,metalness:.6})); top.position.set(-0.1,0.9,0); c.add(top);
    for(const [wx,wz] of [[-.6,.48],[.6,.48],[-.6,-.48],[.6,-.48]]){ const wh=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.16,16),new THREE.MeshStandardMaterial({color:0x111111,roughness:.8})); wh.rotation.x=Math.PI/2; wh.position.set(wx,0.22,wz); c.add(wh); }
    c.rotation.y=0; add(c,-30+i*7.5,2.3+(i%2)*1.4,0.8); }
  // wind streaks
  const NW=260, wp=new Float32Array(NW*6), wv=[]; for(let i=0;i<NW;i++) wv.push([R()*120-80,0.3+R()*9,-14+R()*24,30+R()*40,R()]);
  const wg=new THREE.BufferGeometry(); wg.setAttribute('position',new THREE.BufferAttribute(wp,3));
  const wind=new THREE.LineSegments(wg,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0,toneMapped:false})); sc.add(wind);
  // the ocean: a curling wall of water that sweeps in from the left (west)
  const wave=new THREE.Group(); sc.add(wave);
  const wgeo=new THREE.PlaneGeometry(26,120,60,10); const wpos=wgeo.attributes.position;
  for(let i=0;i<wpos.count;i++){ const u=(wpos.getX(i)+13)/26; // 0 back .. 1 crest front
    const ang=u*Math.PI*0.95; const r=9; wpos.setX(i,-r+Math.sin(ang)*r*1.15+u*2); wpos.setZ(i,wpos.getY(i)); wpos.setY(i,(1-Math.cos(ang))*r*0.95); }
  wgeo.computeVertexNormals();
  const water=new THREE.Mesh(wgeo,new THREE.MeshStandardMaterial({color:0x0b58a0,roughness:.28,metalness:.05,envMapIntensity:.45,side:THREE.DoubleSide,emissive:0x05284a,emissiveIntensity:.5}));
  water.material.map=canvasTex(256,512,(c,w,h)=>{ c.fillStyle='#ffffff'; c.fillRect(0,0,w,h); const r=rnd(8); for(let i=0;i<90;i++){ c.fillStyle=`rgba(${150+r()*60|0},${190+r()*50|0},255,${.25+r()*.35})`; c.fillRect(0,r()*h,w,2+r()*8); }
    const g=c.createLinearGradient(w,0,0,0); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.12,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  water.material.needsUpdate=true;
  wave.add(water);
  const back=new THREE.Mesh(new THREE.BoxGeometry(60,17,120),new THREE.MeshStandardMaterial({color:0x165a94,roughness:.2,emissive:0x07304f,emissiveIntensity:.3})); back.position.set(-38,8.5,0); wave.add(back);
  const NF=900, fp=new Float32Array(NF*3), fv=[]; for(let i=0;i<NF;i++) fv.push([R(),R()*120-60,R()]);
  const fg=new THREE.BufferGeometry(); fg.setAttribute('position',new THREE.BufferAttribute(fp,3));
  const foam=new THREE.Points(fg,new THREE.PointsMaterial({color:0xffffff,size:0.35,transparent:true,opacity:.9})); wave.add(foam);
  const WAVE0=1.4, WAVE1=3.2;
  SCN[0]=function(lt0){ const lt=lt0*1.15;
    if(lt<1.0){ // shot A
      const w=lt<TS? 2.4*lt : 2.4*TS+0.05*Math.sin((lt-TS)*30)*Math.exp(-(lt-TS)*9);
      globe.rotation.y=w; const k=lt<TS?0:cl((lt-TS)/0.3); shock.scale.setScalar(1+k*0.6); shock.material.opacity=lt<TS?0:(1-k);
      spd.set(lt<TS?'1,670 km/h':(lt<TS+0.12?Math.round(1670*(1-(lt-TS)/0.12)).toLocaleString('en-US')+' km/h':'0 km/h'));
      spd.material.opacity=cl(lt/0.15);
      const sh=lt>TS?0.25*Math.exp(-(lt-TS)*7):0; camA.position.set(Math.sin(lt*90)*sh,1.0+Math.cos(lt*77)*sh,31-lt*2.0); camA.lookAt(0,-1.2,0);
      ren.render(scA,camA); caption(0,lt); return; }
    const t=lt-1.0;
    fly.forEach(f=>{ const dt=t-f.d; if(dt<=0){ f.o.position.set(f.x0,f.y0,f.z0); f.o.rotation.set(0,0,0); return; }
      const x=f.x0+f.v*dt+9*dt*dt, y=f.y0+f.lift*dt*(1+dt)+0.3*dt; f.o.position.set(x,y,f.z0+0.4*dt*(f.spin[0]));
      f.o.rotation.set(f.spin[0]*dt,f.spin[1]*dt,f.spin[2]*dt); });
    for(let i=0;i<NW;i++){ const v=wv[i]; const x=((v[0]+v[3]*t+200)%160)-80; const L=2+v[3]*0.06; wp[i*6]=x; wp[i*6+1]=v[1]; wp[i*6+2]=v[2]; wp[i*6+3]=x+L; wp[i*6+4]=v[1]; wp[i*6+5]=v[2]; }
    wg.attributes.position.needsUpdate=true; wind.material.opacity=0.55*cl(t/0.3);
    const wu=cl((lt-WAVE0)/(WAVE1-WAVE0)); wave.position.x=-30+wu*42; wave.visible=lt>WAVE0-0.2;
    for(let i=0;i<NF;i++){ const v=fv[i]; const ang=Math.PI*(0.8+0.25*v[0]); const r=9; fp[i*3]=-r+Math.sin(ang)*r*1.15+2+v[2]*1.5+Math.sin(lt*6+i)*0.3; fp[i*3+1]=(1-Math.cos(ang))*r*0.95+v[2]*1.2; fp[i*3+2]=v[1]; }
    fg.attributes.position.needsUpdate=true;
    const sh=0.22*Math.exp(-t*2.2)+0.06*cl((lt-WAVE0)/0.8);
    cam.position.set(2+Math.sin(lt*83)*sh, 3.2+Math.cos(lt*71)*sh, 24-1.5*t); cam.lookAt(-2,3.2+0.4*t,0);
    ren.render(sc,cam); caption(0,lt); };
})();

// ---------- S1 /deep-dive the deepest ocean trench: a cross-section slice of the ocean (1 unit = 1 km). The camera dives with a little
// sub light from the surface to the bottom of the Challenger Deep (~10,935 m) while a depth gauge counts; then Mount Everest (8,849 m) drops
// into the trench and the camera pulls back: its peak still sits ~2 km under the surface.
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020a14);
  const cam=new THREE.PerspectiveCamera(38,1080/1920,0.1,500); const R=rnd(13);
  sc.environment=hdrEnv(ren);
  const key=new THREE.DirectionalLight(0xdff0ff,1.6); key.position.set(6,14,12); sc.add(key); sc.add(new THREE.AmbientLight(0x6080a0,0.35));
  const D=10.935, ZW=6;
  // seafloor profile x -> y (km): shelf, slope, trench V, outer rise
  const prof=[[-30,-0.15],[-24,-0.2],[-19,-2.5],[-14,-5.5],[-9,-6.5],[-6,-8.8],[-3.7,-10.6],[-2.6,-D],[2.6,-D],[3.9,-10.4],[6.5,-7.4],[10,-5.8],[16,-5.5],[30,-5.4]];
  const sh=new THREE.Shape(); sh.moveTo(-30,-16); prof.forEach(([x,y])=>sh.lineTo(x,y)); sh.lineTo(30,-16); sh.lineTo(-30,-16);
  const rockTex=canvasTex(512,512,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#6b5a4a'); g.addColorStop(1,'#2c241e'); c.fillStyle=g; c.fillRect(0,0,w,h);
    for(let i=0;i<40;i++){ c.strokeStyle=`rgba(${40+R()*60|0},${30+R()*40|0},20,.35)`; c.lineWidth=2+R()*6; c.beginPath(); const y=R()*h; c.moveTo(0,y); for(let x=0;x<=w;x+=32) c.lineTo(x,y+Math.sin(x*0.02+i)*10); c.stroke(); } });
  rockTex.wrapS=rockTex.wrapT=THREE.RepeatWrapping; rockTex.repeat.set(0.05,0.08);
  const rock=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:ZW,bevelEnabled:false,curveSegments:4}),new THREE.MeshStandardMaterial({map:rockTex,roughness:.95,envMapIntensity:.4}));
  rock.position.z=-ZW/2; sc.add(rock);
  // water: gradient back wall + translucent front slice
  const wTex=canvasTex(64,512,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#3fb6e8'); g.addColorStop(.12,'#1676b8'); g.addColorStop(.45,'#0a3a6e'); g.addColorStop(1,'#020a18'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  const backW=new THREE.Mesh(new THREE.PlaneGeometry(60,12),new THREE.MeshBasicMaterial({map:wTex,toneMapped:false})); backW.position.set(0,-6,-ZW/2-0.01); sc.add(backW);
  const ws=new THREE.Shape(); ws.moveTo(-30,0); prof.slice().reverse().forEach(([x,y])=>ws.lineTo(x,y)); ws.lineTo(-30,0);
  // reverse order needs to go 30 -> -30 along the floor, starting from the top-right
  const ws2=new THREE.Shape(); ws2.moveTo(-30,0); ws2.lineTo(30,0); prof.slice().reverse().forEach(([x,y])=>ws2.lineTo(x,y)); ws2.lineTo(-30,0);
  const wg=new THREE.ShapeGeometry(ws2); const uv=wg.attributes.uv, wp=wg.attributes.position; for(let i=0;i<uv.count;i++) uv.setXY(i,0.5,1+wp.getY(i)/12);
  const front=new THREE.Mesh(wg,new THREE.MeshBasicMaterial({map:wTex,transparent:true,opacity:.42,depthWrite:false,toneMapped:false})); front.position.z=ZW/2+0.01; sc.add(front);
  const surf=new THREE.Mesh(new THREE.PlaneGeometry(60,ZW,120,12),new THREE.MeshStandardMaterial({color:0x5cc8f0,roughness:.1,metalness:.1,transparent:true,opacity:.85,envMapIntensity:1.4}));
  surf.rotation.x=-Math.PI/2; sc.add(surf); const sp=surf.geometry.attributes.position;
  // marine snow
  const NS=700, mp=new Float32Array(NS*3); for(let i=0;i<NS;i++){ mp[i*3]=R()*40-20; mp[i*3+1]=-R()*11; mp[i*3+2]=(R()-.5)*ZW; }
  const mg=new THREE.BufferGeometry(); mg.setAttribute('position',new THREE.BufferAttribute(mp,3)); sc.add(new THREE.Points(mg,new THREE.PointsMaterial({color:0xcfe8ff,size:0.04,transparent:true,opacity:.7})));
  // sub light
  const sub=new THREE.Group(); const sb=new THREE.Mesh(new THREE.CapsuleGeometry(0.09,0.22,8,16),new THREE.MeshStandardMaterial({color:0xffc23a,roughness:.3,emissive:0xff9a1a,emissiveIntensity:.6})); sb.rotation.z=Math.PI/2; sub.add(sb);
  const sgT=canvasTex(128,128,(c,w,h)=>{ const g=c.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(255,230,160,.95)'); g.addColorStop(1,'rgba(255,200,90,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  const sgl=new THREE.Sprite(new THREE.SpriteMaterial({map:sgT,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false})); sgl.scale.set(1.4,1.4,1); sub.add(sgl);
  const sl=new THREE.PointLight(0xffd9a0,2.5,5,2); sub.add(sl); sc.add(sub);
  const gauge=liveTag(700,150,1.5,{font:'800 72px JetBrains Mono, monospace',bg:'rgba(8,10,14,.9)',fg:'#ffffff',hh:56}); sc.add(gauge);
  // Everest: noisy cone, snow above ~70 % height (vertex colours), height 8.849
  const H=8.849, eg=new THREE.ConeGeometry(3.1,H,64,40,true); const ep=eg.attributes.position, col=[];
  for(let i=0;i<ep.count;i++){ const x=ep.getX(i), y=ep.getY(i), z=ep.getZ(i); const a=Math.atan2(z,x), u=(y+H/2)/H;
    const n=1+0.18*Math.sin(a*5+u*9)+0.1*Math.sin(a*13+u*21)+0.06*Math.sin(a*29); ep.setX(i,x*n); ep.setZ(i,z*n);
    const snow=u>0.62+0.06*Math.sin(a*7); const c=snow?[0.95,0.97,1]:[0.42-0.1*u,0.36-0.08*u,0.32]; col.push(...c); }
  eg.setAttribute('color',new THREE.Float32BufferAttribute(col,3)); eg.computeVertexNormals();
  const everest=new THREE.Mesh(eg,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,flatShading:true,envMapIntensity:.6})); everest.scale.z=0.85; sc.add(everest);
  // gap bracket between the peak and the surface
  const peakY=-D+H; const brk=new THREE.Group(); sc.add(brk);
  const bm=glowMat(0xff6a3d,1); brk.add(tubeBetween([2.9,peakY,ZW/2],[2.9,-0.05,ZW/2],0.05,bm)); brk.add(tubeBetween([2.5,peakY,ZW/2],[3.3,peakY,ZW/2],0.05,bm)); brk.add(tubeBetween([2.5,-0.05,ZW/2],[3.3,-0.05,ZW/2],0.05,bm));
  const gapT=liveTag(560,140,3.4,{font:'800 70px Inter, Arial',bg:'rgba(255,75,31,.95)',fg:'#fff',hh:52}); gapT.set('2 km to spare'); gapT.position.set(2.9,peakY/2,ZW/2+0.3); brk.add(gapT);
  const an=[new THREE.Object3D(),new THREE.Object3D()]; an[0].position.set(-0.8,peakY-1.2,ZW/2); an[1].position.set(-1.9,-D+1.7,ZW/2); an.forEach(a=>sc.add(a));
  const DIVE=1.0, DROP0=1.05, DROP1=1.5;
  SCN[1]=function(lt0){ const lt=lt0*1.15;
    for(let i=0;i<sp.count;i++){ const x=sp.getX(i), y=sp.getY(i); sp.setZ(i,0.06*Math.sin(x*1.3+lt*3)+0.04*Math.sin(y*2+lt*2.3)); } sp.needsUpdate=true; surf.geometry.computeVertexNormals();
    const du=easeIO(cl(lt/DIVE)); const subY=-0.3-(D-0.6)*du; const subX=-6+6*du+0.3*Math.sin(lt*2);
    sub.position.set(subX,subY,ZW/2+0.4); sub.visible=lt<DROP1+0.2;
    const depth=Math.round(cl(-subY/D)*D*1000/5)*5; gauge.set((lt>DIVE?10935:depth).toLocaleString('en-US')+' m');
    gauge.position.set(subX,subY+0.62,ZW/2+0.6); gauge.material.opacity=cl(lt/0.2)*(1-cl((lt-DROP0)/0.25));
    const eu=cl((lt-DROP0)/(DROP1-DROP0)); const ey=-D+H/2+ (1-easeOut2(eu))*22 + (eu>=1?0:0); everest.position.set(0,ey,0); everest.visible=lt>DROP0;
    const bounce=eu>=1?0.25*Math.exp(-(lt-DROP1)*8)*Math.sin((lt-DROP1)*30):0; everest.position.y+=bounce;
    const bu=cl((lt-DROP1-0.2)/0.3); brk.visible=bu>0; brk.scale.set(1,1,1); bm.opacity=bu; gapT.material.opacity=bu;
    // camera: follow the sub down, then pull back to the full slice
    const pu=easeIO(cl((lt-DIVE)/0.8));
    const fx=subX+0.5, fy=subY, fz=ZW/2+6.5;
    const wx=0.0, wy=-5.2, wz=ZW/2+30;
    cam.position.set(fx+(wx-fx)*pu, fy+0.6+(wy-fy-0.6)*pu, fz+(wz-fz)*pu); cam.lookAt(fx+(wx-fx)*pu, fy+(wy-fy)*pu, 0);
    const la=cl((lt-DROP1-0.35)/0.25);
    layoutLabels([['l1_0',an[0],la],['l1_1',an[1],cl((lt-DIVE-0.5)/0.25)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,90,150);
    ren.render(sc,cam); caption(1,lt); };
})();

// ---------- S2 /scale the Moon versus Earth, true to scale: the Moon is 3,474 km wide, Earth 12,742 km (~3.7x). Then Moons fly in and
// sink into Earth while a counter runs to 49 (by volume ~49 Moons fit). Then the camera pulls far back while the Moon slides out to its
// real average distance (~384,400 km = ~30 Earths): a long line between two small dots.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020308); starField(sc,2400,41,600);
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.1,3000); const R=rnd(55);
  const sun=new THREE.DirectionalLight(0xffffff,2.4); sun.position.set(10,3,8); sc.add(sun); sc.add(new THREE.AmbientLight(0x2a3550,0.35));
  const RE=2.6, RM=RE*1737.4/6371, DIST=RE*384400/6371;
  const earth=new THREE.Mesh(new THREE.SphereGeometry(RE,96,64),new THREE.MeshStandardMaterial({map:earthTex(),roughness:.7,emissive:0x0a1a3a,emissiveIntensity:.25})); sc.add(earth);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(RE*1.05,64,40),glowMat(0x5aa0ff,.16)); sc.add(atm);
  const mTex=canvasTex(512,256,(c,w,h)=>{ c.fillStyle='#9a9893'; c.fillRect(0,0,w,h); for(let i=0;i<160;i++){ const x=R()*w,y=R()*h,r=2+R()*R()*22; c.fillStyle=`rgba(${60+R()*40|0},${60+R()*40|0},${60+R()*40|0},.45)`; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); c.strokeStyle='rgba(220,220,215,.35)'; c.lineWidth=1.5; c.beginPath(); c.arc(x+1,y+1,r,0,7); c.stroke(); }
    for(let i=0;i<7;i++){ c.fillStyle='rgba(50,50,55,.35)'; c.beginPath(); c.ellipse(R()*w,h*.25+R()*h*.5,30+R()*60,18+R()*30,R(),0,7); c.fill(); } });
  const moonMat=new THREE.MeshStandardMaterial({map:mTex,roughness:.95});
  const moon=new THREE.Mesh(new THREE.SphereGeometry(RM,64,40),moonMat); sc.add(moon);
  const NM=48, mini=[]; const mg=new THREE.SphereGeometry(RM,32,20);
  for(let i=0;i<NM;i++){ const m=new THREE.Mesh(mg,moonMat); const a=R()*Math.PI*2, e=(R()-.5)*1.6; m.userData={from:new THREE.Vector3((i%2?1:-1)*(6+R()*2),-1+R()*3.5,2+R()*2), t0:0.45+i*0.02}; m.visible=false; sc.add(m); mini.push(m); }
  const cnt=liveTag(560,160,2.4,{font:'900 92px Inter, Arial',bg:'rgba(255,75,31,.95)',fg:'#fff',hh:62}); sc.add(cnt);
  const line=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,12),glowMat(0xff6a3d,.95)); sc.add(line);
  const dT=liveTag(800,150,1,{font:'800 74px Inter, Arial',bg:'rgba(8,9,12,.9)',fg:'#fff',hh:54}); dT.set('384,400 km apart'); sc.add(dT);
  const tE=liveTag(400,130,1,{font:'800 64px Inter, Arial',bg:'rgba(8,9,12,.9)',fg:'#fff',hh:46}); tE.set('Earth'); sc.add(tE);
  const tM=liveTag(400,130,1,{font:'800 64px Inter, Arial',bg:'rgba(8,9,12,.9)',fg:'#fff',hh:46}); tM.set('Moon'); sc.add(tM);
  const an=[new THREE.Object3D(),new THREE.Object3D()]; earth.add(an[0]); an[0].position.set(RE*0.7,RE*0.2,RE*0.6); moon.add(an[1]); an[1].position.set(RM*0.6,0,RM*0.7);
  const PULL=2.05;
  SCN[2]=function(lt0){ const lt=lt0*1.15; earth.rotation.y=0.6+lt*0.15; moon.rotation.y=lt*0.1;
    const pop=backOut(cl(lt/0.45)), popM=backOut(cl((lt-0.25)/0.45));
    earth.scale.setScalar(Math.max(0.001,pop)); atm.scale.setScalar(Math.max(0.001,pop));
    const pu=easeIO(cl((lt-PULL)/0.65)); const my=RE+RM+1.2+(DIST-(RE+RM+1.2))*pu;
    moon.position.set(0.9*(1-pu),my,0); moon.scale.setScalar(Math.max(0.001,popM));
    // moons diving into Earth + counter
    let n=0; mini.forEach((m,i)=>{ const u=cl((lt-m.userData.t0)/0.28); m.visible=u>0&&u<1&&lt<PULL; if(u>=1) n++;
      if(m.visible){ m.position.copy(m.userData.from).lerp(new THREE.Vector3(0,0,0),easeIO(u)); m.scale.setScalar(1-0.85*u*u); } });
    const cn=lt<0.45?0:Math.min(49,n+1); cnt.set('×'+cn); cnt.position.set(-1.25,RE+1.15,1.0); cnt.material.opacity=cl((lt-0.45)/0.15)*(1-cl((lt-PULL)/0.3));
    // distance line
    // camera: close two-shot -> very far, both in frame
    const d0=16.5, d1=DIST*2.9; const d=d0*Math.pow(d1/d0,pu); const ty=1.9*(1-pu)+(DIST*0.45)*pu;
    cam.position.set(1.0*(1-pu),ty,d); cam.lookAt(0,ty,0);
    line.visible=pu>0.02; line.position.set(0,(RE+my)/2,0); line.scale.set(0.0016*d,Math.max(0.01,my-RE-RM),0.0016*d);
    dT.position.set(0,DIST*0.5,0); dT.scale.set(d*0.3,d*0.3*150/800,1); dT.material.opacity=cl((lt-PULL-0.42)/0.15);
    const ft=cl((lt-PULL-0.45)/0.15); [tE,tM].forEach((t,i)=>{ t.material.opacity=ft; const k=d*0.11; t.scale.set(k,k*130/400,1); t.position.set(d*0.12,i?my:0,0); });
    const la=(1-cl((lt-PULL)/0.25));
    layoutLabels([['l2_0',an[0],cl((lt-0.3)/0.2)*la],['l2_1',an[1],cl((lt-0.45)/0.2)*la]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,640,150);
    ren.render(sc,cam); caption(2,lt); };
})();
