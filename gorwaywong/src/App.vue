<template>
  <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head>
  <div id="app">
    <ResumeSidebar />
    <main class="content">
      <EducationSection />
      <WorkSection />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<script setup>
import ResumeSidebar from './components/ResumeSidebar.vue'
import EducationSection from './components/EducationSection.vue';
import WorkSection from './components/WorkSection.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
}

.content {
  flex: 1;
  padding: 2rem;
  margin-left: 400px; /* 与侧边栏宽度一致 */
}
</style>