import type { H3Event } from 'h3'
import { getHeader } from 'h3'

/**
 * Get client IP address from various headers
 * @param event H3Event object
 * @returns Client IP address or 'unknown'
 */
export function getClientIP(event: H3Event): string {
  // Try various headers that might contain the real client IP
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'true-client-ip',   // Cloudflare Enterprise
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ]

  for (const header of headers) {
    const value = getHeader(event, header)
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim()
      if (ip && ip !== 'unknown') {
        return ip
      }
    }
  }

  // Fallback to connection remote address
  try {
    const remoteAddress = event.node.req.socket?.remoteAddress
    if (remoteAddress) {
      // Remove IPv6 prefix if present
      return remoteAddress.replace(/^::ffff:/, '')
    }
  } catch (error) {
    console.warn('Could not get remote address:', error)
  }

  return 'unknown'
}

/**
 * Get user agent from request headers
 * @param event H3Event object
 * @returns User agent string or 'unknown'
 */
export function getUserAgent(event: H3Event): string {
  return getHeader(event, 'user-agent') || 'unknown'
}

/**
 * Get comprehensive request info for logging
 * @param event H3Event object
 * @returns Object with IP, user agent, and other request info
 */
export function getRequestInfo(event: H3Event) {
  return {
    ip: getClientIP(event),
    userAgent: getUserAgent(event),
    method: getMethod(event),
    url: getRequestURL(event).pathname,
    timestamp: new Date().toISOString(),
    referer: getHeader(event, 'referer') || null,
    acceptLanguage: getHeader(event, 'accept-language') || null
  }
}
