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
(function(){ const ren=mkRenderer2('cv0'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#1a1f2a','#040507');
  const cam=new THREE.PerspectiveCamera(32,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.88});
  const key=new THREE.DirectionalLight(0xffffff,0.5); key.position.set(2,6,3); sc.add(key);
  const flat=(g)=>{ g.rotateX(-Math.PI/2); return g; };
  const B=new THREE.Group(); sc.add(B);
  const pcbT=canvasTex(1024,1024,(g,w,h)=>{ g.fillStyle='#0d1f17'; g.fillRect(0,0,w,h); g.strokeStyle='rgba(120,200,160,.18)'; g.lineWidth=3;
    for(let i=0;i<70;i++){ const x=(i*137)%w, y=(i*251)%h; g.beginPath(); g.moveTo(x,y); g.lineTo(x+((i%3)-1)*200,y); g.lineTo(x+((i%3)-1)*200,y+((i%2)?160:-160)); g.stroke(); }
    g.fillStyle='rgba(200,170,90,.5)'; for(let i=0;i<300;i++){ g.fillRect((i*97)%w,(i*61)%h,5,5); } });
  const board=new THREE.Mesh(flat(rbox(3.2,4.2,0.06,0.12,4)),new THREE.MeshStandardMaterial({map:pcbT,roughness:.6,metalness:.2,envMapIntensity:.15})); B.add(board);
  { const uv=board.geometry.attributes.uv, p=board.geometry.attributes.position; for(let i=0;i<uv.count;i++) uv.setXY(i,(p.getX(i)+1.6)/3.2,(p.getZ(i)+2.1)/4.2); uv.needsUpdate=true; }
  const glowMat=(c)=>new THREE.MeshStandardMaterial({color:0x15171b,metalness:.6,roughness:.4,emissive:c,emissiveIntensity:0,envMapIntensity:.2});
  const cpuM=glowMat(0xff6a3d); const cpu=new THREE.Mesh(flat(rbox(0.8,0.8,0.12,0.06)),cpuM); cpu.position.set(-0.35,0.09,-0.55); B.add(cpu);
  const ihs=new THREE.Mesh(flat(rbox(0.62,0.62,0.03,0.04)),new THREE.MeshPhysicalMaterial({color:0x9ca1a9,metalness:1,roughness:.3,envMapIntensity:.35})); ihs.position.set(-0.35,0.165,-0.55); B.add(ihs);
  const ramM=glowMat(0x4aa8ff); const ram=new THREE.Group(); B.add(ram);
  [0,0.28].forEach(dx=>{ const st=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.34,1.5),ramM); st.position.set(0.75+dx,0.2,-0.55); ram.add(st);
    for(let i=0;i<6;i++){ const c=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.14,0.16),new THREE.MeshStandardMaterial({color:0x0c0d10,roughness:.4})); c.position.set(0.75+dx,0.22,-1.12+i*0.23); ram.add(c); } });
  const ssdM=glowMat(0x7cf0c4); const ssd=new THREE.Mesh(flat(rbox(1.2,0.24,0.04,0.03)),ssdM); ssd.position.set(-0.2,0.06,0.45); B.add(ssd);
  const gpuM=glowMat(0xb06bff); const gpu=new THREE.Group(); B.add(gpu);
  const gcard=new THREE.Mesh(flat(rbox(2.6,0.9,0.16,0.06)),gpuM); gpu.add(gcard); gpu.position.set(0,0.16,1.35);
  [-0.65,0.65].forEach(x=>{ const r=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.03,12,48),new THREE.MeshStandardMaterial({color:0x2a2d33,metalness:.6,roughness:.3})); r.rotation.x=Math.PI/2; r.position.set(x,0.09,0); gpu.add(r); });
  // data paths + pulses
  const paths=[[ssd.position,new THREE.Vector3(0.3,0.1,0.2),new THREE.Vector3(0.75,0.25,-0.3)],[new THREE.Vector3(0.75,0.25,-0.55),new THREE.Vector3(0.3,0.2,-0.55),cpu.position],
    [cpu.position,new THREE.Vector3(-0.35,0.2,0.6),gpu.position],[gpu.position,new THREE.Vector3(0,1.0,1.2),new THREE.Vector3(0,1.6,-0.5)]].map(pts=>new THREE.CatmullRomCurve3(pts.map(v=>v.clone().setY(Math.max(v.y,0.12)))));
  const trailMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,toneMapped:false});
  const tubes=paths.map(c=>{ const m=new THREE.Mesh(new THREE.TubeGeometry(c,60,0.012,6,false),trailMat.clone()); B.add(m); return m; });
  const pulses=[]; for(let i=0;i<24;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.035,12,8),new THREE.MeshBasicMaterial({color:0xffe6c8,toneMapped:false,transparent:true})); B.add(m); pulses.push(m); }
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.3),new THREE.MeshBasicMaterial({toneMapped:false,transparent:true,opacity:0,map:canvasTex(512,300,(g,w,h)=>{ const gr=g.createLinearGradient(0,0,w,h); gr.addColorStop(0,'#ff4b1f'); gr.addColorStop(1,'#5b3cff'); g.fillStyle=gr; g.fillRect(0,0,w,h); g.fillStyle='rgba(255,255,255,.9)'; g.font='bold 54px sans-serif'; g.fillText('Hello, world',90,170); })}));
  screen.position.set(0,1.9,-0.6); screen.rotation.x=-0.15; B.add(screen);
  const segT=[0.55,1.05,1.55,2.05];
  SCN[0]=function(lt){ const inT=easeIO(cl(lt/0.6)); B.position.y=-0.6+0.6*inT; B.rotation.set(0.1,-0.5+0.35*easeIO(cl(lt/3.2)),0); B.scale.setScalar(0.46);
    const mats=[ssdM,ramM,cpuM,gpuM]; mats.forEach((m,i)=>{ const t=lt-segT[i]; m.emissiveIntensity=t>0?0.9*Math.exp(-Math.max(0,t-0.4)*1.5)+0.18:0; });
    tubes.forEach((tb,i)=>{ tb.material.opacity=0.5*cl((lt-segT[i])/0.2); });
    pulses.forEach((pm,j)=>{ const seg=j%4, k=Math.floor(j/4); const u=((lt-segT[seg])*1.6-k*0.17); pm.visible=u>0&&u<1; if(pm.visible) pm.position.copy(paths[seg].getPoint(u)); });
    screen.material.opacity=cl((lt-2.25)/0.3);
    cam.position.set(0,3.6-0.4*easeIO(cl(lt/3.2)),6.2-0.6*ease(lt/3.2)); cam.lookAt(0,0.35,0.1); P.c.render();
    layoutLabels([['l0_0',ssd],['l0_1',ram.children[0]],['l0_2',cpu],['l0_3',gpu]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-segT[i]-0.1)/0.2)]),cam,700,120);
    caption(0,lt); };
})();

// ---------- S1 /explain-3d how a drone flies
(function(){ const ren=mkRenderer2('cv1'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#22262e','#050607');
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.7,radius:0.5,th:0.8});
  const key=new THREE.DirectionalLight(0xffffff,0.8); key.position.set(3,5,4); sc.add(key);
  const shell=new THREE.MeshPhysicalMaterial({color:0xe9eaec,roughness:.3,metalness:0,clearcoat:1,clearcoatRoughness:.15,envMapIntensity:.6});
  const dark=new THREE.MeshPhysicalMaterial({color:0x1a1c20,roughness:.45,metalness:.3,envMapIntensity:.5});
  const D=new THREE.Group(); sc.add(D);
  const body=new THREE.Mesh(new THREE.SphereGeometry(0.45,48,24),shell); body.scale.set(1.0,0.38,1.35); D.add(body);
  const bat=new THREE.Mesh(rbox(0.42,0.6,0.16,0.06),dark); bat.rotation.x=-Math.PI/2; const batG=new THREE.Group(); batG.add(bat); D.add(batG);
  const chipG=new THREE.Group(); const pcb=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.02,0.4),new THREE.MeshStandardMaterial({color:0x10241c,roughness:.5,metalness:.3})); chipG.add(pcb);
  const ch=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.03,0.14),new THREE.MeshStandardMaterial({color:0x111214,emissive:0x4aa8ff,emissiveIntensity:0})); ch.position.y=0.02; chipG.add(ch); D.add(chipG);
  const arms=[], motors=[], props=[]; const corners=[[1,1],[-1,1],[1,-1],[-1,-1]];
  corners.forEach(([sx,sz],i)=>{ const arm=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,1.0,16),shell); arm.rotation.z=Math.PI/2; arm.rotation.y=Math.atan2(sz,sx)*-1;
    arm.position.set(sx*0.42,0,sz*0.42); D.add(arm); arms.push(arm);
    const mg=new THREE.Group(); mg.position.set(sx*0.78,0.06,sz*0.78); D.add(mg);
    const mo=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.14,32),new THREE.MeshStandardMaterial({color:0x2a2d33,metalness:.8,roughness:.3,emissive:0xff6a3d,emissiveIntensity:0})); mg.add(mo); motors.push(mo);
    const pr=new THREE.Group(); pr.position.y=0.1; mg.add(pr); [0,Math.PI].forEach(a=>{ const b=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.012,0.08),dark); b.position.x=Math.cos(a)*0.0; b.rotation.y=a; b.rotation.x=0.15; pr.add(b); }); props.push(pr);
    mg.userData.home=mg.position.clone(); mg.userData.out=new THREE.Vector3(sx*1.35,0.35,sz*1.35); });
  // airflow: downward streaks under each prop
  const NA=160, ap=new Float32Array(NA*6); const ag=new THREE.BufferGeometry(); ag.setAttribute('position',new THREE.BufferAttribute(ap,3));
  const am=new THREE.LineBasicMaterial({color:0x6fb6ff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}); D.add(new THREE.LineSegments(ag,am));
  const sh=shadowPlane(4,4,.55); sh.position.y=-1.3; sc.add(sh);
  SCN[1]=function(lt){ const asm=easeIO(cl((lt-0.1)/0.8));
    D.children.forEach(o=>{ if(o.userData.home){ o.position.lerpVectors(o.userData.out,o.userData.home,asm); } });
    batG.position.set(0,0.12+0.55*(1-asm),0); chipG.position.set(0,0.02-0.45*(1-asm),0);
    const spin=cl((lt-0.9)/0.4); const tilt=easeIO(cl((lt-1.7)/0.5));
    props.forEach((p,i)=>{ const fast=(i===2||i===3)?1+tilt*0.8:1; p.rotation.y=(i%2?-1:1)*lt*lt*14*spin*fast; motors[i].material.emissiveIntensity=(i===2||i===3)?tilt*2.5:0; });
    ch.material.emissiveIntensity=spin*2;
    am.opacity=0.7*spin;
    for(let i=0;i<NA;i++){ const c=corners[i%4]; const s=((i*0.618)%1); const u=((lt*1.8+s)%1); const r=0.28*Math.sqrt(((i*0.381)%1)); const a=i*2.4;
      const x=c[0]*0.78+Math.cos(a)*r, z=c[1]*0.78+Math.sin(a)*r, y=0.0-u*0.9*(1+((i%4>1)?tilt*0.6:0));
      ap.set([x,y,z,x,y-0.12,z],i*6); } ag.attributes.position.needsUpdate=true;
    D.rotation.set(tilt*0.32,-0.6+0.4*easeIO(cl(lt/3.2)),0); D.position.set(0,0.15+0.06*Math.sin(lt*2)+0.3*spin,-tilt*0.5); D.scale.setScalar(0.72);
    cam.position.set(0,1.4,6.4-0.6*ease(lt/3.2)); cam.lookAt(0,0.2,0); P.c.render();
    layoutLabels([['l1_0',motors[0]],['l1_1',batG],['l1_2',chipG]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-0.9-i*0.2)/0.2)]),cam,720,130);
    caption(1,lt); };
})();

// ---------- S2 /how-its-made a microchip
(function(){ const ren=mkRenderer2('cv2'), sc=new THREE.Scene(); sc.environment=hdrEnv(ren); bgGrad(sc,'#1b1730','#040307');
  const cam=new THREE.PerspectiveCamera(30,1080/1920,0.1,100);
  const P=mkComposer(ren,sc,cam,{bloom:0.55,radius:0.5,th:0.88});
  const W=new THREE.Group(); sc.add(W);
  const pat=document.createElement('canvas'); pat.width=1024; pat.height=1024; const pg=pat.getContext('2d'); const patT=new THREE.CanvasTexture(pat); patT.encoding=THREE.sRGBEncoding;
  function drawWafer(rev){ pg.fillStyle='#8f96a3'; pg.fillRect(0,0,1024,1024); const n=13, s=1024/n;
    for(let i=0;i<n;i++) for(let j=0;j<n;j++){ const cx=(i+0.5)*s-512, cy=(j+0.5)*s-512; if(Math.hypot(cx,cy)>470) continue; const on=((i+j*n)/(n*n))<rev;
      pg.fillStyle=on?'#2c2f6e':'#a4abb7'; pg.fillRect(i*s+3,j*s+3,s-6,s-6);
      if(on){ pg.strokeStyle='rgba(120,220,255,.75)'; pg.lineWidth=2; for(let k=0;k<5;k++){ pg.beginPath(); pg.moveTo(i*s+8,j*s+10+k*14); pg.lineTo(i*s+s-8,j*s+10+k*14); pg.stroke(); } pg.fillStyle='#d4a64a'; pg.fillRect(i*s+s/2-8,j*s+s/2-8,16,16); } }
    patT.needsUpdate=true; }
  const wafer=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,0.04,128),[new THREE.MeshPhysicalMaterial({color:0x9aa1ad,metalness:1,roughness:.2}),new THREE.MeshPhysicalMaterial({map:patT,metalness:.7,roughness:.25,iridescence:1,iridescenceIOR:1.6,envMapIntensity:.45}),new THREE.MeshPhysicalMaterial({color:0x9aa1ad,metalness:1,roughness:.2})]);
  W.add(wafer);
  // UV beam (cone) + mask
  const beam=new THREE.Mesh(new THREE.ConeGeometry(0.55,2.6,48,1,true),new THREE.MeshBasicMaterial({color:0x8b5cff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
  beam.position.y=1.35; sc.add(beam);
  const mask=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.02,1.2),new THREE.MeshPhysicalMaterial({color:0x222,metalness:.2,roughness:.1,transmission:.6,thickness:.1})); mask.position.y=1.9; sc.add(mask);
  const spot=new THREE.Mesh(new THREE.CircleGeometry(0.5,48),new THREE.MeshBasicMaterial({color:0xb08cff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,toneMapped:false})); spot.rotation.x=-Math.PI/2; spot.position.y=0.03; W.add(spot);
  // the one chip that lifts out
  const chipG=new THREE.Group(); sc.add(chipG);
  const die=new THREE.Mesh(rbox(0.5,0.5,0.06,0.03),new THREE.MeshPhysicalMaterial({color:0x2c2f6e,metalness:.8,roughness:.2,iridescence:1,emissive:0x4aa8ff,emissiveIntensity:0})); die.rotation.x=-Math.PI/2; chipG.add(die);
  for(let i=0;i<16;i++){ const s=i%4, k=Math.floor(i/4); const pin=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.02,0.1),new THREE.MeshStandardMaterial({color:0xd4a64a,metalness:1,roughness:.3}));
    const off=-0.18+k*0.12; if(s===0) pin.position.set(off,-0.02,0.3); if(s===1) pin.position.set(off,-0.02,-0.3); if(s===2){ pin.position.set(0.3,-0.02,off); pin.rotation.y=Math.PI/2; } if(s===3){ pin.position.set(-0.3,-0.02,off); pin.rotation.y=Math.PI/2; } chipG.add(pin); }
  const uvA=new THREE.Object3D(); uvA.position.set(0.45,0.85,0); sc.add(uvA);
  SCN[2]=function(lt){ const sweep=cl((lt-0.35)/1.3); drawWafer(sweep);
    const bOn=cl((lt-0.3)/0.15)*(1-cl((lt-1.7)/0.2)); beam.material.opacity=0.16*bOn; spot.material.opacity=0.32*bOn; mask.visible=bOn>0.02; mask.material.opacity=bOn;
    const ang=sweep*Math.PI*6; spot.position.set(Math.cos(ang)*0.9*sweep,0.03,Math.sin(ang)*0.9*sweep); beam.position.x=spot.position.x; beam.position.z=spot.position.z; mask.position.x=spot.position.x; mask.position.z=spot.position.z;
    W.rotation.set(0.15,lt*0.25,0);
    const lift=easeIO(cl((lt-1.9)/0.8)); chipG.visible=lt>1.85; chipG.position.set(0.2,0.05+lift*0.75,0.25); chipG.scale.setScalar(0.3+lift*0.75); chipG.rotation.set(lift*0.5,lt*0.6,0); die.material.emissiveIntensity=lift*1.6;
    W.position.y=-0.3-lift*0.3; W.scale.setScalar(0.48);
    cam.position.set(0,2.9,5.4-0.5*ease(lt/3.2)); cam.lookAt(0,0.25,0); P.c.render();
    layoutLabels([['l2_0',wafer],['l2_1',uvA],['l2_2',chipG]].map(([id,o],i)=>[document.getElementById(id),o,cl((lt-[0.4,0.6,2.2][i])/0.2)*(i==1?bOn:1)]),cam,720,130);
    caption(2,lt); };
})();
