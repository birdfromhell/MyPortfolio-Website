import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed Settings
  await prisma.settings.upsert({
    where: { key: 'maintenance_mode' },
    update: {},
    create: {
      key: 'maintenance_mode',
      value: 'false',
      description: 'Enable/disable maintenance mode for the website'
    }
  })

  await prisma.settings.upsert({
    where: { key: 'site_title' },
    update: {},
    create: {
      key: 'site_title',
      value: 'Portfolio Website',
      description: 'Main title of the website'
    }
  })

  await prisma.settings.upsert({
    where: { key: 'admin_email' },
    update: {},
    create: {
      key: 'admin_email',
      value: 'admin@example.com',
      description: 'Administrator email address'
    }
  })

  // Seed Custom Track
  await prisma.customTrack.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      enabled: false,
      title: 'Example Song',
      artist: 'Example Artist',
      album: 'Example Album',
      albumImageUrl: 'https://via.placeholder.com/300',
      songUrl: 'https://open.spotify.com/track/example',
      isPlaying: false,
      duration: 180
    }
  })

  // Seed Activity Logs
  const activityLogs = [
    {
      action: 'system_startup',
      title: 'System Started',
      description: 'Admin panel system has been initialized',
      type: 'INFO' as const,
      ipAddress: '127.0.0.1',
      userAgent: 'System'
    },
    {
      action: 'admin_login',
      title: 'Admin Login',
      description: 'Administrator logged into the system',
      type: 'SUCCESS' as const,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (compatible; Admin)'
    },
    {
      action: 'database_seed',
      title: 'Database Seeded',
      description: 'Initial data has been seeded to the database',
      type: 'INFO' as const,
      ipAddress: '127.0.0.1',
      userAgent: 'Seeder'
    }
  ]

  for (const log of activityLogs) {
    await prisma.activityLog.create({
      data: log
    })
  }

  // Seed System Status
  await prisma.systemStatus.create({
    data: {
      cpuUsage: 45.5,
      memoryUsage: 62.3,
      diskUsage: 35.8,
      loadTime: 1.2,
      uptime: BigInt(Date.now() - (24 * 60 * 60 * 1000)), // 24 hours ago
      requests: 1234,
      errors: 2
    }
  })

  // Seed Analytics
  const today = new Date()
  const analytics = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    analytics.push({
      pageViews: Math.floor(Math.random() * 1000) + 500,
      visitors: Math.floor(Math.random() * 500) + 200,
      bounceRate: Math.random() * 0.5 + 0.2, // 20-70%
      avgSession: Math.random() * 300 + 120, // 2-7 minutes
      date: date
    })
  }

  for (const data of analytics) {
    await prisma.analytics.create({
      data
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
