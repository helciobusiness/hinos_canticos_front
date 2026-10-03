import React from 'react';
import { Sun, Moon, SunMoon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useToast } from './Toast';

export const ThemeToggle: React.FC = () => {
  const { themeMode, isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const handleToggle = () => {
    // Determina o próximo modo para o toast
    const nextMode =
      themeMode === 'system' ? 'light' : themeMode === 'light' ? 'dark' : 'system';
    
    toggleTheme();

    if (nextMode === 'system') {
      showToast('Tema: Automático (segue a definição do dispositivo)', 'success');
    } else if (nextMode === 'light') {
      showToast('Tema: Modo Claro ativado', 'info');
    } else {
      showToast('Tema: Modo Escuro ativado', 'info');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="icon-btn theme-toggle-btn"
      aria-label={
        themeMode === 'system'
          ? `Tema Automático do dispositivo (${isDark ? 'Escuro' : 'Claro'})`
          : isDark
          ? 'Modo Escuro'
          : 'Modo Claro'
      }
      title={
        themeMode === 'system'
          ? `Tema: Automático (Segue o dispositivo • Atual: ${isDark ? 'Escuro' : 'Claro'})`
          : themeMode === 'light'
          ? 'Tema: Modo Claro'
          : 'Tema: Modo Escuro'
      }
    >
      {themeMode === 'system' ? (
        <SunMoon size={18} color="var(--red-primary)" />
      ) : isDark ? (
        <Moon size={18} />
      ) : (
        <Sun size={18} />
      )}
    </button>
  );
};
