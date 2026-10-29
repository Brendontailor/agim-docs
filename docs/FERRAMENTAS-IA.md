# Inventário de Ferramentas de IA

> Catálogo completo das ferramentas de IA instaladas, configuradas e disponíveis no ambiente OpenCode.
> Baseado na inspeção real do ambiente (Fase 1) e decisões registradas.
> Organizado em 3 categorias: A) Contexto e Planejamento, B) Implementação e Ferramentas Especializadas, C) Testes, Auditoria e Validação.

---

## Resumo Executivo

| Categoria | Ferramentas | Status |
|-----------|-------------|--------|
| **A. Contexto e Planejamento** | Context7, Graphify, 4 Skills planejamento | ✅ Disponíveis |
| **B. Implementação e Especializadas** | 7 Skills Globais UI/UX, Context7 | ✅ Disponíveis |
| **C. Testes, Auditoria, Validação** | 6 Skills Locais, 3 MCPs, Security/Testing Skills | ✅ Disponíveis |

**Versão OpenCode**: v2.1.4  
**Data da Inspeção**: 2026-10-27  
**Ambiente**: Windows PowerShell, `C:\Users\Treinamento\.opencode\`

---

## A. CONTEXTO E PLANEJAMENTO

### A.1 Context7 (MCP) - Documentação Técnica Atualizada

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | Context7 MCP Server (`@context7/mcp-server`) |
| **Função** | Consultar documentação oficial atualizada de bibliotecas/frameworks por versão exata. Evita APIs obsoletas, métodos inexistentes, exemplos incompatíveis. |
| **Localização/Config** | `~/.config/opencode/mcp/context7.json` • Requer `CONTEXT7_API_KEY` no ambiente |
| **Como Acionar** | `tools.context7["resolve-library-id"]({ libraryName })` → `tools.context7["query-docs"]({ libraryId, query, language })` |
| **Quando Utilizar** | • Implementar React/Vite/TypeScript<br>• Configurar Node.js/Express/Prisma/PostgreSQL<br>• Autenticação, JWT, bibliotecas segurança<br>• Testes Vitest/Testing Library/Playwright<br>• Resolver incompatibilidades versões<br>• Investigar erros dependências<br>• Configurar MCPs/plugins com docs que mudaram |
| **Como Validar** | `tools.context7["resolve-library-id"]({ libraryName: "react" })` → retorna libraryId válido; `query-docs` retorna exemplos com versão correta |
| **Dependências** | MCP context7 configurado; API key válida; conexão internet |
| **Sobreposições** | Web search genérico (menos preciso); docs locais estáticas (desatualizadas); conhecimento treinamento (pode ser antigo) |
| **Limitações** | • Requer internet e API key<br>• Latência rede (~500ms-2s)<br>• Custo tokens por query<br>• Não acessa código privado/projeto |
| **Custos Operacionais** | API calls pagas (ver plano Context7); tokens de contexto para processar resposta |
| **Alternativas** | `websearch` para queries gerais; docs oficiais no GitHub; `npm docs <pkg>`; source code no `node_modules` |

---

### A.2 Graphify (Plugin OpenCode) - Knowledge Graph

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | Graphify OpenCode Plugin (`graphify.js` em `.opencode/plugins/`) |
| **Função** | Gera knowledge graph do codebase (`graphify-out/graph.json`). Fornece auto-reminder no primeiro shell command se graph existe. Permite queries focadas (`graphify query`) ao invés de grep raw. |
| **Localização/Config** | plugin opcional (nao instalado neste repo; usar a skill graphify via CLI) • Gera `graphify-out/` na raiz do projeto analisado |
| **Como Acionar** | Automático: hook `execute.before` injeta reminder se `graphify-out/graph.json` existe<br>Manual: `graphify query "sua pergunta"` • `graphify build` para gerar/atualizar |
| **Quando Utilizar** | • Entender arquitetura codebase novo/legado<br>• Encontrar dependências entre arquivos/módulos<br>• Buscar símbolos, referências, call graphs<br>• Perguntas amplas: "como funciona auth?"<br>• Substituir grep/ripgrep para queries estruturais |
| **Como Validar** | `ls graphify-out/graph.json` existe → próximo `shell` mostra reminder `[graphify] knowledge graph at graphify-out/. For focused questions, run graphify query...` |
| **Dependências** | Projeto com código fonte; `graphify build` executado pelo menos uma vez |
| **Sobreposições** | RAG/Vector DB (busca semântica vs estrutural); `grep`/`ripgrep` (textual); LSP (go-to-definition) |
| **Limitações** | • Só funciona se `graphify-out/` existe no projeto<br>• Precisa rebuild após mudanças significativas<br>• Não indexa node_modules, builds, secrets (configurável)<br>• Não substitui leitura de arquivos para detalhes |
| **Custos Operacionais** | Zero custo externo; CPU/disco local para build; roda no ambiente OpenCode |
| **Alternativas** | `grep`/`rg` para busca textual; `ctags`/`lsif` para símbolos; IDE go-to-definition; Sourcegraph (cloud) |

---

### A.3 Skill: planejamento-de-tarefas (Local)

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `planejamento-de-tarefas` (em `.opencode/skills/planejamento-de-tarefas/`) |
| **Função** | Analisa solicitação, consulta estado persistente (`memoria/`), identifica dependências, divide trabalho em etapas, define critérios de aceitação. |
| **Localização/Config** | `.opencode/skills/planejamento-de-tarefas/SKILL.md` |
| **Como Acionar** | `skill planejamento-de-tarefas` no OpenCode |
| **Quando Utilizar** | • Nova feature/complex task<br>• Início de sprint/planejamento<br>• Task com múltiplas dependências<br>• Necessidade de critérios claros de aceite |
| **Como Validar** | Skill carrega sem erro; produz plano com fases, etapas, dependências, critérios; salva em `memoria/PLANO-DE-EXECUCAO.md` |
| **Dependências** | `memoria/ESTADO-ATUAL.md`, `memoria/PENDENCIAS.md`, `memoria/DECISOES.md` existentes |
| **Sobreposições** | `planning-and-task-breakdown`, `writing-plans`, `spec-driven-development` (skills globais similares) |
| **Limitações** | • Não executa implementação<br>• Requer estado persistente válido<br>• Não substitui decisões de negócio |
| **Custos Operacionais** | Tokens para análise e geração do plano |
| **Alternativas** | Planejamento manual; `writing-plans` skill global |

---

### A.4 Skills Globais de Planejamento (Disponíveis)

| Skill | Função Principal | Quando Usar |
|-------|-----------------|-------------|
| `planning-and-task-breakdown` | Quebra trabalho em tarefas ordenadas | Spec/claro → tarefas implementáveis |
| `writing-plans` | Cria planos de implementação detalhados | Multi-step tasks, estimativa scope |
| `spec-driven-development` | Cria specs antes de codificar | Novo projeto/feature, requisitos unclear |
| `idea-refine` | Refina ideias brutas em conceitos acionáveis | Ideia vaga, stress-test assumptions |

---

## B. IMPLEMENTAÇÃO E FERRAMENTAS ESPECIALIZADAS

### B.1 ui-ux-pro-max (Skill Global) - Inteligência UI/UX

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `ui-ux-pro-max` |
| **Função** | UI/UX design intelligence: 79 estilos (50 ativos), 192 paletas produtos + reasoning, 74 font pairings, 119 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, 22 stacks. Para web, mobile, desktop. |
| **Localização/Config** | `.opencode/skills/ui-ux-pro-max/` (instalada globalmente) |
| **Como Acionar** | `skill ui-ux-pro-max` |
| **Quando Utilizar** | • Design/building/reviewing/fixing interfaces<br>• Pages, components, design systems, accessibility<br>• Interaction, responsive layout, typography, color<br>• Charts, stack-specific UI implementation<br>• Precisa de design intelligence, não apenas código |
| **Como Validar** | Skill carrega; acessa dados locais (estilos, paletas, guidelines, icons, presets) |
| **Dependências** | Nenhuma (dados locais embutidos) |
| **Sobreposições** | `frontend-ui-engineering` (implementação), `design` (abrangente), `ui-styling` (shadcn/Tailwind) |
| **Limitações** | • Não gera código diretamente (design intelligence)<br>• Dados locais podem desatualizar vs web<br>• Não substitui user research real |
| **Custos Operacionais** | Tokens para processar guidelines + contexto |
| **Alternativas** | `design` skill (mais abrangente); `ui-styling` (implementação shadcn); designers humanos |

---

### B.2 design (Skill Global) - Design Abrangente

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `design` |
| **Função** | Comprehensive design: brand identity, design tokens, UI styling, logo generation (55 styles, Gemini AI), corporate identity program (50 deliverables, CIP mockups), HTML presentations (Chart.js), banner design (22 styles, social/ads/web/print), icon design (15 styles, SVG, Gemini 3.1 Pro), social photos (HTML→screenshot, multi-platform). |
| **Localização/Config** | `.opencode/skills/design/` |
| **Como Acionar** | `skill design` + ação: `design logo`, `create CIP`, `generate mockups`, `build slides`, `design banner`, `generate icon`, `create social photos` |
| **Quando Utilizar** | • Brand identity completa<br>• Logo, CIP, mockups, slides, banners, ícones<br>• Social media images multi-plataforma<br>• Design system tokens |
| **Como Validar** | Gera assets esperados (SVG, PNG, HTML, MD) nos paths corretos |
| **Dependências** | `ui-ux-pro-max`, `frontend-design`, `ai-artist`, `ai-multimodal` (sub-skills) |
| **Sobreposições** | `banner-design`, `design-system`, `slides`, `ui-styling`, `brand` |
| **Limitações** | • Requer sub-skills instaladas<br>• AI generation (Gemini) precisa API keys<br>• Não é ferramenta de código |
| **Custos Operacionais** | Gemini API calls (custo por geração); tokens processamento |
| **Alternativas** | Ferramentas design dedicadas (Figma, Canva); skills individuais |

---

### B.3 design-system (Skill Global) - Tokens e Componentes

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `design-system` |
| **Função** | Token architecture (3-layer: primitive→semantic→component), CSS variables, spacing/typography scales, component specs, strategic slide creation. |
| **Localização/Config** | `.opencode/skills/design-system/` |
| **Como Acionar** | `skill design-system` |
| **Quando Utilizar** | • Criar/manter design system<br>• Tokens, CSS variables, scales<br>• Component specifications<br>• Apresentações estratégicas brand-compliant |
| **Como Validar** | Gera tokens CSS, component specs, slides |
| **Dependências** | Nenhuma direta |
| **Sobreposições** | `design` (tokens), `ui-styling` (componentes shadcn) |
| **Limitações** | • Foco em especificação, não implementação React<br>• Requer handoff para devs |
| **Custos Operacionais** | Tokens processamento |
| **Alternativas** | Storybook, Figma tokens, Style Dictionary |

---

### B.4 banner-design (Skill Global) - Banners Multi-formato

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `banner-design` |
| **Função** | Design banners social media, ads, website heroes, creative assets, print. Múltiplas art directions com AI-generated visuals. 22 styles. Platforms: Facebook, Twitter/X, LinkedIn, YouTube, Instagram, Google Display, website hero, print. |
| **Localização/Config** | skill global `banner-design` (arquivo references/banner-sizes-and-styles.md dentro da skill) |
| **Como Acionar** | `skill banner-design [platform] [style] [dimensions]` |
| **Quando Utilizar** | • Social covers, ad banners, website heroes<br>• Event/print banners<br>• Creative assets campanhas |
| **Como Validar** | Gera HTML/CSS banners + exporta PNG via chrome-devtools |
| **Dependências** | `ui-ux-pro-max`, `frontend-design`, `ai-artist`, `ai-multimodal`, `chrome-devtools` |
| **Sobreposições** | `design` (inclui banner design) |
| **Limitações** | • Requer Python + Gemini API<br>• Pipeline complexo (HTML → AI img → screenshot)<br>• Não faz video editing |
| **Custos Operacionais** | Gemini API (Flash/Pro models); Python runtime; tokens |
| **Alternativas** | Canva, Figma, Adobe Express, designers humanos |

---

### B.5 brand (Skill Global) - Identidade Visual

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `brand` |
| **Função** | Brand voice, visual identity, messaging frameworks, asset management, brand consistency. Para branded content, tone of voice, marketing assets, brand compliance, style guides. |
| **Localização/Config** | `.opencode/skills/brand/` |
| **Como Acionar** | `skill brand` |
| **Quando Utilizar** | • Definir/validar brand guidelines<br>• Marketing assets compliance<br>• Tone of voice, messaging<br>• Asset management |
| **Como Validar** | Produz brand guidelines, compliance reports |
| **Dependências** | Nenhuma direta |
| **Sobreposições** | `design` (CIP), `design-system` (tokens) |
| **Limitações** | • Foco estratégico, não execução visual<br>• Requer input de stakeholders |
| **Custos Operacionais** | Tokens processamento |
| **Alternativas** | Brand guidelines docs, Figma brand kit |

---

### B.6 slides (Skill Global) - Apresentações HTML

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `slides` |
| **Função** | Strategic HTML presentations com Chart.js, design tokens, responsive layouts, copywriting formulas, contextual slide strategies. |
| **Localização/Config** | `.opencode/skills/slides/` |
| **Como Acionar** | `skill slides` |
| **Quando Utilizar** | • Apresentações técnicas/executivas<br>• Charts/dados visualizados<br>• Responsive, brand-compliant |
| **Como Validar** | Gera HTML presentation funcional |
| **Dependências** | Chart.js, design tokens |
| **Sobreposições** | `design` (inclui slides), `design-system` (slides estratégicos) |
| **Limitações** | • HTML-based, não PowerPoint/Keynote nativo<br>• Requer browser para apresentar |
| **Custos Operacionais** | Tokens + Chart.js runtime |
| **Alternativas** | PowerPoint, Google Slides, Canva, Reveal.js |

---

### B.7 ui-styling (Skill Global) - shadcn/ui + Tailwind

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `ui-styling` |
| **Função** | Beautiful, accessible UIs com shadcn/ui (Radix UI + Tailwind), Tailwind CSS utility-first, canvas-based visual designs. Components: dialogs, dropdowns, forms, tables. Theming, dark mode, visual designs/posters. |
| **Localização/Config** | `.opencode/skills/ui-styling/` |
| **Como Acionar** | `skill ui-styling` |
| **Quando Utilizar** | • Building UIs, implementing design systems<br>• Responsive layouts, accessible components<br>• Customizing themes/colors, dark mode<br>• Visual designs, posters, consistent styling |
| **Como Validar** | Gera componentes shadcn/ui funcionais, Tailwind config |
| **Dependências** | Tailwind CSS, Radix UI, shadcn/ui CLI |
| **Sobreposições** | `frontend-ui-engineering`, `ui-ux-pro-max`, `design-system` |
| **Limitações** | • Específico para React + Tailwind + shadcn<br>• Não funciona com outros frameworks CSS |
| **Custos Operacionais** | Tokens; dependências npm para projeto alvo |
| **Alternativas** | Radix UI direto, Headless UI, MUI, Chakra UI |

---

### B.8 Context7 (MCP) - Para Implementação

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | Context7 (mesmo da seção A.1) |
| **Função** | Docs técnicas durante implementação: APIs, configurações, exemplos por versão |
| **Quando Utilizar** | • Implementando com React, Vite, TypeScript<br>• Node.js, Express, Prisma, PostgreSQL<br>• Auth, JWT, sessões, libs segurança<br>• Testes Vitest, Testing Library, Playwright<br>• Configurando MCPs, plugins, tools |

---

## C. TESTES, AUDITORIA E VALIDAÇÃO

### C.1 auditoria-de-seguranca (Skill Local)

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `auditoria-de-seguranca` (em `.opencode/skills/auditoria-de-seguranca/`) |
| **Função** | Examina autenticação, autorização, validações, exposição de segredos, configuração, dependências e riscos relevantes. |
| **Localização/Config** | `.opencode/skills/auditoria-de-seguranca/SKILL.md` |
| **Como Acionar** | `skill auditoria-de-seguranca` |
| **Quando Utilizar** | • Pré-deploy / release<br>• Implementação auth/dados sensíveis<br>• Code review segurança<br>• Auditoria periódica |
| **Como Validar** | Produz relatório com matriz riscos, achados, recomendações; usa `checklists/SEGURANCA.md` |
| **Dependências** | `docs/SEGURANCA.md`, `checklists/SEGURANCA.md`, `security-and-hardening` skill |
| **Sobreposições** | `security-and-hardening` (skill global), `code-review-and-quality` |
| **Limitações** | • Não executa pentest/DAST real<br>• Baseado em código estático e config<br>• Requer conhecimento domínio para falsos positivos |
| **Custos Operacionais** | Tokens para análise código + checklists |
| **Alternativas** | SAST tools (Semgrep, CodeQL), Snyk, pentest manual |

---

### C.2 testes-com-roteiro (Skill Local)

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `testes-com-roteiro` (em `.opencode/skills/testes-com-roteiro/`) |
| **Função** | Cria cenários reproduzíveis, define pré-condições, executa testes, registra evidências, diferencia resultados: aprovado, reprovado, bloqueado, não executado. |
| **Localização/Config** | `.opencode/skills/testes-com-roteiro/SKILL.md` |
| **Como Acionar** | `skill testes-com-roteiro` |
| **Quando Utilizar** | • Nova funcionalidade<br>• Bug fix (regression test)<br>• Validação pré-deploy<br>• Testes segurança/auth |
| **Como Validar** | Executa roteiro (`checklists/ROTEIRO-DE-TESTES.md`); registra evidências; status por cenário |
| **Dependências** | `docs/TESTES.md`, `checklists/TESTES.md`, `checklists/ROTEIRO-DE-TESTES.md`, `test-driven-development` |
| **Sobreposições** | `test-driven-development`, `browser-testing-with-devtools`, `playwright-mcp-workflows` |
| **Limitações** | • Não substitui execução real de testes<br>• Orquestra, não roda Vitest/Playwright diretamente<br>• Requer testes implementados |
| **Custos Operacionais** | Tokens planejamento + execução assistida |
| **Alternativas** | Vitest/Playwright direto; CI/CD pipelines |

---

### C.3 revisao-de-interface (Skill Local)

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `revisao-de-interface` (em `.opencode/skills/revisao-de-interface/`) |
| **Função** | Avalia consistência visual, responsividade, acessibilidade, estados de interface e reutilização de componentes. |
| **Localização/Config** | `.opencode/skills/revisao-de-interface/SKILL.md` |
| **Como Acionar** | `skill revisao-de-interface` |
| **Quando Utilizar** | • Nova UI / redesign<br>• PR frontend<br>• Validação design system<br>• Acessibilidade audit |
| **Como Validar** | Report: consistência, responsividade breakpoints, WCAG violations, component reuse score |
| **Dependências** | `ui-ux-pro-max`, `ui-styling`, `checklists/REVISAO-DE-CODIGO.md` (seção UI) |
| **Sobreposições** | `ui-ux-pro-max` (design intelligence), `browser-testing-with-devtools` |
| **Limitações** | • Visual review limitado sem browser real<br>• Não substitui user testing<br>• Acessibilidade: usa axe-core via Playwright |
| **Custos Operacionais** | Tokens análise + Playwright screenshots se necessário |
| **Alternativas** | Storybook visual tests, Chromatic, Percy, manual QA |

---

### C.4 revisao-final (Skill Local)

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `revisao-final` (em `.opencode/skills/revisao-final/`) |
| **Função** | Confere critérios de aceitação, alterações no Git, testes, build, documentação, regressões e pendências. |
| **Localização/Config** | `.opencode/skills/revisao-final/SKILL.md` |
| **Como Acionar** | `skill revisao-final` |
| **Quando Utilizar** | • Pré-merge / PR review<br>• Pré-release<br>• Validação definition of done |
| **Como Validar** | Checklist completa: critérios aceite, Git diff, testes pass, build pass, docs updated, no regressions, pendências resolvidas |
| **Dependências** | `checklists/REVISAO-DE-CODIGO.md`, `checklists/ENTREGA.md`, `git`, `npm run validate` |
| **Sobreposições** | `code-review-and-quality`, `receiving-code-review`, `requesting-code-review` |
| **Limitações** | • Não aprova automaticamente<br>• Requer evidências reais (não confia em declarações) |
| **Custos Operacionais** | Tokens revisão + comandos validação |
| **Alternativas** | Code review manual, GitHub PR checks, CI gates |

---

### C.5 analise-de-legado (Skill Local)

| Campo | Valor |
|-------|-------|
| **Nome Oficial** | `analise-de-legado` (em `.opencode/skills/analise-de-legado/`) |
| **Função** | Inspeciona arquitetura, módulos, dependências e riscos antes de refatorações. Preserva funcionalidades e não modifica código quando solicitação for somente análise. |
| **Localização/Config** | `.opencode/skills/analise-de-legado/SKILL.md` |
| **Como Acionar** | `skill analise-de-legado` |
| **Quando Utilizar** | • Antes de refatorar código legado<br>• Entender codebase desconhecido<br>• Avaliar riscos migração<br>• Documentar arquitetura atual |
| **Como Validar** | Relatório: módulos, dependências, acoplamento, debt técnico, riscos, recomendações |
| **Dependências** | `graphify` (se disponível), `code-simplification`, `deprecation-and-migration` |
| **Sobreposições** | `graphify` (estrutura), `reverse-engineer-anything` (mais profundo) |
| **Limitações** | • Não modifica código (modo análise)<br>• Limitado a código fonte acessível |
| **Custos Operacionais** | Tokens inspeção + análise |
| **Alternativas** | Manual code review, architecture decision records |

---

### C.6 Skills Globais de Segurança e Qualidade

| Skill | Função | Quando Usar |
|-------|--------|-------------|
| `security-and-hardening` | Harden código contra vulnerabilidades (OWASP Top 10) | Auth, input handling, data storage, external integrations |
| `code-review-and-quality` | Multi-axis code review (security, perf, maintainability, etc.) | Antes de merge, reviewing own/other code |
| `receiving-code-review` | Processar feedback de code review rigorosamente | Quando receber review, antes de implementar sugestões |
| `requesting-code-review` | Solicitar review com contexto adequado | Completar tasks, major features, pre-merge |

---

### C.7 Skills Globais de Testes

| Skill | Função | Quando Usar |
|-------|--------|-------------|
| `test-driven-development` | Red-green-refactor loop para lógica, bugs, behavior changes | Implementing logic, fixing bugs, changing behavior |
| `browser-testing-with-devtools` | Chrome DevTools MCP: DOM, console, network, performance | Building/debugging browser apps |
| `playwright-mcp-workflows` | Playwright MCP: E2E, UI validation, browser automation | E2E tests, screenshots, visual regression |

---

### C.8 MCPs de Testes e Operações

#### github (MCP)
| Campo | Valor |
|-------|-------|
| **Nome Oficial** | GitHub MCP Server (`@modelcontextprotocol/server-github`) |
| **Função** | Operações GitHub: releases, tags, teams, issues, PRs, repos |
| **Localização/Config** | `~/.config/opencode/mcp/github.json` • Requer `GITHUB_PERSONAL_ACCESS_TOKEN` |
| **Como Acionar** | `tools.github.*` (get_me, get_latest_release, list_tags, search_*, etc.) |
| **Quando Utilizar** | • Release management<br>• Issue/PR automation<br>• Team/org management<br>• Version tagging |
| **Como Validar** | `tools.github.get_me()` retorna user autenticado |
| **Limitações** | • Permissões token limitam ações<br>• Rate limits GitHub API |
| **Custos** | Gratuito (GitHub API) |

#### browser / playwright (MCP)
| Campo | Valor |
|-------|-------|
| **Nome Oficial** | Browser MCP / Playwright MCP |
| **Função** | Browser automation: navigate, click, screenshot, evaluate, network capture |
| **Localização/Config** | `~/.config/opencode/mcp/browser.json` ou `playwright.json` |
| **Como Acionar** | `tools.mcp.browser_navigate`, `browser_screenshot`, `browser_evaluate`, etc. |
| **Quando Utilizar** | • E2E testing<br>• Visual regression<br>• Debugging browser issues<br>• Screenshots para docs |
| **Como Validar** | `browser_navigate` + `browser_screenshot` funcionam |
| **Limitações** | • Headless browser overhead<br>• Flakiness inerente a E2E |
| **Custos** | CPU/memória local; tempo execução |

---

## Matriz de Uso Recomendado

| Situação | Ferramenta Principal | Suporte |
|----------|---------------------|---------|
| **Novo projeto/feature** | `brainstorming` → `planning-and-task-breakdown` → `spec-driven-development` | `ui-ux-pro-max` para design |
| **Bug/comportamento inesperado** | `systematic-debugging` / `debugging-and-error-recovery` | `browser-testing-with-devtools` |
| **Refatoração/legado** | `analise-de-legado` + `code-simplification` | `graphify` para estrutura |
| **Revisão PR/código** | `code-review-and-quality` | `receiving-code-review` |
| **Segurança/auth** | `auditoria-de-seguranca` + `security-and-hardening` | `checklists/SEGURANCA.md` |
| **Testes** | `testes-com-roteiro` + `test-driven-development` | `playwright-mcp-workflows` para E2E |
| **Planejamento complexo** | `planning-and-task-breakdown` / `writing-plans` | `planejamento-de-tarefas` (local) |
| **Decisão arquitetural** | `api-and-interface-design` + `spec-driven-development` | `graphify` + `documentation-and-adrs` |
| **Documentação/ADR** | `documentation-and-adrs` | `DECISOES-TECNICAS.md` template |
| **Biblioteca/API externa** | `context7` (MCP) | `tools.context7` |
| **Estrutura código/projeto** | `graphify` (plugin) | `graphify query` |
| **CI/CD** | `ci-cd-and-automation` | GitHub Actions, pipelines |
| **Performance** | `performance-optimization` | Lighthouse, k6, bundle analyzer |

---

## Regras de Uso

1. **Use apenas skills pertinentes** - Não execute todas skills em toda solicitação
2. **Consulte inspeção real** - Não presuma ferramentas; verifique `.opencode/skills/`, `.opencode/plugins/`, MCPs configurados
3. **Preserve configuração global** - Não sobrescreva configs existentes sem necessidade
4. **Documente limitações** - Se tool indisponível, registre e use alternativa
5. **Valide antes de confiar** - Teste skill/MCP antes de usar em tarefa crítica

---

## Referências Cruzadas

- `AGENTS.md` - Seção 5 (Ferramentas e Skills), Seção 6 (Context7)
- `docs/BOOTSTRAP-AMBIENTE.md` - Ordem instalação/verificação
- `docs/IA-E-CONTEXTO.md` - Estratégia RAG/Graphify/Context7 integrada
- `memoria/DECISOES.md` - DEC-004, DEC-007, DEC-008
- `.opencode/skills/` - Skills globais instaladas
- `.opencode/plugins/graphify.js` - Plugin local