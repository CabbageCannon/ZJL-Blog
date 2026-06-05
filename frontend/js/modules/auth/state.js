import { loadToken } from "../utils/userStorage.js"

// 别的板块加载storage.js这个模块时，调用loadToken
export const authState = {
  token: loadToken(),
  user: null,
  // mode表示当前状态：login、register、authenticated
  mode: "login",
  errorMessage: ""
}