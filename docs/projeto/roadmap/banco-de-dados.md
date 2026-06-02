# Banco de Dados

**Stack do projeto:** [PostgreSQL via Docker (dev) + Google Cloud SQL (prod)](../tecnologias/banco-de-dados.md)

---

## Etapa 1: SQL e modelagem relacional

- [SQLZoo](https://sqlzoo.net/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Use The Index, Luke!](https://use-the-index-luke.com/)

### Conceitos principais

- SELECT, JOIN (INNER, LEFT), WHERE, GROUP BY, HAVING
- CRUD completo (INSERT, UPDATE, DELETE)
- Normalização (1FN, 2FN, 3FN)
- Índices, chaves estrangeiras, constraints
- Transações e ACID

---

## Etapa 2: PostgreSQL específico

- [PostgreSQL: Documentação oficial](https://www.postgresql.org/docs/)

### Recursos principais

- UUIDs nativos (`uuid_generate_v4()`)
- JSONB
- Full-text search
- Timestamps com timezone

---

## Etapa 3: Docker e Docker Compose

- [Docker: Get Started](https://docs.docker.com/get-started/)
- [Docker Compose: Overview](https://docs.docker.com/compose/)
- [Fireship: Docker in 100 seconds](https://www.youtube.com/watch?v=Gjnup-PuquQ)

### Conceitos principais

- Imagens vs containers vs volumes
- `docker compose up/down/logs/ps`
- Persistência de dados (volumes)
- Networking entre containers (`postgres` vs `localhost`)

---

## Etapa 4: Google Cloud SQL (produção)

- [Cloud SQL para PostgreSQL: Visão geral](https://cloud.google.com/sql/docs/postgres)
- [Conectar Cloud Run ao Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-run)
- [Boas práticas: Cloud SQL](https://cloud.google.com/sql/docs/postgres/best-practices)
- [Google Cloud: Canal oficial no YouTube](https://www.youtube.com/@googlecloudtech)

---

## Etapa 5: Ferramentas visuais

- **Adminer** (incluso no `docker-compose.yml`)
- [DBeaver](https://dbeaver.io/) (cliente desktop completo)
- [pgAdmin](https://www.pgadmin.org/) (cliente oficial do Postgres)
