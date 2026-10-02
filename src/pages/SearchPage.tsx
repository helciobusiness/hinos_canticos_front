import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Music, AlertCircle, FileSearch } from 'lucide-react';
import { hinosApi } from '../services/api/hinosApi';
import { IHinoSearchResult, IPagination } from '../types/hino';
import { HymnCard } from '../components/HymnCard';
import { useDebounce } from '../hooks/useDebounce';

type FilterType = 'todos' | 'numero' | 'titulo' | 'letra' | 'autor';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [results, setResults] = useState<IHinoSearchResult[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults([]);
      setPagination(null);
      setLoading(false);
      return;
    }

    const doSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await hinosApi.searchHinos(trimmed, 1, 50);
        setResults(res.data);
        setPagination(res.pagination);
      } catch (err: any) {
        setError(err.message || 'Erro ao realizar a busca.');
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [debouncedQuery]);

  // Filtragem local pelos chips se o usuário desejar refinar
  const filteredResults = results.filter((item) => {
    if (activeFilter === 'todos') return true;
    return item.correspondencia === activeFilter;
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.015em' }}>
          Pesquisar Hinos
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Encontre rapidamente por número (ex: 23), título, autor ou qualquer frase da letra.
        </p>
      </div>

      {/* Campo de Busca Principal */}
      <div className="search-input-wrapper" style={{ marginBottom: 12 }}>
        <Search size={20} className="search-input-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o número, título, autor ou letra..."
          aria-label="Campo de pesquisa de hinos"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="search-clear-btn"
            aria-label="Limpar campo de pesquisa"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Chips de Filtro */}
      {results.length > 0 && (
        <div className="filter-chips">
          <button
            onClick={() => setActiveFilter('todos')}
            className={`filter-chip ${activeFilter === 'todos' ? 'active' : ''}`}
          >
            Todos ({results.length})
          </button>
          <button
            onClick={() => setActiveFilter('numero')}
            className={`filter-chip ${activeFilter === 'numero' ? 'active' : ''}`}
          >
            Por Número ({results.filter((r) => r.correspondencia === 'numero').length})
          </button>
          <button
            onClick={() => setActiveFilter('titulo')}
            className={`filter-chip ${activeFilter === 'titulo' ? 'active' : ''}`}
          >
            Por Título ({results.filter((r) => r.correspondencia === 'titulo').length})
          </button>
          <button
            onClick={() => setActiveFilter('letra')}
            className={`filter-chip ${activeFilter === 'letra' ? 'active' : ''}`}
          >
            Na Letra ({results.filter((r) => r.correspondencia === 'letra').length})
          </button>
          <button
            onClick={() => setActiveFilter('autor')}
            className={`filter-chip ${activeFilter === 'autor' ? 'active' : ''}`}
          >
            Por Autor ({results.filter((r) => r.correspondencia === 'autor').length})
          </button>
        </div>
      )}

      {/* Estado: Erro */}
      {error && (
        <div style={{ padding: 20, background: 'var(--red-tint)', borderRadius: 'var(--radius-md)', color: 'var(--red-primary)', textAlign: 'center', margin: '20px 0' }}>
          <AlertCircle size={28} style={{ margin: '0 auto 8px' }} />
          <p style={{ fontWeight: 700 }}>{error}</p>
        </div>
      )}

      {/* Estado: Carregando */}
      {loading && (
        <div style={{ marginTop: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 86, marginBottom: 10 }} />
          ))}
        </div>
      )}

      {/* Estado: Nenhum resultado */}
      {!loading && debouncedQuery && filteredResults.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', marginTop: 16 }}>
          <FileSearch size={44} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 6 }}>
            Nenhum hino encontrado
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto' }}>
            Não encontramos resultados para "<strong>{debouncedQuery}</strong>". Tente verificar a ortografia ou buscar por palavras-chave mais genéricas.
          </p>
        </div>
      )}

      {/* Estado: Resultados encontrados */}
      {!loading && filteredResults.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            {filteredResults.length} {filteredResults.length === 1 ? 'hino encontrado' : 'hinos encontrados'}
          </p>

          {filteredResults.map((hino) => (
            <HymnCard
              key={hino.numero}
              numero={hino.numero}
              titulo={hino.titulo}
              autor={hino.autor}
              totalEstrofes={hino.totalEstrofes}
              trechoRelevante={hino.trechoRelevante}
              searchQuery={debouncedQuery}
            />
          ))}
        </div>
      )}

      {/* Estado Inicial: Sem busca digitada */}
      {!loading && !debouncedQuery && (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <Music size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p style={{ fontSize: '0.95rem' }}>
            Digite no campo acima para pesquisar entre os 581 hinos e cânticos da IEIA.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Sugestões rápidas:</span>
            {['Graça', 'Cruz', 'Jesus', 'Paz', 'Amor', 'Glória'].map((sug) => (
              <button
                key={sug}
                onClick={() => setQuery(sug)}
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
