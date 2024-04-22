import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

//import LoginView from '@/views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }, {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path:'/upload',
      name:'upload',
      component: () => import('../views/UploadView.vue')
    },
    {
      path:'/alluploads',
      name:'allupload',
      component: () => import('../views/AllUplaodsView.vue')
    },
    {
      path: '/video/:videoId',
      name: 'video',
      component: () => import('../views/VideoView.vue')
    }
  ]
})

export default router