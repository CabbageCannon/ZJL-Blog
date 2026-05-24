export function initNav(){
  // 点击 banner 中的四个按钮，跳转到对应板块
  // 获取 banner 中的四个按钮和四个板块
  const bannerButtons = document.querySelectorAll(".banner .nav ul li a");
  const sections = document.querySelectorAll(".indexContent .section");

  // 先记录每个板块初始的 display
  sections.forEach((section, index) => {
    section["originDisplay"] = getComputedStyle(section).display;
  });

  // 先让首页板块出现，其它板块隐藏
  sections.forEach((section, index) => {
    if (index === 0)
      return;
    else
      section.style.display = 'none';
  })

  // 给四个按钮添加点击事件
  bannerButtons.forEach((button, index) => {
    button.addEventListener('click', function (ev) {
      ev.preventDefault();
      let name = button.getAttribute('name');
      sections.forEach((section, index) => {
        if (name === section.id)
          section.style.display = section["originDisplay"];
        else
          section.style.display = 'none';
      })
    })
  });
}
