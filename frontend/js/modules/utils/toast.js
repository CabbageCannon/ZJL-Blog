// 显示提示信息，默认类型是info，默认展示时间是2.6s
export function showToast(message, type = "info", duration = 2600) {
  const container = getContainer();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  // 用于无障碍阅读
  toast.setAttribute("role", type === "error" ? "alert" : "status");

  container.appendChild(toast);

  // 下一帧添加这个帧,避免动画没出来
  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  })

  window.setTimeout(() => {
    toast.classList.remove("is-visible");

    toast.addEventListener("transitionend", () => {
      toast.remove();
    }, { once: true });

    // 兜底,防止因为某些bug,或者用户切换页面等等使得transitioned没有成功触发
    window.setTimeout(() => {
      toast.remove();
    }, 300)
  }, duration);
}

// 获取展示消息的容器
function getContainer() {
  let container = document.querySelector(".toastStack");

  if (!container) {
    container = document.createElement("div");
    container.className = "toastStack";
    document.body.appendChild(container);
  }

  return container;
}