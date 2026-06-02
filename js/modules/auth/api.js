const baseUrl = "http://localhost:3001";

// 用户注册
export async function registerUser(userInfo) {
  return requestAuth("api/auth/register", userInfo);
}

// 用户登录
export async function loginUser(userInfo) {
  return requestAuth("api/auth/login", userInfo);
}

// 通过token获取用户信息
export async function fetchMe(token) {
  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "登录状态已失效");
  }

  return res.json();
}

// 发出请求
async function requestAuth(path, body) {
  const res = await fetch(`${baseUrl}/${path}`, {
    method: "POST",
    headers: {
      // 告诉express：body中传入的字符串是json格式字符串
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  // res是后端返回的response对象，该对象的json方法会读取里面的body属性，
  // 并将它（本来是json字符串），通过json.parse变成js对象
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "请求失败");
  }

  return data;
}
