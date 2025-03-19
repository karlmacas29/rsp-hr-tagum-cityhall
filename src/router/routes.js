const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' }, // 👈 Add this line to auto-redirect
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'applicants', component: () => import('pages/ApplicantsPage.vue') },
      { path: 'plantilla', component: () => import('pages/PlantillaPage.vue') },
      { path: 'raters', component: () => import('pages/RatersPage.vue') },
      { path: 'job-posts', component: () => import('pages/JobPost.vue') },
      { path: 'reports', component: () => import('pages/ReportsPage.vue') },
      { path: 'activity-log', component: () => import('pages/ActivityLog.vue') },
    ],
  },
  { path: '/login', component: () => import('pages/LogIn.vue') },
  // 404 Page
  {
    path: '/:pathMatch(.*)*',
    component: () => import('layouts/ErrorPage.vue'),
  },
]

export default routes
