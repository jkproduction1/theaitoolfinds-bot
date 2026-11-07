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
 const spot=new THREE.SpotLight(0xfff4e0,4,16,.45,.7,1.6);spot.position.set(1.2,.6,0);const tg=new THREE.Object3D();tg.position.set(8,0,0);car.add(tg);spot.target=tg;car.add(spot);
 car.traverse(m=>{if(m.isMesh&&m.material!==hl&&m.material!==tl)m.castShadow=true})}
const carGlowRed=new THREE.PointLight(0xff2a1f,.7,3,2);car.add(carGlowRed);carGlowRed.position.set(-1.6,.5,0);

// ---------- rain
const NR=5000,rp=new Float32Array(NR*6),rr=rnd(77),rseed=[];for(let i=0;i<NR;i++)rseed.push([rr()*60-30,rr()*24,rr()*60-30]);
const rainG=new THREE.BufferGeometry();rainG.setAttribute('position',new THREE.BufferAttribute(rp,3));
const rain=new THREE.LineSegments(rainG,new THREE.LineBasicMaterial({color:0x9fb0c8,transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(rain);
function updRain(t,c){for(let i=0;i<NR;i++){const s=rseed[i];const y=((s[1]-t*22)%24+24)%24;const x=c.x+s[0]+y*.08,z=c.z+s[2];rp.set([x,y,z,x+.05,y+.55,z],i*6)}rainG.attributes.position.needsUpdate=true}

// ---------- minimap (phone screen)
(function(){const s=$('mm');let h='';const R2=rnd(3);for(let i=0;i<12;i++){h+=`<line x1="${i*95-20}" y1="0" x2="${i*95-120}" y2="1260" stroke="#1f2125" stroke-width="${R2()<.3?18:9}"/>`;h+=`<line x1="0" y1="${i*120}" x2="1000" y2="${i*120+60}" stroke="#1f2125" stroke-width="${R2()<.3?18:9}"/>`}
 h+=`<path id="mmr" d="M 170 1020 L 300 690 L 640 760 L 760 380" fill="none" stroke="#276EF1" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1400" stroke-dashoffset="1400"/>`;
 h+=`<circle cx="170" cy="1020" r="24" fill="#F5F5F2"/><circle cx="170" cy="1020" r="46" fill="none" stroke="#276EF1" stroke-width="6" opacity=".6"/>`;s.innerHTML=h})();
(function(){const d=$('drops');const R3=rnd(19);let h='';for(let i=0;i<60;i++){const r=6+Math.pow(R3(),2.2)*34;h+=`<div class="drop" style="left:${R3()*1000}px;top:${R3()*2060}px;width:${r}px;height:${r*1.08}px"></div>`}d.innerHTML=h})();

// ---------- timeline: 5 scenes, hard cuts (S1 phone, S2 top view, S3 street level, S4 window, S5 home) + end card
const T={type0:.3,type1:.8,confirm:1.0,fly0:1.15,fly1:1.9,c3:3.2,n1:3.55,arrPick:5.5,c4:5.8,n2:5.9,c5:8.2,arrHome:9.3,n3:9.45,back:10.15,die:10.6,end:11.0};
const U_A=uAtPoint(-8,-7), U_MID=uAtPoint(20,0), U_B=uAtPoint(24,25);
function carAt(t){if(t<T.c3)return mix(.004,U_A*.8,inOut(cl((t-1.3)/1.9)));if(t<T.c4)return mix(U_A,U_PICK,inOut(cl((t-T.c3)/(T.arrPick-T.c3))));
  if(t<T.c5)return mix(U_PICK,U_MID,cl((t-T.c4)/(T.c5-T.c4))*.92+.08*inOut(cl((t-T.c4)/(T.c5-T.c4))));return mix(U_B,1,expoOut(cl((t-T.c5)/(T.arrHome-T.c5))))}
function banner(id,t0,t1,t){const el=$(id);const a=cl((t-t0)/.55),b=t1?cl((t-t1)/.3):0;const y=(1-expoOut(a))*-220+b*-220;const s=.94+.06*expoOut(a);el.style.opacity=(cl(a*3))*(1-b);el.style.transform=`translateY(${y}px) scale(${s})`;el.style.filter=`blur(${(1-cl(a*2.2))*10+b*8}px)`}
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
window.setT=function(t){
  // phone
  const typed='Home';const n=Math.max(0,Math.min(typed.length,Math.floor((t-T.type0)/((T.type1-T.type0)/typed.length))+1));
  $('wtxt').innerHTML=t<T.type0?'Where to?':`<span class="typed">${typed.slice(0,n)}</span><span class="car"></span>`;
  const arrived=t>T.arrHome;$('hi').textContent=arrived?"You've arrived":'Good evening';$('sheet').querySelectorAll('.row').forEach(r=>r.style.opacity=arrived?0:1);
  if(arrived){$('wtxt').innerHTML='<span class="typed">Home</span>';}
  $('cta').style.opacity=arrived?0:cl((t-T.type1)/.15);$('cta').style.transform=`scale(${t>T.confirm&&t<T.confirm+.15?.95:1})`;
  $('mmr').setAttribute('stroke-dashoffset',1400*(1-expoOut(cl((t-T.type1)/.5))));
  const f=inOut(cl((t-T.fly0)/(T.fly1-T.fly0)));const back=expoOut(cl((t-T.back)/.35));
  const ps=(1+f*2.6)*(t<T.back?1:1)+0, inPhone=t<T.c3?1:(t>=T.back?1:0);
  const scale=t>=T.back?mix(1.25,1,back):(.94+.06*expoOut(cl(t/.5)))*ps;
  $('phone').style.transform=`translate(-50%,-50%) scale(${scale}) rotate(${t>=T.back?0:-2+2*expoOut(cl(t/.8))}deg)`;
  $('phone').style.opacity=t>=T.back?cl(back*2):cl(1-f*2.6);
  $('bat').style.opacity=(t%0.6<.4||t>T.fly0)?1:.35;
  $('dead').style.opacity=cl((t-T.die)/.1);
  banner('n1',T.n1,T.c4-.25,t);banner('n2',T.n2,T.c5-.3,t);banner('n3',T.n3,T.die+.02,t);
  $('end').style.opacity=cl((t-T.end)/.2);const h1=$('end').querySelector('h1');const e=expoOut(cl((t-T.end-.15)/.9));h1.style.transform=`translateY(${(1-e)*40}px)`;h1.style.opacity=e;h1.style.letterSpacing=(-.045+(1-e)*.05)+'em';
  $('end').querySelector('p').style.opacity=expoOut(cl((t-T.end-.55)/.6));$('end').querySelector('small').style.opacity=cl((t-T.end-.8)/.5);
  // car on the route
  const u=carAt(t), uu=Math.max(1e-4,Math.min(.9999,u));const p=path.getPointAt(uu),tg=path.getTangentAt(uu);
  car.position.set(p.x,0,p.z);car.rotation.y=-Math.atan2(tg.z,tg.x);
  const reveal=expoOut(cl((t-T.fly0-.1)/1.2));routeCore.geometry.setDrawRange(0,Math.floor(800*Math.max(reveal,u))*6);routeGlow.geometry.setDrawRange(0,Math.floor(800*Math.max(reveal,u))*6);
  const pp=path.getPointAt(U_PICK);pin.position.set(pp.x,.18,pp.z);pin.scale.setScalar(t<T.c4?1+.12*Math.sin(t*5):.001);
  // cameras per scene
  let cP,cL;
  if(t<T.c3){ // S2: top view, slow descent while the route draws
    const k=inOut(cl((t-T.fly0)/2.0));cP=V3(-14+4*k,78-26*k,-4+6*k);cL=V3(-12+4*k,0,-6+4*k);
  } else if(t<T.c4){ // S3: street level, headlights come round the corner towards us and stop at the pickup
    const k=(t-T.c3)/(T.c4-T.c3);cP=V3(9.5-1.0*k,1.25+.05*Math.sin(t*1.3),1.8);cL=V3(-3.5,.9,-.2);
  } else if(t<T.c5){ // S4: beside the moving car, tight on the side window; city lights slide past in the glass
    const k=(t-T.c4)/(T.c5-T.c4);const nrm=V3(-tg.z,0,tg.x);
    cP=p.clone().addScaledVector(tg,-9.5+1.5*k).add(V3(0,6.8-1.2*k,0));cL=p.clone().addScaledVector(tg,5).add(V3(0,.4,0));
  } else { // S5: home, slow push-in while the car pulls up
    const k=inOut(cl((t-T.c5)/(T.back-T.c5)));cP=V3(23.6+.6*k,7.2-1.2*k,23.2+1.2*k);cL=V3(28.4,1.2,33.6);
  }
  cam.position.copy(cP);cam.lookAt(cL);cam.fov=38;cam.updateProjectionMatrix();
  const near=[];for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++){if((i+j)%2)continue;near.push([i*BS+1.85,j*BS+1.85])}
  near.sort((a,b)=>Math.hypot(a[0]-p.x,a[1]-p.z)-Math.hypot(b[0]-p.x,b[1]-p.z));lampLights.forEach((L,i)=>L.position.set(near[i][0],3.3,near[i][1]));
  streaks.forEach(m=>{if(!m.userData.b)m.userData.b=m.position.clone();const B0=m.userData.b,dx=cam.position.x-B0.x,dz=cam.position.z-B0.z,d=Math.hypot(dx,dz)||1;m.rotation.z=Math.atan2(-dx,-dz);m.position.set(B0.x+dx/d*4.4,.14,B0.z+dz/d*4.4);m.material.opacity=.75*cl((40-cam.position.y)/30)});
  updRain(t,cam.position);rain.material.opacity=.32*cl((22-cam.position.y)/12);
  if(t>T.fly0-.05 && t<T.back+.4) comp.render();
};
const q=new URLSearchParams(location.search);window.setT(parseFloat(q.get('t')||'0'));window.READY=true;
