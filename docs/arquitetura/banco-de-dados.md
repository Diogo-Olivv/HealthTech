# Banco de Dados

## Schema

O banco possui três tabelas principais gerenciadas pelo TypeORM via `synchronize: true` em desenvolvimento.

### `users`

Tabela unificada para pacientes e médicos. O campo `tipo` diferencia os perfis.

| Campo          | Tipo      | Restrição              | Descrição                       |
| -------------- | --------- | ---------------------- | ------------------------------- |
| `id`           | UUID      | PK, gerado auto        | Identificador único             |
| `nome`         | VARCHAR   | NOT NULL               | Nome completo                   |
| `email`        | VARCHAR   | UNIQUE, NOT NULL       | Email de login                  |
| `passwordHash` | VARCHAR   | NOT NULL               | Hash bcrypt da senha            |
| `tipo`         | ENUM      | NOT NULL               | `PACIENTE` ou `MEDICO`          |
| `cpf`          | VARCHAR   | UNIQUE (paciente)      | CPF — apenas pacientes          |
| `dataNascimento`| DATE     | —                      | Data de nascimento — pacientes  |
| `crm`          | VARCHAR   | UNIQUE (médico)        | CRM — apenas médicos            |
| `especialidade`| VARCHAR   | —                      | Especialidade — apenas médicos  |

### `arquivo`

Metadados dos arquivos enviados. O arquivo físico fica no Google Cloud Storage.

| Campo            | Tipo      | Restrição       | Descrição                              |
| ---------------- | --------- | --------------- | -------------------------------------- |
| `id`             | UUID      | PK              | Identificador único                    |
| `nomeOriginal`   | VARCHAR   | NOT NULL        | Nome original do arquivo               |
| `nomeUnico`      | VARCHAR   | UNIQUE, NOT NULL| UUID gerado pelo backend para o GCS    |
| `tipo`           | VARCHAR   | NOT NULL        | MIME type (application/pdf, image/...) |
| `tamanho`        | INTEGER   | NOT NULL        | Tamanho em bytes                       |
| `caminhoStorage` | VARCHAR   | NOT NULL        | Caminho interno no bucket GCS          |
| `pacienteId`     | UUID      | FK → users      | Paciente dono do arquivo               |
| `medicoUploadId` | UUID      | FK → users      | Médico que fez o upload                |
| `dataUpload`     | TIMESTAMP | NOT NULL        | Data e hora do upload                  |

> `caminhoStorage` nunca é retornado em respostas da API.

### `medico_paciente`

Tabela de junção que representa o vínculo entre médico e paciente.

| Campo       | Tipo | Restrição       | Descrição         |
| ----------- | ---- | --------------- | ----------------- |
| `medicoId`  | UUID | PK + FK → users | Médico do vínculo |
| `pacienteId`| UUID | PK + FK → users | Paciente vinculado|

A chave primária composta `(medicoId, pacienteId)` garante que um mesmo par não seja vinculado duas vezes.

---

## Relacionamentos

```
users (MEDICO) ──< medico_paciente >── users (PACIENTE)
users (MEDICO) ──< arquivo
users (PACIENTE) ──< arquivo
```

- Um médico pode ter vários pacientes vinculados.
- Um paciente pode ter vários médicos.
- Um arquivo pertence a um paciente e foi enviado por um médico.

---

## Dev vs Produção

| Aspecto         | Desenvolvimento              | Produção                        |
| --------------- | ---------------------------- | --------------------------------|
| Banco           | Docker (PostgreSQL 16)       | Google Cloud SQL (PostgreSQL 16)|
| Porta           | `5433` (mapeada do container)| Unix socket via Cloud Run       |
| Visualização    | Adminer em `localhost:8080`  | Cloud Console / psql            |
| Sync de schema  | `synchronize: true`          | `synchronize: true`             |
