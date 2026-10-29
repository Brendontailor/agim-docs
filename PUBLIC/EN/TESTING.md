# Testing — AGIM

> Pyramid, Vitest, Playwright, axe, k6, coverage thresholds, CI.

---

## Test Pyramid

```
                    ┌─────────────┐
                    │    E2E      │  ← Few, critical, high value
                    │ (Playwright) │
                   ┌┴─────────────┴┐
                  │ Integration   │  ← Medium, APIs, DB, services
                  │   (Vitest)    │
                 ┌┴────────────────┴┐
                │      Unit        │  ← Many, fast, isolated
                │    (Vitest)      │
               ┌┴────────────────────┴┐
              │   Accessibility      │  ← axe-core in CI
              │    (Playwright)      │
             ┌┴────────────────────────┴┐
            │      Performance         │  ← k6 (load/stress/soak)
            │         (k6)             │
           ┌┴────────────────────────────┴┐
          │        Security              │  ← OWASP ZAP / custom
          │     (audit + custom)         │
         ┌┴────────────────────────────────┴┐
        │         Regression               │  ← Full suite every PR
        │    (testes-com-roteiro)          │
       └────────────────────────────────────┘
```

---

## Mandatory Coverage (Quality Gate)

| Type | Minimum Threshold | Tool |
|------|-------------------|------|
| **Unit** | ≥ 80% (new feature) | Vitest + Testing Library |
| **Integration** | ≥ 60% | Vitest + Supertest + Testcontainers |
| **E2E** | 100% critical paths | Playwright |
| **Accessibility** | 0 critical/serious violations | axe-core + Playwright |
| **Performance** | p95 < defined threshold | k6 |
| **Security** | 0 critical/high | OWASP ZAP + `agim audit` |

**Quality gate failure** → `verification-before-completion` blocks "done"

---

## 1. Unit Tests (Vitest + Testing Library)

### Configuration
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

### Example: Service
```typescript
// src/services/users.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/users.repository';
import { HashService } from './hash.service';
import { EventPublisher } from '../utils/event-publisher';
import { EmailAlreadyExistsError, UserNotFoundError } from '../errors/business.errors';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: vi.Mocked<UsersRepository>;
  let mockHash: vi.Mocked<HashService>;
  let mockEvents: vi.Mocked<EventPublisher>;

  beforeEach(() => {
    mockRepo = { findByEmail: vi.fn(), create: vi.fn(), findById: vi.fn(), list: vi.fn(), update: vi.fn(), delete: vi.fn() } as any;
    mockHash = { hash: vi.fn(), verify: vi.fn() } as any;
    mockEvents = { publish: vi.fn() } as any;
    service = new UsersService(mockRepo, mockHash, mockEvents);
  });

  it('should create user with hashed password', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockHash.hash.mockResolvedValue('hashed-password');
    mockRepo.create.mockResolvedValue({ id: '1', name: 'John', email: 'john@test.com', password: 'hashed-password', roles: ['user'], createdAt: new Date(), updatedAt: new Date() });

    const result = await service.create({ name: 'John', email: 'john@test.com', password: 'password123' });

    expect(mockHash.hash).toHaveBeenCalledWith('password123');
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashed-password' }));
    expect(result).not.toHaveProperty('password');
    expect(mockEvents.publish).toHaveBeenCalledWith('user.created', expect.any(Object));
  });

  it('should throw if email already exists', async () => {
    mockRepo.findByEmail.mockResolvedValue({ id: '1', email: 'john@test.com' } as any);
    await expect(service.create({ name: 'John', email: 'john@test.com', password: 'password123' })).rejects.toThrow(EmailAlreadyExistsError);
  });
});
```

### Example: Validator
```typescript
// src/validations/users.validation.test.ts
import { describe, it, expect } from 'vitest';
import { createUserSchema } from './users.validation';

describe('createUserSchema', () => {
  it('validates correct data', () => {
    const result = createUserSchema.safeParse({ body: { name: 'John', email: 'john@test.com', password: 'password123' } });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = createUserSchema.safeParse({ body: { name: 'John', email: 'invalid', password: 'password123' } });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.body?.email).toContain('Invalid email');
  });

  it('rejects short password', () => {
    const result = createUserSchema.safeParse({ body: { name: 'John', email: 'john@test.com', password: '123' } });
    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.body?.password).toContain('Password must be at least 8 characters');
  });
});
```

---

## 2. Integration Tests (Vitest + Supertest + Testcontainers)

### Configuration
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
  // Run migrations...
});

afterAll(async () => {
  await prisma.$disconnect();
  await container.stop();
});
```

### Example: API Endpoint
```typescript
// test/integration/users.routes.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

describe('POST /api/v1/users', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${validAdminToken}`)
      .send({ name: 'John', email: 'john@test.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: 'John', email: 'john@test.com' });
    expect(response.body).not.toHaveProperty('password');

    // Verify hash in database
    const user = await prisma.user.findUnique({ where: { email: 'john@test.com' } });
    expect(user).not.toBeNull();
    expect(await argon2.verify(user!.password, 'password123')).toBe(true);
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${validAdminToken}`)
      .send({ name: 'John', email: 'invalid', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VALIDATION');
  });
});
```

---

## 3. E2E Tests (Playwright)

### Configuration
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

### Example: Critical Flow
```typescript
// tests/e2e/users-crud.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Users CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name=email]', 'admin@test.com');
    await page.fill('[name=password]', 'password123');
    await page.click('button[type=submit]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create, list, edit and delete user', async ({ page }) => {
    // Create
    await page.goto('/users/new');
    await page.fill('[name=name]', 'Maria Silva');
    await page.fill('[name=email]', 'maria@test.com');
    await page.fill('[name=password]', 'password123');
    await page.click('button[type=submit]');
    await expect(page.locator('text=User created successfully')).toBeVisible();

    // List
    await page.goto('/users');
    await expect(page.locator('text=Maria Silva')).toBeVisible();

    // Edit
    await page.click('button:has-text("Edit")');
    await page.fill('[name=name]', 'Maria Santos');
    await page.click('button[type=submit]');
    await expect(page.locator('text=User updated')).toBeVisible();

    // Delete
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm")');
    await expect(page.locator('text=User deleted')).toBeVisible();
    await expect(page.locator('text=Maria Santos')).not.toBeVisible();
  });
});
```

---

## 4. Accessibility Tests (axe-core + Playwright)

```typescript
// tests/a11y/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  const pages = ['/', '/login', '/dashboard', '/users', '/users/new', '/profile'];

  for (const url of pages) {
    test(`${url} must have 0 critical/serious violations`, async ({ page }) => {
      await page.goto(url);
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      
      const criticalSerious = accessibilityScanResults.violations.filter(v => 
        ['critical', 'serious'].includes(v.impact)
      );
      
      expect(criticalSerious).toEqual([]);
      
      // Log moderate/minor for manual review
      if (accessibilityScanResults.violations.length > 0) {
        console.warn(`A11y violations in ${url}:`, accessibilityScanResults.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description })));
      }
    });
  }
});
```

---

## 5. Performance Tests (k6)

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
    http_req_duration: ['p(95)<500'],     // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],       // Error rate < 1%
    errors: ['rate<0.01'],
  },
};

export default function () {
  const token = __ENV.ACCESS_TOKEN;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // List users
  let res = http.get('http://localhost:3000/api/v1/users', { headers });
  check(res, { 'status 200': (r) => r.status === 200, 'response time < 500ms': (r) => r.timings.duration < 500 }) || errorRate.add(1);

  // Create user
  const payload = JSON.stringify({ name: `User ${Date.now()}`, email: `user${Date.now()}@test.com`, password: 'password123' });
  res = http.post('http://localhost:3000/api/v1/users', payload, { headers });
  check(res, { 'status 201': (r) => r.status === 201 }) || errorRate.add(1);

  sleep(1);
}
```

---

## 6. Security Tests

```bash
# Static audit (AGIM)
agim audit

# OWASP ZAP (baseline scan)
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000 -r zap-report.html

# npm audit in CI
npm audit --audit-level=high
```

---

## 7. Test Playbook (50+ Scenarios)

See `checklists/ROTEIRO-DE-TESTES.md` for detailed scenarios:

| Category | Scenarios |
|----------|-----------|
| **Auth** | Valid login, invalid, expired, brute force, refresh token, logout |
| **AuthZ** | RBAC admin/user, ownership (IDOR), granular permissions |
| **Validation** | Valid schema, invalid, edge cases, sanitization |
| **CRUD** | Create, read, update, delete, list, pagination, search |
| **Failures** | Network error, timeout, DB down, validation, rate limit |
| **Upload** | Valid/invalid MIME, size, sanitization, storage |
| **Frontend** | Render, interaction, state, a11y, responsiveness |
| **Performance** | Load, stress, soak, spike, breakpoint |
| **Security** | OWASP Top 10, headers, secrets, CORS |

---

## 8. Factories & Fixtures

```typescript
// test/factories/user.factory.ts
import { faker } from '@faker-js/faker';
import { CreateUserDTO, UserResponse } from '../../src/types/user.types';

export const buildUser = (overrides: Partial<CreateUserDTO> = {}): CreateUserDTO => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: 'password123',
  roles: ['user'],
  ...overrides,
});

export const buildUserResponse = (overrides: Partial<UserResponse> = {}): UserResponse => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  roles: ['user'],
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

export const buildUsers = (count: number, overrides = {}): CreateUserDTO[] =>
  Array.from({ length: count }, () => buildUser(overrides));
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

## 10. `testes-com-roteiro` Skill

Orchestrates entire suite:

```bash
skill testes-com-roteiro
# Runs in order/parallel:
# 1. Unit tests (Vitest)
# 2. Integration tests (Vitest + Testcontainers)
# 3. E2E tests (Playwright)
# 4. A11y tests (axe-core + Playwright)
# 5. Performance tests (k6) - if configured
# 6. Security tests (agim audit + OWASP ZAP)
# 7. Regression suite
# Generates consolidated report in memoria/HISTORICO-DE-EXECUCAO.md
```

---

## Next Documents

| Document | Focus |
|----------|-------|
| [EXAMPLES.md](./EXAMPLES.md) | Real-world use cases |
| [FAQ.md](./FAQ.md) | Frequently asked questions |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 9+6 layer architecture |
| [SECURITY.md](./SECURITY.md) | Mandatory security |