import { request } from "@/utils";

export const baseURL = "/auth";

export const requestAuthUrl = {
  login: `${baseURL}/login`,
  logout: `${baseURL}/logout`,
  register: `${baseURL}/register`,
  // 刷新token
  refreshToken: `${baseURL}/refreshToken`,
};

export const authApi = {
  login: (params) => {
    return request({
      url: requestAuthUrl.login,
      method: "post",
      data: params,
    });
  },
  logout: () => {
    return request({
      url: requestAuthUrl.logout,
      method: "post",
    });
  },
  refreshToken: () => {
    return request({
      url: requestAuthUrl.refreshToken,
      method: "post",
    });
  },
};
