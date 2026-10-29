# Estratégia de Testes

> Abordagem sistemática para testes automatizados em projetos baseados neste repositório.
> Baseada na Seção 11 da missão: "ESTRATÉGIA DE TESTES".

---

## Princípios

| Princípio | Descrição |
|-----------|-----------|
| **Teste em Pirâmide** | Muitos unitários, alguns integração, poucos E2E |
| **Teste como Documentação** | Testes claros servem como especificação viva |
| **Fail Fast** | Testes rápidos rodam no CI a cada push; lentos em schedule |
| **Determinístico** | Mesmo input → mesmo output; sem flakiness |
| **Isolado** | Cada teste independente; sem estado compartilhado |
| **Cobertura Significativa** | Foco em branches críticos, não % arbitrário |
| **Testes de Segurança** | Auth, AuthZ, validação, rate limit como testes obrigatórios |

---

## Tipos de Teste e Ferramentas

| Tipo | Ferramenta | Escopo | Quando Rodar |
|------|------------|--------|--------------|
| **Unitários** | Vitest | Funções puras, services, utils, hooks | Todo commit (CI) |
| **Integração** | Vitest + Supertest | API endpoints, DB, services com DB real | Todo commit (CI) |
| **Contrato API** | Pact / Vitest | Schema request/response | Todo commit (CI) |
| **Componentes** | Vitest + Testing Library | Componentes React isolados | Todo commit (CI) |
| **E2E** | Playwright | Fluxos críticos usuário | PR merge / nightly |
| **Acessibilidade** | axe-core / Playwright | WCAG 2.1 AA | PR merge |
| **Performance** | Lighthouse CI / k6 | Core Web Vitals, API latency | Nightly / release |
| **Segurança** | npm audit, Snyk, OWASP ZAP | Dependências, SAST, DAST | CI + schedule |
| **Type Check** | TypeScript (`tsc --noEmit`) | Tipos em todo projeto | Todo commit (CI) |
| **Lint/Format** | ESLint + Prettier | Estilo, padrões, bugs potenciais | Todo commit (CI) |

---

## Estrutura de Diretórios de Testes

```
backend/
├── src/
│   ├── services/
│   │   ├── usuarios.service.ts
│   │   └── __tests__/
│   │       └── usuarios.service.test.ts      # Unitários (mock repository)
│   ├── controllers/
│   │   └── __tests__/
│   │       └── usuarios.controller.test.ts   # Integração (Supertest)
│   ├── repositories/
│   │   └── __tests__/
│   │       └── usuarios.repository.test.ts   # Integração (DB real/test)
│   └── middlewares/
│       └── __tests__/
│           └── autenticar.middleware.test.ts
├── prisma/
│   └── seed.test.ts                          # Seed para testes
└── vitest.config.ts

frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── __tests__/
│   │   │       └── Button.test.tsx           # Componente isolado
│   │   └── forms/
│   │       └── __tests__/
│   │           └── UsuarioForm.test.tsx
│   ├── hooks/
│   │   ├── useUsuarios.ts
│   │   └── __tests__/
│   │       └── useUsuarios.test.ts           # Hook com MSW
│   ├── services/
│   │   ├── usuarios.api.ts
│   │   └── __tests__/
│   │       └── usuarios.api.test.ts          # MSW intercept
│   └── pages/
│       └── __tests__/
│           └── UsuariosListaPage.test.tsx    # Integração página
├── e2e/
│   ├── auth.login.spec.ts                    # Playwright
│   ├── usuarios.crud.spec.ts
│   └── fixtures/
│       └── test-data.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## Testes Unitários (Backend)

### Service com Mocks
```typescript
// backend/src/services/__tests__/usuarios.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsuariosService } from '../usuarios.service';
import { UsuariosRepository } from '../../repositories/usuarios.repository';
import { HashService } from '../hash.service';
import { EventPublisher } from '../../utils/event-publisher';
import { UsuarioNaoEncontradoError, EmailJaCadastradoError } from '../../errors/negocio.errors';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let mockRepository: vi.Mocked<UsuariosRepository>;
  let mockHash: vi.Mocked<HashService>;
  let mockEvents: vi.Mocked<EventPublisher>;

  beforeEach(() => {
    mockRepository = {
      listar: vi.fn(),
      encontrarPorId: vi.fn(),
      encontrarPorEmail: vi.fn(),
      criar: vi.fn(),
      atualizar: vi.fn(),
      excluir: vi.fn(),
    } as any;

    mockHash = {
      hash: vi.fn(),
      verificar: vi.fn(),
    } as any;

    mockEvents = {
      publicar: vi.fn(),
    } as any;

    service = new UsuariosService(mockRepository, mockHash, mockEvents);
  });

  describe('criar', () => {
    it('deve criar usuário com senha hasheada e publicar evento', async () => {
      const dto = { nome: 'João', email: 'joao@email.com', senha: 'senha123' };
      const hash = 'argon2id$hash...';
      const usuarioCriado = { id: 'uuid-1', ...dto, senha: hash, roles: ['user'], criadoEm: new Date(), atualizadoEm: new Date() };

      mockRepository.encontrarPorEmail.mockResolvedValue(null);
      mockHash.hash.mockResolvedValue(hash);
      mockRepository.criar.mockResolvedValue(usuarioCriado);

      const resultado = await service.criar(dto);

      expect(mockRepository.encontrarPorEmail).toHaveBeenCalledWith('joao@email.com');
      expect(mockHash.hash).toHaveBeenCalledWith('senha123');
      expect(mockRepository.criar).toHaveBeenCalledWith({ ...dto, senha: hash });
      expect(mockEvents.publicar).toHaveBeenCalledWith('usuario.criado', { usuarioId: 'uuid-1', email: 'joao@email.com' });
      expect(resultado).not.toHaveProperty('senha');
      expect(resultado.email).toBe('joao@email.com');
    });

    it('deve lançar EmailJaCadastradoError se email já existe', async () => {
      mockRepository.encontrarPorEmail.mockResolvedValue({ id: 'outro', email: 'joao@email.com' } as any);

      await expect(service.criar({ nome: 'João', email: 'joao@email.com', senha: 'senha123' }))
        .rejects.toThrow(EmailJaCadastradoError);
    });
  });

  describe('obterPorId', () => {
    it('deve retornar usuário sem senha', async () => {
      const usuario = { id: 'uuid-1', nome: 'João', email: 'joao@email.com', senha: 'hash', roles: ['user'], criadoEm: new Date(), atualizadoEm: new Date() };
      mockRepository.encontrarPorId.mockResolvedValue(usuario);

      const resultado = await service.obterPorId('uuid-1');

      expect(resultado).not.toHaveProperty('senha');
    });

    it('deve lançar UsuarioNaoEncontradoError se não existe', async () => {
      mockRepository.encontrarPorId.mockResolvedValue(null);

      await expect(service.obterPorId('inexistente'))
        .rejects.toThrow(UsuarioNaoEncontradoError);
    });
  });
});
```

### Validação de Erros de Domínio
```typescript
// backend/src/errors/__tests__/negocio.errors.test.ts
import { describe, it, expect } from 'vitest';
import { 
  UsuarioNaoEncontradoError, 
  EmailJaCadastradoError, 
  NaoAutorizadoError,
  ValidacaoError 
} from '../negocio.errors';

describe('Erros de Negócio', () => {
  it('UsuarioNaoEncontradoError deve ter código e status corretos', () => {
    const error = new UsuarioNaoEncontradoError('uuid-123');
    expect(error.codigo).toBe('NAO_ENCONTRADO');
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain('uuid-123');
  });

  it('ValidacaoError deve conter detalhes por campo', () => {
    const error = new ValidacaoError({ email: ['Email inválido'], nome: ['Muito curto'] });
    expect(error.codigo).toBe('VALIDACAO');
    expect(error.statusCode).toBe(400);
    expect(error.detalhes).toEqual({ email: ['Email inválido'], nome: ['Muito curto'] });
  });
});
```

---

## Testes de Integração (Backend - API + DB)

### Setup com Banco de Teste
```typescript
// backend/tests/setup.ts
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Criar banco de teste separado
  process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/meuapp_test';
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
});

afterAll(async () => {
  await prisma.$disconnect();
  // Opcional: drop database
});

beforeEach(async () => {
  // Limpar tabelas na ordem correta (FKs)
  await prisma.refreshToken.deleteMany();
  await prisma.usuario.deleteMany();
});

afterEach(async () => {
  // Rollback transações pendentes
});
```

### Controller + Supertest
```typescript
// backend/src/controllers/__tests__/usuarios.controller.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app'; // Factory da app Express
import { prisma } from '../../prisma/prisma.service';
import { hashService } from '../../services/hash.service';
import { jwtService } from '../../services/jwt.service';

describe('UsuariosController (Integration)', () => {
  let accessToken: string;
  let adminToken: string;

  beforeEach(async () => {
    // Criar usuário admin para testes
    const senhaHash = await hashService.hash('admin123');
    const admin = await prisma.usuario.create({
      data: { nome: 'Admin', email: 'admin@test.com', senha: senhaHash, roles: ['admin'] },
    });
    adminToken = jwtService.gerarAccessToken(admin.id, admin.roles);

    // Criar usuário comum
    const user = await prisma.usuario.create({
      data: { nome: 'User', email: 'user@test.com', senha: senhaHash, roles: ['user'] },
    });
    accessToken = jwtService.gerarAccessToken(user.id, user.roles);
  });

  describe('GET /api/v1/usuarios', () => {
    it('deve listar usuários com paginação (auth)', async () => {
      const res = await request(app)
        .get('/api/v1/usuarios')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('dados');
      expect(res.body).toHaveProperty('paginacao');
      expect(Array.isArray(res.body.dados)).toBe(true);
    });

    it('deve retornar 401 sem token', async () => {
      await request(app)
        .get('/api/v1/usuarios')
        .expect(401);
    });

    it('deve retornar 403 sem permissão', async () => {
      // Usuário sem role 'usuarios:listar'
      await request(app)
        .get('/api/v1/usuarios')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });

  describe('POST /api/v1/usuarios', () => {
    it('deve criar usuário (admin)', async () => {
      const res = await request(app)
        .post('/api/v1/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nome: 'Novo', email: 'novo@test.com', senha: 'senha123' })
        .expect(201);

      expect(res.body).not.toHaveProperty('senha');
      expect(res.body.email).toBe('novo@test.com');
    });

    it('deve retornar 400 para dados inválidos', async () => {
      const res = await request(app)
        .post('/api/v1/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nome: '', email: 'invalido', senha: '123' })
        .expect(400);

      expect(res.body.erro).toBe('VALIDACAO');
      expect(res.body.detalhes).toHaveProperty('body.nome');
      expect(res.body.detalhes).toHaveProperty('body.email');
      expect(res.body.detalhes).toHaveProperty('body.senha');
    });

    it('deve retornar 409 para email duplicado', async () => {
      await request(app)
        .post('/api/v1/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nome: 'Outro', email: 'admin@test.com', senha: 'senha123' })
        .expect(409);
    });
  });
});
```

---

## Testes de Componentes (Frontend)

### Testing Library + Vitest
```tsx
// frontend/src/components/ui/__tests__/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renderiza children', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
  });

  it('aplica variant destructive', () => {
    render(<Button variant="destructive">Excluir</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });

  it('mostra loading state', () => {
    render(<Button loading>Salvar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toContainHTML('svg'); // Spinner
  });

  it('chama onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick se disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Formulário com React Hook Form + Zod
```tsx
// frontend/src/components/forms/__tests__/UsuarioForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UsuarioForm } from '../UsuarioForm';
import { usuariosApi } from '@/services/usuarios.api';

vi.mock('@/services/usuarios.api');

describe('UsuarioForm', () => {
  it('mostra erros de validação', async () => {
    render(<UsuarioForm onSuccess={vi.fn()} />);
    
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/nome deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/senha deve ter pelo menos 8 caracteres/i)).toBeInTheDocument();
    });
  });

  it('submete formulário válido', async () => {
    const onSuccess = vi.fn();
    (usuariosApi.criar as vi.Mock).mockResolvedValue({ 
      id: '1', nome: 'João', email: 'joao@test.com', roles: ['user'] 
    });

    render(<UsuarioForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@test.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senhaSegura123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(usuariosApi.criar).toHaveBeenCalledWith({
        nome: 'João Silva',
        email: 'joao@test.com',
        senha: 'senhaSegura123',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

---

## Testes de Hooks (Frontend)

### MSW (Mock Service Worker) para API
```typescript
// frontend/src/hooks/__tests__/useUsuarios.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsuarios } from '../useUsuarios';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/v1/usuarios', () => {
    return HttpResponse.json({
      dados: [
        { id: '1', nome: 'João', email: 'joao@test.com', roles: ['user'], criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() },
      ],
      paginacao: { pagina: 1, limite: 20, total: 1, totalPaginas: 1 },
    });
  }),
  http.post('/api/v1/usuarios', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '2', ...body, roles: ['user'], criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() }, { status: 201 });
  })
);

beforeEach(() => server.listen());
afterEach(() => server.resetHandlers());

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUsuarios', () => {
  it('busca lista de usuários', async () => {
    const { result } = renderHook(() => useUsuarios(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.usuarios).toHaveLength(1);
    expect(result.current.usuarios[0].nome).toBe('João');
  });

  it('cria usuário e invalida cache', async () => {
    const { result } = renderHook(() => useUsuarios(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await result.current.criar({ nome: 'Maria', email: 'maria@test.com', senha: 'senha123' });

    await waitFor(() => expect(result.current.isCriando).toBe(false));
    expect(result.current.usuarios).toHaveLength(2);
  });
});
```

---

## Testes E2E (Playwright)

### Configuração
```typescript
// frontend/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### Fluxo Login
```typescript
// frontend/e2e/auth.login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('deve fazer login com credenciais válidas', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'admin@test.com');
    await page.fill('[data-testid="senha"]', 'admin123');
    await page.click('[data-testid="btn-login"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Admin');
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'admin@test.com');
    await page.fill('[data-testid="senha"]', 'senhaerrada');
    await page.click('[data-testid="btn-login"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Credenciais inválidas');
    await expect(page).toHaveURL('/login');
  });

  test('deve bloquear após 5 tentativas', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.fill('[data-testid="email"]', 'admin@test.com');
      await page.fill('[data-testid="senha"]', `errada${i}`);
      await page.click('[data-testid="btn-login"]');
      await page.waitForSelector('[data-testid="error-message"]');
      await page.reload(); // Reset form
    }
    
    // 6ª tentativa deve ser bloqueada
    await page.fill('[data-testid="email"]', 'admin@test.com');
    await page.fill('[data-testid="senha"]', 'admin123');
    await page.click('[data-testid="btn-login"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Muitas tentativas');
  });
});
```

### CRUD Usuários
```typescript
// frontend/e2e/usuarios.crud.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Gestão de Usuários', () => {
  test.beforeEach(async ({ page }) => {
    // Login como admin
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@test.com');
    await page.fill('[data-testid="senha"]', 'admin123');
    await page.click('[data-testid="btn-login"]');
    await page.goto('/usuarios');
  });

  test('deve listar usuários', async ({ page }) => {
    await expect(page.locator('[data-testid="usuarios-table"]')).toBeVisible();
    await expect(page.locator('text=Admin')).toBeVisible();
  });

  test('deve criar novo usuário', async ({ page }) => {
    await page.click('[data-testid="btn-novo-usuario"]');
    await expect(page).toHaveURL('/usuarios/novo');
    
    await page.fill('[data-testid="nome"]', 'Novo Usuário');
    await page.fill('[data-testid="email"]', 'novo@test.com');
    await page.fill('[data-testid="senha"]', 'senhaSegura123');
    await page.click('[data-testid="btn-salvar"]');
    
    await expect(page).toHaveURL('/usuarios');
    await expect(page.locator('text=Novo Usuário')).toBeVisible();
  });

  test('deve editar usuário', async ({ page }) => {
    await page.click('[data-testid="btn-editar-1"]'); // Editar admin
    await page.fill('[data-testid="nome"]', 'Admin Editado');
    await page.click('[data-testid="btn-salvar"]');
    
    await expect(page.locator('text=Admin Editado')).toBeVisible();
  });

  test('deve impedir usuário comum de acessar /usuarios', async ({ page }) => {
    // Logout
    await page.click('[data-testid="btn-logout"]');
    
    // Login como user
    await page.fill('[data-testid="email"]', 'user@test.com');
    await page.fill('[data-testid="senha"]', 'user123');
    await page.click('[data-testid="btn-login"]');
    
    // Tentar acessar
    await page.goto('/usuarios');
    await expect(page).toHaveURL('/dashboard'); // Redirect ou 403
  });
});
```

---

## Testes de Acessibilidade

### axe-core Integrado
```typescript
// frontend/src/components/__tests__/a11y.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UsuarioCard } from '../forms/UsuarioCard';

expect.extend(toHaveNoViolations);

describe('Acessibilidade - UsuarioCard', () => {
  it('não deve ter violações de acessibilidade', async () => {
    const { container } = render(
      <UsuarioCard 
        usuario={{ id: '1', nome: 'João', email: 'joao@test.com', roles: ['user'], criadoEm: new Date().toISOString(), atualizadoEm: new Date().toISOString() }} 
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Playwright + axe
```typescript
// frontend/e2e/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Acessibilidade E2E', () => {
  test('página de login deve ser acessível', async ({ page }) => {
    await page.goto('/login');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard deve ser acessível', async ({ page }) => {
    // Login primeiro
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@test.com');
    await page.fill('[data-testid="senha"]', 'admin123');
    await page.click('[data-testid="btn-login"]');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

---

## Cenários Obrigatórios

| Cenário | Tipo | Descrição |
|---------|------|-----------|
| **Login válido** | Unit/Integration/E2E | Credenciais corretas → access token + refresh token |
| **Login inválido** | Unit/Integration/E2E | Senha errada → 401, erro genérico (não vazar se email existe) |
| **Login bloqueado** | Integration/E2E | 5 tentativas → 429, bloqueio 15 min |
| **Token expirado** | Integration/E2E | Access token expirado → refresh automático → novo access token |
| **Refresh token expirado** | Integration/E2E | Refresh token expirado → 401 → redirect login |
| **Sem permissão** | Integration/E2E | User sem role → 403 em endpoint admin |
| **Acesso recurso alheio** | Integration/E2E | User A tenta GET /users/:idB → 403/404 |
| **Dados inválidos** | Unit/Integration | Zod validation → 400 com detalhes por campo |
| **Recurso inexistente** | Integration | GET /users/uuid-inexistente → 404 |
| **Falha banco** | Integration | DB indisponível → 503, error handler |
| **Erro inesperado** | Integration | Exception não tratada → 500 genérico, log estruturado |
| **Rate limit** | Integration/E2E | Exceder limite → 429 com Retry-After |
| **Upload inválido** | Integration | Arquivo > 5MB / tipo não permitido → 400 |
| **CSRF** | Integration | Request sem token → 403 (se state-changing) |

---

## Cobertura e Qualidade

### Configuração Vitest
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/__tests__/**',
        '**/e2e/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### CI Pipeline (GitHub Actions Exemplo)
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint-type-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      
      - run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type Check
        run: npm run typecheck
      
      - name: Test (unit + integration)
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/meuapp_test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e:
    runs-on: ubuntu-latest
    needs: lint-type-test
    if: github.event_name == 'pull_request' || github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/meuapp_test

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm audit --audit-level=high
      - name: Snyk test
        uses: snyk/actions/node@master
        if: env.SNYK_TOKEN
```

---

## Métricas e Portas de Qualidade (Quality Gates)

| Métrica | Threshold Mínimo | Ação se Falhar |
|---------|------------------|----------------|
| Cobertura linhas | 80% | Bloquear merge |
| Cobertura branches | 70% | Bloquear merge |
| Testes unitários | 100% pass | Bloquear merge |
| Testes integração | 100% pass | Bloquear merge |
| E2E críticos | 100% pass | Bloquear merge |
| TypeScript errors | 0 | Bloquear merge |
| ESLint errors | 0 | Bloquear merge |
| npm audit high/critical | 0 | Bloquear merge |
| Bundle size (frontend) | < 500KB gzipped | Warning |
| LCP (E2E) | < 2.5s | Warning |
| API p95 latency | < 200ms | Warning |

---

## Dados de Teste (Fixtures/Factories)

```typescript
// tests/factories/usuario.factory.ts
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Usuario, CriarUsuarioDTO } from '@/types/usuario.types';

export const criarUsuarioFactory = (overrides: Partial<CriarUsuarioDTO> = {}): CriarUsuarioDTO => ({
  nome: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  senha: 'SenhaSegura123!',
  roles: ['user'],
  ...overrides,
});

export const criarUsuarioEntity = (overrides: Partial<Usuario> = {}): Usuario => ({
  id: faker.string.uuid(),
  nome: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  senha: 'hash_aqui',
  roles: ['user'],
  criadoEm: faker.date.recent(),
  atualizadoEm: faker.date.recent(),
  deletedAt: null,
  ...overrides,
});

// Uso nos testes
const usuario = criarUsuarioFactory({ email: 'especifico@test.com', roles: ['admin'] });
```

---

## Referências Cruzadas

- `docs/ARQUITETURA.md` - Camadas testáveis (services, controllers, repositories)
- `docs/CODIGO-LIMPO.md` - Testabilidade como critério (DI, funções puras)
- `docs/SEGURANCA.md` - Testes de segurança obrigatórios
- `checklists/TESTES.md` - Checklist executável
- `checklists/ROTEIRO-DE-TESTES.md` - Cenários detalhados com evidências
- `exemplos/arquitetura-modular/backend/src/services/__tests__/` - Exemplos unitários
- `exemplos/arquitetura-modular/backend/src/controllers/__tests__/` - Exemplos integração
- `exemplos/arquitetura-modular/frontend/src/components/__tests__/` - Exemplos componentes
- `exemplos/arquitetura-modular/frontend/e2e/` - Exemplos Playwright