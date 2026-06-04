<template>
  <section class="retro-window empty-state">
    <div class="window-titlebar">
      <span>empty.txt</span>
      <span class="window-buttons" aria-hidden="true">_ x</span>
    </div>
    <div class="empty-body">
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <RouterLink v-if="showHome" :to="{ name: 'home' }" class="retro-button">Back home</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  title: {
    type: String,
    default: 'Nothing here',
  },
  message: {
    type: String,
    default: 'The requested content is not available.',
  },
  showHome: {
    type: Boolean,
    default: true,
  },
})
</script>
