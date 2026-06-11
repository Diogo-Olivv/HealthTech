# Cloud SQL — Health Tech AI Lab

## Instância
- **Nome:** health-tech-db
- **Engine:** PostgreSQL 15
- **Região:** southamerica-east1
- **Tier:** db-f1-micro
- **SSL:** obrigatório

## Banco de dados
- **Nome:** health_tech

## Usuário da aplicação
- **Usuário:** app_user
- **Senha:** armazenada no Secret Manager (DB_PASSWORD)

## Conexão
- String de conexão armazenada no Secret Manager (DB_CONNECTION_STRING)
- Conexão local via Cloud SQL Auth Proxy na porta 5432

## Backup
- Automático diário às 02:00
- Retenção de 7 dias