export function isLifeVisible() {
  const lifeSection = document.querySelector(".section#life");
  if (!lifeSection) return false;

  return getComputedStyle(lifeSection).display !== "none";
}