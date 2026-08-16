// src/api/client.ts
import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If accessing via IP or domain, use the current host's IP on port 5000
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api`;
    }
  }
  return 'http://localhost:5000/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    // Only redirect to /login if the failed request is NOT /login or /refresh
    const requestUrl = error.config?.url || '';
    if (
      error.response?.status === 401 &&
      !requestUrl.endsWith('/login') &&
      !requestUrl.endsWith('/refresh')
    ) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);