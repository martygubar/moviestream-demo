import { createRouter, createWebHistory, createWebHashHistory  } from 'vue-router'
import SplashView from '@/views/SplashView.vue'
import ProfileHomeView from '@/views/ProfileHomeView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SplashView,
    },
    {
      path: '/profileHome',
      name: 'profileHome',
      component: ProfileHomeView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: '404',
      component: SplashView,
    },
  ],
})
