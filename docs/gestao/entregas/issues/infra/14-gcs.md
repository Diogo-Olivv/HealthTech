# Issue #14 - Configurar Google Cloud Storage para documentos médicos

**Tipo:** Infra

**Status:** Concluída

**Responsável:** [Hugo Rosa](https://github.com/HugoRosa29)

---

## Descrição

Como sistema, preciso armazenar documentos médicos de forma segura utilizando GCS para acessá-los posteriormente.

## Tarefas

- [x] Criar bucket de armazenamento
- [x] Configurar acesso privado
- [x] Configurar política de retenção
- [x] Criar conta de serviço para acesso ao bucket
- [x] Documentar estrutura de armazenamento

## Critérios de Aceitação

- Bucket criado e operacional.
- Upload e download realizados via credenciais da aplicação.
- Bucket não permite acesso público.
- Estrutura documentada.

## Critérios de Teste

- Upload de arquivo de teste.
- Download de arquivo de teste.
- Verificar que acesso anônimo é bloqueado.
