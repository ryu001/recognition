import { createWebHistory, createRouter } from 'vue-router'
import { RouteRecordRaw } from 'vue-router'
import { getUserFromLocalStorage } from '@/utils/util'

import Login from './views/Login.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '',
    component: Login,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./views/Dashboard.vue'),
    beforeEnter: () => {
      // token
      if (!window.localStorage.getItem('user_token')) router.push('/login')
      // user info stored in local storage
      if (!getUserFromLocalStorage()) router.push('/login')
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
