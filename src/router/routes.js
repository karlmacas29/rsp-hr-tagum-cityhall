

const routes = [
  { path: '/', component: () => import('pages/admin/LogIn.vue') },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' }, // 👈 Add this line to auto-redirect
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
  // 404 Page
  {
    path: '/:pathMatch(.*)*',
    component: () => import('layouts/ErrorPage.vue'),
  },
];

export default routes;
