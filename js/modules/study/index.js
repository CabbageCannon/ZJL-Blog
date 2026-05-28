import { getStudyCards } from "./api.js";
import { renderStudyNotes } from "./render.js";
import { studyState } from "./state.js";
import { bindEvents } from "./event.js";

export async function initStudy() {
  try{
    const data=await getStudyCards();

    studyState.noteList=normalizeStudyNotes(data);
    studyState.errorMessage="";
  }catch(error){
    console.error(error);
    studyState.noteList=[];
    studyState.errorMessage="学习笔记加载失败，请稍后重试";
  }

  renderStudyNotes(studyState);
  bindEvents();
}

// 数据标准化
function normalizeStudyNotes(list) {
  return list.map(item => ({
    id: item.id,
    title: item.title || "未命名笔记",
    category: item.category || "未分类",
    date: item.date || "",
    summary: item.summary || "暂无摘要"
  }));
}