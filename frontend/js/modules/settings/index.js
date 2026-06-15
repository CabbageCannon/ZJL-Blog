import initEvents from "./events.js";
import { authState } from "../auth/state.js";
import { enhanceSettingsSection, renderSettings } from "./render.js";

export async function initSettings() {
  enhanceSettingsSection();
  renderSettings(authState.user);
  initEvents();
}
