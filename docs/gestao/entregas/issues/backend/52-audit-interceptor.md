# Issue #52 - Criar AuditInterceptor global e decorator @Audit

**Tipo:** Backend

**Status:** Em andamento

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #51

---

## Descrição

Como engenheiro de backend, quero um interceptor global que leia o decorator `@Audit('TIPO_EVENTO')` em cada rota e dispare o `AuditLogService` no fim do ciclo, tanto em sucesso quanto em falha, para reduzir o acoplamento entre controllers e auditoria.

## Tarefas

- [ ] Criar `backend/src/audit/audit.decorator.ts` com `export const Audit = (tipo: TipoEventoAuditoria) => SetMetadata('audit:tipo', tipo);`.
- [ ] Criar `backend/src/audit/audit.interceptor.ts` implementando `NestInterceptor` com `Reflector`. No `intercept`, ler o tipo do handler; se ausente, prosseguir sem auditar.
- [ ] No `tap` registrar `status: 'SUCCESS'`. No `catchError` registrar `status: 'FAILURE'` e re-lançar o erro.
- [ ] Extrair `userId` de `request.user?.id`. Quando ausente (ex: login que falhou) passar `null`.
- [ ] Registrar o interceptor globalmente em `AppModule` via `{ provide: APP_INTERCEPTOR, useClass: AuditInterceptor }`.
- [ ] Documentar uso do decorator com exemplo no `README.md` do backend.

## Critérios de Aceitação

- Rotas sem `@Audit` não geram log.
- Rotas com `@Audit` geram exatamente um log por requisição, refletindo o status real da resposta.
- Exceções continuam fluindo normalmente para o `ExceptionFilter` padrão.

## Critérios de Teste

- Jest unitário: criar um controller fake com `@Audit('LOGIN_SUCCESS')`, invocar o interceptor com handler que resolve e outro que rejeita, e verificar que `AuditLogService.registrar` recebeu `SUCCESS` e `FAILURE` respectivamente.
- Supertest integração: chamar uma rota real anotada e validar a linha no banco.
