<template>
  <footer class="site-footer" aria-label="Windows XP style taskbar">
    <RouterLink class="taskbar-home" :to="{ name: 'home' }" title="Home">
      <i class="fa-solid fa-house" aria-hidden="true"></i>
      <span>Home</span>
    </RouterLink>

    <form class="taskbar-search" role="search" @submit.prevent="performSearch">
      <input
        :value="searchText"
        type="search"
        aria-label="Search posts by title"
        autocomplete="off"
        placeholder="Search titles..."
        @input="handleSearchInput"
        @compositionstart="startComposition"
        @compositionend="finishComposition"
      />
      <button
        type="submit"
        class="taskbar-search-button"
        title="Search posts"
        aria-label="Search posts"
      >
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      </button>
    </form>

    <div class="taskbar-tasks" aria-label="Article windows">
      <button
        v-for="task in taskbarPosts"
        :key="task.slug"
        type="button"
        class="taskbar-task"
        :class="{ active: isActiveTask(task.slug) }"
        :aria-pressed="isActiveTask(task.slug)"
        :title="isActiveTask(task.slug) ? `${task.filename} is open` : `Restore ${task.filename}`"
        @click="restoreTask(task.slug)"
      >
        <i class="fa-regular fa-file-lines" aria-hidden="true"></i>
        <span>{{ task.filename }}</span>
      </button>
    </div>

    <span class="taskbar-status">
      <span class="status-light">online</span>
    </span>
  </footer>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blogStore'
import { useWindowStore } from '@/stores/windowStore'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const windowStore = useWindowStore()
const searchDelay = 120
const searchText = ref(blogStore.searchQuery)
const isComposing = ref(false)
let searchTimer = null

const activeSlug = computed(() => (route.name === 'post' ? String(route.params.slug || '') : ''))
const taskbarPosts = computed(() => windowStore.postTasks)

watch(
  () => blogStore.searchQuery,
  (query) => {
    if (query !== searchText.value) {
      searchText.value = query
    }
  },
)

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer)
})

function queueLiveSearch(query) {
  if (searchTimer) clearTimeout(searchTimer)

  searchTimer = setTimeout(() => {
    blogStore.setSearchQuery(query)
    searchTimer = null
  }, searchDelay)
}

function flushSearch() {
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }

  const query = searchText.value.trim()
  searchText.value = query
  blogStore.setSearchQuery(query)
}

function startComposition() {
  isComposing.value = true
}

function finishComposition(event) {
  isComposing.value = false
  searchText.value = event.target.value
  queueLiveSearch(searchText.value)
}

function handleSearchInput(event) {
  searchText.value = event.target.value

  if (event.isComposing || isComposing.value) {
    return
  }

  queueLiveSearch(searchText.value)
}

async function performSearch() {
  if (isComposing.value) {
    return
  }

  flushSearch()

  if (route.name !== 'home') {
    await router.push({ name: 'home' })
  }
}

function isActiveTask(slug) {
  return activeSlug.value === slug
}

async function restoreTask(slug) {
  await router.push({ name: 'post', params: { slug } })
  windowStore.restorePost(slug)
}
</script>
