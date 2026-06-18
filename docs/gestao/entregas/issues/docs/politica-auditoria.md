# Issue #43 - Documentar política de auditoria

**Tipo:** Documentação

**Status:** Pendente

**Responsável:** A definir

**Depende de:** #34, #35

---

## Descrição

Como responsável pelo projeto, quero um documento oficial descrevendo o que é auditado, por quanto tempo é retido e quem tem permissão de consulta, para apresentar a stakeholders e ao DPO.

## Tarefas

- [ ] Criar `docs/projeto/auditoria.md` com seções:
    - Objetivo e marco regulatório (LGPD, HIPAA)
    - Lista de eventos auditados
    - Tempo de retenção mínimo (90 dias) e plano de arquivamento
    - Quem pode consultar (apenas ADMIN)
    - Procedimento de resposta a incidente
- [ ] Atualizar `README.md` raiz adicionando link para esse documento

## Critérios de Aceitação

- Documento publicado e linkado a partir do README raiz.
- Todos os eventos do enum `TipoEventoAuditoria` estão descritos.

## Critérios de Teste

Sem testes automatizados. Revisão obrigatória por outro engenheiro antes do merge.
