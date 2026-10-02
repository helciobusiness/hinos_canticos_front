import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, Music } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { formatHinoNumero } from '../utils/format';
import { highlightMatch } from '../utils/text';
import { useToast } from './Toast';

interface HymnCardProps {
  numero: number;
  titulo: string;
  autor?: string | null;
  totalEstrofes?: number;
  primeiraEstrofe?: string;
  trechoRelevante?: string;
  searchQuery?: string;
}

export const HymnCard: React.FC<HymnCardProps> = ({
  numero,
  titulo,
  autor,
  totalEstrofes,
  primeiraEstrofe,
  trechoRelevante,
  searchQuery = '',
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const favorited = isFavorite(numero);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavorite({ numero, titulo, autor });
    showToast(
      added ? `Hino ${numero} adicionado aos favoritos!` : `Hino ${numero} removido dos favoritos!`,
      added ? 'success' : 'info'
    );
  };

  const titleParts = searchQuery ? highlightMatch(titulo, searchQuery) : null;
  const snippetParts = trechoRelevante && searchQuery ? highlightMatch(trechoRelevante, searchQuery) : null;

  // Extrai a primeira frase da estrofe para o incipit musical
  const incipitLine = primeiraEstrofe ? primeiraEstrofe.split('\n')[0].trim() : null;

  return (
    <Link to={`/hino/${formatHinoNumero(numero)}`} className="hymn-card editorial-hymn-card" aria-label={`Hino ${numero}: ${titulo}`}>
      <div className="hymn-card-left">
        <div className="hymn-number-badge">
          <span className="hymn-badge-prefix">Nº</span>
          <span className="hymn-badge-num">{formatHinoNumero(numero)}</span>
        </div>

        <div className="hymn-info">
          <h3 className="hymn-title">
            {titleParts
              ? titleParts.map((part, i) =>
                  part.match ? (
                    <mark key={i} className="hymn-match-highlight">
                      {part.text}
                    </mark>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )
              : titulo}
          </h3>

          {/* Incipit da melodia (Primeira linha da letra) */}
          {!trechoRelevante && incipitLine && (
            <p className="hymn-incipit">
              «{incipitLine}»
            </p>
          )}

          <div className="hymn-subtitle">
            {autor ? (
              <span className="hymn-author-tag">{autor}</span>
            ) : (
              <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Autor desconhecido</span>
            )}
            {typeof totalEstrofes === 'number' && totalEstrofes > 0 && (
              <span className="hymn-stanza-tag">• {totalEstrofes} {totalEstrofes === 1 ? 'estrofe' : 'estrofes'}</span>
            )}
          </div>

          {trechoRelevante && (
            <p className="hymn-snippet">
              {snippetParts
                ? snippetParts.map((part, i) =>
                    part.match ? (
                      <mark key={i} className="hymn-match-highlight">
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )
                : trechoRelevante}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={handleFavoriteClick}
          className="icon-btn hymn-card-heart-btn"
          style={{
            border: 'none',
            background: 'transparent',
            color: favorited ? 'var(--red-primary)' : 'var(--text-muted)',
          }}
          aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          title={favorited ? 'Remover dos favoritos' : 'Favoritar'}
        >
          <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
        </button>
        <ChevronRight size={18} color="var(--text-muted)" className="hymn-card-arrow" />
      </div>
    </Link>
  );
};
