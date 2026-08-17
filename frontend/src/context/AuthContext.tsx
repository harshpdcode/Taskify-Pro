// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: number;
  username: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  loginDemo: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('access_token'));
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('is_demo_mode') === 'true') {
      return { id: 1, username: 'demo', email: 'demo@taskify.pro' };
    }
    return null;
  });
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token');
    const isDemo = localStorage.getItem('is_demo_mode') === 'true';

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    if (isDemo) {
      setIsAuthenticated(true);
      setUser({
        id: 1,
        username: 'demo',
        email: 'demo@taskify.pro',
      });
      return;
    }

    try {
      const res = await api.get('/me');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Sync auth state across tabs
  useEffect(() => {
    const syncAuth = () => {
      const hasToken = !!localStorage.getItem('access_token');
      setIsAuthenticated(hasToken);
      if (hasToken) {
        fetchUser();
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  const loginDemo = async () => {
    // Try online login first; if server unreachable, activate instant demo mode
    try {
      const response = await api.post('/login', { username: 'demo', password: 'Password123!' });
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.removeItem('is_demo_mode');
        setIsAuthenticated(true);
        setUser({
          id: response.data.user_id,
          username: response.data.username,
        });
        return true;
      }
    } catch (err: any) {
      console.warn('Live backend unreachable, entering Offline Demo Mode:', err);
    }

    // Direct Instant Demo fallback
    localStorage.setItem('access_token', 'demo-token-taskify-multiverse');
    localStorage.setItem('is_demo_mode', 'true');
    setIsAuthenticated(true);
    setUser({
      id: 1,
      username: 'demo',
      email: 'demo@taskify.pro',
    });
    return true;
  };

  const login = async (username: string, password: string) => {
    const isDemoAccount = username.toLowerCase() === 'demo' && password === 'Password123!';

    try {
      const response = await api.post('/login', { username, password });

      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.removeItem('is_demo_mode');
        setIsAuthenticated(true);
        setUser({
          id: response.data.user_id,
          username: response.data.username,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      // If user attempted demo login and backend is unreachable, automatically fall back to demo mode!
      if (isDemoAccount && (error.code === 'ERR_NETWORK' || !error.response)) {
        return loginDemo();
      }
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    const isDemo = localStorage.getItem('is_demo_mode') === 'true';
    if (!isDemo) {
      try {
        await api.post('/logout');
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('is_demo_mode');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, loginDemo, logout, checkAuth: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
