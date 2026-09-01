const revealItems = document.querySelectorAll('.reveal');

// Animace se spustí znovu pokaždé, když prvek znovu vstoupí do viewportu.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => observer.observe(item));

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
    nav.classList.remove('mobile-open');
  });
});
