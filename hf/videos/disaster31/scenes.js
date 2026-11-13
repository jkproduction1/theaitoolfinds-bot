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

// ================= disaster31 scenes (Claude Opus 5.5, drawn in code) =================
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
const LAYERS=`
vec3 strata(vec2 p){ float y=p.y+0.025*fbm(p*vec2(2.,6.)); float b=fbm(vec2(p.x*1.5,y*9.));
  vec3 c=vec3(0.42,0.33,0.26);
  c=mix(c,vec3(0.55,0.47,0.38),smoothstep(-0.25,-0.3,y));
  c=mix(c,vec3(0.36,0.31,0.29),smoothstep(-0.62,-0.67,y));
  c=mix(c,vec3(0.47,0.42,0.40),smoothstep(-1.0,-1.05,y));
  c=mix(c,vec3(0.30,0.27,0.27),smoothstep(-1.45,-1.5,y));
  c*=0.78+0.4*b; c*=0.92+0.08*sin(y*180.+fbm(p*5.)*6.); return c; }
`;

// ---------- S0 /explain-3d how a supervolcano erupts: block-diagram cutaway; magma chamber swells, the ground bulges, ring fractures open,
// the roof drops into the emptied chamber (caldera) and ash columns rise from the ring. Supereruption = >1,000 km3 at once (USGS).
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); ren.toneMappingExposure=1.0;
  bgGrad(sc,'#2e2a2a','#07080a');
  const cam=new THREE.PerspectiveCamera(54,1080/1920,0.05,200); const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.78});
  const U={uT:{value:0},uB:{value:0},uR:{value:0},uS:{value:0},uP:{value:0}};
  const HG=`uniform float uT,uB,uR,uS,uP; const float RC=0.62;
  float hgt(vec2 q){ float r=length(q); return uB*0.16*exp(-r*r/0.7) - uS*0.34*smoothstep(RC+0.025,RC-0.025,r) - uS*0.05*exp(-pow((r-RC-0.14)/0.11,2.)) + 0.035*(fbm(q*2.2)-0.5); }`;
  // front cross-section (z=1.2), x -2.2..2.2, y -2..0.4
  const fg=new THREE.PlaneGeometry(4.4,2.4); fg.translate(0,-0.8,0);
  const front=new THREE.Mesh(fg,new THREE.ShaderMaterial({uniforms:U,toneMapped:false,
    vertexShader:'varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+HG+LAYERS+`varying vec2 vP;
    void main(){ vec2 p=vP; float h=hgt(vec2(p.x,0.)); if(p.y>h) discard;
      float inRoof=smoothstep(RC+0.015,RC-0.015,abs(p.x));
      vec2 q=p; q.y+=uS*0.34*inRoof;              // the roof block drops into the chamber
      vec3 c=strata(q);
      // magma chamber (ellipse), swells with pressure, empties as the roof drops
      vec2 e=(p-vec2(0.,-1.2))/vec2(1.0+0.06*uP,0.36+0.05*uP-0.14*uS); float er=length(e);
      float n=fbm(p*5.+vec2(0.,-uT*0.25)), n2=fbm(p*11.+vec2(uT*0.4,0.));
      vec3 mag=mix(vec3(0.85,0.18,0.03),vec3(1.6,0.85,0.25),n*0.8+n2*0.4)*(0.7+0.6*uP);
      float inC=smoothstep(1.0,0.94,er);
      c=mix(c,mag,inC); c+=vec3(1.,0.35,0.08)*0.35*exp(-pow((er-1.)*7.,2.))*(0.4+uP);
      // feeder below
      float fd=smoothstep(0.08,0.0,abs(p.x+0.05*sin(p.y*3.))-0.03)*step(p.y,-1.45)*smoothstep(-1.85,-1.55,p.y); c=mix(c,mag*0.7,fd*0.8);
      // ring fractures: magma rising up the faults at x=+-RC
      float fl=exp(-pow((abs(p.x)-RC)*60.,2.)); float up=-0.8+uR*0.85; c+=vec3(1.4,0.55,0.12)*fl*step(p.y,up)*step(-1.0,p.y)*1.4;
      c+=vec3(1.,0.4,0.1)*0.25*exp(-pow((abs(p.x)-RC)*14.,2.))*uR*step(p.y,up)*step(-1.0,p.y);
      c*=0.8+0.2*smoothstep(-2.,0.,p.y); c*=0.85;
      gl_FragColor=vec4(pow(c,vec3(1.9)),1.); }`}));
  front.position.set(0,0,1.2); sc.add(front);
  // right side face (x=2.2)
  const sg=new THREE.PlaneGeometry(2.4,2.0); sg.translate(0,-1.0,0);
  const side=new THREE.Mesh(sg,new THREE.ShaderMaterial({uniforms:U,toneMapped:false,
    vertexShader:'varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+LAYERS+'varying vec2 vP; void main(){ gl_FragColor=vec4(pow(strata(vP)*0.5,vec3(1.9)),1.); }'}));
  side.rotation.y=Math.PI/2; side.position.set(2.2,0,0); sc.add(side);
  // top terrain
  const tg=new THREE.PlaneGeometry(4.4,2.4,260,150); tg.rotateX(-Math.PI/2);
  const top=new THREE.Mesh(tg,new THREE.ShaderMaterial({uniforms:U,toneMapped:false,
    vertexShader:GLN+HG+`varying vec2 vQ; varying float vSh; varying float vH; varying float vSt; void main(){ vec3 p=position; vec2 q=vec2(p.x,p.z-1.2); vQ=q; float h=hgt(q); vH=h;
      float e=0.02; float hx=hgt(q+vec2(e,0.))-h, hz=hgt(q+vec2(0.,e))-h; vec3 N=normalize(vec3(-hx/e,1.,-hz/e)); vSh=clamp(dot(N,normalize(vec3(-0.5,0.8,0.4))),0.,1.); vSt=1.-N.y;
      p.y=h; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }`,
    fragmentShader:GLN+HG+LAYERS+`varying vec2 vQ; varying float vSh; varying float vH; varying float vSt; void main(){ float r=length(vQ); float n=fbm(vQ*4.);
      vec3 c=mix(vec3(0.20,0.22,0.15),vec3(0.36,0.32,0.24),n); c*=0.35+0.85*vSh;
      float isWall=smoothstep(0.25,0.6,vSt)*step(0.001,uS); c=mix(c,strata(vec2(atan(vQ.y,vQ.x)*0.8,vH))*(0.55+0.45*vSh),isWall);
      float ang=atan(vQ.y,vQ.x); float jag=0.02*sin(ang*23.)+0.015*sin(ang*51.);
      float inC=smoothstep(RC+0.03,RC-0.03,r)*uS*(1.-isWall); c=mix(c,c*0.85,inC);
      gl_FragColor=vec4(pow(c,vec3(1.9)),1.); }`}));
  sc.add(top);
  // ash: columns from the ring + the caldera
  const ash=cloudPoints(1600,puffTex(5),900,THREE.NormalBlending); sc.add(ash);
  const R=rnd(17), A=[]; for(let i=0;i<1600;i++){ const ring=R()<0.8; const a=Math.PI+R()*Math.PI; const rr=ring?0.62:R()*0.5;
    A.push({x:Math.cos(a)*rr,z:1.2+Math.sin(a)*rr*0.95,tb:(ring?1.4:1.9)+R()*2.6,sp:0.75+R()*0.9,dr:(R()-.5)*0.6,s:0.6+R()*0.8,g:R()}); }
  const aChamber=new THREE.Object3D(); aChamber.position.set(0.5,-1.2,1.2); sc.add(aChamber);
  const aRing=new THREE.Object3D(); aRing.position.set(-0.62,-0.5,1.2); sc.add(aRing);
  const aCal=new THREE.Object3D(); aCal.position.set(0.2,-0.3,0.75); sc.add(aCal);
  SCN[0]=function(lt){ U.uT.value=lt; const P0=smooth(0.1,1.0,lt); U.uP.value=P0*(1-0.6*smooth(1.4,2.5,lt)); U.uB.value=P0*(1-smooth(1.4,2.2,lt));
    U.uR.value=smooth(0.7,1.35,lt); U.uS.value=easeIO(cl((lt-1.4)/1.1));
    const u=easeIO(cl(lt/4.1)); const az=0.40-0.12*u; const d=4.0-0.3*u+0.8*smooth(1.5,4.0,lt);
    cam.position.set(Math.sin(az)*d,0.3+0.5*smooth(1.5,4.0,lt),1.0+Math.cos(az)*d); cam.lookAt(0,-1.3+0.3*smooth(1.5,4.0,lt),0.8);
    const pos=ash.geometry.attributes.position.array, col=ash.geometry.attributes.color.array, sz=ash.geometry.attributes.sz.array, al=ash.geometry.attributes.al.array;
    for(let i=0;i<A.length;i++){ const o=A[i], age=lt-o.tb; if(age<0){ al[i]=0; continue; }
      const y=0.05+age*o.sp*(1.3+age*0.25); const spread=1+age*0.55; pos[i*3]=o.x*spread+o.dr*age*0.5; pos[i*3+1]=y; pos[i*3+2]=1.2+(o.z-1.2)*spread;
      const hot=Math.exp(-y*1.8); col[i*3]=0.20+0.8*hot*(0.5+o.g); col[i*3+1]=0.19+0.25*hot; col[i*3+2]=0.19+0.04*hot;
      sz[i]=o.s*(0.35+age*0.7); al[i]=Math.min(1,age*3)*0.85*(1-cl((y-4.2)/1.5)); }
    ['position','color','sz','al'].forEach(k=>ash.geometry.attributes[k].needsUpdate=true);
    P.c.render();
    labAt('l0_0',aChamber.position,cam,16,0,win(lt,0.25,9),1);
    labAt('l0_1',aRing.position,cam,16,0,win(lt,0.8,9),1);
    labAt('l0_2',aCal.position,cam,16,0,win(lt,1.7,9),1);
    caption(0,lt); };
})();

// ---------- S1 /x-ray a tornado: x-ray look; the funnel (spiral streaks) under the rotating updraft (mesocyclone) with arrows, warm moist inflow
// spiralling in along the ground, debris cloud at the base. DOW radar ~318 mph in the 1999 Bridge Creek-Moore tornado (NWS Norman).
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); ren.toneMappingExposure=1.0;
  bgGrad(sc,'#1a2430','#05070a');
  const cam=new THREE.PerspectiveCamera(52,1080/1920,0.05,200); const P=mkComposer(ren,sc,cam,{bloom:0.7,radius:0.55,th:0.6});
  const U={uT:{value:0}};
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(14,14),new THREE.ShaderMaterial({transparent:true,depthWrite:false,toneMapped:false,uniforms:U,
    vertexShader:'varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+'uniform float uT; varying vec2 vP; void main(){ vec2 g=abs(fract(vP*2.)-.5); float l=smoothstep(0.03,0.0,0.5-max(g.x,g.y)); float r=length(vP); float f=smoothstep(6.,1.,r);'+
      'float n=fbm(vP*0.8); gl_FragColor=vec4(vec3(0.35,0.75,1.)*(l*0.35+0.05*n),(l*0.5+0.25*n)*f); }'}));
  gr.rotation.x=-Math.PI/2; sc.add(gr);
  const prof=[]; for(let i=0;i<=60;i++){ const y=i/60*3.6; const r=0.10+0.05*Math.sin(y*2.)+0.62*Math.pow(y/3.6,2.4)+0.25*Math.pow(y/3.6,7.); prof.push(new THREE.Vector2(r,y)); }
  const fm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false,uniforms:U,
    vertexShader:'varying vec3 vN; varying vec3 vV; varying vec2 vU; varying float vY; uniform float uT; void main(){ vU=uv; vec3 p=position; vY=p.y; float w=0.07*sin(p.y*1.7-uT*1.3)*(1.-p.y/4.); p.x+=w; p.z+=0.05*cos(p.y*1.3-uT); vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(p,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
    fragmentShader:GLN+'uniform float uT; varying vec3 vN; varying vec3 vV; varying vec2 vU; varying float vY; void main(){ float fr=pow(1.-abs(dot(vN,vV)),1.8);'+
      'float s=fract(vU.x*4.+vY*0.9-uT*1.9); float st=smoothstep(0.0,0.08,s)*smoothstep(0.35,0.12,s); float n=fbm(vec2(vU.x*12.-uT*3.,vY*3.));'+
      'vec3 c=vec3(0.45,0.8,1.0)*(fr*0.9+st*0.35*(0.5+n))+vec3(0.9,0.97,1.)*pow(fr,4.)*0.6; c*=smoothstep(0.,0.25,vY)*0.9+0.1; gl_FragColor=vec4(c*0.85,1.); }'});
  const fun=new THREE.Mesh(new THREE.LatheGeometry(prof,96),fm); sc.add(fun);
  
  const meso=new THREE.Group(); meso.position.y=3.85; sc.add(meso);
  const md=new THREE.Mesh(new THREE.CylinderGeometry(2.3,1.3,0.55,96,1,true),fm); meso.add(md);
  const lid=new THREE.Mesh(new THREE.CircleGeometry(2.3,96),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false,uniforms:U,
    vertexShader:'varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+'uniform float uT; varying vec2 vP; void main(){ float r=length(vP)/2.3; float a=atan(vP.y,vP.x); float s=fbm(vec2(a*3.+r*6.-uT*1.2,r*5.)); gl_FragColor=vec4(vec3(0.4,0.75,1.)*s*0.22*(1.-r*0.6),1.); }'}));
  lid.rotation.x=-Math.PI/2; lid.position.y=0.27; meso.add(lid);
  const arrM=new THREE.MeshBasicMaterial({color:0xff6a3d,toneMapped:false}); const AR=new THREE.Group(); meso.add(AR);
  [0,Math.PI].forEach(o=>{ const pts=[]; for(let i=0;i<=40;i++){ const a=o+i/40*1.9; pts.push(new THREE.Vector3(Math.cos(a)*1.85,0.05,Math.sin(a)*1.85)); }
    AR.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,0.035,8,false),arrM));
    const a=o+1.9; const cone=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.26,16),arrM); cone.position.set(Math.cos(a)*1.85,0.05,Math.sin(a)*1.85);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(-Math.sin(a),0,Math.cos(a))); AR.add(cone); });
  const inM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,uniforms:U,
    vertexShader:'varying vec2 vU; void main(){ vU=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'uniform float uT; varying vec2 vU; void main(){ float d=fract(vU.x*9.-uT*1.6); float a=smoothstep(0.,0.15,d)*smoothstep(0.6,0.3,d); gl_FragColor=vec4(vec3(1.,0.55,0.3)*a*smoothstep(0.,0.15,vU.x)*0.9,1.); }'});
  const IN=new THREE.Group(); sc.add(IN);
  for(let k=0;k<5;k++){ const pts=[]; for(let i=0;i<=80;i++){ const f=i/80; const r=3.2-2.9*f; const a=k/5*Math.PI*2-f*3.2; pts.push(new THREE.Vector3(Math.cos(a)*r,0.08+0.35*f*f,Math.sin(a)*r)); }
    IN.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),120,0.022,6,false),inM)); }
  const deb=cloudPoints(900,softDot(),220,THREE.AdditiveBlending); sc.add(deb);
  const R=rnd(29), D=[]; for(let i=0;i<900;i++){ const up=i<300; D.push({up,a:R()*6.283,r:up?0.05+R()*0.12:0.25+R()*0.75,y:up?R()*3.6:R()*R()*0.9,w:up?2.2+R():1.6+R()*1.4,s:0.5+R()*1.2,c:R()}); }
  const aUp=new THREE.Object3D(); aUp.position.set(-0.75,3.0,0.4); sc.add(aUp);
  const aIn=new THREE.Object3D(); sc.add(aIn);
  const aDb=new THREE.Object3D(); aDb.position.set(0.75,0.3,0.6); sc.add(aDb);
  { const k=3, f=0.35, rr=3.2-2.9*f, a=k/5*Math.PI*2-f*3.2; aIn.position.set(Math.cos(a)*rr,0.08+0.35*f*f,Math.sin(a)*rr); }
  SCN[1]=function(lt){ U.uT.value=lt; AR.rotation.y=-lt*0.9; md.rotation.y=-lt*0.6; fun.rotation.y=-lt*1.2;
    const pos=deb.geometry.attributes.position.array, col=deb.geometry.attributes.color.array, sz=deb.geometry.attributes.sz.array, al=deb.geometry.attributes.al.array;
    for(let i=0;i<D.length;i++){ const o=D[i]; const a=o.a-lt*o.w*(o.up?1.4:1.); let y=o.y, r=o.r;
      if(o.up){ y=(o.y+lt*0.9)%3.6; r=o.r+0.62*Math.pow(y/3.6,2.4); } else { y=o.y+0.08*Math.sin(lt*3+o.a); }
      pos[i*3]=Math.cos(a)*r; pos[i*3+1]=y; pos[i*3+2]=Math.sin(a)*r;
      if(o.up){ col[i*3]=1.; col[i*3+1]=0.55; col[i*3+2]=0.3; sz[i]=o.s*0.5; al[i]=0.45; } else { const g=0.45+0.35*o.c; col[i*3]=g*1.1; col[i*3+1]=g; col[i*3+2]=g*0.85; sz[i]=o.s*0.7; al[i]=0.16; } }
    ['position','color','sz','al'].forEach(k=>deb.geometry.attributes[k].needsUpdate=true);
    const u=easeIO(cl(lt/2.8)); const az=0.25+0.25*u; const d=6.2-0.4*u;
    cam.position.set(Math.sin(az)*d,0.9+0.2*u,Math.cos(az)*d); cam.lookAt(0,0.9-0.05*u,0);
    P.c.render();
    labAt('l1_0',aUp.position,cam,30,0,win(lt,0.25,9),-1);
    labAt('l1_1',aIn.position,cam,16,0,win(lt,0.7,9),1);
    labAt('l1_2',aDb.position,cam,16,-40,win(lt,1.2,9),1);
    caption(1,lt); };
})();

// ---------- S2 /time-lapse a sinkhole opening: cross-section under a road; groundwater dissolves limestone (years, sped up), a cavity grows under
// the clay cover that still bridges it, then the cover collapses into it and the road drops (USGS: cover-collapse, "over a period of hours").
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); ren.toneMappingExposure=1.0;
  bgGrad(sc,'#2a2f36','#08090b');
  const cam=new THREE.PerspectiveCamera(55,1080/1920,0.05,200); const P=mkComposer(ren,sc,cam,{bloom:0.35,radius:0.4,th:0.9});
  const U={uT:{value:0},uG:{value:0},uC:{value:0}};
  const CAV=`uniform float uT,uG,uC; const float RH=0.55;
  float cav(vec2 p){ vec2 c=vec2(0.,-0.95); vec2 d=(p-c)/vec2(1.25,0.9); float n=fbm(p*4.+3.)-0.5; return length(d)+0.25*n - (0.08+0.52*uG); }`;
  const fg=new THREE.PlaneGeometry(4.4,2.2); fg.translate(0,-1.1,0);
  const front=new THREE.Mesh(fg,new THREE.ShaderMaterial({uniforms:U,toneMapped:false,
    vertexShader:'varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+CAV+`varying vec2 vP;
    vec3 ground(vec2 p){ float y=p.y+0.02*fbm(p*vec2(3.,8.));
      vec3 c;
      if(y>-0.07) c=vec3(0.16,0.16,0.17)*(0.9+0.2*fbm(p*30.));
      else if(y>-0.18) c=vec3(0.45,0.42,0.38)*(0.8+0.3*fbm(p*20.));
      else if(y>-0.62) c=mix(vec3(0.46,0.30,0.18),vec3(0.58,0.40,0.24),fbm(p*vec2(3.,12.)));
      else { float m=fbm(p*vec2(3.,5.)), m2=fbm(p*14.+7.); c=mix(vec3(0.62,0.59,0.52),vec3(0.67,0.64,0.57),m)*(0.95+0.08*m2);
        float yb=y+0.06*fbm(vec2(p.x*1.3,y*2.)); float bed=smoothstep(0.012,0.0,abs(fract(yb*2.6)-.5)-0.488)*step(0.35,fbm(vec2(p.x*2.,yb*3.))); c*=1.-0.3*bed;
        }
      return c; }
    void main(){ vec2 p=vP;
      vec3 c=ground(p);
      float cv=cav(p);
      float lime=step(p.y,-0.62);
      float wt=step(p.y,-0.85)*lime; float fl=smoothstep(0.6,0.9,fbm(vec2(p.x*3.-uT*0.9,p.y*12.)));
      c=mix(c,c*vec3(0.75,0.86,1.05),wt*0.55); c+=vec3(0.15,0.45,0.9)*fl*wt*0.5;
      float inV=smoothstep(0.02,-0.02,cv)*lime;
      vec3 vc=vec3(0.05,0.05,0.06)+vec3(0.02,0.05,0.09)*fbm(p*6.); vc=mix(vc,vec3(0.08,0.28,0.55)*(0.7+0.4*fbm(p*8.+uT)),step(p.y,-1.3));
      float rb=fbm(p*18.); vec3 rub=mix(vec3(0.40,0.27,0.16),vec3(0.55,0.39,0.24),rb)*(0.7+0.4*fbm(p*40.)); rub=mix(rub,vec3(0.2,0.2,0.21),smoothstep(0.7,0.8,fbm(p*9.+2.))*0.8);
      vc=mix(vc,rub,smoothstep(0.15,0.75,uC)*(1.-0.6*step(p.y,-1.3)*(1.-smoothstep(0.6,1.,uC))));
      c=mix(c,vc,inV); c=mix(c,c*0.6,smoothstep(0.06,0.0,cv)*(1.-inV)*lime);
      // the throat: one rough-edged break from the cavity roof up to the road, filled with slumped clay + broken road, open pit on top
      float jit=0.07*(fbm(vec2(p.y*7.,sign(p.x)*3.+1.))-0.5);
      float w=RH*(0.72+0.28*smoothstep(-0.64,0.,p.y))+jit;
      float inT=smoothstep(0.012,-0.012,abs(p.x)-w)*step(-0.68,p.y);
      float front_=-0.68+0.72*smoothstep(0.,0.6,uC);
      float br=inT*smoothstep(front_+0.01,front_-0.01,p.y);
      float dp=0.30*smoothstep(0.5,1.,uC);
      vec3 pitc=mix(vec3(0.46,0.31,0.18),vec3(0.20,0.13,0.08),smoothstep(0.,-dp,p.y))*(0.6+0.55*fbm(p*vec2(16.,9.)));
      pitc*=0.85+0.25*smoothstep(0.55,0.75,fbm(p*vec2(30.,12.)));
      vec3 cc=mix(rub,pitc,step(-dp,p.y));
      float edge=smoothstep(0.035,0.,w-abs(p.x)); cc*=1.-0.4*edge;
      c=mix(c,cc,br);
      c*=0.85;
      gl_FragColor=vec4(pow(c,vec3(1.8)),1.); }`}));
  front.position.set(0,0,1.2); sc.add(front);
  const sg=new THREE.PlaneGeometry(2.4,2.2); sg.translate(0,-1.1,0);
  const side=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({color:0x3b3833})); side.rotation.y=Math.PI/2; side.position.set(2.2,0,0); sc.add(side);
  const roadTex=canvasTex(1024,560,(c,w,h)=>{ c.fillStyle='#4a4c50'; c.fillRect(0,0,w,h); const r=rnd(4); for(let i=0;i<9000;i++){ const v=r()<.5?0:255; c.fillStyle=`rgba(${v},${v},${v},.05)`; c.fillRect(r()*w,r()*h,2,2); }
    c.fillStyle='#e8c84a'; for(let x=0;x<w;x+=90){ c.fillRect(x,h*0.5-7,55,14); } c.fillStyle='#e8e8e8'; c.fillRect(0,h*0.12,w,10); c.fillRect(0,h*0.88-10,w,10);
    c.fillStyle='#5b6a3c'; c.fillRect(0,0,w,h*0.07); c.fillRect(0,h*0.93,w,h*0.07); });
  const topM=new THREE.ShaderMaterial({uniforms:Object.assign({map:{value:roadTex}},U),toneMapped:false,
    vertexShader:'varying vec2 vU; varying vec2 vQ; void main(){ vU=uv; vQ=vec2(position.x,-position.y); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform sampler2D map; uniform float uT,uG,uC; varying vec2 vU; varying vec2 vQ; void main(){ vec2 q=vQ-vec2(0.,1.2); float r=length(q);
      float rh=0.55*smoothstep(0.5,0.8,uC)+0.04*(fbm(q*6.)-.5); if(uC>0.5 && r<rh) discard;
      vec3 c=texture2D(map,vU).rgb*0.85; float crack=smoothstep(0.012,0.,abs(r-0.6-0.04*fbm(q*9.)))*smoothstep(0.5,0.9,uG)*(1.-step(0.001,uC));
      c*=1.-0.7*crack; c*=1.-0.3*smoothstep(rh+0.2,rh,r)*smoothstep(0.5,0.6,uC); gl_FragColor=vec4(pow(c,vec3(1.8)),1.); }`});
  const top=new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.4),topM); top.rotation.x=-Math.PI/2; sc.add(top);
  const rough=canvasTex(512,256,(c,w,h)=>{ const r=rnd(12); c.fillStyle='#6b4a2e'; c.fillRect(0,0,w,h); for(let i=0;i<1400;i++){ const v=60+r()*90|0; c.fillStyle=`rgba(${v+30},${v},${v-30},.35)`; c.fillRect(r()*w,r()*h,3+r()*14,2+r()*8); } const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.6)'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  const pit=new THREE.Mesh(new THREE.CylinderGeometry(0.56,0.42,0.32,64,1,true,Math.PI/2,Math.PI),new THREE.MeshStandardMaterial({map:rough,roughness:1,side:THREE.BackSide}));
  pit.position.set(0,-0.16,1.2); sc.add(pit);
  const pitF=new THREE.Mesh(new THREE.CircleGeometry(0.43,48,Math.PI,Math.PI),new THREE.MeshStandardMaterial({map:rough,roughness:1,color:0x9a8a7a})); pitF.rotation.x=-Math.PI/2; pitF.position.set(0,-0.31,1.2); sc.add(pitF);
  const plug=new THREE.Mesh(new THREE.CircleGeometry(0.5,64,Math.PI,Math.PI),new THREE.MeshStandardMaterial({map:canvasTex(256,256,(c,w,h)=>{ c.fillStyle='#45474b'; c.fillRect(0,0,w,h); c.fillStyle='#e8c84a'; c.fillRect(w*0.2,h*0.47,w*0.3,h*0.06); }),roughness:.9,side:THREE.DoubleSide}));
  plug.rotation.x=-Math.PI/2; plug.position.set(0,0.001,1.2); sc.add(plug);
  sc.add(new THREE.HemisphereLight(0xcfd8e6,0x2a2018,1.2)); const dl=new THREE.DirectionalLight(0xffffff,1.6); dl.position.set(-2,4,3); sc.add(dl);
  const dust=cloudPoints(500,puffTex(9),700,THREE.NormalBlending); sc.add(dust);
  const R=rnd(41), DU=[]; for(let i=0;i<500;i++){ const a=Math.PI+R()*Math.PI, rr=0.3+R()*0.35; DU.push({x:Math.cos(a)*rr,z:1.2+Math.sin(a)*rr,tb:2.0+R()*0.8,sp:0.12+R()*0.25,s:0.4+R()*0.6}); }
  const hud=document.createElement('div'); hud.className='lb'; hud.style.cssText='left:70px;top:520px;opacity:0;background:rgba(255,75,31,.92);'; hud.innerHTML='<b style="font-size:32px">years, sped up</b>'; document.getElementById('st2').appendChild(hud);
  const aW=new THREE.Object3D(); aW.position.set(1.3,-1.4,1.2); sc.add(aW);
  const aCv=new THREE.Object3D(); aCv.position.set(-0.45,-0.9,1.2); sc.add(aCv);
  const aR=new THREE.Object3D(); aR.position.set(0.45,-0.05,1.2); sc.add(aR);
  let lastHud='';
  SCN[2]=function(lt){ U.uT.value=lt; U.uG.value=0.12+0.88*smooth(0.0,1.4,lt); const C=easeIO(cl((lt-1.45)/1.0)); U.uC.value=C;
    plug.visible=false; pit.visible=C>0.5; pitF.visible=C>0.5;
    const pos=dust.geometry.attributes.position.array, col=dust.geometry.attributes.color.array, sz=dust.geometry.attributes.sz.array, al=dust.geometry.attributes.al.array;
    for(let i=0;i<DU.length;i++){ const o=DU[i], age=lt-o.tb; if(age<0){ al[i]=0; continue; } pos[i*3]=o.x*(1+age*0.4); pos[i*3+1]=age*o.sp; pos[i*3+2]=1.2+(o.z-1.2)*(1+age*0.4);
      col[i*3]=0.62; col[i*3+1]=0.52; col[i*3+2]=0.42; sz[i]=o.s*(0.3+age*0.45); al[i]=Math.min(1,age*4)*0.45*(1-cl(age/1.6)); }
    ['position','color','sz','al'].forEach(k=>dust.geometry.attributes[k].needsUpdate=true);
    const u=easeIO(cl(lt/3.4)); const az=0.40-0.14*u; const d=3.6-0.35*u;
    cam.position.set(Math.sin(az)*d,0.3+0.3*u,1.2+Math.cos(az)*d); cam.lookAt(0.05,-1.15+0.2*smooth(1.4,2.6,lt),1.0);
    P.c.render();
    const ht=lt<1.45?'⏩ Years, sped up':'⚠ Then: sudden collapse'; if(ht!==lastHud){ lastHud=ht; hud.innerHTML='<b style="font-size:32px">'+ht+'</b>'; }
    hud.style.opacity=win(lt,0.1,9);
    labAt('l2_0',aW.position,cam,30,0,win(lt,0.3,9),1);
    labAt('l2_1',aCv.position,cam,16,0,win(lt,0.7,1.45),1);
    labAt('l2_2',aR.position,cam,16,-20,win(lt,1.9,9),1);
    caption(2,lt); };
})();
