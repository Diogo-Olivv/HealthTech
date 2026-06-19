# HealthTech

Plataforma SaaS para clínicas e profissionais de saúde independentes, onde médicos fazem upload de documentos e exames, e pacientes acessam seus arquivos com segurança através de vínculos médico-paciente controlados, desenvolvida no laboratório AILAB Makers (UnB FCTE).

---

## Documentação do Projeto

A documentação completa do projeto vive na branch **`docs`**, isolada do código-fonte principal, e é servida com [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

> A branch `docs` não contém código da aplicação. Toda documentação de arquitetura, decisões técnicas e guias de contribuição está centralizada lá.

### Link da Documentação ativa do Projeto

> Obs.: O link também se encontra na descrição do repositório do projeto

- https://diogo-olivv.github.io/HealthTech/

---

## Estado Atual do Repositório

O projeto encontra-se na **fase de desenvolvimento ativo** branch `develop` com a branch `main` sendo a última versão segura e funcional da aplicação.

| Status | Funcionalidade                                                    |
| ------ | ----------------------------------------------------------------- |
| ✅     | Infraestrutura GCP (Cloud Run · Cloud SQL · GCS · Secret Manager) |
| ✅     | Autenticação JWT com controle de papéis (Médico / Paciente)       |
| ✅     | Módulo de usuários completo com testes unitários                  |
| ✅     | Módulo de arquivos: upload e listagem com testes unitários e E2E  |
| ✅     | Vínculo médico-paciente (vincular, desvincular, listar)           |
| ✅     | Driver de storage dual: `local` (dev) e GCS (produção)            |
| ✅     | Páginas de listagem de arquivos para Médico e Paciente            |
| 🚧     | Formulário de upload de arquivos no frontend                      |
| 🚧     | Download e exclusão de arquivos                                   |
| 🚧     | Camada de auditoria                                               |

---

## Quick Start (ambiente local)

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose

### Subir tudo com um comando

```bash
# Na raiz do repositório
docker compose up --build
```

Isso constrói e sobe banco de dados, backend e frontend juntos. As tabelas são criadas automaticamente na primeira execução.

### URLs

| Serviço       | Endereço              |
| ------------- | --------------------- |
| Frontend      | http://localhost:3000 |
| Backend (API) | http://localhost:3001 |
| Adminer       | http://localhost:8080 |

**Adminer:** sistema `PostgreSQL` · servidor `postgres` · usuário `postgres` · senha `postgres` · banco `healthtech`

Para parar os containers:

```bash
docker compose down
```

Para remover também os volumes (banco e uploads locais):

```bash
docker compose down -v
```

### Desenvolvimento local sem Docker (opcional)

Se preferir rodar backend ou frontend fora do Docker para ter hot-reload:

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run start:dev

# Frontend (em outro terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

> Nesse caso suba apenas o banco: `docker compose up postgres adminer -d`

---

## Variáveis de Ambiente

### Backend (`backend/.env`)

| Variável                   | Padrão (dev)            | Descrição                             |
| -------------------------- | ----------------------- | ------------------------------------- |
| `PORT`                     | `3001`                  | Porta do servidor NestJS              |
| `NODE_ENV`                 | `development`           | Ambiente de execução                  |
| `FRONTEND_URL`             | `http://localhost:3000` | Origem permitida pelo CORS            |
| `JWT_SECRET`               | `dev-secret-change-me`  | Segredo JWT (**trocar em produção**)  |
| `JWT_EXPIRES_IN`           | `1d`                    | Tempo de expiração do token           |
| `DB_HOST`                  | `localhost`             | Host do PostgreSQL                    |
| `DB_PORT`                  | `5433`                  | Porta do PostgreSQL (Docker)          |
| `DB_USER`                  | `postgres`              | Usuário do banco                      |
| `DB_PASSWORD`              | `postgres`              | Senha do banco                        |
| `DB_NAME`                  | `healthtech`            | Nome do banco                         |
| `STORAGE_DRIVER`           | `local`                 | `local` para dev, `gcs` para produção |
| `LOCAL_STORAGE_DIR`        | `uploads`               | Diretório de uploads locais           |
| `GCS_BUCKET_NAME`          | (vazio)                 | Nome do bucket GCS (produção)         |
| `INSTANCE_CONNECTION_NAME` | (vazio)                 | Conexão Cloud SQL (produção)          |

### Frontend (`frontend/.env`)

| Variável              | Padrão (dev)            | Descrição                  |
| --------------------- | ----------------------- | -------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | URL base da API do backend |

> Os arquivos `backend/.env` e `frontend/.env` **não são versionados**. Em produção, todos os segredos são injetados via Google Secret Manager.

---

## Endpoints da API

Todas as rotas protegidas exigem o header `Authorization: Bearer <token>`.

### Usuários (`/users`)

| Método | Rota                   | Auth           | Descrição                     |
| ------ | ---------------------- | -------------- | ----------------------------- |
| `POST` | `/users/pacientes`     | Livre          | Cadastro de paciente          |
| `POST` | `/users/medicos`       | Livre          | Cadastro de médico            |
| `POST` | `/users/login`         | Livre          | Login (retorna JWT)           |
| `GET`  | `/users/me`            | JWT            | Perfil do usuário autenticado |
| `GET`  | `/users/medico/area`   | JWT + Médico   | Área restrita a médicos       |
| `GET`  | `/users/paciente/area` | JWT + Paciente | Área restrita a pacientes     |

#### Exemplo: cadastro de paciente

```bash
curl -i -X POST http://localhost:3001/users/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Ana Paciente",
    "email": "ana@email.com",
    "senha": "senha123",
    "cpf": "000.000.000-00",
    "dataNascimento": "1990-01-01"
  }'
```

#### Exemplo: login

```bash
curl -i -X POST http://localhost:3001/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ana@email.com", "senha": "senha123"}'
```

### Arquivos (`/arquivos`)

| Método | Rota               | Auth         | Descrição                                                                                          |
| ------ | ------------------ | ------------ | -------------------------------------------------------------------------------------------------- |
| `GET`  | `/arquivos`        | JWT          | Lista arquivos do usuário autenticado (médico vê todos os seus pacientes; paciente vê os próprios) |
| `POST` | `/arquivos/upload` | JWT + Médico | Upload de arquivo para um paciente (`multipart/form-data`; campos: `arquivo` + `pacienteId`)       |

**Restrições de upload:** máximo 10 MB · tipos aceitos: `PDF`, `JPEG`, `PNG`.

#### Exemplo: upload de arquivo

```bash
curl -i -X POST http://localhost:3001/arquivos/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "arquivo=@exame.pdf" \
  -F "pacienteId=<uuid-do-paciente>"
```

### Vínculos Médico-Paciente (`/medico-paciente`)

| Método   | Rota                              | Auth           | Descrição                                 |
| -------- | --------------------------------- | -------------- | ----------------------------------------- |
| `POST`   | `/medico-paciente/vincular`       | JWT + Médico   | Vincula um paciente ao médico autenticado |
| `DELETE` | `/medico-paciente/desvincular`    | JWT + Médico   | Remove o vínculo com um paciente          |
| `GET`    | `/medico-paciente/meus-pacientes` | JWT + Médico   | Lista os pacientes do médico              |
| `GET`    | `/medico-paciente/meus-medicos`   | JWT + Paciente | Lista os médicos do paciente              |

### Health Check

| Método | Rota      | Auth  | Descrição                        |
| ------ | --------- | ----- | -------------------------------- |
| `GET`  | `/health` | Livre | Verifica se o serviço está no ar |

---

## Rotas do Frontend

| Rota                 | Acesso               | Descrição                                    |
| -------------------- | -------------------- | -------------------------------------------- |
| `/`                  | Público              | Redireciona para `/login`                    |
| `/login`             | Público              | Formulário de login (médico e paciente)      |
| `/register`          | Público              | Seleção do tipo de cadastro                  |
| `/register/paciente` | Público              | Formulário de cadastro de paciente           |
| `/register/medico`   | Público              | Formulário de cadastro de médico             |
| `/medico/arquivos`   | Médico autenticado   | Dashboard de arquivos e pacientes vinculados |
| `/paciente/arquivos` | Paciente autenticado | Dashboard de arquivos do paciente            |

---

## Arquitetura

```
HealthTech/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # Guard JWT, estratégia Passport, decorator @Roles
│   │   ├── users/            # Módulo de usuários (Médico, Paciente, login)
│   │   ├── arquivos/         # Módulo de arquivos (upload, listagem)
│   │   ├── medico-paciente/  # Módulo de vínculo entre profissional e paciente
│   │   ├── storage/          # Driver de armazenamento (local | GCS)
│   │   ├── health/           # Healthcheck endpoint
│   │   ├── entities/         # Entidades TypeORM (User, Medico, Paciente, Arquivo, MedicoPaciente)
│   │   └── common/           # Validadores compartilhados (CPF)
│   └── test/                 # Testes E2E (Supertest)
├── frontend/                 # Next.js 16 App Router
│   └── src/
│       ├── app/              # Páginas e layouts (App Router)
│       ├── components/       # Componentes reutilizáveis (UI, arquivos, ícones)
│       ├── dto/              # Tipos TypeScript espelhando o backend
│       ├── services/         # Clientes HTTP (users, arquivos)
│       └── utils/            # Utilitários (validação CPF)
├── db/init/                  # Scripts SQL de inicialização do banco
├── docker-compose.yml        # PostgreSQL 16 + Adminer (dev)
└── cloudbuild.yaml           # Pipeline CI/CD no Google Cloud Build
```

### Modelo de dados (entidades principais)

| Entidade         | Descrição                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `User`           | Base com `id`, `nome`, `email`, `senha` (bcrypt), `tipo` (MEDICO/PACIENTE)                                         |
| `Medico`         | Especialização de `User` com `crm` e `especialidade`                                                               |
| `Paciente`       | Especialização de `User` com `cpf` e `dataNascimento`                                                              |
| `MedicoPaciente` | Tabela de junção do vínculo médico ↔ paciente                                                                      |
| `Arquivo`        | Documento com `nomeOriginal`, `tipo`, `tamanho`, `caminhoStorage` (oculto na API), referências a médico e paciente |

---

## Testes

### Backend

```bash
cd backend

# Testes unitários
npm test

# Testes unitários com cobertura
npm run test:cov

# Testes E2E (requer banco de dados rodando via docker compose up -d)
npm run test:e2e
```

### Frontend

```bash
cd frontend
npm test
```

---

## Deploy (GCP)

O pipeline de CI/CD usa **Google Cloud Build** (`cloudbuild.yaml`).

**Serviços provisionados:**

| Recurso              | Detalhe                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| Cloud Run (backend)  | `healthtech-backend` · região `southamerica-east1`                                   |
| Cloud Run (frontend) | `healthtech-frontend` · região `southamerica-east1`                                  |
| Cloud SQL            | `health-tech-db` · PostgreSQL                                                        |
| Cloud Storage        | Bucket para arquivos dos pacientes                                                   |
| Secret Manager       | `jwt-secret`, `db-user`, `db-password`, `db-name`, `gcs-bucket-name`, `frontend-url` |

Para acionar o deploy manualmente:

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## Stack Tecnológica

| Camada         | Tecnologias                                                          |
| -------------- | -------------------------------------------------------------------- |
| Backend        | NestJS 11 · TypeScript · TypeORM · JWT · bcrypt · Multer             |
| Frontend       | Next.js 16 · React 19 · TypeScript · CSS Modules · Tailwind CSS 4    |
| Banco de Dados | PostgreSQL 16 · Docker (dev) · Cloud SQL (produção)                  |
| Storage        | Sistema de arquivos local (dev) · Google Cloud Storage (produção)    |
| Cloud          | Cloud Run · Cloud SQL · Cloud Storage · Secret Manager · Cloud Build |
| Testes         | Jest · @nestjs/testing · Supertest (E2E) · React Testing Library     |

---

## Equipe

| Nome           | GitHub                                                   |
| -------------- | -------------------------------------------------------- |
| Diogo          | [@Diogo-Olivv](https://github.com/Diogo-Olivv)           |
| Hugo Rosa      | [@HugoRosa29](https://github.com/HugoRosa29)             |
| Martin Melo    | [@MartinQMelo](https://github.com/MartinQMelo)           |
| Luíza de Melo  | [@LuizaCarvalho691](https://github.com/LuizaCarvalho691) |
| Lucas de Paula | [@lucaspaulaleal](https://github.com/lucaspaulaleal)     |
| Gabriel Robson | [@Gabrielxcx](https://github.com/Gabrielxcx)             |

---

## Histórico de Versões

| Versão | Data       | Descrição                                                                                                            | Autor                 |
| ------ | ---------- | -------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 0.1.0  | 19/05/2026 | Setup inicial do repositório e ambiente de desenvolvimento.                                                          | Diogo                 |
| 0.2.0  | 07/06/2026 | Módulo de usuários completo (Paciente e Médico) com testes.                                                          | Martin                |
| 0.3.0  | 13/06/2026 | Módulo de arquivos (entidade, GCS, MedicoPaciente) e identidade visual.                                              | Hugo, Martin, Lucas   |
| 0.4.0  | 17/06/2026 | Endpoints de upload e listagem de arquivos com testes E2E; driver local de storage; páginas de listagem no frontend. | Martin, Hugo, Gabriel |

---

## Code of Conduct

Este projeto adota o [Código de Conduta do Contribuidor](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) (Contributor Covenant v2.1).

Nos comprometemos a tornar a participação neste projeto uma experiência livre de assédio para todos, independentemente de idade, tamanho corporal, deficiência, etnia, identidade e expressão de gênero, nível de experiência, nacionalidade, aparência pessoal, raça, religião ou identidade e orientação sexual.

**Padrões esperados:** linguagem acolhedora e inclusiva · respeito a pontos de vista diferentes · críticas construtivas · foco no que é melhor para o projeto · empatia com os demais.

**Comportamentos inaceitáveis:** linguagem ou imagens sexualizadas · trolling e ataques pessoais · assédio público ou privado · publicar informações privadas de terceiros sem permissão.

Casos de comportamento inaceitável podem ser reportados abrindo um [Security Advisory](https://github.com/Diogo-Olivv/HealthTech/security/advisories/new) privado ou entrando em contato com a equipe pelo repositório.

---

## Política de Segurança

### Versões Suportadas

| Versão | Suporte        |
| ------ | -------------- |
| 0.4.x  | ✅ Suportada   |
| < 0.4  | ❌ Sem suporte |

### Reportando Vulnerabilidades

**Não abra issues públicas para relatar vulnerabilidades de segurança.**

1. Abra um [Security Advisory](https://github.com/Diogo-Olivv/HealthTech/security/advisories/new) privado no GitHub ou envie e-mail à equipe.
2. Inclua: descrição detalhada, passos para reprodução, impacto potencial e sugestão de correção (se houver).
3. A equipe responderá em até **72 horas** e trabalhará para disponibilizar um patch.
4. Aguarde a confirmação de correção antes de divulgar publicamente.

### Práticas de Segurança

- Credenciais armazenadas exclusivamente no **Google Secret Manager**; nenhuma chave é commitada no repositório.
- Senhas armazenadas com **bcrypt** (salt rounds = 10).
- Autenticação via **JWT** com expiração configurável.
- Campo `caminhoStorage` nunca exposto nas respostas da API; serialização via DTOs dedicados.
- `ValidationPipe` com `whitelist: true` em todas as rotas.
- CORS configurado via variável de ambiente, aceitando apenas origens autorizadas em produção.

---

## Licença

Projeto acadêmico desenvolvido para fins educacionais no Laboratório de Inteligência Artificial (**AILAB Makers, UnB FCTE**). Código-fonte disponibilizado sob a [MIT License](LICENSE).
