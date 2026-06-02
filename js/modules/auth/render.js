export function renderAuth(authState) {
  renderAuthUser(authState);
  renderAuthModal(authState);
}

// 渲染用户图标
export function renderAuthUser(authState) {
  const name = document.querySelector(".banner .name");
  const authLoginButton = document.querySelector(".banner .authLoginButton");
  const authLogoutButton = document.querySelector(".banner .authLogoutButton");

  if (!name || !authLoginButton || !authLogoutButton) return;

  if (authState.user) {
    name.textContent = authState.user.nickname || authState.user.username;
    authLoginButton.style.display = "none";
    authLogoutButton.style.display = "flex";
  } else {
    name.textContent = "未登录";
    authLoginButton.style.display = "flex";
    authLogoutButton.style.display = "none";
  }
}

// 渲染登录注册弹出框
export function renderAuthModal(authState) {
  if (authState.mode !== "login" && authState.mode !== "register") return;

  const titleContent = document.querySelector(".authModal .title h2");
  const commitAuthButton = document.querySelector(".authModal .actions .commitAuthButton");
  const switchAuthModalButton = document.querySelector(".authModal .actions .switchAuthModalButton");
  const nicknameInput = document.querySelector(".authModal .nicknameInput");

  if (authState.mode === "login") {
    titleContent.textContent = "账号登录";
    commitAuthButton.textContent = "登录";
    nicknameInput.style.display = "none";
    switchAuthModalButton.textContent = "没有账号？去注册";
    return;
  }

  if (authState.mode === "register") {
    titleContent.textContent = "账号注册"
    commitAuthButton.textContent = "注册";
    nicknameInput.style.display = "flex";
    switchAuthModalButton.textContent = "已有账号？去登录";
    return;
  }
}