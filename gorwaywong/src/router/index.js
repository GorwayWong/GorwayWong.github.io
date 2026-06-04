import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import TagView from '@/views/TagView.vue'
import ArchiveView from '@/views/ArchiveView.vue'
import AboutView from '@/views/AboutView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useWindowStore } from '@/stores/windowStore'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/post/:slug', name: 'post', component: PostView, props: true },
    { path: '/tag/:tag', name: 'tag', component: TagView, props: true },
    { path: '/archive', name: 'archive', component: ArchiveView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from) => {
  if (to.name !== 'post') {
    return
  }

  const windowStore = useWindowStore()
  const slug = String(to.params.slug || '')

  if (!slug || windowStore.hasPostTask(slug)) {
    return
  }

  if (from.name && from.name !== 'post') {
    windowStore.setReturnRoute(slug, from.fullPath)
    return
  }

  if (from.name === 'post') {
    const previousSlug = String(from.params.slug || '')
    windowStore.setReturnRoute(slug, windowStore.returnRouteFor(previousSlug))
    return
  }

  windowStore.setReturnRoute(slug, '/')
})

export default router
