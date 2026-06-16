import { bindEvents } from "./event.js";
import { fetchMe } from "./api.js";
import { loadToken, removeToken } from "../utils/userStorage.js";
import { authState } from "./state.js";
import { renderAuthUser } from "./render.js";

export async function initAuth() {
  await restoreLogin();
  renderAuthUser(authState);
  bindEvents();
}

// 校验token
async function restoreLogin() {
  const token = loadToken();

  if (token) {
    try {
      const res = await fetchMe(token);
      authState.user = res.user;
      authState.token = token;
    } catch (err) {
      removeToken();
      authState.user = null;
      authState.token = null;
      alert(err);
    }
  }

}