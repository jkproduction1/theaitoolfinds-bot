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

// ---------- S0 /physics-sim into a black hole: shadow + photon ring + Doppler-bright accretion disk + lensed far side of the disk;
// an astronaut falls in and is stretched along the line to the hole (spaghettification, true for a stellar-mass black hole)
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020205); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.05,400); const P=mkComposer(ren,sc,cam,{bloom:0.5,radius:0.55,th:0.8});
  starField(sc,1800,11,300);
  const dv='varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }';
  const df=`uniform float uT,uR0,uR1,uOp,uBill; uniform vec2 uCam; varying vec2 vP;
    float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float n(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
    void main(){ float r=length(vP); float t=clamp((r-uR0)/(uR1-uR0),0.,1.); float a=atan(vP.y,vP.x);
      float sw=a*3.+log(r)*9.-uT*2.4/r; float s=0.55+0.45*n(vec2(sw*1.3,r*7.))*0.8+0.25*sin(sw*2.+n(vec2(a*6.,r*3.))*4.);
      vec2 vel=normalize(vec2(-vP.y,vP.x)); float D=uBill>0.5?1.+0.55*(vP.x/r):1.+0.85*dot(vel,uCam); D=max(D,0.12);
      vec3 hot=vec3(1.,.9,.75)*1.25, mid=vec3(1.,.48,.14)*.8, cold=vec3(.5,.1,.03)*.45;
      vec3 c=mix(hot,mid,smoothstep(0.,.35,t)); c=mix(c,cold,smoothstep(.35,1.,t));
      float al=pow(1.-t,1.6)*smoothstep(0.,.04,t+0.02)*s*D*uOp; gl_FragColor=vec4(c*al,1.); }`;
  const mkDisk=(r0,r1,bill,op)=>new THREE.Mesh(new THREE.RingGeometry(r0,r1,256,24),new THREE.ShaderMaterial({uniforms:{uT:{value:0},uR0:{value:r0},uR1:{value:r1},uOp:{value:op},uBill:{value:bill},uCam:{value:new THREE.Vector2(0,1)}},
    vertexShader:dv,fragmentShader:df,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false}));
  const lens=mkDisk(1.12,2.3,1,0.45); sc.add(lens);
  const hole=new THREE.Mesh(new THREE.SphereGeometry(1,64,48),new THREE.MeshBasicMaterial({color:0x000000})); sc.add(hole);
  const disk=mkDisk(1.45,5.4,0,1.0); disk.rotation.x=-Math.PI/2+0.06; sc.add(disk);
  const pr=new THREE.Mesh(new THREE.RingGeometry(1.0,1.055,200),glowMat(0xffe2b0,0.9)); sc.add(pr);
  sc.add(new THREE.AmbientLight(0x8090b0,0.35)); const pl=new THREE.PointLight(0xffb070,3.2,0,1.2); pl.position.set(0,0.3,0); sc.add(pl);
  const dl=new THREE.DirectionalLight(0x9fb8ff,0.7); dl.position.set(-3,4,6); sc.add(dl);
  const as=astronaut(); as.scale.setScalar(0.6); sc.add(as); as.traverse(o=>{ if(o.material){ o.material=o.material.clone(); o.material.transparent=true; } });
  const streak=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.06,1,12,1,true),glowMat(0xffd6a0,0.0)); sc.add(streak);
  const tgt=new THREE.Vector3(0,0.2,0), up=new THREE.Vector3(0,1,0), d0=new THREE.Vector3(0.42,0.86,0.3).normalize(), d1=new THREE.Vector3(0.95,0.12,0.3).normalize();
  const tip=new THREE.Object3D(); sc.add(tip); const edge=new THREE.Vector3();
  SCN[0]=function(lt){ const u=easeIO(cl((lt-0.2)/3.9));
    cam.position.set(0.25*Math.sin(lt*0.3),1.0-0.35*u,11.5-2.6*u); cam.lookAt(tgt);
    const cd=new THREE.Vector3().copy(cam.position).applyAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2-0.06); // cam dir in disk-local xy
    disk.material.uniforms.uCam.value.set(cam.position.x,-cam.position.z).normalize(); [disk,lens].forEach(m=>m.material.uniforms.uT.value=lt+3.);
    lens.quaternion.copy(cam.quaternion); pr.quaternion.copy(cam.quaternion);
    // fall: accelerating, curving in
    const f=Math.pow(cl((lt-0.3)/3.5),1.6); const P0=new THREE.Vector3(0.8,2.35,1.2), P1=new THREE.Vector3(0.6,1.4,1.0), P2=new THREE.Vector3(1.02,0.3,0.25);
    as.position.copy(P0).multiplyScalar((1-f)*(1-f)).addScaledVector(P1,2*f*(1-f)).addScaledVector(P2,f*f); const toBH=as.position.clone().negate().normalize();
    as.quaternion.setFromUnitVectors(up,toBH.clone().negate()); const k=smooth(0.25,1,f); as.scale.set(0.6*(1-0.7*k),0.6*(1+3.2*k*k),0.6*(1-0.7*k));
    as.rotateY(lt*0.6); const fade=1-smooth(0.9,1.0,f); as.traverse(o=>{ if(o.material){ o.material.opacity=fade; if(o.material.emissive) o.material.emissiveIntensity=0.25*k; } });
    streak.material.opacity=0.55*k*(1-smooth(0.97,1,f)+0.25); const sl=0.4+1.6*k; streak.scale.set(1,sl,1); streak.position.copy(as.position).add(toBH.clone().multiplyScalar(sl*0.5)); streak.quaternion.setFromUnitVectors(up,toBH);
    P.c.render();
    edge.set(0.75,0.95,0); const [ex,ey]=proj(edge,cam); const [ax,ay]=proj(as.position,cam);
    lab('l0_0',ex,ey-30,win(lt,0.8,2.1),1); lab('l0_1',Math.min(ax,820),ay-60,win(lt,2.15,9),-1);
    caption(0,lt); };
})();

// ---------- S1 /what-if the Moon hit Earth: both to scale (Moon 3,474 km vs Earth 12,742 km wide), the Moon falls in, a glowing impact
// spreads over the crust with a shockwave, debris is thrown into space
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x010103); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.05,400); const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.55,th:0.88});
  starField(sc,1600,23,300);
  const sun=new THREE.DirectionalLight(0xfff4e6,1.5); sun.position.set(6,2.2,2.2); sc.add(sun); sc.add(new THREE.AmbientLight(0x30384a,0.25));
  const DT=(b64,w,h,fmt,srgb)=>{ const t=new THREE.DataTexture(new Uint8Array(b64buf(b64)),w,h,fmt); t.encoding=srgb?THREE.sRGBEncoding:THREE.LinearEncoding;
    t.magFilter=THREE.LinearFilter; t.minFilter=THREE.LinearMipmapLinearFilter; t.generateMipmaps=true; t.anisotropy=8; t.needsUpdate=true; return t; };
  const E={day:DT(window.EARTH_DAY,2048,1024,THREE.RGBAFormat,true), clouds:DT(window.EARTH_CL,2048,1024,THREE.LuminanceFormat,false), night:DT(window.EARTH_NL,1024,512,THREE.LuminanceFormat,false)}; const EG=new THREE.Group(); EG.position.set(-0.2,-0.75,0); sc.add(EG);
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1,128,96),new THREE.MeshStandardMaterial({map:E.day,roughness:.78,emissiveMap:E.night,emissive:0xffc27a,emissiveIntensity:0.55})); EG.add(earth);
  const clouds=new THREE.Mesh(new THREE.SphereGeometry(1.01,96,64),new THREE.MeshStandardMaterial({color:0xffffff,alphaMap:E.clouds,transparent:true,depthWrite:false,roughness:1})); EG.add(clouds);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(1.04,64,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,
    vertexShader:'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'varying vec3 vN; void main(){ float i=pow(0.72-dot(vN,vec3(0,0,1.)),3.); gl_FragColor=vec4(0.35,0.6,1.,1.)*i*2.2; }'})); EG.add(atm);
  const N=new THREE.Vector3(0.55,0.78,0.3).normalize();
  const hot=new THREE.Mesh(new THREE.SphereGeometry(1.006,128,96),new THREE.ShaderMaterial({uniforms:{uR:{value:0},uT:{value:0},uN:{value:N}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,
    vertexShader:'varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:`uniform float uR,uT; uniform vec3 uN; varying vec3 vP;
      float h(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
      float n3(vec3 p){ vec3 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
      void main(){ float a=acos(clamp(dot(vP,uN),-1.,1.)); float nn=n3(vP*7.+uT*0.3)*0.6+n3(vP*19.)*0.4;
        float core=smoothstep(uR,uR*0.25,a+0.12*(nn-.5)); float ring=exp(-pow((a-uR*1.12)/0.035,2.))*step(0.001,uR);
        vec3 c=mix(vec3(.9,.2,.03),vec3(1.,.7,.35),core*core*core)*core*(0.55+0.7*nn)*0.95 + vec3(1.,.75,.45)*ring*1.6*(1.-smoothstep(1.,2.3,uR));
        gl_FragColor=vec4(c*step(0.001,uR),1.); }`})); EG.add(hot);
  const mt=canvasTex(1024,512,(c,w,h)=>{ const n=vnoise(9), r=rnd(4); const id=c.createImageData(w,h); for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const v=fbm(n,x/w*10,y/h*5,6); const m=fbm(n,x/w*3+7,y/h*1.5,3)>0.55?0.55:1; const g=(90+120*v)*m; const i=(y*w+x)*4; id.data[i]=g; id.data[i+1]=g*0.98; id.data[i+2]=g*0.95; id.data[i+3]=255; }
    c.putImageData(id,0,0); for(let i=0;i<260;i++){ const x=r()*w,y=r()*h,rr=2+Math.pow(r(),3)*26; c.strokeStyle='rgba(30,30,30,.35)'; c.lineWidth=rr*0.25; c.beginPath(); c.arc(x,y,rr,0,7); c.stroke(); c.strokeStyle='rgba(255,255,255,.18)'; c.beginPath(); c.arc(x+rr*0.2,y+rr*0.2,rr,0,7); c.stroke(); } });
  const moon=new THREE.Mesh(new THREE.SphereGeometry(0.273,96,64),new THREE.MeshStandardMaterial({map:mt,roughness:.95,emissive:0xff5a10,emissiveIntensity:0})); sc.add(moon);
  // debris
  const ND=2600, dpos=new Float32Array(ND*3), dvel=[], R=rnd(77); for(let i=0;i<ND;i++){ const t=new THREE.Vector3(R()-.5,R()-.5,R()-.5); t.sub(N.clone().multiplyScalar(t.dot(N))).normalize();
    const s=0.25+R()*1.1; dvel.push(N.clone().multiplyScalar(0.5+R()*1.3).add(t.multiplyScalar(s))); }
  const dg=new THREE.BufferGeometry(); dg.setAttribute('position',new THREE.BufferAttribute(dpos,3));
  const dm=new THREE.PointsMaterial({color:0xff8a3c,size:0.03,transparent:true,opacity:0,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false}); const deb=new THREE.Points(dg,dm); EG.add(deb);
  const EROT=0.0, T0=1.95, start=new THREE.Vector3(1.45,2.35,0.6), contact=N.clone().multiplyScalar(1.273).add(EG.position), mp=new THREE.Vector3();
  SCN[1]=function(lt){ const ft=cl(lt/T0); const fa=ft*ft*(1.6-0.6*ft); // accelerating approach
    mp.copy(start).lerp(contact,fa); if(lt>T0){ const s=ease((lt-T0)/1.6); mp.copy(contact).sub(EG.position).multiplyScalar(1-0.2*s).add(EG.position); }
    moon.position.copy(mp); moon.lookAt(EG.position); moon.rotation.z=lt*0.1;
    earth.rotation.y=EROT+lt*0.04; clouds.rotation.y=EROT+0.3+lt*0.055; const it=lt-T0;
    hot.material.uniforms.uR.value=it>0?0.08+0.8*ease(it/2.3):0; hot.material.uniforms.uT.value=lt;
    if(it>0){ dm.opacity=0.95*(1-cl((it-1.5)/1.0)); for(let i=0;i<ND;i++){ const v=dvel[i]; const tt=it*(0.55+0.45*((i*37)%100)/100); const p=N.clone().multiplyScalar(1.0).addScaledVector(v,tt).addScaledVector(N,-0.18*tt*tt); dpos.set([p.x,p.y,p.z],i*3); } dg.attributes.position.needsUpdate=true; } else dm.opacity=0;
    const shake=it>0?0.03*Math.exp(-it*2.2)*Math.sin(it*38):0; const u=easeIO(cl(lt/4.4));
    cam.position.set(0.55+shake,0.35-0.1*u,6.9-1.3*u); cam.lookAt(0.25+shake*0.5,0.25,0); P.c.render();
    const [mx,my]=proj(moon.position,cam); const ee=EG.position.clone().add(new THREE.Vector3(-0.75,-0.1,0.6)); const [qx,qy]=proj(ee,cam); const [ix,iy]=proj(contact,cam);
    lab('l1_0',mx,my+130,win(lt,0.3,1.8),-1); lab('l1_1',qx,qy,win(lt,0.55,1.9),1); lab('l1_2',ix,iy-150,win(lt,T0+0.5,9),-1);
    caption(1,lt); };
})();

// ---------- S2 /deep-dive inside a volcano: a cutaway of a stratovolcano (layers of ash and old lava), the eruption at the top, then the
// camera dives down the conduit to the magma chamber (lava/magma ~700-1,200 C, Britannica)
(function(){ const cv=document.getElementById('cv2'), g=cv.getContext('2d'); const W=1080,H=1920;
  const X0=-1150, Y0=-1800, CW=2300, CH=4100, PK=-760, CHY=1150;
  const bg=document.createElement('canvas'); bg.width=CW; bg.height=CH; const b=bg.getContext('2d'); b.translate(-X0,-Y0);
  const n=vnoise(13), r=rnd(17);
  const coneY=(x)=>{ const ax=Math.abs(x); if(ax<70) return PK+18*(1-ax/70); return Math.min(0,PK+(ax-70)*0.92+40*Math.sin(ax*0.004)*(ax/900)); };
  { const sk=b.createLinearGradient(0,Y0,0,0); sk.addColorStop(0,'#0c0f1a'); sk.addColorStop(0.6,'#2a1d22'); sk.addColorStop(1,'#5a2f22'); b.fillStyle=sk; b.fillRect(X0,Y0,CW,-Y0);
    // ground strata
    const bands=['#4a3b30','#5b4636','#3d3029','#6a5240','#463730','#55433a','#3a2e28','#4f3f35'];
    for(let i=0;i<40;i++){ const y0=i*62; b.fillStyle=bands[i%bands.length]; b.beginPath(); b.moveTo(X0,y0); for(let x=X0;x<=X0+CW;x+=30) b.lineTo(x,y0+18*Math.sin(x*0.004+i)+10*(fbm(n,x*0.004,i,3)-0.5)); b.lineTo(X0+CW,CH+Y0); b.lineTo(X0,CH+Y0); b.fill(); }
    // cone: nested layers (each eruption adds a coat)
    for(let L=0;L<14;L++){ const off=L*26; b.fillStyle=L%2?'#5c4a3e':'#3b302b'; if(L%3===2) b.fillStyle='#7a604c'; b.beginPath(); b.moveTo(-1100,0);
      for(let x=-1100;x<=1100;x+=10){ const y=coneY(x)+off*(1+0.15*Math.sin(x*0.01+L)); b.lineTo(x,Math.min(y,0)); } b.lineTo(1100,0); b.fill(); }
    // grain
    for(let i=0;i<60000;i++){ const x=X0+r()*CW, y=r()*(CH+Y0); const yy=y; if(yy<coneY(x)) continue; b.fillStyle=`rgba(${r()<0.5?0:255},${r()<0.5?0:220},${r()<0.5?0:180},${0.05+r()*0.07})`; b.fillRect(x,yy,1+r()*3,1+r()*3); }
    // surface skin + cutaway edge highlight
    b.strokeStyle='rgba(255,180,120,.35)'; b.lineWidth=3; b.beginPath(); for(let x=-1100;x<=1100;x+=10) b.lineTo(x,coneY(x)); b.stroke();
    // chamber
    const cg=b.createRadialGradient(0,CHY,20,0,CHY,460); cg.addColorStop(0,'#fff2b0'); cg.addColorStop(0.25,'#ffb030'); cg.addColorStop(0.6,'#e2470e'); cg.addColorStop(0.85,'#7a1a08'); cg.addColorStop(1,'rgba(60,15,8,0)');
    b.fillStyle=cg; b.beginPath(); b.ellipse(0,CHY,470,230,0,0,7); b.fill();
    // conduit
    const cw=b.createLinearGradient(-30,0,30,0); cw.addColorStop(0,'#5a1406'); cw.addColorStop(0.5,'#ff8a20'); cw.addColorStop(1,'#5a1406'); b.fillStyle=cw; b.beginPath(); b.moveTo(-26,PK+10); b.lineTo(26,PK+10); b.lineTo(44,CHY-150); b.lineTo(-44,CHY-150); b.fill();
    // sills / dikes
    b.fillStyle='#d2561a'; b.beginPath(); b.moveTo(30,200); b.lineTo(380,170); b.lineTo(380,186); b.lineTo(36,218); b.fill(); b.beginPath(); b.moveTo(-34,520); b.lineTo(-300,430); b.lineTo(-300,446); b.lineTo(-38,540); b.fill(); }
  const P=[]; const RR=rnd(5); for(let i=0;i<150;i++) P.push([RR(),RR(),RR(),RR()]);
  const SP=[]; for(let i=0;i<220;i++) SP.push([RR(),RR(),RR()]);
  const BB=[]; for(let i=0;i<90;i++) BB.push([RR(),RR(),RR()]);
  SCN[2]=function(lt){ const u=easeIO(cl((lt-0.45)/3.2));
    const fy=-860+(CHY-60+860)*u, sc=1.18-0.42*Math.sin(Math.PI*u)+0.12*u+0.03*Math.sin(lt*0.7), fx=12*Math.sin(lt*0.5);
    const S=(x,y)=>[(x-fx)*sc+540,(y-fy)*sc+960];
    g.setTransform(1,0,0,1,0,0); g.fillStyle='#0c0f1a'; g.fillRect(0,0,W,H);
    g.setTransform(sc,0,0,sc,540-fx*sc,960-fy*sc); g.drawImage(bg,X0,Y0);
    // chamber pulse + bubbles
    const pg=g.createRadialGradient(0,CHY,10,0,CHY,420); pg.addColorStop(0,`rgba(255,240,170,${0.35+0.15*Math.sin(lt*3)})`); pg.addColorStop(1,'rgba(255,120,30,0)'); g.fillStyle=pg; g.beginPath(); g.ellipse(0,CHY,440,215,0,0,7); g.fill();
    BB.forEach(([a,bq,c])=>{ const ph=(lt*0.35+a)%1; const x=(bq-0.5)*700*(1-ph*0.6), y=CHY+150-ph*330; if(Math.abs(x)/440+Math.abs(y-CHY)/215>1.0) return; g.fillStyle=`rgba(255,235,170,${0.6*(1-ph)})`; g.beginPath(); g.arc(x,y,4+c*10,0,7); g.fill(); });
    // magma rising in the conduit
    for(let i=0;i<40;i++){ const ph=((lt*0.9+i/40)%1); const y=CHY-150-ph*(CHY-150-PK); const w=26+18*(y-PK)/(CHY-PK); const al=0.3*Math.sin(ph*Math.PI); const bg2=g.createRadialGradient(0,y,0,0,y,w*0.6); bg2.addColorStop(0,`rgba(255,235,150,${al})`); bg2.addColorStop(1,'rgba(255,160,60,0)'); g.fillStyle=bg2; g.beginPath(); g.ellipse(0,y,w*0.45,w*0.9,0,0,7); g.fill(); }
    // lava flows down both flanks
    [[1,0.3],[-1,0.9]].forEach(([s,d])=>{ const L=cl((lt+d)/4.5); g.strokeStyle='rgba(255,120,30,.95)'; g.lineWidth=16; g.lineCap='round'; g.shadowColor='#ff6a10'; g.shadowBlur=30; g.beginPath(); g.moveTo(s*40,PK+10);
      for(let x=40;x<40+L*700;x+=10) g.lineTo(s*x,coneY(s*x)-4+6*Math.sin(x*0.05)); g.stroke(); g.shadowBlur=0; g.strokeStyle='rgba(255,230,150,.9)'; g.lineWidth=5; g.stroke(); });
    // ash plume
    P.forEach(([a,bq,c,d])=>{ const ph=(lt*0.16+a)%1; const y=PK-30-ph*1050, x=(bq-0.5)*(80+ph*620)+ph*120*Math.sin(d*6+lt*0.4), rad=40+ph*190*c+30;
      const gr=g.createRadialGradient(x,y+rad*0.3,0,x,y,rad); const lit=Math.max(0,1-ph*1.6); gr.addColorStop(0,`rgba(${70+120*lit|0},${55+40*lit|0},${50},${0.55*(1-ph)})`); gr.addColorStop(1,'rgba(40,35,35,0)'); g.fillStyle=gr; g.beginPath(); g.arc(x,y,rad,0,7); g.fill(); });
    // lava fountain sparks
    SP.forEach(([a,bq,c])=>{ const ph=(lt*0.8+a)%1; const vx=(bq-0.5)*520, vy=-(500+c*600); const x=vx*ph, y=PK+vy*ph+620*ph*ph; g.fillStyle=`rgba(255,${190+60*c|0},${90},${1-ph})`; g.fillRect(x-3,y-3,6+4*c,6+4*c); });
    const cg=g.createRadialGradient(0,PK,0,0,PK,200); cg.addColorStop(0,'rgba(255,220,140,.8)'); cg.addColorStop(1,'rgba(255,90,20,0)'); g.fillStyle=cg; g.beginPath(); g.arc(0,PK,200,0,7); g.fill();
    g.setTransform(1,0,0,1,0,0); const vg=g.createRadialGradient(540,960,500,540,960,1250); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.6)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
    const [px,py]=S(150,PK-420), [cx,cy]=S(40,(PK+CHY)/2), [mx,my]=S(300,CHY-40);
    lab('l2_0',px,py,win(lt,0.35,1.2),1); lab('l2_1',cx,cy,win(lt,1.35,2.6),1); lab('l2_2',Math.min(mx,700),my,cl((lt-2.8)/0.25),1);
    caption(2,lt); };
})();
