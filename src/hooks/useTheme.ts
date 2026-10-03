import { useState, useEffect } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'hinario_theme_mode';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredThemeMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'system' || stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {}
  return 'system'; // Padrão: segue a configuração do dispositivo
}

let currentMode: ThemeMode = getStoredThemeMode();
let currentResolved: ResolvedTheme = currentMode === 'system' ? getSystemTheme() : currentMode;

type ThemeListener = (state: { mode: ThemeMode; resolved: ResolvedTheme }) => void;
const listeners = new Set<ThemeListener>();

function applyTheme(mode: ThemeMode) {
  currentMode = mode;
  currentResolved = mode === 'system' ? getSystemTheme() : mode;

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (currentResolved === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {}

    // Atualiza theme-color para a status bar do smartphone
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', currentResolved === 'dark' ? '#0F1117' : '#C81D25');
    }
  }

  listeners.forEach((listener) => listener({ mode: currentMode, resolved: currentResolved }));
}

// Configura o listener para detectar quando o sistema operacional / dispositivo muda de modo automaticamente
if (typeof window !== 'undefined' && window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleSystemChange = () => {
    if (currentMode === 'system') {
      applyTheme('system');
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemChange);
  } else if ((mediaQuery as any).addListener) {
    (mediaQuery as any).addListener(handleSystemChange);
  }

  // Aplicação inicial garantida
  applyTheme(currentMode);
}

export function useTheme() {
  const [themeState, setThemeState] = useState<{ mode: ThemeMode; resolved: ResolvedTheme }>({
    mode: currentMode,
    resolved: currentResolved,
  });

  useEffect(() => {
    const listener: ThemeListener = (state) => setThemeState(state);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggleTheme = () => {
    // Ciclo: Sistema (segue dispositivo) -> Claro -> Escuro -> Sistema
    const nextMode: ThemeMode =
      themeState.mode === 'system' ? 'light' : themeState.mode === 'light' ? 'dark' : 'system';
    applyTheme(nextMode);
  };

  const setThemeMode = (mode: ThemeMode) => {
    applyTheme(mode);
  };

  const isDark = themeState.resolved === 'dark';
  const logoSrc = isDark ? '/logo_white.png' : '/logo_black.png';

  return {
    theme: themeState.resolved,
    themeMode: themeState.mode,
    isDark,
    toggleTheme,
    setThemeMode,
    logoSrc,
  };
}

