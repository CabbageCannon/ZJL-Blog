import { initEvents } from "./event.js";
import { lifeState } from "./state.js";
import { fetchDiaries } from "./api.js";
import { render } from "./render.js";

export async function initLife() {
  // 尝试从后端拉取日记数据
  try {
    const diaries = await fetchDiaries();
    lifeState.diaryList = diaries;
    // 先不渲染lifeList区域
  } catch (err) {
    lifeState.diaryList = [];
    console.error(err);
  }

  document.addEventListener("auth:login", loadLifeDiaries);

  document.addEventListener("auth:logout", () => {
    lifeState.diaryList = [];
    lifeState.isEdit = false;
    lifeState.selectDiariesId = [];
    render(lifeState);
  })

  // 绑定事件
  initEvents();
};

// 获取日数据并刷新到页面上
async function loadLifeDiaries() {
  try {
    const diaries = await fetchDiaries();
    lifeState.diaryList = diaries;
  } catch (err) {
    lifeState.diaryList = [];
    console.error(err);
  }

  lifeState.isEdit = false;
  lifeState.selectDiariesId = [];
  render(lifeState);
}