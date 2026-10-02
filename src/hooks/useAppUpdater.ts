import { useEffect, useState, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export interface AppUpdateState {
  /** Nova versão disponível para instalar */
  needsRefresh: boolean;
  /** App pronto para uso offline (primeira instalação ou re-cache) */
  isOfflineReady: boolean;
  /** Está a verificar/instalar atualização */
  isUpdating: boolean;
  /** Aplica a atualização e recarrega a página */
  applyUpdate: () => Promise<void>;
  /** Dispensa a notificação sem aplicar */
  dismiss: () => void;
  /** Força verificação manual de atualizações */
  checkForUpdate: () => Promise<void>;
}

// Intervalo de verificação automática: 30 minutos
const CHECK_INTERVAL_MS = 30 * 60 * 1000;

export function useAppUpdater(): AppUpdateState {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  const {
    needRefresh: [needsRefresh, setNeedsRefresh],
    offlineReady: [, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (!registration) return;

      // Verificação periódica a cada 30 min (app pode ficar dias aberta no telemóvel)
      const interval = setInterval(() => {
        registration.update().catch(() => {});
      }, CHECK_INTERVAL_MS);

      // Verifica imediatamente ao registar (apanha updates instalados enquanto offline)
      registration.update().catch(() => {});

      return () => clearInterval(interval);
    },
    onNeedRefresh() {
      // Gerido pelo estado needRefresh
    },
    onOfflineReady() {
      setIsOfflineReady(true);
      setTimeout(() => setIsOfflineReady(false), 5000);
    },
    onRegisterError(error) {
      console.warn('[PWA] Erro ao registar Service Worker:', error);
    },
  });

  const applyUpdate = useCallback(async () => {
    setIsUpdating(true);
    try {
      // Envia SKIP_WAITING ao SW em espera e força recarga
      await updateServiceWorker(true);
    } catch {
      // Fallback: força recarga direta
      window.location.reload();
    } finally {
      setIsUpdating(false);
    }
  }, [updateServiceWorker]);

  const dismiss = useCallback(() => {
    setNeedsRefresh(false);
    setOfflineReady(false);
    setIsOfflineReady(false);
  }, [setNeedsRefresh, setOfflineReady]);

  const checkForUpdate = useCallback(async () => {
    setIsUpdating(true);
    try {
      // Usa a API nativa para obter o registo do Service Worker
      let registration: ServiceWorkerRegistration | undefined;
      if ('serviceWorker' in navigator) {
        registration = await navigator.serviceWorker.getRegistration();
      }

      if (registration) {
        await registration.update();
        // Se houver SW esperando, notifica o utilizador
        if (registration.waiting) {
          setNeedsRefresh(true);
        }
      }
    } catch (err) {
      console.warn('[PWA] Erro ao verificar atualização:', err);
    } finally {
      // Mantém o spinner por 1.5s para feedback visual
      setTimeout(() => setIsUpdating(false), 1500);
    }
  }, [setNeedsRefresh]);

  // Verifica quando o utilizador volta ao app (visibilidade do documento)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [checkForUpdate]);

  // Verifica quando fica online depois de estar offline
  useEffect(() => {
    const handleOnline = () => {
      checkForUpdate().catch(() => {});
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [checkForUpdate]);

  return {
    needsRefresh,
    isOfflineReady,
    isUpdating,
    applyUpdate,
    dismiss,
    checkForUpdate,
  };
}
