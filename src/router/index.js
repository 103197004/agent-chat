import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import AIChatWindow from '../components/AIChatWindow.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../components/ChatLayout.vue'),
    children: [
      {
        path: '',
        component: AIChatWindow
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 