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
// Nadcházející téma se současně postupně zvětšuje, takže působí jako přirozené
// přiblížení pozornosti před jeho příchodem do středu.
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

    // Slide přicházející zprava začíná menší a při přibližování se zvětšuje.
    // Aktivní slide je 1.0; odjíždějící se naopak lehce zmenšuje.
    let scale;
    if (distance > 0) {
      scale = 0.78 + (1 - Math.min(distance, 1)) * 0.22;
    } else {
      scale = 1 - Math.min(absDistance, 1) * 0.14;
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
    slide.style.transform = `translate3d(${index * 100}%,0,0) scale(${index ? 0.78 : 1})`;
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
