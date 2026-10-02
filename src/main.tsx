import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { initOfflineDatabase } from './services/offline/offlineDatabase';

// Inicializa a base de dados offline local (IndexedDB) com todos os 581 hinos
// O Service Worker é gerido automaticamente pelo vite-plugin-pwa via useRegisterSW
initOfflineDatabase().catch((err) => {
  console.warn('Inicialização offline:', err);
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
