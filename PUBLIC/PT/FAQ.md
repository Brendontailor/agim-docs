# FAQ — AGIM

> Perguntas frequentes, troubleshooting e decisões de design.

---

## Geral

### O que é o AGIM?
**AGIM (Agent Grimoire)** é um motor de orquestração para agentes de IA. Transforma documentação de melhores práticas em **execução automatizada** via skills. Não é só docs — é um grimório executável.

### Para que serve?
- Padroniza arquitetura (9 camadas backend + 6 frontend)
- Força quality gates (testes, build, lint, type-check, audit)
- Garante continuidade entre sessões (`memoria/` 6 arquivos)
- Automatiza segurança (matriz 15 riscos + `agim audit`)
- Acelera onboarding (1–2 dias vs 1–2 semanas)

### É um framework?
**Não**. É um **kit de orquestração** que você instala no seu projeto (`agim init`). Não roda em produção — roda no desenvolvimento para gerar código, validar, auditar.

### Qual stack suporta?
**Primária**: Node.js 18+ / TypeScript / Express / React / Prisma / PostgreSQL  
**Templates prontos**: Express + React, FastAPI + Vue, Gin + React  
**Outras**: Funciona para qualquer stack, mas skills/arquitetura são otimizadas para TS/Node/React.

---

## Instalação e Setup

### Precisa instalar globalmente?
```bash
# Recomendado (comando `agim` disponível sempre)
npm install -g agim-orchestrator

# Ou execução única (sem instalar)
npx agim-orchestrator init
```

### O que `agim init` cria?
```
meu-projeto/
├── AGENTS.md                  # Regras (bloco AGIM + suas notas)
├── .agim/
│   ├── config.json            # Configuração (fonte única)
│   └── core → ~/.agent-bible  # Kit global compartilhado (symlink)
├── memoria/                   # Estado persistente (6 arquivos)
├── docs/                      # Arquitetura, segurança, testes
├── checklists/                # 9 checklists obrigatórios
├── templates/                 # 12 templates (planos, ADRs, auditorias)
├── exemplos/                  # Implementação de referência
└── .opencode/skills/          # 15 skills operacionais
```

### Posso usar em projeto existente?
**Sim**. `agim init` detecta stack existente, adiciona kit AGIM sem sobrescrever seu código. Cria `memoria/` para começar rastreamento.

---

## Uso Diário

### Qual o comando principal?
```bash
agim auto "Sua feature ou bugfix"
# Exemplo: agim auto "Nova API de pagamentos com idempotência"
```

### O que `agim auto` faz?
1. Detecta stack → instala/repara kit
2. `agim sync` — Sincroniza AGENTS.md
3. `agim doctor` — Diagnóstico completo
4. `agim interview` — Classifica + planeja
5. `agim validate` — Quality gate paralelo (testes, build, lint, type-check, audit)
6. Registra tudo em `memoria/`

### Como retomar depois?
```bash
cd meu-projeto
agim status           # Vê onde parou
agim auto "continua"  # Retoma automaticamente
# O AGIM lê memoria/ e continua exatamente onde parou
```

---

## Skills e Orquestração

### O que são skills?
Unidades de capacidade operacional (14 total: 12 core + 2 extended). Cada skill tem: objetivo, quando usar, pré-condições, passos, validação, saída.

### Preciso invocar skills manualmente?
**Não**. A `entrevista-orquestradora` (sempre a primeira) decide quais skills ativar baseado no seu objetivo. Você só diz: `"Nova feature: blog com markdown"`.

### Posso invocar skill específica?
**Sim**, se precisar:
```bash
skill auditoria-de-seguranca
skill testes-com-roteiro
skill analise-de-legado
# etc.
```

---

## Qualidade e Segurança

### O quality gate é opcional?
**Não**. `verification-before-completion` é **obrigatório** e bloqueia "pronto" se qualquer item falhar:
- Testes (unit + int + e2e) passando
- Build sem erros
- TypeScript 0 erros (strict)
- Lint 0 warnings/errors
- `agim validate` passa
- `agim audit` passa
- **Evidência real** (logs, screenshots — não inventar)

### Como funciona a auditoria de segurança?
```bash
agim audit
```
Varre 15 categorias: auth fraco, authZ ausente, validação só frontend, secrets no frontend, headers inseguros, rate limiting, CORS `*`, SQL injection, XSS, upload inseguro, deps vulneráveis, logs com PII, soft delete, backup/PITR, DB superuser. Exit 1 se qualquer crítico.

### O que é a matriz 15 riscos?
Checklist executável baseado em OWASP + práticas AGIM. Cada risco tem detecção automatizada e prevenção no template. Ver [SECURITY.md](./SECURITY.md).

---

## Memória e Continuidade

### O que é `memoria/`?
6 arquivos persistentes que garantem continuidade **real** entre sessões:

| Arquivo | Conteúdo |
|---------|----------|
| `ESTADO-ATUAL.md` | Fase, última validação, próxima etapa, arquivos, testes, problemas, bloqueios, decisões, pendências |
| `PLANO-DE-EXECUCAO.md` | Plano detalhado com status por etapa |
| `HISTORICO-DE-EXECUCAO.md` | Log completo: ação, comandos, resultados, falhas, correções |
| `DECISOES.md` | ADRs: ID, data, decisão, contexto, alternativas, justificativa, consequências |
| `PENDENCIAS.md` | Itens abertos: prioridade, impacto, dependências, critério resolução |
| `PROXIMO-PASSO.md` | **Instrução executável única** para retomar |

### Posso editar `memoria/` manualmente?
**Não recomendado**. Use skills/CLI (`agim auto`, `agim interview`, `agim status`). Edição manual pode quebrar sincronização.

---

## Configuração

### Onde fica a config?
`.agim/config.json` — **fonte única de verdade**. Edite → `agim config:validate` → `agim sync`.

### Principais configs:
```json
{
  "qualityGates": {
    "typescript": "strict",     // ou "relaxed"
    "lint": "standard",         // ou "verbose"
    "coverage": { "unit": 80, "integration": 60, "e2e": 100 }
  },
  "security": {
    "auth": { "algorithm": "RS256", "argon2": { "memoryCost": 19456 }},
    "rateLimit": { "auth": { "max": 5, "windowMs": 900000 }}
  }
}
```

### Variáveis de ambiente (NÃO vão no config)
`.env` (gitignored): `DATABASE_URL`, `JWT_SECRET`, `CONTEXT7_API_KEY`, `GITHUB_TOKEN`

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| `agim: command not found` | Não instalado global | `npm install -g agim-orchestrator` |
| `agim auto` falha no setup | Kit incompleto | `agim init` (ou rode sem `--check`) |
| `agim auto` falha quality gate | Testes/build/lint falhando | Leia lista de correções impressa no final |
| Drift AGENTS.md ↔ config | Editou AGENTS.md manual | `agim sync` |
| `.agim/core` inválido | Link quebrado | `agim core:link` |
| `config:validate` falha | Enum/range inválido | Corrija `.agim/config.json` (Zod mostra erro exato) |

---

## Decisões de Design

### Por que Node.js 18+?
- Suporte nativo a fetch, test runner, ES modules
- LTS ativo até 2025+
- Ecossistema maduro (Vitest, Playwright, Prisma)

### Por que Zod para validação?
- TypeScript-first, inferência de tipos automática
- Performance excelente
- Schema = fonte única (runtime + compile-time)

### Por que Argon2id (não bcrypt)?
- Vencedor Password Hashing Competition 2015
- Resistente a GPU/ASIC (memory-hard)
- Config OWASP 2023: 19MB/2/1

### Por que JWT RS256 (não HS256)?
- Assimétrico: chave privada assina, pública verifica
- Rotação de chaves sem invalidar tokens
- Separação de responsabilidades (auth server vs resource server)

### Por que Prisma (não raw SQL / TypeORM)?
- Type-safe database access
- Migrations versionadas
- DX excelente (autocomplete, lint)
- Performance adequada para 99% casos

---

## Licença e Custos

### É open source?
**Sim**, MIT License. Código do CLI em `scripts/`, docs em `docs/`, skills em `.opencode/skills/`.

### Tem custo?
**Zero**. Grátis para uso comercial, privado, educacional.

### O repositório principal é público?
O **CLI (`agim-orchestrator`)** é público no npm. O **repo de desenvolvimento (AGIM)** é privado no GitHub. A documentação pública está em `agim-docs`.

---

## Próximos Passos

| Dúvida | Documento |
|--------|-----------|
| Arquitetura detalhada | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Skills completas | [SKILLS-SYSTEM.md](./SKILLS-SYSTEM.md) |
| Comandos CLI | [CLI-REFERENCE.md](./CLI-REFERENCE.md) |
| Configuração | [CONFIGURATION.md](./CONFIGURATION.md) |
| Segurança | [SECURITY.md](./SECURITY.md) |
| Testes | [TESTING.md](./TESTING.md) |
| Métricas reais | [METRICS.md](./METRICS.md) |
| Exemplos | [EXAMPLES.md](./EXAMPLES.md) |