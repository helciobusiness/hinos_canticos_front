import React from 'react';
import { RefreshCw, Download, Wifi, WifiOff, X, CheckCircle } from 'lucide-react';

interface UpdateBannerProps {
  needsRefresh: boolean;
  isOfflineReady: boolean;
  isUpdating: boolean;
  onApply: () => void;
  onDismiss: () => void;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({
  needsRefresh,
  isOfflineReady,
  isUpdating,
  onApply,
  onDismiss,
}) => {
  if (!needsRefresh && !isOfflineReady) return null;

  return (
    <div className={`update-banner ${needsRefresh ? 'update-banner--update' : 'update-banner--offline'}`}>
      <div className="update-banner__icon">
        {needsRefresh ? (
          <Download size={18} />
        ) : (
          <CheckCircle size={18} />
        )}
      </div>

      <div className="update-banner__content">
        {needsRefresh ? (
          <>
            <strong>Nova versão disponível!</strong>
            <span>Atualize para obter as melhorias mais recentes.</span>
          </>
        ) : (
          <>
            <strong>Pronto para uso offline</strong>
            <span>Todos os 581 hinos estão guardados no dispositivo.</span>
          </>
        )}
      </div>

      <div className="update-banner__actions">
        {needsRefresh && (
          <button
            onClick={onApply}
            disabled={isUpdating}
            className="update-banner__apply-btn"
            title="Aplicar atualização agora"
          >
            {isUpdating ? (
              <RefreshCw size={14} className="spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            <span>{isUpdating ? 'Atualizando...' : 'Atualizar'}</span>
          </button>
        )}

        <button
          onClick={onDismiss}
          className="update-banner__dismiss-btn"
          title="Dispensar"
          aria-label="Fechar notificação"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

interface SyncButtonProps {
  isUpdating: boolean;
  onCheck: () => void;
  className?: string;
}

/** Botão de sincronização compacto para usar em headers/settings */
export const SyncButton: React.FC<SyncButtonProps> = ({ isUpdating, onCheck, className = '' }) => {
  return (
    <button
      onClick={onCheck}
      disabled={isUpdating}
      className={`sync-update-btn ${className}`}
      title="Verificar atualizações do app"
      aria-label="Verificar atualizações"
    >
      <RefreshCw size={16} className={isUpdating ? 'spin' : ''} />
      <span>{isUpdating ? 'Verificando...' : 'Sincronizar'}</span>
    </button>
  );
};
