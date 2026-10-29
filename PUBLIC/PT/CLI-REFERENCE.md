# Referência CLI — AGIM

> Todos os 14 comandos com exemplos e opções.

---

## Tabela Rápida

| Comando | Descrição | Uso Principal |
|---------|-----------|---------------|
| `agim auto ["objetivo"]` | Fluxo automático completo | Desenvolvimento diário |
| `agim init` | Instala kit, config, AGENTS.md, memoria/ | Setup inicial |
| `agim validate` | Valida projeto ou repo AGIM | Quality gate, CI |
| `agim doctor` | Diagnóstico: crítico / aviso / opcional | Health check |
| `agim status` | Mostra `memoria/ESTADO-ATUAL.md` | Checkpoint rápido |
| `agim interview "objetivo"` | Classifica, seleciona skills, grava plano | Planejamento explícito |
| `agim sync` | Atualiza bloco gerenciado do AGENTS.md | Após edição manual |
| `agim audit` | Auditoria estática de padrões inseguros | Pre-deploy, segurança |
| `agim config:validate` | Valida `.agim/config.json` | Validação de config |
| `agim core:link` | Recria link `.agim/core` | Link quebrado |
| `agim rag:rebuild` | Reconstrói índice RAG | Busca semântica |
| `agim graph "pergunta"` | Consulta grafo via Graphify | Análise de código |
| `agim --version` | Mostra versão | Verificação |
| `agim --help` | Ajuda geral | Referência rápida |

---

## Opções Globais (Todos os Comandos)

| Opção | Descrição |
|-------|-----------|
| `--cwd <dir>` | Diretório de trabalho (padrão: cwd atual) |
| `--json` | Saída estruturada JSON (para automação) |
| `--help` | Ajuda específica do comando |

---

## Detalhamento por Comando

### `agim auto ["objetivo"]`

**Fluxo automático completo** — Recomendado para desenvolvimento diário.

```bash
# Com objetivo (executa tudo)
agim auto "Nova feature: API de usuários com CRUD, auth JWT e validação Zod"

# Sem objetivo (retoma do último ponto)
agim auto

# Com diretório específico
agim auto "Bug fix: login falha" --cwd /path/to/project

# Saída JSON para automação
agim auto "Feature" --json
```

**Executa em sequência**:
1. Detecta stack → instala/repara kit
2. `agim sync` — Sincroniza AGENTS.md
3. `agim doctor` — Diagnóstico completo
4. `agim interview` — Classifica + planeja
5. `agim validate` — Quality gate paralelo (testes, build, lint, type-check, audit)
6. Registra tudo em `memoria/`

**Exit codes**: `0` = sucesso, `1` = falha em qualquer etapa

---

### `agim init`

**Instala kit AGIM completo** no projeto atual.

```bash
# Projeto novo ou existente
agim init

# Força reinstalação (sobrescreve config, mantém AGENTS.md usuário)
agim init --force

# Saída JSON
agim init --json
```

**Cria/Atualiza**:
- `.agim/config.json` (configuração com defaults)
- `.agim/core → ~/.agent-bible` (symlink kit global)
- `AGENTS.md` (bloco gerenciado + preserva notas do usuário)
- `memoria/` (6 arquivos vazios/estruturados)
- `docs/`, `checklists/`, `templates/`, `exemplos/`
- `.opencode/skills/` (15 skills)
- `.gitignore` adiciona `*.agim-backup-*`

**Nota**: `--force` **não descarta** o `AGENTS.md` do usuário — o bloco gerenciado é adicionado no topo e conteúdo existente preservado.

---

### `agim validate`

**Valida projeto ou repositório AGIM**.

```bash
# Auto-detecta contexto (projeto vs repo AGIM)
agim validate

# Força validação de projeto
agim validate --project

# Força validação do repo AGIM
agim validate --repo

# Saída JSON
agim validate --json
```

**Validações Projeto**:
- Estrutura diretórios obrigatória
- `.agim/config.json` existe e válido (Zod)
- `AGENTS.md` sincronizado com config
- `memoria/` existe com 6 arquivos
- Skills instaladas (kit completo — 15 skills)
- Nenhum segredo em arquivos rastreados
- Sintaxe Markdown válida
- Links internos funcionando

**Validações Repo AGIM**:
- Package.json nome/versão corretos
- Todos comandos empacotados (`scripts/` no `files`)
- Skills completas (15)
- Documentação íntegra

**Exit codes**: `0` = tudo passa, `1` = falha crítica

---

### `agim doctor`

**Diagnóstico completo** do ambiente e projeto.

```bash
agim doctor
agim doctor --json
```

**Categorias**:

| Categoria | Exemplos |
|-----------|----------|
| **Críticos** | Node < 18, Git não inicializado, config inválida, skills faltando |
| **Avisos** | Dependências desatualizadas, RAG index ausente, coverage baixo |
| **Opcionais** | MCPs não configurados, Graphify não instalado, skills globais UI/UX |

**Verificações Específicas**:
- Versão Node.js ≥ 18
- Repositório Git válido
- `.agim/config.json` parseável + válida
- `AGENTS.md` sincronizado
- `memoria/` 6 arquivos presentes
- 15 skills em `.opencode/skills/`
- 7 skills globais UI/UX disponíveis
- Context7 MCP configurado (`CONTEXT7_API_KEY`)
- GitHub MCP configurado (`GITHUB_TOKEN`)
- Browser/Playwright MCP configurado
- Índice RAG: projeto (presente/ausente) vs global (existe/não é deste projeto)
- `npm audit` — vulnerabilidades critical/high

---

### `agim status`

**Mostra estado atual** do projeto (lê `memoria/ESTADO-ATUAL.md`).

```bash
agim status
agim status --json
```

**Saída Inclui**:
- Fase atual
- Última validação (timestamp + resultado)
- Próxima etapa planejada
- Arquivos modificados recentemente
- Testes rodados (pass/fail)
- Problemas identificados
- Bloqueios ativos
- Decisões recentes (IDs)
- Pendências abertas (IDs + prioridade)

**Útil para**: Checkpoint rápido, retomada de sessão, CI status

---

### `agim interview "objetivo"`

**Classifica objetivo, seleciona skills, grava plano** — sem executar.

```bash
agim interview "Nova API de pagamentos com idempotência"
agim interview "Refatorar modulo legacy-auth" --json
```

**Faz**:
1. Entrevista adaptativa (perguntas críticas só se lacunas)
2. Classifica: domínio/tipo/complexidade/risco/escopo
3. Seleciona skills mínimas via matriz
4. Grava `memoria/PLANO-DE-EXECUCAO.md`
5. Atualiza `memoria/ESTADO-ATUAL.md` + `PROXIMO-PASSO.md`
6. Retorna exit 1 se setup ausente (antes dava "próximos passos" enganosos)

**Exit codes**: `0` = plano gravado, `1` = setup incompleto

---

### `agim sync`

**Atualiza bloco gerenciado do AGENTS.md** a partir de `.agim/config.json`.

```bash
agim sync
agim sync --force  # Força reescrita (preserva notas usuário)
```

**Bloco Gerenciado** (marcadores):
```markdown
<!-- AGIM:MANAGED:START -->
# Instruções AGIM (gerado automaticamente)
...
<!-- AGIM:MANAGED:END -->
```

**Comportamento**:
- `--force`: Reescreve bloco gerenciado, **mantém** conteúdo do usuário fora dos marcadores
- Sem `--force`: Atualiza apenas se config mudou
- Adiciona no topo do arquivo se não existir

---

### `agim audit`

**Auditoria estática de segurança** — 15 categorias de risco.

```bash
agim audit
agim audit --json
```

**Varre**:
- `eval()`, `Function()`, `setTimeout(string)`
- `.innerHTML =`, `.outerHTML =`, `dangerouslySetInnerHTML`
- Concatenação SQL: `+ variavel`, `+ 'str'`, `` `${...}` ``
- Segredos hardcoded: senhas, tokens, chaves API (`AKIA...`, `sk_...`, etc.)
- Arquivos `.env`, `.yaml`, `.yml`, `.json` sensíveis
- Padrões OWASP Top 10

**Tratamento**:
- "0 arquivos analisados" = **aviso** (nunca PASS)
- Ignora arquivos de teste temporários (`test-regex.cjs`, etc.)
- Exit 1 se qualquer crítico encontrado

---

### `agim config:validate`

**Valida apenas `.agim/config.json`** com Zod (fail fast).

```bash
agim config:validate
agim config:validate --json
```

**Valida**:
- JSON sintaticamente válido (inclui BOM UTF-8)
- Campos obrigatórios presentes
- Enums válidos: `qualityGates.typescript` (`strict`|`relaxed`), `qualityGates.lint` (`standard`|`verbose`), `conventions.commits` (`conventional`|`custom`)
- Ranges numéricos: `coverage` 0-100, `thresholds` positivos
- URLs válidas (`DATABASE_URL`, `CORS_ORIGIN`)
- Strings não vazias obrigatórias

---

### `agim core:link`

**Recria symlink `.agim/core → ~/.agent-bible`**.

```bash
agim core:link
```

**Quando usar**:
- Link quebrado/corrompido
- Após atualização do kit global (`~/.agent-bible`)
- Mudança de máquina/diretório

---

### `agim rag:rebuild`

**Reconstrói índice RAG** (busca semântica) do projeto.

```bash
agim rag:rebuild
```

**Pré-requisito**:
```bash
npm install -g @xenova/transformers
```

**Cria**: `.agim/rag-index/` com embeddings vetoriais

**Usado por**: `bible-rag-search` skill

---

### `agim graph "pergunta"`

**Consulta grafo de código** via Graphify (queries naturais).

```bash
agim graph "quais arquivos dependem de usuarios.service?"
agim graph "mostrar fluxo de autenticação"
```

**Pré-requisito**:
```bash
npm install -g graphify-cli
graphify build  # No diretório do projeto
```

**Retorna**: Subgrafo relevante (~2KB vs 200KB completo)

**Usado por**: `graphify-integration` skill

---

## Códigos de Saída

| Código | Significado |
|--------|-------------|
| `0` | Sucesso total |
| `1` | Falha crítica (quality gate, validação, auditoria) |
| `2` | Erro de uso (argumentos inválidos) |
| `130` | Interrompido (Ctrl+C) |

---

## Exemplos de Uso Comum

### Setup Inicial
```bash
mkdir meu-projeto && cd meu-projeto
agim init
agim validate
agim doctor
```

### Feature Nova
```bash
agim auto "CRUD completo de produtos com categorias"
```

### Bug Fix
```bash
agim auto "Fix: refresh token não rotaciona corretamente"
```

### Refatoração
```bash
agim interview "Refatorar payment-service para usar repository pattern"
# Revisa plano em memoria/PLANO-DE-EXECUCAO.md
agim auto "continua"
```

### Pre-Deploy
```bash
agim validate
agim audit
agim status --json  # Para CI
```

### CI/CD (GitHub Actions)
```yaml
- name: AGIM Validate
  run: agim validate --json
  
- name: AGIM Audit
  run: agim audit --json
  
- name: AGIM Status
  run: agim status --json
```

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `CONTEXT7_API_KEY` | Não | API key para Context7 (docs por versão) |
| `GITHUB_TOKEN` | Não | Token GitHub para MCP GitHub |
| `AGIM_CONFIG_PATH` | Não | Caminho customizado para `.agim/config.json` |

---

## Arquivos de Configuração

### `.agim/config.json` (Fonte Única)
Ver [CONFIGURATION.md](./CONFIGURATION.md) para referência completa.

### `AGENTS.md` (Instruções Operacionais)
Bloco gerenciado AGIM + suas anotações livres.

### `memoria/` (Estado Persistente)
6 arquivos — não editar manualmente (use skills/CLI).

---

## Próximos Documentos

| Documento | Foco |
|-----------|------|
| [CONFIGURATION.md](./CONFIGURATION.md) | `.agim/config.json` referência completa |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura 9+6 camadas |
| [SECURITY.md](./SECURITY.md) | Segurança obrigatória |
| [TESTING.md](./TESTING.md) | Estratégia de testes |