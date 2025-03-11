<template>
  <div class="chat-layout">
    <div class="chat-history">
      <h3>聊天记录</h3>
      <div 
        v-for="(history, index) in chatHistories" 
        :key="index"
        class="history-item"
        :class="{ active: currentHistoryIndex === index }"
        @click="loadHistory(index)"
      >
        <div class="history-title">对话 {{ index + 1 }}</div>
        <div class="history-time">{{ formatDate(history.lastTime) }}</div>
        <div class="history-preview">{{ getPreview(history.messages) }}</div>
      </div>
    </div>
    <div class="chat-container">
      <router-view 
        @save-history="saveHistory"
        @update-status="updateStatus"
      ></router-view>
    </div>
    <div class="task-status">
      <h3>任务状态</h3>
      <div class="status-item" :class="{ active: currentStatus === 'created' }">
        <div class="status-icon">1</div>
        <div class="status-text">创建任务</div>
      </div>
      <div class="status-connector"></div>
      <div class="status-item" :class="{ active: currentStatus === 'processing' }">
        <div class="status-icon">2</div>
        <div class="status-text">任务进行中</div>
      </div>
      <div class="status-connector"></div>
      <div class="status-item" :class="{ active: currentStatus === 'completed' }">
        <div class="status-icon">3</div>
        <div class="status-text">任务完成</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const chatHistories = ref(JSON.parse(localStorage.getItem('chatHistories') || '[]'))
const currentHistoryIndex = ref(-1)
const currentStatus = ref('created')

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`
}

// 获取预览文本
const getPreview = (messages) => {
  const lastMessage = messages[messages.length - 1]
  return lastMessage ? lastMessage.content.slice(0, 30) + '...' : ''
}

// 保存历史记录
const saveHistory = (messages) => {
  // 不保存只有欢迎消息或只有AI消息的对话
  if (messages.length <= 1) return
  if (!messages.some(msg => msg.role === 'user')) return
  
  chatHistories.value.unshift({
    messages: [...messages],
    lastTime: new Date().getTime()
  })
  localStorage.setItem('chatHistories', JSON.stringify(chatHistories.value))
  currentHistoryIndex.value = -1
}

// 加载历史记录
const loadHistory = (index) => {
  currentHistoryIndex.value = index
  router.replace({
    path: '/chat',
    query: { historyId: index }
  })
}

// 提供状态更新方法
const updateStatus = (status) => {
  currentStatus.value = status
}

// 暴露方法给父组件
defineExpose({
  saveHistory,
  updateStatus
})
</script>

<style scoped>
.chat-layout {
  display: flex;
  gap: 20px;
  height: calc(100vh - 100px);
}

.chat-history {
  width: 250px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #ddd;
  overflow-y: auto;
}

.task-status {
  width: 250px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #ddd;
}

.chat-container {
  flex: 1;
}

.history-item {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  border: 1px solid #eee;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: #f5f5f5;
}

.history-item.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.history-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.history-time {
  font-size: 0.8em;
  color: #666;
  margin-bottom: 4px;
}

.history-preview {
  font-size: 0.9em;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.5;
  transition: all 0.3s ease;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 10px;
}

.status-item.active {
  opacity: 1;
  background: #e3f2fd;
  border-color: #2196f3;
}

.status-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.status-item.active .status-icon {
  background: #007bff;
  color: white;
}

.status-connector {
  width: 2px;
  height: 20px;
  background: #ddd;
  margin-left: 14px;
}

.status-text {
  font-size: 0.9em;
  color: #666;
}

.status-item.active .status-text {
  color: #333;
  font-weight: bold;
}
</style> 