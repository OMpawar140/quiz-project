import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
    }, 
    {
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
    },
    {
      path: '/quizzes/:quizId',
      name: 'quiz',
      component: () => import('../views/quiz.vue'),
      props: true // Pass route params as props
    },
    {
      path: '/updateQuiz/:quizId', // Add the new route
      name: 'update-quiz',
      component: () => import('../views/updateQuiz.vue'),
    },
  ]
})

export default router
