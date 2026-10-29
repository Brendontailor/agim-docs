# Usar, contribuir e publicar pelo GitHub

Este documento cobre o ciclo completo no GitHub: usar o AGIM direto do repositório,
contribuir, versionar, criar release e publicar no npm.

- Repositório: <https://github.com/Brendontailor/AGIM>
- Pacote: **`agim-orchestrator`** (binário `agim`)
- Node.js: **18 ou superior**
- Licença: MIT

---

## 1. Usar sem instalar

O AGIM não tem dependências de runtime: o CLI roda direto do clone.

```bash
git clone https://github.com/Brendontailor/AGIM.git
cd AGIM
node scripts/agim-cli.cjs --help
```

Para aplicar em outro projeto:

```bash
node scripts/agim-cli.cjs init --cwd ../meu-projeto
node scripts/agim-cli.cjs validate --cwd ../meu-projeto
node scripts/agim-cli.cjs auto "Nova feature" --cwd ../meu-projeto --skip-rag
```

### Instalar a partir do GitHub

```bash
# do clone
npm install -g .

# sem clonar (requer git no PATH)
npm install -g github:Brendontailor/AGIM

# execução única
npx --package github:Brendontailor/AGIM agim init
```

### Fixar uma branch, tag ou commit

```bash
npm install -g github:Brendontailor/AGIM#v1.1.1
npm install -g "github:Brendontailor/AGIM#<sha>"
```

---

## 2. Estrutura do repositório

| Caminho | Conteúdo |
|---------|----------|
| `scripts/` | CLI (`agim-cli.cjs`), fluxo automático, validações, libs |
| `.opencode/skills/` | 15 skills instaladas no projeto pelo `agim init` |
| `docs/` | Quickstart, configuração, arquitetura, segurança, testes, GitHub |
| `checklists/` | 9 checklists operacionais |
| `templates/` | 12 templates de plano, auditoria e relatório |
| `exemplos/` | Exemplo de arquitetura modular (backend + frontend) |
| `memoria/` | Estado do próprio repositório (não vai para o npm) |
| `test/` | `unit.cjs` e `smoke.cjs` (não vão para o npm) |

O que entra no pacote está definido em `files` no `package.json` e é conferido por
`npm run pack:check`.

---

## 3. Contribuir

```bash
# 1. Fork no GitHub e clone o seu fork
git clone https://github.com/<seu-usuario>/AGIM.git
cd AGIM

# 2. Instale as dependências de desenvolvimento
npm install

# 3. Crie uma branch
git checkout -b feat/minha-melhoria

# 4. Faça a mudança e valide
npm test
npm run test:smoke
node scripts/bootstrap-validate.cjs --repo

# 5. Commit (Conventional Commits)
git commit -m "feat(ci): adiciona cache do npm no workflow"

# 6. Push e abra o Pull Request
git push origin feat/minha-melhoria
```

Regras do projeto:

- Não desative testes, validações ou controles de segurança para "fazer passar".
- Alteração de comportamento exige teste novo (`test/unit.cjs` ou `test/smoke.cjs`).
- Atualize `CHANGELOG.md` e, se mudar comando ou arquivo, o `README.md`.
- Documentação em português; nomes oficiais de bibliotecas e comandos preservados.

O CI (`.github/workflows/validar.yml`) roda em **Windows e Linux** com **Node 18, 20 e 22**:
`npm test`, `npm run test:smoke` e `npm pack --dry-run`.

---

## 4. Versionamento

O projeto segue [SemVer](https://semver.org/lang/pt-BR/):

| Mudança | Bump | Exemplo |
|---------|------|---------|
| Correção compatível (bug, doc, empacotamento) | `patch` | `1.1.0` → `1.1.1` |
| Recurso compatível | `minor` | `1.1.1` → `1.2.0` |
| Quebra de compatibilidade (comando, config, layout) | `major` | `1.2.0` → `2.0.0` |

```bash
npm version patch --no-git-tag-version   # só atualiza package.json e lock
# edite o CHANGELOG.md
git add -A
git commit -m "chore(release): v1.1.2"
git tag -a v1.1.2 -m "v1.1.2"
```

A tag precisa apontar para o **mesmo commit** que será publicado. Tags antigas que
apontam para outro código confundem quem chega pelo npm.

---

## 5. Release no GitHub

1. `git push origin master --follow-tags` (ou `git push` + `git push origin v1.1.2`).
2. No GitHub: **Releases → Draft a new release**.
3. Escolha a tag (`v1.1.2`), título `v1.1.2` e cole a entrada do `CHANGELOG.md`.
4. Anexe o tarball (`npm pack`) se quiser uma cópia imutável.
5. Publique a release.

Para uma release com o pacote gerado pelo CI, use `npm publish --provenance` em um
workflow com `permissions: id-token: write` — o npm registra a origem do artefato.

---

## 6. Publicar no npm

```bash
npm whoami               # confirme a conta dona do pacote
npm test                 # repo + unitários + conteúdo do tarball
npm run test:smoke       # 32 cenários de CLI
npm publish              # prepublishOnly repete os testes
```

- Publicar exige **2FA**: informe o código quando pedido, ou rode
  `npm publish --ignore-scripts --otp=123456` (os testes já passaram nesta máquina).
- Em CI, use um token granular com **bypass 2FA** em `NPM_TOKEN`.
- O `files` usa diretórios (`scripts/`, `docs/`, ...). Se criar um diretório novo de
  runtime, adicione ao `files` **e** ao `scripts/validate-package.cjs`.
- Verificação obrigatória depois do publish:

```bash
npm view agim-orchestrator version
mkdir C:\temp\teste-agim && cd C:\temp\teste-agim
npx agim-orchestrator@<versão> init --skip-rag
npx agim-orchestrator@<versão> validate
npx agim-orchestrator@<versão> auto --check --skip-rag
```

### Despublicar uma versão antiga

```bash
npm unpublish "@brendontailor_/agim@1.1.0" --force   # exige acesso à conta antiga
npm deprecate "@brendontailor_/agim@1.1.0" "Pacote quebrado. Use agim-orchestrator."
```

O `deprecate` é preferível ao `unpublish`: mantém o histórico e avisa quem já instalou.

---

## 7. Checklist de release

- [ ] `npm test` e `npm run test:smoke` verdes
- [ ] `npm run pack:check` sem arquivos faltando
- [ ] `CHANGELOG.md` com a versão e a data
- [ ] `package.json` com nome e versão corretos
- [ ] `npm pack` instalado em diretório limpo e todos os comandos executados
- [ ] `git commit` + `git tag` no mesmo commit publicado
- [ ] `npm publish` concluído e `npm view <pacote> version` confirmando
- [ ] Release criada no GitHub com as notas do changelog
- [ ] Versão antiga depreciada (se houver substituta)
