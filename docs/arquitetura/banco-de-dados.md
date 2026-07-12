# Banco de Dados

## Estratégia de schema

O schema é versionado via **TypeORM migrations**. `synchronize: false` em todos os ambientes: qualquer alteração de entidade exige migration commitada no mesmo PR.

Em desenvolvimento local, o backend aplica migrations pendentes no boot (`migrationsRun: true` quando `NODE_ENV !== 'production'`).

Em produção, quem aplica é o Cloud Run Job `healthtech-migrations`, invocado pelo Cloud Build antes do deploy da nova revisão do backend. Veja o [ADR-0001](../desenvolvimento/adr/0001-migrations-via-cloud-run-job.md).

## Tabelas

O schema atual (branch `develop`) contém sete tabelas principais.

### `users`

Tabela base para todos os perfis. `tipo` diferencia os papéis.

| Campo          | Tipo      | Restrição         | Descrição                                     |
| -------------- | --------- | ----------------- | --------------------------------------------- |
| `id`           | UUID      | PK, gerado auto   | Identificador único                           |
| `email`        | VARCHAR   | UNIQUE, NOT NULL  | Email de login                                |
| `passwordHash` | VARCHAR   | NOT NULL          | Hash bcrypt (10 rounds)                       |
| `name`         | VARCHAR   | NOT NULL          | Nome completo                                 |
| `tipo`         | ENUM      | NOT NULL, default `PACIENTE` | `PACIENTE`, `MEDICO` ou `ADMIN`    |
| `createdAt`    | TIMESTAMP | NOT NULL, auto    | Criação                                       |
| `updatedAt`    | TIMESTAMP | NOT NULL, auto    | Última atualização                            |

### `pacientes`

Especialização 1:1 de `users`.

| Campo            | Tipo | Restrição         | Descrição                                      |
| ---------------- | ---- | ----------------- | ---------------------------------------------- |
| `userId`         | UUID | PK + FK → users   | Ponte com `users`                              |
| `cpf`            | VARCHAR | UNIQUE, NOT NULL | CPF                                            |
| `dataNascimento` | DATE | NOT NULL          | Data de nascimento                             |

### `medicos`

Especialização 1:1 de `users`.

| Campo                  | Tipo    | Restrição       | Descrição                                      |
| ---------------------- | ------- | --------------- | ---------------------------------------------- |
| `userId`               | UUID    | PK + FK → users | Ponte com `users`                              |
| `crm`                  | VARCHAR | UNIQUE, NOT NULL| Registro profissional                          |
| `especialidade_legado` | VARCHAR | NULL            | Coluna legada mantida por um release para permitir rollback |

Novas informações de especialidade vivem em `medico_especialidades` (N:N).

### `especialidades`

| Campo   | Tipo    | Restrição       | Descrição                       |
| ------- | ------- | --------------- | ------------------------------- |
| `id`    | UUID    | PK              | Identificador                   |
| `nome`  | VARCHAR(80) | NOT NULL    | Nome exibido                    |
| `slug`  | VARCHAR(80) | UNIQUE      | Slug para uso em URL ou filtro  |
| `ativa` | BOOLEAN | default `true`  | Se a especialidade é oferecida  |

### `medico_especialidades`

Tabela associativa gerada por `@JoinTable`.

| Campo             | Tipo | Restrição              | Descrição                     |
| ----------------- | ---- | ---------------------- | ----------------------------- |
| `medicoId`        | UUID | PK, FK → medicos.userId| Médico                        |
| `especialidadeId` | UUID | PK, FK → especialidades| Especialidade selecionada     |

### `medico_paciente`

Vínculo com workflow de aprovação (LGPD, art. 8º).

| Campo          | Tipo      | Restrição              | Descrição                                                                     |
| -------------- | --------- | ---------------------- | ----------------------------------------------------------------------------- |
| `medicoId`     | UUID      | PK + FK → medicos      | Médico do vínculo                                                             |
| `pacienteId`   | UUID      | PK + FK → pacientes    | Paciente vinculado                                                            |
| `status`       | ENUM      | NOT NULL, indexado, default `PENDENTE` | `PENDENTE`, `APROVADO`, `REJEITADO`, `REVOGADO`               |
| `solicitadoPor`| UUID      | NOT NULL               | Quem iniciou a solicitação (`medicoId`)                                       |
| `solicitadoEm` | TIMESTAMP | NOT NULL, default now()| Quando foi criada                                                             |
| `respondidoEm` | TIMESTAMP | NULL                   | Quando o paciente aprovou ou rejeitou                                         |
| `termoVersao`  | VARCHAR   | NULL                   | Versão do termo de consentimento aceito no momento da aprovação (LGPD art. 8) |
| `vinculadoEm`  | TIMESTAMP | NOT NULL, auto         | Registro de criação (CreateDateColumn)                                        |

Chave primária composta `(medicoId, pacienteId)` garante que um par não seja vinculado duas vezes.

### `arquivos`

Metadados dos arquivos. O binário fica no storage (local ou GCS).

| Campo            | Tipo      | Restrição       | Descrição                                              |
| ---------------- | --------- | --------------- | ------------------------------------------------------ |
| `id`             | UUID      | PK              | Identificador                                          |
| `nomeOriginal`   | VARCHAR   | NOT NULL        | Nome enviado pelo usuário                              |
| `nomeUnico`      | VARCHAR   | NOT NULL        | Nome interno gerado pelo backend                       |
| `tipo`           | VARCHAR   | NOT NULL        | MIME type (`application/pdf`, `image/jpeg`, `image/png`)|
| `tamanho`        | INTEGER   | NOT NULL        | Tamanho em bytes                                       |
| `descricao`      | VARCHAR(200) | NULL         | Descrição opcional                                     |
| `caminhoStorage` | VARCHAR   | NOT NULL        | Caminho interno no storage (**nunca** retornado na API)|
| `dataUpload`     | TIMESTAMP | NOT NULL, auto  | Data e hora do upload                                  |
| `pacienteId`     | UUID      | FK → pacientes  | Paciente dono do arquivo                               |
| `medicoUploadId` | UUID      | FK → medicos    | Médico que fez o upload                                |

`caminhoStorage` é serializado exclusivamente via `ArquivoResponseDto`, que omite o campo.

### `audit_logs`

Registro de eventos de auditoria.

| Campo        | Tipo      | Restrição       | Descrição                                        |
| ------------ | --------- | --------------- | ------------------------------------------------ |
| `id`         | UUID      | PK              | Identificador do log                             |
| `userId`     | UUID      | NULL            | Usuário responsável (pode ser `null` para eventos anônimos) |
| `tipoEvento` | ENUM      | NOT NULL        | Um valor de `TipoEventoAuditoria`                |
| `recursoId`  | UUID      | NULL            | ID do recurso alvo (arquivo, vínculo, usuário)   |
| `status`     | ENUM      | NOT NULL        | `SUCCESS` ou `FAILURE`                           |
| `ipOrigem`   | VARCHAR   | NOT NULL        | IP capturado no `Request`                        |
| `userAgent`  | VARCHAR   | NULL            | User agent do cliente                            |
| `timestamp`  | TIMESTAMP | NOT NULL, auto  | Momento do evento                                |

Consultado pela rota `GET /audit/logs` (ADMIN).

---

## Relacionamentos

```
users (1) ──── (0..1) pacientes
users (1) ──── (0..1) medicos

medicos (N) ──── (N) especialidades   via medico_especialidades
medicos (N) ──── (N) pacientes         via medico_paciente (com StatusVinculo)

pacientes (1) ──< arquivos
medicos   (1) ──< arquivos             (medicoUploadId)

users (1) ──< audit_logs               (userId opcional)
```

- Um médico pode ter várias especialidades e vários pacientes vinculados.
- Um paciente pode ter vários médicos vinculados, com histórico de solicitações (`PENDENTE`, `APROVADO`, `REJEITADO`, `REVOGADO`).
- Um arquivo pertence a um paciente e foi enviado por um médico.
- Um evento de auditoria pode ser anônimo (`userId = null`) para tentativas de login inválidas.

---

## Dev vs Produção

| Aspecto            | Desenvolvimento                     | Produção                                    |
| ------------------ | ----------------------------------- | ------------------------------------------- |
| Banco              | PostgreSQL 16 via Docker            | Google Cloud SQL (PostgreSQL 16)            |
| Porta              | `5433` (mapeada do container)       | Unix socket via Cloud Run                   |
| Visualização       | Adminer em `http://localhost:8080`  | Cloud Console e `psql` via Cloud SQL Proxy  |
| `synchronize`      | `false`                             | `false`                                     |
| Aplicação de migrations | Boot do backend (`migrationsRun`) | Cloud Run Job `healthtech-migrations`     |

## Migrations existentes

Migrations versionadas em `backend/src/migrations/`, ordenadas por timestamp:

- `1750550400000-InitialBaseline` (schema base)
- `1782308370000-CreateAuditLog`
- `1783000000000-RemoveLoginFalhaEnum`
- `1783200000000-AddDescricaoToArquivo`
- `1783300000000-CreateEspecialidades`
- `1783400000000-ZerarMedicos`
- `1783500000000-AddStatusVinculoMedicoPaciente`
- `1784000000000-AddAdminUserType`

Comandos úteis (dentro de `backend/`):

```bash
npm run migration:generate -- src/migrations/NomeDescritivo
npm run migration:create -- src/migrations/NomeVazio
npm run migration:run
npm run migration:revert
```
