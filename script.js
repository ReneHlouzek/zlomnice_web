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

  function update() {
    const rect = section.getBoundingClientRect();
    const travel = section.offsetHeight - window.innerHeight;
    const progress = clamp(travel > 0 ? -rect.top / travel : 0);

    if (isPeople) {
      // Každý kandidát: příjezd zprava, zastavení, text, odjezd doleva.
      const totalScenes = slides.length;
      const scene = progress * totalScenes;

      slides.forEach((slide, index) => {
        const copy = slide.querySelector('.person-info');
        const art = slide.querySelector('.person-art');
        const t = scene - index;

        if (t < -0.35 || t > 1.45) {
          const off = t < 0 ? 120 : -120;
          slide.style.transform = `translate3d(${off}%,0,0) scale(0.68)`;
          slide.style.opacity = '0';
          slide.style.pointerEvents = 'none';
          if (copy) {
            copy.style.opacity = '0';
            copy.style.clipPath = 'inset(0 0 100% 0)';
          }
          return;
        }

        let x = 0;
        let scale = 1;
        let slideOpacity = 1;
        let textProgress = 0;
        let textOpacity = 0;

        if (t < 0.22) {
          const p = clamp(t / 0.22);
          x = 100 * (1 - p);
          scale = 0.68 + 0.32 * p;
          slideOpacity = p;
        } else if (t < 0.40) {
          x = 0;
          scale = 1;
        } else if (t < 0.62) {
          x = 0;
          scale = 1;
          textProgress = clamp((t - 0.40) / 0.22);
          textOpacity = textProgress;
        } else if (t < 0.82) {
          x = 0;
          scale = 1;
          textProgress = 1;
          textOpacity = 1;
        } else if (t < 1.10) {
          const p = clamp((t - 0.82) / 0.28);
          x = -100 * p;
          scale = 1 - 0.08 * p;
          textProgress = 1;
          textOpacity = 1;
        } else {
          const p = clamp((t - 1.10) / 0.35);
          x = -100;
          scale = 0.92;
          textProgress = 1;
          textOpacity = 1 - p;
          slideOpacity = 1 - p * 0.35;
        }

        slide.style.transform = `translate3d(${x}%,0,0) scale(${scale})`;
        slide.style.opacity = String(slideOpacity);
        slide.style.pointerEvents = x === 0 ? 'auto' : 'none';

        if (copy) {
          copy.style.opacity = String(textOpacity);
          copy.style.transform = `translate3d(0,${(1 - textProgress) * 26}px,0)`;
          copy.style.clipPath = `inset(0 0 ${(1 - textProgress) * 100}% 0)`;
        }
        if (art) art.style.transform = `scale(${scale === 1 ? 1 : 0.94 + 0.06 * scale})`;
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
        if (copy) {
          copy.style.opacity = String(Math.max(0, 1 - normalized * 0.9));
          copy.style.transform = 'translate3d(0,0,0)';
          copy.style.clipPath = 'none';
        }
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
  window.requestAnimationFrame(() => {
    updatePriority?.();
    updatePeople?.();
    ticking = false;
  });
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
