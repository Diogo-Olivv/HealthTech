# Banco de Dados

## PostgreSQL

**O que é**

Sistema gerenciador de banco de dados relacional open-source, considerado um dos mais robustos e confiáveis. Dados são organizados em tabelas com colunas tipadas, relacionamentos e restrições de integridade.

**Como funciona no projeto**

Armazena as entidades do sistema (usuários, especialidades, vínculos, arquivos, logs de auditoria). O acesso é feito exclusivamente pelo backend via TypeORM; o frontend jamais acessa o banco diretamente.

**Por que foi escolhido**

- Suportado nativamente pelo Google Cloud SQL.
- Robusto para aplicações de saúde que exigem consistência forte.
- Recursos avançados: UUIDs nativos, ENUMs, JSONB, full-text search.
- Muito usado no mercado.

---

## Docker (desenvolvimento local)

**O que é**

Plataforma de containers que permite empacotar aplicações e suas dependências em ambientes reproduzíveis.

**Como funciona no projeto**

O `docker-compose.yml` na raiz sobe PostgreSQL 16, Adminer, backend e frontend em containers. Um `docker compose up --build` derruba a barreira de setup para novos integrantes:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5433:5432"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]

  adminer:
    image: adminer
    ports: ["8080:8080"]
    depends_on:
      postgres:
        condition: service_healthy

  backend:
    build: ./backend
    ports: ["3001:3001"]
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
```

**Por que foi escolhido**

- Elimina o problema "funciona na minha máquina".
- Não exige instalação manual de PostgreSQL.
- Fácil reset: `docker compose down -v`.

---

## Google Cloud SQL (produção)

**O que é**

Serviço gerenciado de banco de dados relacional do Google Cloud. Oferece PostgreSQL, MySQL e SQL Server com backups automáticos, alta disponibilidade e patches gerenciados.

**Como funciona no projeto**

Em produção, o Cloud Run conecta ao Cloud SQL via **Unix socket** (`/cloudsql/PROJECT:REGION:INSTANCE`), sem expor o banco à internet. A variável `INSTANCE_CONNECTION_NAME` (formato `PROJECT_ID:REGION:INSTANCE_NAME`) identifica a instância.

**Por que foi escolhido**

- Requisito do projeto (deploy em Google Cloud).
- Backups, patches e HA gerenciados.
- Integração nativa com Cloud Run.

---

## Migrations

`synchronize` está desligado em todos os ambientes. Migrations versionadas em `backend/src/migrations/`. Detalhes em [Arquitetura do Banco](../../arquitetura/banco-de-dados.md) e no [ADR-0001](../../desenvolvimento/adr/0001-migrations-via-cloud-run-job.md).

---

## Referências

### PostgreSQL

- [Documentação oficial](https://www.postgresql.org/docs/)
- [PostgreSQL no Docker Hub](https://hub.docker.com/_/postgres)

### Docker

- [Documentação oficial](https://docs.docker.com/)
- [Docker Compose, referência](https://docs.docker.com/compose/compose-file/)
- [Adminer](https://www.adminer.org/)

### Google Cloud SQL

- [Cloud SQL, documentação](https://cloud.google.com/sql/docs/postgres)
- [Cloud Run com Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-run)
