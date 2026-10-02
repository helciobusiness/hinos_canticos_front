export interface IEstrofe {
  id: number;
  numero: number;
  tipo: string;
  texto: string;
}

export interface IHinoDetail {
  id: number;
  numero: number;
  numeroFormatado: string;
  titulo: string;
  autor: string | null;
  letraCompleta: string;
  fonteArquivo: string | null;
  estrofes: IEstrofe[];
  anterior?: { numero: number; titulo: string } | null;
  seguinte?: { numero: number; titulo: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IHinoListItem {
  id: number;
  numero: number;
  numeroFormatado: string;
  titulo: string;
  autor: string | null;
  totalEstrofes: number;
  primeiraEstrofe?: string;
}

export interface IHinoSearchResult extends IHinoListItem {
  trechoRelevante?: string;
  correspondencia: 'numero' | 'titulo' | 'autor' | 'letra';
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPagination;
}

export interface IHistoryItem {
  numero: number;
  titulo: string;
  autor: string | null;
  dataAcesso: number; // timestamp
}
