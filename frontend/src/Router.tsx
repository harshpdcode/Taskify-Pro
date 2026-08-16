// src/Router.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { useAuth } from './hooks/useAuth';

export default function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Landing page before login */}
      <Route path="/" element={<Landing />} />

      {/* Main Workspace Dashboard */}
      <Route
        path="/app"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/dashboard"
        element={<Navigate to="/app" replace />}
      />

      {/* Profile page */}
      <Route
        path="/profile"
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
      />

      {/* Auth pages */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/app" replace />}
      />

      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/app" replace />}
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}