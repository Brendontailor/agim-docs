# IA e Contexto - Estratégia Integrada

> Documentação da integração e diferença entre ferramentas de contexto, recuperação de informação e memória operacional.
> Baseada na Seção 9 da missão: "RAG, BANCO VETORIAL E GRAPHIFY".

---

## Visão Geral do Ecossistema de Contexto

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ECOSISTEMA DE CONTEXTO IA                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│  │  AGENTS.md   │    │   SKILLS     │    │  DOCS TÉCN.  │             │
│  │  (Instruções │    │  (Proced.    │    │  (Referência │             │
│  │   operacion.)│    │   especial.) │    │   estática)  │             │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘             │
│         │                   │                   │                      │
│         └───────────────────┼───────────────────┘                      │
│                             ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │              MEMÓRIA OPERACIONAL (memoria/)                   │     │
│  │  ESTADO-ATUAL • PLANO • HISTÓRICO • DECISÕES • PENDÊNCIAS     │     │
│  │  PROXIMO-PASSO                                                 │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                             │                                          │
│         ┌───────────────────┼───────────────────┐                    │
│         ▼                   ▼                   ▼                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐               │
│  │   GRAPHIFY  │    │  CONTEXT7   │    │   RAG/      │               │
│  │  (Estrutural)│    │  (Docs Libs)│    │  (Vetorial) │               │
│  │  graphify-  │    │  tools.     │    │  Embeddings │               │
│  │  out/       │    │  context7   │    │  + VectorDB │               │
│  └─────────────┘    └─────────────┘    └─────────────┘               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Diferenças e Papéis de Cada Componente

| Componente | Tipo | Escopo | Atualização | Uso Principal |
|------------|------|--------|-------------|---------------|
| **AGENTS.md** | Instruções fixas | Regras globais projeto | Manual (raro) | Protocolo início, regras execução, arquitetura, segurança |
| **Skills** | Procedimentos | Tasks específicas | Manual (versionado) | Planejar, analisar, revisar, auditar, testar, revisar final |
| **Docs Técnicas** | Referência estática | Padrões, decisões, guias | Manual (versionado) | Consulta profunda, onboarding, decisões arquiteturais |
| **Memória Operacional** | Estado dinâmico | Sessão/projeto atual | Automático (cada etapa) | Recuperação contexto, continuidade, auditoria |
| **Graphify** | Grafo código | Estrutura codebase | `graphify build` (manual) | Arquitetura, dependências, símbolos, call graphs |
| **Context7** | Docs externas | Bibliotecas/frameworks | Tempo real (API) | APIs, configs, exemplos por versão exata |
| **RAG/Vector DB** | Busca semântica | Docs + código projeto | Indexação incremental | Recuperação contextual, similaridade, Q&A |

---

## Memória Operacional (`memoria/`) - Fonte de Verdade

### Arquivos Obrigatórios

| Arquivo | Função | Frequência Atualização |
|---------|--------|------------------------|
| `ESTADO-ATUAL.md` | Fonte principal recuperação: objetivo, fase, última validação, próxima etapa, arquivos, testes, problemas, bloqueios, decisões, pendências, timestamp | Após **cada etapa significativa** |
| `PLANO-DE-EXECUCAO.md` | Fases, etapas, dependências, critérios, estados (NÃO INICIADA/EM ANDAMENTO/CONCLUÍDA/BLOQUEADA/REQUER REVISÃO) | Início + após cada etapa |
| `HISTORICO-DE-EXECUCAO.md` | Log ações: comandos, resultados, falhas, correções, evidências | Após cada ação relevante |
| `DECISOES.md` | Decisões técnicas: ID, data, decisão, contexto, alternativas, justificativa, consequências, estado | Quando decisão tomada |
| `PENDENCIAS.md` | Pendências: ID, prioridade, impacto, dependências, critério resolução, próxima ação, estado | Descoberta + resolução |
| `PROXIMO-PASSO.md` | Instrução curta executável: onde retomar, arquivos, ação, dependências, validação, fallback | **Sempre** (última coisa antes de parar) |

### Protocolo de Início de Sessão (OBRIGATÓRIO)

```markdown
1. Ler AGENTS.md aplicável
2. Ler memoria/ESTADO-ATUAL.md
3. Ler memoria/PROXIMO-PASSO.md
4. Consultar memoria/PLANO-DE-EXECUCAO.md
5. Consultar memoria/DECISOES.md e memoria/PENDENCIAS.md pertinentes
6. Inspecionar estado real: arquivos + Git status
7. Comparar documentado vs real → identificar divergências
8. Informar brevemente ponto de retomada
9. Continuar SEM repetir tarefas concluídas
```

### Protocolo Durante Execução

```markdown
APÓS CADA ETAPA SIGNIFICATIVA:
□ Atualizar memoria/ESTADO-ATUAL.md
□ Atualizar memoria/PLANO-DE-EXECUCAO.md
□ Registrar decisões em memoria/DECISOES.md
□ Registrar pendências em memoria/PENDENCIAS.md
□ Registrar evidências em memoria/HISTORICO-DE-EXECUCAO.md
□ Atualizar memoria/PROXIMO-PASSO.md
```

### Protocolo de Interrupção/Encerramento

```markdown
ANTES DE PARAR:
□ Salvar estado atual completo
□ Registrar último ponto validado
□ Identificar alterações não testadas
□ Registrar bloqueios
□ Atualizar próximo passo
□ Registrar ações não executadas
□ Preservar alterações existentes
□ NÃO declarar conclusão com critérios pendentes
```

---

## Graphify - Knowledge Graph Estrutural

### O que É
- Plugin OpenCode (`.opencode/plugins/graphify.js`)
- Gera `graphify-out/graph.json` + `GRAPH_REPORT.md`
- Auto-injeta reminder no primeiro `shell` se graph existe
- Queries: `graphify query "pergunta"` → subgrafo focado

### Quando Usar
- Entender arquitetura codebase novo/legado
- Encontrar dependências entre módulos/arquivos
- Buscar símbolos, referências, call graphs
- Perguntas amplas: "como funciona auth?", "onde UserService é usado?"

### Regras de Uso
```markdown
✅ FAZER:
- Rodar `graphify build` após mudanças estruturais significativas
- Usar `graphify query` para perguntas focadas (menor que GRAPH_REPORT.md)
- Ler GRAPH_REPORT.md apenas para contexto arquitetural amplo

❌ NÃO FAZER:
- Confiar cegamente no graph (pode estar desatualizado)
- Usar para busca textual (use grep/ripgrep)
- Esperar que indexe node_modules, builds, secrets
```

### Integração com Memória
- Referenciar `graphify-out/` em `ESTADO-ATUAL.md` se relevante
- Atualizar `PROXIMO-PASSO.md` com `graphify query` sugerido se aplicável
- Não duplicar info: Graphify = estrutura; Memória = estado execução

---

## Context7 - Documentação Técnica Externa

### O que É
- MCP Server (`@context7/mcp-server`)
- Docs oficiais atualizadas por versão exata
- Tools: `resolve-library-id` + `query-docs`

### Quando Usar (OBRIGATÓRIO)
```markdown
✅ USAR CONTEXT7 PARA:
- React, Vite, TypeScript - implementação
- Node.js, Express - backend
- Prisma, PostgreSQL - database
- Auth, JWT, sessões, libs segurança
- Vitest, Testing Library, Playwright - testes
- Bibliotecas novas/APIs pouco conhecidas
- Incompatibilidades versões
- Erros dependências
- MCPs/plugins/tools com docs que mudaram
```

### Fluxo Obrigatório
```markdown
1. Identificar biblioteca/ferramenta
2. Verificar versão instalada no projeto (package.json)
3. tools.context7["resolve-library-id"]({ libraryName })
4. tools.context7["query-docs"]({ libraryId, query, language })
5. Confirmar APIs/exemplos = versão real
6. Implementar conforme doc + arquitetura projeto
7. Executar testes/verificações
8. Registrar decisões/limitações em DECISOES.md
```

### Regras
```markdown
❌ NÃO USAR CONTEXT7 PARA:
- Operações simples já compreendidas
- Código próprio do projeto (use Graphify/RAG)
- Refatoração lógica negócio
- Decisões arquiteturais internas

⚠️ SE INDISPONÍVEL:
- Usar alternativas verificáveis (docs oficiais GitHub, npm docs)
- Registrar limitação em DECISOES.md
- Não assumir que funcionou
```

---

## RAG / Banco Vetorial - Recuperação Semântica

### Estratégia (Não Obrigatória)

> **O sistema DEVE continuar funcional SEM banco vetorial.**
> Infraestrutura RAG não é dependência obrigatória para tarefas simples.

### Opções Avaliadas

| Opção | Privacidade | Custo | Manutenção | Complexidade | Recomendação |
|-------|-------------|-------|------------|--------------|--------------|
| **Local (chromadb, LanceDB, SQLite-vec)** | ✅ Total | Baixo (infra própria) | Média | Média | ✅ Preferida |
| **Hospedado (Pinecone, Weaviate Cloud, Qdrant Cloud)** | ⚠️ Dados saem | Variável | Baixa | Baixa | Se escala > 100k docs |
| **Híbrido (Local + Cloud sync)** | Configurável | Médio | Alta | Alta | Avançado |

### O que Indexar (Regras)

```markdown
✅ INDEXAR:
- AGENTS.md, README.md, docs/*.md
- memoria/*.md (exceto dados sensíveis)
- Src code: *.ts, *.tsx, *.js, *.jsx (lógica negócio)
- Configs: *.json, *.yaml, *.toml (sem secrets)
- Templates, checklists, exemplos

❌ NÃO INDEXAR (excluir explicitamente):
- node_modules/, dist/, build/, .next/, coverage/
- .git/, *.log, *.tmp, cache/
- .env, .env.*, *.pem, *.key, secrets/
- Arquivos > 500KB (configurável)
- Dependências externas (docs em Context7)
```

### Recuperação

```markdown
REGRAS RECUPERAÇÃO:
- Top-K: 5-10 chunks relevantes (não dump completo)
- Threshold similaridade: ≥ 0.7 (cosine)
- Incluir metadados: file path, line numbers, last modified
- Priorizar: memoria/ > docs/ > src/ > templates/
- Filtrar por: projeto atual, fase atual, tags relevantes
```

### Atualização de Índices

```markdown
TRIGGERS ATUALIZAÇÃO:
- Novos arquivos em docs/, src/, memoria/
- Mudanças significativas em arquivos indexados (> 20% diff)
- `git commit` hook (opcional: pre-commit index changed)
- Manual: `rag index --incremental` ou `rag index --full`

VERIFICAÇÃO QUALIDADE:
- Sample queries semanais: precision@5, recall@10
- Latência p95 < 500ms
- Custo tokens/query < threshold definido
```

---

## Busca Textual vs Busca por Símbolos vs Busca Semântica

| Tipo | Ferramenta | Melhor Para | Limitações |
|------|------------|-------------|------------|
| **Textual** | `grep`/`rg`/`vscode search` | Strings exatas, logs, config keys | Sem理解 semântica; ruído |
| **Símbolos/Refs** | Graphify / LSP / `ctags` | Go-to-def, callers, type hierarchy | Só código tipado; não docs |
| **Semântica (RAG)** | Vector DB + embeddings | Conceitos, "como faz X", similaridade | Precisão variável; custo; latência |

### Regra de Ouro
```markdown
USE A FERRAMENTA CERTA PARA A PERGUNTA:

"Onde está a função X?"           → Graphify / LSP / grep
"Como configurar Prisma?"         → Context7 (versão exata)
"Qual padrão de error handling?"  → RAG (docs projeto) + AGENTS.md
"Onde UserService é chamado?"     → Graphify query
"Exemplo login com Vitest?"       → Context7 (Vitest) + ROTERIO-TESTES.md
"Por que decidimos Argon2id?"     → DECISOES.md (DEC-010)
```

---

## Índices de Arquivos e Resumos de Arquitetura

### Índice Automático (Opcional)
- Gerar `INDEX.md` ou resumo de arquitetura em `docs/` via script
- Incluir: módulos, responsabilidades, dependências, fluxos principais
- Atualizar em `git commit` hook ou manual

### Resumo de Arquitetura por Módulo
```markdown
# Exemplo: docs/architecture-modules.md

## backend/src/services/
- **Responsabilidade**: Regras de negócio (use cases)
- **Arquivos**: *.service.ts
- **Dependências**: repositories, other services, hash, events
- **Testes**: __tests__/ unitários (mocks)
- **Entrada**: DTOs validados por controllers
- **Saída**: Domain entities / Response DTOs
```

---

## Métricas e Monitoramento

| Métrica | Target | Ferramenta | Frequência |
|---------|--------|------------|------------|
| **Latência RAG query** | p95 < 500ms | Logs / APM | Contínuo |
| **Custo tokens/query** | < $0.01 | API billing | Diário |
| **Utilidade (feedback)** | > 80% útil | Thumbs up/down | Por query |
| **Cobertura indexação** | > 90% arquivos relevantes | Script audit | Semanal |
| **Freshness índice** | < 24h lag | Timestamp check | Diário |
| **Graphify freshness** | < 1 semana | `graphify-out/` mtime | Semanal |

---

## Integração Prática no Fluxo de Trabalho

### Cenário 1: Iniciar Nova Feature
```bash
# 1. Protocolo início (memoria/)
cat AGENTS.md
cat memoria/ESTADO-ATUAL.md
cat memoria/PROXIMO-PASSO.md

# 2. Entender arquitetura (Graphify)
graphify query "como funciona módulo usuários?"

# 3. Verificar libs (Context7)
tools.context7["resolve-library-id"]({libraryName: "zod"})
tools.context7["query-docs"]({libraryId: "zod/zod", query: "schema validation"})

# 4. Planejar (Skill local)
skill planejamento-de-tarefas

# 5. Executar seguindo AGENTS.md + ARQUITETURA.md + CODIGO-LIMPO.md
```

### Cenário 2: Debug Bug Produção
```bash
# 1. Histórico recente
cat memoria/HISTORICO-DE-EXECUCAO.md | tail -50

# 2. Estado atual
cat memoria/ESTADO-ATUAL.md

# 3. Código afetado (Graphify)
graphify query "error handler middleware"

# 4. Docs lib relevante (Context7)
tools.context7["query-docs"]({libraryId: "expressjs/express", query: "error handling middleware"})

# 5. Reproduzir + fixar + testar
skill testes-com-roteiro
```

### Cenário 3: Code Review
```bash
# 1. Diff Git
git diff main...feature/branch

# 2. Checklist revisão
cat checklists/REVISAO-DE-CODIGO.md

# 3. Arquitetura afetada
graphify query "modules changed in diff"

# 4. Padrões projeto
cat docs/CODIGO-LIMPO.md
cat docs/ARQUITETURA.md

# 5. Skill revisão
skill revisao-final
```

---

## Decisões de Design Registradas

| Decisão | Registro | Justificativa |
|---------|----------|---------------|
| Memória operacional = Markdown files | `DECISOES.md` (DEC-008) | Offline, versionável, legível, zero deps |
| Graphify para estrutura, não busca textual | `FERRAMENTAS-IA.md` | Especializado em símbolos/refs |
| Context7 obrigatório para libs externas | `DECISOES.md` (DEC-004) | Versão exata, evita APIs obsoletas |
| RAG opcional, não bloqueante | Seção 9 missão | Sistema funciona sem vetorial |
| Excluir node_modules/secrets do RAG | Seção 9 missão | Privacidade, performance, relevância |
| Memória = fonte verdade, não conversa | Seção 10 missão | Recuperação sem histórico chat |

---

## Checklist de Validação Contínua

```markdown
### Semanal
□ Graphify rebuild necessário? (mudanças estruturais)
□ Índices RAG fresh? (lag < 24h)
□ Context7 API key válida?
□ Memoria/ arquivos sincronizados com realidade?

### Por Feature
□ PROXIMO-PASSO.md aponta ação correta?
□ ESTADO-ATUAL.md reflete fase real?
□ DECISOES.md registra novas decisões?
□ PENDENCIAS.md limpo (resolvidas movidas)?

### Mensal
□ Auditoria RAG: precision@5, recall@10
□ Custo tokens Context7/RAG dentro budget?
□ Skills globais atualizadas?
□ Docs técnicas refletem código real?
```

---

## Referências Cruzadas

- `AGENTS.md` - Seção 1 (Protocolo Início), Seção 5 (Ferramentas), Seção 6 (Context7), Seção 10 (Continuidade)
- `docs/FERRAMENTAS-IA.md` - Inventário detalhado cada ferramenta
- `docs/ARQUITETURA.md` - Memória operacional na arquitetura
- `docs/BOOTSTRAP-AMBIENTE.md` - Configuração MCPs
- `memoria/` - 6 arquivos estado persistente
- `.opencode/plugins/graphify.js` - Plugin knowledge graph
- `tools.context7` - MCP Context7