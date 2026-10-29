// exemplos/arquitetura-modular/backend/src/routes/usuarios.routes.ts
// Rotas para o módulo Usuarios

import { Router } from 'express';
import { UsuariosController } from '../controllers/usuarios.controller';
import { autenticar } from '../middlewares/autenticar.middleware';
import { autorizar } from '../middlewares/autorizar.middleware';
import { validar } from '../middlewares/validar.middleware';
import {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
  listarUsuariosSchema,
  obterUsuarioSchema,
  excluirUsuarioSchema,
} from '../validators/usuarios.validator';

const router = Router();
const controller = new UsuariosController();

// Todas as rotas abaixo requerem autenticação
router.use(autenticar);

router.get(
  '/',
  autorizar('usuarios:listar'),
  validar(listarUsuariosSchema),
  controller.listar
);

router.get(
  '/:id',
  autorizar('usuarios:ver'),
  validar(obterUsuarioSchema),
  controller.obterPorId
);

router.post(
  '/',
  autorizar('usuarios:criar'),
  validar(criarUsuarioSchema),
  controller.criar
);

router.patch(
  '/:id',
  autorizar('usuarios:editar'),
  validar(atualizarUsuarioSchema),
  controller.atualizar
);

router.delete(
  '/:id',
  autorizar('usuarios:excluir'),
  validar(excluirUsuarioSchema),
  controller.excluir
);

export { router as usuariosRouter };