# Issue #9 - Cadastro de Paciente

**Tipo:** Backend

**Status:** Concluída

**Responsáveis:** [Luiza de Melo](https://github.com/LuizaCarvalho691), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #8

---

## Descrição

Como paciente, quero me cadastrar na plataforma para acessar meus exames vinculados.

## Tarefas

- [x] Criar entidade Paciente conforme decisão da Issue #8
- [x] Criar DTO com validação de campos obrigatórios
- [x] Aplicar hash bcrypt na senha
- [x] Garantir que `passwordHash` não retorne na resposta

## Critérios de Aceitação

- Endpoint recebe nome, email, senha, CPF, data de nascimento.
- Email único entre todos os usuários. CPF único entre pacientes.
- Senha armazenada como hash bcrypt.
- Resposta sem o campo `passwordHash`.

## Critérios de Teste

- Jest unitário: senha vira hash antes de salvar.
- Supertest: cadastro retorna `201` sem `passwordHash`.
