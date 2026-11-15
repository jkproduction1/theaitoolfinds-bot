// neon40 result: an 80s synthwave name intro ("ALEX"), drawn in code (canvas 2D) by Claude Opus 5.5.
// Own design: striped sunset, scrolling neon grid, palm silhouettes, chrome letters with a light sweep. No game/film logo, font or wordmark.
(function(){
const cv=document.getElementById('cv0'), g=cv.getContext('2d');
const W=1080,H=1920,HZ=1210,NAME='ALEX';
const C=(x)=>x<0?0:x>1?1:x;
const eo=(x)=>{x=C(x);return 1-Math.pow(1-x,4);};
const sio=(x)=>{x=C(x);return x*x*(3-2*x);};
const bo=(x)=>{x=C(x);const c1=1.7,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
function rnd(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646;};}
// ---------- sky (pre-rendered): night purple -> magenta -> warm horizon, grain
const sky=document.createElement('canvas'); sky.width=W; sky.height=H; (function(){ const p=sky.getContext('2d');
  const gr=p.createLinearGradient(0,0,0,HZ); gr.addColorStop(0,'#07031a'); gr.addColorStop(.45,'#1d0838'); gr.addColorStop(.78,'#5a0f5e'); gr.addColorStop(.94,'#b8246e'); gr.addColorStop(1,'#ff6a5c');
  p.fillStyle=gr; p.fillRect(0,0,W,HZ); const fg=p.createLinearGradient(0,HZ,0,H); fg.addColorStop(0,'#2a0636'); fg.addColorStop(.3,'#10031c'); fg.addColorStop(1,'#04010a');
  p.fillStyle=fg; p.fillRect(0,HZ,W,H-HZ); const r=rnd(5); const id=p.getImageData(0,0,W,H), d=id.data;
  for(let i=0;i<d.length;i+=4){ const n=(r()-.5)*12; d[i]+=n; d[i+1]+=n; d[i+2]+=n; } p.putImageData(id,0,0); })();
const R=rnd(11); const STARS=[]; for(let i=0;i<170;i++) STARS.push([R()*W,R()*HZ*0.8,R()*1.8+0.4,R()*6.28,R()*2+1]);
// mountains silhouette points (own shape)
const MT=[]; (function(){ const r=rnd(23); for(let x=-40;x<=W+40;x+=30){ const m=Math.sin(x*0.006)*60+Math.sin(x*0.017+1)*34+r()*18; MT.push([x,HZ-70-Math.max(0,m+40)*(Math.abs(x-540)>260?1:0.45)]); } })();
function palm(x,y,s,sw,flip){ g.save(); g.translate(x,y); g.scale(flip?-s:s,s); g.fillStyle='#07010d'; g.strokeStyle='#07010d';
  g.beginPath(); g.moveTo(-14,0); g.quadraticCurveTo(10+sw*20,-260,40+sw*40,-520); g.lineTo(58+sw*40,-516); g.quadraticCurveTo(30+sw*20,-260,14,0); g.fill();
  const tx=50+sw*40, ty=-520; for(let k=0;k<7;k++){ const a=-2.9+k*0.62+Math.sin(sw*3+k)*0.06; const L=200+(k%2)*40; g.beginPath(); g.moveTo(tx,ty);
    const ex=tx+Math.cos(a)*L, ey=ty+Math.sin(a)*L*0.55+70; g.quadraticCurveTo(tx+Math.cos(a)*L*0.5,ty+Math.sin(a)*L*0.5-40,ex,ey);
    g.quadraticCurveTo(tx+Math.cos(a)*L*0.55,ty+Math.sin(a)*L*0.5-10,tx,ty+6); g.fill(); } g.restore(); }
SCN[0]=function(u){
  // camera drift (never static)
  const dr=sio(u/1.2); const zoom=1.10-0.08*dr+0.012*Math.sin(u*1.3); const ox=10*Math.sin(u*0.9), oy=-30*(1-dr)+8*Math.sin(u*1.1);
  g.setTransform(1,0,0,1,0,0); g.clearRect(0,0,W,H); g.save(); g.translate(W/2+ox,H/2+oy); g.scale(zoom,zoom); g.translate(-W/2,-H/2);
  g.drawImage(sky,0,0);
  // stars
  STARS.forEach(([x,y,r,ph,sp])=>{ g.globalAlpha=(0.35+0.65*(0.5+0.5*Math.sin(u*sp*2+ph)))*C(u/0.4); g.fillStyle='#ffe9ff'; g.beginPath(); g.arc(x,y,r,0,6.28); g.fill(); }); g.globalAlpha=1;
  // sun: rises, horizontal gaps scroll down
  const sr=330, sy=HZ-150+ (1-eo(u/1.0))*420 - 6*Math.sin(u*0.8); g.save(); g.beginPath(); g.rect(0,0,W,HZ); g.clip();
  g.shadowColor='rgba(255,90,140,.85)'; g.shadowBlur=120; const sg=g.createLinearGradient(0,sy-sr,0,sy+sr); sg.addColorStop(0,'#ffe66b'); sg.addColorStop(.45,'#ff8a3d'); sg.addColorStop(1,'#ff2d87');
  g.fillStyle=sg; g.beginPath(); g.arc(540,sy,sr,0,6.28); g.fill(); g.shadowBlur=0;
  g.globalCompositeOperation='destination-out'; for(let k=0;k<9;k++){ const ph=((u*0.35+k/9)%1); const yy=sy-sr*0.05+ph*sr*1.1; const hh=3+ph*30; g.fillRect(0,yy,W,hh); } g.globalCompositeOperation='source-over'; g.restore();
  // mountains
  g.fillStyle='#14041f'; g.beginPath(); g.moveTo(-40,HZ+2); MT.forEach(([x,y])=>g.lineTo(x,y)); g.lineTo(W+40,HZ+2); g.closePath(); g.fill();
  g.strokeStyle='rgba(255,60,190,.55)'; g.lineWidth=2.5; g.beginPath(); MT.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y)); g.stroke();
  // grid floor (scrolling)
  g.save(); g.beginPath(); g.rect(-200,HZ,W+400,H); g.clip(); g.shadowColor='#ff3fd0'; g.shadowBlur=18; g.strokeStyle='#ff4fd8'; const ga=C(u/0.5);
  for(let k=-22;k<=22;k++){ g.globalAlpha=ga*0.9; g.lineWidth=2.2; g.beginPath(); g.moveTo(540+k*12,HZ); g.lineTo(540+k*520,H+400); g.stroke(); }
  const off=(u*1.6)%1; for(let k=0;k<26;k++){ const z=(k+1-off)*1.0; const y=HZ+900/z*0.6; if(y>H+40) continue; g.globalAlpha=ga*Math.min(1,(y-HZ)/120); g.lineWidth=1+3*Math.min(1,(y-HZ)/600); g.beginPath(); g.moveTo(-200,y); g.lineTo(W+200,y); g.stroke(); }
  g.restore(); g.globalAlpha=1;
  // horizon glow
  const hg=g.createLinearGradient(0,HZ-60,0,HZ+80); hg.addColorStop(0,'rgba(255,80,160,0)'); hg.addColorStop(.5,'rgba(255,120,190,.55)'); hg.addColorStop(1,'rgba(255,80,160,0)'); g.fillStyle=hg; g.fillRect(0,HZ-60,W,140);
  // palms (slide in from the sides, sway)
  const pin=eo((u-0.15)/0.9); palm(-60-260*(1-pin),HZ+90,1.25,Math.sin(u*1.4)*0.15,false); palm(W+60+260*(1-pin),HZ+130,1.4,Math.sin(u*1.2+1)*0.15,true);
  palm(150-200*(1-pin),HZ+20,0.62,Math.sin(u*1.6+2)*0.12,false); palm(W-170+200*(1-pin),HZ+10,0.55,Math.sin(u*1.5+3)*0.12,true);
  // chrome letters: each slams in, then floats
  g.font='italic 900 250px Inter, sans-serif'; g.textBaseline='alphabetic'; g.textAlign='left'; const ws=NAME.split('').map(c=>g.measureText(c).width); const TW=ws.reduce((a,b)=>a+b,0)+12*(NAME.length-1);
  let x0=540-TW/2; const by=900;
  NAME.split('').forEach((ch,i)=>{ const t0=0.25+i*0.1; const p=C((u-t0)/0.4); if(p<=0){ x0+=ws[i]+12; return; } const s=1+1.6*(1-eo(p)); const fl=4*Math.sin(u*2+i*0.8)*C(u-t0-0.4);
    g.save(); g.translate(x0+ws[i]/2,by-90+fl); g.scale(s,s); g.globalAlpha=C(p*2.2); g.translate(-ws[i]/2,90);
    g.lineJoin='round'; g.shadowColor='rgba(255,40,200,.95)'; g.shadowBlur=40; g.strokeStyle='#ff3fd0'; g.lineWidth=16; g.strokeText(ch,0,0); g.shadowBlur=0;
    const cg=g.createLinearGradient(0,-185,0,10); cg.addColorStop(0,'#e9f6ff'); cg.addColorStop(.42,'#7fc4ff'); cg.addColorStop(.5,'#1a1340'); cg.addColorStop(.56,'#ff8fd6'); cg.addColorStop(1,'#fff1c4');
    g.fillStyle=cg; g.fillText(ch,0,0); g.strokeStyle='rgba(255,255,255,.9)'; g.lineWidth=3; g.strokeText(ch,0,0); g.restore(); x0+=ws[i]+12; });
  // light sweep across the word (repeats)
  const lp=((u-1.1)/1.5); if(lp>0){ const ph=lp%1; if(ph<0.55){ const sx=540-TW/2-200+(TW+400)*(ph/0.55); g.save(); g.font='italic 900 250px Inter, sans-serif'; g.globalCompositeOperation='lighter';
    const lg=g.createLinearGradient(sx-90,0,sx+90,0); lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(.5,'rgba(255,255,255,.85)'); lg.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=lg; let xx=540-TW/2; NAME.split('').forEach((ch,i)=>{ g.fillText(ch,xx,by+4*Math.sin(u*2+i*0.8)); xx+=ws[i]+12; }); g.restore(); } }
  // neon subline flickers on
  const sp=C((u-1.25)/0.25); if(sp>0){ const fk=(u<1.6)?((Math.sin(u*90)>0.2)?1:0.25):(0.9+0.1*Math.sin(u*30)); g.save(); g.globalAlpha=sp*fk; g.font='italic 700 74px Inter, sans-serif'; g.textAlign='center';
    g.shadowColor='#2ef2ff'; g.shadowBlur=36; g.strokeStyle='#7ff8ff'; g.lineWidth=4; g.strokeText('NIGHT  DRIVE',540,1030); g.shadowBlur=14; g.strokeText('NIGHT  DRIVE',540,1030); g.restore(); }
  g.restore();
  // scanlines + vignette
  g.globalAlpha=0.08; g.fillStyle='#000'; const so=(u*40)%6; for(let y=-6+so;y<H;y+=6) g.fillRect(0,y,W,2); g.globalAlpha=1;
  const vg=g.createRadialGradient(W/2,H*.5,H*.3,W/2,H*.5,H*.78); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(5,0,12,.6)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
};
})();
