<template>
  <section class="chat-page">
    <!-- chat header: shown as title, only in chat state -->
  <header v-if="inChat" class="chat-header"><h2 class="chat-title">会话</h2></header>
    <img 
        src="./image.png"
        alt="图片设置"
        :style="{width:'200px',height:'auto',textAlign:'center'}">
        <div class="chat-body">
          <!-- Home state: show before user asks first question -->
          <div v-if="!inChat" class="home">
            <h2>我可以给到您专业的心理答疑</h2>
            <p class="welcome">欢迎，您可以直接输入问题或选择下面的推荐问题开始。</p>
            <div class="main-content">
                <div class="input-container">
                    <div class="input-box">
                        <textarea class="message-input" placeholder="输入消息..." rows="1" @keyup.enter="send"></textarea>
                        <button class="send-button" @click="send">
                          发送
                        </button>
                    </div>
                </div>
            </div>


        <div class="recommendations">
          <h4>推荐问题</h4>
          <div class="chips">
            <button v-for="r in get_recs()" :key="r" @click=applyRec(r)>{{ r }}</button>
          </div>
        </div>
      </div>

      <!-- Chat state: conversation -->
      <div v-else class="messages">
        <div v-for="(idx,m) in applyRec()" :key="idx">
          <div class="bubble">{{ m.text }}</div>
          <div v-if="m.role==='ai' && m.progress !== undefined" class="progress"><div class="bar" :style="{width: m.progress + '%'}"></div></div>
        </div>
      </div>
    </div>

    <!-- input area always shown in footer for convenience when in chat -->
    
  </section>
</template>

<script>
import chatApi from '@/router/chat'
import { ref } from "vue"
// import { apply } from 'core-js/fn/reflect'
const messages = ref([])
export default {
  name: 'ChatPage',
  data(){
    return {
      userId:"",
      history:"",
      input:"",
      inChat:ref(false),
      messgae:ref([]),
      recs:[]
    }
  },
  methods:{
    get_userId(){
      let collected = {}
      try { collected = JSON.parse(sessionStorage.getItem('collectedUserData') || '{}') } catch(e){ console.warn('parse collectedUserData failed', e) }
      console.log('Collected user data at chat start:', collected)
      this.userId=collected.userId
    },
    get_recs() {
      return [
        '如何缓解焦虑？',
        '最近总是睡不好，怎么办？',
        '推荐几本心理学入门书籍'
      ]
    },
    get_input(){
      if(!this.input) this.input=document.querySelector('.message-input').value
    },
    get_history(){
      this.history=chatApi.getChatHistory(this.userId)
    },
    applyRec(text){
      //这里有点问题
      this.input=text
      const res=ref([])
      res.value=this.send()
      console.log('send1', res._value)
      const res_1=Array.from(res.value)
      console.log('send2', res_1)
      return res_1
    }
    ,
    send(){
      
      const inChat = ref(false)
      const text = (this.input || '').trim()
      if (!text) return
      // push user message
      messages.value.push({ role: 'user', text })
      this.input = ''
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
          // ai.text = chatApi.sendText(text,userId)
        }
      }, 800)

      console.log('send', messages)
      return messages;
    }
    }
  }

  // setup(){
  //   const userId=ref('')
  //   const ChatHistory=ref([])
  //   const input = ref('')
  //   const inChat = ref(false)
  //   const messages = ref([])
  //   const recs = ref([
  //     '如何缓解焦虑？',
  //     '最近总是睡不好，怎么办？',
  //     '推荐几本心理学入门书籍'
  //   ])

  //   let collected = {}
  //   try { collected = JSON.parse(sessionStorage.getItem('collectedUserData') || '{}') } catch(e){ console.warn('parse collectedUserData failed', e) }
  //   console.log('Collected user data at chat start:', collected)
  //   userId.value=collected.userId

  //   function applyChatHistory(userId){
  //     history=fetchChatHistory(userId)
  //     ChatHistory=history.responseData
  //   }
  //   function applyRec(text){
  //     input.value = text
  //     send()
  //   }

  //   function send(){
  //     if (!input.value) input.value=document.querySelector('.message-input').value
  //     const text = (input.value || '').trim()
  //     if (!text) return
  //     // push user message
  //     messages.value.push({ role: 'user', text })
  //     input.value = ''
  //     // transition to chat state if not already
  //     if (!inChat.value) inChat.value = true

  //     // push a placeholder AI response with simulated progress
  //     messages.value.push({ role: 'ai', text: '正在思考...', progress: 30 })
      
  //     // simulate progress finishing after short timeout
  //     setTimeout(()=>{
  //       const ai = messages.value.find(m => m.role==='ai' && m.text==='正在思考...')
  //       if (ai) {
  //         ai.progress = 100
  //         ai.text = '这是一个示例回复，实际回复将来自后端或模型。'
  //         // ai.text = sendText(text,userId)
  //       }
  //     }, 800)

  //     console.log('send', text)
  //   }

  //   return { input, inChat, messages, recs, applyRec, send, collected}
  // },
//   methods:{
//     async sendText(text,userId){
//       this.handleApiCall(()=>chatApi.sendText(text,userId));
      
//     },
//     async fetchChatHistory(userId){
//       this.handleApiCall(()=>chatApi.getChatHistory(userId));
//       ChatHistory=this.responseData
//     },
    
//   }
// };
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
.input-container {
    padding: 20px;
    border-top: 1px solid #2a3b49;
}

.input-box {
    display: flex;
    background: rgba(214, 214, 214, 0.5);
    border: 1px solid #4b5563;
    border-radius: 12px;
    padding: 5px 15px;
    height: 200px;
}

.message-input {
    flex: 1;
    background: transparent;
    border: none;
    color: rgb(0, 0, 0);
    padding: 15px 0;
    font-size: 16px;
    outline: none;
    resize: none;
    max-height: 200px;
    overflow-y: auto;
}

.message-input::placeholder {
    color: #9ca3af;
}

.send-button {
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: end;
    justify-content: end;
    cursor: pointer;
    transition: all 0.2s;
}

.send-button:hover {
    background: #959aa4;
    transform: rotate(30deg);
}

.input-hints {
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
}

.hint-button {
    background: rgba(55, 65, 81, 0.5);
    color: #4c73b7;
    border: 1px solid #4b5563;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    margin-right: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.hint-button:hover {
    background: rgba(176, 180, 186, 0.8);
    color: #e0e0e0;
}
</style>
