# Issue #56 - Criar UserType ADMIN

**Tipo:** Backend

**Status:** Planejada

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** -

---

## Descrição

Como engenheiro de backend, quero adicionar o tipo de usuário `ADMIN` ao enum `UserType` para que seja possível restringir o endpoint de consulta de logs e a área administrativa do frontend a esse perfil.

## Tarefas

- [ ] Adicionar `ADMIN = 'ADMIN'` ao enum `UserType` em `backend/src/entities/user.entity.ts`.
- [ ] Confirmar que o JWT payload em `users.service.ts` já carrega `tipo`, então o `RolesGuard` passa a aceitar `@Roles(UserType.ADMIN)` sem nenhuma mudança extra.
- [ ] Criar um seed manual em `backend/src/users/seeds/admin.seed.ts` que cria um admin a partir de variáveis de ambiente `ADMIN_EMAIL` e `ADMIN_PASSWORD` quando ausente. Não rodar em produção sem aprovação.
- [ ] Documentar no `backend/README.md` como criar o primeiro admin em desenvolvimento.
- [ ] Garantir que rotas de cadastro público (`POST /users/pacientes` e `POST /users/medicos`) nunca aceitem `tipo = ADMIN`.

## Critérios de Aceitação

- O enum aceita o valor `ADMIN`.
- Tentar registrar um admin via rotas públicas retorna `400` ou similar.
- O seed cria um admin com hash bcrypt da senha.

## Critérios de Teste

- Jest unitário: validar que o seed gera bcrypt corretamente e que rotas públicas rejeitam payload com `tipo: 'ADMIN'`.
- Supertest integração: login com admin gera JWT com `tipo: 'ADMIN'`.
