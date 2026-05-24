const sections=Array.from(document.querySelectorAll(".indexContent .section"));
const navLinks=Array.from(document.querySelectorAll(".banner .nav a"));

// 展示指定板块
export function showSection(sectionId) {
  console.log(sectionId);
  const targetSection = sections.find(section => section.id === sectionId);
  if (!targetSection) return;

  // 展示对应内容页
  sections.forEach(section => section.style.display = section.id === sectionId ? "block" : "none");

  // 更新导航栏中具体按钮的状态
  navLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("name") === sectionId));
}