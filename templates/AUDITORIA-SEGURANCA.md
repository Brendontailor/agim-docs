# Template AUDITORIA-SEGURANCA.md - Relatório de Auditoria de Segurança

> Copie este arquivo para `docs/AUDITORIA-SEGURANCA-[PROJETO]-[DATA].md` e preencha.
> Use para documentar resultados de auditoria de segurança.

---

# Relatório de Auditoria de Segurança: [PROJETO] - [DATA]

---

## 1. INFORMAÇÕES GERAIS

| Campo | Valor |
|-------|-------|
| **Projeto** | [Nome] |
| **Versão Auditada** | [Tag/Commit/SHA] |
| **Ambiente** | [Local/Staging/Producao] |
| **Tipo Auditoria** | [Completa | Auth | API | Infra | Deps] |
| **Auditor(es)** | [Nomes] |
| **Data Inicio** | YYYY-MM-DD |
| **Data Conclusao** | YYYY-MM-DD |
| **Ferramentas** | npm audit, grep, inspeção manual, Context7, Playwright |

---

## 2. SUMÁRIO EXECUTIVO

| Metrica | Valor |
|---------|-------|
| **Total Achados** | [X] |
| **Critico** | [Y] |
| **Alto** | [Z] |
| **Medio** | [W] |
| **Baixo** | [V] |
| **Informativo** | [U] |

**Riscos Criticos Nao Mitigados**: [Lista - bloqueiam deploy se houver]

**Conformidade Geral**: [Aprovado | Condicional | Reprovado]

---

## 3. ACHADOS POR CATEGORIA

### 3.1 Autenticação e Autorização

| ID | Achado | Severidade | Arquivo:Linha | Evidencia | Mitigacao | Status |
|----|--------|------------|---------------|-----------|-----------|--------|
| AUTH-001 | [Descricao] | Critico/Alto/Medio/Baixo | `arquivo.ts:123` | [Trecho codigo/log] | [Acao corretiva] | [Aberto/Mitigado/Aceito] |
| AUTH-002 | [Descricao] | ... | ... | ... | ... | ... |

**Resumo Auth/AuthZ**: [Resumo do estado geral - ex: "Middleware autorizar presente em 100% rotas protegidas, RBAC granular implementado, IDOR prevention ativo"]

### 3.2 Validação e Sanitização de Entrada

| ID | Achado | Severidade | Arquivo:Linha | Evidencia | Mitigacao | Status |
|----|--------|------------|---------------|-----------|-----------|--------|
| VAL-001 | [Descricao] | ... | ... | ... | ... | ... |

**Resumo Validacao**: [Resumo - ex: "Zod schemas em 100% endpoints, sanitização DOMPurify em outputs HTML, reject extra fields ativo"]

### 3.3 Proteção Contra Ataques Específicos

| Vetor | Status | Evidencia | Observacoes |
|-------|--------|-----------|-------------|
| SQL Injection | [OK/Risco] | [Prisma only / raw queries found] | [Detalhes] |
| XSS | [OK/Risco] | [Zod + DOMPurify / CSP] | [Detalhes] |
| CSRF | [OK/Risco] | [SameSite + Double-submit] | [Detalhes] |
| SSRF | [OK/Risco] | [Allowlist fetch / Nao] | [Detalhes] |
| Path Traversal | [OK/Risco] | [Path validation] | [Detalhes] |
| Prototype Pollution | [OK/Risco] | [Object.freeze / Validation] | [Detalhes] |
| File Upload | [OK/Risco] | [MIME magic bytes + sanitizacao] | [Detalhes] |

### 3.4 Proteção da Aplicação

| Camada | Status | Configuracao | Observacoes |
|--------|--------|--------------|-------------|
| Rate Limiting Auth | [OK/Parcial/Falta] | 5 tent/15min IP+conta | [Detalhes] |
| Rate Limiting API | [OK/Parcial/Falta] | 100req/min IP | [Detalhes] |
| CORS | [OK/Parcial/Falta] | Allowlist explicita | [Detalhes] |
| Headers Segurança (Helmet) | [OK/Parcial/Falta] | CSP, HSTS, X-Frame, etc | [Detalhes] |
| TLS | [OK/Parcial/Falta] | TLS 1.3, cert valido | [Detalhes] |
| Error Handling | [OK/Parcial/Falta] | Sem stack trace prod | [Detalhes] |
| Logging | [OK/Parcial/Falta] | Structured + sanitizado | [Detalhes] |

### 3.5 Gestão de Segredos e Configuração

| Item | Status | Evidencia | Observacoes |
|------|--------|-----------|-------------|
| `.env` no `.gitignore` | [Sim/Nao] | `git check-ignore .env` | |
| `.env.example` no Git | [Sim/Nao] | Valores ficticios | |
| Validação startup (Zod) | [Sim/Nao] | Fail fast implementado | |
| Segredos no frontend (`VITE_*`) | [Zero/Encontrados] | Build analysis | |
| Chaves JWT (RS256) | [Sim/Nao] | Chaves assimetricas | |
| Rotação segredos documentada | [Sim/Nao] | Cronograma + procedimento | |
| Secrets em logs | [Zero/Encontrados] | Sanitizacao Pino/Winston | |

### 3.6 Banco de Dados (PostgreSQL + Prisma)

| Item | Status | Observacoes |
|------|--------|-------------|
| Usuario DB dedicado (`app_user`) | [Sim/Nao] | Nao superuser |
| Permissoes minimas (grants) | [Sim/Nao] | SELECT/INSERT/UPDATE/DELETE apenas tabelas app |
| Soft delete (`deletedAt`) | [Sim/Nao] | Tabelas sensiveis |
| Constraints (`@unique`, `@relation`, `@@index`) | [Sim/Nao] | Completas |
| Transacoes (`$transaction`) | [Sim/Nao] | Operacoes multi-tabela |
| Migracoes versionadas | [Sim/Nao] | No Git, revisadas pre-deploy |
| Backup automatico + PITR >= 7d | [Sim/Nao] | Provedor/Config |
| Teste restore mensal | [Sim/Nao] | Documentado |
| Criptografia (repouso + transito) | [Sim/Nao] | AES-256 + TLS 1.3 |

### 3.7 Dependências e Supply Chain

| Item | Status | Evidencia | Observacoes |
|------|--------|-----------|-------------|
| `npm audit --audit-level=high` | [Pass/Fail] | [X high, Y critical] | |
| Dependabot/Renovate | [Configurado/Nao] | PRs automaticos | |
| `package-lock.json` commitado | [Sim/Nao] | Lockfile versionado | |
| Auditoria mensal manual | [Sim/Nao] | `npm outdated` + CHANGELOG review | |
| Pacotes suspeitos revisados | [Sim/Nao] | Mantenedores, downloads, ultima atualizacao | |

### 3.8 Infraestrutura e Deploy

| Item | Status | Observacoes |
|------|--------|-------------|
| Variaveis producao validadas | [Sim/Nao] | Separadas dev/staging |
| Segredos CI/CD (GitHub Secrets/Vercel/Doppler) | [Sim/Nao] | Nao no codigo |
| Deploy: Preview auto + aprovacao manual prod | [Sim/Nao] | |
| Rollback documentado + testado (< 5 min) | [Sim/Nao] | |
| Monitoramento alertas: 5xx, auth failures, rate limit, latency | [Configurado/Nao] | |
| Logs agregados (JSON, retencao >= 1 ano seg) | [Sim/Nao] | |

---

## 4. MATRIZ DE RISCOS CONSOLIDADA

| ID | Risco | Severidade | Impacto | Evidencia (arquivo:linha) | Mitigacao | Status |
|----|-------|------------|---------|---------------------------|-----------|--------|
| R01 | [Descricao] | Critico | [Alto/Medio/Baixo] | `arquivo.ts:123` | [Mitigacao] | [Aberto/Mitigado/Aceito] |
| R02 | ... | ... | ... | ... | ... | ... |

**Legenda Status**: `ABERTO` = Requer acao | `MITIGADO` = Controle implementado e verificado | `ACEITO` = Risco residual aceito com justificativa | `FALSO POSITIVO` = Verificado como nao aplicavel

---

## 5. RECOMENDAÇÕES PRIORIZADAS

### Imediato (Criticos - Bloqueiam Deploy)
1. **[Risco ID]**: [Descricao] - **Acao**: [Acao imediata] - **Prazo**: Imediato - **Responsavel**: [Nome]

### Esta Sprint (Altos)
1. **[Risco ID]**: [Descricao] - **Acao**: [Acao] - **Prazo**: [Data] - **Responsavel**: [Nome]

### Backlog (Medios/Baixos)
1. **[Risco ID]**: [Descricao] - **Acao**: [Acao] - **Prazo**: [Proxima sprint/Mes] - **Responsavel**: [Nome]

---

## 6. CONFORMIDADE E COMPLIANCE

| Norma/Regulamento | Status | Evidencia | Proxima Revisao |
|-------------------|--------|-----------|-----------------|
| LGPD (Lei 13.709) | [Conforme/Parcial/Nao] | [DPO nomeado, consentimento, direito exclusao, DPIA se necessario] | [Data] |
| PCI-DSS (se pagamentos) | [Conforme/Parcial/Nao/NA] | [SAQ/ROC, ASV scan, pentest anual] | [Data] |
| OWASP Top 10 2023 | [Conforme/Parcial] | [Mapeamento controles vs Top 10] | [Data] |
| ISO 27001 (se aplicavel) | [Conforme/Parcial/NA] | [Controles implementados] | [Data] |

---

## 7. PLANO DE AÇÃO PÓS-AUDITORIA

| Acao | Responsavel | Prazo | Criterio Conclusao | Status |
|------|-------------|-------|-------------------|--------|
| [Acao 1 - Critico] | [Nome] | [Data] | [Criterio] | [ ] |
| [Acao 2 - Alto] | [Nome] | [Data] | [Criterio] | [ ] |
| [Acao 3 - Medio] | [Nome] | [Data] | [Criterio] | [ ] |

**Proxima Auditoria Agendada**: [Data - sugerido trimestral/semestral]

---

## 8. ANEXOS

| Anexo | Descricao | Localizacao |
|-------|-----------|-------------|
| `checklists/SEGURANCA.md` preenchido | Checklist executavel completo | `checklists/SEGURANCA.md` |
| Relatorio `npm audit` (JSON) | `test-results/security-audit-[timestamp].json` | `test-results/` |
| Relatorio `grep`/busca padroes inseguros | Logs busca | `test-results/security-grep-[timestamp].log` |
| Relatorio `npm outdated` | Dependencias desatualizadas | `test-results/outdated-[timestamp].log` |
| Relatorio OWASP ZAP (se executado) | DAST report | `test-results/zap-[timestamp].html` |
| Screenshots/evidencias Playwright | E2E security tests | `test-results/e2e-security-[timestamp]/` |

---

## 8. ASSINATURA

```
Auditor Principal: _________________________ | Data: ___________
Revisor Tecnico: _________________________ | Data: ___________
Aprovador (Tech Lead/Security): _________________________ | Data: ___________
```