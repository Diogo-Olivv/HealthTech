# Infraestrutura

## Visão Geral

Toda a infraestrutura de produção roda no **Google Cloud Platform (GCP)**. O pipeline de CI/CD é o **Cloud Build**, definido em `cloudbuild.yaml` na raiz.

| Serviço             | Função                                                                       |
| ------------------- | ---------------------------------------------------------------------------- |
| Cloud Run (backend) | Serviço `healthtech-backend` na região `southamerica-east1`                  |
| Cloud Run (frontend)| Serviço `healthtech-frontend-us` na região `us-central1`                     |
| Cloud Run Job       | `healthtech-migrations`, aplica migrations antes do deploy (ver ADR-0001)    |
| Cloud SQL           | Instância `health-tech-db` (PostgreSQL 16)                                   |
| Cloud Storage (GCS) | Bucket para upload de arquivos dos pacientes                                 |
| Secret Manager      | Credenciais e configuração sensível                                          |
| Cloud Build         | Pipeline `cloudbuild.yaml` disparado a cada push relevante                   |
| Cloud Logging       | Logs estruturados e auditoria                                                |
| Artifact Registry   | Repositório `healthtech` com imagens `backend:*` e `frontend:*`              |

---

## Pipeline de CI/CD

O `cloudbuild.yaml` está dividido em etapas nomeadas com `id`, para leitura direta no Cloud Build. Resumo:

1. **Install** (paralelo): `npm ci` em backend e frontend.
2. **Lint (não bloqueante) + Testes (bloqueiam)**: `eslint --fix` reporta e segue; testes falhando abortam o build.
3. **Auth Docker**: `gcloud auth configure-docker`.
4. **Build**: constrói `backend` e `frontend` como imagens Docker.
5. **Push**: envia imagens para o Artifact Registry (`--all-tags`).
6. **Migrations**: cria ou atualiza o Cloud Run Job `healthtech-migrations` e executa com `--wait`. Se a migration falhar, o pipeline aborta antes de trocar a revisão do backend em produção.
7. **Deploy backend** no Cloud Run (`southamerica-east1`).
8. **Deploy frontend** no Cloud Run (`us-central1`).

O motivo de separar migrations num Job dedicado está descrito no [ADR-0001](../desenvolvimento/adr/0001-migrations-via-cloud-run-job.md).

---

## Cloud Run

Duas revisões independentes rodam no Cloud Run:

**Backend (`healthtech-backend`)**

- Região: `southamerica-east1`
- Porta: `3001` (via `PORT`)
- Conexão com banco: Unix socket do Cloud SQL (`/cloudsql/PROJECT:REGION:INSTANCE`) via `INSTANCE_CONNECTION_NAME`
- Service account: `healthtech-cloudrun@…`

**Frontend (`healthtech-frontend-us`)**

- Região: `us-central1` (menor latência para a demo)
- Recebe `NEXT_PUBLIC_API_URL` no build arg apontando para a URL pública do backend
- Recebe `API_INTERNAL_URL` no ambiente para o proxy `/api/proxy/[...path]`

---

## Google Cloud Storage (GCS)

Os arquivos médicos (PDF e imagens) nunca são armazenados no filesystem do container do backend em produção. Fluxo:

```
Médico faz upload
  → Backend valida (tipo MIME, tamanho até 10 MB)
  → Backend gera nome único (UUID + extensão)
  → StorageService envia ao bucket GCS
  → Metadados salvos em `arquivos`
  → Resposta retorna metadados via ArquivoResponseDto (sem `caminhoStorage`)
```

Em desenvolvimento local, o backend usa o driver `local` (`STORAGE_DRIVER=local`, `LOCAL_STORAGE_DIR=uploads`) para gravar no filesystem do container.

---

## Secret Manager

Nenhuma credencial fica no código ou em arquivos `.env` versionados. Todos os segredos são gerenciados pelo Secret Manager e injetados no Cloud Run:

| Segredo               | Uso                                                    |
| --------------------- | ------------------------------------------------------ |
| `db-user`             | Usuário do PostgreSQL                                  |
| `db-password`         | Senha                                                  |
| `db-name`             | Nome do banco                                          |
| `jwt-secret`          | Chave de assinatura dos tokens JWT                     |
| `gcs-bucket-name`     | Nome do bucket para uploads                            |
| `frontend-url`        | Origens permitidas pelo CORS                           |

O Cloud Run Job de migrations reusa `db-user`, `db-password` e `db-name`.

---

## Desenvolvimento Local

O `docker-compose.yml` na raiz sobe banco, backend e frontend de uma vez:

```bash
docker compose up --build     # sobe tudo
docker compose ps             # verifica o status
docker compose down           # para os containers
docker compose down -v        # para e apaga volumes (banco e uploads)
```

| Serviço       | URL local              |
| ------------- | ---------------------- |
| Frontend      | http://localhost:3000  |
| Backend       | http://localhost:3001  |
| Adminer       | http://localhost:8080  |

Variáveis locais ficam em `backend/.env` e `frontend/.env` (não versionados), copiados de `.env.example`.

Para hot-reload sem Docker, suba apenas o banco (`docker compose up postgres adminer -d`) e rode `npm run start:dev` no backend e `npm run dev` no frontend.

---

## Governança e segurança

- **Husky + lint-staged**: hook `pre-commit` roda ESLint apenas nos arquivos em stage. Documentado em [Git e Branches](../desenvolvimento/padroes/git.md).
- **CodeQL**: workflow `.github/workflows/codeql.yml` roda em pushes para `main`, PRs e semanalmente às segundas 06:00 UTC.
- **Dependabot**: `.github/dependabot.yml` abre PRs semanais agrupados por família (`@nestjs/*`, `next+eslint-config-next`, `react`), com bump automático apenas em minor/patch (evita quebras).

---

## Diagrama de Infraestrutura

```
Internet
  ├── Cloud Run (healthtech-frontend-us)  [us-central1]
  │     └── Proxy /api/proxy/*  →  Cloud Run backend
  │
  └── Cloud Run (healthtech-backend)      [southamerica-east1]
        ├── Cloud SQL (PostgreSQL)        via Unix socket
        ├── Cloud Storage                  upload e download de arquivos
        ├── Secret Manager                 credenciais e configuração
        └── Cloud Logging                  logs estruturados
                       ▲
                       │
                Cloud Run Job (healthtech-migrations)
                       ▲
                       │
                 Cloud Build (cloudbuild.yaml)
                       ▲
                       │
                    GitHub push
```
