# Semana 08

> **Status:** Concluída  
> **Período:** 26/05/2026 - 01/06/2026  
> **Semana do ciclo:** 08 / 14  
> **Fase atual:** Fase 2 - Desenvolvimento  
> **Responsável pelo preenchimento:** Diogo

---

## Objetivo da Semana

Implementar a base da autenticação (login funcional com rota protegida), definir a modelagem de Paciente e Médico e provisionar a infraestrutura no GCP.

---

## Entregas Realizadas

### Backend

- Login funcional com JWT: geração de token, guard de rota protegida e validação no frontend.
- Adição de `.env.example` no frontend para padronizar configuração de variáveis de ambiente.
- Definição da modelagem de Paciente e Médico (#8): decisão de tabela única com campo `tipo` (PACIENTE/MEDICO), lista de atributos e documento de decisão.
- Implementação inicial das entidades e endpoints de cadastro de Paciente (#9) e Médico (#10) — concluída e mergeada na semana seguinte.

**Commits relacionados:**

| Hash      | Data  | Autor | Descrição                                             |
| :-------- | :---- | :---- | :---------------------------------------------------- |
| `79545b0` | 31/05 | Diogo | feat: Login Funcional + Rota Protegida + Autenticação |
| `6da3cd7` | 31/05 | Diogo | fix: Adiciona .env.example no frontend                |

**Issue(s):** #8, #9, #10

---

### Infraestrutura

- Definição da arquitetura de infraestrutura MVP: Cloud Run, Cloud SQL, GCS, Secret Manager (#11).
- Provisionamento do projeto na Google Cloud Platform (#12).
- Configuração da instância de banco de dados Cloud SQL (PostgreSQL 16) (#13).
- Criação do bucket no Google Cloud Storage (#14).
- Configuração do gerenciamento de segredos via Secret Manager (#15).

> Trabalho realizado via GCP Console — sem commits de código associados nesta semana.

**Issue(s):** #11, #12, #13, #14, #15

---

### Documentação

- Ata de reunião 27/05 e 01/06.
- Documento de modelagem de usuários criado em `docs/gestao/decisoes/modelagem_usuarios.md`.

---

## Participação por Integrante

| Integrante | Commits | Issues principais       | Status    |
| :--------- | :-----: | :---------------------- | :-------- |
| Diogo      |    2    | Auth e ambiente         | Concluída |
| Hugo       |    -    | #11, #12, #13, #14, #15 | Concluída |
| Martin     |    -    | #8, #9, #10             | Concluída |
| Luíza      |    -    | #8, #9, #10             | Concluída |
| Lucas      |    -    | -                       | -         |
| Gabriel    |    -    | -                       | -         |

---

## Bloqueios e Riscos

| Bloqueio / Risco                            | Impacto                              | Responsável   | Prazo    |
| :------------------------------------------ | :----------------------------------- | :------------ | :------- |
| Cadastro de Paciente/Médico ainda sem merge | Bloqueia auth e frontend de cadastro | Martin, Luíza | Semana 9 |

---

## Pendências para a Próxima Semana

> Semana 09 / 14 — Foco: mergear cadastro, implementar tipo no JWT e iniciar telas de cadastro no frontend.

| Tarefa                                          | Responsável   | Issue   | Prioridade |
| :---------------------------------------------- | :------------ | :------ | :--------- |
| Mergear e refinar cadastro de Paciente e Médico | Martin, Luíza | #9, #10 | Alta       |
| Tipo de usuário no token JWT e guards de rota   | Luíza         | #19     | Alta       |
| Deploy inicial no Cloud Run                     | Hugo          | #16     | Alta       |
| Telas de cadastro no frontend                   | Lucas         | #5, #6  | Alta       |
| Redirecionamento por tipo de usuário            | Lucas         | #7      | Alta       |

---

_Documento preenchido por: Diogo_
