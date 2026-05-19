# Exemplo de Relatório

## **Autor:** Diogo Oliveira

## **Período:** 04/05/2026 a 17/05/2026

## **O que foi entregue neste ciclo:**

- [#12](https://github.com/...) - Implementação da rota de autenticação de usuário e geração de token JWT.
- [#14](https://github.com/...) - Configuração do docker-compose e banco de dados para o ambiente de desenvolvimento.

## **Desafios Técnicos Enfrentados:**

- Padronização do ambiente local de desenvolvimento da equipe.

### **Metodologia STAR**

1. **S (Situação):** Durante a configuração inicial do backend, o ambiente local da equipe estava inconsistente. A conexão com o banco de dados funcionava corretamente na minha máquina, mas outros membros do grupo relataram falhas na inicialização e erros de permissão de pasta ao tentar rodar o banco localmente.
2. **T (Tarefa):** Como responsável pela estrutura base do backend neste ciclo, eu precisava garantir que o projeto rodasse de forma idêntica para todos os 4 integrantes da equipe, eliminando problemas relacionados ao sistema operacional antes de avançarmos com o desenvolvimento das rotas.
3. **A (Ação):** Estruturei a aplicação utilizando contêineres Docker para isolar dependências. Configurei o `docker-compose.yml` para orquestrar o banco de dados e a API simultaneamente. Adicionalmente, criei um script de configuração (`fix-perms.sh`) focado na correção de mapeamento de volumes para ambientes Ubuntu/Linux, resolvendo os conflitos de permissão que impediam a persistência dos dados nas máquinas da equipe.
4. **R (Resultado):** O tempo de setup do ambiente local foi reduzido para poucos minutos. Toda a equipe passou a iniciar o banco e a aplicação com um único comando, eliminando o problema de "na minha máquina funciona" e destravando as entregas do ciclo.

## **Dicas para o próximo que assumir este papel:**

- A rota de upload planejada para o próximo ciclo precisará lidar com arquivos maiores. O middleware atual precisa ser refatorado para aceitar multipart/form-data. Deixei um comentário "TODO" no controlador base.
- O script `fix-perms.sh` está na raiz do projeto. Se o próximo responsável pela infraestrutura precisar recriar os volumes do banco de dados e tiver problemas de permissão local, basta rodar o script antes de subir os contêineres novamente.
