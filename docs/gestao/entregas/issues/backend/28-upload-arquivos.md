# Issue #28 - Endpoint de upload de arquivos

**Tipo:** Backend

**Status:** Em andamento

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #26, #27

---

## Descrição

Como médico, quero enviar arquivos médicos vinculados a um paciente para disponibilizá-los na plataforma.

## Tarefas

- [ ] Criar endpoint `POST /api/arquivos/upload` protegido por JWT
- [ ] Aceitar `multipart/form-data` com campos: arquivo e pacienteId
- [ ] Validar que apenas MEDICO realiza upload
- [ ] Validar que o médico está vinculado ao paciente informado
- [ ] Validar formato (pdf, jpg, jpeg, png) e tamanho (max 10 MB)
- [ ] Enviar arquivo ao GCS via `StorageService`
- [ ] Persistir metadados na tabela `Arquivo`
- [ ] Retornar dados sem expor `caminhoStorage`

## Critérios de Aceitação

- Formatos aceitos: pdf, jpg, jpeg, png. Tamanho máximo: 10 MB.
- Médico não vinculado ao paciente recebe `403`.
- Resposta contém: id, nomeOriginal, tipo, tamanho, dataUpload, pacienteId.

## Critérios de Teste

- Jest unitário: rejeição de formato inválido e de tamanho acima do limite.
- Supertest: upload por médico vinculado, bloqueio por paciente, bloqueio por médico não vinculado.
