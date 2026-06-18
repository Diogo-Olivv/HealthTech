# Issue #38: Aplicar auditoria em rotas de arquivos

## Tipo

Backend

## Equipe responsável

Backend

## Labels sugeridas

`auditoria`, `backend`, `lgpd`

## Dependências

- #36

## Descrição

Como administrador do sistema, quero auditar listagens e uploads de arquivos
de saúde, para rastrear quem acessou quais dados de pacientes, atendendo
LGPD e HIPAA.

## Escopo

Somente rotas existentes hoje em `backend/src/arquivos/arquivos.controller.ts`:

- `GET /arquivos` (listagem por paciente ou por médico)
- `POST /arquivos/upload`

Rotas de download e exclusão não existem ainda. Quando forem criadas, a
auditoria deve ser adicionada na própria issue que criar a rota, não nesta.

## Tarefas

- [ ] Anotar `GET /arquivos` com `@Audit('FILE_LIST_ACCESSED')`.
- [ ] Anotar `POST /arquivos/upload` com `@Audit('FILE_UPLOAD_SUCCESS')`. O
      `catchError` do interceptor registra `FILE_UPLOAD_FAILED` em caso de
      falha (vínculo ausente, validação de arquivo, falha de GCS).
- [ ] Em casos de `ForbiddenException` lançada por `RolesGuard` ou
      `ArquivosService.uploadArquivo`, garantir que o evento gravado seja
      `ACCESS_DENIED` (ou `FILE_UPLOAD_FAILED` com status `FAILURE`,
      conforme decisão tomada na #37).
- [ ] Preencher `recursoId` com o `pacienteId` do request (upload) ou com
      o `userId` autenticado quando se trata de listagem.

## Critérios de Aceitação

- Cada chamada a `GET /arquivos` gera uma linha com `FILE_LIST_ACCESSED`.
- Cada upload bem-sucedido gera `FILE_UPLOAD_SUCCESS` com `recursoId` igual
  ao `pacienteId`.
- Upload de médico sem vínculo gera `FILE_UPLOAD_FAILED` (ou
  `ACCESS_DENIED`) e a requisição mantém o `403` original.

## Critérios de Teste

- Jest unitário: simular o handler do controller em sucesso e falha,
  validar tipo de evento e `recursoId` enviado.
- Supertest integração: três cenários (listagem como paciente, listagem
  como médico, upload sem vínculo). Validar linhas no banco e status HTTP.

## Referências

- `docs/projeto/auditoria_plano.md`
- `backend/src/arquivos/arquivos.controller.ts`
- `backend/src/arquivos/arquivos.service.ts`
