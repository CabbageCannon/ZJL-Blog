const LIFE_KEY="zjl-life-diary-v1";

export function saveDiaryList(list){
  localStorage.setItem(LIFE_KEY,JSON.stringify(list));
}

export function loadDiaryList(){
  try{
    const raw=localStorage.getItem(LIFE_KEY);
    if(!raw)return [];
    const parsed=JSON.parse(raw);
    // 防止localStorage中的数据出错
    return Array.isArray(parsed)?parsed:[];
  }catch(err){
    return [];
  }
}