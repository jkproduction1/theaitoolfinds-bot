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
// items: [el,obj,alpha,side,colX]; side 'L' = label ends at colX (leader leaves its right edge), 'R' = label starts at colX
function layout2(items,cam,minGap,yMin,yMax){ yMin=yMin||480; yMax=yMax||1500;
  const pts=items.map(([el,obj,a,side,colX])=>{ obj.getWorldPosition(V); V.project(cam); return {el,a,side,colX,x:(V.x*.5+.5)*1080,y:(-V.y*.5+.5)*1920}; });
  ['L','R'].forEach(sd=>{ const ord=pts.filter(p=>p.side===sd).sort((p,q)=>p.y-q.y); let last=yMin-minGap; ord.forEach(p=>{ p.ly=Math.max(p.y,last+minGap); last=p.ly; });
    let nx=yMax+minGap; for(let i=ord.length-1;i>=0;i--){ ord[i].ly=Math.min(ord[i].ly,nx-minGap); nx=ord[i].ly; } });
  pts.forEach(p=>{ const el=p.el, ld=el.querySelector('.ld'); el.style.top=p.ly+'px'; el.style.opacity=p.a; let x0;
    if(p.side==='L'){ el.style.left=(p.colX-el.offsetWidth)+'px'; ld.style.left=(el.offsetWidth-2)+'px'; x0=p.colX-2; } else { el.style.left=p.colX+'px'; ld.style.left='2px'; x0=p.colX+2; }
    const y0=p.ly-el.offsetHeight/2+23; const dx=p.x-x0, dy=p.y-y0;
    ld.style.top='23px'; ld.style.width=Math.hypot(dx,dy)+'px'; ld.style.transform='rotate('+Math.atan2(dy,dx)+'rad)'; ld.style.transformOrigin='0 50%'; }); }
function deform(geo,f){ const p=geo.attributes.position, v=new THREE.Vector3(); for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); const w=f(v.clone()); p.setXYZ(i,w.x,w.y,w.z); } geo.computeVertexNormals(); return geo; }
function fiberTex(seed,horiz){ const R=rnd(seed); return canvasTex(512,512,(g,w,h)=>{ g.fillStyle='#808080'; g.fillRect(0,0,w,h);
  for(let i=0;i<2600;i++){ const x=R()*w, y=R()*h, l=20+R()*70, c=100+R()*80|0; g.strokeStyle='rgba('+c+','+c+','+c+',.35)'; g.lineWidth=1+R()*2.5; g.beginPath(); g.moveTo(x,y); if(horiz) g.lineTo(x+l,y+(R()-.5)*10); else g.lineTo(x+(R()-.5)*14,y+l); g.stroke(); }
  for(let i=0;i<500;i++){ const x=R()*w, y=R()*h, r=2+R()*8, c=90+R()*90|0; g.fillStyle='rgba('+c+','+c+','+c+',.25)'; g.beginPath(); g.arc(x,y,r,0,6.3); g.fill(); } }); }
function xrayMat(col,planes){ return new THREE.ShaderMaterial({uniforms:{col:{value:new THREE.Color(col)},op:{value:1}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,clipping:true,clippingPlanes:planes,
    vertexShader:'#include <clipping_planes_pars_vertex>\nvarying vec3 vN; varying vec3 vV; void main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mvPosition.xyz); gl_Position=projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}',
    fragmentShader:'#include <clipping_planes_pars_fragment>\nuniform vec3 col; uniform float op; varying vec3 vN; varying vec3 vV; void main(){\n#include <clipping_planes_fragment>\n float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.2); gl_FragColor=vec4(col*(0.02+0.5*f)*op,1.); }'}); }
const V3=(a)=>new THREE.Vector3(...a);
function crv(pts){ return new THREE.CatmullRomCurve3(pts.map(V3)); }

function rayTube(pts,r,col){ const path=new THREE.CurvePath(); for(let i=0;i<pts.length-1;i++) path.add(new THREE.LineCurve3(V3(pts[i]),V3(pts[i+1])));
  const g=new THREE.TubeGeometry(path,80,r,6,false); const m=new THREE.Mesh(g,glowMat(col,0.95)); m.userData.n=g.index.count; g.setDrawRange(0,0); return m; }
function drawTo(m,p){ const per=6*6; const n=Math.floor(cl(p)*m.userData.n/per)*per; m.geometry.setDrawRange(0,n); m.visible=n>0; }
function sstep(a,b,x){ const t=cl((x-a)/(b-a)); return t*t*(3-2*t); }

// ---------- S0 /x-ray the human eye: a real-looking eyeball (veins, iris, glossy cornea). A scan line turns it into an x-ray and
// shows cornea, lens, retina, optic nerve. The camera swings to the side: light from an upright arrow goes through cornea + lens,
// the rays cross and the picture lands UPSIDE DOWN on the retina (the brain flips it back).
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#1a2633','#030405'); ren.localClippingEnabled=true; ren.toneMappingExposure=0.6;
  const cam=new THREE.PerspectiveCamera(26,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.5,th:0.82});
  const key=new THREE.DirectionalLight(0xfff4ee,1.5); key.position.set(-4,5,6); sc.add(key);
  const rim=new THREE.DirectionalLight(0xaecbff,1.1); rim.position.set(4,2,-5); sc.add(rim); sc.add(new THREE.HemisphereLight(0xe8f0ff,0x0a0c10,0.3));
  const scanP=new THREE.Plane(new THREE.Vector3(0,-1,0),9), scanX=new THREE.Plane(new THREE.Vector3(0,1,0),-9);
  const EY=new THREE.Group(); EY.position.set(0.55,0,0); sc.add(EY);
  const R0=rnd(5);
  const veinT=canvasTex(1024,512,(g,w,h)=>{ g.fillStyle='#efe8e2'; g.fillRect(0,0,w,h);
    for(let i=0;i<70;i++){ let x=R0()*w, y=h*0.5+(R0()-.5)*h*0.8; g.strokeStyle='rgba(170,40,40,'+(0.12+R0()*0.25)+')'; g.lineWidth=0.6+R0()*1.8; g.beginPath(); g.moveTo(x,y);
      for(let k=0;k<12;k++){ x+=(R0()-.5)*40; y+=(R0()-.5)*30; g.lineTo(x,y); } g.stroke(); }
    const gr=g.createLinearGradient(0,0,w,0); gr.addColorStop(0,'rgba(255,220,210,0)'); gr.addColorStop(1,'rgba(255,220,210,0)'); });
  const scG=new THREE.SphereGeometry(1,128,96,0,Math.PI*2,0.42,Math.PI-0.42); scG.rotateZ(Math.PI/2);
  const sclera=new THREE.Mesh(scG,new THREE.MeshPhysicalMaterial({map:veinT,roughness:.32,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:.8,sheen:.3,sheenColor:new THREE.Color(0xffe0e0),side:THREE.DoubleSide,clippingPlanes:[scanP]})); EY.add(sclera);
  const xm=xrayMat(0x8fc0ee,[scanX]); EY.add(new THREE.Mesh(scG,xm));
  const coG=new THREE.SphereGeometry(0.6,64,32,0,Math.PI*2,0,0.75); coG.rotateZ(Math.PI/2); coG.translate(-0.45,0,0);
  const cornea=new THREE.Mesh(coG,new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.02,clearcoat:1,clearcoatRoughness:0,transparent:true,opacity:.16,envMapIntensity:2.2,depthWrite:false})); EY.add(cornea);
  EY.add(new THREE.Mesh(coG,xrayMat(0x9fe0ff,[scanX])));
  const irisT=canvasTex(512,512,(g,w,h)=>{ const cx=w/2, cy=h/2; const gr=g.createRadialGradient(cx,cy,w*0.17,cx,cy,w*0.5); gr.addColorStop(0,'#c9a24a'); gr.addColorStop(0.28,'#5d8a7a'); gr.addColorStop(0.75,'#2f5e78'); gr.addColorStop(1,'#0e1a24'); g.fillStyle=gr; g.fillRect(0,0,w,h);
    const R=rnd(11); for(let i=0;i<900;i++){ const a=R()*Math.PI*2, r0=w*(0.18+R()*0.05), r1=w*(0.3+R()*0.2); g.strokeStyle='rgba('+(R()<.5?'230,240,220':'10,25,30')+','+(0.08+R()*0.18)+')'; g.lineWidth=0.8+R()*1.5; g.beginPath(); g.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0); g.lineTo(cx+Math.cos(a+(R()-.5)*0.1)*r1,cy+Math.sin(a+(R()-.5)*0.1)*r1); g.stroke(); } });
  const iris=new THREE.Mesh(new THREE.RingGeometry(0.15,0.42,96),new THREE.MeshStandardMaterial({map:irisT,roughness:.55,envMapIntensity:.4,side:THREE.DoubleSide})); iris.rotation.y=-Math.PI/2; iris.position.x=-0.9; EY.add(iris);
  const pupil=new THREE.Mesh(new THREE.CircleGeometry(0.155,48),new THREE.MeshBasicMaterial({color:0x020202,side:THREE.DoubleSide})); pupil.rotation.y=-Math.PI/2; pupil.position.x=-0.895; EY.add(pupil);
  const lens=new THREE.Mesh(new THREE.SphereGeometry(1,48,32),new THREE.MeshPhysicalMaterial({color:0xd8f0ff,emissive:0x3a6a90,emissiveIntensity:.5,roughness:.1,clearcoat:1,transparent:true,opacity:.6,envMapIntensity:1.2,depthWrite:false}));
  lens.scale.set(0.17,0.36,0.36); lens.position.x=-0.72; EY.add(lens);
  const reG=new THREE.SphereGeometry(0.95,96,64,0,Math.PI*2,0,1.95); reG.rotateZ(-Math.PI/2);
  const vesT=canvasTex(1024,512,(g,w,h)=>{ g.fillStyle='#c4452e'; g.fillRect(0,0,w,h); const R=rnd(3); for(let i=0;i<40;i++){ let x=R()*w, y=R()*h*0.5; g.strokeStyle='rgba(110,10,10,.55)'; g.lineWidth=1+R()*3; g.beginPath(); g.moveTo(x,y); for(let k=0;k<10;k++){ x+=(R()-.5)*60; y+=R()*30; g.lineTo(x,y); } g.stroke(); } });
  const cutZ=new THREE.Plane(new THREE.Vector3(0,0,-1),9); const retina=new THREE.Mesh(reG,new THREE.MeshPhysicalMaterial({clippingPlanes:[cutZ],map:vesT,emissive:0x8a2412,emissiveIntensity:.55,roughness:.45,clearcoat:.4,side:THREE.DoubleSide,envMapIntensity:.4})); EY.add(retina);
  const nC=crv([[0.9,-0.12,0],[1.5,-0.2,0.02],[2.6,-0.42,0]]);
  const nerveM=new THREE.MeshPhysicalMaterial({color:0xe6cfa6,roughness:.4,clearcoat:.6,envMapIntensity:.5,sheen:.4,sheenColor:new THREE.Color(0xfff0d0),clippingPlanes:[scanP]});
  const nG=new THREE.TubeGeometry(nC,40,0.16,24,false); EY.add(new THREE.Mesh(nG,nerveM)); EY.add(new THREE.Mesh(nG,xrayMat(0xd8c090,[scanX])));
  // scan line
  const scan=new THREE.Mesh(new THREE.TorusGeometry(1,0.012,8,96),glowMat(0xcff4ff,0)); scan.rotation.x=Math.PI/2; scan.position.x=0.55; sc.add(scan); const scanL=scan;
  // object (upright arrow) + rays + upside-down image
  const OX=-2.15, TIP=0.45, BASE=-0.35, LX=-0.17, IX=1.42, m=(IX-LX)/(LX-OX), ITIP=-TIP*m, IBASE=-BASE*m;
  const ORG=0xffa040, CYN=0x4fd2ff;
  const obj=new THREE.Group(); sc.add(obj);
  const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,TIP-BASE-0.2,16),glowMat(0xffd0a0,0)); sh.position.set(OX,(BASE+TIP-0.2)/2,0); obj.add(sh);
  const cn=new THREE.Mesh(new THREE.ConeGeometry(0.13,0.22,24),glowMat(ORG,0)); cn.position.set(OX,TIP-0.11,0); obj.add(cn);
  const bd=new THREE.Mesh(new THREE.SphereGeometry(0.075,16,12),glowMat(CYN,0)); bd.position.set(OX,BASE,0); obj.add(bd);
  const rays=[]; [0.2,0,-0.2].forEach(ly=>{ rays.push(rayTube([[OX,TIP,0],[LX,ly,0],[IX,ITIP,0]],0.012,ORG)); rays.push(rayTube([[OX,BASE,0],[LX,ly,0],[IX,IBASE,0]],0.012,CYN)); });
  rays.forEach(r=>sc.add(r));
  const img=new THREE.Group(); sc.add(img);
  const ish=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,(TIP-BASE-0.2)*m,12),glowMat(0xffd0a0,0)); ish.position.set(IX-0.02,(IBASE+ITIP+0.2*m)/2,0); img.add(ish);
  const icn=new THREE.Mesh(new THREE.ConeGeometry(0.11,0.2,20),glowMat(ORG,0)); icn.rotation.z=Math.PI; icn.position.set(IX-0.02,ITIP+0.1,0); img.add(icn);
  const ibd=new THREE.Mesh(new THREE.SphereGeometry(0.06,16,12),glowMat(CYN,0)); ibd.position.set(IX-0.02,IBASE,0); img.add(ibd);
  const A=(par,x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); par.add(o); return o; };
  const aC=A(EY,-1.02,0.22,0.05), aL=A(EY,-0.72,-0.25,0.1), aR=A(EY,0.62,0.5,0.45), aN=A(EY,1.45,-0.22,0.1);
  const T=new THREE.Vector3(), CP=new THREE.Vector3();
  SCN[0]=function(lt){ const s=1.15-2.4*easeIO(cl((lt-0.45)/1.1)); scanP.constant=s; scanX.constant=-s; scan.position.y=s; const rr=Math.sqrt(Math.max(0.0004,1-s*s))*1.02; scan.scale.set(rr,rr,1);
    const sv=cl((lt-0.4)/0.12)*(1-cl((lt-1.5)/0.12)); scan.material.opacity=0.9*sv;
    EY.rotation.set(0.03*Math.sin(lt*1.3),0.05*Math.sin(lt*0.9)*(1-cl((lt-2)/1)),0);
    const o=easeIO(cl((lt-2.3)/1.0)); const a=-0.95+0.95*o+0.04*Math.sin(lt*0.5), rad=9.6+8.6*o; cutZ.constant=o>0.02?(1-o)*1.2+0.0:9;
    T.set(0.5-0.8*o,-0.55+0.27*o,0); cam.position.set(T.x+Math.sin(a)*rad,0.75-0.55*o+0.05*lt*0.2,Math.cos(a)*rad); cam.lookAt(T); cam.fov=26; cam.updateProjectionMatrix();
    const ov=cl((lt-2.75)/0.25); [sh,cn,bd].forEach(q=>q.material.opacity=ov);
    rays.forEach((r,i)=>drawTo(r,(lt-2.95-(i>>1)*0.1)/0.75));
    const iv=cl((lt-3.6)/0.2); [ish,icn,ibd].forEach(q=>q.material.opacity=iv*(0.85+0.15*Math.sin(lt*9)));
    P.c.render();
    const lv=(t0)=>cl((lt-t0)/0.2)*(1-cl((lt-2.5)/0.2));
    layout2(labs(0,[[0,aC,lv(0.9)],[1,aL,lv(1.1)],[2,aR,lv(1.3)],[3,aN,lv(1.5)]]).map((x,i)=>x.concat([['L','L','R','R'][i],[400,400,690,690][i]])),cam,120,480,1180);
    caption(0,lt-2.9); };
})();

// ---------- S1 /zoom-in a brain cell firing: we push through dark brain tissue to one neuron. Signals run in along the dendrites,
// the cell body charges up, a spike runs down the axon jumping from gap to gap of the myelin (saltatory conduction, up to ~120 m/s),
// and at the end the synapse releases a burst of messenger molecules onto the next cell, which lights up.
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); ren.toneMappingExposure=0.62;
  sc.background=new THREE.Color(0x04050c); sc.fog=new THREE.FogExp2(0x060918,0.07); ren.toneMappingExposure=0.5;
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.05,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.6,th:0.8});
  const key=new THREE.DirectionalLight(0xdde6ff,1.4); key.position.set(-3,4,5); sc.add(key);
  const rim=new THREE.DirectionalLight(0xb07cff,1.3); rim.position.set(3,1,-4); sc.add(rim); sc.add(new THREE.HemisphereLight(0x9fb0ff,0x080610,0.35));
  const memM=new THREE.MeshPhysicalMaterial({color:0x7068d8,roughness:.32,clearcoat:.7,clearcoatRoughness:.25,sheen:.7,sheenColor:new THREE.Color(0xc8b8ff),sheenRoughness:.4,envMapIntensity:.55,emissive:0x1a1048,emissiveIntensity:.7});
  const bgM=new THREE.MeshPhysicalMaterial({color:0x4a4a9a,roughness:.4,clearcoat:.4,envMapIntensity:.35,emissive:0x0e0a2a,emissiveIntensity:.6});
  const postM=new THREE.MeshPhysicalMaterial({color:0x3f8fa8,roughness:.32,clearcoat:.7,sheen:.6,sheenColor:new THREE.Color(0xa8f0ff),envMapIntensity:.55,emissive:0x06303a,emissiveIntensity:.6});
  const myM=new THREE.MeshPhysicalMaterial({color:0xb8ae9c,roughness:.28,clearcoat:.9,clearcoatRoughness:.15,envMapIntensity:.7,sheen:.5,sheenColor:new THREE.Color(0xffffff),emissive:0x1a1408,emissiveIntensity:.3});
  function neuron(par,pos,s,mat,seed){ const R=rnd(seed), G=new THREE.Group(); G.position.set(...pos); G.scale.setScalar(s); par.add(G); const curves=[];
    const soma=new THREE.Mesh(deform(new THREE.SphereGeometry(1,64,48),v=>{ const n=1+0.06*Math.sin(4*v.x+2*v.z)*Math.cos(3*v.y); const k=v.y>0?1-0.35*v.y:1; return new THREE.Vector3(v.x*0.42*n*k,v.y*0.52*n,v.z*0.42*n*k); }),mat); G.add(soma);
    function grow(p,d,len,r,depth){ const e=p.clone().addScaledVector(d,len); const mid=p.clone().lerp(e,0.5).add(new THREE.Vector3((R()-.5)*0.25*len,(R()-.5)*0.25*len,(R()-.5)*0.25*len));
      const c=new THREE.CatmullRomCurve3([p,mid,e]); G.add(new THREE.Mesh(new THREE.TubeGeometry(c,14,r,8,false),mat)); const tip=new THREE.Mesh(new THREE.SphereGeometry(r,8,6),mat); tip.position.copy(e); G.add(tip); curves.push({c,depth});
      if(depth>0){ for(let k=0;k<2;k++){ const nd=d.clone().add(new THREE.Vector3((R()-.5)*1.3,(R()-.2)*0.8,(R()-.5)*1.3)).normalize(); grow(e,nd,len*0.72,r*0.62,depth-1); } } }
    for(let i=0;i<7;i++){ const a=i/7*Math.PI*2+R()*0.5; const d=new THREE.Vector3(Math.cos(a)*0.9,0.35+R()*0.9,Math.sin(a)*0.9).normalize(); grow(d.clone().multiplyScalar(0.36),d,0.85+R()*0.3,0.07,3); }
    return {G,soma,curves}; }
  const somaM=memM.clone(); const H=neuron(sc,[0,0.9,0],1,memM,17); H.soma.material=somaM;
  [[-3.4,1.4,-5,0.9,3],[3.2,-1.2,-6,1.1,5],[-2.6,-3.4,-4.5,0.8,9],[3.6,2.8,-8,1.2,13],[-1.2,-6.4,-7,1.0,21],[2.4,-5.0,-3.6,0.7,27]].forEach(([x,y,z,s,sd])=>{ const n=neuron(sc,[x,y,z],s,bgM,sd);
    n.G.add(new THREE.Mesh(new THREE.TubeGeometry(crv([[0,-0.4,0],[0.3,-1.5,0.2],[-0.2,-3,0]]),30,0.045,8,false),bgM)); });
  // axon with myelin + nodes of Ranvier
  const axC=crv([[0,0.45,0],[0.12,-0.3,0.08],[0.02,-1.2,-0.05],[0.18,-2.1,0.05],[0.08,-3.0,0],[0.2,-3.75,0.05]]);
  sc.add(new THREE.Mesh(new THREE.TubeGeometry(axC,120,0.05,12,false),memM));
  const NS=6, nodes=[], segs=[]; const u0=0.1, u1=0.93, gap=0.02;
  for(let i=0;i<NS;i++){ const a=u0+(u1-u0)*i/NS+gap/2, b=u0+(u1-u0)*(i+1)/NS-gap/2; const pts=[]; for(let k=0;k<=12;k++) pts.push(axC.getPointAt(a+(b-a)*k/12));
    const c=new THREE.CatmullRomCurve3(pts); const sg=new THREE.Mesh(new THREE.TubeGeometry(c,40,0.115,20,false),myM.clone()); sc.add(sg); segs.push({m:sg,a,b});
    [a,b].forEach(u=>{ const q=new THREE.Mesh(new THREE.SphereGeometry(0.115,20,14),sg.material); q.position.copy(axC.getPointAt(u)); q.scale.set(1,0.45,1); const tg=axC.getTangentAt(u); q.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),tg); sc.add(q); });
    if(i>0){ const ring=new THREE.Mesh(new THREE.TorusGeometry(0.075,0.025,10,32),glowMat(0xffe6a0,0)); ring.position.copy(axC.getPointAt(a-gap/2)); ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),axC.getTangentAt(a-gap/2)); sc.add(ring); nodes.push({m:ring,u:a-gap/2}); } }
  // axon terminal, boutons, next cell's dendrite
  const END=axC.getPointAt(1), bout=[];
  [[-0.42,-4.12,0.1],[-0.1,-4.2,0.25],[0.28,-4.18,-0.05],[0.6,-4.1,0.15]].forEach(p=>{ const c=new THREE.CatmullRomCurve3([END.clone(),END.clone().lerp(V3(p),0.5).add(new THREE.Vector3(0,-0.05,0)),V3(p)]);
    sc.add(new THREE.Mesh(new THREE.TubeGeometry(c,16,0.035,8,false),memM)); const b=new THREE.Mesh(new THREE.SphereGeometry(0.1,24,16),memM); b.position.set(...p); b.scale.set(1,0.8,1); sc.add(b); bout.push({p:V3(p),c}); });
  const postC=crv([[-2.4,-4.62,-0.4],[-0.6,-4.5,0.05],[0.5,-4.52,0.1],[2.4,-4.7,-0.3]]);
  sc.add(new THREE.Mesh(new THREE.TubeGeometry(postC,80,0.15,16,false),postM));
  bout.forEach(b=>{ const s=new THREE.Mesh(new THREE.SphereGeometry(0.08,16,12),postM); s.position.set(b.p.x,-4.37,b.p.z*0.6); s.scale.set(1.2,0.7,1.2); sc.add(s); });
  // dust for depth
  { const R=rnd(41), N=500, pos=new Float32Array(N*3); for(let i=0;i<N;i++){ pos[i*3]=(R()-.5)*12; pos[i*3+1]=2.5-R()*10; pos[i*3+2]=-8+R()*11; }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); sc.add(new THREE.Points(g,new THREE.PointsMaterial({color:0x8a90ff,size:0.025,transparent:true,opacity:.5,depthWrite:false}))); }
  // signals: dendrite blips -> soma -> spike -> transmitter burst
  const blips=[]; const Rb=rnd(5); const prim=H.curves.filter(c=>c.depth<=1); for(let i=0;i<14;i++){ const c=prim[Math.floor(Rb()*prim.length)]; const m=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),glowMat(0xffe08a,0)); H.G.add(m); blips.push({m,c:c.c,t0:0.35+Rb()*1.1}); }
  const spike=new THREE.Mesh(new THREE.SphereGeometry(0.1,16,12),glowMat(0xfff2c0,0)); sc.add(spike); const halo=new THREE.Mesh(new THREE.SphereGeometry(0.17,16,12),glowMat(0xffb040,0)); sc.add(halo);
  const trail=new THREE.Mesh(new THREE.TubeGeometry(axC,200,0.065,8,false),glowMat(0xffc860,0.9)); sc.add(trail); const TN=trail.geometry.index.count, TP=6*8;
  const NT=110, tr=[]; const Rt=rnd(8); for(let i=0;i<NT;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.022,8,6),glowMat(0x9ff6ff,0)); sc.add(m); const b=bout[i%4]; tr.push({m,b,d:new THREE.Vector3((Rt()-.5)*0.3,-0.12-Rt()*0.14,(Rt()-.5)*0.3),t0:Rt()*0.35}); }
  const T0=1.7, T1=3.3; // spike start / arrival
  const spikeU=(lt)=>{ const x=cl((lt-T0)/(T1-T0)); // quick hops between nodes (saltatory): mostly fast, brief rest at each node
    const k=x*NS, i=Math.floor(k), f=k-i; return Math.min(1,(i+Math.pow(f,0.55))/NS)*(u1+0.07); };
  const A=(par,x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); par.add(o); return o; };
  const aD=A(H.G,-0.75,0.85,0.3), aM=A(sc,0.16,-1.65,0.12), aS=A(sc,0.1,-4.3,0.15);
  const camC=crv([[1.9,2.9,13.5],[1.2,1.3,6.8],[0.9,-0.6,6.0],[0.7,-3.2,5.2],[0.55,-3.8,4.6]]), tgtC=crv([[0,0.9,0],[0,0.75,0],[0.1,-1.1,0],[0.2,-3.9,0],[0.2,-4.3,0]]);
  const pathS=(lt)=>{ // camera progress: push in to the soma, follow the spike, settle on the synapse
    if(lt<T0) return 0.25*easeIO(lt/T0)+0.0*lt; const su=spikeU(Math.min(lt,T1)); if(lt<T1) return 0.25+0.6*Math.min(1,(lt-T0)/(T1-T0))*0.98; return 0.25+0.588+0.16*ease(cl((lt-T1)/1.6)); };
  SCN[1]=function(lt){ const s=Math.min(1,pathS(lt)); cam.position.copy(camC.getPointAt(s)); cam.position.x+=0.06*Math.sin(lt*0.7); cam.lookAt(tgtC.getPointAt(s));
    blips.forEach(b=>{ const v=cl((lt-b.t0)/0.55); b.m.position.copy(b.c.getPointAt(1-v)); b.m.material.opacity=v>0&&v<1?Math.sin(v*Math.PI):0; });
    const ch=cl((lt-0.8)/(T0-0.8));
    const fl=Math.exp(-Math.pow((lt-T0)/0.12,2)); somaM.emissive.setRGB(0.06+0.22*ch*ch+0.25*fl,0.04+0.14*ch*ch+0.2*fl,0.16+0.06*ch); somaM.emissiveIntensity=1;
    const u=spikeU(lt), on=lt>=T0&&lt<T1+0.1?1:0; const pu=Math.min(u,1); spike.position.copy(axC.getPointAt(pu)); halo.position.copy(spike.position); spike.material.opacity=on; halo.material.opacity=0.22*on;
    const st=Math.max(0,pu-0.14), n0=Math.floor(st*TN/TP)*TP, n1=Math.floor(pu*TN/TP)*TP; trail.geometry.setDrawRange(n0,Math.max(0,n1-n0)); trail.visible=on>0&&n1>n0;
    nodes.forEach(nd=>{ const d=lt>=T0?(u-nd.u):-1; nd.m.material.opacity=d>0?Math.max(0.25,Math.exp(-d*14)):0; });
    segs.forEach(sg=>{ const inn=u>sg.a&&u<sg.b+0.02&&on; sg.m.material.emissive.setRGB(inn?0.22:0.05,inn?0.15:0.04,inn?0.04:0.015); });
    tr.forEach(p=>{ const v=cl((lt-T1-0.05-p.t0)/0.7); p.m.position.copy(p.b.p).addScaledVector(p.d,ease(v)).add(new THREE.Vector3(0,-0.06,0)); p.m.material.opacity=v>0?(1-v*0.6):0; });
    const pg=cl((lt-T1-0.35)/0.4)*(1-0.5*cl((lt-T1-1.2)/0.6)); postM.emissive.setRGB(0.02+0.05*pg,0.15+0.16*pg,0.18+0.14*pg); postM.emissiveIntensity=1;
    P.c.render();
    layout2(labs(1,[[0,aD,cl((lt-0.8)/0.2)*(1-cl((lt-2.0)/0.25))],[1,aM,cl((lt-2.0)/0.2)*(1-cl((lt-3.2)/0.25))],[2,aS,cl((lt-3.35)/0.2)]]).map((x,i)=>x.concat([['L','R','R'][i],[400,700,700][i]])),cam,120,480,1180);
    caption(1,lt-1.8); };
})();

// ---------- S2 /explain-3d how your stomach digests food: cutaway stomach (front half see-through), wet folded lining inside.
// Muscle waves squeeze along the wall and churn the food; acid bubbles from the lining break the chunks into small bits (chyme);
// the pylorus opens a little at a time and lets small squirts into the small intestine.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#2a1a1e','#050304'); ren.localClippingEnabled=true; ren.toneMappingExposure=0.6;
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.4,radius:0.5,th:0.9});
  const key=new THREE.DirectionalLight(0xfff0ea,1.3); key.position.set(-3,5,6); sc.add(key);
  const rim=new THREE.DirectionalLight(0xaecbff,0.9); rim.position.set(4,3,-5); sc.add(rim); sc.add(new THREE.HemisphereLight(0xffe0e0,0x100808,0.25));
  const cutB=new THREE.Plane(new THREE.Vector3(0,0,-1),0), cutF=new THREE.Plane(new THREE.Vector3(0,0,1),0);
  const G=new THREE.Group(); sc.add(G); G.rotation.y=-0.22;
  const fib=fiberTex(23,true);
  const outM=new THREE.MeshPhysicalMaterial({color:0xb8505a,roughness:.4,clearcoat:.8,clearcoatRoughness:.2,envMapIntensity:.6,sheen:.5,sheenColor:new THREE.Color(0xffa0a0),bumpMap:fib,bumpScale:.03,side:THREE.DoubleSide,clippingPlanes:[cutB]});
  const inM=new THREE.MeshPhysicalMaterial({color:0xb84850,roughness:.3,clearcoat:.7,clearcoatRoughness:.08,envMapIntensity:.38,sheen:.5,sheenColor:new THREE.Color(0xffc0c0),emissive:0x2a0808,emissiveIntensity:.5,side:THREE.DoubleSide,clippingPlanes:[cutB]});
  const xm=xrayMat(0x8a3a44,[cutF]);
  const stC=crv([[-0.25,1.2,0],[-0.62,0.95,0],[-0.8,0.35,0],[-0.64,-0.35,0],[-0.22,-0.86,0],[0.36,-0.97,0],[0.8,-0.72,0],[1.02,-0.4,0]]);
  const rMax=(u)=>0.72-0.3*sstep(0.45,0.82,u)-0.26*sstep(0.82,1.0,u);
  const NU=150, NVv=72; const frames=stC.computeFrenetFrames(NU,false);
  function dyn(rf){ const n=(NU+1)*(NVv+1), pos=new Float32Array(n*3), idx=[]; for(let i=0;i<NU;i++) for(let j=0;j<NVv;j++){ const a=i*(NVv+1)+j, b=a+NVv+1; idx.push(a,b,a+1,b,b+1,a+1); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3)); g.setIndex(idx); const fibUV=new Float32Array(n*2); for(let i=0;i<=NU;i++) for(let j=0;j<=NVv;j++){ fibUV[(i*(NVv+1)+j)*2]=i/NU*3; fibUV[(i*(NVv+1)+j)*2+1]=j/NVv; } g.setAttribute('uv',new THREE.BufferAttribute(fibUV,2));
    g.upd=(t)=>{ for(let i=0;i<=NU;i++){ const u=i/NU, c=stC.getPointAt(u), N=frames.normals[i], B=frames.binormals[i]; for(let j=0;j<=NVv;j++){ const a=j/NVv*Math.PI*2, r=rf(u,a,t), k=(i*(NVv+1)+j)*3;
        pos[k]=c.x+r*(Math.cos(a)*N.x+Math.sin(a)*B.x); pos[k+1]=c.y+r*(Math.cos(a)*N.y+Math.sin(a)*B.y); pos[k+2]=c.z+r*(Math.cos(a)*N.z+Math.sin(a)*B.z); } }
      g.attributes.position.needsUpdate=true; g.computeVertexNormals(); }; return g; }
  const WAVES=[0,0.5]; const sq=(u,t)=>{ let g=0; WAVES.forEach(o=>{ const c=0.25+(((t*0.42+o)%1))*0.8; g+=0.2*Math.exp(-Math.pow((u-c)/0.06,2))*sstep(0.22,0.4,u); }); return g; };
  const cap=(u)=>u<0.07?Math.sqrt(Math.max(0.0001,1-Math.pow((0.07-u)/0.07,2))):1;
  const outer=dyn((u,a,t)=>rMax(u)*cap(u)*(1-sq(u,t))*(1+0.012*Math.sin(a*5+u*20)));
  const inner=dyn((u,a,t)=>rMax(u)*cap(u)*(1-sq(u,t)*1.05)*(0.88+0.04*Math.sin(a*15+3.2*Math.sin(u*9))));
  G.add(new THREE.Mesh(outer,outM)); G.add(new THREE.Mesh(outer,xm)); G.add(new THREE.Mesh(inner,inM));
  const tubeOI=(c,r)=>{ [[r,outM],[r*0.82,inM]].forEach(([rr,m])=>G.add(new THREE.Mesh(new THREE.TubeGeometry(c,60,rr,32,false),m))); G.add(new THREE.Mesh(new THREE.TubeGeometry(c,60,r,32,false),xm)); };
  const esC=crv([[-0.02,2.9,0],[-0.06,2.0,0],[-0.22,1.12,0]]); tubeOI(esC,0.17);
  const duC=crv([[1.0,-0.42,0],[1.3,-0.22,0],[1.52,-0.55,0],[1.42,-1.25,0],[1.12,-1.75,0]]); tubeOI(duC,0.17);
  const pyl=new THREE.Mesh(new THREE.TorusGeometry(0.15,0.07,16,40),new THREE.MeshPhysicalMaterial({color:0xa83c46,roughness:.35,clearcoat:.8,envMapIntensity:.6})); pyl.position.copy(stC.getPointAt(1)); pyl.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),stC.getTangentAt(1)); G.add(pyl);
  // food chunks
  const R=rnd(31), cols=[0xd8a85a,0x6a9a3e,0xa8452c,0xe8c860,0xc88a50,0x7aa848,0xd09a6a,0xb85a3a,0xe0b878];
  const chunks=cols.map((c,i)=>{ const g=deform(new THREE.IcosahedronGeometry(1,3),v=>v.multiplyScalar(1+0.18*Math.sin(3*v.x+i)*Math.cos(2*v.y+i*2)+0.08*Math.sin(7*v.z)));
    const m=new THREE.Mesh(g,new THREE.MeshPhysicalMaterial({color:c,roughness:.55,clearcoat:.5,envMapIntensity:.5})); const u=0.14+0.42*(i/cols.length)+R()*0.05;
    m.userData={u,a:R()*6.28,rr:0.15+R()*0.25,s:0.13+R()*0.07,w:new THREE.Vector3(R(),R(),R())}; G.add(m); return m; });
  // chyme bits
  const NB=320, bits=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.035,1),new THREE.MeshPhysicalMaterial({color:0xd6a860,roughness:.4,clearcoat:.6,envMapIntensity:.5,emissive:0x281a08,emissiveIntensity:.5}),NB); G.add(bits);
  const bd=[]; for(let i=0;i<NB;i++) bd.push({t0:0.9+R()*3.6,u:0.2+R()*0.45,a:R()*6.28,rr:R()*0.5,sp:0.03+R()*0.05,s:0.6+R()*0.9,src:i%cols.length});
  // acid bubbles from the lining
  const NA=70, acid=[]; for(let i=0;i<NA;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),glowMat(0x9cff3a,0)); G.add(m); acid.push({m,u:0.12+R()*0.6,a:Math.PI*(0.6+R()*0.8),t0:R()*1.4}); }
  const Mx=new THREE.Matrix4(), Q=new THREE.Quaternion(), Sv=new THREE.Vector3(), Pv=new THREE.Vector3(), Eu=new THREE.Euler();
  const inside=(u,a,rr,out)=>{ const i=Math.min(NU,Math.round(u*NU)); const c=stC.getPointAt(Math.min(1,u)), N=frames.normals[i], B=frames.binormals[i]; const r=rMax(u)*rr; return out.copy(c).addScaledVector(N,Math.cos(a)*r).addScaledVector(B,Math.sin(a)*r*0.6); };
  const SP=[2.4,3.3,4.1];
  const A=(par,x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); par.add(o); return o; };
  const aE=A(G,-0.02,1.75,0.1), aW=A(G,-0.9,0.1,0.05), aA=A(G,0.35,-0.75,-0.25), aP=A(G,1.02,-0.4,0.12);
  SCN[2]=function(lt){ outer.upd(lt); inner.upd(lt);
    const open=SP.reduce((m,t0)=>Math.max(m,Math.exp(-Math.pow((lt-t0)/0.18,2))),0); pyl.scale.setScalar(1+0.35*open);
    chunks.forEach((m,i)=>{ const d=m.userData; const du=0.02*Math.sin(lt*1.4+i)+sq(d.u,lt)*0.15; const shr=1-0.62*sstep(1.0+i*0.12,4.6,lt);
      inside(d.u+du,d.a+lt*0.6,d.rr,m.position); m.scale.setScalar(d.s*shr); m.rotation.set(d.w.x*lt*1.2,d.w.y*lt,d.w.z*lt*0.8); });
    let k=0; bd.forEach((b,i)=>{ const v=lt-b.t0; if(v<0){ Sv.setScalar(0); Mx.compose(Pv.set(0,0,0),Q,Sv); bits.setMatrixAt(i,Mx); return; }
      let u=b.u+b.sp*v+0.08*cl(v/0.6); let p;
      if(u<0.97){ inside(u,b.a+v*1.2,b.rr*0.8,Pv); } else { const pass=SP.some(t0=>lt>t0-0.1&&lt<t0+0.6); if(!pass) u=0.97, inside(0.97,b.a+v,b.rr*0.3,Pv); else { const w=cl((lt-SP.find(t0=>lt>t0-0.1&&lt<t0+0.6)+0.1)/0.7); Pv.copy(duC.getPointAt(w*0.8)); } }
      const src=chunks[b.src].position, f=cl(v/0.35); if(f<1) Pv.lerp(src,1-f);
      Eu.set(v*2,v*3,0); Q.setFromEuler(Eu); Sv.setScalar(b.s*cl(v/0.2)); Mx.compose(Pv,Q,Sv); bits.setMatrixAt(i,Mx); }); bits.instanceMatrix.needsUpdate=true;
    acid.forEach(q=>{ const v=((lt+q.t0)%1.4)/1.4; inside(q.u,q.a,1-0.5*v,q.m.position); q.m.material.opacity=cl((lt-0.4)/0.4)*Math.sin(v*Math.PI)*0.9; });
    const z=easeIO(cl(lt/5.2)); const ca=-0.18+0.26*z; const rad=14.8-0.8*z; cam.position.set(0.3+Math.sin(ca)*rad,0.55+0.25*z,Math.cos(ca)*rad); cam.lookAt(0.3,-0.8-0.05*z,0); P.c.render();
    layout2(labs(2,[[0,aE,cl((lt-0.7)/0.2)],[1,aW,cl((lt-1.0)/0.2)],[2,aA,cl((lt-1.3)/0.2)],[3,aP,cl((lt-2.2)/0.2)]]).map((x,i)=>x.concat([['R','L','L','R'][i],[690,400,400,690][i]])),cam,120,480,1180);
    caption(2,lt-0.6); };
})();
