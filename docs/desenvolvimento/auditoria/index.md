# Auditoria

Camada de rastreabilidade do HealthTech, exigida por LGPD e HIPAA. Cada ação sensível na plataforma (login, cadastro, upload, download, visualização, vínculo médico-paciente e revogações) gera um registro imutável com usuário, tipo de evento, status e IP de origem.

---

## O que é auditado

O enum atual em `backend/src/entities/audit-log/audit-log.entity.ts` (`TipoEventoAuditoria`) cobre:

| Domínio       | Eventos                                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| Autenticação  | `LOGIN`, `LOGOUT`                                                                                                    |
| Usuários      | `CRIACAO_USUARIO`, `ATUALIZACAO_USUARIO`, `EXCLUSAO_USUARIO`                                                         |
| Arquivos      | `UPLOAD_ARQUIVO`, `DOWNLOAD_ARQUIVO`, `VISUALIZACAO_ARQUIVO`, `EXCLUSAO_ARQUIVO`                                     |
| Vínculos      | `SOLICITACAO_VINCULO`, `APROVACAO_VINCULO`, `REJEICAO_VINCULO`, `REVOGACAO_VINCULO`, `VINCULO_MEDICO_PACIENTE`, `DESVINCULO_MEDICO_PACIENTE` |
| Segurança     | `ACESSO_NEGADO`, `TENTATIVA_ESCALONAMENTO_PRIVILEGIO`                                                                |

O par `(tipoEvento, status)` substitui eventos "sucesso" e "falha" separados. Falha de login, por exemplo, é `tipoEvento = LOGIN` com `status = FAILURE`. `LOGIN_FALHA` foi removido do enum (issue #57).

---

## Estratégia técnica

- Persistência em PostgreSQL via TypeORM (entidade `AuditLog`, tabela `audit_logs`).
- Emissão simultânea via `Logger` do NestJS (`log` para SUCCESS, `warn` para FAILURE), o que dá visibilidade no Cloud Logging.
- Captura por `AuditInterceptor` global, ativado pelo decorator `@Audit({ evento, extractRecursoId? })`.
- Falha de auditoria não derruba a requisição original. O erro do `AuditLogService` é isolado.
- `AuthRequest` centralizado em `backend/src/auth/models/AuthRequest.ts` para tipagem única de `req.user`.

Detalhes de implementação em [Plano Técnico](plano.md). Endpoint de consulta e regras de acesso em [Arquitetura do Backend](../../arquitetura/backend.md).

---

## Consulta pelo admin

`GET /audit/logs` (restrita a `UserType.ADMIN`) suporta filtros por `userId`, `tipoEvento`, `dataInicio` e `dataFim`, além de paginação (`page`, `limit`). `limit` é capado silenciosamente em `200`; `dataFim < dataInicio` retorna `400 Bad Request`. A própria rota não é auditada, por decisão da issue #57, para evitar ruído.

---

## Issues

| # | Título | Tipo | Status |
| - | ------ | ---- | ------ |
| [01](issues/01-criar-entidade-auditlog.md) | Criar entidade AuditLog | Backend | Concluída |
| [02](issues/02-implementar-auditlog-service.md) | Implementar AuditLogService | Backend | Concluída |
| [03](issues/03-criar-audit-interceptor-decorator.md) | Criar AuditInterceptor e @Audit | Backend | Concluída |
| [04](issues/04-auditoria-rotas-autenticacao.md) | Auditoria em rotas de autenticação | Backend | Concluída |
| [05](issues/05-auditoria-rotas-arquivos.md) | Auditoria em rotas de arquivos | Backend | Concluída |
| [06](issues/06-auditoria-rotas-vinculo.md) | Auditoria em rotas de vínculo | Backend | Concluída |
| [07](issues/07-criar-role-admin.md) | Criar UserType ADMIN | Backend | Concluída |
| [08](issues/08-endpoint-consulta-logs-admin.md) | Endpoint de consulta (admin) | Backend | Concluída |
| [09](issues/09-tela-consulta-logs-admin.md) | Tela de consulta (admin) | Frontend | Em andamento |
| [10](issues/10-documentar-politica-auditoria.md) | Documentar política de auditoria | Docs | Concluída |
| [11](issues/11-retencao-logs-cron.md) | Retenção de logs (cron) | Infra | Pendente |

---

## Histórias de Usuário

Ver [Histórias de Usuário da Auditoria](historias.md).

---

## Responsáveis

Hugo Rosa (backend, seed do admin, endpoint), Martin (interceptor e cobertura de rotas), Diogo (refactor da API do decorator, consolidação em enum único), Gabriel e Lucas (tela de consulta, em andamento).
