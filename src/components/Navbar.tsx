import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Clock, Download, QrCode } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { usePWA } from '../hooks/usePWA';
import { useTheme } from '../hooks/useTheme';

export const Navbar: React.FC<{
  onOpenInstallModal?: () => void;
  onOpenShareAppModal?: () => void;
}> = ({ onOpenInstallModal, onOpenShareAppModal }) => {
  const location = useLocation();
  const { isInstalled } = usePWA();
  const { logoSrc } = useTheme();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-container">
            <img src={logoSrc} alt="IEIA" className="brand-logo-img" />
          </div>
          <div className="brand-title">
            <span className="main">Hinos & Cânticos</span>
            <span className="sub">IEIA</span>
          </div>
        </Link>

        <nav className="nav-desktop-links" aria-label="Navegação principal">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Início
          </Link>
          <Link to="/pesquisar" className={`nav-link ${isActive('/pesquisar') ? 'active' : ''}`}>
            <Search size={16} /> Pesquisar
          </Link>
          <Link to="/favoritos" className={`nav-link ${isActive('/favoritos') ? 'active' : ''}`}>
            <Heart size={16} /> Favoritos
          </Link>
          <Link to="/historico" className={`nav-link ${isActive('/historico') ? 'active' : ''}`}>
            <Clock size={16} /> Histórico
          </Link>
        </nav>

        <div className="navbar-actions">
          {/* Botão de Partilha com QR Code */}
          <button
            onClick={onOpenShareAppModal}
            className="btn btn-secondary navbar-share-btn"
            title="Partilhar aplicativo e baixar QR Code"
            aria-label="Partilhar aplicativo"
          >
            <QrCode size={16} color="var(--red-primary)" />
            <span className="navbar-share-label">Partilhar</span>
          </button>

          {!isInstalled && (
            <button
              onClick={onOpenInstallModal}
              className="btn btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.82rem' }}
              title="Instalar Hinos & Cânticos no seu dispositivo"
            >
              <Download size={15} color="var(--red-primary)" />
              <span className="navbar-install-label">Instalar</span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
