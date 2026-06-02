import { loadToken } from "../utils/userStorage.js"

// 别的板块加载storage.js这个模块时，调用loadToken
export const authState = {
  token: loadToken(),
  user: null,
  mode: "login",
  errorMessage: ""
}