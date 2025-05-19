import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

// 导入Vant组件
import { 
  Button, 
  NavBar, 
  Tabbar, 
  TabbarItem,
  Tab, 
  Tabs,
  Search,
  Icon,
  Empty,
  Toast,
  Dialog,
  Loading
} from 'vant'

// 导入Vant样式
import 'vant/lib/index.css'

const app = createApp(App)

// 注册Pinia
app.use(createPinia())

// 注册路由
app.use(router)

// 注册Vant组件
app.use(Button)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Tab)
app.use(Tabs)
app.use(Search)
app.use(Icon)
app.use(Empty)
app.use(Toast)
app.use(Dialog)
app.use(Loading)

app.mount('#app')
