// exemplos/arquitetura-modular/backend/src/repositories/usuarios.repository.ts
// Repositório para acesso a dados de Usuarios

import { PrismaClient, Usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListarUsuariosFiltros, UsuarioResponse } from '../types/usuario.types';

export class UsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(filtros: ListarUsuariosFiltros) {
    const { pagina = 1, limite = 20, busca, ativo } = filtros;
    const skip = (pagina - 1) * limite;

    const where: any = { deletedAt: null };

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { email: { contains: busca, mode: 'insensitive' } },
      ];
    }

    const [usuarios, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limite,
        orderBy: { criadoEm: 'desc' },
        select: {
          id: true,
          nome: true,
          email: true,
          roles: true,
          ativo: true,
          criadoEm: true,
          atualizadoEm: true,
        },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      dados: usuarios as UsuarioResponse[],
      paginacao: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async encontrarPorId(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async encontrarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email, deletedAt: null },
    });
  }

  async criar(dados: { nome: string; email: string; senha: string; roles?: string[] }) {
    return this.prisma.usuario.create({
      data: {
        ...dados,
        roles: dados.roles || ['user'],
      },
    });
  }

  async atualizar(id: string, dados: Partial<{ nome: string; email: string; roles: string[]; ativo: boolean }>) {
    return this.prisma.usuario.update({
      where: { id },
      data: dados,
    });
  }

  async excluir(id: string) {
    return this.prisma.usuario.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async contarTotal(ativo?: boolean) {
    return this.prisma.usuario.count({
      where: {
        deletedAt: null,
        ...(ativo !== undefined && { ativo }),
      },
    });
  }
}