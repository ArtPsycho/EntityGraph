import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'system');

  const applyTheme = (theme: string) => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    document.documentElement.classList.remove('light', 'dark');

    if (theme) {
      switch (theme) {
        case 'light':
          document.documentElement.classList.add('light');
          break;
        case 'dark':
          document.documentElement.classList.add('dark');
          break;
        case 'system':
        default:
          if (prefersDark.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.add('light');
          }
          break;
      }
    }
  };

  const setTheme = (theme: string) => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    setCurrentTheme(theme);
  };

  const getTheme = () => {
    let theme = localStorage.getItem('theme');
    if (!theme) {
      theme = 'system';
      localStorage.setItem('theme', theme);
    }
    applyTheme(theme);
    setCurrentTheme(theme);
    return theme;
  };

  useEffect(() => {
    getTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const theme = localStorage.getItem('theme');
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { currentTheme, setTheme, getTheme, applyTheme };
};