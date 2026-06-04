<template>
  <div class="content-grid">
    <article class="retro-window article-window about-window">
      <div class="window-titlebar">
        <span>about-me.txt</span>
        <span class="window-buttons" aria-hidden="true">_ x</span>
      </div>

      <div class="about-grid">
        <section class="about-panel about-me-panel">
          <div class="about-profile">
            <img src="@/assets/avatar.jpg" alt="GorwayWong avatar" class="about-avatar" />
            <div>
              <p class="eyebrow">Profile</p>
              <h1>关于我</h1>
            </div>
          </div>
          <p>2年工控服务端开发经历，学习web后端、AI、深度学习中，欢迎阅读我的博客！📒</p>
        </section>

        <section class="about-panel contact-panel">
          <p class="eyebrow">Contact</p>
          <h2>联系</h2>
          <p>欢迎与我交流 🙋‍♂️</p>
          <div class="contact-list">
            <a href="mailto:huangguoweiwork@163.com">
              <i class="fas fa-envelope"></i>
              <span>huangguoweiwork@163.com</span>
            </a>
            <a href="https://github.com/GorwayWong" target="_blank" rel="noreferrer">
              <i class="fab fa-github"></i>
              <span>GitHub / GorwayWong</span>
            </a>
          </div>
        </section>
      </div>
    </article>

    <BlogSidebar />
  </div>
</template>

<script setup>
import BlogSidebar from '@/components/blog/BlogSidebar.vue'

document.title = 'About | GorwayWong'
</script>
