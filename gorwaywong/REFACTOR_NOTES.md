# 简历网站重构笔记

本文档记录了将简历网站从硬编码数据改为 Markdown 驱动的重构过程，包含设计思路和学习要点。

---

## 一、重构目标

### 原有问题
1. **数据硬编码**：简历内容直接写在 Vue 组件中，修改内容需要改代码
2. **样式重复**：`EducationSection.vue` 和 `WorkSection.vue` 有大量重复 CSS
3. **扩展性差**：新增模块（如项目经验）需要复制粘贴大量代码
4. **Pinia 未使用**：已安装但未实际使用

### 重构目标
1. 使用 **Markdown 文件** 存储简历内容，修改内容只需编辑 `.md` 文件
2. 创建 **通用模块组件**，消除代码重复
3. 使用 **Pinia** 管理全局状态
4. 支持 **4 个模块**：教育经历、工作经历、项目经验、专业技能

---

## 二、技术方案

### 2.1 数据流设计

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   resume.md     │────>│ useMarkdownParser │────>│  Pinia Store    │
│   (数据源)       │     │   (解析工具)       │     │  (状态管理)      │
└─────────────────┘     └───────────��──────┘     └─────────────────┘
                                                         │
                                                         ▼
                        ┌──────────────────────────────────────────┐
                        │              ResumeContent               │
                        │  ┌────────────────────────────────────┐  │
                        │  │       ResumeSection × 4            │  │
                        │  │  (教育/工作/项目/技能)              │  │
                        │  └────────────────────────────────────┘  │
                        └──────────────────────────────────────────┘
```

### 2.2 核心技术选型

| 技术 | 用途 | 选择理由 |
|------|------|----------|
| **marked** | Markdown → HTML | 轻量（~40KB）、速度快、支持 GFM |
| **DOMPurify** | HTML 消毒 | 防止 XSS 攻击，安全必备 |
| **Pinia** | 状态管理 | Vue 3 官方推荐，API 简洁 |
| **Vite ?raw** | 导入原始文件 | 将 .md 文件作为字符串导入 |

---

## 三、文件结构

### 3.1 新增文件

```
src/
├── assets/
│   └── resume.md                    # 简历数据源（Markdown 格式）
├── composables/
│   └── useMarkdownParser.js         # Markdown 解析工具（Composable）
├── stores/
│   └── resumeStore.js               # Pinia 状态管理
├── components/
│   ├── ResumeSection.vue            # 通用模块组件（展示组件）
│   └── ResumeContent.vue            # 右侧内容容器（容器组件）
└── styles/
    └── section.css                  # 通用模块样式
```

### 3.2 修改文件

| 文件 | 修改内容 |
|------|----------|
| `main.js` | 启用 Pinia，导入全局样式 |
| `App.vue` | 使用新组件，在 `onMounted` 中加载数据 |
| `vite.config.js` | 添加 `assetsInclude: ['**/*.md']` |

### 3.3 删除文件

- `EducationSection.vue` - 被 `ResumeSection.vue` 替代
- `WorkSection.vue` - 被 `ResumeSection.vue` 替代

---

## 四、核心代码解析

### 4.1 Markdown 解析器 (`useMarkdownParser.js`)

#### 设计思路

1. **Composable 模式**：将 Markdown 解析逻辑封装为可复用的组合式函数
2. **两种渲染方式**：
   - `renderMarkdown()` - 渲染完整 Markdown（列表、段落等）
   - `parseInlineMarkdown()` - 渲染���内元素（加粗、链接等）
3. **自定义解析器**：`parseResumeMarkdown()` 将 Markdown 解析为结构化数据

#### 解析规则

```markdown
# 一级标题      → header.name（简历名称）
## 二级标题     → 模块分类（教育经历/工作经历/项目经验/专业技能）
##### 五级标题  → 条目标题（学校名称、公司名称等）
- 列表内容      → 条目详情
```

#### 遇到的问题：加粗语法解析失败

**问题现象**：`**宽厚板轧线L2系统：**` 显示为 `**宽厚板轧线L2系统：**`，星号没有被解析

**问题原因**：marked 解析器在处理 `**文字：**` 格式时，由于中文冒号 `：` 紧跟在 `**` 后面，触发了解析器的边界情况，导致无法正确识别加粗语法。

**解决方案**：添加预处理函数，在 marked 解析之前先用正则表达式处理加粗语法：

```javascript
const preprocessMarkdown = (content) => {
  if (!content) return ''
  // 将 **text** 直接转换为 <strong>text</strong>
  return content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}
```

**学习要点**：
- 第三方库可能有边界情况，需要针对性处理
- 正则表达式是处理文本的强大工具
- 预处理是解决解析问题的常用策略

### 4.2 Pinia Store (`resumeStore.js`)

#### 设计思路

1. **Composition API 风格**：使用 `ref()` 定义响应式状态
2. **异步数据加载**：`loadResume()` 方法动态导入并解析 Markdown 文件
3. **加载状态管理**：`isLoaded` 标志用于显示加载中状态

#### 关键代码

```javascript
// 动态导入 Markdown 文件（Vite 的 ?raw 后缀）
const resumeModule = await import('@/assets/resume.md?raw')
const markdownText = resumeModule.default

// 解析并存储数据
const data = parseResumeMarkdown(markdownText)
education.value = data.education
// ...
```

**学习要点**：
- `?raw` 后缀让 Vite 将文件作为原始字符串导入
- 动态导入 `import()` 返回 Promise，支持代码分割
- Pinia 的 Composition API 风格比 Options API 更灵活

### 4.3 通用模块组件 (`ResumeSection.vue`)

#### 设计思路

1. **Props 驱动**：通过 `title` 和 `items` 两个 props 接收数据
2. **v-html 渲染**：使用 `v-html` 渲染 Markdown 转换后的 HTML
3. **样式复用**：使用全局样式 `section.css`，避免重复定义

#### 组件结构

```vue
<template>
  <section class="resume-section">
    <h2 class="section-title">{{ title }}</h2>
    <div class="timeline">
      <div v-for="item in items" class="timeline-item">
        <h3 v-html="parseInlineMarkdown(item.title)"></h3>
        <div v-html="renderMarkdown(item.content)"></div>
      </div>
    </div>
  </section>
</template>
```

**学习要点**：
- `v-html` 可以渲染 HTML 字符串，但要注意 XSS 风险
- 使用 DOMPurify 清理 HTML 是安全最佳实践
- 组件复用减少了代码量，提高了可维护性

### 4.4 容器组件 vs 展示组件

| 类型 | 职责 | 本项目示例 |
|------|------|------------|
| **容器组件** | 获取数据、管理状态 | `ResumeContent.vue` |
| **展示组件** | 接收 props、渲染 UI | `ResumeSection.vue` |

这种分离让代码更清晰：
- 展示组件可以独立测试和复用
- 容器组件负责业务逻辑，便于维护

---

## 五、Vue 3 核心概念回顾

### 5.1 Composition API

```javascript
// Options API（Vue 2 风格）
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}

// Composition API（Vue 3 推荐）
import { ref } from 'vue'
const count = ref(0)
const increment = () => { count.value++ }
```

### 5.2 生命周期钩子

```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // 组件挂载后执行，适合：
  // - 获取数据
  // - 操作 DOM
  // - 设置定时器
})

onUnmounted(() => {
  // 组件卸载前执行，适合：
  // - 清理定时器
  // - 取消订阅
})
```

### 5.3 响应式系统

```javascript
import { ref, computed, watch } from 'vue'

// ref - 基本类型响应式
const count = ref(0)
count.value++  // 修改需要 .value

// computed - 计算属性（自动缓存）
const double = computed(() => count.value * 2)

// watch - 监听变化
watch(count, (newVal, oldVal) => {
  console.log(`count changed: ${oldVal} -> ${newVal}`)
})
```

---

## 六、后续优化建议

1. **响应式布局**：添加移动端适配
2. **主题切换**：支持亮色/暗色主题
3. **PDF 导出**：使用 html2pdf.js 导出简历
4. **多语言支持**：中英文切换
5. **SEO 优化**：添加 meta 标签，考虑 SSR/SSG

---

## 七、常见问题

### Q1: 为什么选择 marked 而不是 markdown-it？

marked 更轻量（~40KB vs ~100KB），对于简历网站这种简单场景足够使用。如果需要更多插件扩展，可以考虑 markdown-it。

### Q2: 为什么要用 DOMPurify？

`v-html` 会直接渲染 HTML，如果内容来自用户输入或外部源，可能包含恶意脚本（XSS 攻击）。DOMPurify 会移除危险的 HTML 标签和属性。

### Q3: 为什么用 Pinia 而不是直接在组件中管理状态？

1. 多个组件可能需要访问同一份数据
2. 数据加载逻辑与 UI 分离，更易维护
3. 便于调试（Vue DevTools 支持）

### Q4: `?raw` 后缀是什么？

这是 Vite 的特性，让你可以将任何文件作为原始字符串导入：

```javascript
import content from './file.md?raw'  // content 是字符串
```

---

*文档更新时间：2026-01-05*
