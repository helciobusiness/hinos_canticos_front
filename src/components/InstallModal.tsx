import React from 'react';
import { X, Download, Share, PlusSquare, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useTheme } from '../hooks/useTheme';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWA();
  const { logoSrc } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logoSrc} alt="IEIA" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Instalar Hinos & Cânticos</h3>
          </div>
          <button onClick={onClose} className="icon-btn" aria-label="Fechar janela">
            <X size={18} />
          </button>
        </div>

        {/* Card de Apresentação do App */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'var(--bg-app)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 20,
            border: '1px solid var(--border-subtle)',
          }}
        >
          <img
            src={logoSrc}
            alt="Ícone do Hinos & Cânticos"
            style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }}
          />
          <div>
            <h4 style={{ fontWeight: 650, fontSize: '0.98rem', margin: 0 }}>Hinos & Cânticos — IEIA</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Igreja Evangélica dos Irmãos em Angola
            </p>
            <span style={{ fontSize: '0.74rem', color: 'var(--red-primary)', fontWeight: 600 }}>
              Aplicativo Oficial • 100% Offline
            </span>
          </div>
        </div>

        {isInstalled ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={48} color="var(--red-primary)" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
              O aplicativo já está instalado!
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Você já pode aceder diretamente pelo ícone na tela inicial ou lista de aplicativos do seu dispositivo, mesmo sem Internet.
            </p>
          </div>
        ) : isInstallable ? (
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 20 }}>
              Instale o Hinos & Cânticos no seu dispositivo para ter todos os 581 hinos com acesso instantâneo na palma da mão, mesmo sem sinal de rede ou dados móveis.
            </p>
            <button
              onClick={async () => {
                const ok = await promptInstall();
                if (ok) onClose();
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginBottom: 12 }}
            >
              <Download size={20} />
              Instalar Aplicativo Agora
            </button>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Não consome espaço na memória como um aplicativo tradicional da loja.
            </p>
          </div>
        ) : isIOS ? (
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
              No iPhone e iPad (Safari), siga estes passos rápidos para instalar:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--red-light)',
                    color: 'var(--red-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  1
                </div>
                <div>
                  <p style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                    Toque no botão <span style={{ color: 'var(--red-primary)' }}>Partilhar</span> no Safari
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Ícone do quadrado com seta para cima <Share size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> na barra inferior do Safari.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--red-light)',
                    color: 'var(--red-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  2
                </div>
                <div>
                  <p style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                    Selecione <span style={{ color: 'var(--red-primary)' }}>Adicionar ao ecrã principal</span>
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Role as opções para baixo até encontrar <PlusSquare size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> "Adicionar ao ecrã principal".
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--red-light)',
                    color: 'var(--red-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  3
                </div>
                <div>
                  <p style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                    Toque em <span style={{ color: 'var(--red-primary)' }}>Adicionar</span>
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    No canto superior direito, confirme o toque em "Adicionar". Pronto!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
              Para instalar este aplicativo no seu navegador atual:
            </p>
            <div style={{ background: 'var(--stanza-pill-bg)', padding: 14, borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>Instalação manual:</p>
              <p style={{ color: 'var(--text-secondary)' }}>
                Clique no menu do navegador (três pontos no canto superior direito) e selecione <strong>"Instalar Hinos & Cânticos"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
              </p>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
