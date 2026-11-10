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
function layoutLabels2(items,cam,colX,minGap){ // like layoutLabels, but labels at alpha 0 don't take a slot
  const on=items.filter(it=>it[2]>0.001); items.forEach(it=>{ if(it[2]<=0.001) it[0].style.opacity=0; }); if(on.length) layoutLabels(on,cam,colX,minGap); }
function stdM(c,m,r,o){ return new THREE.MeshPhysicalMaterial(Object.assign({color:c,metalness:m,roughness:r,envMapIntensity:0.75},o||{})); }
const XRAY_VS='#include <clipping_planes_pars_vertex>\nvarying vec3 vN; varying vec3 vV; void main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mvPosition.xyz); gl_Position=projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}';
const XRAY_FS='#include <clipping_planes_pars_fragment>\nuniform vec3 col; uniform float op; varying vec3 vN; varying vec3 vV; void main(){\n#include <clipping_planes_fragment>\n float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.2); gl_FragColor=vec4(col*(0.03+0.55*f)*op,1.); }';

// ---------- shared helpers for nature18
function taperTube(curve,tub,rad,r0,r1){ const g=new THREE.TubeGeometry(curve,tub,1,rad,false); const pos=g.attributes.position, Pv=new THREE.Vector3();
  for(let i=0;i<=tub;i++){ const c=curve.getPointAt(i/tub), r=r0+(r1-r0)*(i/tub); for(let j=0;j<=rad;j++){ const k=i*(rad+1)+j; Pv.fromBufferAttribute(pos,k).sub(c).multiplyScalar(r).add(c); pos.setXYZ(k,Pv.x,Pv.y,Pv.z); } }
  pos.needsUpdate=true; g.userData={tub,rad}; return g; }
function grow(m,f){ const u=m.geometry.userData; m.visible=f>0.002; m.geometry.setDrawRange(0,Math.floor(cl(f)*u.tub)*u.rad*6); }
function capT(k,lt,times){ const d=TY[k]; d.cap.forEach((w,i)=>{ const el=document.getElementById('c'+k+'_'+i); const a=cl((lt-times[i])/0.18); el.style.opacity=a; el.style.transform='translateY('+((1-a)*14)+'px)'; }); }
function placeLab(el,obj,cam,lx,ly,a){ obj.getWorldPosition(V); V.project(cam); const x=(V.x*.5+.5)*1080, y=(-V.y*.5+.5)*1920;
  el.style.left=lx+'px'; el.style.top=ly+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); const dx=x-lx, dy=y-ly;
  ld.style.width=Math.hypot(dx,dy)+'px'; ld.style.left='0px'; ld.style.transform='rotate('+Math.atan2(dy,dx)+'rad)'; ld.style.transformOrigin='0 50%'; }
function softTex(seed,n){ return canvasTex(256,256,(g,w,h)=>{ const R=rnd(seed); for(let i=0;i<n;i++){ const x=w/2+(R()-0.5)*w*0.45, y=h/2+(R()-0.5)*h*0.4, r=30+R()*60;
  const gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(255,255,255,'+(0.10+R()*0.12)+')'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); } }); }

// ---------- S0 /time-lapse a seed sprouting: side cutaway of soil behind glass. The seed coat splits, the root grows DOWN first
// and branches, then the shoot pushes UP, breaks the surface and the two seed leaves open towards the light.
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#2e2b25','#060607'); ren.toneMappingExposure=0.56;
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.3,radius:0.5,th:0.92});
  const sun=new THREE.DirectionalLight(0xfff0d6,0.95); sun.position.set(3,6,5); sc.add(sun); sc.add(new THREE.HemisphereLight(0xdfe8ff,0x1a120a,0.4));
  const fill=new THREE.DirectionalLight(0xcfe0ff,0.45); fill.position.set(-3,0,6); sc.add(fill);
  const SY=1.0, FZ=0.8;
  const soilTex=canvasTex(2048,2048,(g,w,h)=>{ const R=rnd(11);
    const band=(y0,c)=>{ g.fillStyle=c; g.beginPath(); g.moveTo(0,h); g.lineTo(0,y0); for(let x=0;x<=w;x+=32) g.lineTo(x,y0+16*Math.sin(x*0.011+y0)+10*R()); g.lineTo(w,h); g.closePath(); g.fill(); };
    g.fillStyle='#2b1d13'; g.fillRect(0,0,w,h); band(660,'#3a2819'); band(1240,'#4b3523'); band(1720,'#5a412c');
    for(let i=0;i<260000;i++){ const x=R()*w,y=R()*h,s=0.8+R()*2.2,l=R(); g.fillStyle=l<0.55?'rgba(10,6,3,'+(0.25+R()*0.45)+')':'rgba(190,150,110,'+(0.06+R()*0.2)+')'; g.fillRect(x,y,s,s); }
    for(let i=0;i<2500;i++){ const x=R()*w,y=R()*h,r=1.2+R()*3.5,b=0.6+R()*0.5; g.fillStyle='rgba('+(120*b|0)+','+(98*b|0)+','+(78*b|0)+','+(0.25+R()*0.35)+')'; g.beginPath(); g.ellipse(x,y,r,r*(0.6+R()*0.4),R()*3,0,7); g.fill(); }
    g.strokeStyle='rgba(18,10,5,.55)'; g.lineWidth=1.5; for(let i=0;i<120;i++){ let x=R()*w,y=R()*600; g.beginPath(); g.moveTo(x,y); for(let k=0;k<5;k++){ x+=(R()-0.5)*30; y+=R()*14; g.lineTo(x,y);} g.stroke(); } });
  const topTex=canvasTex(512,512,(g,w,h)=>{ const R=rnd(4); g.fillStyle='#2a1c12'; g.fillRect(0,0,w,h); for(let i=0;i<30000;i++){ g.fillStyle=R()<0.5?'rgba(8,5,2,.5)':'rgba(150,115,80,.18)'; const s=1+R()*3; g.fillRect(R()*w,R()*h,s,s); } });
  const frontM=new THREE.MeshStandardMaterial({map:soilTex,bumpMap:soilTex,bumpScale:0.02,roughness:0.95,envMapIntensity:.4}), topM=new THREE.MeshStandardMaterial({map:topTex,bumpMap:topTex,bumpScale:0.02,roughness:1,envMapIntensity:.3}), sideM=stdM(0x22170f,0,1);
  const soil=new THREE.Mesh(new THREE.BoxGeometry(3.6,3.4,1.6),[sideM,sideM,topM,sideM,frontM,sideM]); soil.position.set(0,SY-1.7,0); sc.add(soil);
  const R2=rnd(5);
  const stone=(x,y,z,r,c)=>{ const g=new THREE.SphereGeometry(r,16,12); const p=g.attributes.position; for(let i=0;i<p.count;i++){ const f=1+0.18*Math.sin(p.getX(i)*40+p.getY(i)*31)*Math.cos(p.getZ(i)*27); p.setXYZ(i,p.getX(i)*f,p.getY(i)*f*0.78,p.getZ(i)*f); } g.computeVertexNormals();
    const m=new THREE.Mesh(g,stdM(c,0,0.8,{envMapIntensity:.18})); m.position.set(x,y,z); m.rotation.set(R2()*3,R2()*3,R2()*3); sc.add(m); return m; };
  const SC=[0x5a5048,0x6e6255,0x4a433c,0x786a5a,0x3e3832];
  for(let i=0;i<26;i++){ const x=-1.5+R2()*3, y=-2.0+R2()*2.8; if(Math.abs(x+0.03)<0.38&&y>-1.15) continue; if(Math.abs(x-0.25)<0.3&&y>0.2) continue; stone(x,y,FZ-0.01,0.035+R2()*0.06,SC[i%5]); }
  for(let i=0;i<40;i++){ const x=-1.5+R2()*3, z=FZ-0.05-R2()*1.2; if(Math.abs(x-0.2)<0.18&&z>FZ-0.3) continue; stone(x,SY+0.01,z,0.015+R2()*0.03,i%2?0x2e2015:0x3b2a1c); }
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(3.6,4.4),stdM(0xffffff,0,0.02,{transparent:true,opacity:.07,clearcoat:1,depthWrite:false,envMapIntensity:1.6})); glass.position.set(0,0.5,FZ+0.26); sc.add(glass);
  // the bean seed: speckled coat in two halves (the upper half lifts when it splits), pale seed inside
  const kid=(g)=>{ const p=g.attributes.position; for(let i=0;i<p.count;i++){ const x=p.getX(i)*1.45,z=p.getZ(i)*0.78; let y=p.getY(i)*0.82; y-=0.55*x*x-0.02; p.setXYZ(i,x,y,z);} g.computeVertexNormals(); return g; };
  const coatTex=canvasTex(512,256,(g,w,h)=>{ const R=rnd(3); g.fillStyle='#b9895a'; g.fillRect(0,0,w,h); for(let i=0;i<260;i++){ g.fillStyle='rgba('+(70+R()*40|0)+','+(35+R()*20|0)+',20,'+(0.35+R()*0.4)+')'; g.beginPath(); g.ellipse(R()*w,R()*h,4+R()*16,2+R()*7,R()*3,0,7); g.fill(); } });
  const coatM=new THREE.MeshPhysicalMaterial({map:coatTex,roughness:.5,clearcoat:.25,clearcoatRoughness:.4,envMapIntensity:.25,side:THREE.DoubleSide});
  const SR=0.2, seed=new THREE.Group(); seed.position.set(0.02,0.45,FZ+0.06); sc.add(seed);
  const inner=new THREE.Mesh(kid(new THREE.SphereGeometry(SR*0.95,64,32)),stdM(0xcdb88a,0,0.7,{envMapIntensity:.2})); seed.add(inner);
  const coatBot=new THREE.Mesh(kid(new THREE.SphereGeometry(SR,64,16,0,Math.PI*2,Math.PI/2,Math.PI/2)),coatM); seed.add(coatBot);
  const lid=new THREE.Group(); lid.position.set(-SR*1.4,0,0); seed.add(lid);
  const coatTop=new THREE.Mesh(kid(new THREE.SphereGeometry(SR,64,16,0,Math.PI*2,0,Math.PI/2)),coatM.clone()); coatTop.material.color.set(0x8a6a4a); coatTop.material.clearcoat=0.1; coatTop.position.x=SR*1.4; lid.add(coatTop);
  const hil=new THREE.Mesh(new THREE.SphereGeometry(1,24,12),stdM(0xf1ead8,0,0.5)); hil.scale.set(0.055,0.02,0.03); hil.position.set(-0.13,-0.06,0.08); seed.add(hil);
  // root (down first) + side roots, shoot (up), seed leaves
  const Z=FZ+0.05, V2=(x,y,z)=>new THREE.Vector3(x,y,z===undefined?Z:z);
  const rootC=new THREE.CatmullRomCurve3([V2(-0.2,0.37),V2(-0.23,0.2),V2(-0.12,-0.02),V2(-0.08,-0.33),V2(-0.03,-0.58),V2(-0.09,-0.74),V2(-0.06,-0.9)]);
  const rootM=new THREE.MeshPhysicalMaterial({color:0xe6dcc0,roughness:.6,clearcoat:.15,envMapIntensity:.25});
  const root=new THREE.Mesh(taperTube(rootC,160,12,0.033,0.012),rootM); sc.add(root);
  const rTip=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),rootM); sc.add(rTip);
  const BR=[[0.27,-1,0.34],[0.4,1,0.4],[0.52,-1,0.42],[0.64,1,0.36],[0.76,-1,0.3],[0.86,1,0.22]].map(([u,s,L])=>{ const p=rootC.getPointAt(u);
    const c=new THREE.CatmullRomCurve3([p.clone(),p.clone().add(new THREE.Vector3(s*L*0.35,-0.04,0)),p.clone().add(new THREE.Vector3(s*L*0.7,-0.12,0.01)),p.clone().add(new THREE.Vector3(s*L,-0.24,0.01))]);
    const m=new THREE.Mesh(taperTube(c,60,8,0.016,0.006),rootM); sc.add(m); return {m,u}; });
  const shootC=new THREE.CatmullRomCurve3([V2(0.24,0.47,FZ+0.06),V2(0.31,0.62),V2(0.33,0.8),V2(0.27,0.98),V2(0.22,1.14),V2(0.21,1.3)]);
  const stemM=new THREE.MeshPhysicalMaterial({color:0x9fbf5a,roughness:.5,clearcoat:.2,envMapIntensity:.3});
  const shoot=new THREE.Mesh(taperTube(shootC,140,12,0.036,0.03),stemM); sc.add(shoot);
  const ls=new THREE.Shape(); ls.moveTo(0,0); ls.bezierCurveTo(0.17,0.03,0.2,0.27,0.0,0.36); ls.bezierCurveTo(-0.2,0.27,-0.17,0.03,0,0);
  const lg=new THREE.ExtrudeGeometry(ls,{depth:0.012,bevelEnabled:true,bevelThickness:0.012,bevelSize:0.012,bevelSegments:3,curveSegments:24}); lg.translate(0,0,-0.006);
  const leafM=new THREE.MeshPhysicalMaterial({color:0x3f8a22,roughness:.5,clearcoat:.3,clearcoatRoughness:.4,envMapIntensity:.3});
  const veinM=stdM(0x7fb24a,0,0.6,{envMapIntensity:.3});
  const bud=new THREE.Group(); sc.add(bud);
  const leaves=[1,-1].map(s=>{ const g=new THREE.Group(); const m=new THREE.Mesh(lg,leafM); g.add(m); const v=new THREE.Mesh(new THREE.BoxGeometry(0.008,0.3,0.03),veinM); v.position.y=0.16; g.add(v); bud.add(g); g.userData.s=s; return g; });
  const crumbs=[]; for(let i=0;i<10;i++){ const m=stone(0.21+(R2()-0.5)*0.12,SY+0.02,Z+(R2()-0.5)*0.08,0.018+R2()*0.022,i%2?0x2e2015:0x46321f); m.userData.d=new THREE.Vector3((R2()-0.5)*0.5,0.12+R2()*0.12,0.05+R2()*0.1); m.userData.p=m.position.clone(); crumbs.push(m); }
  const Ao=(x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); sc.add(o); return o; };
  const aSeed=Ao(0.2,0.5,FZ+0.16), aRoot=Ao(-0.13,-0.25,Z+0.03), aShoot=Ao(0.25,1.12,Z+0.03);
  SCN[0]=function(lt){
    const sw=1+0.07*easeIO(cl((lt-0.1)/0.5)); seed.scale.setScalar(sw);
    lid.rotation.z=0.1*easeIO(cl((lt-0.45)/0.45)); lid.position.y=0.012*easeIO(cl((lt-0.45)/0.45));
    const fr=easeIO(cl((lt-0.7)/1.3)); grow(root,fr); const tp=rootC.getPointAt(Math.max(0.001,fr)); rTip.visible=fr>0.01; rTip.position.copy(tp); rTip.scale.setScalar(0.033+(0.012-0.033)*fr);
    BR.forEach(({m,u})=>grow(m,easeIO(cl((lt-(0.7+1.3*u*0.8)-0.1)/0.45))));
    const fs=easeIO(cl((lt-2.35)/1.0)); grow(shoot,fs); const bp=shootC.getPointAt(Math.max(0.001,fs)), bt=shootC.getTangentAt(Math.max(0.001,fs));
    bud.visible=fs>0.02; bud.position.copy(bp); bud.rotation.z=Math.atan2(bt.y,bt.x)-Math.PI/2;
    const op=easeIO(cl((lt-3.3)/0.5)); bud.rotation.z=bud.rotation.z*(1-op)-0.12*op;
    leaves.forEach(g=>{ g.rotation.z=g.userData.s*(0.12+1.05*op); g.rotation.x=0.35*op; g.scale.setScalar(0.5+0.5*easeIO(cl((lt-3.1)/0.5))); });
    const pt=cl((lt-2.9)/0.45); crumbs.forEach(c=>{ const d=c.userData.d; c.position.set(c.userData.p.x+d.x*ease(pt)*0.5,c.userData.p.y+d.y*Math.sin(Math.PI*Math.min(1,pt*1.0))*0.6+0.0,c.userData.p.z+d.z*ease(pt)); });
    // camera: close on the seed -> the root going down -> up to the surface for the shoot
    const a=easeIO(cl((lt-0.8)/1.0)), b=easeIO(cl((lt-2.2)/1.0));
    const ty=0.35+(-0.12-0.35)*a+(0.98+0.12)*b, d=3.2+2.4*a-0.7*b, tx=0.2;
    cam.position.set(tx+0.5+0.06*Math.sin(lt*0.5),ty+0.32,FZ+d); cam.lookAt(tx,ty,FZ); P.c.render();
    layoutLabels(labs(0,[[0,aSeed,cl((lt-0.35)/0.2)*(1-0.5*b)],[1,aRoot,cl((lt-1.3)/0.2)*(1-cl((lt-2.3)/0.2))],[2,aShoot,cl((lt-2.85)/0.2)]]),cam,590,130);
    caption(0,lt); };
})();

// ---------- S1 /explain-3d how lightning forms: storm cloud; ice crystals and drops collide inside, + charge gathers at the top,
// - charge at the bottom; a thin branching stepped leader steps down in jumps, an upward streamer rises from a bare tree, they meet
// -> return stroke (the flash). All action framed above the title bar.
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); ren.toneMappingExposure=0.75;
  const bgT=canvasTex(512,1024,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,0,h); gr.addColorStop(0,'#05070b'); gr.addColorStop(0.45,'#121822'); gr.addColorStop(0.62,'#1d2430'); gr.addColorStop(1,'#07090c'); g.fillStyle=gr; g.fillRect(0,0,w,h); }); sc.background=bgT;
  const cam=new THREE.PerspectiveCamera(46,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.8,radius:0.6,th:0.75});
  const hemi=new THREE.HemisphereLight(0x8090b0,0x0a0c08,0.25); sc.add(hemi);
  const fl=new THREE.PointLight(0xcfe0ff,0,30,1.2); fl.position.set(-0.5,0.2,1.5); sc.add(fl);
  const R=rnd(21), tex=[softTex(1,26),softTex(2,30),softTex(3,22)], puffs=[];
  for(let i=0;i<170;i++){ const u=R(); const y=0.95+Math.pow(u,0.8)*1.75; const wdt=1.9+1.0*cl((y-1.6)/1.0)+0.4*R(); const x=(R()*2-1)*wdt, z=(R()*2-1)*0.9;
    const base=new THREE.Color().setHSL(0.6,0.12,0.04+0.16*cl((y-0.95)/1.9)+0.03*R());
    const m=new THREE.SpriteMaterial({map:tex[i%3],color:base,transparent:true,opacity:0.85,depthWrite:false}); const s=new THREE.Sprite(m); const sz=0.9+R()*1.0; s.scale.set(sz*1.4,sz,1); s.position.set(x,y,z); s.material.rotation=R()*6; sc.add(s); puffs.push({s,base,y}); }
  const NR=420, rp=new Float32Array(NR*6), rs=[]; for(let i=0;i<NR;i++){ rs.push([(R()*2-1)*3,R(),(R()*2-1)*1.2,0.12+R()*0.1]); }
  const rg=new THREE.BufferGeometry(); rg.setAttribute('position',new THREE.BufferAttribute(rp,3)); const rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0x8d98aa,transparent:true,opacity:0.2,depthWrite:false})); sc.add(rain);
  const GY=-1.84;
  const groundM=stdM(0x0d110c,0,0.95,{envMapIntensity:.2}); const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,20),groundM); ground.rotation.x=-Math.PI/2; ground.position.set(0,GY,-4); sc.add(ground);
  [[-6,-14,5],[3,-16,6],[9,-12,4]].forEach(([x,z,r])=>{ const h=new THREE.Mesh(new THREE.SphereGeometry(r,32,16),groundM); h.scale.y=0.3; h.position.set(x,GY,z); sc.add(h); });
  // bare tree silhouette: tapered trunk + recursive branches
  const treeM=stdM(0x0b0c0b,0,1,{envMapIntensity:.15}); const tree=new THREE.Group(); tree.position.set(-0.75,GY,0.2); sc.add(tree); const TR=rnd(33);
  const limb=(p,dir,len,r,dep)=>{ const e=p.clone().add(dir.clone().multiplyScalar(len)); const g=new THREE.CylinderGeometry(r*0.62,r,len,8); const m=new THREE.Mesh(g,treeM);
    m.position.copy(p).add(e).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize()); tree.add(m);
    if(dep>0){ const n=dep>2?2:3; for(let k=0;k<n;k++){ const a=(k-(n-1)/2)*0.75+(TR()-0.5)*0.4; const d=dir.clone().applyAxisAngle(new THREE.Vector3(0,0,1),a).applyAxisAngle(new THREE.Vector3(0,1,0),(TR()-0.5)*2).normalize(); limb(e,d,len*(0.66+TR()*0.12),r*0.62,dep-1); } } };
  limb(new THREE.Vector3(0,0,0),new THREE.Vector3(0.02,1,0).normalize(),0.42,0.045,4);
  const TT=new THREE.Vector3(-0.72,GY+1.05,0.2);
  // ice crystals and drops inside the cloud
  const iceT=canvasTex(64,64,(g,w,h)=>{ const gr=g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(0.25,'rgba(200,230,255,.8)'); gr.addColorStop(1,'rgba(150,200,255,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h); });
  const ice=[]; for(let i=0;i<46;i++){ const up=i%2===0; const m=new THREE.SpriteMaterial({map:iceT,color:up?0xe8f6ff:0x8fb8ff,transparent:true,opacity:0,depthTest:false,blending:THREE.AdditiveBlending}); const s=new THREE.Sprite(m); s.renderOrder=5; s.scale.setScalar(up?0.09:0.13); sc.add(s); ice.push({s,up,x:(R()*2-1)*1.2,y:R()*0.75,ph:R()*6,sp:0.2+R()*0.15}); }
  const sparks=[]; for(let i=0;i<12;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:iceT,color:0xfff2c0,transparent:true,opacity:0,depthTest:false,blending:THREE.AdditiveBlending})); s.renderOrder=6; s.position.set((R()*2-1)*1.0,1.45+R()*0.6,0.5); sc.add(s); sparks.push({s,t:0.2+i*0.12+R()*0.05}); }
  const inGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:iceT,color:0x3a5a90,transparent:true,opacity:0,depthTest:false,blending:THREE.AdditiveBlending})); inGlow.scale.set(3.2,1.6,1); inGlow.position.set(0,1.75,0.6); inGlow.renderOrder=4; sc.add(inGlow);
  const chT=(s,c)=>canvasTex(128,128,(g,w,h)=>{ g.fillStyle=c; g.beginPath(); g.arc(64,64,46,0,7); g.globalAlpha=.22; g.fill(); g.globalAlpha=1; g.strokeStyle=c; g.lineWidth=5; g.stroke(); g.fillStyle='#fff'; g.fillRect(36,58,56,12); if(s>0) g.fillRect(58,36,12,56); });
  const plusT=chT(1,'#ff7a55'), minT=chT(-1,'#5fb4ff'), charges=[];
  for(let i=0;i<9;i++){ [[1,2.25],[-1,1.2]].forEach(([s,y])=>{ const m=new THREE.SpriteMaterial({map:s>0?plusT:minT,transparent:true,opacity:0,depthTest:false}); const sp=new THREE.Sprite(m); sp.renderOrder=7;
    const x=-1.6+i*0.4+(R()-0.5)*0.12; sp.position.set(x,y+(R()-0.5)*0.18,0.8); sc.add(sp); charges.push({sp,s,t:(s>0?0.6:1.0)+i*0.07}); }); }
  // thin jagged channel: core + soft glow, fading side branches
  const S0=new THREE.Vector3(0.05,1.0,0.6), TOP=TT.clone().add(new THREE.Vector3(0,0.28,0.2)), NM=34, main=[S0.clone()];
  let p=S0.clone(); for(let i=1;i<=NM;i++){ const d=TOP.clone().sub(p).normalize(); const a=(R()-0.5)*1.3; d.applyAxisAngle(new THREE.Vector3(0,0,1),a); p=p.clone().add(d.multiplyScalar(0.075)); p.z+=(R()-0.5)*0.03; main.push(p); }
  const err=TOP.clone().sub(main[NM]); main.forEach((q,i)=>q.add(err.clone().multiplyScalar(i/NM)));
  const segs=[], glows=[];
  const addSeg=(a,b,r,i0,isMain,fade)=>{ const cm=glowMat(0xdfeaff,0), hm=glowMat(0x7aa4ff,0); const c=tubeBetween([a.x,a.y,a.z],[b.x,b.y,b.z],r,cm); const h=tubeBetween([a.x,a.y,a.z],[b.x,b.y,b.z],r*3.2,hm); sc.add(c); sc.add(h); segs.push({c,h,cm,hm,i0,isMain,fade}); };
  for(let i=0;i<NM;i++){ addSeg(main[i],main[i+1],0.0065,i,true,1); if(i%2===0){ const g=new THREE.Sprite(new THREE.SpriteMaterial({map:iceT,color:0x9fc0ff,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending})); g.position.copy(main[i]); g.scale.setScalar(0.22); sc.add(g); glows.push({g,i}); } }
  [[3,1,12],[6,-1,10],[10,1,11],[13,-1,8],[16,1,9],[19,-1,7],[22,1,6],[25,-1,5]].forEach(([i,s,n])=>{ let a=main[i].clone(); for(let k=0;k<n;k++){ const d=new THREE.Vector3(s*0.6,-1,0).normalize().applyAxisAngle(new THREE.Vector3(0,0,1),(R()-0.5)*1.4); const b=a.clone().add(d.multiplyScalar(0.06)); b.z+=(R()-0.5)*0.03; addSeg(a,b,0.0035*(1-0.5*k/n),i+k*0.8,false,1-0.75*k/n); a=b; } });
  const strM=glowMat(0xdfeaff,0); const streamer=tubeBetween([TT.x,TT.y,TT.z],[TOP.x,TOP.y,TOP.z],0.006,strM); sc.add(streamer);
  const flashBg=new THREE.Mesh(new THREE.PlaneGeometry(40,30),new THREE.MeshBasicMaterial({color:0x9fb6e0,transparent:true,opacity:0,depthWrite:false})); flashBg.position.z=-8; sc.add(flashBg);
  const Ao=(x,y,z)=>{ const o=new THREE.Object3D(); o.position.set(x,y,z); sc.add(o); return o; };
  const aIce=Ao(0.5,1.75,0.6), aNeg=charges.filter(c=>c.s<0)[6].sp, aLead=Ao(main[14].x,main[14].y,main[14].z), aRet=Ao(main[24].x,main[24].y,main[24].z);
  const TL=3.15, L0=1.95, L1=2.95;
  SCN[1]=function(lt){
    const iv=cl((lt-0.1)/0.3)*(1-0.7*cl((lt-2.1)/0.4));
    ice.forEach(o=>{ const y=o.up?o.y+o.sp*lt:o.y-o.sp*lt*0.8; o.s.position.set(o.x+0.06*Math.sin(lt*3+o.ph),1.35+((y%0.75)+0.75)%0.75,0.6); o.s.material.opacity=iv*(o.up?0.95:0.7); });
    sparks.forEach(o=>{ const u=cl((lt-o.t)/0.25); o.s.material.opacity=iv*Math.sin(Math.PI*u); o.s.scale.setScalar(0.08+0.2*u); });
    inGlow.material.opacity=0.55*iv;
    charges.forEach(c=>{ const u=cl((lt-c.t)/0.2); c.sp.material.opacity=u*(1-0.35*cl((lt-TL)/0.1)); c.sp.scale.setScalar(0.16*(0.6+0.4*ease(u))+0.03*Math.sin(Math.PI*u)); });
    const lp=cl((lt-L0)/(L1-L0)), step=Math.floor(lp*9)/9*NM+(lp>=1?1:0);
    const flash=Math.max(cl(1-(lt-TL)/0.35)*cl((lt-TL)/0.03), 0.6*cl(1-(lt-TL-0.3)/0.25)*cl((lt-TL-0.27)/0.03), 0.35*cl(1-(lt-TL-0.62)/0.3)*cl((lt-TL-0.58)/0.03));
    const after=cl((lt-TL)/0.05)*(0.4+0.6*flash), end=cl((lt-TL-1.0)/0.35);
    segs.forEach(sg=>{ const on=sg.i0<step; sg.c.visible=sg.h.visible=on; if(!on) return;
      const fresh=cl(1-(step-sg.i0)/6); // newest steps glow brighter (stepping look)
      let o=lt<TL?(0.55+0.45*fresh)*sg.fade:(sg.isMain?1:sg.fade*(1-cl((lt-TL)/0.25)));
      o*=1-end; sg.cm.opacity=o; sg.hm.opacity=(lt<TL?0.18:0.18+0.3*flash)*o;
      const w=sg.isMain?1+0.9*after:1; sg.c.scale.set(w,1,w); sg.h.scale.set(w,1,w); });
    glows.forEach(({g,i})=>{ const on=i<step; g.material.opacity=on?(lt<TL?0.12:0.12+0.5*flash)*(1-end):0; g.scale.setScalar(0.22+0.35*flash); });
    strM.opacity=cl((lt-2.75)/0.12)*(1-end); const sg=cl((lt-2.75)/0.35); streamer.scale.set(1+1.3*after,sg,1+1.3*after); streamer.position.copy(TT).lerp(new THREE.Vector3(TOP.x,TOP.y,TOP.z),0.5*sg);
    P.bl.strength=0.8+1.0*flash; fl.intensity=9*flash; hemi.intensity=0.25+1.2*flash; flashBg.material.opacity=0.2*flash;
    puffs.forEach(o=>{ o.s.material.color.copy(o.base).multiplyScalar(1+3*flash*(1.4-cl((o.y-0.95)/1.9))+0.4*iv*cl(1-Math.abs(o.y-1.75))); });
    for(let i=0;i<NR;i++){ const r=rs[i]; const y=1.0-((r[1]+lt*1.1)%1)*3.2; rp[i*6]=r[0]; rp[i*6+1]=y; rp[i*6+2]=r[2]; rp[i*6+3]=rp[i*6]-0.015; rp[i*6+4]=y-r[3]; rp[i*6+5]=r[2]; } rg.attributes.position.needsUpdate=true; rain.material.opacity=0.18+0.35*flash;
    const z=easeIO(cl(lt/4.2)); cam.position.set(0.1,0.3,9.4-0.6*z); cam.lookAt(0.1,0.27,0);
    P.c.render();
    const fo=1-cl((lt-TL+0.05)/0.2);
    layoutLabels2(labs(1,[[0,aIce,cl((lt-0.4)/0.2)*(1-cl((lt-1.85)/0.2))],[1,aNeg,cl((lt-1.2)/0.2)*fo],[2,aLead,cl((lt-2.1)/0.2)*fo],[3,aRet,cl((lt-TL-0.1)/0.2)]]),cam,600,130);
    capT(1,lt,[0.35,0.5,0.65,TL-0.05,TL+0.05,TL+0.12]); };
})();

// ---------- S2 /zoom-in a snowflake: a flake drifts onto a dark knitted mitten; the camera pushes in until the six-armed
// hexagonal ice crystal with its side branches fills the frame, glinting.
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#141821','#030405'); ren.toneMappingExposure=0.7;
  sc.fog=new THREE.FogExp2(0x06070a,0.09);
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.01,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.4,radius:0.4,th:0.9});
  const key=new THREE.DirectionalLight(0xffffff,0.9); key.position.set(-3,6,2); sc.add(key); const rimL=new THREE.DirectionalLight(0x9fd0ff,0.9); rimL.position.set(4,3,-3); sc.add(rimL); sc.add(new THREE.HemisphereLight(0xcfe0ff,0x0a0a10,0.25));
  // knitted wool: rows of V stitches with fuzz
  const knit=canvasTex(512,512,(g,w,h)=>{ const R=rnd(8); g.fillStyle='#0d1018'; g.fillRect(0,0,w,h);
    for(let r=0;r<8;r++) for(let c=0;c<4;c++){ const x=c*128+64, y=r*64+32; [-1,1].forEach(s=>{ g.save(); g.translate(x+s*26,y); g.rotate(s*0.5);
      const gr=g.createLinearGradient(-28,0,28,0); gr.addColorStop(0,'#0e121c'); gr.addColorStop(0.5,'#232b3e'); gr.addColorStop(1,'#0e121c'); g.fillStyle=gr; g.beginPath(); g.ellipse(0,0,26,40,0,0,7); g.fill();
      g.strokeStyle='rgba(120,140,190,.10)'; g.lineWidth=1; for(let k=0;k<14;k++){ g.beginPath(); g.moveTo(-20+R()*40,-34+R()*10); g.lineTo(-20+R()*40,30+R()*6); g.stroke(); } g.restore(); }); }
    g.strokeStyle='rgba(150,165,210,.12)'; for(let i=0;i<900;i++){ const x=R()*w,y=R()*h,a=R()*6,l=4+R()*12; g.beginPath(); g.moveTo(x,y); g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l); g.stroke(); } });
  knit.wrapS=knit.wrapT=THREE.RepeatWrapping; knit.repeat.set(22,22);
  const wool=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.MeshStandardMaterial({map:knit,bumpMap:knit,bumpScale:0.02,roughness:1,envMapIntensity:.2})); wool.rotation.x=-Math.PI/2; sc.add(wool);
  // the snowflake (XY plane, radius 0.5)
  const iceM=new THREE.MeshPhysicalMaterial({color:0xc4e2ff,metalness:0,roughness:0.06,clearcoat:1,clearcoatRoughness:.05,transparent:true,opacity:0.42,envMapIntensity:1.3,emissive:0x2a5a8a,emissiveIntensity:0.05,side:THREE.DoubleSide,depthWrite:false});
  const ridgeM=new THREE.MeshPhysicalMaterial({color:0xe8f6ff,roughness:0.03,clearcoat:1,envMapIntensity:1.6,transparent:true,opacity:0.7});
  const rimM=new THREE.ShaderMaterial({uniforms:{col:{value:new THREE.Color(0x6fb0e8)},op:{value:0.6}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,vertexShader:XRAY_VS,fragmentShader:XRAY_FS});
  const flake=new THREE.Group(), FL=new THREE.Group(); FL.add(flake); sc.add(FL);
  const add=(geo,x,y,rot,mat)=>{ const m=new THREE.Mesh(geo,mat||iceM); m.position.set(x,y,0); m.rotation.z=rot; flake.add(m); if(!mat){ const r=new THREE.Mesh(geo,rimM); r.position.copy(m.position); r.rotation.copy(m.rotation); flake.add(r); } return m; };
  const hexG=(r,d)=>{ const g=new THREE.CylinderGeometry(r,r,d,6); g.rotateX(Math.PI/2); return g; };
  add(hexG(0.11,0.02),0,0,Math.PI/6); { const t=new THREE.TorusGeometry(0.075,0.005,4,6); add(t,0,0,Math.PI/6,ridgeM); }
  const tips=[], brs=[];
  for(let a=0;a<6;a++){ const th=a*Math.PI/3, ux=Math.cos(th), uy=Math.sin(th);
    const arm=rbox(0.03,0.42,0.014,0.008,2); add(arm,ux*0.29,uy*0.29,th-Math.PI/2);
    add(new THREE.BoxGeometry(0.006,0.4,0.022),ux*0.3,uy*0.3,th-Math.PI/2,ridgeM);
    add(hexG(0.045,0.016),ux*0.5,uy*0.5,th+Math.PI/6); tips.push(new THREE.Vector3(ux*0.52,uy*0.52,0));
    [[0.15,0.12],[0.22,0.16],[0.3,0.15],[0.37,0.11],[0.43,0.065]].forEach(([r,L],j)=>{ [-1,1].forEach(s=>{ const bth=th+s*Math.PI/3; const bx=ux*r+Math.cos(bth)*L/2, by=uy*r+Math.sin(bth)*L/2;
      add(rbox(0.017,L,0.01,0.005,2),bx,by,bth-Math.PI/2); if(L>0.13) [0.4,0.7].forEach(q=>{ const sx=ux*r+Math.cos(bth)*L*q, sy=uy*r+Math.sin(bth)*L*q, sth=bth-s*Math.PI/3*-1; const l2=0.045*(1.1-q);
        add(rbox(0.01,l2,0.008,0.004,1),sx+Math.cos(th)*l2/2,sy+Math.sin(th)*l2/2,th-Math.PI/2); });
      if(a===4&&j===1&&s===1) brs.push(new THREE.Vector3(ux*r+Math.cos(bth)*L*0.8,uy*r+Math.sin(bth)*L*0.8,0)); }); }); }
  // sparkles (4-point stars) on the arms
  const starT=canvasTex(128,128,(g,w,h)=>{ const gr=g.createRadialGradient(64,64,0,64,64,64); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(0.15,'rgba(220,240,255,.5)'); gr.addColorStop(1,'rgba(200,230,255,0)'); g.fillStyle=gr; g.fillRect(0,0,w,h);
    g.fillStyle='rgba(255,255,255,.9)'; g.beginPath(); g.moveTo(64,0); g.lineTo(68,60); g.lineTo(128,64); g.lineTo(68,68); g.lineTo(64,128); g.lineTo(60,68); g.lineTo(0,64); g.lineTo(60,60); g.closePath(); g.fill(); });
  const R=rnd(17), stars=[]; for(let i=0;i<14;i++){ const a=(i%6)*Math.PI/3, r=0.12+R()*0.4; const s=new THREE.Sprite(new THREE.SpriteMaterial({map:starT,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,fog:false})); s.position.set(Math.cos(a)*r,Math.sin(a)*r,0.02); flake.add(s); stars.push({s,t:1.1+R()*2.9,d:0.35+R()*0.3}); }
  // a few more flakes resting on the wool (context in the wide shot)
  [[-1.3,0.2,-0.9,0.3],[1.1,0.1,-1.6,0.24],[0.7,0.0,0.9,0.18],[-0.9,0.0,1.2,0.2],[1.8,0,0.2,0.22]].forEach(([x,_,z,s])=>{ const c=flake.clone(); c.scale.setScalar(s); c.rotation.set(-Math.PI/2,0,R()*3); c.position.set(x,0.012,z); c.children.forEach(m=>{ if(m.isSprite) m.visible=false; }); sc.add(c); });
  const aArm=new THREE.Object3D(); aArm.position.copy(tips[1]); flake.add(aArm); const aBr=new THREE.Object3D(); aBr.position.copy(brs[0]); flake.add(aBr);
  const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
  SCN[2]=function(lt){
    const f=ease(cl(lt/1.2)); const h=0.03+1.4*(1-f); FL.position.set(0.25*(1-f)*Math.sin(lt*2.2),h,-0.2*(1-f));
    FL.rotation.set(-Math.PI/2+0.5*(1-f)*Math.sin(lt*3.1),0.35*(1-f)*Math.cos(lt*2.6),0.4+0.25*lt*(1-0.6*f));
    stars.forEach(o=>{ const u=cl((lt-o.t)/o.d); o.s.material.opacity=Math.sin(Math.PI*u)*cl((lt-0.8)/0.3); o.s.scale.setScalar(0.04+0.14*Math.sin(Math.PI*u)); });
    rimM.uniforms.op.value=0.6; iceM.emissiveIntensity=0.05+0.03*Math.sin(lt*2);
    const z=easeIO(cl((lt-0.5)/2.4)); const C0=V3(0.0,3.6,3.6), T0=V3(0,0.5,0), C1=V3(0.0,4.0,0.6), T1=V3(0,0,0.03);
    cam.position.copy(C0).lerp(C1,z); cam.lookAt(T0.clone().lerp(T1,z)); P.c.render();
    placeLab(document.getElementById('l2_0'),aArm,cam,600,540,cl((lt-2.3)/0.2)); placeLab(document.getElementById('l2_1'),aBr,cam,110,1430,cl((lt-2.7)/0.2));
    caption(2,lt-0.7); };
})();
