# Checklist de Segurança

> Checklist executável para auditoria de segurança. Use em: desenvolvimento, code review, pré-deploy, pós-incidente.
> Marque `[x]` quando verificado, `[~]` se parcialmente atendido (registrar observação), `[ ]` se não aplicável.

---

## Autenticação

### Hash de Senhas
- [ ] Argon2id configurado (memoryCost ≥ 19456, timeCost ≥ 2, parallelism ≥ 1)
- [ ] Fallback bcrypt apenas se Argon2 indisponível (rounds ≥ 12)
- [ ] Função `precisaRehash()` implementada para migração futura
- [ ] Nenhuma senha armazenada em texto puro, MD5, SHA1, SHA256 simples
- [ ] Testes unitários cobrem hash/verificação/regex senha

### Tokens JWT
- [ ] Access Token: expiração ≤ 15 min, algoritmo RS256 (assimétrico)
- [ ] Refresh Token: expiração ≤ 7 dias, armazenado com hash no DB
- [ ] Rotação de Refresh Token a cada uso (invalida anterior)
- [ ] Revogação em troca de senha / logout / admin action
- [ ] Chaves privadas/públicas em env (não hardcoded), validadas no startup
- [ ] Blocklist/denylist para access tokens revogados (opcional mas recomendado)

### Cookies e Sessões
- [ ] Access Token cookie: `HttpOnly`, `Secure`, `SameSite: lax`, `maxAge` 15min
- [ ] Refresh Token cookie: `HttpOnly`, `Secure`, `SameSite: strict`, path restrito (`/auth/refresh`)
- [ ] Cookies não acessíveis via JavaScript (XSS protection)
- [ ] Em desenvolvimento: `Secure: false` apenas para localhost HTTP

### Fluxos Auth
- [ ] Login: rate limit 5 tentativas / 15 min por IP
- [ ] Registro: rate limit, validação email único, senha forte (Zod)
- [ ] Logout: revoga refresh token, limpa cookies
- [ ] Refresh: rotação, validação expiração/revogação, novo access token
- [ ] Esqueci senha: token temporário (1h), uso único, rate limit
- [ ] MFA/2FA: TOTP (RFC 6238) ou WebAuthn (opcional mas recomendado)

---

## Autorização

### Middleware e Verificações
- [ ] Middleware `autenticar` em TODAS rotas protegidas (ordem: 1º)
- [ ] Middleware `autorizar('permissao:acao')` em TODAS rotas protegidas (ordem: 2º)
- [ ] Permissões baseadas em roles/claims (RBAC), não hardcoded user IDs
- [ ] Verificação de propriedade de recurso (IDOR prevention) em:
  - [ ] GET /recursos/:id
  - [ ] PATCH /recursos/:id
  - [ ] DELETE /recursos/:id
  - [ ] Qualquer ação que modifique/leia recurso específico
- [ ] Admin bypass documentado e auditado (logs de ações admin)

### Controle de Acesso
- [ ] Matriz de permissões documentada (role × recurso × ação)
- [ ] Princípio menor privilégio: roles granulares (`usuarios:ver`, `usuarios:criar`, `usuarios:editar`, `usuarios:excluir`)
- [ ] Nenhum endpoint sensível sem autorização explícita
- [ ] Testes de autorização: 403 para sem permissão, 404 para não dono (não vazar existência)

---

## Validação e Sanitização

### Entrada (Backend - Barreira Principal)
- [ ] Zod schemas para TODOS endpoints (body, params, query)
- [ ] Validação: tipo, formato, tamanho, range, regex, custom refinements
- [ ] Sanitização: strings (trim, escape HTML), números (clamp), arrays (max items)
- [ ] Rejeição de campos extras (`strict()` ou `passthrough()` controlado)
- [ ] Validação de unicidade (email, CPF, etc.) no service ANTES de persistir
- [ ] Validação de integridade referencial (FKs existem) no service

### Saída (Prevenção XSS)
- [ ] React auto-escape (padrão) - não usar `dangerouslySetInnerHTML` sem DOMPurify
- [ ] DOMPurify configurado se HTML user-generated necessário
- [ ] CSP headers configurados (script-src, style-src, img-src, connect-src)
- [ ] Headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`

### Proteção Ataques Específicos
- [ ] SQL Injection: Apenas Prisma ORM / parameterized queries; raw SQL proibido
- [ ] CSRF: SameSite cookies + double-submit token para forms state-changing
- [ ] SSRF: Allowlist domínios para fetch externos; não fetch URLs user input
- [ ] Path Traversal: Validação paths upload; `path.resolve()` + verificação prefixo
- [ ] XXE: Desabilitado no parser XML (se usar)
- [ ] Prototype Pollution: `Object.freeze()` em objetos config; validação keys

---

## Rate Limiting e DoS

- [ ] Rate limit global API: 100 req/min/IP (ajustável)
- [ ] Rate limit auth: 5 tentativas/15min/IP (login, register, reset, refresh)
- [ ] Rate limit por usuário autenticado (mais restritivo que IP)
- [ ] Headers rate limit: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`
- [ ] Proteção contra slowloris: timeout request body (ex: 10s)
- [ ] Limite tamanho payload: `express.json({ limit: '1mb' })` ajustado por endpoint

---

## Headers de Segurança (Helmet.js)

- [ ] Content-Security-Policy: configurado (não `default-src *`)
- [ ] Strict-Transport-Security: maxAge ≥ 1 ano, includeSubDomains, preload
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy: restritivo (camera=(), microphone=(), geolocation=())
- [ ] Cross-Origin-Embedder-Policy: require-corp (se compatível)
- [ ] Cross-Origin-Opener-Policy: same-origin
- [ ] Cross-Origin-Resource-Policy: same-origin

---

## CORS

- [ ] `origin`: allowlist explícita (não `*` em produção)
- [ ] `credentials: true` apenas se cookies necessários
- [ ] `methods`: apenas necessários (GET, POST, PATCH, DELETE)
- [ ] `allowedHeaders`: apenas necessários (Content-Type, Authorization)
- [ ] `maxAge`: cache preflight (86400 = 24h)
- [ ] Subdomínios wildcard apenas se necessário (`*.meudominio.com`)

---

## Segredos e Configuração

### Variáveis de Ambiente
- [ ] `.env.example` no Git com valores fictícios
- [ ] `.env` real no `.gitignore` (NUNCA commitado)
- [ ] Validação Zod no startup (fail fast se inválido/ausente)
- [ ] Nenhum segredo em variáveis `VITE_*` (frontend)
- [ ] Chaves assimétricas JWT: PRIVATE_KEY (assinatura), PUBLIC_KEY (verificação)
- [ ] Rotação de segredos documentada (cronograma, procedimento)

### Logs e Monitoramento
- [ ] Structured logging (JSON) - pino/winston
- [ ] Sanitização automática: senhas, tokens, CPF, cartão, PII em logs
- [ ] Nível log: `info` produção, `debug` desenvolvimento
- [ ] Logs de segurança: login success/fail, authZ deny, admin actions, rate limit hits
- [ ] Alertas: múltiplas falhas login, erros 5xx spike, rate limit excedido

---

## Banco de Dados

### Prisma e Schema
- [ ] Soft delete (`deletedAt`) em tabelas sensíveis
- [ ] Constraints: `@unique`, `@relation(onDelete: Cascade/SetNull)`, `@@index`
- [ ] Transações (`$transaction`) para operações multi-tabela atômicas
- [ ] Middleware Prisma: soft delete automático, updatedAt automático
- [ ] Nenhum `prisma.$executeRawUnsafe` com concatenação

### Permissões e Conexão
- [ ] Role DB dedicada (`app_user`) - NÃO superuser/postgres
- [ ] Grants mínimos: SELECT, INSERT, UPDATE, DELETE apenas tabelas necessárias
- [ ] Conexão TLS obrigatória (`sslmode=require`)
- [ ] Pool de conexões configurado (max 20, idle timeout 30s)

### Migrations e Backup
- [ ] Migrations versionadas no Git (`prisma/migrations/`)
- [ ] Revisão SQL antes de deploy produção
- [ ] Backup automático diário (provedor: Neon/RDS/Cloud SQL)
- [ ] Point-in-Time Recovery (PITR) habilitado ≥ 7 dias
- [ ] Teste restore documentado e executado mensalmente
- [ ] Criptografia em repouso (AES-256) e em trânsito (TLS 1.3)

---

## Upload de Arquivos

- [ ] Validação MIME type real (magic bytes, não extensão)
- [ ] Lista allowlist: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- [ ] Tamanho máximo: 5 MB (ajustável por tipo)
- [ ] Sanitização: remoção EXIF, metadata, re-encoding
- [ ] Storage: bucket privado (S3/R2), ACL private
- [ ] Acesso: URLs assinadas temporárias (1h), não URLs públicas
- [ ] Varredura antivírus (se arquivos user-generated críticos)

---

## Dependências e Supply Chain

- [ ] `npm audit` / `pnpm audit` no CI (falha em high/critical)
- [ ] Dependabot/Renovate configurado (PRs automáticos)
- [ ] `package-lock.json` / `pnpm-lock.yaml` commitado
- [ ] Auditoria mensal manual: `npm outdated`, revisar CHANGELOGS
- [ ] Lockfile versionado; não usar `*` ou `^` em deps críticas
- [ ] Pacotes suspeitos: verificar mantenedores, downloads, última atualização

---

## Testes de Segurança

- [ ] Testes unitários: hash, JWT, validação, autorização
- [ ] Testes integração: login, refresh, logout, rate limit, authZ
- [ ] Testes E2E: fluxos auth completos, IDOR attempts, XSS payloads
- [ ] SAST no CI: ESLint security rules, semgrep (opcional)
- [ ] DAST: OWASP ZAP scan em staging (opcional)
- [ ] Penetration test: anual ou pós-mudança crítica

---

## Resposta a Incidentes

- [ ] Plano de resposta a incidentes documentado (`templates/REGISTRO-INCIDENTE.md`)
- [ ] Contatos de segurança definidos
- [ ] Procedimento rotação de chaves comprometidas
- [ ] Procedimento revogação tokens em massa
- [ ] Backup de logs de segurança (retenção ≥ 1 ano)
- [ ] Simulação de incidente (tabletop) semestral

---

## Observações e Pendências

| Item | Status | Observação | Responsável | Prazo |
|------|--------|------------|-------------|-------|
| Teste restore backup | `[ ]` | Agendar mensal | DBA | 2026-11-30 |
| MFA/2FA implementação | `[ ]` | Prioridade média | Backend team | 2027-01-31 |
| DAST OWASP ZAP | `[ ]` | Configurar CI | Sec team | 2026-12-15 |
| Penetration test | `[ ]` | Contratar/agendar | Management | 2027-03-31 |

---

## Assinatura de Verificação

```
Verificado por: _________________________
Data: _________________________
Versão do checklist: 1.0
Próxima revisão: _________________________
```