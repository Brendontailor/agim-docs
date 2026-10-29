# Template README.md

> Copie este arquivo para a raiz do seu projeto e preencha as secoes marcadas.

---

# [NOME DO PROJETO]

> [DESCRICAO CURTA - 1-2 frases explicando o que o projeto faz e para quem]

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

--- - Documentacao de Projeto

> Copie este arquivo para a raiz do seu projeto e preencha as secoes marcadas.

---

# [NOME DO PROJETO]

> [DESCRICAO CURTA - 1-2 frases explicando o que o projeto faz e para quem]

---

## 📋 Indice

- [Visao Geral](#visao-geral)
- [Stack Tecnologica](#stack-tecnologica)
- [Arquitetura](#arquitetura)
- [Primeiros Passos](#primeiros-passos)
- [Scripts Disponiveis](#scripts-disponiveis)
- [Variaveis de Ambiente](#variaveis-de-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuicao](#contribuicao)
- [Licenca](#licenca)

---

## 🎯 Visao Geral

**[DESCRICAO DETALHADA - O que o projeto faz, principais funcionalidades, publico-alvo, problema que resolve]**

### Funcionalidades Principais
- [ ] **[Funcionalidade 1]**: [Descricao]
- [ ] **[Funcionalidade 2]**: [Descricao]
- [ ] **[Funcionalidade 3]**: [Descricao]

### Publico-Alvo
[Quem usa este sistema? Quais sao os usuarios/perfis?]

---

## 🛠️ Stack Tecnologica

| Camada | Tecnologia | Versao | Justificativa |
|--------|------------|--------|---------------|
| **Frontend** | React | 18.x | [Justificativa] |
| | Vite | 5.x | [Justificativa] |
| | TypeScript | 5.x | [Justificativa] |
| | Tailwind CSS | 3.x | [Justificativa] |
| | shadcn/ui | latest | [Justificativa] |
| **Backend** | Node.js | 20.x LTS | [Justificativa] |
| | Express | 4.x | [Justificativa] |
| | TypeScript | 5.x | [Justificativa] |
| | Prisma ORM | 5.x | [Justificativa] |
| **Database** | PostgreSQL | 15+ | [Justificativa] |
| | Prisma | 5.x | [Justificativa] |
| **Infra** | [Provedor] | [Versao] | [Justificativa] |

---

## 🏗️ Arquitetura

> Referencia completa: `docs/ARQUITETURA.md` e `ARCHITECTURE.md` (Biblia)

### Padroes Principais
- **Monorepo**: `frontend/` + `backend/` + pastas compartilhadas
- **Backend**: Clean Architecture (Routes -> Controllers -> Services -> Repositories -> Prisma)
- **Frontend**: Component-based (Atomic Design), React Query para server state
- **Comunicacao**: REST API (JSON) com contratos tipados (Zod + TypeScript)

### Padroes Obrigatorios
- [ ] Clean Architecture (Backend)
- [ ] Component-based + Atomic Design (Frontend)
- [ ] TypeScript Strict Mode
- [ ] Zod Validation (Backend + Frontend)
- [ ] React Query (Server State)
- [ ] shadcn/ui + Tailwind (UI Components)

---

## 🚀 Primeiros Passos

### Pre-requisitos
- [ ] Node.js 20.x LTS
- [ ] pnpm (recomendado) | npm | yarn
- [ ] PostgreSQL 15+ (local ou Docker)
- [ ] Git

### Instalacao
```bash
# Clone o repositorio
git clone [URL_DO_REPOSITORIO]
cd [NOME_DO_PROJETO]

# Instale dependencias
pnpm install  # ou npm install / yarn

# Configure variaveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Configure banco de dados
pnpm run db:migrate   # Roda migracoes
pnpm run db:seed      # Dados iniciais (opcional)

# Inicie desenvolvimento
pnpm run dev          # Sobe frontend + backend
```

### Verificacao Rapida
- [ ] Frontend: `http://localhost:5173` (ou porta configurada)
- [ ] Backend API: `http://localhost:3000/api/v1` (ou porta configurada)
- [ ] Health check: `GET /health` -> 200 OK
- [ ] Docs API: `http://localhost:3000/docs` (se Swagger configurado)

---

## 📜 Scripts Disponiveis

```bash
# Desenvolvimento
pnpm run dev              # Sobe frontend + backend (concurrently)
pnpm run dev:frontend     # Apenas frontend (Vite)
pnpm run dev:backend      # Apenas backend (tsx watch)

# Qualidade
pnpm run lint             # ESLint
pnpm run format           # Prettier --write
pnpm run format:check     # Prettier --check
pnpm run typecheck        # tsc --noEmit

# Testes
pnpm run test             # Unit + Integration (Vitest)
pnpm run test:unit        # Apenas unitarios
pnpm run test:integration # Apenas integracao (requer Test DB)
pnpm run test:e2e         # Playwright (requer app rodando)
pnpm run test:a11y        # Acessibilidade (axe-core)
pnpm run test:coverage    # Cobertura com thresholds

# Build & Deploy
pnpm run build            # Build producao (frontend + backend)
pnpm run build:frontend   # Build apenas frontend
pnpm run build:backend    # Build apenas backend

# Database
pnpm run db:migrate       # Prisma migrate deploy
pnpm run db:studio        # Prisma Studio
pnpm run db:seed          # Seed dados desenvolvimento
pnpm run db:reset         # Reset + migrate + seed (cuidado!)

# Utilitarios
pnpm run db:generate      # Prisma generate
pnpm run validate         # lint + typecheck + test + format:check
```

---

## 🔐 Variaveis de Ambiente

### Obrigatorias (`.env.example` no Git, `.env` real no `.gitignore`)

```bash
# App
NODE_ENV=development|test|production
PORT=3000
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public&sslmode=require

# JWT (RS256 - chaves assimetricas)
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Argon2
ARGON2_MEMORY_COST=19456
ARGON2_TIME_COST=2
ARGON2_PARALLELISM=1

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limit
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Frontend (VITE_* sao PUBLICOS - NAO COLOQUE SEGREDOS AQUI)
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Meu App
```

> **Importante**: `.env` real **NUNCA** no Git. Use `.env.example` com valores ficticios no repositorio.

---

## 📁 Estrutura do Projeto

```
[NOME_DO_PROJETO]/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/       # Componentes reutilizaveis (UI)
│   │   ├── pages/            # Paginas (rotas principais)
│   │   ├── layouts/          # Layouts de pagina (wrappers)
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── services/         # Servicos HTTP (API client)
│   │   ├── types/            # Tipos e contratos
│   │   ├── utils/            # Utilitarios puros
│   │   ├── contexts/         # React Context (estado global)
│   │   ├── styles/           # Estilos globais, tokens CSS
│   │   ├── main.tsx          # Entry point
│   │   └── App.tsx           # Componente raiz + roteamento
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/                  # Node.js + Express + TypeScript + Prisma
│   ├── src/
│   │   ├── routes/           # Endpoints + middlewares
│   │   ├── controllers/      # Req/Res -> Services
│   │   ├── services/         # Regras de negocio (use cases)
│   │   ├── validators/       # Validacao Zod
│   │   ├── repositories/     # Acesso a dados (opcional)
│   │   ├── middlewares/      # Auth, AuthZ, Error handling
│   │   ├── config/           # Config centralizada + validação env
│   │   ├── types/            # Tipos e contratos backend
│   │   ├── errors/           # Classes erro padronizadas
│   │   ├── utils/            # Utilitarios puros
│   │   ├── prisma/           # Prisma Client + extensions
│   │   └── app.ts            # Factory Express
│   ├── prisma/
│   │   ├── schema.prisma     # Schema banco
│   │   └── migrations/       # Migracoes versionadas
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docs/                     # Documentacao compartilhada
├── memoria/                  # Sistema continuidade (opcional)
├── checklists/               # Checklists obrigatorios
├── templates/                # Templates reutilizaveis
├── exemplos/                 # Exemplos referencia
├── scripts/                  # Scripts automacao/validacao
├── .github/                  # Templates issues/PR, workflows CI
├── package.json              # Workspace root (scripts compartilhados)
├── tsconfig.base.json        # Config TS base
├── .gitignore
├── .editorconfig
├── README.md                 # Este arquivo
├── CONTRIBUTING.md
├── CHANGELOG.md
├── AGENTS.md                 # Instrucoes operacionais
└── LICENSE
```

---

## 🧪 Testes

> Referencia: `docs/TESTES.md`, `checklists/TESTES.md`, `checklists/ROTEIRO-DE-TESTES.md`

### Estrategia
- **Piramide**: Muitos unitarios -> Alguns integracao -> Poucos E2E
- **Thresholds**: Linhas 80% | Branches 70% | Funcoes 80% | Statements 80%
- **Quality Gates**: TypeCheck 0 | Lint 0 | Testes 100% pass | Audit 0 high/crit

### Comandos
```bash
pnpm run test             # Unit + Integration
pnpm run test:unit        # Apenas unitarios
pnpm run test:integration # Integracao (requer Test DB)
pnpm run test:e2e         # Playwright E2E
pnpm run test:a11y        # Acessibilidade (axe-core)
pnpm run test:coverage    # Cobertura + thresholds
pnpm run validate         # lint + typecheck + test + format:check (CI gate)
```

### Ferramentas
| Tipo | Ferramenta |
|------|------------|
| Unit/Integration | Vitest + Supertest + Test DB |
| E2E | Playwright (Chromium, Firefox, WebKit, Mobile) |
| Acessibilidade | axe-core + Playwright |
| Performance | k6 / Lighthouse CI |
| Seguranca | npm audit / Snyk / OWASP ZAP |

---

## 🚀 Deploy

> Referencia: `checklists/PUBLICACAO.md`, `checklists/ENTREGA.md`

### Ambientes
| Ambiente | URL | Branch | Deploy | Aprovacao |
|-----------|-----|--------|---------|-----------|
| Dev | `localhost` | `feature/*` | Auto (push) | Nao |
| Staging | `https://staging.app.com` | `release/*` | Auto (PR merge) | Manual (PO) |
| Producao | `https://app.com` | `main` / `release/*` | Manual | Tech Lead + PO |

### Pipeline CI/CD
```yaml
# .github/workflows/ci.yml (exemplo)
1. lint + typecheck + format:check
2. test (unit + integration + coverage)
3. build (frontend + backend)
4. e2e (staging)
4. security audit (npm audit + Snyk)
5. deploy staging (auto)
6. approve manual (PO/Tech Lead)
7. deploy production (manual)
```

### Rollback
- **Git**: `git revert <tag> && deploy`
- **Docker**: `docker service update --image app:previous-tag`
- **K8s**: `kubectl rollout undo deployment/app`
- **Vercel/Netlify**: `vercel rollback` / `netlify rollback`
- **Tempo maximo**: < 5 minutos (testado)

---

## 🤝 Contribuicao

> Ver `CONTRIBUTING.md` para detalhes completos.

### Processo
1. **Issue**: Crie/pegue issue no GitHub (`bug`, `feature`, `chore`, `docs`, `security`)
2. **Branch**: `feature/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`, `security/`
3. **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `security:`)
4. **PR**: Descricao clara, issue relacionada, criterios de aceite
5. **Review**: `checklists/REVISAO-DE-CODIGO.md` (obrigatorio)
6. **Merge**: Apos aprovação + CI verde + review aprovado

### Padroes
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `security:`)
- **Branches**: `feature/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`, `security/`
- **Code Style**: TypeScript strict, ESLint + Prettier, Zod validation, shadcn/ui components

---

## 📄 Licença

Este projeto usa a **Licença MIT** — veja o arquivo [LICENSE](../LICENSE) para detalhes.

> Decisão final registrada em `memoria/DECISOES.md` (DEC-006) e `docs/DECISOES-TECNICAS.md` (ADR-006).

---

## 📞 Suporte e Issues

- **Bugs**: `.github/ISSUE_TEMPLATE/bug_report.md`
- **Features**: `.github/ISSUE_TEMPLATE/feature_request.md`
- **Seguranca**: `.github/ISSUE_TEMPLATE/security_report.md` (privado)
- **Duvidas**: Discussões no GitHub ou issues com label `question`

---

## 🙏 Agradecimentos

- [Biblia Universal de IA](https://github.com/seu-usuario/meu-padrao-de-desenvolvimento) - Padroes, skills, checklists, templates
- [shadcn/ui](https://ui.shadcn.com/) - Componentes acessiveis
- [Radix UI](https://www.radix-ui.com/) - Primitivos acessiveis
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Type-safe ORM
- [React Query](https://tanstack.com/query) - Server state management
- [Playwright](https://playwright.dev/) - E2E testing
- [Vitest](https://vitest.dev/) - Unit/Integration testing

---

> **Status**: [Em desenvolvimento | Em producao | Em manutencao | Arquivado]
> **Versao atual**: `v[X.Y.Z]` (ver `CHANGELOG.md`)
> **Ultima atualizacao**: `[DATA]`