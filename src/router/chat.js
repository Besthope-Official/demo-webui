import axios from 'axios';
import { get } from 'core-js/core/dict';
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
        return apiClient.get("/chatList", { params: { "userId":userId } })
        // return ref([
        //     "会话2",
        //     "会话3",
        //     userId
        // ])
    },
    getChatHistory(userId, chatId){
        return apiClient.get("/chatHistory", { params: { "userId":userId,"chatId":chatId } })
        // return ref([
        //     userId,
        //     apiClient.baseURL
        // ])
    },
    createChat(userId){
        return apiClient.post("/createChat", { userId })
        // return ref([
        //     userId
        // ])
    },
    sendText(text,userId,chatId){
        return apiClient.post("/sendText", { params: { "text":text, "userId":userId, "chatId":chatId } })
        // return ref([
        //     userId
        // ])
    },
    getChatSummary(userId, chatId,text){
        return apiClient.get("/chatSummary", { params: { "userId":userId,"chatId":chatId,"text":text } })
    }
}
export default chatApi;