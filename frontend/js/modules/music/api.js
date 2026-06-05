// 请求数据
export async function getMusicList() {
  const response = await fetch('./json/music.json');

  // fetch只有网络级别失败才会进catch，而ok只要请求失败就都是false
  // 只要请求失败了，ok都会返回false
  if(!response.ok){
    throw new Error("音乐数据请求失败");
  }

  return response.json();
}
