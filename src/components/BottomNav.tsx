import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Heart, Clock, Download } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { usePWA } from '../hooks/usePWA';

export const BottomNav: React.FC<{ onOpenInstallModal?: () => void }> = ({ onOpenInstallModal }) => {
  const location = useLocation();
  const { favorites } = useFavorites();
  const { isInstalled } = usePWA();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bottom-nav" aria-label="Navegação móvel inferior">
      <div className="bottom-nav-inner">
        <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
          <BookOpen size={20} />
          <span>Hinos</span>
        </Link>

        <Link to="/pesquisar" className={`bottom-nav-item ${isActive('/pesquisar') ? 'active' : ''}`}>
          <Search size={20} />
          <span>Pesquisar</span>
        </Link>

        <Link to="/favoritos" className={`bottom-nav-item ${isActive('/favoritos') ? 'active' : ''}`}>
          <div style={{ position: 'relative' }}>
            <Heart size={20} fill={isActive('/favoritos') ? 'currentColor' : 'none'} />
            {favorites.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -8,
                  background: 'var(--red-primary)',
                  color: '#FFF',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {favorites.length > 99 ? '99+' : favorites.length}
              </span>
            )}
          </div>
          <span>Favoritos</span>
        </Link>

        <Link to="/historico" className={`bottom-nav-item ${isActive('/historico') ? 'active' : ''}`}>
          <Clock size={20} />
          <span>Histórico</span>
        </Link>

        <Link to="/instalar" className={`bottom-nav-item ${isActive('/instalar') ? 'active' : ''}`}>
          <Download size={20} />
          <span>Instalar</span>
        </Link>
      </div>
    </nav>
  );
};
