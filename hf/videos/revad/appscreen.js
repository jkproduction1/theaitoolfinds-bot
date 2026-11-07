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
