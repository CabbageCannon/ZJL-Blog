import { getMusicList } from "./api.js";
import { renderMusicList } from "./render.js";
import { bindEvents } from "./event.js";
import { state } from "./state.js";
import { loadMusicList } from "./storage.js";

// 数据清洗
function normalizeMusicList(list) {
  return list.map(item => ({
    id: item.id,
    name: item.name || "未命名歌曲",
    cover: item.cover || item["data-src"] || "",
    link: item.link || "#"
  }))
}

export async function initMusic() {

  // 尝试请求数据请求数据
  try{
    // 先尝试获取本地存储
    let data = loadMusicList();

    // 如果本地没有存储，则请求默认数据
    if (!data) {
      data = await getMusicList();
    }

    // 保存状态
    state.musicList = normalizeMusicList(data);
    state.errorMessage="";
  }catch(error){
    console.error(error);
    state.musicList=[];
    state.errorMessage="音乐数据加载失败,请稍后重试";
  }


  // 渲染页面
  renderMusicList(state);

  // 绑定事件
  bindEvents();
}
