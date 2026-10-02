import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Type,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Copy,
  Hash,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { hinosApi } from '../services/api/hinosApi';
import { IHinoDetail } from '../types/hino';
import { useFavorites } from '../hooks/useFavorites';
import { useHistory } from '../hooks/useHistory';
import { ShareModal } from '../components/ShareModal';
import { QuickNumberPad } from '../components/QuickNumberPad';
import { formatHinoNumero } from '../utils/format';
import { useToast } from '../components/Toast';

type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type FontFamily = 'sans' | 'serif';

const FONT_SCALES: Record<FontSize, { label: string; size: string; lineHeight: string }> = {
  xs: { label: '85%', size: '0.96rem', lineHeight: '1.68' },
  sm: { label: '92%', size: '1.05rem', lineHeight: '1.74' },
  md: { label: '100%', size: '1.16rem', lineHeight: '1.82' },
  lg: { label: '115%', size: '1.34rem', lineHeight: '1.9' },
  xl: { label: '130%', size: '1.54rem', lineHeight: '2.0' },
  xxl: { label: '150%', size: '1.80rem', lineHeight: '2.1' },
};

const FONT_SIZE_KEYS: FontSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export const HymnDetailPage: React.FC = () => {
  const { numero: rawNumero } = useParams<{ numero: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const numero = parseInt(rawNumero || '1', 10);

  const [hino, setHino] = useState<IHinoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modo Culto / Foco (Oculta barras e maximiza área de leitura)
  const [isWorshipMode, setIsWorshipMode] = useState(false);
  const [showJumpModal, setShowJumpModal] = useState(false);

  // Preferências tipográficas
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('hinario_fontsize') as FontSize;
    return saved && FONT_SCALES[saved] ? saved : 'md';
  });

  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    return (localStorage.getItem('hinario_fontfamily') as FontFamily) || 'serif';
  });

  const [isShareOpen, setIsShareOpen] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToHistory } = useHistory();

  // Suporte a gestos de virar página (Swipe Left/Right)
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const favorited = hino ? isFavorite(hino.numero) : false;

  // Carregar dados do hino
  const loadHino = useCallback(async (num: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await hinosApi.getHinoByNumero(num);
      setHino(data);
      addToHistory(data);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err: any) {
      setError(err.message || 'Hino não encontrado.');
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  useEffect(() => {
    if (!isNaN(numero) && numero >= 1 && numero <= 581) {
      loadHino(numero);
    } else {
      setError('Número de hino inválido.');
      setLoading(false);
    }
  }, [numero, loadHino]);

  // Screen Wake Lock API (Evita que o ecrã do telemóvel apague enquanto canta)
  useEffect(() => {
    let wakeLockSentinel: any = null;
    if ('wakeLock' in navigator) {
      (navigator as any).wakeLock
        .request('screen')
        .then((lock: any) => {
          wakeLockSentinel = lock;
        })
        .catch(() => {
          // Permissão não concedida ou não suportada no momento
        });
    }

    return () => {
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, [numero]);

  // Gestos de Touch para virar página
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isHorizontalSwipe.current === null) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (deltaX > 8 || deltaY > 8) {
        isHorizontalSwipe.current = deltaX > deltaY;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isHorizontalSwipe.current) {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      // Deslizar para a esquerda (> 75px) = Hino Seguinte
      if (deltaX < -75 && hino?.seguinte) {
        navigate(`/hino/${formatHinoNumero(hino.seguinte.numero)}`);
        showToast(`Hino ${hino.seguinte.numero}`, 'info');
      }
      // Deslizar para a direita (> 75px) = Hino Anterior
      else if (deltaX > 75 && hino?.anterior) {
        navigate(`/hino/${formatHinoNumero(hino.anterior.numero)}`);
        showToast(`Hino ${hino.anterior.numero}`, 'info');
      }
    }
    isHorizontalSwipe.current = null;
  };

  const changeFontSize = (delta: number) => {
    const currentIndex = FONT_SIZE_KEYS.indexOf(fontSize);
    const nextIndex = currentIndex + delta;
    if (nextIndex >= 0 && nextIndex < FONT_SIZE_KEYS.length) {
      const nextSize = FONT_SIZE_KEYS[nextIndex];
      setFontSize(nextSize);
      localStorage.setItem('hinario_fontsize', nextSize);
      showToast(`Tamanho da letra: ${FONT_SCALES[nextSize].label}`, 'info');
    }
  };

  const toggleFontFamily = () => {
    const next = fontFamily === 'sans' ? 'serif' : 'sans';
    setFontFamily(next);
    localStorage.setItem('hinario_fontfamily', next);
    showToast(`Fonte: ${next === 'serif' ? 'Serifada (Clássica)' : 'Sem Serifa (Moderna)'}`, 'info');
  };

  const handleToggleFavorite = () => {
    if (!hino) return;
    const added = toggleFavorite({
      numero: hino.numero,
      titulo: hino.titulo,
      autor: hino.autor,
    });
    showToast(
      added ? `Hino ${hino.numero} adicionado aos favoritos!` : `Hino ${hino.numero} removido dos favoritos!`,
      added ? 'success' : 'info'
    );
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Try modern Clipboard API first (requires HTTPS or localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fall through to legacy fallback
      }
    }
    // Legacy fallback: create a temporary textarea and use execCommand
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  };

  const copyStanza = async (e: React.MouseEvent, text: string, stanzaNum: number | string) => {
    e.stopPropagation();
    const ok = await copyToClipboard(`[Hino ${hino?.numero} - Estrofe ${stanzaNum}]\n${text}`);
    if (ok) {
      showToast(`Estrofe ${stanzaNum} copiada!`, 'success');
    } else {
      showToast('Não foi possível copiar. Tente selecionar o texto manualmente.', 'error');
    }
  };

  const copyFullHymn = async () => {
    if (!hino) return;
    const fullText = `HINO ${formatHinoNumero(hino.numero)}: ${hino.titulo}\nIEIA - Hinos & Cânticos\n\n${hino.letraCompleta}`;
    const ok = await copyToClipboard(fullText);
    if (ok) {
      showToast('Letra completa do hino copiada!', 'success');
    } else {
      showToast('Não foi possível copiar. Tente selecionar o texto manualmente.', 'error');
    }
  };

  const getFontSizeStyle = () => {
    const scale = FONT_SCALES[fontSize] || FONT_SCALES.md;
    return {
      fontSize: scale.size,
      lineHeight: scale.lineHeight,
    };
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 0' }}>
        <div className="skeleton" style={{ height: 48, width: '30%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 36, width: '75%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 32 }} />
        <div className="skeleton" style={{ height: 140, marginBottom: 20, borderRadius: 'var(--radius-md)' }} />
        <div className="skeleton" style={{ height: 140, marginBottom: 20, borderRadius: 'var(--radius-md)' }} />
      </div>
    );
  }

  if (error || !hino) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8, color: 'var(--red-primary)' }}>
          Hino não encontrado
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          {error || `O hino número ${rawNumero} não existe ou não pôde ser carregado.`}
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={18} /> Voltar para a Coleção
        </Link>
      </div>
    );
  }

  return (
    <article
      className={`reader-container ${isWorshipMode ? 'worship-mode-active' : ''}`}
      style={{ maxWidth: 740, margin: '0 auto' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Botão de Saída do Modo Culto (Discreto e fixo no topo se ativo) */}
      {isWorshipMode && (
        <div className="worship-mode-header-bar">
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Modo Culto • Hino {formatHinoNumero(hino.numero)}
          </span>
          <button
            onClick={() => setIsWorshipMode(false)}
            className="worship-exit-btn"
            title="Sair do Modo Culto"
          >
            <Minimize2 size={16} /> Sair do Modo Culto
          </button>
        </div>
      )}

      {/* Toolbar Superior Editorial de Leitura */}
      {!isWorshipMode && (
        <div className="reader-toolbar">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
            aria-label="Voltar"
          >
            <ArrowLeft size={16} /> Início
          </button>

          {/* Salto Rápido de Hino Inline */}
          <button
            onClick={() => setShowJumpModal(true)}
            className="reader-jump-chip"
            title="Mudar rapidamente de hino"
          >
            <Hash size={14} />
            <span>Hino {hino.numero}</span>
          </button>

          {/* Controles de Leitura: Tamanho, Fonte, Modo Culto, Favoritos e Partilha */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="reader-controls-bar">
              <button
                onClick={() => changeFontSize(-1)}
                disabled={fontSize === 'xs'}
                className="font-size-btn"
                title="Diminuir texto (A-)"
                aria-label="Diminuir texto"
              >
                A-
              </button>
              <span className="font-size-indicator" title="Escala da letra">
                {FONT_SCALES[fontSize]?.label || '100%'}
              </span>
              <button
                onClick={() => changeFontSize(1)}
                disabled={fontSize === 'xxl'}
                className="font-size-btn"
                title="Aumentar texto (A+)"
                aria-label="Aumentar texto"
              >
                A+
              </button>
              <div style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 2px' }} />
              <button
                onClick={toggleFontFamily}
                className="font-size-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                title={fontFamily === 'sans' ? 'Mudar para fonte clássica (Serifada)' : 'Mudar para fonte moderna (Sans)'}
              >
                <Type size={14} />
                <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>{fontFamily === 'sans' ? 'Sans' : 'Serif'}</span>
              </button>
            </div>

            {/* Botão Modo Culto em Destaque na Toolbar */}
            <button
              onClick={() => {
                setIsWorshipMode(true);
                showToast('Modo Culto ativado — Ecrã limpo para cantar!', 'info');
              }}
              className="worship-mode-btn"
              title="Ativar Modo Culto (Ecrã limpo sem distrações para cantar)"
              aria-label="Ativar Modo Culto"
            >
              <BookOpen size={15} />
              <span>Modo Culto</span>
            </button>

            {/* Favorito */}
            <button
              onClick={handleToggleFavorite}
              className="icon-btn"
              style={{ color: favorited ? 'var(--red-primary)' : 'inherit' }}
              aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              title={favorited ? 'Remover dos favoritos' : 'Favoritar'}
            >
              <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
            </button>

            {/* Partilha */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="icon-btn"
              aria-label="Partilhar hino"
              title="Partilhar"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Cabeçalho Sagrado do Hino */}
      <header className="reader-editorial-header">
        <div className="reader-number-seal">
          <span className="seal-label">HINO</span>
          <span className="seal-value">{formatHinoNumero(hino.numero)}</span>
        </div>

        <h1 className="reader-editorial-title">
          {hino.titulo}
        </h1>

        <div className="reader-editorial-meta">
          {hino.autor ? (
            <span className="reader-author-badge">
              <strong>Autor:</strong> {hino.autor}
            </span>
          ) : (
            <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Autor desconhecido</span>
          )}
          <span className="meta-separator">•</span>
          <span>{hino.estrofes.length} {hino.estrofes.length === 1 ? 'estrofe' : 'estrofes'}</span>
          <span className="meta-separator">•</span>
          <button onClick={copyFullHymn} className="reader-copy-all-btn" title="Copiar letra integral">
            <Copy size={13} /> Copiar tudo
          </button>
        </div>

        {/* Barra de Ações Rápidas em Destaque do Hino */}
        <div className="reader-hero-action-bar">
          <button
            onClick={() => {
              setIsWorshipMode(true);
              showToast('Modo Culto ativado — Ecrã limpo para cantar!', 'info');
            }}
            className="reader-action-pill-btn primary"
            title="Ativar Modo Culto em Tela Cheia para cantar na igreja"
          >
            <BookOpen size={16} />
            <span>Modo Culto (Ecrã Limpo)</span>
          </button>

          <button
            onClick={handleToggleFavorite}
            className="reader-action-pill-btn"
            style={{ color: favorited ? 'var(--red-primary)' : 'inherit' }}
            title={favorited ? 'Remover dos favoritos' : 'Favoritar'}
          >
            <Heart size={15} fill={favorited ? 'currentColor' : 'none'} color={favorited ? 'var(--red-primary)' : 'currentColor'} />
            <span>{favorited ? 'Favoritado' : 'Favoritar'}</span>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="reader-action-pill-btn"
            title="Partilhar este hino"
          >
            <Share2 size={15} />
            <span>Partilhar</span>
          </button>
        </div>
      </header>

      {/* Dica de navegação por deslize (Aparece de forma suave) */}
      <div className="swipe-hint-banner">
        <span>← Deslize para virar páginas (Anterior / Seguinte) →</span>
      </div>

      {/* Corpo da Letra (Estrofes & Coro) */}
      <section className={`reader-body font-${fontFamily}`} style={getFontSizeStyle()}>
        {hino.estrofes.map((estrofe) => {
          const isCoro = estrofe.tipo.toLowerCase() === 'coro' || estrofe.tipo.toLowerCase() === 'refrão';

          if (isCoro) {
            return (
              <div
                key={estrofe.id}
                className="chorus-block editorial-chorus"
                role="region"
                aria-label="Coro"
                onClick={(e) => copyStanza(e, estrofe.texto, 'Coro')}
                title="Toque para copiar o Coro"
              >
                <div className="chorus-badge">
                  <Sparkles size={13} />
                  <span>CORO</span>
                </div>
                <div className="chorus-text">
                  {estrofe.texto}
                </div>
              </div>
            );
          }

          return (
            <div
              key={estrofe.id}
              className="stanza-block editorial-stanza"
              onClick={(e) => copyStanza(e, estrofe.texto, estrofe.numero)}
              title={`Toque para copiar a Estrofe ${estrofe.numero}`}
            >
              <div className="stanza-header">
                <span className="stanza-drop-number">{estrofe.numero}</span>
              </div>
              <div className="stanza-text">
                {estrofe.texto}
              </div>
            </div>
          );
        })}
      </section>

      {/* Rodapé de Navegação Anterior / Seguinte */}
      <footer className="reader-nav-footer">
        {hino.anterior ? (
          <Link
            to={`/hino/${formatHinoNumero(hino.anterior.numero)}`}
            className="btn btn-secondary reader-nav-prev-btn"
            title={`Hino ${hino.anterior.numero} — ${hino.anterior.titulo}`}
          >
            <ChevronLeft size={20} />
            <div style={{ textAlign: 'left', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hino Anterior</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 650, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {formatHinoNumero(hino.anterior.numero)} • {hino.anterior.titulo}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {hino.seguinte ? (
          <Link
            to={`/hino/${formatHinoNumero(hino.seguinte.numero)}`}
            className="btn btn-secondary reader-nav-next-btn"
            style={{ marginLeft: 'auto' }}
            title={`Hino ${hino.seguinte.numero} — ${hino.seguinte.titulo}`}
          >
            <div style={{ textAlign: 'right', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hino Seguinte</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 650, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {formatHinoNumero(hino.seguinte.numero)} • {hino.seguinte.titulo}
              </div>
            </div>
            <ChevronRight size={20} />
          </Link>
        ) : (
          <div />
        )}
      </footer>

      {/* Botão Flutuante de Modo Culto (Sempre visível enquanto canta e rola) */}
      {!isWorshipMode && (
        <button
          onClick={() => {
            setIsWorshipMode(true);
            showToast('Modo Culto ativado — Ecrã limpo para cantar!', 'info');
          }}
          className="floating-worship-btn"
          title="Ativar Modo Culto em Tela Cheia"
          aria-label="Ativar Modo Culto"
        >
          <BookOpen size={18} />
          <span>Modo Culto</span>
        </button>
      )}

      {/* Modal de Salto Rápido de Hino */}
      {showJumpModal && (
        <div className="modal-backdrop" onClick={() => setShowJumpModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Ir Para Outro Hino
              </h3>
              <button onClick={() => setShowJumpModal(false)} className="icon-btn">
                ✕
              </button>
            </div>
            <div style={{ padding: '16px 20px 24px' }}>
              <QuickNumberPad onClose={() => setShowJumpModal(false)} isModal={true} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Partilha */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        numero={hino.numero}
        titulo={hino.titulo}
        autor={hino.autor}
      />
    </article>
  );
};
