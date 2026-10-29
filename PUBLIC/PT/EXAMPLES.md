# Exemplos — AGIM

> Casos de uso reais e padrões de implementação.

---

## 1. Feature Completa: "Usuários com CRUD + Auth"

### Objetivo
```bash
agim auto "Nova feature: API de usuários com CRUD completo, auth JWT, roles, validação Zod e testes"
```

### O que o AGIM Executa Automaticamente

#### Fase 1: Descoberta e Planejamento
- `entrevista-orquestradora` classifica: web, feature, media, medio, users-crud
- Seleciona skills: planejamento + spec-driven + testes + auditoria + revisao
- `spec-driven-development` gera:
  - `ESPECIFICACAO-FUNCIONAL.md` — Requisitos, regras de negócio, edge cases
  - `DECISAO-TECNICA.md` — ADR: Argon2id vs bcrypt, JWT RS256 vs HS256, Prisma vs raw SQL
  - Contratos API (TypeScript types + OpenAPI)
  - `PLANO-TESTES.md` — Estratégia, cenários, coverage targets

#### Fase 2: Implementação Paralela
```
Backend (9 camadas)                    Frontend (6 camadas)
├── src/routes/usuarios.routes.ts      ├── src/pages/Usuarios/Lista.tsx
├── src/controllers/usuarios.controller.ts ├── src/pages/Usuarios/Novo.tsx
├── src/services/usuarios.service.ts   ├── src/pages/Usuarios/Editar.tsx
├── src/validations/usuarios.validation.ts ├── src/hooks/useUsuarios.ts
├── src/repositories/usuarios.repository.ts ├── src/services/usuarios.api.ts
├── src/middlewares/autorizar.middleware.ts ├── src/types/usuario.types.ts
├── src/types/usuario.types.ts         ├── src/components/forms/UsuarioTable.tsx
├── src/errors/negocio.errors.ts       └── src/components/forms/UsuarioForm.tsx
└── prisma/schema.prisma               └── src/components/ui/ (Button, Input, etc.)
```

#### Fase 3: Testes Orquestrados
- Unit: `usuarios.service.test.ts`, `usuarios.validation.test.ts`
- Integration: `usuarios.routes.test.ts` (com Testcontainers PostgreSQL)
- E2E: `usuarios-crud.spec.ts` (Playwright)
- A11y: `a11y.spec.ts` (axe-core)
- Security: `agim audit` + OWASP ZAP

#### Fase 4: Quality Gates
- `verification-before-completion` — testes + build + lint + type-check + evidência
- `code-review-and-quality` — 6 eixos
- `revisao-final` — DoD completo

---

## 2. Bug Fix: "Race Condition no Cache"

### Objetivo
```bash
agim auto "Bug fix: race condition no cache de usuários causa dados inconsistentes sob carga"
```

### Execução
1. `systematic-debugging` — Processo científico 7 passos:
   - Observa: logs mostram cache stale sob carga concorrente
   - Reproduz: teste de carga k6 com 50 users simultâneos
   - Isola: bisect aponta para `users.service.ts` método `obterPorId`
   - Hipotetiza: cache miss simultâneo → múltiplas queries DB → race no set
   - Testa: implementa `cache-aside` com lock distribuído (Redis SETNX)
   - Valida: k6 mostra 0 inconsistências em 10k requests
   - Documenta: `DECISOES.md` com causa raiz e prevenção

2. `testes-com-roteiro` — Regressão + novos testes de concorrência
3. `verification-before-completion` — Quality gate completo

---

## 3. Refatoração: "Legacy Payment Module"

### Objetivo
```bash
agim auto "Refatorar modulo legacy-payment: extrair repository, adicionar testes, remover duplicação"
```

### Execução
1. `analise-de-legado` — **Sem modificar código**:
   - Mapeia: 2.300 linhas, 0 testes, 15 code smells, 3 vulnerabilidades
   - Identifica: God class `PaymentService`, SQL inline, sem validação
   - Riscos: alto acoplamento, zero coverage, SQL injection potencial

2. `code-simplification` — Micro-passos testados:
   ```
   Commit 1: Extrair PaymentRepository (testes passam)
   Commit 2: Mover validação para Zod schema (testes passam)
   Commit 3: Substituir SQL inline por Prisma (testes passam)
   Commit 4: Extrair PaymentValidator service (testes passam)
   Commit 5: Adicionar testes unitários (coverage 0→85%)
   Commit 6: Remover código morto (testes passam)
   ```

3. `testes-com-roteiro` — Suite completa
4. `revisao-final` — Aprova com evidência

---

## 4. Auditoria de Segurança: "Pre-Deploy Produção"

### Objetivo
```bash
agim audit
# Ou:
agim auto "Auditoria segurança completa pre-deploy v2.3.0"
```

### Execução
1. `auditoria-de-seguranca` — Matriz 15 riscos:
   ```
   ✅ Auth: Argon2id (19456/2/1) configurado
   ✅ AuthZ: Middleware autorizar em 100% rotas protegidas
   ✅ Validação: Zod em 100% endpoints
   ✅ Secrets: 0 segredos no frontend, .env no gitignore
   ✅ Headers: CSP, HSTS, X-Frame-Options, etc. configurados
   ✅ Rate Limit: 5/15min auth, 100/min API
   ✅ CORS: Allowlist explícita (3 domínios)
   ✅ SQL Injection: 0 concatenações (Prisma params)
   ✅ XSS: 0 innerHTML/eval, sanitização ativa
   ✅ Upload: MIME real + sharp + S3 presigned URLs
   ✅ Deps: npm audit 0 critical/high
   ✅ Logs: Pino com sanitização PII
   ✅ Soft Delete: deletedAt em 8 tabelas sensíveis
   ✅ Backup: Neon PITR 7 dias + restore testado mês passado
   ✅ DB Role: app_user com grants mínimos
   ```

2. `verification-before-completion` — Confirma quality gate
3. `revisao-final` — **APROVA** para deploy

---

## 5. Nova UI: "Dashboard Analytics"

### Objetivo
```bash
agim auto "Nova UI: Dashboard analytics com gráficos, filtros de data, exportação CSV, responsivo"
```

### Execução
1. `entrevista-orquestradora` → `revisao-de-interface` + `spec-driven-development`
2. `revisao-de-interface` audita:
   - **Consistência**: Design tokens aplicados (cores, spacing, tipografia)
   - **Responsividade**: 375px, 768px, 1440px — todos breakpoints testados
   - **Acessibilidade**: WCAG 2.1 AA — contraste 4.5:1, foco visível, ARIA labels
   - **Estados**: Loading (skeleton), Error (alert), Empty (ilustração), Success (toast)
   - **Reuso**: Componentes primitivos (ui/) + compostos (forms/, layout/)

3. `spec-driven-development` — Spec-first com contratos de componentes
4. `testes-com-roteiro` — E2E + A11y + Visual regression (Playwright screenshots)
5. `revisao-final` — **APROVA** com screenshots em `HISTORICO-DE-EXECUCAO.md`

---

## 6. Setup de Projeto Novo

### Do Zero
```bash
mkdir meu-saas && cd meu-saas
agim init
# Detecta: Node/TypeScript, Express + React
# Cria: config, AGENTS.md, memoria/, docs/, checklists/, templates/, exemplos/, skills

agim validate  # Exit 0
agim doctor    # Todos ✅
```

### Projeto Existente (Brownfield)
```bash
cd projeto-legado
agim init
# Detecta stack existente
# Adiciona kit AGIM sem sobrescrever código
# Cria memoria/ para começar rastreamento

agim interview "Entender arquitetura atual e planejar modernização"
# analise-de-legado roda automaticamente
# Gera PLANO-DE-EXECUCAO.md com fases
```

---

## 7. CI/CD com AGIM

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx prisma migrate deploy
        env: { DATABASE_URL: ${{ secrets.DATABASE_URL }} }
      
      # AGIM Quality Gates
      - run: agim validate --json
      - run: agim audit --json
      - run: agim status --json
      
      # Testes
      - run: npm run test:coverage
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run preview -- --port 5173 &
      - run: npm run test:e2e
      - run: npm run test:a11y
      
      # Deploy staging (se main branch)
      - if: github.ref == 'refs/heads/main'
        run: |
          agim auto "Deploy staging" --json
          # Deploy automático para staging
```

---

## 8. Onboarding de Novo Desenvolvedor

### Dia 1
```bash
# Clone + setup
git clone repo && cd repo
agim init          # Instala kit AGIM
agim validate      # Verifica setup
agim status        # Vê estado atual do projeto
```

### Dia 2
```bash
# Primeira feature supervisionada
agim auto "Feature simples: adicionar campo 'telefone' no usuário"
# AGIM guia todo o fluxo: spec → impl → testes → quality gate
# Dev aprende: arquitetura, skills, padrões, quality gates
```

### Semana 1
- Produtivo em features reais
- Conhece: `memoria/`, skills, checklists, templates
- Sabe: `agim auto`, `agim status`, `agim audit`, `agim validate`

---

## 9. Referência de Implementação (`exemplos/`)

O repositório inclui implementação funcional completa em `exemplos/arquitetura-modular/`:

```
exemplos/arquitetura-modular/
├── backend/
│   ├── src/
│   │   ├── routes/usuarios.routes.ts
│   │   ├── controllers/usuarios.controller.ts
│   │   ├── services/usuarios.service.ts
│   │   ├── validations/usuarios.validation.ts
│   │   ├── repositories/usuarios.repository.ts
│   │   ├── middlewares/ (auth, authZ, validation, error)
│   │   ├── config/env.ts
│   │   ├── types/usuario.types.ts
│   │   ├── errors/ (AppError, business.errors)
│   │   └── prisma/prisma.service.ts
│   └── prisma/schema.prisma
└── frontend/
    └── src/
        ├── pages/Usuarios/ (Lista, Novo, Editar)
        ├── hooks/useUsuarios.ts
        ├── services/ (api.ts, usuarios.api.ts)
        ├── types/usuario.types.ts
        ├── components/ (ui/, forms/, layout/)
        └── contexts/AuthContext.tsx
```

---

## Próximos Documentos

| Documento | Foco |
|-----------|------|
| [FAQ.md](./FAQ.md) | Perguntas frequentes |
| [QUICKSTART.md](./QUICKSTART.md) | Início rápido 5 min |
| [CLI-REFERENCE.md](./CLI-REFERENCE.md) | 14 comandos |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura 9+6 camadas |