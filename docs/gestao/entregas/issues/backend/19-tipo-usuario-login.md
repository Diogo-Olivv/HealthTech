# Issue #19 - Identificar tipo de usuário no login

**Tipo:** Backend

**Status:** Concluída

**Responsáveis:** [Luiza de Melo](https://github.com/LuizaCarvalho691), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #9, #10

---

## Descrição

Como sistema, quero retornar o tipo do usuário no login para que o frontend identifique o perfil e o backend valide permissões nas rotas.

## Tarefas

- [x] Ajustar service de login para localizar o usuário pelo email
- [x] Incluir tipo (PACIENTE ou MEDICO) no payload do JWT
- [x] Criar guard que verifica o tipo no token para proteger rotas

## Critérios de Aceitação

- Token JWT contém id e tipo do usuário.
- Rota "apenas médico" rejeita paciente com `403`.
- Rota "apenas paciente" rejeita médico com `403`.

## Critérios de Teste

- Jest unitário: token gerado contém tipo do usuário.
- Supertest: rota restrita a médico bloqueia paciente.
