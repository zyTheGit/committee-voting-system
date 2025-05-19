<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useUserStore } from '../stores/user'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const loading = ref(false)

const formRef = ref(null)
const formModel = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        // 这里将来需要调用实际的登录API
        await userStore.login(formModel)
        message.success('登录成功')
        router.push('/')
      } catch (error) {
        message.error(error.message || '登录失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">
        <h1>中海投票系统</h1>
        <h3>管理员登录</h3>
      </div>
      
      <n-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="80px"
        class="login-form"
      >
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="formModel.username" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="formModel.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </n-form-item>
        <n-form-item>
          <n-button
            type="primary"
            block
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
}

.login-title h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.login-title h3 {
  font-size: 16px;
  color: #606266;
  font-weight: normal;
}

.login-form {
  margin-top: 20px;
}
</style>