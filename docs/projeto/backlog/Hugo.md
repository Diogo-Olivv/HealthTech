# Backlog de Auditoria Técnica (MVP)

### Épico 1: Auditoria de Controle de Acesso

**US 1.1: Validação de Isolamento entre Pacientes**

- **Descrição:** Como desenvolvedor, quero validar que um paciente não consegue acessar exames de outros pacientes para garantir a confidencialidade dos dados médicos.
- **Critérios de Aceitação:**
  - Tentar acessar exames de outro paciente utilizando alteração de URL ou ID.
  - O sistema deve retornar erro de autorização.
  - Nenhuma informação do exame deve ser exibida.
  - O acesso negado deve ser registrado em log.

**US 1.2: Validação de Isolamento Médico-Paciente**

- **Descrição:** Como desenvolvedor, quero validar que médicos visualizem apenas pacientes vinculados a eles para garantir a segurança dos prontuários.
- **Critérios de Aceitação:**
  - Realizar testes com médicos vinculados e não vinculados.
  - O sistema deve bloquear acessos indevidos.
  - O sistema deve registrar tentativas de acesso não autorizado.
  - Nenhum dado sensível deve ser retornado.

**US 1.3: Validação de Escalonamento de Privilégios**

- **Descrição:** Como desenvolvedor, quero validar que usuários não consigam obter permissões superiores às definidas pelo sistema.
- **Critérios de Aceitação:**
  - Testar manipulação de tokens de autenticação.
  - Testar acesso a recursos administrativos com perfis comuns.
  - O sistema deve bloquear tentativas de escalonamento.
  - O evento deve ser registrado em log.

---

### Épico 2: Auditoria de Upload e Armazenamento de Documentos

**US 2.1: Verificação de Tipos de Arquivos Permitidos**

- **Descrição:** Como desenvolvedor, quero validar os tipos de arquivos aceitos pelo sistema para evitar uploads maliciosos.
- **Critérios de Aceitação:**
  - Testar upload de PDFs, imagens e documentos válidos.
  - Testar upload de arquivos executáveis ou formatos não permitidos.
  - O sistema deve rejeitar arquivos inválidos.
  - O sistema deve informar o motivo da rejeição.

**US 2.2: Verificação de Limites de Upload**

- **Descrição:** Como desenvolvedor, quero validar o limite de tamanho dos arquivos enviados para garantir estabilidade e segurança.
- **Critérios de Aceitação:**
  - Testar arquivos abaixo do limite permitido.
  - Testar arquivos acima do limite permitido.
  - O sistema deve bloquear uploads excedentes.
  - O evento deve ser registrado em log.

**US 2.3: Verificação de Armazenamento Seguro**

- **Descrição:** Como desenvolvedor, quero validar que os documentos médicos sejam armazenados de forma segura.
- **Critérios de Aceitação:**
  - Verificar que arquivos não sejam acessíveis diretamente por URL pública.
  - Verificar uso de identificadores únicos para armazenamento.
  - Garantir controle de acesso aos arquivos armazenados.
  - Impedir exposição de caminhos internos do sistema.

---

### Épico 3: Auditoria de Logs e Rastreabilidade

**US 3.1: Validação de Logs de Visualização**

- **Descrição:** Como desenvolvedor, quero verificar se toda visualização de documento médico é registrada para garantir rastreabilidade.
- **Critérios de Aceitação:**
  - Acessar um exame como paciente.
  - Acessar um exame como médico.
  - O log deve registrar usuário, documento e data/hora.
  - O registro deve ser persistido no banco de dados.

**US 3.2: Validação de Logs de Download**

- **Descrição:** Como desenvolvedor, quero verificar se downloads de exames são registrados para atender requisitos de auditoria.
- **Critérios de Aceitação:**
  - Realizar download de documentos.
  - Verificar criação automática do log.
  - O log deve registrar usuário, documento e timestamp.
  - O registro deve permanecer disponível para consulta.

**US 3.3: Validação de Logs de Alteração**

- **Descrição:** Como desenvolvedor, quero verificar se alterações em documentos médicos são registradas corretamente.
- **Critérios de Aceitação:**
  - Modificar informações de um documento.
  - Registrar usuário responsável pela alteração.
  - Registrar data e hora da modificação.
  - Registrar informações alteradas.

**US 3.4: Validação de Integridade dos Logs**

- **Descrição:** Como desenvolvedor, quero garantir que registros de auditoria não possam ser alterados indevidamente.
- **Critérios de Aceitação:**
  - Tentar alterar registros diretamente no banco.
  - Verificar mecanismos de proteção dos logs.
  - Detectar alterações não autorizadas.
  - Preservar histórico de auditoria.

---

### Épico 4: Auditoria de APIs e Serviços


**US 4.1: Verificação de Controle de Permissões**

- **Descrição:** Como desenvolvedor, quero validar que cada perfil possua acesso apenas aos recursos autorizados.
- **Critérios de Aceitação:**
  - Testar acessos utilizando perfis de paciente e médico.
  - Verificar restrições em endpoints administrativos.
  - O sistema deve retornar erro de autorização.
  - Os acessos negados devem ser registrados.

**US 4.2: Verificação de Exposição de Dados Sensíveis**

- **Descrição:** Como desenvolvedor, quero validar que APIs não exponham informações sensíveis indevidamente.
- **Critérios de Aceitação:**
  - Inspecionar respostas de sucesso e erro.
  - Verificar ausência de senhas, hashes e tokens.
  - Garantir mascaramento de informações sensíveis.

---

### Épico 5: Auditoria de Banco de Dados e Segurança

**US 5.1: Verificação de Armazenamento de Senhas**

- **Descrição:** Como desenvolvedor, quero validar que senhas sejam armazenadas de forma segura.
- **Critérios de Aceitação:**
  - Verificar uso de hash seguro.
  - Confirmar ausência de senhas em texto puro.
  - Validar política de criptografia aplicada.
  - Garantir conformidade com boas práticas de segurança.

**US 5.2: Verificação de Criptografia de Dados Sensíveis**

- **Descrição:** Como desenvolvedor, quero validar que informações médicas estejam protegidas contra acesso indevido.
- **Critérios de Aceitação:**
  - Identificar dados sensíveis armazenados.
  - Verificar mecanismos de criptografia.
  - Garantir proteção dos dados em repouso.
  - Garantir proteção dos dados em trânsito.

**US 5.3: Verificação de Backups e Recuperação**

- **Descrição:** Como desenvolvedor, quero validar que os dados possam ser recuperados em caso de falha.
- **Critérios de Aceitação:**
  - Executar rotina de backup.
  - Simular processo de restauração.
  - Garantir integridade dos dados recuperados.
  - Registrar operações realizadas.

---
