import { showModalMask, closeModalMask } from "../utils/showModalMask.js";
import { createDiary, deleteDiary } from "./api.js";
import { render, renderLifeCardActions } from "./render.js";
import { lifeState } from "./state.js";
import { getImageRatio } from "../utils/getImageRatio.js";
import { loadToken } from "../utils/userStorage.js";
import { compressImageFile } from "../utils/compressImage.js";
import { showToast } from "../utils/toast.js";

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

    // 如果没登录,直接返回,不允许上传
    if (!requireLogin()) return;

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
    ev.preventDefault();
    ev.stopPropagation();

    if (!requireLogin()) return;

    if (lifeState.isEdit) {
      lifeState.isEdit = false;
      lifeState.selectDiariesId = [];
      render();
    } else {
      lifeState.isEdit = true;

      render()
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
    if (!card) return;
    if (!lifeState.isEdit) return;
    const id = Number(card.dataset.id);

    if (lifeState.selectDiariesId.includes(id))
      lifeState.selectDiariesId = lifeState.selectDiariesId.filter(selectId => selectId !== id);
    else
      lifeState.selectDiariesId.push(id);

    render();
  })
}

// 日记上传框上传数据
async function commitLifeDiary() {
  const addLifeModal = document.querySelector(".addLifeModal");
  const commitLifeButton = document.querySelector(".addLifeModal .commitLifeButton");
  const titleInput = addLifeModal.querySelector(".lifeTitleInput");
  const contentInput = addLifeModal.querySelector(".lifeContentInput");
  const imageInput = addLifeModal.querySelector(".lifeImageInput");
  let isSubmitting = false;

  const commitFunc = async function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    // 如果正在提交表单，直接返回
    if (isSubmitting) return;

    const cardInfo = {};
    const moodInput = addLifeModal.querySelector('input[name="mood"]:checked');
    const originImageFile = imageInput.files[0] || null;
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    // 基础校验
    if (!title && !content && !originImageFile) {
      showToast("至少写点内容或选择一张图片", "warning");
      return;
    }

    isSubmitting = true;
    setButtonLoading(commitLifeButton, true, "发布中");

    try {
      // 压缩上传的图片
      const compressedImageFile = originImageFile
        ? await compressImageFile(originImageFile)
        : null;

      const imageRatio = compressImageFile
        ? await getImageRatio(compressedImageFile)
        : null;

      // 日记卡片信息
      const cardInfo = {
        title,
        content,
        mood: moodInput ? moodInput : null,
        imageFile: compressedImageFile,
        imageRatio
      };

      // 调用api创建日记
      const createdDiary = await createDiary(cardInfo);
      lifeState.diaryList.push(createdDiary);
      render();

      // 关闭弹出框
      closeModalMask();
      // 展示发布成功信息
      showToast("日记发布成功", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "发布日记失败，请稍后再试", "error");
    } finally {
      isSubmitting = false;
      setButtonLoading(commitLifeButton, false);
    }
  }
  commitLifeButton.addEventListener('click', commitFunc);
}

// 设置按钮加载状态
function setButtonLoading(commitLifeButton, loading, loadingText = "处理中") {
  if (!commitLifeButton) return;

  // 如果此时不是加载阶段
  if (!loading) {
    commitLifeButton.textContent = commitLifeButton.dataset.originText || "发布";
    commitLifeButton.disabled = false;
    commitLifeButton.classList.remove("is-loading");
    return;
  } else {
    if (!commitLifeButton.dataset.originText) {
      commitLifeButton.dataset.originText = commitLifeButton.textContent;
    }

    commitLifeButton.textContent = loadingText;
    commitLifeButton.disabled = true;
    commitLifeButton.classList.add("is-loading");
    return;
  }
}

// 监听页面切换
function listenSectionShow() {
  document.addEventListener("section:show", (ev) => {
    const detail = ev.detail;
    // 如果是从自己切换到别处
    if (detail.lastSectionId === "life" && detail.nextSectionId !== "life") {
      clearEditingState();
      renderLifeCardActions(lifeState);
      return;
    }

    if (detail.nextSectionId !== "life")
      return;
    else
      renderLifeCardActions(lifeState);

    render();
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
  render();
}

// 查看登录状态
function requireLogin() {
  const token = loadToken();

  if (token) return true;

  alert("请先登录后再操作生活日记");
  return false;
}

// 清空编辑状态
function clearEditingState() {
  lifeState.isEdit = false;
  lifeState.selectDiariesId = [];
  lifeState.selectedImageDataUrl = ""
}