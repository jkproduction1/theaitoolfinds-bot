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
// cuts sit on the music grid (Timeless instrumental from 24 s: beat ≈ 0.75 s, first beat +0.03 s)
const B=k=>.03+.375*k;
const T={tap:.42,c2:B(2),land:B(2)+.55,notif:B(4),c3:B(8),conv:B(10),exTap:B(12)+.15,c4:B(14),toTerm:B(16)+.1,nfc:B(17)+.05,paid:B(18),c5:B(20),c6:B(23),end:B(29)};

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
function appScreen(variant){return canvasTex(780,1690,(g,w,h)=>{const F2='IDs, Inter, sans-serif';
  const bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,variant?'#1a1440':'#14143a');bg.addColorStop(.45,'#0b0b14');bg.addColorStop(1,'#07070a');g.fillStyle=bg;g.fillRect(0,0,w,h);
  g.fillStyle='#fff';g.font=`600 38px ${F2}`;g.fillText('9:41',70,82);
  g.fillStyle='#000';rr2d(g,w/2-120,30,240,70,35);g.fill();
  g.fillStyle='rgba(255,255,255,.6)';g.font=`500 34px ${F2}`;g.textAlign='center';g.fillText(variant?'EUR · Euro':'Personal · EUR',w/2,240);
  {const a=variant?'€1,850':'€3,204',c=variant?'.00':'.18';g.font=`600 128px ${F2}`;const wa=g.measureText(a).width;g.font=`600 64px ${F2}`;const wc=g.measureText(c).width;const x0=w/2-(wa+wc)/2;g.textAlign='left';g.fillStyle='#fff';g.font=`600 128px ${F2}`;g.fillText(a,x0,380);g.fillStyle='rgba(255,255,255,.6)';g.font=`600 64px ${F2}`;g.fillText(c,x0+wa+4,380);g.textAlign='center'}
  const lab=['Add money','Move','Details'];lab.forEach((l,i)=>{const cx=w/2+(i-1)*210;const gr=g.createLinearGradient(cx-55,470,cx+55,580);gr.addColorStop(0,'#3D5AFE');gr.addColorStop(1,'#8B5CF6');g.fillStyle=i===0?gr:'rgba(255,255,255,.12)';g.beginPath();g.arc(cx,520,58,0,7);g.fill();
    g.fillStyle='#fff';g.font=`600 54px ${F2}`;g.fillText(['+','⇄','i'][i],cx,538);g.fillStyle='rgba(255,255,255,.75)';g.font=`500 28px ${F2}`;g.fillText(l,cx,630)});
  g.textAlign='left';g.fillStyle='rgba(255,255,255,.07)';rr2d(g,40,690,w-80,330,44);g.fill();
  g.strokeStyle='#8B8CFF';g.lineWidth=6;g.beginPath();const R=rnd(variant?5:2);let y=930;for(let i=0;i<=24;i++){const x=80+i*(w-160)/24;y=Math.max(760,Math.min(980,y-(R()-.42)*46));i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();
  g.fillStyle='rgba(255,255,255,.55)';g.font=`500 28px ${F2}`;g.fillText('Spent this month',80,740);
  const tx=[['Coffee','Today','−€3.40'],['Mom','Today','+€200.00'],['Groceries','Yesterday','−€46.12'],['Rent','1 Nov','−€740.00']];
  tx.forEach(([a,b,c],i)=>{const y0=1080+i*140;g.fillStyle='rgba(255,255,255,.1)';g.beginPath();g.arc(100,y0+50,44,0,7);g.fill();g.fillStyle='#fff';g.font=`600 36px ${F2}`;g.fillText(a,170,y0+42);g.fillStyle='rgba(255,255,255,.45)';g.font=`500 28px ${F2}`;g.fillText(b,170,y0+84);
    g.textAlign='right';g.fillStyle=c[0]==='+'?'#7ee2b8':'#fff';g.font=`600 36px ${F2}`;g.fillText(c,w-70,y0+60);g.textAlign='left'});
})}

const PH=phone(lockT);sc.add(PH);const PH2=phone(appScreen(0));sc.add(PH2);
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

// whip transition helper: anticipation (small, slow move against the direction), then a fast move with motion blur.
// returns {d: displacement 0..1 of the outgoing layer, v: speed 0..1 (for blur)}; incoming layer uses inP().
function outP(t,tc,dur=.24){const a0=tc-dur,ant=cl((t-a0)/(dur*.45)),go=cl((t-a0-dur*.45)/(dur*.55));const back=-.035*Math.sin(Math.PI*ant)*(1-go);const d=back+Math.pow(go,2.2);return {d,v:go>0&&go<1?Math.sin(Math.PI*go):0}}
function inP(t,tc,dur=.5){const k=cl((t-tc)/dur);return {d:1-expoOut(k),v:k<1?Math.pow(1-k,2):0}}
function mb(id,v,dir){const f=$(id);f.setAttribute('stdDeviation',dir==='y'?`0 ${(v*40).toFixed(1)}`:`${(v*40).toFixed(1)} 0`)}
function layer(id,on,tx,ty,sc,blurId){const el=$(id);el.style.opacity=on?1:0;if(!on)return;el.style.transform=`translate(${tx}px,${ty}px) scale(${sc||1})`;el.style.filter=blurId?`url(#f${blurId.slice(2)})`:'none'}
window.setT=function(t){
  // ---- S1 app listing (white), slow push-in the whole time, finger tap, then the card dips up and whips DOWN out of frame
  const o1=outP(t,T.c2,.3);mb('mbA',o1.v,'y');
  const in1=t<T.c2+.01;layer('s1',in1,0,o1.d*1150,1+.035*cl(t/T.c2),o1.v>.02?'mbA':null);
  if(in1){const a=$('app');const k=expoOut(cl(t/.5));a.style.transform=`translateY(${(1-k)*50}px)`;a.style.opacity=cl(t/.18);a.style.filter=`blur(${(1-cl(t/.25))*6}px)`;
    $('get').style.transform=`scale(${t>=T.tap&&t<T.tap+.07?.94:1})`;ripple($('rip1'),T.tap,t,75,39);
    const td=$('tap1');const tk=cl((t-(T.tap-.2))/.2);td.style.left='1290px';td.style.top=(500+(1-tk)*24)+'px';td.style.opacity=t<T.tap-.2?0:(t<T.tap+.12?tk:1-cl((t-T.tap-.12)/.15));td.style.transform=`translate(-50%,-50%) scale(${t>=T.tap&&t<T.tap+.08?.86:1})`;$('grow').style.opacity=0}
  // ---- S2 two phones fall in from the top (continuing the downward whip), land softly, notification; then dip up + whip down
  const in2=t>=T.c2-.05&&t<T.c3+.02;const i2=inP(t,T.c2,.75),o2=outP(t,T.c3,.3);
  // ---- S4 card scene timing
  const in4=t>=T.c4-.02&&t<T.c5+.02;const i4=inP(t,T.c4,.7),o4=outP(t,T.c5,.3);
  $('cv').style.opacity=(in2||in4)?1:0;PH.visible=PH2.visible=in2;cardG.visible=term.visible=in4;rings.forEach(r=>r.visible=in4);
  if(in2){drawLock(spring(cl((t-T.notif)/.5)));const drift=(t-T.c2)*.05;
    const yIn=i2.d*3.2, yOut=-o2.d*3.4;
    PH.position.set(-.48,yIn+yOut+.02*Math.sin(t*2),0);PH.rotation.set(-.05+i2.d*.4,.32-drift,.04-i2.d*.2);
    PH2.position.set(.55,yIn*1.25+yOut*1.1+.06,-.55);PH2.rotation.set(-.04+i2.d*.5,-.34+drift*.8,-.04+i2.d*.25);
    cam.position.set(0,.05,4.6-.12*(t-T.c2));cam.lookAt(0,0,-.2);col.material.opacity=.55;cam.updateProjectionMatrix();
    const v=Math.max(i2.v,o2.v);mb('mbB',v*.9,'y');$('cv').style.filter=v>.03?'url(#fB)':'none'}
  if(in4){const m=io(cl((t-T.toTerm)/.45));const drift=(t-T.c4)*.06;
    cardG.position.set(mix(mix(-.9,6.5,i4.d),.95,m),mix(.15-o4.d*0,.85,m)-o4.d*4.5,mix(0,.5,m));cardG.rotation.set(mix(-.18,-1.1,m),mix(-.42+drift-i4.d*1.4,-.15,m),mix(.08,.05,m));cardG.scale.setScalar(mix(1,.62,m));
    const tk=expoOut(cl((t-T.c4-.3)/.7));term.position.set(mix(5,1.15,tk),-.55-o4.d*4.5,-.2);term.rotation.set(-.42,-.38,0);
    rings.forEach((r,i)=>{const rk=cl((t-T.nfc-i*.12)/.5);r.position.set(1.15,.6-o4.d*4.5,.05);r.rotation.set(-.42-Math.PI/2+.3,0,0);r.scale.setScalar(.4+rk*1.6);r.material.opacity=(t>=T.nfc+i*.12)?.8*(1-rk):0});
    cam.position.set(0,.1,8.0-.15*(t-T.c4));cam.lookAt(0,0,0);col.material.opacity=.4;cam.updateProjectionMatrix();
    const vx=i4.v,vy=o4.v;mb('mbB',Math.max(vx,vy)*.9,vx>vy?'x':'y');$('cv').style.filter=Math.max(vx,vy)>.03?'url(#fB)':'none'}
  if(in2||in4)comp.render();
  // ---- S3 exchange: slides in from the TOP (same direction as the whip), then whips LEFT into the card scene
  const in3=t>=T.c3-.02&&t<T.c4+.02;const i3=inP(t,T.c3-.06,.55),o3=outP(t,T.c4,.28);const v3=Math.max(i3.v,o3.v);mb('mbC',v3,i3.v>o3.v?'y':'x');
  layer('s3',in3,-o3.d*2100,-i3.d*1150,1.02-.02*cl((t-T.c3)/2),v3>.03?'mbC':null);
  if(in3){const dk=io(cl((t-T.c3-.15)/1.0));$('cpr').setAttribute('width',920*dk);const L=CHART.pts[Math.min(120,Math.round(dk*120))];['dot','dot2'].forEach(id=>{$(id).setAttribute('cx',L[0]);$(id).setAttribute('cy',L[1])});$('dot').style.opacity=$('dot2').style.opacity=dk>.02?1:0;
    const r=1.0731+(.0111*dk);$('rate').textContent=r.toFixed(4);const pl=$('pill');pl.textContent=r.toFixed(4);pl.style.left=(180+L[0])+'px';pl.style.top=(420+L[1])+'px';pl.style.opacity=cl((t-T.c3-.3)/.2);
    ['lab','pair','chg'].forEach((c,i)=>rise($('s3').querySelector('.'+c),T.c3+.1+i*.05,t,24));
    rise($('conv'),T.conv,t,80);const tv=cl((t-T.conv-.25)/.3);$('eur').textContent=tv<.33?'5':tv<.66?'50':'500';$('usd').textContent=money(542.10*io(cl((t-T.conv-.55)/.45)));
    $('exb').style.transform=`scale(${t>=T.exTap&&t<T.exTap+.07?.96:1})`;ripple($('rip2'),T.exTap,t,236,55)}
  // ---- paid toast
  const pd=$('paid');if(t>=T.paid&&t<T.c5){const k=spring(cl((t-T.paid)/.45));pd.style.opacity=cl((t-T.paid)/.12)*(1-cl((t-T.c5+.3)/.1));pd.style.transform=`translateX(-50%) translateY(${(1-k)*-60}px) scale(${.92+.08*k})`}else pd.style.opacity=0;
  // ---- S5 slogan (white) drops in from the top, slow push, then whips UP away revealing S6
  const in5=t>=T.c5-.02&&t<T.c6+.02;const i5=inP(t,T.c5,.5),o5=outP(t,T.c6,.26);const v5=Math.max(i5.v,o5.v);mb('mbD',v5,'y');
  layer('s5',in5,0,-i5.d*1100-o5.d*1150,1+.04*cl((t-T.c5)/.75),v5>.03?'mbD':null);if(in5){$('s5').style.color='#07070A'}
  // ---- S6 spending (black) rises in, slow drift
  const in6=t>=T.c6-.02&&t<T.end+.3;const i6=inP(t,T.c6,.55);mb('mbE',i6.v,'y');layer('s6',in6,0,i6.d*700,1.02-.02*cl((t-T.c6)/2.2),i6.v>.03?'mbE':null);
  if(in6){$('s6').style.opacity=1-cl((t-T.end)/.25);rise($('s6').querySelector('.hd'),T.c6+.05,t,24);rise($('bal'),T.c6+.1,t,30);[0,1,2].forEach(i=>rise($('t'+i),T.c6+.4+i*.16,t,50));
    const spent=4.5*cl((t-T.c6-.6)/.3)+2.9*cl((t-T.c6-.76)/.3)+189*io(cl((t-T.c6-.92)/.6));$('bal').textContent='$'+money(542.10-spent)}
  // ---- end card: slow push-in on the name, slogan rises
  const ie=t>=T.end;$('end').style.opacity=ie?cl((t-T.end)/.25):0;if(ie){const h=$('end').querySelector('h1'),pp=$('end').querySelector('p');const k=expoOut(cl((t-T.end-.1)/.9));h.style.opacity=k;h.style.transform=`translateY(${(1-k)*30}px) scale(${1+.03*cl((t-T.end)/2.4)})`;h.style.filter=`blur(${(1-cl((t-T.end-.1)/.25))*10}px)`;h.style.letterSpacing=(-.045+(1-k)*.04)+'em';rise(pp,T.end+.5,t,20)}
};
const q=new URLSearchParams(location.search);window.setT(parseFloat(q.get('t')||'0'));window.READY=true;
