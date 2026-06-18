# Issue #6 - Tela de cadastro de Médico

**Tipo:** Frontend

**Status:** Concluída

**Responsável:** [Lucas de Paula](https://github.com/lucaspaulaleal)

---

## Descrição

Como médico, quero ter um formulário de cadastro para criar minha conta na plataforma.

## Tarefas

- [x] Criar página `/register/medico` no App Router
- [x] Criar service `medicos.service.ts` para chamada HTTP
- [x] Criar DTOs de request e response em `dto/`
- [x] Estilizar com CSS Modules
- [x] Tratar estados de loading, sucesso e erro

## Critérios de Aceitação

- Formulário contém: nome, email, senha, CRM, especialidade.
- Página chama o service, nunca faz `fetch` direto.
- Exibe mensagem de erro clara quando o backend rejeita o cadastro.
- Exibe mensagem de sucesso após cadastro bem-sucedido.
- Botão desabilitado durante o envio.

## Critérios de Teste

- React Testing Library: mensagem de erro aparece quando campos obrigatórios estão vazios.
