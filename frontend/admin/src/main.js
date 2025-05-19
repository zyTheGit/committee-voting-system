import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import router from './router'
import App from './App.vue'
import './style.css'

// 创建应用实例
const app = createApp(App)

// 注册Pinia状态管理
app.use(createPinia())

// 注册路由
app.use(router)

// 注册Naive UI组件库
app.use(naive)

// 挂载应用
app.mount('#app')
