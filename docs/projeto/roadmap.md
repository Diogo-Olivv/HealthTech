# Roadmap Técnico

Guia de aprendizado das tecnologias do projeto, organizado por área.

> Este roadmap referencia a stack definida em [Tecnologias do Projeto](tecnologias.md). O `tecnologias.md` explica **o que** usamos e **por que**.

---

## Como usar este documento

1. **Identifique sua área de foco** (Frontend, Backend, Banco, DevOps ou Testes).
2. **Comece pelos fundamentos** antes de pular para o framework.
3. **Pratique enquanto estuda.** Rode pelo menos um exemplo de cada tópico.
4. **Use o [roadmap.sh](https://roadmap.sh/)** como mapa visual complementar.

---

## Roadmaps Visuais

- [Frontend](https://roadmap.sh/frontend)
- [Backend](https://roadmap.sh/backend)
- [Postgresql-dba](https://roadmap.sh/postgresql-dba)
- [DevOps](https://roadmap.sh/devops)
- [QA](https://roadmap.sh/qa)
- [React](https://roadmap.sh/react)
- [Nodejs](https://roadmap.sh/nodejs)

---

## Frontend

**Stack do projeto:** [Next.js + TypeScript + CSS Modules](tecnologias.md#frontend)

### Etapa 1: HTML + CSS + JS

| Tópico             | O que estudar                                       | Recurso recomendado                                                                                                                              |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| HTML5              | Tags corretas, acessibilidade, formulários          | [HTML basics](https://developer.mozilla.org/en-US/docs/Learn/HTML)                                                                               |
| CSS                | Box model, Flexbox, Grid, responsividade, variáveis | [Flexbox Froggy](https://flexboxfroggy.com/), [Grid Garden](https://cssgridgarden.com/), [CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS) |
| JavaScript moderno | ES6+, async/await, destructuring, módulos, fetch    | [JavaScript.info](https://javascript.info/), [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)                                     |

### Etapa 2: TypeScript

- [Documentação oficial](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Etapa 3: React

- [React.dev](https://react.dev/learn)
- [Rocketseat](https://www.rocketseat.com.br/)

#### Conceitos principais:

- Componentes, props, estado
- Hooks (`useState`, `useEffect`, `useContext`, custom hooks)
- Renderização condicional, listas, formulários controlados
- Lifting state up, composição vs herança

### Etapa 4: Next.js

O projeto usa o **App Router**.

- [Documentação oficial: Next.js](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)

#### Conceitos principais:

- Roteamento por pastas
- Server vs Client Components (`'use client'`)
- Layouts, loading, error boundaries
- Data fetching, cache, revalidação

### Etapa 5: CSS Modules

- [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)
- [CSS Modules in 100 seconds](https://www.youtube.com/results?search_query=css+modules+web+dev+simplified)

---

## Backend

**Stack do projeto:** [NestJS + TypeORM + PostgreSQL](tecnologias.md#backend)

### Etapa 1: Node.js + TypeScript

- [Documentação oficial: Node.js](https://nodejs.org/docs/latest/api/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Rocketseat: Node.js](https://www.rocketseat.com.br/)

### Etapa 2: API REST

| Tópico       | O que estudar                                        | Recurso                                                   |
| ------------ | ---------------------------------------------------- | --------------------------------------------------------- |
| HTTP         | Métodos, status codes, headers, body, cookies        | [HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP) |
| REST         | Recursos, idempotência, design de URL, versionamento | [REST API](https://restfulapi.net/)                       |
| JSON         | Estrutura, parsing, validação                        | [JSON.org](https://www.json.org/json-pt.html)             |
| Autenticação | Sessão vs Token, JWT, OAuth básico                   | [JWT.io](https://jwt.io/introduction)                     |

### Etapa 3: NestJS

- [Documentação oficial: NestJS](https://docs.nestjs.com/)
- [Marius Espejo: NestJS Crash Course](https://www.youtube.com/results?search_query=marius+espejo+nestjs)

**Estude nessa ordem:**

1. **Module**: como o NestJS organiza domínios (`@Module`, imports/exports)
2. **Controller**: recebe HTTP, mapeia rotas (`@Controller`, `@Get`, `@Post`, `@Body`, `@Param`)
3. **Service / Provider**: regra de negócio (`@Injectable`)
4. **DTO + ValidationPipe**: validação automática com `class-validator`
5. **Guards**: autenticação/autorização nas rotas
6. **Interceptors**: transformar request/response (ex: remover `passwordHash`)
7. **Exception Filters**: padronizar erros da API

### Etapa 4: TypeORM

- [TypeORM: Documentação oficial](https://typeorm.io/)
- [NestJS & ORM](https://docs.nestjs.com/techniques/database)

#### Conceitos Principais:

- Entities, decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`)
- Relacionamentos (`@OneToMany`, `@ManyToOne`)
- Repository pattern (`find`, `save`, `delete`, `findOneBy`)
- Migrations vs `synchronize: true`

---

## Banco de Dados

**Stack do projeto:** [PostgreSQL via Docker (dev) + Google Cloud SQL (prod)](tecnologias.md#banco-de-dados)

### Etapa 1: SQL e modelagem relacional

- [SQLZoo](https://sqlzoo.net/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Use The Index, Luke!](https://use-the-index-luke.com/)

#### Conceitos Principais:

- SELECT, JOIN (INNER, LEFT), WHERE, GROUP BY, HAVING
- CRUD completo (INSERT, UPDATE, DELETE)
- Normalização (1FN, 2FN, 3FN)
- Índices, chaves estrangeiras, constraints
- Transações e ACID

### Etapa 2: PostgreSQL específico

- [PostgreSQL: Documentação oficial](https://www.postgresql.org/docs/)

#### Recursos Principais:

- UUIDs nativos (`uuid_generate_v4()`)
- JSONB
- Full-text search
- Timestamps com timezone

### Etapa 3: Docker e Docker Compose

- [Docker: Get Started](https://docs.docker.com/get-started/)
- [Docker Compose: Overview](https://docs.docker.com/compose/)
- [Fireship: Docker in 100 seconds](https://www.youtube.com/watch?v=Gjnup-PuquQ)

#### Conceitos Principais:

- Imagens vs containers vs volumes
- `docker compose up/down/logs/ps`
- Persistência de dados (volumes)
- Networking entre containers (`postgres` vs `localhost`)

### Etapa 4: Google Cloud SQL (produção)

- [Cloud SQL para PostgreSQL: Visão geral](https://cloud.google.com/sql/docs/postgres)
- [Conectar Cloud Run ao Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-run)
- [Boas práticas: Cloud SQL](https://cloud.google.com/sql/docs/postgres/best-practices)
- [Google Cloud: Canal oficial no YouTube](https://www.youtube.com/@googlecloudtech)

### Etapa 5: Ferramentas visuais

- **Adminer** (incluso no `docker-compose.yml`)
- [DBeaver](https://dbeaver.io/) (cliente desktop completo)
- [pgAdmin](https://www.pgadmin.org/) (cliente oficial do Postgres)

---

## DevOps

**Stack do projeto:** [Docker + Cloud Run + Cloud SQL + GitHub Actions](tecnologias.md#armazenamento-de-arquivos) (CI/CD a ser definido)

### Etapa 1: Fundamentos

- [The Twelve-Factor App](https://12factor.net/pt_br/)
- [Roadmap.sh: DevOps](https://roadmap.sh/devops)

#### Conceitos Principais:

- Diferença entre dev/staging/prod
- Variáveis de ambiente e secrets
- Build vs runtime
- Imutabilidade de artefatos

### Etapa 2: CI/CD

- [GitHub Actions: Documentação oficial](https://docs.github.com/en/actions)
- [GitHub Actions: Quickstart](https://docs.github.com/en/actions/quickstart)
- [Fireship: GitHub Actions in 100s](https://www.youtube.com/watch?v=R8_veQiYBjI)
- Pipeline padrão do projeto:
  ```
  push -> lint -> test -> build -> deploy (Cloud Run)
  ```

#### Conceitos Principais:

- Workflows, jobs, steps
- Triggers (`push`, `pull_request`, `workflow_dispatch`)
- Secrets do GitHub
- Cache de dependências (`actions/cache`)

### Etapa 3: Google Cloud Run

- [Cloud Run: Visão geral](https://cloud.google.com/run/docs/overview/what-is-cloud-run)
- [Deploy de container no Cloud Run](https://cloud.google.com/run/docs/deploying)
- [Cloud Run: Variáveis de ambiente](https://cloud.google.com/run/docs/configuring/environment-variables)
- [Cloud Run: Conectar ao Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-run)

#### Conceitos Principais:

- Imagem Docker pronta para produção
- `Dockerfile` multi-stage
- Mínimo `cpu`, `memory`, `concurrency`
- Cold start

### Etapa 4: Validação e Observabilidade

- [Cloud Logging: Documentação](https://cloud.google.com/logging/docs)
- [Cloud Monitoring: Documentação](https://cloud.google.com/monitoring/docs)

#### Conceitos Principais:

- Logs estruturados (JSON, não `console.log` solto)
- Healthcheck endpoint (`GET /health`)
- Alertas básicos (latência, erros 5xx, uso de DB)

### Etapa 5: Segurança DevOps

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Google Cloud: IAM básico](https://cloud.google.com/iam/docs/overview)

#### Boas práticas do projeto:

- Nunca commit de `.env`
- Secrets via Secret Manager (não env vars em texto)
- Service accounts com privilégio mínimo

---

## Testes

**Stack do projeto:** [Jest + @nestjs/testing + Supertest (back), Jest + React Testing Library + Playwright (front)](tecnologias.md#testes-automatizados)

### Etapa 1: Fundamentos de teste

- [Kent C. Dodds: Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Martin Fowler: TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)

#### Tipos de teste que usamos:

- **Unitário**: função pura, mock de dependências
- **Integração**: múltiplos módulos juntos
- **End-to-End (E2E)**: fluxo real do usuário

### Etapa 2: Jest

- [Jest: Getting Started](https://jestjs.io/docs/getting-started)
- [Jest: Matchers (`expect`)](https://jestjs.io/docs/expect)
- [Jest: Mock Functions](https://jestjs.io/docs/mock-functions)

#### Conceitos Principais:

- `describe`, `it`, `expect`
- `beforeEach`, `afterEach`, `beforeAll`
- Mocks (`jest.fn()`, `jest.spyOn()`, `jest.mock()`)
- Coverage (`--coverage`)

### Etapa 3: Testes no NestJS (backend)

#### Unitários

- [NestJS: Unit Testing](https://docs.nestjs.com/fundamentals/testing#unit-testing)
- Padrão:
  ```typescript
  describe("UsersService", () => {
    let service: UsersService;
    let repo: MockType<Repository<User>>;
    // setup com TestingModule + mock do repository
  });
  ```

#### Integração / E2E

- [NestJS: End-to-End Testing](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing)
- [Supertest: Repositório](https://github.com/ladjs/supertest)
- Padrão (`test/*.e2e-spec.ts`):
  ```typescript
  const app = moduleFixture.createNestApplication();
  await app.init();
  await request(app.getHttpServer()).post("/api/users").send({...}).expect(201);
  ```

#### Banco de teste

- [NestJS + TypeORM: Testing](https://docs.nestjs.com/recipes/sql-typeorm#testing)
- Estratégias:
  - SQLite em memória (rápido, comportamento diferente do Postgres)
  - Postgres em container (Docker Compose com banco `healthtech_test`)
  - `testcontainers-node` (sobe Postgres descartável a cada suíte)

### Etapa 4: Testes no React/Next.js (frontend)

#### Componentes (React Testing Library)

- [React Testing Library: Intro](https://testing-library.com/docs/react-testing-library/intro/)
- [Cheatsheet: Testing Library](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Queries: Order of priority](https://testing-library.com/docs/queries/about/#priority)
- Filosofia: teste o que o usuário vê, não a implementação

#### Interações (`@testing-library/user-event`)

- [user-event: Documentação](https://testing-library.com/docs/user-event/intro)

#### E2E (Playwright)

- [Playwright: Documentação oficial](https://playwright.dev/docs/intro)
- [Playwright: Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright: Test Generator (codegen)](https://playwright.dev/docs/codegen)
- [Playwright: Canal oficial no YouTube](https://www.youtube.com/@Playwrightdev)

### Etapa 5: Boas práticas

- **AAA (Arrange-Act-Assert)**: estrutura padrão de cada teste
- Nome do teste descreve o comportamento esperado, não a implementação
- Um `expect` principal por teste
- Mocks apenas no que é externo ao código sendo testado
- Não testar implementação interna (estado de hook, função privada)
- Não usar `sleep` ou `setTimeout` em E2E, use `waitFor` / `expect.poll`

---

## Recomendações Gerais

### Livros

- _Clean Code_, Robert C. Martin
- _The Pragmatic Programmer_, Hunt & Thomas
- _Designing Data-Intensive Applications_, Martin Kleppmann
- _Refactoring_, Martin Fowler

---

## Plano sugerido por papel no time

| Papel          | Foco primário                         | Foco secundário              |
| -------------- | ------------------------------------- | ---------------------------- |
| Dev Frontend   | HTML/CSS/JS, React, Next.js, Testes   | TypeScript avançado, DevOps  |
| Dev Backend    | Node/TS, NestJS, TypeORM, PostgreSQL  | Testes, CI/CD                |
| Dev Fullstack  | Backend, Frontend, Testes             | DevOps, Banco avançado       |
| DevOps / Cloud | Docker, GitHub Actions, Cloud Run/SQL | Observabilidade, Segurança   |
| QA / Testes    | Pirâmide, Jest, Playwright            | NestJS Testing, API contract |

---

## Referências

- [Tecnologias do Projeto](tecnologias.md): stack oficial e justificativas
- [Arquitetura do Projeto](arquitetura.md): como as camadas se conectam
- [Setup Inicial](setup.md): como rodar tudo localmente
- [Padrões de Código](../padroes/codigo.md): o que esperamos de cada PR
- [roadmap.sh](https://roadmap.sh/): mapa visual oficial de carreiras tech
