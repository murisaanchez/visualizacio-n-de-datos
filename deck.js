// Diapositivas: avanzan con las interacciones (o con las flechas / botones)
const sl=[...document.querySelectorAll('.slide')],dots=document.getElementById('dots');let cur=0;
sl.forEach(()=>dots.appendChild(document.createElement('i')));
function go(n){cur=Math.max(0,Math.min(sl.length-1,n));sl.forEach((s,i)=>s.classList.toggle('on',i==cur));[...dots.children].forEach((d,i)=>d.classList.toggle('on',i==cur));
  document.getElementById('skip').style.visibility=cur<5?'visible':'hidden';if(cur==1)bub.start();window.dispatchEvent(new Event('resize'))}
document.getElementById('prev').onclick=()=>go(cur-1);document.getElementById('next').onclick=()=>go(cur+1);
document.getElementById('skip').onclick=()=>go(5);document.getElementById('go').onclick=()=>go(5);
addEventListener('keydown',e=>{if(e.key=='ArrowRight'||e.key=='PageDown')go(cur+1);if(e.key=='ArrowLeft'||e.key=='PageUp')go(cur-1)});
// 1 · el latido
document.getElementById('beat').onclick=e=>{const p=document.getElementById('ecgp');p.style.animation='none';p.style.strokeDashoffset=0;e.target.textContent='…';setTimeout(()=>go(1),650)};
// 2 · explota 6 burbujas
const bub=(()=>{const cv=document.getElementById('bubbles'),ctx=cv.getContext('2d'),C=['#5ad1ff','#ff5fb0','#4be08a'];let W,H,B=[],P=[],n=0,run=false,m=null;
  const size=()=>{const b=cv.getBoundingClientRect();W=cv.width=b.width;H=cv.height=b.height};
  const mk=()=>({x:Math.random()*W,y:Math.random()*H,r:10+Math.random()*16,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,c:C[Math.random()*3|0]});
  const pop=b=>{for(let i=0;i<10;i++){const a=Math.random()*6.28,s=1+Math.random()*2.5;P.push({x:b.x,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,c:b.c})}
    Object.assign(b,mk(),{x:Math.random()*W,y:Math.random()*H});n++;document.getElementById('c1').textContent=Math.min(n,6);if(n==6){document.getElementById('h1').textContent='Listo. Sigue →';setTimeout(()=>go(2),900)}};
  function f(){if(!run)return;ctx.clearRect(0,0,W,H);B.forEach(b=>{b.x+=b.vx;b.y+=b.vy;if(b.x<0||b.x>W)b.vx*=-1;if(b.y<0||b.y>H)b.vy*=-1;
    if(m&&n<6&&Math.hypot(b.x-m.x,b.y-m.y)<b.r+6)pop(b);ctx.strokeStyle=b.c;ctx.fillStyle=b.c+'33';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,6.28);ctx.fill();ctx.stroke()});
    P=P.filter(q=>(q.x+=q.vx,q.y+=q.vy,q.l-=.03)>0||q.l>0);P.forEach(q=>{ctx.globalAlpha=Math.max(q.l,0);ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(q.x,q.y,2,0,6.28);ctx.fill()});ctx.globalAlpha=1;requestAnimationFrame(f)}
  cv.addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();m={x:e.clientX-b.left,y:e.clientY-b.top}});cv.addEventListener('pointerdown',e=>{const b=cv.getBoundingClientRect();m={x:e.clientX-b.left,y:e.clientY-b.top}});
  addEventListener('resize',size);
  return{start(){if(run)return;size();B=Array.from({length:22},mk);run=true;f()}}})();
document.querySelector('#bubbles').style.pointerEvents='auto';
// 3 · toca el pulso 3 veces
let t2=0;document.getElementById('pulse').onclick=e=>{const b=e.currentTarget;b.classList.remove('go');void b.offsetWidth;b.classList.add('go');t2++;document.getElementById('c2').textContent=Math.min(t2,3);if(t2==3){document.getElementById('h2').textContent='Listo. Sigue →';setTimeout(()=>go(3),900)}};
// 4 · tarjetas del trabajo en grupo
document.querySelectorAll('#cards .card').forEach(c=>c.onclick=()=>{c.classList.add('on');const k=document.querySelectorAll('#cards .on').length;document.getElementById('c3').textContent=k;if(k==4){document.getElementById('h3').textContent='Listo. Sigue →';setTimeout(()=>go(4),1100)}});
go(0);