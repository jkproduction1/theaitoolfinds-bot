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
function layoutLabels2(items,cam,colX,minGap){ // like layoutLabels, but labels at alpha 0 don't take a slot
  const on=items.filter(it=>it[2]>0.001); items.forEach(it=>{ if(it[2]<=0.001) it[0].style.opacity=0; }); if(on.length) layoutLabels(on,cam,colX,minGap); }
function stdM(c,m,r,o){ return new THREE.MeshPhysicalMaterial(Object.assign({color:c,metalness:m,roughness:r,envMapIntensity:0.75},o||{})); }
const XRAY_VS='#include <clipping_planes_pars_vertex>\nvarying vec3 vN; varying vec3 vV; void main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mvPosition.xyz); gl_Position=projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}';
const XRAY_FS='#include <clipping_planes_pars_fragment>\nuniform vec3 col; uniform float op; varying vec3 vN; varying vec3 vV; void main(){\n#include <clipping_planes_fragment>\n float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.2); gl_FragColor=vec4(col*(0.03+0.55*f)*op,1.); }';

// ---------- S0 /x-ray a vending machine (spiral-coil snack machine): a scan line turns the cabinet into an x-ray.
// A motor behind one coil turns it once; the coil pushes the snacks forward and the front one drops into the bin.
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#1b2635','#04060a'); ren.localClippingEnabled=true; ren.toneMappingExposure=0.5;
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.3,radius:0.45,th:0.97});
  const key=new THREE.DirectionalLight(0xffffff,1.1); key.position.set(-4,6,6); sc.add(key); sc.add(new THREE.HemisphereLight(0xcfd8ff,0x101418,0.3));
  const scanP=new THREE.Plane(new THREE.Vector3(-1,0,0),3), scanX=new THREE.Plane(new THREE.Vector3(1,0,0),-3);
  const paintM=stdM(0x8e1219,0.35,0.32,{clearcoat:1,clearcoatRoughness:.15,clippingPlanes:[scanP]});
  const blackM=stdM(0x16181b,0.3,0.45,{clearcoat:.5,clippingPlanes:[scanP]});
  const steelM=stdM(0xb9c0c8,1,0.28,{clippingPlanes:[scanP]});
  const xm=new THREE.ShaderMaterial({uniforms:{col:{value:new THREE.Color(0x5fd0ff)},op:{value:1}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,clipping:true,clippingPlanes:[scanX],vertexShader:XRAY_VS,fragmentShader:XRAY_FS});
  const M=new THREE.Group(); sc.add(M);
  function shell(geo,mat,pos,rot){ const m=new THREE.Mesh(geo,mat); m.position.set(...pos); if(rot) m.rotation.set(...rot); M.add(m); const x=new THREE.Mesh(geo,xm); x.position.copy(m.position); x.rotation.copy(m.rotation); M.add(x); return m; }
  const H=3.2;
  shell(rbox(0.08,H,1.3,0.03),paintM,[-0.88,H/2,0],[0,Math.PI/2,0]);
  shell(new THREE.BoxGeometry(0.08,H,1.3),paintM,[0.88,H/2,0]);
  shell(rbox(1.84,0.12,1.3,0.04),paintM,[0,H+0.02,0],[Math.PI/2,0,0]);
  shell(new THREE.BoxGeometry(1.8,H,0.06),paintM,[0,H/2,-0.63]);
  shell(new THREE.BoxGeometry(1.84,0.22,0.08),paintM,[0,0.11,0.62]);            // below the bin flap
  shell(new THREE.BoxGeometry(1.84,0.3,0.08),paintM,[0,0.77,0.62]);             // above the bin flap
  shell(new THREE.BoxGeometry(0.12,0.4,0.08),paintM,[-0.82,0.42,0.62]);
  shell(new THREE.BoxGeometry(0.62,0.4,0.08),paintM,[0.6,0.42,0.62]);
  shell(new THREE.BoxGeometry(0.56,2.3,0.08),paintM,[0.62,2.07,0.62]);          // right control panel
  shell(new THREE.BoxGeometry(1.24,0.06,0.09),blackM,[-0.24,3.12,0.62]); shell(new THREE.BoxGeometry(1.24,0.06,0.09),blackM,[-0.24,0.93,0.62]);
  // control panel details: display, keypad, coin slot, card reader
  shell(new THREE.BoxGeometry(0.38,0.16,0.02),new THREE.MeshStandardMaterial({color:0x0a1a2a,emissive:0x2a7fff,emissiveIntensity:.5,clippingPlanes:[scanP]}),[0.62,2.85,0.67]);
  for(let r=0;r<4;r++) for(let c=0;c<3;c++) shell(rbox(0.09,0.07,0.03,0.015),steelM,[0.52+c*0.1,2.6-r*0.095,0.67]);
  shell(new THREE.BoxGeometry(0.16,0.2,0.04),blackM,[0.53,2.05,0.67]); shell(new THREE.BoxGeometry(0.06,0.012,0.02),new THREE.MeshBasicMaterial({color:0x000000,clippingPlanes:[scanP]}),[0.53,2.1,0.69]);
  shell(new THREE.BoxGeometry(0.18,0.22,0.06),blackM,[0.74,2.05,0.67]); shell(new THREE.BoxGeometry(0.12,0.012,0.02),new THREE.MeshBasicMaterial({color:0x4cff8a,clippingPlanes:[scanP]}),[0.74,2.13,0.705]);
  // glass front + inside
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(1.24,2.14),stdM(0xdfefff,0,0.04,{transparent:true,opacity:.1,clearcoat:1,depthWrite:false,envMapIntensity:1.4})); glass.position.set(-0.24,2.02,0.64); M.add(glass);
  const back=new THREE.Mesh(new THREE.PlaneGeometry(1.24,2.6),stdM(0x1c1f25,0.2,0.7,{envMapIntensity:.3})); back.position.set(-0.24,1.9,-0.59); M.add(back);
  const strip=new THREE.Mesh(new THREE.BoxGeometry(1.1,0.03,0.04),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false})); strip.position.set(-0.24,3.04,0.5); M.add(strip);
  const pl=new THREE.PointLight(0xfff2e0,0.5,3); pl.position.set(-0.24,2.7,0.3); M.add(pl);
  
  // coin & card unit (behind the control panel)
  const cu=new THREE.Group(); cu.position.set(0.62,2.05,0.32); M.add(cu);
  cu.add(new THREE.Mesh(new THREE.BoxGeometry(0.4,0.42,0.42),stdM(0x3d434a,0.8,0.5,{envMapIntensity:.4})));
  const pcb0=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.02),stdM(0x1f6b35,0.1,0.5)); pcb0.position.set(0,0,-0.22); cu.add(pcb0);
  const chute=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.9,16),stdM(0x9aa3ad,1,0.3)); 
  // shelves, coils, snacks
  const COLS=[-0.62,-0.25,0.12], ROWS=[1.05,1.55,2.05,2.55], PITCH=0.184, Z0=-0.5, ZL=0.92;
  const shelfM=stdM(0x5c636b,0.8,0.5), coilM=stdM(0xd8dde2,1,0.18), motM=stdM(0x222428,0.5,0.4,{emissive:0xff7a2a,emissiveIntensity:0});
  const helix=new THREE.Curve(); helix.getPoint=t=>new THREE.Vector3(0.12*Math.cos(t*Math.PI*10),0.12*Math.sin(t*Math.PI*10),Z0+ZL*t);
  const helixG=new THREE.TubeGeometry(helix,300,0.013,8,false);
  const PAL=[['#7e2a26','#d8b25a'],['#2b4566','#e6dfcc'],['#3d5f42','#ddd2a8'],['#b8692a','#3a2618'],['#4f3a66','#d4bf80'],['#a8923f','#6e2620'],['#5b6b74','#e9e4d6'],['#8a4b2a','#efd9a0']];
  const snTex=PAL.map(([a,b],i)=>canvasTex(256,320,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,0); gr.addColorStop(0,'rgba(0,0,0,.35)'); gr.addColorStop(.5,'rgba(255,255,255,.08)'); gr.addColorStop(1,'rgba(0,0,0,.35)');
    g.fillStyle=a; g.fillRect(0,0,w,h); g.fillStyle=b; g.fillRect(0,h*0.36,w,h*0.2);
    g.fillStyle='rgba(250,246,236,.92)'; g.beginPath(); g.ellipse(w*0.5,h*0.62,w*0.3,h*0.1,0,0,7); g.fill(); g.fillStyle=a; g.beginPath(); g.ellipse(w*0.5,h*0.62,w*0.16,h*0.045,0,0,7); g.fill();
    g.fillStyle='rgba(255,255,255,.55)'; g.fillRect(w*0.2,h*0.42,w*0.6,6); g.fillRect(w*0.3,h*0.47,w*0.4,5);
    g.fillStyle='rgba(0,0,0,.25)'; for(let x=0;x<w;x+=8){ g.fillRect(x,0,3,h*0.07); g.fillRect(x,h*0.93,3,h*0.07); }
    g.fillStyle=gr; g.fillRect(0,0,w,h); }));
  const snM=snTex.map((t,i)=>new THREE.MeshPhysicalMaterial({map:t,metalness:i%3===0?0.55:0.15,roughness:i%3===0?0.28:(i%3===1?0.55:0.4),clearcoat:i%3===1?0.1:0.6,clearcoatRoughness:.3,envMapIntensity:.45}));
  const snSide=null;
  // pillow-shaped, crinkled bag: a subdivided box puffed in the middle, crimped flat at top and bottom
  const snG=new THREE.BoxGeometry(0.21,0.27,0.06,10,14,2); { const p=snG.attributes.position; const R=rnd(21);
    for(let i=0;i<p.count;i++){ const x=p.getX(i)/0.105, y=p.getY(i)/0.135, z=p.getZ(i); const crimp=Math.abs(y)>0.86?0.12:1;
      const puff=(0.25+0.95*(1-x*x)*(1-Math.pow(Math.abs(y),3)))*crimp; p.setZ(i,z*puff+Math.sign(z)*0.0025*Math.sin(x*9+y*13)*crimp);
      p.setX(i,p.getX(i)*(1-0.06*(1-y*y)*Math.abs(x)*0)+0.002*Math.sin(y*20)); }
    snG.computeVertexNormals(); }
  const canTex=['#7a1f1c','#1f3d5c','#c9c2b0'].map(a=>canvasTex(256,128,(g,w,h)=>{ g.fillStyle=a; g.fillRect(0,0,w,h); g.fillStyle='rgba(240,236,226,.85)'; g.fillRect(0,h*0.42,w,h*0.16); g.fillStyle='rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(w*0.3,h*0.5,26,40,0,0,7); g.fill(); }));
  const canM=canTex.map(t=>new THREE.MeshPhysicalMaterial({map:t,metalness:.7,roughness:.25,clearcoat:.8,envMapIntensity:.6})), canTop=stdM(0xc9ced4,1,0.3);
  const canG=new THREE.CylinderGeometry(0.07,0.07,0.22,32);
  let ACT=null; const actCoilM=stdM(0xd8dde2,1,0.18,{emissive:0xff7a2a,emissiveIntensity:0}); const actSn=[];
  ROWS.forEach((sy,r)=>{ const sh=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.025,1.04),shelfM); sh.position.set(-0.25,sy,-0.06); M.add(sh);
    COLS.forEach((sx,c)=>{ const g=new THREE.Group(); g.position.set(sx,sy+0.14,0); M.add(g);
      const coil=new THREE.Mesh(helixG,(r===1&&c===1)?actCoilM:coilM); g.add(coil);
      const mot=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.1,24),motM.clone()); mot.rotation.x=Math.PI/2; mot.position.set(sx,sy+0.14,-0.56); M.add(mot);
      const mi=(r*3+c*2+r)%PAL.length;
      for(let i=0;i<5;i++){ let s; if(r===3){ s=new THREE.Mesh(canG,[canM[c],canTop,canTop]); s.position.set(sx,sy+0.125,Z0+PITCH*0.5+i*PITCH); }
        else { s=new THREE.Mesh(snG,snM[(mi+(i>3?0:0))%snM.length]); s.position.set(sx,sy+0.15,Z0+PITCH*0.5+i*PITCH); s.rotation.z=0.03*Math.sin(i*2.3+c); }
        M.add(s); if(r===1&&c===1) actSn.push(s); }
      if(r===1&&c===1) ACT={coil,mot,g}; }); });
  // bin: sloped tray + dark flap
  const tray=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.03,0.9),stdM(0x3a3e44,0.7,0.5)); tray.position.set(-0.1,0.42,0.15); tray.rotation.x=0.35; M.add(tray);
  const flap=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.4),stdM(0x0b0c0e,0.2,0.2,{transparent:true,opacity:.55,clearcoat:1,depthWrite:false})); flap.position.set(-0.25,0.42,0.665); M.add(flap);
  const scan=new THREE.Mesh(new THREE.PlaneGeometry(1.7,3.6),glowMat(0x7fe6ff,0)); scan.rotation.y=Math.PI/2; scan.position.y=1.65; sc.add(scan);
  const scanL=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.5,3.4)),new THREE.LineBasicMaterial({color:0xbff4ff,transparent:true,opacity:0,toneMapped:false})); scanL.rotation.y=Math.PI/2; scanL.position.y=1.65; sc.add(scanL);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),stdM(0x0b0d12,0.1,0.9,{envMapIntensity:.15})); floor.rotation.x=-Math.PI/2; floor.position.y=-0.01; sc.add(floor);
  const shd=shadowPlane(3.4,2.6,.85); shd.position.y=0.005; sc.add(shd);
  const A=(x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); M.add(o); return o; };
  const aCoil=A(-0.13,1.81,0.25), aMot=A(-0.25,1.75,-0.56), aBin=A(-0.05,0.44,0.45), aCoin=A(0.82,2.25,0.32);
  const fall=actSn[4], fz0=fall.position.z, fy0=fall.position.y;
  const V3=(a)=>new THREE.Vector3(...a);
  const C0=V3([-3.3,2.7,8.8]), T0=V3([0.2,1.62,0]), C1=V3([-2.4,2.4,6.4]), T1=V3([0.18,1.6,0.15]), C2=V3([-2.3,1.6,6.4]), T2=V3([0.18,0.95,0.3]);
  SCN[0]=function(lt){ const s=1.3-2.6*easeIO(cl((lt-0.05)/0.9)); scanP.constant=s; scanX.constant=-s; scan.position.x=s; scanL.position.x=s;
    const sv=cl(lt/0.12)*(1-cl((lt-0.9)/0.15)); scan.material.opacity=0.06*sv; scanL.material.opacity=0.9*sv;
    const on=cl((lt-1.0)/0.2), turn=easeIO(cl((lt-1.15)/1.25));
    ACT.mot.material.emissiveIntensity=on*(1-cl((lt-2.5)/0.3))*(1.2+0.4*Math.sin(lt*30)); actCoilM.emissiveIntensity=0.9*on*(1-cl((lt-2.6)/0.3));
    ACT.g.rotation.z=-turn*Math.PI*2;
    actSn.forEach((m,i)=>{ if(i<4) m.position.z=Z0+PITCH*0.5+i*PITCH+PITCH*turn; });
    // the front snack: pushed forward, tips off the end of the coil, drops into the bin
    const ft=cl((lt-2.12)/0.55);
    if(ft<=0){ fall.position.set(-0.25,fy0,fz0+PITCH*turn); fall.rotation.set(0,0,0); }
    else { const g=ft*ft; fall.position.set(-0.25,fy0+(0.5-fy0)*g,fz0+PITCH*turn+0.07*ft); fall.rotation.set(-1.25*ease(ft),0.15*ft,0); }
    if(lt>2.67){ const k=cl((lt-2.67)/0.25); fall.position.y=0.5+0.025*Math.sin(k*Math.PI)*(1-k); }
    const a=easeIO(cl((lt-0.95)/1.15)), b=easeIO(cl((lt-2.0)/0.9)); const cp=C0.clone().lerp(C1,a).lerp(C2,b), tp=T0.clone().lerp(T1,a).lerp(T2,b);
    cam.position.copy(cp).add(new THREE.Vector3(0.12*Math.sin(lt*0.4),0,0)); cam.lookAt(tp); P.c.render();
    layoutLabels2(labs(0,[[0,aCoil,cl((lt-1.1)/0.2)],[1,aMot,cl((lt-1.35)/0.2)],[2,aBin,cl((lt-2.6)/0.2)],[3,aCoin,cl((lt-0.5)/0.2)*(1-cl((lt-1.0)/0.2))]]),cam,640,130);
    caption(0,lt); };
})();

// ---------- S1 /explain-3d how an escalator works: side cutaway. A motor drives the drive gear; the gear pulls the step chain;
// the steps ride a loop: flat at the landings, a staircase on the incline, around the gear and back underneath. The handrail moves with them.
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#26303c','#05070b'); ren.toneMappingExposure=0.6;
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.5,radius:0.5,th:0.85});
  const key=new THREE.DirectionalLight(0xffffff,1.0); key.position.set(2,7,-6); sc.add(key); sc.add(new THREE.HemisphereLight(0xcfd8ff,0x101418,0.35));
  const T30=Math.tan(Math.PI/6), GC=new THREE.Vector2(1.2,1.67), GR=0.35, BC=new THREE.Vector2(-4.6,-0.35);
  // the step loop (x-y plane), in the direction the steps travel; o0/o1 = step tilt at segment start/end
  const SEG=[]; const L2=(a,b,o)=>SEG.push({t:'l',a:new THREE.Vector2(...a),b:new THREE.Vector2(...b),o0:o,o1:o}); const AR=(c,r,a0,a1,o0,o1)=>SEG.push({t:'a',c,r,a0,a1,o0,o1});
  L2([-4.6,0],[-3.5,0],0); L2([-3.5,0],[0,3.5*T30],0); L2([0,3.5*T30],[1.2,3.5*T30],0); AR(GC,GR,Math.PI/2,-Math.PI/2,0,-Math.PI);
  L2([1.2,GC.y-GR],[0,GC.y-GR],-Math.PI); L2([0,GC.y-GR],[-3.5,GC.y-GR-3.5*T30],-Math.PI); L2([-3.5,-0.7],[-4.6,-0.7],-Math.PI); AR(BC,GR,-Math.PI/2,-3*Math.PI/2,-Math.PI,-2*Math.PI);
  SEG.forEach(s=>{ s.len=s.t==='l'?s.a.distanceTo(s.b):Math.abs(s.a1-s.a0)*s.r; }); const LOOP=SEG.reduce((a,s)=>a+s.len,0);
  function at(u){ u=((u%LOOP)+LOOP)%LOOP; for(const s of SEG){ if(u<=s.len){ const f=u/s.len; if(s.t==='l') return {p:s.a.clone().lerp(s.b,f),o:s.o0};
        const a=s.a0+(s.a1-s.a0)*f; return {p:new THREE.Vector2(s.c.x+s.r*Math.cos(a),s.c.y+s.r*Math.sin(a)),o:s.o0+(s.o1-s.o0)*f}; } u-=s.len; } return at(0); }
  const loopCurve=new THREE.Curve(); loopCurve.getPoint=t=>{ const q=at(t*LOOP).p; return new THREE.Vector3(q.x,q.y,0); };
  // steps
  const treadTex=canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#8f969e'; g.fillRect(0,0,w,h); g.fillStyle='#3a3f45'; for(let y=18;y<h-18;y+=9) g.fillRect(0,y,w,3);
    g.fillStyle='#f2c418'; g.fillRect(0,0,w,16); g.fillRect(0,h-16,w,16); g.fillRect(0,0,22,h); });
  const treadM=new THREE.MeshPhysicalMaterial({map:treadTex,metalness:.8,roughness:.4}), riserM=stdM(0x6f767e,0.9,0.45), frameM=stdM(0x2a2d31,0.6,0.5), wheelM=stdM(0x111214,0.1,0.7);
  const triS=new THREE.Shape(); triS.moveTo(0,-0.03); triS.lineTo(-0.37,-0.03); triS.lineTo(-0.37,-0.2); triS.lineTo(-0.04,-0.05); triS.lineTo(0,-0.03);
  const triG=new THREE.ExtrudeGeometry(triS,{depth:0.03,bevelEnabled:false});
  const SP=0.4, NS=Math.round(LOOP/SP), sp=LOOP/NS, steps=[];
  for(let i=0;i<NS;i++){ const g=new THREE.Group(); const tr=new THREE.Mesh(new THREE.BoxGeometry(0.37,0.03,0.96),treadM); tr.position.set(-0.185,-0.015,0); tr.rotation.y=Math.PI; g.add(tr);
    const ri=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.19,0.96),riserM); ri.position.set(-0.36,-0.11,0); g.add(ri);
    [-0.48,0.45].forEach(z=>{ const f=new THREE.Mesh(triG,frameM); f.position.z=z; g.add(f); });
    [[0,-0.04,-0.52],[0,-0.04,0.52],[-0.33,-0.17,-0.52],[-0.33,-0.17,0.52]].forEach(p=>{ const w=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.035,16),wheelM); w.rotation.x=Math.PI/2; w.position.set(...p); g.add(w); });
    sc.add(g); steps.push(g); }
  // step chains (both sides) + moving links
  const chainM=stdM(0x4a5058,1,0.35,{emissive:0x2a8cff,emissiveIntensity:0});
  [-0.56,0.56].forEach(z=>{ const m=new THREE.Mesh(new THREE.TubeGeometry(loopCurve,600,0.018,6,true),chainM); m.position.z=z; sc.add(m); });
  const NL=Math.round(LOOP/0.1), links=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03,0.03,0.06,10),stdM(0x9aa3ad,1,0.3),NL*2); sc.add(links);
  // drive gear (sprocket) at the top, return sprocket at the bottom
  const sprocket=(c,z)=>{ const g=new THREE.Group(); g.position.set(c.x,c.y,z); const sm=stdM(0xaeb6bf,1,0.25);
    { const dk=new THREE.Mesh(new THREE.CylinderGeometry(GR-0.03,GR-0.03,0.05,48),sm); dk.rotation.x=Math.PI/2; g.add(dk); }
    for(let i=0;i<14;i++){ const t=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.09,0.05),sm); const a=i/14*Math.PI*2; t.position.set(Math.cos(a)*(GR+0.01),Math.sin(a)*(GR+0.01),0); t.rotation.z=a; g.add(t); }
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.08,24),stdM(0x30343a,0.8,0.4)); hub.rotation.x=Math.PI/2; g.add(hub);
    for(let i=0;i<5;i++){ const h=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,0.06,16),stdM(0x1a1c1f,0.5,0.5)); const a=i/5*Math.PI*2; h.rotation.x=Math.PI/2; h.position.set(Math.cos(a)*0.19,Math.sin(a)*0.19,0); g.add(h); }
    sc.add(g); return g; };
  const gears=[sprocket(GC,-0.56),sprocket(GC,0.56),sprocket(BC,-0.56),sprocket(BC,0.56)];
  const axle=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,1.5,20),stdM(0x9aa3ad,1,0.3)); axle.rotation.x=Math.PI/2; axle.position.set(GC.x,GC.y,-0.1); sc.add(axle);
  // motor + gearbox + drive chain to a second sprocket on the axle (outside, z=-0.78)
  const MC=new THREE.Vector2(2.15,1.15);
  const motor=new THREE.Group(); motor.position.set(MC.x,MC.y,0.05); sc.add(motor);
  const motM=stdM(0x2f5f8a,0.5,0.35,{clearcoat:.6,emissive:0x2a8cff,emissiveIntensity:0});
  const mb=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.24,0.62,40),motM); mb.rotation.x=Math.PI/2; motor.add(mb);
  for(let i=0;i<8;i++){ const f=new THREE.Mesh(new THREE.TorusGeometry(0.245,0.012,6,40),motM); f.position.z=-0.25+i*0.07; motor.add(f); }
  const gb=new THREE.Mesh(rbox(0.42,0.46,0.3,0.05),stdM(0x3a4048,0.7,0.4)); gb.position.z=-0.45; motor.add(gb);
  const foot=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.06,0.9),stdM(0x2a2d31,0.6,0.5)); foot.position.set(0,-0.28,-0.15); motor.add(foot);
  const pul=sprocket(MC,-0.78); pul.scale.setScalar(0.35); const big=sprocket(GC,-0.78); big.scale.setScalar(0.75);
  const MR=GR*0.35, BR=GR*0.75, dv=new THREE.Vector2().subVectors(MC,GC), da=Math.atan2(dv.y,dv.x);
  const beltPts=[]; for(let a=da+Math.PI/2;a<=da+3*Math.PI/2+1e-3;a+=Math.PI/10) beltPts.push(new THREE.Vector3(GC.x+(BR+0.02)*Math.cos(a),GC.y+(BR+0.02)*Math.sin(a),-0.78));
  for(let a=da-Math.PI/2;a<=da+Math.PI/2+1e-3;a+=Math.PI/6) beltPts.push(new THREE.Vector3(MC.x+(MR+0.02)*Math.cos(a),MC.y+(MR+0.02)*Math.sin(a),-0.78));
  const belt=new THREE.CatmullRomCurve3(beltPts,true,'centripetal'); sc.add(new THREE.Mesh(new THREE.TubeGeometry(belt,200,0.02,6,true),stdM(0x3a3f45,1,0.4)));
  const NB=60, blinks=new THREE.InstancedMesh(new THREE.BoxGeometry(0.05,0.035,0.05),stdM(0xaeb6bf,1,0.3),NB); sc.add(blinks);
  // floors, skirt/cladding (fades to see-through), balustrade glass, handrail
  const stoneM=stdM(0x8a8e93,0.1,0.45,{clearcoat:.3,envMapIntensity:.3});
  const topF=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.2,2.4),stoneM); topF.position.set(1.62+1.3,3.5*T30-0.1+0.005,0); sc.add(topF);
  const comb=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.03,1.0),stdM(0xd9b41c,0.8,0.35)); comb.position.set(1.48,3.5*T30+0.015,0); sc.add(comb);
  const botF=new THREE.Mesh(new THREE.BoxGeometry(4,0.2,2.4),stoneM); botF.position.set(-4.85-2,-0.1,0); sc.add(botF);
  const cs=new THREE.Shape(); [[-5.0,-1.1],[-3.5,-1.1],[0.45,3.95*T30-1.1],[0.45,0.7],[2.75,0.7],[2.75,3.5*T30-0.01],[1.25,3.5*T30-0.01],[1.25,3.5*T30+0.1],[0,3.5*T30+0.1],[-3.5,0.1],[-5.0,0.1]].forEach(([x,y],i)=>i?cs.lineTo(x,y):cs.moveTo(x,y));
  const csG=new THREE.ExtrudeGeometry(cs,{depth:0.03,bevelEnabled:false});
  const cladM=stdM(0xb8bec6,0.95,0.32,{transparent:true,opacity:1});
  const clad=[-0.66,0.63].map(z=>{ const m=new THREE.Mesh(csG,cladM); m.position.z=z; sc.add(m); return m; });
  const cladE=new THREE.LineSegments(new THREE.EdgesGeometry(csG),new THREE.LineBasicMaterial({color:0x9fd8ff,transparent:true,opacity:0,toneMapped:false})); cladE.position.z=-0.66; sc.add(cladE);
  const gs=new THREE.Shape(); [[-4.3,0.12],[-3.5,0.12],[0,3.5*T30+0.12],[1.0,3.5*T30+0.12],[1.0,3.5*T30+0.9],[0,3.5*T30+0.9],[-3.5,0.9],[-4.3,0.9]].forEach(([x,y],i)=>i?gs.lineTo(x,y):gs.moveTo(x,y));
  const glassM=stdM(0xe6f2ff,0,0.05,{transparent:true,opacity:.1,clearcoat:1,depthWrite:false,side:THREE.DoubleSide});
  [-0.6,0.6].forEach(z=>{ const m=new THREE.Mesh(new THREE.ShapeGeometry(gs),glassM); m.position.z=z; sc.add(m); });
  const HS=[]; const HL=(a,b)=>HS.push(new THREE.LineCurve3(new THREE.Vector3(...a,0),new THREE.Vector3(...b,0)));
  const hy=3.5*T30+0.97, hr=0.09;
  HL([-4.3,0.97],[-3.5,0.97]); HL([-3.5,0.97],[0,hy]); HL([0,hy],[1.0,hy]);
  const hArc=(c,a0,a1)=>{ const cv=new THREE.Curve(); cv.getPoint=t=>{ const a=a0+(a1-a0)*t; return new THREE.Vector3(c[0]+hr*Math.cos(a),c[1]+hr*Math.sin(a),0); }; HS.push(cv); };
  hArc([1.0,hy-hr],Math.PI/2,-Math.PI/2); HL([1.0,hy-2*hr],[0,hy-2*hr]); HL([0,hy-2*hr],[-3.5,0.97-2*hr]); HL([-3.5,0.97-2*hr],[-4.3,0.97-2*hr]); hArc([-4.3,0.97-hr],-Math.PI/2,-3*Math.PI/2);
  const hPath=new THREE.CurvePath(); HS.forEach(c=>hPath.add(c)); const hLen=hPath.getLength();
  const hTex=canvasTex(512,16,(g,w,h)=>{ g.fillStyle='#141517'; g.fillRect(0,0,w,h); g.fillStyle='#55595f'; for(let x=0;x<w;x+=64) g.fillRect(x,0,6,h); }); hTex.wrapS=THREE.RepeatWrapping; hTex.repeat.set(Math.round(hLen/0.32)/8,1);
  const hM=new THREE.MeshPhysicalMaterial({map:hTex,roughness:.35,clearcoat:.8});
  [-0.6,0.6].forEach(z=>{ const m=new THREE.Mesh(new THREE.TubeGeometry(hPath,800,0.05,10,true),hM); m.position.z=z; sc.add(m); });
  const shd=shadowPlane(10,4,.6); shd.position.set(-1,-1.12,0); sc.add(shd);
  const A=(x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); sc.add(o); return o; };
  const aMot=A(2.15,1.38,-0.3), aGear=A(GC.x-0.2,GC.y-0.15,-0.6), aChain=A(-0.3,3.5*T30-0.3*T30-0.05,-0.56), aRail=A(-1.4,hy-1.4*T30,-0.6);
  const v=0.3, M4=new THREE.Matrix4(), Qz=new THREE.Quaternion(), SC1=new THREE.Vector3(1,1,1), Z=new THREE.Vector3(0,0,1), XA=new THREE.Euler(Math.PI/2,0,0), QX=new THREE.Quaternion().setFromEuler(XA);
  const V3=(a)=>new THREE.Vector3(...a);
  const C0=V3([-2.6,3.0,-12.5]), T0=V3([-0.6,1.7,0]), C1=V3([-0.5,2.8,-8.4]), T1=V3([1.15,1.95,0]);
  SCN[1]=function(lt){ const t=lt+0.6, d=v*t;
    steps.forEach((g,i)=>{ const q=at(i*sp+d); g.position.set(q.p.x,q.p.y,0); g.rotation.z=q.o; });
    for(let i=0;i<NL;i++){ const q=at(i*LOOP/NL+d); [-0.56,0.56].forEach((z,j)=>{ M4.compose(new THREE.Vector3(q.p.x,q.p.y,z),QX,SC1); links.setMatrixAt(i*2+j,M4); }); } links.instanceMatrix.needsUpdate=true;
    gears.forEach(g=>g.rotation.z=-d/GR); big.rotation.z=-d/GR; pul.rotation.z=-d*(BR/GR)/MR;
    for(let i=0;i<NB;i++){ const p=belt.getPointAt(((i/NB)-d*(BR/GR)/belt.getLength()%1+1)%1); M4.makeTranslation(p.x,p.y,p.z); blinks.setMatrixAt(i,M4); } blinks.instanceMatrix.needsUpdate=true;
    hTex.offset.x=-(d/hLen)*hTex.repeat.x;
    const cut=easeIO(cl((lt-0.55)/0.6)); cladM.opacity=1-0.93*cut; cladM.depthWrite=cut<0.5; cladE.material.opacity=0.45*cut;
    motM.emissiveIntensity=cl((lt-1.0)/0.2)*(0.25+0.1*Math.sin(lt*20)); chainM.emissiveIntensity=cl((lt-1.6)/0.3)*0.9;
    const z=easeIO(cl((lt-0.7)/2.2)); cam.position.copy(C0).lerp(C1,z); cam.lookAt(T0.clone().lerp(T1,z)); P.c.render();
    layoutLabels(labs(1,[[0,aMot,cl((lt-1.0)/0.25)],[1,aGear,cl((lt-1.4)/0.25)],[2,aChain,cl((lt-1.8)/0.25)],[3,aRail,cl((lt-2.2)/0.25)]]),cam,640,150);
    caption(1,lt); };
})();

// ---------- S2 /explode a car key (remote key fob): assembled fob + key blade, then the parts fly apart in build order
// (top shell, button pad, circuit board, coin battery, transponder chip, bottom shell, key blade); then a button press:
// the circuit board sends a radio signal (rings spread out).
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#22262e','#05060a'); ren.toneMappingExposure=0.6;
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.5,th:0.85});
  const key=new THREE.DirectionalLight(0xffffff,1.0); key.position.set(-3,7,5); sc.add(key); sc.add(new THREE.HemisphereLight(0xcfd8ff,0x141210,0.3));
  const rim=new THREE.DirectionalLight(0x9fc8ff,0.6); rim.position.set(4,3,-5); sc.add(rim);
  const K=new THREE.Group(); K.rotation.y=2.55; K.position.x=-0.45; sc.add(K);
  const flat=(g)=>{ g.rotateX(-Math.PI/2); return g; };
  const shellTop=stdM(0x0c0d0f,0.1,0.3,{clearcoat:1,clearcoatRoughness:.1,envMapIntensity:.5}), shellBot=stdM(0x070708,0.0,0.6,{clearcoat:.25,envMapIntensity:.12});
  const part=(obj,y)=>{ obj.position.y=y; obj.userData.y0=y; K.add(obj); return obj; };
  // top shell + bottom shell
  const topS=part(new THREE.Group(),0.24); topS.add(new THREE.Mesh(flat(rbox(0.8,1.6,0.14,0.34,6)),shellTop));
  const ring=new THREE.Mesh(new THREE.TorusGeometry(0.11,0.03,16,40),stdM(0xc9ced6,1,0.2)); ring.rotation.x=Math.PI/2; ring.position.set(0,0,0.95); topS.add(ring);
  const botS=part(new THREE.Group(),0.08); botS.add(new THREE.Mesh(flat(rbox(0.8,1.6,0.14,0.34,6)),shellBot));
  
  // button pad (rubber) with 3 buttons + printed icons
  const icon=(kind)=>canvasTex(128,128,(g,w,h)=>{ g.clearRect(0,0,w,h); g.strokeStyle='#f2f2f2'; g.fillStyle='#f2f2f2'; g.lineWidth=9; g.lineCap='round';
    if(kind<2){ g.fillRect(36,60,56,42); g.beginPath(); if(kind===0) g.arc(64,60,18,Math.PI,0); else g.arc(64,60,18,Math.PI,-0.35*Math.PI); g.stroke(); }
    else { g.beginPath(); g.moveTo(22,86); g.lineTo(30,62); g.lineTo(50,44); g.lineTo(84,44); g.lineTo(100,62); g.lineTo(106,86); g.closePath(); g.stroke(); g.fillRect(70,30,9,22); } });
  const pad=part(new THREE.Group(),0.27); const rubM=stdM(0x26282b,0,0.75);
  pad.add(new THREE.Mesh(new THREE.BoxGeometry(0.6,0.025,0.9),rubM));
  const btns=[]; [-0.33,-0.02,0.29].forEach((z,i)=>{ const b=new THREE.Group(); b.position.set(0,0.035,z); pad.add(b);
    b.add(new THREE.Mesh(flat(rbox(0.42,0.22,0.06,0.09,4)),rubM));
    const ic=new THREE.Mesh(new THREE.PlaneGeometry(0.17,0.17),new THREE.MeshBasicMaterial({map:icon(i),transparent:true,depthWrite:false})); ic.rotation.x=-Math.PI/2; ic.position.y=0.032; b.add(ic); btns.push(b); });
  // circuit board with traces, antenna, chip, switches, LED
  const pcbTex=canvasTex(256,512,(g,w,h)=>{ g.fillStyle='#14552a'; g.fillRect(0,0,w,h); g.strokeStyle='#c8a24a'; g.lineWidth=4; const R=rnd(9);
    for(let i=0;i<22;i++){ g.beginPath(); let x=20+R()*216,y=60+R()*420; g.moveTo(x,y); for(let k=0;k<3;k++){ if(k%2) x=20+R()*216; else y=60+R()*420; g.lineTo(x,y); } g.stroke(); }
    g.lineWidth=6; g.beginPath(); g.moveTo(24,30); for(let k=0;k<8;k++){ g.lineTo(24+k*28+14,k%2?12:48); } g.lineTo(232,30); g.stroke();
    g.fillStyle='#d9b35a'; for(let i=0;i<30;i++){ g.beginPath(); g.arc(20+R()*216,60+R()*420,5,0,7); g.fill(); } });
  const pcb=part(new THREE.Group(),0.2); const edgeM=stdM(0x0f3d1e,0.1,0.5);
  pcb.add(new THREE.Mesh(new THREE.BoxGeometry(0.66,0.03,1.34),[edgeM,edgeM,new THREE.MeshPhysicalMaterial({map:pcbTex,roughness:.5,clearcoat:.3,envMapIntensity:.35}),edgeM,edgeM,edgeM]));
  const ic1=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.035,0.2),stdM(0x111111,0.2,0.4)); ic1.position.set(0.12,0.03,0.2); pcb.add(ic1);
  for(let i=0;i<5;i++) [-1,1].forEach(s=>{ const pin=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.01,0.03),stdM(0xd0d4da,1,0.25)); pin.position.set(0.12+s*0.11,0.02,0.12+i*0.04); pcb.add(pin); });
  const xtal=new THREE.Mesh(flat(rbox(0.12,0.06,0.04,0.02)),stdM(0xd0d4da,1,0.2)); xtal.position.set(-0.15,0.035,0.45); pcb.add(xtal);
  [-0.33,-0.02,0.29].forEach(z=>{ const sw=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.04,0.14),stdM(0xc9ced6,1,0.25)); sw.position.set(0,0.035,z); pcb.add(sw);
    const c=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.03,20),stdM(0x1a1a1a,0,0.6)); c.position.set(0,0.06,z); pcb.add(c); });
  const ledM=new THREE.MeshStandardMaterial({color:0x550000,emissive:0xff2a1a,emissiveIntensity:0,toneMapped:false}); const led=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.03,0.04),ledM); led.position.set(-0.2,0.03,-0.1); pcb.add(led);
  // coin battery (under the board)
  const batTex=canvasTex(256,256,(g,w,h)=>{ const gr=g.createRadialGradient(128,128,10,128,128,128); gr.addColorStop(0,'#aeb3b9'); gr.addColorStop(1,'#737a82'); g.fillStyle=gr; g.fillRect(0,0,w,h);
    g.strokeStyle='rgba(60,64,70,.6)'; g.lineWidth=4; g.beginPath(); g.arc(128,128,112,0,7); g.stroke(); g.fillStyle='rgba(50,54,60,.75)'; g.fillRect(118,70,20,64); g.fillRect(96,92,64,20); });
  const bat=part(new THREE.Group(),0.15); const batSide=stdM(0xb7bec6,1,0.22);
  bat.add(new THREE.Mesh(new THREE.CylinderGeometry(0.21,0.21,0.035,64),[batSide,new THREE.MeshPhysicalMaterial({map:batTex,color:0x9aa0a8,metalness:1,roughness:.4,envMapIntensity:.25}),batSide])); bat.position.z=-0.25;
  // transponder chip: glass capsule with a copper coil + tiny chip inside (sits in the bottom shell)
  const tp=part(new THREE.Group(),0.13); tp.position.set(0.1,0.13,0.45); tp.rotation.y=Math.PI/2;
  { const cap=new THREE.Mesh(new THREE.CapsuleGeometry(0.06,0.3,8,24),stdM(0xe8f4ff,0,0.04,{transparent:true,opacity:.28,clearcoat:1,depthWrite:false})); cap.rotation.z=Math.PI/2; tp.add(cap); }
  const coilC=new THREE.Curve(); coilC.getPoint=t=>new THREE.Vector3(-0.12+0.2*t,0.038*Math.cos(t*Math.PI*44),0.038*Math.sin(t*Math.PI*44));
  tp.add(new THREE.Mesh(new THREE.TubeGeometry(coilC,500,0.006,5,false),stdM(0xc8743a,1,0.3,{emissive:0x3a1404,emissiveIntensity:.4})));
  const tchip=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.04,0.05),stdM(0x111111,0.2,0.4)); tchip.position.x=0.12; tp.add(tchip);
  // key blade (laser-cut groove) with its plastic root
  const blade=part(new THREE.Group(),0.16); const bsteel=stdM(0xdfe3e8,1,0.16);
  const bl=new THREE.Mesh(flat(rbox(0.24,1.05,0.07,0.05)),bsteel); bl.position.z=-1.3; blade.add(bl);
  const groove=new THREE.Curve(); groove.getPoint=t=>new THREE.Vector3(0.05*Math.sin(t*Math.PI*3.2),0.037,-0.85-0.85*t);
  blade.add(new THREE.Mesh(new THREE.TubeGeometry(groove,120,0.016,6,false),stdM(0x8a9097,1,0.4)));
  const root=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.12,0.12),shellBot); root.position.z=-0.8; blade.add(root);
  // radio rings
  const rings=[]; for(let i=0;i<4;i++){ const r=new THREE.Mesh(new THREE.TorusGeometry(1,0.012,8,96),glowMat(0x7fd8ff,0)); sc.add(r); rings.push(r); }
  const shd=shadowPlane(3.5,3.5,.75); shd.position.y=-0.6; sc.add(shd);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),stdM(0x0a0b0e,0.1,0.92,{envMapIntensity:.12})); floor.rotation.x=-Math.PI/2; floor.position.y=-0.61; sc.add(floor);
  const Ao=(par,x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); par.add(o); return o; };
  const aBat=Ao(bat,0.21,0,-0.0), aPcb=Ao(pcb,0.33,0.02,0.1), aTp=Ao(tp,0.15,0,0), aBl=Ao(blade,0.1,0.03,-1.1), ant=Ao(pcb,0,0.04,-0.55);
  // exploded heights, in build order
  const EX=[[topS,1.95,0.1],[pad,1.45,0.22],[pcb,0.95,0.34],[bat,0.5,0.46],[tp,0.12,0.58],[botS,-0.2,0.7]];
  const WP=new THREE.Vector3();
  SCN[2]=function(lt){
    EX.forEach(([o,y1,t0])=>{ const e=easeIO(cl((lt-t0)/0.7)); o.position.y=o.userData.y0+(y1-o.userData.y0)*e; });
    const eb=easeIO(cl((lt-0.8)/0.7)); blade.position.y=0.16+(0.0-0.16)*eb; blade.position.z=-0.75*eb;
    // press the unlock button: button dips, LED lights, the board sends a radio signal
    const pr=cl((lt-1.75)/0.12)*(1-cl((lt-2.0)/0.15)); btns[1].position.y=0.035-0.03*pr; ledM.emissiveIntensity=3*cl((lt-1.8)/0.08)*(1-cl((lt-2.6)/0.3));
    ant.getWorldPosition(WP);
    K.rotation.y=2.55+0.18*easeIO(cl(lt/3.4));
    const z=easeIO(cl((lt-0.05)/1.4)), z2=easeIO(cl((lt-1.6)/1.4)); const rad=5.2+3.9*z-0.25*z2;
    cam.position.set(1.5*rad/5.2,1.8+2.4*z,rad); cam.lookAt(-0.35-0.3*z,0.25+0.6*z+0.05*z2,0); cam.updateMatrixWorld(); ant.getWorldPosition(WP);
rings.forEach((r,i)=>{ const u=cl((lt-1.85-i*0.3)/1.3); r.visible=u>0&&u<1; r.position.copy(WP); r.lookAt(cam.position); r.scale.setScalar(0.15+1.5*ease(u)); r.material.opacity=0.5*(1-u)*cl(u/0.08); });
    P.c.render();
    layoutLabels2(labs(2,[[0,aBat,cl((lt-0.85)/0.2)],[1,aPcb,cl((lt-1.05)/0.2)],[2,aTp,cl((lt-1.25)/0.2)],[3,aBl,cl((lt-1.45)/0.2)]]),cam,640,130);
    caption(2,lt-0.9); };
})();
