import { API_BASE_URL } from "../../config/apiConfig.js";
import { loadToken } from "../utils/userStorage.js";

const BASE_URL = API_BASE_URL;

export async function updateProfile(profileInfo) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(profileInfo)
  });

  return parseResponse(res, "保存资料失败");
}

export async function uploadAvatar(imageFile) {
  const token = getToken();
  const formData = new FormData();
  formData.append("avatar", imageFile);

  const res = await fetch(`${BASE_URL}/api/auth/me/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  return parseResponse(res, "上传头像失败");
}

function getToken() {
  const token = loadToken();

  if (!token) {
    throw new Error("请先登录后再修改账号资料");
  }

  return token;
}

async function parseResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}
