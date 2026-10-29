# Configuration — AGIM

> Complete reference for `.agim/config.json` — single source of truth.

---

## Complete Structure

```json
{
  "project": {
    "name": "my-project",
    "description": "Project description",
    "stack": "node-typescript",
    "framework": "express-react",
    "language": "en"
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

## Section Reference

### `project`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Project name (kebab-case) |
| `description` | string | No | Short description |
| `stack` | enum | Yes | `node-typescript`, `node-javascript`, `python`, `go`, `rust`, `other` |
| `framework` | string | No | e.g., `express-react`, `fastapi-vue`, `nextjs` |
| `language` | string | No | Docs language: `pt-BR`, `en` |

---

### `qualityGates`

| Field | Type | Default | Valid Values |
|-------|------|---------|--------------|
| `typescript` | enum | `strict` | `strict`, `relaxed` |
| `lint` | enum | `standard` | `standard`, `verbose` |
| `coverage.unit` | number | `80` | 0-100 |
| `coverage.integration` | number | `60` | 0-100 |
| `coverage.e2e` | number | `100` | 0-100 |
| `thresholds.buildTimeMs` | number | `60000` | > 0 |
| `thresholds.testTimeMs` | number | `120000` | > 0 |

**Rules**:
- `typescript: "strict"` → `tsc --noEmit` must pass with 0 errors
- `typescript: "relaxed"` → Allows explicit `any`, but no type errors
- `lint: "verbose"` → Includes style + complexity warnings
- Coverage < threshold → **quality gate fails**

---

### `conventions`

| Field | Type | Default | Valid Values |
|-------|------|---------|--------------|
| `commits` | enum | `conventional` | `conventional`, `custom` |
| `branches` | string | `feature/*` | Glob pattern |
| `releases` | enum | `semver` | `semver`, `calver`, `custom` |

**Conventional Commits**:
```
feat(scope): description
fix(scope): description
refactor(scope): description
chore(scope): description
docs(scope): description
test(scope): description
security(scope): description
```

---

### `security.auth`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `algorithm` | enum | `RS256` | `RS256`, `HS256`, `ES256` |
| `accessTokenTtlMinutes` | number | `15` | Access token TTL (1-60) |
| `refreshTokenTtlDays` | number | `7` | Refresh token TTL (1-30) |
| `argon2.memoryCost` | number | `19456` | KB (OWASP 2023: 19456) |
| `argon2.timeCost` | number | `2` | Iterations |
| `argon2.parallelism` | number | `1` | Threads |

---

### `security.rateLimit`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `auth.max` | number | `5` | Max attempts |
| `auth.windowMs` | number | `900000` | Window (ms) = 15 min |
| `api.max` | number | `100` | Max requests |
| `api.windowMs` | number | `60000` | Window (ms) = 1 min |

---

### `security.cors`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `allowlist` | string[] | `["http://localhost:5173"]` | Allowed origins (never `*`) |
| `credentials` | boolean | `true` | Cookies/credentials |

---

### `security.headers`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `csp` | string | `"default-src 'self'"` | Content Security Policy |
| `hsts.maxAge` | number | `31536000` | 1 year in seconds |
| `hsts.includeSubDomains` | boolean | `true` | Include subdomains |
| `hsts.preload` | boolean | `true` | HSTS preload |

---

### `database`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `provider` | enum | `postgresql` | `postgresql`, `mysql`, `sqlite`, `mongodb` |
| `orm` | enum | `prisma` | `prisma`, `typeorm`, `drizzle`, `knex`, `raw` |
| `migrations` | boolean | `true` | Versioned migrations in Git |
| `softDelete` | boolean | `true` | `deletedAt` on sensitive tables |
| `pitrDays` | number | `7` | Point-in-time recovery (days) |

---

### `optional`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `rag` | boolean | `false` | Semantic search (requires `@xenova/transformers`) |
| `graphify` | boolean | `false` | Code graph (requires `graphify-cli`) |
| `mcp.context7` | boolean | `true` | Official docs by version |
| `mcp.github` | boolean | `false` | GitHub API (requires `GITHUB_TOKEN`) |
| `mcp.browser` | boolean | `false` | Browser automation (requires Playwright) |

---

### `paths`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `docs` | string | `docs` | Technical documentation |
| `checklists` | string | `checklists` | Mandatory checklists |
| `templates` | string | `templates` | Reusable templates |
| `exemplos` | string | `exemplos` | Reference implementation |
| `memoria` | string | `memoria` | Persistent state |
| `skills` | string | `.opencode/skills` | Operational skills |

---

## Validation (Zod Schema)

AGIM validates with **fail fast** on initialization:

```typescript
// Simplified schema
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

// Immediate failure with details if invalid
const result = configSchema.safeParse(config);
if (!result.success) {
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}
```

---

## Examples by Stack

### Node/TypeScript + Express + React (Default)
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

## Related Commands

```bash
# Validate config
agim config:validate

# View current config
cat .agim/config.json

# Edit and validate
vim .agim/config.json
agim config:validate
agim sync  # Updates AGENTS.md
```

---

## Environment Variables (Not In Config)

| Variable | Where to Set | Example |
|----------|--------------|---------|
| `DATABASE_URL` | `.env` (gitignore) | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | `.env` | `super-secret-min-32-chars` |
| `CONTEXT7_API_KEY` | Shell/profile | `ctx7_...` |
| `GITHUB_TOKEN` | Shell/profile | `ghp_...` |

**Rule**: **NEVER** commit real `.env`. Use `.env.example` in Git.

---

## Next Documents

| Document | Focus |
|----------|-------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 9 backend + 6 frontend layers |
| [SECURITY.md](./SECURITY.md) | Mandatory security |
| [TESTING.md](./TESTING.md) | Testing strategy |
| [CLI-REFERENCE.md](./CLI-REFERENCE.md) | 14 commands |