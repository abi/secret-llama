import { useState, useEffect } from 'react';

export default function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleDarkTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    
    setIsDark(!isDark);
  };

  useEffect(() => {
    const className = 'dark';
    const body = document.body;
    if (isDark) {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }
  }, [isDark]);

  return { isDark, toggleDarkTheme };
}
