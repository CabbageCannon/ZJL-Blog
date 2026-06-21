import { loadSectionModule } from "./sectionLoader.js";
import { showToast } from "./toast.js";

const sections = Array.from(document.querySelectorAll(".indexContent section[id]"));
const navLinks = Array.from(document.querySelectorAll(".banner .site-nav button"));
// 刚进入网页时，展示的是首页
let lastSectionId = "home";
// 展示指定板块
export async function showSection(nextSectionId) {
  const targetSection = sections.find(section => section.id === nextSectionId);
  if (!targetSection) return;

  // 展示对应内容页
  sections.forEach(section => section.style.display = section.id === nextSectionId ? "block" : "none");

  // 更新导航栏中具体按钮的状态
  navLinks.forEach(link => link.classList.toggle("is-active", link.dataset.page === nextSectionId));

  targetSection.classList.add("is-loading");

  // 初始化该模块
  try {
    await loadSectionModule(nextSectionId);
  } catch (err) {
    console.error(err);
    showToast("该模块加载失败", "error")
    return;
  } finally {
    targetSection.classList.remove("is-loading");
  }

  // 页面切换完成后，发出一个通知
  document.dispatchEvent(new CustomEvent("section:show", {
    detail: {
      lastSectionId,
      nextSectionId
    }
  }));

  lastSectionId = nextSectionId;
}