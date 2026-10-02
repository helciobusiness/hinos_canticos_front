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

export const App: React.FC = () => {
  return (
    <ToastProvider>
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
    </ToastProvider>
  );
};

export default App;
