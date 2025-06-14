import { getDb, handleDbError } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const db = getDb();
    
    // Get summary stats for the learning dashboard
    const [
      categoriesResult,
      coursesResult,
      topicsResult,
      completedTopicsResult,
      categoryProgressResult
    ] = await Promise.all([
      // Total categories
      db.query('SELECT COUNT(*) as count FROM categories'),
      
      // Course stats by status
      db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'not_started' THEN 1 END) as not_started,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM courses
      `),
      
      // Total topics
      db.query('SELECT COUNT(*) as count FROM topics'),
      
      // Topics by status
      db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'not_done' THEN 1 END) as not_done,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
          COUNT(CASE WHEN status = 'done' THEN 1 END) as done
        FROM topics
      `),
      
      // Category progress
      db.query(`
        SELECT 
          c.id, 
          c.name,
          c.color, 
          COUNT(t.id) as total_topics,
          COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_topics
        FROM categories c
        LEFT JOIN topics t ON t.category_id = c.id
        GROUP BY c.id, c.name, c.color
        ORDER BY c.name
      `)
    ]);
    
    // Calculate overall progress percentage
    const totalTopics = parseInt(topicsResult.rows[0].count) || 0;
    const completedTopics = parseInt(completedTopicsResult.rows[0].done) || 0;
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    // Calculate progress for each category
    const categoryProgress = categoryProgressResult.rows.map(cat => {
      const total = parseInt(cat.total_topics) || 0;
      const completed = parseInt(cat.completed_topics) || 0;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        id: cat.id,
        name: cat.name,
        color: cat.color,
        totalTopics: total,
        completedTopics: completed,
        progress
      };
    });
    
    // Recent activity - most recently updated topics
    const recentActivityResult = await db.query(`
      SELECT 
        t.*,
        c.title AS course_title,
        cat.name AS category_name,
        cat.color AS category_color
      FROM topics t
      LEFT JOIN courses c ON t.course_id = c.id
      LEFT JOIN categories cat ON t.category_id = cat.id
      ORDER BY t.updated_at DESC
      LIMIT 5
    `);
    
    return {
      categoriesCount: parseInt(categoriesResult.rows[0].count),
      courses: {
        total: parseInt(coursesResult.rows[0].total),
        notStarted: parseInt(coursesResult.rows[0].not_started),
        inProgress: parseInt(coursesResult.rows[0].in_progress),
        completed: parseInt(coursesResult.rows[0].completed)
      },
      topics: {
        total: totalTopics,
        notDone: parseInt(completedTopicsResult.rows[0].not_done),
        inProgress: parseInt(completedTopicsResult.rows[0].in_progress),
        done: completedTopics
      },
      overallProgress,
      categoryProgress,
      recentActivity: recentActivityResult.rows
    };
    
  } catch (error) {
    return handleDbError(error);
  }
});
