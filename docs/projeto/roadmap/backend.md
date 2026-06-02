# Backend

**Stack do projeto:** [NestJS + TypeORM + PostgreSQL](../tecnologias/backend.md)

---

## Etapa 1: Node.js + TypeScript

- [Documentação oficial: Node.js](https://nodejs.org/docs/latest/api/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Rocketseat: Node.js](https://www.rocketseat.com.br/)

---

## Etapa 2: API REST

| Tópico       | O que estudar                                        | Recurso                                                   |
| ------------ | ---------------------------------------------------- | --------------------------------------------------------- |
| HTTP         | Métodos, status codes, headers, body, cookies        | [HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP) |
| REST         | Recursos, idempotência, design de URL, versionamento | [REST API](https://restfulapi.net/)                       |
| JSON         | Estrutura, parsing, validação                        | [JSON.org](https://www.json.org/json-pt.html)             |
| Autenticação | Sessão vs Token, JWT, OAuth básico                   | [JWT.io](https://jwt.io/introduction)                     |

---

## Etapa 3: NestJS

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

---

## Etapa 4: TypeORM

- [TypeORM: Documentação oficial](https://typeorm.io/)
- [NestJS & ORM](https://docs.nestjs.com/techniques/database)

### Conceitos principais

- Entities, decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`)
- Relacionamentos (`@OneToMany`, `@ManyToOne`)
- Repository pattern (`find`, `save`, `delete`, `findOneBy`)
- Migrations vs `synchronize: true`
