const revealItems = document.querySelectorAll('.reveal');

// Klasické reveal animace se spouštějí znovu při každém návratu do viewportu.
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

  function update() {
    const rect = section.getBoundingClientRect();
    const travel = section.offsetHeight - window.innerHeight;
    const raw = travel > 0 ? -rect.top / travel : 0;
    const progress = Math.max(0, Math.min(1, raw));
    const position = progress * (slides.length - 1);

    slides.forEach((slide, index) => {
      const distance = index - position;
      const absDistance = Math.abs(distance);
      const incoming = direction === 'ltr' ? distance < 0 : distance > 0;
      const normalized = Math.min(absDistance, 1);
      const scale = 0.68 + (1 - normalized) * 0.32;
      const opacity = Math.max(0, 1 - normalized * 0.72);
      const x = distance * 100;

      slide.style.transform = `translate3d(${x}%,0,0) scale(${scale})`;
      slide.style.opacity = String(opacity);
      slide.style.pointerEvents = absDistance < 0.5 ? 'auto' : 'none';

      const copy = slide.querySelector('.priority-copy, .person-info');
      const art = slide.querySelector('.priority-art, .person-art');
      if (copy) {
        const copyOpacity = Math.max(0, 1 - normalized * 0.9);
        const copyShift = incoming ? (direction === 'ltr' ? -30 : 30) * normalized : 0;
        copy.style.opacity = String(copyOpacity);
        copy.style.transform = `translate3d(${copyShift}px,0,0)`;
      }
      if (art) {
        const artScale = 0.94 + (1 - normalized) * 0.06;
        art.style.transform = `scale(${artScale})`;
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
nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('mobile-open');
  });
});
