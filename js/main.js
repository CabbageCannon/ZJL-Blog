import { initNav } from "./modules/nav/index.js";
import { initHome } from "./modules/home/index.js";
import { initLife } from "./modules/life/index.js";
import { initMusic } from "./modules/music/index.js";

// 初始化首页板块
initHome();
// 初始化音乐板块
initMusic();
// 初始化生活板块
await initLife();
// 初始化导航栏
initNav();