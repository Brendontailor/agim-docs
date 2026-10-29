# Template DECISAO-TECNICA.md - Architecture Decision Record (ADR)

> Copie este arquivo para `docs/ADR-[NUMERO]-[TITULO].md` e preencha.
> Use para registrar decisoes arquiteturais significativas.

---

# ADR-[NUMERO]: [TITULO DA DECISAO]

**Status**: `Proposta` | `Aceita` | `Substituida` | `Obsoleta`
**Data**: `YYYY-MM-DD`
**Decisores**: `[Nomes/Roles]`
**Relacionadas**: `ADR-XXX`, `ADR-YYY`

---

## Contexto

**Problema**: [Descreva o problema que motivou esta decisao. Qual eh o cenario atual? Quais sao as restricoes?]

**Requisitos**: [Liste os requisitos funcionais e nao-funcionais que a decisao deve atender]
- [ ] Requisito 1: [descricao]
- [ ] Requisito 2: [descricao]
- [ ] Requisito 3: [descricao]

**Cenario Atual**: [Descreva o estado atual do sistema, tecnologias em uso, limitacoes conhecidas]

---

## Decisao

**O que foi decidido**: [Declaracao clara e acionavel da decisao tomada]

**Detalhes da Implementacao**: [Descreva como a decisao sera implementada - arquitetura, padroes, bibliotecas, configuracoes]

**Exemplo/Codigo**: [Se aplicavel, inclua snippets de codigo, diagramas ou pseudocodigo ilustrando a decisao]

---

## Alternativas Consideradas

| Alternativa | Descricao | Pros | Contras | Motivo Rejeicao |
|-------------|-----------|------|---------|-----------------|
| **Alternativa A** | [Descricao] | [Vantagens] | [Desvantagens] | [Motivo] |
| **Alternativa B** | [Descricao] | [Vantagens] | [Desvantagens] | [Motivo] |
| **Alternativa C** | [Descricao] | [Vantagens] | [Desvantagens] | [Motivo] |
| **Status Quo** | [Manter como esta] | [Vantagens] | [Desvantagens] | [Motivo] |

**Analise Comparativa**: [Resumo da comparacao detalhada entre alternativas - matriz de decisao se necessario]

---

## Consequencias

### Positivas
- [Beneficio 1]: [Descricao e impacto]
- [Beneficio 2]: [Descricao e impacto]
- [Beneficio 3]: [Descricao e impacto]

### Negativas
- [Desvantagem 1]: [Descricao e impacto] | **Mitigacao**: [Como mitigar]
- [Desvantagem 2]: [Descricao e impacto] | **Mitigacao**: [Como mitigar]
- [Desvantagem 4]: [Descricao e impacto] | **Mitigacao**: [Como mitigar]

### Riscos Identificados
| Risco | Probabilidade | Impacto | Mitigacao | Responsavel |
|-------|---------------|---------|-----------|-------------|
| [Risco 1] | [Alta/Media/Baixa] | [Critico/Alto/Medio/Baixo] | [Mitigacao] | [Quem] |
| [Risco 2] | [Alta/Media/Baixa] | [Critico/Alto/Medio/Baixo] | [Mitigacao] | [Quem] |
| [Risco 3] | [Alta/Media/Baixa] | [Critico/Alto/Medio/Baixo] | [Mitigacao] | [Quem] |

---

## Plano de Implementacao

| Fase | Atividade | Responsavel | Prazo | Criterio Conclusao |
|------|-----------|-------------|-------|-------------------|
| 1 | [Atividade 1] | [Quem] | [Data] | [Criterio] |
| 2 | [Atividade 2] | [Quem] | [Data] | [Criterio] |
| 3 | [Atividade 3] | [Quem] | [Data] | [Criterio] |

**Dependencias**: [Outras tarefas/ADRs que devem ser concluidas antes]
**Bloqueadores**: [Riscos que podem bloquear implementacao]

---

## Metricas de Sucesso

| Metrica | Baseline Atual | Target | Como Medir | Frequencia |
|---------|----------------|--------|------------|------------|
| [Metrica 1] | [Valor] | [Valor] | [Como] | [Frequencia] |
| [Metrica 2] | [Valor] | [Valor] | [Como] | [Frequencia] |
| [Metrica 3] | [Valor] | [Valor] | [Como] | [Frequencia] |

**Criterio de Sucesso Global**: [Definicao clara de quando a decisao sera considerada bem-sucedida]

---

## Plano de Rollback (se aplicavel)

**Gatilhos**: [Condicoes que acionam rollback]
**Procedimento**: [Passos para reverter a decisao]
**Tempo Estimado**: [Tempo maximo para rollback]
**Impacto Rollback**: [O que sera afetado/perdido]

---

## Plano de Comunicacao

| Publico | Mensagem Chave | Canal | Responsavel | Timing |
|---------|----------------|-------|-------------|--------|
| Equipe tecnica | [Mensagem] | [Canal] | [Quem] | [Quando] |
| Stakeholders | [Mensagem] | [Canal] | [Quem] | [Quando] |
| Usuarios (se aplicavel) | [Mensagem] | [Canal] | [Quem] | [Quando] |

---

## Documentacao e Artefatos

| Artefato | Localizacao | Status |
|----------|-------------|--------|
| Diagrama arquitetura | [Link/Arquivo] | [Pendente/Concluido] |
| Documentacao tecnica | [Link/Arquivo] | [Pendente/Concluido] |
| Exemplos de codigo | [Link/Arquivo] | [Pendente/Concluido] |
| Guias de migracao | [Link/Arquivo] | [Pendente/Concluido] |
| Testes de validacao | [Link/Arquivo] | [Pendente/Concluido] |

---

## Aprovacao

| Papel | Nome | Assinatura | Data |
|-------|------|------------|------|
| Tech Lead | | | |
| Product Owner | | | |
| Security (se critico) | | | |
| Arquitetura (se necessario) | | | |

---

## Historico de Mudancas

| Versao | Data | Autor | Mudanca |
|--------|------|-------|---------|
| 1.0 | YYYY-MM-DD | [Nome] | Criacao inicial |
| 1.1 | YYYY-MM-DD | [Nome] | [Mudanca] |

---

## Referencias

- [Link para documentacao externa relevante]
- [Link para issue/PR relacionado]
- [Link para pesquisa/benchmark que fundamentou a decisao]
- [Link para ADRs relacionadas]

---

## Notas Adicionais

[Espaco para observacoes adicionais, lições aprendidas durante implementacao, descobertas pos-implementacao, etc.]