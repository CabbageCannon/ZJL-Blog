
import { state } from "./state.js";
import { renderMusicList } from "./render.js";
import { saveMusicList } from "./storage.js";
import { showModalMask, closeModalMask } from "../utils/showModalMask.js";

// 绑定音乐模块事件
export function bindEvents() {
  addSongsModal();
  editSongsModal();
  listenSectionShow();
}

// 用户添加音乐功能
function addSongsModal() {
  const addButton = document.querySelector(".addNewSongs");
  const modal = document.querySelector(".addMusicModal");
  const closeButton = document.querySelector(".closeButton");
  const commitButton = modal.querySelector(".commitButton");
  const inputs = modal.querySelectorAll("input");

  // 打开弹窗
  addButton.addEventListener('click', () => {
    showModalMask(modal);
  })

  // 点击关闭按钮关闭弹窗
  closeButton.addEventListener('click', () => {
    closeModalMask();
  })

  // 上传表单内容
  commitButton.addEventListener('click', () => {
    // 校验表单信息
    const name = inputs[0].value.trim();
    const cover = inputs[1].value.trim();
    const link = inputs[2].value.trim();
    // 简单的校验
    if (!name || !cover || !link) {
      alert("请完整填写歌曲名、封面地址和跳转地址");
      return;
    }

    // 收集表单信息
    let songInf = {
      id: Date.now(),
      name,
      cover,
      link
    };
    // 更新 state
    state.musicList.push(songInf);
    // 保存到本地存储
    saveMusicList(state.musicList);
    // 渲染页面
    renderMusicList(state);

    closeModalMask();

    // 清空输入框
    inputs[0].value = "";
    inputs[1].value = "";
    inputs[2].value = "";
  })
}

// 编辑音乐卡片功能：删除、移动
function editSongsModal() {
  const editButton = document.querySelector("#music .editSongs");
  const cards = document.querySelector("#music .cards");
  const musicCardActions = document.querySelector(".musicCardActions");

  // 点击编辑按钮，切换编辑状态
  editButton.addEventListener("click", () => {
    // 切换编辑状态
    state.isEditMode = !state.isEditMode;
    // 如果退出编辑状态，则清空选中列表
    state.isEditMode ? null : state.selectedMusicIds = [];
    // 重新渲染
    renderMusicList(state);
  })

  // 编辑状态下点击卡片，切换选中效果
  cards.addEventListener("click", (ev) => {
    // 停止冒泡
    ev.stopPropagation();
    // closest从当前元素开始，向上查找最近的符合选择器的元素
    const target = ev.target;
    const card = target.closest(".card");
    // 找不到直接返回
    if (!card) return;
    const id = Number(card.dataset.id);

    if (state.isEditMode) {
      // 编辑模式下
      if (state.selectedMusicIds.includes(id))
        state.selectedMusicIds = state.selectedMusicIds.filter(item => item !== id);
      else
        state.selectedMusicIds.push(Number(card.dataset.id));
      renderMusicList(state);
    } else {
      // 非编辑模式下
      // 进入卡片的link中

      // 如果成立，表明已经冒泡到a标签过了，就让他自己打开新界面
      if (target.closest(".cardLink")) return;

      updatePlayerStage(card);
    }

  })

  // 对选中的卡片进行操作
  musicCardActions.addEventListener("click", (ev) => {
    ev.stopPropagation();

    let target = ev.target;
    if (target.closest(".deleteButton")) {
      // 删除选中的歌曲
      state.selectedMusicIds.forEach((id, index) => {
        state.musicList = state.musicList.filter(item => item.id !== id);
      })
      state.selectedMusicIds = [];
    } else if (target.closest(".moveToFirstButton") || target.closest(".moveToLastButton")) {
      // 批量移动选中的歌曲
      // 记录选中卡片在 musicList 中的索引
      let indexArr = [],
        tempCardArr = [];
      state.musicList.forEach((item, index) => {
        if (state.selectedMusicIds.includes(item.id)) {
          indexArr.push(index);
        };
      })
      // 将选中的卡片从原列表中删除，并放入 tempCardArr 中
      indexArr.reverse().forEach(index => tempCardArr.unshift(state.musicList.splice(index, 1)[0]));
      // 根据移动方向选择数组拼接方式
      state.musicList = target.closest(".moveToFirstButton") ? tempCardArr.concat(state.musicList) : state.musicList.concat(tempCardArr);
      state.selectedMusicIds = [];
    } else {
      // 没有点中这些按钮,直接返回
      return;
    }
    // 更新本地存储
    saveMusicList(state.musicList);
    // 重新渲染
    renderMusicList(state);
  })
}

function updatePlayerStage(card) {
  const stage = document.querySelector("#music .musicPlayerStage");
  if (!stage) return;

  const title = stage.querySelector(".playerCopy h3");
  const desc = stage.querySelector(".playerCopy p");
  const label = stage.querySelector(".playerLabel");
  const cards = document.querySelectorAll("#music .cards .card");

  const songName = card.dataset.name || "未命名歌曲";
  const cover = card.dataset.cover || "";
  const link = card.dataset.link || "";

  cards.forEach(item => item.classList.toggle("is-previewing", item === card));
  stage.classList.toggle("has-cover", Boolean(cover));
  stage.classList.remove("is-updating");
  void stage.offsetWidth;
  stage.classList.add("is-updating");

  if (cover) {
    stage.style.setProperty("--player-cover", `url("${cover}")`);
  } else {
    stage.style.removeProperty("--player-cover");
  }

  if (label) {
    label.textContent = cover ? "Now Previewing" : "Cover Missing";
  }

  if (title) {
    title.textContent = songName;
  }

  if (desc) {
    desc.textContent = link
      ? "这首歌已放到唱片台，点击卡片里的「去听」可以打开来源。"
      : "这首歌还没有配置跳转地址，可以先作为收藏记录保留。";
  }
}

function listenSectionShow() {
  document.addEventListener("section:show", (ev) => {
    const detail = ev.detail;

    if (detail.lastSectionId === "music" && detail.nextSectionId !== "music") {
      clearEditingState();
      renderMusicList(state);
      return;
    }

    if (detail.nextSectionId === "music") {
      clearEditingState();
      renderMusicList(state)
    }
  })
}

// 刷新编辑状态
function clearEditingState() {
  state.isEditMode = false;
  state.selectedMusicIds = [];
}
