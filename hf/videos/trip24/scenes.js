// ---------- trip24: viral "travel map" flight animation, drawn in code by Claude (Opus 5.5). Real coastlines and borders from Natural Earth
// (public domain) via world-atlas 2.0.2 (countries-50m TopoJSON), projected with d3-geo (orthographic globe). Route = the real great circle
// Prague (50.0755 N, 14.4378 E) -> Tokyo (35.6762 N, 139.6503 E); distance by haversine, R = 6371 km: 9,070 km. Own plane icon, no logos.
(function(){
  const cv=document.getElementById('cv0'), g=cv.getContext('2d');
  const CL=(x)=>x<0?0:x>1?1:x, E3=(x)=>1-Math.pow(1-CL(x),3), lerp=(a,b,u)=>a+(b-a)*u, sm=(a,b,x)=>{ x=CL((x-a)/(b-a)); return x*x*(3-2*x); };
  const bez=(()=>{ const x1=.72,y1=0,x2=.28,y2=1; const B=(a,b,t)=>3*a*t*(1-t)*(1-t)+3*b*t*t*(1-t)+t*t*t; return (x)=>{ x=CL(x); let lo=0,hi=1; for(let i=0;i<22;i++){ const m=(lo+hi)/2; if(B(x1,x2,m)<x) lo=m; else hi=m; } return B(y1,y2,(lo+hi)/2); }; })();
  const SP=(x)=>0.4*Math.log(1+Math.exp(x/0.4));
  function R0(s){ return function(){ s=(s*16807)%2147483647; return (s-1)/2147483646; }; }
  function off(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; }
  const SANS="Inter,'DejaVu Sans',Helvetica,Arial,sans-serif";
  const W=window.WORLD50, LANDS=topojson.feature(W,W.objects.countries).features, BORD=topojson.mesh(W,W.objects.countries,(a,b)=>a!==b);
  const LAND=topojson.merge(W,W.objects.countries.geometries);
  const CZ=LANDS.find(f=>f.id==='203'), JP=LANDS.find(f=>f.id==='392');
  const PRG=[14.4378,50.0755], TYO=[139.6503,35.6762], IP=d3.geoInterpolate(PRG,TYO), KM=9070;
  const proj=d3.geoOrthographic().clipAngle(90).precision(0.4), path=d3.geoPath(proj,g), grat=d3.geoGraticule10();
  // ---------- pre-rendered backdrop: deep space gradient + stars, grain
  const BG=off(1080,1920,(p)=>{ const gr=p.createRadialGradient(540,900,100,540,960,1300); gr.addColorStop(0,'#0f2238'); gr.addColorStop(1,'#03070d'); p.fillStyle=gr; p.fillRect(0,0,1080,1920);
    const R=R0(5); for(let i=0;i<520;i++){ const a=R()*R(); p.fillStyle='rgba(220,232,255,'+(0.15+a*0.75)+')'; const s=0.6+R()*R()*2.4; p.beginPath(); p.arc(R()*1080,R()*1920,s,0,7); p.fill(); } });
  const GRAIN=off(1080,1920,(p,w,h)=>{ const R=R0(77); for(let i=0;i<110000;i++){ p.fillStyle=R()<.5?'rgba(0,0,0,'+(R()*.09)+')':'rgba(255,255,255,'+(R()*.07)+')'; p.fillRect(R()*w,R()*h,1+R()*2,1+R()*2); } });
  const VIG=off(1080,1920,(p)=>{ const gr=p.createRadialGradient(540,960,420,540,960,1250); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(0,0,0,.62)'); p.fillStyle=gr; p.fillRect(0,0,1080,1920); });
  // ---------- camera: ONE continuous move with strong easy-ease. Close over Prague -> pull back to the whole globe -> descend on Tokyo.
  const T1=3.7, SC=4300, SF=560, SE=4700, CY=1060;
  function camAt(t){ const u=t/T1, rise=bez(u/0.52), fall=bez((u-0.46)/0.54), aft=SP(t-T1+0.3);
    const pp=CL(bez((u-0.1)/0.8)+0.0), ls=Math.log(SC)+(Math.log(SF)-Math.log(SC))*rise+(Math.log(SE)-Math.log(SF))*fall+0.05*aft;
    const lead=0.035*Math.sin(Math.PI*CL(pp)), cc=IP(CL(pp*0.985+0.0075+lead*0)) ;
    return {pp:pp, s:Math.exp(ls), c:cc, alt:(Math.log(SC)-ls)/(Math.log(SC)-Math.log(SF)), aft:aft, fall:fall}; }
  // heading: rotate the view so the flight always points up-right on screen (gamma follows the local bearing, smoothly)
  function bearing(a,b){ const f1=a[1]*Math.PI/180,f2=b[1]*Math.PI/180,dl=(b[0]-a[0])*Math.PI/180; return Math.atan2(Math.sin(dl)*Math.cos(f2),Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl))*180/Math.PI; }
  const TARGET=58; // degrees: 0 = straight up; positive = to the right
  function setProj(cam,drift){ const p=CL(cam.pp), a=IP(Math.max(0,p-0.004)), b=IP(Math.min(1,p+0.004)), br=bearing(a,b);
    proj.scale(cam.s).translate([540+drift[0],CY+drift[1]]).rotate([-cam.c[0],-cam.c[1],0]); }
  // plane: own simple top-down airliner silhouette (points along +x)
  function plane(c,x,y,ang,s){ c.save(); c.translate(x,y); c.rotate(ang); c.scale(s,s);
    c.fillStyle='rgba(0,0,0,.35)'; c.save(); c.translate(-10,16); c.filter='blur(5px)'; body(c); c.fill(); c.restore();
    const gr=c.createLinearGradient(0,-40,0,40); gr.addColorStop(0,'#ffffff'); gr.addColorStop(1,'#d9dee6'); c.fillStyle=gr; body(c); c.fill(); c.strokeStyle='rgba(20,30,45,.35)'; c.lineWidth=1.2; c.stroke(); c.restore(); }
  function body(c){ c.beginPath(); c.moveTo(46,0); c.bezierCurveTo(46,-5,40,-6.5,30,-6.5); c.lineTo(8,-6.5); c.lineTo(-10,-44); c.lineTo(-19,-44); c.lineTo(-8,-6.5); c.lineTo(-30,-6); c.lineTo(-38,-19); c.lineTo(-44,-19); c.lineTo(-40,-4);
    c.lineTo(-46,0); c.lineTo(-40,4); c.lineTo(-44,19); c.lineTo(-38,19); c.lineTo(-30,6); c.lineTo(-8,6.5); c.lineTo(-19,44); c.lineTo(-10,44); c.lineTo(8,6.5); c.lineTo(30,6.5); c.bezierCurveTo(40,6.5,46,5,46,0); c.closePath(); }
  const ARC={type:'LineString',coordinates:d3.range(0,1.0001,1/240).map(IP)};
  function arcTo(f){ const n=Math.max(2,Math.round(240*CL(f))); return {type:'LineString',coordinates:ARC.coordinates.slice(0,n+1)}; }
  function city(c,ll,name,al,lt,side){ if(al<=0.004) return; const p=proj(ll); if(!p) return; const vis=d3.geoDistance(ll,[-proj.rotate()[0],-proj.rotate()[1]])<Math.PI/2-0.02; if(!vis) return;
    c.save(); c.globalAlpha=al; for(let k=0;k<2;k++){ const pr=((lt*0.6+k*0.5)%1); c.globalAlpha=al*(1-pr)*0.7; c.strokeStyle='#ffd7c8'; c.lineWidth=3; c.beginPath(); c.arc(p[0],p[1],14+pr*58,0,7); c.stroke(); }
    c.globalAlpha=al; c.shadowColor='rgba(255,90,43,.9)'; c.shadowBlur=26; c.fillStyle='#ff5a2b'; c.beginPath(); c.arc(p[0],p[1],15,0,7); c.fill(); c.shadowBlur=0; c.fillStyle='#fff'; c.beginPath(); c.arc(p[0],p[1],6.5,0,7); c.fill();
    c.font='800 56px '+SANS; c.textBaseline='middle'; const tw=c.measureText(name).width, lx0=side>0?p[0]+40:p[0]-118-tw-44, lx=Math.max(24,lx0), ly=p[1]-4;
    c.fillStyle='rgba(6,14,24,.62)'; c.beginPath(); c.roundRect(lx,ly-40,tw+44,80,40); c.fill(); c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=1.5; c.stroke();
    c.fillStyle='#fff'; c.fillText(name,lx+22,ly+2); c.restore(); }
  const odo=(v)=>Math.round(v).toLocaleString('en-US');
  SCN[0]=function(lt){ g.setTransform(1,0,0,1,0,0); g.globalAlpha=1; g.clearRect(0,0,1080,1920);
    const cam=camAt(lt), dr=[10*Math.sin(lt*0.7), 14*Math.sin(lt*0.55+1)-170*cam.fall];
    g.drawImage(BG,-30+dr[0]*0.3-lt*4,-30+dr[1]*0.3,1140,1980);
    setProj(cam,dr); const r=proj.scale(), cx=540+dr[0], cy=CY+dr[1];
    // atmosphere glow
    if(r<3000){ const gr=g.createRadialGradient(cx,cy,r*0.96,cx,cy,r*1.16); gr.addColorStop(0,'rgba(120,190,255,.55)'); gr.addColorStop(0.35,'rgba(70,140,230,.18)'); gr.addColorStop(1,'rgba(40,90,200,0)'); g.fillStyle=gr; g.beginPath(); g.arc(cx,cy,r*1.16,0,7); g.fill(); }
    // ocean
    g.save(); g.beginPath(); path({type:'Sphere'}); g.clip();
    let oc=g.createRadialGradient(cx-r*0.35,cy-r*0.4,r*0.05,cx,cy,r*1.02); oc.addColorStop(0,'#1d5f8a'); oc.addColorStop(0.6,'#0d3557'); oc.addColorStop(1,'#061a2e');
    if(r>2500){ oc=g.createLinearGradient(0,0,0,1920); oc.addColorStop(0,'#0e3b60'); oc.addColorStop(1,'#145077'); } g.fillStyle=oc; g.fillRect(0,0,1080,1920);
    g.strokeStyle='rgba(160,210,255,.10)'; g.lineWidth=1.2; g.beginPath(); path(grat); g.stroke();
    // land: warm sand, coast glow, borders
    g.save(); g.shadowColor='rgba(150,220,255,.55)'; g.shadowBlur=18; g.fillStyle='#e8dcc2'; g.beginPath(); path(LAND); g.fill(); g.restore();
    const hl=sm(0.25,0,cam.alt); g.fillStyle='rgba(255,140,90,'+(0.30*Math.max(sm(0.12,0,cam.pp)*hl,sm(0.88,1,cam.pp)*hl))+')'; g.beginPath(); path(cam.pp<0.5?CZ:JP); g.fill();
    g.strokeStyle='rgba(70,60,45,.40)'; g.lineWidth=1.6; g.beginPath(); path(BORD); g.stroke();
    g.strokeStyle='rgba(255,255,255,.55)'; g.lineWidth=1.4; g.beginPath(); path(LAND); g.stroke();
    // limb darkening + sun light
    const sh=g.createRadialGradient(cx-r*0.45,cy-r*0.5,r*0.1,cx,cy,r*1.05); sh.addColorStop(0,'rgba(255,240,215,.16)'); sh.addColorStop(0.55,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(2,8,20,.55)');
    g.fillStyle=sh; g.fillRect(0,0,1080,1920); g.restore();
    // route: faint full great circle, glowing trail with flowing dashes, plane at the head
    const pf=cam.pp, lw=Math.max(5,Math.min(11,r/420));
    g.save(); g.lineCap='round'; g.lineJoin='round';
    g.setLineDash([2,18]); g.strokeStyle='rgba(255,255,255,.55)'; g.lineWidth=lw*0.7; g.beginPath(); path(ARC); g.stroke(); g.setLineDash([]);
    if(pf>0.002){ const tr=arcTo(pf); g.shadowColor='rgba(255,90,43,.95)'; g.shadowBlur=28; g.strokeStyle='rgba(255,90,43,.95)'; g.lineWidth=lw; g.beginPath(); path(tr); g.stroke(); g.shadowBlur=0;
      g.setLineDash([22,26]); g.lineDashOffset=-lt*90; g.strokeStyle='rgba(255,236,224,.95)'; g.lineWidth=lw*0.38; g.beginPath(); path(tr); g.stroke(); g.setLineDash([]); }
    g.restore();
    city(g,PRG,'Prague',1-sm(0.5,0.65,cam.pp),lt,-1); city(g,TYO,'Tokyo',sm(0.62,0.85,cam.pp),lt,1);
    { const p=IP(CL(pf)), q=IP(CL(pf+0.004)), a=proj(p), b=proj(q); if(a&&b){ const ang=Math.atan2(b[1]-a[1],b[0]-a[0]); const ps=0.95+0.55*sm(0.5,0,cam.alt)+0.08*Math.sin(lt*2.3); plane(g,a[0],a[1]+Math.sin(lt*3)*3,ang,ps*1.25*(1-0.35*sm(0.9,1,pf))); } }
    // end card: real great-circle distance (odometer count-up), linked to Tokyo by a thin line
    const CT=T1-0.15, cd=E3((lt-CT)/0.6), CA=(window.CARDA===undefined?1:window.CARDA);
    if(lt>CT && CA>0.003){ const d=proj(TYO), y0=1080+(1-cd)*40+Math.sin(lt*1.3)*5, x0=110+Math.sin(lt*0.9)*4;
      g.save(); g.globalAlpha=cd*CA; if(d){ g.strokeStyle='rgba(255,255,255,.8)'; g.lineWidth=2.5; g.beginPath(); g.moveTo(x0+430,y0); g.lineTo(lerp(x0+430,d[0],cd),lerp(y0,d[1]+20,cd)); g.stroke(); }
      g.fillStyle='rgba(8,18,30,.66)'; g.beginPath(); g.roundRect(x0,y0,860,236,44); g.fill(); g.strokeStyle='rgba(255,255,255,.38)'; g.lineWidth=1.5; g.stroke();
      g.fillStyle='rgba(255,255,255,.85)'; g.font='700 44px '+SANS; g.textBaseline='alphabetic'; g.fillText('Prague  →  Tokyo',x0+50,y0+86);
      g.fillStyle='#fff'; g.font='900 112px '+SANS; g.fillText(odo(KM*E3((lt-CT)/0.7))+' km',x0+46,y0+196); g.restore(); }
    g.drawImage(VIG,0,0); g.globalAlpha=0.9; g.drawImage(GRAIN,(Math.floor(lt*24)%3)*-8,0); g.globalAlpha=1; };
})();
