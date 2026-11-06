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

// ---------- S0 /explain-3d how an SSD stores data: SSD stick, data pulses run connector -> controller -> flash chips; zoom into a chip:
// a grid of tiny memory cells, electrons get trapped in cells (lit = stored), no moving parts
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#1d2a3a','#05070a'); ren.toneMappingExposure=0.5;
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.02,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.75,radius:0.5,th:0.85});
  const key=new THREE.DirectionalLight(0xffffff,0.7); key.position.set(3,6,4); sc.add(key);
  const G=new THREE.Group(); G.rotation.y=-0.35; sc.add(G);
  const pcbTex=canvasTex(1024,256,(g,w,h)=>{ g.fillStyle='#0d3b2a'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(120,220,170,.35)'; g.lineWidth=2; const r=rnd(9);
    for(let i=0;i<70;i++){ let x=r()*w, y=r()*h; g.beginPath(); g.moveTo(x,y); for(let k=0;k<3;k++){ if(r()<.5) x+=(r()-.5)*220; else y+=(r()-.5)*120; g.lineTo(x,y); } g.stroke(); } });
  const pcb=new THREE.Mesh(rbox(4.4,1.1,0.06,0.05),new THREE.MeshStandardMaterial({color:0x14553c,roughness:.7,metalness:.1,envMapIntensity:0.35})); pcb.rotation.x=-Math.PI/2; G.add(pcb);
  const gold=new THREE.MeshPhysicalMaterial({color:0xe8b24a,metalness:1,roughness:.2});
  for(let i=0;i<22;i++){ const f=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.012,0.03),gold); f.position.set(2.08,0.032,-0.47+i*0.045); G.add(f); }
  const chipM=new THREE.MeshStandardMaterial({color:0x0e0f12,roughness:.45,metalness:.2,envMapIntensity:0.4,transparent:true,opacity:1});
  const ctrl=new THREE.Mesh(rbox(0.62,0.62,0.09,0.04),chipM.clone()); ctrl.rotation.x=-Math.PI/2; ctrl.position.set(1.25,0.075,0); G.add(ctrl);
  const ctrlDot=new THREE.Mesh(new THREE.CircleGeometry(0.05,24),glowMat(0x48c8ff,0.0)); ctrlDot.rotation.x=-Math.PI/2; ctrlDot.position.set(1.25,0.122,0); G.add(ctrlDot);
  const chips=[]; [0.1,-1.3].forEach(x=>{ const c=new THREE.Mesh(rbox(0.95,0.8,0.1,0.04),chipM.clone()); c.rotation.x=-Math.PI/2; c.position.set(x,0.08,0); G.add(c); chips.push(c); });
  const chipE=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.95,0.1,0.8)),new THREE.LineBasicMaterial({color:0x8fe3ff,transparent:true,opacity:0,toneMapped:false})); chipE.position.set(0.1,0.08,0); G.add(chipE);
  const smd=new THREE.MeshStandardMaterial({color:0x8a7a62,roughness:.5,metalness:.4}); const R=rnd(4); const SM=new THREE.Group(); G.add(SM);
  for(let i=0;i<26;i++){ const s=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.03,0.03),smd); s.position.set(-2.0+R()*3.6,0.045,(R()<.5?-1:1)*(0.43+R()*0.06)); SM.add(s); }
  // data path: connector -> controller -> chips
  const route=new THREE.CatmullRomCurve3([new THREE.Vector3(2.15,0.05,0.05),new THREE.Vector3(1.6,0.06,0.05),new THREE.Vector3(1.25,0.13,0),new THREE.Vector3(0.7,0.08,0.1),new THREE.Vector3(0.1,0.15,0.05)]);
  const NP=18, parts=[]; for(let i=0;i<NP;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.022,10,8),glowMat(0x58d6ff,0)); G.add(m); parts.push(m); }
  // magnified cells: rises out of the first chip
  const Z=new THREE.Group(); Z.position.set(0.1,0.13,0); G.add(Z);
  const NX=7, NY=5, NZ=6, cs=0.085, gap=0.035; const cellG=rbox(cs,cs,cs,0.012);
  const cells=new THREE.InstancedMesh(cellG,new THREE.MeshStandardMaterial({color:0x2c323c,metalness:.2,roughness:.55,envMapIntensity:0.35,transparent:true,opacity:0.55}),NX*NY*NZ);
  const glowC=new THREE.InstancedMesh(new THREE.BoxGeometry(cs*0.62,cs*0.62,cs*0.62),new THREE.MeshBasicMaterial({color:0x58d6ff,toneMapped:false}),NX*NY*NZ);
  const M4=new THREE.Matrix4(), bits=[]; let n=0; const RB=rnd(21);
  for(let i=0;i<NX;i++) for(let j=0;j<NY;j++) for(let k=0;k<NZ;k++){ M4.makeTranslation((i-(NX-1)/2)*(cs+gap),j*(cs+gap)+cs/2,(k-(NZ-1)/2)*(cs+gap)); cells.setMatrixAt(n,M4); cells.setColorAt(n,new THREE.Color(0x39414d)); bits.push(RB()<.5?1:0); n++; }
  Z.add(cells); Z.add(glowC); const M5=new THREE.Matrix4(), Sv=new THREE.Vector3(), Qi=new THREE.Quaternion();
  const layerM=new THREE.MeshBasicMaterial({color:0x58d6ff,transparent:true,opacity:0.0,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
  const NE=46, el=[], RE=rnd(33); for(let i=0;i<NE;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.014,8,6),glowMat(0x9fe8ff,0)); Z.add(m);
    const tgt=Math.floor(RE()*(NX*NY*NZ)); el.push({m,tgt,d:RE()*0.9,x0:(RE()-.5)*0.9,z0:(RE()-.5)*0.9}); }
  const aCtrl=new THREE.Object3D(); aCtrl.position.set(1.25,0.12,0.2); G.add(aCtrl);
  const aChip=new THREE.Object3D(); aChip.position.set(-1.3,0.13,0.25); G.add(aChip);
  const aCell=new THREE.Object3D(); aCell.position.set(0.32,0.45,0.25); Z.add(aCell); const aBit=new THREE.Object3D(); aBit.position.set(-0.3,0.2,0.25); Z.add(aBit);
  const shd=shadowPlane(6,2.4,.7); shd.position.y=-0.04; G.add(shd);
  const cpos=(i,j,k)=>new THREE.Vector3((i-(NX-1)/2)*(cs+gap),j*(cs+gap)+cs/2,(k-(NZ-1)/2)*(cs+gap));
  SCN[0]=function(lt){ const flow=cl(lt/0.25)*(1-cl((lt-1.1)/0.3));
    parts.forEach((m,i)=>{ const u=(i/NP+lt*0.9)%1; m.position.copy(route.getPointAt(u)); m.material.opacity=flow; });
    ctrlDot.material.opacity=0.4+0.6*Math.abs(Math.sin(lt*9));
    const zin=easeIO(cl((lt-0.85)/1.0)); const op=cl((lt-1.0)/0.4);
    chips[0].material.opacity=1-0.85*op; chips[0].material.depthWrite=op<0.05; chipE.material.opacity=0.6*op;
    Z.visible=lt>0.95; const far2=lt>1.45; SM.visible=!far2; ctrl.visible=ctrlDot.visible=chips[1].visible=!far2; const zs=0.25+0.75*easeOut2(cl((lt-0.95)/0.6)); Z.scale.setScalar(zs); Z.position.y=0.13+0.0*zs;
    // fill cells: electrons fly in from below and get trapped; trapped cells glow
    n=0; for(let i=0;i<NX;i++) for(let j=0;j<NY;j++) for(let k=0;k<NZ;k++){ const fillT=1.35+((i*NY+j)*NZ+k)/(NX*NY*NZ)*1.2; const on=bits[n]&&lt>fillT;
      const g=bits[n]?cl((lt-fillT)/0.15):0; const pp=cpos(i,j,k); M5.compose(pp,Qi,Sv.set(g||0.0001,g||0.0001,g||0.0001)); glowC.setMatrixAt(n,M5); n++; } glowC.instanceMatrix.needsUpdate=true;
    el.forEach(e=>{ const t0=1.3+e.d*1.2, u=cl((lt-t0)/0.45); const tg=e.tgt, i=Math.floor(tg/(NY*NZ)), j=Math.floor(tg/NZ)%NY, k=tg%NZ; const p=cpos(i,j,k);
      e.m.position.set(e.x0+(p.x-e.x0)*ease(u),-0.08+(p.y+0.08)*ease(u),e.z0+(p.z-e.z0)*ease(u)); e.m.material.opacity=(lt>t0?1:0)*(1-0.6*cl((u-0.95)/0.05)); });
    const far=new THREE.Vector3(1.4,4.6,6.4), near=new THREE.Vector3(1.05,1.7,2.35); cam.position.lerpVectors(far,near,zin);
    const look=new THREE.Vector3(0.25,0,0).lerp(new THREE.Vector3(0.05,0.3,0),zin); cam.position.x+=Math.sin(lt*0.6)*0.15; cam.lookAt(look); P.c.render();
    layoutLabels([['l0_0',aCtrl,cl((lt-0.25)/0.2)*(1-cl((lt-1.0)/0.2))],['l0_1',aChip,cl((lt-0.5)/0.2)*(1-cl((lt-1.0)/0.2))],['l0_2',aCell,cl((lt-1.55)/0.2)],['l0_3',aBit,cl((lt-1.95)/0.2)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,640,130);
    caption(0,lt); };
  function easeOut2(x){ return 1-Math.pow(1-x,4); }
})();

// ---------- S1 /x-ray an e-bike: scan line turns the bike into an x-ray: battery in the down tube, controller, hub motor in the rear wheel,
// pedal sensor at the cranks; energy flows battery -> controller -> motor while the cranks turn
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#13283f','#03060b'); ren.localClippingEnabled=true;
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.7,radius:0.55,th:0.82});
  const key=new THREE.DirectionalLight(0xffffff,1.2); key.position.set(3,6,5); sc.add(key);
  const scanP=new THREE.Plane(new THREE.Vector3(-1,0,0),3), scanX=new THREE.Plane(new THREE.Vector3(1,0,0),-3);
  const paintM=new THREE.MeshPhysicalMaterial({color:0x1d6fd1,metalness:.5,roughness:.28,clearcoat:1,clearcoatRoughness:.08,clippingPlanes:[scanP]});
  const xm=new THREE.ShaderMaterial({uniforms:{col:{value:new THREE.Color(0x5fd0ff)},op:{value:1}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,clipping:true,clippingPlanes:[scanX],
    vertexShader:'#include <clipping_planes_pars_vertex>\nvarying vec3 vN; varying vec3 vV; void main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mvPosition.xyz); gl_Position=projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}',
    fragmentShader:'#include <clipping_planes_pars_fragment>\nuniform vec3 col; uniform float op; varying vec3 vN; varying vec3 vV; void main(){\n#include <clipping_planes_fragment>\n float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.2); gl_FragColor=vec4(col*(0.06+1.2*f)*op,1.); }'});
  const B=new THREE.Group(); sc.add(B);
  function shell(m){ const x=new THREE.Mesh(m.geometry,xm); x.position.copy(m.position); x.quaternion.copy(m.quaternion); x.scale.copy(m.scale); m.material=paintM; B.add(m); B.add(x); return m; }
  const BB=[0,0.38,0], HT=[0.66,1.18,0], ST=[-0.36,1.28,0], RH=[-1.02,0.56,0], FH=[1.02,0.56,0];
  shell(tubeBetween(HT,BB,0.085,paintM)); // fat down tube (battery inside)
  shell(tubeBetween([0.6,1.32,0],ST,0.04,paintM)); shell(tubeBetween(BB,[-0.42,1.44,0],0.04,paintM));
  [-0.07,0.07].forEach(z=>{ shell(tubeBetween([0,0.38,z],[RH[0],RH[1],z*1.6],0.025,paintM)); shell(tubeBetween([-0.36,1.26,z],[RH[0],RH[1],z*1.6],0.022,paintM)); shell(tubeBetween([0.62,1.28,z],[FH[0],FH[1],z*1.6],0.03,paintM)); });
  shell(tubeBetween([0.6,1.12,0],[0.7,1.38,0],0.05,paintM));
  const bbBox=new THREE.Mesh(rbox(0.36,0.26,0.2,0.08),paintM); bbBox.position.set(0.02,0.4,0); shell(bbBox); // motor-side housing: controller + sensor inside
  const hubS=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.16,40),paintM); hubS.rotation.x=Math.PI/2; hubS.position.set(...RH); shell(hubS);
  const dark=new THREE.MeshStandardMaterial({color:0x15171a,roughness:.6}), chrome=new THREE.MeshPhysicalMaterial({color:0xc9ced6,metalness:1,roughness:.25});
  const bar=tubeBetween([0.72,1.4,-0.32],[0.72,1.4,0.32],0.02,dark); B.add(bar);
  const seat=new THREE.Mesh(rbox(0.36,0.1,0.13,0.05),dark); seat.position.set(-0.45,1.5,0); B.add(seat);
  // wheels
  const wheels=[]; [RH,FH].forEach(c=>{ const w=new THREE.Group(); w.position.set(...c); const t=new THREE.Mesh(new THREE.TorusGeometry(0.55,0.045,16,80),dark); w.add(t);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(0.5,0.014,8,80),chrome); w.add(rim); for(let q=0;q<16;q++){ const s=new THREE.Mesh(new THREE.BoxGeometry(0.006,0.5,0.006),chrome); s.geometry.translate(0,0.25,0); s.rotation.z=q*Math.PI/8; w.add(s); } B.add(w); wheels.push(w); });
  // insides
  const cellM=new THREE.MeshStandardMaterial({color:0xffffff,metalness:.5,roughness:.35}); const NC=16;
  const cells=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03,0.03,0.11,12),cellM,NC); const dA=new THREE.Vector3(...HT), dB=new THREE.Vector3(...BB);
  const dq=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dB.clone().sub(dA).normalize());
  for(let i=0;i<NC;i++){ const u=0.14+0.72*Math.floor(i/2)/7; const p=dA.clone().lerp(dB,u); p.z=(i%2?0.033:-0.033); cells.setMatrixAt(i,new THREE.Matrix4().compose(p,dq,new THREE.Vector3(1,1,1))); cells.setColorAt(i,new THREE.Color(0x4a5866)); } B.add(cells);
  const ctrl=new THREE.Mesh(rbox(0.16,0.1,0.08,0.02),new THREE.MeshPhysicalMaterial({color:0x8a96a6,metalness:1,roughness:.3,emissive:0x2fbfff,emissiveIntensity:0})); ctrl.position.set(0.07,0.44,0); B.add(ctrl);
  const sensor=new THREE.Mesh(new THREE.TorusGeometry(0.075,0.016,10,40),new THREE.MeshStandardMaterial({color:0x666666,emissive:0x3dffb0,emissiveIntensity:0})); sensor.position.set(-0.06,0.38,0.0); B.add(sensor);
  const crank=new THREE.Group(); crank.position.set(...BB); B.add(crank);
  [-1,1].forEach(s=>{ const arm=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.34,0.03),chrome); arm.geometry.translate(0,-0.17,0); arm.position.z=s*0.14; arm.rotation.z=s>0?0:Math.PI; crank.add(arm);
    const ped=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.03,0.12),dark); ped.position.set(0,s>0?-0.34:0.34,s*0.2); crank.add(ped); });
  const motor=new THREE.Group(); motor.position.set(...RH); B.add(motor);
  const coilM=new THREE.MeshStandardMaterial({color:0xc56a2d,metalness:1,roughness:.3,emissive:0xff6a1f,emissiveIntensity:0});
  for(let k=0;k<10;k++){ const c=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.07,0.1),coilM); const h=new THREE.Group(); h.rotation.z=k*Math.PI/5; c.position.y=0.11; h.add(c); motor.add(h); }
  const axle=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.24,12),chrome); axle.rotation.x=Math.PI/2; motor.add(axle);
  const path=new THREE.CatmullRomCurve3([new THREE.Vector3(0.5,1.0,0.06),new THREE.Vector3(0.26,0.7,0.06),new THREE.Vector3(0.07,0.46,0.06),new THREE.Vector3(-0.4,0.48,0.08),new THREE.Vector3(-1.02,0.56,0.1)]);
  const hv=new THREE.Mesh(new THREE.TubeGeometry(path,80,0.012,8,false),new THREE.MeshStandardMaterial({color:0xff6a1f,emissive:0xff4b1f,emissiveIntensity:0,roughness:.5})); B.add(hv);
  const NP=22, parts=[]; for(let i=0;i<NP;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.026,10,8),glowMat(0xffa040,0)); B.add(m); parts.push(m); }
  const scan=new THREE.Mesh(new THREE.PlaneGeometry(1.4,2.2),glowMat(0x7fe6ff,0)); scan.rotation.y=Math.PI/2; scan.position.y=0.9; sc.add(scan);
  const scanL=new THREE.Mesh(new THREE.BoxGeometry(0.015,1.9,1.2),glowMat(0xbff4ff,0)); scanL.position.y=0.9; sc.add(scanL);
  const grid=new THREE.GridHelper(14,28,0x2e6f99,0x173247); grid.material.transparent=true; grid.material.opacity=.5; sc.add(grid);
  const shd=shadowPlane(4,1.4,.75); shd.position.y=0.005; sc.add(shd);
  const aBat=new THREE.Object3D(); aBat.position.set(0.4,0.86,0.08); B.add(aBat);
  const aCtl=new THREE.Object3D(); aCtl.position.set(0.1,0.48,0.08); B.add(aCtl);
  const aMot=new THREE.Object3D(); aMot.position.set(-1.0,0.66,0.12); B.add(aMot);
  const aSen=new THREE.Object3D(); aSen.position.set(-0.1,0.34,0.1); B.add(aSen);
  SCN[1]=function(lt){ const s=1.9-3.8*easeIO(cl((lt-0.05)/0.85)); scanP.constant=s; scanX.constant=-s; scan.position.x=s; scanL.position.x=s;
    const sv=cl(lt/0.12)*(1-cl((lt-0.85)/0.15)); scan.material.opacity=0.12*sv; scanL.material.opacity=0.9*sv;
    const ped=cl((lt-0.9)/0.3), flow=cl((lt-1.25)/0.3);
    crank.rotation.z=-lt*3.2*ped-lt*0.3; sensor.material.emissiveIntensity=ped*(1.2+0.6*Math.sin(lt*14));
    wheels.forEach(w=>w.rotation.z=-lt*(1.2+3.5*flow)); motor.rotation.z=-lt*(1.2+3.5*flow);
    parts.forEach((m,i)=>{ const u=(i/NP+lt*0.6)%1; m.position.copy(path.getPointAt(u)); m.material.opacity=flow*0.95; m.scale.setScalar(1+0.5*Math.sin(u*Math.PI)); });
    hv.material.emissiveIntensity=0.2+1.0*flow; coilM.emissiveIntensity=flow*1.5; ctrl.material.emissiveIntensity=flow*(0.6+0.4*Math.sin(lt*20));
    for(let i=0;i<NC;i++){ const v=0.5+0.5*Math.sin(lt*6-i*0.6); cells.setColorAt(i,lerpC(0x4a5866,0xff8a3d,0.7*flow*v+0.15*cl((lt-0.8)/0.2))); } cells.instanceColor.needsUpdate=true;
    const ca=-0.42+0.28*easeIO(cl(lt/3)); const rad=9.7-0.7*ease(lt/3); cam.position.set(Math.sin(ca)*rad,2.3-0.4*ease(lt/3),Math.cos(ca)*rad); cam.lookAt(-0.05,0.95,0); P.c.render();
    layoutLabels([['l1_0',aBat,cl((lt-0.75)/0.2)],['l1_1',aCtl,cl((lt-1.3)/0.2)],['l1_2',aMot,cl((lt-1.55)/0.2)],['l1_3',aSen,cl((lt-1.0)/0.2)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,650,118);
    caption(1,lt); };
})();

// ---------- S2 /explain-3d how a fridge stays cold: the cabinet turns see-through; compressor squeezes the refrigerant (hot, red) through
// the condenser coils on the back (heat leaves), expansion valve, then the evaporator inside (cold, blue) pulls heat out of the food space
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#2a2f38','#07080a'); ren.toneMappingExposure=0.64;
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.05,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.7,radius:0.5,th:0.85});
  const key=new THREE.DirectionalLight(0xffffff,1.2); key.position.set(4,6,5); sc.add(key);
  const shellM=new THREE.MeshPhysicalMaterial({color:0xe9ecef,roughness:.3,metalness:.15,clearcoat:.7,transparent:true,opacity:1,side:THREE.DoubleSide});
  const Fr=new THREE.Group(); sc.add(Fr);
  const body=new THREE.Mesh(rbox(1.2,2.4,1.0,0.08),shellM); body.position.y=1.22; Fr.add(body);
  const bodyE=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2,2.4,1.0)),new THREE.LineBasicMaterial({color:0x9fe0ff,transparent:true,opacity:0,toneMapped:false})); bodyE.position.y=1.22; Fr.add(bodyE);
  const seam=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.015,0.02),new THREE.MeshStandardMaterial({color:0x777c82,transparent:true})); seam.position.set(0,1.62,0.505); Fr.add(seam);
  const handleM=new THREE.MeshPhysicalMaterial({color:0xb9bec5,metalness:1,roughness:.2,transparent:true});
  const h1=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.5,0.05),handleM); h1.position.set(0.48,1.25,0.54); Fr.add(h1); const h2=h1.clone(); h2.position.y=1.95; h2.scale.y=0.5; Fr.add(h2);
  // shelves + a few things inside
  const shelfM=new THREE.MeshPhysicalMaterial({color:0xcfe8ff,transparent:true,opacity:0.25,roughness:.1});
  [0.65,1.1,1.62].forEach(y=>{ const s=new THREE.Mesh(new THREE.BoxGeometry(1.05,0.02,0.85),shelfM); s.position.y=y; Fr.add(s); });
  const food=[[0x3fa34d,-0.25,0.7,0.12],[0xf2c14e,0.2,1.15,0.1],[0xd9534f,-0.2,1.16,0.09],[0xffffff,0.25,0.7,0.1]];
  food.forEach(([c,x,y,r])=>{ const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,0.28,24),new THREE.MeshStandardMaterial({color:c,roughness:.5})); m.position.set(x,y+0.15,0.05); Fr.add(m); });
  // refrigerant loop
  const hotPts=[[0.32,0.32,-0.74],[0.45,0.5,-0.6]]; for(let r=0;r<7;r++){ const y=0.55+r*0.24, x=r%2?-0.45:0.45; hotPts.push([x,y,-0.6]); hotPts.push([-x,y+0.12,-0.6]); }
  hotPts.push([0,2.33,-0.6],[0,2.3,-0.45]);
  const coldPts=[[0,2.3,-0.45],[0,2.22,-0.4]]; for(let r=0;r<4;r++){ const y=2.18-r*0.13, x=r%2?-0.4:0.4; coldPts.push([x,y,-0.4]); coldPts.push([-x,y-0.065,-0.4]); }
  coldPts.push([0.42,1.55,-0.42],[0.42,0.6,-0.45],[0.38,0.32,-0.62],[0.32,0.32,-0.74]);
  const V3=a=>a.map(p=>new THREE.Vector3(...p));
  const hotC=new THREE.CatmullRomCurve3(V3(hotPts),false,'catmullrom',0.15), coldC=new THREE.CatmullRomCurve3(V3(coldPts),false,'catmullrom',0.15);
  const hotM=new THREE.MeshStandardMaterial({color:0x8a3a28,emissive:0xff3d1f,emissiveIntensity:0,metalness:.6,roughness:.3}), coldM=new THREE.MeshStandardMaterial({color:0x2a5a8a,emissive:0x3db8ff,emissiveIntensity:0,metalness:.6,roughness:.3});
  Fr.add(new THREE.Mesh(new THREE.TubeGeometry(hotC,500,0.018,8,false),hotM)); Fr.add(new THREE.Mesh(new THREE.TubeGeometry(coldC,300,0.018,8,false),coldM));
  const comp=new THREE.Group(); comp.position.set(0.3,0.2,-0.78); Fr.add(comp);
  const cb=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.16,0.26,32),new THREE.MeshPhysicalMaterial({color:0x1b1d21,metalness:.6,roughness:.35})); comp.add(cb);
  const cd=new THREE.Mesh(new THREE.SphereGeometry(0.15,32,16,0,Math.PI*2,0,Math.PI/2),cb.material); cd.position.y=0.13; comp.add(cd);
  const valve=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.08,16),new THREE.MeshPhysicalMaterial({color:0xd9ad55,metalness:1,roughness:.25,emissive:0xffffff,emissiveIntensity:0})); valve.rotation.x=Math.PI/2; valve.position.set(0,2.3,-0.52); Fr.add(valve);
  const NPH=26, NPC=18, ph=[], pc=[]; for(let i=0;i<NPH;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),glowMat(0xff7a3d,0)); Fr.add(m); ph.push(m); }
  for(let i=0;i<NPC;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),glowMat(0x7fd8ff,0)); Fr.add(m); pc.push(m); }
  const NH=30, heat=[], RH=rnd(13); for(let i=0;i<NH;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),glowMat(0xff6a2a,0)); Fr.add(m); heat.push({m,x:(RH()-.5)*0.9,y:0.5+RH()*1.15,d:RH()}); }
  const NF=24, frost=[], RF=rnd(17); for(let i=0;i<NF;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.02,8,6),glowMat(0xcff2ff,0)); Fr.add(m); frost.push({m,x:(RF()-.5)*0.9,y:0.5+RF()*1.5,z:(RF()-.5)*0.6,d:RF()}); }
  const shd=shadowPlane(2.6,2.2,.75); shd.position.y=0.005; sc.add(shd);
  
  const aCo=new THREE.Object3D(); aCo.position.set(0.3,0.36,-0.78); Fr.add(aCo);
  const aCd=new THREE.Object3D(); aCd.position.set(-0.3,1.3,-0.62); Fr.add(aCd);
  const aV=new THREE.Object3D(); aV.position.set(0,2.32,-0.52); Fr.add(aV);
  const aEv=new THREE.Object3D(); aEv.position.set(-0.3,2.05,-0.4); Fr.add(aEv);
  SCN[2]=function(lt){ const cut=cl((lt-0.35)/0.45);
    shellM.opacity=1-0.88*cut; shellM.depthWrite=cut<0.05; bodyE.material.opacity=0.5*cut; seam.material.opacity=handleM.opacity=1-0.85*cut; seam.material.transparent=true;
    const run=cl((lt-0.6)/0.3); hotM.emissiveIntensity=1.1*run; coldM.emissiveIntensity=1.1*run; valve.material.emissiveIntensity=0.3*run;
    cb.position.y=0.004*Math.sin(lt*60)*run;
    ph.forEach((m,i)=>{ const u=(i/NPH+lt*0.28)%1; m.position.copy(hotC.getPointAt(u)); m.material.opacity=run; m.material.color.copy(lerpC(0xffb060,0xff4b1f,u)); });
    pc.forEach((m,i)=>{ const u=(i/NPC+lt*0.4)%1; m.position.copy(coldC.getPointAt(u)); m.material.opacity=run; });
    heat.forEach(h=>{ const u=((lt*0.55+h.d)%1); h.m.position.set(h.x,h.y+u*0.5,-0.7-u*0.35); h.m.material.opacity=run*cl(lt-0.9)*0.35*Math.sin(u*Math.PI); });
    frost.forEach(f=>{ const u=((lt*0.4+f.d)%1); f.m.position.set(f.x,f.y-u*0.15,f.z); f.m.material.opacity=run*cl((lt-1.3)/0.3)*0.8*Math.sin(u*Math.PI); });
    const ca=0.55+1.75*easeIO(cl((lt-0.2)/2.4)); const rad=7.6-0.6*ease(lt/3); cam.position.set(Math.sin(ca)*rad,2.7,Math.cos(ca)*rad); cam.lookAt(0,1.25,-0.1); P.c.render();
    layoutLabels([['l2_0',aCo,cl((lt-0.8)/0.2)],['l2_1',aCd,cl((lt-1.15)/0.2)],['l2_2',aV,cl((lt-1.5)/0.2)],['l2_3',aEv,cl((lt-1.85)/0.2)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,640,118);
    caption(2,lt); };
})();
