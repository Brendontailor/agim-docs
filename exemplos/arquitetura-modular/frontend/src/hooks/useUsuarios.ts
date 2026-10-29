// exemplos/arquitetura-modular/frontend/src/hooks/useUsuarios.ts
// Hook personalizado para gerenciar estado de Usuarios (React Query)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '@/services/usuarios.api';
import {
  UsuarioResponse,
  CriarUsuarioDTO,
  AtualizarUsuarioDTO,
  ListarUsuariosFiltros,
  ListarUsuariosResponse,
} from '@/types/usuario.types';

export function useUsuarios(filtros: ListarUsuariosFiltros = {}) {
  return useQuery<ListarUsuariosResponse, Error>({
    queryKey: ['usuarios', filtros],
    queryFn: () => usuariosApi.listar(filtros),
    placeholderData: (previous) => previous, // Mantém dados anteriores durante fetch
  });
}

export function useUsuario(id: string) {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => usuariosApi.obterPorId(id),
    enabled: !!id,
  });
}

export function useCriarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: { nome: string; email: string; senha: string; roles?: string[] }) =>
      usuariosApi.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

export function useAtualizarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<{ nome: string; email: string; roles?: string[]; ativo: boolean }> }) =>
      usuariosApi.atualizar(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

export function useExcluirUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usuariosApi.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}