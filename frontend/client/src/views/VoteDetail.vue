<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVoteStore } from '../stores/vote';
import { showToast, showDialog } from 'vant';

const route = useRoute();
const router = useRouter();
const voteStore = useVoteStore();

// 获取候选人ID
const candidateId = computed(() => Number(route.params.id));

// 获取候选人信息
const candidate = computed(() => {
  return voteStore.candidates.find(c => c.id === candidateId.value) || null;
});

// 投票功能
const handleVote = async () => {
  if (voteStore.hasVotedToday) {
    showToast('今日已投票，请明天再来');
    return;
  }
  
  try {
    const result = await voteStore.voteForCandidate(candidateId.value);
    showToast(result.message);
    voteStore.hasVotedToday = true;
  } catch (error) {
    showToast(error.message || '投票失败');
  }
};

// 返回首页
const goBack = () => {
  router.push('/');
};

// 分享功能
const handleShare = () => {
  showToast('分享功能开发中');
};

onMounted(() => {
  if (!candidate.value) {
    showToast('候选人不存在');
    router.push('/');
    return;
  }
  
  document.title = `${candidate.value.name} - ${voteStore.activityInfo.title}`;
});
</script>

<template>
  <div class="detail-container" v-if="candidate">
    <!-- 头部导航 -->
    <van-nav-bar
      :title="candidate.name"
      left-arrow
      @click-left="goBack"
      fixed
    >
      <template #right>
        <van-icon name="share-o" size="18" @click="handleShare" />
      </template>
    </van-nav-bar>
    
    <div class="detail-content">
      <!-- 候选人信息 -->
      <div class="candidate-header">
        <div class="candidate-image">
          <img :src="candidate.image" :alt="candidate.name" />
        </div>
        <div class="candidate-info">
          <div class="candidate-name">{{ candidate.name }}</div>
          <div class="candidate-title">{{ candidate.title }}</div>
          <div class="candidate-votes">当前票数: {{ candidate.votes }} 票</div>
        </div>
      </div>
      
      <!-- 投票按钮 -->
      <div class="vote-action">
        <van-button 
          type="danger" 
          block 
          round 
          size="large"
          :disabled="voteStore.hasVotedToday"
          @click="handleVote"
        >
          {{ voteStore.hasVotedToday ? '今日已投票' : '为TA投票' }}
        </van-button>
        <div class="vote-tip">
          每人每天可投{{ voteStore.activityInfo.voteLimit }}票
        </div>
      </div>
      
      <!-- 活动倒计时 -->
      <div class="countdown-box">
        <div class="countdown-title">距离活动结束还剩</div>
        <div class="countdown-timer">
          <div class="time-unit">
            <div class="time-value">{{ voteStore.remainingTime.days }}</div>
            <div class="time-label">天</div>
          </div>
          <div class="time-separator">:</div>
          <div class="time-unit">
            <div class="time-value">{{ voteStore.remainingTime.hours }}</div>
            <div class="time-label">时</div>
          </div>
          <div class="time-separator">:</div>
          <div class="time-unit">
            <div class="time-value">{{ voteStore.remainingTime.minutes }}</div>
            <div class="time-label">分</div>
          </div>
        </div>
      </div>
      
      <!-- 作品介绍 -->
      <div class="work-intro">
        <div class="section-title">作品介绍</div>
        <div class="work-content">
          <p>这是{{ candidate.name }}的参赛作品《{{ candidate.title }}》。</p>
          <p>作品创作于2023年，展现了作者对艺术的独特理解和表达。通过精湛的技法和丰富的想象力，作者在作品中融入了深刻的情感和思考。</p>
          <p>欢迎大家为这件作品投票，支持优秀的艺术创作！</p>
        </div>
      </div>
      
      <!-- 分享按钮 -->
      <div class="share-box">
        <van-button 
          type="primary" 
          block 
          round 
          icon="share-o"
          @click="handleShare"
        >
          分享给好友
        </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #3023ae, #53a0fd);
  color: white;
  padding-top: 46px; /* 导航栏高度 */
  padding-bottom: 20px;
}

.detail-content {
  padding: 20px 15px;
}

.candidate-header {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  color: #333;
}

.candidate-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 20px;
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
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.candidate-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.candidate-votes {
  font-size: 16px;
  font-weight: bold;
  color: #ff6b6b;
}

.vote-action {
  margin-bottom: 20px;
}

.vote-tip {
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
  opacity: 0.8;
}

.countdown-box {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.countdown-title {
  font-size: 16px;
  margin-bottom: 10px;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.time-unit {
  text-align: center;
}

.time-value {
  background-color: #ff6b6b;
  color: white;
  font-size: 20px;
  font-weight: bold;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 6px;
}

.time-label {
  font-size: 12px;
  margin-top: 5px;
}

.time-separator {
  margin: 0 5px;
  font-size: 20px;
  font-weight: bold;
  color: #ff6b6b;
}

.work-intro {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  color: #333;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.work-content {
  font-size: 14px;
  line-height: 1.6;
}

.share-box {
  margin-top: 30px;
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