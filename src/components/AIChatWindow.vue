<template>
  <div class="chat-window">
    <div class="chat-header">
      <router-link to="/" class="back-button">
        <span class="back-icon">←</span>
        <span>返回</span>
      </router-link>
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
        
        <!-- 思考状态显示 -->
        <div v-if="isThinking" class="message assistant thinking">
          <div class="avatar">
            <img :src="assistantAvatar" alt="assistant">
          </div>
          <div class="message-wrapper">
            <div class="message-header">
              <span class="sender-name">AI助手</span>
              <span class="message-time">{{ formatTime() }}</span>
            </div>
            <div class="message-content thinking-content">
              <div class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="thinking-text">正在思考中...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <textarea
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
        rows="1"
        @input="autoResize"
        :disabled="isThinking"
      />
      <button @click="sendMessage" class="send-button" :disabled="isThinking">
        <span class="send-icon">↑</span>
      </button>
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
const isThinking = ref(false)

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

// 模拟DeepSeek思考过程
const simulateThinking = (userMessage) => {
  isThinking.value = true
  emit('update-status', 'processing')
  
  // 模拟思考时间
  setTimeout(() => {
    // 根据用户问题生成不同的回答
    let response = ''
    
    if (userMessage.toLowerCase().includes('你好') || userMessage.toLowerCase().includes('hi') || userMessage.toLowerCase().includes('hello')) {
      response = '你好！很高兴见到你。我是DeepSeek AI助手，有什么我可以帮助你的吗？'
    } else if (userMessage.toLowerCase().includes('名字')) {
      response = '我是DeepSeek AI助手，一个基于先进语言模型开发的智能对话系统。'
    } else if (userMessage.toLowerCase().includes('天气')) {
      response = '抱歉，我无法获取实时天气信息。不过我可以帮你查找天气预报网站或提供天气相关的知识。'
    } else if (userMessage.toLowerCase().includes('时间') || userMessage.toLowerCase().includes('日期')) {
      response = `现在的时间是 ${formatTime()}。`
    } else if (userMessage.toLowerCase().includes('谢谢') || userMessage.toLowerCase().includes('感谢')) {
      response = '不客气！如果还有其他问题，随时可以问我。'
    } else if (userMessage.toLowerCase().includes('再见') || userMessage.toLowerCase().includes('拜拜')) {
      response = '再见！祝你有愉快的一天！'
    } else {
      response = `我理解你的问题是关于"${userMessage}"。根据我的分析，这是一个有趣的话题。让我为你提供一些相关信息：\n\n1. 这是一个需要深入思考的问题\n2. 从多个角度来看，这个问题有多个方面\n3. 根据我的知识库，我可以提供一些见解\n\n希望这些信息对你有所帮助！如果你需要更详细的解释，请随时告诉我。`
    }
    
    // 添加AI回复
    messages.value.push({
      role: 'assistant',
      content: response,
      time: formatTime()
    })
    
    isThinking.value = false
    emit('update-status', 'completed')
  }, 2000 + Math.random() * 2000) // 随机思考时间，增加真实感
}

// 发送消息
const sendMessage = () => {
  if (!userInput.value.trim() || isThinking.value) return
  
  hasUserInteracted.value = true
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userInput.value,
    time: formatTime()
  })
  
  // 清空输入框
  userInput.value = ''
  
  // 模拟AI思考并回复
  simulateThinking(userInput.value)
}

// 自动滚动到底部
onUpdated(() => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})

// 自动调整输入框高度
const autoResize = (e) => {
  const textarea = e.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}
</script>

<style scoped>
.chat-window {
  width: 100%;
  max-width: 100%;
  height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin: 0;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px 12px 0 0;
}

.back-button {
  color: #666;
  text-decoration: none;
  margin-right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #007bff;
}

.back-icon {
  font-size: 1.2em;
}

h2 {
  margin: 0;
  color: #333;
  font-size: 1.2em;
}

.chat-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f8f9fa;
}

.message {
  margin-bottom: 24px;
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
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  font-size: 0.85em;
  color: #666;
}

.user .message-header {
  text-align: right;
}

.sender-name {
  font-weight: 600;
  margin-right: 8px;
}

.message-time {
  color: #999;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  display: inline-block;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.user .message-content {
  background: #007bff;
  color: white;
}

.assistant .message-content {
  background: white;
  color: #333;
}

.thinking-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.thinking-dots {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.thinking-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #007bff;
  animation: thinking 1.4s infinite ease-in-out;
}

.thinking-dots span:nth-child(1) {
  animation-delay: 0s;
}

.thinking-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.thinking-text {
  font-size: 0.9em;
  color: #666;
}

@keyframes thinking {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
  40% { transform: scale(1); opacity: 1; }
}

.chat-input {
  display: flex;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background: white;
  border-radius: 0 0 12px 12px;
  gap: 12px;
}

textarea {
  flex: 1;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 1em;
  line-height: 1.5;
  max-height: 150px;
  transition: border-color 0.3s ease;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
}

textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-button {
  width: 40px;
  height: 40px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.send-button:hover:not(:disabled) {
  background: #0056b3;
}

.send-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.send-icon {
  font-size: 1.2em;
  transform: translateY(-1px);
}
</style> 