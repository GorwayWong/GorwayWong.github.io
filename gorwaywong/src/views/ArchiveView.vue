<template>
  <div class="content-grid">
    <section class="post-list">
      <section class="retro-window page-heading">
        <div class="window-titlebar">
          <span>archive.zip</span>
        </div>
        <div class="page-heading-body">
          <p class="eyebrow">Archive</p>
          <h1>文章归档</h1>
          <p>
            {{
              mode === 'tag'
                ? '按标签整理已发布的 Markdown 博文。'
                : '按年份整理已发布的 Markdown 博文。'
            }}
          </p>
          <div class="archive-switcher">
            <RouterLink
              :to="{ name: 'archive', query: { view: 'year' } }"
              :class="{ active: mode === 'year' }"
            >
              By year
            </RouterLink>
            <RouterLink
              :to="{ name: 'archive', query: { view: 'tag' } }"
              :class="{ active: mode === 'tag' }"
            >
              By tag
            </RouterLink>
          </div>
        </div>
      </section>

      <section v-for="group in visibleGroups" :key="group.name" class="retro-window archive-group">
        <div class="window-titlebar">
          <span>{{ group.name }}</span>
          <button
            type="button"
            class="archive-toggle"
            :class="{ collapsed: isGroupCollapsed(group.name) }"
            :title="isGroupCollapsed(group.name) ? '展开文章' : '收起文章'"
            @click="toggleGroup(group.name)"
          >
            ▼
          </button>
        </div>
        <ul v-if="!isGroupCollapsed(group.name)">
          <li v-for="post in getGroupPosts(group)" :key="post.slug">
            <span>{{ formatDate(post.date) }}</span>
            <RouterLink :to="{ name: 'post', params: { slug: post.slug } }">
              {{ post.title }}
            </RouterLink>
          </li>
        </ul>
      </section>

      <EmptyState
        v-if="!visibleGroups.length"
        title="Archive is empty"
        message="Published posts will appear here after the next build."
        :show-home="false"
      />
    </section>

    <BlogSidebar />
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'
import EmptyState from '@/components/blog/EmptyState.vue'
import { formatDate } from '@/posts'
import { useBlogStore } from '@/stores/blogStore'

const store = useBlogStore()
const route = useRoute()
const collapsedGroups = ref([])
const expandedTagGroups = ref([])

const mode = computed(() => (route.query.view === 'tag' ? 'tag' : 'year'))

const yearGroups = computed(() =>
  store.archiveGroups.map((group) => ({
    name: group.year,
    posts: group.posts,
  })),
)

const tagGroups = computed(() =>
  store.tagCounts.map((tag) => ({
    name: tag.name,
    count: tag.count,
  })),
)

const visibleGroups = computed(() => (mode.value === 'tag' ? tagGroups.value : yearGroups.value))

function groupKey(name) {
  return `${mode.value}:${name}`
}

function isGroupCollapsed(name) {
  if (mode.value === 'tag') {
    return !expandedTagGroups.value.includes(groupKey(name))
  }

  return collapsedGroups.value.includes(groupKey(name))
}

function toggleGroup(name) {
  const key = groupKey(name)
  if (mode.value === 'tag') {
    if (expandedTagGroups.value.includes(key)) {
      expandedTagGroups.value = expandedTagGroups.value.filter((item) => item !== key)
    } else {
      expandedTagGroups.value = [...expandedTagGroups.value, key]
    }
    return
  }

  if (collapsedGroups.value.includes(key)) {
    collapsedGroups.value = collapsedGroups.value.filter((item) => item !== key)
  } else {
    collapsedGroups.value = [...collapsedGroups.value, key]
  }
}

function getGroupPosts(group) {
  if (mode.value === 'tag') {
    return store.postsByTag(group.name)
  }

  return group.posts
}

watchEffect(() => {
  document.title = mode.value === 'tag' ? 'Archive by tag | GorwayWong' : 'Archive | GorwayWong'
})
</script>
