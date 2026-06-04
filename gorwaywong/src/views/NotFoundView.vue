<template>
  <EmptyState title="404" message="The page you requested does not exist in this static build." />
</template>

<script setup>
import EmptyState from '@/components/blog/EmptyState.vue'

document.title = '404 | GorwayWong'
</script>
