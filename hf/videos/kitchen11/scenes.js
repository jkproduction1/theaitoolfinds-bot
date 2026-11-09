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

// ---------- S0 /x-ray a coffee machine: a scan line turns the espresso machine into an x-ray: water tank, pump, boiler, group head.
// Cold water runs tank -> pump -> boiler (heats it) -> group head -> through the coffee -> espresso drips into the cup.
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#13283f','#03060b'); ren.localClippingEnabled=true;
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.4,radius:0.45,th:0.9});
  const key=new THREE.DirectionalLight(0xffffff,1.2); key.position.set(3,6,5); sc.add(key); sc.add(new THREE.HemisphereLight(0xcfd8ff,0x101418,0.3));
  const scanP=new THREE.Plane(new THREE.Vector3(-1,0,0),3), scanX=new THREE.Plane(new THREE.Vector3(1,0,0),-3);
  const paintM=new THREE.MeshPhysicalMaterial({color:0xb8bec6,metalness:.95,roughness:.22,clearcoat:.6,clippingPlanes:[scanP]});
  const blackM=new THREE.MeshPhysicalMaterial({color:0x17191c,metalness:.3,roughness:.4,clearcoat:.5,clippingPlanes:[scanP]});
  const xm=new THREE.ShaderMaterial({uniforms:{col:{value:new THREE.Color(0x5fd0ff)},op:{value:1}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,clipping:true,clippingPlanes:[scanX],
    vertexShader:'#include <clipping_planes_pars_vertex>\nvarying vec3 vN; varying vec3 vV; void main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mvPosition.xyz); gl_Position=projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}',
    fragmentShader:'#include <clipping_planes_pars_fragment>\nuniform vec3 col; uniform float op; varying vec3 vN; varying vec3 vV; void main(){\n#include <clipping_planes_fragment>\n float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.2); gl_FragColor=vec4(col*(0.03+0.55*f)*op,1.); }'});
  const M=new THREE.Group(); M.position.x=-0.3; M.scale.setScalar(0.85); sc.add(M);
  function shell(geo,mat,pos){ const m=new THREE.Mesh(geo,mat); m.position.set(...pos); M.add(m); const x=new THREE.Mesh(geo,xm); x.position.set(...pos); M.add(x); return m; }
  shell(rbox(1.5,1.0,1.2,0.12),paintM,[0,1.85,0]);        // top block (boiler inside)
  shell(rbox(1.5,1.05,0.5,0.1),paintM,[0,0.85,-0.35]);     // back column (pump + tank inside)
  shell(rbox(1.5,0.16,1.2,0.06),blackM,[0,0.3,0]);         // drip tray
  const gh=shell(new THREE.CylinderGeometry(0.16,0.13,0.18,32),blackM,[0,1.27,0.22]);
  const handle=shell(new THREE.BoxGeometry(0.08,0.06,0.55),blackM,[0,1.24,0.55]);
  // insides (always there, hidden by the opaque shell until the scan passes)
  const water=new THREE.MeshPhysicalMaterial({color:0x2a8cff,transparent:true,opacity:.55,roughness:.05,emissive:0x0a3a80,emissiveIntensity:.6});
  const tank=new THREE.Mesh(new THREE.BoxGeometry(0.42,1.2,0.3),new THREE.MeshPhysicalMaterial({color:0xcfe8ff,transparent:true,opacity:.18,roughness:.05,depthWrite:false})); tank.position.set(0.45,1.45,-0.38); M.add(tank);
  const wl=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.85,0.26),water); wl.position.set(0.45,1.28,-0.38); M.add(wl);
  const pump=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,0.26,24),new THREE.MeshStandardMaterial({color:0x9aa3ad,metalness:1,roughness:.3,emissive:0x2fbfff,emissiveIntensity:0})); pump.rotation.z=Math.PI/2; pump.position.set(0.05,0.62,-0.35); M.add(pump);
  const boilM=new THREE.MeshStandardMaterial({color:0xc56a2d,metalness:1,roughness:.3,emissive:0xff5a10,emissiveIntensity:0});
  const boiler=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.8,32),boilM); boiler.rotation.z=Math.PI/2; boiler.position.set(-0.15,1.85,-0.1); M.add(boiler);
  const coil=new THREE.Curve(); coil.getPoint=t=>new THREE.Vector3(-0.5+t*0.7,1.85+Math.cos(t*Math.PI*16)*0.24,-0.1+Math.sin(t*Math.PI*16)*0.24);
  const coilM=new THREE.MeshStandardMaterial({color:0x553322,emissive:0xff3a10,emissiveIntensity:0}); M.add(new THREE.Mesh(new THREE.TubeGeometry(coil,200,0.012,6,false),coilM));
  const path=new THREE.CatmullRomCurve3([[0.45,0.8,-0.38],[0.35,0.62,-0.35],[0.05,0.62,-0.35],[-0.3,0.66,-0.35],[-0.45,1.2,-0.3],[-0.4,1.7,-0.1],[0.1,1.85,-0.1],[0.12,1.6,0.1],[0,1.38,0.22]].map(a=>new THREE.Vector3(...a)));
  M.add(new THREE.Mesh(new THREE.TubeGeometry(path,120,0.018,8,false),new THREE.MeshStandardMaterial({color:0x8d969f,metalness:1,roughness:.35})));
  const NP=30, parts=[]; for(let i=0;i<NP;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.028,10,8),glowMat(0x5fc8ff,0)); M.add(m); parts.push(m); }
  // cup + espresso
  const cupM=new THREE.MeshPhysicalMaterial({color:0xf3f1ec,roughness:.25,clearcoat:.8,side:THREE.DoubleSide});
  const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.13,0.26,40,1,true),cupM); cup.position.set(0,0.52,0.22); M.add(cup);
  const cupB=new THREE.Mesh(new THREE.CircleGeometry(0.13,32),cupM); cupB.rotation.x=-Math.PI/2; cupB.position.set(0,0.395,0.22); M.add(cupB);
  const cof=new THREE.Mesh(new THREE.CylinderGeometry(0.155,0.13,1,32),new THREE.MeshPhysicalMaterial({color:0x3b1f0e,roughness:.2,clearcoat:1})); cof.position.set(0,0.4,0.22); M.add(cof);
  const crema=new THREE.Mesh(new THREE.CircleGeometry(0.15,32),new THREE.MeshStandardMaterial({color:0xb87a3e,roughness:.6})); crema.rotation.x=-Math.PI/2; M.add(crema);
  const stream=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,1,8),new THREE.MeshPhysicalMaterial({color:0x5a2e12,roughness:.1,clearcoat:1})); stream.position.set(0,0,0.22); M.add(stream);
  const steam=[]; for(let i=0;i<8;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),glowMat(0xffffff,0)); M.add(s); steam.push(s); }
  const scan=new THREE.Mesh(new THREE.PlaneGeometry(1.6,2.6),glowMat(0x7fe6ff,0)); scan.rotation.y=Math.PI/2; scan.position.y=1.2; sc.add(scan);
  const scanL=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.4,2.3)),new THREE.LineBasicMaterial({color:0xbff4ff,transparent:true,opacity:0,toneMapped:false})); scanL.rotation.y=Math.PI/2; scanL.position.y=1.2; sc.add(scanL);
  const grid=new THREE.GridHelper(14,28,0x2e6f99,0x173247); grid.material.transparent=true; grid.material.opacity=.5; grid.position.y=0.22; sc.add(grid);
  const A=(x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); M.add(o); return o; };
  const aT=A(0.66,1.55,-0.38), aP=A(0.18,0.62,-0.2), aB=A(0.25,1.9,0), aG=A(0.15,1.3,0.3);
  SCN[0]=function(lt){ const s=1.5-3.0*easeIO(cl((lt-0.05)/0.85)); scanP.constant=s+0.3; scanX.constant=-(s+0.3); scan.position.x=s; scanL.position.x=s;
    const sv=cl(lt/0.12)*(1-cl((lt-0.85)/0.15)); scan.material.opacity=0.06*sv; scanL.material.opacity=0.9*sv;
    const flow=cl((lt-0.85)/0.3), heat=cl((lt-1.05)/0.4);
    pump.material.emissiveIntensity=flow*(0.6+0.4*Math.sin(lt*30)); boilM.emissiveIntensity=heat*0.8; coilM.emissiveIntensity=heat*(1.6+0.3*Math.sin(lt*9));
    parts.forEach((m,i)=>{ const u=(i/NP+lt*0.55)%1; m.position.copy(path.getPointAt(u)); const hot=cl((u-0.6)/0.15)*heat; m.material.color.copy(lerpC(0x5fc8ff,0xffa040,hot)); m.material.opacity=flow*0.95; });
    wl.scale.y=1-0.25*cl((lt-0.9)/2); wl.position.y=1.28-0.85*0.125*cl((lt-0.9)/2);
    const pour=cl((lt-1.55)/0.2)*(1-cl((lt-3.0)/0.2)), fill=cl((lt-1.65)/1.3);
    const top=0.4+0.02+0.2*fill; stream.visible=pour>0.01; stream.scale.y=Math.max(0.01,1.18-top); stream.position.y=(1.18+top)/2; stream.scale.x=stream.scale.z=pour;
    cof.visible=fill>0.01; cof.scale.y=Math.max(0.01,0.2*fill); cof.position.y=0.4+0.1*fill; crema.visible=fill>0.01; crema.position.set(0,0.401+0.2*fill,0.22);
    steam.forEach((m,i)=>{ const u=((i/8)+lt*0.5)%1; m.position.set(0.05*Math.sin(i*2+lt*2),0.62+0.6*u,0.22); m.scale.setScalar(0.6+1.4*u); m.material.opacity=0.07*fill*(1-u); });
    const z=easeIO(cl((lt-1.4)/1.6)); const ca=0.55-0.2*easeIO(cl(lt/3)); const rad=8.6-0.9*z; cam.position.set(Math.sin(ca)*rad-0.3,2.1-0.3*z,Math.cos(ca)*rad); cam.lookAt(-0.05,1.0-0.1*z,0); P.c.render();
    layoutLabels(labs(0,[[0,aT,cl((lt-0.45)/0.2)],[1,aP,cl((lt-0.9)/0.2)],[2,aB,cl((lt-1.15)/0.2)],[3,aG,cl((lt-1.55)/0.2)]]),cam,640,130);
    caption(0,lt); };
})();

// ---------- S1 /explain-3d how a microwave heats food: the box turns see-through; the magnetron makes microwaves, the waveguide
// carries them into the metal box, they bounce off the walls, the turntable spins, the water in the food shakes and the food heats up
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#232a33','#05060a'); ren.toneMappingExposure=0.55;
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.8,radius:0.6,th:0.8});
  const key=new THREE.DirectionalLight(0xffffff,0.9); key.position.set(-3,6,5); sc.add(key); sc.add(new THREE.HemisphereLight(0xcfd8ff,0x101418,0.35));
  const W=2.4,H=1.4,D=1.5, CX=-0.35, CW=1.6; // cavity on the left, electronics bay on the right
  const outM=new THREE.MeshPhysicalMaterial({color:0x2a2d32,metalness:.6,roughness:.35,clearcoat:.4,transparent:true,opacity:1});
  const body=new THREE.Mesh(rbox(W,H,D,0.08),outM); body.position.y=H/2+0.05; sc.add(body);
  const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W,H,D)),new THREE.LineBasicMaterial({color:0x9fd8ff,transparent:true,opacity:0,toneMapped:false})); edges.position.copy(body.position); sc.add(edges);
  const wallM=new THREE.MeshPhysicalMaterial({color:0xaab3bd,metalness:1,roughness:.35,side:THREE.BackSide,transparent:true,opacity:0});
  const cav=new THREE.Mesh(new THREE.BoxGeometry(CW,H-0.2,D-0.2),wallM); cav.position.set(CX,H/2+0.05,0); sc.add(cav);
  const mag=new THREE.Group(); mag.position.set(0.8,0.75,-0.1); sc.add(mag);
  const magM=new THREE.MeshStandardMaterial({color:0x9aa3ad,metalness:1,roughness:.3,emissive:0xff6a1f,emissiveIntensity:0});
  mag.add(new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.32,32),magM)); for(let i=0;i<6;i++){ const f=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.015,0.42),new THREE.MeshStandardMaterial({color:0xc9ced6,metalness:1,roughness:.4})); f.position.y=-0.12+i*0.05; mag.add(f); }
  const wg=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.16,0.3),new THREE.MeshStandardMaterial({color:0x7d858e,metalness:1,roughness:.35,transparent:true,opacity:.6})); wg.position.set(0.45,1.22,-0.1); sc.add(wg);
  // turntable + bowl of soup
  const plate=new THREE.Mesh(new THREE.CylinderGeometry(0.62,0.62,0.03,48),new THREE.MeshPhysicalMaterial({color:0xdfe8ee,roughness:.05,transmission:.6,transparent:true,opacity:.7,clearcoat:1})); plate.position.set(CX,0.2,0); sc.add(plate);
  const bowl=new THREE.Mesh(new THREE.LatheGeometry([[0,0],[0.22,0],[0.34,0.06],[0.4,0.24],[0.38,0.24],[0.32,0.07],[0,0.03]].map(([r,y])=>new THREE.Vector2(r,y)),48),new THREE.MeshPhysicalMaterial({color:0xf3f1ec,roughness:.2,clearcoat:.8,side:THREE.DoubleSide}));
  const BW=new THREE.Group(); BW.position.set(CX,0.22,0); sc.add(BW); BW.add(bowl);
  const soupM=new THREE.MeshStandardMaterial({color:0xa8381a,roughness:.3,emissive:0xff4a10,emissiveIntensity:0}); const soup=new THREE.Mesh(new THREE.CircleGeometry(0.37,40),soupM); soup.rotation.x=-Math.PI/2; soup.position.y=0.215; BW.add(soup);
  // water molecules (O + 2 H), floating in the soup, shake harder as the waves arrive
  const mols=[]; const R=rnd(5); for(let i=0;i<7;i++){ const g=new THREE.Group(); const o=new THREE.Mesh(new THREE.SphereGeometry(0.028,16,12),new THREE.MeshStandardMaterial({color:0xe23b2e,roughness:.3}));
    g.add(o); [-1,1].forEach(s=>{ const h=new THREE.Mesh(new THREE.SphereGeometry(0.018,12,10),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.3})); h.position.set(s*0.03,-0.022,0); g.add(h); });
    const a=R()*6.28, r=0.08+R()*0.22; g.position.set(Math.cos(a)*r,0.24+R()*0.05,Math.sin(a)*r); g.userData.p=R()*6; BW.add(g); mols.push(g); }
  const steam=[]; for(let i=0;i<10;i++){ const s=new THREE.Mesh(new THREE.SphereGeometry(0.06,10,8),glowMat(0xffffff,0)); BW.add(s); steam.push(s); }
  // microwaves: glowing dotted sine waves bouncing inside the cavity
  const NW=7, ND=70, wave=new THREE.InstancedMesh(new THREE.SphereGeometry(0.02,8,6),glowMat(0x7fd8ff,1),NW*ND); sc.add(wave);
  const wpaths=[]; const R2=rnd(11); const bx=CW/2-0.12, by=[0.25,1.3], bz=D/2-0.18;
  for(let w=0;w<NW;w++){ const pts=[new THREE.Vector3(0.05,1.22,-0.1)]; let p=new THREE.Vector3(CX+bx,1.2,-0.1+(R2()-.5)*0.4); pts.push(p.clone()); let d=new THREE.Vector3(-1,-(0.3+R2()*0.7),(R2()-.5)*1.2).normalize();
    for(let b=0;b<7;b++){ let tmin=99; [['x',CX-bx,CX+bx],['y',by[0],by[1]],['z',-bz,bz]].forEach(([ax,lo,hi])=>{ const v=d[ax]; if(Math.abs(v)<1e-4) return; const t=((v>0?hi:lo)-p[ax])/v; if(t>1e-4&&t<tmin) tmin=t; });
      p=p.clone().addScaledVector(d,tmin); pts.push(p.clone()); ['x','y','z'].forEach(ax=>{ const lo={x:CX-bx,y:by[0],z:-bz}[ax], hi={x:CX+bx,y:by[1],z:bz}[ax]; if(Math.abs(p[ax]-lo)<1e-3||Math.abs(p[ax]-hi)<1e-3) d[ax]=-d[ax]; }); }
    wpaths.push(new THREE.CurvePath()); for(let i=0;i<pts.length-1;i++) wpaths[w].add(new THREE.LineCurve3(pts[i],pts[i+1])); }
  const Mx=new THREE.Matrix4(), Q=new THREE.Quaternion(), S1=new THREE.Vector3(), up=new THREE.Vector3(0,1,0);
  const shd=shadowPlane(4,2.4,.8); shd.position.y=0.04; sc.add(shd);
  const aMag=new THREE.Object3D(); aMag.position.set(0.95,0.85,0.1); sc.add(aMag);
  const aWall=new THREE.Object3D(); aWall.position.set(CX-0.75,1.15,-0.5); sc.add(aWall);
  const aTT=new THREE.Object3D(); aTT.position.set(CX+0.55,0.2,0.2); sc.add(aTT);
  const aMol=new THREE.Object3D(); aMol.position.set(0.15,0.27,0.1); BW.add(aMol);
  SCN[1]=function(lt){ const cut=easeIO(cl((lt-0.15)/0.5)); outM.opacity=1-0.9*cut; outM.depthWrite=cut<0.5; edges.material.opacity=0.5*cut; wallM.opacity=0.25*cut;
    const on=cl((lt-0.6)/0.25); magM.emissiveIntensity=on*(1.4+0.4*Math.sin(lt*25));
    for(let w=0;w<NW;w++){ const head=cl((lt-0.65-w*0.04)/1.6)*1.4; const L=wpaths[w].getLength();
      for(let i=0;i<ND;i++){ const u=head-i*0.012; const ok=on>0&&u>0&&u<1; if(ok){ const p=wpaths[w].getPointAt(Math.min(u,1)); const tg=wpaths[w].getTangentAt(Math.min(u,1)); const n=new THREE.Vector3().crossVectors(tg,up); if(n.lengthSq()<1e-3) n.set(1,0,0); n.normalize();
          p.addScaledVector(n,0.05*Math.sin(u*L*28-lt*30)); S1.setScalar(1-i/ND); Mx.compose(p,Q,S1); } else Mx.makeScale(0,0,0); wave.setMatrixAt(w*ND+i,Mx); } }
    wave.instanceMatrix.needsUpdate=true;
    BW.rotation.y=lt*0.9*cl((lt-0.6)/0.3); plate.rotation.y=BW.rotation.y;
    const shake=cl((lt-1.0)/0.5), hot=cl((lt-1.3)/1.2); mols.forEach(g=>{ g.rotation.z=Math.sin(lt*40+g.userData.p)*0.9*shake; g.rotation.y=g.userData.p+Math.cos(lt*33+g.userData.p)*0.6*shake; g.scale.setScalar(1+0.3*cl((lt-0.9)/0.4)); });
    soupM.emissiveIntensity=0.5*hot; soupM.color.copy(lerpC(0x8a2e14,0xc24a1e,hot));
    steam.forEach((m,i)=>{ const u=((i/10)+lt*0.45)%1; m.position.set(0.15*Math.sin(i*2.1),0.25+0.7*u,0.15*Math.cos(i*1.7)); m.scale.setScalar(0.6+1.6*u); m.material.opacity=0.035*hot*(1-u); });
    const z=easeIO(cl((lt-1.3)/1.6)); const ca=-0.5+0.25*easeIO(cl(lt/3)); const rad=9.4-1.4*z; cam.position.set(Math.sin(ca)*rad,3.2-0.6*z,Math.cos(ca)*rad); cam.lookAt(0.05-0.15*z,0.72-0.12*z,0); P.c.render();
    layoutLabels(labs(1,[[0,aMag,cl((lt-0.6)/0.2)],[1,aWall,cl((lt-1.0)/0.2)],[2,aTT,cl((lt-1.25)/0.2)],[3,aMol,cl((lt-1.5)/0.2)]]),cam,650,130);
    caption(1,lt); };
})();

// ---------- S2 /explode a toaster: assembled toaster, then the shell lifts off, the crumb tray drops out, the heating elements
// (wire wound on mica sheets) and the bread rack spread apart; the wires glow red and the bread browns
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#2a2420','#07080a'); ren.toneMappingExposure=0.55;
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.92});
  const key=new THREE.DirectionalLight(0xffffff,0.8); key.position.set(-3,7,5); sc.add(key); sc.add(new THREE.HemisphereLight(0xcfd8ff,0x201812,0.3));
  const T=new THREE.Group(); T.rotation.y=0.55; T.scale.setScalar(0.9); sc.add(T);
  const chrome=new THREE.MeshPhysicalMaterial({color:0xd6dade,metalness:1,roughness:.3,clearcoat:.6,envMapIntensity:1.6});
  const dark=new THREE.MeshStandardMaterial({color:0x1c1e21,roughness:.5});
  // shell: rounded body with two slots cut in the top (built from a frame of slabs)
  const SH=new THREE.Group(); T.add(SH);
  const sideG=rbox(1.7,1.0,0.1,0.08); [-0.5,0.5].forEach(z=>{ const m=new THREE.Mesh(sideG,chrome); m.position.set(0,0.5,z); SH.add(m); });
  [-0.82,0.82].forEach(x=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.0,1.0),chrome); m.position.set(x,0.5,0); SH.add(m); });
  [[-0.43,0.12],[0,0.2],[0.43,0.12]].forEach(([z,w])=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.08,w),chrome); m.position.set(0,0.98,z*1.0); SH.add(m); });
  [-0.22,0.22].forEach(z=>{ const m=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.02,0.18),new THREE.MeshBasicMaterial({color:0x050505})); m.position.set(0,0.95,z); SH.add(m); });
  const lever=new THREE.Mesh(rbox(0.22,0.08,0.14,0.03),dark); lever.position.set(0.93,0.7,0.3); SH.add(lever);
  const knob=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.05,24),dark); knob.rotation.x=Math.PI/2; knob.position.set(0.55,0.3,0.56); SH.add(knob);
  // base + crumb tray
  const base=new THREE.Mesh(rbox(1.75,0.08,1.1,0.04),dark); base.rotation.x=Math.PI/2; base.position.y=0.0; T.add(base);
  const tray=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.03,0.9),new THREE.MeshStandardMaterial({color:0x4a4e54,metalness:.6,roughness:.75,envMapIntensity:.3})); T.add(tray);
  const crumbs=new THREE.InstancedMesh(new THREE.BoxGeometry(0.025,0.015,0.02),new THREE.MeshStandardMaterial({color:0x9a6a36,roughness:.9}),30); const R=rnd(3); const M4=new THREE.Matrix4();
  for(let i=0;i<30;i++){ M4.makeTranslation((R()-.5)*1.3,0.02,(R()-.5)*0.75); crumbs.setMatrixAt(i,M4); } tray.add(crumbs);
  // heating elements: mica sheet + zig-zag wire, at z = -0.38, 0, +0.38
  const wireM=new THREE.MeshStandardMaterial({color:0x1a0a05,metalness:.3,roughness:.5,emissive:0xff2200,emissiveIntensity:0,toneMapped:false});
  const wireGlow=glowMat(0xff2a00,0);
  const micaM=new THREE.MeshPhysicalMaterial({color:0x8a7a62,roughness:.6,transparent:true,opacity:.4,side:THREE.DoubleSide});
  const EL=[]; [-0.38,0,0.38].forEach(z=>{ const g=new THREE.Group(); g.userData.z=z; const mica=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.7),micaM); g.add(mica);
    const zz=new THREE.Curve(); zz.getPoint=t=>new THREE.Vector3(-0.66+1.32*t,0.3*Math.sin(t*Math.PI*22),0.012*Math.cos(t*Math.PI*44)); const tg=new THREE.TubeGeometry(zz,600,0.009,5,false); g.add(new THREE.Mesh(tg,wireM)); const gl=new THREE.Mesh(tg,wireGlow); gl.scale.set(1,1,1.6); g.add(gl);
    g.position.set(0,0.5,z); T.add(g); EL.push(g); });
  // bread rack + 2 slices
  const breadM=new THREE.MeshStandardMaterial({color:0xd9bf8c,roughness:.9,emissive:0xff5a10,emissiveIntensity:0}), crustM=new THREE.MeshStandardMaterial({color:0xb5803f,roughness:.9});
  const slices=[]; [-0.19,0.19].forEach(z=>{ const g=new THREE.Group(); g.userData.z=z; const s=new THREE.Mesh(rbox(1.0,0.95,0.11,0.16),[breadM,crustM]); g.add(s);
    const rack=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.03,0.16),chrome); rack.position.y=-0.47; g.add(rack); g.position.set(0,0.5,z); T.add(g); slices.push(g); });
  const shd=shadowPlane(4,3,.8); shd.position.y=-0.75; T.add(shd);
  const aSh=new THREE.Object3D(); aSh.position.set(0.8,1.0,0.5); SH.add(aSh);
  const aW=new THREE.Object3D(); aW.position.set(0.5,0.2,0); EL[2].add(aW);
  const aB=new THREE.Object3D(); aB.position.set(0.4,0.3,0.06); slices[1].add(aB);
  const aTr=new THREE.Object3D(); aTr.position.set(0.7,0,0.4); tray.add(aTr);
  SCN[2]=function(lt){ const e=easeIO(cl((lt-0.1)/0.65));
    SH.position.y=1.75*e; tray.position.set(0.25*e,-0.03-0.62*e,0); base.position.y=-0.05-0.45*e;
    EL.forEach(g=>{ g.position.z=g.userData.z*(1+1.9*e); }); slices.forEach(g=>{ g.position.z=g.userData.z*(1+2.6*e); g.position.y=0.5+0.15*e; });
    const heat=cl((lt-0.6)/0.35); wireM.emissiveIntensity=heat*(1.6+0.2*Math.sin(lt*11)); wireGlow.opacity=heat*(0.5+0.05*Math.sin(lt*11)); breadM.emissiveIntensity=0.08*heat;
    const brown=cl((lt-0.75)/0.8); breadM.color.copy(lerpC(0xd9bf8c,0x7a3c14,brown)); crustM.color.copy(lerpC(0xb5803f,0x4a2410,brown));
    T.rotation.y=0.55+0.25*easeIO(cl(lt/3));
    const z=easeIO(cl((lt-0.1)/1.0)); cam.position.set(-1.2,3.2+1.0*z,8.6+1.2*z); cam.lookAt(0,0.62+0.3*z,0); P.c.render();
    layoutLabels(labs(2,[[0,aSh,cl((lt-0.5)/0.2)],[1,aW,cl((lt-0.7)/0.2)],[2,aB,cl((lt-0.95)/0.2)],[3,aTr,cl((lt-0.6)/0.2)]]),cam,650,130);
    caption(2,lt); };
})();
