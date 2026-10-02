import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { HymnDetailPage } from './pages/HymnDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';
import { InstallPage } from './pages/InstallPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UpdateBanner } from './components/UpdateBanner';
import { useAppUpdater } from './hooks/useAppUpdater';

const AppContent: React.FC = () => {
  const { needsRefresh, isOfflineReady, isUpdating, applyUpdate, dismiss } = useAppUpdater();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="pesquisar" element={<SearchPage />} />
            <Route path="hino/:numero" element={<HymnDetailPage />} />
            <Route path="favoritos" element={<FavoritesPage />} />
            <Route path="historico" element={<HistoryPage />} />
            <Route path="instalar" element={<InstallPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Banner global de atualização — aparece quando uma nova versão é detectada */}
      <UpdateBanner
        needsRefresh={needsRefresh}
        isOfflineReady={isOfflineReady}
        isUpdating={isUpdating}
        onApply={applyUpdate}
        onDismiss={dismiss}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
