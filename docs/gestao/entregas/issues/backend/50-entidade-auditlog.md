# Issue #50 - Criar entidade AuditLog

**Tipo:** Backend

**Status:** Concluída

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** -

---

## Descrição

Como engenheiro de backend, quero uma entidade `AuditLog` persistida em Postgres para que eventos sensíveis sejam armazenados de forma consultável e auditável, atendendo LGPD e HIPAA.

## Tarefas

- [x] Criar `backend/src/entities/audit-log.entity.ts` com os campos: `id` (uuid), `userId` (uuid nullable), `tipoEvento` (enum), `recursoId` (string nullable), `status` (enum `SUCCESS` ou `FAILURE`), `ipOrigem` (string), `userAgent` (string nullable), `timestamp` (`CreateDateColumn`).
- [x] Criar enum `TipoEventoAuditoria` no mesmo arquivo, contendo os valores listados em `docs/projeto/auditoria_plano.md`.
- [x] Registrar a entidade no array `entities` de `backend/src/app.module.ts`.
- [x] Manter a estratégia atual do projeto: `synchronize: true` em dev e via flag `DB_SYNC` em produção. Não há migration formal.
- [x] A entidade não pode ter regras de negócio. Apenas dados.

## Critérios de Aceitação

- A tabela `audit_logs` é criada automaticamente quando o backend sobe em dev.
- O campo `timestamp` é preenchido pelo banco via `CreateDateColumn`.
- A entidade não importa nenhum service.

## Critérios de Teste

- Jest unitário: criar um teste que instancia a entidade, atribui campos e valida que o objeto é serializável.
- Supertest integração: subir o módulo TypeORM em ambiente de teste e verificar que a tabela existe via `dataSource.getMetadata(AuditLog)`.
