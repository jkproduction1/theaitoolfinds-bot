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


function fixLab(id,x,y,a){ const el=document.getElementById(id); if(!el) return; const w=el.offsetWidth||300; x=Math.max(92,Math.min(1004-w,x)); y=Math.max(470,Math.min(1120,y));
  el.style.left=x+'px'; el.style.top=y+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); if(ld) ld.style.width='0px'; }
function anch(id,obj,cam,a,dx,dy){ const v=new THREE.Vector3(); obj.getWorldPosition(v); const [x,y]=proj(v,cam); fixLab(id,x+(dx||24),y+(dy||0),a); }
// shared x-ray material (fresnel rim, additive) with optional arm wave and a horizontal scan band in world y
function xrayMat(col,o){ o=o||{}; return new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false,
  uniforms:{uT:{value:0},uScan:{value:99},uC:{value:new THREE.Color(col)},uW:{value:o.wave||0},uPh:{value:o.ph||0},uA:{value:o.a??1}},
  vertexShader:`uniform float uT,uW,uPh; varying vec3 vN; varying vec3 vV; varying float vY;
    void main(){ vec3 p=position; float s=max(0.,-p.y); p.x+=sin(p.y*2.2+uT*1.6+uPh)*s*s*uW*0.08; p.z+=cos(p.y*1.8+uT*1.3+uPh*1.7)*s*s*uW*0.06;
      vec4 w=modelMatrix*vec4(p,1.); vY=w.y; vec4 mv=viewMatrix*w; vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
  fragmentShader:`uniform vec3 uC; uniform float uScan,uA; varying vec3 vN; varying vec3 vV; varying float vY;
    void main(){ float f=1.-abs(dot(normalize(vN),vV)); float a=pow(f,2.2)*0.85+0.06; float sb=exp(-pow((vY-uScan)/0.12,2.))*1.6;
      gl_FragColor=vec4(uC*(a+sb*0.6)*uA+vec3(0.8,0.95,1.)*sb*0.25*uA,1.); }`}); }

// ---------- S0 /deep-dive a shipwreck 4 km down: the sub's lights cut through marine snow, the depth counter climbs 3,200 -> 4,000 m, then a
// broken, rusting steel hull rises out of the dark on the seabed. ~400 atm at 4,000 m (+1 atm per ~10 m, NOAA); no sunlight below ~1,000 m.
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); ren.toneMappingExposure=1.0; ren.setClearColor(0x010509,1);
  sc.background=new THREE.Color(0x010509); sc.fog=new THREE.FogExp2(0x020c16,0.045);
  const cam=new THREE.PerspectiveCamera(44,1080/1920,0.05,200); sc.add(cam); const P=mkComposer(ren,sc,cam,{bloom:0.4,radius:0.6,th:0.8});
  sc.add(new THREE.HemisphereLight(0x22405a,0x040302,0.35));
  [[-0.5,0],[0.5,1]].forEach(([x,i])=>{ const s=new THREE.SpotLight(0xe8f4ff,4.2,34,0.36,0.75,1.0); s.position.set(x,-0.25,0.2); const tg=new THREE.Object3D(); tg.position.set(x*0.4,-2.2,-8); cam.add(s); cam.add(tg); s.target=tg; });
  // visible light beams (additive cones)
  const bm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false,uniforms:{uA:{value:0.6}},
    vertexShader:'varying vec2 vU; varying vec3 vN; varying vec3 vV; void main(){ vU=uv; vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
    fragmentShader:'uniform float uA; varying vec2 vU; varying vec3 vN; varying vec3 vV; void main(){ float a=pow(vU.y,2.2)*pow(abs(dot(vN,vV)),1.4)*uA; gl_FragColor=vec4(vec3(0.55,0.75,0.95)*a*0.12,1.); }'});
  [-0.5,0.5].forEach(x=>{ const g=new THREE.ConeGeometry(2.2,9,40,1,true); g.translate(0,-4.5,0); const b=new THREE.Mesh(g,bm); b.position.set(x,-0.3,0.1); b.lookAt(x*0.4,-2.2,-8); b.rotateX(-Math.PI/2); cam.add(b); });
  // seabed
  const n=vnoise(5), sg=new THREE.PlaneGeometry(90,90,220,220); sg.rotateX(-Math.PI/2); const sp=sg.attributes.position;
  for(let i=0;i<sp.count;i++){ const x=sp.getX(i), z=sp.getZ(i); let y=(fbm(n,x*0.12+20,z*0.12+20,5)-0.5)*1.4+(fbm(n,x*0.9,z*0.9,3)-0.5)*0.12;
    const dh=Math.max(0,1-Math.hypot((x-1)/7,z/2.6)); y+=dh*dh*0.9; sp.setY(i,y); } sg.computeVertexNormals();
  const sand=canvasTex(512,512,(c,w,h)=>{ const r=rnd(4); c.fillStyle='#5d5a52'; c.fillRect(0,0,w,h); for(let i=0;i<9000;i++){ const v=70+r()*60|0; c.fillStyle=`rgba(${v},${v-4},${v-12},.35)`; c.fillRect(r()*w,r()*h,1+r()*2,1+r()*2); } });
  sand.wrapS=sand.wrapT=THREE.RepeatWrapping; sand.repeat.set(18,18);
  const bed=new THREE.Mesh(sg,new THREE.MeshStandardMaterial({map:sand,color:0x2e2b27,roughness:1})); bed.position.y=-1.4; sc.add(bed);
  // the wreck: tapered steel hull (bow section), rust streaks + portholes, broken jagged stern end, deck rails, a fallen mast
  const L=11,Hh=2.4,Wd=2.2; const hg=new THREE.BoxGeometry(L,Hh,Wd,80,10,14); const hp=hg.attributes.position;
  for(let i=0;i<hp.count;i++){ let x=hp.getX(i), y=hp.getY(i), z=hp.getZ(i); const u=x/(L/2), v=(y+Hh/2)/Hh;
    let sw=0.18+0.82*Math.pow(v,0.45); if(u>0.45){ const b=(u-0.45)/0.55; sw*=1-0.96*b*b; } z*=sw;
    y+= (u>0.3? Math.pow((u-0.3)/0.7,2)*0.45*v : 0); const br=(x<-L/2+0.05)? (Math.sin(y*9)+Math.sin(z*13))*0.22 : 0; hp.setXYZ(i,x+br,y,z); }
  hg.computeVertexNormals();
  const rust=canvasTex(2048,512,(c,w,h)=>{ const r=rnd(12); c.fillStyle='#3a2c24'; c.fillRect(0,0,w,h);
    for(let i=0;i<1600;i++){ const x=r()*w, y=r()*h, l=20+r()*160; const g=c.createLinearGradient(x,y,x,y+l); const tone=r()<0.6?'120,58,28':'70,52,40'; g.addColorStop(0,`rgba(${tone},${.25+r()*.4})`); g.addColorStop(1,`rgba(${tone},0)`); c.fillStyle=g; c.fillRect(x,y,2+r()*6,l); }
    for(let i=0;i<300;i++){ c.fillStyle=`rgba(${150+r()*60|0},${80+r()*40|0},${40+r()*20|0},${.15+r()*.25})`; c.beginPath(); c.arc(r()*w,r()*h,3+r()*18,0,7); c.fill(); }
    c.strokeStyle='rgba(20,14,10,.55)'; c.lineWidth=3; for(let x=0;x<w;x+=64){ c.beginPath(); c.moveTo(x,0); c.lineTo(x,h); c.stroke(); } for(let y=0;y<h;y+=90){ c.beginPath(); c.moveTo(0,y); c.lineTo(w,y); c.stroke(); }
    for(let x=60;x<w*0.8;x+=58){ c.fillStyle='#0b0806'; c.beginPath(); c.arc(x,h*0.2,9,0,7); c.fill(); c.strokeStyle='rgba(160,110,70,.6)'; c.lineWidth=3; c.stroke(); } });
  const hm=new THREE.MeshStandardMaterial({map:rust,color:0xd8c6b8,roughness:0.92,metalness:0.25,side:THREE.DoubleSide});
  const W0=new THREE.Group(); sc.add(W0); W0.position.set(1.5,-0.55,0); W0.rotation.set(0.0,-0.35,0.09);
  const hull=new THREE.Mesh(hg,hm); W0.add(hull);
  const deck=new THREE.Mesh(new THREE.PlaneGeometry(L*0.98,Wd*0.92,40,4),new THREE.MeshStandardMaterial({color:0x2b241e,roughness:1})); deck.rotation.x=-Math.PI/2; deck.position.y=Hh/2-0.02;
  const dp=deck.geometry.attributes.position; for(let i=0;i<dp.count;i++){ const x=dp.getX(i), u=x/(L/2); let s=1; if(u>0.45){ const b=(u-0.45)/0.55; s=1-0.96*b*b; } dp.setY(i,dp.getY(i)*s); dp.setZ(i,(u>0.3?-Math.pow((u-0.3)/0.7,2)*0.45:0)); } W0.add(deck);
  const steel=new THREE.MeshStandardMaterial({color:0x2e2119,roughness:0.95,metalness:0.2});
  const R=rnd(31); for(let i=0;i<34;i++){ const x=-L/2+0.6+i*0.27; if(R()<0.3) continue; const u=x/(L/2); const zz=Wd/2*0.92*(u>0.45?1-0.96*((u-0.45)/0.55)**2:1);
    [1,-1].forEach(s=>{ const p=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.45,6),steel); p.position.set(x,Hh/2+0.22+(u>0.3?((u-0.3)/0.7)**2*0.45:0),zz*s); p.rotation.z=(R()-0.5)*0.4; W0.add(p); }); }
  const br=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.9,1.5),hm); br.position.set(-1.5,Hh/2+0.45,0); br.rotation.z=0.04; W0.add(br);
  const br2=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.5,1.1),hm); br2.position.set(-1.6,Hh/2+1.1,0); W0.add(br2);
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.11,5,10),hm); mast.position.set(2.0,Hh/2+0.6,0.6); mast.rotation.set(0.5,0,1.25); W0.add(mast);
  for(let i=0;i<14;i++){ const pl=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.4+R()*0.9,0.3+R()*0.6),hm); pl.position.set(-L/2+(R()-0.5)*0.3,(R()-0.5)*Hh,(R()-0.5)*Wd*0.9); pl.rotation.set(R()*0.8,R()*0.8,R()*0.8); W0.add(pl); }
  for(let i=0;i<18;i++){ const d=new THREE.Mesh(new THREE.BoxGeometry(0.2+R()*0.7,0.08+R()*0.25,0.2+R()*0.6),hm); d.position.set(-L/2-1-R()*5,-0.85+R()*0.1,(R()-0.5)*5); d.rotation.set(R(),R()*3,R()); sc.add(d); }
  // marine snow
  const N=3200, mp=new Float32Array(N*3), RS=rnd(77); for(let i=0;i<N;i++){ mp[i*3]=(RS()-0.5)*26; mp[i*3+1]=-1+RS()*26; mp[i*3+2]=-14+RS()*22; }
  const mg=new THREE.BufferGeometry(); mg.setAttribute('position',new THREE.BufferAttribute(mp,3));
  const snow=new THREE.Points(mg,new THREE.PointsMaterial({color:0xcfe2ee,size:0.04,transparent:true,opacity:0.75,depthWrite:false,map:canvasTex(32,32,(c,w,h)=>{ const g=c.createRadialGradient(16,16,0,16,16,16); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); })})); sc.add(snow);
  const dep=document.getElementById('dep'), depn=document.getElementById('depn'); let lastD='';
  const path=new THREE.CatmullRomCurve3([new THREE.Vector3(9,16,12.5),new THREE.Vector3(9.3,11,11.2),new THREE.Vector3(9.2,8.2,10.3),new THREE.Vector3(9.1,7.2,9.9),new THREE.Vector3(8.9,6.6,9.5)]);
  SCN[0]=function(lt){ const u=easeIO(cl(lt/3.3)); cam.position.copy(path.getPoint(u)); const look=new THREE.Vector3(lerp(6.0,4.3,smooth(0.1,1,u)),lerp(6,1.0,smooth(0,0.8,u)),lerp(4.0,1.7,smooth(0,0.85,u)));
    cam.lookAt(look); snow.position.y=lt*0.12; snow.rotation.y=lt*0.01; P.c.render();
    const dm=Math.round((3200+800*easeIO(cl(lt/1.7)))/10)*10; const ds=dm.toLocaleString('en-US'); if(ds!==lastD){ depn.textContent=ds; lastD=ds; } dep.style.opacity=win(lt,0.1,9,0.25);
    fixLab('l0_0',92,640,win(lt,0.2,1.8)); fixLab('l0_2',92,780,win(lt,0.9,9)); fixLab('l0_1',560,1080,win(lt,2.0,9));
    caption(0,lt); };
})();

// ---------- S1 /x-ray a giant squid: a translucent x-ray squid hangs in the dark, a scan line runs down its body, the camera pushes in on the eye
// (up to 10 in / ~25 cm, the largest eye of any animal, Smithsonian Ocean), the beak in the arm crown and the two long feeding tentacles.
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); ren.toneMappingExposure=1.0; bgGrad(sc,'#0b2238','#01050a');
  const cam=new THREE.PerspectiveCamera(36,1080/1920,0.05,200); const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.6});
  const SQ=new THREE.Group(); sc.add(SQ); const mats=[];
  const lathe=(pts,col,o)=>{ const m=xrayMat(col,o); mats.push(m); return new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r,y])=>new THREE.Vector2(r,y)),48),m); };
  // mantle (tip up) + head
  SQ.add(lathe([[0,2.3],[0.08,2.15],[0.2,1.8],[0.3,1.2],[0.34,0.6],[0.34,0.0],[0.3,-0.3],[0.22,-0.42],[0.27,-0.55],[0.3,-0.75],[0.26,-0.95],[0.17,-1.05],[0,-1.06]],0x3fb6ff));
  // fins
  [1,-1].forEach(s=>{ const sh=new THREE.Shape(); sh.moveTo(0,1.15); sh.quadraticCurveTo(0.55,1.75,0.02,2.3); sh.lineTo(0,1.15); const m=xrayMat(0x3fb6ff,{a:0.8}); mats.push(m);
    const f=new THREE.Mesh(new THREE.ShapeGeometry(sh,16),m); f.scale.x=s; f.position.x=s*0.05; SQ.add(f); });
  // gladius (pen) and gills
  const gl=lathe([[0,2.2],[0.03,1.8],[0.05,0.6],[0.02,-0.2],[0,-0.25]],0x7fd3ff,{a:0.7}); gl.position.z=-0.25; gl.scale.z=0.3; SQ.add(gl);
  [1,-1].forEach(s=>{ const g=lathe([[0,0.55],[0.06,0.4],[0.08,0.1],[0.05,-0.15],[0,-0.2]],0xff7ab0,{a:0.9}); g.position.set(s*0.15,0,0.08); SQ.add(g); });
  // eyes: big glowing spheres on both sides of the head
  const eyes=[]; [1,-1].forEach(s=>{ const e=new THREE.Group(); e.position.set(s*0.235,-0.72,0.03);
    const m=xrayMat(0xffb35a,{a:1.2}); mats.push(m); const b=new THREE.Mesh(new THREE.SphereGeometry(0.15,40,28),m); e.add(b);
    const pu=new THREE.Mesh(new THREE.SphereGeometry(0.07,24,16),glowMat(0xfff1d0,0.9)); pu.position.x=s*0.1; pu.scale.x=0.4; e.add(pu); SQ.add(e); eyes.push(e); });
  // beak in the arm crown
  const bk=new THREE.Group(); bk.position.set(0,-1.02,0); [[0.06,1],[-0.06,-1]].forEach(([z,s])=>{ const c=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.17,16),glowMat(0xffd27a,0.95)); c.position.z=z*0.6; c.rotation.x=Math.PI+s*0.35; bk.add(c); }); SQ.add(bk);
  // 8 arms + 2 long feeding tentacles with clubs (wave in the vertex shader)
  for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; const arm=lathe([[0.06,0],[0.055,-0.3],[0.04,-0.9],[0.022,-1.5],[0.006,-1.85],[0,-1.9]],0x3fb6ff,{wave:1,ph:i*0.9});
    arm.position.set(Math.cos(a)*0.11,-1.03,Math.sin(a)*0.11); arm.rotation.set(Math.sin(a)*0.22,0,-Math.cos(a)*0.22); SQ.add(arm); }
  [1,-1].forEach((s,i)=>{ const t=lathe([[0.03,0],[0.022,-1],[0.016,-2.6],[0.05,-3.0],[0.06,-3.3],[0.03,-3.55],[0,-3.6]],0x6fe0ff,{wave:0.55,ph:2+i*2});
    t.position.set(s*0.06,-1.05,0.08); t.rotation.z=s*0.06; SQ.add(t); });
  // scan ring
  const ring=new THREE.Mesh(new THREE.RingGeometry(0.0,1.2,64),new THREE.MeshBasicMaterial({map:canvasTex(256,256,(c,w,h)=>{ const g=c.createRadialGradient(128,128,0,128,128,128); g.addColorStop(0,'rgba(80,200,255,0)'); g.addColorStop(.75,'rgba(80,200,255,.10)'); g.addColorStop(.98,'rgba(160,230,255,.6)'); g.addColorStop(1,'rgba(160,230,255,0)'); c.fillStyle=g; c.fillRect(0,0,w,h); }),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false}));
  ring.rotation.x=-Math.PI/2; sc.add(ring);
  starField(sc,600,9,60);
  const tipP=new THREE.Object3D(); tipP.position.set(0.06,-3.0,0.08); SQ.add(tipP);
  SCN[1]=function(lt){ const u=easeIO(cl(lt/3.3)); SQ.rotation.y=0.9-0.55*u; SQ.position.y=Math.sin(lt*0.8)*0.06; SQ.rotation.z=Math.sin(lt*0.6)*0.03;
    const sy=lerp(0.6,-3.4,cl((lt-0.1)/1.7)); mats.forEach(m=>{ m.uniforms.uT.value=lt; m.uniforms.uScan.value=sy; }); ring.position.y=sy; ring.material.opacity=win(lt,0.1,1.8,0.2);
    const tgt=new THREE.Vector3(lerp(0,0.15,u),lerp(-0.9,-0.95,u),0); const d=lerp(8.0,4.3,u);
    cam.position.set(tgt.x+d*0.42,tgt.y+d*0.08,d*0.91); cam.lookAt(tgt); P.c.render();
    anch('l1_2',tipP,cam,win(lt,0.3,1.4),26,0); anch('l1_0',eyes[0],cam,win(lt,1.5,9),110,-80); anch('l1_1',bk,cam,win(lt,2.1,9),40,40);
    caption(1,lt); };
})();

// ---------- S2 /explain-3d how submarines survive the pressure: a cut-open round metal pressure hull, glowing arrows push in from every side
// and the sphere holds; then the camera tilts down to a thin can that gets crushed by the same squeeze.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); ren.toneMappingExposure=0.9; bgGrad(sc,'#123a5c','#02080f');
  sc.environment=hdrEnv(ren); const cam=new THREE.PerspectiveCamera(40,1080/1920,0.05,200); const P=mkComposer(ren,sc,cam,{bloom:0.45,radius:0.5,th:0.9});
  const key=new THREE.DirectionalLight(0xffffff,1.6); key.position.set(3,5,4); sc.add(key); sc.add(new THREE.AmbientLight(0x406080,0.4));
  const HG=new THREE.Group(); HG.rotation.y=3*Math.PI/4; sc.add(HG); const ro=1, ri=0.8;
  const ti=new THREE.MeshStandardMaterial({color:0xa9b2bc,metalness:1,roughness:0.32});
  HG.add(new THREE.Mesh(new THREE.SphereGeometry(ro,96,64,0,Math.PI*1.5),ti));
  HG.add(new THREE.Mesh(new THREE.SphereGeometry(ri,72,48,0,Math.PI*1.5),new THREE.MeshStandardMaterial({color:0x2b3540,metalness:0.6,roughness:0.6,side:THREE.BackSide})));
  const cutM=new THREE.MeshStandardMaterial({color:0xdfe5ea,metalness:0.7,roughness:0.42,side:THREE.DoubleSide});
  const r1=new THREE.Mesh(new THREE.RingGeometry(ri,ro,64,1,Math.PI/2,Math.PI),cutM); HG.add(r1);
  const r2=new THREE.Mesh(new THREE.RingGeometry(ri,ro,64,1,Math.PI/2,Math.PI),cutM); r2.rotation.y=-Math.PI/2; HG.add(r2);
  
  // arrows on a Fibonacci sphere, all pointing at the centre
  const am=glowMat(0x5fd0ff,0.95), arrows=[]; const NA=30;
  for(let i=0;i<NA;i++){ const y=1-2*(i+0.5)/NA, r=Math.sqrt(1-y*y), ph=i*2.39996; const dir=new THREE.Vector3(Math.cos(ph)*r,y,Math.sin(ph)*r);
    const a=new THREE.Group(); const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,0.38,8),am); sh.position.y=0.3; const hd=new THREE.Mesh(new THREE.ConeGeometry(0.055,0.13,14),am); hd.position.y=0.06; hd.rotation.x=Math.PI; a.add(sh); a.add(hd);
    a.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir); sc.add(a); arrows.push([a,dir,i]); }
  // a thin drinks can (no brand) below the hull, crushed by the same squeeze
  const CY=-2.25; const cg=new THREE.CylinderGeometry(0.2,0.2,0.62,56,30,false); const cp0=cg.attributes.position.array.slice();
  const ctex=canvasTex(512,256,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#d9dde2'); g.addColorStop(1,'#aeb4ba'); c.fillStyle=g; c.fillRect(0,0,w,h); c.fillStyle='#e8542f'; c.fillRect(0,h*0.32,w,h*0.36); c.fillStyle='rgba(255,255,255,.85)'; c.fillRect(0,h*0.47,w,h*0.04); });
  const can=new THREE.Mesh(cg,new THREE.MeshStandardMaterial({map:ctex,metalness:0.85,roughness:0.28})); can.position.set(0.15,CY,0.4); sc.add(can);
  const carrows=[]; for(let i=0;i<10;i++){ const ph=i/10*Math.PI*2; const dir=new THREE.Vector3(Math.cos(ph),(i%2?0.35:-0.35),Math.sin(ph)).normalize();
    const a=new THREE.Group(); const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.22,8),am); sh.position.y=0.17; const hd=new THREE.Mesh(new THREE.ConeGeometry(0.035,0.08,12),am); hd.position.y=0.03; hd.rotation.x=Math.PI; a.add(sh); a.add(hd);
    a.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir); sc.add(a); carrows.push([a,dir]); }
  const particles=new THREE.Points((()=>{ const g=new THREE.BufferGeometry(), p=new Float32Array(900*3), r=rnd(8); for(let i=0;i<900;i++){ p[i*3]=(r()-0.5)*12; p[i*3+1]=(r()-0.5)*14; p[i*3+2]=(r()-0.5)*10-2; } g.setAttribute('position',new THREE.BufferAttribute(p,3)); return g; })(),
    new THREE.PointsMaterial({color:0x9fd0ff,size:0.025,transparent:true,opacity:0.5,depthWrite:false})); sc.add(particles);
  SCN[2]=function(lt){ const u=easeIO(cl(lt/3.3)); HG.rotation.y=3*Math.PI/4-0.2+0.3*u; particles.position.y=lt*0.05;
    arrows.forEach(([a,dir,i])=>{ const t0=0.05+(i%10)*0.04; const k=easeIO(cl((lt-t0)/0.5)); const pulse=0.06*Math.sin((lt-t0)*6.5)*cl((lt-t0-0.5)/0.3);
      a.position.copy(dir).multiplyScalar(lerp(2.6,1.1+pulse,k)); a.scale.setScalar(k>0?1:0.001); });
    // can: arrows arrive 1.75-2.2, slow crush 2.15-3.05
    const ck=easeIO(cl((lt-1.75)/0.45)); carrows.forEach(([a,dir])=>{ a.position.copy(dir).multiplyScalar(lerp(1.2,0.3+0.06*cl((lt-2.15)/0.9),ck)).add(can.position); a.scale.setScalar(ck>0.01?1:0.001); });
    const cr=easeIO(cl((lt-2.15)/0.9)); const p=cg.attributes.position;
    for(let i=0;i<p.count;i++){ const x=cp0[i*3], y=cp0[i*3+1], z=cp0[i*3+2]; const ang=Math.atan2(z,x); const dent=1-cr*(0.2+0.09*Math.sin(ang*5+y*10)+0.04*Math.sin(ang*9-y*17));
      const ny=y*(1-0.38*cr)+Math.sin(ang*3)*0.02*cr; p.setXYZ(i,x*dent,ny,z*dent); } p.needsUpdate=true; cg.computeVertexNormals();
    const m=easeIO(cl((lt-1.25)/0.8)); const look=new THREE.Vector3(lerp(0,can.position.x,m),lerp(-0.35,CY-0.12,m),lerp(0,can.position.z,m)); const d=lerp(lerp(6.8,6.3,cl(lt/1.3)),lerp(2.45,2.3,cl((lt-2)/1.3)),m);
    const ang=0.25-0.2*u; cam.position.set(look.x+Math.sin(ang)*d,look.y+0.16*d,look.z+Math.cos(ang)*d); cam.lookAt(look); P.c.render();
    fixLab('l2_0',92,560,win(lt,0.4,1.35)); fixLab('l2_1',560,1080,win(lt,0.8,1.35)); fixLab('l2_2',560,1110,win(lt,2.3,9));
    caption(2,lt); };
})();
