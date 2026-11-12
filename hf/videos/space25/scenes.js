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
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x020308); ren.toneMappingExposure=1.0;
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.05,400); const P=mkComposer(ren,sc,cam,{bloom:0.5,radius:0.45,th:0.82});
  starField(sc,1400,51,300);
  // faint nebula backdrop
  const neb=new THREE.Mesh(new THREE.PlaneGeometry(60,100),new THREE.MeshBasicMaterial({map:canvasTex(512,1024,(c,w,h)=>{ const r=rnd(9); for(let i=0;i<40;i++){ const x=r()*w,y=r()*h,rr=60+r()*220; const g=c.createRadialGradient(x,y,0,x,y,rr); const hue=r()<.5?'60,80,170':'120,50,150'; g.addColorStop(0,`rgba(${hue},${.02+r()*.03})`); g.addColorStop(1,`rgba(${hue},0)`); c.fillStyle=g; c.fillRect(0,0,w,h); } }),transparent:true,depthWrite:false,toneMapped:false}));
  neb.position.z=-40;
  const SP=new THREE.Group(); sc.add(SP); const MG=new THREE.Group(); MG.rotation.z=0.5; SP.add(MG);
  const R0s=0.2;
  const star=new THREE.Mesh(new THREE.SphereGeometry(R0s,96,64),new THREE.ShaderMaterial({uniforms:{uT:{value:0}},toneMapped:false,
    vertexShader:'varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:GLN+`uniform float uT; varying vec3 vN; varying vec3 vP;
      void main(){ float mu=max(dot(vN,vec3(0,0,1)),0.); vec3 p=normalize(vP);
        float n=fbm(vec2(atan(p.z,p.x)*3.+uT*0.3,p.y*6.))*0.5+fbm(vec2(atan(p.z,p.x)*9.,p.y*18.-uT*0.2))*0.5;
        float hot=smoothstep(0.75,1.,abs(dot(p,normalize(vec3(sin(0.5),cos(0.5),0.)))));
        vec3 c=mix(vec3(0.45,0.62,1.05),vec3(0.95,0.98,1.15),pow(mu,0.6))*(0.8+0.35*n)+vec3(0.6,0.75,1.)*hot*0.6;
        c=c*vec3(0.62,0.8,1.3)*(0.28+0.8*pow(mu,0.9))*(0.7+0.5*n)+vec3(0.25,0.45,1.)*pow(1.-mu,3.)*0.9; gl_FragColor=vec4(c,1.); }`}));
  SP.add(star);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,0,128,128,128); g.addColorStop(0,'rgba(170,200,255,.6)'); g.addColorStop(.22,'rgba(110,140,255,.16)'); g.addColorStop(1,'rgba(60,80,200,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
  halo.scale.set(1.5,1.5,1); sc.add(halo);
  // dipole field lines r = L sin^2(theta) around the magnetic axis (y of MG)
  const fm=new THREE.MeshBasicMaterial({color:0x4f7cff,transparent:true,opacity:0.32,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false});
  [0.7,1.1,1.7].forEach((L,li)=>{ for(let k=0;k<8;k++){ const ph=k/8*Math.PI*2+li*0.3, pts=[]; const t0=Math.asin(Math.sqrt(R0s/L));
      for(let i=0;i<=60;i++){ const th=t0+(Math.PI-2*t0)*i/60, r=L*Math.pow(Math.sin(th),2); pts.push(new THREE.Vector3(r*Math.sin(th)*Math.cos(ph),r*Math.cos(th),r*Math.sin(th)*Math.sin(ph))); }
      const m=fm.clone(); m.opacity=0.16-li*0.04; MG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),80,0.0035+0.0015*(2-li),6,false),m)); } });
  // radio beams from both magnetic poles
  const bm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false,uniforms:{uT:{value:0}},
    vertexShader:'varying vec2 vU; varying vec3 vN; varying vec3 vV; void main(){ vU=uv; vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
    fragmentShader:'uniform float uT; varying vec2 vU; varying vec3 vN; varying vec3 vV; void main(){ float a=pow(1.-vU.y,1.6)*(0.25+0.75*pow(abs(dot(vN,vV)),1.5)); float s=0.75+0.25*sin(vU.y*40.-uT*14.); gl_FragColor=vec4(vec3(0.55,0.75,1.)*a*s*0.6,1.); }'});
  [1,-1].forEach(s=>{ const g=new THREE.ConeGeometry(0.22,2.4,48,1,true); g.translate(0,-1.2,0); g.rotateX(s>0?Math.PI:0); // apex at the pole, opens outward
    const b=new THREE.Mesh(g,bm); b.position.y=s*R0s*0.95; MG.add(b); });
  // spin axis
  const ax=new THREE.Mesh(new THREE.CylinderGeometry(0.004,0.004,3.2,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.1,toneMapped:false})); SP.add(ax);
  const edge=new THREE.Object3D(); edge.position.set(R0s,0,0); sc.add(edge); const tip=new THREE.Object3D(); tip.position.set(0,1.0,0); MG.add(tip);
  SCN[0]=function(lt){ const u=easeIO(cl(lt/4.6)); SP.rotation.y=lt*1.9; star.material.uniforms.uT.value=lt; bm.uniforms.uT.value=lt;
    cam.position.set(0.9-0.4*u,0.45-0.2*u,3.6-1.0*u); cam.lookAt(0,0.05,0); P.c.render();
    const [ex,ey]=proj(edge.getWorldPosition(new THREE.Vector3()),cam), [sx,sy]=proj(new THREE.Vector3(0,-0.15,0),cam), [bx,by]=proj(tip.getWorldPosition(new THREE.Vector3()),cam);
    fixLab('l0_0',660,640,win(lt,0.45,9)); fixLab('l0_1',70,760,win(lt,1.4,9)); fixLab('l0_2',70,600,win(lt,2.3,9));
    caption(0,lt); };
})();

// ---------- S1 /zoom-in the surface of the Sun: from the whole disc (limb darkening) one continuous zoom into the photosphere until the
// boiling granulation cells fill the frame (each about the size of Texas, NSF Inouye 2020), with a small sunspot. ~5,500 C (NASA).
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(), cam=new THREE.Camera(); ren.toneMapping=THREE.NoToneMapping;
  const U={uT:{value:0},uZ:{value:1},uC:{value:new THREE.Vector2(0,0)}};
  fullQuad(sc,`uniform float uT,uZ; uniform vec2 uC;
    vec3 wor(vec2 p,float t){ vec2 i=floor(p),f=fract(p); float d1=8.,d2=8.; for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g=vec2(x,y); vec2 o=h22(i+g); o=0.5+0.38*sin(t*0.55+6.2831*o);
        float d=length(g+o-f); if(d<d1){ d2=d1; d1=d; } else if(d<d2) d2=d; } return vec3(d1,d2,0.); }
    void main(){ vec2 px=vec2(gl_FragCoord.x,1920.-gl_FragCoord.y); float R=360.;
      vec2 q=uC+(px-vec2(540.,840.))/(R*uZ); float d=length(q); vec3 col=vec3(0.);
      // corona / glow outside the disc
      float gl=exp(-max(d-1.,0.)*7.)*0.5+exp(-max(d-1.,0.)*1.6)*0.12; col+=vec3(1.,0.55,0.18)*gl*step(1.,d);
      if(d<1.){ float mu=sqrt(1.-d*d); float limb=0.35+0.65*pow(mu,0.55);
        float cpx=R*uZ/650.; vec2 g=q*650.;
        vec3 w=wor(g+0.35*vec2(fbm(g*0.6),fbm(g*0.6+7.)),uT); float lane=smoothstep(0.0,0.1,w.y-w.x+0.05*(fbm(g*2.5)-.5)); float cell=(0.62+0.42*(1.-w.x*w.x)*(0.8+0.4*fbm(g*0.45+11.)))*mix(0.55,1.,lane);
        cell*=0.88+0.24*fbm(g*0.7+uT*0.15);
        float mott=0.78+0.22*fbm(q*90.+uT*0.02);
        float k=smoothstep(2.5,7.,cpx); float I=mix(mott,cell,k);
        I*=0.92+0.12*fbm(q*9.);
        // sunspot near the zoom target
        vec2 sp=q-vec2(0.262,-0.118); float sd=length(sp*vec2(1.,1.3));
        float pen=smoothstep(0.009,0.006,sd), umb=smoothstep(0.004,0.0027,sd);
        float fil=0.8+0.2*sin(atan(sp.y,sp.x)*40.+fbm(sp*1500.)*5.);
        I=mix(I,0.42*fil+0.12,pen); I=mix(I,0.07,umb);
        I*=limb; vec3 hot=vec3(1.,0.92,0.6), mid=vec3(1.,0.58,0.16), dark=vec3(0.45,0.1,0.02);
        col=I>0.6?mix(mid,hot,(I-0.6)/0.4):mix(dark,mid,I/0.6); col*=0.95; }
      col+=(h21(px+fract(uT)*91.)-.5)*0.02;
      gl_FragColor=vec4(col,1.); }`,U);
  const TGT=new THREE.Vector2(0.255,-0.095);
  SCN[1]=function(lt){ const u=easeIO(cl((lt-0.15)/3.9)); const z=Math.exp(Math.log(1.0)+(Math.log(85)-Math.log(1.0))*u)*(1+0.012*lt);
    U.uZ.value=z; U.uC.value.set(TGT.x*(1-1/z),TGT.y*(1-1/z)); U.uT.value=lt*1.4+3.0; ren.render(sc,cam);
    const a=cl((lt-2.6)/0.3); fixLab('l1_0',560,640,a*win(lt,2.6,9)); fixLab('l1_1',140,990,win(lt,3.0,9)); fixLab('l1_2',600,1080,win(lt,0.5,2.3)*(1-a));
    caption(1,lt); };
})();

// ---------- S2 /scale Jupiter's Great Red Spot versus Earth: Jupiter's cloud bands flow, the oval storm swirls; Earth slides in on the spot
// to scale (spot ~16,500 km wide in 2014 and shrinking, NASA Hubble; Earth 12,742 km).
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); ren.toneMappingExposure=1.0;
  const cam=new THREE.OrthographicCamera(-540,540,960,-960,-2000,2000); cam.position.z=1000;
  const U={uT:{value:0},uS:{value:1},uO:{value:0},uER:{value:0}};
  const jm=fullQuad(sc,`uniform float uT,uS,uO,uER;
    vec3 band(float y){ float b=sin(y*0.021)*0.5+0.5, b2=sin(y*0.047+1.3)*0.5+0.5;
      vec3 cream=vec3(0.93,0.86,0.74), tan=vec3(0.72,0.53,0.38), brown=vec3(0.48,0.32,0.22);
      return mix(mix(brown,tan,b2),cream,smoothstep(0.35,0.75,b)); }
    void main(){ vec2 px=vec2(gl_FragCoord.x,1920.-gl_FragCoord.y); vec2 C=vec2(540.,760.);
      vec2 p=C+(px-C)/uS;
      vec2 e=(p-C)/vec2(400.,235.); float r=length(e);
      // swirl inside and around the oval (counter-clockwise), faster towards the rim
      float sw=uT*(0.55*smoothstep(1.25,0.25,r))+2.2*smoothstep(1.4,0.,r)*r;
      float cs=cos(sw), sn=sin(sw); vec2 er=mat2(cs,-sn,sn,cs)*e; vec2 pw=C+er*vec2(400.,235.);
      vec2 q=mix(pw,p,smoothstep(1.05,1.5,r));
      float flow=sin(q.y*0.02)*40.*uT; float warp=fbm(vec2(q.x*0.004+uT*0.02,q.y*0.012))*90.;
      float yy=q.y+warp*0.6; vec3 c=band(yy+fbm(vec2(q.x*0.006+flow*0.004,yy*0.02))*40.);
      c*=0.85+0.3*fbm(vec2((q.x+flow)*0.012,q.y*0.05));
      // the storm: brick red core with streaks, pale collar
      float core=smoothstep(1.0,0.55,r); vec3 red=mix(vec3(0.7,0.2,0.08),vec3(0.9,0.38,0.2),fbm(er*6.+3.));
      c=mix(c,red,core*0.95); float col=exp(-pow((r-1.08)/0.14,2.)); c=mix(c,vec3(0.95,0.9,0.82),col*0.55);
      c*=0.9+0.12*fbm(er*14.);
      float vig=smoothstep(1.3,0.35,length((px-vec2(540.,900.))/vec2(900.,1300.))); c*=0.55+0.45*vig;
      // dashed outline of the spot + two width bars (spot red, Earth blue), drawn in screen space
      float an=atan(e.y,e.x); float ring=exp(-pow((r-1.0)*235.*uS/3.5,2.))*step(0.,sin(an*36.)); c=mix(c,vec3(1.,0.35,0.2),ring*uO);
      float hw=400.*uS, by=C.y+235.*uS+38., by2=by+30.;
      float b1=step(abs(px.y-by),3.)*step(abs(px.x-540.),hw) + step(abs(px.y-by),14.)*step(abs(abs(px.x-540.)-hw),2.5);
      float b2=step(abs(px.y-by2),3.)*step(abs(px.x-540.),uER) + step(abs(px.y-by2),14.)*step(abs(abs(px.x-540.)-uER),2.5);
      c=mix(c,vec3(1.,0.38,0.22),clamp(b1,0.,1.)*uO); c=mix(c,vec3(0.45,0.72,1.),clamp(b2,0.,1.)*uO);
      gl_FragColor=vec4(pow(c,vec3(1.08))*0.95,1.); }`,U);
  sc.add(new THREE.AmbientLight(0x56607a,1.1)); const sun=new THREE.DirectionalLight(0xfff4e6,3.0); sun.position.set(-0.45,0.4,1); sc.add(sun);
  const E=earthReal(); const SPOTW=800, ER=SPOTW*12742/16500/2; const EG=new THREE.Group(); sc.add(EG);
  const earth=new THREE.Mesh(new THREE.SphereGeometry(ER,96,64),new THREE.MeshStandardMaterial({map:E.day,roughness:.75})); earth.rotation.set(0.35,2.0,0); EG.add(earth);
  const clouds=new THREE.Mesh(new THREE.SphereGeometry(ER*1.008,96,64),new THREE.MeshStandardMaterial({color:0xffffff,alphaMap:E.clouds,transparent:true,opacity:.75,depthWrite:false})); clouds.rotation.copy(earth.rotation); EG.add(clouds);
  const atm=new THREE.Mesh(new THREE.SphereGeometry(ER*1.05,64,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,
    vertexShader:'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader:'varying vec3 vN; void main(){ float i=pow(max(0.,0.72-dot(vN,vec3(0,0,1.))),4.); gl_FragColor=vec4(0.35,0.6,1.,1.)*i*1.2; }'})); EG.add(atm);
  const sh=new THREE.Mesh(new THREE.CircleGeometry(ER*1.15,64),new THREE.MeshBasicMaterial({map:canvasTex(128,128,(c,w,h)=>{ const g=c.createRadialGradient(64,64,30,64,64,64); g.addColorStop(0,'rgba(0,0,0,.45)'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false}));
  sh.position.set(30,-36,-400); EG.add(sh);
  SCN[2]=function(lt){ const s=1.12-0.12*easeIO(cl(lt/4.4)); U.uS.value=s; U.uT.value=lt+2.0;
    const a=ease(cl((lt-0.9)/1.3)); EG.position.set(lerp(700,0,a), 960-760+lerp(260,0,a),0); EG.scale.setScalar(s); earth.rotation.y=2.0+lt*0.08; clouds.rotation.y=2.0+lt*0.1; EG.visible=lt>0.85;
    const o=ease(cl((lt-2.25)/0.6)); U.uO.value=o; U.uER.value=ER*s; [earth,clouds].forEach(m=>{ m.material.transparent=true; }); earth.material.opacity=1-0.55*o; clouds.material.opacity=0.75*(1-0.6*o); atm.visible=o<0.5; sh.material.opacity=1-o;
    ren.render(sc,cam);
    const sw=SPOTW*s/2; fixLab('l2_0',70,760+235*s+135,win(lt,0.35,9)); fixLab('l2_1',720,450,win(lt,2.2,9)); fixLab('l2_2',70,450,win(lt,3.0,9));
    caption(2,lt); };
})();
