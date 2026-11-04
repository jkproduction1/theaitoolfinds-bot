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
// ---------- camera lens: one lens group moves, the image on the sensor gets sharp
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#1d2129','#050607');
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.7,radius:0.5,th:0.85});
  const key=new THREE.DirectionalLight(0xffffff,0.8); key.position.set(2,5,4); sc.add(key);
  const rig=new THREE.Group(); sc.add(rig);
  // barrel: half tube (cut away towards the camera)
  const metal=new THREE.MeshPhysicalMaterial({color:0x1b1d21,metalness:.85,roughness:.32,envMapIntensity:.6,side:THREE.DoubleSide});
  const barrel=new THREE.Mesh(new THREE.CylinderGeometry(0.66,0.66,2.6,96,1,true,Math.PI*0.5,Math.PI),metal); barrel.rotation.z=Math.PI/2; barrel.position.x=0.05; rig.add(barrel);
  const ringM=new THREE.MeshPhysicalMaterial({color:0xb9bec7,metalness:1,roughness:.25,envMapIntensity:.8});
  [-1.25,-0.2,0.85].forEach(x=>{ const r=new THREE.Mesh(new THREE.TorusGeometry(0.67,0.03,12,96,Math.PI),x>0?ringM:new THREE.MeshPhysicalMaterial({color:0xff4b1f,metalness:.3,roughness:.4})); r.rotation.y=Math.PI/2; r.rotation.z=Math.PI; r.position.x=x; rig.add(r); });
  const grip=new THREE.Mesh(new THREE.CylinderGeometry(0.69,0.69,0.6,96,1,true,Math.PI*0.5,Math.PI),new THREE.MeshStandardMaterial({color:0x0c0c0d,roughness:.9,side:THREE.DoubleSide})); grip.rotation.z=Math.PI/2; grip.position.x=-0.7; rig.add(grip);
  // glass elements (lathe profiles)
  const bdT=canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#07080b'; g.fillRect(0,0,w,h); [[130,230,150,'#ff4b1f'],[380,260,170,'#3a5bff'],[260,120,110,'#ffb36b']].forEach(([x,y,r,c])=>{ const gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,c); gr.addColorStop(1,'rgba(7,8,11,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); }); });
  const bd=new THREE.Mesh(new THREE.PlaneGeometry(9,9),new THREE.MeshBasicMaterial({map:bdT,toneMapped:false,transparent:true,opacity:.55})); bd.position.z=-3.2; sc.add(bd);
  const glass=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:0.04,transmission:0.96,thickness:0.6,ior:1.5,envMapIntensity:1.4,clearcoat:1,attenuationColor:new THREE.Color(0xcfe3ff),attenuationDistance:1.5});
  function lensEl(r,t,c1,c2){ const pts=[]; const N=24; for(let i=0;i<=N;i++){ const y=r*i/N; pts.push(new THREE.Vector2(y, t/2+c1*(1-Math.pow(y/r,2)))); }
    for(let i=N;i>=0;i--){ const y=r*i/N; pts.push(new THREE.Vector2(y,-t/2-c2*(1-Math.pow(y/r,2)))); }
    const g=new THREE.LatheGeometry(pts,72); const m=new THREE.Mesh(g,glass); m.rotation.z=Math.PI/2; const w=new THREE.Group(); w.add(m); return w; }
  const front=lensEl(0.58,0.05,0.14,0.04); front.position.x=-1.15; rig.add(front);
  const el2=lensEl(0.46,0.04,0.02,0.08); el2.position.x=-0.75; rig.add(el2);
  const focusG=new THREE.Group(); rig.add(focusG);
  const el3=lensEl(0.48,0.05,0.1,0.1); el3.position.x=0; focusG.add(el3); const el4=lensEl(0.44,0.03,-0.03,0.05); el4.position.x=0.22; focusG.add(el4);
  const el5=lensEl(0.4,0.04,0.06,0.03); el5.position.x=0.75; rig.add(el5);
  // sensor with a picture that goes from blurred to sharp
  const sensorBack=new THREE.Mesh(rbox(0.86,0.66,0.05,0.04),new THREE.MeshStandardMaterial({color:0x14301f,metalness:.4,roughness:.5})); sensorBack.rotation.y=-Math.PI/2; sensorBack.position.x=1.42; rig.add(sensorBack);
  const pic=document.createElement('canvas'); pic.width=320; pic.height=240; pic.id='pic0'; document.getElementById('st0').appendChild(pic); const pg=pic.getContext('2d');
  const picTex=new THREE.CanvasTexture(pic); picTex.encoding=THREE.sRGBEncoding;
  const sensor=new THREE.Mesh(new THREE.PlaneGeometry(0.72,0.54),new THREE.MeshBasicMaterial({map:picTex,toneMapped:false})); sensor.rotation.y=-Math.PI/2; sensor.position.x=1.39; rig.add(sensor);
  function drawPic(blur){ pg.filter='blur('+blur.toFixed(1)+'px)'; const gr=pg.createLinearGradient(0,0,0,240); gr.addColorStop(0,'#ff8a3d'); gr.addColorStop(.6,'#ff4b1f'); gr.addColorStop(1,'#2a0f20'); pg.fillStyle=gr; pg.fillRect(-20,-20,360,280);
    pg.fillStyle='#fff3c4'; pg.beginPath(); pg.arc(160,120,34,0,7); pg.fill(); pg.fillStyle='#14080f';
    [[0,170,60,70],[50,140,40,100],[95,155,50,85],[150,125,36,115],[190,150,55,90],[250,135,40,105],[290,165,40,75]].forEach(([x,y,w,h])=>pg.fillRect(x,y,w,h));
    pg.filter='none'; picTex.needsUpdate=true; }
  // rays
  const NR=9, rp=new Float32Array(NR*4*3); const rg=new THREE.BufferGeometry(); rg.setAttribute('position',new THREE.BufferAttribute(rp,3));
  const rm=new THREE.LineBasicMaterial({color:0xffb37a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}); const rays=new THREE.LineSegments(rg,rm); rig.add(rays);
  const fp=new THREE.Mesh(new THREE.SphereGeometry(0.025,16,12),new THREE.MeshBasicMaterial({color:0xffe1c4,toneMapped:false,transparent:true})); rig.add(fp);
  const sensA=new THREE.Object3D(); sensA.position.set(1.42,0.35,0); rig.add(sensA);
  const focA=new THREE.Object3D(); focA.position.set(0.1,0.5,0); focusG.add(focA);
  const frA=new THREE.Object3D(); frA.position.set(-1.15,0.6,0); rig.add(frA);
  SCN[0]=function(lt){
    const asm=easeIO(cl(lt/0.7)); [front,el2,el5].forEach((e,i)=>{ e.position.y=(1-asm)*(0.9-i*0.6); }); barrel.material.opacity=1;
    const f=easeIO(cl((lt-1.15)/1.0)); focusG.position.x=-0.42+0.42*f;
    const fx=0.95+0.47*f; // focal point moves onto the sensor
    for(let i=0;i<NR;i++){ const y=-0.4+0.8*i/(NR-1); const o=i*12; const sx=1.42, sy=(sx-fx)/(fx-(-1.15))*(-y);
      rp.set([-2.6,y,0,-1.15,y,0,-1.15,y,0,sx,sy,0],o); }
    rg.attributes.position.needsUpdate=true; rm.opacity=0.85*cl((lt-0.6)/0.3); fp.position.set(Math.min(fx,1.4),0,0); fp.material.opacity=rm.opacity;
    drawPic(14*(1-f)+0.01);
    rig.rotation.set(0.25,-0.75+0.5*easeIO(cl(lt/3.2)),0); rig.scale.setScalar(0.62); rig.position.set(-0.05,0.1,0);
    cam.position.set(0,0.5,6.6-0.7*ease(lt/3.2)); cam.lookAt(0,0.1,0); P.c.render();
    layoutLabels([['l0_0',frA],['l0_1',focA],['l0_2',sensA]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-[0.7,1.1,1.9][i])/0.2)]),cam,640,150);
    caption(0,lt); };
})();
// ---------- laptop: how a laptop fan keeps the chip cool
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#23262c','#060708');
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.5,th:0.92,dof:true,focus:7,aperture:0.0009,maxblur:0.005});
  const key=new THREE.DirectionalLight(0xffffff,0.9); key.position.set(3,6,5); sc.add(key);
  const alu=new THREE.MeshPhysicalMaterial({color:0x7d8289,metalness:1,roughness:.38,envMapIntensity:.32});
  const aluDark=new THREE.MeshPhysicalMaterial({color:0x3a3e44,metalness:.9,roughness:.5,envMapIntensity:.14});
  const black=new THREE.MeshPhysicalMaterial({color:0x0b0b0c,roughness:.55,metalness:.1});
  const flat=(g)=>{ g.rotateX(-Math.PI/2); return g; };
  const lap=new THREE.Group(); sc.add(lap);
  // bottom case
  const bottom=new THREE.Mesh(flat(rbox(3.0,2.1,0.07,0.14,6)),alu); bottom.position.y=0.035; lap.add(bottom);
  const inner=new THREE.Mesh(flat(rbox(2.86,1.96,0.01,0.1)),aluDark); inner.position.y=0.072; lap.add(inner);
  // internals
  const internals=new THREE.Group(); internals.position.y=0.08; lap.add(internals);
  const pcb=new THREE.Mesh(flat(rbox(1.5,0.8,0.02,0.05)),new THREE.MeshStandardMaterial({color:0x10241c,roughness:.5,metalness:.3})); pcb.position.set(-0.35,0.01,-0.45); internals.add(pcb);
  for(let i=0;i<22;i++){ const c=new THREE.Mesh(new THREE.BoxGeometry(0.05+((i*37)%5)*0.02,0.02,0.04+((i*13)%4)*0.02),new THREE.MeshStandardMaterial({color:i%4?0x1b1c1f:0xc9a44c,metalness:.8,roughness:.3}));
    c.position.set(-1.0+((i*53)%120)/100,0.03,-0.75+((i*29)%60)/100); internals.add(c); }
  const chipMat=new THREE.MeshPhysicalMaterial({color:0x1a1b1e,metalness:.9,roughness:.25,emissive:0xff5a14,emissiveIntensity:0});
  const chip=new THREE.Mesh(flat(rbox(0.36,0.36,0.04,0.03)),chipMat); chip.position.set(-0.35,0.04,-0.45); internals.add(chip);
  const copper=new THREE.MeshPhysicalMaterial({color:0xc8794a,metalness:1,roughness:.28,emissive:0xff4a10,emissiveIntensity:0});
  const pipePts=[new THREE.Vector3(-0.35,0.07,-0.45),new THREE.Vector3(0.1,0.07,-0.55),new THREE.Vector3(0.55,0.07,-0.75),new THREE.Vector3(0.95,0.07,-0.82)];
  const pipe=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pipePts),60,0.035,16,false),copper); internals.add(pipe);
  const pipeA=new THREE.Object3D(); pipeA.position.set(0.3,0.07,-0.66); internals.add(pipeA);
  const fanG=new THREE.Group(); fanG.position.set(0.95,0.06,-0.45); internals.add(fanG);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(0.34,0.03,16,60),black); ring.rotation.x=Math.PI/2; fanG.add(ring);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.05,40),black); fanG.add(hub);
  const blades=new THREE.Group(); fanG.add(blades);
  for(let i=0;i<13;i++){ const b=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.035,0.05),new THREE.MeshPhysicalMaterial({color:0x1c1d20,roughness:.35,clearcoat:.6}));
    const a=i/13*Math.PI*2; b.position.set(Math.cos(a)*0.2,0,Math.sin(a)*0.2); b.rotation.y=-a+0.6; blades.add(b); }
  const fins=new THREE.Group(); fins.position.set(0.95,0.06,-0.9); internals.add(fins);
  for(let i=0;i<18;i++){ const f=new THREE.Mesh(new THREE.BoxGeometry(0.012,0.09,0.16),copper); f.position.x=-0.35+i*0.041; fins.add(f); }
  const cellMat=new THREE.MeshPhysicalMaterial({color:0x1d2026,metalness:.3,roughness:.55,envMapIntensity:.18});
  for(let r=0;r<2;r++) for(let c=0;c<3;c++){ const cell=new THREE.Mesh(flat(rbox(0.82,0.42,0.05,0.04)),cellMat); cell.position.set(-0.92+c*0.9,0.03,0.28+r*0.5); internals.add(cell); }
  // deck (top case with keyboard) + lid on a hinge
  const deck=new THREE.Group(); lap.add(deck);
  const deckM=new THREE.Mesh(flat(rbox(3.0,2.1,0.035,0.14,6)),alu); deckM.position.y=0; deck.add(deckM);
  const kw=0.165,kg=0.03; const keyG=flat(rbox(kw,kw,0.025,0.025,3)); const keys=new THREE.InstancedMesh(keyG,black,80); let n=0; const m4=new THREE.Matrix4();
  for(let r=0;r<5;r++) for(let c=0;c<13;c++){ m4.makeTranslation(-1.17+c*(kw+kg),0.025,-0.82+r*(kw+kg)); keys.setMatrixAt(n++,m4); }
  keys.count=n; deck.add(keys);
  const space=new THREE.Mesh(flat(rbox(0.95,kw,0.025,0.025,3)),black); space.position.set(0,0.025,-0.82+5*(kw+kg)); deck.add(space);
  const pad=new THREE.Mesh(flat(rbox(1.1,0.6,0.004,0.06)),new THREE.MeshPhysicalMaterial({color:0x7d8288,metalness:1,roughness:.22})); pad.position.set(0,0.019,0.6); deck.add(pad);
  const hinge=new THREE.Group(); hinge.position.set(0,0.02,-1.05); deck.add(hinge);
  const lidM=new THREE.Mesh(rbox(3.0,2.0,0.035,0.14,6),alu); lidM.position.set(0,1.0,-0.02); hinge.add(lidM);
  const scrTex=canvasTex(1024,680,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#1a1036'); gr.addColorStop(.5,'#ff5a2a'); gr.addColorStop(1,'#2a0f4a'); g.fillStyle=gr; g.fillRect(0,0,w,h);
    for(let i=0;i<6;i++){ g.strokeStyle='rgba(255,255,255,'+(0.06+i*0.03)+')'; g.lineWidth=40-i*5; g.beginPath(); g.moveTo(-50,h*0.35+i*60); g.bezierCurveTo(w*0.3,h*0.1+i*40,w*0.6,h*0.9-i*30,w+50,h*0.4+i*50); g.stroke(); }
    g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(0,0,w,26); });
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(2.8,1.82),new THREE.MeshBasicMaterial({map:scrTex,toneMapped:false}));
  scr.position.set(0,1.0,0.0); hinge.add(scr);
  const bez=new THREE.Mesh(new THREE.PlaneGeometry(2.92,1.92),new THREE.MeshBasicMaterial({color:0x050505})); bez.position.set(0,1.0,-0.001); hinge.add(bez);
  const sh=shadowPlane(5,5,.7); sh.position.y=-0.01; lap.add(sh);
  // air particles
  const NA=260, ap=new Float32Array(NA*3); const ag=new THREE.BufferGeometry(); ag.setAttribute('position',new THREE.BufferAttribute(ap,3));
  const am=new THREE.PointsMaterial({color:0x6fb6ff,size:0.035,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}); const air=new THREE.Points(ag,am); internals.add(air);
  const LB=[chip,pipe,fanG,fins]; const hot=new THREE.Color(0xff5a14), cool=new THREE.Color(0x5aa8ff);
  SCN[1]=function(lt){
    const open=easeIO(cl((lt-0.05)/0.75)); hinge.rotation.x=-Math.PI/2+open*(Math.PI/2+0.32);
    const lift=easeIO(cl((lt-0.85)/0.7)); deck.position.y=0.07+lift*5.0; deck.position.z=-lift*1.6; deck.rotation.x=-0.12*lift;
    const heat=cl((lt-1.2)/0.35), coolT=easeIO(cl((lt-1.9)/0.9));
    chipMat.emissive.copy(hot).lerp(cool,coolT); chipMat.emissiveIntensity=heat*(3.2-1.8*coolT);
    copper.emissiveIntensity=heat*0.35*(1-coolT);
    const spin=cl((lt-1.5)/0.6); blades.rotation.y=-(lt*lt)*9*spin;
    am.opacity=0.85*cl((lt-1.7)/0.3);
    for(let i=0;i<NA;i++){ const s=((i*0.6180339)%1); const u=((lt-1.7)*0.9+s)%1; const a=(i*2.399)%6.283; const r=0.28*Math.sqrt(((i*0.381966)%1));
      ap[i*3]=0.95+Math.cos(a)*r*(1-u)+(((i*0.7548)%1)-0.5)*0.75*u; ap[i*3+1]=0.08+Math.sin(a)*0.03+u*0.25*((i*0.31)%1); ap[i*3+2]=-0.45-u*1.3; }
    ag.attributes.position.needsUpdate=true;
    lap.rotation.y=-0.36+0.22*cl(lt/3.2); lap.scale.setScalar(0.47); lap.position.x=0.05;
    const cv=easeIO(cl((lt-0.7)/1.0));
    cam.position.set(0.0,1.0+2.7*cv,6.6-2.9*cv); cam.lookAt(0.1,0.45-0.55*cv,-0.25*cv);
    if(P.bk) P.bk.uniforms['focus'].value=cam.position.distanceTo(new THREE.Vector3(0,0.3,0));
    P.c.render();
    layoutLabels([['l1_0',chip],['l1_1',pipeA]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-1.55-i*0.14)/0.2)]),cam,70,150);
    layoutLabels([['l1_3',fins],['l1_2',fanG]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-1.83-i*0.14)/0.2)]),cam,770,150);
    caption(1,lt); };
})();
// ---------- hero-3d: a landing page builds itself, glass 3D shape in the hero
(function(){ const cv=document.getElementById('hc2'); const ren=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,preserveDrawingBuffer:true});
  ren.setPixelRatio(1); ren.setSize(900,760,false); ren.outputEncoding=THREE.sRGBEncoding; ren.toneMapping=THREE.ACESFilmicToneMapping; ren.toneMappingExposure=0.9;
  const sc=new THREE.Scene(); sc.environment=hdrEnv(ren);
  const cam=new THREE.PerspectiveCamera(30,900/760,0.1,50); cam.position.set(0,0,6.2); cam.lookAt(0,0,0);
  // backdrop gradient blobs behind the glass (so refraction shows colour)
  const bgT=canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#0a0b10'; g.fillRect(0,0,w,h);
    [[150,170,190,'#ff4b1f'],[360,300,210,'#5b3cff'],[250,420,170,'#00b3ff']].forEach(([x,y,r,c])=>{ const gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,c); gr.addColorStop(1,'rgba(10,11,16,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); }); });
  const back=new THREE.Mesh(new THREE.PlaneGeometry(9,7.6),new THREE.MeshBasicMaterial({map:bgT,toneMapped:false})); back.position.z=-2.5; sc.add(back);
  const geo=new THREE.TorusKnotGeometry(0.85,0.32,260,48,2,3); const base=geo.attributes.position.array.slice();
  const glass=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:0.05,transmission:1,thickness:1.2,ior:1.45,envMapIntensity:1.2,clearcoat:1,clearcoatRoughness:0.03,attenuationColor:new THREE.Color(0xd9e6ff),attenuationDistance:2.5});
  const knot=new THREE.Mesh(geo,glass); sc.add(knot);
  const rim=new THREE.DirectionalLight(0xffffff,1.2); rim.position.set(2,3,4); sc.add(rim);
  const pos=geo.attributes.position;
  SCN[2]=function(lt){
    const a=easeIO(cl((lt-0.2)/0.8)); knot.scale.setScalar(0.2+0.8*a); knot.rotation.set(0.4+lt*0.35,lt*0.6,0.2);
    for(let i=0;i<pos.count;i++){ const x=base[i*3],y=base[i*3+1],z=base[i*3+2]; const k=1+0.06*Math.sin(x*2.2+lt*2.5)*Math.sin(y*2.0+lt*1.7); pos.setXYZ(i,x*k,y*k,z*k); }
    pos.needsUpdate=true; geo.computeVertexNormals();
    back.position.x=0.3*Math.sin(lt*0.8); ren.render(sc,cam);
    // page build (HTML)
    const set=(id,t0,d,fn)=>{ const e=document.getElementById(id); const v=cl((lt-t0)/d); fn(e,v); };
    set('hn2',0.05,0.35,(e,v)=>{ e.style.opacity=v; e.style.transform='translateY('+(-30*(1-ease(v)))+'px)'; });
    set('hb2',0.0,0.3,(e,v)=>{ e.style.opacity=v; });
    const H='Think faster with Nova.'; const hv=cl((lt-0.45)/0.7); document.getElementById('hh2').textContent=H.slice(0,Math.round(H.length*hv));
    set('hs2',1.15,0.35,(e,v)=>{ e.style.opacity=v; e.style.transform='translateY('+(20*(1-ease(v)))+'px)'; });
    set('hcta2',1.4,0.4,(e,v)=>{ e.style.opacity=v; e.style.transform='scale('+(0.7+0.3*ease(v))+')'; });
    [0,1,2].forEach(i=>set('hf2_'+i,1.8+i*0.15,0.45,(e,v)=>{ e.style.opacity=v; e.style.transform='translateY('+(80*(1-ease(v)))+'px)'; }));
    set('hcur2',1.95,0.6,(e,v)=>{ e.style.opacity=v>0?1:0; e.style.transform='translate('+(-160*(1-easeIO(v)))+'px,'+(120*(1-easeIO(v)))+'px)'; });
    const pr=cl((lt-2.6)/0.12); document.getElementById('hcta2').style.filter='brightness('+(1+0.4*Math.sin(pr*Math.PI))+')';
    const sv=easeIO(cl((lt-2.7)/0.5)); document.getElementById('hpage2').style.transform='translateY('+(-260*sv)+'px)';
    caption(2,lt); };
})();
