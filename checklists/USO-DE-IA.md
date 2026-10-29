# Checklist de Uso Responsavel de IA

> Use para validar o uso etico, seguro e eficaz de ferramentas de IA (LLMs, agentes, geradores codigo, etc.) no desenvolvimento. Marque `[x]` quando verificado, `[~]` se parcialmente atendido (registre observacao), `[ ]` se nao aplicavel.

---

## Principios Fundamentais

### Governanca e Responsabilidade
- [ ] **Humano no loop**: Decisoes criticas (arquitetura, seguranca, deploy, dados sensiveis) **sempre** validadas por humano
- [ ] **Accountability**: Desenvolvedor responsavel pelo codigo gerado por IA (review, testes, aprovacao)
- [ ] **Transparencia**: Uso de IA documentado em commits/PRs (`co-authored-by: AI` ou descricao)
- [ ] **Auditoria**: Rastro de decisoes assistidas por IA em `memoria/DECISOES.md`
- [ ] **Supervisao**: Nao delegar cegamente; validar saidas antes de integrar

### Privacidade e Seguranca
- [ ] **NENHUM segredo** enviado para IA (senhas, tokens, chaves API, PII, dados producao)
- [ ] **NENHUM codigo proprietario/sensivel** enviado para modelos publicos (OpenAI, Claude, Gemini web)
- [ ] **Sanitizacao**: Remover segredos, IPs internos, dados reais antes de colar contexto
- [ ] **Modelos locais/privados** preferidos para codigo sensivel (Ollama, modelos on-premise)
- [ ] **Contratos/NDAs**: Verificar se provedor IA permite uso com codigo da empresa
- [ ] **Logs IA**: Nao logar prompts/respostas com dados sensiveis

### Qualidade e Confiabilidade
- [ ] **Validacao obrigatoria**: Todo codigo IA **deve** passar testes, lint, typecheck, build
- [ ] **Review humano**: Codigo IA revisado por humano antes de merge (mesmo processo codigo humano)
- [ ] **Testes proprios**: Escrever testes **proprios** para validar comportamento (nao confiar testes gerados)
- [ ] **Hallucination check**: Verificar imports inexistentes, APIs alucinadas, logica falha
- [ ] **Benchmarks**: Comparar performance/qualidade IA vs humano em tarefas criticas

---

## Uso por Categoria

### 1. Geracao de Codigo (Copilot, Cursor, Codeium, Ghostwriter, etc.)

#### Antes de Usar
- [ ] Contexto fornecido: arquivos relevantes, tipos, padroes projeto (`docs/ARQUITETURA.md`, `docs/CODIGO-LIMPO.md`)
- [ ] Prompt claro: objetivo, constraints, padroes, exemplos do projeto
- [ ] Escopo limitado: funcao/componente especifico (nao "escreva o sistema todo")

#### Durante/Uso
- [ ] Aceitar sugestoes **parciais** (linha/bloco), nao arquivo inteiro cego
- [ ] Revisar **cada linha** sugerida antes de aceitar
- [ ] Verificar: imports corretos, tipos corretos, padroes projeto seguidos
- [ ] Rejeitar sugestoes que usam: `any` desnecessario, padroes anti-pattern, libs nao aprovadas

#### Apos Geracao
- [ ] `npm run typecheck` passa
- [ ] `npm run lint` passa
- [ ] `npm run test` passa (escrever testes proprios para validar)
- [ ] `npm run build` passa
- [ ] Code review humano (mesmo processo codigo manual)

### 2. Assistentes de Chat (ChatGPT, Claude, Gemini, etc.)

#### Uso Permitido
- [ ] Explicar conceitos, algoritmos, padroes, best practices
- [ ] Brainstorming: arquitetura, trade-offs, alternativas tecnologicas
- [ ] Debugging: explicar erro, sugerir causas raiz, estrategias debugging
- [ ] Learning: aprender nova lib, framework, conceito
- [ ] Documentacao: gerar rascunhos README, ADRs, comentarios JSDoc (revisar depois)
- [ ] Refactoring suggestions: "como melhorar este codigo?" (validar depois)

#### Uso PROIBIDO/RESTRITO
- [ ] **NAO** colar codigo proprietario/sensivel/segredos no chat
- [ ] **NAO** pedir "escreva o sistema completo" sem supervisao granular
- [ ] **NAO** confiar cegamente em: versoes libs, APIs, breaking changes, security advice
- [ ] **NAO** usar para decisoes: arquitetura final, escolha stack, decisoes seguranca
- [ ] **NAO** copiar-colar codigo sem review + testes + build

#### Validacao Pos-Chat
- [ ] Verificar versao libs/APIs citadas (usar `tools.context7` ou docs oficiais)
- [ ] Testar codigo sugerido em ambiente isolado antes de integrar
- [ ] Cross-referenciar com docs oficiais / source code
- [ ] Registrar insights uteis em `memoria/DECISOES.md` ou docs projeto

### 3. Agentes de IA / Orquestracao (OpenCode, Cursor Agent, etc.)

#### Configuracao
- [ ] `AGENTS.md` do projeto configurado (regras, padroes, stack, constraints)
- [ ] Skills/ferramentas necessarias instaladas e validadas
- [ ] Permissoes minimas: leitura/escrita arquivos projeto, shell comandos seguros
- [ ] **NAO** permissoes: deploy, push, delete, secrets, producao, externos

#### Execucao
- [ ] Objetivo claro e escopo definido antes de iniciar agente
- [ ] `entrevista-orquestradora` ativada (ponto de entrada Biblia)
- [ ] Plano aprovado **antes** de execucao (etapas, criterios, riscos)
- [ ] Supervisao humana: checkpoints a cada etapa significativa
- [ ] `memoria/` atualizado a cada etapa (estado, plano, decisoes, historico)
- [ ] Limite de autonomia: agente **nao** decide irreversivel/alto risco

#### Monitoramento
- [ ] Logs agente monitorados (acoes, arquivos modificados, comandos)
- [ ] Budget tokens/custo monitorado (alertas se > threshold)
- [ ] Timeout/step limit configurado (evitar loops infinitos)
- [ ] Kill switch: capacidade parar agente instantaneamente

### 4. Geracao de Testes

- [ ] **NAO** confiar cegamente em testes gerados (podem testar errado, falsos positivos)
- [ ] Gerar **rascunhos** testes -> revisar cada assertiva -> adaptar para regras negocio
- [ ] Testes gerados devem: seguir padroes projeto (`checklists/TESTES.md`), usar factories/fixtures projeto
- [ ] Cobertura alvo: escrever testes **criticos** manualmente, usar IA para boilerplate/edge cases
- [ ] Mutation testing (se configurado) para validar qualidade testes gerados

### 5. Documentacao e ADRs

- [ ] IA pode gerar **rascunhos**: README, ADRs, comentarios JSDoc, changelogs
- [ ] **Obrigatorio**: Revisao humana completa (precisao, tom, completude, contexto projeto)
- [ ] ADRs: IA sugere estrutura/alternativas -> humano decide + justifica
- [ ] Commits: IA sugere mensagens -> humano aprova (Conventional Commits)

### 5. Pesquisa e Analise (Context7, WebSearch, Perplexity, etc.)

- [ ] Context7 **OBRIGATORIO** para docs libs (versao exata, APIs corretas)
- [ ] WebSearch: verificar data fonte, credibilidade, multiplas fontes
- [ ] Cross-referenciar: docs oficiais > blog posts > StackOverflow > IA
- [ ] Registrar fontes em `memoria/DECISOES.md` ou docs projeto

---

## Ferramentas IA Aprovadas (Lista Branca)

| Categoria | Ferramentas Aprovadas | Restricoes |
|-----------|----------------------|------------|
| **Code Completion** | GitHub Copilot, Cursor, Codeium, Tabnine | Apenas sugestoes inline, review obrigatorio |
| **Chat/Assistants** | Claude (Anthropic), ChatGPT (OpenAI), Gemini (Google) | NAO enviar segredos/codigo proprietario |
| **Local Models** | Ollama (CodeLlama, WizardCoder, DeepSeek-Coder), LM Studio | Preferido para codigo sensivel |
| **Agents** | OpenCode (`entrevista-orquestradora`), Cursor Agent | Supervisao humana, permissoes minimas |
| **Docs/Research** | Context7 (MCP), Perplexity, Phind, docs oficiais | Verificar data/versao, cross-referenciar |
| **Testing** | Vitest/Playwright + IA para boilerplate | Testes criticos escritos por humano |

---

## Ferramentas NAO Aprovadas / Uso Restrito

| Ferramenta | Motivo | Alternativa |
|------------|--------|-------------|
| ChatGPT/Claude web para codigo proprietario | Risco vazamento dados, treinamento modelos | Modelos locais (Ollama) ou enterprise plans com zero-retention |
| Copilot Chat para arquitetura final | Falta contexto projeto completo, hallucination risk | `entrevista-orquestradora` + `planejamento-de-tarefas` |
| Geradores "app completo" (v0, Bolt, etc.) | Codigo generico, nao segue padroes projeto, debt tecnico | `planejamento-de-tarefas` + implementacao incremental |
| IA para decisoes seguranca/arquitetura final | Falta accountability, contexto legal/compliance | `auditoria-de-seguranca` + `revisao-final` + decisao humana |

---

## Procedimentos de Emergencia

### Vazamento de Segredo via IA
1. **Imediato**: Rotacionar segredo exposto (chave API, JWT secret, DB password)
2. **Imediato**: Revogar tokens/sessoes associados
3. **Imediato**: Verificar logs IA/provedor (se enterprise) para confirmar escopo
4. **Curto prazo**: Auditoria codigo/commits recentes para outros vazamentos
5. **Curto prazo**: Atualizar `.gitignore`, secrets scanning (GitLeaks/truffleHog no CI)
6. **Documentar**: Incidente em `memoria/HISTORICO-DE-EXECUCAO.md` + `REGISTRO-INCIDENTE.md`

### Codigo Malicioso/Inseguro Gerado por IA
1. **Imediato**: Reverter commit/merge (não fazer merge)
2. **Curto prazo**: Auditoria completa diff (seguranca, performance, corretude)
3. **Curto prazo**: Identificar prompt/causa raiz (contexto insuficiente? prompt ambíguo?)
4. **Processo**: Atualizar `AGENTS.md` / prompts / contextos para prevenir recorrencia
5. **Documentar**: Lição aprendida em `memoria/DECISOES.md`

### Alucinacao Critica em Producao
1. **Imediato**: Hotfix/rollback se em producao
2. **Curto prazo**: Identificar onde validacao falhou (review? testes? typecheck?)
3. **Processo**: Adicionar validacao especifica (teste, lint rule, type guard) para prevenir
3. **Documentar**: Padrao alucinacao em `memoria/DECISOES.md` para conhecimento equipe

---

## Metricas e Governanca

### KPIs de Uso IA (Monitorar Mensalmente)
| Metrica | Target | Acao se Falhar |
|---------|--------|----------------|
| % codigo gerado IA / total | < 30% (nova features) / < 10% (critico) | Revisar processo, aumentar review |
| Taxa rejeicao sugestoes IA | > 50% (saudavel) | Ajustar prompts/contexto |
| Bugs introdados por codigo IA | < 5% total bugs | Aumentar review/testes IA |
| Tempo review codigo IA vs humano | < 1.5x humano | Otimizar prompts/contexto |
| Custo IA / desenvolvedor / mes | < $50 | Otimizar uso, modelos locais |
| Hallucinations detectadas | 0 em producao | Adicionar validacoes especificas |

### Auditoria Trimestral
- [ ] Revisar todos commits com IA (ultimos 3 meses)
- [ ] Amostragem aleatoria: 20% codigo IA -> review profundo
- [ ] Entrevista equipe: pontos de dor, sucessos, ferramentas
- [ ] Atualizar lista aprovada/restrita baseado em evidencias
- [ ] Atualizar `AGENTS.md` / prompts / Skills baseado em lições

---

## Checklist Rapido Por Sessao (Antes de Usar IA)

```
[ ] Objetivo claro e escopo definido?
[ ] Contexto projeto fornecido (AGENTS.md, ARCHITECTURE.md, tipos relevantes)?
[ ] Segredos/PII removidos do contexto?
[ ] Ferramenta aprovada para esta tarefa?
[ ] Prompt claro com constraints e padroes projeto?
[ ] Plano de validacao pos-IA definido (testes, lint, typecheck, build, review)?
[ ] Budget tokens/custo verificado?
[ ] Kill switch / timeout configurado (se agente)?
```

---

## Assinatura e Compromisso

```
Desenvolvedor: _________________________
Projeto: _________________________
Data: _________________________

Declaro que:
[ ] Li e entendi esta politica de uso responsavel de IA
[ ] Comprometo-me a seguir as diretrizes acima
[ ] Entendo que sou responsavel por TODO codigo que comito (gerado por IA ou nao)
[ ] Reportarei incidentes/preocupacoes imediatamente

Assinatura: _________________________
```