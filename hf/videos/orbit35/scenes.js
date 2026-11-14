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

// ---------- S0 /explain-3d a solar flare hitting Earth: the Sun flares (flash on the limb facing Earth); the flare's light streaks to Earth
// first (~8 min in reality), then the slower plasma cloud (CME, 1-4 days) balloons out, hits Earth's magnetic shield, which squeezes on the
// day side and stretches into a tail; auroras light up at both poles. Not to scale, time-lapsed.
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020306); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.05,400); const P=mkComposer(ren,sc,cam,{bloom:0.75,radius:0.55,th:0.7});
  starField(sc,1500,61,300);
  const SUN=new THREE.Vector3(-1.55,1.25,-0.4), SR=1.15, EP=new THREE.Vector3(0.78,-0.55,0.2), ER=0.17;
  const D=EP.clone().sub(SUN).normalize(), FL=SUN.clone().addScaledVector(D,SR*0.99);
  const SU={uT:{value:0},uF:{value:0},uD:{value:D}};
  const sun=new THREE.Mesh(new THREE.SphereGeometry(SR,128,96),new THREE.ShaderMaterial({uniforms:SU,toneMapped:false,
    vertexShader:'varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform float uT,uF; uniform vec3 uD; varying vec3 vN; varying vec3 vP;
      void main(){ float mu=max(dot(vN,vec3(0,0,1)),0.); vec2 sp=vec2(atan(vP.z,vP.x)*2.,vP.y*3.);
        float g=fbm(sp*9.+vec2(uT*0.05,0.))*0.6+fbm(sp*28.-uT*0.08)*0.4; float act=smoothstep(0.55,0.8,fbm(sp*2.5+3.));
        float I=(0.55+0.55*g)*(0.35+0.65*pow(mu,0.5))+act*0.25*pow(mu,0.3);
        float f=exp(-pow(acos(clamp(dot(vP,uD),-1.,1.))*7.,2.)); I+=f*(0.6+3.5*uF);
        vec3 c=I>0.7?mix(vec3(1.,0.55,0.12),vec3(1.25,1.,0.75),(I-0.7)/0.6):mix(vec3(0.5,0.1,0.02),vec3(1.,0.55,0.12),I/0.7);
        c+=vec3(1.,0.5,0.15)*pow(1.-mu,3.)*0.6; gl_FragColor=vec4(c,1.); }`}));
  sun.position.copy(SUN); sc.add(sun);
  const corona=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,0,128,128,128); g.addColorStop(0,'rgba(255,170,80,.9)'); g.addColorStop(.45,'rgba(255,120,40,.35)'); g.addColorStop(.7,'rgba(255,90,20,.1)'); g.addColorStop(1,'rgba(255,60,0,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
  corona.scale.set(SR*3.6,SR*3.6,1); corona.position.copy(SUN).add(new THREE.Vector3(0,0,-0.2)); sc.add(corona);
  const fl=new THREE.Sprite(new THREE.SpriteMaterial({map:softDot(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,color:0xfff2d0}));
  fl.position.copy(FL); sc.add(fl);
  // flare loops (prominence arcs) at the flare site
  const loops=new THREE.Group(); loops.position.copy(FL); loops.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),D); sc.add(loops);
  const lm=glowMat(0xff8a3a,0.0); for(let k=0;k<4;k++){ const w=0.10+k*0.035, h=0.10+k*0.05, a=k*0.5; const pts=[]; for(let i=0;i<=30;i++){ const t=i/30*Math.PI; pts.push(new THREE.Vector3(Math.cos(t)*w*Math.cos(a),Math.sin(t)*h,Math.cos(t)*w*Math.sin(a))); }
    loops.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,0.008,6,false),lm)); }
  // light streak Sun -> Earth
  const streak=new THREE.Mesh(new THREE.CylinderGeometry(0.008,0.008,1,8,1,true),glowMat(0xfff0c8,0)); sc.add(streak);
  // Earth
  const light=new THREE.PointLight(0xfff1dc,6,0,0); light.position.copy(SUN); sc.add(light); sc.add(new THREE.AmbientLight(0x3a4660,0.35));
  const E=earthReal(); const EG=new THREE.Group(); EG.position.copy(EP); sc.add(EG);
  const earth=new THREE.Mesh(new THREE.SphereGeometry(ER,96,64),new THREE.MeshStandardMaterial({map:E.day,roughness:.75})); earth.rotation.set(0.4,2.4,0); EG.add(earth);
  const cl2=new THREE.Mesh(new THREE.SphereGeometry(ER*1.01,64,48),new THREE.MeshStandardMaterial({color:0xffffff,alphaMap:E.clouds,transparent:true,opacity:.8,depthWrite:false})); cl2.rotation.copy(earth.rotation); EG.add(cl2);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(ER*1.06,48,32),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,
    vertexShader:'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'varying vec3 vN; void main(){ float i=pow(max(0.,0.72-dot(vN,vec3(0,0,1.))),3.); gl_FragColor=vec4(0.35,0.6,1.,1.)*i*2.; }'})); EG.add(atm);
  // aurora rings at both poles
  const aur=[]; [1,-1].forEach(s=>{ const m=new THREE.Mesh(new THREE.TorusGeometry(ER*0.42,ER*0.06,12,64),glowMat(0x46ff9a,0)); m.rotation.x=Math.PI/2; m.position.y=s*ER*0.93; EG.add(m); aur.push(m);
    const m2=new THREE.Mesh(new THREE.CylinderGeometry(ER*0.44,ER*0.40,ER*0.25,48,1,true),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false,uniforms:{uA:{value:0}},
      vertexShader:'varying vec2 vU; void main(){ vU=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader:'uniform float uA; varying vec2 vU; void main(){ float c=0.6+0.4*sin(vU.x*60.); gl_FragColor=vec4(vec3(0.2,1.,0.55)*uA*c*(1.-vU.y),1.); }'}));
    m2.position.y=s*ER*(0.93+0.12); if(s<0) m2.rotation.x=Math.PI; EG.add(m2); aur.push(m2); });
  // magnetosphere: dipole field lines, x axis = away from the Sun
  const MG=new THREE.Group(); MG.position.copy(EP); MG.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),D); sc.add(MG);
  const fmat=new THREE.MeshBasicMaterial({color:0x5aa0ff,transparent:true,opacity:0.35,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false});
  const FLs=[]; [0.42,0.62,0.85].forEach((L,li)=>{ [0,Math.PI].forEach(ph=>{ [-0.5,0,0.5].forEach(tw=>{ const m=new THREE.Mesh(new THREE.BufferGeometry(),fmat.clone()); m.material.opacity=0.42-li*0.09; MG.add(m); FLs.push({m,L,ph:ph+tw}); }); }); });
  function fieldLine(L,ph,c){ const pts=[], t0=Math.asin(Math.sqrt(ER/L)); for(let i=0;i<=48;i++){ const th=t0+(Math.PI-2*t0)*i/48, r=L*Math.pow(Math.sin(th),2);
      let x=r*Math.sin(th)*Math.cos(ph), y=r*Math.cos(th), z=r*Math.sin(th)*Math.sin(ph);
      if(x<0) x*=1-0.38*c; else { x*=1+1.6*c*Math.pow(r/L,1.5); y*=1-0.25*c*(r/L); }
      pts.push(new THREE.Vector3(x,y,z)); } return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,0.0045,5,false); }
  // CME particles
  const NP=1400, cme=cloudPoints(NP,softDot(),260,THREE.AdditiveBlending); sc.add(cme); const R=rnd(31), PA=[];
  const up=new THREE.Vector3(0,0,1).cross(D).normalize(), side=D.clone().cross(up).normalize();
  for(let i=0;i<NP;i++){ const a=R()*Math.PI*2, s=Math.sqrt(R())*0.75; const dir=D.clone().addScaledVector(up,Math.cos(a)*s).addScaledVector(side,Math.sin(a)*s).normalize();
    PA.push({dir,sp:0.55+0.45*Math.pow(R(),0.35),s:0.5+R(),hot:R()}); }
  const DIST=EP.distanceTo(FL), tmp=new THREE.Vector3(), rel=new THREE.Vector3();
  const aS=new THREE.Object3D(); aS.position.copy(FL); const aM=new THREE.Object3D(); sc.add(aM); const aE=new THREE.Object3D(); aE.position.copy(EP).addScaledVector(D,-0.4).add(new THREE.Vector3(0,0.28,0));
  SCN[0]=function(lt){ SU.uT.value=lt; const fF=smooth(0.05,0.35,lt)*(1-0.6*smooth(0.9,2.0,lt)); SU.uF.value=fF; fl.material.opacity=fF; fl.scale.setScalar(0.25+1.1*fF);
    lm.opacity=0.85*smooth(0.1,0.5,lt); loops.scale.setScalar(0.6+0.5*smooth(0.1,1.6,lt));
    const sh=cl((lt-0.3)/0.35), st=cl((lt-0.55)/0.6); const a=FL.clone().lerp(EP,st), b=FL.clone().lerp(EP,sh); streak.position.copy(a).add(b).multiplyScalar(0.5);
    streak.scale.set(1+2*fF,Math.max(0.001,a.distanceTo(b)),1); streak.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),D); streak.material.opacity=0.9*(sh>0&&st<1?1:0);
    const fr=ease(cl((lt-0.45)/2.3))*DIST*1.25; const hit=smooth(1.7,2.6,lt);
    const pos=cme.geometry.attributes.position.array, col=cme.geometry.attributes.color.array, sz=cme.geometry.attributes.sz.array, al=cme.geometry.attributes.al.array;
    for(let i=0;i<NP;i++){ const o=PA[i]; const d=fr*o.sp; tmp.copy(FL).addScaledVector(o.dir,d);
      rel.copy(tmp).sub(EP); const rm=0.30+0.06*(1-hit); const rl=rel.length(); if(rl<rm){ rel.multiplyScalar(rm/rl); tmp.copy(EP).add(rel).addScaledVector(D,(rm-rl)*1.4); }
      pos[i*3]=tmp.x; pos[i*3+1]=tmp.y; pos[i*3+2]=tmp.z; const k=0.4+0.6*o.hot; col[i*3]=1.0*k; col[i*3+1]=(0.38+0.25*o.hot)*k; col[i*3+2]=0.12*k;
      sz[i]=o.s*(0.25+0.9*cl(d/1.5)); al[i]=cl((lt-0.45)/0.3)*0.16*(1-0.5*cl(d/3.5)); }
    ['position','color','sz','al'].forEach(k=>cme.geometry.attributes[k].needsUpdate=true);
    FLs.forEach(f=>{ f.m.geometry.dispose(); f.m.geometry=fieldLine(f.L,f.ph,hit); }); fmat.opacity=0.3;
    const au=smooth(2.0,2.8,lt); aur.forEach((m,i)=>{ if(m.material.uniforms) m.material.uniforms.uA.value=au*(0.6+0.15*Math.sin(lt*9+i)); else m.material.opacity=au*0.9; });
    earth.rotation.y=2.4+lt*0.1; cl2.rotation.y=2.4+lt*0.12;
    const u=easeIO(cl(lt/3.6)); cam.position.set(-0.2+0.35*u,-0.45-0.15*u,7.4-1.1*u); cam.lookAt(-0.1+0.3*u,-0.4-0.2*u,0); P.c.render();
    aM.position.copy(FL).lerp(EP,0.45).add(new THREE.Vector3(0,0.15,0));
    fixLab('l0_0',420,520,win(lt,0.35,9)); fixLab('l0_1',70,1010,win(lt,1.1,9)); fixLab('l0_2',600,740,win(lt,2.1,9));
    caption(0,lt); };
})();

// ---------- S1 /x-ray Jupiter down to its core: a banded Jupiter, an x-ray scan line sweeps down and a wedge opens: cloud tops ->
// molecular hydrogen -> liquid metallic hydrogen (its dynamo makes the magnetic field) -> a big fuzzy core, partly dissolved (Juno).
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020307); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.05,400); const P=mkComposer(ren,sc,cam,{bloom:0.35,radius:0.5,th:0.92});
  starField(sc,1200,71,300);
  const U={uT:{value:0},uC:{value:0},uS:{value:0},uX:{value:0}};
  const BAND=`vec3 jband(vec3 p,float t){ float lat=p.y; float lon=atan(p.z,p.x);
      float w=fbm(vec2(lon*3.+t*0.15*sin(lat*20.),lat*14.))*0.35; float y=lat*9.+w;
      float b=sin(y*2.1)*0.5+0.5, b2=sin(y*4.7+1.3)*0.5+0.5;
      vec3 cream=vec3(0.95,0.88,0.76), tan=vec3(0.76,0.56,0.40), brown=vec3(0.50,0.33,0.23);
      vec3 c=mix(mix(brown,tan,b2),cream,smoothstep(0.35,0.75,b)); c*=0.85+0.3*fbm(vec2(lon*12.+t*0.3,lat*40.));
      vec2 e=vec2((lon-0.9)*1.6,(lat+0.36)*5.); float r=length(e); c=mix(c,vec3(0.78,0.32,0.18),smoothstep(0.5,0.25,r)*0.9); return c; }`;
  const LAYER=`vec3 layer(float r,vec2 q,float t){ // r in 0..1
      vec3 mol=mix(vec3(0.55,0.62,0.78),vec3(0.80,0.84,0.92),fbm(q*6.+t*0.1));
      vec3 met=mix(vec3(0.20,0.35,0.85),vec3(0.65,0.80,1.25),fbm(q*9.-vec2(t*0.25,0.)))*1.05;
      vec3 core=mix(vec3(1.25,0.55,0.18),vec3(1.6,1.0,0.5),fbm(q*7.+t*0.2));
      vec3 c=mix(met,mol,smoothstep(0.76,0.84,r+0.03*(fbm(q*14.)-.5)));
      float cr=0.45+0.08*(fbm(q*5.+t*0.15)-.5); c=mix(c,core,smoothstep(cr+0.12,cr-0.12,r)); // soft, fuzzy core edge
      c*=0.75+0.25*fbm(q*20.); c+=vec3(1.,0.5,0.15)*0.35*exp(-pow(r/0.42,2.));
      c=mix(c,vec3(0.95,0.85,0.72),smoothstep(0.965,0.99,r)); return c; }`;
  const G=new THREE.Group(); sc.add(G);
  const jup=new THREE.Mesh(new THREE.SphereGeometry(1,160,120),new THREE.ShaderMaterial({uniforms:U,toneMapped:false,
    vertexShader:'varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+BAND+`uniform float uT,uC,uS,uX; varying vec3 vN; varying vec3 vP;
      void main(){ float ph=atan(vP.z,vP.x); if(ph>0.&&ph<uC) discard; float mu=max(dot(vN,vec3(0,0,1)),0.);
        vec3 c=jband(vP,uT)*(0.25+0.85*pow(mu,0.7));
        float sh=dot(normalize(vP),normalize(vec3(0.6,0.3,0.8))); c*=0.35+0.75*smoothstep(-0.3,0.6,sh);
        // x-ray scan line + blue x-ray tint above it
        float sl=exp(-pow((vP.y-uS)*28.,2.)); c=mix(c,vec3(0.25,0.45,0.85)*(0.3+0.6*pow(1.-mu,1.5))+c*0.3,uX*step(uS,vP.y)*0.5); c+=vec3(0.45,0.7,1.)*sl*0.55*uX;
        c+=vec3(0.4,0.6,1.)*pow(1.-mu,3.)*0.25; gl_FragColor=vec4(c*0.8,1.); }`}));
  G.add(jup);
  const cutM=new THREE.ShaderMaterial({uniforms:U,side:THREE.DoubleSide,toneMapped:false,
    vertexShader:'varying vec3 vL; void main(){ vL=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+LAYER+`uniform float uT; varying vec3 vL; void main(){ float r=length(vL.xy); if(r>1.) discard; gl_FragColor=vec4(layer(r,vL.xy*2.,uT)*0.8,1.); }`});
  const hd=new THREE.CircleGeometry(1,128,-Math.PI/2,Math.PI); // half disc, x>0
  const c1=new THREE.Mesh(hd,cutM), c2=new THREE.Mesh(hd,cutM); G.add(c1); G.add(c2);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(1.035,64,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,
    vertexShader:'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'varying vec3 vN; void main(){ float i=pow(max(0.,0.7-dot(vN,vec3(0,0,1.))),3.); gl_FragColor=vec4(0.5,0.7,1.,1.)*i*0.8; }'})); G.add(atm);
  const pTop=new THREE.Object3D(), pMet=new THREE.Object3D(), pCore=new THREE.Object3D(); [pTop,pMet,pCore].forEach(o=>G.add(o));
  SCN[1]=function(lt){ U.uT.value=lt+3.; U.uX.value=smooth(0.55,0.8,lt); U.uS.value=1.05-2.1*easeIO(cl((lt-0.6)/0.9));
    const cu=easeIO(cl((lt-1.15)/0.95)); U.uC.value=cu*Math.PI*0.5; c2.rotation.y=-U.uC.value; c1.visible=c2.visible=cu>0.001;
    const az=Math.PI*0.25*cu+0.15*(1-cu)+0.06*lt, d=5.6-0.8*easeIO(cl(lt/3.6)); cam.position.set(Math.cos(az)*d,0.75-0.1*lt,Math.sin(az)*d); cam.lookAt(0,-0.05,0);
    G.rotation.y=0; P.c.render();
    const h=Math.PI*0.25*cu; pTop.position.set(Math.cos(h-0.6)*0.97,0.25,Math.sin(h-0.6)*0.97); pMet.position.set(Math.cos(h)*0.62,0.05,Math.sin(h)*0.62); pCore.position.set(Math.cos(h)*0.12,-0.05,Math.sin(h)*0.12);
    fixLab('l1_0',650,560,win(lt,0.4,9));
    fixLab('l1_1',560,1060,win(lt,1.5,9));
    fixLab('l1_2',90,780,win(lt,2.2,9));
    caption(1,lt); };
})();

// ---------- S2 /zoom-in Saturn's rings: from the whole planet one continuous dive into the A ring until single chunks of water ice drift past
// in sunlight; the ring is only ~10 m thick in most places (NASA). Camera path on a log scale, ring texture hands over to real 3D chunks.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x010204); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.0005,400); const P=mkComposer(ren,sc,cam,{bloom:0.4,radius:0.5,th:0.85});
  sc.environment=hdrEnv(ren); starField(sc,1300,81,300);
  const SUN=new THREE.Vector3(-0.8,0.35,0.6).normalize(); const dl=new THREE.DirectionalLight(0xfff3e0,2.2); dl.position.copy(SUN); sc.add(dl); sc.add(new THREE.AmbientLight(0x30384a,0.25));
  const T={uT:{value:0},uSun:{value:SUN}};
  const sat=new THREE.Mesh(new THREE.SphereGeometry(1,128,96),new THREE.ShaderMaterial({uniforms:T,toneMapped:false,
    vertexShader:'varying vec3 vN; varying vec3 vP; varying vec3 vW; void main(){ vP=position; vW=normalize((modelMatrix*vec4(normal,0.)).xyz); vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform float uT; uniform vec3 uSun; varying vec3 vN; varying vec3 vP; varying vec3 vW;
      void main(){ float lat=vP.y; float w=fbm(vec2(atan(vP.z,vP.x)*4.+uT*0.05,lat*20.))*0.25; float b=sin((lat*11.+w)*2.)*0.5+0.5;
        vec3 c=mix(vec3(0.78,0.66,0.46),vec3(0.95,0.88,0.70),b); c*=0.9+0.15*fbm(vec2(atan(vP.z,vP.x)*20.,lat*60.));
        float l=clamp(dot(vW,uSun),0.,1.); float mu=max(dot(vN,vec3(0,0,1)),0.);
        float rs=1.-0.55*smoothstep(0.02,0.0,abs(lat+0.12+0.1*vP.x)); // thin ring shadow band
        c*=(0.04+1.05*pow(l,0.8))*rs*(0.6+0.4*pow(mu,0.4)); gl_FragColor=vec4(c,1.); }`}));
  sc.add(sat);
  const RI=1.24, RO=2.27; const rg=new THREE.RingGeometry(RI,RO,256,8); rg.rotateX(-Math.PI/2);
  const RU={uFade:{value:1},uSun:{value:SUN}};
  const ring=new THREE.Mesh(rg,new THREE.ShaderMaterial({uniforms:RU,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,
    vertexShader:'varying vec3 vW; void main(){ vW=(modelMatrix*vec4(position,1.)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform float uFade; uniform vec3 uSun; varying vec3 vW;
      void main(){ float r=length(vW.xz); float n=vn(vec2(r*420.,0.))*0.5+vn(vec2(r*90.,3.))*0.5;
        float dens=0.25*smoothstep(1.24,1.30,r)*(1.-smoothstep(1.50,1.53,r)) + 0.9*smoothstep(1.52,1.55,r)*(1.-smoothstep(1.94,1.95,r)) + 0.7*smoothstep(2.02,2.03,r)*(1.-smoothstep(2.25,2.27,r));
        dens*=(1.-0.85*exp(-pow((r-2.21)*300.,2.)))*(0.65+0.55*n);
        vec3 c=mix(vec3(0.62,0.55,0.45),vec3(0.95,0.90,0.80),n)*(0.7+0.3*smoothstep(1.5,2.0,r));
        // planet shadow on the ring (cylinder behind the planet away from the Sun)
        vec3 s=normalize(uSun); float along=dot(vW,s); float perp=length(vW-along*s); float shd=step(along,0.)*smoothstep(1.0,0.97,perp); c*=1.-0.9*shd;
        gl_FragColor=vec4(c*0.85,dens*uFade); }`}));
  sc.add(ring);
  // ice chunks around the dive target in the A ring
  const TG=new THREE.Vector3(Math.cos(0.9)*2.12,0,Math.sin(0.9)*2.12);
  const weld=(g0)=>{ const p0=g0.attributes.position, map={}, pos=[], idx=[]; for(let i=0;i<p0.count;i++){ const k=p0.getX(i).toFixed(4)+','+p0.getY(i).toFixed(4)+','+p0.getZ(i).toFixed(4); if(map[k]===undefined){ map[k]=pos.length/3; pos.push(p0.getX(i),p0.getY(i),p0.getZ(i)); } idx.push(map[k]); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setIndex(idx); return g; };
  const mkChunk=(seed)=>{ const g=weld(new THREE.IcosahedronGeometry(1,4)); const p=g.attributes.position, n=vnoise(seed), n2=vnoise(seed+50), v=new THREE.Vector3(); for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); const k=0.55+0.7*fbm(n,v.x*1.6+4,v.y*1.6+v.z*1.3,4)+0.12*fbm(n2,v.x*7+1,v.y*7+v.z*6,3); v.multiplyScalar(k); v.x*=1.25; v.y*=0.8; p.setXYZ(i,v.x,v.y,v.z); } g.computeVertexNormals(); return g; };
  const ig=mkChunk(9);
  const NI=1800, im=new THREE.InstancedMesh(ig,new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.9,metalness:0,envMapIntensity:0.08}),NI); sc.add(im);
  const R=rnd(91), CH=[], icol=new THREE.Color(); for(let i=0;i<NI;i++){ const s=0.00015+Math.pow(R(),4.0)*0.004; const p=new THREE.Vector3((R()-.5)*0.5,(R()-.5)*0.0024,(R()-.5)*0.5);
    CH.push({p,s,sv:new THREE.Vector3(0.7+R()*0.6,0.6+R()*0.5,0.7+R()*0.6),ax:new THREE.Vector3(R()-.5,R()-.5,R()-.5).normalize(),w:(R()-.5)*0.8,ph:R()*6});
    const g=0.55+R()*0.4; icol.setRGB(g*(0.93+R()*0.05),g*(0.92+R()*0.04),g*(0.88+R()*0.1)); im.setColorAt(i,icol); }
  const dust=cloudPoints(1600,softDot(),60,THREE.NormalBlending); sc.add(dust); { const pos=dust.geometry.attributes.position.array, col=dust.geometry.attributes.color.array, sz=dust.geometry.attributes.sz.array; const r2=rnd(5);
    for(let i=0;i<1600;i++){ pos[i*3]=TG.x+(r2()-.5)*0.5; pos[i*3+1]=(r2()-.5)*0.0024; pos[i*3+2]=TG.z+(r2()-.5)*0.5; col[i*3]=0.85; col[i*3+1]=0.86; col[i*3+2]=0.9; sz[i]=0.08+r2()*0.25; } }
  const M=new THREE.Matrix4(), Q=new THREE.Quaternion(), S=new THREE.Vector3(), Pp=new THREE.Vector3();
  const tang=new THREE.Vector3(-Math.sin(0.9),0,Math.cos(0.9)), radial=TG.clone().normalize();
  const C0=new THREE.Vector3(-0.7,2.4,7.6), L0=new THREE.Vector3(0.35,-0.1,0);
  const C1=TG.clone().addScaledVector(radial,-0.035).addScaledVector(tang,-0.05).add(new THREE.Vector3(0,0.0019,0)), L1=TG.clone().addScaledVector(tang,0.09).addScaledVector(radial,0.01).add(new THREE.Vector3(0,0.0003,0));
  const pSat=new THREE.Object3D(); pSat.position.set(-0.7,0.75,0.3); sc.add(pSat);
  SCN[2]=function(lt){ T.uT.value=lt; const u=easeIO(cl((lt-0.1)/3.3));
    const w=Math.pow(u,1.6); const dlog=Math.exp(Math.log(C0.distanceTo(L0))*(1-w)+Math.log(C1.distanceTo(L1))*w);
    const look=L0.clone().lerp(L1,easeIO(cl((lt-0.1)/2.6))); const dir=C0.clone().sub(L0).normalize().lerp(C1.clone().sub(L1).normalize(),easeIO(cl((lt-0.1)/2.8))).normalize();
    cam.position.copy(look).addScaledVector(dir,dlog).addScaledVector(tang,0.004*lt); cam.lookAt(look);
    const close=smooth(1.8,2.9,lt); RU.uFade.value=1-close; if(close>0.01){ if(!sc.fog) sc.fog=new THREE.FogExp2(0x05070b,1); sc.fog.density=close*9; } else sc.fog=null; im.visible=close>0.01; dust.material.uniforms.uSz.value=1.0;
    const al=dust.geometry.attributes.al.array; for(let i=0;i<1600;i++) al[i]=0.5*close; dust.geometry.attributes.al.needsUpdate=true;
    for(let i=0;i<NI;i++){ const c=CH[i]; Pp.copy(TG).add(c.p).addScaledVector(tang,0.004*Math.sin(c.ph+lt*0.3)); Q.setFromAxisAngle(c.ax,c.ph+lt*c.w); S.copy(c.sv).multiplyScalar(c.s*close); if(Pp.distanceTo(C1)<c.s*3+0.006) S.setScalar(0); M.compose(Pp,Q,S); im.setMatrixAt(i,M); }
    im.instanceMatrix.needsUpdate=true; P.c.render();
    labAt('l2_0',pSat.position,cam,10,-30,win(lt,0.3,1.7),-1);
    fixLab('l2_1',600,470,win(lt,1.6,9)); fixLab('l2_2',90,560,win(lt,1.95,9));
    caption(2,lt); };
})();
