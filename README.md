# AGIM Documentation

> **AGIM (Agent Grimoire)** — Motor de orquestração para agentes de IA.
> Documentação oficial do pacote [`agim-orchestrator`](https://www.npmjs.com/package/agim-orchestrator).

---

## 📚 Navegação Rápida

| Seção | Descrição |
|-------|-----------|
| [Início Rápido](docs/QUICKSTART.md) | Do zero ao `agim auto` em 5 minutos |
| [Instalação](README.md#instalação) | `npm install -g agim-orchestrator` |
| [Comandos](README.md#comandos) | Referência completa de 14 comandos |
| [Configuração](docs/CONFIGURATION.md) | `.agim/config.json` detalhado |
| [Validação](README.md#validação) | `agim validate`, `agim doctor` |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Problemas comuns e soluções |
| [Arquitetura](docs/ARQUITETURA.md) | Backend, frontend, banco, padrões |
| [Segurança](docs/SEGURANCA.md) | Auth, authZ, validação, secrets, headers |
| [Testes](docs/TESTES.md) | Pirâmide, Vitest, Playwright, coverage |
| [Código Limpo](docs/CODIGO-LIMPO.md) | SRP, baixo acoplamento, TS strict, Zod |

---

## 🚀 Instalação

```bash
# Global (recomendado)
npm install -g agim-orchestrator

# Ou execução única
npx agim-orchestrator init
```

> Requer **Node.js 18+**. Zero dependências obrigatórias.

---

## ⚡ Início Rápido (1 comando)

```bash
cd meu-projeto
agim auto "Nova feature: API de usuários com CRUD, auth JWT e validação Zod"
```

Isso executa tudo: detecta stack → instala kit → sincroniza AGENTS.md → doctor → planeja → valida em paralelo → registra histórico.

---

## 📖 Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `agim auto ["objetivo"]` | Fluxo automático completo (recomendado) |
| `agim init` | Instala kit, config, AGENTS.md, memoria/ |
| `agim doctor` | Diagnóstico: crítico / aviso / opcional |
| `agim validate` | Valida projeto ou repositório AGIM |
| `agim interview "objetivo"` | Classifica, seleciona skills, grava plano |
| `agim sync` | Atualiza bloco gerenciado do AGENTS.md |
| `agim audit` | Auditoria estática de padrões inseguros |
| `agim status` | Mostra `memoria/ESTADO-ATUAL.md` |
| `agim config:validate` | Valida `.agim/config.json` |
| `agim core:link` | Recria link `.agim/core` |
| `agim rag:rebuild` | Reconstrói índice RAG (opcional) |
| `agim graph "pergunta"` | Consulta grafo via Graphify (opcional) |

Opções globais: `--cwd <dir>`, `--json` (saída estruturada).

---

## 📁 O que é criado no projeto

```
meu-projeto/
├── AGENTS.md                  # Regras (bloco AGIM + suas notas)
├── .agim/
│   ├── config.json            # Configuração (fonte única)
│   └── core → ~/.agent-bible  # Kit global compartilhado
├── memoria/                   # Estado persistente (6 arquivos)
├── docs/                      # Arquitetura, segurança, testes
├── checklists/                # Checklists por fase
├── templates/                 # Planos, ADRs, auditorias
├── exemplos/                  # Implementação de referência
└── .opencode/skills/          # 15 skills operacionais
```

---

## 🔧 Configuração

Edite `.agim/config.json` (stack, nome, convenções) → `agim sync` → `agim config:validate`.

Detalhes em [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

---

## ✅ Validação

```bash
agim validate              # auto-detecta contexto
agim validate --project    # força validação de projeto
agim validate --repo       # força validação do repo AGIM
agim validate --json       # saída estruturada
```

Exit codes: `0` = tudo passa, `1` = falha crítica.

---

## 🛠 Recursos Opcionais

| Recurso | Como ativar |
|---------|-------------|
| **RAG** (busca semântica) | `npm install -g @xenova/transformers && agim rag:rebuild` |
| **Graphify** (grafo de código) | `npm install -g graphify-cli && agim graph "pergunta"` |

---

## 🐛 Troubleshooting

| Sintoma | Solução |
|---------|---------|
| `agim: command not found` | `npm install -g agim-orchestrator` |
| `agim auto` falha no setup | Rode sem `--check` ou `agim init` |
| `agim auto` falha no quality gate | Leia a lista de correções impressa |
| Drift AGENTS.md ↔ config | `agim sync` |
| `.agim/core` inválido | `agim core:link` |

Guia completo: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

---

## 📦 Pacote

- **npm**: [`agim-orchestrator`](https://www.npmjs.com/package/agim-orchestrator)
- **Comando**: `agim`
- **Node**: ≥ 18
- **Licença**: MIT

---

## 🔗 Links

- **Registry**: [npmjs.com/package/agim-orchestrator](https://www.npmjs.com/package/agim-orchestrator)
- **Código fonte (desenvolvimento)**: [github.com/Brendontailor/AGIM](https://github.com/Brendontailor/AGIM) (privado)
- **Issues**: [github.com/Brendontailor/AGIM/issues](https://github.com/Brendontailor/AGIM/issues)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

> **AGIM: o grimório que executa o que ensina.**