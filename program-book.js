(() => {
  // Struktura knihy: obálka -> jednotlivé dvoustrany -> zadní obálka.
  // Až budou dodány stránky programu, stačí doplnit jejich obrázky do PROGRAM_PAGES.
  const PROGRAM_PAGES = [
    { src: 'assets/program_lomnice.png', alt: 'Obálka programu Z:LOMNICE', type: 'cover' },
    { placeholder: 'Strana programu 1' },
    { placeholder: 'Strana programu 2' },
    { placeholder: 'Strana programu 3' },
    { placeholder: 'Strana programu 4' },
    { placeholder: 'Strana programu 5' },
    { placeholder: 'Strana programu 6' },
    { placeholder: 'Strana programu 7' },
    { placeholder: 'Strana programu 8' },
    { src: 'assets/program_lomnice.png', alt: 'Zadní obálka programu Z:LOMNICE', type: 'back-cover' }
  ];

  const link = document.querySelector('#program .text-link');
  if (!link) return;

  const existing = document.querySelector('#program-book-modal');
  if (existing) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      existing.classList.add('is-open');
      existing.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
    return;
  }

  const style = document.createElement('style');
  style.id = 'program-book-fix-style';
  style.textContent = `
    #program-book-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(18,18,16,.76);backdrop-filter:blur(6px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .28s ease,visibility .28s ease}
    #program-book-modal.is-open{opacity:1;visibility:visible;pointer-events:auto}
    #program-book-modal *{box-sizing:border-box}
    .program-book-shell{position:relative;width:min(1120px,96vw);height:min(850px,94vh);display:flex;flex-direction:column;align-items:center;justify-content:center}
    .program-book-close{position:absolute;right:0;top:0;width:44px;height:44px;border:1px solid rgba(255,255,255,.7);border-radius:50%;background:rgba(0,0,0,.25);color:#fff;font-size:26px;line-height:1;cursor:pointer;z-index:50}
    .program-book-stage{position:relative;width:min(920px,92vw);height:min(650px,76vh);perspective:2200px;display:flex;align-items:center;justify-content:center}
    .program-book{position:relative;width:min(860px,88vw);height:min(590px,70vh);transform-style:preserve-3d;filter:drop-shadow(0 28px 32px rgba(0,0,0,.30))}
    .program-book:before{content:"";position:absolute;left:50%;top:0;bottom:0;width:5px;transform:translateX(-50%);background:linear-gradient(90deg,rgba(50,35,15,.04),rgba(50,35,15,.22),rgba(255,255,255,.25),rgba(50,35,15,.05));z-index:25;pointer-events:none;border-radius:50%}
    .program-book-page{position:absolute;top:0;bottom:0;width:50%;overflow:hidden;background:#f7f0df;box-shadow:inset 0 0 30px rgba(70,50,20,.10);backface-visibility:hidden;transform-style:preserve-3d}
    .program-book-page.left{left:0;border-radius:10px 2px 2px 10px;transform-origin:right center}
    .program-book-page.right{right:0;border-radius:2px 10px 10px 2px;transform-origin:left center}
    .program-book-page img{display:block;width:100%;height:100%;object-fit:cover}
    .program-book-page.empty{display:flex;align-items:center;justify-content:center;padding:30px;color:#665f50;text-align:center;font:500 18px/1.5 inherit}
    .program-book-page.empty span{max-width:260px}
    .program-book-cover{position:absolute;inset:0;width:100%;border-radius:10px;background:#f7f0df;overflow:hidden;box-shadow:inset 0 0 35px rgba(70,50,20,.13);transform-origin:left center;backface-visibility:hidden;transform-style:preserve-3d;z-index:20}
    .program-book-cover img{width:100%;height:100%;object-fit:cover;display:block}
    .program-book-cover.back{transform-origin:right center;z-index:18}
    .program-book-cover.turn-open{animation:programBookCoverOpen 1.05s cubic-bezier(.22,.61,.36,1) forwards}
    .program-book-cover.turn-close{animation:programBookCoverClose 1.05s cubic-bezier(.22,.61,.36,1) forwards}
    @keyframes programBookCoverOpen{0%{transform:rotateY(0);box-shadow:0 0 0 rgba(0,0,0,0)}35%{box-shadow:18px 12px 30px rgba(0,0,0,.24)}100%{transform:rotateY(-180deg);box-shadow:0 0 0 rgba(0,0,0,0)}}
    @keyframes programBookCoverClose{0%{transform:rotateY(-180deg)}65%{box-shadow:18px 12px 30px rgba(0,0,0,.24)}100%{transform:rotateY(0);box-shadow:0 0 0 rgba(0,0,0,0)}}
    .program-book-page.turn-next{animation:programBookNext .88s cubic-bezier(.22,.61,.36,1) forwards;z-index:12}
    .program-book-page.turn-prev{animation:programBookPrev .88s cubic-bezier(.22,.61,.36,1) forwards;z-index:12}
    @keyframes programBookNext{0%{transform:rotateY(0);box-shadow:0 0 0 rgba(0,0,0,0)}22%{box-shadow:-7px 10px 18px rgba(0,0,0,.10)}48%{box-shadow:-24px 16px 34px rgba(0,0,0,.28)}75%{box-shadow:-10px 10px 24px rgba(0,0,0,.18)}100%{transform:rotateY(-180deg);box-shadow:0 0 0 rgba(0,0,0,0)}}
    @keyframes programBookPrev{0%{transform:rotateY(-180deg);box-shadow:0 0 0 rgba(0,0,0,0)}25%{box-shadow:24px 16px 34px rgba(0,0,0,.28)}55%{box-shadow:10px 10px 24px rgba(0,0,0,.18)}100%{transform:rotateY(0);box-shadow:0 0 0 rgba(0,0,0,0)}}
    .program-book-nav{display:flex;align-items:center;gap:12px;margin-top:16px;color:#fff}
    .program-book-btn{min-width:48px;height:42px;padding:0 16px;border:1px solid rgba(255,255,255,.65);border-radius:999px;background:rgba(255,255,255,.08);color:#fff;font:600 13px/1 inherit;cursor:pointer}
    .program-book-btn:disabled{opacity:.35;cursor:default}
    .program-book-count{min-width:105px;text-align:center;font:600 12px/1 inherit;letter-spacing:.12em}
    .program-book-hint{margin-top:8px;color:rgba(255,255,255,.72);font:500 11px/1.4 inherit;letter-spacing:.08em;text-transform:uppercase;text-align:center}
    @media(max-width:700px){
      #program-book-modal{padding:10px}
      .program-book-shell{width:100%;height:100%}
      .program-book-close{right:2px;width:40px;height:40px}
      .program-book-stage{width:96vw;height:min(68vh,560px)}
      .program-book{width:94vw;height:min(62vh,500px)}
      .program-book-page.empty{padding:16px;font-size:14px}
      .program-book-nav{margin-top:10px;gap:8px}
      .program-book-btn{height:40px;min-width:42px;padding:0 12px}
      .program-book-count{min-width:80px;font-size:11px}
    }
    @media(prefers-reduced-motion:reduce){#program-book-modal,.program-book-cover.turn-open,.program-book-cover.turn-close,.program-book-page.turn-next,.program-book-page.turn-prev{transition:none;animation-duration:.01ms!important}}
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.id = 'program-book-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="program-book-shell" role="dialog" aria-modal="true" aria-label="Program Z:LOMNICE">
      <button class="program-book-close" type="button" aria-label="Zavřít program">×</button>
      <div class="program-book-stage"><div class="program-book"></div></div>
      <div class="program-book-nav">
        <button class="program-book-btn" type="button" data-book-prev aria-label="Předchozí strana">←</button>
        <span class="program-book-count" data-book-count></span>
        <button class="program-book-btn" type="button" data-book-next aria-label="Další strana">→</button>
      </div>
      <div class="program-book-hint">Klikněte na šipky nebo listujte prstem</div>
    </div>`;
  document.body.appendChild(modal);

  const book = modal.querySelector('.program-book');
  const close = modal.querySelector('.program-book-close');
  const prev = modal.querySelector('[data-book-prev]');
  const next = modal.querySelector('[data-book-next]');
  const count = modal.querySelector('[data-book-count]');
  let spread = 0;
  let busy = false;
  let touchStartX = null;

  const cover = PROGRAM_PAGES[0];
  const backCover = PROGRAM_PAGES[PROGRAM_PAGES.length - 1];
  const innerPages = PROGRAM_PAGES.slice(1, -1);
  const spreadCount = Math.ceil(innerPages.length / 2);

  function pageHtml(page, side) {
    if (page?.src) return `<div class="program-book-page ${side}"><img src="${page.src}" alt="${page.alt || ''}"></div>`;
    return `<div class="program-book-page ${side} empty"><span>${page?.placeholder || ''}</span></div>`;
  }

  function renderClosedBook() {
    book.innerHTML = `<div class="program-book-cover front"><img src="${cover.src}" alt="${cover.alt}"></div>`;
  }

  function renderOpenSpread() {
    const left = innerPages[spread * 2];
    const right = innerPages[spread * 2 + 1];
    book.innerHTML = pageHtml(left || {placeholder:''}, 'left') + pageHtml(right || {placeholder:''}, 'right');
    count.textContent = `${spread + 1} / ${spreadCount}`;
    prev.disabled = spread <= 0;
    next.disabled = spread >= spreadCount - 1;
  }

  function renderBackCover() {
    book.innerHTML = `<div class="program-book-cover back"><img src="${backCover.src}" alt="${backCover.alt}"></div>`;
  }

  function openFromCover() {
    if (busy) return;
    busy = true;
    const front = book.querySelector('.front');
    front.classList.add('turn-open');
    window.setTimeout(() => { spread = 0; renderOpenSpread(); busy = false; }, 1050);
  }

  function closeToCover() {
    if (busy) return;
    busy = true;
    renderClosedBook();
    const front = book.querySelector('.front');
    front.classList.add('turn-close');
    window.setTimeout(() => { busy = false; }, 1050);
  }

  function showBackCover() {
    if (busy) return;
    busy = true;
    const right = book.querySelector('.right');
    if (!right) { busy = false; return; }
    right.classList.add('turn-next');
    window.setTimeout(() => { renderBackCover(); count.textContent = '•'; prev.disabled = false; next.disabled = true; busy = false; }, 880);
  }

  function returnFromBackCover() {
    if (busy) return;
    busy = true;
    renderOpenSpread();
    const left = book.querySelector('.left');
    if (left) left.classList.add('turn-prev');
    window.setTimeout(() => { busy = false; }, 880);
  }

  function turn(direction) {
    if (busy) return;
    if (direction === 1) {
      if (spread < spreadCount - 1) {
        const turningPage = book.querySelector('.right');
        if (!turningPage) return;
        busy = true;
        turningPage.classList.add('turn-next');
        window.setTimeout(() => { spread += 1; renderOpenSpread(); busy = false; }, 880);
      } else {
        showBackCover();
      }
    } else {
      if (spread > 0) {
        const turningPage = book.querySelector('.left');
        if (!turningPage) return;
        busy = true;
        turningPage.classList.add('turn-prev');
        window.setTimeout(() => { spread -= 1; renderOpenSpread(); busy = false; }, 880);
      } else {
        closeToCover();
      }
    }
  }

  function openBook(event) {
    event.preventDefault();
    spread = 0;
    renderClosedBook();
    count.textContent = `• / ${spreadCount}`;
    prev.disabled = true;
    next.disabled = false;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBook() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    link.focus();
  }

  link.addEventListener('click', openBook);
  close.addEventListener('click', closeBook);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeBook(); });
  prev.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  modal.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 45) return;
    turn(dx < 0 ? 1 : -1);
  }, { passive: true });
  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeBook();
    if (event.key === 'ArrowRight') turn(1);
    if (event.key === 'ArrowLeft') turn(-1);
  });

  renderClosedBook();
})();
