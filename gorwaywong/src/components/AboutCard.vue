<!--
  关于我卡片组件 - AboutCard.vue

  【设计说明】
  这是一个苹果风格的立体卡片组件，用于展示个人介绍
  - 使用 box-shadow 实现立体阴影效果
  - 支持 Markdown 内容渲染
  - 固定在右侧空白区域
-->

<template>
  <div class="about-card" v-if="content">
    <div class="card-content" v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMarkdownParser } from '@/composables/useMarkdownParser'

const { renderMarkdown } = useMarkdownParser()

// 存储 Markdown 原始内容
const content = ref('')

// 计算属性：渲染后的 HTML
const renderedContent = computed(() => {
  return renderMarkdown(content.value)
})

// 加载 about.md 文件
onMounted(async () => {
  try {
    const aboutModule = await import('@/assets/about.md?raw')
    content.value = aboutModule.default
  } catch (error) {
    console.error('加载 about.md 失败:', error)
  }
})
</script>

<style scoped>
/**
 * 苹果风格立体卡片样式
 *
 * 【学习要点 - box-shadow 实现立体效果】
 * 苹果 UI 的阴影特点：
 * 1. 多层阴影叠加，营造深度感
 * 2. 阴影颜色较浅，不会太突兀
 * 3. 阴影偏移较小，模糊半径较大
 */
.about-card {
  /* 定位：固定在右上角 */
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 320px;

  /* 背景和圆角 */
  background: var(--card-bg, #ffffff);
  border-radius: 16px;

  /* 苹果风格多层阴影 */
  box-shadow:
    0 4px 6px var(--card-shadow, rgba(0, 0, 0, 0.07)),
    0 10px 20px var(--card-shadow, rgba(0, 0, 0, 0.06)),
    0 0 40px var(--card-shadow, rgba(0, 0, 0, 0.03));

  /* 内边距 */
  padding: 1.5rem;

  /* 过渡动画 */
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;

  /* 确保在其他内容之上 */
  z-index: 100;
}

/* 悬停效果：轻微上浮 */
.about-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 8px 12px rgba(0, 0, 0, 0.1),
    0 16px 32px rgba(0, 0, 0, 0.08),
    0 0 48px rgba(0, 0, 0, 0.05);
}

/* 卡片内容样式 */
.card-content {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-primary, #333);
  transition: color 0.3s ease;
}

/* Markdown 渲染内容样式 */
.card-content :deep(h1),
.card-content :deep(h2),
.card-content :deep(h3) {
  margin-top: 0;
  margin-bottom: 0.8rem;
  color: var(--text-primary, #1a1a1a);
}

.card-content :deep(p) {
  margin: 0.6rem 0;
}

.card-content :deep(ul) {
  padding-left: 1.2rem;
  margin: 0.6rem 0;
}

.card-content :deep(li) {
  margin: 0.4rem 0;
}

.card-content :deep(strong) {
  color: #2c3e50;
  font-weight: 600;
}

/* 引用块样式 */
.card-content :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.8rem 1rem;
  background: var(--bg-secondary, linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%));
  border-left: 4px solid #42b983;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--text-secondary, #555);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.card-content :deep(blockquote p) {
  margin: 0;
}

/* 链接样式 */
.card-content :deep(a) {
  color: #42b983;
  text-decoration: none;
}

.card-content :deep(a:hover) {
  text-decoration: underline;
}

/* 代码样式 */
.card-content :deep(code) {
  background: #f1f3f4;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
