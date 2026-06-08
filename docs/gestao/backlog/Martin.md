# 2.5.1 Backlog do Produto (MVP)

## Épico 1: Autenticação e Controle de Acesso

### US 1.1: Cadastro de Pacientes

**Descrição:** Como paciente, quero me cadastrar na plataforma informando meus dados pessoais (nome, e-mail, senha, CPF e data de nascimento) para ter acesso aos meus prontuários médicos.

**Critérios de Aceitação:**

* Validar os dados de entrada no backend; retornar HTTP `400 Bad Request` em caso de formato inválido ou campo obrigatório ausente.
* Rejeitar e-mails já cadastrados no sistema (verificando tanto a base de pacientes quanto a de médicos), retornando HTTP `409 Conflict` com mensagem apropriada indicando duplicidade de e-mail.
* Rejeitar CPFs já existentes entre pacientes, retornando HTTP `409 Conflict` com mensagem apropriada indicando duplicidade de CPF.
* Aplicar hash na senha com bcrypt antes de salvar no banco de dados.
* Não retornar a senha ou o hash da senha (`passwordHash`) na resposta da API.
* Retornar HTTP `201 Created` com os dados do paciente (id, nome e e-mail) em caso de sucesso.
* O frontend deve manter o botão de cadastro desabilitado durante o envio da requisição.
* Exibir mensagem apropriada de sucesso após o cadastro.
* Exibir mensagem apropriada de erro de acordo com o retorno da API.

**Depende de:** Issue 0.1 (decisão de modelagem), Issue 0.2 (backend), Issue 0.5 (frontend).

---

### US 1.2: Cadastro de Médicos

**Descrição:** Como médico, quero me cadastrar na plataforma informando meus dados profissionais (nome, e-mail, senha, CRM e especialidade) para gerenciar os exames dos meus pacientes.

**Critérios de Aceitação:**

* Validar os dados de entrada no backend; retornar HTTP `400 Bad Request` em caso de formato inválido ou campo obrigatório ausente.
* Rejeitar e-mails já cadastrados no sistema (verificando tanto a base de médicos quanto a de pacientes), retornando HTTP `409 Conflict` com mensagem apropriada indicando duplicidade de e-mail.
* Rejeitar CRMs já existentes entre médicos, retornando HTTP `409 Conflict` com mensagem apropriada indicando duplicidade de CRM.
* Aplicar hash na senha com bcrypt antes de salvar no banco de dados.
* Não retornar a senha ou o hash da senha (`passwordHash`) na resposta da API.
* Retornar HTTP `201 Created` com os dados do médico (id, nome e e-mail) em caso de sucesso.
* O frontend deve manter o botão de cadastro desabilitado durante o envio da requisição.
* Exibir mensagem apropriada de sucesso após o cadastro.
* Exibir mensagem apropriada de erro de acordo com o retorno da API.

**Depende de:** Issue 0.1 (decisão de modelagem), Issue 0.3 (backend), Issue 0.6 (frontend).

---

### US 1.3: Login de Usuário

**Descrição:** Como usuário, quero fazer login com e-mail e senha para acessar o sistema de forma segura e ser direcionado ao meu perfil correspondente.

**Critérios de Aceitação:**

* Validar as credenciais comparando a senha informada com o hash armazenado no banco de dados via bcrypt.
* Retornar HTTP `200 OK` com um token JWT contendo o identificador e o tipo do usuário (`PACIENTE` ou `MEDICO`) em caso de autenticação bem-sucedida.
* A resposta da API deve incluir explicitamente o tipo do usuário junto com o token.
* O token JWT deve possuir tempo de expiração configurado para 24 horas no MVP.
* Requisições autenticadas utilizando token expirado devem retornar HTTP `401 Unauthorized`.
* Retornar HTTP `401 Unauthorized` para credenciais inválidas.
* O frontend deve armazenar o token e o tipo do usuário utilizando a estratégia adotada para o MVP (`localStorage`).
* O frontend deve redirecionar o paciente para `/paciente` e o médico para `/medico` após login bem-sucedido.
* Exibir mensagem apropriada de erro em caso de falha na autenticação.

**Observação Adicional:** Esta ação deve notificar o módulo de Auditoria para registrar os eventos `LOGIN_SUCCESS` ou `LOGIN_FAILURE`. A especificação detalhada desses eventos é responsabilidade do Épico de Auditoria.

**Depende de:** Issues 0.2 e 0.3 (backend), Issue 0.4 (identificação de tipo), Issue 0.7 (frontend).

---

### US 1.4: Controle de Acesso às Rotas Protegidas

**Descrição:** Como usuário da plataforma, quero que o sistema valide minhas permissões em rotas protegidas para garantir a privacidade dos meus dados médicos.

**Critérios de Aceitação:**

* Rejeitar requisições sem token JWT, com token inválido ou com token expirado, retornando HTTP `401 Unauthorized`.
* O backend deve utilizar um Guard para verificar o tipo do usuário presente no JWT e proteger rotas específicas por perfil.
* Rotas exclusivas para pacientes devem bloquear médicos, retornando HTTP `403 Forbidden` (e vice-versa).
* Garantir isolamento de dados: pacientes podem acessar apenas seus próprios exames e prontuários.
* Garantir isolamento de dados: médicos podem visualizar apenas pacientes vinculados a eles.
* Quebras de isolamento devem retornar HTTP `403 Forbidden`.

**Observação Adicional:** Tentativas de acesso não autorizado devem notificar o módulo de Auditoria para registrar o evento `ACCESS_DENIED`. A especificação detalhada desse evento é responsabilidade do Épico de Auditoria.

**Depende de:** Issue 0.4 (backend), dependências técnicas de infraestrutura configuradas para o ambiente de execução.

---

### US 1.5: Encerramento de Sessão (Logout)

**Descrição:** Como usuário, quero fazer logout para encerrar minha sessão e proteger meus dados em dispositivos compartilhados.

**Critérios de Aceitação:**

* Remover o token JWT e o tipo do usuário do armazenamento utilizado pelo frontend.
* Limpar o estado de autenticação da interface.
* Redirecionar o usuário imediatamente para a tela pública de login.

**Observação Adicional:** No escopo do MVP, o logout ocorre apenas no frontend, removendo as credenciais armazenadas localmente. O token não é invalidado no servidor devido à natureza stateless da autenticação JWT. Em versões futuras poderá ser avaliada a implementação de mecanismos de invalidação de tokens. Esta ação deve notificar o módulo de Auditoria para registrar o evento `LOGOUT`. A especificação detalhada desse evento é responsabilidade do Épico de Auditoria.

---

## Definição de Pronto (Definition of Done - DoD)

Para que qualquer User Story deste épico seja considerada finalizada e pronta para merge, ela deve obrigatoriamente cumprir os seguintes critérios:

### 1. Testes Automatizados

* **`users.service`**: testes unitários para geração de hash de senha e validação de duplicidade de usuários.
* **Cadastro de pacientes e médicos**: testes E2E validando cenários de sucesso (`201 Created`), duplicidade (`409 Conflict`) e dados inválidos (`400 Bad Request`).
* **`auth.service`**: testes unitários e E2E para login válido, login inválido e autenticação com token expirado.
* **Rotas protegidas**: testes E2E validando respostas HTTP `401 Unauthorized` e `403 Forbidden`.
* **Formulários de frontend (cadastro e login)**: testes de componente utilizando React Testing Library validando estados de erro, mensagens exibidas ao usuário e comportamento do botão durante o envio.