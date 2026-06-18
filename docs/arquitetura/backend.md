# Arquitetura Backend

## Estrutura de Módulos

```
backend/src/
├── app.module.ts              → módulo raiz (registra tudo)
├── main.ts                    → bootstrap (porta 3001, CORS, ValidationPipe)
├── auth/
│   ├── jwt.strategy.ts        → extrai payload do token JWT
│   ├── jwt-auth.guard.ts      → protege rotas que exigem login
│   └── roles.guard.ts         → protege rotas por tipo de usuário
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts    → rotas de cadastro e login
│   └── users.service.ts
├── arquivos/
│   ├── arquivos.module.ts
│   ├── arquivos.controller.ts → rotas de upload e listagem
│   └── arquivos.service.ts
├── medico-paciente/
│   ├── medico-paciente.module.ts
│   ├── medico-paciente.controller.ts → rotas de vínculo
│   └── medico-paciente.service.ts
└── entities/
    ├── user.entity.ts
    ├── arquivo.entity.ts
    └── medico-paciente.entity.ts
```

---

## Rotas da API

### Usuários (`/users`)

| Método | Rota                  | Guard              | Descrição                        |
| ------ | --------------------- | ------------------ | -------------------------------- |
| POST   | `/users/pacientes`    | —                  | Cadastro de paciente             |
| POST   | `/users/medicos`      | —                  | Cadastro de médico               |
| POST   | `/users/login`        | —                  | Login (retorna JWT)              |
| GET    | `/users/me`           | JWT                | Dados do usuário autenticado     |
| GET    | `/users/paciente/area`| JWT + PACIENTE     | Área restrita ao paciente        |
| GET    | `/users/medico/area`  | JWT + MEDICO       | Área restrita ao médico          |

### Arquivos (`/arquivos`)

| Método | Rota               | Guard          | Descrição                              |
| ------ | ------------------ | -------------- | -------------------------------------- |
| GET    | `/arquivos`        | JWT            | Lista arquivos do usuário autenticado  |
| POST   | `/arquivos/upload` | JWT + MEDICO   | Upload de arquivo para um paciente     |

### Vínculo Médico-Paciente (`/medico-paciente`)

| Método | Rota                              | Guard        | Descrição                        |
| ------ | --------------------------------- | ------------ | -------------------------------- |
| POST   | `/medico-paciente/vincular`       | JWT + MEDICO | Cria vínculo médico → paciente   |
| DELETE | `/medico-paciente/desvincular`    | JWT + MEDICO | Remove vínculo                   |
| GET    | `/medico-paciente/meus-pacientes` | JWT + MEDICO | Lista pacientes do médico        |
| GET    | `/medico-paciente/meus-medicos`   | JWT + PACIENTE| Lista médicos do paciente       |

---

## Guards e Autenticação

O NestJS usa dois guards em cadeia para proteger as rotas:

**1. `JwtAuthGuard`** — verifica se o token JWT é válido e injeta o usuário no request.

**2. `RolesGuard`** — verifica se o tipo do usuário (`PACIENTE` ou `MEDICO`) tem permissão para aquela rota, usando o decorator `@Roles()`.

```typescript
@Get('medico/area')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.MEDICO)
medicoArea(@Request() req) {
  return req.user;
}
```

O tipo do usuário é incluído no payload do JWT no momento do login e não precisa de consulta extra ao banco em cada requisição.

---

## Fluxo de Requisição

```
HTTP Request
  → ValidationPipe (valida DTO automaticamente)
  → JwtAuthGuard (verifica token)
  → RolesGuard (verifica tipo do usuário)
  → Controller (delega ao Service)
  → Service (regras de negócio)
  → TypeORM Repository (persiste/consulta)
  → HTTP Response
```

---

## Configuração Principal (`main.ts`)

```typescript
app.enableCors({ origin: process.env.FRONTEND_URL });
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
await app.listen(3001);
```

- `whitelist: true` remove campos não declarados no DTO, prevenindo injeção de campos extras.
- CORS configurado via variável de ambiente para aceitar apenas o frontend em produção.
