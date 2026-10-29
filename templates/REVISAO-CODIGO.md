# Template REVISAO-CODIGO.md - Relatório de Code Review

> Copie este arquivo para `docs/REVISAO-CODIGO-[PR]-[DATA].md` e preencha.
> Use para documentar revisões de código (PR/MR reviews).

---

# Relatório de Code Review: PR #[NUMERO] - [TITULO]

---

## 1. INFORMAÇÕES DO PR

| Campo | Valor |
|-------|-------|
| **PR #** | [Numero] |
| **Titulo** | [Titulo do PR] |
| **Autor** | [Nome] |
| **Revisor(es)** | [Nomes] |
| **Branch** | [feature/fix/refactor/...] |
| **Base** | [main/develop/release/...] |
| **Issue Relacionada** | # [Numero] |
| **Data Inicio Review** | YYYY-MM-DD |
| **Data Conclusao** | YYYY-MM-DD |
| **Tipo** | `feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `security` |

---

## 2. CONTEXTO E CRITÉRIOS DE ACEITACAO

### Descrição da Mudança
[Resumo do que foi alterado - 2-3 frases]

### Critérios de Aceitação Originais
| # | Criterio | Status | Evidencia |
|---|----------|--------|-----------|
| 1 | [Criterio 1] | [OK/Parcial/Falta] | [Teste/CT-XXX / Link] |
| 2 | [Criterio 2] | [OK/Parcial/Falta] | [Teste/CT-YYY / Link] |
| 3 | [Criterio 3] | [OK/Parcial/Falta] | [Link] |

**Se qualquer criterio `Falta` -> REJEITAR** (exceto condicional acordado)

---

## 3. ANÁLISE DO DIFF (Qualidade de Código)

### Arquitetura e Padrões
- [ ] Segue `ARCHITECTURE.md` / `docs/ARQUITETURA.md` (camadas, responsabilidades)
- [ ] Segue `docs/CODIGO-LIMPO.md` (nomes, funcoes pequenas, tipagem, comentarios)
- [ ] Separacao de responsabilidades mantida (routes/controllers/services/validators)
- [ ] Nao ha quebra de contratos (tipos, APIs, eventos, schemas)
- [ ] Novos modulos seguem estrutura padrao (routes/controllers/services/validators)

### Seguranca (baseado em `docs/SEGURANCA.md` + `checklists/SEGURANCA.md`)
- [ ] Auth/AuthZ: middleware `autenticar` + `autorizar` em TODAS rotas protegidas
- [ ] RBAC: roles/permissions granulares (nao apenas "admin/user")
- [ ] IDOR prevention: verificacao propriedade recurso (`userId === resource.ownerId`)
- [ ] Validacao: Zod schemas em TODOS endpoints (body, params, query)
- [ ] Sanitizacao: DOMPurify output se HTML user-generated, CSP headers
- [ ] Segredos: nenhum no frontend, `.env` no gitignore, validacao startup
- [ ] Headers: CSP, HSTS, X-Frame-Options, Referrer-Policy
- [ ] Rate limit: endpoints sensiveis protegidos (auth 5/15min, API 100req/min)
- [ ] Logs: estruturados (Pino/Winston), sem segredos/PII

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
- [ ] Testes unitarios para nova logica (cobertura >= 80%)
- [ ] Testes integracao para endpoints novos/modificados
- [ ] Testes E2E para fluxos criticos novos
- [ ] Cobertura mantida/acima threshold (linhas 80%, branches 70%)
- [ ] Testes passam localmente e no CI

---

## 4. BUILD E TYPE CHECKING

| Etapa | Comando | Status | Evidencia |
|-------|---------|--------|-----------|
| TypeCheck | `npm run typecheck` | [OK/Fail] | [Link CI] |
| Lint | `npm run lint` | [OK/Fail] | [Link CI] |
| Build | `npm run build` | [OK/Fail] | [Link CI] |
| Testes | `npm run test` | [OK/Fail] | [Link CI] |
| Coverage | `npm run test:coverage` | [Thresholds OK/Fail] | [Link Coverage] |

**Se qualquer `[Fail]` -> CONDICIONAL (corrigir antes de aprovar)**

---

## 5. DOCUMENTAÇÃO E RASTREABILIDADE

- [ ] `README.md` atualizado se nova funcionalidade/config
- [ ] `CHANGELOG.md` atualizado (Conventional Commits)
- [ ] `docs/ARQUITETURA.md` atualizado se mudanca arquitetural
- [ ] `docs/DECISOES-TECNICAS.md` (ADR) se decisao arquitetural
- [ ] `memoria/DECISOES.md` e `memoria/PENDENCIAS.md` atualizados
- [ ] Commits atomicos (uma mudanca logica por commit)
- [ ] Mensagens Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `security:`)
- [ ] Branch nomeada corretamente (`feature/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`, `security/`)

---

## 6. VERIFICAR REGRESSÕES

- [ ] Suite completa de testes executada (nao apenas novos)
- [ ] Funcionalidades existentes nao quebraram
- [ ] Testes E2E criticos passam (login, fluxos principais)
- [ ] Performance: p95 latencia nao degradou > 10%
- [ ] Bundle size (frontend): nao aumentou > 10% sem justificativa

---

## 7. PENDÊNCIAS E RISCOS RESIDUAIS

**Listar explicitamente (mover para `memoria/PENDENCIAS.md`):**

| Item | Tipo | Severidade | Mitigacao | Responsavel | Prazo |
|------|------|------------|-----------|-------------|-------|
| [TODO em codigo] | Tech debt | Baixo | Criar issue | Autor | Proxima sprint |
| [Config hardcoded] | Config | Medio | Mover para env | Autor | Antes merge |
| [Teste flaky conhecido] | Qualidade | Medio | Investigar | QA | Esta sprint |

**Se pendencias Criticas/Alto sem mitigacao -> CONDICIONAL ou REJEITAR**

---

## 8. DECISAO FINAL

| Decisao | Criterio |
|---------|----------|
| **APROVAR** | Todos criterios `[x]`, build `[x]`, testes `[x]`, docs `[x]`, pendencias apenas Baixo/Informativo |
| **CONDICIONAL** | Itens `[~]` (Medio) com mitigacao acordada + prazo, OU build/testes com correcao trivial conhecida |
| **REJEITAR** | Qualquer criterio `[ ]` (Critico/Alto), build falha, testes falham, seguranca comprometida, pendencias Criticas sem mitigacao |

---

## RELATÓRIO DE REVISÃO

```
## Code Review: PR #[numero] - [Titulo]

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

## ASSINATURAS

```
Revisor: _________________________ | Data: ___________
Autor (ciente): _________________________ | Data: ___________
Tech Lead (se necessario): _________________________ | Data: ___________
```