// Custom Cursor
const dot=document.getElementById('curdot'), ring=document.getElementById('curring'), glow=document.getElementById('curglow');
let mx=window.innerWidth/2, my=window.innerHeight/2;
let tx=mx, ty=my;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
function loop(){
  tx+=(mx-tx)*0.2; ty+=(my-ty)*0.2;
  if(dot) dot.style.transform=`translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  if(ring) ring.style.transform=`translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
  if(glow) glow.style.transform=`translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

document.querySelectorAll('a, button, .chip, .pcard').forEach(el=>{
  el.addEventListener('mouseenter',()=>{if(ring)ring.style.width='44px',ring.style.height='44px',ring.style.borderColor='rgba(0,212,255,0.8)'});
  el.addEventListener('mouseleave',()=>{if(ring)ring.style.width='28px',ring.style.height='28px',ring.style.borderColor='rgba(0,212,255,0.5)'});
});

// Loader & Boot Sequence
window.addEventListener('load', ()=>{
  const boot=document.getElementById('lboot'), wrap=document.getElementById('lnamewrap'), prog=document.getElementById('lprog');
  const fill=document.getElementById('lfill'), pct=document.getElementById('lpct'), sts=document.getElementById('lstatus');
  if(!boot) return;
  const msgs=[
    "INITIALIZING SYSTEM...", "KERNEL LOADED.", "MOUNTING VIRTUAL DRIVES...",
    "ESTABLISHING SECURE CONNECTION...", "HANDSHAKE SUCCESSFUL.",
    "LOADING ACCESS PROTOCOLS...", "ACCESS GRANTED."
  ];
  let i=0;
  const intv=setInterval(()=>{
    if(i<msgs.length){
      const l=document.createElement('div');
      l.className='lline';
      l.innerHTML=`[SYS] ${msgs[i]}`;
      boot.insertBefore(l, document.getElementById('lblink'));
      setTimeout(()=>l.classList.add('v'),50);
      i++;
    } else {
      clearInterval(intv);
      setTimeout(()=>{
        boot.style.display='none';
        wrap.classList.add('v');
        prog.classList.add('v');
        let p=0;
        const pintv=setInterval(()=>{
          p+=Math.random()*15;
          if(p>=100){
            p=100;
            clearInterval(pintv);
            sts.innerText="SYSTEM READY.";
            setTimeout(()=>{
              document.getElementById('loader').style.animation='exitGlitch 0.6s forwards';
              setTimeout(()=>document.getElementById('loader').style.display='none',600);
            }, 500);
          }
          fill.style.width=`${p}%`;
          pct.innerText=`${Math.floor(p)}%`;
        }, 100);
      }, 800);
    }
  }, 250);
});

// Neural Canvas
const cn=document.getElementById('ncanvas');
if(cn){
  const ctx=cn.getContext('2d');
  let w,h,pts=[];
  function rsz(){w=cn.width=window.innerWidth;h=cn.height=window.innerHeight;}
  window.addEventListener('resize',rsz);
  rsz();
  for(let i=0;i<60;i++) pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*0.5,vy:(Math.random()-.5)*0.5});
  
  function draw(){
    ctx.clearRect(0,0,w,h);
    
    pts.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      
      // Calculate distance from cursor
      let dx = mx - p.x;
      let dy = my - p.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      
      // Attract dots that are close to the cursor
      if(dist < 180) {
        let force = (180 - dist) / 180; // stronger the closer it is
        p.x += (dx / dist) * force * 1.5;
        p.y += (dy / dist) * force * 1.5;
      }
      
      // Screen bounds bouncing
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;

      ctx.fillStyle='rgba(0,212,255,0.2)';
      ctx.beginPath(); ctx.arc(p.x,p.y,1.5,0,Math.PI*2); ctx.fill();
    });

    // Draw lines between nodes, treating the mouse as a node too
    let allPts = [...pts, {x: mx, y: my}];
    for(let i=0;i<allPts.length;i++){
      for(let j=i+1;j<allPts.length;j++){
        const d=Math.hypot(allPts[i].x-allPts[j].x, allPts[i].y-allPts[j].y);
        if(d<120){
          ctx.strokeStyle=`rgba(0,212,255,${(120-d)/120*0.15})`;
          ctx.beginPath(); ctx.moveTo(allPts[i].x,allPts[i].y); ctx.lineTo(allPts[j].x,allPts[j].y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Nav scroll effect
window.addEventListener('scroll',()=>{
  document.getElementById('mainnav').classList.toggle('sc',window.scrollY>30);
});

// Mobile menu
function togHam(){document.getElementById('mobmenu').classList.toggle('on')}
function clsHam(){document.getElementById('mobmenu').classList.remove('on')}

// Reveal on scroll
const rvObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');rvObs.unobserve(e.target)}});
},{threshold:0.13});
document.querySelectorAll('.rv').forEach(el=>rvObs.observe(el));

// Skill bars animation
const skObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.skfill').forEach(b=>{b.style.width=b.dataset.w+'%'});
      skObs.unobserve(e.target);
    }
  });
},{threshold:0.2});
const skEl=document.getElementById('skbars');
if(skEl) skObs.observe(skEl);

// Download CV
function dlCV(){
  const a=document.createElement('a');
  a.href='mehre_cv.pdf';
  a.download='Shaik_Mehre_Nigaar_CV.pdf';
  a.click();
}

// Contact form
function subForm(){
  const n=document.getElementById('fn').value;
  const e=document.getElementById('fe').value;
  const m=document.getElementById('fm').value;
  if(!n||!e||!m){alert('Please fill all fields');return}
  document.getElementById('fok').classList.add('on');
  document.getElementById('fn').value='';
  document.getElementById('fe').value='';
  document.getElementById('fm').value='';
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',(e)=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'})}
  });
});
