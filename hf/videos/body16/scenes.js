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

// ---------- S0 /x-ray the human heart: a real-looking heart beats; a scan line sweeps top to bottom and turns it into an x-ray
// that shows the 4 chambers. Blue (oxygen-poor) blood comes in through the vena cava to the right side and is pumped to the lungs;
// red (oxygen-rich) blood from the lungs enters the left side and leaves through the aorta to the body.
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#2b1519','#040305'); ren.localClippingEnabled=true; ren.toneMappingExposure=0.6;
  const cam=new THREE.PerspectiveCamera(26,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.82});
  const key=new THREE.DirectionalLight(0xfff0ea,1.5); key.position.set(-3,5,6); sc.add(key);
  const rim=new THREE.DirectionalLight(0xaecbff,1.2); rim.position.set(4,2,-5); sc.add(rim); sc.add(new THREE.HemisphereLight(0xffd8d0,0x100808,0.25));
  const scanP=new THREE.Plane(new THREE.Vector3(0,-1,0),9), scanX=new THREE.Plane(new THREE.Vector3(0,1,0),-9);
  const fib=fiberTex(7,false);
  const muscle=new THREE.MeshPhysicalMaterial({color:0x5e070c,roughness:.36,clearcoat:1,clearcoatRoughness:.1,envMapIntensity:.7,sheen:.8,sheenColor:new THREE.Color(0xc03030),sheenRoughness:.45,bumpMap:fib,bumpScale:.035,clippingPlanes:[scanP]});
  const vm=(c,r)=>new THREE.MeshPhysicalMaterial({color:c,roughness:r??.4,clearcoat:.7,clearcoatRoughness:.2,envMapIntensity:.5,sheen:.3,sheenColor:new THREE.Color(0xa06060),side:THREE.DoubleSide,clippingPlanes:[scanP]});
  const aortaM=vm(0x8a2a30), pulmM=vm(0x3a3270), cavaM=vm(0x26245e), pveinM=vm(0x701820);
  const xm=xrayMat(0x7fa8d8,[scanX]);
  const M=new THREE.Group(); M.position.set(0.1,0,0); sc.add(M);
  const B=new THREE.Group(); B.rotation.z=0.3; M.add(B);
  function shell(par,geo,mat,pos,sc3){ const m=new THREE.Mesh(geo,mat); const x=new THREE.Mesh(geo,xm); [m,x].forEach(o=>{ if(pos) o.position.set(...pos); if(sc3) o.scale.set(...sc3); par.add(o); }); return m; }
  const hd=(v)=>{ let {x,y,z}=v; const n=1+0.035*Math.sin(3.1*x+1.7*y)*Math.cos(2.3*z+1.1*y)+0.02*Math.sin(7*x+5*z); x*=n; y*=n; z*=n;
    if(y<0){ const k=1+y*0.6; x*=k; z*=k; y*=1.45; } else { y*=0.95; x*=1+0.08*y; } z*=0.82; return new THREE.Vector3(x,y,z); };
  shell(B,deform(new THREE.SphereGeometry(1,96,72),hd),muscle);
  shell(B,deform(new THREE.SphereGeometry(1,48,36),v=>v.multiplyScalar(1+0.04*Math.sin(5*v.x+3*v.y))),muscle,[-0.62,0.42,0.12],[0.46,0.46,0.42]);  // right atrium bulge
  shell(B,deform(new THREE.SphereGeometry(1,40,30),v=>v),muscle,[0.58,0.62,0.3],[0.26,0.16,0.2]);  // left auricle
  // coronary vessels lying on the surface
  const onS=(a,y)=>hd(new THREE.Vector3(Math.sin(a)*Math.sqrt(1-y*y),y,Math.cos(a)*Math.sqrt(1-y*y))).multiplyScalar(1.012);
  const corA=new THREE.MeshPhysicalMaterial({color:0x6e0a12,roughness:.3,clearcoat:1,clippingPlanes:[scanP]}), fatM=new THREE.MeshPhysicalMaterial({color:0x9a7030,envMapIntensity:.4,roughness:.5,clearcoat:.6,clippingPlanes:[scanP]});
  const lad=new THREE.CatmullRomCurve3(Array.from({length:14},(_,i)=>{ const y=0.62-i*0.12; return onS(0.32+0.08*Math.sin(i*0.9),y); }));
  B.add(new THREE.Mesh(new THREE.TubeGeometry(lad,90,0.028,8,false),corA)); B.add(new THREE.Mesh(new THREE.TubeGeometry(lad,90,0.036,8,false),fatM));
  const rca=new THREE.CatmullRomCurve3(Array.from({length:12},(_,i)=>onS(0.1-i*0.2,0.5-i*0.035)));
  B.add(new THREE.Mesh(new THREE.TubeGeometry(rca,80,0.026,8,false),corA)); B.add(new THREE.Mesh(new THREE.TubeGeometry(rca,80,0.034,8,false),fatM));
  const br=new THREE.CatmullRomCurve3(Array.from({length:8},(_,i)=>onS(0.3+i*0.1,0.3-i*0.1)));
  B.add(new THREE.Mesh(new THREE.TubeGeometry(br,60,0.018,8,false),corA));
  // chambers (inside; seen once the scan passes)
  const chM=(c,e)=>new THREE.MeshPhysicalMaterial({color:c,emissive:e,emissiveIntensity:.9,roughness:.6,clearcoat:.2,envMapIntensity:.3,transparent:true,opacity:.9});
  const blueM=chM(0x2a5cff,0x1636c8), redM=chM(0xff2a34,0xb0101a);
  const ch=(m,pos,s)=>{ const o=new THREE.Mesh(new THREE.SphereGeometry(1,40,30),m); o.position.set(...pos); o.scale.set(...s); B.add(o); return o; };
  const RA=ch(blueM,[-0.58,0.42,0.12],[0.34,0.36,0.3]), RV=ch(blueM,[-0.27,-0.38,0.1],[0.3,0.54,0.22]);
  const LA=ch(redM,[0.4,0.52,-0.2],[0.34,0.28,0.26]), LV=ch(redM,[0.33,-0.42,-0.02],[0.36,0.7,0.36]);
  // great vessels (in M, not tilted)
  const rot=(x,y,z)=>{ const c=Math.cos(0.3), s=Math.sin(0.3); return [x*c-y*s, x*s+y*c, z]; };
  const aortaC=crv([[0.0,0.45,0.05],[-0.06,1.2,0.12],[0.04,1.72,0.0],[0.42,1.84,-0.3],[0.64,1.5,-0.55],[0.68,0.6,-0.65],[0.66,-0.5,-0.7]]);
  shell(M,new THREE.TubeGeometry(aortaC,120,0.17,24,false),aortaM);
  [0.36,0.44,0.52].forEach((u,i)=>{ const p=aortaC.getPointAt(u); shell(M,new THREE.TubeGeometry(crv([[p.x,p.y,p.z],[p.x-0.05+i*0.04,p.y+0.3,p.z],[p.x-0.1+i*0.06,p.y+0.5,p.z+0.02]]),20,0.065-i*0.006,16,false),aortaM); });
  const svcC=crv([[-0.78,1.95,-0.05],[-0.74,1.3,0.0],[-0.7,0.6,0.02]]); shell(M,new THREE.TubeGeometry(svcC,40,0.15,20,false),cavaM);
  shell(M,new THREE.TubeGeometry(crv([[-0.5,-1.35,-0.4],[-0.58,-0.6,-0.25],[-0.62,0.0,-0.1]]),40,0.15,20,false),cavaM);
  const ptC=crv([[-0.14,0.2,0.42],[-0.12,1.0,0.44],[0.05,1.33,0.25],[0.45,1.38,0.02],[0.82,1.27,-0.12]]); shell(M,new THREE.TubeGeometry(ptC,80,0.13,20,false),pulmM);
  shell(M,new THREE.TubeGeometry(crv([[0.05,1.33,0.25],[-0.3,1.3,-0.2],[-0.82,1.22,-0.26]]),40,0.1,16,false),pulmM);
  [[[0.9,0.78,-0.42],[0.7,0.68,-0.4],[0.38,0.62,-0.32]],[[0.88,0.42,-0.45],[0.7,0.46,-0.42],[0.38,0.52,-0.34]],[[-0.85,0.72,-0.52],[-0.4,0.66,-0.48],[0.1,0.62,-0.4]]].forEach(a=>shell(M,new THREE.TubeGeometry(crv(a),30,0.075,14,false),pveinM));
  // blood flow
  const blueC=crv([[-0.78,1.95,-0.05],[-0.72,1.0,0.0],rot(-0.58,0.42,0.12),rot(-0.34,-0.2,0.3),rot(-0.22,-0.72,0.3),rot(-0.08,-0.2,0.38),[-0.14,0.4,0.42],[-0.12,1.0,0.44],[0.05,1.33,0.25],[0.45,1.38,0.02],[0.82,1.27,-0.12]]);
  const redC=crv([[0.9,0.78,-0.42],[0.7,0.68,-0.4],rot(0.4,0.52,-0.2),rot(0.36,-0.2,-0.02),rot(0.32,-0.8,0.0),rot(0.12,-0.25,0.05),[0.0,0.45,0.05],[-0.06,1.2,0.12],[0.04,1.72,0.0],[0.42,1.84,-0.3],[0.64,1.5,-0.55],[0.68,0.6,-0.65],[0.66,-0.5,-0.7]]);
  const NP=70, bp=[], rp=[]; for(let i=0;i<NP;i++){ const a=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),glowMat(0x4a8cff,0)); M.add(a); bp.push(a); const b=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),glowMat(0xff3a3a,0)); M.add(b); rp.push(b); }
  const scan=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2.2),glowMat(0x9fe0ff,0)); scan.rotation.x=-Math.PI/2; sc.add(scan);
  const scanL=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.0,2.0)),new THREE.LineBasicMaterial({color:0xcff4ff,transparent:true,opacity:0,toneMapped:false})); scanL.rotation.x=-Math.PI/2; sc.add(scanL);
  const A=(par,x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); par.add(o); return o; };
  const aRA=A(B,-0.5,0.45,0.35), aRV=A(B,-0.22,-0.45,0.5), aLV=A(B,0.4,-0.55,0.3), aAo=A(M,0.3,1.85,-0.1);
  SCN[0]=function(lt){ const yT=2.3, yB=-1.6, s=yT-(yT-yB)*easeIO(cl((lt-0.75)/1.25)); scanP.constant=s; scanX.constant=-s; scan.position.y=s; scanL.position.y=s;
    const sv=cl((lt-0.7)/0.12)*(1-cl((lt-1.95)/0.15)); scan.material.opacity=0.05*sv; scanL.material.opacity=0.9*sv;
    const ph=(lt%0.95)/0.95, sq=ph<0.3?Math.sin(ph/0.3*Math.PI):0, at=ph>0.62&&ph<0.85?Math.sin((ph-0.62)/0.23*Math.PI):0;
    B.scale.set(1-0.035*sq,1-0.045*sq,1-0.035*sq); RV.scale.set(0.3*(1-0.12*sq),0.54*(1-0.08*sq),0.22*(1-0.12*sq)); LV.scale.set(0.36*(1-0.12*sq),0.7*(1-0.08*sq),0.36*(1-0.12*sq));
    RA.scale.setScalar(1).set(0.34*(1-0.1*at),0.36*(1-0.1*at),0.3*(1-0.1*at)); LA.scale.set(0.34*(1-0.1*at),0.28*(1-0.1*at),0.26*(1-0.1*at));
    const flow=cl((lt-1.7)/0.4);
    for(let i=0;i<NP;i++){ const u=(i/NP+lt*0.2)%1; bp[i].position.copy(blueC.getPointAt(u)); rp[i].position.copy(redC.getPointAt(u)); const f=flow*(0.55+0.45*sq)*Math.min(1,u*12,(1-u)*12); bp[i].material.opacity=f; rp[i].material.opacity=f; }
    const z=easeIO(cl((lt-0.2)/4.2)); const ca=-0.22+0.3*z; const rad=16.4-1.2*z; cam.position.set(Math.sin(ca)*rad,0.6+0.4*z,Math.cos(ca)*rad); cam.lookAt(0.05,0.2,0); P.c.render();
    layout2(labs(0,[[0,aRA,cl((lt-2.0)/0.2),'L',345],[1,aRV,cl((lt-2.35)/0.2),'L',345],[2,aLV,cl((lt-2.7)/0.2),'R',735],[3,aAo,cl((lt-3.05)/0.2),'R',735]]).map((a,i)=>a.concat([['L','L','R','R'][i],[345,345,735,735][i]])),cam,120);
    caption(0,lt-1.9); };
})();

// ---------- S1 /zoom-in a drop of blood: a red drop on a glass slide, the camera pushes into it, and we drift among red blood
// cells (biconcave discs, carry oxygen), a few platelets (help stop bleeding) and one white blood cell (bigger, pale, bumpy; fights germs).
(function(){ const ren=mkRenderer2('cv1'); ren.toneMappingExposure=0.6;
  const env=hdrEnv(ren);
  // --- part A: the drop on a glass slide
  const sa=new THREE.Scene(); sa.environment=env; bgGrad(sa,'#2a3038','#06070a');
  const camA=new THREE.PerspectiveCamera(30,1080/1920,0.01,100);
  const PA=mkComposer(ren,sa,camA,{bloom:0.3,radius:0.4,th:0.95});
  const kA=new THREE.DirectionalLight(0xffffff,1.3); kA.position.set(-2,5,3); sa.add(kA);
  const desk=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshBasicMaterial({color:0x0c0d10})); desk.rotation.x=-Math.PI/2; sa.add(desk);
  const slide=new THREE.Mesh(rbox(2.6,7.5,0.06,0.04),new THREE.MeshStandardMaterial({color:0xbfd6de,roughness:.08,metalness:0,transparent:true,opacity:.1,envMapIntensity:.15,depthWrite:false}));
  slide.rotation.x=-Math.PI/2; slide.position.y=0.04;
  const sedge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6,0.06,7.5)),new THREE.LineBasicMaterial({color:0x9fb8c2,transparent:true,opacity:.5})); sedge.position.y=0.04; sa.add(sedge);
  const dropG=deform(new THREE.SphereGeometry(1,96,64,0,Math.PI*2,0,Math.PI/2),v=>{ const r=Math.hypot(v.x,v.z); const k=1+0.02*Math.sin(Math.atan2(v.z,v.x)*3); return new THREE.Vector3(v.x*k,v.y*0.42*(1-0.15*r*r),v.z*k); });
  const drop=new THREE.Mesh(dropG,new THREE.MeshPhysicalMaterial({color:0x4a0005,roughness:.14,clearcoat:1,clearcoatRoughness:.02,metalness:0,envMapIntensity:.7,side:THREE.DoubleSide}));
  drop.scale.setScalar(0.62); drop.position.y=0.085; sa.add(drop);
  const shd=shadowPlane(2.2,2.2,.6); shd.position.y=0.075; sa.add(shd);
  // --- part B: inside the drop
  const sb=new THREE.Scene(); sb.environment=env; sb.background=new THREE.Color(0x240205); sb.fog=new THREE.FogExp2(0x240205,0.05);
  const camB=new THREE.PerspectiveCamera(40,1080/1920,0.05,100); sb.add(camB); const veil=new THREE.Mesh(new THREE.PlaneGeometry(4,4),new THREE.MeshBasicMaterial({color:0xb00c22,transparent:true,depthTest:false,toneMapped:false})); veil.position.z=-0.5; veil.renderOrder=9; camB.add(veil);
  const PB=mkComposer(ren,sb,camB,{bloom:0.35,radius:0.6,th:0.9});
  const kB=new THREE.DirectionalLight(0xffe0d8,1.6); kB.position.set(-2,4,3); sb.add(kB); const kB2=new THREE.DirectionalLight(0xff8a70,0.8); kB2.position.set(3,-2,-2); sb.add(kB2); sb.add(new THREE.HemisphereLight(0xff9a90,0x200204,0.5));
  // biconcave disc (Evans-Fung shape)
  const prof=[]; const NPr=40; for(let i=0;i<=NPr;i++){ const r=Math.sin(i/NPr*Math.PI/2)*0.999; const h=0.5*Math.sqrt(1-r*r)*(0.207+2.003*r*r-1.123*r*r*r*r); prof.push(new THREE.Vector2(r,-h)); }
  for(let i=NPr-1;i>=0;i--){ prof.push(new THREE.Vector2(prof[i].x,-prof[i].y)); }
  const rbcG=new THREE.LatheGeometry(prof,64); rbcG.computeVertexNormals();
  const rbcM=new THREE.MeshPhysicalMaterial({color:0xa00c16,roughness:.35,clearcoat:.6,clearcoatRoughness:.3,envMapIntensity:.4,sheen:.4,sheenColor:new THREE.Color(0xff5040),sheenRoughness:.4,emissive:0x2a0204,emissiveIntensity:.5});
  const N=170, rbc=new THREE.InstancedMesh(rbcG,rbcM,N); sb.add(rbc); const R=rnd(21), cells=[];
  for(let i=0;i<N;i++){ let x,y,z; do{ x=(R()-.5)*16; y=(R()-.5)*26; z=-3-R()*26; }while((Math.hypot(x+1.6,y-0.6)<2.4||Math.hypot(x-2.2,y-3.2)<2.6||Math.hypot(x-0.8,y+3.0)<1.8)&&z>-14); cells.push({p:new THREE.Vector3(x,y,z),q:new THREE.Euler(R()*6,R()*6,R()*6),w:new THREE.Vector3((R()-.5)*.5,(R()-.5)*.5,(R()-.5)*.5),v:new THREE.Vector3((R()-.5)*.12,(R()-.5)*.12,(R()-.5)*.1),s:0.85+R()*0.25}); }
  const hero=new THREE.Mesh(rbcG,rbcM); hero.position.set(-1.6,0.6,-10); hero.rotation.set(1.0,0.2,0.3); sb.add(hero);
  // platelets: small, irregular, pale
  const plG=deform(new THREE.SphereGeometry(1,40,24),v=>new THREE.Vector3(v.x*(1+0.22*Math.sin(3*v.z+1)+0.08*Math.sin(7*v.x)),v.y*0.2,v.z*(1+0.18*Math.cos(4*v.x))));
  const plM=new THREE.MeshPhysicalMaterial({color:0xa8883e,roughness:.6,clearcoat:.2,envMapIntensity:.2,emissive:0x0a0802,emissiveIntensity:.4});
  const NPl=30, pl=new THREE.InstancedMesh(plG,plM,NPl); sb.add(pl); const pls=[]; for(let i=0;i<NPl;i++) pls.push({p:new THREE.Vector3((R()-.5)*14,(R()-.5)*24,-4-R()*20),q:new THREE.Euler(R()*6,R()*6,R()*6),s:0.18+R()*0.08});
  const heroPl=new THREE.Group(); heroPl.position.set(0.9,-2.3,-8); heroPl.scale.setScalar(1.6); sb.add(heroPl); [[0,0,0,.17],[0.3,0.12,-0.1,.13],[-0.22,0.2,0.05,.12]].forEach(([x,y,z,s],i)=>{ const m=new THREE.Mesh(plG,plM); m.position.set(x,y,z); m.scale.setScalar(s); m.rotation.set(i,i*2,0.5); heroPl.add(m); });
  // white blood cell: bigger, pale, bumpy
  const Rb=rnd(77), BUMPS=Array.from({length:220},()=>new THREE.Vector3(Rb()-.5,Rb()-.5,Rb()-.5).normalize()); const wbc=new THREE.Mesh(deform(new THREE.SphereGeometry(1,96,72),v=>{ let d=0; BUMPS.forEach(b=>{ const q=v.dot(b); d+=0.028*Math.exp(-(1-q)*110); }); return v.multiplyScalar(1+d); }),
    new THREE.MeshPhysicalMaterial({color:0xd6c8d8,roughness:.6,clearcoat:.3,envMapIntensity:.45,sheen:.5,sheenColor:new THREE.Color(0xffe0f0),emissive:0x1a1014,emissiveIntensity:.4}));
  wbc.position.set(2.2,3.2,-12); wbc.scale.setScalar(1.75); sb.add(wbc);
  const Mx=new THREE.Matrix4(), Qn=new THREE.Quaternion(), Sv=new THREE.Vector3(), Pv=new THREE.Vector3(), E=new THREE.Euler();
  const A=(par,x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); par.add(o); return o; };
  const aR=A(hero,0.35,0,0.1), aW=A(wbc,-0.55,-0.25,0.6), aP=A(heroPl,0.15,0,0);
  SCN[1]=function(lt){ const TIN=2.0;
    if(lt<TIN){ const pz=cl((lt-0.3)/(TIN-0.3)); const z=pz*pz*(1.6-0.6*pz); const zz=z*z;
      camA.position.set(0.0, 3.4-2.62*zz, 4.6-4.6*z); camA.lookAt(0,0.1,0); camA.fov=30-6*z; camA.updateProjectionMatrix();
      PA.c.render(); }
    else { const u=lt-TIN; const fin=cl(u/0.25); veil.material.opacity=1-easeIO(fin); veil.visible=fin<1; sb.fog.density=0.05; 
      for(let i=0;i<N;i++){ const c=cells[i]; Pv.copy(c.p).addScaledVector(c.v,u); E.set(c.q.x+c.w.x*u,c.q.y+c.w.y*u,c.q.z+c.w.z*u); Qn.setFromEuler(E); Sv.setScalar(c.s); Mx.compose(Pv,Qn,Sv); rbc.setMatrixAt(i,Mx); } rbc.instanceMatrix.needsUpdate=true;
      for(let i=0;i<NPl;i++){ const c=pls[i]; E.set(c.q.x+u*.3,c.q.y+u*.2,c.q.z); Qn.setFromEuler(E); Sv.setScalar(c.s); Mx.compose(c.p,Qn,Sv); pl.setMatrixAt(i,Mx); } pl.instanceMatrix.needsUpdate=true;
      hero.rotation.set(1.0+0.12*u,0.2+0.18*u,0.3); heroPl.rotation.set(0.2*u,0.3*u,0); wbc.rotation.set(0.1*u,0.15*u,0);
      const m=easeIO(cl(u/4.2)); camB.position.set(0.1-0.2*m,0.1+0.1*m,3.4-1.2*easeIO(fin)-1.6*m); camB.lookAt(0.2,0.2,-12); PB.c.render(); }
    const lu=lt-TIN; const out=lt<TIN?0:1;
    layout2(labs(1,[[0,aR,out*cl((lu-0.6)/0.2)],[1,aW,out*cl((lu-1.0)/0.2)],[2,aP,out*cl((lu-1.4)/0.2)]]).map((a,i)=>a.concat([['L','R','R'][i],[345,700,700][i]])),camB,120,480,1480);
    caption(1,lt-TIN-0.1); };
})();

// ---------- S2 /explain-3d how lungs breathe: torso cutaway; the dome-shaped diaphragm contracts and flattens (moves down),
// the lungs expand and air flows in through the trachea and bronchi; the diaphragm relaxes back up and the air flows out.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#1c2630','#040507'); ren.toneMappingExposure=0.6;
  const cam=new THREE.PerspectiveCamera(28,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.35,radius:0.5,th:0.95});
  const key=new THREE.DirectionalLight(0xfff2ee,1.4); key.position.set(-3,5,6); sc.add(key);
  const rim=new THREE.DirectionalLight(0xaecbff,1.0); rim.position.set(4,3,-5); sc.add(rim); sc.add(new THREE.HemisphereLight(0xffe0e0,0x100808,0.3));
  // torso: faint glass shell + ribs + spine (context only)
  const torso=new THREE.Mesh(new THREE.LatheGeometry([[0.0,-2.3],[1.45,-2.3],[1.55,-1.4],[1.62,-0.2],[1.72,0.9],[1.6,1.6],[1.0,2.05],[0.5,2.2],[0,2.25]].map(([r,y])=>new THREE.Vector2(r,y)),64),xrayMat(0x4a6f90,[]));
  torso.scale.set(1,1,0.62); sc.add(torso);
  const boneM=new THREE.MeshPhysicalMaterial({color:0xe8e0d4,roughness:.45,clearcoat:.5,transparent:true,opacity:.16,depthWrite:false,envMapIntensity:.5});
  for(let i=0;i<9;i++){ const y=1.55-i*0.36, rx=1.05+0.4*Math.sin(Math.min(1,(i+1)/4)*Math.PI/2)-0.06*Math.max(0,i-5), rz=0.78;
    const c=new THREE.Curve(); c.getPoint=t=>{ const a=-Math.PI*0.95+t*Math.PI*1.9; return new THREE.Vector3(Math.sin(a)*rx,y-0.45*(1-Math.cos(a))*0.5,-Math.cos(a)*rz*0.85); };
    const rib=new THREE.Mesh(new THREE.TubeGeometry(c,80,0.045,8,false),boneM); sc.add(rib); }
  for(let i=0;i<13;i++){ const v=new THREE.Mesh(rbox(0.26,0.2,0.22,0.06),boneM); v.position.set(0,1.85-i*0.3,-0.72); sc.add(v); }
  // lungs
  const lungTex=fiberTex(13,true);
  const lungM=new THREE.MeshPhysicalMaterial({color:0xd2606f,roughness:.5,clearcoat:.35,clearcoatRoughness:.4,envMapIntensity:.4,sheen:.2,sheenColor:new THREE.Color(0xffb0b8),sheenRoughness:.5,bumpMap:lungTex,bumpScale:.025,transparent:true,opacity:.8,depthWrite:false});
  const lungG=(side)=>deform(new THREE.SphereGeometry(1,96,72),v=>{ let {x,y,z}=v; const n=1+0.025*Math.sin(4*x+3*y)*Math.cos(5*z+2*y);
      x*=n; z*=n; y*=1.5*n; if(y>0){ const k=1-0.42*Math.pow(y/1.5,2); x*=k; z*=k; } if(y<-0.95){ y=-0.95+(y+0.95)*0.22; }
      const med=side*x; if(med>0.35) x=side*(0.35+(med-0.35)*0.35); if(side>0&&med>0.2&&y<0.2&&z>0) x-=side*0.18*(z)*(1-Math.abs(y+0.4)); // cardiac notch on the left lung
      y+= -0.18*(1-(x*x)) * (y<-0.6?1:0); return new THREE.Vector3(x*0.74,y,z*0.7); });
  const L=new THREE.Group(); sc.add(L);
  const lr=new THREE.Mesh(lungG(1),lungM); lr.position.set(-0.76,0.2,0); // patient's right lung (viewer's left)
  const ll=new THREE.Mesh(lungG(-1),lungM); ll.position.set(0.76,0.2,0); ll.scale.x=-0.94; lr.scale.x=-1; // mirror so the medial side faces the middle
  L.add(lr); L.add(ll);
  // airways: trachea with cartilage rings, two bronchi, branches inside each lung
  const airM=new THREE.MeshPhysicalMaterial({color:0xd8b8b0,roughness:.45,clearcoat:.5,envMapIntensity:.5,transparent:true,opacity:.6,depthWrite:false}), ringM=new THREE.MeshPhysicalMaterial({color:0xeee2d8,roughness:.4,clearcoat:.6,envMapIntensity:.5});
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.13,1.2,28,1,true),airM); tr.position.set(0,1.9,0.05); sc.add(tr);
  for(let i=0;i<9;i++){ const r=new THREE.Mesh(new THREE.TorusGeometry(0.135,0.022,8,32),ringM); r.rotation.x=Math.PI/2; r.position.set(0,1.4+i*0.13,0.05); sc.add(r); }
  const tree=[], treeG=new THREE.Group(); sc.add(treeG);
  const branch=(pts,r)=>{ const c=crv(pts); const m=new THREE.Mesh(new THREE.TubeGeometry(c,40,r,14,false),airM); treeG.add(m); tree.push(c); return c; };
  const bR=branch([[0,1.32,0.05],[-0.28,1.05,0.05],[-0.55,0.75,0.05]],0.1), bL=branch([[0,1.32,0.05],[0.3,1.08,0.05],[0.58,0.8,0.05]],0.095);
  const ends=[]; const Rr=rnd(9);
  [[-1,[-0.55,0.75,0.05]],[1,[0.58,0.8,0.05]]].forEach(([s,o])=>{ [[0.25,0.65],[0.15,0.15],[0.05,-0.35],[0.45,-0.25],[0.4,0.25]].forEach(([dx,dy],j)=>{
      const e=[o[0]+s*dx*0.9,o[1]-0.2+dy*1.0-0.25,0.05+(Rr()-.5)*0.3]; const mid=[(o[0]+e[0])/2,(o[1]+e[1])/2+0.05,0.05];
      const c=branch([o,mid,e],0.04); ends.push([s,c]); }); });
  const tracheaC=crv([[0,2.5,0.05],[0,1.9,0.05],[0,1.32,0.05]]);
  // diaphragm: dome of muscle under the lungs
  const diaM=new THREE.MeshPhysicalMaterial({color:0x8a2228,roughness:.45,clearcoat:.6,envMapIntensity:.5,sheen:.4,sheenColor:new THREE.Color(0xff9090),bumpMap:fiberTex(17,false),bumpScale:.03,side:THREE.DoubleSide});
  const dia=new THREE.Mesh(deform(new THREE.SphereGeometry(1,72,24,0,Math.PI*2,0,Math.PI/2),v=>new THREE.Vector3(v.x,v.y*(1-0.25*Math.exp(-v.x*v.x*30)),v.z)),diaM);
  const D=new THREE.Group(); D.add(dia); { const arc=new THREE.Curve(); arc.getPoint=t=>{ const a=Math.PI*t; return new THREE.Vector3(Math.cos(a)*0.99,Math.sin(a)*0.99,0); }; const am=glowMat(0xffb4a0,0.85); am.depthTest=false; const al=new THREE.Mesh(new THREE.TubeGeometry(arc,80,0.022,8,false),am); al.renderOrder=6; D.add(al); } D.position.set(0,-1.05,0); sc.add(D);
  const ctrM=new THREE.MeshPhysicalMaterial({color:0xcfc4ba,envMapIntensity:.5,roughness:.35,clearcoat:.8,side:THREE.DoubleSide}); 
  // arrows that show the diaphragm pulling down
  const arM=glowMat(0x9fe0ff,0); const arrows=[-1.4,1.4].map(x=>{ const g=new THREE.Group(); const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.4,12),arM); sh.position.y=0.2; const hd=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.18,16),arM); hd.rotation.z=Math.PI; g.add(sh); g.add(hd); g.position.set(x,-0.9,0.95); sc.add(g); return g; });
  // air particles
  const NA=90, air=[]; const Ra=rnd(31); for(let i=0;i<NA;i++){ const gm=glowMat(0x8fd8ff,0); gm.depthTest=false; const m=new THREE.Mesh(new THREE.SphereGeometry(0.048,8,6),gm); m.renderOrder=5; sc.add(m); const [s,c]=ends[i%ends.length];
    air.push({m,c,s,off:Ra()*0.55,j:new THREE.Vector3((Ra()-.5)*0.04,(Ra()-.5)*0.04,(Ra()-.5)*0.04)}); }
  const TP=new THREE.Vector3();
  const A=(par,x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); par.add(o); return o; };
  const aT=A(sc,0.12,2.1,0.1), aL=A(lr,0.15,0.0,0.62), aD=A(D,0.75,0.55,0.4);
  const breath=(t)=>{ // 0 = out, 1 = full breath in
    if(t<0.75) return 0; if(t<2.55) return easeIO((t-0.75)/1.8); if(t<4.1) return 1-easeIO((t-2.55)/1.55); return easeIO((t-4.1)/1.8); };
  SCN[2]=function(lt){ const b=breath(lt), db=breath(lt+0.05)-b;
    D.scale.set(1.3,0.7-0.28*b,0.85); D.position.y=-1.0-0.18*b;
    [lr,ll].forEach((m,i)=>{ const sx=(i?-0.94:-1)*(1+0.06*b); m.scale.set(sx,1+0.13*b,1+0.08*b); m.position.y=0.2-0.2*b; m.position.x=(i?0.76:-0.76)*(1+0.04*b); });
    arrows.forEach(g=>{ g.position.y=-0.85-0.3*b; g.children.forEach(c=>c.material.opacity=0); }); arM.opacity=cl(db*40)*0.9;
    air.forEach((a,i)=>{ // fill: inflow follows b; each particle travels trachea -> bronchus -> branch end
      const u=cl((b*1.35-a.off*0.35)); const vis=cl(b*6)*(0.45+0.55*cl(Math.abs(db)*40));
      if(u<0.45) TP.copy(tracheaC.getPointAt(u/0.45)); else TP.copy(a.c.getPointAt(Math.min(1,(u-0.45)/0.55)));
      TP.add(a.j); a.m.position.copy(TP).add(lr.position.clone().multiplyScalar(0)); a.m.material.opacity=u>0.001?vis*cl(u*8):0; });
    const z=easeIO(cl((lt-0.1)/5.0)); cam.position.set(-0.9+0.7*z,1.0+0.1*z,14.4-1.2*z); cam.lookAt(0,0.62,0); P.c.render();
    layout2(labs(2,[[0,aT,cl((lt-0.9)/0.2)],[1,aL,cl((lt-1.3)/0.2)],[2,aD,cl((lt-1.7)/0.2)]]).map((a,i)=>a.concat([['R','L','R'][i],[735,345,680][i]])),cam,120,480,1480);
    caption(2,lt-0.6); };
})();
