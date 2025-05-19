import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVoteStore = defineStore('vote', () => {
  // 活动信息
  const activityInfo = ref({
    title: '中海业委会成员投票系统',
    voteLimit: 1,
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) // 7天后结束
  })

  // 搜索关键词
  const searchKeyword = ref('')

  // 是否已投票
  const hasVotedToday = ref(false)

  // 候选人列表（示例数据）
  const candidates = ref([
    {
      id: 1,
      name: '张三',
      title: '技术委员',
      image: 'https://via.placeholder.com/150',
      votes: 120,
      description: '资深技术专家，10年开发经验'
    },
    {
      id: 2,
      name: '李四',
      title: '管理委员',
      image: 'https://via.placeholder.com/150',
      votes: 98,
      description: '5年项目管理经验，擅长团队协作'
    },
    {
      id: 3,
      name: '王五',
      title: '财务委员',
      image: 'https://via.placeholder.com/150',
      votes: 87,
      description: '财务管理专家，精通预算控制'
    }
  ])

  // 根据搜索关键词过滤候选人
  const filteredCandidates = computed(() => {
    if (!searchKeyword.value) return candidates.value
    
    return candidates.value.filter(candidate => 
      candidate.name.includes(searchKeyword.value) || 
      candidate.id.toString().includes(searchKeyword.value)
    )
  })

  // 计算剩余时间
  const remainingTime = computed(() => {
    const now = new Date()
    const endTime = new Date(activityInfo.value.endDate)
    const diff = endTime - now
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes }
  })

  // 投票功能
  const voteForCandidate = async (candidateId) => {
    return new Promise((resolve, reject) => {
      // 这里将来会调用实际的投票API
      setTimeout(() => {
        try {
          const candidate = candidates.value.find(c => c.id === candidateId)
          if (candidate) {
            candidate.votes++
            resolve({ success: true, message: '投票成功！' })
          } else {
            reject(new Error('未找到该候选人'))
          }
        } catch (error) {
          reject(error)
        }
      }, 300)
    })
  }

  return {
    activityInfo,
    searchKeyword,
    hasVotedToday,
    candidates,
    filteredCandidates,
    remainingTime,
    voteForCandidate
  }
})