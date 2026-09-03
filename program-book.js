(() => {
  function initProgramBook() {
    const trigger = document.querySelector('#program .text-link') || document.querySelector('#program a[href="#kontakt"]');
    if (!trigger || document.getElementById('program-book-modal')) return;

    const pages = [
      {src:'assets/program_lomnice.png', alt:'Přední obálka programu'},
      {placeholder:'Programová stránka 1'}, {placeholder:'Programová stránka 2'},
      {placeholder:'Programová stránka 3'}, {placeholder:'Programová stránka 4'},
      {placeholder:'Programová stránka 5'}, {placeholder:'Programová stránka 6'},
      {placeholder:'Programová stránka 7'},
      {src:'assets/program_lomnice.png', alt:'Zadní obálka programu'}
    ];

    const style=document.createElement('style');
    style.id='program-book-style';
    style.textContent=`
#program-book-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,14,12,.84);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .28s ease,visibility .28s ease}
#program-book-modal.open{opacity:1;visibility:visible;pointer-events:auto}
.pb-shell{position:relative;width:min(1120px,96vw);height:min(850px,94vh);display:flex;flex-direction:column;align-items:center;justify-content:center}
.pb-close{position:absolute;right:0;top:0;z-index:50;width:44px;height:44px;border:1px solid #fff;border-radius:50%;background:#222c;color:#fff;font-size:26px;cursor:pointer}
.pb-stage{width:min(920px,94vw);height:min(640px,74vh);display:flex;align-items:center;justify-content:center;perspective:3200px}
.pb-book{position:relative;width:min(880px,90vw);height:min(600px,70vh);transform-style:preserve-3d;filter:drop-shadow(0 25px 30px rgba(0,0,0,.4))}
.pb-page{position:absolute;top:0;width:50%;height:100%;overflow:hidden;background:#f7f0df;backface-visibility:hidden;transform-style:preserve-3d;will-change:transform;box-shadow:inset 0 0 28px rgba(60,45,25,.1)}
.pb-page.left{left:0;transform-origin:right center;border-radius:10px 2px 2px 10px}.pb-page.right{right:0;transform-origin:left center;border-radius:2px 10px 10px 2px}
.pb-page.cover{width:50%;left:auto;right:0;transform-origin:left center;border-radius:2px 10px 10px 2px}.pb-page.back{left:0;right:auto;transform-origin:right center;border-radius:10px 2px 2px 10px}
.pb-page img{width:100%;height:100%;display:block;object-fit:cover}.pb-page.empty{display:flex;align-items:center;justify-content:center;padding:30px;color:#665f50;text-align:center;font:500 18px/1.5 inherit}
.pb-page.turn{z-index:20;animation-duration:1.55s;animation-timing-function:cubic-bezier(.22,.61,.36,1);animation-fill-mode:both}.pb-page.turn-next{animation-name:pb-next}.pb-page.turn-prev{animation-name:pb-prev}
.pb-page.turn:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(20,14,7,.3),rgba(255,255,255,.14) 35%,transparent 62%,rgba(20,14,7,.12));opacity:0;animation:pb-shade 1.55s ease both}
@keyframes pb-next{0%{transform:rotateY(0) translateZ(0)}25%{transform:rotateY(-38deg) translateZ(5px)}50%{transform:rotateY(-92deg) translateZ(14px)}75%{transform:rotateY(-148deg) translateZ(9px)}100%{transform:rotateY(-180deg) translateZ(0)}}
@keyframes pb-prev{0%{transform:rotateY(-180deg) translateZ(0)}25%{transform:rotateY(-142deg) translateZ(5px)}50%{transform:rotateY(-88deg) translateZ(14px)}75%{transform:rotateY(-32deg) translateZ(9px)}100%{transform:rotateY(0) translateZ(0)}}
@keyframes pb-shade{0%,100%{opacity:0}45%{opacity:.62}}
.pb-nav{display:flex;align-items:center;gap:12px;margin-top:14px;color:#fff}.pb-btn{width:52px;height:42px;border:1px solid #fffc;border-radius:22px;background:#ffffff12;color:#fff;cursor:pointer;font-size:18px}.pb-btn:disabled{opacity:.28;cursor:default}.pb-count{min-width:120px;text-align:center;font:600 12px/1 sans-serif;letter-spacing:.1em}.pb-hint{margin-top:8px;color:#fffb;font:500 11px/1.4 sans-serif;text-transform:uppercase;letter-spacing:.08em}
@media(max-width:700px){#program-book-modal{padding:8px}.pb-shell{width:100%;height:100%}.pb-stage{width:94vw;height:min(70vh,560px)}.pb-book{width:90vw;height:min(66vh,510px)}.pb-page{width:100%!important;left:0!important;right:auto!important;border-radius:9px!important;transform-origin:center!important}.pb-page.turn{animation-duration:1.25s}.pb-nav{margin-top:10px}.pb-hint{font-size:10px;max-width:290px;text-align:center}}
@media(prefers-reduced-motion:reduce){.pb-page.turn{animation-duration:.01ms!important}}
`;
    document.head.appendChild(style);

    const modal=document.createElement('div');
    modal.id='program-book-modal';
    modal.innerHTML='<div class="pb-shell" role="dialog" aria-modal="true" aria-label="Program"><button class="pb-close" type="button" aria-label="Zavřít">×</button><div class="pb-stage"><div class="pb-book"></div></div><div class="pb-nav"><button class="pb-btn" data-prev type="button" aria-label="Předchozí strana">←</button><span class="pb-count" data-count></span><button class="pb-btn" data-next type="button" aria-label="Další strana">→</button></div><div class="pb-hint">Listujte šipkami nebo přejetím prstem</div></div>';
    document.body.appendChild(modal);

    const book=modal.querySelector('.pb-book'),prev=modal.querySelector('[data-prev]'),next=modal.querySelector('[data-next]'),count=modal.querySelector('[data-count]'),close=modal.querySelector('.pb-close');
    let state=0,busy=false,startX=null;
    const isMobile=()=>window.matchMedia('(max-width:700px)').matches;
    const makePage=(p,cls)=>`<div class="pb-page ${cls}${p.placeholder?' empty':''}">${p.src?`<img src="${p.src}" alt="${p.alt||''}">`:`<span>${p.placeholder}</span>`}</div>`;

    function render(){
      if(isMobile()){
        book.innerHTML=makePage(pages[state],'back');
        count.textContent=`${state+1} / ${pages.length}`;
        prev.disabled=state===0;next.disabled=state===pages.length-1;return;
      }
      if(state===0){book.innerHTML=makePage(pages[0],'cover');count.textContent=`1 / ${pages.length}`;prev.disabled=true;next.disabled=false;return;}
      if(state===pages.length-1){book.innerHTML=makePage(pages[state],'back');count.textContent=`${pages.length} / ${pages.length}`;prev.disabled=false;next.disabled=true;return;}
      book.innerHTML=makePage(pages[state],'left')+makePage(pages[state+1],'right');
      count.textContent=`${state}–${state+1} / ${pages.length}`;prev.disabled=false;next.disabled=false;
    }

    function turn(dir){
      if(busy)return;
      let target;
      if(isMobile()) target=state+dir;
      else if(state===0 && dir>0) target=1;
      else if(state===1 && dir<0) target=0;
      else if(state===pages.length-2 && dir>0) target=pages.length-1;
      else if(state===pages.length-1 && dir<0) target=pages.length-2;
      else target=state+2*dir;
      if(target<0||target>=pages.length)return;
      let el;
      if(isMobile()) el=book.querySelector('.pb-page');
      else if(state===0 && dir>0) el=book.querySelector('.pb-page');
      else if(state===pages.length-1 && dir<0) el=book.querySelector('.pb-page');
      else el=dir>0?book.querySelector('.pb-page.right'):book.querySelector('.pb-page.left');
      if(!el)return;
      busy=true;
      el.classList.add('turn',dir>0?'turn-next':'turn-prev');
      window.setTimeout(()=>{state=target;render();busy=false},isMobile()?1280:1580);
    }

    function openBook(e){e.preventDefault();state=0;render();modal.classList.add('open');document.body.style.overflow='hidden';}
    function closeBook(){modal.classList.remove('open');document.body.style.overflow='';}
    trigger.addEventListener('click',openBook);
    close.addEventListener('click',closeBook);
    modal.addEventListener('click',e=>{if(e.target===modal)closeBook()});
    prev.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));
    modal.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});
    modal.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;startX=null;if(Math.abs(dx)>45)turn(dx<0?1:-1)},{passive:true});
    document.addEventListener('keydown',e=>{if(!modal.classList.contains('open'))return;if(e.key==='Escape')closeBook();if(e.key==='ArrowRight')turn(1);if(e.key==='ArrowLeft')turn(-1)});
    window.addEventListener('resize',()=>{if(modal.classList.contains('open')&&!busy)render()});
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initProgramBook,{once:true});else initProgramBook();
})();