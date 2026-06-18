# Issue #35: Implementar AuditLogService com Logger do NestJS

## Tipo

Backend

## Equipe responsável

Backend

## Labels sugeridas

`auditoria`, `backend`, `lgpd`

## Dependências

- #34

## Descrição

Como engenheiro de backend, quero um `AuditLogService` que persista cada evento
em Postgres e simultaneamente emita uma linha de log via `Logger` do NestJS,
para garantir rastreabilidade no banco e visibilidade em Cloud Logging.

## Tarefas

- [ ] Criar módulo `backend/src/audit/audit.module.ts` global
      (`@Global()`), exportando `AuditLogService`.
- [ ] Implementar `AuditLogService` com método
      `registrar(evento: TipoEventoAuditoria, userId: string | null, recursoId: string | null, status: 'SUCCESS' | 'FAILURE', request: Request)`.
- [ ] Extrair `ipOrigem` de `request.ip` e `userAgent` de
      `request.headers['user-agent']` dentro do serviço.
- [ ] Persistir via TypeORM usando o repositório de `AuditLog`.
- [ ] Instanciar `private readonly logger = new Logger(AuditLogService.name)` e
      chamar `this.logger.log(...)` ou `this.logger.warn(...)` conforme o status
      do evento.
- [ ] Envolver a chamada de persistência em `try/catch`. Em caso de falha do
      banco, emitir `this.logger.error(...)` e seguir sem propagar a exceção.
- [ ] Importar `AuditModule` em `AppModule`.

## Critérios de Aceitação

- Chamadas ao serviço com banco indisponível não derrubam a requisição original.
- Cada chamada gera exatamente um registro em `audit_logs` e uma linha no
  `Logger`.
- `ipOrigem` e `userAgent` são extraídos automaticamente do `request`.

## Critérios de Teste

- Jest unitário: mockar o repositório de `AuditLog` e verificar
  (a) caminho feliz, (b) repositório que lança erro não propaga exceção,
  (c) `Logger` recebe a chamada esperada.
- Supertest integração: instanciar o módulo, chamar `registrar` com um request
  forjado e validar que a linha existe no banco.

## Referências

- `docs/projeto/auditoria_plano.md`
- `backend/src/users/users.service.ts` como referência de injeção de repositório
