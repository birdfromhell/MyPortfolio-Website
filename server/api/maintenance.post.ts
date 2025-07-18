import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST requests
    if (event.node.req.method !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // Get the request body
    const body = await readBody(event)
    const { enabled } = body

    if (typeof enabled !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body'
      })
    }

    // Path to .env file
    const envPath = join(process.cwd(), '.env')
    
    try {
      // Read current .env file
      let envContent = readFileSync(envPath, 'utf-8')
      
      // Update or add MAINTENANCE setting
      const maintenanceRegex = /^MAINTENANCE=.*$/m
      const newMaintenanceValue = `MAINTENANCE=${enabled ? 'true' : 'false'}`
      
      if (maintenanceRegex.test(envContent)) {
        // Replace existing MAINTENANCE setting
        envContent = envContent.replace(maintenanceRegex, newMaintenanceValue)
      } else {
        // Add MAINTENANCE setting
        envContent += `\n${newMaintenanceValue}\n`
      }
      
      // Write updated content back to .env file
      writeFileSync(envPath, envContent)
      
      return {
        success: true,
        message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}. Please restart the application for changes to take effect.`,
        maintenanceMode: enabled
      }
      
    } catch (fileError) {
      // If .env file doesn't exist, create it
      if ((fileError as any).code === 'ENOENT') {
        const newEnvContent = `MAINTENANCE=${enabled ? 'true' : 'false'}\n`
        writeFileSync(envPath, newEnvContent)
        
        return {
          success: true,
          message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}. .env file created. Please restart the application for changes to take effect.`,
          maintenanceMode: enabled
        }
      }
      
      throw fileError
    }
    
  } catch (error) {
    console.error('Error toggling maintenance mode:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})
