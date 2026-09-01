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
    const lead = isPeople ? 0.60 : 0;
    const tail = isPeople ? 0.55 : 0;
    const carouselLength = Math.max(0, slides.length - 1) + lead + tail;
    const position = progress * carouselLength - lead;

    slides.forEach((slide, index) => {
      let distance = index - position;
      const absDistance = Math.abs(distance);
      const normalized = Math.min(absDistance, 1);
      const scale = 0.68 + (1 - normalized) * 0.32;
      const opacity = Math.max(0, 1 - normalized * 0.72);
      const copy = slide.querySelector('.priority-copy, .person-info');
      const art = slide.querySelector('.priority-art, .person-art');

      if (isPeople) {
        // Fáze 1: portrét přijíždí. Text je skrytý.
        // Fáze 2: portrét stojí přesně na místě a teprve potom se odhaluje text.
        // Během celé fáze odhalování se portrét NEHÝBE.
        // Fáze 3: po kompletním odhalení textu se portrét i text vydají doprava.
        const revealStart = -0.02;
        const revealEnd = -0.34;
        const textProgress = clamp((revealStart - distance) / (revealStart - revealEnd));
        const textShift = (1 - textProgress) * 26;
        const clipBottom = (1 - textProgress) * 100;

        // Poslední část odjezdu je záměrně dlouhá, aby text dozníval až po portrétu.
        const exitStart = 0.62;
        const exitEnd = 1.20;
        const exitProgress = distance > exitStart ? clamp((distance - exitStart) / (exitEnd - exitStart)) : 0;
        const exitOpacity = 1 - exitProgress;

        // Samotný slide se nesmí hýbat, dokud není text kompletní.
        let slideDistance = distance;
        if (distance >= -0.02 && distance <= 0.62) slideDistance = 0;

        slide.style.transform = `translate3d(${slideDistance * 100}%,0,0) scale(${slideDistance === 0 ? 1 : scale})`;
        slide.style.opacity = String(slideDistance === 0 ? 1 : opacity);
        slide.style.pointerEvents = absDistance < 0.5 ? 'auto' : 'none';

        if (copy) {
          copy.style.opacity = String(textProgress * exitOpacity);
          copy.style.transform = `translate3d(0,${textShift}px,0)`;
          copy.style.clipPath = `inset(0 0 ${clipBottom}% 0)`;
        }
        if (art) art.style.transform = `scale(${slideDistance === 0 ? 1 : 0.94 + (1 - normalized) * 0.06})`;
      } else {
        const incoming = direction === 'ltr' ? distance < 0 : distance > 0;
        const x = distance * 100;
        slide.style.transform = `translate3d(${x}%,0,0) scale(${scale})`;
        slide.style.opacity = String(opacity);
        slide.style.pointerEvents = absDistance < 0.5 ? 'auto' : 'none';
        if (copy) {
          const copyOpacity = Math.max(0, 1 - normalized * 0.9);
          const copyShift = incoming ? (direction === 'ltr' ? -30 : 30) * normalized : 0;
          copy.style.opacity = String(copyOpacity);
          copy.style.transform = `translate3d(${copyShift}px,0,0)`;
          copy.style.clipPath = 'none';
        }
        if (art) art.style.transform = `scale(${0.94 + (1 - normalized) * 0.06})`;
      }
    });

    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    section.classList.toggle('is-finished', progress > 0.985);
  }

  slides.forEach((slide, index) => {
    const start = direction === 'ltr' ? -index * 100 : index * 100;
    slide.style.transform = `translate3d(${start}%,0,0) scale(${index ? 0.68 : 1})`;
    slide.style.opacity = index === 0 ? '1' : '0';
  });
  update();
  return update;
}

let ticking = false;
const updatePriority = setupScrollCarousel('.priority-scroll', '.priority-slide', '.priority-progress span', 'rtl');
const updatePeople = setupScrollCarousel('.people-scroll', '.person-slide', '.people-progress span', 'ltr');
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
