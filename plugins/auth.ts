// This plugin ensures that auth is initialized on both client and server
import useAuth from '~/composables/auth/useAuth';

export default defineNuxtPlugin(() => {
  const auth = useAuth();
  
  // Initialize auth state
  auth.initAuth();
});
