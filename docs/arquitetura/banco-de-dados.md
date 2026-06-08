# Banco de Dados

## Entidade User

```
Tabela: users
┌──────────────┬──────────────────────┬───────────────────────────────┐
│ Coluna       │ Tipo                 │ Descrição                     │
├──────────────┼──────────────────────┼───────────────────────────────┤
│ id           │ UUID (PK)            │ Identificador único           │
│ email        │ VARCHAR (UNIQUE)     │ E-mail do usuário             │
│ passwordHash │ VARCHAR              │ Senha com bcrypt              │
│ name         │ VARCHAR              │ Nome do usuário               │
│ createdAt    │ TIMESTAMP            │ Data de criação (automático)  │
└──────────────┴──────────────────────┴───────────────────────────────┘
```

---

## Desenvolvimento: Docker

Em desenvolvimento, o banco de dados roda em um container Docker gerenciado pelo `docker-compose.yml`. Isso significa que qualquer membro do time pode rodar o projeto **sem** precisar instalar o PostgreSQL manualmente ou ter acesso ao Google Cloud.

```yaml
# docker-compose.yml
postgres:
  image: postgres:16-alpine
  ports:
    - '5433:5432'   # host:container
```

O TypeORM com `synchronize: true` cria e atualiza as tabelas automaticamente a cada vez que o backend inicia. Isso elimina a necessidade de rodar scripts SQL manualmente durante o desenvolvimento.

> **Atenção:** `synchronize: true` está **desabilitado em produção** (`NODE_ENV=production`). Em produção, mudanças no banco são feitas via migrations, isso protege os dados de alterações acidentais.

---

## Produção: Google Cloud SQL

Em produção (Cloud Run), o banco é uma instância gerenciada de PostgreSQL no **Google Cloud SQL**. A conexão não usa `host:port` como em desenvolvimento; o Google injeta automaticamente um **Unix socket** no container do Cloud Run.

```
Desenvolvimento:  localhost:5433  conecta no  container Docker
Produção:         /cloudsql/PROJECT:REGION:INSTANCE  conecta no  Cloud SQL
```

O código detecta o ambiente pela variável `INSTANCE_CONNECTION_NAME`:

```typescript
// Se INSTANCE_CONNECTION_NAME estiver preenchida: Cloud SQL (socket)
// Se estiver vazia: PostgreSQL local (TCP)
const instanceName = config.get('INSTANCE_CONNECTION_NAME');

...(instanceName
  ? { host: `/cloudsql/${instanceName}` }
  : { host: 'localhost', port: 5433 })
```

Isso garante que o **mesmo código** funciona em desenvolvimento e produção, apenas com variáveis de ambiente diferentes.

---

## Adminer: Visualizador do banco em desenvolvimento

Para inspecionar o banco durante o desenvolvimento sem instalar ferramentas externas, o `docker-compose.yml` inclui o **Adminer**, uma interface web de gerenciamento de banco de dados.

Após `docker compose up -d`, acesse `http://localhost:8080` com:

- **Sistema:** PostgreSQL
- **Servidor:** `postgres`
- **Usuário:** `postgres`
- **Senha:** `postgres`
- **Base de dados:** `healthtech`

---

## Referências

- [Documentação TypeORM - Data Source (synchronize)](https://typeorm.io/data-source-options)
- [Google Cloud SQL - Connecting from Cloud Run](https://cloud.google.com/sql/docs/postgres/connect-run)
- [Google Cloud Run - Overview](https://cloud.google.com/run/docs/overview/what-is-cloud-run)
- [Adminer - Documentação oficial](https://www.adminer.org/)
