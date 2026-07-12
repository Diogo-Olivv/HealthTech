# Semana 14

> **Status:** Em andamento

> **Período:** 07/07/2026 a 13/07/2026
> **Semana do ciclo:** 14 / 14
> **Fase atual:** Fase 3 (Deploy e Demo)
> **Responsável pelo preenchimento:** Diogo

---

## Objetivo da Semana

Fechar o ciclo com o painel de admin ponta a ponta (rota de logs de auditoria e seed manual do ADMIN), consolidar a arquitetura do frontend em torno do proxy `/api/proxy/[...path]` com cookie httpOnly, publicar o Swagger da API, endurecer o pipeline de CI (lint e testes bloqueantes, CodeQL, Dependabot e husky), e concluir a governança do repositório (ADR-0001, templates de PR e issue, refatoração completa da documentação MkDocs).

---

## Entregas Realizadas

### Backend

- Rota `GET /audit/logs` (ADMIN) implementada com filtros (`userId`, `tipoEvento`, `dataInicio`, `dataFim`), paginação (`page`, `limit`, cap silencioso em `200`) e ordenação por `timestamp DESC` (#57).
- `UserType.ADMIN` adicionado ao enum via migration; cadastro público rejeita `tipo` extra por `forbidNonWhitelisted` (#56).
- Seed manual `npm run seed:admin`, idempotente e bloqueado em produção por padrão.
- Swagger habilitado em `/docs` (fora de `production`) com Bearer Auth persistido, decorators em `UsersController` e DTOs de users como classes (#71).
- Auditoria estendida para arquivos (upload, visualização, download, exclusão) e para o novo fluxo de vínculo (`SOLICITACAO_VINCULO`, `APROVACAO_VINCULO`, `REJEICAO_VINCULO`, `REVOGACAO_VINCULO`, `VINCULO_MEDICO_PACIENTE`, `DESVINCULO_MEDICO_PACIENTE`) (#54, #55).
- Refactor da tipagem `AuthRequest` para eliminar casts inseguros nos controllers.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor         | Descrição                                                                                    |
| :-------------------------------------------------------------------- | :---- | :------------ | :------------------------------------------------------------------------------------------- |
| [`4e06cd6`](https://github.com/Diogo-Olivv/HealthTech/commit/4e06cd6) | 12/07 | Diogo         | docs(audit): documenta GET /audit/logs no README do backend                                  |
| [`131fecb`](https://github.com/Diogo-Olivv/HealthTech/commit/131fecb) | 12/07 | Diogo         | test(audit): cobre 400 em dataFim<dataInicio e cap silencioso de limit>200                   |
| [`bc07fc2`](https://github.com/Diogo-Olivv/HealthTech/commit/bc07fc2) | 11/07 | Diogo         | feat(swagger): decorators em UsersCtrl                                                       |
| [`c613b24`](https://github.com/Diogo-Olivv/HealthTech/commit/c613b24) | 11/07 | Diogo         | feat(swagger): anota DTOs de users                                                           |
| [`2be64d6`](https://github.com/Diogo-Olivv/HealthTech/commit/2be64d6) | 11/07 | Diogo         | feat(swagger): setup em main.ts                                                              |
| [`b85d313`](https://github.com/Diogo-Olivv/HealthTech/commit/b85d313) | 11/07 | Hugo          | fix: corrige import dinâmico incompatível com moduleResolution nodenext no seed de admin     |
| [`e8ed3e3`](https://github.com/Diogo-Olivv/HealthTech/commit/e8ed3e3) | 11/07 | Hugo          | feat: adiciona GET /audit/logs para admin consultar logs de auditoria com filtros e paginação|
| [`9760116`](https://github.com/Diogo-Olivv/HealthTech/commit/9760116) | 11/07 | Hugo          | feat: adiciona seed manual de admin (npm run seed:admin)                                     |
| [`cb4a94d`](https://github.com/Diogo-Olivv/HealthTech/commit/cb4a94d) | 11/07 | Hugo          | fix: rejeita campos não declarados (ex.: tipo) no cadastro público via ValidationPipe        |
| [`294be19`](https://github.com/Diogo-Olivv/HealthTech/commit/294be19) | 11/07 | Hugo          | feat: adiciona UserType.ADMIN e migration do enum no banco                                   |
| [`27f2d93`](https://github.com/Diogo-Olivv/HealthTech/commit/27f2d93) | 10/07 | Martin        | feat(arquivos): adiciona auditoria de rotas, testes e refatora tipagem AuthRequest (Resolve #54) |
| [`869c332`](https://github.com/Diogo-Olivv/HealthTech/commit/869c332) | 10/07 | Martin        | refactor(auth): centraliza interface AuthRequest e remove casts inseguros (Resolve #54)      |

**Branches:** `feat/auditoria-arquivos`, `feat/user-admin`, `feat/backend-swagger`
**Issue(s):** #54, #55, #56, #57
**PRs:** [#68](https://github.com/Diogo-Olivv/HealthTech/pull/68), [#69](https://github.com/Diogo-Olivv/HealthTech/pull/69), [#71](https://github.com/Diogo-Olivv/HealthTech/pull/71) (merged)

---

### Frontend

- Refatoração completa da arquitetura: route handlers de auth em `app/api/auth/*`, proxy catch-all `app/api/proxy/[...path]`, `serverFetch` para Server Components, `AuthContext` e `AuthGuard` (#72).
- `lib/api-config.ts` centraliza `API_INTERNAL_URL`, `API_URL` e `AUTH_COOKIE`; helpers `http.ts` e `server-http.ts` para consumo tipado.
- Novo padrão de hooks: `useFetchData` genérico + hooks por domínio (`useMeusPacientes`, `useMeusMedicos`, `useArquivos`, `useProntuarioPaciente`, `usePendingRequests`, `useSolicitacoesEnviadas`).
- Vínculo médico-paciente ponta a ponta na UI: solicitações enviadas, solicitações pendentes, aprovação, rejeição, revogação, esconde CPF de pacientes disponíveis.
- Fix do fluxo de download e ConfirmDialog em `files`; ajustes visuais no botão de revogar acesso.
- Correções de deploy: `API_INTERNAL_URL` no compose e no build do frontend.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor | Descrição                                                                          |
| :-------------------------------------------------------------------- | :---- | :---- | :--------------------------------------------------------------------------------- |
| [`f5f3b9d`](https://github.com/Diogo-Olivv/HealthTech/commit/f5f3b9d) | 12/07 | Diogo | fix(deploy): API_INTERNAL_URL no front                                             |
| [`e711e6c`](https://github.com/Diogo-Olivv/HealthTech/commit/e711e6c) | 12/07 | Diogo | test(users): payload usa especialidadeIds                                          |
| [`47b7b45`](https://github.com/Diogo-Olivv/HealthTech/commit/47b7b45) | 12/07 | Diogo | fix(vinculo): usa solicitarVinculo                                                 |
| [`0e36864`](https://github.com/Diogo-Olivv/HealthTech/commit/0e36864) | 12/07 | Diogo | style(medicos): botão revogar acesso                                               |
| [`3b244f1`](https://github.com/Diogo-Olivv/HealthTech/commit/3b244f1) | 12/07 | Diogo | fix(vinculo): fecha modal antes alert                                              |
| [`ec9fb9a`](https://github.com/Diogo-Olivv/HealthTech/commit/ec9fb9a) | 12/07 | Diogo | feat(vinculo): esconde CPF disponíveis                                             |
| [`3622377`](https://github.com/Diogo-Olivv/HealthTech/commit/3622377) | 12/07 | Diogo | fix(files): confirmdialog e download                                               |
| [`8174fc6`](https://github.com/Diogo-Olivv/HealthTech/commit/8174fc6) | 12/07 | Diogo | feat(medicos): SSR + client wrapper                                                |
| [`3861f90`](https://github.com/Diogo-Olivv/HealthTech/commit/3861f90) | 12/07 | Diogo | refactor(pages): consumir hooks                                                    |
| [`89dc12c`](https://github.com/Diogo-Olivv/HealthTech/commit/89dc12c) | 12/07 | Diogo | feat(hooks): useFetchData + features                                               |
| [`73893a3`](https://github.com/Diogo-Olivv/HealthTech/commit/73893a3) | 12/07 | Diogo | refactor(auth): consumers do proxy                                                 |
| [`239199c`](https://github.com/Diogo-Olivv/HealthTech/commit/239199c) | 12/07 | Diogo | refactor(lib): api-config e http                                                   |
| [`5d51040`](https://github.com/Diogo-Olivv/HealthTech/commit/5d51040) | 12/07 | Diogo | feat(api): proxy catch-all + serverFetch                                           |
| [`4f6d2ac`](https://github.com/Diogo-Olivv/HealthTech/commit/4f6d2ac) | 12/07 | Diogo | feat(api): route handlers de auth                                                  |

**Branch:** `refactor/frontend-architecture`
**Issue(s):** relacionadas ao fechamento do frontend (auth, vínculo, arquivos)
**PRs:** [#72](https://github.com/Diogo-Olivv/HealthTech/pull/72) (merged)

---

### Infraestrutura, CI/CD e Governança

- `cloudbuild.yaml` agora executa lint (não bloqueante com `--fix`) e testes (bloqueantes) antes do build, com steps nomeados e paralelismo por camada.
- Workflow CodeQL semanal e em PRs (`.github/workflows/codeql.yml`).
- Dependabot semanal, agrupado por família (`@nestjs/*`, `next`, `react`, testing), com bloqueio de bumps major (`.github/dependabot.yml`).
- Husky + lint-staged: pre-commit roda ESLint apenas nos arquivos em stage.
- ADR-0001 escrito e aceito: migrations do TypeORM via Cloud Run Job (`healthtech-migrations`), documentando trade-offs vs. rodar no boot ou direto do Cloud Build.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor | Descrição                                    |
| :-------------------------------------------------------------------- | :---- | :---- | :------------------------------------------- |
| [`4a6f7f3`](https://github.com/Diogo-Olivv/HealthTech/commit/4a6f7f3) | 12/07 | Diogo | chore(compose): API_INTERNAL_URL             |
| [`1865b9d`](https://github.com/Diogo-Olivv/HealthTech/commit/1865b9d) | 11/07 | Diogo | chore: adiciona husky + lint-staged          |
| [`2d81b80`](https://github.com/Diogo-Olivv/HealthTech/commit/2d81b80) | 11/07 | Diogo | ci: configura Dependabot                     |
| [`8633cd4`](https://github.com/Diogo-Olivv/HealthTech/commit/8633cd4) | 11/07 | Diogo | ci: adiciona workflow CodeQL                 |
| [`94abd58`](https://github.com/Diogo-Olivv/HealthTech/commit/94abd58) | 11/07 | Diogo | ci: adiciona lint/testes ao cloudbuild       |

**Branches:** `fix/ci-pipeline-security`, `chore/governance-adrs`
**PRs:** [#70](https://github.com/Diogo-Olivv/HealthTech/pull/70) (merged)

---

### Documentação

- Refatoração completa da documentação MkDocs para refletir o estado atual do `develop`: arquitetura (frontend, backend, banco, infra), tecnologias (Swagger, Tailwind, migrations, Multer, SweetAlert2), modelagem (ADMIN, especialidades N:N, workflow de vínculo), gestão (cronograma real, metodologia).
- Nova seção `desenvolvimento/adr/` com índice, template e ADR-0001.
- Nova seção `desenvolvimento/padroes/` com Git, código, review, template de PR e templates de issue.
- Correção de links quebrados no `docs/index.md`.
- Ajuste de `.pages` em `desenvolvimento` e `gestao/entregas`.

**Branch:** `docs`

---

## Pendências para a Próxima Semana (fechamento do ciclo)

| Tarefa                                        | Responsável   | Issue | Prioridade |
| :-------------------------------------------- | :------------ | :---- | :--------- |
| Tela de consulta de logs (admin)              | Gabriel, Lucas | #58   | Média      |
| Apresentação final e demo do fluxo completo   | Todos          | -     | Alta       |
| Revisão da documentação de arquitetura        | Diogo          | -     | Alta       |

---

_Documento preenchido por: Diogo_
