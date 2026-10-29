# Roteiro de Testes - Cenários Detalhados

> Cenários de teste reproduzíveis com pré-condições, passos, resultados esperados e evidências.
> Use para: execução manual, validação QA, documentação de regressão.
> Marque status: `APROVADO` | `REPROVADO` | `BLOQUEADO` | `NÃO EXECUTADO`

---

## Legenda de Status

| Status | Descrição |
|--------|-----------|
| **APROVADO** | Todos passos executados com sucesso, resultado conforme esperado |
| **REPROVADO** | Falha em algum passo, comportamento divergente do esperado |
| **BLOQUEADO** | Não foi possível executar (dependência, ambiente, bug conhecido) |
| **NÃO EXECUTADO** | Ainda não testado nesta execução |

---

## Módulo: Autenticação

### CT-AUTH-001: Login Válido
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-001 |
| **Funcionalidade** | Login com credenciais válidas |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | Usuário existe no BD: email `admin@test.com`, senha `admin123`, role `admin` |
| **Dados de Teste** | email: `admin@test.com`, senha: `admin123` |
| **Passos** | 1. Acessar `POST /api/v1/auth/login`<br>2. Enviar body com credenciais válidas<br>3. Verificar response |
| **Resultado Esperado** | Status 200; body: `{ accessToken, refreshToken, user }`; accessToken JWT válido; refreshToken string; user sem senha; cookies HttpOnly setados |
| **Evidência** | Response JSON, headers Set-Cookie, JWT decode válido |
| **Status** | `NÃO EXECUTADO` |
| **Observações** | Verificar expiração accessToken (15min) e refreshToken (7d) |

### CT-AUTH-002: Login Inválido - Senha Errada
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-002 |
| **Funcionalidade** | Login com senha incorreta |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | Usuário existe: `admin@test.com` / `admin123` |
| **Dados de Teste** | email: `admin@test.com`, senha: `senhaerrada` |
| **Passos** | 1. Enviar login com senha errada<br>2. Verificar response |
| **Resultado Esperado** | Status 401; body: `{ erro: 'NAO_AUTENTICADO', mensagem: 'Credenciais inválidas' }`; NÃO vazar se email existe; cookies não setados |
| **Evidência** | Response JSON, ausência de Set-Cookie |
| **Status** | `NÃO EXECUTADO` |
| **Observações** | Mensagem genérica intencional (não diferenciar usuário inexistente vs senha errada) |

### CT-AUTH-003: Login Inválido - Usuário Inexistente
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-003 |
| **Funcionalidade** | Login com email não cadastrado |
| **Prioridade** | ALTA |
| **Pré-condições** | Email `inexistente@test.com` não existe no BD |
| **Dados de Teste** | email: `inexistente@test.com`, senha: `qualquer` |
| **Passos** | 1. Enviar login com email inexistente<br>2. Verificar response |
| **Resultado Esperado** | Status 401; mesma mensagem de CT-AUTH-002; tempo de resposta similar (prevenção timing attack) |
| **Evidência** | Response JSON, tempo resposta comparável |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTH-004: Bloqueio por Tentativas Excessivas
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-004 |
| **Funcionalidade** | Rate limit login: 5 tentativas → bloqueio 15 min |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | IP limpo (sem tentativas recentes) |
| **Dados de Teste** | email: `admin@test.com`, senha: `errada1`...`errada5` |
| **Passos** | 1. Executar 5 logins com senha errada sequencial<br>2. Verificar cada response (401)<br>3. 6ª tentativa com credenciais válidas<br>4. Verificar bloqueio |
| **Resultado Esperado** | Tentativas 1-5: 401; Tentativa 6: 429; body: `{ erro: 'RATE_LIMIT', mensagem: 'Muitas tentativas...', retryAfter: 900 }`; header `Retry-After: 900` |
| **Evidência** | Responses sequenciais, header Retry-After |
| **Status** | `NÃO EXECUTADO` |
| **Observações** | Testar reset após 15 min (CT-AUTH-005) |

### CT-AUTH-005: Desbloqueio Automático Após Janela
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-005 |
| **Funcionalidade** | Desbloqueio automático após 15 min |
| **Prioridade** | ALTA |
| **Pré-condições** | IP bloqueado (CT-AUTH-004 executado) |
| **Dados de Teste** | Aguardar 15 min + 1 seg; credenciais válidas |
| **Passos** | 1. Aguardar janela de bloqueio expirar<br>2. Tentar login com credenciais válidas |
| **Resultado Esperado** | Status 200; login bem-sucedido; contador resetado |
| **Evidência** | Response 200 após espera |
| **Status** | `NÃO EXECUTADO` |
| **Observações** | Em testes automatizados: mockar tempo ou reduzir janela via config |

### CT-AUTH-006: Refresh Token Válido
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-006 |
| **Funcionalidade** | Renovação de access token via refresh token |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | Login realizado (CT-AUTH-001); refresh token válido no cookie/body |
| **Dados de Teste** | refreshToken do login anterior |
| **Passos** | 1. Acessar `POST /api/v1/auth/refresh`<br>2. Enviar refresh token<br>3. Verificar novo access token |
| **Resultado Esperado** | Status 200; novo accessToken (diferente do anterior); novo refreshToken (rotação); antigo refreshToken revogado no BD |
| **Evidência** | Dois accessTokens diferentes; BD mostra refreshToken antigo revogado |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTH-007: Refresh Token Expirado
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-007 |
| **Funcionalidade** | Refresh token expirado (> 7 dias) |
| **Prioridade** | ALTA |
| **Pré-condições** | Refresh token com `expiraEm` no passado (mockar data) |
| **Dados de Teste** | refreshToken expirado |
| **Passos** | 1. Tentar refresh com token expirado<br>2. Verificar response |
| **Resultado Esperado** | Status 401; body: `{ erro: 'NAO_AUTENTICADO', mensagem: 'Refresh token expirado' }`; redirect para login no frontend |
| **Evidência** | Response 401, limpeza cookies no frontend |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTH-008: Refresh Token Revogado (Logout)
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-008 |
| **Funcionalidade** | Refresh token revogado após logout |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | Login realizado; refresh token válido |
| **Dados de Teste** | refreshToken válido |
| **Passos** | 1. Fazer logout (`POST /api/v1/auth/logout`)<br>2. Tentar usar refresh token antigo<br>3. Verificar response |
| **Resultado Esperado** | Logout: 204, cookies limpos; Refresh após logout: 401, token revogado |
| **Evidência** | Logout response, refresh response 401, BD mostra revogado=true |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTH-009: Refresh Token Reutilizado (Rotação)
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-009 |
| **Funcionalidade** | Detecção de reuso de refresh token (possível roubo) |
| **Prioridade** | ALTA |
| **Pré-condições** | Login realizado; refresh token RT1 |
| **Dados de Teste** | RT1 usado duas vezes |
| **Passos** | 1. Usar RT1 para refresh → obtém RT2<br>2. Tentar usar RT1 novamente<br>3. Verificar response |
| **Resultado Esperado** | Segunda tentativa: 401; todos tokens do usuário revogados (segurança); alerta de segurança logado |
| **Evidência** | Response 401, BD mostra todos refreshTokens do user revogados |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTH-010: Esqueci Senha - Fluxo Completo
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTH-010 |
| **Funcionalidade** | Solicitação e reset de senha |
| **Prioridade** | ALTA |
| **Pré-condições** | Usuário `user@test.com` existe; email service mockado |
| **Dados de Teste** | email: `user@test.com` |
| **Passos** | 1. `POST /api/v1/auth/forgot-password` com email<br>2. Verificar email enviado (mock)<br>3. Token do email → `POST /api/v1/auth/reset-password`<br>4. Nova senha válida<br>5. Login com nova senha |
| **Resultado Esperado** | Esqueci: 204 (não vazar se email existe); Reset: 204; Login nova senha: 200; Senha antiga invalidada |
| **Evidência** | Email mock chamado, reset response, login com nova senha |
| **Status** | `NÃO EXECUTADO` |

---

## Módulo: Autorização (RBAC)

### CT-AUTHZ-001: Acesso Sem Token
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTHZ-001 |
| **Funcionalidade** | Endpoint protegido sem token |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | Endpoint `GET /api/v1/usuarios` requer auth |
| **Dados de Teste** | Request sem header Authorization |
| **Passos** | 1. Requisição sem Authorization header<br>2. Verificar response |
| **Resultado Esperado** | Status 401; `{ erro: 'NAO_AUTENTICADO' }` |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTHZ-002: Token Inválido/Expirado
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTHZ-002 |
| **Funcionalidade** | Token JWT inválido ou expirado |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | Access token expirado (mockar tempo) ou assinatura inválida |
| **Dados de Teste** | `Authorization: Bearer token_expirado_ou_invalido` |
| **Passos** | 1. Requisição com token inválido<br>2. Verificar response |
| **Resultado Esperado** | Status 401; `{ erro: 'NAO_AUTENTICADO', mensagem: 'Token inválido ou expirado' }` |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTHZ-003: Permissão Insuficiente (403)
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTHZ-003 |
| **Funcionalidade** | Usuário autenticado sem permissão necessária |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | User `user@test.com` (role `user`); endpoint requer `usuarios:listar` |
| **Dados de Teste** | Token válido de user comum |
| **Passos** | 1. Requisição com token de user sem permissão<br>2. Verificar response |
| **Resultado Esperado** | Status 403; `{ erro: 'NAO_AUTORIZADO', mensagem: 'Permissão necessária: usuarios:listar' }` |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTHZ-004: Permissão Suficiente (200)
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTHZ-004 |
| **Funcionalidade** | Usuário com permissão correta acessa endpoint |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | Admin `admin@test.com` (roles `admin`, `usuarios:listar`) |
| **Dados de Teste** | Token válido de admin |
| **Passos** | 1. Requisição com token de admin<br>2. Verificar response |
| **Resultado Esperado** | Status 200; dados retornados corretamente |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTHZ-005: IDOR - Acesso a Recurso de Outro Usuário
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTHZ-005 |
| **Funcionalidade** | Impedir acesso a recurso de outro usuário (IDOR) |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | User A (id: `user-a`) e User B (id: `user-b`); ambos role `user` |
| **Dados de Teste** | Token de User A; endpoint `GET /api/v1/usuarios/user-b` |
| **Passos** | 1. User A tenta acessar recurso de User B<br>2. Verificar response |
| **Resultado Esperado** | Status 403 ou 404 (não vazar existência); `{ erro: 'NAO_AUTORIZADO' }` |
| **Status** | `NÃO EXECUTADO` |
| **Observações** | Admin deve conseguir acessar qualquer recurso |

### CT-AUTHZ-006: Admin Acessa Qualquer Recurso
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTHZ-006 |
| **Funcionalidade** | Admin bypass verificação de propriedade |
| **Prioridade** | ALTA |
| **Pré-condições** | Admin token; User B existe |
| **Dados de Teste** | Token admin; `GET /api/v1/usuarios/user-b` |
| **Passos** | 1. Admin acessa recurso de User B<br>2. Verificar response |
| **Resultado Esperado** | Status 200; dados de User B retornados |
| **Status** | `NÃO EXECUTADO` |

### CT-AUTHZ-007: Matriz de Permissões Completa
| Campo | Valor |
|-------|-------|
| **ID** | CT-AUTHZ-007 |
| **Funcionalidade** | Verificar todas combinações role × endpoint |
| **Prioridade** | ALTA |
| **Pré-condições** | Roles: `admin`, `manager`, `user`, `guest`; Endpoints: CRUD usuários, relatórios, config |
| **Dados de Teste** | Tokens para cada role |
| **Passos** | 1. Para cada role, testar cada endpoint<br>2. Registrar permitido/negado |
| **Resultado Esperado** | Matriz documentada e testada; sem acesso não intencional |
| **Evidência** | Tabela role × endpoint × status esperado/obtido |
| **Status** | `NÃO EXECUTADO` |

---

## Módulo: Validação de Dados

### CT-VAL-001: Dados Inválidos - Múltiplos Erros
| Campo | Valor |
|-------|-------|
| **ID** | CT-VAL-001 |
| **Funcionalidade** | Validação Zod retorna todos erros de uma vez |
| **Prioridade** | ALTA |
| **Pré-condições** | Endpoint `POST /api/v1/usuarios` com schema Zod |
| **Dados de Teste** | `{ nome: "", email: "invalido", senha: "123" }` |
| **Passos** | 1. Enviar payload com múltiplos erros<br>2. Verificar response |
| **Resultado Esperado** | Status 400; `{ erro: 'VALIDACAO', detalhes: { body: { nome: [...], email: [...], senha: [...] } } }` |
| **Status** | `NÃO EXECUTADO` |

### CT-VAL-002: Email Duplicado (Unicidade)
| Campo | Valor |
|-------|-------|
| **ID** | CT-VAL-002 |
| **Funcionalidade** | Conflito de unicidade no banco (Prisma P2002) |
| **Prioridade** | ALTA |
| **Pré-condições** | Usuário `existente@test.com` já cadastrado |
| **Dados de Teste** | `{ nome: "Outro", email: "existente@test.com", senha: "senha123" }` |
| **Passos** | 1. Tentar criar usuário com email existente<br>2. Verificar response |
| **Resultado Esperado** | Status 409; `{ erro: 'CONFLITO_UNICIDADE', mensagem: 'Já existe um registro com este email' }` |
| **Status** | `NÃO EXECUTADO` |

### CT-VAL-003: CPF Inválido
| Campo | Valor |
|-------|-------|
| **ID** | CT-VAL-003 |
| **Funcionalidade** | Validação customizada CPF (check digit) |
| **Prioridade** | MÉDIA |
| **Pré-condições** | Schema com `.refine(validarCPF)` |
| **Dados de Teste** | CPFs: `111.111.111-11` (inválido), `529.982.247-25` (válido) |
| **Passos** | 1. Enviar CPF inválido → 400<br>2. Enviar CPF válido → 201 |
| **Resultado Esperado** | Inválido: erro validação; Válido: criado com sucesso |
| **Status** | `NÃO EXECUTADO` |

### CT-VAL-004: Sanitização XSS no Input
| Campo | Valor |
|-------|-------|
| **ID** | CT-VAL-004 |
| **Funcionalidade** | Input com payload XSS sanitizado |
| **Prioridade** | ALTA |
| **Pré-condições** | Endpoint aceita campo `nome` (string) |
| **Dados de Teste** | `<script>alert(1)</script>`, `<img src=x onerror=alert(1)>` |
| **Passos** | 1. Enviar payload XSS no nome<br>2. Verificar armazenamento no BD<br>3. Verificar resposta API |
| **Resultado Esperado** | BD armazena string sanitizada (sem tags); Response não executa script |
| **Status** | `NÃO EXECUTADO` |

### CT-VAL-005: Payload Excede Limite
| Campo | Valor |
|-------|-------|
| **ID** | CT-VAL-005 |
| **Funcionalidade** | Limite de tamanho de request |
| **Prioridade** | MÉDIA |
| **Pré-condições** | `express.json({ limit: '1mb' })` |
| **Dados de Teste** | JSON > 1MB (ex: base64 grande) |
| **Passos** | 1. Enviar request > 1MB<br>2. Verificar response |
| **Resultado Esperado** | Status 413 (Payload Too Large) ou 400 com mensagem clara |
| **Status** | `NÃO EXECUTADO` |

---

## Módulo: CRUD Usuários

### CT-USR-001: Listar Usuários - Paginação
| Campo | Valor |
|-------|-------|
| **ID** | CT-USR-001 |
| **Funcionalidade** | Listagem paginada com filtros |
| **Prioridade** | ALTA |
| **Pré-condições** | 25 usuários no BD; admin autenticado |
| **Dados de Teste** | Query params: `pagina=2`, `limite=10`, `busca="joao"` |
| **Passos** | 1. GET `/api/v1/usuarios?pagina=2&limite=10&busca=joao`<br>2. Verificar response |
| **Resultado Esperado** | Status 200; `dados` array (≤10 itens); `paginacao: { pagina: 2, limite: 10, total: X, totalPaginas: Y }`; resultados filtrados por "joao" |
| **Status** | `NÃO EXECUTADO` |

### CT-USR-002: Obter Usuário por ID
| Campo | Valor |
|-------|-------|
| **ID** | CT-USR-002 |
| **Funcionalidade** | Busca usuário específico |
| **Prioridade** | ALTA |
| **Pré-condições** | Usuário `uuid-123` existe |
| **Dados de Teste** | ID: `uuid-123` |
| **Passos** | 1. GET `/api/v1/usuarios/uuid-123`<br>2. Verificar response |
| **Resultado Esperado** | Status 200; usuário sem campo `senha`; campos: id, nome, email, roles, criadoEm, atualizadoEm |
| **Status** | `NÃO EXECUTADO` |

### CT-USR-003: Criar Usuário - Sucesso
| Campo | Valor |
|-------|-------|
| **ID** | CT-USR-003 |
| **Funcionalidade** | Criação de usuário por admin |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | Admin autenticado; email novo |
| **Dados de Teste** | `{ nome: "Novo User", email: "novo@test.com", senha: "SenhaForte123!", roles: ["user"] }` |
| **Passos** | 1. POST `/api/v1/usuarios` com dados<br>2. Verificar response e BD |
| **Resultado Esperado** | Status 201; usuário criado sem senha no response; senha hasheada no BD (Argon2id); evento `usuario.criado` publicado |
| **Evidência** | Response, BD query, event log |
| **Status** | `NÃO EXECUTADO` |

### CT-USR-004: Atualizar Usuário - Próprio (User)
| Campo | Valor |
|-------|-------|
| **ID** | CT-USR-004 |
| **Funcionalidade** | Usuário comum atualiza próprio perfil |
| **Prioridade** | ALTA |
| **Pré-condições** | User autenticado; próprio ID |
| **Dados de Teste** | Token user; PATCH `/api/v1/usuarios/seu-id` com `{ nome: "Novo Nome" }` |
| **Passos** | 1. User atualiza próprio nome<br>2. Verificar response |
| **Resultado Esperado** | Status 200; nome atualizado; email/roles inalterados |
| **Status** | `NÃO EXECUTADO` |

### CT-USR-005: Atualizar Usuário - Admin Altera Roles
| Campo | Valor |
|-------|-------|
| **ID** | CT-USR-005 |
| **Funcionalidade** | Admin altera roles de outro usuário |
| **Prioridade** | ALTA |
| **Pré-condições** | Admin autenticado; User target existe |
| **Dados de Teste** | Token admin; PATCH `/api/v1/usuarios/user-id` com `{ roles: ["user", "manager"] }` |
| **Passos** | 1. Admin atualiza roles do user<br>2. Verificar response e BD |
| **Resultado Esperado** | Status 200; roles atualizadas; user target tem novas roles no próximo login |
| **Status** | `NÃO EXECUTADO` |

### CT-USR-006: Excluir Usuário - Soft Delete
| Campo | Valor |
|-------|-------|
| **ID** | CT-USR-006 |
| **Funcionalidade** | Exclusão lógica (soft delete) |
| **Prioridade** | ALTA |
| **Pré-condições** | User target existe; admin autenticado |
| **Dados de Teste** | Token admin; DELETE `/api/v1/usuarios/user-id` |
| **Passos** | 1. Admin exclui usuário<br>2. Verificar response e BD |
| **Resultado Esperado** | Status 204; BD: `deletedAt` preenchido; user não aparece em listagens; login falha |
| **Status** | `NÃO EXECUTADO` |

---

## Módulo: Falhas e Resiliência

### CT-FAL-001: Banco de Dados Indisponível
| Campo | Valor |
|-------|-------|
| **ID** | CT-FAL-001 |
| **Funcionalidade** | Comportamento quando DB cai |
| **Prioridade** | ALTA |
| **Pré-condições** | Parar PostgreSQL ou bloquear conexão |
| **Dados de Teste** | Qualquer request autenticado |
| **Passos** | 1. Derrotar DB<br>2. Fazer request autenticado<br>3. Verificar response |
| **Resultado Esperado** | Status 503 ou 500; `{ erro: 'ERRO_INTERNO', mensagem: 'Erro interno do servidor' }`; log estruturado com erro; não vazar detalhes DB |
| **Status** | `NÃO EXECUTADO` |
| **Observações** | Testar em staging; não em produção |

### CT-FAL-002: Erro Não Tratado (Bug)
| Campo | Valor |
|-------|-------|
| **ID** | CT-FAL-002 |
| **Funcionalidade** | Exception não capturada → error handler |
| **Prioridade** | ALTA |
| **Pré-condições** | Injetar bug temporário (ex: `throw new Error('test')` em service) |
| **Dados de Teste** | Request que dispara o bug |
| **Passos** | 1. Disparar erro não tratado<br>2. Verificar response e logs |
| **Resultado Esperado** | Status 500; `{ erro: 'ERRO_INTERNO', mensagem: 'Erro interno do servidor' }`; log com stack trace (dev) ou sem (prod); Sentry/alert acionado |
| **Status** | `NÃO EXECUTADO` |

### CT-FAL-003: Timeout Request Lento
| Campo | Valor |
|-------|-------|
| **ID** | CT-FAL-003 |
| **Funcionalidade** | Timeout de request longo |
| **Prioridade** | MÉDIA |
| **Pré-condições** | Endpoint com delay artificial > 30s; timeout configurado 30s |
| **Dados de Teste** | Request para endpoint lento |
| **Passos** | 1. Fazer request<br>2. Aguardar timeout |
| **Resultado Esperado** | Status 408 ou 504; response antes de 35s; conexão fechada |
| **Status** | `NÃO EXECUTADO` |

---

## Módulo: Upload de Arquivos

### CT-UPL-001: Upload Válido (Imagem)
| Campo | Valor |
|-------|-------|
| **ID** | CT-UPL-001 |
| **Funcionalidade** | Upload imagem válida → URL assinada |
| **Prioridade** | ALTA |
| **Pré-condições** | User autenticado; bucket configurado |
| **Dados de Teste** | Arquivo: `teste.png` (500KB, image/png) |
| **Passos** | 1. POST `/api/v1/upload` com multipart/form-data<br>2. Verificar response |
| **Resultado Esperado** | Status 201; `{ url: "https://cdn.signed-url...", tipo: "png" }`; URL expira em 1h; arquivo no storage privado |
| **Status** | `NÃO EXECUTADO` |

### CT-UPL-002: Upload Tipo Não Permitido
| Campo | Valor |
|-------|-------|
| **ID** | CT-UPL-002 |
| **Funcionalidade** | Rejeição de tipo MIME não permitido |
| **Prioridade** | ALTA |
| **Pré-condições** | User autenticado |
| **Dados de Teste** | Arquivo: `malicioso.exe` (application/x-msdownload) |
| **Passos** | 1. Tentar upload .exe<br>2. Verificar response |
| **Resultado Esperado** | Status 400; `{ erro: 'VALIDACAO', mensagem: 'Tipo de arquivo não permitido' }`; arquivo não salvo |
| **Status** | `NÃO EXECUTADO` |

### CT-UPL-003: Upload Excede Tamanho
| Campo | Valor |
|-------|-------|
| **ID** | CT-UPL-003 |
| **Funcionalidade** | Rejeição arquivo > 5MB |
| **Prioridade** | ALTA |
| **Pré-condições** | User autenticado; limite 5MB |
| **Dados de Teste** | Arquivo: `grande.png` (10MB) |
| **Passos** | 1. Tentar upload 10MB<br>2. Verificar response |
| **Resultado Esperado** | Status 413 ou 400; erro de tamanho excedido |
| **Status** | `NÃO EXECUTADO` |

### CT-UPL-004: Magic Bytes vs Extensão
| Campo | Valor |
|-------|-------|
| **ID** | CT-UPL-004 |
| **Funcionalidade** | Validação por magic bytes (não extensão) |
| **Prioridade** | ALTA |
| **Pré-condições** | User autenticado |
| **Dados de Teste** | Arquivo `malicioso.php` com header PNG (magic bytes PNG) |
| **Passos** | 1. Upload arquivo .php com conteúdo PNG<br>2. Verificar response |
| **Resultado Esperado** | Status 201 (aceito como PNG) OU 400 se extensão também validada; policy documentada |
| **Status** | `NÃO EXECUTADO` |

---

## Módulo: Frontend (E2E Playwright)

### CT-FE-001: Login Flow Completo
| Campo | Valor |
|-------|-------|
| **ID** | CT-FE-001 |
| **Funcionalidade** | Fluxo login → dashboard → logout |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | App rodando; user `admin@test.com` existe |
| **Dados de Teste** | Credenciais válidas |
| **Passos** | 1. Acessar `/login`<br>2. Preencher email/senha<br>3. Clicar entrar<br>4. Verificar redirect `/dashboard`<br>5. Verificar nome user visível<br>6. Clicar logout<br>7. Verificar redirect `/login` |
| **Resultado Esperado** | Todos passos funcionam; tokens em cookies HttpOnly; estado auth persistido no refresh |
| **Evidência** | Screenshots cada passo, cookies devtools |
| **Status** | `NÃO EXECUTADO` |

### CT-FE-002: Erro Login Exibido
| Campo | Valor |
|-------|-------|
| **ID** | CT-FE-002 |
| **Funcionalidade** | Exibição de erro de login na UI |
| **Prioridade** | ALTA |
| **Pré-condições** | App rodando |
| **Dados de Teste** | Credenciais inválidas |
| **Passos** | 1. Tentar login inválido<br>2. Verificar mensagem erro |
| **Resultado Esperado** | Toast/alert com "Credenciais inválidas"; campo senha limpo; foco no email |
| **Status** | `NÃO EXECUTADO` |

### CT-FE-003: Protected Route Redirect
| Campo | Valor |
|-------|-------|
| **ID** | CT-FE-003 |
| **Funcionalidade** | Acesso a rota protegida sem auth → redirect login |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | User não logado; rota `/usuarios` protegida |
| **Dados de Teste** | Acessar `/usuarios` diretamente |
| **Passos** | 1. Acessar `/usuarios` sem login<br>2. Verificar redirect |
| **Resultado Esperado** | Redirect para `/login?redirect=/usuarios`; após login → `/usuarios` |
| **Status** | `NÃO EXECUTADO` |

### CT-FE-004: Token Refresh Automático
| Campo | Valor |
|-------|-------|
| **ID** | CT-FE-004 |
| **Funcionalidade** | Refresh automático de access token expirado |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | Login feito; access token expirado (mockar tempo); refresh token válido |
| **Dados de Teste** | App com token expirado |
| **Passos** | 1. Aguardar access token expirar (ou mockar)<br>2. Fazer ação que requer API<br>3. Verificar request silencioso de refresh |
| **Resultado Esperado** | Request original repete com novo token; usuário não percebe; sem redirect login |
| **Evidência** | Network tab: 401 → POST /auth/refresh → retry original → 200 |
| **Status** | `NÃO EXECUTADO` |

### CT-FE-005: Formulário Validação Client-Side
| Campo | Valor |
|-------|-------|
| **ID** | CT-FE-005 |
| **Funcionalidade** | Validação React Hook Form + Zod antes de submit |
| **Prioridade** | ALTA |
| **Pré-condições** | Página `/usuarios/novo` |
| **Dados de Teste** | Campos vazios, email inválido, senha curta |
| **Passos** | 1. Tentar submit formulário vazio<br>2. Verificar erros inline<br>3. Preencher corretamente<br>4. Submit sucesso |
| **Resultado Esperado** | Erros mostrados sob cada campo; submit desabilitado enquanto inválido; sucesso navega para lista |
| **Status** | `NÃO EXECUTADO` |

### CT-FE-005: Acessibilidade - Navegação Teclado
| Campo | Valor |
|-------|-------|
| **ID** | CT-FE-005 |
| **Funcionalidade** | Navegação completa por teclado |
| **Prioridade** | ALTA |
| **Pré-condições** | Página `/usuarios` carregada |
| **Dados de Teste** | Teclas Tab, Enter, Escape, Setas |
| **Passos** | 1. Tab por todos elementos interativos<br>2. Enter em botões/links<br>3. Escape em modais<br>4. Setas em tabelas/listas |
| **Resultado Esperado** | Ordem lógica; focus visible; todos ações acessíveis; sem keyboard trap |
| **Status** | `NÃO EXECUTADO` |

---

## Módulo: Performance e Carga

### CT-PERF-001: Latência API p95
| Campo | Valor |
|-------|-------|
| **ID** | CT-PERF-001 |
| **Funcionalidade** | Latência p95 endpoints críticos < 200ms |
| **Prioridade** | MÉDIA |
| **Pré-condições** | Ambiente staging; k6 configurado |
| **Dados de Teste** | 100 VUs, 30s, endpoints: login, listar usuários, criar usuário |
| **Passos** | 1. Executar k6 script<br>2. Analisar resultados |
| **Resultado Esperado** | p95 < 200ms; p99 < 500ms; error rate < 0.1% |
| **Evidência** | Relatório k6 HTML/JSON |
| **Status** | `NÃO EXECUTADO` |

### CT-PERF-002: Bundle Size Frontend
| Campo | Valor |
|-------|-------|
| **ID** | CT-PERF-002 |
| **Funcionalidade** | Tamanho bundle JS gzipped |
| **Prioridade** | MÉDIA |
| **Pré-condições** | Build production (`npm run build`) |
| **Dados de Teste** | Output `dist/` |
| **Passos** | 1. Build production<br>2. Verificar `dist/assets/*.js` sizes gzipped |
| **Resultado Esperado** | Main chunk < 200KB gzipped; total JS < 500KB gzipped; code splitting funcional |
| **Evidência** | `gzip-size` output, `vite-bundle-analyzer` |
| **Status** | `NÃO EXECUTADO` |

### CT-PERF-003: Core Web Vitals (Lighthouse)
| Campo | Valor |
|-------|-------|
| **ID** | CT-PERF-003 |
| **Funcionalidade** | LCP, FID, CLS dentro dos thresholds |
| **Prioridade** | MÉDIA |
| **Pré-condições** | Lighthouse CI configurado |
| **Dados de Teste** | URLs: `/`, `/login`, `/dashboard`, `/usuarios` |
| **Passos** | 1. Executar Lighthouse CI<br>2. Verificar métricas |
| **Resultado Esperado** | LCP < 2.5s; FID < 100ms; CLS < 0.1; Performance score > 90 |
| **Evidência** | Relatório Lighthouse HTML/JSON |
| **Status** | `NÃO EXECUTADO` |

---

## Módulo: Segurança (Automatizado)

### CT-SEC-001: npm Audit
| Campo | Valor |
|-------|-------|
| **ID** | CT-SEC-001 |
| **Funcionalidade** | Zero vulnerabilidades high/critical |
| **Prioridade** | CRÍTICA |
| **Pré-condições** | `package-lock.json` atualizado |
| **Dados de Teste** | `npm audit --audit-level=high` |
| **Passos** | 1. Executar audit<br>2. Verificar saída |
| **Resultado Esperado** | Exit code 0; 0 high, 0 critical; moderados aceitos com justificativa |
| **Status** | `NÃO EXECUTADO` |

### CT-SEC-002: Headers Segurança Presentes
| Campo | Valor |
|-------|-------|
| **ID** | CT-SEC-002 |
| **Funcionalidade** | Verificar headers HTTP de segurança |
| **Prioridade** | ALTA |
| **Pré-condições** | App rodando em staging |
| **Dados de Teste** | `curl -I https://staging.api.meudominio.com` |
| **Passos** | 1. Request HEAD para API<br>2. Verificar headers |
| **Resultado Esperado** | `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` presentes |
| **Evidência** | Output curl headers |
| **Status** | `NÃO EXECUTADO` |

### CT-SEC-003: CSP Report-Only → Enforce
| Campo | Valor |
|-------|-------|
| **ID** | CT-SEC-003 |
| **Funcionalidade** | CSP em report-only sem violações → enforce |
| **Prioridade** | MÉDIA |
| **Pré-condições** | CSP em `report-only` por 1 semana |
| **Dados de Teste** | Relatórios CSP (Report URI) |
| **Passos** | 1. Verificar relatórios violações<br>2. Se 0 violações → mudar para `enforce` |
| **Resultado Esperado** | 0 violações legítimas; CSP em enforce |
| **Status** | `NÃO EXECUTADO` |

---

## Execução e Registro

### Como Executar

```bash
# Testes unitários + integração (backend)
cd backend && npm run test:coverage

# Testes unitários + componentes (frontend)
cd frontend && npm run test:coverage

# Testes E2E
cd frontend && npm run test:e2e

# Testes segurança
npm audit --audit-level=high
# ou
cd frontend && npm run test:a11y

# Performance
cd frontend && npm run lighthouse
# ou
k6 run k6-script.js
```

### Registro de Execução

| Data | Executor | Ambiente | Cenários Executados | Aprovados | Reprovados | Bloqueados | Observações |
|------|----------|----------|---------------------|-----------|------------|------------|-------------|
| 2026-10-27 | - | - | - | - | - | - | Aguardando implementação |

### Template de Relatório de Bug (se REPROVADO)

```
## Bug Report - CT-XXXX-XXX

**Cenário**: CT-XXXX-XXX - Nome do Cenário
**Status**: REPROVADO
**Ambiente**: [local/staging/prod]
**Data**: YYYY-MM-DD
**Executor**: Nome

**Passo que Falhou**: Nº do passo
**Resultado Esperado**: ...
**Resultado Obtido**: ...
**Evidência**: Screenshot, logs, response JSON

**Severidade**: CRÍTICA | ALTA | MÉDIA | BAIXA
**Causa Raiz (se conhecida)**: ...
**Próximos Passos**: ...
```