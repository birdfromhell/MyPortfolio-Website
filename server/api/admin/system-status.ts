import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event)
    
    if (method === 'GET') {
      // Get latest system status
      const systemStatus = await prisma.systemStatus.findFirst({
        orderBy: {
          timestamp: 'desc'
        }
      })
      
      // Convert BigInt to string for JSON serialization
      const serializedStatus = systemStatus ? {
        ...systemStatus,
        uptime: systemStatus.uptime.toString()
      } : null
      
      return {
        success: true,
        systemStatus: serializedStatus
      }
    }
    
    if (method === 'POST') {
      const body = await readBody(event)
      const { cpuUsage, memoryUsage, diskUsage, loadTime, uptime, requests, errors } = body
      
      // Create new system status entry
      const systemStatus = await prisma.systemStatus.create({
        data: {
          cpuUsage: cpuUsage || 0,
          memoryUsage: memoryUsage || 0,
          diskUsage: diskUsage || 0,
          loadTime: loadTime || 1.2,
          uptime: uptime || BigInt(Date.now()),
          requests: requests || 0,
          errors: errors || 0
        }
      })
      
      // Convert BigInt to string for JSON serialization
      const serializedStatus = {
        ...systemStatus,
        uptime: systemStatus.uptime.toString()
      }
      
      return {
        success: true,
        systemStatus: serializedStatus
      }
    }
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
    
  } catch (error: any) {
    console.error('System status API error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
