// ---------- globe27: a 3D snow globe of Prague, drawn in code with three.js (made by Claude Opus 5.5 in this repo).
// Glass sphere + walnut base with an engraved brass plate "PRAGUE"; inside a little winter city INSPIRED by Prague's roofscape
// (red roofs, a twin-spired Gothic church, a castle on a hill with a tall cathedral), all simple shapes made here, no copied artwork.
// Studio HDRI = CC0 (pmndrs/assets "studio"). A shake at the start whips the snow up, then it swirls and settles; slow camera orbit.
(function(){
const cl=(x)=>x<0?0:x>1?1:x, easeIO=(x)=>x<0?0:x>1?1:x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
function rnd(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
function canvasTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=8; return t; }
function b64buf(s){ const bin=atob(s); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u.buffer; }
function hdrEnv(ren){ const d=new THREE.EXRLoader().parse(b64buf(window.STUDIO_EXR));
  const t=new THREE.DataTexture(d.data,d.width,d.height,d.format,d.type); t.mapping=THREE.EquirectangularReflectionMapping; t.encoding=THREE.LinearEncoding;
  t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter; t.generateMipmaps=false; t.flipY=false; t.needsUpdate=true;
  const pm=new THREE.PMREMGenerator(ren); return pm.fromEquirectangular(t).texture; }

const ren=new THREE.WebGLRenderer({canvas:document.getElementById('cv0'),antialias:true,alpha:false,preserveDrawingBuffer:true});
ren.setPixelRatio(1); ren.setSize(1080,1920,false); ren.outputEncoding=THREE.sRGBEncoding; ren.toneMapping=THREE.ACESFilmicToneMapping; ren.toneMappingExposure=0.9;
ren.setClearColor(0x120a06,1);
const sc=new THREE.Scene(); const env=hdrEnv(ren); sc.environment=env;
const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
const comp=new THREE.EffectComposer(ren); comp.setPixelRatio(1); comp.setSize(1080,1920); comp.addPass(new THREE.RenderPass(sc,cam));
comp.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(540,960),0.4,0.55,0.92));
comp.addPass(new THREE.ShaderPass({uniforms:{tDiffuse:{value:null}},vertexShader:'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader:'uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec4 c=texture2D(tDiffuse,vUv); c.rgb=pow(max(c.rgb,0.),vec3(1./2.2)); float l=dot(c.rgb,vec3(.299,.587,.114)); vec3 s=mix(vec3(l),c.rgb,1.25); s=(s-0.5)*1.05+0.5; float v=1.-0.25*pow(length((vUv-vec2(.5,.48))*vec2(1.,1.4)),2.2); gl_FragColor=vec4(clamp(s*v,0.,1.),c.a); }'}));

// ---- warm room behind: big plane with blurred bokeh lights (parallax with the orbit)
const bgT=canvasTex(1024,1536,(g,w,h)=>{ const gr=g.createRadialGradient(w*.5,h*.42,40,w*.5,h*.5,h*.75); gr.addColorStop(0,'#5a3820'); gr.addColorStop(.45,'#2a170c'); gr.addColorStop(1,'#130a05'); g.fillStyle=gr; g.fillRect(0,0,w,h);
  const R=rnd(11); for(let i=0;i<70;i++){ const x=R()*w, y=h*0.12+R()*h*0.62, r=18+R()*70, warm=R(); const c=warm<.75?[255,180+R()*50|0,90+R()*60|0]:[255,120,70];
    const a=0.10+R()*0.28; const bg=g.createRadialGradient(x,y,0,x,y,r); bg.addColorStop(0,`rgba(${c[0]},${c[1]},${c[2]},${a})`); bg.addColorStop(.7,`rgba(${c[0]},${c[1]},${c[2]},${a*0.8})`); bg.addColorStop(1,`rgba(${c[0]},${c[1]},${c[2]},0)`);
    g.fillStyle=bg; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); } });
const bg=new THREE.Mesh(new THREE.PlaneGeometry(26,39),new THREE.MeshBasicMaterial({map:bgT,toneMapped:false,color:0xd8c8b8})); bg.position.set(0,2.5,-12); sc.add(bg);
// table
const tabT=canvasTex(1024,1024,(g,w,h)=>{ g.fillStyle='#2b1a10'; g.fillRect(0,0,w,h); const R=rnd(4); for(let i=0;i<260;i++){ g.strokeStyle=`rgba(${20+R()*40|0},${10+R()*20|0},5,${0.25+R()*0.3})`; g.lineWidth=1+R()*3; g.beginPath(); const y=R()*h; g.moveTo(0,y); for(let x=0;x<=w;x+=32) g.lineTo(x,y+8*Math.sin(x*0.01+i)); g.stroke(); }
  const v=g.createRadialGradient(w/2,h/2,10,w/2,h/2,w*0.12); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.6)'); g.fillStyle=v; g.fillRect(0,0,w,h); });
const tab2=canvasTex(1024,1024,(g,w,h)=>{ const gr=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2); gr.addColorStop(0,'#4a2e1c'); gr.addColorStop(.42,'#3a2414'); gr.addColorStop(1,'#1a0e07'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
const table=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshBasicMaterial({map:tab2,toneMapped:false})); table.rotation.x=-Math.PI/2; table.position.y=-0.72; sc.add(table);
const shT=canvasTex(256,256,(g,w,h)=>{ const gr=g.createRadialGradient(128,128,10,128,128,128); gr.addColorStop(0,'rgba(0,0,0,.8)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
const sh=new THREE.Mesh(new THREE.PlaneGeometry(4.2,4.2),new THREE.MeshBasicMaterial({map:shT,transparent:true,depthWrite:false})); sh.rotation.x=-Math.PI/2; sh.position.y=-0.715; sc.add(sh);

// lights
const key=new THREE.DirectionalLight(0xffe2c0,0.6); key.position.set(-4,6,6); sc.add(key);
const rim=new THREE.DirectionalLight(0x9fc0ff,1.0); rim.position.set(5,3,-6); sc.add(rim);
sc.add(new THREE.AmbientLight(0x6a5040,0.2));
const glow=new THREE.PointLight(0xffb060,0.8,3,2); glow.position.set(0,0.6,0.2); sc.add(glow);

const G=new THREE.Group(); sc.add(G);   // everything that shakes
// ---- base: walnut, brass ring, brass plate
const woodT=canvasTex(1024,256,(g,w,h)=>{ g.fillStyle='#4a2c1a'; g.fillRect(0,0,w,h); const R=rnd(9); for(let i=0;i<140;i++){ g.strokeStyle=`rgba(${25+R()*40|0},${12+R()*18|0},6,${0.3+R()*0.4})`; g.lineWidth=1+R()*2.5; g.beginPath(); const y=R()*h; g.moveTo(0,y); for(let x=0;x<=w;x+=16) g.lineTo(x,y+5*Math.sin(x*0.02+i*1.3)); g.stroke(); } });
woodT.wrapS=THREE.RepeatWrapping;
const prof=[[0,-0.72],[1.32,-0.72],[1.34,-0.66],[1.3,-0.6],[1.18,-0.2],[1.12,-0.08],[1.06,-0.04],[1.06,0.0],[0,0.0]].map(([x,y])=>new THREE.Vector2(x,y));
const base=new THREE.Mesh(new THREE.LatheGeometry(prof,96),new THREE.MeshPhysicalMaterial({map:woodT,color:0xc79a7a,roughness:.4,clearcoat:.5,clearcoatRoughness:.3,envMapIntensity:.35})); G.add(base);
const brass=new THREE.MeshStandardMaterial({color:0xd6a95a,metalness:1,roughness:.22,envMapIntensity:1.3});
const ring=new THREE.Mesh(new THREE.TorusGeometry(1.03,0.045,16,96),brass); ring.rotation.x=Math.PI/2; ring.position.y=0.0; G.add(ring);
const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.33,0.03,12,96),brass); ring2.rotation.x=Math.PI/2; ring2.position.y=-0.66; G.add(ring2);
const plateT=canvasTex(1024,256,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#f6dc9c'); gr.addColorStop(.45,'#c99a4c'); gr.addColorStop(1,'#8a6328'); g.fillStyle=gr;
  g.beginPath(); g.moveTo(40,8); g.lineTo(w-40,8); g.quadraticCurveTo(w-8,8,w-8,40); g.lineTo(w-8,h-40); g.quadraticCurveTo(w-8,h-8,w-40,h-8); g.lineTo(40,h-8); g.quadraticCurveTo(8,h-8,8,h-40); g.lineTo(8,40); g.quadraticCurveTo(8,8,40,8); g.fill();
  g.strokeStyle='rgba(90,60,20,.7)'; g.lineWidth=5; g.strokeRect(30,30,w-60,h-60);
  g.font='700 150px "EB Garamond","DejaVu Serif",Georgia,serif'; g.textAlign='center'; g.textBaseline='middle'; if(g.letterSpacing!==undefined) g.letterSpacing='28px';
  g.fillStyle='rgba(255,240,200,.75)'; g.fillText('PRAGUE',w/2+3,h/2+10); g.fillStyle='#3e2a10'; g.fillText('PRAGUE',w/2,h/2+6); });
const plate=new THREE.Mesh(new THREE.CylinderGeometry(1.216,1.294,0.26,64,1,true,-0.55,1.1),new THREE.MeshStandardMaterial({map:plateT,metalness:.85,roughness:.3,envMapIntensity:1.2,transparent:true,side:THREE.FrontSide}));
plate.position.y=-0.40; G.add(plate);
// fix the plate UVs so the text faces the camera (+z): cylinder theta starts at +z when thetaStart=0; we rotated, so flip u


// ---- inside: snowy ground + city
const IN=new THREE.Group(); G.add(IN);
const snowM=new THREE.MeshStandardMaterial({color:0xb4bfd0,roughness:.95,envMapIntensity:.25});
const ground=new THREE.Mesh(new THREE.SphereGeometry(1.0,64,24,0,Math.PI*2,0,Math.PI/2),snowM); ground.scale.set(1,0.12,1); ground.position.y=0.0; IN.add(ground);
const hill=new THREE.Mesh(new THREE.SphereGeometry(0.62,48,24,0,Math.PI*2,0,Math.PI/2),snowM); hill.scale.set(1.25,0.55,0.62); hill.position.set(0.05,0.06,-0.42); IN.add(hill);
const facT=canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#ffffff'; g.fillRect(0,0,w,h); g.fillStyle='rgba(0,0,0,.08)'; g.fillRect(0,h-18,w,18);
  const R=rnd(3); for(let r=0;r<3;r++) for(let c=0;c<4;c++){ const lit=R()<0.6; g.fillStyle=lit?'#ffcf7a':'#3a4250'; g.fillRect(30+c*58,40+r*70,18,28); } });
const emT=canvasTex(256,256,(g,w,h)=>{ g.fillStyle='#000'; g.fillRect(0,0,w,h); const R=rnd(3); for(let r=0;r<3;r++) for(let c=0;c<4;c++){ const lit=R()<0.6; if(lit){ g.fillStyle='#ffb04a'; g.fillRect(30+c*58,40+r*70,18,28); } } });
const PAL=[0xd99a3a,0xc8664a,0x8fb070,0xe0b04a,0xc77a62,0x7ea2c4,0xd8c08a];
const roofM=new THREE.MeshStandardMaterial({color:0x9a2a14,roughness:.6});
function roofGeo(w,d,h){ const s=new THREE.Shape(); s.moveTo(-w/2,0); s.lineTo(0,h); s.lineTo(w/2,0); s.closePath(); const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false}); g.translate(0,0,-d/2); return g; }
function house(x,z,w,d,h,ry,ci){ const g=new THREE.Group(); const mat=new THREE.MeshStandardMaterial({map:facT,color:PAL[ci%PAL.length],roughness:.8,emissive:0xffffff,emissiveMap:emT,emissiveIntensity:5});
  const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); b.position.y=h/2; g.add(b);
  const rh=w*0.55; const r=new THREE.Mesh(roofGeo(w*1.08,d*1.06,rh),roofM); r.position.y=h; g.add(r);
  const s=new THREE.Mesh(roofGeo(w*1.1,d*1.08,rh*0.5),snowM); s.position.y=h+rh*0.52; s.scale.set(0.5,1,1); g.add(s);
  g.position.set(x,0.03,z); g.rotation.y=ry; IN.add(g); return g; }
const R=rnd(17); let ci=0;
// front rows of houses (old town feel), kept inside the glass
[[-0.62,0.35],[-0.42,0.5],[-0.2,0.58],[0.22,0.58],[0.44,0.48],[0.63,0.3],[-0.7,0.05],[0.72,0.02],[-0.5,0.18],[0.5,0.15],[-0.3,0.3],[0.32,0.32]].forEach(([x,z])=>{
  const w=0.15+R()*0.07, h=0.17+R()*0.14; house(x,z,w,0.14+R()*0.05,h,Math.atan2(x,z)*0.6+(R()-.5)*0.2,ci++); });
// twin-spired Gothic church in the middle (inspired by an old-town square church; simple shapes)
(function(){ const g=new THREE.Group(); const stone=new THREE.MeshStandardMaterial({color:0xcfc2ac,roughness:.85,map:facT,emissive:0xffffff,emissiveMap:emT,emissiveIntensity:1.0});
  const dark=new THREE.MeshStandardMaterial({color:0x2a2e33,roughness:.5,metalness:.3});
  const nave=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.26,0.34),stone); nave.position.set(0,0.13,0.06); g.add(nave);
  const nr=new THREE.Mesh(roofGeo(0.24,0.36,0.14),roofM); nr.position.set(0,0.26,0.06); g.add(nr);
  [-0.075,0.075].forEach(x=>{ const t=new THREE.Mesh(new THREE.BoxGeometry(0.11,0.52,0.11),stone); t.position.set(x,0.26,-0.14); g.add(t);
    const sp=new THREE.Mesh(new THREE.ConeGeometry(0.085,0.32,4),dark); sp.position.set(x,0.68,-0.14); sp.rotation.y=Math.PI/4; g.add(sp);
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{ const s=new THREE.Mesh(new THREE.ConeGeometry(0.018,0.12,4),dark); s.position.set(x+a*0.05,0.58,-0.14+b*0.05); g.add(s); });
    const tip=new THREE.Mesh(new THREE.SphereGeometry(0.014,8,6),new THREE.MeshStandardMaterial({color:0xffd27a,metalness:1,roughness:.2})); tip.position.set(x,0.85,-0.14); g.add(tip); });
  g.position.set(0,0.03,0.12); IN.add(g); })();
// castle on the hill at the back: long palace front + tall cathedral with a spire and two slim towers
(function(){ const g=new THREE.Group(); const wall=new THREE.MeshStandardMaterial({color:0xe9e2d2,roughness:.8,map:facT,emissive:0xffffff,emissiveMap:emT,emissiveIntensity:1.3});
  const dark=new THREE.MeshStandardMaterial({color:0x3b4d48,roughness:.5,metalness:.4}); const greenRoof=new THREE.MeshStandardMaterial({color:0x5f8a78,roughness:.5,metalness:.3});
  const pal=new THREE.Mesh(new THREE.BoxGeometry(0.95,0.14,0.14),wall); pal.position.set(0,0.07,0); g.add(pal);
  const pr=new THREE.Mesh(roofGeo(0.97,0.16,0.07),roofM); pr.position.set(0,0.14,0); pr.rotation.y=0; g.add(pr);
  const cat=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.26,0.12),wall); cat.position.set(0.05,0.2,-0.12); g.add(cat);
  const cr=new THREE.Mesh(roofGeo(0.36,0.13,0.12),dark); cr.position.set(0.05,0.33,-0.12); g.add(cr);
  const tw=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.42,0.1),wall); tw.position.set(-0.08,0.28,-0.1); g.add(tw);
  const tsp=new THREE.Mesh(new THREE.ConeGeometry(0.07,0.2,8),greenRoof); tsp.position.set(-0.08,0.59,-0.1); g.add(tsp);
  [0.17,0.25].forEach(x=>{ const t=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.36,0.05),wall); t.position.set(x,0.3,-0.16); g.add(t); const s=new THREE.Mesh(new THREE.ConeGeometry(0.04,0.2,4),dark); s.position.set(x,0.58,-0.16); s.rotation.y=Math.PI/4; g.add(s); });
  g.position.set(0.02,0.27,-0.5); IN.add(g); })();
// little snowy trees + warm street lamps
const treeM=new THREE.MeshStandardMaterial({color:0x2f5a44,roughness:.8});
[[-0.8,-0.25],[0.82,-0.28],[-0.25,0.75],[0.3,0.74],[-0.62,-0.45],[0.64,-0.48],[0.0,0.78]].forEach(([x,z],i)=>{ const t=new THREE.Group(); [0,1,2].forEach(k=>{ const c=new THREE.Mesh(new THREE.ConeGeometry(0.075-k*0.018,0.11,10),k%2?snowM:treeM); c.position.y=0.07+k*0.055; t.add(c); }); t.position.set(x,0.03,z); t.scale.setScalar(0.9+0.3*((i*37)%10)/10); IN.add(t); });
const lampM=new THREE.MeshBasicMaterial({color:0xffc070,toneMapped:false});
[[-0.12,0.4],[0.12,0.4],[-0.36,0.68],[0.4,0.66],[0,0.6]].forEach(([x,z])=>{ const p=new THREE.Mesh(new THREE.CylinderGeometry(0.004,0.004,0.12,6),new THREE.MeshStandardMaterial({color:0x222222})); p.position.set(x,0.09,z); IN.add(p);
  const b=new THREE.Mesh(new THREE.SphereGeometry(0.016,10,8),lampM); b.position.set(x,0.155,z); IN.add(b); });

// ---- glass sphere + water tint + fresnel rim
const GC=new THREE.Vector3(0,0.78,0), GR=1.2;
const glass=new THREE.Mesh(new THREE.SphereGeometry(GR,96,64),new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:0.04,transparent:true,opacity:0.06,clearcoat:1,clearcoatRoughness:0.03,envMapIntensity:0.9,depthWrite:false,reflectivity:1}));
glass.position.copy(GC); G.add(glass);
const rimS=new THREE.Mesh(new THREE.SphereGeometry(GR*1.002,96,64),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
  fragmentShader:'varying vec3 vN; varying vec3 vV; void main(){ float f=pow(1.-max(dot(vN,vV),0.),3.2); float hl=pow(max(dot(reflect(-vV,vN),normalize(vec3(-.5,.6,.6))),0.),400.); gl_FragColor=vec4(vec3(.85,.9,1.)*f*0.6+vec3(1.,.97,.9)*hl*0.9,1.); }'}));
rimS.position.copy(GC); G.add(rimS);
// window reflection streak on the glass (soft curved highlight)
const stT=canvasTex(256,512,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,0); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(.5,'rgba(255,250,240,.55)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h);
  const v=g.createLinearGradient(0,0,0,h); v.addColorStop(0,'rgba(0,0,0,1)'); v.addColorStop(.3,'rgba(0,0,0,0)'); v.addColorStop(.7,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,1)'); g.globalCompositeOperation='destination-out'; g.fillStyle=v; g.fillRect(0,0,w,h); });
const streak=new THREE.Mesh(new THREE.SphereGeometry(GR*1.004,48,32,-2.35,0.32,0.45,1.3),new THREE.MeshBasicMaterial({map:stT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.55,toneMapped:false}));


// ---- snow: two layers of soft flakes inside the glass
const flakeT=canvasTex(64,64,(g,w,h)=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.45,'rgba(255,255,255,.75)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
function snowLayer(n,size,seed){ const Rn=rnd(seed); const P=[]; const pos=new Float32Array(n*3);
  for(let i=0;i<n;i++){ let v; do{ v=new THREE.Vector3(Rn()*2-1,Rn()*2-1,Rn()*2-1); }while(v.length()>1); v.multiplyScalar(GR*0.93);
    P.push({r:Math.hypot(v.x,v.z),a:Math.atan2(v.z,v.x),y:v.y,w:0.6+Rn()*1.4,f:0.05+Rn()*0.12,ph:Rn()*6.28}); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const m=new THREE.PointsMaterial({map:flakeT,size:size,sizeAttenuation:true,transparent:true,depthWrite:false,color:0xffffff,opacity:.95});
  const pts=new THREE.Points(g,m); pts.position.copy(GC); G.add(pts); return {P,pos,g}; }
const SN=[snowLayer(900,0.045,5),snowLayer(260,0.075,9)];
function updSnow(lt){ const sw=1-Math.exp(-lt/1.1);        // swirl angle accumulates fast, then slows
  SN.forEach(L=>{ L.P.forEach((p,i)=>{ const ang=p.a+p.w*2.6*sw+0.05*lt; let y=p.y-p.f*lt+0.03*Math.sin(lt*1.7+p.ph); const floor=-GR*0.62;
      if(y<floor) y=floor; let r=p.r*(1+0.04*Math.sin(lt*2+p.ph)); const lim=Math.sqrt(Math.max(0,(GR*0.95)**2-y*y)); if(r>lim) r=lim;
      L.pos[i*3]=Math.cos(ang)*r; L.pos[i*3+1]=y; L.pos[i*3+2]=Math.sin(ang)*r; }); L.g.attributes.position.needsUpdate=true; }); }

IN.traverse(o=>{ if(o.material&&o.material.envMapIntensity!==undefined) o.material.envMapIntensity=0.12; });
SCN[0]=function(lt){
  // gentle shake at the very start (whips up the snow), then still glass; camera keeps drifting
  const sk=Math.exp(-lt*2.2); G.rotation.z=0.07*sk*Math.sin(lt*11); G.position.x=0.05*sk*Math.sin(lt*11+0.6);
  updSnow(lt);
  const u=easeIO(cl(lt/4.6)); const a=-0.32+0.5*u+0.03*Math.sin(lt*0.7); const d=10.9-0.7*u;
  cam.position.set(Math.sin(a)*d,2.55-0.25*u,Math.cos(a)*d); cam.lookAt(0,0.7-0.04*u,0);
  bg.position.x=-cam.position.x*0.15;
  glow.intensity=0.75+0.1*Math.sin(lt*3.1);
  comp.render(); };
})();
