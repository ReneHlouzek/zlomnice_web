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

if (!document.querySelector('link[data-responsive-css]')) {
  const responsiveCss = document.createElement('link');
  responsiveCss.rel = 'stylesheet';
  responsiveCss.href = 'responsive.css';
  responsiveCss.dataset.responsiveCss = 'true';
  document.head.appendChild(responsiveCss);
}

/*
 * ISOLATED PROGRAM BOOK
 * Everything is created at runtime and scoped to #program-book-modal.
 * The existing page markup/layout is untouched. Page images can later be
 * added to PROGRAM_BOOK_PAGES without changing the rest of the website.
 */
(() => {
  const programLink = document.querySelector('#program .text-link');
  if (!programLink || document.querySelector('#program-book-modal')) return;

  const PROGRAM_BOOK_PAGES = [
    { src: 'assets/program_lomnice.png', alt: 'Obálka programu Z:LOMNICE' }
  ];

  const style = document.createElement('style');
  style.id = 'program-book-style';
  style.textContent = `
    #program-book-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(18,18,16,.72);backdrop-filter:blur(5px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .28s ease,visibility .28s ease}
    #program-book-modal.is-open{opacity:1;visibility:visible;pointer-events:auto}
    #program-book-modal *{box-sizing:border-box}
    .program-book-shell{position:relative;width:min(1120px,96vw);height:min(820px,92vh);display:flex;flex-direction:column;align-items:center;justify-content:center}
    .program-book-close{position:absolute;right:0;top:-8px;width:44px;height:44px;border:1px solid rgba(255,255,255,.7);border-radius:50%;background:rgba(0,0,0,.25);color:#fff;font-size:26px;line-height:1;cursor:pointer;z-index:30;transition:transform .2s,background .2s}
    .program-book-close:hover{transform:rotate(8deg) scale(1.05);background:rgba(0,0,0,.45)}
    .program-book-stage{position:relative;width:min(920px,90vw);height:min(650px,76vh);perspective:1800px;display:flex;align-items:center;justify-content:center}
    .program-book{position:relative;width:min(860px,88vw);height:min(590px,70vh);transform-style:preserve-3d;filter:drop-shadow(0 24px 30px rgba(0,0,0,.25))}
    .program-book:before{content:"";position:absolute;left:50%;top:1%;bottom:1%;width:4px;transform:translateX(-50%);background:rgba(90,70,35,.16);z-index:3;border-radius:50%}
    .program-book-page{position:absolute;top:0;bottom:0;width:50%;overflow:hidden;background:#f7f0df;box-shadow:inset 0 0 28px rgba(70,50,20,.10);backface-visibility:hidden;transform-style:preserve-3d}
    .program-book-page.left{left:0;border-radius:10px 2px 2px 10px;transform-origin:right center}
    .program-book-page.right{right:0;border-radius:2px 10px 10px 2px;transform-origin:left center}
    .program-book-page img{display:block;width:100%;height:100%;object-fit:cover}
    .program-book-page.empty{display:flex;align-items:center;justify-content:center;padding:35px;color:#665f50;text-align:center;font-family:inherit;font-size:clamp(15px,1.8vw,20px)}
    .program-book-page.empty span{max-width:270px}
    .program-book-page.turn-next{animation:programPageNext .72s cubic-bezier(.22,.61,.36,1) forwards;z-index:12}
    .program-book-page.turn-prev{animation:programPagePrev .72s cubic-bezier(.22,.61,.36,1) forwards;z-index:12}
    @keyframes programPageNext{0%{transform:rotateY(0);box-shadow:0 0 0 rgba(0,0,0,0)}45%{box-shadow:-18px 12px 28px rgba(0,0,0,.20)}100%{transform:rotateY(-180deg);box-shadow:0 0 0 rgba(0,0,0,0)}}
    @keyframes programPagePrev{0%{transform:rotateY(-180deg);box-shadow:0 0 0 rgba(0,0,0,0)}45%{box-shadow:18px 12px 28px rgba(0,0,0,.20)}100%{transform:rotateY(0);box-shadow:0 0 0 rgba(0,0,0,0)}}
    .program-book-nav{display:flex;align-items:center;gap:14px;margin-top:18px;color:#fff}
    .program-book-btn{min-width:46px;height:42px;padding:0 16px;border:1px solid rgba(255,255,255,.6);border-radius:999px;background:rgba(255,255,255,.08);color:#fff;font:600 13px/1 inherit;letter-spacing:.08em;cursor:pointer;transition:background .2s,transform .2s,opacity .2s}
    .program-book-btn:hover:not(:disabled){background:rgba(255,255,255,.18);transform:translateY(-1px)}
    .program-book-btn:disabled{opacity:.35;cursor:default}
    .program-book-count{min-width:105px;text-align:center;font:600 12px/1 inherit;letter-spacing:.14em}
    .program-book-hint{margin-top:8px;color:rgba(255,255,255,.72);font:500 11px/1.4 inherit;letter-spacing:.08em;text-transform:uppercase;text-align:center}
    @media(max-width:700px){
      #program-book-modal{padding:12px}
      .program-book-shell{width:100%;height:100%;justify-content:center}
      .program-book-close{right:2px;top:0;width:40px;height:40px}
      .program-book-stage{width:96vw;height:min(62vh,560px)}
      .program-book{width:94vw;height:min(58vh,500px)}
      .program-book-page.empty{padding:18px;font-size:14px}
      .program-book-nav{margin-top:12px;gap:8px}
      .program-book-btn{height:40px;min-width:42px;padding:0 12px}
      .program-book-count{min-width:82px;font-size:11px}
      .program-book-hint{max-width:300px;font-size:10px}
    }
    @media(prefers-reduced-motion:reduce){#program-book-modal,.program-book-page.turn-next,.program-book-page.turn-prev{transition:none;animation-duration:.01ms!important}}
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.id = 'program-book-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="program-book-shell" role="dialog" aria-modal="true" aria-label="Program Z:LOMNICE">
      <button class="program-book-close" type="button" aria-label="Zavřít program">×</button>
      <div class="program-book-stage">
        <div class="program-book" aria-live="polite"></div>
      </div>
      <div class="program-book-nav">
        <button class="program-book-btn" type="button" data-book-prev aria-label="Předchozí strana">←</button>
        <span class="program-book-count" data-book-count></span>
        <button class="program-book-btn" type="button" data-book-next aria-label="Další strana">→</button>
      </div>
      <div class="program-book-hint">Klikněte na šipky nebo listujte prstem</div>
    </div>`;
  document.body.appendChild(modal);

  const book = modal.querySelector('.program-book');
  const prev = modal.querySelector('[data-book-prev]');
  const next = modal.querySelector('[data-book-next]');
  const count = modal.querySelector('[data-book-count]');
  const close = modal.querySelector('.program-book-close');
  let current = 0;
  let busy = false;
  let touchStartX = 0;

  function pageElement(index, side) {
    const page = document.createElement('div');
    page.className = `program-book-page ${side}`;
    if (PROGRAM_BOOK_PAGES[index]) {
      const img = document.createElement('img');
      img.src = PROGRAM_BOOK_PAGES[index].src;
      img.alt = PROGRAM_BOOK_PAGES[index].alt;
      page.appendChild(img);
    } else {
      page.classList.add('empty');
      page.innerHTML = '<span>Stránka programu bude doplněna.</span>';
    }
    return page;
  }

  function render() {
    book.innerHTML = '';
    const leftIndex = current % 2 === 0 ? current : current - 1;
    const rightIndex = leftIndex + 1;
    book.appendChild(pageElement(Math.max(0, leftIndex), 'left'));
    book.appendChild(pageElement(rightIndex, 'right'));
    count.textContent = `${Math.min(current + 1, PROGRAM_BOOK_PAGES.length)} / ${Math.max(1, PROGRAM_BOOK_PAGES.length)}`;
    prev.disabled = current <= 0;
    next.disabled = current >= PROGRAM_BOOK_PAGES.length - 1;
  }

  function turn(direction) {
    if (busy || PROGRAM_BOOK_PAGES.length < 2) return;
    const target = direction === 1 ? Math.min(current + 1, PROGRAM_BOOK_PAGES.length - 1) : Math.max(current - 1, 0);
    if (target === current) return;
    busy = true;
    const turningPage = direction === 1 ? book.querySelector('.right') : book.querySelector('.left');
    if (!turningPage) { busy = false; return; }
    turningPage.classList.add(direction === 1 ? 'turn-next' : 'turn-prev');
    window.setTimeout(() => { current = target; render(); busy = false; }, 700);
  }

  function openBook(event) {
    event?.preventDefault();
    render();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    close.focus();
  }
  function closeBook() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    programLink.focus();
  }

  programLink.addEventListener('click', openBook);
  close.addEventListener('click', closeBook);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeBook(); });
  prev.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  modal.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) turn(delta < 0 ? 1 : -1);
  }, { passive: true });
  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeBook();
    if (event.key === 'ArrowRight') turn(1);
    if (event.key === 'ArrowLeft') turn(-1);
  });
})();
