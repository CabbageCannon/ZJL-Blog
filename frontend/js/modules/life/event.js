import { showModalMask, closeModalMask } from "../utils/showModalMask.js";
import { createDiary, deleteDiary } from "./api.js";
import { render, renderLifeCardActions } from "./render.js";
import { lifeState } from "./state.js";
import { getImageRatio } from "../utils/getImageRatio.js";
import { loadToken } from "../utils/userStorage.js";
import { compressImageFile } from "../utils/compressImage.js";
import { showToast } from "../utils/toast.js";
import { setButtonLoading } from "../utils/buttonLoading.js";

let isDeletingDiaries = false;

export function initEvents() {
  addLifeModal();
  editLifeCard();
  bindCardClickEvents();
  commitLifeDiary();
  listenSectionShow();
  deleteDiaries();
}

function addLifeModal() {
  const addLifeModal = document.querySelector(".addLifeModal");
  const closeBut = addLifeModal.querySelector(".closeLifeModalButton");
  const addBut = document.querySelector("#life .but.addNewDiary");

  addBut.addEventListener("click", ev => {
    ev.preventDefault();
    ev.stopPropagation();

    if (!requireLogin()) return;

    showModalMask(addLifeModal);
  });

  closeBut.addEventListener("click", ev => {
    ev.preventDefault();
    ev.stopPropagation();

    closeModalMask();
  });
}

function editLifeCard() {
  const editBut = document.querySelector("#life .leftBanner .but.editDiary");

  editBut.addEventListener("click", ev => {
    ev.preventDefault();
    ev.stopPropagation();

    if (!requireLogin()) return;

    lifeState.isEdit = !lifeState.isEdit;

    if (!lifeState.isEdit) {
      lifeState.selectDiariesId = [];
    }

    render();
  });
}

function bindCardClickEvents() {
  const lifeList = document.querySelector("#life .lifeWrap .lifeList");

  lifeList.addEventListener("click", ev => {
    ev.preventDefault();
    ev.stopPropagation();

    const card = ev.target.closest(".lifeCard");
    if (!card || !lifeState.isEdit) return;

    const id = Number(card.dataset.id);

    if (lifeState.selectDiariesId.includes(id)) {
      lifeState.selectDiariesId = lifeState.selectDiariesId.filter(selectId => selectId !== id);
    } else {
      lifeState.selectDiariesId.push(id);
    }

    render();
  });
}

function commitLifeDiary() {
  const addLifeModal = document.querySelector(".addLifeModal");
  const commitLifeButton = document.querySelector(".addLifeModal .commitLifeButton");
  const titleInput = addLifeModal.querySelector(".lifeTitleInput");
  const contentInput = addLifeModal.querySelector(".lifeContentInput");
  const imageInput = addLifeModal.querySelector(".lifeImageInput");
  let isSubmitting = false;

  commitLifeButton.addEventListener("click", async ev => {
    ev.preventDefault();
    ev.stopPropagation();

    if (isSubmitting) return;

    const moodInput = addLifeModal.querySelector('input[name="mood"]:checked');
    const originImageFile = imageInput.files[0] || null;
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title && !content && !originImageFile) {
      showToast("至少写点内容或选择一张图片", "warning");
      return;
    }

    isSubmitting = true;
    setButtonLoading(commitLifeButton, true, "发布中...");

    try {
      const compressedImageFile = originImageFile
        ? await compressImageFile(originImageFile)
        : null;

      const imageRatio = compressedImageFile
        ? (await getImageRatio(compressedImageFile)).imageRatio
        : null;

      const createdDiary = await createDiary({
        title,
        content,
        mood: moodInput ? moodInput.value : null,
        imageFile: compressedImageFile,
        imageRatio
      });

      lifeState.diaryList.push(createdDiary);
      render();
      closeModalMask();
      clearLifeForm();
      showToast("日记发布成功", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "发布日记失败，请稍后再试", "error");
    } finally {
      isSubmitting = false;
      setButtonLoading(commitLifeButton, false);
    }
  });
}

function listenSectionShow() {
  document.addEventListener("section:show", ev => {
    const detail = ev.detail;

    if (detail.lastSectionId === "life" && detail.nextSectionId !== "life") {
      clearEditingState();
      renderLifeCardActions(lifeState);
      return;
    }

    if (detail.nextSectionId !== "life") return;

    renderLifeCardActions(lifeState);
    render();
  });
}

function deleteDiaries() {
  const deleteButton = document.querySelector(".lifeCardActions .but.deleteButton");

  deleteButton.addEventListener("click", handleDeleteDiary);
}

async function handleDeleteDiary(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (isDeletingDiaries) return;

  if (lifeState.selectDiariesId.length === 0) {
    showToast("还没有选择日记", "warning");
    return;
  }

  const deleteButton = ev.currentTarget;
  const selectedIds = [...lifeState.selectDiariesId];
  const successDeleteList = [];

  isDeletingDiaries = true;
  setButtonLoading(deleteButton, true, "删除中...");

  try {
    for (const id of selectedIds) {
      const result = await deleteDiary(id);
      const isSuccess = Boolean(result?.success);

      if (isSuccess) {
        lifeState.diaryList = lifeState.diaryList.filter(lifeInfo => lifeInfo.id !== id);
        successDeleteList.push(id);
      }
    }

    if (successDeleteList.length === selectedIds.length) {
      showToast("日记删除成功", "success");
    } else {
      showToast(`成功删除 ${successDeleteList.length}/${selectedIds.length} 条日记`, "warning");
    }
  } catch (err) {
    console.error(err);
    showToast(err.message || "删除日记失败", "error");
  } finally {
    isDeletingDiaries = false;
    setButtonLoading(deleteButton, false);
    lifeState.selectDiariesId = [];
    render();
  }
}

function requireLogin() {
  const token = loadToken();

  if (token) return true;

  showToast("请先登录后再操作生活日记", "warning");
  return false;
}

function clearEditingState() {
  lifeState.isEdit = false;
  lifeState.selectDiariesId = [];
  lifeState.selectedImageDataUrl = "";
}

function clearLifeForm() {
  const addLifeModal = document.querySelector(".addLifeModal");
  if (!addLifeModal) return;

  const titleInput = addLifeModal.querySelector(".lifeTitleInput");
  const contentInput = addLifeModal.querySelector(".lifeContentInput");
  const imageInput = addLifeModal.querySelector(".lifeImageInput");
  const moodInputs = addLifeModal.querySelectorAll('input[name="mood"]');

  if (titleInput) titleInput.value = "";
  if (contentInput) contentInput.value = "";
  if (imageInput) imageInput.value = "";
  moodInputs.forEach(input => {
    input.checked = false;
  });
}
