import { h } from "vue";
import { NIcon } from "naive-ui";

export function renderNode(parent, node) {
  return () => h(parent, null, { default: () => h(node) });
}

export function renderIcon(icon) {
  return renderNode(NIcon, icon);
}

// token存储与获取
export function getToken() {
  return localStorage.getItem("accessToken");
}
export function setToken(token) {
  localStorage.setItem("accessToken", token);
}
export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}
export function setRefreshToken(token) {
  localStorage.setItem("refreshToken", token);
}
