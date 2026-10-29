// exemplos/arquitetura-modular/backend/src/validators/usuarios.validator.ts
// Validadores Zod para o módulo Usuarios

import { z } from 'zod';

export const criarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
    email: z.string().email('Email inválido').toLowerCase(),
    senha: z.string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .max(128)
      .regex(/[A-Z]/, 'Deve conter pelo menos uma maiúscula')
      .regex(/[a-z]/, 'Deve conter pelo menos uma minúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número')
      .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caractere especial'),
    roles: z.array(z.string()).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const atualizarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(100).optional(),
    email: z.string().email().toLowerCase().optional(),
    roles: z.array(z.string()).optional(),
    ativo: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  query: z.object({}).optional(),
});

export const listarUsuariosSchema = z.object({
  query: z.object({
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().positive().max(100).default(20),
    busca: z.string().optional(),
    ativo: z.coerce.boolean().optional(),
  }),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const obterUsuarioSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const excluirUsuarioSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});