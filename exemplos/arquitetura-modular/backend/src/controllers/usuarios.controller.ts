// exemplos/arquitetura-modular/backend/src/controllers/usuarios.controller.ts
// Controller para o módulo Usuarios

import { Request, Response, NextFunction } from 'express';
import { UsuariosService } from '../services/usuarios.service';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../utils/http-status';
import { CriarUsuarioDTO, AtualizarUsuarioDTO, ListarUsuariosFiltros } from '../types/usuario.types';

export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filtros: ListarUsuariosFiltros = {
        pagina: Number(req.query.pagina) || 1,
        limite: Number(req.query.limite) || 20,
        busca: req.query.busca as string,
        ativo: req.query.ativo !== undefined ? req.query.ativo === 'true' : undefined,
      };
      const resultado = await this.service.listar(filtros);
      res.status(HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  obterPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const usuario = await this.service.obterPorId(id);
      res.status(HTTP_STATUS.OK).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dados: CriarUsuarioDTO = req.body;
      const usuario = await this.service.criar(dados);
      res.status(HTTP_STATUS.CREATED).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dados: AtualizarUsuarioDTO = req.body;
      const usuario = await this.service.atualizar(id, dados);
      res.status(HTTP_STATUS.OK).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  excluir = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.excluir(id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };
}