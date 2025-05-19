<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVoteStore } from '../stores/vote';
import { showToast, showDialog } from 'vant';

const router = useRouter();
const voteStore = useVoteStore();
const searchValue = ref('');

// 搜索候选人
const handleSearch = () => {
  voteStore.searchKeyword = searchValue.value;
};

// 投票功能
const handleVote = async (candidateId) => {
  if (voteStore.hasVotedToday) {
    showToast('今日已投票，请明天再来');
    return;
  }
  
  try {
    const result = await voteStore.voteForCandidate(candidateId);
    showToast(result.message);
    voteStore.hasVotedToday = true;
  } catch (error) {
    showToast(error.message || '投票失败');
  }
};

// 查看排行榜
const viewRanking = () => {
  router.push('/ranking');
};

// 查看详情
const viewDetail = (candidateId) => {
  router.push(`/vote/${candidateId}`);
};

onMounted(() => {
  // 这里可以加载实际数据
  document.title = voteStore.activityInfo.title;
});
</script>

<template>
  <div class="vote-container">
    <!-- 头部 -->
    <div class="header">
      <div class="title">{{ voteStore.activityInfo.title }}</div>
      <div class="countdown">
        活动倒计时: {{ voteStore.remainingTime.days }} 天 
        {{ voteStore.remainingTime.hours }} 小时 
        {{ voteStore.remainingTime.minutes }} 分
      </div>
      <div class="vote-info">
        每户可投{{ voteStore.activityInfo.voteLimit }}票，
        {{ voteStore.hasVotedToday ? '已投票' : '未投票' }}
      </div>
    </div>
    
    <!-- 标签页 -->
    <van-tabs v-model:active="activeTab" animated background="transparent">
      <van-tab title="参赛信息">        
        <!-- 搜索框 -->
        <div class="search-box">
          <van-search
            v-model="searchValue"
            placeholder="输入编号/名称"
            @search="handleSearch"
          />
        </div>
        
        <!-- 候选人列表 -->
        <div class="candidate-list">
          <div 
            v-for="(candidate, index) in voteStore.filteredCandidates" 
            :key="candidate.id"
            class="candidate-item"
            @click="viewDetail(candidate.id)"
          >
            <div class="candidate-rank">NO.{{ index + 1 }}</div>
            <div class="candidate-image">
              <img :src="candidate.image" :alt="candidate.name" />
            </div>
            <div class="candidate-info">
              <div class="candidate-name">{{ candidate.name }} {{ candidate.title }}</div>
              <div class="candidate-votes">当前票数: {{ candidate.votes }} 票</div>
            </div>
            <div class="vote-button">
              <van-button 
                type="danger" 
                size="small" 
                round 
                @click.stop="handleVote(candidate.id)"
              >
                为他投票
              </van-button>
            </div>
          </div>
        </div>
      </van-tab>
      
      <van-tab title="人气排行" @click="viewRanking">
        <!-- 排行榜内容将在单独页面实现 -->
        <div class="redirect-hint">
          <van-button type="primary" @click="viewRanking">查看完整排行榜</van-button>
        </div>
      </van-tab>
      
      <van-tab title="活动详情">
        <div class="activity-details">
          <h3>活动规则</h3>
          <p>1. 每户可投{{ voteStore.activityInfo.voteLimit }}票</p>
          <p>2. 活动结束后，票数最高的参赛者将获得"超级人气王"称号</p>
          <p>3. 禁止使用任何刷票软件或工具，一经发现将取消参赛资格</p>
          <p>4. 最终解释权归主办方所有</p>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
.vote-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #3023ae, #53a0fd);
  color: white;
  padding-bottom: 20px;
}

.header {
  padding: 20px 15px;
  text-align: center;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.countdown {
  font-size: 16px;
  margin-bottom: 5px;
}

.vote-info {
  font-size: 14px;
}

.search-box {
  padding: 10px;
}

.candidate-list {
  padding: 0 15px;
}

.candidate-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  color: #333;
  position: relative;
}

.candidate-rank {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 12px;
  font-weight: bold;
  color: #ff6b6b;
}

.candidate-image {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border-radius: 8px;
  overflow: hidden;
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

.candidate-votes {
  font-size: 14px;
  color: #666;
}

.vote-button {
  margin-left: 10px;
}

.redirect-hint {
  text-align: center;
  padding: 30px;
}

.activity-details {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 20px;
  margin: 15px;
  color: #333;
}

/* 覆盖Vant样式 */
:deep(.van-tabs) {
  background-color: transparent;
}

:deep(.van-tab) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.van-tab--active) {
  color: white;
}

:deep(.van-tabs__line) {
  background-color: white;
}
</style>