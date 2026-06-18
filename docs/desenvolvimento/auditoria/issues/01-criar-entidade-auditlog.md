# Issue #34: Criar entidade AuditLog

## Tipo

Backend

## Equipe responsável

Backend

## Labels sugeridas

`auditoria`, `backend`, `lgpd`

## Dependências

Nenhuma. É a base das demais issues de auditoria.

## Descrição

Como engenheiro de backend, quero uma entidade `AuditLog` persistida em Postgres
para que eventos sensíveis sejam armazenados de forma consultável e auditável,
atendendo LGPD e HIPAA.

## Tarefas

- [ ] Criar `backend/src/entities/audit-log.entity.ts` com os campos: `id` (uuid),
      `userId` (uuid nullable), `tipoEvento` (enum), `recursoId` (string nullable),
      `status` (enum `SUCCESS` ou `FAILURE`), `ipOrigem` (string), `userAgent`
      (string nullable), `timestamp` (`CreateDateColumn`).
- [ ] Criar enum `TipoEventoAuditoria` no mesmo arquivo, contendo os valores
      listados em `docs/projeto/auditoria_plano.md`.
- [ ] Registrar a entidade no array `entities` de `backend/src/app.module.ts`.
- [ ] Manter a estratégia atual do projeto: `synchronize: true` em dev e via
      flag `DB_SYNC` em produção. Não há migration formal.
- [ ] A entidade não pode ter regras de negócio. Apenas dados.

## Critérios de Aceitação

- A tabela `audit_logs` é criada automaticamente quando o backend sobe em dev.
- O campo `timestamp` é preenchido pelo banco via `CreateDateColumn`.
- A entidade não importa nenhum service.

## Critérios de Teste

- Jest unitário: criar um teste que instancia a entidade, atribui campos e
  valida que o objeto é serializável.
- Supertest integração: subir o módulo TypeORM em ambiente de teste e
  verificar que a tabela existe via `dataSource.getMetadata(AuditLog)`.

## Referências

- `docs/projeto/auditoria_plano.md`
- `backend/src/entities/user.entity.ts` como referência de padrão
