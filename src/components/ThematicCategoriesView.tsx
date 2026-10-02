import React, { useState, useEffect } from 'react';
import { CATEGORIAS_HINOS, IHymnCategory } from '../data/categories';
import { IHinoListItem } from '../types/hino';
import { getAllOfflineHinos } from '../services/offline/offlineDatabase';
import { HymnCard } from './HymnCard';
import { Music, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';

export const ThematicCategoriesView: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState<string | null>(CATEGORIAS_HINOS[0].id);
  const [allHinos, setAllHinos] = useState<IHinoListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOfflineHinos().then((hinos) => {
      setAllHinos(
        hinos.map((h) => ({
          id: h.id,
          numero: h.numero,
          numeroFormatado: h.numeroFormatado,
          titulo: h.titulo,
          autor: h.autor,
          totalEstrofes: h.estrofes.length,
          primeiraEstrofe: h.estrofes[0]?.texto || '',
        }))
      );
      setLoading(false);
    });
  }, []);

  const activeCategory = CATEGORIAS_HINOS.find((c) => c.id === selectedCatId);

  const categoryHinos = activeCategory
    ? allHinos.filter(
        (h) =>
          h.numero >= activeCategory.faixaNumeros.min &&
          h.numero <= activeCategory.faixaNumeros.max
      )
    : [];

  return (
    <div className="thematic-categories-container">
      {/* Lista de Categorias em Chips Horizontais */}
      <div className="category-chips-scroll">
        {CATEGORIAS_HINOS.map((cat) => {
          const isActive = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCatId(cat.id)}
              className={`category-chip-btn ${isActive ? 'active' : ''}`}
            >
              <span>{cat.nome}</span>
              <span className="category-chip-range">
                ({cat.faixaNumeros.min}–{cat.faixaNumeros.max})
              </span>
            </button>
          );
        })}
      </div>

      {/* Descrição do Tema Selecionado */}
      {activeCategory && (
        <div className="thematic-banner-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="thematic-icon-wrapper">
              <BookOpen size={20} color="var(--red-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                {activeCategory.nome}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                {activeCategory.descricao} • {categoryHinos.length} hinos recomendados
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Hinos do Tema */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
        {loading ? (
          <div className="skeleton" style={{ height: 120 }} />
        ) : categoryHinos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
            Nenhum hino encontrado nesta categoria.
          </div>
        ) : (
          categoryHinos.map((hino) => (
            <HymnCard
              key={hino.numero}
              numero={hino.numero}
              titulo={hino.titulo}
              autor={hino.autor}
              totalEstrofes={hino.totalEstrofes}
              primeiraEstrofe={hino.primeiraEstrofe}
            />
          ))
        )}
      </div>
    </div>
  );
};
