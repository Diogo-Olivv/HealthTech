# Semana 09

> **Status:** Concluída  
> **Período:** 02/06/2026 - 08/06/2026  
> **Semana do ciclo:** 09 / 14  
> **Fase atual:** Fase 2 - Desenvolvimento  
> **Responsável pelo preenchimento:** Diogo

---

## Objetivo da Semana

Mergear e refinar o módulo de usuários, implementar tipo de usuário no JWT com guards de rota, iniciar as telas de cadastro no frontend e fazer o deploy inicial no Cloud Run.

---

## Entregas Realizadas

### Backend

- Implementação completa de cadastro e login de Paciente e Médico, com rotas separadas por tipo e DTOs específicos (#9, #10).
- Refatoração do módulo de usuários: separação de `CreatePacienteDto` e `CreateMedicoDto`, extração de `PublicUser`, remoção de validações duplicadas (#19).
- Testes unitários e E2E do módulo de usuários adicionados.
- Configuração do ambiente e timeout para testes E2E (Jest + Supertest).

**Commits relacionados:**

| Hash      | Data  | Autor          | Descrição                                                              |
| :-------- | :---- | :------------- | :--------------------------------------------------------------------- |
| `e7f8199` | 03/06 | martinnho      | chore(test): configurar ambiente e timeout para testes e2e             |
| `280a368` | 03/06 | martinnho      | feat(users): implementar cadastro e login de pacientes e medicos       |
| `0925283` | 04/06 | martinnho      | test(users): adicionar testes unitarios, e2e e ajustar tipagens do jest|
| `a9f0bf5` | 04/06 | martinnho      | chore: remover tsconfig.spec.json vazio                                |
| `8fc967d` | 07/06 | martinnho      | refactor(dto): reduzir CreateUserDto aos campos comuns                 |
| `a70a3c8` | 07/06 | martinnho      | refactor(dto): criar CreatePacienteDto e CreateMedicoDto com extends   |
| `7248d1b` | 07/06 | martinnho      | refactor(users): separar rotas de cadastro por tipo                    |
| `965a9ae` | 07/06 | martinnho      | refactor(users): remover validacao duplicada e dividir create no service|
| `ef18255` | 07/06 | martinnho      | refactor(users): extrair PublicUser e toPublicUser                     |
| `26c9d7c` | 07/06 | martinnho      | test(users): ajustar testes para as novas rotas e DTOs                 |

**Branch:** `feat/usuarios`
**PRs:** #31 (feat/usuarios)
**Issue(s):** #9, #10, #19

---

### Frontend

- Identidade visual inicial: componentes UI base e testes do componente `Button` (#18 parcial).
- Logos vetorizadas e favicon adicionados ao projeto.

**Commits relacionados:**

| Hash      | Data  | Autor          | Descrição                                                       |
| :-------- | :---- | :------------- | :-------------------------------------------------------------- |
| `70f4c4c` | 07/06 | Gabriel Robson | feat: identidade visual, componentes UI e testes do Button      |

**Issue(s):** #5, #6, #7 (iniciadas)

---

### Infraestrutura

- Configuração inicial do Google Cloud Run e integração com Cloud SQL (#16).
- Adição de containers para integração com Google Cloud Storage.

**Commits relacionados:**

| Hash      | Data  | Autor     | Descrição                                                  |
| :-------- | :---- | :-------- | :--------------------------------------------------------- |
| `d161209` | 08/06 | Hugo Rosa | feat(infra): adiciona containers para upload google cloud  |
| `090ef81` | 08/06 | Diogo     | Configuração Inicial do Google Cloud                       |
| `1b9a04a` | 08/06 | Diogo     | PR de configuração da infraestrutura inicial               |

**Issue(s):** #16

---

## Participação por Integrante

| Integrante | Commits | Issues principais       | Status    |
| :--------- | :-----: | :---------------------- | :-------- |
| Diogo      |    3    | #16 (infra GCP)         | Concluída |
| Hugo       |    1    | #16 (GCS containers)    | Concluída |
| Martin     |   10    | #9, #10, #19            | Concluída |
| Luíza      |    -    | #19 (continuação)       | Concluída |
| Lucas      |    -    | #5, #6, #7 (iniciadas)  | Em andamento |
| Gabriel    |    1    | #18 (componentes UI)    | Concluída |

---

## Bloqueios e Riscos

| Bloqueio / Risco                                       | Impacto                               | Responsável | Prazo     |
| :----------------------------------------------------- | :------------------------------------ | :---------- | :-------- |
| Telas de cadastro frontend (#5, #6, #7) não finalizadas | Bloqueia fluxo completo de cadastro   | Lucas       | Semana 10 |

---

## Pendências para a Próxima Semana

> Semana 10 / 14 — Foco: identidade visual, entidade Arquivo, integração GCS e vínculo médico-paciente.

| Tarefa                                          | Responsável          | Issue | Prioridade |
| :---------------------------------------------- | :------------------- | :---- | :--------- |
| Tipo de usuário no JWT e guards de rota          | Luíza                | #19   | Alta       |
| Refatoração visual das páginas de cadastro/login | Lucas, Gabriel       | #18   | Alta       |
| Entidade Arquivo e migration                     | Martin, Luíza        | #26   | Alta       |
| Service de integração com GCS                   | Hugo                 | #27   | Alta       |
| Tabela MedicoPaciente e vínculo                 | Hugo, Martin         | #29   | Alta       |

---

_Documento preenchido por: Diogo_
