import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event)
    
    if (method === 'GET') {
      const query = getQuery(event)
      const days = parseInt(query.days as string) || 7
      
      // Get analytics data for the last N days
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const analytics = await prisma.analytics.findMany({
        where: {
          date: {
            gte: startDate
          }
        },
        orderBy: {
          date: 'desc'
        }
      })
      
      // Calculate totals
      const totals = {
        totalPageViews: analytics.reduce((sum, a) => sum + a.pageViews, 0),
        totalVisitors: analytics.reduce((sum, a) => sum + a.visitors, 0),
        avgBounceRate: analytics.length > 0 ? analytics.reduce((sum, a) => sum + a.bounceRate, 0) / analytics.length : 0,
        avgSessionDuration: analytics.length > 0 ? analytics.reduce((sum, a) => sum + a.avgSession, 0) / analytics.length : 0
      }
      
      return {
        success: true,
        analytics,
        totals,
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString()
        }
      }
    }
    
    if (method === 'POST') {
      const body = await readBody(event)
      const { pageViews, visitors, bounceRate, avgSession, date } = body
      
      // Create new analytics entry
      const analytics = await prisma.analytics.create({
        data: {
          pageViews: pageViews || 0,
          visitors: visitors || 0,
          bounceRate: bounceRate || 0,
          avgSession: avgSession || 0,
          date: date ? new Date(date) : new Date()
        }
      })
      
      return {
        success: true,
        analytics
      }
    }
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
    
  } catch (error: any) {
    console.error('Analytics API error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
