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
// ---------- S0 /visualize how a computer works: data as light moving SSD -> RAM -> CPU -> GPU -> screen
function noiseTex(w,h,draw){ return canvasTex(w,h,draw); }
function starsBg(sc,n){ const t=canvasTex(1024,2048,(g,w,h)=>{ g.fillStyle='#020205'; g.fillRect(0,0,w,h); for(let i=0;i<n;i++){ const x=(i*733)%w, y=(i*1931)%h, r=((i*37)%10)/10*1.6+0.3; g.fillStyle='rgba(255,255,255,'+(0.25+((i*13)%10)/14)+')'; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); } }); sc.background=t; }
// ---------- S0 /scale the Sun vs Earth: start on Earth, pull back until the Sun fills the frame, 109 Earths line up across it
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); starsBg(sc,900);
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.01,400);
  const P=mkComposer(ren,sc,cam,{bloom:0.9,radius:0.7,th:0.6});
  const R=5.45;
  let _sd=7; const rnd=()=>{ _sd=(_sd*16807)%2147483647; return _sd/2147483647; };
  const sunT=canvasTex(1024,512,(g,w,h)=>{ g.fillStyle='#ff8226'; g.fillRect(0,0,w,h);
    for(let i=0;i<14000;i++){ const x=rnd()*w, y=rnd()*h, r=1.5+rnd()*5; g.fillStyle=rnd()>.5?'rgba(255,214,120,.28)':'rgba(170,50,5,.22)'; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); }
    g.fillStyle='rgba(80,15,0,.85)'; [[300,230,7],[312,236,4],[700,300,6]].forEach(([x,y,r])=>{ g.beginPath(); g.arc(x,y,r,0,7); g.fill(); }); });
  const sun=new THREE.Mesh(new THREE.SphereGeometry(R,128,64),new THREE.MeshBasicMaterial({map:sunT,toneMapped:false,color:0xffffff})); sc.add(sun);
  const halo=new THREE.Mesh(new THREE.PlaneGeometry(R*3.2,R*3.2),new THREE.MeshBasicMaterial({map:canvasTex(256,256,(g,w,h)=>{ const gr=g.createRadialGradient(128,128,128/1.6,128,128,128); gr.addColorStop(0,'rgba(255,140,40,.55)'); gr.addColorStop(1,'rgba(255,90,0,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending})); halo.position.z=-0.5; sc.add(halo);
  const earthT=canvasTex(1024,512,(g,w,h)=>{ g.fillStyle='#1d4f9c'; g.fillRect(0,0,w,h);
    for(let i=0;i<60;i++){ const x=(i*389)%w, y=110+(i*211)%290, r=18+(i*13)%60; g.fillStyle=i%3?'#3f7d3a':'#8a7a45'; g.beginPath(); g.ellipse(x,y,r*1.4,r,i,0,7); g.fill(); }
    let sd=3; const rr=()=>{ sd=(sd*16807)%2147483647; return sd/2147483647; }; g.fillStyle='rgba(255,255,255,.45)'; for(let i=0;i<260;i++){ g.beginPath(); g.ellipse(rr()*w,rr()*h,8+rr()*26,3+rr()*7,rr()*0.6-0.3,0,7); g.fill(); }
    g.fillStyle='#f4f7fb'; g.fillRect(0,0,w,28); g.fillRect(0,h-28,w,28); });
  const eR=0.05, ez=R+0.25;
  const earthMat=new THREE.MeshStandardMaterial({map:earthT,roughness:.7,metalness:0,emissive:0x10306a,emissiveIntensity:.35});
  const earth=new THREE.Mesh(new THREE.SphereGeometry(eR,64,32),earthMat); earth.position.set(-R+eR,0,ez); sc.add(earth);
  const kl=new THREE.DirectionalLight(0xfff0dd,1.1); kl.position.set(3,2,12); sc.add(kl); sc.add(new THREE.AmbientLight(0xffffff,0.15));
  const N=108, row=new THREE.InstancedMesh(new THREE.SphereGeometry(eR,24,12),earthMat,N); row.frustumCulled=false; sc.add(row); const M=new THREE.Matrix4();
  const sunA=new THREE.Object3D(); sunA.position.set(R*0.45,R*0.62,R*0.7); sc.add(sunA);
  SCN[0]=function(lt){ const e=easeIO(cl((lt-0.25)/1.7));
    const d=0.42*Math.exp(Math.log(110)*e);
    earth.rotation.y=lt*0.5;
    cam.position.set(earth.position.x*(1-e)+0.0*e, 0.02*(1-e)+0.3*e, ez+d); cam.lookAt(earth.position.x*(1-e), 0.0, ez-1);
    for(let i=0;i<N;i++){ const t=cl((lt-1.25-i*0.009)/0.2); const s=t<1?Math.max(0.0001,t*1.25-(t>0.8?(t-0.8)*1.25:0)):1;
      M.makeScale(s,s,s); M.setPosition(-R+eR+(i+1)*2*eR,0,ez); row.setMatrixAt(i,M); } row.instanceMatrix.needsUpdate=true;
    sun.rotation.y=lt*0.05; P.c.render();
    layoutLabels([['l0_0',sunA,cl((lt-1.7)/0.25),0,0],['l0_1',earth,cl((lt-0.15)/0.2),0,0]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,650,140);
    caption(0,lt); };
})();

// ---------- S1 /blueprint a jet engine: lines draw in on blueprint paper, then turn to metal; air flows through (blue -> orange after the burner)
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren);
  sc.background=canvasTex(540,960,(g,w,h)=>{ const gr=g.createRadialGradient(w/2,h*.45,20,w/2,h*.45,h*.7); gr.addColorStop(0,'#174a9e'); gr.addColorStop(1,'#071a40'); g.fillStyle=gr; g.fillRect(0,0,w,h);
    g.strokeStyle='rgba(160,200,255,.13)'; g.lineWidth=1; for(let x=0;x<w;x+=18){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,h); g.stroke(); } for(let y=0;y<h;y+=18){ g.beginPath(); g.moveTo(0,y); g.lineTo(w,y); g.stroke(); }
    g.strokeStyle='rgba(160,200,255,.25)'; for(let x=0;x<w;x+=90){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,h); g.stroke(); } for(let y=0;y<h;y+=90){ g.beginPath(); g.moveTo(0,y); g.lineTo(w,y); g.stroke(); } });
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.5,th:0.85});
  const key=new THREE.DirectionalLight(0xffffff,1.2); key.position.set(3,4,5); sc.add(key);
  const J=new THREE.Group(); sc.add(J); // engine axis = local Y (fan on top)
  const metal=(c,r)=>new THREE.MeshPhysicalMaterial({color:c,metalness:1,roughness:r,transparent:true,opacity:0,envMapIntensity:1});
  const parts=[]; // {grp, mats, lines, t}
  function part(objs,t){ const g=new THREE.Group(); J.add(g); const mats=[], lines=[];
    objs.forEach(o=>{ g.add(o); mats.push(o.material); const eg=new THREE.EdgesGeometry(o.geometry,25); const l=new THREE.LineSegments(eg,new THREE.LineBasicMaterial({color:0xdbe9ff,transparent:true,opacity:0,toneMapped:false}));
      l.position.copy(o.position); l.rotation.copy(o.rotation); l.scale.copy(o.scale); g.add(l); lines.push(l); });
    const p={g,mats,lines,t}; parts.push(p); return p; }
  function bladeDisk(r,n,y,c,tw){ const objs=[]; const hub=new THREE.Mesh(new THREE.CylinderGeometry(r*0.3,r*0.3,0.12,32),metal(c,.3)); hub.position.y=y; objs.push(hub);
    const rot=new THREE.Group(); rot.position.y=y;
    for(let i=0;i<n;i++){ const b=new THREE.Mesh(new THREE.BoxGeometry(r*0.7,0.02,0.11),metal(c,.25)); const a=i/n*Math.PI*2; b.position.set(Math.cos(a)*r*0.62,0,Math.sin(a)*r*0.62); b.rotation.set(0,-a,tw); rot.add(b); }
    return {objs,rot}; }
  const nac=new THREE.Mesh(new THREE.CylinderGeometry(0.98,0.85,3.2,64,1,true),new THREE.MeshPhysicalMaterial({color:0xcfd5dc,metalness:.9,roughness:.25,transparent:true,opacity:0,side:THREE.DoubleSide})); nac.position.y=0.1;
  const fan=bladeDisk(0.92,18,1.5,0xd8dde3,0.5);
  const comp=[1.0,0.75,0.5].map((y,i)=>bladeDisk(0.62-i*0.04,22,y,0xb8c0c9,0.35));
  const burn=new THREE.Mesh(new THREE.TorusGeometry(0.42,0.13,24,64),new THREE.MeshStandardMaterial({color:0x555,metalness:.6,roughness:.4,emissive:0xff5a1f,emissiveIntensity:0,transparent:true,opacity:0})); burn.rotation.x=Math.PI/2; burn.position.y=0.05;
  const turb=[-0.4,-0.65].map((y,i)=>bladeDisk(0.55+i*0.04,26,y,0x9a7d5a,-0.4));
  const cone=new THREE.Mesh(new THREE.ConeGeometry(0.28,0.8,48),metal(0x8f949b,.35)); cone.position.y=-1.15; cone.rotation.x=Math.PI;
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,3,16),metal(0x999,.3));
  const pFan=part(fan.objs,0.1); pFan.g.add(fan.rot);
  // move blade meshes back under rotating group (edges were added to part group; keep simple: rotate edges with part group instead)
  const pComp=part([].concat(...comp.map(c=>c.objs)),0.35); comp.forEach(c=>pComp.g.add(c.rot));
  const pBurn=part([burn],0.6);
  const pTurb=part([].concat(...turb.map(c=>c.objs)),0.8); turb.forEach(c=>pTurb.g.add(c.rot));
  const pNac=part([nac,cone,shaft],0.0);
  const rots=[fan.rot,...comp.map(c=>c.rot),...turb.map(c=>c.rot)];
  rots.forEach(r=>r.children.forEach(b=>{ const eg=new THREE.EdgesGeometry(b.geometry); const l=new THREE.LineSegments(eg,new THREE.LineBasicMaterial({color:0xdbe9ff,transparent:true,opacity:0,toneMapped:false})); l.position.copy(b.position); l.rotation.copy(b.rotation); r.add(l); }));
  // airflow particles along the axis
  const NP=260, pp=new Float32Array(NP*3), pc=new Float32Array(NP*3); const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pp,3)); pg.setAttribute('color',new THREE.BufferAttribute(pc,3));
  const pm=new THREE.PointsMaterial({size:0.05,vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}); J.add(new THREE.Points(pg,pm));
  const aF=new THREE.Object3D(); aF.position.set(0.75,1.5,0); J.add(aF); const aC=new THREE.Object3D(); aC.position.set(0.5,0.75,0); J.add(aC);
  const aB=new THREE.Object3D(); aB.position.set(0.5,0.05,0); J.add(aB); const aT=new THREE.Object3D(); aT.position.set(0.55,-0.55,0); J.add(aT);
  SCN[1]=function(lt){
    parts.forEach(p=>{ const ln=cl((lt-p.t*0.8)/0.35), so=cl((lt-1.15-p.t*0.5)/0.4); p.lines.forEach(l=>l.material.opacity=ln*(1-0.75*so)); p.mats.forEach(m=>m.opacity=so*(m===nac.material?0.28:1)); });
    rots.forEach((r,i)=>{ const so=cl((lt-1.15)/0.4); r.children.forEach(c=>{ if(c.isLineSegments) c.material.opacity=cl((lt-0.1)/0.4)*(1-0.75*so); else c.material.opacity=so; }); r.rotation.y=(i<4?1:-1)*lt*lt*1.6; });
    burn.material.emissiveIntensity=3*cl((lt-1.7)/0.3)*(0.85+0.15*Math.sin(lt*30));
    const fl=cl((lt-1.5)/0.3); pm.opacity=fl;
    for(let i=0;i<NP;i++){ const u=((lt*0.9+i*0.618)%1); const y=1.9-u*3.5; const rr=(y>0.6?0.8-((1.9-y)/1.3)*0.38:0.42)*Math.sqrt((i*0.381)%1); const a=i*2.39+lt*(y>0.6?1:3);
      pp.set([Math.cos(a)*rr,y,Math.sin(a)*rr],i*3); const hot=y<0.05; pc.set(hot?[1,0.45,0.12]:[0.45,0.75,1],i*3); }
    pg.attributes.position.needsUpdate=true; pg.attributes.color.needsUpdate=true;
    J.rotation.set(0.35,0.5+lt*0.22,-0.18); J.scale.setScalar(0.6); J.position.set(-0.15,-0.08,0);
    cam.position.set(0,0.6,7.2-0.7*ease(lt/3)); cam.lookAt(0,0.1,0); P.c.render();
    layoutLabels([['l1_0',aF],['l1_1',aC],['l1_2',aB],['l1_3',aT]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-0.5-i*0.3)/0.2)]),cam,690,120);
    caption(1,lt); };
})();

// ---------- S2 /explode my sneaker: assembled shoe spins, then every layer separates upward with labels
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#2a2622','#060505');
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.35,radius:0.5,th:0.95});
  const key=new THREE.DirectionalLight(0xffffff,1.4); key.position.set(3,6,4); sc.add(key);
  function outline(sx,sz){ const sh=new THREE.Shape(); const n=80; for(let i=0;i<=n;i++){ const t=i/n*Math.PI*2; const x=Math.cos(t)*1.5*sx, w=(0.5+0.12*Math.cos(t))*sz; const z=Math.sin(t)*w*(1-0.18*Math.cos(t*2)*0.5);
      if(i===0) sh.moveTo(x,z); else sh.lineTo(x,z); } return sh; }
  function slab(sx,sz,d,mat,bv){ const g=new THREE.ExtrudeGeometry(outline(sx,sz),{depth:d,bevelEnabled:true,bevelThickness:bv||0.03,bevelSize:bv||0.03,bevelSegments:4,curveSegments:24}); g.rotateX(Math.PI/2); g.translate(0,d/2,0); g.computeVertexNormals(); return new THREE.Mesh(g,mat); }
  const S=new THREE.Group(); sc.add(S);
  const tread=canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#7a7068'; g.fillRect(0,0,w,h); g.strokeStyle='#4a433d'; g.lineWidth=10; for(let i=-20;i<40;i++){ g.beginPath(); g.moveTo(i*28,0); g.lineTo(i*28+120,h); g.stroke(); } });
  const outsole=slab(0.93,0.89,0.09,new THREE.MeshStandardMaterial({color:0x8a7f74,roughness:.85,map:tread}));
  const midsole=slab(0.92,0.88,0.22,new THREE.MeshPhysicalMaterial({color:0xf3f1ec,roughness:.55,clearcoat:.2}),0.06);
  const insole=slab(0.9,0.86,0.04,new THREE.MeshStandardMaterial({color:0xff4b1f,roughness:.9}),0.015);
  const upperG=new THREE.Group();
  const knit=canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#1d1f24'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(255,255,255,.08)'; g.lineWidth=3; for(let y=0;y<h;y+=10){ g.beginPath(); for(let x=0;x<=w;x+=16){ g.lineTo(x,y+((x/16)%2?4:0)); } g.stroke(); } }); knit.wrapS=knit.wrapT=THREE.RepeatWrapping; knit.repeat.set(4,4);
  const upMat=new THREE.MeshPhysicalMaterial({color:0xffffff,map:knit,roughness:.8,sheen:1,sheenColor:new THREE.Color(0x555a66),side:THREE.DoubleSide});
  const up=new THREE.Mesh(new THREE.SphereGeometry(1,64,32,0,Math.PI*2,0,Math.PI/2),upMat); { const pa=up.geometry.attributes.position; for(let i=0;i<pa.count;i++){ const x=pa.getX(i), y=pa.getY(i); const k=0.35+0.75*Math.min(1,Math.max(0,(0.55-x)/1.1)); pa.setY(i,y*k); } up.geometry.computeVertexNormals(); }
  up.scale.set(1.45,0.75,0.5); up.position.x=-0.05; upperG.add(up);
  const collar=new THREE.Mesh(new THREE.TorusGeometry(0.26,0.06,16,48),new THREE.MeshStandardMaterial({color:0x111215,roughness:.7})); collar.rotation.x=Math.PI/2; collar.scale.set(1.4,1,1); collar.position.set(-0.62,0.6,0); upperG.add(collar);
  const swoosh=new THREE.Mesh(new THREE.TorusGeometry(0.9,0.035,8,64,1.4),new THREE.MeshStandardMaterial({color:0xff4b1f,roughness:.5})); swoosh.position.set(-0.2,-0.3,0.42); swoosh.rotation.z=0.6; upperG.add(swoosh);
  const toe=new THREE.Mesh(new THREE.SphereGeometry(0.42,48,24,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xf3f1ec,roughness:.6})); toe.scale.set(1.15,0.55,1.05); toe.position.set(0.95,-0.01,0); upperG.add(toe);
  const heel=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.52,0.42,48,1,true,Math.PI*0.5,Math.PI),new THREE.MeshStandardMaterial({color:0xff4b1f,roughness:.6,side:THREE.DoubleSide})); heel.scale.set(1,1,0.98); heel.position.set(-0.92,0.2,0); upperG.add(heel);
  const tongue=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.05,0.34),new THREE.MeshStandardMaterial({color:0x2a2d33,roughness:.8})); tongue.position.set(-0.05,0.62,0); tongue.rotation.z=-0.42; upperG.add(tongue);
  const laces=new THREE.Group(); for(let i=0;i<5;i++){ const l=new THREE.Mesh(new THREE.CylinderGeometry(0.028,0.028,0.62,8),new THREE.MeshStandardMaterial({color:0xf5f5f5,roughness:.6})); l.rotation.x=Math.PI/2; l.position.set(-0.35+i*0.16,0.62-i*0.085,0); laces.add(l); } upperG.add(laces);
  const layers=[upperG,insole,midsole,outsole]; [upperG,insole,midsole,outsole].forEach(o=>S.add(o));
  const home=[0.36,0.37,0.1,0.0], out=[2.1,1.38,0.7,-0.3];
  const sh=shadowPlane(4.5,2.6,.6); sh.position.y=-1.1; sc.add(sh);
  SCN[2]=function(lt){ const ex=layers.map((o,i)=>easeIO(cl((lt-0.45-(3-i)*0.12)/0.75)));
    layers.forEach((o,i)=>{ o.position.y=home[i]+(out[i]-home[i])*ex[i]; o.rotation.z=0.06*Math.sin(lt*1.5+i)*ex[i]; });
    S.rotation.set(0.25,-0.9+lt*0.35,0.0); S.position.set(0,-0.62+0.08*Math.sin(lt*1.6),0); S.scale.setScalar(0.54);
    cam.position.set(0,1.0,7.0-0.6*ease(lt/3)); cam.lookAt(0,0.15,0); P.c.render();
    layoutLabels([['l2_0',up],['l2_1',insole],['l2_2',midsole],['l2_3',outsole]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-0.9-i*0.18)/0.2)]),cam,720,110);
    caption(2,lt); };
})();
