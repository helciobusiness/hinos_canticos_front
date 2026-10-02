import React from 'react';
import { X, Copy, Share2, MessageCircle, Send } from 'lucide-react';
import { useToast } from './Toast';
import { formatHinoNumero } from '../utils/format';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  numero: number;
  titulo: string;
  autor?: string | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  numero,
  titulo,
  autor,
}) => {
  const { showToast } = useToast();
  if (!isOpen) return null;

  const url = `${window.location.origin}/hino/${formatHinoNumero(numero)}`;
  const shareText = `Hino ${numero} — ${titulo}${autor ? ` (${autor})` : ''} • Hinos & Cânticos\n${url}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copiado para a área de transferência!', 'success');
      onClose();
    } catch {
      showToast('Não foi possível copiar o link automaticamente.', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hino ${numero} — ${titulo}`,
          text: `Leia e cante o hino "${titulo}" em Hinos & Cânticos`,
          url: url,
        });
        onClose();
      } catch (e) {
        // Usuário cancelou
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Hino ${numero} — ${titulo}`)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Partilhar Hino {numero}</h3>
          <button onClick={onClose} className="icon-btn" aria-label="Fechar janela">
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
          {titulo}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button onClick={handleNativeShare} className="btn btn-primary" style={{ width: '100%' }}>
              <Share2 size={18} />
              Partilhar pelo dispositivo
            </button>
          )}

          <button onClick={handleCopyLink} className="btn btn-secondary" style={{ width: '100%' }}>
            <Copy size={18} color="var(--red-primary)" />
            Copiar endereço (URL)
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            <button onClick={handleWhatsApp} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <MessageCircle size={16} color="#25D366" />
              WhatsApp
            </button>

            <button onClick={handleTelegram} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <Send size={16} color="#0088CC" />
              Telegram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
