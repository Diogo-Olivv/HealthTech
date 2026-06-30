# Issue #62 - Criação da Navbar

**Tipo:** Frontend

**Status:** Em andamento

**Responsáveis:** [Gabriel Robson](https://github.com/Gabrielxcx), [Luíza de Melo](https://github.com/LuizaCarvalho691), [Lucas de Paula](https://github.com/lucaspaulaleal)

**Depende de:** -

---

## Descrição

Como usuário autenticado (médico, paciente ou admin), quero uma navbar persistente no topo das telas internas, para navegar entre as áreas da aplicação e fazer logout sem precisar manipular a URL diretamente.

## Tarefas

- [ ] Criar o componente `frontend/src/components/ui/Navbar.tsx` reutilizável.
- [ ] Exibir a logo HealthTech à esquerda com link para a página inicial do perfil (`/medico/arquivos`, `/paciente/arquivos`, `/admin/...`).
- [ ] Exibir o nome do usuário autenticado e um badge com o tipo (Médico, Paciente, Admin) à direita.
- [ ] Menu de navegação dinâmico, baseado no campo `tipo` do JWT:
  - Médico: `Meus Pacientes`, `Arquivos`, `Vincular Paciente`
  - Paciente: `Meus Arquivos`, `Meus Médicos`
  - Admin: `Auditoria`, `Usuários`
- [ ] Botão de logout que limpa o token armazenado e redireciona para `/login`.
- [ ] Não exibir a navbar nas páginas públicas (`/login`, `/register/*`).
- [ ] Versão mobile (≤ 768px) com menu hambúrguer.
- [ ] Indicar visualmente o link da página ativa (estilo distinto).
- [ ] Reaproveitar variáveis de design já definidas em `globals.css` (cores, espaçamentos, sombras).

## Critérios de Aceitação

- A navbar aparece em todas as páginas internas e está ausente em `/login` e `/register/*`.
- O menu exibe apenas as opções correspondentes ao `tipo` do usuário autenticado.
- O logout invalida o token local e impede o acesso posterior a rotas protegidas.
- No breakpoint mobile, o menu hambúrguer abre e fecha corretamente.
- Os links da navbar usam `next/link` (navegação sem reload completo).

## Critérios de Teste

- Teste de componente: render da navbar com mocks de cada `tipo` (médico, paciente, admin) verificando os itens visíveis em cada caso.
- Teste de componente: comportamento do botão de logout (limpa o storage e dispara navegação para `/login`).
- Teste end-to-end ou de integração: login → navegação entre páginas via navbar → logout → tentativa de acessar rota protegida deve redirecionar para `/login`.
