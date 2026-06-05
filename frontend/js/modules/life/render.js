import { formatDate } from "../utils/formatDate.js";
import { resolveImageUrl } from "./api.js";
import { isMobileView } from "../utils/isMobileView.js";
import { lifeState } from "./state.js";
import { observeLazyImage } from "../utils/lazyImage.js";

const lifeList = document.querySelector('#life .lifeList');
// 渲染页面
export function render() {
  const editBut = document.querySelector("#life .leftBanner .but.editDiary");

  // 渲染日记内容
  renderLifeCards(lifeState);

  // 渲染编辑框
  renderLifeCardActions(lifeState);

  // 渲染编辑按钮
  renderEditButton(editBut, lifeState);
}

// 渲染日记内容
function renderLifeCards(lifeState) {
  lifeList.innerHTML = "";

  const diaryList = lifeState.diaryList;
  if (diaryList.length === 0) {
    lifeList.appendChild(createMessage("还没有日记,发布第一条吧"));
    return;
  }

  const lifeColumns = [];

  // 创建lifeColumn
  new Array(3).fill(0).forEach(() => {
    const lifeColumn = document.createElement("div");
    lifeColumn.className = "lifeColumn";
    lifeList.appendChild(lifeColumn);
    lifeColumns.push(lifeColumn);
  })

  diaryList.forEach(cardInfo => {
    const card = createLifeCard(cardInfo, lifeState);
    const shortestColumn = getShortestColumn(lifeColumns);
    shortestColumn.appendChild(card);
  })
}

// 创建卡片
function createLifeCard(cardInfo, lifeState) {
  // 获取数据
  const { id, mood, createdAt, title, content, imageUrl, imageRatio } = cardInfo;
  // 卡片
  const card = document.createElement('section');
  // 卡片标题部分
  const cardTitle = document.createElement('section');
  const cardTitleTime = document.createElement('div');
  const cardTitleMood = document.createElement('div');
  // 卡片内容部分
  const cardContent = document.createElement('section');
  const cardContentPic = document.createElement('div');
  const cardContentPicImg = document.createElement('img');
  const cardContentText = document.createElement('section');
  const cardContentTextH2 = document.createElement('h2');
  const cardContentTextP = document.createElement('p');

  // 配置卡片标题
  cardTitle.className = "lifeCardTitle";
  cardTitleTime.className = "time";
  cardTitleTime.textContent = getDay(createdAt);
  cardTitleMood.className = "mood";
  cardTitleMood.textContent = mood;
  cardTitle.appendChild(cardTitleTime);
  cardTitle.appendChild(cardTitleMood);

  // 配置卡片内容
  if (imageUrl) {
    cardContentPicImg.dataset.src = resolveImageUrl(imageUrl);
    observeLazyImage(cardContentPicImg);
    cardContentPicImg.addEventListener("load", () => {
      cardContentPicImg.classList.add("is-load");
    })
    cardContentPic.className = "pic";
    cardContentPic.style.aspectRatio = imageRatio || "auto";
    cardContentPic.appendChild(cardContentPicImg);
    cardContent.appendChild(cardContentPic);
  }
  cardContentTextH2.textContent = title;
  cardContentTextP.textContent = content;
  cardContentText.className = "text";
  cardContentText.appendChild(cardContentTextH2);
  cardContentText.appendChild(cardContentTextP);
  cardContent.className = "lifeCardContent";
  cardContent.appendChild(cardContentText);

  // 配置最终卡片
  card.className = "lifeCard";
  card.dataset.id = id;
  card.appendChild(cardTitle);
  card.appendChild(cardContent);

  // 配置编辑状态信息
  if (lifeState.isEdit) {
    card.classList.add("edit-mode");
    if (lifeState.selectDiariesId.includes(id)) {
      card.classList.add("selected");
    }
  }

  return card;
}

// 生成对应日期字符串
function getDay(dateStr) {
  let date = formatDate(dateStr);
  return `${date.year}年${String(date.month).padStart(2, '0')}月${String(date.day).padStart(2, '0')}日`;
}

// 获取高度最小的一列
function getShortestColumn(columns) {
  return columns.reduce((shortest, column) => {
    return column.offsetHeight < shortest.offsetHeight ? column : shortest;
  }, columns[0]);
}

// 渲染编辑框
export function renderLifeCardActions(lifeState) {
  const lifeCardActions = document.querySelector(".lifeCardActions");

  lifeCardActions.classList.toggle(
    "disabled",
    lifeState.selectDiariesId.length === 0
  )

  if (isMobileView()) {
    lifeCardActions.style.transform = "none";
    lifeCardActions.style.right = "12px";
    lifeCardActions.style.bottom = lifeState.isEdit ? "12px" : "-96px";
  } else {
    lifeCardActions.style.bottom = "auto";
    lifeCardActions.style.right = "0";
    lifeCardActions.style.transform = lifeState.isEdit ? "translateX(0)" : "translateX(100%)";
  }

}

// 渲染编辑按钮
function renderEditButton(editBut, lifeState) {
  if (lifeState.isEdit)
    editBut.querySelector(".text").textContent = "取消";
  else
    editBut.querySelector(".text").textContent = "编辑";
}

// 创建提示信息
function createMessage(text) {
  const message = document.createElement("p");
  message.className = "lifeListMessage";
  message.textContent = text;
  return message;
}
