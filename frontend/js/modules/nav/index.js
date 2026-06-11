import { showSection } from "../utils/sectionSwitch.js";

const navLinks = Array.from(document.querySelectorAll(".banner .nav a"));

export async function initNav() {
  // 为导航栏按钮添加转换页面功能
  navLinks.forEach(link => {
    link.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      showSection(link.getAttribute("name"));
    })
  })

  // 首屏默认是home
  navLinks.forEach(link => {
    if (link.classList.toggle("is-active", link.getAttribute("name") === "home"));
  })
}
