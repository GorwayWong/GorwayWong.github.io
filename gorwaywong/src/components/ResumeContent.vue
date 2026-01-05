<!--
  简历内容容器组件 - ResumeContent.vue

  【修改】适配新的动态模块结构
  直接使用 store.sections 数组，不再手动组装
-->

<template>
  <main class="content">
    <template v-if="store.isLoaded">
      <!--
        【修改】直接遍历 store.sections
        过滤掉 items 为空的模块
      -->
      <ResumeSection
        v-for="section in filteredSections"
        :key="section.id"
        :title="section.title"
        :items="section.items"
      />
    </template>

    <div v-else class="loading">
      加载中...
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useResumeStore } from '@/stores/resumeStore'
import ResumeSection from './ResumeSection.vue'

const store = useResumeStore()

/**
 * 【修改】过滤掉内容为空的模块
 * 直接使用 store.sections，不再手动组装
 */
const filteredSections = computed(() => {
  return store.sections.filter(section => section.items && section.items.length > 0)
})
</script>

<style scoped>
.content {
  flex: 1;
  padding: 2rem;
  margin-left: 400px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #7f8c8d;
}
</style>
