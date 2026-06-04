<template>
  <header class="site-header">
    <RouterLink class="brand-link" :to="{ name: 'home' }">
      <span class="brand-badge">GW</span>
      <span>
        <strong>GorwayWong Blog</strong>
        <small>Backend / AI / Deep Learning</small>
      </span>
    </RouterLink>

    <nav class="site-nav" aria-label="Main navigation">
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <div class="nav-dropdown">
        <RouterLink :to="{ name: 'archive' }">Archive</RouterLink>
        <div class="nav-dropdown-menu">
          <RouterLink :to="{ name: 'archive', query: { view: 'year' } }">By year</RouterLink>
          <RouterLink :to="{ name: 'archive', query: { view: 'tag' } }">By tag</RouterLink>
        </div>
      </div>
      <RouterLink :to="{ name: 'about' }">About</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
