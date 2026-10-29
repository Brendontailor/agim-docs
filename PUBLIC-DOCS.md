# AGIM Documentation Hub

> **AGIM (Agent Grimoire)** — The orchestration engine for AI agents that executes what it teaches.

---

## 📚 Documentation Index

| Document | Description | Audience |
|----------|-------------|----------|
| [OVERVIEW.md](./PUBLIC/OVERVIEW.md) | What is AGIM, core concepts, philosophy | All |
| [WHY-AGIM.md](./PUBLIC/WHY-AGIM.md) | Benefits, metrics, ROI, comparison | Decision makers, leads |
| [HOW-IT-WORKS.md](./PUBLIC/HOW-IT-WORKS.md) | Architecture, orchestration flow, skills system | Developers, architects |
| [SKILLS-SYSTEM.md](./PUBLIC/SKILLS-SYSTEM.md) | Complete skills reference, when to use each | AI agent operators |
| [QUICKSTART.md](./PUBLIC/QUICKSTART.md) | Zero to `agim auto` in 5 minutes | New users |
| [CLI-REFERENCE.md](./PUBLIC/CLI-REFERENCE.md) | All 14 commands with examples | Daily users |
| [CONFIGURATION.md](./PUBLIC/CONFIGURATION.md) | `.agim/config.json` complete reference | Project maintainers |
| [ARCHITECTURE.md](./PUBLIC/ARCHITECTURE.md) | Backend, frontend, database patterns | Architects, seniors |
| [SECURITY.md](./PUBLIC/SECURITY.md) | Auth, authZ, validation, secrets, headers | Security-conscious teams |
| [TESTING.md](./PUBLIC/TESTING.md) | Test pyramid, Vitest, Playwright, coverage | QA, developers |
| [EXAMPLES.md](./PUBLIC/EXAMPLES.md) | Real-world use cases and patterns | Practitioners |
| [FAQ.md](./PUBLIC/FAQ.md) | Common questions and troubleshooting | All |
| [CHANGELOG.md](./CHANGELOG.md) | Version history | All |

---

## 🌐 Language Versions

| Language | Entry Point |
|----------|-------------|
| **Português (PT-BR)** | [PUBLIC/PT/OVERVIEW.md](./PUBLIC/PT/OVERVIEW.md) |
| **English (EN)** | [PUBLIC/EN/OVERVIEW.md](./PUBLIC/EN/OVERVIEW.md) |

---

## 🚀 Quick Links

| Action | Command |
|--------|---------|
| **Install** | `npm install -g agim-orchestrator` |
| **Quick Start** | `cd my-project && agim auto "feature description"` |
| **Validate Setup** | `agim validate` |
| **Health Check** | `agim doctor` |
| **View Status** | `agim status` |

---

## 📦 Package Info

- **npm**: [`agim-orchestrator`](https://www.npmjs.com/package/agim-orchestrator)
- **Command**: `agim`
- **Node**: ≥ 18
- **License**: MIT
- **Registry**: [npmjs.com/package/agim-orchestrator](https://www.npmjs.com/package/agim-orchestrator)

---

## 🏗 What You Get (Project Structure)

```
my-project/
├── AGENTS.md                  # Operational rules (AGIM block + your notes)
├── .agim/
│   ├── config.json            # Configuration (single source of truth)
│   └── core → ~/.agent-bible  # Shared global kit (symlink)
├── memoria/                   # Persistent state (6 files)
│   ├── ESTADO-ATUAL.md        # Current phase, validation, next step
│   ├── PLANO-DE-EXECUCAO.md   # Execution plan with task status
│   ├── HISTORICO-DE-EXECUCAO.md # Actions, commands, results, fixes
│   ├── DECISOES.md            # Technical decisions (ADRs)
│   ├── PENDENCIAS.md          # Open items with priority/impact
│   └── PROXIMO-PASSO.md       # Executable resume instructions
├── docs/                      # Architecture, security, testing guides
├── checklists/                # 9 mandatory checklists per phase
├── templates/                 # 12 reusable templates (plans, ADRs, audits)
├── exemplos/                  # Reference implementation
└── .opencode/skills/          # 15 operational skills
```

---

## 🎯 Core Philosophy

> **"The grimoire that executes what it teaches."**

AGIM is not just documentation — it's an **executable knowledge system**. Every pattern, rule, and best practice in the documentation has a corresponding skill that can be invoked to apply it automatically. The system:

1. **Understands** your goal through structured interview
2. **Classifies** the task (domain, type, complexity, risk, scope)
3. **Selects** the minimal necessary skills/MCPs/tools
4. **Plans** proportional execution with acceptance criteria
5. **Executes** with verification at each step
6. **Records** complete continuity for future sessions

---

## 📊 Key Metrics & Results

| Metric | Value | Source |
|--------|-------|--------|
| **Setup time** | < 2 min (cold) / < 30s (warm) | `agim init` benchmark |
| **Auto-flow duration** | 30s – 5 min | `agim auto` telemetry |
| **Skills available** | 14 (12 core + 2 extended) | SKILLS-REFERENCE.md |
| **Checklists** | 9 mandatory phases | checklists/ |
| **Templates** | 12 reusable | templates/ |
| **Architecture layers** | 9 backend + 6 frontend | ARQUITETURA.md |
| **Security risk matrix** | 15 categories | SEGURANCA.md |
| **Test scenarios** | 50+ detailed | ROTEIRO-DE-TESTES.md |
| **Bundle size** | ~27KB docs / ~2KB RAG query | bible-rag-search |

---

## 🔗 Related Repositories

| Repository | Purpose | Access |
|------------|---------|--------|
| **agim-orchestrator** (npm) | CLI package, public | Public |
| **AGIM** (GitHub) | Development source | Private |
| **agent-bible** (global) | Shared core kit (`~/.agent-bible`) | Installed via `agim init` |

---

## 🤝 Contributing to Documentation

This public documentation is maintained in the `agim-docs` repository. To suggest improvements:

1. Open an issue at [github.com/Brendontailor/AGIM/issues](https://github.com/Brendontailor/AGIM/issues)
2. Tag with `documentation`
3. Specify: language (PT/EN), section, suggested change

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

> **Start here:** [Quick Start →](./PUBLIC/QUICKSTART.md) | [Why AGIM? →](./PUBLIC/WHY-AGIM.md) | [Skills System →](./PUBLIC/SKILLS-SYSTEM.md)