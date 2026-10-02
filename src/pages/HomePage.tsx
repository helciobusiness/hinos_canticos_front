import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Hash,
  Sparkles,
  ArrowDownUp,
  Heart,
  Clock,
  Layers,
  ListOrdered,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { hinosApi } from '../services/api/hinosApi';
import { IHinoListItem, IPagination } from '../types/hino';
import { HymnCard } from '../components/HymnCard';
import { QuickNumberPad } from '../components/QuickNumberPad';
import { NumericIndexView } from '../components/NumericIndexView';
import { ThematicCategoriesView } from '../components/ThematicCategoriesView';
import { useFavorites } from '../hooks/useFavorites';
import { useHistory } from '../hooks/useHistory';
import { formatHinoNumero } from '../utils/format';

type HomeTab = 'todos' | 'indice' | 'temas';

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HomeTab>('todos');
  const [hinos, setHinos] = useState<IHinoListItem[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { favorites } = useFavorites();
  const { history } = useHistory();
  const navigate = useNavigate();

  const loadHinos = async (page: number, sort: 'asc' | 'desc') => {
    try {
      setLoading(true);
      setError(null);
      const res = await hinosApi.getHinos(page, 20, sort);
      setHinos(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar os hinos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHinos(currentPage, sortOrder);
  }, [currentPage, sortOrder]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
  };

  return (
    <div className="home-editorial-container">
      {/* Cabeçalho Reverente Editorial do Hinário */}
      <section className="hymnal-hero-editorial">
        <div className="hero-editorial-badge">
          <BookOpen size={14} />
          <span>Igreja Evangélica dos Irmãos em Angola</span>
        </div>

        <h1 className="hero-editorial-title">
          HINOS & CÂNTICOS
        </h1>

        <p className="hero-editorial-subtitle">
          Edição Digital Oficial • 581 Hinos da Fé Cristã e Canto Congregacional
        </p>

        {/* Módulo de Salto Rápido e Pesquisa */}
        <div className="hero-quick-access-box">
          <div
            onClick={() => navigate('/pesquisar')}
            className="editorial-search-bar"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/pesquisar')}
          >
            <Search size={18} className="search-bar-icon" />
            <span className="search-bar-placeholder">
              Pesquisar por número, título ou letra...
            </span>
            <span className="search-bar-btn">
              Buscar
            </span>
          </div>

          {/* Seletor Numérico Tátil Embutido */}
          <div style={{ marginTop: 12 }}>
            <QuickNumberPad />
          </div>
        </div>
      </section>

      {/* Faixa de Hinos Recentes e Favoritos */}
      {(history.length > 0 || favorites.length > 0) && (
        <div className="recent-favorites-deck">
          {history.length > 0 && (
            <div className="deck-card">
              <div className="deck-header">
                <span className="deck-title">
                  <Clock size={15} color="var(--red-primary)" />
                  Últimos Consultados
                </span>
                <Link to="/historico" className="deck-link">
                  Ver histórico ({history.length})
                </Link>
              </div>

              <div className="deck-scroll">
                {history.slice(0, 4).map((h) => (
                  <Link
                    key={h.numero}
                    to={`/hino/${formatHinoNumero(h.numero)}`}
                    className="deck-item"
                  >
                    <span className="deck-item-number">Nº {formatHinoNumero(h.numero)}</span>
                    <span className="deck-item-title">{h.titulo}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {favorites.length > 0 && (
            <div className="deck-card">
              <div className="deck-header">
                <span className="deck-title">
                  <Heart size={15} color="var(--red-primary)" fill="var(--red-primary)" />
                  Hinos Favoritos
                </span>
                <Link to="/favoritos" className="deck-link">
                  Ver todos ({favorites.length})
                </Link>
              </div>

              <div className="deck-scroll">
                {favorites.slice(0, 4).map((fav) => (
                  <Link
                    key={fav.numero}
                    to={`/hino/${formatHinoNumero(fav.numero)}`}
                    className="deck-item"
                  >
                    <span className="deck-item-number">Nº {formatHinoNumero(fav.numero)}</span>
                    <span className="deck-item-title">{fav.titulo}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Barra de Abas de Navegação Congregacional */}
      <div className="hymnal-nav-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('todos')}
          className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
        >
          <BookOpen size={16} />
          <span>Todos os Hinos</span>
          <span className="tab-counter">581</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('indice')}
          className={`tab-btn ${activeTab === 'indice' ? 'active' : ''}`}
        >
          <ListOrdered size={16} />
          <span>Índice Numérico</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('temas')}
          className={`tab-btn ${activeTab === 'temas' ? 'active' : ''}`}
        >
          <Layers size={16} />
          <span>Temas & Assuntos</span>
        </button>
      </div>

      {/* Conteúdo da Aba 1: Todos os Hinos */}
      {activeTab === 'todos' && (
        <section>
          <div className="hymnal-list-header">
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Coleção de Hinos
              </h2>
              {pagination && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Página {pagination.page} de {pagination.totalPages} • Total: {pagination.total} hinos
                </span>
              )}
            </div>

            <button
              onClick={toggleSort}
              className="btn btn-secondary sort-toggle-btn"
              title="Inverter ordem"
            >
              <ArrowDownUp size={14} />
              <span>{sortOrder === 'asc' ? 'Crescente (1→581)' : 'Decrescente (581→1)'}</span>
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton" style={{ height: 86, borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--red-primary)' }}>
              <p>{error}</p>
              <button onClick={() => loadHinos(currentPage, sortOrder)} className="btn btn-primary" style={{ marginTop: 12 }}>
                Tentar novamente
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {hinos.map((hino) => (
                <HymnCard
                  key={hino.numero}
                  numero={hino.numero}
                  titulo={hino.titulo}
                  autor={hino.autor}
                  totalEstrofes={hino.totalEstrofes}
                  primeiraEstrofe={hino.primeiraEstrofe}
                />
              ))}
            </div>
          )}

          {/* Paginação Elegante */}
          {pagination && pagination.totalPages > 1 && (
            <div className="hymnal-pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage || loading}
                className="btn btn-secondary pagination-nav-btn"
              >
                Página Anterior
              </button>

              <span className="pagination-indicator">
                {currentPage} / {pagination.totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage || loading}
                className="btn btn-secondary pagination-nav-btn"
              >
                Próxima Página
              </button>
            </div>
          )}
        </section>
      )}

      {/* Conteúdo da Aba 2: Índice Numérico Rápido */}
      {activeTab === 'indice' && (
        <section>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px' }}>
              Índice Numérico de Hinos
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Toque em qualquer número para abrir a letra instantaneamente sem navegar por páginas.
            </p>
          </div>
          <NumericIndexView />
        </section>
      )}

      {/* Conteúdo da Aba 3: Temas & Assuntos Canônicos */}
      {activeTab === 'temas' && (
        <section>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px' }}>
              Índice Temático Congregacional
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Hinos agrupados pelos momentos do culto, estudo bíblico e cerimónias da IEIA.
            </p>
          </div>
          <ThematicCategoriesView />
        </section>
      )}
    </div>
  );
};
