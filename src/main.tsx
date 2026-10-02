import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { initOfflineDatabase } from './services/offline/offlineDatabase';

// Inicializa a base de dados offline local (IndexedDB) com todos os 581 hinos
initOfflineDatabase().catch((err) => {
  console.warn('Inicialização offline:', err);
});

// Registro de Service Worker para PWA (Progressive Web App)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('✅ Hinos & Cânticos Service Worker registrado:', reg.scope);
      })
      .catch((err) => {
        console.warn('Falha no registro do Service Worker:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
