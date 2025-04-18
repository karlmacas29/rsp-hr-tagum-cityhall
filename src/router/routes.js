const routes = [
  {
    path: '/',
    name: 'Admin Login',
    meta: { guest: true },
    component: () => import('pages/admin/LogIn.vue'),
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    name: 'Admin',
    meta: { auth: true },
    children: [
      {
        path: '/dashboard',
        name: 'Admin Dashboard',
        component: () => import('pages/admin/DashboardPage.vue'),
      },
      {
        path: '/job-post',
        name: 'Admin JobPost',
        component: () => import('pages/admin/JobPostPage.vue'),
      },
      {
        path: '/plantilla',
        name: 'Admin Plantilla',
        component: () => import('pages/admin/PlantillaPage.vue'),
      },
      {
        path: '/raters',
        name: 'Admin Raters',
        component: () => import('pages/admin/RatersPage.vue'),
      },
      {
        path: '/reports',
        name: 'Admin Report Raters',
        component: () => import('pages/admin/ReportsPage.vue'),
      },
      {
        path: '/activity-log',
        name: 'Admin Activity Log',
        component: () => import('pages/admin/ActivityLog.vue'),
      },
      {
        path: '/criteria',
        name: 'Admin Raters Criteria',
        component: () => import('pages/admin/CriteriaRater.vue'),
      },
      {
        path: '/settings',
        name: 'Admin Settings',
        component: () => import('pages/admin/SettingPage.vue'),
      },
      // page in a page
      {
        path: '/dashboard/status/:name',
        name: 'Dashboard Status',
        component: () => import('pages/admin/Dashboard/StatusPageView.vue'),
      },
    ],
  },
  {
    path: '/home',
    name: 'Userpage',
    component: () => import('layouts/UserMainLayout.vue'),
    children: [
      {
        path: '/home',
        name: 'Homepage',
        component: () => import('pages/user/UserHomePage.vue'),
      },
      {
        path: '/jobList',
        name: 'Joblist',
        component: () => import('pages/user/UserJobList.vue'),
      },
      {
        path: '/jobList/details/:id',
        name: 'Joblist Details',
        component: () => import('pages/user/ViewJobDetails.vue'),
      },
    ],
  },
  {
    path: '/user-rater',
    name: 'Rater Login',
    meta: { guest: true },
    component: () => import('pages/rater/LoginRaterPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/ErrorPage.vue'),
  },
]

export default routes
