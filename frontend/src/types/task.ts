// src/types/task.ts

export type TaskPriority = 1 | 2 | 3 | 4; // 1=Low, 2=Medium, 3=High, 4=Urgent
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';
export type TaskCategory = 'general' | 'work' | 'personal' | 'finance' | 'learning' | 'health' | 'creative';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  subtasks: Subtask[];
  estimated_minutes: number;
  completed: boolean;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  todo: number;
  in_progress: number;
  in_review: number;
  overdue: number;
  completion_rate: number;
  priority_counts: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  category_counts: Record<string, number>;
}

export type ViewMode = 'list' | 'kanban' | 'calendar' | 'analytics' | 'pomodoro';
