import { initEvents } from "./event.js";
import { lifeState } from "./state.js";
import { fetchDiaries } from "./api.js";

export async function initLife(){
  // 尝试从后端拉取日记数据
  try{
    lifeState.diaryList=await fetchDiaries();
    // 先不渲染lifeList区域
  }catch(err){
    console.error(err);
  }

  // 绑定事件
  initEvents();
};