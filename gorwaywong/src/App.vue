<!--
  根组件 - App.vue

  【学习要点 - 根组件的作用】
  App.vue 是整个 Vue 应用的根组件，它：
  1. 定义应用的整体布局结构
  2. 包含所有其他组件
  3. 通常负责初始化全局数据

  【本应用的布局】
  采用左右两栏布局：
  - 左侧：固定宽度的个人信息侧边栏（ResumeSidebar）
  - 右侧：可滚动的简历内容区域（ResumeContent）
-->

<template>
  <!--
    【学习要点 - <head> 标签的问题】
    注意：在 Vue 组件中直接写 <head> 标签是不规范的做法
    正确的做法是在 index.html 中设置，或使用 @vueuse/head 等库
    这里保留是为了兼容原有代码，建议后续优化
  -->
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <!--
    应用根容器
    id="app" 用于 CSS 选择器和 Vue 挂载点识别
  -->
  <div id="app">
    <!--
      左侧边栏组件
      【学习要点】组件使用方式：
      1. 在 <script> 中导入组件
      2. 在 <template> 中像 HTML 标签一样使用
      组件名可以用 PascalCase（ResumeSidebar）或 kebab-case（resume-sidebar）
    -->
    <ResumeSidebar />

    <!--
      右侧内容区域组件
      这个组件会从 Pinia Store 获取数据并渲染简历内容
    -->
    <ResumeContent />

    <!--
      【新增】关于我卡片组件
      固定在右上角，显示个人介绍
    -->
    <AboutCard />
  </div>
</template>

<script>
/**
 * 【学习要点 - Options API vs Composition API】
 *
 * Vue 3 支持两种编写组件的方式：
 *
 * 1. Options API（传统方式）：
 *    export default {
 *      name: 'App',
 *      data() { return {} },
 *      methods: {},
 *      computed: {}
 *    }
 *
 * 2. Composition API（推荐方式）：
 *    使用 <script setup> 或 setup() 函数
 *
 * 本文件同时使用了两种方式：
 * - 普通 <script> 用于定义组件名称（Options API）
 * - <script setup> 用于逻辑代码（Composition API）
 *
 * 这种混合使用是允许的，但通常只用 <script setup> 就够了
 */
export default {
  name: 'App' // 组件名称，用于调试和 Vue DevTools
}
</script>

<script setup>
/**
 * 【学习要点 - <script setup>】
 * <script setup> 是 Composition API 的语法糖
 * 在这里定义的变量和函数会自动暴露给模板使用
 */

// 从 Vue 导入生命周期钩子
// 【学习要点】onMounted 在组件挂载到 DOM 后执行
import { onMounted } from 'vue'

// 导入 Pinia Store
import { useResumeStore } from '@/stores/resumeStore'
import { useThemeStore } from '@/stores/themeStore'

// 导入子组件
import ResumeSidebar from './components/ResumeSidebar.vue'
import ResumeContent from './components/ResumeContent.vue'
import AboutCard from './components/AboutCard.vue'

// 获取 store 实例
const store = useResumeStore()
const themeStore = useThemeStore()

/**
 * 【学习要点 - Vue 生命周期钩子】
 *
 * Vue 组件有多个生命周期阶段，每个阶段都有对应的钩子函数：
 *
 * 1. onBeforeMount - 挂载前
 * 2. onMounted - 挂载后（DOM 已创建）← 我们在这里加载数据
 * 3. onBeforeUpdate - 更新前
 * 4. onUpdated - 更新后
 * 5. onBeforeUnmount - 卸载前
 * 6. onUnmounted - 卸载后
 *
 * 【为什么在 onMounted 中加载数据？】
 * 1. 此时 DOM 已经创建，可以安全地操作 DOM
 * 2. 组件已经完全初始化，可以访问所有响应式数据
 * 3. 适合执行副作用操作（如 API 调用、数据加载）
 */
onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
  // 调用 store 的方法加载简历数据
  // 这会触发 Markdown 文件的加载和解析
  store.loadResume()
})
</script>

<style>
/**
 * 【学习要点 - 全局样式 vs scoped 样式】
 *
 * 没有 scoped 属性的 <style> 是全局样式
 * 会影响整个应用的所有组件
 *
 * 通常在根组件中定义：
 * 1. CSS Reset（重置浏览器默认样式）
 * 2. 全局布局样式
 * 3. 全局字体设置
 */

/* ========================================
   CSS 变量 - 主题颜色定义
   【学习要点】使用 CSS 变量实现主题切换
   ======================================== */

:root {
  /* 白天模式颜色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #000000;
  --text-secondary: #555555;
  --border-color: #e0e0e0;
  --sidebar-bg: #2c3e50;
  --card-bg: #ffffff;
  --card-shadow: rgba(0, 0, 0, 0.1);
}

/* 暗夜模式颜色 */
[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #3a3a5a;
  --sidebar-bg: #0f0f1a;
  --card-bg: #252540;
  --card-shadow: rgba(0, 0, 0, 0.3);
}

/* CSS Reset - 重置浏览器默认样式 */
* {
  margin: 0;              /* 移除默认外边距 */
  padding: 0;             /* 移除默认内边距 */
  box-sizing: border-box; /* 让 width/height 包含 padding 和 border */
}

/* 页面背景过渡 */
html {
  transition: background-color 0.3s ease;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 应用根容器样式 */
#app {
  display: flex;          /* 使用 Flexbox 布局 */
  min-height: 100vh;      /* 最小高度为视口高度 */
  font-family: 'Arial', sans-serif; /* 全局字体 */
  background-color: var(--bg-primary);
  transition: background-color 0.3s ease;
}
</style>
