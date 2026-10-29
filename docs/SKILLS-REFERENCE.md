# Referência Rápida das Skills — AGIM (Agent Grimoire)

> **14 Skills Total** — 12 Core (sempre carregadas) + 2 Extended (lazy/carregadas sob demanda)

---

## 🎯 Core Skills (12 — Sempre Carregadas)

| # | Skill | One-Liner | Quando Usar |
|---|-------|-----------|-------------|
| **1** | `entrevista-orquestradora` | **Ponto de entrada central** — Entende pedido, classifica, planeja, seleciona skills, executa, verifica | **SEMPRE** — Início de qualquer sessão/substancial |
| **2** | `planejamento-de-tarefas` | Transforma pedido em plano executável: etapas, dependências, critérios, riscos | Nova feature, tarefa complexa, refatoração, sprint planning |
| **3** | `analise-de-legado` | Mapeia arquitetura, módulos, dependências, dívida técnica, riscos — **sem modificar código** | Antes de refatorar, onboarding em código legado, due diligence |
| **4** | `revisao-de-interface` | Auditoria visual, responsividade, a11y, estados, reuso de componentes | Nova UI, redesign, PR frontend, auditoria UX |
| **5** | `auditoria-de-seguranca` | Auth, AuthZ, validação, secrets, deps, headers, matriz 15 riscos | Pre-deploy, auth, dados sensíveis, compliance |
| **6** | `testes-com-roteiro` | Orquestra testes: unit, integração, E2E, a11y, perf, sec, regressão | Validação, regressão, pre-deploy, TDD |
| **7** | `revisao-final` | Quality gate final: critérios, git, testes, build, docs, regressões, pendências | Pre-merge, pre-release, entrega, DoD |
| **8** | `code-simplification` | Refatoração segura: micro-passos atômicos, testes a cada passo, rollback fácil | Após `analise-de-legado`, code review, prep para extensão |
| **9** | `systematic-debugging` | Debug científico: observa → reproduz → isola → hipotetisa → testa → valida → documenta | Bug reportado, flaky test, performance degradada, erro em cadeia |
| **10** | `spec-driven-development` | Spec-first: descobre → especifica (funcional + ADR + contrato + plano testes) → valida → implementa (TDD) | Nova feature, nova API, breaking change, integração externa |
| **11** | `verification-before-completion` | Quality gate obrigatório: testes + build + lint + type-check + validações + **evidência real** | **SEMPRE** antes de declarar "pronto", PR, merge, deploy |
| **12** | `code-review-and-quality` | Code review multi-eixo (6 eixos): Funciona, Legível, Seguro, Performático, Testável, Consistente | PR, commit main, hotfix, code-simplification output |

---

## ⚡ Extended Skills (2 — Lazy Loading)

| # | Skill | One-Liner | Quando Carrega |
|---|-------|-----------|----------------|
| **13** | `bible-rag-search` | Busca semântica no AGIM: retorna só trechos relevantes (~2KB vs 27KB doc) | IA consulta o grimório ("como configurar X?") |
| **14** | `graphify-integration` | Grafo de código do projeto: queries naturais → subgrafo relevante (~2KB vs 200KB) | Projeto existente (`existing`), `analise-de-legado`, `systematic-debugging`, `code-simplification` |

---

## 🔄 Fluxo Típico de Skills (Pipeline)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PIPELINE PADRÃO AGIM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  "Nova feature: blog com markdown"                                          │
│          │                                                                  │
│          ▼                                                                  │
│  ┌─────────────────────┐                                                   │
│  │ entrevista-orquestradora                                                 │
│  │ • Classifica: web, feature, media, medio, blog                         │
│  │ • Seleciona: planejamento + spec-driven + testes + auditoria + revisao  │
│  └────────┬────────────┘                                                   │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────┐  │
│  │ spec-driven-dev     │   │ planejamento-tarefas │   │ auditoria-seg   │  │
│  │ (spec-first + TDD)  │   │ (12 etapas, 3 fases) │   │ (checklist)     │  │
│  └────────┬────────────┘   └────────┬────────────┘   └────────┬────────┘  │
│           │                       │                       │            │
│           ▼                       ▼                       ▼            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    IMPLEMENTAÇÃO PARALELA                       │   │
│  │  code-simplification (refatoração)  │  testes-com-roteiro       │   │
│  │  spec-driven impl (TDD loop)        │  (unit + int + e2e + a11y) │   │
│  └────────────────────────┬────────────────────────────────────────┘   │
│                           │                                          │
│                           ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              verification-before-completion                     │   │
│  │  testes + build + lint + type-check + validações + evidência    │   │
│  └────────────────────────┬────────────────────────────────────────┘   │
│                           │                                          │
│                           ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              code-review-and-quality (6 eixos)                  │   │
│  │  Funciona │ Legível │ Seguro │ Performático │ Testável │ Consistente│
│  └────────────────────────┬────────────────────────────────────────┘   │
│                           │                                          │
│                           ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              revisao-final (Quality Gate Final)                 │   │
│  │  Critérios │ Git │ Testes │ Build │ Docs │ Pendências           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quando Usar Cada Skill (Decision Tree)

```
PRECISA...
├── Entender o que fazer / planejar?
│   └── entrevista-orquestradora → planejamento-de-tarefas
│
├── Entender código existente / riscos?
│   └── analise-de-legado → (se refatorar) code-simplification
│
├── Nova feature / API / breaking change?
│   └── spec-driven-development → planejamento → implementação TDD
│
├── Bug / erro / performance?
│   └── systematic-debugging → testes-com-roteiro (regressão) → verification
│
├── Nova UI / redesign / PR frontend?
│   └── revisao-de-interface (+ testes-com-roteiro a11y)
│
├── Auth / dados sensíveis / pre-deploy / compliance?
│   └── auditoria-de-seguranca (+ checklist SEGURANCA.md)
│
├── Refatorar / limpar código?
│   └── analise-de-legado → code-simplification (micro-passos + testes)
│
├── Code review / PR / merge / release?
│   └── code-review-and-quality → revisao-final → verification-before-completion
│
├── "Está pronto?" / "Pode merge?" / "Deploy?"
│   └── verification-before-completion (SEMPRE) → revisao-final
│
├── IA precisa consultar o grimório?
│   └── bible-rag-search "sua pergunta" (lazy, sem carregar skills)
│
├── Precisa entender dependências / arquitetura do código?
│   └── graphify-integration "query natural" (lazy, projetos existentes)
│
└── Precisa planejar tarefas complexas?
    └── planejamento-de-tarefas (sempre após entrevista/especificação)
```

---

## ⚡ Ativação Rápida (OpenCode)

```bash
# Carregar skill específica
skill entrevista-orquestradora
skill planejamento-de-tarefas
skill analise-de-legado
skill code-simplification
skill systematic-debugging
skill spec-driven-development
skill verification-before-completion
skill code-review-and-quality
skill revisao-final
skill auditoria-de-seguranca
skill testes-com-roteiro
skill revisao-de-interface
skill bible-rag-search
skill graphify-integration

# Ou usar linguagem natural:
# "Entrevista: vamos definir o objetivo"
# "Nova feature: blog com markdown"
# "Bug fix: race condition no cache"
# "Auditoria segurança completa"
# "Refatorar legacy-payment.ts"
```

---

## 📋 Checklist de Ativação por Cenário

| Cenário | Skills Obrigatórias | Skills Opcionais |
|---------|---------------------|------------------|
| **Nova Feature** | entrevista → planejamento → spec-driven → testes → verification → revisao | auditoria-seg, code-review |
| **Bug Fix** | systematic-debugging → testes-com-roteiro → verification → revisao | code-simplification (se refatorar) |
| **Refatoração** | analise-de-legado → code-simplification → testes → verification → revisao | code-review |
| **Nova UI** | entrevista → revisao-de-interface → testes (a11y) → verification → revisao | spec-driven (se complexa) |
| **Auditoria Seg** | auditoria-de-seguranca → testes (sec) → verification → revisao | systematic-debugging (se achar vuln) |
| **Code Review** | code-review-and-quality → verification → revisao | systematic-debugging (se achar bug) |
| **Novo Projeto** | entrevista → planejamento → spec-driven → implementação → testes → verification → revisao | auditoria-seg (pre-deploy) |

---

## 🔑 Resumo em Uma Linha

| Skill | Resumo |
|-------|--------|
| `entrevista-orquestradora` | **CEO do grimório** — entende, planeja, orquestra, verifica |
| `planejamento-de-tarefas` | **Arquiteto** — divide, sequencia, define critérios |
| `analise-de-legado` | **Arqueólogo** — mapeia, diagnostica, não toca |
| `code-simplification` | **Cirurgião** — refatora em micro-passos testados |
| `systematic-debugging` | **Detetive** — causa raiz, fix mínimo, regressão zero |
| `spec-driven-development` | **Arquiteto de contratos** — spec primeiro, código depois |
| `verification-before-completion` | **Guardião da qualidade** — evidência ou não aconteceu |
| `code-review-and-quality` | **Inspetor 6 eixos** — funciona, legível, seguro, performático, testável, consistente |
| `revisao-final` | **Juiz final** — aprova, condicional, rejeita |
| `auditoria-de-seguranca` | **Oficial de segurança** — matriz 15 riscos + checklist |
| `testes-com-roteiro` | **Maestro de testes** — unit, int, e2e, a11y, perf, sec, regressão |
| `revisao-de-interface` | **Designer crítico** — visual, responsivo, a11y, estados, reuso |
| `bible-rag-search` | **Bibliotecário semântico** — trechos relevantes, 90% menos tokens |
| `graphify-integration` | **Cartógrafo de código** — grafo vivo, queries naturais |

---

> **Dica**: A `entrevista-orquestradora` **sempre** decide quais skills ativar. Você raramente precisa chamar skills manualmente — diga o objetivo e a orquestradora monta o pipeline.