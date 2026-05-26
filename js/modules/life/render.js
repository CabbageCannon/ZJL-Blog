import { formatDate } from "../utils/formatDate.js";
import { resolveImageUrl } from "./api.js";

// 渲染lifeList
export function renderLifeList(diaryList){
  const lifeList=document.querySelector('#life .lifeList');
  diaryList.forEach(cardInfo=>{
    lifeList.appendChild(createLifeCard(cardInfo));
  });
}

// 创建卡片
function createLifeCard(cardInfo){
  // 获取数据
  const {id,mood,createdAt,title,content,imageUrl}=cardInfo;
  // 卡片
  const card=document.createElement('section');
  // 卡片标题部分
  const cardTitle=document.createElement('section');
  const cardTitleTime=document.createElement('div');
  const cardTitleMood=document.createElement('div');
  // 卡片内容部分
  const cardContent=document.createElement('section');
  const cardContentPic=document.createElement('div');
  const cardContentPicImg=document.createElement('img');
  const cardContentText=document.createElement('section');
  const cardContentTextH2=document.createElement('h2');
  const cardContentTextP=document.createElement('p');

  // 配置卡片标题
  cardTitle.className="lifeCardTitle";
  cardTitleTime.className="time";
  cardTitleTime.textContent=getDay(createdAt);
  cardTitleMood.className="mood";
  cardTitleMood.textContent=mood;
  cardTitle.appendChild(cardTitleTime);
  cardTitle.appendChild(cardTitleMood);

  // 配置卡片内容
  cardContentPicImg.src=resolveImageUrl(imageUrl);
  cardContentPic.className="pic";
  cardContentPic.appendChild(cardContentPicImg);
  cardContentTextH2.textContent=title;
  cardContentTextP.textContent=content;
  cardContentText.className="text";
  cardContentText.appendChild(cardContentTextH2);
  cardContentText.appendChild(cardContentTextP);
  cardContent.className="lifeCardContent";
  cardContent.appendChild(cardContentPic);
  cardContent.appendChild(cardContentText);

  // 配置最终卡片
  card.className="lifeCard";
  card.appendChild(cardTitle);
  card.appendChild(cardContent);

  return card;
}

// 生成对应日期字符串
function getDay(dateStr){
  let date=formatDate(dateStr);
  return `${date.year}年${String(date.month).padStart(2,'0')}月${String(date.day).padStart(2,'0')}日`;
}