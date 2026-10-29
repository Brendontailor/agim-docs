# FAQ — AGIM

> Frequently asked questions, troubleshooting, and design decisions.

---

## General

### What is AGIM?
**AGIM (Agent Grimoire)** is an orchestration engine for AI agents. It transforms best-practice documentation into **automated execution** via skills. It's not just docs — it's an executable grimoire.

### What is it for?
- Enforces architecture (9 backend layers + 6 frontend)
- Mandatory quality gates (tests, build, lint, type-check, audit)
- Real continuity across sessions (`memoria/` 6 files)
- Automated security (15-risk matrix + `agim audit`)
- Accelerates onboarding (1–2 days vs 1–2 weeks)

### Is it a framework?
**No**. It's an **orchestration kit** you install in your project (`agim init`). It doesn't run in production — it runs during development to generate code, validate, audit.

### What stack does it support?
**Primary**: Node.js 18+ / TypeScript / Express / React / Prisma / PostgreSQL  
**Ready templates**: Express + React, FastAPI + Vue, Gin + React  
**Others**: Works for any stack, but skills/architecture optimized for TS/Node/React.

---

## Installation & Setup

### Do I need global install?
```bash
# Recommended (`agim` command always available)
npm install -g agim-orchestrator

# Or one-off execution (no install)
npx agim-orchestrator init
```

### What does `agim init` create?
```
my-project/
├── AGENTS.md                  # Rules (AGIM block + your notes)
├── .agim/
│   ├── config.json            # Configuration (single source)
│   └── core → ~/.agent-bible  # Shared global kit (symlink)
├── memoria/                   # Persistent state (6 files)
├── docs/                      # Architecture, security, testing
├── checklists/                # 9 mandatory checklists
├── templates/                 # 12 templates (plans, ADRs, audits)
├── exemplos/                  # Reference implementation
└── .opencode/skills/          # 15 operational skills
```

### Can I use it in an existing project?
**Yes**. `agim init` detects existing stack, adds AGIM kit without overwriting your code. Creates `memoria/` to start tracking.

---

## Daily Usage

### What's the main command?
```bash
agim auto "Your feature or bugfix"
# Example: agim auto "New payments API with idempotency"
```

### What does `agim auto` do?
1. Detects stack → installs/repairs kit
2. `agim sync` — Syncs AGENTS.md
3. `agim doctor` — Complete diagnosis
4. `agim interview` — Classifies + plans
5. `agim validate` — Parallel quality gate (tests, build, lint, type-check, audit)
6. Records everything in `memoria/`

### How to resume later?
```bash
cd my-project
agim status           # See where you left off
agim auto "continue"  # Resumes automatically
# AGIM reads memoria/ and continues exactly where it stopped
```

---

## Skills & Orchestration

### What are skills?
Operational capability units (14 total: 12 core + 2 extended). Each skill has: goal, when to use, preconditions, steps, validation, output.

### Do I invoke skills manually?
**No**. The `entrevista-orquestradora` (always first) decides which skills to activate based on your goal. You just say: `"New feature: blog with markdown"`.

### Can I invoke a specific skill?
**Yes**, if needed:
```bash
skill auditoria-de-seguranca
skill testes-com-roteiro
skill analise-de-legado
# etc.
```

---

## Quality & Security

### Is the quality gate optional?
**No**. `verification-before-completion` is **mandatory** and blocks "done" if any item fails:
- Tests (unit + int + e2e) passing
- Build no errors
- TypeScript 0 errors (strict)
- Lint 0 warnings/errors
- `agim validate` passes
- `agim audit` passes
- **Real evidence** (logs, screenshots — don't invent)

### How does security audit work?
```bash
agim audit
```
Scans 15 categories: weak auth, missing authZ, frontend-only validation, secrets in frontend, insecure headers, rate limiting, CORS `*`, SQL injection, XSS, unsafe upload, vulnerable deps, logs with PII, soft delete, backup/PITR, DB superuser. Exit 1 if any critical.

### What is the 15-risk matrix?
Executable checklist based on OWASP + AGIM practices. Each risk has automated detection and template prevention. See [SECURITY.md](./SECURITY.md).

---

## Memory & Continuity

### What is `memoria/`?
6 persistent files ensuring **real** continuity across sessions:

| File | Content |
|------|---------|
| `ESTADO-ATUAL.md` | Phase, last validation, next step, files, tests, problems, blockers, decisions, pending |
| `PLANO-DE-EXECUCAO.md` | Detailed plan with per-step status |
| `HISTORICO-DE-EXECUCAO.md` | Complete log: action, commands, results, failures, fixes |
| `DECISOES.md` | ADRs: ID, date, decision, context, alternatives, rationale, consequences |
| `PENDENCIAS.md` | Open items: priority, impact, dependencies, resolution criteria |
| `PROXIMO-PASSO.md` | **Single executable instruction** to resume |

### Can I edit `memoria/` manually?
**Not recommended**. Use skills/CLI (`agim auto`, `agim interview`, `agim status`). Manual edits may break synchronization.

---

## Configuration

### Where is config?
`.agim/config.json` — **single source of truth**. Edit → `agim config:validate` → `agim sync`.

### Key configs:
```json
{
  "qualityGates": {
    "typescript": "strict",     // or "relaxed"
    "lint": "standard",         // or "verbose"
    "coverage": { "unit": 80, "integration": 60, "e2e": 100 }
  },
  "security": {
    "auth": { "algorithm": "RS256", "argon2": { "memoryCost": 19456 }},
    "rateLimit": { "auth": { "max": 5, "windowMs": 900000 }}
  }
}
```

### Environment variables (NOT in config)
`.env` (gitignored): `DATABASE_URL`, `JWT_SECRET`, `CONTEXT7_API_KEY`, `GITHUB_TOKEN`

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `agim: command not found` | Not globally installed | `npm install -g agim-orchestrator` |
| `agim auto` fails at setup | Incomplete kit | `agim init` (or run without `--check`) |
| `agim auto` fails quality gate | Tests/build/lint failing | Read fix list printed at end |
| Drift AGENTS.md ↔ config | Edited AGENTS.md manually | `agim sync` |
| `.agim/core` invalid | Broken link | `agim core:link` |
| `config:validate` fails | Invalid enum/range | Fix `.agim/config.json` (Zod shows exact error) |

---

## Design Decisions

### Why Node.js 18+?
- Native fetch, test runner, ES modules
- Active LTS until 2025+
- Mature ecosystem (Vitest, Playwright, Prisma)

### Why Zod for validation?
- TypeScript-first, automatic type inference
- Excellent performance
- Schema = single source (runtime + compile-time)

### Why Argon2id (not bcrypt)?
- Password Hashing Competition 2015 winner
- GPU/ASIC resistant (memory-hard)
- OWASP 2023 config: 19MB/2/1

### Why JWT RS256 (not HS256)?
- Asymmetric: private key signs, public verifies
- Key rotation without invalidating tokens
- Separation of concerns (auth server vs resource server)

### Why Prisma (not raw SQL / TypeORM)?
- Type-safe database access
- Versioned migrations
- Excellent DX (autocomplete, lint)
- Adequate performance for 99% cases

---

## License & Cost

### Is it open source?
**Yes**, MIT License. CLI code in `scripts/`, docs in `docs/`, skills in `.opencode/skills/`.

### Any cost?
**Zero**. Free for commercial, private, educational use.

### Is the main repo public?
The **CLI (`agim-orchestrator`)** is public on npm. The **development repo (AGIM)** is private on GitHub. Public documentation is in `agim-docs`.

---

## Next Steps

| Question | Document |
|----------|----------|
| Detailed architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Complete skills | [SKILLS-SYSTEM.md](./SKILLS-SYSTEM.md) |
| CLI commands | [CLI-REFERENCE.md](./CLI-REFERENCE.md) |
| Configuration | [CONFIGURATION.md](./CONFIGURATION.md) |
| Security | [SECURITY.md](./SECURITY.md) |
| Testing | [TESTING.md](./TESTING.md) |
| Real metrics | [METRICS.md](./METRICS.md) |
| Examples | [EXAMPLES.md](./EXAMPLES.md) |