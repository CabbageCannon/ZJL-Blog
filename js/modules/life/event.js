import { showModalMask, closeModalMask } from "../utils/showModalMask.js";
import { createDiary, deleteDiary } from "./api.js";
import { render } from "./render.js";
import { lifeState } from "./state.js";
import { getImageRatio } from "../utils/getImageRatio.js";

export function initEvents() {
  // 点击上传按钮弹出上传框
  addLifeModal();
  // 点击编辑按钮进入编辑状态
  editLifeCard();
  // 给卡片绑定点击事件
  bindCardClickEvents();
  // 上传框上传日记
  commitLifeDiary();
  // 监听第一次切换到当前页面
  listenSectionShow();
  // 绑定删除按钮删除日记功能
  deleteDiaries();
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
  })

  // 给关闭按钮绑定点击事件
  closeBut.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    closeModalMask();
  })
}

// 点击编辑按钮切换编辑状态
function editLifeCard() {
  const editBut = document.querySelector("#life .leftBanner .but.editDiary");
  editBut.addEventListener('click', (ev) => {
    if (lifeState.isEdit) {
      lifeState.isEdit = false;
      lifeState.selectDiariesId = [];
      render(lifeState);
    } else {
      lifeState.isEdit = true;

      render(lifeState)
    }
  })
}

// 给卡片绑定点击事件
function bindCardClickEvents() {
  const lifeList = document.querySelector("#life .lifeWrap .lifeList");
  lifeList.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const target = ev.target;
    const card = target.closest('.lifeCard');
    if (!lifeState.isEdit) return;
    const id = Number(card.dataset.id);

    if (lifeState.selectDiariesId.includes(id))
      lifeState.selectDiariesId = lifeState.selectDiariesId.filter(selectId => selectId !== id);
    else
      lifeState.selectDiariesId.push(id);

    render(lifeState);
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

    // 将表单信息传入cardInfo
    // 处理文件信息
    const imageFile = imageInput.files[0] || null;
    const imageInfo = await getImageRatio(imageFile);

    cardInfo.title = titleInput.value;
    cardInfo.mood = moodInput ? moodInput.value : null;
    cardInfo.content = contentInput.value;
    cardInfo.imageFile = imageFile;
    cardInfo.imageRatio = imageFile ? imageInfo.imageRatio : null;

    try {
      const createdDiary = await createDiary(cardInfo);
      lifeState.diaryList.push(createdDiary);
      render(lifeState);

      closeModalMask();
    } catch (err) {
      console.error(err);
      alert(err.message || "日记发布失败，请稍后再试");
    }
  }
  commitLifeButton.addEventListener('click', commitFunc);
}

// 监听页面切换
function listenSectionShow() {
  document.addEventListener("section:show", (ev) => {
    // 如果不是切换到自己的页面则直接返回
    if (ev.detail.sectionId !== "life") return;

    render(lifeState);
  })
}

// 点击删除按钮删除对应日记
function deleteDiaries() {
  const deleteButton = document.querySelector(".lifeCardActions .but.deleteButton");

  deleteButton.addEventListener('click', handleDeleteDiary);
}

async function handleDeleteDiary(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  const selectDiariesIdOriginLength = lifeState.selectDiariesId.length;
  const successDeleteList = [];

  // 执行删除逻辑
  if (lifeState.selectDiariesId.length === 0)
    alert("还没有选择日记!");
  else {
    for (const id of lifeState.selectDiariesId) {

      let isSuccess = false;

      // 调用api删除数据库中数据
      let obj = await deleteDiary(id);
      console.log(obj);
      // 检验是否删除成功
      if (obj) isSuccess = obj.success || false;
      console.log(isSuccess);

      if (isSuccess) lifeState.diaryList = lifeState.diaryList.filter((lifeInfo) => lifeInfo.id !== id);
      successDeleteList.push(id);
    }

  }

  if (selectDiariesIdOriginLength === successDeleteList.length) {
    console.log("删除成功");
  } else {
    console.log(`需要删除日记数：${selectDiariesIdOriginLength},成功删除日记数：${successDeleteList.length}`);
  }

  // 执行成功后,清空选中
  lifeState.selectDiariesId = [];
  // 重新渲染
  render(lifeState);
}
