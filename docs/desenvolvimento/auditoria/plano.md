# Plano de implementação da auditoria

## Objetivo

Registrar eventos sensíveis do sistema para atender requisitos de LGPD e HIPAA,
permitindo rastreabilidade de acessos e ações sobre dados de saúde.

A camada de auditoria atual não funciona. Este documento define o caminho para
implementá-la do zero, baseado nas rotas que existem hoje no backend.

## Fontes da verdade usadas neste plano

Como `docs/projeto/arquitetura.md`, `docs/projeto/diagrama_classes.md` e
`docs/projeto/modelagem_usuarios.md` ainda não foram escritos, o levantamento de
rotas usa as fontes reais do repositório:

- `README.md` (visão geral)
- `backend/src/app.module.ts` (módulos ativos e ligação com TypeORM)
- `backend/src/users/users.controller.ts` (rotas de autenticação e cadastro)
- `backend/src/arquivos/arquivos.controller.ts` (rotas de arquivos)
- `backend/src/medico-paciente/medico-paciente.controller.ts` (rotas de vínculo)
- `backend/src/entities/user.entity.ts` (UserType atual)

## Estratégia

1. Persistência em Postgres via TypeORM em uma entidade `AuditLog`.
2. Emissão simultânea via `Logger` do NestJS para visibilidade em Cloud Logging.
3. Captura por `AuditInterceptor` global, ativado por decorator `@Audit(tipo)`
   em cada rota. O interceptor lê o `request`, dispara `AuditLogService.registrar`
   no `tap` de sucesso e no `catchError` em caso de exceção.
4. Falha de auditoria nunca derruba a requisição. O serviço captura erro,
   loga em nível `error` e segue.

## Mapeamento de rotas para eventos

Somente rotas existentes hoje. Quando novas rotas forem implementadas
(download, delete, troca de senha), a auditoria é adicionada na mesma issue
que cria a rota.

### Autenticação e cadastro (`/users`)

| Rota | Evento sucesso | Evento falha |
|------|----------------|--------------|
| `POST /users/login` | `LOGIN_SUCCESS` | `LOGIN_FAILED` |
| `POST /users/pacientes` | `USER_REGISTERED_PACIENTE` | `USER_REGISTRATION_FAILED` |
| `POST /users/medicos` | `USER_REGISTERED_MEDICO` | `USER_REGISTRATION_FAILED` |

### Arquivos (`/arquivos`)

| Rota | Evento sucesso | Evento falha |
|------|----------------|--------------|
| `GET /arquivos` | `FILE_LIST_ACCESSED` | (sem evento de falha) |
| `POST /arquivos/upload` | `FILE_UPLOAD_SUCCESS` | `FILE_UPLOAD_FAILED` |

### Vínculo médico-paciente (`/medico-paciente`)

| Rota | Evento sucesso | Evento falha |
|------|----------------|--------------|
| `POST /medico-paciente/vincular` | `LINK_CREATED` | `LINK_FAILED` |
| `DELETE /medico-paciente/desvincular` | `LINK_REMOVED` | `LINK_FAILED` |

### Acesso negado

`ForbiddenException` lançada por `RolesGuard` ou por validação de vínculo no
`ArquivosService` gera `ACCESS_DENIED` via `catchError` no interceptor.

## Campos do log

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | Identificador do registro |
| `userId` | uuid nullable | Usuário autenticado. Nulo em falhas de login |
| `tipoEvento` | enum | Um dos eventos da tabela acima |
| `recursoId` | string nullable | Id do recurso afetado (ex: arquivoId, pacienteId) |
| `status` | enum `SUCCESS`/`FAILURE` | Resultado do evento |
| `ipOrigem` | string | Extraído de `request.ip` |
| `userAgent` | string nullable | `request.headers['user-agent']` |
| `timestamp` | timestamp | `CreateDateColumn` |

## Consulta e retenção

- Consulta exclusiva para usuários com role `ADMIN`. A role não existe hoje e
  será criada em issue separada antes do endpoint admin.
- Retenção mínima de 90 dias. Job opcional de arquivamento descrito em issue
  específica de infra.
