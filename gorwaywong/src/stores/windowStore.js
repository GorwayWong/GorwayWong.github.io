import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useWindowStore = defineStore('window', () => {
  const maxPostTaskCount = 5
  const postTasks = ref([])
  const returnRoutes = ref({})
  const fullscreenSlug = ref(null)

  const minimizedPosts = computed(() => postTasks.value)
  const minimizedCount = computed(() => postTasks.value.length)

  function postTaskFrom(post) {
    return {
      slug: post.slug,
      title: post.title || post.slug,
      filename: `${post.slug}.md`,
    }
  }

  function clearTaskState(slug) {
    if (fullscreenSlug.value === slug) {
      fullscreenSlug.value = null
    }

    const nextRoutes = { ...returnRoutes.value }
    delete nextRoutes[slug]
    returnRoutes.value = nextRoutes
  }

  function trimTaskQueue(tasks) {
    if (tasks.length <= maxPostTaskCount) {
      return tasks
    }

    const evictedTasks = tasks.slice(0, tasks.length - maxPostTaskCount)
    evictedTasks.forEach((task) => clearTaskState(task.slug))
    return tasks.slice(-maxPostTaskCount)
  }

  function setReturnRoute(slug, routePath = '/') {
    if (!slug) {
      return
    }

    returnRoutes.value = {
      ...returnRoutes.value,
      [slug]: routePath || '/',
    }
  }

  function returnRouteFor(slug) {
    return returnRoutes.value[slug] || '/'
  }

  function hasPostTask(slug) {
    return postTasks.value.some((post) => post.slug === slug)
  }

  function openPost(post) {
    if (!post?.slug) {
      return
    }

    const task = postTaskFrom(post)
    const existingTask = postTasks.value.find((item) => item.slug === task.slug)
    const nextTasks = existingTask
      ? postTasks.value.map((item) => (item.slug === task.slug ? task : item))
      : [...postTasks.value, task]

    postTasks.value = trimTaskQueue(nextTasks)
  }

  function hasMinimizedPost(slug) {
    return hasPostTask(slug)
  }

  function minimizePost(post) {
    openPost(post)
    if (fullscreenSlug.value === post.slug) {
      fullscreenSlug.value = null
    }
  }

  function restorePost(slug) {
    if (fullscreenSlug.value === slug) {
      fullscreenSlug.value = null
    }
  }

  function removePostTask(slug) {
    postTasks.value = postTasks.value.filter((post) => post.slug !== slug)
    clearTaskState(slug)
  }

  function toggleFullscreen(slug) {
    fullscreenSlug.value = fullscreenSlug.value === slug ? null : slug
  }

  function isPostFullscreen(slug) {
    return fullscreenSlug.value === slug
  }

  function closePost(slug) {
    const targetRoute = returnRouteFor(slug)
    removePostTask(slug)
    return targetRoute
  }

  return {
    postTasks,
    minimizedPosts,
    minimizedCount,
    fullscreenSlug,
    setReturnRoute,
    returnRouteFor,
    hasPostTask,
    hasMinimizedPost,
    openPost,
    minimizePost,
    restorePost,
    removePostTask,
    toggleFullscreen,
    isPostFullscreen,
    closePost,
  }
})
