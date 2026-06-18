# Issue #32 - Endpoint de listagem de arquivos

**Tipo:** Backend

**Status:** Em andamento

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #29

---

## Descrição

Como paciente ou médico, quero listar arquivos para visualizar documentos vinculados a mim.

## Tarefas

- [ ] Criar endpoint `GET /api/arquivos` protegido por JWT
- [ ] Paciente recebe apenas arquivos onde consta como `pacienteId`
- [ ] Médico recebe apenas arquivos de pacientes vinculados via MedicoPaciente
- [ ] Retornar apenas metadados, nunca o `caminhoStorage`

## Critérios de Aceitação

- Paciente autenticado recebe apenas arquivos vinculados a ele.
- Médico autenticado recebe apenas arquivos de pacientes vinculados.
- Campo `caminhoStorage` nunca aparece na resposta.

## Critérios de Teste

- Jest unitário: filtragem por vínculo paciente-médico.
- Supertest: paciente recebe apenas arquivos próprios; médico recebe apenas arquivos de vinculados.
