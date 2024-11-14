// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.style.setProperty('--background-color', '#111216');
      document.documentElement.style.setProperty('--text-color', '#999');
      document.documentElement.style.setProperty('--text-title-color', '#eee');
      document.documentElement.style.setProperty('--text-hover-color', '#ddd');
      document.documentElement.style.setProperty('--light-accent-color', '#222');
    } else {
      document.documentElement.style.setProperty('--background-color', '#fafafa');
      document.documentElement.style.setProperty('--text-color', '#111');
      document.documentElement.style.setProperty('--text-hover-color', "#000");
      document.documentElement.style.setProperty('--text-title-color', "#111");
      document.documentElement.style.setProperty('--light-accent-color', "#ccc");
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleTheme };
};