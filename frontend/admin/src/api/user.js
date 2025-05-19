import { request } from "@/utils";

export const baseURL = "/user";

export const requestUserUrl = {
  update: `${baseURL}/update`,
  list: `${baseURL}/list`,
};

export const userApi = {
  list: (params) => {
    return request({
      url: requestUserUrl.list,
      params
    });
  },
  update: (data) => {
    return request({
      url: requestUserUrl.update,
      method: "post",
      data,
    });
  },
};
