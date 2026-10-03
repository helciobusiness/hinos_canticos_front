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
        <Link to="/" className="navbar-brand" title="Hinos & Cânticos — Início">
          <div className="brand-logo-container">
            <img src="/logo_emblem.png" alt="Hinos & Cânticos" className="brand-logo-img" />
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
            <Search size={15} /> Pesquisar
          </Link>
          <Link to="/favoritos" className={`nav-link ${isActive('/favoritos') ? 'active' : ''}`}>
            <Heart size={15} /> Favoritos
          </Link>
          <Link to="/historico" className={`nav-link ${isActive('/historico') ? 'active' : ''}`}>
            <Clock size={15} /> Histórico
          </Link>
        </nav>

        <div className="navbar-actions">
          {/* Botão de Partilha com QR Code */}
          <button
            onClick={onOpenShareAppModal}
            className="navbar-action-btn"
            title="Partilhar aplicativo e baixar QR Code"
            aria-label="Partilhar aplicativo"
          >
            <QrCode size={16} color="var(--red-primary)" />
            <span className="navbar-btn-label">Partilhar</span>
          </button>

          {!isInstalled && (
            <button
              onClick={onOpenInstallModal}
              className="navbar-action-btn"
              title="Instalar Hinos & Cânticos no seu dispositivo"
              aria-label="Instalar aplicativo"
            >
              <Download size={15} color="var(--red-primary)" />
              <span className="navbar-btn-label">Instalar</span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
