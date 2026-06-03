import { showModalMask, closeModalMask } from "../utils/showModalMask.js";
import { renderAuthModal, renderAuthUser } from "./render.js";
import { authState } from "./state.js";
import { loginUser, registerUser } from "./api.js";
import { saveToken, removeToken } from "../utils/userStorage.js";

export function bindEvents() {
  bindAuthModalEvents();
  bindCommitFormEvents();
  bindLogoutEvents();
}

// 绑定登录退出框相关事件
function bindAuthModalEvents() {
  const authLoginButton = document.querySelector(".banner .authUser .authLoginButton");
  const closeAuthModalButton = document.querySelector(".authModal .title .closeAuthModalButton");
  const switchAuthModalButton = document.querySelector(".authModal .actions .switchAuthModalButton");

  authLoginButton.addEventListener("click", openAuthModal);
  closeAuthModalButton.addEventListener("click", closeAuthModal);
  switchAuthModalButton.addEventListener("click", switchAuthMode);
}

// 绑定提交登录或注册表单相关事件
function bindCommitFormEvents() {
  const commitAuthButton = document.querySelector(".authModal .actions .commitAuthButton");

  commitAuthButton.addEventListener("click", userLoginAndRegister);
}

// 绑定退出登录相关事件
function bindLogoutEvents() {
  const authLogoutButton = document.querySelector(".banner .authUser .authLogoutButton");
  authLogoutButton.addEventListener("click", authLogout);
}

function authLogout(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  // 清除本地token
  removeToken();
  authState.token = null;
  authState.user = null;
  renderAuthUser(authState);
}

// 用户登录与注册
async function userLoginAndRegister(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  const usernameInput = document.querySelector(".authModal .usernameInput input");
  const nicknameInput = document.querySelector(".authModal .nicknameInput input");
  const passwordInput = document.querySelector(".authModal .passwordInput input");

  const username = usernameInput.value;
  const password = passwordInput.value;
  let res = null;

  if (authState.mode === "login") {
    try {
      res = await loginUser({
        username: username,
        password: password
      })
      // 更新登录状态
      authState.user = res.user;
      authState.mode = "authenticated";
      saveToken(res.token);
      authState.token=res.token;
    } catch (err) {
      alert(err.message);
    } finally {
      clearInputs();
    }

    // 将登录框关闭
    closeModalMask();

    // 更新用户栏
    renderAuthUser(authState);

    res = null;
    return;
  }

  if (authState.mode === "register") {
    const nickname = nicknameInput.value;

    try {
      res = await registerUser({
        username: username,
        nickname: nickname,
        password: password
      })
      authState.mode = "login";
    } catch (err) {
      alert(err.message);
    } finally {
      clearInputs();
    }

    renderAuthModal(authState);
    return;
  }
}

// 清空输入框
function clearInputs() {
  const authModalInputs = document.querySelectorAll(".authModal .content input");
  authModalInputs.forEach(input => input.value = "");
}

// 注册登录弹出框的弹出
function openAuthModal(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  authState.mode = "login";
  authState.errorMessage = "";
  const authModal = document.querySelector(".authModal");
  clearInputs();
  showModalMask(authModal);
}

// 注册登录框的收回
function closeAuthModal(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  closeModalMask();
}

// 注册登录弹出框注册登录的切换
function switchAuthMode(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  authState.mode = authState.mode === "login" ? "register" : "login";
  authState.errorMessage = "";
  renderAuthModal(authState);
}