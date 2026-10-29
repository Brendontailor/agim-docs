# Arquitetura Modular Obrigatória

> Documentação da arquitetura padrão para projetos baseados neste repositório.
> Baseada na Seção 4 da missão: "ARQUITETURA MODULAR OBRIGATÓRIA".

---

## Princípios Gerais

| Princípio | Descrição |
|-----------|-----------|
| **Separação de responsabilidades** | Cada camada tem uma única responsabilidade bem definida |
| **Inversão de dependência** | Camadas internas não dependem de externas; interfaces definem contratos |
| **Baixo acoplamento** | Módulos comunicam-se via interfaces/tipos, não implementações concretas |
| **Alta coesão** | Funcionalidades relacionadas agrupadas no mesmo módulo |
| **Testabilidade** | Cada camada testável independentemente (mocks nas fronteiras) |
| **Pragmatismo** | Não criar repositórios intermediários quando não agregam valor real |

---

## Estrutura de Diretórios (Monorepo)

```
meu-projeto/
├── frontend/                 # Aplicação React + Vite + TypeScript
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis (UI)
│   │   ├── pages/            # Páginas (rotas principais)
│   │   ├── layouts/          # Layouts de página (wrappers)
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── services/         # Serviços HTTP (API client)
│   │   ├── types/            # Tipos e contratos (compartilhados com backend)
│   │   ├── utils/            # Utilitários puros
│   │   ├── contexts/         # React Context (estado global quando necessário)
│   │   ├── styles/           # Estilos globais, tokens, variáveis CSS
│   │   ├── main.tsx          # Entry point
│   │   └── App.tsx           # Componente raiz + roteamento
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/                  # API Node.js + Express + TypeScript + Prisma
│   ├── src/
│   │   ├── routes/           # Definição de endpoints + middlewares
│   │   ├── controllers/      # Recebem req/res, chamam services
│   │   ├── services/         # Regras de negócio (use cases)
│   │   ├── validations/      # Validação de entrada (Zod, Joi, etc.)
│   │   ├── repositories/     # Acesso a dados (opcional, quando agrega valor)
│   │   ├── middlewares/      # Auth, authZ, error handling, logging, CORS
│   │   ├── config/           # Configuração centralizada + validação env
│   │   ├── types/            # Tipos e contratos do backend
│   │   ├── errors/           # Classes de erro padronizadas
│   │   ├── utils/            # Utilitários puros do backend
│   │   ├── prisma/           # Prisma Client + extensions
│   │   └── app.ts            # Factory da aplicação Express
│   ├── prisma/
│   │   ├── schema.prisma     # Schema do banco
│   │   └── migrations/       # Migrations versionadas
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docs/                     # Documentação compartilhada
│   ├── ARQUITETURA.md
│   ├── CODIGO-LIMPO.md
│   ├── SEGURANCA.md
│   ├── TESTES.md
│   ├── FERRAMENTAS-IA.md
│   ├── IA-E-CONTEXTO.md
│   ├── DECISOES-TECNICAS.md
│   └── VALIDACAO-DO-REPOSITORIO.md
│
├── memoria/                  # Sistema de continuidade (opcional por projeto)
│   ├── ESTADO-ATUAL.md
│   ├── PLANO-DE-EXECUCAO.md
│   ├── HISTORICO-DE-EXECUCAO.md
│   ├── DECISOES.md
│   ├── PENDENCIAS.md
│   └── PROXIMO-PASSO.md
│
├── checklists/               # Checklists obrigatórios
├── templates/                # Templates reutilizáveis
├── exemplos/                 # Exemplos de referência
├── scripts/                  # Scripts de automação/validação
├── .github/                  # Templates issues/PR, workflows CI
├── package.json              # Workspace root (opcional, para scripts compartilhados)
├── tsconfig.base.json        # Config TypeScript base (extends nos subprojetos)
├── .gitignore
├── .editorconfig
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── AGENTS.md                 # Instruções operacionais (copiar/adaptar do repo de padrões)
```

---

## Backend - Camadas Detalhadas

### 1. Rotas (`src/routes/`)

**Responsabilidade**: Definir endpoints HTTP, aplicar middlewares, delegar para controladores.

```typescript
// src/routes/usuarios.routes.ts
import { Router } from 'express';
import { UsuariosController } from '../controllers/usuarios.controller';
import { autenticar } from '../middlewares/autenticar.middleware';
import { autorizar } from '../middlewares/autorizar.middleware';
import { validarCorpo } from '../middlewares/validar.middleware';
import { criarUsuarioSchema, atualizarUsuarioSchema } from '../validations/usuarios.validation';

const router = Router();
const controller = new UsuariosController();

// Todas as rotas abaixo requerem autenticação
router.use(autenticar);

router.get('/', autorizar('usuarios:listar'), controller.listar);
router.get('/:id', autorizar('usuarios:ver'), controller.obterPorId);
router.post('/', autorizar('usuarios:criar'), validarCorpo(criarUsuarioSchema), controller.criar);
router.patch('/:id', autorizar('usuarios:editar'), validarCorpo(atualizarUsuarioSchema), controller.atualizar);
router.delete('/:id', autorizar('usuarios:excluir'), controller.excluir);

export { router as usuariosRouter };
```

**Regras**:
- Um arquivo por recurso/agregado
- Middlewares aplicados na ordem: autenticação → autorização → validação → controller
- Rotas **não** contêm lógica de negócio
- Nomes: `{recurso}.routes.ts`, exportação named: `{recurso}Router`

---

### 2. Controladores (`src/controllers/`)

**Responsabilidade**: Receber `Request`/`Response`, extrair dados, chamar Service, formatar resposta HTTP.

```typescript
// src/controllers/usuarios.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UsuariosService } from '../services/usuarios.service';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../utils/http-status';

export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  listar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { pagina = 1, limite = 20, busca } = req.query;
      const resultado = await this.service.listar({
        pagina: Number(pagina),
        limite: Number(limite),
        busca: String(busca || ''),
      });
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
      const usuario = await this.service.criar(req.body);
      res.status(HTTP_STATUS.CREATED).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const usuario = await this.service.atualizar(id, req.body);
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
```

**Regras**:
- Um controller por recurso/agregado
- Métodos = operações CRUD + ações específicas
- **Nunca** contêm regras de negócio
- **Nunca** acessam Prisma/repositório diretamente
- Tratamento de erro delega para `next(error)` (middleware centralizado)
- Respostas padronizadas via `HTTP_STATUS` constants

---

### 3. Serviços (`src/services/`)

**Responsabilidade**: Implementar regras de negócio (use cases), orquestrar repositórios, validar invariantes.

```typescript
// src/services/usuarios.service.ts
import { Injectable } from '../utils/dependency-injection'; // ou padrão factory
import { UsuariosRepository } from '../repositories/usuarios.repository';
import { HashService } from './hash.service';
import { EventPublisher } from '../utils/event-publisher';
import { UsuarioNaoEncontradoError, EmailJaCadastradoError } from '../errors/negocio.errors';
import { CriarUsuarioDTO, AtualizarUsuarioDTO, UsuarioResponse } from '../types/usuario.types';

export class UsuariosService {
  constructor(
    private readonly repository: UsuariosRepository,
    private readonly hashService: HashService,
    private readonly events: EventPublisher
  ) {}

  async listar(filtros: { pagina: number; limite: number; busca: string }) {
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
    await this.events.publicar('usuario.criado', { usuarioId: usuario.id, email: usuario.email });

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
```

**Regras**:
- Um service por agregado/domínio
- Recebe repositórios e outros services via injeção de dependência (construtor)
- Contém **toda** lógica de negócio: validações de invariantes, transações, eventos
- **Não** conhece HTTP (req/res), **não** lança erros HTTP diretos
- Lança erros de domínio (`AppError` subclasses) que o middleware converte
- Métodos retornam DTOs de resposta (sem senhas, tokens internos)

---

### 4. Validações (`src/validations/`)

**Responsabilidade**: Validar entrada de dados (body, params, query) antes de chegar ao controller.

```typescript
// src/validations/usuarios.validation.ts
import { z } from 'zod';

export const criarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
    email: z.string().email('Email inválido'),
    senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    roles: z.array(z.string()).optional(),
  }),
});

export const atualizarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    roles: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const listarUsuariosSchema = z.object({
  query: z.object({
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().positive().max(100).default(20),
    busca: z.string().optional(),
  }),
});

// Middleware genérico de validação
// src/middlewares/validar.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidacaoError } from '../errors/negocio.errors';

export const validar = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidacaoError(error.flatten().fieldErrors));
      } else {
        next(error);
      }
    }
  };
```

**Regras**:
- Um arquivo por recurso
- Usar **Zod** (recomendado) ou Joi para schema validation
- Validar `body`, `params`, `query` separadamente
- Middleware genérico `validar(schema)` aplicado nas rotas
- Erros de validação → `ValidacaoError` (400) com detalhes por campo

---

### 5. Repositórios (`src/repositories/`)

**Responsabilidade**: Isolar acesso a dados (Prisma/SQL) quando agrega valor (queries complexas, múltiplas tabelas, abstração de storage).

```typescript
// src/repositories/usuarios.repository.ts
import { PrismaClient, Usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListarUsuariosFiltros } from '../types/usuario.types';

export class UsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(filtros: ListarUsuariosFiltros) {
    const { pagina, limite, busca } = filtros;
    const skip = (pagina - 1) * limite;

    const where = busca
      ? {
          OR: [
            { nome: { contains: busca, mode: 'insensitive' as const } },
            { email: { contains: busca, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [usuarios, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limite,
        orderBy: { criadoEm: 'desc' },
        select: { id: true, nome: true, email: true, roles: true, criadoEm: true, atualizadoEm: true },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      dados: usuarios,
      paginacao: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
    };
  }

  async encontrarPorId(id: string) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async encontrarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async criar(dados: { nome: string; email: string; senha: string; roles?: string[] }) {
    return this.prisma.usuario.create({ data: dados });
  }

  async atualizar(id: string, dados: Partial<{ nome: string; email: string; roles: string[] }>) {
    return this.prisma.usuario.update({ where: { id }, data: dados });
  }

  async excluir(id: string) {
    return this.prisma.usuario.delete({ where: { id } });
  }
}
```

**Quando CRIAR um Repository**:
- Queries complexas (joins, agregações, subqueries)
- Múltiplas operações em transação
- Abstração de storage (ex: migrar de Prisma para outro ORM)
- Lógica de cache, soft delete, auditoria

**Quando NÃO criar** (usar Prisma direto no Service):
- CRUD simples (findUnique, create, update, delete)
- Queries triviais (findMany com where simples)
- Não há benefício de abstração

---

### 6. Middlewares (`src/middlewares/`)

**Responsabilidade**: Responsabilidades transversais (cross-cutting concerns).

```typescript
// src/middlewares/autenticar.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwt.service';
import { NaoAutenticadoError } from '../errors/negocio.errors';

export const autenticar = (jwtService: JwtService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new NaoAutenticadoError('Token não fornecido');
      }

      const token = authHeader.substring(7);
      const payload = await jwtService.verificar(token);

      // Anexa usuário ao request para controllers/middlewares posteriores
      req.usuario = { id: payload.sub, email: payload.email, roles: payload.roles };
      next();
    } catch (error) {
      next(error);
    }
  };

// src/middlewares/autorizar.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { NaoAutorizadoError } from '../errors/negocio.errors';

export const autorizar = (...permissoesRequeridas: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const usuario = req.usuario;
    if (!usuario) {
      return next(new NaoAutorizadoError('Usuário não autenticado'));
    }

    const temPermissao = permissoesRequeridas.some(p => usuario.roles.includes(p));
    if (!temPermissao) {
      return next(new NaoAutorizadoError(`Permissão necessária: ${permissoesRequeridas.join(' ou ')}`));
    }
    next();
  };

// src/middlewares/error-handler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../utils/http-status';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log do erro (em produção: structured logging para observabilidade)
  console.error('[ERROR]', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Erros de validação Zod
  if (error instanceof ZodError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      erro: 'VALIDACAO',
      mensagem: 'Dados de entrada inválidos',
      detalhes: error.flatten().fieldErrors,
    });
    return;
  }

  // Erros da aplicação (AppError e subclasses)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      erro: error.codigo,
      mensagem: error.message,
      ...(error.detalhes && { detalhes: error.detalhes }),
    });
    return;
  }

  // Erros Prisma conhecidos
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const campo = (error.meta?.target as string[])?.join(', ') || 'campo';
      res.status(HTTP_STATUS.CONFLICT).json({
        erro: 'CONFLITO_UNICIDADE',
        mensagem: `Já existe um registro com este ${campo}`,
      });
      return;
    }
    if (error.code === 'P2025') {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        erro: 'NAO_ENCONTRADO',
        mensagem: 'Registro não encontrado',
      });
      return;
    }
  }

  // Erro não tratado - não vazar stack trace em produção
  const isDev = process.env.NODE_ENV === 'development';
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    erro: 'ERRO_INTERNO',
    mensagem: 'Erro interno do servidor',
    ...(isDev && { stack: error.stack }),
  });
};
```

**Middlewares Obrigatórios**:
| Middleware | Função |
|------------|--------|
| `autenticar` | Validar JWT/session, anexar `req.usuario` |
| `autorizar` | Verificar roles/permissões |
| `validar` | Validar entrada (Zod) |
| `errorHandler` | Tratamento centralizado (último middleware) |
| `rateLimiter` | Rate limiting (express-rate-limit) |
| `cors` | CORS restritivo |
| `helmet` | Headers de segurança |
| `requestLogger` | Log estruturado de requisições |

---

### 7. Configuração (`src/config/`)

**Responsabilidade**: Centralizar e validar variáveis de ambiente.

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('/api/v1'),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Argon2
  ARGON2_MEMORY_COST: z.coerce.number().default(19456), // 19 MB
  ARGON2_TIME_COST: z.coerce.number().default(2),
  ARGON2_PARALLELISM: z.coerce.number().default(1),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Rate Limit
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 min
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export const getEnv = (): Env => {
  if (cachedEnv) return cachedEnv;

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Variáveis de ambiente inválidas:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }

  cachedEnv = result.data;
  return cachedEnv;
};

// Uso: const env = getEnv(); env.JWT_SECRET
```

**Regras**:
- Validar **todas** env vars no startup (fail fast)
- Zod schema com tipos, defaults, mensagens de erro claras
- Cache da config validada (singleton)
- Nunca acessar `process.env` diretamente fora do config
- `.env.example` com valores fictícios no Git; `.env` real no `.gitignore`

---

### 8. Tipos (`src/types/`)

**Responsabilidade**: Contratos TypeScript compartilhados entre camadas.

```typescript
// src/types/usuario.types.ts
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string; // hash
  roles: string[];
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  roles: string[];
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
}

export interface ListarUsuariosFiltros {
  pagina: number;
  limite: number;
  busca: string;
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
```

**Regras**:
- Tipos de **entrada** (DTOs), **saída** (Response), **internos** (Domain/Entity)
- **Nunca** expor `senha`, `token`, campos sensíveis em Response types
- Compartilhar tipos entre frontend/backend via `types/` na raiz ou pacote npm interno

---

### 9. Tratamento de Erros (`src/errors/`)

**Responsabilidade**: Padronizar erros da aplicação, evitar vazamento de informações.

```typescript
// src/errors/AppError.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly codigo: string;
  public readonly detalhes?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    codigo: string,
    detalhes?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.codigo = codigo;
    this.detalhes = detalhes;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// src/errors/negocio.errors.ts
import { AppError } from './AppError';
import { HTTP_STATUS } from '../utils/http-status';

export class NaoAutenticadoError extends AppError {
  constructor(message = 'Não autenticado') {
    super(message, HTTP_STATUS.UNAUTHORIZED, 'NAO_AUTENTICADO');
  }
}

export class NaoAutorizadoError extends AppError {
  constructor(message = 'Não autorizado') {
    super(message, HTTP_STATUS.FORBIDDEN, 'NAO_AUTORIZADO');
  }
}

export class NaoEncontradoError extends AppError {
  constructor(recurso: string, id?: string) {
    super(
      `${recurso}${id ? ` (${id})` : ''} não encontrado`,
      HTTP_STATUS.NOT_FOUND,
      'NAO_ENCONTRADO',
      { recurso, id }
    );
  }
}

export class ConflitoError extends AppError {
  constructor(message: string, detalhes?: Record<string, any>) {
    super(message, HTTP_STATUS.CONFLICT, 'CONFLITO', detalhes);
  }
}

export class ValidacaoError extends AppError {
  constructor(detalhes: Record<string, string[]>) {
    super('Dados de entrada inválidos', HTTP_STATUS.BAD_REQUEST, 'VALIDACAO', detalhes);
  }
}

// Erros de domínio específicos
export class UsuarioNaoEncontradoError extends NaoEncontradoError {
  constructor(id: string) {
    super('Usuário', id);
  }
}

export class EmailJaCadastradoError extends ConflitoError {
  constructor(email: string) {
    super('Email já cadastrado', { campo: 'email', valor: email });
  }
}
```

**Padrão de Códigos de Erro**:
| Código | HTTP Status | Uso |
|--------|-------------|-----|
| `VALIDACAO` | 400 | Dados de entrada inválidos |
| `NAO_AUTENTICADO` | 401 | Token ausente/inválido/expirado |
| `NAO_AUTORIZADO` | 403 | Permissão insuficiente |
| `NAO_ENCONTRADO` | 404 | Recurso não existe |
| `CONFLITO` | 409 | Unicidade, estado inválido |
| `CONFLITO_UNICIDADE` | 409 | Prisma P2002 |
| `ERRO_INTERNO` | 500 | Erro não tratado |

---

## Frontend - Camadas Detalhadas

### Estrutura `frontend/src/`

```
src/
├── components/           # Componentes reutilizáveis (UI)
│   ├── ui/               # Primitivos: Button, Input, Card, Modal, Table, etc.
│   ├── forms/            # Componentes de formulário compostos
│   ├── layout/           # Header, Sidebar, Footer, Container
│   └── feedback/         # Toast, Alert, Spinner, Skeleton
│
├── pages/                # Páginas = rotas principais
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Usuarios/
│   │   ├── Lista.tsx
│   │   ├── Novo.tsx
│   │   └── Editar.tsx
│   └── Perfil.tsx
│
├── layouts/              # Wrappers de página
│   ├── MainLayout.tsx    # Com sidebar/header
│   ├── AuthLayout.tsx    # Login/register (sem sidebar)
│   └── EmptyLayout.tsx   # Para páginas especiais
│
├── hooks/                # Hooks personalizados
│   ├── useAuth.ts        # Estado autenticação
│   ├── useUsuarios.ts    # CRUD usuários (React Query / SWR)
│   ├── useApi.ts         # Wrapper fetch tipado
│   └── useDebounce.ts    # Utilitário
│
├── services/             # Camada de API (HTTP client)
│   ├── api.ts            # Instância axios/fetch configurada
│   ├── auth.api.ts       # Endpoints auth
│   ├── usuarios.api.ts   # Endpoints usuários
│   └── types.ts          # Tipos de request/response da API
│
├── types/                # Tipos compartilhados frontend
│   ├── usuario.types.ts  # Mirrors backend types (ou import de pacote compartilhado)
│   └── api.types.ts      # ApiResponse, PaginatedResponse, etc.
│
├── utils/                # Funções puras
│   ├── formatters.ts     # formatDate, formatCurrency, etc.
│   ├── validators.ts     # Validações client-side (Zod schemas)
│   ├── constants.ts      # Enums, listas estáticas
│   └── helpers.ts        # Outras utilidades
│
├── contexts/             # React Context (estado global mínimo)
│   ├── AuthContext.tsx   # User, login, logout, token refresh
│   └── ThemeContext.tsx  # Dark/light mode
│
├── styles/               # Estilos globais
│   ├── globals.css       # Reset, variáveis CSS, tailwind base
│   └── tokens.css        # Design tokens (cores, spacing, typography)
│
├── routes/               # Configuração de rotas (React Router)
│   ├── routes.tsx        # Definição de rotas + lazy loading
│   └── protected.tsx     # Wrapper rotas protegidas
│
├── main.tsx              # Entry point (Providers, App)
├── App.tsx               # Componente raiz + Router
└── vite-env.d.ts         # Tipos Vite
```

---

### 1. Componentes (`src/components/`)

**Componentes UI (Primitivos)** - shadcn/ui / Radix UI + Tailwind:

```tsx
// src/components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Regras**:
- Componentes primitivos em `components/ui/` (Button, Input, Label, Card, Dialog, etc.)
- Componentes compostos em `components/forms/`, `components/layout/`, `components/feedback/`
- Props tipadas com interface `ComponentProps`
- `forwardRef` para componentes que precisam de ref
- `cn()` utility para merge de classes (clsx + tailwind-merge)
- Acessibilidade nativa (Radix UI primitives)

---

### 2. Páginas (`src/pages/`)

```tsx
// src/pages/Usuarios/Lista.tsx
import { useUsuarios } from '@/hooks/useUsuarios';
import { UsuarioTable } from '@/components/forms/UsuarioTable';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';

export function UsuariosListaPage() {
  const { data, isLoading, error, refetch } = useUsuarios();

  if (isLoading) return <TableSkeleton />;
  if (error) return <Alert variant="destructive">Erro ao carregar usuários</Alert>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Button asChild>
          <a href="/usuarios/novo"><PlusIcon className="mr-2 h-4 w-4" /> Novo Usuário</a>
        </Button>
      </div>
      <UsuarioTable usuarios={data?.dados || []} onRefresh={refetch} />
    </div>
  );
}
```

**Regras**:
- Uma página por rota principal
- Páginas **não** contêm lógica de negócio ou fetch direto
- Usam hooks (`useUsuarios`) para dados
- Compositam componentes de `components/`
- Estados: loading, error, empty, success

---

### 3. Hooks (`src/hooks/`)

```typescript
// src/hooks/useUsuarios.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '@/services/usuarios.api';
import { UsuarioResponse, CriarUsuarioDTO, AtualizarUsuarioDTO } from '@/types/usuario.types';

export function useUsuarios(filtros?: { pagina?: number; limite?: number; busca?: string }) {
  return useQuery({
    queryKey: ['usuarios', filtros],
    queryFn: () => usuariosApi.listar(filtros),
    placeholderData: (previous) => previous, // keep previous data while fetching
  });
}

export function useCriarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: CriarUsuarioDTO) => usuariosApi.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

export function useAtualizarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: AtualizarUsuarioDTO }) =>
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
```

**Regras**:
- Um hook por recurso/feature (`useUsuarios`, `useAuth`, `useProdutos`)
- Encapsular React Query / SWR / fetch logic
- Retornar objeto com: data, isLoading, error, mutações
- Invalidar queries relacionadas após mutações
- Tipagem completa de entrada/saída

---

### 4. Serviços HTTP (`src/services/`)

```typescript
// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, refreshAuthToken, clearAuth } from '@/utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: anexar token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: refresh token automático
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: Error) => void }> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAuthToken();
        failedQueue.forEach(({ resolve }) => resolve(newToken));
        failedQueue = [];
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        failedQueue.forEach(({ reject }) => reject(refreshError as Error));
        failedQueue = [];
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };

// src/services/usuarios.api.ts
import { api } from './api';
import { ListarUsuariosFiltros, UsuarioResponse, CriarUsuarioDTO, AtualizarUsuarioDTO } from '@/types/usuario.types';

export const usuariosApi = {
  listar: (filtros?: ListarUsuariosFiltros) =>
    api.get<{ dados: UsuarioResponse[]; paginacao: any }>('/usuarios', { params: filtros })
      .then(res => res.data),

  obterPorId: (id: string) =>
    api.get<UsuarioResponse>(`/usuarios/${id}`).then(res => res.data),

  criar: (dados: CriarUsuarioDTO) =>
    api.post<UsuarioResponse>('/usuarios', dados).then(res => res.data),

  atualizar: (id: string, dados: AtualizarUsuarioDTO) =>
    api.patch<UsuarioResponse>(`/usuarios/${id}`, dados).then(res => res.data),

  excluir: (id: string) =>
    api.delete(`/usuarios/${id}`).then(res => res.data),
};
```

**Regras**:
- Instância axios/fetch única configurada (`api.ts`)
- Interceptors: auth token, refresh token, error handling global
- Um arquivo por recurso (`usuarios.api.ts`, `auth.api.ts`)
- Funções retornam **apenas data** (`.then(res => res.data)`)
- Tipagem completa de request/response
- Base URL via `import.meta.env.VITE_API_URL`

---

### 5. Tipos Frontend (`src/types/`)

```typescript
// src/types/usuario.types.ts
// Espelha tipos do backend (ou importa de pacote compartilhado)
export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  roles: string[];
  criadoEm: string; // ISO string no frontend
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
}

export interface ListarUsuariosFiltros {
  pagina?: number;
  limite?: number;
  busca?: string;
}

// src/types/api.types.ts
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
```

---

### 6. Gerenciamento de Estado

| Complexidade | Solução |
|--------------|---------|
| Estado local componente | `useState`, `useReducer` |
| Estado compartilhado simples | React Context (`AuthContext`, `ThemeContext`) |
| Server state (cache, sync) | **TanStack Query (React Query)** - padrão |
| Estado global complexo | Zustand / Jotai (avaliar necessidade) |
| Formulários | React Hook Form + Zod resolver |

**Exemplo AuthContext**:

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { UsuarioResponse } from '@/types/usuario.types';
import { getAuthToken, setAuthToken, clearAuth } from '@/utils/auth';

interface AuthContextValue {
  usuario: UsuarioResponse | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await api.get<UsuarioResponse>('/auth/me');
      setUsuario(data);
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getAuthToken()) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, senha: string) => {
    const { data } = await api.post<{ accessToken: string; user: UsuarioResponse }>('/auth/login', { email, senha });
    setAuthToken(data.accessToken);
    setUsuario(data.user);
  };

  const logout = () => {
    clearAuth();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
```

---

## Exemplo Funcional Completo: Funcionalidade "Usuários"

### Fluxo Backend Completo

```
GET /api/v1/usuarios
    │
    ▼
┌─────────────────────────────────────┐
│ src/routes/usuarios.routes.ts       │
│ router.get('/', autenticar,         │
│   autorizar('usuarios:listar'),     │
│   validarCorpo(listarUsuariosSchema),│
│   controller.listar)                │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ src/controllers/usuarios.controller │
│ .listar(req, res, next)             │
│   → extrai query params             │
│   → service.listar(filtros)         │
│   → res.json(resultado)             │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ src/services/usuarios.service.ts    │
│ .listar(filtros)                    │
│   → repository.listar(filtros)      │
│   → retorna paginado                │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ src/repositories/usuarios.repository│
│ .listar(filtros)                    │
│   → prisma.usuario.findMany()       │
│   → prisma.usuario.count()          │
│   → retorna { dados, paginacao }    │
└─────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ Prisma Client → PostgreSQL          │
│ SELECT * FROM usuarios ...          │
└─────────────────────────────────────┘
```

### Fluxo Frontend Completo

```tsx
// 1. Página usa hook
// src/pages/Usuarios/Lista.tsx
const { data, isLoading } = useUsuarios({ pagina: 1, limite: 20 });

// 2. Hook usa React Query + service API
// src/hooks/useUsuarios.ts
useQuery({
  queryKey: ['usuarios', filtros],
  queryFn: () => usuariosApi.listar(filtros),
});

// 3. Service API faz HTTP
// src/services/usuarios.api.ts
api.get('/usuarios', { params: filtros }).then(res => res.data);

// 4. Axios interceptor anexa JWT
// src/services/api.ts
config.headers.Authorization = `Bearer ${token}`;

// 5. Backend recebe, valida, processa, responde
// 6. Frontend recebe dados tipados, renderiza componente
<UsuarioTable usuarios={data.dados} />;
```

---

## Prisma Schema Exemplo (`backend/prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id        String   @id @default(uuid())
  nome      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(255)
  senha     String   @db.VarChar(255) // hash Argon2id
  roles     String[] @default(["user"])
  criadoEm  DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  @@index([email])
  @@map("usuarios")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique @db.VarChar(500)
  usuarioId String
  usuario   Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  expiraEm  DateTime
  criadoEm  DateTime @default(now())

  @@index([usuarioId])
  @@map("refresh_tokens")
}
```

---

## Convenções de Nomenclatura

| Item | Padrão | Exemplo |
|------|--------|---------|
| Arquivos backend | kebab-case, sufixo `.ts` | `usuarios.controller.ts` |
| Classes backend | PascalCase | `UsuariosController` |
| Métodos backend | camelCase, verbo + substantivo | `obterPorId`, `criar` |
| Interfaces/types | PascalCase, sufixo opcional | `UsuarioResponse`, `CriarUsuarioDTO` |
| Enums | PascalCase, singular | `Role`, `StatusUsuario` |
| Constantes | UPPER_SNAKE_CASE | `HTTP_STATUS`, `MAX_UPLOAD_SIZE` |
| Variáveis env | UPPER_SNAKE_CASE | `DATABASE_URL`, `JWT_SECRET` |
| Rotas API | kebab-case, plural | `/api/v1/usuarios`, `/api/v1/permissoes` |
| Componentes React | PascalCase | `UsuarioTable`, `Button` |
| Hooks | camelCase, prefixo `use` | `useUsuarios`, `useAuth` |
| Serviços API | camelCase, sufixo `.api.ts` | `usuarios.api.ts` |

---

## Referências Cruzadas

- `docs/CODIGO-LIMPO.md` - Regras de código limpo aplicáveis a esta arquitetura
- `docs/SEGURANCA.md` - Regras de segurança (auth, validação, headers, etc.)
- `docs/TESTES.md` - Estratégia de testes para cada camada
- `templates/ARQUITETURA.md` - Template para documentar arquitetura de projetos específicos
- `exemplos/arquitetura-modular/` - Implementação de referência funcional