# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Não Lançado]

### Adicionado
- (nada ainda)

---

## [1.1.2] - 2026-10-29

### Corrigido (P0 — bloqueadores de release)
- **`config:validate` não validava** — JSON inválido, ranges fora do permitido (coverage > 100), campos obrigatórios ausentes, enums inválidos (`typescript: "relaxed"`, `lint: "verbose"`) retornavam "válido" (exit 0). Agora falham corretamente.
- **`agim audit` não detectava vulnerabilidades** — `eval()`, `.innerHTML =`, SQL concatenação (`+ variavel`), senha hardcoded, `AKIA...` no `.env`: zero detecções. Agora detecta todos (inclui SQL por `+ var` sem aspas).
- **`agim doctor` confundia índice RAG** — avisava "índice RAG global existe" como se fosse do projeto. Agora distingue corretamente: projeto → "presente", global → "existe mas não é deste projeto", nenhum → "ausente".

### Corrigido (P1 — usabilidade)
- Regex SQL injection expandida: detecta template literals (`${...}`), concatenação com aspas (`+ 'str'`) e concatenação direta (`+ variavel`).
- `security-audit.cjs`: ignora arquivos de teste temporários (`test-regex.cjs`, etc.) para não dar falso positivo no repo.

### Adicionado
- Teste de regressão para validação de enums e ranges no `test/unit.cjs`.
- Teste de regressão para auditoria (eval, innerHTML, SQL, segredos, .env) no `test/smoke.cjs`.

---

## [1.1.1] - 2026-10-29

### Corrigido
- **`agim auto` quebrava em instalações npm** (`Cannot find module './auto-flow.cjs'`): o arquivo não estava na lista `files` do pacote. O `files` agora inclui `scripts/` inteiro e um teste de empacotamento impede a regressão.
- `agim sync --force` **não descarta mais** o `AGENTS.md` do usuário: o bloco gerenciado é adicionado no topo e o conteúdo existente é preservado.
- `agim validate` detecta corretamente o repositório AGIM (o nome do pacote era comparado sem o `_` do scope) e passa a exigir o kit completo de skills (antes aceitava 1 skill qualquer).
- `agim status` agora reflete a entrevista: lê estado, plano e próximo passo, e aceita `--json`.
- `agim interview` retorna exit 1 quando o setup está ausente (antes imprimia "próximos passos" enganosos), atualiza `memoria/ESTADO-ATUAL.md` e `memoria/PROXIMO-PASSO.md`, ignora `ia` dentro de palavras ("criar") e escapa `|`/`<`/`>` no plano.
- `agim init --json` e `agim interview --json` agora emitem JSON válido (sem logs humanos misturados).
- Config com **BOM UTF-8** é lida corretamente; enums (`qualityGates.typescript`, `qualityGates.lint`, `conventions.commits`) passam a ser validados.
- `agim audit` detecta `eval`, `innerHTML` direto, SQL por concatenação e segredos hardcoded, varre `.env`/`.yaml`/`.json` e trata "0 arquivos analisados" como aviso (nunca PASS).
- `agim doctor` avalia o índice RAG **do projeto** (antes qualquer projeto herdava o índice global).
- `agim init` informa quantas skills foram realmente copiadas na execução.
- `package-lock.json` estava com nome/versão antigos.

### Alterado
- **Nome do pacote npm**: `@brendontailor_/agim` → **`agim-orchestrator`**. O pacote da 1.1.0 ficou numa conta sem acesso (e a 1.1.0 está quebrada); a 1.1.1 sai em conta nova, com nome próprio. O comando continua `agim`. Referências históricas à 1.1.0 foram mantidas.

### Adicionado
- `scripts/status.cjs` — status estruturado do projeto.
- `scripts/validate-package.cjs` + `npm run pack:check` — garante que todo `require` relativo está no tarball.
- `test/unit.cjs` — classificação, schema, Markdown e backups.
- `test/smoke.cjs` — executa todos os comandos do CLI em projetos temporários (inclui path com espaço/acento).
- Rotação automática de backups (máximo de 5 por arquivo) e `.gitignore` do projeto recebe `*.agim-backup-*`.
- CI em matriz Windows/Linux × Node 18/20/22 rodando testes e `npm pack`.

### Alterado
- `files` do pacote passou a usar `scripts/` (lista arquivo-a-arquivo permitia esquecer módulos).
- Versão `1.1.1`.

---

## [1.1.0] - 2026-10-28

### Adicionado
- Fluxo automático `agim auto` (detecta, repara, sincroniza, planeja, valida em paralelo e registra no histórico).
- Auto-scaling por CPU/RAM com cache em `memoria/RECURSOS.json`.
- CLI unificado (`init`, `validate`, `doctor`, `sync`, `audit`, `status`, `interview`, `graph`, `config:validate`, `rag:rebuild`, `core:link`).
- Documentação progressiva (QUICKSTART → CONFIGURATION → TROUBLESHOOTING).
- Publicação `@brendontailor_/agim@1.1.0`.

---

## [1.0.0] - 2026-10-27

### Adicionado
- Release inicial da Biblia Universal de IA
- Todos os componentes listados na versão 1.1.0

---

## Formato de Entradas

### Tipos de Mudança
- `Adicionado` para novas funcionalidades
- `Alterado` para mudanças em funcionalidades existentes
- `Depreciado` para funcionalidades que serao removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correcao de bugs
- `Seguranca` para correcoes de vulnerabilidades

### Formato de Commit (Conventional Commits)
```
<tipo>(<escopo>): <descricao>

[corpo opcional]

[rodapé opcional]
```

**Tipos**: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `security`, `perf`, `ci`, `build`, `revert`

**Exemplos**:
```
feat(auth): adicionar refresh token rotation
fix(api): corrigir validacao email no endpoint usuarios
refactor(services): extrair logica validacao para validator separado
docs(readme): atualizar instrucoes deploy
test(auth): adicionar testes login invalido
security(deps): atualizar dependencias vulneraveis
```

---

## Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/):
- **MAJOR**: Mudancas incompativeis na API
- **MINOR**: Novas funcionalidades compativeis
- **PATCH**: Correcoes de bugs compativeis

### Tags de Versao
- `v1.0.0` - Release inicial
- `v1.1.0` - Fluxo automático `agim auto`
- `v1.1.1` - Correções do relatório de testes (empacotamento, sync, audit, status)
- `v2.0.0` - Próxima major (breaking changes)

---

## Links Úteis

- [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
- [Semantic Versioning](https://semver.org/lang/pt-BR/)
- [Conventional Commits](https://www.conventionalcommits.org/pt-BR/)
- [GitHub Releases](https://github.com/Brendontailor/AGIM/releases)