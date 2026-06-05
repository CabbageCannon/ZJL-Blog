const ICON_SPRITE_PATH = "./assets/icons/sprite.svg";

// 创建本地 SVG sprite 图标
export function createIcon(iconName, className = "iconSvg iconSvg--md") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  use.setAttribute("href", `${ICON_SPRITE_PATH}#${iconName}`);

  svg.appendChild(use);
  return svg;
}
