export const useAdminAuth = () => {
  // Auth state
  const isAuthenticated = ref(false)
  const isLoading = ref(true)
  const user = ref(null)

  // Auth cookie
  const authCookie = useCookie('admin-auth', {
    default: () => null,
    maxAge: 60 * 60 * 24, // 24 hours
    secure: true,
    sameSite: 'strict'
  })

  // Check authentication status
  const checkAuth = async () => {
    try {
      isLoading.value = true
      
      if (!authCookie.value) {
        isAuthenticated.value = false
        return false
      }

      // Verify token with server
      const response = await $fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${authCookie.value}`
        }
      })

      if (response.valid) {
        isAuthenticated.value = true
        user.value = response.user
        return true
      } else {
        // Invalid token, clear it
        logout()
        return false
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Login function
  const login = (token: string) => {
    authCookie.value = token
    isAuthenticated.value = true
  }

  // Logout function
  const logout = () => {
    authCookie.value = null
    isAuthenticated.value = false
    user.value = null
    
    // Redirect to login
    if (process.client) {
      navigateTo('/admin/login')
    }
  }

  // Initialize auth state
  onMounted(async () => {
    await checkAuth()
  })

  // Watch for cookie changes
  watch(authCookie, (newValue) => {
    if (!newValue) {
      isAuthenticated.value = false
      user.value = null
    }
  })

  return {
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    user: readonly(user),
    login,
    logout,
    checkAuth
  }
}
