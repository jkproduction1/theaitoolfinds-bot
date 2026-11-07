/* penguin10 scene. Card render size W×H (card units). Each style: draw(ctx,t) into a W×H 2D context. */
const W=600,H=1067, CARD={x:440,y:410,w:600,h:1067,r:34};
const BEAT=0.3946, Bk=k=>BEAT*k;
const ST=[0,...Array.from({length:9},(_,i)=>Bk(4+3*i))];   // style starts (0, 1.58, 2.76 … 11.03)
const CTA=Bk(31), END=16.2, WIPE=0.22;
const NAMES=['Pixel Waddle','Chalk Talk','Neon Line','Clay Toy','Comic Pop','Paper Cut','Blueprint','Ink Doodle','Brick Toy','Moonlight 3D'];
const V2=150;                         // 2D world scroll px/s (card units)
const GY=H*0.72, PX=W*0.47, PK=1.05;  // penguin ground y, x, scale
const TAU=Math.PI*2;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)), lerp=(a,b,k)=>a+(b-a)*k;
const eOut=x=>x>=1?1:1-Math.pow(2,-10*clamp(x)), eIO=x=>{x=clamp(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const back=x=>{x=clamp(x);const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
function mul(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const hs=(i,j=0)=>{const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s)};
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function poly(x,p,close=true){x.beginPath();p.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));if(close)x.closePath()}
function ellP(cx,cy,rx,ry,rot=0,n=48){const o=[],c=Math.cos(rot),s=Math.sin(rot);for(let i=0;i<n;i++){const a=i/n*TAU,X=Math.cos(a)*rx,Y=Math.sin(a)*ry;o.push([cx+X*c-Y*s,cy+X*s+Y*c])}return o}

/* ---------- penguin as a list of shapes (card coords) ---------- */
function penguin(t,o={}){
  const ph=t*TAU*1.75, k=o.k||PK, px=o.x??PX, gy=o.gy??GY;
  const a=Math.sin(ph)*.075, bob=-Math.abs(Math.sin(ph))*9;
  const ca=Math.cos(a),sa=Math.sin(a);
  const B=p=>p.map(([x,y])=>[px+(x*ca-y*sa)*k, gy+(x*sa+y*ca+bob)*k]);      // body space
  const G=p=>p.map(([x,y])=>[px+x*k, gy+y*k]);                              // ground space
  const S=[];
  const sw=Math.sin(ph), lA=Math.max(0,Math.cos(ph))*9, lB=Math.max(0,-Math.cos(ph))*9;
  S.push({id:'footB',c:'feet',p:G(ellP(-16-sw*22,-7-lB,30,11))});
  // scarf tail (behind body, flutters back)
  const L=[],R=[];for(let i=0;i<=12;i++){const s=i/12,x=-62-s*92,y=-196+s*58+Math.sin(ph*1.2-s*5)*11*s,w=15*(1-.35*s);L.push([x,y-w]);R.unshift([x+3,y+w])}
  S.push({id:'tail',c:'scarf',p:B(L.concat(R))});
  S.push({id:'body',c:'body',p:B(ellP(0,-165,98,160))});
  S.push({id:'belly',c:'belly',p:B(ellP(20,-138,66,118,-.05))});
  const fa=-.2+Math.sin(ph+Math.PI)*.32, fc=Math.cos(fa), fs=Math.sin(fa);
  S.push({id:'flip',c:'body2',p:B(ellP(0,64,21,64).map(([x,y])=>[-24+x*fc-y*fs,-208+x*fs+y*fc]))});
  const top=[],bot=[];for(let i=0;i<=14;i++){const x=-92+i/14*186,y=-214+12*Math.pow(x/92,2);top.push([x,y]);bot.unshift([x,y+34])}
  S.push({id:'scarf',c:'scarf',p:B(top.concat(bot))});
  S.push({id:'beak',c:'beak',p:B([[76,-262],[100,-258],[122,-247],[100,-238],[76,-234]])});
  S.push({id:'cheek',c:'cheek',p:B(ellP(56,-226,11,7))});
  S.push({id:'eye',c:'eye',p:B(ellP(44,-264,10,11))});
  S.push({id:'shine',c:'shine',p:B(ellP(47,-268,3.4,3.4,0,12))});
  S.push({id:'footA',c:'feet',p:G(ellP(18+sw*22,-6-lA,31,11))});
  const pt=(x,y)=>B([[x,y]])[0];
  return {S,ph,k,anchors:{top:pt(0,-325),scarf:pt(-120,-170),flip:pt(-30,-140),beak:pt(122,-247),feet:[px,gy],eye:pt(44,-264)}};
}
const by=(S,id)=>S.find(s=>s.id===id);
function fillAll(x,S,pal,{stroke=null,lw=0}={}){for(const s of S){const c=pal[s.c];if(!c)continue;poly(x,s.p);x.fillStyle=c;x.fill();if(stroke&&s.c!=='shine'&&s.c!=='cheek'){x.strokeStyle=stroke;x.lineWidth=lw;x.lineJoin='round';x.stroke()}}}
function jit(p,amt,seed){return p.map((q,i)=>[q[0]+(hs(i,seed)-.5)*amt,q[1]+(hs(i+77,seed)-.5)*amt])}
function bodyMinusBelly(x,P,cb){x.save();poly(x,by(P.S,'body').p);x.clip();cb();x.restore()}

/* ---------- shared textures ---------- */
const rnd=mul(7);
const GRAIN=(()=>{const c=mk(W,H),x=c.getContext('2d'),d=x.createImageData(W,H);for(let i=0;i<d.data.length;i+=4){const v=rnd()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);return c})();
const CHALKMASK=(()=>{const c=mk(W,H),x=c.getContext('2d');for(let i=0;i<26000;i++){x.fillStyle=`rgba(0,0,0,${.35+rnd()*.6})`;x.fillRect(rnd()*W,rnd()*H,1+rnd()*2.2,1+rnd()*1.6)}return c})();
const BOARD=(()=>{const c=mk(W,H),x=c.getContext('2d');x.fillStyle='#24392f';x.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){const X=rnd()*W,Y=rnd()*H,r=60+rnd()*220,g=x.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,`rgba(255,255,255,${.02+rnd()*.035})`);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,W,H)}
  x.globalAlpha=.05;x.drawImage(GRAIN,0,0);return c})();
const PAPER=(()=>{const c=mk(W,H),x=c.getContext('2d');x.fillStyle='#F3ECDC';x.fillRect(0,0,W,H);x.globalCompositeOperation='multiply';x.globalAlpha=.07;x.drawImage(GRAIN,0,0);
  x.globalAlpha=1;const g=x.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(120,90,50,.18)');x.fillStyle=g;x.fillRect(0,0,W,H);return c})();
const lay=mk(W,H), lx=lay.getContext('2d');

/* ---------- 1 Pixel Waddle ---------- */
const PS=5, pw=W/PS|0, phh=Math.ceil(H/PS), pc=mk(pw,phh), pxc=pc.getContext('2d');
function inPoly(p,x,y){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if(((a[1]>y)!==(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))c=!c}return c}
function sPixel(x,t){
  const X=t*V2/PS, c=pxc;
  const sky=['#22163f','#2e1d55','#47246a','#6b2f78','#a24683','#d9667f','#f39a7f'];
  const hz=Math.round(GY/PS)-34;
  for(let r=0;r<phh;r++){const k=clamp(r/(hz+20));c.fillStyle=sky[Math.min(6,Math.floor(k*7))];c.fillRect(0,r,pw,1)}
  for(let i=0;i<40;i++){const sx=((hs(i,1)*pw*2-X*.1)%pw+pw)%pw,sy=hs(i,2)*hz*.7;if(hs(i,Math.floor(t*4))>.25){c.fillStyle='#fff6d8';c.fillRect(sx|0,sy|0,1,1)}}
  c.fillStyle='#ffe9a8';for(let yy=-6;yy<=6;yy++)for(let xx=-6;xx<=6;xx++)if(xx*xx+yy*yy<=36)c.fillRect(88+xx,30+yy,1,1);
  for(let col=0;col<pw;col++){const wx=col+X*.35,h=10+Math.round(8*Math.sin(wx*.07)+5*Math.sin(wx*.19+1)),y0=hz+20-h;c.fillStyle='#3b2a63';c.fillRect(col,y0,1,h+40);c.fillStyle='#e8e6ff';if(h>12)c.fillRect(col,y0,1,2)}
  const gy=Math.round(GY/PS);c.fillStyle='#e9f3ff';c.fillRect(0,gy,pw,phh-gy);c.fillStyle='#ffffff';c.fillRect(0,gy,pw,2);
  for(let col=0;col<pw;col++){const wx=Math.floor(col+X);for(let r=gy+3;r<phh;r+=1)if(((wx+r)%4===0)&&((r-gy)%3===0)){c.fillStyle='#b9d3f0';c.fillRect(col,r,1,1)}}
  for(let i=0;i<10;i++){const wx=i*47+12,sx=Math.round(((wx-X)%(pw+40)+pw+40)%(pw+40))-20;c.fillStyle='#6fa0d8';c.fillRect(sx,gy-3,6,3);c.fillStyle='#ffffff';c.fillRect(sx+1,gy-4,4,1)}
  // penguin rasterised without AA
  const P=penguin(t),pal={feet:'#ff9a2e',scarf:'#e8352f',body:'#262a3a',body2:'#1a1d2a',belly:'#fdfdf7',beak:'#ffb22e',cheek:'#ff8fa0',eye:'#111',shine:'#fff'};
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;P.S.forEach(s=>s.p.forEach(([a,b])=>{x0=Math.min(x0,a);y0=Math.min(y0,b);x1=Math.max(x1,a);y1=Math.max(y1,b)}));
  const bx0=Math.floor(x0/PS)-1,by0=Math.floor(y0/PS)-1,bx1=Math.ceil(x1/PS)+1,by1=Math.ceil(y1/PS)+1,grid={};
  for(let r=by0;r<=by1;r++)for(let q=bx0;q<=bx1;q++){const cx=(q+.5)*PS,cy=(r+.5)*PS;let col=null;for(const s of P.S){if(s.c==='shine'||s.c==='cheek')continue;if(inPoly(s.p,cx,cy))col=pal[s.c]}grid[q+','+r]=col}
  for(let r=by0;r<=by1;r++)for(let q=bx0;q<=bx1;q++){const g=grid[q+','+r];if(g){c.fillStyle=g;c.fillRect(q,r,1,1)}else if(grid[(q+1)+','+r]||grid[(q-1)+','+r]||grid[q+','+(r+1)]||grid[q+','+(r-1)]){c.fillStyle='#120e22';c.fillRect(q,r,1,1)}}
  const e=P.anchors.eye;c.fillStyle='#ffffff';c.fillRect(Math.round(e[0]/PS),Math.round(e[1]/PS)-1,1,1);
  for(let i=0;i<46;i++){const sx=((hs(i,5)*pw-t*6*(1+hs(i,6)))%pw+pw)%pw,sy=((hs(i,7)*phh+t*22*(.6+hs(i,8)))%phh);c.fillStyle='#ffffff';c.fillRect(sx|0,sy|0,1,1)}
  x.imageSmoothingEnabled=false;x.drawImage(pc,0,0,pw*PS,phh*PS);x.imageSmoothingEnabled=true;
  x.fillStyle='#fff';x.font='700 30px "DejaVu Sans Mono"';x.textAlign='right';x.fillText('1UP  ♥♥♥',W-28,54);x.textAlign='left';
}

/* ---------- 2 Chalk Talk ---------- */
function chalkStroke(x,p,col,w,seed,close=true,passes=2){x.strokeStyle=col;x.lineCap='round';x.lineJoin='round';for(let k=0;k<passes;k++){x.lineWidth=w*(k?0.6:1);poly(x,jit(p,3.2,seed+k*13),close);x.stroke()}}
function hatch(x,clipP,col,gap,ang,w,seed){x.save();poly(x,clipP);x.clip();x.strokeStyle=col;x.lineWidth=w;const c=Math.cos(ang),s=Math.sin(ang);for(let i=-H;i<H*1.5;i+=gap){const j=(hs(i,seed)-.5)*4;x.beginPath();x.moveTo(i*c-(-H)*s+j,i*s+(-H)*c);x.lineTo(i*c-(H*2)*s+j,i*s+(H*2)*c);x.stroke()}x.restore()}
function sChalk(x,t){
  x.drawImage(BOARD,0,0);const seed=Math.floor(t*8)*31,X=t*V2;
  const L=lx;L.clearRect(0,0,W,H);
  const g=[];for(let i=0;i<=30;i++){const xx=i/30*W;g.push([xx,GY+6+Math.sin((xx+X)*.03)*3])}chalkStroke(L,g,'rgba(255,255,255,.9)',4,seed,false);
  for(let i=0;i<8;i++){const wx=i*190+40,sx=((wx-X)%1520+1520)%1520-60;if(sx<-80||sx>W+40)continue;chalkStroke(L,ellP(sx,GY+2,34,12,0,20).slice(10,20),'rgba(255,255,255,.75)',3,seed+i,false)}
  for(let i=0;i<26;i++){const sx=((hs(i,3)*W*1.3-X*.3)%(W+40)+W+40)%(W+40)-20,sy=hs(i,4)*GY*.55+120;chalkStroke(L,[[sx-7,sy],[sx+7,sy]],'rgba(255,255,255,.6)',3,seed+i,false,1);chalkStroke(L,[[sx,sy-7],[sx,sy+7]],'rgba(255,255,255,.6)',3,seed+i+5,false,1)}
  const P=penguin(t);
  hatch(L,by(P.S,'body').p,'rgba(255,255,255,.35)',11,.8,3,seed);
  L.save();poly(L,by(P.S,'belly').p);L.clip();L.clearRect(0,0,W,H);L.restore();
  hatch(L,by(P.S,'scarf').p,'rgba(255,120,120,.95)',6,-.7,4,seed+1);hatch(L,by(P.S,'tail').p,'rgba(255,120,120,.95)',6,-.7,4,seed+2);
  hatch(L,by(P.S,'beak').p,'rgba(255,214,102,1)',4,.3,4,seed+3);hatch(L,by(P.S,'footA').p,'rgba(255,190,90,.95)',5,.3,4,seed+4);hatch(L,by(P.S,'footB').p,'rgba(255,190,90,.8)',5,.3,4,seed+5);
  for(const s of P.S){if(s.c==='shine'||s.c==='cheek')continue;const col=s.c==='scarf'?'rgba(255,140,140,1)':(s.c==='beak'||s.c==='feet')?'rgba(255,214,120,1)':'rgba(255,255,255,.95)';chalkStroke(L,s.p,col,s.c==='eye'?6:4.5,seed+s.id.length*7)}
  const e=P.anchors.eye;L.fillStyle='#fff';L.beginPath();L.arc(e[0],e[1],9,0,TAU);L.fill();
  L.font='600 46px Poppins';L.fillStyle='rgba(255,255,255,.92)';L.fillText('penguin.walk()',46,140);
  const a=P.anchors.scarf;L.font='500 34px Poppins';L.fillText('scarf!',a[0]-75,a[1]-150);chalkStroke(L,[[a[0]-40,a[1]-130],[a[0]-40,a[1]-35]],'rgba(255,255,255,.85)',3.5,seed+9,false);chalkStroke(L,[[a[0]-56,a[1]-52],[a[0]-40,a[1]-35],[a[0]-26,a[1]-52]],'rgba(255,255,255,.85)',3.5,seed+10,false);
  L.globalCompositeOperation='destination-out';L.drawImage(CHALKMASK,(seed%5)*3,0);L.globalCompositeOperation='source-over';
  x.drawImage(lay,0,0);
  x.fillStyle='#8a5a32';x.fillRect(0,H-30,W,30);x.fillStyle='rgba(255,255,255,.85)';x.fillRect(W-170,H-44,70,16);
}

/* ---------- 3 Neon Line ---------- */
function sNeon(x,t){
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05040d');g.addColorStop(.62,'#140a2e');g.addColorStop(.63,'#06040f');g.addColorStop(1,'#05040b');x.fillStyle=g;x.fillRect(0,0,W,H);
  const hz=H*.6,X=t*V2;
  const sg=x.createRadialGradient(W/2,hz,0,W/2,hz,W*.8);sg.addColorStop(0,'rgba(255,60,170,.35)');sg.addColorStop(1,'rgba(255,60,170,0)');x.fillStyle=sg;x.fillRect(0,0,W,H);
  x.save();x.strokeStyle='#b14dff';x.lineWidth=3;x.shadowColor='#b14dff';x.shadowBlur=14;x.beginPath();
  for(let i=0;i<=W;i+=6){const wx=i+X*.25,b=Math.floor(wx/38),h=40+hs(b,9)*120;x.lineTo(i,hz-h*(hs(b,10)>.3?1:.4))}x.stroke();x.restore();
  for(let i=0;i<30;i++){x.fillStyle=`rgba(255,255,255,${.3+.7*hs(i,Math.floor(t*3))})`;x.fillRect(hs(i,11)*W,hs(i,12)*hz*.7,2,2)}
  x.save();x.strokeStyle='rgba(255,70,190,.75)';x.lineWidth=2;x.shadowColor='#ff3fb4';x.shadowBlur=10;
  for(let i=-12;i<=12;i++){x.beginPath();x.moveTo(W/2+i*20,hz);x.lineTo(W/2+i*190-((X*1.0)%190),H);x.stroke()}
  for(let i=0;i<14;i++){const z=((i+(X/60)%1)/14),y=hz+Math.pow(z,2.2)*(H-hz);x.globalAlpha=z;x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}x.restore();
  const P=penguin(t),col={body:'#5ef0ff',body2:'#5ef0ff',belly:'#5ef0ff',scarf:'#ff4fa3',tail:'#ff4fa3',beak:'#ffd84a',feet:'#ffd84a',eye:'#5ef0ff'};
  const draw=(alpha)=>{for(const s of P.S){if(s.c==='shine'||s.c==='cheek')continue;poly(x,s.p);x.fillStyle='rgba(6,4,15,1)';x.fill();
    const c=col[s.c];x.globalAlpha=alpha;x.strokeStyle=c;x.shadowColor=c;x.shadowBlur=26;x.lineWidth=6;x.lineJoin='round';x.stroke();x.shadowBlur=0;x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=1.8;x.stroke();x.globalAlpha=1}};
  x.save();x.translate(0,GY*2+4);x.scale(1,-1);x.globalAlpha=.22;draw(.22);x.restore();
  x.fillStyle='rgba(5,4,11,.55)';x.fillRect(0,GY,W,H-GY);
  x.save();draw(1);x.restore();
  x.save();x.strokeStyle='#5ef0ff';x.shadowColor='#5ef0ff';x.shadowBlur=18;x.lineWidth=3;x.beginPath();x.moveTo(0,GY+2);x.lineTo(W,GY+2);x.stroke();x.restore();
}

/* ---------- 5 Comic Pop ---------- */
function burst(x,cx,cy,r1,r2,n,rot){const p=[];for(let i=0;i<n*2;i++){const a=rot+i/(n*2)*TAU,r=i%2?r2*(0.85+0.3*hs(i,4)):r1;p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}return p}
function sComic(x,t){
  x.fillStyle='#FFD23F';x.fillRect(0,0,W,H);const P=penguin(t),cx=PX,cy=GY-170;
  x.save();x.translate(cx,cy);x.rotate(t*.15);for(let i=0;i<20;i++){x.fillStyle=i%2?'#FFC01A':'#FFE066';x.beginPath();x.moveTo(0,0);x.arc(0,0,1600,i/20*TAU,(i+1)/20*TAU);x.fill()}x.restore();
  x.fillStyle='rgba(230,120,0,.28)';for(let yy=0;yy<H;yy+=16)for(let xx=(yy/16%2)*8;xx<W;xx+=16){const d=Math.hypot(xx-cx,yy-cy)/900;const r=clamp(d)*5;if(r>.4){x.beginPath();x.arc(xx,yy,r,0,TAU);x.fill()}}
  x.fillStyle='#8fd3ff';x.fillRect(0,GY,W,H-GY);x.fillStyle='rgba(40,110,200,.35)';const X=t*V2;for(let yy=GY+14;yy<H;yy+=14)for(let xx=-((X)%14)+(yy/14%2)*7;xx<W;xx+=14){x.beginPath();x.arc(xx,yy,clamp((yy-GY)/300)*4.5,0,TAU);x.fill()}
  x.strokeStyle='#111';x.lineWidth=7;x.beginPath();x.moveTo(0,GY);x.lineTo(W,GY);x.stroke();
  x.strokeStyle='#111';x.lineCap='round';for(let i=0;i<6;i++){const y=GY-300+i*48+hs(i,2)*20,l=90+hs(i,3)*120,xx=PX-150-hs(i,5)*80-((t*400+i*60)%60);x.lineWidth=6;x.beginPath();x.moveTo(xx-l,y);x.lineTo(xx,y);x.stroke()}
  const pal={feet:'#FF8A1F',scarf:'#F2382E',body:'#2B3044',body2:'#22263a',belly:'#FFFFFF',beak:'#FF9F1C',cheek:'#ff7f9a',eye:'#111',shine:'#fff'};
  fillAll(x,P.S,pal,{stroke:'#111',lw:7});
  x.save();poly(x,by(P.S,'body').p);x.clip();x.fillStyle='rgba(0,0,0,.45)';for(let yy=0;yy<H;yy+=10)for(let xx=(yy/10%2)*5;xx<PX-30;xx+=10){x.beginPath();x.arc(xx,yy,2.4,0,TAU);x.fill()}x.restore();
  for(const id of ['belly','flip','scarf','beak','eye','shine','footA']){const s=by(P.S,id);poly(x,s.p);x.fillStyle=pal[s.c];x.fill();if(id!=='shine'){x.lineWidth=id==='eye'?3:7;x.strokeStyle='#111';x.stroke()}}
  x.fillStyle='rgba(255,255,255,.7)';poly(x,ellP(P.anchors.top[0]+20,P.anchors.top[1]+60,18,9,-.5));x.fill();
  const k=eOut((t-ST[4])/.35),s=.6+.4*back((t-ST[4])/.4);x.save();x.translate(W*.66,H*.2);x.rotate(-.12);x.scale(s,s);
  poly(x,burst(x,0,0,120,175,12,.2));x.fillStyle='#fff';x.fill();x.lineWidth=8;x.strokeStyle='#111';x.stroke();
  x.font='900 76px IDI';x.textAlign='center';x.lineWidth=12;x.strokeStyle='#111';x.strokeText('WADDLE!',0,26);x.fillStyle='#F2382E';x.fillText('WADDLE!',0,26);x.textAlign='left';x.restore();
}

/* ---------- 6 Paper Cut ---------- */
function sPaper(x,t){
  const X=t*V2;x.fillStyle='#BFE3EF';x.fillRect(0,0,W,H);
  const sh=(b,o)=>{x.shadowColor=`rgba(20,60,80,${o})`;x.shadowBlur=b;x.shadowOffsetY=b*.4};
  sh(16,.25);x.fillStyle='#FFD98A';x.beginPath();x.arc(W*.72,H*.2,70,0,TAU);x.fill();
  const layer=(y,amp,f,spd,col,seed)=>{sh(18,.28);x.fillStyle=col;x.beginPath();x.moveTo(0,H);for(let i=0;i<=W;i+=8){const wx=i+X*spd;x.lineTo(i,y-amp*(.6*Math.sin(wx*f+seed)+.4*Math.sin(wx*f*2.3+seed*2)))}x.lineTo(W,H);x.closePath();x.fill()};
  layer(H*.5,60,.008,.15,'#E9F4F8',1);layer(H*.6,40,.012,.4,'#D2E8F0',3);
  for(let i=0;i<7;i++){const wx=i*230+80,sx=((wx-X*.7)%1610+1610)%1610-100;if(sx<-100||sx>W+60)continue;sh(10,.25);x.fillStyle='#3d8f6b';const y=H*.66;poly(x,[[sx,y-110],[sx+46,y],[sx-46,y]]);x.fill();x.fillStyle='#ffffff';poly(x,[[sx,y-110],[sx+18,y-68],[sx-18,y-68]]);x.fill()}
  layer(GY+12,10,.02,1,'#FFFFFF',5);
  const P=penguin(t),pal={feet:'#F4A340',scarf:'#E85D4A',body:'#2E3440',body2:'#262b35',belly:'#FAFAF7',beak:'#F4A340',cheek:'#f59aa8',eye:'#1a1a1a',shine:'#fff'};
  for(const s of P.S){const c=pal[s.c];poly(x,s.p);sh(s.c==='shine'?0:9,.32);x.fillStyle=c;x.fill()}
  x.shadowColor='transparent';x.shadowBlur=0;x.shadowOffsetY=0;
  for(let i=0;i<24;i++){const sx=((hs(i,1)*W*1.2-X*.5)%(W+30)+W+30)%(W+30)-15,sy=((hs(i,2)*H+t*50*(.5+hs(i,3)))%(H*.9));sh(4,.2);x.fillStyle='#fff';x.beginPath();x.arc(sx,sy,4+hs(i,4)*5,0,TAU);x.fill()}
  x.shadowColor='transparent';x.shadowBlur=0;x.shadowOffsetY=0;
  x.globalCompositeOperation='multiply';x.globalAlpha=.09;x.drawImage(GRAIN,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';
}

/* ---------- 7 Blueprint ---------- */
function arrowLine(x,a,b){x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);for(const [p,d] of [[a,1],[b,-1]]){x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(p[0]+d*12*Math.cos(ang-.4),p[1]+d*12*Math.sin(ang-.4));x.moveTo(p[0],p[1]);x.lineTo(p[0]+d*12*Math.cos(ang+.4),p[1]+d*12*Math.sin(ang+.4));x.stroke()}}
function sBlue(x,t){
  const X=t*V2;x.fillStyle='#1F4E8C';x.fillRect(0,0,W,H);
  for(let i=-1;i<W/20+2;i++){const xx=i*20-(X%100)%20;x.strokeStyle=((Math.round((xx+X)/20))%5===0)?'rgba(255,255,255,.2)':'rgba(255,255,255,.07)';x.lineWidth=1;x.beginPath();x.moveTo(xx,0);x.lineTo(xx,H);x.stroke()}
  for(let j=0;j<H/20+1;j++){x.strokeStyle=j%5===0?'rgba(255,255,255,.2)':'rgba(255,255,255,.07)';x.beginPath();x.moveTo(0,j*20);x.lineTo(W,j*20);x.stroke()}
  const P=penguin(t),a=P.anchors;x.strokeStyle='#fff';x.lineJoin='round';
  x.setLineDash([10,8]);x.lineWidth=1.5;x.strokeStyle='rgba(255,255,255,.5)';x.beginPath();x.arc(a.eye[0]-30,a.eye[1]+20,120,0,TAU);x.stroke();
  x.beginPath();x.moveTo(0,GY);x.lineTo(W,GY);x.stroke();x.beginPath();x.moveTo(a.feet[0],GY+40);x.lineTo(a.top[0],a.top[1]-40);x.stroke();x.setLineDash([]);
  for(const s of P.S){if(s.c==='shine'||s.c==='cheek')continue;poly(x,s.p);x.fillStyle='rgba(31,78,140,.92)';x.fill();x.strokeStyle='#fff';x.lineWidth=s.c==='belly'?2:3;if(s.c==='belly')x.setLineDash([12,7]);x.stroke();x.setLineDash([])}
  x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=2;const rx=PX+175;arrowLine(x,[rx,GY],[rx,GY-PK*328]);
  x.save();x.translate(rx+22,GY-170);x.rotate(-Math.PI/2);x.fillStyle='#fff';x.font='22px "DejaVu Sans Mono"';x.textAlign='center';x.fillText('H 344',0,0);x.restore();
  arrowLine(x,[PX-80,GY+46],[PX+80,GY+46]);x.fillStyle='#fff';x.font='22px "DejaVu Sans Mono"';x.textAlign='center';x.fillText('STRIDE 48',PX,GY+82);x.textAlign='left';
  const lab=(p,tx,ty,s)=>{x.font='20px "DejaVu Sans Mono"';const w=x.measureText(s).width;x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=1.5;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(tx,ty);x.lineTo(tx+w,ty);x.stroke();x.beginPath();x.arc(p[0],p[1],4,0,TAU);x.fillStyle='#fff';x.fill();x.fillText(s,tx,ty-8)};
  lab(a.scarf,40,a.scarf[1]-150,'SCARF / WOOL');lab(a.flip,40,a.flip[1]+170,'FLIPPER');lab(a.beak,W-130,a.beak[1]-90,'BEAK');
  x.strokeStyle='#fff';x.lineWidth=2;x.strokeRect(W-270,H-150,240,110);x.beginPath();x.moveTo(W-270,H-110);x.lineTo(W-30,H-110);x.stroke();
  x.font='700 22px "DejaVu Sans Mono"';x.fillStyle='#fff';x.fillText('PENGUIN · WALK',W-258,H-122);x.font='18px "DejaVu Sans Mono"';x.fillText('REV A   SCALE 1:1',W-258,H-82);x.fillText('SHEET 07 / 10',W-258,H-56);
  x.font='700 26px "DejaVu Sans Mono"';x.fillText('FIG. 07',W-150,70);
}

/* ---------- 8 Ink Doodle ---------- */
function inkStroke(x,p,w,seed,close=true){x.strokeStyle='#17140f';x.lineCap='round';x.lineJoin='round';x.lineWidth=w;poly(x,jit(p,2.4,seed),close);x.stroke();x.lineWidth=w*.45;poly(x,jit(p,3.5,seed+5),close);x.stroke()}
function sInk(x,t){
  x.drawImage(PAPER,0,0);const seed=Math.floor(t*6)*17,X=t*V2,P=penguin(t);
  const wash=(id,c,dx,dy)=>{const s=by(P.S,id);x.save();x.translate(dx,dy);poly(x,jit(s.p,5,seed+3));x.fillStyle=c;x.fill();x.restore()};
  x.save();x.globalCompositeOperation='multiply';
  wash('tail','rgba(214,58,48,.78)',5,4);wash('scarf','rgba(214,58,48,.82)',5,4);wash('beak','rgba(240,160,60,.85)',4,3);wash('footA','rgba(240,160,60,.85)',4,3);wash('footB','rgba(240,160,60,.7)',4,3);wash('cheek','rgba(240,110,130,.6)',0,0);
  x.restore();
  bodyMinusBelly(x,P,()=>{x.strokeStyle='rgba(23,20,15,.8)';x.lineWidth=2;for(let i=-H;i<H;i+=9){x.beginPath();x.moveTo(i+(hs(i,seed)-.5)*3,0);x.lineTo(i+H,H);x.stroke()}for(let i=0;i<2*H;i+=13){x.beginPath();x.moveTo(i,0);x.lineTo(i-H,H);x.stroke()}});
  poly(x,by(P.S,'belly').p);x.fillStyle='#F3ECDC';x.fill();
  x.save();poly(x,by(P.S,'flip').p);x.fillStyle='#2a251c';x.fill();x.restore();
  for(const s of P.S){if(s.c==='shine'||s.c==='cheek')continue;inkStroke(x,s.p,s.c==='eye'?3:3.6,seed+s.id.length)}
  poly(x,by(P.S,'eye').p);x.fillStyle='#17140f';x.fill();
  const g=[];for(let i=0;i<=40;i++){const xx=i/40*W;g.push([xx,GY+4+Math.sin((xx+X)*.025)*4])}inkStroke(x,g,4,seed,false);
  for(let i=0;i<12;i++){const wx=i*130+30,sx=((wx-X)%1560+1560)%1560-40;if(sx<-40||sx>W+40)continue;for(let j=0;j<3;j++)inkStroke(x,[[sx+j*8,GY+4],[sx+j*8+(j-1)*6,GY-14-hs(i,j)*10]],2.4,seed+i+j,false)}
  for(let i=0;i<9;i++){const fx=PX-60-i*60-((t*V2)%60)+((Math.floor(t*V2/60)+i)%2)*10;if(fx<-20)continue;x.fillStyle='rgba(23,20,15,.55)';poly(x,ellP(fx,GY+16+((i%2)*8),9,4,0,12));x.fill()}
  x.save();x.globalCompositeOperation='multiply';[[520,250,16],[470,900,20]].forEach(([a,b,r],i)=>{x.fillStyle='rgba(23,20,15,.85)';poly(x,ellP(a,b,r,r*.8,i,18).map((q,j)=>[q[0]+(hs(j,i)-.5)*r*.5,q[1]+(hs(j+9,i)-.5)*r*.5]));x.fill()});x.restore();
  x.font='500 40px "TeX Gyre Chorus"';x.fillStyle='#17140f';x.fillText('a small walk',W-260,140);
}

/* ---------- 3D ---------- */
const R3=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,alpha:false});R3.setSize(W,H,false);R3.setPixelRatio(1);
R3.outputEncoding=THREE.sRGBEncoding;R3.toneMapping=THREE.ACESFilmicToneMapping;R3.toneMappingExposure=1.0;R3.shadowMap.enabled=true;R3.shadowMap.type=THREE.PCFSoftShadowMap;
const C3=c=>new THREE.Color(c).convertSRGBToLinear();
const V3=1.45;                                  // 3D world units / s
function cam(){const c=new THREE.PerspectiveCamera(26,W/H,.1,200);c.position.set(4.2,5.6,25.5);c.lookAt(.1,3.1,0);return c}
function penguin3(m){
  const g=new THREE.Group(),body=new THREE.Group();g.add(body);
  const S=(r,sx,sy,sz,mat,x,y,z)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,48,32),mat);o.scale.set(sx,sy,sz);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o};
  body.add(S(1,1.0,1.62,.95,m.body,0,1.62,0));
  body.add(S(1,.7,1.2,.74,m.belly,.5,1.42,.0));
  [-1,1].forEach(s=>{body.add(S(.15,1,1.1,.7,m.eye,.72,2.62,s*.32));body.add(S(.045,1,1,1,m.shine,.84,2.7,s*.36));body.add(S(.11,.7,.5,.4,m.cheek,.82,2.32,s*.48))});
  const beak=new THREE.Mesh(new THREE.ConeGeometry(.17,.48,24),m.beak);beak.rotation.z=-Math.PI/2;beak.position.set(1.12,2.5,0);beak.scale.z=.8;beak.castShadow=true;body.add(beak);
  const scarf=new THREE.Mesh(new THREE.TorusGeometry(.86,.2,20,48),m.scarf);scarf.rotation.x=Math.PI/2;scarf.position.y=2.12;scarf.scale.set(1.05,1.02,1.35);scarf.castShadow=true;body.add(scarf);
  const tailP=new THREE.Group();tailP.position.set(-.7,2.06,.45);body.add(tailP);const tail=new THREE.Mesh(new THREE.CapsuleGeometry(.17,.75,8,16),m.scarf);tail.scale.z=.45;tail.position.y=-.5;tail.castShadow=true;tailP.add(tail);
  const fl=[-1,1].map(s=>{const p=new THREE.Group();p.position.set(-.1,2.05,s*.92);const f=S(1,.2,.7,.12,m.body2,0,-.62,0);p.add(f);body.add(p);return p});
  const feet=[-1,1].map(s=>{const f=S(1,.4,.13,.27,m.feet,.2,.08,s*.42);g.add(f);return f});
  g.userData={body,tailP,fl,feet};g.rotation.y=-.55;return g;
}
function walk3(g,t){const ph=t*TAU*1.75,u=g.userData,sw=Math.sin(ph);
  u.body.rotation.x=sw*.075;u.body.position.y=Math.abs(sw)*.09;u.tailP.rotation.z=-1.05+Math.sin(ph*1.2)*.18;u.tailP.rotation.x=.2;
  u.fl.forEach((f,i)=>{f.rotation.x=(i?-1:1)*(.2+.12*Math.sin(ph))});
  u.feet[0].position.x=.2-sw*.32;u.feet[1].position.x=.2+sw*.32;u.feet[0].position.y=.08+Math.max(0,-Math.cos(ph))*.12;u.feet[1].position.y=.08+Math.max(0,Math.cos(ph))*.12}
function grad(top,bot){const T=new THREE.CanvasTexture((()=>{const c=mk(4,256),x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,top);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,4,256);return c})());T.encoding=THREE.sRGBEncoding;return T}
function keyLight(s,col,int,pos){const l=new THREE.DirectionalLight(col,int);l.position.set(...pos);l.castShadow=true;l.shadow.mapSize.set(1024,1024);Object.assign(l.shadow.camera,{left:-6,right:6,top:6,bottom:-3,near:1,far:40});l.shadow.radius=6;l.shadow.bias=-.0005;s.add(l);return l}
const NOISE=(()=>{const c=mk(256,256),x=c.getContext('2d'),r=mul(3);x.fillStyle='#808080';x.fillRect(0,0,256,256);for(let i=0;i<900;i++){x.strokeStyle=`rgba(${r()>.5?255:0},${r()>.5?255:0},${r()>.5?255:0},.08)`;x.lineWidth=1+r()*2;x.beginPath();x.arc(r()*256,r()*256,4+r()*14,0,TAU*r());x.stroke()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);return t})();

/* 4 Clay Toy */
const clay=(()=>{const s=new THREE.Scene(),c=cam();s.background=grad('#F9D3B4','#F2B48E');
  s.add(new THREE.HemisphereLight(0xfff1e6,0xd88a6a,.75));keyLight(s,0xfff4ea,1.25,[-4,9,7]);
  const M=(col,r=.85)=>new THREE.MeshStandardMaterial({color:C3(col),roughness:r,metalness:0,bumpMap:NOISE,bumpScale:.03});
  const m={body:M('#3E4A6B'),body2:M('#35405e'),belly:M('#FFF4E4'),eye:M('#151515',.4),shine:new THREE.MeshBasicMaterial({color:0xffffff}),cheek:M('#FF9DA6'),beak:M('#FF9F43'),feet:M('#FF9F43'),scarf:M('#E94F4F')};
  const p=penguin3(m);s.add(p);
  const wg=new THREE.Group();s.add(wg);const gr=new THREE.Mesh(new THREE.PlaneGeometry(80,30),M('#F4C29E',.95));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;gr.position.x=20;wg.add(gr);
  const r=mul(11);for(let i=0;i<16;i++){const x=-8+i*3.1+r()*1.2,z=-2.5-r()*4;if(r()>.45){const tr=new THREE.Group();const c1=new THREE.Mesh(new THREE.ConeGeometry(.6+r()*.3,1.6+r(),24),M(r()>.5?'#5FB389':'#79C59A'));c1.position.y=1.1;c1.castShadow=true;tr.add(c1);const tk=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.5,12),M('#9A6B4F'));tk.position.y=.2;tr.add(tk);tr.position.set(x,0,z);wg.add(tr)}else{const sm=new THREE.Mesh(new THREE.SphereGeometry(.9,32,20),M('#FFFAF3'));sm.scale.set(1.4,.5,1);sm.position.set(x,0,z+1.5);sm.castShadow=true;sm.receiveShadow=true;wg.add(sm)}}
  for(let i=0;i<14;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.12+r()*.1,16,12),M(['#FF9DA6','#FFD36E','#8FD3FF'][i%3]));b.position.set(-6+i*2.7,.1,1.6+r()*1.5);b.castShadow=true;wg.add(b)}
  return {s,c,draw(t){walk3(p,t);wg.position.x=-t*V3}};})();

/* 9 Brick Toy */
const brick=(()=>{const s=new THREE.Scene(),c=cam();s.background=grad('#9ED8FF','#D9F1FF');
  s.add(new THREE.HemisphereLight(0xffffff,0x88aa88,.8));keyLight(s,0xffffff,1.35,[-5,10,8]);
  const st=.2,box=new THREE.BoxGeometry(st*.96,st*.96,st*.96),stud=new THREE.CylinderGeometry(st*.3,st*.3,st*.22,14);
  const mat=new THREE.MeshStandardMaterial({roughness:.32,metalness:0});
  const col={k:'#22252e',w:'#F7F7F2',o:'#FF9A1F',r:'#E0312B',e:'#0d0d0d',p:'#FF8FA3'};
  function vox(fn,x0,x1,y0,y1,z0,z1){const L=[];for(let x=x0;x<=x1;x+=st)for(let y=y0;y<=y1;y+=st)for(let z=z0;z<=z1;z+=st){const v=fn(x,y,z);if(v)L.push([x,y,z,v])}
    const set=new Set(L.map(([x,y,z])=>[Math.round(x/st),Math.round(y/st),Math.round(z/st)].join()));const top=L.filter(([x,y,z])=>!set.has([Math.round(x/st),Math.round(y/st)+1,Math.round(z/st)].join()));
    const g=new THREE.Group(),A=new THREE.InstancedMesh(box,mat,L.length),Bm=new THREE.InstancedMesh(stud,mat,top.length),o=new THREE.Object3D();
    L.forEach(([x,y,z,v],i)=>{o.position.set(x,y,z);o.updateMatrix();A.setMatrixAt(i,o.matrix);A.setColorAt(i,C3(col[v]))});
    top.forEach(([x,y,z,v],i)=>{o.position.set(x,y+st*.55,z);o.updateMatrix();Bm.setMatrixAt(i,o.matrix);Bm.setColorAt(i,C3(col[v]))});
    [A,Bm].forEach(m=>{m.castShadow=m.receiveShadow=true;g.add(m)});return g}
  const E=(x,y,z,cx,cy,cz,rx,ry,rz)=>((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2<=1;
  const bodyF=(x,y,z)=>{if(!E(x,y,z,0,1.62,0,1.0,1.62,.95))return y>2.0&&y<2.4&&E(x,y,z,0,2.2,0,1.12,.3,1.1)?'r':null;
    if(y>2.0&&y<2.4)return 'r';if(Math.abs(z)>.15&&Math.abs(z)<.55&&y>2.4&&y<2.9&&x>.5)return (Math.abs(z)>.25&&Math.abs(z)<.45&&y>2.55&&y<2.75)?'e':'w';if(E(x,y,z,.36,1.42,0,.75,1.2,.72)&&x>.3)return 'w';return 'k'};
  const g=new THREE.Group(),body=new THREE.Group();g.add(body);body.add(vox(bodyF,-1.2,1.2,0.2,3.4,-1.2,1.2));
  body.add(vox((x,y,z)=>E(x,y,z,1.15,2.5,0,.3,.12,.14)?'o':null,.9,1.5,2.3,2.7,-.2,.2));
  const tailP=new THREE.Group();tailP.position.set(-.8,2.1,.5);tailP.add(vox((x,y,z)=>(Math.abs(x)<.12&&y>-1&&y<0&&Math.abs(z)<.1)?'r':null,-.2,.2,-1,0,-.2,.2));body.add(tailP);
  const fl=[-1,1].map(s=>{const p=new THREE.Group();p.position.set(-.1,2.0,s*1.0);p.add(vox((x,y,z)=>E(x,y,z,0,-.6,0,.22,.65,.1)?'k':null,-.3,.3,-1.3,0,-.2,.2));body.add(p);return p});
  const feet=[-1,1].map(s=>{const f=vox((x,y,z)=>E(x,y,z,0,0,0,.42,.1,.25)?'o':null,-.5,.5,0,0,-.3,.3);f.position.set(.2,.08,s*.42);g.add(f);return f});
  g.userData={body,tailP,fl,feet};g.rotation.y=-.55;s.add(g);
  const wg=new THREE.Group();s.add(wg);
  const base=new THREE.Mesh(new THREE.BoxGeometry(70,.2,26),new THREE.MeshStandardMaterial({color:C3('#3DAA4A'),roughness:.35}));base.position.set(25,-.1,3);base.receiveShadow=true;wg.add(base);
  const n=Math.floor(70/.4)*Math.floor(26/.4),studs=new THREE.InstancedMesh(new THREE.CylinderGeometry(.12,.12,.08,12),new THREE.MeshStandardMaterial({color:C3('#3DAA4A'),roughness:.35}),n),o=new THREE.Object3D();let i=0;
  for(let x=-10;x<60;x+=.4)for(let z=-9;z<16;z+=.4){if(i>=n)break;o.position.set(x,.04,z);o.updateMatrix();studs.setMatrixAt(i++,o.matrix)}studs.count=i;studs.receiveShadow=true;wg.add(studs);
  const r=mul(5);for(let k=0;k<12;k++){const x=-7+k*3.4,z=-3-r()*3,h=2+Math.floor(r()*4),cl=['r','w','o','p'][k%4];const tw=vox((X,Y,Z)=>Y<h*.4?(Y>h*.4-0.5&&k%2?'w':cl):null,-.4,.4,0,h*.4,-.4,.4);tw.position.set(x,.1,z);wg.add(tw)}
  return {s,c,draw(t){walk3(g,t);wg.position.x=-t*V3}};})();

/* 10 Moonlight 3D */
const moon=(()=>{const s=new THREE.Scene(),c=cam();s.background=grad('#0B1430','#24325C');s.fog=new THREE.FogExp2(0x1a2547,.028);
  s.add(new THREE.HemisphereLight(0x8fa8ff,0x1a2040,.35));const k=keyLight(s,0xbfd2ff,1.6,[-6,8,-4]);const f=new THREE.DirectionalLight(0xffd6a8,1.1);f.position.set(7,4,10);s.add(f);
  const m={body:new THREE.MeshPhysicalMaterial({color:C3('#15181f'),roughness:.38,clearcoat:.6,clearcoatRoughness:.3}),belly:new THREE.MeshPhysicalMaterial({color:C3('#E9EEF6'),roughness:.55,sheen:.5,sheenColor:new THREE.Color(0xffffff)}),
    eye:new THREE.MeshPhysicalMaterial({color:0x050505,roughness:.1,clearcoat:1}),shine:new THREE.MeshBasicMaterial({color:0xffffff}),cheek:new THREE.MeshStandardMaterial({color:C3('#ff8fa0'),roughness:.6,transparent:true,opacity:.6}),
    beak:new THREE.MeshPhysicalMaterial({color:C3('#F39C3D'),roughness:.35,clearcoat:.5}),scarf:new THREE.MeshPhysicalMaterial({color:C3('#C4302B'),roughness:.85,sheen:1,sheenRoughness:.5,sheenColor:new THREE.Color(0xff9a8a)})};
  m.body2=m.body;m.feet=m.beak;const p=penguin3(m);s.add(p);
  const mn=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture((()=>{const cc=mk(256,256),x=cc.getContext('2d'),g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'#fffbe8');g.addColorStop(.28,'#fff4cf');g.addColorStop(.3,'rgba(255,240,200,.35)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return cc})()),fog:false,transparent:true}));
  mn.scale.set(9,9,1);mn.position.set(-5,12,-30);s.add(mn);
  const wg=new THREE.Group();s.add(wg);const gg=new THREE.PlaneGeometry(90,40,180,80);gg.rotateX(-Math.PI/2);const pos=gg.attributes.position;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);pos.setY(i,(z<-4?.5:.12)*(Math.sin(x*.7)*Math.cos(z*.9)+.5*Math.sin(x*1.9+z*1.3))*(z<1&&z>-1.2?.15:1))}gg.computeVertexNormals();
  const gm=new THREE.Mesh(gg,new THREE.MeshStandardMaterial({color:C3('#DCE6FA'),roughness:.9}));gm.position.set(30,-.05,-6);gm.receiveShadow=true;wg.add(gm);
  const fpM=new THREE.MeshBasicMaterial({color:0x6b7ba8,transparent:true,opacity:.5}),fps=[];for(let i=0;i<60;i++){const fp=new THREE.Mesh(new THREE.CircleGeometry(.2,16),fpM);fp.rotation.x=-Math.PI/2;fp.scale.y=.6;fp.position.set(i*.415+.2,.03,(i%2?.42:-.42));wg.add(fp);fps.push(fp)}
  const r=mul(9);for(let i=0;i<10;i++){const tr=new THREE.Mesh(new THREE.ConeGeometry(.9,3.5,6),new THREE.MeshStandardMaterial({color:C3('#1d2e44'),roughness:.9}));tr.position.set(-6+i*5+r()*2,1.7,-7-r()*6);tr.castShadow=true;wg.add(tr)}
  const N=700,sp=new Float32Array(N*3),sd=[];for(let i=0;i<N;i++)sd.push([r()*16-8,r()*12,r()*10-6,.4+r()*.6]);
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
  const snowTex=new THREE.CanvasTexture((()=>{const cc=mk(32,32),x=cc.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return cc})());
  s.add(new THREE.Points(sg,new THREE.PointsMaterial({size:.13,map:snowTex,transparent:true,depthWrite:false,color:0xeaf2ff})));
  return {s,c,draw(t){walk3(p,t);wg.position.x=-t*V3;fps.forEach((fp,i)=>fp.visible=fp.position.x< t*V3-.3);
    for(let i=0;i<N;i++){const d=sd[i];sp[i*3]=((d[0]-t*.6*d[3]+8)%16+16)%16-8;sp[i*3+1]=((d[1]-t*1.1*d[3])%12+12)%12;sp[i*3+2]=d[2]}sg.attributes.position.needsUpdate=true}};})();

const S3={3:clay,8:brick,9:moon};
const STY=[sPixel,sChalk,sNeon,null,sComic,sPaper,sBlue,sInk,null,null];
const buf=Array.from({length:10},()=>mk(W,H)), cache={};
function renderStyle(i,t){const c=buf[i],x=c.getContext('2d');if(cache[i]===t)return c;cache[i]=t;
  x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.shadowColor='transparent';x.shadowBlur=0;x.shadowOffsetY=0;x.setLineDash([]);x.textAlign='left';
  if(S3[i]){S3[i].draw(t);R3.render(S3[i].s,S3[i].c);x.drawImage(R3.domElement,0,0)}else{x.clearRect(0,0,W,H);STY[i](x,t)}return c}

/* ---------- stage ---------- */
const cv=document.getElementById('cv'),X=cv.getContext('2d');
const BG=(()=>{const c=mk(1080,1920),x=c.getContext('2d');x.fillStyle='#F2EFE8';x.fillRect(0,0,1080,1920);
  x.fillStyle='rgba(40,30,20,.07)';for(let yy=0;yy<1920;yy+=26)for(let xx=(yy/26%2)*13;xx<1080;xx+=26){x.beginPath();x.arc(xx,yy,1.6,0,TAU);x.fill()}
  const g=x.createRadialGradient(540,900,300,540,900,1300);g.addColorStop(0,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(150,130,100,.12)');x.fillStyle=g;x.fillRect(0,0,1080,1920);return c})();
function rr(x,a,b,w,h,r){x.beginPath();x.roundRect(a,b,w,h,r)}
function cur(t){let i=0;for(let k=0;k<10;k++)if(t>=ST[k])i=k;return i}
function drawCard(t){
  const i=cur(t),p=i>0?eIO((t-ST[i])/WIPE):1, bump=i>0?Math.sin(clamp((t-ST[i])/.3)*Math.PI)*.012:0;
  const intro=eOut(t/.5), s=(.94+.06*intro)*(1+bump), a=intro;
  const {x:cx,y:cy,w,h,r}=CARD;X.save();X.globalAlpha=a;X.translate(cx+w/2,cy+h/2);X.scale(s,s);X.translate(-w/2,-h/2);
  X.shadowColor='rgba(40,30,20,.28)';X.shadowBlur=60;X.shadowOffsetY=26;rr(X,0,0,w,h,r);X.fillStyle='#111';X.fill();X.shadowColor='transparent';
  X.save();rr(X,0,0,w,h,r);X.clip();
  if(p<1&&i>0){X.drawImage(renderStyle(i-1,t),0,0)}
  const edge=lerp(-90,w+90,p);X.save();if(p<1){X.beginPath();X.moveTo(0,0);X.lineTo(edge+70,0);X.lineTo(edge-70,h);X.lineTo(0,h);X.closePath();X.clip()}X.drawImage(renderStyle(i,t),0,0);X.restore();
  if(p<1){X.strokeStyle='#fff';X.lineWidth=7;X.shadowColor='rgba(0,0,0,.35)';X.shadowBlur=18;X.beginPath();X.moveTo(edge+70,0);X.lineTo(edge-70,h);X.stroke();X.shadowColor='transparent'}
  X.restore();
  X.fillStyle='rgba(0,0,0,.55)';rr(X,22,22,96,46,23);X.fill();X.fillStyle='#fff';X.font='700 26px ID';X.textAlign='center';X.fillText(String(i+1).padStart(2,'0')+'/10',70,54);X.textAlign='left';
  X.restore();
}
function drawGrid(t){
  const k=t-CTA,{x:cx,y:cy,w,h,r}=CARD,cols=2,rows=5,g=12,tw=(w-g)/cols,th=(h-g*(rows-1))/rows;
  X.save();X.shadowColor='rgba(40,30,20,.28)';X.shadowBlur=60;X.shadowOffsetY=26;rr(X,cx,cy,w,h,r);X.fillStyle='#16151a';X.fill();X.restore();
  X.save();rr(X,cx,cy,w,h,r);X.clip();
  const fullA=1-eOut(k/.25);if(fullA>0.01){X.globalAlpha=fullA;X.drawImage(renderStyle(9,t),cx,cy);X.globalAlpha=1}
  for(let i=0;i<10;i++){const d=k-.04*i;if(d<=0)continue;const e=eOut(d/.45),sc=.7+.3*back(d/.5);const col=i%2,row=i/2|0,tx=cx+col*(tw+g),ty=cy+row*(th+g);
    X.save();X.globalAlpha=clamp(d/.15);X.translate(tx+tw/2,ty+th/2);X.scale(sc,sc);rr(X,-tw/2,-th/2,tw,th,18);X.clip();
    const sh=W*th/tw;X.drawImage(renderStyle(i,t),0,GY-sh*.82,W,sh,-tw/2,-th/2,tw,th);
    X.fillStyle='rgba(0,0,0,.6)';rr(X,-tw/2+10,-th/2+10,48,30,15);X.fill();X.fillStyle='#fff';X.font='700 18px ID';X.textAlign='center';X.fillText(String(i+1).padStart(2,'0'),-tw/2+34,-th/2+31);X.textAlign='left';X.restore()}
  X.restore();
}
function drawTitle(t){
  X.textAlign='center';X.textBaseline='alphabetic';
  const w1=eOut((t-0)/.45),w2=eOut((t-.12)/.45),w3=eOut((t-.24)/.45);
  X.font='700 108px ID';const a='10 ',b='Claude';X.font='700 108px ID';const wa=X.measureText(a).width;X.font='700 108px IDI';const wb=X.measureText(b).width;const x0=540-(wa+wb)/2;
  X.globalAlpha=w1;X.textAlign='left';X.font='700 108px ID';X.fillStyle='#16151a';X.fillText(a,x0,185+40*(1-w1));X.font='700 108px IDI';X.fillStyle='#D97757';X.fillText(b,x0+wa,185+40*(1-w2));
  X.textAlign='center';X.globalAlpha=w2;X.font='700 108px ID';X.fillStyle='#16151a';X.fillText('animation styles',540,300+40*(1-w2));
  X.globalAlpha=w3;X.font='500 34px ID';X.fillStyle='#8d877c';X.fillText('same penguin · same prompt idea · 10 looks',540,362+20*(1-w3));X.globalAlpha=1;X.textAlign='left';
}
function drawList(t){
  const i=cur(t),y0=CARD.y+58,dy=(CARD.h-110)/9;
  for(let k=0;k<10;k++){const y=y0+k*dy,on=t>=ST[k],isC=on&&k===i&&t<CTA;const app=eOut((t-.1-k*.03)/.4);
    X.globalAlpha=app;X.font='600 28px "DejaVu Sans Mono"';X.fillStyle=on?(isC?'#D97757':'#a39d92'):'#c9c3b8';X.fillText(String(k+1).padStart(2,'0'),46,y);
    if(on){const r=eOut((t-ST[k])/.3);X.save();X.beginPath();X.rect(96,y-44,320*r+2,64);X.clip();X.font=isC?'700 38px ID':'600 36px ID';X.fillStyle=isC?'#16151a':'#9a948a';X.fillText(NAMES[k],100,y+(isC?2:0));X.restore();
      if(isC){X.fillStyle='#D97757';rr(X,30-10*(1-r),y-30,6,40,3);X.fill()}}
    else{X.fillStyle='#ddd7cc';rr(X,100,y-14,70+hs(k,1)*60,8,4);X.fill()}
    X.globalAlpha=1}
}
function drawBottom(t){
  const k=eOut((t-CTA-.25)/.5),y=1590;
  X.globalAlpha=1-clamp((t-CTA)/.2);X.textAlign='center';X.font='500 32px ID';X.fillStyle='#8d877c';X.fillText('every frame drawn in code',540,y+12);X.globalAlpha=1;
  if(k>0){X.save();X.globalAlpha=clamp(k*1.5);X.translate(0,40*(1-k));const txt1='Comment ',txt2='“PENGUIN”',txt3=' for all 10 prompts';X.font='700 42px ID';const w1=X.measureText(txt1).width,w2=X.measureText(txt2).width,w3=X.measureText(txt3).width,tw=w1+w2+w3,px=540-tw/2;
    X.fillStyle='#16151a';rr(X,px-40,y-48,tw+80,92,46);X.fill();X.textAlign='left';X.fillStyle='#fff';X.fillText(txt1,px,y+14);X.fillStyle='#FF9A6B';X.fillText(txt2,px+w1,y+14);X.fillStyle='#fff';X.fillText(txt3,px+w1+w2,y+14);X.restore()}
  X.textAlign='left';
}
window.setT=function(t){
  for(const k in cache)delete cache[k];
  X.setTransform(1,0,0,1,0,0);X.drawImage(BG,0,0);
  drawTitle(t);drawList(t);if(t<CTA)drawCard(t);else drawGrid(t);drawBottom(t);
};
document.fonts.load('700 30px ID').then(()=>Promise.all(['600 30px ID','500 30px ID','900 30px ID','700 30px IDI','900 30px IDI','28px "DejaVu Sans Mono"','600 30px Poppins','40px "TeX Gyre Chorus"'].map(f=>document.fonts.load(f)))).then(()=>{
  const q=new URLSearchParams(location.search);if(q.has('t'))window.setT(+q.get('t'));window.READY=true});
