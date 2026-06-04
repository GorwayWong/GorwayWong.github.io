<template>
  <div class="content-grid">
    <section class="post-list">
      <section class="retro-window page-heading">
        <div class="window-titlebar">
          <span>tag.search</span>
          <span class="window-buttons" aria-hidden="true">_ x</span>
        </div>
        <div class="page-heading-body">
          <p class="eyebrow">Tag</p>
          <h1>{{ tag }}</h1>
          <p>{{ taggedPosts.length }} post(s) matched.</p>
        </div>
      </section>

      <PostCard v-for="post in taggedPosts" :key="post.slug" :post="post" />
      <EmptyState
        v-if="!taggedPosts.length"
        title="Tag not found"
        message="No published posts use this tag in the current build."
      />
    </section>

    <BlogSidebar />
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'
import EmptyState from '@/components/blog/EmptyState.vue'
import PostCard from '@/components/blog/PostCard.vue'
import { useBlogStore } from '@/stores/blogStore'

const props = defineProps({
  tag: {
    type: String,
    required: true,
  },
})

const store = useBlogStore()
const taggedPosts = computed(() => store.postsByTag(props.tag))

watchEffect(() => {
  document.title = `${props.tag} | GorwayWong`
})
</script>
