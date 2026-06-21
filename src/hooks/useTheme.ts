import { useState, useEffect } from 'react';

type Theme = 'earth' | 'night' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'earth';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme] as const;
}
