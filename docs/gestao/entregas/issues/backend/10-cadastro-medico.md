# Issue #10 - Cadastro de Médico

**Tipo:** Backend

**Status:** Concluída

**Responsáveis:** [Luiza de Melo](https://github.com/LuizaCarvalho691), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #8

---

## Descrição

Como médico, quero me cadastrar na plataforma para gerenciar exames dos meus pacientes.

## Tarefas

- [x] Criar entidade Médico conforme decisão da Issue #8
- [x] Criar DTO com validação de campos obrigatórios
- [x] Aplicar hash bcrypt na senha
- [x] Garantir que `passwordHash` não retorne na resposta

## Critérios de Aceitação

- Endpoint recebe nome, email, senha, CRM, especialidade.
- Email único entre todos os usuários. CRM único entre médicos.
- Senha como hash bcrypt. Resposta sem `passwordHash`.

## Critérios de Teste

- Jest unitário: senha vira hash antes de salvar.
- Supertest: cadastro retorna `201` sem `passwordHash`.
