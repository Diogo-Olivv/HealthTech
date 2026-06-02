# Armazenamento de Arquivos

## Google Cloud Storage

**O que é:**
Cloud Storage é o serviço de armazenamento de objetos do Google Cloud. Permite guardar arquivos de qualquer tamanho (imagens, PDFs, exames) com alta durabilidade e disponibilidade.

**Como funcionará no projeto:**
Arquivos enviados pelos usuários (exames, documentos médicos) serão armazenados no GCS. O banco de dados armazenará apenas os **metadados** (nome, caminho, tipo, tamanho) não o arquivo em si.

**Biblioteca:** `@google-cloud/storage`

---

## Referências

- [Cloud Storage - Documentação](https://cloud.google.com/storage/docs)
