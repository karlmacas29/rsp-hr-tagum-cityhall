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
    await authStore.checkAuth()

    if (authStore.isAuthenticated && to.meta.guest) {
      return { name: 'Admin Dashboard' }
    }

    if (!authStore.isAuthenticated && to.meta.auth) {
      return { name: 'Admin Login' }
    }
  })
  // Global route guard
  // Router.beforeEach((to, from, next) => {
  //   const authStore = useAuthStore();

  //   // Check if the route requires authentication
  //   const requiresAuth = to.path.startsWith('/admin') || to.path.startsWith('/dashboard');

  //   if (requiresAuth) {
  //     authStore.checkAuth(); // Ensure the authentication state is updated

  //     if (authStore.isAuthenticated) {
  //       next(); // Allow access if authenticated
  //     } else {
  //       next('/'); // Redirect to login if not authenticated
  //     }
  //   } else {
  //     next(); // Allow access to public routes
  //   }
  // });

  return Router
})
