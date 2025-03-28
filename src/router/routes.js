import { useAuthStore } from 'src/stores/authStore';

const routes = [
  { path: '/', component: () => import('pages/admin/LogIn.vue') },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      authStore.checkAuth(); // Ensure the authentication state is updated

      if (authStore.isAuthenticated) {
        next(); // Allow access if authenticated
      } else {
        next('/'); // Redirect to login if not authenticated
      }
    },
    children: [
      { path: '/dashboard', component: () => import('pages/admin/DashboardPage.vue') },
      { path: '/job-post', component: () => import('pages/admin/JobPostPage.vue') },
      { path: '/plantilla', component: () => import('pages/admin/PlantillaPage.vue') },
      { path: '/raters', component: () => import('pages/admin/RatersPage.vue') },
      { path: '/reports', component: () => import('pages/admin/ReportsPage.vue') },
      { path: '/activity-log', component: () => import('pages/admin/ActivityLog.vue') },
      { path: '/criteria', component: () => import('pages/admin/CriteriaRater.vue') },
      { path: '/settings', component: () => import('pages/admin/SettingPage.vue') },
    ],
  },
  { path: '/user-rater', component: () => import('pages/rater/LoginRaterPage.vue') },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('layouts/ErrorPage.vue'),
  },
];

export default routes;
