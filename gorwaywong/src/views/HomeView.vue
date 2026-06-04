<template>
  <div>
    <section class="retro-window hero-panel">
      <div class="window-titlebar">
        <span>index.html</span>
      </div>
      <div class="hero-content">
        <p class="eyebrow">Welcome to</p>
        <h1>GorwayWong Blog</h1>
        <p>我的技术相关随笔</p>
      </div>
      <div class="status-bar">
        <span>{{ statusText }}</span>
      </div>
    </section>

    <div class="content-grid">
      <section class="post-list" aria-label="Blog posts">
        <PostCard v-for="post in visiblePosts" :key="post.slug" :post="post" />
        <EmptyState
          v-if="!visiblePosts.length"
          :title="emptyTitle"
          :message="emptyMessage"
          :show-home="false"
        />
      </section>

      <BlogSidebar />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'
import EmptyState from '@/components/blog/EmptyState.vue'
import PostCard from '@/components/blog/PostCard.vue'
import { useBlogStore } from '@/stores/blogStore'

const store = useBlogStore()
const visiblePosts = computed(() => store.searchedPosts)
const trimmedSearchQuery = computed(() => store.searchQuery.trim())
const statusText = computed(() => {
  if (!store.isSearchActive) {
    return `${store.allPosts.length} posts loaded`
  }

  return `${store.searchedPostCount} of ${store.allPosts.length} title match(es) for "${trimmedSearchQuery.value}"`
})
const emptyTitle = computed(() => (store.isSearchActive ? 'No title matches' : 'No posts yet'))
const emptyMessage = computed(() =>
  store.isSearchActive
    ? `No blog post titles match "${trimmedSearchQuery.value}".`
    : 'Add Markdown files to the repository root posts/ folder, then rebuild.',
)

document.title = 'GorwayWong | Blog'
</script>
