# Issue #33 - Tela de listagem de arquivos

**Tipo:** Frontend

**Status:** Concluída

**Responsáveis:** [Luiza de Melo](https://github.com/LuizaCarvalho691), [Lucas de Paula](https://github.com/lucaspaulaleal), [Gabriel Robson](https://github.com/Gabrielxcx)

**Depende de:** #32

---

## Descrição

Como paciente ou médico, quero visualizar uma lista dos arquivos vinculados a mim para acompanhar exames e documentos disponíveis na plataforma.

## Tarefas

- [x] Criar página `/paciente/arquivos` para visualização do paciente
- [x] Criar página `/medico/arquivos` para visualização do médico
- [x] Reutilizar o service `arquivos.service.ts`
- [x] Listar arquivos com nome, tipo, data de upload e quem enviou
- [x] Tratar estados de loading, lista vazia e erro
- [x] Estilizar com CSS Modules seguindo identidade visual

## Critérios de Aceitação

- Cada tipo de usuário visualiza apenas a página correspondente ao seu perfil.
- Lista exibe apenas dados retornados pelo backend.
- Mensagem clara quando a lista está vazia ou ocorre erro.
- Página chama o service, nunca faz `fetch` direto.

## Critérios de Teste

- React Testing Library: renderização correta dos itens da lista.
