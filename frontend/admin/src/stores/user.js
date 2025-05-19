import { defineStore } from "pinia";
import { request } from "@/utils";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    setToken(token, refreshToken) {
      this.token = token;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    removeInfo() {
      this.token = null;
      this.userInfo = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("refreshToken");
    },
    async login(credentials) {
      try {
        // 这里将来需要替换为实际的API调用
        const response = await userApi.login(credentials);
        debugger;
        const { accessToken, refreshToken, user } = response.data;

        // 保存到状态和本地存储
        this.setToken(accessToken, refreshToken);
        this.setUserInfo(user);

        return response.data;
      } catch (error) {
        console.error("登录失败", error);
        throw error;
      }
    },

    async logout() {
      try {
        // 这里将来需要调用实际的登出API
        await userApi.logout();

        // 清除状态和本地存储
        this.removeInfo();
      } catch (error) {
        console.error("登出失败", error);
        throw error;
      }
    },
  },
});
