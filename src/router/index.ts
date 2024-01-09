import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
        {
          path: 'test',
          name: 'test',
          component: () => import('@/views/testView.vue'),
        },
        {
          path: 'test2',
          name: 'test2',
          component: () => import('@/views/test2View.vue'),
        },
        {
          path: 'test3',
          name: 'test3',
          component: () => import('@/views/test3View.vue'),
        },
        {
          path: 'test4',
          name: 'test4',
          component: () => import('@/views/test4View.vue'),
        },
        {
          path: 'test5',
          name: 'test5',
          component: () => import('@/views/test5View.vue'),
        },
        {
          path: 'test6',
          name: 'test6',
          component: () => import('@/views/test6View.vue'),
        },
        {
          path: 'test7',
          name: 'test7',
          component: () => import('@/views/test7View.vue'),
        },
        {
          path: 'test8',
          name: 'test8',
          component: () => import('@/views/test8View.vue'),
        },
        {
          path: 'test9',
          name: 'test9',
          component: () => import('@/views/test9View.vue'),
        },
        {
          path: 'test10',
          name: 'test10',
          component: () => import('@/views/test10View.vue'),
        },
        {
          path: 'test11',
          name: 'test11',
          component: () => import('@/views/test11View.vue'),
        },
        {
          path: 'test12',
          name: 'test12',
          component: () => import('@/views/test12View.vue'),
        },
        {
          path: 'test13',
          name: 'test13',
          component: () => import('@/views/test13View.vue'),
        },
        {
          path: 'test14',
          name: 'test14',
          component: () => import('@/views/test14View.vue'),
        },
        {
          path: 'test15',
          name: 'test15',
          component: () => import('@/views/test15View.vue'),
        },
        {
          path: 'test16',
          name: 'test16',
          component: () => import('@/views/test16View.vue'),
        },
      ],
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
