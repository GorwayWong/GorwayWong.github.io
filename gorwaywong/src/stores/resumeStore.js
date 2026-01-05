/**
 * 简历数据状态管理 - Pinia Store
 *
 * 【修改】适配新的动态模块结构
 * 不再使用固定的 education/work/projects/skills 字段
 * 而是使用 sections 数组存储所有模块
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMarkdownParser } from '@/composables/useMarkdownParser'

export const useResumeStore = defineStore('resume', () => {
  // 简历头部信息
  const header = ref({ name: '', contact: '', objective: '' })

  // 【修改】使用 sections 数组存储所有模块
  // 每个模块格式：{ id: string, title: string, items: array }
  const sections = ref([])

  // 加载状态
  const isLoaded = ref(false)

  /**
   * 加载并解析简历数据
   */
  const loadResume = async () => {
    try {
      const resumeModule = await import('@/assets/resume.md?raw')
      const markdownText = resumeModule.default

      const { parseResumeMarkdown } = useMarkdownParser()
      const data = parseResumeMarkdown(markdownText)

      header.value = data.header
      sections.value = data.sections  // 直接使用解析出的 sections 数组

      isLoaded.value = true
      console.log('简历数据加载成功:', data)
    } catch (error) {
      console.error('加载简历数据失败:', error)
    }
  }

  return {
    header,
    sections,
    isLoaded,
    loadResume
  }
})
