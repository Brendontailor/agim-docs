# Segurança — AGIM

> Regras inegociáveis: Auth, AuthZ, validação, secrets, headers, matriz 15 riscos.

---

## Princípios Fundamentais

| Princípio | Descrição |
|-----------|-----------|
| **Defesa em Profundidade** | Múltiplas camadas; nenhuma camada única é suficiente |
| **Menor Privilégio** | Cada componente/usuário tem apenas permissões estritamente necessárias |
| **Falha Segura** | Erros não expõem informações sensíveis; padrão = negado |
| **Validação no Backend** | Frontend valida para UX; **Backend é a única barreira real** |
| **Sem Segredos no Cliente** | Nada sensível no frontend, localStorage, cookies acessíveis via JS |
| **Auditoria Contínua** | Logs estruturados, monitoramento, revisão periódica de dependências |

---

## 1. Autenticação e Autorização

### 1.1 Hash de Senhas

```typescript
// ✅ OBRIGATÓRIO - Argon2id (preferencial)
import argon2 from 'argon2';

const hashService = {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,    // 19 MB
      timeCost: 2,          // 2 iterações
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

// ⚠️ ACEITÁVEL - bcrypt (fallback se Argon2 indisponível)
import bcrypt from 'bcrypt';
const BCRYPT_ROUNDS = 12;  // Mínimo 12 em 2024+
```

**Configuração Argon2id Recomendada (OWASP 2023)**:
| Parâmetro | Valor | Justificativa |
|-----------|-------|---------------|
| `memoryCost` | 19456 (19 MB) | Resistente a GPU/ASIC, cabe em servidor padrão |
| `timeCost` | 2 | Balanceia segurança vs latência (~100ms) |
| `parallelism` | 1 | Single-threaded para máxima resistência |

---

### 1.2 Tokens e Sessões

```typescript
// JWT - Acesso de curta duração (15 min)
const JWT_CONFIG = {
  accessToken: { expiresIn: '15m', algorithm: 'RS256' },  // Assimétrico
  refreshToken: { expiresIn: '7d' },  // Armazenado em DB com hash, rotação obrigatória
};

// Cookies - HttpOnly, Secure, SameSite
const cookieOptions = {
  httpOnly: true,        // Inacessível via JavaScript (proteção XSS)
  secure: true,          // Apenas HTTPS (produção)
  sameSite: 'lax',       // Proteção CSRF (strict para ações sensíveis)
  maxAge: 15 * 60 * 1000,
  path: '/',
};

const refreshCookieOptions = {
  ...cookieOptions,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 dias
  path: '/auth/refresh',  // Path restrito
};
```

---

### 1.3 Verificação de Permissões (Backend — SEMPRE)

```typescript
// Middleware de autorização — OBRIGATÓRIO em TODAS rotas protegidas
export const autorizar = (...permissoesRequeridas: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const usuario = req.usuario;  // Setado por middleware autenticar
    
    if (!usuario) return next(new NaoAutenticadoError());
    
    const temPermissao = permissoesRequeridas.some(p => 
      usuario.permissoes.includes(p) || usuario.roles.includes(p)
    );
    
    if (!temPermissao) {
      logger.warn('Acesso negado', { usuarioId: usuario.id, permissoesRequeridas, ip: req.ip, path: req.path });
      return next(new NaoAutorizadoError());
    }
    next();
  };

// Uso nas rotas — SEMPRE
router.get('/usuarios/:id', autenticar, autorizar('usuarios:ver'), controller.obterPorId);

// Verificação de propriedade de recurso (impede IDOR)
async function obterPorId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const usuarioLogado = req.usuario!;
  if (!usuarioLogado.permissoes.includes('admin') && usuarioLogado.id !== id) {
    return next(new NaoAutorizadoError('Acesso negado a este recurso'));
  }
  const usuario = await service.obterPorId(id);
  res.json(usuario);
}
```

---

### 1.4 Expiração, Renovação e Revogação

| Token | Expiração | Renovação | Revogação |
|-------|-----------|-----------|-----------|
| **Access Token (JWT)** | 15 min | Via Refresh Token | Blocklist Redis (opcional) / Troca chave pública |
| **Refresh Token** | 7 dias | Rotação a cada uso (novo RT invalida anterior) | Delete em DB; invalida todos ao trocar senha |
| **Sessão (stateful)** | 30 min idle / 8h max | Sliding window | Destroy server-side |

```typescript
// Refresh token rotation (OBRIGATÓRIO)
async function renovarTokens(refreshToken: string): Promise<Tokens> {
  const rtRecord = await refreshTokenRepo.encontrarPorTokenHash(await hashService.hash(refreshToken));
  if (!rtRecord || rtRecord.expiraEm < new Date() || rtRecord.revogado) {
    throw new TokenInvalidoError('Refresh token inválido ou expirado');
  }
  await refreshTokenRepo.revogar(rtRecord.id);  // Rotação: revoga atual
  const novoAccessToken = jwtService.gerarAccessToken(rtRecord.usuarioId);
  const novoRefreshToken = await refreshTokenRepo.criar(rtRecord.usuarioId);
  return { accessToken: novoAccessToken, refreshToken: novoRefreshToken };
}
```

---

## 2. Validação de Entrada

### Backend = Barreira Principal (Zod em TODOS endpoints)

```typescript
// src/validations/usuarios.validation.ts
import { z } from 'zod';

export const criarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(100),
    email: z.string().email(),
    senha: z.string().min(8),
    roles: z.array(z.string()).optional(),
  }),
});

// Middleware genérico aplicado nas rotas
export const validar = (schema: AnyZodObject) => async (req, res, next) => {
  try { await schema.parseAsync({ body: req.body, query: req.query, params: req.params }); next(); }
  catch (error) { if (error instanceof ZodError) next(new ValidacaoError(error.flatten().fieldErrors)); else next(error); }
};
```

### Frontend = Apenas UX (React Hook Form + Zod)
```tsx
const schema = z.object({ email: z.string().email(), senha: z.string().min(8) });
const form = useForm<LoginDTO>({ resolver: zodResolver(schema) });
```

---

## 3. Gestão de Segredos

| Regra | Implementação |
|-------|---------------|
| **NUNCA no frontend** | Zero `VITE_*`, `NEXT_PUBLIC_*`, localStorage, cookies JS |
| **`.env` real no `.gitignore`** | Apenas `.env.example` no Git |
| **Validação startup** | Zod + fail fast (process.exit(1)) |
| **Rotação de secrets** | Documentada em `DECISOES.md`, automatizada onde possível |
| **Detecção** | `agim audit` varre `.env`, `.yaml`, `.json`, código |

---

## 4. Headers de Segurança

```typescript
// Helmet + configuração obrigatória
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], imgSrc: ["'self'", "data:", "https:"] } },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },  // 1 ano
  frameguard: { action: 'deny' },  // X-Frame-Options: DENY
  noSniff: true,  // X-Content-Type-Options: nosniff
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permissionsPolicy: { features: { camera: [], microphone: [], geolocation: [] } },
}));
```

**Headers Obrigatórios**:
| Header | Valor |
|--------|-------|
| `Content-Security-Policy` | Restritivo (default-src 'self') |
| `Strict-Transport-Security` | max-age=31536000; includeSubDomains; preload |
| `X-Frame-Options` | DENY |
| `X-Content-Type-Options` | nosniff |
| `Referrer-Policy` | strict-origin-when-cross-origin |
| `Permissions-Policy` | Restritivo (camera=(), microphone=(), etc.) |

---

## 5. Rate Limiting

```typescript
// Auth: 5 tentativas / 15 min por IP
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Muitas tentativas', standardHeaders: true, legacyHeaders: false });

// API: 100 req/min por IP
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 100 });

app.use('/auth', authLimiter);
app.use('/api', apiLimiter);
```

**Headers de resposta**: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## 6. CORS

```typescript
// Allowlist EXPLÍCITA — NUNCA '*'
const corsOptions = {
  origin: ['https://app.meudominio.com', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## 7. Upload de Arquivos

```typescript
// Validação MIME real (magic bytes) + allowlist + sanitização
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024;  // 5MB

// Verificar magic bytes (não confiar em extensão/Content-Type do cliente)
const isValidMime = (buffer: Buffer) => {
  const signatures = { jpeg: [0xFF, 0xD8, 0xFF], png: [0x89, 0x50, 0x4E, 0x47], pdf: [0x25, 0x50, 0x44, 0x46] };
  return Object.values(signatures).some(sig => sig.every((byte, i) => buffer[i] === byte));
};

// Sanitização de imagem (remove EXIF, redimensiona)
const sanitizeImage = async (buffer: Buffer) => sharp(buffer).rotate().resize(1920, 1080, { fit: 'inside' }).toBuffer();

// Storage privado + URLs assinadas temporárias (ex: S3 presigned URL)
```

---

## 8. Banco de Dados

| Regra | Implementação |
|-------|---------------|
| **Role dedicada** | `app_user` (NÃO superuser), grants mínimos |
| **TLS obrigatório** | `sslmode=require` no DATABASE_URL |
| **Soft delete** | `deletedAt` em tabelas sensíveis + `where: { deletedAt: null }` |
| **Constraints** | FKs, unique, check constraints no schema Prisma |
| **Transações** | `$transaction` para operações multi-tabela atômicas |
| **Backup/PITR** | Neon (serverless, branching, 7 dias + restore mensal) |

---

## 9. Tratamento de Erros (Sem Vazamento)

```typescript
// Middleware centralizado (errorHandler)
export const errorHandler = (error, req, res, next) => {
  // Log estruturado com sanitização (sem senhas, tokens, PII)
  logger.error({ message: error.message, stack: error.stack, path: req.path, method: req.method, userId: req.usuario?.id });

  if (error instanceof ZodError) return res.status(400).json({ erro: 'VALIDACAO', mensagem: 'Dados inválidos', detalhes: error.flatten().fieldErrors });
  if (error instanceof AppError) return res.status(error.statusCode).json({ erro: error.codigo, mensagem: error.message, ...(error.detalhes && { detalhes: error.detalhes }) });
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return res.status(409).json({ erro: 'CONFLITO_UNICIDADE', mensagem: `Já existe registro com este ${error.meta?.target}` });
    if (error.code === 'P2025') return res.status(404).json({ erro: 'NAO_ENCONTRADO', mensagem: 'Registro não encontrado' });
  }

  // Produção: SEM stack trace
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({ erro: 'ERRO_INTERNO', mensagem: 'Erro interno do servidor', ...(isDev && { stack: error.stack }) });
};
```

---

## 10. Dependências

```bash
# CI/CD obrigatório
npm audit --audit-level=high  # Falha se critical/high
# Ou ferramentas SCA: Snyk, Trivy, OWASP Dependency Check
```

**Política**:
- `npm audit` no CI (bloqueia critical/high)
- Atualização mensal de dependências
- `package-lock.json` commitado
- Auditoria de licenças (apenas MIT/Apache/BSD compatíveis)

---

## 11. Logging e Auditoria

```typescript
// Pino/Winston com sanitização
const logger = pino({
  redact: {
    paths: ['req.headers.authorization', 'req.body.senha', 'req.body.password', 'req.body.token', '*.senha', '*.password', '*.token', '*.secret', '*.cpf', '*.cnpj'],
    censor: '[REDACTED]',
  },
});

// Log de eventos de segurança
logger.warn('Tentativa de login falhada', { email, ip: req.ip, userAgent: req.get('user-agent'), timestamp: new Date().toISOString() });
logger.warn('Acesso não autorizado', { userId: req.usuario?.id, path: req.path, requiredPermissions, userPermissions: req.usuario?.permissoes });
```

---

## 12. Matriz 15 Riscos (Checklist Executável)

| # | Risco | Verificação Automatizada (`agim audit`) |
|---|-------|------------------------------------------|
| 1 | Auth fraco | Argon2id (19456/2/1) ou bcrypt ≥12 |
| 2 | AuthZ ausente | Middleware `autorizar` em TODAS rotas |
| 3 | Validação só frontend | Zod em TODOS endpoints |
| 4 | Secrets no frontend | Varredura `.env`, `VITE_*`, localStorage |
| 5 | Headers inseguros | CSP, HSTS, X-Frame-Options, etc. |
| 6 | Rate limiting ausente | 5/15min auth, 100/min API |
| 7 | CORS `*` | Allowlist explícita |
| 8 | SQL Injection | Prisma params + audit concatenação |
| 9 | XSS | `innerHTML`, `eval()`, sanitização |
| 10 | Upload inseguro | MIME real + allowlist + sharp + URLs assinadas |
| 11 | Deps vulneráveis | `npm audit` + SCA no CI |
| 12 | Logs com PII | Sanitização estruturada |
| 13 | Soft delete ausente | `deletedAt` em tabelas sensíveis |
| 14 | Backup/PITR | Neon (7 dias + restore mensal) |
| 15 | Role DB superuser | Role `app_user` grants mínimos |

---

## Comando de Auditoria Único

```bash
agim audit
# Varre: auth, authZ, validação, secrets, config, deps, headers, upload, banco
# Exit 1 se qualquer crítico
# Relatório em memoria/HISTORICO-DE-EXECUCAO.md
```

---

## Próximos Documentos

| Documento | Foco |
|-----------|------|
| [TESTING.md](./TESTING.md) | Estratégia de testes |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura 9+6 camadas |
| [EXAMPLES.md](./EXAMPLES.md) | Casos de uso reais |
| [CLI-REFERENCE.md](./CLI-REFERENCE.md) | 14 comandos |