# Google Cloud Storage — Health Tech AI Lab

## Bucket
- **Nome:** health-tech-ai-lab-docs
- **Região:** southamerica-east1
- **Acesso:** Privado (public access prevention: enforced)
- **Controle de acesso:** Uniform bucket-level access

## Estrutura de prefixos
uploads/{user_id}/{uuid}_{filename}

## Ciclo de vida
- Arquivos movidos para Nearline após 90 dias

## Conta de serviço com acesso
- health-tech-app@health-tech-ai-lab.iam.gserviceaccount.com
- Permissão: roles/storage.objectAdmin