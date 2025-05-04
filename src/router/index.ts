import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { routes } from '@/router/routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

// Navigation guard to check authentication before accessing routes
router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth !== false; // Default to true if not specified

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    // Redirect to dashboard if already authenticated and trying to access login
    next({ name: 'dashboard' });
  } else {
    next(); // Proceed to the route
  }
});

export default router;
