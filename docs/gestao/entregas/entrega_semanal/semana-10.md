# Semana 10

> **Status:** Concluída  
> **Período:** 09/06/2026 - 15/06/2026  
> **Semana do ciclo:** 10 / 14  
> **Fase atual:** Fase 2 - Desenvolvimento  
> **Responsável pelo preenchimento:** Diogo

---

## Objetivo da Semana

Implementar a camada de gerenciamento de arquivos: entidade, integração com GCS, vínculo médico-paciente. Finalizar identidade visual do frontend e integrar frontend com o backend de usuários.

---

## Entregas Realizadas

### Backend

- Tipo de usuário identificado no login e incluído no payload JWT; guards de rota por tipo implementados e testados via Supertest (#19).
- Entidade `Arquivo` criada com TypeORM, sincronizada com o banco, DTO de resposta seguro (omite `caminhoStorage`) e testes de segurança (#26).
- `StorageService`: geração de nome único (UUID), integração com GCS (#27).
- Módulo `MedicoPaciente` completo: entity, DTO, controller, service com os 4 endpoints de vínculo e testes unitários (#29).
- Correções de configuração: remoção do prefixo global `/api`, ajustes no `cloudbuild.yaml`, URLs de frontend e backend.

**Commits relacionados:**

| Hash      | Data  | Autor          | Descrição                                                                       |
| :-------- | :---- | :------------- | :------------------------------------------------------------------------------ |
| [`29b275f`](https://github.com/Diogo-Olivv/HealthTech/commit/29b275f) | 09/06 | Luiza Carvalho | feat(auth): identificar tipo de usuário no login                                |
| [`9c6a4b1`](https://github.com/Diogo-Olivv/HealthTech/commit/9c6a4b1) | 09/06 | Luiza Carvalho | feat(auth): adiciona teste de integração (Supertest)                            |
| [`88aba8b`](https://github.com/Diogo-Olivv/HealthTech/commit/88aba8b) | 12/06 | martinnho      | feat(arquivos): cria entidade Arquivo e sincroniza com TypeORM                  |
| [`ff24d39`](https://github.com/Diogo-Olivv/HealthTech/commit/ff24d39) | 12/06 | martinnho      | feat(arquivos): cria estrutura do modulo e DTO de resposta segura               |
| [`6b75ea8`](https://github.com/Diogo-Olivv/HealthTech/commit/6b75ea8) | 12/06 | martinnho      | test(arquivos): adiciona testes de segurança para omissão de dados sensíveis    |
| [`f78ae73`](https://github.com/Diogo-Olivv/HealthTech/commit/f78ae73) | 11/06 | Hugo Rosa      | (feat) Entity MedicoPaciente adicionada                                         |
| [`d78d19b`](https://github.com/Diogo-Olivv/HealthTech/commit/d78d19b) | 11/06 | Hugo Rosa      | (feat) Dto Vincular Medico Paciente Adicionado                                  |
| [`ea10a20`](https://github.com/Diogo-Olivv/HealthTech/commit/ea10a20) | 11/06 | Hugo Rosa      | (feat) Controller Medico Paciente Adicionado                                    |
| [`e9d286f`](https://github.com/Diogo-Olivv/HealthTech/commit/e9d286f) | 11/06 | Hugo Rosa      | (feat) Modulo Medico Paciente Adicionado                                        |
| [`3f010f3`](https://github.com/Diogo-Olivv/HealthTech/commit/3f010f3) | 11/06 | Hugo Rosa      | (feat) Serviço Medico Paciente Adicionado                                       |
| [`b9e3ca8`](https://github.com/Diogo-Olivv/HealthTech/commit/b9e3ca8) | 11/06 | Hugo Rosa      | (feat) App.module.ts alterado                                                   |
| [`f10c5f1`](https://github.com/Diogo-Olivv/HealthTech/commit/f10c5f1) | 13/06 | Hugo Rosa      | (feat) Geração de nome único implementada                                       |
| [`1b44a72`](https://github.com/Diogo-Olivv/HealthTech/commit/1b44a72) | 13/06 | Hugo Rosa      | (feat) Testes implementados                                                     |
| [`8495752`](https://github.com/Diogo-Olivv/HealthTech/commit/8495752) | 11/06 | martinnho      | fix(medico-paciente): corrige nomenclatura de arquivos e DTO                    |
| [`9d335d0`](https://github.com/Diogo-Olivv/HealthTech/commit/9d335d0) | 11/06 | martinnho      | test(medico-paciente): adiciona testes unitários do MedicoPacienteService       |
| [`ffd9caa`](https://github.com/Diogo-Olivv/HealthTech/commit/ffd9caa) | 10/06 | Diogo          | refactor(dto + api): Mudança das estruturas dos DTOs e remoção do prefixo 'api' |
| [`95f86f2`](https://github.com/Diogo-Olivv/HealthTech/commit/95f86f2) | 10/06 | Diogo          | refactor: Alinhamento do backend da lógica de cadastro e login                  |
| [`897c2b4`](https://github.com/Diogo-Olivv/HealthTech/commit/897c2b4) | 10/06 | Diogo          | feat: Adiciona validação de CPF no frontend e backend                           |
| [`cc83445`](https://github.com/Diogo-Olivv/HealthTech/commit/cc83445) | 11/06 | Diogo          | fix: Rota '/api' removido do cloudbuild.yaml                                    |
| [`88899b6`](https://github.com/Diogo-Olivv/HealthTech/commit/88899b6) | 11/06 | Diogo          | fix: Remove pasta user-data                                                     |
| [`4b49f7a`](https://github.com/Diogo-Olivv/HealthTech/commit/4b49f7a) | 11/06 | Diogo          | fix: Cloud_Logging yaml                                                         |
| [`be2a5a8`](https://github.com/Diogo-Olivv/HealthTech/commit/be2a5a8) | 11/06 | Diogo          | fix: Ajuste de rota no main.ts                                                  |
| [`8c6cf1c`](https://github.com/Diogo-Olivv/HealthTech/commit/8c6cf1c) | 12/06 | Diogo          | fix: add AppController e AppService ao AppModule                                |
| [`e49635d`](https://github.com/Diogo-Olivv/HealthTech/commit/e49635d) | 12/06 | Diogo          | fix: Ajusta Backend URL + Frontends URLs                                        |
| [`0e26499`](https://github.com/Diogo-Olivv/HealthTech/commit/0e26499) | 15/06 | Diogo          | refactor: Ajusta storage.service devido a erros                                 |

**Branch:** `feat/medico-paciente`, `feat/arquivo-migration`, `feat/integracao-banco`
**PRs:** #40 (feat/medico-paciente), #42 (feat/arquivo-migration), #45 (feat/integracao-banco)
**Issue(s):** #19, #26, #27, #29

---

### Frontend

- Refatoração visual completa das páginas de cadastro e login: paleta de cores, logos, favicon, fonte Inter, layout responsivo (#18).
- Formulário de cadastro atualizado: radio buttons para seleção de tipo, campos de CPF e data de nascimento.
- Redirecionamento na logo da home e melhoria na navegação.

**Commits relacionados:**

| Hash      | Data  | Autor          | Descrição                                                                         |
| :-------- | :---- | :------------- | :-------------------------------------------------------------------------------- |
| [`abca7b5`](https://github.com/Diogo-Olivv/HealthTech/commit/abca7b5) | 09/06 | lucaspaulaleal | feat(app): adiciona favicon                                                       |
| [`3d2afc5`](https://github.com/Diogo-Olivv/HealthTech/commit/3d2afc5) | 09/06 | lucaspaulaleal | feat(public): adiciona logos vetorizadas                                          |
| [`d2ce828`](https://github.com/Diogo-Olivv/HealthTech/commit/d2ce828) | 09/06 | lucaspaulaleal | feat: apaga duplicata de global.css e adiciona import fonte Inter                 |
| [`533d3a7`](https://github.com/Diogo-Olivv/HealthTech/commit/533d3a7) | 10/06 | lucaspaulaleal | refactor(globals.css): estilização global e refatorar páginas de login e registro |
| [`5cafd83`](https://github.com/Diogo-Olivv/HealthTech/commit/5cafd83) | 10/06 | lucaspaulaleal | refactor(globals.css): atualiza a paleta de cores                                 |
| [`2329690`](https://github.com/Diogo-Olivv/HealthTech/commit/2329690) | 10/06 | lucaspaulaleal | refactor(globals.css): move globals.css para pasta correta                        |
| [`825170c`](https://github.com/Diogo-Olivv/HealthTech/commit/825170c) | 10/06 | lucaspaulaleal | refactor(login): atualiza styles e melhora layout                                 |
| [`c54bfc9`](https://github.com/Diogo-Olivv/HealthTech/commit/c54bfc9) | 10/06 | lucaspaulaleal | refactor(register): atualiza styles da página de registro                         |
| [`d34e964`](https://github.com/Diogo-Olivv/HealthTech/commit/d34e964) | 10/06 | lucaspaulaleal | refactor(login, register): redireciona na logo e ajusta navegação da home         |
| [`0263546`](https://github.com/Diogo-Olivv/HealthTech/commit/0263546) | 10/06 | lucaspaulaleal | refactor(register): adiciona botões para selecionar tipo de usuário               |
| [`0fcbdc3`](https://github.com/Diogo-Olivv/HealthTech/commit/0fcbdc3) | 10/06 | lucaspaulaleal | refactor(globals.css): atualiza background-color e colore mensagem de erro        |
| [`eb79e45`](https://github.com/Diogo-Olivv/HealthTech/commit/eb79e45) | 10/06 | lucaspaulaleal | refactor(register): implementa radio buttons e adiciona campos de cpf/nascimento  |
| [`bdba945`](https://github.com/Diogo-Olivv/HealthTech/commit/bdba945) | 10/06 | lucaspaulaleal | refactor(register): centraliza input radio de escolha de usuário                  |
| [`62e104b`](https://github.com/Diogo-Olivv/HealthTech/commit/62e104b) | 16/06 | lucaspaulaleal | refactor(public): troca das logos e favicon                                       |

**Branch:** `feat/page_login_cadastro`
**PRs:** #34 (feat/page_login_cadastro)
**Issue(s):** #18

---

### Documentação

- Ata de reunião 10/06.
- Diagrama de classes atualizado com entidades `Arquivo` e `MedicoPaciente`.

---

## Participação por Integrante

| Integrante | Commits | Issues principais            | Status    |
| :--------- | :-----: | :--------------------------- | :-------- |
| Diogo      |    9    | Integrações, fixes de config | Concluída |
| Hugo       |    8    | #27, #29                     | Concluída |
| Martin     |    5    | #26, #29 (testes)            | Concluída |
| Luíza      |    2    | #19                          | Concluída |
| Lucas      |   13    | #18                          | Concluída |
| Gabriel    |    -    | -                            | -         |

---

## Bloqueios e Riscos

| Bloqueio / Risco                                          | Impacto                             | Responsável  | Prazo     |
| :-------------------------------------------------------- | :---------------------------------- | :----------- | :-------- |
| Endpoint de upload (#28) ainda não iniciado               | Bloqueia tela de upload no frontend | Hugo, Martin | Semana 11 |
| Endpoint de listagem de arquivos (#32) ainda não iniciado | Bloqueia tela de listagem           | Hugo         | Semana 11 |

---

## Pendências para a Próxima Semana

> Semana 11 / 14 — Foco: endpoint de upload, endpoint de listagem e telas correspondentes no frontend.

| Tarefa                                         | Responsável           | Issue | Prioridade |
| :--------------------------------------------- | :-------------------- | :---- | :--------- |
| Endpoint POST /arquivos/upload                 | Hugo, Martin          | #28   | Alta       |
| Endpoint GET /arquivos com isolamento por tipo | Hugo                  | #32   | Alta       |
| Tela de listagem de arquivos (frontend)        | Gabriel, Lucas, Luíza | #33   | Alta       |
| Tela de upload de arquivos (frontend)          | Gabriel, Lucas, Luíza | #30   | Alta       |

---

_Documento preenchido por: Diogo_
