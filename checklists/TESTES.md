# Checklist de Testes

> Checklist executável para validação de testes. Use em: desenvolvimento, code review, pré-deploy, CI/CD.
> Marque `[x]` quando verificado, `[~]` se parcialmente atendido (registrar observação), `[ ]` se não aplicável.

---

## Configuração e Infraestrutura

### Ambiente de Testes
- [ ] Vitest configurado com `environment: 'jsdom'` (frontend) / `node` (backend)
- [ ] TypeScript paths aliases (`@/`) funcionando nos testes
- [ ] Coverage provider `v8` configurado com thresholds
- [ ] Setup files para testes backend (DB teste) e frontend (MSW, providers)
- [ ] Testes rodam em paralelo (`fullyParallel: true`)
- [ ] Retries configurados (CI: 2, local: 0)
- [ ] Reporters: `text`, `json`, `html`, `lcov` para coverage

### Banco de Dados de Teste
- [ ] Banco dedicado para testes (`meuapp_test`)
- [ ] Migrations aplicadas automaticamente no `beforeAll`
- [ ] Cleanup entre testes (`beforeEach` - truncate tabelas)
- [ ] Seed de dados básicos para testes de integração
- [ ] Transações/rollback para isolamento (opcional)

### Mocks e Stubs
- [ ] MSW (Mock Service Worker) configurado para testes frontend
- [ ] Handlers MSW para todos endpoints usados nos testes
- [ ] Factories/fixtures para dados de teste (`@faker-js/faker` locale pt_BR)
- [ ] Mocks tipados com `vi.Mocked<T>` para type safety

---

## Testes Unitários (Backend)

### Services
- [ ] Todos services têm testes unitários
- [ ] Dependências mockadas (repository, hash, events, outros services)
- [ ] Testes de caminho feliz (success cases)
- [ ] Testes de erros de domínio (not found, conflict, validation)
- [ ] Testes de edge cases (valores limites, arrays vazios, null)
- [ ] Verificação de chamadas aos mocks (`toHaveBeenCalledWith`)
- [ ] Verificação de eventos publicados
- [ ] Cobertura ≥ 85% por service

### Utils e Helpers
- [ ] Funções puras testadas com múltiplos inputs
- [ ] Formatters (datas, moedas, strings)
- [ ] Validadores customizados (CPF, CNPJ, etc.)
- [ ] Constantes e enums

### Erros
- [ ] Todos `AppError` subclasses testados
- [ ] Códigos, status codes, mensagens corretos
- [ ] Detalhes serializáveis corretos

---

## Testes de Integração (Backend)

### API Endpoints
- [ ] Todos endpoints CRUD testados (GET, POST, PATCH, DELETE)
- [ ] Autenticação: 401 sem token, 401 token inválido/expirado
- [ ] Autorização: 403 sem permissão, 200 com permissão
- [ ] Validação: 400 para dados inválidos (Zod), detalhes por campo
- [ ] Conflito: 409 para unicidade (email, CPF)
- [ ] Não encontrado: 404 para ID inexistente
- [ ] Paginação: parâmetros page, limit, busca funcionando
- [ ] Filtros e ordenação funcionando
- [ ] Rate limiting testado (5 tentativas → 429)

### Middlewares
- [ ] `autenticar`: token válido → req.usuario populado; inválido → 401
- [ ] `autorizar`: permissão ok → next(); sem permissão → 403
- [ ] `validar`: schema Zod → 400 com detalhes; válido → next()
- [ ] `errorHandler`: AppError → status/code correto; erro desconhecido → 500 genérico
- [ ] Prisma errors: P2002 → 409; P2025 → 404

### Repository (DB Real)
- [ ] Queries complexas testadas contra DB real
- [ ] Transações: commit/rollback funcionando
- [ ] Soft delete: `deletedAt` populado, find ignora
- [ ] Índices: queries usam índices (EXPLAIN ANALYZE opcional)

---

## Testes Unitários (Frontend)

### Componentes UI (Primitivos)
- [ ] Button, Input, Label, Card, Dialog, Table, etc.
- [ ] Variants (default, destructive, outline, ghost, link)
- [ ] Sizes (default, sm, lg, icon)
- [ ] Estados: loading, disabled, error
- [ ] Acessibilidade: role, aria-label, focus-visible, keyboard navigation
- [ ] Snapshots visuais (opcional)

### Componentes Compostos
- [ ] Forms: validação client-side, submissão, erros, loading
- [ ] Layout: Header, Sidebar, Footer responsivos
- [ ] Feedback: Toast, Alert, Spinner, Skeleton

### Hooks Personalizados
- [ ] `useAuth`: login, logout, refreshUser, estado loading
- [ ] `useUsuarios`: listar, criar, atualizar, excluir, cache, invalidação
- [ ] `useApi`: request/response, error handling, retry
- [ ] Testes com MSW interceptando chamadas

### Páginas
- [ ] Renderização com dados (mockados via MSW)
- [ ] Estados: loading, error, empty, success
- [ ] Navegação: links, botões, router
- [ ] Interações: formulários, modais, tabelas

---

## Testes de Contrato (API)

- [ ] Schema request validado (Zod) - frontend/backend alinhados
- [ ] Schema response validado - tipagem compartilhada
- [ ] Versionamento API testado (v1, v2 se aplicável)
- [ ] Breaking changes detectadas (Pact ou testes manuais)

---

## Testes E2E (Playwright)

### Fluxos Críticos
- [ ] Login → Dashboard → Logout
- [ ] Login inválido → erro
- [ ] Login bloqueado (5 tentativas) → 429
- [ ] Refresh token automático (access token expirado)
- [ ] CRUD completo: listar → criar → editar → excluir
- [ ] Permissões: admin acessa /usuarios; user comum bloqueado
- [ ] Navegação: menus, breadcrumbs, links

### Cross-Browser
- [ ] Chromium (Desktop)
- [ ] Firefox (Desktop)
- [ ] WebKit/Safari (Desktop)
- [ ] Mobile Chrome (Pixel 5)
- [ ] Mobile Safari (iPhone 12)

### Visual e Performance
- [ ] Screenshots em falha (`screenshot: 'only-on-failure'`)
- [ ] Trace em primeira retry (`trace: 'on-first-retry'`)
- [ ] LCP < 2.5s (Lighthouse CI opcional)
- [ ] Sem erros console (exceto esperados)

---

## Testes de Acessibilidade

- [ ] `axe-core` no Vitest (componentes)
- [ ] `@axe-core/playwright` no E2E (páginas completas)
- [ ] WCAG 2.1 AA: 0 violações
- [ ] Testes manuais: navegação teclado, screen reader (NVDA/VoiceOver)
- [ ] Contraste cores: 4.5:1 texto normal, 3:1 large text
- [ ] Focus visible em todos elementos interativos
- [ ] ARIA labels em ícones, inputs sem label visual

---

## Testes de Segurança

- [ ] Auth: login, logout, refresh, reset senha
- [ ] AuthZ: RBAC matrix testada (role × recurso × ação)
- [ ] IDOR: user A não acessa recurso user B
- [ ] Validação: XSS payloads rejeitados/sanitizados
- [ ] Rate limit: auth endpoints, API global
- [ ] Headers segurança: CSP, HSTS, X-Frame-Options presentes
- [ ] CORS: allowlist funcionando, credentials
- [ ] Upload: tipo/tamanho validado, sanitização
- [ ] Dependências: `npm audit` 0 high/critical

---

## Testes de Performance (Opcional/Schedule)

- [ ] k6 load test: API endpoints críticos
- [ ] Lighthouse CI: Core Web Vitals
- [ ] Bundle size: `npm run build` → analisar chunks
- [ ] DB query performance: `EXPLAIN ANALYZE` queries lentas

---

## CI/CD Pipeline

- [ ] `lint` + `typecheck` + `test` + `format:check` em todo PR
- [ ] Coverage upload (Codecov/SonarCloud)
- [ ] E2E em PRs (ou nightly se lento)
- [ ] Quality gates: thresholds coverage, 0 lint/type errors
- [ ] Deploy preview automático (Vercel/Netlify/Render)
- [ ] Smoke tests pós-deploy

---

## Observações e Pendências

| Item | Status | Observação | Responsável | Prazo |
|------|--------|------------|-------------|-------|
| E2E mobile Safari flaky | `[~]` | Investigar timeout | QA | 2026-11-15 |
| Coverage branches < 70% | `[ ]` | Adicionar testes edge cases | Dev team | 2026-11-30 |
| Pact contract testing | `[ ]` | Avaliar adoção | Arch team | 2027-01-31 |
| Lighthouse CI | `[ ]` | Configurar GitHub Actions | DevOps | 2026-12-15 |

---

## Assinatura de Verificação

```
Verificado por: _________________________
Data: _________________________
Versão do checklist: 1.0
Próxima revisão: _________________________
```