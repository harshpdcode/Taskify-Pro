// src/context/ThemeContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { triggerPageAsciiGlitch } from '../utils/asciiScrambler';

export interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
  isGlitching: boolean;
  triggerGlitch: (durationMs?: number) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Automatically start glitch on every initial page load / reload
  const [isGlitching, setIsGlitching] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Initial load glitch resolution & full-page ASCII scramble
  useEffect(() => {
    triggerPageAsciiGlitch(750);
    const timer = setTimeout(() => {
      setIsGlitching(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const triggerGlitch = useCallback((durationMs = 600) => {
    setIsGlitching(true);
    triggerPageAsciiGlitch(durationMs);
    setTimeout(() => {
      setIsGlitching(false);
    }, durationMs);
  }, []);

  const toggleTheme = useCallback(() => {
    // Trigger Spider-Verse Multiverse Glitch & ASCII Scramble on theme switch
    setIsGlitching(true);
    triggerPageAsciiGlitch(650);
    setTimeout(() => {
      setDarkMode((prev) => !prev);
    }, 120); // switch theme right during dimensional tear

    setTimeout(() => {
      setIsGlitching(false);
    }, 550);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, isGlitching, triggerGlitch }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { useTheme } from '../hooks/useTheme';
