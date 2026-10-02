import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('hinario_theme') as Theme;
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

let globalTheme: Theme = getInitialTheme();
const listeners = new Set<(theme: Theme) => void>();

function applyTheme(newTheme: Theme) {
  globalTheme = newTheme;
  const root = document.documentElement;
  if (newTheme === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }

  try {
    localStorage.setItem('hinario_theme', newTheme);
  } catch {}

  // Atualiza theme-color para a status bar do smartphone
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#0F1117' : '#C81D25');
  }

  listeners.forEach((listener) => listener(newTheme));
}

// Initial apply
if (typeof document !== 'undefined') {
  applyTheme(globalTheme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(globalTheme);

  useEffect(() => {
    const listener = (newTheme: Theme) => setTheme(newTheme);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggleTheme = () => {
    applyTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';
  const logoSrc = isDark ? '/logo_white.png' : '/logo_black.png';

  return { theme, toggleTheme, isDark, logoSrc };
}

