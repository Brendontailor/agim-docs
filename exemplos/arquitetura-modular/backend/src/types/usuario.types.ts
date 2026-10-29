// exemplos/arquitetura-modular/backend/src/types/usuario.types.ts
// Tipos e contratos do domínio Usuario

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string; // hash Argon2id
  roles: string[];
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
  deletedAt: Date | null;
}

export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  roles: string[];
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
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