// helpers copied from earth39 (build.py JS + scenes.js shared part)
function mkRenderer(id){ const r=new THREE.WebGLRenderer({canvas:document.getElementById(id),antialias:true,alpha:true,preserveDrawingBuffer:true});
  r.setPixelRatio(1); r.setSize(1080,1920,false); r.outputEncoding=THREE.sRGBEncoding; r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=1.05; return r; }
function studioEnv(renderer){ const s=new THREE.Scene(); const g=new THREE.BoxGeometry(1,1,1);
  const room=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0x2a2c30,side:THREE.BackSide})); room.scale.set(20,14,20); s.add(room);
  const L=(x,y,z,sx,sy,c)=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:c})); m.position.set(x,y,z); m.scale.set(sx,sy,1); m.lookAt(0,0,0); s.add(m); };
  L(0,6.5,0,12,4,0xffffff); L(-9,2,2,3,8,0xdfe7ff); L(9,1,-3,3,6,0xfff1e0); L(0,1,-9.5,10,1.2,0x9fb4ff); L(4,-2,9,6,1,0xffffff);
  const pm=new THREE.PMREMGenerator(renderer); return pm.fromScene(s,0.03).texture; }
function rbox(w,h,d,r,seg){ const sh=new THREE.Shape(); const x=-w/2,y=-h/2; r=Math.min(r,w/2,h/2);
  sh.moveTo(x+r,y); sh.lineTo(x+w-r,y); sh.quadraticCurveTo(x+w,y,x+w,y+r); sh.lineTo(x+w,y+h-r); sh.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  sh.lineTo(x+r,y+h); sh.quadraticCurveTo(x,y+h,x,y+h-r); sh.lineTo(x,y+r); sh.quadraticCurveTo(x,y,x+r,y);
  const bv=Math.min(d*0.35,0.02); const g=new THREE.ExtrudeGeometry(sh,{depth:Math.max(0.001,d-2*bv),bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:seg||4,curveSegments:10});
  g.translate(0,0,-(d-2*bv)/2); g.computeVertexNormals(); return g; }
function rframe(w,h,d,r,t){ const mk=(w,h,r)=>{ const sh=new THREE.Shape(); const x=-w/2,y=-h/2; sh.moveTo(x+r,y); sh.lineTo(x+w-r,y); sh.quadraticCurveTo(x+w,y,x+w,y+r);
   sh.lineTo(x+w,y+h-r); sh.quadraticCurveTo(x+w,y+h,x+w-r,y+h); sh.lineTo(x+r,y+h); sh.quadraticCurveTo(x,y+h,x,y+h-r); sh.lineTo(x,y+r); sh.quadraticCurveTo(x,y,x+r,y); return sh; };
  const o=mk(w,h,r); const i=mk(w-2*t,h-2*t,Math.max(0.01,r-t)); o.holes.push(new THREE.Path(i.getPoints(40).reverse()));
  const g=new THREE.ExtrudeGeometry(o,{depth:d,bevelEnabled:true,bevelThickness:0.008,bevelSize:0.008,bevelSegments:3,curveSegments:12}); g.translate(0,0,-d/2); return g; }
function canvasTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }
function shadowPlane(sx,sy,op){ const t=canvasTex(256,256,(g,w,h)=>{ const gr=g.createRadialGradient(128,128,10,128,128,128); gr.addColorStop(0,'rgba(0,0,0,'+op+')'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  const m=new THREE.Mesh(new THREE.PlaneGeometry(sx,sy),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false})); m.rotation.x=-Math.PI/2; return m; }
const ease=(x)=>x<0?0:x>1?1:1-Math.pow(1-x,3), easeIO=(x)=>x<0?0:x>1?1:x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, cl=(x)=>x<0?0:x>1?1:x;
const V=new THREE.Vector3();
function placeLabel(el,obj,cam,offx,offy,alpha){ obj.getWorldPosition(V); V.project(cam); const x=(V.x*.5+.5)*1080+(offx||0), y=(-V.y*.5+.5)*1920+(offy||0);
  el.style.left=x+'px'; el.style.top=y+'px'; el.style.opacity=alpha; }
function layoutLabels(items,cam,colX,minGap,side){ // items: [el,obj,alpha,ox,oy]
  const pts=items.map(([el,obj,a,ox,oy])=>{ const o=new THREE.Object3D(); obj.add(o); o.position.set(ox||0,oy||0,0); o.getWorldPosition(V); obj.remove(o); V.project(cam);
    return {el,a,x:(V.x*.5+.5)*1080,y:(-V.y*.5+.5)*1920}; });
  const ord=pts.slice().sort((p,q)=>p.y-q.y); let last=470-minGap; ord.forEach(p=>{ p.ly=Math.max(p.y,last+minGap); last=p.ly; });
  pts.forEach(p=>{ const lx=colX; p.el.style.left=lx+'px'; p.el.style.top=p.ly+'px'; p.el.style.opacity=p.a;
    const ld=p.el.querySelector('.ld'); const dx=p.x-lx, dy=p.y-(p.ly)+0; const len=Math.hypot(dx,dy);
    ld.style.width=len+'px'; ld.style.left='0px'; ld.style.transform='rotate('+Math.atan2(dy,dx)+'rad)'; ld.style.transformOrigin='0 50%'; }); }

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

function earthTex(){ return canvasTex(1024,512,(c,w,h)=>{ c.fillStyle='#1d4fa8'; c.fillRect(0,0,w,h); const r=rnd(3);
    for(let i=0;i<22;i++){ c.fillStyle=i%3?'#3f8a4a':'#b59a62'; c.beginPath(); const x=r()*w,y=h*.2+r()*h*.6; for(let k=0;k<14;k++){ const a=k/14*Math.PI*2, rr=30+r()*70; c.lineTo(x+Math.cos(a)*rr*1.4,y+Math.sin(a)*rr*.8); } c.fill(); }
    for(let i=0;i<60;i++){ c.fillStyle='rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(r()*w,r()*h,40+r()*90,8+r()*14,r()*.5,0,Math.PI*2); c.fill(); } }); }
function starField(sc,n,seed,r){ const R=rnd(seed), sp=[]; for(let i=0;i<n;i++){ const v=new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(r||300); sp.push(v.x,v.y,v.z); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); sc.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.2,sizeAttenuation:false,toneMapped:false}))); }
// sprite with live text (re-drawn only when the text changes)
function backOut(x){ x=cl(x); const c1=1.9, c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); }
function diskTex(){ return canvasTex(1024,64,(c,w,h)=>{ const g=c.createLinearGradient(0,0,w,0); g.addColorStop(0,'rgba(255,255,240,1)'); g.addColorStop(.12,'rgba(255,200,120,1)'); g.addColorStop(.45,'rgba(255,110,40,.85)'); g.addColorStop(1,'rgba(120,30,10,0)'); c.fillStyle=g; c.fillRect(0,0,w,h);
  const r=rnd(8); for(let i=0;i<220;i++){ c.fillStyle=`rgba(255,${180+r()*60|0},${120+r()*80|0},${.15+r()*.3})`; c.fillRect(r()*w,0,2+r()*14,h); } }); }
function ringMesh(r0,r1,tex,op){ const g=new THREE.RingGeometry(r0,r1,160,1); const p=g.attributes.position, uv=g.attributes.uv, v=new THREE.Vector3();
  for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); uv.setXY(i,(v.length()-r0)/(r1-r0),0.5); }
  return new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:op??1,side:THREE.DoubleSide,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false})); }
function astronaut(){ const g=new THREE.Group(); const suit=new THREE.MeshStandardMaterial({color:0xf2f2f2,roughness:.5,emissive:0xff3a10,emissiveIntensity:0});
  const body=new THREE.Mesh(new THREE.CapsuleGeometry?new THREE.CapsuleGeometry(0.16,0.32,6,12):new THREE.CylinderGeometry(0.16,0.16,0.6,16),suit); g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.15,20,14),suit); head.position.y=0.42; g.add(head);
  const visor=new THREE.Mesh(new THREE.SphereGeometry(0.11,20,14,0,Math.PI),new THREE.MeshPhysicalMaterial({color:0xffb14a,metalness:1,roughness:.1})); visor.position.set(0,0.43,0.07); g.add(visor);
  [[-0.24,0.05,0.5],[0.24,0.05,-0.5]].forEach(([x,y,r])=>{ const a=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,0.38,10),suit); a.position.set(x,y,0); a.rotation.z=r; g.add(a); });
  [[-0.09,-0.45],[0.09,-0.45]].forEach(([x,y])=>{ const l=new THREE.Mesh(new THREE.CylinderGeometry(0.065,0.065,0.42,10),suit); l.position.set(x,y,0); g.add(l); });
  const pack=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.34,0.12),suit); pack.position.set(0,0.06,-0.17); g.add(pack); g.userData.suit=suit; return g; }

function fixLab(id,x,y,a){ const el=document.getElementById(id); if(!el) return; el.style.left=x+'px'; el.style.top=y+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld) ld.style.width='0px'; }


function rr(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }

function vnoise(seed){ const r=rnd(seed); const P=[]; for(let i=0;i<512;i++) P.push(r()); return (x,y)=>{ const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi; const h=(a,b)=>P[(((a*73856093)^(b*19349663))>>>0)%512];
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return h(xi,yi)*(1-u)*(1-v)+h(xi+1,yi)*u*(1-v)+h(xi,yi+1)*(1-u)*v+h(xi+1,yi+1)*u*v; }; }
function fbm(n,x,y,o){ let s=0,a=0.5,f=1; for(let i=0;i<(o||5);i++){ s+=a*n(x*f,y*f); f*=2; a*=0.5; } return s; }
let _E=null;
function realEarth(){ if(_E) return _E; const W=2048,H=1024; const n=vnoise(21), n2=vnoise(77);
  const day=document.createElement('canvas'); day.width=W; day.height=H; const dg=day.getContext('2d'); const di=dg.createImageData(W,H);
  const night=document.createElement('canvas'); night.width=W; night.height=H; const ng=night.getContext('2d'); const ni=ng.createImageData(W,H);
  const cl2=document.createElement('canvas'); cl2.width=W; cl2.height=H; const cg=cl2.getContext('2d'); const ci=cg.createImageData(W,H);
  for(let y=0;y<H;y++){ const lat=Math.abs(y/H-0.5)*2; for(let x=0;x<W;x++){ const i=(y*W+x)*4; const u=x/W*8, v=y/H*4;
    const e=fbm(n,u+fbm(n2,u,v,3)*1.5,v,8); const land=e>0.53; const ice=lat>0.86||(lat>0.78&&e>0.5);
    let r,g,b; if(ice){ r=235;g=240;b=245; } else if(land){ const k=Math.min(1,(e-0.53)*4); const dry=Math.min(1,Math.max(0,(fbm(n2,u*2,v*2,3)-0.35)*2.2)); const m=dry*dry; r=34+(150-34)*m+40*k; g=62+(126-62)*m+25*k; b=30+(86-30)*m+20*k; if(lat<0.3&&dry>0.75){ r=176;g=146;b=100; } }
    else { const d=Math.min(1,(0.53-e)*5); r=14+20*(1-d); g=50+40*(1-d); b=110+50*(1-d); }
    di.data[i]=r; di.data[i+1]=g; di.data[i+2]=b; di.data[i+3]=255;
    const lights=land&&!ice&&fbm(n2,u*6,v*6,3)>0.55?Math.min(1,(fbm(n2,u*12,v*12,2)-0.4)*3):0; ni.data[i]=255*lights; ni.data[i+1]=190*lights; ni.data[i+2]=110*lights; ni.data[i+3]=255;
    const c=fbm(n,u*1.7+9,v*2.2+3,5); const ca=Math.max(0,(c-0.52)*3.2); ci.data[i]=255; ci.data[i+1]=255; ci.data[i+2]=255; ci.data[i+3]=Math.min(255,ca*255); } }
  dg.putImageData(di,0,0); ng.putImageData(ni,0,0); cg.putImageData(ci,0,0);
  const mk=(c)=>{ const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=8; return t; };
  _E={day:mk(day),night:mk(night),clouds:mk(cl2)}; return _E; }
function smooth(e0,e1,x){ const t=cl((x-e0)/(e1-e0)); return t*t*(3-2*t); }
function proj(v,cam){ V.copy(v).project(cam); return [(V.x*.5+.5)*1080,(-V.y*.5+.5)*1920]; }
function lab(id,x,y,a,side){ const el=document.getElementById(id); if(!el) return; const w=el.offsetWidth||300; let lx=side<0?x-w-40:x+40; lx=Math.max(70,Math.min(1010-w,lx));
  a*=cl((y-520)/60); y=Math.max(560,Math.min(1110,y)); el.style.left=lx+'px'; el.style.top=y+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld){ const dx=x-lx, dy=0; ld.style.width='0px'; } }
const win=(lt,a,b,f)=>cl((lt-a)/(f||0.25))*(1-cl((lt-b)/(f||0.25)));


let _RE=null;
function earthReal(){ if(_RE) return _RE; const DT=(b64,w,h,fmt,srgb)=>{ const t=new THREE.DataTexture(new Uint8Array(b64buf(b64)),w,h,fmt); t.encoding=srgb?THREE.sRGBEncoding:THREE.LinearEncoding;
    t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter; t.generateMipmaps=true; t.anisotropy=8; t.needsUpdate=true; return t; };
  _RE={day:DT(window.EARTH_DAY,2048,1024,THREE.RGBAFormat,true), clouds:DT(window.EARTH_CL,2048,1024,THREE.LuminanceFormat,false), night:DT(window.EARTH_NL,1024,512,THREE.LuminanceFormat,false)}; return _RE; }
const lerp=(a,b,t)=>a+(b-a)*t;
const GLN=`float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
vec2 h22(vec2 p){ return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y); }
float fbm(vec2 p){ float s=0.,a=.5; for(int i=0;i<5;i++){ s+=a*vn(p); p=p*2.03+vec2(17.1,9.3); a*=.5; } return s; }
`;
function fullQuad(sc,frag,uni){ const m=new THREE.ShaderMaterial({uniforms:uni,depthWrite:false,depthTest:false,
    vertexShader:'void main(){ gl_Position=vec4(position.xy,0.,1.); }',fragmentShader:GLN+frag});
  const q=new THREE.Mesh(new THREE.PlaneGeometry(2,2),m); q.frustumCulled=false; q.renderOrder=-10; sc.add(q); return m; }

// ---------- S0 /explain-3d how a neutron star spins: a ~12 km, 1.4-solar-mass star; dipole field lines tilted against the spin axis and two
// radio beams from the magnetic poles sweeping like a lighthouse. Real spin up to ~716/s (PSR J1748-2446ad); shown slowed down.

// ================= orbit35 scenes (Claude Opus 5.5, drawn in code) =================
function labAt(id,v,cam,dx,dy,a,side){ const el=document.getElementById(id); if(!el) return; const [x,y]=proj(v,cam); const w=el.offsetWidth||320;
  let lx=side<0?x-w-dx:x+dx; lx=Math.max(70,Math.min(1010-w,lx)); const ly=Math.max(500,Math.min(1140,y+dy));
  el.style.left=lx+'px'; el.style.top=ly+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld) ld.style.width='0px'; }
function softDot(){ return canvasTex(128,128,(c,w,h)=>{ const g=c.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.45,'rgba(255,255,255,.45)'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }); }
function puffTex(seed){ return canvasTex(256,256,(c,w,h)=>{ const r=rnd(seed); for(let i=0;i<26;i++){ const x=64+r()*128,y=64+r()*128,rr=30+r()*60; const g=c.createRadialGradient(x,y,0,x,y,rr); g.addColorStop(0,'rgba(255,255,255,'+(.10+r()*.12)+')'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); } }); }
// a points cloud whose per-particle state is computed on the CPU each frame
function cloudPoints(n,tex,size,blend){ const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(n*3),3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(n*3),3)); g.setAttribute('sz',new THREE.Float32BufferAttribute(new Float32Array(n),1)); g.setAttribute('al',new THREE.Float32BufferAttribute(new Float32Array(n),1));
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:blend||THREE.NormalBlending,toneMapped:false,uniforms:{map:{value:tex},uSz:{value:size}},
    vertexShader:'attribute float sz; attribute float al; varying vec3 vC; varying float vA; uniform float uSz; void main(){ vC=color; vA=al; vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=uSz*sz/(-mv.z); gl_Position=projectionMatrix*mv; }',
    fragmentShader:'uniform sampler2D map; varying vec3 vC; varying float vA; void main(){ vec4 t=texture2D(map,gl_PointCoord); gl_FragColor=vec4(vC,t.a*vA); }',vertexColors:true});
  const p=new THREE.Points(g,m); p.frustumCulled=false; return p; }


// ================= world34 scenes (Claude Opus 5.5, drawn in code) =================
function sunSprite(c1,c2,c3){ return canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,0,128,128,128); g.addColorStop(0,c1); g.addColorStop(.12,c1); g.addColorStop(.3,c2); g.addColorStop(.6,c3); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }); }
function setLab(id,x,y,a,title,sub){ const el=document.getElementById(id); if(!el) return; if(title!==undefined){ const b=el.querySelector('b'), s=el.querySelector('span'); if(b&&b.textContent!==title) b.textContent=title; if(s&&sub!==undefined&&s.textContent!==sub) s.textContent=sub; }
  const w=el.offsetWidth||300; x=Math.max(70,Math.min(1010-w,x)); y=Math.max(480,Math.min(1120,y)); el.style.left=x+'px'; el.style.top=y+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld) ld.style.width='0px'; }
const EARTH_VS='varying vec2 vU; varying vec3 vN; varying vec3 vW; void main(){ vU=uv; vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }';

function llVec(lat,lon,r){ const u=(lon+180)/360, v=(lat+90)/180, ph=u*Math.PI*2, th=(1-v)*Math.PI; return new THREE.Vector3(-r*Math.cos(ph)*Math.sin(th),r*Math.cos(th),r*Math.sin(ph)*Math.sin(th)); }
const nf39=new Intl.NumberFormat('en-US');

