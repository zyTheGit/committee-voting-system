import { request } from "@/utils";

export const baseURL = "/user";

export const requestUserUrl = {
  login: `${baseURL}/login`,
  logout: `${baseURL}/logout`,
  register: `${baseURL}/register`,
  update: `${baseURL}/update`,
  list: `${baseURL}/list`,
};

export const userApi = {
  login: (params) => {
    return request({
      url: requestUserUrl.login,
      method: "post",
      data: params,
    });
  },
  logout: () => {
    return request({
      url: requestUserUrl.logout,
      method: "post",
    });
  },
};
