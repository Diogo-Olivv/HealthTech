# Padrões de Código

## Princípios gerais

- Código deve ser legível antes de tudo, abordagens mais complexas devem ter comentários explicando o que foi feito.
- Simplicidade >>> Complexidade.
- Toda alteração deve manter ou melhorar o do projeto.
- Em caso de remoção de código, justificar no relatório e commit.
- Nomes de variáveis, funções e arquivos devem ser claros e descritivos.

## Organização

- Separar responsabilidades por camada:
  - Backend: rotas, serviços, repositórios, middlewares
  - Frontend: páginas, componentes, serviços de API, estados
  - DevOps: scripts, manifests, pipelines, variáveis de ambiente
- Evitar arquivos muito grandes e funções longas.
- Priorizar modularidade, confeccionando funções e arquivos para reutilização de funcionalidades.

## Estilo

- Manter padrão único de indentação, nomenclatura e estrutura.
- Comentários devem explicar o que a seção faz, não repetir o que o código já mostra.

## Segurança

- Senhas implementadas sempre com hash, nunca salvo em string pura.
- Nunca salvar variáveis sensíveis no repositório.
- **Sempre** utilizar o .env para variáveis sensíveis (Colocar no .gitignore --> Nunca subir para o repositório).
- Validar entrada de dados no backend (Utilizar Postman/Insomnia ou similares).
- Garantir isolamento por usuário em todas as rotas protegidas (Testar manualmente).
- Logs nunca devem expor senha, token ou dados sensíveis.

## Testes

- Funcionalidades críticas devem ter testes.
- Fluxos mínimos que devem estar testáveis:
  - Cadastro e Login
  - Acesso a Rotas protegidas
- Correção de bug deve vir acompanhada de teste quando aplicável.

## Backend

- Controllers enxutos; regras de negócio em services.
- Acesso a banco centralizado.
- Tratar erros com padrão único de resposta (APIs REST).
- Validar autenticação e autorização em middleware.

## Frontend

- Componentes pequenos e reutilizáveis (Modularização).
- Estados e chamadas HTTP organizados fora da camada visual.
- Tratar loading, erro e sucesso explicitamente (Feedback pro suário).
- Nunca confiar apenas na validação do frontend (Checar os logs e verificar o fluxo completo com o backend).

## Logs e auditoria

- Todo evento auditável deve registrar:
  - timestamp (dd/mm/yyyy)
  - usuario
  - evento
  - status
- Padronizar nomes de eventos:
  - `LOGIN_SUCCESS`
  - `LOGIN_FAILURE`
  - `UPLOAD_SUCCESS`
  - `DOWNLOAD_SUCCESS`
  - `DELETE_SUCCESS`
  - `ACCESS_DENIED`

## Definição de Pronto

Uma tarefa só é considerada pronta quando:

- código funciona localmente
- passou por review de outro membro ou do líder técnico
- atende ao padrão de segurança definido anteriormente
- tem documentação atualizada
- não quebrou testes existentes
