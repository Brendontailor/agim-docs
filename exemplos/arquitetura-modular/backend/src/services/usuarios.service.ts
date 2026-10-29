// exemplos/arquitetura-modular/backend/src/services/usuarios.service.ts
// Service com regras de negócio para Usuarios

import { Injectable } from '../utils/dependency-injection';
import { UsuariosRepository } from '../repositories/usuarios.repository';
import { HashService } from './hash.service';
import { EventPublisher } from '../utils/event-publisher';
import { UsuarioNaoEncontradoError, EmailJaCadastradoError } from '../errors/negocio.errors';
import { CriarUsuarioDTO, AtualizarUsuarioDTO, UsuarioResponse, ListarUsuariosFiltros, ListarUsuariosResponse } from '../types/usuario.types';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly repository: UsuariosRepository,
    private readonly hashService: HashService,
    private readonly events: EventPublisher
  ) {}

  async listar(filtros: ListarUsuariosFiltros): Promise<ListarUsuariosResponse> {
    return this.repository.listar(filtros);
  }

  async obterPorId(id: string): Promise<UsuarioResponse> {
    const usuario = await this.repository.encontrarPorId(id);
    if (!usuario) {
      throw new UsuarioNaoEncontradoError(id);
    }
    return this.paraResponse(usuario);
  }

  async criar(dados: CriarUsuarioDTO): Promise<UsuarioResponse> {
    // Verificar unicidade de email
    const existente = await this.repository.encontrarPorEmail(dados.email);
    if (existente) {
      throw new EmailJaCadastradoError(dados.email);
    }

    // Hash de senha (regra de negócio: nunca salvar senha pura)
    const senhaHash = await this.hashService.hash(dados.senha);

    const usuario = await this.repository.criar({
      ...dados,
      senha: senhaHash,
    });

    // Evento de domínio (ex: enviar email boas-vindas)
    await this.events.publicar('usuario.criado', {
      usuarioId: usuario.id,
      email: usuario.email,
    });

    return this.paraResponse(usuario);
  }

  async atualizar(id: string, dados: AtualizarUsuarioDTO): Promise<UsuarioResponse> {
    const usuario = await this.repository.encontrarPorId(id);
    if (!usuario) {
      throw new UsuarioNaoEncontradoError(id);
    }

    // Se email mudou, verificar unicidade
    if (dados.email && dados.email !== usuario.email) {
      const existente = await this.repository.encontrarPorEmail(dados.email);
      if (existente) {
        throw new EmailJaCadastradoError(dados.email);
      }
    }

    const atualizado = await this.repository.atualizar(id, dados);
    return this.paraResponse(atualizado!);
  }

  async excluir(id: string): Promise<void> {
    const usuario = await this.repository.encontrarPorId(id);
    if (!usuario) {
      throw new UsuarioNaoEncontradoError(id);
    }
    await this.repository.excluir(id);
    await this.events.publicar('usuario.excluido', { usuarioId: id });
  }

  private paraResponse(usuario: any): UsuarioResponse {
    const { senha: _senha, ...resto } = usuario;
    return resto;
  }
}