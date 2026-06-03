// 检验当前是否是移动端布局
export function isMobileView() {
  return window.matchMedia("(max-width:768px)").matches;
}