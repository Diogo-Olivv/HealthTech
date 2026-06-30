# Issue #51 - Implementar AuditLogService com Logger do NestJS

**Tipo:** Backend

**Status:** Concluída

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #50

---

## Descrição

Como engenheiro de backend, quero um `AuditLogService` que persista cada evento em Postgres e simultaneamente emita uma linha de log via `Logger` do NestJS, para garantir rastreabilidade no banco e visibilidade em Cloud Logging.

## Tarefas

- [x] Criar módulo `backend/src/audit/audit.module.ts` global (`@Global()`), exportando `AuditLogService`.
- [x] Implementar `AuditLogService` com método `registrar(evento: TipoEventoAuditoria, userId: string | null, recursoId: string | null, status: 'SUCCESS' | 'FAILURE', request: Request)`.
- [x] Extrair `ipOrigem` de `request.ip` e `userAgent` de `request.headers['user-agent']` dentro do serviço.
- [x] Persistir via TypeORM usando o repositório de `AuditLog`.
- [x] Instanciar `private readonly logger = new Logger(AuditLogService.name)` e chamar `this.logger.log(...)` ou `this.logger.warn(...)` conforme o status do evento.
- [x] Envolver a chamada de persistência em `try/catch`. Em caso de falha do banco, emitir `this.logger.error(...)` e seguir sem propagar a exceção.
- [x] Importar `AuditModule` em `AppModule`.

## Critérios de Aceitação

- Chamadas ao serviço com banco indisponível não derrubam a requisição original.
- Cada chamada gera exatamente um registro em `audit_logs` e uma linha no `Logger`.
- `ipOrigem` e `userAgent` são extraídos automaticamente do `request`.

## Critérios de Teste

- Jest unitário: mockar o repositório de `AuditLog` e verificar (a) caminho feliz, (b) repositório que lança erro não propaga exceção, (c) `Logger` recebe a chamada esperada.
- Supertest integração: instanciar o módulo, chamar `registrar` com um request forjado e validar que a linha existe no banco.
