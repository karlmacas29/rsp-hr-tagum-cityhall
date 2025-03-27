import { useAuthStore } from 'src/stores/authStore';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore();
          authStore.checkAuth(); // Check if the user is authenticated

          if (authStore.isAuthenticated) {
            next(); // Allow access
          } else {
            next('/login'); // Redirect to login if not authenticated
          }
        },
      },
      { path: 'job-post', component: () => import('pages/JobPostPage.vue') },
      { path: 'plantilla', component: () => import('pages/PlantillaPage.vue') },
      { path: 'raters', component: () => import('pages/RatersPage.vue') },
      { path: 'reports', component: () => import('pages/ReportsPage.vue') },
      { path: 'activity-log', component: () => import('pages/ActivityLog.vue') },
      { path: 'criteria', component: () => import('pages/CriteriaRater.vue') },
      { path: 'settings', component: () => import('pages/SettingPage.vue') },
    ],
  },
  { path: '/login', component: () => import('pages/LogIn.vue') },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('layouts/ErrorPage.vue'),
  },
];

export default routes;
