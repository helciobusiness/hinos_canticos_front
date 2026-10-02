import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.png', 'favicon.ico', 'robots.txt', 'logo_black.png', 'logo_white.png', 'icons/*.png', 'data/hinos.json'],
      manifest: {
        name: 'Hinos & Cânticos — IEIA',
        short_name: 'Hinos & Cânticos',
        description: 'Consulte, pesquise, leia, guarde nos favoritos e partilhe os hinos e cânticos da IEIA.',
        theme_color: '#C81D25',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/logo_white.png',
            sizes: '2000x2000',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/logo_black.png',
            sizes: '2000x2000',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB para garantir cache integral do hinos.json
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/data/hinos.json'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'hinos-data-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-hinos-cache',
              expiration: {
                maxEntries: 600,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
