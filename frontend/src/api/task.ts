// src/api/task.ts
import { api } from './client';
import type { Task, TaskStats } from '../types/task';

export interface TaskQueryParams {
  status?: string;
  category?: string;
  priority?: string | number;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export const TaskService = {
  async getAll(params?: TaskQueryParams): Promise<Task[]> {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  async create(data: Partial<Task>): Promise<{ message: string; task: Task }> {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  async update(id: number, updates: Partial<Task>): Promise<{ message: string; task: Task }> {
    const res = await api.put(`/tasks/${id}`, updates);
    return res.data;
  },

  async toggle(id: number): Promise<{ message: string; task: Task }> {
    const res = await api.post(`/tasks/${id}/toggle`);
    return res.data;
  },

  async delete(id: number): Promise<{ message: string; id: number }> {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  async getStats(): Promise<TaskStats> {
    const res = await api.get('/tasks/stats');
    return res.data;
  },

  async bulkAction(action: string, payload?: any): Promise<any> {
    const res = await api.post('/tasks/bulk', { action, ...payload });
    return res.data;
  }
};