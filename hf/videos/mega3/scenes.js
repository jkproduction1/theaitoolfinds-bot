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

// ---------- S0 /time-lapse a skyscraper going up: core first, floors follow, crane climbs, glass hung last, sun sweeps, lights on at dusk
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren);
  ren.shadowMap.enabled=true; ren.shadowMap.type=THREE.PCFSoftShadowMap; ren.toneMappingExposure=0.62;
  const sky=canvasTex(16,512,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#2d4a73'); gr.addColorStop(.62,'#9fb6cf'); gr.addColorStop(1,'#d9c7ad'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  const dusk=canvasTex(16,512,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#0b1024'); gr.addColorStop(.6,'#3a2a55'); gr.addColorStop(1,'#ff7a3d'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  const skyM=new THREE.ShaderMaterial({uniforms:{a:{value:sky},b:{value:dusk},t:{value:0}},depthWrite:false,side:THREE.BackSide,
    vertexShader:'varying vec3 p; void main(){ p=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'uniform sampler2D a,b; uniform float t; varying vec3 p; void main(){ float v=clamp(0.5-p.y*1.2,0.,1.); vec3 c=mix(texture2D(a,vec2(.5,1.-v)).rgb,texture2D(b,vec2(.5,1.-v)).rgb,t); gl_FragColor=vec4(c,1.); }'});
  const dome=new THREE.Mesh(new THREE.SphereGeometry(60,32,16),skyM); sc.add(dome);
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.1,200);
  const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.55,th:0.88});
  const hemi=new THREE.HemisphereLight(0xcfe0ff,0x2a2520,0.5); sc.add(hemi);
  const sun=new THREE.DirectionalLight(0xfff0d8,1.8); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:60}); sun.shadow.bias=-0.0005; sc.add(sun); sc.add(sun.target);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:0x4a4845,roughness:.95,envMapIntensity:0.15})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; sc.add(ground);
  const site=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.04,3.2),new THREE.MeshStandardMaterial({color:0x6e6150,roughness:1,envMapIntensity:0.2})); site.position.y=0.02; site.receiveShadow=true; sc.add(site);
  // surrounding city (low blocks, warm windows at dusk)
  const R=rnd(7); const cityM=new THREE.MeshStandardMaterial({color:0x5d636b,roughness:.8,metalness:.1,envMapIntensity:0.35});
  const winTex=canvasTex(64,256,(g,w,h)=>{ g.fillStyle='#000'; g.fillRect(0,0,w,h); const r=rnd(3); for(let y=6;y<h;y+=14) for(let x=4;x<w;x+=12) if(r()<.45){ g.fillStyle='rgb(255,'+(170+r()*60|0)+',90)'; g.fillRect(x,y,7,8); } });
  winTex.wrapS=winTex.wrapT=THREE.RepeatWrapping;
  const cityLit=cityM.clone(); cityLit.emissiveMap=winTex; cityLit.emissive=new THREE.Color(0xffffff); cityLit.emissiveIntensity=0;
  for(let i=0;i<90;i++){ const a=R()*Math.PI*2, r=3.0+R()*16; if(Math.cos(a-0.95)>0.55&&r<12) continue; const x=Math.cos(a)*r, z=Math.sin(a)*r; const h=0.3+R()*R()*2.6; const w=0.6+R()*0.9;
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),cityLit); m.position.set(x,h/2,z); m.castShadow=m.receiveShadow=true; sc.add(m); }
  // the tower
  const N=26, FH=0.24, W=1.7, B=new THREE.Group(); sc.add(B);
  const concrete=new THREE.MeshStandardMaterial({color:0xbdb8ae,roughness:.85});
  const core=new THREE.Mesh(new THREE.BoxGeometry(0.62,1,0.62),concrete); core.castShadow=core.receiveShadow=true; B.add(core);
  const coreTop=new THREE.Object3D(); B.add(coreTop);
  const slabs=[], cols=[], glass=[];
  const gTex=canvasTex(128,32,(g,w,h)=>{ g.fillStyle='#000'; g.fillRect(0,0,w,h); const r=rnd(11); for(let x=0;x<w;x+=8) if(r()<.6){ g.fillStyle='rgb(255,'+(180+r()*60|0)+',110)'; g.fillRect(x+1,3,6,h-6); } });
  const glassM=new THREE.MeshPhysicalMaterial({color:0x3d5a78,metalness:.9,roughness:.06,envMapIntensity:1.1,emissive:0xffffff,emissiveMap:gTex,emissiveIntensity:0});
  for(let i=0;i<N;i++){ const y=i*FH;
    const s=new THREE.Mesh(new THREE.BoxGeometry(W,0.045,W),concrete); s.position.y=y+FH; s.castShadow=s.receiveShadow=true; B.add(s); slabs.push(s);
    const cg=new THREE.Group(); [[-1,-1],[1,-1],[-1,1],[1,1],[0,-1],[0,1],[-1,0],[1,0]].forEach(([a,b])=>{ const c=new THREE.Mesh(new THREE.BoxGeometry(0.07,FH,0.07),concrete); c.position.set(a*(W/2-0.06),y+FH/2,b*(W/2-0.06)); c.castShadow=true; cg.add(c); }); B.add(cg); cols.push(cg);
    const gl=new THREE.Mesh(new THREE.BoxGeometry(W+0.02,FH-0.04,W+0.02),glassM); gl.position.y=y+FH/2+0.02; gl.castShadow=true; B.add(gl); glass.push(gl); }
  const spire=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.05,1.1,8),new THREE.MeshStandardMaterial({color:0xdadde2,metalness:.8,roughness:.3})); B.add(spire);
  const beacon=new THREE.Mesh(new THREE.SphereGeometry(0.05,12,8),glowMat(0xff3b2f,0)); B.add(beacon);
  // tower crane (lattice look from edges)
  const yel=new THREE.MeshStandardMaterial({color:0xf2b705,roughness:.5,metalness:.2});
  const C=new THREE.Group(); C.position.set(0.15,0,0.15); B.add(C);
  const mastG=new THREE.BoxGeometry(0.12,1,0.12); mastG.translate(0,0.5,0); const mast=new THREE.Mesh(mastG,yel); mast.castShadow=true; C.add(mast);
  const mastE=new THREE.LineSegments(new THREE.EdgesGeometry(mastG),new THREE.LineBasicMaterial({color:0x6b5200})); mast.add(mastE);
  const head=new THREE.Group(); C.add(head);
  const jib=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.08,0.08),yel); jib.position.x=0.95; jib.castShadow=true; head.add(jib);
  const cj=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.16,0.14),new THREE.MeshStandardMaterial({color:0x555b63,roughness:.6})); cj.position.x=-0.55; head.add(cj);
  const cab=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,0.12),yel); cab.position.set(0.12,-0.08,0.1); head.add(cab);
  const apex=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.4,4),yel); apex.position.y=0.25; head.add(apex);
  const cable=new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,1,4),new THREE.MeshBasicMaterial({color:0x222222})); head.add(cable);
  const load=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.06,0.12),new THREE.MeshStandardMaterial({color:0x9b4a2a,roughness:.6})); load.castShadow=true; head.add(load);
  const jibTip=new THREE.Object3D(); jibTip.position.x=2.0; head.add(jibTip);
  const facadeA=new THREE.Object3D(); B.add(facadeA);
  SCN[0]=function(lt){ const p=easeIO(cl((lt-0.1)/2.35));
    const coreH=Math.max(0.05,cl(p*1.18)*(N*FH+0.25)); core.scale.y=coreH; core.position.y=coreH/2; coreTop.position.y=coreH;
    const fl=cl((p-0.06)/0.94)*N, gf=cl((p-0.3)/0.7)*N;
    for(let i=0;i<N;i++){ const a=cl(fl-i); slabs[i].visible=cols[i].visible=a>0; slabs[i].scale.set(0.6+0.4*ease(a),1,0.6+0.4*ease(a)); cols[i].scale.y=Math.max(0.01,a); cols[i].position.y=(i*FH)*(1-a)*0;
      const b=cl(gf-i); glass[i].visible=b>0.02; glass[i].scale.set(1,Math.max(0.02,ease(b)),1); }
    const top=Math.max(coreH,fl*FH)+0.05; C.position.y=0; mast.scale.y=top+0.9; head.position.y=top+0.9; head.rotation.y=0.6+lt*1.1;
    const drop=0.35+0.3*Math.sin(lt*3); cable.scale.y=drop; cable.position.set(1.7,-drop/2,0); load.position.set(1.7,-drop-0.03,0);
    const done=cl((lt-2.2)/0.3); C.visible=done<1; C.scale.setScalar(1-0.0*done);
    spire.visible=gf>N-0.5; spire.position.y=N*FH+0.55; beacon.position.y=N*FH+1.12;
    const lit=cl((lt-1.9)/0.7); glassM.emissiveIntensity=1.1*lit; cityLit.emissiveIntensity=1.0*lit; beacon.material.opacity=lit*(0.6+0.4*Math.sin(lt*12));
    skyM.uniforms.t.value=lit*0.92; hemi.intensity=0.5-0.3*lit; ren.toneMappingExposure=0.8-0.12*lit;
    const sa=-0.9+lt*0.75; sun.position.set(Math.cos(sa)*20,6+10*Math.sin(Math.PI*cl(0.25+lt/3.6)),Math.sin(sa)*20); sun.intensity=1.8*(1-0.75*lit); sun.color.copy(lerpC(0xfff0d8,0xff8a4a,lit));
    facadeA.position.set(W/2,Math.max(0.3,gf*FH*0.5),W/2);
    const ca=0.75+lt*0.2, rad=19.5-1.5*easeIO(cl(lt/3)); cam.position.set(Math.sin(ca)*rad,5.2+0.5*lt,Math.cos(ca)*rad); cam.lookAt(0,4.4+0.1*lt,0); P.c.render();
    layoutLabels([['l0_0',coreTop,cl((lt-0.45)/0.2)],['l0_1',jibTip,cl((lt-0.95)/0.2)*(1-done)],['l0_2',facadeA,cl((lt-1.5)/0.2)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,650,130);
    caption(0,lt); };
})();

// ---------- S1 /x-ray an electric car: a scan line turns the paint into an x-ray, battery in the floor, inverter, motor, energy flows; braking sends it back
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#13283f','#03060b'); ren.localClippingEnabled=true;
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.7,radius:0.55,th:0.82});
  const key=new THREE.DirectionalLight(0xffffff,1.2); key.position.set(3,6,5); sc.add(key);
  const sh=new THREE.Shape(); sh.moveTo(2.12,0.22); sh.lineTo(2.25,0.45); sh.quadraticCurveTo(2.27,0.66,2.12,0.72); sh.quadraticCurveTo(1.5,0.82,0.95,0.9);
  sh.quadraticCurveTo(0.55,1.25,0.05,1.33); sh.quadraticCurveTo(-0.5,1.36,-0.95,1.3); sh.quadraticCurveTo(-1.6,1.12,-1.95,0.98); sh.quadraticCurveTo(-2.2,0.92,-2.22,0.8);
  sh.lineTo(-2.25,0.38); sh.quadraticCurveTo(-2.24,0.24,-2.08,0.22); sh.lineTo(-1.86,0.22); sh.absarc(-1.4,0.3,0.46,Math.PI-0.17,0.17,true); sh.lineTo(0.94,0.22); sh.absarc(1.4,0.3,0.46,Math.PI-0.17,0.17,true); sh.lineTo(2.12,0.22);
  const bodyG=new THREE.ExtrudeGeometry(sh,{depth:1.5,bevelEnabled:true,bevelThickness:0.16,bevelSize:0.1,bevelSegments:8,curveSegments:24}); bodyG.translate(0,0,-0.75); bodyG.computeVertexNormals();
  const scanP=new THREE.Plane(new THREE.Vector3(-1,0,0),3), scanX=new THREE.Plane(new THREE.Vector3(1,0,0),-3);
  const paint=new THREE.Mesh(bodyG,new THREE.MeshPhysicalMaterial({color:0xb5121b,metalness:.55,roughness:.28,clearcoat:1,clearcoatRoughness:.08,clippingPlanes:[scanP],side:THREE.DoubleSide})); sc.add(paint);
  const xm=new THREE.ShaderMaterial({uniforms:{col:{value:new THREE.Color(0x5fd0ff)},op:{value:1}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,clipping:true,clippingPlanes:[scanX],
    vertexShader:'#include <clipping_planes_pars_vertex>\nvarying vec3 vN; varying vec3 vV; void main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mvPosition.xyz); gl_Position=projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}',
    fragmentShader:'#include <clipping_planes_pars_fragment>\nuniform vec3 col; uniform float op; varying vec3 vN; varying vec3 vV; void main(){\n#include <clipping_planes_fragment>\n float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.4); gl_FragColor=vec4(col*(0.05+1.25*f)*op,1.); }'});
  const xr=new THREE.Mesh(bodyG,xm); sc.add(xr);
  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(bodyG,30),new THREE.LineBasicMaterial({color:0x8fe3ff,transparent:true,opacity:.35,toneMapped:false,clippingPlanes:[scanX]})); sc.add(edges);
  const scan=new THREE.Mesh(new THREE.PlaneGeometry(2.3,2.0),glowMat(0x7fe6ff,0.0)); scan.rotation.y=Math.PI/2; scan.position.y=0.75; sc.add(scan);
  const scanL=new THREE.Mesh(new THREE.BoxGeometry(0.02,1.7,2.1),glowMat(0xbff4ff,0)); scanL.position.y=0.75; sc.add(scanL);
  // wheels
  const rub=new THREE.MeshStandardMaterial({color:0x111214,roughness:.85}), rimM=new THREE.MeshPhysicalMaterial({color:0xc9ced6,metalness:1,roughness:.25});
  const wheels=[]; [[-1.4,0.86],[-1.4,-0.86],[1.4,0.86],[1.4,-0.86]].forEach(([x,z])=>{ const w=new THREE.Group(); w.position.set(x,0.37,z); const t=new THREE.Mesh(new THREE.CylinderGeometry(0.37,0.37,0.26,48),rub); t.rotation.x=Math.PI/2; w.add(t);
    const r=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.24,0.27,40),new THREE.MeshPhysicalMaterial({color:0x2a2d33,metalness:1,roughness:.35})); r.rotation.x=Math.PI/2; w.add(r); for(let q=0;q<5;q++){ const sp=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.44,0.29),rimM); sp.rotation.z=q*Math.PI*2/5; w.add(sp); } const hb=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.3,20),rimM); hb.rotation.x=Math.PI/2; w.add(hb); sc.add(w); wheels.push(w); });
  // battery pack: rows of cells in the floor
  const pack=new THREE.Mesh(rbox(2.1,1.42,0.12,0.04),new THREE.MeshPhysicalMaterial({color:0x2a3340,metalness:.8,roughness:.35})); pack.rotation.x=Math.PI/2; pack.position.set(0,0.27,0); sc.add(pack);
  const NX=24, NZ=14, cells=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.034,0.034,0.1,12),new THREE.MeshStandardMaterial({color:0xffffff,metalness:.6,roughness:.3,emissive:0x1aff9c,emissiveIntensity:0.0}),NX*NZ);
  const M4=new THREE.Matrix4(); let n=0; for(let i=0;i<NX;i++) for(let j=0;j<NZ;j++){ M4.makeTranslation(-0.98+i*(1.96/(NX-1)),0.36,-0.62+j*(1.24/(NZ-1))); cells.setMatrixAt(n,M4); cells.setColorAt(n,new THREE.Color(0x4a5866)); n++; } sc.add(cells);
  const inv=new THREE.Mesh(rbox(0.42,0.3,0.24,0.04),new THREE.MeshPhysicalMaterial({color:0x8a96a6,metalness:1,roughness:.3})); inv.position.set(-1.05,0.62,0); sc.add(inv);
  const motor=new THREE.Group(); motor.position.set(-1.4,0.37,0); sc.add(motor);
  const mBody=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,0.66,40),new THREE.MeshPhysicalMaterial({color:0xb7bec8,metalness:1,roughness:.22})); mBody.rotation.x=Math.PI/2; motor.add(mBody);
  const coil=new THREE.Mesh(new THREE.TorusGeometry(0.16,0.045,12,40),new THREE.MeshStandardMaterial({color:0xc56a2d,metalness:1,roughness:.3,emissive:0xff6a1f,emissiveIntensity:0})); motor.add(coil);
  const axle=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,1.7,12),rimM); axle.rotation.x=Math.PI/2; motor.add(axle);
  const path=new THREE.CatmullRomCurve3([new THREE.Vector3(0.3,0.42,0.1),new THREE.Vector3(-0.5,0.5,0.1),new THREE.Vector3(-0.9,0.62,0.05),new THREE.Vector3(-1.2,0.6,0),new THREE.Vector3(-1.4,0.45,0.05)]);
  const hv=new THREE.Mesh(new THREE.TubeGeometry(path,80,0.022,8,false),new THREE.MeshStandardMaterial({color:0xff6a1f,emissive:0xff4b1f,emissiveIntensity:0.4,roughness:.5})); sc.add(hv);
  const NP=26, parts=[]; for(let i=0;i<NP;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.035,10,8),glowMat(0xffa040,0)); sc.add(m); parts.push(m); }
  const grid=new THREE.GridHelper(14,28,0x2e6f99,0x173247); grid.material.transparent=true; grid.material.opacity=.5; sc.add(grid);
  const shd=shadowPlane(6,3.2,.75); shd.position.y=0.005; sc.add(shd);
  const aBat=new THREE.Object3D(); aBat.position.set(0.55,0.36,0.62); sc.add(aBat);
  const aInv=new THREE.Object3D(); aInv.position.set(-1.05,0.77,0); sc.add(aInv);
  const aMot=new THREE.Object3D(); aMot.position.set(-1.4,0.5,0.2); sc.add(aMot);
  const aBrk=new THREE.Object3D(); aBrk.position.set(1.4,0.37,0.99); sc.add(aBrk);
  SCN[1]=function(lt){ const s=2.7-5.4*easeIO(cl((lt-0.05)/0.85)); scanP.constant=s; scanX.constant=-s; scan.position.x=s; scanL.position.x=s;
    const sv=cl(lt/0.12)*(1-cl((lt-0.85)/0.15)); scan.material.opacity=0.12*sv; scanL.material.opacity=0.9*sv;
    const regen=cl((lt-1.85)/0.25); const flow=cl((lt-0.85)/0.3);
    const spd=6*(1-0.55*regen); wheels.forEach(w=>w.rotation.z=-lt*spd); axle.rotation.y=-lt*spd; coil.rotation.z=-lt*spd;
    const col=lerpC(0xffa040,0x3dffb0,regen);
    parts.forEach((m,i)=>{ let u=(i/NP+lt*0.55)%1; if(regen>0.5) u=1-u; m.position.copy(path.getPointAt(u)); m.material.opacity=flow*(0.9); m.material.color.copy(col); m.scale.setScalar(1+0.6*Math.sin(u*Math.PI)); });
    hv.material.emissive.copy(col); hv.material.emissiveIntensity=0.3+0.9*flow;
    coil.material.emissiveIntensity=flow*(1.4-0.6*regen); coil.material.emissive.copy(col);
    // cells light up: discharge (orange wave) then charging (green wave back in)
    n=0; for(let i=0;i<NX;i++) for(let j=0;j<NZ;j++){ const ph=(i/NX); let v=0.25+0.75*flow*(0.5+0.5*Math.sin(lt*6-ph*8)); const c=lerpC(0x4a5866,regen>0?0x3dffb0:0xff8a3d,0.55*flow*v); cells.setColorAt(n,c); n++; }
    cells.instanceColor.needsUpdate=true; cells.material.emissiveIntensity=0;
    const ca=-0.85+0.3*easeIO(cl(lt/3)); const rad=12.2-0.9*ease(lt/3); cam.position.set(Math.sin(ca)*rad,3.6-0.6*ease(lt/3),Math.cos(ca)*rad); cam.lookAt(-0.15,0.45,0); P.c.render();
    layoutLabels([['l1_0',aBat,cl((lt-0.75)/0.2)],['l1_1',aInv,cl((lt-1.05)/0.2)],['l1_2',aMot,cl((lt-1.35)/0.2)],['l1_3',aBrk,cl((lt-1.9)/0.2)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,640,118);
    caption(1,lt); };
})();

// ---------- S2 /explain-3d a wind turbine: wind streaks hit the blades, camera flies into the nacelle, shaft -> gearbox -> generator, power glows down the tower
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); ren.toneMappingExposure=0.58;
  const sky=canvasTex(16,512,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#0d1a2c'); gr.addColorStop(.55,'#35587a'); gr.addColorStop(.8,'#d98a55'); gr.addColorStop(1,'#3a2a2a'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  sc.background=sky;
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.05,200);
  const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.93});
  const key=new THREE.DirectionalLight(0xffe2c4,1.4); key.position.set(6,5,4); sc.add(key); sc.add(new THREE.HemisphereLight(0x9ec3ff,0x302018,0.5));
  const white=new THREE.MeshPhysicalMaterial({color:0xc9cfd6,roughness:.45,metalness:.05,clearcoat:.4});
  const T=new THREE.Group(); sc.add(T);
  const tower=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.27,6,40),white); tower.position.y=3; T.add(tower);
  const hills=new THREE.Mesh(new THREE.CircleGeometry(60,64),new THREE.MeshStandardMaterial({color:0x1f2a20,roughness:1,envMapIntensity:0.1})); hills.rotation.x=-Math.PI/2; sc.add(hills);
  // far turbines
  for(let k=0;k<5;k++){ const g=new THREE.Group(); const t=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.13,3,12),white); t.position.y=1.5; g.add(t);
    const rr=new THREE.Group(); rr.position.set(0.2,3,0); g.add(rr); for(let b=0;b<3;b++){ const bl=new THREE.Mesh(new THREE.BoxGeometry(0.03,1.4,0.08),white); bl.position.y=0.7; const h=new THREE.Group(); h.rotation.x=b*2.094; h.add(bl); rr.add(h); }
    g.position.set(-14+k*6.5,0,-14-(k%2)*5); g.userData.r=rr; sc.add(g); T.userData['f'+k]=g; }
  const nac=new THREE.Group(); nac.position.y=6.05; T.add(nac);
  const shellM=new THREE.MeshPhysicalMaterial({color:0xc9cfd6,roughness:.4,clearcoat:.5,transparent:true,opacity:1,side:THREE.DoubleSide});
  const shell=new THREE.Mesh(rbox(1.25,0.44,0.46,0.14),shellM); shell.rotation.y=0; nac.add(shell); // long axis = x
  const shellE=new THREE.LineSegments(new THREE.EdgesGeometry(rbox(1.25,0.44,0.46,0.14),25),new THREE.LineBasicMaterial({color:0x9fe0ff,transparent:true,opacity:0,toneMapped:false})); nac.add(shellE);
  const steel=new THREE.MeshPhysicalMaterial({color:0xc4cad2,metalness:1,roughness:.22});
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.5,24),steel); shaft.rotation.z=Math.PI/2; shaft.position.x=0.36; nac.add(shaft);
  const gb=new THREE.Group(); gb.position.x=0.05; nac.add(gb);
  const gbBody=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,0.2,36),new THREE.MeshPhysicalMaterial({color:0x4d6a86,metalness:.9,roughness:.3})); gbBody.rotation.z=Math.PI/2; gb.add(gbBody);
  function gearM(r,n,mat){ const s=new THREE.Shape(); for(let i=0;i<n*4;i++){ const a=i/(n*4)*Math.PI*2; const rr=(i%4===1||i%4===2)?r:r*0.86; const x=Math.cos(a)*rr,y=Math.sin(a)*rr; if(i===0) s.moveTo(x,y); else s.lineTo(x,y); }
    const g=new THREE.ExtrudeGeometry(s,{depth:0.04,bevelEnabled:false}); g.rotateY(Math.PI/2); g.translate(-0.02,0,0); return new THREE.Mesh(g,mat); }
  const brass=new THREE.MeshPhysicalMaterial({color:0xd9ad55,metalness:1,roughness:.25});
  const gBig=gearM(0.17,36,brass); gBig.position.x=0.13; gb.add(gBig); const gSm=gearM(0.07,14,brass); gSm.position.set(-0.13,0.0,0); gb.add(gSm);
  const hs=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.2,16),steel); hs.rotation.z=Math.PI/2; hs.position.x=-0.17; nac.add(hs);
  const gen=new THREE.Group(); gen.position.x=-0.37; nac.add(gen);
  const genB=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.13,0.26,36,1,true),new THREE.MeshPhysicalMaterial({color:0x8a939e,metalness:1,roughness:.3,side:THREE.DoubleSide})); genB.rotation.z=Math.PI/2; gen.add(genB);
  const rot=new THREE.Group(); gen.add(rot); const coilM=new THREE.MeshStandardMaterial({color:0xc56a2d,metalness:1,roughness:.3,emissive:0xff6a1f,emissiveIntensity:0});
  for(let k=0;k<8;k++){ const c=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.04,0.05),coilM); const h=new THREE.Group(); h.rotation.x=k*Math.PI/4; c.position.y=0.085; h.add(c); rot.add(h); }
  const cableC=new THREE.CatmullRomCurve3([new THREE.Vector3(-0.37,-0.1,0),new THREE.Vector3(-0.2,-0.2,0),new THREE.Vector3(0,-0.3,0),new THREE.Vector3(0,-1.6,0),new THREE.Vector3(0,-6.0,0)]);
  const pulses=[]; for(let i=0;i<14;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),glowMat(0xffb04a,0)); nac.add(m); pulses.push(m); }
  // rotor
  const rotor=new THREE.Group(); rotor.position.x=0.7; nac.add(rotor);
  const hub=new THREE.Mesh(new THREE.SphereGeometry(0.16,32,16),white); hub.scale.set(1.5,1,1); rotor.add(hub);
  const bs=new THREE.Shape(); bs.moveTo(0,-0.07); bs.quadraticCurveTo(0.35,-0.2,0.6,-0.16); bs.lineTo(2.9,-0.03); bs.quadraticCurveTo(2.95,0,2.9,0.02); bs.lineTo(0.6,0.12); bs.quadraticCurveTo(0.3,0.12,0,0.07);
  const bg=new THREE.ExtrudeGeometry(bs,{depth:0.04,bevelEnabled:true,bevelThickness:0.015,bevelSize:0.015,bevelSegments:3,curveSegments:16}); bg.translate(0,0,-0.02); bg.rotateZ(Math.PI/2); bg.rotateY(Math.PI/2);
  for(let b=0;b<3;b++){ const h=new THREE.Group(); h.rotation.x=b*Math.PI*2/3; const m=new THREE.Mesh(bg,white); m.position.y=0.1; m.rotation.y=0.18; h.add(m); rotor.add(h); }
  // wind streaks
  const NW=70, wpos=new Float32Array(NW*6), R=rnd(5), wd=[]; for(let i=0;i<NW;i++) wd.push([R()*14-2,4+R()*5,R()*7-3.5,0.6+R()*1.2,R()]);
  const wg=new THREE.BufferGeometry(); wg.setAttribute('position',new THREE.BufferAttribute(wpos,3)); const wind=new THREE.LineSegments(wg,new THREE.LineBasicMaterial({color:0xdff3ff,transparent:true,opacity:0.5,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false})); sc.add(wind);
  const aBl=new THREE.Object3D(); aBl.position.set(0.72,1.6,0); nac.add(aBl);
  const aGb=new THREE.Object3D(); aGb.position.set(0.05,0.16,0.05); nac.add(aGb);
  const aGn=new THREE.Object3D(); aGn.position.set(-0.37,0.14,0.05); nac.add(aGn);
  SCN[2]=function(lt){ const w=1.7; const ang=lt*w; rotor.rotation.x=ang; shaft.rotation.x=ang; gBig.rotation.x=ang; gSm.rotation.x=-ang*(36/14); hs.rotation.x=ang*(36/14)*3; rot.rotation.x=ang*(36/14)*3;
    for(let k=0;k<5;k++) T.userData['f'+k].userData.r.rotation.x=lt*1.3+k;
    for(let i=0;i<NW;i++){ const d=wd[i]; let x=(d[0]+8-lt*7.5*(0.8+d[4]*0.5))%14; if(x<0) x+=14; x-=2; const L=d[3]; wpos.set([x,d[1],d[2],x+L,d[1],d[2]],i*6); } wg.attributes.position.needsUpdate=true;
    const fly=easeIO(cl((lt-0.75)/1.25)); const cut=cl((lt-1.0)/0.4);
    wind.material.opacity=0.5*(1-cl((lt-1.3)/0.3));
    shellM.opacity=1-0.82*cut; shellM.depthWrite=cut<0.05; shellE.material.opacity=0.55*cut;
    const pw=cl((lt-1.8)/0.3); coilM.emissiveIntensity=1.8*pw*(0.7+0.3*Math.sin(lt*30));
    pulses.forEach((m,i)=>{ const u=((i/pulses.length)+lt*0.35)%1; m.position.copy(cableC.getPointAt(u*0.35)); m.material.opacity=pw; });
    const target=new THREE.Vector3(0,6.05,0); const far=new THREE.Vector3(6.6,2.2,13.5), near=new THREE.Vector3(1.9,7.0,3.9);
    cam.position.lerpVectors(far,near,fly); const look=new THREE.Vector3(0,4.4,0).lerp(new THREE.Vector3(-0.05,5.95,0),fly); cam.lookAt(look); P.c.render();
    layoutLabels([['l2_0',aBl,cl((lt-0.35)/0.2)*(1-cl((lt-0.9)/0.2))],['l2_1',aGb,cl((lt-1.55)/0.2)],['l2_2',aGn,cl((lt-1.85)/0.2)]].map(([id,o,a])=>[document.getElementById(id),o,a]),cam,670,130);
    caption(2,lt); };
})();
