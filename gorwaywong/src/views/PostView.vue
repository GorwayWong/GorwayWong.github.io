<template>
  <div v-if="post" class="content-grid" :class="{ 'article-fullscreen-layout': isFullscreen }">
    <article class="retro-window article-window" :class="{ 'window-fullscreen': isFullscreen }">
      <div class="window-titlebar">
        <span class="window-title">{{ post.slug }}.md</span>
        <div class="window-controls">
          <button
            type="button"
            class="window-control"
            title="Minimize to taskbar"
            @click="minimizePost"
          >
            <i class="fa-solid fa-minus" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            class="window-control"
            :title="isFullscreen ? 'Restore window' : 'Maximize article'"
            @click="toggleFullscreen"
          >
            <i
              :class="
                isFullscreen ? 'fa-regular fa-window-restore' : 'fa-regular fa-window-maximize'
              "
              aria-hidden="true"
            ></i>
          </button>
          <button type="button" class="window-close" title="Close article" @click="closePost">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <header class="article-header">
        <p class="post-meta">{{ formatDate(post.date) }}</p>
        <h1>{{ post.title }}</h1>
        <p class="post-excerpt">{{ post.excerpt }}</p>
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
      </header>

      <div class="article-body" v-html="post.html"></div>

      <nav class="post-neighbors" aria-label="Post navigation">
        <RouterLink
          v-if="previousPost"
          :to="{ name: 'post', params: { slug: previousPost.slug } }"
          class="neighbor-link"
        >
          Older: {{ previousPost.title }}
        </RouterLink>
        <RouterLink
          v-if="nextPost"
          :to="{ name: 'post', params: { slug: nextPost.slug } }"
          class="neighbor-link"
        >
          Newer: {{ nextPost.title }}
        </RouterLink>
      </nav>
    </article>

    <BlogSidebar v-if="!isFullscreen" />
  </div>

  <EmptyState
    v-else
    title="Post not found"
    message="This Markdown file is not part of the current static build."
  />
</template>

<script setup>
import { computed, watch, watchEffect } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'
import EmptyState from '@/components/blog/EmptyState.vue'
import { formatDate } from '@/posts'
import { useBlogStore } from '@/stores/blogStore'
import { useWindowStore } from '@/stores/windowStore'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const store = useBlogStore()
const router = useRouter()
const windowStore = useWindowStore()
const post = computed(() => store.findPost(props.slug))
const postIndex = computed(() => store.allPosts.findIndex((item) => item.slug === props.slug))
const previousPost = computed(() => store.allPosts[postIndex.value + 1])
const nextPost = computed(() => store.allPosts[postIndex.value - 1])
const isFullscreen = computed(() => windowStore.isPostFullscreen(props.slug))

watch(
  post,
  (currentPost) => {
    if (currentPost) {
      windowStore.openPost(currentPost)
    }
  },
  { immediate: true },
)

function minimizePost() {
  if (!post.value) {
    return
  }

  windowStore.minimizePost(post.value)
  router.push(windowStore.returnRouteFor(props.slug))
}

function toggleFullscreen() {
  windowStore.toggleFullscreen(props.slug)
}

function closePost() {
  router.push(windowStore.closePost(props.slug))
}

watchEffect(() => {
  document.title = post.value ? `${post.value.title} | GorwayWong` : 'Post not found | GorwayWong'
})
</script>
