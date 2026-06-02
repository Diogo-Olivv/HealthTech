# Template do Pull Request

## Contexto da tarefa

Qual issue/tarefa este PR resolve? Descreva brevemente o problema ou requisito.

Resolve Issue #_NumeroIssue_

---

## O que foi feito

Liste as mudanças implementadas.

-
- ***

## Como testar

Passo a passo para validar o comportamento esperado.

1.
2.
3.

---

## Evidências visuais

Prints ou GIFs do resultado. Obrigatório para mudanças de frontend. Remova esta seção se não houver frontend.

---

## Riscos ou pontos de atenção

Há algo que o revisor precisa saber? Dependências, side effects, decisões não óbvias?

- ***

## Checklist

- [ ] A funcionalidade está funcionando localmente
- [ ] O PR tem escopo único e não mistura responsabilidades
- [ ] Branch atualizada com a `main` e sem conflitos
- [ ] Testes executados e passando
- [ ] Padrões de código e Git seguidos ([ver padrões](review.md))
- [ ] Documentação (MkDocs) atualizada, se necessário

**Segurança e Logs** _(marque quando aplicável)_

- [ ] Senhas/tokens não estão expostos no código
- [ ] Rotas novas estão protegidas por autenticação
- [ ] Evento de log implementado (Login / Upload / Download / Exclusão / Acesso inválido)
- [ ] Dados do usuário estão isolados por ID autenticado

---

> PR com impacto em arquitetura, segurança ou deploy requer aprovação do **Tech Lead**.
