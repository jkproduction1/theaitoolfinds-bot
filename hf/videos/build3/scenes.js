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

// ---------- S0 /how-its-made a glass bottle: sand + soda ash + limestone fall into a glowing furnace, a gob drops into a mould,
// air blows it into a bottle, the mould opens, the bottle cools slowly from orange to clear glass
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#2a2420','#07080a'); ren.toneMappingExposure=0.62;
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.75,radius:0.6,th:0.85});
  const key=new THREE.DirectionalLight(0xffffff,1.1); key.position.set(4,6,5); sc.add(key); sc.add(new THREE.HemisphereLight(0xcfd8ff,0x201812,0.35));
  const hot=new THREE.PointLight(0xff7a2a,6,6,2); hot.position.set(0,3.5,0.6); sc.add(hot);
  const brick=new THREE.MeshStandardMaterial({color:0x3a2f2a,roughness:.95,envMapIntensity:0.3});
  const F=new THREE.Group(); F.position.y=3.8; sc.add(F);
  [[0,0.62,0,2.3,0.12,1.3],[0,-0.62,0,2.3,0.12,1.3],[-1.1,0,0,0.12,1.3,1.3],[1.1,0,0,0.12,1.3,1.3],[0,0,-0.6,2.3,1.3,0.12]].forEach(([x,y,z,a,b,c])=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(a,b,c),brick); m.position.set(x,y,z); F.add(m); });
  const lip=new THREE.Mesh(new THREE.BoxGeometry(2.3,0.08,0.06),new THREE.MeshStandardMaterial({color:0x6b5a4f,roughness:.8})); lip.position.set(0,-0.36,0.63); F.add(lip);
  const poolM=new THREE.MeshStandardMaterial({color:0x220800,emissive:0xff6a18,emissiveIntensity:2.2,roughness:.3,toneMapped:false});
  const pool=new THREE.Mesh(new THREE.BoxGeometry(2.0,0.42,1.1),poolM); pool.position.y=-0.33; F.add(pool);
  const spout=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.16,0.3,24),new THREE.MeshStandardMaterial({color:0x2a2420,roughness:.7})); spout.position.y=-0.8; F.add(spout);
  const drip=new THREE.Mesh(new THREE.SphereGeometry(0.07,16,12),poolM); drip.position.y=-0.97; F.add(drip);
  // three raw materials falling in
  const mats=[0xd8b77a,0xf0f0ea,0x9a9a92], NG=60, grains=[]; const R=rnd(9);
  mats.forEach((c,k)=>{ const im=new THREE.InstancedMesh(new THREE.SphereGeometry(0.035,8,6),new THREE.MeshStandardMaterial({color:c,roughness:.8}),NG); im.userData.x=-0.6+k*0.6; im.userData.s=[]; for(let i=0;i<NG;i++) im.userData.s.push([R(),R()*0.16-0.08,R()*0.16-0.08]); sc.add(im); grains.push(im); });
  const hop=[]; mats.forEach((c,k)=>{ const h=new THREE.Mesh(new THREE.ConeGeometry(0.26,0.4,24,1,true),new THREE.MeshStandardMaterial({color:0x5c636c,metalness:.8,roughness:.35,side:THREE.DoubleSide})); h.rotation.x=Math.PI; h.position.set(-0.6+k*0.6,5.75,0.1); sc.add(h); hop.push(h);
    const pile=new THREE.Mesh(new THREE.SphereGeometry(0.22,20,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:c,roughness:.9})); pile.position.set(-0.6+k*0.6,5.95,0.1); pile.scale.y=0.6; sc.add(pile); });
  // the mould: two steel halves, cut away (see-through) so we watch the bottle form inside
  const mouldM=new THREE.MeshPhysicalMaterial({color:0x9aa3ad,metalness:1,roughness:.28,transparent:true,opacity:0.38,side:THREE.DoubleSide,depthWrite:false});
  const halfG=new THREE.CylinderGeometry(0.5,0.5,1.6,40,1,false,0,Math.PI); const mL=new THREE.Group(), mR=new THREE.Group(); mL.position.y=mR.position.y=0.8; sc.add(mL); sc.add(mR);
  const hl=new THREE.Mesh(halfG,mouldM); hl.rotation.y=Math.PI/2; mL.add(hl); const hr=new THREE.Mesh(halfG,mouldM); hr.rotation.y=-Math.PI/2; mR.add(hr);
  const eM=new THREE.LineBasicMaterial({color:0xcfe4ff,transparent:true,opacity:.5,toneMapped:false}); mL.add(new THREE.LineSegments(new THREE.EdgesGeometry(halfG,20),eM)); mL.children[1].rotation.y=Math.PI/2; mR.add(new THREE.LineSegments(new THREE.EdgesGeometry(halfG,20),eM)); mR.children[1].rotation.y=-Math.PI/2;
  const blow=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.2,0.3,24),new THREE.MeshPhysicalMaterial({color:0x6d7681,metalness:1,roughness:.3})); blow.position.y=2.0; sc.add(blow);
  const base=new THREE.Mesh(rbox(1.6,1.6,0.1,0.1),new THREE.MeshPhysicalMaterial({color:0x1b1e22,metalness:.6,roughness:.5,envMapIntensity:.4})); base.rotation.x=Math.PI/2; base.position.y=-0.05; sc.add(base);
  const shd=shadowPlane(3,3,.7); shd.position.y=0.005; sc.add(shd);
  // bottle (lathe), hot -> cool
  const prof=[[0,0],[0.3,0],[0.33,0.04],[0.34,0.9],[0.31,1.05],[0.17,1.2],[0.12,1.32],[0.115,1.5],[0.13,1.52],[0.13,1.57],[0.1,1.57]].map(([r,y])=>new THREE.Vector2(r,y));
  const botM=new THREE.MeshPhysicalMaterial({color:0x2f6b4f,metalness:0,roughness:.04,clearcoat:1,transparent:true,opacity:0.5,envMapIntensity:1.0,emissive:0xff5a10,emissiveIntensity:1,side:THREE.DoubleSide});
  const bottle=new THREE.Mesh(new THREE.LatheGeometry(prof,64),botM); bottle.position.y=0.02; sc.add(bottle);
  const gob=new THREE.Mesh(new THREE.SphereGeometry(0.17,24,16),poolM); sc.add(gob);
  const air=[]; for(let i=0;i<18;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),glowMat(0xbfe8ff,0)); sc.add(m); air.push(m); }
  const aF=new THREE.Object3D(); aF.position.set(0.9,3.45,0.5); sc.add(aF);
  const aM=new THREE.Object3D(); aM.position.set(0.48,1.2,0.1); sc.add(aM);
  const aA=new THREE.Object3D(); aA.position.set(0.16,1.95,0); sc.add(aA);
  const aC=new THREE.Object3D(); aC.position.set(0.3,0.7,0.1); sc.add(aC);
  SCN[0]=function(lt){
    grains.forEach(im=>{ const M=new THREE.Matrix4(); im.userData.s.forEach((s,i)=>{ const u=(s[0]+lt*1.6)%1; const on=lt<1.1; M.makeTranslation(im.userData.x+s[1],5.55-u*1.5,0.1+s[2]); if(!on) M.makeScale(0,0,0); im.setMatrixAt(i,M); }); im.instanceMatrix.needsUpdate=true; });
    poolM.emissiveIntensity=2.0+0.4*Math.sin(lt*7); hot.intensity=6+1.5*Math.sin(lt*9);
    // gob drop 0.55 -> 0.95
    const g=cl((lt-0.55)/0.4); gob.visible=lt>0.5&&lt<1.0; gob.position.set(0,2.8-1.5*g*g,0); gob.scale.set(1-0.25*g,1+0.6*g,1-0.25*g);
    // blow 0.95 -> 1.6: parison swells into the bottle
    const b=easeIO(cl((lt-0.95)/0.65)); bottle.visible=lt>0.93; bottle.scale.set(0.3+0.7*b,0.75+0.25*b,0.3+0.7*b);
    const ab=cl((lt-0.95)/0.1)*(1-cl((lt-1.6)/0.15)); air.forEach((m,i)=>{ const u=((i/air.length)+lt*2.2)%1; m.position.set(0,2.0-u*1.3,0); m.material.opacity=ab*(1-u*0.5); });
    blow.position.y=2.0+0.5*cl((lt-1.6)/0.3); 
    // mould opens 1.65 -> 2.0
    const o=easeIO(cl((lt-1.65)/0.35)); mL.position.x=-0.9*o; mR.position.x=0.9*o; mouldM.opacity=0.38*(1-0.6*o); eM.opacity=0.5*(1-0.7*o);
    // cools slowly: glow fades to clear glass
    const c=cl((lt-1.7)/1.0); botM.emissiveIntensity=1.1*(1-c)*(1-c); botM.opacity=0.5+0.2*(1-c); bottle.rotation.y=lt*0.8;
    const tilt=easeIO(cl((lt-0.35)/0.8)); const zoom=easeIO(cl((lt-1.6)/1.1));
    const ly=3.9-3.1*tilt, rad=8.4-1.9*zoom; const ca=0.35-0.2*lt*0.3; cam.position.set(Math.sin(ca)*rad,ly+1.1-0.4*zoom,Math.cos(ca)*rad); cam.lookAt(0,ly,0); P.c.render();
    layoutLabels([['l0_0',aF,cl((lt-0.12)/0.2)*(1-cl((lt-0.9)/0.2))],['l0_1',aM,cl((lt-0.8)/0.2)],['l0_2',aA,cl((lt-1.1)/0.2)*(1-cl((lt-1.7)/0.2))],['l0_3',aC,cl((lt-1.85)/0.2)]].map(([id,o2,a])=>[document.getElementById(id),o2,a]),cam,600,130);
    caption(0,lt); };
})();

// ---------- S1 /explode a mechanical keyboard: assembled board, then layers fly apart (keycaps, switches, plate, PCB, case),
// one switch splits further into housing, stem and spring, and the spring compresses like a key press
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#232a33','#05060a');
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.3,radius:0.45,th:0.97});
  const key=new THREE.DirectionalLight(0xffffff,0.8); key.position.set(-3,7,5); sc.add(key); ren.toneMappingExposure=0.48;
  const K=new THREE.Group(); K.rotation.y=-1.2; K.scale.setScalar(0.75); sc.add(K);
  const U=0.38, keys=[]; for(let r=0;r<4;r++) for(let c=0;c<14;c++) keys.push([(c-6.5)*U,(r-2)*U,1]);
  [[-6.5,1],[-5.5,1],[-4.5,1]].forEach(([c,w])=>keys.push([c*U,2*U,w])); keys.push([(-0.5)*U,2*U,6.6]); [[4.5,1],[5.5,1],[6.5,1]].forEach(([c,w])=>keys.push([c*U,2*U,w]));
  const FEAT=keys.length-1; // front-right key gets the detailed switch
  const capM=new THREE.MeshPhysicalMaterial({color:0xc9c4bb,roughness:.6,clearcoat:.1}), capA=new THREE.MeshPhysicalMaterial({color:0xff6a3d,roughness:.5,clearcoat:.3});
  const capG=rbox(0.33,0.33,0.15,0.06); capG.rotateX(-Math.PI/2);
  const caps=new THREE.InstancedMesh(capG,capM,keys.length); const hous=new THREE.InstancedMesh(new THREE.BoxGeometry(0.27,0.17,0.27),new THREE.MeshStandardMaterial({color:0x2b2e33,roughness:.5}),keys.length);
  const stems=new THREE.InstancedMesh(new THREE.BoxGeometry(0.07,0.12,0.07),new THREE.MeshStandardMaterial({color:0xd23a2a,roughness:.5}),keys.length);
  const L={caps:[0.83,2.75],sw:[0.6,1.85],plate:[0.47,1.15],pcb:[0.4,0.55]};
  const plate=new THREE.Mesh(rbox(5.55,1.95,0.04,0.05),new THREE.MeshPhysicalMaterial({color:0x6d747c,metalness:.9,roughness:.45})); plate.rotation.x=Math.PI/2; K.add(plate);
  const pcbT=canvasTex(512,180,(g,w,h)=>{ g.fillStyle='#0f5a36'; g.fillRect(0,0,w,h); g.strokeStyle='#d9b45a'; g.lineWidth=1.5; const r=rnd(4); for(let i=0;i<60;i++){ g.beginPath(); let x=r()*w,y=r()*h; g.moveTo(x,y); x+= (r()-.5)*80; g.lineTo(x,y); y+=(r()-.5)*40; g.lineTo(x,y); g.stroke(); }
    g.fillStyle='#e8c56a'; for(let c=0;c<14;c++) for(let rr=0;rr<5;rr++){ g.beginPath(); g.arc(18+c*34.5,18+rr*34.5,4,0,7); g.fill(); } g.fillStyle='#111'; g.fillRect(w*0.45,h*0.04,40,14); });
  const pcb=new THREE.Mesh(new THREE.BoxGeometry(5.5,0.05,1.9),[0,0,new THREE.MeshStandardMaterial({map:pcbT,roughness:.6}),0,0,0].map(m=>m||new THREE.MeshStandardMaterial({color:0x0b4429}))); K.add(pcb);
  const caseG=rbox(5.8,2.2,0.38,0.12); caseG.rotateX(Math.PI/2); const cs=new THREE.Mesh(caseG,new THREE.MeshPhysicalMaterial({color:0x30353c,metalness:.85,roughness:.32})); cs.position.y=0.19; K.add(cs);
  const shd=shadowPlane(8,4,.8); shd.position.y=0.002; K.add(shd);
  // featured switch, built from parts
  const FS=new THREE.Group(); FS.position.set(keys[FEAT][0],0,keys[FEAT][1]); K.add(FS);
  const hTop=new THREE.Mesh(new THREE.BoxGeometry(0.27,0.08,0.27),new THREE.MeshPhysicalMaterial({color:0xd9dde2,roughness:.2,transparent:true,opacity:.55})); FS.add(hTop);
  const hBot=new THREE.Mesh(new THREE.BoxGeometry(0.27,0.09,0.27),new THREE.MeshStandardMaterial({color:0x2b2e33,roughness:.5})); FS.add(hBot);
  const stem=new THREE.Group(); const s1=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.14,0.04),new THREE.MeshStandardMaterial({color:0xd23a2a,roughness:.45})); const s2=s1.clone(); s2.rotation.y=Math.PI/2; stem.add(s1); stem.add(s2); FS.add(stem);
  const helix=new THREE.Curve(); helix.getPoint=function(t){ return new THREE.Vector3(Math.cos(t*Math.PI*14)*0.055,t-0.5,Math.sin(t*Math.PI*14)*0.055); };
  const spring=new THREE.Mesh(new THREE.TubeGeometry(helix,200,0.007,6,false),new THREE.MeshPhysicalMaterial({color:0xe6edf5,metalness:1,roughness:.15,emissive:0xff6a3d,emissiveIntensity:0})); FS.add(spring);
  const fCap=new THREE.Mesh(capG,capA); FS.add(fCap);
  const aCap=new THREE.Object3D(), aSw=new THREE.Object3D(), aPl=new THREE.Object3D(), aPc=new THREE.Object3D(); K.add(aCap); K.add(aPl); K.add(aPc); FS.add(aSw);
  aCap.position.set(-2.4,0,-0.6); aPl.position.set(-2.6,0,0.9); aPc.position.set(-2.55,0,0.9);
  const M=new THREE.Matrix4(), Q=new THREE.Quaternion(), Sv=new THREE.Vector3(), Pv=new THREE.Vector3();
  SCN[1]=function(lt){ const e=easeIO(cl((lt-0.35)/0.9)); const y=(a)=>a[0]+(a[1]-a[0])*e;
    const yc=y(L.caps), ys=y(L.sw), yp=y(L.plate), yb=y(L.pcb);
    keys.forEach(([x,z,w],i)=>{ const hide=i===FEAT?0:1; Sv.set(w*hide,hide,hide); M.compose(Pv.set(x+(w>1?0:0),yc,z),Q,Sv); caps.setMatrixAt(i,M);
      Sv.set(hide,hide,hide); M.compose(Pv.set(x,ys,z),Q,Sv); hous.setMatrixAt(i,M); M.compose(Pv.set(x,ys+0.12,z),Q,Sv); stems.setMatrixAt(i,M); });
    caps.instanceMatrix.needsUpdate=hous.instanceMatrix.needsUpdate=stems.instanceMatrix.needsUpdate=true;
    plate.position.y=yp; pcb.position.y=yb;
    // featured switch splits further after 1.25
    const f=easeIO(cl((lt-1.25)/0.55)); const press=lt>1.85?0.5-0.5*Math.cos((lt-1.85)*7):0;
    hBot.position.y=ys-0.04; spring.position.y=ys+0.05+0.32*f; spring.scale.set(1,(0.16*(1-0.45*press)),1); spring.material.emissiveIntensity=0.6*f;
    stem.position.y=ys+0.14+0.62*f-0.07*press; hTop.position.y=ys+0.06+0.95*f; fCap.position.y=yc+0.55*f-0.06*press;
    aSw.position.set(0.18,ys+0.45*f+0.1,0); aCap.position.y=yc+0.05; aPl.position.y=yp; aPc.position.y=yb;
    const z=easeIO(cl((lt-1.25)/1.1)); const tgt=new THREE.Vector3(); FS.getWorldPosition(tgt); tgt.y=(ys+0.5*f)*0.75;
    const look=new THREE.Vector3(0,1.0,0).lerp(tgt,0.6*z); const far=new THREE.Vector3(-1.2,6.8,10.5), near=tgt.clone().add(new THREE.Vector3(-1.0,2.6,4.8));
    cam.position.lerpVectors(far,near,0.62*z); cam.position.x+=0.4*Math.sin(lt*0.6); cam.lookAt(look); P.c.render();
    layoutLabels([['l1_0',aCap,cl((lt-0.75)/0.2)*(1-cl((lt-1.5)/0.2))],['l1_1',aSw,cl((lt-1.45)/0.2)],['l1_2',aPl,cl((lt-0.95)/0.2)*(1-cl((lt-1.55)/0.2))],['l1_3',aPc,cl((lt-1.1)/0.2)*(1-cl((lt-1.6)/0.2))]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,640,130);
    caption(1,lt); };
  K.add(caps); K.add(hous); K.add(stems);
  sc.traverse(o=>{ if(o.material&&!Array.isArray(o.material)&&o.material.envMapIntensity!==undefined) o.material.envMapIntensity=0.4; if(Array.isArray(o.material)) o.material.forEach(m=>m.envMapIntensity=0.4); });
})();

// ---------- S2 /time-lapse a bridge being built: towers rise from the water, main cables are strung over them,
// suspenders drop down, deck sections are lifted and hung piece by piece, dusk, the lights come on
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); ren.toneMappingExposure=0.62;
  const sky=canvasTex(16,512,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#2d4a73'); gr.addColorStop(.62,'#9fb6cf'); gr.addColorStop(1,'#d9c7ad'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  const dusk=canvasTex(16,512,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#0b1024'); gr.addColorStop(.6,'#3a2a55'); gr.addColorStop(1,'#ff7a3d'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  const skyM=new THREE.ShaderMaterial({uniforms:{a:{value:sky},b:{value:dusk},t:{value:0}},depthWrite:false,side:THREE.BackSide,
    vertexShader:'varying vec3 p; void main(){ p=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'uniform sampler2D a,b; uniform float t; varying vec3 p; void main(){ float v=clamp(0.5-p.y*1.2,0.,1.); vec3 c=mix(texture2D(a,vec2(.5,1.-v)).rgb,texture2D(b,vec2(.5,1.-v)).rgb,t); gl_FragColor=vec4(c,1.); }'});
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(80,32,16),skyM));
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,200);
  const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.55,th:0.86});
  const hemi=new THREE.HemisphereLight(0xcfe0ff,0x22303a,0.6); sc.add(hemi);
  const sun=new THREE.DirectionalLight(0xfff0d8,1.6); sun.position.set(-8,10,6); sc.add(sun);
  const waterM=new THREE.MeshPhysicalMaterial({color:0x1d3a52,metalness:.2,roughness:.12,clearcoat:1,envMapIntensity:0.9}); const water=new THREE.Mesh(new THREE.PlaneGeometry(200,200),waterM); water.rotation.x=-Math.PI/2; sc.add(water);
  const landM=new THREE.MeshStandardMaterial({color:0x2d3a2c,roughness:1,envMapIntensity:0.2});
  [-1,1].forEach(s=>{ const l=new THREE.Mesh(new THREE.BoxGeometry(14,0.9,30),landM); l.position.set(s*13.2,0.2,0); sc.add(l); });
  const conc=new THREE.MeshStandardMaterial({color:0xbab3a6,roughness:.8}), red=new THREE.MeshPhysicalMaterial({color:0xb3402a,roughness:.45,metalness:.3,clearcoat:.3});
  const TX=3.2, TH=3.6, DY=0.95, Z=0.42, towers=[];
  [-TX,TX].forEach(x=>{ const g=new THREE.Group(); g.position.x=x; sc.add(g); const pier=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.4,1.3),conc); pier.position.y=0.1; g.add(pier);
    const legs=new THREE.Group(); [-Z,Z].forEach(z=>{ const lg=new THREE.Mesh(new THREE.BoxGeometry(0.16,1,0.16),red); lg.geometry.translate(0,0.5,0); lg.position.z=z; legs.add(lg); }); g.add(legs);
    const beams=[]; [1.6,2.6,3.5].forEach(y=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.14,2*Z+0.16),red); b.position.y=y; g.add(b); beams.push(b); });
    towers.push({g,legs,beams}); });
  // main cable: anchor -> tower top -> sag -> tower top -> anchor
  const cy=(x)=>{ const ax=Math.abs(x); if(ax<=TX) return DY+0.35+(TH-DY-0.35)*(x*x)/(TX*TX); return TH-(TH-0.85)*(ax-TX)/(6.4-TX); };
  const cables=[], NS=120; [-Z,Z].forEach(z=>{ const pts=[]; for(let i=0;i<=NS;i++){ const x=-6.4+12.8*i/NS; pts.push(new THREE.Vector3(x,cy(x),z)); }
    const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),240,0.03,8,false),new THREE.MeshPhysicalMaterial({color:0xd9dde2,metalness:1,roughness:.3})); sc.add(m); cables.push(m); });
  const sus=[], decks=[], lamps=[]; const lampM=glowMat(0xffd28a,0);
  for(let x=-5.9;x<=5.95;x+=0.3){ if(Math.abs(Math.abs(x)-TX)<0.15) continue; const h=cy(x)-DY; const pair=[]; [-Z,Z].forEach(z=>{ const s=new THREE.Mesh(new THREE.CylinderGeometry(0.007,0.007,1,4),new THREE.MeshStandardMaterial({color:0xcfd4da,metalness:.9,roughness:.4})); s.position.set(x,DY+h/2,z); s.scale.y=h; sc.add(s); pair.push(s); }); sus.push({x,pair,h}); }
  for(let x=-6.3;x<6.31;x+=0.42){ const d=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.12,2*Z+0.1),new THREE.MeshStandardMaterial({color:0x5b5f66,roughness:.7,metalness:.3})); d.position.set(x,DY,0); sc.add(d); decks.push(d);
    const l=new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),lampM); l.position.set(x,DY+0.14,Z+0.05); sc.add(l); lamps.push(l); }
  const beacons=[]; [-TX,TX].forEach(x=>{ const b=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,8),glowMat(0xff3b2f,0)); b.position.set(x,TH+0.1,0); sc.add(b); beacons.push(b); });
  const aT=new THREE.Object3D(); aT.position.set(TX,TH*0.85,Z); sc.add(aT);
  const aC=new THREE.Object3D(); aC.position.set(1.4,cy(1.4),Z); sc.add(aC);
  const aD=new THREE.Object3D(); aD.position.set(-1.0,DY,Z); sc.add(aD);
  SCN[2]=function(lt){ const t1=easeIO(cl((lt-0.05)/0.75)); towers.forEach(T=>{ T.legs.scale.y=Math.max(0.01,t1*TH); T.beams.forEach(b=>b.visible=b.position.y<t1*TH); });
    const c=cl((lt-0.75)/0.5); cables.forEach(m=>{ m.visible=c>0; m.geometry.setDrawRange(0,Math.floor(m.geometry.index.count*c/6)*6); });
    const s=cl((lt-1.15)/0.45); sus.forEach((o,i)=>{ const a=cl(s*1.4-(Math.abs(o.x)/6)*0.4); o.pair.forEach(m=>{ m.visible=a>0.02; m.scale.y=o.h*a; m.position.y=cy(o.x)-o.h*a/2; }); });
    const d=cl((lt-1.45)/0.8); decks.forEach((m,i)=>{ const ord=Math.min(Math.abs(m.position.x-TX),Math.abs(m.position.x+TX))/3.3; const a=easeIO(cl(d*1.6-ord*0.6)); m.visible=a>0.01; m.position.y=0.05+(DY-0.05)*a; });
    const lit=cl((lt-2.0)/0.6); skyM.uniforms.t.value=lit*0.9; lampM.opacity=lit; beacons.forEach(b=>b.material.opacity=lit*(0.6+0.4*Math.sin(lt*12))); hemi.intensity=0.6-0.35*lit; sun.intensity=1.6*(1-0.7*lit); sun.color.copy(lerpC(0xfff0d8,0xff8a4a,lit));
    const ca=-0.78+0.2*easeIO(cl(lt/2.8)); const rad=19-1.6*easeIO(cl(lt/2.8)); cam.position.set(Math.sin(ca)*rad,3.6+0.4*lt,Math.cos(ca)*rad); cam.lookAt(0,1.9,0); P.c.render();
    layoutLabels([['l2_0',aT,cl((lt-0.3)/0.2)],['l2_1',aC,cl((lt-0.95)/0.2)],['l2_2',aD,cl((lt-1.65)/0.2)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,620,130);
    caption(2,lt); };
})();
