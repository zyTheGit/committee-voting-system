<script setup>
// 投票管理页面
</script>

<template>
  <div class="votes-container">
    <n-page-header title="投票管理">
      <template #subtitle>管理委员会投票事项</template>
    </n-page-header>
    
    <n-card title="投票列表" class="votes-card">
      <template #header-extra>
        <n-button type="primary">创建投票</n-button>
      </template>
      
      <n-tabs type="line" animated>
        <n-tab-pane name="ongoing" tab="进行中">
          <n-empty description="暂无进行中的投票">
            <template #extra>
              <n-button>创建投票</n-button>
            </template>
          </n-empty>
        </n-tab-pane>
        <n-tab-pane name="completed" tab="已完成">
          <n-empty description="暂无已完成的投票" />
        </n-tab-pane>
        <n-tab-pane name="draft" tab="草稿">
          <n-empty description="暂无草稿投票" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<style scoped>
.votes-container {
  padding: 16px;
}

.votes-card {
  margin-top: 24px;
}
</style>