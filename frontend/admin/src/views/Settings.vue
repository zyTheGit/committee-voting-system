<script setup>
// 系统设置页面
</script>

<template>
  <div class="settings-container">
    <n-page-header title="系统设置">
      <template #subtitle>管理系统配置参数</template>
    </n-page-header>
    
    <n-card title="基本设置" class="settings-card">
      <n-form label-placement="left" label-width="120px">
        <n-form-item label="系统名称">
          <n-input placeholder="请输入系统名称" />
        </n-form-item>
        <n-form-item label="管理员邮箱">
          <n-input placeholder="请输入管理员邮箱" />
        </n-form-item>
        <n-form-item label="投票默认有效期">
          <n-input-number placeholder="请输入天数" />
        </n-form-item>
        <n-form-item label="是否开启邮件通知">
          <n-switch />
        </n-form-item>
        <n-form-item>
          <n-button type="primary">保存设置</n-button>
        </n-form-item>
      </n-form>
    </n-card>
    
    <n-card title="安全设置" class="settings-card">
      <n-form label-placement="left" label-width="120px">
        <n-form-item label="修改密码">
          <n-input type="password" placeholder="请输入当前密码" />
        </n-form-item>
        <n-form-item label="新密码">
          <n-input type="password" placeholder="请输入新密码" />
        </n-form-item>
        <n-form-item label="确认新密码">
          <n-input type="password" placeholder="请再次输入新密码" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary">更新密码</n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 16px;
}

.settings-card {
  margin-top: 24px;
}
</style>