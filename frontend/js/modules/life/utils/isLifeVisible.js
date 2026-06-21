export function isLifeVisible() {
  const lifeSection = document.querySelector("#life");
  if (!lifeSection) return false;

  return getComputedStyle(lifeSection).display !== "none";
}