const routes = [
  // Admin Routes
  {
    path: '/login',
    name: 'Admin Login',
    meta: { guest: true, role: 'admin' },
    component: () => import('pages/admin/LogIn.vue'),
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    name: 'Admin',
    meta: { auth: true, role: 'admin' },
    children: [
      {
        path: '/dashboard',
        name: 'Admin Dashboard',
        component: () => import('pages/admin/DashboardPage.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/job-post',
        name: 'Admin JobPost',
        component: () => import('pages/admin/JobPostPage.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/plantilla',
        name: 'Admin Plantilla',
        component: () => import('pages/admin/PlantillaPage.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/raters',
        name: 'Admin Raters',
        component: () => import('pages/admin/RatersPage.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/reports',
        name: 'Admin Report Raters',
        component: () => import('pages/admin/ReportsPage.vue'),
        // component: () => import('src/components/Reports/CertificationReport.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/activity-log',
        name: 'Admin Activity Log',
        component: () => import('pages/admin/ActivityLog.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/user-access',
        name: 'Admin User Management',
        component: () => import('pages/admin/UserManagement.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/criteria',
        name: 'Admin Raters Criteria',
        component: () => import('pages/admin/CriteriaRater.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/settings',
        name: 'Admin Settings',
        component: () => import('pages/admin/SettingPage.vue'),
        meta: { auth: true, role: 'admin' },
      },
      // page in a page
      {
        path: '/dashboard/status/:title/:name',
        name: 'Dashboard Status',
        component: () => import('pages/admin/Dashboard/StatusPageView.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/job-post/view/:PositionID/:ItemNo',
        name: 'JobPost View',
        component: () => import('pages/admin/job_post/ViewJobDetails.vue'),
        meta: { auth: true, role: 'admin' },
      },
    ],
  },

  // PDF report route - separate from main layout for viewing in new tab
  {
    path: '/rater-management/reports/appointment-pdf',
    name: 'Appointment PDF',
    component: () => import('pages/admin/job_post/AppointmentPDF.vue'),
    meta: { auth: true, role: 'admin' },
  },

  // User Routes
  {
    path: '/home',
    name: 'Userpage',
    component: () => import('layouts/UserMainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Homepage',
        component: () => import('pages/user/UserHomePage.vue'),
      },
      {
        path: '/jobList',
        name: 'Joblist',
        component: () => import('pages/user/UserJobList.vue'),
      },
      {
        path: '/jobList/details/:PositionID/:ItemNo',
        name: 'Joblist Details',
        component: () => import('pages/user/ViewJobDetails.vue'),
      },
    ],
  },

  // Rater Routes
  {
    path: '/rater-acc',
    name: 'Rater Login',
    meta: { guest: true, role: 'rater' },
    component: () => import('pages/rater/LoginRaterPage.vue'),
  },
  {
    path: '/uRater',
    name: 'Rater Dashboard',
    meta: { auth: true, role: 'rater' },
    component: () => import('layouts/RatersLayout.vue'),
    children: [
      {
        path: '/uRater',
        name: 'Raters Homepage',
        meta: { auth: true, role: 'rater' },
        component: () => import('pages/rater/RatersHomepage.vue'),
      },
      {
        path: '/uCriteria',
        name: 'Raters Criteria',
        meta: { auth: true, role: 'rater' },
        component: () => import('pages/rater/RatersCriteria.vue'),
      },
      {
        path: '/rater/settings',
        name: 'rater Settings',
        component: () => import('../components/Rater/Settings.vue'),
        meta: { auth: true, role: 'rater' },
      },
    ],
  },

  //error routes
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/ErrorPage.vue'),
  },
];

export default routes;
