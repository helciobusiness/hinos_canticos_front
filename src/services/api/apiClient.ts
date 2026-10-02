function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;

  // Se for uma URL externa de produção absoluta (sem localhost)
  if (
    envUrl &&
    envUrl.startsWith('http') &&
    !envUrl.includes('localhost') &&
    !envUrl.includes('127.0.0.1')
  ) {
    return envUrl;
  }

  // Se o frontend estiver rodando no navegador (computador ou telemóvel)
  if (typeof window !== 'undefined') {
    // Se acessado por IP da rede local (ex: no telemóvel http://192.168.x.x:5173)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // Usa proxy relativo do Vite (/api), garantindo acesso sem problemas de firewall ou CORS
      return '/api';
    }
  }

  // Se definido como relativo (ex: /api)
  if (envUrl && envUrl.startsWith('/')) {
    return envUrl;
  }

  return envUrl || '/api';
}

const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options?.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      const errorMessage =
        (errorData && typeof errorData.message === 'string' && errorData.message) ||
        `Erro HTTP ${response.status}: ${response.statusText}`;

      throw new ApiError(response.status, errorMessage, errorData);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Erros de rede ou offline
    throw new ApiError(
      0,
      'Não foi possível estabelecer conexão com o servidor da API. Verifique sua conexão com a Internet.',
      error
    );
  }
}
