import { createIcon } from "../utils/createIcon.js";

// 渲染学习笔记
export function renderStudyNotes(studyState) {
  const noteList = document.querySelector("#study .studyNotesList");
  const notesCount = document.querySelector("#study .studyNotesHeader .studyNotesCount");

  if (!noteList) return;

  const currentList = getCurrentList(studyState);

  noteList.innerHTML = "";

  if (notesCount) {
    notesCount.textContent = `${currentList.length} 条`;
  }

  // 出错，展示错误信息
  if (studyState.errorMessage) {
    noteList.appendChild(createMessage(studyState.errorMessage, "icon-warning"));
    return;
  }

  // 笔记列表为空
  if (currentList.length === 0) {
    const text = studyState.activeCategory === "all"
      ? "还没有学习笔记，先记录第一条吧"
      : "当前分类还没有学习笔记";

    noteList.appendChild(createMessage(text, "icon-empty"));
    return;
  }

  // 渲染笔记卡片区域
  currentList.forEach((nodeInfo) => {
    noteList.appendChild(createStudyNote(nodeInfo));
  })

}

// 获取当前需要展示的笔记数据列表
function getCurrentList(studyState) {
  return studyState.activeCategory === "all"
    ? studyState.noteList
    : studyState.noteList.filter(noteInfo => noteInfo.category === studyState.activeCategory);
}

// 创建学习笔记卡片
function createStudyNote(note) {
  const card = document.createElement("article");
  const meta = document.createElement("div");
  const category = document.createElement("span");
  const date = document.createElement("span");
  const title = document.createElement("h4");
  const summary = document.createElement("p");

  card.className = "studyNote";
  card.dataset.id=note.id;
  
  meta.className = "studyNoteMeta";
  category.className = "studyNoteCategory";
  date.className = "studyNoteDate";

  const categoryText = document.createElement("span");
  categoryText.textContent = note.category || "未分类";
  category.append(createIcon(getCategoryIcon(note.category), "iconSvg iconSvg--sm"), categoryText);

  date.textContent = note.date || "";
  title.textContent = note.title || "未命名笔记";
  summary.textContent = note.summary || "暂无摘要";

  meta.append(category, date);
  card.append(meta, title, summary);

  return card;
}

// 创建信息提示
function createMessage(text, iconName) {
  const message = document.createElement("div");
  const messageText = document.createElement("span");

  message.className = "studyMessage";
  messageText.textContent = text;

  if (iconName) {
    message.appendChild(createIcon(iconName, "iconSvg iconSvg--lg iconMuted"));
  }

  message.appendChild(messageText);
  return message;
}

// 根据笔记分类选择图标
function getCategoryIcon(category) {
  const iconMap = {
    CSS: "icon-css",
    JavaScript: "icon-js",
    "后端基础": "icon-server"
  };

  return iconMap[category] || "icon-note";
}
