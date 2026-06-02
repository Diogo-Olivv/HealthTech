# Banco de Dados

## PostgreSQL

**O que é:**
PostgreSQL é um sistema gerenciador de banco de dados relacional open-source, considerado um dos mais robustos e confiáveis disponíveis. Dados são organizados em tabelas com colunas tipadas, relacionamentos e restrições de integridade.

**Como funciona no projeto:**
O banco armazena as entidades do sistema (usuários, arquivos, logs de auditoria). O acesso é feito exclusivamente pelo backend via TypeORM, o frontend jamais acessa o banco diretamente.

**Por que foi escolhido:**

- Suportado nativamente pelo Google Cloud SQL
- Robusto para aplicações de saúde que exigem consistência de dados
- Recursos avançados: UUIDs nativos, JSONB, full-text search
- Amplamente usado no mercado e com grande documentação

---

## Docker (desenvolvimento local)

**O que é:**
Docker é uma plataforma de containers que permite empacotar aplicações e suas dependências em ambientes isolados e reproduzíveis.

**Como funciona no projeto:**
Em desenvolvimento, o PostgreSQL e o Adminer rodam em containers Docker definidos no `docker-compose.yml`. Qualquer membro do time executa `docker compose up -d` e tem o banco funcionando em segundos, independentemente do sistema operacional.

```yaml
services:
  postgres: # banco de dados
    image: postgres:16-alpine
    ports:
      - "5433:5432"

  adminer: # interface web para inspecionar o banco
    image: adminer
    ports:
      - "8080:8080"
```

**Por que foi escolhido:**

- Elimina o problema "funciona na minha máquina", todos rodam o mesmo ambiente
- Não exige instalação manual do PostgreSQL
- Fácil de resetar o banco durante o desenvolvimento (`docker compose down -v`)

---

## Google Cloud SQL (produção)

**O que é:**
Cloud SQL é o serviço gerenciado de banco de dados relacional do Google Cloud Platform. Ele oferece instâncias de PostgreSQL, MySQL e SQL Server com backups automáticos, alta disponibilidade e escalabilidade gerenciados pelo Google.

**Como funciona no projeto:**
Em produção, o Cloud Run se conecta ao Cloud SQL via **Unix socket**, um canal de comunicação direto e seguro dentro da infraestrutura Google, sem expor o banco à internet. A variável `INSTANCE_CONNECTION_NAME` (formato `PROJECT_ID:REGION:INSTANCE_NAME`) identifica qual instância usar.

**Por que foi escolhido:**

- Requisito do projeto (Google Cloud como plataforma de deploy)
- Gerenciamento automático de backups, patches e alta disponibilidade
- Integração nativa com Cloud Run, conexão segura sem configuração de rede complexa
- Custo reduzido para ambientes de desenvolvimento e staging

---

## Referências

### PostgreSQL

- [Documentação oficial - PostgreSQL](https://www.postgresql.org/docs/)
- [PostgreSQL no Docker Hub](https://hub.docker.com/_/postgres)

### Docker

- [Docker - Documentação oficial](https://docs.docker.com/)
- [Docker Compose - Referência](https://docs.docker.com/compose/compose-file/)
- [Adminer - Site oficial](https://www.adminer.org/)

### Google Cloud SQL

- [Cloud SQL - Documentação](https://cloud.google.com/sql/docs/postgres)
- [Cloud Run - Conectar ao Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-run)
