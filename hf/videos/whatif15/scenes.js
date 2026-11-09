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

function fixLab(id,x,y,a){ const el=document.getElementById(id); if(!el) return; el.style.left=x+'px'; el.style.top=y+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld) ld.style.width='0px'; }

// ---------- S0 /zack-d-films jumping into a hole through Earth: Earth cut in half (crust, mantle, outer core, inner core), a straight
// tunnel through the centre; a tiny astronaut drops in, speeds up to the centre, slows down and pops out on the other side
// (real-density estimate ~38 min, Klotz 2015; classic uniform-Earth answer ~42 min)
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020207); starField(sc,2400,7,400); ren.toneMappingExposure=0.95; ren.localClippingEnabled=true;
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.05,2000);
  const P=mkComposer(ren,sc,cam,{bloom:0.35,radius:0.5,th:0.9});
  const sun=new THREE.DirectionalLight(0xffffff,1.6); sun.position.set(-6,4,8); sc.add(sun); sc.add(new THREE.AmbientLight(0x404a66,0.5));
  const R=2.4, cut=new THREE.Plane(new THREE.Vector3(0,0,-1),0.0);
  const earth=new THREE.Mesh(new THREE.SphereGeometry(R,96,64),new THREE.MeshStandardMaterial({map:earthTex(),roughness:.75,clippingPlanes:[cut],side:THREE.DoubleSide})); sc.add(earth);
  const layers=[[R*0.985,0x4a2614],[R*0.9,0x9a2410],[R*0.55,0xe0560a],[R*0.2,0xffb81a]];
  layers.forEach(([r,c])=>{ const m=new THREE.Mesh(new THREE.CircleGeometry(r,96),new THREE.MeshBasicMaterial({color:c})); m.position.z=0.002+(R-r)*0.001; sc.add(m); });
  const glow=new THREE.Mesh(new THREE.CircleGeometry(R*0.55,64),glowMat(0xff8a30,0.12)); glow.position.z=0.01; sc.add(glow);
  const tunnel=new THREE.Mesh(new THREE.PlaneGeometry(0.16,2*R),new THREE.MeshBasicMaterial({color:0x0b0b10})); tunnel.position.z=0.02; sc.add(tunnel);
  const tunEdge=new THREE.Mesh(new THREE.PlaneGeometry(0.2,2*R),new THREE.MeshBasicMaterial({color:0x2a2a33})); tunEdge.position.z=0.015; sc.add(tunEdge);
  
  const A=astronaut(); A.scale.setScalar(0.45); A.position.z=0.06; sc.add(A);
  const trail=[]; for(let i=0;i<14;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(0.04,8,6),glowMat(0x9fd0ff,0)); s.position.z=0.05; sc.add(s); trail.push(s); }
  const aC=new THREE.Object3D(); aC.position.set(0.2,0,0.05); sc.add(aC); const aO=new THREE.Object3D(); aO.position.set(0.2,-R,0.05); sc.add(aO);
  SCN[0]=function(lt){ earth.rotation.y=0; 
    // fall: top (y=R) -> bottom (y=-R), simple harmonic motion, slowed for the shot
    const ph=cl((lt-0.25)/1.9); const y=R*Math.cos(Math.PI*ph)+ (ph<=0?0.5*(1-cl(lt/0.25)):0);
    A.position.y=lt<0.25?R+0.5*(1-lt/0.25):(ph>=1?-R-0.45*easeIO(cl((lt-2.15)/0.4)):y); A.rotation.z=lt*1.5;
    const v=Math.abs(Math.sin(Math.PI*ph)); trail.forEach((s,i)=>{ s.position.y=A.position.y+Math.sign(Math.sin(Math.PI*ph)||1)*i*0.09; s.material.opacity=0.6*v*(1-i/14)*(ph>0&&ph<1?1:0); });
    const z=easeIO(cl(lt/2.6)); cam.position.set(0.6-0.6*z,0.2,19.5-2.5*z); cam.lookAt(0,-0.1,0); P.c.render();
    layoutLabels(labs(0,[[0,aC,cl((lt-0.9)/0.2)*(1-cl((lt-1.6)/0.2))],[1,aO,cl((lt-2.0)/0.2)]]),cam,660,140);
    caption(0,lt); };
})();

// ---------- S1 /what-if the Sun disappeared: Earth on its orbit; the Sun vanishes, but its last light is still travelling (8 min 20 s);
// the light front reaches Earth, Earth goes dark and flies off in a straight line (gravity's change also travels at light speed)
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020207); starField(sc,2600,9,500); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.05,2000);
  const P=mkComposer(ren,sc,cam,{bloom:0.9,radius:0.7,th:0.6});
  const sunL=new THREE.PointLight(0xfff0d0,3,0,0); sc.add(sunL); sc.add(new THREE.AmbientLight(0x1a2030,0.25));
  const sunM=new THREE.MeshBasicMaterial({color:0xffd27a,toneMapped:false,transparent:true}); const sun=new THREE.Mesh(new THREE.SphereGeometry(0.9,48,32),sunM); sc.add(sun);
  const corona=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,20,128,128,128); g.addColorStop(0,'rgba(255,220,140,1)'); g.addColorStop(.35,'rgba(255,160,60,.5)'); g.addColorStop(1,'rgba(255,120,30,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending})); corona.scale.set(4.5,4.5,1); sc.add(corona);
  const OR=4.2; const orbit=new THREE.Mesh(new THREE.RingGeometry(OR-0.01,OR+0.01,200),new THREE.MeshBasicMaterial({color:0x5a6a8a,transparent:true,opacity:.6,side:THREE.DoubleSide})); orbit.rotation.x=-Math.PI/2; sc.add(orbit);
  const earthM=new THREE.MeshStandardMaterial({map:earthTex(),roughness:.7,emissive:0x0a1a3a,emissiveIntensity:.25}); const earth=new THREE.Mesh(new THREE.SphereGeometry(0.45,48,32),earthM); sc.add(earth);
  const front=new THREE.Mesh(new THREE.RingGeometry(1,1.03,160),glowMat(0xfff0c0,0)); front.rotation.x=-Math.PI/2; sc.add(front);
  const path=new THREE.Mesh(new THREE.PlaneGeometry(1,0.03),glowMat(0x9fd0ff,0)); path.rotation.x=-Math.PI/2; sc.add(path);
  const aS=new THREE.Object3D(); sc.add(aS); const aE=new THREE.Object3D(); sc.add(aE);
  SCN[1]=function(lt){ const ang=0.3+lt*0.35; const tGone=1.0, tHit=1.8; const gone=lt>tGone;
    sun.visible=!gone; corona.material.opacity=gone?0:1;  
    // light front from the Sun's last light: travels from r=0.9 to the orbit in 0.9 s of screen time
    const fr=cl((lt-tGone)/(tHit-tGone)); front.material.opacity=gone&&fr<1?0.8:0; const r=0.9+(OR-0.9)*fr; front.scale.setScalar(r);
    sunL.intensity=(lt<tHit?3:0.15); earthM.emissiveIntensity=lt<tHit?0.25:0.5;
    // Earth: on the orbit until the change arrives, then straight along the tangent
    const a0=0.3+tHit*0.35; let ex,ez; if(lt<tHit){ ex=OR*Math.cos(ang); ez=-OR*Math.sin(ang); } else { const d=(lt-tHit)*1.47; ex=OR*Math.cos(a0)+(-Math.sin(a0))*d*1; ez=-OR*Math.sin(a0)+(-Math.cos(a0))*d*1; }
    earth.position.set(ex,0,ez); earth.rotation.y=lt*1.5;
    const pl=cl((lt-tHit)/0.2); path.material.opacity=0.6*pl; const d2=Math.max(0.01,(lt-tHit)*1.47+0.8); path.scale.x=d2; path.position.set(OR*Math.cos(a0)+(-Math.sin(a0))*d2/2,0,-OR*Math.sin(a0)+(-Math.cos(a0))*d2/2); path.rotation.z=a0+Math.PI/2; path.rotation.set(-Math.PI/2,0,a0+Math.PI/2);
    aS.position.set(0.6,0.5,0); aE.position.copy(earth.position).add(new THREE.Vector3(0.2,0.3,0));
    const z=easeIO(cl(lt/2.6)); cam.position.set(1.0,9.5-1.5*z,8.5+1.5*z); cam.lookAt(0.6+0.8*z,0,-0.6-0.6*z); P.c.render();
    layoutLabels(labs(1,[[0,aS,cl((lt-1.1)/0.2)*(1-cl((lt-1.8)/0.15))],[1,aE,cl((lt-1.95)/0.2)]]),cam,640,140);
    caption(1,lt); };
})();

// ---------- S2 /zoom-out to the edge of the universe: one continuous pull-back on a log scale: a city block, Earth, the Solar
// System, the Milky Way (~100,000 light-years across), the cosmic web of galaxies (observable universe ~93 billion light-years)
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020207); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.01,100); cam.position.set(0,0,6); cam.lookAt(0,0,0);
  const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.6,th:0.85});
  sc.add(new THREE.AmbientLight(0xffffff,0.35)); const dl=new THREE.DirectionalLight(0xffffff,1.4); dl.position.set(-3,4,5); sc.add(dl);
  const R0=rnd(3);
  // stage 0: city block (seen from above, tilted)
  const S0=new THREE.Group(); sc.add(S0); for(let i=0;i<60;i++){ const h=0.05+R0()*0.35; const b=new THREE.Mesh(new THREE.BoxGeometry(0.16,h,0.16),new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(0.6,0.12,0.25+R0()*0.2),roughness:.8})); b.position.set((i%8-3.5)*0.24,h/2,(Math.floor(i/8)-3.5)*0.24); S0.add(b); }
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.2),new THREE.MeshStandardMaterial({color:0x1d2a1d})); ground.rotation.x=-Math.PI/2; S0.add(ground); S0.rotation.x=0.9;
  // stage 1: Earth
  const S1=new THREE.Group(); sc.add(S1); S1.add(new THREE.Mesh(new THREE.SphereGeometry(1,64,48),new THREE.MeshStandardMaterial({map:earthTex(),roughness:.7,emissive:0x0a1a3a,emissiveIntensity:.3}))); S1.add(new THREE.Mesh(new THREE.SphereGeometry(1.04,48,32),glowMat(0x5aa0ff,.15)));
  // stage 2: Solar System (Earth's orbit radius = 1 unit, Earth at the origin -> Sun offset)
  const S2=new THREE.Group(); sc.add(S2); const SS=new THREE.Group(); SS.position.set(-1,0,0); S2.add(SS); SS.rotation.x=1.1;
  SS.add(new THREE.Mesh(new THREE.SphereGeometry(0.07,24,16),new THREE.MeshBasicMaterial({color:0xffd27a,toneMapped:false})));
  [0.39,0.72,1,1.52,5.2,9.5].forEach((r,i)=>{ const o=new THREE.Mesh(new THREE.RingGeometry(r-0.004*r,r+0.004*r,200),new THREE.MeshBasicMaterial({color:i===2?0x6fb0ff:0x7a7f8a,transparent:true,opacity:.7,side:THREE.DoubleSide})); o.rotation.x=-Math.PI/2; SS.add(o);
    const p=new THREE.Mesh(new THREE.SphereGeometry(0.02+0.012*Math.min(i,4),12,10),new THREE.MeshBasicMaterial({color:[0xb0a090,0xe8c890,0x5aa0ff,0xd06040,0xe0b080,0xe8d0a0][i],toneMapped:false})); const a=i*1.3; p.position.set(r*Math.cos(a),0,r*Math.sin(a)); if(i===2) p.position.set(1,0,0); SS.add(p); });
  // stage 3: Milky Way (particles in spiral arms; the Sun ~ 0.5 radius from the centre)
  const S3=new THREE.Group(); sc.add(S3); const MW=new THREE.Group(); MW.position.set(-0.55,0,0); MW.rotation.x=1.0; S3.add(MW);
  { const N=9000, pos=new Float32Array(N*3), col=new Float32Array(N*3); const R=rnd(5);
    for(let i=0;i<N;i++){ const arm=i%4, t=R(), r=0.05+t*1.0, a=arm*Math.PI/2+r*5.0+(R()-.5)*0.6*(1-t*0.4); const y=(R()-.5)*0.04*(1-t);
      pos.set([r*Math.cos(a)+(R()-.5)*0.04,y,r*Math.sin(a)+(R()-.5)*0.04],i*3); const c=new THREE.Color().setHSL(0.6-0.5*(1-t),0.6,0.55+0.35*(1-t)); col.set([c.r,c.g,c.b],i*3); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setAttribute('color',new THREE.BufferAttribute(col,3));
    MW.add(new THREE.Points(g,new THREE.PointsMaterial({size:0.012,vertexColors:true,transparent:true,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false})));
    MW.add(new THREE.Mesh(new THREE.SphereGeometry(0.07,24,16),glowMat(0xffe0a0,.9))); }
  // stage 4: cosmic web (filaments of galaxies)
  const S4=new THREE.Group(); sc.add(S4);
  { const N=14000, pos=new Float32Array(N*3); const R=rnd(9); const nodes=[]; for(let i=0;i<40;i++) nodes.push(new THREE.Vector3((R()-.5)*2.4,(R()-.5)*3.6,(R()-.5)*1.2));
    for(let i=0;i<N;i++){ const a=nodes[Math.floor(R()*40)], b=nodes[Math.floor(R()*40)]; const t=R(); const p=a.clone().lerp(b,t); if(a.distanceTo(b)>1.4){ p.copy(a); } p.x+=(R()-.5)*0.06; p.y+=(R()-.5)*0.06; p.z+=(R()-.5)*0.06; pos.set([p.x,p.y,p.z],i*3); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    S4.add(new THREE.Points(g,new THREE.PointsMaterial({size:0.012,color:0xb79cff,transparent:true,opacity:.9,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false}))); }
  const ST=[S0,S1,S2,S3,S4];
  SCN[2]=function(lt){ const Z=4.4*easeIO(cl((lt-0.15)/2.35)); // stages are 1 log-unit apart on screen
    ST.forEach((g,k)=>{ const s=Math.pow(10,(k-Z)*1.15); g.scale.setScalar(s); const vis=cl((Math.log10(s)+1.7)/0.6)*cl((0.45-Math.log10(s))/0.35); g.visible=vis>0.01; g.traverse(o=>{ if(o.material){ o.material.transparent=true; if(o.material.userData.op===undefined) o.material.userData.op=o.material.opacity; o.material.opacity=o.material.userData.op*vis; } }); });
    S1.rotation.y=lt*0.3; S3.rotation.z=lt*0.05; S4.rotation.y=lt*0.1; P.c.render();
    const st=Math.min(4,Math.max(0,Math.round(Z))); for(let k=0;k<5;k++) fixLab('l2_'+k,90,1250,(k===st)?cl(1-Math.abs(Z-k)*2.2):0);
    caption(2,lt); };
})();
