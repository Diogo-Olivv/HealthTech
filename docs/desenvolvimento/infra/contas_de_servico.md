# Contas de Serviço

## health-tech-app
- **Email:** health-tech-app@health-tech-ai-lab.iam.gserviceaccount.com
- **Finalidade:** Conta usada pela aplicação em runtime
- **Permissões:**
  - roles/run.invoker: invocar o Cloud Run
  - roles/cloudsql.client: conectar ao banco de dados
  - roles/storage.objectAdmin: upload/download de arquivos no GCS
  - roles/secretmanager.secretAccessor: ler segredos em produção