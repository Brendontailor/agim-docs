# Segurança Obrigatória

> Regras inegociáveis de segurança para todos os projetos baseados neste repositório.
> Baseada na Seção 6 da missão: "SEGURANÇA OBRIGATÓRIA".

---

## Princípios Fundamentais

| Princípio | Descrição |
|-----------|-----------|
| **Defesa em Profundidade** | Múltiplas camadas de proteção; nenhuma camada única é suficiente |
| **Menor Privilégio** | Cada componente/usuário tem apenas permissões estritamente necessárias |
| **Falha Segura** | Erros não expõem informações sensíveis; estado padrão = negado |
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
  async hash(senha: string): Promise<string> {
    // Argon2id: memory=19MB, time=2, parallelism=1 (OWASP 2023)
    return argon2.hash(senha, {
      type: argon2.argon2id,
      memoryCost: 19456,    // 19 MB
      timeCost: 2,          // 2 iterações
      parallelism: 1,       // 1 thread
    });
  },

  async verificar(hash: string, senha: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, senha);
    } catch {
      return false;
    }
  },

  // Verificar se hash precisa ser atualizado (parâmetros mudaram)
  async precisaRehash(hash: string): Promise<boolean> {
    return argon2.needsRehash(hash, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  },
};

// ⚠️ ACEITÁVEL - bcrypt (fallback se Argon2 indisponível)
import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12; // Mínimo 12 em 2024+

const hashServiceBcrypt = {
  async hash(senha: string): Promise<string> {
    return bcrypt.hash(senha, BCRYPT_ROUNDS);
  },
  async verificar(hash: string, senha: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  },
};

// ❌ PROIBIDO - Senha em texto puro, MD5, SHA1, SHA256 sem salt, criptografia reversível
```

**Configuração Argon2id Recomendada (OWASP 2023)**:
| Parâmetro | Valor | Justificativa |
|-----------|-------|---------------|
| `memoryCost` | 19456 (19 MB) | Resistente a GPU/ASIC, cabe em servidor padrão |
| `timeCost` | 2 | Balanceia segurança vs latência (~100ms) |
| `parallelism` | 1 | Single-threaded para máxima resistência |

### 1.2 Tokens e Sessões

```typescript
// JWT - Acesso de curta duração (15 min)
const JWT_CONFIG = {
  accessToken: {
    expiresIn: '15m',
    algorithm: 'RS256', // Assimétrico - chave privada assina, pública verifica
  },
  refreshToken: {
    expiresIn: '7d',
    // Armazenado em DB com hash (não JWT), rotação obrigatória
  },
};

// Cookies - HttpOnly, Secure, SameSite
const cookieOptions = {
  httpOnly: true,        // Inacessível via JavaScript (XSS protection)
  secure: true,          // Apenas HTTPS (produção)
  sameSite: 'lax',       // CSRF protection (strict para ações sensíveis)
  maxAge: 15 * 60 * 1000, // 15 min para access token cookie
  path: '/',
};

// Refresh token em cookie separado (httpOnly, secure, sameSite: strict)
const refreshCookieOptions = {
  ...cookieOptions,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  path: '/auth/refresh', // Path restrito
};
```

### 1.3 Verificação de Permissões (Backend - SEMPRE)

```typescript
// Middleware de autorização - OBRIGATÓRIO em TODAS rotas protegidas
export const autorizar = (...permissoesRequeridas: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const usuario = req.usuario; // Setado por middleware autenticar
    
    if (!usuario) {
      return next(new NaoAutenticadoError());
    }
    
    // Verificação RBAC (Role-Based Access Control)
    const temPermissao = permissoesRequeridas.some(p => 
      usuario.permissoes.includes(p) || usuario.roles.includes(p)
    );
    
    if (!temPermissao) {
      // Log tentativa de acesso não autorizado
      logger.warn('Acesso negado', {
        usuarioId: usuario.id,
        permissoesRequeridas,
        permissoesUsuario: usuario.permissoes,
        ip: req.ip,
        path: req.path,
      });
      return next(new NaoAutorizadoError());
    }
    
    next();
  };

// Uso nas rotas - SEMPRE
router.get('/usuarios/:id', 
  autenticar,                    // 1. Autentica
  autorizar('usuarios:ver'),     // 2. Autoriza (OBRIGATÓRIO)
  controller.obterPorId
);

// Verificação de propriedade de recurso (impede acesso a dados de outros)
async function obterPorId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const usuarioLogado = req.usuario!;
  
  // Admin pode ver qualquer; usuário comum só o próprio
  if (!usuarioLogado.permissoes.includes('admin') && usuarioLogado.id !== id) {
    return next(new NaoAutorizadoError('Acesso negado a este recurso'));
  }
  
  const usuario = await service.obterPorId(id);
  res.json(usuario);
}
```

### 1.4 Expiração, Renovação e Revogação

| Token | Expiração | Renovação | Revogação |
|-------|-----------|-----------|-----------|
| **Access Token (JWT)** | 15 min | Via Refresh Token | Blocklist em Redis (opcional) / Troca chave pública |
| **Refresh Token** | 7 dias | Rotação a cada uso (novo RT invalidando anterior) | Delete em DB; invalida todos ao trocar senha |
| **Sessão (se stateful)** | 30 min idle / 8h max | Sliding window | Destroy server-side |

```typescript
// Refresh token rotation (OBRIGATÓRIO)
async function renovarTokens(refreshToken: string): Promise<Tokens> {
  // 1. Buscar RT no DB (hash armazenado)
  const rtRecord = await refreshTokenRepo.encontrarPorTokenHash(
    await hashService.hash(refreshToken)
  );
  
  if (!rtRecord || rtRecord.expiraEm < new Date() || rtRecord.revogado) {
    throw new TokenInvalidoError('Refresh token inválido ou expirado');
  }
  
  // 2. Revogar RT atual (rotação)
  await refreshTokenRepo.revogar(rtRecord.id);
  
  // 3. Gerar novos tokens
  const novoAccessToken = jwtService.gerarAccessToken(rtRecord.usuarioId);
  const novoRefreshToken = await refreshTokenRepo.criar(rtRecord.usuarioId);
  
  // 4. Invalidar access tokens anteriores se necessário (opcional)
  // await jwtService.adicionarBlocklist(rtRecord.usuarioId, rtRecord.criadoEm);
  
  return { accessToken: novoAccessToken, refreshToken: novoRefreshToken };
}
```

---

## 2. Proteção da Aplicação

### 2.1 Validação de Entrada (Backend = Barreira Principal)

```typescript
// Zod schemas - SEMPRE validar no backend
const criarUsuarioSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(100).regex(/^[a-zA-ZÀ-ÿ\s]+$/),
    email: z.string().email().toLowerCase(),
    senha: z.string().min(8).max(128)
      .regex(/[A-Z]/, 'Deve conter maiúscula')
      .regex(/[a-z]/, 'Deve conter minúscula')
      .regex(/[0-9]/, 'Deve conter número')
      .regex(/[^A-Za-z0-9]/, 'Deve conter caractere especial'),
    cpf: z.string().regex(/^\d{11}$/).refine(validarCPF, 'CPF inválido').optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

// Sanitização de saída (prevenção XSS)
import DOMPurify from 'isomorphic-dompurify';

function sanitizarHtml(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

// Middleware genérico
export const validar = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidacaoError(error.flatten().fieldErrors));
      } else {
        next(error);
      }
    }
  };
```

### 2.2 Proteção contra Ataques Comuns

| Ataque | Proteção Backend | Proteção Frontend |
|--------|------------------|-------------------|
| **SQL Injection** | Prisma ORM (parameterized queries) / Nunca raw SQL com concatenação | N/A |
| **XSS** | Sanitização saída; CSP headers; HttpOnly cookies | React auto-escape; DOMPurify se `dangerouslySetInnerHTML` |
| **CSRF** | SameSite cookies; Double-submit token para state-changing | SameSite lax/strict; CSRF token em forms |
| **SSRF** | Validar URLs (allowlist); Não fazer fetch para URLs user-controlled | N/A |
| **Abuso Endpoint** | Rate limiting; Autenticação obrigatória; Validação rigorosa | Debounce; Loading states |

### 2.3 Rate Limiting

```typescript
// express-rate-limit - OBRIGATÓRIO em endpoints sensíveis
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // 5 tentativas por IP
  message: { erro: 'RATE_LIMIT', mensagem: 'Muitas tentativas. Tente novamente em 15 min.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip, // ou userId se autenticado
  skipSuccessfulRequests: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 100, // 100 req/min por IP
  message: { erro: 'RATE_LIMIT', mensagem: 'Limite de requisições excedido' },
});

// Aplicar
router.post('/auth/login', authLimiter, controller.login);
router.post('/auth/register', authLimiter, controller.register);
router.use('/api/', apiLimiter); // Global para API
```

### 2.4 CORS Restritivo

```typescript
// cors - NUNCA usar '*' em produção
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://app.meudominio.com',
      'https://admin.meudominio.com',
      'http://localhost:5173', // dev apenas
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true, // Permite cookies
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight 24h
};
```

### 2.5 Headers de Segurança (Helmet.js)

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Ajustar para produção
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.meudominio.com'],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Ajustar se necessário
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  noSniff: true,
  xssFilter: true,
  frameguard: { action: 'deny' },
}));
```

### 2.6 Limitação de Tentativas de Autenticação

```typescript
// Implementação com Redis (recomendado para escala) ou memória
const tentativasLogin = new Map<string, { count: number; bloqueadoAte: Date }>();

export const limiterTentativasLogin = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const agora = new Date();
  const registro = tentativasLogin.get(ip);
  
  if (registro && registro.bloqueadoAte > agora) {
    return res.status(429).json({
      erro: 'CONTA_BLOQUEADA',
      mensagem: `Conta temporariamente bloqueada. Tente novamente às ${registro.bloqueadoAte.toLocaleTimeString('pt-BR')}`,
    });
  }
  
  // Middleware continua, controller incrementa em caso de falha
  next();
};

// No controller de login
async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // ... lógica login ...
  } catch (error) {
    if (error instanceof CredenciaisInvalidasError) {
      const ip = req.ip;
      const registro = tentativasLogin.get(ip) || { count: 0, bloqueadoAte: new Date() };
      registro.count++;
      
      if (registro.count >= 5) {
        registro.bloqueadoAte = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      }
      tentativasLogin.set(ip, registro);
    }
    next(error);
  }
}
```

### 2.7 Tratamento Seguro de Exceções

```typescript
// Middleware error handler - NUNCA vazar stack trace em produção
export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  // Log estruturado (sem dados sensíveis)
  logger.error('Erro não tratado', {
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method,
    userId: req.usuario?.id,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Erros conhecidos -> resposta controlada
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      erro: error.codigo,
      mensagem: error.message,
      ...(error.detalhes && process.env.NODE_ENV === 'development' && { detalhes: error.detalhes }),
    });
  }

  // Erro desconhecido -> genérico
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({
    erro: 'ERRO_INTERNO',
    mensagem: 'Erro interno do servidor',
    ...(isDev && { stack: error.stack }),
  });
};
```

### 2.8 Controle de Acesso a Recursos

```typescript
// Política: Usuário só acessa próprios recursos (exceto admins)
async function autorizarAcessoRecurso(
  usuarioId: string,
  recursoDonoId: string,
  permissoes: string[]
): Promise<void> {
  const ehAdmin = permissoes.includes('admin');
  const ehDono = usuarioId === recursoDonoId;
  
  if (!ehAdmin && !ehDono) {
    throw new NaoAutorizadoError('Acesso negado a este recurso');
  }
}

// Uso no service
async function atualizarUsuario(usuarioId: string, dados: AtualizarDTO, requester: UsuarioLogado) {
  await autorizarAcessoRecurso(requester.id, usuarioId, requester.permissoes);
  // ... lógica atualização
}
```

### 2.9 Proteção de Uploads

```typescript
// Multer com validações rigorosas
const upload = multer({
  storage: multer.memoryStorage(), // Não salvar direto no disco
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Validar MIME type real (não confiar em extensão)
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Tipo de arquivo não permitido'), false);
    }
    cb(null, true);
  },
});

// Processamento seguro
async function processarUpload(file: Express.Multer.File): Promise<UploadResultado> {
  // 1. Validar assinatura do arquivo (magic bytes)
  const tipoReal = await detectarTipoArquivo(file.buffer);
  if (!['jpeg', 'png', 'webp', 'pdf'].includes(tipoReal)) {
    throw new Error('Arquivo inválido');
  }
  
  // 2. Sanitizar (remover metadata EXIF, etc.)
  const bufferSanitizado = await sanitizarArquivo(file.buffer, tipoReal);
  
  // 3. Upload para storage seguro (S3, Cloudflare R2, etc.) com ACL privada
  const url = await storageService.upload(bufferSanitizado, {
    contentType: file.mimetype,
    acl: 'private',
    key: `uploads/${uuidv4()}.${tipoReal}`,
  });
  
  // 4. Gerar URL assinada temporária para acesso
  const signedUrl = await storageService.getSignedUrl(url, 3600); // 1h
  
  return { url: signedUrl, tipo: tipoReal };
}
```

---

## 3. Segredos e Configuração

### 3.1 Regras Absolutas

| Regra | Descrição |
|-------|-----------|
| **NUNCA** commitar `.env` real | Use `.env.example` com valores fictícios no Git |
| **NUNCA** segredos no frontend | Variáveis `VITE_*` são públicas no bundle |
| **NUNCA** logs de senhas/tokens | Sanitizar antes de logar |
| **SEMPRE** validar env no startup | Fail fast se variável obrigatória ausente |
| **SEMPRE** rotacionar segredos periodicamente | Políticas de rotação documentadas |

### 3.2 Estrutura `.env.example`

```bash
# .env.example - COMMITADO NO GIT (valores fictícios)

# App
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/meudb?schema=public

# JWT (chaves assimétricas recomendadas)
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD...\n-----END PRIVATE KEY-----
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Argon2
ARGON2_MEMORY_COST=19456
ARGON2_TIME_COST=2
ARGON2_PARALLELISM=1

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limit
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Storage (ex: S3/R2)
STORAGE_ENDPOINT=https://account.r2.cloudflarestorage.com
STORAGE_ACCESS_KEY_ID=fake-access-key
STORAGE_SECRET_ACCESS_KEY=fake-secret-key
STORAGE_BUCKET=meu-bucket
STORAGE_PUBLIC_URL=https://cdn.meudominio.com

# Email (ex: Resend, SendGrid)
EMAIL_API_KEY=re_fake-key
EMAIL_FROM=noreply@meudominio.com

# Observabilidade (opcional)
SENTRY_DSN=
LOG_LEVEL=info
```

### 3.3 Validação no Startup (Fail Fast)

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string().min(100, 'Chave privada JWT inválida'),
  JWT_PUBLIC_KEY: z.string().min(50, 'Chave pública JWT inválida'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ARGON2_MEMORY_COST: z.coerce.number().default(19456),
  ARGON2_TIME_COST: z.coerce.number().default(2),
  ARGON2_PARALLELISM: z.coerce.number().default(1),
  CORS_ORIGIN: z.string().url(),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (cachedEnv) return cachedEnv;
  
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Variáveis de ambiente inválidas:');
    console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
    process.exit(1); // FAIL FAST
  }
  
  cachedEnv = result.data;
  return cachedEnv;
}
```

---

## 4. Banco de Dados (PostgreSQL + Prisma)

### 4.1 Prisma Seguro

```typescript
// Prisma Client com extensões de segurança
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
}).$extends({
  // Middleware para soft delete automático
  query: {
    async $allModels($allModels) {
      return async (args) => {
        // Adicionar deletedAt: null automaticamente em findMany/findUnique
        if (args.action === 'findMany' || args.action === 'findUnique') {
          args.args.where = { ...args.args.where, deletedAt: null };
        }
        return $allModels(args);
      };
    },
  },
});

// Transações para operações atômicas
async function transferirCreditos(de: string, para: string, valor: number) {
  return prisma.$transaction(async (tx) => {
    const origem = await tx.conta.findUnique({ where: { id: de }, lock: true });
    if (!origem || origem.saldo < valor) throw new Error('Saldo insuficiente');
    
    await tx.conta.update({ where: { id: de }, data: { saldo: { decrement: valor } } });
    await tx.conta.update({ where: { id: para }, data: { saldo: { increment: valor } } });
    
    await tx.transacao.create({ data: { de, para, valor, tipo: 'TRANSFERENCIA' } });
  });
}
```

### 4.2 Constraints e Integridade Referencial

```prisma
// schema.prisma - Constraints no nível do banco
model Usuario {
  id        String   @id @default(uuid())
  email     String   @unique @db.VarChar(255)
  nome      String   @db.VarChar(100)
  senha     String   @db.VarChar(255)
  roles     String[] @default(["user"])
  criadoEm  DateTime @default(now())
  atualizadoEm DateTime @updatedAt
  deletedAt DateTime? // Soft delete
  
  @@index([email])
  @@index([deletedAt])
  @@map("usuarios")
}

model RefreshToken {
  id        String   @id @default(uuid())
  tokenHash String   @unique @db.VarChar(255) // Hash do token, não token puro
  usuarioId String
  usuario   Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  expiraEm  DateTime
  revogado  Boolean  @default(false)
  criadoEm  DateTime @default(now())
  
  @@index([usuarioId])
  @@index([expiraEm])
  @@map("refresh_tokens")
}
```

### 4.3 Permissões Mínimas do Banco

```sql
-- Usuário da aplicação (NÃO superuser)
CREATE ROLE app_user WITH LOGIN PASSWORD 'senha_forte';
GRANT CONNECT ON DATABASE meu_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Permissões específicas por tabela
GRANT SELECT, INSERT, UPDATE, DELETE ON usuarios TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON refresh_tokens TO app_user;
-- NÃO dar: TRUNCATE, DROP, ALTER, CREATE, GRANT

-- Sequences (para UUIDs não precisa, mas se usar serial)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

### 4.4 Migrations em Produção

```bash
# Checklist deploy migration
# 1. Backup do banco ANTES
pg_dump -h host -U user -d meu_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Revisar migration SQL gerada
npx prisma migrate diff --from-migrations ./prisma/migrations --to-schema-datamodel ./prisma/schema.prisma --script > migration_review.sql

# 3. Aplicar em janela de manutenção
npx prisma migrate deploy

# 4. Verificar integridade pós-deploy
npx prisma db seed # se aplicável
```

### 4.5 Backup e Recuperação

| Aspecto | Estratégia |
|---------|------------|
| **Frequência** | Diário (automático via provedor - Neon, RDS, etc.) |
| **Retenção** | 30 dias (diários) + 12 meses (semanais) + 7 anos (mensais) |
| **Teste Restore** | Mensal (procedimento descrito na secao de backup deste documento) |
| **Point-in-Time** | Habilitado (PITR - 7 dias mínimo) |
| **Criptografia** | Em repouso (AES-256) e em trânsito (TLS 1.3) |

---

## 5. Matriz de Riscos

| ID | Risco | Severidade | Impacto | Evidência | Mitigação | Estado |
|----|-------|------------|---------|-----------|-----------|--------|
| R01 | Senha em texto puro no banco | CRÍTICO | Total comprometimento contas | Auditoria código | Argon2id obrigatório; code review bloqueia merge sem hash | MITIGADO |
| R02 | JWT secret fraco/compartilhado | ALTO | Falsificação tokens | Revisão config | Chaves assimétricas RS256; rotação anual; env validation | MITIGADO |
| R03 | Ausência de rate limit auth | ALTO | Brute force credenciais | Testes penetração | Rate limit 5 tent/15min por IP; blocklist progressiva | MITIGADO |
| R04 | CORS `*` em produção | MÉDIO | Ataques cross-origin | Configuração | CORS restritivo com allowlist explícita | MITIGADO |
| R05 | XSS via input não sanitizado | ALTO | Roubo sessão, defacement | Code review; SAST | Zod validation + DOMPurify output; CSP headers | MITIGADO |
| R06 | SQL Injection via raw query | CRÍTICO | Vazamento/alteração dados | Code review | Prisma ORM only; ban raw SQL sem parameterização | MITIGADO |
| R07 | Segredos no frontend (VITE_) | CRÍTICO | Exposição chaves API, DB | Build analysis | Revisão build; env validation; .gitignore .env | MITIGADO |
| R08 | Logs com dados sensíveis | MÉDIO | Vazamento em logs | Auditoria logs | Structured logger com sanitização; deny list campos | MITIGADO |
| R09 | Upload de arquivo malicioso | ALTO | RCE, armazenamento ilegal | Testes upload | Validação MIME + magic bytes; sanitização; storage privado | MITIGADO |
| R10 | Acesso indevido a recursos (IDOR) | ALTO | Vazamento dados outros usuários | Testes autorização | Middleware autorizar + verificação propriedade recurso | MITIGADO |
| R11 | Dependências vulneráveis | MÉDIO | Supply chain attack | npm audit / Snyk | `npm audit` no CI; dependabot; revisão mensal | MITIGADO |
| R12 | Falha backup / restore não testado | ALTO | Perda irreversível dados | Documentação | Backup automático + teste restore mensal documentado | PENDENTE |
| R13 | CSRF em formulários state-changing | MÉDIO | Ações não autorizadas | Code review | SameSite cookies + double-submit token | MITIGADO |
| R14 | SSRF via URL user-controlled | MÉDIO | Acesso rede interna | Code review | Allowlist domínios; não fetch URLs user input | MITIGADO |
| R15 | Permissões banco excessivas | MÉDIO | Escalação privilégio | Auditoria DB | Role app_user com grants mínimos; sem superuser | MITIGADO |

**Legenda Estado**: `MITIGADO` = Controle implementado e verificado | `PENDENTE` = Requer ação | `ACEITO` = Risco residual aceito com justificativa

---

## 6. Checklist de Segurança por Fase

### Desenvolvimento
- [ ] Argon2id configurado com parâmetros OWASP
- [ ] JWT com chaves assimétricas (RS256)
- [ ] Refresh token com rotação e hash no DB
- [ ] Cookies HttpOnly, Secure, SameSite
- [ ] Validação Zod em TODAS entradas backend
- [ ] Rate limiting em auth e API
- [ ] CORS restritivo (allowlist)
- [ ] Helmet.js com CSP configurado
- [ ] Middleware autorizar em TODAS rotas protegidas
- [ ] Verificação propriedade recurso (IDOR prevention)
- [ ] Upload: validação MIME + magic bytes + sanitização
- [ ] Error handler sem stack trace em produção
- [ ] .env.example no Git; .env no .gitignore
- [ ] Validação env no startup (fail fast)
- [ ] Prisma com soft delete, constraints, transações
- [ ] Role DB com permissões mínimas

### Code Review
- [ ] Nenhum `console.log` com dados sensíveis
- [ ] Nenhum `any` em código de segurança
- [ ] Nenhum raw SQL sem parameterização
- [ ] Nenhum segredo hardcoded
- [ ] Testes de autorização para cada endpoint

### Pré-Deploy
- [ ] `npm audit` / `pnpm audit` passa (0 high/critical)
- [ ] Dependabot/Snyk configurado
- [ ] Backup testado nos últimos 30 dias
- [ ] Variáveis produção validadas
- [ ] CSP testado (report-only → enforce)
- [ ] Rate limits ajustados para carga esperada

### Pós-Deploy
- [ ] Monitoramento alertas: tentativas login falhas, erros 5xx, rate limit hits
- [ ] Logs estruturados chegando ao agregador
- [ ] Certificados TLS válidos (expiração > 30 dias)
- [ ] Headers segurança presentes (securityheaders.com)

---

## Referências Cruzadas

- `docs/ARQUITETURA.md` - Middlewares auth, error handling, config
- `docs/CODIGO-LIMPO.md` - Tratamento erros, validação, tipagem
- `docs/TESTES.md` - Testes de segurança (auth, authZ, validação)
- `checklists/SEGURANCA.md` - Checklist executável
- `templates/AUDITORIA-SEGURANCA.md` - Template para auditoria completa
- `exemplos/arquitetura-modular/backend/src/middlewares/` - Implementação de referência