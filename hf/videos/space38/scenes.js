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

// ================= space38 scenes (Claude Opus 5.5, drawn in code) =================
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


// ---------- S0 /explain-3d a black hole eating a star (tidal disruption event, NASA SVS 13237): a Sun-like star falls toward a black hole,
// tides stretch it ("spaghettification") into a long stream that wraps around the hole; part of the debris forms a hot glowing disk.
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020306); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.05,400); const P=mkComposer(ren,sc,cam,{bloom:0.8,radius:0.6,th:0.6});
  starField(sc,1600,17,300);
  const BH=new THREE.Vector3(0,0,0), RH=0.32;
  const hole=new THREE.Mesh(new THREE.SphereGeometry(RH,64,48),new THREE.MeshBasicMaterial({color:0x000000})); sc.add(hole);
  // accretion disk (fed by the stream)
  const DU={uT:{value:0},uFeed:{value:0}};
  const dg=new THREE.RingGeometry(RH*1.35,RH*5.2,256,8); dg.rotateX(-Math.PI/2);
  const disk=new THREE.Mesh(dg,new THREE.ShaderMaterial({uniforms:DU,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,blending:THREE.AdditiveBlending,
    vertexShader:'varying vec3 vW; void main(){ vW=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform float uT,uFeed; varying vec3 vW;
      void main(){ float r=length(vW.xz)/${(0.32).toFixed(2)}; float a=atan(vW.z,vW.x);
        float sw=a+uT*3.0/pow(r,1.5)+r*1.4; float n=fbm(vec2(sw*2.0,r*3.0))*0.7+fbm(vec2(sw*6.,r*9.))*0.3;
        float inner=smoothstep(1.35,1.7,r), outer=1.-smoothstep(2.6,5.2,r);
        float dop=0.65+0.55*sin(a+0.6); // brighter on the approaching side
        float front=smoothstep(5.4,1.4,r+ (1.-uFeed)*6.); 
        float I=inner*outer*(0.35+0.9*n)*dop*front*uFeed;
        vec3 c=mix(vec3(1.0,0.32,0.08),vec3(1.4,1.05,0.75),smoothstep(3.2,1.5,r));
        gl_FragColor=vec4(c*I*1.6,1.); }`})); sc.add(disk);
  // photon ring
  const pr=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,0,128,128,128); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(.42,'rgba(0,0,0,0)'); g.addColorStop(.47,'rgba(255,220,170,1)'); g.addColorStop(.52,'rgba(255,140,60,.45)'); g.addColorStop(.75,'rgba(255,90,20,.08)'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
  pr.scale.set(RH*4.6,RH*4.6,1); sc.add(pr);
  // the star
  const SU={uT:{value:0}};
  const star=new THREE.Mesh(new THREE.SphereGeometry(0.42,96,64),new THREE.ShaderMaterial({uniforms:SU,toneMapped:false,transparent:true,
    vertexShader:'varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform float uT; varying vec3 vN; varying vec3 vP;
      void main(){ float mu=max(dot(vN,vec3(0,0,1)),0.); vec2 sp=vec2(atan(vP.z,vP.x)*2.,vP.y*3.);
        float g=fbm(sp*8.+vec2(uT*0.1,0.))*0.6+fbm(sp*24.-uT*0.1)*0.4; float I=(0.6+0.5*g)*(0.4+0.6*pow(mu,0.5));
        vec3 c=mix(vec3(1.,0.55,0.15),vec3(1.3,1.05,0.8),cl2(I)); gl_FragColor=vec4(c*I*1.2,1.); }
      `.replace('cl2(I)','clamp((I-0.5)*1.6,0.,1.)')}));
  sc.add(star);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:softDot(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,color:0xffb060})); sc.add(halo);
  // orbit of the stream: an inward spiral in the disk plane, slightly tilted
  const S0=new THREE.Vector3(-2.4,0.2,-1.2);
  function path(s){ // s in 0..1 along the infall, then wraps
    const a0=Math.atan2(S0.z,S0.x), r0=Math.hypot(S0.x,S0.z); const a=a0-s*Math.PI*2.6; const r=RH*1.6+(r0-RH*1.6)*Math.pow(Math.max(0,1-s),1.6);
    return [Math.cos(a)*r, S0.y*Math.max(0,1-s*1.4)+0.04*Math.sin(s*9.), Math.sin(a)*r]; }
  const NP=3200, cloud=cloudPoints(NP,softDot(),240,THREE.AdditiveBlending); sc.add(cloud); const R=rnd(13), PA=[];
  for(let i=0;i<NP;i++){ PA.push({u:R(),j:[(R()-.5),(R()-.5),(R()-.5)],s:0.4+R()*1.1,h:R()}); }
  const pos=cloud.geometry.attributes.position.array, col=cloud.geometry.attributes.color.array, sz=cloud.geometry.attributes.sz.array, al=cloud.geometry.attributes.al.array;
  const pStar=new THREE.Object3D(); sc.add(pStar); const pDisk=new THREE.Object3D(); pDisk.position.set(RH*3.4,0,RH*1.2); sc.add(pDisk);
  SCN[0]=function(lt){ SU.uT.value=lt; DU.uT.value=lt;
    // star falls in along the path head, then is torn into a stream
    const head=0.32*easeIO(cl(lt/1.3))+0.55*cl((lt-1.3)/2.4); const tear=smooth(0.7,1.7,lt);
    const hp=path(head*0.55); star.position.set(hp[0],hp[1],hp[2]);
    const toBH=star.position.clone().negate().normalize(); star.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),toBH);
    star.scale.set(1+2.2*tear,1-0.45*tear,1-0.45*tear); star.material.opacity=1-smooth(1.0,1.8,lt); star.visible=lt<1.85;
    halo.position.copy(star.position); halo.scale.setScalar(1.6*(1-0.6*tear)); halo.material.opacity=0.5*(1-smooth(1.1,1.9,lt));
    pStar.position.copy(star.position);
    for(let i=0;i<NP;i++){ const o=PA[i]; const spread=tear*(0.15+1.15*cl((lt-0.9)/2.4));
      let s=head*0.55+(o.u-0.5)*0.12*(1-tear)+(o.u-0.35)*spread; s=Math.max(0,s);
      const p=path(Math.min(s,1.0)); let x=p[0],y=p[1],z=p[2];
      if(s>1.0){ const k=s-1.0; const a=Math.atan2(z,x)-k*7.0, r=RH*(1.6+2.6*o.h); x=Math.cos(a)*r; z=Math.sin(a)*r; y*=0.3; }
      const w=0.05*(1-tear)+0.03*tear; x+=o.j[0]*w*(1+3*(1-tear)); y+=o.j[1]*w*0.8; z+=o.j[2]*w*(1+3*(1-tear));
      pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
      const hot=cl(s); col[i*3]=1.0; col[i*3+1]=0.55+0.35*(1-hot)*o.h+0.2*hot; col[i*3+2]=0.18+0.4*hot*o.h;
      sz[i]=o.s*(0.7+0.5*hot); al[i]=smooth(0.6,1.1,lt)*0.3; }
    ['position','color','sz','al'].forEach(k=>cloud.geometry.attributes[k].needsUpdate=true);
    DU.uFeed.value=0.15+0.85*smooth(1.5,3.4,lt);
    const u=easeIO(cl(lt/4.2)); cam.position.set(-0.8+0.8*u,3.9-0.9*u,9.6-2.6*u); cam.lookAt(-0.6+0.6*u,-0.75+0.35*u,-0.3+0.3*u);
    pr.position.set(0,0,0); P.c.render();
    fixLab('l0_0',640,1080,win(lt,0.3,9)); fixLab('l0_1',90,560,win(lt,1.2,9)); fixLab('l0_2',600,640,win(lt,2.3,9));
    caption(0,lt); };
})();

// ---------- S1 /x-ray Venus under its acid clouds: the pale sulfuric-acid cloud deck, an x-ray scan sweeps down and the clouds above the
// line turn see-through, revealing the dark volcanic surface glowing with lava under a hot orange haze (NASA: ~475 °C, ~90x Earth's pressure).
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020307); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.05,400); const P=mkComposer(ren,sc,cam,{bloom:0.45,radius:0.5,th:0.85});
  starField(sc,1200,47,300);
  const U={uT:{value:0},uS:{value:1.2},uX:{value:0},uSun:{value:new THREE.Vector3(-0.7,0.35,0.6).normalize()}};
  const surf=new THREE.Mesh(new THREE.SphereGeometry(0.985,160,120),new THREE.ShaderMaterial({uniforms:U,toneMapped:false,
    vertexShader:'varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform float uT; varying vec3 vN; varying vec3 vP;
      void main(){ vec2 q=vec2(atan(vP.z,vP.x)*2.2,vP.y*3.); float mu=max(dot(vN,vec3(0,0,1)),0.);
        float h=fbm(q*3.)*0.6+fbm(q*11.)*0.4; vec3 rock=mix(vec3(0.07,0.045,0.035),vec3(0.26,0.15,0.09),h);
        float lava=smoothstep(0.035,0.0,abs(fbm(q*4.5+2.)-0.5))*0.9 + smoothstep(0.72,0.8,fbm(q*2.2+7.))*0.8;
        float pulse=0.8+0.2*sin(uT*2.+h*12.);
        vec3 c=rock*(0.35+0.65*pow(mu,0.6)) + vec3(2.2,0.7,0.12)*lava*pulse;
        c+=vec3(1.0,0.45,0.12)*pow(1.-mu,2.)*0.55; gl_FragColor=vec4(c,1.); }`})); sc.add(surf);
  const clouds=new THREE.Mesh(new THREE.SphereGeometry(1.0,160,120),new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,toneMapped:false,
    vertexShader:'varying vec3 vN; varying vec3 vP; varying vec3 vW; void main(){ vN=normalize(normalMatrix*normal); vP=position; vW=normalize((modelMatrix*vec4(normal,0.)).xyz); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform float uT,uS,uX; uniform vec3 uSun; varying vec3 vN; varying vec3 vP; varying vec3 vW;
      void main(){ float lon=atan(vP.z,vP.x), lat=vP.y; float mu=max(dot(vN,vec3(0,0,1)),0.);
        float w=fbm(vec2(lon*2.+uT*0.06,lat*5.))*1.4; float v=fbm(vec2(lon*3.+w+lat*2.5,lat*7.+w*0.5));
        vec3 c=mix(vec3(0.78,0.66,0.44),vec3(0.98,0.93,0.78),v)*(0.92+0.15*fbm(vec2(lon*14.,lat*30.)));
        float l=clamp(dot(vW,uSun),0.,1.); c*=0.08+1.0*pow(l,0.7);
        float above=smoothstep(uS-0.04,uS+0.04,vP.y);
        float a=1.-above*uX*(0.97-0.35*pow(1.-mu,2.));
        float sl=exp(-pow((vP.y-uS)*30.,2.))*uX; c+=vec3(1.,0.6,0.25)*sl*0.9;
        c=mix(c,vec3(1.0,0.45,0.12)*0.5,above*uX*0.6);
        gl_FragColor=vec4(c,max(a,sl)); }`})); sc.add(clouds);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(1.04,64,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,
    vertexShader:'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'varying vec3 vN; void main(){ float i=pow(max(0.,0.72-dot(vN,vec3(0,0,1.))),3.); gl_FragColor=vec4(1.,0.8,0.5,1.)*i*1.2; }'})); sc.add(atm);
  SCN[1]=function(lt){ U.uT.value=lt+2.; U.uX.value=smooth(0.45,0.7,lt); U.uS.value=1.05-1.75*easeIO(cl((lt-0.55)/1.7));
    const u=easeIO(cl(lt/4.2)); const az=0.25+0.22*u; const d=7.6-1.8*u;
    cam.position.set(Math.sin(az)*d,0.55-0.15*u,Math.cos(az)*d); cam.lookAt(0.05*u,0.2*u,0); clouds.rotation.y=surf.rotation.y=-0.05*lt; P.c.render();
    fixLab('l1_0',560,560,win(lt,0.35,9)); fixLab('l1_1',90,600,win(lt,1.5,9)); fixLab('l1_2',520,1030,win(lt,2.2,9));
    caption(1,lt); };
})();

// ---------- S2 /scale a magnetar versus Manhattan: 1 unit = 1 km. A magnetar ~20 km across (NASA) beside a long, narrow island city of our
// own generic design, 21.6 km long (Manhattan's length). Night, the star's blue glow and field lines light the water. Camera pulls back.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x02040a); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.05,2000); const P=mkComposer(ren,sc,cam,{bloom:0.5,radius:0.55,th:0.8});
  starField(sc,1500,29,900);
  const MC=new THREE.Vector3(-8.5,10,0), MR=10;
  const MU={uT:{value:0}};
  const mag=new THREE.Mesh(new THREE.SphereGeometry(MR,128,96),new THREE.ShaderMaterial({uniforms:MU,toneMapped:false,
    vertexShader:'varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform float uT; varying vec3 vN; varying vec3 vP;
      void main(){ float mu=max(dot(vN,vec3(0,0,1)),0.); vec2 sp=vec2(atan(vP.z,vP.x)*3.,vP.y*4.);
        float g=fbm(sp*6.+uT*0.2)*0.5+fbm(sp*20.-uT*0.3)*0.5; float pole=pow(abs(vP.y),6.);
        vec3 c=mix(vec3(0.18,0.30,0.75),vec3(0.75,0.85,1.1),g*0.8+pole*0.5)*(0.45+0.55*pow(mu,0.4));
        c+=vec3(0.45,0.35,1.2)*pow(1.-mu,2.5)*0.7; gl_FragColor=vec4(c*0.7,1.); }`}));
  mag.position.copy(MC); mag.rotation.z=0.35; sc.add(mag);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:softDot(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,color:0x7aa0ff,opacity:0.3}));
  glow.position.copy(MC); glow.scale.setScalar(MR*3.2); sc.add(glow);
  // dipole field lines
  const FG=new THREE.Group(); FG.position.copy(MC); FG.rotation.z=0.35; sc.add(FG); const fm=glowMat(0x9a7dff,0.0);
  [1.8,2.5,3.4].forEach(L=>{ for(let k=0;k<6;k++){ const ph=k/6*Math.PI*2; const pts=[]; const t0=Math.asin(Math.sqrt(1/L));
      for(let i=0;i<=60;i++){ const th=t0+(Math.PI-2*t0)*i/60, r=MR*L*Math.pow(Math.sin(th),2); pts.push(new THREE.Vector3(r*Math.sin(th)*Math.cos(ph),r*Math.cos(th),r*Math.sin(th)*Math.sin(ph))); }
      FG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),80,0.09,6,false),fm)); } });
  // water
  const water=new THREE.Mesh(new THREE.PlaneGeometry(400,400),new THREE.MeshStandardMaterial({color:0x07101c,roughness:0.75,metalness:0.25})); water.rotation.x=-Math.PI/2; sc.add(water);
  const pl=new THREE.PointLight(0x8fb0ff,3.0,0,1.2); pl.position.copy(MC); sc.add(pl); sc.add(new THREE.AmbientLight(0x2a3550,0.6));
  const refl=new THREE.Sprite(new THREE.SpriteMaterial({map:softDot(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,color:0x4f74ff,opacity:0.2}));
  refl.position.set(MC.x,0.05,MC.z+2); refl.scale.set(30,8,1); sc.add(refl);
  // island: long narrow lens shape, 21.6 km along z, max ~3.6 km wide, our own generic outline
  const IL=21.6, IWm=3.6; const half=(z)=>{ const t=(z+IL/2)/IL; return IWm/2*Math.pow(Math.sin(Math.PI*Math.min(1,Math.max(0,t))),0.55)*(0.85+0.15*Math.sin(t*9.)); };
  const sh=new THREE.Shape(); for(let i=0;i<=80;i++){ const z=-IL/2+IL*i/80; const x=half(z); i?sh.lineTo(x,z):sh.moveTo(x,z); } for(let i=80;i>=0;i--){ const z=-IL/2+IL*i/80; sh.lineTo(-half(z),z); }
  const ig=new THREE.ExtrudeGeometry(sh,{depth:0.06,bevelEnabled:false}); ig.rotateX(Math.PI/2); ig.translate(0,0.06,0);
  const ISL=new THREE.Group(); ISL.position.set(6.5,0,-1); ISL.rotation.y=0.12; sc.add(ISL);
  ISL.add(new THREE.Mesh(ig,new THREE.MeshStandardMaterial({color:0x1b2230,roughness:0.9})));
  // street-grid buildings
  const R=rnd(77), B=[]; for(let z=-IL/2+0.3;z<IL/2-0.3;z+=0.16){ const hw=half(z)-0.12; for(let x=-hw;x<hw;x+=0.13){ if(R()<0.2) continue; const dz=Math.abs(z+3.5);
      const tall=Math.exp(-dz*dz/6)*0.35+Math.exp(-Math.pow(z-6.5,2)/2)*0.22; const h=0.02+R()*0.05+tall*R()*1.6; B.push([x,z,h]); } }
  const bm=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x8a9bb8,roughness:0.6,emissive:0xffc070,emissiveIntensity:0.0}),B.length);
  const M=new THREE.Matrix4(), bc=new THREE.Color(); B.forEach(([x,z,h],i)=>{ M.compose(new THREE.Vector3(x,0.06+h/2,z),new THREE.Quaternion(),new THREE.Vector3(0.1,h,0.12)); bm.setMatrixAt(i,M);
    const g=0.35+R()*0.35; bc.setRGB(g,g*1.02,g*1.1); bm.setColorAt(i,bc); }); ISL.add(bm);
  // window lights as points
  const NL=Math.min(B.length*2,16000), lp=cloudPoints(NL,softDot(),7,THREE.AdditiveBlending); ISL.add(lp);
  { const pos=lp.geometry.attributes.position.array, col=lp.geometry.attributes.color.array, sz=lp.geometry.attributes.sz.array, al=lp.geometry.attributes.al.array;
    for(let i=0;i<NL;i++){ const b=B[(R()*B.length)|0]; pos[i*3]=b[0]+(R()-.5)*0.1; pos[i*3+1]=0.06+R()*b[2]; pos[i*3+2]=b[1]+(R()-.5)*0.12;
      const w=R(); col[i*3]=1; col[i*3+1]=0.78+0.15*w; col[i*3+2]=0.5+0.4*w; sz[i]=0.5+R()*0.8; al[i]=0.9; } }
  // scale bars
  const barM=new THREE.MeshBasicMaterial({color:0xff6a3d,toneMapped:false,transparent:true,opacity:0});
  const bar1=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,1),barM); ISL.add(bar1); bar1.position.set(IWm/2+0.9,0.15,0);
  const bar2=new THREE.Mesh(new THREE.BoxGeometry(1,0.12,0.12),barM.clone()); sc.add(bar2); bar2.position.set(MC.x,0.15,MC.z+MR+1.2);
  const pMag=new THREE.Object3D(); pMag.position.copy(MC).add(new THREE.Vector3(0,MR,0)); sc.add(pMag);
  SCN[2]=function(lt){ MU.uT.value=lt; const u=easeIO(cl((lt-0.05)/3.6));
    // start close on the magnetar surface, pull back to see both side by side
    const C0=new THREE.Vector3(-7,30,44), L0=MC.clone().add(new THREE.Vector3(2,-3,0)); const C1=new THREE.Vector3(-1,82,78), L1=new THREE.Vector3(-1,-2,-2);
    cam.position.copy(C0).lerp(C1,u).add(new THREE.Vector3(0.6*Math.sin(lt*0.4),0,0)); cam.lookAt(L0.clone().lerp(L1,u));
    mag.rotation.y=lt*0.25; FG.rotation.y=lt*0.25; fm.opacity=0.5*smooth(0.3,1.0,lt)*(0.85+0.15*Math.sin(lt*6));
    const b=smooth(1.4,2.4,lt); bar1.scale.z=Math.max(0.001,IL*b); bar1.material.opacity=b; bar2.scale.x=Math.max(0.001,2*MR*smooth(1.0,2.0,lt)); bar2.material.opacity=smooth(1.0,1.3,lt);
    P.c.render();
    fixLab('l2_0',90,560,win(lt,0.3,9)); fixLab('l2_1',640,1040,win(lt,1.5,9)); fixLab('l2_2',560,620,win(lt,2.2,9));
    caption(2,lt); };
})();
