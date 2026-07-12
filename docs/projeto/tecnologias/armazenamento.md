# Armazenamento de Arquivos

## Driver dual (local ou GCS)

O backend usa um `StorageService` com dois drivers, selecionados pela variável `STORAGE_DRIVER`:

| Ambiente        | `STORAGE_DRIVER` | Onde os arquivos ficam                        |
| --------------- | ---------------- | --------------------------------------------- |
| Desenvolvimento | `local`          | Filesystem do container em `LOCAL_STORAGE_DIR` (`uploads` por padrão) |
| Produção        | `gcs`            | Google Cloud Storage no bucket `GCS_BUCKET_NAME`                     |

O banco armazena apenas metadados (`nomeOriginal`, `nomeUnico`, `tipo`, `tamanho`, `caminhoStorage`). O binário nunca fica junto do metadado. `caminhoStorage` é sensível e **nunca** é serializado na API (o `ArquivoResponseDto` remove o campo).

## Google Cloud Storage

**O que é**

Serviço de armazenamento de objetos do Google Cloud. Guarda arquivos de qualquer tamanho com alta durabilidade e disponibilidade, com controle de acesso via IAM.

**Como funciona no projeto**

- Bucket privado. Nenhum acesso público.
- Backend acessa via `@google-cloud/storage` usando credenciais da service account do Cloud Run.
- Downloads sensíveis usam **Signed URLs** com expiração curta (`GET /arquivos/:id/download`), evitando expor o objeto diretamente.
- Uma rota alternativa (`GET /arquivos/:id/raw`) faz stream do binário via backend quando visualização inline é necessária.

**Biblioteca**: `@google-cloud/storage`.

## Driver local (desenvolvimento)

- Grava arquivos em `LOCAL_STORAGE_DIR` no container do backend.
- Volume `uploads_data` do Docker Compose persiste os dados entre reinícios (`docker compose down -v` limpa tudo).
- Não usar em produção. Cloud Run não tem disco persistente, e o filesystem some a cada reinício.

## Referências

- [Cloud Storage, documentação](https://cloud.google.com/storage/docs)
- [Signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls)
- [`@google-cloud/storage` no npm](https://www.npmjs.com/package/@google-cloud/storage)
