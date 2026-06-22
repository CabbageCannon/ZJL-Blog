export function bindEvents(){
  qucikLinksModal();
  bindHomeReveals();
}

// 给快捷入口绑定跳转功能
function qucikLinksModal(){
  const quickCards=Array.from(document.querySelectorAll(".indexContent #home .quickCardWrap"));

  quickCards.forEach(quickCard=>{
    quickCard.addEventListener("click",(ev)=>{
      ev.preventDefault();
      ev.stopPropagation();

      window.location.hash=quickCard.dataset.target;
    })
  })
}

function bindHomeReveals(){
  const homeSection=document.querySelector("#home");
  const hero=document.querySelector("#home .homeHero");
  const about=document.querySelector("#home .homeAbout");
  const updates=document.querySelector("#home .homeUpdates");
  const revealTargets=[about,updates].filter(Boolean);

  revealHero(hero);

  document.addEventListener("section:show",ev=>{
    const detail=ev.detail || {};

    if(detail.lastSectionId==="home" && detail.nextSectionId!=="home"){
      hero?.classList.remove("is-visible");
      return;
    }

    if(detail.nextSectionId==="home"){
      revealHero(hero);
    }
  })

  if(revealTargets.length===0) return;

  if(!("IntersectionObserver" in window)){
    revealTargets.forEach(target=>target.classList.add("is-visible"));
    return;
  }

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    })
  },{
    root: homeSection,
    threshold:.35
  });

  revealTargets.forEach(target=>observer.observe(target));
}

function revealHero(hero){
  if(!hero) return;

  hero.classList.remove("is-visible");
  void hero.offsetWidth;
  hero.classList.add("is-visible");
}
