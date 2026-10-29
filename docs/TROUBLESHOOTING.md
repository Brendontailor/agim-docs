# Troubleshooting AGIM

> Cada entrada segue o formato **mensagem → causa → solução**.
> Comece sempre por `agim doctor`: ele aponta o que falta e qual comando resolve.
>
> **Documentação completa**: [github.com/Brendontailor/agim-docs](https://github.com/Brendontailor/agim-docs)

---

## Diagnóstico rápido

```bash
agim doctor          # 10 checagens (crítico / aviso / opcional)
agim validate        # quality gate
agim status          # estado atual do projeto
agim sync --check    # drift entre config e AGENTS.md
agim version         # versão instalada
```

`agim doctor` retorna exit code `1` apenas quando há falha **crítica**. Avisos e
itens opcionais não bloqueiam.

---

## Instalação e CLI

### `agim: command not found` / `'agim' não é reconhecido`

**Causa**: pacote não instalado globalmente ou `%APPDATA%\npm` fora do PATH.

**Solução**:

```bash
npm install -g agim-orchestrator
npm bin -g          # confira o diretório de binários
agim --version
```

Alternativa sem instalar:

```bash
npx agim-orchestrator init
```

### O comando `agim` existe mas falha com `SyntaxError`

**Causa**: shim antigo gerado antes de uma atualização do pacote.

**Solução**:

```bash
npm uninstall -g agim-orchestrator
npm install -g agim-orchestrator
```

### `npm ERR! code EACCES` / `EPERM` ao instalar

**Causa**: permissão na pasta global do npm.

**Solução**:

```bash
npm cache clean --force
npm install -g agim-orchestrator
# Windows: rode o terminal como administrador se persistir
```

---

## `agim init`

### `AGENTS.md: PRESERVADO — AGENTS.md existente sem marcadores AGIM`

**Causa**: já existe um `AGENTS.md` no projeto, feito à mão, sem os marcadores
`<!-- AGIM:CONTEXT:START/END -->`. O AGIM não sobrescreve por padrão.

**Solução**:

```bash
# 1. Guarde o conteúdo atual
cp AGENTS.md AGENTS.md.old

# 2. Substitua com backup automático
agim init --force

# 3. Reaproveite suas notas no fim do arquivo
```

### `AGENTS.md` foi sobrescrito — como recuperar?

**Causa**: uso de `--force`.

**Solução**: o AGIM cria backup ao sobrescrever.

```bash
ls AGENTS.md.agim-backup-*        # bash
Get-ChildItem AGENTS.md.agim-backup-*   # PowerShell
```

Restaure o arquivo desejado e rode `agim init` sem `--force`.

### `Core link: FALHOU`

**Causa**: não foi possível criar junction/symlink nem copiar `~/.agent-bible`.

**Solução**:

```bash
# 1. Recrie o link
agim core:link

# 2. Se falhar, verifique a origem
ls ~/.agent-bible

# 3. Crie manualmente a partir do pacote
npm root -g    # localize agim-orchestrator
```

No Windows, junction não exige admin; symlink exige **Developer Mode** ou
privilégio elevado. O AGIM tenta, nesta ordem: junction → `mklink /J` → cópia
recursiva.

### `EPERM: operation not permitted, symlink`

**Causa**: Windows sem permissão de symlink.

**Solução**: habilite `Configurações → Privacidade e segurança → Para
desenvolvedores → Modo de desenvolvedor`. O fallback de cópia já cobre o caso,
mas a junction é mais leve.

---

## `agim validate`

### `AGENTS.md: sem bloco gerenciado pelo AGIM`

**Causa**: arquivo antigo ou editado removendo os marcadores.

**Solução**:

```bash
agim sync --force     # substitui com backup
agim validate
```

### `.agim/config.json: não encontrado`

**Causa**: projeto não inicializado ou `.agim/` removido.

**Solução**:

```bash
agim init
```

### `memoria/: faltam: PENDENCIAS.md`

**Causa**: bootstrap interrompido ou arquivo apagado.

**Solução**:

```bash
agim init             # recria apenas o que falta
```

### `Skills instaladas: .opencode/skills não encontrado`

**Causa**: kit não copiado (por exemplo, `init --skip-kit`).

**Solução**:

```bash
agim init             # instala o kit sem sobrescrever o resto
```

### `Auditoria de segurança: N aviso(s)`

**Causa**: padrões suspeitos no código (segredo aparente, stack trace em 500,
`dangerouslySetInnerHTML`, mass assignment).

**Solução**:

```bash
agim audit            # lista arquivo + problema
agim audit --json     # saída estruturada
```

Corrija o padrão apontado. Falsos positivos em scripts internos são ignorados
por padrão (`bootstrap-*`, `validar-*`, `teste-*`, `*.test.*`, `*.spec.*`).

---

## `agim sync` e drift

### `❌ Drift detectado: bloco AGIM do AGENTS.md difere do config.json`

**Causa**: `config.json` editado sem rodar `agim sync`.

**Solução**:

```bash
agim sync
agim sync --check      # confirma que zerou
```

### `⚠️ AGENTS.md não possui os marcadores AGIM:CONTEXT`

**Causa**: arquivo manual.

**Solução**: `agim sync --force` (cria backup do original).

### CI quebrando por drift

```yaml
- name: Check drift
  run: node scripts/bootstrap-validate.cjs --repo
```

Para projetos, use `agim sync --check` no pipeline — exit `1` quando houver
divergência.

---

## Recursos opcionais

### `agim rag:rebuild` → `Dependência opcional ausente: @xenova/transformers`

**Causa**: dependência opcional não instalada.

**Solução**:

```bash
npm install -g @xenova/transformers
agim rag:rebuild
```

### RAG lento

**Causa**: volume de Markdown no core global.

**Solução**:

```bash
agim init --skip-rag     # não tenta indexar no bootstrap
agim rag:rebuild         # rode depois, com calma
```

O índice fica em `~/.agent-bible/rag_index/bible-index.json`.

### RAG retorna vazio

```bash
ls ~/.agent-bible/rag_index/bible-index.json
node scripts/bible-rag-index.js --rebuild
node scripts/bible-rag-search.js "autenticação"
```

Se o índice não existir, nada é retornado — o AGIM não inventa resultados.

### `Graphify não encontrado no PATH`

**Causa**: CLI do Graphify não instalada.

**Solução**:

```bash
npm install -g graphify-cli
agim graph "onde fica a autenticação?"
```

### `Grafo ainda não construído neste projeto`

**Causa**: `graphify-out/graph.json` ausente.

**Solução**:

```bash
graphify build .
agim graph "onde fica a autenticação?"
```

O comando avisa e retorna sucesso (`exit 0`) quando o grafo não existe — não é
erro fatal.

### `graphify` avisa que a skill é mais nova que o pacote

**Causa**: versões diferentes entre CLI e skill instalada.

**Solução**: siga a recomendação do próprio Graphify (`pip install -U graphifyy`
ou equivalente). O AGIM não interfere.

---

## Idempotência e estado

### Rodar `agim init` várias vezes duplica arquivos?

**Não.** O bootstrap compara conteúdo e tamanho antes de copiar. Rodadas
seguintes mostram:

```
Kit: 0 arquivo(s) copiado(s), 62 preservado(s)
ℹ️  Projeto já estava inicializado (use --force para regenerar).
```

### `agim status` mostra informação antiga

**Causa**: `memoria/ESTADO-ATUAL.md` não foi atualizado pelo agente.

**Solução**: regra do AGIM — atualizar `memoria/` a cada etapa significativa.
Se o registro divergir da realidade, vale o arquivo, o Git e os testes.

### Backup acumulando

```bash
# bash
rm -f memoria/*.agim-backup-* AGENTS.md.agim-backup-*
# PowerShell
Remove-Item memoria\*.agim-backup-*, AGENTS.md.agim-backup-*
```

---

## Publicação / pacote

### `npm publish` → `E402 Payment Required` ou `403 Forbidden`

**Causa**: sem login, escopo sem permissão ou `--access` ausente.

**Solução**:

```bash
npm login
npm publish --access public
```

O `package.json` já declara `publishConfig.access = public`.

### `npm publish` falha no `prepublishOnly`

**Causa**: `npm test` roda `bootstrap-validate.cjs --repo` e algo falhou.

**Solução**:

```bash
node scripts/bootstrap-validate.cjs --repo
```

Corrija o item indicado antes de publicar.

### Quero ver o que vai no pacote

```bash
npm pack --dry-run
```

`memoria/`, `.agim/`, `node_modules/` e scripts internos de teste ficam fora.

---

## Escalação

| Nível | Quando | Ação |
|-------|--------|------|
| 1 — Auto-fix | Erros conhecidos acima | Aplicar a solução |
| 2 — Diagnóstico | Setup inconsistente | `agim doctor` + `agim init` |
| 3 — Configuração | Drift, config inválido | `agim sync` + `agim config:validate` |
| 4 — Bug no AGIM | Falha reproduzível no core | Abrir issue com `agim doctor --json` |

Ao abrir issue, inclua: versão do Node, sistema operacional, `agim --version`,
saída de `agim doctor --json` e o comando que falhou.

---

## Documentos relacionados

- [QUICKSTART.md](QUICKSTART.md)
- [CONFIGURATION.md](CONFIGURATION.md)
- [VALIDACAO-DO-REPOSITORIO.md](VALIDACAO-DO-REPOSITORIO.md)
