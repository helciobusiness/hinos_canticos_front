import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';
import { useToast } from '../components/Toast';
import { SwipeableHistoryItem } from '../components/SwipeableHistoryItem';

export const HistoryPage: React.FC = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const { showToast } = useToast();

  const handleDeleteOne = (numero: number) => {
    removeFromHistory(numero);
    showToast(`Hino ${numero} removido do histórico.`, 'info');
  };

  const handleClearAll = () => {
    if (window.confirm('Deseja realmente limpar todo o histórico de leitura?')) {
      clearHistory();
      showToast('Histórico de leitura limpo com sucesso.', 'info');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: 4, letterSpacing: '-0.015em', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={22} color="var(--red-primary)" /> Histórico de Leitura
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Hinos que você consultou recentemente neste dispositivo.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.82rem', color: '#EF4444' }}
            title="Limpar todo o histórico"
          >
            <Trash2 size={15} /> Limpar Tudo
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)' }}>
          <Clock size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
            Histórico vazio
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: 420, margin: '0 auto 24px' }}>
            Os hinos que você consultar aparecerão aqui automaticamente para que você possa retomá-los facilmente.
          </p>
          <Link to="/" className="btn btn-primary">
            Explorar Hinos & Cânticos
          </Link>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>Deslize para a esquerda para eliminar um hino</span>
            <span>{history.length} {history.length === 1 ? 'registado' : 'registados'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {history.map((item) => (
              <SwipeableHistoryItem
                key={`${item.numero}-${item.dataAcesso}`}
                item={item}
                onDelete={handleDeleteOne}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

