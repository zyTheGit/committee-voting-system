<script setup>
import { ref, h } from 'vue'
import { NButton } from 'naive-ui'
import { renderIcon } from "@/utils";
import {
  TeamOutlined,
  FormOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@vicons/antd";

const statistics = ref([
  { title: '委员总数', value: 24, icon: 'TeamOutlined', color: '#1890ff' },
  { title: '进行中投票', value: 3, icon: 'FormOutlined', color: '#52c41a' },
  { title: '已完成投票', value: 12, icon: 'CheckCircleOutlined', color: '#faad14' },
  { title: '待审核事项', value: 5, icon: 'ExclamationCircleOutlined', color: '#ff4d4f' }
])

const recentVotes = ref([
  { id: 1, title: '2023年度预算审批', status: '进行中', participants: 18, endTime: '2023-12-15' },
  { id: 2, title: '新成员加入审核', status: '进行中', participants: 20, endTime: '2023-12-10' },
  { id: 3, title: '项目立项投票', status: '进行中', participants: 22, endTime: '2023-12-20' },
  { id: 4, title: '规章制度修订', status: '已完成', participants: 24, endTime: '2023-11-30' },
  { id: 5, title: '年度工作总结', status: '已完成', participants: 23, endTime: '2023-11-25' }
])
</script>

<template>
  <div class="dashboard-container">
    <n-page-header title="仪表盘">
      <template #subtitle>欢迎使用投票系统管理平台</template>
    </n-page-header>
    
    <!-- 统计卡片 -->
    <div class="stat-cards">
      <n-card v-for="(stat, index) in statistics" :key="index" class="stat-card" :bordered="false">
        <div class="stat-content">
          <div class="stat-icon" :style="{ backgroundColor: stat.color }">
            <n-icon size="24" :color="'#fff'">
              <!-- 这里实际使用时需要导入相应的图标组件 -->
              <component :is="stat.icon" />
            </n-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
          </div>
        </div>
      </n-card>
    </div>
    
    <!-- 最近投票 -->
    <n-card title="最近投票" class="recent-votes">
      <n-data-table
        :columns="[
          { title: 'ID', key: 'id' },
          { title: '投票标题', key: 'title' },
          { title: '状态', key: 'status' },
          { title: '参与人数', key: 'participants' },
          { title: '截止日期', key: 'endTime' },
          {
            title: '操作',
            key: 'actions',
            render: (row) => {
              return h(
                NButton,
                { size: 'small', type: 'primary' },
                { default: () => '查看详情' }
              )
            }
          }
        ]"
        :data="recentVotes"
        :bordered="false"
        :single-line="false"
      />
    </n-card>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 16px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 24px 0;
}

.stat-card {
  background-color: #fff;
  border-radius: 4px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
  color: #303133;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.recent-votes {
  margin-top: 24px;
}

@media (max-width: 1200px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stat-cards {
    grid-template-columns: 1fr;
  }
}
</style>