import { renderStudyNotes } from "./render.js";
import { studyState } from "./state.js";

export function bindEvents() {
  bindCategoryFilter();
}

// 绑定学习笔记分类筛选改变事件
function bindCategoryFilter() {
  const studyCardsWrap = document.querySelector("#study .studyCards");
  if (!studyCardsWrap) return;

  studyCardsWrap.addEventListener("click", handleCategoryChange);

  // 用键盘选中当前卡片可以用键盘操作
  studyCardsWrap.addEventListener("keydown", ev => {
    if (ev.key !== "Enter" && ev.key !== " ") return;

    const card=ev.target.closest(".studyCard");
    if(!card)return;

    ev.preventDefault();
    setActiveCategory(card)
    renderStudyNotes(studyState);
  })
}

// 处理点击学习卡片后学习笔记切换分类
function handleCategoryChange(ev) {
  const card = ev.target.closest(".studyCard");
  if (!card) return;
  ev.preventDefault();
  ev.stopPropagation();

  setActiveCategory(card);

  // 重新渲染
  renderStudyNotes(studyState);
}

// 设置新的学习笔记分类
function setActiveCategory(card) {
  const cards = Array.from(document.querySelectorAll("#study .studyCards .studyCard"));

  studyState.activeCategory = card.dataset.category || "all";

  cards.forEach(item => {
    item.classList.toggle("active", item === card);
  })
}
