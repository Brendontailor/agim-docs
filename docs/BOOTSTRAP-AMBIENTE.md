# Guia de Inicialização e Bootstrap do Ambiente

> Protocolo obrigatório para configurar o ambiente OpenCode com todas as skills, MCPs e ferramentas necessárias antes de iniciar qualquer trabalho.

---

## Ordem de Execução Obrigatória

### 1. Verificar Versão do OpenCode
```bash
opencode --version
# Deve ser v2.x (atual: v2.1.4)
```

### 2. Verificar/Instalar Skills Globais Necessárias

**Skills obrigatórias para este repositório:**
| Skill | Comando Instalação | Verificação |
|-------|-------------------|-------------|
| `ui-ux-pro-max` | `opencode skill install ui-ux-pro-max` | `opencode skill list \| grep ui-ux-pro-max` |
| `design-system` | `opencode skill install design-system` | `opencode skill list \| grep design-system` |
| `design` | `opencode skill install design` | `opencode skill list \| grep ^design$` |
| `banner-design` | `opencode skill install banner-design` | `opencode skill list \| grep banner-design` |
| `brand` | `opencode skill install brand` | `opencode skill list \| grep ^brand$` |
| `slides` | `opencode skill install slides` | `opencode skill list \| grep ^slides$` |
| `ui-styling` | `opencode skill install ui-styling` | `opencode skill list \| grep ui-styling` |

**Script de verificação/instalação em lote:**
```bash
#!/bin/bash
# scripts/bootstrap-skills.sh

SKILLS_GLOBAIS=(
  "ui-ux-pro-max"
  "design-system"
  "design"
  "banner-design"
  "brand"
  "slides"
  "ui-styling"
)

echo "🔍 Verificando skills globais instaladas..."
INSTALADAS=$(opencode skill list --json 2>/dev/null | jq -r '.[].name' 2>/dev/null || opencode skill list | awk '{print $1}')

for skill in "${SKILLS_GLOBAIS[@]}"; do
  if echo "$INSTALADAS" | grep -q "^${skill}$"; then
    echo "  ✅ ${skill} - já instalada"
  else
    echo "  📥 Instalando ${skill}..."
    opencode skill install "${skill}" || echo "  ⚠️ Falha ao instalar ${skill}"
  fi
done

echo "✅ Verificação de skills globais concluída"
```

### 3. Verificar/Configurar MCPs Necessários

**MCPs obrigatórios:**
| MCP | Função | Configuração |
|-----|--------|--------------|
| `context7` | Docs técnicas atualizadas | `~/.config/opencode/mcp/context7.json` |
| `github` | Operações GitHub | `~/.config/opencode/mcp/github.json` |
| `browser` / `playwright` | Testes E2E, screenshots | `~/.config/opencode/mcp/browser.json` |

**Verificar MCPs configurados:**
```bash
opencode mcp list
```

**Configuração padrão context7 (`~/.config/opencode/mcp/context7.json`):**
```json
{
  "name": "context7",
  "command": "npx",
  "args": ["-y", "@context7/mcp-server"],
  "env": {
    "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
  }
}
```

**Configuração padrão github (`~/.config/opencode/mcp/github.json`):**
```json
{
  "name": "github",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
  }
}
```

### 4. Instalar Skills Locais do Repositório

**Após clonar o repositório:**
```bash
# 1. Clonar o repositório AGIM
git clone https://github.com/Brendontailor/AGIM.git AGIM
cd AGIM

# 2. Instalar skills locais (se não estiverem no .opencode/skills/)
# As skills locais já vêm no repositório em .opencode/skills/
# Verificar:
ls -la .opencode/skills/

# Deve mostrar:
# planejamento-de-tarefas/
# analise-de-legado/
# revisao-de-interface/
# auditoria-de-seguranca/
# testes-com-roteiro/
# revisao-final/
```

### 5. Verificar Plugins Locais

```bash
# Verificar plugin graphify
ls -la .opencode/plugins/
# Deve mostrar: graphify.js
```

### 6. Validar Estrutura do Repositório

```bash
# Executar script de validação
node scripts/validar-estrutura.cjs

# Ou verificação manual:
ls -la \
  AGENTS.md \
  README.md \
  CONTRIBUTING.md \
  CHANGELOG.md \
  .gitignore \
  .editorconfig \
  docs/ \
  memoria/ \
  .opencode/skills/ \
  checklists/ \
  templates/ \
  exemplos/ \
  scripts/ \
  .github/
```

### 7. Inicializar Git (se novo projeto)

```bash
git init
git add .
git commit -m "chore: initial commit - meu-padrao-de-desenvolvimento"
git branch -M main
```

### 8. Configurar Variáveis de Ambiente

```bash
# Copiar exemplo
cp .env.example .env

# Editar com valores reais (NUNCA commitar .env real)
# .env deve estar no .gitignore
```

### 9. Instalar Dependências do Projeto (se houver package.json)

```bash
# Se usar npm
npm install

# Se usar pnpm (recomendado para monorepo)
pnpm install

# Verificar se scripts funcionam
npm run validate  # ou pnpm validate
```

### 10. Testar Recuperação de Contexto

```bash
# Simular perda de contexto:
# 1. Fechar OpenCode
# 2. Reabrir em nova sessão
# 3. Executar protocolo de início (AGENTS.md seção 1)
# 4. Verificar se consegue retomar a partir de memoria/PROXIMO-PASSO.md
```

---

## Checklist de Bootstrap Completo

```markdown
## ✅ Bootstrap Checklist

### OpenCode
- [ ] Versão v2.x confirmada (`opencode --version`)

### Skills Globais
- [ ] ui-ux-pro-max
- [ ] design-system
- [ ] design
- [ ] banner-design
- [ ] brand
- [ ] slides
- [ ] ui-styling

### MCPs
- [ ] context7 configurado e funcional
- [ ] github configurado (se usar GitHub)
- [ ] browser/playwright configurado (se testar E2E)

### Skills Locais (no repo)
- [ ] planejamento-de-tarefas
- [ ] analise-de-legado
- [ ] revisao-de-interface
- [ ] auditoria-de-seguranca
- [ ] testes-com-roteiro
- [ ] revisao-final

### Plugins
- [ ] graphify.js presente em .opencode/plugins/

### Estrutura
- [ ] Todos diretórios e arquivos obrigatórios existem
- [ ] AGENTS.md na raiz
- [ ] README.md na raiz
- [ ] docs/ com ARQUITETURA.md, CODIGO-LIMPO.md
- [ ] memoria/ com 6 arquivos
- [ ] checklists/ com 9 arquivos
- [ ] templates/ com 12 arquivos
- [ ] exemplos/arquitetura-modular/
- [ ] scripts/
- [ ] .github/ISSUE_TEMPLATE/

### Git
- [ ] Repositório inicializado
- [ ] .gitignore configurado (node_modules, .env, dist, build, *.log)
- [ ] Commit inicial feito

### Ambiente
- [ ] .env configurado (valores reais, não no Git)
- [ ] Dependências instaladas (se package.json existir)
- [ ] Scripts de validação rodam sem erro
- [ ] Recuperação de contexto testada
```

---

## Troubleshooting Comum

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| `opencode skill install` falha | Sem internet / registry indisponível | Verificar conexão; tentar novamente; instalar manualmente copiando pasta para `.opencode/skills/` |
| MCP não carrega | Configuração inválida / token expirado | Verificar `~/.config/opencode/mcp/*.json`; regenerar tokens |
| Skill local não aparece | Pasta não tem `SKILL.md` válido | Verificar formato; comparar com skills globais funcionando |
| `context7` retorna erro | API key inválida / quota excedida | Verificar `CONTEXT7_API_KEY` no env; checar limites da conta |
| Graphify não avisa | `graphify-out/` não existe | Executar `graphify build` no projeto alvo primeiro |
| Permissão negada Windows | PowerShell execution policy | `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |

---

## Script de Bootstrap Automatizado

```bash
#!/bin/bash
# scripts/bootstrap-completo.sh
# Executar na raiz do repositório clonado

set -e

echo "🚀 Iniciando bootstrap completo do meu-padrao-de-desenvolvimento..."

# 1. Verificar OpenCode
echo "1/8 Verificando OpenCode..."
opencode --version

# 2. Skills globais
echo "2/8 Verificando skills globais..."
bash scripts/bootstrap-skills.sh

# 3. MCPs
echo "3/8 Verificando MCPs..."
opencode mcp list

# 4. Skills locais
echo "4/8 Verificando skills locais..."
ls -la .opencode/skills/ | grep -E "planejamento|analise|revisao|auditoria|testes|revisao-final"

# 5. Plugin graphify
echo "5/8 Verificando plugin graphify..."
ls -la .opencode/plugins/graphify.js

# 6. Estrutura
echo "6/8 Validando estrutura..."
node scripts/validar-estrutura.cjs

# 7. Git
echo "7/8 Verificando Git..."
if [ ! -d ".git" ]; then
  echo "  Inicializando Git..."
  git init
  git add .
  git commit -m "chore: initial commit"
fi

# 8. Dependências
echo "8/8 Verificando dependências..."
if [ -f "package.json" ]; then
  npm install 2>/dev/null || pnpm install 2>/dev/null || echo "  ⚠️ Gerenciador de pacotes não encontrado"
fi

echo ""
echo "✅ Bootstrap concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "  1. Configure .env com valores reais"
echo "  2. Leia AGENTS.md e memoria/PROXIMO-PASSO.md"
echo "  3. Inicie o OpenCode e comece a trabalhar"
```

---

## Ordem de Prioridade se Faltar Tempo

Se não puder fazer tudo de uma vez, **ordem mínima viável**:

1. **OpenCode v2.x** + **AGENTS.md** na raiz do projeto
2. **Skills locais** (6 skills em `.opencode/skills/`) - essenciais para o fluxo
3. **memoria/** com 6 arquivos - essencial para continuidade
4. **docs/ARQUITETURA.md** + **docs/CODIGO-LIMPO.md** - base técnica
5. **Context7 MCP** - para docs técnicas atualizadas
6. **Skills globais UI/UX** - quando precisar de interface
7. **GitHub MCP** - quando precisar de operações Git
8. **Browser/Playwright MCP** - quando precisar testar E2E

---

## Referências

- `AGENTS.md` - Seção 1 (Protocolo de Início) e Seção 5 (Ferramentas)
- `docs/FERRAMENTAS-IA.md` - Inventário detalhado de cada ferramenta
- `docs/IA-E-CONTEXTO.md` - Configuração RAG/Graphify/Context7
- `scripts/bootstrap-skills.sh` - Script skills globais
- `scripts/bootstrap-completo.sh` - Script completo