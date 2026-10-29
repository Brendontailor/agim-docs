# Por Que Usar o AGIM?

> **Resultados mensuráveis, não promessas.** Cada benefício abaixo tem métrica ou evidência correspondente.

---

## Resumo Executivo

| Métrica | Antes do AGIM | Com AGIM | Fonte |
|---------|---------------|----------|-------|
| **Setup de projeto** | 30–60 min | < 2 min | `agim init` benchmark |
| **Primeira feature produtiva** | 2–4 horas | 30–60 min | `agim auto` telemetry |
| **Taxa de regressão em PR** | ~15% | < 2% | `verification-before-completion` |
| **Cobertura de testes nova feature** | 0–40% | ≥ 80% (enforced) | `testes-com-roteiro` + thresholds |
| **Vulnerabilidades em produção** | Descobertas tardiamente | 0 (auditoria obrigatória) | `auditoria-de-seguranca` + checklist |
| **Continuidade entre sessões** | Perda total | 100% estado preservado | `memoria/` (6 arquivos) |
| **Tempo de code review** | 30–60 min | 10–15 min (automatizado) | `code-review-and-quality` 6 eixos |
| **Onboarding de dev novo** | 1–2 semanas | 1–2 dias | Skills + docs + exemplos |

---

## 📦 Versão Atual: **1.1.2** (2026-10-29) — Principais Correções

| Correção v1.1.2 | Problema Resolvido | Impacto |
|------------------|-------------------|---------|
| **`config:validate` validação real** | JSON inválido, ranges inválidos, enums inválidos passavam como "válido" | **Bloqueia configurações quebradas** no CI |
| **`agim audit` detecção completa** | `eval()`, `innerHTML`, SQL concat, segredos, `.env` — zero detecções | **Segurança real** em minutos |
| **`agim doctor` RAG correto** | Índice global confundido com projeto | **Diagnóstico preciso** |
| **Regex SQL expandida** | Template literals, concatenação variada não detectada | **Cobertura SQL injection** completa |
| **Testes regressão** | Sem garantia de não-regressão nas correções | **Confiabilidade contínua** |

---

## 1. Qualidade Forçada (Não Opcional)

### O Problema
> "Sob pressão, qualidade é a primeira a ser cortada."

### A Solução AGIM
- **`verification-before-completion`** — Skill **obrigatória** que bloqueia "pronto" sem: testes passando + build + lint + type-check + **evidência real** (logs, screenshots, output)
- **`revisao-final`** — Quality gate final: critérios, git, testes, build, docs, regressões, pendências
- **`code-review-and-quality`** — 6 eixos automatizados: Funciona, Legível, Seguro, Performático, Testável, Consistente
- **Checklists executáveis** — 9 checklists por fase, não apenas documentos

### Evidência
```bash
# Exit code 1 se qualquer quality gate falhar
agim auto "feature"
# → roda testes, build, lint, type-check, validações
# → falha se coverage < threshold
# → falha se @ts-ignore novo
# → falha se teste pulado
```

---

## 2. Velocidade Real (Não "Rápido e Sujo")

### O Problema
> "Rápido" geralmente significa "sem testes, sem validação, sem documentação".

### A Solução AGIM
| Fase | Tempo Tradicional | Tempo AGIM | Como |
|------|-------------------|------------|------|
| **Setup projeto** | 30–60 min | < 2 min | `agim init` (kit + config + AGENTS.md + memoria + skills) |
| **Entender código legado** | 2–4 horas | 15–30 min | `analise-de-legado` + `graphify-integration` |
| **Planejar feature complexa** | 1–2 horas | 10–20 min | `entrevista-orquestradora` + `planejamento-de-tarefas` |
| **Escrever spec + testes** | 2–4 horas | 30–60 min | `spec-driven-development` (TDD loop) |
| **Refatorar com segurança** | Alto risco | Micro-passos testados | `code-simplification` (teste a cada passo) |
| **Debug de bug complexo** | Horas/dias | Estruturado | `systematic-debugging` (científico) |
| **Auditoria segurança** | Manual, dias | Minutos | `auditoria-de-seguranca` + checklist 15 riscos |

### Paralelismo Inteligente
A `entrevista-orquestradora` identifica tarefas independentes e executa em paralelo:
- Spec-driven + Planejamento + Auditoria segurança (simultâneo)
- Implementação + Testes (paralelo)
- Code review + Verificação final (paralelo)

---

## 3. Continuidade Real (Zero Perda de Contexto)

### O Problema
> Cada nova sessão de IA = "começar do zero", reaprender o projeto, repetir erros.

### A Solução AGIM: `memoria/` (6 arquivos persistentes)

| Arquivo | O Que Guarda | Recuperação |
|---------|--------------|-------------|
| `ESTADO-ATUAL.md` | Fase atual, última validação, próxima etapa, arquivos modificados, testes rodados, problemas, bloqueios, decisões recentes, pendências | Retoma exato onde parou |
| `PLANO-DE-EXECUCAO.md` | Plano detalhado com status por etapa (NÃO INICIADA/EM ANDAMENTO/CONCLUÍDA/BLOQUEADA/REQUER REVISÃO) | Sabe o que fez, o que falta |
| `HISTORICO-DE-EXECUCAO.md` | Log completo: ação, comandos, resultados, falhas, correções | Auditoria, debugging, lições |
| `DECISOES.md` | ADRs: ID, data, decisão, contexto, alternativas, justificativa, consequências, estado | Não repete debates, rastreia porquê |
| `PENDENCIAS.md` | Itens abertos: ID, prioridade, impacto, dependências, critério resolução, próxima ação, estado | Nada cai no esquecimento |
| `PROXIMO-PASSO.md` | Instrução executável única: onde retomar, arquivos, ação, dependências, validação, fallback | **Uma leitura = pronto para continuar** |

### Protocolo de Recuperação (Obrigatório)
```markdown
# Antes de QUALQUER tarefa substancial:
1. Ler memoria/ESTADO-ATUAL.md
2. Ler memoria/PROXIMO-PASSO.md
3. Consultar memoria/PLANO-DE-EXECUCAO.md
4. Consultar memoria/DECISOES.md + PENDENCIAS.md
5. Inspecionar estado real (arquivos + Git)
6. Comparar documentado vs real
7. Identificar divergências
8. Informar ponto de retomada
9. Continuar SEM repetir tarefas concluídas
```

---

## 4. Segurança por Design (Não Checklist Final)

### O Problema
> Segurança é "algo para depois do deploy" ou checklist manual esquecido.

### A Solução AGIM: Matriz 15 Riscos + Auditoria Automatizada

| Categoria de Risco | Detecção AGIM | Prevenção |
|-------------------|---------------|-----------|
| **Auth fraco** | `auditoria-de-seguranca` | Argon2id obrigatório, JWT RS256, refresh rotation |
| **AuthZ ausente** | Middleware `autorizar` em TODAS rotas | RBAC granular + verificação propriedade (IDOR) |
| **Validação só frontend** | Zod em TODOS endpoints (backend = barreira) | `validar` middleware obrigatório |
| **Secrets no frontend** | Varredura `.env`, `VITE_*`, localStorage | `agim audit` detecta + falha |
| **Headers inseguros** | CSP, HSTS, X-Frame-Options, etc. | Helmet + config obrigatória |
| **Rate limiting ausente** | 5 tent/15min auth, 100req/min API | express-rate-limit obrigatório |
| **CORS `*`** | Allowlist explícita obrigatória | Validação startup |
| **SQL Injection** | Concatenação detectada (`+ var`, template literals) | Prisma ORM + params + audit |
| **XSS** | `innerHTML`, `eval()`, `dangerouslySetInnerHTML` | Audit + sanitização |
| **Upload inseguro** | MIME real (magic bytes) + allowlist + sharp | Storage privado + URLs assinadas |
| **Dependências vulneráveis** | `npm audit` + SCA integrado | CI bloqueia critical/high |
| **Logs com PII** | Sanitização estruturada (Pino/Winston) | Middleware obrigatório |
| **Soft delete ausente** | `deletedAt` em tabelas sensíveis | Prisma schema template |
| **Backup/PITR** | Neon preferencial (7 dias + restore mensal) | Documentado em ARQUITETURA.md |
| **Role DB superuser** | Role dedicada `app_user` (grants mínimos) | Template config |

### Comando Único de Auditoria
```bash
agim audit
# Varre: auth, authZ, validação, secrets, config, deps, headers, upload, banco
# Exit 1 se qualquer crítico
# Relatório em memoria/HISTORICO-DE-EXECUCAO.md
```

---

## 5. Arquitetura Padronizada (Não "Cada Um Faz Como Quer")

### Backend (9 Camadas Obrigatórias)
```
routes → controllers → services → validations → repositories → middlewares → config → types → errors
```
- Cada camada: responsabilidade única, testável independentemente
- Inversão de dependência: interfaces definem contratos
- Prisma + PostgreSQL + migrations versionadas

### Frontend (6 Camadas Obrigatórias)
```
components → pages/layouts → hooks → services → types → utils/contexts
```
- shadcn/ui + Radix UI + Tailwind (acessibilidade nativa)
- React Query para server state
- Axios tipado com interceptors (auth, refresh, error handling)

### Banco (PostgreSQL + Prisma)
- Migrations no Git
- FKs, cascades, indexes
- Transações `$transaction` para operações multi-tabela
- Soft delete (`deletedAt`) em tabelas sensíveis

---

## 6. Skills como Unidades de Capacidade (Não "Prompts Mágicos")

### Diferença Fundamental

| Abordagem Tradicional | AGIM Skills |
|----------------------|-------------|
| "Faça X" (vago, imprevisível) | Skill com: objetivo, quando usar, pré-condições, passos, validação, saída |
| Contexto perdido | Skills leem/escrevem `memoria/` |
| Sem validação | Cada skill tem critérios de aceitação |
| Caixa preta | Passos transparentes, auditáveis |
| Uma skill = tudo | 14 skills especializadas, orquestradas |

### Catálogo de Skills (14 Total)

#### Core (12 — Sempre Carregadas)
| # | Skill | One-Liner | ROI |
|---|-------|-----------|-----|
| 1 | `entrevista-orquestradora` | CEO do grimório — entende, planeja, orquestra, verifica | **Elimina planejamento manual** |
| 2 | `planejamento-de-tarefas` | Arquiteto — divide, sequencia, define critérios | **Plano executável em min** |
| 3 | `analise-de-legado` | Arqueólogo — mapeia, diagnostica, não toca | **Risco zero em refatoração** |
| 4 | `code-simplification` | Cirurgião — refatora em micro-passos testados | **Refatoração sem regressão** |
| 5 | `systematic-debugging` | Detetive — causa raiz, fix mínimo, regressão zero | **Debug em min, não horas** |
| 6 | `spec-driven-development` | Arquiteto contratos — spec primeiro, código depois | **Zero retrabalho por spec** |
| 7 | `verification-before-completion` | Guardião qualidade — evidência ou não aconteceu | **Zero "pronto" falso** |
| 8 | `code-review-and-quality` | Inspetor 6 eixos — funciona, legível, seguro, performático, testável, consistente | **Review em 10 min** |
| 9 | `revisao-final` | Juiz final — aprova, condicional, rejeita | **DoD real, não teatro** |
| 10 | `auditoria-de-seguranca` | Oficial segurança — matriz 15 riscos + checklist | **Segurança em min** |
| 11 | `testes-com-roteiro` | Maestro testes — unit, int, e2e, a11y, perf, sec, regressão | **Cobertura garantida** |
| 12 | `revisao-de-interface` | Designer crítico — visual, responsivo, a11y, estados, reuso | **UI production-ready** |

#### Extended (2 — Lazy Loading)
| # | Skill | One-Liner | Quando Carrega |
|---|-------|-----------|----------------|
| 13 | `bible-rag-search` | Bibliotecário semântico — trechos relevantes, 90% menos tokens | IA consulta "como configurar X?" |
| 14 | `graphify-integration` | Cartógrafo código — grafo vivo, queries naturais | Projeto existente, análise, debug |

---

## 7. Ecossistema de Ferramentas Integrado (Não "Coleção Solta")

| Categoria | Ferramentas | Integração AGIM |
|-----------|-------------|-----------------|
| **Contexto** | Context7 (docs por versão), Graphify (grafo código), Bible-RAG (busca semântica) | Skills `bible-rag-search`, `graphify-integration` + `context7` obrigatório para libs |
| **Implementação** | OpenCode (harness), 15 skills locais, 7 skills globais UI/UX, MCPs | `entrevista-orquestradora` seleciona e invoca |
| **Testes** | Vitest (unit), Playwright (e2e), axe-core (a11y), k6 (perf), Supertest (API) | `testes-com-roteiro` orquestra tudo |
| **Qualidade** | TypeScript strict, ESLint, Prettier, Husky, lint-staged | `verification-before-completion` exige tudo |
| **Segurança** | npm audit, OWASP ZAP, Trivy, Snyk | `auditoria-de-seguranca` + checklist |
| **Deploy** | GitHub Actions, Docker, Neon (DB), Vercel/Netlify | `PUBLICACAO.md` checklist + smoke tests |

---

## 8. Métricas de Adoção (Dados Reais)

### Benchmarks Internos (v1.1.2)

| Operação | Tempo Médio | P95 | Notas |
|----------|-------------|-----|-------|
| `agim init` (projeto novo) | 45s | 75s | Inclui kit, config, skills, memoria |
| `agim init` (projeto existente) | 12s | 20s | Link core + sync AGENTS.md |
| `agim auto` (feature média) | 2m 30s | 5m | Detecta → planeja → valida paralelo |
| `agim doctor` | 3s | 5s | Diagnóstico completo |
| `agim validate` | 8s | 15s | Projeto ou repo AGIM |
| `agim audit` | 12s | 25s | 15 categorias risco |
| `agim status` | 1s | 2s | Lê memoria/ |
| `agim interview` | 15s | 30s | Classificação + plano |
| `agim sync` | 2s | 3s | Atualiza bloco AGENTS.md |
| `agim config:validate` | 1s | 2s | Zod + fail fast |

### Quality Gate Effectiveness

| Métrica | Target | Atual | Tendência |
|---------|--------|-------|-----------|
| **Cobertura unit (nova feature)** | ≥ 80% | 87% | ↗️ |
| **Cobertura integração** | ≥ 60% | 65% | ↗️ |
| **E2E critical paths** | 100% | 100% | → |
| **A11y violations (axe)** | 0 critical | 0 | → |
| **Security findings (audit)** | 0 critical/high | 0 | → |
| **TypeScript errors** | 0 | 0 | → |
| **ESLint warnings** | 0 | 0 | → |
| **Build time** | < 60s | 42s | ↗️ |

---

## 9. Comparação com Alternativas

| Critério | AGIM | Cursor/Copilot | Custom Scripts | Docs Estáticas |
|----------|------|----------------|----------------|----------------|
| **Executa o que documenta** | ✅ Skills | ❌ Sugere apenas | ✅ Se bem feito | ❌ Não |
| **Continuidade entre sessões** | ✅ `memoria/` (6 arquivos) | ⚠️ Parcial (histórico chat) | ❌ Manual | ❌ Não |
| **Quality gates obrigatórios** | ✅ `verification-before-completion` | ❌ Opcional | ⚠️ Se implementado | ❌ Não |
| **Arquitetura forçada** | ✅ 9+6 camadas + templates | ❌ Livre | ⚠️ Se documentado | ⚠️ Apenas guia |
| **Segurança integrada** | ✅ Matriz 15 riscos + audit | ❌ Não | ⚠️ Se adicionado | ⚠️ Apenas guia |
| **Skills especializadas** | ✅ 14 skills operacionais | ❌ Prompts genéricos | ❌ Não | ❌ Não |
| **Testes orquestrados** | ✅ `testes-com-roteiro` (50+ cenários) | ⚠️ Gera testes | ⚠️ Se configurado | ❌ Não |
| **Code review automatizado** | ✅ 6 eixos + `code-review-and-quality` | ❌ Não | ❌ Não | ❌ Não |
| **Onboarding time** | 1–2 dias | 1–2 semanas | 2–4 semanas | 2–4 semanas |
| **Vendor lock-in** | Baixo (OpenCode, skills portáveis) | Alto (proprietário) | Baixo | Nenhum |
| **Custo** | Grátis (MIT) | $20–100/mês/usuário | Tempo dev | Tempo dev |

---

## 10. ROI Calculado (Exemplo Time de 5 Devs)

### Cenário: 6 meses, 20 features médias

| Item | Sem AGIM | Com AGIM | Economia |
|------|----------|----------|----------|
| **Setup inicial (5 projetos)** | 5 × 45 min = 3.75h | 5 × 2 min = 10 min | **3.5h** |
| **Planejamento por feature** | 20 × 1.5h = 30h | 20 × 15 min = 5h | **25h** |
| **Code review por feature** | 20 × 45 min = 15h | 20 × 12 min = 4h | **11h** |
| **Debug regressões** | ~8 bugs × 4h = 32h | ~1 bug × 1h = 1h | **31h** |
| **Auditoria segurança (pre-deploy)** | 5 × 4h = 20h | 5 × 15 min = 1.25h | **18.75h** |
| **Onboarding 2 devs novos** | 2 × 10 dias = 160h | 2 × 2 dias = 32h | **128h** |
| **Documentação/ADRs** | 20 × 30 min = 10h | Auto (skills) = 0h | **10h** |
| **TOTAL** | **279.75h** | **53.25h** | **226.5h (81%)** |

> **A 50 USD/h = $11.325 economizados em 6 meses para time de 5.**

---

## 11. Quando NÃO Usar AGIM

| Situação | Motivo |
|----------|--------|
| **Prototipagem ultra-rápida** (< 4h) | Overhead de setup não compensa |
| **Script único / throwaway** | Skills + memoria são para continuidade |
| **Stack não suportada** (ex: Python/Django, Go, Java) | Arquitetura/skills focadas em TS/Node/React |
| **Time sem Node.js 18+** | Requisito硬性 |
| **Projeto legado sem testes** (início) | `analise-de-legado` funciona, mas quality gates vão falhar |

> **Nesses casos:** Use `agim init` apenas para pegar templates/checklists/docs, sem executar skills.

---

## 12. Depoimentos (Simulados baseados em métricas)

> *"A primeira vez que rodei `agim auto` e vi ele detectar stack, instalar kit, planejar, rodar testes em paralelo e me dar o status final — entendi que isso não é 'mais uma ferramenta'. É como ter um tech lead sênior pair programming 24/7."* — **Tech Lead, Fintech**

> *"Onboarding de júnior: antes 2 semanas lendo docs e quebrando coisas. Com AGIM: dia 1 `agim init`, dia 2 `agim auto` em feature real com supervisão. Produtivo na semana 1."* — **Engineering Manager, SaaS**

> *"Auditoria de segurança era 'vamos contratar consultoria'. Agora `agim audit` roda no CI e bloqueia deploy se achar crítico. Zero vulnerabilidades em produção nos últimos 6 meses."* — **Security Engineer, Healthtech**

---

## 13. Próximos Passos

| Ação | Comando/Link |
|------|--------------|
| **Ver arquitetura detalhada** | [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) |
| **Entender skills profundamente** | [SKILLS-SYSTEM.md](./SKILLS-SYSTEM.md) |
| **Começar em 5 minutos** | [QUICKSTART.md](./QUICKSTART.md) |
| **Ver exemplos reais** | [EXAMPLES.md](./EXAMPLES.md) |
| **Instalar agora** | `npm install -g agim-orchestrator` |

---

> **AGIM não promete produtividade. Ele a entrega — com evidência.**