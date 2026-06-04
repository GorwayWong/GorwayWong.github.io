<template>
  <aside class="blog-sidebar">
    <div class="floating-controls">
      <div class="views-dock">
        <button class="views-button" type="button">
          <i class="fa-solid fa-window-restore"></i>
          Views
          <span v-if="closedCount">{{ closedCount }}</span>
        </button>
        <div class="views-menu">
          <button
            v-for="panel in panels"
            :key="panel.id"
            type="button"
            :class="{ visible: isPanelVisible(panel.id) }"
            @click="togglePanel(panel.id)"
          >
            <i
              :class="
                isPanelVisible(panel.id) ? 'fa-solid fa-xmark' : 'fa-regular fa-window-maximize'
              "
            ></i>
            {{ isPanelVisible(panel.id) ? `Close ${panel.label}` : `Restore ${panel.label}` }}
          </button>
          <button type="button" class="restore-all" @click="toggleAllPanels">
            <i :class="allPanelsVisible ? 'fa-solid fa-xmark' : 'fa-solid fa-rotate-left'"></i>
            {{ allPanelsVisible ? 'Close all' : 'Restore all' }}
          </button>
        </div>
      </div>

      <button class="theme-switch floating-theme" type="button" @click="themeStore.toggleTheme">
        <i :class="themeStore.isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
        {{ themeStore.isDark ? 'Day' : 'Night' }}
      </button>
    </div>

    <div class="sidebar-panels">
      <section v-if="isPanelVisible('about')" class="retro-window sidebar-card">
        <div class="window-titlebar">
          <span>about.exe</span>
          <div class="window-controls">
            <button
              type="button"
              class="window-close"
              title="Close about panel"
              @click="closePanel('about')"
            >
              ×
            </button>
          </div>
        </div>
        <div class="sidebar-profile">
          <img src="@/assets/avatar.jpg" alt="GorwayWong avatar" class="avatar" />
          <div>
            <h2>GorwayWong</h2>
            <p>前工控服务端开发工程师，Java 后端开发者，研一，记录工程与学习笔记。</p>
          </div>
        </div>
        <div class="social-row">
          <a href="https://github.com/GorwayWong" target="_blank" rel="noreferrer">
            <i class="fab fa-github"></i>
            GitHub
          </a>
          <a href="mailto:huangguoweiwork@163.com">
            <i class="fas fa-envelope"></i>
            Email
          </a>
        </div>
      </section>

      <section v-if="isPanelVisible('tags')" class="retro-window sidebar-card">
        <div class="window-titlebar">
          <span>tags.ini</span>
          <div class="window-controls">
            <button
              type="button"
              class="window-close"
              title="Close tags panel"
              @click="closePanel('tags')"
            >
              ×
            </button>
          </div>
        </div>
        <div v-if="store.tagCounts.length" class="tag-cloud">
          <RouterLink
            v-for="tag in store.tagCounts"
            :key="tag.name"
            :to="{ name: 'tag', params: { tag: tag.name } }"
            class="tag-pill"
          >
            {{ tag.name }} <span>{{ tag.count }}</span>
          </RouterLink>
        </div>
        <p v-else class="muted-text">No tags yet.</p>
      </section>

      <section v-if="isPanelVisible('latest')" class="retro-window sidebar-card">
        <div class="window-titlebar">
          <span>latest.log</span>
          <div class="window-controls">
            <button
              type="button"
              class="window-close"
              title="Close latest panel"
              @click="closePanel('latest')"
            >
              ×
            </button>
          </div>
        </div>
        <ol v-if="store.latestPosts.length" class="latest-list">
          <li v-for="post in store.latestPosts" :key="post.slug">
            <RouterLink :to="{ name: 'post', params: { slug: post.slug } }">
              {{ post.title }}
            </RouterLink>
          </li>
        </ol>
        <p v-else class="muted-text">No posts yet.</p>
      </section>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useBlogStore } from '@/stores/blogStore'
import { useThemeStore } from '@/stores/themeStore'

const store = useBlogStore()
const themeStore = useThemeStore()

const storageKey = 'blog-sidebar-closed-panels'
const panels = [
  { id: 'about', label: 'About' },
  { id: 'tags', label: 'Tags' },
  { id: 'latest', label: 'Latest' },
]

const closedPanels = ref([])
const closedCount = computed(() => closedPanels.value.length)
const allPanelsVisible = computed(() => closedPanels.value.length === 0)

function persistClosedPanels() {
  localStorage.setItem(storageKey, JSON.stringify(closedPanels.value))
}

function isPanelVisible(id) {
  return !closedPanels.value.includes(id)
}

function closePanel(id) {
  if (!closedPanels.value.includes(id)) {
    closedPanels.value = [...closedPanels.value, id]
  }
}

function restorePanel(id) {
  closedPanels.value = closedPanels.value.filter((panelId) => panelId !== id)
}

function togglePanel(id) {
  if (isPanelVisible(id)) {
    closePanel(id)
  } else {
    restorePanel(id)
  }
}

function closeAll() {
  closedPanels.value = panels.map((panel) => panel.id)
}

function toggleAllPanels() {
  if (allPanelsVisible.value) {
    closeAll()
  } else {
    closedPanels.value = []
  }
}

onMounted(() => {
  try {
    const savedPanels = JSON.parse(localStorage.getItem(storageKey) || '[]')
    closedPanels.value = savedPanels.filter((id) => panels.some((panel) => panel.id === id))
  } catch {
    closedPanels.value = []
  }
})

watch(closedPanels, persistClosedPanels)
</script>
