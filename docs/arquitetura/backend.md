# Arquitetura Backend

## Estrutura de Módulos

O backend NestJS é organizado em módulos por domínio. O `AppModule` importa cada domínio e registra o `AuditInterceptor` globalmente via `APP_INTERCEPTOR`.

```
backend/src/
├── app.module.ts                → módulo raiz, registra domínios e o interceptor de auditoria
├── main.ts                      → bootstrap (porta 3001, CORS, ValidationPipe, Swagger)
├── data-source.ts               → DataSource do TypeORM (usado pelas migrations)
├── auth/
│   ├── jwt.strategy.ts          → extrai payload do JWT
│   ├── jwt-auth.guard.ts        → protege rotas autenticadas
│   ├── roles.guard.ts           → protege rotas por tipo de usuário
│   ├── roles.decorator.ts       → @Roles(...)
│   └── models/AuthRequest.ts    → tipagem única de Request autenticado
├── users/
│   ├── users.controller.ts      → cadastro, login e áreas restritas
│   ├── users.service.ts
│   ├── users.module.ts
│   └── seeds/admin.seed.ts      → seed manual do primeiro usuário ADMIN
├── arquivos/
│   ├── arquivos.controller.ts   → upload, listagem, download, edição e exclusão
│   ├── arquivos.service.ts
│   └── arquivos.module.ts
├── medico-paciente/
│   ├── medico-paciente.controller.ts → solicitações, aprovações, revogações
│   ├── medico-paciente.service.ts
│   └── medico-paciente.module.ts
├── especialidades/
│   ├── especialidades.controller.ts
│   ├── especialidades.service.ts
│   └── especialidades.module.ts
├── audit/
│   ├── audit.controller.ts      → GET /audit/logs (ADMIN)
│   ├── audit.decorator.ts       → @Audit(...)
│   ├── audit.interceptor.ts     → registra SUCCESS/FAILURE globalmente
│   ├── audit-log.service.ts
│   ├── audit.module.ts
│   └── dto/audit-log-query.dto.ts
├── health/
│   └── health.controller.ts     → GET /health
├── storage/
│   ├── storage.service.ts       → driver local (dev) ou GCS (produção)
│   └── storage.module.ts
├── entities/
│   ├── user.entity.ts           → UserType: PACIENTE, MEDICO, ADMIN
│   ├── paciente.entity.ts
│   ├── medico.entity.ts
│   ├── especialidade.entity.ts
│   ├── medico-paciente.entity.ts → inclui StatusVinculo
│   ├── arquivo.entity.ts
│   └── audit-log/audit-log.entity.ts
├── migrations/                  → todas as migrations TypeORM versionadas
└── common/validators/is-cpf.validator.ts
```

---

## Rotas da API

Todas as rotas protegidas exigem o header `Authorization: Bearer <token>`. O prefixo global padrão é `/`.

### Usuários (`/users`)

| Método | Rota                   | Guard              | Descrição                                    |
| ------ | ---------------------- | ------------------ | -------------------------------------------- |
| POST   | `/users/pacientes`     | Público            | Cadastro de paciente (força `tipo=PACIENTE`) |
| POST   | `/users/medicos`       | Público            | Cadastro de médico com especialidades N:N    |
| POST   | `/users/login`         | Público            | Login, retorna `{ accessToken, user }`       |
| GET    | `/users/me`            | JWT                | Dados do usuário autenticado                 |
| GET    | `/users/paciente/area` | JWT + PACIENTE     | Área restrita ao paciente                    |
| GET    | `/users/medico/area`   | JWT + MEDICO       | Área restrita ao médico                      |

O `ValidationPipe` global usa `whitelist: true` e `forbidNonWhitelisted: true`. Enviar `tipo=ADMIN` no cadastro público resulta em `400 Bad Request`.

### Arquivos (`/arquivos`)

Guard global do controller: `JwtAuthGuard + RolesGuard`.

| Método | Rota                                | Roles                | Descrição                                                                        |
| ------ | ----------------------------------- | -------------------- | -------------------------------------------------------------------------------- |
| GET    | `/arquivos`                         | PACIENTE, MEDICO     | Lista arquivos do usuário autenticado (médico vê os que subiu, paciente os seus) |
| GET    | `/arquivos/paciente/:pacienteId`    | MEDICO               | Prontuário: arquivos do paciente vinculado ao médico                             |
| POST   | `/arquivos/upload`                  | MEDICO               | Upload multipart (`arquivo` + `pacienteId` + `descricao?`), até 10 MB, PDF/JPEG/PNG |
| GET    | `/arquivos/:id/download`            | PACIENTE, MEDICO     | Gera URL de download temporária                                                  |
| GET    | `/arquivos/:id/raw`                 | PACIENTE, MEDICO     | Stream do binário do arquivo                                                     |
| PATCH  | `/arquivos/:id`                     | MEDICO               | Atualiza `descricao` do arquivo                                                  |
| DELETE | `/arquivos/:id`                     | MEDICO               | Exclui arquivo (banco + storage)                                                 |

### Vínculo Médico-Paciente (`/medico-paciente`)

O vínculo tem workflow de aprovação. Estados possíveis em `MedicoPaciente.status`: `PENDENTE`, `APROVADO`, `REJEITADO`, `REVOGADO`.

| Método | Rota                                             | Roles     | Descrição                                                    |
| ------ | ------------------------------------------------ | --------- | ------------------------------------------------------------ |
| POST   | `/medico-paciente/vincular`                      | MEDICO    | Solicita vínculo com um paciente (cria em `PENDENTE`)        |
| DELETE | `/medico-paciente/desvincular`                   | MEDICO    | Remove um vínculo já existente                               |
| GET    | `/medico-paciente/meus-pacientes`                | MEDICO    | Lista pacientes vinculados ao médico                         |
| GET    | `/medico-paciente/pacientes-disponiveis`         | MEDICO    | Pacientes sem vínculo ativo com o médico                     |
| GET    | `/medico-paciente/solicitacoes-enviadas`         | MEDICO    | Solicitações que o médico já enviou                          |
| GET    | `/medico-paciente/meus-medicos`                  | PACIENTE  | Lista médicos vinculados ao paciente                         |
| GET    | `/medico-paciente/solicitacoes-pendentes`        | PACIENTE  | Solicitações aguardando resposta do paciente                 |
| POST   | `/medico-paciente/solicitacoes/:medicoId/aprovar`| PACIENTE  | Aprova a solicitação de vínculo                              |
| POST   | `/medico-paciente/solicitacoes/:medicoId/rejeitar`| PACIENTE | Rejeita a solicitação                                        |
| DELETE | `/medico-paciente/vinculos/:medicoId`            | PACIENTE  | Revoga o acesso do médico                                    |

### Auditoria (`/audit`)

| Método | Rota            | Roles | Descrição                                                       |
| ------ | --------------- | ----- | --------------------------------------------------------------- |
| GET    | `/audit/logs`   | ADMIN | Lista paginada de eventos, com filtros e ordenação `timestamp DESC` |

Query params suportados: `userId`, `tipoEvento`, `dataInicio`, `dataFim`, `page`, `limit`. `limit` é capado em `200`; `dataFim` precisa ser maior ou igual a `dataInicio`. A própria rota **não** é auditada, para evitar ruído.

### Especialidades (`/especialidades`)

| Método | Rota                | Guard   | Descrição                              |
| ------ | ------------------- | ------- | -------------------------------------- |
| GET    | `/especialidades`   | Público | Lista as especialidades ativas do sistema |

Consumido pelo formulário de cadastro de médico no frontend.

### Health check

| Método | Rota      | Guard   | Descrição                        |
| ------ | --------- | ------- | -------------------------------- |
| GET    | `/health` | Público | Verifica se o serviço está no ar |

### Swagger

Em ambientes que não sejam `production`, a UI do Swagger fica disponível em `/docs` com Bearer Auth persistido.

---

## Guards, roles e AuthRequest

O NestJS usa dois guards em cadeia:

**1. `JwtAuthGuard`** valida o token via `passport-jwt` e injeta o payload em `req.user`.

**2. `RolesGuard`** consulta o metadata do decorator `@Roles(...)` e compara com `req.user.tipo`.

A tipagem única de `Request` autenticado vive em `src/auth/models/AuthRequest.ts`:

```typescript
export interface AuthUser {
  id: string;
  tipo: UserType;
}

export type AuthRequest = Request & { user: AuthUser };
```

Exemplo de handler:

```typescript
@Get('medico/area')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.MEDICO)
areaMedico(@Req() req: AuthRequest) {
  return { mensagem: 'Área restrita a médicos', user: req.user };
}
```

O tipo do usuário fica no payload do JWT e evita consulta extra ao banco a cada requisição.

---

## Auditoria

O `AuditInterceptor` está registrado como interceptor global no `AppModule`. Rotas usam o decorator `@Audit({...})` para declarar o que deve virar log:

```typescript
@Post('vincular')
@Audit({
  evento: TipoEventoAuditoria.VINCULO_MEDICO_PACIENTE,
  extractRecursoId: (_res, req) => req.body.pacienteId,
})
vincular(...) { ... }
```

Fluxo:

1. O interceptor lê a metadata do handler.
2. Aguarda a response no `tap` e registra `SUCCESS`.
3. Em caso de exceção, registra `FAILURE` no `catchError` e re-lança a exceção original para o `ExceptionFilter` padrão.
4. Chama `AuditLogService.registrar(...)` com `evento`, `userId`, `recursoId`, `status` e `Request`.

O `AuditLogService.registrar(...)` persiste o registro em `audit_logs` (tabela quente) e também emite via `Logger` do Nest (`log` para sucesso, `warn` para falha). O catálogo completo de eventos está em `TipoEventoAuditoria` (`audit-log.entity.ts`): `LOGIN`, `CRIACAO_USUARIO`, `UPLOAD_ARQUIVO`, `VISUALIZACAO_ARQUIVO`, `DOWNLOAD_ARQUIVO`, `EXCLUSAO_ARQUIVO`, `VINCULO_MEDICO_PACIENTE`, `SOLICITACAO_VINCULO`, `APROVACAO_VINCULO`, `REJEICAO_VINCULO`, `REVOGACAO_VINCULO`, `DESVINCULO_MEDICO_PACIENTE`, `ACESSO_NEGADO`, `TENTATIVA_ESCALONAMENTO_PRIVILEGIO`, entre outros.

`LOGIN_FALHA` foi removido do enum (issue #57): a consulta equivalente passa a ser `WHERE tipoEvento = 'LOGIN' AND status = 'FAILURE'`.

---

## Fluxo de uma requisição

```
HTTP Request
  → ValidationPipe (valida DTO, rejeita campo não declarado)
  → JwtAuthGuard (valida token)
  → RolesGuard (valida @Roles vs tipo do usuário)
  → AuditInterceptor (lê @Audit)
  → Controller (delega ao Service)
  → Service (regra de negócio)
  → TypeORM Repository (persiste e consulta)
  → Interceptor registra SUCCESS ou FAILURE
  → HTTP Response
```

---

## Configuração principal (`main.ts`)

```typescript
const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());

app.enableCors({ origin: allowedOrigins, credentials: true });

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);

if (['development', 'dev', 'staging', 'test'].includes(nodeEnv)) {
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
```

- `whitelist` remove campos não declarados no DTO.
- `forbidNonWhitelisted` transforma o "campo extra" em `400 Bad Request`.
- `transform` converte tipos primitivos automaticamente (ex.: `Query() page: number`).
- CORS aceita múltiplas origens separadas por vírgula (`FRONTEND_URL`) e envia `credentials: true` para permitir cookies.

---

## Primeiro usuário ADMIN

Não existe rota pública que crie um `ADMIN`. Para provisionar o primeiro administrador em desenvolvimento, use o seed manual:

```bash
# em backend/.env
ADMIN_EMAIL=admin@healthtech.dev
ADMIN_PASSWORD=uma-senha-forte

npm run seed:admin
```

O script (`src/users/seeds/admin.seed.ts`) é idempotente: se já existir usuário com o e-mail informado, nada é alterado. Em `NODE_ENV=production` o seed só roda com `ADMIN_SEED_ALLOW_PROD=true` (ação deliberada).
