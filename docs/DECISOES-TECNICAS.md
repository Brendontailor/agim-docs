# Decisões Técnicas (ADRs)

> Registro oficial das decisões arquiteturais deste repositório no formato ADR (Architecture Decision Record).
> Fonte operacional: `memoria/DECISOES.md` (registro cronológico). Este documento consolida o mesmo conteúdo com contexto arquitetural e consequências.

---

## 1. Propósito e Formato

### Por que ADRs

ADRs preservam o **porquê** das decisões, não apenas o **o quê**. Sem eles, decisões são revertidas por desconhecimento, alternativas já descartadas são reavaliadas e o custo de manutenção cresce.

### Quando criar uma ADR

| Criar ADR | Não criar ADR |
|-----------|---------------|
| Escolha de biblioteca, framework ou banco | Correção de bug pontual |
| Mudança de arquitetura ou de camadas | Renomeação de variável |
| Padrão obrigatório para todo o projeto | Ajuste de estilo localizado |
| Decisão difícil de reverter | Configuração trivial de ferramenta |
| Decisão que afeta mais de um módulo/equipe | Detalhe interno de um único arquivo |

### Estrutura obrigatória

1. **Título** — `ADR-XXX: [decisão em uma frase]`
2. **Status** — `Proposta` | `Aceita` | `Substituída por ADR-YYY` | `Obsoleta`
3. **Data** — ISO 8601 (`YYYY-MM-DD`)
4. **Decisores** — quem aprovou
5. **Relacionadas** — ADRs que influenciam ou dependem desta
6. **Contexto** — problema e restrições do momento
7. **Decisão** — o que foi decidido, de forma acionável
8. **Alternativas** — opções avaliadas com prós/contras
9. **Consequências** — positivas, negativas e riscos com mitigação
10. **Implementação** — passos para aplicar
11. **Métricas de sucesso** — como saber se a decisão funcionou
12. **Referências** — docs, issues, discussões

### Regras de ciclo de vida

- ADR **nunca é apagada**. Decisão revertida recebe status `Substituída por ADR-YYY`.
- Toda ADR nova entra em `memoria/DECISOES.md` no mesmo dia, com o mesmo ID.
- Template para novos registros: `templates/DECISAO-TECNICA.md`.

---

## 2. Índice de Decisões

| ID | Data | Decisão | Status |
|----|------|---------|--------|
| [ADR-001](#adr-001--idioma-da-documentação-e-identificadores-próprios) | 2026-10-27 | Português brasileiro na documentação e identificadores próprios | Aceita |
| [ADR-002](#adr-002--preservação-de-nomes-oficiais) | 2026-10-27 | Preservar nomes oficiais de bibliotecas, APIs e comandos | Aceita |
| [ADR-003](#adr-003--monorepo-com-frontend-e-backend-separados) | 2026-10-27 | Monorepo com `frontend/` e `backend/` | Aceita |
| [ADR-004](#adr-004--context7-como-fonte-de-documentação-técnica) | 2026-10-27 | Context7 como fonte oficial de docs técnicas | Aceita |
| [ADR-005](#adr-005--proibição-de-push-e-publicação-sem-autorização) | 2026-10-27 | Sem `git push`, deploy ou operação irreversível sem autorização | Aceita |
| [ADR-006](#adr-006--licença-do-repositório) | 2026-10-27 | Licença do repositório | **Proposta (pendente)** |
| [ADR-007](#adr-007--skills-locais-obrigatórias) | 2026-10-27 | Skills locais obrigatórias do repositório | Aceita |
| [ADR-008](#adr-008--continuidade-via-arquivos-markdown) | 2026-10-27 | Continuidade por arquivos Markdown em `memoria/` | Aceita |
| [ADR-009](#adr-009--stack-padrão) | 2026-10-27 | Stack padrão React/Vite/TS + Node/Express/TS + PostgreSQL/Prisma | Aceita |
| [ADR-010](#adr-010--argon2id-para-hash-de-senhas) | 2026-10-27 | Argon2id preferencial para hash de senhas | Aceita |
| [ADR-011](#adr-011--typescript-em-modo-strict) | 2026-10-27 | TypeScript `strict` obrigatório | Aceita |
| [ADR-012](#adr-012--zod-para-validação-de-entrada) | 2026-10-27 | Zod para validação de entrada | Aceita |
| [ADR-013](#adr-013--bootstrap-de-ambiente-documentado) | 2026-10-27 | Bootstrap de ambiente documentado e ordenado | Aceita |
| [ADR-014](#adr-014--matriz-de-riscos-de-segurança) | 2026-10-27 | Matriz de riscos de segurança com 15 itens | Aceita |

**Resumo:** 13 aceitas, 1 proposta (ADR-006), 0 substituídas, 0 obsoletas.

---

## 3. Decisões

### ADR-001 — Idioma da documentação e identificadores próprios

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-002

**Contexto**
O repositório é usado por equipe e agentes que operam em português. Documentação em inglês criaria tradução mental constante e afastaria stakeholders não técnicos.

**Decisão**
Usar português brasileiro em documentação, identificadores próprios, nomes de arquivos e pastas.

**Alternativas**
1. **Inglês técnico completo** — padrão de mercado, porém exige tradução para o público real. Descartada.
2. **Mistura livre** — gera inconsistência e busca ineficaz. Descartada.

**Consequências**
- ✅ Leitura imediata pela equipe e por agentes com instruções em PT-BR.
- ⚠️ Atrito com ferramentas e tutoriais em inglês (mitigado pela ADR-002).
- ⚠️ Nomes de arquivos sem acento (`DECISOES`, não `DECISÕES`) para evitar problemas de encoding em CI e links.

**Implementação**
Aplicado em todo o repositório. Nomes de arquivos em maiúsculas sem acento; conteúdo com acentuação normal.

**Métricas de sucesso**
Nenhum documento novo em inglês sem justificativa registrada.

**Referências**
`memoria/DECISOES.md` (DEC-001), `AGENTS.md`.

---

### ADR-002 — Preservação de nomes oficiais

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-001

**Contexto**
Traduzir nomes de tecnologias quebra busca, documentação oficial e comunicação com a comunidade.

**Decisão**
Preservar nomes oficiais: React, Vite, TypeScript, Node.js, Express, Prisma, PostgreSQL, Neon, Vitest, Playwright, ESLint, Prettier, GitHub, OpenCode, Context7, Graphify, MCP.

**Alternativas**
1. **Traduzir tudo** — perde precisão e rastreabilidade em buscas. Descartada.
2. **Criar aliases em português** — dobra o vocabulário e cria ambiguidade. Descartada.

**Consequências**
- ✅ Consistência com documentação oficial e resultados de busca.
- ⚠️ Exige conhecimento técnico mínimo em inglês.

**Implementação**
Revisão de nomenclatura no checklist `checklists/DESENVOLVIMENTO.md`.

**Métricas de sucesso**
Zero ocorrências de nomes traduzidos de bibliotecas em revisão de código.

**Referências**
`memoria/DECISOES.md` (DEC-002), `docs/CODIGO-LIMPO.md`.

---

### ADR-003 — Monorepo com frontend e backend separados

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-009

**Contexto**
Projetos derivados deste padrão compartilham contratos de tipos, tooling e pipeline entre frontend e backend.

**Decisão**
Monorepo com `frontend/` e `backend/` no mesmo repositório, compartilhando `docs/`, `tests/`, `scripts/`, `templates/`, `checklists/` e `memoria/`.

**Alternativas**
1. **Polyrepo** — isolamento maior, porém sincronização de contratos e CI fragmentado. Descartada.
2. **`apps/` + `packages/`** — escalável, mas complexidade desnecessária para o porte dos projetos alvo. Descartada.

**Consequências**
- ✅ Tipos e contratos compartilhados; CI/CD único; onboarding simplificado.
- ⚠️ Repositório maior e risco de conflito de merge (mitigado por escopo de PR pequeno).

**Implementação**
Referência funcional em `exemplos/arquitetura-modular/`.

**Métricas de sucesso**
Tempo de setup de novo projeto abaixo de 1 dia; contratos de API sem duplicação manual.

**Referências**
`docs/ARQUITETURA.md`, `exemplos/arquitetura-modular/`.

---

### ADR-004 — Context7 como fonte de documentação técnica

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-008

**Contexto**
Agentes tendem a gerar APIs obsoletas por defasagem do treino. Documentação precisa ser consultada por versão.

**Decisão**
Adotar Context7 (`tools.context7["resolve-library-id"]` → `query-docs`) como fonte oficial para documentação de bibliotecas e frameworks.

**Alternativas**
1. **Web search genérico** — resultados inconsistentes e sem versão explícita. Descartada.
2. **Docs locais estáticas** — envelhecem e exigem manutenção manual. Descartada.
3. **Confiar no treino do modelo** — principal causa de API obsoleta. Descartada.

**Consequências**
- ✅ Exemplos compatíveis com a versão instalada.
- ⚠️ Dependência de MCP externo e custo de tokens (mitigado por consultas escopadas a um conceito).

**Implementação**
Fluxo descrito em `docs/FERRAMENTAS-IA.md` e `docs/IA-E-CONTEXTO.md`.

**Métricas de sucesso**
Queda de retrabalho por API inexistente em revisão de código.

**Referências**
`docs/IA-E-CONTEXTO.md`, `TOOLS-AND-MCP.md`.

---

### ADR-005 — Proibição de push e publicação sem autorização

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: —

**Contexto**
Agentes com acesso a shell podem publicar, sobrescrever histórico ou executar operações irreversíveis.

**Decisão**
Não executar `git push`, deploy, publicação remota ou operação destrutiva sem autorização explícita. Commits locais são permitidos.

**Alternativas**
1. **Push automático em branch** — reduz atrito, aumenta risco de vazamento. Descartada.
2. **Deploy preview automático** — exige infraestrutura e credenciais não disponíveis. Descartada.

**Consequências**
- ✅ Controle total sobre o remoto; prevenção de vazamento acidental.
- ⚠️ Publicação depende de ação humana.

**Implementação**
Regra registrada em `AGENTS.md` (seção de limites) e `checklists/PUBLICACAO.md`.

**Métricas de sucesso**
Zero publicações não autorizadas.

**Referências**
`AGENTS.md`, `checklists/PUBLICACAO.md`.

---

### ADR-006 — Licença do repositório

**Status**: **Proposta (pendente)** · **Data**: 2026-10-27 · **Decisores**: proprietário do repositório · **Relacionadas**: —

**Contexto**
`README.md` e `CONTRIBUTING.md` referenciam licença; o arquivo `LICENSE` ainda não existe. A escolha é decisão de negócio, não técnica.

**Decisão**
Não decidida. Nenhuma licença será criada por inferência do agente.

**Alternativas**

| Opção | Permite uso comercial | Exige atribuição | Cláusula de patentes | Complexidade |
|-------|----------------------|------------------|----------------------|--------------|
| MIT | Sim | Sim | Não | Muito baixa |
| Apache 2.0 | Sim | Sim | Sim | Baixa |
| BSD-3-Clause | Sim | Sim | Não | Muito baixa |
| UNLICENSE | Sim (domínio público) | Não | Não | Muito baixa |

**Consequências**
- ⚠️ Bloqueia `LICENSE`, cabeçalhos de arquivo e fechamento de `CONTRIBUTING.md`.
- ⚠️ Repositório sem licença é, por padrão, "todos os direitos reservados".

**Implementação (quando decidido)**
1. Registrar a decisão em `memoria/DECISOES.md` (DEC-006).
2. Criar `LICENSE` com o texto oficial.
3. Atualizar `README.md`, `CONTRIBUTING.md` e `templates/README.md`.

**Métricas de sucesso**
`LICENSE` presente e coerente com o texto de `README.md`.

**Referências**
`memoria/PENDENCIAS.md` (P7), `memoria/DECISOES.md` (DEC-006).

---

### ADR-007 — Skills locais obrigatórias

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-008

**Contexto**
Sem procedimentos padronizados, cada sessão de agente reinventa abordagem e qualidade varia.

**Decisão**
Manter skills locais em `.opencode/skills/`, uma por fase do ciclo: `entrevista-orquestradora` (entrada), `planejamento-de-tarefas`, `analise-de-legado`, `revisao-de-interface`, `auditoria-de-seguranca`, `testes-com-roteiro`, `revisao-final`.

**Alternativas**
1. **Apenas skills globais** — genéricas, sem os padrões deste repositório. Descartada.
2. **Uma skill monolítica** — acoplamento e contexto excessivo. Descartada.

**Consequências**
- ✅ Cobertura do ciclo completo com critérios de aceitação próprios.
- ⚠️ Custo de manutenção de 7 skills (mitigado por `SKILLS-CATALOG.md` como fonte única).

**Implementação**
`scripts/validar-estrutura.cjs` falha se qualquer `SKILL.md` obrigatório faltar.

**Métricas de sucesso**
Skills carregadas corretamente pelo OpenCode; nenhuma skill órfã no catálogo.

**Referências**
`SKILLS-CATALOG.md`, `SKILLS-SELECTION-MATRIX.md`.

---

### ADR-008 — Continuidade via arquivos Markdown

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-004, ADR-007

**Contexto**
Sessões de IA terminam, modelos mudam e contexto de conversa se perde. A retomada não pode depender de memória do modelo nem de serviço externo.

**Decisão**
Manter 6 arquivos em `memoria/`: `ESTADO-ATUAL`, `PLANO-DE-EXECUCAO`, `HISTORICO-DE-EXECUCAO`, `DECISOES`, `PENDENCIAS`, `PROXIMO-PASSO`.

**Alternativas**
1. **Banco vetorial + embeddings** — busca semântica, porém dependência, custo e opacidade. Descartada.
2. **SQLite/JSON local** — estruturado, mas ilegível em diff e sem edição trivial. Descartada.
3. **Serviço cloud (Notion etc.)** — fora do versionamento e dependente de rede. Descartada.

**Consequências**
- ✅ Offline, versionável, legível em diff, recuperável sem IA.
- ⚠️ Atualização manual (mitigada por `checklists/INICIO.md` e `checklists/ENTREGA.md`).
- ⚠️ Risco de divergência entre documentado e real (mitigado pela etapa 6 do protocolo de início de sessão: comparar documentado vs real).

**Implementação**
Protocolo de início de sessão em `INDEX.md`; atualização obrigatória antes de encerrar.

**Métricas de sucesso**
Retomada correta usando apenas arquivos persistentes, sem consultar histórico de conversa.

**Referências**
`memoria/`, `docs/IA-E-CONTEXTO.md`.

---

### ADR-009 — Stack padrão

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-003, ADR-011, ADR-012

**Contexto**
Padronizar stack reduz decisões repetidas e permite reutilizar arquitetura, testes e exemplos.

**Decisão**

| Camada | Stack |
|--------|-------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Banco | PostgreSQL + Prisma ORM |
| Testes | Vitest + Playwright + axe-core |
| Qualidade | ESLint + Prettier + `tsc --noEmit` |

**Alternativas**
1. **Next.js fullstack** — ótimo para SSR, mas mistura fronteiras e diverge do modelo modular adotado. Descartada.
2. **NestJS** — estrutura forte, porém mais cerimônia do que o necessário. Descartada.
3. **MongoDB/Supabase** — menor aderência ao modelo relacional e às regras de segurança documentadas. Descartada.

**Consequências**
- ✅ Previsibilidade, exemplos reutilizáveis, onboarding rápido.
- ⚠️ Projetos com requisitos diferentes precisam de ADR própria justificando o desvio.

**Implementação**
`docs/ARQUITETURA.md` e `exemplos/arquitetura-modular/`.

**Métricas de sucesso**
Novos projetos iniciam da referência sem decisões de stack abertas.

**Referências**
`docs/ARQUITETURA.md`, `docs/TESTES.md`.

---

### ADR-010 — Argon2id para hash de senhas

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-014

**Contexto**
Hash de senha é o ponto único de falha em vazamento de banco.

**Decisão**
Argon2id como algoritmo preferencial (`memoryCost`, `timeCost`, `parallelism` explícitos). bcrypt com custo adequado apenas como alternativa compatível.

**Alternativas**
1. **Apenas bcrypt** — maduro, porém menos resistente a GPU/ASIC. Descartada como padrão.
2. **PBKDF2** — amplamente suportado, resistência inferior. Descartada.
3. **scrypt** — bom, ecossistema menor em Node.js. Descartada.
4. **SHA-256/MD5** — inseguro para senhas. Proibida.

**Consequências**
- ✅ Resistência a ataque com hardware especializado.
- ⚠️ Dependência nativa (`node-argon2`) e custo de CPU por login (mitigado por parâmetros calibrados).

**Implementação**
Regras e parâmetros em `docs/SEGURANCA.md`.

**Métricas de sucesso**
Nenhum hash legado sem marcação de migração; tempo de login dentro do orçamento definido.

**Referências**
`docs/SEGURANCA.md`, `checklists/SEGURANCA.md`.

---

### ADR-011 — TypeScript em modo strict

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-009, ADR-012

**Contexto**
Tipagem frouxa permite `null`/`undefined` não tratados e erros só em produção.

**Decisão**
`strict: true` em todo projeto derivado, com `noUncheckedIndexedAccess` e `noImplicitOverride` quando compatível com as dependências.

**Alternativas**
1. **Modo padrão do TypeScript** — menos atrito inicial, mais bugs em runtime. Descartada.
2. **JavaScript puro** — fora do padrão. Descartada.

**Consequências**
- ✅ Erros detectados em compilação; refatoração segura.
- ⚠️ Custo inicial de tipar código legado (migração incremental permitida com `// @ts-expect-error` justificado e rastreado como dívida técnica).

**Implementação**
`tsconfig.json` base documentado em `docs/CODIGO-LIMPO.md`.

**Métricas de sucesso**
`tsc --noEmit` sem erros no CI; nenhum `any` implícito.

**Referências**
`docs/CODIGO-LIMPO.md`, `checklists/DESENVOLVIMENTO.md`.

---

### ADR-012 — Zod para validação de entrada

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-011, ADR-014

**Contexto**
Validação manual duplica regras entre camadas e não gera tipos confiáveis.

**Decisão**
Zod como biblioteca padrão de validação em fronteiras de entrada (HTTP, formulários, variáveis de ambiente), com schema único reutilizado entre validação e tipagem.

**Alternativas**
1. **Validação manual** — duplicação e divergência entre camadas. Descartada.
2. **Joi/Yup** — funcionais, porém sem inferência de tipos equivalente. Descartada.
3. **class-validator** — depende de decorators e reflexão. Descartada.

**Consequências**
- ✅ Uma fonte de verdade para regra e tipo; mensagens de erro consistentes.
- ⚠️ Schemas precisam acompanhar mudanças de contrato.

**Implementação**
Exemplo em `exemplos/arquitetura-modular/backend/src/validators/usuarios.validator.ts`.

**Métricas de sucesso**
Nenhum endpoint aceitando payload sem schema; erros de validação padronizados.

**Referências**
`docs/CODIGO-LIMPO.md`, `docs/SEGURANCA.md`.

---

### ADR-013 — Bootstrap de ambiente documentado

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-004, ADR-007

**Contexto**
Configuração de ambiente feita de memória gera divergência entre máquinas e sessões de agente.

**Decisão**
Manter `docs/BOOTSTRAP-AMBIENTE.md` com ordem obrigatória: OpenCode → skills globais → MCPs → skills locais → plugin → Git → variáveis de ambiente, cada passo com comando de verificação.

**Alternativas**
1. **Bootstrap implícito** — rápido no início, caro em retrabalho. Descartada.
2. **Script único de setup** — desejável no futuro, mas ainda não cobre credenciais e MCPs. Adiada.

**Consequências**
- ✅ Ambiente reproduzível e auditável.
- ⚠️ Documento precisa ser atualizado quando versões mudam.

**Implementação**
`docs/BOOTSTRAP-AMBIENTE.md`, verificado por `checklists/INICIO.md`.

**Métricas de sucesso**
Ambiente novo operacional seguindo apenas o documento.

**Referências**
`docs/BOOTSTRAP-AMBIENTE.md`, `checklists/INICIO.md`.

---

### ADR-014 — Matriz de riscos de segurança

**Status**: Aceita · **Data**: 2026-10-27 · **Decisores**: mantenedor · **Relacionadas**: ADR-010, ADR-012

**Contexto**
Riscos tratados informalmente não são priorizados nem verificados.

**Decisão**
Manter matriz de 15 riscos em `docs/SEGURANCA.md`, cada item com severidade, impacto, evidência, mitigação e estado, espelhada no checklist executável.

**Alternativas**
1. **Lista informal de boas práticas** — sem rastreabilidade. Descartada.
2. **Ferramenta externa de gestão de risco** — overhead para o porte do projeto. Descartada.

**Consequências**
- ✅ Priorização objetiva e verificação reproduzível.
- ⚠️ Manutenção a cada nova superfície de ataque.

**Implementação**
`docs/SEGURANCA.md` + `checklists/SEGURANCA.md`.

**Métricas de sucesso**
Todo risco com estado atualizado antes de release.

**Referências**
`docs/SEGURANCA.md`, `checklists/SEGURANCA.md`.

---

## 4. Como Registrar uma Nova Decisão

1. Copiar `templates/DECISAO-TECNICA.md`.
2. Atribuir o próximo ID sequencial (`ADR-015`).
3. Preencher todos os campos obrigatórios; se faltar informação de negócio, marcar `Status: Proposta`.
4. Adicionar a linha na tabela do índice (seção 2).
5. Registrar o mesmo ID em `memoria/DECISOES.md` com data e estado.
6. Se a decisão substituir outra, atualizar o status da anterior para `Substituída por ADR-XXX`.

---

## 5. Checklist de Validação deste Documento

- [ ] Toda ADR tem Status, Data, Contexto, Decisão, Alternativas e Consequências
- [ ] Toda ADR do índice existe na seção 3
- [ ] IDs únicos e sequenciais
- [ ] `memoria/DECISOES.md` contém os mesmos IDs
- [ ] ADRs substituídas apontam para a substituta
- [ ] Nenhuma ADR removida do histórico
