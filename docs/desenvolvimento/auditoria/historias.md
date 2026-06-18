# Histórias de Usuário - Auditoria

Histórias de usuário levantadas para a camada de auditoria do HealthTech,
baseadas nos requisitos de LGPD e HIPAA.

---

## Épico 1: Controle de Acesso

**US 1.1: Isolamento entre Pacientes**

- **Descrição:** Como desenvolvedor, quero validar que um paciente não acessa
  exames de outros pacientes para garantir a confidencialidade dos dados médicos.
- **Critérios de Aceitação:**
  - Tentativa de acesso a exame de terceiro via URL/ID é bloqueada.
  - O sistema retorna erro de autorização.
  - O acesso negado é registrado em log com `ACCESS_DENIED`.

**US 1.2: Isolamento Médico-Paciente**

- **Descrição:** Como desenvolvedor, quero validar que médicos visualizem apenas
  pacientes vinculados para garantir a segurança dos prontuários.
- **Critérios de Aceitação:**
  - Médico sem vínculo não acessa dados do paciente.
  - Tentativas bloqueadas geram `ACCESS_DENIED` no log.

**US 1.3: Prevenção de Escalonamento de Privilégios**

- **Descrição:** Como desenvolvedor, quero validar que usuários não obtenham
  permissões acima do seu perfil.
- **Critérios de Aceitação:**
  - Manipulação de JWT é rejeitada.
  - Acesso a recursos de admin com perfil comum retorna `403`.
  - Evento registrado em log.

---

## Épico 2: Rastreabilidade de Ações

**US 2.1: Log de Login**

- **Descrição:** Como administrador, quero que toda tentativa de login seja
  registrada para investigar acessos suspeitos.
- **Critérios de Aceitação:**
  - Login bem-sucedido gera `LOGIN_SUCCESS` com `userId` e `ipOrigem`.
  - Login com credenciais inválidas gera `LOGIN_FAILED` com `userId = null`.

**US 2.2: Log de Upload**

- **Descrição:** Como administrador, quero que todo upload de arquivo seja
  registrado para rastrear quem enviou dados de saúde.
- **Critérios de Aceitação:**
  - Upload com sucesso gera `FILE_UPLOAD_SUCCESS` com `recursoId = pacienteId`.
  - Upload rejeitado (sem vínculo, tipo inválido) gera `FILE_UPLOAD_FAILED`.

**US 2.3: Log de Vínculo**

- **Descrição:** Como administrador, quero que criação e remoção de vínculos
  médico-paciente sejam registradas, porque o vínculo é o que libera acesso
  a dados sensíveis.
- **Critérios de Aceitação:**
  - Vincular gera `LINK_CREATED` com `recursoId = pacienteId`.
  - Desvincular gera `LINK_REMOVED`.

---

## Épico 3: Consulta e Retenção

**US 3.1: Consulta de Logs (Admin)**

- **Descrição:** Como administrador, quero consultar logs com filtros e
  paginação para investigar incidentes sem acesso direto ao banco.
- **Critérios de Aceitação:**
  - Filtros: userId, tipoEvento, dataInicio, dataFim.
  - Paginação com limite máximo de 200 por página.
  - Acesso restrito a usuários com role `ADMIN`.

**US 3.2: Integridade dos Logs**

- **Descrição:** Como desenvolvedor, quero que registros de auditoria não
  possam ser alterados indevidamente.
- **Critérios de Aceitação:**
  - Sem endpoint de update ou delete de `AuditLog`.
  - Inserção exclusiva via `AuditLogService.registrar`.

**US 3.3: Retenção por 90 Dias**

- **Descrição:** Como administrador, quero que logs sejam mantidos por pelo
  menos 90 dias para cumprir a política de retenção da LGPD.
- **Critérios de Aceitação:**
  - Job diário arquiva ou marca logs com mais de 90 dias.
  - Job usa lock no banco para evitar execução paralela em Cloud Run.

---

## Rastreabilidade

| US | Issue relacionada | Status |
| -- | ----------------- | ------ |
| 1.1, 1.2, 1.3 | [#05 Arquivos](issues/05-auditoria-rotas-arquivos.md), [#06 Vínculo](issues/06-auditoria-rotas-vinculo.md) | Pendente |
| 2.1 | [#04 Autenticação](issues/04-auditoria-rotas-autenticacao.md) | Pendente |
| 2.2 | [#05 Arquivos](issues/05-auditoria-rotas-arquivos.md) | Pendente |
| 2.3 | [#06 Vínculo](issues/06-auditoria-rotas-vinculo.md) | Pendente |
| 3.1 | [#08 Endpoint Admin](issues/08-endpoint-consulta-logs-admin.md), [#09 Tela Admin](issues/09-tela-consulta-logs-admin.md) | Pendente |
| 3.2 | [#01 Entidade](issues/01-criar-entidade-auditlog.md), [#02 Service](issues/02-implementar-auditlog-service.md) | Pendente |
| 3.3 | [#11 Retenção](issues/11-retencao-logs-cron.md) | Pendente |
