# Issue #39: Aplicar auditoria em rotas de vínculo médico-paciente

## Tipo

Backend

## Equipe responsável

Backend

## Labels sugeridas

`auditoria`, `backend`, `lgpd`

## Dependências

- #36

## Descrição

Como administrador do sistema, quero auditar a criação e remoção de vínculos
entre médico e paciente, porque o vínculo é o que destrava o acesso a dados
sensíveis do paciente.

## Tarefas

- [ ] Em `backend/src/medico-paciente/medico-paciente.controller.ts`, anotar:
  - `POST /medico-paciente/vincular` com `@Audit('LINK_CREATED')`.
  - `DELETE /medico-paciente/desvincular` com `@Audit('LINK_REMOVED')`.
- [ ] Preencher `recursoId` com o `pacienteId` enviado no body.
- [ ] Confirmar que falhas (vínculo duplicado, paciente inexistente) caem no
      `catchError` do interceptor e geram registro com `status: 'FAILURE'`.

## Critérios de Aceitação

- Cada vínculo criado gera um registro com `LINK_CREATED`.
- Cada vínculo removido gera um registro com `LINK_REMOVED`.
- Tentativa de remover vínculo inexistente gera registro com `FAILURE` e a
  requisição mantém o status HTTP original.

## Critérios de Teste

- Jest unitário: simular controller em sucesso e falha, validar payload
  enviado ao serviço de auditoria.
- Supertest integração: criar e remover um vínculo, validar duas linhas em
  `audit_logs`.

## Referências

- `docs/projeto/auditoria_plano.md`
- `backend/src/medico-paciente/medico-paciente.controller.ts`
