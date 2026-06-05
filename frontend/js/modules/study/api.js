// 请求学习笔记数据
export async function getStudyCards(){
  const response=await fetch("./json/study.json");

  if(!response.ok){
    throw new Error("学习笔记数据请求失败");
  }

  return response.json();
}