# Issue #59 - Documentar política de auditoria

**Tipo:** Documentação

**Status:** Planejada

**Responsáveis:** [Diogo](https://github.com/Diogo-Olivv)

**Depende de:** #50, #51

---

## Descrição

Como responsável pelo projeto, quero um documento oficial em `docs/projeto/auditoria.md` descrevendo o que é auditado, por quanto tempo é retido e quem tem permissão de consulta, para apresentar a stakeholders e DPO.

## Tarefas

- [ ] Criar `docs/projeto/auditoria.md` com seções:
  - Objetivo e marco regulatório (LGPD, HIPAA).
  - Lista de eventos auditados com referência cruzada ao `docs/projeto/auditoria_plano.md`.
  - Tempo de retenção mínimo (90 dias) e plano de arquivamento.
  - Quem pode consultar (apenas `ADMIN`).
  - Procedimento de resposta a incidente.
- [ ] Atualizar `README.md` raiz adicionando o link para esse documento.

## Critérios de Aceitação

- Documento publicado e linkado a partir do README raiz.
- Todos os eventos do enum `TipoEventoAuditoria` estão descritos no documento.

## Critérios de Teste

Sem testes automatizados. Revisão obrigatória por outro engenheiro do time antes do merge.
