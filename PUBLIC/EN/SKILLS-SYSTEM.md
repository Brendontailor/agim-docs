# AGIM Skills System

> Complete reference of 14 operational skills — when to use each, how they work, and how they combine.

---

## Overview

| Category | Count | Loading |
|----------|-------|---------|
| **Core** | 12 | Always (auto-loaded) |
| **Extended** | 2 | Lazy (on demand) |
| **Global UI/UX** | 7 | Installed separately |

---

## Core Skills (12 — Always Loaded)

### 1. `entrevista-orquestradora` ⭐ **SINGLE ENTRY POINT**

**One-liner**: Grimoire CEO — understands, plans, selects skills, executes, verifies

**When to Use**: **ALWAYS** — start of any session or substantial task

**What It Does**:
1. Adaptive interview until ~95% confidence on intent
2. Classifies: domain/type/complexity/risk/scope
3. Consults `INDEX.md`, `ORCHESTRATOR.md`, `SKILLS-CATALOG.md`, `SKILLS-SELECTION-MATRIX.md`
4. Discovers real context (files, Git, `memoria/`)
5. Selects minimal necessary skills/MCPs/tools
6. Prepares proportional plan with acceptance criteria
7. Executes/coordinates with per-step verification
8. Verifies final result vs original criteria
9. Records complete continuity in `memoria/`

**Activation**:
```bash
skill entrevista-orquestradora
# Or natural language: "Interview: let's define the goal"
```

---

### 2. `planejamento-de-tarefas`

**One-liner**: Architect — transforms request into executable plan: steps, dependencies, criteria, risks

**When to Use**: New feature, complex task, refactoring, sprint planning

**Input**: Classified goal + project context

**Output**: `memoria/PLANO-DE-EXECUCAO.md` with:
- Logical phases (Setup → Spec → Impl → Tests → Validation → Delivery)
- Atomic steps with status (NOT STARTED/IN PROGRESS/DONE/BLOCKED/NEEDS REVIEW)
- Acceptance criteria per step
- Inter-step dependencies
- Risks and mitigations
- Effort estimation

**Activation**: Automatic via `entrevista-orquestradora` or manual:
```bash
skill planejamento-de-tarefas
```

---

### 3. `analise-de-legado`

**One-liner**: Archaeologist — maps architecture, modules, dependencies, tech debt, risks — **without modifying code**

**When to Use**: Before refactoring, legacy onboarding, due diligence

**What It Analyzes**:
- Directory structure and modules
- Dependencies (internal + external)
- Architectural patterns (or lack thereof)
- Technical debt (code smells, duplication, complexity)
- Security, performance, maintainability risks
- Existing test coverage
- Documentation vs reality

**Output**: Report in `memoria/HISTORICO-DE-EXECUCAO.md` + decisions in `DECISOES.md`

**Golden Rule**: **DOES NOT MODIFY CODE** — only inspects and reports

**Activation**:
```bash
skill analise-de-legado
# Or: "Analyze legacy-payment module before refactoring"
```

---

### 4. `code-simplification`

**One-liner**: Surgeon — safe refactoring: atomic micro-steps, tests each step, easy rollback

**When to Use**: After `analise-de-legado`, code review, prep for extension

**Methodology**:
1. Identifies smallest refactorable unit
2. Writes/ensures passing test (red-green)
3. Applies micro-change (extract method, rename, remove duplication, etc.)
4. Runs test — must pass
5. Atomic commit with conventional message
6. Repeats until goal achieved

**Guarantees**:
- Zero regression (test each step)
- Trivial rollback (git revert single commit)
- Clean history (atomic commits)

**Activation**:
```bash
skill code-simplification
# Or: "Refactor user-service.ts in tested micro-steps"
```

---

### 5. `systematic-debugging`

**One-liner**: Detective — scientific debug: observe → reproduce → isolate → hypothesize → test → validate → document

**When to Use**: Bug reported, flaky test, performance degradation, error chain

**Process (7 Steps)**:
1. **Observe** — Collect symptoms, logs, stack traces, context
2. **Reproduce** — Creates minimal deterministic test case
3. **Isolate** — Reduces surface (bisect, comment code, mocks)
4. **Hypothesize** — Forms 1-3 hypotheses ranked by probability
5. **Test** — Controlled experiment per hypothesis
6. **Validate** — Confirms fix + regression tests
7. **Document** — Records root cause, fix, prevention in `DECISOES.md`

**Activation**:
```bash
skill systematic-debugging
# Or: "Debug: race condition in user cache"
```

---

### 6. `spec-driven-development`

**One-liner**: Contract architect — spec-first: discover → specify (functional + ADR + contract + test plan) → validate → implement (TDD)

**When to Use**: New feature, new API, breaking change, external integration

**Phases**:
1. **Discovery** — Stakeholder interviews, requirements mapping
2. **Specification** — Generates:
   - `ESPECIFICACAO-FUNCIONAL.md` (requirements, rules, edge cases)
   - `DECISAO-TECNICA.md` (ADR with alternatives, rationale)
   - API contracts (OpenAPI/TypeScript types)
   - `PLANO-TESTES.md` (strategy, scenarios, coverage targets)
3. **Validation** — Spec review with stakeholders
4. **TDD Implementation** — Red-green-refactor loop per contract

**Activation**:
```bash
skill spec-driven-development
# Or: "New feature: payments API with idempotency"
```

---

### 7. `verification-before-completion` ⭐ **MANDATORY**

**One-liner**: Quality guardian — tests + build + lint + type-check + **real evidence**

**When to Use**: **ALWAYS** before declaring "done", PR, merge, deploy

**Mandatory Checklist** (All must pass):
- [ ] Unit tests: `npm test` (coverage ≥ threshold)
- [ ] Integration tests: `npm run test:integration`
- [ ] Critical E2E: `npm run test:e2e`
- [ ] Build: `npm run build` (no errors)
- [ ] Type-check: `npm run type-check` (0 TypeScript errors)
- [ ] Lint: `npm run lint` (0 warnings/errors)
- [ ] Custom validations: `agim validate`, `agim audit`
- [ ] **Real evidence**: Logs, screenshots, command output — **DO NOT invent results**

**Any Failure** → Exit 1, blocks "done"

**Activation**: Automatic at end of `agim auto` or manual:
```bash
skill verification-before-completion
```

---

### 8. `code-review-and-quality`

**One-liner**: 6-axis inspector — Works, Readable, Secure, Performant, Testable, Consistent

**When to Use**: PR, main commit, hotfix, `code-simplification` output

**6 Evaluation Axes**:

| Axis | What It Checks | Tool |
|------|----------------|------|
| **Works** | Requirements met, edge cases, integration | Tests + spec |
| **Readable** | Naming, structure, comments, complexity | ESLint + human review |
| **Secure** | Auth, AuthZ, validation, secrets, headers, OWASP | `auditoria-de-seguranca` |
| **Performant** | Algorithmic complexity, N+1 queries, bundle size | Profiler + benchmarks |
| **Testable** | Pure functions, DI, easy mocks, coverage | Architecture + tests |
| **Consistent** | Project patterns, conventions, ARQUITETURA.md | Lint + templates |

**Output**: `REVISAO-CODIGO.md` with verdict: **APPROVE** / **CONDITIONAL** / **REJECT**

**Activation**:
```bash
skill code-review-and-quality
# Or: "Full code review on PR #123"
```

---

### 9. `revisao-final` ⭐ **FINAL QUALITY GATE**

**One-liner**: Final judge — approves, conditional, rejects based on complete DoD

**When to Use**: Pre-merge, pre-release, delivery

**Definition of Done Verified**:
- [ ] All acceptance criteria met
- [ ] Git: atomic commits, conventional messages, clean branch
- [ ] Tests: unit + int + e2e + a11y + perf + sec passing
- [ ] Build: production build no errors
- [ ] Docs: README, ADRs, CHANGELOG updated
- [ ] Regressions: zero new (previous tests pass)
- [ ] Pending: documented in `PENDENCIAS.md` with resolution criteria

**Verdicts**:
- **APPROVE** — Ready for merge/deploy
- **CONDITIONAL** — Merge with mandatory follow-ups documented
- **REJECT** — Back to implementation with blocker list

**Activation**:
```bash
skill revisao-final
```

---

### 10. `auditoria-de-seguranca`

**One-liner**: Security officer — 15-risk matrix + executable checklist

**When to Use**: Pre-deploy, auth, sensitive data, compliance

**15-Risk Matrix** (Based on `docs/SEGURANCA.md`):

| # | Risk | Verification |
|---|------|--------------|
| 1 | Weak auth | Argon2id (19MB/2/1) or bcrypt ≥12 |
| 2 | Missing authZ | `autorizar` middleware on ALL protected routes |
| 3 | Frontend-only validation | Zod on ALL endpoints (backend = real barrier) |
| 4 | Secrets in frontend | Scans `.env`, `VITE_*`, localStorage |
| 5 | Insecure headers | CSP, HSTS, X-Frame-Options, Referrer-Policy |
| 6 | Missing rate limit | 5 attempts/15min auth, 100req/min API |
| 7 | CORS `*` | Explicit allowlist required |
| 8 | SQL Injection | Prisma params + audit concatenation |
| 9 | XSS | `innerHTML`, `eval()`, sanitization |
| 10 | Unsafe upload | Real MIME + allowlist + sharp + signed URLs |
| 11 | Vulnerable deps | `npm audit` + SCA in CI |
| 12 | Logs with PII | Structured sanitization (Pino/Winston) |
| 13 | Missing soft delete | `deletedAt` on sensitive tables |
| 14 | Backup/PITR | Neon (7 days + monthly restore) |
| 15 | DB superuser role | `app_user` role minimal grants |

**Quick Command**:
```bash
agim audit
# Or skill:
skill auditoria-de-seguranca
```

---

### 11. `testes-com-roteiro`

**One-liner**: Test maestro — unit, int, e2e, a11y, perf, sec, regression

**When to Use**: Validation, regression, pre-deploy, TDD

**Orchestrates**:
| Type | Tool | Target Coverage |
|------|------|-----------------|
| Unit | Vitest + Testing Library | ≥ 80% (new feature) |
| Integration | Vitest + Supertest + Testcontainers | ≥ 60% |
| E2E | Playwright | 100% critical paths |
| Accessibility | axe-core + Playwright | 0 critical/serious violations |
| Performance | k6 | p95 < threshold |
| Security | OWASP ZAP / custom | 0 critical/high |
| Regression | Full suite | 100% passing |

**50+ Scenario Playbook** (`checklists/ROTEIRO-DE-TESTES.md`):
- Auth: login, logout, refresh, expiry, brute force
- AuthZ: RBAC, ownership (IDOR), admin vs user
- Validation: schema, edge cases, sanitization
- CRUD: create, read, update, delete, list, pagination
- Failures: network, timeout, DB down, validation
- Upload: MIME, size, sanitization, storage
- Frontend: render, interaction, state, a11y
- Performance: load, stress, soak, spike
- Security: OWASP Top 10, headers, secrets

**Activation**:
```bash
skill testes-com-roteiro
# Or: "Run complete test suite with playbook"
```

---

### 12. `revisao-de-interface`

**One-liner**: Critical designer — visual, responsive, a11y, states, reuse

**When to Use**: New UI, frontend PR, redesign, UX audit

**Evaluates**:
| Dimension | Criteria |
|-----------|----------|
| **Visual Consistency** | Design tokens, spacing, typography, colors |
| **Responsiveness** | Breakpoints: mobile (375), tablet (768), desktop (1440) |
| **Accessibility** | WCAG 2.1 AA: contrast, focus, ARIA, semantics |
| **States** | Loading, error, empty, success, disabled, skeleton |
| **Reuse** | Primitive components (ui/), composite (forms/, layout/) |

**Evidence**: Screenshots via Playwright MCP in `HISTORICO-DE-EXECUCAO.md`

**Activation**:
```bash
skill revisao-de-interface
# Or: "Visual audit of new dashboard"
```

---

## Extended Skills (2 — Lazy Loading)

### 13. `bible-rag-search`

**One-liner**: Semantic librarian — relevant chunks (~2KB vs 27KB doc)

**When Loaded**: AI consults the grimoire ("how to configure X?")

**Usage**:
```bash
skill bible-rag-search "how to configure Argon2id in AGIM"
# Returns only relevant chunks from SEGURANCA.md, ARQUITETURA.md, etc.
```

**Benefit**: 90% fewer tokens vs loading full docs

---

### 14. `graphify-integration`

**One-liner**: Code cartographer — live graph, natural queries (~2KB vs 200KB)

**When Loaded**: Existing project (`existing`), `analise-de-legado`, `systematic-debugging`, `code-simplification`

**Usage**:
```bash
skill graphify-integration "which files depend on users.service?"
# Returns relevant subgraph: routes, controllers, tests, types
```

**Requires**: `npm install -g graphify-cli` + `graphify build` in project

---

## Global UI/UX Skills (7 — Installed Separately)

| Skill | Function | When to Use |
|-------|----------|-------------|
| `ui-ux-pro-max` | Design intelligence: 79 styles, 192 palettes, 74 fonts, 119 guidelines | UI/UX design, audit, visual decision |
| `design` | Brand, logo, CIP, mockups, slides, banners, icons, social photos | Comprehensive design, brand, marketing |
| `design-system` | 3-layer tokens, CSS vars, scales, component specs, slides | Design system tokens, components |
| `banner-design` | Multi-format banners (22 styles, social/ads/web/print) | Marketing, ads, social media |
| `brand` | Brand voice, visual identity, messaging, asset management | Brand guidelines, compliance |
| `slides` | HTML presentations Chart.js, tokens, responsive | Technical/executive presentations |
| `ui-styling` | shadcn/ui + Tailwind, accessible components, theming | Frontend implementation, components |

---

## Quick Selection Matrix (The `entrevista-orquestradora` Does This)

| Request | Core Skills | Extended Skills | MCPs |
|---------|-------------|-----------------|------|
| New web feature | interview → planning → spec-driven → tests → verification → review | security-audit, code-review | Context7, Playwright |
| Bug fix | systematic-debugging → testes-com-roteiro → verification → review | code-simplification | Playwright, DevTools |
| Refactoring/Legacy | analise-de-legado → code-simplification → tests → verification → review | code-review | Graphify, Context7 |
| Security Audit | auditoria-de-seguranca → tests (sec) → verification → review | systematic-debugging | npm audit, Playwright |
| UI/UX Audit | revisao-de-interface → tests (a11y) → verification → review | - | Playwright, axe-core |
| Legacy Analysis | analise-de-legado → graphify → code-simplification | - | Graphify, Context7 |
| Research/Compare | brainstorming → spec-driven → idea-refine → documentation-and-adrs | bible-rag-search | Context7, WebSearch |
| Deploy/Release | revisao-final → ci-cd-and-automation → tests (smoke) | - | GitHub, Playwright |

---

## Quick Activation (OpenCode)

```bash
# Load specific skill
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

# Natural language (orchestrator understands):
"Interview: let's define the goal"
"New feature: blog with markdown"
"Bug fix: race condition in cache"
"Full security audit"
"Refactor legacy-payment.ts"
```

---

## Typical Flow (Standard Pipeline)

See diagram in [HOW-IT-WORKS.md](./HOW-IT-WORKS.md#skills-pipeline-detailed)

---

## Next Documents

| Document | Focus |
|----------|-------|
| [QUICKSTART.md](./QUICKSTART.md) | Zero to `agim auto` in 5 min |
| [CLI-REFERENCE.md](./CLI-REFERENCE.md) | 14 commands with examples |
| [CONFIGURATION.md](./CONFIGURATION.md) | `.agim/config.json` reference |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 9 backend + 6 frontend layers |