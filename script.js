const revealItems = document.querySelectorAll('.reveal');

// Klasické reveal animace se spouštějí znovu při každém návratu do viewportu.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
    else entry.target.classList.remove('visible');
  });
}, { threshold: 0.14 });
revealItems.forEach((item) => observer.observe(item));

// PRIORITY: při scrollování se jednotlivá témata plynule posouvají zprava doleva.
// Nadcházející téma začíná výrazně menší a při přibližování se zvětšuje.
const prioritySection = document.querySelector('.priority-scroll');
const prioritySlides = [...document.querySelectorAll('.priority-slide')];
const progressBar = document.querySelector('.priority-progress span');
let ticking = false;

function updatePriorities() {
  if (!prioritySection || !prioritySlides.length) return;
  const rect = prioritySection.getBoundingClientRect();
  const travel = prioritySection.offsetHeight - window.innerHeight;
  const raw = travel > 0 ? -rect.top / travel : 0;
  const progress = Math.max(0, Math.min(1, raw));
  const position = progress * (prioritySlides.length - 1);

  prioritySlides.forEach((slide, index) => {
    const distance = index - position;
    const absDistance = Math.abs(distance);
    const opacity = Math.max(0, 1 - absDistance * 0.72);

    // Výraznější zoom-in: nové téma začíná na 68 % a při příchodu
    // do středu se plynule dostane na 100 %. Odcházející téma se lehce zmenší.
    let scale;
    if (distance > 0) {
      const incomingProgress = 1 - Math.min(distance, 1);
      scale = 0.68 + incomingProgress * 0.32;
    } else {
      scale = 1 - Math.min(absDistance, 1) * 0.16;
    }

    // Text se při příchodu zároveň postupně odhaluje a lehce se posouvá
    // směrem do své finální pozice. Tím vzniká výraznější pocit přiblížení.
    const copy = slide.querySelector('.priority-copy');
    const art = slide.querySelector('.priority-art');
    if (copy) {
      const copyOpacity = distance > 0
        ? Math.max(0, 1 - Math.min(distance, 1) * 0.9)
        : Math.max(0.75, 1 - Math.min(absDistance, 1) * 0.25);
      const copyShift = distance > 0 ? Math.min(distance, 1) * 26 : 0;
      copy.style.opacity = String(copyOpacity);
      copy.style.transform = `translate3d(${copyShift}px,0,0)`;
    }
    if (art) {
      const artScale = distance > 0 ? 0.94 + (1 - Math.min(distance, 1)) * 0.06 : 1;
      art.style.transform = `scale(${artScale})`;
    }

    const x = distance * 100;
    slide.style.transform = `translate3d(${x}%,0,0) scale(${scale})`;
    slide.style.opacity = String(opacity);
    slide.style.pointerEvents = Math.abs(distance) < 0.5 ? 'auto' : 'none';
  });

  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
  prioritySection.classList.toggle('is-finished', progress > 0.985);
  ticking = false;
}

function requestPriorityUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updatePriorities);
    ticking = true;
  }
}

if (prioritySection) {
  prioritySlides.forEach((slide, index) => {
    slide.style.transform = `translate3d(${index * 100}%,0,0) scale(${index ? 0.68 : 1})`;
    slide.style.opacity = index === 0 ? '1' : '0';
  });
  window.addEventListener('scroll', requestPriorityUpdate, { passive: true });
  window.addEventListener('resize', requestPriorityUpdate);
  updatePriorities();
}

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
