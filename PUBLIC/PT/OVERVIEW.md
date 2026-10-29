# Visão Geral do AGIM

> **AGIM (Agent Grimoire)** — Motor de orquestração para agentes de IA que executa o que ensina.

---

## O que é o AGIM?

O **AGIM** é um sistema de orquestração para agentes de IA que transforma documentação de melhores práticas em **execução automatizada**. Não é apenas um conjunto de documentos — é um **grimório executável** onde cada padrão, regra e checklist tem uma *skill* correspondente que pode ser invocada para aplicá-lo automaticamente.

### Conceitos Fundamentais

| Conceito | Descrição |
|----------|-----------|
| **Grimório** | Base de conhecimento versionada (docs, checklists, templates, skills) |
| **Orquestradora** | Skill central que entende, classifica, planeja, seleciona skills e verifica |
| **Skills** | Unidades de capacidade operacional (14 total: 12 core + 2 extended) |
| **Memória Persistente** | 6 arquivos em `memoria/` que garantem continuidade entre sessões |
| **Kit Global Compartilhado** | `~/.agent-bible` vinculado via symlink em `.agim/core` |

---

## O Problema que o AGIM Resolve

### Antes do AGIM
- ❌ Documentação parada que ninguém lê
- ❌ Agentes "alucinam" padrões inexistentes
- ❌ Contexto perdido entre sessões
- ❌ Quality gates ignorados sob pressão
- ❌ Setup repetitivo a cada novo projeto
- ❌ Code review superficial por falta de tempo

### Com o AGIM
- ✅ **Documentação viva** — skills executam o que está escrito
- ✅ **Orquestração inteligente** — a `entrevista-orquestradora` decide o que fazer
- ✅ **Continuidade real** — `memoria/` persiste estado, decisões, histórico
- ✅ **Quality gates obrigatórios** — `verification-before-completion` exige evidência
- ✅ **Bootstrap em 1 comando** — `agim init` instala tudo
- ✅ **Code review multi-eixo** — 6 dimensões automatizadas

---

## Como Funciona (Fluxo Principal)

```mermaid
graph TD
    A[Usuário: "Nova feature: API usuários"] --> B[entrevista-orquestradora]
    B --> C{Classifica:<br/>domínio/tipo/complexidade/risco/escopo}
    C --> D[Seleciona skills mínimas necessárias]
    D --> E[Gera plano com critérios de aceitação]
    E --> F[Executa em paralelo com verificação por etapa]
    F --> G[Quality gate: testes + build + lint + type-check]
    G --> H[Code review 6 eixos]
    H --> I[Revisão final: DoD completo]
    I --> J[Registra em memoria/]
```

---

## 📦 Versão Atual: **1.1.2** (2026-10-29)

### ✨ Novidades da v1.1.2

| Correção | Impacto |
|----------|---------|
| **`config:validate` agora valida corretamente** | JSON inválido, ranges fora do permitido (coverage > 100), campos obrigatórios ausentes, enums inválidos (`typescript: "relaxed"`, `lint: "verbose"`) agora falham corretamente (exit 1) |
| **`agim audit` detecta todas vulnerabilidades** | Agora captura `eval()`, `.innerHTML =`, concatenação SQL (`+ variavel`), senha hardcoded, `AKIA...` no `.env` — inclui SQL via `+ var` sem aspas |
| **`agim doctor` distingue índice RAG corretamente** | Projeto → "presente", global → "existe mas não é deste projeto", nenhum → "ausente" |
| **Regex SQL injection expandida** | Detecta template literals (`${...}`), concatenação com aspas (`+ 'str'`) e concatenação direta (`+ variavel`) |
| **Falsos positivos em testes eliminados** | `security-audit.cjs` ignora arquivos de teste temporários (`test-regex.cjs`, etc.) |
| **Testes de regressão adicionados** | Unit para validação de enums/ranges; smoke para auditoria (eval, innerHTML, SQL, segredos, .env) |

---

## O Que Vem no Pacote

### 1. Documentação Técnica (docs/)
| Arquivo | Propósito |
|---------|-----------|
| `ARQUITETURA.md` | 9 camadas backend + 6 frontend, convenções |
| `SEGURANCA.md` | Auth (Argon2id, JWT RS256), AuthZ, validação, secrets, headers, matriz 15 riscos |
| `TESTES.md` | Pirâmide, Vitest, Playwright, axe, k6, coverage thresholds |
| `CODIGO-LIMPO.md` | SRP, baixo acoplamento, TS strict, Zod, anti-padrões |
| `CONFIGURATION.md` | `.agim/config.json` referência completa |
| `QUICKSTART.md` | Zero a `agim auto` em 5 min |
| `TROUBLESHOOTING.md` | Problemas comuns e soluções |
| `FERRAMENTAS-IA.md` | Inventário: 3 categorias, 11 campos cada |
| `IA-E-CONTEXTO.md` | Ecossistema: AGENTS, Skills, Docs, Memória, Graphify, Context7, RAG |
| `BOOTSTRAP-AMBIENTE.md` | Ordem obrigatória: OpenCode, 7 skills globais, 3 MCPs, 6 skills locais |
| `VALIDACAO-DO-REPOSITORIO.md` | Comandos validação: estrutura, links, syntax, skills, templates, secrets |

### 2. Checklists Obrigatórios (checklists/ - 9)
| Checklist | Quando Usar |
|-----------|-------------|
| `INICIO.md` | Preparação, bootstrap, validação inicial |
| `DESENVOLVIMENTO.md` | Durante implementação (qualidade, segurança, padrões) |
| `SEGURANCA.md` | Auditoria segurança (auth, authZ, validação, secrets, deps) |
| `TESTES.md` | Validação testes (unit, int, e2e, a11y, sec, perf) |
| `ROTEIRO-DE-TESTES.md` | 50+ cenários detalhados (Auth, AuthZ, Validação, CRUD, Falhas, Upload, Frontend, Perf, Sec) |
| `REVISAO-DE-CODIGO.md` | Code review multi-eixo (funciona, legível, seguro, performático, testável, consistente) |
| `ENTREGA.md` | Definition of Done (critérios, git, testes, build, docs, regressões, pendências) |
| `PUBLICACAO.md` | Deploy, rollback, monitoramento, smoke tests |
| `USO-DE-IA.md` | Responsável, ética, limitações, validação, supervisão humana |

### 3. Templates Reutilizáveis (templates/ - 12)
| Template | Uso |
|----------|-----|
| `AGENTS.md` | Instruções operacionais do projeto |
| `README.md` | Documentação do projeto |
| `ARQUITETURA.md` | Decisões arquiteturais |
| `DECISAO-TECNICA.md` | ADR (Architecture Decision Record) |
| `PLANO-IMPLEMENTACAO.md` | Plano de execução detalhado |
| `ESPECIFICACAO-FUNCIONAL.md` | Requisitos funcionais |
| `PLANO-TESTES.md` | Estratégia de testes |
| `AUDITORIA-SEGURANCA.md` | Relatório de auditoria seg |
| `REVISAO-CODIGO.md` | Relatório de code review |
| `RELATORIO-ENTREGA.md` | Relatório de entrega |
| `REGISTRO-INCIDENTE.md` | Registro de incidente |
| `DIVIDA-TECNICA.md` | Registro de dívida técnica |

### 4. Sistema de Memória (memoria/ - 6 arquivos)
| Arquivo | Conteúdo |
|---------|----------|
| `ESTADO-ATUAL.md` | Fase, última validação, próxima etapa, arquivos, testes, problemas, bloqueios, decisões, pendências |
| `PLANO-DE-EXECUCAO.md` | Status etapas: NÃO INICIADA/EM ANDAMENTO/CONCLUÍDA/BLOQUEADA/REQUER REVISÃO |
| `HISTORICO-DE-EXECUCAO.md` | Ação, comandos, resultados, falhas, correções |
| `DECISOES.md` | ID, data, decisão, contexto, alternativas, justificativa, consequências, estado |
| `PENDENCIAS.md` | ID, prioridade, impacto, dependências, critério resolução, próxima ação, estado |
| `PROXIMO-PASSO.md` | Instrução executável: onde retomar, arquivos, ação, dependências, validação, fallback |

### 5. Skills Operacionais (.opencode/skills/ - 15)
| Skill | Função | Quando Usar |
|-------|--------|-------------|
| `entrevista-orquestradora` | **CENTRAL** — Entende, planeja, seleciona, executa, verifica | **SEMPRE** (ponto de entrada único) |
| `planejamento-de-tarefas` | Analisa, divide, define critérios, identifica dependências | Nova feature, tarefa complexa, planejar |
| `analise-de-legado` | Inspeciona arquitetura, módulos, dependências, riscos — **sem modificar código** | Antes de refatorar, onboarding legado |
| `revisao-de-interface` | Auditoria visual, responsividade, a11y, estados, reuso | Nova UI, PR frontend, redesign, auditoria |
| `auditoria-de-seguranca` | Auth, AuthZ, validação, secrets, config, deps, matriz riscos | Pre-deploy, auth, dados sensíveis |
| `testes-com-roteiro` | Orquestra testes: unit, int, e2e, a11y, sec, perf | Validação, regressão, pre-deploy |
| `revisao-final` | Quality gate: critérios, git, testes, build, docs, regressões, pendências | Pre-merge, pre-release, entrega |
| `code-simplification` | Refatoração segura: micro-passos atômicos, testes a cada passo | Após análise, code review, prep extensão |
| `systematic-debugging` | Debug científico: observa → reproduz → isola → hipotetisa → testa → valida → documenta | Bug reportado, flaky test, performance |
| `spec-driven-development` | Spec-first: descobre → especifica → valida → implementa (TDD) | Nova feature, API, breaking change |
| `verification-before-completion` | Quality gate obrigatório: testes + build + lint + type-check + **evidência real** | **SEMPRE** antes de "pronto", PR, merge |
| `code-review-and-quality` | Code review 6 eixos: Funciona, Legível, Seguro, Performático, Testável, Consistente | PR, commit main, hotfix |
| `bible-rag-search` | Busca semântica no AGIM: trechos relevantes (~2KB vs 27KB) | IA consulta o grimório |
| `graphify-integration` | Grafo de código: queries naturais → subgrafo relevante (~2KB vs 200KB) | Projeto existente, análise, debug |
| `using-agent-skills` | Meta-skill: descobre e invoca skills | Início de sessão, decisão de skill |

### 6. Skills Globais Instaladas (7 - UI/UX/Design)
| Skill | Função |
|-------|--------|
| `ui-ux-pro-max` | Design intelligence: 79 estilos, 192 paletas, 74 fonts, 119 guidelines |
| `design` | Brand, logo, CIP, mockups, slides, banners, icons, social photos |
| `design-system` | Tokens 3-layer, CSS vars, scales, component specs, slides |
| `banner-design` | Banners multi-formato (22 styles, social/ads/web/print) |
| `brand` | Brand voice, visual identity, messaging, asset management |
| `slides` | HTML presentations Chart.js, tokens, responsive |
| `ui-styling` | shadcn/ui + Tailwind, componentes acessíveis, theming |

### 7. MCPs (Model Context Protocol) - 3
| MCP | Função | Configuração |
|-----|--------|--------------|
| `context7` | Docs técnicas oficiais por versão exata | `CONTEXT7_API_KEY` |
| `github` | Releases, tags, teams, issues, PRs, repos | `GITHUB_TOKEN` |
| `browser`/`playwright` | Automação navegador, screenshots, E2E | `browser.json` |

### 8. Exemplo de Referência (exemplos/)
Implementação funcional completa de "Usuários" com:
- Backend: routes, controllers, services, validators, repositories, Prisma schema
- Frontend: pages, hooks, services, types, components
- Arquitetura modular completa demonstrada

---

## Para Quem é o AGIM?

| Perfil | Benefício Principal |
|--------|---------------------|
| **Tech Leads / Arquitetos** | Padronização forçada, arquitetura consistente, ADRs automáticos |
| **Desenvolvedores Seniores** | Velocidade com qualidade, TDD real, refatoração segura |
| **Desenvolvedores Júnior/Pleno** | Guardrails que impedem erros comuns, onboarding acelerado |
| **Times de Segurança** | Auditoria automática, matriz 15 riscos, checklist executável |
| **QA / Test Engineers** | Roteiro 50+ cenários, pirâmide de testes, coverage thresholds |
| **Gerentes de Projeto** | Visibilidade real via `memoria/`, estimativas baseadas em skills |
| **Equipes Distribuídas** | Contexto compartilhado, continuidade sem reuniões de sync |

---

## Requisitos

| Requisito | Versão Mínima |
|-----------|---------------|
| **Node.js** | 18+ |
| **npm** | 9+ (vem com Node 18+) |
| **Git** | 2.30+ |
| **OpenCode** | v2 (harness) |
| **Sistema Operacional** | Windows 10+, macOS 12+, Linux (glibc 2.28+) |

### Opcionais (para recursos avançados)
| Recurso | Comando de Ativação |
|---------|---------------------|
| **RAG** (busca semântica) | `npm install -g @xenova/transformers && agim rag:rebuild` |
| **Graphify** (grafo de código) | `npm install -g graphify-cli && agim graph "pergunta"` |

---

## Instalação Rápida

```bash
# Global (recomendado)
npm install -g agim-orchestrator

# Ou execução única
npx agim-orchestrator init
```

> Requer **Node.js 18+**. Zero dependências obrigatórias.

---

## Primeiro Comando (Após Instalação)

```bash
cd meu-projeto
agim auto "Nova feature: API de usuários com CRUD, auth JWT e validação Zod"
```

Isso executa tudo: detecta stack → instala kit → sincroniza AGENTS.md → doctor → planeja → valida em paralelo → registra histórico.

---

## Próximos Passos

| Objetivo | Documento |
|----------|-----------|
| Entender benefícios e métricas | [WHY-AGIM.md](./WHY-AGIM.md) |
| Ver arquitetura e fluxo detalhado | [HOW-IT-WORKS.md](./HOW-IT-WORKS.md) |
| Referência completa de skills | [SKILLS-SYSTEM.md](./SKILLS-SYSTEM.md) |
| Começar agora (5 min) | [QUICKSTART.md](./QUICKSTART.md) |
| Referência de comandos CLI | [CLI-REFERENCE.md](./CLI-REFERENCE.md) |
| Configuração detalhada | [CONFIGURATION.md](./CONFIGURATION.md) |

---

## Links Úteis

- **npm**: [agim-orchestrator](https://www.npmjs.com/package/agim-orchestrator)
- **Issues**: [github.com/Brendontailor/AGIM/issues](https://github.com/Brendontailor/AGIM/issues)
- **Changelog**: [CHANGELOG.md](../../CHANGELOG.md)

---

> **AGIM: o grimório que executa o que ensina.**