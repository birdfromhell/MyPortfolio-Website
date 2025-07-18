import { prisma } from '~/lib/prisma'
import { getClientIP } from '../../utils/request'

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event)
    
    if (method === 'GET') {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      
      // Get recent activity logs
      const logs = await prisma.activityLog.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      })
      
      // Get total count
      const total = await prisma.activityLog.count()
      
      return {
        success: true,
        logs,
        total,
        hasMore: offset + limit < total
      }
    }
    
    if (method === 'POST') {
      const body = await readBody(event)
      const { action, title, description, type = 'INFO', metadata } = body
      
      // Create new activity log
      const log = await prisma.activityLog.create({
        data: {
          action,
          title,
          description,
          type,
          ipAddress: getClientIP(event),
          userAgent: getHeader(event, 'user-agent'),
          metadata
        }
      })
      
      return {
        success: true,
        log
      }
    }
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
    
  } catch (error: any) {
    console.error('Activity log API error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
