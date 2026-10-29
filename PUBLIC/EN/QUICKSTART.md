# Quick Start — AGIM

> Zero to `agim auto` in 5 minutes.

---

## Prerequisites

```bash
# Check versions
node --version    # ≥ 18
npm --version     # ≥ 9
git --version     # ≥ 2.30
```

---

## 1. Installation (30 seconds)

```bash
# Global (recommended)
npm install -g agim-orchestrator

# Or one-off execution (no global install)
npx agim-orchestrator init
```

---

## 2. Initialize Project (1 minute)

```bash
cd my-existing-project
# OR
mkdir my-new-project && cd my-new-project

agim init
```

**What happens**:
- Detects stack (Node/TypeScript, React, Python, etc.)
- Installs AGIM kit (docs, checklists, templates, skills)
- Creates `.agim/config.json` (single source config)
- Creates symlink `.agim/core → ~/.agent-bible` (shared global kit)
- Generates `AGENTS.md` with AGIM managed block
- Creates `memoria/` (6 persistent state files)
- Copies 15 skills to `.opencode/skills/`
- Reports how many skills were copied

---

## 3. Validate Setup (10 seconds)

```bash
agim validate
# Exit 0 = all good, Exit 1 = critical failure
```

**Verifies**:
- Directory structure
- `.agim/config.json` valid (Zod + fail fast)
- `AGENTS.md` synced
- `memoria/` exists
- Skills installed (complete kit)
- No exposed secrets
- Valid Markdown syntax

---

## 4. Health Check (5 seconds)

```bash
agim doctor
```

**Diagnoses**:
- ✅ Critical (blocking)
- ⚠️ Warnings (recommended)
- ℹ️ Optional (nice to have)

Includes: Node version, Git status, Config valid, RAG index, Skills, MCPs, Dependencies

---

## 5. First Automatic Feature (2–5 minutes)

```bash
agim auto "New feature: users API with CRUD, JWT auth and Zod validation"
```

**What runs automatically**:
1. **Detects stack** — Analyzes package.json, tsconfig, structure
2. **Installs/Repairs kit** — Ensures docs, skills, config up to date
3. **Syncs AGENTS.md** — Updates managed block
4. **Doctor** — Complete diagnosis
5. **Interview** — Classifies task, selects skills, writes plan
6. **Plans** — `planejamento-de-tarefas` creates plan with criteria
7. **Validates in parallel** — Running tests, build, lint, type-check, audit
8. **Records history** — Updates `memoria/` completely

---

## 6. View Status (Instant)

```bash
agim status
# Or JSON:
agim status --json
```

**Shows**: Current phase, last validation, next step, files, tests, problems, blockers, decisions, pending

---

## 7. Resume Later Session

```bash
# In new session/terminal:
cd my-project
agim status           # See where you left off
agim auto "continue"  # Resumes automatically
```

**AGIM reads `memoria/` and resumes exactly where it stopped** — no repeating completed tasks.

---

## Summary Flow (Cheatsheet)

```bash
# Initial setup (once per project)
agim init
agim validate
agim doctor

# Daily development
agim auto "your feature or bugfix"
agim status           # Quick checkpoint
agim validate         # Manual quality gate
agim audit            # Security audit

# Maintenance
agim sync             # Updates AGENTS.md block
agim config:validate  # Validates config only
agim core:link        # Recreates .agim/core link
agim rag:rebuild      # Rebuilds RAG index (optional)
agim graph "question" # Queries code graph (optional)
```

---

## Created Structure

```
my-project/
├── AGENTS.md                  # Rules (AGIM block + your notes)
├── .agim/
│   ├── config.json            # Configuration (single source)
│   └── core → ~/.agent-bible  # Shared global kit
├── memoria/                   # Persistent state (6 files)
│   ├── ESTADO-ATUAL.md
│   ├── PLANO-DE-EXECUCAO.md
│   ├── HISTORICO-DE-EXECUCAO.md
│   ├── DECISOES.md
│   ├── PENDENCIAS.md
│   └── PROXIMO-PASSO.md
├── docs/                      # Architecture, security, testing
├── checklists/                # 9 checklists per phase
├── templates/                 # 12 templates (plans, ADRs, audits)
├── exemplos/                  # Reference implementation
└── .opencode/skills/          # 15 operational skills
```

---

## Essential Commands

| Command | Purpose |
|---------|---------|
| `agim auto "goal"` | **Full automatic flow** (recommended) |
| `agim init` | Installs kit, config, AGENTS.md, memoria/ |
| `agim validate` | Validates project or AGIM repo |
| `agim doctor` | Diagnosis: critical / warning / optional |
| `agim status` | Shows `memoria/ESTADO-ATUAL.md` |
| `agim interview "goal"` | Classifies, selects skills, writes plan |
| `agim sync` | Updates managed AGENTS.md block |
| `agim audit` | Static audit for insecure patterns |
| `agim config:validate` | Validates `.agim/config.json` |
| `agim core:link` | Recreates `.agim/core` link |

**Global options**: `--cwd <dir>`, `--json` (structured output)

---

## Optional Features

| Feature | How to Enable |
|---------|---------------|
| **RAG** (semantic search) | `npm install -g @xenova/transformers && agim rag:rebuild` |
| **Graphify** (code graph) | `npm install -g graphify-cli && agim graph "question"` |

---

## Quick Troubleshooting

| Symptom | Fix |
|---------|-----|
| `agim: command not found` | `npm install -g agim-orchestrator` |
| `agim auto` fails at setup | Run without `--check` or `agim init` |
| `agim auto` fails quality gate | Read the fix list printed at the end |
| Drift AGENTS.md ↔ config | `agim sync` |
| `.agim/core` invalid | `agim core:link` |

Full guide: [docs/TROUBLESHOOTING.md](../../docs/TROUBLESHOOTING.md)

---

## Next Steps

| Goal | Document |
|------|----------|
| Understand architecture and skills | [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) |
| Complete skills reference | [SKILLS-SYSTEM.md](./SKILLS-SYSTEM.md) |
| All CLI commands | [CLI-REFERENCE.md](./CLI-REFERENCE.md) |
| Detailed configuration | [CONFIGURATION.md](./CONFIGURATION.md) |
| Backend/frontend architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Mandatory security | [SECURITY.md](./SECURITY.md) |
| Testing strategy | [TESTING.md](./TESTING.md) |

---

> **AGIM: the grimoire that executes what it teaches.**