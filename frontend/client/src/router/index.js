import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/vote/:id',
    name: 'VoteDetail',
    component: () => import('../views/VoteDetail.vue'),
    meta: { title: '投票详情' }
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: () => import('../views/Ranking.vue'),
    meta: { title: '人气排行' }
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

export default router