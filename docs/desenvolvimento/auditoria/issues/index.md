# Issues de Auditoria

Planejamento das issues de implementação da camada de auditoria. A próxima
issue a ser aberta no GitHub é a **#34**.

---

## Status geral

| # | Título | Tipo | Dependências | Status |
| - | ------ | ---- | ------------ | ------ |
| [#34](01-criar-entidade-auditlog.md) | Criar entidade AuditLog | Backend | - | Pendente |
| [#35](02-implementar-auditlog-service.md) | Implementar AuditLogService | Backend | #34 | Pendente |
| [#36](03-criar-audit-interceptor-decorator.md) | Criar AuditInterceptor e @Audit | Backend | #35 | Pendente |
| [#37](04-auditoria-rotas-autenticacao.md) | Auditoria em rotas de autenticação | Backend | #36 | Pendente |
| [#38](05-auditoria-rotas-arquivos.md) | Auditoria em rotas de arquivos | Backend | #36 | Pendente |
| [#39](06-auditoria-rotas-vinculo.md) | Auditoria em rotas de vínculo | Backend | #36 | Pendente |
| [#40](07-criar-role-admin.md) | Criar UserType ADMIN | Backend | - | Pendente |
| [#41](08-endpoint-consulta-logs-admin.md) | Endpoint de consulta (admin) | Backend | #34, #35, #40 | Pendente |
| [#42](09-tela-consulta-logs-admin.md) | Tela de consulta (admin) | Frontend | #40, #41 | Pendente |
| [#43](10-documentar-politica-auditoria.md) | Documentar política de auditoria | Docs | #34, #35 | Pendente |
| [#44](11-retencao-logs-cron.md) | Retenção de logs (cron) | Infra | #34, #35 | Pendente |

---

## Ordem recomendada de execução

```
Fase 1 (base)
  #34 Entidade AuditLog
  #40 Role ADMIN          (pode ser paralelo ao #34)

Fase 2 (serviço e interceptor)
  #35 AuditLogService     (depende de #34)
  #36 AuditInterceptor    (depende de #35)

Fase 3 (aplicar nas rotas)
  #37 Auth                (paralelo)
  #38 Arquivos            (paralelo)
  #39 Vínculo             (paralelo)

Fase 4 (consulta)
  #41 Endpoint admin      (depende de #34, #35, #40)
  #42 Tela admin          (depende de #40, #41)

Fase 5 (maturidade)
  #43 Documentação
  #44 Retenção / cron
```
