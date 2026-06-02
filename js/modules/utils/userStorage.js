const AUTH_TOKEN_KEY="zjl-blog-token";

// 存储token
export function saveToken(token){
  localStorage.setItem(AUTH_TOKEN_KEY,token);
}

// 获得token
export function loadToken(){
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// 移除token
export function removeToken(){
  localStorage.removeItem(AUTH_TOKEN_KEY);
}