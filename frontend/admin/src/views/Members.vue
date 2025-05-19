<script setup>
// 委员管理页面
</script>

<template>
  <div class="members-container">
    <n-page-header title="委员管理">
      <template #subtitle>管理委员会成员信息</template>
    </n-page-header>
    
    <n-card title="委员列表" class="members-card">
      <template #header-extra>
        <n-button type="primary">添加委员</n-button>
      </template>
      
      <n-empty description="暂无委员数据">
        <template #extra>
          <n-button>添加委员</n-button>
        </template>
      </n-empty>
    </n-card>
  </div>
</template>

<style scoped>
.members-container {
  padding: 16px;
}

.members-card {
  margin-top: 24px;
}
</style>