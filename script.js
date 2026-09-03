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

  // Kandidátům dáváme ještě dvojnásobně delší scrollovací prostor,
  // aby byl pohyb při jednotlivých krocích kolečka/touchpadu maximálně jemný.
  if (isPeople) {
    const vhPerCandidate = window.innerWidth <= 950 ? 400 : 360;
    section.style.height = `${Math.max(2400, slides.length * vhPerCandidate)}vh`;
  }
  if (sectionSelector === '.priority-scroll') {
    section.style.height = '1200vh';
  }
  if (progressBar) progressBar.style.width = '100%';

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

// Návrat na začátek: logo i šipka v navigaci používají stejnou spolehlivou funkci.
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const brand = document.querySelector('.brand');
brand?.addEventListener('click', (event) => {
  event.preventDefault();
  scrollToTop();
});

// Šipka nahoru za položkou Kontakt. Vytvoří se záměrně přes JS,
// takže není nutné zasahovat do HTML navigace a zůstává funkční i na mobilu.
if (nav && !nav.querySelector('.back-to-top')) {
  const backToTop = document.createElement('a');
  backToTop.className = 'back-to-top';
  backToTop.href = '#top';
  backToTop.setAttribute('aria-label', 'Zpět nahoru');
  backToTop.setAttribute('title', 'Zpět nahoru');
  backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
  nav.appendChild(backToTop);
  backToTop.addEventListener('click', (event) => {
    event.preventDefault();
    scrollToTop();
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('mobile-open');
  });
}

// Styl šipky je vložen zde, aby byla změna izolovaná a nemusela se přepisovat celá styles.css.
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

// Načtení samostatné responzivní vrstvy, aby šla bezpečně ladit bez zásahu do hlavního CSS.
if (!document.querySelector('link[data-responsive-css]')) {
  const responsiveCss = document.createElement('link');
  responsiveCss.rel = 'stylesheet';
  responsiveCss.href = 'responsive.css';
  responsiveCss.dataset.responsiveCss = 'true';
  document.head.appendChild(responsiveCss);
}
