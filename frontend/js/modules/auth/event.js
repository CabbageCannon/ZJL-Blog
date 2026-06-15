import { showModalMask, closeModalMask } from "../utils/showModalMask.js";
import { renderAuthModal, renderAuthUser } from "./render.js";
import { authState } from "./state.js";
import { loginUser, registerUser } from "./api.js";
import { saveToken, removeToken } from "../utils/userStorage.js";
import { setButtonLoading } from "../utils/buttonLoading.js";
import { showToast } from "../utils/toast.js";

let isAuthSubmitting = false;

export function bindEvents() {
  bindAuthModalEvents();
  bindCommitFormEvents();
  bindLogoutEvents();
}

function bindAuthModalEvents() {
  const authLoginButton = document.querySelector(".banner .authUser .authLoginButton");
  const closeAuthModalButton = document.querySelector(".authModal .title .closeAuthModalButton");
  const switchAuthModalButton = document.querySelector(".authModal .actions .switchAuthModalButton");

  authLoginButton.addEventListener("click", openAuthModal);
  closeAuthModalButton.addEventListener("click", closeAuthModal);
  switchAuthModalButton.addEventListener("click", switchAuthMode);
}

function bindCommitFormEvents() {
  const commitAuthButton = document.querySelector(".authModal .actions .commitAuthButton");
  commitAuthButton.addEventListener("click", userLoginAndRegister);
}

function bindLogoutEvents() {
  const authLogoutButton = document.querySelector(".banner .authUser .authLogoutButton");
  authLogoutButton.addEventListener("click", authLogout);
}

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

async function submitLogin(username, password) {
  isAuthSubmitting = true;
  setAuthFormLoading(true, "登录中...");

  try {
    const res = await loginUser({ username, password });

    authState.user = res.user;
    authState.mode = "authenticated";
    authState.token = res.token;
    saveToken(res.token);

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

function clearInputs() {
  const authModalInputs = document.querySelectorAll(".authModal .content input");
  authModalInputs.forEach(input => input.value = "");
}

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

function closeAuthModal(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (isAuthSubmitting) return;

  closeModalMask();
}

function switchAuthMode(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (isAuthSubmitting) return;

  authState.mode = authState.mode === "login" ? "register" : "login";
  authState.errorMessage = "";
  renderAuthModal(authState);
}
