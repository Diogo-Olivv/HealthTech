# Cronograma

Este documento detalha o planejamento, as etapas de desenvolvimento e as entregas do **Ciclo 2** do Projeto Aplicado. O objetivo é construir e implantar uma aplicação web robusta na infraestrutura do Google Cloud, com foco em segurança, auditoria e disponibilidade.

- Clique [aqui](../assets/ciclo_01.pdf) para acessar o PDF do Ciclo 1 e [aqui](../assets/Fase2.pdf) para o documento da Fase 2.

## 📅 Cronograma Semanal e Entregas

| Semana  | Foco                          | Entrega Esperada                                                       |
| ------- | ----------------------------- | ---------------------------------------------------------------------- |
| **7**   | Planejamento e Arquitetura    | Documento de arquitetura, ADRs iniciais e roadmap técnico              |
| **8**   | Estrutura Inicial             | Aplicação rodando localmente com estrutura base e Docker Compose       |
| **9**   | Autenticação e Acesso         | Usuário autenticado acessando rotas protegidas (JWT + Guards)          |
| **10**  | Upload e Listagem             | Upload funcional e listagem filtrada por usuário                       |
| **11**  | Storage e Persistência        | Integração com Cloud Storage e schema versionado por migrations        |
| **12**  | Logging e Auditoria           | Camada de auditoria com interceptor global e catálogo de eventos       |
| **13**  | Deploy (Google Cloud)         | URL pública funcional no Cloud Run e vínculo médico-paciente ponta a ponta |
| **14**  | Painel Admin e Demonstração   | Painel de logs para ADMIN, revisão de docs e apresentação final        |

---

## Detalhamento das Fases

### Semana 7: Planejamento

- Formação do time (seis integrantes sem papel fixo).
- Diagrama de arquitetura, escolha do stack e inicialização do repositório.
- Primeiros ADRs.

### Semana 8: Estrutura Inicial

- Setup completo do ambiente de desenvolvimento (backend e frontend).
- Docker Compose para banco, backend e frontend, com healthcheck.
- Padronização do repositório e templates de issue/PR.

### Semana 9: Autenticação e Controle de Acesso

- Cadastro e login.
- Hashing de senhas com `bcrypt` e autenticação via JWT.
- Guards `JwtAuthGuard` e `RolesGuard`.

### Semana 10: Upload e Listagem

- Rotas de upload multipart com validação de tipo MIME e tamanho.
- Isolamento: cada arquivo pertence a um paciente e a um médico específicos.

### Semana 11: Storage e Persistência

- Integração com Google Cloud Storage (`STORAGE_DRIVER=gcs`) e driver `local` para desenvolvimento.
- Metadados sincronizados na tabela `arquivos`.
- Migrations TypeORM versionadas (`synchronize: false`).

### Semana 12: Logging e Auditoria

- `AuditInterceptor` global + decorator `@Audit`.
- Catálogo de eventos em `TipoEventoAuditoria`.
- Rotas de negócio sensíveis (login, cadastro, upload, vínculo) auditadas.

### Semana 13: Deploy em Google Cloud

- Publicação via Cloud Run (backend em `southamerica-east1`, frontend em `us-central1`).
- Cloud Run Job de migrations no pre-deploy (ver [ADR-0001](../desenvolvimento/adr/0001-migrations-via-cloud-run-job.md)).
- Fluxo completo de vínculo médico-paciente com workflow de aprovação.

### Semana 14: Painel Admin e Demonstração

- Rota `GET /audit/logs` (ADMIN) e tela de consulta.
- Seed manual do primeiro ADMIN.
- Revisão da documentação MkDocs, ADRs e ata de fechamento.
- Apresentação técnica: arquitetura, código, demo do fluxo, sistema de logs e segurança.

---

## Requisitos Funcionais da Aplicação

- Cadastro (paciente e médico)
- Login
- Upload de arquivos (com validação)
- Listagem por perfil
- Download (URL assinada) e stream inline
- Exclusão de arquivos pelo médico responsável
- Vínculo médico-paciente com workflow de aprovação
- Consulta de logs por ADMIN

## Requisitos Não Funcionais

- Segurança: hash de senha, cookies httpOnly, guards por papel, `ValidationPipe` com `forbidNonWhitelisted`.
- Isolamento por usuário (médico só vê seus pacientes vinculados; paciente só vê seus arquivos).
- Rotas protegidas por JWT + Roles.
- Logging e auditoria: eventos auditáveis e persistidos em `audit_logs`.
- Disponibilidade: implantação em Google Cloud com pipeline automatizado (Cloud Build) e migrations executadas em Job dedicado.
