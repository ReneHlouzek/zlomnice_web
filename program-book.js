(() => {
  const PROGRAM_PAGES = [
    { src: 'assets/program_lomnice.png', alt: 'Úvodní obálka programu' },
    { placeholder: 'Tato strana programu bude doplněna.' },
    { placeholder: 'Tato strana programu bude doplněna.' },
    { placeholder: 'Tato strana programu bude doplněna.' },
    { placeholder: 'Tato strana programu bude doplněna.' },
    { placeholder: 'Tato strana programu bude doplněna.' },
    { placeholder: 'Tato strana programu bude doplněna.' },
    { placeholder: 'Tato strana programu bude doplněna.' },
    { src: 'assets/program_lomnice.png', alt: 'Zadní obálka programu' }
  ];
  const link = document.querySelector('#program .text-link');
  if (!link) return;

  const style = document.createElement('style');
  style.id = 'program-book-fix-style';
  style.textContent = `
    #program-book-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(18,18,16,.78);backdrop-filter:blur(6px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .35s ease,visibility .35s ease}
    #program-book-modal.is-open{opacity:1;visibility:visible;pointer-events:auto}
    #program-book-modal *{box-sizing:border-box}
    .program-book-shell{position:relative;width:min(1160px,96vw);height:min(860px,94vh);display:flex;flex-direction:column;align-items:center;justify-content:center}
    .program-book-close{position:absolute;right:0;top:0;width:44px;height:44px;border:1px solid rgba(255,255,255,.7);border-radius:50%;background:rgba(0,0,0,.25);color:#fff;font-size:26px;line-height:1;cursor:pointer;z-index:40}
    .program-book-stage{position:relative;width:min(940px,94vw);height:min(670px,78vh);perspective:2600px;display:flex;align-items:center;justify-content:center}
    .program-book{position:relative;width:min(880px,90vw);height:min(600px,70vh);transform-style:preserve-3d;filter:drop-shadow(0 28px 34px rgba(0,0,0,.34))}
    .program-book:before{content:"";position:absolute;left:50%;top:0;bottom:0;width:6px;transform:translateX(-50%);background:linear-gradient(90deg,rgba(55,40,20,.28),rgba(255,255,255,.42),rgba(55,40,20,.20));z-index:20;border-radius:50%;box-shadow:0 0 7px rgba(0,0,0,.12)}
    .program-book-page{position:absolute;top:0;bottom:0;width:50%;overflow:hidden;background:#f7f0df;box-shadow:inset 0 0 28px rgba(70,50,20,.12);backface-visibility:hidden;transform-style:preserve-3d;will-change:transform,box-shadow}
    .program-book-page.left{left:0;border-radius:11px 2px 2px 11px;transform-origin:right center}
    .program-book-page.right{right:0;border-radius:2px 11px 11px 2px;transform-origin:left center}
    .program-book-page img{display:block;width:100%;height:100%;object-fit:cover}
    .program-book-page.empty{display:flex;align-items:center;justify-content:center;padding:30px;color:#665f50;text-align:center;font:500 18px/1.5 inherit}
    .program-book-page.empty span{max-width:260px}
    .program-book-page.turn-next{animation:programBookNext 1.18s cubic-bezier(.25,.72,.18,1) forwards;z-index:12}
    .program-book-page.turn-prev{animation:programBookPrev 1.18s cubic-bezier(.25,.72,.18,1) forwards;z-index:12}
    .program-book-page.turn-next:after,.program-book-page.turn-prev:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(15,10,4,.28),rgba(255,255,255,.12) 28%,transparent 58%,rgba(20,15,8,.16));opacity:0;animation:paperShade 1.18s ease forwards}
    @keyframes programBookNext{0%{transform:rotateY(0) translateZ(0) rotateZ(0);box-shadow:0 0 0 rgba(0,0,0,0)}12%{transform:rotateY(-12deg) translateZ(5px) rotateZ(-.08deg);box-shadow:-3px 4px 8px rgba(0,0,0,.08)}35%{transform:rotateY(-62deg) translateZ(15px) rotateZ(-.28deg);box-shadow:-15px 10px 23px rgba(0,0,0,.18)}55%{transform:rotateY(-108deg) translateZ(22px) rotateZ(-.45deg);box-shadow:-27px 14px 34px rgba(0,0,0,.26)}76%{transform:rotateY(-158deg) translateZ(12px) rotateZ(-.18deg);box-shadow:-12px 9px 21px rgba(0,0,0,.17)}91%{transform:rotateY(-174deg) translateZ(3px) rotateZ(-.04deg);box-shadow:-3px 3px 7px rgba(0,0,0,.08)}100%{transform:rotateY(-180deg) translateZ(0) rotateZ(0);box-shadow:0 0 0 rgba(0,0,0,0)}}
    @keyframes programBookPrev{0%{transform:rotateY(-180deg) translateZ(0) rotateZ(0);box-shadow:0 0 0 rgba(0,0,0,0)}12%{transform:rotateY(-168deg) translateZ(3px) rotateZ(.04deg);box-shadow:3px 3px 7px rgba(0,0,0,.08)}35%{transform:rotateY(-118deg) translateZ(12px) rotateZ(.18deg);box-shadow:12px 9px 21px rgba(0,0,0,.17)}55%{transform:rotateY(-72deg) translateZ(22px) rotateZ(.45deg);box-shadow:27px 14px 34px rgba(0,0,0,.26)}76%{transform:rotateY(-22deg) translateZ(15px) rotateZ(.28deg);box-shadow:15px 10px 23px rgba(0,0,0,.18)}91%{transform:rotateY(-6deg) translateZ(5px) rotateZ(.08deg);box-shadow:3px 4px 8px rgba(0,0,0,.08)}100%{transform:rotateY(0) translateZ(0) rotateZ(0);box-shadow:0 0 0 rgba(0,0,0,0)}}
    @keyframes paperShade{0%,100%{opacity:0}18%{opacity:.25}50%{opacity:.82}82%{opacity:.18}}
    .program-book-nav{display:flex;align-items:center;gap:12px;margin-top:16px;color:#fff}
    .program-book-btn{min-width:48px;height:42px;padding:0 16px;border:1px solid rgba(255,255,255,.65);border-radius:999px;background:rgba(255,255,255,.08);color:#fff;font:600 13px/1 inherit;cursor:pointer}
    .program-book-btn:disabled{opacity:.35;cursor:default}
    .program-book-count{min-width:105px;text-align:center;font:600 12px/1 inherit;letter-spacing:.12em}
    .program-book-hint{margin-top:8px;color:rgba(255,255,255,.72);font:500 11px/1.4 inherit;letter-spacing:.08em;text-transform:uppercase;text-align:center}
    @media(max-width:700px){
      #program-book-modal{padding:8px}
      .program-book-shell{width:100%;height:100%}
      .program-book-close{right:2px;width:40px;height:40px}
      .program-book-stage{width:94vw;height:min(65vh,560px)}
      .program-book{width:min(88vw,390px);height:min(61vh,510px)}
      .program-book-page{width:100%;left:0!important;right:auto!important;border-radius:9px!important;transform-origin:center center!important}
      .program-book-page.right{display:none}
      .program-book:before{display:none}
      .program-book-page.turn-next{animation:programBookMobileNext 1.02s cubic-bezier(.25,.72,.18,1) forwards}
      .program-book-page.turn-prev{animation:programBookMobilePrev 1.02s cubic-bezier(.25,.72,.18,1) forwards}
      @keyframes programBookMobileNext{0%{transform:rotateY(0) translateZ(0) rotateZ(0);box-shadow:0 0 0 rgba(0,0,0,0)}18%{transform:rotateY(-22deg) translateZ(5px) rotateZ(-.12deg);box-shadow:-6px 5px 12px rgba(0,0,0,.11)}48%{transform:rotateY(-96deg) translateZ(16px) rotateZ(-.28deg);box-shadow:-23px 13px 32px rgba(0,0,0,.25)}76%{transform:rotateY(-158deg) translateZ(9px) rotateZ(-.12deg);box-shadow:-10px 8px 18px rgba(0,0,0,.15)}100%{transform:rotateY(-180deg) translateZ(0);box-shadow:0 0 0 rgba(0,0,0,0)}}
      @keyframes programBookMobilePrev{0%{transform:rotateY(-180deg) translateZ(0);box-shadow:0 0 0 rgba(0,0,0,0)}24%{transform:rotateY(-158deg) translateZ(9px) rotateZ(.12deg);box-shadow:10px 8px 18px rgba(0,0,0,.15)}52%{transform:rotateY(-84deg) translateZ(16px) rotateZ(.28deg);box-shadow:23px 13px 32px rgba(0,0,0,.25)}82%{transform:rotateY(-18deg) translateZ(5px) rotateZ(.12deg);box-shadow:6px 5px 12px rgba(0,0,0,.11)}100%{transform:rotateY(0) translateZ(0);box-shadow:0 0 0 rgba(0,0,0,0)}}
      .program-book-page.turn-next:after,.program-book-page.turn-prev:after{animation-duration:1.02s}
      .program-book-nav{margin-top:10px;gap:8px}
      .program-book-btn{height:40px;min-width:42px;padding:0 12px}
      .program-book-count{min-width:80px;font-size:11px}
    }
    @media(prefers-reduced-motion:reduce){#program-book-modal,.program-book-page.turn-next,.program-book-page.turn-prev{transition:none;animation-duration:.01ms!important}}
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.id = 'program-book-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `<div class="program-book-shell" role="dialog" aria-modal="true" aria-label="Program Z:LOMNICE"><button class="program-book-close" type="button" aria-label="Zavřít program">×</button><div class="program-book-stage"><div class="program-book"></div></div><div class="program-book-nav"><button class="program-book-btn" type="button" data-book-prev aria-label="Předchozí strana">←</button><span class="program-book-count" data-book-count></span><button class="program-book-btn" type="button" data-book-next aria-label="Další strana">→</button></div><div class="program-book-hint">Klikněte na šipky nebo listujte prstem</div></div>`;
  document.body.appendChild(modal);

  const book = modal.querySelector('.program-book'), close = modal.querySelector('.program-book-close'), prev = modal.querySelector('[data-book-prev]'), next = modal.querySelector('[data-book-next]'), count = modal.querySelector('[data-book-count]');
  let current = 0, busy = false, touchStartX = null;
  function pageHtml(page, side){ if(page?.src)return `<div class="program-book-page ${side}"><img src="${page.src}" alt="${page.alt||''}"></div>`; return `<div class="program-book-page ${side} empty"><span>${page?.placeholder||''}</span></div>`; }

  function render(){
    const mobile=window.matchMedia('(max-width:700px)').matches;
    if(mobile){
      book.innerHTML=pageHtml(PROGRAM_PAGES[current],'left');
      count.textContent=`${current+1} / ${PROGRAM_PAGES.length}`;
      prev.disabled=current<=0; next.disabled=current>=PROGRAM_PAGES.length-1;
    }else if(current===0){
      book.innerHTML=pageHtml(PROGRAM_PAGES[0],'left');
      const p=book.querySelector('.left'); p.style.width='100%'; p.style.left='0'; p.style.right='auto'; p.style.transformOrigin='right center';
      count.textContent=`1 / ${PROGRAM_PAGES.length}`; prev.disabled=true; next.disabled=false;
    }else if(current===PROGRAM_PAGES.length-1){
      book.innerHTML=pageHtml(PROGRAM_PAGES[current],'left');
      const p=book.querySelector('.left'); p.style.width='100%'; p.style.left='0'; p.style.right='auto'; p.style.transformOrigin='left center';
      count.textContent=`${PROGRAM_PAGES.length} / ${PROGRAM_PAGES.length}`; prev.disabled=false; next.disabled=true;
    }else{
      book.innerHTML=pageHtml(PROGRAM_PAGES[current],'left')+pageHtml(PROGRAM_PAGES[current+1],'right');
      count.textContent=`${current}–${current+1} / ${PROGRAM_PAGES.length}`; prev.disabled=false; next.disabled=current+2>=PROGRAM_PAGES.length;
    }
  }

  function turn(direction){
    if(busy)return;
    const mobile=window.matchMedia('(max-width:700px)').matches;
    const step=mobile?1:2;
    let target=current+direction*step;
    if(!mobile){ if(current===0&&direction===1)target=1; if(current===1&&direction===-1)target=0; if(current===PROGRAM_PAGES.length-2&&direction===1)target=PROGRAM_PAGES.length-1; if(current===PROGRAM_PAGES.length-1&&direction===-1)target=PROGRAM_PAGES.length-2; }
    if(target<0||target>=PROGRAM_PAGES.length)return;
    const turningPage=mobile?book.querySelector('.left'):(direction===1?book.querySelector('.right'):book.querySelector('.left'));
    if(!turningPage)return;
    busy=true; turningPage.classList.add(direction===1?'turn-next':'turn-prev');
    window.setTimeout(()=>{current=target;render();busy=false;},mobile?1040:1200);
  }
  function openBook(e){e.preventDefault();current=0;render();modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
  function closeBook(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';link.focus();}
  link.addEventListener('click',openBook); close.addEventListener('click',closeBook); modal.addEventListener('click',e=>{if(e.target===modal)closeBook()}); prev.addEventListener('click',()=>turn(-1)); next.addEventListener('click',()=>turn(1));
  modal.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX},{passive:true});
  modal.addEventListener('touchend',e=>{if(touchStartX===null)return;const dx=e.changedTouches[0].clientX-touchStartX;touchStartX=null;if(Math.abs(dx)>=45)turn(dx<0?1:-1)},{passive:true});
  document.addEventListener('keydown',e=>{if(!modal.classList.contains('is-open'))return;if(e.key==='Escape')closeBook();if(e.key==='ArrowRight')turn(1);if(e.key==='ArrowLeft')turn(-1)});
  window.addEventListener('resize',()=>{if(modal.classList.contains('is-open')&&!busy)render()});
  render();
})();
