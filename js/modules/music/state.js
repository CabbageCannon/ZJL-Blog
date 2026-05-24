// 管理页面状态，驱动页面渲染
export const state = {
  musicList: [],

  currentMusic: null,

  // 是否进入编辑模式
  isEditMode:false,

  // 被选中的歌曲 id
  selectedMusicIds:[],

  // 存储错误信息
  errorMessage:""
}
