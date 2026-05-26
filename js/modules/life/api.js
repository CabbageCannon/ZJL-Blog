const BASE_URL = "http://localhost:3001";

// 获取日记信息
export async function fetchDiaries() {
  const res = await fetch(`${BASE_URL}/api/life/diaries`);

  if (!res.ok) {
    throw new Error("获取日记失败");
  }

  // 将json字符串解析为js数组或对象
  return res.json();
}

// 创建日记
export async function createDiary(lifeInfo) {
  const { mood, title, content, imageFile } = lifeInfo;
  const formData=new FormData();

  formData.append("mood",mood||"🥰");
  formData.append("title",title||"");
  formData.append("content",content||"");
  if(imageFile)
    formData.append("image",imageFile);
  
  const res=await fetch(`${BASE_URL}/api/life/diaries`,{
    method:"POST",
    body:formData
  });

  if(!res.ok){
    // 后面加的catch就是防止res.json解析失败，返回一个空对象给err
    const err=await res.json().catch(()=>({}));
    throw new Error(err.message || "日记发布失败");
  }

  return res.json();
}

// 删除日记
export async function deleteDiary(id){
  const res=await fetch(`${BASE_URL}/api/life/diaries/${id}`,{
    method:"DELETE"
  });

  if(!res.ok)
    throw new Error("删除日记失败");

  return res.json();
}

// 处理图片地址
export function resolveImageUrl(imageUrl){
  if(!imageUrl) return "";
  return `${BASE_URL}${imageUrl}`;
}