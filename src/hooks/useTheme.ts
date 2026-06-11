import { useState, useEffect } from 'react';

export type Theme = 'neon' | 'pink';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = (localStorage.getItem('theme') as Theme) ?? 'neon';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme(t => (t === 'neon' ? 'pink' : 'neon')),
  };
}
