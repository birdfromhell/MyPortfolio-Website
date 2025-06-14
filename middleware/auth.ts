import useAuth from '~/composables/auth/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();
  
  // If not authenticated and trying to access a protected route
  if (!isAuthenticated.value && to.path.startsWith('/dashboard')) {
    return navigateTo('/login');
  }
  
  // If authenticated and trying to access login page
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/dashboard');
  }
});
