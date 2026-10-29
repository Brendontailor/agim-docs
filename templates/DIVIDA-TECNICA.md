# Template DIVIDA-TECNICA.md - Registro de Divida Tecnica

> Copie este arquivo para `docs/DIVIDA-TECNICA-[NUMERO]-[DESCRICAO].md` e preencha.
> Use para registrar, priorizar e acompanhar dividas tecnicas.

---

# Divida Tecnica: DT-[NUMERO] - [TITULO DESCRITIVO]

---

## 1. INFORMAÇÕES BÁSICAS

| Campo | Valor |
|-------|-------|
| **ID** | DT-[NUMERO] |
| **Titulo** | [Titulo descritivo - ex: "Refatorar Service Usuarios: God Class com 800 linhas"] |
| **Categoria** | `Codigo` | `Arquitetura` | `Testes` | `Documentacao` | `Infra` | `Seguranca` | `Performance` | `Dependencias` |
| **Severidade** | `Critica` | `Alta` | `Media` | `Baixa` |
| **Status** | `Identificada` | `Priorizada` | `Em Andamento` | `Em Revisao` | `Resolvida` | `Wont Fix` |
| **Identificada Em** | YYYY-MM-DD |
| **Identificada Por** | [Nome/Equipe] |
| **Responsavel Atual** | [Nome/Equipe] |
| **Area/Modulo** | [ex: backend/src/services/usuarios.service.ts] |
| **Relacionada A** | [Issue #, PR #, ADR-XXX, INC-XXX, Feature] |

---

## 2. DESCRIÇÃO

### O Que É
[Descreva claramente o que é a divida tecnica. O que existe hoje que nao deveria?]

### Por Que Existe (Causa Raiz)
[Explique como chegou aqui: pressao prazo, falta conhecimento, mudanca requisitos, heranca legado, etc.]

### Impacto Atual
| Dimensao | Impacto | Detalhes |
|----------|---------|----------|
| **Manutenibilidade** | [Critico/Alto/Medio/Baixo] | [Dificuldade mudar, bugs recorrentes, onboarding dificil] |
| **Performance** | [Critico/Alto/Medio/Baixo] | [Latencia, memoria, CPU, queries lentas] |
| **Seguranca** | [Critico/Alto/Medio/Baixo] | [Vulnerabilidades, anti-patterns inseguros] |
| **Escalabilidade** | [Critico/Alto/Medio/Baixo] | [Limites arquiteturais, gargalos] |
| **Onboarding/Produtividade** | [Critico/Alto/Medio/Baixo] | [Tempo novo dev, tempo mudancas, bugs regressao] |
| **Confiabilidade** | [Critico/Alto/Medio/Baixo] | [Falhas recorrentes, flakiness, debugging dificil] |

### Custo Estimado da Divida
| Metrica | Valor Atual | Projetado Se Nao Resolvido (6 meses) | Custo Resolucao Estimado |
|---------|-------------|--------------------------------------|--------------------------|
| Tempo Desenvolvimento (horas/sprint) | [X h/sprint] | [Y h/sprint] | [Z h] |
| Bugs Recorrentes (qtd/mes) | [X] | [Y] | - |
| Tempo Debugging (horas/incidente) | [X h] | [Y h] | - |
| Onboarding Novo Dev (dias) | [X dias] | [Y dias] | - |
| Riscos Seguranca/Compliance | [Qualitativo] | [Critico/Alto] | - |

---

## 3. CONTEXTO TECNICO

### Codigo/Arquitetura Atual
```typescript
// Exemplo do codigo problematico (trecho representativo)
// Arquivo: caminho/para/arquivo.ts
// Linhas: XX-YY

// Codigo problematico aqui...
```

### Dependencias e Acoplamentos
| Componente | Tipo Acoplamento | Impacto Se Mudar |
|------------|------------------|------------------|
| [Modulo A] | [Forte/Medio/Fraco] | [Alto/Medio/Baixo] |
| [Modulo B] | [Forte/Medio/Fraco] | [Alto/Medio/Baixo] |
| [Biblioteca Externa X] | [Versao fixa/Desatualizada] | [Alto/Medio/Baixo] |

### Testes Atuais
| Tipo | Cobertura | Qualidade | Flakiness |
|------|-----------|-----------|-----------|
| Unitarios | [X%] | [Boa/Media/Ruim] | [Sim/Nao] |
| Integracao | [X%] | [Boa/Media/Ruim] | [Sim/Nao] |
| E2E | [X%] | [Boa/Media/Ruim] | [Sim/Nao] |

---

## 4. SOLUÇÃO PROPOSTA

### Objetivo da Refatoracao
[Descreva o estado desejado apos a refatoracao. O que muda?]

### Estrategia
| Opcao | Descricao | Esforco (dias) | Risco | Impacto Positivo | Decisao |
|-------|-----------|----------------|-------|------------------|---------|
| **Refatoracao Incremental** | [Pequenas mudancas incrementais com feature flags] | [X] | Baixo | Melhoria continua, baixo risco | [ ] |
| **Refatoracao Completa (Big Bang)** | [Reescrita completa do modulo] | [X] | Alto | Limpeza total, mas risco regressao | [ ] |
| **Strangler Fig Pattern** | [Criar novo paralelo, migrar gradualmente] | [X] | Medio | Migracao segura, zero downtime | [ ] |
| **Wrapper/Adapter** | [Criar camada abstraçao, migrar internamente] | [X] | Baixo | Isola mudancas, facilita testes | [ ] |
| **Wont Fix / Aceitar** | [Manter como esta, monitorar] | 0 | N/A | Nenhum (aceita custo) | [ ] |

**Opcao Escolhida**: [Opcao] - **Justificativa**: [Por que esta opcao]

### Plano de Refatoracao (Se Incremental/Strangler Fig)

| Fase | Entregavel | Criterio Conclusao | Esforco | Responsavel | Prazo | Status |
|------|------------|-------------------|---------|-------------|-------|--------|
| 1 | [Ex: Criar interface/service novo paralelo] | [Testes passam, feature flag off] | [X dias] | [Quem] | YYYY-MM-DD | [ ] |
| 2 | [Ex: Migrar 20% chamadas - feature flag 20%] | [Testes passam, metrics OK] | [X dias] | [Quem] | YYYY-MM-DD | [ ] |
| 3 | [Ex: Migrar 50% - feature flag 50%] | [Testes passam, metrics OK] | [X dias] | [Quem] | YYYY-MM-DD | [ ] |
| 4 | [Ex: Migrar 100% - remover codigo antigo] | [Testes passam, zero referencias antigo] | [X dias] | [Quem] | YYYY-MM-DD | [ ] |
| 5 | [Limpeza: remover feature flags, codigo morto, docs] | [Build verde, 0 referencias] | [X dias] | [Quem] | YYYY-MM-DD | [ ] |

### Riscos da Refatoracao
| Risco | Probabilidade | Impacto | Mitigacao | Contingencia |
|-------|---------------|---------|-----------|--------------|
| Regressao funcionalidade critica | [Alta/Media/Baixa] | Critico | Testes automatizados completos + feature flags + rollback rapido | Rollback imediato via feature flag |
| Quebra contratos API | [Alta/Media/Baixa] | Alto | Contratos tipados + testes contrato + versionamento API | Versionamento API (/v1, /v2) |
| Performance degrada | [Alta/Media/Baixa] | Alto | Benchmarks antes/depois + load test staging | Rollback + investigacao |
| Quebra dependencias downstream | [Alta/Media/Baixa] | Alto | Comunicacao antecedente + versao API + migracao guiada | Suporte versao anterior temporario |
| Introducao novos bugs | [Alta/Media/Baixa] | Medio | TDD + code review rigoroso + staging validation | Hotfix rapido + rollback |
| Tempo excedido / Scope creep | [Alta/Media/Baixa] | Medio | Timeboxing fases + checkpoints semanais | Reavaliar escopo / Wont Fix |

---

## 4. PLANO DE TESTES E VALIDACAO

### Testes Necessarios Para Validar Refatoracao
| Tipo | Cenarios | Ferramenta | Criterio Sucesso |
|------|----------|------------|------------------|
| Unitarios | [Novos/Atualizados] | Vitest | 100% pass, cobertura >= 85% |
| Integracao | [Endpoints afetados] | Vitest + Supertest | 100% pass |
| E2E Criticos | [Fluxos afetados] | Playwright | 100% pass |
| Regressao | [Suite completa] | Vitest + Playwright | 100% pass |
| Performance | [Benchmarks antes/depois] | k6 | p95 <= baseline + 5% |
| Carga | [Carga esperada + 50%] | k6 | Error rate < 0.1% |

### Critérios de Aceitação da Refatoracao
- [ ] Todos testes passam (Unit + Int + E2E)
- [ ] Cobertura mantida/acima thresholds (80/70/80/80)
- [ ] Performance <= baseline + 5% (p95, p99, throughput)
- [ ] Zero regressoes funcionais (E2E criticos passam)
- [ ] Build + TypeCheck + Lint + Audit passam
- [ ] Documentacao atualizada (README, ADR, CHANGELOG)
- [ ] Code review aprovado (`revisao-final` skill -> APROVAR)

---

## 5. PLANO DE EXECUÇÃO E CRONOGRAMA

### Marcos (Milestones)
| Marco | Entregavel | Data Alvo | Status | Dependencias |
|-------|------------|-----------|--------|--------------|
| M1: Planejamento + Setup | [Plano detalhado, feature flags, testes base] | YYYY-MM-DD | [ ] | [Dependencias] |
| M2: Fase 1 - [Entregavel 1] | [Codigo + Testes + Feature Flag] | YYYY-MM-DD | [ ] | M1 |
| M3: Fase 2 - [Entregavel 2] | [Codigo + Testes + Migracao 50%] | YYYY-MM-DD | [ ] | M2 |
| M4: Fase 3 - [Entregavel 3] | [Migracao 100% + Cleanup] | YYYY-MM-DD | [ ] | M3 |
| M4: Validacao + Deploy | [Staging validado, PO aprova, Deploy prod] | YYYY-MM-DD | [ ] | M4 |

### Recursos Necessarios
| Recurso | Quantidade | Disponibilidade | Observacoes |
|---------|------------|-----------------|-------------|
| Devs Senior | [X] | [Disponivel/Parcial/Indisponivel] | [Observacoes] |
| Devs Pleno | [X] | [Disponivel/Parcial/Indisponivel] | |
| QA | [X] | [Disponivel/Parcial/Indisponivel] | |
| DevOps/Infra | [X] | [Disponivel/Parcial/Indisponivel] | |
| Code Reviewers | [X] | [Disponivel/Parcial/Indisponivel] | |

### Budget Estimado
| Categoria | Estimativa (Horas) | Custo Estimado | Observacoes |
|-----------|-------------------|----------------|-------------|
| Desenvolvimento | [X h] | [$] | |
| QA/Testes | [X h] | [$] | |
| Code Review | [X h] | [$] | |
| DevOps/Infra | [X h] | [$] | |
| Buffer (20%) | [X h] | [$] | |
| **Total** | **[X h]** | **[$]** | |

---

## 5. PRIORIZAÇÃO E ESCORE

### Matriz de Priorizacao (ICE/RICE)
| Fator | Score (1-10) | Peso | Score Final |
|-------|--------------|------|-------------|
| **Impact** (Impacto negocio/usuario) | [1-10] | 30% | [Score] |
| **Confidence** (Certeza estimativas) | [1-10] | 20% | [Score] |
| **Ease** (Facilidade implementacao) | [1-10] | 20% | [Score] |
| **Risk Reduction** (Reducao risco tecnico) | [1-10] | 30% | [Score] |
| **TOTAL ICE/RICE** | | **100%** | **[Score Final]** |

### Prioridade Final
| Prioridade | Classificacao | Score Range |
|------------|---------------|-------------|
| **P0 - Imediato** | Bloqueia releases/seguranca critica | Score >= 8.5 |
| **P1 - Proxima Sprint** | Alto impacto, risco alto | 7.0 - 8.4 |
| **P2 - Proximo Mes** | Medio impacto, risco medio | 5.0 - 6.9 |
| **P3 - Backlog** | Baixo impacto, nice to have | < 5.0 |

**Prioridade Atribuida**: `P0` | `P1` | `P2` | `P3` | `Wont Fix`

---

## 6. ACOMPANHAMENTO E GOVERNANÇA

### Checkpoints de Acompanhamento
| Checkpoint | Frequencia | Participantes | Artefatos |
|------------|------------|---------------|-----------|
| Daily Standup (se ativo) | Diario | Devs + Tech Lead | Progresso, blockers |
| Weekly Sync | Semanal | Tech Lead + Devs + QA | Progresso, riscos, metrics |
| Sprint Review (se em sprint) | Por Sprint | Tech Lead + PO + Devs | Demo, metrics, retro |
| Monthly Review | Mensal | Tech Lead + Arquitetura | Tech debt trends, metrics |
| Quarterly Planning | Trimestral | Lideranca + Tech Leads | Portfolio divida, priorizacao |

### Metricas de Acompanhamento
| Metrica | Frequencia | Target | Alerta Se |
|-----------|------------|--------|-----------|
| Divida Tecnica Total (horas) | Semanal | Decrescente | Cresce 2 sprints consecutivas |
| Divida Critica/Alta (horas) | Semanal | 0 | > 0 por 2 sprints |
| Tempo Gasto Refatoracao / Sprint | Sprint | 15-20% capacidade | < 10% ou > 30% |
| Bugs Recorrentes (mesmo modulo) | Mensal | 0 | > 2/mes mesmo modulo |
| Cobertura Testes Modulo Afetado | Sprint | >= 80% | Cai abaixo 70% |
| Tech Debt Ratio (Divida / Código Novo) | Mensal | < 0.2 | > 0.3 |

---

## 6. COMUNICAÇÃO E REPORTES

### Relatórios Periódicos
| Relatório | Frequencia | Publico | Formato | Responsavel |
|-----------|------------|---------|---------|-------------|
| Tech Debt Dashboard | Tempo Real | Tech Leads + Lideranca | Dashboard (Grafana/Datadog) | DevOps |
| Weekly Tech Debt Summary | Semanal | Tech Leads + Devs | Slack/Email | Tech Lead |
| Monthly Tech Debt Report | Mensal | Lideranca + Tech Leads | PDF/Confluence | Tech Lead |
| Quarterly Tech Debt Review | Trimestral | Lideranca + Tech Leads | Apresentacao + Decisoes | Tech Lead + Arquitetura |

### Comunicação de Mudanças
| Evento | Canal | Publico | Timing |
|--------|-------|---------|--------|
| Nova divida critica identificada | Slack #tech-debt + Email | Tech Leads + Arquitetura | Imediato |
| Inicio refatoracao P0/P1 | Slack #releases + Standup | Equipe + Stakeholders | Inicio |
| Conclusao refatoracao | Slack #releases + Demo | Todos | Conclusao |
| Wont Fix / Aceitacao risco | Slack #tech-debt + ADR | Tech Leads + Arquitetura | Decisao |

---

## 7. HISTÓRICO E AUDITORIA

### Log de Mudanças
| Data | Autor | Mudanca | Motivo |
|-------|-------|---------|--------|
| YYYY-MM-DD | [Nome] | Criacao registro | Identificacao inicial |
| YYYY-MM-DD | [Nome] | Priorizacao P1 | [Motivo] |
| YYYY-MM-DD | [Nome] | Inicio refatoracao Fase 1 | Inicio execucao |
| YYYY-MM-DD | [Nome] | Conclusao Fase 1 | Validada |
| YYYY-MM-DD | [Nome] | [Mudanca] | [Motivo] |

### Decisões Relacionadas (ADRs)
| ADR | Titulo | Status | Relacao |
|-----|--------|--------|---------|
| ADR-XXX | [Titulo] | [Aceita/Substituida] | [Relacao] |
| ADR-YYY | [Titulo] | [Aceita] | [Relacao] |

---

## 8. APROVAÇÃO E GOVERNANÇA

| Papel | Nome | Decisao | Data | Observacoes |
|-------|------|---------|------|-------------|
| Tech Lead | | [Aprovar/Rejeitar/Devolver] | YYYY-MM-DD | |
| Arquiteto (se arquitetural) | | [Aprovar/Rejeitar] | YYYY-MM-DD | |
| Product Owner (se impacto produto) | | [Aprovar/Rejeitar] | YYYY-MM-DD | |
| Security Champion (se seguranca) | | [Aprovar/Rejeitar] | YYYY-MM-DD | |
| Gerencia (se budget/recursos) | | [Aprovar/Rejeitar] | YYYY-MM-DD | |

---

## 9. FECHAMENTO (Quando Resolvida)

### Validacao Final
- [ ] Refatoracao completa: codigo antigo removido, feature flags removidas
- [ ] Testes: 100% pass (Unit + Int + E2E criticos)
- [ ] Cobertura: mantida/acima thresholds
- [ ] Performance: <= baseline + 5%
- [ ] Zero regressoes: E2E criticos passam
- [ ] Build + TypeCheck + Lint + Audit: PASS
- [ ] Documentacao: README, ADR, CHANGELOG atualizados
- [ ] Code Review: `revisao-final` -> APROVAR
- [ ] Deploy: Staging validado + PO aprova + Producao deployed
- [ ] Monitoramento pos-deploy: 24h OK, 7 dias OK

### Metricas Pos-Resolucao
| Metrica | Antes | Depois | Variacao |
|---------|-------|--------|----------|
| Complexidade Ciclomatica (media) | [X] | [Y] | [%] |
| Linhas Codigo (modulo) | [X] | [Y] | [%] |
| Acoplamento (afferent/efferent) | [X] | [Y] | [%] |
| Tempo Medio Mudanca (horas) | [X] | [Y] | [%] |
| Bugs Recorrentes (mes) | [X] | [Y] | [%] |
| Onboarding Novo Dev (dias) | [X] | [Y] | [%] |

### Lições Aprendidas
- [Licao 1: O que funcionou bem no processo]
- [Licao 2: O que faria diferente na proxima]
- [Licao 3: Descoberta tecnica importante]

### Arquivamento
- [ ] Registro movido para `docs/DIVIDA-TECNICA-RESOLVIDA/[NUMERO]-[DESCRICAO].md`
- [ ] Removido de dashboards ativos / backlog ativo
- [ ] Metricas atualizadas em dashboard tech debt
- [ ] Lições documentadas em `memoria/DECISOES.md` e `docs/DECISOES-TECNICAS.md`

---

## ASSINATURA DE FECHAMENTO

```
Tech Lead: _________________________ | Data: ___________
Product Owner: _________________________ | Data: ___________
Arquiteto (se aplicavel): _________________________ | Data: ___________
QA Lead: _________________________ | Data: ___________

**Divida Tecnica Resolvida Em:** YYYY-MM-DD
**Proxima Auditoria Tech Debt:** YYYY-MM-DD (Trimestral)
```