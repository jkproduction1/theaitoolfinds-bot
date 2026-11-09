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
function rockTex(){ // vertical strip: crust -> mantle -> outer core -> inner core -> back (v = 0 top .. 1 bottom)
  return canvasTex(256,2048,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h);
    const st=[[0,'#5a4636'],[0.04,'#4a3a2e'],[0.07,'#7a2a14'],[0.3,'#b8360f'],[0.42,'#ff7a1a'],[0.47,'#ffd86a'],[0.5,'#fff6d0'],[0.53,'#ffd86a'],[0.58,'#ff7a1a'],[0.7,'#b8360f'],[0.93,'#7a2a14'],[0.96,'#4a3a2e'],[1,'#5a4636']];
    st.forEach(([o,col])=>g.addColorStop(o,col)); c.fillStyle=g; c.fillRect(0,0,w,h);
    const r=rnd(4); for(let i=0;i<5000;i++){ c.fillStyle=`rgba(0,0,0,${0.05+r()*0.18})`; const y=r()*h; c.fillRect(r()*w,y,2+r()*14,1+r()*3); }
    for(let i=0;i<1400;i++){ const y=r()*h; const v=Math.abs(y/h-0.5); if(v<0.22){ c.fillStyle=`rgba(255,${180+r()*70|0},80,${0.2+r()*0.4})`; c.fillRect(r()*w,y,1+r()*3,6+r()*24); } } }); }

// ---------- S0 /physics-sim a hole through Earth, seen FROM THE SIDE as a cutaway slice: crust, mantle, outer core, inner core
// (real proportions), the jumper drops in at the top, falls (harmonic motion: fastest at the centre), the view turns over and they
// pop out on the other side (~38 min with Earth's real density, Klotz 2015)
(function(){ const cv=document.getElementById('cv0'), g=cv.getContext('2d'); const W=1080,H=1920, R=400, CX=540, CY=930;
  const RS=rnd(41); const stars=[]; for(let i=0;i<420;i++) stars.push([RS()*W,RS()*H,RS()*1.5+0.3,RS()]);
  // pre-rendered slice (2400 px for 2R+120 world units, stays sharp when zoomed in)
  const K=2400/(2*R+120), SZ=2400, sl=document.createElement('canvas'); sl.width=sl.height=SZ; const s=sl.getContext('2d');
  { s.translate(SZ/2,SZ/2); s.scale(K,K); const n=vnoise(5), r=rnd(6);
    const band=(r0,r1,c0,c1)=>{ const gr=s.createRadialGradient(0,0,r0*R,0,0,r1*R); gr.addColorStop(0,c0); gr.addColorStop(1,c1); s.fillStyle=gr; s.beginPath(); s.arc(0,0,r1*R,0,2*Math.PI); s.fill(); };
    band(0.975,1.0,'#5b4a3c','#4a3c30');          // crust (exaggerated thickness)
    band(0.86,0.975,'#8e2e12','#6e2410');         // upper mantle
    band(0.546,0.86,'#e0581c','#a8300f');         // lower mantle
    band(0.19,0.546,'#ffd25a','#ff8a1e');         // liquid outer core
    band(0,0.19,'#fffbe8','#ffe9a0');             // solid inner core
    // rock grain and convection swirls
    for(let i=0;i<26000;i++){ const a=r()*6.283, d=Math.sqrt(r())*R; const x=Math.cos(a)*d, y=Math.sin(a)*d; const f=d/R; if(f<0.19) continue;
      const v=fbm(n,x*0.02,y*0.02,4); s.fillStyle=f>0.975?`rgba(30,22,16,${0.25*r()})`:f>0.546?`rgba(${v>0.5?255:40},${v>0.5?150:10},${v>0.5?60:0},${0.12*r()})`:`rgba(255,${200+r()*55|0},120,${0.12*r()})`;
      s.fillRect(x,y,1+r()*2.5,1+r()*2.5); }
    [0.19,0.546,0.86,0.975].forEach(f=>{ s.strokeStyle='rgba(0,0,0,.28)'; s.lineWidth=1.2; s.beginPath(); s.arc(0,0,f*R,0,2*Math.PI); s.stroke(); });
    // living surface on the rim: ocean, land, a thin atmosphere
    for(let i=0;i<720;i++){ const a=i/720*6.283; const land=fbm(n,Math.cos(a)*3+9,Math.sin(a)*3+9,4)>0.52; s.strokeStyle=land?'#3f6a2c':'#1f5fb8'; s.lineWidth=3.2; s.beginPath(); s.arc(0,0,R-1.6,a,a+0.0095); s.stroke(); }
    const at=s.createRadialGradient(0,0,R,0,0,R+26); at.addColorStop(0,'rgba(110,170,255,.55)'); at.addColorStop(1,'rgba(110,170,255,0)'); s.fillStyle=at; s.beginPath(); s.arc(0,0,R+26,0,2*Math.PI); s.arc(0,0,R,2*Math.PI,0,true); s.fill('evenodd');
    // the tunnel: a narrow shaft along the axis, dark inside with lit rims
    s.fillStyle='rgba(8,6,6,.92)'; s.fillRect(-7,-R-2,14,2*R+4); s.fillStyle='rgba(255,230,190,.35)'; s.fillRect(-8,-R,1.4,2*R); s.fillRect(6.6,-R,1.4,2*R); }
  function astro(x,y,sz,rot){ g.save(); g.translate(x,y); g.rotate(rot); const u=sz/40;
    const hl=g.createRadialGradient(0,0,0,0,0,sz*1.6); hl.addColorStop(0,'rgba(255,255,255,.35)'); hl.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=hl; g.beginPath(); g.arc(0,0,sz*1.6,0,7); g.fill();
    g.lineCap='round'; g.strokeStyle='#e9edf2'; g.lineWidth=9*u; // limbs
    g.beginPath(); g.moveTo(-8*u,4*u); g.lineTo(-20*u,16*u); g.moveTo(8*u,4*u); g.lineTo(20*u,14*u); g.moveTo(-6*u,20*u); g.lineTo(-9*u,36*u); g.moveTo(6*u,20*u); g.lineTo(10*u,36*u); g.stroke();
    g.fillStyle='#b9c0ca'; rr(g,-15*u,-6*u,10*u,26*u,4*u); g.fill(); // backpack
    g.fillStyle='#f4f6f8'; rr(g,-11*u,-6*u,22*u,30*u,8*u); g.fill();
    g.fillStyle='#f4f6f8'; g.beginPath(); g.arc(0,-16*u,12*u,0,7); g.fill();
    const vg=g.createLinearGradient(-6*u,-22*u,8*u,-10*u); vg.addColorStop(0,'#3b5b8a'); vg.addColorStop(1,'#0c1424'); g.fillStyle=vg; rr(g,-2*u,-22*u,13*u,11*u,5*u); g.fill();
    g.fillStyle='rgba(255,255,255,.7)'; g.fillRect(2*u,-20*u,4*u,2*u); g.restore(); }
  SCN[0]=function(lt){
    // fall 0.8 -> 4.0 s (harmonic: y = -R cos(pi u)), view turns over 3.7 -> 4.4, pop out 4.0 -> 4.45
    const u=cl((lt-0.8)/3.2), yF=-(R-6)*Math.cos(Math.PI*u), v=Math.sin(Math.PI*u)*(lt>0.8&&lt<4.0?1:0);
    let ay, ax=0, ar=0;
    if(lt<0.5){ ax=34; ay=-R-20; }
    else if(lt<0.8){ const j=(lt-0.5)/0.3; ax=34*(1-smooth(0,1,j)); ay=-R-20-26*Math.sin(j*Math.PI)+14*j*j; ar=j*0.6; }
    else if(lt<4.0){ ay=yF; ar=0.6+lt*1.6; }
    else { const o=smooth(4.0,4.45,lt); ay=R-6+30*o; ar=Math.PI*(1-o)+(0.6+4*1.6)*(1-o); ax=26*o; }
    // camera: start close on the hole, pull back to the whole slice, turn over and push in on the exit
    const zin=1-smooth(0.55,1.6,lt), zout=smooth(3.65,4.4,lt);
    const sc=1+2.2*zin+1.6*zout, fy=(-R+30)*zin+(R-30)*zout, rot=Math.PI*smooth(3.65,4.35,lt);
    g.setTransform(1,0,0,1,0,0); const bg=g.createRadialGradient(CX,CY,100,CX,CY,1100); bg.addColorStop(0,'#0b1020'); bg.addColorStop(1,'#020308'); g.fillStyle=bg; g.fillRect(0,0,W,H);
    stars.forEach(([x,y,r,p])=>{ g.fillStyle=`rgba(255,255,255,${0.35+0.4*p})`; g.fillRect(x,y,r,r); });
    g.save(); g.translate(CX,CY); g.rotate(rot); g.scale(sc,sc); g.translate(0,-fy);
    g.imageSmoothingQuality='high'; g.drawImage(sl,-SZ/2/K,-SZ/2/K,SZ/K,SZ/K);
    // heat glow inside the shaft around the jumper when deep
    const depth=Math.abs(ay)/R; if(lt>0.8&&lt<4.0){ const hg=g.createRadialGradient(0,ay,0,0,ay,60); hg.addColorStop(0,`rgba(255,200,120,${0.5*(1-depth)})`); hg.addColorStop(1,'rgba(255,200,120,0)'); g.fillStyle=hg; g.fillRect(-60,ay-60,120,120); }
    g.restore();
    // jumper in screen space (constant readable size) + speed trail
    const ca=Math.cos(rot), sa=Math.sin(rot); const px=CX+(ax*ca-(ay-fy)*sa)*sc, py=CY+(ax*sa+(ay-fy)*ca)*sc;
    const sz=26+22*zin+18*zout;
    if(v>0.05){ const dir=lt<4?-1:1; const L2=40+220*v; const tg=g.createLinearGradient(px,py,px-sa*dir*L2*-1,py+ca*dir*L2); tg.addColorStop(0,`rgba(255,240,210,${0.7*v})`); tg.addColorStop(1,'rgba(255,240,210,0)'); g.strokeStyle=tg; g.lineWidth=10; g.lineCap='round'; g.beginPath(); g.moveTo(px,py); g.lineTo(px+sa*dir*L2,py-ca*dir*L2); g.stroke(); }
    astro(px,py,sz,ar+rot);
    // minutes counter riding with the jumper
    if(lt>0.85&&lt<4.5){ const m=Math.round(38*u); g.font='600 30px "JetBrains Mono",monospace'; g.fillStyle=`rgba(255,255,255,${cl((lt-0.85)/0.2)*(1-cl((lt-4.2)/0.3))})`; g.textAlign='right'; g.fillText(m+' min',px-46,py+10); g.textAlign='left'; }
    fixLab('l0_0',px+56,py-10,(lt>1.0&&lt<1.95)?1:0);
    fixLab('l0_1',px+56,py-56,(lt>1.95&&lt<2.85)?1:0);
    fixLab('l0_2',px+56,py+40,(lt>2.2&&lt<3.15)?1:0);
    fixLab('l0_3',px+60,py+10,cl((lt-4.4)/0.2));
    caption(0,lt); };
})();

// ---------- S1 /what-if the Sun disappeared, seen from the ground: a bright afternoon over hills and sea, the Sun is gone in a blink
// but the sky stays bright while its last light is still travelling (8 min 20 s, fast-forwarded), then darkness and stars; finally
// from space: Earth leaves its orbit in a straight line (gravity's change also travels at light speed)
(function(){ const cv=document.getElementById('cv1'), g=cv.getContext('2d'); const W=1080,H=1920;
  const R=rnd(31); const stars=[]; for(let i=0;i<500;i++) stars.push([R()*W,R()*H*0.75,R()*1.6+0.3,R()]);
  const hills=[[1300,0.25,'#2b4a3a','#0b1210'],[1380,0.5,'#1f3a2c','#070b0a'],[1470,0.9,'#152a20','#040706']];
  function hillPath(y0,amp,seed){ const r=rnd(seed); g.beginPath(); g.moveTo(0,H); g.lineTo(0,y0); for(let x=0;x<=W;x+=40){ g.lineTo(x,y0-amp*(0.5+0.5*Math.sin(x*0.006+seed))-r()*18); } g.lineTo(W,H); g.closePath(); }
  function ground(dark,sunVis,t){ // sky
    const sk=g.createLinearGradient(0,0,0,H); const d=dark; sk.addColorStop(0,`rgb(${lerp(70,4,d)},${lerp(130,6,d)},${lerp(210,18,d)})`); sk.addColorStop(.55,`rgb(${lerp(150,8,d)},${lerp(195,10,d)},${lerp(235,30,d)})`); sk.addColorStop(.75,`rgb(${lerp(255,10,d)},${lerp(214,12,d)},${lerp(160,34,d)})`); g.fillStyle=sk; g.fillRect(0,0,W,H);
    stars.forEach(([x,y,r,ph])=>{ g.globalAlpha=d*d*(0.5+0.5*Math.sin(t*3+ph*6)); g.fillStyle='#fff'; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); }); g.globalAlpha=1;
    if(sunVis>0){ const sx=720,sy=560; const gr=g.createRadialGradient(sx,sy,0,sx,sy,700); gr.addColorStop(0,`rgba(255,250,235,${sunVis})`); gr.addColorStop(.1,`rgba(255,235,190,${0.85*sunVis})`); gr.addColorStop(.3,`rgba(255,200,130,${0.35*sunVis})`); gr.addColorStop(1,'rgba(255,170,90,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H); g.fillStyle=`rgba(255,255,248,${sunVis})`; g.beginPath(); g.arc(sx,sy,62,0,7); g.fill(); g.globalAlpha=0.25*sunVis; g.strokeStyle='#fff'; g.lineWidth=3; for(let k=0;k<12;k++){ const a=k*Math.PI/6; g.beginPath(); g.moveTo(sx+Math.cos(a)*80,sy+Math.sin(a)*80); g.lineTo(sx+Math.cos(a)*240,sy+Math.sin(a)*240); g.stroke(); } g.globalAlpha=1; }
    hills.forEach(([y,amp,c1,c2],i)=>{ hillPath(y,140*amp+60,i+3); const hg=g.createLinearGradient(0,y-200,0,H); hg.addColorStop(0,lerpHex(c1,'#05070a',d)); hg.addColorStop(1,lerpHex(c2,'#020304',d)); g.fillStyle=hg; g.fill(); });
  }
  function lerp(a,b,t){ return Math.round(a+(b-a)*t); }
  function lerpHex(a,b,t){ const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16); const r=lerp(A>>16,B>>16,t), gg=lerp((A>>8)&255,(B>>8)&255,t), bb=lerp(A&255,B&255,t); return `rgb(${r},${gg},${bb})`; }
  function timer(t,a){ if(a<=0) return; const sec=Math.max(0,500-500*t); const m=Math.floor(sec/60), s=Math.floor(sec%60); g.globalAlpha=a; g.fillStyle='rgba(8,10,14,.6)'; rr(g,290,720,500,190,40); g.fill(); g.fillStyle='#fff'; g.font='800 150px Inter, sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(`${m}:${String(s).padStart(2,'0')}`,540,818); g.globalAlpha=1; }
  function space(t){ g.fillStyle='#03040a'; g.fillRect(0,0,W,H); stars.forEach(([x,y,r])=>{ g.fillStyle='rgba(255,255,255,.7)'; g.fillRect(x,y*1.33,r,r); });
    const cx=-200, cy=1500, OR=1250; g.strokeStyle='rgba(140,170,220,.35)'; g.lineWidth=3; g.setLineDash([14,14]); g.beginPath(); g.arc(cx,cy,OR,-1.2,-0.1); g.stroke(); g.setLineDash([]);
    const a0=-0.62; const ex0=cx+OR*Math.cos(a0), ey0=cy+OR*Math.sin(a0); const tx=-Math.sin(a0), ty=Math.cos(a0); const d=-(t*520);
    const ex=ex0+tx*d, ey=ey0+ty*d; g.strokeStyle='rgba(120,200,255,.8)'; g.lineWidth=4; g.beginPath(); g.moveTo(ex0,ey0); g.lineTo(ex,ey); g.stroke();
    const eg=g.createRadialGradient(ex-30,ey-30,10,ex,ey,110); eg.addColorStop(0,'#3a5a8a'); eg.addColorStop(1,'#060a14'); g.fillStyle=eg; g.beginPath(); g.arc(ex,ey,110,0,7); g.fill();
    const r=rnd(8); for(let i=0;i<120;i++){ const a=r()*6.28, rr2=r()*95; g.fillStyle=`rgba(255,${200+r()*40|0},120,${0.5+0.5*r()})`; g.fillRect(ex+Math.cos(a)*rr2,ey+Math.sin(a)*rr2*0.9,2,2); }
    g.strokeStyle='rgba(120,170,255,.5)'; g.lineWidth=3; g.beginPath(); g.arc(ex,ey,112,0,7); g.stroke(); return [ex,ey]; }
  SCN[1]=function(lt){
    const gone=lt>=1.0; const flash=cl((lt-0.95)/0.05)*(1-cl((lt-1.15)/0.2));
    const tt=cl((lt-1.15)/2.0); const dark=smooth(3.15,3.6,lt);
    if(lt<4.0){ ground(dark, gone?0:1, lt); if(flash>0){ g.fillStyle=`rgba(255,255,255,${0.5*flash})`; g.fillRect(0,0,W,H); }
      timer(tt, cl((lt-1.15)/0.2)*(1-cl((lt-3.2)/0.25)));
      fixLab('l1_0',290,960,cl((lt-1.3)/0.2)*(1-cl((lt-3.2)/0.2))); fixLab('l1_1',600,980,0); }
    else { const k=smooth(4.0,4.25,lt); const [ex,ey]=space(cl((lt-4.1)/1.5)); g.fillStyle=`rgba(3,4,10,${1-k})`; g.fillRect(0,0,W,H); fixLab('l1_0',0,0,0); fixLab('l1_1',Math.min(760,ex+130),ey-40,cl((lt-4.4)/0.2)); }
    caption(1,lt); };
})();

// ---------- S2 /zoom-out to the edge of the universe: a slow log-scale pull-back that HOLDS on each step: a city at night, Earth,
// the Solar System, the Milky Way (~100,000 light-years), the cosmic web of galaxies (observable universe ~93 billion light-years)
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.background=new THREE.Color(0x010104); ren.toneMappingExposure=1.05;
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.01,100); cam.position.set(0,0,6); cam.lookAt(0,0,0);
  const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.6});
  sc.add(new THREE.AmbientLight(0xffffff,0.25)); const dl=new THREE.DirectionalLight(0xffffff,1.6); dl.position.set(-4,2,5); sc.add(dl);
  function sprite(col,size,soft){ const t=canvasTex(128,128,(c,w,h)=>{ const g=c.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0,col); g.addColorStop(soft||0.2,col.replace(/[\d.]+\)$/,'0.5)')); g.addColorStop(1,col.replace(/[\d.]+\)$/,'0)')); c.fillStyle=g; c.fillRect(0,0,w,h); }); const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending})); s.scale.set(size,size,1); return s; }
  // stage 0: city at night from above (glowing street grid + blocks of light)
  const S0=new THREE.Group(); sc.add(S0);
  { const t=canvasTex(1024,1024,(c,w,h)=>{ c.fillStyle='#05060a'; c.fillRect(0,0,w,h); const r=rnd(12);
      for(let i=0;i<34;i++){ const x=i*31+r()*8; c.strokeStyle=`rgba(255,${170+r()*50|0},90,${0.35+r()*0.4})`; c.lineWidth=2+r()*3; c.beginPath(); c.moveTo(x,0); c.lineTo(x+r()*40-20,h); c.stroke(); }
      for(let i=0;i<34;i++){ const y=i*31+r()*8; c.strokeStyle=`rgba(255,${170+r()*50|0},90,${0.35+r()*0.4})`; c.lineWidth=2+r()*3; c.beginPath(); c.moveTo(0,y); c.lineTo(w,y+r()*40-20); c.stroke(); }
      for(let i=0;i<5000;i++){ c.fillStyle=`rgba(255,${200+r()*55|0},${140+r()*80|0},${r()*0.8})`; c.fillRect(r()*w,r()*h,2,2); }
      const gr=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.7); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(0,0,0,.95)'); c.fillStyle=gr; c.fillRect(0,0,w,h); });
    const m=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4),new THREE.MeshBasicMaterial({map:t,transparent:true,toneMapped:false})); S0.add(m); }
  // stage 1: Earth (night side with city lights + day side)
  const S1=new THREE.Group(); sc.add(S1);
  { const E=realEarth();
    const e=new THREE.Mesh(new THREE.SphereGeometry(1,96,64),new THREE.MeshStandardMaterial({map:E.day,roughness:.8,emissiveMap:E.night,emissive:0xffffff,emissiveIntensity:0.1})); S1.add(e); S1.userData.e=e;
    const cl3=new THREE.Mesh(new THREE.SphereGeometry(1.012,96,64),new THREE.MeshStandardMaterial({map:E.clouds,transparent:true,depthWrite:false,roughness:1})); S1.add(cl3);
    const rim=new THREE.Mesh(new THREE.SphereGeometry(1.035,64,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,uniforms:{},vertexShader:'varying vec3 n; void main(){ n=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',fragmentShader:'varying vec3 n; void main(){ float f=pow(0.75-dot(n,vec3(0.,0.,1.)),3.); gl_FragColor=vec4(0.35,0.6,1.0,1.)*f*1.6; }'})); S1.add(rim); }
  // stage 2: Solar System, Earth at the origin on its orbit (orbit r = 1), Sun at (-1,0,0)
  const S2=new THREE.Group(); sc.add(S2); const SS=new THREE.Group(); SS.position.set(-1,0,0); SS.rotation.x=1.15; S2.add(SS);
  SS.add(sprite('rgba(255,220,140,1)',0.55,0.15)); SS.add(new THREE.Mesh(new THREE.SphereGeometry(0.05,24,16),new THREE.MeshBasicMaterial({color:0xfff2c0,toneMapped:false})));
  [[0.39,0xb0a090],[0.72,0xe8c890],[1,0x5aa0ff],[1.52,0xd06040],[5.2,0xe0b080],[9.5,0xe8d0a0]].forEach(([r,c],i)=>{ const o=new THREE.Mesh(new THREE.RingGeometry(r*0.997,r*1.003,256),new THREE.MeshBasicMaterial({color:0x8aa0c8,transparent:true,opacity:i===2?0.9:0.45,side:THREE.DoubleSide,toneMapped:false})); o.rotation.x=-Math.PI/2; SS.add(o);
    const a=i===2?0:i*1.9; const pl=sprite(`rgba(${(c>>16)&255},${(c>>8)&255},${c&255},1)`,i>3?0.35:0.12,0.3); pl.position.set(r*Math.cos(a),0,r*Math.sin(a)); SS.add(pl); });
  // stage 3: Milky Way: dense spiral, bright bulge, dark dust lanes; Sun at r ~ 0.5 (marked)
  const S3=new THREE.Group(); sc.add(S3); const MW=new THREE.Group(); MW.position.set(-0.52,0.05,0); MW.rotation.x=0.7; S3.add(MW);
  { const N=70000, pos=new Float32Array(N*3), col=new Float32Array(N*3); const r=rnd(5);
    for(let i=0;i<N;i++){ const arm=i%4, t=Math.pow(r(),0.75), rad=0.03+t*1.0; const a=arm*Math.PI/2+rad*4.6+(r()-.5)*(0.35+0.35*t); const sp=(r()-.5)*(0.06+0.08*t);
      pos.set([rad*Math.cos(a)+sp,(r()-.5)*0.03*(1-t),rad*Math.sin(a)+(r()-.5)*(0.06+0.08*t)],i*3); const c=new THREE.Color().setHSL(t<0.25?0.1:0.58+0.06*r(),t<0.25?0.6:0.45,0.5+0.35*(1-t)+0.1*r()); col.set([c.r,c.g,c.b],i*3); }
    const gm=new THREE.BufferGeometry(); gm.setAttribute('position',new THREE.BufferAttribute(pos,3)); gm.setAttribute('color',new THREE.BufferAttribute(col,3));
    MW.add(new THREE.Points(gm,new THREE.PointsMaterial({size:0.007,vertexColors:true,transparent:true,opacity:.85,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false})));
    const bulge=sprite('rgba(255,225,170,1)',0.9,0.12); MW.add(bulge); const you=sprite('rgba(120,200,255,1)',0.08,0.3); you.position.set(0.52,0,-0.05); MW.add(you); }
  // stage 4: cosmic web: bright clusters joined by glowing filaments, many galaxies
  const S4=new THREE.Group(); sc.add(S4);
  { const r=rnd(9); const nodes=[]; for(let i=0;i<46;i++) nodes.push(new THREE.Vector3((r()-.5)*2.6,(r()-.5)*4.4,(r()-.5)*1.4));
    const N=40000, pos=new Float32Array(N*3), col=new Float32Array(N*3);
    for(let i=0;i<N;i++){ const a=nodes[Math.floor(r()*46)]; let b=nodes[Math.floor(r()*46)]; if(a.distanceTo(b)>1.3) b=a; const t=r(); const p=a.clone().lerp(b,t); const sp=0.03+0.05*Math.sin(t*Math.PI); p.x+=(r()-.5)*sp*2; p.y+=(r()-.5)*sp*2; p.z+=(r()-.5)*sp*2; pos.set([p.x,p.y,p.z],i*3);
      const c=new THREE.Color().setHSL(0.72-0.12*r(),0.6,0.55+0.3*r()); col.set([c.r,c.g,c.b],i*3); }
    const gm=new THREE.BufferGeometry(); gm.setAttribute('position',new THREE.BufferAttribute(pos,3)); gm.setAttribute('color',new THREE.BufferAttribute(col,3));
    S4.add(new THREE.Points(gm,new THREE.PointsMaterial({size:0.01,vertexColors:true,transparent:true,opacity:.95,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false})));
    nodes.forEach(n=>{ const s=sprite('rgba(210,190,255,0.55)',0.035+r()*0.05,0.12); s.position.copy(n); S4.add(s); }); }
  const ST=[S0,S1,S2,S3,S4];
  // Z holds on each stage: stairs with smooth steps
  const STEP=1.4, HOLD=0.7;
  function Zof(lt){ const t=Math.max(0,lt-0.55); const k=Math.floor(t/STEP), f=t-k*STEP; return Math.min(4, 1+k+smooth(HOLD,STEP,f)); }
  SCN[2]=function(lt){ const Z=Zof(lt);
    ST.forEach((g,k)=>{ const s=Math.pow(10,(k-Z)*1.2); g.scale.setScalar(s); const ls=Math.log10(s); const vis=cl((ls+1.5)/0.4)*cl((0.2-ls)/0.25); g.visible=vis>0.01;
      g.traverse(o=>{ if(o.material){ o.material.transparent=true; if(o.material.userData.op===undefined) o.material.userData.op=o.material.opacity; o.material.opacity=o.material.userData.op*vis; } }); });
    S1.rotation.y=0.6+lt*0.25; S3.rotation.z=lt*0.04; S4.rotation.y=lt*0.08; cam.position.set(0.15*Math.sin(lt*0.4),0.1,6); cam.lookAt(0,0,0); P.c.render();
    for(let k=0;k<5;k++){ const a=cl(1-Math.abs(Z-k)*2.6); fixLab('l2_'+k,90,1300,a); }
    caption(2,lt); };
})();
