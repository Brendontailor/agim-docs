# Template PLANO-TESTES.md - Estrategia de Testes do Projeto

> Copie este arquivo para `docs/PLANO-TESTES-[MODULO].md` e preencha.
> Use junto com `docs/TESTES.md` (referencia tecnica) e `checklists/TESTES.md` (execucao).

---

# Plano de Testes: [NOME DO PROJETO/MODULO]

> [DESCRICAO CURTA - o que este plano cobre e o que fica fora]

**Versao**: [1.0]
**Data**: [YYYY-MM-DD]
**Responsavel**: [Nome]
**Ambiente alvo**: [local / staging / producao]

---

## 1. ESCOPO

### Dentro do escopo
- [Modulo/fluxo 1]
- [Modulo/fluxo 2]
- [Integracao externa X]

### Fora do escopo
- [Item 1] - motivo: [motivo]
- [Item 2] - motivo: [motivo]

### Riscos que justificam a priorizacao
| Risco | Impacto se falhar | Prioridade de teste |
|-------|-------------------|---------------------|
| [Ex.: login quebrado] | [Bloqueia todo o produto] | Critica |
| [Ex.: relatorio incorreto] | [Decisao errada do usuario] | Alta |

---

## 2. ESTRATEGIA

### Piramide adotada
| Nivel | Quantidade alvo | Ferramenta | Tempo maximo |
|-------|-----------------|------------|--------------|
| Unitarios | [%] | Vitest | [< 30s] |
| Integracao | [%] | Vitest + Supertest | [< 2min] |
| E2E | [%] | Playwright | [< 10min] |

### Criterios de entrada (quando comecar a testar)
- [ ] Build compila sem erro (`tsc --noEmit`)
- [ ] Lint sem erros bloqueantes
- [ ] Banco de teste disponivel e migrado
- [ ] Massa de dados/factories prontas

### Criterios de saida (quando considerar testado)
- [ ] 100% dos cenarios criticos APROVADOS
- [ ] Cobertura de linhas >= [80%]
- [ ] Cobertura de branches >= [70%]
- [ ] Zero falhas de seguranca conhecidas (auth, authZ, validacao)
- [ ] Zero violacoes axe (WCAG 2.1 AA) nos fluxos criticos

---

## 3. AMBIENTES E DADOS

| Ambiente | URL/Comando | Banco | Observacoes |
|----------|-------------|-------|-------------|
| Local | [comando] | [PostgreSQL local/Docker] | [obs] |
| CI | [workflow] | [servico efemero] | [obs] |
| Staging | [URL] | [Neon/branch] | [obs] |

### Dados de teste
- **Estrategia**: [factories / seed / fixtures]
- **Isolamento**: [transacao com rollback por teste]
- **Proibido**: dados reais de producao, PII, credenciais reais

---

## 4. MATRIZ DE CENARIOS

> ID: `CT-[MODULO]-[NNN]`. Prioridade: Critica / Alta / Media / Baixa.
> Status: NAO EXECUTADO / APROVADO / REPROVADO / BLOQUEADO.

### 4.1 Autenticacao
| ID | Cenario | Entrada | Resultado esperado | Tipo | Prioridade | Status |
|----|---------|---------|--------------------|------|------------|--------|
| CT-AUTH-001 | Login valido | email+senha corretos | 200 + token | Integracao | Critica | NAO EXECUTADO |
| CT-AUTH-002 | Senha invalida | senha errada | 401, sem revelar qual campo | Integracao | Critica | NAO EXECUTADO |
| CT-AUTH-003 | Token expirado | token vencido | 401 + codigo de expiracao | Integracao | Critica | NAO EXECUTADO |
| CT-AUTH-004 | Rate limit | N tentativas seguidas | 429 apos limite | Integracao | Alta | NAO EXECUTADO |

### 4.2 Autorizacao
| ID | Cenario | Entrada | Resultado esperado | Tipo | Prioridade | Status |
|----|---------|---------|--------------------|------|------------|--------|
| CT-AUTHZ-001 | Acesso sem permissao | usuario comum -> recurso admin | 403 | Integracao | Critica | NAO EXECUTADO |
| CT-AUTHZ-002 | Acesso a recurso de outro usuario | ID alheio | 403/404 sem vazar existencia | Integracao | Critica | NAO EXECUTADO |

### 4.3 Validacao de entrada
| ID | Cenario | Entrada | Resultado esperado | Tipo | Prioridade | Status |
|----|---------|---------|--------------------|------|------------|--------|
| CT-VAL-001 | Campo obrigatorio ausente | payload incompleto | 400 + detalhe por campo | Unitario | Alta | NAO EXECUTADO |
| CT-VAL-002 | Tipo incorreto | string onde espera numero | 400 | Unitario | Alta | NAO EXECUTADO |
| CT-VAL-003 | Payload malicioso | script/HTML | sanitizado/rejeitado | Integracao | Critica | NAO EXECUTADO |

### 4.4 CRUD e regras de negocio
| ID | Cenario | Entrada | Resultado esperado | Tipo | Prioridade | Status |
|----|---------|---------|--------------------|------|------------|--------|
| CT-CRUD-001 | Criar recurso valido | payload valido | 201 + registro persistido | Integracao | Alta | NAO EXECUTADO |
| CT-CRUD-002 | Ler recurso inexistente | ID inexistente | 404 | Integracao | Media | NAO EXECUTADO |
| CT-CRUD-003 | Atualizar parcial | payload parcial | 200 + campos preservados | Integracao | Alta | NAO EXECUTADO |
| CT-CRUD-004 | Remover e confirmar | ID existente | 204 + ausencia confirmada | Integracao | Alta | NAO EXECUTADO |

### 4.5 Falhas e resiliencia
| ID | Cenario | Entrada | Resultado esperado | Tipo | Prioridade | Status |
|----|---------|---------|--------------------|------|------------|--------|
| CT-FAIL-001 | Banco indisponivel | DB offline | 503, log com contexto, sem stack trace exposta | Integracao | Critica | NAO EXECUTADO |
| CT-FAIL-002 | Timeout de dependencia externa | latencia > limite | fallback/erro tratado | Integracao | Alta | NAO EXECUTADO |
| CT-FAIL-003 | Excecao inesperada | erro simulado | 500 generico + log correlacionado | Unitario | Alta | NAO EXECUTADO |

### 4.6 Interface e acessibilidade
| ID | Cenario | Entrada | Resultado esperado | Tipo | Prioridade | Status |
|----|---------|---------|--------------------|------|------------|--------|
| CT-UI-001 | Fluxo critico ponta a ponta | usuario real | fluxo conclui sem erro | E2E | Critica | NAO EXECUTADO |
| CT-UI-002 | Navegacao por teclado | Tab/Enter/Esc | foco visivel e ordem logica | E2E | Alta | NAO EXECUTADO |
| CT-UI-003 | Leitor de tela | axe-core | 0 violacoes serias | E2E | Alta | NAO EXECUTADO |
| CT-UI-004 | Responsividade | 320px / 768px / 1440px | sem overflow ou corte | E2E | Media | NAO EXECUTADO |

### 4.7 Performance e seguranca
| ID | Cenario | Metrica | Limite | Tipo | Prioridade | Status |
|----|---------|---------|--------|------|------------|--------|
| CT-PERF-001 | Carga no endpoint principal | p95 | [< 200ms] | k6 | Alta | NAO EXECUTADO |
| CT-PERF-002 | Core Web Vitals | LCP | [< 2.5s] | Lighthouse | Alta | NAO EXECUTADO |
| CT-SEC-001 | Dependencias vulneraveis | audit | 0 criticas | npm audit | Critica | NAO EXECUTADO |
| CT-SEC-002 | Headers de seguranca | CSP, HSTS, X-Content-Type | todos presentes | Integracao | Alta | NAO EXECUTADO |

---

## 5. AUTOMACAO

| Suite | Comando | Quando roda | Bloqueia merge |
|-------|---------|-------------|----------------|
| Unitarios | `npm test` | todo commit | Sim |
| Integracao | `npm run test:integration` | todo PR | Sim |
| E2E | `npm run test:e2e` | PR para main / nightly | Sim (fluxos criticos) |
| A11y | `npm run test:a11y` | PR para main | Nao (alerta) |
| Performance | `npm run test:perf` | nightly | Nao (alerta) |
| Seguranca | `npm audit --audit-level=high` | diario | Sim |

---

## 6. EVIDENCIAS E RELATORIO

Para cada execucao registrar:
| Campo | Conteudo |
|-------|----------|
| Data/hora | [ISO 8601] |
| Commit | [hash] |
| Ambiente | [local/CI/staging] |
| Total executado | [N] |
| Aprovados / Reprovados / Bloqueados | [N/N/N] |
| Falhas | [ID + resumo + link do log] |
| Decisao | [Liberar / Corrigir / Reexecutar] |

---

## 7. PENDENCIAS DE TESTE

| ID | Pendencia | Impacto | Responsavel | Prazo |
|----|-----------|---------|-------------|-------|
| PT-001 | [Ex.: falta teste de concorrencia] | [Risco de race condition] | [Nome] | [Data] |

---

## 8. CHECKLIST FINAL

- [ ] Escopo e riscos definidos
- [ ] Criterios de entrada e saida acordados
- [ ] Cenarios criticos cobrem auth, authZ, validacao e falhas
- [ ] Suite roda no CI e bloqueia merge quando necessario
- [ ] Evidencias registradas com commit e ambiente
- [ ] Pendencias registradas em `memoria/PENDENCIAS.md`
- [ ] Falhas corrigidas ou aceitas formalmente
