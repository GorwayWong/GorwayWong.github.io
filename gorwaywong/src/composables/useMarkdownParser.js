/**
 * Markdown 解析工具 - Vue 3 组合式函数 (Composable)
 *
 * 【学习要点 - 什么是 Composable？】
 * Composable 是 Vue 3 Composition API 的核心概念之一。
 * 它是一个函数，用于封装和复用有状态的逻辑。
 * 命名约定：以 "use" 开头，如 useMarkdownParser、useCounter 等。
 *
 * 【为什么使用 Composable？】
 * 1. 逻辑复用：多个组件可以共享同一个 Composable
 * 2. 代码组织：将相关逻辑集中在一起，而不是分散在 data、methods、computed 中
 * 3. 更好的 TypeScript 支持
 *
 * 【本文件的作用】
 * 1. 将 Markdown 文本转换为 HTML（用于页面渲染）
 * 2. 解析简历 Markdown 文件，提取结构化数据
 */

// 导入 marked 库 - 用于将 Markdown 转换为 HTML
import { marked } from 'marked'

// 导入 DOMPurify - 用于清理 HTML，防止 XSS 攻击
import DOMPurify from 'dompurify'

/**
 * Markdown 解析组合式函数
 */
export function useMarkdownParser() {
  // 配置 marked 选项
  marked.setOptions({
    gfm: true,
    breaks: true,
  })

  /**
   * 预处理 Markdown 文本，修复一些解析问题
   */
  const preprocessMarkdown = (content) => {
    if (!content) return ''
    // 修复加粗语法
    return content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  }

  /**
   * 渲染完整的 Markdown 内容为 HTML
   */
  const renderMarkdown = (content) => {
    if (!content) return ''
    const preprocessed = preprocessMarkdown(content)
    const html = marked.parse(preprocessed)
    return DOMPurify.sanitize(html)
  }

  /**
   * 渲染行内 Markdown（不包含块级元素）
   */
  const parseInlineMarkdown = (content) => {
    if (!content) return ''
    const preprocessed = preprocessMarkdown(content)
    const html = marked.parseInline(preprocessed)
    return DOMPurify.sanitize(html)
  }

  /**
   * 解析简历 Markdown 文件为结构化数据
   *
   * 【修改】不再使用固定的模块映射表，而是动态识别所有二级标题作为模块
   * 这样你可以自由命名模块，如"教育"、"工作"、"技能"等
   *
   * 【解析规则】
   * - # 一级标题 → 简历名称
   * - ## 二级标题 → 模块名称（任意名称都会被识别）
   * - ###/####/#####/###### 三到六级标题 → 条目标题
   * - 列表内容 → 条目详情
   */
  const parseResumeMarkdown = (markdownText) => {
    const lines = markdownText.split('\n')

    // 【修改】使用 sections 数组存储所有模块，而不是固定字段
    const result = {
      header: { name: '', contact: '', objective: '' },
      sections: []  // 动态存储所有模块
    }

    // 当前正在解析的模块对象
    let currentSection = null

    // 当前正在解析的条目
    let currentItem = null

    // 内容缓冲区
    let contentBuffer = []
    let sectionContentBuffer = []

    /**
     * 检测是否为条目标题（三到六级标题）
     */
    const parseItemTitle = (line) => {
      const match = line.match(/^(#{3,6})\s+(.+)$/)
      if (match) {
        return {
          level: match[1].length,
          title: match[2].trim()
        }
      }
      return null
    }

    /**
     * 保存当前条目到当前模块中
     */
    const saveCurrentItem = () => {
      if (currentItem && currentSection) {
        currentItem.content = contentBuffer.join('\n').trim()
        currentSection.items.push(currentItem)
        currentItem = null
        contentBuffer = []
      }
    }

    /**
     * 保存模块级别的内容（用于没有子标题的模块）
     */
    const saveSectionContent = () => {
      if (currentSection && sectionContentBuffer.length > 0) {
        const content = sectionContentBuffer.join('\n').trim()
        if (content) {
          currentSection.items.push({
            title: '',
            content: content
          })
        }
        sectionContentBuffer = []
      }
    }

    /**
     * 保存当前模块到结果中
     */
    const saveCurrentSection = () => {
      saveCurrentItem()
      saveSectionContent()
      if (currentSection) {
        result.sections.push(currentSection)
        currentSection = null
      }
    }

    // 逐行解析
    for (const line of lines) {
      // ========== 解析一级标题（简历名称）==========
      if (line.startsWith('# ') && !line.startsWith('## ')) {
        result.header.name = line.replace(/^#\s+/, '').trim()
        continue
      }

      // ========== 解析联系信息行 ==========
      if (line.includes('｜') && line.includes('求职意向')) {
        result.header.contact = line.trim()
        continue
      }

      // ========== 解析二级标题（模块名称）==========
      // 【修改】不再使用映射表，直接将二级标题作为模块名称
      if (line.startsWith('## ') && !line.startsWith('### ')) {
        saveCurrentSection()  // 保存之前的模块
        const sectionTitle = line.replace(/^##\s+/, '').trim()
        // 创建新模块
        currentSection = {
          id: sectionTitle,     // 使用标题作为 ID
          title: sectionTitle,  // 模块标题
          items: []             // 条目数组
        }
        continue
      }

      // ========== 解析三到六级标题（条目标题）==========
      const itemTitle = parseItemTitle(line)
      if (itemTitle) {
        saveCurrentItem()
        sectionContentBuffer = []
        currentItem = {
          title: itemTitle.title,
          level: itemTitle.level,
          content: ''
        }
        continue
      }

      // ========== 收集条目内容 ==========
      if (currentSection) {
        if (currentItem) {
          contentBuffer.push(line)
        } else {
          sectionContentBuffer.push(line)
        }
      }
    }

    // 循环结束后，保存最后的模块
    saveCurrentSection()

    return result
  }

  return {
    renderMarkdown,
    parseInlineMarkdown,
    parseResumeMarkdown
  }
}
