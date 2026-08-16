// src/App.tsx
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Router from './Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import MultiverseGlitchOverlay from './components/MultiverseGlitchOverlay';
import { triggerPageAsciiGlitch } from './utils/asciiScrambler';

const queryClient = new QueryClient();

function PageGlitchWatcher() {
  const location = useLocation();
  const { triggerGlitch } = useTheme();

  useEffect(() => {
    // Trigger ASCII scramble and dimension tear on route change & page load
    triggerGlitch(650);
    triggerPageAsciiGlitch(750);
  }, [location.pathname, triggerGlitch]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <PageGlitchWatcher />
            <MultiverseGlitchOverlay />
            <Router />
            <ToastContainer
              position="top-right"
              autoClose={2800}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;