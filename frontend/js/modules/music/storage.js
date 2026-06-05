// 存储功能
// 存储新增的歌曲内容
const MUSIC_KEY="music-list";

// 保存数据
export function saveMusicList(data){
  localStorage.setItem(
    MUSIC_KEY,
    JSON.stringify(data)
  );
}

// 读取数据
export function loadMusicList(){
  const data=localStorage.getItem(MUSIC_KEY);

  if(!data)return null;

  try{
    return JSON.parse(data);
  }catch(error){
    console.warn("本地音乐数据解析失败，已回退到默认数据",error);
    localStorage.removeItem(MUSIC_KEY);
    return null;
  }
}
