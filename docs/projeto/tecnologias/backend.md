# Backend

## NestJS + TypeScript

**O que é**

NestJS é um framework para construção de APIs em Node.js, inspirado na arquitetura do Angular. Organiza o código em **módulos**, **controllers** e **services**, forçando uma separação clara de responsabilidades.

**Como funciona**

- **Module**: declara o que existe em um domínio (ex.: `UsersModule` registra o controller e o service de usuários).
- **Controller**: recebe requisições HTTP e delega ao service. Sem regra de negócio.
- **Service**: concentra toda a lógica (validações, transformações, persistência).
- **DTO + ValidationPipe**: valida cada campo com `class-validator` antes de chegar ao controller. O pipe global usa `whitelist: true` e `forbidNonWhitelisted: true`, portanto campo extra vira `400 Bad Request`.

```
Requisição HTTP
    1. ValidationPipe (DTO)
    2. Guards (JwtAuthGuard, RolesGuard)
    3. AuditInterceptor (leitura do @Audit)
    4. Controller
    5. Service
    6. TypeORM Repository
    7. Response
```

**Por que foi escolhido**

- Arquitetura solicitada no plano do projeto.
- Suporte nativo a TypeScript.
- Integração fácil com TypeORM, JWT, class-validator, Swagger.
- Muito usado em projetos corporativos brasileiros e internacionais.

---

## TypeORM

**O que é**

ORM para TypeScript. Permite trabalhar com o banco usando classes TypeScript (entities) em vez de escrever SQL manualmente. Suporta migrations versionadas.

**Como funciona**

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;
}
```

`synchronize` está **desligado** em todos os ambientes. Qualquer alteração em entidade exige migration. Comandos em `backend/package.json`:

```bash
npm run migration:generate -- src/migrations/NomeDescritivo
npm run migration:create -- src/migrations/NomeVazio
npm run migration:run
npm run migration:revert
```

Em desenvolvimento, o backend aplica migrations pendentes no boot (`migrationsRun` fora de produção). Em produção, quem aplica é o Cloud Run Job `healthtech-migrations`, conforme o [ADR-0001](../../desenvolvimento/adr/0001-migrations-via-cloud-run-job.md).

---

## Multer (upload)

Multer é integrado ao Nest via `@nestjs/platform-express` e usado para receber uploads multipart. No `POST /arquivos/upload` combinamos `FileInterceptor('arquivo')` com `ParseFilePipe`:

```typescript
new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
    new FileTypeValidator({
      fileType: /^(application\/pdf|image\/(jpeg|png))$/,
      fallbackToMimetype: true,
    }),
  ],
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});
```

Limite de 10 MB e apenas PDF, JPEG e PNG.

---

## Swagger

Documentação interativa habilitada em ambientes que não sejam `production`. Configurada em `main.ts` via `@nestjs/swagger` com Bearer Auth persistido:

- URL: `http://localhost:3001/docs`
- Decorators nos controllers: `@ApiTags`, `@ApiOperation`, `@ApiBody`, `@ApiResponse`, `@ApiBearerAuth('access-token')`, `@ApiForbiddenResponse`, `@ApiUnauthorizedResponse`.

---

## Auditoria

`AuditInterceptor` global + decorator `@Audit({ evento, extractRecursoId? })`. Persiste em `audit_logs` (tabela quente) e loga via `Logger` do Nest. Consulta ADMIN em `GET /audit/logs` com filtros e paginação (padrão `limit=50`, cap silencioso em `200`).

---

## Referências

### NestJS

- [Documentação oficial](https://docs.nestjs.com/)
- [Controllers](https://docs.nestjs.com/controllers)
- [Providers e Services](https://docs.nestjs.com/providers)
- [Validation](https://docs.nestjs.com/techniques/validation)
- [OpenAPI (Swagger)](https://docs.nestjs.com/openapi/introduction)

### TypeORM

- [Documentação oficial](https://typeorm.io/)
- [Entities](https://typeorm.io/entities)
- [Migrations](https://typeorm.io/migrations)
