import { prisma } from '~/lib/prisma'
import { getClientIP, getUserAgent } from '../../utils/request'

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event)
    
    if (method === 'GET') {
      // Get current custom track from database
      const customTrack = await prisma.customTrack.findFirst({
        where: { id: 'default' }
      })
      
      return {
        success: true,
        customTrack
      }
    }
    
    if (method === 'POST') {
      const body = await readBody(event)
      const { enabled, title, artist, album, albumImageUrl, songUrl, isPlaying, duration } = body
      
      // Validate required fields
      if (enabled && (!title?.trim() || !artist?.trim())) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title and artist are required when enabling custom track'
        })
      }
      
      // Update custom track in database
      const customTrack = await prisma.customTrack.upsert({
        where: { id: 'default' },
        update: {
          enabled: enabled || false,
          title: title || '',
          artist: artist || '',
          album: album || '',
          albumImageUrl: albumImageUrl || '',
          songUrl: songUrl || '',
          isPlaying: isPlaying || false,
          duration: duration || 180
        },
        create: {
          id: 'default',
          enabled: enabled || false,
          title: title || '',
          artist: artist || '',
          album: album || '',
          albumImageUrl: albumImageUrl || '',
          songUrl: songUrl || '',
          isPlaying: isPlaying || false,
          duration: duration || 180
        }
      })
      
      // Log activity
      await prisma.activityLog.create({
        data: {
          action: 'custom_track_updated',
          title: enabled ? 'Custom Track Enabled' : 'Custom Track Disabled',
          description: enabled ? `Set custom track: "${title}" by ${artist}` : 'Disabled custom track, returned to Spotify sync',
          type: 'SUCCESS',
          ipAddress: getClientIP(event),
          userAgent: getUserAgent(event),
          metadata: {
            trackData: {
              title,
              artist,
              album,
              enabled
            }
          }
        }
      })
      
      return {
        success: true,
        customTrack
      }
    }
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
    
  } catch (error: any) {
    console.error('Custom track API error:', error)
    
    // Log error activity
    try {
      await prisma.activityLog.create({
        data: {
          action: 'custom_track_error',
          title: 'Custom Track Error',
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
