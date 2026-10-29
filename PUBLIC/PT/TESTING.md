# Testes — AGIM

> Pirâmide, Vitest, Playwright, axe, k6, coverage thresholds, CI.

---

## Pirâmide de Testes

```
                    ┌─────────────┐
                    │   E2E       │  ← Poucos, críticos, alto valor
                    │  (Playwright)│
                   ┌┴─────────────┴┐
                  │  Integração   │  ← Médios, APIs, DB, serviços
                  │   (Vitest)    │
                 ┌┴────────────────┴┐
                │      Unit        │  ← Muitos, rápidos, isolados
                │    (Vitest)      │
               ┌┴────────────────────┴┐
              │   Acessibilidade     │  ← axe-core em CI
              │    (Playwright)      │
             ┌┴────────────────────────┴┐
            │      Performance         │  ← k6 (load/stress/soak)
            │         (k6)             │
           ┌┴────────────────────────────┴┐
          │        Segurança             │  ← OWASP ZAP / custom
          │     (audit + custom)         │
         ┌┴────────────────────────────────┴┐
        │         Regressão                │  ← Suite completa a cada PR
        │    (testes-com-roteiro)          │
       └────────────────────────────────────┘
```

---

## Cobertura Obrigatória (Quality Gate)

| Tipo | Threshold Mínimo | Ferramenta |
|------|------------------|------------|
| **Unit** | ≥ 80% (nova feature) | Vitest + Testing Library |
| **Integração** | ≥ 60% | Vitest + Supertest + Testcontainers |
| **E2E** | 100% critical paths | Playwright |
| **Acessibilidade** | 0 violações critical/serious | axe-core + Playwright |
| **Performance** | p95 < threshold definido | k6 |
| **Segurança** | 0 critical/high | OWASP ZAP + `agim audit` |

**Falha no quality gate** → `verification-before-completion` bloqueia "pronto"

---

## 1. Testes Unitários (Vitest + Testing Library)

### Configuração
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: { provider: 'v8', reporter: ['text', 'json', 'html'], thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 } },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
```

### Exemplo: Service
```typescript
// src/services/usuarios.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsuariosService } from './usuarios.service';
import { UsuariosRepository } from '../repositories/usuarios.repository';
import { HashService } from './hash.service';
import { EventPublisher } from '../utils/event-publisher';
import { EmailJaCadastradoError, UsuarioNaoEncontradoError } from '../errors/negocio.errors';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let mockRepo: vi.Mocked<UsuariosRepository>;
  let mockHash: vi.Mocked<HashService>;
  let mockEvents: vi.Mocked<EventPublisher>;

  beforeEach(() => {
    mockRepo = { encontrarPorEmail: vi.fn(), criar: vi.fn(), encontrarPorId: vi.fn(), listar: vi.fn(), atualizar: vi.fn(), excluir: vi.fn() } as any;
    mockHash = { hash: vi.fn(), verify: vi.fn() } as any;
    mockEvents = { publicar: vi.fn() } as any;
    service = new UsuariosService(mockRepo, mockHash, mockEvents);
  });

  it('deve criar usuário com senha hasheada', async () => {
    mockRepo.encontrarPorEmail.mockResolvedValue(null);
    mockHash.hash.mockResolvedValue('hashed-password');
    mockRepo.criar.mockResolvedValue({ id: '1', nome: 'João', email: 'joao@test.com', senha: 'hashed-password', roles: ['user'], criadoEm: new Date(), atualizadoEm: new Date() });

    const result = await service.criar({ nome: 'João', email: 'joao@test.com', senha: 'senha123' });

    expect(mockHash.hash).toHaveBeenCalledWith('senha123');
    expect(mockRepo.criar).toHaveBeenCalledWith(expect.objectContaining({ senha: 'hashed-password' }));
    expect(result).not.toHaveProperty('senha');
    expect(mockEvents.publicar).toHaveBeenCalledWith('usuario.criado', expect.any(Object));
  });

  it('deve lançar erro se email já cadastrado', async () => {
    mockRepo.encontrarPorEmail.mockResolvedValue({ id: '1', email: 'joao@test.com' } as any);
    await expect(service.criar({ nome: 'João', email: 'joao@test.com', senha: 'senha123' })).rejects.toThrow(EmailJaCadastradoError);
  });
});
```

### Exemplo: Validator
```typescript
// src/validations/usuarios.validation.test.ts
import { describe, it, expect } from 'vitest';
import { criarUsuarioSchema } from './usuarios.validation';

describe('criarUsuarioSchema', () => {
  it('valida dados corretos', () => {
    const result = criarUsuarioSchema.safeParse({ body: { nome: 'João', email: 'joao@test.com', senha: 'senha123' } });
    expect(result.success).toBe(true);
  });

  it('rejeita email inválido', () => {
    const result = criarUsuarioSchema.safeParse({ body: { nome: 'João', email: 'invalido', senha: 'senha123' } });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.body?.email).toContain('Email inválido');
  });

  it('rejeita senha curta', () => {
    const result = criarUsuarioSchema.safeParse({ body: { nome: 'João', email: 'joao@test.com', senha: '123' } });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.body?.senha).toContain('Senha deve ter pelo menos 8 caracteres');
  });
});
```

---

## 2. Testes de Integração (Vitest + Supertest + Testcontainers)

### Configuração
```typescript
// test/integration/setup.ts
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { PrismaClient } from '@prisma/client';

let container: StartedTestContainer;
let prisma: PrismaClient;

beforeAll(async () => {
  container = await new GenericContainer('postgres:16-alpine')
    .withEnvironment({ POSTGRES_USER: 'test', POSTGRES_PASSWORD: 'test', POSTGRES_DB: 'test' })
    .withExposedPorts(5432)
    .start();

  process.env.DATABASE_URL = `postgresql://test:test@localhost:${container.getMappedPort(5432)}/test`;
  prisma = new PrismaClient();
  await prisma.$connect();
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  // Rodar migrations...
});

afterAll(async () => {
  await prisma.$disconnect();
  await container.stop();
});
```

### Exemplo: API Endpoint
```typescript
// test/integration/usuarios.routes.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

describe('POST /api/v1/usuarios', () => {
  beforeEach(async () => {
    await prisma.usuario.deleteMany();
  });

  it('deve criar usuário e retornar 201', async () => {
    const response = await request(app)
      .post('/api/v1/usuarios')
      .set('Authorization', `Bearer ${validAdminToken}`)
      .send({ nome: 'João', email: 'joao@test.com', senha: 'senha123' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ nome: 'João', email: 'joao@test.com' });
    expect(response.body).not.toHaveProperty('senha');

    // Verificar hash no banco
    const user = await prisma.usuario.findUnique({ where: { email: 'joao@test.com' } });
    expect(user).not.toBeNull();
    expect(await argon2.verify(user!.senha, 'senha123')).toBe(true);
  });

  it('deve retornar 400 se email inválido', async () => {
    const response = await request(app)
      .post('/api/v1/usuarios')
      .set('Authorization', `Bearer ${validAdminToken}`)
      .send({ nome: 'João', email: 'invalido', senha: 'senha123' });

    expect(response.status).toBe(400);
    expect(response.body.erro).toBe('VALIDACAO');
  });
});
```

---

## 3. Testes E2E (Playwright)

### Configuração
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: !process.env.CI },
});
```

### Exemplo: Fluxo Crítico
```typescript
// tests/e2e/usuarios-crud.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CRUD Usuários', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name=email]', 'admin@test.com');
    await page.fill('[name=senha]', 'senha123');
    await page.click('button[type=submit]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('deve criar, listar, editar e excluir usuário', async ({ page }) => {
    // Criar
    await page.goto('/usuarios/novo');
    await page.fill('[name=nome]', 'Maria Silva');
    await page.fill('[name=email]', 'maria@test.com');
    await page.fill('[name=senha]', 'senha123');
    await page.click('button[type=submit]');
    await expect(page.locator('text=Usuário criado com sucesso')).toBeVisible();

    // Listar
    await page.goto('/usuarios');
    await expect(page.locator('text=Maria Silva')).toBeVisible();

    // Editar
    await page.click('button:has-text("Editar")');
    await page.fill('[name=nome]', 'Maria Santos');
    await page.click('button[type=submit]');
    await expect(page.locator('text=Usuário atualizado')).toBeVisible();

    // Excluir
    await page.click('button:has-text("Excluir")');
    await page.click('button:has-text("Confirmar")');
    await expect(page.locator('text=Usuário excluído')).toBeVisible();
    await expect(page.locator('text=Maria Santos')).not.toBeVisible();
  });
});
```

---

## 4. Testes de Acessibilidade (axe-core + Playwright)

```typescript
// tests/a11y/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Acessibilidade', () => {
  const pages = ['/', '/login', '/dashboard', '/usuarios', '/usuarios/novo', '/perfil'];

  for (const url of pages) {
    test(`${url} deve ter 0 violações critical/serious`, async ({ page }) => {
      await page.goto(url);
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      
      const criticalSerious = accessibilityScanResults.violations.filter(v => 
        ['critical', 'serious'].includes(v.impact)
      );
      
      expect(criticalSerious).toEqual([]);
      
      // Log moderate/minor para revisão manual
      if (accessibilityScanResults.violations.length > 0) {
        console.warn(`A11y violations em ${url}:`, accessibilityScanResults.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description })));
      }
    });
  }
});
```

---

## 5. Testes de Performance (k6)

```javascript
// tests/performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Spike to 100
    { duration: '5m', target: 100 },  // Stay at 100
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],     // 95% das requests < 500ms
    http_req_failed: ['rate<0.01'],       // Taxa de erro < 1%
    errors: ['rate<0.01'],
  },
};

export default function () {
  const token = __ENV.ACCESS_TOKEN;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Listar usuários
  let res = http.get('http://localhost:3000/api/v1/usuarios', { headers });
  check(res, { 'status 200': (r) => r.status === 200, 'response time < 500ms': (r) => r.timings.duration < 500 }) || errorRate.add(1);

  // Criar usuário
  const payload = JSON.stringify({ nome: `User ${Date.now()}`, email: `user${Date.now()}@test.com`, senha: 'senha123' });
  res = http.post('http://localhost:3000/api/v1/usuarios', payload, { headers });
  check(res, { 'status 201': (r) => r.status === 201 }) || errorRate.add(1);

  sleep(1);
}
```

---

## 6. Testes de Segurança

```bash
# Auditoria estática (AGIM)
agim audit

# OWASP ZAP (baseline scan)
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000 -r zap-report.html

# npm audit no CI
npm audit --audit-level=high
```

---

## 7. Roteiro de Testes (50+ Cenários)

Ver `checklists/ROTEIRO-DE-TESTES.md` para cenários detalhados:

| Categoria | Cenários |
|-----------|----------|
| **Auth** | Login válido, inválido, expirado, brute force, refresh token, logout |
| **AuthZ** | RBAC admin/user, ownership (IDOR), permissões granulares |
| **Validação** | Schema válido, inválido, edge cases, sanitização |
| **CRUD** | Create, read, update, delete, list, paginação, busca |
| **Falhas** | Network error, timeout, DB down, validação, rate limit |
| **Upload** | MIME válido/inválido, tamanho, sanitização, storage |
| **Frontend** | Render, interação, estado, a11y, responsividade |
| **Performance** | Carga, stress, soak, spike, breakpoint |
| **Segurança** | OWASP Top 10, headers, secrets, CORS |

---

## 8. Factories e Fixtures

```typescript
// test/factories/usuario.factory.ts
import { faker } from '@faker-js/faker';
import { CriarUsuarioDTO, UsuarioResponse } from '../../src/types/usuario.types';

export const buildUsuario = (overrides: Partial<CriarUsuarioDTO> = {}): CriarUsuarioDTO => ({
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  senha: 'senha123',
  roles: ['user'],
  ...overrides,
});

export const buildUsuarioResponse = (overrides: Partial<UsuarioResponse> = {}): UsuarioResponse => ({
  id: faker.string.uuid(),
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  roles: ['user'],
  criadoEm: faker.date.past(),
  atualizadoEm: faker.date.recent(),
  ...overrides,
});

export const buildUsuarios = (count: number, overrides = {}): CriarUsuarioDTO[] =>
  Array.from({ length: count }, () => buildUsuario(overrides));
```

---

## 9. CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env: { POSTGRES_USER: test, POSTGRES_PASSWORD: test, POSTGRES_DB: test }
        ports: [5432:5432]
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      
      - run: npm ci
      - run: npx prisma migrate deploy
        env: { DATABASE_URL: postgresql://test:test@localhost:5432/test }
      
      # Unit + Integration
      - run: npm run test:coverage
      
      # E2E
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run preview -- --port 5173 &
      - run: npm run test:e2e
      
      # A11y
      - run: npm run test:a11y
      
      # Security
      - run: npm audit --audit-level=high
      - run: agim audit
      
      # Quality gate
      - run: agim validate --json
```

---

## 10. skill `testes-com-roteiro`

Orquestra toda a suite:

```bash
skill testes-com-roteiro
# Executa em ordem/paralelo:
# 1. Unit tests (Vitest)
# 2. Integration tests (Vitest + Testcontainers)
# 3. E2E tests (Playwright)
# 4. A11y tests (axe-core + Playwright)
# 5. Performance tests (k6) - se configurado
# 6. Security tests (agim audit + OWASP ZAP)
# 7. Regression suite
# Gera relatório consolidado em memoria/HISTORICO-DE-EXECUCAO.md
```

---

## Próximos Documentos

| Documento | Foco |
|-----------|------|
| [EXAMPLES.md](./EXAMPLES.md) | Casos de uso reais |
| [FAQ.md](./FAQ.md) | Perguntas frequentes |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura 9+6 camadas |
| [SECURITY.md](./SECURITY.md) | Segurança obrigatória |