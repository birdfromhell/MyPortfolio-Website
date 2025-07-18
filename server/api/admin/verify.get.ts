import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export default defineEventHandler(async (event) => {
  try {
    // Get token from Authorization header or cookie
    const authHeader = getHeader(event, 'authorization')
    const cookies = parseCookies(event)
    const token = authHeader?.replace('Bearer ', '') || cookies['admin-auth']

    if (!token) {
      return { valid: false, message: 'No token provided' }
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    if (!decoded.admin) {
      return { valid: false, message: 'Invalid token' }
    }

    return {
      valid: true,
      user: {
        admin: true,
        authenticated: true,
        iat: decoded.iat,
        exp: decoded.exp
      }
    }

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, message: 'Token expired' }
    }
    
    if (error.name === 'JsonWebTokenError') {
      return { valid: false, message: 'Invalid token' }
    }

    return { valid: false, message: 'Authentication failed' }
  }
})
