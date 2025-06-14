import { getDb, handleDbError } from '~/server/utils/db';
import { z } from 'zod';

// Schema for topic validation
const topicSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  course_id: z.number().int().positive().optional(),
  category_id: z.number().int().positive().optional(),
  status: z.enum(['not_done', 'in_progress', 'done']).default('not_done'),
  priority: z.number().int().min(0).max(10).default(0)
});

export default defineEventHandler(async (event) => {
  try {
    // Handle GET, POST, PUT, DELETE requests
    const method = event.node.req.method;
    const db = getDb();
    
    switch (method) {
      case 'GET':
        const courseIdFilter = getQuery(event).course_id;
        const categoryId = getQuery(event).category_id;
        const status = getQuery(event).status;
        
        // Build where conditions based on query params
        const whereConditions = [];
        const queryParams = [];
        
        if (courseIdFilter) {
          whereConditions.push(`t.course_id = $${queryParams.length + 1}`);
          queryParams.push(courseIdFilter);
        }
        
        if (categoryId) {
          whereConditions.push(`t.category_id = $${queryParams.length + 1}`);
          queryParams.push(categoryId);
        }
        
        if (status) {
          whereConditions.push(`t.status = $${queryParams.length + 1}`);
          queryParams.push(status);
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        // Get topics with related course and category info
        const { rows: topics } = await db.query(`
          SELECT 
            t.*,
            c.title AS course_title,
            cat.name AS category_name,
            cat.color AS category_color
          FROM topics t
          LEFT JOIN courses c ON t.course_id = c.id
          LEFT JOIN categories cat ON t.category_id = cat.id
          ${whereClause}
          ORDER BY t.priority DESC, t.created_at DESC
        `, queryParams);
        
        return topics;
        
      case 'POST':
        // Create a new topic
        const body = await readBody(event);
        const validatedData = topicSchema.parse(body);
        
        const columns = Object.keys(validatedData).filter(key => validatedData[key as keyof typeof validatedData] !== undefined);
        const values = columns.map(key => validatedData[key as keyof typeof validatedData]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const columnList = columns.join(', ');
        
        const result = await db.query(
          `INSERT INTO topics (${columnList})
           VALUES (${placeholders})
           RETURNING *`,
          values
        );
        
        return result.rows[0];
        
      case 'PUT':
        // Update a topic
        const updateBody = await readBody(event);
        const id = getRouterParam(event, 'id');
        
        if (!id) {
          return createError({
            statusCode: 400,
            message: 'Topic ID is required'
          });
        }
        
        // If we're updating the status, we also need to update the course progress
        const statusChange = updateBody.status;
        
        const validatedUpdateData = topicSchema.partial().parse(updateBody);
        
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
          `UPDATE topics 
           SET ${updateColumns.join(', ')}, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $${updateValues.length}
           RETURNING *`,
          updateValues
        );
        
        if (updateResult.rowCount === 0) {
          return createError({
            statusCode: 404,
            message: 'Topic not found'
          });
        }
        
        // Update course progress if this is part of a course
        if (statusChange && updateResult.rows[0].course_id) {
          const courseId = updateResult.rows[0].course_id;
          
          // Calculate course progress based on completed topics
          await db.query(`
            UPDATE courses c
            SET progress = (
              SELECT COALESCE(
                ROUND((COUNT(CASE WHEN t.status = 'done' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0))),
                0
              )
              FROM topics t
              WHERE t.course_id = c.id
            )
            WHERE id = $1
          `, [courseId]);
          
          // Update course status based on progress
          await db.query(`
            UPDATE courses
            SET status = 
              CASE 
                WHEN progress = 0 THEN 'not_started'
                WHEN progress = 100 THEN 'completed'
                ELSE 'in_progress'
              END
            WHERE id = $1
          `, [courseId]);
        }
        
        return updateResult.rows[0];
        
      case 'DELETE':
        // Delete a topic
        const deleteId = getRouterParam(event, 'id');
        
        if (!deleteId) {
          return createError({
            statusCode: 400,
            message: 'Topic ID is required'
          });
        }
        
        // Get course ID before deletion to update progress later
        const { rows: topicData } = await db.query(
          'SELECT course_id FROM topics WHERE id = $1',
          [deleteId]
        );
        
        const courseId = topicData.length > 0 ? topicData[0].course_id : null;
        
        const deleteResult = await db.query(
          'DELETE FROM topics WHERE id = $1 RETURNING id',
          [deleteId]
        );
        
        if (deleteResult.rowCount === 0) {
          return createError({
            statusCode: 404,
            message: 'Topic not found'
          });
        }
        
        // Update course progress if the deleted topic was part of a course
        if (courseId) {
          // Calculate course progress based on completed topics
          await db.query(`
            UPDATE courses c
            SET progress = (
              SELECT COALESCE(
                ROUND((COUNT(CASE WHEN t.status = 'done' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0))),
                0
              )
              FROM topics t
              WHERE t.course_id = c.id
            )
            WHERE id = $1
          `, [courseId]);
          
          // Update course status based on progress
          await db.query(`
            UPDATE courses
            SET status = 
              CASE 
                WHEN progress = 0 THEN 'not_started'
                WHEN progress = 100 THEN 'completed'
                ELSE 'in_progress'
              END
            WHERE id = $1
          `, [courseId]);
        }
        
        return { message: 'Topic deleted successfully', id: deleteId };
        
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
