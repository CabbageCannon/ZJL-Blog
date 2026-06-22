import { initEvents } from "./event.js";
import { lifeState } from "./state.js";
import { fetchDiaries } from "./api.js";
import { render } from "./render.js";
import { isLifeVisible } from "./utils/isLifeVisible.js";
import { loadToken } from "../utils/userStorage.js";

let hasLoadedLifeDiaries = false;
let loadingLifeDiariesPromise = null;
let loadedToken = null;

export async function initLife() {
  // 尝试从后端拉取日记数据
  await loadLifeDiaries();

  document.addEventListener("auth:login", () => {
    loadLifeDiaries({ force: true });
  });

  document.addEventListener("auth:logout", () => {
    hasLoadedLifeDiaries = false;
    loadingLifeDiariesPromise = null;
    loadedToken = null;
    lifeState.diaryList = [];
    lifeState.isEdit = false;
    lifeState.selectDiariesId = [];
    if (isLifeVisible())
      render();
  })

  // 绑定事件
  document.addEventListener("section:show", ev => {
    if (ev.detail?.nextSectionId === "life")
      render();
  });

  initEvents();
};

// 获取日记数据并刷新到页面上
async function loadLifeDiaries(options = {}) {
  const { force = false } = options;
  // 如果登录已过期则直接清空生活板块日记区并直接返回
  const token = loadToken();
  if (!token) {
    hasLoadedLifeDiaries = false;
    loadingLifeDiariesPromise = null;
    loadedToken = null;
    lifeState.diaryList = [];
    lifeState.isEdit = false;
    lifeState.selectDiariesId = [];

    if (isLifeVisible()) {
      render();
    }

    return;
  }

  if (!force && hasLoadedLifeDiaries && loadedToken === token) {
    if (isLifeVisible())
      render();
    return;
  }

  if (loadingLifeDiariesPromise) {
    await loadingLifeDiariesPromise;
    if (loadedToken !== token) {
      await loadLifeDiaries({ force: true });
      return;
    }
    if (isLifeVisible())
      render();
    return;
  }

  loadingLifeDiariesPromise = (async () => {
    try {
      const diaries = await fetchDiaries();
      lifeState.diaryList = diaries;
      hasLoadedLifeDiaries = true;
      loadedToken = token;
    } catch (err) {
      lifeState.diaryList = [];
      hasLoadedLifeDiaries = false;
      loadedToken = null;
      console.error(err);
    } finally {
      lifeState.isEdit = false;
      lifeState.selectDiariesId = [];
      loadingLifeDiariesPromise = null;
      if (isLifeVisible())
        render();
    }
  })();

  await loadingLifeDiariesPromise;
}
