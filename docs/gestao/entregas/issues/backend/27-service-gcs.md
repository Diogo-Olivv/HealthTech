# Issue #27 - Implementar service de integração com o Google Cloud Storage

**Tipo:** Backend

**Status:** Concluída

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #13

---

## Descrição

Como sistema, quero um service dedicado para comunicação com o GCS, isolando a lógica de upload, download e exclusão de arquivos.

## Tarefas

- [x] Instalar `@google-cloud/storage`
- [x] Implementar geração de nome único por arquivo (UUID + extensão)
- [x] Criar `StorageService` com métodos de upload, download e delete
- [x] Configurar credenciais via variáveis de ambiente

## Critérios de Aceitação

- Service expõe `upload(buffer, nomeUnico)`, `download(nomeUnico)`, `delete(nomeUnico)`.
- Nome único gerado pelo backend, nunca o nome original do usuário.
- Credenciais nunca aparecem em logs ou respostas.

## Critérios de Teste

- Jest unitário: nome único diferente para cada chamada.
- Supertest com bucket de testes: upload e download de arquivo real.
