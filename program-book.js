(() => {
  function initProgramBook() {
    const trigger = document.querySelector('#program .text-link') || document.querySelector('#program a[href="#kontakt"]');
    if (!trigger || document.getElementById('program-book-modal')) return;

    // Kniha má 26 stran: prázdný přední přebal + 24 skutečných stran + prázdný zadní přebal.
    // Vnitřní JPG jsou ve formátu 11,69 × 8,27" (A4 na šířku).
    const pages = [
      { blank: true, label: 'Přední přebal' },
      ...Array.from({ length: 24 }, (_, i) => ({
        src: `assets/program_jpg/${i + 1}.jpg`,
        alt: `Program Z:LOMNICE – strana ${i + 1}`
      })),
      { blank: true, label: 'Zadní přebal' }
    ];

    // Tlačítko pro stažení kompletního programu v PDF.
    if (!document.querySelector('#program-pdf-download')) {
      const download = document.createElement('a');
      download.id = 'program-pdf-download';
      download.className = 'button filled program-pdf-download';
      download.href = 'assets/Program_Zlomnice.pdf';
      download.download = 'Program_ZLOMNICE.pdf';
      download.target = '_blank';
      download.rel = 'noopener';
      download.innerHTML = 'STÁHNOUT PROGRAM PDF <span>↓</span>';
      trigger.insertAdjacentElement('afterend', download);
    }

    const style = document.createElement('style');
    style.id = 'program-book-style';
    style.textContent = `
      #program-pdf-download{display:inline-flex;margin-left:14px;align-items:center;gap:10px}
      #program-pdf-download span{font-size:18px;line-height:1}
      @media(max-width:700px){#program-pdf-download{margin:12px 0 0;}}
      #program-book-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(15,14,12,.88);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .28s ease,visibility .28s ease}
      #program-book-modal.open{opacity:1;visibility:visible;pointer-events:auto}
      .pb-shell{position:relative;width:min(1240px,96vw);height:min(900px,94vh);display:flex;flex-direction:column;align-items:center;justify-content:center}
      .pb-close{position:absolute;right:0;top:0;z-index:50;width:44px;height:44px;border:1px solid rgba(255,255,255,.85);border-radius:50%;background:rgba(20,20,20,.65);color:#fff;font-size:26px;line-height:1;cursor:pointer;transition:background .2s,transform .2s}
      .pb-close:hover{background:#111;transform:rotate(5deg)}
      .pb-stage{width:100%;height:min(76vh,720px);display:flex;align-items:center;justify-content:center;perspective:3000px}
      .pb-book{position:relative;width:min(92vw,1200px);aspect-ratio:2.826 / 1;max-height:72vh;transform-style:preserve-3d;filter:drop-shadow(0 28px 34px rgba(0,0,0,.46))}
      .pb-page{position:absolute;top:0;width:50%;height:100%;overflow:hidden;background:#f7f0df;backface-visibility:hidden;transform-style:preserve-3d;will-change:transform;box-shadow:inset 0 0 28px rgba(60,45,25,.10)}
      .pb-page.left{left:0;transform-origin:right center;border-radius:10px 2px 2px 10px}
      .pb-page.right{right:0;transform-origin:left center;border-radius:2px 10px 2px 10px}
      .pb-page.cover{right:0;left:auto;transform-origin:left center;border-radius:2px 10px 2px 10px}
      .pb-page.back{left:0;right:auto;transform-origin:right center;border-radius:10px 2px 2px 10px}
      .pb-page.blank{background:#f7f0df}
      .pb-page img{width:100%;height:100%;display:block;object-fit:cover}
      .pb-page.turn{z-index:20;animation-duration:1.5s;animation-timing-function:cubic-bezier(.22,.61,.36,1);animation-fill-mode:both}
      .pb-page.turn-next{animation-name:pb-next}.pb-page.turn-prev{animation-name:pb-prev}
      .pb-page.turn:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(20,14,7,.30),rgba(255,255,255,.15) 35%,transparent 62%,rgba(20,14,7,.12));opacity:0;animation:pb-shade 1.5s ease both}
      @keyframes pb-next{0%{transform:rotateY(0) translateZ(0)}25%{transform:rotateY(-38deg) translateZ(5px)}50%{transform:rotateY(-92deg) translateZ(14px)}75%{transform:rotateY(-148deg) translateZ(9px)}100%{transform:rotateY(-180deg) translateZ(0)}}
      @keyframes pb-prev{0%{transform:rotateY(-180deg) translateZ(0)}25%{transform:rotateY(-142deg) translateZ(5px)}50%{transform:rotateY(-88deg) translateZ(14px)}75%{transform:rotateY(-32deg) translateZ(9px)}100%{transform:rotateY(0) translateZ(0)}}
      @keyframes pb-shade{0%,100%{opacity:0}45%{opacity:.62}}
      .pb-nav{display:flex;align-items:center;gap:12px;margin-top:16px;color:#fff}
      .pb-btn{width:52px;height:42px;border:1px solid rgba(255,255,255,.85);border-radius:22px;background:rgba(255,255,255,.07);color:#fff;cursor:pointer;font-size:18px;transition:background .2s,transform .2s}
      .pb-btn:hover:not(:disabled){background:rgba(255,255,255,.16);transform:translateY(-1px)}.pb-btn:disabled{opacity:.28;cursor:default}
      .pb-count{min-width:130px;text-align:center;font:600 12px/1 sans-serif;letter-spacing:.1em}.pb-hint{margin-top:8px;color:rgba(255,255,255,.72);font:500 10px/1.4 sans-serif;text-transform:uppercase;letter-spacing:.08em}
      @media(max-width:700px){
        #program-book-modal{padding:8px}.pb-shell{width:100%;height:100%}.pb-stage{width:100%;height:calc(100vh - 150px)}
        .pb-book{width:min(90vw,560px);aspect-ratio:11.69 / 8.27;max-height:none}
        .pb-page{width:100%!important;left:0!important;right:auto!important;border-radius:9px!important;transform-origin:center!important}
        .pb-page.turn{animation-duration:1.18s}.pb-nav{margin-top:10px}.pb-hint{font-size:9px;max-width:300px;text-align:center}
      }
      @media(prefers-reduced-motion:reduce){.pb-page.turn{animation-duration:.01ms!important}}
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'program-book-modal';
    modal.innerHTML = `<div class="pb-shell" role="dialog" aria-modal="true" aria-label="Program Z:LOMNICE"><button class="pb-close" type="button" aria-label="Zavřít">×</button><div class="pb-stage"><div class="pb-book"></div></div><div class="pb-nav"><button class="pb-btn" data-prev type="button" aria-label="Předchozí strana">←</button><span class="pb-count" data-count></span><button class="pb-btn" data-next type="button" aria-label="Další strana">→</button></div><div class="pb-hint">Listujte šipkami, tlačítky nebo přejetím prstem</div></div>`;
    document.body.appendChild(modal);

    const book = modal.querySelector('.pb-book'), prev = modal.querySelector('[data-prev]'), next = modal.querySelector('[data-next]'), count = modal.querySelector('[data-count]'), close = modal.querySelector('.pb-close');
    let state = 0, busy = false, startX = null;
    const isMobile = () => window.matchMedia('(max-width:700px)').matches;
    const makePage = (page, cls) => page.blank ? `<div class="pb-page ${cls} blank" aria-label="${page.label}"></div>` : `<div class="pb-page ${cls}"><img src="${page.src}" alt="${page.alt}"></div>`;

    function render() {
      if (isMobile()) {
        book.innerHTML = makePage(pages[state], 'back');
        count.textContent = `${state + 1} / ${pages.length}`;
        prev.disabled = state === 0; next.disabled = state === pages.length - 1; return;
      }
      if (state === 0) {
        book.innerHTML = makePage(pages[0], 'cover'); count.textContent = 'PŘEDNÍ PŘEBAL'; prev.disabled = true; next.disabled = false; return;
      }
      if (state === pages.length - 1) {
        book.innerHTML = makePage(pages[state], 'back'); count.textContent = 'ZADNÍ PŘEBAL'; prev.disabled = false; next.disabled = true; return;
      }
      book.innerHTML = makePage(pages[state], 'left') + makePage(pages[state + 1], 'right');
      count.textContent = `${state}–${state + 1} / 26`; prev.disabled = false; next.disabled = false;
    }

    function turn(dir) {
      if (busy) return;
      let target;
      if (isMobile()) target = state + dir;
      else if (state === 0 && dir > 0) target = 1;
      else if (state === 1 && dir < 0) target = 0;
      else if (state === pages.length - 2 && dir > 0) target = pages.length - 1;
      else if (state === pages.length - 1 && dir < 0) target = pages.length - 2;
      else target = state + 2 * dir;
      if (target < 0 || target >= pages.length) return;

      let el;
      if (isMobile() || state === 0 || state === pages.length - 1) el = book.querySelector('.pb-page');
      else el = dir > 0 ? book.querySelector('.pb-page.right') : book.querySelector('.pb-page.left');
      if (!el) return;

      busy = true; el.classList.add('turn', dir > 0 ? 'turn-next' : 'turn-prev');
      window.setTimeout(() => { state = target; render(); busy = false; }, isMobile() ? 1200 : 1520);
    }

    function openBook(e) { e.preventDefault(); state = 0; render(); modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeBook() { modal.classList.remove('open'); document.body.style.overflow = ''; }

    trigger.addEventListener('click', openBook); close.addEventListener('click', closeBook);
    modal.addEventListener('click', e => { if (e.target === modal) closeBook(); });
    prev.addEventListener('click', () => turn(-1)); next.addEventListener('click', () => turn(1));
    modal.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, { passive: true });
    modal.addEventListener('touchend', e => { if (startX === null) return; const dx = e.changedTouches[0].clientX - startX; startX = null; if (Math.abs(dx) > 45) turn(dx < 0 ? 1 : -1); }, { passive: true });
    document.addEventListener('keydown', e => { if (!modal.classList.contains('open')) return; if (e.key === 'Escape') closeBook(); if (e.key === 'ArrowRight') turn(1); if (e.key === 'ArrowLeft') turn(-1); });
    window.addEventListener('resize', () => { if (modal.classList.contains('open') && !busy) render(); });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initProgramBook, { once: true }); else initProgramBook();
})();
