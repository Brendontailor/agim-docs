// exemplos/arquitetura-modular/frontend/src/services/usuarios.api.ts
// Serviço API para o módulo Usuarios (frontend)

import { api } from './api';
import {
  ListarUsuariosFiltros,
  UsuarioResponse,
  CriarUsuarioDTO,
  AtualizarUsuarioDTO,
  ListarUsuariosResponse,
} from '@/types/usuario.types';

export const usuariosApi = {
  listar: (filtros?: ListarUsuariosFiltros) =>
    api.get<ListarUsuariosResponse>('/usuarios', { params: filtros }).then((res) => res.data),

  obterPorId: (id: string) =>
    api.get<UsuarioResponse>(`/usuarios/${id}`).then((res) => res.data),

  criar: (dados: CriarUsuarioDTO) =>
    api.post<UsuarioResponse>('/usuarios', dados).then((res) => res.data),

  atualizar: (id: string, dados: Partial<CriarUsuarioDTO>) =>
    api.patch<UsuarioResponse>(`/usuarios/${id}`, dados).then((res) => res.data),

  excluir: (id: string) =>
    api.delete(`/usuarios/${id}`).then((res) => res.data),
};