export function bindEvents(){
  qucikLinksModal();
}

// 给快捷入口绑定跳转功能
function qucikLinksModal(){
  const quickCards=Array.from(document.querySelectorAll(".indexContent #home .quickCard"));

  quickCards.forEach(quickCard=>{
    quickCard.addEventListener("click",(ev)=>{
      ev.preventDefault();
      ev.stopPropagation();

      window.location.hash=quickCard.dataset.target;
    })
  })
}
