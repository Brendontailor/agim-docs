# Template AGENTS.md - Instrucoes Operacionais para Projetos

> Copie este arquivo para a raiz do seu projeto e adapte as secoes marcadas com `[PROJETO]`.

---

# AGENTS.md - [NOME DO PROJETO]

> Instrucoes operacionais para agentes de IA trabalhando neste projeto.

---

## 1. CONTEXTO DO PROJETO

**Nome:** `[NOME DO PROJETO]`
**Descricao:** `[DESCRICAO CURTA - 1-2 frases]`
**Stack:** `[React/Vite/TS | Node/Express/TS | PostgreSQL/Prisma | Outro]`
**Repositorio:** `[URL GIT]`
**Equipe:** `[LISTA OU LINK]`

---

## 2. REGRAS ESPECIFICAS DO PROJETO

### Arquitetura
- [ ] Segue `docs/ARQUITETURA.md` da Biblia
- [ ] Estrutura: `frontend/` + `backend/` (monorepo) | `outro: ___________`
- [ ] Padroes: `docs/CODIGO-LIMPO.md` + `docs/SEGURANCA.md`

### Stack e Versoes (Travar no package.json)
```json
{
  "frontend": { "react": "18.x", "vite": "5.x", "typescript": "5.x" },
  "backend": { "node": "20.x", "express": "4.x", "prisma": "5.x" },
  "database": { "postgresql": "15+", "prisma": "5.x" }
}
```

### Convencoes Especificas
- Nomenclatura: `[PT-BR dominio / Ingles tech]` | `Outro: ___________`
- Commits: `Conventional Commits` | `Outro: ___________`
- Branches: `feature/`, `fix/`, `refactor/`, `chore/` | `Outro: ___________`

---

## 3. SEGURANCA ESPECIFICA

### Autenticacao/Autorizacao
- Algoritmo hash: `Argon2id (memoryCost=19456, timeCost=2, parallelism=1)` | `bcrypt 12+`
- JWT: `RS256` (chaves assimetricas) | `HS256` (simetrico - justificar)
- Access token: `15min` | `Outro: ___________`
- Refresh token: `7d` com rotacao | `Outro: ___________`
- MFA: `TOTP` | `WebAuthn` | `Nao` | `Futuro: ___________`

### Dados Sensiveis
- PII: `[CPF, email, nome, telefone, endereco]` | `Outro: ___________`
- LGPD/Compliance: `[Sim - DPO: ___________]` | `Nao` | `Em andamento`
- Criptografia: `AES-256` (repouso) + `TLS 1.3` (transito)

### Rate Limiting
- Auth: `5 tentativas / 15 min` por IP + conta
- API Global: `100 req/min` por IP
- Endpoints criticos: `___________`

---

## 4. INFRAESTRUTURA E DEPLOY

### Ambientes
| Ambiente | URL | Branch | Deploy | Aprovacao |
|----------|-----|--------|--------|-----------|
| Dev | `http://localhost:5173/3000` | `feature/*` | Auto (push) | Nao |
| Staging | `https://staging.app.com` | `release/*` | Auto (PR merge) | Manual (PO) |
| Producao | `https://app.com` | `main` / `release/*` | Manual | Manual (Tech Lead + PO) |

### Infraestrutura
- Frontend: `Vercel` | `Netlify` | `Cloudflare Pages` | `Docker/K8s` | `Outro: ___________`
- Backend: `Railway` | `Render` | `Fly.io` | `AWS ECS/Fargate` | `K8s` | `VM` | `Outro: ___________`
- Database: `Neon` | `Supabase` | `RDS` | `Cloud SQL` | `Local Docker` | `Outro: ___________`
- Cache: `Redis` | `Upstash` | `Nao` | `Outro: ___________`
- Monitoramento: `Datadog` | `Grafana/Loki` | `Sentry` | `Vercel Analytics` | `Outro: ___________`

### CI/CD
- Provider: `GitHub Actions` | `GitLab CI` | `CircleCI` | `Outro: ___________`
- Pipeline: `lint -> typecheck -> test -> build -> deploy-preview -> approve -> deploy-prod`
- Rollback: `git revert + redeploy` | `kubectl rollout undo` | `docker rollback` | `vercel rollback`

---

## 5. TESTES E QUALIDADE

### Thresholds
| Metrica | Threshold | Ferramenta |
|---------|-----------|------------|
| Cobertura linhas | `80%` | Vitest |
| Cobertura branches | `70%` | Vitest |
| Cobertura funcoes | `80%` | Vitest |
| TypeScript | `0 erros` | `tsc --noEmit` |
| ESLint | `0 errors` | ESLint |
| npm audit | `0 high/critical` | `npm audit` |

### Testes Obrigatorios
- [ ] Unitarios: Services, Utils, Hooks (Vitest + mocks)
- [ ] Integracao: API endpoints, Auth, AuthZ, Validacao, DB (Vitest + Supertest + Test DB)
- [ ] E2E: Login, Fluxos criticos (Playwright: Chromium, Firefox, WebKit, Mobile)
- [ ] Acessibilidade: axe-core (0 violations WCAG 2.1 AA)
- [ ] Seguranca: npm audit + OWASP ZAP (se configurado)
- [ ] Performance: k6/Lighthouse CI (se configurado)

---

## 5. COMANDOS ESSENCIAIS

```bash
# Desenvolvimento
npm run dev              # Sobe frontend + backend (concurrently)
npm run dev:frontend     # Apenas frontend (Vite)
npm run dev:backend      # Apenas backend (tsx watch)

# Qualidade
npm run lint             # ESLint
npm run format           # Prettier --write
npm run format:check     # Prettier --check
npm run typecheck        # tsc --noEmit

# Testes
npm run test             # Unit + Integration (Vitest)
npm run test:unit        # Apenas unitarios
npm run test:integration # Apenas integracao (requer Test DB)
npm run test:e2e         # Playwright (requer app rodando)
npm run test:a11y        # Acessibilidade (axe-core)
npm run test:coverage    # Cobertura com thresholds

# Build & Deploy
npm run build            # Build producao (frontend + backend)
npm run build:frontend   # Build apenas frontend
npm run build:backend    # Build apenas backend

# Database
npm run db:migrate       # Prisma migrate deploy
npm run db:studio        # Prisma Studio
npm run db:seed          # Seed dados desenvolvimento
npm run db:reset         # Reset + migrate + seed (cuidado!)

# Utilitarios
npm run db:generate      # Prisma generate
npm run validate         # lint + typecheck + test + format:check
```

---

## 6. VARIAVEIS DE AMBIENTE

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

### Validacao Startup (Obrigatoria)
- `src/config/env.ts` com Zod schema + `safeParse` + `process.exit(1)` se invalido
- Fail fast: app nao sobe se env invalida

---

## 6. BIBLIA - INTEGRACAO

### Como Usar a Biblia neste Projeto
1. Copie `.opencode/skills/` da Biblia para `.opencode/skills/` do projeto (ou symlink)
2. Copie `checklists/`, `templates/`, `docs/` relevantes
3. Configure `AGENTS.md` (este arquivo) na raiz do projeto
4. Inicie `memoria/` com estado inicial do projeto
5. Use `skill entrevista-orquestradora` como ponto de entrada

### Documentos Biblia Referenciados (Copiar/Referenciar)
- [ ] `AGENTS.md` (Biblia) -> `AGENTS.md` (projeto) - **ESTE ARQUIVO**
- [ ] `ARCHITECTURE.md` -> `docs/ARQUITETURA.md`
- [ ] `docs/CODIGO-LIMPO.md`
- [ ] `docs/SEGURANCA.md` + `checklists/SEGURANCA.md`
- [ ] `docs/TESTES.md` + `checklists/TESTES.md` + `checklists/ROTEIRO-DE-TESTES.md`
- [ ] `checklists/INICIO.md`, `DESENVOLVIMENTO.md`, `REVISAO-DE-CODIGO.md`, `ENTREGA.md`, `PUBLICACAO.md`, `USO-DE-IA.md`
- [ ] `templates/` (12 templates)
- [ ] `SKILLS-CATALOG.md`, `SKILLS-SELECTION-MATRIX.md`, `TOOLS-AND-MCP.md`, `ORCHESTRATOR.md`

---

## 7. CONTATOS E ESCALACAO

| Papel | Nome | Contato (Slack/Email) | Responsabilidade |
|-------|------|----------------------|------------------|
| Tech Lead | | | Arquitetura, code review final, decisoes tecnicas |
| Product Owner | | | Requisitos, priorizacao, aceite |
| Security Champion | | | Auditoria seguranca, incidentes |
| DevOps/Infra | | | Deploy, infra, monitoramento, rollback |
| QA Lead | | | Testes, quality gates, release |
| DPO (se LGPD) | | | Privacidade, compliance |

### Escala de Escala
1. **Desenvolvedor** -> Tenta resolver (max 30 min)
2. **Tech Lead** -> Decide tecnico, desbloqueia
3. **Tech Lead + PO** -> Decide escopo/prazo/escopo
4. **Security Champion** -> Decide seguranca/compliance
5. **Gerencia** -> Decisoes estrategicas, budget, equipe

---

## 8. FERRAMENTAS IA - POLITICA DO PROJETO

### Aprovadas
- [ ] `entrevista-orquestradora` (Biblia) - Ponto de entrada obrigatorio
- [ ] `planejamento-de-tarefas`, `analise-de-legado`, `revisao-de-interface`, `auditoria-de-seguranca`, `testes-com-roteiro`, `revisao-final`
- [ ] `ui-ux-pro-max`, `design`, `design-system`, `ui-styling` (UI/Design)
- [ ] `context7` (MCP) - Docs tecnicas por versao (OBRIGATORIO para libs)
- [ ] `github` (MCP) - Release, tags, issues
- [ ] `browser`/`playwright` (MCP) - E2E, screenshots, debugging
- [ ] `graphify` - Knowledge graph (se `graphify-out/` existe)

### Politica IA Especifica do Projeto
- [ ] `checklists/USO-DE-IA.md` revisado e aceito pela equipe
- [ ] Modelos locais (Ollama) para codigo sensivel / Modelos cloud para boilerplate
- [ ] `entrevista-orquestradora` = ponto de entrada OBRIGATORIO para toda sessao
- [ ] `AGENTS.md` (Biblia) + `AGENTS.md` (projeto) = precedencia: projeto > Biblia > defaults

---

## 9. CHECKLISTS OBRIGATORIOS POR FASE

| Fase | Checklist | Quando |
|------|-----------|--------|
| Inicio | `checklists/INICIO.md` | Antes de qualquer desenvolvimento |
| Desenvolvimento | `checklists/DESENVOLVIMENTO.md` | Durante implementacao |
| Code Review | `checklists/REVISAO-DE-CODIGO.md` | Pre-merge / PR |
| Entrega | `checklists/ENTREGA.md` | Pre-deploy / milestone |
| Publicacao | `checklists/PUBLICACAO.md` | Deploy staging/producao / release |
| Seguranca | `checklists/SEGURANCA.md` | Pre-deploy / auditoria periodica |
| Testes | `checklists/TESTES.md` + `ROTEIRO-DE-TESTES.md` | Validacao / pre-deploy |
| IA | `checklists/USO-DE-IA.md` | Toda sessao com IA |

---

## 10. TEMPLATES DISPONIVEIS

| Template | Uso | Arquivo |
|----------|-----|---------|
| `AGENTS.md` | Instrucoes projeto (este arquivo) | `templates/AGENTS.md` |
| `README.md` | Documentacao projeto | `templates/README.md` |
| `ARQUITETURA.md` | Decisoes arquiteturais | `templates/ARQUITETURA.md` |
| `DECISAO-TECNICA.md` | ADR | `templates/DECISAO-TECNICA.md` |
| `PLANO-IMPLEMENTACAO.md` | Plano execucao detalhado | `templates/PLANO-IMPLEMENTACAO.md` |
| `ESPECIFICACAO-FUNCIONAL.md` | Requisitos funcionais | `templates/ESPECIFICACAO-FUNCIONAL.md` |
| `PLANO-TESTES.md` | Estrategia testes | `templates/PLANO-TESTES.md` |
| `AUDITORIA-SEGURANCA.md` | Relatorio auditoria seg | `templates/AUDITORIA-SEGURANCA.md` |
| `REVISAO-CODIGO.md` | Relatorio code review | `templates/REVISAO-CODIGO.md` |
| `RELATORIO-ENTREGA.md` | Relatorio entrega | `templates/RELATORIO-ENTREGA.md` |
| `REGISTRO-INCIDENTE.md` | Registro incidente | `templates/REGISTRO-INCIDENTE.md` |
| `DIVIDA-TECNICA.md` | Registro divida tecnica | `templates/DIVIDA-TECNICA.md` |

---

---

**Este AGENTS.md deve ser consultado no inicio de CADA sessao neste projeto.**
Consulte tambem a Biblia Universal (`INDEX.md`, `ORCHESTRATOR.md`, `SKILLS-CATALOG.md`) e `memoria/` para estado persistente.