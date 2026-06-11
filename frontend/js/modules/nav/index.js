const navLinks = Array.from(document.querySelectorAll(".banner .nav a"));

export async function initNav() {
  // 为导航栏按钮添加转换页面功能
  navLinks.forEach(link => {
    link.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      window.location.hash = link.getAttribute("name");
    })
  })
}
