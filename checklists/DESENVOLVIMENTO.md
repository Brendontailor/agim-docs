# Checklist de Desenvolvimento - Durante Implementacao

> Use durante a implementacao de features/correcoes. Marque `[x]` quando verificado, `[~]` se parcialmente atendido (registre observacao), `[ ]` se nao aplicavel.

---

## Planejamento e Contexto

### Antes de Codificar
- [ ] `skill entrevista-orquestradora` ativada para a tarefa
- [ ] Tarefa classificada: Dominio/Tipo/Complexidade/Risco/Escopo
- [ ] `skill planejamento-de-tarefas` executada (plano com etapas, dependencias, criterios)
- [ ] `memoria/PLANO-DE-EXECUCAO.md` atualizado com etapas da tarefa
- [ ] Criterios de aceitacao claros e testaveis por etapa
- [ ] Dependencias identificadas (outras tasks, APIs, migracoes)
- [ ] Riscos identificados com mitigacoes
- [ ] `memoria/PROXIMO-PASSO.md` aponta para etapa atual

### Contexto Tecnico
- [ ] Stack confirmada para a tarefa (frontend/backend/both)
- [ ] Arquivos afetados identificados (novos, modificados, removidos)
- [ ] Contratos (tipos, APIs, eventos) definidos/atualizados
- [ ] `docs/ARQUITETURA.md` revisado para padroes da camada afetada
- [ ] `docs/CODIGO-LIMPO.md` revisado para padroes aplicaveis

---

## Implementacao Backend

### Rotas e Controllers
- [ ] Rotas definidas em `src/routes/{recurso}.routes.ts`
- [ ] Middlewares na ordem: `autenticar` -> `autorizar` -> `validar` -> `controller`
- [ ] Controller recebe req/res, extrai dados, chama service, retorna resposta
- [ ] Controller **nao** contem regras de negocio
- [ ] Controller **nao** acessa Prisma/repositorio diretamente
- [ ] Tratamento de erro via `next(error)` (middleware centralizado)
- [ ] Respostas padronizadas via `HTTP_STATUS` constants

### Servicos (Regras de Negocio)
- [ ] Service em `src/services/{recurso}.service.ts`
- [ ] Injecao de dependencia via construtor (repository, hash, events, outros services)
- [ ] **Toda** logica de negocio no service (validacoes invariantes, transacoes, eventos)
- [ ] Service **nao** conhece HTTP (req/res)
- [ ] Service **nao** lanca erros HTTP diretos (lanca `AppError` subclasses)
- [ ] Metodos retornam DTOs de resposta (sem senhas, tokens internos)
- [ ] Validacoes de unicidade/integridade referencial **antes** de persistir

### Validacao (Zod)
- [ ] Schemas em `src/validators/{recurso}.validator.ts`
- [ ] Validam `body`, `params`, `query` separadamente
- [ ] Middleware `validar(schema)` aplicado nas rotas
- [ ] Erros -> `ValidacaoError` (400) com detalhes por campo
- [ ] Rejeicao campos extras (`strict()` ou `passthrough()` controlado)

### Repositorios (se necessario)
- [ ] Repository em `src/repositories/{recurso}.repository.ts`
- [ ] Isola queries complexas, multi-tabelas, abstraccao storage
- [ ] **Nao** criar repository para CRUD simples (usar Prisma direto no Service)
- [ ] Transacoes via `prisma.$transaction` para operacoes atomicas

### Middlewares
- [ ] `autenticar`: valida JWT, anexa `req.usuario`
- [ ] `autorizar`: verifica roles/permissoes (RBAC granular)
- [ ] `validar`: valida Zod schemas
- [ ] `errorHandler`: tratamento centralizado (ultimo middleware)
- [ ] `rateLimiter`: 5/15min auth, 100req/min API
- [ ] `cors`: allowlist explicita
- [ ] `helmet`: CSP, HSTS, X-Frame-Options, Referrer-Policy
- [ ] `requestLogger`: log estruturado (Pino/Winston)

### Configuracao e Env
- [ ] `src/config/env.ts` com Zod schema + fail fast startup
- [ ] Cache da config validada (singleton)
- [ ] Nunca acessar `process.env` diretamente fora do config
- [ ] `.env.example` no Git com valores ficticios
- [ ] `.env` real no `.gitignore`

### Tipos e Contratos
- [ ] Tipos em `src/types/{recurso}.types.ts`
- [ ] DTOs entrada (`CriarXDTO`, `AtualizarXDTO`)
- [ ] DTOs saida (`XResponse` - **sem senhas/tokens**)
- [ ] Types internos domain (`X` entity)
- [ ] Compartilhados frontend/backend via `types/` raiz ou pacote npm

### Tratamento de Erros
- [ ] `AppError` base + subclasses (`NaoAutenticadoError`, `NaoAutorizadoError`, `NaoEncontradoError`, `ValidacaoError`, `ConflitoError`)
- [ ] Codigos padrao: `VALIDACAO`(400), `NAO_AUTENTICADO`(401), `NAO_AUTORIZADO`(403), `NAO_ENCONTRADO`(404), `CONFLITO`(409), `ERRO_INTERNO`(500)
- [ ] Middleware `errorHandler` centralizado (ultimo middleware)
- [ ] Sem stack trace em producao (`NODE_ENV=production`)
- [ ] Logs estruturados (Pino/Winston) + sanitizacao (senhas, tokens, PII)

### Banco de Dados (Prisma)
- [ ] Schema `prisma/schema.prisma` atualizado
- [ ] Migracao versionada: `npx prisma migrate dev --name descritivo`
- [ ] Constraints: `@unique`, `@relation(onDelete: Cascade/SetNull)`, `@@index`
- [ ] Soft delete (`deletedAt`) em tabelas sensiveis
- [ ] Transacoes (`$transaction`) para operacoes multi-tabela
- [ ] Role DB dedicada `app_user` (NAO superuser), grants minimos

---

## Implementacao Frontend

### Componentes
- [ ] Primitivos em `src/components/ui/` (Button, Input, Card, Dialog, Table) - shadcn/ui + Radix + Tailwind
- [ ] Compostos em `src/components/forms/`, `layout/`, `feedback/`
- [ ] Props tipadas com interface `ComponentProps`
- [ ] `forwardRef` para componentes que precisam de ref
- [ ] `cn()` utility (clsx + tailwind-merge) para merge classes
- [ ] Acessibilidade nativa (Radix UI primitives)
- [ ] Variants/sizes consistentes (default, destructive, outline, ghost, link | default, sm, lg, icon)

### Paginas e Layouts
- [ ] Paginas em `src/pages/` (uma por rota principal)
- [ ] Layouts em `src/layouts/` (MainLayout, AuthLayout, EmptyLayout)
- [ ] Paginas **nao** contem logica de negocio ou fetch direto
- [ ] Usam hooks (`useUsuarios`) para dados
- [ ] Composicao de componentes de `components/`
- [ ] Estados: loading, error, empty, success

### Hooks Personalizados
- [ ] Um hook por recurso/feature (`useUsuarios`, `useAuth`, `useProdutos`)
- [ ] Encapsulam React Query / SWR / fetch logic
- [ ] Retornam objeto: data, isLoading, error, mutacoes
- [ ] Invalidar queries relacionadas apos mutacoes
- [ ] Tipagem completa entrada/saida

### Servicos HTTP (API Client)
- [ ] Instancia axios unica em `src/services/api.ts`
- [ ] Interceptors: auth token, refresh token automatico, error handling global
- [ ] Um arquivo por recurso (`usuarios.api.ts`, `auth.api.ts`)
- [ ] Funcoes retornam **apenas data** (`.then(r => r.data)`)
- [ ] Tipagem completa request/response
- [ ] Base URL via `import.meta.env.VITE_API_URL`

### Tipos Frontend
- [ ] Tipos em `src/types/{recurso}.types.ts`
- [ ] Espelham tipos backend (DTOs, Response, PaginatedResponse)
- [ ] `ApiError` tipado para error handling

### Estado e Auth
- [ ] `AuthContext`: user, login, logout, refreshUser, token refresh automatico
- [ ] `ThemeContext`: dark/light mode
- [ ] Server state: **TanStack Query (React Query)** padrao
- [ ] Formularios: React Hook Form + Zod resolver
- [ ] Estado local: `useState`/`useReducer` (simples), Context (compartilhado simples), Zustand/Jotai (complexo - avaliar necessidade)

### Acessibilidade e Responsividade
- [ ] Semantic HTML: landmarks, headings hierarchy (h1-h6)
- [ ] Focus visible em todos elementos interativos
- [ ] ARIA labels em icones/inputs sem label visual
- [ ] Contraste >= 4.5:1 (normal), >= 3:1 (large text 18px+)
- [ ] Breakpoints: 320, 768, 1024, 1440
- [ ] Touch targets >= 44x44px
- [ ] Navegacao teclado completa (Tab, Enter, Escape, Setas)

---

## Qualidade de Codigo

### TypeScript
- [ ] `strict: true` no tsconfig
- [ ] `noUncheckedIndexedAccess: true`
- [ ] `exactOptionalPropertyTypes: true`
- [ ] `noImplicitReturns: true`, `noFallthroughCasesInSwitch: true`
- [ ] `noUnusedLocals: true`, `noUnusedParameters: true`
- [ ] **Zero** `any` desnecessario (usar `unknown` + type guard)
- [ ] Tipos de retorno explicitos em API publica
- [ ] Generics tipados corretamente

### Lint e Format
- [ ] ESLint: `no-explicit-any: error`, `no-unused-vars`, `consistent-type-imports`, `import/order`
- [ ] Prettier: single quotes, trailing commas, printWidth 100, tabWidth 2
- [ ] `npm run lint` passa (0 errors), `npm run format:check` passa
- [ ] Imports organizados: builtin -> external -> internal -> parent -> sibling -> index

### Nomenclatura e Estrutura
- [ ] Arquivos: kebab-case (`usuarios.controller.ts`)
- [ ] Classes: PascalCase (`UsuariosController`)
- [ ] Metodos: camelCase, verbo+substantivo (`obterPorId`, `criar`)
- [ ] Interfaces/Types: PascalCase (`UsuarioResponse`, `CriarUsuarioDTO`)
- [ ] Enums: PascalCase singular (`Role`, `StatusUsuario`)
- [ ] Constantes: UPPER_SNAKE_CASE (`HTTP_STATUS`, `MAX_UPLOAD_SIZE`)
- [ ] Booleanos: prefixo `eh`/`tem`/`pode`/`deve` (`ehAdmin`, `temPermissao`)
- [ ] Imports: externos -> internos -> relativos -> types
- [ ] Exports: named exports (tree-shaking), evitar default para classes principais

### Comentarios e Documentacao
- [ ] **Por que** (decisao, trade-off, regra negocio complexa), nao **o que**
- [ ] JSDoc para API publica (descricao, params, returns, throws, example)
- [ ] Algoritmos complexos comentados (busca binaria, etc.)
- [ ] **Nao** comentar o obvio (`// incrementa contador`)
- [ ] **Nao** comentarios desatualizados/mentirosos

---

## Testes Durante Desenvolvimento

### Unitarios (Vitest)
- [ ] Services testados com mocks (repository, hash, events)
- [ ] Caminho feliz + erros dominio (not found, conflict, validation)
- [ ] Edge cases (valores limites, arrays vazios, null)
- [ ] Verificacao chamadas mocks (`toHaveBeenCalledWith`)
- [ ] Verificacao eventos publicados
- [ ] Cobertura >= 85% por service

### Integracao (Vitest + Supertest + Test DB)
- [ ] Endpoints CRUD testados (GET, POST, PATCH, DELETE)
- [ ] Auth: 401 sem token, 401 token invalido/expirado
- [ ] AuthZ: 403 sem permissao, 200 com permissao
- [ ] Validacao: 400 dados invalidos (Zod), detalhes por campo
- [ ] Conflito: 409 unicidade (email, CPF)
- [ ] Nao encontrado: 404 ID inexistente
- [ ] Rate limiting testado (5 tentativas -> 429)
- [ ] Middlewares testados isoladamente

### Frontend (Vitest + Testing Library + MSW)
- [ ] Componentes UI: variants, sizes, estados (loading, disabled, error)
- [ ] Formularios: validacao client-side, submissao, erros, loading
- [ ] Hooks: MSW interceptando chamadas, cache, invalidacao
- [ ] Paginas: renderizacao com dados mockados, estados loading/error/empty/success
- [ ] Acessibilidade: `axe-core` no Vitest (0 violacoes)

### E2E (Playwright)
- [ ] Fluxos criticos: login -> dashboard -> logout
- [ ] Login invalido -> erro, login bloqueado (5 tentativas) -> 429
- [ ] Refresh token automatico (access token expirado)
- [ ] CRUD completo: listar -> criar -> editar -> excluir
- [ ] Permissoes: admin acessa /usuarios; user comum bloqueado
- [ ] Cross-browser: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

---

## Seguranca Durante Desenvolvimento

- [ ] Zod schemas em **TODOS** endpoints (body, params, query)
- [ ] Unicidade verificada no service **antes** de persistir
- [ ] Senhas: Argon2id hash **antes** de salvar
- [ ] JWT: RS256, expiracao <= 15min, refresh rotacao + hash DB
- [ ] Cookies: HttpOnly, Secure, SameSite=lax/strict
- [ ] Rate limit em auth endpoints e API global
- [ ] CORS allowlist explicita (nao `*`)
- [ ] Helmet.js headers presentes
- [ ] Error handler sem stack trace em producao
- [ ] Logs sem segredos/PII (sanitizacao automatica)
- [ ] Upload: MIME real (magic bytes) + allowlist + sanitizacao
- [ ] `.env` no `.gitignore`, `.env.example` no Git
- [ ] Validador env no startup (fail fast)
- [ ] Nenhum segredo em `VITE_*` (build analysis)

---

## Git e Commits

- [ ] Branch nomeada corretamente: `feature/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`, `security/`
- [ ] Commits atomicos (uma mudanca logica por commit)
- [ ] Mensagens Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `security:`
- [ ] `git diff` revisado antes de commit
- [ ] `git status` limpo antes de nova task
- [ ] PR/MR aberto com descricao clara, issue relacionada, criterios aceitacao

---

## Atualizacao de Estado (Obrigatorio apos cada etapa)

- [ ] `memoria/ESTADO-ATUAL.md` atualizado (fase, ultima validacao, proxima etapa, arquivos, testes, problemas, bloqueios, decisoes, pendencias)
- [ ] `memoria/PLANO-DE-EXECUCAO.md` atualizado (status etapas)
- [ ] `memoria/HISTORICO-DE-EXECUCAO.md` registrado (acao, comandos, resultados, evidencias)
- [ ] `memoria/DECISOES.md` atualizado (novas decisoes)
- [ ] `memoria/PENDENCIAS.md` atualizado (novas pendencias, resolvidas)
- [ ] `memoria/PROXIMO-PASSO.md` atualizado (instrucao executavel proxima etapa)

---

## Assinatura

```
Desenvolvedor: _________________________
Data: _________________________
Task/Branch: _________________________
Versao checklist: 1.0
```