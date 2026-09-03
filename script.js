const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
    else entry.target.classList.remove('visible');
  });
}, { threshold: 0.14 });
revealItems.forEach((item) => observer.observe(item));

function setupScrollCarousel(sectionSelector, slideSelector, progressSelector, direction) {
  const section = document.querySelector(sectionSelector);
  const slides = [...document.querySelectorAll(slideSelector)];
  const progressBar = document.querySelector(progressSelector);
  if (!section || !slides.length) return;
  const isPeople = sectionSelector === '.people-scroll';
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  if (isPeople) {
    const vhPerCandidate = window.innerWidth <= 950 ? 400 : 360;
    section.style.height = `${Math.max(2400, slides.length * vhPerCandidate)}vh`;
  }
  if (sectionSelector === '.priority-scroll') section.style.height = '1200vh';
  if (progressBar) progressBar.style.width = '100%';

  function fitCandidateName(copy) {
    if (!copy) return;
    const name = copy.querySelector('h3');
    if (!name) return;
    name.style.fontSize = '';
    name.style.whiteSpace = 'nowrap';
    const maxSize = parseFloat(getComputedStyle(name).fontSize);
    const minSize = window.innerWidth <= 520 ? 25 : window.innerWidth <= 950 ? 28 : 38;
    const available = Math.max(1, copy.clientWidth);
    let size = maxSize;
    while (name.scrollWidth > available && size > minSize) {
      size -= 0.5;
      name.style.fontSize = `${size}px`;
    }
  }

  function fitAllCandidateNames() {
    if (!isPeople) return;
    slides.forEach(slide => fitCandidateName(slide.querySelector('.person-info')));
  }

  function update() {
    const rect = section.getBoundingClientRect();
    const travel = section.offsetHeight - window.innerHeight;
    const progress = clamp(travel > 0 ? -rect.top / travel : 0);

    if (isPeople) {
      const totalScenes = slides.length;
      const scene = progress * totalScenes;
      slides.forEach((slide, index) => {
        const copy = slide.querySelector('.person-info');
        const art = slide.querySelector('.person-art');
        const t = scene - index;
        if (t < -0.30 || t > 1.80) {
          const off = t < 0 ? 120 : -120;
          slide.style.transform = `translate3d(${off}%,0,0) scale(0.52)`;
          slide.style.opacity = '0';
          slide.style.pointerEvents = 'none';
          if (copy) { copy.style.opacity = '0'; copy.style.clipPath = 'inset(0 0 100% 0)'; }
          return;
        }
        let x = 0, scale = 1, slideOpacity = 1, textProgress = 0, textOpacity = 0;
        if (t < 0.30) {
          const p = clamp(t / 0.30); x = 100 * (1 - p); scale = 0.52 + 0.48 * p; slideOpacity = p;
        } else if (t < 0.56) {
          x = 0; scale = 1;
        } else if (t < 0.94) {
          x = 0; scale = 1; textProgress = clamp((t - 0.56) / 0.38); textOpacity = textProgress;
        } else if (t < 1.20) {
          x = 0; scale = 1; textProgress = 1; textOpacity = 1;
        } else if (t < 1.62) {
          const p = clamp((t - 1.20) / 0.42); x = -100 * p; scale = 1 - 0.10 * p; textProgress = 1; textOpacity = 1;
        } else {
          const p = clamp((t - 1.62) / 0.18); x = -100; scale = 0.90; textProgress = 1; textOpacity = 1 - p; slideOpacity = 1 - p * 0.30;
        }
        slide.style.transform = `translate3d(${x}%,0,0) scale(${scale})`;
        slide.style.opacity = String(slideOpacity);
        slide.style.pointerEvents = x === 0 ? 'auto' : 'none';
        if (copy) {
          copy.style.opacity = String(textOpacity);
          copy.style.transform = `translate3d(0,${(1 - textProgress) * 26}px,0)`;
          copy.style.clipPath = `inset(0 0 ${(1 - textProgress) * 100}% 0)`;
        }
        if (art) art.style.transform = 'scale(1)';
      });
    } else {
      const carouselLength = Math.max(0, slides.length - 1);
      const position = progress * carouselLength;
      slides.forEach((slide, index) => {
        const distance = index - position;
        const absDistance = Math.abs(distance);
        const normalized = Math.min(absDistance, 1);
        const scale = 0.68 + (1 - normalized) * 0.32;
        const opacity = Math.max(0, 1 - normalized * 0.72);
        const x = distance * 100;
        const copy = slide.querySelector('.priority-copy');
        const art = slide.querySelector('.priority-art');
        slide.style.transform = `translate3d(${x}%,0,0) scale(${scale})`;
        slide.style.opacity = String(opacity);
        slide.style.pointerEvents = absDistance < 0.5 ? 'auto' : 'none';
        if (copy) { copy.style.opacity = String(Math.max(0, 1 - normalized * 0.9)); copy.style.transform = 'translate3d(0,0,0)'; copy.style.clipPath = 'none'; }
        if (art) art.style.transform = `scale(${0.94 + (1 - normalized) * 0.06})`;
      });
    }
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    section.classList.toggle('is-finished', progress > 0.985);
  }
  fitAllCandidateNames();
  update();
  return update;
}

let ticking = false;
const updatePriority = setupScrollCarousel('.priority-scroll', '.priority-slide', '.priority-progress span', 'rtl');
const updatePeople = setupScrollCarousel('.people-scroll', '.person-slide', '.people-progress span', 'rtl');
function onScroll() {
  if (ticking) return;
  window.requestAnimationFrame(() => { updatePriority?.(); updatePeople?.(); ticking = false; });
  ticking = true;
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('mobile-open', !open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('mobile-open');
}));

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
const brand = document.querySelector('.brand');
brand?.addEventListener('click', (event) => { event.preventDefault(); scrollToTop(); });

if (nav && !nav.querySelector('.back-to-top')) {
  const backToTop = document.createElement('a');
  backToTop.className = 'back-to-top';
  backToTop.href = '#top';
  backToTop.setAttribute('aria-label', 'Zpět nahoru');
  backToTop.setAttribute('title', 'Zpět nahoru');
  backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
  nav.appendChild(backToTop);
  backToTop.addEventListener('click', (event) => {
    event.preventDefault(); scrollToTop(); menuButton?.setAttribute('aria-expanded', 'false'); nav.classList.remove('mobile-open');
  });
}

if (!document.querySelector('#back-to-top-style')) {
  const style = document.createElement('style');
  style.id = 'back-to-top-style';
  style.textContent = `
    .desktop-nav .back-to-top{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;margin-left:2px;margin-top:-1px;border:1px solid #111;border-radius:50%;font-size:20px;line-height:1;letter-spacing:0;transition:background .2s,color .2s,transform .2s}
    .desktop-nav .back-to-top:after{display:none}
    .desktop-nav .back-to-top:hover{background:var(--yellow);transform:translateY(-2px)}
    @media(max-width:950px){.desktop-nav .back-to-top{width:34px;height:34px;margin:8px 0 2px;font-size:20px}}
  `;
  document.head.appendChild(style);
}

/* INTERACTIVE PROGRAM BOOK */
(function setupProgramBook(){
  const program=document.querySelector('#program'),trigger=program?.querySelector('.text-link');
  if(!program||!trigger||document.querySelector('#program-book-modal'))return;
  const pages=['assets/program_lomnice.png',...Array.from({length:12},(_,i)=>`assets/program/${String(i+1).padStart(2,'0')}.png`)];
  const modal=document.createElement('div');modal.id='program-book-modal';modal.className='program-book-modal';modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`<div class="program-book-backdrop"></div><div class="program-book-dialog" role="dialog" aria-modal="true" aria-label="Náš program"><div class="program-book-top"><div><p class="eyebrow">Z:LOMNICE / PROGRAM</p><h2>Náš program.</h2></div><button class="program-book-close" aria-label="Zavřít">×</button></div><div class="program-book-wrap"><button class="program-book-nav prev" aria-label="Předchozí">←</button><div class="program-book"><div class="book-cover-view"><div class="book-cover"><img src="assets/program_lomnice.png" alt="Obálka programu"><span>PROHLÉDNOUT PROGRAM</span></div></div><div class="book-open-view"><div class="book-page left"><img alt=""></div><div class="book-gutter"></div><div class="book-page right"><img alt=""></div><div class="book-turn"><img alt=""></div></div></div><button class="program-book-nav next" aria-label="Další">→</button></div><div class="program-book-bottom"><span class="program-book-counter">OBÁLKA</span><span>← → LISTOVAT · SWIPE NA TELEFONU</span></div></div>`;
  document.body.appendChild(modal);
  const style=document.createElement('style');style.id='program-book-style';style.textContent=`
.program-book-modal{position:fixed;inset:0;z-index:100;display:grid;place-items:center;opacity:0;visibility:hidden;transition:opacity .25s ease,visibility .25s ease}.program-book-modal.is-open{opacity:1;visibility:visible}.program-book-backdrop{position:absolute;inset:0;background:rgba(17,17,17,.72);backdrop-filter:blur(8px)}.program-book-dialog{position:relative;z-index:1;width:min(1180px,94vw);height:min(900px,94vh);background:#f8f6ef;padding:28px 34px 22px;display:flex;flex-direction:column;box-shadow:0 30px 90px rgba(0,0,0,.28)}.program-book-top{display:flex;justify-content:space-between;align-items:flex-start}.program-book-top h2{font-family:'Space Grotesk';font-size:clamp(32px,4vw,54px);line-height:.9;letter-spacing:-.06em;margin:0}.program-book-top .eyebrow{margin:0 0 7px;color:#9a7b00}.program-book-close{width:42px;height:42px;border:1px solid #111;background:#fff;border-radius:50%;font-size:30px;cursor:pointer}.program-book-wrap{min-height:0;flex:1;display:flex;align-items:center;justify-content:center;gap:18px;padding:18px 35px 12px}.program-book{position:relative;width:min(920px,100%);height:min(640px,100%);perspective:2200px}.book-cover-view,.book-open-view{position:absolute;inset:0;display:grid;place-items:center}.book-cover-view{transition:opacity .3s,transform .45s}.program-book.is-open .book-cover-view{opacity:0;pointer-events:none;transform:scale(.94) translateY(12px)}.book-cover{position:relative;width:min(520px,72%);height:92%;background:#fff;box-shadow:0 20px 35px rgba(0,0,0,.2);overflow:hidden;border-left:10px solid var(--yellow);transform:rotateY(-7deg);transform-origin:left center}.book-cover img{width:100%;height:100%;object-fit:cover}.book-cover span{position:absolute;left:22px;right:22px;bottom:20px;padding:11px;background:rgba(255,255,255,.92);font-size:10px;font-weight:700;letter-spacing:.14em;text-align:center}.book-open-view{display:none;grid-template-columns:1fr 1px 1fr;padding:2% 1%}.program-book.is-open .book-open-view{display:grid}.book-page{position:relative;overflow:hidden;background:#fffdf7;border:1px solid rgba(17,17,17,.08);box-shadow:0 15px 30px rgba(0,0,0,.14)}.book-page.left{border-radius:4px 0 0 4px}.book-page.right{border-radius:0 4px 4px 0}.book-page img,.book-turn img{width:100%;height:100%;object-fit:contain;background:#fffdf7}.book-gutter{background:linear-gradient(90deg,#cfc9b8,#fff,#cfc9b8);z-index:5}.book-turn{position:absolute;top:2%;right:1%;bottom:2%;width:calc(49.5% - 1px);background:#fffdf7;z-index:8;visibility:hidden;transform-origin:left center;backface-visibility:hidden;box-shadow:0 12px 22px rgba(0,0,0,.16);overflow:hidden}.book-turn.next{visibility:visible;animation:bookNext .68s cubic-bezier(.45,.05,.2,1) forwards}.book-turn.prev{left:1%;right:auto;transform-origin:right center;visibility:visible;animation:bookPrev .68s cubic-bezier(.45,.05,.2,1) forwards}@keyframes bookNext{to{transform:rotateY(-180deg)}}@keyframes bookPrev{to{transform:rotateY(180deg)}}.program-book-nav{width:46px;height:46px;flex:0 0 auto;border:1px solid #111;background:#fff;border-radius:50%;font-size:23px;cursor:pointer}.program-book-nav:hover:not(:disabled){background:var(--yellow);transform:translateY(-2px)}.program-book-nav:disabled{opacity:.25;cursor:default}.program-book-bottom{display:flex;justify-content:space-between;gap:20px;border-top:1px solid var(--line);padding:8px;font-size:9px;font-weight:700;letter-spacing:.13em;color:#8c8c84}.program-book-counter{color:#8b7a35}body.program-book-open{overflow:hidden}@media(max-width:700px){.program-book-dialog{width:100vw;height:100svh;padding:18px 10px 12px}.program-book-wrap{gap:6px;padding:10px 0}.program-book-nav{width:40px;height:40px;font-size:20px}.program-book{height:100%;perspective:1500px}.book-open-view{grid-template-columns:1fr;padding:2% 3%}.book-page.left,.book-gutter{display:none}.book-page.right{grid-column:1;border-radius:4px}.book-turn{left:3%;right:3%;width:94%;border-radius:4px}.book-turn.prev{left:3%;right:auto;width:94%}.book-cover{width:88%;height:92%}.program-book-bottom{flex-direction:column;align-items:flex-start;gap:5px}.program-book-bottom span:last-child{font-size:8px}}
@media(prefers-reduced-motion:reduce){.book-turn.next,.book-turn.prev{animation-duration:.01ms}}
`;
  document.head.appendChild(style);
  const book=modal.querySelector('.program-book'),left=modal.querySelector('.book-page.left img'),right=modal.querySelector('.book-page.right img'),turn=modal.querySelector('.book-turn'),turnImg=turn.querySelector('img'),prev=modal.querySelector('.prev'),next=modal.querySelector('.next'),counter=modal.querySelector('.program-book-counter');
  let pos=0,busy=false,startX=0;
  const isMobile=()=>matchMedia('(max-width:700px)').matches;
  const set=(img,i)=>{if(i<0||!pages[i]){img.removeAttribute('src');return}img.src=pages[i];img.alt=i?'Program — strana '+i:'Obálka programu'};
  function render(){if(!pos)return;if(isMobile()){set(left,-1);set(right,pos);counter.textContent=`STRANA ${pos} / ${pages.length-1}`;prev.disabled=pos<=1;next.disabled=pos>=pages.length-1}else{const l=2*pos-1,r=2*pos;set(left,l);set(right,r<pages.length?r:-1);counter.textContent=`STRANY ${l}–${Math.min(r,pages.length-1)} / ${pages.length-1}`;prev.disabled=pos<=1;next.disabled=pos>=Math.ceil((pages.length-1)/2)}}
  }
  function open(){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('program-book-open');book.classList.remove('is-open');pos=0;counter.textContent='OBÁLKA';prev.disabled=true;next.disabled=false;book.focus({preventScroll:true})}
  function close(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('program-book-open');book.classList.remove('is-open');turn.className='book-turn'}
  function flip(dir){if(busy)return;if(!pos){if(dir>0){pos=1;book.classList.add('is-open');requestAnimationFrame(render)}return}const max=isMobile()?pages.length-1:Math.ceil((pages.length-1)/2),to=pos+dir;if(to<1||to>max)return;busy=true;const old=isMobile()?pos:(dir>0?2*pos:2*pos-1);set(turnImg,old);turn.className='book-turn '+(dir>0?'next':'prev');pos=to;const done=()=>{turn.className='book-turn';render();busy=false};turn.addEventListener('animationend',done,{once:true});setTimeout(done,760)}
  trigger.addEventListener('click',e=>{e.preventDefault();open()});modal.querySelector('.program-book-close').addEventListener('click',close);modal.querySelector('.program-book-backdrop').addEventListener('click',close);prev.addEventListener('click',()=>flip(-1));next.addEventListener('click',()=>flip(1));book.addEventListener('click',e=>{if(!pos&&e.target.closest('.book-cover')){pos=1;book.classList.add('is-open');requestAnimationFrame(render)}});document.addEventListener('keydown',e=>{if(!modal.classList.contains('is-open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight'||e.key==='PageDown')flip(1);if(e.key==='ArrowLeft'||e.key==='PageUp')flip(-1)});book.addEventListener('touchstart',e=>{startX=e.changedTouches[0]?.clientX||0},{passive:true});book.addEventListener('touchend',e=>{const d=(e.changedTouches[0]?.clientX||0)-startX;if(Math.abs(d)>45)flip(d<0?1:-1)},{passive:true});window.addEventListener('resize',()=>{if(modal.classList.contains('is-open')&&pos)render()});
})();

if (nav && !document.querySelector('link[data-responsive-css]')) {
  const responsiveCss = document.createElement('link');
  responsiveCss.rel = 'stylesheet';
  responsiveCss.href = 'responsive.css';
  responsiveCss.dataset.responsiveCss = 'true';
  document.head.appendChild(responsiveCss);
}