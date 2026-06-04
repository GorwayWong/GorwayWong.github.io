<template>
  <article class="retro-window post-card">
    <div class="window-titlebar">
      <span>{{ post.date || 'undated' }}</span>
    </div>

    <RouterLink
      v-if="post.cover"
      :to="{ name: 'post', params: { slug: post.slug } }"
      class="cover-link"
    >
      <img :src="post.cover" :alt="post.title" class="post-cover" />
    </RouterLink>

    <div class="post-card-body">
      <RouterLink :to="{ name: 'post', params: { slug: post.slug } }" class="post-title-link">
        <h2>{{ post.title }}</h2>
      </RouterLink>
      <p class="post-meta">{{ formatDate(post.date) }} / {{ readTime }} min read</p>
      <p class="post-excerpt">{{ post.excerpt }}</p>
      <div class="post-card-footer">
        <div class="tag-list">
          <RouterLink
            v-for="tag in post.tags"
            :key="tag"
            :to="{ name: 'tag', params: { tag } }"
            class="tag-pill"
          >
            {{ tag }}
          </RouterLink>
        </div>
        <RouterLink :to="{ name: 'post', params: { slug: post.slug } }" class="read-more">
          Read more
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { formatDate } from '@/posts'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const readTime = computed(() => {
  const words = props.post.body.replace(/\s+/g, '').length
  return Math.max(1, Math.ceil(words / 450))
})
</script>
