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

function starField(sc,n,seed,r){ const R=rnd(seed), sp=[]; for(let i=0;i<n;i++){ const v=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(r||300); sp.push(v.x,v.y,v.z); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sc.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.2,sizeAttenuation:false,toneMapped:false}))); }
function backOut(x){ x=cl(x); const c1=1.9, c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); }
function fixLab(id,x,y,a){ const el=document.getElementById(id); if(!el) return; el.style.left=x+'px'; el.style.top=y+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld) ld.style.width='0px'; }
function rr(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }
function vnoise(seed){ const r=rnd(seed); const P=[]; for(let i=0;i<512;i++) P.push(r()); return (x,y)=>{ const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi; const h=(a,b)=>P[(((a*73856093)^(b*19349663))>>>0)%512];
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return h(xi,yi)*(1-u)*(1-v)+h(xi+1,yi)*u*(1-v)+h(xi,yi+1)*(1-u)*v+h(xi+1,yi+1)*u*v; }; }
function fbm(n,x,y,o){ let s=0,a=0.5,f=1; for(let i=0;i<(o||5);i++){ s+=a*n(x*f,y*f); f*=2; a*=0.5; } return s; }
function smooth(e0,e1,x){ const t=cl((x-e0)/(e1-e0)); return t*t*(3-2*t); }
function proj(v,cam){ V.copy(v).project(cam); return [(V.x*.5+.5)*1080,(-V.y*.5+.5)*1920]; }
const win=(lt,a,b,f)=>cl((lt-a)/(f||0.25))*(1-cl((lt-b)/(f||0.25)));
const lerp=(a,b,t)=>a+(b-a)*t;
function lab(id,x,y,a,side){ const el=document.getElementById(id); if(!el) return; const w=el.offsetWidth||300; let lx=side<0?x-w-40:x+40; lx=Math.max(70,Math.min(1010-w,lx));
  a*=cl((y-520)/60); y=Math.max(560,Math.min(1110,y)); el.style.left=lx+'px'; el.style.top=y+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld){ const dx=x-lx, dy=0; ld.style.width='0px'; } }

// ---------- S0 /explain-3d how a virus hijacks a cell: close on a big cell membrane (soft, wet, bumpy, with receptors). A spiky virus
// drifts in, its spike proteins lock onto a receptor, the membrane dimples and swallows it; inside, the viral genes glow and spread
// (the cell's machinery now copies them); new virus copies bud out of the membrane and drift off to infect more cells.
function virusMesh(sc){ const g=new THREE.Group(); const R=rnd(sc);
  const core=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(0.34,6),v=>{ const n=0.012*Math.sin(v.x*40)*Math.sin(v.y*37)*Math.sin(v.z*43); return v.multiplyScalar(1+n/0.34); }),
    new THREE.MeshPhysicalMaterial({color:0x9aa3ad,roughness:.45,clearcoat:.5,clearcoatRoughness:.3,sheen:.6,sheenColor:new THREE.Color(0xd8e6ff),envMapIntensity:.6}));
  g.add(core);
  const spM=new THREE.MeshPhysicalMaterial({color:0xd8402c,roughness:.38,clearcoat:.6,envMapIntensity:.6,emissive:0x3a0804,emissiveIntensity:.5});
  const stG=new THREE.CylinderGeometry(0.018,0.03,0.16,10); stG.translate(0,0.08,0); const hdG=new THREE.SphereGeometry(0.05,14,10); hdG.scale(1,0.75,1); hdG.translate(0,0.17,0);
  const N=46; for(let i=0;i<N;i++){ const y=1-(i+0.5)/N*2, r=Math.sqrt(1-y*y), a=i*2.39996; const d=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);
    const s=new THREE.Group(); s.add(new THREE.Mesh(stG,spM)); s.add(new THREE.Mesh(hdG,spM)); s.position.copy(d).multiplyScalar(0.32); s.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d); s.scale.setScalar(0.9+R()*0.25); g.add(s); }
  g.userData.core=core; return g; }
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#3a1a24','#07040a'); ren.toneMappingExposure=0.5;
  sc.fog=new THREE.Fog(0x12070c,9,22);
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.05,100); const P=mkComposer(ren,sc,cam,{bloom:0.22,radius:0.45,th:0.97});
  const key=new THREE.DirectionalLight(0xfff0ea,1.1); key.position.set(-3,6,4); sc.add(key);
  const rim=new THREE.DirectionalLight(0x9fd0ff,1.2); rim.position.set(4,2,-5); sc.add(rim); sc.add(new THREE.HemisphereLight(0xffd8e0,0x1a0610,0.35));
  // the cell: a big sphere, top surface near the camera; dimple handled per frame on a copy of the base positions
  const CR=7, CC=new THREE.Vector3(0,-CR-0.35,0); const nz=vnoise(9);
  const mg=new THREE.SphereGeometry(CR,220,160); const bp=mg.attributes.position.array.slice(); const bn=mg.attributes.normal.array.slice();
  { const p=mg.attributes.position, v=new THREE.Vector3(); for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); const n=v.clone().normalize(); const b=0.05*fbm(nz,v.x*1.3+9,v.z*1.3+v.y*0.7,4)+0.012*Math.sin(v.x*9)*Math.sin(v.z*8);
      v.addScaledVector(n,b); p.setXYZ(i,v.x,v.y,v.z); bp[i*3]=v.x; bp[i*3+1]=v.y; bp[i*3+2]=v.z; } mg.computeVertexNormals(); }
  const memT=canvasTex(1024,1024,(g,w,h)=>{ g.fillStyle='#c96a6a'; g.fillRect(0,0,w,h); const R=rnd(4); for(let i=0;i<4000;i++){ const x=R()*w,y=R()*h,r=2+R()*7; g.fillStyle=R()<.5?'rgba(255,190,170,.18)':'rgba(120,30,50,.16)'; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); } }); memT.wrapS=memT.wrapT=THREE.RepeatWrapping; memT.repeat.set(6,6);
  const memM=new THREE.MeshPhysicalMaterial({map:memT,color:0xd88a88,roughness:.6,clearcoat:.15,clearcoatRoughness:.5,sheen:.2,sheenColor:new THREE.Color(0xff9aa8),sheenRoughness:.6,transparent:true,opacity:.5,envMapIntensity:.25,depthWrite:false,side:THREE.FrontSide});
  const mem=new THREE.Mesh(mg,memM); mem.position.copy(CC); mem.renderOrder=5; sc.add(mem);
  const rimM=xrayMat(0xff7088,[]); rimM.uniforms.op.value=0.35; const memRim=new THREE.Mesh(mg,rimM); mem.add(memRim); memRim.renderOrder=6;
  // inside the cell: nucleus glow far down, soft organelle blobs
  const inner=new THREE.Group(); inner.position.copy(CC); sc.add(inner);
  const nuc=new THREE.Mesh(new THREE.SphereGeometry(2.2,48,32),new THREE.MeshStandardMaterial({color:0x5a2a6a,emissive:0x3a1450,emissiveIntensity:.6,roughness:.6})); nuc.position.set(0,3.4,-1.5); inner.add(nuc);
  { const R=rnd(12); for(let i=0;i<26;i++){ const b=new THREE.Mesh(new THREE.SphereGeometry(0.12+R()*0.18,20,14),new THREE.MeshStandardMaterial({color:0xd78a5a,emissive:0x40180a,emissiveIntensity:.5,roughness:.5})); b.scale.set(1+R()*1.6,0.6,0.7); b.position.set((R()-.5)*6,CR-1.0-R()*1.6,(R()-.5)*4-0.5); b.rotation.set(R()*3,R()*3,0); inner.add(b); } }
  // receptors on the surface
  const recM=new THREE.MeshStandardMaterial({color:0x6fc3b0,roughness:.4,emissive:0x0c2a24,emissiveIntensity:.6}); const recs=[];
  { const R=rnd(5); for(let i=0;i<70;i++){ const a=(R()-.5)*0.9, b=(R()-.5)*0.9; const d=new THREE.Vector3(Math.sin(a),1,Math.sin(b)).normalize(); if(i===0) d.set(0,1,0);
      const m=new THREE.Group(); const s=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.02,0.12,8),recM); s.position.y=0.06; m.add(s); const t=new THREE.Mesh(new THREE.TorusGeometry(0.03,0.012,8,16,Math.PI),recM); t.position.y=0.13; m.add(t);
      m.position.copy(d).multiplyScalar(CR+0.02).add(CC); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d); m.rotateY(R()*3); sc.add(m); recs.push(m); } }
  const DOCK=new THREE.Vector3(0,-0.35+0.02,0);
  // the virus and its copies
  const vir=virusMesh(3); sc.add(vir);
  const kids=[]; [[-1.3,-0.25,0.6],[1.1,-0.4,0.9],[-0.4,-0.6,1.6],[1.6,-0.15,-0.4],[-1.8,-0.5,-0.6],[0.5,-0.3,-1.2]].forEach((p,i)=>{ const k=virusMesh(10+i); k.scale.setScalar(0.0001); sc.add(k);
    const d=new THREE.Vector3(p[0],0,p[2]); const n=new THREE.Vector3(p[0],CR,p[2]).normalize(); const base=n.clone().multiplyScalar(CR).add(CC); kids.push({k,base,n,t0:3.0+i*0.16}); });
  // viral genes: glowing strands spreading inside
  const genes=[]; { const R=rnd(31); for(let j=0;j<7;j++){ const pts=[[0,-0.75,0]]; let x=0,y=-0.75,z=0; const a=j/7*Math.PI*2; for(let k=0;k<9;k++){ x+=Math.cos(a)*0.32+(R()-.5)*0.3; z+=Math.sin(a)*0.32+(R()-.5)*0.3; y-=0.06+R()*0.12; pts.push([x,y,z]); }
      const c=crv(pts); const g=new THREE.TubeGeometry(c,120,0.03,8,false); const m=new THREE.Mesh(g,glowMat(0x66ffa0,0.95)); m.userData.n=g.index.count; g.setDrawRange(0,0); m.renderOrder=4; sc.add(m); genes.push(m); } }
  const gglow=new THREE.PointLight(0x6dffa8,0,4,2); gglow.position.set(0,-1.0,0); sc.add(gglow);
  const dust=[]; { const R=rnd(8); const g=new THREE.BufferGeometry(); const a=[]; for(let i=0;i<300;i++) a.push((R()-.5)*10,(R()-.2)*6,(R()-.5)*8); g.setAttribute('position',new THREE.Float32BufferAttribute(a,3)); const p=new THREE.Points(g,new THREE.PointsMaterial({color:0xffc0c8,size:0.025,transparent:true,opacity:.35})); sc.add(p); dust.push(p); }
  const A=(par,x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); par.add(o); return o; };
  const aSp=A(vir,-0.3,0.25,0.2), aGe=new THREE.Object3D(); aGe.position.set(0.9,-1.05,0.6); sc.add(aGe); const aKid=A(kids[1].k,0,0,0);
  const vpos=new THREE.Vector3();
  SCN[0]=function(lt){
    // virus path: in from upper left, docks at 1.35, sinks 1.5-2.4
    const ap=ease(cl(lt/1.35)), s1=easeIO(cl((lt-1.5)/1.0));
    const vy=lt<1.35? 0.1+1.15*(1-ap)+0.05*Math.sin(lt*2.5)*(1-ap) : 0.1-1.05*s1;
    vir.position.set(-1.7*(1-ap), vy, 0.7*(1-ap)); vir.rotation.set(0.4+0.9*(1-ap),0.3+1.1*(1-ap)+0.05*lt,0.1);
    const gone=cl((lt-2.3)/0.5); vir.scale.setScalar(Math.max(0.0001,1-0.6*gone)); vir.visible=gone<0.99;
    vir.userData.core.material.emissive=new THREE.Color(0x2aff80); vir.userData.core.material.emissiveIntensity=0.2*cl((lt-2.0)/0.4);
    // membrane dimple wraps the virus while it sinks, then closes over it
    const dep=Math.max(0,-0.35-(vy-0.44))*(1-sstep(0.65,1.0,s1)) + 0.04*cl((lt-1.2)/0.15)*(1-cl((lt-2.6)/0.3));
    const p=mg.attributes.position; for(let i=0;i<p.count;i++){ const y=bp[i*3+1]; if(y<CR-1.2) continue; const x=bp[i*3], z=bp[i*3+2]; const d=dep*Math.exp(-(x*x+z*z)/0.36); p.setXYZ(i,x,y-d,z); }
    p.needsUpdate=true; mg.computeVertexNormals();
    // genes
    genes.forEach((m,j)=>drawTo(m,(lt-2.15-j*0.05)/1.1)); const gv=cl((lt-2.15)/0.4); gglow.intensity=0.0*gv*(1+0.2*Math.sin(lt*7));
    genes.forEach(m=>m.material.opacity=0.95*(0.8+0.2*Math.sin(lt*6)));
    // copies bud out of the membrane and drift away
    kids.forEach(({k,base,n,t0},i)=>{ const u=lt-t0; const g=easeIO(cl(u/0.7)), f=cl((u-0.6)/2); k.scale.setScalar(Math.max(0.0001,0.85*g)); k.position.copy(base).addScaledVector(n,-0.2+0.55*g+0.9*f*f+0.25*f); k.rotation.set(u*0.5+i,u*0.7,0); });
    recs.forEach((r,i)=>{ r.rotation.z=0.08*Math.sin(lt*2+i); });
    dust[0].rotation.y=lt*0.03; dust[0].position.y=lt*0.05;
    // camera: close push, then a gentle rise to see the copies
    const c1=easeIO(cl(lt/2.6)), c2=easeIO(cl((lt-2.6)/2.4));
    cam.position.set(1.0-0.5*c1-0.2*c2, 1.9-0.2*c1+0.8*c2, 7.0-1.4*c1+1.8*c2); cam.lookAt(0.05, -0.75-0.1*c1+0.15*c2, 0); P.c.render();
    const lv=(t0,t1)=>cl((lt-t0)/0.2)*(1-cl((lt-(t1||99))/0.2));
    layout2(labs(0,[[0,aSp,lv(0.55,1.9)],[1,aGe,lv(2.45)],[2,aKid,lv(3.4)]]).map((x,i)=>x.concat([['L','R','R'][i],[430,650,650][i]])),cam,130,520,1120);
    caption(0,lt-3.0); };
})();

// ---------- S1 /zoom-in a mosquito bite: a skin cross-section (hairs and pores on top, epidermis, dermis with fibres, a capillary with
// red blood cells flowing through). The mosquito's sheath (labium) touches down and BENDS back; the 6-stylet bundle goes in alone
// (2 maxillae saw, 2 mandibles hold the tissue apart), probes, spits saliva (stops clotting), the labrum finds the vessel and sips.
// Source: KQED/NPR "Watch mosquitoes use 6 needles to suck your blood" (2016).
(function(){ const cv=document.getElementById('cv1'), g=cv.getContext('2d'); const W=1080,H=1920, SY=700, VY=1050, VR=46, TX=560;
  const R=rnd(17), n1=vnoise(3), n2=vnoise(29);
  const off=(w,h,f)=>{ const c=document.createElement('canvas'); c.width=w; c.height=h; f(c.getContext('2d'),w,h); return c; };
  // static tissue layers, painted once (wider than the frame for the slow zoom)
  const TIS=off(1400,1500,(c,w,h)=>{ const y0=SY-400+0; // tissue canvas covers y 300..1800 of the scene
    const sy=SY-300; // skin top inside this canvas
    // dermis base
    const dg=c.createLinearGradient(0,sy,0,h); dg.addColorStop(0,'#e7a08e'); dg.addColorStop(.35,'#d98676'); dg.addColorStop(1,'#a8505a'); c.fillStyle=dg; c.fillRect(0,sy,w,h-sy);
    // collagen fibres
    for(let i=0;i<900;i++){ const x=R()*w, y=sy+90+R()*(h-sy-90), l=40+R()*140, a=(R()-.5)*0.9; c.strokeStyle=`rgba(${255},${220+R()*30|0},${210},${0.08+R()*0.14})`; c.lineWidth=2+R()*5; c.beginPath(); c.moveTo(x,y); c.quadraticCurveTo(x+l*0.5*Math.cos(a),y+l*0.5*Math.sin(a)+12*(R()-.5),x+l*Math.cos(a),y+l*Math.sin(a)); c.stroke(); }
    for(let i=0;i<260;i++){ const x=R()*w, y=sy+110+R()*(h-sy-110); c.fillStyle=`rgba(120,40,70,${0.18+R()*0.2})`; c.beginPath(); c.ellipse(x,y,4+R()*5,3+R()*3,R()*3,0,7); c.fill(); }
    // epidermis: stacked cells, flatter toward the top, dead flaky layer on top
    for(let row=0;row<9;row++){ const yy=sy+row*11+4, hh=10+row*0.6; let x=-R()*30; while(x<w){ const ww=26+R()*26-row*1.2; const sh=0.82+0.18*R();
        c.fillStyle=`rgb(${(236-row*3)*sh|0},${(196-row*6)*sh|0},${(170-row*5)*sh|0})`; rr(c,x+1,yy+(R()-.5)*2,ww-2,hh,5); c.fill(); c.fillStyle='rgba(150,80,60,.35)'; c.beginPath(); c.arc(x+ww/2,yy+hh/2,2.4,0,7); c.fill(); x+=ww; } }
    const eg=c.createLinearGradient(0,sy,0,sy+110); eg.addColorStop(0,'rgba(255,235,215,.55)'); eg.addColorStop(1,'rgba(255,235,215,0)'); c.fillStyle=eg; c.fillRect(0,sy,w,110);
    // wavy basement line
    c.strokeStyle='rgba(150,60,60,.35)'; c.lineWidth=3; c.beginPath(); for(let x=0;x<=w;x+=8) c.lineTo(x,sy+104+8*Math.sin(x*0.03)); c.stroke();
    // a hair follicle on the left
    c.fillStyle='rgba(120,70,50,.45)'; c.beginPath(); c.ellipse(170,sy+300,26,150,0.15,0,7); c.fill(); c.strokeStyle='#3a2216'; c.lineWidth=7; c.beginPath(); c.moveTo(150,sy+430); c.quadraticCurveTo(170,sy+200,200,sy-180); c.stroke();
    c.lineWidth=5; c.beginPath(); c.moveTo(1240,sy+40); c.quadraticCurveTo(1250,sy-60,1300,sy-170); c.stroke();
  });
  const cells=[]; for(let i=0;i<46;i++) cells.push([R()*1400,(R()-.5)*0.9,R()*6,0.85+R()*0.3]);
  const sal=[]; for(let i=0;i<30;i++) sal.push([R(),R()*6.28,R()]);
  const air=off(W,800,(c,w,h)=>{ const gr=c.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#141a20'); gr.addColorStop(1,'#2a3036'); c.fillStyle=gr; c.fillRect(0,0,w,h); for(let i=0;i<80;i++){ c.fillStyle=`rgba(255,255,255,${R()*0.05})`; c.beginPath(); c.arc(R()*w,R()*h,10+R()*60,0,7); c.fill(); } });
  // stylet path: entry at (TX,SY), probes left/right, finds the vessel at (TX+60,VY-VR+6)
  const PTS=[[TX,SY-40],[TX,SY],[TX+4,SY+120],[TX-26,SY+210],[TX+34,SY+260],[TX+56,VY-VR-20],[TX+62,VY-VR+10]];
  function cr(f){ const t=Math.min(PTS.length-1.0001,Math.max(0,f*(PTS.length-1))), k=Math.floor(t), u=t-k; const p=(i)=>PTS[Math.max(0,Math.min(PTS.length-1,i))];
    const a=p(k-1),b=p(k),c=p(k+1),d=p(k+2); const C=(q0,q1,q2,q3)=>0.5*((2*q1)+(-q0+q2)*u+(2*q0-5*q1+4*q2-q3)*u*u+(-q0+3*q1-3*q2+q3)*u*u*u); return [C(a[0],b[0],c[0],d[0]),C(a[1],b[1],c[1],d[1])]; }
  SCN[1]=function(lt){ g.save(); g.fillStyle='#10151a'; g.fillRect(0,0,W,H);
    const z=1+0.3*easeIO(cl(lt/4.6)), DX=-40+14*Math.sin(lt*0.6); g.translate(TX,SY+150); g.scale(z,z); g.translate(-TX,-(SY+150)); g.translate(DX,0);
    g.drawImage(air,-200,SY-800,W+400,800);
    g.drawImage(TIS,-160,SY-400);
    // capillary: wall, plasma, flowing red cells
    const vg=g.createLinearGradient(0,VY-VR,0,VY+VR); vg.addColorStop(0,'#7a1020'); vg.addColorStop(.5,'#b0182a'); vg.addColorStop(1,'#6a0c1a'); g.fillStyle='rgba(230,140,140,.9)'; g.fillRect(-200,VY-VR-9,W+400,2*VR+18);
    g.fillStyle=vg; g.fillRect(-200,VY-VR,W+400,2*VR);
    const tip=cr(1); const suck=cl((lt-3.0)/0.4);
    cells.forEach(([x0,yo,ph,s])=>{ let x=((x0+lt*150)%1400)-160; let y=VY+yo*VR; const dx=x-tip[0]; if(suck>0&&Math.abs(dx)<120){ y-=suck*14*Math.exp(-dx*dx/3000); }
      g.save(); g.translate(x,y); g.rotate(0.3*Math.sin(ph+lt*2)); g.scale(s,s); const cg=g.createRadialGradient(0,0,4,0,0,22); cg.addColorStop(0,'#8a0c18'); cg.addColorStop(.55,'#d42a32'); cg.addColorStop(1,'#a01422'); g.fillStyle=cg; g.beginPath(); g.ellipse(0,0,22,12*(0.7+0.3*Math.abs(Math.sin(ph+lt))),0,0,7); g.fill(); g.restore(); });
    const hl=g.createLinearGradient(0,VY-VR,0,VY-VR+16); hl.addColorStop(0,'rgba(255,200,200,.35)'); hl.addColorStop(1,'rgba(255,200,200,0)'); g.fillStyle=hl; g.fillRect(-200,VY-VR,W+400,16);
    // the mosquito's head + mouthparts (drawn in code): head and eye top right, feathery antennae, palps, the labium (sheath) comes
    // down, its tip (labella) lands ON the skin and stays there, buckling outward as the head lowers; only the thin stylet bundle goes in
    const dn=ease(cl(lt/0.8)), pen=easeIO(cl((lt-0.9)/1.9)), pump=suck*Math.sin(lt*9)*0.5+0.5*suck;
    const HX=TX+300+(1-dn)*120+4*Math.sin(lt*2.1), HY=SY-430-(1-dn)*330+70*pen+5*Math.sin(lt*1.7)+3*pump;
    const root=[HX-70,HY+70], foot=[TX+6,SY-6-(1-dn)*30];
    const dxr=foot[0]-root[0], dyr=foot[1]-root[1], L=Math.hypot(dxr,dyr); const nx=-dyr/L, ny=dxr/L; const bow=30+190*pen;
    const mid=[(root[0]+foot[0])/2+nx*bow*-1,(root[1]+foot[1])/2+ny*bow*-1];
    g.lineCap='round'; g.lineJoin='round';
    // antennae (feathery) + palps
    [[0.0,1],[0.35,0.85]].forEach(([o,sc2])=>{ const ax=HX+10, ay=HY-40; const ex=ax+150*sc2+20*Math.sin(lt+o*5), ey=ay-260*sc2; g.strokeStyle='#2a1d12'; g.lineWidth=5; g.beginPath(); g.moveTo(ax,ay); g.quadraticCurveTo(ax+30,ay-140*sc2,ex,ey); g.stroke();
      for(let i=1;i<14;i++){ const u=i/14; const px=(1-u)*(1-u)*ax+2*u*(1-u)*(ax+30)+u*u*ex, py=(1-u)*(1-u)*ay+2*u*(1-u)*(ay-140*sc2)+u*u*ey; g.strokeStyle='rgba(60,45,30,.55)'; g.lineWidth=1.6; const l=26*(1-u*0.5);
        g.beginPath(); g.moveTo(px-l,py+4); g.lineTo(px+l,py-4); g.stroke(); } });
    [[-18,8],[16,-6]].forEach(([ox,oy])=>{ g.strokeStyle='#3a2a1a'; g.lineWidth=11; g.beginPath(); g.moveTo(root[0]+ox+10,root[1]+oy-10); g.lineTo(root[0]+ox-120*dxr/L*0.0-dxr/L*-0+dxr*0.32+ox,root[1]+oy+dyr*0.32); g.stroke(); });
    // labium: thick, scaly, tapering, buckled
    const qp=(u)=>[(1-u)*(1-u)*root[0]+2*u*(1-u)*mid[0]+u*u*foot[0],(1-u)*(1-u)*root[1]+2*u*(1-u)*mid[1]+u*u*foot[1]];
    for(let i=0;i<40;i++){ const u0=i/40, u1=(i+1)/40; const p0=qp(u0), p1=qp(u1); const w=26-12*u0;
      g.strokeStyle='#1f150c'; g.lineWidth=w+6; g.beginPath(); g.moveTo(...p0); g.lineTo(...p1); g.stroke();
      g.strokeStyle=i%2?'#6a4e32':'#634830'; g.lineWidth=w; g.beginPath(); g.moveTo(...p0); g.lineTo(...p1); g.stroke();
      g.strokeStyle='rgba(255,225,180,.22)'; g.lineWidth=w*0.25; g.beginPath(); g.moveTo(p0[0]-w*0.25,p0[1]); g.lineTo(p1[0]-w*0.25,p1[1]); g.stroke(); }
    // labella: the two soft lobes resting on the skin
    g.fillStyle='#5a4028'; [[-12,-4],[12,-4]].forEach(([ox,oy])=>{ g.beginPath(); g.ellipse(foot[0]+ox,foot[1]+oy,13,9,ox<0?-0.4:0.4,0,7); g.fill(); });
    // head: body, scales, big compound eye
    g.save(); g.translate(HX,HY); g.rotate(-0.55);
    const hg=g.createRadialGradient(-20,-30,10,0,0,120); hg.addColorStop(0,'#6a5038'); hg.addColorStop(1,'#1e140b'); g.fillStyle=hg; g.beginPath(); g.ellipse(0,0,120,92,0,0,7); g.fill();
    g.fillStyle='rgba(240,230,210,.18)'; for(let i=0;i<60;i++){ const a=i*2.4, r=60+((i*37)%50); g.beginPath(); g.ellipse(Math.cos(a)*r*0.95,Math.sin(a)*r*0.7,7,3,a,0,7); g.fill(); }
    const eg2=g.createRadialGradient(-30,-20,4,-10,0,80); eg2.addColorStop(0,'#7a2a1e'); eg2.addColorStop(.7,'#3a0e0a'); eg2.addColorStop(1,'#120404'); g.fillStyle=eg2; g.beginPath(); g.ellipse(-12,-4,72,64,0.3,0,7); g.fill();
    g.save(); g.beginPath(); g.ellipse(-12,-4,70,62,0.3,0,7); g.clip(); g.fillStyle='rgba(255,140,110,.16)'; for(let y=-70;y<70;y+=9) for(let x=-90;x<70;x+=10){ g.beginPath(); g.arc(x+(y/9%2?5:0),y,3.2,0,7); g.fill(); } g.restore();
    g.fillStyle='rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(-40,-34,16,8,-0.5,0,7); g.fill(); g.restore();
    // stylet bundle: 6 thin amber needles, from the labella into the skin
    const entry=[foot[0],SY+2]; let pts=[], tp=entry;
    if(lt>0.85){ const n=60; for(let i=0;i<=n;i++) pts.push(cr(Math.max(0.17,pen)*i/n)); pts=pts.filter(p=>p[1]>=SY-10); if(pts.length<2) pts=[entry,[entry[0],entry[1]+1]];
      const m=pts.length-1; tp=pts[m];
      for(let k=0;k<6;k++){ const off=(k-2.5)*1.9; g.strokeStyle=k===2||k===3?'#e0a85a':'#b77a36'; g.lineWidth=1.8; g.beginPath();
        pts.forEach((p,i)=>{ const q=pts[Math.min(m,i+1)], pp=pts[Math.max(0,i-1)]; const ax=-(q[1]-pp[1]), ay=(q[0]-pp[0]); const LL=Math.hypot(ax,ay)||1; const sp=1+(i>m-5?(i-(m-5))*0.8:0);
          const x=p[0]+ax/LL*off*sp, y=p[1]+ay/LL*off*sp; i?g.lineTo(x,y):g.moveTo(x,y); }); g.stroke(); }
      g.fillStyle='rgba(60,30,10,.9)'; for(let k=0;k<3;k++){ g.beginPath(); g.arc(tp[0]+(k-1)*4,tp[1]+2*Math.sin(lt*30+k),2,0,7); g.fill(); }
      // saliva puffs
      const sv=cl((lt-1.5)/0.3)*(1-cl((lt-3.2)/0.5)); if(sv>0) sal.forEach(([o,a,s2])=>{ const t=(lt*0.8+o)%1; const r=10+60*t; const x=tp[0]+Math.cos(a)*r*(0.6+s2), y=tp[1]+Math.sin(a)*r*0.7; const gg=g.createRadialGradient(x,y,0,x,y,16+20*t); gg.addColorStop(0,`rgba(220,255,200,${0.45*sv*(1-t)})`); gg.addColorStop(1,'rgba(220,255,200,0)'); g.fillStyle=gg; g.beginPath(); g.arc(x,y,16+20*t,0,7); g.fill(); });
      // blood: fills the straw from the tip up, then keeps flowing (moving red pulses up the bundle and the labium toward the head)
      if(suck>0){ const up=cl((lt-2.9)/0.9); const k0=Math.floor(m*(1-up)); g.strokeStyle='#e0202c'; g.lineWidth=3.4; g.beginPath(); for(let i=m;i>=k0;i--){ const p=pts[i]; i===m?g.moveTo(p[0],p[1]):g.lineTo(p[0],p[1]); } g.stroke();
        const lab2=cl((lt-3.7)/0.6); if(lab2>0){ g.strokeStyle='rgba(220,30,40,.85)'; g.lineWidth=5; g.beginPath(); const N2=Math.floor(30*lab2); for(let i=0;i<=N2;i++){ const p=qp(1-i/30); i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]); } g.stroke(); }
        for(let j=0;j<6;j++){ const ph=((lt*1.4+j/6)%1); const idx=Math.floor(m*(1-ph)); if(idx<k0) continue; const p=pts[idx]; g.fillStyle=`rgba(255,120,120,${0.9*suck})`; g.beginPath(); g.arc(p[0],p[1],3.4,0,7); g.fill(); }
        const pg=g.createRadialGradient(tp[0],tp[1],0,tp[0],tp[1],60); pg.addColorStop(0,`rgba(255,60,60,${0.35*suck})`); pg.addColorStop(1,'rgba(255,60,60,0)'); g.fillStyle=pg; g.beginPath(); g.arc(tp[0],tp[1],60,0,7); g.fill(); }
    }
    g.restore();
    const vv=g.createRadialGradient(540,880,300,540,880,1100); vv.addColorStop(0,'rgba(0,0,0,0)'); vv.addColorStop(1,'rgba(0,0,0,.55)'); g.fillStyle=vv; g.fillRect(0,0,W,H);
    // labels: dot at the thing it names (screen coords after the zoom transform), boxes kept left of x 1010
    const sc=(p)=>[TX+z*(p[0]+DX-TX), SY+150+z*(p[1]-SY-150)]; const E2=sc(entry), T2=sc(tp);
    fixLab('l1_0',Math.min(600,E2[0]+26),E2[1]+46,win(lt,1.15,2.9)); fixLab('l1_1',Math.min(610,T2[0]+26),T2[1]-6,win(lt,1.75,2.75)); fixLab('l1_2',Math.min(640,T2[0]+26),T2[1]+10,win(lt,3.1,9));
    caption(1,lt); };
})();

// ---------- S2 /x-ray the human spine: a faint x-ray torso; a scan line sweeps down and reveals the column: 7 neck (cervical), 12 mid-back
// (thoracic, with rib stubs), 5 lower-back (lumbar) vertebrae, discs between them, then the fused sacrum (5) and tailbone (4) = 33 bones
// (Cleveland Clinic). The column turns from the front to the side so its natural S-curve shows.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); bgGrad(sc,'#0e2236','#020509'); ren.localClippingEnabled=true; ren.toneMappingExposure=0.8;
  const cam=new THREE.PerspectiveCamera(24,1080/1920,0.1,100); const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.55});
  const scanP=new THREE.Plane(new THREE.Vector3(0,1,0),9);
  const SP=new THREE.Group(); sc.add(SP);
  const BONE=0x9fd4ff, DISC=0x5ff0ff;
  // S-curve in the side view (z): neck forward, mid-back back, lower back forward
  const Y0=2.05, Y1=-2.15; const zc=(y)=>{ const u=(Y0-y)/(Y0-Y1); return 0.16*Math.sin(u*Math.PI*2.3+0.25)-0.05; };
  const verts=[]; let y=Y0; const spec=[];
  for(let i=0;i<7;i++) spec.push(['C',0.15,0.085]); for(let i=0;i<12;i++) spec.push(['T',0.19+i*0.006,0.1+i*0.002]); for(let i=0;i<5;i++) spec.push(['L',0.27,0.13]);
  const mats=[]; const mk=(c)=>{ const m=xrayMat(c,[scanP]); mats.push(m); return m; }; const regionMat={C:mk(BONE),T:mk(BONE),L:mk(BONE),S:mk(BONE)}; const discM=mk(DISC);
  const anchors={};
  spec.forEach(([rg,w,h],i)=>{ const v=new THREE.Group(); const z=zc(y-h/2);
    const body=new THREE.Mesh(new THREE.CylinderGeometry(w,w*1.04,h,28,1),regionMat[rg]); body.scale.z=0.78; v.add(body);
    // arch + spinous + transverse processes (behind = -z)
    const arch=new THREE.Mesh(new THREE.TorusGeometry(w*0.62,w*0.16,8,20,Math.PI),regionMat[rg]); arch.rotation.x=Math.PI/2; arch.rotation.z=Math.PI; arch.position.z=-w*0.75; v.add(arch);
    const spn=new THREE.Mesh(new THREE.ConeGeometry(w*0.16,w*1.5,8),regionMat[rg]); spn.rotation.x=-Math.PI/2-(rg==='T'?0.6:0.2); spn.position.set(0,-h*0.2,-w*1.95); v.add(spn);
    [-1,1].forEach(s=>{ const tp=new THREE.Mesh(new THREE.CylinderGeometry(w*0.1,w*0.14,w*1.1,8),regionMat[rg]); tp.rotation.z=Math.PI/2; tp.position.set(s*w*1.0,0,-w*0.95); v.add(tp);
      if(false){ const rib=new THREE.Mesh(new THREE.TorusGeometry(0.62+i*0.012,0.018,6,40,Math.PI*0.62),regionMat[rg]); rib.rotation.x=Math.PI/2; rib.rotation.z=s>0?-0.15:Math.PI+0.15; rib.position.set(s*(w*1.3+0.0),-0.04,-w*0.9+0.0); rib.scale.set(1,0.75,1); rib.position.x+=s*0.0; rib.translateX(-0.0); v.add(rib); } });
    v.position.set(0,y-h/2,z); v.rotation.x=-(zc(y-h/2+0.05)-zc(y-h/2-0.05))/0.1*0.8; SP.add(v); verts.push(v);
    y-=h; const dh=rg==='C'?0.028:rg==='T'?0.035:0.055; const d=new THREE.Mesh(new THREE.CylinderGeometry(w*0.96,w*0.96,dh,24),discM); d.scale.z=0.76; d.position.set(0,y-dh/2,zc(y-dh/2)); if(i<23) SP.add(d); y-=dh;
    if(i===3) anchors.C=v; if(i===12) anchors.T=v; if(i===21) anchors.L=v; });
  // sacrum (5 fused) + coccyx (4 fused)
  const sac=new THREE.Mesh(deform(new THREE.ConeGeometry(0.32,0.62,24,6),v=>new THREE.Vector3(v.x,v.y,v.z*0.5-0.08*(v.y+0.3)*(v.y+0.3))),regionMat.S); sac.rotation.x=Math.PI; sac.rotation.x+=0.35; sac.position.set(0,y-0.3,zc(y)-0.06); SP.add(sac);
  const coc=[]; for(let k=0;k<4;k++){ const c=new THREE.Mesh(new THREE.SphereGeometry(0.06-k*0.01,14,10),regionMat.S); c.position.set(0,y-0.66-k*0.085,zc(y)-0.22-k*0.03); SP.add(c); coc.push(c); }
  // ghost torso + pelvis outline (very faint)
  const torsoM=xrayMat(0x3a6a9a,[]); torsoM.uniforms.op.value=0.16; const torso=new THREE.Mesh(new THREE.CapsuleGeometry?new THREE.CapsuleGeometry(0.95,2.6,8,24):new THREE.CylinderGeometry(0.95,0.95,3.8,24),torsoM); torso.scale.z=0.6; torso.position.set(0,-0.2,-0.2); sc.add(torso);
  const skullM=xrayMat(0x6aa6d6,[scanP]); const skull=new THREE.Mesh(new THREE.SphereGeometry(0.55,40,30),skullM); skull.scale.set(0.82,1,0.95); skull.position.set(0,Y0+0.62,0.12); /* no skull */
  const pel=new THREE.Mesh(new THREE.TorusGeometry(0.62,0.07,10,40),regionMat.S); pel.scale.set(1,0.55,1); pel.rotation.x=1.2; pel.position.set(0,y-0.25,zc(y)+0.05); /* no pelvis */ const aS=new THREE.Object3D(); aS.position.set(-0.12,0,0); sac.add(aS);
  const scan=new THREE.Mesh(new THREE.PlaneGeometry(3.4,0.012),glowMat(0xcff4ff,0)); sc.add(scan); const scanG=new THREE.Mesh(new THREE.PlaneGeometry(3.4,0.35),new THREE.MeshBasicMaterial({map:canvasTex(16,64,(c,w,h)=>{ const gg=c.createLinearGradient(0,0,0,h); gg.addColorStop(0,'rgba(120,200,255,0)'); gg.addColorStop(.5,'rgba(120,200,255,.5)'); gg.addColorStop(1,'rgba(120,200,255,0)'); c.fillStyle=gg; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,opacity:0})); sc.add(scanG);
  const aC=new THREE.Object3D(); aC.position.set(0.12,0,0); anchors.C.add(aC); const aT=new THREE.Object3D(); aT.position.set(-0.18,0,0); anchors.T.add(aT); const aL=new THREE.Object3D(); aL.position.set(0.25,0,0); anchors.L.add(aL);
  SCN[2]=function(lt){ const s=Y0+1.3-(Y0-Y1+2.3)*easeIO(cl((lt-0.15)/1.6)); scanP.constant=-s+0.0; scanP.normal.set(0,1,0); scanP.constant=-s; // keep y>s
    scan.position.y=s; scanG.position.y=s; const sv=cl((lt-0.1)/0.15)*(1-cl((lt-1.75)/0.2)); scan.material.opacity=sv; scanG.material.opacity=0.8*sv;
    const rot=easeIO(cl((lt-1.7)/2.6)); SP.rotation.y=0.12*Math.sin(lt*0.7)*(1-rot)+rot*(Math.PI/2-0.25); torso.rotation.y=SP.rotation.y;
    // region highlight as each label comes in
    const hi=(t0)=>0.6+0.9*Math.exp(-Math.pow((lt-t0-0.3)/0.35,2));
    regionMat.C.uniforms.op.value=hi(1.2); regionMat.T.uniforms.op.value=hi(1.55); regionMat.L.uniforms.op.value=hi(1.8); regionMat.S.uniforms.op.value=hi(2.1); discM.uniforms.op.value=0.8+0.2*Math.sin(lt*3);
    const pz=easeIO(cl(lt/5)); cam.position.set(1.1-0.8*pz,0.1,21.8-0.6*pz); cam.lookAt(0,-0.24,0); P.c.render();
    const lv=(t0)=>cl((lt-t0)/0.2);
    layout2(labs(2,[[0,aC,lv(1.2)],[1,aT,lv(1.5)],[2,aL,lv(1.8)],[3,aS,lv(2.1)],[4,coc[1],lv(2.4)]]).map((x,i)=>x.concat([['R','L','R','L','R'][i],[660,420,660,420,660][i]])),cam,140,520,1520);
    caption(2,lt-0.3); };
})();

{ const _a=SCN[0], _b=SCN[1]; SCN[0]=(lt)=>_a(lt*1.25); SCN[1]=(lt)=>_b(lt*1.2); }
