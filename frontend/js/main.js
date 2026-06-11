import { initNav } from "./modules/nav/index.js";
import { initAuth } from "./modules/auth/index.js";
import { initHome } from "./modules/home/index.js";
import { initRouter } from "./modules/router/router.js";

// 初始化导航栏
initNav();

// 初始化注册登录板块
await initAuth();

// 初始化路由器
initRouter();

// 初始化首页板块
initHome();
