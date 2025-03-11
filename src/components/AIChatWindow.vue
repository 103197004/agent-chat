<template>
  <div class="chat-window">
    <div class="chat-header">
      <router-link to="/" class="back-button">← 返回</router-link>
      <h2>AI 聊天助手</h2>
    </div>
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" 
             :key="index" 
             :class="['message', message.role]">
          <div class="avatar">
            <img :src="message.role === 'assistant' ? assistantAvatar : userAvatar" :alt="message.role">
          </div>
          <div class="message-wrapper">
            <div class="message-header">
              <span class="sender-name">{{ message.role === 'assistant' ? 'AI助手' : '我' }}</span>
              <span class="message-time">{{ message.time }}</span>
            </div>
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <input 
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
        type="text"
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUpdated, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// 头像URL，您可以替换成自己的图片
const userAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
const assistantAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=ai'

const formatTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const messages = ref([
  { 
    role: 'assistant', 
    content: '你好！我是AI助手，有什么可以帮你的吗？',
    time: formatTime()
  }
])
const userInput = ref('')
const messagesContainer = ref(null)
const route = useRoute()
const hasUserInteracted = ref(false)
const emit = defineEmits(['save-history', 'update-status'])

// 加载历史记录
onMounted(() => {
  const historyId = route.query.historyId
  if (historyId !== undefined) {
    const chatHistories = JSON.parse(localStorage.getItem('chatHistories') || '[]')
    const history = chatHistories[historyId]
    if (history) {
      messages.value = history.messages
    }
  }
  emit('update-status', 'created')
})

// 监听路由变化
watch(() => route.query.historyId, (newHistoryId) => {
  if (newHistoryId !== undefined) {
    const chatHistories = JSON.parse(localStorage.getItem('chatHistories') || '[]')
    const history = chatHistories[newHistoryId]
    if (history) {
      messages.value = history.messages
    }
  } else {
    // 重置为初始状态
    messages.value = [{
      role: 'assistant',
      content: '你好！我是AI助手，有什么可以帮你的吗？',
      time: formatTime()
    }]
  }
  hasUserInteracted.value = false
  emit('update-status', 'created')
})

// 保存历史记录
onBeforeUnmount(() => {
  // 只有当用户有实际输入时才保存
  if (!hasUserInteracted.value) return
  
  emit('save-history', messages.value)
})

// 发送消息
const sendMessage = () => {
  if (!userInput.value.trim()) return
  
  hasUserInteracted.value = true
  emit('update-status', 'processing')
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userInput.value,
    time: formatTime()
  })
  
  // 模拟AI响应
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `我收到了你的消息: "${userInput.value}"`,
      time: formatTime()
    })
    emit('update-status', 'completed')
  }, 1000)
  
  userInput.value = ''
}

// 自动滚动到底部
onUpdated(() => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})
</script>

<style scoped>
.chat-window {
  width: 100%;
  max-width: 600px;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  background: white;
}

.back-button {
  color: #007bff;
  text-decoration: none;
  margin-right: 15px;
}

.back-button:hover {
  color: #0056b3;
}

h2 {
  margin: 0;
  color: #333;
}

.chat-container {
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
}

.message {
  margin-bottom: 20px;
  max-width: 85%;
  display: flex;
  gap: 12px;
}

.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.message-header {
  margin-bottom: 4px;
  font-size: 0.8em;
  color: #666;
}

.user .message-header {
  text-align: right;
}

.sender-name {
  font-weight: bold;
  margin-right: 8px;
}

.message-time {
  color: #999;
}

.message-content {
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
}

.user .message-content {
  background: #007bff;
  color: white;
}

.assistant .message-content {
  background: white;
  color: #333;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: white;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
}

button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style> 