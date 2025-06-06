import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/authStore'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    let pathName

    switch (to.name) {
      case 'Admin':
        pathName = 'Admin'
        break
      case 'Admin Dashboard':
        pathName = 'Admin Dashboard'
        break
      case 'Admin JobPost':
        pathName = 'Admin JobPost'
        break
      case 'Admin Plantilla':
        pathName = 'Admin Plantilla'
        break
      case 'Admin Raters':
        pathName = 'Admin Raters'
        break
      case 'Admin Report Raters':
        pathName = 'Admin Report Raters'
        break
      case 'Admin Activity Log':
        pathName = 'Admin Activity Log'
        break
      case 'Admin Raters Criteria':
        pathName = 'Admin Raters Criteria'
        break
      case 'Admin Settings':
        pathName = 'Admin Settings'
        break
      default:
        pathName = 'Admin'
        break
    }

    // Only check authentication for specific routes
    if (to.name === pathName || to.name === 'Admin Login') {
      await authStore.checkAuth()
      if (authStore.isAuthenticated && to.meta.guest) {
        return { name: 'Admin Dashboard' }
      }

      if (!authStore.isAuthenticated && to.meta.auth) {
        return { name: 'Admin Login' }
      }
    }
  })

  return Router
})
