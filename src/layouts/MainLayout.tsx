import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { WifiOff, QrCode } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { InstallModal } from '../components/InstallModal';
import { ShareAppModal } from '../components/ShareAppModal';
import { UpdateBanner, SyncButton } from '../components/UpdateBanner';
import { useTheme } from '../hooks/useTheme';
import { useAppUpdater } from '../hooks/useAppUpdater';

export const MainLayout: React.FC = () => {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShareAppModalOpen, setIsShareAppModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const { logoSrc } = useTheme();
  const {
    needsRefresh,
    isOfflineReady,
    isUpdating,
    applyUpdate,
    dismiss,
    checkForUpdate,
  } = useAppUpdater();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="app-container safe-top">
      {/* Banner de Atualização do PWA (aparece sempre que há nova versão para o telemóvel) */}
      <UpdateBanner
        needsRefresh={needsRefresh}
        isOfflineReady={isOfflineReady}
        isUpdating={isUpdating}
        onApply={applyUpdate}
        onDismiss={dismiss}
      />
      {isOffline && (
        <div
          style={{
            background: 'var(--red-tint)',
            color: 'var(--red-primary)',
            padding: '7px 16px',
            textAlign: 'center',
            fontSize: '0.8rem',
            fontWeight: 650,
            borderBottom: '1px solid rgba(200, 29, 37, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <WifiOff size={15} /> Modo Offline Ativo • Todos os 581 hinos disponíveis
        </div>
      )}

      <Navbar
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenShareAppModal={() => setIsShareAppModalOpen(true)}
      />
      
      <main className="main-content">
        <Outlet />
      </main>

      <footer
        style={{
          marginTop: 'auto',
          padding: '32px 20px',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <img
          src={logoSrc}
          alt="IEIA"
          style={{ width: 44, height: 44, objectFit: 'contain', opacity: 0.9 }}
        />
        <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Igreja Evangélica dos Irmãos em Angola (IEIA)
        </p>
        <p style={{ margin: 0, fontSize: '0.78rem' }}>
          Hinos & Cânticos • Leitura Diurna & Noturna • PWA 100% Offline
        </p>

        {/* Botões de rodapé: Partilha e Sincronização */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
          <button
            onClick={() => setIsShareAppModalOpen(true)}
            className="btn btn-secondary"
            style={{
              padding: '7px 16px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              borderRadius: 'var(--radius-full)',
            }}
            title="Partilhar aplicativo e baixar QR Code para a congregação"
          >
            <QrCode size={16} color="var(--red-primary)" />
            <span>Partilhar Hinário & QR Code</span>
          </button>

          <SyncButton
            isUpdating={isUpdating}
            onCheck={checkForUpdate}
          />
        </div>
      </footer>

      <BottomNav onOpenInstallModal={() => setIsInstallModalOpen(true)} />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <ShareAppModal
        isOpen={isShareAppModalOpen}
        onClose={() => setIsShareAppModalOpen(false)}
      />
    </div>
  );
};
