import { showModalMask, closeModalMask } from "../utils/showModalMask.js";
import { createDiary } from "./api.js";
import { renderLifeList } from "./render.js";
import { lifeState } from "./state.js";

export function initEvents() {
  addLifeModal();
  commitLifeDiary();
  listenSectionShow();
}

// 点击上传按钮弹出日记上传框
function addLifeModal() {
  const addLifeModal = document.querySelector(".addLifeModal");
  const closeBut = addLifeModal.querySelector(".closeLifeModalButton");
  const addBut = document.querySelector("#life .but.addNewDiary");

  // 给上传按钮绑定点击事件
  addBut.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    showModalMask(addLifeModal);

    closeBut.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      closeModalMask();
    })
  })
}

// 日记上传框上传数据
async function commitLifeDiary() {
  const addLifeModal = document.querySelector(".addLifeModal");
  const commitLifeButton = document.querySelector(".addLifeModal .commitLifeButton");
  const titleInput = addLifeModal.querySelector(".lifeTitleInput");
  const contentInput = addLifeModal.querySelector(".lifeContentInput");
  const imageInput = addLifeModal.querySelector(".lifeImageInput");
  const cardInfo = {};

  const commitFunc = async function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const moodInput = addLifeModal.querySelector('input[name="mood"]:checked');

    cardInfo.title = titleInput.value;
    cardInfo.mood = moodInput.value;
    cardInfo.content = contentInput.value;
    cardInfo.imageFile = imageInput.files[0] || null;

    try {
      const createdDiary = await createDiary(cardInfo);
      lifeState.diaryList.push(createdDiary);
      renderLifeList(lifeState.diaryList);

      closeModalMask();
    }catch(err){
      console.error(err);
      alert(err.message || "日记发布失败，请稍后再试");
    }
  }
  commitLifeButton.addEventListener('click', commitFunc);
}

// 监听页面切换
function listenSectionShow(){
  let hasRewndered=false;
  document.addEventListener("section:show",(ev)=>{
    if(hasRewndered)return;
    // 如果不是切换到自己的页面则直接返回
    if(ev.detail.sectionId!=="life")return;

    renderLifeList(lifeState.diaryList);
    hasRewndered=true;
  })
}
