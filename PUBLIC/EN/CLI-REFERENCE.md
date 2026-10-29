# CLI Reference — AGIM

> All 14 commands with examples and options.

---

## Quick Reference Table

| Command | Description | Primary Use |
|---------|-------------|-------------|
| `agim auto ["goal"]` | Full automatic flow | Daily development |
| `agim init` | Installs kit, config, AGENTS.md, memoria/ | Initial setup |
| `agim validate` | Validates project or AGIM repo | Quality gate, CI |
| `agim doctor` | Diagnosis: critical / warning / optional | Health check |
| `agim status` | Shows `memoria/ESTADO-ATUAL.md` | Quick checkpoint |
| `agim interview "goal"` | Classifies, selects skills, writes plan | Explicit planning |
| `agim sync` | Updates managed AGENTS.md block | After manual edit |
| `agim audit` | Static audit for insecure patterns | Pre-deploy, security |
| `agim config:validate` | Validates `.agim/config.json` | Config validation |
| `agim core:link` | Recreates `.agim/core` link | Broken link |
| `agim rag:rebuild` | Rebuilds RAG index | Semantic search |
| `agim graph "question"` | Queries code graph via Graphify | Code analysis |
| `agim --version` | Shows version | Verification |
| `agim --help` | General help | Quick reference |

---

## Global Options (All Commands)

| Option | Description |
|--------|-------------|
| `--cwd <dir>` | Working directory (default: current cwd) |
| `--json` | Structured JSON output (for automation) |
| `--help` | Command-specific help |

---

## Command Details

### `agim auto ["goal"]`

**Full automatic flow** — Recommended for daily development.

```bash
# With goal (runs everything)
agim auto "New feature: users API with CRUD, JWT auth and Zod validation"

# Without goal (resumes from last point)
agim auto

# With specific directory
agim auto "Bug fix: login fails" --cwd /path/to/project

# JSON output for automation
agim auto "Feature" --json
```

**Executes in sequence**:
1. Detects stack → installs/repairs kit
2. `agim sync` — Syncs AGENTS.md
3. `agim doctor` — Complete diagnosis
4. `agim interview` — Classifies + plans
5. `agim validate` — Parallel quality gate (tests, build, lint, type-check, audit)
6. Records everything in `memoria/`

**Exit codes**: `0` = success, `1` = failure at any stage

---

### `agim init`

**Installs complete AGIM kit** in current project.

```bash
# New or existing project
agim init

# Force reinstall (overwrites config, preserves user AGENTS.md)
agim init --force

# JSON output
agim init --json
```

**Creates/Updates**:
- `.agim/config.json` (config with defaults)
- `.agim/core → ~/.agent-bible` (symlink to global kit)
- `AGENTS.md` (managed block + preserves user notes)
- `memoria/` (6 structured empty files)
- `docs/`, `checklists/`, `templates/`, `exemplos/`
- `.opencode/skills/` (15 skills)
- `.gitignore` adds `*.agim-backup-*`

**Note**: `--force` **does NOT discard** user's `AGENTS.md` — managed block added at top, existing content preserved.

---

### `agim validate`

**Validates project or AGIM repository**.

```bash
# Auto-detects context (project vs AGIM repo)
agim validate

# Force project validation
agim validate --project

# Force AGIM repo validation
agim validate --repo

# JSON output
agim validate --json
```

**Project Validations**:
- Required directory structure
- `.agim/config.json` exists and valid (Zod)
- `AGENTS.md` synced with config
- `memoria/` exists with 6 files
- Skills installed (complete kit — 15 skills)
- No secrets in tracked files
- Valid Markdown syntax
- Internal links working

**AGIM Repo Validations**:
- Package.json name/version correct
- All commands packaged (`scripts/` in `files`)
- Complete skills (15)
- Documentation intact

**Exit codes**: `0` = all pass, `1` = critical failure

---

### `agim doctor`

**Complete diagnosis** of environment and project.

```bash
agim doctor
agim doctor --json
```

**Categories**:

| Category | Examples |
|----------|----------|
| **Critical** | Node < 18, Git not initialized, invalid config, missing skills |
| **Warnings** | Outdated dependencies, missing RAG index, low coverage |
| **Optional** | MCPs not configured, Graphify not installed, global UI/UX skills |

**Specific Checks**:
- Node.js version ≥ 18
- Valid Git repository
- `.agim/config.json` parsable + valid
- `AGENTS.md` synced
- `memoria/` 6 files present
- 15 skills in `.opencode/skills/`
- 7 global UI/UX skills available
- Context7 MCP configured (`CONTEXT7_API_KEY`)
- GitHub MCP configured (`GITHUB_TOKEN`)
- Browser/Playwright MCP configured
- RAG index: project (present/absent) vs global (exists/not this project)
- `npm audit` — critical/high vulnerabilities

---

### `agim status`

**Shows current project state** (reads `memoria/ESTADO-ATUAL.md`).

```bash
agim status
agim status --json
```

**Output Includes**:
- Current phase
- Last validation (timestamp + result)
- Next planned step
- Recently modified files
- Tests run (pass/fail)
- Identified problems
- Active blockers
- Recent decisions (IDs)
- Open pending items (IDs + priority)

**Useful for**: Quick checkpoint, session resumption, CI status

---

### `agim interview "goal"`

**Classifies goal, selects skills, writes plan** — without executing.

```bash
agim interview "New payments API with idempotency"
agim interview "Refactor legacy-auth module" --json
```

**Does**:
1. Adaptive interview (critical questions only if gaps)
2. Classifies: domain/type/complexity/risk/scope
3. Selects minimal skills via matrix
4. Writes `memoria/PLANO-DE-EXECUCAO.md`
5. Updates `memoria/ESTADO-ATUAL.md` + `PROXIMO-PASSO.md`
6. Returns exit 1 if setup missing (previously gave misleading "next steps")

**Exit codes**: `0` = plan written, `1` = incomplete setup

---

### `agim sync`

**Updates managed AGENTS.md block** from `.agim/config.json`.

```bash
agim sync
agim sync --force  # Forces rewrite (preserves user notes)
```

**Managed Block** (markers):
```markdown
<!-- AGIM:MANAGED:START -->
# AGIM Instructions (auto-generated)
...
<!-- AGIM:MANAGED:END -->
```

**Behavior**:
- `--force`: Rewrites managed block, **keeps** user content outside markers
- Without `--force`: Updates only if config changed
- Adds at top of file if not exists

---

### `agim audit`

**Static security audit** — 15 risk categories.

```bash
agim audit
agim audit --json
```

**Scans**:
- `eval()`, `Function()`, `setTimeout(string)`
- `.innerHTML =`, `.outerHTML =`, `dangerouslySetInnerHTML`
- SQL concatenation: `+ variable`, `+ 'str'`, `` `${...}` ``
- Hardcoded secrets: passwords, tokens, API keys (`AKIA...`, `sk_...`, etc.)
- Sensitive `.env`, `.yaml`, `.yml`, `.json` files
- OWASP Top 10 patterns

**Handling**:
- "0 files analyzed" = **warning** (never PASS)
- Ignores temporary test files (`test-regex.cjs`, etc.)
- Exit 1 if any critical found

---

### `agim config:validate`

**Validates only `.agim/config.json`** with Zod (fail fast).

```bash
agim config:validate
agim config:validate --json
```

**Validates**:
- Syntactically valid JSON (including UTF-8 BOM)
- Required fields present
- Valid enums: `qualityGates.typescript` (`strict`|`relaxed`), `qualityGates.lint` (`standard`|`verbose`), `conventions.commits` (`conventional`|`custom`)
- Numeric ranges: `coverage` 0-100, `thresholds` positive
- Valid URLs (`DATABASE_URL`, `CORS_ORIGIN`)
- Required non-empty strings

---

### `agim core:link`

**Recreates symlink `.agim/core → ~/.agent-bible`**.

```bash
agim core:link
```

**When to use**:
- Broken/corrupted link
- After global kit update (`~/.agent-bible`)
- Machine/directory change

---

### `agim rag:rebuild`

**Rebuilds RAG index** (semantic search) for project.

```bash
agim rag:rebuild
```

**Prerequisite**:
```bash
npm install -g @xenova/transformers
```

**Creates**: `.agim/rag-index/` with vector embeddings

**Used by**: `bible-rag-search` skill

---

### `agim graph "question"`

**Queries code graph** via Graphify (natural queries).

```bash
agim graph "which files depend on users.service?"
agim graph "show authentication flow"
```

**Prerequisite**:
```bash
npm install -g graphify-cli
graphify build  # In project directory
```

**Returns**: Relevant subgraph (~2KB vs 200KB full)

**Used by**: `graphify-integration` skill

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Complete success |
| `1` | Critical failure (quality gate, validation, audit) |
| `2` | Usage error (invalid arguments) |
| `130` | Interrupted (Ctrl+C) |

---

## Common Usage Examples

### Initial Setup
```bash
mkdir my-project && cd my-project
agim init
agim validate
agim doctor
```

### New Feature
```bash
agim auto "Complete product CRUD with categories"
```

### Bug Fix
```bash
agim auto "Fix: refresh token not rotating correctly"
```

### Refactoring
```bash
agim interview "Refactor payment-service to use repository pattern"
# Review plan in memoria/PLANO-DE-EXECUCAO.md
agim auto "continue"
```

### Pre-Deploy
```bash
agim validate
agim audit
agim status --json  # For CI
```

### CI/CD (GitHub Actions)
```yaml
- name: AGIM Validate
  run: agim validate --json
  
- name: AGIM Audit
  run: agim audit --json
  
- name: AGIM Status
  run: agim status --json
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CONTEXT7_API_KEY` | No | API key for Context7 (versioned docs) |
| `GITHUB_TOKEN` | No | GitHub token for GitHub MCP |
| `AGIM_CONFIG_PATH` | No | Custom path to `.agim/config.json` |

---

## Configuration Files

### `.agim/config.json` (Single Source)
See [CONFIGURATION.md](./CONFIGURATION.md) for complete reference.

### `AGENTS.md` (Operational Instructions)
AGIM managed block + your free notes.

### `memoria/` (Persistent State)
6 files — do not edit manually (use skills/CLI).

---

## Next Documents

| Document | Focus |
|----------|-------|
| [CONFIGURATION.md](./CONFIGURATION.md) | `.agim/config.json` complete reference |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 9 backend + 6 frontend layers |
| [SECURITY.md](./SECURITY.md) | Mandatory security |
| [TESTING.md](./TESTING.md) | Testing strategy |