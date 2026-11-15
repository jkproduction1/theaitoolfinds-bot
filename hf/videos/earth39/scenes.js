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

// ================= earth39 scenes (Claude Opus 5.5, drawn in code) =================
// ---------- S0 /simulate the Moon twice as close: real Earth, a procedural Moon that drifts in from today's distance to half of it
// (not to scale: distances shortened, sizes true ratio). Tide-generating force ~ 1/d^3 (NOAA), so half the distance = 8x the pull: the
// ocean tidal bulge (exaggerated ellipsoid shell) swells toward the Moon and on the far side; odometers run 384,400 -> 192,200 km and x1 -> x8.
function moonTex(){ return canvasTex(1024,512,(c,w,h)=>{ const n=vnoise(5), n2=vnoise(9); const im=c.createImageData(w,h);
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const u=x/w*10, v=y/h*5; let e=fbm(n,u,v,6); const mare=fbm(n2,u*0.5+3,v*0.5,4)>0.56?0.55:1; let g=(95+120*e)*mare; const i=(y*w+x)*4; im.data[i]=g; im.data[i+1]=g*0.98; im.data[i+2]=g*0.95; im.data[i+3]=255; }
  c.putImageData(im,0,0); const r=rnd(12); for(let i=0;i<420;i++){ const x=r()*w,y=r()*h,rr=2+Math.pow(r(),3)*26; c.strokeStyle='rgba(30,30,30,.35)'; c.lineWidth=rr*0.25; c.beginPath(); c.arc(x,y,rr,0,7); c.stroke(); c.strokeStyle='rgba(255,255,255,.25)'; c.lineWidth=rr*0.12; c.beginPath(); c.arc(x-rr*0.15,y-rr*0.15,rr,3.6,5.6); c.stroke(); } }); }
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020306); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(42,1080/1920,0.05,500); const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.8});
  starField(sc,1800,31,300);
  const SUN=new THREE.Vector3(1,0.35,0.6).normalize();
  const E=earthReal(); const U={uDay:{value:E.day},uCl:{value:E.clouds},uNi:{value:E.night},uT:{value:0},uSun:{value:SUN}};
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1,160,120),new THREE.ShaderMaterial({uniforms:U,vertexShader:EARTH_VS,toneMapped:false,
    fragmentShader:`uniform sampler2D uDay,uCl,uNi; uniform float uT; uniform vec3 uSun; varying vec2 vU; varying vec3 vN; varying vec3 vW;
      void main(){ vec3 d=texture2D(uDay,vU).rgb; float c=texture2D(uCl,vU+vec2(uT*0.004,0.)).r; float nl=texture2D(uNi,vU).r; vec3 N=normalize(vN);
        float k=smoothstep(-0.15,0.4,dot(N,uSun)); vec3 base=mix(d,vec3(1.),c*0.8); vec3 col=base*(0.05+1.25*k)+vec3(1.,0.72,0.4)*nl*nl*(1.-k)*(1.-c)*0.8;
        vec3 V=normalize(cameraPosition-vW); col+=vec3(0.35,0.6,1.)*pow(1.-max(dot(N,V),0.),3.)*(0.2+k)*0.8; gl_FragColor=vec4(col,1.); }`}));
  earth.rotation.set(0.35,-2.2,0); sc.add(earth);
  // tidal bulge: translucent ocean shell stretched along the Moon direction
  const BU={uK:{value:0},uSun:{value:SUN},uT:{value:0}};
  const bulge=new THREE.Mesh(new THREE.SphereGeometry(1.004,120,90),new THREE.ShaderMaterial({uniforms:BU,transparent:true,depthWrite:false,toneMapped:false,
    vertexShader:'varying vec3 vN; varying vec3 vW; varying vec3 vL; void main(){ vL=position; vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader:GLN+`uniform float uK,uT; uniform vec3 uSun; varying vec3 vN; varying vec3 vW; varying vec3 vL;
      void main(){ vec3 N=normalize(vN); vec3 V=normalize(cameraPosition-vW); float ax=abs(normalize(vL).y); float lift=pow(ax,3.);
        float fr=pow(1.-max(dot(N,V),0.),1.6); float k=smoothstep(-0.2,0.5,dot(N,uSun));
        float n=fbm(vL.xz*9.+vec2(uT*0.3,0.))*0.5+fbm(vL.yx*14.-uT*0.2)*0.5;
        vec3 col=mix(vec3(0.05,0.32,0.62),vec3(0.35,0.75,1.0),lift)*(0.25+0.9*k)+vec3(0.8,0.95,1.)*pow(max(dot(reflect(-uSun,N),V),0.),40.)*k*0.8;
        col+=vec3(0.6,0.9,1.)*smoothstep(0.62,0.7,n)*lift*0.25;
        float a=(0.12+0.75*lift)*uK*(0.6+0.4*fr); gl_FragColor=vec4(col,a); }`}));
  sc.add(bulge);
  const moon=new THREE.Mesh(new THREE.SphereGeometry(0.273,96,64),new THREE.MeshStandardMaterial({map:moonTex(),roughness:0.95,metalness:0}));
  sc.add(moon); const dl=new THREE.DirectionalLight(0xffffff,2.6); dl.position.copy(SUN).multiplyScalar(10); sc.add(dl); sc.add(new THREE.AmbientLight(0x223040,0.25));
  const MD=new THREE.Vector3(-0.5,0.8,-0.35).normalize();
  // pull line Earth -> Moon
  const pull=new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,1,8),glowMat(0xff6a3d,0.9)); sc.add(pull);
  const W0=new THREE.Vector3();
  SCN[0]=function(lt){ U.uT.value=lt; BU.uT.value=lt;
    const a=easeIO(cl((lt-0.35)/2.6)); const d=lerp(5.6,2.8,a); moon.position.copy(MD).multiplyScalar(d); moon.rotation.y=0.6+lt*0.05;
    const pullK=Math.pow(5.6/d,3); // 1 -> 8
    const b=0.02*pullK; bulge.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),MD); bulge.scale.set(1-b*0.35,1+b,1-b*0.35); BU.uK.value=cl(lt/0.5);
    pull.position.copy(MD).multiplyScalar((1.08+d-0.3)/2); pull.scale.y=d-0.3-1.08; pull.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),MD); pull.material.opacity=0.25+0.1*pullK*win(lt,0.3,9);
    earth.rotation.y=-2.2+lt*0.06;
    const u=easeIO(cl(lt/4.2)); cam.position.set(lerp(1.0,0.7,u),lerp(0.5,0.7,u),lerp(6.2,7.0,u)); cam.lookAt(lerp(-0.6,-0.7,u),lerp(1.5,1.35,u),-0.3);
    P.c.render();
    let [x,y]=proj(moon.position,cam); setLab('l0_0',x+110,y-40,win(lt,0.3,9),'Moon',nf39.format(Math.round(384400/(5.6/d)/100)*100)+' km away');
    W0.copy(MD).multiplyScalar(1.0+b+0.02); [x,y]=proj(W0,cam); setLab('l0_1',x+60,y+30,win(lt,0.9,9),'Tidal pull','×'+pullK.toFixed(1));
    setLab('l0_2',90,1060,win(lt,1.6,9));
    caption(0,lt); };
})();

// ---------- S1 /what-if a mega tsunami hit New York: generic dusk skyline of our own design (inspired by a dense harbour city, no real
// landmark copied). A wave crest rises out of the bay and marches into the city; the water level behind it stays high and swallows the
// lower floors. Hypothetical: no height claimed. Caption = the real record (Lituya Bay 1958, 525 m run-up, NOAA JetStream).
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); ren.toneMappingExposure=1.0;
  sc.background=canvasTex(16,512,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#0b1430'); g.addColorStop(0.42,'#3a3f6e'); g.addColorStop(0.62,'#c8644a'); g.addColorStop(0.72,'#ffb36b'); g.addColorStop(0.78,'#4a3a4a'); g.addColorStop(1,'#141822'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  const cam=new THREE.PerspectiveCamera(46,1080/1920,0.1,400); const P=mkComposer(ren,sc,cam,{bloom:0.45,radius:0.5,th:0.9});
  const WU={uT:{value:0},uF:{value:30},uH:{value:0},uL:{value:0}};
  const WH=`uniform float uT,uF,uH,uL; float wh(vec2 p){ float z=p.y; float s=0.06*sin(p.x*1.3+uT*1.6)+0.05*sin(p.x*0.7-p.y*1.1+uT*1.2)+0.04*sin(p.y*2.1+uT*2.0);
    float dz=z-uF; float crest=uH*(dz>0.?exp(-dz*dz/9.):exp(-dz*dz/1.3)); float plat=uL*smoothstep(4.,-1.,dz)*smoothstep(-40.,-5.,dz);
    return s+max(crest,plat)+0.25*uH*sin(p.x*0.45+uT)*exp(-dz*dz/9.); }`;
  const wg=new THREE.PlaneGeometry(80,80,320,320); wg.rotateX(-Math.PI/2);
  const water=new THREE.Mesh(wg,new THREE.ShaderMaterial({uniforms:WU,toneMapped:false,
    vertexShader:GLN+WH+`varying vec3 vW; varying vec3 vNn; varying float vFo; void main(){ vec3 p=position; float h=wh(p.xz); float e=0.08; float dz=p.z-uF;
      vec3 N=normalize(vec3(-(wh(p.xz+vec2(e,0.))-h)/e,1.,-(wh(p.xz+vec2(0.,e))-h)/e)); vNn=N; vFo=smoothstep(1.2,-0.2,dz)*smoothstep(-3.5,-0.6,dz)*smoothstep(0.5*uH,0.9*uH,h)*step(0.5,uH)+0.35*smoothstep(-0.5,-6.,dz)*step(0.3,uL)*smoothstep(-14.,-4.,dz); p.y=h; vec4 w=modelMatrix*vec4(p,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
    fragmentShader:GLN+`varying vec3 vW; varying vec3 vNn; varying float vFo; uniform float uT; void main(){ vec3 N=normalize(vNn+vec3(fbm(vW.xz*2.+uT)-.5,0.,fbm(vW.zx*2.-uT)-.5)*0.25);
      vec3 V=normalize(cameraPosition-vW); float fr=0.04+0.96*pow(1.-max(dot(N,V),0.),5.);
      vec3 R=reflect(-V,N); float sky=clamp(R.y,0.,1.); vec3 skyC=mix(vec3(1.0,0.62,0.38),vec3(0.25,0.27,0.48),smoothstep(0.,0.5,sky));
      vec3 deep=vec3(0.02,0.07,0.10); vec3 col=mix(deep,skyC*0.55,fr);
      vec3 S=normalize(vec3(0.,0.12,-1.)); col+=vec3(1.,0.7,0.4)*pow(max(dot(R,S),0.),120.)*1.2;
      col+=vec3(0.05,0.18,0.2)*clamp(vW.y*0.4,0.,1.)*max(dot(N,V),0.);
      float foam=vFo*(smoothstep(0.4,0.7,fbm(vW.xz*2.5+vec2(0.,uT*2.)))*0.9+0.15); col=mix(col,vec3(0.78,0.74,0.72),clamp(foam,0.,0.9));
      gl_FragColor=vec4(col,1.); }`}));
  sc.add(water);
  // city: instanced towers with procedural lit windows
  const R=rnd(77); const N=420; const bg=new THREE.BoxGeometry(1,1,1); bg.translate(0,0.5,0);
  const bm=new THREE.ShaderMaterial({toneMapped:false,uniforms:{uT:{value:0}},
    vertexShader:'varying vec3 vW; varying vec3 vN; varying float vS; void main(){ vec4 w=modelMatrix*instanceMatrix*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix*instanceMatrix)*normal); vS=instanceMatrix[3].x*13.1+instanceMatrix[3].z*7.7; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader:GLN+`varying vec3 vW; varying vec3 vN; varying float vS; void main(){ vec3 N=normalize(vN); float fx=abs(N.x)>0.5?vW.z:vW.x;
      vec2 g=vec2(fx*5.,vW.y*4.); vec2 id=floor(g), f=fract(g); float win=step(0.18,f.x)*step(f.x,0.82)*step(0.2,f.y)*step(f.y,0.75);
      float on=step(0.74,h21(id+vec2(vS,vS*1.7)))*win*step(0.5,1.-abs(N.y));
      vec3 base=mix(vec3(0.07,0.075,0.10),vec3(0.16,0.15,0.18),clamp(vW.y*0.06,0.,1.)); base+=vec3(0.55,0.3,0.2)*max(dot(N,normalize(vec3(0.,0.15,-1.))),0.)*0.0+vec3(0.35,0.22,0.2)*max(-N.z,0.)*0.15;
      base+=vec3(0.18,0.2,0.3)*max(N.x,0.)*0.35; vec3 wc=mix(vec3(1.,0.78,0.45),vec3(0.75,0.85,1.),h21(id+3.1));
      vec3 col=base*0.38+wc*on*0.8; col*=0.65+0.35*smoothstep(-1.,3.,vW.y); gl_FragColor=vec4(col,1.); }`});
  const city=new THREE.InstancedMesh(bg,bm,N); const M=new THREE.Matrix4(); let k=0; const TOP=[];
  for(let i=0;i<N;i++){ const x=(R()-0.5)*30, z=-1.5-R()*16; const c=Math.exp(-Math.pow(x/7,2))*Math.exp(-Math.pow((z+7)/6,2));
    const h=0.8+R()*2.2+c*(5+R()*7); const w=0.7+R()*0.9, d=0.7+R()*0.9; M.compose(new THREE.Vector3(x,-0.2,z),new THREE.Quaternion(),new THREE.Vector3(w,h,d)); city.setMatrixAt(k++,M); TOP.push([x,h,z]); }
  sc.add(city);
  const spire=new THREE.Group(); const tw=new THREE.Mesh(bg,bm); tw.scale.set(1.3,12.5,1.3); spire.add(tw); const t2=new THREE.Mesh(bg,bm); t2.scale.set(0.8,2.2,0.8); t2.position.y=12.5; spire.add(t2);
  const ant=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.06,2.2,8),new THREE.MeshBasicMaterial({color:0x9aa0b0})); ant.position.y=15.8; spire.add(ant);
  const red=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,8),glowMat(0xff3020,1)); red.position.y=16.9; spire.add(red); spire.position.set(-1.5,-0.2,-8); sc.add(spire);
  // shore / quay
  const quay=new THREE.Mesh(new THREE.BoxGeometry(80,0.6,30),new THREE.MeshBasicMaterial({color:0x101218})); quay.position.set(0,-0.15,-15.6); sc.add(quay);
  const pW=new THREE.Vector3();
  SCN[1]=function(lt){ WU.uT.value=lt; bm.uniforms.uT.value=lt; red.material.opacity=0.4+0.6*(Math.sin(lt*6)>0?1:0.3);
    const a=cl(lt/4.4); WU.uF.value=lerp(18,-3,easeIO(cl((lt-0.1)/4.4))*0.85+a*0.15); WU.uH.value=lerp(0.2,4.6,easeIO(cl(lt/1.8))); WU.uL.value=lerp(0,2.4,easeIO(cl((lt-1.2)/2.4)));
    const u=easeIO(cl(lt/4.6)); cam.position.set(lerp(15,12,u),lerp(7.0,8.2,u),lerp(36,25,u)); cam.lookAt(lerp(0,-1,u),lerp(3.4,3.8,u),lerp(2,-6,u));
    P.c.render();
    pW.set(5,WU.uH.value+0.3,WU.uF.value.valueOf()); let [x,y]=proj(pW,cam); setLab('l1_0',x+60,y-20,win(lt,0.5,9));
    [x,y]=proj(new THREE.Vector3(-1.5,15,-8),cam); setLab('l1_1',x+50,y,win(lt,1.0,9));
    setLab('l1_2',90,1050,win(lt,1.8,9));
    caption(1,lt); };
})();

// ---------- S2 /scale the biggest typhoon versus Europe: real Earth texture seen over Europe; a code-drawn typhoon (log-spiral bands,
// eyewall, eye) centred over central Europe, its gale-force wind field 1,100 km in radius (Typhoon Tip, Oct 1979, NOAA AOML TC FAQ E5),
// i.e. ~2,200 km across = 0.1727 rad of Earth's surface. Counter-clockwise spin (northern hemisphere).
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020306); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.01,500); const P=mkComposer(ren,sc,cam,{bloom:0.5,radius:0.5,th:0.82});
  starField(sc,1500,58,300);
  const C=llVec(49,11,1).normalize(); const SUN=C.clone().add(new THREE.Vector3(0.5,0.35,0)).normalize();
  const E=earthReal(); const U={uDay:{value:E.day},uCl:{value:E.clouds},uT:{value:0},uSun:{value:SUN}};
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1,220,160),new THREE.ShaderMaterial({uniforms:U,vertexShader:EARTH_VS,toneMapped:false,
    fragmentShader:`uniform sampler2D uDay,uCl; uniform float uT; uniform vec3 uSun; varying vec2 vU; varying vec3 vN; varying vec3 vW;
      void main(){ vec3 d=texture2D(uDay,vU).rgb; float c=texture2D(uCl,vU).r; vec3 N=normalize(vN); float k=smoothstep(-0.2,0.5,dot(N,uSun));
        vec3 col=mix(d,vec3(1.),c*0.35)*(0.08+1.15*k); vec3 V=normalize(cameraPosition-vW); col+=vec3(0.35,0.6,1.)*pow(1.-max(dot(N,V),0.),3.)*0.7; gl_FragColor=vec4(col,1.); }`}));
  sc.add(earth);
  const T1=new THREE.Vector3(0,1,0).cross(C).normalize(), T2=C.clone().cross(T1).normalize();
  const TU={uT:{value:0},uC:{value:C},uA:{value:T1},uB:{value:T2},uR:{value:0.1727},uG:{value:0},uRing:{value:0},uSun:{value:SUN}};
  const storm=new THREE.Mesh(new THREE.SphereGeometry(1.006,240,180),new THREE.ShaderMaterial({uniforms:TU,transparent:true,depthWrite:false,toneMapped:false,
    vertexShader:'varying vec3 vP; varying vec3 vW; void main(){ vP=normalize(position); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader:GLN+`uniform float uT,uR,uG,uRing; uniform vec3 uC,uA,uB,uSun; varying vec3 vP; varying vec3 vW;
      void main(){ float ang=acos(clamp(dot(vP,uC),-1.,1.)); vec3 q=vP-uC*dot(vP,uC); float th=atan(dot(q,uB),dot(q,uA));
        float r=ang/uR; // 1 = gale-force radius
        float R0=max(uG,0.001); float rr=r/R0;
        float sp=th+log(max(rr,0.02))*2.6+uT*1.1; // log spiral, CCW
        float bands=0.5+0.5*sin(sp*3.);
        vec2 pp=vec2(cos(sp),sin(sp))*rr*4.; float n=fbm(pp+vec2(rr*3.,0.))*0.8+fbm(vec2(th*3.+uT*0.6,rr*12.))*0.4;
        float dens=smoothstep(0.35,0.95,bands*0.7+n*0.7)*smoothstep(1.15,0.45,rr);
        float wall=exp(-pow((rr-0.075)/0.04,2.))*1.2; dens=max(dens,smoothstep(0.55,0.,rr)*0.85); dens=max(dens,wall);
        dens*=smoothstep(0.035,0.06,rr); // the eye
        float k=smoothstep(-0.2,0.5,dot(normalize(vW),uSun)); vec3 col=vec3(0.96,0.97,1.)*(0.25+0.9*k)*(0.75+0.35*n);
        float a=clamp(dens,0.,1.)*0.92*step(0.0001,uG);
        float ring=exp(-pow((r-1.)/0.012,2.))*uRing; float tick=ring;
        col=mix(col,vec3(1.,0.42,0.24)*1.4,ring); a=max(a,ring*0.95);
        gl_FragColor=vec4(col,a); }`}));
  sc.add(storm);
  const W=new THREE.Vector3();
  SCN[2]=function(lt){ TU.uT.value=lt; TU.uG.value=easeIO(cl((lt+0.2)/1.6)); TU.uRing.value=easeIO(cl((lt-1.4)/0.5));
    const u=easeIO(cl(lt/4.0)); const d=lerp(1.75,3.2,u); const up=new THREE.Vector3(0,1,0);
    const dir=C.clone().add(T2.clone().multiplyScalar(lerp(-0.05,-0.12,u))).normalize(); cam.position.copy(dir).multiplyScalar(d); cam.up.copy(up); cam.lookAt(C.clone().multiplyScalar(0.92).add(T2.clone().multiplyScalar(lerp(0.0,0.06,u))));
    P.c.render();
    let [x,y]=proj(C,cam); setLab('l2_0',x+50,y-40,win(lt,0.3,9));
    W.copy(C).multiplyScalar(Math.cos(0.1727)).add(T1.clone().multiplyScalar(Math.sin(0.1727))).multiplyScalar(1.01); [x,y]=proj(W,cam); setLab('l2_1',x-20,y+70,win(lt,1.5,9));
    W.copy(llVec(41,-4,1.0)); [x,y]=proj(W,cam); setLab('l2_2',x-180,y+40,win(lt,2.0,9));
    caption(2,lt); };
})();
