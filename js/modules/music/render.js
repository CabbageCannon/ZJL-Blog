// 根据 state 渲染 DOM
export function renderMusicList(state) {
  const cardsContainer = document.querySelector("#music .cards");
  const editButton = document.querySelector("#music .editSongs");
  const musicCardActions = document.querySelector(".musicCardActions");

  cardsContainer.innerHTML = "";

  // 判断当前音乐卡片状态
  if (state.errorMessage) {
    // 音乐板块出错了
    cardsContainer.appendChild(createMessage(state.errorMessage));
  } else if (state.musicList.length === 0) {
    // 暂时没有卡片
    cardsContainer.appendChild(createMessage("还没有收藏音乐，点击上传添加第一首吧"));
  } else {
    // 生成音乐卡片
    state.musicList.forEach(item => cardsContainer.appendChild(createMusicCard(item, state)))
  }

  // 渲染编辑状态
  renderMusicAction(editButton, musicCardActions, state);

  // 窗口大小变化时重新渲染编辑框，只绑定一次
  if (!renderMusicList.hasResizeListener) {
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      // 先禁止全局动画
      document.body.classList.add("is-resizing");

      // 重新渲染编辑框
      renderMusicAction(editButton, musicCardActions, state);

      // 设置定时器，防止渲染还未完成就移除is-resizing类
      // 重置定时器
      clearTimeout(resizeTimer);
      resizeTimer=null;

      resizeTimer = setTimeout(() => {
        document.body.classList.remove("is-resizing");
      },120);
    })

    renderMusicList.hasResizeListener = true;
  }
}

// 创建音乐卡片
function createMusicCard(item, state) {
  const card = document.createElement("article");
  const cover = document.createElement("div");
  const info = document.createElement("div");
  const name = document.createElement("h3");
  const link = document.createElement("a");

  const isSelected = state.selectedMusicIds.includes(item.id);

  // 使用textContent添加文本内容并用append添加节点更安全，因为textContent中的内容不会被当成html元素处理
  // 配置card
  card.className = "card";
  card.dataset.id = item.id;

  if (state.isEditMode) {
    card.classList.add("edit-mode");
  }

  if (isSelected) {
    card.classList.add("selected");
  }

  // 配置cover
  cover.className = "cardCover";
  cover.style.backgroundImage = `url(${item.cover})`;

  // 配置info
  info.className = "cardInfo";

  // 配置name
  name.className = "cardName";
  name.textContent = item.name;

  // 配置link
  link.className = "cardLink";
  link.href = item.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "去听";

  // 拼凑card元素
  info.appendChild(name);
  info.appendChild(link);

  card.appendChild(cover);
  card.appendChild(info);

  return card;
}

// 创建错误信息
function createMessage(text) {
  const message = document.createElement("div");
  message.className = "musicMessage";
  message.textContent = text;
  return message;
}

// 检验当前是否是移动端布局
function isMobileView() {
  return window.matchMedia("(max-width:768px)").matches;
}

// 渲染编辑框和编辑按钮
function renderMusicAction(editButton, musicCardActions, state) {
  const editButtonText = editButton.querySelector('.text');
  // 更改左侧选项栏中编辑按钮信息
  if (state.isEditMode) {
    editButtonText.textContent = "取消";
    editButton.classList.add('active');

    // 倘若选中列表为空则添加disabled类，反之则删除
    musicCardActions.classList.toggle(
      'disabled',
      state.selectedMusicIds.length === 0
    )
  } else {
    editButtonText.textContent = "编辑";
    editButton.classList.remove('active');
  }
  if (isMobileView()) {
    musicCardActions.style.right = "16px";
    musicCardActions.style.bottom = state.isEditMode ? "16px" : "-180px";
  } else {
    musicCardActions.style.right = state.isEditMode ? "0px" : "-180px";
    musicCardActions.style.bottom = "auto";
  }
}