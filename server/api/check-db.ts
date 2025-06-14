import { getDb, handleDbError } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const db = getDb();
    
    // Test the database connection
    const result = await db.query('SELECT NOW() as server_time');
    
    return {
      status: 'success',
      message: 'Database connection successful',
      server_time: result.rows[0].server_time,
      db_info: {
        // Safe info to return (tidak mengembalikan credential)
        connected: true,
        database: 'NeonDB PostgreSQL'
      }
    };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return handleDbError(error);
  }
});
