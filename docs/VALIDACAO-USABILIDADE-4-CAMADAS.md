# Validação AGIM: Proposta de Usabilidade Perfeita (4 Camadas)

**Data:** 2026-10-28
**Contexto:** Validação da proposta de arquitetura de usabilidade em 4 camadas para AGIM
**Skills Ativas:** verification-before-completion, planejamento-de-tarefas, code-review-and-quality, auditoria-de-seguranca

---

## 1. ENTENDIMENTO E CLASSIFICAÇÃO

| Aspecto | Classificação |
|---------|---------------|
| **Domínio** | Developer Experience / Tooling / Architecture |
| **Tipo** | Refatoração arquitetural + Feature (usabilidade) |
| **Complexidade** | Alta |
| **Risco** | Médio-Alto (muda bootstrap, config, core linkage) |
| **Escopo** | Sistema (core, bootstrap, config, CLI, docs) |

**Objetivo Tangível:** Reduzir onboarding de ~2h para <5min mantendo todas as features atuais.

---

## 2. ANÁLISE DE REQUISITOS (EIXO 1: FUNCIONA)

### Requisitos Funcionais Identificados

| ID | Requisito | Origem | Critério Aceitação |
|----|-----------|--------|-------------------|
| RF-01 | Bootstrap em 1 comando (<5min) | Camada 1 | `agim init` detecta stack, cria AGENTS.md, valida no fim |
| RF-02 | Config única fonte de verdade | Camada 2 | `.agim/config.json` → sincroniza AGENTS.md automaticamente |
| RF-03 | Core imutável via symlink | Camada 3 | `.agim/core -> ~/.agent-bible/` sempre atualizado |
| RF-04 | CLI unificado | Camada 3 | `agim <cmd>` para todas operações |
| RF-05 | Docs progressivas | Camada 4 | QUICKSTART (5min) → CONFIGURATION → ARCHITECTURE |
| RF-06 | Idempotência bootstrap | Qualidade | Roda N vezes = mesmo resultado |
| RF-07 | Validação automática pós-bootstrap | Qualidade | 71/71 estrutura, 0 links, 11 exemplos |

### Critérios de Aceitação Testáveis

```markdown
- [ ] `agim init` em projeto vazio → PASS validação completa em <5min
- [ ] `agim init` em projeto existente → detecta stack, preserva customizações
- [ ] `.agim/config.json` editado → `agim sync` atualiza AGENTS.md
- [ ] `git pull` no core → projetos veem mudanças via symlink
- [ ] `agim validate` → roda 5 checks em <600ms
- [ ] `agim doctor` → diagnostica problemas comuns
```

---

## 3. ANÁLISE ARQUITETURAL (EIXO 6: CONSISTENTE)

### Estrutura Proposta vs Atual

| Componente | Atual | Proposto | Impacto |
|------------|-------|----------|---------|
| **Core linkage** | Cópia templates/checklists para `.agim/` | Symlink `.agim/core -> ~/.agent-bible/` | **ALTO** - elimina divergência |
| **Config** | AGENTS.md (manual) + templates | `.agim/config.json` (machine) + AGENTS.md (human) | **ALTO** - single source of truth |
| **Bootstrap** | 7 passos manuais, 1 script monolítico | 3 scripts idempotentes + CLI | **ALTO** - idempotência + UX |
| **CLI** | N/A (scripts soltos) | `agim <cmd>` unificado | **MÉDIO** - discoverability |
| **Docs** | README 600+ linhas | 4 camadas progressivas | **MÉDIO** - progressive disclosure |

### Padrões Arquiteturais (docs/ARQUITETURA.md)

| Princípio | Aplicação na Proposta |
|-----------|----------------------|
| **Single Source of Truth** | `.agim/config.json` → AGENTS.md (sync automático) |
| **Imutabilidade do Core** | Core via symlink, nunca copiado |
| **Separação Camadas** | 4 camadas com progressive disclosure |
| **Idempotência** | Bootstrap scripts re-entrant |
| **Config over Code** | `.agim/config.json` declarativo |

---

## 4. ANÁLISE DE SEGURANÇA (EIXO 3: SEGURO)

### Riscos Identificados

| Risco | Prob | Impacto | Mitigação |
|-------|------|---------|-----------|
| **Symlink no Windows** | Média | Alto | Usar `junction` ou copiar se falhar; fallback documentado |
| **Config drift** (AGENTS.md ≠ config.json) | Alta | Médio | `agim sync` obrigatório no CI; validação no bootstrap |
| **Bootstrap partial failure** | Média | Alto | Scripts idempotentes + rollback automático + estado em `memoria/` |
| **Symlink permissions** | Baixa | Médio | Detecta no bootstrap; fallback para cópia |
| **Auto-sync PRs ignorados** | Alta | Baixo | `agim sync` roda no bootstrap + CI; não depende de PR review |

### Padrões Bloqueados (seguranca-continua)

| Padrão | Status na Proposta |
|--------|-------------------|
| Segredos em config | `.agim/config.json` NÃO tem segredos (só config) |
| Path traversal | Symlink validado no bootstrap |
| Code injection | Config JSON, não executável |
| Supply chain | Core via git submodule/npm, versionado |

---

## 5. ANÁLISE DE PERFORMANCE (EIXO 4)

### Métricas Alvo vs Atual

| Métrica | Atual | Alvo | Viabilidade |
|---------|-------|------|-------------|
| **Bootstrap tempo** | ~30s (manual steps) | **<5min total** | ✅ Viável (detecção + init + validação ~3min) |
| **Validação completa** | ~590ms | **<600ms** | ✅ Já atinge |
| **Bootstrap idempotente** | Não | **Sim** | ✅ Scripts re-entrant |
| **Symlink resolution** | N/A | **<10ms** | ✅ FS cache |
| **CLI startup** | N/A | **<100ms** | ✅ Wrapper fino |

### Gargalos Potenciais

| Gargalo | Mitigação |
|---------|-----------|
| RAG index rebuild no bootstrap | Opcional: `--skip-rag` flag; rebuild assíncrono |
| Graphify init | Lazy init (só quando `agim graph` chamado) |
| npm install no bootstrap | Cache `~/.npm`; `prefer-offline` |

---

## 6. ANÁLISE DE TESTABILIDADE (EIXO 5)

### Testes Necessários (Novos)

| Script | Testes Unitários | Testes Integração |
|--------|------------------|-------------------|
| `bootstrap-detect.cjs` | 10+ cases (stacks variados) | Projeto vazio + existente |
| `bootstrap-init.cjs` | Mock fs, valida arquivos | Projeto vazio → AGENTS.md criado |
| `bootstrap-validate.cjs` | Mock validações | Projeto completo → PASS |
| `sync-agents-md.cjs` | Diff logic, template render | AGENTS.md ↔ config.json |
| `agim-cli.cjs` | Command parsing | E2E: `agim init` → validação PASS |

### Coverage Alvo

| Métrica | Alvo |
|---------|------|
| Lines | ≥80% |
| Branches | ≥70% |
| Functions | ≥80% |
| Scripts críticos | 100% |

---

## 7. PLANO DE EXECUÇÃO (ETAPAS)

| # | Etapa | Objetivo | Depende | Critério Aceitação | Status |
|---|-------|----------|---------|-------------------|--------|
| 1 | `bootstrap-detect.cjs` | Detecta stack (package.json, files) | - | 10+ stacks detectados, 0 false positives | NÃO INICIADA |
| 2 | `bootstrap-init.cjs` | Cria AGENTS.md, memoria/, RAG init | 1 | Projeto vazio → AGENTS.md válido, memoria/ 6 arquivos | NÃO INICIADA |
| 3 | `bootstrap-validate.cjs` | Validação final (5 checks) | 2 | 71/71 + 0 links + 11 exemplos + security + secrets | NÃO INICIADA |
| 4 | `agim-cli.cjs` | Entry point `agim <cmd>` | 1,2,3 | `agim init` → validação PASS | NÃO INICIADA |
| 5 | `.agim/config.json` schema | Single source of truth | 2 | Zod schema valida; sync bidirecional | NÃO INICIADA |
| 6 | `sync-agents-md.cjs` | AGENTS.md ↔ config.json | 5 | Diff = 0 após sync | NÃO INICIADA |
| 7 | Symlink core + fallback | Core imutável | 2 | Windows + Unix; fallback cópia | NÃO INICIADA |
| 8 | Docs progressivas (4 camadas) | Progressive disclosure | - | QUICKSTART <5min; links funcionais | NÃO INICIADA |
| 9 | Testes scripts críticos | Coverage ≥80% | 1-7 | `npm test scripts/` → PASS | NÃO INICIADA |
| 10 | CI pipeline + onboarding test | Validação automática | 1-9 | `agim init` em CI limpo → PASS | NÃO INICIADA |

### Dependências Críticas

```
1 → 2 → 3 → 4
    ↘ 5 → 6
    ↘ 7
         ↘ 8
              ↘ 9 → 10
```

---

## 8. RISCOS E MITIGAÇÕES

| Risco | Prob | Impacto | Mitigação | Contingência |
|-------|------|---------|-----------|--------------|
| **Symlink Windows falha** | Média | Alto | Detecta no bootstrap; usa junction/cópia | Documenta fallback; CI testa Windows |
| **Bootstrap não idempotente** | Baixa | Alto | Scripts puros (sem side effects globais) | Testes de re-entrada (roda 3x) |
| **Config drift não detectado** | Alta | Médio | `agim sync` no bootstrap + CI | `agim doctor` alerta drift |
| **Symlink permissão negada** | Baixa | Médio | Try-catch no bootstrap; fallback cópia | Log claro; docs troubleshooting |
| **Complexidade oculta no CLI** | Média | Médio | CLI = wrapper fino; lógica em scripts testáveis | Code review obrigatório |
| **RAG rebuild lento no bootstrap** | Média | Baixo | Flag `--skip-rag`; rebuild assíncrono | Docs: como rebuild manual |

---

## 9. DECISÕES TÉCNICAS (ADRs Necessários)

| ADR | Título | Status |
|-----|--------|--------|
| ADR-016 | Core linkage via symlink vs copy | PROPOSTA |
| ADR-017 | Config single source: `.agim/config.json` + Zod | PROPOSTA |
| ADR-018 | Bootstrap em 3 scripts idempotentes + CLI | PROPOSTA |
| ADR-019 | Progressive disclosure docs (4 camadas) | PROPOSTA |
| ADR-020 | Symlink Windows: junction + fallback copy | PROPOSTA |

---

## 10. PRÓXIMOS PASSOS ACIONÁVEIS

### Imediato (Esta Semana)
1. **Criar ADRs** para decisões acima (registrar em `memoria/DECISOES.md`)
2. **Implementar `bootstrap-detect.cjs`** - detecta stack via package.json + files
3. **Testar symlink Windows** - criar junction, testar fallback

### Próxima Semana
4. **Implementar `bootstrap-init.cjs`** - cria AGENTS.md a partir de template + config detectada
5. **Implementar `bootstrap-validate.cjs`** - reusa validações existentes
6. **Criar `agim-cli.cjs`** - wrapper `agim <cmd>`

### Em 2 Semanas
7. **Config schema (Zod)** - `.agim/config.json` + `sync-agents-md.cjs`
8. **Symlink core** - `.agim/core -> ~/.agent-bible/` + fallback
8. **Docs progressivas** - QUICKSTART, CONFIGURATION, ARCHITECTURE, TROUBLESHOOTING

---

## 11. EVIDENCIAS NECESSÁRIAS PARA APROVAÇÃO

| Validação | Comando | Evidência Esperada |
|-----------|---------|-------------------|
| Detecta stack | `node scripts/bootstrap-detect.cjs` | JSON com stack detectado |
| Bootstrap init | `node scripts/bootstrap-init.cjs` | AGENTS.md criado, memoria/ 6 arquivos |
| Validação completa | `node scripts/bootstrap-validate.cjs` | 71/71 + 0 links + 11 ex + security |
| CLI funciona | `agim init` | Output completo + validação PASS |
| Symlink core | `ls -la .agim/core` | Symlink → ~/.agent-bible |
| Sync config | `agim sync` | AGENTS.md = config.json renderizado |
| Idempotência | Rodar 3x bootstrap | Mesmo resultado, 0 erros |
| Onboarding test | CI limpo + `agim init` | <5min, validação PASS |

---

## 12. REGISTRO DE VALIDAÇÃO

**Validator:** AGIM (verification-before-completion + code-review-and-quality + planejamento-de-tarefas)
**Data:** 2026-10-28
**Status:** **APROVADO COM RESSALVAS**

### ✅ Aprovado (Pontos Fortes)
- Arquitetura em 4 camadas resolve progressive disclosure
- Symlink core elimina divergência core↔projeto
- Config única (JSON + Zod) = single source of truth
- Bootstrap idempotente em 3 scripts testáveis
- Progressive disclosure docs = usabilidade real
- CLI unificado = discoverability

### ⚠️ Requer Atenção (Bloqueantes para Merge)
1. **ADRs formais** devem ser criados e registrados antes de implementar
2. **Teste Windows symlink** obrigatório antes de merge (CI matrix)
3. **Testes de idempotência** (rodar 3x) obrigatórios para cada script bootstrap
4. **Fallback copy** documentado e testado para symlink failure
8. **Config drift detection** no bootstrap + CI obrigatório

### 🟡 Melhorias (Pós-MVP)
- `agim doctor` diagnóstico completo
- `agim update` com version check
- Telemetria opcional (opt-in) para métricas de uso

---

## 12. REGISTRO EM MEMÓRIA

**Arquivo:** `memoria/HISTORICO-DE-EXECUCAO.md`
**Entrada:** VALIDACAO-2026-10-28-USABILIDADE-4-CAMADAS
**Status:** APROVADO COM RESSALVAS
**Próxima Ação:** Criar ADRs formais → Implementar bootstrap-detect.cjs