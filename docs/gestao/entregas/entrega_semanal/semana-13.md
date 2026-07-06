# Semana 13

> **Status:** Concluída  
> **Período:** 30/06/2026 - 06/07/2026  
> **Semana do ciclo:** 13 / 14  
> **Fase atual:** Fase 3 - Deploy & Demo  
> **Responsável pelo preenchimento:** Diogo

---

## Objetivo da Semana

Fechar a camada de auditoria (interceptor global, decorator `@Audit` e aplicação nas rotas de autenticação), concluir os fluxos de upload/listagem de arquivos no frontend e habilitar o vínculo médico-paciente ponta a ponta, além de estabilizar o deploy na Cloud Run (us-central).

---

## Entregas Realizadas

### Backend

- `AuditInterceptor` global implementado + decorator `@Audit` (#52). Interceptor lê a metadata do handler, registra `SUCCESS` no `tap` e `FAILURE` no `catchError`, sempre re-lançando a exceção original para o `ExceptionFilter` padrão.
- Refactor da API do decorator: consolidada em torno de um único evento por ação de negócio (`{ evento, extractRecursoId }`), usando o campo `status` da entidade como fonte única de verdade sobre o desfecho. `LOGIN_FALHA` removido do enum (inclusive no banco de produção) — a consulta equivalente passa a ser `WHERE tipoEvento = 'LOGIN' AND status = 'FAILURE'`.
- Tipagem do TypeORM ajustada para campos `nullable` na entidade `AuditLog` (`userId`, `recursoId`, `ipOrigem`, `userAgent`).
- Auditoria aplicada nas rotas de login e cadastro (#53).
- Nova rota de listagem de prontuário criada, retornando os arquivos do paciente vinculado ao médico autenticado.
- Retorno de CPF adicionado no backend para suportar a nova tela de upload.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor  | Descrição                                                                            |
| :-------------------------------------------------------------------- | :---- | :----- | :----------------------------------------------------------------------------------- |
| [`52b7ac3`](https://github.com/Diogo-Olivv/HealthTech/commit/52b7ac3) | 01/07 | Diogo  | fix: Ajuste de servidor para US + audit-log uuid                                     |
| [`a5ef58b`](https://github.com/Diogo-Olivv/HealthTech/commit/a5ef58b) | 01/07 | Diogo  | fix: ajuste audit-log uuid                                                           |
| [`bddb0f6`](https://github.com/Diogo-Olivv/HealthTech/commit/bddb0f6) | 04/07 | Martin | fix(audit): corrige tipagem do TypeORM para campos nullable na entidade AuditLog     |
| [`0160041`](https://github.com/Diogo-Olivv/HealthTech/commit/0160041) | 04/07 | Martin | feat(audit): implementa AuditInterceptor global e decorator (Resolve #52)            |
| [`de6b747`](https://github.com/Diogo-Olivv/HealthTech/commit/de6b747) | 04/07 | Martin | feat(users): aplica auditoria nas rotas de login e cadastro (Resolve #53)            |
| [`e7659c5`](https://github.com/Diogo-Olivv/HealthTech/commit/e7659c5) | 06/07 | Lucas  | feat(backend): criar rota para listar prontuário                                     |
| [`9c193b1`](https://github.com/Diogo-Olivv/HealthTech/commit/9c193b1) | 06/07 | Diogo  | refactor(audit): refactor da API + forma de chamar                                   |
| [`0da5e7c`](https://github.com/Diogo-Olivv/HealthTech/commit/0da5e7c) | 06/07 | Diogo  | fix: remove LOGIN_FALHA do enum no banco de produção                                 |
| [`a0ce9aa`](https://github.com/Diogo-Olivv/HealthTech/commit/a0ce9aa) | 06/07 | Diogo  | Merge branch 'develop' into feat/auditoria                                           |
| [`40fbb4a`](https://github.com/Diogo-Olivv/HealthTech/commit/40fbb4a) | 06/07 | Diogo  | Merge pull request #65 from Diogo-Olivv/feat/auditoria                               |

**Branch:** `feat/auditoria`  
**Issue(s):** #52, #53  
**PRs:** [#65](https://github.com/Diogo-Olivv/HealthTech/pull/65) (merged)

---

### Frontend

- Vínculo médico-paciente concluído ponta a ponta: botão de vincular paciente ajustado, modal com regras de hooks corrigidas e tabela de pacientes vinculados funcional (com data de nascimento) (#29).
- Painel de resumo do médico passou a exibir contagens reais.
- Tela de upload de arquivos entregue (#30): implementação em CSS Modules, funcionalidade de arrastar-e-soltar, isolamento do CSS do componente, ajustes de layout e separação da rota do dashboard.
- Tela de listagem de arquivos do médico entregue, com filtro por médico autenticado (#32).
- Tela de prontuário implementada, consumindo a nova rota do backend.
- `AuthContext` criado e `AuthGuard` refatorado para proteção de rotas por tipo de usuário; token deixou de ser parametrizado nas chamadas de API, com tipagem explícita nos retornos.
- Navbar concluída (#62): informações reais do usuário, menu mobile, novos links, links de navegação corrigidos e HTML nativo trocado por componentes Next.js para performance.
- Substituição do `alert` nativo por componente `FeedbackMessage`, além de limpeza de comentários e blocos inativos, padronização de nomenclatura para inglês e ajustes gerais de UI.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor | Descrição                                                                                             |
| :-------------------------------------------------------------------- | :---- | :---- | :---------------------------------------------------------------------------------------------------- |
| [`80cfe91`](https://github.com/Diogo-Olivv/HealthTech/commit/80cfe91) | 01/07 | Lucas | fix(Button Modal): botão de vincular Paciente                                                         |
| [`d252699`](https://github.com/Diogo-Olivv/HealthTech/commit/d252699) | 01/07 | Lucas | feat(NavBar): Informações reais do usuário                                                            |
| [`bfaf537`](https://github.com/Diogo-Olivv/HealthTech/commit/bfaf537) | 04/07 | Lucas | feat: ajuste na navbar e apaga o oii                                                                  |
| [`0f0b399`](https://github.com/Diogo-Olivv/HealthTech/commit/0f0b399) | 04/07 | Lucas | feat(backend,frontend): Funcionalidade de vincular médico com paciente                                |
| [`9e1e570`](https://github.com/Diogo-Olivv/HealthTech/commit/9e1e570) | 04/07 | Lucas | feat: Tabela de pacientes vinculados funcionando                                                      |
| [`9b73878`](https://github.com/Diogo-Olivv/HealthTech/commit/9b73878) | 04/07 | Lucas | feat: data de nascimento do paciente na tabela de pacientes                                           |
| [`ad14933`](https://github.com/Diogo-Olivv/HealthTech/commit/ad14933) | 04/07 | Lucas | feat: painel contagem real no painel de resumo do médico                                              |
| [`6997b9e`](https://github.com/Diogo-Olivv/HealthTech/commit/6997b9e) | 04/07 | Lucas | fix: descomentei o leitor de status da página                                                         |
| [`0f88c30`](https://github.com/Diogo-Olivv/HealthTech/commit/0f88c30) | 05/07 | Lucas | fix(medico): resolve erro que escondia botão de vincular pacientes quando a lista estava vazia        |
| [`55e716f`](https://github.com/Diogo-Olivv/HealthTech/commit/55e716f) | 05/07 | Lucas | refactor: melhora nomenclatura de componentes para inglês e remove código não utilizado               |
| [`83b79cb`](https://github.com/Diogo-Olivv/HealthTech/commit/83b79cb) | 05/07 | Lucas | chore: remove comentários redundantes e blocos de código inativos                                     |
| [`3128520`](https://github.com/Diogo-Olivv/HealthTech/commit/3128520) | 05/07 | Lucas | fix(ui): troca html nativo por componentes nextjs para performance; arruma iniciais; corrige link nav |
| [`d533b4f`](https://github.com/Diogo-Olivv/HealthTech/commit/d533b4f) | 05/07 | Lucas | fix(modal): corrige violação das regras de hooks no modal de vínculo                                  |
| [`c2d3c1d`](https://github.com/Diogo-Olivv/HealthTech/commit/c2d3c1d) | 06/07 | Lucas | feat: adiciona AuthGuard para proteger rotas por tipo de usuario                                      |
| [`f4d65f3`](https://github.com/Diogo-Olivv/HealthTech/commit/f4d65f3) | 06/07 | Lucas | refactor: conserta rota raiz do dashboard e separa tela de upload                                     |
| [`065ff00`](https://github.com/Diogo-Olivv/HealthTech/commit/065ff00) | 06/07 | Lucas | feat: cria tela de listagem de arquivos do medico                                                     |
| [`1577e8c`](https://github.com/Diogo-Olivv/HealthTech/commit/1577e8c) | 06/07 | Lucas | refactor: remove token parametrizado e tipa retornos de API                                           |
| [`2c8ee1c`](https://github.com/Diogo-Olivv/HealthTech/commit/2c8ee1c) | 06/07 | Lucas | feat: implementa upload de arquivos, estilos CSS Modules e retorno de CPF no backend                  |
| [`3870b17`](https://github.com/Diogo-Olivv/HealthTech/commit/3870b17) | 06/07 | Lucas | feat: funcionalidade de arrastar e soltar arquivo no upload                                           |
| [`0b26c64`](https://github.com/Diogo-Olivv/HealthTech/commit/0b26c64) | 06/07 | Lucas | feat(auth): implementar AuthContext e refatorar AuthGuard para proteção de rotas                      |
| [`1e9c6ba`](https://github.com/Diogo-Olivv/HealthTech/commit/1e9c6ba) | 06/07 | Lucas | refactor(ui): melhoria na NavBar com menu mobile e novos links para novas páginas                     |
| [`a25ccc5`](https://github.com/Diogo-Olivv/HealthTech/commit/a25ccc5) | 06/07 | Lucas | fix(arquivos): trava listagem de arquivos por médico e isola css do componente de upload              |
| [`c1393ee`](https://github.com/Diogo-Olivv/HealthTech/commit/c1393ee) | 06/07 | Lucas | refactor(ui): remove alert nativo, implementa FeedbackMessage e limpa código redundante               |
| [`9c16e70`](https://github.com/Diogo-Olivv/HealthTech/commit/9c16e70) | 06/07 | Lucas | feat(frontend): implementar tela de prontuário                                                        |
| [`6bdfdaa`](https://github.com/Diogo-Olivv/HealthTech/commit/6bdfdaa) | 06/07 | Lucas | chore: troca de nome de caminho                                                                       |

**Branch:** `develop`, `30-frontend-tela-de-upload-de-arquivos`, `feat/Tela-de-listagem-de-arquivos`  
**Issue(s):** #29, #30, #32, #62

---

### Infraestrutura / Cloud

- Deploy da Cloud Run migrado para a região `us-central` para reduzir latência e viabilizar a demo.
- Caminhos do `cloudbuild.yaml` corrigidos após a reestruturação do repositório.
- Ajustes no schema da tabela `audit-log` (uuid) para compatibilidade com o banco de produção.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor | Descrição                                        |
| :-------------------------------------------------------------------- | :---- | :---- | :----------------------------------------------- |
| [`52b7ac3`](https://github.com/Diogo-Olivv/HealthTech/commit/52b7ac3) | 01/07 | Diogo | fix: Ajuste de servidor para US + audit-log uuid |
| [`79a70b6`](https://github.com/Diogo-Olivv/HealthTech/commit/79a70b6) | 01/07 | Diogo | fix: Deploy para us-central                      |
| [`ba11b40`](https://github.com/Diogo-Olivv/HealthTech/commit/ba11b40) | 01/07 | Diogo | fix: cloudbuild paths                            |

**Branch:** `develop`, `feat/auditoria`  
**Issue(s):** -

---

## Participação por Integrante

| Integrante | Commits | Issues principais                          | Status       |
| :--------- | :-----: | :----------------------------------------- | :----------- |
| Diogo      |    7    | #52 (refactor API), deploy Cloud Run       | Concluída    |
| Hugo       |    -    | -                                          | -            |
| Martin     |    3    | #52, #53 (interceptor + auth)              | Concluída    |
| Lucas      |   25    | #29, #30, #32, #62 (upload, listagem, nav) | Concluída    |
| Luíza      |    -    | -                                          | -            |
| Gabriel    |    -    | -                                          | -            |

---

## Bloqueios e Riscos

| Bloqueio / Risco                              | Impacto                                        | Responsável           | Prazo |
| :-------------------------------------------- | :--------------------------------------------- | :-------------------- | :---- |
| Auditoria de arquivos e vínculo (#54, #55)    | Médio - cobertura de auditoria incompleta      | Hugo, Martin          | 13/07 |
| UserType ADMIN + endpoint/tela de logs (#56 - #58) | Alto - painel de admin ainda sem visualização | Hugo, Martin, Gabriel | 13/07 |

---

## Pendências para a Próxima Semana

> Semana 14 / 14 - Foco: fechamento da auditoria nas rotas restantes, painel admin e preparação da demo final.

| Tarefa                                        | Responsável    | Issue | Prioridade |
| :-------------------------------------------- | :------------- | :---- | :--------- |
| Auditoria em rotas de arquivos                | Hugo, Martin   | #54   | Alta       |
| Auditoria em rotas de vínculo médico-paciente | Hugo, Martin   | #55   | Alta       |
| Criar UserType ADMIN e seed                   | Hugo, Martin   | #56   | Alta       |
| Endpoint de consulta de logs (admin)          | Hugo, Martin   | #57   | Média      |
| Tela de consulta de logs (admin)              | Gabriel, Lucas | #58   | Média      |
| Preparação da demo final e revisão docs       | Todos          | -     | Alta       |

---

_Documento preenchido por: Diogo_
