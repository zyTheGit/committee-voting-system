// 封装一个通用的请求函数
// 引入axios
import axios from "axios";
// 引入json-bigint
import JSONBIG from "json-bigint";
import { requestAuthUrl, authApi } from "@/api";
import {
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from "./function";

let isRefreshing = false;
let refreshSubscribers = [];

const instance = axios.create({
  baseURL: "/api",
  transformResponse: [
    function (data) {
      try {
        return JSONBIG.parse(data);
      } catch (err) {
        return data;
      }
    },
  ],
});

// 请求拦截器，自动带上token
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器，处理token过期
instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    // 白名单请求跳过获取token
    const whitelist = [requestAuthUrl.login, requestAuthUrl.refreshToken];
    const withoutToken = whitelist.includes(config.url);
    if (withoutToken) {
      return Promise.reject(response.data);
    }
    if (
      response &&
      response.status === 401 &&
      !config._retry &&
      !config.url.includes(requestAuthUrl.refreshToken)
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = getRefreshToken();
        try {
          const res = await authApi.refreshToken({ refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          setToken(accessToken);
          setRefreshToken(newRefreshToken);
          onRefreshed(accessToken);
          isRefreshing = false;
          config._retry = true;
          config.headers["Authorization"] = `Bearer ${accessToken}`;
          return instance(config);
        } catch (e) {
          isRefreshing = false;
          // 刷新失败，清除token并跳转登录
          setToken("");
          setRefreshToken("");
          window.location.href = "/login";
          return Promise.reject(e);
        }
      } else {
        // 正在刷新token，队列等待
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((token) => {
            config._retry = true;
            config.headers["Authorization"] = `Bearer ${token}`;
            resolve(instance(config));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export const request = instance;

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}
function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}
