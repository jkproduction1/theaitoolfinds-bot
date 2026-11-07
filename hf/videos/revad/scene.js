// revad scene: window.setT(t), t in 0..13 s. Deterministic (no state between frames).
const W=1920,H=1080,$=id=>document.getElementById(id);
const cl=x=>x<0?0:x>1?1:x, mix=(a,b,t)=>a+(b-a)*t;
const expoOut=x=>{x=cl(x);return x===1?1:1-Math.pow(2,-10*x)}, io=x=>{x=cl(x);return x<.5?16*x**5:1-Math.pow(-2*x+2,5)/2};
const spring=x=>{x=cl(x);const c1=1.2,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
function rnd(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}
function b64buf(s){const bin=atob(s),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u.buffer}
function rrect(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function rr2d(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function mkTex(c){const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return mkTex(c)}
const FN='IDs, Inter, sans-serif';
const T={tap:1.0,grow:1.12,s2:1.4,notif:2.1,push:2.95,s3:3.2,conv:4.0,exTap:4.95,s4:5.4,face:6.05,toTerm:6.35,nfc:6.7,paid:6.95,s5:7.6,s6:8.6,end:10.6};

// ---------------- three.js
const ren=new THREE.WebGLRenderer({canvas:$('cv'),antialias:true,preserveDrawingBuffer:true});ren.setPixelRatio(1);ren.setSize(W,H,false);ren.outputEncoding=THREE.sRGBEncoding;ren.toneMapping=THREE.ACESFilmicToneMapping;
const sc=new THREE.Scene();sc.background=new THREE.Color(0x07070a);
{const d=new THREE.EXRLoader().parse(b64buf(window.STUDIO_EXR));const tx=new THREE.DataTexture(d.data,d.width,d.height,d.format,d.type);tx.mapping=THREE.EquirectangularReflectionMapping;tx.minFilter=tx.magFilter=THREE.LinearFilter;tx.generateMipmaps=false;tx.flipY=false;tx.needsUpdate=true;sc.environment=new THREE.PMREMGenerator(ren).fromEquirectangular(tx).texture}
const cam=new THREE.PerspectiveCamera(28,W/H,.1,100);
const comp=new THREE.EffectComposer(ren);comp.setPixelRatio(1);comp.setSize(W,H);comp.addPass(new THREE.RenderPass(sc,cam));comp.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(960,540),.35,.5,.96));
const key=new THREE.DirectionalLight(0xffffff,.6);key.position.set(-3,4,6);sc.add(key);
const vio=new THREE.PointLight(0x7a52ff,30,14,2);vio.position.set(0,1,-2.5);sc.add(vio);const blu=new THREE.PointLight(0x3d5afe,12,14,2);blu.position.set(-3,-1,2);sc.add(blu);
const colT=canvasTex(256,512,(g,w,h)=>{const gr=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.5);gr.addColorStop(0,'rgba(120,80,255,.9)');gr.addColorStop(.5,'rgba(90,60,255,.35)');gr.addColorStop(1,'rgba(90,60,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)});
const col=new THREE.Mesh(new THREE.PlaneGeometry(5,11),new THREE.MeshBasicMaterial({map:colT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.55}));col.position.z=-4;sc.add(col);
// phone with a live lock screen (canvas redrawn per frame)
const lockC=document.createElement('canvas');lockC.width=780;lockC.height=1690;const lockT=mkTex(lockC);
function drawLock(n){const g=lockC.getContext('2d'),w=780,h=1690;const bg=g.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#1b1550');bg.addColorStop(.55,'#3b2a8f');bg.addColorStop(1,'#0a0a18');g.fillStyle=bg;g.fillRect(0,0,w,h);
  const r2=g.createRadialGradient(w*.75,h*.25,10,w*.75,h*.25,w*.9);r2.addColorStop(0,'rgba(140,110,255,.55)');r2.addColorStop(1,'rgba(140,110,255,0)');g.fillStyle=r2;g.fillRect(0,0,w,h);
  g.fillStyle='#000';rr2d(g,w/2-120,30,240,70,35);g.fill();g.fillStyle='rgba(255,255,255,.9)';g.font=`600 34px ${FN}`;g.textAlign='left';g.fillText('JFK',70,80);g.textAlign='right';g.fillText('5G',w-70,80);
  g.textAlign='center';g.fillStyle='rgba(255,255,255,.85)';g.font=`500 40px ${FN}`;g.fillText('Saturday 8 November',w/2,250);g.fillStyle='#fff';g.font=`300 230px ${FN}`;g.fillText('14:05',w/2,470);
  if(n>0){const y=560-(1-n)*90;g.globalAlpha=n;g.fillStyle='rgba(30,26,52,.78)';rr2d(g,36,y,w-72,230,48);g.fill();g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=2;g.stroke();
    const ig=g.createLinearGradient(70,y+40,150,y+120);ig.addColorStop(0,'#3D5AFE');ig.addColorStop(1,'#8B5CF6');g.fillStyle=ig;rr2d(g,70,y+40,84,84,22);g.fill();
    g.textAlign='left';g.fillStyle='rgba(255,255,255,.6)';g.font=`600 28px ${FN}`;g.fillText('REVOLUT',180,y+66);g.textAlign='right';g.fillText('now',w-70,y+66);g.textAlign='left';
    g.fillStyle='#fff';g.font=`600 40px ${FN}`;g.fillText('Welcome to New York',180,y+118);g.fillStyle='rgba(255,255,255,.75)';g.font=`500 32px ${FN}`;g.fillText('Exchange at the real rate, no hidden fees.',180,y+166);g.fillText('Your card works everywhere.',180,y+206);g.globalAlpha=1}
  lockT.needsUpdate=true}
function phone(tex){const G=new THREE.Group();const w=.78,h=1.62,dpt=.085;
  {const bd=new THREE.Mesh(new THREE.ExtrudeGeometry(rrect(w,h,.13),{depth:dpt,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:5,curveSegments:24}),new THREE.MeshPhysicalMaterial({color:0x4a4b55,metalness:1,roughness:.32,clearcoat:.5,envMapIntensity:.7}));bd.position.z=-dpt/2;G.add(bd)}
  const sg=new THREE.ShapeGeometry(rrect(w-.05,h-.05,.11),24);const uv=sg.attributes.uv,p=sg.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,p.getX(i)/(w-.05)+.5,p.getY(i)/(h-.05)+.5);
  const scr=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));scr.position.z=dpt/2+.013;G.add(scr);return G}
const PH=phone(lockT);sc.add(PH);
// metal card (front print, fictional numbers) + payment terminal
const CW=3.37,CH=2.125,TH=.045;const cardG=new THREE.Group();sc.add(cardG);
{const geo=new THREE.ExtrudeGeometry(rrect(CW,CH,.17),{depth:TH,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:4,curveSegments:16});geo.translate(0,0,-TH/2);
 const uv=geo.attributes.uv,p=geo.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,p.getX(i)/CW+.5,p.getY(i)/CH+.5);
 const face=canvasTex(1024,646,(g,w,h)=>{const gr=g.createLinearGradient(0,h,w,0);gr.addColorStop(0,'#24186b');gr.addColorStop(.5,'#3449e0');gr.addColorStop(1,'#b24fd6');g.fillStyle=gr;g.fillRect(0,0,w,h);const R=rnd(3);for(let i=0;i<2500;i++){g.fillStyle=`rgba(255,255,255,${R()*.03})`;g.fillRect(0,R()*h,w,1)}
   g.fillStyle='rgba(255,255,255,.92)';g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=3;g.shadowOffsetY=2;g.font=`600 40px ${FN}`;g.fillText('Revolut',72,110);g.font=`600 30px ${FN}`;g.textAlign='right';g.fillText('DEBIT',w-72,110);g.textAlign='left';
   g.font=`500 64px ${FN}`;g.fillText('1234  5678  9012  3456',72,420);g.font=`500 24px ${FN}`;g.fillStyle='rgba(255,255,255,.7)';g.fillText('VALID THRU',560,500);g.fillText('CVC',800,500);g.font=`600 38px ${FN}`;g.fillStyle='rgba(255,255,255,.92)';g.fillText('08/29',560,545);g.fillText('123',800,545);g.font=`600 36px ${FN}`;g.fillText('JAN NOVAK',72,560)});
 cardG.add(new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({map:face,metalness:.85,roughness:.34,clearcoat:.4,clearcoatRoughness:.25,iridescence:.3,iridescenceIOR:1.5,envMapIntensity:.4})));
 const chip=new THREE.Mesh(new THREE.PlaneGeometry(.46,.36),new THREE.MeshBasicMaterial({map:canvasTex(256,200,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#e9cf8a');gr.addColorStop(.5,'#b58a3a');gr.addColorStop(1,'#d9b765');g.fillStyle=gr;g.fillRect(0,0,w,h);g.strokeStyle='rgba(80,55,15,.55)';g.lineWidth=5;[[0,70,90,70],[0,130,90,130],[166,70,256,70],[166,130,256,130],[90,40,90,160],[166,40,166,160],[90,40,166,40],[90,160,166,160]].forEach(([a,b,c,d])=>{g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke()})})}));chip.position.set(-1.1,.18,TH/2+.012);cardG.add(chip)}
const term=new THREE.Group();sc.add(term);
{const body=new THREE.Mesh(new THREE.ExtrudeGeometry(rrect(1.15,2.0,.2),{depth:.28,bevelEnabled:true,bevelThickness:.04,bevelSize:.04,bevelSegments:5}),new THREE.MeshPhysicalMaterial({color:0x111116,roughness:.55,metalness:0,clearcoat:.3,clearcoatRoughness:.3,envMapIntensity:.15}));body.position.z=-.14;term.add(body);
 const tsc=canvasTex(512,520,(g,w,h)=>{g.fillStyle='#0b0b10';g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.55)';g.font=`600 34px ${FN}`;g.textAlign='center';g.fillText('Brooklyn Roasters',w/2,120);g.fillStyle='#fff';g.font=`600 120px ${FN}`;g.fillText('$4.50',w/2,290);g.fillStyle='rgba(255,255,255,.5)';g.font=`500 30px ${FN}`;g.fillText('Tap to pay',w/2,390)});
 const s=new THREE.Mesh(new THREE.PlaneGeometry(.92,.94),new THREE.MeshBasicMaterial({map:tsc,toneMapped:false}));s.position.set(0,.42,.19);term.add(s);
 for(let i=0;i<12;i++){const k=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.03,20),new THREE.MeshStandardMaterial({color:0x2a2a33,roughness:.6,envMapIntensity:.15}));k.rotation.x=Math.PI/2;k.position.set(-.27+(i%3)*.27,-.25-Math.floor(i/3)*.2,.18);term.add(k)}}
const rings=[0,1,2].map(i=>{const m=new THREE.Mesh(new THREE.TorusGeometry(.5,.012,10,80),new THREE.MeshBasicMaterial({color:0xb9b2ff,transparent:true,opacity:0,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(m);return m});

// ---------------- 2D builds
(function(){const R=rnd(21);let pts=[],y=400;for(let i=0;i<=120;i++){y=Math.max(70,Math.min(430,y+(R()-.56)*24));pts.push([i*6.9,y])}
 const d='M'+pts.map(p=>p.join(' ')).join(' L ');const last=pts[pts.length-1];window.CHART={last,pts};let grid='';for(let k=0;k<5;k++)grid+=`<line x1="0" x2="920" y1="${60+k*95}" y2="${60+k*95}" stroke="#1a1a24" stroke-width="2"/>`;
 $('s3').innerHTML=`<div class="lab">EXCHANGE RATE</div><div class="pair">1 EUR <span>=</span> <b id="rate">1.0842</b> USD</div><div class="chg">▲ 0.36 % today</div>
  <svg width="940" height="480" viewBox="0 0 940 480"><defs><linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b5cff" stop-opacity=".45"/><stop offset="1" stop-color="#5b5cff" stop-opacity="0"/></linearGradient><clipPath id="cp"><rect id="cpr" x="0" y="0" width="0" height="480"/></clipPath></defs>${grid}
  <g clip-path="url(#cp)"><path d="${d} L ${last[0]} 470 L 0 470 Z" fill="url(#fa)"/><path d="${d}" fill="none" stroke="#8b8cff" stroke-width="5" stroke-linejoin="round"/></g><circle id="dot" cx="0" cy="0" r="12" fill="#fff"/><circle id="dot2" cx="0" cy="0" r="26" fill="#fff" opacity=".18"/></svg>
  <div id="pill">1.0842</div>
  <div class="conv" id="conv"><div style="position:relative"><div class="row"><div class="flag" style="background:#1e3a8a;color:#facc15">€</div><div class="cur">EUR<small>Balance €3,204.18</small></div><div class="amt" id="eur">500</div></div>
  <div class="row"><div class="flag" style="background:#7f1d1d;color:#fff">$</div><div class="cur">USD<small>Balance $0.00</small></div><div class="amt" id="usd" style="color:#7ee2b8">542.10</div></div><div class="swap">⇅</div></div><div id="exb">Exchange<div class="rip" id="rip2"></div></div></div>`})();
function rise(el,t0,t,dy){const k=expoOut(cl((t-t0)/.6));el.style.opacity=cl((t-t0)/.2);el.style.transform=`translateY(${(1-k)*dy}px)`;el.style.filter=`blur(${(1-cl((t-t0)/.28))*6}px)`}
function ripple(el,t0,t,x,y){const k=cl((t-t0)/.45);el.style.left=x+'px';el.style.top=y+'px';el.style.transform=`translate(-50%,-50%) scale(${t<t0?0:1+expoOut(k)*7})`;el.style.opacity=t<t0?0:1-k}
const money=v=>v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const V=(x,y,z)=>new THREE.Vector3(x,y,z);

window.setT=function(t){
  // ---- S1 app listing (white)
  const in1=t<T.s2+.02;$('s1').style.opacity=in1?1:0;
  if(in1){const a=$('app');const k=expoOut(cl(t/.7));a.style.transform=`translateY(${(1-k)*90}px) scale(${.96+.04*k})`;a.style.opacity=cl(t/.25);a.style.filter=`blur(${(1-cl(t/.35))*8}px)`;
    const gp=$('get');gp.style.transform=`scale(${t>=T.tap&&t<T.tap+.07?.95:1})`;ripple($('rip1'),T.tap,t,75,39);
    const td=$('tap1');const tk=cl((t-(T.tap-.25))/.25);td.style.left='1290px';td.style.top=(500+(1-tk)*30)+'px';td.style.opacity=t<T.tap-.25?0:(t<T.tap+.15?tk:1-cl((t-T.tap-.15)/.15));td.style.transform=`translate(-50%,-50%) scale(${t>=T.tap&&t<T.tap+.08?.86:1})`;
    const g=io(cl((t-T.grow)/(T.s2-T.grow)));const gr=$('grow');gr.style.opacity=t>=T.grow?1:0;const x0=1215,y0=501,w0=150,h0=78;gr.style.left=mix(x0,0,g)+'px';gr.style.top=mix(y0,0,g)+'px';gr.style.width=mix(w0,1920,g)+'px';gr.style.height=mix(h0,1080,g)+'px';gr.style.borderRadius=mix(39,0,g)+'px'}
  // ---- 3D state
  const in2=t>=T.s2-.02&&t<T.s3+.02, in4=t>=T.s4-.02&&t<T.s5+.02;$('cv').style.opacity=(in2||in4)?1:0;
  PH.visible=in2;cardG.visible=in4;term.visible=in4;rings.forEach(r=>r.visible=in4);
  if(in2){drawLock(spring(cl((t-T.notif)/.5)));const k=expoOut(cl((t-T.s2)/1.0));PH.position.set(0,mix(-2.6,0,k),0);PH.rotation.set(mix(.5,-.06,k),mix(1.1,.28,k)-.06*(t-T.s2),mix(-.2,.03,k));
    const pk=io(cl((t-T.push)/(T.s3-T.push)));cam.position.set(0,.05,mix(4.6-.25*(t-T.s2)/1.6,1.25,pk));cam.lookAt(0,.0,0);col.material.opacity=.55*(1-pk);cam.updateProjectionMatrix()}
  if(in4){const k=expoOut(cl((t-T.s4)/.9));const m=io(cl((t-T.toTerm)/.4));
    cardG.position.set(mix(mix(4.5,-.9,k),.95,m),mix(mix(-1.5,.15,k),.85,m),mix(0,.5,m));cardG.rotation.set(mix(mix(-.4,-.18,k),-1.1,m),mix(mix(-2.6,-.42,k)+.08*(t-T.s4),-.15,m),mix(mix(.4,.08,k),.05,m));cardG.scale.setScalar(mix(1,.62,m));
    const tk=expoOut(cl((t-T.s4-.35)/.8));term.position.set(mix(4.2,1.15,tk),-.55,-.2);term.rotation.set(-.42,-.38,0);
    rings.forEach((r,i)=>{const rk=cl((t-T.nfc-i*.12)/.5);r.position.set(1.15,.6,.05);r.rotation.set(-.42-Math.PI/2+.3,0,0);r.scale.setScalar(.4+rk*1.6);r.material.opacity=(t>=T.nfc+i*.12)?.8*(1-rk):0});
    cam.position.set(0,.1,8.0);cam.lookAt(0,0,0);col.material.opacity=.4;cam.updateProjectionMatrix()}
  if(in2||in4)comp.render();
  // ---- S3 exchange (2D, black)
  const in3=t>=T.s3&&t<T.s4+.05;$('s3').style.opacity=in3?1:0;
  if(in3){const dk=io(cl((t-T.s3-.05)/1.0));$('cpr').setAttribute('width',920*dk);const L=CHART.pts[Math.min(120,Math.round(dk*120))];$('dot').setAttribute('cx',L[0]);$('dot').setAttribute('cy',L[1]);$('dot2').setAttribute('cx',L[0]);$('dot2').setAttribute('cy',L[1]);
    const r=1.0731+(.0111*dk);$('rate').textContent=r.toFixed(4);const p=$('pill');p.textContent=r.toFixed(4);p.style.left=(180+L[0])+'px';p.style.top=(420+L[1])+'px';p.style.opacity=cl((t-T.s3-.2)/.2);
    ['lab','pair','chg'].forEach((c,i)=>rise($('s3').querySelector('.'+c),T.s3+i*.05,t,24));
    rise($('conv'),T.conv,t,80);const tv=cl((t-T.conv-.25)/.3);$('eur').textContent=tv<.33?'5':tv<.66?'50':'500';$('usd').textContent=money(542.10*io(cl((t-T.conv-.55)/.4)));
    $('exb').style.transform=`scale(${t>=T.exTap&&t<T.exTap+.07?.96:1})`;ripple($('rip2'),T.exTap,t,236,55);
    const out=io(cl((t-(T.s4-.2))/.25));$('s3').style.transform=`scale(${1-out*.04})`;$('s3').style.opacity=1-out}
  // ---- paid toast over S4
  const pd=$('paid');if(t>=T.paid&&t<T.s5){const k=spring(cl((t-T.paid)/.45));pd.style.opacity=cl((t-T.paid)/.12);pd.style.transform=`translateX(-50%) translateY(${(1-k)*-60}px) scale(${.92+.08*k})`}else pd.style.opacity=0;
  // ---- S5 slogan (white)
  const in5=t>=T.s5&&t<T.s6;$('s5').style.opacity=in5?1:0;if(in5){const k=expoOut(cl((t-T.s5-.05)/.6));$('s5').style.letterSpacing=(-.035+(1-k)*.03)+'em';$('s5').style.color=`rgba(7,7,10,${k})`}
  // ---- S6 spending (black)
  const in6=t>=T.s6&&t<T.end;$('s6').style.opacity=in6?1:0;
  if(in6){rise($('s6').querySelector('.hd'),T.s6,t,24);rise($('bal'),T.s6+.05,t,30);[0,1,2].forEach(i=>rise($('t'+i),T.s6+.35+i*.16,t,50));
    const spent=[4.5,2.9,189][0]*cl((t-T.s6-.55)/.3)+2.9*cl((t-T.s6-.71)/.3)+189*io(cl((t-T.s6-.87)/.6));$('bal').textContent='$'+money(542.10-spent)}
  // ---- end
  const ie=t>=T.end;$('end').style.opacity=ie?1:0;if(ie){const h=$('end').querySelector('h1'),pp=$('end').querySelector('p');const k=expoOut(cl((t-T.end-.1)/.9));h.style.opacity=k;h.style.transform=`translateY(${(1-k)*30}px)`;h.style.filter=`blur(${(1-cl((t-T.end-.1)/.2))*8}px)`;h.style.letterSpacing=(-.045+(1-k)*.04)+'em';rise(pp,T.end+.55,t,20)}
};
const q=new URLSearchParams(location.search);window.setT(parseFloat(q.get('t')||'0'));window.READY=true;
