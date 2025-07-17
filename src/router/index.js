import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/authStore'
import { useRaterAuthStore } from 'src/stores/authStore_raters'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const raterAuthStore = useRaterAuthStore()

    // Check if route requires authentication
    if (to.meta.auth) {
      // Admin routes
      if (to.meta.role === 'admin') {
        await authStore.checkAuth()
        if (!authStore.isAuthenticated) {
          return { name: 'Admin Login' }
        }
      }
      // Rater routes
      else if (to.meta.role === 'rater') {
        await raterAuthStore.checkAuth()
        if (!raterAuthStore.isAuthenticated) {
          return { name: 'Rater Login' }
        }
      }
    }

    // Check guest routes (login pages)
    if (to.meta.guest) {
      // Admin login page
      if (to.meta.role === 'admin') {
        await authStore.checkAuth()
        if (authStore.isAuthenticated) {
          return { name: 'Admin Dashboard' }
        }
      }
      // Rater login page
      else if (to.meta.role === 'rater') {
        await raterAuthStore.checkAuth()
        if (raterAuthStore.isAuthenticated) {
          return { name: 'Raters Homepage' }
        }
      }
    }

    // No redirection needed
    return true
  })

  return Router
})
