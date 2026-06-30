# Semana 11

> **Status:** Concluída  
> **Período:** 16/06/2026 - 22/06/2026  
> **Semana do ciclo:** 11 / 14  
> **Fase atual:** Fase 2 - Desenvolvimento  
> **Responsável pelo preenchimento:** Diogo

---

## Objetivo da Semana

Concluir o ciclo de gerenciamento de arquivos: endpoint de upload, endpoint de listagem,
tela de listagem no frontend e iniciar a tela de upload. Iniciar planejamento da camada
de auditoria.

---

## Entregas Realizadas

### Backend

- Endpoint `POST /arquivos/upload` implementado com validação de formato, tamanho e vínculo
  médico-paciente. Integração com `StorageService` para envio ao GCS (#28).
- Endpoint `GET /arquivos` com isolamento por tipo de usuário: paciente vê apenas arquivos
  próprios, médico vê apenas arquivos de pacientes vinculados (#32).
- Driver local de armazenamento adicionado para desenvolvimento sem GCS.
- Ajuste no redirect de auth: dashboard removido, redirecionamento conforme `tipo` do JWT.

**Commits relacionados:**

| Hash      | Data  | Autor     | Descrição                                                                       |
| :-------- | :---- | :-------- | :------------------------------------------------------------------------------ |
| [`e06a2ee`](https://github.com/Diogo-Olivv/HealthTech/commit/e06a2ee) | 16/06 | martinnho | feat(arquivos): implementa endpoint POST /arquivos/upload (#28)                 |
| [`874fabd`](https://github.com/Diogo-Olivv/HealthTech/commit/874fabd) | 16/06 | martinnho | test(arquivos): adiciona testes E2E do endpoint de upload (#28)                 |
| [`e566471`](https://github.com/Diogo-Olivv/HealthTech/commit/e566471) | 16/06 | martinnho | test(arquivos): adiciona testes unitários do service e controller               |
| [`b26f4de`](https://github.com/Diogo-Olivv/HealthTech/commit/b26f4de) | 16/06 | Hugo Rosa | (feat) Endpoint GET /arquivos com guards                                        |
| [`2ece66b`](https://github.com/Diogo-Olivv/HealthTech/commit/2ece66b) | 16/06 | Hugo Rosa | (feat) Adicionado testes automatizados                                          |
| [`4eb7153`](https://github.com/Diogo-Olivv/HealthTech/commit/4eb7153) | 16/06 | Hugo Rosa | (feat) DTO estrito de saída                                                     |
| [`0efa708`](https://github.com/Diogo-Olivv/HealthTech/commit/0efa708) | 17/06 | martinnho | fix(arquivos): corrige retorno do serviço e ajusta configuração de testes       |
| [`3281131`](https://github.com/Diogo-Olivv/HealthTech/commit/3281131) | 17/06 | Diogo     | feat(storage): adiciona driver local para upload de arquivos em desenvolvimento |
| [`b613929`](https://github.com/Diogo-Olivv/HealthTech/commit/b613929) | 17/06 | Diogo     | refactor(auth): remove página de dashboard e redireciona login conforme tipo    |
| [`cc7bd5b`](https://github.com/Diogo-Olivv/HealthTech/commit/cc7bd5b) | 17/06 | Diogo     | fix(arquivos): resolve erros de sintaxe que impediam build do backend           |
| [`616455c`](https://github.com/Diogo-Olivv/HealthTech/commit/616455c) | 17/06 | Diogo     | chore: adiciona caso de teste manual de arquivos                                |

**Branch:** `feat/upload-arquivos`, `feat/listagem-arquivos`
**Issue(s):** #28, #32
**PRs:** #47 (listagem-arquivos), #48 (upload-arquivos)

---

### Frontend

- Telas de listagem de arquivos criadas para paciente (`/paciente/arquivos`) e médico
  (`/medico/arquivos`). Exibe nome, tipo, data de upload e médico responsável (#33).
- Componentes compartilhados extraídos (ícones, layout de listagem).
- Atualização de estilos: cores alinhadas ao `globals.css`, logo adicionada nas páginas,
  layout responsivo no login e registro.

**Commits relacionados:**

| Hash      | Data  | Autor          | Descrição                                                        |
| :-------- | :---- | :------------- | :--------------------------------------------------------------- |
| [`51c4e09`](https://github.com/Diogo-Olivv/HealthTech/commit/51c4e09) | 15/06 | Gabriel Robson | feat(arquivos): criar páginas de listagem para médico e paciente |
| [`d5d4751`](https://github.com/Diogo-Olivv/HealthTech/commit/d5d4751) | 16/06 | Gabriel Robson | Refatora página de arquivos do médico conforme feedback do PR    |
| [`c053065`](https://github.com/Diogo-Olivv/HealthTech/commit/c053065) | 16/06 | lucaspaulaleal | refactor(globals.css): atualiza cores da identidade visual       |
| [`f8b8cb5`](https://github.com/Diogo-Olivv/HealthTech/commit/f8b8cb5) | 16/06 | lucaspaulaleal | refactor(styles): atualiza cores e coloca logo nas páginas       |
| [`62e104b`](https://github.com/Diogo-Olivv/HealthTech/commit/62e104b) | 16/06 | lucaspaulaleal | refactor(public): troca das logos e favicon                      |
| [`9ccb68d`](https://github.com/Diogo-Olivv/HealthTech/commit/9ccb68d) | 17/06 | lucaspaulaleal | feat(layout): adiciona layout no login e registro                |
| [`3ed786e`](https://github.com/Diogo-Olivv/HealthTech/commit/3ed786e) | 17/06 | lucaspaulaleal | refactor(register): atualiza estilos e melhora responsividade    |
| [`b9c9aac`](https://github.com/Diogo-Olivv/HealthTech/commit/b9c9aac) | 17/06 | Diogo          | refactor(frontend): extrai componentes e ícones compartilhados   |
| [`06ae755`](https://github.com/Diogo-Olivv/HealthTech/commit/06ae755) | 17/06 | Diogo          | refactor(arquivos): alinha contrato entre frontend e backend     |

**Branch:** `feat/Tela-de-listagem-de-arquivos`
**Issue(s):** #33
**PRs:** #49 (Tela-de-listagem-de-arquivos)

---

### Documentação

- Planejamento completo da camada de auditoria (`docs/auditoria/`)
- Issues #34-#44 documentadas com dependências e critérios de teste
- Histórias de usuário da auditoria documentadas
- Ata de reunião 17/06

**Branch:** `docs`
**Issue(s):** -

---

## Participação por Integrante

| Integrante | Commits | Issues principais                   | Status       |
| :--------- | :-----: | :---------------------------------- | :----------- |
| Diogo      |    6    | #28, #32, #33 (integrações e fixes) | Concluída    |
| Hugo       |    5    | #32 (GET /arquivos)                 | Concluída    |
| Martin     |    5    | #28 (POST /upload + testes)         | Concluída    |
| Lucas      |    5    | #33 (estilos e layout)              | Concluída    |
| Luíza      |    -    | -                                   | -            |
| Gabriel    |    2    | #33 (telas de listagem)             | Concluída    |

---

## Bloqueios e Riscos

| Bloqueio / Risco                         | Impacto                                    | Responsável           | Prazo     |
| :--------------------------------------- | :----------------------------------------- | :-------------------- | :-------- |
| Tela de upload (#30) ainda não concluída | Médio - bloqueia fluxo completo de arquivo | Luíza, Lucas, Gabriel | 22/06     |
| Auditoria (#34-#44) não iniciada         | Alto - requisito obrigatório da Fase 2     | Hugo                  | Semana 12 |

---

## Pendências para a Próxima Semana

> Semana 12 / 14 - Foco: concluir gerenciamento de arquivos e iniciar auditoria.

| Tarefa                                | Responsável           | Issue | Prioridade |
| :------------------------------------ | :-------------------- | :---- | :--------- |
| Tela de upload de arquivos (frontend) | Luíza, Lucas, Gabriel | #30   | Alta       |
| Criar entidade AuditLog               | A definir             | #34   | Alta       |
| Implementar AuditLogService           | A definir             | #35   | Alta       |
| Criar UserType ADMIN                  | A definir             | #40   | Alta       |
| Download e exclusão de arquivos       | A definir             | -     | Média      |

---

_Documento preenchido por: Diogo_
