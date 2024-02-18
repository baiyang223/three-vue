import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { menu } from '@/mock/menu'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'home' },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      redirect: '/home/staging',
      children: [
        {
          path: 'staging',
          name: 'staging',
          component: () => import('@/views/StagingView.vue'),
        },
      ],
    },
    {
      path: '/data_v',
      name: 'dataV',
      component: () => import('@/views/DataVView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/404.vue'),
    },
  ],
})
menu.forEach((item) => {
  router.addRoute('home', {
    path: `test${item.id}`,
    name: `test${item.id}`,
    component: () => import(`@/views/test${item.id}View.vue`),
  })
})
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  if (token === null && to.name !== 'login') {
    next({ path: '/login' })
    return
  }
  else if (token && to.path === '/login') {
    next({ path: '/' })
    return
  }
  next()
})

export default router
