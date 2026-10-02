import { IHinoDetail, IHinoListItem, IHinoSearchResult, IPaginatedResponse } from '../../types/hino';
import { formatHinoNumero } from '../../utils/format';
import { normalizeText } from '../../utils/text';

const DB_NAME = 'hinos_canticos_db';
const DB_VERSION = 1;
const STORE_NAME = 'hinos';

// Cache em memória de ultra-alta velocidade
let memoryCache: IHinoDetail[] | null = null;
let isInitPromise: Promise<boolean> | null = null;

/**
 * Abre ou cria o banco IndexedDB local no dispositivo
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB não suportado neste ambiente'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'numero' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Normaliza um hino do JSON bruto para a interface IHinoDetail
 */
function normalizeRawHino(raw: any, index: number, allRaw: any[]): IHinoDetail {
  const estrofes = (raw.estrofes || []).map((e: any, idx: number) => ({
    id: idx + 1,
    numero: e.numero ?? idx + 1,
    tipo: e.tipo || 'estrofe',
    texto: e.texto || '',
  }));

  const prev = index > 0 ? allRaw[index - 1] : null;
  const next = index < allRaw.length - 1 ? allRaw[index + 1] : null;

  return {
    id: raw.numero,
    numero: raw.numero,
    numeroFormatado: formatHinoNumero(raw.numero),
    titulo: raw.titulo || `Hino ${raw.numero}`,
    autor: raw.autor || null,
    letraCompleta: estrofes.map((e: any) => e.texto).join('\n\n'),
    fonteArquivo: raw.source_file || null,
    estrofes,
    anterior: prev ? { numero: prev.numero, titulo: prev.titulo } : null,
    seguinte: next ? { numero: next.numero, titulo: next.titulo } : null,
  };
}

/**
 * Converte IHinoDetail para IHinoListItem para listagens rápidas
 */
function toListItem(hino: IHinoDetail): IHinoListItem {
  return {
    id: hino.id,
    numero: hino.numero,
    numeroFormatado: hino.numeroFormatado,
    titulo: hino.titulo,
    autor: hino.autor,
    totalEstrofes: hino.estrofes.length,
    primeiraEstrofe: hino.estrofes[0]?.texto || '',
  };
}

/**
 * Carrega todos os hinos do IndexedDB
 */
async function loadAllFromIndexedDB(db: IDBDatabase): Promise<IHinoDetail[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();

    req.onsuccess = () => {
      const list = (req.result as IHinoDetail[]) || [];
      list.sort((a, b) => a.numero - b.numero);
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Salva todos os hinos no IndexedDB
 */
async function saveAllToIndexedDB(db: IDBDatabase, hinos: IHinoDetail[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const hino of hinos) {
      store.put(hino);
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Inicializa o banco de dados offline garantindo que os 581 hinos estejam locais
 */
export async function initOfflineDatabase(): Promise<boolean> {
  if (memoryCache && memoryCache.length >= 500) {
    return true;
  }

  if (isInitPromise) {
    return isInitPromise;
  }

  isInitPromise = (async () => {
    try {
      const db = await openDB();
      const existing = await loadAllFromIndexedDB(db);

      if (existing.length >= 500) {
        memoryCache = existing;
        console.log(`[OfflineDB] ${existing.length} hinos carregados do armazenamento local.`);
        return true;
      }

      // Se o IndexedDB ainda não possui os hinos, busca do arquivo embutido /data/hinos.json
      console.log('[OfflineDB] Inicializando base local com todos os 581 hinos...');
      const response = await fetch('/data/hinos.json');
      if (!response.ok) {
        throw new Error(`Falha ao descarregar /data/hinos.json: ${response.status}`);
      }

      const json = await response.json();
      const rawList: any[] = json.hinos || (Array.isArray(json) ? json : []);
      rawList.sort((a, b) => a.numero - b.numero);

      const normalizedList = rawList.map((item, idx) => normalizeRawHino(item, idx, rawList));

      // Grava no IndexedDB para persistência permanente
      await saveAllToIndexedDB(db, normalizedList);
      memoryCache = normalizedList;

      console.log(`[OfflineDB] Base completa de ${normalizedList.length} hinos gravada com sucesso no dispositivo!`);
      return true;
    } catch (err) {
      console.warn('[OfflineDB] Erro ao inicializar banco local:', err);
      return false;
    } finally {
      isInitPromise = null;
    }
  })();

  return isInitPromise;
}

/**
 * Verifica se a base offline já está pronta para uso
 */
export function isOfflineDataReady(): boolean {
  return memoryCache !== null && memoryCache.length > 0;
}

/**
 * Retorna todos os hinos do cache em memória
 */
export async function getAllOfflineHinos(): Promise<IHinoDetail[]> {
  if (!memoryCache) {
    await initOfflineDatabase();
  }
  return memoryCache || [];
}

/**
 * Listagem paginada offline
 */
export async function getOfflineHinos(
  page: number = 1,
  limit: number = 20,
  sort: 'asc' | 'desc' = 'asc'
): Promise<IPaginatedResponse<IHinoListItem>> {
  const all = await getAllOfflineHinos();
  const sorted = [...all].sort((a, b) => (sort === 'asc' ? a.numero - b.numero : b.numero - a.numero));

  const total = sorted.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const paginatedItems = sorted.slice(startIndex, startIndex + limit).map(toListItem);

  return {
    data: paginatedItems,
    pagination: {
      total,
      page: currentPage,
      limit,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
}

/**
 * Obter detalhe de um hino específico por número offline
 */
export async function getOfflineHinoByNumero(numero: number): Promise<IHinoDetail | null> {
  const all = await getAllOfflineHinos();
  const foundIndex = all.findIndex((h) => h.numero === numero);
  if (foundIndex === -1) return null;

  const hino = all[foundIndex];
  const prev = foundIndex > 0 ? all[foundIndex - 1] : null;
  const next = foundIndex < all.length - 1 ? all[foundIndex + 1] : null;

  return {
    ...hino,
    anterior: prev ? { numero: prev.numero, titulo: prev.titulo } : null,
    seguinte: next ? { numero: next.numero, titulo: next.titulo } : null,
  };
}

/**
 * Pesquisa ultra-rápida offline (por número, título, autor ou estrofes/letra)
 */
export async function searchOfflineHinos(
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<IPaginatedResponse<IHinoSearchResult>> {
  const all = await getAllOfflineHinos();
  const term = query.trim();
  const normQuery = normalizeText(term);

  if (!normQuery) {
    const listRes = await getOfflineHinos(page, limit);
    return {
      data: listRes.data.map((h) => ({ ...h, correspondencia: 'titulo' })),
      pagination: listRes.pagination,
    };
  }

  const isNumeric = /^\d+$/.test(term);
  const targetNumero = isNumeric ? parseInt(term, 10) : null;

  const matches: IHinoSearchResult[] = [];

  for (const h of all) {
    // 1. Correspondência por número
    if (targetNumero !== null && h.numero === targetNumero) {
      matches.unshift({
        ...toListItem(h),
        correspondencia: 'numero',
      });
      continue;
    }

    if (isNumeric && h.numero.toString().includes(term)) {
      matches.push({
        ...toListItem(h),
        correspondencia: 'numero',
      });
      continue;
    }

    // 2. Correspondência por título
    const normTitulo = normalizeText(h.titulo);
    if (normTitulo.includes(normQuery)) {
      matches.push({
        ...toListItem(h),
        correspondencia: 'titulo',
      });
      continue;
    }

    // 3. Correspondência por autor
    if (h.autor && normalizeText(h.autor).includes(normQuery)) {
      matches.push({
        ...toListItem(h),
        correspondencia: 'autor',
      });
      continue;
    }

    // 4. Correspondência na letra das estrofes
    let snippetMatch: string | undefined;
    for (const estrofe of h.estrofes) {
      const normTexto = normalizeText(estrofe.texto);
      const matchIndex = normTexto.indexOf(normQuery);
      if (matchIndex !== -1) {
        // Extrai o trecho relevante com palavras circundantes
        const start = Math.max(0, matchIndex - 30);
        const end = Math.min(estrofe.texto.length, matchIndex + term.length + 50);
        snippetMatch = (start > 0 ? '...' : '') + estrofe.texto.substring(start, end).replace(/\n/g, ' ') + (end < estrofe.texto.length ? '...' : '');
        break;
      }
    }

    if (snippetMatch) {
      matches.push({
        ...toListItem(h),
        trechoRelevante: snippetMatch,
        correspondencia: 'letra',
      });
    }
  }

  const total = matches.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const paginatedMatches = matches.slice(startIndex, startIndex + limit);

  return {
    data: paginatedMatches,
    pagination: {
      total,
      page: currentPage,
      limit,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
}

/**
 * Hino anterior offline
 */
export async function getOfflineAnterior(numero: number): Promise<{ numero: number; titulo: string } | null> {
  const all = await getAllOfflineHinos();
  const index = all.findIndex((h) => h.numero === numero);
  if (index > 0) {
    return { numero: all[index - 1].numero, titulo: all[index - 1].titulo };
  }
  return null;
}

/**
 * Hino seguinte offline
 */
export async function getOfflineSeguinte(numero: number): Promise<{ numero: number; titulo: string } | null> {
  const all = await getAllOfflineHinos();
  const index = all.findIndex((h) => h.numero === numero);
  if (index >= 0 && index < all.length - 1) {
    return { numero: all[index + 1].numero, titulo: all[index + 1].titulo };
  }
  return null;
}
