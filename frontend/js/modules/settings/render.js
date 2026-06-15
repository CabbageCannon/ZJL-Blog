import { settingsContent } from "./content.js";
import { createIcon } from "../utils/createIcon.js";

export const DEFAULT_AVATAR = "./assets/upload/touxiang.jpg";

export function enhanceSettingsSection() {
  const settingsSection = document.querySelector("#settings");
  const wrapper = document.querySelector("#settings .settingsWrapper");
  const header = document.querySelector("#settings .settingsHeader");

  if (!settingsSection || !wrapper || !header) return;
  if (settingsSection.dataset.enhanced === "true") return;

  wrapper.insertBefore(createSettingsHero(), header);
  settingsSection.dataset.enhanced = "true";
}

export function renderSettings(user, options = {}) {
  const previewImageUrl = options.previewImageUrl || user?.imageUrl || DEFAULT_AVATAR;

  setImage(".settingsAvatarPreview", previewImageUrl);
  setImage(".settingsQuickAvatar", previewImageUrl);
  setInputValue(".settingsNicknameInput", user?.nickname || "", !user);
  setInputValue(".settingsUsernameInput", user?.username || "", true);
  setText(".registerTime", user?.createdAt ? formatTime(user.createdAt) : "未登录");
  setText(".lastLoginTime", user ? "Token 有效期内" : "未登录");
  setText(".settingsLoginStateText", user ? "已登录" : "未登录");
  setText(
    ".settingsLoginHint",
    user
      ? "当前资料修改会同步到顶部导航与用户头像展示区。"
      : "请先登录后再修改昵称和头像。"
  );
  setText(".settingsProfileName", user?.nickname || "未登录用户");
  setText(
    ".settingsProfileMeta",
    user?.username ? `@${user.username}` : "等待登录后同步账号资料"
  );
  setText(".settingsQuickNickname", user?.nickname || "未设置");
  setText(".settingsQuickUsername", user?.username || "未登录");
}

export function setSettingsLoading(isLoading, text = "保存中...") {
  const saveButton = document.querySelector(".saveProfileButton");
  const cancelButton = document.querySelector(".cancelProfileButton");
  const avatarInput = document.querySelector(".avatarUploadInput");

  [saveButton, cancelButton, avatarInput].forEach(item => {
    if (!item) return;
    item.disabled = isLoading;
  });

  if (!saveButton) return;

  if (!saveButton.dataset.originText) {
    saveButton.dataset.originText = saveButton.querySelector("span")?.textContent?.trim() || "保存修改";
  }

  saveButton.classList.toggle("is-loading", isLoading);

  const textNode = saveButton.querySelector("span");
  if (textNode) {
    textNode.textContent = isLoading ? text : saveButton.dataset.originText;
  } else {
    saveButton.textContent = isLoading ? text : saveButton.dataset.originText;
  }
}

function createSettingsHero() {
  const hero = document.createElement("header");
  const copy = document.createElement("div");
  const eyebrow = document.createElement("p");
  const title = document.createElement("h2");
  const desc = document.createElement("p");
  const chips = document.createElement("ul");
  const summary = document.createElement("aside");
  const profile = document.createElement("div");
  const avatar = document.createElement("img");
  const profileCopy = document.createElement("div");
  const profileName = document.createElement("strong");
  const profileMeta = document.createElement("span");
  const metrics = document.createElement("div");

  hero.className = "settingsHero sectionShell";
  copy.className = "settingsHeroCopy";
  eyebrow.className = "editorialTag";
  title.className = "settingsHeroTitle";
  desc.className = "sectionShellBody";
  chips.className = "settingsHeroChips";
  summary.className = "settingsHeroSummary";
  profile.className = "settingsHeroProfile";
  avatar.className = "settingsQuickAvatar";
  profileCopy.className = "settingsHeroProfileCopy";
  profileName.className = "settingsProfileName";
  profileMeta.className = "settingsProfileMeta";
  metrics.className = "settingsHeroMetrics";

  eyebrow.textContent = settingsContent.intro.eyebrow;
  title.textContent = settingsContent.intro.title;
  desc.textContent = settingsContent.intro.description;
  avatar.src = DEFAULT_AVATAR;
  avatar.alt = "账号头像预览";
  profileName.textContent = "未登录用户";
  profileMeta.textContent = "等待登录后同步账号资料";

  settingsContent.intro.chips.forEach(item => {
    const li = document.createElement("li");
    li.append(createIcon("icon-check", "iconSvg iconSvg--sm"), document.createTextNode(item));
    chips.appendChild(li);
  });

  metrics.append(
    createQuickMetric("当前昵称", "settingsQuickNickname", "未设置"),
    createQuickMetric("账号标识", "settingsQuickUsername", "未登录")
  );

  profileCopy.append(profileName, profileMeta);
  profile.append(avatar, profileCopy);
  summary.append(profile, metrics, createHeroNoteList());
  copy.append(eyebrow, title, desc, chips);
  hero.append(copy, summary);

  return hero;
}

function createQuickMetric(labelText, valueClassName, valueText) {
  const item = document.createElement("div");
  const label = document.createElement("span");
  const value = document.createElement("strong");

  item.className = "settingsQuickMetric";
  label.className = "settingsQuickLabel";
  value.className = `settingsQuickValue ${valueClassName}`.trim();

  label.textContent = labelText;
  value.textContent = valueText;

  item.append(label, value);
  return item;
}

function createHeroNoteList() {
  const list = document.createElement("ul");
  list.className = "settingsHeroNotes";

  settingsContent.notes.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  return list;
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function setImage(selector, src) {
  const img = document.querySelector(selector);
  if (img) img.src = src;
}

function setInputValue(selector, value, disabled) {
  const input = document.querySelector(selector);
  if (!input) return;

  input.value = value;
  input.disabled = disabled;
}

function formatTime(timeText) {
  const date = new Date(timeText);

  if (Number.isNaN(date.getTime())) {
    return timeText;
  }

  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}
