# Database Integration Guide

## 🗄️ Overview

Admin panel sekarang terintegrasi dengan NeonDB PostgreSQL untuk menyimpan data secara persisten. Semua aktivitas admin, custom tracks, maintenance mode, dan analytics disimpan dalam database untuk optimasi dan reliabilitas.

## 📊 Database Schema

### Tables

#### 1. **settings**

Menyimpan pengaturan sistem seperti maintenance mode.

```sql
- id: String (Primary Key)
- key: String (Unique)
- value: String
- description: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

#### 2. **custom_tracks**

Menyimpan informasi track Spotify kustom.

```sql
- id: String (Primary Key)
- enabled: Boolean
- title: String
- artist: String
- album: String (Optional)
- albumImageUrl: String (Optional)
- songUrl: String (Optional)
- isPlaying: Boolean
- duration: Integer
- createdAt: DateTime
- updatedAt: DateTime
```

#### 3. **activity_logs**

Menyimpan log aktivitas admin dan sistem.

```sql
- id: String (Primary Key)
- action: String
- title: String
- description: String (Optional)
- type: ActivityType (INFO, SUCCESS, WARNING, ERROR)
- ipAddress: String (Optional)
- userAgent: String (Optional)
- metadata: Json (Optional)
- createdAt: DateTime
```

#### 4. **system_status**

Menyimpan metrics performa sistem.

```sql
- id: String (Primary Key)
- cpuUsage: Float
- memoryUsage: Float
- diskUsage: Float
- loadTime: Float
- uptime: BigInt
- requests: Integer
- errors: Integer
- timestamp: DateTime
```

#### 5. **analytics**

Menyimpan data analytics website.

```sql
- id: String (Primary Key)
- pageViews: Integer
- visitors: Integer
- bounceRate: Float
- avgSession: Float
- date: DateTime
```

## 🔧 Setup Instructions

### 1. Database Setup

```bash
# Install dependencies
npm install prisma @prisma/client tsx

# Initialize Prisma (already done)
npx prisma init

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 2. Environment Variables

Pastikan `.env` sudah memiliki:

```env
DATABASE_URL=postgresql://your_connection_string
```

### 3. Database Scripts

Package.json sudah include scripts:

```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "npx prisma migrate reset --force",
    "db:generate": "npx prisma generate",
    "db:migrate": "npx prisma migrate dev"
  }
}
```

## 🚀 API Endpoints

### Custom Track Management

- `GET /api/admin/custom-track-db` - Get current custom track
- `POST /api/admin/custom-track-db` - Update custom track

### Maintenance Mode

- `GET /api/admin/maintenance` - Get maintenance status
- `POST /api/admin/maintenance` - Toggle maintenance mode

### Activity Logs

- `GET /api/admin/activity-logs` - Get recent activity logs
- `POST /api/admin/activity-logs` - Create new activity log

### System Status

- `GET /api/admin/system-status` - Get system metrics
- `POST /api/admin/system-status` - Update system metrics

### Analytics

- `GET /api/admin/analytics` - Get analytics data
- `POST /api/admin/analytics` - Create analytics entry

## 📝 Usage Examples

### Checking Custom Track Status

```typescript
const response = await $fetch("/api/admin/custom-track-db");
console.log(response.customTrack);
```

### Toggling Maintenance Mode

```typescript
await $fetch("/api/admin/maintenance", {
  method: "POST",
  body: { enabled: true },
});
```

### Getting Activity Logs

```typescript
const logs = await $fetch("/api/admin/activity-logs?limit=10&offset=0");
console.log(logs.logs);
```

## 🔄 Data Migration

### From File Storage to Database

Data existing dalam file storage akan tetap berfungsi, namun untuk menggunakan database:

1. **Custom Tracks**: Update komponen untuk menggunakan `/api/admin/custom-track-db`
2. **Maintenance Mode**: Update untuk menggunakan `/api/admin/maintenance`
3. **Activity Logs**: Replace static data dengan live database queries

### Component Updates

Gunakan komponen database baru:

```vue
<!-- Existing -->
<ActivityLogCard />

<!-- New Database Version -->
<ActivityLogCardDB />
```

## 📊 Benefits

### 1. **Data Persistence**

- Data tidak hilang saat restart server
- Backup otomatis melalui NeonDB
- Skalabilitas yang lebih baik

### 2. **Real-time Activity Tracking**

- Log semua aktivitas admin
- Track IP address dan user agent
- Metadata untuk debugging

### 3. **Analytics & Monitoring**

- Historical data untuk trend analysis
- System performance metrics
- User behavior insights

### 4. **Better Performance**

- Database indexing untuk query cepat
- Connection pooling
- Optimized queries

## 🛡️ Security

### 1. **Data Protection**

- All data encrypted in transit (SSL)
- NeonDB provides encryption at rest
- Environment variables untuk credentials

### 2. **Activity Logging**

- Semua aktivitas admin dicatat
- IP address tracking untuk audit
- Error logging untuk debugging

### 3. **Access Control**

- Database credentials dalam environment variables
- Rate limiting pada API endpoints
- Input validation dan sanitization

## 🔧 Maintenance

### Regular Tasks

1. **Database Cleanup**

```bash
# Clean old activity logs (older than 30 days)
DELETE FROM activity_logs WHERE created_at < NOW() - INTERVAL '30 days';
```

2. **Performance Monitoring**

```bash
# Check database size
SELECT pg_size_pretty(pg_database_size('portfolio'));
```

3. **Backup Verification**

```bash
# NeonDB handles backups automatically
# Verify backups in NeonDB dashboard
```

## 📈 Performance Optimization

### 1. **Query Optimization**

- Use proper indexes
- Limit result sets
- Use pagination for large datasets

### 2. **Caching Strategy**

- Cache frequently accessed data
- Use Redis for session storage
- Implement query result caching

### 3. **Connection Management**

- Use connection pooling
- Optimize connection timeouts
- Monitor connection usage

## 🚨 Troubleshooting

### Common Issues

1. **Connection Errors**

```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

2. **Migration Issues**

```bash
# Reset and re-migrate
npm run db:reset
npm run db:migrate
```

3. **Data Inconsistency**

```bash
# Re-seed database
npm run db:seed
```

### Logging

Enable detailed logging:

```typescript
// In your API handlers
console.log("Database operation:", { action, result });
```

## 📋 Next Steps

### Immediate

- [ ] Update all components to use database APIs
- [ ] Test all CRUD operations
- [ ] Verify data persistence

### Future Enhancements

- [ ] Implement real-time notifications
- [ ] Add data export functionality
- [ ] Create admin user management
- [ ] Add advanced analytics dashboard

---

## 🎯 Conclusion

Database integration memberikan foundation yang solid untuk admin panel dengan:

- **Reliability**: Data persistence yang terjamin
- **Scalability**: Ready untuk growth
- **Monitoring**: Comprehensive activity tracking
- **Performance**: Optimized queries dan caching

Admin panel sekarang production-ready dengan database backend yang robust!
