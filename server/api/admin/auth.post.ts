import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Environment variables with defaults
const ADMIN_PIN = process.env.ADMIN_PIN || '123456' // Change this in production!
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

// Rate limiting - simple in-memory store (use Redis in production)
const attemptStore = new Map<string, { count: number; lastAttempt: number }>()

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST requests
    if (event.node.req.method !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      })
    }

    const body = await readBody(event)
    const { pin } = body

    if (!pin) {
      throw createError({
        statusCode: 400,
        statusMessage: 'PIN is required'
      })
    }

    // Get client IP for rate limiting
    const clientIP = getClientIP(event) || 'unknown'

    // Check rate limiting
    const attempts = attemptStore.get(clientIP)
    const now = Date.now()
    const maxAttempts = 5
    const lockoutPeriod = 30 * 1000 // 30 seconds

    if (attempts) {
      // Reset attempts if lockout period has passed
      if (now - attempts.lastAttempt > lockoutPeriod && attempts.count >= maxAttempts) {
        attemptStore.delete(clientIP)
      } else if (attempts.count >= maxAttempts) {
        throw createError({
          statusCode: 429,
          statusMessage: `Too many attempts. Try again in ${Math.ceil((lockoutPeriod - (now - attempts.lastAttempt)) / 1000)} seconds`
        })
      }
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(pin)) {
      // Record failed attempt
      recordFailedAttempt(clientIP, attemptStore)
      throw createError({
        statusCode: 400,
        statusMessage: 'PIN must be 6 digits'
      })
    }

    // Check PIN
    if (pin !== ADMIN_PIN) {
      // Record failed attempt
      recordFailedAttempt(clientIP, attemptStore)
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid PIN'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        admin: true, 
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      JWT_SECRET
    )

    // Clear failed attempts on successful auth
    attemptStore.delete(clientIP)

    // Log successful authentication (optional)
    console.log(`[${new Date().toISOString()}] Admin authentication successful from IP: ${clientIP}`)

    return {
      success: true,
      token,
      message: 'Authentication successful'
    }

  } catch (error: any) {
    // Log failed authentication attempts
    const clientIP = getClientIP(event) || 'unknown'
    console.log(`[${new Date().toISOString()}] Failed admin authentication from IP: ${clientIP} - ${error.statusMessage}`)

    throw error
  }
})

// Helper function to record failed attempts
function recordFailedAttempt(clientIP: string, store: Map<string, { count: number; lastAttempt: number }>) {
  const now = Date.now()
  const attempts = store.get(clientIP) || { count: 0, lastAttempt: 0 }
  
  // Reset count if more than lockout period has passed
  if (now - attempts.lastAttempt > 30 * 1000) {
    attempts.count = 0
  }
  
  attempts.count++
  attempts.lastAttempt = now
  store.set(clientIP, attempts)
}
