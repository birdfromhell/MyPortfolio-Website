import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export default defineEventHandler(async (event) => {
  // Only protect admin routes
  if (!event.node.req.url?.startsWith('/api/admin/') || event.node.req.url === '/api/admin/auth') {
    return
  }

  try {
    // Get token from cookie or Authorization header
    const cookies = parseCookies(event)
    const token = cookies['admin-auth'] || getHeader(event, 'authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    if (!decoded.admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid authentication'
      })
    }

    // Add admin info to event context
    event.context.admin = decoded

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication expired'
      })
    }
    
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid authentication'
      })
    }

    throw error
  }
})
