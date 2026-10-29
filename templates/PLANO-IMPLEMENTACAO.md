# Template PLANO-IMPLEMENTACAO.md - Plano de Execucao Detalhado

> Copie este arquivo para `docs/PLANO-IMPLEMENTACAO-[FEATURE].md` e preencha.
> Use para planejar a implementacao de features complexas.

---

# Plano de Implementacao: [NOME DA FEATURE/FUNCIONALIDADE]

> Plano detalhado de execucao para [nome da feature/milestone].

---

## 1. CONTEXTO E OBJETIVOS

### Objetivo Principal
[Descreva em 1-2 frases o que sera entregue e qual problema resolve]

### Criterios de Aceitacao (Definition of Done)
| # | Criterio | Como Validar | Status |
|---|----------|--------------|--------|
| 1 | [Criterio 1] | [Teste/CT-XXX APROVADO] | [ ] |
| 2 | [Criterio 2] | [Teste/CT-YYY APROVADO] | [ ] |
| 3 | [Criterio 3] | [k6 p95 < 200ms] | [ ] |
| 4 | [Criterio 4] | [axe 0 violations] | [ ] |

### Escopo
**DENTRO do escopo:**
- [Item 1]
- [Item 2]
- [Item 3]

**FORA do escopo:**
- [Item 1]
- [Item 2]

---

## 2. ANALISE E PRE-REQUISITOS

### Dependencias Externas
| Dependencia | Tipo | Status | Observacoes |
|-------------|------|--------|-------------|
| [API Externa / Servico] | [REST/GraphQL/SDK] | [Pendente/OK/Bloqueado] | [Observacoes] |
| [Biblioteca/Framework] | [Versao] | [Pendente/OK] | [Observacoes] |
| [Aprovacao/Acesso] | [Seguranca/Legal/Infra] | [Pendente/OK] | [Observacoes] |

### Dependencias Internas
| Modulo/Componente | Status | Responsavel | Observacoes |
|-------------------|--------|-------------|-------------|
| [Modulo A] | [Concluido/Em andamento/Pendente] | [Quem] | [Obs] |
| [Migracao DB] | [Pendente] | [Quem] | [Depende de ADR-XXX] |

### Riscos Identificados
| Risco | Prob. | Impacto | Mitigacao | Contingencia |
|-------|-------|---------|-----------|--------------|
| [Risco 1] | Alta/Media/Baixa | Critico/Alto/Medio/Baixo | [Acao preventiva] | [Plano B] |
| [Risco 2] | Alta/Media/Baixa | Critico/Alto/Medio/Baixo | [Acao preventiva] | [Plano B] |

---

## 3. ARQUITETURA E DESIGN

### Decisoes Arquiteturais (ADRs Relacionados)
- ADR-XXX: [Titulo] - [Status]
- ADR-YYY: [Titulo] - [Status]

### Diagramas
- [ ] Diagrama de arquitetura geral
- [ ] Diagrama de sequencia (fluxos principais)
- [ ] Diagrama de entidades (ERD)
- [ ] Diagrama de componentes (Frontend)
- [ ] Diagrama de sequencia (API calls)

### Contratos e Interfaces

#### API Endpoints
| Metodo | Endpoint | Request | Response | Auth | AuthZ |
|--------|----------|---------|----------|------|-------|
| GET | `/api/v1/recursos` | Query params | `PaginatedResponse<RecursoResponse>` | JWT | `recursos:listar` |
| POST | `/api/v1/recursos` | `CriarRecursoDTO` | `RecursoResponse` | JWT | `recursos:criar` |
| PATCH | `/api/v1/recursos/:id` | `AtualizarRecursoDTO` | `RecursoResponse` | JWT | `recursos:editar` |
| DELETE | `/api/v1/recursos/:id` | - | 204 No Content | JWT | `recursos:excluir` |

#### Tipos/Contratos (TypeScript)
```typescript
// DTOs de Entrada
interface CriarRecursoDTO {
  nome: string;
  descricao?: string;
  // ...
}

interface AtualizarRecursoDTO {
  nome?: string;
  // ...
}

// DTOs de Saida
interface RecursoResponse {
  id: string;
  nome: string;
  criadoEm: string;
  // ...
}

// Resposta Paginada
interface PaginatedResponse<T> {
  dados: T[];
  paginacao: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}
```

---

## 4. PLANO DE EXECUCAO

### Fases e Etapas

| Fase | Etapa | Descricao | Objetivo | Depende de | Criterio Aceitacao | Responsavel | Estimativa | Status |
|------|-------|-----------|----------|------------|-------------------|-------------|------------|--------|
| **1. Preparacao** | 1.1 | [Configurar ambiente, criar branch, setup DB] | Ambiente pronto | - | `pnpm run dev` sobe sem erros | [Quem] | [Xh] | [ ] |
| | 1.2 | [Criar tipos/contratos (DTOs, Types)] | Contratos definidos | 1.1 | Types compilam, Zod schemas validam | [Quem] | [Xh] | [ ] |
| | 1.3 | [Criar migracao DB + seed] | Schema atualizado | 1.2 | `pnpm run db:migrate` ok, seed roda | [Quem] | [Xh] | [ ] |
| **2. Backend** | 2.1 | [Repository (se necessario)] | Acesso dados | 1.3 | Queries testadas, types ok | [Quem] | [Xh] | [ ] |
| | 2.2 | [Service (regras negocio)] | Regras negocio | 2.1 | Unit tests passam, regras validadas | [Quem] | [Xh] | [ ] |
| | 2.3 | [Validators (Zod schemas)] | Validacao entrada | 1.2 | Schemas cobrem todos campos | [Quem] | [Xh] | [ ] |
| | 2.4 | [Controller + Routes] | Endpoints HTTP | 2.2, 2.3 | Integracao tests passam | [Quem] | [Xh] | [ ] |
| | 2.5 | [Middlewares Auth/AuthZ] | Seguranca | - | 401/403/200 corretos | [Quem] | [Xh] | [ ] |
| **3. Frontend** | 3.1 | [Types + API Client] | Contratos FE | 1.2 | Types compilam, MSW handlers | [Quem] | [Xh] | [ ] |
| | 3.2 | [Hooks (useX)] | Logica estado/dados | 3.1 | Hooks testados, cache ok | [Quem] | [Xh] | [ ] |
| | 3.3 | [Components UI (ui/)] | Primitivos | - | Storybook/Tests passam | [Quem] | [Xh] | [ ] |
| | 3.4 | [Components Forms/Pages] | UI funcional | 3.1, 3.2, 3.3 | E2E tests passam | [Quem] | [Xh] | [ ] |
| | 3.5 | [Pages + Routing] | Paginas completas | 3.4 | Navegacao funciona, estados OK | [Quem] | [Xh] | [ ] |
| **4. Integracao** | 4.1 | [Integracao FE + BE] | Ponta a ponta | 2.4, 3.5 | E2E fluxos criticos passam | [Quem] | [Xh] | [ ] |
| | 4.2 | [Testes Integracao Completos] | Validacao completa | 4.1 | `pnpm run test:integration` 100% | [Quem] | [Xh] | [ ] |
| **5. Qualidade** | 5.1 | [Testes Unitarios Backend] | Cobertura | 2.2 | Coverage >= 80/70/80/80 | [Quem] | [Xh] | [ ] |
| | 5.2 | [Testes Integracao API] | Contratos | 4.1 | 100% pass, auth/authZ/validacao | [Quem] | [Xh] | [ ] |
| | 5.3 | [Testes Componentes FE] | UI | 3.3 | Testing Library + axe 0 violations | [Quem] | [Xh] | [ ] |
| | 5.4 | [Testes E2E Criticos] | Fluxos usuarios | 4.1 | Login, CRUD, Permissoes OK | [Quem] | [Xh] | [ ] |
| | 5.5 | [Auditoria Seguranca] | `auditoria-de-seguranca` | 2.5, 3.5 | 0 Criticos/Alto nao mitigados | [Quem] | [Xh] | [ ] |
| | 5.6 | [Performance/Load Test] | k6/Lighthouse | 4.1 | p95 < 200ms, bundle < 500KB | [Quem] | [Xh] | [ ] |
| **6. Entrega** | 6.1 | [Revisao Final] | `revisao-final` skill | 5.1-5.6 | Quality gates OK, docs OK | [Quem] | [Xh] | [ ] |
| | 6.2 | [Documentacao + CHANGELOG] | Docs atualizadas | 6.1 | README, CHANGELOG, ADRs ok | [Quem] | [Xh] | [ ] |
| | 6.3 | [Deploy Staging + Validacao] | Staging deploy | 6.1 | Smoke tests OK, PO aprova | [Quem] | [Xh] | [ ] |
| | 6.4 | [Deploy Producao] | `checklists/PUBLICACAO.md` | 6.3 | Deploy OK, monitoramento OK | [Quem] | [Xh] | [ ] |

---

## 5. TESTES E QUALIDADE

### Cobertura Minima
| Metrica | Threshold |
|---------|-----------|
| Linhas | 80% |
| Branches | 70% |
| Funcoes | 80% |
| Statements | 80% |

### Testes Obrigatorios por Camada
| Camada | Tipos de Teste | Ferramenta | Cobertura Alvo |
|--------|----------------|------------|----------------|
| Services (Backend) | Unitarios (mocks) | Vitest | >= 85% |
| Controllers + Routes | Integracao (Supertest + Test DB) | Vitest | 100% endpoints |
| Validators | Unitarios (Zod) | Vitest | 100% schemas |
| Hooks (Frontend) | Unitarios (MSW) | Vitest + MSW | 80% |
| Components UI | Component (Testing Library) | Vitest + RTL | 80% |
| Pages/Flows | E2E | Playwright | Fluxos criticos 100% |
| Acessibilidade | axe-core | Playwright/Vitest | 0 violations WCAG AA |
| Seguranca | Auditoria + npm audit | `auditoria-de-seguranca` + npm audit | 0 high/critical |

### Quality Gates (Bloqueiam Merge/Deploy)
- [ ] `npm run typecheck` -> 0 erros
- [ ] `npm run lint` -> 0 errors
- [ ] `npm run build` -> Sucesso
- [ ] `npm run test` -> 100% pass
- [ ] `npm run test:e2e` -> 100% pass (criticos)
- [ ] `npm run test:a11y` -> 0 violations
- [ ] `npm audit --audit-level=high` -> 0 high/critical
- [ ] Coverage thresholds atendidos

---

## 6. SEGURANCA

### Checklist Seguranca (Obrigatorio)
- [ ] `auditoria-de-seguranca` executada (escopo completa) -> APROVADA
- [ ] Auth: Argon2id + JWT RS256 + Refresh rotation implementados
- [ ] AuthZ: Middleware `autorizar` em TODAS rotas, RBAC granular, IDOR prevention
- [ ] Validacao: Zod schemas em TODOS endpoints (body, params, query)
- [ ] Sanitizacao: DOMPurify output, CSP headers, XSS prevention
- [ ] Rate limiting: Auth 5/15min, API 100req/min, headers Retry-After
- [ ] Headers: CSP, HSTS, X-Frame-Options, Referrer-Policy
- [ ] Segredos: `.env` no gitignore, validação startup, 0 segredos frontend
- [ ] Logs: Estruturados (Pino/Winston), sanitizacao (senhas, tokens, PII)
- [ ] Upload: MIME real + allowlist + sanitizacao + storage privado
- [ ] `npm audit --audit-level=high` -> 0 high/critical
- [ ] Dependabot/Renovate configurado

---

## 6. DOCUMENTACAO E ENTREGA

### Artefatos a Entregar
| Artefato | Responsavel | Prazo | Status |
|----------|-------------|-------|--------|
| `README.md` atualizado | [Quem] | [Data] | [ ] |
| `CHANGELOG.md` (Conventional Commits) | [Quem] | [Data] | [ ] |
| `docs/ARQUITETURA.md` atualizado | [Quem] | [Data] | [ ] |
| `docs/DECISOES-TECNICAS.md` (ADR se novo) | [Quem] | [Data] | [ ] |
| `CHANGELOG.md` (Conventional Commits) | [Quem] | [Data] | [ ] |
| `README.md` atualizado (se necessario) | [Quem] | [Data] | [ ] |
| API Docs (Swagger/OpenAPI se aplicavel) | [Quem] | [Data] | [ ] |

### Checklist Entrega (Checklist ENTREGA.md)
- [ ] `checklists/ENTREGA.md` -> **APROVADO**
- [ ] `checklists/REVISAO-DE-CODIGO.md` -> **APROVADO**
- [ ] `checklists/SEGURANCA.md` -> **APROVADO**
- [ ] `checklists/TESTES.md` + `ROTEIRO-DE-TESTES.md` -> **APROVADO**
- [ ] `revisao-final` skill executada -> **APROVAR**

---

## 7. PLANO DE DEPLOY

### Ambientes
| Ambiente | URL | Branch | Deploy | Aprovacao |
|-----------|-----|--------|---------|-----------|
| Staging | [URL] | `release/*` | Auto (PR merge) | Manual (PO) |
| Producao | [URL] | `main` | Manual | Tech Lead + PO |

### Estrategia Deploy
- [ ] **Blue/Green** | [ ] **Rolling** | [ ] **Canary** | [ ] **Recreate**
- Zero-downtime: [SIM/NAO]
- Rollback testado: [SIM/NAO] (tempo < 5 min)
- Rollback plan documentado: [SIM/NAO]

### Checklist Pre-Deploy (`checklists/PUBLICACAO.md`)
- [ ] `ENTREGA.md` APROVADO
- [ ] `REVISAO-FINAL` APROVADO
- [ ] `AUDITORIA-SEGURANCA` APROVADA
- [ ] TESTES 100% PASS
- [ ] BUILD SUCESSO
- [ ] STAGING VALIDADO
- [ ] ROLLBACK TESTADO (< 5 min)
- [ ] MONITORAMENTO ATIVO
- [ ] COMUNICACAO PRONTA

---

## 8. MONITORAMENTO POS-DEPLOY

### Metricas Criticas (Primeiras 24h)
| Metrica | Threshold Alerta | Acao se Exceder |
|---------|------------------|-----------------|
| Error rate | > 0.1% | Investigar + rollback se > 1% |
| Latencia p95 | > baseline + 10% | Investigar + rollback se > 2x |
| Throughput | < baseline - 20% | Investigar |
| Alertas criticos | Qualquer SEV-1/SEV-2 | Rollback imediato |

### Monitoramento Continuo (7 dias)
- [ ] Error rate < 0.1% sustentado
- [ ] Latencia p95 < baseline + 5%
- [ ] Uptime > 99.9%
- [ ] Zero SEV-1/SEV-2
- [ ] Business metrics normais

---

## 9. RISCOS E CONTINGENCIAS

| Risco | Prob. | Impacto | Mitigacao | Contingencia | Responsavel |
|-------|-------|---------|-----------|--------------|-------------|
| [Risco 1] | Alta/Media/Baixa | Critico/Alto/Medio/Baixo | [Acao preventiva] | [Plano B] | [Quem] |
| [Risco 2] | Alta/Media/Baixa | Critico/Alto/Medio/Baixo | [Acao preventiva] | [Plano B] | [Quem] |

---

## 9. COMUNICACAO E APROVACOES

### Aprovacoes Necessarias
| Aprovacao | Responsavel | Status | Data |
|-----------|-------------|--------|------|
| Plano Tecnico | Tech Lead | [ ] | [Data] |
| Requisitos/ESCOPO | Product Owner | [ ] | [Data] |
| Seguranca (se critico) | Security Champion | [ ] | [Data] |
| Recursos/Prazo | Gerencia | [ ] | [Data] |

### Comunicacao Stakeholders
| Evento | Publico | Canal | Responsavel | Timing |
|--------|---------|-------|-------------|--------|
| Kickoff | Equipe + Stakeholders | Slack/Email/Reuniao | Tech Lead | Inicio |
| Progresso semanal | Stakeholders | Email/Slack | Tech Lead | Semanal |
| Demo/Review | PO + Stakeholders | Reuniao | Tech Lead | Fim de sprint |
| Pre-deploy | Todos | Slack/Email | Tech Lead | 24h antes |
| Pos-deploy | Todos | Slack/Email | Tech Lead | Imediato |
| Retrospectiva | Equipe | Reuniao | Tech Lead | Pos-entrega |

---

## 10. APROVACAO FINAL

| Papel | Nome | Assinatura | Data |
|-------|------|------------|------|
| Tech Lead | | | |
| Product Owner | | | |
| Security Champion | | | |
| DevOps/Infra | | | |

---

**Versao**: 1.0 | **Data**: YYYY-MM-DD | **Autor**: [Nome] | **Status**: [Rascunho/Em Revisao/Aprovado]