import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const isLoggedIn = ref(false)
  
  // 模拟登录
  function login(credentials) {
    return new Promise((resolve) => {
      // 这里将来会调用实际的登录API
      setTimeout(() => {
        userInfo.value = {
          id: 1,
          name: '用户' + Math.floor(Math.random() * 1000)
        }
        isLoggedIn.value = true
        resolve(userInfo.value)
      }, 300)
    })
  }

  // 模拟登出
  function logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        userInfo.value = null
        isLoggedIn.value = false
        resolve()
      }, 300)
    })
  }

  return {
    userInfo,
    isLoggedIn,
    login,
    logout
  }
})