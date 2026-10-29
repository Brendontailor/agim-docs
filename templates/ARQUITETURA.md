# Template ARQUITETURA.md - Decisoes Arquiteturais do Projeto

> Copie este arquivo para `docs/ARQUITETURA.md` do seu projeto e preencha as secoes.

---

# ARQUITETURA - [NOME DO PROJETO]

> Documentacao das decisoes arquiteturais, padroes e convencoes do projeto.
> Baseado na Biblia Universal (`ARCHITECTURE.md` + `docs/ARQUITETURA.md`).

---

## 1. VISAO GERAL

### Objetivo Arquitetural
[Descreva o objetivo arquitetural principal: ex: "Sistema modular, escalavel, manutenivel, com separacao clara de responsabilidades e facil testabilidade"]

### Principais Decisoes
| Decisao | Opcao Escolhida | Justificativa | ADR Relacionado |
|---------|-----------------|---------------|-----------------|
| Arquitetura geral | Monorepo (frontend + backend) | Deploy independente, tipos compartilhados | ADR-001 |
| Backend | Clean Architecture (Routes->Controllers->Services->Repositories) | Separacao responsabilidades, testabilidade | ADR-002 |
| Frontend | Component-based + Atomic Design + React Query | Reuso, DX, server state management | ADR-003 |
| Database | PostgreSQL + Prisma | Type-safety, migrations, DX | ADR-004 |
| Auth | JWT RS256 + Argon2id + Refresh rotation | Seguranca, padrao industria | ADR-005 |

---

## 2. BACKEND - ARQUITETURA DETALHADA

### Camadas (Clean Architecture)

```
src/
├── routes/           # Definicao endpoints + middlewares
├── controllers/      # Recebem req/res -> chamam services
├── services/         # Regras de negocio (use cases)
├── validators/       # Validacao entrada (Zod)
├── repositories/     # Acesso dados (quando agrega valor)
├── middlewares/      # Auth, AuthZ, Error handling, Logging
├── config/           # Config centralizada + validacao env
├── types/            # Tipos e contratos (DTOs, Entities)
├── errors/           # Classes erro padronizadas (AppError)
├── utils/            # Utilitarios puros
├── prisma/           # Prisma Client + extensions
└── app.ts            # Factory Express
```

### Responsabilidades por Camada

| Camada | Responsabilidade | Nao Deve |
|--------|------------------|----------|
| **Routes** | Endpoints, middlewares, delegacao | Logica negocio, acesso DB direto |
| **Controllers** | Receber req/res, extrair dados, chamar service, formatar resposta | Logica negocio, acesso DB |
| **Services** | Regras negocio, orquestracao, validacoes invariantes, eventos | Conhecer HTTP (req/res), erros HTTP diretos |
| **Validators** | Validar body/params/query (Zod) | Logica negocio |
| **Repositories** | Isolar queries complexas, multi-tabelas, abstraccao storage | Logica negocio (apenas dados) |
| **Middlewares** | Auth, AuthZ, Error handling, Logging, Rate limit, CORS | Logica negocio especifica |

### Convencoes Backend

| Item | Padrao | Exemplo |
|------|--------|---------|
| Arquivos | kebab-case + sufixo | `usuarios.controller.ts` |
| Classes | PascalCase | `UsuariosController` |
| Metodos | camelCase, verbo+substantivo | `obterPorId`, `criar` |
| Interfaces/Types | PascalCase, sufixo opcional | `UsuarioResponse`, `CriarUsuarioDTO` |
| Enums | PascalCase singular | `Role`, `StatusUsuario` |
| Constantes | UPPER_SNAKE_CASE | `HTTP_STATUS`, `MAX_UPLOAD_SIZE` |
| Variaveis env | UPPER_SNAKE_CASE | `DATABASE_URL`, `JWT_SECRET` |
| Rotas API | kebab-case, plural | `/api/v1/usuarios` |

---

## 3. FRONTEND - ARQUITETURA DETALHADA

### Estrutura `frontend/src/`

```
src/
├── components/           # Componentes reutilizaveis (UI)
│   ├── ui/               # Primitivos: Button, Input, Card, Modal, Table
│   ├── forms/            # Componentes formulario compostos
│   ├── layout/           # Header, Sidebar, Footer, Container
│   └── feedback/         # Toast, Alert, Spinner, Skeleton
├── pages/                # Paginas = rotas principais
├── layouts/              # Wrappers (MainLayout, AuthLayout, EmptyLayout)
├── hooks/                # Hooks personalizados (useAuth, useUsuarios, useApi)
├── services/             # Camada API (axios tipado + interceptors)
├── types/                # Tipos compartilhados frontend
├── utils/                # Funcoes puras (formatters, validators, constants)
├── contexts/             # React Context (AuthContext, ThemeContext)
├── styles/               # Estilos globais, tokens CSS, variaveis
├── routes/               # Config rotas (React Router)
├── main.tsx              # Entry point (Providers, App)
├── App.tsx               # Componente raiz + Router
└── vite-env.d.ts
```

### Camadas Frontend

| Camada | Responsabilidade | Exemplos |
|--------|------------------|----------|
| **Components/UI** | Primitivos reutilizaveis, acessiveis, responsivos | Button, Input, Card, Dialog, Table |
| **Components/Forms** | Compostos de formulario com validacao | UsuarioForm, LoginForm |
| **Components/Layout** | Wrappers de pagina | Header, Sidebar, MainLayout |
| **Components/Feedback** | Feedback visual | Toast, Alert, Spinner, Skeleton |
| **Pages** | Rotas principais, composicao componentes | LoginPage, DashboardPage, UsuariosListaPage |
| **Layouts** | Wrappers de pagina | MainLayout, AuthLayout |
| **Hooks** | Logica reutilizavel estado/efeitos | useAuth, useUsuarios, useApi |
| **Services** | Camada HTTP tipada (axios + interceptors) | usuariosApi, authApi |
| **Types** | Contratos compartilhados (DTOs, Response) | UsuarioResponse, CriarUsuarioDTO |
| **Utils** | Funcoes puras auxiliares | formatters, validators, constants |
| **Contexts** | Estado global minimo (Auth, Theme) | AuthContext, ThemeContext |
| **Routes** | Config roteamento + lazy loading | routes.tsx, protected.tsx |

### Padroes Frontend

| Item | Padrao | Exemplo |
|------|--------|---------|
| Componentes | PascalCase | `UsuarioTable`, `Button` |
| Hooks | camelCase, prefixo `use` | `useUsuarios`, `useAuth` |
| Servicos API | camelCase, sufixo `.api.ts` | `usuarios.api.ts` |
| Types | PascalCase | `UsuarioResponse`, `CriarUsuarioDTO` |
| Hooks Return | Objeto com data/loading/error/mutacoes | `{ data, isLoading, error, criar }` |
| Props Interface | `ComponentProps` | `interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>` |
| ForwardRef | Para componentes que precisam ref | `forwardRef<HTMLButtonElement, ButtonProps>` |
| CSS Merge | `cn()` utility (clsx + tailwind-merge) | `className={cn(base, variants[variant], sizes[size], className)}` |

---

## 4. BANCO DE DADOS

### Prisma Schema - Convencoes

```prisma
// Convenções obrigatórias
model Usuario {
  id        String   @id @default(uuid())
  nome      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(255)
  senha     String   @db.VarChar(255)  // SEMPRE hash Argon2id
  roles     String[] @default(["user"])
  criadoEm  DateTime @default(now())
  atualizadoEm DateTime @updatedAt
  deletedAt DateTime?                  // Soft delete obrigatorio tabelas sensiveis

  @@index([email])
  @@index([deletedAt])
  @@map("usuarios")                    // snake_case tabela
}
```

### Regras Obrigatorias
- [ ] **Soft delete** (`deletedAt`) em tabelas sensiveis
- [ ] **Constraints**: `@unique`, `@relation(onDelete: Cascade/SetNull)`, `@@index`
- [ ] **Transacoes** (`$transaction`) para operacoes multi-tabela atomicas
- [ ] **Soft delete automatico**: Middleware Prisma para `findMany`/`findUnique` ignorar `deletedAt`
- [ ] **Migracoes versionadas**: `npx prisma migrate dev --name descritivo` (commit no Git)
- [ ] **Role DB dedicada**: `app_user` (NAO superuser), grants minimos (SELECT/INSERT/UPDATE/DELETE)

---

## 5. AUTENTICACAO E AUTORIZACAO

### Fluxo Auth
```
1. Login (email/senha) -> Argon2id verify -> JWT RS256 (15min) + Refresh Token (7d, hash DB, rotacao)
2. Request autenticado -> Middleware autenticar (verifica JWT) -> req.usuario
3. Rota protegida -> Middleware autorizar('permissao:acao') -> RBAC + IDOR check
4. Refresh token -> Rotacao (invalida anterior) -> Novo access + refresh
4. Logout -> Revoga refresh token -> Limpa cookies
```

### Configuracao Obrigatoria
| Item | Valor | Justificativa |
|------|-------|---------------|
| Hash senhas | Argon2id (memoryCost=19456, timeCost=2, parallelism=1) | Vencedor PHC, resistente GPU/ASIC |
| JWT Algorithm | RS256 (assimetrico) | Chave privada assina, publica verifica |
| Access Token | 15 min | Janela curta exposicao |
| Refresh Token | 7 dias + rotacao | Seguranca, revogacao granular |
| Cookies | HttpOnly, Secure, SameSite=lax (access) / strict (refresh) | XSS/CSRF protection |
| Rate Limit Auth | 5 tent/15min por IP + conta | Brute force protection |
| Rate Limit API | 100 req/min por IP | DoS protection |

### RBAC (Role-Based Access Control)
- Roles granulares: `admin`, `manager`, `user`, `guest`, `usuarios:listar`, `usuarios:criar`, `usuarios:editar`, `usuarios:excluir`
- Middleware `autorizar('permissao:acao')` em **TODAS** rotas protegidas
- IDOR Prevention: `userId === resource.ownerId` OU `roles.includes('admin')`
- Admin bypass auditado (logs acoes admin)

---

## 6. SEGURANCA

### Validacao e Sanitizacao
- [ ] **Backend = Barreira principal**: Zod schemas em **TODOS** endpoints (body, params, query)
- [ ] **Frontend = UX apenas**: Validacao client-side para UX, nunca confiar
- [ ] Zod schemas: `body`, `params`, `query` separados
- [ ] Sanitizacao output: DOMPurify se HTML user-generated
- [ ] Rejeicao campos extras (`strict()` ou `passthrough()` controlado)

### Protecao Ataques
| Ataque | Protecao Backend | Protecao Frontend |
|--------|------------------|-------------------|
| SQL Injection | Prisma ORM (parameterized queries) | N/A |
| XSS | Sanitizacao saida + CSP headers | React auto-escape + DOMPurify |
| CSRF | SameSite cookies + Double-submit token | SameSite lax/strict |
| SSRF | Allowlist dominios fetch externo | N/A |
| Prototype Pollution | `Object.freeze()` config, validação keys | N/A |

### Headers Seguranca (Helmet.js)
```javascript
helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], ... } },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xssFilter: true,
  noSniff: true,
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
})
```

### CORS
- Allowlist explicita (NAO `*`)
- `credentials: true` apenas se necessario
- Metodos: GET, POST, PATCH, DELETE, OPTIONS
- Headers: Content-Type, Authorization

### Segredos e Config
- [ ] `.env` real no `.gitignore` (NUNCA no Git)
- [ ] `.env.example` no Git com valores ficticios
- [ ] Validacao Zod startup (fail fast)
- [ ] **NUNCA** segredos em `VITE_*` (frontend)
- [ ] Chaves JWT: PRIVATE_KEY (assinatura), PUBLIC_KEY (verificacao) via env
- [ ] Rotação segredos documentada (cronograma + procedimento)
- [ ] Logs: sanitizacao automatica (senhas, tokens, CPF, PII)

---

## 7. COMUNICACAO FRONTEND <-> BACKEND

### Contratos (Tipos Compartilhados)
- Tipos em `types/` na raiz ou pacote npm interno `@meu-projeto/types`
- DTOs entrada (`CriarXDTO`, `AtualizarXDTO`)
- DTOs saida (`XResponse` - **SEM senhas/tokens**)
- `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError` padronizados

### API Client (Frontend)
```typescript
// Axios instance unica com interceptors
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Request: anexa JWT automatico
// Response: refresh token automatico (401 -> refresh -> retry)
// Error handling global
```

### Padroes API
| Item | Padrao |
|------|--------|
| Base URL | `/api/v1` |
| Recursos | kebab-case plural (`/api/v1/usuarios`) |
| Metodos | GET, POST, PATCH, DELETE |
| Paginação | `?pagina=1&limite=20` |
| Busca | `?busca=termo` |
| Ordenacao | `?ordenarPor=campo&ordem=asc|desc` |
| Respostas | `{ dados: T[], paginacao: { pagina, limite, total, totalPaginas } }` |
| Erros | `{ erro: 'CODIGO', mensagem: '...', detalhes?: {} }` |

---

## 8. OBSERVABILIDADE

### Logs
- [ ] Structured logging (Pino/Winston) - JSON
- [ ] Sanitizacao automatica: senhas, tokens, CPF, PII, cartoes
- [ ] Niveis: `debug` (dev), `info` (prod), `warn`, `error`
- [ ] Campos padrao: `timestamp`, `level`, `message`, `traceId`, `userId`, `path`, `method`
- [ ] Retenção: >= 1 ano (logs seguranca), 30 dias (app)

### Metricas
- [ ] Latencia p50/p95/p99 por endpoint
- [ ] Error rate por endpoint
- [ ] Throughput (req/s)
- [ ] Business metrics (conversao, receita, usuarios ativos)
- [ ] SLA: uptime > 99.9%, p95 < 200ms

### Alertas
- [ ] Error rate > 1% (5 min)
- [ ] Latencia p95 > 2x baseline (5 min)
- [ ] 5xx spike
- [ ] Auth failures spike
- [ ] Rate limit hits
- [ ] Disco/CPU/Memoria > 80%

### Tracing (se microservicos)
- [ ] OpenTelemetry + Jaeger/Zipkin
- [ ] Trace IDs propagados via headers
- [ ] Spans: HTTP request, DB query, external API call

---

## 9. DECISOES TECNICAS (ADRs)

> Registre decisoes significativas em `docs/DECISOES-TECNICAS.md` usando `templates/DECISAO-TECNICA.md`

| ADR | Titulo | Status | Data |
|-----|--------|--------|------|
| ADR-001 | Monorepo frontend+backend | Aceita | YYYY-MM-DD |
| ADR-002 | Clean Architecture backend | Aceita | YYYY-MM-DD |
| ADR-003 | React Query para server state | Aceita | YYYY-MM-DD |
| ADR-004 | Argon2id para hash senhas | Aceita | YYYY-MM-DD |
| ADR-005 | JWT RS256 + Refresh rotation | Aceita | YYYY-MM-DD |

---

## 10. RISCOS E MITIGACOES

| Risco | Probabilidade | Impacto | Mitigacao | Responsavel |
|-------|---------------|---------|-----------|-------------|
| Vazamento segredos | Media | Critico | Validação startup, .gitignore, secrets scanning CI, rotação periodica | Tech Lead |
| Breaking change API | Alta | Alto | Versionamento API (/v1, /v2), contracts tipados, testes contrato | Tech Lead |
| Performance degrada | Media | Alto | Monitoring alertas, load testing pre-deploy, indices DB | Tech Lead + DBA |
| Vazamento dados (LGPD) | Baixa | Critico | Criptografia, minimizacao dados, DPO, auditoria periodica | DPO + Tech Lead |
| Dependencia critica vulneravel | Media | Alto | Dependabot, npm audit CI, auditoria mensal, WAF | Tech Lead |

---

## 11. EVOLUCAO E MANUTENCAO

### Versionamento
- Semantic Versioning (MAJOR.MINOR.PATCH)
- `CHANGELOG.md` atualizado a cada release (Conventional Commits)
- Tags Git: `v1.2.0` (annotated, signed)

### Deprecacao
- [ ] Expand/Contract pattern para migracoes DB
- [ ] API versioning: `/v1/`, `/v2/` (headers ou URL)
- [ ] Deprecation headers: `Sunset`, `Deprecation`, `Link`
- [ ] Comunicacao antecipada (min 3 meses para breaking changes)

### Tech Debt
- [ ] Registrado em `templates/DIVIDA-TECNICA.md`
- [ ] Priorizado por: impacto x esforco x risco
- [ ] Sprint dedicadas periodicas (ex: 1 sprint a cada 6)
- [ ] Metrica: % tempo gasto em tech debt vs features novas

---

## 12. REFERENCIAS

- `ARCHITECTURE.md` (Biblia) - Padroes universais
- `docs/CODIGO-LIMPO.md` - Padroes codigo limpo
- `docs/SEGURANCA.md` - Regras seguranca detalhadas
- `docs/TESTES.md` - Estrategia testes
- `docs/FERRAMENTAS-IA.md` - Ferramentas IA disponiveis
- `docs/IA-E-CONTEXTO.md` - RAG, Graphify, Context7, memoria
- `SKILLS-CATALOG.md` - Catalogo skills disponiveis
- `ORCHESTRATOR.md` - Roteamento skills/ferramentas
- `checklists/` - 9 checklists obrigatorios
- `templates/` - 12 templates reutilizaveis