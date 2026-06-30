# Semana 07

> **Status:** Concluída  
> **Período:** 19/05/2026 - 25/05/2026  
> **Semana do ciclo:** 07 / 14  
> **Fase atual:** Fase 1 - Arquitetura & Setup  
> **Responsável pelo preenchimento:** Diogo

---

## Objetivo da Semana

Definir a stack, arquitetura e organização do projeto. Configurar o repositório, o ambiente de desenvolvimento local e estabelecer os padrões de trabalho do time.

---

## Entregas Realizadas

### Infraestrutura & Setup

- Criação do repositório no GitHub com estrutura monorepo (`backend/`, `frontend/`).
- Configuração do ambiente de desenvolvimento: Docker Compose com PostgreSQL 16 e Adminer.
- Implementação temporária de cadastro de usuário para validar o ambiente end-to-end.
- Configuração de CORS, ValidationPipe e estrutura inicial do NestJS.

**Commits relacionados:**

| Hash      | Data  | Autor | Descrição                                              |
| :-------- | :---- | :---- | :----------------------------------------------------- |
| [`229c870`](https://github.com/Diogo-Olivv/HealthTech/commit/229c870) | 19/05 | Diogo | Initial commit                                         |
| [`24281eb`](https://github.com/Diogo-Olivv/HealthTech/commit/24281eb) | 25/05 | Diogo | feat: Ambiente de Desenvolvimento Inicial Configurado  |
| [`5b4f69b`](https://github.com/Diogo-Olivv/HealthTech/commit/5b4f69b) | 25/05 | Diogo | feat: Implementado Temporariamente Cadastro do Usuario |

**Branch:** `main` / `develop`

---

### Documentação

- Definição da stack tecnológica (Next.js 16, NestJS 11, PostgreSQL, GCP).
- Definição da arquitetura do sistema (monorepo, fluxo frontend → backend → banco).
- Definição do fluxo de trabalho: branches, commits convencionais, code review.
- Estrutura inicial da documentação MkDocs com Material theme.
- Padrões de Git, código e review documentados.

---

## Participação por Integrante

| Integrante | Commits | Issues principais            | Status    |
| :--------- | :-----: | :--------------------------- | :-------- |
| Diogo      |    3    | Setup repositório e ambiente | Concluída |
| Hugo       |    -    | Planejamento infra           | Concluída |
| Martin     |    -    | Planejamento backend         | Concluída |
| Luíza      |    -    | Planejamento modelagem       | Concluída |
| Lucas      |    -    | Planejamento frontend        | Concluída |
| Gabriel    |    -    | Planejamento frontend        | Concluída |

---

## Bloqueios e Riscos

Nenhum bloqueio identificado nesta semana.

---

## Pendências para a Próxima Semana

> Semana 08 / 14 — Foco: implementar cadastro de Paciente e Médico e provisionar infraestrutura no GCP.

| Tarefa                                 | Responsável   | Issue    | Prioridade |
| :------------------------------------- | :------------ | :------- | :--------- |
| Definir modelagem de Paciente e Médico | Luíza, Martin | #8       | Alta       |
| Implementar cadastro de Paciente       | Luíza, Martin | #9       | Alta       |
| Implementar cadastro de Médico         | Luíza, Martin | #10      | Alta       |
| Provisionar projeto no GCP             | Hugo          | #11, #12 | Alta       |
| Configurar banco de dados (Cloud SQL)  | Hugo          | #13      | Alta       |
| Configurar GCS e segredos              | Hugo          | #14, #15 | Alta       |

---

_Documento preenchido por: Diogo_
