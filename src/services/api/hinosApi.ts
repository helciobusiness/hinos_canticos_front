import { request } from './apiClient';
import {
  IHinoDetail,
  IHinoListItem,
  IHinoSearchResult,
  IPaginatedResponse,
} from '../../types/hino';
import {
  initOfflineDatabase,
  getOfflineHinos,
  getOfflineHinoByNumero,
  searchOfflineHinos,
  getOfflineAnterior,
  getOfflineSeguinte,
  isOfflineDataReady,
} from '../offline/offlineDatabase';

export const hinosApi = {
  /**
   * Obtém listagem paginada de hinos (com suporte offline completo)
   */
  async getHinos(
    page: number = 1,
    limit: number = 20,
    sort: 'asc' | 'desc' = 'asc'
  ): Promise<IPaginatedResponse<IHinoListItem>> {
    // Se o dispositivo estiver offline, busca diretamente no banco local
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return getOfflineHinos(page, limit, sort);
    }

    try {
      return await request<IPaginatedResponse<IHinoListItem>>(
        `/hinos?page=${page}&limit=${limit}&sort=${sort}`
      );
    } catch {
      // Fallback transparente para o armazenamento local caso a API esteja inacessível ou sem dados móveis
      return getOfflineHinos(page, limit, sort);
    }
  },

  /**
   * Obtém detalhes completos de um hino pelo número (Zero latência, 100% offline)
   */
  async getHinoByNumero(numero: number): Promise<IHinoDetail> {
    // 1. Tenta carregar do banco de dados local primeiro (ultra-rápido, 0ms, funciona offline)
    const localHino = await getOfflineHinoByNumero(numero);
    if (localHino) {
      return localHino;
    }

    // 2. Se não estiver local, busca da API
    try {
      return await request<IHinoDetail>(`/hinos/${numero}`);
    } catch {
      // Se a API falhou, tenta inicializar a base offline e buscar novamente
      await initOfflineDatabase();
      const retryLocal = await getOfflineHinoByNumero(numero);
      if (retryLocal) return retryLocal;
      throw new Error(`Hino ${numero} não encontrado.`);
    }
  },

  /**
   * Pesquisa hinos por termo (Pesquisa instantânea offline em todas as 581 letras)
   */
  async searchHinos(
    q: string,
    page: number = 1,
    limit: number = 20
  ): Promise<IPaginatedResponse<IHinoSearchResult>> {
    // Se a base local estiver pronta, executa a busca instantânea local (< 5ms)
    if (isOfflineDataReady() || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      return searchOfflineHinos(q, page, limit);
    }

    try {
      const encoded = encodeURIComponent(q.trim());
      return await request<IPaginatedResponse<IHinoSearchResult>>(
        `/hinos/search?q=${encoded}&page=${page}&limit=${limit}`
      );
    } catch {
      return searchOfflineHinos(q, page, limit);
    }
  },

  /**
   * Obtém hino anterior
   */
  async getHinoAnterior(numero: number): Promise<{ numero: number; titulo: string }> {
    const local = await getOfflineAnterior(numero);
    if (local) return local;

    try {
      return await request<{ numero: number; titulo: string }>(`/hinos/${numero}/anterior`);
    } catch {
      if (local) return local;
      throw new Error('Hino anterior não encontrado.');
    }
  },

  /**
   * Obtém hino seguinte
   */
  async getHinoSeguinte(numero: number): Promise<{ numero: number; titulo: string }> {
    const local = await getOfflineSeguinte(numero);
    if (local) return local;

    try {
      return await request<{ numero: number; titulo: string }>(`/hinos/${numero}/seguinte`);
    } catch {
      if (local) return local;
      throw new Error('Hino seguinte não encontrado.');
    }
  },

  /**
   * Diagnóstico da API
   */
  async getHealth(): Promise<{ status: string; hinosDisponiveis: number }> {
    try {
      return await request<{ status: string; hinosDisponiveis: number }>('/health');
    } catch {
      return { status: 'offline', hinosDisponiveis: 581 };
    }
  },
};

