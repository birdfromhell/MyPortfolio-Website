import { prisma } from '~/lib/prisma'
import { getClientIP } from '../../utils/request'

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event)
    
    if (method === 'GET') {
      // Get maintenance mode status from database
      const setting = await prisma.settings.findUnique({
        where: { key: 'maintenance_mode' }
      })
      
      const isEnabled = setting?.value === 'true'
      
      return {
        success: true,
        maintenance: isEnabled
      }
    }
    
    if (method === 'POST') {
      const body = await readBody(event)
      const { enabled } = body
      
      // Update maintenance mode setting
      await prisma.settings.upsert({
        where: { key: 'maintenance_mode' },
        update: { value: enabled ? 'true' : 'false' },
        create: {
          key: 'maintenance_mode',
          value: enabled ? 'true' : 'false',
          description: 'Enable/disable maintenance mode for the website'
        }
      })
      
      // Log activity
      await prisma.activityLog.create({
        data: {
          action: 'maintenance_mode_toggled',
          title: enabled ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled',
          description: enabled 
            ? 'Website is now in maintenance mode. Visitors will see maintenance page.' 
            : 'Website is back online. Normal operations resumed.',
          type: enabled ? 'WARNING' : 'SUCCESS',
          ipAddress: getClientIP(event) || getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown',
          userAgent: getHeader(event, 'user-agent') || 'unknown',
          metadata: {
            enabled,
            timestamp: new Date().toISOString()
          }
        }
      })
      
      return {
        success: true,
        maintenance: enabled
      }
    }
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
    
  } catch (error: any) {
    console.error('Maintenance mode API error:', error)
    
    // Log error activity
    try {
      await prisma.activityLog.create({
        data: {
          action: 'maintenance_mode_error',
          title: 'Maintenance Mode Error',
          description: error.message || 'Unknown error occurred',
          type: 'ERROR',
          ipAddress: getClientIP(event) || getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown',
          userAgent: getHeader(event, 'user-agent') || 'unknown',
          metadata: {
            error: error.message,
            stack: error.stack
          }
        }
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
