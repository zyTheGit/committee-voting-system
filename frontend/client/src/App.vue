<script setup>
// 超级人气王投票系统
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #333;
  background-color: #f5f7fa;
  height: 100%;
  width: 100%;
}

.app-container {
  height: 100vh;
  width: 100%;
}

/* 修复Vant组件在某些情况下的样式问题 */
.van-button--danger {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
}

.van-button--primary {
  background-color: #3023ae;
  border-color: #3023ae;
}
</style>
