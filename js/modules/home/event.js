import { showSection } from "../utils/sectionSwitch.js";

export function bindEvents(){
  qucikLinksModal();
}

// 给快捷入口绑定跳转功能
function qucikLinksModal(){
  const quickCards=Array.from(document.querySelectorAll(".indexContent #home .homeQuickLinks .quickCard"));

  quickCards.forEach(quickCard=>{
    quickCard.addEventListener("click",(ev)=>{
      ev.preventDefault();
      ev.stopPropagation();

      showSection(quickCard.dataset.target);
    })
  })
}