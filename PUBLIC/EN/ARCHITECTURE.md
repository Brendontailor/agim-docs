# Architecture — AGIM

> Mandatory patterns: 9 backend layers + 6 frontend + database.

---

## General Principles

| Principle | Description |
|-----------|-------------|
| **Separation of concerns** | Each layer has a single well-defined responsibility |
| **Dependency inversion** | Inner layers don't depend on outer; interfaces define contracts |
| **Low coupling** | Modules communicate via interfaces/types, not concrete implementations |
| **High cohesion** | Related functionality grouped in same module |
| **Testability** | Each layer independently testable (mocks at boundaries) |
| **Pragmatism** | Don't create intermediate repositories when they don't add real value |

---

## Directory Structure (Monorepo)

```
my-project/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/       # Reusable components (UI)
│   │   ├── pages/            # Pages (main routes)
│   │   ├── layouts/          # Page layouts (wrappers)
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # HTTP services (API client)
│   │   ├── types/            # Types and contracts (shared with backend)
│   │   ├── utils/            # Pure utilities
│   │   ├── contexts/         # React Context (global state when needed)
│   │   ├── styles/           # Global styles, tokens, CSS variables
│   │   ├── main.tsx          # Entry point
│   │   └── App.tsx           # Root component + routing
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/                  # Node.js + Express + TypeScript + Prisma
│   ├── src/
│   │   ├── routes/           # Endpoint definitions + middlewares
│   │   ├── controllers/      # Receive req/res, call services
│   │   ├── services/         # Business rules (use cases)
│   │   ├── validations/      # Input validation (Zod)
│   │   ├── repositories/     # Data access (optional, when adds value)
│   │   ├── middlewares/      # Auth, authZ, error handling, logging, CORS
│   │   ├── config/           # Centralized config + env validation
│   │   ├── types/            # Backend types and contracts
│   │   ├── errors/           # Standardized error classes
│   │   ├── utils/            # Pure backend utilities
│   │   ├── prisma/           # Prisma Client + extensions
│   │   └── app.ts            # Express app factory
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Versioned migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docs/                     # Shared documentation
├── memoria/                  # Continuity system (6 files)
├── checklists/               # 9 mandatory checklists
├── templates/                # 12 reusable templates
├── exemplos/                 # Reference examples
├── scripts/                  # Automation/validation scripts
├── .github/                  # Issue/PR templates, CI workflows
├── package.json              # Workspace root (optional)
├── tsconfig.base.json        # Base TypeScript config
├── .gitignore
├── .editorconfig
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── AGENTS.md                 # Operational instructions
```

---

## Backend — 9 Detailed Layers

### 1. Routes (`src/routes/`)
**Responsibility**: Define HTTP endpoints, apply middlewares, delegate to controllers.

```typescript
// src/routes/users.routes.ts
import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { autenticar } from '../middlewares/autenticar.middleware';
import { autorizar } from '../middlewares/autorizar.middleware';
import { validarCorpo } from '../middlewares/validar.middleware';
import { criarUsuarioSchema, atualizarUsuarioSchema } from '../validations/users.validation';

const router = Router();
const controller = new UsersController();

router.use(autenticar);  // 1. Authentication

router.get('/', autorizar('users:list'), controller.list);
router.get('/:id', autorizar('users:view'), controller.getById);
router.post('/', autorizar('users:create'), validarCorpo(criarUsuarioSchema), controller.create);
router.patch('/:id', autorizar('users:edit'), validarCorpo(atualizarUsuarioSchema), controller.update);
router.delete('/:id', autorizar('users:delete'), controller.delete);

export { router as usersRouter };
```

**Rules**:
- One file per resource/aggregate
- Middleware order: auth → authZ → validation → controller
- Routes **do not** contain business logic
- Names: `{resource}.routes.ts`, named export: `{resource}Router`

---

### 2. Controllers (`src/controllers/`)
**Responsibility**: Receive `Request`/`Response`, extract data, call Service, format HTTP response.

```typescript
// src/controllers/users.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../utils/http-status';

export class UsersController {
  constructor(private readonly service: UsersService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const result = await this.service.list({
        page: Number(page),
        limit: Number(limit),
        search: String(search || ''),
      });
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  // getById, create, update, delete...
}
```

**Rules**:
- One controller per resource/aggregate
- Methods = CRUD operations + specific actions
- **Never** contain business logic
- **Never** access Prisma/repository directly
- Error handling delegates to `next(error)` (centralized middleware)
- Standardized responses via `HTTP_STATUS` constants

---

### 3. Services (`src/services/`)
**Responsibility**: Implement business rules (use cases), orchestrate repositories, validate invariants.

```typescript
// src/services/users.service.ts
import { UsersRepository } from '../repositories/users.repository';
import { HashService } from './hash.service';
import { EventPublisher } from '../utils/event-publisher';
import { UserNotFoundError, EmailAlreadyExistsError } from '../errors/business.errors';
import { CreateUserDTO, UpdateUserDTO, UserResponse } from '../types/user.types';

export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly hashService: HashService,
    private readonly events: EventPublisher
  ) {}

  async list(filters: { page: number; limit: number; search: string }) {
    return this.repository.list(filters);
  }

  async getById(id: string): Promise<UserResponse> {
    const user = await this.repository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    return this.toResponse(user);
  }

  async create(data: CreateUserDTO): Promise<UserResponse> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) throw new EmailAlreadyExistsError(data.email);

    const passwordHash = await this.hashService.hash(data.password);  // Rule: never store plain password

    const user = await this.repository.create({ ...data, password: passwordHash });
    await this.events.publish('user.created', { userId: user.id, email: user.email });
    return this.toResponse(user);
  }

  // update, delete...
  
  private toResponse(user: any): UserResponse {
    const { password: _password, ...rest } = user;
    return rest;  // Never expose password
  }
}
```

**Rules**:
- One service per aggregate/domain
- Receives repositories and other services via DI (constructor)
- Contains **all** business logic: invariant validation, transactions, events
- **Does not** know HTTP (req/res), **does not** throw HTTP errors directly
- Throws domain errors (`AppError` subclasses) that middleware converts
- Methods return response DTOs (no passwords, internal tokens)

---

### 4. Validations (`src/validations/`)
**Responsibility**: Validate input (body, params, query) before reaching controller.

```typescript
// src/validations/users.validation.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    roles: z.array(z.string()).optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    roles: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid ID'),
  }),
});

// Generic middleware
// src/middlewares/validar.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors/business.errors';

export const validate = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError(error.flatten().fieldErrors));
      } else {
        next(error);
      }
    }
  };
```

**Rules**:
- One file per resource
- **Zod** (recommended) for schema validation
- Validate `body`, `params`, `query` separately
- Generic middleware `validate(schema)` applied in routes
- Validation errors → `ValidationError` (400) with per-field details

---

### 5. Repositories (`src/repositories/`)
**Responsibility**: Isolate data access (Prisma/SQL) when it adds value.

```typescript
// src/repositories/users.repository.ts
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListUsersFilters } from '../types/user.types';

export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(filters: ListUsersFilters) {
    const { page, limit, search } = filters;
    const skip = (page - 1) * limit;

    const where = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, roles: true, createdAt: true, updatedAt: true } }),
      this.prisma.user.count({ where }),
    ]);

    return { data: users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // findById, findByEmail, create, update, delete...
}
```

**When to CREATE Repository**:
- Complex queries (joins, aggregations, subqueries)
- Multiple operations in transaction
- Storage abstraction (e.g., migrate Prisma → another ORM)
- Cache logic, soft delete, audit

**When NOT to create** (use Prisma directly in Service):
- Simple CRUD (findUnique, create, update, delete)
- Trivial queries (findMany with simple where)
- No abstraction benefit

---

### 6. Middlewares (`src/middlewares/`)
**Responsibility**: Cross-cutting concerns.

**Mandatory**:
| Middleware | Function |
|------------|----------|
| `autenticar` | Validate JWT/session, attach `req.user` |
| `autorizar` | Check roles/permissions (granular RBAC) |
| `validar` | Validate input (Zod) |
| `errorHandler` | Centralized handling (last middleware) |
| `rateLimiter` | Rate limiting (express-rate-limit) |
| `cors` | Restrictive CORS (explicit allowlist) |
| `helmet` | Security headers |
| `requestLogger` | Structured request logging |

---

### 7. Configuration (`src/config/`)
**Responsibility**: Centralize and validate environment variables (Zod + fail fast).

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('/api/v1'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ARGON2_MEMORY_COST: z.coerce.number().default(19456),
  ARGON2_TIME_COST: z.coerce.number().default(2),
  ARGON2_PARALLELISM: z.coerce.number().default(1),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export const getEnv = (): Env => {
  if (cachedEnv) return cachedEnv;
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
    process.exit(1);  // Fail fast
  }
  cachedEnv = result.data;
  return cachedEnv;
};
```

**Rules**:
- Validate **all** env vars at startup (fail fast)
- Zod schema with types, defaults, clear messages
- Cache validated config (singleton)
- Never access `process.env` directly outside config
- `.env.example` with dummy values in Git; real `.env` in `.gitignore`

---

### 8. Types (`src/types/`)
**Responsibility**: TypeScript contracts shared between layers.

```typescript
// src/types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;  // hash
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO { name: string; email: string; password: string; roles?: string[]; }
export interface UpdateUserDTO { name?: string; email?: string; roles?: string[]; }
export interface ListUsersFilters { page: number; limit: number; search: string; }
export interface ListUsersResponse { data: UserResponse[]; pagination: { page: number; limit: number; total: number; totalPages: number; }; }
```

**Rules**:
- **Input** types (DTOs), **output** (Response), **internal** (Domain/Entity)
- **Never** expose `password`, `token`, sensitive fields in Response types
- Share types between frontend/backend via root `types/` or internal npm package

---

### 9. Error Handling (`src/errors/`)
**Responsibility**: Standardize application errors, prevent information leakage.

```typescript
// src/errors/AppError.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, statusCode: number, code: string, details?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// src/errors/business.errors.ts
export class UnauthenticatedError extends AppError { constructor(message = 'Unauthenticated') { super(message, 401, 'UNAUTHENTICATED'); } }
export class UnauthorizedError extends AppError { constructor(message = 'Unauthorized') { super(message, 403, 'UNAUTHORIZED'); } }
export class NotFoundError extends AppError { constructor(resource: string, id?: string) { super(`${resource}${id ? ` (${id})` : ''} not found`, 404, 'NOT_FOUND', { resource, id }); } }
export class ConflictError extends AppError { constructor(message: string, details?: Record<string, any>) { super(message, 409, 'CONFLICT', details); } }
export class ValidationError extends AppError { constructor(details: Record<string, string[]>) { super('Invalid input data', 400, 'VALIDATION', details); } }
```

**Standard Error Codes**:
| Code | HTTP Status | Use |
|------|-------------|-----|
| `VALIDATION` | 400 | Invalid input data |
| `UNAUTHENTICATED` | 401 | Missing/invalid/expired token |
| `UNAUTHORIZED` | 403 | Insufficient permission |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Uniqueness, invalid state |
| `INTERNAL_ERROR` | 500 | Unhandled error (no stack in production) |

---

## Frontend — 6 Detailed Layers

### `frontend/src/` Structure

```
src/
├── components/           # Reusable components (UI)
│   ├── ui/               # Primitives: Button, Input, Card, Modal, Table, etc.
│   ├── forms/            # Composite form components
│   ├── layout/           # Header, Sidebar, Footer, Container
│   └── feedback/         # Toast, Alert, Spinner, Skeleton
│
├── pages/                # Pages = main routes
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Users/
│   │   ├── List.tsx
│   │   ├── New.tsx
│   │   └── Edit.tsx
│   └── Profile.tsx
│
├── layouts/              # Page wrappers
│   ├── MainLayout.tsx    # With sidebar/header
│   ├── AuthLayout.tsx    # Login/register (no sidebar)
│   └── EmptyLayout.tsx   # For special pages
│
├── hooks/                # Custom hooks
│   ├── useAuth.ts        # Auth state
│   ├── useUsers.ts       # Users CRUD (React Query)
│   ├── useApi.ts         # Typed fetch wrapper
│   └── useDebounce.ts    # Utility
│
├── services/             # API layer (HTTP client)
│   ├── api.ts            # Configured axios/fetch instance
│   ├── auth.api.ts       # Auth endpoints
│   ├── users.api.ts      # Users endpoints
│   └── types.ts          # API request/response types
│
├── types/                # Shared frontend types
│   ├── user.types.ts     # Mirrors backend types
│   └── api.types.ts      # ApiResponse, PaginatedResponse, etc.
│
├── utils/                # Pure functions
│   ├── formatters.ts     # formatDate, formatCurrency, etc.
│   ├── validators.ts     # Client-side validation (Zod schemas)
│   ├── constants.ts      # Enums, static lists
│   └── helpers.ts        # Other utilities
│
├── contexts/             # React Context (minimal global state)
│   ├── AuthContext.tsx   # User, login, logout, token refresh
│   └── ThemeContext.tsx  # Dark/light mode
│
├── styles/               # Global styles
│   ├── globals.css       # Reset, CSS variables, tailwind base
│   └── tokens.css        # Design tokens (colors, spacing, typography)
│
├── routes/               # Routing config (React Router)
│   ├── routes.tsx        # Route definitions + lazy loading
│   └── protected.tsx     # Protected routes wrapper
│
├── main.tsx              # Entry point (Providers, App)
├── App.tsx               # Root component + Router
└── vite-env.d.ts         # Vite types
```

---

### 1. Components (`src/components/`)
**UI Primitives** — shadcn/ui / Radix UI + Tailwind (native accessibility)

```tsx
// src/components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };
    const sizes = { default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3', lg: 'h-11 rounded-md px-8', icon: 'h-10 w-10' };

    return (
      <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

**Rules**:
- Primitives in `components/ui/` (Button, Input, Label, Card, Dialog, etc.)
- Composites in `components/forms/`, `components/layout/`, `components/feedback/`
- Typed props with `ComponentProps` interface
- `forwardRef` for components needing ref
- `cn()` utility for class merging (clsx + tailwind-merge)
- Native accessibility (Radix UI primitives)

---

### 2. Pages (`src/pages/`)
```tsx
// src/pages/Users/List.tsx
import { useUsers } from '@/hooks/useUsers';
import { UserTable } from '@/components/forms/UserTable';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from 'lucide-react';

export function UsersListPage() {
  const { data, isLoading, error, refetch } = useUsers();

  if (isLoading) return <TableSkeleton />;
  if (error) return <Alert variant="destructive">Failed to load users</Alert>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button asChild><a href="/users/new"><PlusIcon className="mr-2 h-4 w-4" /> New User</a></Button>
      </div>
      <UserTable users={data?.data || []} onRefresh={refetch} />
    </div>
  );
}
```

**Rules**:
- One page per main route
- Pages **do not** contain business logic or direct fetch
- Use hooks (`useUsers`) for data
- Compose components from `components/`
- States: loading, error, empty, success

---

### 3. Hooks (`src/hooks/`)
```typescript
// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/users.api';
import { UserResponse, CreateUserDTO, UpdateUserDTO } from '@/types/user.types';

export function useUsers(filters?: { page?: number; limit?: number; search?: string }) {
  return useQuery({ queryKey: ['users', filters], queryFn: () => usersApi.list(filters), placeholderData: (previous) => previous });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (data: CreateUserDTO) => usersApi.create(data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }) });
}

// useUpdateUser, useDeleteUser...
```

**Rules**:
- One hook per resource/feature (`useUsers`, `useAuth`, `useProducts`)
- Encapsulate React Query / SWR / fetch logic
- Return object with: data, isLoading, error, mutations
- Invalidate related queries after mutations
- Complete input/output typing

---

### 4. HTTP Services (`src/services/`)
```typescript
// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, refreshAuthToken, clearAuth } from '@/utils/auth';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api/v1', timeout: 30000, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: auto refresh token
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: Error) => void }> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); }).then((token) => { originalRequest.headers.Authorization = `Bearer ${token}`; return api(originalRequest); });
      originalRequest._retry = true; isRefreshing = true;
      try { const newToken = await refreshAuthToken(); failedQueue.forEach(({ resolve }) => resolve(newToken)); failedQueue = []; originalRequest.headers.Authorization = `Bearer ${newToken}`; return api(originalRequest); }
      catch (refreshError) { failedQueue.forEach(({ reject }) => reject(refreshError as Error)); failedQueue = []; clearAuth(); window.location.href = '/login'; return Promise.reject(refreshError); }
      finally { isRefreshing = false; }
    }
    return Promise.reject(error);
  }
);

export { api };
```

**Rules**:
- Single configured axios/fetch instance (`api.ts`)
- Interceptors: auth token, refresh token, global error handling
- One file per resource (`users.api.ts`, `auth.api.ts`)
- Functions return **only data** (`.then(res => res.data)`)
- Complete request/response typing
- Base URL via `import.meta.env.VITE_API_URL`

---

### 5. Frontend Types (`src/types/`)
Mirrors backend types (or imports from shared package)

---

### 6. State Management

| Complexity | Solution |
|------------|----------|
| Component local state | `useState`, `useReducer` |
| Simple shared state | React Context (`AuthContext`, `ThemeContext`) |
| Server state (cache, sync) | **TanStack Query (React Query)** — standard |
| Complex global state | Zustand / Jotai (evaluate need) |
| Forms | React Hook Form + Zod resolver |

---

## Database (PostgreSQL + Prisma)

### Prisma Schema Example
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model User {
  id        String   @id @default(uuid())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(255)
  password  String   @db.VarChar(255)  // Argon2id hash
  roles     String[] @default(["user"])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([email])
  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique @db.VarChar(500)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
  @@index([userId])
  @@map("refresh_tokens")
}
```

**Rules**:
- Versioned migrations in Git
- Referential integrity (FKs, cascades, indexes)
- Transactions for multi-table operations (`$transaction`)
- Soft delete (`deletedAt`) on sensitive tables
- Automated backup + PITR ≥ 7 days + monthly restore test
- Neon as preferred option (serverless, branching, PITR)

---

## Naming Conventions

| Item | Pattern | Example |
|------|---------|---------|
| Backend files | kebab-case, `.ts` suffix | `users.controller.ts` |
| Backend classes | PascalCase | `UsersController` |
| Backend methods | camelCase, verb + noun | `getById`, `create` |
| Interfaces/types | PascalCase, optional suffix | `UserResponse`, `CreateUserDTO` |
| Enums | PascalCase, singular | `Role`, `UserStatus` |
| Constants | UPPER_SNAKE_CASE | `HTTP_STATUS`, `MAX_UPLOAD_SIZE` |
| Env variables | UPPER_SNAKE_CASE | `DATABASE_URL`, `JWT_SECRET` |
| API routes | kebab-case, plural | `/api/v1/users` |
| React components | PascalCase | `UserTable`, `Button` |
| Hooks | camelCase, `use` prefix | `useUsers`, `useAuth` |
| API services | camelCase, `.api.ts` suffix | `users.api.ts` |

---

## Complete Functional Example: "Users"

See `exemplos/arquitetura-modular/` for complete working reference implementation.

---

## Next Documents

| Document | Focus |
|----------|-------|
| [SECURITY.md](./SECURITY.md) | Mandatory security |
| [TESTING.md](./TESTING.md) | Testing strategy |
| [EXAMPLES.md](./EXAMPLES.md) | Real-world use cases |
| [CONFIGURATION.md](./CONFIGURATION.md) | Complete configuration |