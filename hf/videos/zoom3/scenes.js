// ---------- v2 look: real studio HDRI (CC0, pmndrs/assets "studio"), bloom, depth of field
function b64buf(s){ const bin=atob(s); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u.buffer; }
let _HDR=null;
function hdrEnv(ren){ if(!_HDR){ const d=new THREE.EXRLoader().parse(b64buf(window.STUDIO_EXR));
    const t=new THREE.DataTexture(d.data,d.width,d.height,d.format,d.type); t.mapping=THREE.EquirectangularReflectionMapping; t.encoding=THREE.LinearEncoding;
    t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter; t.generateMipmaps=false; t.flipY=false; t.needsUpdate=true; _HDR=t; }
  const pm=new THREE.PMREMGenerator(ren); return pm.fromEquirectangular(_HDR).texture; }
function mkComposer(ren,sc,cam,o){ o=o||{}; const c=new THREE.EffectComposer(ren); c.setPixelRatio(1); c.setSize(1080,1920);
  c.addPass(new THREE.RenderPass(sc,cam));
  const bl=new THREE.UnrealBloomPass(new THREE.Vector2(540,960),o.bloom??0.45,o.radius??0.5,o.th??0.95); c.addPass(bl);
  let bk=null; if(o.dof){ bk=new THREE.BokehPass(sc,cam,{focus:o.focus||6,aperture:o.aperture||0.0012,maxblur:o.maxblur||0.006}); c.addPass(bk); }
  return {c,bl,bk}; }
function mkRenderer2(id){ const r=new THREE.WebGLRenderer({canvas:document.getElementById(id),antialias:true,alpha:false,preserveDrawingBuffer:true});
  r.setPixelRatio(1); r.setSize(1080,1920,false); r.outputEncoding=THREE.sRGBEncoding; r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=0.62;
  r.setClearColor(0x07080a,1); return r; }
function bgGrad(sc,c1,c2){ const t=canvasTex(512,1024,(g,w,h)=>{ const gr=g.createRadialGradient(w/2,h*0.42,10,w/2,h*0.45,h*0.62); gr.addColorStop(0,c1); gr.addColorStop(1,c2); g.fillStyle=gr; g.fillRect(0,0,w,h); }); sc.background=t; }
// ---------- S0 /visualize how a computer works: data as light moving SSD -> RAM -> CPU -> GPU -> screen
// ---------- S0 /zoom-in my phone screen: 2D canvas, phone -> image -> pixels -> red/green/blue subpixels
(function(){ const cv=document.getElementById('cv0'); const g=cv.getContext('2d');
  const SW=180, SH=390; const img=document.createElement('canvas'); img.width=SW; img.height=SH; const ig=img.getContext('2d');
  { const gr=ig.createLinearGradient(0,0,0,SH); gr.addColorStop(0,'#2a1b5e'); gr.addColorStop(0.55,'#ff4b1f'); gr.addColorStop(1,'#ffc04a'); ig.fillStyle=gr; ig.fillRect(0,0,SW,SH);
    ig.fillStyle='#fff3c4'; ig.beginPath(); ig.arc(SW/2,SH*0.56,34,0,7); ig.fill();
    ig.fillStyle='#14102a'; ig.beginPath(); ig.moveTo(0,SH*0.7); for(let x=0;x<=SW;x+=10) ig.lineTo(x,SH*0.7-14*Math.sin(x/17)-8*Math.sin(x/7)); ig.lineTo(SW,SH); ig.lineTo(0,SH); ig.fill();
    ig.fillStyle='#fff'; ig.font='bold 30px sans-serif'; ig.textAlign='center'; ig.fillText('9:41',SW/2,58); ig.font='12px sans-serif'; ig.fillText('Thursday',SW/2,76); }
  const px=ig.getImageData(0,0,SW,SH).data;
  const FX=SW/2+20.5, FY=SH*0.56-22.5; // focus point: the sun's edge against the sky
  const PW=600, PH=1300, PX=(1080-PW)/2, PY=(1920-PH)/2+40; // phone screen rect on canvas at zoom 1
  SCN[0]=function(lt){ g.setTransform(1,0,0,1,0,0);
    const bg=g.createRadialGradient(540,860,40,540,900,1100); bg.addColorStop(0,'#2a2d34'); bg.addColorStop(1,'#08090b'); g.fillStyle=bg; g.fillRect(0,0,1080,1920);
    const e=easeIO(cl((lt-0.3)/2.0)); const Z=Math.exp(Math.log(95)*e); // zoom factor on the phone
    const s=PW/SW*Z; // screen px per image pixel
    const fx=PX+FX*PW/SW, fy=PY+FY*PH/SH; // focus on canvas at zoom 1
    const cx=540, cy=900; const ox=fx+(cx-fx)*cl(e*3), oy=fy+(cy-fy)*cl(e*3); // focus moves to centre while zooming
    g.save(); g.translate(ox,oy); g.scale(Z,Z); g.translate(-fx,-fy);
    // phone body
    g.fillStyle='#0d0e10'; g.shadowColor='rgba(0,0,0,.7)'; g.shadowBlur=80; g.shadowOffsetY=40; g.beginPath(); g.roundRect(PX-26,PY-26,PW+52,PH+52,90); g.fill(); g.shadowColor='transparent';
    g.strokeStyle='#4a4d55'; g.lineWidth=6; g.stroke();
    g.save(); g.beginPath(); g.roundRect(PX,PY,PW,PH,66); g.clip(); g.imageSmoothingEnabled=s<5; g.drawImage(img,PX,PY,PW,PH); g.restore();
    g.fillStyle='#000'; g.beginPath(); g.roundRect(PX+PW/2-80,PY+22,160,46,23); g.fill();
    g.restore();
    // subpixels: once a pixel is big, draw each as three R/G/B bars
    const sa=cl((s-14)/16); if(sa>0){ const x0=Math.floor((0-ox)/s+FX), x1=Math.ceil((1080-ox)/s+FX), y0=Math.floor((0-oy)/s+FY), y1=Math.ceil((1920-oy)/s+FY);
      g.globalAlpha=sa; g.fillStyle='#050505'; g.fillRect(0,0,1080,1920);
      for(let j=y0;j<=y1;j++) for(let i=x0;i<=x1;i++){ if(i<0||j<0||i>=SW||j>=SH) continue; const k=(j*SW+i)*4; const X=ox+(i-FX)*s, Y=oy+(j-FY)*s; const w=s/3;
        [[Math.max(px[k],60),0,0],[0,Math.max(px[k+1],60),0],[Math.round(px[k+2]*0.2),Math.round(px[k+2]*0.3),Math.max(px[k+2],110)]].forEach((c,m)=>{ g.fillStyle='rgb('+c.join(',')+')'; g.beginPath(); g.roundRect(X+m*w+w*0.12,Y+s*0.08,w*0.76,s*0.84,Math.min(w*0.3,12)); g.fill(); }); }
      g.globalAlpha=1; }
    // anchors for labels
    const pxEl=document.getElementById('l0_0'), spEl=document.getElementById('l0_1');
    const la=cl((s-3)/3)*(1-cl((s-14)/8)); const lb=cl((lt-2.0)/0.25);
    [[pxEl,la,ox,oy],[spEl,lb,ox-s*0.33,oy+s*0.1]].forEach(([el,a,x,y])=>{ el.style.left='650px'; el.style.top=(y-160)+'px'; el.style.opacity=a; const ld=el.querySelector('.ld'); const dx=x-650, dy=160; ld.style.width=Math.hypot(dx,dy)+'px'; ld.style.left='0px'; ld.style.transform='rotate('+Math.atan2(dy,dx)+'rad)'; });
    caption(0,lt-0.85); };
})();

// ---------- S1 /explain-3d how a lock opens: pin-tumbler cutaway, key slides in, pins rise to the shear line, plug turns
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#25292f','#050607');
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.6,radius:0.5,th:0.85});
  const key=new THREE.DirectionalLight(0xffffff,1.0); key.position.set(2,5,6); sc.add(key);
  const L=new THREE.Group(); sc.add(L);
  const glass=new THREE.MeshPhysicalMaterial({color:0xcfd8e3,metalness:0,roughness:.08,transmission:.9,thickness:.4,transparent:true,opacity:.35,depthWrite:false,side:THREE.DoubleSide});
  const housing=new THREE.Mesh(rbox(3.2,2.4,0.9,0.12),glass); housing.position.set(0,0.55,0); L.add(housing);
  const brass=new THREE.MeshPhysicalMaterial({color:0xd8a948,metalness:1,roughness:.28,envMapIntensity:1});
  const steel=new THREE.MeshPhysicalMaterial({color:0xc7ccd3,metalness:1,roughness:.22,envMapIntensity:1});
  const plugG=new THREE.Group(); L.add(plugG); // rotates around X
  const plug=new THREE.Mesh(new THREE.CylinderGeometry(0.62,0.62,3.0,64),new THREE.MeshPhysicalMaterial({color:0xc9973c,metalness:1,roughness:.32,transparent:true,opacity:.55,depthWrite:false})); plug.rotation.z=Math.PI/2; plugG.add(plug);
  const SHEAR=0.62, NP=5, xs=[-1.0,-0.5,0,0.5,1.0], cut=[0.12,0.34,0.05,0.26,0.18]; // key top height at each pin (relative to key base y=-0.3)
  const keyPins=[], drvPins=[], springs=[];
  xs.forEach((x,i)=>{ const kpL=SHEAR-(-0.3+0.28+cut[i]); const kp=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,kpL,24),brass); kp.userData.L=kpL; L.add(kp); keyPins.push(kp);
    const dp=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,0.42,24),steel); L.add(dp); drvPins.push(dp);
    const pts=[]; for(let k=0;k<=80;k++){ const a=k*0.55; pts.push(new THREE.Vector3(Math.cos(a)*0.09,k/80,Math.sin(a)*0.09)); }
    const sp=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),160,0.012,6,false),steel); sp.position.x=x; L.add(sp); springs.push(sp); });
  // key: flat blade whose top edge has the cuts
  const ks=new THREE.Shape(); ks.moveTo(-1.5,-0.3); ks.lineTo(1.3,-0.3); const top=(u)=>{ let h=0.62; xs.forEach((x,i)=>{ h=Math.min(h,0.28+cut[i]+Math.abs(u-x)*0.9); }); return Math.min(h,0.28+0.42+(-1.5-u+3.1)*0); };
  for(let k=0;k<=120;k++){ const u=1.3-k/120*2.8; ks.lineTo(u,-0.3+Math.min(top(u),0.28+((u+1.5)/0.3)*0.4)); } ks.lineTo(-1.5,-0.3);
  const bow=new THREE.Shape(); bow.absarc(1.95,0.0,0.62,0,Math.PI*2); const hole=new THREE.Path(); hole.absarc(2.15,0.0,0.16,0,Math.PI*2,true); bow.holes.push(hole);
  const keyG=new THREE.Group(); plugG.add(keyG);
  const kb=new THREE.Mesh(new THREE.ExtrudeGeometry(ks,{depth:0.12,bevelEnabled:true,bevelThickness:0.015,bevelSize:0.015,bevelSegments:2}),steel); kb.position.z=-0.06; keyG.add(kb);
  const kbow=new THREE.Mesh(new THREE.ExtrudeGeometry(bow,{depth:0.16,bevelEnabled:true,bevelThickness:0.03,bevelSize:0.03,bevelSegments:3,curveSegments:48}),steel); kbow.position.z=-0.08; keyG.add(kbow);
  const kneck=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.5,0.14),steel); kneck.position.set(1.38,0,0); keyG.add(kneck);
  const shear=new THREE.Mesh(new THREE.BoxGeometry(3.0,0.025,0.95),new THREE.MeshBasicMaterial({color:0x5dffa0,transparent:true,opacity:0,toneMapped:false,depthWrite:false})); shear.position.y=SHEAR; L.add(shear);
  const shA=new THREE.Object3D(); shA.position.set(1.45,SHEAR,0); L.add(shA);
  const pinA=new THREE.Object3D(); pinA.position.set(0.5,1.25,0); L.add(pinA);
  SCN[1]=function(lt){ const ins=easeIO(cl((lt-0.15)/1.2)); const off=(1-ins)*3.2; keyG.position.x=off;
    const rot=easeIO(cl((lt-1.85)/0.6)); plugG.rotation.x=-rot*Math.PI/2;
    const ok=cl((lt-1.4)/0.2); shear.material.opacity=0.85*ok*(1-0.6*rot);
    xs.forEach((x,i)=>{ const u=x-off; let ktop=-0.3+0.06; if(u>-1.5&&u<1.3) ktop=-0.3+Math.min(top(u),0.28+((u+1.5)/0.3)*0.4); else if(u>=1.3) ktop=-0.3+0.06;
      const kp=keyPins[i], Lk=kp.userData.L; let base=Math.max(ktop,-0.25); const ktopY=base+Lk;
      if(rot>0){ // key pin turns with the plug, driver pin stays above the shear line
        const a=-rot*Math.PI/2; const cy=base+Lk/2; kp.position.set(x,cy*Math.cos(a),cy*Math.sin(a)); kp.rotation.x=a; }
      else { kp.position.set(x,base+Lk/2,0); kp.rotation.x=0; }
      const dpY=Math.max(SHEAR,rot>0?SHEAR:ktopY)+0.21; drvPins[i].position.set(x,dpY,0);
      const sb=dpY+0.21, stop=1.62; springs[i].position.y=sb; springs[i].scale.y=Math.max(0.05,stop-sb); });
    L.rotation.set(0.12,-0.55+0.25*easeIO(cl(lt/3)),0); L.scale.setScalar(0.32); L.position.set(-0.12,0.2,0);
    cam.position.set(0,0.5,6.4-0.5*ease(lt/3)); cam.lookAt(0,0.15,0); P.c.render();
    layoutLabels([['l1_0',kbow],['l1_1',pinA],['l1_2',shA]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-[0.4,0.8,1.45][i])/0.2)]),cam,745,130);
    caption(1,lt); };
})();

// ---------- S2 /explain-3d how a watch ticks: balance wheel swings, escapement lets the gear train advance one tick at a time
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#2a2620','#060505');
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.45,radius:0.5,th:0.9});
  const key=new THREE.DirectionalLight(0xfff2dd,1.3); key.position.set(-3,6,4); sc.add(key);
  const brass=new THREE.MeshPhysicalMaterial({color:0xd9ad55,metalness:1,roughness:.25,envMapIntensity:1.1});
  const steel=new THREE.MeshPhysicalMaterial({color:0xcfd4da,metalness:1,roughness:.18,envMapIntensity:1});
  const ruby=new THREE.MeshPhysicalMaterial({color:0x9a0c2c,roughness:.12,metalness:.1,clearcoat:1,emissive:0x1a0006});
  function gear(r,n,d,mat,hub){ const sh=new THREE.Shape(); const td=Math.min(0.08,r*0.12);
    for(let i=0;i<n*4;i++){ const a=i/(n*4)*Math.PI*2; const rr=(i%4===1||i%4===2)?r:r-td; const x=Math.cos(a)*rr, y=Math.sin(a)*rr; if(i===0) sh.moveTo(x,y); else sh.lineTo(x,y); }
    if(r>0.35){ for(let k=0;k<4;k++){ const p=new THREE.Path(); const a0=k*Math.PI/2+0.25, a1=a0+Math.PI/2-0.5; p.absarc(0,0,r*0.78,a0,a1,false); p.absarc(0,0,r*0.3,a1,a0,true); sh.holes.push(p); } }
    const g=new THREE.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelThickness:0.008,bevelSize:0.008,bevelSegments:2,curveSegments:16}); g.rotateX(-Math.PI/2);
    const m=new THREE.Mesh(g,mat); const G=new THREE.Group(); G.add(m); const ax=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.25,16),steel); G.add(ax);
    const jw=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.02,24),ruby); jw.position.y=0.13; G.add(jw); return G; }
  const W=new THREE.Group(); sc.add(W);
  const plate=new THREE.Mesh(new THREE.CylinderGeometry(2.0,2.0,0.08,96),new THREE.MeshPhysicalMaterial({color:0x8e9198,metalness:1,roughness:.35,map:canvasTex(1024,1024,(g,w,h)=>{ g.fillStyle='#9a9da4'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(255,255,255,.10)'; g.lineWidth=3; for(let r=10;r<720;r+=9){ g.beginPath(); g.arc(w/2,h/2,r,0,7); g.stroke(); } })})); plate.position.y=-0.1; W.add(plate);
  const barrel=gear(0.75,60,0.18,brass); barrel.position.set(-0.75,0,0.7); W.add(barrel);
  const spring=[]; for(let k=0;k<=200;k++){ const a=k*0.22, r=0.12+k/200*0.5; spring.push(new THREE.Vector3(Math.cos(a)*r,0.2,Math.sin(a)*r)); }
  const msp=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spring),400,0.012,5,false),steel); barrel.add(msp);
  const g2=gear(0.5,40,0.08,brass); g2.position.set(0.45,0.02,0.55); W.add(g2);
  const g3=gear(0.38,32,0.08,brass); g3.position.set(0.55,0.04,-0.35); W.add(g3);
  const esc=gear(0.3,15,0.06,steel); esc.position.set(-0.1,0.06,-0.75); W.add(esc);
  const fork=new THREE.Group(); fork.position.set(-0.45,0.12,-1.1); W.add(fork);
  const fb=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.04,0.7),steel); fb.position.z=0.0; fb.rotation.y=0.6; fork.add(fb);
  [-1,1].forEach(s=>{ const p=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,0.12),ruby); p.position.set(0.2+s*0.1,0,0.22); fork.add(p); });
  const bal=new THREE.Group(); bal.position.set(-0.95,0.18,-1.0); W.add(bal);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(0.48,0.04,16,96),brass); rim.rotation.x=Math.PI/2; bal.add(rim);
  [0,1,2].forEach(k=>{ const sp=new THREE.Mesh(new THREE.BoxGeometry(0.92,0.025,0.05),brass); sp.rotation.y=k*Math.PI/3; bal.add(sp); });
  const hs=[]; for(let k=0;k<=160;k++){ const a=k*0.3, r=0.04+k/160*0.3; hs.push(new THREE.Vector3(Math.cos(a)*r,0.06,Math.sin(a)*r)); }
  const hair=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hs),320,0.006,4,false),new THREE.MeshPhysicalMaterial({color:0x3f6cff,metalness:1,roughness:.2,emissive:0x0a1a55})); bal.add(hair);
  const glow=new THREE.Mesh(new THREE.TorusGeometry(0.48,0.06,12,96),new THREE.MeshBasicMaterial({color:0xff9a3d,transparent:true,opacity:0,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false})); glow.rotation.x=Math.PI/2; bal.add(glow);
  const sh=shadowPlane(5,5,.6); sh.position.y=-0.2; sc.add(sh);
  SCN[2]=function(lt){ const on=cl((lt-0.2)/0.3); const per=0.5; // one swing = one tick
    const ph=lt/per*Math.PI; bal.rotation.y=on*1.9*Math.sin(ph); glow.material.opacity=on*0.6*Math.pow(Math.abs(Math.cos(ph)),8);
    const ticks=Math.floor(lt/per+0.5)+ (cl(((lt/per+0.5)%1)/0.15)); // step + quick settle
    esc.rotation.y=-ticks*(Math.PI*2/15)*on; fork.rotation.y=0.25*Math.sign(Math.sin(ph))*on;
    g3.rotation.y=ticks*(Math.PI*2/15)*(15/32)*on; g2.rotation.y=-ticks*(Math.PI*2/15)*(15/32)*(32/40)*0.5*on; barrel.rotation.y=ticks*0.01*on;
    W.rotation.set(0.75-0.15*easeIO(cl(lt/3)),0.4+lt*0.12,0); W.scale.setScalar(0.54); W.position.set(0.25,0.3,0);
    cam.position.set(0,0.4,6.4-0.6*ease(lt/3)); cam.lookAt(0,0,0); P.c.render();
    layoutLabels([['l2_0',barrel],['l2_1',bal],['l2_2',esc]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-0.4-i*0.3)/0.2)]),cam,700,130);
    caption(2,lt); };
})();
