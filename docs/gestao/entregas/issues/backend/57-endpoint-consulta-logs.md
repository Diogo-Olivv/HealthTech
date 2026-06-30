# Issue #57 - Endpoint de consulta de logs (admin)

**Tipo:** Backend

**Status:** Planejada

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #50, #51, #56

---

## Descrição

Como administrador do sistema, quero consultar os logs de auditoria com filtros e paginação, para investigar incidentes e atender requisições do DPO em prazos exigidos pela LGPD.

## Tarefas

- [ ] Criar `backend/src/audit/audit.controller.ts` com `GET /audit/logs`, protegida por `@UseGuards(JwtAuthGuard, RolesGuard)` e `@Roles(UserType.ADMIN)`.
- [ ] Aceitar query params: `userId`, `tipoEvento`, `dataInicio`, `dataFim`, `page` (default 1), `limit` (default 50, máximo 200).
- [ ] Validar query via DTO com `class-validator`.
- [ ] Implementar `AuditLogService.listar(filtros, paginacao)` retornando `{ items, total, page, limit }`.
- [ ] Ordenação fixa: `timestamp DESC`.
- [ ] Não auditar a própria rota de consulta para evitar ruído.

## Critérios de Aceitação

- Usuário não-admin recebe `403`.
- Sem filtros, retorna a página mais recente.
- Filtros por `dataInicio` e `dataFim` aceitam ISO 8601 e validam ordem.
- `limit` acima do máximo é truncado.

## Critérios de Teste

- Jest unitário: validar a query do TypeORM montada a partir dos filtros.
- Supertest integração: três cenários (acesso negado para médico, listagem para admin sem filtros, listagem para admin com filtro por `tipoEvento`).
