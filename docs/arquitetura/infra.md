# Infraestrutura

## Visão Geral

Toda a infraestrutura de produção roda no **Google Cloud Platform (GCP)**. O projeto utiliza os seguintes serviços:

| Serviço             | Função                                          |
| ------------------- | ----------------------------------------------- |
| Cloud Run           | Hospedagem do backend (NestJS containerizado)   |
| Cloud SQL           | Banco de dados PostgreSQL gerenciado            |
| Cloud Storage (GCS) | Armazenamento dos arquivos médicos              |
| Secret Manager      | Armazenamento seguro de credenciais             |
| Cloud Build         | Pipeline de CI/CD                               |
| Cloud Logging       | Logs estruturados e auditoria                   |

---

## Cloud Run

O backend é empacotado em uma imagem Docker e implantado no Cloud Run, que gerencia escalabilidade e disponibilidade automaticamente.

- **Porta:** `3001` (definida via variável de ambiente `PORT`)
- **Conexão com banco:** via Unix socket do Cloud SQL (`/cloudsql/PROJECT:REGION:INSTANCE`)
- **Deploy:** acionado pelo `cloudbuild.yaml` a cada push na branch `main`

---

## Google Cloud Storage (GCS)

Os arquivos médicos (PDF, imagens) nunca são armazenados no servidor da aplicação. O fluxo é:

```
Médico faz upload
  → Backend gera nome único (UUID + extensão)
  → Arquivo enviado ao bucket GCS via StorageService
  → Metadados salvos na tabela arquivo (banco)
  → Resposta retorna metadados, nunca o caminho interno
```

O bucket é configurado como **privado** — nenhum acesso público. O backend acessa o GCS usando credenciais da conta de serviço injetadas via Secret Manager.

---

## Secret Manager

Nenhuma credencial é armazenada em código ou em arquivos `.env` commitados. Todos os segredos são gerenciados pelo Secret Manager e injetados como variáveis de ambiente no Cloud Run:

| Variável                  | Conteúdo                            |
| ------------------------- | ----------------------------------- |
| `DATABASE_URL`            | String de conexão com o Cloud SQL   |
| `JWT_SECRET`              | Chave de assinatura dos tokens JWT  |
| `GCS_BUCKET_NAME`         | Nome do bucket de arquivos          |
| `GCS_CREDENTIALS`         | JSON da conta de serviço do GCS     |
| `FRONTEND_URL`            | URL do frontend (CORS)              |

---

## Desenvolvimento Local

O arquivo `docker-compose.yml` na raiz do projeto sobe o banco e o Adminer localmente:

```bash
docker compose up -d      # inicia PostgreSQL na porta 5433 e Adminer na 8080
docker compose down -v    # para e apaga os dados (reset completo)
```

As variáveis de ambiente locais ficam em `backend/.env` (não commitado), seguindo o template `backend/.env.example`.

---

## Diagrama de Infraestrutura

```
Internet
  └── Cloud Run (NestJS)
        ├── Cloud SQL (PostgreSQL) — via Unix socket
        ├── Cloud Storage         — upload/download de arquivos
        ├── Secret Manager        — leitura de credenciais na inicialização
        └── Cloud Logging         — emissão de logs estruturados
```
