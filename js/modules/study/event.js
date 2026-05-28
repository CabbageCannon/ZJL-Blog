import { renderStudyNotes } from "./render.js";
import { studyState } from "./state.js";

export function bindEvents() {
  bindCategoryFilter();
}

function bindCategoryFilter() {
  const cards = document.querySelectorAll("#study .studyCards .studyCard");

  cards.forEach(card => {
    card.addEventListener('click', (ev) => {
      studyState.activeCategory = card.dataset.category || "all";

      cards.forEach(item => {
        item.classList.toggle("active", item === card);
      })

      renderStudyNotes(studyState);
    })
  })
}
