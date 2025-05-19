import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const proxy = {
  dev: "http://localhost:3000",
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: proxy.dev,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        bypass: (req, res, options) => {
          const proxyURL = options.target + options.rewrite(req.url)
          req.headers['x-req-proxyURL'] = proxyURL // 设置未生效
          res.setHeader('x-req-proxyURL', proxyURL) // 设置响应头可以看到
        },
      },
    },
  },
});
