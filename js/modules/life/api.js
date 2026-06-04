import { loadToken } from "../utils/userStorage.js";
import { API_BASE_URL } from "../../config/apiConfig.js";

const BASE_URL = API_BASE_URL;

// 获取日记信息
export async function fetchDiaries() {
  const token = loadToken();
  if (!token)
    throw new Error("登录已过期，请重新登录");

  const res = await fetch(`${BASE_URL}/api/life/diaries`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("获取日记失败");
  }

  // 将json字符串解析为js数组或对象
  return res.json();
}

// 创建日记
export async function createDiary(lifeInfo) {
  const token = loadToken();
  const { mood, title, content, imageFile, imageRatio } = lifeInfo;
  const formData = new FormData();

  formData.append("mood", mood || "🥰");
  formData.append("title", title || "");
  formData.append("content", content || "");
  if (imageFile) {
    formData.append("image", imageFile);
    formData.append("imageRatio", imageRatio);
  }

  const res = await fetch(`${BASE_URL}/api/life/diaries`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    // 后面加的catch就是防止res.json解析失败，返回一个空对象给err
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "日记发布失败");
  }

  return res.json();
}

// 删除日记
export async function deleteDiary(id) {
  const token = loadToken();
  const res = await fetch(`${BASE_URL}/api/life/diaries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: "DELETE"
  });

  if (!res.ok)
    throw new Error("删除日记失败");

  return res.json();
}

// 处理图片地址
export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  return `${BASE_URL}${imageUrl}`;
}