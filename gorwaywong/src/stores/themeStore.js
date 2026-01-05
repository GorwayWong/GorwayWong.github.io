/**
 * 主题管理 Store
 *
 * 【功能说明】
 * 管理应用的主题状态（白天/暗夜模式）
 * 使用 localStorage 持久化用户的主题偏好
 */

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 主题状态：'light' 或 'dark'
  const theme = ref('light')

  // 是否为暗色模式
  const isDark = ref(false)

  /**
   * 初始化主题
   * 从 localStorage 读取用户偏好，或使用系统偏好
   */
  const initTheme = () => {
    // 1. 先检查 localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
      isDark.value = savedTheme === 'dark'
    } else {
      // 2. 检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
      isDark.value = prefersDark
    }

    // 应用主题
    applyTheme()
  }

  /**
   * 切换主题
   */
  const toggleTheme = () => {
    isDark.value = !isDark.value
    theme.value = isDark.value ? 'dark' : 'light'
    applyTheme()
    // 保存到 localStorage
    localStorage.setItem('theme', theme.value)
  }

  /**
   * 设置为指定主题
   */
  const setTheme = (newTheme) => {
    theme.value = newTheme
    isDark.value = newTheme === 'dark'
    applyTheme()
    localStorage.setItem('theme', theme.value)
  }

  /**
   * 应用主题到 DOM
   * 通过在 <html> 元素上添加 data-theme 属性来切换主题
   */
  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return {
    theme,
    isDark,
    initTheme,
    toggleTheme,
    setTheme
  }
})
