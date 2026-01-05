<!--
  通用简历模块组件 - ResumeSection.vue

  【学习要点 - Vue 单文件组件 (SFC)】
  Vue 单文件组件由三部分组成：
  1. <template> - HTML 模板，定义组件的结构
  2. <script> - JavaScript 逻辑，定义组件的行为
  3. <style> - CSS 样式，定义组件的外观

  【本组件的作用】
  这是一个可复用的模块组件，用于渲染简历的各个部分（教育、工作、项目、技能）。
  通过 props 接收不同的数据，渲染出相同结构但不同内容的模块。

  【组件复用的好处】
  1. 减少代码重复
  2. 统一样式和行为
  3. 便于维护和修改
-->

<template>
  <!--
    【学习要点 - 语义化 HTML】
    使用 <section> 标签表示文档中的一个独立部分
    class="resume-section" 对应 section.css 中的样式
  -->
  <section class="resume-section">
    <!--
      模块标题
      【学习要点】{{ title }} 是 Vue 的插值语法，用于显示变量的值
    -->
    <h2 class="section-title">{{ title }}</h2>

    <!-- 时间线容器 -->
    <div class="timeline">
      <!--
        【学习要点 - v-for 指令】
        v-for 用于循环渲染列表
        语法：v-for="(item, index) in items"
        - item: 当前遍历的元素
        - index: 当前元素的索引（从0开始）
        - items: 要遍历的数组

        【:key 的作用】
        :key 是 v-bind:key 的简写
        Vue 需要 key 来追踪每个节点的身份，以便高效地更新 DOM
        key 应该是唯一的，这里使用 index

        【新增】:class 动态绑定
        当 item.title 为空时，添加 no-bullet 类，隐藏时间线圆点
      -->
      <div
        v-for="(item, index) in items"
        :key="index"
        class="timeline-item"
        :class="{ 'no-bullet': !item.title }"
      >
        <!--
          【新增】v-if 条件渲染
          只有当 item.title 存在时才显示标题行
          专业技能等模块可能没有子标题，直接显示内容
        -->
        <div v-if="item.title" class="timeline-header">
          <!--
            【学习要点 - v-html 指令】
            v-html 用于渲染 HTML 字符串
            这里用于渲染 Markdown 转换后的 HTML

            【安全警告】
            v-html 可能导致 XSS 攻击，所以我们在 useMarkdownParser 中
            使用 DOMPurify 对 HTML 进行了清理

            parseInlineMarkdown 只渲染行内元素（加粗、斜体等）
            不会生成 <p>、<ul> 等块级元素
          -->
          <h3 class="item-title" v-html="parseInlineMarkdown(item.title)"></h3>
        </div>

        <!--
          条目内容
          renderMarkdown 渲染完整的 Markdown，包括列表、段落等
        -->
        <div class="item-content" v-html="renderMarkdown(item.content)"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * 【学习要点 - <script setup>】
 * <script setup> 是 Vue 3.2+ 引入的语法糖
 * 它是 Composition API 的编译时语法糖，让代码更简洁
 *
 * 好处：
 * 1. 更少的样板代码
 * 2. 能够使用纯 TypeScript 声明 props 和 emit
 * 3. 更好的运行时性能
 * 4. 更好的 IDE 类型推断
 */

// 导入 Markdown 解析工具
import { useMarkdownParser } from '@/composables/useMarkdownParser'

/**
 * 【学习要点 - defineProps】
 * defineProps 用于声明组件接收的属性（props）
 * Props 是父组件向子组件传递数据的方式
 *
 * 在 <script setup> 中，defineProps 是一个编译器宏，不需要导入
 */
defineProps({
  /**
   * 模块标题
   * 例如："教育经历"、"工作经历"
   */
  title: {
    type: String,       // 类型：字符串
    required: true      // 必填
  },

  /**
   * 条目数组
   * 每个条目包含 title 和 content 两个字段
   * 例如：[{ title: '学校名称...', content: 'Markdown内容' }]
   */
  items: {
    type: Array,        // 类型：数组
    required: true      // 必填
  }
})

// 从 Composable 中解构出需要的方法
const { renderMarkdown, parseInlineMarkdown } = useMarkdownParser()
</script>

<!--
  【学习要点 - scoped 样式】
  <style scoped> 中的样式只会应用于当前组件
  Vue 会自动给元素添加一个唯一的属性（如 data-v-xxxxx）
  并将 CSS 选择器改写为带有该属性的选择器

  这样可以避免样式冲突，实现组件样式的隔离

  注意：这里我们使用全局样式（section.css），所以这个 style 块是空的
  但保留它是为了将来可能需要添加组件特有的样式
-->
<style scoped>
/* 组件特有的样式可以写在这里 */
/* 通用样式已经在 src/styles/section.css 中定义 */
</style>
