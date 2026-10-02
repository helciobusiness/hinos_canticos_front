import { useState, useEffect, useCallback } from 'react';

export interface IFavoriteHymn {
  numero: number;
  titulo: string;
  autor?: string | null;
  adicionadoEm: number;
}

const STORAGE_KEY = 'hinario_favoritos';

export function useFavorites() {
  const [favorites, setFavorites] = useState<IFavoriteHymn[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveFavorites = (newFavs: IFavoriteHymn[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
      window.dispatchEvent(new Event('favorites_changed'));
    } catch (e) {
      console.warn('Erro ao salvar favoritos no localStorage', e);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favorites_changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favorites_changed', handleStorageChange);
    };
  }, []);

  const isFavorite = useCallback(
    (numero: number) => {
      return favorites.some((f) => f.numero === numero);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (hino: { numero: number; titulo: string; autor?: string | null }) => {
      const exists = favorites.some((f) => f.numero === hino.numero);
      let updated: IFavoriteHymn[];

      if (exists) {
        updated = favorites.filter((f) => f.numero !== hino.numero);
      } else {
        const newItem: IFavoriteHymn = {
          numero: hino.numero,
          titulo: hino.titulo,
          autor: hino.autor || null,
          adicionadoEm: Date.now(),
        };
        updated = [newItem, ...favorites];
      }

      saveFavorites(updated);
      return !exists;
    },
    [favorites]
  );

  return { favorites, isFavorite, toggleFavorite };
}
