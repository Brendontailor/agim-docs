# Quickstart AGIM — 5 minutos

> Objetivo: sair do zero até `agim validate` passando, com memória do projeto criada.

---

## Caminho curto: um comando

```bash
npm install -g agim-orchestrator
cd meu-projeto
agim auto "Nova feature: API de usuários com CRUD, auth JWT e validação Zod"
```

Isso executa, em sequência: detecção de stack e recursos → leitura do config →
auto-reparo do setup → sincronização do `AGENTS.md` → `doctor` → plano →
verificações paralelas → `validate` → registro no histórico.

Se você só quer **verificar** o projeto (CI, pre-commit), sem escrever nada:

```bash
agim auto --check
```

As seções abaixo mostram o mesmo caminho passo a passo, para quando você quiser
controle manual de cada etapa.

---

## 1. Instalar

```bash
npm install -g agim-orchestrator
```

Sem instalação global:

```bash
npx agim-orchestrator init
```

Requer Node.js 18+.

---

## 2. Inicializar o projeto

```bash
cd meu-projeto
agim init
```

Saída esperada (resumida):

```
.agim/config.json: CRIADO
Kit:               70 arquivo(s) copiado(s), 0 preservado(s)
Skills:            15 presente(s), 15 copiada(s) nesta execução
AGENTS.md:         CRIADO
memoria/:          6/6 arquivo(s) criado(s)
Core link:         OK (junction)
```

O que foi criado:

| Caminho | Para que serve |
|---------|----------------|
| `AGENTS.md` | Regras do projeto para o agente (bloco gerenciado + suas notas) |
| `.agim/config.json` | Fonte única de verdade (stack, skills, quality gates) |
| `.agim/core` | Link para `~/.agent-bible` (kit compartilhado) |
| `memoria/` | 6 arquivos de continuidade |
| `docs/`, `checklists/`, `templates/`, `exemplos/` | Material de referência |
| `.opencode/skills/` | 15 skills operacionais |

Rodar `agim init` de novo **não sobrescreve** nada. Com `--force`, um backup
`.agim-backup-<data>` é criado antes de qualquer substituição.

---

## 3. Conferir o setup

```bash
agim doctor
```

`doctor` mostra 10 checagens com três níveis: **crítico** (bloqueia), **aviso**
(recomendado) e **opcional** (RAG/Graphify). Exit code `1` só quando há falha crítica.

```bash
agim doctor --json    # saída estruturada
```

---

## 4. Validar

```bash
agim validate
```

Em um projeto, verifica:

- `AGENTS.md` com bloco `AGIM:CONTEXT` gerenciado
- `.agim/config.json` válido
- `memoria/` com os 6 arquivos
- skills instaladas
- core link
- padrões inseguros no código

Dentro do repositório do AGIM, o mesmo comando valida a estrutura do repo
(63 itens), os 11 exemplos, links Markdown, auditoria de segurança e segredos no Git.

---

## 5. Definir o objetivo

```bash
agim interview "Nova feature: API de usuários com CRUD, auth JWT e validação Zod"
```

A entrevista:

1. detecta a stack do projeto
2. verifica se o setup está presente
3. classifica a tarefa (domínio, tipo, complexidade, risco, escopo)
4. seleciona as skills necessárias
5. grava o plano em `memoria/PLANO-DE-EXECUCAO.md` (com backup do anterior)

---

## 6. Fluxo do dia a dia

```bash
agim auto                   # fluxo completo: repara, sincroniza, valida e registra
agim auto --check           # só verifica (não escreve) — ideal para CI
agim status                 # onde estamos (ESTADO-ATUAL.md)
agim sync                   # config.json → AGENTS.md
agim sync --check           # falha se houver divergência
agim audit                  # padrões inseguros no código
agim validate               # quality gate
```

Editar configuração:

```bash
# 1. edite .agim/config.json
# 2. aplique
agim sync
# 3. confirme
agim config:validate
agim sync --check
```

---

## 7. Opcionais

```bash
# RAG (busca semântica na documentação)
npm install -g @xenova/transformers
agim rag:rebuild

# Graphify (grafo de código)
npm install -g graphify-cli
graphify build .
agim graph "onde fica a autenticação?"
```

Nenhum dos dois é necessário. Se faltarem, o AGIM avisa e segue.

---

## Estrutura final

```
meu-projeto/
├── AGENTS.md
├── .agim/
│   ├── config.json
│   └── core → ~/.agent-bible
├── memoria/
│   ├── ESTADO-ATUAL.md
│   ├── PLANO-DE-EXECUCAO.md
│   ├── HISTORICO-DE-EXECUCAO.md
│   ├── DECISOES.md
│   ├── PENDENCIAS.md
│   └── PROXIMO-PASSO.md
├── docs/  checklists/  templates/  exemplos/
└── .opencode/skills/
```

---

## Próximos passos

- Configuração detalhada: [CONFIGURATION.md](CONFIGURATION.md)
- Problemas comuns: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Regras de operação: [AGENTS.md](../AGENTS.md)
