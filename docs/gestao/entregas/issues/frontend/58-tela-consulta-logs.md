# Issue #58 - Tela de consulta de logs (admin)

**Tipo:** Frontend

**Status:** Planejada

**Responsáveis:** [Gabriel Robson](https://github.com/Gabrielxcx), [Lucas de Paula](https://github.com/lucaspaulaleal), [Luíza de Melo](https://github.com/LuizaCarvalho691)

**Depende de:** #56, #57

---

## Descrição

Como administrador, quero uma página web em `/admin/auditoria` para consultar os logs com filtros e paginação, para não depender de acesso direto ao banco de dados.

## Tarefas

- [ ] Criar a rota `frontend/app/admin/auditoria/page.tsx` (Next.js 16).
- [ ] Bloquear o acesso a usuários cujo JWT não tenha `tipo: 'ADMIN'`. Redirecionar para `/login` em caso negativo.
- [ ] Reutilizar o padrão de listagem já existente no projeto (ver `frontend/app/` para localizar a tabela de arquivos como referência).
- [ ] Campos da tabela: `timestamp`, `tipoEvento`, `status`, `userId`, `recursoId`, `ipOrigem`.
- [ ] Filtros no topo: `userId`, `tipoEvento` (select), `dataInicio`, `dataFim`.
- [ ] Paginação no rodapé.
- [ ] Estado de loading e erro consistentes com as outras telas.

## Critérios de Aceitação

- Usuário não-admin não consegue carregar a página.
- Filtros disparam nova requisição à API com debounce.
- A tabela é responsiva no breakpoint mobile.

## Critérios de Teste

- Teste de componente: render da tabela com payload mockado.
- Teste end-to-end ou de integração: login como admin, navegação até a página, aplicação de um filtro.
