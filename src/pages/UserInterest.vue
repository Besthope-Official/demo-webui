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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'UserInterest',
  setup() {
    const router = useRouter()
    const identities = ['学生', '从业者', '待业者', '家庭主妇/夫', '退休']
    const selectedIdentity = ref('从业者')

    // Use unique topics for both categories
    const uniqueTopics = ['影片', '旅行', '摄影', '学习', '交友', '阅读', '写作', '英语'];
    
    const careTopics = ref(uniqueTopics);
    const interestTopics = ref(uniqueTopics);

    // Use separate Sets to manage selections for each category independently
    const selectedCareIndices = ref(new Set())
    const selectedInterestIndices = ref(new Set())

    function selectIdentity(item) {
      selectedIdentity.value = item
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
      // Map selected indices back to topic strings for submission
      const selectedCare = Array.from(selectedCareIndices.value).map(i => careTopics.value[i]);
      const selectedInterest = Array.from(selectedInterestIndices.value).map(i => interestTopics.value[i]);

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
