import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ArrowRight, Trash2, Music } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { HymnCard } from '../components/HymnCard';
import { normalizeText } from '../utils/text';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [filter, setFilter] = useState('');

  const filtered = favorites.filter((f) => {
    if (!filter.trim()) return true;
    const norm = normalizeText(filter);
    return (
      f.numero.toString().includes(filter.trim()) ||
      normalizeText(f.titulo).includes(norm) ||
      (f.autor && normalizeText(f.autor).includes(norm))
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: 4, letterSpacing: '-0.015em', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={22} color="var(--red-primary)" fill="var(--red-primary)" /> Hinos Favoritos
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Seus hinos guardados para acesso rápido e leitura diária.
          </p>
        </div>

        {favorites.length > 0 && (
          <span style={{ padding: '5px 12px', background: 'var(--red-light)', color: 'var(--red-primary)', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.82rem' }}>
            {favorites.length} {favorites.length === 1 ? 'guardado' : 'guardados'}
          </span>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="search-input-wrapper" style={{ marginBottom: 20 }}>
          <Search size={18} className="search-input-icon" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar dentro dos seus favoritos..."
            aria-label="Filtrar favoritos"
          />
        </div>
      )}

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)' }}>
          <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
            Ainda não possui favoritos
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: 440, margin: '0 auto 24px' }}>
            Ao abrir qualquer hino, toque no ícone de coração para guardá-lo aqui e ter acesso rápido a qualquer momento, mesmo sem Internet.
          </p>
          <Link to="/" className="btn btn-primary">
            Explorar Hinos & Cânticos
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p>Nenhum favorito corresponde a "{filter}".</p>
        </div>
      ) : (
        <div>
          {filtered.map((fav) => (
            <HymnCard
              key={fav.numero}
              numero={fav.numero}
              titulo={fav.titulo}
              autor={fav.autor}
            />
          ))}
        </div>
      )}
    </div>
  );
};
