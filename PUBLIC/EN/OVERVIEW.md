# AGIM Overview

> **AGIM (Agent Grimoire)** — Orchestration engine for AI agents that executes what it teaches.

---

## What is AGIM?

**AGIM** is an orchestration system for AI agents that transforms best-practice documentation into **automated execution**. It's not just a set of documents — it's an **executable grimoire** where every pattern, rule, and checklist has a corresponding *skill* that can be invoked to apply it automatically.

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Grimoire** | Versioned knowledge base (docs, checklists, templates, skills) |
| **Orchestrator** | Central skill that understands, classifies, plans, selects skills, and verifies |
| **Skills** | Operational capability units (14 total: 12 core + 2 extended) |
| **Persistent Memory** | 6 files in `memoria/` ensuring continuity across sessions |
| **Shared Global Kit** | `~/.agent-bible` symlinked via `.agim/core` |

---

## The Problem AGIM Solves

### Before AGIM
- ❌ Static documentation nobody reads
- ❌ Agents "hallucinate" non-existent patterns
- ❌ Context lost between sessions
- ❌ Quality gates skipped under pressure
- ❌ Repetitive setup for every new project
- ❌ Superficial code reviews due to time constraints

### With AGIM
- ✅ **Living documentation** — skills execute what's written
- ✅ **Intelligent orchestration** — `entrevista-orquestradora` decides what to do
- ✅ **Real continuity** — `memoria/` persists state, decisions, history
- ✅ **Mandatory quality gates** — `verification-before-completion` demands evidence
- ✅ **Bootstrap in 1 command** — `agim init` installs everything
- ✅ **Multi-axis code review** — 6 automated dimensions

---

## How It Works (Main Flow)

```mermaid
graph TD
    A[User: "New feature: users API"] --> B[entrevista-orquestradora]
    B --> C{Classifies:<br/>domain/type/complexity/risk/scope}
    C --> D[Selects minimal necessary skills]
    D --> E[Generates plan with acceptance criteria]
    E --> F[Executes in parallel with per-step verification]
    F --> G[Quality gate: tests + build + lint + type-check]
    G --> H[6-axis code review]
    H --> I[Final review: complete DoD]
    I --> J[Records in memoria/]
```

---

## 📦 Current Version: **1.1.2** (2026-10-29)

### ✨ What's New in v1.1.2

| Fix | Impact |
|-----|--------|
| **`config:validate` now properly validates** | Invalid JSON, out-of-range values (coverage > 100), missing required fields, invalid enums (`typescript: "relaxed"`, `lint: "verbose"`) now correctly fail (exit 1) |
| **`agim audit` detects all vulnerabilities** | Now catches `eval()`, `.innerHTML =`, SQL concatenation (`+ variable`), hardcoded passwords, `AKIA...` in `.env` — including SQL via `+ var` without quotes |
| **`agim doctor` correctly distinguishes RAG index** | Project index → "present", global index → "exists but not this project", none → "absent" |
| **Expanded SQL injection regex** | Detects template literals (`${...}`), concatenation with quotes (`+ 'str'`), and direct concatenation (`+ variable`) |
| **Test file false positives eliminated** | `security-audit.cjs` ignores temporary test files (`test-regex.cjs`, etc.) |
| **Regression tests added** | Unit tests for enum/range validation; smoke tests for audit (eval, innerHTML, SQL, secrets, .env) |

---

## What's in the Package

### 1. Technical Documentation (docs/)
| File | Purpose |
|------|---------|
| `ARQUITETURA.md` | 9 backend layers + 6 frontend, conventions |
| `SEGURANCA.md` | Auth (Argon2id, JWT RS256), AuthZ, validation, secrets, headers, 15-risk matrix |
| `TESTES.md` | Pyramid, Vitest, Playwright, axe, k6, coverage thresholds |
| `CODIGO-LIMPO.md` | SRP, low coupling, TS strict, Zod, anti-patterns |
| `CONFIGURATION.md` | `.agim/config.json` complete reference |
| `QUICKSTART.md` | Zero to `agim auto` in 5 min |
| `TROUBLESHOOTING.md` | Common issues and fixes |
| `FERRAMENTAS-IA.md` | Inventory: 3 categories, 11 fields each |
| `IA-E-CONTEXTO.md` | Ecosystem: AGENTS, Skills, Docs, Memory, Graphify, Context7, RAG |
| `BOOTSTRAP-AMBIENTE.md` | Required order: OpenCode, 7 global skills, 3 MCPs, 6 local skills |
| `VALIDACAO-DO-REPOSITORIO.md` | Validation commands: structure, links, syntax, skills, templates, secrets |

### 2. Mandatory Checklists (checklists/ - 9)
| Checklist | When to Use |
|-----------|-------------|
| `INICIO.md` | Prep, bootstrap, initial validation |
| `DESENVOLVIMENTO.md` | During implementation (quality, security, patterns) |
| `SEGURANCA.md` | Security audit (auth, authZ, validation, secrets, deps) |
| `TESTES.md` | Test validation (unit, int, e2e, a11y, sec, perf) |
| `ROTEIRO-DE-TESTES.md` | 50+ detailed scenarios (Auth, AuthZ, Validation, CRUD, Failures, Upload, Frontend, Perf, Sec) |
| `REVISAO-DE-CODIGO.md` | Multi-axis code review (works, readable, secure, performant, testable, consistent) |
| `ENTREGA.md` | Definition of Done (criteria, git, tests, build, docs, regressions, pending) |
| `PUBLICACAO.md` | Deploy, rollback, monitoring, smoke tests |
| `USO-DE-IA.md` | Responsible, ethical, limitations, validation, human oversight |

### 3. Reusable Templates (templates/ - 12)
| Template | Use |
|----------|-----|
| `AGENTS.md` | Project operational instructions |
| `README.md` | Project documentation |
| `ARQUITETURA.md` | Architecture decisions |
| `DECISAO-TECNICA.md` | ADR (Architecture Decision Record) |
| `PLANO-IMPLEMENTACAO.md` | Detailed execution plan |
| `ESPECIFICACAO-FUNCIONAL.md` | Functional requirements |
| `PLANO-TESTES.md` | Test strategy |
| `AUDITORIA-SEGURANCA.md` | Security audit report |
| `REVISAO-CODIGO.md` | Code review report |
| `RELATORIO-ENTREGA.md` | Delivery report |
| `REGISTRO-INCIDENTE.md` | Incident log |
| `DIVIDA-TECNICA.md` | Technical debt log |

### 4. Memory System (memoria/ - 6 files)
| File | Content |
|------|---------|
| `ESTADO-ATUAL.md` | Phase, last validation, next step, files, tests, problems, blockers, decisions, pending |
| `PLANO-DE-EXECUCAO.md` | Task status: NOT STARTED/IN PROGRESS/DONE/BLOCKED/NEEDS REVIEW |
| `HISTORICO-DE-EXECUCAO.md` | Action, commands, results, failures, fixes |
| `DECISOES.md` | ID, date, decision, context, alternatives, rationale, consequences, status |
| `PENDENCIAS.md` | ID, priority, impact, dependencies, resolution criteria, next action, status |
| `PROXIMO-PASSO.md` | Executable resume: where to restart, files, action, dependencies, validation, fallback |

### 5. Operational Skills (.opencode/skills/ - 15)
| Skill | Function | When to Use |
|-------|----------|-------------|
| `entrevista-orquestradora` | **CENTRAL** — Understands, plans, selects, executes, verifies | **ALWAYS** (single entry point) |
| `planejamento-de-tarefas` | Analyzes, breaks down, defines criteria, identifies dependencies | New feature, complex task, planning |
| `analise-de-legado` | Maps architecture, modules, dependencies, risks — **no code modification** | Before refactoring, legacy onboarding |
| `revisao-de-interface` | Visual audit, responsiveness, a11y, states, reuse | New UI, frontend PR, redesign, audit |
| `auditoria-de-seguranca` | Auth, AuthZ, validation, secrets, config, deps, risk matrix | Pre-deploy, auth, sensitive data |
| `testes-com-roteiro` | Orchestrates tests: unit, int, e2e, a11y, sec, perf | Validation, regression, pre-deploy |
| `revisao-final` | Quality gate: criteria, git, tests, build, docs, regressions, pending | Pre-merge, pre-release, delivery |
| `code-simplification` | Safe refactoring: atomic micro-steps, tests each step | After analysis, code review, prep for extension |
| `systematic-debugging` | Scientific debug: observe → reproduce → isolate → hypothesize → test → validate → document | Bug reported, flaky test, performance |
| `spec-driven-development` | Spec-first: discover → specify → validate → implement (TDD) | New feature, API, breaking change |
| `verification-before-completion` | Mandatory quality gate: tests + build + lint + type-check + **real evidence** | **ALWAYS** before "done", PR, merge |
| `code-review-and-quality` | 6-axis code review: Works, Readable, Secure, Performant, Testable, Consistent | PR, main commit, hotfix |
| `bible-rag-search` | Semantic search in AGIM: relevant chunks (~2KB vs 27KB) | AI consults the grimoire |
| `graphify-integration` | Code graph: natural queries → relevant subgraph (~2KB vs 200KB) | Existing project, analysis, debug |
| `using-agent-skills` | Meta-skill: discovers and invokes skills | Session start, skill decision |

### 6. Global Skills Installed (7 - UI/UX/Design)
| Skill | Function |
|-------|----------|
| `ui-ux-pro-max` | Design intelligence: 79 styles, 192 palettes, 74 fonts, 119 guidelines |
| `design` | Brand, logo, CIP, mockups, slides, banners, icons, social photos |
| `design-system` | 3-layer tokens, CSS vars, scales, component specs, slides |
| `banner-design` | Multi-format banners (22 styles, social/ads/web/print) |
| `brand` | Brand voice, visual identity, messaging, asset management |
| `slides` | HTML presentations Chart.js, tokens, responsive |
| `ui-styling` | shadcn/ui + Tailwind, accessible components, theming |

### 7. MCPs (Model Context Protocol) - 3
| MCP | Function | Configuration |
|-----|----------|---------------|
| `context7` | Official tech docs by exact version | `CONTEXT7_API_KEY` |
| `github` | Releases, tags, teams, issues, PRs, repos | `GITHUB_TOKEN` |
| `browser`/`playwright` | Browser automation, screenshots, E2E | `browser.json` |

### 8. Reference Example (exemplos/)
Complete functional implementation of "Users" with:
- Backend: routes, controllers, services, validators, repositories, Prisma schema
- Frontend: pages, hooks, services, types, components
- Full modular architecture demonstrated

---

## Who Is AGIM For?

| Profile | Primary Benefit |
|---------|-----------------|
| **Tech Leads / Architects** | Enforced standardization, consistent architecture, automatic ADRs |
| **Senior Developers** | Speed with quality, real TDD, safe refactoring |
| **Junior/Mid Developers** | Guardrails preventing common errors, accelerated onboarding |
| **Security Teams** | Automated audit, 15-risk matrix, executable checklist |
| **QA / Test Engineers** | 50+ scenario playbook, test pyramid, coverage thresholds |
| **Project Managers** | Real visibility via `memoria/`, skill-based estimation |
| **Distributed Teams** | Shared context, continuity without sync meetings |

---

## Requirements

| Requirement | Minimum Version |
|-------------|-----------------|
| **Node.js** | 18+ |
| **npm** | 9+ (comes with Node 18+) |
| **Git** | 2.30+ |
| **OpenCode** | v2 (harness) |
| **Operating System** | Windows 10+, macOS 12+, Linux (glibc 2.28+) |

### Optionals (for advanced features)
| Feature | Activation Command |
|---------|-------------------|
| **RAG** (semantic search) | `npm install -g @xenova/transformers && agim rag:rebuild` |
| **Graphify** (code graph) | `npm install -g graphify-cli && agim graph "question"` |

---

## Quick Install

```bash
# Global (recommended)
npm install -g agim-orchestrator

# Or one-off execution
npx agim-orchestrator init
```

> Requires **Node.js 18+**. Zero required dependencies.

---

## First Command (After Install)

```bash
cd my-project
agim auto "New feature: users API with CRUD, JWT auth and Zod validation"
```

This runs everything: detects stack → installs kit → syncs AGENTS.md → doctor → plans → validates in parallel → records history.

---

## Next Steps

| Goal | Document |
|------|----------|
| Understand benefits and metrics | [WHY-AGIM.md](./WHY-AGIM.md) |
| See detailed architecture and flow | [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) |
| Complete skills reference | [SKILLS-SYSTEM.md](./SKILLS-SYSTEM.md) |
| Get started now (5 min) | [QUICKSTART.md](./QUICKSTART.md) |
| CLI commands reference | [CLI-REFERENCE.md](./CLI-REFERENCE.md) |
| Detailed configuration | [CONFIGURATION.md](./CONFIGURATION.md) |

---

## Useful Links

- **npm**: [agim-orchestrator](https://www.npmjs.com/package/agim-orchestrator)
- **Issues**: [github.com/Brendontailor/AGIM/issues](https://github.com/Brendontailor/AGIM/issues)
- **Changelog**: [CHANGELOG.md](../../CHANGELOG.md)

---

> **AGIM: the grimoire that executes what it teaches.**