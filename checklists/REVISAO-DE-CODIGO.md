# Checklist de Revisao de Codigo - Code Review Multi-Axis

> Use em PR/MR antes de merge. Marque `[x]` quando verificado, `[~]` se parcialmente atendido (registre observacao), `[ ]` se nao aplicavel.

---

## Contexto do PR

### Informacoes Basicas
- [ ] PR #: ___________ | Branch: ___________ | Autor: ___________
- [ ] Issue relacionada: #___________
- [ ] Descricao da mudanca clara e completa
- [ ] Criterios de aceitacao originais listados
- [ ] Tipo: `feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `security`
- [ ] Escopo: arquivo | componente | modulo | sistema | cross-cutting

---

## 1. CRITERIOS DE ACEITACAO (Obrigatorio)

| Criterio Original | Status | Evidencia | Observacao |
|-------------------|--------|-----------|------------|
| Funcionalidade X implementada | `[ ]` | Teste CT-XXX APROVADO | |
| Regra de negocio Y validada | `[ ]` | Teste CT-YYY APROVADO | |
| Performance Z atendida | `[ ]` | k6 p95 < 200ms | |
| Acessibilidade WCAG AA | `[ ]` | axe 0 violaçoes | |
| Seguranca: auth/authZ ok | `[ ]` | Auditoria APROVADA | |

**Se qualquer criterio `[ ]` (falha) -> REJEITAR** (exceto se condicional acordado com prazo)

---

## 2. QUALIDADE DE CODIGO (Diff Git)

### Arquitetura e Padroes
- [ ] Segue `ARCHITECTURE.md` / `docs/ARQUITETURA.md` (camadas, responsabilidades)
- [ ] Segue `docs/CODIGO-LIMPO.md` (nomes, funcoes pequenas, tipagem, comentarios)
- [ ] Separacao de responsabilidades mantida (routes/controllers/services/validators)
- [ ] Nao ha quebra de contratos (tipos, APIs, eventos, schemas)
- [ ] Novos modulos seguem estrutura padrao (routes/controllers/services/validators)
- [ ] Nao ha acoplamento indevido entre camadas/modulos

### Seguranca (baseado em `docs/SEGURANCA.md` + `checklists/SEGURANCA.md`)
- [ ] Auth/AuthZ: middleware `autenticar` + `autorizar` em TODAS rotas protegidas
- [ ] RBAC: roles/permissions granulares (nao apenas "admin/user")
- [ ] IDOR prevention: verificacao propriedade recurso (`userId === resource.ownerId`)
- [ ] Validacao: Zod schemas em TODOS endpoints (body, params, query)
- [ ] Sanitizacao output (DOMPurify se HTML user-generated)
- [ ] Segredos: nenhum no frontend, `.env` no gitignore, validação startup
- [ ] Headers: CSP, HSTS, X-Frame-Options, Referrer-Policy presentes
- [ ] Rate limit: endpoints sensiveis protegidos (auth 5/15min, API 100req/min)
- [ ] Logs: estruturados (Pino/Winston), sem segredos/PII, sanitizacao automatica
- [ ] Upload: MIME real (magic bytes) + allowlist + sanitizacao (sharp)
- [ ] Error handler: sem stack trace em producao, resposta generica 500
- [ ] `.env` no `.gitignore`, `.env.example` no Git com valores ficticios

### Qualidade e Manutenibilidade
- [ ] TypeScript strict: sem `any` desnecessario, tipos inferidos corretos
- [ ] Funcoes pequenas (< 50 linhas), responsabilidade unica (SRP)
- [ ] Nomes claros (PT-BR dominio: `ehAdmin`, `temPermissao`; ingles tech: `UserService`, `PrismaClient`)
- [ ] Imports organizados: externos -> internos -> relativos -> types
- [ ] Exports named (nao default para classes/funcoes principais)
- [ ] Comentarios: **por que** (decisoes, trade-offs), nao **o que** (codigo obvio)
- [ ] JSDoc em API publica (params, returns, throws, example)
- [ ] Sem codigo morto, imports nao utilizados, `console.log` debug
- [ ] Sem `any` desnecessario (usar `unknown` + type guard)
- [ ] Tipos retorno explicitos em API publica

### Testes e Qualidade
- [ ] Testes unitarios para nova logica (cobertura >= 80% linhas, 70% branches)
- [ ] Testes integracao para endpoints novos/modificados (auth, authZ, validacao, CRUD)
- [ ] Testes E2E para fluxos criticos novos (login, fluxos principais)
- [ ] Cobertura mantida/acima threshold (linhas 80%, branches 70%)
- [ ] Testes passam localmente (`npm run test`) e no CI
- [ ] Testes E2E criticos passam (login, fluxos principais)
- [ ] Performance: p95 latencia nao degradou > 10%
- [ ] Bundle size (frontend): nao aumentou > 10% sem justificativa

---

## 3. BUILD E TYPE CHECKING

- [ ] `npm run typecheck` -> `tsc --noEmit` **0 erros**
- [ ] `npm run lint` -> ESLint **0 errors** (warnings aceitos se justificados)
- [ ] `npm run build` -> Build producao **sucesso**
- [ ] `npm run test` -> Todos testes **pass** (unit + integration + e2e criticos)
- [ ] `npm run test:coverage` -> Thresholds atendidos (linhas 80%, branches 70%, functions 80%, statements 80%)
- [ ] `npm run format:check` -> Prettier **0 diffs**

---

## 4. DOCUMENTACAO E RASTREABILIDADE

- [ ] `README.md` atualizado se nova funcionalidade/configuracao visivel
- [ ] `CHANGELOG.md` atualizado (Conventional Commits: `feat:`, `fix:`, `refactor:`, etc.)
- [ ] `docs/ARQUITETURA.md` atualizado se mudanca arquitetural
- [ ] `docs/DECISOES-TECNICAS.md` (ADR) se decisao arquitetural (`templates/DECISAO-TECNICA.md`)
- [ ] `memoria/DECISOES.md` e `memoria/PENDENCIAS.md` atualizados
- [ ] Commits atomicos (uma mudanca logica por commit)
- [ ] Mensagens Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `security:`)
- [ ] Branch nomeada corretamente (`feature/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`, `security/`)

---

## 5. VERIFICAR REGRESSOES

- [ ] Suite completa testes executada (nao apenas novos)
- [ ] Funcionalidades existentes nao quebraram
- [ ] Testes E2E criticos passam (login, fluxos principais)
- [ ] Performance: p95 latencia nao degradou > 10% (comparar com baseline)
- [ ] Bundle size (frontend): nao aumentou > 10% sem justificativa
- [ ] Migracoes DB: revisadas, `expand/contract` padrao, rollback testado

---

## 6. PENDENCIAS E RISCOS RESIDUAIS

**Listar explicitamente (mover para `memoria/PENDENCIAS.md`):**

| Item | Tipo | Severidade | Mitigacao | Responsavel | Prazo |
|------|------|------------|-----------|-------------|-------|
| TODO em codigo | Tech debt | Baixo | Criar issue | Autor | Proxima sprint |
| Config hardcoded | Config | Medio | Mover para env | Autor | Antes merge |
| Teste flaky conhecido | Qualidade | Medio | Investigar | QA | Esta sprint |
| Doc desatualizada | Docs | Baixo | Atualizar | Autor | Proxima sprint |

**Se pendencias Criticas/Alto sem mitigacao -> CONDICIONAL ou REJEITAR**

---

## 7. DECISAO FINAL

| Decisao | Criterio |
|---------|----------|
| **APROVAR** | Todos criterios `[x]`, build `[x]`, testes `[x]`, docs `[x]`, pendencias apenas Baixo/Informativo |
| **CONDICIONAL** | Itens `[~]` (Medio) com mitigacao acordada + prazo, OU build/testes com correcao trivial conhecida |
| **REJEITAR** | Qualquer criterio `[ ]` (Critico/Alto), build falha, testes falham, seguranca comprometida, pendencias Criticas sem mitigacao |

---

## RELATORIO DE REVISAO

```
## Revisao de Codigo: PR #[numero] - [Titulo]

**Autor:** [nome] | **Revisor:** [nome] | **Data:** [data]

**Decisao Final:** [APROVAR | CONDICIONAL | REJEITAR]

**Justificativa:** [resumo dos pontos decisivos]

**Condicoes (se CONDICIONAL):**
1. [Item] - Responsavel: [quem] - Prazo: [quando]
2. ...

**Achados Principais:**
### Criticos (bloqueiam)
- [ ] ...

### Altos (requerem acao antes merge)
- [ ] ...

### Medios (backlog proxima sprint)
- [ ] ...

### Baixos (nice to have)
- [ ] ...

**Evidencias:**
- Build: [link CI]
- Testes: [link CI]
- Coverage: [link coverage report]
- Diff: [link PR files changed]

**Proximos Passos:**
- [ ] Merge/Release
- [ ] Deploy
- [ ] Monitoramento pos-deploy
- [ ] Atualizar memoria/ (PENDENCIAS, DECISOES, HISTORICO)
```

---

## Assinaturas

```
Revisor: _________________________ | Data: ___________
Autor (ciente): _________________________ | Data: ___________
Tech Lead (se necessario): _________________________ | Data: ___________
```