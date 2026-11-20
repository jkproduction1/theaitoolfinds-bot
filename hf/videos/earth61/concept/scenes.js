// earth61 scenes (Claude, drawn in code). Units = metres in S0, earth39 wave units in S1, kilometres in S2.
const ov=document.getElementById('ov');

// ---------- S0 /what-if Earth lost gravity for 5 seconds. Real physics, honest scale: with gravity gone, loose things keep moving in a
// straight line while the ground curves away under them (Earth's spin). At the equator that is ω²R ≈ 0.034 m/s², so in 5 s they rise
// ½·0.034·5² ≈ 0.42 m ("about 40 cm"). Then gravity returns and everything drops (0.3 s fall). Café table at golden hour, our own design.
if(S==0){ (function(){
  ov.innerHTML='<div class="big" id="big"><b id="bigt">Gravity off</b><i id="bign">5.0 s</i></div>'+
    L('l0_0','Loose things drift up',"Earth's spin keeps them moving")+L('l0_1','≈ 40 cm in 5 seconds','at the equator')+L('l0_2','Gravity back','everything drops');
  const ren=mkRenderer2('cv'); ren.toneMappingExposure=0.72; ren.shadowMap.enabled=true; ren.shadowMap.type=THREE.PCFSoftShadowMap;
  const sc=new THREE.Scene(); sc.environment=hdrEnv(ren);
  const cam=new THREE.PerspectiveCamera(38,1080/1920,0.01,50);
  const BG={uT:{value:0},uY:{value:0}};
  fullQuad(sc,`uniform float uT,uY; void main(){ vec2 uv=gl_FragCoord.xy/vec2(1080.,1920.); uv.y+=uY;
     vec3 top=vec3(0.16,0.22,0.30), mid=vec3(0.78,0.50,0.32), low=vec3(0.20,0.14,0.11);
     vec3 c=mix(low,mid,smoothstep(0.25,0.62,uv.y)); c=mix(c,top,smoothstep(0.62,1.0,uv.y));
     // blurred facades: soft vertical bands
     float fb=smoothstep(0.35,0.65,vn(vec2(uv.x*5.,0.5)))*smoothstep(0.98,0.55,uv.y)*smoothstep(0.3,0.5,uv.y); c=mix(c,c*0.55+vec3(0.05,0.03,0.03),fb*0.6);
     // bokeh
     for(int L=0;L<2;L++){ float sc=L==0?7.:12.; vec2 g=vec2(uv.x*sc*0.5625*1.6,uv.y*sc); vec2 id=floor(g), f=fract(g)-.5; vec2 o=h22(id+float(L)*7.)-.5;
       float r=0.18+0.22*h21(id+3.); float d=length(f-o*0.5); float on=step(0.55,h21(id+11.))*smoothstep(0.3,0.7,uv.y)*smoothstep(0.95,0.7,uv.y);
       vec3 bc=mix(vec3(1.,0.72,0.4),vec3(1.,0.9,0.7),h21(id+5.)); c+=bc*on*smoothstep(r,r-0.06,d)*(L==0?0.22:0.14)*(0.85+0.15*sin(uT*0.7+h21(id)*6.)); }
     c*=1.0-0.35*length(uv-vec2(.5,.55));
     gl_FragColor=vec4(pow(c,vec3(1.0)),1.); }`,BG);
  const sun=new THREE.DirectionalLight(0xffc890,1.9); sun.position.set(-1.2,1.6,0.6); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  const sca=sun.shadow.camera; sca.left=-0.6; sca.right=0.6; sca.top=0.6; sca.bottom=-0.6; sca.near=0.1; sca.far=5; sun.shadow.radius=6; sun.shadow.bias=-0.0004; sc.add(sun);
  sc.add(new THREE.HemisphereLight(0x9fb6d8,0x3a2a20,0.35));
  // marble café table
  const marble=canvasTex(1024,1024,(g,w,h)=>{ g.fillStyle='#cfc9c1'; g.fillRect(0,0,w,h); const r=rnd(4);
    for(let k=0;k<26;k++){ g.beginPath(); let x=r()*w, y=r()*h; g.moveTo(x,y); for(let s=0;s<40;s++){ x+=(r()-.3)*40; y+=(r()-.5)*40; g.lineTo(x,y); }
      g.strokeStyle='rgba(120,115,110,'+(0.05+r()*0.12)+')'; g.lineWidth=0.6+r()*2.4; g.stroke(); }
    const id=g.getImageData(0,0,w,h); for(let i=0;i<id.data.length;i+=4){ const n=(r()-.5)*8; id.data[i]+=n; id.data[i+1]+=n; id.data[i+2]+=n; } g.putImageData(id,0,0); });
  const top=new THREE.Mesh(new THREE.CylinderGeometry(0.40,0.40,0.03,96),new THREE.MeshStandardMaterial({map:marble,roughness:0.5,envMapIntensity:0.2,color:0x8f8880}));
  top.position.y=-0.015; top.receiveShadow=true; sc.add(top);
  const edge=new THREE.Mesh(new THREE.TorusGeometry(0.40,0.006,10,120),new THREE.MeshStandardMaterial({color:0x2a2420,metalness:0.8,roughness:0.35})); edge.rotation.x=Math.PI/2; edge.position.y=-0.016; sc.add(edge);
  // ceramic
  const cer=new THREE.MeshPhysicalMaterial({color:0xf3efe8,roughness:0.16,clearcoat:1,clearcoatRoughness:0.08});
  const lathe=(pts,seg)=>{ const g=new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||96); g.computeVertexNormals(); return g; };
  const cupG=new THREE.Group();
  const cup=new THREE.Mesh(lathe([[0,0],[0.026,0],[0.03,0.004],[0.036,0.03],[0.041,0.068],[0.0425,0.075],[0.0405,0.0765],[0.0385,0.072],[0.034,0.034],[0.028,0.010],[0,0.010]]),cer);
  cup.castShadow=true; cup.receiveShadow=true; cupG.add(cup);
  const hd=new THREE.Mesh(new THREE.TorusGeometry(0.019,0.0055,14,40,Math.PI*1.25),cer); hd.position.set(0.045,0.040,0); hd.rotation.z=-Math.PI*0.62; hd.castShadow=true; cupG.add(hd);
  const coffeeM=new THREE.MeshPhysicalMaterial({color:0x120602,roughness:0.12,clearcoat:0.6,clearcoatRoughness:0.05,envMapIntensity:0.5});
  const surf=new THREE.Mesh(new THREE.CircleGeometry(0.0378,64),coffeeM); surf.rotation.x=-Math.PI/2; surf.position.y=0.064; cupG.add(surf);
  const crema=new THREE.Mesh(new THREE.RingGeometry(0.030,0.0378,64),new THREE.MeshPhysicalMaterial({color:0x9a5a2a,roughness:0.35,transparent:true,opacity:0.8}));
  crema.rotation.x=-Math.PI/2; crema.position.y=0.0642; cupG.add(crema);
  const sau=new THREE.Mesh(lathe([[0,0],[0.045,0],[0.05,0.003],[0.074,0.010],[0.078,0.0135],[0.075,0.0145],[0.05,0.008],[0.045,0.0065],[0,0.0065]]),cer); sau.castShadow=true; sau.receiveShadow=true;
  const steel=new THREE.MeshStandardMaterial({color:0xd8d8dc,metalness:1,roughness:0.18});
  const spoon=new THREE.Group(); const bowl=new THREE.Mesh(new THREE.SphereGeometry(0.011,24,16),steel); bowl.scale.set(1.5,0.28,1); spoon.add(bowl);
  const sh=new THREE.Mesh(new THREE.BoxGeometry(0.075,0.0018,0.006),steel); sh.position.x=0.052; spoon.add(sh); spoon.traverse(o=>o.castShadow=true);
  const sugar=[0,1].map(i=>{ const m=new THREE.Mesh(rbox(0.016,0.016,0.016,0.003,3),new THREE.MeshStandardMaterial({color:0xfbfaf6,roughness:0.95})); m.castShadow=true; sc.add(m); return m; });
  const leafT=canvasTex(256,256,(g,w,h)=>{ g.translate(128,128); g.rotate(-0.5); const grd=g.createLinearGradient(-90,0,90,0); grd.addColorStop(0,'#8a3a12'); grd.addColorStop(0.5,'#d0661c'); grd.addColorStop(1,'#e6a038');
    g.fillStyle=grd; g.beginPath(); g.moveTo(-100,0); g.bezierCurveTo(-40,-70,60,-60,100,0); g.bezierCurveTo(60,60,-40,70,-100,0); g.fill();
    g.strokeStyle='rgba(90,40,10,.6)'; g.lineWidth=3; g.beginPath(); g.moveTo(-110,0); g.lineTo(100,0); g.stroke(); for(let i=-3;i<=3;i++){ if(!i) continue; g.beginPath(); g.moveTo(i*22,0); g.lineTo(i*22+30,i>0?-34:34); g.stroke(); g.beginPath(); g.moveTo(i*22,0); g.lineTo(i*22+30,i>0?34:-34); g.stroke(); } });
  const leaves=[0,1,2].map(i=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(0.075,0.075),new THREE.MeshStandardMaterial({map:leafT,transparent:true,alphaTest:0.4,side:THREE.DoubleSide,roughness:0.8}));
    m.castShadow=true; sc.add(m); return m; });
  // free coffee blob (CPU-wobbled sphere)
  const bg=new THREE.SphereGeometry(0.0384,72,48); const B0=bg.attributes.position.array.slice(); const blob=new THREE.Mesh(bg,coffeeM); blob.castShadow=true; sc.add(blob);
  const pud=new THREE.Mesh(new THREE.CircleGeometry(1,64),coffeeM); pud.rotation.x=-Math.PI/2; sc.add(pud);
  const drops=[]; const DR=rnd(77); for(let i=0;i<26;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(0.0035+DR()*0.004,12,8),coffeeM); sc.add(m); drops.push([m,DR()*Math.PI*2,0.25+DR()*0.6,0.4+DR()*0.9]); }
  sc.add(cupG); sc.add(sau); sc.add(spoon);
  // ---- physics: everything loose gets a = 0.0339 m/s² upward (relative to the table) for 5 s, then falls back with g
  const A=0.0339, G=9.81, T0=0.45, T1=5.45;
  // [x0,y0,z0, v0y, vx, vz, spin axis, spin rate]
  const OB={ sau:[0,0,0,0.006,0,0], cup:[0,0.0065,0,0.014,0.004,-0.002], coffee:[0,0.0065+0.035,0,0.024,0.026,0.008], spoon:[0.035,0.012,0.055,0.022,-0.006,0.01],
    s0:[-0.13,0.008,-0.07,0.017,-0.004,0.006], s1:[-0.10,0.008,-0.10,0.012,0.002,0.009], l0:[0.16,0.001,-0.06,0.02,0.01,-0.01], l1:[-0.2,0.001,-0.12,0.028,-0.01,0.004], l2:[0.12,0.001,0.16,0.024,0.012,0.01] };
  function yOf(o,t){ const [x0,y0,z0,v0,vx,vz]=o; if(t<T0) return {x:x0,y:y0,z:z0,up:0,land:0};
    const tt=Math.min(t,T1)-T0, y1=y0+v0*tt+0.5*A*tt*tt, dl=(o===OB.coffee?1.7:0), xx=x0+vx*Math.max(0,tt-dl), zz=z0+vz*Math.max(0,tt-dl); if(t<=T1) return {x:xx,y:y1,z:zz,up:y1-y0,land:0};
    const vv=v0+A*(T1-T0), f=t-T1, tl=(vv+Math.sqrt(vv*vv+2*G*(y1-y0)))/G; // time to land back at y0
    if(f<tl) return {x:xx,y:y1+vv*f-0.5*G*f*f,z:zz,up:y1+vv*f-0.5*G*f*f-y0,land:0};
    const b=f-tl, bh=0.012*Math.exp(-b*9)*Math.abs(Math.sin(b*22)); return {x:xx,y:y0+bh*(o===OB.coffee?0:1),z:zz,up:0,land:b}; }
  const wob=(m,t,amp)=>{ const p=m.geometry.attributes.position; for(let i=0;i<p.count;i++){ const x=B0[i*3],y=B0[i*3+1],z=B0[i*3+2];
      const th=Math.atan2(z,x), ph=Math.acos(Math.max(-1,Math.min(1,y/0.0384))); const k=1+amp*(0.07*Math.sin(3*th+t*4.2)*Math.sin(ph*2+t*2.1)+0.05*Math.sin(2*ph+t*5.3)+0.03*Math.sin(5*th-t*6.1));
      p.setXYZ(i,x*k,y*k,z*k); } p.needsUpdate=true; m.geometry.computeVertexNormals(); };
  const V3=new THREE.Vector3();
  SCN[0]=function(t){ BG.uT.value=t;
    const pc=yOf(OB.cup,t), ps=yOf(OB.sau,t), pk=yOf(OB.coffee,t), pp=yOf(OB.spoon,t);
    const air=cl((t-T0)/0.6)*(1-cl((t-T1)/0.2));
    sau.position.set(ps.x,ps.y,ps.z); sau.rotation.set(0.25*air*Math.sin(t*0.5)*0.4,0,0.08*air*Math.sin(t*0.4));
    cupG.position.set(pc.x,pc.y,pc.z); const ca=air*cl((pk.y-pc.y-0.11)/0.04); cupG.rotation.set(0.10*ca*Math.sin(t*0.6),0,-0.12*ca*Math.sin(t*0.5));
    // coffee: inside the cup until it leaves through the rim
    const out=pk.y-pc.y-0.035; const inCup=t<T0+0.25;
    surf.visible=crema.visible=inCup; blob.visible=!inCup && pk.land<0.0001;
    if(blob.visible){ const e=cl((pk.y-pc.y-0.10)/0.05); blob.position.set(pk.x,pk.y,pk.z); blob.scale.set(lerp(0.68,1,e),lerp(0.75,1,e),lerp(0.68,1,e));
      wob(blob,t,t>T1?2.4:(0.12+0.9*e)*(0.6+0.6*Math.exp(-(t-T0)*0.8))); }
    // landing splash
    pud.visible=pk.land>0; if(pud.visible){ const s=0.03+0.075*easeO5(pk.land/0.25); pud.scale.set(s,s*0.85,1); pud.position.set(pk.x+0.01,0.0012,pk.z); }
    drops.forEach(([m,ang,sp,up])=>{ const b=pk.land; m.visible=b>0&&b<0.5; if(!m.visible) return; m.position.set(pk.x+Math.cos(ang)*sp*b*1.1,0.002+up*0.6*b-4.9*b*b*0.35,pk.z+Math.sin(ang)*sp*b*1.1); m.scale.setScalar(0.6);
      if(m.position.y<0.002) m.position.y=0.002; });
    spoon.position.set(pp.x,pp.y,pp.z); spoon.rotation.set(0.4*air*Math.sin(t*0.9),0.6+(t>T0?Math.min(t,T1+0.3)-T0:0)*0.25,0.5*air*Math.sin(t*0.7));
    ['s0','s1'].forEach((k,i)=>{ const p=yOf(OB[k],t); sugar[i].position.set(p.x,p.y+0.008,p.z); const r=t>T0?Math.min(t,T1+0.3)-T0:0; sugar[i].rotation.set(r*(0.35+i*0.2),r*0.5,r*(0.25-i*0.4)); });
    ['l0','l1','l2'].forEach((k,i)=>{ const p=yOf(OB[k],t); leaves[i].position.set(p.x,p.y+0.002,p.z); const r=t>T0?Math.min(t,T1+0.3)-T0:0;
      leaves[i].rotation.set(-Math.PI/2+0.5*air*Math.sin(r*0.9+i),i*1.7+r*0.2,0.4*air*Math.sin(r*0.7+i*2)); });
    // camera: close on the cup, rises with the floating things, settles when they drop
    const u=easeIO(cl((t-0.2)/5.6)); const cy=0.07+0.26*easeIO(cl((t-0.6)/4.8))-0.22*easeIO(cl((t-T1+0.05)/0.75));
    const pb=easeIO(cl((t-3.6)/1.8))*(1-easeIO(cl((t-T1-0.1)/0.7))); cam.position.set(lerp(0.10,0.16,u),cy+lerp(0.10,0.22,u)+0.06*pb,lerp(0.36,0.72,u)+0.42*pb); cam.lookAt(0.0,cy+0.02+0.10*pb,0); BG.uY.value=-(cy-0.07)*0.25;
    ren.render(sc,cam);
    // UI
    const big=document.getElementById('big'); big.style.opacity=cl((t-T0+0.15)/0.3); const left=Math.max(0,5-Math.max(0,t-T0));
    document.getElementById('bign').textContent=left.toFixed(1)+' s'; document.getElementById('bigt').textContent=t<T1?'Gravity off':'Gravity back';
    document.getElementById('bign').style.opacity=t<T1+0.3?1:1-cl((t-T1-0.3)/0.3);
    const pr=p=>{ V3.set(p.x,p.y,p.z).project(cam); return [(V3.x*.5+.5)*1080,(-V3.y*.5+.5)*1920]; };
    const a0=win(t,2.3,T1-0.1,0.3); const c0=pr({x:pc.x+0.042,y:pc.y+0.05,z:pc.z}); lab('l0_0',560,520,c0[0],c0[1],a0);
    const a1=win(t,3.0,T1-0.1,0.3); const k1=pr({x:pk.x-0.03,y:pk.y,z:pk.z}); lab('l0_1',80,Math.max(560,Math.min(1100,k1[1]-20)),k1[0]-40,k1[1],a1);
    const a2=win(t,T1+0.35,99,0.3); lab('l0_2',90,1180,-1,0,a2);
  };
})(); }

// ---------- S1 /simulate a mega tsunami hitting a coastline (our own generic beach town at dusk; wave engine from earth39 S1).
// Real behaviour shown (NOAA): the sea often pulls back first and exposes the sea floor; in deep water a tsunami travels as fast as a jet
// (500+ mph / 800+ km/h); it comes as a series of waves that can last for hours. Wave height is hypothetical ("mega"), no number claimed.
if(S==1){ (function(){
  ov.innerHTML=L('l1_0','The sea pulls back first','a real warning sign')+L('l1_1','Then the wave hits','a wall of water')+L('l1_2','In deep water: jet speed','500+ mph · 800+ km/h');
  const ren=mkRenderer2('cv'), sc=new THREE.Scene(); ren.toneMappingExposure=1.0;
  sc.background=canvasTex(16,512,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#0b1430'); g.addColorStop(0.32,'#2c3560'); g.addColorStop(0.52,'#8a5a62'); g.addColorStop(0.61,'#f09a60'); g.addColorStop(0.66,'#4a3440'); g.addColorStop(1,'#0c1018'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  const cam=new THREE.PerspectiveCamera(50,1080/1920,0.1,400); const P=mkComposer(ren,sc,cam,{bloom:0.42,radius:0.5,th:0.88});
  const WU={uT:{value:0},uF:{value:60},uH:{value:1},uL:{value:0}};
  const WH=`uniform float uT,uF,uH,uL; float wh(vec2 p){ float dz=p.y-uF; float s=0.07*sin(p.x*1.3+uT*1.6)+0.06*sin(p.x*0.7-p.y*1.1+uT*1.2)+0.05*sin(p.y*2.1+uT*2.0);
    float hx=uH*(1.+0.12*sin(p.x*0.21+1.3)); float crest=hx*(dz<0.?exp(-dz*dz/2.6):exp(-dz*dz/40.)); float trough=-0.3*uH*exp(-pow((dz+5.5)/2.5,2.));
    float draw=-uL*(1.-smoothstep(-6.,-1.,dz)); float plat=0.4*uH*smoothstep(0.,6.,dz)*step(2.,uH);
    return s*(1.-0.6*smoothstep(-2.,-12.,p.y))+crest+trough+draw+plat; }`;
  const wg=new THREE.PlaneGeometry(160,110,400,330); wg.rotateX(-Math.PI/2); wg.translate(0,0,40);
  const WFS=`varying vec3 vW; varying vec3 vNn; varying float vFo; varying float vSl; uniform float uT;
    void main(){ vec3 N=normalize(vNn+vec3(fbm(vW.xz*1.5+vW.y*0.8+uT)-.5,0.,fbm(vW.zx*1.5-vW.y*0.8-uT)-.5)*0.07); vec3 V=normalize(cameraPosition-vW); float fr=0.03+0.97*pow(1.-max(dot(N,V),0.),5.);
      vec3 R=reflect(-V,N); float sky=clamp(R.y,0.,1.); vec3 skyC=mix(vec3(0.95,0.58,0.38),vec3(0.17,0.20,0.36),smoothstep(0.,0.45,sky));
      vec3 deep=vec3(0.012,0.045,0.06); vec3 col=mix(deep,skyC*0.6,fr);
      col+=vec3(0.02,0.13,0.11)*vSl*max(dot(N,V),0.);
      vec3 S=normalize(vec3(0.,0.10,1.)); col+=vec3(1.,0.68,0.42)*pow(max(dot(R,S),0.),160.)*1.4;
      float n=fbm(vec2(vW.x*1.4,vW.y*1.6+vW.z*1.2)+vec2(0.,-uT*1.5)); float foam=vFo*smoothstep(0.35,0.7,n+vFo*0.3); col=mix(col,vec3(0.74,0.74,0.76),clamp(foam,0.,0.92));
      gl_FragColor=vec4(col,1.); }`;
  const water=new THREE.Mesh(wg,new THREE.ShaderMaterial({uniforms:WU,toneMapped:false,
    vertexShader:GLN+WH+`varying vec3 vW; varying vec3 vNn; varying float vFo; varying float vSl; void main(){ vec3 p=position; float h=wh(p.xz); float e=0.08; float dz=p.z-uF;
      vec3 N=normalize(vec3(-(wh(p.xz+vec2(e,0.))-h)/e,1.,-(wh(p.xz+vec2(0.,e))-h)/e)); vNn=N; vSl=clamp(-N.z*1.5,0.,1.)*step(0.5,uH)*smoothstep(0.,0.6*uH,h);
      vFo=smoothstep(0.75*uH,0.98*uH,h)*step(2.,uH)+0.3*smoothstep(1.,4.,dz)*smoothstep(12.,5.,dz)*step(2.,uH)+0.5*smoothstep(0.25,0.0,abs(h-(-0.85*(p.z+8.)*0.11)))*step(p.z,6.);
      p.y=h; vec4 w=modelMatrix*vec4(p,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,fragmentShader:GLN+WFS}));
  sc.add(water);
  // beach: slopes into the sea (rest shoreline at z=-8); wet sand darker below the old waterline
  const sg=new THREE.PlaneGeometry(160,60,320,160); sg.rotateX(-Math.PI/2); sg.translate(0,0,-22);
  { const p=sg.attributes.position; const n=vnoise(12); for(let i=0;i<p.count;i++){ const x=p.getX(i), z=p.getZ(i); const zs=-8+Math.max(0,-(x+2))*1.1; let y=-(z-zs)*0.085; if(y>1.4) y=1.4+(y-1.4)*0.15; if(z<-16) y+=0.25*fbm(n,x*0.08,z*0.08,3)*smooth(-16,-24,z); p.setY(i,y+0.04*fbm(n,x*0.6,z*0.6,2)); } sg.computeVertexNormals(); }
  const sand=new THREE.Mesh(sg,new THREE.ShaderMaterial({toneMapped:false,
    vertexShader:'varying vec3 vW; varying vec3 vN; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vN=normal; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader:GLN+`varying vec3 vW; varying vec3 vN; void main(){ float g=fbm(vW.xz*3.); vec3 dry=vec3(0.30,0.24,0.18)*(0.85+0.3*g); vec3 wet=vec3(0.075,0.065,0.06)*(0.8+0.4*g);
      float w=smoothstep(0.12,-0.05,vW.y); vec3 c=mix(dry,wet,w); float rip=sin(vW.z*9.+fbm(vW.xz*0.7)*6.)*0.5+0.5; c*=1.-0.18*w*rip;
      c*=0.55+0.6*max(dot(normalize(vN),normalize(vec3(0.,0.35,1.))),0.); c+=vec3(0.35,0.18,0.10)*w*pow(max(0.,1.-abs(vW.x*0.02)),2.)*0.25;
      float sp=pow(max(dot(reflect(normalize(vW-cameraPosition),normalize(vN)),normalize(vec3(0.,0.12,1.))),0.),40.)*w; c+=vec3(1.,0.6,0.35)*sp*0.8;
      gl_FragColor=vec4(c*0.55,1.); }`}));
  sc.add(sand);
  // curling lip + spray (earth39)
  const NX=220, NA=26; const lg=new THREE.PlaneGeometry(1,1,NX-1,NA-1); const LP=lg.attributes.position;
  const LU={uT:{value:0}};
  const lip=new THREE.Mesh(lg,new THREE.ShaderMaterial({uniforms:LU,side:THREE.DoubleSide,toneMapped:false,transparent:true,
    vertexShader:'varying vec3 vW; varying vec3 vNn; varying float vFo; varying float vSl; varying float vA; attribute float aa; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vNn=normalize(mat3(modelMatrix)*normal); vFo=smoothstep(0.55,1.,aa)*0.9+0.15; vSl=1.-aa; vA=aa; gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader:GLN+WFS.replace('gl_FragColor=vec4(col,1.);','gl_FragColor=vec4(col,1.-smoothstep(0.93,1.,vA)*0.6);').replace('varying float vSl;','varying float vSl; varying float vA;')}));
  const AA=new Float32Array(NX*NA); lg.setAttribute('aa',new THREE.BufferAttribute(AA,1)); lip.frustumCulled=false; sc.add(lip);
  let curl=0;
  function updLip(lt){ const H=WU.uH.value, F=WU.uF.value; lip.visible=H>2.5;
    for(let j=0;j<NA;j++) for(let i=0;i<NX;i++){ const k=j*NX+i; const x=-80+160*i/(NX-1); const a=j/(NA-1); AA[k]=a;
      const hx=H*(1+0.12*Math.sin(x*0.21+1.3))+0.4*H*0; const r=0.22*hx*(0.75+0.25*Math.sin(x*0.13+lt*0.8)); const ang=a*(0.3+2.3*curl);
      const z=F-r*Math.sin(ang)*1.35, y=hx-r+r*Math.cos(ang)-0.05; LP.setXYZ(k,x,y,z); }
    LP.needsUpdate=true; lg.computeVertexNormals(); }
  const NS=1800, spr=cloudPoints(NS,softDot(),650,THREE.NormalBlending); sc.add(spr); const SR=rnd(9); const SD=[]; for(let i=0;i<NS;i++) SD.push([SR()*160-80,SR(),SR(),SR()]);
  function updSpray(lt){ const H=WU.uH.value, F=WU.uF.value, g=spr.geometry; const pa=g.attributes.position, ca=g.attributes.color, sa=g.attributes.sz, al=g.attributes.al;
    for(let i=0;i<NS;i++){ const [x,ph,v,s]=SD[i]; const life=((lt*0.55+ph)%1); const hx=H*(1+0.12*Math.sin(x*0.21+1.3));
      pa.setXYZ(i,x+Math.sin(ph*40)*0.6,hx*0.98+life*(0.8+1.6*v)-life*life*1.4,F-0.6-life*(1.5+2.5*s)); ca.setXYZ(i,0.8,0.8,0.82); sa.setX(i,0.6+2.4*s*life+0.4); al.setX(i,0.14*Math.sin(Math.PI*life)*cl((H-3)/3)); }
    pa.needsUpdate=ca.needsUpdate=sa.needsUpdate=al.needsUpdate=true; }
  // beach houses (our own generic design) + palms, left side
  const R=rnd(31);
  const hm=(c)=>new THREE.ShaderMaterial({toneMapped:false,uniforms:{uC:{value:new THREE.Color(c)}},
    vertexShader:'varying vec3 vW; varying vec3 vN; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader:GLN+`uniform vec3 uC; varying vec3 vW; varying vec3 vN; void main(){ vec3 N=normalize(vN); float l=0.25+0.75*max(dot(N,normalize(vec3(0.2,0.3,1.))),0.); vec3 c=uC*l*0.55;
      float fx=abs(N.x)>0.5?vW.z:vW.x; vec2 g=vec2(fx*0.9,vW.y*1.3); vec2 id=floor(g), f=fract(g); float win=smoothstep(0.2,0.3,f.x)*smoothstep(0.8,0.7,f.x)*smoothstep(0.25,0.35,f.y)*smoothstep(0.8,0.7,f.y)*step(0.5,1.-abs(N.y));
      c=mix(c,vec3(1.,0.74,0.45)*(0.5+0.4*h21(id)),win*step(0.45,h21(id+vec2(vW.x,vW.z)))*0.8); gl_FragColor=vec4(c,1.); }`});
  const COLS=[0xd9c6a8,0xb8c7c4,0xe2b8a0,0xc9cfd9,0xe0d2b0];
  for(let i=0;i<0;i++){ const x=-9+i*2.6+R()*0.6, z=-15.5+R()*3.5, w=1.9+R()*0.5, d=2.4+R()*1.2, h=2.2+R()*2.2; const zs=-8+Math.max(0,-(x+2))*1.1; let by=-(z-zs)*0.085; if(by>1.4) by=1.4+(by-1.4)*0.15; by-=0.1;
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),hm(COLS[i%5])); b.position.set(x,by+h/2,z); sc.add(b);
    const rs=new THREE.Shape(); rs.moveTo(-w/2-0.25,0); rs.lineTo(0,1.1+R()*0.5); rs.lineTo(w/2+0.25,0); rs.lineTo(-w/2-0.25,0);
    const rg=new THREE.ExtrudeGeometry(rs,{depth:d+0.4,bevelEnabled:false}); rg.translate(0,0,-(d+0.4)/2); const rf=new THREE.Mesh(rg,hm(0x5a3a30)); rf.position.set(x,by+h,z); sc.add(rf); }
  const trunkM=new THREE.MeshBasicMaterial({color:0x07080a}), frondM=new THREE.MeshBasicMaterial({color:0x040605,side:THREE.DoubleSide});
  const palms=[];
  for(const [x,z,h] of [[0.6,-13.5,7.5],[9.6,-11.5,6.2],[-4.5,-9.5,6.8]]){ R(); const zs=-8+Math.max(0,-(x+2))*1.1; let by=-(z-zs)*0.085; if(by>1.4) by=1.4+(by-1.4)*0.15; const lean=(R()-.5)*0.5;
    const path=new THREE.CatmullRomCurve3([new THREE.Vector3(x,by,z),new THREE.Vector3(x+lean*0.6,by+h*0.5,z),new THREE.Vector3(x+lean*1.6,by+h,z)]);
    sc.add(new THREE.Mesh(new THREE.TubeGeometry(path,12,0.16,8,false),trunkM)); const top=new THREE.Vector3(x+lean*1.6,by+h,z);
    const fr=new THREE.Group(); fr.position.copy(top); for(let k=0;k<9;k++){ const g=new THREE.PlaneGeometry(2.8,0.5,10,1); const p=g.attributes.position;
      for(let j=0;j<p.count;j++){ const u=(p.getX(j)+1.4)/2.8; p.setX(j,u*2.8); p.setY(j,p.getY(j)*(1-u*0.9)-u*u*1.3); } const m=new THREE.Mesh(g,frondM); m.rotation.set(0,k/9*Math.PI*2+R(),0.25); fr.add(m); }
    sc.add(fr); palms.push(fr); }
  const V3=new THREE.Vector3(); const pr=(x,y,z)=>{ V3.set(x,y,z).project(cam); return [(V3.x*.5+.5)*1080,(-V3.y*.5+.5)*1920]; };
  SCN[1]=function(lt){ WU.uT.value=lt; LU.uT.value=lt;
    WU.uL.value=2.6*easeIO(cl((lt-0.1)/2.4));
    const a=easeIO(cl((lt-1.4)/4.9)); WU.uF.value=lerp(75,9,a); WU.uH.value=lerp(1.2,9.0,easeIO(cl((lt-1.6)/4.0)));
    curl=easeIO(cl((lt-3.6)/2.6)); updLip(lt); updSpray(lt);
    palms.forEach((p,i)=>{ p.rotation.z=0.06*Math.sin(lt*1.3+i)+0.15*cl((lt-4.2)/2); });
    const u=easeIO(cl(lt/6.3)); cam.position.set(lerp(4,4.3,u),lerp(2.6,3.1,u),lerp(-22,-25,u)); cam.lookAt(lerp(1.5,1.0,u),lerp(-0.2,4.6,easeIO(cl((lt-1.6)/4.2))),20);
    P.c.render();
    let [x,y]=pr(4,-1.2,1.5); lab('l1_0',Math.max(70,x-470),Math.min(1120,y+230),x,y,win(lt,0.6,2.7,0.25));
    [x,y]=pr(1,WU.uH.value*1.0,WU.uF.value); lab('l1_1',90,Math.max(520,y-200),x,y,win(lt,3.5,99,0.3));
    lab('l1_2',90,1150,-1,0,win(lt,3.0,99,0.3));
  };
})(); }

// ---------- S2 /scale Mount Everest vs Olympus Mons. Heights to scale (km): Everest 8.849 km (8,849 m / 29,032 ft, China-Nepal survey 2020);
// Olympus Mons ≈ 21.9 km above the Mars datum (≈ 72,000 ft; NASA MOLA) → about 2.5× Everest. Widths squeezed (Olympus is really ~600 km wide).
// Terrain = our own procedural heightfields, no real DEM.
if(S==2){ (function(){
  ov.innerHTML=L('l2_0','Mount Everest','8,849 m · 29,032 ft')+L('l2_1','Olympus Mons','0.0 km')+L('l2_2','≈ 2.5× taller','biggest volcano we know')+L('l2_3','Heights to scale','widths squeezed')+
    L('l2_4','Earth','')+L('l2_5','Mars','');
  const ren=mkRenderer2('cv'); ren.toneMappingExposure=0.9; const sc=new THREE.Scene();
  sc.background=canvasTex(16,512,(c,w,h)=>{ const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#0d1426'); g.addColorStop(0.45,'#33405e'); g.addColorStop(0.66,'#b98a6c'); g.addColorStop(0.72,'#d9a27a'); g.addColorStop(1,'#2a1c16'); c.fillStyle=g; c.fillRect(0,0,w,h); });
  sc.fog=new THREE.Fog(0x8a7468,140,420);
  const cam=new THREE.PerspectiveCamera(40,1080/1920,0.05,1200); const P=mkComposer(ren,sc,cam,{bloom:0.35,radius:0.5,th:0.9});
  const sun=new THREE.DirectionalLight(0xffe2c4,2.4); sun.position.set(-40,30,30); sc.add(sun); sc.add(new THREE.HemisphereLight(0x8fa6c8,0x3a2418,0.55));
  const n1=vnoise(5), n2=vnoise(9);
  function rid(n,x,y,o){ let s=0,a=0.5,f=1; for(let i=0;i<o;i++){ const v=1-Math.abs(n(x*f,y*f)*2-1); s+=a*v*v; f*=2.1; a*=0.5; } return s; }
  function terrain(size,seg,cx,hf,colf){ const g=new THREE.PlaneGeometry(size,size,seg,seg); g.rotateX(-Math.PI/2); const p=g.attributes.position; const col=new Float32Array(p.count*3);
    let mx=0; const H=[]; for(let i=0;i<p.count;i++){ const h=hf(p.getX(i),p.getZ(i)); H.push(h); if(h>mx) mx=h; }
    for(let i=0;i<p.count;i++){ p.setY(i,H[i]); const c=colf(p.getX(i),p.getZ(i),H[i]); col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2]; }
    g.setAttribute('color',new THREE.BufferAttribute(col,3)); g.computeVertexNormals(); const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:0.95,metalness:0})); m.position.x=cx; return m; }
  // Everest: ridged pyramid, summit normalised to exactly 8.849
  const EX=-11, OX=13, OR=20;
  let ev=terrain(26,260,EX,(x,z)=>{ const r=Math.hypot(x,z), a=Math.atan2(z,x); const ridge=0.18*Math.pow(Math.abs(Math.cos(a*1.5+0.4)),3);
      const base=Math.pow(cl(1-r/(8.5*(1+ridge))),1.55); const det=rid(n1,x*0.5+20,z*0.5,5); return Math.max(0,base*(7.2+1.6*det)+0.25*rid(n2,x*1.6,z*1.6,3)*base-0.02); },
    (x,z,h)=>{ const sn=smooth(5.6,6.6,h+0.9*fbm(n2,x*0.9,z*0.9,3)); const rock=[0.055,0.05,0.045], snow=[0.62,0.66,0.74]; return rock.map((v,i)=>v+(snow[i]-v)*sn); });
  { const p=ev.geometry.attributes.position; let mx=0; for(let i=0;i<p.count;i++) mx=Math.max(mx,p.getY(i)); for(let i=0;i<p.count;i++) p.setY(i,p.getY(i)*8.849/mx); ev.geometry.computeVertexNormals(); }
  sc.add(ev);
  // Olympus Mons: broad shield, summit caldera, basal cliff (escarpment); rises from the plain (scale.y animated)
  let om=terrain(46,320,OX,(x,z)=>{ const r=Math.hypot(x,z)*(1+0.04*Math.sin(Math.atan2(z,x)*3)), R=OR; if(r>R+0.6) return 0;
      const cliff=smooth(R+0.5,R-0.3,r); let h=19.0*Math.pow(cl(1-r/R),0.8)+2.9*cliff; h-=2.6*smooth(3.2,2.2,r); h+=0.4*fbm(n1,x*0.6,z*0.6,4)*cliff; return Math.max(0,h*cliff); },
    (x,z,h)=>{ const f=fbm(n2,x*0.35+4,z*0.35,4); const lava=smooth(0.45,0.6,fbm(n1,x*0.5,z*0.5,3)); const c=[0.20+0.08*f,0.060+0.02*f,0.025]; return c.map((v,i)=>v*(1-0.35*lava)); });
  { const p=om.geometry.attributes.position; let mx=0; for(let i=0;i<p.count;i++) mx=Math.max(mx,p.getY(i)); for(let i=0;i<p.count;i++) p.setY(i,p.getY(i)*21.9/mx); om.geometry.computeVertexNormals(); }
  sc.add(om);
  // ground: Earth (left) blends into Mars (right)
  const gr=terrain(600,300,0,(x,z)=>0.15*fbm(n1,x*0.2,z*0.2,3)-0.05,(x,z,h)=>{ const m=smooth(-1,3,x+2*Math.sin(z*0.2)); const e=[0.035,0.035,0.028], ma=[0.16,0.05,0.02]; return e.map((v,i)=>v+(ma[i]-v)*m); });
  gr.position.y=-0.02; sc.add(gr);
  // height bars + dashed Everest line across Olympus
  const wm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.85,toneMapped:false,depthTest:false});
  const barE=new THREE.Mesh(new THREE.BoxGeometry(0.3,1,0.3),wm); barE.geometry.translate(0,0.5,0); barE.position.set(EX-9.8,0,0); barE.renderOrder=10; sc.add(barE);
  const barO=new THREE.Mesh(new THREE.BoxGeometry(0.3,1,0.3),wm.clone()); barO.geometry.translate(0,0.5,0); barO.position.set(OX+OR+1.2,0,0); barO.renderOrder=10; sc.add(barO);
  const dash=new THREE.Group(); for(let i=0;i<36;i++){ const d=new THREE.Mesh(new THREE.BoxGeometry(0.75,0.28,0.28),new THREE.MeshBasicMaterial({color:0xff6a3d,toneMapped:false,transparent:true,depthTest:false})); d.renderOrder=10; d.position.set(EX-9.8+i*1.2+0.3,8.849,0); dash.add(d); } sc.add(dash);
  const V3=new THREE.Vector3(); const pr=(x,y,z)=>{ V3.set(x,y,z).project(cam); return [(V3.x*.5+.5)*1080,(-V3.y*.5+.5)*1920]; };
  const nf=new Intl.NumberFormat('en-US');
  SCN[2]=function(lt){
    const rise=easeIO(cl((lt-1.5)/2.7)); om.scale.y=Math.max(0.001,rise); om.visible=rise>0.002;
    barE.scale.y=8.849*easeO(cl((lt-0.5)/0.8)); barE.visible=lt>0.5; barO.scale.y=21.9*rise; barO.visible=rise>0.01; barO.material.opacity=0.85*cl((lt-1.5)/0.3);
    dash.children.forEach((d,i)=>{ d.material.opacity=cl((lt-4.0-i*0.025)/0.2); });
    const u=easeIO(cl((lt-0.3)/4.3));
    cam.position.set(lerp(EX+3.2,6.5,u),lerp(9.2,13,u),lerp(7.5,128,u)); cam.lookAt(lerp(EX,6.5,u),lerp(8.3,22,u),0);
    P.c.render();
    let [x,y]=pr(EX,8.849,0); lab('l2_0',Math.max(70,x-430),y-150-60*u,x,y,win(lt,0.35,99,0.3));
    const km=21.9*rise; document.querySelector('#l2_1 span').textContent=rise<0.999?km.toFixed(1)+' km':'≈ 22 km · 72,000 ft';
    [x,y]=pr(OX,21.9*rise,0); lab('l2_1',Math.min(1010-430,x+20),y-170,x,y,win(lt,2.3,99,0.3));
    [x,y]=pr(OX+9,8.849,0); lab('l2_2',600,Math.min(1120,y+200),x,y,win(lt,4.3,99,0.3));
    lab('l2_3',90,520,-1,0,win(lt,4.6,99,0.3));
    [x,y]=pr(EX-4,0.3,6); lab('l2_4',x-60,y+40,-1,0,win(lt,3.2,99,0.3)*0); [x,y]=pr(OX+8,0.3,6); lab('l2_5',x,y+40,-1,0,win(lt,3.2,99,0.3)*0);
  };
})(); }
