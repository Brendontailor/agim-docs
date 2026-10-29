# Início Rápido — AGIM

> Do zero ao `agim auto` em 5 minutos.

---

## Pré-requisitos

```bash
# Verificar versões
node --version    # ≥ 18
npm --version     # ≥ 9
git --version     # ≥ 2.30
```

---

## 1. Instalação (30 segundos)

```bash
# Global (recomendado)
npm install -g agim-orchestrator

# Ou execução única (sem instalar globalmente)
npx agim-orchestrator init
```

---

## 2. Inicializar Projeto (1 minuto)

```bash
cd meu-projeto-existente
# OU
mkdir meu-novo-projeto && cd meu-novo-projeto

agim init
```

**O que acontece**:
- Detecta stack (Node/TypeScript, React, Python, etc.)
- Instala kit AGIM (docs, checklists, templates, skills)
- Cria `.agim/config.json` (configuração única)
- Cria symlink `.agim/core → ~/.agent-bible` (kit global compartilhado)
- Gera `AGENTS.md` com bloco gerenciado AGIM
- Cria `memoria/` (6 arquivos de estado persistente)
- Copia 15 skills para `.opencode/skills/`
- Informa quantas skills foram copiadas

---

## 3. Validar Setup (10 segundos)

```bash
agim validate
# Exit 0 = tudo OK, Exit 1 = falha crítica
```

**Verifica**:
- Estrutura de diretórios
- `.agim/config.json` válido (Zod + fail fast)
- `AGENTS.md` sincronizado
- `memoria/` existe
- Skills instaladas (kit completo)
- Nenhum segredo exposto
- Sintaxe Markdown válida

---

## 4. Health Check (5 segundos)

```bash
agim doctor
```

**Diagnostica**:
- ✅ Críticos (bloqueiam)
- ⚠️ Avisos (recomendados)
- ℹ️ Opcionais (nice to have)

Inclui: Node version, Git status, Config válido, RAG index, Skills, MCPs, Dependências

---

## 5. Primeira Feature Automática (2–5 minutos)

```bash
agim auto "Nova feature: API de usuários com CRUD, auth JWT e validação Zod"
```

**O que executa automaticamente**:
1. **Detecta stack** — Analisa package.json, tsconfig, estrutura
2. **Instala/Repara kit** — Garante docs, skills, config atualizados
3. **Sincroniza AGENTS.md** — Atualiza bloco gerenciado
4. **Doctor** — Diagnóstico completo
5. **Entrevista** — Classifica tarefa, seleciona skills, grava plano
6. **Planeja** — `planejamento-de-tarefas` cria plano com critérios
7. **Valida em paralelo** — Rodando testes, build, lint, type-check, audit
8. **Registra histórico** — Atualiza `memoria/` completo

---

## 6. Ver Status (Instantâneo)

```bash
agim status
# Ou JSON:
agim status --json
```

**Mostra**: Fase atual, última validação, próxima etapa, arquivos, testes, problemas, bloqueios, decisões, pendências

---

## 7. Continuar Sessão Posterior

```bash
# Em nova sessão/terminal:
cd meu-projeto
agim status           # Vê onde parou
agim auto "continua"  # Retoma automaticamente
```

**O AGIM lê `memoria/` e retoma exatamente onde parou** — sem repetir tarefas concluídas.

---

## Fluxo Resumido (Cheatsheet)

```bash
# Setup inicial (uma vez por projeto)
agim init
agim validate
agim doctor

# Desenvolvimento diário
agim auto "sua feature ou bugfix"
agim status           # Checkpoint rápido
agim validate         # Quality gate manual
agim audit            # Auditoria segurança

# Manutenção
agim sync             # Atualiza bloco AGENTS.md
agim config:validate  # Valida só config
agim core:link        # Reconstrói link .agim/core
agim rag:rebuild      # Reconstrói índice RAG (opcional)
agim graph "pergunta" # Consulta grafo código (opcional)
```

---

## Estrutura Criada

```
meu-projeto/
├── AGENTS.md                  # Regras (bloco AGIM + suas notas)
├── .agim/
│   ├── config.json            # Configuração (fonte única)
│   └── core → ~/.agent-bible  # Kit global compartilhado
├── memoria/                   # Estado persistente (6 arquivos)
│   ├── ESTADO-ATUAL.md
│   ├── PLANO-DE-EXECUCAO.md
│   ├── HISTORICO-DE-EXECUCAO.md
│   ├── DECISOES.md
│   ├── PENDENCIAS.md
│   └── PROXIMO-PASSO.md
├── docs/                      # Arquitetura, segurança, testes
├── checklists/                # 9 checklists por fase
├── templates/                 # 12 templates (planos, ADRs, auditorias)
├── exemplos/                  # Implementação de referência
└── .opencode/skills/          # 15 skills operacionais
```

---

## Comandos Essenciais

| Comando | Para que serve |
|---------|----------------|
| `agim auto "objetivo"` | **Fluxo completo automático** (recomendado) |
| `agim init` | Instala kit, config, AGENTS.md, memoria/ |
| `agim validate` | Valida projeto ou repo AGIM |
| `agim doctor` | Diagnóstico: crítico / aviso / opcional |
| `agim status` | Mostra `memoria/ESTADO-ATUAL.md` |
| `agim interview "objetivo"` | Classifica, seleciona skills, grava plano |
| `agim sync` | Atualiza bloco gerenciado do AGENTS.md |
| `agim audit` | Auditoria estática de padrões inseguros |
| `agim config:validate` | Valida `.agim/config.json` |
| `agim core:link` | Recria link `.agim/core` |

**Opções globais**: `--cwd <dir>`, `--json` (saída estruturada)

---

## Recursos Opcionais

| Recurso | Como Ativar |
|---------|-------------|
| **RAG** (busca semântica) | `npm install -g @xenova/transformers && agim rag:rebuild` |
| **Graphify** (grafo de código) | `npm install -g graphify-cli && agim graph "pergunta"` |

---

## Troubleshooting Rápido

| Sintoma | Solução |
|---------|---------|
| `agim: command not found` | `npm install -g agim-orchestrator` |
| `agim auto` falha no setup | Rode sem `--check` ou `agim init` |
| `agim auto` falha no quality gate | Leia a lista de correções impressa no final |
| Drift AGENTS.md ↔ config | `agim sync` |
| `.agim/core` inválido | `agim core:link` |

Guia completo: [docs/TROUBLESHOOTING.md](../../docs/TROUBLESHOOTING.md)

---

## Próximos Passos

| Objetivo | Documento |
|----------|-----------|
| Entender arquitetura e skills | [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) |
| Referência completa de skills | [SKILLS-SYSTEM.md](./SKILLS-SYSTEM.md) |
| Todos comandos CLI | [CLI-REFERENCE.md](./CLI-REFERENCE.md) |
| Configuração detalhada | [CONFIGURATION.md](./CONFIGURATION.md) |
| Arquitetura backend/frontend | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Segurança obrigatória | [SECURITY.md](./SECURITY.md) |
| Estratégia de testes | [TESTING.md](./TESTING.md) |

---

> **AGIM: o grimório que executa o que ensina.**