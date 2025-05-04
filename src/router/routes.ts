export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/dashboard/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  // Fallback route for 404 pages
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
];
