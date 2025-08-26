import axios from 'axios';
import { ref } from 'vue'
const apiClient =axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL||"http://localhost:8080/api",
    timeout:10000,
    headers:{
        'Content-Type':'application/json',
    }
})

const chatApi={
    getChatList(userId){
        // return apiClient.get("")
        return ref([
            "会话2",
            "会话3",
            userId
        ])
    },
    getChatHistory(userId){
        // return apiClient.get("")
        return ref([
            userId,
            apiClient.baseURL
        ])
    },
    createChat(userId){
        // return apiClient.post('')
        return ref([
            userId
        ])
    },
    sendText(text,userId){
        // return apiClient.post("")
        return ref([
            userId
        ])
    },

}
export default chatApi;