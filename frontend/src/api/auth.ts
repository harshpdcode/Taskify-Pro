// src/api/auth.ts
import { api } from './client';

export const AuthService = {
  async login(username: string, password: string) {
    const response = await api.post('/login', { username, password });
    // Store token if using localStorage strategy
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response;
  },

  async logout() {
    await api.post('/logout');
    // clearAuth(); // Removed because it's not exported from './client'
  },

  async refresh() {
    const response = await api.post('/refresh');
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response;
  }
};