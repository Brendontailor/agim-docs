# Validação do Repositório

> Procedimento reproduzível para provar que a Bíblia está íntegra: estrutura, links, sintaxe, skills, templates, checklists, segredos, exemplos e consistência da memória.
> Execute antes de cada commit relevante e antes de qualquer publicação.

---

## 1. Quando Executar

| Momento | Escopo mínimo |
|---------|---------------|
| Antes de commit | Seções 3 (estrutura) e 8 (segredos) |
| Antes de PR | Seções 3 a 9 |
| Antes de release/publicação | Todas as seções |
| Após mover/renomear arquivos | Seções 3 e 4 (links) |
| Após editar `memoria/` | Seção 9 |

**Ambiente**: Windows (PowerShell) ou Linux/macOS (bash). Os comandos abaixo indicam a variante quando diferem.

---

## 2. Preparação

```powershell
# Windows (PowerShell) - execute a partir da raiz do repositorio
Set-Location C:\Users\Treinamento\AGENT-BIBLE
$ErrorActionPreference = 'Stop'
```

```bash
# Linux/macOS
cd ~/AGENT-BIBLE
set -euo pipefail
```

Pré-requisitos: Node.js >= 18 (para os scripts), Git instalado, nenhum arquivo em edição.

---

## 3. Estrutura Obrigatória

### 3.1 Script automatizado (fonte de verdade)

```powershell
node scripts/validar-estrutura.cjs
```

**Saída esperada**: `Estrutura válida! Todos os itens obrigatórios estão presentes.` e código de saída `0`.

```powershell
# Falha explicita se algo faltar (usar em CI)
node scripts/validar-estrutura.cjs; if ($LASTEXITCODE -ne 0) { throw "Estrutura invalida" }
```

O script valida 60+ itens: arquivos raiz, 8 diretórios, 9 docs, 6 arquivos de memória, 9 checklists, 12 templates, 7 skills, plugin Graphify, 4 templates GitHub e os 11 arquivos do exemplo de arquitetura.

### 3.2 Contagem manual por categoria

```powershell
"docs:       " + (Get-ChildItem docs -Filter *.md).Count        # esperado: 9
"memoria:    " + (Get-ChildItem memoria -Filter *.md).Count     # esperado: 6
"checklists: " + (Get-ChildItem checklists -Filter *.md).Count  # esperado: 9
"templates:  " + (Get-ChildItem templates -Filter *.md).Count   # esperado: 12
"skills:     " + (Get-ChildItem .opencode\skills -Directory).Count # esperado: 7
```

```bash
for d in docs memoria checklists templates; do printf "%-12s %s\n" "$d" "$(ls "$d"/*.md | wc -l)"; done
printf "%-12s %s\n" skills "$(find .opencode/skills -maxdepth 1 -mindepth 1 -type d | wc -l)"
```

### 3.3 Arquivos vazios ou suspeitos

```powershell
Get-ChildItem -Recurse -File -Include *.md,*.js,*.ts,*.tsx |
  Where-Object { $_.FullName -notmatch '\\node_modules\\|\\.git\\' -and $_.Length -lt 200 } |
  Select-Object Length, FullName
```

**Esperado**: lista vazia. Qualquer arquivo abaixo de 200 bytes é placeholder e deve ser justificado.

---

## 4. Links Internos

### 4.1 Links relativos quebrados (Markdown)

```powershell
$raiz = (Get-Location).Path
$quebrados = @()
Get-ChildItem -Recurse -Filter *.md | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | ForEach-Object {
  $arquivo = $_
  Select-String -Path $arquivo.FullName -Pattern '\]\(([^)#][^)]*)\)' -AllMatches | ForEach-Object {
    foreach ($m in $_.Matches) {
      $alvo = $m.Groups[1].Value
      if ($alvo -match '^(https?:|mailto:|#)') { continue }
      $alvo = $alvo.Split('#')[0]
      $caminho = Join-Path $arquivo.DirectoryName $alvo
      if (-not (Test-Path $caminho)) { $quebrados += "$($arquivo.Name) -> $alvo" }
    }
  }
}
if ($quebrados.Count -eq 0) { "OK: nenhum link relativo quebrado" } else { $quebrados }
```

**Esperado**: `OK: nenhum link relativo quebrado`.

### 4.2 Arquivos citados em texto (backticks) que não existem

Os documentos citam caminhos como `` `docs/SEGURANCA.md` ``. Verificação amostral:

```powershell
$citados = 'docs/ARQUITETURA.md','docs/CODIGO-LIMPO.md','docs/SEGURANCA.md','docs/TESTES.md',
           'docs/FERRAMENTAS-IA.md','docs/IA-E-CONTEXTO.md','docs/BOOTSTRAP-AMBIENTE.md',
           'docs/DECISOES-TECNICAS.md','docs/VALIDACAO-DO-REPOSITORIO.md'
$citados | ForEach-Object { "{0,-40} {1}" -f $_, (Test-Path $_) }
```

**Esperado**: `True` em todas as linhas.

---

## 5. Sintaxe e Formatação Markdown

### 5.1 Títulos duplicados no mesmo nível (H1 múltiplo por arquivo)

```powershell
Get-ChildItem -Recurse -Filter *.md | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | ForEach-Object {
  $h1 = (Select-String -Path $_.FullName -Pattern '^# ' -AllMatches).Count
  if ($h1 -gt 1) { "AVISO: $($_.Name) tem $h1 titulos H1" }
}
```

**Esperado**: nenhum aviso. Exceção documentada: arquivos em `templates/` contêm o cabeçalho do template e o título do documento gerado.

### 5.2 Blocos de código não fechados

```powershell
Get-ChildItem -Recurse -Filter *.md | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | ForEach-Object {
  $cercas = (Select-String -Path $_.FullName -Pattern '^```' -AllMatches).Count
  if ($cercas % 2 -ne 0) { "ERRO: $($_.Name) tem numero impar de cercas de codigo ($cercas)" }
}
```

**Esperado**: nenhum erro.

### 5.3 Tabelas com número de colunas inconsistente

Revisão manual assistida: procure linhas de tabela cujo `|` count difira do cabeçalho. Em caso de dúvida, renderize o arquivo e confira a tabela.

### 5.4 Encoding e acentuação

```powershell
Get-ChildItem -Recurse -Filter *.md | Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
  ForEach-Object { $bytes = [IO.File]::ReadAllBytes($_.FullName); if ($bytes -contains 0) { "ERRO binario: $($_.Name)" } }
```

**Esperado**: nenhuma saída. Nomes de arquivos permanecem sem acento (`DECISOES`, não `DECISÕES`).

---

## 6. Skills Locais

### 6.1 Frontmatter obrigatório

Cada `SKILL.md` deve iniciar com bloco YAML contendo `name` e `description`:

```powershell
Get-ChildItem .opencode\skills -Directory | ForEach-Object {
  $f = Join-Path $_.FullName 'SKILL.md'
  if (-not (Test-Path $f)) { "FALTANDO: $($_.Name)/SKILL.md"; return }
  $txt = Get-Content $f -Raw
  $okName = $txt -match '(?m)^name:\s*\S+'
  $okDesc = $txt -match '(?m)^description:\s*\S+'
  "{0,-30} name={1} description={2}" -f $_.Name, $okName, $okDesc
}
```

**Esperado**: 7 skills, todas com `name=True description=True`.

### 6.2 Consistência com o catálogo

O nome de cada skill deve aparecer em `SKILLS-CATALOG.md` e `SKILLS-SELECTION-MATRIX.md`:

```powershell
Get-ChildItem .opencode\skills -Directory | ForEach-Object {
  $n = $_.Name
  $cat = (Select-String -Path SKILLS-CATALOG.md -Pattern $n -SimpleMatch -Quiet)
  $mat = (Select-String -Path SKILLS-SELECTION-MATRIX.md -Pattern $n -SimpleMatch -Quiet)
  "{0,-30} catalogo={1} matriz={2}" -f $n, $cat, $mat
}
```

**Esperado**: `catalogo=True matriz=True` para todas.

---

## 7. Templates, Checklists e Memória

### 7.1 Templates utilizáveis

Cada template deve ter: título, instrução de uso (`> Copie este arquivo`), pelo menos um bloco de exemplo e nenhum dado real de pessoa/empresa.

```powershell
Get-ChildItem templates -Filter *.md | ForEach-Object {
  $t = Get-Content $_.FullName -Raw
  "{0,-35} instrucao={1} linhas={2}" -f $_.Name, ($t -match 'Copie este arquivo'), (($t -split "`n").Count)
}
```

**Esperado**: `instrucao=True` em todos e mínimo de 40 linhas.

### 7.2 Checklists executáveis

```powershell
Get-ChildItem checklists -Filter *.md | ForEach-Object {
  $t = Get-Content $_.FullName -Raw
  $caixas = ([regex]::Matches($t, '- \[ \]')).Count
  "{0,-28} caixas={1}" -f $_.Name, $caixas
}
```

**Esperado**: cada checklist com pelo menos 10 caixas `- [ ]`. Checklist sem caixa não é executável.

### 7.3 Integridade da memória

| Verificação | Comando | Esperado |
|-------------|---------|----------|
| 6 arquivos presentes | `node scripts/validar-estrutura.cjs` | OK |
| `PROXIMO-PASSO.md` aponta para etapa existente | leitura manual | etapa existe em `PLANO-DE-EXECUCAO.md` |
| `ESTADO-ATUAL.md` data <= hoje | leitura manual | data coerente |
| Pendências sem estado | `Select-String -Path memoria\PENDENCIAS.md -Pattern 'Estado\*\* \| \*\*$'` | sem saída |
| Decisões duplicadas | `Select-String -Path memoria\DECISOES.md -Pattern '^## DEC-' \| Group-Object Line \| Where-Object Count -gt 1` | sem saída |

---

## 8. Segredos e Dados Sensíveis

```powershell
# Padroes de segredo em arquivos versionados
$padroes = 'AKIA[0-9A-Z]{16}','-----BEGIN (RSA|OPENSSH|EC) PRIVATE KEY-----',
           'ghp_[A-Za-z0-9]{36}','sk-[A-Za-z0-9]{20,}','(?i)(password|senha|secret|token)\s*[:=]\s*["''][^"'']{8,}'
Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch '\\node_modules\\|\\.git\\' -and $_.Length -lt 1MB } |
  Select-String -Pattern $padroes -AllMatches | Select-Object Path, LineNumber, Line
```

**Esperado**: nenhum resultado com valor real. Ocorrências em exemplos devem usar placeholders (`[SEU_TOKEN]`, `changeme`).

```powershell
# Arquivos de ambiente que nunca devem ser versionados
git ls-files | Select-String -Pattern '(^|/)\.env($|\.)|\.pem$|\.key$|credentials'
```

**Esperado**: sem saída, exceto `.env.example`.

---

## 9. Exemplo de Arquitetura

```powershell
node -e "const v=require('./scripts/validar-estrutura.cjs'); v.validarExemplos();"
```

**Esperado**: `Todos os exemplos de arquitetura estão presentes!`

Verificação de camadas do backend (ordem obrigatória rota → controller → service → repository):

```powershell
$base = 'exemplos/arquitetura-modular/backend/src'
'routes','controllers','services','validators','repositories','types' | ForEach-Object {
  "{0,-16} {1}" -f $_, (Test-Path (Join-Path $base $_))
}
```

**Esperado**: `True` em todas.

---

## 10. Git e Consistência Final

```powershell
git status --short          # esperado: vazio ou apenas arquivos desta validacao
git remote -v               # esperado: origin -> https://github.com/Brendontailor/AGENT_BIBLE.git
git log --oneline -3        # historico legivel
```

Regras:
- Nenhum `git push` sem autorização explícita (ADR-005).
- Nenhum arquivo gerado (`graphify-out/`, `node_modules/`, `dist/`) versionado.

```powershell
git ls-files | Select-String -Pattern 'node_modules/|graphify-out/|^dist/|\.log$'
```

**Esperado**: sem saída.

---

## 11. Resultado da Validação

| Seção | Item | Status | Evidência |
|-------|------|--------|-----------|
| 3 | Estrutura obrigatória | ⬜ | saída de `validar-estrutura.cjs` |
| 3.3 | Sem arquivos vazios | ⬜ | lista |
| 4 | Links internos | ⬜ | lista de quebrados |
| 5 | Sintaxe Markdown | ⬜ | avisos |
| 6 | Skills válidas | ⬜ | tabela name/description |
| 7 | Templates e checklists | ⬜ | contagens |
| 8 | Sem segredos | ⬜ | busca |
| 9 | Exemplo arquitetural | ⬜ | saída `validarExemplos` |
| 10 | Git consistente | ⬜ | `git status` |

**Estados permitidos**: APROVADO · REPROVADO · BLOQUEADO · NÃO EXECUTADO.
Uma validação só é APROVADA quando todas as linhas obrigatórias estão APROVADAS com evidência registrada em `memoria/HISTORICO-DE-EXECUCAO.md`.

---

## 12. Falhas Comuns e Correção

| Sintoma | Causa provável | Correção |
|---------|----------------|----------|
| `FALTANDO: docs/X.md` | arquivo não criado ou renomeado | criar/restaurar arquivo |
| Link relativo quebrado | arquivo movido sem atualizar referências | corrigir caminho no Markdown |
| `numero impar de cercas` | bloco de código não fechado | fechar com ``` |
| Skill sem `description` | frontmatter incompleto | adicionar campo |
| Segredo detectado | credencial real em exemplo | substituir por placeholder e rotacionar a credencial |
| Contagem divergente | arquivo criado fora do padrão | mover para a pasta correta |
