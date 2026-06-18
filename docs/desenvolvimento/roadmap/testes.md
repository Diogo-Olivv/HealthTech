# Testes

**Stack do projeto:** [Jest + @nestjs/testing + Supertest (back), Jest + React Testing Library + Playwright (front)](../../projeto/tecnologias/testes.md)

---

## Etapa 1: Fundamentos de teste

- [Kent C. Dodds: Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Martin Fowler: TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)

### Tipos de teste que usamos

- **Unitário**: função pura, mock de dependências
- **Integração**: múltiplos módulos juntos
- **End-to-End (E2E)**: fluxo real do usuário

---

## Etapa 2: Jest

- [Jest: Getting Started](https://jestjs.io/docs/getting-started)
- [Jest: Matchers (`expect`)](https://jestjs.io/docs/expect)
- [Jest: Mock Functions](https://jestjs.io/docs/mock-functions)

### Conceitos principais

- `describe`, `it`, `expect`
- `beforeEach`, `afterEach`, `beforeAll`
- Mocks (`jest.fn()`, `jest.spyOn()`, `jest.mock()`)
- Coverage (`--coverage`)

---

## Etapa 3: Testes no NestJS (backend)

### Unitários

- [NestJS: Unit Testing](https://docs.nestjs.com/fundamentals/testing#unit-testing)
- Padrão:
  ```typescript
  describe("UsersService", () => {
    let service: UsersService;
    let repo: MockType<Repository<User>>;
    // setup com TestingModule + mock do repository
  });
  ```

### Integração / E2E

- [NestJS: End-to-End Testing](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing)
- [Supertest: Repositório](https://github.com/ladjs/supertest)
- Padrão (`test/*.e2e-spec.ts`):
  ```typescript
  const app = moduleFixture.createNestApplication();
  await app.init();
  await request(app.getHttpServer()).post("/api/users").send({...}).expect(201);
  ```

### Banco de teste

- [NestJS + TypeORM: Testing](https://docs.nestjs.com/recipes/sql-typeorm#testing)
- Estratégias:
  - SQLite em memória (rápido, comportamento diferente do Postgres)
  - Postgres em container (Docker Compose com banco `healthtech_test`)
  - `testcontainers-node` (sobe Postgres descartável a cada suíte)

---

## Etapa 4: Testes no React/Next.js (frontend)

### Componentes (React Testing Library)

- [React Testing Library: Intro](https://testing-library.com/docs/react-testing-library/intro/)
- [Cheatsheet: Testing Library](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Queries: Order of priority](https://testing-library.com/docs/queries/about/#priority)
- Filosofia: teste o que o usuário vê, não a implementação

### Interações (@testing-library/user-event)

- [user-event: Documentação](https://testing-library.com/docs/user-event/intro)

### E2E (Playwright)

- [Playwright: Documentação oficial](https://playwright.dev/docs/intro)
- [Playwright: Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright: Test Generator (codegen)](https://playwright.dev/docs/codegen)
- [Playwright: Canal oficial no YouTube](https://www.youtube.com/@Playwrightdev)

---

## Etapa 5: Boas práticas

- **AAA (Arrange-Act-Assert)**: estrutura padrão de cada teste
- Nome do teste descreve o comportamento esperado, não a implementação
- Um `expect` principal por teste
- Mocks apenas no que é externo ao código sendo testado
- Não testar implementação interna (estado de hook, função privada)
- Não usar `sleep` ou `setTimeout` em E2E, use `waitFor` / `expect.poll`
