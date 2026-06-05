import { initEvents } from "./event.js";
import { lifeState } from "./state.js";
import { fetchDiaries } from "./api.js";
import { render } from "./render.js";
import { isLifeVisible } from "./utils/isLifeVisible.js";
import { loadToken } from "../utils/userStorage.js";

export async function initLife() {
  // 尝试从后端拉取日记数据
  await loadLifeDiaries();

  document.addEventListener("auth:login", loadLifeDiaries);

  document.addEventListener("auth:logout", () => {
    lifeState.diaryList = [];
    lifeState.isEdit = false;
    lifeState.selectDiariesId = [];
    if (isLifeVisible())
      render();
  })

  // 绑定事件
  initEvents();
};

// 获取日数据并刷新到页面上
async function loadLifeDiaries() {
  // 如果登录已过期则直接清空生活板块日记区并直接返回
  const token = loadToken();
  if (!token) {
    lifeState.diaryList = [];
    lifeState.isEdit = false;
    lifeState.selectDiariesId = [];

    if (isLifeVisible()) {
      render();
    }

    return;
  }

  try {
    const diaries = await fetchDiaries();
    lifeState.diaryList = diaries;
  } catch (err) {
    lifeState.diaryList = [];
    console.error(err);
  }

  lifeState.isEdit = false;
  lifeState.selectDiariesId = [];
  if (isLifeVisible())
    render();
}