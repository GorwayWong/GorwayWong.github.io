import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { posts } from '@/posts'

function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, '')
}

function fuzzyTitleScore(title, query) {
  if (!query) return 0

  const exactIndex = title.indexOf(query)
  if (exactIndex !== -1) {
    return exactIndex * 2
  }

  let cursor = 0
  let firstMatch = -1
  let previousMatch = -1
  let gapPenalty = 0

  for (const char of Array.from(query)) {
    const matchIndex = title.indexOf(char, cursor)
    if (matchIndex === -1) return Number.POSITIVE_INFINITY

    if (firstMatch === -1) firstMatch = matchIndex
    if (previousMatch !== -1) {
      gapPenalty += matchIndex - previousMatch - 1
    }

    previousMatch = matchIndex
    cursor = matchIndex + char.length
  }

  return 100 + firstMatch * 3 + gapPenalty
}

export const useBlogStore = defineStore('blog', () => {
  const allPosts = ref(posts)
  const searchQuery = ref('')

  const latestPosts = computed(() => allPosts.value.slice(0, 5))

  const normalizedSearchQuery = computed(() => normalizeSearchText(searchQuery.value.trim()))

  const searchIndex = computed(() =>
    allPosts.value.map((post, index) => ({
      post,
      index,
      normalizedTitle: normalizeSearchText(post.title),
    })),
  )

  const isSearchActive = computed(() => normalizedSearchQuery.value.length > 0)

  const searchedPosts = computed(() => {
    const query = normalizedSearchQuery.value
    if (!query) return allPosts.value

    return searchIndex.value
      .map((entry) => ({
        ...entry,
        score: fuzzyTitleScore(entry.normalizedTitle, query),
      }))
      .filter((entry) => Number.isFinite(entry.score))
      .sort((a, b) => a.score - b.score || a.index - b.index)
      .map((entry) => entry.post)
  })

  const searchedPostCount = computed(() => searchedPosts.value.length)

  const tagCounts = computed(() => {
    const counts = new Map()
    allPosts.value.forEach((post) => {
      post.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      })
    })

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  })

  const archiveGroups = computed(() => {
    const groups = new Map()
    allPosts.value.forEach((post) => {
      const year = post.date ? String(post.date).slice(0, 4) : 'Undated'
      if (!groups.has(year)) groups.set(year, [])
      groups.get(year).push(post)
    })

    return Array.from(groups.entries())
      .map(([year, postsInYear]) => ({ year, posts: postsInYear }))
      .sort((a, b) => String(b.year).localeCompare(String(a.year)))
  })

  const findPost = (slug) => allPosts.value.find((post) => post.slug === slug)

  const postsByTag = (tag) => allPosts.value.filter((post) => post.tags.includes(tag))

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function clearSearchQuery() {
    searchQuery.value = ''
  }

  return {
    allPosts,
    latestPosts,
    searchQuery,
    isSearchActive,
    searchedPosts,
    searchedPostCount,
    tagCounts,
    archiveGroups,
    findPost,
    postsByTag,
    setSearchQuery,
    clearSearchQuery,
  }
})
