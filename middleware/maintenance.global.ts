export default defineNuxtRouteMiddleware(async (to, from) => {
  // Check if maintenance mode is enabled from database
  try {
    const response = await $fetch('/api/admin/maintenance', {
      method: 'GET'
    }) as { success: boolean; maintenance: boolean }
    
    const isMaintenanceMode = response?.maintenance === true
    
    // Routes that should be excluded from maintenance mode
    const excludedRoutes = ['/maintenance', '/admin']
    
    // Check if current route is excluded
    const isExcludedRoute = excludedRoutes.some(route => to.path.startsWith(route))
    
    // Allow access to excluded routes
    if (isExcludedRoute) {
      // If trying to access maintenance page when maintenance is disabled, redirect to home
      if (to.path === '/maintenance' && !isMaintenanceMode) {
        return navigateTo('/')
      }
      return
    }
    
    // If maintenance mode is enabled, redirect all other routes to maintenance page
    if (isMaintenanceMode) {
      return navigateTo('/maintenance')
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error)
    // On error, don't redirect (fail open)
  }
})
