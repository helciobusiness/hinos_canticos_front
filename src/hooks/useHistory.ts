import { useState, useEffect, useCallback } from 'react';
import { IHistoryItem } from '../types/hino';

const STORAGE_KEY = 'hinario_historico';
const MAX_HISTORY = 30;

export function useHistory() {
  const [history, setHistory] = useState<IHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveHistory = (items: IHistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Erro ao salvar histórico', e);
    }
  };

  const addToHistory = useCallback(
    (hino: { numero: number; titulo: string; autor?: string | null }) => {
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.numero !== hino.numero);
        const newItem: IHistoryItem = {
          numero: hino.numero,
          titulo: hino.titulo,
          autor: hino.autor || null,
          dataAcesso: Date.now(),
        };
        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    []
  );

  const removeFromHistory = useCallback((numero: number) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.numero !== numero);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}

