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

  function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
  }

  function update() {
    const rect = section.getBoundingClientRect();
    const travel = section.offsetHeight - window.innerHeight;
    const raw = travel > 0 ? -rect.top / travel : 0;
    const progress = clamp(raw);

    // U lidí je více prostoru pro celý příběh kandidáta:
    // 1) portrét přijede, 2) zastaví se bez textu,
    // 3) teprve potom se odhalí text, 4) vše začne odjíždět,
    // 5) text ještě chvíli doznívá.
    const lead = isPeople ? 0.60 : 0;
    const tail = isPeople ? 0.55 : 0;
    const carouselLength = Math.max(0, slides.length - 1) + lead + tail;
    const position = progress * carouselLength - lead;

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
        if (isPeople) {
          // Text se nesmí objevit během příjezdu. Začne až poté,
          // co je portrét bezpečně na místě, a zůstane déle při odjezdu.
          const revealStart = -0.02;
          const revealEnd = -0.28;
          const textProgress = clamp(
            (revealStart - distance) / (revealStart - revealEnd)
          );

          const textShift = (1 - textProgress) * 26;
          const clipBottom = (1 - textProgress) * 100;

          // Kandidát může začít odjíždět, ale text ještě zůstává.
          const exitStart = 0.42;
          const exitEnd = 1.08;
          const exitProgress = distance > exitStart
            ? clamp((distance - exitStart) / (exitEnd - exitStart))
            : 0;
          const exitOpacity = 1 - exitProgress;

          copy.style.opacity = String(textProgress * exitOpacity);
          copy.style.transform = `translate3d(0,${textShift}px,0)`;
          copy.style.clipPath = `inset(0 0 ${clipBottom}% 0)`;
        } else {
          const copyOpacity = Math.max(0, 1 - normalized * 0.9);
          const copyShift = incoming ? (direction === 'ltr' ? -30 : 30) * normalized : 0;
          copy.style.opacity = String(copyOpacity);
          copy.style.transform = `translate3d(${copyShift}px,0,0)`;
          copy.style.clipPath = 'none';
        }
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
