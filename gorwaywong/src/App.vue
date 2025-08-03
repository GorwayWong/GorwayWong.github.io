<template>
  <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></meta></head>
  <div id="app">
    <ResumeSidebar />
    <main class="content">
      <!-- 这里后续放简历主体内容 -->
    </main>
  </div>
</template>

<script>
import ResumeSidebar from './components/ResumeSidebar.vue'

export default {
  name: 'App',
  components: {
    ResumeSidebar
  }
}
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
  margin-left: 220px; /* 与侧边栏宽度一致 */
}
</style>