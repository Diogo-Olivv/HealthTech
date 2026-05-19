# Rotatividade

## Como funciona

- A cada 2 semanas, cada integrante da equipe irá assumir um papel diferente, atuando em múltiplas frentes do projeto ao longo do desenvolvimento. Os cargos a sofrerem rotatividade serão os seguintes:

### Definição de Papéis

**1. Backend:** Responsável pela codificação do servidor e regras de negócio principais do sistema. Suas atribuições incluem a criação das rotas da API, a implementação da autenticação (geração e validação de JWT/sessões) e o gerenciamento da comunicação com o banco de dados. Deve garantir o isolamento correto dos dados entre os usuários, estruturar o recebimento dos arquivos (uploads) e assegurar a estabilidade do sistema através de testes unitários.

**2. Frontend:** Encarregado de desenvolver a interface com o qual o usuário final interage, transformando a documentação em componentes visuais funcionais. É responsável pela experiência de usuário (UX) do cliente final. Suas tarefas incluem testar a aplicação (como guardar o token de login), construir as telas requisitadas e realizar a integração correta com os endpoints fornecidos pelo Backend, tratando erros e tempos de carregamento.

**3. DevOps & Cloud:** Responsável pelo deploy da aplicaçao. Atua configurando e gerenciando os recursos no Google Cloud para manter a aplicação no ar. Esse papel garante o **CI/CD** (Continuous Integration / Continuous Deployment) da aplicação, validando se o código que roda corretamente em produção funciona da mesma forma ao enviar para a produção. Também gerencia as variáveis de ambiente, as permissões de acesso à nuvem e garante que a infraestrutura suporte as necessidades do sistema.

**4. Documentação & Logs :** Único papel duplo dessa metodologia. Como desenvolvedor, está responsável pela implementação da arquitetura de logs obrigatórios do sistema (registro de acessos, uploads, downloads e tentativas falhas). Como gestor, mantém a estrutura do MkDocs atualizada, facilita a organização do fluxo de trabalho e das reuniões da equipe.

## Justificativa

- A fase do projeto prática terá duração de 2 meses, possibilitando a implementação desse fluxo de trabalho. O Objetivo é que todos os integrantes atuem igualmente em todas as partes do projeto, garantindo melhor entedimento e alinhamento com a equipe. Além disso, promove experiência para os colaboradores de forma ampla, isso é minha prioridade como Líder pois reconheço que a maior parte dos integrantes tem pouca experiência em projetos práticos.
