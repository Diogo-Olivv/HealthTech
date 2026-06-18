# Issue #7 - Redirecionamento por tipo de usuário após login

**Tipo:** Frontend

**Status:** Concluída

**Responsável:** [Lucas de Paula](https://github.com/lucaspaulaleal)

**Depende de:** #19

---

## Descrição

Como usuário logado, quero ser direcionado para a tela correta do meu perfil (paciente ou médico) após o login.

## Tarefas

- [x] Armazenar tipo do usuário após login (localStorage / token)
- [x] Redirecionar paciente para `/paciente` após login bem-sucedido
- [x] Redirecionar médico para `/medico` após login bem-sucedido
- [x] Criar páginas iniciais básicas para cada perfil

## Critérios de Aceitação

- Login como paciente leva para `/paciente`.
- Login como médico leva para `/medico`.
- Tipo do usuário disponível em toda a aplicação após login.

## Critérios de Teste

- React Testing Library: redirecionamento correto de acordo com o tipo retornado no login.
