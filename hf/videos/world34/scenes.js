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

// ---------- S0 /simulate Earth with two suns: real Earth texture lit by two suns (yellow G-type + smaller orange-red) that orbit each other
// behind it; each sun makes its own terminator, so the day side shows two coloured sunset bands; camera arcs slowly. (Kepler-16b = real.)
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020306); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(50,1080/1920,0.05,500); const P=mkComposer(ren,sc,cam,{bloom:0.8,radius:0.6,th:0.72});
  starField(sc,1800,44,300);
  const E=earthReal(); const U={uDay:{value:E.day},uCl:{value:E.clouds},uNi:{value:E.night},uS1:{value:new THREE.Vector3()},uS2:{value:new THREE.Vector3()},uT:{value:0},uRot:{value:0}};
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1,160,120),new THREE.ShaderMaterial({uniforms:U,vertexShader:EARTH_VS,toneMapped:false,
    fragmentShader:`uniform sampler2D uDay,uCl,uNi; uniform vec3 uS1,uS2; uniform float uT,uRot; varying vec2 vU; varying vec3 vN; varying vec3 vW;
      void main(){ vec2 uv=vU; vec3 d=texture2D(uDay,uv).rgb; float c=texture2D(uCl,uv+vec2(uT*0.004,0.)).r; float nl=texture2D(uNi,uv).r;
        vec3 N=normalize(vN); vec3 L1=normalize(uS1-vW), L2=normalize(uS2-vW); float a=dot(N,L1), b=dot(N,L2);
        float k1=smoothstep(-0.30,0.45,a), k2=smoothstep(-0.08,0.35,b);
        vec3 s1=vec3(1.0,1.0,1.0)*1.4, s2=vec3(1.0,0.5,0.28)*0.12;
        vec3 base=mix(d,vec3(1.),c*0.85);
        vec3 col=base*(s1*k1+s2*k2)+vec3(0.06,0.07,0.09)*base;
        // sunset bands: warm glow along each terminator
        vec3 Vv=normalize(cameraPosition-vW); float limb=pow(1.-max(dot(N,Vv),0.),2.5); col+=vec3(1.,0.35,0.12)*k2*limb*0.9;
        float dark=(1.-k1)*(1.-k2); col+=vec3(1.,0.72,0.4)*nl*nl*dark*(1.-c)*0.9;
        vec3 V=normalize(cameraPosition-vW); float fr=pow(1.-max(dot(N,V),0.),3.);
        col+=fr*(vec3(0.35,0.6,1.)*k1*0.9+vec3(1.,0.4,0.2)*k2*0.5);
        gl_FragColor=vec4(col,1.); }`}));
  sc.add(earth);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(1.045,64,48),new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,toneMapped:false,vertexShader:EARTH_VS,
    fragmentShader:`uniform vec3 uS1,uS2; varying vec3 vN; varying vec3 vW; void main(){ vec3 N=normalize(vN); vec3 V=normalize(cameraPosition-vW); float r=pow(max(0.,0.75-dot(-N,V)),2.5);
      float a=max(0.,dot(N,normalize(uS1-vW))+0.25), b=max(0.,dot(N,normalize(uS2-vW))+0.25); gl_FragColor=vec4((vec3(0.35,0.6,1.)*a+vec3(1.,0.4,0.15)*b)*r*1.6,1.); }`})); sc.add(atm);
  const s1=new THREE.Sprite(new THREE.SpriteMaterial({map:sunSprite('rgba(255,255,245,1)','rgba(255,225,150,.85)','rgba(255,170,60,.18)'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
  const s2=new THREE.Sprite(new THREE.SpriteMaterial({map:sunSprite('rgba(255,235,210,1)','rgba(255,120,50,.85)','rgba(255,60,20,.2)'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
  sc.add(s1); sc.add(s2);
  const C=new THREE.Vector3(-0.35,1.05,0.4); earth.position.set(0.15,-0.55,0); atm.position.copy(earth.position);
  SCN[0]=function(lt){ U.uT.value=lt; const ph=0.2+lt*0.85; const p1=C.clone().add(new THREE.Vector3(Math.cos(ph)*0.22,Math.sin(ph)*0.12,Math.sin(ph)*0.25)), p2=C.clone().add(new THREE.Vector3(-Math.cos(ph)*0.38,-Math.sin(ph)*0.22,-Math.sin(ph)*0.42));
    s1.position.copy(p1); s2.position.copy(p2); s1.scale.setScalar(0.62); s2.scale.setScalar(0.42); U.uS1.value.copy(p1); U.uS2.value.copy(p2);
    earth.rotation.y=-0.9+lt*0.07; atm.rotation.copy(earth.rotation);
    const u=cl(lt/3.6), ue=u*(2-u)*0.6+u*0.4; const az=0.0; const d=6.4-1.3*ue; cam.position.set(Math.sin(az)*d,-0.15+0.2*ue,Math.cos(az)*d); cam.lookAt(0.05,0.1-0.1*ue,-0.6);
    P.c.render();
    const [x1,y1]=proj(p1,cam), [x2,y2]=proj(p2,cam);
    setLab('l0_0',x1+70,y1-30,win(lt,0.3,9)); setLab('l0_1',x2+70,y2+40,win(lt,0.8,9)); setLab('l0_2',700,765,win(lt,1.5,9));
    caption(0,lt); };
})();

// ---------- S1 /what-if the oceans drained: real Earth over the Atlantic; the water level drops (shallow shelves dry first, the deep basins
// last) and reveals the seafloor: the Mid-Atlantic Ridge (part of the ~65,000 km mid-ocean ridge, NOAA) with its rift and transform faults.
// Depth is estimated from the distance to the coast (illustrative); ridge path approximate.
function llVec(lat,lon,r){ const u=(lon+180)/360, v=(lat+90)/180, ph=u*Math.PI*2, th=(1-v)*Math.PI; return new THREE.Vector3(-r*Math.cos(ph)*Math.sin(th),r*Math.cos(th),r*Math.sin(ph)*Math.sin(th)); }
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020306); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.02,500); const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.8});
  starField(sc,1500,93,300);
  const E=earthReal(); const U={uDay:{value:E.day},uCl:{value:E.clouds},uL:{value:0},uT:{value:0},uSun:{value:new THREE.Vector3(-0.6,0.5,1).normalize()}};
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1,220,160),new THREE.ShaderMaterial({uniforms:U,vertexShader:EARTH_VS,toneMapped:false,
    fragmentShader:GLN+`uniform sampler2D uDay,uCl; uniform float uL,uT; uniform vec3 uSun; varying vec2 vU; varying vec3 vN; varying vec3 vW;
      float isSea(vec2 uv){ vec3 c=texture2D(uDay,uv).rgb; float l=dot(c,vec3(.3,.5,.2)); return step(c.r*1.25+0.015,c.b)*step(c.g*1.0,c.b)*step(l,0.32); }
      float ridgeLon(float lat){ // approx. Mid-Atlantic Ridge axis (deg)
        if(lat>62.) return -20.; if(lat>52.) return mix(-29.,-20.,(lat-52.)/10.); if(lat>36.) return mix(-33.,-29.,(lat-36.)/16.); if(lat>22.) return mix(-45.,-33.,(lat-22.)/14.);
        if(lat>8.) return mix(-38.,-45.,(lat-8.)/14.); if(lat>-2.) return mix(-20.,-38.,(lat+2.)/10.); if(lat>-30.) return mix(-14.,-20.,(lat+30.)/28.); if(lat>-55.) return mix(-2.,-14.,(lat+55.)/25.); return -2.; }
      void main(){ vec2 uv=vU; vec3 d=texture2D(uDay,uv).rgb; float sea=isSea(uv);
        float lat=uv.y*180.-90., lon=uv.x*360.-180.;
        // distance to land: rings of samples
        float acc=0., wsum=0.; for(int r=1;r<=4;r++){ float rad=float(r)*0.0075; for(int k=0;k<10;k++){ float a=float(k)*0.6283+float(r);
          vec2 o=vec2(cos(a)*rad*0.5,sin(a)*rad); acc+=isSea(uv+o)*float(r); wsum+=float(r); } }
        float far=acc/wsum; // 1 = open ocean
        float dl=abs(lon-ridgeLon(lat))*cos(radians(lat)); float ridge=exp(-pow(dl/5.5,2.)); float rift=exp(-pow(dl/0.35,2.));
        float tf=smoothstep(0.92,1.,abs(sin(lat*0.9+fbm(vec2(lat*0.2,1.))*2.)))*exp(-pow(dl/9.,2.));
        float n=fbm(uv*vec2(260.,130.)), n2=fbm(uv*vec2(900.,450.));
        float depth=sea*clamp(far*1.15-0.05-0.45*ridge+0.12*(n-0.5),0.,0.96);
        // seafloor colour
        vec3 shelf=vec3(0.62,0.54,0.40), plain=vec3(0.27,0.24,0.22), rock=vec3(0.48,0.43,0.39);
        vec3 fl=mix(shelf,plain,smoothstep(0.05,0.55,depth)); fl=mix(fl,rock*(0.8+0.5*n2),ridge*0.85);
        fl*=0.8+0.35*n+0.08*(n2-0.5); fl=pow(fl,vec3(2.3))*0.75;
        // relief shading from noise gradient
        float e=0.0015; float hx=fbm((uv+vec2(e,0.))*vec2(260.,130.))-n, hy=fbm((uv+vec2(0.,e))*vec2(260.,130.))-n;
        vec3 N=normalize(vN); vec3 T=normalize(cross(vec3(0.,1.,0.),N)+1e-4); vec3 B=cross(N,T); vec3 Nb=normalize(N-(T*hx+B*hy)*(2.5+9.*ridge));
        float lit=clamp(dot(Nb,uSun),0.,1.); fl*=0.35+0.95*lit;
        float wet=sea*step(uL,depth+0.0001); // still under water
        vec3 water=d; vec3 dry=mix(fl,fl*0.7+vec3(0.,0.03,0.06),0.0);
        vec3 col=mix(d,dry,sea*(1.-wet));
        // fresh-wet sheen just above the water line + foam on the line
        float edge=sea*exp(-pow((depth-uL)/0.025,2.))*step(0.01,uL)*(1.-smoothstep(0.85,0.98,uL)); col+=vec3(0.75,0.85,0.95)*edge*0.35;
        col+=vec3(1.,0.42,0.12)*rift*sea*(1.-wet)*0.9+vec3(1.,0.3,0.08)*tf*0.05*sea*(1.-wet);
        float lit0=clamp(dot(N,uSun)*1.2+0.15,0.,1.); col*=mix(lit0,1.,sea*(1.-wet));
        float c=texture2D(uCl,uv+vec2(uT*0.002,0.)).r*(1.-smoothstep(0.0,0.35,uL)*0.9); col=mix(col,vec3(lit0),c*0.8);
        vec3 V=normalize(cameraPosition-vW); col+=vec3(0.35,0.6,1.)*pow(1.-max(dot(N,V),0.),3.)*lit0*0.8;
        gl_FragColor=vec4(col,1.); }`}));
  earth.rotation.order='XYZ'; earth.rotation.set(0.42,-1.10,0); sc.add(earth);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(1.03,64,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,toneMapped:false,
    vertexShader:'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'varying vec3 vN; void main(){ float i=pow(max(0.,0.72-dot(vN,vec3(0,0,1.))),3.); gl_FragColor=vec4(0.35,0.6,1.,1.)*i*2.2; }'})); sc.add(atm);
  const pS=new THREE.Object3D(), pR=new THREE.Object3D(), pA=new THREE.Object3D(); pS.position.copy(llVec(46,-8,1)); pR.position.copy(llVec(33,-38.5,1)); pA.position.copy(llVec(25,-58,1)); earth.add(pS); earth.add(pR); earth.add(pA);
  const W=new THREE.Vector3();
  SCN[1]=function(lt){ U.uT.value=lt; U.uL.value=1.02*easeIO(cl((lt-0.15)/2.4)); earth.rotation.y=-1.10+lt*0.035;
    const u=easeIO(cl(lt/3.6)); cam.position.set(0.15-0.1*u,-0.05+0.05*u,2.55+0.5*u); cam.lookAt(0.05,0.12,0); P.c.render();
    pS.getWorldPosition(W); let [x,y]=proj(W,cam); setLab('l1_0',x+40,y-30,win(lt,0.45,9));
    pR.getWorldPosition(W); [x,y]=proj(W,cam); setLab('l1_1',x+40,y,win(lt,1.3,9));
    pA.getWorldPosition(W); [x,y]=proj(W,cam); setLab('l1_2',x-330,y+90,win(lt,2.0,9));
    caption(1,lt); };
})();

// ---------- S2 /scale Mauna Kea versus Everest: a cut-away block, 1 unit = 1 km. Mauna Kea rises ~6,000 m from the sea floor to sea level and
// 4,205 m above it (10,211 m base to summit, USGS); Everest 8,848 m above sea level. The camera starts at sea level near Mauna Kea's summit,
// then the water clears and pulls back to show the hidden part; height bars grow with odometer numbers.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); ren.toneMappingExposure=1.0; bgGrad(sc,'#26313d','#07090c');
  const cam=new THREE.PerspectiveCamera(42,1080/1920,0.05,400); const P=mkComposer(ren,sc,cam,{bloom:0.4,radius:0.5,th:0.85});
  const MK=-3.4, EV=3.8, ZB=-3.5, ZF=1.2;
  const HG=`uniform float uT,uW,uSea,uE; const float MK=-3.4, EV=3.8;
  float hgt(vec2 q){ float x=q.x,z=q.y; float rm=length(vec2(x-MK,z-1.2)), re=length(vec2(x-EV,z-1.2));
    float sea=-6.0+0.15*sin(x*1.7)*cos(z*2.1); float mk=10.2*exp(-pow(rm/2.5,1.5));
    float slope=smoothstep(0.0,1.0,x)*6.0; float plat=smoothstep(1.0,2.6,x)*4.6; float ev=4.25*exp(-pow(re/0.85,1.2));
    float h=sea+mk; if(x>-0.2){ float L=-6.+(1.-uE)*(slope+plat+ev*smoothstep(1.5,2.6,x)+0.25*sin(x*3.1+z*2.3)*smoothstep(1.,2.6,x)); h=max(h,L); }
    h+=0.18*(fbm(q*1.3)-0.5)+0.08*(fbm(q*4.)-0.5); return h; }`;
  const U={uT:{value:0},uW:{value:1},uSea:{value:0},uE:{value:0}};
  // terrain top (x -14..14, z -3.5..1.2)
  const tg=new THREE.PlaneGeometry(28,4.7,420,90); tg.rotateX(-Math.PI/2); tg.translate(0,0,-1.15);
  const top=new THREE.Mesh(tg,new THREE.ShaderMaterial({uniforms:U,toneMapped:false,
    vertexShader:GLN+HG+`varying vec2 vQ; varying float vH; varying float vSh; void main(){ vec3 p=position; vec2 q=p.xz; vQ=q; float h=hgt(q); vH=h;
      float e=0.05; vec3 N=normalize(vec3(-(hgt(q+vec2(e,0.))-h)/e,1.,-(hgt(q+vec2(0.,e))-h)/e)); vSh=clamp(dot(N,normalize(vec3(-0.6,0.75,0.5))),0.,1.);
      p.y=h; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }`,
    fragmentShader:GLN+`varying vec2 vQ; varying float vH; varying float vSh; void main(){ float n=fbm(vQ*2.);
      vec3 lava=mix(vec3(0.34,0.24,0.19),vec3(0.52,0.38,0.28),n), rock=mix(vec3(0.36,0.33,0.30),vec3(0.5,0.47,0.43),n), snow=vec3(0.93,0.95,0.98);
      vec3 c=vQ.x<0.?lava:rock; c=mix(c,vec3(0.33,0.36,0.24),smoothstep(-0.3,0.4,vH)*smoothstep(2.6,1.4,vH)*step(-0.5,vQ.x)*0.6);
      c=mix(c,snow,smoothstep(vQ.x<0.?3.7:6.3,vQ.x<0.?4.1:7.2,vH+0.3*n)); c*=0.28+0.95*vSh; gl_FragColor=vec4(pow(c,vec3(1.6)),1.); }`}));
  sc.add(top);
  // front cut face z=ZF: strata below the surface, water between surface and sea level
  const fg=new THREE.PlaneGeometry(28,44); fg.translate(0,0,0);
  const front=new THREE.Mesh(fg,new THREE.ShaderMaterial({uniforms:U,toneMapped:false,transparent:true,
    vertexShader:'varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+HG+`varying vec2 vP; void main(){ vec2 p=vP; float h=hgt(vec2(p.x,1.2)); if(p.y<-21.) discard;
      if(p.y>h){ if(p.y<uSea){ float k=(uSea-p.y)/6.; vec3 w=mix(vec3(0.18,0.55,0.75),vec3(0.05,0.18,0.38),clamp(k,0.,1.)); float a=mix(0.95,0.30,uW);
          w+=vec3(0.4,0.7,0.9)*exp(-pow((p.y-uSea)*14.,2.))*0.6; gl_FragColor=vec4(pow(w,vec3(1.3)),a); return; } discard; }
      float b=fbm(vec2(p.x*0.4,p.y*2.5)); vec3 c=p.x<-0.2?mix(vec3(0.42,0.24,0.17),vec3(0.58,0.36,0.24),b):mix(vec3(0.42,0.36,0.30),vec3(0.55,0.49,0.42),b);
      c*=0.85+0.15*sin(p.y*9.+b*5.); c*=0.6+0.4*smoothstep(-8.,h,p.y); float rim=exp(-(h-p.y)*5.); c+=vec3(0.18)*rim; c=mix(c,vec3(1.0,0.86,0.7),exp(-(h-p.y)*28.)*0.9);
      gl_FragColor=vec4(pow(c*0.85,vec3(1.5)),1.); }`}));
  front.position.z=ZF; sc.add(front);
  // water body behind the cut (top surface at sea level, left part only)
  const wsurf=new THREE.Mesh(new THREE.PlaneGeometry(14.5,4.7),new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,toneMapped:false,
    vertexShader:'varying vec2 vU; void main(){ vU=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+'uniform float uT,uW; varying vec2 vU; void main(){ float n=fbm(vU*vec2(30.,10.)+vec2(uT*0.3,uT*0.2)); vec3 c=mix(vec3(0.06,0.30,0.48),vec3(0.35,0.62,0.78),n*0.7); gl_FragColor=vec4(pow(c,vec3(1.3)),mix(0.92,0.35,uW)); }'}));
  wsurf.rotation.x=-Math.PI/2; wsurf.position.set(-7.25+0.0,0,-1.15); sc.add(wsurf);
  // height bars
  const barM=new THREE.MeshBasicMaterial({color:0xff6a3d,toneMapped:false,depthTest:false,transparent:true}), barE=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false,depthTest:false,transparent:true});
  const bar1=new THREE.Mesh(new THREE.BoxGeometry(0.16,1,0.09),barM), bar2=new THREE.Mesh(new THREE.BoxGeometry(0.16,1,0.09),barE); sc.add(bar1); sc.add(bar2);
  const cap1=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.07,0.07),barM), cap2=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.07,0.07),barE), cap0=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.07,0.07),barM); sc.add(cap1); sc.add(cap2); sc.add(cap0); [bar1,bar2,cap0,cap1,cap2].forEach(m=>m.renderOrder=20);
  const seaLine=new THREE.Mesh(new THREE.BoxGeometry(28,0.035,0.035),new THREE.MeshBasicMaterial({color:0x9fd8ff,toneMapped:false,transparent:true,opacity:0.8})); seaLine.position.set(0,0,ZF+0.02); sc.add(seaLine);
  const B1X=MK, B2X=EV, BZ=ZF+0.08; const nf=new Intl.NumberFormat('en-US');
  SCN[2]=function(lt){ U.uT.value=lt; U.uW.value=smooth(0.6,1.4,lt); U.uE.value=easeIO(cl((lt-1.55)/0.7));
    const g1=easeIO(cl((lt-0.8)/1.3)), g2=easeIO(cl((lt-1.0)/1.1));
    const h1=10.211*g1, h2=8.848*g2;
    bar1.scale.y=Math.max(0.001,h1); bar1.position.set(B1X,-6+h1/2,BZ); cap1.position.set(B1X,-6+h1,BZ); cap0.position.set(B1X,-6,BZ); cap0.visible=cap1.visible=g1>0.001;
    const mv=easeIO(cl((lt-1.6)/0.75)); const bx2=lerp(B2X,MK+1.3,mv), by0=lerp(0,-6,mv); bar2.scale.y=Math.max(0.001,h2); bar2.position.set(bx2,by0+h2/2,BZ); cap2.position.set(bx2,by0+h2,BZ); cap2.visible=bar2.visible=g2>0.001; bar1.visible=g1>0.001;
    const u=easeIO(cl(lt/3.2)); const rc=easeIO(cl((lt-1.7)/0.9)); const cx=lerp(lerp(MK+1.2,0.9,u),MK+0.6,rc), cy=lerp(6.5,-1.5,u), cz=lerp(10.0,lerp(38.0,30.0,rc),u);
    cam.position.set(cx+0.4*Math.sin(lt*0.3),cy,cz); cam.lookAt(lerp(lerp(MK,0.9,u),MK+0.6,rc),lerp(2.4,-1.8,u),-1.2); P.c.render();
    let [x,y]=proj(new THREE.Vector3(B1X,-6+h1,BZ),cam); setLab('l2_0',x-290,y-30,win(lt,0.9,9),'Mauna Kea',nf.format(Math.round(h1*1000))+' m');
    [x,y]=proj(new THREE.Vector3(bx2,by0+h2,BZ),cam); setLab('l2_1',x+40,y+10,win(lt,1.5,9),'Everest',nf.format(Math.round(h2*1000))+' m');
    [x,y]=proj(new THREE.Vector3(lerp(2.0,bx2,mv),0,ZF),cam); setLab('l2_2',x+40,y+45,win(lt,0.4,9));
    caption(2,lt); };
})();
