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

export function useAppUpdater(): AppUpdateState {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  const {
    needRefresh: [needsRefresh, setNeedsRefresh],
    offlineReady: [offlineReadyRaw, setOfflineReady],
    updateServiceWorker,
    // Gives access to the SW registration for manual update checks
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Verifica atualizações a cada 60 minutos enquanto o app está aberto
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onNeedRefresh() {
      // Já gerido pelo needRefresh state acima
    },
    onOfflineReady() {
      setIsOfflineReady(true);
      // Esconde o banner offline após 4 segundos
      setTimeout(() => setIsOfflineReady(false), 4000);
    },
  });

  // Sincroniza estado externo de offline ready
  useEffect(() => {
    if (offlineReadyRaw) {
      setIsOfflineReady(true);
      setTimeout(() => setIsOfflineReady(false), 4000);
    }
  }, [offlineReadyRaw]);

  const applyUpdate = useCallback(async () => {
    setIsUpdating(true);
    try {
      await updateServiceWorker(true);
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
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        setIsUpdating(true);
        try {
          await reg.update();
        } finally {
          // Se não houver nova versão, setIsUpdating volta a false após 1.5s
          setTimeout(() => setIsUpdating(false), 1500);
        }
      }
    }
  }, []);

  return {
    needsRefresh,
    isOfflineReady,
    isUpdating,
    applyUpdate,
    dismiss,
    checkForUpdate,
  };
}
