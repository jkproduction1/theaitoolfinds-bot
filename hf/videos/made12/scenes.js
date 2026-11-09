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

// ---------- S0 /how-its-made a pencil: graphite + clay are pressed into thin rods and baked; a wood slat gets grooves, the leads drop in,
// a second slat is glued on top (a "sandwich"), it is cut into pencils, and they are painted
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#2a2420','#07080a'); ren.toneMappingExposure=0.5;
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.5,radius:0.5,th:0.9});
  const key=new THREE.DirectionalLight(0xffffff,0.8); key.position.set(-3,7,5); sc.add(key); sc.add(new THREE.HemisphereLight(0xcfd8ff,0x201812,0.25));
  const N=6, PIT=0.24, LEN=2.2;
  const table=new THREE.Mesh(rbox(3.4,2.4,0.1,0.08),new THREE.MeshPhysicalMaterial({color:0x1b1e22,metalness:.6,roughness:.5,envMapIntensity:.4})); table.rotation.x=Math.PI/2; table.position.y=-0.06; sc.add(table);
  const shd=shadowPlane(4,3,.6); shd.position.y=0.0; sc.add(shd);
  // powders: graphite (dark) + clay (tan) piles that shrink as they are pressed
  const gp=new THREE.Mesh(new THREE.SphereGeometry(0.32,24,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x2b2d30,roughness:.6,metalness:.4})); gp.position.set(-0.55,0,-0.85); sc.add(gp);
  const cp=new THREE.Mesh(new THREE.SphereGeometry(0.28,24,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xc9a27a,roughness:.95})); cp.position.set(0.15,0,-0.85); sc.add(cp);
  const wood=new THREE.MeshStandardMaterial({color:0xc88f5c,roughness:.75}), wood2=new THREE.MeshStandardMaterial({color:0xb67b49,roughness:.75});
  const leadM=new THREE.MeshPhysicalMaterial({color:0x2a2c2f,metalness:.6,roughness:.35,emissive:0xff5a10,emissiveIntensity:0});
  // bottom slat with grooves (drawn as dark lines), top slat
  const grooveT=canvasTex(512,256,(g,w,h)=>{ g.fillStyle='#c88f5c'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(120,70,30,.35)'; for(let i=0;i<40;i++){ g.beginPath(); g.moveTo(0,i*7); g.bezierCurveTo(w*.3,i*7+4,w*.6,i*7-4,w,i*7); g.stroke(); }
    g.fillStyle='#5a3417'; for(let i=0;i<N;i++){ const y=h/2+(i-(N-1)/2)*(h/(N+0.4)); g.fillRect(0,y-5,w,10); } });
  const slatB=new THREE.Mesh(new THREE.BoxGeometry(LEN,0.09,N*PIT+0.06),[wood2,wood2,new THREE.MeshStandardMaterial({map:grooveT,roughness:.75}),wood2,wood2,wood2]); slatB.position.y=0.045; sc.add(slatB);
  const slatT=new THREE.Mesh(new THREE.BoxGeometry(LEN,0.09,N*PIT+0.06),wood); sc.add(slatT);
  const leads=[]; for(let i=0;i<N;i++){ const m=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,LEN,16),leadM); m.rotation.z=Math.PI/2; m.userData.z=(i-(N-1)/2)*PIT; sc.add(m); leads.push(m); }
  // finished pencils (hexagonal), painted
  const paintM=new THREE.MeshPhysicalMaterial({color:0xc88f5c,roughness:.35,clearcoat:.6});
  const pens=[]; for(let i=0;i<N;i++){ const g=new THREE.Group(); const b=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,LEN-0.3,6),paintM); b.rotation.z=Math.PI/2; g.add(b);
    const tip=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.24,6),wood); tip.rotation.z=-Math.PI/2; tip.position.x=(LEN-0.3)/2+0.12; g.add(tip);
    const pt=new THREE.Mesh(new THREE.ConeGeometry(0.035,0.08,12),leadM); pt.rotation.z=-Math.PI/2; pt.position.x=(LEN-0.3)/2+0.2; g.add(pt);
    const fer=new THREE.Mesh(new THREE.CylinderGeometry(0.102,0.102,0.12,24),new THREE.MeshPhysicalMaterial({color:0xc9ced6,metalness:1,roughness:.25})); fer.rotation.z=Math.PI/2; fer.position.x=-(LEN-0.3)/2-0.06; g.add(fer);
    const er=new THREE.Mesh(new THREE.CylinderGeometry(0.098,0.098,0.14,24),new THREE.MeshStandardMaterial({color:0xe88a8a,roughness:.8})); er.rotation.z=Math.PI/2; er.position.x=-(LEN-0.3)/2-0.18; g.add(er);
    g.userData.z=(i-(N-1)/2)*PIT; sc.add(g); pens.push(g); }
  const glow=new THREE.PointLight(0xff7a2a,0,4,2); glow.position.set(0,0.8,-0.2); sc.add(glow);
  const aL=new THREE.Object3D(); aL.position.set(0.9,0.6,-0.6); sc.add(aL);
  const aS=new THREE.Object3D(); aS.position.set(1.0,0.09,0.75); sc.add(aS);
  const aW=new THREE.Object3D(); aW.position.set(1.0,0.3,0.6); sc.add(aW);
  const aP=new THREE.Object3D(); aP.position.set(1.1,0.1,0.6); sc.add(aP);
  SCN[0]=function(lt0){ const lt=lt0*1.35;
    // 0.0-0.6 powders press into rods that slide out; 0.45-0.8 baked (glow)
    const pr=easeIO(cl((lt-0.0)/0.5)); gp.scale.setScalar(Math.max(0.01,1-pr)); cp.scale.setScalar(Math.max(0.01,1-pr));
    const ext=easeIO(cl((lt-0.15)/0.45)); const bake=cl((lt-0.4)/0.15)*(1-cl((lt-0.8)/0.25)); leadM.emissiveIntensity=1.6*bake; glow.intensity=5*bake;
    // 0.8-1.2 leads drop into the grooves; 1.2-1.55 top slat comes down; 1.75 cut apart; 1.9-2.6 paint
    const drop=easeIO(cl((lt-0.8)/0.4));
    leads.forEach((m,i)=>{ const z0=-0.85, y0=0.7; m.position.set(-LEN*(1-ext),y0+(0.09-y0)*drop,z0+(m.userData.z-z0)*drop); m.visible=lt<1.75; m.scale.y=Math.max(0.01,ext); });
    slatB.visible=lt<1.75; slatB.position.x=2.4*(1-easeIO(cl((lt-0.55)/0.4)));
    const top=easeIO(cl((lt-1.2)/0.35)); slatT.visible=lt>1.15&&lt<1.75; slatT.position.set(0,0.135+1.2*(1-top),0); slatT.rotation.x=0.4*(1-top);
    const cut=ease(cl((lt-1.75)/0.45)); pens.forEach((g,i)=>{ g.visible=lt>=1.75; g.position.set(0,0.1+0.05*Math.sin(cut*Math.PI),g.userData.z*(1+1.4*cut)); g.rotation.x=lt*1.4*cut+i*0.3; });
    const pa=cl((lt-1.95)/0.5); paintM.color.copy(lerpC(0xc88f5c,0xf2b21b,pa));
    const z=easeIO(cl(lt/2.6)); const ca=0.5-0.35*z; const rad=10.5-1.6*z; cam.position.set(Math.sin(ca)*rad,5.0-1.0*z,Math.cos(ca)*rad); cam.lookAt(0.2,0.1,-0.15+0.15*z); P.c.render();
    layoutLabels(labs(0,[[0,aL,cl((lt-0.1)/0.2)*(1-cl((lt-1.1)/0.2))],[1,aS,cl((lt-0.85)/0.2)*(1-cl((lt-1.7)/0.15))],[2,aW,cl((lt-1.25)/0.2)*(1-cl((lt-1.75)/0.15))],[3,aP,cl((lt-1.95)/0.2)]]),cam,640,130);
    caption(0,lt0); };
  sc.traverse(o=>{ const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[]; ms.forEach(m=>{ if(m.envMapIntensity!==undefined&&!m.userData.keepEnv) m.envMapIntensity=0.3; }); });
})();

// ---------- S1 /factory-line a Lego brick: plastic granules fall from the hopper into a heated barrel, a screw pushes the melted plastic
// into a steel mould, it cools, the mould opens and the brick pops out onto a conveyor (injection moulding)
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#232a33','#05060a'); ren.toneMappingExposure=0.5;
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.5,radius:0.5,th:0.92});
  const key=new THREE.DirectionalLight(0xffffff,1.0); key.position.set(-3,7,5); sc.add(key); sc.add(new THREE.HemisphereLight(0xcfd8ff,0x101418,0.35));
  const steel=new THREE.MeshPhysicalMaterial({color:0x9aa3ad,metalness:1,roughness:.3}), darkS=new THREE.MeshPhysicalMaterial({color:0x3a3f46,metalness:.9,roughness:.4});
  const RED=0xc4161c, redM=new THREE.MeshPhysicalMaterial({color:RED,roughness:.25,clearcoat:1,clearcoatRoughness:.1});
  // barrel (see-through) with heater bands + screw
  const BY=1.5;
  const barrel=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,2.4,40,1,true),new THREE.MeshPhysicalMaterial({color:0xcfe4ff,transparent:true,opacity:.22,roughness:.05,side:THREE.DoubleSide,depthWrite:false})); barrel.rotation.z=Math.PI/2; barrel.position.set(-1.0,BY,0); sc.add(barrel);
  const bandM=new THREE.MeshStandardMaterial({color:0x4a3a30,metalness:.6,roughness:.5,emissive:0xff4a10,emissiveIntensity:0});
  [-1.7,-1.25,-0.8,-0.35].forEach(x=>{ const b=new THREE.Mesh(new THREE.TorusGeometry(0.235,0.03,10,40),bandM); b.rotation.y=Math.PI/2; b.position.set(x,BY,0); sc.add(b); });
  const helix=new THREE.Curve(); helix.getPoint=t=>new THREE.Vector3(-1.2+2.3*t-1.0+0.0,Math.cos(t*Math.PI*18)*0.15,Math.sin(t*Math.PI*18)*0.15);
  const screw=new THREE.Group(); screw.position.set(0,BY,0); sc.add(screw);
  screw.add(new THREE.Mesh(new THREE.TubeGeometry(helix,400,0.035,8,false),steel)); const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,2.3,16),steel); shaft.rotation.z=Math.PI/2; shaft.position.x=-1.05; screw.add(shaft);
  const melt=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,1,24),new THREE.MeshBasicMaterial({color:0xff3a1a,toneMapped:false,transparent:true,opacity:.85})); melt.rotation.z=Math.PI/2; sc.add(melt);
  const hop=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.12,0.7,32,1,true),new THREE.MeshPhysicalMaterial({color:0xb7c0ca,metalness:1,roughness:.3,side:THREE.DoubleSide})); hop.position.set(-1.9,BY+0.6,0); sc.add(hop);
  const NG=90, gran=new THREE.InstancedMesh(new THREE.SphereGeometry(0.03,8,6),new THREE.MeshStandardMaterial({color:RED,roughness:.4}),NG); sc.add(gran); const R=rnd(7), gs=[]; for(let i=0;i<NG;i++) gs.push([R(),R()*0.5-0.25,R()*0.5-0.25]);
  // mould: two steel blocks, right half slides away
  const mouldM=new THREE.MeshPhysicalMaterial({color:0x8d969f,metalness:1,roughness:.28}); const mL=new THREE.Mesh(new THREE.BoxGeometry(0.5,1.1,1.0),mouldM); mL.position.set(0.45,BY,0); sc.add(mL);
  const mR=new THREE.Mesh(new THREE.BoxGeometry(0.5,1.1,1.0),new THREE.MeshPhysicalMaterial({color:0x8d969f,metalness:1,roughness:.28,transparent:true,opacity:.55,depthWrite:false})); sc.add(mR);
  const nozzle=new THREE.Mesh(new THREE.ConeGeometry(0.12,0.3,24),steel); nozzle.rotation.z=-Math.PI/2; nozzle.position.set(0.12,BY,0); sc.add(nozzle);
  // brick 2x4 with studs (no logo)
  function brick(){ const g=new THREE.Group(); const b=new THREE.Mesh(rbox(0.64,0.38,0.32,0.02),redM); b.rotation.y=Math.PI/2; b.rotation.x=0; g.add(b);
    const body=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.38,0.64),redM); g.remove(b); g.add(body);
    for(let i=0;i<2;i++) for(let j=0;j<4;j++){ const s=new THREE.Mesh(new THREE.CylinderGeometry(0.048,0.048,0.06,24),redM); s.position.set((i-0.5)*0.16,0.22,(j-1.5)*0.16); g.add(s); } return g; }
  const hotM=new THREE.MeshBasicMaterial({color:0xff5a1a,toneMapped:false,transparent:true,opacity:0}); 
  const B0=brick(); B0.position.set(0.86,BY,0); sc.add(B0); const glowB=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.44,0.66),hotM); B0.add(glowB);
  // conveyor + earlier bricks
  const belt=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.06,3.6),new THREE.MeshStandardMaterial({color:0x1a1c1f,roughness:.7})); belt.position.set(0.95,0.35,0.6); sc.add(belt);
  const old=[]; for(let i=0;i<4;i++){ const b=brick(); b.position.set(0.95,0.57,0.6+i*0.9); sc.add(b); old.push(b); }
  const shd=shadowPlane(5,4,.7); shd.position.y=0; sc.add(shd);
  const aG=new THREE.Object3D(); aG.position.set(-1.7,BY+0.9,0); sc.add(aG);
  const aB=new THREE.Object3D(); aB.position.set(-0.6,BY+0.25,0); sc.add(aB);
  const aM=new THREE.Object3D(); aM.position.set(1.0,BY+0.3,0.5); sc.add(aM);
  const aO=new THREE.Object3D(); aO.position.set(1.05,0.75,0.6); sc.add(aO);
  const M4=new THREE.Matrix4();
  SCN[1]=function(lt0){ const lt=lt0*1.15;
    gs.forEach((s,i)=>{ const u=(s[0]+lt*1.3)%1; M4.makeTranslation(-1.9+s[1]*0.6*(1-u),BY+1.05-u*0.75,s[2]*0.6*(1-u)); if(lt>1.6) M4.makeScale(0,0,0); gran.setMatrixAt(i,M4); }); gran.instanceMatrix.needsUpdate=true;
    const heat=cl((lt-0.2)/0.4); bandM.emissiveIntensity=heat*(1.6+0.3*Math.sin(lt*9));
    screw.rotation.x=lt*8; const push=easeIO(cl((lt-0.6)/0.5)); screw.position.x=0.25*push;
    const mf=cl((lt-0.3)/0.6); melt.visible=mf>0.02; melt.scale.y=Math.max(0.01,1.2*mf+0.2*push); melt.position.set(-0.75+0.6*mf*0.5+0.15*push,BY,0);
    // fill the cavity 0.75-1.1: brick glows, then cools to red 1.1-1.6
    const fill=cl((lt-0.75)/0.35), cool=cl((lt-1.1)/0.5); B0.visible=fill>0.01; B0.scale.set(1,Math.max(0.02,fill),1); hotM.opacity=0.9*(1-cool)*fill;
    const open=easeIO(cl((lt-1.55)/0.35)); mR.position.set(1.27+0.9*open,BY,0);
    const pop=cl((lt-1.85)/0.55); const py=BY-(BY-0.57)*easeIO(pop)+0.35*Math.sin(pop*Math.PI); B0.position.set(0.86+0.09*easeIO(pop),py,0.0+0.6*easeIO(pop)); B0.rotation.x=pop*Math.PI*2;
    const mv=easeIO(cl((lt-2.3)/0.4)); old.forEach((b,i)=>{ b.position.z=0.6+(i+1)*0.9+0.9*mv; }); if(pop>=1) B0.position.z=0.6+0.9*mv;
    const z=easeIO(cl(lt/2.6)); const ca=0.75-0.25*z; const rad=11.5-1.2*z; cam.position.set(Math.sin(ca)*rad-0.4,4.2-0.6*z,Math.cos(ca)*rad); cam.lookAt(-0.4+0.3*z,0.9-0.1*z,0.6); P.c.render();
    layoutLabels(labs(1,[[0,aG,cl((lt-0.1)/0.2)],[1,aB,cl((lt-0.4)/0.2)],[2,aM,cl((lt-0.85)/0.2)],[3,aO,cl((lt-1.95)/0.2)]]),cam,660,130);
    caption(1,lt0); };
  sc.traverse(o=>{ const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[]; ms.forEach(m=>{ if(m.envMapIntensity!==undefined&&!m.userData.keepEnv) m.envMapIntensity=0.4; }); });
})();

// ---------- S2 /time-lapse a tunnel being dug: a cross-section of the ground; a tunnel boring machine pushes forward, its cutter head
// spins and grinds the rock, a conveyor carries the dirt back out, concrete rings line the tunnel behind it; dusk, the lights come on
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); ren.toneMappingExposure=0.42;
  const sky=canvasTex(16,512,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#2d4a73'); gr.addColorStop(.6,'#9fb6cf'); gr.addColorStop(1,'#d9c7ad'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  const dusk=canvasTex(16,512,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#0b1024'); gr.addColorStop(.6,'#3a2a55'); gr.addColorStop(1,'#ff7a3d'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  const skyM=new THREE.ShaderMaterial({uniforms:{a:{value:sky},b:{value:dusk},t:{value:0}},depthWrite:false,side:THREE.BackSide,
    vertexShader:'varying vec3 p; void main(){ p=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'uniform sampler2D a,b; uniform float t; varying vec3 p; void main(){ float v=clamp(0.5-p.y*1.2,0.,1.); vec3 c=mix(texture2D(a,vec2(.5,1.-v)).rgb,texture2D(b,vec2(.5,1.-v)).rgb,t); gl_FragColor=vec4(c,1.); }'});
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(80,32,16),skyM));
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.1,200);
  const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.55,th:0.86});
  const hemi=new THREE.HemisphereLight(0xcfe0ff,0x22303a,0.45); sc.add(hemi);
  const sun=new THREE.DirectionalLight(0xfff0d8,1.0); sun.position.set(-6,10,8); sc.add(sun);
  // ground block, cut face at z=0: strata
  const X0=-2.6, X1=2.6, TY=-1.6;
  [[0.0,-0.5,0x4d3b2a],[-0.5,-1.1,0x6b5138],[-1.1,-2.3,0x5e564e],[-2.3,-6.0,0x4a4642]].forEach(([a,b,c])=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(X1-X0+8,a-b,3),new THREE.MeshStandardMaterial({color:c,roughness:1,envMapIntensity:.3})); m.position.set(0,(a+b)/2,-1.5); sc.add(m); });
  const grass=new THREE.Mesh(new THREE.BoxGeometry(X1-X0+8,0.06,3),new THREE.MeshStandardMaterial({color:0x4f7a3a,roughness:1})); grass.position.set(0,0.03,-1.5); sc.add(grass);
  const R=rnd(13); const winM=glowMat(0xffd28a,0);
  for(let i=0;i<7;i++){ const h=0.3+R()*0.8, x=X0+0.4+i*0.72, z=-0.6-R()*1.6; const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,h,0.42),new THREE.MeshStandardMaterial({color:0x9a968f,roughness:.8})); b.position.set(x,h/2+0.06,z); sc.add(b);
    const w=new THREE.Mesh(new THREE.PlaneGeometry(0.3,h*0.7),winM); w.position.set(x,h/2+0.06,z+0.215); sc.add(w); }
  // dark tunnel bore (half hidden in the ground) + rings
  const boreM=new THREE.MeshStandardMaterial({color:0x1a1715,roughness:1,side:THREE.BackSide});
  const bore=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,1,32,1,true),boreM); bore.rotation.z=Math.PI/2; sc.add(bore);
  const ringM=new THREE.MeshStandardMaterial({color:0xbab3a6,roughness:.8,side:THREE.DoubleSide});
  const rings=[]; for(let x=X0+0.1;x<X1;x+=0.2){ const r=new THREE.Mesh(new THREE.TorusGeometry(0.47,0.05,8,40),ringM); r.rotation.y=Math.PI/2; r.position.set(x,TY,0); sc.add(r); rings.push(r); }
  const lampM=glowMat(0xffe0a0,0); const lamps=[]; for(let x=X0+0.2;x<X1;x+=0.4){ const l=new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),lampM); l.position.set(x,TY+0.38,-0.25); sc.add(l); lamps.push(l); }
  // shaft at the start
  const shaft=new THREE.Mesh(new THREE.BoxGeometry(0.7,1.7,0.9),new THREE.MeshStandardMaterial({color:0x2a2622,roughness:1,side:THREE.BackSide})); shaft.position.set(X0+0.35,TY+0.75,-0.3); sc.add(shaft);
  // tunnel boring machine
  const TBM=new THREE.Group(); sc.add(TBM);
  const shield=new THREE.Mesh(new THREE.CylinderGeometry(0.48,0.48,1.2,40),new THREE.MeshPhysicalMaterial({color:0xe0a12a,metalness:.6,roughness:.35,clearcoat:.4})); shield.rotation.z=Math.PI/2; shield.position.x=-0.6; TBM.add(shield);
  const head=new THREE.Group(); head.position.x=0.06; TBM.add(head);
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.1,40),new THREE.MeshPhysicalMaterial({color:0x9aa3ad,metalness:1,roughness:.3})); disc.rotation.z=Math.PI/2; head.add(disc);
  for(let k=0;k<6;k++){ const arm=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.95,0.08),new THREE.MeshPhysicalMaterial({color:0xe0a12a,metalness:.6,roughness:.35})); arm.position.x=0.07; arm.rotation.x=k*Math.PI/6; head.add(arm);
    for(let j=-2;j<=2;j++){ if(!j) continue; const c=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.04,12),new THREE.MeshStandardMaterial({color:0x2a2c30,metalness:1,roughness:.3})); c.rotation.z=Math.PI/2; c.position.set(0.11,j*0.09*Math.cos(k*Math.PI/6),j*0.09*Math.sin(k*Math.PI/6)); head.add(c); } }
  const sparks=[]; for(let i=0;i<14;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(0.02,6,5),glowMat(0xffb060,0)); sc.add(s); sparks.push(s); }
  // conveyor with dirt chunks running back to the shaft
  const conv=new THREE.Mesh(new THREE.BoxGeometry(1,0.04,0.26),new THREE.MeshStandardMaterial({color:0x3a3d42,roughness:.6})); sc.add(conv);
  const NC=40, chunks=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.045),new THREE.MeshStandardMaterial({color:0x6b5138,roughness:1}),NC); sc.add(chunks);
  const aH=new THREE.Object3D(); head.add(aH); aH.position.set(0.12,0.2,0.35);
  const aC=new THREE.Object3D(); sc.add(aC);
  const aR=new THREE.Object3D(); sc.add(aR);
  const M4=new THREE.Matrix4();
  SCN[2]=function(lt){ const p=easeIO(cl((lt-0.05)/2.2)); const fx=X0+0.9+(X1-0.5-(X0+0.9))*p;
    TBM.position.set(fx,TY,0); head.rotation.x=-lt*6;
    bore.scale.y=Math.max(0.01,fx-(X0+0.3)); bore.position.set((fx+X0+0.3)/2,TY,0);
    rings.forEach(r=>{ r.visible=r.position.x<fx-1.3; }); lamps.forEach(l=>{ l.visible=l.position.x<fx-1.3; });
    sparks.forEach((s,i)=>{ const u=((i/14)+lt*2.5)%1; const a=i*2.4; s.position.set(fx+0.15+0.1*u,TY+Math.cos(a)*0.45*(1-u*0.3),Math.sin(a)*0.45+0.05); s.material.opacity=(lt<2.3?0.8:0)*(1-u); });
    const cx0=X0+0.5, cx1=fx-0.2; conv.scale.x=Math.max(0.01,cx1-cx0); conv.position.set((cx0+cx1)/2,TY-0.3,0.15);
    for(let i=0;i<NC;i++){ const u=((i/NC)+lt*0.8)%1; const x=cx1-(cx1-cx0)*u; M4.makeRotationY(i); M4.setPosition(x,TY-0.25,0.15+((i*37)%7-3)*0.012); if(x<cx0+0.05||lt>2.35) M4.makeScale(0,0,0); chunks.setMatrixAt(i,M4); } chunks.instanceMatrix.needsUpdate=true;
    aC.position.set(cx1-0.9,TY-0.27,0.2); aR.position.set(Math.max(X0+0.4,fx-1.9),TY+0.3,0.38);
    const lit=cl((lt-2.0)/0.5); skyM.uniforms.t.value=lit*0.9; lampM.opacity=lit; winM.opacity=lit*0.9; hemi.intensity=0.45-0.25*lit; sun.intensity=1.0*(1-0.7*lit); sun.color.copy(lerpC(0xfff0d8,0xff8a4a,lit));
    const z=easeIO(cl(lt/2.8)); cam.position.set(-7.6+1.0*z,1.3-0.2*z,12.6-0.8*z); cam.lookAt(0.4+0.4*z,-0.95,-0.3); P.c.render();
    layoutLabels(labs(2,[[0,aH,cl((lt-0.25)/0.2)],[1,aC,cl((lt-0.7)/0.2)],[2,aR,cl((lt-1.1)/0.2)]]),cam,690,140);
    caption(2,lt); };
  sc.traverse(o=>{ const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[]; ms.forEach(m=>{ if(m.envMapIntensity!==undefined&&!m.userData.keepEnv) m.envMapIntensity=0.25; }); });
})();
