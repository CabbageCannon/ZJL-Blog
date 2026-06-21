import { showModalMask, closeModalMask } from "../utils/showModalMask.js";
import { renderAuthModal, renderAuthUser } from "./render.js";
import { authState } from "./state.js";
import { fetchMe, loginUser, registerUser } from "./api.js";
import { saveToken, removeToken, loadToken } from "../utils/userStorage.js";
import { setButtonLoading } from "../utils/buttonLoading.js";
import { showToast } from "../utils/toast.js";


let isAuthSubmitting = false;

export function bindEvents() {
  bindAuthModalEvents();
  bindCommitFormEvents();
  bindLogoutEvents();
  bindUpdateAvatar();
}

// 绑定注册登录板块事件
function bindAuthModalEvents() {
  const authLoginButton = document.querySelector(".banner .authUser .authLoginButton");
  const closeAuthModalButton = document.querySelector(".authModal .title .closeAuthModalButton");
  const switchAuthModalButton = document.querySelector(".authModal .actions .switchAuthModalButton");

  authLoginButton.addEventListener("click", openAuthModal);
  closeAuthModalButton.addEventListener("click", closeAuthModal);
  switchAuthModalButton.addEventListener("click", switchAuthMode);
}

// 绑定提交的登录注册表单事件
function bindCommitFormEvents() {
  const authForm = document.querySelector(".authModal .auth-form");
  authForm.addEventListener("submit", userLoginAndRegister);
}

// 绑定退出登录事件
function bindLogoutEvents() {
  const authLogoutButton = document.querySelector(".banner .authUser .authLogoutButton");
  authLogoutButton.addEventListener("click", authLogout);
}

// 绑定照片加载失败时重新获取事件
function bindUpdateAvatar() {
  let isAvatarReloading = false;
  const authImg = document.querySelector(".banner .user img");
  if (!authImg) return;
  authImg.addEventListener("error", async (ev) => {
    // 如果已经重新加载过了直接返回,避免循环出错
    if (isAvatarReloading) return;
    isAvatarReloading = true;
    // 如果加载失败了,可能是照片过期了
    try {
      const success = await reloadAvatar();
      // 重新渲染
      if (success) {
        renderAuthUser(authState);
      } else {
        ev.currentTarget.src = "./imgs/defaultTouxiang.png";
      }
    } finally {
      isAvatarReloading = false;
    }
  })
}

// 处理用户登出
function authLogout(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  removeToken();
  authState.token = null;
  authState.user = null;
  document.dispatchEvent(new CustomEvent("auth:logout"));
  renderAuthUser(authState);
  showToast("已退出登录", "info");
}

// 处理注册和登录
async function userLoginAndRegister(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (isAuthSubmitting) return;

  const usernameInput = document.querySelector(".authModal .usernameInput input");
  const nicknameInput = document.querySelector(".authModal .nicknameInput input");
  const passwordInput = document.querySelector(".authModal .passwordInput input");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (authState.mode === "login") {
    await submitLogin(username, password);
    return;
  }

  if (authState.mode === "register") {
    await submitRegister({
      username,
      password,
      nickname: nicknameInput.value.trim()
    });
  }
}

// 处理登录
async function submitLogin(username, password) {
  isAuthSubmitting = true;
  setAuthFormLoading(true, "登录中...");

  try {
    const res = await loginUser({ username, password });

    authState.token = res.token;
    saveToken(res.token);

    const profile = await fetchMe(res.token).catch(() => res);
    authState.user = normalizeAuthUser(profile.user || res.user);
    authState.mode = "authenticated";

    document.dispatchEvent(new CustomEvent("auth:login", {
      detail: {
        user: authState.user
      }
    }));

    clearInputs();
    closeModalMask();
    renderAuthUser(authState);
    showToast("登录成功", "success");
  } catch (err) {
    showToast(err.message || "登录失败", "error");
  } finally {
    isAuthSubmitting = false;
    setAuthFormLoading(false);
  }
}

// 用户数据兜底
function normalizeAuthUser(user) {
  if (!user) return null;

  return {
    ...user,
    imageUrl: user.imageUrl ?? null
  };
}

// 提交注册信息
async function submitRegister(userInfo) {
  isAuthSubmitting = true;
  setAuthFormLoading(true, "注册中...");

  try {
    await registerUser(userInfo);

    authState.mode = "login";
    clearInputs();
    renderAuthModal(authState);
    showToast("注册成功，请登录", "success");
  } catch (err) {
    showToast(err.message || "注册失败", "error");
  } finally {
    isAuthSubmitting = false;
    setAuthFormLoading(false);
  }
}

// 设置登录注册时表单加载的状态
function setAuthFormLoading(loading, loadingText) {
  const commitAuthButton = document.querySelector(".authModal .actions .commitAuthButton");
  const switchAuthModalButton = document.querySelector(".authModal .actions .switchAuthModalButton");
  const closeAuthModalButton = document.querySelector(".authModal .title .closeAuthModalButton");
  const inputs = document.querySelectorAll(".authModal .content input");

  setButtonLoading(commitAuthButton, loading, loadingText);

  [switchAuthModalButton, closeAuthModalButton, ...inputs].forEach(item => {
    if (!item) return;
    item.disabled = loading;
  });
}

// 清理登录注册表单
function clearInputs() {
  const authModalInputs = document.querySelectorAll(".authModal .content input");
  authModalInputs.forEach(input => input.value = "");
}

// 处理打开登录表单事件
function openAuthModal(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (isAuthSubmitting) return;

  authState.mode = "login";
  authState.errorMessage = "";
  const authModal = document.querySelector(".authModal");
  clearInputs();
  renderAuthModal(authState);
  showModalMask(authModal);
}

// 关闭登录表单事件
function closeAuthModal(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (isAuthSubmitting) return;

  closeModalMask();
}

// 切换登录注册状态
function switchAuthMode(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (isAuthSubmitting) return;

  authState.mode = authState.mode === "login" ? "register" : "login";
  authState.errorMessage = "";
  renderAuthModal(authState);
}

// 照片过期后刷新照片信息
async function reloadAvatar() {
  const token = loadToken();
  if (!token) return false;

  try {
    const res = await fetchMe(token);
    authState.user = normalizeAuthUser(res.user)
    return true;
  } catch (err) {
    showToast("重新刷新头像失败,重新登录重试", "error");
    return false;
  }
}