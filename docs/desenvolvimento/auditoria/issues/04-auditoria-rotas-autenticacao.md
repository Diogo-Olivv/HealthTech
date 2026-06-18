# Issue #37: Aplicar auditoria em rotas de autenticação e cadastro

## Tipo

Backend

## Equipe responsável

Backend

## Labels sugeridas

`auditoria`, `backend`, `lgpd`

## Dependências

- #36

## Descrição

Como administrador do sistema, quero que toda tentativa de login e todo
cadastro de usuário sejam auditados, para conseguir investigar acessos
suspeitos e atender LGPD.

## Tarefas

- [ ] Em `backend/src/users/users.controller.ts`, anotar:
  - `POST /users/login` com `@Audit('LOGIN_SUCCESS')`. O interceptor já
    registra `LOGIN_FAILED` no `catchError`. Confirmar que o mapeamento
    sucesso/falha está correto via teste.
  - `POST /users/pacientes` com `@Audit('USER_REGISTERED_PACIENTE')`.
  - `POST /users/medicos` com `@Audit('USER_REGISTERED_MEDICO')`.
- [ ] Avaliar se o evento de falha precisa de tipo distinto
      (`LOGIN_FAILED` vs `LOGIN_SUCCESS`). Caso positivo, ajustar o
      interceptor para resolver dois tipos (um para `SUCCESS` e outro para
      `FAILURE`) via decorator estendido `@Audit({ onSuccess, onFailure })`.
- [ ] Garantir que o `recursoId` seja preenchido com o `userId` retornado
      pelo service em registros bem-sucedidos.

## Critérios de Aceitação

- Toda chamada a `POST /users/login` gera um registro com `tipoEvento`
  `LOGIN_SUCCESS` ou `LOGIN_FAILED`.
- Tentativas com email inexistente registram `LOGIN_FAILED` com `userId = null`.
- Cadastros bem-sucedidos registram o `userId` do recém-criado em `recursoId`.

## Critérios de Teste

- Jest unitário: simular o handler retornando sucesso e falha; validar que o
  serviço foi chamado com o tipo certo.
- Supertest integração: três cenários ponta a ponta (login válido, login
  inválido, cadastro de paciente). Cada um deve gerar uma linha em `audit_logs`.

## Referências

- `docs/projeto/auditoria_plano.md`
- `backend/src/users/users.controller.ts`
