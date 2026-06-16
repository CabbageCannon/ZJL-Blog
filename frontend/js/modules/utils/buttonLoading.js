// 给按钮设置和移除加载状态
export function setButtonLoading(button, loading, loadingText = "处理中...") {
  if (!button) return;

  const textNode = button.querySelector("span") || button;

  if (!button.dataset.originText) {
    button.dataset.originText = textNode.textContent.trim();
  }

  button.classList.toggle("is-loading", loading);
  button.setAttribute("aria-busy", loading ? "true" : "false");

  if ("disabled" in button) {
    button.disabled = loading;
  } else {
    button.setAttribute("aria-disabled", loading ? "true" : "false");
  }

  textNode.textContent = loading ? loadingText : button.dataset.originText;
}
