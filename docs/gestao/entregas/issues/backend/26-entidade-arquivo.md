# Issue #26 - Criar entidade Arquivo e migration

**Tipo:** Backend

**Status:** Concluída

**Responsáveis:** [Luiza de Melo](https://github.com/LuizaCarvalho691), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #8

---

## Descrição

Como sistema, quero ter a entidade Arquivo persistida no banco para armazenar metadados dos documentos médicos enviados pelos médicos.

## Tarefas

- [x] Criar entidade `Arquivo` em `entities/`
- [x] Definir relacionamentos com Paciente e Médico (FKs)
- [x] Criar módulo `arquivos/` com controller, service e DTO
- [x] Configurar TypeORM para sincronizar a nova entidade

## Critérios de Aceitação

- Entidade contém: id, nomeOriginal, nomeUnico, tipo, tamanho, caminhoStorage, pacienteId, medicoUploadId, dataUpload.
- Campo `caminhoStorage` nunca exposto em respostas da API.

## Critérios de Teste

- Jest unitário: DTO de resposta omite `caminhoStorage`.
