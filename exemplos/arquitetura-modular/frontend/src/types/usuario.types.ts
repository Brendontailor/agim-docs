// exemplos/arquitetura-modular/frontend/src/types/usuario.types.ts
// Tipos compartilhados frontend para o domínio Usuario

export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  roles: string[];
  ativo: boolean;
  criadoEm: string; // ISO string
  atualizadoEm: string;
}

export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  roles?: string[];
}

export interface AtualizarUsuarioDTO {
  nome?: string;
  email?: string;
  roles?: string[];
  ativo?: boolean;
}

export interface ListarUsuariosFiltros {
  pagina?: number;
  limite?: number;
  busca?: string;
  ativo?: boolean;
}

export interface ListarUsuariosResponse {
  dados: UsuarioResponse[];
  paginacao: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

export interface ApiResponse<T> {
  dados: T;
}

export interface PaginatedResponse<T> {
  dados: T[];
  paginacao: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

export interface ApiError {
  erro: string;
  mensagem: string;
  detalhes?: Record<string, string[]>;
}