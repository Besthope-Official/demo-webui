<template>
  <section class="interest-container">
    <div class="header">
      <h2>选择你的身份</h2>
      <button class="skip-btn" @click="skip">跳过</button>
    </div>

    <div class="identity-selection">
      <button
        v-for="item in identities"
        :key="item"
        :class="{ active: selectedIdentity === item }"
        @click="selectIdentity(item)"
      >
        {{ item }}
      </button>
    </div>

    <div class="topics-group">
      <h4>关心</h4>
      <div class="chips">
        <button
          v-for="(topic, index) in careTopics"
          :key="'care-' + index"
          :class="{ on: selectedCareIndices.has(index) }"
          @click="toggleCareTopic(index)"
        >
          {{ topic }}
        </button>
      </div>
    </div>

    <div class="topics-group">
      <h4>兴趣</h4>
      <div class="chips">
        <button
          v-for="(topic, index) in interestTopics"
          :key="'interest-' + index"
          :class="{ on: selectedInterestIndices.has(index) }"
          @click="toggleInterestTopic(index)"
        >
          {{ topic }}
        </button>
      </div>
    </div>

    <div class="actions">
      <button @click="finish">完成</button>
    </div>
  </section>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'UserInterest',
  setup() {
    const router = useRouter()
    const identities = ['学生', '从业者', '待业者', '家庭主妇/夫', '退休']
    const selectedIdentity = ref('从业者')

    const careTopicsByRole = {
      学生: [
        '考研', '就业', '学习方法', '社团活动', '实习', '留学', '升学',
        '竞赛', '心理', '人际', '消费', '健康', '恋爱', '职业规划', '兴趣',
      ],
      从业者: [
        '职业发展', '技能提升', '行业动态', '薪资', '跳槽', '晋升', '人脉',
        '副业', '创业', '工作效率', '职场沟通', '压力', '理财', '健康', '家庭平衡',
      ],
      待业者: [
        '求职', '面试技巧', '简历优化', '职业规划', '行业选择', '技能学习',
        '心态', '面试', '招聘会', '人脉', '内推', '作品集', '笔试', '薪资谈判', '求职渠道',
      ],
      '家庭主妇/夫': [
        '育儿', '家庭理财', '生活技巧', '自我提升', '亲子教育', '健康',
        '社交', '时间管理', '兴趣', '婚姻', '副业', '家务', '情感', '保险', '家庭关系',
      ],
      退休: [
        '健康', '兴趣', '养生', '养老金', '旅行', '社交', '再就业', '理财',
        '房产', '子女', '医疗', '健身', '法律', '保险', '学习',
      ],
    }

    const universalInterestTopics = [
      '阅读', '写作', '编程', '设计', '摄影', '旅行', '美食', '音乐',
      '电影', '运动', '游戏', '动漫', '绘画', '手工艺', '志愿服务', '健身',
      '瑜伽', '徒步', '跑步', '烹饪', '烘焙', '品酒', '品茶', '钓鱼', '园艺',
      '乐器', '书法', '桌游', '学习新技能', '线上课程', '播客', '博客', 'vlog',
      '短视频', '志愿者', '社交活动', '探索美食', '理财', '插花', '手工',
      '编织', '普拉提', '亲子活动', '育儿知识', '家庭收纳', '下棋', '养生',
      '广场舞', '太极', '唱歌', '戏曲', '社区活动',
    ]

    const careTopics = computed(() => careTopicsByRole[selectedIdentity.value] || [])
    const interestTopics = ref(universalInterestTopics)

    const selectedCareIndices = ref(new Set())
    const selectedInterestIndices = ref(new Set())

    function selectIdentity(item) {
      selectedIdentity.value = item
      selectedCareIndices.value.clear()
    }

    function toggleCareTopic(index) {
      if (selectedCareIndices.value.has(index)) {
        selectedCareIndices.value.delete(index)
      } else {
        selectedCareIndices.value.add(index)
      }
    }

    function toggleInterestTopic(index) {
      if (selectedInterestIndices.value.has(index)) {
        selectedInterestIndices.value.delete(index)
      } else {
        selectedInterestIndices.value.add(index)
      }
    }

    function finish() {
      const selectedCare = Array.from(selectedCareIndices.value).map(
        (i) => careTopics.value[i]
      )
      const selectedInterest = Array.from(selectedInterestIndices.value).map(
        (i) => interestTopics.value[i]
      )

      const data = {
        identity: selectedIdentity.value,
        careTopics: selectedCare,
        interestTopics: selectedInterest,
      }

      let userInfo = {}
      try {
        userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}')
      } catch (e) {
        console.warn('parse userInfo failed', e)
      }
      const combined = { ...userInfo, ...data }
      console.log('Collected user data', combined)

      try {
        sessionStorage.setItem('collectedUserData', JSON.stringify(combined))
      } catch (e) {
        console.warn('sessionStorage set failed', e)
      }
      router.push('/chat')
    }

    function skip() {
      console.log('Skipping interest selection')
      router.push('/chat')
    }

    return {
      identities,
      selectedIdentity,
      careTopics,
      interestTopics,
      selectedCareIndices,
      selectedInterestIndices,
      selectIdentity,
      toggleCareTopic,
      toggleInterestTopic,
      finish,
      skip,
    }
  },
}
</script>

<style scoped>
.interest-container {
  max-width: 420px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
  background-color: #fff;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 25px;
}

.header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.skip-btn {
  position: absolute;
  right: 0;
  background: none;
  border: none;
  color: #888;
  font-size: 15px;
  cursor: pointer;
}

.identity-selection {
  display: flex;
  justify-content: space-around;
  margin-bottom: 35px;
  padding: 0 10px;
}

.identity-selection button {
  background: none;
  border: none;
  padding: 5px 0;
  font-size: 16px;
  color: #555;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.identity-selection button.active {
  color: #000;
  font-weight: 600;
  border-bottom: 2px solid #ff9800;
}

.topics-group {
  margin-bottom: 25px;
}

.topics-group h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: left;
}

.chips {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.chips button {
  padding: 8px 16px;
  border: 1px solid #eee;
  border-radius: 20px;
  background-color: #f7f7f7;
  color: #555;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.chips button.on {
  background-color: #fff5e6;
  border-color: #ff9800;
  color: #ff9800;
  font-weight: 500;
}

.actions {
  margin-top: 30px;
  text-align: center;
}

.actions button {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 30px;
  background-color: #ff9800;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.actions button:hover {
  background-color: #f57c00;
}
</style>
