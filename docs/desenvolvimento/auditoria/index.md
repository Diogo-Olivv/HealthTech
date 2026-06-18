# Auditoria

Camada de rastreabilidade do HealthTech, exigida por LGPD e HIPAA. Cada ação
sensível na plataforma (login, upload, vínculo médico-paciente) gera um
registro imutável com usuário, tipo de evento, status e IP de origem.

---

## O que é auditado

| Domínio | Eventos |
| ------- | ------- |
| Autenticação | `LOGIN_SUCCESS`, `LOGIN_FAILED`, `USER_REGISTERED_PACIENTE`, `USER_REGISTERED_MEDICO` |
| Arquivos | `FILE_UPLOAD_SUCCESS`, `FILE_UPLOAD_FAILED`, `FILE_LIST_ACCESSED` |
| Vínculos | `LINK_CREATED`, `LINK_REMOVED`, `LINK_FAILED` |
| Geral | `ACCESS_DENIED` |

> Eventos de download e exclusão de arquivo serão adicionados quando as rotas
> correspondentes forem implementadas.

---

## Estratégia técnica

- Persistência em **Postgres** via TypeORM (entidade `AuditLog`).
- Emissão simultânea via **Logger do NestJS** para Cloud Logging.
- Captura por `AuditInterceptor` global, ativado pelo decorator `@Audit(tipo)`.
- Falha de auditoria nunca derruba a requisição original.

Detalhes completos: [Plano Técnico](plano.md)

---

## Issues

| # | Título | Tipo | Status |
| - | ------ | ---- | ------ |
| [01](issues/01-criar-entidade-auditlog.md) | Criar entidade AuditLog | Backend | Pendente |
| [02](issues/02-implementar-auditlog-service.md) | Implementar AuditLogService | Backend | Pendente |
| [03](issues/03-criar-audit-interceptor-decorator.md) | Criar AuditInterceptor e @Audit | Backend | Pendente |
| [04](issues/04-auditoria-rotas-autenticacao.md) | Auditoria em rotas de autenticação | Backend | Pendente |
| [05](issues/05-auditoria-rotas-arquivos.md) | Auditoria em rotas de arquivos | Backend | Pendente |
| [06](issues/06-auditoria-rotas-vinculo.md) | Auditoria em rotas de vínculo | Backend | Pendente |
| [07](issues/07-criar-role-admin.md) | Criar UserType ADMIN | Backend | Pendente |
| [08](issues/08-endpoint-consulta-logs-admin.md) | Endpoint de consulta (admin) | Backend | Pendente |
| [09](issues/09-tela-consulta-logs-admin.md) | Tela de consulta (admin) | Frontend | Pendente |
| [10](issues/10-documentar-politica-auditoria.md) | Documentar política de auditoria | Docs | Pendente |
| [11](issues/11-retencao-logs-cron.md) | Retenção de logs (cron) | Infra | Pendente |

---

## Histórias de Usuário

Ver [Histórias de Usuário da Auditoria](historias.md)

---

## Responsável

Hugo Rosa.
