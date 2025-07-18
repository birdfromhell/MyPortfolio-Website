# Maintenance Mode Feature

This feature allows you to easily enable/disable a maintenance mode for your website. When maintenance mode is active, all visitors will be redirected to a maintenance page.

## Setup

### 1. Environment Configuration

Add the following to your `.env` file:

```bash
# Maintenance Mode
# Set to "true" to enable maintenance mode, "false" to disable
MAINTENANCE=false
```

### 2. Files Created

The maintenance mode feature consists of several files:

- `pages/maintenance.vue` - The maintenance page visitors will see
- `middleware/maintenance.global.ts` - Global middleware that handles redirects
- `components/MaintenanceToggle.vue` - Admin component for toggling maintenance mode
- `server/api/maintenance.post.ts` - API endpoint for updating maintenance mode
- `pages/admin.vue` - Admin dashboard page

## Usage

### Method 1: Environment Variable (Manual)

1. Edit your `.env` file:

   ```bash
   MAINTENANCE=true  # Enable maintenance mode
   # or
   MAINTENANCE=false # Disable maintenance mode
   ```

2. Restart your application for changes to take effect.

### Method 2: Admin Dashboard (Recommended)

1. Visit `/admin` in your browser
2. Use the maintenance toggle switch
3. Restart your application when prompted

## Features

### Maintenance Page Features

- **Responsive Design**: Works on all devices
- **Dark Mode Support**: Automatically adapts to user preferences
- **Internationalization**: Supports multiple languages
- **Progress Tracking**: Shows simulated progress
- **Status Updates**: Displays maintenance progress updates
- **Contact Information**: Easy access to support channels
- **SEO Optimized**: Proper meta tags and no-index directives

### Admin Dashboard Features

- **Visual Toggle**: Easy-to-use switch for enabling/disabling maintenance mode
- **Status Indicators**: Clear visual feedback on current mode
- **API Integration**: Automatically updates `.env` file
- **Instructions**: Step-by-step guide for usage
- **Environment Variables**: Reference for manual configuration
- **Always Accessible**: Admin routes remain accessible even during maintenance mode

## How It Works

1. **Global Middleware**: The `maintenance.global.ts` middleware runs on every route
2. **Environment Check**: Checks if `MAINTENANCE=true` in environment variables
3. **Redirect Logic**: Redirects all routes to `/maintenance` when enabled
4. **Excluded Routes**: Admin routes (`/admin`) and maintenance page (`/maintenance`) are always accessible
5. **Exception Handling**: Allows access to excluded routes even during maintenance
6. **Admin Override**: Provides admin interface for easy toggling

## Customization

### Maintenance Page

Edit `pages/maintenance.vue` to customize:

- **Messaging**: Update titles and descriptions
- **Styling**: Modify colors, fonts, and layout
- **Contact Info**: Update email and social media links
- **Progress**: Adjust progress simulation logic
- **Status Updates**: Modify maintenance updates

### Admin Dashboard

Edit `pages/admin.vue` to customize:

- **Access Control**: Add authentication if needed
- **Styling**: Match your admin theme
- **Features**: Add additional admin controls

## API Reference

### POST `/api/maintenance`

Toggles maintenance mode by updating the `.env` file.

**Request Body:**

```json
{
  "enabled": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Maintenance mode enabled. Please restart the application for changes to take effect.",
  "maintenanceMode": true
}
```

## Production Considerations

1. **Security**: Secure the admin dashboard with authentication
2. **Caching**: Clear CDN/proxy caches when toggling maintenance mode
3. **Monitoring**: Set up alerts for when maintenance mode is enabled
4. **Backup**: Backup your `.env` file before making changes
5. **Documentation**: Inform your team about the maintenance process

## Troubleshooting

### Common Issues

1. **Changes not taking effect**: Restart the application after toggling
2. **Cannot access admin**: Check if middleware is blocking the route
3. **API errors**: Ensure file permissions allow writing to `.env`
4. **Infinite redirects**: Verify middleware logic and environment variables

### Debug Steps

1. Check current environment variable: `echo $MAINTENANCE`
2. Verify `.env` file contents
3. Check application logs for middleware errors
4. Test with browser in incognito mode

## Examples

### Basic Usage

```bash
# Enable maintenance mode
MAINTENANCE=true

# Disable maintenance mode
MAINTENANCE=false
```

### With Additional Config

```bash
# .env file
MAINTENANCE=true
MAINTENANCE_MESSAGE="We're upgrading our servers for better performance"
MAINTENANCE_ESTIMATED_TIME="2 hours"
```

This maintenance mode feature provides a professional and user-friendly way to manage website maintenance periods while keeping visitors informed and engaged.
