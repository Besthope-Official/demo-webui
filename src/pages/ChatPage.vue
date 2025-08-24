<template>
  <section class="chat-page">
    <!-- chat header: shown as title, only in chat state -->
  <header v-if="inChat" class="chat-header"><h2 class="chat-title">会话</h2></header>

    <div class="chat-body">
      <!-- Home state: show before user asks first question -->
      <div v-if="!inChat" class="home">
        <h2>我可以给到您专业的心理答疑</h2>
        <p class="welcome">欢迎，您可以直接输入问题或选择下面的推荐问题开始。</p>

        <div class="home-input">
          <input v-model="input" placeholder="有什么问题尽管问我" />
          <button @click="send">发送</button>
        </div>

        <div class="recommendations">
          <h4>推荐问题</h4>
          <div class="chips">
            <button v-for="r in recs" :key="r" @click="applyRec(r)">{{ r }}</button>
          </div>
        </div>
      </div>

      <!-- Chat state: conversation -->
      <div v-else class="messages">
        <div v-for="(m, idx) in messages" :key="idx" :class="['msg', m.role]">
          <div class="bubble">{{ m.text }}</div>
          <div v-if="m.role==='ai' && m.progress !== undefined" class="progress"><div class="bar" :style="{width: m.progress + '%'}"></div></div>
        </div>
      </div>
    </div>

    <!-- input area always shown in footer for convenience when in chat -->
    <div class="chat-input" v-if="inChat">
      <input v-model="input" placeholder="有什么问题尽管问我" @keyup.enter="send" />
      <button @click="send">发送</button>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ChatPage',
  setup(){
    const input = ref('')
    const inChat = ref(false)
    const messages = ref([])
    const recs = ref([
      '如何缓解焦虑？',
      '最近总是睡不好，怎么办？',
      '推荐几本心理学入门书籍'
    ])

    let collected = {}
    try { collected = JSON.parse(sessionStorage.getItem('collectedUserData') || '{}') } catch(e){ console.warn('parse collectedUserData failed', e) }
    console.log('Collected user data at chat start:', collected)

    function applyRec(text){
      input.value = text
    }

    function send(){
      const text = (input.value || '').trim()
      if (!text) return
      // push user message
      messages.value.push({ role: 'user', text })
      input.value = ''
      // transition to chat state if not already
      if (!inChat.value) inChat.value = true

      // push a placeholder AI response with simulated progress
      messages.value.push({ role: 'ai', text: '正在思考...', progress: 30 })

      // simulate progress finishing after short timeout
      setTimeout(()=>{
        const ai = messages.value.find(m => m.role==='ai' && m.text==='正在思考...')
        if (ai) {
          ai.progress = 100
          ai.text = '这是一个示例回复，实际回复将来自后端或模型。'
        }
      }, 800)

      console.log('send', text)
    }

    return { input, inChat, messages, recs, applyRec, send, collected }
  }
}
</script>

<style scoped>
.chat-page{display:flex;flex-direction:column;height:100%}
.chat-header{height:56px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:center;padding:0 16px}
.chat-header .chat-title{margin:0;font-size:16px;font-weight:600}
.chat-body{flex:1;padding:16px;overflow:auto}
.home{max-width:720px;margin:20px auto;text-align:center}
.welcome{color:#666}
.home-input{display:flex;justify-content:center;margin:16px 0}
.home-input input{width:60%;padding:8px 10px}
.home-input button{margin-left:8px;padding:8px 14px}
.recommendations{margin-top:12px}
.recommendations .chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.recommendations button{padding:6px 10px;border:1px solid #ddd;background:#fff}
.messages{display:flex;flex-direction:column;gap:12px}
.msg{max-width:70%}
.msg .bubble{padding:10px 12px;border-radius:8px;background:#f5f5f5}
.msg.ai .bubble{background:#eef7ff}
.msg.user{align-self:flex-end}
.progress{height:4px;background:#eee;border-radius:2px;margin-top:6px}
.progress .bar{height:100%;background:#42b983;border-radius:2px}
.chat-input{display:flex;padding:12px;border-top:1px solid #eee}
.chat-input input{flex:1;padding:8px 10px}
.chat-input button{margin-left:8px;padding:8px 14px}
</style>
