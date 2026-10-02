import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { IHistoryItem } from '../types/hino';
import { formatHinoNumero, formatTimeAgo } from '../utils/format';

interface SwipeableHistoryItemProps {
  item: IHistoryItem;
  onDelete: (numero: number) => void;
}

export const SwipeableHistoryItem: React.FC<SwipeableHistoryItemProps> = ({ item, onDelete }) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentXRef = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const hasMovedSignificantly = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const ACTION_WIDTH = 84; // Largura do botão eliminar revelado
  const FULL_SWIPE_THRESHOLD = 150; // Arrastar além disso elimina direto

  // Início do toque / clique
  const handlePointerDown = (e: React.PointerEvent) => {
    // Apenas botão principal (botão esquerdo no rato)
    if (e.button !== 0) return;

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    currentXRef.current = e.clientX;
    isHorizontalSwipe.current = null;
    hasMovedSignificantly.current = false;
    setIsDragging(true);
  };

  // Movimento de arrasto
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const deltaX = currentX - startXRef.current;
    const deltaY = currentY - startYRef.current;

    // Detecta se o movimento é primariamente horizontal ou vertical
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
        if (isHorizontalSwipe.current) {
          // Captura ponteiro para manter arrasto fluido
          try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          } catch {
            // Alguns browsers em ambiente móvel ignoram sem erro
          }
        }
      }
    }

    // Se o usuário estiver rolando verticalmente a página, não bloqueia o scroll nativo
    if (isHorizontalSwipe.current === false) return;

    if (Math.abs(deltaX) > 8) {
      hasMovedSignificantly.current = true;
    }

    currentXRef.current = currentX;

    // Se estava aberto (-ACTION_WIDTH), permite arrastar para fechar (direita) ou estender mais para esquerda
    const baseOffset = isOpen ? -ACTION_WIDTH : 0;
    const newOffset = baseOffset + deltaX;

    if (newOffset <= 0) {
      // Resistência ao passar do botão de ação
      if (newOffset < -ACTION_WIDTH) {
        const extra = newOffset + ACTION_WIDTH;
        setOffsetX(-ACTION_WIDTH + extra * 0.5);
      } else {
        setOffsetX(newOffset);
      }
    } else {
      // Pequena elasticidade ao arrastar para a direita quando fechado
      setOffsetX(Math.min(newOffset * 0.15, 20));
    }
  };

  // Fim do toque / clique
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignora se não houver captura ativa
    }

    // Se arrastou muito para a esquerda, aciona eliminação com animação completa
    if (offsetX < -FULL_SWIPE_THRESHOLD) {
      triggerDelete();
      return;
    }

    // Se arrastou além da metade do botão de ação, trava aberto revelando o botão
    if (offsetX < -ACTION_WIDTH / 2) {
      setOffsetX(-ACTION_WIDTH);
      setIsOpen(true);
    } else {
      setOffsetX(0);
      setIsOpen(false);
    }

    isHorizontalSwipe.current = null;
  };

  const triggerDelete = () => {
    setIsDeleting(true);
    const containerWidth = containerRef.current?.offsetWidth ?? 400;
    setOffsetX(-containerWidth);
    setTimeout(() => {
      onDelete(item.numero);
    }, 280);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Se o card sofreu arrasto ou estava aberto, impede a navegação para o hino
    if (hasMovedSignificantly.current || isOpen || Math.abs(offsetX) > 5) {
      e.preventDefault();
      e.stopPropagation();
      setOffsetX(0);
      setIsOpen(false);
    }
  };

  const handleDeleteBtnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerDelete();
  };

  return (
    <div
      ref={containerRef}
      className={`swipeable-history-container ${isDeleting ? 'deleting' : ''}`}
      style={{
        maxHeight: isDeleting ? 0 : 120,
        marginBottom: isDeleting ? 0 : 10,
        opacity: isDeleting ? 0 : 1,
      }}
    >
      {/* Fundo Vermelho de Ação Eliminar */}
      <div className="swipe-delete-background" onClick={handleDeleteBtnClick}>
        <div className="swipe-delete-btn" role="button" aria-label={`Eliminar hino ${item.numero} do histórico`}>
          <Trash2 size={20} />
          <span>Eliminar</span>
        </div>
      </div>

      {/* Cartão de Conteúdo (Desliza sobre o fundo) */}
      <div
        className="swipe-foreground"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        <Link
          to={`/hino/${formatHinoNumero(item.numero)}`}
          className="hymn-card"
          onClick={handleCardClick}
          style={{ margin: 0 }}
        >
          <div className="hymn-card-left">
            <div className="hymn-number-badge">
              {formatHinoNumero(item.numero)}
            </div>

            <div className="hymn-info">
              <h3 className="hymn-title">{item.titulo}</h3>
              <div className="hymn-subtitle">
                {item.autor ? <span>{item.autor}</span> : <span>Autor desconhecido</span>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {formatTimeAgo(item.dataAcesso)}
            </span>

            {/* Botão de eliminar discreto para computadores / Desktop */}
            <button
              onClick={handleDeleteBtnClick}
              className="history-desktop-delete-btn"
              title="Remover este hino do histórico"
              aria-label="Remover do histórico"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};
