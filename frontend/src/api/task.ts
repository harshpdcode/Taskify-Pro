// src/api/task.ts
import { api } from './client';
import type { Task, TaskStats, TaskStatus, TaskPriority, TaskCategory } from '../types/task';

export interface TaskQueryParams {
  status?: string;
  category?: string;
  priority?: string | number;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

const DEMO_TASKS_KEY = 'taskify_demo_tasks_v2';

const INITIAL_DEMO_TASKS: Task[] = [
  {
    id: 1,
    title: 'Synthesize Web-Fluid Formula V4',
    description: 'Calibrate tensile strength and bio-degradation polymer matrix in Sector 7 laboratory.',
    category: 'learning',
    priority: 3,
    status: 'in_progress',
    completed: false,
    estimated_minutes: 30,
    subtasks: [
      { id: '1-1', text: 'Test polymer elasticity', completed: true },
      { id: '1-2', text: 'Verify rapid dissolving window', completed: false }
    ],
    due_date: new Date(Date.now() + 86400000).toISOString(),
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Launch Multiverse Station Artifact',
    description: 'Deploy 3D interactive hero canvas with real-time ASCII chromatic glitches.',
    category: 'work',
    priority: 3,
    status: 'in_progress',
    completed: false,
    estimated_minutes: 45,
    subtasks: [
      { id: '2-1', text: 'Implement 3D matrix transform', completed: true },
      { id: '2-2', text: 'Add mobile touch drag tracking', completed: true }
    ],
    due_date: new Date(Date.now() + 172800000).toISOString(),
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Review Sector 7 Gadget Budget',
    description: 'Audit dimensional portal stabilizer equipment expenses and team resource allocation.',
    category: 'finance',
    priority: 2,
    status: 'todo',
    completed: false,
    estimated_minutes: 25,
    subtasks: [],
    due_date: new Date(Date.now() + 259200000).toISOString(),
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Export Mission PDF Dossier for Review',
    description: 'Generate high-impact neo-brutal comic mission report for Headquarters debrief.',
    category: 'work',
    priority: 1,
    status: 'completed',
    completed: true,
    estimated_minutes: 15,
    subtasks: [],
    due_date: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
];

const getLocalDemoTasks = (): Task[] => {
  if (typeof window === 'undefined') return INITIAL_DEMO_TASKS;
  const raw = localStorage.getItem(DEMO_TASKS_KEY);
  if (!raw) {
    localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(INITIAL_DEMO_TASKS));
    return INITIAL_DEMO_TASKS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_TASKS;
  }
};

const saveLocalDemoTasks = (tasks: Task[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(tasks));
  }
};

const isDemoMode = (): boolean => {
  return typeof window !== 'undefined' && localStorage.getItem('is_demo_mode') === 'true';
};

const computeDemoStats = (tasks: Task[]): TaskStats => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const in_progress = tasks.filter(t => t.status === 'in_progress').length;
  const in_review = tasks.filter(t => t.status === 'in_review').length;
  const overdue = tasks.filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date()).length;
  const completion_rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const priority_counts = {
    low: tasks.filter(t => t.priority === 1).length,
    medium: tasks.filter(t => t.priority === 2).length,
    high: tasks.filter(t => t.priority === 3).length,
    urgent: tasks.filter(t => t.priority === 4).length,
  };

  const category_counts: Record<string, number> = {};
  tasks.forEach(t => {
    category_counts[t.category] = (category_counts[t.category] || 0) + 1;
  });

  return {
    total,
    completed,
    pending,
    todo,
    in_progress,
    in_review,
    overdue,
    completion_rate,
    priority_counts,
    category_counts,
  };
};

export const TaskService = {
  async getAll(params?: TaskQueryParams): Promise<Task[]> {
    if (isDemoMode()) {
      let tasks = getLocalDemoTasks();
      if (params?.category && params.category !== 'all') {
        tasks = tasks.filter(t => t.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.priority && params.priority !== 'all') {
        tasks = tasks.filter(t => String(t.priority) === String(params.priority));
      }
      if (params?.status && params.status !== 'all') {
        if (params.status === 'completed') tasks = tasks.filter(t => t.completed);
        else if (params.status === 'pending') tasks = tasks.filter(t => !t.completed);
        else tasks = tasks.filter(t => t.status === params.status);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
      }
      return tasks;
    }

    try {
      const res = await api.get('/tasks', { params });
      return res.data;
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        return getLocalDemoTasks();
      }
      throw err;
    }
  },

  async create(data: Partial<Task>): Promise<{ message: string; task: Task }> {
    if (isDemoMode()) {
      const tasks = getLocalDemoTasks();
      const newTask: Task = {
        id: Date.now(),
        title: data.title || 'Untitled Mission',
        description: data.description || '',
        category: (data.category as TaskCategory) || 'general',
        priority: (data.priority ? Number(data.priority) : 1) as TaskPriority,
        status: (data.status as TaskStatus) || 'todo',
        completed: !!data.completed,
        estimated_minutes: data.estimated_minutes ? Number(data.estimated_minutes) : 25,
        subtasks: data.subtasks || [],
        due_date: data.due_date || new Date().toISOString(),
        completed_at: data.completed ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      };
      tasks.unshift(newTask);
      saveLocalDemoTasks(tasks);
      return { message: 'Task created successfully', task: newTask };
    }

    const res = await api.post('/tasks', data);
    return res.data;
  },

  async update(id: number, updates: Partial<Task>): Promise<{ message: string; task: Task }> {
    if (isDemoMode()) {
      const tasks = getLocalDemoTasks();
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks[idx] = { ...tasks[idx], ...updates };
        if (updates.completed !== undefined) {
          tasks[idx].status = updates.completed ? 'completed' : (tasks[idx].status === 'completed' ? 'todo' : tasks[idx].status);
          tasks[idx].completed_at = updates.completed ? new Date().toISOString() : null;
        }
        saveLocalDemoTasks(tasks);
        return { message: 'Task updated successfully', task: tasks[idx] };
      }
    }

    const res = await api.put(`/tasks/${id}`, updates);
    return res.data;
  },

  async toggle(id: number): Promise<{ message: string; task: Task }> {
    if (isDemoMode()) {
      const tasks = getLocalDemoTasks();
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        const nextCompleted = !tasks[idx].completed;
        tasks[idx].completed = nextCompleted;
        tasks[idx].status = nextCompleted ? 'completed' : 'todo';
        tasks[idx].completed_at = nextCompleted ? new Date().toISOString() : null;
        saveLocalDemoTasks(tasks);
        return { message: 'Task toggled successfully', task: tasks[idx] };
      }
    }

    const res = await api.post(`/tasks/${id}/toggle`);
    return res.data;
  },

  async delete(id: number): Promise<{ message: string; id: number }> {
    if (isDemoMode()) {
      let tasks = getLocalDemoTasks();
      tasks = tasks.filter(t => t.id !== id);
      saveLocalDemoTasks(tasks);
      return { message: 'Task deleted', id };
    }

    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  async getStats(): Promise<TaskStats> {
    if (isDemoMode()) {
      const tasks = getLocalDemoTasks();
      return computeDemoStats(tasks);
    }

    try {
      const res = await api.get('/tasks/stats');
      return res.data;
    } catch {
      const tasks = getLocalDemoTasks();
      return computeDemoStats(tasks);
    }
  },

  async bulkAction(action: string, payload?: any): Promise<any> {
    if (isDemoMode()) {
      if (action === 'delete_completed') {
        const tasks = getLocalDemoTasks().filter(t => !t.completed);
        saveLocalDemoTasks(tasks);
        return { message: 'Completed tasks cleared' };
      }
    }
    const res = await api.post('/tasks/bulk', { action, ...payload });
    return res.data;
  }
};