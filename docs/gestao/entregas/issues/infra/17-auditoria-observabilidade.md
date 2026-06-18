# Issue #17 - Estrutura de auditoria e observabilidade

**Tipo:** Infra

**Status:** Em andamento

**Responsável:** A definir

---

## Descrição

Como sistema, preciso registrar eventos críticos para rastrear ações dos usuários e investigar problemas de segurança.

## Tarefas

- [ ] Configurar Cloud Logging
- [ ] Definir padrão de logs estruturados
- [ ] Registrar eventos de Login, Upload, Download, Exclusão e acessos inválidos
- [ ] Criar documentação do fluxo de auditoria

## Critérios de Aceitação

- Logs persistidos de forma durável.
- Cada log contém: timestamp, user_id, tipo_evento e status.
- Logs consultáveis pelo time.

## Observação

Relacionada com as issues de auditoria #34 a #44.
