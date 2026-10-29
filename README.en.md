# AGIM Documentation

> **AGIM (Agent Grimoire)** — Orchestration engine for AI agents.
> Official documentation for the [`agim-orchestrator`](https://www.npmjs.com/package/agim-orchestrator) package.

---

## 📚 Quick Navigation

| Section | Description |
|---------|-------------|
| [Quick Start](docs/QUICKSTART.md) | Zero to `agim auto` in 5 minutes |
| [Installation](README.md#installation) | `npm install -g agim-orchestrator` |
| [Commands](README.md#commands) | Complete 14-command reference |
| [Configuration](docs/CONFIGURATION.md) | `.agim/config.json` detailed |
| [Validation](README.md#validation) | `agim validate`, `agim doctor` |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and fixes |
| [Architecture](docs/ARQUITETURA.md) | Backend, frontend, database, patterns |
| [Security](docs/SEGURANCA.md) | Auth, authZ, validation, secrets, headers |
| [Testing](docs/TESTES.md) | Pyramid, Vitest, Playwright, coverage |
| [Clean Code](docs/CODIGO-LIMPO.md) | SRP, low coupling, TS strict, Zod |

---

## 🚀 Installation

```bash
# Global (recommended)
npm install -g agim-orchestrator

# Or one-off execution
npx agim-orchestrator init
```

> Requires **Node.js 18+**. Zero required dependencies.

---

## ⚡ Quick Start (1 command)

```bash
cd my-project
agim auto "New feature: users API with CRUD, JWT auth and Zod validation"
```

This runs everything: detects stack → installs kit → syncs AGENTS.md → doctor → plans → validates in parallel → records history.

---

## 📖 Main Commands

| Command | Description |
|---------|-------------|
| `agim auto ["goal"]` | Full automatic flow (recommended) |
| `agim init` | Installs kit, config, AGENTS.md, memoria/ |
| `agim doctor` | Diagnosis: critical / warning / optional |
| `agim validate` | Validates project or AGIM repository |
| `agim interview "goal"` | Classifies, selects skills, writes plan |
| `agim sync` | Updates managed AGENTS.md block |
| `agim audit` | Static audit for insecure patterns |
| `agim status` | Prints `memoria/ESTADO-ATUAL.md` |
| `agim config:validate` | Validates `.agim/config.json` |
| `agim core:link` | Recreates `.agim/core` link |
| `agim rag:rebuild` | Rebuilds RAG index (optional) |
| `agim graph "question"` | Queries code graph via Graphify (optional) |

Global options: `--cwd <dir>`, `--json` (structured output).

---

## 📁 Project Structure Created

```
my-project/
├── AGENTS.md                  # Rules (AGIM block + your notes)
├── .agim/
│   ├── config.json            # Configuration (single source)
│   └── core → ~/.agent-bible  # Shared global kit
├── memoria/                   # Persistent state (6 files)
├── docs/                      # Architecture, security, testing
├── checklists/                # Checklists per phase
├── templates/                 # Plans, ADRs, audits
├── exemplos/                  # Reference implementation
└── .opencode/skills/          # 15 operational skills
```

---

## 🔧 Configuration

Edit `.agim/config.json` (stack, name, conventions) → `agim sync` → `agim config:validate`.

Details in [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

---

## ✅ Validation

```bash
agim validate              # auto-detects context
agim validate --project    # force project validation
agim validate --repo       # force AGIM repo validation
agim validate --json       # structured output
```

Exit codes: `0` = all pass, `1` = critical failure.

---

## 🛠 Optional Features

| Feature | How to enable |
|---------|---------------|
| **RAG** (semantic search) | `npm install -g @xenova/transformers && agim rag:rebuild` |
| **Graphify** (code graph) | `npm install -g graphify-cli && agim graph "question"` |

---

## 🐛 Troubleshooting

| Symptom | Fix |
|---------|-----|
| `agim: command not found` | `npm install -g agim-orchestrator` |
| `agim auto` fails at setup | Run without `--check` or `agim init` |
| `agim auto` fails quality gate | Read the fix list printed at the end |
| Drift AGENTS.md ↔ config | `agim sync` |
| `.agim/core` invalid | `agim core:link` |

Full guide: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

## 📦 Package

- **npm**: [`agim-orchestrator`](https://www.npmjs.com/package/agim-orchestrator)
- **Command**: `agim`
- **Node**: ≥ 18
- **License**: MIT

---

## 🔗 Links

- **Registry**: [npmjs.com/package/agim-orchestrator](https://www.npmjs.com/package/agim-orchestrator)
- **Source code (development)**: [github.com/Brendontailor/AGIM](https://github.com/Brendontailor/AGIM) (private)
- **Issues**: [github.com/Brendontailor/AGIM/issues](https://github.com/Brendontailor/AGIM/issues)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

> **AGIM: the grimoire that executes what it teaches.**