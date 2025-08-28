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
          <div class="rag-toggle">
            <label class="switch">
              <input type="checkbox" v-model="ragEnabled" />
              <span class="slider"></span>
            </label>
            <span class="rag-label">RAG</span>
          </div>
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
          <div class="bubble" v-html="m.html || m.text"></div>
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
import { ref, reactive } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { streamChat, streamHandler } from '@/api/chat.js'

export default {
  name: 'ChatPage',
  setup(){
    const input = ref('')
    const inChat = ref(false)
    const messages = ref([])
  const ragEnabled = ref(false)
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

    async function send(){
      const text = (input.value || '').trim()
      if (!text) return
      // push user message
      messages.value.push({ role: 'user', text })
      input.value = ''
      // transition to chat state if not already
      if (!inChat.value) inChat.value = true


  const aiMessage = reactive({ role: 'assistant', text: '', html: '' })
      messages.value.push(aiMessage)

      try {
  const response = await streamChat(messages.value, ragEnabled.value)
        let fullContent = ''

        for await (const chunk of streamHandler(response)) {
          const lines = chunk.split('\n').filter(line => line.trim())
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line)
                if (parsed.event === 'Answer' && parsed.data.content) {
                console.log('Answer content:', parsed.data.content)
                fullContent += parsed.data.content
                aiMessage.text = fullContent
                // render markdown to sanitized HTML
                try {
                  const md = new MarkdownIt({ html: true, linkify: true })
                  const raw = md.render(fullContent)
                  aiMessage.html = DOMPurify.sanitize(raw)
                } catch (e) {
                  aiMessage.html = ''
                }
              }
            } catch (e) {
              console.warn('Failed to parse line:', line, e)
            }
          }
        }
      } catch (error) {
        console.error('Stream error:', error)
        aiMessage.text = '抱歉，发生了错误。请重试。'
      }
    }

  return { input, inChat, messages, recs, applyRec, send, collected, ragEnabled }
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
.home-input{position:relative}
.rag-toggle{position:absolute;left:calc(50% - 30%);bottom:-28px;display:flex;align-items:center;gap:6px}
.switch{position:relative;display:inline-block;width:36px;height:20px}
.switch input{opacity:0;width:0;height:0}
.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#ccc;transition:.2s;border-radius:20px}
.slider:before{position:absolute;content:"";height:16px;width:16px;left:2px;top:2px;background:#fff;transition:.2s;border-radius:50%}
.switch input:checked + .slider{background:#42b983}
.switch input:checked + .slider:before{transform:translateX(16px)}
.rag-label{font-size:12px;color:#666}
.recommendations{margin-top:12px}
.recommendations .chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.recommendations button{padding:6px 10px;border:1px solid #ddd;background:#fff}
.messages{display:flex;flex-direction:column;gap:12px}
.msg{max-width:70%}
.msg .bubble{padding:10px 12px;border-radius:8px;background:#f5f5f5}
.msg.assistant .bubble{background:#eef7ff}
.msg.user{align-self:flex-end}
.progress{height:4px;background:#eee;border-radius:2px;margin-top:6px}
.progress .bar{height:100%;background:#42b983;border-radius:2px}
.chat-input{display:flex;padding:12px;border-top:1px solid #eee}
.chat-input input{flex:1;padding:8px 10px}
.chat-input button{margin-left:8px;padding:8px 14px}
</style>
