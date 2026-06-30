# Issue #60 - Configurar retenção de logs de auditoria

**Tipo:** Infra

**Status:** Planejada

**Responsáveis:** [Diogo](https://github.com/Diogo-Olivv), [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #50, #51

---

## Descrição

Como engenheiro de infra, quero um job recorrente que arquive ou marque logs com mais de 90 dias, para conter o crescimento da tabela e cumprir a política de retenção.

## Tarefas

- [ ] Adicionar dependência `@nestjs/schedule` no `backend/package.json`.
- [ ] Importar `ScheduleModule.forRoot()` em `AppModule`.
- [ ] Criar `AuditRetentionService` com método anotado `@Cron(CronExpression.EVERY_DAY_AT_3AM)` que move ou marca registros com `timestamp` anterior a `NOW() - 90 days`.
- [ ] Decisão a documentar: arquivar em tabela `audit_logs_archive` ou apenas marcar com `archivedAt`. Recomendado: marcar e excluir só após backup confirmado.
- [ ] Garantir que o job rode em apenas uma instância em Cloud Run (usar lock via Postgres `pg_try_advisory_lock`).
- [ ] Atualizar `cloudbuild.yaml` se forem necessárias variáveis de ambiente novas.

## Critérios de Aceitação

- O job executa às 03:00 todos os dias em produção.
- Logs com mais de 90 dias são arquivados ou marcados.
- Concorrência entre instâncias é controlada por lock no banco.

## Critérios de Teste

- Jest unitário: chamar o método do serviço com registros antigos forjados no banco e validar a marcação ou arquivamento.
- Supertest integração: subir o módulo, inserir registros com `timestamp` manipulado e validar o efeito do job.
