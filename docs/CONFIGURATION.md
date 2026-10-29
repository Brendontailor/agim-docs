# Configuração AGIM — `.agim/config.json`

> O `config.json` é a fonte única de verdade do projeto.
> O bloco gerenciado do `AGENTS.md` é gerado a partir dele por `agim sync`.

A validação é feita por código próprio (`scripts/config-schema.cjs`), **sem
dependências externas**. Não há Zod, não há instalação extra.

---

## Schema completo

```json
{
  "version": "1.1.0",
  "project": {
    "name": "meu-projeto",
    "description": "API de usuários",
    "packageManager": "npm",
    "stack": {
      "frontend": { "framework": "react", "bundler": "vite", "language": "typescript" },
      "backend": { "framework": "express", "orm": "prisma", "language": "typescript" },
      "database": { "provider": "postgresql", "orm": "prisma", "version": "15+" }
    },
    "conventions": {
      "naming": "pt-br-domain",
      "commits": "conventional",
      "branches": "feature/fix/refactor/chore"
    }
  },
  "skills": { "enabled": "all", "autoScale": true, "maxAgents": 6 },
  "qualityGates": {
    "coverage": { "lines": 80, "branches": 70, "functions": 80 },
    "typescript": "strict",
    "lint": "error",
    "securityAudit": true
  },
  "integrations": { "github": true, "context7": true, "graphify": true }
}
```

Esse é exatamente o formato gerado por `agim init`.

---

## Seções obrigatórias

`config.json` precisa ter estas cinco chaves:

`version` · `project` · `skills` · `qualityGates` · `integrations`

Ausência de qualquer uma = erro de validação.

---

## Campos

### `version`

| Tipo | Obrigatório | Exemplo |
|------|-------------|---------|
| string | sim | `"1.1.0"` |

Precisa ser string. Versões `1.0.x` geram aviso para rodar `agim sync`.

### `project`

| Campo | Tipo | Obrigatório | Padrão |
|-------|------|-------------|--------|
| `name` | string | **sim** | `basename` do diretório |
| `description` | string | não | `"Projeto configurado com AGIM"` |
| `packageManager` | string | não | detectado (`npm`, `pnpm`, `yarn`, `bun`) |
| `stack` | objeto | não | detectado automaticamente |
| `conventions` | objeto | não | `pt-br-domain` / `conventional` |

Valores usuais de `project.stack`:

| Seção | Campos | Valores comuns |
|-------|--------|----------------|
| `frontend` | `framework`, `bundler`, `language` | `react`, `nextjs`, `vue`, `svelte`, `astro`, `none` / `vite`, `webpack`, `nextjs`, `none` / `typescript`, `javascript` |
| `backend` | `framework`, `orm`, `language` | `express`, `fastify`, `nestjs`, `hono`, `koa`, `none` / `prisma`, `drizzle`, `typeorm`, `mongoose`, `none` |
| `database` | `provider`, `orm`, `version` | `postgresql`, `mysql`, `sqlite`, `mongodb`, `none` / `prisma`, `drizzle`, `typeorm`, `mongoose`, `none` / `"15+"` |

Esses valores são convenção para o agente — o validador **não** restringe a uma
lista fechada, então stacks fora da lista não quebram o `agim validate`.

### `skills`

| Campo | Tipo | Regra |
|-------|------|-------|
| `enabled` | `"all"` ou array | `"all"` habilita as 15 skills |
| `autoScale` | boolean | liga/desliga o escalonamento de sub-agentes |
| `maxAgents` | inteiro | **1 a 16** |

`autoScale` depende de `memoria/RECURSOS.json` (gerado por
`scripts/detect-resources.cjs`) e de `SUB-AGENTES-AGIM.md`. Em máquinas
limitadas o AGIM cai para execução sequencial.

### `qualityGates`

| Campo | Tipo | Regra |
|-------|------|-------|
| `coverage.lines` | número | 0–100 |
| `coverage.branches` | número | 0–100 |
| `coverage.functions` | número | 0–100 |
| `typescript` | `"strict"` ou `"basic"` | — |
| `lint` | `"error"`, `"warn"`, `"off"` | — |
| `securityAudit` | boolean | — |

Valores de cobertura fora de 0–100 são rejeitados.

### `integrations`

| Campo | Tipo | Padrão |
|-------|------|--------|
| `github` | boolean | `true` |
| `context7` | boolean | `true` |
| `graphify` | boolean | `true` |

São intenções declaradas. Nenhuma delas é obrigatória para o AGIM funcionar.

---

## Sincronização com o `AGENTS.md`

O `AGENTS.md` gerado tem duas partes:

```markdown
<!-- AGIM:CONTEXT:START -->
... bloco gerenciado (reescrito por `agim sync`) ...
<!-- AGIM:CONTEXT:END -->

## Notas do projeto
... conteúdo seu, nunca tocado ...
```

Regras:

1. `agim sync` reescreve **apenas** o bloco entre os marcadores.
2. Se o `AGENTS.md` não tiver os marcadores, nada é alterado — a menos que você
   passe `--force`, que substitui o arquivo inteiro **criando backup**.
3. `agim sync --check` não escreve nada: retorna exit code `1` se houver drift.

```bash
agim sync            # aplica
agim sync --check    # verifica (CI)
agim sync --force    # substitui arquivo sem marcadores (com backup)
```

O bloco gerado contém: contexto do projeto (nome, stack, convenções),
estrutura instalada e o protocolo operacional do agente (início de sessão,
regras de execução, sub-agentes, encerramento).

---

## Validação

```bash
agim config:validate          # humano
agim config:validate --json   # estruturado
```

Exit code `0` quando válido, `1` quando inválido ou ausente.

Erros comuns:

| Mensagem | Causa | Correção |
|----------|-------|----------|
| `.agim/config.json não encontrado` | Projeto não inicializado | `agim init` |
| `JSON inválido: ...` | Vírgula sobrando, chave sem aspas | Corrija o JSON |
| `seção obrigatória ausente: skills` | Chave removida | Restaure a seção |
| `project.name é obrigatório (string)` | Nome vazio ou numérico | Use string não vazia |
| `skills.maxAgents deve ser inteiro entre 1 e 16` | Valor fora da faixa | Ajuste para 1–16 |
| `qualityGates.coverage.lines deve ser número entre 0 e 100` | Percentual inválido | Ajuste para 0–100 |

---

## Exemplos por stack

**React + Vite + Express + Prisma + PostgreSQL**

```json
"stack": {
  "frontend": { "framework": "react", "bundler": "vite", "language": "typescript" },
  "backend": { "framework": "express", "orm": "prisma", "language": "typescript" },
  "database": { "provider": "postgresql", "orm": "prisma", "version": "15+" }
}
```

**Next.js fullstack**

```json
"stack": {
  "frontend": { "framework": "nextjs", "bundler": "nextjs", "language": "typescript" },
  "backend": { "framework": "nextjs", "orm": "prisma", "language": "typescript" },
  "database": { "provider": "postgresql", "orm": "prisma", "version": "15+" }
}
```

**API apenas**

```json
"stack": {
  "frontend": { "framework": "none", "bundler": "none", "language": "typescript" },
  "backend": { "framework": "fastify", "orm": "drizzle", "language": "typescript" },
  "database": { "provider": "postgresql", "orm": "drizzle", "version": "15+" }
}
```

**Projeto não-Node** (dados, infra, docs)

```json
"stack": {
  "frontend": { "framework": "none", "bundler": "none", "language": "none" },
  "backend": { "framework": "none", "orm": "none", "language": "none" },
  "database": { "provider": "none", "orm": "none", "version": "none" }
}
```

---

## Referência de implementação

- Validador: `scripts/config-schema.cjs` (`validateConfig`, `validate`, `readConfig`)
- Geração do bloco: `scripts/lib/agents-md.cjs` (`buildContext`, `replaceContext`)
- Comando de sync: `scripts/sync-agents-md.cjs`
