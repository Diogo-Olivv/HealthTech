# Secret Manager — Health Tech AI Lab

## Segredos configurados

| Nome | Descrição |
|------|-----------|
| `DB_PASSWORD` | Senha do usuário app_user no Cloud SQL |
| `DB_CONNECTION_STRING` | String completa de conexão com o banco |
| `JWT_SECRET` | Chave de assinatura dos tokens JWT |
| `GCS_BUCKET_NAME` | Nome do bucket do Cloud Storage |

## Como adicionar um novo segredo

```powershell
"VALOR_DO_SEGREDO" | Out-File -FilePath secret.txt -Encoding utf8 -NoNewline
gcloud secrets create NOME_DO_SEGREDO --data-file=secret.txt --project=health-tech-ai-lab
Remove-Item secret.txt
```

## Como rotacionar um segredo

```powershell
"NOVO_VALOR" | Out-File -FilePath secret.txt -Encoding utf8 -NoNewline
gcloud secrets versions add NOME_DO_SEGREDO --data-file=secret.txt --project=health-tech-ai-lab
Remove-Item secret.txt
```

## Conta de serviço com acesso
- health-tech-app@health-tech-ai-lab.iam.gserviceaccount.com
- Permissão: roles/secretmanager.secretAccessor