<template>
  <div class="sidebar">
    <button class="new-chat-btn">
      <span>+新对话</span>
    </button>
    <h3 class="history-title">会话历史</h3>
    <ul class="history-list">
      <li class="history-item active">
        <span>会话1</span>
      </li>
      <li class="history-item" v-for="chat in ChatList" :key="chat.id">
        <span>{{ chat.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import chatApi from '@/router/chat'
export default {
  name: 'SideBar',
  data(){
    return{
      loading:false,
      responseData:[
        {id:1,title:1},
        {id:2,title:2}
      ],
      error:null
    };
  },
  computed:{
    ChatList(){
      console.log(this.fetchChatList(this.get_userId))
      return this.fetchChatList(this.get_userId);
    }
  },
  methods:{
    get_userId(){
      let collected = {}
      try { collected = JSON.parse(sessionStorage.getItem('collectedUserData') || '{}') } catch(e){ console.warn('parse collectedUserData failed', e) }
      console.log('Collected user data at chat start:', collected)
      return collected.userId
    },
    fetchChatList(userId){
      this.handleApiCall(()=>chatApi.getChatList(userId))
      return [
        {id:1,title:1},
        {id:2,title:1}
      ]
      // return this.responseData
    },
    async handleApiCall(apiFunction) {
      this.loading = true;
      this.error = null;
      this.responseData = null;

      try {
        const response = await apiFunction();
        this.responseData = response.data;
      } catch (error) {
        this.error = error.message || '请求失败';
        console.error('API调用错误:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}

</script>

<style scoped>
/* .sidebar{
  padding:16px;
}
.sidebar h3{margin:0 0 8px}
.sidebar ul{padding:0;list-style:none}
.sidebar li{padding:6px 0;border-bottom:1px solid #f0f0f0} */
.sidebar {
    width: 280px;
    border-right: 1px solid #2a3b49;
    padding: 20px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.new-chat-btn {
    background: linear-gradient(90deg);
    color: rgb(183, 76, 9);
    border: none;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    transition: all 0.3s;
}

.new-chat-btn:hover {
    background: linear-gradient(90deg);
    transform: translateY(-2px);
}

.new-chat-btn i {
    margin-right: 8px;
}

.history-title {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #9ca3af;
    margin: 20px 0 10px;
}

.history-list {
    list-style: none;
}

.history-item {
    padding: 12px 15px;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.2s;
}

.history-item:hover {
    background: rgba(55, 65, 81, 0.5);
}

.history-item.active {
    background: rgba(55, 65, 81, 0.8);
}

.history-item i {
    margin-right: 10px;
    color: #9ca3af;
}
@media (max-width: 900px) {
.sidebar {
    width: 70px;
    padding: 15px 10px;
}

.logo-text, .new-chat-btn span, .history-title, .history-item span {
    display: none;
}


.new-chat-btn {
    padding: 12px;
    justify-content: center;
}

.new-chat-btn i {
    margin-right: 0;
}

.history-item {
    justify-content: center;
    padding: 12px;
}

.history-item i {
    margin-right: 0;
}
}

@media (max-width: 600px) {
.sidebar {
    display: none;
}

.message {
    max-width: 90%;
}
}
</style>