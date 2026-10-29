# Configuração — AGIM

> Referência completa do `.agim/config.json` — fonte única de verdade.

---

## Estrutura Completa

```json
{
  "project": {
    "name": "meu-projeto",
    "description": "Descrição do projeto",
    "stack": "node-typescript",
    "framework": "express-react",
    "language": "pt-BR"
  },
  "qualityGates": {
    "typescript": "strict",
    "lint": "standard",
    "coverage": {
      "unit": 80,
      "integration": 60,
      "e2e": 100
    },
    "thresholds": {
      "buildTimeMs": 60000,
      "testTimeMs": 120000
    }
  },
  "conventions": {
    "commits": "conventional",
    "branches": "feature/*",
    "releases": "semver"
  },
  "security": {
    "auth": {
      "algorithm": "RS256",
      "accessTokenTtlMinutes": 15,
      "refreshTokenTtlDays": 7,
      "argon2": {
        "memoryCost": 19456,
        "timeCost": 2,
        "parallelism": 1
      }
    },
    "rateLimit": {
      "auth": { "max": 5, "windowMs": 900000 },
      "api": { "max": 100, "windowMs": 60000 }
    },
    "cors": {
      "allowlist": ["http://localhost:5173"],
      "credentials": true
    },
    "headers": {
      "csp": "default-src 'self'",
      "hsts": { "maxAge": 31536000, "includeSubDomains": true, "preload": true }
    }
  },
  "database": {
    "provider": "postgresql",
    "orm": "prisma",
    "migrations": true,
    "softDelete": true,
    "pitrDays": 7
  },
  "optional": {
    "rag": false,
    "graphify": false,
    "mcp": {
      "context7": true,
      "github": false,
      "browser": false
    }
  },
  "paths": {
    "docs": "docs",
    "checklists": "checklists",
    "templates": "templates",
    "exemplos": "exemplos",
    "memoria": "memoria",
    "skills": ".opencode/skills"
  }
}
```

---

## Referência por Seção

### `project`

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | Sim | Nome do projeto (kebab-case) |
| `description` | string | Não | Descrição curta |
| `stack` | enum | Sim | `node-typescript`, `node-javascript`, `python`, `go`, `rust`, `other` |
| `framework` | string | Não | Ex: `express-react`, `fastapi-vue`, `nextjs` |
| `language` | string | Não | Idioma docs: `pt-BR`, `en` |

---

### `qualityGates`

| Campo | Tipo | Padrão | Valores Válidos |
|-------|------|--------|-----------------|
| `typescript` | enum | `strict` | `strict`, `relaxed` |
| `lint` | enum | `standard` | `standard`, `verbose` |
| `coverage.unit` | number | `80` | 0-100 |
| `coverage.integration` | number | `60` | 0-100 |
| `coverage.e2e` | number | `100` | 0-100 |
| `thresholds.buildTimeMs` | number | `60000` | > 0 |
| `thresholds.testTimeMs` | number | `120000` | > 0 |

**Regras**:
- `typescript: "strict"` → `tsc --noEmit` deve passar com 0 erros
- `typescript: "relaxed"` → Permite `any` explícito, mas não erros de tipo
- `lint: "verbose"` → Inclui warnings de style + complexity
- Coverage < threshold → **falha no quality gate**

---

### `conventions`

| Campo | Tipo | Padrão | Valores Válidos |
|-------|------|--------|-----------------|
| `commits` | enum | `conventional` | `conventional`, `custom` |
| `branches` | string | `feature/*` | Padrão glob |
| `releases` | enum | `semver` | `semver`, `calver`, `custom` |

**Commits Convencionais**:
```
feat(scope): descrição
fix(scope): descrição
refactor(scope): descrição
chore(scope): descrição
docs(scope): descrição
test(scope): descrição
security(scope): descrição
```

---

### `security.auth`

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `algorithm` | enum | `RS256` | `RS256`, `HS256`, `ES256` |
| `accessTokenTtlMinutes` | number | `15` | TTL access token (1-60) |
| `refreshTokenTtlDays` | number | `7` | TTL refresh token (1-30) |
| `argon2.memoryCost` | number | `19456` | KB (OWASP 2023: 19456) |
| `argon2.timeCost` | number | `2` | Iterações |
| `argon2.parallelism` | number | `1` | Threads |

---

### `security.rateLimit`

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `auth.max` | number | `5` | Max tentativas |
| `auth.windowMs` | number | `900000` | Janela (ms) = 15 min |
| `api.max` | number | `100` | Max requests |
| `api.windowMs` | number | `60000` | Janela (ms) = 1 min |

---

### `security.cors`

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `allowlist` | string[] | `["http://localhost:5173"]` | Origens permitidas (nunca `*`) |
| `credentials` | boolean | `true` | Cookies/credentials |

---

### `security.headers`

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `csp` | string | `"default-src 'self'"` | Content Security Policy |
| `hsts.maxAge` | number | `31536000` | 1 ano em segundos |
| `hsts.includeSubDomains` | boolean | `true` | Incluir subdomínios |
| `hsts.preload` | boolean | `true` | HSTS preload |

---

### `database`

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `provider` | enum | `postgresql` | `postgresql`, `mysql`, `sqlite`, `mongodb` |
| `orm` | enum | `prisma` | `prisma`, `typeorm`, `drizzle`, `knex`, `raw` |
| `migrations` | boolean | `true` | Migrations versionadas no Git |
| `softDelete` | boolean | `true` | `deletedAt` em tabelas sensíveis |
| `pitrDays` | number | `7` | Point-in-time recovery (dias) |

---

### `optional`

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `rag` | boolean | `false` | Busca semântica (requer `@xenova/transformers`) |
| `graphify` | boolean | `false` | Grafo de código (requer `graphify-cli`) |
| `mcp.context7` | boolean | `true` | Docs oficiais por versão |
| `mcp.github` | boolean | `false` | GitHub API (requer `GITHUB_TOKEN`) |
| `mcp.browser` | boolean | `false` | Browser automation (requer Playwright) |

---

### `paths`

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `docs` | string | `docs` | Documentação técnica |
| `checklists` | string | `checklists` | Checklists obrigatórios |
| `templates` | string | `templates` | Templates reutilizáveis |
| `exemplos` | string | `exemplos` | Implementação de referência |
| `memoria` | string | `memoria` | Estado persistente |
| `skills` | string | `.opencode/skills` | Skills operacionais |

---

## Validação (Zod Schema)

O AGIM valida com **fail fast** na inicialização:

```typescript
// Esquema simplificado
const configSchema = z.object({
  project: z.object({
    name: z.string().min(1).regex(/^[a-z0-9-]+$/),
    stack: z.enum(['node-typescript', 'node-javascript', 'python', 'go', 'rust', 'other']),
    // ...
  }),
  qualityGates: z.object({
    typescript: z.enum(['strict', 'relaxed']),
    lint: z.enum(['standard', 'verbose']),
    coverage: z.object({
      unit: z.number().int().min(0).max(100),
      integration: z.number().int().min(0).max(100),
      e2e: z.number().int().min(0).max(100),
    }),
    // ...
  }),
  // ...
});

// Falha imediata com detalhes se inválido
const result = configSchema.safeParse(config);
if (!result.success) {
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}
```

---

## Exemplos por Stack

### Node/TypeScript + Express + React (Padrão)
```json
{
  "project": { "stack": "node-typescript", "framework": "express-react" },
  "qualityGates": { "typescript": "strict", "lint": "standard" }
}
```

### Python + FastAPI + Vue
```json
{
  "project": { "stack": "python", "framework": "fastapi-vue" },
  "qualityGates": { "typescript": "relaxed", "lint": "standard" }
}
```

### Go + Gin + React
```json
{
  "project": { "stack": "go", "framework": "gin-react" },
  "qualityGates": { "typescript": "relaxed", "lint": "standard" }
}
```

---

## Comandos Relacionados

```bash
# Validar config
agim config:validate

# Ver config atual
cat .agim/config.json

# Editar e validar
vim .agim/config.json
agim config:validate
agim sync  # Atualiza AGENTS.md
```

---

## Variáveis de Ambiente (Não Vão no Config)

| Variável | Onde Definir | Exemplo |
|----------|--------------|---------|
| `DATABASE_URL` | `.env` (gitignore) | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | `.env` | `super-secret-min-32-chars` |
| `CONTEXT7_API_KEY` | Shell/perfil | `ctx7_...` |
| `GITHUB_TOKEN` | Shell/perfil | `ghp_...` |

**Regra**: **NUNCA** commitar `.env` real. Use `.env.example` no Git.

---

## Próximos Documentos

| Documento | Foco |
|-----------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura 9+6 camadas |
| [SECURITY.md](./SECURITY.md) | Segurança obrigatória |
| [TESTING.md](./TESTING.md) | Estratégia de testes |
| [CLI-REFERENCE.md](./CLI-REFERENCE.md) | 14 comandos |