<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVoteStore } from '../stores/vote';

const router = useRouter();
const voteStore = useVoteStore();

// 返回首页
const goBack = () => {
  router.push('/');
};

onMounted(() => {
  document.title = `${voteStore.activityInfo.title} - 人气排行`;
});
</script>

<template>
  <div class="ranking-container">
    <!-- 头部 -->
    <van-nav-bar
      title="人气排行"
      left-arrow
      @click-left="goBack"
      fixed
    />
    
    <div class="ranking-content">
      <div class="ranking-header">
        <div class="title">{{ voteStore.activityInfo.title }}</div>
        <div class="subtitle">实时人气排行榜</div>
      </div>
      
      <!-- 排行榜列表 -->
      <div class="ranking-list">
        <div 
          v-for="(candidate, index) in voteStore.rankedCandidates" 
          :key="candidate.id"
          class="ranking-item"
          :class="{'top-three': index < 3}"
        >
          <div class="rank-number" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
          <div class="candidate-image">
            <img :src="candidate.image" :alt="candidate.name" />
          </div>
          <div class="candidate-info">
            <div class="candidate-name">{{ candidate.name }}</div>
            <div class="candidate-title">{{ candidate.title }}</div>
          </div>
          <div class="vote-count">{{ candidate.votes }}票</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #3023ae, #53a0fd);
  color: white;
  padding-top: 46px; /* 导航栏高度 */
}

.ranking-content {
  padding: 20px 15px;
}

.ranking-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 16px;
  opacity: 0.8;
}

.ranking-list {
  padding: 0 10px;
}

.ranking-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  color: #333;
}

.top-three {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rank-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 15px;
  background-color: #e0e0e0;
}

.rank-1 {
  background-color: gold;
  color: #333;
}

.rank-2 {
  background-color: silver;
  color: #333;
}

.rank-3 {
  background-color: #cd7f32; /* 铜色 */
  color: white;
}

.candidate-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 15px;
}

.candidate-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.candidate-info {
  flex: 1;
}

.candidate-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.candidate-title {
  font-size: 14px;
  color: #666;
}

.vote-count {
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
}

/* 覆盖Vant样式 */
:deep(.van-nav-bar) {
  background-color: transparent;
}

:deep(.van-nav-bar__title) {
  color: white;
}

:deep(.van-icon) {
  color: white !important;
}
</style>