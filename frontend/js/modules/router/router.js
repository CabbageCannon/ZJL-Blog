import { showSection } from "../utils/sectionSwitch.js";

const validSections = new Set(["home", "life", "music", "study", "settings"]);
function initRouter() {
  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();
}

async function handleHashChange(ev = null) {
  if (ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  let sectionId = window.location.hash.replace("#", "");
  validSections.has(sectionId) ? null : (sectionId = "home");
  try {
    await showSection(sectionId);
  } catch (err) {
    console.error(err);
  }
}

export {
  initRouter
};
