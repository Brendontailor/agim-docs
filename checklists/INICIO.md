# Checklist de Inicio - Preparacao e Validacao Inicial

> Use antes de qualquer desenvolvimento. Marque `[x]` quando verificado, `[~]` se parcialmente atendido (registre observacao), `[ ]` se nao aplicavel.

---

## Ambiente e Ferramentas

### OpenCode e Versao
- [ ] OpenCode versao v2.x confirmada (`opencode --version`)
- [ ] Skills globais instaladas (7): `ui-ux-pro-max`, `design`, `design-system`, `banner-design`, `brand`, `slides`, `ui-styling`
- [ ] Skills locais da Biblia instaladas (7): `entrevista-orquestradora`, `planejamento-de-tarefas`, `analise-de-legado`, `revisao-de-interface`, `auditoria-de-seguranca`, `testes-com-roteiro`, `revisao-final`
- [ ] Plugin `graphify` presente em `.opencode/plugins/graphify.js`
- [ ] MCPs configurados: `context7`, `github`, `browser`/`playwright`

### Git e Versionamento
- [ ] Repositorio Git inicializado (`git init`)
- [ ] `.gitignore` configurado (node_modules, .env, dist, build, *.log, coverage, .DS_Store)
- [ ] Branch principal `main` criada
- [ ] Commit inicial realizado (`git commit -m "chore: initial commit"`)
- [ ] Remote configurado (se aplicavel)

### Variaveis de Ambiente
- [ ] `.env.example` criado com valores ficticios (no Git)
- [ ] `.env` real criado (no `.gitignore`) com valores reais
- [ ] Validacao de env no startup implementada (Zod + fail fast)
- [ ] `CONTEXT7_API_KEY` configurada (para MCP Context7)
- [ ] `GITHUB_TOKEN` configurado (para MCP GitHub)
- [ ] `DATABASE_URL` configurada (PostgreSQL/Neon)
- [ ] `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` geradas (RS256)
- [ ] `ARGON2_MEMORY_COST=19456`, `ARGON2_TIME_COST=2`, `ARGON2_PARALLELISM=1`
- [ ] `CORS_ORIGIN` configurada (origins explicitas)
- [ ] `RATE_LIMIT_MAX` e `RATE_LIMIT_WINDOW_MS` configurados

### Dependencias e Build
- [ ] `package.json` com scripts essenciais: `dev`, `build`, `test`, `lint`, `typecheck`, `format`
- [ ] `tsconfig.json` com `strict: true`, `noUncheckedIndexedAccess: true`
- [ ] `eslint.config.js` / `.eslintrc.json` configurado (recommended + typescript-eslint + prettier)
- [ ] `prettier.config.js` / `.prettierrc` configurado
- [ ] `vitest.config.ts` configurado (environment jsdom/node, coverage thresholds)
- [ ] `playwright.config.ts` configurado (projects: chromium, firefox, webkit, mobile)
- [ ] `npm ci` / `pnpm install` executado com sucesso
- [ ] `npm run build` passa sem erros
- [ ] `npm run typecheck` passa (0 erros TypeScript)
- [ ] `npm run lint` passa (0 erros ESLint)

---

## Documentacao e Contexto

### Biblia e Documentos Base
- [ ] `AGENTS.md` lido e compreendido (regras operacionais)
- [ ] `INDEX.md` lido (navegacao da Biblia)
- [ ] `ORCHESTRATOR.md` consultado (roteamento skills/MCPs)
- [ ] `SKILLS-CATALOG.md` consultado (catalogo skills disponiveis)
- [ ] `TOOLS-AND-MCP.md` consultado (ferramentas/MCPs)
- [ ] `SKILLS-SELECTION-MATRIX.md` consultado (matriz intencao->skills)
- [ ] `INTERVIEW.md` consultado (entrevista adaptativa)
- [ ] `ARCHITECTURE.md` lido (padroes arquiteturais)
- [ ] `docs/ARQUITETURA.md` lido (arquitetura modular detalhada)
- [ ] `docs/CODIGO-LIMPO.md` lido (padroes codigo limpo)
- [ ] `docs/SEGURANCA.md` lido (regras seguranca + matriz 15 riscos)
- [ ] `docs/TESTES.md` lido (estrategia testes)
- [ ] `docs/FERRAMENTAS-IA.md` lido (inventario ferramentas)
- [ ] `docs/IA-E-CONTEXTO.md` lido (RAG, Graphify, Context7, memoria)
- [ ] `docs/BOOTSTRAP-AMBIENTE.md` lido (ordem obrigatoria inicializacao)

### Memoria e Estado
- [ ] `memoria/ESTADO-ATUAL.md` criado/atualizado (objetivo, fase, ultima validacao, proxima etapa)
- [ ] `memoria/PLANO-DE-EXECUCAO.md` criado (fases, etapas, criterios, estados)
- [ ] `memoria/PROXIMO-PASSO.md` criado (instrucao executavel retomada)
- [ ] `memoria/DECISOES.md` iniciado (decisoes tecnicas registradas)
- [ ] `memoria/PENDENCIAS.md` iniciado (pendencias registradas)
- [ ] `memoria/HISTORICO-DE-EXECUCAO.md` iniciado (log acoes)

---

## Projeto Especifico

### Stack e Arquitetura
- [ ] Stack confirmada: React + Vite + TS (frontend) / Node + Express + TS + Prisma (backend)
- [ ] Estrutura monorepo definida: `frontend/` + `backend/` + pastas compartilhadas
- [ ] `docs/ARQUITETURA.md` revisado (backend 9 camadas, frontend 6 camadas)
- [ ] `docs/CODIGO-LIMPO.md` revisado (SRP, TS strict, Zod, nomenclatura PT-BR/Ingles)
- [ ] Convenções de nomenclatura definidas (kebab-case arquivos, PascalCase classes, camelCase metodos)

### Qualidade e Testes
- [ ] Thresholds cobertura definidos: linhas 80%, branches 70%, funcoes 80%, statements 80%
- [ ] Quality gates CI definidos: typecheck 0, lint 0, testes 100% pass, audit 0 high/crit
- [ ] Test DB configurado (PostgreSQL dedicado para testes)
- [ ] MSW handlers preparados para mocks API (frontend)
- [ ] Factories/fixtures definidas (`@faker-js/faker` locale pt_BR)

### Seguranca
- [ ] Argon2id configurado (memoryCost=19456, timeCost=2, parallelism=1)
- [ ] JWT RS256 configurado (chaves assimetricas, expiracao access 15min, refresh 7d)
- [ ] Refresh token rotacao implementada (hash no DB, revogacao login/senha)
- [ ] Cookies HttpOnly, Secure, SameSite=lax/strict configurados
- [ ] Rate limit: 5 tent/15min auth, 100req/min API global
- [ ] CORS allowlist explicita (origins explicitas)
- [ ] Helmet.js configurado (CSP, HSTS, X-Frame-Options, Referrer-Policy)
- [ ] Logs estruturados (Pino/Winston) + sanitizacao (senhas, tokens, PII)

---

## Validacao Final

### Smoke Tests
- [ ] `npm run dev` sobe frontend + backend sem erros
- [ ] Frontend acessivel em `http://localhost:5173` (ou porta configurada)
- [ ] Backend API acessivel em `http://localhost:3000/api/v1` (ou porta configurada)
- [ ] Health check endpoint responde (`GET /health` ou similar)
- [ ] Conexao DB funcional (Prisma conecta, query simples executa)
- [ ] Auth basico funciona (registro/login/logout/refresh)
- [ ] `npm run test` passa (unitarios + integracao)
- [ ] `npm run test:e2e` passa (smoke: login -> dashboard -> logout)
- [ ] `npm run build` gera artifacts sem erros

### Checklist de Pronto para Desenvolvimento
- [ ] Todos itens acima `[x]` ou `[~]` com observacao registrada
- [ ] `memoria/ESTADO-ATUAL.md` atualizado com fase "DESENVOLVIMENTO"
- [ ] `memoria/PROXIMO-PASSO.md` aponta para primeira tarefa acionavel
- [ ] `skill entrevista-orquestradora` ativada e pronta para primeiro pedido

---

## Assinatura

```
Verificado por: _________________________
Data: _________________________
Projeto: _________________________
Versao checklist: 1.0
Proxima revisao: _________________________
```