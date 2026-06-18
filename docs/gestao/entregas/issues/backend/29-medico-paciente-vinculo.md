# Issue #29 - Criar tabela MedicoPaciente e funcionalidade de vínculo

**Tipo:** Backend

**Status:** Concluída

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Martin Melo](https://github.com/MartinQMelo)

**Depende de:** #8, #9, #10

---

## Descrição

Como médico, quero vincular pacientes ao meu perfil para acessar e gerenciar os arquivos médicos deles na plataforma.

## Tarefas

- [x] Criar entidade `MedicoPaciente` em `entities/`
- [x] Configurar chave primária composta (`medicoId` + `pacienteId`)
- [x] Criar endpoint `POST /api/medico-paciente/vincular`
- [x] Criar endpoint `DELETE /api/medico-paciente/desvincular`
- [x] Criar endpoint `GET /api/medico-paciente/meus-pacientes`
- [x] Criar endpoint `GET /api/medico-paciente/meus-medicos`

## Critérios de Aceitação

- Apenas MEDICO cria vínculo. Vínculo duplicado retorna erro.
- Apenas o médico do vínculo pode removê-lo.
- Após desvínculo, médico perde acesso aos arquivos do paciente.
- Listagens nunca incluem campos sensíveis (passwordHash, CPF, CRM).
