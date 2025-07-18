# Admin Panel Documentation

## Overview

The admin panel provides a comprehensive management interface for your portfolio website. Built with modern UI/UX principles, it offers a clean, intuitive dashboard for managing various aspects of your website.

## Features

### 🎨 Modern Design

- **Glassmorphism UI**: Beautiful translucent cards with backdrop blur effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Seamless switching between light and dark themes
- **Smooth Animations**: Elegant transitions and hover effects

### 📊 Dashboard Overview

- **Welcome Section**: Personalized greeting with last login time
- **Quick Stats**: Real-time status indicators for system health
- **Status Cards**: Visual representation of website status, music mode, theme, and uptime
- **Activity Feed**: Recent actions and system events

### 🔧 System Management

#### Maintenance Mode

- **Toggle Control**: Enable/disable maintenance mode with a single click
- **Visual Feedback**: Clear indicators when maintenance mode is active
- **Smart Alerts**: Warning messages for active maintenance status
- **Visitor Protection**: Automatically shows maintenance page to visitors while preserving admin access

#### Security Features

- **Access Control**: Protected routes with authentication
- **Status Monitoring**: Real-time security status indicators
- **Activity Logging**: Track all admin actions and system events

### 🎵 Spotify Integration

#### Custom Track Manager

- **Song Search**: Search Spotify's catalog using RapidAPI integration
- **Auto-fill**: Click any search result to automatically populate track details
- **Manual Entry**: Add custom tracks manually if needed
- **Live Preview**: See how your custom track will appear before saving
- **Toggle Control**: Switch between custom tracks and live Spotify sync

#### Features

- **Search Functionality**: Find songs, artists, and albums instantly
- **Album Artwork**: Automatic album cover integration
- **Duration Display**: Show track length in MM:SS format
- **Play Status**: Control whether track shows as currently playing
- **URL Integration**: Link to actual Spotify tracks

### 📈 Analytics & Performance

#### System Status

- **Real-time Metrics**: Monitor server performance
- **Resource Usage**: Track CPU, memory, and storage utilization
- **Health Indicators**: Visual progress bars for system resources
- **Uptime Tracking**: Monitor website availability

#### Performance Monitoring

- **Load Times**: Track page performance metrics
- **Core Web Vitals**: Monitor Google's performance standards
- **SEO Scores**: Track search engine optimization metrics
- **User Analytics**: Basic visitor statistics

## Usage Guide

### Accessing the Admin Panel

1. Navigate to `/admin` in your browser
2. The admin panel is currently open access (no authentication required)
3. For production, consider adding authentication middleware

### Managing Maintenance Mode

1. **Enable Maintenance Mode**:

   - Click the toggle switch in the Maintenance Mode card
   - Website visitors will see the maintenance page
   - Admin panel remains accessible

2. **Disable Maintenance Mode**:
   - Click the toggle switch again
   - Website returns to normal operation
   - Visitors can access all pages

### Using Custom Spotify Tracks

1. **Search for Songs**:

   - Use the search box in the Custom Track Manager
   - Enter song title, artist, or album name
   - Click "Search" to find matching tracks

2. **Select a Track**:

   - Click on any search result
   - Track details will auto-fill in the form
   - Preview shows how it will appear

3. **Manual Entry**:

   - Fill in track details manually if needed
   - Required fields: Title and Artist
   - Optional: Album, Duration, Image URL, Song URL

4. **Enable Custom Track**:

   - Toggle the "Enable Custom Track" switch
   - This will override live Spotify sync
   - Custom track will appear in the Now Playing component

5. **Return to Spotify Sync**:
   - Toggle off the custom track
   - Live Spotify integration resumes

### Quick Actions

The admin panel includes several quick action buttons:

- **Clear Cache**: Refresh application cache
- **Backup Data**: Create system backup
- **View Logs**: Access system logs
- **Security Scan**: Run security checks

_Note: These are UI placeholders and can be connected to actual functionality as needed._

## Technical Implementation

### Components Structure

```
/components/
├── CustomTrackManager.vue    # Spotify custom track management
├── MaintenanceToggle.vue     # Maintenance mode controls
├── SystemStatusCard.vue      # System performance metrics
├── ActivityLogCard.vue       # Recent activity feed
└── [other components]
```

### API Endpoints

```
/server/api/
├── admin/
│   └── custom-track.ts       # Custom track management
├── spotify/
│   └── search.ts            # Spotify song search
├── maintenance.post.ts       # Maintenance mode toggle
└── [other endpoints]
```

### Data Storage

- **Custom Tracks**: Stored in `/storage/custom-track.json`
- **Maintenance Mode**: Environment variable in `.env`
- **Activity Logs**: In-memory (can be extended to persistent storage)

## Environment Variables

Add these to your `.env` file:

```env
# Maintenance Mode
MAINTENANCE_MODE=false

# Spotify Search (RapidAPI)
RAPIDAPI_KEY=your_rapidapi_key_here

# Optional: Add authentication
ADMIN_PASSWORD=your_admin_password
```

## Security Considerations

### Current State

- Admin panel is open access (no authentication)
- Suitable for development and personal use
- All admin actions are logged

### Recommended Enhancements

1. **Add Authentication**:

   - Implement login system
   - Use JWT tokens or session management
   - Add role-based access control

2. **Rate Limiting**:

   - Limit API requests
   - Prevent spam and abuse
   - Add CAPTCHA if needed

3. **Audit Logs**:
   - Persistent activity logging
   - User action tracking
   - Security event monitoring

## Customization

### Adding New Features

1. Create new components in `/components/`
2. Add API endpoints in `/server/api/`
3. Update the admin page layout
4. Document new features

### Styling

- Uses Tailwind CSS for styling
- Follows the existing design system
- Supports dark mode by default
- Responsive design principles

### Data Sources

- Analytics: Connect to Google Analytics, Plausible, or other services
- Performance: Integrate with monitoring tools
- Security: Add vulnerability scanning APIs

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: Requires JavaScript, supports modern CSS features

## Performance

- **Bundle Size**: Optimized for fast loading
- **Server-Side Rendering**: Full SSR support with Nuxt 3
- **API Response Times**: Cached responses where possible
- **Real-time Updates**: Efficient polling for status updates

## Troubleshooting

### Common Issues

1. **Maintenance Mode Not Working**:

   - Check `.env` file configuration
   - Verify API endpoint accessibility
   - Restart development server

2. **Spotify Search Not Working**:

   - Verify RapidAPI key configuration
   - Check API quota limits
   - Ensure network connectivity

3. **Custom Track Not Saving**:
   - Check file permissions for `/storage/`
   - Verify required fields are filled
   - Check browser console for errors

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
DEBUG=true
NUXT_DEBUG=true
```

## Future Enhancements

### Planned Features

- [ ] Content Management System
- [ ] User Management
- [ ] Advanced Analytics Dashboard
- [ ] File Upload Manager
- [ ] Email Newsletter Management
- [ ] SEO Tools Integration
- [ ] Performance Optimization Tools

### Integration Possibilities

- [ ] Google Analytics
- [ ] Plausible Analytics
- [ ] GitHub Integration
- [ ] Slack/Discord Notifications
- [ ] Email Services (SendGrid, Mailgun)
- [ ] CDN Management
- [ ] Database Administration

## Support

For issues, questions, or feature requests:

1. Check this documentation
2. Review the codebase
3. Check console logs for errors
4. Test in different browsers

## License

This admin panel is part of your portfolio website and follows the same licensing terms.
