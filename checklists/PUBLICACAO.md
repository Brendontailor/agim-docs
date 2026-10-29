# Checklist de Publicacao - Deploy e Release

> Use para validar deploy em staging/producao e release de versao. Marque `[x]` quando verificado, `[~]` se parcialmente atendido (registre observacao), `[ ]` se nao aplicavel.

---

## Contexto do Deploy

### Informacoes Basicas
- [ ] Tipo: `staging` | `producao` | `release` | `hotfix` | `rollback`
- [ ] Versao: ___________ (ex: v1.2.0)
- [ ] Tag Git: ___________ (ex: v1.2.0)
- [ ] Branch: ___________ (main | release/* | hotfix/*)
- [ ] Autor/Responsavel: ___________
- [ ] Janela de deploy: ___________ (data/hora, timezone)
- [ ] Aprovadores: ___________ (Tech Lead, PO, Security se critico)

### Pre-requisitos Obrigatorios
- [ ] Checklist `ENTREGA.md` **APROVADO** (funcionalidade completa, testada, documentada)
- [ ] `revisao-final` skill executada -> **APROVAR** (quality gate passou)
- [ ] `auditoria-de-seguranca` executada (escopo completa) -> **APROVADO**
- [ ] `testes-com-roteiro` executado (escopo all) -> **100% APROVADO**
- [ ] `npm audit --audit-level=high` -> **0 high/critical**
- [ ] `npm run build` -> **sucesso** (frontend + backend)
- [ ] `npm run typecheck` + `lint` + `test` -> **0 erros**
- [ ] Tag Git criada e assinada: `git tag -a v1.2.0 -m "Release v1.2.0"`

---

## 1. PREPARACAO DE AMBIENTE

### Variaveis e Secrets
- [ ] Variaveis producao validadas (separadas de dev/staging)
- [ ] `.env.production` / secrets CI/CD configurados (GitHub Secrets / Vercel Env / Doppler)
- [ ] **NENHUM** segredo no codigo ou repositorio
- [ ] `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` producao (diferentes de dev/staging)
- [ ] `DATABASE_URL` producao (pool configurado, SSL mode=require)
- [ ] `CORS_ORIGIN` producao (allowlist explicita, nao `*`)
- [ ] `RATE_LIMIT_MAX`/`WINDOW_MS` ajustados para carga esperada
- [ ] `ARGON2_*` parametros producao (memoryCost=19456, timeCost=2, parallelism=1)
- [ ] `NODE_ENV=production` configurado

### Infraestrutura
- [ ] Kubernetes/ECS/VM/Vercel/Render configurado para versao
- [ ] Health check endpoint implementado (`GET /health` -> 200 + checks DB/Redis)
- [ ] Readiness probe configurado (para K8s/ECS)
- [ ] Recursos alocados: CPU/Memoria adequados (baseado em load testing)
- [ ] Autoscaling configurado (se K8s/ECS) - min/max replicas, metrics
- [ ] CDN/Static assets: cache headers (Cache-Control, ETag), compressao (gzip/brotli)
- [ ] SSL/TLS: certificado valido (expiracao > 30 dias), TLS 1.3, HSTS preload
- [ ] DNS propagado (se nova subdominio/dominio)

### Banco de Dados
- [ ] Migracoes revisadas (`npx prisma migrate diff` + `migrate deploy`)
- [ ] Backup pre-deploy realizado (`pg_dump` / snapshot RDS/Neon)
- [ ] PITR habilitado (>= 7 dias)
- [ ] Migracao testada em staging (dados representativos)
- [ ] Rollback DB planejado (`down` migration ou restore snapshot)
- [ ] Conexao pooling configurado (PgBouncer/Prisma pool, max 20 conexoes)

---

## 2. ESTRATEGIA DE DEPLOY

### Estrategia Escolhida
- [ ] **Blue/Green**: Duas ambientes identicos, switch DNS/Load Balancer
- [ ] **Rolling Update**: Substituicao gradual (K8s Deployment / ECS Rolling)
- [ ] **Canary**: % pequeno trafego -> gradual -> 100% (feature flags)
- [ ] **Recreate**: Parar antiga -> subir nova (apenas se downtime aceitavel)

### Configuracao da Estrategia
- [ ] Zero-downtime garantido (health checks + readiness probes)
- [ ] Max surge/unavailable configurados (K8s: maxSurge=25%, maxUnavailable=0)
- [ ] Graceful shutdown: SIGTERM handling (finish requests, fechar conexoes DB)
- [ ] Drain connections: fechar pool Prisma/Redis antes de matar pod
- [ ] Timeout deploy: maximo 10 min (rollback automatico se exceder)

### Feature Flags (se canary/gradual)
- [ ] Flags configuradas (LaunchDarkly/Unleash/custom)
- [ ] Rollout plan: 5% -> 25% -> 50% -> 100% (intervalos 10-15 min)
- [ ] Metricas por variante monitoradas (error rate, latency, business metrics)
- [ ] Kill switch: desabilitar flag instantaneo se problema

---

## 3. VALIDACAO PRE-DEPLOY (Staging/Preview)

### Deploy Preview/Staging
- [ ] Deploy automatico em PR (Vercel/Netlify/Render/Cloudflare Pages)
- [ ] Staging deployado com tag/versao candidata
- [ ] Smoke tests staging: health, login, fluxo critico 1, fluxo critico 2
- [ ] Testes E2E completos staging (`npm run test:e2e -- --project=staging`)
- [ ] Testes performance staging (k6 baseline comparado)
- [ ] Testes seguranca staging (npm audit, OWASP ZAP se configurado)
- [ ] Validacao visual (Chromatic/Percy) - sem regressoes visuais
- [ ] Aprovacao manual stakeholder (PO/Tech Lead) em staging

### Validacao de Dados
- [ ] Migracoes aplicadas com sucesso em staging
- [ ] Dados seed/teste carregados corretamente
- [ ] Integridade referencial verificada (FKs, constraints)
- [ ] Dados sensiveis nao vazados (logs, API responses, frontend)

---

## 4. DEPLOY PRODUCAO

### Execucao do Deploy
- [ ] Janela de deploy aprovada (horario baixo trafego, equipe disponivel)
- [ ] Comunicacao stakeholders: "Deploy iniciado v[X.Y.Z] - ETA X min"
- [ ] Deploy iniciado (CI/CD pipeline / manual aprovado)
- [ ] Monitoramento ativo durante deploy (logs CI/CD, metricas infra)
- [ ] Health checks passando durante rollout
- [ ] Rollout completo (100% trafego na nova versao)

### Validacao Pos-Deploy Imediata (Primeiros 15 min)
- [ ] Health check: `GET /health` -> 200 OK (inclui DB, Redis, dependencies)
- [ ] Login funcional: admin + user comum
- [ ] Fluxo critico 1: _______________________________ -> OK
- [ ] Fluxo critico 2: _______________________________ -> OK
- [ ] APIs principais: latencia p95 < baseline + 10%
- [ ] Frontend carrega: sem erros console (exceto esperados), Core Web Vitals OK
- [ ] Certificados TLS: validos, securityheaders.com scan A+
- [ ] Headers seguranca: CSP, HSTS, X-Frame-Options, Referrer-Policy presentes
- [ ] Logs estruturados chegando ao agregador (Datadog/ELK/CloudWatch/Grafana)

### Monitoramento Primeiras 2 Horas
- [ ] Error rate < 0.1% (baseline + 10%)
- [ ] Latencia p95 < baseline + 10%
- [ ] Throughput dentro do esperado (+/- 20%)
- [ ] Zero alertas criticos: 5xx spike, auth failures, rate limit hits, latency p95
- [ ] Zero alertas seguranca (auth failures anormais, rate limit abusos)
- [ ] Logs estruturados chegando corretamente (JSON, sem PII/secrets)
- [ ] Business metrics normais (conversao, receita, usuarios ativos)

---

## 5. POS-DEPLOY (Primeiras 24-48h)

### Monitoramento Estendido
- [ ] Error rate < 0.1% sustentado
- [ ] Latencia p95 < baseline + 5%
- [ ] Zero memory leaks (memoria estavel / GC normal)
- [ ] Zero connection leaks (pool DB/Redis estavel)
- [ ] Disco/CPU/Memoria dentro limites (alertas < 80%)
- [ ] Backups executados normalmente (verificar logs backup)
- [ ] Certificados TLS monitorados (expiracao > 30 dias)

### Feedback e Incidentes
- [ ] Zero incidentes severos (SEV-1/SEV-2)
- [ ] Feedback usuarios/suporte: zero relatos criticos
- [ ] Performance business metrics normal (conversao, receita, churn)
- [ ] Logs de auditoria seguranca normais (sem tentativas anormais)

### Documentacao Pos-Deploy
- [ ] `CHANGELOG.md` publicado com tag
- [ ] Release notes publicadas (user-facing + technical)
- [ ] `memoria/ESTADO-ATUAL.md` atualizado (fase: POS-DEPLOY, versao deployed)
- [ ] `memoria/HISTORICO-DE-EXECUCAO.md` registrado (deploy, evidencias)
- [ ] `memoria/DECISOES.md` atualizado (decisoes deploy)
- [ ] Runbook atualizado se mudancas operacionais

---

## 6. ROLLBACK PLAN (Obrigatorio ter pronto ANTES do deploy)

### Gatilhos de Rollback (Qualquer UM dispara)
- [ ] Error rate > 1% (ou > 5x baseline)
- [ ] Latencia p95 > 2x baseline (sustentado 5 min)
- [ ] Funcionalidade critica quebrada (login, checkout, pagamento)
- [ ] Seguranca: vulnerabilidade ativa exploravel
- [ ] Dados: corrupcao/perda detectada
- [ ] Infraestrutura: OOM kills, disk full, disk pressure

### Procedimento Rollback
- [ ] Comando rollback documentado e testado:
  - Git: `git revert <tag> && deploy` OU `git checkout <previous-tag> && deploy`
  - Docker: `docker service update --image app:previous-tag`
  - K8s: `kubectl rollout undo deployment/app`
  - Vercel/Netlify: `vercel rollback` / `netlify rollback`
- [ ] Rollback DB: `npx prisma migrate down` OU restore snapshot/backup
- [ ] Tempo maximo rollback: **< 5 minutos** (testado)
- [ ] Comunicacao rollback: template pronto (Slack/email stakeholders)
- [ ] Validação pos-rollback: health check + fluxo critico OK

### Comunicacao Rollback
- [ ] Template mensagem: "ROLLBACK v[X.Y.Z] iniciado - Motivo: [X] - ETA 5 min - Status: [EM ANDAMENTO/CONCLUIDO/FALHOU]"
- [ ] Canal: #deploy-alerts (Slack) + email stakeholders
- [ ] Post-mortem agendado (max 48h apos rollback)

---

## 6. COMUNICACAO E DOCUMENTACAO POS-RELEASE

### Release Notes
- [ ] Release notes publicadas (GitHub Releases / Blog / Email)
- [ ] Formato: User-facing (novas features, melhorias, fixes) + Technical (breaking changes, migracoes, deps)
- [ ] Breaking changes destacados com **BREAKING** + migracao guide
- [ ] Links para issues/PRs relacionados
- [ ] Agradecimentos contributors (se open source)

### Comunicacao Stakeholders
- [ ] Email/Slack: "Release v[X.Y.Z] deployado com sucesso - Resumo: [X features, Y fixes, Z security]"
- [ ] Stakeholders tecnicos: detalhes tecnicos, breaking changes, migracoes
- [ ] Suporte/CS: novas features, mudancas UX, known issues
- [ ] Vendas/Marketing: features visiveis usuarios, screenshots/videos

### Documentacao Tecnica
- [ ] `CHANGELOG.md` atualizado (Conventional Commits)
- [ ] `README.md` atualizado se mudancas setup/config
- [ ] `docs/ARQUITETURA.md` atualizado se mudanca arquitetural
- [ ] `docs/DECISOES-TECNICAS.md` (ADR) se decisao arquitetural
- [ ] Runbook operacional atualizado (health checks, logs, troubleshooting, contatos)
- [ ] Diagramas arquitetura atualizados (se mudanca significativa)

---

## 7. MONITORAMENTO CONTINUO (Pos-Release 7 Dias)

### Metricas Criticas
- [ ] Error rate < 0.1% (7 dias)
- [ ] Latencia p95 < baseline + 5% (7 dias)
- [ ] Uptime > 99.9% (7 dias)
- [ ] Zero SEV-1/SEV-2 incidents (7 dias)
- [ ] Business metrics: conversao, receita, retention dentro normal

### Seguranca Continua
- [ ] `npm audit` semanal (0 high/critical)
- [ ] Dependabot PRs revisados/merged semanalmente
- [ ] Logs auditoria: zero tentativas bruteforce bem-sucedidas
- [ ] Certificados TLS: expiracao > 30 dias (alertas 60/30/7 dias)

### Performance Continua
- [ ] Lighthouse CI semanal (Performance > 90, Accessibility > 95)
- [ ] Bundle size monitoring (alert se > 10% aumento)
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 8. DECISAO DE PUBLICACAO

| Decisao | Criterio |
|---------|----------|
| **PUBLICAR** | Todos `[x]`, staging validado, rollback testado, comunicacao pronta, monitoramento ativo |
| **CONDICIONAL** | Itens `[~]` com mitigacao + prazo acordado, stakeholder ciente, rollback plan validado |
| **ADIAR** | Qualquer `[ ]` critico, staging falhou, rollback nao testado, stakeholder nao disponivel, janela expirada |

---

## RELATORIO DE PUBLICACAO

```
# Relatorio de Publicacao: v[X.Y.Z] - [Data]

**Tipo:** [Staging | Producao | Release | Hotfix | Rollback]
**Tag:** v[X.Y.Z] | **Commit:** [sha] | **Branch:** [main/release/*]
**Janela:** [inicio] - [fim] | **Duracao:** [X min]
**Responsavel:** [nome] | **Aprovadores:** [nomes]

## Checklist Critico
- [ ] ENTREGA.md APROVADO
- [ ] REVISAO-FINAL APROVADO
- [ ] AUDITORIA SEGURANCA APROVADA
- [ ] TESTES 100% PASS
- [ ] BUILD SUCESSO
- [ ] STAGING VALIDADO
- [ ] ROLLBACK TESTADO
- [ ] MONITORAMENTO ATIVO

## Deploy
- Estrategia: [Blue/Green | Rolling | Canary | Recreate]
- Inicio: [timestamp] | Fim: [timestamp] | Duracao: [X min]
- Rollback necessario: [NAO | SIM - motivo: ___________]

## Validacao Pos-Deploy
- Health check: OK
- Login: OK
- Fluxos criticos: OK
- Latencia p95: [Xms] (baseline: [Yms])
- Error rate: [X%]
- Alertas criticos: 0

## Monitoramento (Proximas 24h)
- Responsavel plantao: [nome/contato]
- Alertas configurados: OK
- Dashboards: [links]
- Runbook: [link]

## Comunicacao
- Release notes: [link]
- Stakeholders notificados: OK
- Suporte avisado: OK

## Aprovacao Final
**Tech Lead:** _________________________ | Data: ___________
**Product Owner:** _________________________ | Data: ___________
**Security (se critico):** _________________________ | Data: ___________
**Ops/Infra:** _________________________ | Data: ___________
```