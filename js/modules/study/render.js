// 渲染学习笔记
export function renderStudyNotes(studyState) {
  const noteList = document.querySelector("#study .studyNotesList");

  const currentList = studyState.activeCategory === "all"
    ? studyState.noteList
    : studyState.noteList.filter(noteInfo=>noteInfo.category===studyState.activeCategory);

  if (!noteList) return;

  noteList.innerHTML = "";


  if (studyState.errorMessage) {
    noteList.appendChild(createMessage(studyState.errorMessage));
  } else if (currentList.length === 0) {
    noteList.appendChild(createMessage("还没有学习笔记，先记录第一条吧"));
  } else {
    currentList.forEach((nodeInfo) => {
      noteList.appendChild(createStudyNote(nodeInfo));
    })
  }
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
  meta.className = "studyNoteMeta";
  category.className = "studyNoteCategory";
  date.className = "studyNoteDate";

  category.textContent = note.category || "未分类";
  date.textContent = note.date || "";
  title.textContent = note.title || "未命名笔记";
  summary.textContent = note.summary || "暂无摘要";

  meta.append(category, date);
  card.append(meta, title, summary);

  return card;
}

// 创建信息提示
function createMessage(text) {
  const message = document.createElement("div");
  message.className = "studyMessage";
  message.textContent = text;
  return message;
}