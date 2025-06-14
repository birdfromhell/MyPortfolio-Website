import { getDb, handleDbError } from '~/server/utils/db';
import { z } from 'zod';

// Schema for category validation
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  color: z.string().optional()
});

export default defineEventHandler(async (event) => {
  try {
    // Handle GET, POST, PUT, DELETE requests
    const method = event.node.req.method;
    const db = getDb();
    
    switch (method) {
      case 'GET':
        // Get all categories with progress stats
        const { rows: categories } = await db.query(`
          SELECT 
            c.*, 
            COUNT(DISTINCT t.id) as total_topics,
            COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_topics
          FROM categories c
          LEFT JOIN topics t ON t.category_id = c.id
          GROUP BY c.id
          ORDER BY c.name ASC
        `);
        
        // Calculate progress percentage for each category
        const categoriesWithProgress = categories.map(category => {
          const totalTopics = parseInt(category.total_topics) || 0;
          const completedTopics = parseInt(category.completed_topics) || 0;
          const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
          
          return {
            ...category,
            progress
          };
        });
        
        return categoriesWithProgress;
        
      case 'POST':
        // Create a new category
        const body = await readBody(event);
        const validatedData = categorySchema.parse(body);
        
        const result = await db.query(
          `INSERT INTO categories (name, description, color) 
           VALUES ($1, $2, $3) 
           RETURNING *`,
          [validatedData.name, validatedData.description, validatedData.color]
        );
        
        return result.rows[0];
        
      case 'PUT':
        // Update a category
        const updateBody = await readBody(event);
        const id = getRouterParam(event, 'id');
        
        if (!id) {
          return createError({
            statusCode: 400,
            message: 'Category ID is required'
          });
        }
        
        const validatedUpdateData = categorySchema.parse(updateBody);
        
        const updateResult = await db.query(
          `UPDATE categories 
           SET name = $1, description = $2, color = $3, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $4 
           RETURNING *`,
          [validatedUpdateData.name, validatedUpdateData.description, validatedUpdateData.color, id]
        );
        
        if (updateResult.rowCount === 0) {
          return createError({
            statusCode: 404,
            message: 'Category not found'
          });
        }
        
        return updateResult.rows[0];
        
      case 'DELETE':
        // Delete a category
        const deleteId = getRouterParam(event, 'id');
        
        if (!deleteId) {
          return createError({
            statusCode: 400,
            message: 'Category ID is required'
          });
        }
        
        const deleteResult = await db.query(
          'DELETE FROM categories WHERE id = $1 RETURNING id',
          [deleteId]
        );
        
        if (deleteResult.rowCount === 0) {
          return createError({
            statusCode: 404,
            message: 'Category not found'
          });
        }
        
        return { message: 'Category deleted successfully', id: deleteId };
        
      default:
        return createError({
          statusCode: 405,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        message: 'Validation error',
        data: error.format()
      });
    }
    
    return handleDbError(error);
  }
});
