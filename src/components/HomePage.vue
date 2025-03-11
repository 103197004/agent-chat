<template>
  <div class="home-page">
    <h1>欢迎使用AI助手</h1>
    <div class="features">
      <router-link to="/chat" class="feature-card">
        <div class="icon">💬</div>
        <h2>AI问答</h2>
        <p>开始与AI助手对话</p>
      </router-link>
      <!-- 可以在这里添加更多功能卡片 -->
    </div>
  </div>
</template>

<style scoped>
.home-page {
  text-align: center;
  padding: 40px 20px;
}

.features {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin: 10px;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 48px;
  margin-bottom: 16px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h2 {
  color: #2c3e50;
  margin: 10px 0;
}

p {
  color: #666;
  margin: 0;
}
</style> 