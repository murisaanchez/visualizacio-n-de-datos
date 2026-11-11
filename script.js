// Una figura por esquina · anillos = 10 salidas a terreno · porciones = minutos 1-10
// Burbujas = personas esperando · puntos = peatones · picos de latido = micros que pasan
const COL={E1:'#5ad1ff',E3:'#ff5fb0',E4:'#4be08a'},NM=10,TAU=Math.PI*2,GAP=.012;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,rnd=Math.random;
const g=(x,c,s)=>Math.exp(-((x-c)**2)/(2*s*s));
const ecg=x=>.12*g(x,.15,.035)-.18*g(x,.33,.012)+g(x,.38,.013)-.42*g(x,.435,.015)+.22*g(x,.7,.05); // forma de un latido
function figure(root){
  const e=root.dataset.e,col=COL[e],S=DATA[e],ND=S.length,cv=root.querySelector('canvas'),ctx=cv.getContext('2d'),tip=root.querySelector('.tip');
  let W,H,dpr,cx,cy,R0,ringW,bw,sway=0,bob=0,mouse=null;const ph0=rnd()*10,B=[],D=[],E=[],parts=[];
  const size=()=>{dpr=Math.min(devicePixelRatio||1,2);const b=cv.getBoundingClientRect();W=b.width;H=b.height;cv.width=W*dpr;cv.height=H*dpr;cx=W/2;cy=H/2;const s=Math.min(W,H);R0=s*.14;ringW=(s*.445-R0)/ND;bw=ringW*.8};
  const cell=(k,m)=>{const r1=R0+k*ringW+ringW*.1,a1=-Math.PI/2+m*TAU/NM+GAP;return{r1,a1,a2:a1+TAU/NM-2*GAP}};
  S.forEach((d,k)=>{for(let m=0;m<NM;m++){
    for(let i=0;i<(d.w?d.w[m]:0);i++)B.push({k,m,f:rnd(),u:rnd(),ph:rnd()*TAU,sp:.35+rnd()*.5,hide:0});
    for(let i=0;i<Math.min(d.p?d.p[m]||0:0,40);i++)D.push({k,m,f:rnd(),u:rnd(),v:(.03+rnd()*.05)*(rnd()<.5?-1:1)});
    const n=d.m?d.m[m]:0;for(let i=0;i<n;i++)E.push({k,m,i,n})}});
  const posB=(b,t)=>{const c=cell(b.k,b.m),f=.1+.8*b.f+.05*Math.sin(t*b.sp+b.ph),u=.15+.7*b.u+.06*Math.cos(t*b.sp*.8+b.ph),a=c.a1+f*(c.a2-c.a1),r=c.r1+u*bw;return[r*Math.cos(a),r*Math.sin(a)]};
  const posD=(d,t)=>{const c=cell(d.k,d.m),f=(((d.f+d.v*t)%1)+1)%1,a=c.a1+f*(c.a2-c.a1),r=c.r1+(.12+.76*d.u)*bw;return[r*Math.cos(a),r*Math.sin(a)]};
  const pop=(b,ms)=>{b.hide=ms+2800;const[x,y]=posB(b,reduce?0:ms/1000);for(let i=0;i<9;i++){const a=rnd()*TAU,s=18+rnd()*38;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1})}};
  function frame(ms){const t=reduce?0:ms/1000;sway=reduce?0:.04*Math.sin(t*.12+ph0);bob=reduce?0:5*Math.sin(t*.5+ph0);
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.translate(cx,cy+bob);ctx.rotate(sway);
    ctx.globalCompositeOperation='source-over';ctx.lineWidth=1;ctx.font='9px "IBM Plex Mono",monospace';const out=R0+ND*ringW;
    // anillos: cada salida es una banda visible, separada de la siguiente
    for(let k=0;k<ND;k++){const r1=R0+k*ringW+ringW*.1,r2=r1+bw;
      ctx.fillStyle=`rgba(255,255,255,${k%2?.06:.03})`;ctx.beginPath();ctx.arc(0,0,r2,0,TAU);ctx.arc(0,0,r1,0,TAU,true);ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.arc(0,0,r1,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(0,0,r2,0,TAU);ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,.13)';ctx.beginPath();for(let m=0;m<NM;m++){const a=-Math.PI/2+m*TAU/NM;ctx.moveTo(r1*Math.cos(a),r1*Math.sin(a));ctx.lineTo(r2*Math.cos(a),r2*Math.sin(a))}ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.55)';ctx.textAlign='right';ctx.fillText('SALIDA '+(k+1),-5,-(r1+bw/2)+3)}
    ctx.fillStyle='rgba(255,255,255,.5)';ctx.textAlign='center';
    for(let m=0;m<NM;m++){const am=-Math.PI/2+(m+.5)*TAU/NM;ctx.fillText(m+1,(out+14)*Math.cos(am),(out+14)*Math.sin(am)+3)}
    ctx.fillStyle=col;ctx.font='700 26px "Space Grotesk",sans-serif';ctx.fillText(e,0,9);
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle=col;
    S.forEach((d,k)=>{const rm=R0+k*ringW+ringW*.1+bw/2;ctx.globalAlpha=.3;ctx.lineWidth=1;ctx.setLineDash(d.m?[]:[2,6]);ctx.beginPath();ctx.arc(0,0,rm,0,TAU);ctx.stroke();ctx.setLineDash([]);
      if(d.m){const ha=-Math.PI/2+(t*.35+k*1.7+ph0)%TAU;ctx.globalAlpha=.9;ctx.fillStyle=col;ctx.beginPath();ctx.arc(rm*Math.cos(ha),rm*Math.sin(ha),2.2,0,TAU);ctx.fill()}});
    E.forEach(p=>{const c=cell(p.k,p.m),rm=c.r1+bw/2,fw=Math.min(.34,.9/p.n),fs=(p.i+.5)/p.n-fw/2,
      rel=(p.m+(p.i+.5)/p.n)*TAU/NM,dl=((t*.35+p.k*1.7+ph0)%TAU-rel+TAU)%TAU,gl=dl<1.4?1-dl/1.4:0;
      ctx.beginPath();for(let s=0;s<=36;s++){const x=s/36,a=c.a1+(fs+x*fw)*(c.a2-c.a1),r=rm+bw*.46*ecg(x);s?ctx.lineTo(r*Math.cos(a),r*Math.sin(a)):ctx.moveTo(r*Math.cos(a),r*Math.sin(a))}
      ctx.lineWidth=3.5;ctx.globalAlpha=(.1+.25*gl);ctx.stroke();ctx.lineWidth=1.4;ctx.globalAlpha=.4+.6*gl;ctx.stroke()});
    ctx.fillStyle=col;ctx.globalAlpha=.65;D.forEach(d=>{const[x,y]=posD(d,t);ctx.fillRect(x-.7,y-.7,1.5,1.5)});
    const rb=Math.max(2.4,bw*.14);
    B.forEach(b=>{if(ms<b.hide)return;const s=Math.min(1,(ms-b.hide)/900),[x,y]=posB(b,t);ctx.globalAlpha=.9;ctx.fillStyle=col+'38';ctx.strokeStyle=col;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x,y,rb*s,0,TAU);ctx.fill();ctx.stroke()});
    ctx.fillStyle=col;for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.x+=q.vx*.016;q.y+=q.vy*.016;q.l-=.025;if(q.l<=0){parts.splice(i,1);continue}ctx.globalAlpha=q.l;ctx.beginPath();ctx.arc(q.x,q.y,1.6,0,TAU);ctx.fill()}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    if(mouse)B.forEach(b=>{if(ms<b.hide)return;const[x,y]=posB(b,t);if(Math.hypot(x-mouse.x,y-mouse.y)<18)pop(b,ms)});
    requestAnimationFrame(frame)}
  const local=ev=>{const b=cv.getBoundingClientRect(),x=ev.clientX-b.left-cx,y=ev.clientY-b.top-cy-bob,c=Math.cos(-sway),s=Math.sin(-sway);return{x:x*c-y*s,y:x*s+y*c,px:ev.clientX-b.left,py:ev.clientY-b.top}};
  const hit=p=>{const r=Math.hypot(p.x,p.y);if(r<R0||r>=R0+ND*ringW)return null;return{k:Math.floor((r-R0)/ringW),m:Math.floor((((Math.atan2(p.y,p.x)+Math.PI/2)%TAU)+TAU)%TAU/(TAU/NM))}};
  const show=(h,p)=>{const d=S[h.k];let s=`<b style="color:${col}">${e}</b> · salida ${h.k+1} · minuto ${h.m+1}<br>`;
    s+=d.p?`peatones: ${d.p[h.m]}<small> · ${d.dp}, ${d.hp}</small><br>`:'peatones: sin registro<br>';
    s+=d.w?`esperando: ${d.w[h.m]}<br>micros que pasan: ${d.m[h.m]}<br>suben: ${d.s[h.m]}<small> · ${d.dt}, ${d.ht}</small>`:'espera y micros: sin registro';
    tip.innerHTML=s;tip.hidden=false;tip.style.left=Math.min(p.px+14,W-250)+'px';tip.style.top=Math.max(p.py-10,4)+'px'};
  cv.addEventListener('pointermove',ev=>{const p=local(ev);mouse={x:p.x,y:p.y};const h=hit(p);h?show(h,p):tip.hidden=true});
  cv.addEventListener('pointerleave',()=>{mouse=null;tip.hidden=true});
  cv.addEventListener('pointerdown',ev=>{const p=local(ev);mouse={x:p.x,y:p.y};const h=hit(p);if(h){B.forEach(b=>{if(b.k==h.k&&b.m==h.m&&performance.now()>=b.hide)pop(b,performance.now())});show(h,p)}});
  addEventListener('resize',size);size();requestAnimationFrame(frame);
  return{B,D,E}
}
document.querySelectorAll('.fig').forEach(figure);