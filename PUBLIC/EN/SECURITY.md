# Security — AGIM

> Non-negotiable rules: Auth, AuthZ, validation, secrets, headers, 15-risk matrix.

---

## Fundamental Principles

| Principle | Description |
|-----------|-------------|
| **Defense in Depth** | Multiple layers; no single layer is sufficient |
| **Least Privilege** | Each component/user has only strictly necessary permissions |
| **Fail Secure** | Errors don't expose sensitive info; default = deny |
| **Backend Validation** | Frontend validates for UX; **Backend is the only real barrier** |
| **No Secrets on Client** | Nothing sensitive in frontend, localStorage, JS-accessible cookies |
| **Continuous Audit** | Structured logs, monitoring, periodic dependency review |

---

## 1. Authentication & Authorization

### 1.1 Password Hashing

```typescript
// ✅ MANDATORY - Argon2id (preferred)
import argon2 from 'argon2';

const hashService = {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,    // 19 MB
      timeCost: 2,          // 2 iterations
      parallelism: 1,       // 1 thread
    });
  },

  async verify(hash: string, password: string): Promise<boolean> {
    try { return await argon2.verify(hash, password); } catch { return false; }
  },

  async needsRehash(hash: string): Promise<boolean> {
    return argon2.needsRehash(hash, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
  },
};

// ⚠️ ACCEPTABLE - bcrypt (fallback if Argon2 unavailable)
import bcrypt from 'bcrypt';
const BCRYPT_ROUNDS = 12;  // Minimum 12 in 2024+
```

**Recommended Argon2id Config (OWASP 2023)**:
| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `memoryCost` | 19456 (19 MB) | GPU/ASIC resistant, fits standard server |
| `timeCost` | 2 | Balances security vs latency (~100ms) |
| `parallelism` | 1 | Single-threaded for maximum resistance |

---

### 1.2 Tokens & Sessions

```typescript
// JWT - Short-lived access (15 min)
const JWT_CONFIG = {
  accessToken: { expiresIn: '15m', algorithm: 'RS256' },  // Asymmetric
  refreshToken: { expiresIn: '7d' },  // Stored in DB with hash, rotation mandatory
};

// Cookies - HttpOnly, Secure, SameSite
const cookieOptions = {
  httpOnly: true,        // Inaccessible via JavaScript (XSS protection)
  secure: true,          // HTTPS only (production)
  sameSite: 'lax',       // CSRF protection (strict for sensitive actions)
  maxAge: 15 * 60 * 1000,
  path: '/',
};

const refreshCookieOptions = {
  ...cookieOptions,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  path: '/auth/refresh',  // Restricted path
};
```

---

### 1.3 Permission Verification (Backend — ALWAYS)

```typescript
// Authorization middleware — MANDATORY on ALL protected routes
export const authorize = (...requiredPermissions: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;  // Set by autenticar middleware
    
    if (!user) return next(new UnauthenticatedError());
    
    const hasPermission = requiredPermissions.some(p => 
      user.permissions.includes(p) || user.roles.includes(p)
    );
    
    if (!hasPermission) {
      logger.warn('Access denied', { userId: user.id, requiredPermissions, ip: req.ip, path: req.path });
      return next(new UnauthorizedError());
    }
    next();
  };

// Route usage — ALWAYS
router.get('/users/:id', autenticar, authorize('users:view'), controller.getById);

// Resource ownership verification (prevents IDOR)
async function getById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const loggedUser = req.user!;
  if (!loggedUser.permissions.includes('admin') && loggedUser.id !== id) {
    return next(new UnauthorizedError('Access denied to this resource'));
  }
  const user = await service.getById(id);
  res.json(user);
}
```

---

### 1.4 Expiration, Rotation & Revocation

| Token | Expiration | Renewal | Revocation |
|-------|------------|---------|------------|
| **Access Token (JWT)** | 15 min | Via Refresh Token | Redis blocklist (optional) / Key rotation |
| **Refresh Token** | 7 days | Rotation per use (new RT invalidates previous) | Delete in DB; invalidate all on password change |
| **Session (stateful)** | 30 min idle / 8h max | Sliding window | Server-side destroy |

```typescript
// Refresh token rotation (MANDATORY)
async function rotateTokens(refreshToken: string): Promise<Tokens> {
  const rtRecord = await refreshTokenRepo.findByTokenHash(await hashService.hash(refreshToken));
  if (!rtRecord || rtRecord.expiresAt < new Date() || rtRecord.revoked) {
    throw new InvalidTokenError('Refresh token invalid or expired');
  }
  await refreshTokenRepo.revoke(rtRecord.id);  // Rotation: revoke current
  const newAccessToken = jwtService.generateAccessToken(rtRecord.userId);
  const newRefreshToken = await refreshTokenRepo.create(rtRecord.userId);
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
```

---

## 2. Input Validation

### Backend = Main Barrier (Zod on ALL endpoints)

```typescript
// src/validations/users.validation.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    roles: z.array(z.string()).optional(),
  }),
});

// Generic middleware applied in routes
export const validate = (schema: AnyZodObject) => async (req, res, next) => {
  try { await schema.parseAsync({ body: req.body, query: req.query, params: req.params }); next(); }
  catch (error) { if (error instanceof ZodError) next(new ValidationError(error.flatten().fieldErrors)); else next(error); }
};
```

### Frontend = UX Only (React Hook Form + Zod)
```tsx
const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
const form = useForm<LoginDTO>({ resolver: zodResolver(schema) });
```

---

## 3. Secrets Management

| Rule | Implementation |
|------|----------------|
| **NEVER in frontend** | Zero `VITE_*`, `NEXT_PUBLIC_*`, localStorage, JS cookies |
| **Real `.env` in `.gitignore`** | Only `.env.example` in Git |
| **Startup validation** | Zod + fail fast (process.exit(1)) |
| **Secret rotation** | Documented in `DECISOES.md`, automated where possible |
| **Detection** | `agim audit` scans `.env`, `.yaml`, `.json`, code |

---

## 4. Security Headers

```typescript
// Helmet + mandatory config
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], imgSrc: ["'self'", "data:", "https:"] } },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },  // 1 year
  frameguard: { action: 'deny' },  // X-Frame-Options: DENY
  noSniff: true,  // X-Content-Type-Options: nosniff
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permissionsPolicy: { features: { camera: [], microphone: [], geolocation: [] } },
}));
```

**Mandatory Headers**:
| Header | Value |
|--------|-------|
| `Content-Security-Policy` | Restrictive (default-src 'self') |
| `Strict-Transport-Security` | max-age=31536000; includeSubDomains; preload |
| `X-Frame-Options` | DENY |
| `X-Content-Type-Options` | nosniff |
| `Referrer-Policy` | strict-origin-when-cross-origin |
| `Permissions-Policy` | Restrictive (camera=(), microphone=(), etc.) |

---

## 5. Rate Limiting

```typescript
// Auth: 5 attempts / 15 min per IP
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many attempts', standardHeaders: true, legacyHeaders: false });

// API: 100 req/min per IP
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 100 });

app.use('/auth', authLimiter);
app.use('/api', apiLimiter);
```

**Response Headers**: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## 6. CORS

```typescript
// Explicit ALLOWLIST — NEVER '*'
const corsOptions = {
  origin: ['https://app.mydomain.com', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## 7. File Upload

```typescript
// Real MIME validation (magic bytes) + allowlist + sanitization
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024;  // 5MB

// Verify magic bytes (don't trust client extension/Content-Type)
const isValidMime = (buffer: Buffer) => {
  const signatures = { jpeg: [0xFF, 0xD8, 0xFF], png: [0x89, 0x50, 0x4E, 0x47], pdf: [0x25, 0x50, 0x44, 0x46] };
  return Object.values(signatures).some(sig => sig.every((byte, i) => buffer[i] === byte));
};

// Image sanitization (removes EXIF, resizes)
const sanitizeImage = async (buffer: Buffer) => sharp(buffer).rotate().resize(1920, 1080, { fit: 'inside' }).toBuffer();

// Private storage + temporary signed URLs (e.g., S3 presigned URL)
```

---

## 8. Database

| Rule | Implementation |
|------|----------------|
| **Dedicated role** | `app_user` (NOT superuser), minimal grants |
| **TLS mandatory** | `sslmode=require` in DATABASE_URL |
| **Soft delete** | `deletedAt` on sensitive tables + `where: { deletedAt: null }` |
| **Constraints** | FKs, unique, check constraints in Prisma schema |
| **Transactions** | `$transaction` for atomic multi-table operations |
| **Backup/PITR** | Neon (serverless, branching, 7 days + monthly restore) |

---

## 9. Error Handling (No Leakage)

```typescript
// Centralized middleware (errorHandler)
export const errorHandler = (error, req, res, next) => {
  // Structured log with sanitization (no passwords, tokens, PII)
  logger.error({ message: error.message, stack: error.stack, path: req.path, method: req.method, userId: req.user?.id });

  if (error instanceof ZodError) return res.status(400).json({ error: 'VALIDATION', message: 'Invalid data', details: error.flatten().fieldErrors });
  if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.code, message: error.message, ...(error.details && { details: error.details }) });
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'UNIQUE_CONFLICT', message: `Record already exists with this ${error.meta?.target}` });
    if (error.code === 'P2025') return res.status(404).json({ error: 'NOT_FOUND', message: 'Record not found' });
  }

  // Production: NO stack trace
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Internal server error', ...(isDev && { stack: error.stack }) });
};
```

---

## 10. Dependencies

```bash
# CI/CD mandatory
npm audit --audit-level=high  # Fails if critical/high
# Or SCA tools: Snyk, Trivy, OWASP Dependency Check
```

**Policy**:
- `npm audit` in CI (blocks critical/high)
- Monthly dependency updates
- `package-lock.json` committed
- License audit (only MIT/Apache/BSD compatible)

---

## 11. Logging & Auditing

```typescript
// Pino/Winston with sanitization
const logger = pino({
  redact: {
    paths: ['req.headers.authorization', 'req.body.password', 'req.body.token', '*.password', '*.token', '*.secret', '*.cpf', '*.cnpj'],
    censor: '[REDACTED]',
  },
});

// Security event logging
logger.warn('Failed login attempt', { email, ip: req.ip, userAgent: req.get('user-agent'), timestamp: new Date().toISOString() });
logger.warn('Unauthorized access', { userId: req.user?.id, path: req.path, requiredPermissions, userPermissions: req.user?.permissions });
```

---

## 12. 15-Risk Matrix (Executable Checklist)

| # | Risk | Automated Check (`agim audit`) |
|---|------|--------------------------------|
| 1 | Weak auth | Argon2id (19456/2/1) or bcrypt ≥12 |
| 2 | Missing authZ | `authorize` middleware on ALL routes |
| 3 | Frontend-only validation | Zod on ALL endpoints |
| 4 | Secrets in frontend | Scans `.env`, `VITE_*`, localStorage |
| 5 | Insecure headers | CSP, HSTS, X-Frame-Options, etc. |
| 6 | Missing rate limit | 5/15min auth, 100/min API |
| 7 | CORS `*` | Explicit allowlist |
| 8 | SQL Injection | Prisma params + concat audit |
| 9 | XSS | `innerHTML`, `eval()`, sanitization |
| 10 | Unsafe upload | Real MIME + allowlist + sharp + signed URLs |
| 11 | Vulnerable deps | `npm audit` + SCA in CI |
| 12 | Logs with PII | Structured sanitization |
| 13 | Missing soft delete | `deletedAt` on sensitive tables |
| 14 | Backup/PITR | Neon (7 days + monthly restore) |
| 15 | DB superuser role | `app_user` role minimal grants |

---

## Single Audit Command

```bash
agim audit
# Scans: auth, authZ, validation, secrets, config, deps, headers, upload, database
# Exit 1 if any critical
# Report in memoria/HISTORICO-DE-EXECUCAO.md
```

---

## Next Documents

| Document | Focus |
|----------|-------|
| [TESTING.md](./TESTING.md) | Testing strategy |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 9+6 layer architecture |
| [EXAMPLES.md](./EXAMPLES.md) | Real-world use cases |
| [CLI-REFERENCE.md](./CLI-REFERENCE.md) | 14 commands |