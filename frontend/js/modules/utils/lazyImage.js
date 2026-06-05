// 实现图片懒加载
// 传入一个img元素，当视口上下扩展200px时出现img后加载它
let lazyImageObserver = null;

export function observeLazyImage(img) {
  if (!img) return;

  // 如果还不存在这个监听对象，就创建
  if (!lazyImageObserver) {
    // [回调函数][配置项]
    lazyImageObserver = new IntersectionObserver((entrys) => {
      entrys.forEach(entry => {
        // 还没有进入视口,直接返回
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const realSrc = target.dataset.src;

        if (realSrc) {
          target.src = realSrc;
          target.removeAttribute("data-src");
        }

        // 处理过后不再监听
        lazyImageObserver.unobserve(target);
      })
    }, {
      // root:document.querySelector(...)可以指定,默认是浏览器窗口

      // 表示监听原本视口向上下增加200px的视口
      rootMargin: "200px 0px"
    })
  }

  // 绑定监听
  lazyImageObserver.observe(img);
}