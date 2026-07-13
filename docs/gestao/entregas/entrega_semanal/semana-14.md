# Semana 14

> **Status:** Em andamento
>
> **Período:** 07/07/2026 – 13/07/2026
> **Semana do ciclo:** 14 / 14
> **Fase atual:** Fase 3 (Deploy & Demo)
> **Responsável pelo preenchimento:** Diogo

---

## Objetivo da Semana

Fechar o ciclo com o painel de administração ponta a ponta (endpoint + tela de logs de auditoria e seed manual do `ADMIN`), consolidar a arquitetura do frontend em torno do proxy `/api/proxy/[...path]` com cookie httpOnly, entregar o CRUD completo de arquivos, formalizar o fluxo de solicitação/aprovação/rejeição/revogação do vínculo médico-paciente, publicar o Swagger da API, endurecer o pipeline de CI (lint e testes bloqueantes, CodeQL, Dependabot e husky) e concluir a governança do repositório (ADR-0001, templates de PR/issue e refatoração completa da documentação MkDocs).

---

## Entregas Realizadas

### Backend

- Rota `GET /audit/logs` (ADMIN) com filtros (`userId`, `usuario` — busca livre por nome/email, `tipoEvento`, `dataInicio`, `dataFim`), paginação (`page`, `limit`, cap silencioso em `200`) e ordenação por `timestamp DESC` (#57).
- `UserType.ADMIN` adicionado ao enum via migration; cadastro público passa a rejeitar campos não declarados (ex.: `tipo`) por `forbidNonWhitelisted` no `ValidationPipe` (#56).
- Seed manual `npm run seed:admin`, idempotente e bloqueado em produção por padrão (destrave via `ADMIN_SEED_ALLOW_PROD`).
- Swagger habilitado em `/docs` (fora de `production`) com Bearer Auth persistido, decorators em `UsersController`, DTOs de `users` convertidos em classes e `PublicUser` como classe (#71).
- CRUD completo de arquivos: upload com validação (PDF/JPEG/PNG, ≤10 MB), download por stream (`/raw` via blob), edição de descrição e exclusão. Endpoint `/arquivos/:id/download` + `getSignedUrl` removidos como código morto (resolve o erro `iam.serviceAccounts.signBlob` bloqueado no Cloud Run).
- Vínculo médico-paciente ganhou fluxo de **solicitação/aprovação/rejeição/revogação** com campo `status` e consentimento no schema. Só vínculo `APROVADO` libera leitura/edição de arquivos.
- Especialidades médicas em relação N:N com médico, incluindo seed com a lista oficial do CFM e migration `ZerarMedicos` para reset controlado.
- Auditoria estendida para arquivos (`UPLOAD_ARQUIVO`, `VISUALIZACAO_ARQUIVO`, `DOWNLOAD_ARQUIVO`, `EXCLUSAO_ARQUIVO`) e para o novo fluxo de vínculo (`SOLICITACAO_VINCULO`, `APROVACAO_VINCULO`, `REJEICAO_VINCULO`, `REVOGACAO_VINCULO`, `VINCULO_MEDICO_PACIENTE`, `DESVINCULO_MEDICO_PACIENTE`) (#54, #55).
- Interface `AuthRequest` centralizada e casts inseguros removidos nos controllers.
- Correção do `data-source` desatualizado; `migrationsTransactionMode=each` para permitir migrations que não podem rodar em transação única.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor  | Descrição                                                                                     |
| :-------------------------------------------------------------------- | :---- | :----- | :-------------------------------------------------------------------------------------------- |
| [`4e06cd6`](https://github.com/Diogo-Olivv/HealthTech/commit/4e06cd6) | 12/07 | Diogo  | docs(audit): documenta GET /audit/logs no README do backend                                   |
| [`131fecb`](https://github.com/Diogo-Olivv/HealthTech/commit/131fecb) | 12/07 | Diogo  | test(audit): cobre 400 em dataFim<dataInicio e cap silencioso de limit>200                    |
| [`504c8d0`](https://github.com/Diogo-Olivv/HealthTech/commit/504c8d0) | 12/07 | Diogo  | chore(arquivos): remove signed URL / getSignedUrl                                              |
| [`326f4bd`](https://github.com/Diogo-Olivv/HealthTech/commit/326f4bd) | 12/07 | Diogo  | fix(arquivos): download via /raw                                                              |
| [`bc07fc2`](https://github.com/Diogo-Olivv/HealthTech/commit/bc07fc2) | 11/07 | Diogo  | feat(swagger): decorators em UsersCtrl                                                        |
| [`c613b24`](https://github.com/Diogo-Olivv/HealthTech/commit/c613b24) | 11/07 | Diogo  | feat(swagger): anota DTOs de users                                                            |
| [`2be64d6`](https://github.com/Diogo-Olivv/HealthTech/commit/2be64d6) | 11/07 | Diogo  | feat(swagger): setup em main.ts                                                               |
| [`0fbb3ff`](https://github.com/Diogo-Olivv/HealthTech/commit/0fbb3ff) | 11/07 | Diogo  | refactor(users): PublicUser vira classe                                                       |
| [`07db123`](https://github.com/Diogo-Olivv/HealthTech/commit/07db123) | 11/07 | Diogo  | chore: add @nestjs/swagger                                                                    |
| [`b85d313`](https://github.com/Diogo-Olivv/HealthTech/commit/b85d313) | 11/07 | Hugo   | fix: corrige import dinâmico incompatível com moduleResolution nodenext no seed de admin      |
| [`e8ed3e3`](https://github.com/Diogo-Olivv/HealthTech/commit/e8ed3e3) | 11/07 | Hugo   | feat: adiciona GET /audit/logs para admin consultar logs de auditoria com filtros e paginação |
| [`9760116`](https://github.com/Diogo-Olivv/HealthTech/commit/9760116) | 11/07 | Hugo   | feat: adiciona seed manual de admin (npm run seed:admin)                                      |
| [`cb4a94d`](https://github.com/Diogo-Olivv/HealthTech/commit/cb4a94d) | 11/07 | Hugo   | fix: rejeita campos não declarados (ex.: tipo) no cadastro público via ValidationPipe         |
| [`294be19`](https://github.com/Diogo-Olivv/HealthTech/commit/294be19) | 11/07 | Hugo   | feat: adiciona UserType.ADMIN e migration do enum no banco                                    |
| [`27f2d93`](https://github.com/Diogo-Olivv/HealthTech/commit/27f2d93) | 10/07 | Martin | feat(arquivos): adiciona auditoria de rotas, testes e refatora tipagem AuthRequest (Resolve #54) |
| [`869c332`](https://github.com/Diogo-Olivv/HealthTech/commit/869c332) | 10/07 | Martin | refactor(auth): centraliza interface AuthRequest e remove casts inseguros (Resolve #54)       |
| [`43abe1e`](https://github.com/Diogo-Olivv/HealthTech/commit/43abe1e) | 09/07 | Martin | feat(medico-paciente): aplica auditoria na criacao                                            |
| [`222c9d4`](https://github.com/Diogo-Olivv/HealthTech/commit/222c9d4) | 09/07 | Diogo  | feat(arquivos): exige vinculo APROVADO para acesso e edicao                                   |
| [`095ac66`](https://github.com/Diogo-Olivv/HealthTech/commit/095ac66) | 09/07 | Diogo  | feat(medico-paciente): fluxo de aprovacao de vinculo                                          |
| [`d647fa5`](https://github.com/Diogo-Olivv/HealthTech/commit/d647fa5) | 09/07 | Diogo  | feat(audit): eventos de solicitacao/aprovacao/rejeicao/revogacao                              |
| [`540029d`](https://github.com/Diogo-Olivv/HealthTech/commit/540029d) | 09/07 | Diogo  | db: usa migrationsTransactionMode=each                                                        |
| [`f43ab23`](https://github.com/Diogo-Olivv/HealthTech/commit/f43ab23) | 09/07 | Diogo  | db(medico-paciente): add status/consentimento no schema                                       |
| [`2859cb7`](https://github.com/Diogo-Olivv/HealthTech/commit/2859cb7) | 09/07 | Diogo  | fix: data-source desatualizado                                                                |
| [`b450eaa`](https://github.com/Diogo-Olivv/HealthTech/commit/b450eaa) | 08/07 | Diogo  | feat(backend): CRUD completo de arquivos com download, edição e exclusão                      |
| [`40573d5`](https://github.com/Diogo-Olivv/HealthTech/commit/40573d5) | 08/07 | Diogo  | feat(backend): normaliza especialidades em N:N com médico usando lista CFM                    |
| [`6569750`](https://github.com/Diogo-Olivv/HealthTech/commit/6569750) | 08/07 | Diogo  | feat(backend): migration para zerar médicos existentes                                        |

**Branches:** `feat/auditoria-arquivos`, `feat/user-admin`, `feat/backend-swagger`, `refactor/vinculo-medico-paciente`
**Issue(s):** #54, #55, #56, #57
**PRs:** [#67](https://github.com/Diogo-Olivv/HealthTech/pull/67), [#68](https://github.com/Diogo-Olivv/HealthTech/pull/68), [#69](https://github.com/Diogo-Olivv/HealthTech/pull/69), [#71](https://github.com/Diogo-Olivv/HealthTech/pull/71) (merged)

---

### Frontend

- Refatoração completa da arquitetura: route handlers de auth em `app/api/auth/*`, proxy catch-all `app/api/proxy/[...path]`, `serverFetch` para Server Components, `AuthContext` e `AuthGuard` (#72).
- `lib/api-config.ts` centraliza `API_INTERNAL_URL`, `API_URL` e `AUTH_COOKIE`; helpers `http.ts` e `server-http.ts` para consumo tipado.
- Padrão de hooks: `useFetchData` genérico + hooks por domínio (`useMeusPacientes`, `useMeusMedicos`, `useArquivos`, `useProntuarioPaciente`, `usePendingRequests`, `useSolicitacoesEnviadas`, `useAuditLogs`, `useDebouncedValue`).
- Vínculo médico-paciente ponta a ponta na UI: solicitações enviadas (médico), pendentes (paciente), aprovação, rejeição, revogação em `MedicosTable`, esconde CPF de pacientes disponíveis, modal pesquisável, feedback inline.
- CRUD de arquivos: `FilesTable` com busca, ordenação e ações contextuais por papel; visualização inline (`VisualizadorArquivo`); prontuário do paciente com listagem de exames; fluxo de download refeito para consumir `/raw` via blob (resolve `Falha ao gerar URL de acesso ao arquivo` em produção).
- Painel administrativo: layout e index `/admin`, tela `/admin/auditoria` com tabela, filtros (`userId`/`usuario`, `tipoEvento`, período) e paginação; `useAuditLogs`, DTO e service consumindo o proxy; link admin na navbar; proteção da rota via `AuthGuard`.
- Design system: adoção do `sweetalert2` como padrão de feedback (tema HealthTech), helpers de alerta reutilizáveis (`utils/alerts.ts`), login/cadastro com confirmação de sucesso, tabs de tipo (paciente/médico), spinner e slot de feedback, navbar com confirmação de logout, landing com polish visual e `next/image`.
- Responsividade mobile: `viewport` meta correto e `lang=pt-BR`, prevenção de zoom em input iOS, bottom-sheet em modais, touch targets, dashboards e tabelas fluidas, painel lateral do auth ocultado em telas pequenas, `FileUpload` responsivo.
- Toolbars de pesquisa e ordenação nas tabelas; A11y de teclado; ícones nos botões de vínculo e upload; ícone de logout; ConfirmDialog em `files`.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor  | Descrição                                                              |
| :-------------------------------------------------------------------- | :---- | :----- | :--------------------------------------------------------------------- |
| [`f976352`](https://github.com/Diogo-Olivv/HealthTech/commit/f976352) | 12/07 | Diogo  | feat(admin): busca por usuário                                          |
| [`e7bf117`](https://github.com/Diogo-Olivv/HealthTech/commit/e7bf117) | 12/07 | Diogo  | feat(audit): filtro por usuário                                         |
| [`03a9fb4`](https://github.com/Diogo-Olivv/HealthTech/commit/03a9fb4) | 12/07 | Diogo  | feat(admin): tela /admin/auditoria                                      |
| [`8684d25`](https://github.com/Diogo-Olivv/HealthTech/commit/8684d25) | 12/07 | Diogo  | feat(admin): layout e index /admin                                      |
| [`6646f5e`](https://github.com/Diogo-Olivv/HealthTech/commit/6646f5e) | 12/07 | Diogo  | feat(audit-table): componente da tabela                                 |
| [`6aca337`](https://github.com/Diogo-Olivv/HealthTech/commit/6aca337) | 12/07 | Diogo  | feat(hook): useAuditLogs                                                |
| [`fd2f77d`](https://github.com/Diogo-Olivv/HealthTech/commit/fd2f77d) | 12/07 | Diogo  | feat(hook): useDebouncedValue                                           |
| [`65ad4b5`](https://github.com/Diogo-Olivv/HealthTech/commit/65ad4b5) | 12/07 | Diogo  | feat(audit-svc): getAuditLogs via proxy                                 |
| [`2fceb57`](https://github.com/Diogo-Olivv/HealthTech/commit/2fceb57) | 12/07 | Diogo  | feat(audit-dto): dto de logs de auditoria                               |
| [`a2fce07`](https://github.com/Diogo-Olivv/HealthTech/commit/a2fce07) | 12/07 | Diogo  | feat(navbar): link admin                                                |
| [`d25fa80`](https://github.com/Diogo-Olivv/HealthTech/commit/d25fa80) | 12/07 | Diogo  | feat(auth-guard): protege rota /admin                                   |
| [`a6abfe8`](https://github.com/Diogo-Olivv/HealthTech/commit/a6abfe8) | 12/07 | Diogo  | feat(user-type): add ADMIN role                                         |
| [`47b7b45`](https://github.com/Diogo-Olivv/HealthTech/commit/47b7b45) | 12/07 | Diogo  | fix(vinculo): usa solicitarVinculo                                      |
| [`0e36864`](https://github.com/Diogo-Olivv/HealthTech/commit/0e36864) | 12/07 | Diogo  | style(medicos): botão revogar acesso                                    |
| [`3b244f1`](https://github.com/Diogo-Olivv/HealthTech/commit/3b244f1) | 12/07 | Diogo  | fix(vinculo): fecha modal antes alert                                   |
| [`ec9fb9a`](https://github.com/Diogo-Olivv/HealthTech/commit/ec9fb9a) | 12/07 | Diogo  | feat(vinculo): esconde CPF disponíveis                                  |
| [`3622377`](https://github.com/Diogo-Olivv/HealthTech/commit/3622377) | 12/07 | Diogo  | fix(files): confirmdialog e download                                    |
| [`8174fc6`](https://github.com/Diogo-Olivv/HealthTech/commit/8174fc6) | 12/07 | Diogo  | feat(medicos): SSR + client wrapper                                     |
| [`3861f90`](https://github.com/Diogo-Olivv/HealthTech/commit/3861f90) | 12/07 | Diogo  | refactor(pages): consumir hooks                                         |
| [`89dc12c`](https://github.com/Diogo-Olivv/HealthTech/commit/89dc12c) | 12/07 | Diogo  | feat(hooks): useFetchData + features                                    |
| [`73893a3`](https://github.com/Diogo-Olivv/HealthTech/commit/73893a3) | 12/07 | Diogo  | refactor(auth): consumers do proxy                                      |
| [`239199c`](https://github.com/Diogo-Olivv/HealthTech/commit/239199c) | 12/07 | Diogo  | refactor(lib): api-config e http                                        |
| [`5d51040`](https://github.com/Diogo-Olivv/HealthTech/commit/5d51040) | 12/07 | Diogo  | feat(api): proxy catch-all + serverFetch                                |
| [`4f6d2ac`](https://github.com/Diogo-Olivv/HealthTech/commit/4f6d2ac) | 12/07 | Diogo  | feat(api): route handlers de auth                                       |
| [`89ba2c4`](https://github.com/Diogo-Olivv/HealthTech/commit/89ba2c4) | 09/07 | Diogo  | feat: atualiza navbar com novas rotas                                   |
| [`2f6d98a`](https://github.com/Diogo-Olivv/HealthTech/commit/2f6d98a) | 09/07 | Diogo  | refactor(frontend): textos do ModalVinculo p/ solicitacao                |
| [`153307d`](https://github.com/Diogo-Olivv/HealthTech/commit/153307d) | 09/07 | Diogo  | feat(frontend/paciente): revogar acesso em MedicosTable                 |
| [`cf9f57a`](https://github.com/Diogo-Olivv/HealthTech/commit/cf9f57a) | 09/07 | Diogo  | feat(frontend/medico): pagina de solicitacoes enviadas                  |
| [`59656a2`](https://github.com/Diogo-Olivv/HealthTech/commit/59656a2) | 09/07 | Diogo  | feat(frontend/paciente): pagina de solicitacoes pendentes               |
| [`7c0a663`](https://github.com/Diogo-Olivv/HealthTech/commit/7c0a663) | 09/07 | Diogo  | feat(frontend): DTOs e services de solicitacao de vinculo               |
| [`43e4bae`](https://github.com/Diogo-Olivv/HealthTech/commit/43e4bae) | 09/07 | Diogo  | fix(frontend): download de arquivo agora usa endpoint /raw via blob     |
| [`c220fde`](https://github.com/Diogo-Olivv/HealthTech/commit/c220fde) | 09/07 | Diogo  | style(frontend): touch targets e ajustes mobile em navbar, senha e home |
| [`7f8b9ea`](https://github.com/Diogo-Olivv/HealthTech/commit/7f8b9ea) | 09/07 | Diogo  | style(frontend): responsividade mobile no FileUpload                    |
| [`952e0b9`](https://github.com/Diogo-Olivv/HealthTech/commit/952e0b9) | 09/07 | Diogo  | style(frontend): modais viram bottom-sheet e botoes empilham no mobile  |
| [`0698924`](https://github.com/Diogo-Olivv/HealthTech/commit/0698924) | 09/07 | Diogo  | style(frontend): responsividade mobile em dashboards e tabelas          |
| [`32126a3`](https://github.com/Diogo-Olivv/HealthTech/commit/32126a3) | 09/07 | Diogo  | style(frontend): esconde painel lateral do auth em telas menores        |
| [`79176ae`](https://github.com/Diogo-Olivv/HealthTech/commit/79176ae) | 09/07 | Diogo  | feat(frontend): viewport meta, lang pt-BR e evita zoom em input iOS     |
| [`d4aaaba`](https://github.com/Diogo-Olivv/HealthTech/commit/d4aaaba) | 09/07 | Diogo  | refactor(frontend): padroniza empty state e retry nos dashboards        |
| [`450e206`](https://github.com/Diogo-Olivv/HealthTech/commit/450e206) | 09/07 | Diogo  | refactor(frontend): FileUpload com sweetalert e opcao "enviar outro"    |
| [`2c9dac9`](https://github.com/Diogo-Olivv/HealthTech/commit/2c9dac9) | 09/07 | Diogo  | refactor(frontend): ModalVinculo com sweetalert e melhorias de a11y     |
| [`fef685c`](https://github.com/Diogo-Olivv/HealthTech/commit/fef685c) | 09/07 | Diogo  | feat(frontend): sucesso confirma com sweetalert antes do redirect      |
| [`2616f7d`](https://github.com/Diogo-Olivv/HealthTech/commit/2616f7d) | 09/07 | Diogo  | feat(frontend): tabs para trocar entre cadastro paciente/medico         |
| [`921bb0b`](https://github.com/Diogo-Olivv/HealthTech/commit/921bb0b) | 09/07 | Diogo  | feat(frontend): navbar confirma logout com sweetalert2                  |
| [`312fad4`](https://github.com/Diogo-Olivv/HealthTech/commit/312fad4) | 08/07 | Diogo  | style(frontend): tema HealthTech para popups do sweetalert2             |
| [`d022e82`](https://github.com/Diogo-Olivv/HealthTech/commit/d022e82) | 08/07 | Diogo  | feat(frontend): helpers de alerta usando sweetalert2                    |
| [`5588e9d`](https://github.com/Diogo-Olivv/HealthTech/commit/5588e9d) | 08/07 | Diogo  | chore(frontend): adiciona sweetalert2 como dependência                  |
| [`71db6f9`](https://github.com/Diogo-Olivv/HealthTech/commit/71db6f9) | 08/07 | Diogo  | feat(frontend): CRUD de arquivos com visualização, edição e exclusão    |
| [`bafca36`](https://github.com/Diogo-Olivv/HealthTech/commit/bafca36) | 08/07 | Diogo  | feat(frontend): seletor multi de especialidades e chips no listar médicos |
| [`8c19437`](https://github.com/Diogo-Olivv/HealthTech/commit/8c19437) | 08/07 | Diogo  | refactor(frontend): centraliza helpers HTTP, API_URL e token em src/lib |
| [`2744cb3`](https://github.com/Diogo-Olivv/HealthTech/commit/2744cb3) | 08/07 | Diogo  | feat(frontend): validações e feedback de UX no login e cadastros        |
| [`860a5bd`](https://github.com/Diogo-Olivv/HealthTech/commit/860a5bd) | 07/07 | Diogo  | feat(frontend): navbar dinamica + modal pesquisavel + DTO de upload     |
| [`03d7fc0`](https://github.com/Diogo-Olivv/HealthTech/commit/03d7fc0) | 07/07 | Lucas  | feat(frontend): cria pagina Meus médicos para o paciente                |
| [`6efdc27`](https://github.com/Diogo-Olivv/HealthTech/commit/6efdc27) | 07/07 | Lucas  | feat(frontend): adicionar toolbars de pesquisa e ordenacao              |
| [`477108f`](https://github.com/Diogo-Olivv/HealthTech/commit/477108f) | 07/07 | Lucas  | feat(frontend): adiciona icones nos botões de vinculo e upload          |
| [`274e17b`](https://github.com/Diogo-Olivv/HealthTech/commit/274e17b) | 07/07 | Lucas  | style(frontend): melhorar acessibilidade de teclado (A11y)              |
| [`56801e2`](https://github.com/Diogo-Olivv/HealthTech/commit/56801e2) | 07/07 | Lucas  | refactor(frontend): extrair duplicacoes para utils e tipagens globais   |

**Branches:** `refactor/frontend-architecture`, `refactor/vinculo-medico-paciente`, `feat/tela-auditoria`, `feat/integracao-funcionalidade-arquivos`
**Issue(s):** #29, #30, #58, além das relacionadas ao fechamento do frontend (auth, vínculo, arquivos)
**PRs:** [#64](https://github.com/Diogo-Olivv/HealthTech/pull/64), [#72](https://github.com/Diogo-Olivv/HealthTech/pull/72), [#79](https://github.com/Diogo-Olivv/HealthTech/pull/79) (merged)

---

### Testes Automatizados

- `audit`: cobertura de `400` quando `dataFim < dataInicio` e cap silencioso de `limit > 200`.
- `arquivos`: bloqueio de leitura/edição quando o vínculo não está `APROVADO`; specs de CRUD.
- `medico-paciente`: novos fluxos e edge cases de solicitação, aprovação, rejeição e revogação.
- `users`: payload de cadastro passa a usar `especialidadeIds`.
- `audit-log`: remove referência obsoleta a `LOGIN_FALHA`.
- Resultado atual: **116 testes passando no backend** e **38 no frontend**.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor  | Descrição                                                             |
| :-------------------------------------------------------------------- | :---- | :----- | :-------------------------------------------------------------------- |
| [`131fecb`](https://github.com/Diogo-Olivv/HealthTech/commit/131fecb) | 12/07 | Diogo  | test(audit): cobre 400 em dataFim<dataInicio e cap silencioso        |
| [`e711e6c`](https://github.com/Diogo-Olivv/HealthTech/commit/e711e6c) | 12/07 | Diogo  | test(users): payload usa especialidadeIds                             |
| [`7c99568`](https://github.com/Diogo-Olivv/HealthTech/commit/7c99568) | 09/07 | Diogo  | test(audit-log): remove referencia obsoleta a LOGIN_FALHA             |
| [`5db557a`](https://github.com/Diogo-Olivv/HealthTech/commit/5db557a) | 09/07 | Diogo  | test(arquivos): cobre bloqueio quando vinculo nao aprovado            |
| [`f229e11`](https://github.com/Diogo-Olivv/HealthTech/commit/f229e11) | 09/07 | Diogo  | test(medico-paciente): cobre novos fluxos e edge cases                |
| [`c0062e5`](https://github.com/Diogo-Olivv/HealthTech/commit/c0062e5) | 11/07 | Hugo   | test: testes adicionados                                              |
| [`b58df1c`](https://github.com/Diogo-Olivv/HealthTech/commit/b58df1c) | 11/07 | Hugo   | test: testes adicionados                                              |

**Branches:** `feat/auditoria-arquivos`, `feat/user-admin`, `refactor/vinculo-medico-paciente`

---

### Infraestrutura / CI-CD

- `cloudbuild.yaml`: lint (não bloqueante com `--fix`) + testes (bloqueantes) antes do build, com steps nomeados e paralelismo por camada.
- Workflow **CodeQL** semanal e em PRs (`.github/workflows/codeql.yml`).
- **Dependabot** semanal, agrupado por família (`@nestjs/*`, `typeorm`, `next`, `react`, `dev-dependencies`), com ignore de bumps *major* para npm (`.github/dependabot.yml`).
- **Husky + lint-staged** no monorepo: pre-commit roda ESLint apenas nos arquivos em stage.
- Fixes de deploy: `_BACKEND_URL` alinhado ao hostname atual do Cloud Run, `API_INTERNAL_URL` no build e no compose do frontend, remoção do VPC egress direto do frontend a cada deploy, log de `target` e `err.cause` em falhas do proxy de login.
- `docker-compose.override.yml` para hot reload em dev.
- Correção do `data-source` do TypeORM.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor | Descrição                                             |
| :-------------------------------------------------------------------- | :---- | :---- | :---------------------------------------------------- |
| [`02f1dec`](https://github.com/Diogo-Olivv/HealthTech/commit/02f1dec) | 12/07 | Diogo | fix(deploy): remove direct VPC egress do frontend     |
| [`8d48013`](https://github.com/Diogo-Olivv/HealthTech/commit/8d48013) | 12/07 | Diogo | fix(deploy): atualiza _BACKEND_URL para hostname atual|
| [`bcedb6f`](https://github.com/Diogo-Olivv/HealthTech/commit/bcedb6f) | 12/07 | Diogo | chore(auth): loga target e err.cause em falha do proxy|
| [`f5f3b9d`](https://github.com/Diogo-Olivv/HealthTech/commit/f5f3b9d) | 12/07 | Diogo | fix(deploy): API_INTERNAL_URL no front                |
| [`4a6f7f3`](https://github.com/Diogo-Olivv/HealthTech/commit/4a6f7f3) | 12/07 | Diogo | chore(compose): API_INTERNAL_URL                      |
| [`1865b9d`](https://github.com/Diogo-Olivv/HealthTech/commit/1865b9d) | 11/07 | Diogo | chore: adiciona husky + lint-staged                   |
| [`2d81b80`](https://github.com/Diogo-Olivv/HealthTech/commit/2d81b80) | 11/07 | Diogo | ci: configura Dependabot                              |
| [`8633cd4`](https://github.com/Diogo-Olivv/HealthTech/commit/8633cd4) | 11/07 | Diogo | ci: adiciona workflow CodeQL                          |
| [`94abd58`](https://github.com/Diogo-Olivv/HealthTech/commit/94abd58) | 11/07 | Diogo | ci: adiciona lint/testes ao cloudbuild                |
| [`0c768ce`](https://github.com/Diogo-Olivv/HealthTech/commit/0c768ce) | 09/07 | Diogo | fix: muda "-us" no cloudbuild                         |
| [`59cc7ad`](https://github.com/Diogo-Olivv/HealthTech/commit/59cc7ad) | 08/07 | Diogo | chore: docker compose override para hot reload em dev |

**Branches:** `fix/ci-pipeline-security`, `develop`
**PRs:** [#70](https://github.com/Diogo-Olivv/HealthTech/pull/70) (merged)

---

### Documentação e Governança

- Refatoração completa da documentação MkDocs para refletir o estado atual do `develop`: arquitetura (frontend, backend, banco, infra), tecnologias (Swagger, Tailwind, migrations, Multer, SweetAlert2), modelagem (ADMIN, especialidades N:N, workflow de vínculo) e gestão (cronograma real, metodologia).
- Nova seção `desenvolvimento/adr/` com índice, template e **ADR-0001** (migrations do TypeORM via Cloud Run Job `healthtech-migrations`, documentando trade-offs vs. rodar no boot ou direto do Cloud Build).
- Nova seção `desenvolvimento/padroes/` com padrões de Git, código, review, template de PR e templates de issue.
- Documentação da rota `GET /audit/logs` no README do backend.
- Documentação da criação do primeiro usuário ADMIN em desenvolvimento.
- Correção de links quebrados no `docs/index.md`; ajuste de `.pages` em `desenvolvimento` e `gestao/entregas`.

**Commits relacionados:**

| Hash                                                                  | Data  | Autor | Descrição                                                         |
| :-------------------------------------------------------------------- | :---- | :---- | :---------------------------------------------------------------- |
| [`4e06cd6`](https://github.com/Diogo-Olivv/HealthTech/commit/4e06cd6) | 12/07 | Diogo | docs(audit): documenta GET /audit/logs no README do backend       |
| [`3779384`](https://github.com/Diogo-Olivv/HealthTech/commit/3779384) | 11/07 | Hugo  | docs: documenta criação do primeiro usuário ADMIN em desenvolvimento |

**Branch:** `docs`, `chore/governance-adrs`

---

## Participação por Integrante

| Integrante | Commits | Issues principais                                             | Status       |
| :--------- | :-----: | :------------------------------------------------------------ | :----------- |
| Diogo      |   93    | #57, #72, refactor front, admin, CI/CD, deploy, docs, governança | Concluída    |
| Hugo       |    8    | #56, #57 (UserType.ADMIN, seed, endpoint de logs)              | Concluída    |
| Martin     |    3    | #54, #55 (auditoria de arquivos e vínculo, AuthRequest)        | Concluída    |
| Lucas      |    7    | #29 (Meus médicos), toolbars, A11y, ícones                     | Concluída    |
| Luíza      |    -    | -                                                              | -            |
| Gabriel    |    -    | -                                                              | -            |

---

## Bloqueios e Riscos

| Bloqueio / Risco                                                       | Impacto                                                    | Responsável | Prazo |
| :--------------------------------------------------------------------- | :--------------------------------------------------------- | :---------- | :---- |
| Retenção/arquivamento de logs de auditoria (#60) não iniciada          | Médio — a tabela `audit_logs` cresce indefinidamente hoje  | Hugo, Martin | 13/07 |
| Fechar manualmente os 13 PRs individuais do Dependabot após merge do #93 | Baixo — apenas ruído no board de PRs                       | Diogo       | 13/07 |
| Bump Docker `node:22-alpine → node:26-alpine` adiado                   | Baixo — aguardar Node 24 LTS antes de subir                | Diogo       | —     |

---

## Pendências para a Próxima Semana (fechamento do ciclo)

| Tarefa                                        | Responsável    | Issue | Prioridade |
| :-------------------------------------------- | :------------- | :---- | :--------- |
| Retenção/arquivamento de logs de auditoria    | Hugo, Martin   | #60   | Alta       |
| Apresentação final e demo do fluxo completo   | Todos          | —     | Alta       |
| Revisão final da documentação de arquitetura  | Diogo          | —     | Alta       |
| Fechamento dos PRs individuais do Dependabot  | Diogo          | —     | Baixa      |

---

_Documento preenchido por: Diogo_
