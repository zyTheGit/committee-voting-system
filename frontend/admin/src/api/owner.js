import { request } from "@/utils";

export const baseURL = "/owners";

export const requestOwnerUrl = {
  operator: `${baseURL}`,
  update: `${baseURL}/update`,
  import: `${baseURL}/import`,
};

export const ownerApi = {
  list: (params) => {
    return request({
      url: requestOwnerUrl.operator,
      method: "get",
      params,
    });
  },
  create: (params) => {
    return request({
      url: requestOwnerUrl.operator,
      method: "post",
      data: params,
    });
  },
  update: (id, params) => {
    return request({
      url: `${requestOwnerUrl.operator}/${id}`,
      method: "put",
      data: params,
    });
  },
  delete: (id) => {
    return request({
      url: `${requestOwnerUrl.operator}/${id}`,
      method: "delete",
    });
  },
  import: (data) => {
    return request({
      url: requestOwnerUrl.import,
      method: "post",
      data,
    });
  },
};
