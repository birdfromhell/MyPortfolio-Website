export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
  total_topics?: number;
  completed_topics?: number;
  progress?: number;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  platform?: string;
  author?: string;
  url?: string;
  start_date?: string;
  end_date?: string;
  category_id?: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_color?: string;
  total_topics?: number;
  completed_topics?: number;
}

export interface Topic {
  id: number;
  title: string;
  description?: string;
  course_id?: number;
  category_id?: number;
  status: 'not_done' | 'in_progress' | 'done';
  priority: number;
  created_at: string;
  updated_at: string;
  course_title?: string;
  category_name?: string;
  category_color?: string;
}

export interface DashboardStats {
  categoriesCount: number;
  courses: {
    total: number;
    notStarted: number;
    inProgress: number;
    completed: number;
  };
  topics: {
    total: number;
    notDone: number;
    inProgress: number;
    done: number;
  };
  overallProgress: number;
  categoryProgress: {
    id: number;
    name: string;
    color: string;
    totalTopics: number;
    completedTopics: number;
    progress: number;
  }[];
  recentActivity: Topic[];
}
