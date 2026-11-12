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

// ---------- S0 /physics-sim an asteroid hitting the ocean: real Earth (NASA Blue Marble textures, public domain), a glowing rock comes in
// at ~20 km/s (typical impact speed), hits the Pacific; flash, a steam plume, ring waves spreading from the impact (time-lapsed, not to scale)
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x010103); ren.toneMappingExposure=1.2;
  const cam=new THREE.PerspectiveCamera(34,1080/1920,0.05,400); const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.55,th:0.86});
  starField(sc,1600,23,300);
  const sun=new THREE.DirectionalLight(0xfff4e6,3.0); sun.position.set(3.0,3.0,5.5); sc.add(sun); sc.add(new THREE.AmbientLight(0x4a5a78,0.55));
  const E=earthReal(); const EG=new THREE.Group(); EG.position.set(-0.15,-0.7,0); sc.add(EG);
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1,160,120),new THREE.MeshStandardMaterial({map:E.day,roughness:.7,emissiveMap:E.night,emissive:0xffc27a,emissiveIntensity:0.0})); earth.rotation.y=1.45; EG.add(earth);
  const clouds=new THREE.Mesh(new THREE.SphereGeometry(1.008,96,64),new THREE.MeshStandardMaterial({color:0xffffff,alphaMap:E.clouds,transparent:true,opacity:.8,depthWrite:false,roughness:1})); clouds.rotation.y=1.75; EG.add(clouds);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(1.04,64,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,
    vertexShader:'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'varying vec3 vN; void main(){ float i=pow(0.72-dot(vN,vec3(0,0,1.)),3.); gl_FragColor=vec4(0.35,0.6,1.,1.)*i*2.2; }'})); EG.add(atm);
  const N=new THREE.Vector3(0.30,0.42,0.86).normalize();
  const wave=new THREE.Mesh(new THREE.SphereGeometry(1.006,160,120),new THREE.ShaderMaterial({uniforms:{uR:{value:0},uT:{value:0},uN:{value:N}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,
    vertexShader:'varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:`uniform float uR,uT; uniform vec3 uN; varying vec3 vP;
      float h(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
      float n3(vec3 p){ vec3 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
      void main(){ float a=acos(clamp(dot(vP,uN),-1.,1.)); float nn=n3(vP*40.)*0.5+0.5; float on=step(0.001,uR);
        float fade=1.-smoothstep(0.35,0.75,uR);
        float wob=(n3(vP*9.+uT*0.2)-.5)*0.03; float aa=a+wob*smoothstep(0.,0.3,uR);
        float r1=exp(-pow((aa-uR)/(0.006+uR*0.02),2.)); float r2=exp(-pow((aa-uR*0.74)/(0.005+uR*0.012),2.))*0.4;
        float foam=smoothstep(uR,uR*0.2,aa)*n3(vP*60.+uT)*0.22*(1.-smoothstep(0.1,0.5,uR));
        float core=smoothstep(0.06+uR*0.05,0.0,a+wob*2.)*(0.7-0.5*smoothstep(0.15,0.6,uR));
        vec3 c=vec3(0.8,0.93,1.)*(r1+r2)*(0.55+0.6*nn)*fade + vec3(0.9,0.97,1.)*foam + vec3(1.,1.,1.)*core;
        gl_FragColor=vec4(c*on,1.); }`})); EG.add(wave);
  // asteroid + fire trail
  const ag=new THREE.IcosahedronGeometry(0.038,3); { const p=ag.attributes.position, n=vnoise(4), v=new THREE.Vector3(); for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); const k=0.75+0.5*fbm(n,v.x*40+3,v.y*40+v.z*30,3); v.multiplyScalar(k); p.setXYZ(i,v.x,v.y,v.z); } ag.computeVertexNormals(); }
  const ast=new THREE.Mesh(ag,new THREE.MeshStandardMaterial({color:0x4a3a30,roughness:.95,emissive:0xff6a1a,emissiveIntensity:0.4})); sc.add(ast);
  const trailT=canvasTex(64,512,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(255,250,230,1)'); g.addColorStop(.12,'rgba(255,190,90,.9)'); g.addColorStop(.5,'rgba(255,90,20,.45)'); g.addColorStop(1,'rgba(120,30,0,0)'); c.fillStyle=g; c.fillRect(0,0,w,h);
    const gx=c.createLinearGradient(0,0,w,0); gx.addColorStop(0,'rgba(0,0,0,1)'); gx.addColorStop(.5,'rgba(0,0,0,0)'); gx.addColorStop(1,'rgba(0,0,0,1)'); c.globalCompositeOperation='destination-out'; c.fillStyle=gx; c.fillRect(0,0,w,h); });
  const trail=new THREE.Mesh(new THREE.PlaneGeometry(0.16,1.5),new THREE.MeshBasicMaterial({map:trailT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,side:THREE.DoubleSide})); trail.geometry.translate(0,-0.75,0); sc.add(trail);
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.06,16,12),glowMat(0xffd9a0,0.9)); sc.add(head);
  const flash=new THREE.Mesh(new THREE.SphereGeometry(0.09,24,16),glowMat(0xffffff,0)); sc.add(flash);
  // steam plume
  const NP=420, ppos=new Float32Array(NP*3), pv=[], R=rnd(77); for(let i=0;i<NP;i++){ const t=new THREE.Vector3(R()-.5,R()-.5,R()-.5); t.sub(N.clone().multiplyScalar(t.dot(N))).normalize(); pv.push([t,0.01+R()*0.10,0.06+Math.pow(R(),0.6)*0.32,R()]); }
  const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(ppos,3));
  const puff=canvasTex(128,128,(c,w,h)=>{ const g=c.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.4,'rgba(255,255,255,.5)'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  const pm=new THREE.PointsMaterial({color:0xf2f7ff,map:puff,size:0.16,sizeAttenuation:true,transparent:true,opacity:0,depthWrite:false}); EG.add(new THREE.Points(pg,pm));
  const T0=1.75, contact=N.clone().multiplyScalar(1.0).add(EG.position), dir=new THREE.Vector3(0.80,0.62,-0.25).normalize(), start=contact.clone().addScaledVector(dir,3.4), ap=new THREE.Vector3(), tmp=new THREE.Vector3();
  SCN[0]=function(lt){ const ft=cl(lt/T0); ap.copy(start).lerp(contact,ft);
    const vis=lt<T0; ast.visible=trail.visible=head.visible=vis; ast.position.copy(ap); ast.rotation.set(lt*3,lt*2,0); head.position.copy(ap);
    trail.position.copy(ap); tmp.copy(cam.position).sub(ap); const up=dir.clone().negate(); const right=new THREE.Vector3().crossVectors(up,tmp).normalize(); const fw=new THREE.Vector3().crossVectors(right,up);
    trail.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,fw)); trail.scale.set(1,0.5+0.7*ft,1);
    ast.material.emissiveIntensity=0.4+2.2*ft; const it=lt-T0;
    flash.position.copy(contact); flash.material.opacity=it>0?Math.exp(-it*5):0; flash.scale.setScalar(it>0?1+it*9:1);
    wave.material.uniforms.uR.value=it>0?0.02+0.62*ease(it/3.6):0; wave.material.uniforms.uT.value=lt;
    clouds.rotation.y=1.75+lt*0.012;
    if(it>0){ pm.opacity=0.16*cl(it/0.3)*(1-0.6*cl((it-2.8)/1.4)); for(let i=0;i<NP;i++){ const [t,s,vz,o]=pv[i]; const tt=Math.min(1,it/(1.6+o)); const e2=1-Math.pow(1-tt,2.5);
        const hgt=vz*e2, sp=s*(0.25+2.2*e2*e2*(vz/0.38)); ppos.set([N.x*(1+hgt)+t.x*sp,N.y*(1+hgt)+t.y*sp,N.z*(1+hgt)+t.z*sp],i*3); } pg.attributes.position.needsUpdate=true; } else pm.opacity=0;
    const shake=it>0?0.02*Math.exp(-it*2.4)*Math.sin(it*40):0; const u=easeIO(cl(lt/4.8));
    cam.position.set(0.7+shake-0.25*u,0.75-0.15*u,5.4-1.5*u); cam.lookAt(0.12+shake*0.5,-0.02+0.12*u,0.4); P.c.render();
    const [ax,ay]=proj(ap,cam), [ix,iy]=proj(contact,cam); const rp=N.clone().applyAxisAngle(new THREE.Vector3(0,0,1).cross(N).normalize(),-wave.material.uniforms.uR.value).add(EG.position); const [rx,ry]=proj(rp,cam);
    lab('l0_0',ax,ay+70,win(lt,0.35,T0-0.15),-1); lab('l0_1',ix,iy-190,win(lt,T0+0.45,9),1); lab('l0_2',rx,ry+40,win(lt,T0+1.5,9),-1);
    caption(0,lt); };
})();

// ---------- S1 /what-if Earth lost its atmosphere, seen from the shore: the air streams off into space, the blue sky goes black in daylight
// (no air to scatter sunlight), stars come out next to a harsh white Sun, the haze is gone, and the ocean boils away (no pressure)
(function(){ const cv=document.getElementById('cv1'), g=cv.getContext('2d'); const W=1080,H=1920, HZ=1000;
  const R=rnd(31); const stars=[]; for(let i=0;i<520;i++) stars.push([R()*W,R()*HZ,R()*1.7+0.4,R()]);
  const wisps=[]; for(let i=0;i<70;i++) wisps.push([R()*W,R(),40+R()*120,R()]);
  const bub=[]; for(let i=0;i<160;i++) bub.push([R()*W,R(),R(),3+R()*9]);
  const vap=[]; for(let i=0;i<46;i++) vap.push([R()*W,R(),60+R()*130,R()]);
  const rgb=(a,b,t)=>`rgb(${lerp(a[0],b[0],t)|0},${lerp(a[1],b[1],t)|0},${lerp(a[2],b[2],t)|0})`;
  function ridge(y0,amp,seed,step){ const n=vnoise(seed); g.beginPath(); g.moveTo(0,HZ+4); for(let x=0;x<=W;x+=step||12){ g.lineTo(x,y0-amp*fbm(n,x*0.004+seed,0.5,5)); } g.lineTo(W,HZ+4); g.closePath(); }
  SCN[1]=function(lt){ const a=smooth(0.9,2.5,lt), b=smooth(2.3,4.9,lt);
    const sk=g.createLinearGradient(0,0,0,HZ); for(let i=0;i<=10;i++){ const u=i/10, al=smooth(u*0.55,u*0.55+0.45,a*1.02); const c0=[lerp(44,205,Math.pow(u,1.5)),lerp(110,228,Math.pow(u,1.5)),lerp(205,245,u)]; sk.addColorStop(u,rgb(c0,[lerp(0,7,u),lerp(0,7,u),lerp(3,13,u)],al)); } g.fillStyle=sk; g.fillRect(0,0,W,HZ+4);
    stars.forEach(([x,y,r,p])=>{ g.fillStyle=`rgba(255,255,255,${a*a*(0.35+0.65*p)})`; g.fillRect(x,y,r,r); });
    // the Sun: soft and yellow in air, small harsh white disc without
    const sx=760, sy=650, gr=lerp(330,90,a); const sg=g.createRadialGradient(sx,sy,10,sx,sy,gr); sg.addColorStop(0,`rgba(255,${lerp(244,255,a)|0},${lerp(200,255,a)|0},1)`); sg.addColorStop(.18,`rgba(255,${lerp(236,255,a)|0},${lerp(170,250,a)|0},${lerp(.55,.5,a)})`); sg.addColorStop(1,'rgba(255,240,200,0)'); g.fillStyle=sg; g.beginPath(); g.arc(sx,sy,gr,0,7); g.fill();
    g.fillStyle='#fff'; g.beginPath(); g.arc(sx,sy,lerp(52,44,a),0,7); g.fill();
    // air streaming off into space
    const wv=win(lt,0.7,2.7,0.5); if(wv>0.01){ wisps.forEach(([x,o,len,p])=>{ const t=((lt-0.6)*0.5+o)%1; const y=HZ-20-t*HZ; const rr=len*(0.5+t); const wg2=g.createRadialGradient(x,y,0,x,y,rr); wg2.addColorStop(0,`rgba(200,230,255,${wv*0.08*Math.sin(t*Math.PI)})`); wg2.addColorStop(1,'rgba(200,230,255,0)'); g.fillStyle=wg2; g.beginPath(); g.ellipse(x+30*Math.sin(t*4+p*6),y,rr*0.7,rr*1.5,0,0,7); g.fill(); }); }
    // mountains: hazy blue with air, stark without
    g.fillStyle=rgb([150,180,212],[78,74,70],a); ridge(HZ-40,300,3); g.fill();
    g.fillStyle=rgb([104,140,176],[52,49,46],a); ridge(HZ-10,210,9); g.fill();
    g.fillStyle=rgb([60,92,120],[30,28,26],a); ridge(HZ+10,120,17); g.fill();
    // ocean: sea level drops as it boils away, the seabed shows
    const sea=HZ+b*230; g.fillStyle=rgb([150,120,88],[96,84,72],a); g.fillRect(0,HZ,W,H-HZ);
    const n=vnoise(5); g.fillStyle='rgba(0,0,0,.16)'; for(let i=0;i<60;i++){ const x=(i*197)%W, y=HZ+20+((i*89)%640); g.beginPath(); g.ellipse(x,y,30+(i*13)%70,6+(i*7)%10,0,0,7); g.fill(); }
    const wg=g.createLinearGradient(0,sea,0,H); wg.addColorStop(0,rgb([70,150,205],[40,84,120],a)); wg.addColorStop(1,rgb([14,60,120],[6,26,54],a)); g.fillStyle=wg;
    g.beginPath(); g.moveTo(0,H); g.lineTo(0,sea); for(let x=0;x<=W;x+=20){ g.lineTo(x,sea+6*Math.sin(x*0.02+lt*2.2)+4*Math.sin(x*0.045-lt*3)); } g.lineTo(W,H); g.closePath(); g.fill();
    const rf=g.createLinearGradient(sx-160,sea,sx+160,sea); rf.addColorStop(0,'rgba(255,255,255,0)'); rf.addColorStop(.5,`rgba(255,250,230,${0.35+0.2*a})`); rf.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=rf; g.fillRect(sx-160,sea+6,320,H-sea);
    if(b>0.01){ bub.forEach(([x,o,p,r])=>{ const t=(lt*1.6+o*5)%1; if(p>b*1.15) return; g.strokeStyle=`rgba(255,255,255,${0.75*(1-t)})`; g.lineWidth=3; g.beginPath(); g.arc(x,sea+10+p*40+ (1-t)*14,r*(0.4+t),0,7); g.stroke(); });
      vap.forEach(([x,o,r,p])=>{ const t=(lt*0.45+o)%1; if(p>b*1.2) return; const y=sea-t*250, rr=r*(0.4+1.0*t); const vg=g.createRadialGradient(x,y,0,x,y,rr); vg.addColorStop(0,`rgba(255,255,255,${0.26*b*(1-t)})`); vg.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=vg; g.beginPath(); g.arc(x+30*Math.sin(t*5+p*9),y,rr,0,7); g.fill(); }); }
    fixLab('l1_0',90,600,win(lt,1.5,9)); fixLab('l1_1',90,1090,win(lt,2.9,9)); fixLab('l1_2',560,860,win(lt,3.6,9));
    caption(1,lt); };
})();

// ---------- S2 /scale the tallest volcano on Mars versus Everest: heights to scale (Everest 8,849 m; Olympus Mons ~21.9 km above the Mars
// datum, about 2.5x; NASA), with a jet's cruising altitude (~11 km) for reference. Widths are compressed (Olympus Mons is ~600 km wide).
(function(){ const cv=document.getElementById('cv2'), g=cv.getContext('2d'); const W=1080,H=1920, BASE=1150, PX=25.2; // px per km
  const Y=(km)=>BASE-km*PX; const n=vnoise(12), n2=vnoise(40); const R=rnd(5); const dust=[]; for(let i=0;i<120;i++) dust.push([R()*W,R()*BASE,R()*2+0.5,R()]);
  function everest(k){ const cx=250, top=Y(8.849*k); g.beginPath(); g.moveTo(cx-230,BASE); const pts=[[-230,0],[-170,0.22],[-120,0.42],[-85,0.5],[-55,0.72],[-25,0.86],[0,1],[22,0.9],[48,0.74],[80,0.62],[110,0.4],[160,0.25],[215,0.08],[240,0]];
    pts.forEach(([dx,f])=>g.lineTo(cx+dx,BASE-(BASE-top)*f+ (f>0&&f<1?6*Math.sin(dx*0.3):0))); g.closePath(); }
  function olympus(k){ const x0=330, x1=1076, top=Y(21.9*k), hh=BASE-top; g.beginPath(); g.moveTo(x0,BASE);
    for(let x=x0;x<=x1;x+=6){ const u=(x-x0)/(x1-x0); const d=Math.abs(u-0.5)*2; let f=1-Math.pow(d,1.6)*0.5; if(d>0.86) f*=smooth(1.0,0.86,d); if(d<0.13) f=Math.min(f,0.972-0.05*smooth(0.13,0.07,d));
      g.lineTo(x,BASE-hh*f+2.5*fbm(n,x*0.02,1,3)); } g.lineTo(x1,BASE); g.closePath(); }
  function num(v){ return v.toLocaleString('en-US'); }
  SCN[2]=function(lt){ const e=ease(cl((lt-0.15)/1.0)), o=easeIO(cl((lt-1.6)/2.3)), j=cl((lt-1.05)/0.7);
    const sk=g.createLinearGradient(0,0,0,BASE); sk.addColorStop(0,'#120806'); sk.addColorStop(.55,'#4a2416'); sk.addColorStop(1,'#b8703f'); g.fillStyle=sk; g.fillRect(0,0,W,H);
    dust.forEach(([x,y,r,p])=>{ g.fillStyle=`rgba(255,210,170,${0.05+0.1*p})`; g.fillRect((x+lt*12*p)%W,y,r,r); });
    // height ruler
    g.font='500 24px "JetBrains Mono",monospace'; g.textAlign='left'; for(let km=5;km<=20;km+=5){ const a=cl((Math.max(e*8.849,o*21.9)-km+3)/3); if(a<=0) continue; g.strokeStyle=`rgba(255,255,255,${0.16*a})`; g.lineWidth=2; g.setLineDash([4,10]); g.beginPath(); g.moveTo(40,Y(km)); g.lineTo(W-40,Y(km)); g.stroke(); g.setLineDash([]); g.fillStyle=`rgba(255,255,255,${0.5*a})`; if(km>=15) g.fillText(km+' km',96,Y(km)-10); }
    // Olympus Mons (behind)
    if(o>0.001){ const og=g.createLinearGradient(0,Y(21.9*o),0,BASE); og.addColorStop(0,'#e0875a'); og.addColorStop(.5,'#b85c38'); og.addColorStop(1,'#6e2f1c'); g.fillStyle=og; olympus(o); g.fill();
      g.save(); olympus(o); g.clip(); g.fillStyle='rgba(60,20,10,.16)'; for(let i=0;i<70;i++){ const x=330+((i*113)%746), y=Y(21.9*o)+40+((i*61)%520); g.beginPath(); g.ellipse(x,y,26+(i*7)%50,4+(i*3)%6,0.12,0,7); g.fill(); }
      const lg=g.createLinearGradient(330,0,1076,0); lg.addColorStop(0,'rgba(255,220,180,.22)'); lg.addColorStop(.5,'rgba(255,220,180,0)'); lg.addColorStop(1,'rgba(0,0,0,.25)'); g.fillStyle=lg; g.fillRect(330,0,746,BASE); g.restore(); }
    // jet altitude
    if(j>0){ const y=Y(11); g.strokeStyle='rgba(140,200,255,.8)'; g.lineWidth=3; g.setLineDash([14,12]); g.beginPath(); g.moveTo(40,y); g.lineTo(40+(W-80)*j,y); g.stroke(); g.setLineDash([]);
      const px=40+(W-80)*((lt*0.11+0.1)%1); g.fillStyle='#dff0ff'; g.beginPath(); g.moveTo(px+26,y); g.lineTo(px-18,y-7); g.lineTo(px-26,y-18); g.lineTo(px-30,y-18); g.lineTo(px-24,y-4); g.lineTo(px-24,y+4); g.lineTo(px-6,y+4); g.lineTo(px-16,y+16); g.lineTo(px-10,y+16); g.lineTo(px+8,y+4); g.closePath(); g.globalAlpha=j; g.fill(); g.globalAlpha=1; }
    // Everest (front)
    if(e>0.001){ const eg=g.createLinearGradient(0,Y(8.849*e),0,BASE); eg.addColorStop(0,'#aeb9c6'); eg.addColorStop(.5,'#6d7a8a'); eg.addColorStop(1,'#39424e'); g.fillStyle=eg; everest(e); g.fill();
      g.save(); everest(e); g.clip(); g.fillStyle='#f4f8fc'; g.beginPath(); const t=Y(8.849*e); g.moveTo(140,t+70); g.lineTo(190,t+92); g.lineTo(215,t+60); g.lineTo(250,t+96); g.lineTo(280,t+62); g.lineTo(320,t+90); g.lineTo(360,t+66); g.lineTo(360,t-10); g.lineTo(140,t-10); g.closePath(); g.fill();
      g.fillStyle='rgba(0,0,0,.22)'; g.beginPath(); g.moveTo(250,t); g.lineTo(500,BASE); g.lineTo(250,BASE); g.closePath(); g.fill(); g.restore(); }
    g.fillStyle='#3a1a10'; g.fillRect(0,BASE,W,H-BASE); g.fillStyle='rgba(255,255,255,.08)'; g.fillRect(0,BASE,W,3);
    // live counters at the summits
    g.textAlign='center'; g.font='800 46px Inter,sans-serif'; g.shadowColor='rgba(0,0,0,.8)'; g.shadowBlur=14;
    if(e>0.02&&lt<1.75){ g.fillStyle=`rgba(255,255,255,${cl((1.75-lt)/0.2)})`; g.fillText(num(Math.round(8849*e))+' m',250,Y(8.849*e)-26); }
    if(o>0.02&&lt<4.15){ g.fillStyle=`rgba(255,255,255,${cl((4.15-lt)/0.2)})`; g.fillText((21.9*o).toFixed(1)+' km',703,Y(21.9*o)-28); }
    g.shadowBlur=0; g.textAlign='left'; g.font='500 22px "JetBrains Mono",monospace'; g.fillStyle='rgba(255,255,255,.45)'; g.fillText('heights to scale',96,BASE-14);
    lab('l2_0',290,Y(6.2),win(lt,1.75,9),-1); lab('l2_2',700,Y(11)-50,win(lt,3.1,9),1); lab('l2_1',703,Y(21.9)+64,win(lt,4.15,9),-1);
    caption(2,lt); };
})();
