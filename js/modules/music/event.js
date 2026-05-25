import { state } from "./state.js";
import { renderMusicList } from "./render.js";
import { saveMusicList } from "./storage.js";
import { showModalMask,closeModalMask } from "../utils/showModalMask.js";

// 绑定音乐模块事件
export function bindEvents() {
  addSongsModal();
  editSongsModal();
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

    modal.style.display = "none";
    mask.style.display = "none";

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

      const link = card.querySelector(".cardLink").href;
      // 如果链接为空或者为#,则直接返回
      if (!link || link === "#") return;

      window.open(link, "_blank", "noopener,noreferrer");
    }

  })

  // 对选中的卡片进行操作
  musicCardActions.addEventListener("click", (ev) => {
    ev.stopPropagation();

    let target = ev.target;
    if (target.classList.contains("deleteButton")) {
      // 删除选中的歌曲
      state.selectedMusicIds.forEach((id, index) => {
        state.musicList = state.musicList.filter(item => item.id !== id);
      })
      state.selectedMusicIds = [];
    } else if (target.classList.contains("moveToFirstButton") || target.classList.contains("moveToLastButton")) {
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
      state.musicList = target.classList.contains("moveToFirstButton") ? tempCardArr.concat(state.musicList) : state.musicList.concat(tempCardArr);
      state.selectedMusicIds = [];
    }
    // 更新本地存储
    saveMusicList(state.musicList);
    // 重新渲染
    renderMusicList(state);
  })
}
