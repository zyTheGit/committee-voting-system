import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'members',
        name: 'Members',
        component: () => import('../views/Members.vue'),
        meta: { title: '委员管理' }
      },
      {
        path: 'owner',
        name: 'Owner',
        component: () => import('../views/Owner.vue'),
        meta: { title: '业主管理' }
      },
      {
        path: 'votes',
        name: 'Votes',
        component: () => import('../views/Votes.vue'),
        meta: { title: '投票管理' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: { title: '系统设置' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.isLoggedIn
  
  // 需要认证但未登录，重定向到登录页
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } 
  // 已登录但访问登录页，重定向到首页
  else if (to.path === '/login' && isAuthenticated) {
    next({ path: '/' })
  }
  // 其他情况正常放行
  else {
    next()
  }
})

export default router