<template>
  <aside class="sidebar">
    <div class="info-container">
    <!-- 圆形头像 -->
    <div class="avatar-container">
      <img 
        src="../assets/avatar.jpg" 
        alt="个人照片"
        class="avatar"
      >
    </div>
    
    <!-- 社交图标 -->
    <div class="social-icons">
      <a v-for="(item, index) in socialLinks" 
         :key="index"
         :href="item.url" 
         target="_blank"
         :title="item.name"
         class="icon-link">
        <i :class="item.icon"></i>
      </a>
    </div>
    
    <!-- 联系方式 -->
    <div class="contact-info">
      <p v-for="(info, index) in contactInfo"
         :key="index"
         class="contact-item">
        <i :class="info.icon"></i> {{ info.text }}
      </p>
    </div>

    <!-- 主题切换按钮 -->
    <div class="theme-toggle">
      <button
        class="theme-btn"
        :class="{ active: !themeStore.isDark }"
        @click="themeStore.setTheme('light')"
        title="白天模式"
      >
        <i class="fas fa-sun"></i>
      </button>
      <button
        class="theme-btn"
        :class="{ active: themeStore.isDark }"
        @click="themeStore.setTheme('dark')"
        title="暗夜模式"
      >
        <i class="fas fa-moon"></i>
      </button>
    </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

// 获取主题 store
const themeStore = useThemeStore()

// 社交链接数据
const socialLinks = ref([
  { name: 'GitHub', url: 'https://github.com/GorwayWong', icon: 'fab fa-github' },
  { name: 'CSDN', url: 'https://blog.csdn.net/weixin_48609829?spm=1011.2124.3001.5343', icon: 'fa-solid fa-blog' },
//   { name: '领英', url: 'https://linkedin.com/in/yourusername', icon: 'fab fa-linkedin' },
  { name: '邮箱', url: 'mailto:huangguoweiwork@163.com', icon: 'fas fa-envelope' }
])

// 联系信息数据
const contactInfo = ref([
  { icon: 'fas fa-envelope', text: 'huangguoweiwork@163.com' },
  { icon: 'fa-solid fa-building-columns', text: '广西大学' },
  { icon: 'fas fa-map-marker-alt', text: '广西南宁' }
])
</script>

<style scoped>
/* 保持样式不变 */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  padding: 2rem 1rem;
  background-color: var(--sidebar-bg, #2c3e50);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  transition: background-color 0.3s ease;
}

.avatar-container {
  margin-bottom: 1.5rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #42b983;
}

.social-icons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 2rem;
}

.icon-link {
  color: white;
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.icon-link:hover {
  color: #42b983;
  transform: translateY(-3px);
}

.icon-link::after {
  content: attr(title); /* 显示title属性内容 */
  position: absolute;
  bottom: -30px; /* 在图标下方显示 */
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.3s ease;
}

.icon-link:hover::after {
  opacity: 1; /* 悬停时显示 */
}

.contact-info {
  text-align: center;
  width: 100%;
}

.contact-item {
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.contact-item i {
  color: #42b983;
}

.info-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* 主题切换按钮样式 */
.theme-toggle {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.theme-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-btn:hover {
  border-color: #42b983;
  color: #42b983;
  transform: scale(1.1);
}

.theme-btn.active {
  background: #42b983;
  border-color: #42b983;
  color: white;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

</style>