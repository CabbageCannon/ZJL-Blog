export function isLifeVisible() {
  const lifeSection = document.querySelector(".section#life");
  return lifeSection.style.display !== "none";
}