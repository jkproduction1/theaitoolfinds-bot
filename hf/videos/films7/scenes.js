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


// ---------- 2D-in-3D helper: draw with a 2D canvas, show it as a full-screen quad (so bloom still works)
function flat2D(id,bloom){ const ren=mkRenderer2(id);
  const sc=new THREE.Scene(), cam=new THREE.OrthographicCamera(-1,1,1,-1,0,2); cam.position.z=1;
  const c=document.createElement('canvas'); c.width=1080; c.height=1920; const g=c.getContext('2d');
  const tx=new THREE.CanvasTexture(c); tx.encoding=THREE.sRGBEncoding;
  sc.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({map:tx,toneMapped:false})));
  const P=bloom?mkComposer(ren,sc,cam,bloom):null;
  return {g,draw(){ tx.needsUpdate=true; if(P) P.c.render(); else ren.render(sc,cam); }}; }
const hsh=(i,j)=>{ const s=Math.sin(i*127.1+(j||0)*311.7)*43758.5453; return s-Math.floor(s); };
// stick-figure pose (canvas coords, y down). kind: 'run' | 'walk'. returns joints
function pose(ph,kind,o){ o=o||{}; const A=kind==='run'?0.75:0.38, s=Math.sin(ph), c=Math.cos(ph);
  const hip=[o.x||0,(o.y||0)-(kind==='run'?7*Math.abs(c):3*Math.abs(c))], lean=o.lean??(kind==='run'?0.22:0.06);
  const neck=[hip[0]+Math.sin(lean)*74,hip[1]-Math.cos(lean)*74], head=[neck[0]+Math.sin(lean)*28,neck[1]-Math.cos(lean)*28];
  const leg=(a,b)=>{ const k=[hip[0]+Math.sin(a)*52,hip[1]+Math.cos(a)*52]; const sa=a-b; return [k,[k[0]+Math.sin(sa)*52,k[1]+Math.cos(sa)*52]]; };
  const bl=kind==='run'?1.1:0.45, L1=leg(A*s,0.15+bl*Math.max(0,-c)), L2=leg(-A*s,0.15+bl*Math.max(0,c));
  const sh=[hip[0]+Math.sin(lean)*60,hip[1]-Math.cos(lean)*60];
  const arm=(a,b)=>{ const e=[sh[0]+Math.sin(a)*40,sh[1]+Math.cos(a)*40]; return [e,[e[0]+Math.sin(a+b)*36,e[1]+Math.cos(a+b)*36]]; };
  const R1=o.armUp?arm(Math.PI-0.35,0.15):arm(-A*1.1*s,kind==='run'?-1.3:-0.35), R2=arm(A*1.1*s,kind==='run'?-1.3:-0.35);
  return {hip,neck,head,sh,L1,L2,R1,R2}; }
function strokeFig(g,p,jit){ const J=(q,i)=>jit?[q[0]+(hsh(i,jit)-.5)*3,q[1]+(hsh(i+9,jit)-.5)*3]:q; let i=0;
  const seg=(a,b,c)=>{ g.beginPath(); const A=J(a,i++),B=J(b,i++); g.moveTo(A[0],A[1]); g.lineTo(B[0],B[1]); if(c){ const C=J(c,i++); g.lineTo(C[0],C[1]); } g.stroke(); };
  seg(p.hip,p.neck); seg(p.hip,p.L1[0],p.L1[1]); seg(p.hip,p.L2[0],p.L2[1]); seg(p.sh,p.R1[0],p.R1[1]); seg(p.sh,p.R2[0],p.R2[1]);
  g.beginPath(); const H=J(p.head,i++); g.arc(H[0],H[1],24,0,Math.PI*2); g.stroke(); }

// ---------- S0 /zack-d-films what if you jumped on the Moon: an astronaut crouches and jumps; low gravity carries him
// high and slow, dust flies out in clean arcs (no air on the Moon), Earth hangs in the black sky. Moon gravity ≈ 1/6 of Earth's.
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); 
  sc.background=new THREE.Color(0x020203); const cam=new THREE.PerspectiveCamera(38,1080/1920,0.1,600);
  const sun=new THREE.DirectionalLight(0xfff6ea,1.7); sun.position.set(14,10,8); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-12,right:12,top:14,bottom:-6,far:60}); sun.shadow.bias=-0.0005; sc.add(sun); sc.add(new THREE.HemisphereLight(0x8090b0,0x202020,0.12));
  // ground with craters
  const gg=new THREE.PlaneGeometry(140,140,260,260); gg.rotateX(-Math.PI/2); const pp=gg.attributes.position; const R=rnd(7); const cr=[];
  for(let i=0;i<70;i++) cr.push([R()*120-60,R()*120-80,0.6+R()*R()*5]);
  for(let i=0;i<pp.count;i++){ const x=pp.getX(i), z=pp.getZ(i); let y=0.15*Math.sin(x*0.3)*Math.cos(z*0.27)+0.08*Math.sin(x*1.3+z*0.7);
    for(const [cx,cz,r] of cr){ const d=Math.hypot(x-cx,z-cz)/r; if(d<1.4) y+= d<1? -0.32*r*(1-d*d)*0.35 : 0.12*r*Math.sin((d-1)/0.4*Math.PI)*0.35; } pp.setY(i,y); }
  gg.computeVertexNormals();
  const gtex=canvasTex(512,512,(c,w,h)=>{ c.fillStyle='#8a8a88'; c.fillRect(0,0,w,h); for(let i=0;i<9000;i++){ const v=110+R()*60|0; c.fillStyle=`rgba(${v},${v},${v-4},.35)`; c.fillRect(R()*w,R()*h,1+R()*2,1+R()*2); } });
  gtex.wrapS=gtex.wrapT=THREE.RepeatWrapping; gtex.repeat.set(24,24);
  const ground=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({color:0x8e8d89,map:gtex,roughness:1,metalness:0,envMapIntensity:0.15})); ground.receiveShadow=true; sc.add(ground);
  // stars + Earth
  const sp=[]; for(let i=0;i<1500;i++){ const th=R()*Math.PI*2, ph=R()*0.9+0.08, r=400; sp.push(Math.cos(th)*Math.cos(ph)*r,Math.sin(ph)*r,Math.sin(th)*Math.cos(ph)*r-60); }
  const sg=new THREE.BufferGeometry(); sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sc.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.1,sizeAttenuation:false,toneMapped:false})));
  const etex=canvasTex(1024,512,(c,w,h)=>{ c.fillStyle='#1d4fa8'; c.fillRect(0,0,w,h); const r=rnd(3);
    for(let i=0;i<22;i++){ c.fillStyle=i%3?'#3f8a4a':'#b59a62'; c.beginPath(); const x=r()*w,y=h*.2+r()*h*.6; for(let k=0;k<14;k++){ const a=k/14*Math.PI*2, rr=30+r()*70; c.lineTo(x+Math.cos(a)*rr*1.4,y+Math.sin(a)*rr*.8); } c.fill(); }
    for(let i=0;i<60;i++){ c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(r()*w,r()*h,40+r()*90,8+r()*14,r()*.5,0,Math.PI*2); c.fill(); } });
  const earth=new THREE.Mesh(new THREE.SphereGeometry(6,64,40),new THREE.MeshStandardMaterial({map:etex,roughness:.7,emissive:0x0a1a3a,emissiveIntensity:.3})); earth.position.set(-62,29,-120); sc.add(earth);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(6.4,48,32),glowMat(0x5aa0ff,.18)); atm.position.copy(earth.position); sc.add(atm);
  // astronaut
  const suit=new THREE.MeshStandardMaterial({color:0xd8d8d2,roughness:.75,envMapIntensity:.35}), dark=new THREE.MeshStandardMaterial({color:0x6d7178,roughness:.6}), visor=new THREE.MeshStandardMaterial({color:0xd6a53a,metalness:1,roughness:.12,envMapIntensity:1.2});
  sc.environment=hdrEnv(ren);
  const cap=(r,l,m)=>{ const o=new THREE.Mesh(new THREE.CapsuleGeometry(r,l,8,18),m); o.castShadow=true; return o; };
  const man=new THREE.Group(); sc.add(man); const body=new THREE.Group(); man.add(body); body.position.y=1.15;
  const torso=cap(0.36,0.55,suit); torso.position.y=0.45; body.add(torso);
  const pack=new THREE.Mesh(rbox(0.62,0.8,0.32,0.08),suit); pack.position.set(0,0.5,-0.38); pack.castShadow=true; body.add(pack);
  const helmet=new THREE.Mesh(new THREE.SphereGeometry(0.34,40,28),suit); helmet.position.y=1.18; helmet.castShadow=true; body.add(helmet);
  const vz=new THREE.Mesh(new THREE.SphereGeometry(0.3,40,28,-Math.PI*0.42,Math.PI*0.84,Math.PI*0.25,Math.PI*0.45),visor); vz.position.set(0,1.18,0.05); vz.rotation.y=0; body.add(vz);
  const limb=(px,py,l1,l2,r,m)=>{ const a=new THREE.Group(); a.position.set(px,py,0); const u=cap(r,l1,m); u.position.y=-l1/2-r*.3; a.add(u); const b=new THREE.Group(); b.position.y=-l1-r*.4; a.add(b); const d=cap(r*.92,l2,m); d.position.y=-l2/2-r*.3; b.add(d); return [a,b]; };
  const [lA,lB]=limb(-0.2,0.05,0.42,0.42,0.15,suit), [rA,rB]=limb(0.2,0.05,0.42,0.42,0.15,suit); body.add(lA); body.add(rA);
  const bootL=new THREE.Mesh(rbox(0.26,0.14,0.42,0.05),dark); bootL.position.set(0,-0.52,0.07); lB.add(bootL); const bootR=bootL.clone(); rB.add(bootR);
  const [alA,alB]=limb(-0.47,0.78,0.36,0.34,0.12,suit), [arA,arB]=limb(0.47,0.78,0.36,0.34,0.12,suit); body.add(alA); body.add(arA);
  man.rotation.y=0.55;
  // dust: grains fly in clean ballistic arcs (no air), gravity g=1.62 m/s² scaled
  const N=420, dp=new Float32Array(N*3), dv=[]; for(let i=0;i<N;i++){ const a=R()*Math.PI*2, s=0.6+R()*1.8; dv.push([Math.cos(a)*s,1.0+R()*2.2,Math.sin(a)*s,R()*0.12]); }
  const dg=new THREE.BufferGeometry(); dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
  const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xc9c6bd,size:0.05,transparent:true,opacity:.9})); sc.add(dust);
  const T0=0.42, FL=2.6, HMAX=3.2;
  SCN[0]=function(lt0){ const lt=lt0*1.15;
    const crouch=cl(lt/T0), air=cl((lt-T0)/FL), inAir=lt>T0 && air<1;
    const y=inAir?HMAX*4*air*(1-air):0; const sq=lt<T0?Math.sin(crouch*Math.PI/2)*0.32:inAir?0:0;
    body.position.y=1.15-sq+y;
    const tuck=inAir?Math.sin(air*Math.PI):0;
    lA.rotation.x=-0.5*crouch*(lt<T0?1:0)-0.9*tuck; lB.rotation.x=1.0*crouch*(lt<T0?1:0)+1.4*tuck; rA.rotation.x=lA.rotation.x+0.2*tuck; rB.rotation.x=lB.rotation.x-0.1*tuck;
    alA.rotation.z=-0.25-1.6*tuck; arA.rotation.z=0.25+1.6*tuck; alA.rotation.x=0.5*crouch*(lt<T0?1:0); arA.rotation.x=alA.rotation.x; alB.rotation.x=-0.4; arB.rotation.x=-0.4;
    body.rotation.x=0.18*crouch*(lt<T0?1:0)-0.1*tuck;
    const dt=lt-T0; for(let i=0;i<N;i++){ const v=dv[i]; const tt=Math.max(0,dt-v[3]); let x=v[0]*tt, yy=0.05+v[1]*tt-0.81*tt*tt, z=v[2]*tt; if(yy<0.02){ yy=0.02; } if(dt<v[3]){ x=0; yy=-5; z=0; }
      const r=Math.hypot(v[0],v[2])*0.12; dp[i*3]=x+Math.sign(v[0])*r; dp[i*3+1]=yy; dp[i*3+2]=z; }
    dg.attributes.position.needsUpdate=true; dust.material.opacity=0.9*(1-cl((dt-2.2)/0.8));
    cam.position.set(4.0+0.25*lt, 1.6+0.25*y, 11.5-0.4*cl(lt/2)); cam.lookAt(0,2.6+0.3*y,0);
    ren.render(sc,cam); caption(0,lt); };
})();

// ---------- S1 /neon-silhouette a stick figure running through the city at night: a glowing pink stick figure runs, the skyline
// slides past in two layers, every step leaves a cyan light trail, the wet street mirrors it all.
(function(){ const F=flat2D('cv1'), g=F.g; const R=rnd(21); const GY=1260, FX=470, V=520;
  const B1=[],B2=[]; for(let i=0;i<40;i++){ B1.push([i*150+R()*40,90+R()*170,110+R()*60,R()]); B2.push([i*120+R()*30,220+R()*420,90+R()*50,R()]); }
  SCN[1]=function(lt0){ const lt=lt0*1.1, X=lt*V, ph=lt*Math.PI*2*2.2;
    const gr=g.createLinearGradient(0,0,0,GY); gr.addColorStop(0,'#05030f'); gr.addColorStop(0.7,'#1a0b3a'); gr.addColorStop(1,'#3a0f4a'); g.fillStyle=gr; g.fillRect(0,0,1080,1920);
    g.fillStyle='rgba(255,90,200,.15)'; g.beginPath(); g.arc(780,600,120,0,Math.PI*2); g.fill();
    const bld=(L,par,col,win)=>{ for(const [bx,bh,bw,r] of L){ const x=((bx-X*par)%6000+6000)%6000-200; if(x>1100||x+bw<-20) continue; g.fillStyle=col; g.fillRect(x,GY-bh,bw,bh);
        if(win){ for(let wy=GY-bh+20;wy<GY-20;wy+=34) for(let wx=x+14;wx<x+bw-18;wx+=28){ const on=hsh(Math.round(wx+bx),wy)>0.55; if(on){ g.fillStyle=hsh(wx,wy+1)>.5?'rgba(255,214,120,.85)':'rgba(120,230,255,.75)'; g.fillRect(wx,wy,12,16); } } }
        if(r>0.7){ g.save(); g.strokeStyle=r>0.85?'#2ff3ff':'#ff3fd0'; g.lineWidth=6; g.shadowColor=g.strokeStyle; g.shadowBlur=20; g.strokeRect(x+12,GY-bh+30,bw-24,40); g.restore(); } } };
    bld(B1,0.15,'#120a2a',false); bld(B2,0.4,'#0b0718',true);
    g.fillStyle='#07040f'; g.fillRect(0,GY,1080,1920-GY);
    // street lines
    g.strokeStyle='rgba(255,63,208,.5)'; g.lineWidth=4; for(let i=0;i<12;i++){ const x=((i*160-X)%1920+1920)%1920-200; g.beginPath(); g.moveTo(x,GY+120); g.lineTo(x+90,GY+120); g.stroke(); }
    const fig=(p,col,w,a)=>{ g.save(); g.globalAlpha=a; g.lineCap='round'; g.lineJoin='round'; g.strokeStyle=col; g.lineWidth=w; g.shadowColor=col; g.shadowBlur=26; strokeFig(g,p); g.shadowBlur=0; g.strokeStyle='rgba(255,255,255,.9)'; g.lineWidth=w*0.32; strokeFig(g,p); g.restore(); };
    const S=1.55, oy=GY-104*S;
    g.save(); g.translate(FX,oy); g.scale(S,S);
    for(let i=6;i>=1;i--){ const dtt=i*0.055; const p=pose(ph-dtt*Math.PI*2*2.2,'run',{x:-dtt*V/S,y:0}); fig(p,'#2ff3ff',6,0.38*(1-i/7)); }
    fig(pose(ph,'run'),'#ff3fd0',8,1); g.restore();
    // reflection
    g.save(); g.translate(FX,GY+(GY-oy)); g.scale(S,-S); g.globalAlpha=0.25; fig(pose(ph,'run'),'#ff3fd0',8,0.35); g.restore();
    g.fillStyle='rgba(7,4,15,.35)'; g.fillRect(0,GY,1080,1920-GY);
    F.draw(); caption(1,lt); };
})();

// ---------- S2 /ink-doodle a stick figure losing his umbrella in the wind: hand-inked on paper (lines boil at 8 fps), rain falls,
// a gust swirls in, the red umbrella flips inside out and flies off, the figure jumps after it.
(function(){ const F=flat2D('cv2'), g=F.g; const R=rnd(5);
  const paper=document.createElement('canvas'); paper.width=1080; paper.height=1920; const pg=paper.getContext('2d'); pg.fillStyle='#f3ecdc'; pg.fillRect(0,0,1080,1920);
  for(let i=0;i<60000;i++){ const v=R(); pg.fillStyle=`rgba(${v>.5?255:120},${v>.5?250:100},${v>.5?240:70},${0.04+R()*0.05})`; pg.fillRect(R()*1080,R()*1920,1+R()*2,1+R()*2); }
  const vg=pg.createRadialGradient(540,900,500,540,900,1300); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(120,90,50,.25)'); pg.fillStyle=vg; pg.fillRect(0,0,1080,1920);
  const GY=1230, INK='#18140e';
  function umbrella(cx,cy,rot,flip,jit,sc){ g.save(); g.translate(cx,cy); g.rotate(rot); g.scale(sc,sc); const k=flip; // k: 0 normal → 1 inside out
    const top=-70+140*k; const pts=[]; for(let i=0;i<=16;i++){ const u=i/16, x=-110+220*u; pts.push([x,-(1-Math.pow(2*u-1,2))*(-top)-0+(k*20*Math.sin(u*Math.PI*5))]); }
    g.beginPath(); g.moveTo(-110,0); pts.forEach(q=>g.lineTo(q[0]+(hsh(q[0],jit)-.5)*3,q[1]+(hsh(q[1],jit)-.5)*3)); g.lineTo(110,0);
    for(let i=4;i>=0;i--){ const x=110-i*55; g.quadraticCurveTo(x+27,14*(1-2*k),x,0); }
    g.closePath(); g.globalCompositeOperation='multiply'; g.fillStyle='rgba(214,58,48,.82)'; g.fill(); g.globalCompositeOperation='source-over'; g.strokeStyle=INK; g.lineWidth=4; g.stroke();
    g.lineWidth=3; for(let i=1;i<4;i++){ const x=-110+i*55; g.beginPath(); g.moveTo(0,top*0.9); g.lineTo(x,0); g.stroke(); }
    g.lineWidth=5; g.beginPath(); g.moveTo(0,top*0.95); g.lineTo(0,170); g.arc(-16,170,16,0,Math.PI); g.stroke(); g.restore(); }
  SCN[2]=function(lt0){ const lt=lt0*1.1, jit=Math.floor(lt*8)+1; g.drawImage(paper,0,0);
    // rain
    g.strokeStyle='rgba(24,20,14,.35)'; g.lineWidth=2.4; const wind=cl((lt-0.6)/0.4); for(let i=0;i<70;i++){ const x=((hsh(i,1)*1300+lt*(120+600*wind))%1300)-110, y=((hsh(i,2)*1500+lt*900)%1300)+300; if(y>GY) continue; g.beginPath(); g.moveTo(x,y); g.lineTo(x-8-30*wind,y+38); g.stroke(); }
    // ground
    g.strokeStyle=INK; g.lineWidth=5; g.lineCap='round'; g.beginPath(); for(let x=0;x<=1080;x+=20){ const y=GY+Math.sin(x*0.02)*3+(hsh(x,jit)-.5)*3; x?g.lineTo(x,y):g.moveTo(x,y); } g.stroke();
    // gust swirls
    if(lt>0.55&&lt<2.4){ const u=cl((lt-0.55)/1.4); g.save(); g.strokeStyle='rgba(24,20,14,.7)'; g.lineWidth=4; for(let k=0;k<3;k++){ const x0=-200+u*1500-k*140, y0=760+k*90; g.beginPath(); for(let a=0;a<=1;a+=0.05){ const x=x0+a*260, y=y0+Math.sin(a*6+k)*16; a?g.lineTo(x,y):g.moveTo(x,y); } g.arc(x0+270,y0-14,18,Math.PI/2,Math.PI*2.2); g.stroke(); } g.restore(); }
    // figure
    const walkX=360+lt*70, chase=cl((lt-1.45)/1.4), fx=walkX+chase*260, jump=lt>1.9&&lt<2.6?Math.sin((lt-1.9)/0.7*Math.PI)*90:0;
    const lose=cl((lt-0.85)/0.25), surprised=lt>1.0&&lt<1.5;
    const kind=lt>1.45?'run':'walk', ph=lt*Math.PI*2*(lt>1.45?2.0:1.2);
    const S=1.45, oy=GY-104*S-jump; g.save(); g.translate(fx,oy); g.scale(S,S);
    const p=pose(ph,kind,{lean:surprised?-0.18:(lt>1.45?0.25:0.06),armUp:lt<0.95||lt>1.6});
    g.strokeStyle=INK; g.lineWidth=5; g.lineCap='round'; g.lineJoin='round'; strokeFig(g,p,jit); g.lineWidth=2.5; strokeFig(g,p,jit+50);
    g.fillStyle=INK; g.beginPath(); g.arc(p.head[0]+8,p.head[1]-4,3.5,0,Math.PI*2); g.fill();
    if(surprised){ g.font='700 60px "TeX Gyre Chorus", serif'; g.fillText('!',p.head[0]-8,p.head[1]-40); }
    const hand=p.R1[1]; g.restore();
    // umbrella: held, then flips and flies up-right, tumbling
    const hx=fx+hand[0]*S, hy=oy+hand[1]*S;
    if(lt<0.85){ umbrella(hx,hy-230,0.05+Math.sin(lt*3)*0.03,0,jit,1.35); }
    else { const u=cl((lt-0.85)/1.9), e=u*u; umbrella(hx+e*900+u*120,hy-230-u*620+Math.sin(u*9)*20,lose*0.6+u*4.2,lose,jit,1.35*(1-u*0.25)); }
    F.draw(); caption(2,lt); };
})();
