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


const LA=(arr,cam,x,gap)=>layoutLabels(arr.map(([id,o,a])=>[document.getElementById(id),o,a]),cam,x,gap);
function dashTex(){ const t=canvasTex(256,16,(c,w,h)=>{ c.fillStyle='#000'; c.fillRect(0,0,w,h); const g=c.createLinearGradient(0,0,w,0);
  g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.55,'rgba(150,200,255,.25)'); g.addColorStop(.9,'rgba(220,240,255,1)'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  t.wrapS=THREE.RepeatWrapping; return t; }

// ---------- S0 /explain-3d how a plane flies: a white airliner (primitives) in a blue sky. Streamlines flow over and under the wing and
// bend DOWN behind it (the wing pushes air down); a big orange "Lift" arrow grows up out of the wing (air pushes the plane up).
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); bgGrad(sc,'#5e95d6','#0d2346');
  const env=hdrEnv(ren); sc.environment=env;
  const cam=new THREE.PerspectiveCamera(42,1080/1920,0.1,500);
  const sun=new THREE.DirectionalLight(0xffffff,2.0); sun.position.set(6,12,8); sc.add(sun); sc.add(new THREE.HemisphereLight(0xcfe4ff,0x2a3a55,0.6));
  const white=new THREE.MeshStandardMaterial({color:0xf4f6f8,roughness:.32,metalness:.15,envMapIntensity:.9});
  const grey=new THREE.MeshStandardMaterial({color:0xb9c2cc,roughness:.35,metalness:.4,envMapIntensity:.9});
  const dark=new THREE.MeshStandardMaterial({color:0x1b2330,roughness:.3,metalness:.3});
  const acc=new THREE.MeshStandardMaterial({color:0xff4b1f,roughness:.4,emissive:0xff4b1f,emissiveIntensity:.25});
  const P=new THREE.Group(); sc.add(P);
  // fuselage along x (nose +x)
  const fus=new THREE.Mesh(new THREE.CylinderGeometry(0.48,0.48,7,40),white); fus.rotation.z=Math.PI/2; P.add(fus);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(0.48,40,24,0,Math.PI*2,0,Math.PI/2),white); nose.rotation.z=-Math.PI/2; nose.scale.set(1,1.5,1); nose.position.x=3.5; P.add(nose);
  const tailc=new THREE.Mesh(new THREE.ConeGeometry(0.48,1.8,40),white); tailc.rotation.z=Math.PI/2; tailc.position.set(-4.4,0.12,0); tailc.scale.set(1,1,0.9); P.add(tailc);
  const win=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.12,0.7),dark); win.position.set(3.75,0.22,0); P.add(win);
  for(let i=0;i<14;i++){ for(const s of [-1,1]){ const w=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.1,0.02),dark); w.position.set(2.6-i*0.38,0.16,s*0.475); P.add(w); } }
  const stripe=new THREE.Mesh(new THREE.CylinderGeometry(0.485,0.485,6.4,40,1,true,Math.PI*1.35,Math.PI*0.3),acc); stripe.rotation.z=Math.PI/2; stripe.position.x=-0.2; P.add(stripe);
  // swept wing (one shape mirrored)
  function wingGeo(span,root,tip,sweep,th){ const s=new THREE.Shape(); s.moveTo(0,0); s.lineTo(-sweep,span); s.lineTo(-sweep-tip,span); s.lineTo(-root,0); s.lineTo(0,0);
    const g=new THREE.ExtrudeGeometry(s,{depth:th,bevelEnabled:true,bevelThickness:th*0.4,bevelSize:th*0.4,bevelSegments:2}); g.rotateX(Math.PI/2); return g; }
  const WY=-0.22, WX=0.9;
  for(const s of [1,-1]){ const w=new THREE.Mesh(wingGeo(4.4,1.9,0.6,1.9,0.07),white); w.position.set(WX,WY,0); if(s<0){ w.scale.z=-1; } else { w.scale.z=1; } w.rotation.x=0; w.scale.z*=-1; P.add(w);
    const st=new THREE.Mesh(wingGeo(1.1,0.9,0.4,0.9,0.06),white); st.position.set(-3.6,0.15,0); st.scale.z=-s; P.add(st);
    const eng=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.24,1.0,32),grey); eng.rotation.z=Math.PI/2; eng.position.set(WX-0.15-0.55,WY-0.38,s*1.55); P.add(eng);
    const inl=new THREE.Mesh(new THREE.TorusGeometry(0.27,0.04,12,32),dark); inl.rotation.y=Math.PI/2; inl.position.set(WX-0.15-0.05,WY-0.38,s*1.55); P.add(inl);
    const tipw=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.45,0.04),acc); tipw.position.set(WX-2.25,WY+0.2,s*4.4); P.add(tipw); }
  const fin=new THREE.Mesh(wingGeo(1.6,1.4,0.55,1.2,0.06),white); fin.rotation.set(-Math.PI/2,0,0); fin.position.set(-3.5,0.35,0.03); P.add(fin);
  const finAcc=new THREE.Mesh(wingGeo(0.5,0.75,0.6,0.38,0.065),acc); finAcc.rotation.set(-Math.PI/2,0,0); finAcc.position.set(-4.62,1.45,0.035); P.add(finAcc);
  // streamlines (in plane space): flow -x, bend down behind the wing
  const dt=dashTex(), streams=[];
  [-3.6,-2.4,-1.2,1.2,2.4,3.6].forEach((z,zi)=>{ [0.55,-0.95].forEach((y0,k)=>{ const az=Math.abs(z); const xle=WX-az*0.43, xte=xle-1.9+az*0.3;
      const pts=[]; for(let x=10;x>=-14;x-=0.5){ let y=y0+WY; if(k===0) y+=0.28*Math.exp(-Math.pow((x-(xle+xte)/2)/1.1,2));
        if(x<xte) y-=1.7*(1-Math.exp(-(xte-x)/3.2))*(1-az/7); pts.push(new THREE.Vector3(x,y,z)); }
      const cv=new THREE.CatmullRomCurve3(pts); const tx=dt.clone(); tx.needsUpdate=true; tx.repeat.set(5,1);
      const m=new THREE.Mesh(new THREE.TubeGeometry(cv,160,0.035,6,false),new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
      P.add(m); streams.push({m,tx,ph:(zi*0.37+k*0.21)%1}); }); });
  // lift arrow
  const arrow=new THREE.Group(); const am=new THREE.MeshBasicMaterial({color:0xff5a2a,toneMapped:false});
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,2.6,32),am); shaft.position.y=1.3; arrow.add(shaft);
  const head=new THREE.Mesh(new THREE.ConeGeometry(0.55,1.0,32),am); head.position.y=3.0; arrow.add(head); arrow.position.set(0.2,0.4,0); P.add(arrow);
  const liftT=liveTag(400,150,1.8,{font:'900 84px Inter, Arial',bg:'rgba(255,75,31,.0)',fg:'#ffffff',hh:56}); liftT.set('Lift'); P.add(liftT);
  // down arrow behind the wing (air pushed down)
  const darrow=new THREE.Group(); const dm=new THREE.MeshBasicMaterial({color:0xbfe0ff,transparent:true,opacity:0,toneMapped:false});
  const ds=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,1.2,20),dm); ds.position.y=-0.6; darrow.add(ds);
  const dh=new THREE.Mesh(new THREE.ConeGeometry(0.3,0.55,24),dm); dh.rotation.z=Math.PI; dh.position.y=-1.4; darrow.add(dh); darrow.position.set(-3.2,-0.8,2.4); P.add(darrow);
  const an=[new THREE.Object3D(),new THREE.Object3D()]; P.add(an[0]); an[0].position.set(WX-1.6,WY,3.0); P.add(an[1]); an[1].position.set(-4.5,-1.4,-2.4);
  SCN[0]=function(lt){
    const climb=lt*0.25; P.position.set(0,climb-0.4,0); P.rotation.set(0.0,0,0.05+0.03*Math.sin(lt*1.3));
    streams.forEach(s=>{ s.tx.offset.x=-(lt*1.1+s.ph); s.m.material.opacity=cl((lt-0.15)/0.4); });
    const ga=backOut(cl((lt-0.5)/0.5)); arrow.scale.set(Math.max(.001,cl(ga*1.4)),Math.max(.001,ga),Math.max(.001,cl(ga*1.4)));
    liftT.position.set(-1.25,0.4+3.3*ga,0); liftT.material.opacity=cl((lt-0.75)/0.25);
    dm.opacity=0.85*cl((lt-0.9)/0.3); darrow.position.y=-0.8-0.25*((lt*1.3)%1);
    const u=easeIO(cl(lt/3.2)); cam.position.set(7.5+2*u,10.5-1.2*u,21.5-1.0*u); cam.lookAt(-0.3,0.2+climb*0.5,0);
    LA([['l0_0',an[0],cl((lt-0.45)/0.25)],['l0_1',an[1],cl((lt-0.65)/0.25)]],cam,640,150);
    ren.render(sc,cam); caption(0,lt); };
})();

// ---------- S1 /cutaway a rocket: a two-stage rocket stands in a dark studio; a quarter of its skin slides away and the tanks fill:
// liquid oxygen (blue) above the fuel (amber) in each stage, payload under the nose cone, engines firing below. Most of it is tank.
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); bgGrad(sc,'#2b3038','#07080a');
  sc.environment=hdrEnv(ren);
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,500);
  const key=new THREE.DirectionalLight(0xffffff,1.6); key.position.set(6,8,10); sc.add(key); sc.add(new THREE.AmbientLight(0x404858,0.4));
  const R=new THREE.Group(); sc.add(R); R.position.set(-2.6,0,0); R.scale.set(1.35,1,1.35);
  const skin=new THREE.MeshStandardMaterial({color:0x9da1a8,roughness:.45,metalness:.25,side:THREE.DoubleSide,envMapIntensity:.9});
  const inner=new THREE.MeshStandardMaterial({color:0x2a2e34,roughness:.6,metalness:.4,side:THREE.BackSide});
  const blk=new THREE.MeshStandardMaterial({color:0x16181c,roughness:.4,metalness:.3});
  const CUT=Math.PI*0.62; // open sector facing camera
  // stage 1: y 0..8, r 0.9 ; interstage 8..8.7 ; stage 2: 8.7..11.6 ; fairing 11.6..14
  function shell(y0,y1,r,mat){ const g=new THREE.CylinderGeometry(r,r,y1-y0,64,1,true,CUT/2,Math.PI*2-CUT); const m=new THREE.Mesh(g,mat); m.position.y=(y0+y1)/2; R.add(m); return m; }
  function panel(y0,y1,r){ const g=new THREE.CylinderGeometry(r,r,y1-y0,32,1,true,-CUT/2,CUT); const m=new THREE.Mesh(g,skin); m.position.y=(y0+y1)/2; R.add(m); return m; }
  shell(0,8,0.9,skin); shell(0,8,0.88,inner); shell(8.7,11.6,0.9,skin); shell(8.7,11.6,0.88,inner);
  const inter=new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,0.7,64),blk); inter.position.y=8.35; R.add(inter);
  const panels=[panel(0,8,0.905),panel(8.7,11.6,0.905)];
  // fairing (cut open too)
  const fp=[]; for(let i=0;i<=24;i++){ const t=i/24; fp.push(new THREE.Vector2(0.9*Math.sqrt(1-Math.pow(t,1.8))+0.001,11.6+2.6*t)); }
  const fair=new THREE.Mesh(new THREE.LatheGeometry(fp,64,CUT/2,Math.PI*2-CUT),skin); R.add(fair);
  const fairP=new THREE.Mesh(new THREE.LatheGeometry(fp,32,-CUT/2,CUT),skin); R.add(fairP); panels.push(fairP);
  // tanks
  const lox=new THREE.MeshStandardMaterial({color:0x2f8cff,roughness:.25,metalness:.1,emissive:0x0a3a9a,emissiveIntensity:.5,envMapIntensity:.6});
  const rp=new THREE.MeshStandardMaterial({color:0xff7a1a,roughness:.3,metalness:.1,emissive:0x7a2a00,emissiveIntensity:.5,envMapIntensity:.6});
  function tank(y0,y1,r,mat){ const g=new THREE.Group(); const h=y1-y0-2*r*0.5; const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,48),mat); g.add(c);
    const a=new THREE.Mesh(new THREE.SphereGeometry(r,48,16,0,Math.PI*2,0,Math.PI/2),mat); a.scale.y=0.5; a.position.y=h/2; g.add(a);
    const b=a.clone(); b.rotation.x=Math.PI; b.position.y=-h/2; g.add(b); g.position.y=(y0+y1)/2; R.add(g); return g; }
  const T=[tank(0.9,4.4,0.8,rp),tank(4.55,7.9,0.8,lox),tank(8.9,10.0,0.8,rp),tank(10.1,11.45,0.8,lox)];
  // payload
  const sat=new THREE.Group(); const sb=new THREE.Mesh(rbox(0.9,1.1,0.9,0.08),new THREE.MeshStandardMaterial({color:0xd4a64a,roughness:.3,metalness:.8})); sat.add(sb);
  const sp=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.9,0.5),new THREE.MeshStandardMaterial({color:0x1d3a7a,roughness:.3,metalness:.5})); sp.position.x=0.5; sat.add(sp); const sp2=sp.clone(); sp2.position.x=-0.5; sat.add(sp2);
  sat.position.y=12.4; R.add(sat);
  // engines + flames
  const bellM=new THREE.MeshStandardMaterial({color:0x3a3f47,roughness:.35,metalness:.8,side:THREE.DoubleSide});
  const flames=[]; [[0,0],[0.45,0.3],[-0.45,0.3],[0.45,-0.3],[-0.45,-0.3]].forEach(([x,z])=>{ const b=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.24,0.5,24,1,true),bellM); b.position.set(x,-0.25,z); R.add(b);
    const f=new THREE.Mesh(new THREE.ConeGeometry(0.22,1.6,24,1,true),glowMat(0xffa040,.85)); f.rotation.x=Math.PI; f.position.set(x,-1.3,z); R.add(f);
    const f2=new THREE.Mesh(new THREE.ConeGeometry(0.11,1.0,16,1,true),glowMat(0xffffff,.9)); f2.rotation.x=Math.PI; f2.position.set(x,-0.95,z); R.add(f2); flames.push(f,f2); });
  const fl=new THREE.PointLight(0xff8a30,3,8); fl.position.set(0,-1.2,1); R.add(fl);
  const an=[0,1,2,3].map(()=>new THREE.Object3D()); sat.add(an[0]); an[0].position.set(0.45,0,0.4); T[0].add(an[1]); an[1].position.set(0.5,0,0.6); T[1].add(an[2]); an[2].position.set(0.5,0.4,0.6); R.add(an[3]); an[3].position.set(0.3,-0.5,0.3);
  const P=mkComposer(SHARED,sc,cam,{bloom:0.55,radius:0.5,th:0.92}); const g2=document.getElementById('cv1').getContext('2d');
  SCN[1]=function(lt){
    const op=easeIO(cl((lt-0.1)/0.5)); panels.forEach(p=>{ p.position.z=op*3.5; p.position.x=op*1.2; p.rotation.y=0; p.material.opacity=1; p.visible=op<0.98; });
    T.forEach((t,i)=>{ const u=easeOut2(cl((lt-0.3-i*0.1)/0.45)); t.scale.set(1,Math.max(.001,u),1); t.visible=u>0.01; });
    const ig=cl((lt-0.2)/0.3); flames.forEach((f,i)=>{ const k=ig*(0.9+0.12*Math.sin(lt*47+i*1.7)+0.06*Math.sin(lt*91+i)); f.scale.set(1,Math.max(.001,k),1); }); fl.intensity=3*ig;
    R.position.y=-0.15*lt*lt; R.rotation.y=-0.25+0.12*lt;
    const u=easeIO(cl(lt/2.8)); const ty=6.0+1.0*(1-u); cam.position.set(0.0,ty+1.5,52-5*(1-u)); cam.lookAt(0,ty+0.2,0);
    LA([['l1_0',an[0],cl((lt-0.55)/0.2)],['l1_1',an[2],cl((lt-0.7)/0.2)],['l1_2',an[1],cl((lt-0.85)/0.2)],['l1_3',an[3],cl((lt-1.0)/0.2)]],cam,640,170);
    P.c.render(); g2.drawImage(SHARED.domElement,0,0); caption(1,lt); };
})();

// ---------- S2 /orbit the space station: Earth with an orbit ring ~400 km up (true to scale: 1.063 x Earth radius). A small station
// (truss, modules, 8 solar wings; drawn much bigger than scale) flies one full lap while a clock runs to ~90 min.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020308); starField(sc,2400,77,600);
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.05,3000);
  const sun=new THREE.DirectionalLight(0xffffff,2.4); sun.position.set(10,4,8); sc.add(sun); sc.add(new THREE.AmbientLight(0x2a3550,0.4));
  const RE=2.6, RO=RE*(6371+400)/6371;
  const earth=new THREE.Mesh(new THREE.SphereGeometry(RE,96,64),new THREE.MeshStandardMaterial({map:earthTex(),roughness:.7,emissive:0x0a1a3a,emissiveIntensity:.25})); sc.add(earth);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(RE*1.035,64,40),glowMat(0x5aa0ff,.18)); sc.add(atm);
  const O=new THREE.Group(); O.rotation.x=0.42; O.rotation.z=-0.32; sc.add(O);
  const circ=new THREE.Curve(); circ.getPoint=function(t){ const a=-t*Math.PI*2+Math.PI*0.5; return new THREE.Vector3(Math.cos(a)*RO,0,Math.sin(a)*RO); };
  const ring=new THREE.Mesh(new THREE.TubeGeometry(circ,300,0.014,8,true),glowMat(0xff6a3d,.95)); O.add(ring);
  const iss=new THREE.Group(); const gm=new THREE.MeshStandardMaterial({color:0xd8dade,roughness:.4,metalness:.6});
  const pm=new THREE.MeshStandardMaterial({map:canvasTex(64,128,(c,w,h)=>{ c.fillStyle='#b8862a'; c.fillRect(0,0,w,h); c.strokeStyle='#5a3d10'; c.lineWidth=2; for(let i=0;i<w;i+=8){ c.beginPath(); c.moveTo(i,0); c.lineTo(i,h); c.stroke(); } for(let j=0;j<h;j+=8){ c.beginPath(); c.moveTo(0,j); c.lineTo(w,j); c.stroke(); } }),roughness:.35,metalness:.7,emissive:0x2a1a05,side:THREE.DoubleSide});
  const truss=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.04,0.04),gm); iss.add(truss);
  [-0.42,-0.3,0.3,0.42].forEach(x=>{ [1,-1].forEach(s=>{ const p=new THREE.Mesh(new THREE.PlaneGeometry(0.09,0.34),pm); p.position.set(x,0,s*0.2); p.rotation.x=-Math.PI/2; iss.add(p); }); });
  const mod=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.42,16),gm); mod.rotation.x=Math.PI/2; mod.position.set(0,-0.03,0.0); iss.add(mod);
  const mod2=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.2,16),gm); mod2.rotation.z=Math.PI/2; mod2.position.set(0,-0.03,0.2); iss.add(mod2);
  const rad=new THREE.Mesh(new THREE.PlaneGeometry(0.12,0.2),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.6,side:THREE.DoubleSide})); rad.position.set(0.12,0,-0.12); rad.rotation.x=-Math.PI/2; iss.add(rad);
  iss.scale.setScalar(0.85); O.add(iss);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(64,64,(c,w,h)=>{ const g=c.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,'rgba(255,200,160,.9)'); g.addColorStop(1,'rgba(255,120,60,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false})); O.add(glow);
  const clk=liveTag(640,160,2.0,{font:'900 86px Inter, Arial',bg:'rgba(255,75,31,.95)',fg:'#fff',hh:62}); sc.add(clk);
  const an=[new THREE.Object3D(),new THREE.Object3D()]; iss.add(an[0]); an[0].position.set(0.1,0.05,0); iss.add(an[1]); an[1].position.set(-0.1,-0.05,0);
  const L0=0.7, L1=2.4;
  SCN[2]=function(lt){ earth.rotation.y=0.4+lt*0.12;
    const pop=backOut(cl(lt/0.45)); earth.scale.setScalar(Math.max(.001,pop)); atm.scale.setScalar(Math.max(.001,pop));
    const lap=easeIO(cl((lt-L0)/(L1-L0))); const tt=0.02+lap; // fraction of the lap
    ring.geometry.setDrawRange(0,Math.floor(cl(tt)*300)*8*6);
    const p=circ.getPoint(tt%1), p2=circ.getPoint((tt+0.002)%1); iss.position.copy(p); iss.lookAt(O.localToWorld(p2.clone())); glow.position.copy(p); glow.scale.setScalar(0.5);
    iss.visible=lt>0.15; ring.visible=lt>0.2;
    const mins=Math.round(lap*90); clk.set(mins+' min'); clk.position.set(0,-RE-0.75,0.5); clk.material.opacity=cl((lt-0.95)/0.2);
    const u=easeIO(cl(lt/2.6)); cam.position.set(0.4,1.6+0.6*u,12.5+3.0*u); cam.lookAt(0,-0.25,0);
    const la=cl((lt-0.6)/0.25);
    [['l2_0',70,la],['l2_1',672,cl((lt-0.8)/0.25)]].forEach(([id,x,a])=>{ const el=document.getElementById(id); el.style.left=x+'px'; el.style.top='1488px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld) ld.style.display='none'; });
    ren.render(sc,cam); caption(2,lt); };
})();
