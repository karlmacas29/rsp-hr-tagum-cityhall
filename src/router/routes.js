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
        path: '/applicant',
        name: 'Applicant List',
        component: () => import('pages/admin/ApplicantPage.vue'),
        meta: { auth: true, role: 'admin' },
      },

      {
        path: '/schedule',
        name: 'Schedule List',
        component: () => import('pages/admin/SchedulePage.vue'),
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
        component: () => import('src/components/Reports/CertificationReport.vue'),
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
        path: '/criteria/sg',
        name: 'SG Criteria',
        component: () => import('pages/admin/CriteriaSG.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/settings',
        name: 'Admin Settings',
        component: () => import('pages/admin/SettingPage.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/dashboard/status/:title/:name',
        name: 'Dashboard Status',
        component: () => import('pages/admin/Dashboard/StatusPageView.vue'),
        meta: { auth: true, role: 'admin' },
      },
      {
        path: '/job-post/view/:id',
        name: 'JobPost View',
        component: () => import('pages/admin/job_post/ViewJobDetails.vue'),
        meta: { auth: true, role: 'admin' },
      },
    ],
  },

  // PDF report route
  {
    path: '/rater-management/reports/appointment-pdf',
    name: 'Appointment PDF',
    component: () => import('pages/admin/job_post/AppointmentPDF.vue'),
    meta: { auth: true, role: 'admin' },
  },

  // User Login Route (root path)
  {
    path: '/',
    name: 'Email',
    component: () => import('pages/user/UserLogin.vue'),
    meta: {
      guest: true,
      role: 'user',
    },
  },

  // User Routes (Protected) - FIXED PATHS
  {
    path: '/home',
    component: () => import('layouts/UserMainLayout.vue'),
    meta: {
      auth: true,
      role: 'user',
    },
    children: [
      {
        path: '/page',
        name: 'Homepage',
        component: () => import('pages/user/UserHomePage.vue'),
        meta: {
          auth: true,
          role: 'user',
        },
      },
      {
        path: 'jobList', // Changed from '/jobList' to 'job-list' (relative path)
        name: 'Joblist',
        component: () => import('pages/user/UserJobList.vue'),
        meta: {
          auth: true,
          role: 'user',
        },
      },
      {
        path: '/jobList/details/:id',
        name: 'Joblist Details',
        component: () => import('pages/user/ViewJobDetails.vue'),
        meta: {
          auth: true,
          role: 'user',
        },
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
    component: () => import('layouts/RatersLayout.vue'),
    meta: { auth: true, role: 'rater' },
    children: [
      {
        path: '', // Changed from '/uRater' to empty string
        name: 'Raters Homepage',
        meta: { auth: true, role: 'rater' },
        component: () => import('pages/rater/RatersHomepage.vue'),
      },
      {
        path: '/uCriteria', // Changed from '/uCriteria' to relative path
        name: 'Raters Criteria',
        meta: { auth: true, role: 'rater' },
        component: () => import('pages/rater/RatersCriteria.vue'),
      },
      {
        path: 'settings', // Changed from '/rater/settings' to relative path
        name: 'rater Settings',
        component: () => import('../components/Rater/Settings.vue'),
        meta: { auth: true, role: 'rater' },
      },
    ],
  },

  // Error routes
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/ErrorPage.vue'),
  },
];

export default routes;
