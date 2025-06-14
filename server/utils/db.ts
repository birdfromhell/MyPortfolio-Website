import { Pool } from 'pg';
import { createError } from 'h3';

// Create a PostgreSQL connection pool for NeonDB
let pool: Pool;

export function getDb() {
  if (!pool) {
    // Get configuration from environment variables
    const config = useRuntimeConfig();
    const connectionString = config.databaseUrl;
    
    // Check if connection string is available
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined. Please set it in your .env file or environment variables.');
    }
    
    // Create connection pool
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Required for NeonDB
      }
    });
    
    // Test connection and initialize database
    initializeDatabase().catch(err => {
      console.error('Failed to initialize database:', err);
    });
  }
  
  return pool;
}

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  const db = getDb();
  
  try {
    // Create categories table
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        color VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create courses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        platform VARCHAR(100),
        author VARCHAR(100),
        url TEXT,
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create topics table (learning items within courses or standalone)
    await db.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'not_done', -- not_done, in_progress, done
        priority INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper to handle database errors
export function handleDbError(error: any) {
  console.error('Database error:', error);
  return createError({
    statusCode: 500,
    message: 'Database error occurred',
    stack: ''
  });
}
