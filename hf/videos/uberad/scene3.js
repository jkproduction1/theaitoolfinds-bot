// uberad scene: night city in code. window.setT(t) renders time t (seconds, 0..13).
const W=1080,H=1920, $=id=>document.getElementById(id);
const cl=x=>x<0?0:x>1?1:x, mix=(a,b,t)=>a+(b-a)*t;
const expoOut=x=>{x=cl(x);return x===1?1:1-Math.pow(2,-10*x)}, inOut=x=>{x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const spring=x=>{x=cl(x);const c1=1.35,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
function rnd(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t}
function rbox(w,h,d,r){const sh=new THREE.Shape(),x=-w/2,y=-h/2;r=Math.min(r,w/2,h/2);sh.moveTo(x+r,y);sh.lineTo(x+w-r,y);sh.quadraticCurveTo(x+w,y,x+w,y+r);sh.lineTo(x+w,y+h-r);sh.quadraticCurveTo(x+w,y+h,x+w-r,y+h);sh.lineTo(x+r,y+h);sh.quadraticCurveTo(x,y+h,x,y+h-r);sh.lineTo(x,y+r);sh.quadraticCurveTo(x,y,x+r,y);
  const bv=Math.min(d*.3,.04);const g=new THREE.ExtrudeGeometry(sh,{depth:Math.max(.001,d-2*bv),bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:4,curveSegments:10});g.translate(0,0,-(d-2*bv)/2);g.computeVertexNormals();return g}
function ribbon(curve,w,y,mat,N){N=N||400;const pos=[],idx=[];for(let i=0;i<=N;i++){const u=i/N,p=curve.getPointAt(u),t=curve.getTangentAt(u),n=new THREE.Vector3(-t.z,0,t.x).normalize();pos.push(p.x+n.x*w/2,y,p.z+n.z*w/2,p.x-n.x*w/2,y,p.z-n.z*w/2);if(i<N){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);mat.side=THREE.DoubleSide;return new THREE.Mesh(g,mat)}
function roundedPath(pts,r,y){const cp=new THREE.CurvePath(),P=pts.map(p=>new THREE.Vector3(p[0],y,p[1]));let cur=P[0].clone();
  for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i];if(i<P.length-1){const c=P[i+1],d1=b.clone().sub(a).normalize(),d2=c.clone().sub(b).normalize(),p1=b.clone().addScaledVector(d1,-r),p2=b.clone().addScaledVector(d2,r);cp.add(new THREE.LineCurve3(cur.clone(),p1));cp.add(new THREE.QuadraticBezierCurve3(p1,b.clone(),p2));cur=p2}else cp.add(new THREE.LineCurve3(cur.clone(),b.clone()))}return cp}
const glowTex=canvasTex(128,128,(g,w,h)=>{const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.45)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)});

// ---------- renderer
const ren=new THREE.WebGLRenderer({canvas:$('cv'),antialias:true,preserveDrawingBuffer:true});ren.setPixelRatio(1);ren.setSize(W,H,false);
ren.outputEncoding=THREE.sRGBEncoding;ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.0;ren.shadowMap.enabled=false;
const sc=new THREE.Scene();sc.background=new THREE.Color(0x07080a);sc.fog=new THREE.FogExp2(0x0a0c10,0.022);
const cam=new THREE.PerspectiveCamera(38,W/H,.1,400);
const comp=new THREE.EffectComposer(ren);comp.setPixelRatio(1);comp.setSize(W,H);comp.addPass(new THREE.RenderPass(sc,cam));
const bloom=new THREE.UnrealBloomPass(new THREE.Vector2(540,960),0.6,0.5,0.8);comp.addPass(bloom);
sc.add(new THREE.HemisphereLight(0x3a4560,0x050506,0.35));
function b64buf(s){const bin=atob(s),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u.buffer}
{const d=new THREE.EXRLoader().parse(b64buf(window.STUDIO_EXR));const tx=new THREE.DataTexture(d.data,d.width,d.height,d.format,d.type);tx.mapping=THREE.EquirectangularReflectionMapping;tx.minFilter=tx.magFilter=THREE.LinearFilter;tx.generateMipmaps=false;tx.flipY=false;tx.needsUpdate=true;
 sc.environment=new THREE.PMREMGenerator(ren).fromEquirectangular(tx).texture}
const L=c=>new THREE.Color(c).convertSRGBToLinear();
const moon=new THREE.DirectionalLight(0x8ea4d6,0.35);moon.position.set(-30,50,20);sc.add(moon);

// ---------- ground (wet asphalt) + blocks
const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshStandardMaterial({color:0x0b0c0e,roughness:.16,metalness:.7,envMapIntensity:.18}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;sc.add(ground);
const walkM=new THREE.MeshStandardMaterial({color:0x17181b,roughness:.45,metalness:.3,envMapIntensity:.12});
const winTex=[1,2,3,4].map(s=>canvasTex(256,512,(g,w,h)=>{const R=rnd(s*97);g.fillStyle='#16171a';g.fillRect(0,0,w,h);for(let y=10;y<h-10;y+=26)for(let x=10;x<w-10;x+=22){const v=R();g.fillStyle=v<.13?(R()<.7?'rgba(255,190,110,'+(.55+.4*R())+')':'rgba(190,210,255,.55)'):'rgba(255,255,255,.035)';g.fillRect(x,y,12,16)}}));
const BS=8, B=4.4, R=rnd(5), blocks=[];
const HOME=[28,36]; // block centre of home
for(let i=-9;i<=9;i++)for(let j=-9;j<=9;j++){const cx=i*BS+4,cz=j*BS+4;
  const w=new THREE.Mesh(new THREE.BoxGeometry(B+.6,.12,B+.6),walkM);w.position.set(cx,.06,cz);w.receiveShadow=true;sc.add(w);
  if(cx===HOME[0]&&cz===HOME[1])continue;
  const d=Math.hypot(cx,cz);const n=R()<.5?1:2;
  for(let k=0;k<n;k++){const bw=n===1?B:B/2-.15,bh=(cx===28&&cz===28)?1.1+R()*.4:1.4+R()*(3.2+5*Math.exp(-d*d/1600));const tex=winTex[Math.floor(R()*4)].clone();tex.needsUpdate=true;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(bw/2.2,bh/4.4);
    const m=new THREE.MeshStandardMaterial({color:0x1c1d20,roughness:.75,metalness:.15,envMapIntensity:.08,emissive:0xffffff,emissiveMap:tex,emissiveIntensity:1.0,map:tex});
    const b=new THREE.Mesh(new THREE.BoxGeometry(bw,bh,B),m);b.position.set(cx+(n===1?0:(k?1:-1)*(B/4+.07)),bh/2+.12,cz);b.castShadow=b.receiveShadow=true;sc.add(b);blocks.push(b)}}
// home: low house with a warm doorway
const home=new THREE.Group();home.position.set(HOME[0],0,HOME[1]);sc.add(home);
const hm=new THREE.MeshStandardMaterial({color:0x1f2024,roughness:.8,envMapIntensity:.05});const hb=new THREE.Mesh(new THREE.BoxGeometry(4.2,3.2,4.2),hm);hb.position.y=1.72;hb.castShadow=hb.receiveShadow=true;home.add(hb);
const door=new THREE.Mesh(new THREE.PlaneGeometry(.9,1.7),new THREE.MeshBasicMaterial({color:0xffc27a,toneMapped:false}));door.position.set(-1.2,.97,-2.11);door.rotation.y=Math.PI;home.add(door);
const wins=[[.6,2.2],[1.5,2.2],[.6,1.1],[1.5,1.1]];wins.forEach(([x,y],i)=>{const wm=new THREE.Mesh(new THREE.PlaneGeometry(.6,.6),new THREE.MeshBasicMaterial({color:i===1?0x2a2b30:0xffb15e,toneMapped:false}));wm.position.set(x,y,-2.11);wm.rotation.y=Math.PI;home.add(wm)});
const porch=new THREE.PointLight(0xffb547,.8,5,2);porch.position.set(HOME[0]-1.2,1.6,HOME[1]-3.6);sc.add(porch);

// ---------- street lamps
const poleM=new THREE.MeshStandardMaterial({color:0x26272b,roughness:.5,metalness:.6});const headM=new THREE.MeshBasicMaterial({color:0xffcf85,toneMapped:false});
const poolTex=canvasTex(256,256,(g,w,h)=>{const gr=g.createRadialGradient(128,128,0,128,128,128);gr.addColorStop(0,'rgba(255,181,71,.55)');gr.addColorStop(.5,'rgba(255,181,71,.18)');gr.addColorStop(1,'rgba(255,181,71,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)});
for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++){if((i+j)%2)continue;const x=i*BS+1.85,z=j*BS+1.85;
  const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.07,3.4,8),poleM);p.position.set(x,1.7,z);sc.add(p);
  const h=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),headM);h.position.set(x,3.45,z);sc.add(h);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffb547,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.55}));s.scale.set(2.2,2.2,1);s.position.copy(h.position);sc.add(s);
  const pool=new THREE.Mesh(new THREE.PlaneGeometry(7,7),new THREE.MeshBasicMaterial({map:poolTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.set(x,.135,z);sc.add(pool)}
const streakTex=canvasTex(64,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(255,181,71,0)');gr.addColorStop(.15,'rgba(255,181,71,.5)');gr.addColorStop(1,'rgba(255,181,71,0)');g.fillStyle=gr;g.fillRect(w*.3,0,w*.4,h)});
const streaks=[];for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++){if((i+j)%2)continue;const m=new THREE.Mesh(new THREE.PlaneGeometry(.9,9),new THREE.MeshBasicMaterial({map:streakTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.7}));m.rotation.x=-Math.PI/2;m.position.set(i*BS+1.85,.14,j*BS+1.85);sc.add(m);streaks.push(m)}
const lampLights=[];for(let k=0;k<3;k++){const L=new THREE.PointLight(0xffb547,3.2,12,1.8);sc.add(L);lampLights.push(L)}

// ---------- route + car
const path=roundedPath([[-40,-16],[-8,-16],[-8,0],[24,0],[24,32],[29.6,32]],2.6,.16);
const PICK=path.getUtoTmapping?null:null; // pickup = where the street turns onto y=0 (computed below)
let LEN=path.getLength(); function uAtPoint(x,z){let best=0,bd=1e9;for(let i=0;i<=600;i++){const p=path.getPointAt(i/600),d=Math.hypot(p.x-x,p.z-z);if(d<bd){bd=d;best=i/600}}return best}
const U_PICK=uAtPoint(0,0), U_HOME=1;
const routeCore=ribbon(path,.3,.17,new THREE.MeshBasicMaterial({color:L(0x276ef1),toneMapped:false,fog:false}),800);sc.add(routeCore);
const routeGlow=ribbon(path,1.5,.165,new THREE.MeshBasicMaterial({color:L(0x276ef1),transparent:true,opacity:.18,fog:false,blending:THREE.AdditiveBlending,depthWrite:false}),800);sc.add(routeGlow);
const pin=new THREE.Group();sc.add(pin);{const pm=new THREE.MeshBasicMaterial({color:0xf5f5f2,toneMapped:false});const r=new THREE.Mesh(new THREE.RingGeometry(.35,.55,40),new THREE.MeshBasicMaterial({color:L(0x276ef1),toneMapped:false,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;pin.add(r);const c=new THREE.Mesh(new THREE.CircleGeometry(.22,32),pm);c.rotation.x=-Math.PI/2;c.position.y=.01;pin.add(c)}
const car=new THREE.Group();sc.add(car);
{const paint=new THREE.MeshPhysicalMaterial({color:0x1b1d21,metalness:.45,roughness:.38,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:.12});const glass=new THREE.MeshPhysicalMaterial({color:0x07080a,metalness:.2,roughness:.05,clearcoat:1});
 const prof=new THREE.Shape();prof.moveTo(-1.16,.2);prof.lineTo(1.1,.2);prof.splineThru([new THREE.Vector2(1.2,.3),new THREE.Vector2(1.18,.46),new THREE.Vector2(.9,.53),new THREE.Vector2(.5,.57),new THREE.Vector2(.2,.82),new THREE.Vector2(-.2,.9),new THREE.Vector2(-.55,.88),new THREE.Vector2(-.9,.64),new THREE.Vector2(-1.14,.58),new THREE.Vector2(-1.2,.4),new THREE.Vector2(-1.16,.2)]);
 const bg=new THREE.ExtrudeGeometry(prof,{depth:.8,bevelEnabled:true,bevelThickness:.11,bevelSize:.09,bevelSegments:8,curveSegments:40});bg.translate(0,0,-.42);bg.computeVertexNormals();
 const body=new THREE.Mesh(bg,paint);car.add(body);
 const gp=new THREE.Shape();gp.moveTo(.47,.6);gp.splineThru([new THREE.Vector2(.2,.81),new THREE.Vector2(-.2,.87),new THREE.Vector2(-.52,.85),new THREE.Vector2(-.82,.64)]);gp.lineTo(.47,.6);
 const gg=new THREE.ExtrudeGeometry(gp,{depth:1.0,bevelEnabled:false,curveSegments:30});gg.translate(0,0,-.5);const cab=new THREE.Mesh(gg,glass);cab.scale.set(.98,1.0,1);cab.position.y=.012;car.add(cab);
 const wm=new THREE.MeshStandardMaterial({color:0x0b0b0c,roughness:.6}),rim=new THREE.MeshStandardMaterial({color:0x9a9ea6,metalness:1,roughness:.25});[[-.7,.47],[.7,.47],[-.7,-.47],[.7,-.47]].forEach(([x,z])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.2,28),wm);w.rotation.x=Math.PI/2;w.position.set(x,.23,z);car.add(w);const r=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.21,24),rim);r.rotation.x=Math.PI/2;r.position.set(x,.23,z);car.add(r)});
 const hl=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),tl=new THREE.MeshBasicMaterial({color:0xff2a1f,toneMapped:false});
 [-.33,.33].forEach(z=>{const h=new THREE.Mesh(new THREE.BoxGeometry(.06,.05,.24),hl);h.position.set(1.19,.42,z);car.add(h)});const tb=new THREE.Mesh(new THREE.BoxGeometry(.04,.05,.92),tl);tb.position.set(-1.22,.5,0);car.add(tb);
 const beam=new THREE.Mesh(new THREE.PlaneGeometry(9,4),new THREE.MeshBasicMaterial({map:canvasTex(256,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(255,248,230,.05)');gr.addColorStop(1,'rgba(255,248,230,0)');g.fillStyle=gr;g.beginPath();g.moveTo(0,h*.42);g.lineTo(w,0);g.lineTo(w,h);g.lineTo(0,h*.58);g.fill()}),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
 beam.rotation.x=-Math.PI/2;beam.position.set(5.6,.18,0);car.add(beam);
 const spot=new THREE.SpotLight(0xfff4e0,2,14,.45,.7,1.6);spot.position.set(1.2,.6,0);const tg=new THREE.Object3D();tg.position.set(8,0,0);car.add(tg);spot.target=tg;car.add(spot);
 car.traverse(m=>{if(m.isMesh&&m.material!==hl&&m.material!==tl)m.castShadow=true})}
const carGlowRed=new THREE.PointLight(0xff2a1f,.7,3,2);car.add(carGlowRed);carGlowRed.position.set(-1.6,.5,0);

// ---------- rain
const NR=5000,rp=new Float32Array(NR*6),rr=rnd(77),rseed=[];for(let i=0;i<NR;i++)rseed.push([rr()*60-30,rr()*24,rr()*60-30]);
const rainG=new THREE.BufferGeometry();rainG.setAttribute('position',new THREE.BufferAttribute(rp,3));
const rain=new THREE.LineSegments(rainG,new THREE.LineBasicMaterial({color:0x9fb0c8,transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(rain);
function updRain(t,c){for(let i=0;i<NR;i++){const s=rseed[i];const y=((s[1]-t*22)%24+24)%24;const x=c.x+s[0]+y*.08,z=c.z+s[2];rp.set([x,y,z,x+.05,y+.55,z],i*6)}rainG.attributes.position.needsUpdate=true}


// ================= v3 timeline: UI beats (black/white) alternate with 3D, hero = blue ETA chip / route =================
const T={s1:0, tap:1.05, grow0:1.18, s2:1.45, chip:1.95, s3:3.0, iris:3.62, arrPick:4.9, s4:5.0, s5:5.95, s6:8.0, s7:8.75, arrHome:9.45, s8:10.0, doneTap:10.95, wipe:11.15, end:11.45};
const U_A=uAtPoint(-8,-7), U_MID=uAtPoint(20,0), U_B=uAtPoint(24,25);
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const easeIO=x=>{x=cl(x);return x<.5?16*x*x*x*x*x:1-Math.pow(-2*x+2,5)/2}; // quint in-out
function show(id,a){$(id).style.opacity=a}
function ripple(id,t0,t,x,y){const el=$(id),k=cl((t-t0)/.42);el.style.left=x+'px';el.style.top=y+'px';el.style.transform=`translate(-50%,-50%) scale(${t<t0?0:1+expoOut(k)*7})`;el.style.opacity=t<t0?0:(1-k)}
function rise(el,t0,t,dy){const k=expoOut(cl((t-t0)/.55));el.style.opacity=cl((t-t0)/.18);el.style.transform=`translateY(${(1-k)*dy}px)`;el.style.filter=`blur(${(1-cl((t-t0)/.25))*6}px)`}
// ---- static UI builds
(function(){ // S2 map (dark, flat) — streets, parks, the route from the car to you
  const m=$('map');let h='<rect width="1080" height="1920" fill="#0A0A0B"/>';const R=rnd(11);
  for(let i=-2;i<14;i++){const x=i*120+(R()*20|0);h+=`<path d="M${x} -40 L${x+180} 1960" stroke="#16171A" stroke-width="${R()<.3?34:16}"/>`}
  for(let j=-2;j<22;j++){const y=j*110+(R()*20|0);h+=`<path d="M-40 ${y} L1120 ${y-120}" stroke="#16171A" stroke-width="${R()<.3?34:16}"/>`}
  h+=`<rect x="640" y="380" width="220" height="160" rx="24" fill="#111814" transform="rotate(-6 750 460)"/>`;
  h+=`<path id="rt" d="M 300 560 L 345 860 L 735 820 L 768 1110 L 560 1135" fill="none" stroke="#276EF1" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1400" stroke-dashoffset="1400"/>`;
  h+=`<circle id="you2" cx="560" cy="1135" r="70" fill="#276EF1" opacity=".18"/><circle cx="560" cy="1135" r="26" fill="#F5F5F2"/><circle cx="560" cy="1135" r="15" fill="#276EF1"/>`;
  h+=`<g id="mcar" transform="translate(300 560) rotate(80)"><rect x="-34" y="-17" width="68" height="34" rx="11" fill="#F5F5F2"/><rect x="-8" y="-13" width="26" height="26" rx="6" fill="#1C1D20"/></g>`;
  m.innerHTML=h;
  const od=$('od');od.innerHTML=[9,8,7,6,5].map(n=>`<span>${n}</span>`).join('');
  $('stars').innerHTML=[0,1,2,3,4].map(i=>`<svg viewBox="0 0 100 100" id="st${i}"><path d="M50 6 L62 37 L95 38 L69 58 L78 91 L50 72 L22 91 L31 58 L5 38 L38 37 Z" fill="#E4E4DF" stroke-linejoin="round"/></svg>`).join('');
})();
function carAt(t){if(t<T.s4)return mix(U_A,U_PICK,easeIO(cl((t-T.iris)/(T.arrPick-T.iris))));if(t<T.s7)return mix(U_PICK,U_MID,cl((t-T.s5)/(T.s6-T.s5)));return mix(U_B,1,expoOut(cl((t-T.s7)/(T.arrHome-T.s7))))}
function cam3(t,p,tg){ // returns [pos,look] for the 3D shot active at t
  if(t<T.s4+.05){const k=cl((t-T.iris)/(T.s4-T.iris));return [V3(9.5-1.0*k,1.25,1.8),V3(-3.5,.9,-.2)]}
  if(t<T.s6+.05){const k=cl((t-T.s5)/(T.s6-T.s5));return [p.clone().addScaledVector(tg,-9.5+1.5*k).add(V3(0,6.8-1.2*k,0)),p.clone().addScaledVector(tg,5).add(V3(0,.4,0))]}
  const k=easeIO(cl((t-T.s7)/(T.s8-T.s7)));return [V3(23.6+.6*k,7.2-1.2*k,23.2+1.2*k),V3(28.4,1.2,33.6)]}
const PV=new THREE.Vector3();
window.setT=function(t){
  // ---------- 3D state (always computed so match cuts can project into it)
  const u=carAt(t),uu=Math.max(1e-4,Math.min(.9999,u));const p=path.getPointAt(uu),tg=path.getTangentAt(uu);
  car.position.set(p.x,0,p.z);car.rotation.y=-Math.atan2(tg.z,tg.x);
  routeCore.geometry.setDrawRange(0,800*6);routeGlow.geometry.setDrawRange(0,800*6);
  const pp=path.getPointAt(U_PICK);pin.position.set(pp.x,.18,pp.z);pin.scale.setScalar(t<T.s4?1+.1*Math.sin(t*6):.001);
  const [cP,cL]=cam3(t,p,tg);cam.position.copy(cP);cam.lookAt(cL);cam.updateMatrixWorld();
  const near=[];for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++){if((i+j)%2)continue;near.push([i*BS+1.85,j*BS+1.85])}
  near.sort((a,b)=>Math.hypot(a[0]-p.x,a[1]-p.z)-Math.hypot(b[0]-p.x,b[1]-p.z));lampLights.forEach((L,i)=>L.position.set(near[i][0],3.3,near[i][1]));
  streaks.forEach(m=>{if(!m.userData.b)m.userData.b=m.position.clone();const B0=m.userData.b,dx=cam.position.x-B0.x,dz=cam.position.z-B0.z,d=Math.hypot(dx,dz)||1;m.rotation.z=Math.atan2(-dx,-dz);m.position.set(B0.x+dx/d*4.4,.14,B0.z+dz/d*4.4);m.material.opacity=.75*cl((40-cam.position.y)/30)});
  updRain(t,cam.position);rain.material.opacity=.32*cl((22-cam.position.y)/12);
  const in3d=(t>=T.iris-.02&&t<T.s4+.1)||(t>=T.s5-.15&&t<T.s6+.05)||(t>=T.s7-.05&&t<T.s8+.05);
  $('cv').style.opacity=in3d?1:0;$('vig').style.opacity=in3d?1:0; if(in3d) comp.render();
  // ---------- S1 app (white)
  show('s1',t<T.s2+.01?1:0);
  if(t<T.s2+.01){const h2=$('s1').querySelector('h2');rise(h2,0,t,50);rise($('where'),.08,t,50);
    const typed='Home',n=Math.max(0,Math.min(4,Math.floor((t-.22)/.08)+1));$('wtxt').innerHTML=t<.22?'Search destination':`<span class="ty">${typed.slice(0,n)}</span><span class="ca"></span>`;
    rise($('c1'),.42,t,80);rise($('c2'),.48,t,80);rise($('req'),.6,t,80);
    const press=(t>=T.tap&&t<T.tap+.07)?.96:1;$('req').style.transform+=` scale(${press})`;
    ripple('rip1',T.tap,t,540,1920-170-85);
    // button grows into the black screen (match on shape + colour)
    const g=easeIO(cl((t-T.grow0)/(T.s2-T.grow0)));const gr=$('grow');gr.style.opacity=t>=T.grow0?1:0;
    const x0=90,y0=1920-170-170,w0=900,h0=170;gr.style.left=mix(x0,0,g)+'px';gr.style.top=mix(y0,0,g)+'px';gr.style.width=mix(w0,1080,g)+'px';gr.style.height=mix(h0,1920,g)+'px';gr.style.borderRadius=mix(85,0,g)+'px';}
  // ---------- S2 map (black)
  show('s2',t>=T.s2&&t<T.s3?1:0);
  if(t>=T.s2&&t<T.s3){const k=easeIO(cl((t-T.s2-.05)/.7));$('rt').setAttribute('stroke-dashoffset',1400*(1-k));
    const pl=$('rt').getTotalLength(),cp=$('rt').getPointAtLength(pl*.08*cl((t-T.s2-.6)/.9));$('mcar').setAttribute('transform',`translate(${cp.x} ${cp.y}) rotate(80)`);
    const pu=.18+.1*Math.sin((t-T.s2)*7);$('you2').setAttribute('r',60+30*((t*1.6)%1));$('you2').setAttribute('opacity',.25*(1-((t*1.6)%1)));
    $('map').style.transform=`scale(${1.06-.06*expoOut(cl((t-T.s2)/1.2))})`;}
  // ---------- hero chip: pops above "you" on the map, odometer 9→5, then grows into the blue full screen
  const ch=$('chip');
  if(t>=T.chip&&t<T.s3+.45){const a=spring(cl((t-T.chip)/.45));const roll=easeIO(cl((t-T.chip-.15)/.5));$('od').firstChild.style.marginTop=0;
    [...$('od').children].forEach(s=>s.style.transform=`translateY(${-roll*4*1.1}em)`);
    ch.style.top='1000px';ch.style.opacity=cl((t-T.chip)/.12);
    const gg=easeIO(cl((t-T.s3)/.32));const sc=(.6+.4*a)*(1+gg*22);ch.style.transform=`translate(-50%,-50%) scale(${sc})`;ch.style.borderRadius=mix(60,6,gg)+'px';
    ch.style.color=gg>.08?'rgba(255,255,255,0)':'#fff';
  } else ch.style.opacity=0;
  // ---------- S3 big type on Uber blue, then iris down into the 3D pickup pin (match: blue circle)
  const s3=$('s3');s3.style.background='#276EF1';s3.style.color='#fff';
  if(t>=T.s3+.22&&t<T.iris+.35){s3.style.opacity=1;const b=$('big');const k=expoOut(cl((t-T.s3-.24)/.35));b.style.transform=`scale(${.86+.14*k})`;b.style.opacity=k*(1-cl((t-T.iris)/.1));b.style.letterSpacing=(-.06+(1-k)*.04)+'em';
    PV.copy(pin.position);PV.project(cam);const px=(PV.x*.5+.5)*1080,py=(-PV.y*.5+.5)*1920;const ir=easeIO(cl((t-T.iris)/.34));const R0=2300,R1=34;const r=mix(R0,R1,ir);
    s3.style.clipPath=t<T.iris?'none':`circle(${r}px at ${mix(540,px,ir)}px ${mix(960,py,ir)}px)`;s3.style.opacity=t<T.iris+.32?1:0;}
  else s3.style.opacity=0;
  // ---------- S4 driver card (black), card bar fills → becomes the route of the ride
  show('s4',t>=T.s4&&t<T.s5+.1?1:0);
  if(t>=T.s4&&t<T.s5+.1){rise($('drv'),T.s4,t,520);const r1=$('drv').querySelector('.row1'),ms=$('drv').querySelector('.msg');rise(r1,T.s4+.1,t,40);rise(ms,T.s4+.18,t,40);
    $('barf').style.width=(100*easeIO(cl((t-T.s4-.45)/.45)))+'%';
    const out=easeIO(cl((t-(T.s5-.2))/.3));$('s4').style.opacity=1-out;$('drv').style.transform+=` translateY(${out*400}px)`;}
  // ---------- notification during the ride
  const nt=$('nt');if(t>=T.s5+.15&&t<T.s6){const k=expoOut(cl((t-T.s5-.15)/.5));nt.style.opacity=cl((t-T.s5-.15)/.15)*(1-cl((t-T.s6+.25)/.2));nt.style.transform=`translateY(${(1-k)*-200}px)`;}else nt.style.opacity=0;
  // ---------- S6 arrived: check circle springs in, stroke draws
  show('s6',t>=T.s6&&t<T.s7?1:0);
  if(t>=T.s6&&t<T.s7){const a=spring(cl((t-T.s6)/.4));$('chk').style.transform=`scale(${a})`;$('chkp').setAttribute('stroke-dashoffset',200*(1-easeIO(cl((t-T.s6-.12)/.3))));
    rise($('s6').querySelector('.h'),T.s6+.12,t,40);rise($('s6').querySelector('.s'),T.s6+.2,t,40);
    const o=easeIO(cl((t-(T.s7-.18))/.2));$('s6').style.opacity=1-o;}
  // ---------- S8 rating (white): stars fill one by one, tap Done
  show('s8',t>=T.s8&&t<T.end?1:0);
  if(t>=T.s8&&t<T.end){rise($('s8').querySelector('.q'),T.s8,t,50);for(let i=0;i<5;i++){const ti=T.s8+.25+i*.12;const a=spring(cl((t-ti)/.35));const el=$('st'+i);el.style.transform=`scale(${t<ti?.85:(.85+.15*a)})`;el.querySelector('path').setAttribute('fill',t>=ti?'#0A0A0B':'#E4E4DF')}
    rise($('done'),T.s8+.2,t,60);$('done').style.transform+=` scale(${(t>=T.doneTap&&t<T.doneTap+.07)?.96:1})`;ripple('rip2',T.doneTap,t,340,80);}
  // ---------- wipe from the Done button (black grows) → end card
  const w=$('wipe');const wk=easeIO(cl((t-T.wipe)/.34));w.style.top=(960+60+60+160/2+90)+'px';w.style.transform=`translate(-50%,-50%) scale(${t<T.wipe?0:wk*450})`;
  $('end').style.opacity=t>=T.end?1:0;const h1=$('end').querySelector('h1');const e=expoOut(cl((t-T.end-.1)/.9));h1.style.opacity=e;h1.style.transform=`translateY(${(1-e)*36}px)`;h1.style.filter=`blur(${(1-cl((t-T.end-.1)/.15))*8}px)`;h1.style.letterSpacing=(-.045+(1-e)*.04)+'em';
  $('end').querySelector('small').style.opacity=cl((t-T.end-.6)/.5);
};
const q=new URLSearchParams(location.search);window.setT(parseFloat(q.get('t')||'0'));window.READY=true;
