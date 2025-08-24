<template>
  <section class="identity">
    <h2 style="text-align:center">选择你的身份</h2>

    <div class="navibar">
      <button v-for="item in identities" :key="item" :class="{active: selected === item}" @click="select(item)">{{ item }}</button>
    </div>

    <div class="topics">
      <h4>关心的话题</h4>
      <div class="chips">
        <button v-for="t in topics" :key="t" :class="{on: selectedTopics.includes(t)}" @click="toggleTopic(t)">{{ t }}</button>
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
  setup(){
    const router = useRouter()
    const identities = ['学生','从业者','待业者','家庭主妇/夫','退休']
    const selected = ref(identities[0])

    const topicsBy = {
      '学生': ['考研','就业','学习方法'],
      '从业者': ['职业发展','技能提升','行业动态'],
      '待业者': ['求职','面试技巧','简历优化'],
      '家庭主妇/夫': ['育儿','家庭理财','生活技巧'],
      '退休': ['健康','兴趣','养生']
    }

    const selectedTopics = ref([])

    function select(item){
      selected.value = item
      // clear selected topics when switching
      selectedTopics.value = []
      // update topics list for the newly selected identity
      topics.value = topicsBy[item] || []
    }

    function toggleTopic(t){
      const i = selectedTopics.value.indexOf(t)
      if (i >= 0) selectedTopics.value.splice(i, 1)
      else selectedTopics.value.push(t)
    }

    function finish(){
      const data = {
        identity: selected.value,
        topics: Array.from(selectedTopics.value)
      }
      // read previous user info
      let userInfo = {}
      try { userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}') } catch(e){ console.warn('parse userInfo failed', e) }
      const combined = { ...userInfo, ...data }
      console.log('Collected user data', combined)
      // persist combined for later
      try { sessionStorage.setItem('collectedUserData', JSON.stringify(combined)) } catch(e){ console.warn('sessionStorage set failed', e) }
      router.push('/chat')
    }

    const topics = ref(topicsBy[selected.value])

    return { identities, selected, topics, selectedTopics: selectedTopics.value, select, toggleTopic, finish }
  }
}
</script>

<style scoped>
.navibar{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:12px 0}
.navibar button{padding:8px 12px;border:1px solid #ddd;background:#fff}
.navibar button.active{background:#eaf6ef;border-color:#42b983;color:#42b983}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chips button{padding:6px 10px;border:1px solid #ddd;background:#fff}
.chips button.on{background:#f0f8f5;border-color:#42b983;color:#42b983}
.actions{margin-top:24px;text-align:center}
</style>
