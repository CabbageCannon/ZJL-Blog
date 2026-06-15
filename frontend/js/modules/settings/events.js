import { authState } from "../auth/state.js";
import { renderAuthUser } from "../auth/render.js";
import { saveToken } from "../utils/userStorage.js";
import { showToast } from "../utils/toast.js";
import { compressImageFile } from "../utils/compressImage.js";
import { updateProfile, uploadAvatar } from "./api.js";
import { renderSettings, setSettingsLoading } from "./render.js";

let selectedAvatarFile = null;
let selectedAvatarPreviewUrl = "";
let isSubmitting = false;

function initEvents() {
  bindAvatarSelectEvents();
  bindSaveProfileEvent();
  bindCancelProfileEvent();
  bindAuthEvents();
  bindSectionShowEvent();
}

function bindAvatarSelectEvents() {
  const formAvatarInput = document.querySelector(".avatarUploadInput");
  if (!formAvatarInput) return;

  formAvatarInput.addEventListener("change", handleAvatarFileChange);
}

async function handleAvatarFileChange(ev) {
  const file = ev.target.files[0] || null;
  if (!file) return;

  if (!requireLogin()) {
    clearFileInput();
    return;
  }

  try {
    const compressedFile = await compressImageFile(file);
    selectedAvatarFile = compressedFile;

    revokeSelectedPreviewUrl();
    selectedAvatarPreviewUrl = URL.createObjectURL(compressedFile);
    renderSettings(authState.user, {
      previewImageUrl: selectedAvatarPreviewUrl
    });
    showToast("头像已选择，点击保存后生效", "info");
  } catch (error) {
    console.error(error);
    showToast(error.message || "头像读取失败", "error");
    clearSelectedAvatar();
  } finally {
    clearFileInput();
  }
}

function bindSaveProfileEvent() {
  const form = document.querySelector(".settingsForm");
  if (!form) return;

  form.addEventListener("submit", handleSaveProfile);
}

async function handleSaveProfile(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  if (isSubmitting) return;
  if (!requireLogin()) return;

  const nicknameInput = document.querySelector(".settingsNicknameInput");
  const nextNickname = (nicknameInput?.value || "").trim();
  const currentNickname = authState.user?.nickname || "";
  const shouldUpdateProfile = nextNickname !== currentNickname;
  const shouldUploadAvatar = Boolean(selectedAvatarFile);

  if (!shouldUpdateProfile && !shouldUploadAvatar) {
    showToast("没有需要保存的修改", "info");
    return;
  }

  isSubmitting = true;
  setSettingsLoading(true);

  try {
    if (shouldUpdateProfile) {
      const data = await updateProfile({
        nickname: nextNickname
      });
      syncAuthUser(data);
    }

    if (shouldUploadAvatar) {
      const data = await uploadAvatar(selectedAvatarFile);
      syncAuthUser(data);
      clearSelectedAvatar();
    }

    renderSettings(authState.user);
    renderAuthUser(authState);
    showToast("账号资料已保存", "success");
  } catch (error) {
    console.error(error);
    showToast(error.message || "保存账号资料失败", "error");
  } finally {
    isSubmitting = false;
    setSettingsLoading(false);
  }
}

function bindCancelProfileEvent() {
  const cancelButton = document.querySelector(".cancelProfileButton");
  if (!cancelButton) return;

  cancelButton.addEventListener("click", ev => {
    ev.preventDefault();
    ev.stopPropagation();

    clearSelectedAvatar();
    renderSettings(authState.user);
    showToast("已撤销未保存的修改", "info");
  });
}

function bindAuthEvents() {
  document.addEventListener("auth:login", ev => {
    clearSelectedAvatar();
    renderSettings(ev.detail?.user || authState.user);
  });

  document.addEventListener("auth:logout", () => {
    clearSelectedAvatar();
    renderSettings(null);
  });
}

function bindSectionShowEvent() {
  document.addEventListener("section:show", ev => {
    if (ev.detail?.nextSectionId !== "settings") return;

    clearSelectedAvatar();
    renderSettings(authState.user);
  });
}

function syncAuthUser(data) {
  if (!data?.user) return;

  authState.user = data.user;

  if (data.token) {
    authState.token = data.token;
    saveToken(data.token);
  }
}

function requireLogin() {
  if (authState.token && authState.user) return true;

  showToast("请先登录后再修改账号资料", "warning");
  return false;
}

function clearSelectedAvatar(shouldRevoke = true) {
  selectedAvatarFile = null;
  if (shouldRevoke) {
    revokeSelectedPreviewUrl();
  }
  clearFileInput();
}

function clearFileInput() {
  const formAvatarInput = document.querySelector(".avatarUploadInput");
  if (formAvatarInput) {
    formAvatarInput.value = "";
  }
}

function revokeSelectedPreviewUrl() {
  if (!selectedAvatarPreviewUrl) return;

  URL.revokeObjectURL(selectedAvatarPreviewUrl);
  selectedAvatarPreviewUrl = "";
}

export default initEvents;
