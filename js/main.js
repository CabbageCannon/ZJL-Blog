import { initNav } from "./modules/nav/index.js";
import { initHome } from "./modules/home/index.js";
import { initMusic } from "./modules/music/index.js";
import { showSection } from "./modules/utils/sectionSwitch.js";

// 初始化首页板块
initHome();
// 初始化音乐板块
initMusic();
// 初始化导航栏
initNav();