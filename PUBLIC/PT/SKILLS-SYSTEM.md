# Sistema de Skills do AGIM

> Referência completa das 14 skills operacionais — quando usar cada uma, como funcionam e como se combinam.

---

## Visão Geral

| Categoria | Quantidade | Carregamento |
|-----------|------------|--------------|
| **Core** | 12 | Sempre (auto-carregadas) |
| **Extended** | 2 | Lazy (sob demanda) |
| **Globais UI/UX** | 7 | Instaladas separadamente |

---

## Core Skills (12 — Sempre Carregadas)

### 1. `entrevista-orquestradora` ⭐ **PONTO DE ENTRADA ÚNICO**

**One-liner**: CEO do grimório — entende, planeja, seleciona skills, executa, verifica

**Quando Usar**: **SEMPRE** — início de qualquer sessão ou tarefa substancial

**O Que Faz**:
1. Entrevista adaptativa até ~95% confiança na intenção
2. Classifica: domínio/tipo/complexidade/risco/escopo
3. Consulta `INDEX.md`, `ORCHESTRATOR.md`, `SKILLS-CATALOG.md`, `SKILLS-SELECTION-MATRIX.md`
4. Descobre contexto real (arquivos, Git, `memoria/`)
5. Seleciona skills/MCPs/ferramentas mínimas necessárias
6. Prepara plano proporcional com critérios de aceitação
7. Executa/coordena com verificação por etapa
8. Verifica resultado final vs critérios originais
9. Registra continuidade completa em `memoria/`

**Ativação**:
```bash
skill entrevista-orquestradora
# Ou linguagem natural: "Entrevista: vamos definir o objetivo"
```

---

### 2. `planejamento-de-tarefas`

**One-liner**: Arquiteto — transforma pedido em plano executável: etapas, dependências, critérios, riscos

**Quando Usar**: Nova feature, tarefa complexa, refatoração, sprint planning

**Entrada**: Objetivo classificado + contexto do projeto

**Saída**: `memoria/PLANO-DE-EXECUCAO.md` com:
- Fases lógicas (Setup → Spec → Impl → Testes → Validação → Entrega)
- Etapas atômicas com status (NÃO INICIADA/EM ANDAMENTO/CONCLUÍDA/BLOQUEADA/REQUER REVISÃO)
- Critérios de aceitação por etapa
- Dependências entre etapas
- Riscos e mitigações
- Estimativa de esforço

**Ativação**: Automática via `entrevista-orquestradora` ou manual:
```bash
skill planejamento-de-tarefas
```

---

### 3. `analise-de-legado`

**One-liner**: Arqueólogo — mapeia arquitetura, módulos, dependências, dívida técnica, riscos — **sem modificar código**

**Quando Usar**: Antes de refatorar, onboarding em código legado, due diligence

**O Que Analisa**:
- Estrutura de diretórios e módulos
- Dependências (internas + externas)
- Padrões arquiteturais (ou ausência)
- Dívida técnica (code smells, duplicação, complexidade)
- Riscos de segurança, performance, manutenibilidade
- Cobertura de testes existente
- Documentação vs realidade

**Saída**: Relatório em `memoria/HISTORICO-DE-EXECUCAO.md` + decisões em `DECISOES.md`

**Regra de Ouro**: **NÃO MODIFICA CÓDIGO** — apenas inspeciona e relata

**Ativação**:
```bash
skill analise-de-legado
# Ou: "Analise o módulo legacy-payment antes de refatorar"
```

---

### 4. `code-simplification`

**One-liner**: Cirurgião — refatoração segura: micro-passos atômicos, testes a cada passo, rollback fácil

**Quando Usar**: Após `analise-de-legado`, code review, preparação para extensão

**Metodologia**:
1. Identifica menor unidade refatorável
2. Escreve/garante teste que passa (red-green)
3. Aplica micro-mudança (extract method, rename, remove duplication, etc.)
4. Roda teste — deve passar
5. Commit atômico com mensagem convencional
6. Repete até objetivo alcançado

**Garantias**:
- Zero regressão (teste a cada passo)
- Rollback trivial (git revert commit único)
- Histórico limpo (commits atômicos)

**Ativação**:
```bash
skill code-simplification
# Ou: "Refatore user-service.ts em micro-passos testados"
```

---

### 5. `systematic-debugging`

**One-liner**: Detetive — debug científico: observa → reproduz → isola → hipotetisa → testa → valida → documenta

**Quando Usar**: Bug reportado, flaky test, performance degradada, erro em cadeia

**Processo (7 Passos)**:
1. **Observa** — Coleta sintomas, logs, stack traces, contexto
2. **Reproduz** — Cria caso de teste mínimo determinístico
3. **Isola** — Reduz superfície (bisect, comentar código, mocks)
4. **Hipotetisa** — Formula 1-3 hipóteses ranqueadas por probabilidade
5. **Testa** — Experimento controlado por hipótese
6. **Valida** — Confirma fix + testes de regressão
7. **Documenta** — Registra causa raiz, fix, prevenção em `DECISOES.md`

**Ativação**:
```bash
skill systematic-debugging
# Ou: "Debug: race condition no cache do usuário"
```

---

### 6. `spec-driven-development`

**One-liner**: Arquiteto de contratos — spec-first: descobre → especifica (funcional + ADR + contrato + plano testes) → valida → implementa (TDD)

**Quando Usar**: Nova feature, nova API, breaking change, integração externa

**Fases**:
1. **Descoberta** — Entrevista stakeholders, mapeia requisitos
2. **Especificação** — Gera:
   - `ESPECIFICACAO-FUNCIONAL.md` (requisitos, regras, edge cases)
   - `DECISAO-TECNICA.md` (ADR com alternativas, justificativa)
   - Contratos de API (OpenAPI/TypeScript types)
   - `PLANO-TESTES.md` (estratégia, cenários, coverage targets)
3. **Validação** — Review da spec com stakeholders
4. **Implementação TDD** — Loop red-green-refactor por contrato

**Ativação**:
```bash
skill spec-driven-development
# Ou: "Nova feature: API de pagamentos com idempotência"
```

---

### 7. `verification-before-completion` ⭐ **OBRIGATÓRIA**

**One-liner**: Guardião da qualidade — testes + build + lint + type-check + **evidência real**

**Quando Usar**: **SEMPRE** antes de declarar "pronto", PR, merge, deploy

**Checklist Obrigatório** (Todos devem passar):
- [ ] Testes unitários: `npm test` (coverage ≥ threshold)
- [ ] Testes integração: `npm run test:integration`
- [ ] Testes E2E críticos: `npm run test:e2e`
- [ ] Build: `npm run build` (sem erros)
- [ ] Type-check: `npm run type-check` (0 erros TypeScript)
- [ ] Lint: `npm run lint` (0 warnings/errors)
- [ ] Validações custom: `agim validate`, `agim audit`
- [ ] **Evidência real**: Logs, screenshots, output de comandos — **NÃO inventar resultados**

**Falha Qualquer Item** → Exit 1, não permite "concluído"

**Ativação**: Automática no final de `agim auto` ou manual:
```bash
skill verification-before-completion
```

---

### 8. `code-review-and-quality`

**One-liner**: Inspetor 6 eixos — Funciona, Legível, Seguro, Performático, Testável, Consistente

**Quando Usar**: PR, commit main, hotfix, saída de `code-simplification`

**6 Eixos de Avaliação**:

| Eixo | O Que Verifica | Ferramenta |
|------|----------------|------------|
| **Funciona** | Requisitos atendidos, edge cases, integração | Testes + spec |
| **Legível** | Nomenclatura, estrutura, comentários, complexidade | ESLint + review humano |
| **Seguro** | Auth, AuthZ, validação, secrets, headers, OWASP | `auditoria-de-seguranca` |
| **Performático** | Complexidade algorítmica, queries N+1, bundle size | Profiler + benchmarks |
| **Testável** | Pure functions, DI, mocks fáceis, coverage | Arquitetura + testes |
| **Consistente** | Padrões do projeto, convenções, ARQUITETURA.md | Lint + templates |

**Saída**: `REVISAO-CODIGO.md` com veredito: **APROVA** / **CONDICIONAL** / **REJEITA**

**Ativação**:
```bash
skill code-review-and-quality
# Ou: "Code review completo no PR #123"
```

---

### 9. `revisao-final` ⭐ **QUALITY GATE FINAL**

**One-liner**: Juiz final — aprova, condicional, rejeita baseado em DoD completo

**Quando Usar**: Pre-merge, pre-release, entrega

**Definition of Done Verificada**:
- [ ] Todos critérios de aceitação atendidos
- [ ] Git: commits atômicos, mensagens convencionais, branch limpa
- [ ] Testes: unit + int + e2e + a11y + perf + sec passando
- [ ] Build: production build sem erros
- [ ] Docs: README, ADRs, CHANGELOG atualizados
- [ ] Regressões: zero novas (testes anteriores passam)
- [ ] Pendências: documentadas em `PENDENCIAS.md` com critério resolução

**Vereditos**:
- **APROVA** — Pronto para merge/deploy
- **CONDICIONAL** — Merge com follow-ups obrigatórios documentados
- **REJEITA** — Retorna para implementação com lista de bloqueios

**Ativação**:
```bash
skill revisao-final
```

---

### 10. `auditoria-de-seguranca`

**One-liner**: Oficial de segurança — matriz 15 riscos + checklist executável

**Quando Usar**: Pre-deploy, auth, dados sensíveis, compliance

**Matriz 15 Riscos** (Baseada em `docs/SEGURANCA.md`):

| # | Risco | Verificação |
|---|-------|-------------|
| 1 | Auth fraco | Argon2id (19MB/2/1) ou bcrypt ≥12 |
| 2 | AuthZ ausente | Middleware `autorizar` em TODAS rotas protegidas |
| 3 | Validação só frontend | Zod em TODOS endpoints (backend = barreira) |
| 4 | Secrets no frontend | Varredura `.env`, `VITE_*`, localStorage |
| 5 | Headers inseguros | CSP, HSTS, X-Frame-Options, Referrer-Policy |
| 4 | Rate limiting | 5 tent/15min auth, 100req/min API |
| 7 | CORS `*` | Allowlist explícita |
| 8 | SQL Injection | Prisma params + audit concatenação |
| 9 | XSS | `innerHTML`, `eval()`, sanitização |
| 10 | Upload inseguro | MIME real + allowlist + sharp + URLs assinadas |
| 11 | Deps vulneráveis | `npm audit` + SCA no CI |
| 12 | Logs com PII | Sanitização estruturada (Pino/Winston) |
| 13 | Soft delete ausente | `deletedAt` em tabelas sensíveis |
| 14 | Backup/PITR | Neon (7 dias + restore mensal) |
| 15 | Role DB superuser | Role `app_user` grants mínimos |

**Comando Rápido**:
```bash
agim audit
# Ou skill:
skill auditoria-de-seguranca
```

---

### 11. `testes-com-roteiro`

**One-liner**: Maestro de testes — unit, int, e2e, a11y, perf, sec, regressão

**Quando Usar**: Validação, regressão, pre-deploy, TDD

**Orquestra**:
| Tipo | Ferramenta | Cobertura Alvo |
|------|------------|----------------|
| Unit | Vitest + Testing Library | ≥ 80% (nova feature) |
| Integração | Vitest + Supertest + Testcontainers | ≥ 60% |
| E2E | Playwright | 100% critical paths |
| Acessibilidade | axe-core + Playwright | 0 violações critical/serious |
| Performance | k6 | p95 < threshold |
| Segurança | OWASP ZAP / custom | 0 critical/high |
| Regressão | Suite completa | 100% passing |

**Roteiro 50+ Cenários** (`checklists/ROTEIRO-DE-TESTES.md`):
- Auth: login, logout, refresh, expiração, brute force
- AuthZ: RBAC, ownership (IDOR), admin vs user
- Validação: schema, edge cases, sanitização
- CRUD: create, read, update, delete, list, paginação
- Falhas: network, timeout, DB down, validação
- Upload: MIME, tamanho, sanitização, storage
- Frontend: render, interação, estado, a11y
- Performance: carga, stress, soak, spike
- Segurança: OWASP Top 10, headers, secrets

**Ativação**:
```bash
skill testes-com-roteiro
# Ou: "Rode suite completa de testes com roteiro"
```

---

### 12. `revisao-de-interface`

**One-liner**: Designer crítico — visual, responsivo, a11y, estados, reuso

**Quando Usar**: Nova UI, PR frontend, redesign, auditoria UX

**Avalia**:
| Dimensão | Critérios |
|----------|-----------|
| **Consistência Visual** | Design tokens, spacing, typography, cores |
| **Responsividade** | Breakpoints: mobile (375), tablet (768), desktop (1440) |
| **Acessibilidade** | WCAG 2.1 AA: contraste, foco, ARIA, semântica |
| **Estados** | Loading, error, empty, success, disabled, skeleton |
| **Reuso** | Componentes primitivos (ui/), compostos (forms/, layout/) |

**Evidência**: Screenshots via Playwright MCP em `HISTORICO-DE-EXECUCAO.md`

**Ativação**:
```bash
skill revisao-de-interface
# Ou: "Auditoria visual do novo dashboard"
```

---

## Extended Skills (2 — Lazy Loading)

### 13. `bible-rag-search`

**One-liner**: Bibliotecário semântico — trechos relevantes (~2KB vs 27KB doc)

**Quando Carrega**: IA consulta o grimório ("como configurar X?")

**Uso**:
```bash
skill bible-rag-search "como configurar Argon2id no AGIM"
# Retorna só trechos relevantes de SEGURANCA.md, ARQUITETURA.md, etc.
```

**Benefício**: 90% menos tokens vs carregar docs completas

---

### 14. `graphify-integration`

**One-liner**: Cartógrafo de código — grafo vivo, queries naturais (~2KB vs 200KB)

**Quando Carrega**: Projeto existente (`existing`), `analise-de-legado`, `systematic-debugging`, `code-simplification`

**Uso**:
```bash
skill graphify-integration "quais arquivos dependem de usuarios.service?"
# Retorna subgrafo relevante: routes, controllers, tests, types
```

**Requer**: `npm install -g graphify-cli` + `graphify build` no projeto

---

## Skills Globais UI/UX (7 — Instaladas Separadamente)

| Skill | Função | Quando Usar |
|-------|--------|-------------|
| `ui-ux-pro-max` | Design intelligence: 79 estilos, 192 paletas, 74 fonts, 119 guidelines | UI/UX design, auditoria, decisão visual |
| `design` | Brand, logo, CIP, mockups, slides, banners, icons, social photos | Design abrangente, brand, marketing |
| `design-system` | Tokens 3-layer, CSS vars, scales, component specs, slides | Design system tokens, componentes |
| `banner-design` | Banners multi-formato (22 styles, social/ads/web/print) | Marketing, ads, social media |
| `brand` | Brand voice, visual identity, messaging, asset management | Brand guidelines, compliance |
| `slides` | HTML presentations Chart.js, tokens, responsive | Apresentações técnicas/executivas |
| `ui-styling` | shadcn/ui + Tailwind, componentes acessíveis, theming | Implementação frontend, componentes |

---

## Matriz de Seleção Rápida (A `entrevista-orquestradora` já faz isso)

| Pedido | Skills Core | Skills Extended | MCPs |
|--------|-------------|-----------------|------|
| Nova feature web | entrevista → planejamento → spec-driven → testes → verification → revisao | auditoria-seg, code-review | Context7, Playwright |
| Bug fix | systematic-debugging → testes-com-roteiro → verification → revisao | code-simplification | Playwright, DevTools |
| Refatoração/Legado | analise-de-legado → code-simplification → testes → verification → revisao | code-review | Graphify, Context7 |
| Auditoria Segurança | auditoria-de-seguranca → testes (sec) → verification → revisao | systematic-debugging | npm audit, Playwright |
| Auditoria UI/UX | revisao-de-interface → testes (a11y) → verification → revisao | - | Playwright, axe-core |
| Análise Legado | analise-de-legado → graphify → code-simplification | - | Graphify, Context7 |
| Pesquisa/Comparação | brainstorming → spec-driven → idea-refine → documentation-and-adrs | bible-rag-search | Context7, WebSearch |
| Deploy/Release | revisao-final → ci-cd-and-automation → testes (smoke) | - | GitHub, Playwright |

---

## Ativação Rápida (OpenCode)

```bash
# Carregar skill específica
skill entrevista-orquestradora
skill planejamento-de-tarefas
skill analise-de-legado
skill code-simplification
skill systematic-debugging
skill spec-driven-development
skill verification-before-completion
skill code-review-and-quality
skill revisao-final
skill auditoria-de-seguranca
skill testes-com-roteiro
skill revisao-de-interface
skill bible-rag-search
skill graphify-integration

# Linguagem natural (a orquestradora entende):
"Entrevista: vamos definir o objetivo"
"Nova feature: blog com markdown"
"Bug fix: race condition no cache"
"Auditoria segurança completa"
"Refatorar legacy-payment.ts"
```

---

## Fluxo Típico (Pipeline Padrão)

Ver diagrama em [HOW-IT-WORKS.md](./HOW-IT-WORKS.md#pipeline-de-skills-detalhado)

---

## Próximos Documentos

| Documento | Foco |
|-----------|------|
| [QUICKSTART.md](./QUICKSTART.md) | Zero a `agim auto` em 5 min |
| [CLI-REFERENCE.md](./CLI-REFERENCE.md) | 14 comandos com exemplos |
| [CONFIGURATION.md](./CONFIGURATION.md) | `.agim/config.json` referência |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura 9+6 camadas |