const DEFAULT_AVATAR = "./imgs/defaultTouxiang.png";

export function renderAuth(authState) {
  renderAuthUser(authState);
  renderAuthModal(authState);
}

export function renderAuthUser(authState) {
  const name = document.querySelector(".banner .name");
  const avatar = document.querySelector(".banner .user img");
  const authLoginButton = document.querySelector(".banner .authLoginButton");
  const authLogoutButton = document.querySelector(".banner .authLogoutButton");

  if (!name || !authLoginButton || !authLogoutButton) return;

  if (authState.user) {
    name.textContent = authState.user.nickname || authState.user.username;
    if (avatar) {
      avatar.src = authState.user.imageUrl || DEFAULT_AVATAR;
    }
    authLoginButton.style.display = "none";
    authLogoutButton.style.display = "flex";
    return;
  }

  name.textContent = "未登录";
  if (avatar) {
    avatar.src = DEFAULT_AVATAR;
  }
  authLoginButton.style.display = "flex";
  authLogoutButton.style.display = "none";
}

export function renderAuthModal(authState) {
  if (authState.mode !== "login" && authState.mode !== "register") return;

  const titleContent = document.querySelector(".authModal .title h2");
  const commitAuthButton = document.querySelector(".authModal .actions .commitAuthButton");
  const switchAuthModalButton = document.querySelector(".authModal .actions .switchAuthModalButton");
  const nicknameInput = document.querySelector(".authModal .nicknameInput");

  if (authState.mode === "login") {
    titleContent.textContent = "账号登录";
    setCommitButtonText(commitAuthButton, "登录");
    nicknameInput.style.display = "none";
    switchAuthModalButton.textContent = "没有账号？去注册";
    return;
  }

  titleContent.textContent = "账号注册";
  setCommitButtonText(commitAuthButton, "注册");
  nicknameInput.style.display = "flex";
  switchAuthModalButton.textContent = "已有账号？去登录";
}

function setCommitButtonText(button, text) {
  delete button.dataset.originText;
  button.textContent = text;
}
