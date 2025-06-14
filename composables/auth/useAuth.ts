// Define user interface for type safety
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Simple authentication composable for the learning management dashboard
export default function useAuth() {
  // Using useState to ensure the state is shared across the app
  // This makes it accessible in middleware, plugins, and components
  const user = useState<User | null>('auth:user', () => null);
  const isAuthenticated = computed(() => !!user.value);
  
  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would call an API endpoint
      if (email === 'admin@example.com' && password === 'password') {
        // Mock successful login
        user.value = {
          id: '1',
          name: 'Ababil',
          email,
          role: 'admin',
        };
        
        // Store in localStorage for persistent login
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user.value));
        }
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };
  
  const logout = () => {
    user.value = null;
    if (process.client) {
      localStorage.removeItem('user');
    }
    navigateTo('/login');
  };
  
  // Check if user is already logged in (from localStorage)
  const initAuth = () => {
    if (process.client && !user.value) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser);
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
    }
  };
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth
  };
}
