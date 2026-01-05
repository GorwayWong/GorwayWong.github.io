/**
 * Vue 应用入口文件 - main.js
 *
 * 【学习要点 - 入口文件的作用】
 * main.js 是 Vue 应用的入口点，负责：
 * 1. 创建 Vue 应用实例
 * 2. 注册全局插件（如 Pinia、Vue Router）
 * 3. 导入全局样式
 * 4. 挂载应用到 DOM
 *
 * 【执行顺序】
 * 1. 导入语句按顺序执行
 * 2. createApp() 创建应用实例
 * 3. app.use() 注册插件
 * 4. app.mount() 挂载到 DOM
 */

// ========================================
// 导入全局样式
// ========================================

// FontAwesome 图标库样式
// 这样就可以在任何组件中使用 <i class="fa-solid fa-xxx"></i>
import '@fortawesome/fontawesome-free/css/all.css'

// 导入我们自己定义的通用模块样式
// 【学习要点】@ 是 vite.config.js 中配置的路径别名，指向 src 目录
import '@/styles/section.css'

// ========================================
// 导入 Vue 核心功能
// ========================================

// createApp - 用于创建 Vue 应用实例
import { createApp } from 'vue'

// createPinia - 用于创建 Pinia 状态管理实例
// 【学习要点】Pinia 需要先创建实例，然后通过 app.use() 注册
import { createPinia } from 'pinia'

// 导入根组件
// App.vue 是整个应用的根组件，所有其他组件都是它的子组件
import App from './App.vue'

// ========================================
// 创建和配置应用
// ========================================

// 创建 Vue 应用实例
// 【学习要点】createApp() 接收根组件作为参数
const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()

// 注册 Pinia 插件
// 【学习要点】app.use() 用于注册 Vue 插件
// 插件可以添加全局功能，如状态管理、路由等
app.use(pinia)

// ========================================
// 挂载应用
// ========================================

/**
 * 将应用挂载到 DOM
 *
 * 【学习要点】
 * '#app' 是 CSS 选择器，对应 index.html 中的 <div id="app"></div>
 * Vue 会将整个应用渲染到这个 DOM 元素中
 *
 * 挂载后，Vue 会：
 * 1. 编译模板
 * 2. 创建响应式系统
 * 3. 渲染初始 DOM
 * 4. 开始监听数据变化
 */
app.mount('#app')
