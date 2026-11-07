
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
