# Template REGISTRO-INCIDENTE.md - Registro de Incidente

> Copie este arquivo para `docs/INCIDENTE-[NUMERO]-[DATA].md` e preencha.
> Use para registrar incidentes de seguranca, bugs criticos, falhas de deploy, etc.

---

# Registro de Incidente: INC-[NUMERO] - [TITULO RESUMIDO]

---

## 1. INFORMAÇÕES BÁSICAS

| Campo | Valor |
|-------|-------|
| **ID Incidente** | INC-[NUMERO] |
| **Titulo** | [Titulo resumido - ex: "Vazamento dados usuarios API v1"] |
| **Severidade** | `SEV-1 (Critico)` | `SEV-2 (Alto)` | `SEV-3 (Medio)` | `SEV-4 (Baixo)` |
| **Status** | `Aberto` | `Em Investigacao` | `Em Resolucao` | `Resolvido` | `Fechado` |
| **Detectado Em** | YYYY-MM-DD HH:MM:SS (TZ) |
| **Detectado Por** | [Monitoramento/Usuario/Suporte/Seguranca/Outro] |
| **Responsavel Atual** | [Nome/Equipe] |
| **Comunicado A** | [Stakeholders notificados: Tech Lead, PO, Security, Gerencia, Clientes] |

---

## 2. DESCRIÇÃO DO INCIDENTE

### Resumo
[Descreva o que aconteceu em 2-3 frases. O que falhou? Qual o impacto?]

### Impacto
| Dimensao | Impacto | Detalhes |
|----------|---------|----------|
| **Usuarios Afetados** | [Numero/%] | [Quais usuarios: todos, segmento, regiao] |
| **Funcionalidades** | [Lista] | [Quais features/fluxos quebrados] |
| **Dados** | [Comprometidos/Integridade/Disponibilidade] | [Tipos dados: PII, financeiros, credenciais] |
| **Receita/Negocio** | [Estimativa] | [Perda estimada, SLA violado] |
| **Reputacao/Compliance** | [Risco LGPD/PCI/Reputacao] | [Notificacoes necessarias] |

### Cronologia (Timeline)
| Data/Hora (TZ) | Evento | Responsavel | Observacoes |
|----------------|--------|-------------|-------------|
| YYYY-MM-DD HH:MM | Incidente detectado | [Quem/Como] | [Detalhes] |
| YYYY-MM-DD HH:MM | Investigacao iniciada | [Quem] | [Ferramentas/logs] |
| YYYY-MM-DD HH:MM | Causa raiz identificada | [Quem] | [Descricao causa] |
| YYYY-MM-DD HH:MM | Fix/Workaround aplicado | [Quem] | [O que foi feito] |
| YYYY-MM-DD HH:MM | Validacao pos-fix | [Quem] | [Testes/Monitoramento] |
| YYYY-MM-DD HH:MM | Incidente resolvido/fechado | [Quem] | [Confirmacao] |

---

## 3. ANÁLISE DE CAUSA RAIZ (RCA)

### Causa Raiz (5 Porquês)
1. **Por que aconteceu?** [Resposta]
2. **Por que isso ocorreu?** [Resposta]
3. **Por que isso ocorreu?** [Resposta]
4. **Por que isso ocorreu?** [Resposta]
5. **Por que isso ocorreu?** [Causa Raiz Final]

### Fatores Contribuintes
| Fator | Descricao | Categoria |
|-------|-----------|-----------|
| [Fator 1] | [Descricao] | [Codigo/Processo/Infra/Pessoas/Externo] |
| [Fator 2] | [Descricao] | [Categoria] |

### Falhas nas Defesas (Swiss Cheese Model)
| Camada Defesa | Falhou? | Por Que? | Melhoria Necessaria |
|---------------|---------|----------|---------------------|
| Prevencao (Code Review, Testes, Lint) | [Sim/Nao] | [Por que nao pegou] | [Melhoria] |
| Detecao (Monitoramento, Alertas) | [Sim/Nao] | [Por que atrasou] | [Melhoria] |
| Resposta (Runbook, Rollback) | [Sim/Nao] | [Por que demorou] | [Melhoria] |
| Recuperacao (Rollback, Restore) | [Sim/Nao] | [Por que dificil] | [Melhoria] |

---

## 4. AÇÕES DE RESPOSTA E RESOLUÇÃO

### Acoes Imediatas (Contencao)
| Acao | Responsavel | Inicio | Fim | Status | Evidencia |
|------|-------------|--------|-----|--------|-----------|
| [Acao 1: ex: Rollback deploy] | [Nome] | HH:MM | HH:MM | [Concluido/Parcial] | [Link log/commit] |
| [Acao 2: ex: Revogar tokens] | [Nome] | HH:MM | HH:MM | [Concluido] | [Link] |
| [Acao 3: ex: Bloquear IP/Conta] | [Nome] | HH:MM | HH:MM | [Concluido] | [Link] |

### Correcao Definitiva (Fix Permanente)
| Acao | Responsavel | Prazo | Status | Commit/PR | Testes Validacao |
|------|-------------|-------|--------|-----------|------------------|
| [Fix 1: ex: Patch validacao] | [Nome] | YYYY-MM-DD | [Em andamento/Concluido] | [Link PR] | [Testes] |
| [Fix 2: ex: Patch configuracao] | [Nome] | YYYY-MM-DD | [Planejado] | [Link PR] | [Testes] |

### Workarounds Temporarios (se houver)
| Workaround | Descricao | Riscos | Data Remocao Prevista |
|------------|-----------|--------|----------------------|
| [Descricao] | [Como funciona] | [Riscos residuais] | YYYY-MM-DD |

---

## 5. IMPACTO E MÉTRICAS

### Metricas do Incidente
| Metrica | Valor | Baseline | Desvio |
|---------|-------|----------|--------|
| Duracao Total | [HH:MM] | [Meta: < 30min SEV-1] | [+/-] |
| Tempo Deteccao (MTTD) | [Minutos] | [Meta: < 5min] | [+/-] |
| Tempo Resposta (MTTR) | [Minutos] | [Meta: < 30min SEV-1] | [+/-] |
| Usuarios Afetados | [Numero/%] | [Baseline] | [%] |
| Receita Impactada | [Valor] | [Baseline] | [%] |
| SLA Violado | [Sim/Nao] | [Qual SLA] | [Detalhes] |

### Custos
| Categoria | Custo Estimado | Detalhes |
|-----------|----------------|----------|
| Receita Perdida | [Valor] | [Calculo] |
| Esforco Engenharia | [Horas x Custo/hora] | [Horas x Equipe] |
| Penalidades/Contratuais | [Valor] | [Contratos/SLAs] |
| Reputacao/Compliance | [Qualitativo] | [LGPD/PCI/Reputacao] |

---

## 6. AÇÕES PREVENTIVAS (CAPA - Corrective and Preventive Actions)

### Acoes Corretivas (Fix da Causa Raiz)
| Acao | Responsavel | Prazo | Status | Verificacao Eficacia |
|------|-------------|-------|--------|----------------------|
| [Acao 1: ex: Adicionar validacao X] | [Nome] | YYYY-MM-DD | [Planejado/Em andamento/Concluido] | [Teste/Metrica] |
| [Acao 2: ex: Adicionar teste Y] | [Nome] | YYYY-MM-DD | [Planejado] | [Teste] |

### Acoes Preventivas (Evitar Recorrencia)
| Acao | Responsavel | Prazo | Status | Como Medir Eficacia |
|------|-------------|-------|--------|---------------------|
| [Prevencao 1: ex: Adicionar teste E2E cenario X] | [Nome] | YYYY-MM-DD | [Planejado] | [Teste passa em CI] |
| [Prevencao 2: ex: Adicionar alerta metrica Y] | [Nome] | YYYY-MM-DD | [Planejado] | [Alerta dispara] |
| [Prevencao 3: ex: Atualizar runbook/documentacao] | [Nome] | YYYY-MM-DD | [Planejado] | [Doc atualizada] |
| [Prevencao 4: ex: Treinamento equipe] | [Nome] | YYYY-MM-DD | [Planejado] | [Realizado] |

### Melhorias de Processo/Tooling
| Melhoria | Responsavel | Prazo | Status |
|----------|-------------|-------|--------|
| [Melhoria 1: ex: Adicionar alerta latencia p95] | [Nome] | YYYY-MM-DD | [Planejado] |
| [Melhoria 2: ex: Automatizar rollback < 5 min] | [Nome] | YYYY-MM-DD | [Planejado] |
| [Melhoria 3: ex: Adicionar chaos engineering] | [Nome] | YYYY-MM-DD | [Planejado] |

---

## 7. COMUNICAÇÃO E NOTIFICAÇÕES

### Interno
| Publico | Canal | Mensagem Chave | Enviado Por | Data/Hora |
|---------|-------|----------------|-------------|-----------|
| Equipe Engenharia | Slack #incidents | "INC-XXX detectado - Impacto: [X] - Status: [Investigando]" | [Nome] | HH:MM |
| Tech Lead / Gerencia | Slack/Email | "INC-XXX - Severidade [SEV-X] - Impacto: [X] - ETA resolucao: [HH:MM]" | [Nome] | HH:MM |
| Security/Compliance | Email/Slack | "INC-XXX - Possivel impacto dados/seguranca - Acionando protocolo" | [Nome] | HH:MM |
| Suporte/CS | Slack/Internal Tool | "Incidente ativo INC-XXX - Sintomas: [X] - Workaround: [Y]" | [Nome] | HH:MM |

### Externo (se aplicavel)
| Publico | Canal | Mensagem | Enviado Por | Data/Hora | Regulatorio |
|---------|-------|----------|-------------|-----------|-------------|
| Clientes Afetados | Email/In-app/Statuspage | "Estamos cientes de [problema] - Investigando - ETA: [HH:MM]" | [Nome] | HH:MM | [Sim/Nao] |
| Autoridades (LGPD/ANPD) | Email/Oficial | "Notificacao incidente seguranca dados - Conforme Art. 48 LGPD" | [DPO/Legal] | HH:MM | [Sim - se dados pessoais vazados] |
| Parceiros/Integracoes | Email/API | "Incidente API - Impacto: [X] - Workaround: [Y]" | [Nome] | HH:MM | [Se necessario] |

### Comunicacao Pos-Incidente (Pos-Mortem)
- [ ] **Post-Mortem Interno** agendado: [Data] - Participantes: [Lista]
- [ ] **Relatorio Post-Mortem** escrito: [Link] - Publicado: [Data]
- [ ] **Compartilhado com**: [Equipe/Stakeholders/Cliente] - Data: [Data]
- [ ] **Acoes Preventivas** registradas em `memoria/PENDENCIAS.md` e `docs/DECISOES-TECNICAS.md`

---

## 8. LIÇÕES APRENDIDAS

### O Que Funcionou Bem
- [Ponto positivo 1: ex: "Monitoramento detectou em 2 min"]
- [Ponto positivo 2: ex: "Rollback funcionou em 3 min"]
- [Ponto positivo 3: ex: "Comunicacao clara entre equipe"]

### O Que Poderia Ser Melhor
- [Melhoria 1: ex: "Deteccao levou 15 min - alerta nao disparou"]
- [Melhoria 2: ex: "Runbook desatualizado - passos manuais necessarios"]
- [Melhoria 3: ex: "Comunicacao clientes atrasada - template nao pronto"]

### Surpresas/Descobertas
- [Descoberta 1: ex: "Bug introdito ha 3 meses, so manifestou agora com carga"]
- [Descoberta 2: ex: "Dependencia transitive vulneravel nao detectada pelo npm audit"]

---

## 9. AÇÕES DE ACOMPANHAMENTO (Follow-up)

| Acao | Responsavel | Prazo | Status | Criterio Conclusao |
|------|-------------|-------|--------|-------------------|
| [Acao 1: Post-mortem interno agendado] | [Nome] | YYYY-MM-DD | [Agendado/Concluido] | Reuniao realizada + ata |
| [Acao 2: Atualizar runbook INC-XXX] | [Nome] | YYYY-MM-DD | [Pendente] | Doc atualizada + revisada |
| [Acao 3: Treinamento equipe cenario X] | [Nome] | YYYY-MM-DD | [Planejado] | Presenca + Feedback |
| [Acao 4: Revisar alertas/metricas] | [Nome] | YYYY-MM-DD | [Planejado] | Alertas testados |
| [Acao 5: Atualizar documentacao cliente/statuspage] | [Nome] | YYYY-MM-DD | [Planejado] | Publicado |

---

## 9. ANEXOS E EVIDÊNCIAS

| Anexo | Descricao | Localizacao |
|-------|-----------|-------------|
| Logs relevantes (trechos) | [Logs filtrados periodo incidente] | `logs/incident-INC-[NUMERO]-[DATA].log` |
| Screenshots dashboards/monitoramento | [Graficos latencia, error rate, CPU, memoria] | `evidence/incident-INC-[NUMERO]-[DATA]/` |
| Diff commits/PRs relacionados | [Links GitHub/GitLab] | `PR #[numero]` / `commit [sha]` |
| Logs deploy/rollback | [Pipeline logs] | `CI/CD logs` |
| Comunicacoes (Slack/Email threads) | [Links/Exports] | `evidence/incident-INC-[NUMERO]-[DATA]/communications/` |
| Relatorio RCA detalhado (se separado) | [Analise profunda] | `docs/RCA-INC-[NUMERO]-[DATA].md` |

---

## 9. ASSINATURAS E FECHAMENTO

```
Investigador Principal: _________________________ | Data: ___________
Tech Lead: _________________________ | Data: ___________
Security Champion: _________________________ | Data: ___________
Product Owner: _________________________ | Data: ___________
Gerente (se SEV-1/2): _________________________ | Data: ___________

**Incidente Fechado Em:** YYYY-MM-DD HH:MM:SS (TZ)
**Proxima Revisao (se aplicavel):** YYYY-MM-DD
```