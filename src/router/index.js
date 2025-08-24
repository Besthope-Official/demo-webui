import { createRouter, createWebHistory } from 'vue-router'
import UserInfo from '@/pages/UserInfo.vue'
import IdentityInterest from '@/pages/UserInterest.vue'
import ChatPage from '@/pages/ChatPage.vue'

const routes = [
    { path: '/', redirect: '/user-info' },
    { path: '/user-info', name: 'UserInfo', component: UserInfo },
    { path: '/identity', name: 'UserInterest', component: IdentityInterest },
    { path: '/chat', name: 'ChatPage', component: ChatPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
