import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Printer,
  QrCode,
  ExternalLink,
  MessageCircle,
  Smartphone,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useToast } from './Toast';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const { logoSrc } = useTheme();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Determina a URL para partilha (usa window.location.origin)
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://hinariodigital.app';
  const shareMessage = `Aceda ao hinário digital oficial da IEIA com todos os 581 hinos e cânticos com funcionamento 100% offline: ${appUrl}`;

  useEffect(() => {
    if (isOpen) {
      // Gera QR Code em alta resolução (1000x1000) para visualização e download
      QRCode.toDataURL(appUrl, {
        width: 1000,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      })
        .then((url) => {
          setQrDataUrl(url);
        })
        .catch((err) => {
          console.error('Erro ao gerar QR Code:', err);
        });
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      showToast('Link do aplicativo copiado para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Não foi possível copiar o link automaticamente.', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hinos & Cânticos — IEIA',
          text: 'Consulte, cante e guarde todos os 581 hinos da Igreja Evangélica dos Irmãos em Angola com funcionamento offline.',
          url: appUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          showToast('Erro ao partilhar.', 'error');
        }
      }
    } else {
      // Fallback para WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;

    // Cria um link temporário para download do QR Code em alta definição
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qrcode_hinos_canticos_ieia.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Imagem do QR Code baixada com sucesso (PNG Alta Resolução)!', 'success');
  };

  const handlePrintFlyer = () => {
    // Cria uma janela limpa com o layout para impressão do cartaz da igreja
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Permita popups no navegador para imprimir o cartaz.', 'info');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <title>Cartaz QR Code — Hinos & Cânticos IEIA</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            text-align: center;
            color: #0F172A;
            margin: 0;
            padding: 20px;
          }
          .flyer-card {
            border: 3px solid #C81D25;
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 580px;
            margin: 0 auto;
          }
          .logo { width: 90px; height: 90px; object-fit: contain; margin-bottom: 14px; }
          h1 { color: #C81D25; font-size: 32px; margin: 0 0 6px; letter-spacing: -0.02em; font-weight: 800; }
          h2 { color: #475569; font-size: 16px; margin: 0 0 24px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
          .qr-box {
            background: #FFFFFF;
            border: 2px dashed #CBD5E1;
            border-radius: 16px;
            padding: 20px;
            display: inline-block;
            margin-bottom: 24px;
          }
          .qr-img { width: 260px; height: 260px; display: block; }
          .instructions {
            background: #F8FAFC;
            border-radius: 12px;
            padding: 16px 20px;
            text-align: left;
            margin-bottom: 24px;
            font-size: 14px;
            color: #334155;
            line-height: 1.6;
          }
          .instructions ol { margin: 8px 0 0; padding-left: 20px; }
          .instructions li { margin-bottom: 4px; }
          .footer-note { font-size: 13px; color: #64748B; font-weight: 500; }
          .url-badge { font-weight: 700; color: #C81D25; }
        </style>
      </head>
      <body>
        <div class="flyer-card">
          <img src="${logoSrc}" class="logo" alt="IEIA">
          <h1>HINOS & CÂNTICOS</h1>
          <h2>Igreja Evangélica dos Irmãos em Angola</h2>
          
          <div class="qr-box">
            <img src="${qrDataUrl}" class="qr-img" alt="QR Code">
          </div>

          <div class="instructions">
            <strong>Como aceder e instalar no seu telemóvel:</strong>
            <ol>
              <li>Aponte a câmara do seu smartphone para o código acima.</li>
              <li>Toque na notificação ou abra o link <span class="url-badge">${appUrl}</span>.</li>
              <li>Toque em <strong>"Instalar"</strong> para ter todos os 581 hinos offline no telemóvel!</li>
            </ol>
          </div>

          <p class="footer-note">
            Não gasta memória da loja de apps • 100% Gratuito • Funciona sem dados móveis
          </p>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content share-app-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480 }}
      >
        {/* Cabeçalho */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="share-modal-icon-badge">
              <QrCode size={20} color="var(--red-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Partilhar Aplicativo
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Hinos & Cânticos — IEIA
              </p>
            </div>
          </div>

          <button onClick={onClose} className="icon-btn" aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div style={{ padding: '18px 24px 24px' }}>
          {/* Caixa do QR Code em Destaque */}
          <div className="share-qr-display-card">
            <div className="share-qr-img-wrapper">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code para aceder ao Hinos & Cânticos"
                  className="share-qr-image"
                />
              ) : (
                <div className="skeleton" style={{ width: 180, height: 180, borderRadius: 12 }} />
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 650, color: 'var(--text-primary)' }}>
                <Smartphone size={15} color="var(--red-primary)" />
                Aponte a câmara do telemóvel para aceder
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Permite aos irmãos abrirem e instalarem o hinário no próprio smartphone
              </p>
            </div>

            {/* Ações Rápidas do QR Code (Download e Impressão) */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14, width: '100%' }}>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="btn btn-secondary share-qr-action-btn"
                title="Salvar imagem PNG em alta resolução"
              >
                <Download size={15} />
                <span>Salvar QR Code (PNG)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintFlyer}
                className="btn btn-secondary share-qr-action-btn"
                title="Imprimir cartaz para afixar na igreja ou projetar"
              >
                <Printer size={15} />
                <span>Imprimir Cartaz</span>
              </button>
            </div>
          </div>

          {/* Divisor Elegante */}
          <div className="share-modal-divider">
            <span>OU PARTILHE POR LINK</span>
          </div>

          {/* Campo de Copiar Link */}
          <div className="share-link-input-wrapper">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="share-link-input"
              aria-label="Link do aplicativo"
            />
            <button
              onClick={handleCopyLink}
              className="btn btn-primary share-copy-btn"
              title="Copiar link para a área de transferência"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Botão de Envio Direto (WhatsApp / Share API) */}
          <div style={{ marginTop: 12 }}>
            <button
              onClick={handleNativeShare}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 650 }}
            >
              <Share2 size={16} color="var(--red-primary)" />
              <span>Enviar via WhatsApp ou Redes Sociais</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
