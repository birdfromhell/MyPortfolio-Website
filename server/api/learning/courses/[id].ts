import { getDb, handleDbError } from '~/server/utils/db';
import { z } from 'zod';

// Schema for course validation
const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  platform: z.string().optional(),
  author: z.string().optional(),
  url: z.string().url().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  category_id: z.number().int().positive().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('not_started'),
  progress: z.number().int().min(0).max(100).default(0)
});

export default defineEventHandler(async (event) => {
  try {
    // Handle GET, POST, PUT, DELETE requests
    const method = event.node.req.method;
    const db = getDb();
    
    switch (method) {
      case 'GET':
        const categoryId = getQuery(event).category_id;
        const status = getQuery(event).status;
        
        // Build where conditions based on query params
        const whereConditions = [];
        const queryParams = [];
        
        if (categoryId) {
          whereConditions.push(`c.category_id = $${queryParams.length + 1}`);
          queryParams.push(categoryId);
        }
        
        if (status) {
          whereConditions.push(`c.status = $${queryParams.length + 1}`);
          queryParams.push(status);
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        // Get courses with category info and topic counts
        const { rows: courses } = await db.query(`
          SELECT 
            c.*,
            cat.name AS category_name,
            cat.color AS category_color,
            COUNT(DISTINCT t.id) AS total_topics,
            COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) AS completed_topics
          FROM courses c
          LEFT JOIN categories cat ON c.category_id = cat.id
          LEFT JOIN topics t ON t.course_id = c.id
          ${whereClause}
          GROUP BY c.id, cat.name, cat.color
          ORDER BY c.created_at DESC
        `, queryParams);
        
        return courses;
        
      case 'POST':
        // Create a new course
        const body = await readBody(event);
        const validatedData = courseSchema.parse(body);
        
        const columns = Object.keys(validatedData).filter(key => validatedData[key as keyof typeof validatedData] !== undefined);
        const values = columns.map(key => validatedData[key as keyof typeof validatedData]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const columnList = columns.join(', ');
        
        const result = await db.query(
          `INSERT INTO courses (${columnList})
           VALUES (${placeholders})
           RETURNING *`,
          values
        );
        
        return result.rows[0];
        
      case 'PUT':
        // Update a course
        const updateBody = await readBody(event);
        const id = getRouterParam(event, 'id');
        
        if (!id) {
          return createError({
            statusCode: 400,
            message: 'Course ID is required'
          });
        }
        
        const validatedUpdateData = courseSchema.partial().parse(updateBody);
        
        const updateColumns = Object.entries(validatedUpdateData)
          .filter(([_, value]) => value !== undefined)
          .map(([key, _], i) => `${key} = $${i + 1}`);
          
        const updateValues = Object.entries(validatedUpdateData)
          .filter(([_, value]) => value !== undefined)
          .map(([_, value]) => value);
          
        // Add id as the last parameter
        updateValues.push(id);
        
        if (updateColumns.length === 0) {
          return createError({
            statusCode: 400,
            message: 'No valid fields to update'
          });
        }
        
        const updateResult = await db.query(
          `UPDATE courses 
           SET ${updateColumns.join(', ')}, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $${updateValues.length}
           RETURNING *`,
          updateValues
        );
        
        if (updateResult.rowCount === 0) {
          return createError({
            statusCode: 404,
            message: 'Course not found'
          });
        }
        
        return updateResult.rows[0];
        
      case 'DELETE':
        // Delete a course
        const deleteId = getRouterParam(event, 'id');
        
        if (!deleteId) {
          return createError({
            statusCode: 400,
            message: 'Course ID is required'
          });
        }
        
        const deleteResult = await db.query(
          'DELETE FROM courses WHERE id = $1 RETURNING id',
          [deleteId]
        );
        
        if (deleteResult.rowCount === 0) {
          return createError({
            statusCode: 404,
            message: 'Course not found'
          });
        }
        
        return { message: 'Course deleted successfully', id: deleteId };
        
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
